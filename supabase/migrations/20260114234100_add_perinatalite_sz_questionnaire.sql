-- Migration: Add Perinatalite questionnaire for Schizophrenia
-- Description: Creates responses_perinatalite_sz table for schizophrenia-specific perinatal history
-- Date: 2026-01-14

CREATE TABLE responses_perinatalite_sz (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- Q1: Mother's age at birth (years)
    q1_mother_age INTEGER CHECK (q1_mother_age >= 10 AND q1_mother_age <= 60),
    
    -- Q2: Father's age at birth (years)
    q2_father_age INTEGER CHECK (q2_father_age >= 10 AND q2_father_age <= 80),
    
    -- Q3: Birth condition
    q3_birth_condition VARCHAR(20) CHECK (q3_birth_condition IN ('premature', 'term', 'post_mature', 'unknown')),
    
    -- Q4: Gestational age (weeks)
    q4_gestational_age INTEGER CHECK (q4_gestational_age >= 22 AND q4_gestational_age <= 45),
    
    -- Q5: Type of birth
    q5_birth_type VARCHAR(20) CHECK (q5_birth_type IN ('vaginal', 'cesarean', 'unknown')),
    
    -- Q6: Birth weight (grams)
    q6_birth_weight INTEGER CHECK (q6_birth_weight >= 300 AND q6_birth_weight <= 6000),
    
    -- Q7: Neonatal hospitalization
    q7_neonatal_hospitalization VARCHAR(20) CHECK (q7_neonatal_hospitalization IN ('yes', 'no', 'unknown')),
    
    -- Q8: Birth environment
    q8_birth_environment VARCHAR(20) CHECK (q8_birth_environment IN ('urbain', 'rural', 'unknown')),
    
    -- Q9: Obstetric complications
    q9_obstetric_complications VARCHAR(20) CHECK (q9_obstetric_complications IN ('yes', 'no', 'unknown')),
    
    -- Q10: Maternal viral infection during pregnancy
    q10_maternal_viral_infection VARCHAR(20) CHECK (q10_maternal_viral_infection IN ('yes', 'no', 'unknown')),
    
    -- Q11: Maternal pregnancy events (multiple selection)
    q11_maternal_pregnancy_events TEXT[],

    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_perinatalite_sz ENABLE ROW LEVEL SECURITY;

-- Patient Policies
CREATE POLICY "Patients view own perinatalite_sz" ON responses_perinatalite_sz 
    FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients insert own perinatalite_sz" ON responses_perinatalite_sz 
    FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients update own perinatalite_sz" ON responses_perinatalite_sz 
    FOR UPDATE USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Pros view all perinatalite_sz" ON responses_perinatalite_sz 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
    );
CREATE POLICY "Pros insert perinatalite_sz" ON responses_perinatalite_sz 
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
    );
CREATE POLICY "Pros update perinatalite_sz" ON responses_perinatalite_sz 
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
    );

-- Add comments
COMMENT ON TABLE responses_perinatalite_sz IS 'Perinatal history questionnaire responses for schizophrenia patients';
COMMENT ON COLUMN responses_perinatalite_sz.q11_maternal_pregnancy_events IS 'Array of stressful events during pregnancy';
