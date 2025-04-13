import { boolean, integer, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { hazards } from "./hazards.schema.ts";

export const erciEnum = pgEnum("erci", [
    "low",
    "medium",
    "high"
])

export const controlPlan = pgTable("control_plan", {
    id: serial("id").primaryKey(),
    hazardId: integer("hazard_id").notNull().references(() => hazards.id),
    erci: erciEnum("erci").notNull(),
    personRes: text("person_res").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
    isDeleted: boolean("is_deleted").notNull().default(false),
})
