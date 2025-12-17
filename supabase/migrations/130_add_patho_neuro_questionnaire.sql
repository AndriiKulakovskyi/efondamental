-- eFondaMental Platform - Pathologies neurologiques (Neurological Conditions)
-- Questionnaire tracking neurological conditions history

-- ============================================================================
-- Create Pathologies Neurologiques Response Table
-- ============================================================================

CREATE TABLE responses_patho_neuro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- 1. Migraine
    q1_migraine VARCHAR(10) CHECK (q1_migraine IN ('yes', 'no', 'unknown')),
    q1_1_migraine_date DATE,
    q1_2_migraine_treated VARCHAR(3) CHECK (q1_2_migraine_treated IN ('yes', 'no')),
    q1_3_migraine_balanced VARCHAR(3) CHECK (q1_3_migraine_balanced IN ('yes', 'no')),

    -- 2. Sclérose en plaques (Multiple Sclerosis)
    q2_sclerose VARCHAR(10) CHECK (q2_sclerose IN ('yes', 'no', 'unknown')),
    q2_1_sclerose_date DATE,
    q2_2_sclerose_treated VARCHAR(3) CHECK (q2_2_sclerose_treated IN ('yes', 'no')),
    q2_3_sclerose_balanced VARCHAR(3) CHECK (q2_3_sclerose_balanced IN ('yes', 'no')),

    -- 3. Épilepsie (Epilepsy)
    q3_epilepsie VARCHAR(10) CHECK (q3_epilepsie IN ('yes', 'no', 'unknown')),
    q3_1_epilepsie_date DATE,
    q3_2_epilepsie_treated VARCHAR(3) CHECK (q3_2_epilepsie_treated IN ('yes', 'no')),
    q3_3_epilepsie_balanced VARCHAR(3) CHECK (q3_3_epilepsie_balanced IN ('yes', 'no')),

    -- 4. Méningite (Meningitis)
    q4_meningite VARCHAR(10) CHECK (q4_meningite IN ('yes', 'no', 'unknown')),
    q4_1_meningite_date DATE,

    -- 5. Traumatisme crânien (Head Trauma)
    q5_trauma_cranien VARCHAR(10) CHECK (q5_trauma_cranien IN ('yes', 'no', 'unknown')),
    q5_1_trauma_cranien_date DATE,

    -- 6. Accident Vasculaire Cérébral (Stroke)
    q6_avc VARCHAR(10) CHECK (q6_avc IN ('yes', 'no', 'unknown')),
    q6_1_avc_date DATE,

    -- 7. Autre maladie neurologique (Other neurological condition)
    q7_autre VARCHAR(10) CHECK (q7_autre IN ('yes', 'no', 'unknown')),
    q7_1_autre_date DATE,
    q7_2_autre_specify TEXT,

    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Create Indexes
-- ============================================================================

CREATE INDEX idx_responses_patho_neuro_visit ON responses_patho_neuro(visit_id);
CREATE INDEX idx_responses_patho_neuro_patient ON responses_patho_neuro(patient_id);
CREATE INDEX idx_responses_patho_neuro_completed ON responses_patho_neuro(completed_at);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================

ALTER TABLE responses_patho_neuro ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================

-- Patient Policies
CREATE POLICY "Patients view own patho_neuro responses"
    ON responses_patho_neuro FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own patho_neuro responses"
    ON responses_patho_neuro FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own patho_neuro responses"
    ON responses_patho_neuro FOR UPDATE
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all patho_neuro responses"
    ON responses_patho_neuro FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert patho_neuro responses"
    ON responses_patho_neuro FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update patho_neuro responses"
    ON responses_patho_neuro FOR UPDATE
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

COMMENT ON TABLE responses_patho_neuro IS 'Pathologies neurologiques - Neurological conditions questionnaire';
COMMENT ON COLUMN responses_patho_neuro.q1_migraine IS 'Migraine presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_neuro.q1_1_migraine_date IS 'Migraine onset date';
COMMENT ON COLUMN responses_patho_neuro.q1_2_migraine_treated IS 'Migraine treated (yes/no)';
COMMENT ON COLUMN responses_patho_neuro.q1_3_migraine_balanced IS 'Migraine balanced (yes/no)';
COMMENT ON COLUMN responses_patho_neuro.q2_sclerose IS 'Multiple sclerosis presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_neuro.q2_1_sclerose_date IS 'Multiple sclerosis onset date';
COMMENT ON COLUMN responses_patho_neuro.q2_2_sclerose_treated IS 'Multiple sclerosis treated (yes/no)';
COMMENT ON COLUMN responses_patho_neuro.q2_3_sclerose_balanced IS 'Multiple sclerosis balanced (yes/no)';
COMMENT ON COLUMN responses_patho_neuro.q3_epilepsie IS 'Epilepsy presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_neuro.q3_1_epilepsie_date IS 'Epilepsy onset date';
COMMENT ON COLUMN responses_patho_neuro.q3_2_epilepsie_treated IS 'Epilepsy treated (yes/no)';
COMMENT ON COLUMN responses_patho_neuro.q3_3_epilepsie_balanced IS 'Epilepsy balanced (yes/no)';
COMMENT ON COLUMN responses_patho_neuro.q4_meningite IS 'Meningitis presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_neuro.q4_1_meningite_date IS 'Meningitis occurrence date';
COMMENT ON COLUMN responses_patho_neuro.q5_trauma_cranien IS 'Head trauma presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_neuro.q5_1_trauma_cranien_date IS 'Head trauma occurrence date';
COMMENT ON COLUMN responses_patho_neuro.q6_avc IS 'Stroke presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_neuro.q6_1_avc_date IS 'Stroke occurrence date';
COMMENT ON COLUMN responses_patho_neuro.q7_autre IS 'Other neurological condition presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_neuro.q7_1_autre_date IS 'Other condition occurrence date';
COMMENT ON COLUMN responses_patho_neuro.q7_2_autre_specify IS 'Other condition specification';

