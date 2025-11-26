-- ============================================================================
-- eFondaMental Platform - WAIS-IV Digit Span Subtest Migration
-- ============================================================================
-- This migration creates the table for WAIS-IV Memoire des chiffres (Digit Span)
-- Part of the Neuropsychological Evaluation module for initial evaluation
-- Evaluates auditory working memory through 3 tasks: forward, backward, sequencing
-- ============================================================================

-- Create WAIS-IV Digit Span table
CREATE TABLE responses_wais4_digit_span (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Demographic data for scoring
    patient_age INTEGER NOT NULL CHECK (patient_age BETWEEN 16 AND 90),
    
    -- Ordre Direct (Forward) - 8 items x 2 trials each
    mcod_1a INTEGER NOT NULL CHECK (mcod_1a IN (0, 1)),
    mcod_1b INTEGER NOT NULL CHECK (mcod_1b IN (0, 1)),
    mcod_2a INTEGER CHECK (mcod_2a IS NULL OR mcod_2a IN (0, 1)),
    mcod_2b INTEGER CHECK (mcod_2b IS NULL OR mcod_2b IN (0, 1)),
    mcod_3a INTEGER CHECK (mcod_3a IS NULL OR mcod_3a IN (0, 1)),
    mcod_3b INTEGER CHECK (mcod_3b IS NULL OR mcod_3b IN (0, 1)),
    mcod_4a INTEGER CHECK (mcod_4a IS NULL OR mcod_4a IN (0, 1)),
    mcod_4b INTEGER CHECK (mcod_4b IS NULL OR mcod_4b IN (0, 1)),
    mcod_5a INTEGER CHECK (mcod_5a IS NULL OR mcod_5a IN (0, 1)),
    mcod_5b INTEGER CHECK (mcod_5b IS NULL OR mcod_5b IN (0, 1)),
    mcod_6a INTEGER CHECK (mcod_6a IS NULL OR mcod_6a IN (0, 1)),
    mcod_6b INTEGER CHECK (mcod_6b IS NULL OR mcod_6b IN (0, 1)),
    mcod_7a INTEGER CHECK (mcod_7a IS NULL OR mcod_7a IN (0, 1)),
    mcod_7b INTEGER CHECK (mcod_7b IS NULL OR mcod_7b IN (0, 1)),
    mcod_8a INTEGER CHECK (mcod_8a IS NULL OR mcod_8a IN (0, 1)),
    mcod_8b INTEGER CHECK (mcod_8b IS NULL OR mcod_8b IN (0, 1)),
    
    -- Ordre Inverse (Backward) - 8 items x 2 trials each
    mcoi_1a INTEGER NOT NULL CHECK (mcoi_1a IN (0, 1)),
    mcoi_1b INTEGER NOT NULL CHECK (mcoi_1b IN (0, 1)),
    mcoi_2a INTEGER CHECK (mcoi_2a IS NULL OR mcoi_2a IN (0, 1)),
    mcoi_2b INTEGER CHECK (mcoi_2b IS NULL OR mcoi_2b IN (0, 1)),
    mcoi_3a INTEGER CHECK (mcoi_3a IS NULL OR mcoi_3a IN (0, 1)),
    mcoi_3b INTEGER CHECK (mcoi_3b IS NULL OR mcoi_3b IN (0, 1)),
    mcoi_4a INTEGER CHECK (mcoi_4a IS NULL OR mcoi_4a IN (0, 1)),
    mcoi_4b INTEGER CHECK (mcoi_4b IS NULL OR mcoi_4b IN (0, 1)),
    mcoi_5a INTEGER CHECK (mcoi_5a IS NULL OR mcoi_5a IN (0, 1)),
    mcoi_5b INTEGER CHECK (mcoi_5b IS NULL OR mcoi_5b IN (0, 1)),
    mcoi_6a INTEGER CHECK (mcoi_6a IS NULL OR mcoi_6a IN (0, 1)),
    mcoi_6b INTEGER CHECK (mcoi_6b IS NULL OR mcoi_6b IN (0, 1)),
    mcoi_7a INTEGER CHECK (mcoi_7a IS NULL OR mcoi_7a IN (0, 1)),
    mcoi_7b INTEGER CHECK (mcoi_7b IS NULL OR mcoi_7b IN (0, 1)),
    mcoi_8a INTEGER CHECK (mcoi_8a IS NULL OR mcoi_8a IN (0, 1)),
    mcoi_8b INTEGER CHECK (mcoi_8b IS NULL OR mcoi_8b IN (0, 1)),
    
    -- Ordre Croissant (Sequencing) - 8 items x 2 trials each
    mcoc_1a INTEGER NOT NULL CHECK (mcoc_1a IN (0, 1)),
    mcoc_1b INTEGER NOT NULL CHECK (mcoc_1b IN (0, 1)),
    mcoc_2a INTEGER CHECK (mcoc_2a IS NULL OR mcoc_2a IN (0, 1)),
    mcoc_2b INTEGER CHECK (mcoc_2b IS NULL OR mcoc_2b IN (0, 1)),
    mcoc_3a INTEGER CHECK (mcoc_3a IS NULL OR mcoc_3a IN (0, 1)),
    mcoc_3b INTEGER CHECK (mcoc_3b IS NULL OR mcoc_3b IN (0, 1)),
    mcoc_4a INTEGER CHECK (mcoc_4a IS NULL OR mcoc_4a IN (0, 1)),
    mcoc_4b INTEGER CHECK (mcoc_4b IS NULL OR mcoc_4b IN (0, 1)),
    mcoc_5a INTEGER CHECK (mcoc_5a IS NULL OR mcoc_5a IN (0, 1)),
    mcoc_5b INTEGER CHECK (mcoc_5b IS NULL OR mcoc_5b IN (0, 1)),
    mcoc_6a INTEGER CHECK (mcoc_6a IS NULL OR mcoc_6a IN (0, 1)),
    mcoc_6b INTEGER CHECK (mcoc_6b IS NULL OR mcoc_6b IN (0, 1)),
    mcoc_7a INTEGER CHECK (mcoc_7a IS NULL OR mcoc_7a IN (0, 1)),
    mcoc_7b INTEGER CHECK (mcoc_7b IS NULL OR mcoc_7b IN (0, 1)),
    mcoc_8a INTEGER CHECK (mcoc_8a IS NULL OR mcoc_8a IN (0, 1)),
    mcoc_8b INTEGER CHECK (mcoc_8b IS NULL OR mcoc_8b IN (0, 1)),
    
    -- Computed Scores - totals for each section
    mcod_total INTEGER, -- Score total Ordre Direct (0-16)
    mcoi_total INTEGER, -- Score total Ordre Inverse (0-16)
    mcoc_total INTEGER, -- Score total Ordre Croissant (0-16)
    
    -- Total raw score
    raw_score INTEGER, -- Note Brute Totale (0-48)
    
    -- Standardized score (based on age-specific norms)
    standardized_score INTEGER, -- Note Standard (1-19)
    
    -- Process scores (empan = longest span achieved)
    empan_direct INTEGER, -- Empan Direct (Max items passed)
    empan_inverse INTEGER, -- Empan Inverse (Max items passed)
    empan_croissant INTEGER, -- Empan Croissant (Max items passed)
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_wais4_digit_span_visit ON responses_wais4_digit_span(visit_id);
CREATE INDEX idx_responses_wais4_digit_span_patient ON responses_wais4_digit_span(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_wais4_digit_span ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own WAIS-4 digit span" 
ON responses_wais4_digit_span FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all WAIS-4 digit span" 
ON responses_wais4_digit_span FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert WAIS-4 digit span" 
ON responses_wais4_digit_span FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update WAIS-4 digit span" 
ON responses_wais4_digit_span FOR UPDATE 
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

CREATE TRIGGER update_responses_wais4_digit_span_updated_at
    BEFORE UPDATE ON responses_wais4_digit_span
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

