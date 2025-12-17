-- eFondaMental Platform - Histoire des conduites suicidaires (Suicide History)
-- Questionnaire tracking suicide attempt history

-- ============================================================================
-- Create Suicide History Response Table
-- ============================================================================

CREATE TABLE responses_suicide_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- Q1: Date of first suicide attempt
    q1_first_attempt_date DATE,

    -- Q2: Number of suicide attempts
    q2_attempt_count INTEGER CHECK (q2_attempt_count >= 0),

    -- Q3: Violent suicide attempts (firearm, immolation, drowning, jumping, hanging, other)
    q3_violent_attempts VARCHAR(10) CHECK (q3_violent_attempts IN ('yes', 'no', 'unknown')),
    
    -- Q3.1: Number of violent suicide attempts (conditional on Q3=yes)
    q3_1_violent_count INTEGER CHECK (q3_1_violent_count >= 0),

    -- Q4: Serious non-violent suicide attempts (ICU required)
    q4_serious_attempts VARCHAR(10) CHECK (q4_serious_attempts IN ('yes', 'no', 'unknown')),
    
    -- Q4.1: Number of serious non-violent attempts (conditional on Q4=yes)
    q4_1_serious_count INTEGER CHECK (q4_1_serious_count >= 0),

    -- Q5: Non-suicidal self-harm behavior (0=No, 1=Yes)
    q5_self_harm INTEGER CHECK (q5_self_harm IN (0, 1)),

    -- Q6: Interrupted attempt (0=No, 1=Yes)
    q6_interrupted INTEGER CHECK (q6_interrupted IN (0, 1)),
    
    -- Q6.1: Number of interrupted attempts (conditional on Q6=1)
    q6_1_interrupted_count INTEGER CHECK (q6_1_interrupted_count >= 0),

    -- Q7: Aborted attempt (0=No, 1=Yes)
    q7_aborted INTEGER CHECK (q7_aborted IN (0, 1)),
    
    -- Q7.1: Number of aborted attempts (conditional on Q7=1)
    q7_1_aborted_count INTEGER CHECK (q7_1_aborted_count >= 0),

    -- Q8: Preparations for suicide attempt (0=No, 1=Yes)
    q8_preparations INTEGER CHECK (q8_preparations IN (0, 1)),

    -- Q9: Most recent attempt severity (0-5 scale)
    q9_recent_severity INTEGER CHECK (q9_recent_severity BETWEEN 0 AND 5),

    -- Q10: Date of most recent attempt
    q10_recent_date DATE,

    -- Q11: Most lethal attempt severity (0-5 scale)
    q11_lethal_severity INTEGER CHECK (q11_lethal_severity BETWEEN 0 AND 5),

    -- Q12: Date of most lethal attempt
    q12_lethal_date DATE,

    -- Q13: First attempt severity (0-5 scale)
    q13_first_severity INTEGER CHECK (q13_first_severity BETWEEN 0 AND 5),

    -- Q13.1: First attempt lethality (0-2 scale, conditional on Q13=0)
    q13_1_first_lethality INTEGER CHECK (q13_1_first_lethality BETWEEN 0 AND 2),

    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Create Indexes
-- ============================================================================

CREATE INDEX idx_responses_suicide_history_visit ON responses_suicide_history(visit_id);
CREATE INDEX idx_responses_suicide_history_patient ON responses_suicide_history(patient_id);
CREATE INDEX idx_responses_suicide_history_completed ON responses_suicide_history(completed_at);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================

ALTER TABLE responses_suicide_history ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================

-- Patient Policies
CREATE POLICY "Patients view own suicide history responses"
    ON responses_suicide_history FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own suicide history responses"
    ON responses_suicide_history FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own suicide history responses"
    ON responses_suicide_history FOR UPDATE
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all suicide history responses"
    ON responses_suicide_history FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert suicide history responses"
    ON responses_suicide_history FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update suicide history responses"
    ON responses_suicide_history FOR UPDATE
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

COMMENT ON TABLE responses_suicide_history IS 'Histoire des conduites suicidaires - Suicide attempt history questionnaire';
COMMENT ON COLUMN responses_suicide_history.q1_first_attempt_date IS 'Q1: Date of first suicide attempt';
COMMENT ON COLUMN responses_suicide_history.q2_attempt_count IS 'Q2: Total number of suicide attempts';
COMMENT ON COLUMN responses_suicide_history.q3_violent_attempts IS 'Q3: Violent suicide attempts exist (yes/no/unknown)';
COMMENT ON COLUMN responses_suicide_history.q3_1_violent_count IS 'Q3.1: Number of violent suicide attempts';
COMMENT ON COLUMN responses_suicide_history.q4_serious_attempts IS 'Q4: Serious non-violent attempts exist (yes/no/unknown)';
COMMENT ON COLUMN responses_suicide_history.q4_1_serious_count IS 'Q4.1: Number of serious non-violent attempts';
COMMENT ON COLUMN responses_suicide_history.q5_self_harm IS 'Q5: Non-suicidal self-harm behavior (0=No, 1=Yes)';
COMMENT ON COLUMN responses_suicide_history.q6_interrupted IS 'Q6: Interrupted attempt (0=No, 1=Yes)';
COMMENT ON COLUMN responses_suicide_history.q6_1_interrupted_count IS 'Q6.1: Number of interrupted attempts';
COMMENT ON COLUMN responses_suicide_history.q7_aborted IS 'Q7: Aborted attempt (0=No, 1=Yes)';
COMMENT ON COLUMN responses_suicide_history.q7_1_aborted_count IS 'Q7.1: Number of aborted attempts';
COMMENT ON COLUMN responses_suicide_history.q8_preparations IS 'Q8: Preparations for suicide (0=No, 1=Yes)';
COMMENT ON COLUMN responses_suicide_history.q9_recent_severity IS 'Q9: Most recent attempt severity (0-5 scale)';
COMMENT ON COLUMN responses_suicide_history.q10_recent_date IS 'Q10: Date of most recent attempt';
COMMENT ON COLUMN responses_suicide_history.q11_lethal_severity IS 'Q11: Most lethal attempt severity (0-5 scale)';
COMMENT ON COLUMN responses_suicide_history.q12_lethal_date IS 'Q12: Date of most lethal attempt';
COMMENT ON COLUMN responses_suicide_history.q13_first_severity IS 'Q13: First attempt severity (0-5 scale)';
COMMENT ON COLUMN responses_suicide_history.q13_1_first_lethality IS 'Q13.1: First attempt lethality (0-2 scale)';

