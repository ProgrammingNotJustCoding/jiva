CREATE TYPE "public"."user_roles" AS ENUM('admin', 'supervisor', 'worker');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"role" "user_roles" NOT NULL,
	"user_code" text NOT NULL,
	"password_hash" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"is_deleted" boolean DEFAULT false NOT NULL,
	CONSTRAINT "users_user_code_unique" UNIQUE("user_code")
);
