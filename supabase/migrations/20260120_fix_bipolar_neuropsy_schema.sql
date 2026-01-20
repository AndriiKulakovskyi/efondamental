-- ============================================================================
-- eFondaMental Platform - Fix Bipolar Neuropsy Tables Schema
-- ============================================================================
-- Updates 22 bipolar_* neuropsy tables from JSONB to individual columns
-- NO GENERATED ALWAYS AS columns - all scores computed by application
-- ============================================================================

-- ============================================================================
-- DROP EXISTING TABLES
-- ============================================================================

DROP TABLE IF EXISTS public.bipolar_cvlt CASCADE;
DROP TABLE IF EXISTS public.bipolar_tmt CASCADE;
DROP TABLE IF EXISTS public.bipolar_stroop CASCADE;
DROP TABLE IF EXISTS public.bipolar_fluences_verbales CASCADE;
DROP TABLE IF EXISTS public.bipolar_mem3_spatial CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais4_criteria CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais4_learning CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais4_matrices CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais4_code CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais4_digit_span CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais4_similitudes CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais3_criteria CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais3_learning CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais3_vocabulaire CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais3_matrices CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais3_code_symboles CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais3_digit_span CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais3_cpt2 CASCADE;
DROP TABLE IF EXISTS public.bipolar_cobra CASCADE;
DROP TABLE IF EXISTS public.bipolar_cpt3 CASCADE;
DROP TABLE IF EXISTS public.bipolar_scip CASCADE;
DROP TABLE IF EXISTS public.bipolar_test_commissions CASCADE;

-- ============================================================================
-- 1. BIPOLAR_CVLT
-- ============================================================================

CREATE TABLE public.bipolar_cvlt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  patient_age INTEGER, years_of_education INTEGER, patient_sex TEXT,
  trial_1 INTEGER, trial_2 INTEGER, trial_3 INTEGER, trial_4 INTEGER, trial_5 INTEGER,
  total_1_5 INTEGER, list_b INTEGER, sdfr INTEGER, sdcr INTEGER, ldfr INTEGER, ldcr INTEGER,
  semantic_clustering DECIMAL(5,2), serial_clustering DECIMAL(5,2),
  perseverations INTEGER, intrusions INTEGER, recognition_hits INTEGER, false_positives INTEGER,
  discriminability DECIMAL(5,2), primacy DECIMAL(5,2), recency DECIMAL(5,2), response_bias DECIMAL(5,3),
  cvlt_delai TEXT,
  trial_1_std DECIMAL(6,2), trial_5_std TEXT, total_1_5_std DECIMAL(6,2), list_b_std DECIMAL(6,2),
  sdfr_std TEXT, sdcr_std TEXT, ldfr_std TEXT, ldcr_std TEXT, semantic_std TEXT, serial_std TEXT,
  persev_std TEXT, intru_std TEXT, recog_std TEXT, false_recog_std TEXT, discrim_std TEXT,
  primacy_std DECIMAL(6,2), recency_std DECIMAL(6,2), bias_std DECIMAL(6,2),
  questionnaire_version TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 2. BIPOLAR_TMT
-- ============================================================================

CREATE TABLE public.bipolar_tmt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  patient_age INTEGER, years_of_education INTEGER,
  tmta_tps INTEGER, tmta_err INTEGER, tmta_cor INTEGER,
  tmtb_tps INTEGER, tmtb_err INTEGER, tmtb_cor INTEGER, tmtb_err_persev INTEGER,
  tmta_errtot INTEGER, tmta_tps_z DECIMAL(5,2), tmta_tps_pc INTEGER, tmta_errtot_z DECIMAL(5,2),
  tmtb_errtot INTEGER, tmtb_tps_z DECIMAL(5,2), tmtb_tps_pc INTEGER, tmtb_errtot_z DECIMAL(5,2), tmtb_err_persev_z DECIMAL(5,2),
  tmt_b_a_tps INTEGER, tmt_b_a_tps_z DECIMAL(5,2),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. BIPOLAR_STROOP
-- ============================================================================

