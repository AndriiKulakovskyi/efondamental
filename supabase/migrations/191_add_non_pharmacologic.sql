-- eFondaMental Platform - Non-Pharmacological Treatments
-- Stores non-drug therapy questionnaire responses

-- ============================================================================
-- Create Non-Pharmacologic Response Table
-- ============================================================================

CREATE TABLE responses_non_pharmacologic (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Global screening question
    global_screening VARCHAR(15) CHECK (global_screening IN ('yes', 'no', 'unknown')),
    
    -- Treatment 1: Sismotherapie (ECT)
    sismotherapie_status VARCHAR(15) CHECK (sismotherapie_status IN ('yes', 'no', 'unknown')),
    sismotherapie_sessions INTEGER CHECK (sismotherapie_sessions >= 0),
    sismotherapie_start_date DATE,
    sismotherapie_end_date DATE,
    
    -- Treatment 2: TMS (Transcranial Magnetic Stimulation)
    tms_status VARCHAR(15) CHECK (tms_status IN ('yes', 'no', 'unknown')),
    tms_sessions INTEGER CHECK (tms_sessions >= 0),
    tms_start_date DATE,
    tms_end_date DATE,
    
    -- Treatment 3: TCC (Cognitive Behavioral Therapy)
    tcc_status VARCHAR(15) CHECK (tcc_status IN ('yes', 'no', 'unknown')),
    tcc_sessions INTEGER CHECK (tcc_sessions >= 0),
    tcc_start_date DATE,
    tcc_end_date DATE,
    
    -- Treatment 4: Groupes de psychoeducation
    psychoeducation_status VARCHAR(15) CHECK (psychoeducation_status IN ('yes', 'no', 'unknown')),
    psychoeducation_sessions INTEGER CHECK (psychoeducation_sessions >= 0),
    psychoeducation_start_date DATE,
    psychoeducation_end_date DATE,
    
    -- Treatment 5: IPSRT (Interpersonal and Social Rhythm Therapy)
    ipsrt_status VARCHAR(15) CHECK (ipsrt_status IN ('yes', 'no', 'unknown')),
    ipsrt_sessions INTEGER CHECK (ipsrt_sessions >= 0),
    ipsrt_start_date DATE,
    ipsrt_end_date DATE,
    ipsrt_group BOOLEAN DEFAULT false,
    ipsrt_individual BOOLEAN DEFAULT false,
    ipsrt_unknown_format BOOLEAN DEFAULT false,
    
    -- Treatment 6: Autre (Other)
    autre_status VARCHAR(15) CHECK (autre_status IN ('yes', 'no', 'unknown')),
    autre_specify TEXT,
    autre_sessions INTEGER CHECK (autre_sessions >= 0),
    autre_start_date DATE,
    autre_end_date DATE,
    
    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Create Indexes
-- ============================================================================

CREATE INDEX idx_responses_non_pharmacologic_patient ON responses_non_pharmacologic(patient_id);
CREATE INDEX idx_responses_non_pharmacologic_completed ON responses_non_pharmacologic(completed_at);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================

ALTER TABLE responses_non_pharmacologic ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================

-- Patient Policies
CREATE POLICY "Patients view own non pharmacologic"
    ON responses_non_pharmacologic FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own non pharmacologic"
    ON responses_non_pharmacologic FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own non pharmacologic"
    ON responses_non_pharmacologic FOR UPDATE
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all non pharmacologic"
    ON responses_non_pharmacologic FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert non pharmacologic"
    ON responses_non_pharmacologic FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update non pharmacologic"
    ON responses_non_pharmacologic FOR UPDATE
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

COMMENT ON TABLE responses_non_pharmacologic IS 'Traitements non pharmacologiques - Non-drug therapy questionnaire';
COMMENT ON COLUMN responses_non_pharmacologic.global_screening IS 'Global screening: Have you received non-pharmacological treatment since last visit?';
COMMENT ON COLUMN responses_non_pharmacologic.sismotherapie_status IS 'ECT treatment status (yes/no/unknown)';
COMMENT ON COLUMN responses_non_pharmacologic.sismotherapie_sessions IS 'Number of ECT sessions';
COMMENT ON COLUMN responses_non_pharmacologic.tms_status IS 'TMS treatment status (yes/no/unknown)';
COMMENT ON COLUMN responses_non_pharmacologic.tms_sessions IS 'Number of TMS sessions';
COMMENT ON COLUMN responses_non_pharmacologic.tcc_status IS 'CBT treatment status (yes/no/unknown)';
COMMENT ON COLUMN responses_non_pharmacologic.tcc_sessions IS 'Number of CBT sessions';
COMMENT ON COLUMN responses_non_pharmacologic.psychoeducation_status IS 'Psychoeducation groups status (yes/no/unknown)';
COMMENT ON COLUMN responses_non_pharmacologic.psychoeducation_sessions IS 'Number of psychoeducation sessions';
COMMENT ON COLUMN responses_non_pharmacologic.ipsrt_status IS 'IPSRT treatment status (yes/no/unknown)';
COMMENT ON COLUMN responses_non_pharmacologic.ipsrt_sessions IS 'Number of IPSRT sessions';
COMMENT ON COLUMN responses_non_pharmacologic.ipsrt_group IS 'IPSRT delivered in group format';
COMMENT ON COLUMN responses_non_pharmacologic.ipsrt_individual IS 'IPSRT delivered individually';
COMMENT ON COLUMN responses_non_pharmacologic.ipsrt_unknown_format IS 'IPSRT format unknown';
COMMENT ON COLUMN responses_non_pharmacologic.autre_status IS 'Other non-pharmacological treatment status (yes/no/unknown)';
COMMENT ON COLUMN responses_non_pharmacologic.autre_specify IS 'Specification of other treatment type';
COMMENT ON COLUMN responses_non_pharmacologic.autre_sessions IS 'Number of sessions for other treatment';

