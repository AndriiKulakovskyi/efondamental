-- ============================================================================
-- eFondaMental Platform - SCIP Questionnaire Migration
-- ============================================================================
-- SCIP - Screening Assessment for Cognitive Impairment in Psychiatry
-- Brief screening tool for cognitive impairment in psychiatry.
-- Part of the Neuropsychological Evaluation module
-- ============================================================================

-- Create SCIP responses table
CREATE TABLE responses_scip (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Raw scores (inputs) - each section has a score out of 24
    scipv01a DECIMAL(5,2) NOT NULL CHECK (scipv01a >= 0), -- Apprentissage Verbal Immediat
    scipv02a DECIMAL(5,2) NOT NULL CHECK (scipv02a >= 0), -- Memoire de Travail
    scipv03a DECIMAL(5,2) NOT NULL CHECK (scipv03a >= 0), -- Fluence Verbale
    scipv04a DECIMAL(5,2) NOT NULL CHECK (scipv04a >= 0), -- Rappel Verbal Differe
    scipv05a DECIMAL(5,2) NOT NULL CHECK (scipv05a >= 0), -- Capacites Visuomotrices
    
    -- Computed Z-scores
    scipv01b DECIMAL(6,2), -- Z-score for Apprentissage Verbal Immediat
    scipv02b DECIMAL(6,2), -- Z-score for Memoire de Travail
    scipv03b DECIMAL(6,2), -- Z-score for Fluence Verbale
    scipv04b DECIMAL(6,2), -- Z-score for Rappel Verbal Differe
    scipv05b DECIMAL(6,2), -- Z-score for Capacites Visuomotrices
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_scip_visit ON responses_scip(visit_id);
CREATE INDEX idx_responses_scip_patient ON responses_scip(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_scip ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own SCIP" 
ON responses_scip FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all SCIP" 
ON responses_scip FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert SCIP" 
ON responses_scip FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update SCIP" 
ON responses_scip FOR UPDATE 
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

CREATE TRIGGER update_responses_scip_updated_at
    BEFORE UPDATE ON responses_scip
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Column comments
-- ============================================================================

COMMENT ON COLUMN responses_scip.scipv01a IS 'Apprentissage Verbal Immediat - Score saisi (sum/24)';
COMMENT ON COLUMN responses_scip.scipv01b IS 'Apprentissage Verbal Immediat - Z-score: (score - 23.59) / 2.87';
COMMENT ON COLUMN responses_scip.scipv02a IS 'Memoire de Travail - Score saisi (sum/24)';
COMMENT ON COLUMN responses_scip.scipv02b IS 'Memoire de Travail - Z-score: (score - 20.66) / 2.45';
COMMENT ON COLUMN responses_scip.scipv03a IS 'Fluence Verbale - Score saisi (sum/24)';
COMMENT ON COLUMN responses_scip.scipv03b IS 'Fluence Verbale - Z-score: (score - 17.44) / 4.74';
COMMENT ON COLUMN responses_scip.scipv04a IS 'Rappel Verbal Differe - Score saisi (sum/24)';
COMMENT ON COLUMN responses_scip.scipv04b IS 'Rappel Verbal Differe - Z-score: (score - 7.65) / 1.90';
COMMENT ON COLUMN responses_scip.scipv05a IS 'Capacites Visuomotrices - Score saisi (sum/24)';
COMMENT ON COLUMN responses_scip.scipv05b IS 'Capacites Visuomotrices - Z-score: (score - 14.26) / 2.25';

