import { and, eq } from "drizzle-orm";
import { db } from "../database/db.ts";
import { shiftLogs } from "../database/schema/logs.schema.ts";
import type { InsertLogs } from "../database/types.ts";
import { userDetails } from "../database/schema/details.schema.ts";

export const insertShiftLog = async (shiftLog: InsertLogs) => {
  const [newShiftLog] = await db.insert(shiftLogs).values(shiftLog).returning();

  if (!newShiftLog) {
    throw new Error("Failed to insert shift log");
  }

  return newShiftLog;
};

export const getLogsByShiftId = async (
  shiftId: number,
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;

  const logs = await db
    .select({
      id: shiftLogs.id,
      shiftId: shiftLogs.shiftId,
      workerId: shiftLogs.workerId,
      category: shiftLogs.category,
      details: shiftLogs.details,
      relatedEquipment: shiftLogs.relatedEquipment,
      location: shiftLogs.location,
      createdAt: shiftLogs.createdAt,
      updatedAt: shiftLogs.updatedAt,
      deletedAt: shiftLogs.deletedAt,
      isDeleted: shiftLogs.isDeleted,
      workerName: {
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
      },
      workerDesignation: userDetails.designation,
    })
    .from(shiftLogs)
    .innerJoin(userDetails, eq(shiftLogs.workerId, userDetails.userId))
    .where(eq(shiftLogs.shiftId, shiftId))
    .offset(offset)
    .limit(limit);

  return logs;
};

export const getLogsByShiftAndWorkerId = async (
  shiftId: number,
  workerId: number,
) => {
  const logs = await db
    .select()
    .from(shiftLogs)
    .where(
      and(eq(shiftLogs.shiftId, shiftId), eq(shiftLogs.workerId, workerId)),
    );

  return logs;
};

export const updateShiftLog = async (
  shiftLogId: number,
  shiftLog: Partial<InsertLogs>,
) => {
  shiftLog = {
    ...shiftLog,
    updatedAt: new Date(),
  };
  const [updatedShiftLog] = await db
    .update(shiftLogs)
    .set(shiftLog)
    .where(eq(shiftLogs.id, shiftLogId))
    .returning();

  if (!updatedShiftLog) {
    throw new Error("Failed to update shift log");
  }

  return updatedShiftLog;
};

export const softDeleteShiftLog = async (shiftLogId: number) => {
  const [deletedShiftLog] = await db
    .update(shiftLogs)
    .set({ deletedAt: new Date() })
    .where(eq(shiftLogs.id, shiftLogId))
    .returning();

  if (!deletedShiftLog) {
    throw new Error("Failed to soft delete shift log");
  }

  return deletedShiftLog;
};

export const hardDeleteShiftLog = async (shiftLogId: number) => {
  const [deletedShiftLog] = await db
    .delete(shiftLogs)
    .where(eq(shiftLogs.id, shiftLogId))
    .returning();

  if (!deletedShiftLog) {
    throw new Error("Failed to hard delete shift log");
  }

  return deletedShiftLog;
};
