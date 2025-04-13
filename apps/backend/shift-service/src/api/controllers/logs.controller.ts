import type { Context } from "hono";
import { z } from "zod";
import { errors } from "../constants/errors.ts";
import logger from "../../config/logger.ts";
import {
  getLogsByShiftAndWorkerId,
  getLogsByShiftId,
  insertShiftLog,
  softDeleteShiftLog,
  updateShiftLog,
} from "../../services/logs.service.ts";

export const postLog = async (c: Context) => {
  const body = await c.req.json();

  const bodySchema = z.object({
    shiftId: z.string(),
    workerId: z.string(),
    category: z.enum([
      "operation",
      "equipment",
      "safety",
      "instruction",
      "personnel",
      "environment",
      "other",
    ]),
    details: z.string().min(1).max(1000),
    relatedEquipment: z.string().optional(),
    location: z.string().optional(),
  });

  const parsedBody = bodySchema.safeParse(body);

  if (!parsedBody.success) {
    return c.json({
      error: errors[400],
      details: parsedBody.error.issues,
    });
  }

  const shiftLogData = {
    shiftId: Number(parsedBody.data.shiftId),
    workerId: Number(parsedBody.data.workerId),
    category: parsedBody.data.category,
    details: parsedBody.data.details,
    relatedEquipment: parsedBody.data.relatedEquipment,
    location: parsedBody.data.location,
  };

  try {
    await insertShiftLog(shiftLogData);
    return c.text("OK", 201);
  } catch (e) {
    logger.error(`Error posting log: ${e}`);
    return c.json({
      error: errors[500],
      details: "Failed to post log",
    });
  }
};

export const getShiftLogs = async (c: Context) => {
  const shiftId = c.req.param("id");
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 10;

  try {
    const logs = await getLogsByShiftId(Number(shiftId), page, limit);

    return c.json({
      data: logs,
    });
  } catch (e) {
    logger.error(`Error getting logs for shift ${shiftId}: ${e}`);
    return c.json({
      error: errors[500],
      details: "Failed to get logs",
    });
  }
};

export const getShiftWorkerLogs = async (c: Context) => {
  const shiftId = Number(c.req.param("id"));
  const workerId = Number(c.req.query("workerId"));

  try {
    const logs = await getLogsByShiftAndWorkerId(shiftId, workerId);

    return c.json({
      data: logs,
    });
  } catch (e) {
    logger.error(
      `Error getting logs for shift ${shiftId} and worker ${workerId}: ${e}`,
    );
    return c.json({
      error: errors[500],
      details: "Failed to get logs",
    });
  }
};

export const putLog = async (c: Context) => {
  const shiftLogId = c.req.param("id");
  const body = await c.req.json();

  const bodySchema = z.object({
    category: z
      .enum([
        "operation",
        "equipment",
        "safety",
        "instruction",
        "personnel",
        "environment",
        "other",
      ])
      .optional(),
    details: z.string().min(1).max(1000).optional(),
    relatedEquipment: z.string().optional(),
    location: z.string().optional(),
  });

  const parsedBody = bodySchema.safeParse(body);

  if (!parsedBody.success) {
    return c.json({
      error: errors[400],
      details: "Invalid request body",
    });
  }

  const updateShiftLogData: Record<string, any> = {};

  if (parsedBody.data.category) {
    updateShiftLogData.category = parsedBody.data.category;
  }
  if (parsedBody.data.details) {
    updateShiftLogData.details = parsedBody.data.details;
  }
  if (parsedBody.data.relatedEquipment) {
    updateShiftLogData.relatedEquipment = parsedBody.data.relatedEquipment;
  }
  if (parsedBody.data.location) {
    updateShiftLogData.location = parsedBody.data.location;
  }

  try {
    await updateShiftLog(Number(shiftLogId), updateShiftLogData);
    return c.text("OK", 200);
  } catch (e) {
    logger.error(`Error updating log for shift ${shiftLogId}: ${e}`);
    return c.json({
      error: errors[500],
      details: "Failed to update log",
    });
  }
};

export const deleteLog = async (c: Context) => {
  const shiftLogId = c.req.param("id");

  try {
    await softDeleteShiftLog(Number(shiftLogId));
    return c.text("OK", 200);
  } catch (e) {
    logger.error(`Error deleting log for shift ${shiftLogId}: ${e}`);
    return c.json({
      error: errors[500],
      details: "Failed to delete log",
    });
  }
};
