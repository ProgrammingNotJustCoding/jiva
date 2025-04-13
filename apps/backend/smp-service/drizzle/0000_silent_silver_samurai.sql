CREATE TYPE "public"."erci" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."approval_status" AS ENUM('draft', 'pending', 'approved', 'rejected', 'archived');--> statement-breakpoint
CREATE TYPE "public"."category" AS ENUM('mining', 'electricity', 'machinery', 'rr_siding');--> statement-breakpoint
CREATE TABLE "control_plan" (
	"id" serial PRIMARY KEY NOT NULL,
	"hazard_id" integer NOT NULL,
	"erci" "erci" NOT NULL,
	"person_res" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "smp_documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"version" integer NOT NULL,
	"title" text NOT NULL,
	"approval_date" timestamp NOT NULL,
	"approval_status" "approval_status" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"document_s3_key" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hazards" (
	"id" serial PRIMARY KEY NOT NULL,
	"document_id" integer NOT NULL,
	"category" "category" NOT NULL,
	"description" text NOT NULL,
	"risk_cons" numeric NOT NULL,
	"risk_exposure" numeric NOT NULL,
	"risk_prob" numeric NOT NULL,
	"risk_rating" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "control_procedure" (
	"id" serial PRIMARY KEY NOT NULL,
	"control_plan_id" integer NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
ALTER TABLE "control_plan" ADD CONSTRAINT "control_plan_hazard_id_hazards_id_fk" FOREIGN KEY ("hazard_id") REFERENCES "public"."hazards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hazards" ADD CONSTRAINT "hazards_document_id_smp_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."smp_documents"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "control_procedure" ADD CONSTRAINT "control_procedure_control_plan_id_control_plan_id_fk" FOREIGN KEY ("control_plan_id") REFERENCES "public"."control_plan"("id") ON DELETE no action ON UPDATE no action;
