-- Migration: Fix get_visit_detail_data RPC naming mismatches
-- Description: Updates the RPC to reference correct table names and support all visit types/pathologies

CREATE OR REPLACE FUNCTION get_visit_detail_data(p_visit_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_visit_type TEXT;
  v_pathology_type TEXT;
  v_result JSONB;
  v_tobacco_smoking_status TEXT;
  v_dsm5_diva_evaluated TEXT;
  v_fagerstrom_required BOOLEAN;
  v_diva_required BOOLEAN;
  v_wais4_accepted INTEGER;
  v_wais3_accepted INTEGER;
  v_statuses JSONB := '{}'::jsonb;
BEGIN
  -- Get visit type and pathology
  SELECT v.visit_type, pt.type INTO v_visit_type, v_pathology_type
  FROM visits v
  JOIN patients p ON v.patient_id = p.id
  JOIN pathologies pt ON p.pathology_id = pt.id
  WHERE v.id = p_visit_id;
  
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
  
  v_fagerstrom_required := v_tobacco_smoking_status = 'current_smoker';
  v_diva_required := v_dsm5_diva_evaluated = 'oui';

  -- =========================================================================
  -- 1. SCREENING VISIT
  -- =========================================================================
  IF v_visit_type = 'screening' THEN
    IF v_pathology_type = 'schizophrenia' THEN
      v_statuses := jsonb_build_object(
        'SCREENING_DIAGNOSTIC_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_screening_sz_diagnostic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_screening_sz_diagnostic WHERE visit_id = p_visit_id)),
        'SCREENING_ORIENTATION_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_screening_sz_orientation WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_screening_sz_orientation WHERE visit_id = p_visit_id))
      );
    ELSE -- Bipolar and others
      v_statuses := jsonb_build_object(
        'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrm WHERE visit_id = p_visit_id)),
        'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids_sr16 WHERE visit_id = p_visit_id)),
        'MDQ_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mdq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mdq WHERE visit_id = p_visit_id)),
        'MEDICAL_DIAGNOSTIC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_medical_diagnostic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_medical_diagnostic WHERE visit_id = p_visit_id)),
        'BIPOLAR_ORIENTATION_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_bipolar_orientation WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_bipolar_orientation WHERE visit_id = p_visit_id))
      );
    END IF;

  -- =========================================================================
  -- 2. INITIAL EVALUATION / BIANNUAL / ANNUAL
  -- =========================================================================
  ELSIF v_visit_type IN ('initial_evaluation', 'biannual_followup', 'annual_evaluation') THEN
    
    -- Common modules (Nurse)
    v_statuses := v_statuses || jsonb_build_object(
      'TOBACCO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tobacco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tobacco WHERE visit_id = p_visit_id)),
      'FAGERSTROM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fagerstrom WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fagerstrom WHERE visit_id = p_visit_id)),
      'PHYSICAL_PARAMS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_physical_params WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_physical_params WHERE visit_id = p_visit_id)),
      'BLOOD_PRESSURE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_blood_pressure WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_blood_pressure WHERE visit_id = p_visit_id)),
      'ECG_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ecg WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ecg WHERE visit_id = p_visit_id)),
      'SLEEP_APNEA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_sleep_apnea WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_sleep_apnea WHERE visit_id = p_visit_id)),
      'BIOLOGICAL_ASSESSMENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_biological_assessment WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_biological_assessment WHERE visit_id = p_visit_id))
    );

    -- Common modules (Thymic)
    v_statuses := v_statuses || jsonb_build_object(
      'MADRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_madrs WHERE visit_id = p_visit_id)),
      'YMRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ymrs WHERE visit_id = p_visit_id)),
      'CGI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cgi WHERE visit_id = p_visit_id)),
      'EGF_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_egf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_egf WHERE visit_id = p_visit_id)),
      'ALDA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_alda WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_alda WHERE visit_id = p_visit_id)),
      'ETAT_PATIENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_etat_patient WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_etat_patient WHERE visit_id = p_visit_id)),
      'FAST_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fast WHERE visit_id = p_visit_id)),
      'ISA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_isa WHERE visit_id = p_visit_id))
    );

    IF v_pathology_type = 'schizophrenia' THEN
      v_statuses := v_statuses || jsonb_build_object(
        'INF_DOSSIER_INFIRMIER', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dossier_infirmier_sz WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dossier_infirmier_sz WHERE visit_id = p_visit_id)),
        'INF_BILAN_BIOLOGIQUE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_bilan_biologique_sz WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_bilan_biologique_sz WHERE visit_id = p_visit_id)),
        'PANSS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_panss WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_panss WHERE visit_id = p_visit_id)),
        'CDSS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cdss WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cdss WHERE visit_id = p_visit_id)),
        'BARS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_bars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_bars WHERE visit_id = p_visit_id)),
        'SUMD', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_sumd WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_sumd WHERE visit_id = p_visit_id)),
        'AIMS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_aims WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_aims WHERE visit_id = p_visit_id)),
        'BARNES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_barnes WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_barnes WHERE visit_id = p_visit_id)),
        'SAS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_sas WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_sas WHERE visit_id = p_visit_id)),
        'PSP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_psp WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_psp WHERE visit_id = p_visit_id)),
        'ECV', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ecv WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ecv WHERE visit_id = p_visit_id)),
        'TROUBLES_PSYCHOTIQUES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_troubles_psychotiques WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_troubles_psychotiques WHERE visit_id = p_visit_id)),
        'TROUBLES_COMORBIDES_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_troubles_comorbides_sz WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_troubles_comorbides_sz WHERE visit_id = p_visit_id)),
        'SUICIDE_HISTORY_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_suicide_history_sz WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_suicide_history_sz WHERE visit_id = p_visit_id)),
        'PERINATALITE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_perinatalite_sz WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_perinatalite_sz WHERE visit_id = p_visit_id)),
        'ANTECEDENTS_FAMILIAUX_PSY_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_antecedents_familiaux_psy_sz WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_antecedents_familiaux_psy_sz WHERE visit_id = p_visit_id))
      );
    ELSE -- Bipolar
      v_statuses := v_statuses || jsonb_build_object(
        'DSM5_HUMEUR_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_humeur WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_humeur WHERE visit_id = p_visit_id)),
        'DSM5_PSYCHOTIC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_psychotic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_psychotic WHERE visit_id = p_visit_id)),
        'DSM5_COMORBID_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id)),
        'DIVA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_diva WHERE visit_id = p_visit_id)),
        'CSSRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cssrs WHERE visit_id = p_visit_id)),
        'SIS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_sis WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_sis WHERE visit_id = p_visit_id)),
        'SUICIDE_HISTORY_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_suicide_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_suicide_history WHERE visit_id = p_visit_id)),
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
        'FAMILY_HISTORY_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_family_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_family_history WHERE visit_id = p_visit_id))
      );
    END IF;

    -- Add Neuropsy if Initial or Annual
    IF v_visit_type IN ('initial_evaluation', 'annual_evaluation') THEN
      v_statuses := v_statuses || jsonb_build_object(
        'WAIS4_CRITERIA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_criteria WHERE visit_id = p_visit_id)),
        'WAIS4_LEARNING_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_learning WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_learning WHERE visit_id = p_visit_id)),
        'WAIS4_SIMILITUDES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_similitudes WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_similitudes WHERE visit_id = p_visit_id)),
        'WAIS4_MATRICES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_matrices WHERE visit_id = p_visit_id)),
        'CVLT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cvlt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cvlt WHERE visit_id = p_visit_id)),
        'WAIS4_CODE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_code WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_code WHERE visit_id = p_visit_id)),
        'WAIS4_DIGIT_SPAN_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_digit_span WHERE visit_id = p_visit_id)),
        'MEM3_SPATIAL_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mem3_spatial WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mem3_spatial WHERE visit_id = p_visit_id)),
        'TMT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tmt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tmt WHERE visit_id = p_visit_id)),
        'STROOP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_stroop WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_stroop WHERE visit_id = p_visit_id)),
        'FLUENCES_VERBALES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fluences_verbales WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fluences_verbales WHERE visit_id = p_visit_id)),
        'COBRA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cobra WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cobra WHERE visit_id = p_visit_id)),
        'CPT3_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cpt3 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cpt3 WHERE visit_id = p_visit_id)),
        'SCIP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_scip WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_scip WHERE visit_id = p_visit_id)),
        'TEST_COMMISSIONS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_test_commissions WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_test_commissions WHERE visit_id = p_visit_id)),
        'WAIS3_CRITERIA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_criteria WHERE visit_id = p_visit_id)),
        'WAIS3_LEARNING_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_learning WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_learning WHERE visit_id = p_visit_id)),
        'WAIS3_VOCABULAIRE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id)),
        'WAIS3_MATRICES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_matrices WHERE visit_id = p_visit_id)),
        'WAIS3_CODE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_code_symboles WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_code_symboles WHERE visit_id = p_visit_id)),
        'WAIS3_DIGIT_SPAN_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_digit_span WHERE visit_id = p_visit_id)),
        'WAIS3_CPT2_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_cpt2 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_cpt2 WHERE visit_id = p_visit_id))
      );
    END IF;

    -- Add Auto/Social if Initial or Annual
    IF v_visit_type IN ('initial_evaluation', 'annual_evaluation') THEN
      v_statuses := v_statuses || jsonb_build_object(
        'EQ5D5L_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_eq5d5l WHERE visit_id = p_visit_id)),
        'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrm WHERE visit_id = p_visit_id)),
        'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids_sr16 WHERE visit_id = p_visit_id)),
        'MDQ_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mdq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mdq WHERE visit_id = p_visit_id)),
        'SOCIAL_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_social WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_social WHERE visit_id = p_visit_id)),
        'ASRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrs WHERE visit_id = p_visit_id))
      );
    END IF;

  -- =========================================================================
  -- 3. FOLLOWUP / OFF-SCHEDULE
  -- =========================================================================
  ELSIF v_visit_type IN ('followup', 'off_schedule') THEN
    v_statuses := jsonb_build_object(
      'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrm WHERE visit_id = p_visit_id)),
      'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids_sr16 WHERE visit_id = p_visit_id)),
      'EQ5D5L_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_eq5d5l WHERE visit_id = p_visit_id))
    );
  END IF;

  -- Final assembly with Visit Data
  SELECT jsonb_build_object(
    'visit', (
      SELECT row_to_json(v_row) FROM (
        SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender, pa.type as pathology_type
        FROM visits v
        JOIN patients p ON v.patient_id = p.id
        LEFT JOIN pathologies pa ON p.pathology_id = pa.id
        WHERE v.id = p_visit_id
      ) v_row
    ),
    'questionnaire_statuses', v_statuses,
    'tobacco_response', (SELECT jsonb_build_object('smoking_status', v_tobacco_smoking_status)),
    'dsm5_comorbid_response', (SELECT jsonb_build_object('diva_evaluated', v_dsm5_diva_evaluated)),
    'wais4_criteria_response', (SELECT jsonb_build_object('accepted_for_neuropsy_evaluation', v_wais4_accepted)),
    'wais3_criteria_response', (SELECT jsonb_build_object('accepted_for_neuropsy_evaluation', v_wais3_accepted)),
    'completion_status', (
      SELECT jsonb_build_object(
        'total_questionnaires', count_total,
        'completed_questionnaires', count_completed,
        'completion_percentage', CASE WHEN count_total > 0 THEN ROUND((count_completed::numeric / count_total::numeric) * 100) ELSE 0 END
      )
      FROM (
        SELECT 
          jsonb_array_length(jsonb_path_query_array(v_statuses, '$.*.completed')) as count_total,
          jsonb_array_length(jsonb_path_query_array(v_statuses, '$.* ? (@.completed == true)')) as count_completed
      ) stats
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_visit_detail_data(UUID) TO authenticated;
