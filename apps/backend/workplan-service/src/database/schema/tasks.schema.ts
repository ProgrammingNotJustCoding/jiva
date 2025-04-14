import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { workplans } from "./workplans.schema.ts";

export const statusEnum = pgEnum("status", [
  "pending",
  "in_progress",
  "completed",
  "unfinished",
]);

export const workplanTasks = pgTable("workplan_tasks", {
  id: serial("id").primaryKey(),
  workplanId: integer("workplan_id")
    .notNull()
    .references(() => workplans.id),
  controlProcedureId: integer("control_procedure_id").notNull(),
  taskDescription: text("task_description").notNull(),
  status: statusEnum("status").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
  isDeleted: boolean("is_deleted").notNull().default(false),
});
