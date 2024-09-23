import { db } from "../../../drizzle/db";
import { users } from "../../../drizzle/schema";

const addUser = async (data: { fullName: string; phone: string }) => {
  const [user] = await db.insert(users).values(data).returning();
  if (!user) {
    throw new Error("Could not create user");
  }

  return user;
};

const getAllUsers = async () => {
  const allUsers = await db.select().from(users).execute();
  return allUsers;
};

export const userService = {
  addUser,
  getAllUsers,
};
