-- ============================================================================
-- Migration: Create CBQ table for Schizophrenia
-- ============================================================================
-- CBQ - Cognitive Biases Questionnaire (Questionnaire de Biais Cognitifs)
-- Self-report questionnaire assessing 5 types of cognitive biases associated
-- with psychosis through everyday life scenarios (Peters et al., 2014)
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS schizophrenia_cbq (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 30 item scores (1-3 each)
    -- Theme 1: Événement Menaçant (Items 1-15)
    q1 INTEGER CHECK (q1 IS NULL OR q1 BETWEEN 1 AND 3),
    q2 INTEGER CHECK (q2 IS NULL OR q2 BETWEEN 1 AND 3),
    q3 INTEGER CHECK (q3 IS NULL OR q3 BETWEEN 1 AND 3),
    q4 INTEGER CHECK (q4 IS NULL OR q4 BETWEEN 1 AND 3),
    q5 INTEGER CHECK (q5 IS NULL OR q5 BETWEEN 1 AND 3),
    q6 INTEGER CHECK (q6 IS NULL OR q6 BETWEEN 1 AND 3),
    q7 INTEGER CHECK (q7 IS NULL OR q7 BETWEEN 1 AND 3),
    q8 INTEGER CHECK (q8 IS NULL OR q8 BETWEEN 1 AND 3),
    q9 INTEGER CHECK (q9 IS NULL OR q9 BETWEEN 1 AND 3),
    q10 INTEGER CHECK (q10 IS NULL OR q10 BETWEEN 1 AND 3),
    q11 INTEGER CHECK (q11 IS NULL OR q11 BETWEEN 1 AND 3),
    q12 INTEGER CHECK (q12 IS NULL OR q12 BETWEEN 1 AND 3),
    q13 INTEGER CHECK (q13 IS NULL OR q13 BETWEEN 1 AND 3),
    q14 INTEGER CHECK (q14 IS NULL OR q14 BETWEEN 1 AND 3),
    q15 INTEGER CHECK (q15 IS NULL OR q15 BETWEEN 1 AND 3),
    
    -- Theme 2: Perception Anormale (Items 16-30)
    q16 INTEGER CHECK (q16 IS NULL OR q16 BETWEEN 1 AND 3),
    q17 INTEGER CHECK (q17 IS NULL OR q17 BETWEEN 1 AND 3),
    q18 INTEGER CHECK (q18 IS NULL OR q18 BETWEEN 1 AND 3),
    q19 INTEGER CHECK (q19 IS NULL OR q19 BETWEEN 1 AND 3),
    q20 INTEGER CHECK (q20 IS NULL OR q20 BETWEEN 1 AND 3),
    q21 INTEGER CHECK (q21 IS NULL OR q21 BETWEEN 1 AND 3),
    q22 INTEGER CHECK (q22 IS NULL OR q22 BETWEEN 1 AND 3),
    q23 INTEGER CHECK (q23 IS NULL OR q23 BETWEEN 1 AND 3),
    q24 INTEGER CHECK (q24 IS NULL OR q24 BETWEEN 1 AND 3),
    q25 INTEGER CHECK (q25 IS NULL OR q25 BETWEEN 1 AND 3),
    q26 INTEGER CHECK (q26 IS NULL OR q26 BETWEEN 1 AND 3),
    q27 INTEGER CHECK (q27 IS NULL OR q27 BETWEEN 1 AND 3),
    q28 INTEGER CHECK (q28 IS NULL OR q28 BETWEEN 1 AND 3),
    q29 INTEGER CHECK (q29 IS NULL OR q29 BETWEEN 1 AND 3),
    q30 INTEGER CHECK (q30 IS NULL OR q30 BETWEEN 1 AND 3),
    
    -- Subscale scores (5 bias categories)
    cbq_intentionalisation INTEGER CHECK (cbq_intentionalisation IS NULL OR cbq_intentionalisation BETWEEN 6 AND 18),
    cbq_catastrophisation INTEGER CHECK (cbq_catastrophisation IS NULL OR cbq_catastrophisation BETWEEN 5 AND 15),
    cbq_pensee_dichotomique INTEGER CHECK (cbq_pensee_dichotomique IS NULL OR cbq_pensee_dichotomique BETWEEN 6 AND 18),
    cbq_sauter_conclusions INTEGER CHECK (cbq_sauter_conclusions IS NULL OR cbq_sauter_conclusions BETWEEN 6 AND 18),
    cbq_raisonnement_emotionnel INTEGER CHECK (cbq_raisonnement_emotionnel IS NULL OR cbq_raisonnement_emotionnel BETWEEN 7 AND 21),
    
    -- Thematic dimension scores
    cbq_evenement_menacant INTEGER CHECK (cbq_evenement_menacant IS NULL OR cbq_evenement_menacant BETWEEN 15 AND 45),
    cbq_perception_anormale INTEGER CHECK (cbq_perception_anormale IS NULL OR cbq_perception_anormale BETWEEN 15 AND 45),
    
    -- Total score and Z-scores
    cbq_total INTEGER CHECK (cbq_total IS NULL OR cbq_total BETWEEN 30 AND 90),
    cbq_total_z NUMERIC(5,2),
    cbq_intentionalisation_z NUMERIC(5,2),
    cbq_catastrophisation_z NUMERIC(5,2),
    cbq_pensee_dichotomique_z NUMERIC(5,2),
    cbq_sauter_conclusions_z NUMERIC(5,2),
    cbq_raisonnement_emotionnel_z NUMERIC(5,2),
    
    -- Metadata
    completed_by UUID REFERENCES user_profiles(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_schizophrenia_cbq_visit_id ON schizophrenia_cbq(visit_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_cbq_patient_id ON schizophrenia_cbq(patient_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_cbq_completed_at ON schizophrenia_cbq(completed_at);

-- Enable Row Level Security
ALTER TABLE schizophrenia_cbq ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Patient Policies
-- ============================================================================

CREATE POLICY "Patients view own cbq responses"
    ON schizophrenia_cbq
    FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own cbq responses"
    ON schizophrenia_cbq
    FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own cbq responses"
    ON schizophrenia_cbq
    FOR UPDATE
    USING (auth.uid() = patient_id);

-- ============================================================================
-- Professional Policies
-- ============================================================================

CREATE POLICY "Professionals view all cbq responses"
    ON schizophrenia_cbq
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert cbq responses"
    ON schizophrenia_cbq
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update cbq responses"
    ON schizophrenia_cbq
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- ============================================================================
-- Trigger for updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_schizophrenia_cbq_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_schizophrenia_cbq_updated_at
    BEFORE UPDATE ON schizophrenia_cbq
    FOR EACH ROW
    EXECUTE FUNCTION update_schizophrenia_cbq_updated_at();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE schizophrenia_cbq IS 'CBQ - Cognitive Biases Questionnaire. Self-report questionnaire assessing 5 types of cognitive biases associated with psychosis.';
COMMENT ON COLUMN schizophrenia_cbq.cbq_intentionalisation IS 'Intentionalizing bias subscale (items 1,3,11,13,16,21, range 6-18)';
COMMENT ON COLUMN schizophrenia_cbq.cbq_catastrophisation IS 'Catastrophizing bias subscale (items 2,4,12,14,22, range 5-15)';
COMMENT ON COLUMN schizophrenia_cbq.cbq_pensee_dichotomique IS 'Dichotomous thinking bias subscale (items 5,8,18,23,26,28, range 6-18)';
COMMENT ON COLUMN schizophrenia_cbq.cbq_sauter_conclusions IS 'Jumping to conclusions bias subscale (items 6,10,15,20,24,30, range 6-18)';
COMMENT ON COLUMN schizophrenia_cbq.cbq_raisonnement_emotionnel IS 'Emotional reasoning bias subscale (items 7,9,17,19,25,27,29, range 7-21)';
COMMENT ON COLUMN schizophrenia_cbq.cbq_evenement_menacant IS 'Threatening event thematic dimension (items 1-15, range 15-45)';
COMMENT ON COLUMN schizophrenia_cbq.cbq_perception_anormale IS 'Abnormal perception thematic dimension (items 16-30, range 15-45)';
COMMENT ON COLUMN schizophrenia_cbq.cbq_total IS 'Total score (sum of all 30 items, range 30-90)';
COMMENT ON COLUMN schizophrenia_cbq.cbq_total_z IS 'Z-score for total: (total - 36.5) / 2.7. Z > 1.65 indicates clinically significant cognitive biases.';
