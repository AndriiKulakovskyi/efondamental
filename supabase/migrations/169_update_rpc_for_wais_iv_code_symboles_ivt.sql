-- ============================================================================
-- Update RPC Functions to Support WAIS_IV_CODE_SYMBOLES_IVT
-- ============================================================================
-- This migration updates the get_visit_detail stored procedure to recognize
-- the new WAIS_IV_CODE_SYMBOLES_IVT questionnaire code while maintaining
-- backward compatibility with WAIS4_CODE_FR.
--
-- Both codes now map to the same underlying table: responses_wais4_code
-- ============================================================================

-- Drop and recreate the get_visit_detail function with updated logic
DROP FUNCTION IF EXISTS get_visit_detail(UUID);

CREATE OR REPLACE FUNCTION get_visit_detail(p_visit_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
  v_visit_type TEXT;
BEGIN
  -- Get visit type
  SELECT visit_type INTO v_visit_type FROM visits WHERE id = p_visit_id;
  
  -- Build the result JSON
  SELECT jsonb_build_object(
    'visit', row_to_json(v.*),
    'patient', row_to_json(p.*),
    'questionnaires', jsonb_build_object(
      'ASRM', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_asrm WHERE visit_id = p_visit_id)),
      'QIDS_SR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids_sr WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids_sr WHERE visit_id = p_visit_id)),
      'QIDS_C', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_qids_c WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_qids_c WHERE visit_id = p_visit_id)),
      'MDQ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_mdq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_mdq WHERE visit_id = p_visit_id)),
      'MADRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_madrs WHERE visit_id = p_visit_id)),
      'YMRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_ymrs WHERE visit_id = p_visit_id)),
      'CGI_BP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cgi_bp WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cgi_bp WHERE visit_id = p_visit_id)),
      'GAF', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_gaf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_gaf WHERE visit_id = p_visit_id)),
      'FAST', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fast WHERE visit_id = p_visit_id)),
      'BISS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_biss WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_biss WHERE visit_id = p_visit_id)),
      'ISBD', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_isbd WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_isbd WHERE visit_id = p_visit_id)),
      'CUDOS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cudos WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cudos WHERE visit_id = p_visit_id)),
      'ANTECEDENTS_PSYCHIATRIQUES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_antecedents_psychiatriques WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_antecedents_psychiatriques WHERE visit_id = p_visit_id)),
      'ANTECEDENTS_PERINATAUX', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_antecedents_perinataux WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_antecedents_perinataux WHERE visit_id = p_visit_id)),
      'SUICIDE_HISTORY', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_suicide_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_suicide_history WHERE visit_id = p_visit_id)),
      'PERINATALITE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_perinatalite WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_perinatalite WHERE visit_id = p_visit_id)),
      'PATHO_NEURO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_neuro WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_neuro WHERE visit_id = p_visit_id)),
      'PATHO_CARDIO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_cardio WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_cardio WHERE visit_id = p_visit_id)),
      'PATHO_ENDOC', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_endoc WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_endoc WHERE visit_id = p_visit_id)),
      'PATHO_DERMATO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_dermato WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_dermato WHERE visit_id = p_visit_id)),
      'PATHO_URINAIRE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_urinaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_urinaire WHERE visit_id = p_visit_id)),
      'ANTECEDENTS_GYNECO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_antecedents_gyneco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_antecedents_gyneco WHERE visit_id = p_visit_id)),
      'PATHO_HEPATO_GASTRO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_hepato_gastro WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_hepato_gastro WHERE visit_id = p_visit_id)),
      'PATHO_ALLERGIQUE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_patho_allergique WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_patho_allergique WHERE visit_id = p_visit_id)),
      'AUTRES_PATHO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_autres_patho WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_autres_patho WHERE visit_id = p_visit_id)),
      'INFIRMIER_CONSTANTES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_infirmier_constantes WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_infirmier_constantes WHERE visit_id = p_visit_id)),
      'INFIRMIER_RISQUES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_infirmier_risques WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_infirmier_risques WHERE visit_id = p_visit_id)),
      'SOCIAL_LOGEMENT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_social_logement WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_social_logement WHERE visit_id = p_visit_id)),
      'SOCIAL_FAMILLE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_social_famille WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_social_famille WHERE visit_id = p_visit_id)),
      'SOCIAL_TRAVAIL', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_social_travail WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_social_travail WHERE visit_id = p_visit_id)),
      'SOCIAL_RESSOURCES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_social_ressources WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_social_ressources WHERE visit_id = p_visit_id)),
      'CVLT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cvlt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cvlt WHERE visit_id = p_visit_id)),
      -- Support both old and new codes for WAIS-IV Code/Symboles/IVT
      'WAIS4_CODE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_code WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_code WHERE visit_id = p_visit_id)),
      'WAIS_IV_CODE_SYMBOLES_IVT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_code WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_code WHERE visit_id = p_visit_id)),
      'WAIS4_DIGIT_SPAN_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais4_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais4_digit_span WHERE visit_id = p_visit_id)),
      'TMT_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_tmt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_tmt WHERE visit_id = p_visit_id)),
      'STROOP_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_stroop WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_stroop WHERE visit_id = p_visit_id)),
      'FLUENCES_VERBALES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_fluences_verbales WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_fluences_verbales WHERE visit_id = p_visit_id)),
      'COBRA_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_cobra WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_cobra WHERE visit_id = p_visit_id)),
      'WAIS3_VOCABULAIRE_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_vocabulaire WHERE visit_id = p_visit_id)),
      'WAIS3_MATRICES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_matrices WHERE visit_id = p_visit_id)),
      'WAIS3_CODE_SYMBOLES_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_code_symboles WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_code_symboles WHERE visit_id = p_visit_id)),
      'WAIS3_DIGIT_SPAN_FR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_wais3_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_wais3_digit_span WHERE visit_id = p_visit_id)),
      'TEST_COMMISSIONS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM responses_test_commissions WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM responses_test_commissions WHERE visit_id = p_visit_id))
    ),
    'progress', jsonb_build_object(
      'total', (
        CASE v_visit_type
          WHEN 'screening' THEN 3  -- ASRM, QIDS_SR, MDQ
          WHEN 'followup' THEN 3   -- ASRM, QIDS_SR, CGI_BP
          ELSE 0
        END
      ),
      'completed', (
        CASE v_visit_type
          WHEN 'screening' THEN 
            (CASE WHEN EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
            (CASE WHEN EXISTS (SELECT 1 FROM responses_qids_sr WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
            (CASE WHEN EXISTS (SELECT 1 FROM responses_mdq WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END)
          WHEN 'followup' THEN
            (CASE WHEN EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
            (CASE WHEN EXISTS (SELECT 1 FROM responses_qids_sr WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END) +
            (CASE WHEN EXISTS (SELECT 1 FROM responses_cgi_bp WHERE visit_id = p_visit_id) THEN 1 ELSE 0 END)
          ELSE 0
        END
      )
    )
  ) INTO v_result
  FROM visits v
  JOIN patients p ON v.patient_id = p.id
  WHERE v.id = p_visit_id;
  
  RETURN v_result;
END;
$$;

-- Add comment explaining the dual code support
COMMENT ON FUNCTION get_visit_detail(UUID) IS 'Returns complete visit details including questionnaire completion status. Supports both WAIS4_CODE_FR (legacy) and WAIS_IV_CODE_SYMBOLES_IVT (new) codes mapping to the same responses_wais4_code table.';

