CREATE TYPE "public"."category" AS ENUM('operation', 'equipment', 'safety', 'instruction', 'personnel', 'environment', 'other');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('ongoing', 'ready_for_handover', 'handed_over', 'acknowledged');--> statement-breakpoint
CREATE TABLE "shift_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"shift_id" integer NOT NULL,
	"worker_id" integer NOT NULL,
	"category" "category" NOT NULL,
	"details" text NOT NULL,
	"related_equipment" text,
	"location" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shifts" (
	"id" serial PRIMARY KEY NOT NULL,
	"supervisor_id" integer NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp,
	"status" "status" NOT NULL,
	"finalized_at" timestamp,
	"acknowledged_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "shift_workers" (
	"id" serial PRIMARY KEY NOT NULL,
	"supervisor_id" integer NOT NULL,
	"worker_id" integer NOT NULL,
	"shift_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "shift_logs" ADD CONSTRAINT "shift_logs_shift_id_shifts_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shifts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_workers" ADD CONSTRAINT "shift_workers_shift_id_shifts_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shifts"("id") ON DELETE no action ON UPDATE no action;