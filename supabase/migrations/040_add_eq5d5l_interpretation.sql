-- Add interpretation column to responses_eq5d5l table
-- This column will store the clinical interpretation of the EQ-5D-5L results

ALTER TABLE responses_eq5d5l
ADD COLUMN interpretation TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN responses_eq5d5l.interpretation IS 'Clinical interpretation of the EQ-5D-5L health state profile, VAS score, and utility index';

