-- ============================================================================
-- Add Visit Completion Tracking Columns
-- ============================================================================
-- Store the calculated completion percentage directly on the visits table.
-- This ensures the patient profile page shows the exact same progress
-- as the visit detail page (which calculates it from actual displayed modules).
-- ============================================================================

-- Add columns to store completion status
ALTER TABLE visits 
ADD COLUMN IF NOT EXISTS completion_percentage INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS completed_questionnaires INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_questionnaires INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS completion_updated_at TIMESTAMPTZ;

-- Add comments
COMMENT ON COLUMN visits.completion_percentage IS 'Calculated completion percentage (0-100) based on actually required questionnaires';
COMMENT ON COLUMN visits.completed_questionnaires IS 'Number of completed questionnaires';
COMMENT ON COLUMN visits.total_questionnaires IS 'Total number of required questionnaires (excluding conditional ones not applicable)';
COMMENT ON COLUMN visits.completion_updated_at IS 'Last time the completion status was calculated';

-- Create index for efficient querying
CREATE INDEX IF NOT EXISTS idx_visits_completion ON visits(completion_percentage);

