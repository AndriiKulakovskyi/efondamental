-- ============================================================================
-- eFondaMental Platform - Add WAIS-III Vocabulaire Scoring Columns
-- ============================================================================
-- This migration adds columns for age-stratified scoring:
-- - patient_age: Required for normative comparison
-- - standard_score: Age-adjusted scaled score (1-19)
-- - standardized_value: Normalized score with mean=10, SD=3
-- ============================================================================

-- ============================================================================
-- Add scoring columns to responses_wais3_vocabulaire
-- ============================================================================

-- Add patient age (required for age-stratified scoring)
ALTER TABLE responses_wais3_vocabulaire
    ADD COLUMN IF NOT EXISTS patient_age INTEGER NOT NULL DEFAULT 0;

-- Add standard score (age-adjusted scaled score, 1-19)
ALTER TABLE responses_wais3_vocabulaire
    ADD COLUMN IF NOT EXISTS standard_score INTEGER CHECK (standard_score IS NULL OR (standard_score BETWEEN 1 AND 19));

-- Add standardized value (z-score transformation: (standard_score - 10) / 3)
ALTER TABLE responses_wais3_vocabulaire
    ADD COLUMN IF NOT EXISTS standardized_value DECIMAL(5,2);

-- Remove the default constraint after adding the column (for backward compatibility)
ALTER TABLE responses_wais3_vocabulaire
    ALTER COLUMN patient_age DROP DEFAULT;

-- ============================================================================
-- Add comments for documentation
-- ============================================================================

COMMENT ON COLUMN responses_wais3_vocabulaire.patient_age IS 'Patient age at time of assessment (required for age-stratified scoring)';
COMMENT ON COLUMN responses_wais3_vocabulaire.standard_score IS 'Age-adjusted standard score (1-19) from WAIS-III normative tables';
COMMENT ON COLUMN responses_wais3_vocabulaire.standardized_value IS 'Standardized value with mean=10, SD=3: (standard_score - 10) / 3';
COMMENT ON COLUMN responses_wais3_vocabulaire.total_raw_score IS 'Sum of all 33 item scores (0-66), computed automatically by database';

