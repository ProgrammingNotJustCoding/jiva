import { eq } from "drizzle-orm";
import { db } from "../database/db.ts";
import { users } from "../database/schema/users.schema.ts";
import type { InsertUser } from "../database/types.ts";

export const insertUser = async(user: InsertUser) => {
    const [newUser] = await db.insert(users).values(user).returning();
 
    if (newUser) {
        return newUser;
    } else {
        throw new Error("Failed to insert user");
    }
}

export const getUserByCode = async(userCode: string) => {
    const [user] = await db.select().from(users).where(eq(users.userCode, userCode)).limit(1);

    if (user) {
        return user;
    } else {
        return null
    }
}

export const getUserById = async(id: number) => {
    const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return user || null;
}
