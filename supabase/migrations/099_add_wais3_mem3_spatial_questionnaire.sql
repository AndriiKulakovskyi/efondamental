-- ============================================================================
-- eFondaMental Platform - MEM-III Mémoire Spatiale Migration
-- ============================================================================
-- This migration creates the table for MEM-III (Wechsler Memory Scale - 3rd 
-- Edition) Spatial Span subtest, including Forward (Ordre Direct) and 
-- Backward (Ordre Inverse) components.
-- ============================================================================

-- Create MEM-III Spatial Span table
CREATE TABLE responses_wais3_mem3_spatial (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Patient age for norm lookup
    patient_age INTEGER NOT NULL CHECK (patient_age BETWEEN 16 AND 90),
    
    -- Forward (Ordre Direct) items - 8 items x 2 trials each
    odirect_1a INTEGER NOT NULL CHECK (odirect_1a BETWEEN 0 AND 1),
    odirect_1b INTEGER NOT NULL CHECK (odirect_1b BETWEEN 0 AND 1),
    odirect_2a INTEGER NOT NULL CHECK (odirect_2a BETWEEN 0 AND 1),
    odirect_2b INTEGER NOT NULL CHECK (odirect_2b BETWEEN 0 AND 1),
    odirect_3a INTEGER NOT NULL CHECK (odirect_3a BETWEEN 0 AND 1),
    odirect_3b INTEGER NOT NULL CHECK (odirect_3b BETWEEN 0 AND 1),
    odirect_4a INTEGER NOT NULL CHECK (odirect_4a BETWEEN 0 AND 1),
    odirect_4b INTEGER NOT NULL CHECK (odirect_4b BETWEEN 0 AND 1),
    odirect_5a INTEGER NOT NULL CHECK (odirect_5a BETWEEN 0 AND 1),
    odirect_5b INTEGER NOT NULL CHECK (odirect_5b BETWEEN 0 AND 1),
    odirect_6a INTEGER NOT NULL CHECK (odirect_6a BETWEEN 0 AND 1),
    odirect_6b INTEGER NOT NULL CHECK (odirect_6b BETWEEN 0 AND 1),
    odirect_7a INTEGER NOT NULL CHECK (odirect_7a BETWEEN 0 AND 1),
    odirect_7b INTEGER NOT NULL CHECK (odirect_7b BETWEEN 0 AND 1),
    odirect_8a INTEGER NOT NULL CHECK (odirect_8a BETWEEN 0 AND 1),
    odirect_8b INTEGER NOT NULL CHECK (odirect_8b BETWEEN 0 AND 1),
    
    -- Backward (Ordre Inverse) items - 8 items x 2 trials each
    inverse_1a INTEGER NOT NULL CHECK (inverse_1a BETWEEN 0 AND 1),
    inverse_1b INTEGER NOT NULL CHECK (inverse_1b BETWEEN 0 AND 1),
    inverse_2a INTEGER NOT NULL CHECK (inverse_2a BETWEEN 0 AND 1),
    inverse_2b INTEGER NOT NULL CHECK (inverse_2b BETWEEN 0 AND 1),
    inverse_3a INTEGER NOT NULL CHECK (inverse_3a BETWEEN 0 AND 1),
    inverse_3b INTEGER NOT NULL CHECK (inverse_3b BETWEEN 0 AND 1),
    inverse_4a INTEGER NOT NULL CHECK (inverse_4a BETWEEN 0 AND 1),
    inverse_4b INTEGER NOT NULL CHECK (inverse_4b BETWEEN 0 AND 1),
    inverse_5a INTEGER NOT NULL CHECK (inverse_5a BETWEEN 0 AND 1),
    inverse_5b INTEGER NOT NULL CHECK (inverse_5b BETWEEN 0 AND 1),
    inverse_6a INTEGER NOT NULL CHECK (inverse_6a BETWEEN 0 AND 1),
    inverse_6b INTEGER NOT NULL CHECK (inverse_6b BETWEEN 0 AND 1),
    inverse_7a INTEGER NOT NULL CHECK (inverse_7a BETWEEN 0 AND 1),
    inverse_7b INTEGER NOT NULL CHECK (inverse_7b BETWEEN 0 AND 1),
    inverse_8a INTEGER NOT NULL CHECK (inverse_8a BETWEEN 0 AND 1),
    inverse_8b INTEGER NOT NULL CHECK (inverse_8b BETWEEN 0 AND 1),
    
    -- Computed scores
    mspatiale_odirect_tot INTEGER,    -- Forward raw score
    mspatiale_odirect_std INTEGER,    -- Forward standard score
    mspatiale_odirect_cr DECIMAL(5,2), -- Forward standardized value
    mspatiale_inverse_tot INTEGER,    -- Backward raw score
    mspatiale_inverse_std INTEGER,    -- Backward standard score
    mspatiale_inverse_cr DECIMAL(5,2), -- Backward standardized value
    mspatiale_total_brut INTEGER,     -- Total raw score
    mspatiale_total_std INTEGER,      -- Total standard score
    mspatiale_total_cr DECIMAL(5,2),  -- Total standardized value
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_wais3_mem3_spatial_visit ON responses_wais3_mem3_spatial(visit_id);
CREATE INDEX idx_responses_wais3_mem3_spatial_patient ON responses_wais3_mem3_spatial(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_wais3_mem3_spatial ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own MEM-3 spatial" 
ON responses_wais3_mem3_spatial FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all MEM-3 spatial" 
ON responses_wais3_mem3_spatial FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert MEM-3 spatial" 
ON responses_wais3_mem3_spatial FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update MEM-3 spatial" 
ON responses_wais3_mem3_spatial FOR UPDATE 
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

CREATE TRIGGER update_responses_wais3_mem3_spatial_updated_at
    BEFORE UPDATE ON responses_wais3_mem3_spatial
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

