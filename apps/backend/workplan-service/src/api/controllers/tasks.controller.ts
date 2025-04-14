import type { Context } from "hono";
import logger from "../../config/logger.ts";
import { errors } from "../constants/errors.ts";
import {
  getIncompleteTasksByWorkplanId,
  getTasksByWorkerId,
} from "../../services/tasks.service.ts";
import { getAssignedWorkersByWorkplanId } from "../../services/assignedWorkers.service.ts";

export const getWorkplanWorkers = async (c: Context) => {
  const workplanId = c.req.param("workplanId");
  try {
    const workers = await getAssignedWorkersByWorkplanId(Number(workplanId));
    return c.json(
      {
        data: workers,
      },
      200,
    );
  } catch (e) {
    logger.error(`Error fetching workers for workplan ${workplanId}: ${e}`);
    return c.json({
      error: errors[500],
      details: `Error fetching workers for workplan ${workplanId}: ${e}`,
    });
  }
};

export const getWorkerTasks = async (c: Context) => {
  const workerId = c.req.param("workerId");

  try {
    const tasks = await getTasksByWorkerId(Number(workerId));
    return c.json(
      {
        data: tasks,
      },
      200,
    );
  } catch (e) {
    logger.error(`Error fetching tasks for worker ${workerId}: ${e}`);
    return c.json({
      error: errors[500],
      details: `Error fetching tasks for worker ${workerId}: ${e}`,
    });
  }
};

export const getIncompleteTasks = async (c: Context) => {
  const workplanId = c.req.param("workplanId");

  try {
    const tasks = await getIncompleteTasksByWorkplanId(Number(workplanId));
    return c.json(
      {
        data: tasks,
      },
      200,
    );
  } catch (e) {
    logger.error(`Error fetching tasks for workplan ${workplanId}: ${e}`);
    return c.json({
      error: errors[500],
      details: `Error fetching tasks for workplan ${workplanId}: ${e}`,
    });
  }
};
