-- ============================================================================
-- Update Test des Commissions to Manual Entry
-- ============================================================================
-- This migration removes automatic calculations and allows manual entry
-- of all fields including percentiles and z-scores
-- ============================================================================

-- Make raw score fields optional (remove NOT NULL constraints)
ALTER TABLE responses_test_commissions
  ALTER COLUMN com01 DROP NOT NULL,
  ALTER COLUMN com02 DROP NOT NULL,
  ALTER COLUMN com03 DROP NOT NULL,
  ALTER COLUMN com04 DROP NOT NULL;

-- Clear existing text-based percentile values (cannot be converted to numeric)
UPDATE responses_test_commissions
SET com01s1 = NULL,
    com02s1 = NULL,
    com03s1 = NULL,
    com04s1 = NULL,
    com04s4 = NULL;

-- Change percentile fields from TEXT to DECIMAL to match number type
ALTER TABLE responses_test_commissions
  ALTER COLUMN com01s1 TYPE DECIMAL(6,2) USING NULL,
  ALTER COLUMN com02s1 TYPE DECIMAL(6,2) USING NULL,
  ALTER COLUMN com03s1 TYPE DECIMAL(6,2) USING NULL,
  ALTER COLUMN com04s1 TYPE DECIMAL(6,2) USING NULL,
  ALTER COLUMN com04s4 TYPE DECIMAL(6,2) USING NULL;

-- Add comments
COMMENT ON COLUMN responses_test_commissions.com01 IS 'Time in minutes (manual entry)';
COMMENT ON COLUMN responses_test_commissions.com02 IS 'Number of unnecessary detours (manual entry)';
COMMENT ON COLUMN responses_test_commissions.com03 IS 'Number of schedule violations (manual entry)';
COMMENT ON COLUMN responses_test_commissions.com04 IS 'Number of logical errors (manual entry)';
COMMENT ON COLUMN responses_test_commissions.com01s1 IS 'Percentile for time (manual entry)';
COMMENT ON COLUMN responses_test_commissions.com02s1 IS 'Percentile for detours (manual entry)';
COMMENT ON COLUMN responses_test_commissions.com03s1 IS 'Percentile for schedule violations (manual entry)';
COMMENT ON COLUMN responses_test_commissions.com04s1 IS 'Percentile for logical errors (manual entry)';
COMMENT ON COLUMN responses_test_commissions.com04s3 IS 'Total errors (manual entry)';
COMMENT ON COLUMN responses_test_commissions.com04s4 IS 'Percentile for total errors (manual entry)';

