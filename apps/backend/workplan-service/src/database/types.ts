import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { workplans } from "./schema/workplans.schema.ts";
import type { workplanTasks } from "./schema/tasks.schema.ts";
import type { assignedWorkers } from "./schema/assignedWorkers.schema.ts";

export type Workplans = InferSelectModel<typeof workplans>;
export type InsertWorkplan = InferInsertModel<typeof workplans>;

export type Tasks = InferSelectModel<typeof workplanTasks>;
export type InsertTask = InferInsertModel<typeof workplanTasks>;

export type AssignedWorkers = InferSelectModel<typeof assignedWorkers>;
export type InsertAssignedWorker = InferInsertModel<typeof assignedWorkers>;
