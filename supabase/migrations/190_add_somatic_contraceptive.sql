-- eFondaMental Platform - Somatic and Contraceptive Treatments
-- Stores somatic and contraceptive medication entries per patient

-- ============================================================================
-- Create Somatic Contraceptive Table
-- ============================================================================

CREATE TABLE treatment_somatic_contraceptive (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Treatment details
    medication_name TEXT NOT NULL,
    start_date DATE,
    months_exposure INTEGER CHECK (months_exposure >= 0),
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES user_profiles(id)
);

-- ============================================================================
-- Create Indexes
-- ============================================================================

CREATE INDEX idx_treatment_somatic_contraceptive_patient ON treatment_somatic_contraceptive(patient_id);
CREATE INDEX idx_treatment_somatic_contraceptive_created ON treatment_somatic_contraceptive(created_at);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================

ALTER TABLE treatment_somatic_contraceptive ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================

-- Patient Policies
CREATE POLICY "Patients view own somatic contraceptive"
    ON treatment_somatic_contraceptive FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own somatic contraceptive"
    ON treatment_somatic_contraceptive FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own somatic contraceptive"
    ON treatment_somatic_contraceptive FOR UPDATE
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients delete own somatic contraceptive"
    ON treatment_somatic_contraceptive FOR DELETE
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all somatic contraceptive"
    ON treatment_somatic_contraceptive FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert somatic contraceptive"
    ON treatment_somatic_contraceptive FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update somatic contraceptive"
    ON treatment_somatic_contraceptive FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals delete somatic contraceptive"
    ON treatment_somatic_contraceptive FOR DELETE
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

COMMENT ON TABLE treatment_somatic_contraceptive IS 'Somatic and contraceptive treatments - Lifetime treatment entries';
COMMENT ON COLUMN treatment_somatic_contraceptive.medication_name IS 'Name of the somatic or contraceptive medication';
COMMENT ON COLUMN treatment_somatic_contraceptive.start_date IS 'Date when treatment started';
COMMENT ON COLUMN treatment_somatic_contraceptive.months_exposure IS 'Cumulative months of exposure to this treatment';

