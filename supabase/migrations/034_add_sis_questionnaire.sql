-- eFondaMental Platform - SIS (Suicide Intent Scale) - Most Recent Attempt
-- Assessment of suicidal intentionality based on circumstances and subject's conception

-- ============================================================================
-- Create SIS Response Table
-- ============================================================================

CREATE TABLE responses_sis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- Section 1: Circumstances of the Act (Circonstances du Geste)
    sis_01 INTEGER CHECK (sis_01 BETWEEN 0 AND 2), -- Isolation
    sis_02 INTEGER CHECK (sis_02 BETWEEN 0 AND 2), -- Timing
    sis_03 INTEGER CHECK (sis_03 BETWEEN 0 AND 2), -- Precautions against discovery
    sis_04 INTEGER CHECK (sis_04 BETWEEN 0 AND 2), -- Seeking help during/after attempt
    sis_05 INTEGER CHECK (sis_05 BETWEEN 0 AND 2), -- Final acts anticipating death
    sis_06 INTEGER CHECK (sis_06 BETWEEN 0 AND 2), -- Active preparation
    sis_07 INTEGER CHECK (sis_07 BETWEEN 0 AND 2), -- Notes or letters
    sis_08 INTEGER CHECK (sis_08 BETWEEN 0 AND 2), -- Clear communication of intent
    
    -- Section 2: Subject's Conception of the Act (Conception du Sujet)
    sis_09 INTEGER CHECK (sis_09 BETWEEN 0 AND 2), -- Alleged purpose
    sis_10 INTEGER CHECK (sis_10 BETWEEN 0 AND 2), -- Opinion on outcome
    sis_11 INTEGER CHECK (sis_11 BETWEEN 0 AND 2), -- Conception of method lethality
    sis_12 INTEGER CHECK (sis_12 BETWEEN 0 AND 2), -- Seriousness of attempt
    sis_13 INTEGER CHECK (sis_13 BETWEEN 0 AND 2), -- Attitude toward living/dying
    sis_14 INTEGER CHECK (sis_14 BETWEEN 0 AND 2), -- Opinion on efficacy of care
    sis_15 INTEGER CHECK (sis_15 BETWEEN 0 AND 2), -- Degree of premeditation
    
    -- Scoring
    total_score INTEGER GENERATED ALWAYS AS (
        COALESCE(sis_01, 0) + COALESCE(sis_02, 0) + COALESCE(sis_03, 0) + 
        COALESCE(sis_04, 0) + COALESCE(sis_05, 0) + COALESCE(sis_06, 0) + 
        COALESCE(sis_07, 0) + COALESCE(sis_08, 0) + COALESCE(sis_09, 0) + 
        COALESCE(sis_10, 0) + COALESCE(sis_11, 0) + COALESCE(sis_12, 0) + 
        COALESCE(sis_13, 0) + COALESCE(sis_14, 0) + COALESCE(sis_15, 0)
    ) STORED,
    circumstances_subscore INTEGER GENERATED ALWAYS AS (
        COALESCE(sis_01, 0) + COALESCE(sis_02, 0) + COALESCE(sis_03, 0) + 
        COALESCE(sis_04, 0) + COALESCE(sis_05, 0) + COALESCE(sis_06, 0) + 
        COALESCE(sis_07, 0) + COALESCE(sis_08, 0)
    ) STORED,
    conception_subscore INTEGER GENERATED ALWAYS AS (
        COALESCE(sis_09, 0) + COALESCE(sis_10, 0) + COALESCE(sis_11, 0) + 
        COALESCE(sis_12, 0) + COALESCE(sis_13, 0) + COALESCE(sis_14, 0) + 
        COALESCE(sis_15, 0)
    ) STORED,

    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Create Indexes
-- ============================================================================

CREATE INDEX idx_responses_sis_visit ON responses_sis(visit_id);
CREATE INDEX idx_responses_sis_patient ON responses_sis(patient_id);
CREATE INDEX idx_responses_sis_completed ON responses_sis(completed_at);
CREATE INDEX idx_responses_sis_total_score ON responses_sis(total_score);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================

ALTER TABLE responses_sis ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================

-- Patient Policies
CREATE POLICY "Patients view own SIS responses"
    ON responses_sis FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own SIS responses"
    ON responses_sis FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own SIS responses"
    ON responses_sis FOR UPDATE
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all SIS responses"
    ON responses_sis FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert SIS responses"
    ON responses_sis FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update SIS responses"
    ON responses_sis FOR UPDATE
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

COMMENT ON TABLE responses_sis IS 'SIS (Suicide Intent Scale) - Beck - Most Recent Attempt';
COMMENT ON COLUMN responses_sis.sis_01 IS 'Isolation (0-2)';
COMMENT ON COLUMN responses_sis.sis_02 IS 'Timing (0-2)';
COMMENT ON COLUMN responses_sis.sis_03 IS 'Precautions against discovery (0-2)';
COMMENT ON COLUMN responses_sis.sis_04 IS 'Seeking help during/after attempt (0-2)';
COMMENT ON COLUMN responses_sis.sis_05 IS 'Final acts anticipating death (0-2)';
COMMENT ON COLUMN responses_sis.sis_06 IS 'Active preparation (0-2)';
COMMENT ON COLUMN responses_sis.sis_07 IS 'Notes or letters (0-2)';
COMMENT ON COLUMN responses_sis.sis_08 IS 'Clear communication of intent (0-2)';
COMMENT ON COLUMN responses_sis.sis_09 IS 'Alleged purpose (0-2)';
COMMENT ON COLUMN responses_sis.sis_10 IS 'Opinion on outcome (0-2)';
COMMENT ON COLUMN responses_sis.sis_11 IS 'Conception of method lethality (0-2)';
COMMENT ON COLUMN responses_sis.sis_12 IS 'Seriousness of attempt (0-2)';
COMMENT ON COLUMN responses_sis.sis_13 IS 'Attitude toward living/dying (0-2)';
COMMENT ON COLUMN responses_sis.sis_14 IS 'Opinion on efficacy of care (0-2)';
COMMENT ON COLUMN responses_sis.sis_15 IS 'Degree of premeditation (0-2)';
COMMENT ON COLUMN responses_sis.total_score IS 'Total SIS score (0-30)';
COMMENT ON COLUMN responses_sis.circumstances_subscore IS 'Circumstances subscore (items 1-8, 0-16)';
COMMENT ON COLUMN responses_sis.conception_subscore IS 'Conception subscore (items 9-15, 0-14)';

