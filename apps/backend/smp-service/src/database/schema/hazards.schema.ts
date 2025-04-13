import { boolean, integer, numeric, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { smpDocuments } from "./documents.schema.ts";

export const categoryEnum = pgEnum("category", [
    "mining",
    "electricity",
    "machinery",
    "rr_siding",  
])

export const hazards = pgTable("hazards", {
    id: serial("id").primaryKey(),
    smpDocumentId: integer("document_id").notNull().references(() => smpDocuments.id),
    category: categoryEnum("category").notNull(),
    description: text("description").notNull(),
    riskCons: numeric("risk_cons").notNull(),
    riskExposure: numeric("risk_exposure").notNull(),
    riskProb: numeric("risk_prob").notNull(),
    riskRating: numeric("risk_rating").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
    isDeleted: boolean("is_deleted").notNull().default(false),
})
