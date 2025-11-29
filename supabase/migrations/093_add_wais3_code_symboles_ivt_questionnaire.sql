-- ============================================================================
-- eFondaMental Platform - WAIS-III Code, Symboles & IVT Questionnaire Migration
-- ============================================================================
-- This migration creates the table for WAIS-III Code, Symboles, and
-- Processing Speed Index (IVT) subtests.
-- Uses WAIS-III norms (different from WAIS-IV)
-- ============================================================================

-- Create WAIS-III Code/Symboles/IVT table
CREATE TABLE responses_wais3_code_symboles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Demographic data
    patient_age INTEGER NOT NULL CHECK (patient_age BETWEEN 16 AND 90),
    
    -- Code Subtest inputs
    wais_cod_tot INTEGER NOT NULL CHECK (wais_cod_tot >= 0),  -- Total correct boxes
    wais_cod_err INTEGER NOT NULL DEFAULT 0 CHECK (wais_cod_err >= 0),  -- Incorrect boxes
    
    -- Symboles Subtest inputs
    wais_symb_tot INTEGER NOT NULL CHECK (wais_symb_tot >= 0),  -- Total correct
    wais_symb_err INTEGER NOT NULL DEFAULT 0 CHECK (wais_symb_err >= 0),  -- Incorrect
    
    -- Code calculated scores
    wais_cod_brut INTEGER,  -- Raw score (= wais_cod_tot, errors ignored per spec)
    wais_cod_std INTEGER,   -- Standard score from norm table
    wais_cod_cr DECIMAL(5,2),  -- Standardized value ((std - 10) / 3)
    
    -- Symboles calculated scores
    wais_symb_brut INTEGER,  -- Raw score (= tot - err)
    wais_symb_std INTEGER,   -- Standard score from norm table
    wais_symb_cr DECIMAL(5,2),  -- Standardized value ((std - 10) / 3)
    
    -- IVT (Processing Speed Index) calculated scores
    wais_somme_ivt INTEGER,  -- Sum of standard scores (cod_std + symb_std)
    wais_ivt INTEGER,        -- IVT Index from conversion table
    wais_ivt_rang TEXT,      -- Percentile rank
    wais_ivt_95 TEXT,        -- 95% confidence interval
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_wais3_code_symboles_visit ON responses_wais3_code_symboles(visit_id);
CREATE INDEX idx_responses_wais3_code_symboles_patient ON responses_wais3_code_symboles(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_wais3_code_symboles ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own WAIS-3 code symboles" 
ON responses_wais3_code_symboles FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all WAIS-3 code symboles" 
ON responses_wais3_code_symboles FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert WAIS-3 code symboles" 
ON responses_wais3_code_symboles FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update WAIS-3 code symboles" 
ON responses_wais3_code_symboles FOR UPDATE 
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

CREATE TRIGGER update_responses_wais3_code_symboles_updated_at
    BEFORE UPDATE ON responses_wais3_code_symboles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

