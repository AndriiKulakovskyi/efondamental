-- eFondaMental Platform - Histoire des Conduites Suicidaires (C-SSRS Supplement)
-- Detailed suicide attempt history including violence, medical severity, and behaviors

-- ============================================================================
-- Create C-SSRS History Response Table
-- ============================================================================

CREATE TABLE responses_cssrs_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- Historical Overview
    ts_first_date TEXT, -- Date of first suicide attempt
    ts_total_count INTEGER CHECK (ts_total_count >= 0), -- Total number of attempts
    
    -- Violent Attempts
    ts_violent_presence INTEGER CHECK (ts_violent_presence IN (0, 1, 99)), -- 0=No, 1=Yes, 99=Don't know
    ts_violent_count INTEGER CHECK (ts_violent_count >= 0), -- Number of violent attempts
    
    -- Serious Non-Violent Attempts
    ts_serious_presence INTEGER CHECK (ts_serious_presence IN (0, 1, 99)), -- 0=No, 1=Yes, 99=Don't know
    ts_serious_count INTEGER CHECK (ts_serious_count >= 0), -- Number of serious attempts
    
    -- Interrupted Attempts
    ts_interrupted_presence INTEGER CHECK (ts_interrupted_presence IN (0, 1)), -- 0=No, 1=Yes
    ts_interrupted_count INTEGER CHECK (ts_interrupted_count >= 0),
    
    -- Aborted Attempts
    ts_aborted_presence INTEGER CHECK (ts_aborted_presence IN (0, 1)), -- 0=No, 1=Yes
    ts_aborted_count INTEGER CHECK (ts_aborted_count >= 0),
    
    -- Preparations
    ts_preparations INTEGER CHECK (ts_preparations IN (0, 1)), -- 0=No, 1=Yes
    
    -- Lethality - Most Recent Attempt
    lethality_recent INTEGER CHECK (lethality_recent BETWEEN 0 AND 5), -- 0-5 scale
    date_recent TEXT,
    
    -- Lethality - Most Lethal Attempt
    lethality_most_lethal INTEGER CHECK (lethality_most_lethal BETWEEN 0 AND 5), -- 0-5 scale
    date_most_lethal TEXT,
    
    -- Lethality - First Attempt
    lethality_first INTEGER CHECK (lethality_first BETWEEN 0 AND 5), -- 0-5 scale
    date_first_confirm TEXT,
    
    -- Potential Lethality
    potential_lethality TEXT,

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

COMMENT ON TABLE responses_cssrs_history IS 'Histoire des Conduites Suicidaires (C-SSRS Supplement) questionnaire responses';
COMMENT ON COLUMN responses_cssrs_history.ts_first_date IS 'Date of first suicide attempt';
COMMENT ON COLUMN responses_cssrs_history.ts_total_count IS 'Total number of suicide attempts';
COMMENT ON COLUMN responses_cssrs_history.ts_violent_presence IS 'Presence of violent attempts (0=No, 1=Yes, 99=Unknown)';
COMMENT ON COLUMN responses_cssrs_history.ts_violent_count IS 'Number of violent attempts';
COMMENT ON COLUMN responses_cssrs_history.ts_serious_presence IS 'Presence of serious non-violent attempts (0=No, 1=Yes, 99=Unknown)';
COMMENT ON COLUMN responses_cssrs_history.ts_serious_count IS 'Number of serious attempts requiring intensive care';
COMMENT ON COLUMN responses_cssrs_history.ts_interrupted_presence IS 'Presence of interrupted attempts (0=No, 1=Yes)';
COMMENT ON COLUMN responses_cssrs_history.ts_interrupted_count IS 'Number of interrupted attempts';
COMMENT ON COLUMN responses_cssrs_history.ts_aborted_presence IS 'Presence of aborted attempts (0=No, 1=Yes)';
COMMENT ON COLUMN responses_cssrs_history.ts_aborted_count IS 'Number of aborted attempts';
COMMENT ON COLUMN responses_cssrs_history.ts_preparations IS 'Preparation actions taken (0=No, 1=Yes)';
COMMENT ON COLUMN responses_cssrs_history.lethality_recent IS 'Lethality of most recent attempt (0-5)';
COMMENT ON COLUMN responses_cssrs_history.date_recent IS 'Date of most recent attempt';
COMMENT ON COLUMN responses_cssrs_history.lethality_most_lethal IS 'Lethality of most lethal attempt (0-5)';
COMMENT ON COLUMN responses_cssrs_history.date_most_lethal IS 'Date of most lethal attempt';
COMMENT ON COLUMN responses_cssrs_history.lethality_first IS 'Lethality of first attempt (0-5)';
COMMENT ON COLUMN responses_cssrs_history.date_first_confirm IS 'Date of first attempt (confirmation)';
COMMENT ON COLUMN responses_cssrs_history.potential_lethality IS 'Potential lethality if no medical injury observed';

