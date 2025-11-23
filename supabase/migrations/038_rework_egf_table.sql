-- eFondaMental Platform - Rework EGF Table
-- Simplifies the EGF (Échelle de Fonctionnement Global) table to use a single score field

-- ============================================================================
-- EGF (Échelle de Fonctionnement Global) - Table Restructure
-- ============================================================================

-- Step 1: Backup existing data (if any) into current_functioning field
-- This preserves any existing data in the current_functioning field

-- Step 2: Drop old columns
ALTER TABLE responses_egf DROP COLUMN IF EXISTS worst_past_year;
ALTER TABLE responses_egf DROP COLUMN IF EXISTS best_past_year;
ALTER TABLE responses_egf DROP COLUMN IF EXISTS current_interpretation;
ALTER TABLE responses_egf DROP COLUMN IF EXISTS worst_interpretation;
ALTER TABLE responses_egf DROP COLUMN IF EXISTS best_interpretation;

-- Step 3: Rename current_functioning to egf_score (if it exists)
DO $$ 
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'responses_egf' 
    AND column_name = 'current_functioning'
  ) THEN
    ALTER TABLE responses_egf RENAME COLUMN current_functioning TO egf_score;
  END IF;
END $$;

-- Step 4: Add egf_score if it doesn't exist (in case of fresh install)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'responses_egf' 
    AND column_name = 'egf_score'
  ) THEN
    ALTER TABLE responses_egf ADD COLUMN egf_score INTEGER CHECK (egf_score BETWEEN 1 AND 100);
  END IF;
END $$;

-- Step 5: Add single interpretation column
ALTER TABLE responses_egf ADD COLUMN IF NOT EXISTS interpretation TEXT;

-- Step 6: Update constraint for egf_score (ensure it's correct)
ALTER TABLE responses_egf DROP CONSTRAINT IF EXISTS responses_egf_egf_score_check;
ALTER TABLE responses_egf ADD CONSTRAINT responses_egf_egf_score_check 
    CHECK (egf_score IS NULL OR (egf_score BETWEEN 1 AND 100));

-- Note: Existing RLS policies, triggers, and other metadata remain unchanged

