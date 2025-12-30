-- ============================================================================
-- Rename WAIS-IV Code columns to match standard naming convention
-- ============================================================================
-- This migration renames columns to use wais_cod_* prefix for consistency

-- Rename input columns
ALTER TABLE responses_wais4_code 
  RENAME COLUMN total_correct TO wais_cod_tot;

ALTER TABLE responses_wais4_code 
  RENAME COLUMN total_errors TO wais_cod_err;

-- Rename computed score columns
ALTER TABLE responses_wais4_code 
  RENAME COLUMN raw_score TO wais_cod_brut;

ALTER TABLE responses_wais4_code 
  RENAME COLUMN standardized_score TO wais_cod_std;

ALTER TABLE responses_wais4_code 
  RENAME COLUMN z_score TO wais_cod_cr;

-- Update comments with new names
COMMENT ON COLUMN responses_wais4_code.wais_cod_tot IS 'Total number of correctly filled boxes';
COMMENT ON COLUMN responses_wais4_code.wais_cod_err IS 'Number of incorrectly filled boxes';
COMMENT ON COLUMN responses_wais4_code.wais_cod_brut IS 'Raw total score (Note brute totale)';
COMMENT ON COLUMN responses_wais4_code.wais_cod_std IS 'Standard score (Note standard - Code)';
COMMENT ON COLUMN responses_wais4_code.wais_cod_cr IS 'Standardized value (Valeur standardisée)';

