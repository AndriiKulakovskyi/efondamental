-- ============================================================================
-- Migration 286: Comprehensive BOOLEAN to ENUM Audit
-- ============================================================================
-- This migration provides a systematic approach to converting BOOLEAN columns
-- that store yes/no form input values to proper ENUM types.
--
-- PATTERN DOCUMENTATION:
-- =====================
-- When creating new questionnaire tables with yes/no fields, use:
--
--   1. For binary yes/no (French):
--      column_name public.yes_no_fr  -- Values: 'oui', 'non'
--
--   2. For tri-state with "don't know" (French):
--      column_name public.yes_no_unknown_fr  -- Values: 'oui', 'non', 'ne_sais_pas'
--
--   3. For English values (legacy compatibility):
--      column_name public.yes_no_en  -- Values: 'yes', 'no'
--      column_name public.yes_no_unknown_en  -- Values: 'yes', 'no', 'unknown'
--
-- DO NOT USE:
--   - BOOLEAN for form input fields (causes type errors with string values)
--   - VARCHAR with CHECK constraints (less type-safe than ENUM)
--
-- COMPUTED/METADATA FIELDS:
--   - BOOLEAN is acceptable for computed fields (e.g., eligibility_result)
--   - BOOLEAN is acceptable for system flags (e.g., active, read)
-- ============================================================================

-- ============================================================================
-- PART 1: Ensure all ENUM types exist
-- ============================================================================

-- French binary yes/no (created in migration 283)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public' AND t.typname = 'yes_no_fr'
  ) THEN
    CREATE TYPE public.yes_no_fr AS ENUM ('oui', 'non');
  END IF;
END $$;

-- French tri-state (created in migration 284)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public' AND t.typname = 'yes_no_unknown_fr'
  ) THEN
    CREATE TYPE public.yes_no_unknown_fr AS ENUM ('oui', 'non', 'ne_sais_pas');
  END IF;
END $$;

-- English binary yes/no (new)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public' AND t.typname = 'yes_no_en'
  ) THEN
    CREATE TYPE public.yes_no_en AS ENUM ('yes', 'no');
  END IF;
END $$;

-- English tri-state (new)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public' AND t.typname = 'yes_no_unknown_en'
  ) THEN
    CREATE TYPE public.yes_no_unknown_en AS ENUM ('yes', 'no', 'unknown');
  END IF;
END $$;

-- ============================================================================
-- PART 2: Convert remaining BOOLEAN form input columns
-- ============================================================================

-- 2.1: responses_tobacco.has_substitution
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
      AND table_name = 'responses_tobacco' 
      AND column_name = 'has_substitution'
      AND data_type = 'boolean'
  ) THEN
    ALTER TABLE public.responses_tobacco
    ALTER COLUMN has_substitution TYPE public.yes_no_fr
    USING CASE 
      WHEN has_substitution = true THEN 'oui'::public.yes_no_fr 
      WHEN has_substitution = false THEN 'non'::public.yes_no_fr 
      ELSE NULL 
    END;
    RAISE NOTICE 'Converted responses_tobacco.has_substitution to yes_no_fr ENUM';
  END IF;
END $$;

-- 2.2: bipolar_nurse_tobacco.has_substitution (if table exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public'
      AND table_name = 'bipolar_nurse_tobacco' 
      AND column_name = 'has_substitution'
      AND data_type = 'boolean'
  ) THEN
    ALTER TABLE public.bipolar_nurse_tobacco
    ALTER COLUMN has_substitution TYPE public.yes_no_fr
    USING CASE 
      WHEN has_substitution = true THEN 'oui'::public.yes_no_fr 
      WHEN has_substitution = false THEN 'non'::public.yes_no_fr 
      ELSE NULL 
    END;
    RAISE NOTICE 'Converted bipolar_nurse_tobacco.has_substitution to yes_no_fr ENUM';
  END IF;
END $$;

-- ============================================================================
-- PART 3: Convert VARCHAR yes/no/unknown fields to ENUM (English tables)
-- ============================================================================

-- Helper function to convert VARCHAR to yes_no_unknown_en ENUM
-- This standardizes tables that were using CHECK constraints

-- 3.1: responses_ecg fields
DO $$
DECLARE
  col_name TEXT;
  cols TEXT[] := ARRAY['ecg_performed', 'ecg_sent_to_cardiologist', 'cardiologist_consultation_requested'];
