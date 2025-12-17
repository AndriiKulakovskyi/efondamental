-- ============================================================================
-- eFondaMental Platform - Antécédents gynécologiques (Gynecological History)
-- Questionnaire tracking gynecological history
-- ============================================================================

-- ============================================================================
-- Create Antécédents gynécologiques Response Table
-- ============================================================================

CREATE TABLE responses_antecedents_gyneco (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- 1-5. Pregnancy-related counts (using integer for enumerated counts, 15 means >15)
    q1_pregnancy_count INTEGER CHECK (q1_pregnancy_count >= 0 AND q1_pregnancy_count <= 15),
    q2_live_birth_count INTEGER CHECK (q2_live_birth_count >= 0 AND q2_live_birth_count <= 15),
    q3_miscarriage_count INTEGER CHECK (q3_miscarriage_count >= 0 AND q3_miscarriage_count <= 15),
    q4_ivg_count INTEGER CHECK (q4_ivg_count >= 0 AND q4_ivg_count <= 15),
    q5_itg_count INTEGER CHECK (q5_itg_count >= 0 AND q5_itg_count <= 15),

    -- 6. Ménopause (Menopause)
    q6_menopause VARCHAR(10) CHECK (q6_menopause IN ('yes', 'no', 'unknown')),
    q6_1_menopause_date DATE,
    q6_2_hormonal_treatment VARCHAR(10) CHECK (q6_2_hormonal_treatment IN ('yes', 'no', 'unknown')),
    q6_3_hormonal_treatment_start_date DATE,

    -- 7. Pathologie gynécologique (hors cancer)
    q7_gyneco_pathology VARCHAR(10) CHECK (q7_gyneco_pathology IN ('yes', 'no', 'unknown')),
    q7_1_gyneco_pathology_specify TEXT,

    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Create Indexes
-- ============================================================================

CREATE INDEX idx_responses_antecedents_gyneco_visit ON responses_antecedents_gyneco(visit_id);
CREATE INDEX idx_responses_antecedents_gyneco_patient ON responses_antecedents_gyneco(patient_id);
CREATE INDEX idx_responses_antecedents_gyneco_completed ON responses_antecedents_gyneco(completed_at);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================

ALTER TABLE responses_antecedents_gyneco ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================

-- Patient Policies
CREATE POLICY "Patients view own antecedents_gyneco responses"
    ON responses_antecedents_gyneco FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own antecedents_gyneco responses"
    ON responses_antecedents_gyneco FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own antecedents_gyneco responses"
    ON responses_antecedents_gyneco FOR UPDATE
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all antecedents_gyneco responses"
    ON responses_antecedents_gyneco FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert antecedents_gyneco responses"
    ON responses_antecedents_gyneco FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update antecedents_gyneco responses"
    ON responses_antecedents_gyneco FOR UPDATE
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

COMMENT ON TABLE responses_antecedents_gyneco IS 'Antécédents gynécologiques - Gynecological history questionnaire';
COMMENT ON COLUMN responses_antecedents_gyneco.q1_pregnancy_count IS 'Number of pregnancies';
COMMENT ON COLUMN responses_antecedents_gyneco.q2_live_birth_count IS 'Number of live births';
COMMENT ON COLUMN responses_antecedents_gyneco.q3_miscarriage_count IS 'Number of spontaneous miscarriages';
COMMENT ON COLUMN responses_antecedents_gyneco.q4_ivg_count IS 'Number of voluntary pregnancy terminations (IVG)';
COMMENT ON COLUMN responses_antecedents_gyneco.q5_itg_count IS 'Number of therapeutic pregnancy terminations (ITG)';
COMMENT ON COLUMN responses_antecedents_gyneco.q6_menopause IS 'Menopause presence (yes/no/unknown)';
COMMENT ON COLUMN responses_antecedents_gyneco.q6_1_menopause_date IS 'Menopause onset date';
COMMENT ON COLUMN responses_antecedents_gyneco.q6_2_hormonal_treatment IS 'Hormonal treatment (yes/no/unknown)';
COMMENT ON COLUMN responses_antecedents_gyneco.q6_3_hormonal_treatment_start_date IS 'Hormonal treatment start date';
COMMENT ON COLUMN responses_antecedents_gyneco.q7_gyneco_pathology IS 'Non-cancerous gynecological pathology presence (yes/no/unknown)';
COMMENT ON COLUMN responses_antecedents_gyneco.q7_1_gyneco_pathology_specify IS 'Gynecological pathology specification (free text)';

