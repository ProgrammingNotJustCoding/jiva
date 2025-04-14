import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { incidents } from "./incidents.schema.ts";

export const incidentAttachments = pgTable("incident_attachments", {
  id: serial("id").primaryKey(),
  incidentId: integer("incident_id")
    .notNull()
    .references(() => incidents.id),
  fileName: text("file_name").notNull(),
  storagePath: text("storage_path").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
  isDeleted: boolean("is_deleted").notNull().default(false),
});
