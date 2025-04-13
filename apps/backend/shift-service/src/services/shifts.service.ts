import { eq } from "drizzle-orm";
import { db } from "../database/db.ts";
import { shifts } from "../database/schema/shifts.schema.ts";
import type { InsertShift } from "../database/types.ts";

export const insertShift = async (shift: InsertShift) => {
  const [newShift] = await db.insert(shifts).values(shift).returning();

  if (!newShift) {
    throw new Error("Failed to insert shift");
  }

  return newShift;
};

export const getShiftsBySupervisor = async (
  supervisorId: number,
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;
  const getShifts = await db
    .select()
    .from(shifts)
    .where(eq(shifts.supervisorId, supervisorId))
    .limit(limit)
    .offset(offset);

  return getShifts;
};

export const getCurrentShift = async (supervisorId: number) => {
  const [getCurrentShift] = await db
    .select()
    .from(shifts)
    .where(eq(shifts.supervisorId, supervisorId))
    .limit(1);

  return getCurrentShift;
};

export const updateShift = async (
  shiftId: number,
  updatedShift: Partial<InsertShift>,
) => {
  updatedShift = {
    ...updatedShift,
    updatedAt: new Date(),
  };

  const [updatedShiftData] = await db
    .update(shifts)
    .set(updatedShift)
    .where(eq(shifts.id, shiftId))
    .returning();

  if (!updatedShiftData) {
    throw new Error("Failed to update shift");
  }

  return updatedShiftData;
};

export const softDeleteShift = async (shiftId: number) => {
  const [deletedShift] = await db
    .update(shifts)
    .set({ deletedAt: new Date() })
    .where(eq(shifts.id, shiftId))
    .returning();

  if (!deletedShift) {
    throw new Error("Failed to delete shift");
  }

  return deletedShift;
};

export const deleteShift = async (shiftId: number) => {
  const [deletedShift] = await db
    .delete(shifts)
    .where(eq(shifts.id, shiftId))
    .returning();

  if (!deletedShift) {
    throw new Error("Failed to delete shift");
  }

  return deletedShift;
};
