-- ============================================================================
-- Fix WAIS-III Matrices total_raw_score Column
-- ============================================================================
-- Convert total_raw_score from a GENERATED ALWAYS column to a regular nullable
-- column so it can be computed in the application and saved to the database.
-- This allows for proper validation (scores should be null if any items are missing).
-- ============================================================================

-- Drop the generated column and recreate it as a regular column
ALTER TABLE responses_wais3_matrices 
DROP COLUMN total_raw_score;

ALTER TABLE responses_wais3_matrices 
ADD COLUMN total_raw_score INTEGER CHECK (total_raw_score BETWEEN 0 AND 26);

-- Add comment for documentation
COMMENT ON COLUMN responses_wais3_matrices.total_raw_score IS 
'Total raw score computed in application (sum of 26 items). Can be null if validation fails.';

