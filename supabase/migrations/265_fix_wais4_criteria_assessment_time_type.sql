-- ============================================================================
-- Fix assessment_time column type in bipolar_wais4_criteria
-- ============================================================================
-- The assessment_time column was incorrectly created as TIMESTAMPTZ
-- It should be VARCHAR(5) to match bipolar_wais3_criteria and questionnaire format

-- Drop the incorrect column
ALTER TABLE bipolar_wais4_criteria
DROP COLUMN IF EXISTS assessment_time;

-- Add the correct column with proper type and constraint
ALTER TABLE bipolar_wais4_criteria
ADD COLUMN assessment_time VARCHAR(5) CHECK (assessment_time ~ '^(09|1[0-8])h$');

-- Add comment to the column
COMMENT ON COLUMN bipolar_wais4_criteria.assessment_time IS 'Time of assessment (heure passation bilan): 09h to 18h';
