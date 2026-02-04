-- ============================================================================
-- Migration: Update schizophrenia_wais4_criteria table
-- Add support for "Ne sais pas" option (code 2) for rad_abs_ep_3month and rad_neuro_psychotrope
-- ============================================================================

-- Drop existing CHECK constraints
ALTER TABLE "public"."schizophrenia_wais4_criteria" 
  DROP CONSTRAINT IF EXISTS "schizophrenia_wais4_criteria_rad_abs_ep_3month_check";

ALTER TABLE "public"."schizophrenia_wais4_criteria" 
  DROP CONSTRAINT IF EXISTS "schizophrenia_wais4_criteria_rad_neuro_psychotrope_check";

-- Add updated CHECK constraints that allow 0, 1, or 2
ALTER TABLE "public"."schizophrenia_wais4_criteria" 
  ADD CONSTRAINT "schizophrenia_wais4_criteria_rad_abs_ep_3month_check" 
  CHECK ("rad_abs_ep_3month" IN (0, 1, 2));

ALTER TABLE "public"."schizophrenia_wais4_criteria" 
  ADD CONSTRAINT "schizophrenia_wais4_criteria_rad_neuro_psychotrope_check" 
  CHECK ("rad_neuro_psychotrope" IN (0, 1, 2));

-- Update comments to reflect new options
COMMENT ON COLUMN "public"."schizophrenia_wais4_criteria"."rad_abs_ep_3month" IS 'Suspicion of learning and acquisition disorder (1=Yes, 0=No, 2=Don''t know)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_criteria"."rad_neuro_psychotrope" IS 'Current psychotropic treatment (1=Yes, 0=No, 2=Don''t know)';
COMMENT ON COLUMN "public"."schizophrenia_wais4_criteria"."chk_sismo_choix" IS 'Learning disorder details when rad_abs_ep_3month=1. Stores selected options as comma-separated values (dyslexie, dysphasie, dyspraxie, dysgraphie)';
