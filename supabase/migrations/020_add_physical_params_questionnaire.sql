-- Migration: Add Physical Parameters Questionnaire (Infirmier Section)
-- Description: Creates table for physical measurements, blood pressure, and heart rate
-- Date: 2025-11-19

-- =====================================================
-- TABLE: responses_physical_params
-- =====================================================
-- Stores physical parameters assessment responses
CREATE TABLE responses_physical_params (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Physical measurements
    height_cm INTEGER CHECK (height_cm > 0 AND height_cm < 300),
    weight_kg DECIMAL(5,2) CHECK (weight_kg > 0 AND weight_kg < 500),
    bmi DECIMAL(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN height_cm IS NOT NULL AND height_cm > 0 AND weight_kg IS NOT NULL 
            THEN ROUND((weight_kg / ((height_cm / 100.0) * (height_cm / 100.0)))::numeric, 2)
            ELSE NULL 
        END
    ) STORED,
    abdominal_circumference_cm INTEGER CHECK (abdominal_circumference_cm > 10 AND abdominal_circumference_cm < 200),
    
    -- Blood pressure lying down (couché)
    bp_lying_systolic INTEGER CHECK (bp_lying_systolic > 0 AND bp_lying_systolic < 300),
    bp_lying_diastolic INTEGER CHECK (bp_lying_diastolic > 0 AND bp_lying_diastolic < 300),
    heart_rate_lying INTEGER CHECK (heart_rate_lying > 0 AND heart_rate_lying < 300),
    
    -- Blood pressure standing (debout)
    bp_standing_systolic INTEGER CHECK (bp_standing_systolic > 0 AND bp_standing_systolic < 300),
    bp_standing_diastolic INTEGER CHECK (bp_standing_diastolic > 0 AND bp_standing_diastolic < 300),
    heart_rate_standing INTEGER CHECK (heart_rate_standing > 0 AND heart_rate_standing < 300),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_physical_params ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Healthcare Professionals
CREATE POLICY "Healthcare professionals can view physical params"
    ON responses_physical_params FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Healthcare professionals can insert physical params"
    ON responses_physical_params FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

CREATE POLICY "Healthcare professionals can update physical params"
    ON responses_physical_params FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- RLS Policies for Patients
CREATE POLICY "Patients can view own physical params"
    ON responses_physical_params FOR SELECT
    USING (auth.uid() = patient_id);

-- Trigger for updated_at
CREATE TRIGGER update_responses_physical_params_updated_at
    BEFORE UPDATE ON responses_physical_params
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_responses_physical_params_visit_id ON responses_physical_params(visit_id);
CREATE INDEX idx_responses_physical_params_patient_id ON responses_physical_params(patient_id);

-- Comments for documentation
COMMENT ON TABLE responses_physical_params IS 'Physical parameters including height, weight, BMI, abdominal circumference, blood pressure (lying and standing), and heart rate';
COMMENT ON COLUMN responses_physical_params.bmi IS 'Body Mass Index - automatically calculated from height and weight';
COMMENT ON COLUMN responses_physical_params.bp_lying_systolic IS 'Systolic blood pressure while lying down (mmHg)';
COMMENT ON COLUMN responses_physical_params.bp_lying_diastolic IS 'Diastolic blood pressure while lying down (mmHg)';
COMMENT ON COLUMN responses_physical_params.bp_standing_systolic IS 'Systolic blood pressure while standing (mmHg)';
COMMENT ON COLUMN responses_physical_params.bp_standing_diastolic IS 'Diastolic blood pressure while standing (mmHg)';

