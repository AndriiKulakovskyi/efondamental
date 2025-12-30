-- ============================================================================
-- Update WAIS-IV Code to use app-computed scores
-- ============================================================================
-- This migration changes raw_score from GENERATED to allow app-computed values

-- Change raw_score from GENERATED ALWAYS to regular column
ALTER TABLE responses_wais4_code 
  ALTER COLUMN raw_score DROP EXPRESSION IF EXISTS;

-- Ensure column type is correct
ALTER TABLE responses_wais4_code 
  ALTER COLUMN raw_score TYPE INTEGER;

-- Add comments
COMMENT ON COLUMN responses_wais4_code.raw_score IS 'Raw total score (app-computed from total correct boxes)';
COMMENT ON COLUMN responses_wais4_code.standardized_score IS 'Standard score from WAIS-IV age-based norms (1-19)';
COMMENT ON COLUMN responses_wais4_code.z_score IS 'Standardized value (z-score): (std_score - 10) / 3';

