-- ============================================================================
-- eFondaMental Platform - Fix Patient Deletion and MRN Constraints
-- ============================================================================
-- This migration fixes the patient deletion system to allow MRN reuse
-- after soft deletion while maintaining GDPR compliance
-- ============================================================================

-- Add deletion tracking columns
ALTER TABLE patients
ADD COLUMN deleted_at TIMESTAMPTZ,
ADD COLUMN deleted_by UUID REFERENCES auth.users(id);

-- Add indexes for performance
CREATE INDEX idx_patients_deleted_at ON patients(deleted_at);
CREATE INDEX idx_patients_deleted_by ON patients(deleted_by);

-- Drop the existing global unique constraint on medical_record_number
ALTER TABLE patients DROP CONSTRAINT IF EXISTS patients_medical_record_number_key;

-- Create partial unique index - only applies to active patients
-- This allows same MRN for inactive (deleted) patients
CREATE UNIQUE INDEX patients_active_mrn_unique 
ON patients(medical_record_number) 
WHERE active = true;

-- Comment for clarity
COMMENT ON COLUMN patients.deleted_at IS 'Timestamp when patient was soft deleted';
COMMENT ON COLUMN patients.deleted_by IS 'User who performed the deletion';
COMMENT ON INDEX patients_active_mrn_unique IS 'Ensures MRN uniqueness only for active patients, allowing reuse after deletion';

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Patient deletion schema updated - MRN constraint now partial (active patients only)';
  RAISE NOTICE 'Added deletion tracking columns: deleted_at, deleted_by';
END $$;

