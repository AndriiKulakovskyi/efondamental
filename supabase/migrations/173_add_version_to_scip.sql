-- ============================================================================
-- Add Version Field to SCIP Questionnaire
-- ============================================================================
-- This migration adds a 'version' field to the SCIP questionnaire to allow
-- selection between versions 1, 2, or 3.
-- ============================================================================

-- Add version column to responses_scip table
ALTER TABLE responses_scip 
ADD COLUMN version INTEGER NOT NULL DEFAULT 1 CHECK (version IN (1, 2, 3));

-- Add comment to the new column
COMMENT ON COLUMN responses_scip.version IS 'SCIP version: 1, 2, or 3';

-- Create index for potential filtering by version
CREATE INDEX idx_responses_scip_version ON responses_scip(version);

