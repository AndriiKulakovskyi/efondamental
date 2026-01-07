-- ============================================================================
-- Migration: Fix get_visit_detail_data RPC for follow-up visits
-- ============================================================================
-- Issue: biannual_followup and annual_evaluation visits were missing
-- Infirmier module questionnaire statuses, causing completed questionnaires
-- to appear incomplete on the visit page.
--
-- Missing questionnaires:
-- - TOBACCO_FR, FAGERSTROM_FR, PHYSICAL_PARAMS_FR, BLOOD_PRESSURE_FR
-- - ECG_FR, SLEEP_APNEA_FR, BIOLOGICAL_ASSESSMENT_FR
-- - ALDA_FR, EGF_FR, ETAT_PATIENT_FR
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
    -- Screening visit (unchanged)
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
        'CGI_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cgi WHERE visit_id = p_visit_id)),
        'CONSENT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_consent WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_consent WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    completion_calc AS (
      SELECT 6 AS total_questionnaires,
        ((CASE WHEN EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
         (CASE WHEN EXISTS (SELECT 1 FROM responses_consent WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END)) AS completed_questionnaires
    )
    SELECT jsonb_build_object(
      'visit', (SELECT row_to_json(vd.*) FROM visit_data vd),
      'questionnaire_statuses', (SELECT statuses FROM questionnaire_statuses),
      'completion_status', (SELECT jsonb_build_object('total_questionnaires', total_questionnaires, 'completed_questionnaires', completed_questionnaires, 'completion_percentage', CASE WHEN total_questionnaires > 0 THEN ROUND((completed_questionnaires::numeric / total_questionnaires::numeric) * 100) ELSE 0 END) FROM completion_calc)
    ) INTO v_result;

  ELSIF v_visit_type = 'initial_evaluation' THEN
    -- Initial evaluation with all modules including Infirmier, Hetero, Social, and Neuropsy
    WITH visit_data AS (
      SELECT v.*, p.first_name, p.last_name, p.date_of_birth, p.gender
      FROM visits v
      JOIN patients p ON v.patient_id = p.id
      WHERE v.id = p_visit_id
    ),
    -- Get tobacco responses for conditional Fagerstrom logic
    tobacco_data AS (
      SELECT smoking_status FROM responses_tobacco WHERE visit_id = p_visit_id
    ),
    -- Get DSM5 comorbid responses for conditional DIVA logic
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
        'MEDICATION_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_medication WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_medication WHERE visit_id = p_visit_id)),
        'FAST_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fast WHERE visit_id = p_visit_id)),
        'CSSRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cssrs WHERE visit_id = p_visit_id)),
        'ISA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_isa WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    statuses_social AS (
      SELECT jsonb_build_object(
        'BIOGRAPHIE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_biographie WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_biographie WHERE visit_id = p_visit_id)),
        'PARCOURS_SOIN_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_parcours_soin WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_parcours_soin WHERE visit_id = p_visit_id)),
        'SITUATION_SOCIALE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_situation_sociale WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_situation_sociale WHERE visit_id = p_visit_id))
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
    -- Calculate totals with conditional logic for Fagerstrom and DIVA
    completion_calc AS (
      SELECT 
        -- Base questionnaires: 6 auto + 6 base infirmier + 15 hetero + 3 social + 5 neuropsy = 35
        -- Plus conditional: Fagerstrom (if smoker/ex-smoker), DIVA (if diva_evaluated = 'oui')
        35 + (CASE WHEN v_fagerstrom_required THEN 1 ELSE 0 END) + (CASE WHEN v_diva_required THEN 1 ELSE 0 END) AS total_questionnaires,
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
          -- Hetero module (15 base + 1 conditional DIVA)
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
          (CASE WHEN EXISTS (SELECT 1 FROM responses_medication WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- Social module (3)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_biographie WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_parcours_soin WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_situation_sociale WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
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
    -- ==========================================================================
    -- BIANNUAL FOLLOW-UP: 3 modules
    -- - Infirmier (7): TOBACCO, FAGERSTROM (conditional), PHYSICAL_PARAMS, 
    --                  BLOOD_PRESSURE, ECG, SLEEP_APNEA, BIOLOGICAL_ASSESSMENT
    -- - Medical Eval (4): DSM5_COMORBID, DIVA (conditional), CSSRS, ISA
    -- - Thymic Eval (7): MADRS, YMRS, CGI, EGF, ALDA, ETAT_PATIENT, FAST
    -- ==========================================================================
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
        -- Base: 6 infirmier + 3 medical + 7 thymic = 16
        -- Conditional: +1 if Fagerstrom required, +1 if DIVA required
        16 + (CASE WHEN v_fagerstrom_required THEN 1 ELSE 0 END) + (CASE WHEN v_diva_required THEN 1 ELSE 0 END) AS total_questionnaires,
        (
          -- Infirmier (6 base + 1 conditional)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_tobacco WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN v_fagerstrom_required AND EXISTS (SELECT 1 FROM responses_fagerstrom WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_physical_params WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_blood_pressure WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_ecg WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_sleep_apnea WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_biological_assessment WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- Medical Evaluation (3 base + 1 conditional)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN v_diva_required AND EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- Thymic Evaluation (7)
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
    -- ==========================================================================
    -- ANNUAL EVALUATION: Full evaluation with all modules (no ECG in Infirmier)
    -- - Infirmier (6): TOBACCO, FAGERSTROM (conditional), PHYSICAL_PARAMS, 
    --                  BLOOD_PRESSURE, SLEEP_APNEA, BIOLOGICAL_ASSESSMENT
    -- - Thymic Eval (7): MADRS, ALDA, YMRS, FAST, CGI, EGF, ETAT_PATIENT
    -- - Medical Eval: Same as initial_evaluation
    -- - Self-report: ASRM, QIDS_SR16, EQ5D5L, MARS, PSQI, EPWORTH
    -- - Neuropsy: TMT, STROOP, FLUENCES_VERBALES, CVLT, WAIS3_VOCABULAIRE
    -- ==========================================================================
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
        -- Medical Evaluation module (same as initial)
        'DSM5_HUMEUR_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_humeur WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_humeur WHERE visit_id = p_visit_id)),
        'DSM5_COMORBID_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id)),
        'DIVA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_diva WHERE visit_id = p_visit_id)),
        'MEDICAL_DIAGNOSTIC_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_medical_diagnostic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_medical_diagnostic WHERE visit_id = p_visit_id)),
        'FAMILY_HISTORY_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_family_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_family_history WHERE visit_id = p_visit_id)),
        'MEDICATION_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_medication WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_medication WHERE visit_id = p_visit_id)),
        'CSSRS_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cssrs WHERE visit_id = p_visit_id)),
        'ISA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_isa WHERE visit_id = p_visit_id)),
        -- Social module (3)
        'BIOGRAPHIE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_biographie WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_biographie WHERE visit_id = p_visit_id)),
        'PARCOURS_SOIN_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_parcours_soin WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_parcours_soin WHERE visit_id = p_visit_id)),
        'SITUATION_SOCIALE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_situation_sociale WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_situation_sociale WHERE visit_id = p_visit_id)),
        -- Neuropsy module (5)
        'TMT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tmt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tmt WHERE visit_id = p_visit_id)),
        'STROOP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_stroop WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_stroop WHERE visit_id = p_visit_id)),
        'FLUENCES_VERBALES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fluences_verbales WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fluences_verbales WHERE visit_id = p_visit_id)),
        'CVLT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cvlt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cvlt WHERE visit_id = p_visit_id)),
        'WAIS3_VOCABULAIRE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id))
      ) AS statuses
    ),
    completion_calc AS (
      SELECT 
        -- Base: 6 auto + 5 infirmier + 7 thymic + 7 medical + 3 social + 5 neuropsy = 33
        -- Conditional: +1 if Fagerstrom required, +1 if DIVA required
        33 + (CASE WHEN v_fagerstrom_required THEN 1 ELSE 0 END) + (CASE WHEN v_diva_required THEN 1 ELSE 0 END) AS total_questionnaires,
        (
          -- Self-report (6)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_mars WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_psqi WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_epworth WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- Infirmier (5 base + 1 conditional - no ECG)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_tobacco WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN v_fagerstrom_required AND EXISTS (SELECT 1 FROM responses_fagerstrom WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_physical_params WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_blood_pressure WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_sleep_apnea WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_biological_assessment WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- Thymic Evaluation (7)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_alda WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_egf WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_etat_patient WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- Medical Evaluation (7 base + 1 conditional DIVA)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_humeur WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN v_diva_required AND EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_medical_diagnostic WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_family_history WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_medication WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- Social (3)
          (CASE WHEN EXISTS (SELECT 1 FROM responses_biographie WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_parcours_soin WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM responses_situation_sociale WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          -- Neuropsy (5)
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
    -- Unknown visit type
    v_result := jsonb_build_object('error', 'Unknown visit type: ' || v_visit_type);
  END IF;

  RETURN v_result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_visit_detail_data(UUID) TO authenticated;

