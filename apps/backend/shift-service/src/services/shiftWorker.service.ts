import { eq } from "drizzle-orm";
import { db } from "../database/db.ts";
import { shiftWorkers } from "../database/schema/shiftWorkers.schema.ts";
import type { InsertShiftWorkers } from "../database/types.ts";
import { userDetails } from "../database/schema/details.schema.ts";

export const insertShiftWorker = async (
  tx: any,
  shiftId: number,
  supervisorId: number,
  workerId: number,
) => {
  try {
    const [newWorker] = await tx
      .insert(shiftWorkers)
      .values({
        supervisorId,
        shiftId,
        workerId,
      })
      .returning();
    if (!newWorker) {
      throw new Error("Failed to insert shift worker");
    }

    return newWorker;
  } catch (e) {
    throw new Error(`Failed to insert shift worker: ${e}`);
  }
};

export const getWorkersByShiftId = async (shiftId: number) => {
  const workers = await db
    .select({
      id: shiftWorkers.id,
      shiftId: shiftWorkers.shiftId,
      workerId: shiftWorkers.workerId,
      supervisorId: shiftWorkers.supervisorId,
      firstName: userDetails.firstName,
      lastName: userDetails.lastName,
      phoneNumber: userDetails.phoneNumber,
      designation: userDetails.designation,
    })
    .from(shiftWorkers)
    .leftJoin(userDetails, eq(shiftWorkers.workerId, userDetails.userId))
    .where(eq(shiftWorkers.shiftId, shiftId));

  return workers.map((worker) => ({
    id: worker.id,
    shiftId: worker.shiftId,
    workerId: worker.workerId,
    supervisorId: worker.supervisorId,
    worker: {
      id: worker.workerId,
      firstName: worker.firstName,
      lastName: worker.lastName,
      phoneNumber: worker.phoneNumber,
      designation: worker.designation,
    },
  }));
};
