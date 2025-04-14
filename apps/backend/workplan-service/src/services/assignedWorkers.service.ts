import { eq } from "drizzle-orm";
import { db } from "../database/db.ts";
import { assignedWorkers } from "../database/schema/assignedWorkers.schema.ts";
import { workplanTasks } from "../database/schema/tasks.schema.ts";
import type { InsertAssignedWorker } from "../database/types.ts";

export const insertAssignedWorker = async (
  tx: any,
  assignedWorkerData: InsertAssignedWorker,
) => {
  const [newAssignedWorker] = await tx
    .insert(assignedWorkers)
    .values(assignedWorkerData)
    .returning();

  return newAssignedWorker;
};

export const getAssignedWorkersByWorkplanId = async (workplanId: number) => {
  const getWorkers = await db
    .select({
      id: assignedWorkers.id,
      workerId: assignedWorkers.workerId,
      workerName: assignedWorkers.workerName,
    })
    .from(workplanTasks)
    .leftJoin(assignedWorkers, eq(workplanTasks.id, assignedWorkers.taskId))
    .where(eq(workplanTasks.workplanId, workplanId));

  return getWorkers;
};
