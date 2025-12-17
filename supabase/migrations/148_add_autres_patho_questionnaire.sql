-- ============================================================================
-- eFondaMental Platform - Autres Pathologies Questionnaire
-- ============================================================================
-- This migration creates the table for the "Autres pathologies" questionnaire
-- covering cancer, infectious diseases, surgical history, genetic diseases,
-- ophthalmological conditions, and other somatic pathologies.
-- ============================================================================

-- Create the responses table
CREATE TABLE responses_autres_patho (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- 0. Global response
    q0_global_response TEXT CHECK (q0_global_response IN ('non_pour_tous', 'ne_sais_pas_pour_tous', 'detailed')),
    
    -- I. Pathologies cancéreuses
    q1_1_neoplasique_presence TEXT CHECK (q1_1_neoplasique_presence IN ('yes', 'no', 'unknown')),
    q1_2_neoplasique_date DATE,
    q1_3_cancer_types TEXT[],
    q1_4_cancer_specify TEXT,
    
    -- II. Pathologies infectieuses
    -- VIH
    q2_1_vih_presence TEXT CHECK (q2_1_vih_presence IN ('yes', 'no', 'unknown')),
    q2_2_vih_date DATE,
    q2_3_vih_treated TEXT CHECK (q2_3_vih_treated IN ('yes', 'no')),
    q2_4_vih_balanced TEXT CHECK (q2_4_vih_balanced IN ('yes', 'no')),
    
    -- Hépatite virale chronique
    q3_1_hepatite_presence TEXT CHECK (q3_1_hepatite_presence IN ('yes', 'no', 'unknown')),
    q3_2_hepatite_date DATE,
    q3_3_hepatite_type TEXT CHECK (q3_3_hepatite_type IN ('hepatite_b', 'hepatite_c', 'hepatite_d', 'non_classee', 'unknown')),
    q3_4_hepatite_treated TEXT CHECK (q3_4_hepatite_treated IN ('yes', 'no')),
    q3_5_hepatite_balanced TEXT CHECK (q3_5_hepatite_balanced IN ('yes', 'no')),
    
    -- III. Antécédents chirurgicaux graves
    q4_1_chirurgicaux_presence TEXT CHECK (q4_1_chirurgicaux_presence IN ('yes', 'no', 'unknown')),
    q4_2_chirurgicaux_specify TEXT,
    
    -- IV. Maladie génétique
    q5_1_genetique_presence TEXT CHECK (q5_1_genetique_presence IN ('yes', 'no', 'unknown')),
    q5_2_genetique_specify TEXT,
    
    -- V. Pathologies ophtalmologiques
    q6_0_ophtalmo_presence TEXT CHECK (q6_0_ophtalmo_presence IN ('yes', 'no', 'unknown')),
    
    -- Glaucome par fermeture de l'angle
    q6_1_1_glaucome_fermeture_presence TEXT CHECK (q6_1_1_glaucome_fermeture_presence IN ('yes', 'no', 'unknown')),
    q6_1_2_glaucome_fermeture_date DATE,
    q6_1_3_glaucome_fermeture_treatment_triggered TEXT CHECK (q6_1_3_glaucome_fermeture_treatment_triggered IN ('yes', 'no')),
    q6_1_4_glaucome_fermeture_treatment_type TEXT CHECK (q6_1_4_glaucome_fermeture_treatment_type IN ('neuroleptiques', 'antidepresseurs', 'autres')),
    
    -- Glaucome chronique à angle ouvert
    q6_2_1_glaucome_ouvert_presence TEXT CHECK (q6_2_1_glaucome_ouvert_presence IN ('yes', 'no', 'unknown')),
    q6_2_2_glaucome_ouvert_date DATE,
    q6_2_3_glaucome_ouvert_treated TEXT CHECK (q6_2_3_glaucome_ouvert_treated IN ('yes', 'no')),
    q6_2_4_glaucome_ouvert_balanced TEXT CHECK (q6_2_4_glaucome_ouvert_balanced IN ('yes', 'no')),
    
    -- Cataracte
    q6_3_1_cataracte_presence TEXT CHECK (q6_3_1_cataracte_presence IN ('yes', 'no', 'unknown')),
    q6_3_2_cataracte_date DATE,
    q6_3_3_cataracte_treated TEXT CHECK (q6_3_3_cataracte_treated IN ('yes', 'no')),
    q6_3_4_cataracte_balanced TEXT CHECK (q6_3_4_cataracte_balanced IN ('yes', 'no')),
    
    -- VI. Autre pathologie somatique
    q7_1_autre_presence TEXT CHECK (q7_1_autre_presence IN ('yes', 'no', 'unknown')),
    q7_2_autre_specify TEXT,
    
    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_autres_patho ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients can view own autres_patho responses"
    ON responses_autres_patho FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients can insert own autres_patho responses"
    ON responses_autres_patho FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients can update own autres_patho responses"
    ON responses_autres_patho FOR UPDATE
    USING (auth.uid() = patient_id);

-- Professional policies
CREATE POLICY "Professionals can view all autres_patho responses"
    ON responses_autres_patho FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals can insert autres_patho responses"
    ON responses_autres_patho FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals can update autres_patho responses"
    ON responses_autres_patho FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- Create indexes for performance
CREATE INDEX idx_responses_autres_patho_visit_id ON responses_autres_patho(visit_id);
CREATE INDEX idx_responses_autres_patho_patient_id ON responses_autres_patho(patient_id);

-- Add trigger for updated_at
CREATE TRIGGER update_responses_autres_patho_updated_at
    BEFORE UPDATE ON responses_autres_patho
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

