-- eFondaMental Platform - Rework C-SSRS History: Suicidal Ideation & Intensity
-- Complete replacement focusing on ideation assessment rather than past attempt history
-- This migration drops and recreates the responses_cssrs_history table with new structure

-- ============================================================================
-- Drop Existing Table and Policies
-- ============================================================================

DROP TABLE IF EXISTS responses_cssrs_history CASCADE;

-- ============================================================================
-- Create New C-SSRS History (Ideation) Response Table
-- ============================================================================

CREATE TABLE responses_cssrs_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- Section 1: Suicidal Ideation (Idéation suicidaire)
    -- Q1 & Q2 always shown; Q3-Q5 conditional on Q2=1 (Oui)
    s1_q1_wish_death INTEGER CHECK (s1_q1_wish_death IN (0, 1)), -- 0=Non, 1=Oui
    s1_q2_suicidal_thoughts INTEGER CHECK (s1_q2_suicidal_thoughts IN (0, 1)), -- 0=Non, 1=Oui
    s1_q3_methods INTEGER CHECK (s1_q3_methods IN (0, 1)), -- 0=Non, 1=Oui (shown if Q2=1)
    s1_q4_intention INTEGER CHECK (s1_q4_intention IN (0, 1)), -- 0=Non, 1=Oui (shown if Q2=1)
    s1_q5_detailed_scenario INTEGER CHECK (s1_q5_detailed_scenario IN (0, 1)), -- 0=Non, 1=Oui (shown if Q2=1)
    
    -- Section 2: Intensity of Ideation (INTENSITE DE L'IDEATION)
    s2_q1_ideation_severity INTEGER CHECK (s2_q1_ideation_severity BETWEEN 1 AND 5), -- Severity type 1-5
    s2_q2_frequency INTEGER CHECK (s2_q2_frequency BETWEEN 1 AND 5), -- 1-5 scale
    s2_q3_duration INTEGER CHECK (s2_q3_duration BETWEEN 1 AND 5), -- 1-5 scale
    s2_q4_control INTEGER CHECK (s2_q4_control BETWEEN 0 AND 5), -- 0-5 scale (0=Does not try)
    s2_q5_causes INTEGER CHECK (s2_q5_causes BETWEEN 0 AND 5), -- 0-5 scale (0=N/A)

    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Create Indexes
-- ============================================================================

CREATE INDEX idx_responses_cssrs_history_visit ON responses_cssrs_history(visit_id);
CREATE INDEX idx_responses_cssrs_history_patient ON responses_cssrs_history(patient_id);
CREATE INDEX idx_responses_cssrs_history_completed ON responses_cssrs_history(completed_at);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================

ALTER TABLE responses_cssrs_history ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================

-- Patient Policies
CREATE POLICY "Patients view own C-SSRS History responses"
    ON responses_cssrs_history FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own C-SSRS History responses"
    ON responses_cssrs_history FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own C-SSRS History responses"
    ON responses_cssrs_history FOR UPDATE
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all C-SSRS History responses"
    ON responses_cssrs_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert C-SSRS History responses"
    ON responses_cssrs_history FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update C-SSRS History responses"
    ON responses_cssrs_history FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- ============================================================================
-- Add Comments
-- ============================================================================

COMMENT ON TABLE responses_cssrs_history IS 'Histoire des Conduites Suicidaires (C-SSRS Supplement) - Suicidal Ideation and Intensity Assessment';

-- Section 1 Comments
COMMENT ON COLUMN responses_cssrs_history.s1_q1_wish_death IS 'Q1: Desire to be dead (0=No, 1=Yes)';
COMMENT ON COLUMN responses_cssrs_history.s1_q2_suicidal_thoughts IS 'Q2: Active suicidal thoughts (0=No, 1=Yes)';
COMMENT ON COLUMN responses_cssrs_history.s1_q3_methods IS 'Q3: Methods considered (0=No, 1=Yes) - shown if Q2=Yes';
COMMENT ON COLUMN responses_cssrs_history.s1_q4_intention IS 'Q4: Intention to act (0=No, 1=Yes) - shown if Q2=Yes';
COMMENT ON COLUMN responses_cssrs_history.s1_q5_detailed_scenario IS 'Q5: Detailed scenario with intention (0=No, 1=Yes) - shown if Q2=Yes';

-- Section 2 Comments
COMMENT ON COLUMN responses_cssrs_history.s2_q1_ideation_severity IS 'Q1: Type of most severe ideation (1-5 scale)';
COMMENT ON COLUMN responses_cssrs_history.s2_q2_frequency IS 'Q2: Frequency of thoughts (1-5 scale)';
COMMENT ON COLUMN responses_cssrs_history.s2_q3_duration IS 'Q3: Duration of thoughts (1-5 scale)';
COMMENT ON COLUMN responses_cssrs_history.s2_q4_control IS 'Q4: Control over thoughts (0-5 scale, 0=Does not try)';
COMMENT ON COLUMN responses_cssrs_history.s2_q5_causes IS 'Q5: Causes of ideation (0-5 scale, 0=N/A)';

