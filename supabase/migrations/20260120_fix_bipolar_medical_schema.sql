-- ============================================================================
-- eFondaMental Platform - Fix Bipolar Medical Tables Schema
-- ============================================================================
-- Updates 19 bipolar_* medical tables from JSONB to individual columns
-- ============================================================================

-- ============================================================================
-- DROP EXISTING TABLES
-- ============================================================================

DROP TABLE IF EXISTS public.bipolar_dsm5_humeur CASCADE;
DROP TABLE IF EXISTS public.bipolar_dsm5_psychotic CASCADE;
DROP TABLE IF EXISTS public.bipolar_dsm5_comorbid CASCADE;
DROP TABLE IF EXISTS public.bipolar_diva CASCADE;
DROP TABLE IF EXISTS public.bipolar_family_history CASCADE;
DROP TABLE IF EXISTS public.bipolar_cssrs CASCADE;
DROP TABLE IF EXISTS public.bipolar_isa CASCADE;
DROP TABLE IF EXISTS public.bipolar_sis CASCADE;
DROP TABLE IF EXISTS public.bipolar_suicide_history CASCADE;
DROP TABLE IF EXISTS public.bipolar_perinatalite CASCADE;
DROP TABLE IF EXISTS public.bipolar_patho_neuro CASCADE;
DROP TABLE IF EXISTS public.bipolar_patho_cardio CASCADE;
DROP TABLE IF EXISTS public.bipolar_patho_endoc CASCADE;
DROP TABLE IF EXISTS public.bipolar_patho_dermato CASCADE;
DROP TABLE IF EXISTS public.bipolar_patho_urinaire CASCADE;
DROP TABLE IF EXISTS public.bipolar_antecedents_gyneco CASCADE;
DROP TABLE IF EXISTS public.bipolar_patho_hepato_gastro CASCADE;
DROP TABLE IF EXISTS public.bipolar_patho_allergique CASCADE;
DROP TABLE IF EXISTS public.bipolar_autres_patho CASCADE;

-- ============================================================================
-- 1. BIPOLAR_DSM5_HUMEUR
-- ============================================================================

