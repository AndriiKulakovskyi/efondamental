-- ============================================================================
-- Migration: Add Score AUTO-YALE-BROWN columns (SYB1-SYB10) to schizophrenia_ybocs
-- Date: 2026-01-30
-- Description: Adds 10 summary items (simplified version) for quick scoring
-- ============================================================================

-- Add SYB columns (Score AUTO-YALE-BROWN summary items)
ALTER TABLE "public"."schizophrenia_ybocs"
    ADD COLUMN IF NOT EXISTS "syb1" integer,
    ADD COLUMN IF NOT EXISTS "syb2" integer,
    ADD COLUMN IF NOT EXISTS "syb3" integer,
    ADD COLUMN IF NOT EXISTS "syb4" integer,
    ADD COLUMN IF NOT EXISTS "syb5" integer,
    ADD COLUMN IF NOT EXISTS "syb6" integer,
    ADD COLUMN IF NOT EXISTS "syb7" integer,
    ADD COLUMN IF NOT EXISTS "syb8" integer,
    ADD COLUMN IF NOT EXISTS "syb9" integer,
    ADD COLUMN IF NOT EXISTS "syb10" integer;

-- Add check constraints for SYB columns (valid score range 0-4)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'schizophrenia_ybocs_syb1_check') THEN
        ALTER TABLE "public"."schizophrenia_ybocs" ADD CONSTRAINT schizophrenia_ybocs_syb1_check CHECK (syb1 IS NULL OR (syb1 >= 0 AND syb1 <= 4));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'schizophrenia_ybocs_syb2_check') THEN
        ALTER TABLE "public"."schizophrenia_ybocs" ADD CONSTRAINT schizophrenia_ybocs_syb2_check CHECK (syb2 IS NULL OR (syb2 >= 0 AND syb2 <= 4));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'schizophrenia_ybocs_syb3_check') THEN
        ALTER TABLE "public"."schizophrenia_ybocs" ADD CONSTRAINT schizophrenia_ybocs_syb3_check CHECK (syb3 IS NULL OR (syb3 >= 0 AND syb3 <= 4));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'schizophrenia_ybocs_syb4_check') THEN
        ALTER TABLE "public"."schizophrenia_ybocs" ADD CONSTRAINT schizophrenia_ybocs_syb4_check CHECK (syb4 IS NULL OR (syb4 >= 0 AND syb4 <= 4));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'schizophrenia_ybocs_syb5_check') THEN
        ALTER TABLE "public"."schizophrenia_ybocs" ADD CONSTRAINT schizophrenia_ybocs_syb5_check CHECK (syb5 IS NULL OR (syb5 >= 0 AND syb5 <= 4));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'schizophrenia_ybocs_syb6_check') THEN
        ALTER TABLE "public"."schizophrenia_ybocs" ADD CONSTRAINT schizophrenia_ybocs_syb6_check CHECK (syb6 IS NULL OR (syb6 >= 0 AND syb6 <= 4));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'schizophrenia_ybocs_syb7_check') THEN
        ALTER TABLE "public"."schizophrenia_ybocs" ADD CONSTRAINT schizophrenia_ybocs_syb7_check CHECK (syb7 IS NULL OR (syb7 >= 0 AND syb7 <= 4));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'schizophrenia_ybocs_syb8_check') THEN
        ALTER TABLE "public"."schizophrenia_ybocs" ADD CONSTRAINT schizophrenia_ybocs_syb8_check CHECK (syb8 IS NULL OR (syb8 >= 0 AND syb8 <= 4));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'schizophrenia_ybocs_syb9_check') THEN
        ALTER TABLE "public"."schizophrenia_ybocs" ADD CONSTRAINT schizophrenia_ybocs_syb9_check CHECK (syb9 IS NULL OR (syb9 >= 0 AND syb9 <= 4));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'schizophrenia_ybocs_syb10_check') THEN
        ALTER TABLE "public"."schizophrenia_ybocs" ADD CONSTRAINT schizophrenia_ybocs_syb10_check CHECK (syb10 IS NULL OR (syb10 >= 0 AND syb10 <= 4));
    END IF;
END $$;

-- Add column comments
COMMENT ON COLUMN "public"."schizophrenia_ybocs"."syb1" IS 'Score AUTO-YALE-BROWN: 1. Temps passé aux obsessions (0-4)';
COMMENT ON COLUMN "public"."schizophrenia_ybocs"."syb2" IS 'Score AUTO-YALE-BROWN: 2. Gêne liée aux obsessions (0-4)';
COMMENT ON COLUMN "public"."schizophrenia_ybocs"."syb3" IS 'Score AUTO-YALE-BROWN: 3. Angoisse associée aux obsessions (0-4)';
COMMENT ON COLUMN "public"."schizophrenia_ybocs"."syb4" IS 'Score AUTO-YALE-BROWN: 4. Résistance aux obsessions (0-4)';
COMMENT ON COLUMN "public"."schizophrenia_ybocs"."syb5" IS 'Score AUTO-YALE-BROWN: 5. Contrôle sur les obsessions (0-4)';
COMMENT ON COLUMN "public"."schizophrenia_ybocs"."syb6" IS 'Score AUTO-YALE-BROWN: 6. Temps passé aux compulsions (0-4)';
COMMENT ON COLUMN "public"."schizophrenia_ybocs"."syb7" IS 'Score AUTO-YALE-BROWN: 7. Gêne liée aux compulsions (0-4)';
COMMENT ON COLUMN "public"."schizophrenia_ybocs"."syb8" IS 'Score AUTO-YALE-BROWN: 8. Anxiété associée aux compulsions (0-4)';
COMMENT ON COLUMN "public"."schizophrenia_ybocs"."syb9" IS 'Score AUTO-YALE-BROWN: 9. Résistance aux compulsions (0-4)';
COMMENT ON COLUMN "public"."schizophrenia_ybocs"."syb10" IS 'Score AUTO-YALE-BROWN: 10. Contrôle sur les compulsions (0-4)';
