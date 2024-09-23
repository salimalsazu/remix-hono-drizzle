import { Context } from "hono";
import { CategoryService } from "./category.service";
import httpStatus from "http-status";

const addCategory = async (c: Context) => {
  try {
    const { name, description } = await c.req.json();

    const newCategory = await CategoryService.addCategory({
      name,
      description,
    });

    return c.json(newCategory, httpStatus.CREATED);
  } catch (error) {
    return c.json(
      //@ts-ignore
      { message: "Error creating category", error: error.message },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

const getCategory = async (c: Context) => {
  try {
    const allCategory = await CategoryService.getCategory();
    return c.json(allCategory, httpStatus.OK);
  } catch (error) {
    return c.json(
      //@ts-ignore
      { message: "Error fetching category", error: error.message },
      httpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const CategoryController = {
  addCategory,
  getCategory,
};
