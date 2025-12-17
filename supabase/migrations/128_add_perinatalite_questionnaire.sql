-- eFondaMental Platform - Périnatalité (Perinatal History)
-- Questionnaire tracking perinatal and birth-related information

-- ============================================================================
-- Create Perinatalite Response Table
-- ============================================================================

CREATE TABLE responses_perinatalite (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- Q1: Mother's age at birth (years)
    q1_mother_age INTEGER CHECK (q1_mother_age >= 10 AND q1_mother_age <= 60),

    -- Q2: Father's age at birth (years)
    q2_father_age INTEGER CHECK (q2_father_age >= 10 AND q2_father_age <= 80),

    -- Q3: Birth conditions (premature, term, post-mature, unknown)
    q3_birth_condition VARCHAR(20) CHECK (q3_birth_condition IN ('premature', 'term', 'post_mature', 'unknown')),

    -- Q4: Gestational age (weeks of amenorrhea)
    q4_gestational_age INTEGER CHECK (q4_gestational_age >= 22 AND q4_gestational_age <= 45),

    -- Q5: Type of birth (vaginal, cesarean, unknown)
    q5_birth_type VARCHAR(20) CHECK (q5_birth_type IN ('vaginal', 'cesarean', 'unknown')),

    -- Q6: Birth weight (grams)
    q6_birth_weight INTEGER CHECK (q6_birth_weight >= 300 AND q6_birth_weight <= 6000),

    -- Q7: Birth length (cm) - using NUMERIC for decimal support
    q7_birth_length NUMERIC(4,1) CHECK (q7_birth_length >= 30 AND q7_birth_length <= 65),

    -- Q8: Head circumference (cm) - using NUMERIC for decimal support
    q8_head_circumference NUMERIC(4,1) CHECK (q8_head_circumference >= 25 AND q8_head_circumference <= 45),

    -- Q9: Apgar score at 1 minute (0-10)
    q9_apgar_1min INTEGER CHECK (q9_apgar_1min >= 0 AND q9_apgar_1min <= 10),

    -- Q10: Apgar score at 5 minutes (0-10)
    q10_apgar_5min INTEGER CHECK (q10_apgar_5min >= 0 AND q10_apgar_5min <= 10),

    -- Q11: Neonatal hospitalization (yes, no, unknown)
    q11_neonatal_hospitalization VARCHAR(10) CHECK (q11_neonatal_hospitalization IN ('yes', 'no', 'unknown')),

    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Create Indexes
-- ============================================================================

CREATE INDEX idx_responses_perinatalite_visit ON responses_perinatalite(visit_id);
CREATE INDEX idx_responses_perinatalite_patient ON responses_perinatalite(patient_id);
CREATE INDEX idx_responses_perinatalite_completed ON responses_perinatalite(completed_at);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================

ALTER TABLE responses_perinatalite ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================

-- Patient Policies
CREATE POLICY "Patients view own perinatalite responses"
    ON responses_perinatalite FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own perinatalite responses"
    ON responses_perinatalite FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own perinatalite responses"
    ON responses_perinatalite FOR UPDATE
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all perinatalite responses"
    ON responses_perinatalite FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert perinatalite responses"
    ON responses_perinatalite FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update perinatalite responses"
    ON responses_perinatalite FOR UPDATE
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

COMMENT ON TABLE responses_perinatalite IS 'Périnatalité - Perinatal and birth history questionnaire';
COMMENT ON COLUMN responses_perinatalite.q1_mother_age IS 'Q1: Mother age at birth (years, 10-60)';
COMMENT ON COLUMN responses_perinatalite.q2_father_age IS 'Q2: Father age at birth (years, 10-80)';
COMMENT ON COLUMN responses_perinatalite.q3_birth_condition IS 'Q3: Birth condition (premature/term/post_mature/unknown)';
COMMENT ON COLUMN responses_perinatalite.q4_gestational_age IS 'Q4: Gestational age in weeks (22-45 SA)';
COMMENT ON COLUMN responses_perinatalite.q5_birth_type IS 'Q5: Birth type (vaginal/cesarean/unknown)';
COMMENT ON COLUMN responses_perinatalite.q6_birth_weight IS 'Q6: Birth weight in grams (300-6000g)';
COMMENT ON COLUMN responses_perinatalite.q7_birth_length IS 'Q7: Birth length in cm (30-65cm)';
COMMENT ON COLUMN responses_perinatalite.q8_head_circumference IS 'Q8: Head circumference in cm (25-45cm)';
COMMENT ON COLUMN responses_perinatalite.q9_apgar_1min IS 'Q9: Apgar score at 1 minute (0-10)';
COMMENT ON COLUMN responses_perinatalite.q10_apgar_5min IS 'Q10: Apgar score at 5 minutes (0-10)';
COMMENT ON COLUMN responses_perinatalite.q11_neonatal_hospitalization IS 'Q11: Neonatal hospitalization (yes/no/unknown)';

