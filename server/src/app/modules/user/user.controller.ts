import httpStatus from "http-status";
import { Context } from "hono";
import { userService } from "./user.service";

const addUser = async (c: Context) => {
  try {
    const { fullName, phone } = await c.req.json();

    const newUser = await userService.addUser({ fullName, phone });

    return c.json(newUser, httpStatus.CREATED); // Send response with status 201
  } catch (error) {
    return c.json(
      //@ts-ignore
      { message: "Error creating user", error: error.message },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const getAllUsers = async (c: Context) => {
  try {
    const allUsers = await userService.getAllUsers();
    return c.json(allUsers, httpStatus.OK);
  } catch (error) {
    return c.json(
      //@ts-ignore
      { message: "Error fetching users", error: error.message },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const userController = {
  addUser,
  getAllUsers,
};
