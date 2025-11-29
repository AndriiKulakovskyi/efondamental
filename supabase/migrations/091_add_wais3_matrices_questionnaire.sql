-- ============================================================================
-- eFondaMental Platform - WAIS-III Matrices Questionnaire Migration
-- ============================================================================
-- This migration creates the table for WAIS-III Matrices subtest
-- Uses WAIS-III norms (different from WAIS-IV)
-- ============================================================================

-- Create WAIS-III Matrices table
CREATE TABLE responses_wais3_matrices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Demographic data
    patient_age INTEGER NOT NULL CHECK (patient_age BETWEEN 16 AND 90),
    
    -- Item scores (0 or 1 for each item)
    item_01 INTEGER NOT NULL CHECK (item_01 BETWEEN 0 AND 1),
    item_02 INTEGER NOT NULL CHECK (item_02 BETWEEN 0 AND 1),
    item_03 INTEGER NOT NULL CHECK (item_03 BETWEEN 0 AND 1),
    item_04 INTEGER NOT NULL CHECK (item_04 BETWEEN 0 AND 1),
    item_05 INTEGER NOT NULL CHECK (item_05 BETWEEN 0 AND 1),
    item_06 INTEGER NOT NULL CHECK (item_06 BETWEEN 0 AND 1),
    item_07 INTEGER NOT NULL CHECK (item_07 BETWEEN 0 AND 1),
    item_08 INTEGER NOT NULL CHECK (item_08 BETWEEN 0 AND 1),
    item_09 INTEGER NOT NULL CHECK (item_09 BETWEEN 0 AND 1),
    item_10 INTEGER NOT NULL CHECK (item_10 BETWEEN 0 AND 1),
    item_11 INTEGER NOT NULL CHECK (item_11 BETWEEN 0 AND 1),
    item_12 INTEGER NOT NULL CHECK (item_12 BETWEEN 0 AND 1),
    item_13 INTEGER NOT NULL CHECK (item_13 BETWEEN 0 AND 1),
    item_14 INTEGER NOT NULL CHECK (item_14 BETWEEN 0 AND 1),
    item_15 INTEGER NOT NULL CHECK (item_15 BETWEEN 0 AND 1),
    item_16 INTEGER NOT NULL CHECK (item_16 BETWEEN 0 AND 1),
    item_17 INTEGER NOT NULL CHECK (item_17 BETWEEN 0 AND 1),
    item_18 INTEGER NOT NULL CHECK (item_18 BETWEEN 0 AND 1),
    item_19 INTEGER NOT NULL CHECK (item_19 BETWEEN 0 AND 1),
    item_20 INTEGER NOT NULL CHECK (item_20 BETWEEN 0 AND 1),
    item_21 INTEGER NOT NULL CHECK (item_21 BETWEEN 0 AND 1),
    item_22 INTEGER NOT NULL CHECK (item_22 BETWEEN 0 AND 1),
    item_23 INTEGER NOT NULL CHECK (item_23 BETWEEN 0 AND 1),
    item_24 INTEGER NOT NULL CHECK (item_24 BETWEEN 0 AND 1),
    item_25 INTEGER NOT NULL CHECK (item_25 BETWEEN 0 AND 1),
    item_26 INTEGER NOT NULL CHECK (item_26 BETWEEN 0 AND 1),
    
    -- Total raw score (computed)
    total_raw_score INTEGER GENERATED ALWAYS AS (
        item_01 + item_02 + item_03 + item_04 + item_05 + item_06 + item_07 + item_08 + item_09 + item_10 +
        item_11 + item_12 + item_13 + item_14 + item_15 + item_16 + item_17 + item_18 + item_19 + item_20 +
        item_21 + item_22 + item_23 + item_24 + item_25 + item_26
    ) STORED,
    
    -- Standard score (computed from age-based norms)
    standard_score INTEGER,
    
    -- Standardized value (z-score equivalent)
    standardized_value DECIMAL(4,2),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_wais3_matrices_visit ON responses_wais3_matrices(visit_id);
CREATE INDEX idx_responses_wais3_matrices_patient ON responses_wais3_matrices(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_wais3_matrices ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own WAIS-3 matrices" 
ON responses_wais3_matrices FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all WAIS-3 matrices" 
ON responses_wais3_matrices FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert WAIS-3 matrices" 
ON responses_wais3_matrices FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update WAIS-3 matrices" 
ON responses_wais3_matrices FOR UPDATE 
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

CREATE TRIGGER update_responses_wais3_matrices_updated_at
    BEFORE UPDATE ON responses_wais3_matrices
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

