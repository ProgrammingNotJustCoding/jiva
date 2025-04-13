import type { Context } from "hono";
import { z } from "zod";
import { errors } from "../constants/errors.ts";
import {
  getHazardsByCategory,
  insertHazard,
  softDeleteHazard,
  updateHazard,
} from "../../services/hazards.service.ts";
import type { InsertHazard } from "../../database/types.ts";
import logger from "../../config/logger.ts";

export const postHazard = async (c: Context) => {
  const body = await c.req.json();

  const bodySchema = z.object({
    smpDocumentId: z.string(),
    category: z.enum(["mining", "electricity", "machinery", "rr_siding"]),
    description: z.string(),
    riskCons: z.number(),
    riskExposure: z.number(),
    riskProb: z.number(),
    riskRating: z.number(),
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

  const hazardData: InsertHazard = {
    smpDocumentId: Number(parsedBody.data.smpDocumentId),
    category: parsedBody.data.category,
    description: parsedBody.data.description,
    riskCons: String(parsedBody.data.riskCons),
    riskExposure: String(parsedBody.data.riskExposure),
    riskProb: String(parsedBody.data.riskProb),
    riskRating: String(parsedBody.data.riskRating),
  };

  try {
    await insertHazard(hazardData);
    return c.text("OK", 201);
  } catch (e) {
    logger.error("Error inserting hazard:", e);
    return c.json(
      {
        error: errors[500],
      },
      500,
    );
  }
};

export const getHazards = async (c: Context) => {
  const category = c.req.query("category") as
    | "mining"
    | "electricity"
    | "machinery"
    | "rr_siding";
  const smpDocumentId = Number(c.req.query("smpDocumentId"));

  const page = Number(c.req.query("page")) || 1;
  const limit = Number(c.req.query("limit")) || 10;

  const hazards = await getHazardsByCategory(
    category,
    smpDocumentId,
    page,
    limit,
  );

  return c.json(
    {
      data: {
        hazards,
      },
    },
    200,
  );
};

export const putHazard = async (c: Context) => {
  const id = Number(c.req.param("id"));
  const body = await c.req.json();

  const bodySchema = z.object({
    smpDocumentId: z.number().optional(),
    category: z
      .enum(["mining", "electricity", "machinery", "rr_siding"])
      .optional(),
    description: z.string().optional(),
    riskCons: z.number().optional(),
    riskExposure: z.number().optional(),
    riskProb: z.number().optional(),
    riskRating: z.number().optional(),
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

  const hazardData: Record<string, string | number | undefined> = {};

  if (parsedBody.data.smpDocumentId !== undefined) {
    hazardData.smpDocumentId = parsedBody.data.smpDocumentId;
  }

  if (parsedBody.data.category !== undefined) {
    hazardData.category = parsedBody.data.category;
  }

  if (parsedBody.data.description !== undefined) {
    hazardData.description = parsedBody.data.description;
  }

  if (parsedBody.data.riskCons !== undefined) {
    hazardData.riskCons = String(parsedBody.data.riskCons);
  }

  if (parsedBody.data.riskExposure !== undefined) {
    hazardData.riskExposure = String(parsedBody.data.riskExposure);
  }

  if (parsedBody.data.riskProb !== undefined) {
    hazardData.riskProb = String(parsedBody.data.riskProb);
  }

  if (parsedBody.data.riskRating !== undefined) {
    hazardData.riskRating = String(parsedBody.data.riskRating);
  }

  try {
    await updateHazard(id, hazardData);
    return c.text("OK", 200);
  } catch (e) {
    logger.error("Error updating hazard:", e);
    return c.json(
      {
        error: errors[500],
      },
      500,
    );
  }
};

export const deleteHazard = async (c: Context) => {
  const id = Number(c.req.param("id"));

  try {
    await softDeleteHazard(id);
    return c.text("OK", 200);
  } catch (e) {
    logger.error("Error deleting hazard:", e);
    return c.json(
      {
        error: errors[500],
      },
      500,
    );
  }
};
