import postgres from "postgres";
import { env } from "../config/env.ts";
import { drizzle } from "drizzle-orm/postgres-js";

const client = postgres(env.DB_URL);

export const db = drizzle(client);
