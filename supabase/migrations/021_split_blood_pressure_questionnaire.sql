-- Migration: Fix Physical Parameters and Split Blood Pressure
-- Description: Fixes BMI calculation, splits blood pressure into separate questionnaire, and adds tension fields
-- Date: 2025-11-19

-- Fix BMI calculation (divide by 10000 to convert cm² to m²)
ALTER TABLE responses_physical_params 
DROP COLUMN IF EXISTS bmi;

ALTER TABLE responses_physical_params 
ADD COLUMN bmi DECIMAL(5,2) GENERATED ALWAYS AS (
    CASE 
        WHEN height_cm IS NOT NULL AND height_cm > 0 AND weight_kg IS NOT NULL 
        THEN ROUND((weight_kg / ((height_cm / 100.0) * (height_cm / 100.0)))::numeric, 2)
        ELSE NULL 
    END
) STORED;

-- Remove blood pressure and heart rate fields from physical params
ALTER TABLE responses_physical_params
DROP COLUMN IF EXISTS bp_lying_systolic,
DROP COLUMN IF EXISTS bp_lying_diastolic,
DROP COLUMN IF EXISTS heart_rate_lying,
DROP COLUMN IF EXISTS bp_standing_systolic,
DROP COLUMN IF EXISTS bp_standing_diastolic,
DROP COLUMN IF EXISTS heart_rate_standing;

-- =====================================================
-- TABLE: responses_blood_pressure
-- =====================================================
-- Stores blood pressure and heart rate measurements
CREATE TABLE responses_blood_pressure (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Blood pressure lying down (couché)
    bp_lying_systolic INTEGER CHECK (bp_lying_systolic > 0 AND bp_lying_systolic < 300),
    bp_lying_diastolic INTEGER CHECK (bp_lying_diastolic > 0 AND bp_lying_diastolic < 300),
    tension_lying VARCHAR(20), -- Stored as "systolic/diastolic" format
    heart_rate_lying INTEGER CHECK (heart_rate_lying > 0 AND heart_rate_lying < 300),
    
    -- Blood pressure standing (debout)
    bp_standing_systolic INTEGER CHECK (bp_standing_systolic > 0 AND bp_standing_systolic < 300),
    bp_standing_diastolic INTEGER CHECK (bp_standing_diastolic > 0 AND bp_standing_diastolic < 300),
    tension_standing VARCHAR(20), -- Stored as "systolic/diastolic" format
    heart_rate_standing INTEGER CHECK (heart_rate_standing > 0 AND heart_rate_standing < 300),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_blood_pressure ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Healthcare Professionals
CREATE POLICY "Healthcare professionals can view blood pressure"
    ON responses_blood_pressure FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Healthcare professionals can insert blood pressure"
    ON responses_blood_pressure FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

CREATE POLICY "Healthcare professionals can update blood pressure"
    ON responses_blood_pressure FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- RLS Policies for Patients
CREATE POLICY "Patients can view own blood pressure"
    ON responses_blood_pressure FOR SELECT
    USING (auth.uid() = patient_id);

-- Trigger for updated_at
CREATE TRIGGER update_responses_blood_pressure_updated_at
    BEFORE UPDATE ON responses_blood_pressure
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_responses_blood_pressure_visit_id ON responses_blood_pressure(visit_id);
CREATE INDEX idx_responses_blood_pressure_patient_id ON responses_blood_pressure(patient_id);

-- Comments for documentation
COMMENT ON TABLE responses_blood_pressure IS 'Blood pressure and heart rate measurements (lying and standing positions)';
COMMENT ON COLUMN responses_blood_pressure.tension_lying IS 'Blood pressure lying down formatted as "systolic/diastolic"';
COMMENT ON COLUMN responses_blood_pressure.tension_standing IS 'Blood pressure standing formatted as "systolic/diastolic"';

