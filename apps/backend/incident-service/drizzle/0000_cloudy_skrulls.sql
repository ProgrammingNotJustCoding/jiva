CREATE TYPE "public"."report_type" AS ENUM('hazard', 'near_miss', 'accident', 'environmental', 'other');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('low', 'medium', 'high', 'critical');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('reported', 'acknowledged', 'investigating', 'pending_actions', 'closed', 'cancelled');--> statement-breakpoint
CREATE TABLE "incident_attachments" (
	"id" serial PRIMARY KEY NOT NULL,
	"incident_id" integer NOT NULL,
	"file_name" text NOT NULL,
	"storage_path" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "incidents" (
	"id" serial PRIMARY KEY NOT NULL,
	"shift_id" integer NOT NULL,
	"report_type" "report_type" NOT NULL,
	"reported_by_user_id" integer NOT NULL,
	"location_description" text NOT NULL,
	"gps_latitude" numeric NOT NULL,
	"gps_longitude" numeric NOT NULL,
	"description" text NOT NULL,
	"initial_severity" "severity" NOT NULL,
	"status" "status" NOT NULL,
	"root_cause" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "incident_attachments" ADD CONSTRAINT "incident_attachments_incident_id_incidents_id_fk" FOREIGN KEY ("incident_id") REFERENCES "public"."incidents"("id") ON DELETE no action ON UPDATE no action;