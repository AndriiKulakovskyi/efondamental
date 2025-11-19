-- Migration: Add Infirmier Section Questionnaires (Tobacco and Fagerstrom)
-- Description: Creates tables for tobacco use assessment and Fagerstrom nicotine dependence test
-- Date: 2025-11-19

-- =====================================================
-- TABLE: responses_tobacco
-- =====================================================
-- Stores tobacco use assessment responses
CREATE TABLE responses_tobacco (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Main question
    smoking_status VARCHAR(50) NOT NULL CHECK (smoking_status IN (
        'non_smoker',
        'current_smoker',
        'ex_smoker',
        'unknown'
    )),
    
    -- Common fields for current_smoker and ex_smoker
    pack_years INTEGER CHECK (pack_years > 0),
    smoking_start_age VARCHAR(10) CHECK (smoking_start_age IN (
        'unknown', '<5', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
        '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28',
        '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41',
        '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54',
        '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67',
        '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80',
        '81', '82', '83', '84', '85', '86', '87', '88', '89', '>89'
    )),
    
    -- Ex-smoker only field
    smoking_end_age VARCHAR(10) CHECK (smoking_end_age IN (
        'unknown', '<5', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
        '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28',
        '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41',
        '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54',
        '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67',
        '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80',
        '81', '82', '83', '84', '85', '86', '87', '88', '89', '>89'
    )),
    
    -- Substitution fields
    has_substitution BOOLEAN,
    substitution_methods TEXT[], -- Array to store multiple substitution methods
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_tobacco ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Healthcare Professionals
CREATE POLICY "Healthcare professionals can view tobacco responses"
    ON responses_tobacco FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Healthcare professionals can insert tobacco responses"
    ON responses_tobacco FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

CREATE POLICY "Healthcare professionals can update tobacco responses"
    ON responses_tobacco FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- RLS Policies for Patients
CREATE POLICY "Patients can view own tobacco responses"
    ON responses_tobacco FOR SELECT
    USING (auth.uid() = patient_id);

-- Trigger for updated_at
CREATE TRIGGER update_responses_tobacco_updated_at
    BEFORE UPDATE ON responses_tobacco
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- TABLE: responses_fagerstrom
-- =====================================================
-- Stores Fagerstrom Test for Nicotine Dependence (FTND) responses
CREATE TABLE responses_fagerstrom (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Questions (Q1 and Q4 are 0-3, others are 0-1)
    q1 INTEGER NOT NULL CHECK (q1 BETWEEN 0 AND 3), -- Time to first cigarette
    q2 INTEGER NOT NULL CHECK (q2 BETWEEN 0 AND 1), -- Difficult to refrain
    q3 INTEGER NOT NULL CHECK (q3 BETWEEN 0 AND 1), -- Which cigarette hardest to give up
    q4 INTEGER NOT NULL CHECK (q4 BETWEEN 0 AND 3), -- Cigarettes per day
    q5 INTEGER NOT NULL CHECK (q5 BETWEEN 0 AND 1), -- Smoke more in morning
    q6 INTEGER NOT NULL CHECK (q6 BETWEEN 0 AND 1), -- Smoke when ill
    
    -- Calculated score (0-10)
    total_score INTEGER GENERATED ALWAYS AS (q1 + q2 + q3 + q4 + q5 + q6) STORED,
    
    -- Dependence level and interpretation
    dependence_level TEXT,
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_fagerstrom ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Healthcare Professionals
CREATE POLICY "Healthcare professionals can view fagerstrom responses"
    ON responses_fagerstrom FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Healthcare professionals can insert fagerstrom responses"
    ON responses_fagerstrom FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

CREATE POLICY "Healthcare professionals can update fagerstrom responses"
    ON responses_fagerstrom FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- RLS Policies for Patients
CREATE POLICY "Patients can view own fagerstrom responses"
    ON responses_fagerstrom FOR SELECT
    USING (auth.uid() = patient_id);

-- Trigger for updated_at
CREATE TRIGGER update_responses_fagerstrom_updated_at
    BEFORE UPDATE ON responses_fagerstrom
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_responses_tobacco_visit_id ON responses_tobacco(visit_id);
CREATE INDEX idx_responses_tobacco_patient_id ON responses_tobacco(patient_id);
CREATE INDEX idx_responses_fagerstrom_visit_id ON responses_fagerstrom(visit_id);
CREATE INDEX idx_responses_fagerstrom_patient_id ON responses_fagerstrom(patient_id);

