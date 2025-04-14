import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "../config/env.ts";

const client = postgres(env.DB_URL);

export const db = drizzle(client);
