-- ============================================================================
-- eFondaMental Platform - WAIS-III Digit Span (Mémoire des chiffres) Migration
-- ============================================================================
-- This migration creates the table for WAIS-III Digit Span subtest
-- Includes Forward (Ordre Direct) and Backward (Ordre Inverse) components
-- Uses WAIS-III norms (different from WAIS-IV)
-- ============================================================================

-- Create WAIS-III Digit Span table
CREATE TABLE responses_wais3_digit_span (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Demographic data
    patient_age INTEGER NOT NULL CHECK (patient_age BETWEEN 16 AND 90),
    education_level INTEGER CHECK (education_level BETWEEN 0 AND 4),
    
    -- Forward (Ordre Direct) items - 8 items x 2 trials each
    mcod_1a INTEGER NOT NULL CHECK (mcod_1a BETWEEN 0 AND 1),
    mcod_1b INTEGER NOT NULL CHECK (mcod_1b BETWEEN 0 AND 1),
    mcod_2a INTEGER NOT NULL CHECK (mcod_2a BETWEEN 0 AND 1),
    mcod_2b INTEGER NOT NULL CHECK (mcod_2b BETWEEN 0 AND 1),
    mcod_3a INTEGER NOT NULL CHECK (mcod_3a BETWEEN 0 AND 1),
    mcod_3b INTEGER NOT NULL CHECK (mcod_3b BETWEEN 0 AND 1),
    mcod_4a INTEGER NOT NULL CHECK (mcod_4a BETWEEN 0 AND 1),
    mcod_4b INTEGER NOT NULL CHECK (mcod_4b BETWEEN 0 AND 1),
    mcod_5a INTEGER NOT NULL CHECK (mcod_5a BETWEEN 0 AND 1),
    mcod_5b INTEGER NOT NULL CHECK (mcod_5b BETWEEN 0 AND 1),
    mcod_6a INTEGER NOT NULL CHECK (mcod_6a BETWEEN 0 AND 1),
    mcod_6b INTEGER NOT NULL CHECK (mcod_6b BETWEEN 0 AND 1),
    mcod_7a INTEGER NOT NULL CHECK (mcod_7a BETWEEN 0 AND 1),
    mcod_7b INTEGER NOT NULL CHECK (mcod_7b BETWEEN 0 AND 1),
    mcod_8a INTEGER NOT NULL CHECK (mcod_8a BETWEEN 0 AND 1),
    mcod_8b INTEGER NOT NULL CHECK (mcod_8b BETWEEN 0 AND 1),
    
    -- Backward (Ordre Inverse) items - 7 items x 2 trials each
    mcoi_1a INTEGER NOT NULL CHECK (mcoi_1a BETWEEN 0 AND 1),
    mcoi_1b INTEGER NOT NULL CHECK (mcoi_1b BETWEEN 0 AND 1),
    mcoi_2a INTEGER NOT NULL CHECK (mcoi_2a BETWEEN 0 AND 1),
    mcoi_2b INTEGER NOT NULL CHECK (mcoi_2b BETWEEN 0 AND 1),
    mcoi_3a INTEGER NOT NULL CHECK (mcoi_3a BETWEEN 0 AND 1),
    mcoi_3b INTEGER NOT NULL CHECK (mcoi_3b BETWEEN 0 AND 1),
    mcoi_4a INTEGER NOT NULL CHECK (mcoi_4a BETWEEN 0 AND 1),
    mcoi_4b INTEGER NOT NULL CHECK (mcoi_4b BETWEEN 0 AND 1),
    mcoi_5a INTEGER NOT NULL CHECK (mcoi_5a BETWEEN 0 AND 1),
    mcoi_5b INTEGER NOT NULL CHECK (mcoi_5b BETWEEN 0 AND 1),
    mcoi_6a INTEGER NOT NULL CHECK (mcoi_6a BETWEEN 0 AND 1),
    mcoi_6b INTEGER NOT NULL CHECK (mcoi_6b BETWEEN 0 AND 1),
    mcoi_7a INTEGER NOT NULL CHECK (mcoi_7a BETWEEN 0 AND 1),
    mcoi_7b INTEGER NOT NULL CHECK (mcoi_7b BETWEEN 0 AND 1),
    
    -- Computed scores
    wais_mcod_tot INTEGER,  -- Forward raw score total
    wais_mcoi_tot INTEGER,  -- Backward raw score total
    wais_mc_tot INTEGER,    -- Total raw score (forward + backward)
    wais_mc_end INTEGER,    -- Forward span (empan endroit)
    wais_mc_env INTEGER,    -- Backward span (empan envers)
    wais_mc_emp INTEGER,    -- Span difference (end - env)
    wais_mc_std INTEGER,    -- Standard score
    wais_mc_cr DECIMAL(5,2), -- Standardized value
    wais_mc_end_z DECIMAL(5,2), -- Forward span z-score
    wais_mc_env_z DECIMAL(5,2), -- Backward span z-score
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_wais3_digit_span_visit ON responses_wais3_digit_span(visit_id);
CREATE INDEX idx_responses_wais3_digit_span_patient ON responses_wais3_digit_span(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_wais3_digit_span ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own WAIS-3 digit span" 
ON responses_wais3_digit_span FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all WAIS-3 digit span" 
ON responses_wais3_digit_span FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert WAIS-3 digit span" 
ON responses_wais3_digit_span FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update WAIS-3 digit span" 
ON responses_wais3_digit_span FOR UPDATE 
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

CREATE TRIGGER update_responses_wais3_digit_span_updated_at
    BEFORE UPDATE ON responses_wais3_digit_span
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

