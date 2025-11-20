-- Migration: Add Biological Assessment (Bilan biologique) Questionnaire
-- Description: Creates table for comprehensive biological assessment with multiple sections
-- Date: 2025-11-19

-- =====================================================
-- TABLE: responses_biological_assessment
-- =====================================================
-- Stores comprehensive biological assessment responses
CREATE TABLE responses_biological_assessment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Date and Location
    collection_date DATE,
    collection_location VARCHAR(20) CHECK (collection_location IN ('sur_site', 'hors_site')),
    
    -- Control Questions
    on_neuroleptics BOOLEAN,
    woman_childbearing_age BOOLEAN,
    
    -- ===== BIOCHIMIE =====
    sodium DECIMAL(5,2) CHECK (sodium >= 120 AND sodium <= 170), -- mmol/L
    potassium DECIMAL(4,2) CHECK (potassium >= 2.0 AND potassium <= 7.0), -- mmol/L
    chlore INTEGER CHECK (chlore >= 80 AND chlore <= 130), -- mmol/L
    bicarbonates INTEGER CHECK (bicarbonates >= 10 AND bicarbonates <= 40), -- mmol/L
    protidemie INTEGER CHECK (protidemie >= 50 AND protidemie <= 90), -- g/L
    albumine INTEGER CHECK (albumine >= 30 AND albumine <= 55), -- g/L
    uree DECIMAL(4,2) CHECK (uree >= 1 AND uree <= 20), -- mmol/L
    acide_urique INTEGER CHECK (acide_urique >= 100 AND acide_urique <= 500), -- µmol/L
    creatinine DECIMAL(6,2) CHECK (creatinine >= 30 AND creatinine <= 400), -- µmol/L
    clairance_creatinine DECIMAL(5,2) CHECK (clairance_creatinine >= 10 AND clairance_creatinine <= 200), -- ml/min (computed)
    phosphore DECIMAL(3,2) CHECK (phosphore >= 0.5 AND phosphore <= 2.0), -- mmol/L
    fer DECIMAL(4,2) CHECK (fer >= 5 AND fer <= 40), -- µmol/L
    ferritine INTEGER CHECK (ferritine >= 5 AND ferritine <= 1000), -- µg/L
    calcemie DECIMAL(4,3) CHECK (calcemie >= 1.50 AND calcemie <= 2.75), -- mmol/L
    
    -- ===== BILAN LIPIDIQUE =====
    hdl DECIMAL(5,2),
    hdl_unit VARCHAR(10) CHECK (hdl_unit IN ('mmol_L', 'g_L')),
    ldl DECIMAL(5,2),
    ldl_unit VARCHAR(10) CHECK (ldl_unit IN ('mmol_L', 'g_L')),
    cholesterol_total DECIMAL(5,2) CHECK (cholesterol_total >= 1 AND cholesterol_total <= 15), -- mmol/L
    triglycerides DECIMAL(5,2) CHECK (triglycerides >= 0.2 AND triglycerides <= 20), -- mmol/L
    
    -- ===== BILAN HÉPATIQUE =====
    pal INTEGER CHECK (pal >= 20 AND pal <= 400), -- UI/L
    asat INTEGER CHECK (asat >= 5 AND asat <= 500), -- UI/L
    alat INTEGER CHECK (alat >= 5 AND alat <= 500), -- UI/L
    bilirubine_totale DECIMAL(6,2),
    bilirubine_unit VARCHAR(10) CHECK (bilirubine_unit IN ('umol_L', 'mmol_L', 'mg_L')),
    ggt INTEGER CHECK (ggt >= 5 AND ggt <= 1500), -- UI/L
    
    -- ===== BILAN THYROÏDIEN =====
    tsh DECIMAL(6,2),
    tsh_unit VARCHAR(10) CHECK (tsh_unit IN ('pmol_L', 'uUI_mL', 'mUI_L')),
    t3_libre DECIMAL(4,2) CHECK (t3_libre >= 1 AND t3_libre <= 30), -- pmol/L
    t4_libre DECIMAL(5,2) CHECK (t4_libre >= 5 AND t4_libre <= 50), -- pmol/L
    
    -- ===== NFS (NUMÉRATION FORMULE SANGUINE) =====
    leucocytes DECIMAL(6,2) CHECK (leucocytes >= 0.5 AND leucocytes <= 200), -- G/L
    hematies DECIMAL(4,2) CHECK (hematies >= 1 AND hematies <= 8), -- T/L
    hemoglobine DECIMAL(5,2),
    hemoglobine_unit VARCHAR(10) CHECK (hemoglobine_unit IN ('g_dL', 'mmol_L')),
    hematocrite DECIMAL(5,2),
    hematocrite_unit VARCHAR(10) CHECK (hematocrite_unit IN ('percent', 'L_L')),
    neutrophiles DECIMAL(5,2) CHECK (neutrophiles >= 0 AND neutrophiles <= 50), -- G/L
    basophiles DECIMAL(4,2) CHECK (basophiles >= 0 AND basophiles <= 5), -- G/L
    eosinophiles DECIMAL(4,2) CHECK (eosinophiles >= 0 AND eosinophiles <= 10), -- G/L
    lymphocytes DECIMAL(5,2) CHECK (lymphocytes >= 0 AND lymphocytes <= 20), -- G/L
    monocytes DECIMAL(4,2) CHECK (monocytes >= 0 AND monocytes <= 5), -- G/L
    vgm DECIMAL(5,2) CHECK (vgm >= 50 AND vgm <= 130), -- fL
    tcmh DECIMAL(4,2),
    tcmh_unit VARCHAR(10) CHECK (tcmh_unit IN ('pg', 'percent')),
    ccmh DECIMAL(5,2),
    ccmh_unit VARCHAR(10) CHECK (ccmh_unit IN ('percent', 'g_dL', 'g_L')),
    plaquettes INTEGER CHECK (plaquettes >= 10 AND plaquettes <= 1000), -- G/L
    
    -- ===== HCG & PROLACTINE =====
    beta_hcg INTEGER CHECK (beta_hcg >= 0 AND beta_hcg <= 500000), -- UI
    prolactine DECIMAL(8,2) CHECK (prolactine > 0),
    prolactine_unit VARCHAR(10) CHECK (prolactine_unit IN ('mg_L', 'uIU_mL', 'ng_mL', 'ug_L')),
    
    -- ===== DOSAGE PSYCHOTROPES =====
    treatment_taken_morning BOOLEAN,
    clozapine DECIMAL(6,2), -- mmol/L
    teralithe_type VARCHAR(10) CHECK (teralithe_type IN ('250', 'LP400')),
    lithium_plasma DECIMAL(5,2), -- mmol/L
    lithium_erythrocyte DECIMAL(5,2), -- mmol/L
    valproic_acid DECIMAL(6,2), -- mg/L
    carbamazepine DECIMAL(6,2), -- mg/L
    oxcarbazepine DECIMAL(6,2), -- µg/ml
    lamotrigine DECIMAL(6,2),
    
    -- ===== VITAMINE D =====
    vitamin_d_level DECIMAL(6,2) CHECK (vitamin_d_level >= 0 AND vitamin_d_level <= 300), -- ng/ml
    outdoor_time VARCHAR(50) CHECK (outdoor_time IN (
        'less_than_1h_per_week',
        'less_than_1h_per_day_several_hours_per_week',
        'at_least_1h_per_day',
        'more_than_4h_per_day'
    )),
    skin_phototype VARCHAR(10) CHECK (skin_phototype IN ('I', 'II', 'III', 'IV', 'V', 'VI')),
    vitamin_d_supplementation BOOLEAN,
    
    -- ===== SÉROLOGIE TOXOPLASMOSE =====
    toxo_serology_done BOOLEAN,
    toxo_igm_positive BOOLEAN,
    toxo_igg_positive BOOLEAN,
    toxo_igg_value DECIMAL(8,2) CHECK (toxo_igg_value > 0), -- UI/mL
    toxo_pcr_done BOOLEAN,
    toxo_pcr_positive BOOLEAN,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_biological_assessment ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Healthcare Professionals
