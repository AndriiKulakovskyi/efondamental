-- ============================================================================
-- eFondaMental Platform - Pathologies allergiques et inflammatoires Questionnaire
-- ============================================================================
-- This migration creates the table for the allergic and inflammatory
-- pathologies questionnaire responses.
-- ============================================================================

-- Create the responses table
CREATE TABLE responses_patho_allergique (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 0. Main presence question
    q0_presence TEXT CHECK (q0_presence IN ('yes', 'no', 'unknown')),
    
    -- 1. Selection of pathologies (multi-select stored as array, conditional on q0_presence = 'yes')
    q1_pathologies_selection TEXT[],
    
    -- 2. Asthme (conditional on 'asthme' in selection)
    q2_1_asthme_treated TEXT CHECK (q2_1_asthme_treated IN ('yes', 'no')),
    q2_2_asthme_balanced TEXT CHECK (q2_2_asthme_balanced IN ('yes', 'no')),
    q2_3_asthme_start_date DATE,
    
    -- 3. Allergies hors asthme (conditional on 'allergies' in selection)
    q3_1_allergie_treated TEXT CHECK (q3_1_allergie_treated IN ('yes', 'no')),
    q3_2_allergie_balanced TEXT CHECK (q3_2_allergie_balanced IN ('yes', 'no')),
    q3_3_allergie_start_date DATE,
    
    -- 4. Lupus (conditional on 'lupus' in selection)
    q4_1_lupus_treated TEXT CHECK (q4_1_lupus_treated IN ('yes', 'no')),
    q4_2_lupus_balanced TEXT CHECK (q4_2_lupus_balanced IN ('yes', 'no')),
    q4_3_lupus_start_date DATE,
    
    -- 5. Polyarthrite rhumatoïde (conditional on 'polyarthrite' in selection)
    q5_1_polyarthrite_treated TEXT CHECK (q5_1_polyarthrite_treated IN ('yes', 'no')),
    q5_2_polyarthrite_balanced TEXT CHECK (q5_2_polyarthrite_balanced IN ('yes', 'no')),
    q5_3_polyarthrite_start_date DATE,
    
    -- 6. Autres maladies auto-immunes (conditional on 'autres_autoimmunes' in selection)
    q6_1_autoimmune_start_date DATE,
    q6_2_autoimmune_type TEXT,
    
    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_patho_allergique ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients can view own patho_allergique responses"
    ON responses_patho_allergique FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients can insert own patho_allergique responses"
    ON responses_patho_allergique FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update own patho_allergique responses"
    ON responses_patho_allergique FOR UPDATE
    USING (auth.uid() = patient_id);

-- Professional policies
CREATE POLICY "Professionals can view all patho_allergique responses"
    ON responses_patho_allergique FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals can insert patho_allergique responses"
    ON responses_patho_allergique FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals can update patho_allergique responses"
    ON responses_patho_allergique FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- Create indexes for performance
CREATE INDEX idx_responses_patho_allergique_visit_id ON responses_patho_allergique(visit_id);
CREATE INDEX idx_responses_patho_allergique_patient_id ON responses_patho_allergique(patient_id);

-- Add trigger for updated_at
CREATE TRIGGER update_responses_patho_allergique_updated_at
    BEFORE UPDATE ON responses_patho_allergique
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

