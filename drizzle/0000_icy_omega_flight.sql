CREATE TABLE "task" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"completed" boolean NOT NULL,
	"dateAdded" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "task_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE INDEX "title__index" ON "task" USING btree ("title");