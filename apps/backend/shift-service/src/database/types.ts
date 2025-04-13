import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { shifts } from "./schema/shifts.schema.ts";
import type { shiftLogs } from "./schema/logs.schema.ts";

export type Shift = InferSelectModel<typeof shifts>;
export type InsertShift = InferInsertModel<typeof shifts>;

export type Logs = InferSelectModel<typeof shiftLogs>;
export type InsertLogs = InferInsertModel<typeof shiftLogs>;
