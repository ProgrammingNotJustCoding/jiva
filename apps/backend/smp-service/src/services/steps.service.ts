import { db } from "../database/db.ts";
import { controlProcedure } from "../database/schema/steps.schema.ts";
import type { InsertStep } from "../database/types.ts";

export const insertSteps = async (
  controlPlanId: string,
  steps: Array<{ description: string }>,
) => {
  const pushSteps = await db.transaction(async (tx) => {
    try {
      for (const step of steps) {
        await tx.insert(controlProcedure).values({
          controlPlanId: Number(controlPlanId),
          description: step.description,
        });
      }
    } catch (e) {
      tx.rollback();
      throw e;
    }
  });

  return pushSteps;
};
