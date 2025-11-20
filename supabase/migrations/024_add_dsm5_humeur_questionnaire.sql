-- eFondaMental Platform - DSM5 Mood Disorders Questionnaire Migration
-- DSM5 Troubles de l'humeur for bipolar disorder initial evaluation

-- ============================================================================
-- Create DSM5 Mood Disorders Table
-- ============================================================================

CREATE TABLE responses_dsm5_humeur (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- ========================================================================
    -- SECTION 1: Mood Disorder Presence and Type
    -- ========================================================================
    
    -- 1. Has mood disorder?
    has_mood_disorder VARCHAR(20) CHECK (has_mood_disorder IN ('oui', 'non', 'ne_sais_pas')),
    
    -- 2. Type of disorder
    disorder_type VARCHAR(50) CHECK (disorder_type IN (
        'bipolaire_type_1',
        'bipolaire_type_2',
        'bipolaire_non_specifie',
        'trouble_depressif_majeur_isole',
        'trouble_depressif_majeur_recurrent',
        'trouble_dysthymique_precoce',
        'trouble_dysthymique_tardif'
    )),
    
    -- 3. Mood disorder due to general medical condition
    medical_condition_affection_type VARCHAR(50) CHECK (medical_condition_affection_type IN (
        'endocrinienne',
        'neurologique',
        'cardio_vasculaire',
        'autre'
    )),
    medical_condition_affection_autre TEXT,
    medical_condition_trouble_type VARCHAR(50) CHECK (medical_condition_trouble_type IN (
        'episode_allure_depression_majeure',
        'episode_caracteristiques_depressives',
        'episode_caracteristiques_maniaques',
        'episode_caracteristiques_mixtes',
        'ne_sais_pas'
    )),
    
    -- 4. Substance-induced mood disorder
    substance_type VARCHAR(50) CHECK (substance_type IN (
        'alcool',
        'cannabis',
        'opiaces',
        'cocaine',
        'hallucinogene',
        'drogues_multiples',
        'sedatif_hypnotique',
        'stimulants',
        'anxiolytique',
        'antidepresseurs',
        'corticoides',
        'interferon',
        'antipaludeen',
        'autre'
    )),
    substance_autre TEXT,
    substance_trouble_type VARCHAR(50) CHECK (substance_trouble_type IN (
        'episode_allure_depression_majeure',
        'episode_caracteristiques_depressives',
        'episode_caracteristiques_maniaques',
        'episode_caracteristiques_mixtes',
        'ne_sais_pas'
    )),
    
    -- 5. Unspecified depressive disorder (7 sub-options)
    unspecified_depression_post_schizophrenie BOOLEAN,
    unspecified_depression_majeur_surajout BOOLEAN,
    unspecified_depression_dysphorique_premenstruel BOOLEAN,
    unspecified_depression_mineur BOOLEAN,
    unspecified_depression_bref_recurrent BOOLEAN,
    unspecified_depression_autre BOOLEAN,
    unspecified_depression_ne_sais_pas BOOLEAN,
    
    -- 6. Cyclothymic disorder
    cyclothymic BOOLEAN,
    
    -- 7. Other (specify)
    other_specify TEXT,
    
    -- ========================================================================
    -- SECTION 2: First Episode Characteristics
    -- ========================================================================
    
    first_episode_type VARCHAR(50) CHECK (first_episode_type IN (
        'edm_sans_psychotiques',
        'edm_avec_psychotiques',
        'hypomanie',
        'manie_sans_psychotiques',
        'manie_avec_psychotiques',
        'ne_sais_pas'
    )),
    postpartum_first VARCHAR(20) CHECK (postpartum_first IN ('oui', 'non', 'ne_sais_pas')),
    initial_cyclothymic_period VARCHAR(20) CHECK (initial_cyclothymic_period IN ('oui', 'non', 'ne_sais_pas')),
    
    -- ========================================================================
    -- SECTION 3: Lifetime Characteristics
    -- ========================================================================
    
    -- 3.1 Major depressive episodes
    num_edm INTEGER CHECK (num_edm >= 0),
    age_first_edm INTEGER CHECK (age_first_edm > 0),
    edm_with_psychotic VARCHAR(20) CHECK (edm_with_psychotic IN ('oui', 'non', 'ne_sais_pas')),
    num_edm_psychotic INTEGER CHECK (num_edm_psychotic >= 0),
    edm_with_mixed VARCHAR(20) CHECK (edm_with_mixed IN ('oui', 'non', 'ne_sais_pas')),
    num_edm_mixed INTEGER CHECK (num_edm_mixed >= 0),
    
    -- 3.2 Hypomanic episodes
    num_hypomanic INTEGER CHECK (num_hypomanic >= 0),
    age_first_hypomanic INTEGER CHECK (age_first_hypomanic > 0),
    
    -- 3.3 Manic episodes
    num_manic INTEGER CHECK (num_manic >= 0),
    age_first_manic INTEGER CHECK (age_first_manic > 0),
    manic_with_psychotic VARCHAR(20) CHECK (manic_with_psychotic IN ('oui', 'non', 'ne_sais_pas')),
    num_manic_psychotic INTEGER CHECK (num_manic_psychotic >= 0),
    manic_with_mixed VARCHAR(20) CHECK (manic_with_mixed IN ('oui', 'non', 'ne_sais_pas')),
    num_manic_mixed INTEGER CHECK (num_manic_mixed >= 0),
    induced_episodes VARCHAR(20) CHECK (induced_episodes IN ('oui', 'non', 'ne_sais_pas')),
    num_induced_episodes INTEGER CHECK (num_induced_episodes >= 0),
    rapid_cycling VARCHAR(20) CHECK (rapid_cycling IN ('oui', 'non', 'ne_sais_pas')),
    complete_remission VARCHAR(20) CHECK (complete_remission IN ('oui', 'non', 'ne_sais_pas')),
    seasonal_pattern VARCHAR(20) CHECK (seasonal_pattern IN ('oui', 'non', 'ne_sais_pas')),
    seasonal_depression VARCHAR(20) CHECK (seasonal_depression IN ('oui', 'non', 'ne_sais_pas')),
    seasonal_hypomania VARCHAR(20) CHECK (seasonal_hypomania IN ('oui', 'non', 'ne_sais_pas')),
    seasonal_seasons TEXT,
    
    age_first_psychotrope INTEGER CHECK (age_first_psychotrope > 0),
    age_first_thymoregulator INTEGER CHECK (age_first_thymoregulator > 0),
    age_first_hospitalization INTEGER CHECK (age_first_hospitalization > 0),
    num_hospitalizations INTEGER CHECK (num_hospitalizations >= 0),
    total_hospitalization_months INTEGER CHECK (total_hospitalization_months >= 0),
    
    -- 3.4 12-month characteristics
    past_year_episode VARCHAR(20) CHECK (past_year_episode IN ('oui', 'non', 'ne_sais_pas')),
    past_year_num_edm INTEGER CHECK (past_year_num_edm >= 0),
    past_year_edm_psychotic VARCHAR(20) CHECK (past_year_edm_psychotic IN ('oui', 'non', 'ne_sais_pas')),
    past_year_num_edm_psychotic INTEGER CHECK (past_year_num_edm_psychotic >= 0),
    past_year_edm_mixed VARCHAR(20) CHECK (past_year_edm_mixed IN ('oui', 'non', 'ne_sais_pas')),
    past_year_num_edm_mixed INTEGER CHECK (past_year_num_edm_mixed >= 0),
    past_year_num_hypomanic INTEGER CHECK (past_year_num_hypomanic >= 0),
    past_year_num_manic INTEGER CHECK (past_year_num_manic >= 0),
    past_year_manic_psychotic VARCHAR(20) CHECK (past_year_manic_psychotic IN ('oui', 'non', 'ne_sais_pas')),
    past_year_num_manic_psychotic INTEGER CHECK (past_year_num_manic_psychotic >= 0),
    past_year_manic_mixed VARCHAR(20) CHECK (past_year_manic_mixed IN ('oui', 'non', 'ne_sais_pas')),
    past_year_num_manic_mixed INTEGER CHECK (past_year_num_manic_mixed >= 0),
    past_year_num_hospitalizations INTEGER CHECK (past_year_num_hospitalizations >= 0),
    past_year_hospitalization_weeks INTEGER CHECK (past_year_hospitalization_weeks >= 0),
    
    -- Work leave subsection
    past_year_work_leave VARCHAR(20) CHECK (past_year_work_leave IN ('oui', 'non', 'non_applicable')),
    past_year_num_work_leaves VARCHAR(20),
    past_year_work_leave_weeks INTEGER CHECK (past_year_work_leave_weeks >= 0),
    
    -- ========================================================================
    -- SECTION 4: Most Recent Episode
    -- ========================================================================
    
    recent_episode_start_date DATE,
    recent_episode_end_date DATE,
    recent_episode_type VARCHAR(50) CHECK (recent_episode_type IN (
        'edm',
        'hypomanie',
        'manie',
        'non_specifie',
        'ne_sais_pas'
    )),
    
    -- EDM specific fields
    recent_edm_subtype VARCHAR(50) CHECK (recent_edm_subtype IN (
        'sans_caracteristique',
        'melancolique',
        'atypique',
        'catatonique',
        'mixte'
    )),
    recent_edm_severity VARCHAR(50) CHECK (recent_edm_severity IN (
        'leger',
        'modere',
        'severe_sans_psychotiques',
        'severe_psychotiques_non_congruentes',
        'severe_psychotiques_congruentes'
    )),
    recent_edm_chronic VARCHAR(20) CHECK (recent_edm_chronic IN ('oui', 'non', 'ne_sais_pas')),
    recent_edm_postpartum VARCHAR(20) CHECK (recent_edm_postpartum IN ('oui', 'non', 'ne_sais_pas')),
    
    -- Hypomanie specific fields
    recent_hypomanie_postpartum VARCHAR(20) CHECK (recent_hypomanie_postpartum IN ('oui', 'non', 'ne_sais_pas')),
    
    -- Manie specific fields
    recent_manie_catatonic VARCHAR(20) CHECK (recent_manie_catatonic IN ('oui', 'non', 'ne_sais_pas')),
    recent_manie_mixed VARCHAR(20) CHECK (recent_manie_mixed IN ('oui', 'non', 'ne_sais_pas')),
    recent_manie_severity VARCHAR(50) CHECK (recent_manie_severity IN (
        'leger',
        'modere',
        'severe_sans_psychotiques',
        'severe_psychotiques_non_congruentes',
        'severe_psychotiques_congruentes'
    )),
    recent_manie_postpartum VARCHAR(20) CHECK (recent_manie_postpartum IN ('oui', 'non', 'ne_sais_pas')),
    
    -- Non-specified episode fields
    recent_non_specifie_catatonic VARCHAR(20) CHECK (recent_non_specifie_catatonic IN ('oui', 'non', 'ne_sais_pas')),
    recent_non_specifie_severity VARCHAR(50) CHECK (recent_non_specifie_severity IN (
        'leger',
        'modere',
        'severe_sans_psychotiques',
        'severe_psychotiques_non_congruentes',
        'severe_psychotiques_congruentes'
    )),
    recent_non_specifie_postpartum VARCHAR(20) CHECK (recent_non_specifie_postpartum IN ('oui', 'non', 'ne_sais_pas')),
    
    -- ========================================================================
    -- SECTION 5: Current Episode
    -- ========================================================================
    
    current_episode_present VARCHAR(20) CHECK (current_episode_present IN ('oui', 'non', 'ne_sais_pas')),
    current_episode_type VARCHAR(50) CHECK (current_episode_type IN (
        'edm',
        'hypomanie',
        'manie',
        'non_specifie',
        'ne_sais_pas'
    )),
    
    -- EDM specific fields
    current_edm_subtype VARCHAR(50) CHECK (current_edm_subtype IN (
        'sans_caracteristique',
        'melancolique',
        'atypique',
        'catatonique',
        'mixte'
    )),
    current_edm_severity VARCHAR(50) CHECK (current_edm_severity IN (
        'leger',
        'modere',
        'severe_sans_psychotiques',
        'severe_psychotiques_non_congruentes',
        'severe_psychotiques_congruentes'
    )),
    current_edm_chronic VARCHAR(20) CHECK (current_edm_chronic IN ('oui', 'non', 'ne_sais_pas')),
    current_edm_postpartum VARCHAR(20) CHECK (current_edm_postpartum IN ('oui', 'non', 'ne_sais_pas')),
    
    -- Hypomanie specific fields
    current_hypomanie_postpartum VARCHAR(20) CHECK (current_hypomanie_postpartum IN ('oui', 'non', 'ne_sais_pas')),
    
    -- Manie specific fields
    current_manie_catatonic VARCHAR(20) CHECK (current_manie_catatonic IN ('oui', 'non', 'ne_sais_pas')),
    current_manie_mixed VARCHAR(20) CHECK (current_manie_mixed IN ('oui', 'non', 'ne_sais_pas')),
    current_manie_severity VARCHAR(50) CHECK (current_manie_severity IN (
        'leger',
        'modere',
        'severe_sans_psychotiques',
        'severe_psychotiques_non_congruentes',
        'severe_psychotiques_congruentes'
    )),
    current_manie_postpartum VARCHAR(20) CHECK (current_manie_postpartum IN ('oui', 'non', 'ne_sais_pas')),
    
    -- Non-specified episode fields
    current_non_specifie_catatonic VARCHAR(20) CHECK (current_non_specifie_catatonic IN ('oui', 'non', 'ne_sais_pas')),
    current_non_specifie_severity VARCHAR(50) CHECK (current_non_specifie_severity IN (
        'leger',
        'modere',
        'severe_sans_psychotiques',
        'severe_psychotiques_non_congruentes',
        'severe_psychotiques_congruentes'
    )),
    current_non_specifie_postpartum VARCHAR(20) CHECK (current_non_specifie_postpartum IN ('oui', 'non', 'ne_sais_pas')),
    
    -- ========================================================================
    -- Metadata
    -- ========================================================================
    
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_dsm5_humeur ENABLE ROW LEVEL SECURITY;

-- Healthcare professionals can view DSM5 responses
CREATE POLICY "Healthcare professionals can view DSM5 responses"
    ON responses_dsm5_humeur FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- Healthcare professionals can insert DSM5 responses
CREATE POLICY "Healthcare professionals can insert DSM5 responses"
    ON responses_dsm5_humeur FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Healthcare professionals can update DSM5 responses
CREATE POLICY "Healthcare professionals can update DSM5 responses"
    ON responses_dsm5_humeur FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Patients can view their own DSM5 responses
CREATE POLICY "Patients can view own DSM5 responses"
    ON responses_dsm5_humeur FOR SELECT
    USING (auth.uid() = patient_id);

-- ============================================================================
-- Update trigger
-- ============================================================================

CREATE TRIGGER update_responses_dsm5_humeur_updated_at BEFORE UPDATE ON responses_dsm5_humeur
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

