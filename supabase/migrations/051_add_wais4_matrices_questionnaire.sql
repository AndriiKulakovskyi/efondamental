-- ============================================================================
-- eFondaMental Platform - WAIS-IV Matrices Subtest Migration
-- ============================================================================
-- This migration creates the table for WAIS-IV Matrices (Raisonnement fluide)
-- Part of the Neuropsychological Evaluation module for initial evaluation
-- ============================================================================

-- Create WAIS-IV Matrices table
CREATE TABLE responses_wais4_matrices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Demographic data
    patient_age INTEGER NOT NULL CHECK (patient_age BETWEEN 16 AND 90),
    
    -- Items 1-26 (0 or 1 each)
    item_01 INTEGER NOT NULL CHECK (item_01 IN (0, 1)),
    item_02 INTEGER NOT NULL CHECK (item_02 IN (0, 1)),
    item_03 INTEGER NOT NULL CHECK (item_03 IN (0, 1)),
    item_04 INTEGER NOT NULL CHECK (item_04 IN (0, 1)),
    item_05 INTEGER NOT NULL CHECK (item_05 IN (0, 1)),
    item_06 INTEGER NOT NULL CHECK (item_06 IN (0, 1)),
    item_07 INTEGER NOT NULL CHECK (item_07 IN (0, 1)),
    item_08 INTEGER NOT NULL CHECK (item_08 IN (0, 1)),
    item_09 INTEGER NOT NULL CHECK (item_09 IN (0, 1)),
    item_10 INTEGER NOT NULL CHECK (item_10 IN (0, 1)),
    item_11 INTEGER NOT NULL CHECK (item_11 IN (0, 1)),
    item_12 INTEGER NOT NULL CHECK (item_12 IN (0, 1)),
    item_13 INTEGER NOT NULL CHECK (item_13 IN (0, 1)),
    item_14 INTEGER NOT NULL CHECK (item_14 IN (0, 1)),
    item_15 INTEGER NOT NULL CHECK (item_15 IN (0, 1)),
    item_16 INTEGER NOT NULL CHECK (item_16 IN (0, 1)),
    item_17 INTEGER NOT NULL CHECK (item_17 IN (0, 1)),
    item_18 INTEGER NOT NULL CHECK (item_18 IN (0, 1)),
    item_19 INTEGER NOT NULL CHECK (item_19 IN (0, 1)),
    item_20 INTEGER NOT NULL CHECK (item_20 IN (0, 1)),
    item_21 INTEGER NOT NULL CHECK (item_21 IN (0, 1)),
    item_22 INTEGER NOT NULL CHECK (item_22 IN (0, 1)),
    item_23 INTEGER NOT NULL CHECK (item_23 IN (0, 1)),
    item_24 INTEGER NOT NULL CHECK (item_24 IN (0, 1)),
    item_25 INTEGER NOT NULL CHECK (item_25 IN (0, 1)),
    item_26 INTEGER NOT NULL CHECK (item_26 IN (0, 1)),
    
    -- Computed scores
    raw_score INTEGER GENERATED ALWAYS AS (
        item_01 + item_02 + item_03 + item_04 + item_05 + item_06 + item_07 + item_08 + item_09 + item_10 +
        item_11 + item_12 + item_13 + item_14 + item_15 + item_16 + item_17 + item_18 + item_19 + item_20 +
        item_21 + item_22 + item_23 + item_24 + item_25 + item_26
    ) STORED,
    standardized_score INTEGER, -- 1-19 based on age and raw score
    percentile_rank DECIMAL(5,2), -- Percentile rank
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_wais4_matrices_visit ON responses_wais4_matrices(visit_id);
CREATE INDEX idx_responses_wais4_matrices_patient ON responses_wais4_matrices(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_wais4_matrices ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own WAIS-4 matrices" 
ON responses_wais4_matrices FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all WAIS-4 matrices" 
ON responses_wais4_matrices FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert WAIS-4 matrices" 
ON responses_wais4_matrices FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update WAIS-4 matrices" 
ON responses_wais4_matrices FOR UPDATE 
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

CREATE TRIGGER update_responses_wais4_matrices_updated_at
    BEFORE UPDATE ON responses_wais4_matrices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

