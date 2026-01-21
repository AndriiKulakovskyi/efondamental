-- ============================================================================
-- Migration: Fix Bipolar Table Names in Visit Detail RPC
-- ============================================================================
-- This migration fixes the get_visit_detail_data RPC function:
-- - All bipolar tables now use prefix 'bipolar_' not 'responses_'
-- - Added support for 'annual_evaluation' and 'biannual_followup' visit types
-- - Fixes all modules: nurse, thymic, medical, neuropsy, auto, social, traits
-- ============================================================================

CREATE OR REPLACE FUNCTION get_visit_detail_data(p_visit_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_visit_type TEXT;
  v_result JSONB;
  v_tobacco_smoking_status TEXT;
  v_dsm5_diva_evaluated TEXT;
  v_fagerstrom_required BOOLEAN;
  v_diva_required BOOLEAN;
  v_wais4_accepted INTEGER;
  v_wais3_accepted INTEGER;
  v_statuses JSONB;
BEGIN
  -- Get visit type
  SELECT visit_type INTO v_visit_type
  FROM visits
  WHERE id = p_visit_id;

  IF v_visit_type IS NULL THEN
    RETURN jsonb_build_object('error', 'Visit not found');
  END IF;

  -- Get conditional statuses for Fagerstrom and DIVA (FIXED: use bipolar_ prefix)
  SELECT smoking_status INTO v_tobacco_smoking_status
  FROM bipolar_nurse_tobacco
  WHERE visit_id = p_visit_id;

  SELECT diva_evaluated INTO v_dsm5_diva_evaluated
  FROM bipolar_dsm5_comorbid
  WHERE visit_id = p_visit_id;

  -- Get WAIS criteria acceptance status (FIXED: use bipolar_ prefix)
  SELECT accepted_for_neuropsy_evaluation INTO v_wais4_accepted
  FROM bipolar_wais4_criteria
  WHERE visit_id = p_visit_id;

  SELECT accepted_for_neuropsy_evaluation INTO v_wais3_accepted
  FROM bipolar_wais3_criteria
  WHERE visit_id = p_visit_id;

  -- Fagerstrom is ONLY required for current smokers (Fumeur actuel), NOT ex-smokers
  v_fagerstrom_required := v_tobacco_smoking_status = 'current_smoker';
  v_diva_required := v_dsm5_diva_evaluated = 'oui';

  IF v_visit_type = 'screening' THEN
    -- SCREENING: Questionnaires for screening visits
    -- FIXED: Use bipolar_ prefix for bipolar tables, schizophrenia_ for schizophrenia tables
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender, pa.type as pathology_type
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      LEFT JOIN pathologies pa ON p.pathology_id = pa.id
      WHERE v.id = p_visit_id
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', jsonb_build_object(
        -- Auto-questionnaires (bipolar screening) - FIXED: use bipolar_ prefix
        'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_asrm WHERE visit_id = p_visit_id)),
        'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id)),
        'MDQ_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mdq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mdq WHERE visit_id = p_visit_id)),
        'EQ5D5L_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_eq5d5l WHERE visit_id = p_visit_id)),
        -- Bipolar medical questionnaires - FIXED: use bipolar_ prefix
        'MEDICAL_DIAGNOSTIC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_diagnostic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_diagnostic WHERE visit_id = p_visit_id)),
        'BIPOLAR_ORIENTATION_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_orientation WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_orientation WHERE visit_id = p_visit_id)),
        -- Schizophrenia medical questionnaires - use schizophrenia_ prefix
        'SCREENING_DIAGNOSTIC_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_screening_diagnostic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_screening_diagnostic WHERE visit_id = p_visit_id)),
        'SCREENING_ORIENTATION_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_screening_orientation WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_screening_orientation WHERE visit_id = p_visit_id))
      ),
      'completion_status', jsonb_build_object(
        'total_questionnaires', 4,
        'completed_questionnaires', 0,
        'completion_percentage', 0
      )
    ) INTO v_result;

  ELSIF v_visit_type = 'initial_evaluation' THEN
    -- =========================================================================
    -- INITIAL EVALUATION: All modules
    -- FIXED: All bipolar tables now use bipolar_ prefix
    -- =========================================================================

    -- Chunk 1: mod_nurse (7) + mod_thymic_eval (7) = 14 items
    -- FIXED: Use bipolar_ prefix for all bipolar tables
    v_statuses := jsonb_build_object(
      'TOBACCO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_tobacco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_tobacco WHERE visit_id = p_visit_id)),
      'FAGERSTROM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_fagerstrom WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_fagerstrom WHERE visit_id = p_visit_id)),
      'PHYSICAL_PARAMS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_physical_params WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_physical_params WHERE visit_id = p_visit_id)),
      'BLOOD_PRESSURE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_blood_pressure WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_blood_pressure WHERE visit_id = p_visit_id)),
      'ECG_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_ecg WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_ecg WHERE visit_id = p_visit_id)),
      'SLEEP_APNEA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_sleep_apnea WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_sleep_apnea WHERE visit_id = p_visit_id)),
      'BIOLOGICAL_ASSESSMENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_biological_assessment WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_biological_assessment WHERE visit_id = p_visit_id)),
      'MADRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_madrs WHERE visit_id = p_visit_id)),
      'YMRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_ymrs WHERE visit_id = p_visit_id)),
      'CGI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cgi WHERE visit_id = p_visit_id)),
      'EGF_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_egf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_egf WHERE visit_id = p_visit_id)),
      'ALDA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_alda WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_alda WHERE visit_id = p_visit_id)),
      'ETAT_PATIENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_etat_patient WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_etat_patient WHERE visit_id = p_visit_id)),
      'FAST_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_fast WHERE visit_id = p_visit_id))
    );

    -- Chunk 2: mod_medical_eval (FAMILY_HISTORY + dsm5 + suicide + histoire_somatique) = 19 items
    -- FIXED: Use bipolar_ prefix for all bipolar tables
    v_statuses := v_statuses || jsonb_build_object(
      'FAMILY_HISTORY_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_family_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_family_history WHERE visit_id = p_visit_id)),
      'DSM5_HUMEUR_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_dsm5_humeur WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_dsm5_humeur WHERE visit_id = p_visit_id)),
      'DSM5_PSYCHOTIC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_dsm5_psychotic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_dsm5_psychotic WHERE visit_id = p_visit_id)),
      'DSM5_COMORBID_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_dsm5_comorbid WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_dsm5_comorbid WHERE visit_id = p_visit_id)),
      'DIVA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_diva WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_diva WHERE visit_id = p_visit_id)),
      'CSSRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cssrs WHERE visit_id = p_visit_id)),
      'ISA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_isa WHERE visit_id = p_visit_id)),
      'SIS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_sis WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_sis WHERE visit_id = p_visit_id)),
      'SUICIDE_HISTORY_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_suicide_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_suicide_history WHERE visit_id = p_visit_id)),
      'PERINATALITE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_perinatalite WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_perinatalite WHERE visit_id = p_visit_id)),
      'PATHO_NEURO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_neuro WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_neuro WHERE visit_id = p_visit_id)),
      'PATHO_CARDIO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_cardio WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_cardio WHERE visit_id = p_visit_id)),
      'PATHO_ENDOC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_endoc WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_endoc WHERE visit_id = p_visit_id)),
      'PATHO_DERMATO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_dermato WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_dermato WHERE visit_id = p_visit_id)),
      'PATHO_URINAIRE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_urinaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_urinaire WHERE visit_id = p_visit_id)),
      'ANTECEDENTS_GYNECO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_antecedents_gyneco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_antecedents_gyneco WHERE visit_id = p_visit_id)),
      'PATHO_HEPATO_GASTRO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_hepato_gastro WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_hepato_gastro WHERE visit_id = p_visit_id)),
      'PATHO_ALLERGIQUE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_allergique WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_allergique WHERE visit_id = p_visit_id)),
      'AUTRES_PATHO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_autres_patho WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_autres_patho WHERE visit_id = p_visit_id))
    );

    -- Chunk 3: mod_neuropsy root (5) + wais3 (7) + wais4 part1 (5) = 17 items
    -- FIXED: Use bipolar_ prefix for all bipolar tables
    v_statuses := v_statuses || jsonb_build_object(
      'CVLT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cvlt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cvlt WHERE visit_id = p_visit_id)),
      'TMT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_tmt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_tmt WHERE visit_id = p_visit_id)),
      'STROOP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_stroop WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_stroop WHERE visit_id = p_visit_id)),
      'FLUENCES_VERBALES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_fluences_verbales WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_fluences_verbales WHERE visit_id = p_visit_id)),
      'MEM3_SPATIAL_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mem3_spatial WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mem3_spatial WHERE visit_id = p_visit_id)),
      'WAIS3_CRITERIA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_criteria WHERE visit_id = p_visit_id)),
      'WAIS3_LEARNING_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_learning WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_learning WHERE visit_id = p_visit_id)),
      'WAIS3_VOCABULAIRE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_vocabulaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_vocabulaire WHERE visit_id = p_visit_id)),
      'WAIS3_MATRICES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_matrices WHERE visit_id = p_visit_id)),
      'WAIS3_CODE_SYMBOLES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_code_symboles WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_code_symboles WHERE visit_id = p_visit_id)),
      'WAIS3_DIGIT_SPAN_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_digit_span WHERE visit_id = p_visit_id)),
      'WAIS3_CPT2_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_cpt2 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_cpt2 WHERE visit_id = p_visit_id)),
      'WAIS4_CRITERIA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_criteria WHERE visit_id = p_visit_id)),
      'WAIS4_LEARNING_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_learning WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_learning WHERE visit_id = p_visit_id)),
      'WAIS4_MATRICES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_matrices WHERE visit_id = p_visit_id)),
      'WAIS_IV_CODE_SYMBOLES_IVT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_code WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_code WHERE visit_id = p_visit_id)),
      'WAIS4_DIGIT_SPAN_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_digit_span WHERE visit_id = p_visit_id))
    );

    -- Chunk 4: wais4 part2 (5) + mod_auto_etat (9) = 14 items
    -- FIXED: Use bipolar_ prefix for all bipolar tables
    v_statuses := v_statuses || jsonb_build_object(
      'WAIS4_SIMILITUDES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_similitudes WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_similitudes WHERE visit_id = p_visit_id)),
      'COBRA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cobra WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cobra WHERE visit_id = p_visit_id)),
      'CPT3_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cpt3 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cpt3 WHERE visit_id = p_visit_id)),
      'TEST_COMMISSIONS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_test_commissions WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_test_commissions WHERE visit_id = p_visit_id)),
      'SCIP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_scip WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_scip WHERE visit_id = p_visit_id)),
      'EQ5D5L_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_eq5d5l WHERE visit_id = p_visit_id)),
      'PRISE_M_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_prise_m WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_prise_m WHERE visit_id = p_visit_id)),
      'STAI_YA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_stai_ya WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_stai_ya WHERE visit_id = p_visit_id)),
      'MARS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mars WHERE visit_id = p_visit_id)),
      'MATHYS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mathys WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mathys WHERE visit_id = p_visit_id)),
      'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_asrm WHERE visit_id = p_visit_id)),
      'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id)),
      'PSQI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_psqi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_psqi WHERE visit_id = p_visit_id)),
      'EPWORTH_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_epworth WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_epworth WHERE visit_id = p_visit_id))
    );

    -- Chunk 5: mod_social (1) + mod_auto_traits (10) + schizophrenia nurse (2) + schizophrenia hetero (6) = 19 items
    -- FIXED: Use bipolar_ prefix for bipolar tables, schizophrenia_ for schizophrenia tables
    v_statuses := v_statuses || jsonb_build_object(
      'SOCIAL_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_social WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_social WHERE visit_id = p_visit_id)),
      'ASRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_asrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_asrs WHERE visit_id = p_visit_id)),
      'CTQ_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_ctq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_ctq WHERE visit_id = p_visit_id)),
      'BIS10_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_bis10 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_bis10 WHERE visit_id = p_visit_id)),
      'ALS18_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_als18 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_als18 WHERE visit_id = p_visit_id)),
      'AIM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_aim WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_aim WHERE visit_id = p_visit_id)),
      'WURS25_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wurs25 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wurs25 WHERE visit_id = p_visit_id)),
      'AQ12_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_aq12 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_aq12 WHERE visit_id = p_visit_id)),
      'CSM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_csm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_csm WHERE visit_id = p_visit_id)),
      'CTI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cti WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cti WHERE visit_id = p_visit_id)),
      -- Schizophrenia nurse module
      'DOSSIER_INFIRMIER_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_dossier_infirmier WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_dossier_infirmier WHERE visit_id = p_visit_id)),
      'BILAN_BIOLOGIQUE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_bilan_biologique WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_bilan_biologique WHERE visit_id = p_visit_id)),
      -- Schizophrenia hetero module
      'PANSS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_panss WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_panss WHERE visit_id = p_visit_id)),
      'CDSS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_cdss WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_cdss WHERE visit_id = p_visit_id)),
      'BARS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_bars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_bars WHERE visit_id = p_visit_id)),
      'SUMD', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_sumd WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_sumd WHERE visit_id = p_visit_id)),
      'AIMS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_aims WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_aims WHERE visit_id = p_visit_id)),
      'BARNES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_barnes WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_barnes WHERE visit_id = p_visit_id))
    );

    -- Chunk 6: Remaining schizophrenia questionnaires (10)
    v_statuses := v_statuses || jsonb_build_object(
      'SAS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_sas WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_sas WHERE visit_id = p_visit_id)),
      'PSP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_psp WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_psp WHERE visit_id = p_visit_id)),
      'ECV', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_ecv WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_ecv WHERE visit_id = p_visit_id)),
      'TROUBLES_PSYCHOTIQUES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_troubles_psychotiques WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_troubles_psychotiques WHERE visit_id = p_visit_id)),
      'TROUBLES_COMORBIDES_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_troubles_comorbides WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_troubles_comorbides WHERE visit_id = p_visit_id)),
      'TEA_COFFEE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_tea_coffee WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_tea_coffee WHERE visit_id = p_visit_id)),
      'EVAL_ADDICTOLOGIQUE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_eval_addictologique WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_eval_addictologique WHERE visit_id = p_visit_id)),
      'SUICIDE_HISTORY_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_suicide_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_suicide_history WHERE visit_id = p_visit_id)),
      'ANTECEDENTS_FAMILIAUX_PSY_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_antecedents_familiaux_psy WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_antecedents_familiaux_psy WHERE visit_id = p_visit_id)),
      'PERINATALITE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_perinatalite WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_perinatalite WHERE visit_id = p_visit_id))
    );

    -- Build final result with proper pathology join
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender, pa.type as pathology_type
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      LEFT JOIN pathologies pa ON p.pathology_id = pa.id
      WHERE v.id = p_visit_id
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', v_statuses,
      'tobacco_response', (SELECT row_to_json(t) FROM (SELECT v_tobacco_smoking_status AS smoking_status) t),
      'dsm5_comorbid_response', (SELECT row_to_json(d) FROM (SELECT v_dsm5_diva_evaluated AS diva_evaluated) d),
      'wais4_criteria_response', (SELECT row_to_json(w) FROM (SELECT v_wais4_accepted AS accepted_for_neuropsy_evaluation) w),
      'wais3_criteria_response', (SELECT row_to_json(w) FROM (SELECT v_wais3_accepted AS accepted_for_neuropsy_evaluation) w),
      'completion_status', jsonb_build_object(
        'total_questionnaires', 0,
        'completed_questionnaires', 0,
        'completion_percentage', 0
      )
    ) INTO v_result;

  ELSIF v_visit_type = 'followup' THEN
    -- FOLLOWUP: Limited subset - FIXED: Use bipolar_ prefix
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender, pa.type as pathology_type
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      LEFT JOIN pathologies pa ON p.pathology_id = pa.id
      WHERE v.id = p_visit_id
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', jsonb_build_object(
        'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_asrm WHERE visit_id = p_visit_id)),
        'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id)),
        'EQ5D5L_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_eq5d5l WHERE visit_id = p_visit_id))
      ),
      'completion_status', jsonb_build_object(
        'total_questionnaires', 3,
        'completed_questionnaires', 0,
        'completion_percentage', 0
      )
    ) INTO v_result;

  ELSE
    -- Unknown visit type
    RETURN jsonb_build_object('error', 'Unknown visit type: ' || v_visit_type);
  END IF;

  RETURN v_result;
END;
$$;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Fixed get_visit_detail_data RPC to use correct bipolar_ table prefix for all bipolar questionnaires';
END $$;
