CREATE TABLE "invite_code" (
	"id" text PRIMARY KEY,
	"code" text NOT NULL UNIQUE,
	"note" text,
	"redeemed_by" text,
	"redeemed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "invite_code" ADD CONSTRAINT "invite_code_redeemed_by_user_id_fkey" FOREIGN KEY ("redeemed_by") REFERENCES "user"("id");