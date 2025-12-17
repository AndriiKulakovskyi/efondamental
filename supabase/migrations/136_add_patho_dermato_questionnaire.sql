-- eFondaMental Platform - Pathologies dermatologiques (Dermatological Conditions)
-- Questionnaire tracking dermatological conditions history

-- ============================================================================
-- Create Pathologies Dermatologiques Response Table
-- ============================================================================

CREATE TABLE responses_patho_dermato (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- 1. Psoriasis
    q1_psoriasis VARCHAR(10) CHECK (q1_psoriasis IN ('yes', 'no', 'unknown')),
    q1_1_psoriasis_date DATE,
    q1_2_psoriasis_treated VARCHAR(3) CHECK (q1_2_psoriasis_treated IN ('yes', 'no')),
    q1_3_psoriasis_balanced VARCHAR(3) CHECK (q1_3_psoriasis_balanced IN ('yes', 'no')),
    q1_4_psoriasis_lithium_effect VARCHAR(10) CHECK (q1_4_psoriasis_lithium_effect IN ('yes', 'no', 'unknown')),
    q1_5_psoriasis_triggered_lithium VARCHAR(3) CHECK (q1_5_psoriasis_triggered_lithium IN ('yes', 'no')),
    q1_6_psoriasis_aggravated_lithium VARCHAR(3) CHECK (q1_6_psoriasis_aggravated_lithium IN ('yes', 'no')),

    -- 2. Acné (Acne)
    q2_acne VARCHAR(10) CHECK (q2_acne IN ('yes', 'no', 'unknown')),
    q2_1_acne_date DATE,
    q2_2_acne_treated VARCHAR(3) CHECK (q2_2_acne_treated IN ('yes', 'no')),
    q2_3_acne_balanced VARCHAR(3) CHECK (q2_3_acne_balanced IN ('yes', 'no')),
    q2_4_acne_lithium_effect VARCHAR(10) CHECK (q2_4_acne_lithium_effect IN ('yes', 'no', 'unknown')),
    q2_5_acne_triggered_lithium VARCHAR(3) CHECK (q2_5_acne_triggered_lithium IN ('yes', 'no')),
    q2_6_acne_aggravated_lithium VARCHAR(3) CHECK (q2_6_acne_aggravated_lithium IN ('yes', 'no')),

    -- 3. Eczéma (Eczema)
    q3_eczema VARCHAR(10) CHECK (q3_eczema IN ('yes', 'no', 'unknown')),
    q3_1_eczema_date DATE,
    q3_2_eczema_treated VARCHAR(3) CHECK (q3_2_eczema_treated IN ('yes', 'no')),
    q3_3_eczema_balanced VARCHAR(3) CHECK (q3_3_eczema_balanced IN ('yes', 'no')),

    -- 4. Toxidermie médicamenteuse (Drug-induced skin reaction)
    q4_toxidermie VARCHAR(10) CHECK (q4_toxidermie IN ('yes', 'no', 'unknown')),
    q4_1_toxidermie_date DATE,
    q4_2_toxidermie_type VARCHAR(30) CHECK (q4_2_toxidermie_type IN ('simple_eruption', 'lyell', 'stevens_johnson')),
    q4_3_toxidermie_medication JSONB,

    -- 5. Perte importante de cheveux (Significant hair loss)
    q5_hair_loss VARCHAR(10) CHECK (q5_hair_loss IN ('yes', 'no', 'unknown')),
    q5_1_hair_loss_date DATE,
    q5_2_hair_loss_treated VARCHAR(3) CHECK (q5_2_hair_loss_treated IN ('yes', 'no')),
    q5_3_hair_loss_balanced VARCHAR(3) CHECK (q5_3_hair_loss_balanced IN ('yes', 'no')),
    q5_4_hair_loss_depakine VARCHAR(10) CHECK (q5_4_hair_loss_depakine IN ('yes', 'no', 'unknown')),

    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Create Indexes
-- ============================================================================

CREATE INDEX idx_responses_patho_dermato_visit ON responses_patho_dermato(visit_id);
CREATE INDEX idx_responses_patho_dermato_patient ON responses_patho_dermato(patient_id);
CREATE INDEX idx_responses_patho_dermato_completed ON responses_patho_dermato(completed_at);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================

ALTER TABLE responses_patho_dermato ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================

-- Patient Policies
CREATE POLICY "Patients view own patho_dermato responses"
    ON responses_patho_dermato FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own patho_dermato responses"
    ON responses_patho_dermato FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own patho_dermato responses"
    ON responses_patho_dermato FOR UPDATE
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all patho_dermato responses"
    ON responses_patho_dermato FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert patho_dermato responses"
    ON responses_patho_dermato FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update patho_dermato responses"
    ON responses_patho_dermato FOR UPDATE
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

COMMENT ON TABLE responses_patho_dermato IS 'Pathologies dermatologiques - Dermatological conditions questionnaire';
COMMENT ON COLUMN responses_patho_dermato.q1_psoriasis IS 'Psoriasis presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_dermato.q1_1_psoriasis_date IS 'Psoriasis onset date';
COMMENT ON COLUMN responses_patho_dermato.q1_2_psoriasis_treated IS 'Psoriasis treated (yes/no)';
COMMENT ON COLUMN responses_patho_dermato.q1_3_psoriasis_balanced IS 'Psoriasis balanced (yes/no)';
COMMENT ON COLUMN responses_patho_dermato.q1_4_psoriasis_lithium_effect IS 'Psoriasis triggered/aggravated by lithium (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_dermato.q1_5_psoriasis_triggered_lithium IS 'Psoriasis triggered by lithium (yes/no)';
COMMENT ON COLUMN responses_patho_dermato.q1_6_psoriasis_aggravated_lithium IS 'Psoriasis aggravated by lithium (yes/no)';
COMMENT ON COLUMN responses_patho_dermato.q2_acne IS 'Acne presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_dermato.q2_1_acne_date IS 'Acne onset date';
COMMENT ON COLUMN responses_patho_dermato.q2_2_acne_treated IS 'Acne treated (yes/no)';
COMMENT ON COLUMN responses_patho_dermato.q2_3_acne_balanced IS 'Acne balanced (yes/no)';
COMMENT ON COLUMN responses_patho_dermato.q2_4_acne_lithium_effect IS 'Acne triggered/aggravated by lithium (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_dermato.q2_5_acne_triggered_lithium IS 'Acne triggered by lithium (yes/no)';
COMMENT ON COLUMN responses_patho_dermato.q2_6_acne_aggravated_lithium IS 'Acne aggravated by lithium (yes/no)';
COMMENT ON COLUMN responses_patho_dermato.q3_eczema IS 'Eczema presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_dermato.q3_1_eczema_date IS 'Eczema onset date';
COMMENT ON COLUMN responses_patho_dermato.q3_2_eczema_treated IS 'Eczema treated (yes/no)';
COMMENT ON COLUMN responses_patho_dermato.q3_3_eczema_balanced IS 'Eczema balanced (yes/no)';
COMMENT ON COLUMN responses_patho_dermato.q4_toxidermie IS 'Drug-induced skin reaction presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_dermato.q4_1_toxidermie_date IS 'Drug-induced skin reaction onset date';
COMMENT ON COLUMN responses_patho_dermato.q4_2_toxidermie_type IS 'Type of drug-induced skin reaction';
COMMENT ON COLUMN responses_patho_dermato.q4_3_toxidermie_medication IS 'Medication(s) causing the reaction (JSON array)';
COMMENT ON COLUMN responses_patho_dermato.q5_hair_loss IS 'Significant hair loss presence (yes/no/unknown)';
COMMENT ON COLUMN responses_patho_dermato.q5_1_hair_loss_date IS 'Hair loss onset date';
COMMENT ON COLUMN responses_patho_dermato.q5_2_hair_loss_treated IS 'Hair loss treated (yes/no)';
COMMENT ON COLUMN responses_patho_dermato.q5_3_hair_loss_balanced IS 'Hair loss balanced (yes/no)';
COMMENT ON COLUMN responses_patho_dermato.q5_4_hair_loss_depakine IS 'Hair loss related to Depakine/Depamide/Depakote (yes/no/unknown)';

