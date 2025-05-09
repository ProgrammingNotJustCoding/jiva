import type { Context } from "hono";
import { z } from "zod";
import { errors } from "../constants/errors.ts";
import {
  createWorkplan,
  getWorkplanByIncidentId,
  updateTaskById,
} from "../../services/workplans.service.ts";
import logger from "../../config/logger.ts";

export const postWorkplan = async (c: Context) => {
  const body = await c.req.json();

  const bodySchema = z.object({
    incidentId: z.string(),
    hazardId: z.string(),
    steps: z.array(
      z.object({
        id: z.string(),
        taskDescription: z.string(),
        workers: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          }),
        ),
      }),
    ),
  });

  const parsedBody = bodySchema.safeParse(body);

  if (!parsedBody.success) {
    return c.json(
      {
        error: errors[400],
        details: parsedBody.error.issues,
      },
      400,
    );
  }

  const workplanData = {
    incidentId: Number(parsedBody.data.incidentId),
    hazardId: Number(parsedBody.data.hazardId),
  };

  const controlProcedures = parsedBody.data.steps.map((step) => ({
    id: Number(step.id),
    taskDescription: step.taskDescription,
    workers: step.workers.map((worker) => ({
      id: Number(worker.id),
      name: worker.name,
    })),
  }));

  try {
    await createWorkplan(workplanData, controlProcedures);
    return c.text("OK", 201);
  } catch (e) {
    logger.error(`Error creating workplan: ${e}`);
    return c.json({
      error: errors[500],
      details: `Error creating workplan: ${e}`,
    });
  }
};

export const getIncidentWorkplan = async (c: Context) => {
  const incidentId = Number(c.req.param("incidentId"));
  console.log(`Fetching workplan for incident ${incidentId}`);

  try {
    const workplan = await getWorkplanByIncidentId(incidentId);
    return c.json(workplan);
  } catch (e) {
    logger.error(`Error getting workplan: ${e}`);
    return c.json(
      {
        error: errors[500],
        details: `Error getting workplan: ${e}`,
      },
      500,
    );
  }
};

export const updateTask = async (c: Context) => {
  const taskId = c.req.param("taskId");

  try {
    const updateData = await c.req.json();

    if (Object.keys(updateData).length === 0) {
      return c.json(
        {
          error: errors[400],
          details: "No update data provided",
        },
        400,
      );
    }

    const validUpdateFields = [
      "workplanId",
      "controlProcedureId",
      "taskDescription",
      "status",
    ];

    const updateFields: Record<string, any> = {};

    for (const field of validUpdateFields) {
      if (field in updateData) {
        updateFields[field] = updateData[field];
      }
    }

    updateFields.updatedAt = new Date();

    const updatedTask = await updateTaskById(Number(taskId), updateFields);

    if (!updatedTask || updatedTask.length === 0) {
      return c.json(
        {
          error: errors[404],
          details: `Task with ID ${taskId} not found`,
        },
        404,
      );
    }

    return c.text("OK", 200)

  } catch (e) {
    logger.error(`Error updating task ${taskId}: ${e}`);
    return c.json(
      {
        error: errors[500],
        details: `Error updating task ${taskId}: ${e}`,
      },
      500,
    );
  }
};
