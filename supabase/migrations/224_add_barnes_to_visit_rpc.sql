-- ============================================================================
-- Migration: Add BARNES questionnaire to get_visit_detail_data RPC
-- ============================================================================
-- Adds tracking for Barnes Akathisia Rating Scale
-- completion status in the initial_evaluation visit type
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
    -- SCREENING VISIT
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
    -- INITIAL EVALUATION: Split into multiple chunks to avoid 100 arg limit
    -- =========================================================================
    
    -- Build statuses in chunks and merge them
    -- Chunk 1: mod_nurse (7) + mod_thymic_eval (7) = 14
    v_statuses := jsonb_build_object(
      'TOBACCO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tobacco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tobacco WHERE visit_id = p_visit_id)),
      'FAGERSTROM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fagerstrom WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fagerstrom WHERE visit_id = p_visit_id)),
      'PHYSICAL_PARAMS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_physical_params WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_physical_params WHERE visit_id = p_visit_id)),
      'BLOOD_PRESSURE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_blood_pressure WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_blood_pressure WHERE visit_id = p_visit_id)),
      'ECG_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ecg WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ecg WHERE visit_id = p_visit_id)),
      'SLEEP_APNEA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_sleep_apnea WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_sleep_apnea WHERE visit_id = p_visit_id)),
      'BIOLOGICAL_ASSESSMENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_biological_assessment WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_biological_assessment WHERE visit_id = p_visit_id)),
      'MADRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_madrs WHERE visit_id = p_visit_id)),
      'YMRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ymrs WHERE visit_id = p_visit_id)),
      'CGI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cgi WHERE visit_id = p_visit_id)),
      'EGF_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_egf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_egf WHERE visit_id = p_visit_id)),
      'ALDA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_alda WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_alda WHERE visit_id = p_visit_id)),
      'ETAT_PATIENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_etat_patient WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_etat_patient WHERE visit_id = p_visit_id)),
      'FAST_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fast WHERE visit_id = p_visit_id))
    );
    
    -- Chunk 2: mod_medical_eval part 1 (14 items)
    v_statuses := v_statuses || jsonb_build_object(
      'FAMILY_HISTORY_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_family_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_family_history WHERE visit_id = p_visit_id)),
      'DSM5_HUMEUR_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_humeur WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_humeur WHERE visit_id = p_visit_id)),
      'DSM5_PSYCHOTIC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_psychotic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_psychotic WHERE visit_id = p_visit_id)),
      'DSM5_COMORBID_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id)),
      'DIVA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_diva WHERE visit_id = p_visit_id)),
      'CSSRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cssrs WHERE visit_id = p_visit_id)),
      'ISA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_isa WHERE visit_id = p_visit_id)),
      'SIS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_sis WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_sis WHERE visit_id = p_visit_id)),
      'SUICIDE_HISTORY_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_suicide_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_suicide_history WHERE visit_id = p_visit_id)),
      'PERINATALITE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_perinatalite WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_perinatalite WHERE visit_id = p_visit_id)),
      'PATHO_NEURO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_neuro WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_neuro WHERE visit_id = p_visit_id)),
      'PATHO_CARDIO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_cardio WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_cardio WHERE visit_id = p_visit_id)),
      'PATHO_ENDOC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_endoc WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_endoc WHERE visit_id = p_visit_id)),
      'PATHO_DERMATO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_dermato WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_dermato WHERE visit_id = p_visit_id))
    );
    
    -- Chunk 3: mod_medical_eval part 2 + mod_neuropsy part 1 (14 items)
    v_statuses := v_statuses || jsonb_build_object(
      'PATHO_URINAIRE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_urinaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_urinaire WHERE visit_id = p_visit_id)),
      'ANTECEDENTS_GYNECO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_antecedents_gyneco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_antecedents_gyneco WHERE visit_id = p_visit_id)),
      'PATHO_HEPATO_GASTRO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_hepato_gastro WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_hepato_gastro WHERE visit_id = p_visit_id)),
      'PATHO_ALLERGIQUE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_allergique WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_allergique WHERE visit_id = p_visit_id)),
      'AUTRES_PATHO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_autres_patho WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_autres_patho WHERE visit_id = p_visit_id)),
      'CVLT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cvlt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cvlt WHERE visit_id = p_visit_id)),
      'TMT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tmt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tmt WHERE visit_id = p_visit_id)),
      'STROOP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_stroop WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_stroop WHERE visit_id = p_visit_id)),
      'FLUENCES_VERBALES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fluences_verbales WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fluences_verbales WHERE visit_id = p_visit_id)),
      'MEM3_SPATIAL_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mem3_spatial WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mem3_spatial WHERE visit_id = p_visit_id)),
      'WAIS3_CRITERIA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_criteria WHERE visit_id = p_visit_id)),
      'WAIS3_LEARNING_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_learning WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_learning WHERE visit_id = p_visit_id)),
      'WAIS3_VOCABULAIRE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id)),
      'WAIS3_MATRICES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_matrices WHERE visit_id = p_visit_id))
    );
    
    -- Chunk 4: mod_neuropsy part 2 (14 items)
    v_statuses := v_statuses || jsonb_build_object(
      'WAIS3_CODE_SYMBOLES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_code_symboles WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_code_symboles WHERE visit_id = p_visit_id)),
      'WAIS3_DIGIT_SPAN_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_digit_span WHERE visit_id = p_visit_id)),
      'WAIS3_CPT2_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_cpt2 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_cpt2 WHERE visit_id = p_visit_id)),
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
      'EQ5D5L_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_eq5d5l WHERE visit_id = p_visit_id))
    );
    
    -- Chunk 5: mod_auto_etat + mod_social + mod_auto_traits part 1 (14 items)
    v_statuses := v_statuses || jsonb_build_object(
      'PRISE_M_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_prise_m WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_prise_m WHERE visit_id = p_visit_id)),
      'STAI_YA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_stai_ya WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_stai_ya WHERE visit_id = p_visit_id)),
      'MARS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mars WHERE visit_id = p_visit_id)),
      'MATHYS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mathys WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mathys WHERE visit_id = p_visit_id)),
      'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrm WHERE visit_id = p_visit_id)),
      'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids_sr16 WHERE visit_id = p_visit_id)),
      'PSQI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_psqi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_psqi WHERE visit_id = p_visit_id)),
      'EPWORTH_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_epworth WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_epworth WHERE visit_id = p_visit_id)),
      'SOCIAL_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_social WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_social WHERE visit_id = p_visit_id)),
      'ASRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrs WHERE visit_id = p_visit_id)),
      'CTQ_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ctq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ctq WHERE visit_id = p_visit_id)),
      'BIS10_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_bis10 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_bis10 WHERE visit_id = p_visit_id)),
      'ALS18_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_als18 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_als18 WHERE visit_id = p_visit_id)),
      'AIM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_aim WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_aim WHERE visit_id = p_visit_id))
    );
    
    -- Chunk 6: mod_auto_traits part 2 + schizophrenia questionnaires (12 items) - added BARNES
    v_statuses := v_statuses || jsonb_build_object(
      'WURS25_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wurs25 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wurs25 WHERE visit_id = p_visit_id)),
      'AQ12_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_aq12 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_aq12 WHERE visit_id = p_visit_id)),
      'CSM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_csm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_csm WHERE visit_id = p_visit_id)),
      'CTI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cti WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cti WHERE visit_id = p_visit_id)),
      'PANSS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_panss WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_panss WHERE visit_id = p_visit_id)),
      'CDSS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cdss WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cdss WHERE visit_id = p_visit_id)),
      'BARS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_bars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_bars WHERE visit_id = p_visit_id)),
      'SUMD', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_sumd WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_sumd WHERE visit_id = p_visit_id)),
      'AIMS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_aims WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_aims WHERE visit_id = p_visit_id)),
      'BARNES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_barnes WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_barnes WHERE visit_id = p_visit_id)),
      'INF_DOSSIER_INFIRMIER', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dossier_infirmier_sz WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dossier_infirmier_sz WHERE visit_id = p_visit_id)),
      'INF_BILAN_BIOLOGIQUE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_bilan_biologique_sz WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_bilan_biologique_sz WHERE visit_id = p_visit_id))
    );
    
    -- Build final result
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      WHERE v.id = p_visit_id
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', v_statuses,
      'tobacco_response', (SELECT row_to_json(t) FROM (SELECT v_tobacco_smoking_status AS smoking_status) t),
      'dsm5_comorbid_response', (SELECT row_to_json(d) FROM (SELECT v_dsm5_diva_evaluated AS diva_evaluated) d),
      'wais4_criteria_response', (SELECT row_to_json(w) FROM (SELECT v_wais4_accepted AS accepted_for_neuropsy_evaluation) w),
      'wais3_criteria_response', (SELECT row_to_json(w) FROM (SELECT v_wais3_accepted AS accepted_for_neuropsy_evaluation) w),
      'completion_status', jsonb_build_object('total_questionnaires', 0, 'completed_questionnaires', 0, 'completion_percentage', 0)
    ) INTO v_result;
  
  ELSIF v_visit_type = 'biannual_followup' THEN
    -- =========================================================================
    -- BIANNUAL FOLLOWUP
    -- =========================================================================
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      WHERE v.id = p_visit_id
    ),
    questionnaire_statuses AS (
      SELECT jsonb_build_object(
        'PSY_TRAITEMENT_SEMESTRIEL', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_psy_traitement_semestriel WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_psy_traitement_semestriel WHERE visit_id = p_visit_id))
      ) AS statuses
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', (SELECT statuses FROM questionnaire_statuses),
      'completion_status', jsonb_build_object('total_questionnaires', 1, 'completed_questionnaires', CASE WHEN EXISTS (SELECT 1 FROM responses_psy_traitement_semestriel WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END, 'completion_percentage', CASE WHEN EXISTS (SELECT 1 FROM responses_psy_traitement_semestriel WHERE visit_id = p_visit_id) THEN 100 ELSE 0 END)
    ) INTO v_result;

  ELSE
    -- =========================================================================
    -- UNKNOWN VISIT TYPE - Return basic visit data
    -- =========================================================================
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
