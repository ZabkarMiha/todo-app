ALTER TABLE "task" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "task" ALTER COLUMN "completed" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "task" ADD COLUMN "dateAdded" timestamp with time zone DEFAULT now();--> statement-breakpoint
ALTER TABLE "task" ADD CONSTRAINT "task_id_unique" UNIQUE("id");