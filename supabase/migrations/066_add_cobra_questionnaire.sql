-- ============================================================================
-- eFondaMental Platform - COBRA Questionnaire Migration
-- ============================================================================
-- COBRA - Cognitive Complaints in Bipolar Disorder Rating Assessment
-- Self-report questionnaire with 16 items (0-3 scale each)
-- Part of the Neuropsychological Evaluation module
-- ============================================================================

-- Create COBRA responses table
CREATE TABLE responses_cobra (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Questions 1-16 (each scored 0-3: Jamais=0, Parfois=1, Frequemment=2, Toujours=3)
    q1 INTEGER NOT NULL CHECK (q1 BETWEEN 0 AND 3),
    q2 INTEGER NOT NULL CHECK (q2 BETWEEN 0 AND 3),
    q3 INTEGER NOT NULL CHECK (q3 BETWEEN 0 AND 3),
    q4 INTEGER NOT NULL CHECK (q4 BETWEEN 0 AND 3),
    q5 INTEGER NOT NULL CHECK (q5 BETWEEN 0 AND 3),
    q6 INTEGER NOT NULL CHECK (q6 BETWEEN 0 AND 3),
    q7 INTEGER NOT NULL CHECK (q7 BETWEEN 0 AND 3),
    q8 INTEGER NOT NULL CHECK (q8 BETWEEN 0 AND 3),
    q9 INTEGER NOT NULL CHECK (q9 BETWEEN 0 AND 3),
    q10 INTEGER NOT NULL CHECK (q10 BETWEEN 0 AND 3),
    q11 INTEGER NOT NULL CHECK (q11 BETWEEN 0 AND 3),
    q12 INTEGER NOT NULL CHECK (q12 BETWEEN 0 AND 3),
    q13 INTEGER NOT NULL CHECK (q13 BETWEEN 0 AND 3),
    q14 INTEGER NOT NULL CHECK (q14 BETWEEN 0 AND 3),
    q15 INTEGER NOT NULL CHECK (q15 BETWEEN 0 AND 3),
    q16 INTEGER NOT NULL CHECK (q16 BETWEEN 0 AND 3),
    
    -- Total score (0-48)
    total_score INTEGER GENERATED ALWAYS AS (
        q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8 + 
        q9 + q10 + q11 + q12 + q13 + q14 + q15 + q16
    ) STORED,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_cobra_visit ON responses_cobra(visit_id);
CREATE INDEX idx_responses_cobra_patient ON responses_cobra(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_cobra ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own COBRA" 
ON responses_cobra FOR SELECT 
USING (auth.uid() = patient_id);

-- Patients can insert their own responses (self-report)
CREATE POLICY "Patients insert own COBRA" 
ON responses_cobra FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

-- Patients can update their own responses
CREATE POLICY "Patients update own COBRA" 
ON responses_cobra FOR UPDATE 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all COBRA" 
ON responses_cobra FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert COBRA" 
ON responses_cobra FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update COBRA" 
ON responses_cobra FOR UPDATE 
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

CREATE TRIGGER update_responses_cobra_updated_at
    BEFORE UPDATE ON responses_cobra
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

