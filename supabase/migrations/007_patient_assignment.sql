-- ============================================================================
-- eFondaMental Platform - Patient Doctor Assignment
-- ============================================================================
-- This migration adds patient-to-doctor assignment functionality
-- ============================================================================

-- Add assigned_to column to patients table
ALTER TABLE patients
ADD COLUMN assigned_to UUID REFERENCES auth.users(id);

-- Create index for performance
CREATE INDEX idx_patients_assigned_to ON patients(assigned_to);

-- Add comment for clarity
COMMENT ON COLUMN patients.assigned_to IS 'Professional assigned to manage this patient';

-- Migrate existing patients: assign to creator
UPDATE patients
SET assigned_to = created_by
WHERE assigned_to IS NULL AND active = true;

-- Update v_patients_full view to include assigned doctor information
DROP VIEW IF EXISTS v_patients_full;

CREATE VIEW v_patients_full AS
SELECT 
  p.id,
  p.center_id,
  p.pathology_id,
  p.medical_record_number,
  p.first_name,
  p.last_name,
  p.date_of_birth,
  p.gender,
  p.email,
  p.phone,
  p.address,
  p.emergency_contact,
  p.metadata,
  p.active,
  p.assigned_to,
  p.created_by,
  p.created_at,
  p.updated_at,
  p.user_id,
  p.deleted_at,
  p.deleted_by,
  c.name AS center_name,
  c.code AS center_code,
  path.name AS pathology_name,
  path.type AS pathology_type,
  path.color AS pathology_color,
  creator.first_name AS created_by_first_name,
  creator.last_name AS created_by_last_name,
  assigned.first_name AS assigned_to_first_name,
  assigned.last_name AS assigned_to_last_name
FROM patients p
LEFT JOIN centers c ON p.center_id = c.id
LEFT JOIN pathologies path ON p.pathology_id = path.id
LEFT JOIN user_profiles creator ON p.created_by = creator.id
LEFT JOIN user_profiles assigned ON p.assigned_to = assigned.id;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Patient assignment schema updated successfully';
  RAISE NOTICE 'Existing patients have been assigned to their creators';
END $$;

