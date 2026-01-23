-- Convert any remaining BOOLEAN columns in bipolar_dsm5_comorbid to a tri-state enum.
--
-- The application submits DSM5_COMORBID answers using string codes:
--   'oui' | 'non' | 'ne_sais_pas'
-- Some environments still have BOOLEAN columns in bipolar_dsm5_comorbid, which causes errors like:
--   invalid input syntax for type boolean: "ne_sais_pas"
--
-- This migration:
-- - Creates a tri-state enum type public.yes_no_unknown_fr
-- - Finds ALL boolean columns in public.bipolar_dsm5_comorbid
-- - Converts each boolean column to public.yes_no_unknown_fr with:
--     true  -> 'oui'
--     false -> 'non'
--     null  -> null
-- - Triggers PostgREST schema reload

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typname = 'yes_no_unknown_fr'
  ) THEN
    CREATE TYPE public.yes_no_unknown_fr AS ENUM ('oui', 'non', 'ne_sais_pas');
  END IF;
END $$;

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'bipolar_dsm5_comorbid'
      AND data_type = 'boolean'
    ORDER BY ordinal_position
  LOOP
    EXECUTE format(
      'ALTER TABLE public.bipolar_dsm5_comorbid ' ||
      'ALTER COLUMN %I TYPE public.yes_no_unknown_fr ' ||
      'USING CASE ' ||
      'WHEN %I = true THEN ''oui''::public.yes_no_unknown_fr ' ||
      'WHEN %I = false THEN ''non''::public.yes_no_unknown_fr ' ||
      'ELSE NULL END',
      r.column_name, r.column_name, r.column_name
    );
  END LOOP;

  PERFORM pg_sleep(0.2);
  NOTIFY pgrst, 'reload schema';
  PERFORM pg_sleep(0.2);
  NOTIFY pgrst, 'reload config';
END $$;