CREATE TABLE public.bipolar_dsm5_humeur (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  
  -- SECTION 1: Mood Disorder Presence and Type
  has_mood_disorder VARCHAR(20),
  disorder_type VARCHAR(50),
  disorder_type_autre TEXT,
  major_depression_type VARCHAR(20),
  dysthymic_type VARCHAR(20),
  medical_condition_affection_type VARCHAR(50),
  medical_condition_affection_autre TEXT,
  medical_condition_trouble_type VARCHAR(50),
  substance_types JSONB,
  substance_type VARCHAR(50),
  substance_autre TEXT,
  substance_trouble_type VARCHAR(50),
  unspecified_depression_type VARCHAR(50),
  unspecified_depression_post_schizophrenie BOOLEAN,
  unspecified_depression_majeur_surajout BOOLEAN,
  unspecified_depression_dysphorique_premenstruel BOOLEAN,
  unspecified_depression_mineur BOOLEAN,
  unspecified_depression_bref_recurrent BOOLEAN,
  unspecified_depression_autre BOOLEAN,
  unspecified_depression_ne_sais_pas BOOLEAN,
  cyclothymic BOOLEAN,
  other_specify TEXT,
  
  -- SECTION 2: First Episode Characteristics
  first_episode_type VARCHAR(50),
  postpartum_first VARCHAR(20),
  initial_cyclothymic_period VARCHAR(20),
  
  -- SECTION 3: Lifetime Characteristics
  num_edm INTEGER, age_first_edm INTEGER, edm_with_psychotic VARCHAR(20),
  num_edm_psychotic INTEGER, edm_with_mixed VARCHAR(20), num_edm_mixed INTEGER,
  num_hypomanic INTEGER, age_first_hypomanic INTEGER, age_first_hypomanic_text TEXT,
  num_manic INTEGER, age_first_manic INTEGER, age_first_manic_text TEXT,
  manic_with_psychotic VARCHAR(20),
  num_manic_psychotic INTEGER, manic_with_mixed VARCHAR(20), num_manic_mixed INTEGER,
  induced_episodes VARCHAR(20), num_induced_episodes INTEGER,
  rapid_cycling VARCHAR(20), complete_remission VARCHAR(20),
  seasonal_pattern VARCHAR(20), seasonal_types JSONB,
  seasonal_depression VARCHAR(20), seasonal_depression_season VARCHAR(20),
  seasonal_hypomania VARCHAR(20), seasonal_hypomania_season VARCHAR(20), seasonal_seasons TEXT,
  age_first_psychotrope INTEGER, age_first_thymoregulator INTEGER,
  age_first_hospitalization INTEGER, num_hospitalizations INTEGER, number_of_hospitalizations INTEGER,
  total_hospitalization_months INTEGER, total_hospitalization_duration_months INTEGER,
  total_hospitalization_duration_text TEXT,
  
  -- 12-month characteristics
  past_year_episode VARCHAR(20), past_year_num_edm INTEGER,
  past_year_edm_psychotic VARCHAR(20), past_year_num_edm_psychotic INTEGER,
  past_year_edm_mixed VARCHAR(20), past_year_num_edm_mixed INTEGER,
  past_year_num_hypomanic INTEGER, past_year_num_manic INTEGER,
  past_year_manic_psychotic VARCHAR(20), past_year_num_manic_psychotic INTEGER,
  past_year_manic_mixed VARCHAR(20), past_year_num_manic_mixed INTEGER,
  past_year_num_hospitalizations INTEGER, past_year_hospitalization_weeks INTEGER,
  past_year_hospitalization_weeks_text TEXT,
  past_year_work_leave VARCHAR(20), past_year_num_work_leaves INTEGER,
  past_year_work_leave_weeks INTEGER, past_year_work_leave_weeks_text TEXT,
  
  -- SECTION 4: Most Recent Episode
  recent_episode_start_date DATE, recent_episode_start_date_text TEXT,
  recent_episode_end_date DATE, recent_episode_end_date_text TEXT,
  recent_episode_type VARCHAR(50),
  recent_edm_subtypes JSONB, recent_edm_subtype VARCHAR(50),
  recent_edm_severity VARCHAR(50), recent_edm_chronic VARCHAR(20),
  recent_edm_postpartum VARCHAR(20), recent_hypomanie_postpartum VARCHAR(20),
  recent_manie_catatonic VARCHAR(20), recent_manie_mixed VARCHAR(20),
  recent_manie_severity VARCHAR(50), recent_manie_postpartum VARCHAR(20),
  recent_non_specifie_catatonic VARCHAR(20), recent_non_specifie_severity VARCHAR(50),
  recent_non_specifie_postpartum VARCHAR(20),
  recent_episode_catatonic VARCHAR(20), recent_episode_severity VARCHAR(50),
  recent_episode_postpartum VARCHAR(20),
  
  -- SECTION 5: Current Episode
  current_episode_present VARCHAR(20), current_episode_type VARCHAR(50),
  current_edm_subtypes JSONB, current_edm_subtype VARCHAR(50), current_edm_severity VARCHAR(50),
  current_edm_chronic VARCHAR(20), current_edm_postpartum VARCHAR(20),
  current_hypomanie_postpartum VARCHAR(20), current_manie_catatonic VARCHAR(20),
  current_manie_mixed VARCHAR(20), current_manie_mixed_text TEXT, current_manie_severity VARCHAR(50),
  current_manie_postpartum VARCHAR(20), current_non_specifie_catatonic VARCHAR(20),
  current_non_specifie_severity VARCHAR(50), current_non_specifie_postpartum VARCHAR(20),
  current_episode_catatonic VARCHAR(20), current_episode_severity VARCHAR(50),
  current_episode_postpartum VARCHAR(20),
  
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. BIPOLAR_DSM5_PSYCHOTIC
-- ============================================================================

CREATE TABLE public.bipolar_dsm5_psychotic (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  has_psychotic_disorder VARCHAR(20),
  psychotic_disorder_date DATE,
  disorder_type VARCHAR(100),
  symptoms_past_month VARCHAR(20),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. BIPOLAR_DSM5_COMORBID (large table - anxiety, substance, eating, somatoform)
-- ============================================================================

CREATE TABLE public.bipolar_dsm5_comorbid (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  
  -- Anxiety disorders
  has_anxiety_disorder VARCHAR(20),
  panic_no_agoraphobia_present VARCHAR(20), panic_no_agoraphobia_age_debut INTEGER, panic_no_agoraphobia_symptoms_past_month VARCHAR(20),
  panic_with_agoraphobia_present VARCHAR(20), panic_with_agoraphobia_age_debut INTEGER, panic_with_agoraphobia_symptoms_past_month VARCHAR(20),
  agoraphobia_no_panic_present VARCHAR(20), agoraphobia_no_panic_age_debut INTEGER, agoraphobia_no_panic_symptoms_past_month VARCHAR(20),
  social_phobia_present VARCHAR(20), social_phobia_age_debut INTEGER, social_phobia_symptoms_past_month VARCHAR(20),
  specific_phobia_present VARCHAR(20), specific_phobia_age_debut INTEGER, specific_phobia_symptoms_past_month VARCHAR(20),
  ocd_present VARCHAR(20), ocd_age_debut INTEGER, ocd_symptoms_past_month VARCHAR(20),
  ptsd_present VARCHAR(20), ptsd_age_debut INTEGER, ptsd_symptoms_past_month VARCHAR(20),
  gad_present VARCHAR(20), gad_age_debut INTEGER, gad_symptoms_past_month VARCHAR(20),
  anxiety_medical_condition_present VARCHAR(20), anxiety_medical_condition_affection TEXT,
  anxiety_medical_condition_age_debut INTEGER, anxiety_medical_condition_symptoms_past_month VARCHAR(20),
  anxiety_substance_induced_present VARCHAR(20), anxiety_substance_induced_substance TEXT,
  anxiety_substance_induced_age_debut INTEGER, anxiety_substance_induced_symptoms_past_month VARCHAR(20),
  anxiety_unspecified_present VARCHAR(20), anxiety_unspecified_age_debut INTEGER, anxiety_unspecified_symptoms_past_month VARCHAR(20),
  
  -- Substance disorders
  has_substance_disorder VARCHAR(20),
  alcohol_present VARCHAR(20), alcohol_type VARCHAR(20), alcohol_age_debut INTEGER, alcohol_symptoms_past_month VARCHAR(20), alcohol_duration_months INTEGER,
  sedatives_present VARCHAR(20), sedatives_type VARCHAR(20), sedatives_age_debut INTEGER, sedatives_symptoms_past_month VARCHAR(20), sedatives_duration_months INTEGER,
  cannabis_present VARCHAR(20), cannabis_type VARCHAR(20), cannabis_age_debut INTEGER, cannabis_symptoms_past_month VARCHAR(20), cannabis_duration_months INTEGER,
  stimulants_present VARCHAR(20), stimulants_type VARCHAR(20), stimulants_age_debut INTEGER, stimulants_symptoms_past_month VARCHAR(20), stimulants_duration_months INTEGER,
  opiates_present VARCHAR(20), opiates_type VARCHAR(20), opiates_age_debut INTEGER, opiates_symptoms_past_month VARCHAR(20), opiates_duration_months INTEGER,
  cocaine_present VARCHAR(20), cocaine_type VARCHAR(20), cocaine_age_debut INTEGER, cocaine_symptoms_past_month VARCHAR(20), cocaine_duration_months INTEGER,
  hallucinogens_present VARCHAR(20), hallucinogens_type VARCHAR(20), hallucinogens_age_debut INTEGER, hallucinogens_symptoms_past_month VARCHAR(20), hallucinogens_duration_months INTEGER,
  other_substance_present VARCHAR(20), other_substance_name TEXT, other_substance_type VARCHAR(20), other_substance_age_debut INTEGER, other_substance_symptoms_past_month VARCHAR(20), other_substance_duration_months INTEGER,
  induced_disorder_present VARCHAR(20), induced_substances TEXT[], induced_disorder_type VARCHAR(50), induced_symptoms_past_month VARCHAR(20),
  
  -- Eating disorders
  has_eating_disorder VARCHAR(20),
  anorexia_restrictive_amenorrhea BOOLEAN, anorexia_restrictive_age_debut INTEGER, anorexia_restrictive_age_fin INTEGER, anorexia_restrictive_symptoms_past_month VARCHAR(20), anorexia_restrictive_current BOOLEAN,
  anorexia_bulimic_amenorrhea BOOLEAN, anorexia_bulimic_age_debut INTEGER, anorexia_bulimic_age_fin INTEGER, anorexia_bulimic_symptoms_past_month VARCHAR(20), anorexia_bulimic_current BOOLEAN,
  bulimia_age_debut INTEGER, bulimia_age_fin INTEGER, bulimia_symptoms_past_month VARCHAR(20), bulimia_current BOOLEAN,
  binge_eating_age_debut INTEGER, binge_eating_age_fin INTEGER, binge_eating_symptoms_past_month VARCHAR(20), binge_eating_current BOOLEAN,
  eating_unspecified_age_debut INTEGER, eating_unspecified_age_fin INTEGER, eating_unspecified_symptoms_past_month VARCHAR(20), eating_unspecified_current BOOLEAN,
  night_eating_age_debut INTEGER, night_eating_age_fin INTEGER, night_eating_symptoms_past_month VARCHAR(20), night_eating_current BOOLEAN,
  
  -- Somatoform
  has_somatoform_disorder VARCHAR(20), somatoform_type VARCHAR(50), somatoform_age_debut INTEGER, somatoform_symptoms_past_month VARCHAR(20),
  
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. BIPOLAR_DIVA
-- ============================================================================

CREATE TABLE public.bipolar_diva (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  evaluated VARCHAR(20),
  a1a_adult BOOLEAN, a1a_childhood BOOLEAN, a1b_adult BOOLEAN, a1b_childhood BOOLEAN,
  a1c_adult BOOLEAN, a1c_childhood BOOLEAN, a1d_adult BOOLEAN, a1d_childhood BOOLEAN,
  a1e_adult BOOLEAN, a1e_childhood BOOLEAN, a1f_adult BOOLEAN, a1f_childhood BOOLEAN,
  a1g_adult BOOLEAN, a1g_childhood BOOLEAN, a1h_adult BOOLEAN, a1h_childhood BOOLEAN,
  a1i_adult BOOLEAN, a1i_childhood BOOLEAN,
  total_inattention_adult INTEGER, total_inattention_childhood INTEGER,
  a2a_adult BOOLEAN, a2a_childhood BOOLEAN, a2b_adult BOOLEAN, a2b_childhood BOOLEAN,
  a2c_adult BOOLEAN, a2c_childhood BOOLEAN, a2d_adult BOOLEAN, a2d_childhood BOOLEAN,
  a2e_adult BOOLEAN, a2e_childhood BOOLEAN, a2f_adult BOOLEAN, a2f_childhood BOOLEAN,
  a2g_adult BOOLEAN, a2g_childhood BOOLEAN, a2h_adult BOOLEAN, a2h_childhood BOOLEAN,
  a2i_adult BOOLEAN, a2i_childhood BOOLEAN,
  total_hyperactivity_adult INTEGER, total_hyperactivity_childhood INTEGER,
  criteria_a_inattention_child_gte6 BOOLEAN, criteria_hi_hyperactivity_child_gte6 BOOLEAN,
  criteria_a_inattention_adult_gte6 BOOLEAN, criteria_hi_hyperactivity_adult_gte6 BOOLEAN,
  criteria_b_lifetime_persistence BOOLEAN,
  criteria_cd_impairment_childhood BOOLEAN, criteria_cd_impairment_adult BOOLEAN,
  criteria_e_better_explained BOOLEAN, criteria_e_explanation TEXT,
  collateral_parents INTEGER, collateral_partner INTEGER, collateral_school_reports INTEGER,
  final_diagnosis VARCHAR(50),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. BIPOLAR_FAMILY_HISTORY
-- ============================================================================

CREATE TABLE public.bipolar_family_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  -- Mother
  mother_deceased VARCHAR(20), mother_death_cause TEXT, mother_psy_history VARCHAR(20),
  mother_psy_thymic VARCHAR(20), mother_psy_thymic_type VARCHAR(20), mother_psy_schizo VARCHAR(20),
  mother_psy_suicide INTEGER, mother_psy_dementia VARCHAR(20), mother_psy_substance VARCHAR(20),
  mother_psy_substance_types TEXT[], mother_psy_anxiety VARCHAR(20),
  mother_cardio_history VARCHAR(20), mother_cardio_types TEXT[], mother_diabetes_type INTEGER,
  -- Father
  father_deceased VARCHAR(20), father_death_cause TEXT, father_psy_history VARCHAR(20),
  father_psy_thymic VARCHAR(20), father_psy_thymic_type VARCHAR(20), father_psy_schizo VARCHAR(20),
  father_psy_suicide INTEGER, father_psy_dementia VARCHAR(20), father_psy_substance VARCHAR(20),
  father_psy_substance_types TEXT[], father_psy_anxiety VARCHAR(20),
  father_cardio_history VARCHAR(20), father_cardio_types TEXT[], father_diabetes_type INTEGER,
  -- Grandparents
  gp_maternal_grandmother_notes TEXT, gp_maternal_grandfather_notes TEXT,
  gp_paternal_grandmother_notes TEXT, gp_paternal_grandfather_notes TEXT,
  -- Children
  has_children VARCHAR(20), children_psy_count INTEGER, children_cardio_count INTEGER,
  child1_gender VARCHAR(1), child1_dob TEXT, child1_psy_history VARCHAR(20), child1_psy_details TEXT[], child1_cardio VARCHAR(20),
  child2_gender VARCHAR(1), child2_dob TEXT, child2_psy_history VARCHAR(20), child2_psy_details TEXT[], child2_cardio VARCHAR(20),
  child3_gender VARCHAR(1), child3_dob TEXT, child3_psy_history VARCHAR(20), child3_psy_details TEXT[], child3_cardio VARCHAR(20),
  child4_gender VARCHAR(1), child4_dob TEXT, child4_psy_history VARCHAR(20), child4_psy_details TEXT[], child4_cardio VARCHAR(20),
  -- Siblings
  has_siblings VARCHAR(20),
  sibling1_gender VARCHAR(1), sibling1_deceased VARCHAR(20), sibling1_death_cause TEXT, sibling1_psy_history VARCHAR(20),
  sibling1_psy_thymic VARCHAR(20), sibling1_psy_thymic_type VARCHAR(20), sibling1_psy_schizo VARCHAR(20),
  sibling1_psy_suicide INTEGER, sibling1_psy_substance VARCHAR(20), sibling1_psy_anxiety VARCHAR(20),
  sibling1_cardio_history VARCHAR(20), sibling1_cardio_types TEXT[],
  sibling2_gender VARCHAR(1), sibling2_deceased VARCHAR(20), sibling2_death_cause TEXT, sibling2_psy_history VARCHAR(20),
  sibling2_psy_thymic VARCHAR(20), sibling2_psy_thymic_type VARCHAR(20), sibling2_psy_schizo VARCHAR(20),
  sibling2_psy_suicide INTEGER, sibling2_psy_substance VARCHAR(20), sibling2_psy_anxiety VARCHAR(20),
  sibling2_cardio_history VARCHAR(20), sibling2_cardio_types TEXT[],
  sibling3_gender VARCHAR(1), sibling3_deceased VARCHAR(20), sibling3_death_cause TEXT, sibling3_psy_history VARCHAR(20),
  sibling3_psy_thymic VARCHAR(20), sibling3_psy_thymic_type VARCHAR(20), sibling3_psy_schizo VARCHAR(20),
  sibling3_psy_suicide INTEGER, sibling3_psy_substance VARCHAR(20), sibling3_psy_anxiety VARCHAR(20),
  sibling3_cardio_history VARCHAR(20), sibling3_cardio_types TEXT[],
  sibling4_gender VARCHAR(1), sibling4_deceased VARCHAR(20), sibling4_death_cause TEXT, sibling4_psy_history VARCHAR(20),
  sibling4_psy_thymic VARCHAR(20), sibling4_psy_thymic_type VARCHAR(20), sibling4_psy_schizo VARCHAR(20),
  sibling4_psy_suicide INTEGER, sibling4_psy_substance VARCHAR(20), sibling4_psy_anxiety VARCHAR(20),
  sibling4_cardio_history VARCHAR(20), sibling4_cardio_types TEXT[],
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. BIPOLAR_CSSRS
-- ============================================================================

CREATE TABLE public.bipolar_cssrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1_wish_dead BOOLEAN, q2_non_specific BOOLEAN, q3_method_no_intent BOOLEAN,
  q4_intent_no_plan BOOLEAN, q5_plan_intent BOOLEAN,
  int_most_severe INTEGER, int_frequency INTEGER, int_duration INTEGER,
  int_control INTEGER, int_deterrents INTEGER, int_causes INTEGER,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. BIPOLAR_ISA
-- ============================================================================

CREATE TABLE public.bipolar_isa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1_life_worth INTEGER, q1_time VARCHAR(20),
  q2_wish_death INTEGER, q2_time VARCHAR(20),
  q3_thoughts INTEGER, q3_time VARCHAR(20),
  q4_plan INTEGER, q4_time VARCHAR(20),
  q5_attempt INTEGER, q5_time VARCHAR(20),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. BIPOLAR_SIS (NO GENERATED columns - scores computed by application)
-- ============================================================================

CREATE TABLE public.bipolar_sis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  sis_01 INTEGER, sis_02 INTEGER, sis_03 INTEGER, sis_04 INTEGER,
  sis_05 INTEGER, sis_06 INTEGER, sis_07 INTEGER, sis_08 INTEGER,
  sis_09 INTEGER, sis_10 INTEGER, sis_11 INTEGER, sis_12 INTEGER,
  sis_13 INTEGER, sis_14 INTEGER, sis_15 INTEGER,
  total_score INTEGER,
  circumstances_subscore INTEGER,
  conception_subscore INTEGER,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 9. BIPOLAR_SUICIDE_HISTORY
-- ============================================================================

CREATE TABLE public.bipolar_suicide_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1_first_attempt_date DATE, q2_attempt_count INTEGER,
  q3_violent_attempts VARCHAR(10), q3_1_violent_count INTEGER,
  q4_serious_attempts VARCHAR(10), q4_1_serious_count INTEGER,
  q5_self_harm INTEGER, q6_interrupted INTEGER, q6_1_interrupted_count INTEGER,
  q7_aborted INTEGER, q7_1_aborted_count INTEGER, q8_preparations INTEGER,
  q9_recent_severity INTEGER, q10_recent_date DATE,
  q11_lethal_severity INTEGER, q12_lethal_date DATE,
  q13_first_severity INTEGER, q13_1_first_lethality INTEGER,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 10. BIPOLAR_PERINATALITE
-- ============================================================================

CREATE TABLE public.bipolar_perinatalite (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1_mother_age INTEGER, q2_father_age INTEGER, q3_birth_condition VARCHAR(20),
  q4_gestational_age INTEGER, q5_birth_type VARCHAR(20), q6_birth_weight INTEGER,
  q7_birth_length NUMERIC(4,1), q8_head_circumference NUMERIC(4,1),
  q9_apgar_1min INTEGER, q10_apgar_5min INTEGER, q11_neonatal_hospitalization VARCHAR(10),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 11-19. PATHO TABLES (neuro, cardio, endoc, dermato, urinaire, gyneco, hepato, allergique, autres)
-- ============================================================================

CREATE TABLE public.bipolar_patho_neuro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1_migraine VARCHAR(10), q1_1_migraine_date DATE, q1_2_migraine_treated VARCHAR(3), q1_3_migraine_balanced VARCHAR(3),
  q2_sclerose VARCHAR(10), q2_1_sclerose_date DATE, q2_2_sclerose_treated VARCHAR(3), q2_3_sclerose_balanced VARCHAR(3),
  q3_epilepsie VARCHAR(10), q3_1_epilepsie_date DATE, q3_2_epilepsie_treated VARCHAR(3), q3_3_epilepsie_balanced VARCHAR(3),
  q4_meningite VARCHAR(10), q4_1_meningite_date DATE,
  q5_trauma_cranien VARCHAR(10), q5_1_trauma_cranien_date DATE,
  q6_avc VARCHAR(10), q6_1_avc_date DATE,
  q7_autre VARCHAR(10), q7_1_autre_date DATE, q7_2_autre_specify TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_patho_cardio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1_hypertension VARCHAR(10), q1_1_hypertension_date DATE, q1_2_hypertension_treated VARCHAR(3), q1_3_hypertension_balanced VARCHAR(3),
  q2_coronary VARCHAR(10), q2_1_coronary_date DATE, q2_2_coronary_treated VARCHAR(3), q2_3_coronary_balanced VARCHAR(3),
  q3_infarctus VARCHAR(10), q3_1_infarctus_date DATE,
  q4_rythme VARCHAR(10), q4_1_rythme_date DATE, q4_2_rythme_treated VARCHAR(3), q4_3_rythme_balanced VARCHAR(3),
  q5_autre VARCHAR(10), q5_1_autre_specify TEXT, q5_2_autre_date DATE,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_patho_endoc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1_diabete VARCHAR(10), q1_1_diabete_date DATE, q1_2_diabete_treated VARCHAR(3), q1_3_diabete_balanced VARCHAR(3), q1_4_diabete_type VARCHAR(10),
  q2_dysthyroidie VARCHAR(10), q2_1_dysthyroidie_type VARCHAR(15), q2_2_dysthyroidie_origin VARCHAR(20), q2_3_dysthyroidie_treated VARCHAR(3), q2_4_dysthyroidie_balanced VARCHAR(3),
  q3_dyslipidemie VARCHAR(10), q3_1_dyslipidemie_date DATE, q3_2_dyslipidemie_treated VARCHAR(3), q3_3_dyslipidemie_balanced VARCHAR(3), q3_4_dyslipidemie_type VARCHAR(20),
  q4_autres VARCHAR(10), q4_1_autres_date DATE, q4_2_autres_specify TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_patho_dermato (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1_psoriasis VARCHAR(10), q1_1_psoriasis_date DATE, q1_2_psoriasis_treated VARCHAR(3), q1_3_psoriasis_balanced VARCHAR(3),
  q1_4_psoriasis_lithium_effect VARCHAR(10), q1_5_psoriasis_triggered_lithium VARCHAR(3), q1_6_psoriasis_aggravated_lithium VARCHAR(3),
  q2_acne VARCHAR(10), q2_1_acne_date DATE, q2_2_acne_treated VARCHAR(3), q2_3_acne_balanced VARCHAR(3),
  q2_4_acne_lithium_effect VARCHAR(10), q2_5_acne_triggered_lithium VARCHAR(3), q2_6_acne_aggravated_lithium VARCHAR(3),
  q3_eczema VARCHAR(10), q3_1_eczema_date DATE, q3_2_eczema_treated VARCHAR(3), q3_3_eczema_balanced VARCHAR(3),
  q4_toxidermie VARCHAR(10), q4_1_toxidermie_date DATE, q4_2_toxidermie_type VARCHAR(30), q4_3_toxidermie_medication JSONB,
  q5_hair_loss VARCHAR(10), q5_1_hair_loss_date DATE, q5_2_hair_loss_treated VARCHAR(3), q5_3_hair_loss_balanced VARCHAR(3), q5_4_hair_loss_depakine VARCHAR(10),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_patho_urinaire (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1_nephropathy VARCHAR(10), q1_1_nephropathy_date DATE, q1_2_nephropathy_treated VARCHAR(3), q1_3_nephropathy_balanced VARCHAR(3), q1_4_nephropathy_lithium_link VARCHAR(10),
  q2_prostatic_adenoma VARCHAR(10), q2_1_prostatic_adenoma_date DATE, q2_2_prostatic_adenoma_treated VARCHAR(3), q2_3_prostatic_adenoma_balanced VARCHAR(3),
  q3_urinary_retention VARCHAR(10), q3_1_urinary_retention_date DATE, q3_2_urinary_retention_treatment_triggered VARCHAR(3), q3_3_urinary_retention_treatment_type JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_antecedents_gyneco (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1_pregnancy_count INTEGER, q2_live_birth_count INTEGER, q3_miscarriage_count INTEGER,
  q4_ivg_count INTEGER, q5_itg_count INTEGER,
  q6_menopause VARCHAR(10), q6_1_menopause_date DATE, q6_2_hormonal_treatment VARCHAR(10), q6_3_hormonal_treatment_start_date DATE,
  q7_gyneco_pathology VARCHAR(10), q7_1_gyneco_pathology_specify TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_patho_hepato_gastro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1_1_mici_presence TEXT, q1_2_mici_start_date DATE, q1_3_mici_treated TEXT, q1_4_mici_balanced TEXT, q1_5_mici_type TEXT,
  q2_1_cirrhosis_presence TEXT, q2_2_cirrhosis_start_date DATE, q2_3_cirrhosis_treated TEXT, q2_4_cirrhosis_balanced TEXT,
  q3_1_ulcer_presence TEXT, q3_2_ulcer_start_date DATE, q3_3_ulcer_treated TEXT, q3_4_ulcer_balanced TEXT,
  q4_1_hepatitis_presence TEXT, q4_2_hepatitis_start_date DATE, q4_3_hepatitis_treatment_type TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_patho_allergique (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q0_presence TEXT, q1_pathologies_selection TEXT[],
  q2_1_asthme_treated TEXT, q2_2_asthme_balanced TEXT, q2_3_asthme_start_date DATE,
  q3_1_allergie_treated TEXT, q3_2_allergie_balanced TEXT, q3_3_allergie_start_date DATE,
  q4_1_lupus_treated TEXT, q4_2_lupus_balanced TEXT, q4_3_lupus_start_date DATE,
  q5_1_polyarthrite_treated TEXT, q5_2_polyarthrite_balanced TEXT, q5_3_polyarthrite_start_date DATE,
  q6_1_autoimmune_start_date DATE, q6_2_autoimmune_type TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_autres_patho (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q0_global_response TEXT, q1_1_neoplasique_presence TEXT, q1_2_neoplasique_date DATE, q1_3_cancer_types TEXT[], q1_4_cancer_specify TEXT,
  q2_1_vih_presence TEXT, q2_2_vih_date DATE, q2_3_vih_treated TEXT, q2_4_vih_balanced TEXT,
  q3_1_hepatite_presence TEXT, q3_2_hepatite_date DATE, q3_3_hepatite_type TEXT, q3_4_hepatite_treated TEXT, q3_5_hepatite_balanced TEXT,
  q4_1_chirurgicaux_presence TEXT, q4_2_chirurgicaux_specify TEXT,
  q5_1_genetique_presence TEXT, q5_2_genetique_specify TEXT,
  q6_0_ophtalmo_presence TEXT,
  q6_1_1_glaucome_fermeture_presence TEXT, q6_1_2_glaucome_fermeture_date DATE, q6_1_3_glaucome_fermeture_treatment_triggered TEXT, q6_1_4_glaucome_fermeture_treatment_type TEXT,
  q6_2_1_glaucome_ouvert_presence TEXT, q6_2_2_glaucome_ouvert_date DATE, q6_2_3_glaucome_ouvert_treated TEXT, q6_2_4_glaucome_ouvert_balanced TEXT,
  q6_3_1_cataracte_presence TEXT, q6_3_2_cataracte_date DATE, q6_3_3_cataracte_treated TEXT, q6_3_4_cataracte_balanced TEXT,
  q7_1_autre_presence TEXT, q7_2_autre_specify TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RLS POLICIES FOR ALL 19 TABLES
-- ============================================================================

DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'bipolar_dsm5_humeur', 'bipolar_dsm5_psychotic', 'bipolar_dsm5_comorbid',
    'bipolar_diva', 'bipolar_family_history', 'bipolar_cssrs', 'bipolar_isa',
    'bipolar_sis', 'bipolar_suicide_history', 'bipolar_perinatalite',
    'bipolar_patho_neuro', 'bipolar_patho_cardio', 'bipolar_patho_endoc',
    'bipolar_patho_dermato', 'bipolar_patho_urinaire', 'bipolar_antecedents_gyneco',
    'bipolar_patho_hepato_gastro', 'bipolar_patho_allergique', 'bipolar_autres_patho'
  ];
BEGIN
  FOREACH tbl IN ARRAY tables LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', tbl);
    
    EXECUTE format('CREATE POLICY "Professionals can view %s" ON public.%I FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN (''healthcare_professional'', ''administrator'', ''manager'')))', tbl, tbl);
    EXECUTE format('CREATE POLICY "Professionals can insert %s" ON public.%I FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN (''healthcare_professional'', ''administrator'', ''manager'')))', tbl, tbl);
    EXECUTE format('CREATE POLICY "Professionals can update %s" ON public.%I FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN (''healthcare_professional'', ''administrator'', ''manager'')))', tbl, tbl);
    EXECUTE format('CREATE POLICY "Patients can view own %s" ON public.%I FOR SELECT USING (auth.uid() = patient_id)', tbl, tbl);
    
    EXECUTE format('CREATE INDEX idx_%s_visit_id ON public.%I(visit_id)', tbl, tbl);
    EXECUTE format('CREATE INDEX idx_%s_patient_id ON public.%I(patient_id)', tbl, tbl);
    
    EXECUTE format('CREATE TRIGGER update_%s_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', tbl, tbl);
  END LOOP;
END $$;
