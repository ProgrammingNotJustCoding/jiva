import { desc, eq } from "drizzle-orm";
import { db } from "../database/db.ts";
import { shifts } from "../database/schema/shifts.schema.ts";
import type { InsertShift, InsertShiftWorkers } from "../database/types.ts";
import {
  getWorkersByShiftId,
  insertShiftWorker,
} from "./shiftWorker.service.ts";
import { userDetails } from "../database/schema/details.schema.ts";

export const insertShift = async (tx: any, shift: InsertShift) => {
  const [newShift] = await tx.insert(shifts).values(shift).returning();

  if (!newShift) {
    console.error(`Failed to insert shift: ${shift}`);
    throw new Error("Failed to insert shift");
  }

  return newShift;
};

export const insertShiftData = async (
  shift: InsertShift,
  workers: Array<{ id: number }>,
) => {
  const newShiftData = await db.transaction(async (tx) => {
    try {
      const newShift = await insertShift(tx, shift);
      const shiftWorkers = [];
      for (const worker of workers) {
        await insertShiftWorker(
          tx,
          newShift.id,
          newShift.supervisorId,
          worker.id,
        );
        shiftWorkers.push(worker.id);
      }
    } catch (e) {
      console.error("Transaction failed:", e);
      throw new Error(`Failed to insert shift data: ${e}`);
    }
  });

  return newShiftData;
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

export const getCurrentShiftBySupervisor = async (supervisorId: number) => {
  const [currentShift] = await db
    .select({
      id: shifts.id,
      supervisorId: shifts.supervisorId,
      nextSupervisorId: shifts.nextSupervisorId,
      startTime: shifts.startTime,
      endTime: shifts.endTime,
      status: shifts.status,
      finalizedAt: shifts.finalizedAt,
      acknowledgedAt: shifts.acknowledgedAt,
      supervisorFirstName: userDetails.firstName,
      supervisorLastName: userDetails.lastName,
      supervisorPhoneNumber: userDetails.phoneNumber,
      supervisorDesignation: userDetails.designation,
    })
    .from(shifts)
    .leftJoin(userDetails, eq(shifts.supervisorId, userDetails.userId))
    .where(eq(shifts.supervisorId, supervisorId))
    .limit(1)
    .orderBy(desc(shifts.createdAt));

  let nextSupervisorDetails = null;
  if (currentShift && currentShift.nextSupervisorId) {
    [nextSupervisorDetails] = await db
      .select({
        id: userDetails.userId,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        phoneNumber: userDetails.phoneNumber,
        designation: userDetails.designation,
      })
      .from(userDetails)
      .where(eq(userDetails.userId, currentShift.nextSupervisorId));
  }

  const workers = await getWorkersByShiftId(currentShift.id);

  return {
    id: currentShift.id,
    supervisorId: currentShift.supervisorId,
    supervisor: {
      id: currentShift.supervisorId,
      firstName: currentShift.supervisorFirstName,
      lastName: currentShift.supervisorLastName,
      phoneNumber: currentShift.supervisorPhoneNumber,
      designation: currentShift.supervisorDesignation,
    },
    nextSupervisorId: currentShift.nextSupervisorId,
    nextSupervisor: nextSupervisorDetails,
    startTime: currentShift.startTime,
    endTime: currentShift.endTime,
    status: currentShift.status,
    finalizedAt: currentShift.finalizedAt,
    acknowledgedAt: currentShift.acknowledgedAt,
    workers: workers,
  };
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
    .set({ deletedAt: new Date(), isDeleted: true })
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
