import { eq } from "drizzle-orm";
import { db } from "../database/db.ts";
import { workplanTasks } from "../database/schema/tasks.schema.ts";
import { workplans } from "../database/schema/workplans.schema.ts";
import type {
  InsertAssignedWorker,
  InsertTask,
  InsertWorkplan,
  Tasks,
  Workplans,
} from "../database/types.ts";
import { insertAssignedWorker } from "./assignedWorkers.service.ts";
import { insertWorkplanTask } from "./tasks.service.ts";
import { assignedWorkers } from "../database/schema/assignedWorkers.schema.ts";

export const insertWorkplan = async (tx: any, workplanData: InsertWorkplan) => {
  const [newWorkplan] = await tx
    .insert(workplans)
    .values(workplanData)
    .returning();

  if (!newWorkplan) {
    throw new Error("Failed to insert workplan");
  }

  return newWorkplan;
};

export const createWorkplan = async (
  workPlanData: InsertWorkplan,
  controlProcedures: Array<{
    id: number;
    taskDescription: string;
    workers: Array<{ id: number; name: string }>;
  }>,
) => {
  const initiateWorkplan = await db.transaction(async (tx) => {
    try {
      const newWorkplan: Workplans = await insertWorkplan(tx, workPlanData);

      for (const controlProcedure of controlProcedures) {
        const taskData: InsertTask = {
          workplanId: newWorkplan.id,
          controlProcedureId: controlProcedure.id,
          taskDescription: controlProcedure.taskDescription,
          status: "pending",
        };

        const newTask: Tasks = await insertWorkplanTask(tx, taskData);

        for (const worker of controlProcedure.workers) {
          const workerData: InsertAssignedWorker = {
            taskId: newTask.id,
            workerId: worker.id,
            workerName: worker.name,
          };
          await insertAssignedWorker(tx, workerData);
        }
      }
    } catch (e) {
      throw new Error(`Failed to create workplan: ${e}`);
    }
  });

  return initiateWorkplan;
};

export const getWorkplanByIncidentId = async (incidentId: number) => {
  const workplan = await db.transaction(async (tx) => {
    const [workplanFetched] = await tx
      .select()
      .from(workplans)
      .where(eq(workplans.incidentId, incidentId));

    const tasks: any[] = await tx
      .select({
        id: workplanTasks.id,
        status: workplanTasks.status,
      })
      .from(workplanTasks)
      .where(eq(workplanTasks.workplanId, workplanFetched.id));

    for (const task of tasks) {
      const workers = await tx
        .select()
        .from(assignedWorkers)
        .where(eq(assignedWorkers.taskId, task.id));

      task.workers = workers.map((worker) => ({
        id: worker.id,
        workerId: worker.workerId,
        name: worker.workerName,
      }));
    }

    return {
      id: workplanFetched.id,
      incidentId: workplanFetched.incidentId,
      tasks,
    };
  });

  return workplan;
};

export const updateTaskById = async (taskId: number, updateFields: any) => {
  const updatedTask = await db
    .update(workplanTasks)
    .set(updateFields)
    .where(eq(workplanTasks.id, taskId))
    .returning();

  if (!updatedTask) {
    throw new Error(`Task with ID ${taskId} not found`);
  }

  return updatedTask;
};
