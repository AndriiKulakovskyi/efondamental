-- Fix bipolar_family_history anxiety and dementia fields
-- Change from BOOLEAN to VARCHAR to allow 'oui', 'non', 'ne_sais_pas' values

-- Drop all dementia boolean fields and recreate as VARCHAR
ALTER TABLE bipolar_family_history
  ALTER COLUMN mother_dementia TYPE VARCHAR(20) USING 
    CASE 
      WHEN mother_dementia = true THEN 'oui'
      WHEN mother_dementia = false THEN 'non'
      ELSE NULL
    END,
  ALTER COLUMN father_dementia TYPE VARCHAR(20) USING
    CASE 
      WHEN father_dementia = true THEN 'oui'
      WHEN father_dementia = false THEN 'non'
      ELSE NULL
    END;

-- Add constraints
ALTER TABLE bipolar_family_history
  ADD CONSTRAINT mother_dementia_check CHECK (mother_dementia IN ('oui', 'non', 'ne_sais_pas')),
  ADD CONSTRAINT father_dementia_check CHECK (father_dementia IN ('oui', 'non', 'ne_sais_pas'));

-- Grandparents dementia fields
ALTER TABLE bipolar_family_history
  ALTER COLUMN grandmother_maternal_dementia TYPE VARCHAR(20) USING
    CASE 
      WHEN grandmother_maternal_dementia = true THEN 'oui'
      WHEN grandmother_maternal_dementia = false THEN 'non'
      ELSE NULL
    END,
  ALTER COLUMN grandmother_paternal_dementia TYPE VARCHAR(20) USING
    CASE 
      WHEN grandmother_paternal_dementia = true THEN 'oui'
      WHEN grandmother_paternal_dementia = false THEN 'non'
      ELSE NULL
    END,
  ALTER COLUMN grandfather_maternal_dementia TYPE VARCHAR(20) USING
    CASE 
      WHEN grandfather_maternal_dementia = true THEN 'oui'
      WHEN grandfather_maternal_dementia = false THEN 'non'
      ELSE NULL
    END,
  ALTER COLUMN grandfather_paternal_dementia TYPE VARCHAR(20) USING
    CASE 
      WHEN grandfather_paternal_dementia = true THEN 'oui'
      WHEN grandfather_paternal_dementia = false THEN 'non'
      ELSE NULL
    END;

ALTER TABLE bipolar_family_history
  ADD CONSTRAINT grandmother_maternal_dementia_check CHECK (grandmother_maternal_dementia IN ('oui', 'non', 'ne_sais_pas')),
  ADD CONSTRAINT grandmother_paternal_dementia_check CHECK (grandmother_paternal_dementia IN ('oui', 'non', 'ne_sais_pas')),
  ADD CONSTRAINT grandfather_maternal_dementia_check CHECK (grandfather_maternal_dementia IN ('oui', 'non', 'ne_sais_pas')),
  ADD CONSTRAINT grandfather_paternal_dementia_check CHECK (grandfather_paternal_dementia IN ('oui', 'non', 'ne_sais_pas'));

-- Children/Siblings dementia fields (daughter1-5, son1-5, sister1-5, brother1-5)
DO $$
DECLARE
  rel_type TEXT;
  num INTEGER;
  col_name TEXT;
BEGIN
  FOR rel_type IN SELECT unnest(ARRAY['daughter', 'son', 'sister', 'brother']) LOOP
    FOR num IN 1..5 LOOP
      col_name := rel_type || num || '_dementia';
      
      -- Check if column exists
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bipolar_family_history' 
        AND column_name = col_name
      ) THEN
        EXECUTE format('
          ALTER TABLE bipolar_family_history
          ALTER COLUMN %I TYPE VARCHAR(20) USING
            CASE 
              WHEN %I = true THEN ''oui''
              WHEN %I = false THEN ''non''
              ELSE NULL
            END
        ', col_name, col_name, col_name);
        
        EXECUTE format('
          ALTER TABLE bipolar_family_history
          ADD CONSTRAINT %I CHECK (%I IN (''oui'', ''non'', ''ne_sais_pas''))
        ', col_name || '_check', col_name);
      END IF;
    END LOOP;
  END LOOP;
END $$;

-- Also convert anxiety fields from JSONB to VARCHAR
-- These should store 'oui', 'non', or 'ne_sais_pas' as simple strings
ALTER TABLE bipolar_family_history
  ALTER COLUMN mother_anxiety TYPE VARCHAR(20) USING 
    CASE 
      WHEN mother_anxiety::text = 'true' THEN 'oui'
      WHEN mother_anxiety::text = 'false' THEN 'non'
      ELSE NULL
    END,
  ALTER COLUMN father_anxiety TYPE VARCHAR(20) USING
    CASE 
      WHEN father_anxiety::text = 'true' THEN 'oui'
      WHEN father_anxiety::text = 'false' THEN 'non'
      ELSE NULL
    END;

ALTER TABLE bipolar_family_history
  ADD CONSTRAINT mother_anxiety_check CHECK (mother_anxiety IN ('oui', 'non', 'ne_sais_pas')),
  ADD CONSTRAINT father_anxiety_check CHECK (father_anxiety IN ('oui', 'non', 'ne_sais_pas'));

-- Grandparents anxiety
DO $$
DECLARE
  gp_type TEXT;
  col_name TEXT;
BEGIN
  FOR gp_type IN SELECT unnest(ARRAY['grandmother_maternal', 'grandmother_paternal', 'grandfather_maternal', 'grandfather_paternal']) LOOP
    col_name := gp_type || '_anxiety';
    
    IF EXISTS (
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'bipolar_family_history' 
      AND column_name = col_name
    ) THEN
      EXECUTE format('
        ALTER TABLE bipolar_family_history
        ALTER COLUMN %I TYPE VARCHAR(20) USING
          CASE 
            WHEN %I::text = ''true'' THEN ''oui''
            WHEN %I::text = ''false'' THEN ''non''
            ELSE NULL
          END
      ', col_name, col_name, col_name);
      
      EXECUTE format('
        ALTER TABLE bipolar_family_history
        ADD CONSTRAINT %I CHECK (%I IN (''oui'', ''non'', ''ne_sais_pas''))
      ', col_name || '_check', col_name);
    END IF;
  END LOOP;
END $$;

-- Children/Siblings anxiety fields
DO $$
DECLARE
  rel_type TEXT;
  num INTEGER;
  col_name TEXT;
BEGIN
  FOR rel_type IN SELECT unnest(ARRAY['daughter', 'son', 'sister', 'brother']) LOOP
    FOR num IN 1..5 LOOP
      col_name := rel_type || num || '_anxiety';
      
      IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'bipolar_family_history' 
        AND column_name = col_name
      ) THEN
        EXECUTE format('
          ALTER TABLE bipolar_family_history
          ALTER COLUMN %I TYPE VARCHAR(20) USING
            CASE 
              WHEN %I::text = ''true'' THEN ''oui''
              WHEN %I::text = ''false'' THEN ''non''
              ELSE NULL
            END
        ', col_name, col_name, col_name);
        
        EXECUTE format('
          ALTER TABLE bipolar_family_history
          ADD CONSTRAINT %I CHECK (%I IN (''oui'', ''non'', ''ne_sais_pas''))
        ', col_name || '_check', col_name);
      END IF;
    END LOOP;
  END LOOP;
END $$;
