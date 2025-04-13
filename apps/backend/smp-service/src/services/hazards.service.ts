import { and, eq } from "drizzle-orm";
import { db } from "../database/db.ts";
import { hazards } from "../database/schema/hazards.schema.ts";
import type { InsertHazard } from "../database/types.ts";

export const insertHazard = async (hazard: InsertHazard) => {
  const [newHazard] = await db.insert(hazards).values(hazard).returning();

  if (!newHazard) {
    throw new Error("Failed to insert hazard");
  }

  return newHazard;
};

export const getHazardsByCategory = async (
  category: "mining" | "electricity" | "machinery" | "rr_siding",
  smpDocumentId: number,
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;

  const getHazards = await db
    .select()
    .from(hazards)
    .where(
      and(
        eq(hazards.category, category),
        eq(hazards.smpDocumentId, smpDocumentId),
      ),
    )
    .limit(limit)
    .offset(offset);

  return getHazards;
};

export const updateHazard = async (
  id: number,
  hazard: Partial<InsertHazard>,
) => {
  hazard = {
    ...hazard,
    updatedAt: new Date(),
  };

  const [updatedHazard] = await db
    .update(hazards)
    .set(hazard)
    .where(eq(hazards.id, id))
    .returning();

  if (!updatedHazard) {
    throw new Error("Failed to update hazard");
  }

  return updatedHazard;
};

export const softDeleteHazard = async (id: number) => {
  const [deletedHazard] = await db
    .update(hazards)
    .set({ deletedAt: new Date(), isDeleted: true })
    .where(eq(hazards.id, id))
    .returning();

  if (!deletedHazard) {
    throw new Error("Failed to soft delete hazard");
  }

  return deletedHazard;
};

export const deleteHazard = async (id: number) => {
  const [deletedHazard] = await db
    .delete(hazards)
    .where(eq(hazards.id, id))
    .returning();

  if (!deletedHazard) {
    throw new Error("Failed to delete hazard");
  }

  return deletedHazard;
};
