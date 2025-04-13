import { eq } from "drizzle-orm";
import { db } from "../database/db.ts";
import { controlPlan } from "../database/schema/control.schema.ts";
import { controlProcedure } from "../database/schema/steps.schema.ts";
import type { InsertControl } from "../database/types.ts";

export const insertControl = async (control: InsertControl) => {
  const [newControl] = await db.insert(controlPlan).values(control).returning();

  if (!newControl) {
    throw new Error("Failed to insert control");
  }

  return newControl;
};

export const getControlsAndSteps = async (hazardId: number) => {
  const [getControlPlan] = await db
    .select()
    .from(controlPlan)
    .where(eq(controlPlan.hazardId, hazardId));

  const getControlSteps = await db
    .select()
    .from(controlProcedure)
    .where(eq(controlProcedure.controlPlanId, getControlPlan.id))
    .orderBy(controlProcedure.id);

  return {
    controlPlan: {
      ...getControlPlan,
      createdAt: undefined,
      updatedAt: undefined,
      deletedAt: undefined,
      isDeleted: undefined,
      steps: getControlSteps.map((step) => ({
        ...step,
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined,
        isDeleted: undefined,
      })),
    },
  };
};
