import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { shifts } from "./shifts.schema.ts";

export const shiftWorkers = pgTable("shift_workers", {
  id: serial("id").primaryKey(),
  supervisorId: integer("supervisor_id").notNull(),
  workerId: integer("worker_id").notNull(),
  shiftId: integer("shift_id")
    .notNull()
    .references(() => shifts.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
  isDeleted: boolean("is_deleted").notNull().default(false),
});
