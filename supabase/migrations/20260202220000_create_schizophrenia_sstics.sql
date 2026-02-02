-- ============================================================================
-- Migration: Create SSTICS table for Schizophrenia
-- ============================================================================
-- SSTICS - Subjective Scale to Investigate Cognition in Schizophrenia
-- Self-report questionnaire assessing subjective cognitive complaints
-- across 6 cognitive domains (Stip et al., 2000)
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS schizophrenia_sstics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 21 item scores (0-4 each, 5-point Likert scale)
    -- Très souvent=4, Souvent=3, Parfois=2, Rarement=1, Jamais=0
    
    -- Mémoire de travail (Working Memory) - Items 1-2
    q1 INTEGER CHECK (q1 IS NULL OR q1 BETWEEN 0 AND 4),
    q2 INTEGER CHECK (q2 IS NULL OR q2 BETWEEN 0 AND 4),
    
    -- Mémoire explicite (Explicit Memory) - Items 3-11
    q3 INTEGER CHECK (q3 IS NULL OR q3 BETWEEN 0 AND 4),
    q4 INTEGER CHECK (q4 IS NULL OR q4 BETWEEN 0 AND 4),
    q5 INTEGER CHECK (q5 IS NULL OR q5 BETWEEN 0 AND 4),
    q6 INTEGER CHECK (q6 IS NULL OR q6 BETWEEN 0 AND 4),
    q7 INTEGER CHECK (q7 IS NULL OR q7 BETWEEN 0 AND 4),
    q8 INTEGER CHECK (q8 IS NULL OR q8 BETWEEN 0 AND 4),
    q9 INTEGER CHECK (q9 IS NULL OR q9 BETWEEN 0 AND 4),
    q10 INTEGER CHECK (q10 IS NULL OR q10 BETWEEN 0 AND 4),
    q11 INTEGER CHECK (q11 IS NULL OR q11 BETWEEN 0 AND 4),
    
    -- Attention - Items 12-16
    q12 INTEGER CHECK (q12 IS NULL OR q12 BETWEEN 0 AND 4),
    q13 INTEGER CHECK (q13 IS NULL OR q13 BETWEEN 0 AND 4),
    q14 INTEGER CHECK (q14 IS NULL OR q14 BETWEEN 0 AND 4),
    q15 INTEGER CHECK (q15 IS NULL OR q15 BETWEEN 0 AND 4),
    q16 INTEGER CHECK (q16 IS NULL OR q16 BETWEEN 0 AND 4),
    
    -- Fonctions exécutives (Executive Functions) - Items 17-19
    q17 INTEGER CHECK (q17 IS NULL OR q17 BETWEEN 0 AND 4),
    q18 INTEGER CHECK (q18 IS NULL OR q18 BETWEEN 0 AND 4),
    q19 INTEGER CHECK (q19 IS NULL OR q19 BETWEEN 0 AND 4),
    
    -- Langage (Language) - Item 20
    q20 INTEGER CHECK (q20 IS NULL OR q20 BETWEEN 0 AND 4),
    
    -- Praxies (Praxis) - Item 21
    q21 INTEGER CHECK (q21 IS NULL OR q21 BETWEEN 0 AND 4),
    
    -- Domain subscores
    sstics_memt INTEGER CHECK (sstics_memt IS NULL OR sstics_memt BETWEEN 0 AND 8),      -- Working Memory (max 8)
    sstics_memexp INTEGER CHECK (sstics_memexp IS NULL OR sstics_memexp BETWEEN 0 AND 36), -- Explicit Memory (max 36)
    sstics_att INTEGER CHECK (sstics_att IS NULL OR sstics_att BETWEEN 0 AND 20),        -- Attention (max 20)
    sstics_fe INTEGER CHECK (sstics_fe IS NULL OR sstics_fe BETWEEN 0 AND 12),           -- Executive Functions (max 12)
    sstics_lang INTEGER CHECK (sstics_lang IS NULL OR sstics_lang BETWEEN 0 AND 4),      -- Language (max 4)
    sstics_prax INTEGER CHECK (sstics_prax IS NULL OR sstics_prax BETWEEN 0 AND 4),      -- Praxis (max 4)
    
    -- Total score and Z-score
    sstics_score INTEGER CHECK (sstics_score IS NULL OR sstics_score BETWEEN 0 AND 84),  -- Total (max 84)
    sstics_scorez NUMERIC(5,2),  -- Z-score: (13.1 - total) / 6.2
    
    -- Metadata
    completed_by UUID REFERENCES user_profiles(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_schizophrenia_sstics_visit_id ON schizophrenia_sstics(visit_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_sstics_patient_id ON schizophrenia_sstics(patient_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_sstics_completed_at ON schizophrenia_sstics(completed_at);

-- Enable Row Level Security
ALTER TABLE schizophrenia_sstics ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Patient Policies
-- ============================================================================

CREATE POLICY "Patients view own sstics responses"
    ON schizophrenia_sstics
    FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own sstics responses"
    ON schizophrenia_sstics
    FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own sstics responses"
    ON schizophrenia_sstics
    FOR UPDATE
    USING (auth.uid() = patient_id);

-- ============================================================================
-- Professional Policies
-- ============================================================================

CREATE POLICY "Professionals view all sstics responses"
    ON schizophrenia_sstics
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert sstics responses"
    ON schizophrenia_sstics
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update sstics responses"
    ON schizophrenia_sstics
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

CREATE OR REPLACE FUNCTION update_schizophrenia_sstics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_schizophrenia_sstics_updated_at
    BEFORE UPDATE ON schizophrenia_sstics
    FOR EACH ROW
    EXECUTE FUNCTION update_schizophrenia_sstics_updated_at();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE schizophrenia_sstics IS 'SSTICS - Subjective Scale to Investigate Cognition in Schizophrenia. Self-report questionnaire assessing subjective cognitive complaints across 6 domains.';
COMMENT ON COLUMN schizophrenia_sstics.sstics_memt IS 'Working Memory domain subscore (items 1-2, range 0-8)';
COMMENT ON COLUMN schizophrenia_sstics.sstics_memexp IS 'Explicit Memory domain subscore (items 3-11, range 0-36)';
COMMENT ON COLUMN schizophrenia_sstics.sstics_att IS 'Attention domain subscore (items 12-16, range 0-20)';
COMMENT ON COLUMN schizophrenia_sstics.sstics_fe IS 'Executive Functions domain subscore (items 17-19, range 0-12)';
COMMENT ON COLUMN schizophrenia_sstics.sstics_lang IS 'Language domain subscore (item 20, range 0-4)';
COMMENT ON COLUMN schizophrenia_sstics.sstics_prax IS 'Praxis domain subscore (item 21, range 0-4)';
COMMENT ON COLUMN schizophrenia_sstics.sstics_score IS 'Total score (sum of all domains, range 0-84)';
COMMENT ON COLUMN schizophrenia_sstics.sstics_scorez IS 'Z-score: (13.1 - total) / 6.2. Negative values indicate more cognitive complaints than reference population.';
