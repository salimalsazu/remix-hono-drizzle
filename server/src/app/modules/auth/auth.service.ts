import bcrypt from 'bcrypt';
import { Request } from 'express';
import httpStatus from 'http-status';
import { Secret } from 'jsonwebtoken';
import config from '../../../config';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import prisma from '../../../shared/prisma';
import { ILoginUserResponse, IRefreshTokenResponse, IUserCreate, IUserLogin } from './auth.interface';
import { UserStatus } from '@prisma/client';
import { logger } from '../../../shared/logger';
import { log } from 'winston';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';

const mailerSend = new MailerSend({
  apiKey: 'mlsn.7fee45f24cb2c27d115c9e058c36cb43805694a24d40e5318251ea46b315bd65',
});

const createNewUser = async (req: Request) => {
  const data = req.body as IUserCreate;

  const { password, email } = data;

  if (!password) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Password is required');
  }

  const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_rounds));

  // transaction start
  const newUser = await prisma.$transaction(async transactionClient => {
    const isUserExist = await transactionClient.user.findFirst({
      where: { email },
    });

    if (isUserExist) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email is already in use');
    }

    const profileData = {
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role,
    };

    const createdProfile = await transactionClient.profile.create({
      data: {
        ...profileData,
      },
      select: {
        profileId: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!createdProfile) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Profile creation failed');
    }

    const createdUser = await transactionClient.user.create({
      data: {
        email,
        password: hashedPassword,
        profile: {
          connect: {
            profileId: createdProfile.profileId,
          },
        },
      },
      select: {
        userId: true,
        email: true,
        createdAt: true,
        userStatus: true,
        profile: true,
      },
    });

    if (!createdUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User creation failed');
    }

    logger.info(`User created successfully with ID: ${createdUser.userId}`);

    return createdUser;
  });

  return newUser;
};

//login
const userLogin = async (loginData: IUserLogin): Promise<ILoginUserResponse> => {
  const { email, password } = loginData;

  if (!email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email is required !!');
  }

  const isUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
    include: {
      profile: {
        select: {
          profileId: true,
          role: true,
          jobId: true,
          profileImage: true,
          firstName: true,
          lastName: true,
          isMeal: true,
        },
      },
    },
  });

  if (!isUserExist) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'User not found !!');
  }

  const isPasswordValid = await bcrypt.compare(password, isUserExist?.password);

  if (isUserExist && !isPasswordValid) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect !!');
  }

  if (isUserExist.userStatus === UserStatus.Pending && isUserExist.profile?.role !== 'SUPERADMIN') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Pending ! Account is not verified Yet');
  }

  if (isUserExist.userStatus === UserStatus.Paused && isUserExist.profile?.role !== 'SUPERADMIN') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Paused ! Account is not verified Yet');
  }

  if (isUserExist.userStatus === UserStatus.Suspended && isUserExist.profile?.role !== 'SUPERADMIN') {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Your Account is Suspended');
  }

  const { userId, profile, email: loggedInEmail } = isUserExist;

  // create access token & refresh token
  const accessToken = jwtHelpers.createToken(
    {
      userId,
      role: profile?.role,
      profileId: profile?.profileId,
      email: loggedInEmail,
      jobId: profile?.jobId,
      profileImage: profile?.profileImage,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      isMeal: profile?.isMeal,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  logger.info(`User logged in successfully with: ${email}`);

  const refreshToken = jwtHelpers.createToken(
    {
      userId: isUserExist.userId,
      role: profile?.role,
      profileId: profile?.profileId,
      email: loggedInEmail,
      jobId: profile?.jobId,
      profileImage: profile?.profileImage,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
      isMeal: profile?.isMeal,
    },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );

  // Send email notification after successful login....... 
  try {
    const sentFrom = new Sender('support@codequivers.com', 'Support Team');
    const recipients = [new Recipient(isUserExist.email, isUserExist.profile?.firstName || 'User')];

    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject('Login Notification')
      .setHtml(`<strong>Dear ${isUserExist.profile?.firstName},</strong><br><br>You have successfully logged in.`)
      .setText(`Dear ${isUserExist.profile?.firstName}, You have successfully logged in.`);

    const result= await mailerSend.email.send(emailParams);
    console.log("Mail Send", result);
  } catch (error) {
    //@ts-ignore
    logger.error(`Failed to send login email to ${isUserExist.email}: ${error.message}`);
  }

  return {
    accessToken,
    refreshToken,
  };
};

// !refreshToken --------------------------------
const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  // ! verify token
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(token, config.jwt.refresh_secret as Secret);
  } catch (error) {
    // err
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }
  //! if user not exist
  // !checking deleted user's refresh token
  const { userId } = verifiedToken;

  const isUserExist = await prisma.user.findFirst({
    where: {
      userId,
    },
    include: {
      profile: {
        select: {
          role: true,
          profileId: true,
          profileImage: true,
          firstName: true,
          lastName: true,
        },
      },
    },
  });
  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exists!!');
  }
  // generate new token
  const newAccessToken = jwtHelpers.createToken(
    {
      userId: isUserExist?.userId,
      role: isUserExist?.profile?.role,
      profileId: isUserExist?.profile?.profileId,
      email: isUserExist?.email,
      profileImage: isUserExist?.profile?.profileImage,
      firstName: isUserExist?.profile?.firstName,
      lastName: isUserExist?.profile?.lastName,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthService = {
  createNewUser,
  userLogin,
  refreshToken,
};
