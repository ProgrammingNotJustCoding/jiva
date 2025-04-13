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
};

export const getWorkersByShiftId = async (shiftId: number) => {
  const workers = await db
    .select()
    .from(shiftWorkers)
    .where(eq(shiftWorkers.shiftId, shiftId));

  return workers;
};
