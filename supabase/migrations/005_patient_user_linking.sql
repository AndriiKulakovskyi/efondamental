-- ============================================================================
-- eFondaMental Platform - Patient-User Account Linking
-- ============================================================================
-- This migration adds the ability to link patient records to user accounts
-- for patient portal access
-- ============================================================================

-- Add user_id column to patients table
ALTER TABLE patients
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Add unique constraint to ensure one patient = one user account
ALTER TABLE patients
ADD CONSTRAINT patients_user_id_unique UNIQUE (user_id);

-- Add index for performance
CREATE INDEX idx_patients_user_id ON patients(user_id);

-- Add patient_id column to user_invitations table
ALTER TABLE user_invitations
ADD COLUMN patient_id UUID REFERENCES patients(id) ON DELETE CASCADE;

-- Add index for performance
CREATE INDEX idx_invitations_patient_id ON user_invitations(patient_id);

-- Comment the columns for clarity
COMMENT ON COLUMN patients.user_id IS 'Link to auth user account for patient portal access';
COMMENT ON COLUMN user_invitations.patient_id IS 'Link invitation to patient record when inviting patient to portal';

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Patient-user linking schema updated successfully';
END $$;

