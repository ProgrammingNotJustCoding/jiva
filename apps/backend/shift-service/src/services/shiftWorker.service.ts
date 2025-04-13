import { eq } from "drizzle-orm";
import { db } from "../database/db.ts";
import { shiftWorkers } from "../database/schema/shiftWorkers.schema.ts";
import type { InsertShiftWorkers } from "../database/types.ts";

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
      supervisorId: shiftWorkers.supervisorId,
      shiftId: shiftWorkers.shiftId,
      workerId: shiftWorkers.workerId,
    })
    .from(shiftWorkers)
    .where(eq(shiftWorkers.shiftId, shiftId));

  return workers;
};
