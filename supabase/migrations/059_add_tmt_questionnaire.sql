-- ============================================================================
-- eFondaMental Platform - Trail Making Test (TMT) Migration
-- ============================================================================
-- This migration creates the table for Trail Making Test (Reitan, 1955)
-- Part of the Neuropsychological Evaluation module for initial evaluation
-- Evaluates visual attention and task switching
-- ============================================================================

-- Create TMT table
CREATE TABLE responses_tmt (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Demographic data for scoring
    patient_age INTEGER NOT NULL CHECK (patient_age BETWEEN 16 AND 100),
    years_of_education INTEGER NOT NULL CHECK (years_of_education >= 0),
    
    -- Partie A
    tmta_tps INTEGER NOT NULL CHECK (tmta_tps >= 0), -- Time in seconds
    tmta_err INTEGER NOT NULL CHECK (tmta_err >= 0), -- Uncorrected errors
    tmta_cor INTEGER CHECK (tmta_cor IS NULL OR tmta_cor >= 0), -- Corrected errors
    
    -- Partie B
    tmtb_tps INTEGER NOT NULL CHECK (tmtb_tps >= 0), -- Time in seconds
    tmtb_err INTEGER NOT NULL CHECK (tmtb_err >= 0), -- Uncorrected errors
    tmtb_cor INTEGER CHECK (tmtb_cor IS NULL OR tmtb_cor >= 0), -- Corrected errors
    tmtb_err_persev INTEGER NOT NULL CHECK (tmtb_err_persev >= 0), -- Perseverative errors
    
    -- Computed scores - Part A
    tmta_errtot INTEGER, -- Total errors (err + cor)
    tmta_tps_z DECIMAL(5,2), -- Z-score for time
    tmta_tps_pc INTEGER, -- Percentile for time
    tmta_errtot_z DECIMAL(5,2), -- Z-score for errors
    
    -- Computed scores - Part B
    tmtb_errtot INTEGER, -- Total errors (err + cor)
    tmtb_tps_z DECIMAL(5,2), -- Z-score for time
    tmtb_tps_pc INTEGER, -- Percentile for time
    tmtb_errtot_z DECIMAL(5,2), -- Z-score for errors
    tmtb_err_persev_z DECIMAL(5,2), -- Z-score for perseverative errors
    
    -- Computed scores - Difference (B - A)
    tmt_b_a_tps INTEGER, -- Time difference B - A
    tmt_b_a_tps_z DECIMAL(5,2), -- Z-score for time difference
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_tmt_visit ON responses_tmt(visit_id);
CREATE INDEX idx_responses_tmt_patient ON responses_tmt(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_tmt ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own TMT" 
ON responses_tmt FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all TMT" 
ON responses_tmt FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert TMT" 
ON responses_tmt FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update TMT" 
ON responses_tmt FOR UPDATE 
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

CREATE TRIGGER update_responses_tmt_updated_at
    BEFORE UPDATE ON responses_tmt
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

