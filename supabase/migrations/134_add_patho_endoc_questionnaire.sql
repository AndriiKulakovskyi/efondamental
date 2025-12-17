-- eFondaMental Platform - Pathologies endocriniennes et métaboliques (Endocrine and Metabolic Conditions)
-- Questionnaire tracking endocrine and metabolic conditions history

-- ============================================================================
-- Create Pathologies Endocriniennes et Métaboliques Response Table
-- ============================================================================

CREATE TABLE responses_patho_endoc (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- 1. Diabète (Diabetes)
    q1_diabete VARCHAR(10) CHECK (q1_diabete IN ('yes', 'no', 'unknown')),
    q1_1_diabete_date DATE,
    q1_2_diabete_treated VARCHAR(3) CHECK (q1_2_diabete_treated IN ('yes', 'no')),
    q1_3_diabete_balanced VARCHAR(3) CHECK (q1_3_diabete_balanced IN ('yes', 'no')),
    q1_4_diabete_type VARCHAR(10) CHECK (q1_4_diabete_type IN ('type1', 'type2', 'unknown')),

    -- 2. Dysthyroïdie (Thyroid Dysfunction)
    q2_dysthyroidie VARCHAR(10) CHECK (q2_dysthyroidie IN ('yes', 'no', 'unknown')),
    q2_1_dysthyroidie_type VARCHAR(15) CHECK (q2_1_dysthyroidie_type IN ('hypo', 'hyper', 'unknown')),
    q2_2_dysthyroidie_origin VARCHAR(20) CHECK (q2_2_dysthyroidie_origin IN ('lithium', 'other_treatment')),
    q2_3_dysthyroidie_treated VARCHAR(3) CHECK (q2_3_dysthyroidie_treated IN ('yes', 'no')),
    q2_4_dysthyroidie_balanced VARCHAR(3) CHECK (q2_4_dysthyroidie_balanced IN ('yes', 'no')),

    -- 3. Dyslipidémie (Dyslipidemia)
    q3_dyslipidemie VARCHAR(10) CHECK (q3_dyslipidemie IN ('yes', 'no', 'unknown')),
    q3_1_dyslipidemie_date DATE,
    q3_2_dyslipidemie_treated VARCHAR(3) CHECK (q3_2_dyslipidemie_treated IN ('yes', 'no')),
    q3_3_dyslipidemie_balanced VARCHAR(3) CHECK (q3_3_dyslipidemie_balanced IN ('yes', 'no')),
    q3_4_dyslipidemie_type VARCHAR(20) CHECK (q3_4_dyslipidemie_type IN ('hypercholesterolemia', 'hypertriglyceridemia', 'both', 'unknown')),

    -- 4. Autres endocrinopathies (Other Endocrinopathies)
    q4_autres VARCHAR(10) CHECK (q4_autres IN ('yes', 'no', 'unknown')),
    q4_1_autres_date DATE,
    q4_2_autres_specify TEXT,

    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Create Indexes
-- ============================================================================

CREATE INDEX idx_responses_patho_endoc_visit ON responses_patho_endoc(visit_id);
CREATE INDEX idx_responses_patho_endoc_patient ON responses_patho_endoc(patient_id);
CREATE INDEX idx_responses_patho_endoc_completed ON responses_patho_endoc(completed_at);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================

ALTER TABLE responses_patho_endoc ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================

-- Patient Policies
CREATE POLICY "Patients view own patho_endoc responses"
    ON responses_patho_endoc FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own patho_endoc responses"
    ON responses_patho_endoc FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own patho_endoc responses"
    ON responses_patho_endoc FOR UPDATE
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all patho_endoc responses"
    ON responses_patho_endoc FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert patho_endoc responses"
    ON responses_patho_endoc FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update patho_endoc responses"
    ON responses_patho_endoc FOR UPDATE
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

COMMENT ON TABLE responses_patho_endoc IS 'Pathologies endocriniennes et métaboliques - Endocrine and metabolic conditions questionnaire';
COMMENT ON COLUMN responses_patho_endoc.q1_diabete IS 'Diabetes presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_endoc.q1_1_diabete_date IS 'Diabetes onset date';
COMMENT ON COLUMN responses_patho_endoc.q1_2_diabete_treated IS 'Diabetes treated (yes/no)';
COMMENT ON COLUMN responses_patho_endoc.q1_3_diabete_balanced IS 'Diabetes balanced (yes/no)';
COMMENT ON COLUMN responses_patho_endoc.q1_4_diabete_type IS 'Diabetes type (type1/type2/unknown)';
COMMENT ON COLUMN responses_patho_endoc.q2_dysthyroidie IS 'Thyroid dysfunction presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_endoc.q2_1_dysthyroidie_type IS 'Thyroid dysfunction type (hypo/hyper/unknown)';
COMMENT ON COLUMN responses_patho_endoc.q2_2_dysthyroidie_origin IS 'Thyroid dysfunction origin (lithium/other_treatment)';
COMMENT ON COLUMN responses_patho_endoc.q2_3_dysthyroidie_treated IS 'Thyroid dysfunction treated (yes/no)';
COMMENT ON COLUMN responses_patho_endoc.q2_4_dysthyroidie_balanced IS 'Thyroid dysfunction balanced (yes/no)';
COMMENT ON COLUMN responses_patho_endoc.q3_dyslipidemie IS 'Dyslipidemia presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_endoc.q3_1_dyslipidemie_date IS 'Dyslipidemia onset date';
COMMENT ON COLUMN responses_patho_endoc.q3_2_dyslipidemie_treated IS 'Dyslipidemia treated (yes/no)';
COMMENT ON COLUMN responses_patho_endoc.q3_3_dyslipidemie_balanced IS 'Dyslipidemia balanced (yes/no)';
COMMENT ON COLUMN responses_patho_endoc.q3_4_dyslipidemie_type IS 'Dyslipidemia type';
COMMENT ON COLUMN responses_patho_endoc.q4_autres IS 'Other endocrinopathies presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_endoc.q4_1_autres_date IS 'Other endocrinopathies onset date';
COMMENT ON COLUMN responses_patho_endoc.q4_2_autres_specify IS 'Other endocrinopathies specification';

