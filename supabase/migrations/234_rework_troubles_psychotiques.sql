-- Rework Troubles Psychotiques questionnaire based on corrected JSON specification
-- Drop the existing table and recreate with correct schema

DROP TABLE IF EXISTS responses_troubles_psychotiques;

CREATE TABLE responses_troubles_psychotiques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- =====================================================
    -- SECTION 1: TROUBLE PSYCHOTIQUE VIE ENTIERE
    -- =====================================================
    
    -- Primary gating question
    rad_tbpsychovie TEXT CHECK (rad_tbpsychovie IN ('Oui', 'Non')),
    
    -- Psychotic spectrum disorder types (shown when rad_tbpsychovie = 'Oui')
    radhtml_tbpsychovie_type TEXT CHECK (radhtml_tbpsychovie_type IN ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10')),
    
    -- Non-psychotic disorder types (shown when rad_tbpsychovie = 'Non')
    radhtml_tbpsychovie_non TEXT CHECK (radhtml_tbpsychovie_non IN ('1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13')),
    
    -- Other genetic disorder specification (when radhtml_tbpsychovie_non = '6')
    tbpsychovie_non_autre VARCHAR(300),

    -- =====================================================
    -- SECTION 2: CARACTERISTIQUES DU TROUBLE VIE ENTIERE
    -- =====================================================
    
    -- Age at first psychotic episode
    rad_tbpsychovie_premierep_age TEXT,
    
    -- Age at first antipsychotic treatment
    rad_tbpsychovie_premiertrait_age TEXT,
    
    -- Duration of untreated psychosis (months)
    tbpsychovie_premiertrait_duree VARCHAR(10),
    
    -- Age at first psychiatric hospitalization
    rad_tbpsychovie_premierhosp_age TEXT,
    
    -- Duration in weeks (first hospitalization)
    tbduree VARCHAR(4),
    
    -- Total hospitalization duration for first episode (weeks)
    tbdureetot VARCHAR(10),
    
    -- Number of lifetime psychiatric hospitalizations
    rad_tbpsychovie_hospit_nb TEXT,
    
    -- Total duration of lifetime hospitalizations (months)
    rad_tbpsychovie_hospit_dureetot TEXT,
    
    -- Number of psychotic episodes
    rad_tbpsychovie_nb TEXT,

    -- =====================================================
    -- SECTION 3: DETAILS DES EPISODES PSYCHOTIQUES (1-20)
    -- =====================================================
    
    -- Episode 1
    rad_tbpsychovie_ep1_type TEXT,
    tbpsychovie_ep1_debut VARCHAR(10),
    rad_tbpsychovie_ep1_hosp TEXT CHECK (rad_tbpsychovie_ep1_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep1_hospduree VARCHAR(10),
    
    -- Episode 2
    rad_tbpsychovie_ep2_type TEXT,
    tbpsychovie_ep2_debut VARCHAR(10),
    rad_tbpsychovie_ep2_hosp TEXT CHECK (rad_tbpsychovie_ep2_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep2_hospduree VARCHAR(10),
    
    -- Episode 3
    rad_tbpsychovie_ep3_type TEXT,
    tbpsychovie_ep3_debut VARCHAR(10),
    rad_tbpsychovie_ep3_hosp TEXT CHECK (rad_tbpsychovie_ep3_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep3_hospduree VARCHAR(10),
    
    -- Episode 4
    rad_tbpsychovie_ep4_type TEXT,
    tbpsychovie_ep4_debut VARCHAR(10),
    rad_tbpsychovie_ep4_hosp TEXT CHECK (rad_tbpsychovie_ep4_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep4_hospduree VARCHAR(10),
    
    -- Episode 5
    rad_tbpsychovie_ep5_type TEXT,
    tbpsychovie_ep5_debut VARCHAR(10),
    rad_tbpsychovie_ep5_hosp TEXT CHECK (rad_tbpsychovie_ep5_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep5_hospduree VARCHAR(10),
    
    -- Episode 6
    rad_tbpsychovie_ep6_type TEXT,
    tbpsychovie_ep6_debut VARCHAR(10),
    rad_tbpsychovie_ep6_hosp TEXT CHECK (rad_tbpsychovie_ep6_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep6_hospduree VARCHAR(10),
    
    -- Episode 7
    rad_tbpsychovie_ep7_type TEXT,
    tbpsychovie_ep7_debut VARCHAR(10),
    rad_tbpsychovie_ep7_hosp TEXT CHECK (rad_tbpsychovie_ep7_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep7_hospduree VARCHAR(10),
    
    -- Episode 8
    rad_tbpsychovie_ep8_type TEXT,
    tbpsychovie_ep8_debut VARCHAR(10),
    rad_tbpsychovie_ep8_hosp TEXT CHECK (rad_tbpsychovie_ep8_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep8_hospduree VARCHAR(10),
    
    -- Episode 9
    rad_tbpsychovie_ep9_type TEXT,
    tbpsychovie_ep9_debut VARCHAR(10),
    rad_tbpsychovie_ep9_hosp TEXT CHECK (rad_tbpsychovie_ep9_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep9_hospduree VARCHAR(10),
    
    -- Episode 10
    rad_tbpsychovie_ep10_type TEXT,
    tbpsychovie_ep10_debut VARCHAR(10),
    rad_tbpsychovie_ep10_hosp TEXT CHECK (rad_tbpsychovie_ep10_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep10_hospduree VARCHAR(10),
    
    -- Episode 11
    rad_tbpsychovie_ep11_type TEXT,
    tbpsychovie_ep11_debut VARCHAR(10),
    rad_tbpsychovie_ep11_hosp TEXT CHECK (rad_tbpsychovie_ep11_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep11_hospduree VARCHAR(10),
    
    -- Episode 12
    rad_tbpsychovie_ep12_type TEXT,
    tbpsychovie_ep12_debut VARCHAR(10),
    rad_tbpsychovie_ep12_hosp TEXT CHECK (rad_tbpsychovie_ep12_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep12_hospduree VARCHAR(10),
    
    -- Episode 13
    rad_tbpsychovie_ep13_type TEXT,
    tbpsychovie_ep13_debut VARCHAR(10),
    rad_tbpsychovie_ep13_hosp TEXT CHECK (rad_tbpsychovie_ep13_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep13_hospduree VARCHAR(10),
    
    -- Episode 14
    rad_tbpsychovie_ep14_type TEXT,
    tbpsychovie_ep14_debut VARCHAR(10),
    rad_tbpsychovie_ep14_hosp TEXT CHECK (rad_tbpsychovie_ep14_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep14_hospduree VARCHAR(10),
    
    -- Episode 15
    rad_tbpsychovie_ep15_type TEXT,
    tbpsychovie_ep15_debut VARCHAR(10),
    rad_tbpsychovie_ep15_hosp TEXT CHECK (rad_tbpsychovie_ep15_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep15_hospduree VARCHAR(10),
    
    -- Episode 16
    rad_tbpsychovie_ep16_type TEXT,
    tbpsychovie_ep16_debut VARCHAR(10),
    rad_tbpsychovie_ep16_hosp TEXT CHECK (rad_tbpsychovie_ep16_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep16_hospduree VARCHAR(10),
    
    -- Episode 17
    rad_tbpsychovie_ep17_type TEXT,
    tbpsychovie_ep17_debut VARCHAR(10),
    rad_tbpsychovie_ep17_hosp TEXT CHECK (rad_tbpsychovie_ep17_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep17_hospduree VARCHAR(10),
    
    -- Episode 18
    rad_tbpsychovie_ep18_type TEXT,
    tbpsychovie_ep18_debut VARCHAR(10),
    rad_tbpsychovie_ep18_hosp TEXT CHECK (rad_tbpsychovie_ep18_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep18_hospduree VARCHAR(10),
    
    -- Episode 19
    rad_tbpsychovie_ep19_type TEXT,
    tbpsychovie_ep19_debut VARCHAR(10),
    rad_tbpsychovie_ep19_hosp TEXT CHECK (rad_tbpsychovie_ep19_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep19_hospduree VARCHAR(10),
    
    -- Episode 20
    rad_tbpsychovie_ep20_type TEXT,
    tbpsychovie_ep20_debut VARCHAR(10),
    rad_tbpsychovie_ep20_hosp TEXT CHECK (rad_tbpsychovie_ep20_hosp IN ('Oui', 'Non', 'Ne sais pas')),
    tbpsychovie_ep20_hospduree VARCHAR(10),

    -- =====================================================
    -- SECTION 4: SYMPTOMES VIE ENTIERE
    -- =====================================================
    
    -- DELUSIONS (11 symptoms)
    -- Persecutory delusion
    rad_symptomesvie_persecution TEXT CHECK (rad_symptomesvie_persecution IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_persecution_mois TEXT CHECK (rad_symptomesvie_persecution_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Grandiose delusion
    rad_symptomesvie_grandeur TEXT CHECK (rad_symptomesvie_grandeur IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_grandeur_mois TEXT CHECK (rad_symptomesvie_grandeur_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Somatic delusion
    rad_symptomesvie_somatique TEXT CHECK (rad_symptomesvie_somatique IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_somatique_mois TEXT CHECK (rad_symptomesvie_somatique_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Religious/mystical delusion
    rad_symptomesvie_mystique TEXT CHECK (rad_symptomesvie_mystique IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_mystique_mois TEXT CHECK (rad_symptomesvie_mystique_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Delusion of guilt
    rad_symptomesvie_culpabilite TEXT CHECK (rad_symptomesvie_culpabilite IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_culpabilite_mois TEXT CHECK (rad_symptomesvie_culpabilite_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Delusion of jealousy
    rad_symptomesvie_jalousie TEXT CHECK (rad_symptomesvie_jalousie IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_jalousie_mois TEXT CHECK (rad_symptomesvie_jalousie_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Erotomanic delusion
    rad_symptomesvie_erotomaniaque TEXT CHECK (rad_symptomesvie_erotomaniaque IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_erotomaniaque_mois TEXT CHECK (rad_symptomesvie_erotomaniaque_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Delusion of control
    rad_symptomesvie_etrecontrole TEXT CHECK (rad_symptomesvie_etrecontrole IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_etrecontrole_mois TEXT CHECK (rad_symptomesvie_etrecontrole_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Thought withdrawal delusion
    rad_symptomesvie_volpensee TEXT CHECK (rad_symptomesvie_volpensee IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_volpensee_mois TEXT CHECK (rad_symptomesvie_volpensee_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Bizarre delusion
    rad_symptomesvie_bizarre TEXT CHECK (rad_symptomesvie_bizarre IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_bizarre_mois TEXT CHECK (rad_symptomesvie_bizarre_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Ideas of reference
    rad_symptomesvie_idreferences TEXT CHECK (rad_symptomesvie_idreferences IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_idreferences_mois TEXT CHECK (rad_symptomesvie_idreferences_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- HALLUCINATIONS (4 symptoms)
    -- Intrapsychic auditory hallucinations
    rad_symptomesvie_halluintrapsy TEXT CHECK (rad_symptomesvie_halluintrapsy IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_halluintrapsy_mois TEXT CHECK (rad_symptomesvie_halluintrapsy_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Sensory auditory hallucinations
    rad_symptomesvie_hallusenso TEXT CHECK (rad_symptomesvie_hallusenso IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_hallusenso_mois TEXT CHECK (rad_symptomesvie_hallusenso_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Visual hallucinations
    rad_symptomesvie_halluvisu TEXT CHECK (rad_symptomesvie_halluvisu IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_halluvisu_mois TEXT CHECK (rad_symptomesvie_halluvisu_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Cenesthetic hallucinations
    rad_symptomesvie_hallucenesthe TEXT CHECK (rad_symptomesvie_hallucenesthe IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_hallucenesthe_mois TEXT CHECK (rad_symptomesvie_hallucenesthe_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- DISORGANIZATION SYMPTOMS (4 symptoms)
    -- Catatonia
    rad_symptomesvie_catatonie TEXT CHECK (rad_symptomesvie_catatonie IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_catatonie_mois TEXT CHECK (rad_symptomesvie_catatonie_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Disorganized behavior
    rad_symptomesvie_compodesorg TEXT CHECK (rad_symptomesvie_compodesorg IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_compodesorg_mois TEXT CHECK (rad_symptomesvie_compodesorg_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Discordant gestures
    rad_symptomesvie_gestdiscord TEXT CHECK (rad_symptomesvie_gestdiscord IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_gestdiscord_mois TEXT CHECK (rad_symptomesvie_gestdiscord_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Disorganized speech
    rad_symptomesvie_discdesorg TEXT CHECK (rad_symptomesvie_discdesorg IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_discdesorg_mois TEXT CHECK (rad_symptomesvie_discdesorg_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- NEGATIVE SYMPTOMS (3 symptoms)
    -- Avolition
    rad_symptomesvie_avolition TEXT CHECK (rad_symptomesvie_avolition IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_avolition_mois TEXT CHECK (rad_symptomesvie_avolition_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Alogia
    rad_symptomesvie_alogie TEXT CHECK (rad_symptomesvie_alogie IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_alogie_mois TEXT CHECK (rad_symptomesvie_alogie_mois IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Affective flattening
    rad_symptomesvie_emousaffec TEXT CHECK (rad_symptomesvie_emousaffec IN ('Oui', 'Non', 'Ne sais pas')),
    rad_symptomesvie_emousaffec_mois TEXT CHECK (rad_symptomesvie_emousaffec_mois IN ('Oui', 'Non', 'Ne sais pas')),

    -- =====================================================
    -- SECTION 5: MODE EVOLUTIF DE LA SYMPTOMATOLOGIE
    -- =====================================================
    rad_symptomeevo_mode TEXT,

    -- =====================================================
    -- SECTION 6: CARACTERISTIQUES DU TROUBLE - 12 DERNIERS MOIS
    -- =====================================================
    
    -- Presence of psychotic episode during the year
    rad_tbpsychoan TEXT CHECK (rad_tbpsychoan IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Full-time hospitalizations
    rad_tbpsychoan_hospi_tpscomplet TEXT CHECK (rad_tbpsychoan_hospi_tpscomplet IN ('Oui', 'Non', 'Ne sais pas')),
    rad_tbpsychoan_hospi_tpscomplet_nb TEXT,
    rad_tbpsychoan_hospi_tpscomplet_duree TEXT,
    rad_tbpsychoan_hospi_tpscomplet_motif TEXT,

    -- =====================================================
    -- SECTION 7: PRISE EN CHARGE NON MEDICAMENTEUSE
    -- =====================================================
    rad_tbpsychoan_modpec_nonmed TEXT CHECK (rad_tbpsychoan_modpec_nonmed IN ('Oui', 'Non', 'Ne sais pas')),
    chk_tbpsychoan_modpec_nonmed_tcc TEXT[], -- SET stored as array
    chk_tbpsychoan_modpec_nonmed_remed TEXT[],
    chk_tbpsychoan_modpec_nonmed_psychody TEXT[],
    chk_tbpsychoan_modpec_nonmed_fam TEXT[],
    tbpsychoan_modpec_nonmed_autre VARCHAR(50),

    -- =====================================================
    -- SECTION 8: AIDE A LA PRISE DE TRAITEMENT
    -- =====================================================
    chk_aide_prise_tt TEXT[], -- SET stored as array
    rad_aide_prise_tt_hospi TEXT CHECK (rad_aide_prise_tt_hospi IN ('Quotidienne', 'Hebdomadaire', 'Bimensuelle', 'Mensuelle')),

    -- =====================================================
    -- SECTION 9: TENTATIVES DE SUICIDE
    -- =====================================================
    rad_tbpsychoan_ts TEXT CHECK (rad_tbpsychoan_ts IN ('Oui', 'Non', 'Ne sais pas')),
    rad_tbpsychoan_ts_nb TEXT,

    -- =====================================================
    -- METADATA
    -- =====================================================
    completed_by UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_troubles_psychotiques ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients view own troubles psychotiques" ON responses_troubles_psychotiques
    FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own troubles psychotiques" ON responses_troubles_psychotiques
    FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own troubles psychotiques" ON responses_troubles_psychotiques
    FOR UPDATE USING (auth.uid() = patient_id);

-- Professional policies
CREATE POLICY "Professionals view all troubles psychotiques" ON responses_troubles_psychotiques
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert troubles psychotiques" ON responses_troubles_psychotiques
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update troubles psychotiques" ON responses_troubles_psychotiques
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- Index for faster lookups
CREATE INDEX idx_troubles_psychotiques_visit_id ON responses_troubles_psychotiques(visit_id);
CREATE INDEX idx_troubles_psychotiques_patient_id ON responses_troubles_psychotiques(patient_id);
