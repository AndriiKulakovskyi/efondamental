-- ============================================================================
-- eFondaMental Platform - Extend WAIS-IV Code to include Symboles & IVT
-- ============================================================================
-- This migration extends the existing responses_wais4_code table to include
-- Symbol Search subtest and Processing Speed Index (IVT) composite scores.
-- Uses WAIS-IV (Wechsler, 2008) normative data.
-- 
-- Backward Compatible: Existing Code-only responses remain valid.
-- New fields are optional (NULL allowed) until populated.
-- ============================================================================

-- Add Symboles Subtest input fields
ALTER TABLE responses_wais4_code 
ADD COLUMN IF NOT EXISTS wais_symb_tot INTEGER CHECK (wais_symb_tot IS NULL OR (wais_symb_tot >= 0 AND wais_symb_tot <= 60));

ALTER TABLE responses_wais4_code 
ADD COLUMN IF NOT EXISTS wais_symb_err INTEGER CHECK (wais_symb_err IS NULL OR (wais_symb_err >= 0 AND wais_symb_err <= 60));

-- Add Symboles Subtest computed scores
ALTER TABLE responses_wais4_code 
ADD COLUMN IF NOT EXISTS wais_symb_brut INTEGER;

ALTER TABLE responses_wais4_code 
ADD COLUMN IF NOT EXISTS wais_symb_std INTEGER CHECK (wais_symb_std IS NULL OR (wais_symb_std >= 1 AND wais_symb_std <= 19));

ALTER TABLE responses_wais4_code 
ADD COLUMN IF NOT EXISTS wais_symb_cr DECIMAL(5,2);

-- Add IVT (Processing Speed Index) composite scores
ALTER TABLE responses_wais4_code 
ADD COLUMN IF NOT EXISTS wais_somme_ivt INTEGER CHECK (wais_somme_ivt IS NULL OR (wais_somme_ivt >= 2 AND wais_somme_ivt <= 38));

ALTER TABLE responses_wais4_code 
ADD COLUMN IF NOT EXISTS wais_ivt INTEGER CHECK (wais_ivt IS NULL OR (wais_ivt >= 50 AND wais_ivt <= 150));

ALTER TABLE responses_wais4_code 
ADD COLUMN IF NOT EXISTS wais_ivt_rang TEXT;

ALTER TABLE responses_wais4_code 
ADD COLUMN IF NOT EXISTS wais_ivt_95 TEXT;

-- Add column comments for documentation
COMMENT ON COLUMN responses_wais4_code.wais_symb_tot IS 'Symbol Search: Total number of correctly filled boxes (0-60)';
COMMENT ON COLUMN responses_wais4_code.wais_symb_err IS 'Symbol Search: Number of incorrectly filled boxes (0-60)';
COMMENT ON COLUMN responses_wais4_code.wais_symb_brut IS 'Symbol Search: Raw score (total correct - errors)';
COMMENT ON COLUMN responses_wais4_code.wais_symb_std IS 'Symbol Search: Standard score (1-19, mean=10, SD=3)';
COMMENT ON COLUMN responses_wais4_code.wais_symb_cr IS 'Symbol Search: Standardized value (z-score): (std - 10) / 3';
COMMENT ON COLUMN responses_wais4_code.wais_somme_ivt IS 'IVT: Sum of Code and Symbol Search standard scores (2-38)';
COMMENT ON COLUMN responses_wais4_code.wais_ivt IS 'IVT: Processing Speed Index composite score (50-150, mean=100, SD=15)';
COMMENT ON COLUMN responses_wais4_code.wais_ivt_rang IS 'IVT: Percentile rank corresponding to IVT score';
COMMENT ON COLUMN responses_wais4_code.wais_ivt_95 IS 'IVT: 95% confidence interval for the IVT score';

-- Update table comment to reflect expanded scope
COMMENT ON TABLE responses_wais4_code IS 'WAIS-IV (Wechsler, 2008) - Code, Symbol Search & Processing Speed Index (IVT). Includes both subtests and composite IVT score. Backward compatible with Code-only responses.';

