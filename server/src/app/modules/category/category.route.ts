import { Hono } from "hono";
import { CategoryController } from "./category.controller";

const route = new Hono();

// Define the category routes
route.post("/", CategoryController.addCategory);

route.get("/", CategoryController.getCategory);

export const CategoryRoutes = route;
