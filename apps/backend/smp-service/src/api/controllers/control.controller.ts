import type { Context } from "hono";
import { z } from "zod";
import { errors } from "../constants/errors.ts";
import {
  getControlsAndSteps,
  insertControl,
} from "../../services/control.service.ts";
import logger from "../../config/logger.ts";
import type { InsertStep } from "../../database/types.ts";
import { insertSteps } from "../../services/steps.service.ts";

export const postControl = async (c: Context) => {
  const body = await c.req.json();

  const bodySchema = z.object({
    hazardId: z.string(),
    erci: z.enum(["low", "medium", "high"]),
    personRes: z.string().min(2).max(100),
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

  const controlData = {
    hazardId: Number(parsedBody.data.hazardId),
    erci: parsedBody.data.erci,
    personRes: parsedBody.data.personRes,
  };

  try {
    await insertControl(controlData);
    return c.text("OK", 201);
  } catch (error) {
    logger.error("Error inserting control", error);
    return c.json(
      {
        error: errors[500],
      },
      500,
    );
  }
};

export const postControlStep = async (c: Context) => {
  const body = await c.req.json();

  const bodySchema = z.object({
    controlPlanId: z.string(),
    steps: z.array(
      z.object({
        description: z.string().min(2).max(100),
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

  try {
    await insertSteps(parsedBody.data.controlPlanId, parsedBody.data.steps);
    return c.text("OK", 201);
  } catch (error) {
    logger.error("Error inserting steps", error);
    return c.json(
      {
        error: errors[500],
      },
      500,
    );
  }
};

export const getControls = async (c: Context) => {
  const hazardId = parseInt(c.req.param("id"));

  if (!hazardId) {
    return c.json(
      {
        error: errors[400],
        details: [{ message: "Invalid hazard ID" }],
      },
      400,
    );
  }

  try {
    const controls = await getControlsAndSteps(hazardId);
    return c.json(
      {
        data: {
          controls,
        },
      },
      200,
    );
  } catch (e) {
    logger.error("Error fetching controls", e);
    return c.json(
      {
        error: errors[500],
        details: e,
      },
      500,
    );
  }
};
