import type { Context } from "hono";
import { z } from "zod";
import { errors } from "../constants/errors.ts";
import type { InsertShift } from "../../database/types.ts";
import logger from "../../config/logger.ts";
import {
  getCurrentShiftBySupervisor,
  getCurrentShiftByWorker,
  getShiftByShiftId,
  getShiftsBySupervisor,
  insertShiftData,
  softDeleteShift,
  updateShift,
} from "../../services/shifts.service.ts";

export const postShift = async (c: Context) => {
  const body = await c.req.json();

  const bodySchema = z.object({
    supervisorId: z.string(),
    startTime: z.string().datetime(),
    endTime: z.string().datetime().optional(),
    nextSupervisorId: z.string().optional(),
    status: z.enum([
      "to_begin",
      "ongoing",
      "ready_for_handover",
      "handed_over",
      "acknowledged",
    ]),
    finalizedAt: z.string().datetime().optional(),
    acknowledgedAt: z.string().datetime().optional(),
    workers: z.array(z.object({ id: z.string() })),
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

  const shiftData: InsertShift = {
    supervisorId: Number(parsedBody.data.supervisorId),
    startTime: new Date(parsedBody.data.startTime),
    endTime: parsedBody.data.endTime ? new Date(parsedBody.data.endTime) : null,
    status: parsedBody.data.status,
    finalizedAt: parsedBody.data.finalizedAt
      ? new Date(parsedBody.data.finalizedAt)
      : null,
    acknowledgedAt: parsedBody.data.acknowledgedAt
      ? new Date(parsedBody.data.acknowledgedAt)
      : null,
  };
  const workers = parsedBody.data.workers.map((worker) => ({
    id: Number(worker.id),
  }));

  try {
    await insertShiftData(shiftData, workers);
    return c.text("OK", 201);
  } catch (e) {
    logger.error("Error creating shift", e);
    return c.json(
      {
        error: errors[500],
        details: `Error creating shift: ${e}`,
      },
      500,
    );
  }
};

export const getSupervisorShifts = async (c: Context) => {
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 10;

  const supervisorId = c.req.query("supervisorId");
  if (!supervisorId) {
    return c.json(
      {
        error: errors[400],
        details: "supervisorId is required",
      },
      400,
    );
  }

  try {
    const shifts = await getShiftsBySupervisor(
      Number(supervisorId),
      page,
      limit,
    );
    return c.json(
      {
        data: shifts,
      },
      200,
    );
  } catch (e) {
    logger.error("Error fetching supervisor shifts", e);
    return c.json(
      {
        error: errors[500],
        details: `Error fetching supervisor shifts: ${e}`,
      },
      500,
    );
  }
};

export const getShift = async (c: Context) => {
  const shiftId = c.req.param("id");
  if (!shiftId) {
    return c.json(
      {
        error: errors[400],
        details: "shiftId is required",
      },
      400,
    );
  }

  try {
    const shift = await getShiftByShiftId(Number(shiftId));
    return c.json(
      {
        data: shift,
      },
      200,
    );
  } catch (e) {
    logger.error("Error fetching shift", e);
    return c.json(
      {
        error: errors[500],
        details: `Error fetching shift: ${e}`,
      },
      500,
    );
  }
}

export const getWorkerShift = async (c: Context) => {
  const workerId = c.req.param("id");
  if (!workerId) {
    return c.json(
      {
        error: errors[400],
        details: "workerId is required",
      },
      400,
    );
  }

  try {
    const shift = await getCurrentShiftByWorker(Number(workerId));
    return c.json(
      {
        data: shift,
      },
      200,
    );
  } catch (e) {
    logger.error("Error fetching worker shift", e);
    return c.json(
      {
        error: errors[500],
        details: `Error fetching worker shift: ${e}`,
      },
      500,
    );
  }
};

export const getOngoingShift = async (c: Context) => {
  const supervisorId = c.req.param("id");
  if (!supervisorId) {
    return c.json(
      {
        error: errors[400],
        details: "supervisorId is required",
      },
      400,
    );
  }

  try {
    const shift = await getCurrentShiftBySupervisor(Number(supervisorId));
    return c.json(
      {
        data: shift,
      },
      200,
    );
  } catch (e) {
    logger.error("Error fetching ongoing shift", e);
    return c.json(
      {
        error: errors[500],
        details: `Error fetching ongoing shift: ${e}`,
      },
      500,
    );
  }
};

export const putShift = async (c: Context) => {
  const shiftId = c.req.param("id");
  const body = await c.req.json();

  const bodySchema = z.object({
    supervisorId: z.string().optional(),
    nextSupervisorId: z.string().optional(),
    startTime: z.string().optional(),
    endTime: z.string().optional(),
    status: z
      .enum([
        "to_begin",
        "ongoing",
        "ready_for_handover",
        "handed_over",
        "acknowledged",
      ])
      .optional(),
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

  const updateShiftData: Record<string, any> = {};

  if (parsedBody.data.supervisorId) {
    updateShiftData.supervisorId = parsedBody.data.supervisorId;
  }
  if (parsedBody.data.nextSupervisorId) {
    updateShiftData.nextSupervisorId = parsedBody.data.nextSupervisorId;
  }
  if (parsedBody.data.startTime) {
    updateShiftData.startTime = parsedBody.data.startTime;
  }
  if (parsedBody.data.endTime) {
    updateShiftData.endTime = parsedBody.data.endTime;
  }
  if (parsedBody.data.status) {
    updateShiftData.status = parsedBody.data.status;
  }

  try {
    await updateShift(Number(shiftId), updateShiftData);
    return c.text("OK", 200);
  } catch (e) {
    logger.error("Error updating shift", e);
    return c.json(
      {
        error: errors[500],
        details: `Error updating shift: ${e}`,
      },
      500,
    );
  }
};

export const deleteShift = async (c: Context) => {
  const shiftId = c.req.param("id");

  try {
    await softDeleteShift(Number(shiftId));
    return c.text("OK", 200);
  } catch (e) {
    logger.error("Error deleting shift", e);
    return c.json(
      {
        error: errors[500],
        details: `Error deleting shift: ${e}`,
      },
      500,
    );
  }
};
