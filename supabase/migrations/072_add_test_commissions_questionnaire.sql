-- ============================================================================
-- eFondaMental Platform - Test des Commissions Questionnaire Migration
-- ============================================================================
-- Test des Commissions - Neuropsychological test assessing executive functions
-- and memory.
-- Part of the Neuropsychological Evaluation module
-- ============================================================================

-- Create Test des Commissions responses table
CREATE TABLE responses_test_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Patient age for scoring (required for Z-score calculation)
    patient_age INTEGER NOT NULL CHECK (patient_age BETWEEN 20 AND 60),
    
    -- NSC - Niveau etude (0: < baccalaureat, 1: >= baccalaureat)
    nsc INTEGER NOT NULL CHECK (nsc IN (0, 1)),
    
    -- Raw scores (inputs)
    com01 INTEGER NOT NULL CHECK (com01 >= 0), -- Time in minutes
    com02 INTEGER NOT NULL CHECK (com02 >= 0), -- Number of unnecessary detours
    com03 INTEGER NOT NULL CHECK (com03 >= 0), -- Number of schedule violations
    com04 INTEGER NOT NULL CHECK (com04 >= 0), -- Number of logical errors
    com05 TEXT, -- Sequence of commissions (optional text)
    
    -- Computed scores
    com01s1 TEXT, -- Percentile for time
    com01s2 DECIMAL(6,2), -- Z-score for time
    com02s1 TEXT, -- Percentile for detours
    com02s2 DECIMAL(6,2), -- Z-score for detours
    com03s1 TEXT, -- Percentile for schedule violations
    com03s2 DECIMAL(6,2), -- Z-score for schedule violations
    com04s1 TEXT, -- Percentile for logical errors
    com04s2 DECIMAL(6,2), -- Z-score for logical errors
    com04s3 INTEGER, -- Total errors (COM02 + COM03 + COM04)
    com04s4 TEXT, -- Percentile for total errors
    com04s5 DECIMAL(6,2), -- Z-score for total errors
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_test_commissions_visit ON responses_test_commissions(visit_id);
CREATE INDEX idx_responses_test_commissions_patient ON responses_test_commissions(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_test_commissions ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own Test Commissions" 
ON responses_test_commissions FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all Test Commissions" 
ON responses_test_commissions FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert Test Commissions" 
ON responses_test_commissions FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update Test Commissions" 
ON responses_test_commissions FOR UPDATE 
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

CREATE TRIGGER update_responses_test_commissions_updated_at
    BEFORE UPDATE ON responses_test_commissions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

