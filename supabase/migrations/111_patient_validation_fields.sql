-- ============================================================================
-- eFondaMental Platform - Patient Validation Fields
-- ============================================================================
-- This migration:
-- 1. Adds place_of_birth column to patients table
-- 2. Adds CHECK constraint for gender (only 'M' or 'F')
-- 3. Updates v_patients_full view to include place_of_birth
-- 4. Adds unique index for duplicate patient detection
-- ============================================================================

-- Add place_of_birth column
ALTER TABLE patients
ADD COLUMN IF NOT EXISTS place_of_birth VARCHAR(255);

COMMENT ON COLUMN patients.place_of_birth IS 'Place of birth for the patient';

-- Normalize existing gender values before adding constraint
-- Convert common variations to M/F format
UPDATE patients SET gender = 'M' WHERE LOWER(gender) IN ('male', 'homme', 'm');
UPDATE patients SET gender = 'F' WHERE LOWER(gender) IN ('female', 'femme', 'f');
-- Set NULL for any other values that cannot be mapped
UPDATE patients SET gender = NULL WHERE gender IS NOT NULL AND gender NOT IN ('M', 'F');

-- Add CHECK constraint for gender (only M or F allowed)
ALTER TABLE patients
ADD CONSTRAINT patients_gender_check CHECK (gender IS NULL OR gender IN ('M', 'F'));

COMMENT ON COLUMN patients.gender IS 'Sex at birth: M (Male) or F (Female)';

-- Drop and recreate the v_patients_full view to include place_of_birth
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
  p.place_of_birth,
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

-- Add unique index for duplicate patient detection
-- This prevents exact duplicates based on name, DOB, and place of birth within the same center
CREATE UNIQUE INDEX IF NOT EXISTS idx_patients_unique_identity 
ON patients (
  center_id,
  LOWER(TRIM(first_name)),
  LOWER(TRIM(last_name)),
  date_of_birth,
  LOWER(COALESCE(TRIM(place_of_birth), ''))
)
WHERE active = true AND deleted_at IS NULL;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Patient validation fields migration completed successfully';
END $$;

