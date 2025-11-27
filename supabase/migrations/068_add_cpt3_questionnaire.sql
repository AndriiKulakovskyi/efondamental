-- ============================================================================
-- eFondaMental Platform - CPT-III Questionnaire Migration
-- ============================================================================
-- CPT-III - Conners' Continuous Performance Test III
-- Computerized attention assessment - results entered from software report
-- Part of the Neuropsychological Evaluation module
-- ============================================================================

-- Create CPT-III responses table
CREATE TABLE responses_cpt3 (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Detectability
    d_prime DECIMAL(6,2), -- d'
    d_prime_interp TEXT CHECK (d_prime_interp IS NULL OR d_prime_interp IN ('Very elevated', 'Elevated', 'High average', 'Average', 'Low')),
    
    -- Errors
    omissions DECIMAL(6,2),
    omissions_interp TEXT CHECK (omissions_interp IS NULL OR omissions_interp IN ('Very elevated', 'Elevated', 'High average', 'Average', 'Low')),
    
    commissions DECIMAL(6,2),
    commissions_interp TEXT CHECK (commissions_interp IS NULL OR commissions_interp IN ('Very elevated', 'Elevated', 'High average', 'Average', 'Low')),
    
    perseverations DECIMAL(6,2),
    perseverations_interp TEXT CHECK (perseverations_interp IS NULL OR perseverations_interp IN ('Very elevated', 'Elevated', 'High average', 'Average', 'Low')),
    
    -- Reaction Time Statistics
    hrt DECIMAL(8,2), -- Hit Reaction Time
    hrt_interp TEXT CHECK (hrt_interp IS NULL OR hrt_interp IN ('Atypically slow', 'A little slow', 'Slow', 'Average', 'A little fast', 'Fast')),
    
    hrt_sd DECIMAL(8,2), -- HRT Standard Deviation
    hrt_sd_interp TEXT CHECK (hrt_sd_interp IS NULL OR hrt_sd_interp IN ('Atypically slow', 'A little slow', 'Slow', 'Average', 'A little fast', 'Fast')),
    
    variability DECIMAL(8,2),
    variability_interp TEXT CHECK (variability_interp IS NULL OR variability_interp IN ('Atypically slow', 'A little slow', 'Slow', 'Average', 'A little fast', 'Fast')),
    
    hrt_block_change DECIMAL(8,2),
    hrt_block_change_interp TEXT CHECK (hrt_block_change_interp IS NULL OR hrt_block_change_interp IN ('Atypically slow', 'A little slow', 'Slow', 'Average', 'A little fast', 'Fast')),
    
    hrt_isi_change DECIMAL(8,2),
    hrt_isi_change_interp TEXT CHECK (hrt_isi_change_interp IS NULL OR hrt_isi_change_interp IN ('Atypically slow', 'A little slow', 'Slow', 'Average', 'A little fast', 'Fast')),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_cpt3_visit ON responses_cpt3(visit_id);
CREATE INDEX idx_responses_cpt3_patient ON responses_cpt3(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_cpt3 ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own CPT3" 
ON responses_cpt3 FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all CPT3" 
ON responses_cpt3 FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert CPT3" 
ON responses_cpt3 FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update CPT3" 
ON responses_cpt3 FOR UPDATE 
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

CREATE TRIGGER update_responses_cpt3_updated_at
    BEFORE UPDATE ON responses_cpt3
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

