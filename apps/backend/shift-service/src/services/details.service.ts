import { eq } from "drizzle-orm";
import { db } from "../database/db.ts";
import { userDetails } from "../database/schema/details.schema.ts";
import type { InsertUserDetails } from "../database/types.ts";

export const insertUserDetails = async (userDetailsData: InsertUserDetails) => {
  const [newUserDetails] = await db
    .insert(userDetails)
    .values(userDetailsData)
    .returning();

  if (!newUserDetails) {
    throw new Error("Failed to insert user details");
  }

  return newUserDetails;
};

export const getUserDetailsById = async (userId: number) => {
  const [fetchUserDetails] = await db
    .select()
    .from(userDetails)
    .where(eq(userDetails.id, userId));

  if (!fetchUserDetails) {
    throw new Error("Failed to fetch user details");
  }

  return fetchUserDetails;
};

export const updateUserDetails = async (
  userId: number,
  userDetailsData: Partial<InsertUserDetails>,
) => {
  userDetailsData = {
    ...userDetailsData,
    updatedAt: new Date(),
  };

  const [updatedUserDetails] = await db
    .update(userDetails)
    .set(userDetailsData)
    .where(eq(userDetails.id, userId))
    .returning();

  if (!updatedUserDetails) {
    throw new Error("Failed to update user details");
  }

  return updatedUserDetails;
};

export const softDeleteUserDetails = async (userId: number) => {
  const [deletedUserDetails] = await db
    .update(userDetails)
    .set({ deletedAt: new Date(), isDeleted: true })
    .where(eq(userDetails.id, userId))
    .returning();

  if (!deletedUserDetails) {
    throw new Error("Failed to soft delete user details");
  }

  return deletedUserDetails;
};

export const hardDeleteUserDetails = async (userId: number) => {
  const [deletedUserDetails] = await db
    .delete(userDetails)
    .where(eq(userDetails.id, userId))
    .returning();

  if (!deletedUserDetails) {
    throw new Error("Failed to delete user details");
  }

  return deletedUserDetails;
};
