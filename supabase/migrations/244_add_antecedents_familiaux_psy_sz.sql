-- Migration: Add Antecedents Familiaux Psychiatriques table for Schizophrenia
-- Description: Creates table for storing family psychiatric history questionnaire responses

-- Create the responses table for Antecedents Familiaux Psychiatriques
CREATE TABLE responses_antecedents_familiaux_psy_sz (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- STRUCTURE: ENFANTS (Children)
    rad_structure_fille VARCHAR(10) CHECK (rad_structure_fille IN ('0', '1', '2', '3', '4', '5', '>5')),
    rad_structure_fille_atteint VARCHAR(10) CHECK (rad_structure_fille_atteint IN ('0', '1', '2', '3', '4', '5', '>5')),
    rad_structure_fils VARCHAR(10) CHECK (rad_structure_fils IN ('0', '1', '2', '3', '4', '5', '>5')),
    rad_structure_fils_atteint VARCHAR(10) CHECK (rad_structure_fils_atteint IN ('0', '1', '2', '3', '4', '5', '>5')),
    
    -- STRUCTURE: FRATRIE (Siblings)
    rad_structure_soeur VARCHAR(10) CHECK (rad_structure_soeur IN ('0', '1', '2', '3', '4', '5', '>5')),
    rad_structure_soeur_atteint VARCHAR(10) CHECK (rad_structure_soeur_atteint IN ('0', '1', '2', '3', '4', '5', '>5')),
    rad_structure_frere VARCHAR(10) CHECK (rad_structure_frere IN ('0', '1', '2', '3', '4', '5', '>5')),
    rad_structure_frere_atteint VARCHAR(10) CHECK (rad_structure_frere_atteint IN ('0', '1', '2', '3', '4', '5', '>5')),
    
    -- STRUCTURE: PARENTS
    rad_structure_mere VARCHAR(20) CHECK (rad_structure_mere IN ('oui', 'non', 'ne_sais_pas')),
    rad_atcdfampsy_mere_deces VARCHAR(10) CHECK (rad_atcdfampsy_mere_deces IN ('oui', 'non')),
    rad_structure_pere VARCHAR(20) CHECK (rad_structure_pere IN ('oui', 'non', 'ne_sais_pas')),
    rad_atcdfampsy_pere_deces VARCHAR(10) CHECK (rad_atcdfampsy_pere_deces IN ('oui', 'non')),
    
    -- FRATRIE DETAILS: SOEURS (Sisters 1-5)
    rad_soeur1_trouble VARCHAR(20) CHECK (rad_soeur1_trouble IN ('aucun', 'edm_unipolaire', 'bipolaire', 'schizophrene', 'ne_sais_pas')),
    rad_soeur1_suicide VARCHAR(20) CHECK (rad_soeur1_suicide IN ('aucun', 'tentative', 'abouti', 'ne_sais_pas')),
    rad_soeur2_trouble VARCHAR(20) CHECK (rad_soeur2_trouble IN ('aucun', 'edm_unipolaire', 'bipolaire', 'schizophrene', 'ne_sais_pas')),
    rad_soeur2_suicide VARCHAR(20) CHECK (rad_soeur2_suicide IN ('aucun', 'tentative', 'abouti', 'ne_sais_pas')),
    rad_soeur3_trouble VARCHAR(20) CHECK (rad_soeur3_trouble IN ('aucun', 'edm_unipolaire', 'bipolaire', 'schizophrene', 'ne_sais_pas')),
    rad_soeur3_suicide VARCHAR(20) CHECK (rad_soeur3_suicide IN ('aucun', 'tentative', 'abouti', 'ne_sais_pas')),
    rad_soeur4_trouble VARCHAR(20) CHECK (rad_soeur4_trouble IN ('aucun', 'edm_unipolaire', 'bipolaire', 'schizophrene', 'ne_sais_pas')),
    rad_soeur4_suicide VARCHAR(20) CHECK (rad_soeur4_suicide IN ('aucun', 'tentative', 'abouti', 'ne_sais_pas')),
    rad_soeur5_trouble VARCHAR(20) CHECK (rad_soeur5_trouble IN ('aucun', 'edm_unipolaire', 'bipolaire', 'schizophrene', 'ne_sais_pas')),
    rad_soeur5_suicide VARCHAR(20) CHECK (rad_soeur5_suicide IN ('aucun', 'tentative', 'abouti', 'ne_sais_pas')),
    
    -- FRATRIE DETAILS: FRERES (Brothers 1-5)
    rad_frere1_trouble VARCHAR(20) CHECK (rad_frere1_trouble IN ('aucun', 'edm_unipolaire', 'bipolaire', 'schizophrene', 'ne_sais_pas')),
    rad_frere1_suicide VARCHAR(20) CHECK (rad_frere1_suicide IN ('aucun', 'tentative', 'abouti', 'ne_sais_pas')),
    rad_frere2_trouble VARCHAR(20) CHECK (rad_frere2_trouble IN ('aucun', 'edm_unipolaire', 'bipolaire', 'schizophrene', 'ne_sais_pas')),
    rad_frere2_suicide VARCHAR(20) CHECK (rad_frere2_suicide IN ('aucun', 'tentative', 'abouti', 'ne_sais_pas')),
    rad_frere3_trouble VARCHAR(20) CHECK (rad_frere3_trouble IN ('aucun', 'edm_unipolaire', 'bipolaire', 'schizophrene', 'ne_sais_pas')),
    rad_frere3_suicide VARCHAR(20) CHECK (rad_frere3_suicide IN ('aucun', 'tentative', 'abouti', 'ne_sais_pas')),
    rad_frere4_trouble VARCHAR(20) CHECK (rad_frere4_trouble IN ('aucun', 'edm_unipolaire', 'bipolaire', 'schizophrene', 'ne_sais_pas')),
    rad_frere4_suicide VARCHAR(20) CHECK (rad_frere4_suicide IN ('aucun', 'tentative', 'abouti', 'ne_sais_pas')),
    rad_frere5_trouble VARCHAR(20) CHECK (rad_frere5_trouble IN ('aucun', 'edm_unipolaire', 'bipolaire', 'schizophrene', 'ne_sais_pas')),
    rad_frere5_suicide VARCHAR(20) CHECK (rad_frere5_suicide IN ('aucun', 'tentative', 'abouti', 'ne_sais_pas')),
    
    -- PARENTS DETAILS: MERE (Mother)
    rad_mere_trouble VARCHAR(20) CHECK (rad_mere_trouble IN ('aucun', 'edm_unipolaire', 'bipolaire', 'schizophrene', 'ne_sais_pas')),
    rad_mere_suicide VARCHAR(20) CHECK (rad_mere_suicide IN ('aucun', 'tentative', 'abouti', 'ne_sais_pas')),
    
    -- PARENTS DETAILS: PERE (Father)
    rad_pere_trouble VARCHAR(20) CHECK (rad_pere_trouble IN ('aucun', 'edm_unipolaire', 'bipolaire', 'schizophrene', 'ne_sais_pas')),
    rad_pere_suicide VARCHAR(20) CHECK (rad_pere_suicide IN ('aucun', 'tentative', 'abouti', 'ne_sais_pas')),
    
    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX idx_responses_antecedents_familiaux_psy_sz_visit ON responses_antecedents_familiaux_psy_sz(visit_id);
CREATE INDEX idx_responses_antecedents_familiaux_psy_sz_patient ON responses_antecedents_familiaux_psy_sz(patient_id);

-- Enable Row Level Security
ALTER TABLE responses_antecedents_familiaux_psy_sz ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Patients view own antecedents_familiaux_psy_sz responses"
    ON responses_antecedents_familiaux_psy_sz FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view all antecedents_familiaux_psy_sz responses"
    ON responses_antecedents_familiaux_psy_sz FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert antecedents_familiaux_psy_sz responses"
    ON responses_antecedents_familiaux_psy_sz FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update antecedents_familiaux_psy_sz responses"
    ON responses_antecedents_familiaux_psy_sz FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- Add helpful comments
COMMENT ON TABLE responses_antecedents_familiaux_psy_sz IS 'Antecedents familiaux psychiatriques questionnaire responses for schizophrenia';
COMMENT ON COLUMN responses_antecedents_familiaux_psy_sz.rad_structure_fille IS 'Nombre de filles';
COMMENT ON COLUMN responses_antecedents_familiaux_psy_sz.rad_structure_fille_atteint IS 'Nombre de filles atteintes';
COMMENT ON COLUMN responses_antecedents_familiaux_psy_sz.rad_structure_fils IS 'Nombre de fils';
COMMENT ON COLUMN responses_antecedents_familiaux_psy_sz.rad_structure_fils_atteint IS 'Nombre de fils atteints';
COMMENT ON COLUMN responses_antecedents_familiaux_psy_sz.rad_structure_soeur IS 'Nombre de soeurs';
COMMENT ON COLUMN responses_antecedents_familiaux_psy_sz.rad_structure_soeur_atteint IS 'Nombre de soeurs atteintes';
COMMENT ON COLUMN responses_antecedents_familiaux_psy_sz.rad_structure_frere IS 'Nombre de freres';
COMMENT ON COLUMN responses_antecedents_familiaux_psy_sz.rad_structure_frere_atteint IS 'Nombre de freres atteints';
COMMENT ON COLUMN responses_antecedents_familiaux_psy_sz.rad_structure_mere IS 'Mere a des antecedents psychiatriques';
COMMENT ON COLUMN responses_antecedents_familiaux_psy_sz.rad_atcdfampsy_mere_deces IS 'Mere decedee';
COMMENT ON COLUMN responses_antecedents_familiaux_psy_sz.rad_structure_pere IS 'Pere a des antecedents psychiatriques';
COMMENT ON COLUMN responses_antecedents_familiaux_psy_sz.rad_atcdfampsy_pere_deces IS 'Pere decede';
