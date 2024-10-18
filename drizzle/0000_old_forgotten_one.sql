-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE IF NOT EXISTS "task" (
	"id" uuid PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"completed" boolean
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title__index" ON "task" USING btree ("title");
*/