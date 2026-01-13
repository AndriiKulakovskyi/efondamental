-- Migration: Add Troubles Psychotiques questionnaire table
-- This comprehensive diagnostic questionnaire covers:
-- - Disorder classification (psychotic spectrum vs alternatives)
-- - Lifetime characteristics (age of onset, treatment history)
-- - Episode history (up to 20 episodes)
-- - Lifetime symptoms (delusions, hallucinations, disorganization, negative symptoms)
-- - Evolutionary mode
-- - Annual characteristics (past 12 months)

CREATE TABLE responses_troubles_psychotiques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- ==================== DISORDER CLASSIFICATION ====================
    -- Primary diagnosis
    rad_tbpsychovie TEXT CHECK (rad_tbpsychovie IN ('Oui', 'Non')),
    radhtml_tbpsychovie_type TEXT CHECK (radhtml_tbpsychovie_type IN ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10')),
    radhtml_tbpsychovie_non TEXT CHECK (radhtml_tbpsychovie_non IN ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13')),
    tbpsychovie_non_autre TEXT,

    -- Substance-induced details
    chk_tbpsychovie_type_substance TEXT[],
    tbpsychovie_type_substance_spe TEXT,
    rad_tbpsychovie_substance_trouble TEXT,

    -- Medical condition details
    rad_tbpsychovie_type_affection TEXT,
    tbpsychovie_type_affection_spe TEXT,

    -- ==================== LIFETIME CHARACTERISTICS ====================
    rad_tbpsychovie_premierep_age TEXT,
    rad_tbpsychovie_premiertrait_age TEXT,
    tbpsychovie_premiertrait_duree TEXT,
    rad_tbpsychovie_premierhosp_age TEXT,
    tbduree TEXT,
    tbdureetot TEXT,
    rad_tbpsychovie_hospit_nb TEXT,
    rad_tbpsychovie_hospit_dureetot TEXT,
    rad_tbpsychovie_nb TEXT,

    -- ==================== EPISODE HISTORY (20 episodes x 4 fields) ====================
    -- Episode 1
    rad_tbpsychovie_ep1_type TEXT,
    tbpsychovie_ep1_debut TEXT,
    rad_tbpsychovie_ep1_hosp TEXT,
    tbpsychovie_ep1_hospduree TEXT,
    -- Episode 2
    rad_tbpsychovie_ep2_type TEXT,
    tbpsychovie_ep2_debut TEXT,
    rad_tbpsychovie_ep2_hosp TEXT,
    tbpsychovie_ep2_hospduree TEXT,
    -- Episode 3
    rad_tbpsychovie_ep3_type TEXT,
    tbpsychovie_ep3_debut TEXT,
    rad_tbpsychovie_ep3_hosp TEXT,
    tbpsychovie_ep3_hospduree TEXT,
    -- Episode 4
    rad_tbpsychovie_ep4_type TEXT,
    tbpsychovie_ep4_debut TEXT,
    rad_tbpsychovie_ep4_hosp TEXT,
    tbpsychovie_ep4_hospduree TEXT,
    -- Episode 5
    rad_tbpsychovie_ep5_type TEXT,
    tbpsychovie_ep5_debut TEXT,
    rad_tbpsychovie_ep5_hosp TEXT,
    tbpsychovie_ep5_hospduree TEXT,
    -- Episode 6
    rad_tbpsychovie_ep6_type TEXT,
    tbpsychovie_ep6_debut TEXT,
    rad_tbpsychovie_ep6_hosp TEXT,
    tbpsychovie_ep6_hospduree TEXT,
    -- Episode 7
    rad_tbpsychovie_ep7_type TEXT,
    tbpsychovie_ep7_debut TEXT,
    rad_tbpsychovie_ep7_hosp TEXT,
    tbpsychovie_ep7_hospduree TEXT,
    -- Episode 8
    rad_tbpsychovie_ep8_type TEXT,
    tbpsychovie_ep8_debut TEXT,
    rad_tbpsychovie_ep8_hosp TEXT,
    tbpsychovie_ep8_hospduree TEXT,
    -- Episode 9
    rad_tbpsychovie_ep9_type TEXT,
    tbpsychovie_ep9_debut TEXT,
    rad_tbpsychovie_ep9_hosp TEXT,
    tbpsychovie_ep9_hospduree TEXT,
    -- Episode 10
    rad_tbpsychovie_ep10_type TEXT,
    tbpsychovie_ep10_debut TEXT,
    rad_tbpsychovie_ep10_hosp TEXT,
    tbpsychovie_ep10_hospduree TEXT,
    -- Episode 11
    rad_tbpsychovie_ep11_type TEXT,
    tbpsychovie_ep11_debut TEXT,
    rad_tbpsychovie_ep11_hosp TEXT,
    tbpsychovie_ep11_hospduree TEXT,
    -- Episode 12
    rad_tbpsychovie_ep12_type TEXT,
    tbpsychovie_ep12_debut TEXT,
    rad_tbpsychovie_ep12_hosp TEXT,
    tbpsychovie_ep12_hospduree TEXT,
    -- Episode 13
    rad_tbpsychovie_ep13_type TEXT,
    tbpsychovie_ep13_debut TEXT,
    rad_tbpsychovie_ep13_hosp TEXT,
    tbpsychovie_ep13_hospduree TEXT,
    -- Episode 14
    rad_tbpsychovie_ep14_type TEXT,
    tbpsychovie_ep14_debut TEXT,
    rad_tbpsychovie_ep14_hosp TEXT,
    tbpsychovie_ep14_hospduree TEXT,
    -- Episode 15
    rad_tbpsychovie_ep15_type TEXT,
    tbpsychovie_ep15_debut TEXT,
    rad_tbpsychovie_ep15_hosp TEXT,
    tbpsychovie_ep15_hospduree TEXT,
    -- Episode 16
    rad_tbpsychovie_ep16_type TEXT,
    tbpsychovie_ep16_debut TEXT,
    rad_tbpsychovie_ep16_hosp TEXT,
    tbpsychovie_ep16_hospduree TEXT,
    -- Episode 17
    rad_tbpsychovie_ep17_type TEXT,
    tbpsychovie_ep17_debut TEXT,
    rad_tbpsychovie_ep17_hosp TEXT,
    tbpsychovie_ep17_hospduree TEXT,
    -- Episode 18
    rad_tbpsychovie_ep18_type TEXT,
    tbpsychovie_ep18_debut TEXT,
    rad_tbpsychovie_ep18_hosp TEXT,
    tbpsychovie_ep18_hospduree TEXT,
    -- Episode 19
    rad_tbpsychovie_ep19_type TEXT,
    tbpsychovie_ep19_debut TEXT,
    rad_tbpsychovie_ep19_hosp TEXT,
    tbpsychovie_ep19_hospduree TEXT,
    -- Episode 20
    rad_tbpsychovie_ep20_type TEXT,
    tbpsychovie_ep20_debut TEXT,
    rad_tbpsychovie_ep20_hosp TEXT,
    tbpsychovie_ep20_hospduree TEXT,

    -- ==================== LIFETIME SYMPTOMS - DELUSIONS ====================
    rad_symptomesvie_persecution TEXT,
    rad_symptomesvie_persecution_mois TEXT,
    rad_symptomesvie_grandeur TEXT,
    rad_symptomesvie_grandeur_mois TEXT,
    rad_symptomesvie_somatique TEXT,
    rad_symptomesvie_somatique_mois TEXT,
    rad_symptomesvie_mystique TEXT,
    rad_symptomesvie_mystique_mois TEXT,
    rad_symptomesvie_culpabilite TEXT,
    rad_symptomesvie_culpabilite_mois TEXT,
    rad_symptomesvie_jalousie TEXT,
    rad_symptomesvie_jalousie_mois TEXT,
    rad_symptomesvie_erotomaniaque TEXT,
    rad_symptomesvie_erotomaniaque_mois TEXT,
    rad_symptomesvie_etrecontrole TEXT,
    rad_symptomesvie_etrecontrole_mois TEXT,
    rad_symptomesvie_volpensee TEXT,
    rad_symptomesvie_volpensee_mois TEXT,
    rad_symptomesvie_bizarre TEXT,
    rad_symptomesvie_bizarre_mois TEXT,
    rad_symptomesvie_idreferences TEXT,
    rad_symptomesvie_idreferences_mois TEXT,

    -- ==================== LIFETIME SYMPTOMS - HALLUCINATIONS ====================
    rad_symptomesvie_halluintrapsy TEXT,
    rad_symptomesvie_halluintrapsy_mois TEXT,
    rad_symptomesvie_hallusenso TEXT,
    rad_symptomesvie_hallusenso_mois TEXT,
    rad_symptomesvie_halluvisu TEXT,
    rad_symptomesvie_halluvisu_mois TEXT,
    rad_symptomesvie_hallucenesthe TEXT,
    rad_symptomesvie_hallucenesthe_mois TEXT,

    -- ==================== LIFETIME SYMPTOMS - DISORGANIZATION ====================
    rad_symptomesvie_catatonie TEXT,
    rad_symptomesvie_catatonie_mois TEXT,
    rad_symptomesvie_compodesorg TEXT,
    rad_symptomesvie_compodesorg_mois TEXT,
    rad_symptomesvie_gestdiscord TEXT,
    rad_symptomesvie_gestdiscord_mois TEXT,
    rad_symptomesvie_discdesorg TEXT,
    rad_symptomesvie_discdesorg_mois TEXT,

    -- ==================== LIFETIME SYMPTOMS - NEGATIVE SYMPTOMS ====================
    rad_symptomesvie_avolition TEXT,
    rad_symptomesvie_avolition_mois TEXT,
    rad_symptomesvie_alogie TEXT,
    rad_symptomesvie_alogie_mois TEXT,
    rad_symptomesvie_emousaffec TEXT,
    rad_symptomesvie_emousaffec_mois TEXT,

    -- ==================== EVOLUTIONARY MODE ====================
    rad_symptomeevo_mode TEXT,

    -- ==================== ANNUAL CHARACTERISTICS ====================
    -- Episodes this year
    rad_tbpsychoan TEXT,

    -- Hospitalizations
    rad_tbpsychoan_hospi_tpscomplet TEXT,
    rad_tbpsychoan_hospi_tpscomplet_nb TEXT,
    rad_tbpsychoan_hospi_tpscomplet_duree TEXT,
    rad_tbpsychoan_hospi_tpscomplet_motif TEXT,

    -- Non-pharmacological treatment changes
    rad_tbpsychoan_modpec_nonmed TEXT,
    chk_tbpsychoan_modpec_nonmed_tcc TEXT[],
    chk_tbpsychoan_modpec_nonmed_remed TEXT[],
    chk_tbpsychoan_modpec_nonmed_psychody TEXT[],
    chk_tbpsychoan_modpec_nonmed_fam TEXT[],
    tbpsychoan_modpec_nonmed_autre TEXT,

    -- Treatment adherence support
    chk_aide_prise_tt TEXT[],
    rad_aide_prise_tt_hospi TEXT,

    -- Suicide attempts
    rad_tbpsychoan_ts TEXT,
    rad_tbpsychoan_ts_nb TEXT,

    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.responses_troubles_psychotiques ENABLE ROW LEVEL SECURITY;

-- Patient Policies
CREATE POLICY "Patients view own Troubles Psychotiques" ON responses_troubles_psychotiques 
    FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients insert own Troubles Psychotiques" ON responses_troubles_psychotiques 
    FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients update own Troubles Psychotiques" ON responses_troubles_psychotiques 
    FOR UPDATE USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all Troubles Psychotiques" ON responses_troubles_psychotiques 
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
    );
CREATE POLICY "Professionals insert Troubles Psychotiques" ON responses_troubles_psychotiques 
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
    );
CREATE POLICY "Professionals update Troubles Psychotiques" ON responses_troubles_psychotiques 
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
    );

-- Index for faster lookups
CREATE INDEX idx_troubles_psychotiques_visit ON responses_troubles_psychotiques(visit_id);
CREATE INDEX idx_troubles_psychotiques_patient ON responses_troubles_psychotiques(patient_id);
