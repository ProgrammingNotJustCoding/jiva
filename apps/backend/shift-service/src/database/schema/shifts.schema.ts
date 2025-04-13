import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  timestamp,
} from "drizzle-orm/pg-core";
import { userDetails } from "./details.schema.ts";

export const statusEnum = pgEnum("status", [
  "to_begin",
  "ongoing",
  "ready_for_handover",
  "handed_over",
  "acknowledged",
]);

export const shifts = pgTable("shifts", {
  id: serial("id").primaryKey(),
  supervisorId: integer("supervisor_id")
    .notNull()
    .references(() => userDetails.id),
  nextSupervisorId: integer("next_supervisor_id").references(
    () => userDetails.id,
  ),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time"),
  status: statusEnum("status").notNull(),
  finalizedAt: timestamp("finalized_at"),
  acknowledgedAt: timestamp("acknowledged_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
  isDeleted: boolean("is_deleted").default(false),
});
