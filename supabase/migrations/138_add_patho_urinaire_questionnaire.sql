-- ============================================================================
-- eFondaMental Platform - Pathologies des voies urinaires (Urinary Tract Conditions)
-- Questionnaire tracking urinary tract conditions history
-- ============================================================================

-- ============================================================================
-- Create Pathologies des voies urinaires Response Table
-- ============================================================================

CREATE TABLE responses_patho_urinaire (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- 1. Néphropathie (Nephropathy)
    q1_nephropathy VARCHAR(10) CHECK (q1_nephropathy IN ('yes', 'no', 'unknown')),
    q1_1_nephropathy_date DATE,
    q1_2_nephropathy_treated VARCHAR(3) CHECK (q1_2_nephropathy_treated IN ('yes', 'no')),
    q1_3_nephropathy_balanced VARCHAR(3) CHECK (q1_3_nephropathy_balanced IN ('yes', 'no')),
    q1_4_nephropathy_lithium_link VARCHAR(10) CHECK (q1_4_nephropathy_lithium_link IN ('yes', 'no', 'unknown')),

    -- 2. Adénome prostatique (Prostatic adenoma)
    q2_prostatic_adenoma VARCHAR(10) CHECK (q2_prostatic_adenoma IN ('yes', 'no', 'unknown')),
    q2_1_prostatic_adenoma_date DATE,
    q2_2_prostatic_adenoma_treated VARCHAR(3) CHECK (q2_2_prostatic_adenoma_treated IN ('yes', 'no')),
    q2_3_prostatic_adenoma_balanced VARCHAR(3) CHECK (q2_3_prostatic_adenoma_balanced IN ('yes', 'no')),

    -- 3. Rétention aiguë d'urine (Acute urinary retention)
    q3_urinary_retention VARCHAR(10) CHECK (q3_urinary_retention IN ('yes', 'no', 'unknown')),
    q3_1_urinary_retention_date DATE,
    q3_2_urinary_retention_treatment_triggered VARCHAR(3) CHECK (q3_2_urinary_retention_treatment_triggered IN ('yes', 'no')),
    q3_3_urinary_retention_treatment_type JSONB,

    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Create Indexes
-- ============================================================================

CREATE INDEX idx_responses_patho_urinaire_visit ON responses_patho_urinaire(visit_id);
CREATE INDEX idx_responses_patho_urinaire_patient ON responses_patho_urinaire(patient_id);
CREATE INDEX idx_responses_patho_urinaire_completed ON responses_patho_urinaire(completed_at);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================

ALTER TABLE responses_patho_urinaire ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================

-- Patient Policies
CREATE POLICY "Patients view own patho_urinaire responses"
    ON responses_patho_urinaire FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own patho_urinaire responses"
    ON responses_patho_urinaire FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own patho_urinaire responses"
    ON responses_patho_urinaire FOR UPDATE
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all patho_urinaire responses"
    ON responses_patho_urinaire FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert patho_urinaire responses"
    ON responses_patho_urinaire FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update patho_urinaire responses"
    ON responses_patho_urinaire FOR UPDATE
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

COMMENT ON TABLE responses_patho_urinaire IS 'Pathologies des voies urinaires - Urinary tract conditions questionnaire';
COMMENT ON COLUMN responses_patho_urinaire.q1_nephropathy IS 'Nephropathy presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_urinaire.q1_1_nephropathy_date IS 'Nephropathy onset date';
COMMENT ON COLUMN responses_patho_urinaire.q1_2_nephropathy_treated IS 'Nephropathy treated (yes/no)';
COMMENT ON COLUMN responses_patho_urinaire.q1_3_nephropathy_balanced IS 'Nephropathy balanced (yes/no)';
COMMENT ON COLUMN responses_patho_urinaire.q1_4_nephropathy_lithium_link IS 'Nephropathy linked to lithium treatment (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_urinaire.q2_prostatic_adenoma IS 'Prostatic adenoma presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_urinaire.q2_1_prostatic_adenoma_date IS 'Prostatic adenoma onset date';
COMMENT ON COLUMN responses_patho_urinaire.q2_2_prostatic_adenoma_treated IS 'Prostatic adenoma treated (yes/no)';
COMMENT ON COLUMN responses_patho_urinaire.q2_3_prostatic_adenoma_balanced IS 'Prostatic adenoma balanced (yes/no)';
COMMENT ON COLUMN responses_patho_urinaire.q3_urinary_retention IS 'Acute urinary retention presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_urinaire.q3_1_urinary_retention_date IS 'Acute urinary retention onset date';
COMMENT ON COLUMN responses_patho_urinaire.q3_2_urinary_retention_treatment_triggered IS 'Retention triggered by treatment (yes/no)';
COMMENT ON COLUMN responses_patho_urinaire.q3_3_urinary_retention_treatment_type IS 'Type of treatment causing retention (JSON array)';

