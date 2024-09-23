import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import config from "../config";
import { schema } from "./schema";

const client = new Client({
  connectionString: config.database_url,
});

client.connect();
// Initialize the db with the schema
export const db = drizzle(client, { schema });
