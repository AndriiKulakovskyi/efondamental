-- ============================================================================
-- eFondaMental Platform - WAIS-IV Similitudes Questionnaire Migration
-- ============================================================================
-- Similitudes (WAIS-IV) - Assesses verbal reasoning and concept formation
-- 18 items, each scored 0-2
-- Part of the Neuropsychological Evaluation module
-- ============================================================================

-- Create WAIS-IV Similitudes responses table
CREATE TABLE responses_wais4_similitudes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Patient age for scoring
    patient_age INTEGER NOT NULL CHECK (patient_age BETWEEN 16 AND 90),
    
    -- Items 1-18 (each scored 0, 1, or 2)
    item1 INTEGER NOT NULL CHECK (item1 BETWEEN 0 AND 2),
    item2 INTEGER NOT NULL CHECK (item2 BETWEEN 0 AND 2),
    item3 INTEGER NOT NULL CHECK (item3 BETWEEN 0 AND 2),
    item4 INTEGER NOT NULL CHECK (item4 BETWEEN 0 AND 2),
    item5 INTEGER NOT NULL CHECK (item5 BETWEEN 0 AND 2),
    item6 INTEGER NOT NULL CHECK (item6 BETWEEN 0 AND 2),
    item7 INTEGER NOT NULL CHECK (item7 BETWEEN 0 AND 2),
    item8 INTEGER NOT NULL CHECK (item8 BETWEEN 0 AND 2),
    item9 INTEGER NOT NULL CHECK (item9 BETWEEN 0 AND 2),
    item10 INTEGER NOT NULL CHECK (item10 BETWEEN 0 AND 2),
    item11 INTEGER NOT NULL CHECK (item11 BETWEEN 0 AND 2),
    item12 INTEGER NOT NULL CHECK (item12 BETWEEN 0 AND 2),
    item13 INTEGER NOT NULL CHECK (item13 BETWEEN 0 AND 2),
    item14 INTEGER NOT NULL CHECK (item14 BETWEEN 0 AND 2),
    item15 INTEGER NOT NULL CHECK (item15 BETWEEN 0 AND 2),
    item16 INTEGER NOT NULL CHECK (item16 BETWEEN 0 AND 2),
    item17 INTEGER NOT NULL CHECK (item17 BETWEEN 0 AND 2),
    item18 INTEGER NOT NULL CHECK (item18 BETWEEN 0 AND 2),
    
    -- Computed scores
    total_raw_score INTEGER, -- Sum of all items (0-36)
    standard_score INTEGER, -- Age-normed standard score (1-19)
    standardized_value DECIMAL(5,2), -- (standard_score - 10) / 3
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_wais4_similitudes_visit ON responses_wais4_similitudes(visit_id);
CREATE INDEX idx_responses_wais4_similitudes_patient ON responses_wais4_similitudes(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_wais4_similitudes ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own WAIS4 Similitudes" 
ON responses_wais4_similitudes FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all WAIS4 Similitudes" 
ON responses_wais4_similitudes FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert WAIS4 Similitudes" 
ON responses_wais4_similitudes FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update WAIS4 Similitudes" 
ON responses_wais4_similitudes FOR UPDATE 
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

CREATE TRIGGER update_responses_wais4_similitudes_updated_at
    BEFORE UPDATE ON responses_wais4_similitudes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

