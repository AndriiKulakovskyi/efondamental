-- eFondaMental Platform - Pathologies cardio-vasculaires (Cardiovascular Conditions)
-- Questionnaire tracking cardiovascular conditions history

-- ============================================================================
-- Create Pathologies Cardio-vasculaires Response Table
-- ============================================================================

CREATE TABLE responses_patho_cardio (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- 1. Hypertension artérielle (Arterial Hypertension)
    q1_hypertension VARCHAR(10) CHECK (q1_hypertension IN ('yes', 'no', 'unknown')),
    q1_1_hypertension_date DATE,
    q1_2_hypertension_treated VARCHAR(3) CHECK (q1_2_hypertension_treated IN ('yes', 'no')),
    q1_3_hypertension_balanced VARCHAR(3) CHECK (q1_3_hypertension_balanced IN ('yes', 'no')),

    -- 2. Maladie coronarienne (Coronary Disease)
    q2_coronary VARCHAR(10) CHECK (q2_coronary IN ('yes', 'no', 'unknown')),
    q2_1_coronary_date DATE,
    q2_2_coronary_treated VARCHAR(3) CHECK (q2_2_coronary_treated IN ('yes', 'no')),
    q2_3_coronary_balanced VARCHAR(3) CHECK (q2_3_coronary_balanced IN ('yes', 'no')),

    -- 3. Infarctus du myocarde (Myocardial Infarction)
    q3_infarctus VARCHAR(10) CHECK (q3_infarctus IN ('yes', 'no', 'unknown')),
    q3_1_infarctus_date DATE,

    -- 4. Trouble du rythme cardiaque (Heart Rhythm Disorder)
    q4_rythme VARCHAR(10) CHECK (q4_rythme IN ('yes', 'no', 'unknown')),
    q4_1_rythme_date DATE,
    q4_2_rythme_treated VARCHAR(3) CHECK (q4_2_rythme_treated IN ('yes', 'no')),
    q4_3_rythme_balanced VARCHAR(3) CHECK (q4_3_rythme_balanced IN ('yes', 'no')),

    -- 5. Autre maladie cardio-vasculaire (Other cardiovascular disease)
    q5_autre VARCHAR(10) CHECK (q5_autre IN ('yes', 'no', 'unknown')),
    q5_1_autre_specify TEXT,
    q5_2_autre_date DATE,

    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Create Indexes
-- ============================================================================

CREATE INDEX idx_responses_patho_cardio_visit ON responses_patho_cardio(visit_id);
CREATE INDEX idx_responses_patho_cardio_patient ON responses_patho_cardio(patient_id);
CREATE INDEX idx_responses_patho_cardio_completed ON responses_patho_cardio(completed_at);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================

ALTER TABLE responses_patho_cardio ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================

-- Patient Policies
CREATE POLICY "Patients view own patho_cardio responses"
    ON responses_patho_cardio FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own patho_cardio responses"
    ON responses_patho_cardio FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own patho_cardio responses"
    ON responses_patho_cardio FOR UPDATE
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all patho_cardio responses"
    ON responses_patho_cardio FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert patho_cardio responses"
    ON responses_patho_cardio FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update patho_cardio responses"
    ON responses_patho_cardio FOR UPDATE
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

COMMENT ON TABLE responses_patho_cardio IS 'Pathologies cardio-vasculaires - Cardiovascular conditions questionnaire';
COMMENT ON COLUMN responses_patho_cardio.q1_hypertension IS 'Arterial hypertension presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_cardio.q1_1_hypertension_date IS 'Hypertension onset date';
COMMENT ON COLUMN responses_patho_cardio.q1_2_hypertension_treated IS 'Hypertension treated (yes/no)';
COMMENT ON COLUMN responses_patho_cardio.q1_3_hypertension_balanced IS 'Hypertension balanced (yes/no)';
COMMENT ON COLUMN responses_patho_cardio.q2_coronary IS 'Coronary disease presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_cardio.q2_1_coronary_date IS 'Coronary disease onset date';
COMMENT ON COLUMN responses_patho_cardio.q2_2_coronary_treated IS 'Coronary disease treated (yes/no)';
COMMENT ON COLUMN responses_patho_cardio.q2_3_coronary_balanced IS 'Coronary disease balanced (yes/no)';
COMMENT ON COLUMN responses_patho_cardio.q3_infarctus IS 'Myocardial infarction presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_cardio.q3_1_infarctus_date IS 'Myocardial infarction occurrence date';
COMMENT ON COLUMN responses_patho_cardio.q4_rythme IS 'Heart rhythm disorder presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_cardio.q4_1_rythme_date IS 'Heart rhythm disorder onset date';
COMMENT ON COLUMN responses_patho_cardio.q4_2_rythme_treated IS 'Heart rhythm disorder treated (yes/no)';
COMMENT ON COLUMN responses_patho_cardio.q4_3_rythme_balanced IS 'Heart rhythm disorder balanced (yes/no)';
COMMENT ON COLUMN responses_patho_cardio.q5_autre IS 'Other cardiovascular condition presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_cardio.q5_1_autre_specify IS 'Other condition specification';
COMMENT ON COLUMN responses_patho_cardio.q5_2_autre_date IS 'Other condition occurrence date';

