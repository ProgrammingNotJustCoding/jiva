import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { smpDocuments } from "./schema/documents.schema.ts";

export type SMPDocument = InferSelectModel<typeof smpDocuments>
export type InsertSMPDocument = InferInsertModel<typeof smpDocuments>;
