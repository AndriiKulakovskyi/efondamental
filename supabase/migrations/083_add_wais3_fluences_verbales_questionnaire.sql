-- ============================================================================
-- eFondaMental Platform - WAIS-III Fluences Verbales Migration
-- ============================================================================
-- This migration creates the table for WAIS-III Fluences Verbales (Cardebat et al., 1990)
-- Identical structure to WAIS-IV Fluences Verbales but stored separately
-- Part of the Neuropsychological Evaluation module
-- ============================================================================

-- Create WAIS-III Fluences Verbales table
CREATE TABLE responses_wais3_fluences_verbales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Demographic data for scoring
    patient_age INTEGER NOT NULL CHECK (patient_age BETWEEN 16 AND 100),
    years_of_education INTEGER NOT NULL CHECK (years_of_education >= 0),
    
    -- Lettre P (Phonemic)
    fv_p_tot_correct INTEGER NOT NULL CHECK (fv_p_tot_correct >= 0),
    fv_p_deriv INTEGER CHECK (fv_p_deriv IS NULL OR fv_p_deriv >= 0),
    fv_p_intrus INTEGER CHECK (fv_p_intrus IS NULL OR fv_p_intrus >= 0),
    fv_p_propres INTEGER CHECK (fv_p_propres IS NULL OR fv_p_propres >= 0),
    
    -- Computed scores for Lettre P
    fv_p_tot_rupregle INTEGER, -- Total rule violations
    fv_p_tot_correct_z DECIMAL(5,2), -- Z-score
    fv_p_tot_correct_pc INTEGER, -- Percentile
    
    -- Categorie Animaux (Semantic)
    fv_anim_tot_correct INTEGER NOT NULL CHECK (fv_anim_tot_correct >= 0),
    fv_anim_deriv INTEGER CHECK (fv_anim_deriv IS NULL OR fv_anim_deriv >= 0),
    fv_anim_intrus INTEGER CHECK (fv_anim_intrus IS NULL OR fv_anim_intrus >= 0),
    fv_anim_propres INTEGER CHECK (fv_anim_propres IS NULL OR fv_anim_propres >= 0),
    
    -- Computed scores for Animaux
    fv_anim_tot_rupregle INTEGER, -- Total rule violations
    fv_anim_tot_correct_z DECIMAL(5,2), -- Z-score
    fv_anim_tot_correct_pc INTEGER, -- Percentile
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_wais3_fluences_verbales_visit ON responses_wais3_fluences_verbales(visit_id);
CREATE INDEX idx_responses_wais3_fluences_verbales_patient ON responses_wais3_fluences_verbales(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_wais3_fluences_verbales ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own WAIS3 Fluences Verbales" 
ON responses_wais3_fluences_verbales FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all WAIS3 Fluences Verbales" 
ON responses_wais3_fluences_verbales FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert WAIS3 Fluences Verbales" 
ON responses_wais3_fluences_verbales FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update WAIS3 Fluences Verbales" 
ON responses_wais3_fluences_verbales FOR UPDATE 
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

CREATE TRIGGER update_responses_wais3_fluences_verbales_updated_at
    BEFORE UPDATE ON responses_wais3_fluences_verbales
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE responses_wais3_fluences_verbales IS 'Responses for WAIS-III Fluences Verbales (Cardebat et al., 1990)';

