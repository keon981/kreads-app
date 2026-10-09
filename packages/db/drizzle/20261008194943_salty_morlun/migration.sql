ALTER TABLE "user" ADD COLUMN "aff_code" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "invited_by" text;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_aff_code_key" UNIQUE("aff_code");--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_invited_by_user_id_fkey" FOREIGN KEY ("invited_by") REFERENCES "user"("id") ON DELETE SET NULL;