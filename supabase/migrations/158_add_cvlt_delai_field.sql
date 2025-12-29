-- ============================================================================
-- Add cvlt_delai field to CVLT tables
-- ============================================================================
-- This migration adds the "Delai entre 1er rappels et rappels differes" field
-- to both responses_cvlt and responses_wais3_cvlt tables
-- ============================================================================

-- Add cvlt_delai to responses_cvlt
ALTER TABLE responses_cvlt
ADD COLUMN IF NOT EXISTS cvlt_delai INTEGER CHECK (cvlt_delai >= 0 AND cvlt_delai <= 120);

COMMENT ON COLUMN responses_cvlt.cvlt_delai IS 'Delai en minutes entre les premiers rappels et les rappels differes (typiquement 20 minutes)';

-- Add cvlt_delai to responses_wais3_cvlt
ALTER TABLE responses_wais3_cvlt
ADD COLUMN IF NOT EXISTS cvlt_delai INTEGER CHECK (cvlt_delai >= 0 AND cvlt_delai <= 120);

COMMENT ON COLUMN responses_wais3_cvlt.cvlt_delai IS 'Delai en minutes entre les premiers rappels et les rappels differes (typiquement 20 minutes)';

