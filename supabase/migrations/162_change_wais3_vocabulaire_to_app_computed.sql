-- ============================================================================
-- eFondaMental Platform - Change WAIS-III Vocabulaire to Application-Computed Scores
-- ============================================================================
-- This migration removes database-computed column and makes it application-computed
-- All score calculations (raw score, standard score, standardized value) will be
-- computed in the application layer and stored in the database
-- ============================================================================

-- ============================================================================
-- Modify responses_wais3_vocabulaire: Change total_raw_score from computed to regular column
-- ============================================================================

-- Drop the GENERATED ALWAYS AS constraint and make it a regular column
ALTER TABLE responses_wais3_vocabulaire
    DROP COLUMN total_raw_score;

-- Add it back as a regular INTEGER column (application will compute and store)
ALTER TABLE responses_wais3_vocabulaire
    ADD COLUMN total_raw_score INTEGER CHECK (total_raw_score IS NULL OR (total_raw_score BETWEEN 0 AND 66));

-- Update comment to reflect application-side computation
COMMENT ON COLUMN responses_wais3_vocabulaire.total_raw_score IS 'Sum of all 33 item scores (0-66), computed by application and stored';

