-- ============================================================================
-- Migration: Add PANSS and CDSS to get_visit_detail_data RPC
-- ============================================================================
-- Adds schizophrenia hetero-questionnaires (PANSS, CDSS) to the visit detail
-- RPC function for initial_evaluation visits.
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
BEGIN
  -- Get visit type
  SELECT visit_type INTO v_visit_type FROM visits WHERE id = p_visit_id;
  
  IF v_visit_type IS NULL THEN
    RETURN jsonb_build_object('error', 'Visit not found');
  END IF;
  
  -- Get conditional statuses for Fagerstrom and DIVA
  SELECT smoking_status INTO v_tobacco_smoking_status 
  FROM responses_tobacco WHERE visit_id = p_visit_id;
  
  SELECT diva_evaluated INTO v_dsm5_diva_evaluated 
  FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id;
  
  -- Get WAIS criteria acceptance status
  SELECT accepted_for_neuropsy_evaluation INTO v_wais4_accepted
  FROM responses_wais4_criteria WHERE visit_id = p_visit_id;
  
  SELECT accepted_for_neuropsy_evaluation INTO v_wais3_accepted
  FROM responses_wais3_criteria WHERE visit_id = p_visit_id;
  
  -- Fagerstrom is ONLY required for current smokers (Fumeur actuel), NOT ex-smokers
  v_fagerstrom_required := v_tobacco_smoking_status = 'current_smoker';
  v_diva_required := v_dsm5_diva_evaluated = 'oui';
  
  IF v_visit_type = 'screening' THEN
    -- =========================================================================
    -- SCREENING VISIT: 5 questionnaires
    -- mod_auto: ASRM, QIDS, MDQ
    -- mod_medical: MEDICAL_DIAGNOSTIC, BIPOLAR_ORIENTATION
    -- =========================================================================
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      WHERE v.id = p_visit_id
    ),
    questionnaire_statuses AS (
      SELECT jsonb_build_object(
        'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrm WHERE visit_id = p_visit_id)),
        'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids_sr16 WHERE visit_id = p_visit_id)),
        'MDQ_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mdq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mdq WHERE visit_id = p_visit_id)),
        'MEDICAL_DIAGNOSTIC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_medical_diagnostic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_medical_diagnostic WHERE visit_id = p_visit_id)),
        'BIPOLAR_ORIENTATION_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_bipolar_orientation WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_bipolar_orientation WHERE visit_id = p_visit_id)),
        -- Schizophrenia screening
        'SCREENING_DIAGNOSTIC_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_screening_sz_diagnostic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_screening_sz_diagnostic WHERE visit_id = p_visit_id)),
        'SCREENING_ORIENTATION_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_screening_sz_orientation WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_screening_sz_orientation WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    completion_calc AS (
      SELECT 5 AS total_questionnaires,
        ((CASE WHEN EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_mdq WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_medical_diagnostic WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_bipolar_orientation WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END)) AS completed_questionnaires
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', (SELECT statuses FROM questionnaire_statuses),
      'completion_status', (SELECT jsonb_build_object('total_questionnaires', total_questionnaires, 'completed_questionnaires', completed_questionnaires, 'completion_percentage', CASE WHEN total_questionnaires > 0 THEN ROUND((completed_questionnaires::numeric / total_questionnaires::numeric) * 100) ELSE 0 END) FROM completion_calc)
    ) INTO v_result;

  ELSIF v_visit_type = 'initial_evaluation' THEN
    -- =========================================================================
    -- INITIAL EVALUATION: All modules
    -- mod_nurse: 7 (TOBACCO, FAGERSTROM, PHYSICAL_PARAMS, BLOOD_PRESSURE, ECG, SLEEP_APNEA, BIOLOGICAL_ASSESSMENT)
    -- mod_thymic_eval: 7 (MADRS, YMRS, CGI, EGF, ALDA, ETAT_PATIENT, FAST)
    -- mod_medical_eval: 1 root + sections
    --   dsm5: 4 (DSM5_HUMEUR, DSM5_PSYCHOTIC, DSM5_COMORBID, DIVA)
    --   suicide: 4 (CSSRS, ISA, SIS, SUICIDE_HISTORY)
    --   histoire_somatique: 10 (PERINATALITE, PATHO_NEURO, PATHO_CARDIO, PATHO_ENDOC, PATHO_DERMATO, PATHO_URINAIRE, ANTECEDENTS_GYNECO, PATHO_HEPATO_GASTRO, PATHO_ALLERGIQUE, AUTRES_PATHO)
    --   root: FAMILY_HISTORY
    -- mod_neuropsy: 5 root + sections
    --   root: CVLT, TMT, STROOP, FLUENCES_VERBALES, MEM3_SPATIAL
    --   wais3: 7 (WAIS3_CRITERIA, WAIS3_LEARNING, WAIS3_VOCABULAIRE, WAIS3_MATRICES, WAIS3_CODE_SYMBOLES, WAIS3_DIGIT_SPAN, WAIS3_CPT2)
    --   wais4: 10 (WAIS4_CRITERIA, WAIS4_LEARNING, WAIS4_MATRICES, WAIS4_CODE, WAIS4_DIGIT_SPAN, WAIS4_SIMILITUDES, COBRA, CPT3, TEST_COMMISSIONS, SCIP)
    -- mod_auto_etat: 9 (EQ5D5L, PRISE_M, STAI_YA, MARS, MATHYS, ASRM, QIDS, PSQI, EPWORTH)
    -- mod_social: 1 (SOCIAL)
    -- mod_auto_traits: 9 (ASRS, CTQ, BIS10, ALS18, AIM, WURS25, AQ12, CSM, CTI)
    -- mod_hetero (schizophrenia): 2 (PANSS, CDSS)
    -- mod_nurse (schizophrenia): 2 (INF_DOSSIER_INFIRMIER, INF_BILAN_BIOLOGIQUE_SZ)
    -- =========================================================================
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      WHERE v.id = p_visit_id
    ),
    questionnaire_statuses AS (
      SELECT jsonb_build_object(
        -- mod_nurse (7)
        'TOBACCO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tobacco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tobacco WHERE visit_id = p_visit_id)),
        'FAGERSTROM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fagerstrom WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fagerstrom WHERE visit_id = p_visit_id)),
        'PHYSICAL_PARAMS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_physical_params WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_physical_params WHERE visit_id = p_visit_id)),
        'BLOOD_PRESSURE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_blood_pressure WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_blood_pressure WHERE visit_id = p_visit_id)),
        'ECG_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ecg WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ecg WHERE visit_id = p_visit_id)),
        'SLEEP_APNEA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_sleep_apnea WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_sleep_apnea WHERE visit_id = p_visit_id)),
        'BIOLOGICAL_ASSESSMENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_biological_assessment WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_biological_assessment WHERE visit_id = p_visit_id)),
        -- mod_thymic_eval (7)
        'MADRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_madrs WHERE visit_id = p_visit_id)),
        'YMRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ymrs WHERE visit_id = p_visit_id)),
        'CGI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cgi WHERE visit_id = p_visit_id)),
        'EGF_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_egf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_egf WHERE visit_id = p_visit_id)),
        'ALDA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_alda WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_alda WHERE visit_id = p_visit_id)),
        'ETAT_PATIENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_etat_patient WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_etat_patient WHERE visit_id = p_visit_id)),
        'FAST_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fast WHERE visit_id = p_visit_id)),
        -- mod_medical_eval root (1)
        'FAMILY_HISTORY_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_family_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_family_history WHERE visit_id = p_visit_id)),
        -- mod_medical_eval > dsm5 section (4)
        'DSM5_HUMEUR_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_humeur WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_humeur WHERE visit_id = p_visit_id)),
        'DSM5_PSYCHOTIC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_psychotic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_psychotic WHERE visit_id = p_visit_id)),
        'DSM5_COMORBID_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id)),
        'DIVA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_diva WHERE visit_id = p_visit_id)),
        -- mod_medical_eval > suicide section (4)
        'CSSRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cssrs WHERE visit_id = p_visit_id)),
        'ISA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_isa WHERE visit_id = p_visit_id)),
        'SIS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_sis WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_sis WHERE visit_id = p_visit_id)),
        'SUICIDE_HISTORY_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_suicide_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_suicide_history WHERE visit_id = p_visit_id)),
        -- mod_medical_eval > histoire_somatique section (10)
        'PERINATALITE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_perinatalite WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_perinatalite WHERE visit_id = p_visit_id)),
        'PATHO_NEURO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_neuro WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_neuro WHERE visit_id = p_visit_id)),
        'PATHO_CARDIO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_cardio WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_cardio WHERE visit_id = p_visit_id)),
        'PATHO_ENDOC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_endoc WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_endoc WHERE visit_id = p_visit_id)),
        'PATHO_DERMATO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_dermato WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_dermato WHERE visit_id = p_visit_id)),
        'PATHO_URINAIRE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_urinaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_urinaire WHERE visit_id = p_visit_id)),
        'ANTECEDENTS_GYNECO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_antecedents_gyneco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_antecedents_gyneco WHERE visit_id = p_visit_id)),
        'PATHO_HEPATO_GASTRO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_hepato_gastro WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_hepato_gastro WHERE visit_id = p_visit_id)),
        'PATHO_ALLERGIQUE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_allergique WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_allergique WHERE visit_id = p_visit_id)),
        'AUTRES_PATHO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_autres_patho WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_autres_patho WHERE visit_id = p_visit_id)),
        -- mod_neuropsy root (5)
        'CVLT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cvlt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cvlt WHERE visit_id = p_visit_id)),
        'TMT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tmt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tmt WHERE visit_id = p_visit_id)),
        'STROOP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_stroop WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_stroop WHERE visit_id = p_visit_id)),
        'FLUENCES_VERBALES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fluences_verbales WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fluences_verbales WHERE visit_id = p_visit_id)),
        'MEM3_SPATIAL_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mem3_spatial WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mem3_spatial WHERE visit_id = p_visit_id)),
        -- mod_neuropsy > wais3 section (7)
        'WAIS3_CRITERIA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_criteria WHERE visit_id = p_visit_id)),
        'WAIS3_LEARNING_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_learning WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_learning WHERE visit_id = p_visit_id)),
        'WAIS3_VOCABULAIRE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id)),
        'WAIS3_MATRICES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_matrices WHERE visit_id = p_visit_id)),
        'WAIS3_CODE_SYMBOLES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_code_symboles WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_code_symboles WHERE visit_id = p_visit_id)),
        'WAIS3_DIGIT_SPAN_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_digit_span WHERE visit_id = p_visit_id)),
        'WAIS3_CPT2_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_cpt2 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_cpt2 WHERE visit_id = p_visit_id)),
        -- mod_neuropsy > wais4 section (10)
        'WAIS4_CRITERIA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_criteria WHERE visit_id = p_visit_id)),
        'WAIS4_LEARNING_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_learning WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_learning WHERE visit_id = p_visit_id)),
        'WAIS4_MATRICES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_matrices WHERE visit_id = p_visit_id)),
        'WAIS_IV_CODE_SYMBOLES_IVT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_code WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_code WHERE visit_id = p_visit_id)),
        'WAIS4_DIGIT_SPAN_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_digit_span WHERE visit_id = p_visit_id)),
        'WAIS4_SIMILITUDES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_similitudes WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_similitudes WHERE visit_id = p_visit_id)),
        'COBRA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cobra WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cobra WHERE visit_id = p_visit_id)),
        'CPT3_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cpt3 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cpt3 WHERE visit_id = p_visit_id)),
        'TEST_COMMISSIONS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_test_commissions WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_test_commissions WHERE visit_id = p_visit_id)),
        'SCIP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_scip WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_scip WHERE visit_id = p_visit_id)),
        -- mod_auto_etat (9)
        'EQ5D5L_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_eq5d5l WHERE visit_id = p_visit_id)),
        'PRISE_M_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_prise_m WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_prise_m WHERE visit_id = p_visit_id)),
        'STAI_YA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_stai_ya WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_stai_ya WHERE visit_id = p_visit_id)),
        'MARS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mars WHERE visit_id = p_visit_id)),
        'MATHYS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mathys WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mathys WHERE visit_id = p_visit_id)),
        'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrm WHERE visit_id = p_visit_id)),
        'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids_sr16 WHERE visit_id = p_visit_id)),
        'PSQI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_psqi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_psqi WHERE visit_id = p_visit_id)),
        'EPWORTH_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_epworth WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_epworth WHERE visit_id = p_visit_id)),
        -- mod_social (1)
        'SOCIAL_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_social WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_social WHERE visit_id = p_visit_id)),
        -- mod_auto_traits (9)
        'ASRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrs WHERE visit_id = p_visit_id)),
        'CTQ_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ctq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ctq WHERE visit_id = p_visit_id)),
        'BIS10_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_bis10 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_bis10 WHERE visit_id = p_visit_id)),
        'ALS18_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_als18 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_als18 WHERE visit_id = p_visit_id)),
        'AIM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_aim WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_aim WHERE visit_id = p_visit_id)),
        'WURS25_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wurs25 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wurs25 WHERE visit_id = p_visit_id)),
        'AQ12_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_aq12 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_aq12 WHERE visit_id = p_visit_id)),
        'CSM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_csm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_csm WHERE visit_id = p_visit_id)),
        'CTI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cti WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cti WHERE visit_id = p_visit_id)),
        -- mod_hetero schizophrenia (2)
        'PANSS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_panss WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_panss WHERE visit_id = p_visit_id)),
        'CDSS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cdss WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cdss WHERE visit_id = p_visit_id)),
        -- mod_nurse schizophrenia (2)
        'INF_DOSSIER_INFIRMIER', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dossier_infirmier_sz WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dossier_infirmier_sz WHERE visit_id = p_visit_id)),
        'INF_BILAN_BIOLOGIQUE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_bilan_biologique_sz WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_bilan_biologique_sz WHERE visit_id = p_visit_id))
      ) AS statuses
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', (SELECT statuses FROM questionnaire_statuses),
      'tobacco_response', (SELECT row_to_json(t) FROM (SELECT v_tobacco_smoking_status AS smoking_status) t),
      'dsm5_comorbid_response', (SELECT row_to_json(d) FROM (SELECT v_dsm5_diva_evaluated AS diva_evaluated) d),
      'wais4_criteria_response', (SELECT row_to_json(w) FROM (SELECT v_wais4_accepted AS accepted_for_neuropsy_evaluation) w),
      'wais3_criteria_response', (SELECT row_to_json(w) FROM (SELECT v_wais3_accepted AS accepted_for_neuropsy_evaluation) w),
      'completion_status', jsonb_build_object('total_questionnaires', 0, 'completed_questionnaires', 0, 'completion_percentage', 0)
    ) INTO v_result;
  
  ELSIF v_visit_type = 'biannual_followup' THEN
    -- =========================================================================
    -- BIANNUAL FOLLOW-UP: 3 modules
    -- mod_nurse: 7 (TOBACCO, FAGERSTROM, PHYSICAL_PARAMS, BLOOD_PRESSURE, ECG, SLEEP_APNEA, BIOLOGICAL_ASSESSMENT)
    -- mod_medical_eval sections:
    --   dsm5: 2 (DSM5_COMORBID, DIVA)
    --   suicide: 3 (ISA, SUICIDE_BEHAVIOR_FOLLOWUP, CSSRS)
    -- mod_thymic_eval: 7 (MADRS, YMRS, CGI, EGF, ALDA, ETAT_PATIENT, FAST)
    -- =========================================================================
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      WHERE v.id = p_visit_id
    ),
    questionnaire_statuses AS (
      SELECT jsonb_build_object(
        -- mod_nurse (7)
        'TOBACCO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tobacco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tobacco WHERE visit_id = p_visit_id)),
        'FAGERSTROM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fagerstrom WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fagerstrom WHERE visit_id = p_visit_id)),
        'PHYSICAL_PARAMS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_physical_params WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_physical_params WHERE visit_id = p_visit_id)),
        'BLOOD_PRESSURE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_blood_pressure WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_blood_pressure WHERE visit_id = p_visit_id)),
        'ECG_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ecg WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ecg WHERE visit_id = p_visit_id)),
        'SLEEP_APNEA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_sleep_apnea WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_sleep_apnea WHERE visit_id = p_visit_id)),
        'BIOLOGICAL_ASSESSMENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_biological_assessment WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_biological_assessment WHERE visit_id = p_visit_id)),
        -- mod_medical_eval > dsm5 section (2)
        'DSM5_COMORBID_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id)),
        'DIVA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_diva WHERE visit_id = p_visit_id)),
        -- mod_medical_eval > suicide section (3)
        'ISA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_isa WHERE visit_id = p_visit_id)),
        'SUICIDE_BEHAVIOR_FOLLOWUP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_suicide_behavior_followup WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_suicide_behavior_followup WHERE visit_id = p_visit_id)),
        'CSSRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cssrs WHERE visit_id = p_visit_id)),
        -- mod_thymic_eval (7)
        'MADRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_madrs WHERE visit_id = p_visit_id)),
        'YMRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ymrs WHERE visit_id = p_visit_id)),
        'CGI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cgi WHERE visit_id = p_visit_id)),
        'EGF_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_egf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_egf WHERE visit_id = p_visit_id)),
        'ALDA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_alda WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_alda WHERE visit_id = p_visit_id)),
        'ETAT_PATIENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_etat_patient WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_etat_patient WHERE visit_id = p_visit_id)),
        'FAST_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fast WHERE visit_id = p_visit_id))
      ) AS statuses
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', (SELECT statuses FROM questionnaire_statuses),
      'tobacco_response', (SELECT row_to_json(t) FROM (SELECT v_tobacco_smoking_status AS smoking_status) t),
      'dsm5_comorbid_response', (SELECT row_to_json(d) FROM (SELECT v_dsm5_diva_evaluated AS diva_evaluated) d),
      'completion_status', jsonb_build_object('total_questionnaires', 0, 'completed_questionnaires', 0, 'completion_percentage', 0)
    ) INTO v_result;
    
  ELSIF v_visit_type = 'psy_semester_followup' THEN
    -- =========================================================================
    -- PSY SEMESTER FOLLOW-UP: Auto-questionnaires + Traitement semestriel
    -- mod_auto_etat: 9 (EQ5D5L, PRISE_M, STAI_YA, MARS, MATHYS, ASRM, QIDS, PSQI, EPWORTH)
    -- mod_psy_semester: 1 (PSY_TRAITEMENT_SEMESTRIEL)
    -- =========================================================================
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      WHERE v.id = p_visit_id
    ),
    questionnaire_statuses AS (
      SELECT jsonb_build_object(
        -- mod_auto_etat (9)
        'EQ5D5L_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_eq5d5l WHERE visit_id = p_visit_id)),
        'PRISE_M_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_prise_m WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_prise_m WHERE visit_id = p_visit_id)),
        'STAI_YA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_stai_ya WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_stai_ya WHERE visit_id = p_visit_id)),
        'MARS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mars WHERE visit_id = p_visit_id)),
        'MATHYS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mathys WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mathys WHERE visit_id = p_visit_id)),
        'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrm WHERE visit_id = p_visit_id)),
        'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids_sr16 WHERE visit_id = p_visit_id)),
        'PSQI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_psqi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_psqi WHERE visit_id = p_visit_id)),
        'EPWORTH_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_epworth WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_epworth WHERE visit_id = p_visit_id)),
        -- mod_psy_semester (1)
        'PSY_TRAITEMENT_SEMESTRIEL_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_psy_traitement_semestriel WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_psy_traitement_semestriel WHERE visit_id = p_visit_id))
      ) AS statuses
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', (SELECT statuses FROM questionnaire_statuses),
      'completion_status', jsonb_build_object('total_questionnaires', 0, 'completed_questionnaires', 0, 'completion_percentage', 0)
    ) INTO v_result;
  
  ELSE
    -- Default: Return visit with empty questionnaire statuses
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      WHERE v.id = p_visit_id
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', '{}'::jsonb,
      'completion_status', jsonb_build_object('total_questionnaires', 0, 'completed_questionnaires', 0, 'completion_percentage', 0)
    ) INTO v_result;
  END IF;
  
  RETURN v_result;
END;
$$;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Added PANSS and CDSS to get_visit_detail_data RPC';
END $$;
