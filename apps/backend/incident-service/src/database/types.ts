import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { incidents } from "./schema/incidents.schema.ts";
import type { incidentAttachments } from "./schema/attachments.schema.ts";

export type Incident = InferSelectModel<typeof incidents>;
export type InsertIncident = InferInsertModel<typeof incidents>;

export type Attachment = InferSelectModel<typeof incidentAttachments>;
export type InsertAttachment = InferInsertModel<typeof incidentAttachments>;
