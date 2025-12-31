-- ============================================================================
-- eFondaMental Platform - WAIS-IV Digit Span Enhanced Computed Scores
-- ============================================================================
-- This migration adds comprehensive computed score columns for WAIS-IV 
-- Memoire des chiffres including:
-- - Individual item scores (sum of trial 1 + trial 2)
-- - Empan Z-scores with age-stratified normative data
-- - Empan difference score
-- - Standardized value
-- ============================================================================

-- Add individual item score columns for Ordre Direct (Forward)
ALTER TABLE responses_wais4_digit_span
ADD COLUMN IF NOT EXISTS wais_mcod_1 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcod_2 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcod_3 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcod_4 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcod_5 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcod_6 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcod_7 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcod_8 INTEGER;

-- Add individual item score columns for Ordre Inverse (Backward)
ALTER TABLE responses_wais4_digit_span
ADD COLUMN IF NOT EXISTS wais_mcoi_1 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcoi_2 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcoi_3 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcoi_4 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcoi_5 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcoi_6 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcoi_7 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcoi_8 INTEGER;

-- Add individual item score columns for Ordre Croissant (Sequencing)
ALTER TABLE responses_wais4_digit_span
ADD COLUMN IF NOT EXISTS wais_mcoc_1 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcoc_2 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcoc_3 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcoc_4 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcoc_5 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcoc_6 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcoc_7 INTEGER,
ADD COLUMN IF NOT EXISTS wais_mcoc_8 INTEGER;

-- Add empan Z-scores (age-stratified normative data)
ALTER TABLE responses_wais4_digit_span
ADD COLUMN IF NOT EXISTS wais_mc_end_std NUMERIC(5,2), -- Z-score for empan direct
ADD COLUMN IF NOT EXISTS wais_mc_env_std NUMERIC(5,2), -- Z-score for empan inverse
ADD COLUMN IF NOT EXISTS wais_mc_cro_std NUMERIC(5,2); -- Z-score for empan croissant

-- Add empan difference score (direct - inverse)
ALTER TABLE responses_wais4_digit_span
ADD COLUMN IF NOT EXISTS wais_mc_emp INTEGER;

-- Add standardized value (mean=10, SD=3)
ALTER TABLE responses_wais4_digit_span
ADD COLUMN IF NOT EXISTS wais_mc_cr NUMERIC(5,2);

-- Add total raw score (alias for raw_score for consistency with naming convention)
ALTER TABLE responses_wais4_digit_span
ADD COLUMN IF NOT EXISTS wais_mc_tot INTEGER;

-- Add standard score (alias for standardized_score for consistency with naming convention)
ALTER TABLE responses_wais4_digit_span
ADD COLUMN IF NOT EXISTS wais_mc_std INTEGER;

-- Add empan values (aliases for existing empan fields for consistency)
ALTER TABLE responses_wais4_digit_span
ADD COLUMN IF NOT EXISTS wais_mc_end INTEGER, -- Empan endroit
ADD COLUMN IF NOT EXISTS wais_mc_env INTEGER, -- Empan envers
ADD COLUMN IF NOT EXISTS wais_mc_cro INTEGER; -- Empan croissant

-- Add section total aliases for consistency with naming convention
ALTER TABLE responses_wais4_digit_span
ADD COLUMN IF NOT EXISTS wais_mcod_tot INTEGER, -- Total ordre direct
ADD COLUMN IF NOT EXISTS wais_mcoi_tot INTEGER, -- Total ordre inverse
ADD COLUMN IF NOT EXISTS wais_mcoc_tot INTEGER; -- Total ordre croissant

-- Add comments for documentation
COMMENT ON COLUMN responses_wais4_digit_span.wais_mcod_1 IS 'Item 1 score for forward digit span (trial 1 + trial 2)';
COMMENT ON COLUMN responses_wais4_digit_span.wais_mc_end_std IS 'Z-score for forward digit span based on age-stratified norms';
COMMENT ON COLUMN responses_wais4_digit_span.wais_mc_env_std IS 'Z-score for backward digit span based on age-stratified norms';
COMMENT ON COLUMN responses_wais4_digit_span.wais_mc_cro_std IS 'Z-score for sequencing digit span based on age-stratified norms';
COMMENT ON COLUMN responses_wais4_digit_span.wais_mc_emp IS 'Empan difference (forward - backward)';
COMMENT ON COLUMN responses_wais4_digit_span.wais_mc_cr IS 'Standardized value: (standard_score - 10) / 3';
COMMENT ON COLUMN responses_wais4_digit_span.wais_mc_tot IS 'Total raw score (sum of all three sections)';
COMMENT ON COLUMN responses_wais4_digit_span.wais_mc_std IS 'Standard score (1-19) based on age-stratified norms';
COMMENT ON COLUMN responses_wais4_digit_span.wais_mc_end IS 'Maximum span achieved in forward order';
COMMENT ON COLUMN responses_wais4_digit_span.wais_mc_env IS 'Maximum span achieved in backward order';
COMMENT ON COLUMN responses_wais4_digit_span.wais_mc_cro IS 'Maximum span achieved in ascending order';

