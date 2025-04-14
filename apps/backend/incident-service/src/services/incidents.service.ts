import { eq } from "drizzle-orm";
import { db } from "../database/db.ts";
import { incidents } from "../database/schema/incidents.schema.ts";
import type { InsertIncident } from "../database/types.ts";
import { uploadAttachment } from "./attachments.service.ts";

export const insertIncident = async (tx: any, incidentData: InsertIncident) => {
  const [newIncident] = await tx
    .insert(incidents)
    .values(incidentData)
    .returning();

  if (!newIncident) {
    throw new Error("Failed to insert incident");
  }

  return newIncident;
};

export const insertIncidentData = async (
  incidentData: InsertIncident,
  attachments: Array<{ file: File }>,
) => {
  let failedAttachments: Array<{ file: File; error: any }> = [];
  const newIncidentData = await db.transaction(async (tx) => {
    try {
      const newIncident = await insertIncident(tx, incidentData);
      for (const attachment of attachments) {
        if (!attachment.file) {
          continue;
        }
        try {
          await uploadAttachment(tx, attachment.file, newIncident.id);
        } catch (e) {
          failedAttachments.push({ file: attachment.file, error: e });
        }
      }
      return newIncident;
    } catch (e) {
      throw new Error(`Failed to insert incident data: ${e}`);
    }
  });

  return {
    newIncidentData,
    failedAttachments,
  };
};

export const getIncidentsByShiftId = async (
  shiftId: number,
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;
  const getIncidents = await db
    .select()
    .from(incidents)
    .where(eq(incidents.shiftId, shiftId))
    .limit(limit)
    .offset(offset);

  return getIncidents;
};
