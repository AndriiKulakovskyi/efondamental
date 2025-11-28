-- ============================================================================
-- eFondaMental Platform - WAIS-III Stroop Test Migration
-- ============================================================================
-- This migration creates the table for WAIS-III Stroop Test (Golden 1978)
-- Identical structure to WAIS-IV Stroop but stored separately
-- Part of the Neuropsychological Evaluation module
-- ============================================================================

-- Create WAIS-III Stroop table
CREATE TABLE responses_wais3_stroop (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Demographic data for scoring
    patient_age INTEGER NOT NULL CHECK (patient_age BETWEEN 16 AND 100),
    
    -- Raw scores (number of items in 45 seconds)
    stroop_w_tot INTEGER NOT NULL CHECK (stroop_w_tot >= 0), -- Words read
    stroop_c_tot INTEGER NOT NULL CHECK (stroop_c_tot >= 0), -- Colors named
    stroop_cw_tot INTEGER NOT NULL CHECK (stroop_cw_tot >= 0), -- Color-words named
    
    -- Age-corrected scores
    stroop_w_tot_c INTEGER, -- Age-corrected Word Score
    stroop_c_tot_c INTEGER, -- Age-corrected Color Score
    stroop_cw_tot_c INTEGER, -- Age-corrected Color-Word Score
    
    -- Interference score
    stroop_interf DECIMAL(6,2), -- Interference Score
    
    -- T-scores
    stroop_w_note_t INTEGER, -- T-score for Words
    stroop_c_note_t INTEGER, -- T-score for Colors
    stroop_cw_note_t INTEGER, -- T-score for Color-Words
    stroop_interf_note_t INTEGER, -- T-score for Interference
    
    -- Z-scores (derived from T-scores)
    stroop_w_note_t_corrigee DECIMAL(4,2), -- Z-score for Words
    stroop_c_note_t_corrigee DECIMAL(4,2), -- Z-score for Colors
    stroop_cw_note_t_corrigee DECIMAL(4,2), -- Z-score for Color-Words
    stroop_interf_note_tz DECIMAL(4,2), -- Z-score for Interference
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_wais3_stroop_visit ON responses_wais3_stroop(visit_id);
CREATE INDEX idx_responses_wais3_stroop_patient ON responses_wais3_stroop(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_wais3_stroop ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own WAIS3 Stroop" 
ON responses_wais3_stroop FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all WAIS3 Stroop" 
ON responses_wais3_stroop FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert WAIS3 Stroop" 
ON responses_wais3_stroop FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update WAIS3 Stroop" 
ON responses_wais3_stroop FOR UPDATE 
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

CREATE TRIGGER update_responses_wais3_stroop_updated_at
    BEFORE UPDATE ON responses_wais3_stroop
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE responses_wais3_stroop IS 'Responses for WAIS-III Stroop Test (Golden 1978)';

