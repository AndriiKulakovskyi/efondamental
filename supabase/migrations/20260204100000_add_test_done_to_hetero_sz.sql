-- Migration: Add test_done column to schizophrenia hetero-questionnaire tables
-- Date: 2026-02-04

-- Table: schizophrenia_ymrs
ALTER TABLE "public"."schizophrenia_ymrs" ADD COLUMN IF NOT EXISTS "test_done" BOOLEAN DEFAULT TRUE;
COMMENT ON COLUMN "public"."schizophrenia_ymrs"."test_done" IS 'Flag indicating if the test was administered';

-- Table: schizophrenia_cgi
ALTER TABLE "public"."schizophrenia_cgi" ADD COLUMN IF NOT EXISTS "test_done" BOOLEAN DEFAULT TRUE;
COMMENT ON COLUMN "public"."schizophrenia_cgi"."test_done" IS 'Flag indicating if the test was administered';

-- Table: schizophrenia_egf
ALTER TABLE "public"."schizophrenia_egf" ADD COLUMN IF NOT EXISTS "test_done" BOOLEAN DEFAULT TRUE;
COMMENT ON COLUMN "public"."schizophrenia_egf"."test_done" IS 'Flag indicating if the test was administered';

-- Table: schizophrenia_bars
ALTER TABLE "public"."schizophrenia_bars" ADD COLUMN IF NOT EXISTS "test_done" BOOLEAN DEFAULT TRUE;
COMMENT ON COLUMN "public"."schizophrenia_bars"."test_done" IS 'Flag indicating if the test was administered';

-- Table: schizophrenia_sumd
ALTER TABLE "public"."schizophrenia_sumd" ADD COLUMN IF NOT EXISTS "test_done" BOOLEAN DEFAULT TRUE;
COMMENT ON COLUMN "public"."schizophrenia_sumd"."test_done" IS 'Flag indicating if the test was administered';

-- Table: schizophrenia_aims
ALTER TABLE "public"."schizophrenia_aims" ADD COLUMN IF NOT EXISTS "test_done" BOOLEAN DEFAULT TRUE;
COMMENT ON COLUMN "public"."schizophrenia_aims"."test_done" IS 'Flag indicating if the test was administered';

-- Table: schizophrenia_barnes
ALTER TABLE "public"."schizophrenia_barnes" ADD COLUMN IF NOT EXISTS "test_done" BOOLEAN DEFAULT TRUE;
COMMENT ON COLUMN "public"."schizophrenia_barnes"."test_done" IS 'Flag indicating if the test was administered';

-- Table: schizophrenia_sas
ALTER TABLE "public"."schizophrenia_sas" ADD COLUMN IF NOT EXISTS "test_done" BOOLEAN DEFAULT TRUE;
COMMENT ON COLUMN "public"."schizophrenia_sas"."test_done" IS 'Flag indicating if the test was administered';

-- Table: schizophrenia_psp
ALTER TABLE "public"."schizophrenia_psp" ADD COLUMN IF NOT EXISTS "test_done" BOOLEAN DEFAULT TRUE;
COMMENT ON COLUMN "public"."schizophrenia_psp"."test_done" IS 'Flag indicating if the test was administered';
