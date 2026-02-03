-- ============================================================================
-- Migration: Create DACOBS table for Schizophrenia
-- ============================================================================
-- DACOBS - Davos Assessment of Cognitive Biases Scale (Livet et al., 2022)
-- Self-report questionnaire assessing cognitive biases, limitations, and safety behaviors
-- 42 items with 7-point Likert scale (1-7)
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS schizophrenia_dacobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 42 item scores (1-7 each)
    q1 INTEGER CHECK (q1 IS NULL OR q1 BETWEEN 1 AND 7),
    q2 INTEGER CHECK (q2 IS NULL OR q2 BETWEEN 1 AND 7),
    q3 INTEGER CHECK (q3 IS NULL OR q3 BETWEEN 1 AND 7),
    q4 INTEGER CHECK (q4 IS NULL OR q4 BETWEEN 1 AND 7),
    q5 INTEGER CHECK (q5 IS NULL OR q5 BETWEEN 1 AND 7),
    q6 INTEGER CHECK (q6 IS NULL OR q6 BETWEEN 1 AND 7),
    q7 INTEGER CHECK (q7 IS NULL OR q7 BETWEEN 1 AND 7),
    q8 INTEGER CHECK (q8 IS NULL OR q8 BETWEEN 1 AND 7),
    q9 INTEGER CHECK (q9 IS NULL OR q9 BETWEEN 1 AND 7),
    q10 INTEGER CHECK (q10 IS NULL OR q10 BETWEEN 1 AND 7),
    q11 INTEGER CHECK (q11 IS NULL OR q11 BETWEEN 1 AND 7),
    q12 INTEGER CHECK (q12 IS NULL OR q12 BETWEEN 1 AND 7),
    q13 INTEGER CHECK (q13 IS NULL OR q13 BETWEEN 1 AND 7),
    q14 INTEGER CHECK (q14 IS NULL OR q14 BETWEEN 1 AND 7),
    q15 INTEGER CHECK (q15 IS NULL OR q15 BETWEEN 1 AND 7),
    q16 INTEGER CHECK (q16 IS NULL OR q16 BETWEEN 1 AND 7),
    q17 INTEGER CHECK (q17 IS NULL OR q17 BETWEEN 1 AND 7),
    q18 INTEGER CHECK (q18 IS NULL OR q18 BETWEEN 1 AND 7),
    q19 INTEGER CHECK (q19 IS NULL OR q19 BETWEEN 1 AND 7),
    q20 INTEGER CHECK (q20 IS NULL OR q20 BETWEEN 1 AND 7),
    q21 INTEGER CHECK (q21 IS NULL OR q21 BETWEEN 1 AND 7),
    q22 INTEGER CHECK (q22 IS NULL OR q22 BETWEEN 1 AND 7),
    q23 INTEGER CHECK (q23 IS NULL OR q23 BETWEEN 1 AND 7),
    q24 INTEGER CHECK (q24 IS NULL OR q24 BETWEEN 1 AND 7),
    q25 INTEGER CHECK (q25 IS NULL OR q25 BETWEEN 1 AND 7),
    q26 INTEGER CHECK (q26 IS NULL OR q26 BETWEEN 1 AND 7),
    q27 INTEGER CHECK (q27 IS NULL OR q27 BETWEEN 1 AND 7),
    q28 INTEGER CHECK (q28 IS NULL OR q28 BETWEEN 1 AND 7),
    q29 INTEGER CHECK (q29 IS NULL OR q29 BETWEEN 1 AND 7),
    q30 INTEGER CHECK (q30 IS NULL OR q30 BETWEEN 1 AND 7),
    q31 INTEGER CHECK (q31 IS NULL OR q31 BETWEEN 1 AND 7),
    q32 INTEGER CHECK (q32 IS NULL OR q32 BETWEEN 1 AND 7),
    q33 INTEGER CHECK (q33 IS NULL OR q33 BETWEEN 1 AND 7),
    q34 INTEGER CHECK (q34 IS NULL OR q34 BETWEEN 1 AND 7),
    q35 INTEGER CHECK (q35 IS NULL OR q35 BETWEEN 1 AND 7),
    q36 INTEGER CHECK (q36 IS NULL OR q36 BETWEEN 1 AND 7),
    q37 INTEGER CHECK (q37 IS NULL OR q37 BETWEEN 1 AND 7),
    q38 INTEGER CHECK (q38 IS NULL OR q38 BETWEEN 1 AND 7),
    q39 INTEGER CHECK (q39 IS NULL OR q39 BETWEEN 1 AND 7),
    q40 INTEGER CHECK (q40 IS NULL OR q40 BETWEEN 1 AND 7),
    q41 INTEGER CHECK (q41 IS NULL OR q41 BETWEEN 1 AND 7),
    q42 INTEGER CHECK (q42 IS NULL OR q42 BETWEEN 1 AND 7),
    
    -- 7 Subscale scores (6 items each, range 6-42)
    dacobs_jtc INTEGER CHECK (dacobs_jtc IS NULL OR dacobs_jtc BETWEEN 6 AND 42),
    dacobs_bi INTEGER CHECK (dacobs_bi IS NULL OR dacobs_bi BETWEEN 6 AND 42),
    dacobs_at INTEGER CHECK (dacobs_at IS NULL OR dacobs_at BETWEEN 6 AND 42),
    dacobs_ea INTEGER CHECK (dacobs_ea IS NULL OR dacobs_ea BETWEEN 6 AND 42),
    dacobs_sc INTEGER CHECK (dacobs_sc IS NULL OR dacobs_sc BETWEEN 6 AND 42),
    dacobs_cp INTEGER CHECK (dacobs_cp IS NULL OR dacobs_cp BETWEEN 6 AND 42),
    dacobs_sb INTEGER CHECK (dacobs_sb IS NULL OR dacobs_sb BETWEEN 6 AND 42),
    
    -- 3 Section totals
    dacobs_cognitive_biases INTEGER CHECK (dacobs_cognitive_biases IS NULL OR dacobs_cognitive_biases BETWEEN 24 AND 168),
    dacobs_cognitive_limitations INTEGER CHECK (dacobs_cognitive_limitations IS NULL OR dacobs_cognitive_limitations BETWEEN 12 AND 84),
    dacobs_safety_behaviors INTEGER CHECK (dacobs_safety_behaviors IS NULL OR dacobs_safety_behaviors BETWEEN 6 AND 42),
    
    -- Total score (range 42-294)
    dacobs_total INTEGER CHECK (dacobs_total IS NULL OR dacobs_total BETWEEN 42 AND 294),
    
    -- Metadata
    completed_by UUID REFERENCES user_profiles(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_schizophrenia_dacobs_visit_id ON schizophrenia_dacobs(visit_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_dacobs_patient_id ON schizophrenia_dacobs(patient_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_dacobs_completed_at ON schizophrenia_dacobs(completed_at);

-- Enable Row Level Security
ALTER TABLE schizophrenia_dacobs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Patient Policies
-- ============================================================================

CREATE POLICY "Patients view own dacobs responses"
    ON schizophrenia_dacobs
    FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own dacobs responses"
    ON schizophrenia_dacobs
    FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own dacobs responses"
    ON schizophrenia_dacobs
    FOR UPDATE
    USING (auth.uid() = patient_id);

-- ============================================================================
-- Professional Policies
-- ============================================================================

CREATE POLICY "Professionals view all dacobs responses"
    ON schizophrenia_dacobs
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert dacobs responses"
    ON schizophrenia_dacobs
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update dacobs responses"
    ON schizophrenia_dacobs
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

CREATE OR REPLACE FUNCTION update_schizophrenia_dacobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_schizophrenia_dacobs_updated_at
    BEFORE UPDATE ON schizophrenia_dacobs
    FOR EACH ROW
    EXECUTE FUNCTION update_schizophrenia_dacobs_updated_at();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE schizophrenia_dacobs IS 'DACOBS - Davos Assessment of Cognitive Biases Scale. Self-report questionnaire assessing cognitive biases, limitations, and safety behaviors.';
COMMENT ON COLUMN schizophrenia_dacobs.dacobs_jtc IS 'Jumping to Conclusions subscale (items 3,8,16,18,25,30, range 6-42)';
COMMENT ON COLUMN schizophrenia_dacobs.dacobs_bi IS 'Belief Inflexibility subscale (items 13,15,26,34,38,41, range 6-42)';
COMMENT ON COLUMN schizophrenia_dacobs.dacobs_at IS 'Attention to Threat subscale (items 1,2,6,10,20,37, range 6-42)';
COMMENT ON COLUMN schizophrenia_dacobs.dacobs_ea IS 'External Attribution subscale (items 7,12,17,22,24,29, range 6-42)';
COMMENT ON COLUMN schizophrenia_dacobs.dacobs_sc IS 'Social Cognition Problems subscale (items 4,9,11,14,19,39, range 6-42)';
COMMENT ON COLUMN schizophrenia_dacobs.dacobs_cp IS 'Subjective Cognitive Problems subscale (items 5,21,28,32,36,40, range 6-42)';
COMMENT ON COLUMN schizophrenia_dacobs.dacobs_sb IS 'Safety Behaviors subscale (items 23,27,31,33,35,42, range 6-42)';
COMMENT ON COLUMN schizophrenia_dacobs.dacobs_cognitive_biases IS 'Cognitive Biases section total (JTC+BI+AT+EA, range 24-168)';
COMMENT ON COLUMN schizophrenia_dacobs.dacobs_cognitive_limitations IS 'Cognitive Limitations section total (SC+CP, range 12-84)';
COMMENT ON COLUMN schizophrenia_dacobs.dacobs_safety_behaviors IS 'Safety Behaviors section total (SB, range 6-42)';
COMMENT ON COLUMN schizophrenia_dacobs.dacobs_total IS 'Total score (sum of all 42 items, range 42-294)';
