CREATE TABLE "features" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"author_name" varchar(255),
	"votes_count" integer DEFAULT 0 NOT NULL,
	"status" varchar(50) DEFAULT 'open' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "votes" (
	"id" text PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"feature_id" text NOT NULL,
	"voter_ip" varchar(45) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "votes" ADD CONSTRAINT "votes_feature_id_features_id_fk" FOREIGN KEY ("feature_id") REFERENCES "public"."features"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "votes_feature_id_idx" ON "votes" USING btree ("feature_id");--> statement-breakpoint
CREATE UNIQUE INDEX "votes_voter_ip_feature_idx" ON "votes" USING btree ("voter_ip","feature_id");