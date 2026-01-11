-- Migration: Add Bilan Biologique questionnaire for Schizophrenia Initial Evaluation
-- This questionnaire captures biological assessment data for the nurse section of schizophrenia initial evaluation

-- Create the responses table for Schizophrenia Bilan Biologique
CREATE TABLE IF NOT EXISTS responses_bilan_biologique_sz (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    completed_by UUID REFERENCES user_profiles(id),
    
    -- Date Section
    collection_date DATE,
    
    -- BIOCHIMIE
    rad_prelevement_lieu VARCHAR(20) CHECK (rad_prelevement_lieu IN ('Sur site', 'Hors site')),
    acide_urique DECIMAL(6,2) CHECK (acide_urique IS NULL OR (acide_urique >= 40 AND acide_urique <= 2000)),
    crp DECIMAL(5,2) CHECK (crp IS NULL OR (crp >= 0 AND crp <= 100)),
    glycemie DECIMAL(5,2) CHECK (glycemie IS NULL OR (glycemie >= 0 AND glycemie <= 40)),
    rad_glycemie VARCHAR(10) CHECK (rad_glycemie IN ('mmol_L', 'g_L')),
    hb_gly DECIMAL(4,2) CHECK (hb_gly IS NULL OR (hb_gly >= 0 AND hb_gly <= 50)),
    vitd25oh DECIMAL(6,2),
    
    -- BILAN LIPIDIQUE
    chol_hdl DECIMAL(5,2) CHECK (chol_hdl IS NULL OR (chol_hdl >= 0 AND chol_hdl <= 50)),
    rad_chol_hdl VARCHAR(10) CHECK (rad_chol_hdl IN ('mmol/L', 'g/L')),
    chol_ldl DECIMAL(5,2) CHECK (chol_ldl IS NULL OR (chol_ldl >= 0 AND chol_ldl <= 50)),
    rad_chol_ldl VARCHAR(10) CHECK (rad_chol_ldl IN ('mmol/L', 'g/L')),
    chol_total DECIMAL(5,2) CHECK (chol_total IS NULL OR (chol_total >= 0 AND chol_total <= 50)),
    chol_rapport_hdltot DECIMAL(5,2) CHECK (chol_rapport_hdltot IS NULL OR (chol_rapport_hdltot >= 0 AND chol_rapport_hdltot <= 30)),
    triglycerides DECIMAL(5,2) CHECK (triglycerides IS NULL OR (triglycerides >= 0 AND triglycerides <= 50)),
    
    -- NFS (NUMERATION FORMULE SANGUINE)
    gb DECIMAL(5,2) CHECK (gb IS NULL OR (gb >= 1 AND gb <= 40)),
    gr DECIMAL(5,2) CHECK (gr IS NULL OR (gr >= 1 AND gr <= 40)),
    hb DECIMAL(6,2) CHECK (hb IS NULL OR (hb >= 5 AND hb <= 100)),
    rad_hb VARCHAR(10) CHECK (rad_hb IN ('g/dL', 'mmol/L')),
    neutrophile DECIMAL(5,2) CHECK (neutrophile IS NULL OR (neutrophile >= 1 AND neutrophile <= 50)),
    eosinophile DECIMAL(5,2) CHECK (eosinophile IS NULL OR (eosinophile >= 0 AND eosinophile <= 10)),
    vgm DECIMAL(6,2) CHECK (vgm IS NULL OR (vgm >= 10 AND vgm <= 1000)),
    plaquettes DECIMAL(6,2) CHECK (plaquettes IS NULL OR (plaquettes >= 0 AND plaquettes <= 2000)),
    
    -- DOSAGES HORMONAUX
    prolactine DECIMAL(8,2) CHECK (prolactine IS NULL OR (prolactine >= 0 AND prolactine <= 5000)),
    rad_prolacti VARCHAR(10) CHECK (rad_prolacti IN ('mg/L', 'mUI/L', 'ng/ml')),
    
    -- DOSAGE DES PSYCHOTROPES
    rad_trt_visite VARCHAR(5) CHECK (rad_trt_visite IN ('Oui', 'Non')),
    rad_prisetraitement VARCHAR(5) CHECK (rad_prisetraitement IN ('Oui', 'Non')),
    rad_clozapine VARCHAR(5) CHECK (rad_clozapine IN ('Oui', 'Non')),
    clozapine DECIMAL(8,2),
    
    -- VITAMINE D
    radhtml_vitd_ext VARCHAR(5) CHECK (radhtml_vitd_ext IN ('1', '2', '3', '4')),
    radhtml_vitd_cutane VARCHAR(5) CHECK (radhtml_vitd_cutane IN ('1', '2', '3', '4', '5', '6')),
    
    -- SEROLOGIE TOXOPLASMOSE
    rad_toxo VARCHAR(5) CHECK (rad_toxo IN ('Oui', 'Non')),
    rad_igm_statut VARCHAR(5) CHECK (rad_igm_statut IN ('Oui', 'Non')),
    rad_igg_statut VARCHAR(5) CHECK (rad_igg_statut IN ('Oui', 'Non')),
    toxo_igg DECIMAL(10,2) CHECK (toxo_igg IS NULL OR toxo_igg >= 0),
    
    -- Timestamps
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_bilan_biologique_sz ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Patients
CREATE POLICY "Patients view own bilan biologique sz"
    ON responses_bilan_biologique_sz FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own bilan biologique sz"
    ON responses_bilan_biologique_sz FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own bilan biologique sz"
    ON responses_bilan_biologique_sz FOR UPDATE
    USING (auth.uid() = patient_id);

-- RLS Policies for Professionals
CREATE POLICY "Pros view all bilan biologique sz"
    ON responses_bilan_biologique_sz FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Pros insert bilan biologique sz"
    ON responses_bilan_biologique_sz FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Pros update bilan biologique sz"
    ON responses_bilan_biologique_sz FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- Create indexes for faster lookups
CREATE INDEX idx_bilan_biologique_sz_visit_id ON responses_bilan_biologique_sz(visit_id);
CREATE INDEX idx_bilan_biologique_sz_patient_id ON responses_bilan_biologique_sz(patient_id);

-- Add comment describing the table
COMMENT ON TABLE responses_bilan_biologique_sz IS 'Biological assessment questionnaire responses for schizophrenia initial evaluation - captures biochemistry, lipid panel, NFS (CBC), hormonal dosages (prolactin), psychotropic drug levels, vitamin D questionnaire, and toxoplasmosis serology';
