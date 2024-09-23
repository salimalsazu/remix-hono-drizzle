import { defineConfig } from "drizzle-kit";
import config from "./src/config";

export default defineConfig({
  schema: "./src/drizzle/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: config.database_url || "",
  },
});
