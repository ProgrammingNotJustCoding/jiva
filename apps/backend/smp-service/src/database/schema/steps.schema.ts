import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { controlPlan } from "./control.schema.ts";

export const controlProcedure = pgTable("control_procedure", {
    id: serial("id").primaryKey(),
    controlPlanId: integer("control_plan_id").notNull().references(() => controlPlan.id),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
    isDeleted: boolean("is_deleted").notNull().default(false),
})
