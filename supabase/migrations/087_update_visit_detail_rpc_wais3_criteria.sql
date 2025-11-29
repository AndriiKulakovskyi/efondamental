-- ============================================================================
-- eFondaMental Platform - Update Visit Detail RPC for WAIS-III Criteria
-- ============================================================================
-- This migration updates the get_visit_detail_data RPC function to include
-- WAIS-III Criteria questionnaire (59 total questionnaires)
-- ============================================================================

-- Drop existing function
DROP FUNCTION IF EXISTS get_visit_detail_data(UUID);

-- Recreate function with WAIS-III Criteria
CREATE OR REPLACE FUNCTION get_visit_detail_data(
  p_visit_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
  v_visit_type TEXT;
BEGIN
  SELECT visit_type INTO v_visit_type FROM visits WHERE id = p_visit_id;
  IF v_visit_type IS NULL THEN RAISE EXCEPTION 'Visit not found: %', p_visit_id; END IF;

  IF v_visit_type = 'screening' THEN
    WITH
    visit_data AS (SELECT * FROM v_visits_full WHERE id = p_visit_id),
    questionnaire_statuses AS (
      SELECT jsonb_build_object(
        'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrm WHERE visit_id = p_visit_id)),
        'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids_sr16 WHERE visit_id = p_visit_id)),
        'MDQ_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mdq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mdq WHERE visit_id = p_visit_id)),
        'MEDICAL_DIAGNOSTIC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_medical_diagnostic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_medical_diagnostic WHERE visit_id = p_visit_id)),
        'BIPOLAR_ORIENTATION_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_bipolar_orientation WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_bipolar_orientation WHERE visit_id = p_visit_id))
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
    WITH
    visit_data AS (SELECT * FROM v_visits_full WHERE id = p_visit_id),
    statuses_etat AS (
      SELECT jsonb_build_object(
        'EQ5D5L_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_eq5d5l WHERE visit_id = p_visit_id)),
        'PRISE_M_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_prise_m WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_prise_m WHERE visit_id = p_visit_id)),
        'STAI_YA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_stai_ya WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_stai_ya WHERE visit_id = p_visit_id)),
        'MARS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mars WHERE visit_id = p_visit_id)),
        'MATHYS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mathys WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mathys WHERE visit_id = p_visit_id)),
        'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrm WHERE visit_id = p_visit_id)),
        'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids_sr16 WHERE visit_id = p_visit_id)),
        'PSQI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_psqi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_psqi WHERE visit_id = p_visit_id)),
        'EPWORTH_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_epworth WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_epworth WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    statuses_traits AS (
      SELECT jsonb_build_object(
        'ASRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrs WHERE visit_id = p_visit_id)),
        'CTQ_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ctq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ctq WHERE visit_id = p_visit_id)),
        'BIS10_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_bis10 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_bis10 WHERE visit_id = p_visit_id)),
        'ALS18_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_als18 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_als18 WHERE visit_id = p_visit_id)),
        'AIM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_aim WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_aim WHERE visit_id = p_visit_id)),
        'WURS25_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wurs25 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wurs25 WHERE visit_id = p_visit_id)),
        'AQ12_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_aq12 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_aq12 WHERE visit_id = p_visit_id)),
        'CSM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_csm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_csm WHERE visit_id = p_visit_id)),
        'CTI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cti WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cti WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    statuses_hetero AS (
      SELECT jsonb_build_object(
        'MADRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_madrs WHERE visit_id = p_visit_id)),
        'YMRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ymrs WHERE visit_id = p_visit_id)),
        'CGI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cgi WHERE visit_id = p_visit_id)),
        'EGF_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_egf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_egf WHERE visit_id = p_visit_id)),
        'ALDA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_alda WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_alda WHERE visit_id = p_visit_id)),
        'ETAT_PATIENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_etat_patient WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_etat_patient WHERE visit_id = p_visit_id)),
        'FAST_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fast WHERE visit_id = p_visit_id)),
        'SOCIAL_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_social WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_social WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    statuses_infirmier AS (
      SELECT jsonb_build_object(
        'TOBACCO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tobacco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tobacco WHERE visit_id = p_visit_id)),
        'FAGERSTROM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fagerstrom WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fagerstrom WHERE visit_id = p_visit_id)),
        'PHYSICAL_PARAMS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_physical_params WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_physical_params WHERE visit_id = p_visit_id)),
        'BLOOD_PRESSURE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_blood_pressure WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_blood_pressure WHERE visit_id = p_visit_id)),
        'ECG_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ecg WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ecg WHERE visit_id = p_visit_id)),
        'SLEEP_APNEA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_sleep_apnea WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_sleep_apnea WHERE visit_id = p_visit_id)),
        'BIOLOGICAL_ASSESSMENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_biological_assessment WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_biological_assessment WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    statuses_dsm5 AS (
      SELECT jsonb_build_object(
        'DSM5_HUMEUR_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_humeur WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_humeur WHERE visit_id = p_visit_id)),
        'DSM5_PSYCHOTIC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_psychotic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_psychotic WHERE visit_id = p_visit_id)),
        'DSM5_COMORBID_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id)),
        'DIVA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_diva WHERE visit_id = p_visit_id)),
        'FAMILY_HISTORY_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_family_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_family_history WHERE visit_id = p_visit_id)),
        'CSSRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cssrs WHERE visit_id = p_visit_id)),
        'ISA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_isa WHERE visit_id = p_visit_id)),
        'CSSRS_HISTORY_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cssrs_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cssrs_history WHERE visit_id = p_visit_id)),
        'SIS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_sis WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_sis WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    statuses_neuropsy_wais4 AS (
      SELECT jsonb_build_object(
        'WAIS4_CRITERIA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_criteria WHERE visit_id = p_visit_id)),
        'WAIS4_LEARNING_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_learning WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_learning WHERE visit_id = p_visit_id)),
        'WAIS4_MATRICES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_matrices WHERE visit_id = p_visit_id)),
        'CVLT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cvlt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cvlt WHERE visit_id = p_visit_id)),
        'WAIS4_CODE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_code WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_code WHERE visit_id = p_visit_id)),
        'WAIS4_DIGIT_SPAN_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_digit_span WHERE visit_id = p_visit_id)),
        'WAIS4_SIMILITUDES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_similitudes WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_similitudes WHERE visit_id = p_visit_id)),
        'TMT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tmt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tmt WHERE visit_id = p_visit_id)),
        'STROOP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_stroop WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_stroop WHERE visit_id = p_visit_id)),
        'FLUENCES_VERBALES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fluences_verbales WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fluences_verbales WHERE visit_id = p_visit_id)),
        'COBRA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cobra WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cobra WHERE visit_id = p_visit_id)),
        'CPT3_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cpt3 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cpt3 WHERE visit_id = p_visit_id)),
        'TEST_COMMISSIONS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_test_commissions WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_test_commissions WHERE visit_id = p_visit_id)),
        'SCIP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_scip WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_scip WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    statuses_neuropsy_wais3 AS (
      SELECT jsonb_build_object(
        'WAIS3_CRITERIA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_criteria WHERE visit_id = p_visit_id)),
        'WAIS3_CVLT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_cvlt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_cvlt WHERE visit_id = p_visit_id)),
        'WAIS3_TMT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_tmt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_tmt WHERE visit_id = p_visit_id)),
        'WAIS3_STROOP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_stroop WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_stroop WHERE visit_id = p_visit_id)),
        'WAIS3_FLUENCES_VERBALES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_fluences_verbales WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_fluences_verbales WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    questionnaire_statuses AS (
      SELECT ((SELECT statuses FROM statuses_etat) || (SELECT statuses FROM statuses_traits) || (SELECT statuses FROM statuses_hetero) || (SELECT statuses FROM statuses_infirmier) || (SELECT statuses FROM statuses_dsm5) || (SELECT statuses FROM statuses_neuropsy_wais4) || (SELECT statuses FROM statuses_neuropsy_wais3)) AS statuses
    ),
    completion_calc AS (
      SELECT 59 AS total_questionnaires,
        ((CASE WHEN EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_prise_m WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_stai_ya WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_mars WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_mathys WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_psqi WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_epworth WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_asrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_ctq WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_bis10 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_als18 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_aim WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_wurs25 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_aq12 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_csm WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_cti WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_egf WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_alda WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_etat_patient WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_social WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_tobacco WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_fagerstrom WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_physical_params WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_blood_pressure WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_ecg WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_sleep_apnea WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_biological_assessment WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_humeur WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_psychotic WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_family_history WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_cssrs_history WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_sis WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_wais4_criteria WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_wais4_learning WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_wais4_matrices WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_cvlt WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_wais4_code WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_wais4_digit_span WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_wais4_similitudes WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_tmt WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_stroop WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_fluences_verbales WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_cobra WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_cpt3 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_test_commissions WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_scip WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_wais3_criteria WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_wais3_cvlt WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_wais3_tmt WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_wais3_stroop WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) + (CASE WHEN EXISTS (SELECT 1 FROM responses_wais3_fluences_verbales WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END)) AS completed_questionnaires
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', (SELECT statuses FROM questionnaire_statuses),
      'completion_status', (SELECT jsonb_build_object('total_questionnaires', total_questionnaires, 'completed_questionnaires', completed_questionnaires, 'completion_percentage', CASE WHEN total_questionnaires > 0 THEN ROUND((completed_questionnaires::numeric / total_questionnaires::numeric) * 100) ELSE 0 END) FROM completion_calc)
    ) INTO v_result;
  ELSE
    RAISE EXCEPTION 'Unsupported visit type: %', v_visit_type;
  END IF;
  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_visit_detail_data(UUID) TO authenticated;

