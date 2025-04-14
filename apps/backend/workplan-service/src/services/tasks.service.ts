import { and, eq } from "drizzle-orm";
import { db } from "../database/db.ts";
import { assignedWorkers } from "../database/schema/assignedWorkers.schema.ts";
import { workplanTasks } from "../database/schema/tasks.schema.ts";
import type { InsertTask } from "../database/types.ts";

export const insertWorkplanTask = async (
  tx: any,
  workplanTaskData: InsertTask,
) => {
  const [newTask] = await tx
    .insert(workplanTasks)
    .values(workplanTaskData)
    .returning();

  return newTask;
};

export const getTasksByWorkerId = async (workerId: number) => {
  const tasks = await db
    .select({
      workplanId: workplanTasks.workplanId,
      taskDescription: workplanTasks.taskDescription,
      status: workplanTasks.status,
    })
    .from(workplanTasks)
    .leftJoin(assignedWorkers, eq(assignedWorkers.taskId, workplanTasks.id))
    .where(eq(assignedWorkers.workerId, workerId));

  return tasks;
};

export const getIncompleteTasksByWorkplanId = async (workplanId: number) => {
  const tasks = await db
    .select({
      workplanId: workplanTasks.workplanId,
      taskDescription: workplanTasks.taskDescription,
      status: workplanTasks.status,
    })
    .from(workplanTasks)
    .where(
      and(
        eq(workplanTasks.workplanId, workplanId),
        eq(workplanTasks.status, "unfinished"),
      ),
    );

  return tasks;
};
