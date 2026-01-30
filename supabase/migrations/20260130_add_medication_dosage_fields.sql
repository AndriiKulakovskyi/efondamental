-- Add dosage fields to patient_medications table
-- This allows storing: 
-- For regular medications: daily_units (e.g., "2" or "Si besoin")
-- For injectable medications: ampoule_count and weeks_interval

ALTER TABLE "public"."patient_medications"
ADD COLUMN IF NOT EXISTS "dosage_type" TEXT CHECK ("dosage_type" IN ('regular', 'injectable')),
ADD COLUMN IF NOT EXISTS "daily_units" TEXT,
ADD COLUMN IF NOT EXISTS "ampoule_count" TEXT,
ADD COLUMN IF NOT EXISTS "weeks_interval" TEXT;

COMMENT ON COLUMN "public"."patient_medications"."dosage_type" IS 'Type of dosage: regular (daily) or injectable (periodic)';
COMMENT ON COLUMN "public"."patient_medications"."daily_units" IS 'For regular meds: number of units per day (e.g., 2, 0.5, Si besoin)';
COMMENT ON COLUMN "public"."patient_medications"."ampoule_count" IS 'For injectable meds: number of ampoules per administration';
COMMENT ON COLUMN "public"."patient_medications"."weeks_interval" IS 'For injectable meds: interval between administrations in weeks';
