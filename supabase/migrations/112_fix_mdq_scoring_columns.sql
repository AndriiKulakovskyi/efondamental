-- ============================================================================
-- Fix MDQ (Mood Disorder Questionnaire) Scoring Columns
-- ============================================================================
-- This migration:
-- 1. Changes q1_1 to q1_13 and q2 from BOOLEAN to INTEGER (0 or 1)
-- 2. Adds q1_score column to store the sum of question 1 items (0-13)
-- 3. Removes 'positive_screen' and replaces with 'interpretation'
--
-- Scoring algorithm:
-- - Q1 Score: Sum of q1_1 to q1_13 (Oui=1, Non=0)
-- - MDQ POSITIVE if: Q1 >= 7 AND Q2 = 1 (Yes) AND Q3 >= 2 ("Problème moyen" or "Problème sérieux")
-- - Otherwise: MDQ NEGATIVE
-- ============================================================================

-- Convert BOOLEAN columns to INTEGER for q1_1 through q1_13 and q2
-- This is idempotent - checks if already INTEGER and handles both cases
DO $$ 
DECLARE
  column_type TEXT;
BEGIN
  -- Check if q1_1 is BOOLEAN or INTEGER and convert if needed
  FOR i IN 1..13 LOOP
    SELECT data_type INTO column_type 
    FROM information_schema.columns 
    WHERE table_name = 'responses_mdq' 
    AND column_name = 'q1_' || i;
    
    IF column_type = 'boolean' THEN
      EXECUTE format('ALTER TABLE responses_mdq ALTER COLUMN q1_%s TYPE INTEGER USING (CASE WHEN q1_%s THEN 1 ELSE 0 END)', i, i);
    END IF;
    
    -- Ensure NOT NULL constraint
    EXECUTE format('ALTER TABLE responses_mdq ALTER COLUMN q1_%s SET NOT NULL', i);
    
    -- Add check constraint if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_q1_' || i) THEN
      EXECUTE format('ALTER TABLE responses_mdq ADD CONSTRAINT check_q1_%s CHECK (q1_%s IN (0, 1))', i, i);
    END IF;
  END LOOP;
  
  -- Handle q2 (can be NULL)
  SELECT data_type INTO column_type 
  FROM information_schema.columns 
  WHERE table_name = 'responses_mdq' 
  AND column_name = 'q2';
  
  IF column_type = 'boolean' THEN
    ALTER TABLE responses_mdq ALTER COLUMN q2 TYPE INTEGER USING (CASE WHEN q2 IS NULL THEN NULL WHEN q2 THEN 1 ELSE 0 END);
  END IF;
  
  -- Add check constraint for q2 if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_q2') THEN
    ALTER TABLE responses_mdq ADD CONSTRAINT check_q2 CHECK (q2 IS NULL OR q2 IN (0, 1));
  END IF;
END $$;

-- Add the q1_score column to store the sum of question 1 items
ALTER TABLE responses_mdq ADD COLUMN IF NOT EXISTS q1_score INTEGER;

-- Add interpretation column to replace positive_screen
ALTER TABLE responses_mdq ADD COLUMN IF NOT EXISTS interpretation TEXT;

-- Drop the old positive_screen column if it exists
ALTER TABLE responses_mdq DROP COLUMN IF EXISTS positive_screen;

-- Add check constraint for q1_score (should be between 0 and 13)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'check_q1_score_range') THEN
    ALTER TABLE responses_mdq ADD CONSTRAINT check_q1_score_range CHECK (q1_score IS NULL OR (q1_score >= 0 AND q1_score <= 13));
  END IF;
END $$;

-- Add unique constraint on visit_id for upsert operations (if not exists)
-- Note: This may already exist from migration 101, so we check first
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'responses_mdq_visit_id_key'
  ) THEN
    ALTER TABLE responses_mdq ADD CONSTRAINT responses_mdq_visit_id_key UNIQUE (visit_id);
  END IF;
END $$;

-- RLS policies for professionals are already added in migration 101
-- No need to duplicate them here
