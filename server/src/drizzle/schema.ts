import {
  integer,
  numeric,
  pgTable,
  serial,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name"),
  phone: varchar("phone", { length: 256 }),
});

export const category = pgTable("category", {
  category_id: uuid("category_id").defaultRandom().primaryKey().unique(),
  name: text("name"),
  description: text("description"),
});

export const product = pgTable("product", {
  product_id: uuid("product_id").defaultRandom().primaryKey(),
  name: text("name").unique(),
  description: text("description"),
  rice: numeric("price"),
  category_id: uuid("category_id")
    .references(() => category.category_id)
    .notNull()
    .unique(),
});

export const schema = {
  users,
  category,
  product,
};
