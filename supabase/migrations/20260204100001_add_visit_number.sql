-- Migration: Add visit_number column to visits table
-- Purpose: Enable efficient longitudinal research queries by numbering visits per patient and type
-- Date: 2026-02-04

-- ============================================================================
-- 1. ADD VISIT_NUMBER COLUMN
-- ============================================================================

ALTER TABLE visits 
ADD COLUMN IF NOT EXISTS visit_number INTEGER;

-- Add comment for documentation
COMMENT ON COLUMN visits.visit_number IS 'Sequential number for visits of the same type per patient (e.g., Annual Visit #1, #2, etc.)';

-- ============================================================================
-- 2. ADD INDEX FOR EFFICIENT LONGITUDINAL QUERIES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_visits_type_number ON visits(visit_type, visit_number);
CREATE INDEX IF NOT EXISTS idx_visits_patient_type_number ON visits(patient_id, visit_type, visit_number);

-- ============================================================================
-- 3. CREATE FUNCTION TO COMPUTE NEXT VISIT NUMBER
-- ============================================================================

CREATE OR REPLACE FUNCTION get_next_visit_number(
  p_patient_id UUID,
  p_visit_type visit_type
) RETURNS INTEGER AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT COALESCE(MAX(visit_number), 0) + 1 INTO next_num
  FROM visits
  WHERE patient_id = p_patient_id
    AND visit_type = p_visit_type
    AND status != 'cancelled';
  RETURN next_num;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_next_visit_number IS 'Returns the next sequential visit number for a patient and visit type';

-- ============================================================================
-- 4. CREATE TRIGGER TO AUTO-ASSIGN VISIT NUMBER ON INSERT
-- ============================================================================

CREATE OR REPLACE FUNCTION auto_assign_visit_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Only auto-assign if visit_number is not provided
  IF NEW.visit_number IS NULL THEN
    NEW.visit_number := get_next_visit_number(NEW.patient_id, NEW.visit_type);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION auto_assign_visit_number IS 'Trigger function to automatically assign visit_number on insert';

-- Drop existing trigger if exists (for idempotency)
DROP TRIGGER IF EXISTS tr_visits_assign_number ON visits;

-- Create the trigger
CREATE TRIGGER tr_visits_assign_number
BEFORE INSERT ON visits
FOR EACH ROW
EXECUTE FUNCTION auto_assign_visit_number();

-- ============================================================================
-- 5. BACKFILL EXISTING VISITS WITH COMPUTED NUMBERS
-- ============================================================================

-- Compute visit numbers based on scheduled_date order, then created_at as tiebreaker
-- Partitioned by patient_id and visit_type
WITH numbered_visits AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY patient_id, visit_type 
      ORDER BY scheduled_date NULLS LAST, created_at
    ) as computed_number
  FROM visits
  WHERE status != 'cancelled'
)
UPDATE visits v
SET visit_number = nv.computed_number
FROM numbered_visits nv
WHERE v.id = nv.id
  AND v.visit_number IS NULL;

-- Handle cancelled visits - assign number based on when they would have occurred
-- This preserves the sequence even for cancelled visits
WITH numbered_cancelled AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY patient_id, visit_type 
      ORDER BY scheduled_date NULLS LAST, created_at
    ) as computed_number
  FROM visits
  WHERE status = 'cancelled'
    AND visit_number IS NULL
)
UPDATE visits v
SET visit_number = nc.computed_number
FROM numbered_cancelled nc
WHERE v.id = nc.id;

-- ============================================================================
-- 6. CREATE RPC FUNCTIONS FOR LONGITUDINAL RESEARCH QUERIES
-- ============================================================================

-- Function to get visits by type and number across all patients
-- Useful for longitudinal research queries like "get all Annual Visit #2 data"
CREATE OR REPLACE FUNCTION get_visits_by_type_and_number(
  p_visit_type visit_type,
  p_visit_number INTEGER,
  p_pathology_id UUID DEFAULT NULL,
  p_center_id UUID DEFAULT NULL
) RETURNS TABLE (
  visit_id UUID,
  patient_id UUID,
  medical_record_number TEXT,
  patient_first_name TEXT,
  patient_last_name TEXT,
  scheduled_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  status VARCHAR(50)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id as visit_id,
    v.patient_id,
    p.medical_record_number,
    p.first_name as patient_first_name,
    p.last_name as patient_last_name,
    v.scheduled_date,
    v.completed_date,
    v.status
  FROM visits v
  JOIN patients p ON p.id = v.patient_id
  WHERE v.visit_type = p_visit_type
    AND v.visit_number = p_visit_number
    AND v.status != 'cancelled'
    AND (p_pathology_id IS NULL OR p.pathology_id = p_pathology_id)
    AND (p_center_id IS NULL OR p.center_id = p_center_id)
  ORDER BY v.scheduled_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_visits_by_type_and_number IS 'Get all visits of a specific type and number for longitudinal research queries';

-- Function to get questionnaire data for a specific visit type and number
-- Returns questionnaire responses as JSONB for flexibility
CREATE OR REPLACE FUNCTION get_questionnaire_data_by_visit_number(
  p_visit_type visit_type,
  p_visit_number INTEGER,
  p_questionnaire_table TEXT,
  p_pathology_id UUID DEFAULT NULL
) RETURNS TABLE (
  patient_id UUID,
  visit_id UUID,
  medical_record_number TEXT,
  scheduled_date TIMESTAMPTZ,
  response_data JSONB
) AS $$
BEGIN
  RETURN QUERY EXECUTE format(
    'SELECT 
      v.patient_id,
      v.id as visit_id,
      p.medical_record_number,
      v.scheduled_date,
      to_jsonb(r.*) as response_data
     FROM visits v
     JOIN patients p ON p.id = v.patient_id
     JOIN %I r ON r.visit_id = v.id
     WHERE v.visit_type = $1 
       AND v.visit_number = $2
       AND v.status != ''cancelled''
       AND ($3 IS NULL OR p.pathology_id = $3)
     ORDER BY v.scheduled_date',
    p_questionnaire_table
  ) USING p_visit_type, p_visit_number, p_pathology_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_questionnaire_data_by_visit_number IS 'Get questionnaire response data for all patients at a specific visit type and number';

-- Function to compare questionnaire scores across multiple visit numbers
-- Useful for longitudinal analysis (e.g., compare MADRS scores at Visit #1 vs #2)
CREATE OR REPLACE FUNCTION get_longitudinal_comparison(
  p_visit_type visit_type,
  p_questionnaire_table TEXT,
  p_score_column TEXT,
  p_visit_numbers INTEGER[],
  p_pathology_id UUID DEFAULT NULL
) RETURNS TABLE (
  patient_id UUID,
  medical_record_number TEXT,
  visit_number INTEGER,
  score_value NUMERIC,
  scheduled_date TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY EXECUTE format(
    'SELECT 
      v.patient_id,
      p.medical_record_number,
      v.visit_number,
      r.%I::NUMERIC as score_value,
      v.scheduled_date
     FROM visits v
     JOIN patients p ON p.id = v.patient_id
     JOIN %I r ON r.visit_id = v.id
     WHERE v.visit_type = $1 
       AND v.visit_number = ANY($2)
       AND v.status != ''cancelled''
       AND ($3 IS NULL OR p.pathology_id = $3)
     ORDER BY p.medical_record_number, v.visit_number',
    p_score_column,
    p_questionnaire_table
  ) USING p_visit_type, p_visit_numbers, p_pathology_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON FUNCTION get_longitudinal_comparison IS 'Compare questionnaire scores across multiple visit numbers for longitudinal analysis';
