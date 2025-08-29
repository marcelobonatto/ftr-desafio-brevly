CREATE TABLE "links" (
	"id" text PRIMARY KEY NOT NULL,
	"original" text NOT NULL,
	"short" text NOT NULL,
	"accesses" bigint DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "links_short_unique" UNIQUE("short")
);
