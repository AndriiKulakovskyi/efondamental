-- ============================================================================
-- Migration: Fix get_visit_detail_data RPC - remove invalid table references
-- ============================================================================
-- Issue: The RPC references several non-existent tables:
-- - responses_medication (doesn't exist, patient_medications is patient-level)
-- - responses_biographie, responses_parcours_soin, responses_situation_sociale
--   (Social module uses single responses_social table)
-- - responses_consent (doesn't exist)
--
-- Fix: Remove references to non-existent tables and use correct table names.
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
  
  -- Fagerstrom is ONLY required for current smokers (Fumeur actuel), NOT ex-smokers
  v_fagerstrom_required := v_tobacco_smoking_status = 'current_smoker';
  v_diva_required := v_dsm5_diva_evaluated = 'oui';
  
  IF v_visit_type = 'screening' THEN
    -- Screening visit: 5 questionnaires (removed CONSENT_FR)
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
        'MADRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_madrs WHERE visit_id = p_visit_id)),
        'YMRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ymrs WHERE visit_id = p_visit_id)),
        'CGI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cgi WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    completion_calc AS (
      SELECT 5 AS total_questionnaires,
        ((CASE WHEN EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END)) AS completed_questionnaires
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', (SELECT statuses FROM questionnaire_statuses),
      'completion_status', (SELECT jsonb_build_object('total_questionnaires', total_questionnaires, 'completed_questionnaires', completed_questionnaires, 'completion_percentage', CASE WHEN total_questionnaires > 0 THEN ROUND((completed_questionnaires::numeric / total_questionnaires::numeric) * 100) ELSE 0 END) FROM completion_calc)
    ) INTO v_result;

  ELSIF v_visit_type = 'initial_evaluation' THEN
    -- Initial evaluation with all modules including Infirmier, Hetero, Social (single table), and Neuropsy
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      WHERE v.id = p_visit_id
    ),
    tobacco_data AS (
      SELECT smoking_status FROM responses_tobacco WHERE visit_id = p_visit_id
    ),
    dsm5_comorbid_data AS (
      SELECT diva_evaluated FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id
    ),
    statuses_auto AS (
      SELECT jsonb_build_object(
        'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrm WHERE visit_id = p_visit_id)),
        'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids_sr16 WHERE visit_id = p_visit_id)),
        'EQ5D5L_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_eq5d5l WHERE visit_id = p_visit_id)),
        'MARS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mars WHERE visit_id = p_visit_id)),
        'PSQI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_psqi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_psqi WHERE visit_id = p_visit_id)),
        'EPWORTH_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_epworth WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_epworth WHERE visit_id = p_visit_id))
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
    statuses_hetero AS (
      SELECT jsonb_build_object(
        'MADRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_madrs WHERE visit_id = p_visit_id)),
        'YMRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ymrs WHERE visit_id = p_visit_id)),
        'CGI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cgi WHERE visit_id = p_visit_id)),
        'EGF_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_egf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_egf WHERE visit_id = p_visit_id)),
        'ALDA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_alda WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_alda WHERE visit_id = p_visit_id)),
        'ETAT_PATIENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_etat_patient WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_etat_patient WHERE visit_id = p_visit_id)),
        'DSM5_HUMEUR_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_humeur WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_humeur WHERE visit_id = p_visit_id)),
        'DSM5_COMORBID_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id)),
        'DIVA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_diva WHERE visit_id = p_visit_id)),
        'MEDICAL_DIAGNOSTIC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_medical_diagnostic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_medical_diagnostic WHERE visit_id = p_visit_id)),
        'FAMILY_HISTORY_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_family_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_family_history WHERE visit_id = p_visit_id)),
        'FAST_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fast WHERE visit_id = p_visit_id)),
        'CSSRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cssrs WHERE visit_id = p_visit_id)),
        'ISA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_isa WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    statuses_social AS (
      SELECT jsonb_build_object(
        'SOCIAL_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_social WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_social WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    statuses_neuropsy AS (
      SELECT jsonb_build_object(
        'TMT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tmt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tmt WHERE visit_id = p_visit_id)),
        'STROOP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_stroop WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_stroop WHERE visit_id = p_visit_id)),
        'FLUENCES_VERBALES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fluences_verbales WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fluences_verbales WHERE visit_id = p_visit_id)),
        'CVLT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cvlt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cvlt WHERE visit_id = p_visit_id)),
        'WAIS3_VOCABULAIRE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    -- Calculate totals: 6 auto + 6 infirmier + 13 hetero + 1 social + 5 neuropsy = 31
    -- Plus conditional: Fagerstrom (if smoker), DIVA (if diva_evaluated = 'oui')
    completion_calc AS (
      SELECT 
        31 + (CASE WHEN v_fagerstrom_required THEN 1 ELSE 0 END) + (CASE WHEN v_diva_required THEN 1 ELSE 0 END) AS total_questionnaires,
        (
          -- Auto module (6)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_mars WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_psqi WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_epworth WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- Infirmier module (6 base + 1 conditional Fagerstrom)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_tobacco WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN v_fagerstrom_required AND EXISTS (SELECT 1 FROM responses_fagerstrom WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_physical_params WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_blood_pressure WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_ecg WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_sleep_apnea WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_biological_assessment WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- Hetero module (13 base + 1 conditional DIVA)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_egf WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_alda WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_etat_patient WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_humeur WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN v_diva_required AND EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_medical_diagnostic WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_family_history WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- Social module (1)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_social WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- Neuropsy module (5)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_tmt WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_stroop WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_fluences_verbales WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cvlt WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END)
        ) AS completed_questionnaires
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', (
        (SELECT statuses FROM statuses_auto) ||
        (SELECT statuses FROM statuses_infirmier) ||
        (SELECT statuses FROM statuses_hetero) ||
        (SELECT statuses FROM statuses_social) ||
        (SELECT statuses FROM statuses_neuropsy)
      ),
      'tobacco_response', (SELECT row_to_json(t) FROM (SELECT smoking_status FROM tobacco_data) t),
      'dsm5_comorbid_response', (SELECT row_to_json(d) FROM (SELECT diva_evaluated FROM dsm5_comorbid_data) d),
      'completion_status', (SELECT jsonb_build_object(
        'total_questionnaires', total_questionnaires, 
        'completed_questionnaires', completed_questionnaires, 
        'completion_percentage', CASE WHEN total_questionnaires > 0 THEN ROUND((completed_questionnaires::numeric / total_questionnaires::numeric) * 100) ELSE 0 END
      ) FROM completion_calc)
    ) INTO v_result;
  
  ELSIF v_visit_type = 'biannual_followup' THEN
    -- BIANNUAL FOLLOW-UP: 3 modules
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      WHERE v.id = p_visit_id
    ),
    tobacco_data AS (
      SELECT smoking_status FROM responses_tobacco WHERE visit_id = p_visit_id
    ),
    dsm5_comorbid_data AS (
      SELECT diva_evaluated FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id
    ),
    questionnaire_statuses AS (
      SELECT jsonb_build_object(
        -- Infirmier module (7 questionnaires)
        'TOBACCO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tobacco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tobacco WHERE visit_id = p_visit_id)),
        'FAGERSTROM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fagerstrom WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fagerstrom WHERE visit_id = p_visit_id)),
        'PHYSICAL_PARAMS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_physical_params WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_physical_params WHERE visit_id = p_visit_id)),
        'BLOOD_PRESSURE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_blood_pressure WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_blood_pressure WHERE visit_id = p_visit_id)),
        'ECG_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ecg WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ecg WHERE visit_id = p_visit_id)),
        'SLEEP_APNEA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_sleep_apnea WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_sleep_apnea WHERE visit_id = p_visit_id)),
        'BIOLOGICAL_ASSESSMENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_biological_assessment WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_biological_assessment WHERE visit_id = p_visit_id)),
        -- Medical Evaluation module (4 questionnaires)
        'DSM5_COMORBID_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id)),
        'DIVA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_diva WHERE visit_id = p_visit_id)),
        'CSSRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cssrs WHERE visit_id = p_visit_id)),
        'ISA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_isa WHERE visit_id = p_visit_id)),
        -- Thymic Evaluation module (7 questionnaires)
        'MADRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_madrs WHERE visit_id = p_visit_id)),
        'YMRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ymrs WHERE visit_id = p_visit_id)),
        'CGI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cgi WHERE visit_id = p_visit_id)),
        'EGF_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_egf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_egf WHERE visit_id = p_visit_id)),
        'ALDA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_alda WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_alda WHERE visit_id = p_visit_id)),
        'ETAT_PATIENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_etat_patient WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_etat_patient WHERE visit_id = p_visit_id)),
        'FAST_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fast WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    completion_calc AS (
      SELECT 
        16 + (CASE WHEN v_fagerstrom_required THEN 1 ELSE 0 END) + (CASE WHEN v_diva_required THEN 1 ELSE 0 END) AS total_questionnaires,
        (
          (CASE WHEN EXISTS (SELECT 1 FROM responses_tobacco WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN v_fagerstrom_required AND EXISTS (SELECT 1 FROM responses_fagerstrom WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_physical_params WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_blood_pressure WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_ecg WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_sleep_apnea WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_biological_assessment WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN v_diva_required AND EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_egf WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_alda WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_etat_patient WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END)
        ) AS completed_questionnaires
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', (SELECT statuses FROM questionnaire_statuses),
      'tobacco_response', (SELECT row_to_json(t) FROM (SELECT smoking_status FROM tobacco_data) t),
      'dsm5_comorbid_response', (SELECT row_to_json(d) FROM (SELECT diva_evaluated FROM dsm5_comorbid_data) d),
      'completion_status', (SELECT jsonb_build_object(
        'total_questionnaires', total_questionnaires, 
        'completed_questionnaires', completed_questionnaires, 
        'completion_percentage', CASE WHEN total_questionnaires > 0 THEN ROUND((completed_questionnaires::numeric / total_questionnaires::numeric) * 100) ELSE 0 END
      ) FROM completion_calc)
    ) INTO v_result;
    
  ELSIF v_visit_type = 'annual_evaluation' THEN
    -- ANNUAL EVALUATION: Full evaluation with all modules
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      WHERE v.id = p_visit_id
    ),
    tobacco_data AS (
      SELECT smoking_status FROM responses_tobacco WHERE visit_id = p_visit_id
    ),
    dsm5_comorbid_data AS (
      SELECT diva_evaluated FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id
    ),
    questionnaire_statuses AS (
      SELECT jsonb_build_object(
        -- Self-report module (6 questionnaires)
        'ASRM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrm WHERE visit_id = p_visit_id)),
        'QIDS_SR16_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids_sr16 WHERE visit_id = p_visit_id)),
        'EQ5D5L_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_eq5d5l WHERE visit_id = p_visit_id)),
        'MARS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mars WHERE visit_id = p_visit_id)),
        'PSQI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_psqi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_psqi WHERE visit_id = p_visit_id)),
        'EPWORTH_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_epworth WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_epworth WHERE visit_id = p_visit_id)),
        -- Infirmier module (6 questionnaires - no ECG for annual)
        'TOBACCO_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tobacco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tobacco WHERE visit_id = p_visit_id)),
        'FAGERSTROM_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fagerstrom WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fagerstrom WHERE visit_id = p_visit_id)),
        'PHYSICAL_PARAMS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_physical_params WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_physical_params WHERE visit_id = p_visit_id)),
        'BLOOD_PRESSURE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_blood_pressure WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_blood_pressure WHERE visit_id = p_visit_id)),
        'SLEEP_APNEA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_sleep_apnea WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_sleep_apnea WHERE visit_id = p_visit_id)),
        'BIOLOGICAL_ASSESSMENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_biological_assessment WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_biological_assessment WHERE visit_id = p_visit_id)),
        -- Thymic Evaluation module (7 questionnaires)
        'MADRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_madrs WHERE visit_id = p_visit_id)),
        'ALDA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_alda WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_alda WHERE visit_id = p_visit_id)),
        'YMRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ymrs WHERE visit_id = p_visit_id)),
        'FAST_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fast WHERE visit_id = p_visit_id)),
        'CGI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cgi WHERE visit_id = p_visit_id)),
        'EGF_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_egf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_egf WHERE visit_id = p_visit_id)),
        'ETAT_PATIENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_etat_patient WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_etat_patient WHERE visit_id = p_visit_id)),
        -- Medical Evaluation module
        'DSM5_HUMEUR_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_humeur WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_humeur WHERE visit_id = p_visit_id)),
        'DSM5_COMORBID_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id)),
        'DIVA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_diva WHERE visit_id = p_visit_id)),
        'MEDICAL_DIAGNOSTIC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_medical_diagnostic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_medical_diagnostic WHERE visit_id = p_visit_id)),
        'FAMILY_HISTORY_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_family_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_family_history WHERE visit_id = p_visit_id)),
        'CSSRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cssrs WHERE visit_id = p_visit_id)),
        'ISA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_isa WHERE visit_id = p_visit_id)),
        -- Social module (1 - single table)
        'SOCIAL_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_social WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_social WHERE visit_id = p_visit_id)),
        -- Neuropsy module (5)
        'TMT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tmt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tmt WHERE visit_id = p_visit_id)),
        'STROOP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_stroop WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_stroop WHERE visit_id = p_visit_id)),
        'FLUENCES_VERBALES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fluences_verbales WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fluences_verbales WHERE visit_id = p_visit_id)),
        'CVLT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cvlt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cvlt WHERE visit_id = p_visit_id)),
        'WAIS3_VOCABULAIRE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    -- Base: 6 auto + 5 infirmier + 7 thymic + 6 medical + 1 social + 5 neuropsy = 30
    completion_calc AS (
      SELECT 
        30 + (CASE WHEN v_fagerstrom_required THEN 1 ELSE 0 END) + (CASE WHEN v_diva_required THEN 1 ELSE 0 END) AS total_questionnaires,
        (
          (CASE WHEN EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_mars WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_psqi WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_epworth WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_tobacco WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN v_fagerstrom_required AND EXISTS (SELECT 1 FROM responses_fagerstrom WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_physical_params WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_blood_pressure WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_sleep_apnea WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_biological_assessment WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_alda WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_egf WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_etat_patient WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_humeur WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN v_diva_required AND EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_medical_diagnostic WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_family_history WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_social WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_tmt WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_stroop WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_fluences_verbales WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cvlt WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END)
        ) AS completed_questionnaires
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', (SELECT statuses FROM questionnaire_statuses),
      'tobacco_response', (SELECT row_to_json(t) FROM (SELECT smoking_status FROM tobacco_data) t),
      'dsm5_comorbid_response', (SELECT row_to_json(d) FROM (SELECT diva_evaluated FROM dsm5_comorbid_data) d),
      'completion_status', (SELECT jsonb_build_object(
        'total_questionnaires', total_questionnaires, 
        'completed_questionnaires', completed_questionnaires, 
        'completion_percentage', CASE WHEN total_questionnaires > 0 THEN ROUND((completed_questionnaires::numeric / total_questionnaires::numeric) * 100) ELSE 0 END
      ) FROM completion_calc)
    ) INTO v_result;
    
  ELSE
    v_result := jsonb_build_object('error', 'Unknown visit type: ' || v_visit_type);
  END IF;

  RETURN v_result;
END;
$$;

GRANT EXECUTE ON FUNCTION get_visit_detail_data(UUID) TO authenticated;
