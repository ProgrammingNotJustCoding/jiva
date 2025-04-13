import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const approvalStatusEnum = pgEnum("approval_status", [
    "draft",
    "pending",
    "approved",
    "rejected",
    "archived",
]);

export const smpDocuments = pgTable("smp_documents", {
    id: serial("id").primaryKey(),
    version: integer("version").notNull(),
    title: text("title").notNull(),
    approvalDate: timestamp("approval_date").notNull(),
    approvalStatus: approvalStatusEnum("approval_status").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    documentS3Key: text("document_s3_key").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
    isDeleted: boolean("is_deleted").notNull().default(false),
})
