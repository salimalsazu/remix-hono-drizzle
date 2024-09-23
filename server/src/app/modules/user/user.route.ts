import { Hono } from "hono";
import { userController } from "./user.controller";

const route = new Hono();

// Define the user routes
route.post("/", userController.addUser);
route.get("/", userController.getAllUsers);

export const UserRoutes = route;
