import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { shifts } from "./shifts.schema.ts";
import { userDetails } from "./details.schema.ts";

export const categoryEnum = pgEnum("category", [
  "operation",
  "equipment",
  "safety",
  "instruction",
  "personnel",
  "environment",
  "other",
]);

export const shiftLogs = pgTable("shift_logs", {
  id: serial("id").primaryKey(),
  shiftId: integer("shift_id")
    .notNull()
    .references(() => shifts.id),
  workerId: integer("worker_id")
    .notNull()
    .references(() => userDetails.id),
  category: categoryEnum("category").notNull(),
  details: text("details").notNull(),
  relatedEquipment: text("related_equipment"),
  location: text("location"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
  isDeleted: boolean("is_deleted").notNull().default(false),
});
