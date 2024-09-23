import { PgTable } from "drizzle-orm/pg-core";
import { db } from "../../../drizzle/db";
import { category, product } from "./../../../drizzle/schema";
import { IProduct } from "./product.interface";

const addProduct = async (data: IProduct) => {
  const findCategory = await db.query.category.findFirst({
    where: {
      // @ts-ignore
      category_id: data.category_id as any,
    },
  });

  if (!findCategory) {
    throw new Error("Category not found");
  }

  const productObj = {
    name: data.name,
    price: data.price,
    description: data.description,
    category_id: findCategory.category_id,
  };

  const newProduct = await db.insert(product).values(productObj).returning();

  if (!newProduct) {
    throw new Error("Product not created");
  }

  return newProduct;
};

export const ProductService = {
  addProduct,
};
