CREATE TABLE IF NOT EXISTS "part_images" (
	"part_id" text NOT NULL,
	"position" integer NOT NULL,
	"file_name" text,
	"url_200" text NOT NULL,
	"url_800" text NOT NULL,
	"url_1600" text NOT NULL,
	CONSTRAINT "part_images_part_id_position_pk" PRIMARY KEY("part_id","position")
);
--> statement-breakpoint
ALTER TABLE "sync_runs" ADD COLUMN "images_upserted" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "part_images" ADD CONSTRAINT "part_images_part_id_parts_id_fk" FOREIGN KEY ("part_id") REFERENCES "public"."parts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
