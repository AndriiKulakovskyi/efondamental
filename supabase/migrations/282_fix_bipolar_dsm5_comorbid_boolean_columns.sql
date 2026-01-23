-- Fix bipolar_dsm5_comorbid boolean columns
-- The application submits 'oui'/'non' strings for these DSM5_COMORBID fields,
-- but some environments have them as BOOLEAN, which causes Postgres errors like:
-- invalid input syntax for type boolean: "oui"

DO $$
BEGIN
  -- Convert BOOLEAN columns to VARCHAR(10) with 'oui'/'non' values
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'bipolar_dsm5_comorbid'
      AND column_name = 'anorexia_bulimic_amenorrhea'
      AND data_type = 'boolean'
  ) THEN
    ALTER TABLE public.bipolar_dsm5_comorbid
      ALTER COLUMN anorexia_bulimic_amenorrhea TYPE VARCHAR(10)
      USING CASE
        WHEN anorexia_bulimic_amenorrhea = true THEN 'oui'
        WHEN anorexia_bulimic_amenorrhea = false THEN 'non'
        ELSE NULL
      END;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'bipolar_dsm5_comorbid'
      AND column_name = 'anorexia_bulimic_current'
      AND data_type = 'boolean'
  ) THEN
    ALTER TABLE public.bipolar_dsm5_comorbid
      ALTER COLUMN anorexia_bulimic_current TYPE VARCHAR(10)
      USING CASE
        WHEN anorexia_bulimic_current = true THEN 'oui'
        WHEN anorexia_bulimic_current = false THEN 'non'
        ELSE NULL
      END;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'bipolar_dsm5_comorbid'
      AND column_name = 'anorexia_restrictive_amenorrhea'
      AND data_type = 'boolean'
  ) THEN
    ALTER TABLE public.bipolar_dsm5_comorbid
      ALTER COLUMN anorexia_restrictive_amenorrhea TYPE VARCHAR(10)
      USING CASE
        WHEN anorexia_restrictive_amenorrhea = true THEN 'oui'
        WHEN anorexia_restrictive_amenorrhea = false THEN 'non'
        ELSE NULL
      END;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'bipolar_dsm5_comorbid'
      AND column_name = 'anorexia_restrictive_current'
      AND data_type = 'boolean'
  ) THEN
    ALTER TABLE public.bipolar_dsm5_comorbid
      ALTER COLUMN anorexia_restrictive_current TYPE VARCHAR(10)
      USING CASE
        WHEN anorexia_restrictive_current = true THEN 'oui'
        WHEN anorexia_restrictive_current = false THEN 'non'
        ELSE NULL
      END;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'bipolar_dsm5_comorbid'
      AND column_name = 'binge_eating_current'
      AND data_type = 'boolean'
  ) THEN
    ALTER TABLE public.bipolar_dsm5_comorbid
      ALTER COLUMN binge_eating_current TYPE VARCHAR(10)
      USING CASE
        WHEN binge_eating_current = true THEN 'oui'
        WHEN binge_eating_current = false THEN 'non'
        ELSE NULL
      END;
  END IF;

  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'bipolar_dsm5_comorbid'
      AND column_name = 'bulimia_current'
      AND data_type = 'boolean'
  ) THEN
    ALTER TABLE public.bipolar_dsm5_comorbid
      ALTER COLUMN bulimia_current TYPE VARCHAR(10)
      USING CASE
        WHEN bulimia_current = true THEN 'oui'
        WHEN bulimia_current = false THEN 'non'
        ELSE NULL
      END;
  END IF;

  -- Add CHECK constraints (idempotent)
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bdsm5c_anorexia_bulimic_amenorrhea_chk'
  ) THEN
    ALTER TABLE public.bipolar_dsm5_comorbid
      ADD CONSTRAINT bdsm5c_anorexia_bulimic_amenorrhea_chk
      CHECK (anorexia_bulimic_amenorrhea IN ('oui', 'non'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bdsm5c_anorexia_bulimic_current_chk'
  ) THEN
    ALTER TABLE public.bipolar_dsm5_comorbid
      ADD CONSTRAINT bdsm5c_anorexia_bulimic_current_chk
      CHECK (anorexia_bulimic_current IN ('oui', 'non'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bdsm5c_anorexia_restrictive_amenorrhea_chk'
  ) THEN
    ALTER TABLE public.bipolar_dsm5_comorbid
      ADD CONSTRAINT bdsm5c_anorexia_restrictive_amenorrhea_chk
      CHECK (anorexia_restrictive_amenorrhea IN ('oui', 'non'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bdsm5c_anorexia_restrictive_current_chk'
  ) THEN
    ALTER TABLE public.bipolar_dsm5_comorbid
      ADD CONSTRAINT bdsm5c_anorexia_restrictive_current_chk
      CHECK (anorexia_restrictive_current IN ('oui', 'non'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bdsm5c_binge_eating_current_chk'
  ) THEN
    ALTER TABLE public.bipolar_dsm5_comorbid
      ADD CONSTRAINT bdsm5c_binge_eating_current_chk
      CHECK (binge_eating_current IN ('oui', 'non'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'bdsm5c_bulimia_current_chk'
  ) THEN
    ALTER TABLE public.bipolar_dsm5_comorbid
      ADD CONSTRAINT bdsm5c_bulimia_current_chk
      CHECK (bulimia_current IN ('oui', 'non'));
  END IF;

  -- Trigger PostgREST schema cache reload
  PERFORM pg_sleep(0.2);
  NOTIFY pgrst, 'reload schema';
  PERFORM pg_sleep(0.2);
  NOTIFY pgrst, 'reload config';
END $$;

