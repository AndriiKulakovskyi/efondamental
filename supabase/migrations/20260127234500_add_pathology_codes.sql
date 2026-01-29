-- Add code column to pathologies table
ALTER TABLE "public"."pathologies" ADD COLUMN IF NOT EXISTS "code" character varying(10);

-- Update existing pathologies with requested codes
UPDATE "public"."pathologies" SET "code" = '01' WHERE "type" = 'bipolar';
UPDATE "public"."pathologies" SET "code" = '02' WHERE "type" = 'schizophrenia';
UPDATE "public"."pathologies" SET "code" = '03' WHERE "type" = 'depression';
UPDATE "public"."pathologies" SET "code" = '04' WHERE "type" = 'asd_asperger';

-- Make code NOT NULL after populating existing records
ALTER TABLE "public"."pathologies" ALTER COLUMN "code" SET NOT NULL;

-- Make code unique for future consistency
ALTER TABLE "public"."pathologies" ADD CONSTRAINT "pathologies_code_key" UNIQUE ("code");
