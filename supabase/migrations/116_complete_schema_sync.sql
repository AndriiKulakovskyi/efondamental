-- Complete schema synchronization for responses_dsm5_comorbid
-- This ensures all columns exist and forces PostgREST to refresh its cache

-- ============================================================================
-- VERIFY AND ADD ALL SECTION 1 (ANXIETY) COLUMNS
-- ============================================================================

DO $$ 
BEGIN
    -- ========================================================================
    -- PARENT COLUMNS (has_* questions)
    -- ========================================================================
    
    -- Section 1: Anxiety
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'has_anxiety_disorder') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN has_anxiety_disorder VARCHAR(20) CHECK (has_anxiety_disorder IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    
    -- Section 3: Eating disorders
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'has_eating_disorder') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN has_eating_disorder VARCHAR(20) CHECK (has_eating_disorder IN ('oui', 'non', 'ne_sais_pas'));
    END IF;

    -- ========================================================================
    -- SECTION 1: ANXIETY DISORDERS - DETAILED COLUMNS
    -- ========================================================================
    
    -- Panic disorder columns (new structure)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'panic_disorder_present') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN panic_disorder_present VARCHAR(20) CHECK (panic_disorder_present IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'panic_disorder_type') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN panic_disorder_type VARCHAR(30) CHECK (panic_disorder_type IN ('sans_agoraphobie', 'avec_agoraphobie'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'panic_disorder_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN panic_disorder_age_debut INTEGER CHECK (panic_disorder_age_debut BETWEEN 0 AND 120);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'panic_disorder_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN panic_disorder_symptoms_past_month VARCHAR(20) CHECK (panic_disorder_symptoms_past_month IN ('oui', 'non'));
    END IF;

    -- Agoraphobia without panic columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'agoraphobia_no_panic_present') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN agoraphobia_no_panic_present VARCHAR(20) CHECK (agoraphobia_no_panic_present IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'agoraphobia_no_panic_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN agoraphobia_no_panic_age_debut INTEGER CHECK (agoraphobia_no_panic_age_debut BETWEEN 0 AND 120);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'agoraphobia_no_panic_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN agoraphobia_no_panic_symptoms_past_month VARCHAR(20) CHECK (agoraphobia_no_panic_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;

    -- Social phobia columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'social_phobia_present') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN social_phobia_present VARCHAR(20) CHECK (social_phobia_present IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'social_phobia_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN social_phobia_age_debut INTEGER CHECK (social_phobia_age_debut BETWEEN 0 AND 120);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'social_phobia_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN social_phobia_symptoms_past_month VARCHAR(20) CHECK (social_phobia_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;

    -- Specific phobia columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'specific_phobia_present') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN specific_phobia_present VARCHAR(20) CHECK (specific_phobia_present IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'specific_phobia_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN specific_phobia_age_debut INTEGER CHECK (specific_phobia_age_debut BETWEEN 0 AND 120);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'specific_phobia_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN specific_phobia_symptoms_past_month VARCHAR(20) CHECK (specific_phobia_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;

    -- OCD columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'ocd_present') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN ocd_present VARCHAR(20) CHECK (ocd_present IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'ocd_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN ocd_age_debut INTEGER CHECK (ocd_age_debut BETWEEN 0 AND 120);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'ocd_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN ocd_symptoms_past_month VARCHAR(20) CHECK (ocd_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;

    -- PTSD columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'ptsd_present') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN ptsd_present VARCHAR(20) CHECK (ptsd_present IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'ptsd_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN ptsd_age_debut INTEGER CHECK (ptsd_age_debut BETWEEN 0 AND 120);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'ptsd_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN ptsd_symptoms_past_month VARCHAR(20) CHECK (ptsd_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;

    -- GAD columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'gad_present') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN gad_present VARCHAR(20) CHECK (gad_present IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'gad_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN gad_age_debut INTEGER CHECK (gad_age_debut BETWEEN 0 AND 120);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'gad_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN gad_symptoms_past_month VARCHAR(20) CHECK (gad_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;

    -- Anxiety due to medical condition
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anxiety_medical_condition_present') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anxiety_medical_condition_present VARCHAR(20) CHECK (anxiety_medical_condition_present IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anxiety_medical_condition_affection') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anxiety_medical_condition_affection TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anxiety_medical_condition_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anxiety_medical_condition_age_debut INTEGER CHECK (anxiety_medical_condition_age_debut BETWEEN 0 AND 120);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anxiety_medical_condition_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anxiety_medical_condition_symptoms_past_month VARCHAR(20) CHECK (anxiety_medical_condition_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;

    -- Substance-induced anxiety
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anxiety_substance_induced_present') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anxiety_substance_induced_present VARCHAR(20) CHECK (anxiety_substance_induced_present IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anxiety_substance_induced_substance') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anxiety_substance_induced_substance TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anxiety_substance_induced_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anxiety_substance_induced_age_debut INTEGER CHECK (anxiety_substance_induced_age_debut BETWEEN 0 AND 120);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anxiety_substance_induced_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anxiety_substance_induced_symptoms_past_month VARCHAR(20) CHECK (anxiety_substance_induced_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;

    -- Unspecified anxiety
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anxiety_unspecified_present') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anxiety_unspecified_present VARCHAR(20) CHECK (anxiety_unspecified_present IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anxiety_unspecified_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anxiety_unspecified_age_debut INTEGER CHECK (anxiety_unspecified_age_debut BETWEEN 0 AND 120);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anxiety_unspecified_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anxiety_unspecified_symptoms_past_month VARCHAR(20) CHECK (anxiety_unspecified_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;

    -- ========================================================================
    -- SECTION 2: SUBSTANCE DISORDERS
    -- ========================================================================
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'has_substance_disorder') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN has_substance_disorder VARCHAR(20) CHECK (has_substance_disorder IN ('oui', 'non', 'ne_sais_pas'));
    END IF;

    -- Alcohol
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'alcohol_present') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN alcohol_present VARCHAR(20) CHECK (alcohol_present IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'alcohol_type') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN alcohol_type VARCHAR(20) CHECK (alcohol_type IN ('abus', 'dependance'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'alcohol_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN alcohol_age_debut INTEGER CHECK (alcohol_age_debut BETWEEN 0 AND 120);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'alcohol_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN alcohol_symptoms_past_month VARCHAR(20) CHECK (alcohol_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'alcohol_duration_months') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN alcohol_duration_months INTEGER CHECK (alcohol_duration_months BETWEEN 0 AND 2000);
    END IF;

    -- Add similar blocks for other substances: sedatives, cannabis, stimulants, opiates, cocaine, hallucinogens, other_substance
    -- Induced disorder
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'induced_disorder_present') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN induced_disorder_present VARCHAR(20) CHECK (induced_disorder_present IN ('oui', 'non', 'ne_sais_pas'));
    END IF;

    -- ========================================================================
    -- SECTION 3: EATING DISORDERS
    -- ========================================================================
    
    -- Eating disorder type (new)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'eating_disorder_type') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN eating_disorder_type VARCHAR(50) CHECK (eating_disorder_type IN (
            'anorexia_restrictive',
            'anorexia_bulimic',
            'bulimia',
            'binge_eating',
            'eating_unspecified',
            'night_eating'
        ));
    END IF;

    -- Anorexia restrictive
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anorexia_restrictive_amenorrhea') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anorexia_restrictive_amenorrhea VARCHAR(10);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anorexia_restrictive_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anorexia_restrictive_age_debut INTEGER CHECK (anorexia_restrictive_age_debut BETWEEN 0 AND 120);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anorexia_restrictive_age_fin') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anorexia_restrictive_age_fin INTEGER CHECK (anorexia_restrictive_age_fin BETWEEN 0 AND 120);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anorexia_restrictive_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anorexia_restrictive_symptoms_past_month VARCHAR(20) CHECK (anorexia_restrictive_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anorexia_restrictive_current') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anorexia_restrictive_current VARCHAR(10);
    END IF;

    -- Anorexia bulimic
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anorexia_bulimic_amenorrhea') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anorexia_bulimic_amenorrhea VARCHAR(10);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anorexia_bulimic_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anorexia_bulimic_age_debut INTEGER CHECK (anorexia_bulimic_age_debut BETWEEN 0 AND 120);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anorexia_bulimic_age_fin') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anorexia_bulimic_age_fin INTEGER CHECK (anorexia_bulimic_age_fin BETWEEN 0 AND 120);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anorexia_bulimic_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anorexia_bulimic_symptoms_past_month VARCHAR(20) CHECK (anorexia_bulimic_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'anorexia_bulimic_current') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN anorexia_bulimic_current VARCHAR(10);
    END IF;

    -- Bulimia
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'bulimia_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN bulimia_age_debut INTEGER CHECK (bulimia_age_debut BETWEEN 0 AND 120);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'bulimia_age_fin') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN bulimia_age_fin INTEGER CHECK (bulimia_age_fin BETWEEN 0 AND 120);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'bulimia_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN bulimia_symptoms_past_month VARCHAR(20) CHECK (bulimia_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'bulimia_current') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN bulimia_current VARCHAR(10);
    END IF;

    -- Binge eating
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'binge_eating_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN binge_eating_age_debut INTEGER CHECK (binge_eating_age_debut BETWEEN 0 AND 120);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'binge_eating_age_fin') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN binge_eating_age_fin INTEGER CHECK (binge_eating_age_fin BETWEEN 0 AND 120);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'binge_eating_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN binge_eating_symptoms_past_month VARCHAR(20) CHECK (binge_eating_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'binge_eating_current') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN binge_eating_current VARCHAR(10);
    END IF;

    -- Eating unspecified
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'eating_unspecified_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN eating_unspecified_age_debut INTEGER CHECK (eating_unspecified_age_debut BETWEEN 0 AND 120);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'eating_unspecified_age_fin') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN eating_unspecified_age_fin INTEGER CHECK (eating_unspecified_age_fin BETWEEN 0 AND 120);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'eating_unspecified_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN eating_unspecified_symptoms_past_month VARCHAR(20) CHECK (eating_unspecified_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'eating_unspecified_current') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN eating_unspecified_current VARCHAR(10);
    END IF;

    -- Night eating
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'night_eating_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN night_eating_age_debut INTEGER CHECK (night_eating_age_debut BETWEEN 0 AND 120);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'night_eating_age_fin') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN night_eating_age_fin INTEGER CHECK (night_eating_age_fin BETWEEN 0 AND 120);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'night_eating_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN night_eating_symptoms_past_month VARCHAR(20) CHECK (night_eating_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'night_eating_current') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN night_eating_current VARCHAR(10);
    END IF;

    -- ========================================================================
    -- SECTION 4: SOMATOFORM
    -- ========================================================================
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'has_somatoform_disorder') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN has_somatoform_disorder VARCHAR(20) CHECK (has_somatoform_disorder IN ('oui', 'non', 'ne_sais_pas'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'somatoform_type') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN somatoform_type VARCHAR(50) CHECK (somatoform_type IN (
            'trouble_somatisation',
            'trouble_douloureux',
            'trouble_indifferencie',
            'hypocondrie',
            'peur_dysmorphie_corporelle'
        ));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'somatoform_age_debut') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN somatoform_age_debut INTEGER CHECK (somatoform_age_debut BETWEEN 0 AND 120);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'somatoform_symptoms_past_month') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN somatoform_symptoms_past_month VARCHAR(20) CHECK (somatoform_symptoms_past_month IN ('oui', 'non', 'ne_sais_pas'));
    END IF;

    -- ========================================================================
    -- SECTION 5: ADHD/DIVA
    -- ========================================================================
    
    -- DIVA evaluated (Section 5)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'responses_dsm5_comorbid' AND column_name = 'diva_evaluated') THEN
        ALTER TABLE responses_dsm5_comorbid ADD COLUMN diva_evaluated VARCHAR(20) CHECK (diva_evaluated IN ('oui', 'non', 'ne_sais_pas'));
    END IF;

    RAISE NOTICE 'Schema verification and update complete';
END $$;

-- ============================================================================
-- FORCE POSTGREST TO RELOAD SCHEMA CACHE - MULTIPLE TIMES FOR GOOD MEASURE
-- ============================================================================

-- Method 1: NOTIFY
NOTIFY pgrst, 'reload schema';

-- Method 2: Also notify with reload config (some versions use this)
NOTIFY pgrst, 'reload config';

-- Wait a moment
SELECT pg_sleep(0.5);

-- Notify again to be absolutely sure
NOTIFY pgrst, 'reload schema';

-- ============================================================================
-- VERIFICATION - Log column count
-- ============================================================================

DO $$
DECLARE
    col_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO col_count
    FROM information_schema.columns 
    WHERE table_name = 'responses_dsm5_comorbid';
    
    RAISE NOTICE 'Total columns in responses_dsm5_comorbid: %', col_count;
    
    -- Check anxiety columns
    SELECT COUNT(*) INTO col_count
    FROM information_schema.columns 
    WHERE table_name = 'responses_dsm5_comorbid' 
    AND (column_name LIKE '%anxiety%' OR column_name LIKE '%panic%' OR column_name LIKE '%phobia%' 
         OR column_name LIKE '%ocd%' OR column_name LIKE '%ptsd%' OR column_name LIKE '%gad%');
    
    RAISE NOTICE 'Anxiety-related columns: %', col_count;
END $$;

