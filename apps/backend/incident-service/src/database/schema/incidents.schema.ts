import {
  boolean,
  integer,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const reportTypeEnum = pgEnum("report_type", [
  "hazard",
  "near_miss",
  "accident",
  "environmental",
  "other",
]);

export const severityEnum = pgEnum("severity", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const statusEnum = pgEnum("status", [
  "reported",
  "acknowledged",
  "investigating",
  "pending_actions",
  "closed",
  "cancelled",
]);

export const incidents = pgTable("incidents", {
  id: serial("id").primaryKey(),
  shiftId: integer("shift_id").notNull(),
  reportType: reportTypeEnum("report_type").notNull(),
  reporttedByUserId: integer("reported_by_user_id").notNull(),
  locationDescription: text("location_description").notNull(),
  gpsLatitude: numeric("gps_latitude").notNull(),
  gpsLongitude: numeric("gps_longitude").notNull(),
  description: text("description").notNull(),
  initialSeverity: severityEnum("initial_severity").notNull(),
  status: statusEnum("status").notNull(),
  rootCause: text("root_cause").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  deletedAt: timestamp("deleted_at"),
  isDeleted: boolean("is_deleted").notNull().default(false),
});
