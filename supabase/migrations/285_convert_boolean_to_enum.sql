-- ============================================================================
-- Migration: Convert BOOLEAN columns to ENUM for yes/no values
-- ============================================================================
-- This migration converts remaining BOOLEAN columns that receive 'oui'/'non'
-- form values to the yes_no_fr ENUM type for better data quality.
--
-- Affected tables:
-- 1. bipolar_family_history: 20 *_has_issues columns
-- 2. bipolar_sleep_apnea: 9 STOP-Bang boolean columns
-- 3. bipolar_nurse_sleep_apnea: 9 STOP-Bang boolean columns
-- 4. responses_sleep_apnea: 9 STOP-Bang boolean columns (legacy)
--
-- Uses existing ENUM type: yes_no_fr ('oui', 'non') from migration 283
-- ============================================================================

-- Ensure the yes_no_fr ENUM type exists (created in migration 283)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typname = 'yes_no_fr'
  ) THEN
    CREATE TYPE public.yes_no_fr AS ENUM ('oui', 'non');
  END IF;
END $$;

-- ============================================================================
-- PART 1: bipolar_family_history - Convert *_has_issues and *_deceased fields to ENUM
-- ============================================================================

DO $$
DECLARE
  col_name TEXT;
  relatives TEXT[] := ARRAY['daughter', 'son', 'sister', 'brother'];
  grandparents TEXT[] := ARRAY['grandmother_maternal', 'grandmother_paternal', 'grandfather_maternal', 'grandfather_paternal'];
  parents TEXT[] := ARRAY['mother', 'father'];
  rel TEXT;
  i INTEGER;
BEGIN
  -- Convert relative *_has_issues and *_deceased fields
  FOREACH rel IN ARRAY relatives LOOP
    FOR i IN 1..5 LOOP
      -- Convert *_has_issues
      col_name := rel || i || '_has_issues';
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public'
          AND table_name = 'bipolar_family_history' 
          AND column_name = col_name
          AND data_type = 'boolean'
      ) THEN
        EXECUTE format(
          'ALTER TABLE public.bipolar_family_history ' ||
          'ALTER COLUMN %I TYPE public.yes_no_fr ' ||
          'USING CASE ' ||
          'WHEN %I = true THEN ''oui''::public.yes_no_fr ' ||
          'WHEN %I = false THEN ''non''::public.yes_no_fr ' ||
          'ELSE NULL END',
          col_name, col_name, col_name
        );
        RAISE NOTICE 'Converted bipolar_family_history.% to yes_no_fr ENUM', col_name;
      END IF;
      
      -- Convert *_deceased
      col_name := rel || i || '_deceased';
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public'
          AND table_name = 'bipolar_family_history' 
          AND column_name = col_name
          AND data_type = 'boolean'
      ) THEN
        EXECUTE format(
          'ALTER TABLE public.bipolar_family_history ' ||
          'ALTER COLUMN %I TYPE public.yes_no_fr ' ||
          'USING CASE ' ||
          'WHEN %I = true THEN ''oui''::public.yes_no_fr ' ||
          'WHEN %I = false THEN ''non''::public.yes_no_fr ' ||
          'ELSE NULL END',
          col_name, col_name, col_name
        );
        RAISE NOTICE 'Converted bipolar_family_history.% to yes_no_fr ENUM', col_name;
      END IF;
    END LOOP;
  END LOOP;
  
  -- Convert grandparent *_deceased fields
  FOREACH rel IN ARRAY grandparents LOOP
    col_name := rel || '_deceased';
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public'
        AND table_name = 'bipolar_family_history' 
        AND column_name = col_name
        AND data_type = 'boolean'
    ) THEN
      EXECUTE format(
        'ALTER TABLE public.bipolar_family_history ' ||
        'ALTER COLUMN %I TYPE public.yes_no_fr ' ||
        'USING CASE ' ||
        'WHEN %I = true THEN ''oui''::public.yes_no_fr ' ||
        'WHEN %I = false THEN ''non''::public.yes_no_fr ' ||
        'ELSE NULL END',
        col_name, col_name, col_name
      );
      RAISE NOTICE 'Converted bipolar_family_history.% to yes_no_fr ENUM', col_name;
    END IF;
  END LOOP;
  
  -- Convert parent *_deceased fields
  FOREACH rel IN ARRAY parents LOOP
    col_name := rel || '_deceased';
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public'
        AND table_name = 'bipolar_family_history' 
        AND column_name = col_name
        AND data_type = 'boolean'
    ) THEN
      EXECUTE format(
        'ALTER TABLE public.bipolar_family_history ' ||
        'ALTER COLUMN %I TYPE public.yes_no_fr ' ||
        'USING CASE ' ||
        'WHEN %I = true THEN ''oui''::public.yes_no_fr ' ||
        'WHEN %I = false THEN ''non''::public.yes_no_fr ' ||
        'ELSE NULL END',
        col_name, col_name, col_name
      );
      RAISE NOTICE 'Converted bipolar_family_history.% to yes_no_fr ENUM', col_name;
    END IF;
  END LOOP;
