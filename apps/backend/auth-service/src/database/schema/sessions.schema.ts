import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const sessions = pgTable("sessions", {
    id: serial("id").primaryKey(),
    userId: integer("user_id").notNull(),
    sessionToken: text("session_token").notNull(),
    expires: text("expires").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
    isDeleted: boolean("is_deleted").default(false).notNull(),
})
