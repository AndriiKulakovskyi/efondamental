-- eFondaMental Platform - Patient Medications Table
-- Stores individual medication entries per patient for psychotropic treatments

-- ============================================================================
-- Create Patient Medications Table
-- ============================================================================

CREATE TABLE patient_medications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Medication details
    medication_name TEXT NOT NULL,
    start_date DATE NOT NULL,
    is_ongoing BOOLEAN DEFAULT true NOT NULL,
    end_date DATE,  -- Required if is_ongoing = false
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id),
    
    -- Constraint: end_date required when not ongoing
    CONSTRAINT end_date_required_when_not_ongoing 
        CHECK (is_ongoing = true OR end_date IS NOT NULL)
);

-- ============================================================================
-- Create Indexes
-- ============================================================================

CREATE INDEX idx_patient_medications_patient ON patient_medications(patient_id);
CREATE INDEX idx_patient_medications_ongoing ON patient_medications(patient_id, is_ongoing);
CREATE INDEX idx_patient_medications_dates ON patient_medications(start_date, end_date);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================

ALTER TABLE patient_medications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================

-- Patient Policies
CREATE POLICY "Patients view own medications"
    ON patient_medications FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own medications"
    ON patient_medications FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own medications"
    ON patient_medications FOR UPDATE
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients delete own medications"
    ON patient_medications FOR DELETE
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all medications"
    ON patient_medications FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert medications"
    ON patient_medications FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update medications"
    ON patient_medications FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals delete medications"
    ON patient_medications FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- ============================================================================
-- Add Comments
-- ============================================================================

COMMENT ON TABLE patient_medications IS 'Patient psychotropic medications - individual medication entries with start/end dates';
COMMENT ON COLUMN patient_medications.medication_name IS 'Name of the medication';
COMMENT ON COLUMN patient_medications.start_date IS 'Date when treatment started';
COMMENT ON COLUMN patient_medications.is_ongoing IS 'Whether the treatment is currently ongoing';
COMMENT ON COLUMN patient_medications.end_date IS 'Date when treatment ended (required if is_ongoing = false)';