END $$;

-- ============================================================================
-- PART 2: bipolar_sleep_apnea - Convert STOP-Bang boolean fields to ENUM
-- ============================================================================

DO $$
DECLARE
  col_name TEXT;
  cols TEXT[] := ARRAY[
    'has_cpap_device', 'snoring', 'tiredness', 'observed_apnea',
    'hypertension', 'bmi_over_35', 'age_over_50', 'large_neck', 'male_gender'
  ];
BEGIN
  FOREACH col_name IN ARRAY cols LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public'
        AND table_name = 'bipolar_sleep_apnea' 
        AND column_name = col_name
        AND data_type = 'boolean'
    ) THEN
      EXECUTE format(
        'ALTER TABLE public.bipolar_sleep_apnea ' ||
        'ALTER COLUMN %I TYPE public.yes_no_fr ' ||
        'USING CASE ' ||
        'WHEN %I = true THEN ''oui''::public.yes_no_fr ' ||
        'WHEN %I = false THEN ''non''::public.yes_no_fr ' ||
        'ELSE NULL END',
        col_name, col_name, col_name
      );
      RAISE NOTICE 'Converted bipolar_sleep_apnea.% to yes_no_fr ENUM', col_name;
    END IF;
  END LOOP;
END $$;

-- ============================================================================
-- PART 3: bipolar_nurse_sleep_apnea - Convert STOP-Bang boolean fields to ENUM
-- ============================================================================

DO $$
DECLARE
  col_name TEXT;
  cols TEXT[] := ARRAY[
    'has_cpap_device', 'snoring', 'tiredness', 'observed_apnea',
    'hypertension', 'bmi_over_35', 'age_over_50', 'large_neck', 'male_gender'
  ];
BEGIN
  FOREACH col_name IN ARRAY cols LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public'
        AND table_name = 'bipolar_nurse_sleep_apnea' 
        AND column_name = col_name
        AND data_type = 'boolean'
    ) THEN
      EXECUTE format(
        'ALTER TABLE public.bipolar_nurse_sleep_apnea ' ||
        'ALTER COLUMN %I TYPE public.yes_no_fr ' ||
        'USING CASE ' ||
        'WHEN %I = true THEN ''oui''::public.yes_no_fr ' ||
        'WHEN %I = false THEN ''non''::public.yes_no_fr ' ||
        'ELSE NULL END',
        col_name, col_name, col_name
      );
      RAISE NOTICE 'Converted bipolar_nurse_sleep_apnea.% to yes_no_fr ENUM', col_name;
    END IF;
  END LOOP;
END $$;

-- ============================================================================
-- PART 4: responses_sleep_apnea - Convert STOP-Bang boolean fields to ENUM
-- (Legacy table name, if it still exists)
-- ============================================================================

DO $$
DECLARE
  col_name TEXT;
  cols TEXT[] := ARRAY[
    'has_cpap_device', 'snoring', 'tiredness', 'observed_apnea',
    'hypertension', 'bmi_over_35', 'age_over_50', 'large_neck', 'male_gender'
  ];
BEGIN
  FOREACH col_name IN ARRAY cols LOOP
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_schema = 'public'
        AND table_name = 'responses_sleep_apnea' 
        AND column_name = col_name
        AND data_type = 'boolean'
    ) THEN
      EXECUTE format(
        'ALTER TABLE public.responses_sleep_apnea ' ||
        'ALTER COLUMN %I TYPE public.yes_no_fr ' ||
        'USING CASE ' ||
        'WHEN %I = true THEN ''oui''::public.yes_no_fr ' ||
        'WHEN %I = false THEN ''non''::public.yes_no_fr ' ||
        'ELSE NULL END',
        col_name, col_name, col_name
      );
      RAISE NOTICE 'Converted responses_sleep_apnea.% to yes_no_fr ENUM', col_name;
    END IF;
  END LOOP;
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
-- Log completion
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE 'Migration 285 complete: Converted BOOLEAN columns to yes_no_fr ENUM for bipolar_family_history, bipolar_sleep_apnea, bipolar_nurse_sleep_apnea, and responses_sleep_apnea';
END $$;
