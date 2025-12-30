-- ============================================================================
-- Add assessment_time field to WAIS-IV Clinical Criteria
-- ============================================================================
-- This migration adds the "heure passation bilan" field to WAIS-IV criteria table

-- Add assessment_time column after collection_date
ALTER TABLE responses_wais4_criteria
ADD COLUMN assessment_time VARCHAR(5) CHECK (assessment_time ~ '^(09|1[0-8])h$');

-- Add comment to the column
COMMENT ON COLUMN responses_wais4_criteria.assessment_time IS 'Time of assessment (heure passation bilan): 09h to 18h';

