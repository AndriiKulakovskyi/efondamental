-- eFondaMental Platform - DSM5 Comorbid Disorders Questionnaire Migration
-- DSM5 Troubles comorbides for bipolar disorder initial evaluation

-- ============================================================================
-- Create DSM5 Comorbid Disorders Table
-- ============================================================================

CREATE TABLE responses_dsm5_comorbid (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- ========================================================================
    -- SECTION 1: ANXIETY DISORDERS
    -- ========================================================================
    
    has_anxiety_disorder VARCHAR(20) CHECK (has_anxiety_disorder IN ('oui', 'non', 'ne_sais_pas')),
    
    -- 1.2.1 Panic disorder without agoraphobia
    panic_no_agoraphobia_present VARCHAR(20) CHECK (panic_no_agoraphobia_present IN ('oui', 'non', 'ne_sais_pas')),
    panic_no_agoraphobia_age_debut INTEGER CHECK (panic_no_agoraphobia_age_debut BETWEEN 0 AND 120),
    panic_no_agoraphobia_symptoms_past_month VARCHAR(20) CHECK (panic_no_agoraphobia_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    
    -- 1.2.2 Panic disorder with agoraphobia
    panic_with_agoraphobia_present VARCHAR(20) CHECK (panic_with_agoraphobia_present IN ('oui', 'non', 'ne_sais_pas')),
    panic_with_agoraphobia_age_debut INTEGER CHECK (panic_with_agoraphobia_age_debut BETWEEN 0 AND 120),
    panic_with_agoraphobia_symptoms_past_month VARCHAR(20) CHECK (panic_with_agoraphobia_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    
    -- 1.2.3 Agoraphobia without panic
    agoraphobia_no_panic_present VARCHAR(20) CHECK (agoraphobia_no_panic_present IN ('oui', 'non', 'ne_sais_pas')),
    agoraphobia_no_panic_age_debut INTEGER CHECK (agoraphobia_no_panic_age_debut BETWEEN 0 AND 120),
    agoraphobia_no_panic_symptoms_past_month VARCHAR(20) CHECK (agoraphobia_no_panic_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    
    -- 1.2.4 Social phobia
    social_phobia_present VARCHAR(20) CHECK (social_phobia_present IN ('oui', 'non', 'ne_sais_pas')),
    social_phobia_age_debut INTEGER CHECK (social_phobia_age_debut BETWEEN 0 AND 120),
    social_phobia_symptoms_past_month VARCHAR(20) CHECK (social_phobia_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    
    -- 1.2.5 Specific phobia
    specific_phobia_present VARCHAR(20) CHECK (specific_phobia_present IN ('oui', 'non', 'ne_sais_pas')),
    specific_phobia_age_debut INTEGER CHECK (specific_phobia_age_debut BETWEEN 0 AND 120),
    specific_phobia_symptoms_past_month VARCHAR(20) CHECK (specific_phobia_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    
    -- 1.2.6 OCD
    ocd_present VARCHAR(20) CHECK (ocd_present IN ('oui', 'non', 'ne_sais_pas')),
    ocd_age_debut INTEGER CHECK (ocd_age_debut BETWEEN 0 AND 120),
    ocd_symptoms_past_month VARCHAR(20) CHECK (ocd_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    
    -- 1.2.7 PTSD
    ptsd_present VARCHAR(20) CHECK (ptsd_present IN ('oui', 'non', 'ne_sais_pas')),
    ptsd_age_debut INTEGER CHECK (ptsd_age_debut BETWEEN 0 AND 120),
    ptsd_symptoms_past_month VARCHAR(20) CHECK (ptsd_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    
    -- 1.2.8 Generalized anxiety (current episode only)
    gad_present VARCHAR(20) CHECK (gad_present IN ('oui', 'non', 'ne_sais_pas')),
    gad_age_debut INTEGER CHECK (gad_age_debut BETWEEN 0 AND 120),
    gad_symptoms_past_month VARCHAR(20) CHECK (gad_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    
    -- 1.3 Anxiety due to medical condition
    anxiety_medical_condition_present VARCHAR(20) CHECK (anxiety_medical_condition_present IN ('oui', 'non', 'ne_sais_pas')),
    anxiety_medical_condition_affection TEXT,
    anxiety_medical_condition_age_debut INTEGER CHECK (anxiety_medical_condition_age_debut BETWEEN 0 AND 120),
    anxiety_medical_condition_symptoms_past_month VARCHAR(20) CHECK (anxiety_medical_condition_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    
    -- 1.4 Substance-induced anxiety
    anxiety_substance_induced_present VARCHAR(20) CHECK (anxiety_substance_induced_present IN ('oui', 'non', 'ne_sais_pas')),
    anxiety_substance_induced_substance TEXT,
    anxiety_substance_induced_age_debut INTEGER CHECK (anxiety_substance_induced_age_debut BETWEEN 0 AND 120),
    anxiety_substance_induced_symptoms_past_month VARCHAR(20) CHECK (anxiety_substance_induced_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    
    -- 1.5 Unspecified anxiety
    anxiety_unspecified_present VARCHAR(20) CHECK (anxiety_unspecified_present IN ('oui', 'non', 'ne_sais_pas')),
    anxiety_unspecified_age_debut INTEGER CHECK (anxiety_unspecified_age_debut BETWEEN 0 AND 120),
    anxiety_unspecified_symptoms_past_month VARCHAR(20) CHECK (anxiety_unspecified_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    
    -- ========================================================================
    -- SECTION 2: SUBSTANCE-RELATED DISORDERS (LIFETIME)
    -- ========================================================================
    
    has_substance_disorder VARCHAR(20) CHECK (has_substance_disorder IN ('oui', 'non', 'ne_sais_pas')),
    
    -- Alcohol
    alcohol_present VARCHAR(20) CHECK (alcohol_present IN ('oui', 'non', 'ne_sais_pas')),
    alcohol_type VARCHAR(20) CHECK (alcohol_type IN ('abus', 'dependance')),
    alcohol_age_debut INTEGER CHECK (alcohol_age_debut BETWEEN 0 AND 120),
    alcohol_symptoms_past_month VARCHAR(20) CHECK (alcohol_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    alcohol_duration_months INTEGER CHECK (alcohol_duration_months BETWEEN 0 AND 2000),
    
    -- Sedatives/Hypnotics/Anxiolytics
    sedatives_present VARCHAR(20) CHECK (sedatives_present IN ('oui', 'non', 'ne_sais_pas')),
    sedatives_type VARCHAR(20) CHECK (sedatives_type IN ('abus', 'dependance')),
    sedatives_age_debut INTEGER CHECK (sedatives_age_debut BETWEEN 0 AND 120),
    sedatives_symptoms_past_month VARCHAR(20) CHECK (sedatives_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    sedatives_duration_months INTEGER CHECK (sedatives_duration_months BETWEEN 0 AND 2000),
    
    -- Cannabis
    cannabis_present VARCHAR(20) CHECK (cannabis_present IN ('oui', 'non', 'ne_sais_pas')),
    cannabis_type VARCHAR(20) CHECK (cannabis_type IN ('abus', 'dependance')),
    cannabis_age_debut INTEGER CHECK (cannabis_age_debut BETWEEN 0 AND 120),
    cannabis_symptoms_past_month VARCHAR(20) CHECK (cannabis_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    cannabis_duration_months INTEGER CHECK (cannabis_duration_months BETWEEN 0 AND 2000),
    
    -- Stimulants
    stimulants_present VARCHAR(20) CHECK (stimulants_present IN ('oui', 'non', 'ne_sais_pas')),
    stimulants_type VARCHAR(20) CHECK (stimulants_type IN ('abus', 'dependance')),
    stimulants_age_debut INTEGER CHECK (stimulants_age_debut BETWEEN 0 AND 120),
    stimulants_symptoms_past_month VARCHAR(20) CHECK (stimulants_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    stimulants_duration_months INTEGER CHECK (stimulants_duration_months BETWEEN 0 AND 2000),
    
    -- Opiates
    opiates_present VARCHAR(20) CHECK (opiates_present IN ('oui', 'non', 'ne_sais_pas')),
    opiates_type VARCHAR(20) CHECK (opiates_type IN ('abus', 'dependance')),
    opiates_age_debut INTEGER CHECK (opiates_age_debut BETWEEN 0 AND 120),
    opiates_symptoms_past_month VARCHAR(20) CHECK (opiates_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    opiates_duration_months INTEGER CHECK (opiates_duration_months BETWEEN 0 AND 2000),
    
    -- Cocaine
    cocaine_present VARCHAR(20) CHECK (cocaine_present IN ('oui', 'non', 'ne_sais_pas')),
    cocaine_type VARCHAR(20) CHECK (cocaine_type IN ('abus', 'dependance')),
    cocaine_age_debut INTEGER CHECK (cocaine_age_debut BETWEEN 0 AND 120),
    cocaine_symptoms_past_month VARCHAR(20) CHECK (cocaine_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    cocaine_duration_months INTEGER CHECK (cocaine_duration_months BETWEEN 0 AND 2000),
    
    -- Hallucinogens/PCP
    hallucinogens_present VARCHAR(20) CHECK (hallucinogens_present IN ('oui', 'non', 'ne_sais_pas')),
    hallucinogens_type VARCHAR(20) CHECK (hallucinogens_type IN ('abus', 'dependance')),
    hallucinogens_age_debut INTEGER CHECK (hallucinogens_age_debut BETWEEN 0 AND 120),
    hallucinogens_symptoms_past_month VARCHAR(20) CHECK (hallucinogens_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    hallucinogens_duration_months INTEGER CHECK (hallucinogens_duration_months BETWEEN 0 AND 2000),
    
    -- Other substance
    other_substance_present VARCHAR(20) CHECK (other_substance_present IN ('oui', 'non', 'ne_sais_pas')),
    other_substance_name TEXT,
    other_substance_type VARCHAR(20) CHECK (other_substance_type IN ('abus', 'dependance')),
    other_substance_age_debut INTEGER CHECK (other_substance_age_debut BETWEEN 0 AND 120),
    other_substance_symptoms_past_month VARCHAR(20) CHECK (other_substance_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    other_substance_duration_months INTEGER CHECK (other_substance_duration_months BETWEEN 0 AND 2000),
    
    -- 2.3 Induced disorder (without abuse/dependence)
    induced_disorder_present VARCHAR(20) CHECK (induced_disorder_present IN ('oui', 'non', 'ne_sais_pas')),
    induced_substances TEXT[], -- Array of substance names
    induced_disorder_type VARCHAR(50) CHECK (induced_disorder_type IN (
        'delirium',
        'demence_persistante',
        'trouble_amnesique',
        'trouble_psychotique',
        'trouble_humeur',
        'trouble_anxieux',
        'trouble_sommeil',
        'trouble_perceptions_hallucinogenes'
    )),
    induced_symptoms_past_month VARCHAR(20) CHECK (induced_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    
    -- ========================================================================
    -- SECTION 3: EATING DISORDERS (CURRENT)
    -- ========================================================================
    
    has_eating_disorder VARCHAR(20) CHECK (has_eating_disorder IN ('oui', 'non', 'ne_sais_pas')),
    
    -- 3.2.1 Anorexia restrictive type
    anorexia_restrictive_amenorrhea BOOLEAN,
    anorexia_restrictive_age_debut INTEGER CHECK (anorexia_restrictive_age_debut BETWEEN 0 AND 120),
    anorexia_restrictive_age_fin INTEGER CHECK (anorexia_restrictive_age_fin BETWEEN 0 AND 120),
    anorexia_restrictive_symptoms_past_month VARCHAR(20) CHECK (anorexia_restrictive_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    anorexia_restrictive_current BOOLEAN,
    
    -- 3.2.2 Anorexia bulimic type
    anorexia_bulimic_amenorrhea BOOLEAN,
    anorexia_bulimic_age_debut INTEGER CHECK (anorexia_bulimic_age_debut BETWEEN 0 AND 120),
    anorexia_bulimic_age_fin INTEGER CHECK (anorexia_bulimic_age_fin BETWEEN 0 AND 120),
    anorexia_bulimic_symptoms_past_month VARCHAR(20) CHECK (anorexia_bulimic_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    anorexia_bulimic_current BOOLEAN,
    
    -- 3.2.3 Bulimia alone
    bulimia_age_debut INTEGER CHECK (bulimia_age_debut BETWEEN 0 AND 120),
    bulimia_age_fin INTEGER CHECK (bulimia_age_fin BETWEEN 0 AND 120),
    bulimia_symptoms_past_month VARCHAR(20) CHECK (bulimia_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    bulimia_current BOOLEAN,
    
    -- 3.2.4 Binge eating disorder
    binge_eating_age_debut INTEGER CHECK (binge_eating_age_debut BETWEEN 0 AND 120),
    binge_eating_age_fin INTEGER CHECK (binge_eating_age_fin BETWEEN 0 AND 120),
    binge_eating_symptoms_past_month VARCHAR(20) CHECK (binge_eating_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    binge_eating_current BOOLEAN,
    
    -- 3.2.5 Unspecified eating disorder
    eating_unspecified_age_debut INTEGER CHECK (eating_unspecified_age_debut BETWEEN 0 AND 120),
    eating_unspecified_age_fin INTEGER CHECK (eating_unspecified_age_fin BETWEEN 0 AND 120),
    eating_unspecified_symptoms_past_month VARCHAR(20) CHECK (eating_unspecified_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    eating_unspecified_current BOOLEAN,
    
    -- 3.2.6 Night eating syndrome
    night_eating_age_debut INTEGER CHECK (night_eating_age_debut BETWEEN 0 AND 120),
    night_eating_age_fin INTEGER CHECK (night_eating_age_fin BETWEEN 0 AND 120),
    night_eating_symptoms_past_month VARCHAR(20) CHECK (night_eating_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    night_eating_current BOOLEAN,
    
    -- ========================================================================
    -- SECTION 4: SOMATOFORM DISORDER
    -- ========================================================================
    
    has_somatoform_disorder VARCHAR(20) CHECK (has_somatoform_disorder IN ('oui', 'non', 'ne_sais_pas')),
    somatoform_type VARCHAR(50) CHECK (somatoform_type IN (
        'trouble_somatisation',
        'trouble_douloureux',
        'trouble_indifferencie',
        'hypocondrie',
        'peur_dysmorphie_corporelle'
    )),
    somatoform_age_debut INTEGER CHECK (somatoform_age_debut BETWEEN 0 AND 120),
    somatoform_symptoms_past_month VARCHAR(20) CHECK (somatoform_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    
    -- ========================================================================
    -- SECTION 5: ADHD DIVA ASSESSMENT
    -- ========================================================================
    
    diva_evaluated VARCHAR(20) CHECK (diva_evaluated IN ('oui', 'non', 'ne_sais_pas')),
    
    -- 5.2.1 Inattention symptoms (A1a-A1i)
    diva_a1a_adult BOOLEAN,
    diva_a1a_childhood BOOLEAN,
    diva_a1b_adult BOOLEAN,
    diva_a1b_childhood BOOLEAN,
    diva_a1c_adult BOOLEAN,
    diva_a1c_childhood BOOLEAN,
    diva_a1d_adult BOOLEAN,
    diva_a1d_childhood BOOLEAN,
    diva_a1e_adult BOOLEAN,
    diva_a1e_childhood BOOLEAN,
    diva_a1f_adult BOOLEAN,
    diva_a1f_childhood BOOLEAN,
    diva_a1g_adult BOOLEAN,
    diva_a1g_childhood BOOLEAN,
    diva_a1h_adult BOOLEAN,
    diva_a1h_childhood BOOLEAN,
    diva_a1i_adult BOOLEAN,
    diva_a1i_childhood BOOLEAN,
    
    -- 5.2.2 Hyperactivity/Impulsivity symptoms (A2a-A2i)
    diva_a2a_adult BOOLEAN,
    diva_a2a_childhood BOOLEAN,
    diva_a2b_adult BOOLEAN,
    diva_a2b_childhood BOOLEAN,
    diva_a2c_adult BOOLEAN,
    diva_a2c_childhood BOOLEAN,
    diva_a2d_adult BOOLEAN,
    diva_a2d_childhood BOOLEAN,
    diva_a2e_adult BOOLEAN,
    diva_a2e_childhood BOOLEAN,
    diva_a2f_adult BOOLEAN,
    diva_a2f_childhood BOOLEAN,
    diva_a2g_adult BOOLEAN,
    diva_a2g_childhood BOOLEAN,
    diva_a2h_adult BOOLEAN,
    diva_a2h_childhood BOOLEAN,
    diva_a2i_adult BOOLEAN,
    diva_a2i_childhood BOOLEAN,
    
    -- 5.3 Totals
    diva_total_inattention_adult INTEGER CHECK (diva_total_inattention_adult BETWEEN 0 AND 9),
    diva_total_inattention_childhood INTEGER CHECK (diva_total_inattention_childhood BETWEEN 0 AND 9),
    diva_total_hyperactivity_adult INTEGER CHECK (diva_total_hyperactivity_adult BETWEEN 0 AND 9),
    diva_total_hyperactivity_childhood INTEGER CHECK (diva_total_hyperactivity_childhood BETWEEN 0 AND 9),
    
    -- 5.4 DSM-IV Criteria
    diva_criteria_a_inattention_gte6 BOOLEAN,
    diva_criteria_a_hyperactivity_gte6 BOOLEAN,
    diva_criteria_b_lifetime_persistence BOOLEAN,
    diva_criteria_cd_impairment_childhood BOOLEAN,
    diva_criteria_cd_impairment_adult BOOLEAN,
    diva_criteria_e_better_explained BOOLEAN,
    diva_criteria_e_explanation TEXT,
    
    -- 5.5 Collateral information
    diva_collateral_parents INTEGER CHECK (diva_collateral_parents BETWEEN 0 AND 2),
    diva_collateral_partner INTEGER CHECK (diva_collateral_partner BETWEEN 0 AND 2),
    diva_collateral_school_reports INTEGER CHECK (diva_collateral_school_reports BETWEEN 0 AND 2),
    diva_collateral_details TEXT,
    
    -- 5.6 ADHD Diagnosis
    diva_diagnosis VARCHAR(50) CHECK (diva_diagnosis IN (
        'non',
        '314_01_combined',
        '314_00_inattentive',
        '314_01_hyperactive_impulsive'
    )),
    
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

ALTER TABLE responses_dsm5_comorbid ENABLE ROW LEVEL SECURITY;

-- Healthcare professionals can view DSM5 comorbid responses
CREATE POLICY "Healthcare professionals can view DSM5 comorbid responses"
    ON responses_dsm5_comorbid FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- Healthcare professionals can insert DSM5 comorbid responses
CREATE POLICY "Healthcare professionals can insert DSM5 comorbid responses"
    ON responses_dsm5_comorbid FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Healthcare professionals can update DSM5 comorbid responses
CREATE POLICY "Healthcare professionals can update DSM5 comorbid responses"
    ON responses_dsm5_comorbid FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Patients can view their own DSM5 comorbid responses
CREATE POLICY "Patients can view own DSM5 comorbid responses"
    ON responses_dsm5_comorbid FOR SELECT
    USING (auth.uid() = patient_id);

-- ============================================================================
-- Update trigger
-- ============================================================================

CREATE TRIGGER update_responses_dsm5_comorbid_updated_at BEFORE UPDATE ON responses_dsm5_comorbid
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

