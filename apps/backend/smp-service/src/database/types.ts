import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { smpDocuments } from "./schema/documents.schema.ts";
import type { hazards } from "./schema/hazards.schema.ts";
import type { controlPlan } from "./schema/control.schema.ts";
import type { controlProcedure } from "./schema/steps.schema.ts";

export type SMPDocument = InferSelectModel<typeof smpDocuments>;
export type InsertSMPDocument = InferInsertModel<typeof smpDocuments>;

export type Hazard = InferSelectModel<typeof hazards>;
export type InsertHazard = InferInsertModel<typeof hazards>;

export type Control = InferSelectModel<typeof controlPlan>;
export type InsertControl = InferInsertModel<typeof controlPlan>;

export type Step = InferSelectModel<typeof controlProcedure>;
export type InsertStep = InferInsertModel<typeof controlProcedure>;
