import { Hono } from "hono";
import { UserRoutes } from "../modules/user/user.route";
import { CategoryRoutes } from "../modules/category/category.route";

const routes = new Hono();

// Register user routes directly
routes.route("/users", UserRoutes);
routes.route("/category", CategoryRoutes);

export default routes;
