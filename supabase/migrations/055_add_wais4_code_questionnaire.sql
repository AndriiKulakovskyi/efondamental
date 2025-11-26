-- eFondaMental Platform - WAIS-IV Subtest Code Questionnaire
-- Version: 4.0
-- Type: Hetero-questionnaire (clinician-rated)
-- Description: Evaluates graphical processing speed

-- Create responses table for WAIS-IV Code
CREATE TABLE responses_wais4_code (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Demographic data (required for scoring)
    patient_age INTEGER NOT NULL CHECK (patient_age >= 16 AND patient_age <= 90),
    
    -- Cotation (Scoring inputs)
    total_correct INTEGER NOT NULL CHECK (total_correct >= 0 AND total_correct <= 135),
    total_errors INTEGER NOT NULL CHECK (total_errors >= 0 AND total_errors <= 135),
    
    -- Computed scores
    raw_score INTEGER GENERATED ALWAYS AS (total_correct) STORED,
    standardized_score INTEGER CHECK (standardized_score >= 1 AND standardized_score <= 19),
    z_score DECIMAL(5,2),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_wais4_code ENABLE ROW LEVEL SECURITY;

-- Professional Policies (SELECT, INSERT, UPDATE)
CREATE POLICY "Professionals can view WAIS4 Code responses"
ON responses_wais4_code FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid()
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

CREATE POLICY "Professionals can insert WAIS4 Code responses"
ON responses_wais4_code FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid()
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

CREATE POLICY "Professionals can update WAIS4 Code responses"
ON responses_wais4_code FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid()
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Create indexes for performance
CREATE INDEX idx_responses_wais4_code_visit_id ON responses_wais4_code(visit_id);
CREATE INDEX idx_responses_wais4_code_patient_id ON responses_wais4_code(patient_id);

-- Add trigger for updated_at
CREATE TRIGGER update_responses_wais4_code_updated_at
    BEFORE UPDATE ON responses_wais4_code
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE responses_wais4_code IS 'Responses for WAIS-IV Subtest Code - Evaluates graphical processing speed';

