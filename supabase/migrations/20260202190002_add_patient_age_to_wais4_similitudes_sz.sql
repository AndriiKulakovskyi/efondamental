-- Add patient_age column to schizophrenia_wais4_similitudes table
-- This column stores the patient's age at evaluation, which is injected from patient profile
-- and used for age-based normative scoring

ALTER TABLE "public"."schizophrenia_wais4_similitudes" 
ADD COLUMN IF NOT EXISTS "patient_age" INTEGER;

COMMENT ON COLUMN "public"."schizophrenia_wais4_similitudes"."patient_age" 
IS 'Patient age at evaluation (injected from patient profile, used for normative scoring)';
