import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { users } from "./schema/users.schema.ts";

export type User = InferSelectModel<typeof users>
export type InsertUser = InferInsertModel<typeof users>
