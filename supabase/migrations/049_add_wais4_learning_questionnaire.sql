-- ============================================================================
-- eFondaMental Platform - WAIS-IV Learning Disorders Questionnaire Migration
-- ============================================================================
-- This migration creates the table for WAIS-IV Learning and Acquisition Disorders
-- Part of the Neuropsychological Evaluation module for initial evaluation
-- ============================================================================

-- Create WAIS-IV Learning Disorders table
CREATE TABLE responses_wais4_learning (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Q1: Dyslexia
    dyslexia INTEGER NOT NULL CHECK (dyslexia IN (0, 1, 9)),
    
    -- Q2: Dysorthographia
    dysorthographia INTEGER NOT NULL CHECK (dysorthographia IN (0, 1, 9)),
    
    -- Q3: Dyscalculia
    dyscalculia INTEGER NOT NULL CHECK (dyscalculia IN (0, 1, 9)),
    
    -- Q4: Dysphasia
    dysphasia INTEGER NOT NULL CHECK (dysphasia IN (0, 1, 9)),
    
    -- Q5: Dyspraxia
    dyspraxia INTEGER NOT NULL CHECK (dyspraxia IN (0, 1, 9)),
    
    -- Q6: Speech delay
    speech_delay INTEGER NOT NULL CHECK (speech_delay IN (0, 1, 9)),
    
    -- Q7: Stuttering
    stuttering INTEGER NOT NULL CHECK (stuttering IN (0, 1, 9)),
    
    -- Q8: Walking delay
    walking_delay INTEGER NOT NULL CHECK (walking_delay IN (0, 1, 9)),
    
    -- Q9: Febrile seizures in early childhood
    febrile_seizures INTEGER NOT NULL CHECK (febrile_seizures IN (0, 1, 9)),
    
    -- Q10: Precocity/Giftedness
    precocity INTEGER NOT NULL CHECK (precocity IN (0, 1, 9)),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_wais4_learning_visit ON responses_wais4_learning(visit_id);
CREATE INDEX idx_responses_wais4_learning_patient ON responses_wais4_learning(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_wais4_learning ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own WAIS-4 learning" 
ON responses_wais4_learning FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all WAIS-4 learning" 
ON responses_wais4_learning FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert WAIS-4 learning" 
ON responses_wais4_learning FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update WAIS-4 learning" 
ON responses_wais4_learning FOR UPDATE 
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

CREATE TRIGGER update_responses_wais4_learning_updated_at
    BEFORE UPDATE ON responses_wais4_learning
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

