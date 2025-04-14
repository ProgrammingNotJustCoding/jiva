import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { workplanTasks } from "./tasks.schema.ts";

export const assignedWorkers = pgTable("assigned_workers", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id")
    .notNull()
    .references(() => workplanTasks.id),
  workerId: integer("worker_id").notNull(),
  workerName: text("worker_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  isDeleted: boolean("is_deleted").default(false).notNull(),
});
