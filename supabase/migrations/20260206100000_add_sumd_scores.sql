-- Migration: Add score columns to schizophrenia_sumd table
-- Created: 2026-02-06

-- Add score columns
ALTER TABLE "public"."schizophrenia_sumd"
  ADD COLUMN IF NOT EXISTS "score_conscience1" integer,
  ADD COLUMN IF NOT EXISTS "score_conscience2" integer,
  ADD COLUMN IF NOT EXISTS "score_conscience3" integer,
  ADD COLUMN IF NOT EXISTS "awareness_score" numeric,
  ADD COLUMN IF NOT EXISTS "attribution_score" numeric,
  ADD COLUMN IF NOT EXISTS "test_done" boolean;

-- Add comments
COMMENT ON COLUMN "public"."schizophrenia_sumd"."score_conscience1" IS 'Score for Trouble mental (Conscience du trouble)';
COMMENT ON COLUMN "public"."schizophrenia_sumd"."score_conscience2" IS 'Score for Conséquences de ce trouble (Conscience du trouble)';
COMMENT ON COLUMN "public"."schizophrenia_sumd"."score_conscience3" IS 'Score for Effets du traitement (Conscience du trouble)';
COMMENT ON COLUMN "public"."schizophrenia_sumd"."awareness_score" IS 'Average of conscience items (conscience1-9), excluding 0 values';
COMMENT ON COLUMN "public"."schizophrenia_sumd"."attribution_score" IS 'Average of attribution items (attribu4-9), excluding 0 values';
COMMENT ON COLUMN "public"."schizophrenia_sumd"."test_done" IS 'Whether the SUMD test was completed';
