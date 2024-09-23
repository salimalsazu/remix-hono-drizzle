import { db } from "../../../drizzle/db";
import { category } from "../../../drizzle/schema";
import { ICategory } from "./category.interface";

const addCategory = (data: ICategory) => {
  const result = db.insert(category).values(data).returning();

  if (!result) {
    throw new Error("Could not create category");
  }

  return result;
};

const getCategory = async () => {
  const allCategory = await db.query.category.findMany();

  return allCategory;
};

export const CategoryService = {
  addCategory,
  getCategory,
};
