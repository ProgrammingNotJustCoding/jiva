import { boolean, pgEnum, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const userRoles = pgEnum("user_roles", ["admin", "supervisor", "worker"]);

export const users = pgTable("users", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    role: userRoles("role").notNull(),
    userCode: text("user_code").unique().notNull(),
    passwordHash: text("password_hash").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
    isDeleted: boolean("is_deleted").default(false).notNull(),
})
