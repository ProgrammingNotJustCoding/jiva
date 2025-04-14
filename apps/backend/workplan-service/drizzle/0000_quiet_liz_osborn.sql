CREATE TYPE "public"."status" AS ENUM('pending', 'in_progress', 'completed', 'unfinished');--> statement-breakpoint
CREATE TABLE "assigned_workers" (
	"id" serial PRIMARY KEY NOT NULL,
	"task_id" integer NOT NULL,
	"worker_id" integer NOT NULL,
	"worker_name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workplan_tasks" (
	"id" serial PRIMARY KEY NOT NULL,
	"workplan_id" integer NOT NULL,
	"control_procedure_id" integer NOT NULL,
	"task_description" text NOT NULL,
	"status" "status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workplans" (
	"id" serial PRIMARY KEY NOT NULL,
	"incident_id" integer NOT NULL,
	"hazard_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "assigned_workers" ADD CONSTRAINT "assigned_workers_task_id_workplan_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."workplan_tasks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workplan_tasks" ADD CONSTRAINT "workplan_tasks_workplan_id_workplans_id_fk" FOREIGN KEY ("workplan_id") REFERENCES "public"."workplans"("id") ON DELETE no action ON UPDATE no action;