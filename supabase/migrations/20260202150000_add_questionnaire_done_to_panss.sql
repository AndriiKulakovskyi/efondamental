-- Add questionnaire_done column to schizophrenia_panss
ALTER TABLE "public"."schizophrenia_panss" 
ADD COLUMN IF NOT EXISTS "questionnaire_done" TEXT;

-- Update RLS if needed (usually not for simple column addition if table policies are broad)
COMMENT ON COLUMN "public"."schizophrenia_panss"."questionnaire_done" IS 'Indicates if the questionnaire was completed (Fait/Non fait)';
