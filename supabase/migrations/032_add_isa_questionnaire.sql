-- eFondaMental Platform - Intentionnalité Suicidaire Actuelle (ISA)
-- Questionnaire assessing suicidal ideation, wishes, thoughts, plans, and attempts

-- ============================================================================
-- Create ISA Response Table
-- ============================================================================

CREATE TABLE responses_isa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- Question 1: Life not worth living
    q1_life_worth INTEGER CHECK (q1_life_worth IN (0, 1)),
    q1_time VARCHAR(20) CHECK (q1_time IN ('last_week', '2w_12m', 'more_1y')),

    -- Question 2: Wish to die
    q2_wish_death INTEGER CHECK (q2_wish_death IN (0, 1)),
    q2_time VARCHAR(20) CHECK (q2_time IN ('last_week', '2w_12m', 'more_1y')),

    -- Question 3: Thoughts of suicide
    q3_thoughts INTEGER CHECK (q3_thoughts IN (0, 1)),
    q3_time VARCHAR(20) CHECK (q3_time IN ('last_week', '2w_12m', 'more_1y')),

    -- Question 4: Plan/serious consideration
    q4_plan INTEGER CHECK (q4_plan IN (0, 1)),
    q4_time VARCHAR(20) CHECK (q4_time IN ('last_week', '2w_12m', 'more_1y')),

    -- Question 5: Attempt
    q5_attempt INTEGER CHECK (q5_attempt IN (0, 1)),
    q5_time VARCHAR(20) CHECK (q5_time IN ('last_week', '2w_12m', 'more_1y')),

    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Create Indexes
-- ============================================================================

CREATE INDEX idx_responses_isa_visit ON responses_isa(visit_id);
CREATE INDEX idx_responses_isa_patient ON responses_isa(patient_id);
CREATE INDEX idx_responses_isa_completed ON responses_isa(completed_at);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================

ALTER TABLE responses_isa ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================

-- Patient Policies
CREATE POLICY "Patients view own ISA responses"
    ON responses_isa FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own ISA responses"
    ON responses_isa FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own ISA responses"
    ON responses_isa FOR UPDATE
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all ISA responses"
    ON responses_isa FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert ISA responses"
    ON responses_isa FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update ISA responses"
    ON responses_isa FOR UPDATE
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

COMMENT ON TABLE responses_isa IS 'Intentionnalité Suicidaire Actuelle questionnaire responses';
COMMENT ON COLUMN responses_isa.q1_life_worth IS 'Life not worth living (0=No, 1=Yes)';
COMMENT ON COLUMN responses_isa.q1_time IS 'Timing of Q1 (last_week, 2w_12m, more_1y)';
COMMENT ON COLUMN responses_isa.q2_wish_death IS 'Wish to die (0=No, 1=Yes)';
COMMENT ON COLUMN responses_isa.q2_time IS 'Timing of Q2 (last_week, 2w_12m, more_1y)';
COMMENT ON COLUMN responses_isa.q3_thoughts IS 'Thoughts of suicide (0=No, 1=Yes)';
COMMENT ON COLUMN responses_isa.q3_time IS 'Timing of Q3 (last_week, 2w_12m, more_1y)';
COMMENT ON COLUMN responses_isa.q4_plan IS 'Plan or serious consideration (0=No, 1=Yes)';
COMMENT ON COLUMN responses_isa.q4_time IS 'Timing of Q4 (last_week, 2w_12m, more_1y)';
COMMENT ON COLUMN responses_isa.q5_attempt IS 'Suicide attempt (0=No, 1=Yes)';
COMMENT ON COLUMN responses_isa.q5_time IS 'Timing of Q5 (last_week, 2w_12m, more_1y)';

