import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { shifts } from "./schema/shifts.schema.ts";
import type { shiftLogs } from "./schema/logs.schema.ts";
import type { userDetails } from "./schema/details.schema.ts";
import type { shiftWorkers } from "./schema/shiftWorkers.schema.ts";

export type Shift = InferSelectModel<typeof shifts>;
export type InsertShift = InferInsertModel<typeof shifts>;

export type Logs = InferSelectModel<typeof shiftLogs>;
export type InsertLogs = InferInsertModel<typeof shiftLogs>;

export type ShiftWorkers = InferSelectModel<typeof shiftWorkers>;
export type InsertShiftWorkers = InferInsertModel<typeof shiftWorkers>;

export type UserDetails = InferSelectModel<typeof userDetails>;
export type InsertUserDetails = InferInsertModel<typeof userDetails>;
