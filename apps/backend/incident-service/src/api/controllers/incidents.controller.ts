import type { Context } from "hono";
import { z } from "zod";
import { errors } from "../constants/errors.ts";
import logger from "../../config/logger.ts";
import {
  getIncidentsByShiftId,
  insertIncidentData,
  updateIncidentData,
} from "../../services/incidents.service.ts";
import type { InsertIncident } from "../../database/types.ts";

export const postIncident = async (c: Context) => {
  const formData = await c.req.formData();

  const bodySchema = z.object({
    shiftId: z.string(),
    reportType: z.enum([
      "hazard",
      "near_miss",
      "accident",
      "environmental",
      "other",
    ]),
    reporttedByUserId: z.string(),
    locationDescription: z.string().max(255),
    gpsLatitude: z.string().min(-90).max(90),
    gpsLongitude: z.string().min(-180).max(180),
    description: z.string().max(255),
    initialSeverity: z.enum(["low", "medium", "high", "critical"]),
    status: z.enum([
      "reported",
      "acknowledged",
      "investigating",
      "pending_actions",
      "closed",
      "cancelled",
    ]),
    rootCause: z.string(),
  });

  const body = {
    shiftId: formData.get("shiftId"),
    reportType: formData.get("reportType"),
    reporttedByUserId: formData.get("reporttedByUserId"),
    locationDescription: formData.get("locationDescription"),
    gpsLatitude: formData.get("gpsLatitude"),
    gpsLongitude: formData.get("gpsLongitude"),
    description: formData.get("description"),
    initialSeverity: formData.get("initialSeverity"),
    status: formData.get("status"),
    rootCause: formData.get("rootCause"),
  };

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

  const attachments: Array<{ file: File }> = [];
  for (const [key, value] of formData.entries()) {
    if (typeof value !== "string" && key.startsWith("attachments")) {
      attachments.push({ file: value });
    }
  }

  const incidentData: InsertIncident = {
    shiftId: Number(parsedBody.data.shiftId),
    reportType: parsedBody.data.reportType as
      | "hazard"
      | "near_miss"
      | "accident"
      | "environmental"
      | "other",
    reporttedByUserId: Number(parsedBody.data.reporttedByUserId),
    locationDescription: parsedBody.data.locationDescription,
    gpsLatitude: parsedBody.data.gpsLatitude,
    gpsLongitude: parsedBody.data.gpsLongitude,
    description: parsedBody.data.description,
    initialSeverity: parsedBody.data.initialSeverity as
      | "low"
      | "medium"
      | "high"
      | "critical",
    status: parsedBody.data.status as
      | "reported"
      | "acknowledged"
      | "investigating"
      | "pending_actions"
      | "closed"
      | "cancelled",
    rootCause: parsedBody.data.rootCause,
  };

  try {
    const newIncident = await insertIncidentData(incidentData, attachments);
    if (newIncident.failedAttachments.length > 0) {
      logger.warn(
        `Failed to upload ${newIncident.failedAttachments} attachments`,
      );
      return c.json(
        {
          error: errors[400],
          details: `Failed to upload ${newIncident.failedAttachments} attachments`,
        },
        400,
      );
    } else {
      return c.text("OK", 201);
    }
  } catch (e) {
    logger.error(`Error posting incident: ${e}`);
    return c.json(
      {
        error: errors[500],
        details: `Error posting incident: ${e}`,
      },
      500,
    );
  }
};

export const getShiftIncidents = async (c: Context) => {
  const shiftId = c.req.param("id");
  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 10;

  try {
    const incidents = await getIncidentsByShiftId(Number(shiftId), page, limit);
    return c.json(
      {
        data: incidents,
      },
      200,
    );
  } catch (e) {
    logger.error(`Error fetching incidents: ${e}`);
    return c.json(
      {
        error: errors[500],
        details: `Error fetching incidents: ${e}`,
      },
      500,
    );
  }
};

export const updateIncident = async (c: Context) => {
  const incidentId = Number(c.req.param("id"));

  if (isNaN(incidentId) || incidentId <= 0) {
    return c.json(
      {
        error: errors[400],
        details: "Invalid incident ID",
      },
      400,
    );
  }

  let body;
  try {
    body = await c.req.json();
  } catch (e) {
    return c.json(
      {
        error: errors[400],
        details: "Invalid JSON in request body",
      },
      400,
    );
  }

  const updateSchema = z.object({
    shiftId: z.number().optional(),
    reportType: z
      .enum(["hazard", "near_miss", "accident", "environmental", "other"])
      .optional(),
    reporttedByUserId: z.number().optional(),
    locationDescription: z.string().max(255).optional(),
    gpsLatitude: z.string().min(-90).max(90).optional(),
    gpsLongitude: z.string().min(-180).max(180).optional(),
    description: z.string().max(255).optional(),
    initialSeverity: z.enum(["low", "medium", "high", "critical"]).optional(),
    status: z
      .enum([
        "reported",
        "acknowledged",
        "investigating",
        "pending_actions",
        "closed",
        "cancelled",
      ])
      .optional(),
    rootCause: z.string().optional(),
  });

  const parsedBody = updateSchema.safeParse(body);

  if (!parsedBody.success) {
    return c.json(
      {
        error: errors[400],
        details: parsedBody.error.issues,
      },
      400,
    );
  }

  const updateData: Partial<InsertIncident> = {};
  Object.entries(parsedBody.data).forEach(([key, value]) => {
    if (value !== undefined) {
      updateData[key as keyof InsertIncident] = value;
    }
  });

  if (Object.keys(updateData).length === 0) {
    return c.json(
      {
        error: errors[400],
        details: "No valid fields to update were provided",
      },
      400,
    );
  }

  updateData.updatedAt = new Date();

  try {
    const updatedIncident = await updateIncidentData(incidentId, updateData);

    if (!updatedIncident) {
      return c.json(
        {
          error: errors[404],
          details: "Incident not found",
        },
        404,
      );
    }

    return c.text("OK", 200);
  } catch (e) {
    logger.error(`Error updating incident: ${e}`);
    return c.json(
      {
        error: errors[500],
        details: `Error updating incident: ${e}`,
      },
      500,
    );
  }
};
