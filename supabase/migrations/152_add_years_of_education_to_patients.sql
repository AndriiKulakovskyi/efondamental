-- Add years_of_education to patients table (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'patients' AND column_name = 'years_of_education'
  ) THEN
    ALTER TABLE patients 
    ADD COLUMN years_of_education INTEGER CHECK (years_of_education >= 0 AND years_of_education <= 30);
    
    COMMENT ON COLUMN patients.years_of_education IS 'Nombre d''années d''études (depuis les cours préparatoires) - utilisé pour le calcul des scores neuropsychologiques';
  END IF;
END $$;

-- Update v_patients_full view to include years_of_education
DROP VIEW IF EXISTS v_patients_full;
CREATE VIEW v_patients_full AS
SELECT 
  p.*,
  c.name as center_name,
  c.code as center_code,
  path.type as pathology_type,
  path.name as pathology_name,
  path.color as pathology_color,
  up_created.first_name as created_by_first_name,
  up_created.last_name as created_by_last_name,
  up_assigned.first_name as assigned_to_first_name,
  up_assigned.last_name as assigned_to_last_name,
  up.email as professional_email,
  up.first_name as professional_first_name,
  up.last_name as professional_last_name
FROM patients p
LEFT JOIN centers c ON p.center_id = c.id
LEFT JOIN pathologies path ON p.pathology_id = path.id
LEFT JOIN user_profiles up ON p.assigned_to = up.id
LEFT JOIN user_profiles up_created ON p.created_by = up_created.id
LEFT JOIN user_profiles up_assigned ON p.assigned_to = up_assigned.id
WHERE p.deleted_at IS NULL;

