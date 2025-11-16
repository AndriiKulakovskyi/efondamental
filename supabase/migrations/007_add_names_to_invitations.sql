-- ============================================================================
-- eFondaMental Platform - Add Name Fields to Invitations
-- ============================================================================
-- This migration adds first_name and last_name to user_invitations
-- for better email personalization
-- ============================================================================

-- Add name columns to user_invitations
ALTER TABLE user_invitations
ADD COLUMN first_name VARCHAR(100),
ADD COLUMN last_name VARCHAR(100);

-- Comment for clarity
COMMENT ON COLUMN user_invitations.first_name IS 'Invitee first name for email personalization';
COMMENT ON COLUMN user_invitations.last_name IS 'Invitee last name for email personalization';

-- Update existing patient invitations with names from patient records
UPDATE user_invitations ui
SET 
  first_name = p.first_name,
  last_name = p.last_name
FROM patients p
WHERE ui.patient_id = p.id
AND ui.role = 'patient'
AND ui.first_name IS NULL;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Added name fields to user_invitations table';
END $$;

