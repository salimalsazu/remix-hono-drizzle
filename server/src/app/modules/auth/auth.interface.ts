import { UserRoles } from '@prisma/client';
export type IUserCreate = {
  firstName: string;
  lastName: string;
  profileImage?: string | null | undefined;
  email: string;
  password: string;
  role?: UserRoles;
};

export type IUserProfileResponse = {
  profileId: string;
  firstName: string;
  lastName: string;
  jobId: string;
  profileImage?: string | null | undefined;
  role: UserRoles | null;
  createdAt: Date;
  updatedAt: Date;
};

export type IUserResponse = {
  userId: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  profile: IUserProfileResponse;
};

export type IUserLogin = {
  email: string;
  password: string;
};
export type ILoginUserResponse = {
  accessToken: string;
  refreshToken: string;
};
export type IRefreshTokenResponse = {
  accessToken: string;
};
