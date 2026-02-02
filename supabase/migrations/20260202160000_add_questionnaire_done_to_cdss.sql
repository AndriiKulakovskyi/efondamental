-- Add questionnaire_done column to schizophrenia_cdss
ALTER TABLE "public"."schizophrenia_cdss" 
ADD COLUMN IF NOT EXISTS "questionnaire_done" TEXT;

COMMENT ON COLUMN "public"."schizophrenia_cdss"."questionnaire_done" IS 'Indicates if the questionnaire was completed (Fait/Non fait)';
