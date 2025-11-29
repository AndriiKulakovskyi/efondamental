-- ============================================================================
-- eFondaMental Platform - WAIS-III CPT II V.5 Migration
-- ============================================================================
-- This migration creates the table for CPT II V.5 (Conners' Continuous 
-- Performance Test II) - a data entry form for externally computed results.
-- No internal scoring logic - values come from CPT II software.
-- ============================================================================

-- Create WAIS-III CPT II table
CREATE TABLE responses_wais3_cpt2 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Omissions
    cpt2_omissions_value DECIMAL(10,2),
    cpt2_omissions_pourcentage DECIMAL(10,2),
    cpt2_omissions_tscore DECIMAL(10,2),
    cpt2_omissions_percentile DECIMAL(10,2),
    cpt2_omissions_guideline TEXT,
    
    -- Commissions
    cpt2_comissions_value DECIMAL(10,2),
    cpt2_comissions_pourcentage DECIMAL(10,2),
    cpt2_comissions_tscore DECIMAL(10,2),
    cpt2_comissions_percentile DECIMAL(10,2),
    cpt2_comissions_guideline TEXT,
    
    -- Hit RT
    cpt2_hitrt_value DECIMAL(10,2),
    cpt2_hitrt_tscore DECIMAL(10,2),
    cpt2_hitrt_percentile DECIMAL(10,2),
    cpt2_hitrt_guideline TEXT,
    
    -- Hit RT Std. Error
    cpt2_hitrtstder_value DECIMAL(10,2),
    cpt2_hitrtstder_tscore DECIMAL(10,2),
    cpt2_hitrtstder_percentile DECIMAL(10,2),
    cpt2_hitrtstder_guideline TEXT,
    
    -- Variability
    cpt2_variability_value DECIMAL(10,2),
    cpt2_variability_tscore DECIMAL(10,2),
    cpt2_variability_percentile DECIMAL(10,2),
    cpt2_variability_guideline TEXT,
    
    -- Detectability (d')
    cpt2_detectability_value DECIMAL(10,2),
    cpt2_detectability_tscore DECIMAL(10,2),
    cpt2_detectability_percentile DECIMAL(10,2),
    cpt2_detectability_guideline TEXT,
    
    -- Response Style (Beta)
    cpt2_responsestyle_value DECIMAL(10,2),
    cpt2_responsestyle_tscore DECIMAL(10,2),
    cpt2_responsestyle_percentile DECIMAL(10,2),
    cpt2_responsestyle_guideline TEXT,
    
    -- Perseverations
    cpt2_perseverations_value DECIMAL(10,2),
    cpt2_perseverations_pourcentage DECIMAL(10,2),
    cpt2_perseverations_tscore DECIMAL(10,2),
    cpt2_perseverations_percentile DECIMAL(10,2),
    cpt2_perseverations_guideline TEXT,
    
    -- Hit RT Block Change
    cpt2_hitrtblockchange_value DECIMAL(10,2),
    cpt2_hitrtblockchange_tscore DECIMAL(10,2),
    cpt2_hitrtblockchange_percentile DECIMAL(10,2),
    cpt2_hitrtblockchange_guideline TEXT,
    
    -- Hit SE Block Change
    cpt2_hitseblockchange_value DECIMAL(10,2),
    cpt2_hitseblockchange_tscore DECIMAL(10,2),
    cpt2_hitseblockchange_percentile DECIMAL(10,2),
    cpt2_hitseblockchange_guideline TEXT,
    
    -- Hit RT ISI Change
    cpt2_hitrtisichange_value DECIMAL(10,2),
    cpt2_hitrtisichange_tscore DECIMAL(10,2),
    cpt2_hitrtisichange_percentile DECIMAL(10,2),
    cpt2_hitrtisichange_guideline TEXT,
    
    -- Hit SE ISI Change
    cpt2_hitseisichange_value DECIMAL(10,2),
    cpt2_hitseisichange_tscore DECIMAL(10,2),
    cpt2_hitseisichange_percentile DECIMAL(10,2),
    cpt2_hitseisichange_guideline TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_wais3_cpt2_visit ON responses_wais3_cpt2(visit_id);
CREATE INDEX idx_responses_wais3_cpt2_patient ON responses_wais3_cpt2(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_wais3_cpt2 ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own WAIS-3 CPT2" 
ON responses_wais3_cpt2 FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all WAIS-3 CPT2" 
ON responses_wais3_cpt2 FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert WAIS-3 CPT2" 
ON responses_wais3_cpt2 FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update WAIS-3 CPT2" 
ON responses_wais3_cpt2 FOR UPDATE 
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

CREATE TRIGGER update_responses_wais3_cpt2_updated_at
    BEFORE UPDATE ON responses_wais3_cpt2
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

