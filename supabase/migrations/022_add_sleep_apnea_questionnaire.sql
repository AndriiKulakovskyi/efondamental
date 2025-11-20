-- Migration: Add Sleep Apnea (Apnées du sommeil) Questionnaire
-- Description: Creates table for sleep apnea screening using STOP-Bang criteria
-- Date: 2025-11-19

-- =====================================================
-- TABLE: responses_sleep_apnea
-- =====================================================
-- Stores sleep apnea screening responses with STOP-Bang scoring
CREATE TABLE responses_sleep_apnea (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Main screening question
    diagnosed_sleep_apnea VARCHAR(10) NOT NULL CHECK (diagnosed_sleep_apnea IN ('yes', 'no', 'unknown')),
    
    -- If diagnosed (yes)
    has_cpap_device BOOLEAN,
    
    -- STOP-Bang questions (if not diagnosed or unknown)
    snoring BOOLEAN, -- S: Snoring
    tiredness BOOLEAN, -- T: Tiredness
    observed_apnea BOOLEAN, -- O: Observed apneas
    hypertension BOOLEAN, -- P: Pressure (high blood pressure)
    bmi_over_35 BOOLEAN, -- B: BMI > 35
    age_over_50 BOOLEAN, -- A: Age > 50
    large_neck BOOLEAN, -- N: Neck circumference (>43cm male, >41cm female)
    male_gender BOOLEAN, -- G: Gender (male)
    
    -- Calculated scores
    stop_bang_score INTEGER,
    risk_level VARCHAR(50), -- 'low_risk', 'intermediate_risk', 'high_risk'
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_sleep_apnea ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Healthcare Professionals
CREATE POLICY "Healthcare professionals can view sleep apnea"
    ON responses_sleep_apnea FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Healthcare professionals can insert sleep apnea"
    ON responses_sleep_apnea FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

CREATE POLICY "Healthcare professionals can update sleep apnea"
    ON responses_sleep_apnea FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- RLS Policies for Patients
CREATE POLICY "Patients can view own sleep apnea"
    ON responses_sleep_apnea FOR SELECT
    USING (auth.uid() = patient_id);

-- Trigger for updated_at
CREATE TRIGGER update_responses_sleep_apnea_updated_at
    BEFORE UPDATE ON responses_sleep_apnea
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_responses_sleep_apnea_visit_id ON responses_sleep_apnea(visit_id);
CREATE INDEX idx_responses_sleep_apnea_patient_id ON responses_sleep_apnea(patient_id);

-- Comments for documentation
COMMENT ON TABLE responses_sleep_apnea IS 'Sleep apnea screening questionnaire using STOP-Bang criteria';
COMMENT ON COLUMN responses_sleep_apnea.stop_bang_score IS 'STOP-Bang total score (0-8): sum of yes answers to the 8 screening questions';
COMMENT ON COLUMN responses_sleep_apnea.risk_level IS 'Risk level: low_risk (0-2), intermediate_risk (3-4), high_risk (5-8)';