CREATE TABLE public.bipolar_stroop (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  patient_age INTEGER,
  stroop_w_tot INTEGER, stroop_c_tot INTEGER, stroop_cw_tot INTEGER,
  stroop_w_tot_c INTEGER, stroop_c_tot_c INTEGER, stroop_cw_tot_c INTEGER,
  stroop_interf DECIMAL(6,2),
  stroop_w_note_t INTEGER, stroop_c_note_t INTEGER, stroop_cw_note_t INTEGER, stroop_interf_note_t INTEGER,
  stroop_w_note_t_corrigee DECIMAL(4,2), stroop_c_note_t_corrigee DECIMAL(4,2),
  stroop_cw_note_t_corrigee DECIMAL(4,2), stroop_interf_note_tz DECIMAL(4,2),
  stroop_w_err INTEGER, stroop_c_err INTEGER, stroop_cw_err INTEGER,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. BIPOLAR_FLUENCES_VERBALES
-- ============================================================================

CREATE TABLE public.bipolar_fluences_verbales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  patient_age INTEGER, years_of_education INTEGER,
  fv_p_tot_correct INTEGER, fv_p_deriv INTEGER, fv_p_intrus INTEGER, fv_p_propres INTEGER,
  fv_p_tot_rupregle INTEGER, fv_p_tot_correct_z DECIMAL(5,2), fv_p_tot_correct_pc INTEGER,
  fv_anim_tot_correct INTEGER, fv_anim_deriv INTEGER, fv_anim_intrus INTEGER, fv_anim_propres INTEGER,
  fv_anim_tot_rupregle INTEGER, fv_anim_tot_correct_z DECIMAL(5,2), fv_anim_tot_correct_pc INTEGER,
  fv_fruit_tot_correct INTEGER, fv_fruit_deriv INTEGER, fv_fruit_intrus INTEGER, fv_fruit_propres INTEGER,
  fv_fruit_tot_rupregle INTEGER, fv_fruit_tot_correct_z DECIMAL(5,2), fv_fruit_tot_correct_pc INTEGER,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. BIPOLAR_MEM3_SPATIAL
-- ============================================================================

CREATE TABLE public.bipolar_mem3_spatial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  patient_age INTEGER,
  odirect_1a INTEGER, odirect_1b INTEGER, odirect_2a INTEGER, odirect_2b INTEGER,
  odirect_3a INTEGER, odirect_3b INTEGER, odirect_4a INTEGER, odirect_4b INTEGER,
  odirect_5a INTEGER, odirect_5b INTEGER, odirect_6a INTEGER, odirect_6b INTEGER,
  odirect_7a INTEGER, odirect_7b INTEGER, odirect_8a INTEGER, odirect_8b INTEGER,
  inverse_1a INTEGER, inverse_1b INTEGER, inverse_2a INTEGER, inverse_2b INTEGER,
  inverse_3a INTEGER, inverse_3b INTEGER, inverse_4a INTEGER, inverse_4b INTEGER,
  inverse_5a INTEGER, inverse_5b INTEGER, inverse_6a INTEGER, inverse_6b INTEGER,
  inverse_7a INTEGER, inverse_7b INTEGER, inverse_8a INTEGER, inverse_8b INTEGER,
  mspatiale_odirect_tot INTEGER, mspatiale_odirect_std INTEGER, mspatiale_odirect_cr DECIMAL(5,2),
  mspatiale_inverse_tot INTEGER, mspatiale_inverse_std INTEGER, mspatiale_inverse_cr DECIMAL(5,2),
  mspatiale_total_brut INTEGER, mspatiale_total_std INTEGER, mspatiale_total_cr DECIMAL(5,2),
  item_notes TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6-11. WAIS-IV TABLES
-- ============================================================================

CREATE TABLE public.bipolar_wais4_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  collection_date DATE, age INTEGER, laterality VARCHAR(20),
  native_french_speaker INTEGER, time_since_last_eval VARCHAR(20), patient_euthymic INTEGER,
  no_episode_3months INTEGER, socio_prof_data_present INTEGER, years_of_education INTEGER,
  no_visual_impairment INTEGER, no_hearing_impairment INTEGER, no_ect_past_year INTEGER,
  assessment_time TIMESTAMPTZ,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais4_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  patient_age INTEGER, years_of_education INTEGER,
  item_01 INTEGER, item_02 INTEGER, item_03 INTEGER, item_04 INTEGER, item_05 INTEGER,
  item_06 INTEGER, item_07 INTEGER, item_08 INTEGER, item_09 INTEGER, item_10 INTEGER,
  item_11 INTEGER, item_12 INTEGER, item_13 INTEGER, item_14 INTEGER, item_15 INTEGER, item_16 INTEGER,
  raw_score INTEGER, standardized_score INTEGER, percentile_rank DECIMAL(5,2),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais4_matrices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  patient_age INTEGER,
  item_01 INTEGER, item_02 INTEGER, item_03 INTEGER, item_04 INTEGER, item_05 INTEGER,
  item_06 INTEGER, item_07 INTEGER, item_08 INTEGER, item_09 INTEGER, item_10 INTEGER,
  item_11 INTEGER, item_12 INTEGER, item_13 INTEGER, item_14 INTEGER, item_15 INTEGER,
  item_16 INTEGER, item_17 INTEGER, item_18 INTEGER, item_19 INTEGER, item_20 INTEGER,
  item_21 INTEGER, item_22 INTEGER, item_23 INTEGER, item_24 INTEGER, item_25 INTEGER, item_26 INTEGER,
  raw_score INTEGER, standardized_score INTEGER, percentile_rank DECIMAL(5,2),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais4_code (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  patient_age INTEGER, total_correct INTEGER, total_errors INTEGER,
  raw_score INTEGER, standardized_score INTEGER, z_score DECIMAL(5,2),
  ivt_total_correct INTEGER, ivt_total_errors INTEGER, ivt_standardized_score INTEGER, ivt_z_score DECIMAL(5,2),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais4_digit_span (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  patient_age INTEGER,
  forward_raw INTEGER, forward_span INTEGER, forward_std INTEGER, forward_z DECIMAL(5,2),
  backward_raw INTEGER, backward_span INTEGER, backward_std INTEGER, backward_z DECIMAL(5,2),
  sequencing_raw INTEGER, sequencing_span INTEGER, sequencing_std INTEGER, sequencing_z DECIMAL(5,2),
  total_raw INTEGER, total_std INTEGER, percentile_rank DECIMAL(5,2), total_z DECIMAL(5,2),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais4_similitudes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  patient_age INTEGER,
  item_01 INTEGER, item_02 INTEGER, item_03 INTEGER, item_04 INTEGER, item_05 INTEGER,
  item_06 INTEGER, item_07 INTEGER, item_08 INTEGER, item_09 INTEGER, item_10 INTEGER,
  item_11 INTEGER, item_12 INTEGER, item_13 INTEGER, item_14 INTEGER, item_15 INTEGER,
  item_16 INTEGER, item_17 INTEGER, item_18 INTEGER,
  raw_score INTEGER, standardized_score INTEGER, percentile_rank DECIMAL(5,2),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 12-18. WAIS-III TABLES
-- ============================================================================

CREATE TABLE public.bipolar_wais3_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  collection_date DATE, age INTEGER, laterality VARCHAR(20),
  native_french_speaker INTEGER, time_since_last_eval VARCHAR(20), patient_euthymic INTEGER,
  no_episode_3months INTEGER, socio_prof_data_present INTEGER, years_of_education INTEGER,
  no_visual_impairment INTEGER, no_hearing_impairment INTEGER, no_ect_past_year INTEGER,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais3_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  patient_age INTEGER, years_of_education INTEGER,
  item_01 INTEGER, item_02 INTEGER, item_03 INTEGER, item_04 INTEGER, item_05 INTEGER,
  item_06 INTEGER, item_07 INTEGER, item_08 INTEGER, item_09 INTEGER, item_10 INTEGER,
  item_11 INTEGER, item_12 INTEGER, item_13 INTEGER, item_14 INTEGER, item_15 INTEGER, item_16 INTEGER,
  raw_score INTEGER, standardized_score INTEGER, percentile_rank DECIMAL(5,2),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais3_vocabulaire (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  patient_age INTEGER,
  item_01 INTEGER, item_02 INTEGER, item_03 INTEGER, item_04 INTEGER, item_05 INTEGER,
  item_06 INTEGER, item_07 INTEGER, item_08 INTEGER, item_09 INTEGER, item_10 INTEGER,
  item_11 INTEGER, item_12 INTEGER, item_13 INTEGER, item_14 INTEGER, item_15 INTEGER,
  item_16 INTEGER, item_17 INTEGER, item_18 INTEGER, item_19 INTEGER, item_20 INTEGER,
  item_21 INTEGER, item_22 INTEGER, item_23 INTEGER, item_24 INTEGER, item_25 INTEGER,
  item_26 INTEGER, item_27 INTEGER, item_28 INTEGER, item_29 INTEGER, item_30 INTEGER,
  item_31 INTEGER, item_32 INTEGER, item_33 INTEGER,
  raw_score INTEGER, standardized_score INTEGER, percentile_rank DECIMAL(5,2),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais3_matrices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  patient_age INTEGER,
  item_01 INTEGER, item_02 INTEGER, item_03 INTEGER, item_04 INTEGER, item_05 INTEGER,
  item_06 INTEGER, item_07 INTEGER, item_08 INTEGER, item_09 INTEGER, item_10 INTEGER,
  item_11 INTEGER, item_12 INTEGER, item_13 INTEGER, item_14 INTEGER, item_15 INTEGER,
  item_16 INTEGER, item_17 INTEGER, item_18 INTEGER, item_19 INTEGER, item_20 INTEGER,
  item_21 INTEGER, item_22 INTEGER, item_23 INTEGER, item_24 INTEGER, item_25 INTEGER, item_26 INTEGER,
  raw_score INTEGER, standardized_score INTEGER, percentile_rank DECIMAL(5,2),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais3_code_symboles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  patient_age INTEGER, total_correct INTEGER, total_errors INTEGER,
  raw_score INTEGER, standardized_score INTEGER, z_score DECIMAL(5,2),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais3_digit_span (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  patient_age INTEGER,
  forward_raw INTEGER, forward_span INTEGER, forward_std INTEGER, forward_z DECIMAL(5,2),
  backward_raw INTEGER, backward_span INTEGER, backward_std INTEGER, backward_z DECIMAL(5,2),
  total_raw INTEGER, total_std INTEGER, percentile_rank DECIMAL(5,2), total_z DECIMAL(5,2),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais3_cpt2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  d_prime DECIMAL(6,2), d_prime_interp TEXT,
  omissions DECIMAL(6,2), omissions_interp TEXT,
  commissions DECIMAL(6,2), commissions_interp TEXT,
  perseverations DECIMAL(6,2), perseverations_interp TEXT,
  hrt DECIMAL(8,2), hrt_interp TEXT,
  hrt_sd DECIMAL(8,2), hrt_sd_interp TEXT,
  variability DECIMAL(8,2), variability_interp TEXT,
  hrt_block_change DECIMAL(8,2), hrt_block_change_interp TEXT,
  hrt_isi_change DECIMAL(8,2), hrt_isi_change_interp TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 19-22. OTHER NEUROPSY TABLES
-- ============================================================================

CREATE TABLE public.bipolar_cobra (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER, q5 INTEGER, q6 INTEGER, q7 INTEGER, q8 INTEGER,
  q9 INTEGER, q10 INTEGER, q11 INTEGER, q12 INTEGER, q13 INTEGER, q14 INTEGER, q15 INTEGER, q16 INTEGER,
  total_score INTEGER,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_cpt3 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  d_prime DECIMAL(6,2), d_prime_interp TEXT,
  omissions DECIMAL(6,2), omissions_interp TEXT,
  commissions DECIMAL(6,2), commissions_interp TEXT,
  perseverations DECIMAL(6,2), perseverations_interp TEXT,
  hrt DECIMAL(8,2), hrt_interp TEXT,
  hrt_sd DECIMAL(8,2), hrt_sd_interp TEXT,
  variability DECIMAL(8,2), variability_interp TEXT,
  hrt_block_change DECIMAL(8,2), hrt_block_change_interp TEXT,
  hrt_isi_change DECIMAL(8,2), hrt_isi_change_interp TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_scip (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  scipv01a DECIMAL(5,2), scipv02a DECIMAL(5,2), scipv03a DECIMAL(5,2), scipv04a DECIMAL(5,2), scipv05a DECIMAL(5,2),
  scipv01b DECIMAL(6,2), scipv02b DECIMAL(6,2), scipv03b DECIMAL(6,2), scipv04b DECIMAL(6,2), scipv05b DECIMAL(6,2),
  scip_version TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_test_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  patient_age INTEGER, nsc INTEGER,
  com01 INTEGER, com02 INTEGER, com03 INTEGER, com04 INTEGER, com05 TEXT,
  com01s1 TEXT, com01s2 DECIMAL(6,2),
  com02s1 TEXT, com02s2 DECIMAL(6,2),
  com03s1 TEXT, com03s2 DECIMAL(6,2),
  com04s1 TEXT, com04s2 DECIMAL(6,2),
  com04s3 INTEGER, com04s4 TEXT, com04s5 DECIMAL(6,2),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(), created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RLS POLICIES FOR ALL 22 TABLES
-- ============================================================================

DO $$
DECLARE
  tbl TEXT;
  tables TEXT[] := ARRAY[
    'bipolar_cvlt', 'bipolar_tmt', 'bipolar_stroop', 'bipolar_fluences_verbales', 'bipolar_mem3_spatial',
    'bipolar_wais4_criteria', 'bipolar_wais4_learning', 'bipolar_wais4_matrices', 'bipolar_wais4_code',
    'bipolar_wais4_digit_span', 'bipolar_wais4_similitudes',
    'bipolar_wais3_criteria', 'bipolar_wais3_learning', 'bipolar_wais3_vocabulaire', 'bipolar_wais3_matrices',
    'bipolar_wais3_code_symboles', 'bipolar_wais3_digit_span', 'bipolar_wais3_cpt2',
    'bipolar_cobra', 'bipolar_cpt3', 'bipolar_scip', 'bipolar_test_commissions'
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
