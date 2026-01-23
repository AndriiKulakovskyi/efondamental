-- Add strong typing for DSM5_COMORBID yes/no fields using a Postgres enum.
-- The application uses 'oui'/'non' string codes. Some environments had these columns as BOOLEAN,
-- which caused errors like: invalid input syntax for type boolean: "non".

DO $$
BEGIN
  -- Create enum type if it doesn't exist
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

DO $$
DECLARE
  col_name TEXT;
BEGIN
  -- These columns are modeled as 'oui'/'non' in the questionnaire, but were sometimes BOOLEAN.
  FOREACH col_name IN ARRAY ARRAY[
    'anorexia_bulimic_amenorrhea',
    'anorexia_bulimic_current',
    'anorexia_restrictive_amenorrhea',
    'anorexia_restrictive_current',
    'binge_eating_current',
    'bulimia_current'
  ]
  LOOP
    -- Drop redundant CHECK constraints from the previous fix (enum will enforce allowed values).
    EXECUTE format('ALTER TABLE public.bipolar_dsm5_comorbid DROP CONSTRAINT IF EXISTS %I', 'bdsm5c_' || col_name || '_chk');

    -- Convert BOOLEAN -> ENUM
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'bipolar_dsm5_comorbid'
        AND column_name = col_name
        AND data_type = 'boolean'
    ) THEN
      EXECUTE format(
        'ALTER TABLE public.bipolar_dsm5_comorbid ' ||
        'ALTER COLUMN %I TYPE public.yes_no_fr ' ||
        'USING CASE ' ||
        'WHEN %I = true THEN ''oui''::public.yes_no_fr ' ||
        'WHEN %I = false THEN ''non''::public.yes_no_fr ' ||
        'ELSE NULL END',
        col_name, col_name, col_name
      );
    END IF;

    -- Convert VARCHAR/TEXT -> ENUM (handles existing ''oui''/''non'' strings, case-insensitive).
    IF EXISTS (
      SELECT 1
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'bipolar_dsm5_comorbid'
        AND column_name = col_name
        AND data_type IN ('character varying', 'text')
    ) THEN
      EXECUTE format(
        'ALTER TABLE public.bipolar_dsm5_comorbid ' ||
        'ALTER COLUMN %I TYPE public.yes_no_fr ' ||
        'USING CASE ' ||
        'WHEN lower(%I::text) = ''oui'' THEN ''oui''::public.yes_no_fr ' ||
        'WHEN lower(%I::text) = ''non'' THEN ''non''::public.yes_no_fr ' ||
        'ELSE NULL END',
        col_name, col_name, col_name
      );
    END IF;
  END LOOP;

  -- Trigger PostgREST schema cache reload
  PERFORM pg_sleep(0.2);
  NOTIFY pgrst, 'reload schema';
  PERFORM pg_sleep(0.2);
  NOTIFY pgrst, 'reload config';
END $$;

