-- ============================================================================
-- eFondaMental Platform - Pathologies hépato-gastro-entérologiques Questionnaire
-- ============================================================================
-- This migration creates the table for the hepato-gastro-enterological
-- pathologies questionnaire responses.
-- ============================================================================

-- Create the responses table
CREATE TABLE responses_patho_hepato_gastro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 1. Maladies inflammatoires chroniques de l'intestin (MICI)
    q1_1_mici_presence TEXT CHECK (q1_1_mici_presence IN ('yes', 'no', 'unknown')),
    q1_2_mici_start_date DATE,
    q1_3_mici_treated TEXT CHECK (q1_3_mici_treated IN ('yes', 'no')),
    q1_4_mici_balanced TEXT CHECK (q1_4_mici_balanced IN ('yes', 'no')),
    q1_5_mici_type TEXT CHECK (q1_5_mici_type IN ('crohn', 'rch', 'unknown')),
    
    -- 2. Cirrhose
    q2_1_cirrhosis_presence TEXT CHECK (q2_1_cirrhosis_presence IN ('yes', 'no', 'unknown')),
    q2_2_cirrhosis_start_date DATE,
    q2_3_cirrhosis_treated TEXT CHECK (q2_3_cirrhosis_treated IN ('yes', 'no')),
    q2_4_cirrhosis_balanced TEXT CHECK (q2_4_cirrhosis_balanced IN ('yes', 'no')),
    
    -- 3. Ulcère gastro-duodénal
    q3_1_ulcer_presence TEXT CHECK (q3_1_ulcer_presence IN ('yes', 'no', 'unknown')),
    q3_2_ulcer_start_date DATE,
    q3_3_ulcer_treated TEXT CHECK (q3_3_ulcer_treated IN ('yes', 'no')),
    q3_4_ulcer_balanced TEXT CHECK (q3_4_ulcer_balanced IN ('yes', 'no')),
    
    -- 4. Hépatites médicamenteuses
    q4_1_hepatitis_presence TEXT CHECK (q4_1_hepatitis_presence IN ('yes', 'no', 'unknown')),
    q4_2_hepatitis_start_date DATE,
    q4_3_hepatitis_treatment_type TEXT CHECK (q4_3_hepatitis_treatment_type IN ('neuroleptiques', 'antidepresseurs', 'anticonvulsivants', 'autres')),
    
    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_patho_hepato_gastro ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients can view own patho_hepato_gastro responses"
    ON responses_patho_hepato_gastro FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients can insert own patho_hepato_gastro responses"
    ON responses_patho_hepato_gastro FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update own patho_hepato_gastro responses"
    ON responses_patho_hepato_gastro FOR UPDATE
    USING (auth.uid() = patient_id);

-- Professional policies
CREATE POLICY "Professionals can view all patho_hepato_gastro responses"
    ON responses_patho_hepato_gastro FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals can insert patho_hepato_gastro responses"
    ON responses_patho_hepato_gastro FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals can update patho_hepato_gastro responses"
    ON responses_patho_hepato_gastro FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- Create indexes for performance
CREATE INDEX idx_responses_patho_hepato_gastro_visit_id ON responses_patho_hepato_gastro(visit_id);
CREATE INDEX idx_responses_patho_hepato_gastro_patient_id ON responses_patho_hepato_gastro(patient_id);

-- Add trigger for updated_at
CREATE TRIGGER update_responses_patho_hepato_gastro_updated_at
    BEFORE UPDATE ON responses_patho_hepato_gastro
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