BEGIN
  FOREACH col_name IN ARRAY cols LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public'
        AND table_name = 'responses_ecg' 
        AND column_name = col_name
        AND data_type IN ('text', 'character varying')
    ) THEN
      -- Drop any existing CHECK constraints
      EXECUTE format(
        'ALTER TABLE public.responses_ecg DROP CONSTRAINT IF EXISTS %I',
        'responses_ecg_' || col_name || '_check'
      );
      -- Convert to ENUM
      EXECUTE format(
        'ALTER TABLE public.responses_ecg ' ||
        'ALTER COLUMN %I TYPE public.yes_no_en ' ||
        'USING CASE ' ||
        'WHEN lower(%I::text) = ''yes'' THEN ''yes''::public.yes_no_en ' ||
        'WHEN lower(%I::text) = ''no'' THEN ''no''::public.yes_no_en ' ||
        'ELSE NULL END',
        col_name, col_name, col_name
      );
      RAISE NOTICE 'Converted responses_ecg.% to yes_no_en ENUM', col_name;
    END IF;
  END LOOP;
END $$;

-- 3.2: bipolar_nurse_ecg fields (if table exists)
DO $$
DECLARE
  col_name TEXT;
  cols TEXT[] := ARRAY['ecg_performed', 'ecg_sent_to_cardiologist', 'cardiologist_consultation_requested'];
BEGIN
  FOREACH col_name IN ARRAY cols LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public'
        AND table_name = 'bipolar_nurse_ecg' 
        AND column_name = col_name
        AND data_type IN ('text', 'character varying')
    ) THEN
      EXECUTE format(
        'ALTER TABLE public.bipolar_nurse_ecg DROP CONSTRAINT IF EXISTS %I',
        'bipolar_nurse_ecg_' || col_name || '_check'
      );
      EXECUTE format(
        'ALTER TABLE public.bipolar_nurse_ecg ' ||
        'ALTER COLUMN %I TYPE public.yes_no_en ' ||
        'USING CASE ' ||
        'WHEN lower(%I::text) = ''yes'' THEN ''yes''::public.yes_no_en ' ||
        'WHEN lower(%I::text) = ''no'' THEN ''no''::public.yes_no_en ' ||
        'ELSE NULL END',
        col_name, col_name, col_name
      );
      RAISE NOTICE 'Converted bipolar_nurse_ecg.% to yes_no_en ENUM', col_name;
    END IF;
  END LOOP;
END $$;

-- ============================================================================
-- PART 4: Audit remaining BOOLEAN columns (informational)
-- ============================================================================

-- This query can be run to find any remaining BOOLEAN columns that might need review
-- Note: Not all BOOLEAN columns need conversion - computed fields and system flags are OK
DO $$
DECLARE
  r RECORD;
  count INTEGER := 0;
BEGIN
  RAISE NOTICE '--- AUDIT: Remaining BOOLEAN columns in response tables ---';
  FOR r IN
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name LIKE 'responses_%'
      AND data_type = 'boolean'
      AND column_name NOT IN ('active', 'read', 'success') -- Exclude system flags
    ORDER BY table_name, column_name
  LOOP
    RAISE NOTICE '  %.%', r.table_name, r.column_name;
    count := count + 1;
  END LOOP;
  
  FOR r IN
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name LIKE 'bipolar_%'
      AND data_type = 'boolean'
      AND column_name NOT IN ('active', 'read', 'success')
    ORDER BY table_name, column_name
  LOOP
    RAISE NOTICE '  %.%', r.table_name, r.column_name;
    count := count + 1;
  END LOOP;
  
  IF count = 0 THEN
    RAISE NOTICE '  (none found - all form input BOOLEAN columns have been converted)';
  ELSE
    RAISE NOTICE '  Total: % columns (review if these are form inputs or computed fields)', count;
  END IF;
END $$;

-- ============================================================================
-- Refresh PostgREST schema cache
-- ============================================================================

DO $$
BEGIN
  PERFORM pg_sleep(0.2);
  NOTIFY pgrst, 'reload schema';
  PERFORM pg_sleep(0.2);
  NOTIFY pgrst, 'reload config';
END $$;

-- ============================================================================
-- Summary
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '============================================================';
  RAISE NOTICE 'Migration 286 complete: Comprehensive BOOLEAN to ENUM audit';
  RAISE NOTICE '============================================================';
  RAISE NOTICE 'Created ENUM types:';
  RAISE NOTICE '  - yes_no_fr (oui, non)';
  RAISE NOTICE '  - yes_no_unknown_fr (oui, non, ne_sais_pas)';
  RAISE NOTICE '  - yes_no_en (yes, no)';
  RAISE NOTICE '  - yes_no_unknown_en (yes, no, unknown)';
  RAISE NOTICE '';
  RAISE NOTICE 'For new tables, use these ENUM types instead of:';
  RAISE NOTICE '  - BOOLEAN (causes type errors with string form values)';
  RAISE NOTICE '  - VARCHAR with CHECK constraints (less type-safe)';
  RAISE NOTICE '============================================================';
END $$;
