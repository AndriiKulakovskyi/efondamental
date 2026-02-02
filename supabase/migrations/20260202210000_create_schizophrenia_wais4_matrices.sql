-- ============================================================================
-- Migration: Create WAIS-IV Matrices table for Schizophrenia
-- ============================================================================
-- This table stores responses and computed scores for the WAIS-IV Matrices
-- subtest, which assesses perceptual reasoning and fluid intelligence through
-- visual pattern completion.
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS schizophrenia_wais4_matrices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Demographics for scoring
    patient_age INTEGER,
    
    -- Test status
    test_done BOOLEAN DEFAULT false,
    
    -- 26 item scores (0-1 each)
    rad_wais_mat1 INTEGER CHECK (rad_wais_mat1 IS NULL OR rad_wais_mat1 BETWEEN 0 AND 1),
    rad_wais_mat2 INTEGER CHECK (rad_wais_mat2 IS NULL OR rad_wais_mat2 BETWEEN 0 AND 1),
    rad_wais_mat3 INTEGER CHECK (rad_wais_mat3 IS NULL OR rad_wais_mat3 BETWEEN 0 AND 1),
    rad_wais_mat4 INTEGER CHECK (rad_wais_mat4 IS NULL OR rad_wais_mat4 BETWEEN 0 AND 1),
    rad_wais_mat5 INTEGER CHECK (rad_wais_mat5 IS NULL OR rad_wais_mat5 BETWEEN 0 AND 1),
    rad_wais_mat6 INTEGER CHECK (rad_wais_mat6 IS NULL OR rad_wais_mat6 BETWEEN 0 AND 1),
    rad_wais_mat7 INTEGER CHECK (rad_wais_mat7 IS NULL OR rad_wais_mat7 BETWEEN 0 AND 1),
    rad_wais_mat8 INTEGER CHECK (rad_wais_mat8 IS NULL OR rad_wais_mat8 BETWEEN 0 AND 1),
    rad_wais_mat9 INTEGER CHECK (rad_wais_mat9 IS NULL OR rad_wais_mat9 BETWEEN 0 AND 1),
    rad_wais_mat10 INTEGER CHECK (rad_wais_mat10 IS NULL OR rad_wais_mat10 BETWEEN 0 AND 1),
    rad_wais_mat11 INTEGER CHECK (rad_wais_mat11 IS NULL OR rad_wais_mat11 BETWEEN 0 AND 1),
    rad_wais_mat12 INTEGER CHECK (rad_wais_mat12 IS NULL OR rad_wais_mat12 BETWEEN 0 AND 1),
    rad_wais_mat13 INTEGER CHECK (rad_wais_mat13 IS NULL OR rad_wais_mat13 BETWEEN 0 AND 1),
    rad_wais_mat14 INTEGER CHECK (rad_wais_mat14 IS NULL OR rad_wais_mat14 BETWEEN 0 AND 1),
    rad_wais_mat15 INTEGER CHECK (rad_wais_mat15 IS NULL OR rad_wais_mat15 BETWEEN 0 AND 1),
    rad_wais_mat16 INTEGER CHECK (rad_wais_mat16 IS NULL OR rad_wais_mat16 BETWEEN 0 AND 1),
    rad_wais_mat17 INTEGER CHECK (rad_wais_mat17 IS NULL OR rad_wais_mat17 BETWEEN 0 AND 1),
    rad_wais_mat18 INTEGER CHECK (rad_wais_mat18 IS NULL OR rad_wais_mat18 BETWEEN 0 AND 1),
    rad_wais_mat19 INTEGER CHECK (rad_wais_mat19 IS NULL OR rad_wais_mat19 BETWEEN 0 AND 1),
    rad_wais_mat20 INTEGER CHECK (rad_wais_mat20 IS NULL OR rad_wais_mat20 BETWEEN 0 AND 1),
    rad_wais_mat21 INTEGER CHECK (rad_wais_mat21 IS NULL OR rad_wais_mat21 BETWEEN 0 AND 1),
    rad_wais_mat22 INTEGER CHECK (rad_wais_mat22 IS NULL OR rad_wais_mat22 BETWEEN 0 AND 1),
    rad_wais_mat23 INTEGER CHECK (rad_wais_mat23 IS NULL OR rad_wais_mat23 BETWEEN 0 AND 1),
    rad_wais_mat24 INTEGER CHECK (rad_wais_mat24 IS NULL OR rad_wais_mat24 BETWEEN 0 AND 1),
    rad_wais_mat25 INTEGER CHECK (rad_wais_mat25 IS NULL OR rad_wais_mat25 BETWEEN 0 AND 1),
    rad_wais_mat26 INTEGER CHECK (rad_wais_mat26 IS NULL OR rad_wais_mat26 BETWEEN 0 AND 1),
    
    -- Computed scores
    wais_mat_tot INTEGER CHECK (wais_mat_tot IS NULL OR wais_mat_tot BETWEEN 0 AND 26),  -- Raw score total
    wais_mat_std INTEGER CHECK (wais_mat_std IS NULL OR wais_mat_std BETWEEN 1 AND 19),  -- Standard score
    wais_mat_cr NUMERIC(5,2),  -- Z-score: (standard_score - 10) / 3
    
    -- Metadata
    completed_by UUID REFERENCES user_profiles(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_schizophrenia_wais4_matrices_visit_id ON schizophrenia_wais4_matrices(visit_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_wais4_matrices_patient_id ON schizophrenia_wais4_matrices(patient_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_wais4_matrices_completed_at ON schizophrenia_wais4_matrices(completed_at);

-- Enable Row Level Security
ALTER TABLE schizophrenia_wais4_matrices ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Patient Policies
-- ============================================================================

CREATE POLICY "Patients view own matrices responses"
    ON schizophrenia_wais4_matrices
    FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own matrices responses"
    ON schizophrenia_wais4_matrices
    FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own matrices responses"
    ON schizophrenia_wais4_matrices
    FOR UPDATE
    USING (auth.uid() = patient_id);

-- ============================================================================
-- Professional Policies
-- ============================================================================

CREATE POLICY "Professionals view all matrices responses"
    ON schizophrenia_wais4_matrices
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert matrices responses"
    ON schizophrenia_wais4_matrices
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update matrices responses"
    ON schizophrenia_wais4_matrices
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

CREATE OR REPLACE FUNCTION update_schizophrenia_wais4_matrices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_schizophrenia_wais4_matrices_updated_at
    BEFORE UPDATE ON schizophrenia_wais4_matrices
    FOR EACH ROW
    EXECUTE FUNCTION update_schizophrenia_wais4_matrices_updated_at();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE schizophrenia_wais4_matrices IS 'WAIS-IV Matrices subtest responses for schizophrenia patients - assesses perceptual reasoning and fluid intelligence';
COMMENT ON COLUMN schizophrenia_wais4_matrices.patient_age IS 'Patient age used for age-based normative scoring';
COMMENT ON COLUMN schizophrenia_wais4_matrices.test_done IS 'Whether the test was administered';
COMMENT ON COLUMN schizophrenia_wais4_matrices.wais_mat_tot IS 'Total raw score (sum of 26 items, range 0-26)';
COMMENT ON COLUMN schizophrenia_wais4_matrices.wais_mat_std IS 'Age-adjusted standard score (1-19, mean=10, SD=3). NULL if discontinuation rule triggered.';
COMMENT ON COLUMN schizophrenia_wais4_matrices.wais_mat_cr IS 'Z-score: (standard_score - 10) / 3. NULL if discontinuation rule triggered.';