CREATE POLICY "Healthcare professionals can view biological assessment"
    ON responses_biological_assessment FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Healthcare professionals can insert biological assessment"
    ON responses_biological_assessment FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

CREATE POLICY "Healthcare professionals can update biological assessment"
    ON responses_biological_assessment FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- RLS Policies for Patients
CREATE POLICY "Patients can view own biological assessment"
    ON responses_biological_assessment FOR SELECT
    USING (auth.uid() = patient_id);

-- Trigger for updated_at
CREATE TRIGGER update_responses_biological_assessment_updated_at
    BEFORE UPDATE ON responses_biological_assessment
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_responses_biological_assessment_visit_id ON responses_biological_assessment(visit_id);
CREATE INDEX idx_responses_biological_assessment_patient_id ON responses_biological_assessment(patient_id);

-- Comments for documentation
COMMENT ON TABLE responses_biological_assessment IS 'Comprehensive biological assessment including biochemistry, lipid panel, liver function, thyroid, complete blood count, HCG, prolactine, psychotropic dosages, vitamin D, and toxoplasmosis serology';
COMMENT ON COLUMN responses_biological_assessment.clairance_creatinine IS 'Creatinine clearance calculated automatically: Male: 1.23 × weight × (140 - age) / creatinine, Female: 1.04 × weight × (140 - age) / creatinine';

