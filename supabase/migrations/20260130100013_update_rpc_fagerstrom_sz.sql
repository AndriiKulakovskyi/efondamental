-- ============================================================================
-- Migration: Update get_visit_detail_data RPC to include FAGERSTROM_SZ
-- Description: Add FAGERSTROM_SZ questionnaire status tracking for schizophrenia initial visits
-- ============================================================================

-- This migration updates the get_visit_detail_data function to include the
-- FAGERSTROM_SZ questionnaire status in the v_statuses JSON object.

CREATE OR REPLACE FUNCTION "public"."get_visit_detail_data"("p_visit_id" "uuid") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
DECLARE
  v_visit_type TEXT;
  v_result JSONB;
  v_tobacco_smoking_status TEXT;
  v_dsm5_diva_evaluated TEXT;
  v_fagerstrom_required BOOLEAN;
  v_diva_required BOOLEAN;
  v_wais4_accepted BOOLEAN;
  v_wais3_accepted BOOLEAN;
  v_statuses JSONB;
BEGIN
  SELECT visit_type INTO v_visit_type FROM visits WHERE id = p_visit_id;
  IF v_visit_type IS NULL THEN RETURN jsonb_build_object('error', 'Visit not found'); END IF;
  
  SELECT smoking_status INTO v_tobacco_smoking_status FROM bipolar_nurse_tobacco WHERE visit_id = p_visit_id;
  SELECT diva_evaluated INTO v_dsm5_diva_evaluated FROM bipolar_dsm5_comorbid WHERE visit_id = p_visit_id;
  SELECT accepted_for_neuropsy_evaluation INTO v_wais4_accepted FROM bipolar_wais4_criteria WHERE visit_id = p_visit_id;
  SELECT accepted_for_neuropsy_evaluation INTO v_wais3_accepted FROM bipolar_wais3_criteria WHERE visit_id = p_visit_id;
  v_fagerstrom_required := v_tobacco_smoking_status = 'current_smoker';
  v_diva_required := v_dsm5_diva_evaluated = 'oui';

  IF v_visit_type = 'screening' THEN
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
        'ASRM', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_asrm WHERE visit_id = p_visit_id)),
        'QIDS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id)),
        'MDQ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mdq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mdq WHERE visit_id = p_visit_id)),
        'DIAGNOSTIC', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_diagnostic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_diagnostic WHERE visit_id = p_visit_id)),
        'ORIENTATION', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_orientation WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_orientation WHERE visit_id = p_visit_id)),
        'SZ_DIAGNOSTIC', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_screening_diagnostic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_screening_diagnostic WHERE visit_id = p_visit_id)),
        'SZ_ORIENTATION', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_screening_orientation WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_screening_orientation WHERE visit_id = p_visit_id))
      ),
      'completion_status', jsonb_build_object(
        'total_questionnaires', 5,
        'completed_questionnaires', (
          (CASE WHEN EXISTS (SELECT 1 FROM bipolar_asrm WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM bipolar_mdq WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM bipolar_diagnostic WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
          (CASE WHEN EXISTS (SELECT 1 FROM bipolar_orientation WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END)
        ),
        'completion_percentage', ROUND(
          (
            (CASE WHEN EXISTS (SELECT 1 FROM bipolar_asrm WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
            (CASE WHEN EXISTS (SELECT 1 FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
            (CASE WHEN EXISTS (SELECT 1 FROM bipolar_mdq WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
            (CASE WHEN EXISTS (SELECT 1 FROM bipolar_diagnostic WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
            (CASE WHEN EXISTS (SELECT 1 FROM bipolar_orientation WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END)
          )::DECIMAL / 5 * 100
        )
      )
    ) INTO v_result;

  ELSIF v_visit_type = 'initial_evaluation' THEN
    v_statuses := jsonb_build_object(
      'INF_TOBACCO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_tobacco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_tobacco WHERE visit_id = p_visit_id)),
      'INF_FAGERSTROM', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_fagerstrom WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_fagerstrom WHERE visit_id = p_visit_id)),
      'INF_PHYSICAL_PARAMS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_physical_params WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_physical_params WHERE visit_id = p_visit_id)),
      'INF_BLOOD_PRESSURE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_blood_pressure WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_blood_pressure WHERE visit_id = p_visit_id)),
      'INF_SLEEP_APNEA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_sleep_apnea WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_sleep_apnea WHERE visit_id = p_visit_id)),
      'INF_BIOLOGICAL_ASSESSMENT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_biological_assessment WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_biological_assessment WHERE visit_id = p_visit_id)),
      'INF_DOSSIER_INFIRMIER', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_dossier_infirmier WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_dossier_infirmier WHERE visit_id = p_visit_id)),
      'INF_BILAN_BIOLOGIQUE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_bilan_biologique WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_bilan_biologique WHERE visit_id = p_visit_id)),
      'MADRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_madrs WHERE visit_id = p_visit_id)),
      'YMRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_ymrs WHERE visit_id = p_visit_id)),
      'CGI', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cgi WHERE visit_id = p_visit_id)),
      'EGF', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_egf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_egf WHERE visit_id = p_visit_id)),
      'ALDA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_alda WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_alda WHERE visit_id = p_visit_id)),
      'ETAT_PATIENT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_etat_patient WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_etat_patient WHERE visit_id = p_visit_id)),
      'FAST', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_fast WHERE visit_id = p_visit_id)),
      'EQ5D5L', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_eq5d5l WHERE visit_id = p_visit_id)),
      'PRISE_M', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_prise_m WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_prise_m WHERE visit_id = p_visit_id)),
      'STAI_YA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_stai_ya WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_stai_ya WHERE visit_id = p_visit_id)),
      'MARS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mars WHERE visit_id = p_visit_id)),
      'MATHYS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mathys WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mathys WHERE visit_id = p_visit_id)),
      'ASRM', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_asrm WHERE visit_id = p_visit_id)),
      'QIDS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id)),
      'PSQI', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_psqi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_psqi WHERE visit_id = p_visit_id)),
      'EPWORTH', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_epworth WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_epworth WHERE visit_id = p_visit_id)),
      'DSM5_HUMEUR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_dsm5_humeur WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_dsm5_humeur WHERE visit_id = p_visit_id)),
      'DSM5_PSYCHOTIC', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_dsm5_psychotic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_dsm5_psychotic WHERE visit_id = p_visit_id)),
      'DSM5_COMORBID', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_dsm5_comorbid WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_dsm5_comorbid WHERE visit_id = p_visit_id)),
      'DIVA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_diva WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_diva WHERE visit_id = p_visit_id)),
      'FAMILY_HISTORY', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_family_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_family_history WHERE visit_id = p_visit_id)),
      'CSSRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cssrs WHERE visit_id = p_visit_id)),
      'ISA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_isa WHERE visit_id = p_visit_id)),
      'SIS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_sis WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_sis WHERE visit_id = p_visit_id)),
      'SUICIDE_HISTORY', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_suicide_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_suicide_history WHERE visit_id = p_visit_id))
    );
    v_statuses := v_statuses || jsonb_build_object(
      'PERINATALITE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_perinatalite WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_perinatalite WHERE visit_id = p_visit_id)),
      'PATHO_NEURO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_neuro WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_neuro WHERE visit_id = p_visit_id)),
      'PATHO_CARDIO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_cardio WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_cardio WHERE visit_id = p_visit_id)),
      'PATHO_ENDOC', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_endoc WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_endoc WHERE visit_id = p_visit_id)),
      'PATHO_DERMATO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_dermato WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_dermato WHERE visit_id = p_visit_id)),
      'PATHO_URINAIRE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_urinaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_urinaire WHERE visit_id = p_visit_id)),
      'ANTECEDENTS_GYNECO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_antecedents_gyneco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_antecedents_gyneco WHERE visit_id = p_visit_id)),
      'PATHO_HEPATO_GASTRO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_hepato_gastro WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_hepato_gastro WHERE visit_id = p_visit_id)),
      'PATHO_ALLERGIQUE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_allergique WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_allergique WHERE visit_id = p_visit_id)),
      'AUTRES_PATHO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_autres_patho WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_autres_patho WHERE visit_id = p_visit_id)),
      'SOCIAL', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_social WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_social WHERE visit_id = p_visit_id)),
      'ASRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_asrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_asrs WHERE visit_id = p_visit_id)),
      'CTQ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_ctq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_ctq WHERE visit_id = p_visit_id)),
      'BIS10', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_bis10 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_bis10 WHERE visit_id = p_visit_id)),
      'ALS18', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_als18 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_als18 WHERE visit_id = p_visit_id)),
      'AIM', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_aim WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_aim WHERE visit_id = p_visit_id)),
      'WURS25', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wurs25 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wurs25 WHERE visit_id = p_visit_id)),
      'AQ12', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_aq12 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_aq12 WHERE visit_id = p_visit_id)),
      'CSM', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_csm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_csm WHERE visit_id = p_visit_id)),
      'CTI', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cti WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cti WHERE visit_id = p_visit_id)),
      'DOSSIER_INFIRMIER_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_dossier_infirmier WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_dossier_infirmier WHERE visit_id = p_visit_id)),
      'BILAN_BIOLOGIQUE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_bilan_biologique WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_bilan_biologique WHERE visit_id = p_visit_id)),
      'PANSS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_panss WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_panss WHERE visit_id = p_visit_id)),
      'CDSS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_cdss WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_cdss WHERE visit_id = p_visit_id)),
      'BARS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_bars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_bars WHERE visit_id = p_visit_id)),
      'SUMD', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_sumd WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_sumd WHERE visit_id = p_visit_id)),
      'AIMS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_aims WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_aims WHERE visit_id = p_visit_id)),
      'BARNES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_barnes WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_barnes WHERE visit_id = p_visit_id))
    );
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
      'PERINATALITE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_perinatalite WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_perinatalite WHERE visit_id = p_visit_id)),
      'BILAN_SOCIAL_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_bilan_social WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_bilan_social WHERE visit_id = p_visit_id)),
      'SQOL_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_sqol WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_sqol WHERE visit_id = p_visit_id)),
      'CTQ_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_ctq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_ctq WHERE visit_id = p_visit_id)),
      'MARS_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_mars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_mars WHERE visit_id = p_visit_id)),
      'BIS_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_bis WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_bis WHERE visit_id = p_visit_id)),
      'EQ5D5L_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_eq5d5l WHERE visit_id = p_visit_id)),
      'IPAQ_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_ipaq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_ipaq WHERE visit_id = p_visit_id)),
      'YBOCS_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_ybocs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_ybocs WHERE visit_id = p_visit_id)),
      'WURS25_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_wurs25 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_wurs25 WHERE visit_id = p_visit_id)),
      'STORI_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_stori WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_stori WHERE visit_id = p_visit_id)),
      'SOGS_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_sogs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_sogs WHERE visit_id = p_visit_id)),
      'PSQI_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_psqi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_psqi WHERE visit_id = p_visit_id)),
      'PRESENTEISME_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_presenteisme WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_presenteisme WHERE visit_id = p_visit_id)),
      'FAGERSTROM_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_fagerstrom WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_fagerstrom WHERE visit_id = p_visit_id))
    );

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

  ELSIF v_visit_type = 'annual_evaluation' THEN
    v_statuses := jsonb_build_object(
      'TOBACCO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_tobacco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_tobacco WHERE visit_id = p_visit_id)),
      'FAGERSTROM', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_fagerstrom WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_fagerstrom WHERE visit_id = p_visit_id)),
      'PHYSICAL_PARAMS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_physical_params WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_physical_params WHERE visit_id = p_visit_id)),
      'BLOOD_PRESSURE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_blood_pressure WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_blood_pressure WHERE visit_id = p_visit_id)),
      'ECG', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_ecg WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_ecg WHERE visit_id = p_visit_id)),
      'SLEEP_APNEA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_sleep_apnea WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_sleep_apnea WHERE visit_id = p_visit_id)),
      'BIOLOGICAL_ASSESSMENT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_biological_assessment WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_biological_assessment WHERE visit_id = p_visit_id)),
      'MADRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_madrs WHERE visit_id = p_visit_id)),
      'ALDA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_alda WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_alda WHERE visit_id = p_visit_id)),
      'YMRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_ymrs WHERE visit_id = p_visit_id)),
      'FAST', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_fast WHERE visit_id = p_visit_id)),
      'CGI', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cgi WHERE visit_id = p_visit_id)),
      'EGF', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_egf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_egf WHERE visit_id = p_visit_id)),
      'ETAT_PATIENT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_etat_patient WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_etat_patient WHERE visit_id = p_visit_id)),
      'DSM5_HUMEUR_ACTUELS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_diag_psy_sem_humeur_actuels WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_diag_psy_sem_humeur_actuels WHERE visit_id = p_visit_id)),
      'DSM5_HUMEUR_DEPUIS_VISITE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_diag_psy_sem_humeur_depuis_visite WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_diag_psy_sem_humeur_depuis_visite WHERE visit_id = p_visit_id)),
      'DSM5_PSYCHOTIQUES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_diag_psy_sem_psychotiques WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_diag_psy_sem_psychotiques WHERE visit_id = p_visit_id)),
      'ISA_FOLLOWUP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_isa WHERE visit_id = p_visit_id)),
      'SUICIDE_BEHAVIOR_FOLLOWUP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_suicide_behavior WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_suicide_behavior WHERE visit_id = p_visit_id)),
      'SUIVI_RECOMMANDATIONS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_psy_traitement_semestriel WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_psy_traitement_semestriel WHERE visit_id = p_visit_id)),
      'TRAITEMENT_NON_PHARMACOLOGIQUE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_non_pharmacologic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_non_pharmacologic WHERE visit_id = p_visit_id))
    );
    
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
        'total_questionnaires', 21,
        'completed_questionnaires', 0,
        'completion_percentage', 0
      )
    ) INTO v_result;
  ELSE
    RETURN jsonb_build_object('error', 'Unknown visit type: ' || v_visit_type);
  END IF;
  
  RETURN v_result;
END;
$$;

ALTER FUNCTION "public"."get_visit_detail_data"("p_visit_id" "uuid") OWNER TO "postgres";
