-- ============================================================================
-- Fix WAIS-III Digit Span Column Types
-- ============================================================================
-- This migration fixes column types in bipolar_wais3_digit_span table.
-- The wais_mc_cr (standardized value) is calculated as (standard_score - 10) / 3
-- which produces decimal values like 1.67, so it must be DECIMAL, not INTEGER.
-- ============================================================================

-- Change wais_mc_cr from INTEGER to DECIMAL(5,2)
-- This is the standardized value calculated as (wais_mc_std - 10) / 3
ALTER TABLE bipolar_wais3_digit_span
  ALTER COLUMN wais_mc_cr TYPE DECIMAL(5,2);

-- Also ensure z-score columns are DECIMAL (they should be, but ensure consistency)
ALTER TABLE bipolar_wais3_digit_span
  ALTER COLUMN wais_mc_end_z TYPE DECIMAL(5,2),
  ALTER COLUMN wais_mc_env_z TYPE DECIMAL(5,2);

-- Add comments for clarity
COMMENT ON COLUMN bipolar_wais3_digit_span.wais_mc_cr IS 'Standardized value: (wais_mc_std - 10) / 3 - Decimal value';
COMMENT ON COLUMN bipolar_wais3_digit_span.wais_mc_end_z IS 'Forward span z-score - Decimal value';
COMMENT ON COLUMN bipolar_wais3_digit_span.wais_mc_env_z IS 'Backward span z-score - Decimal value';

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Fixed WAIS-III Digit Span column types: wais_mc_cr and z-score columns now DECIMAL(5,2)';
END $$;
