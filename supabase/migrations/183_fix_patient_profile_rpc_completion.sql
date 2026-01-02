-- ============================================================================
-- Fix Patient Profile RPC - Accurate Visit Completion Percentage
-- ============================================================================
-- This migration updates the patient profile RPC to use accurate questionnaire
-- counts that match the visit detail page. The old counts were outdated and
-- didn't include all the questionnaires added since initial implementation.
--
-- Key changes:
-- - Updated initial_evaluation from 40 to 51 base questionnaires (excluding conditional)
-- - Added biannual_followup and annual_evaluation visit types (14 questionnaires)
-- - Uses accurate counting that excludes conditional questionnaires not applicable
-- ============================================================================

CREATE OR REPLACE FUNCTION get_patient_profile_data(
  p_patient_id UUID,
  p_center_id UUID,
  p_from_date TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
  v_from_date TIMESTAMPTZ;
BEGIN
  -- Default to 12 months ago if no date provided
  v_from_date := COALESCE(p_from_date, NOW() - INTERVAL '12 months');

  -- Build the complete patient profile data
  WITH 
  -- CTE 1: Patient details
  patient_data AS (
    SELECT *
    FROM v_patients_full
    WHERE id = p_patient_id
    LIMIT 1
  ),
  
  -- CTE 2: All visits for this patient
  patient_visits AS (
    SELECT *
    FROM v_visits_full
    WHERE patient_id = p_patient_id
    ORDER BY scheduled_date DESC
  ),
  
  -- CTE 3: Calculate visit completion for screening visits (5 questionnaires)
  screening_completions AS (
    SELECT 
      v.id AS visit_id,
      5 AS total_questionnaires,
      (
        (CASE WHEN EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_mdq WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_medical_diagnostic WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_bipolar_orientation WHERE visit_id = v.id) THEN 1 ELSE 0 END)
      ) AS completed_questionnaires
    FROM patient_visits v
    WHERE v.visit_type = 'screening'
  ),
  
  -- CTE 4: Calculate visit completion for initial evaluation visits
  -- Base: 51 questionnaires (excluding conditional Fagerstrom, DIVA, and neuropsychological)
  -- We count what's actually completed vs what's required
  initial_eval_completions AS (
    SELECT 
      v.id AS visit_id,
      -- Calculate total dynamically based on what's applicable
      (
        51 + -- Base questionnaires (see breakdown below)
        -- Add Fagerstrom if tobacco indicates smoker/ex-smoker
        (CASE WHEN EXISTS (
          SELECT 1 FROM responses_tobacco t 
          WHERE t.visit_id = v.id 
          AND t.smoking_status IN ('current_smoker', 'ex_smoker')
        ) THEN 1 ELSE 0 END) +
        -- Add DIVA if DSM5 Comorbid indicates evaluation needed
        (CASE WHEN EXISTS (
          SELECT 1 FROM responses_dsm5_comorbid d 
          WHERE d.visit_id = v.id 
          AND d.diva_evaluated = 'oui'
        ) THEN 1 ELSE 0 END)
      ) AS total_questionnaires,
      (
        -- ETAT questionnaires (9)
        (CASE WHEN EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_prise_m WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_stai_ya WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_mars WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_mathys WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_psqi WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_epworth WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        -- TRAITS questionnaires (9)
        (CASE WHEN EXISTS (SELECT 1 FROM responses_asrs WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_ctq WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_bis10 WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_als18 WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_aim WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_wurs25 WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_aq12 WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_csm WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_cti WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        -- HETERO questionnaires (8)
        (CASE WHEN EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_egf WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_alda WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_etat_patient WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_social WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        -- INFIRMIER questionnaires (6 base + 1 conditional Fagerstrom)
        (CASE WHEN EXISTS (SELECT 1 FROM responses_tobacco WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_fagerstrom WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_physical_params WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_blood_pressure WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_sleep_apnea WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_biological_assessment WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_ecg WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        -- MEDICAL questionnaires (19)
        (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_humeur WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_psychotic WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_family_history WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_sis WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_suicide_history WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_perinatalite WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_patho_neuro WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_patho_cardio WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_patho_endoc WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_patho_dermato WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_patho_urinaire WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_antecedents_gyneco WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_patho_hepato_gastro WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_patho_allergique WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_autres_patho WHERE visit_id = v.id) THEN 1 ELSE 0 END)
      ) AS completed_questionnaires
    FROM patient_visits v
    WHERE v.visit_type = 'initial_evaluation'
  ),
  
  -- CTE 5: Calculate visit completion for followup visits (14 questionnaires)
  followup_completions AS (
    SELECT 
      v.id AS visit_id,
      14 AS total_questionnaires,
      (
        (CASE WHEN EXISTS (SELECT 1 FROM responses_asrm WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_qids_sr16 WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_madrs WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_ymrs WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_cgi WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_dsm5_comorbid WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_diva WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_cssrs WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_isa WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_eq5d5l WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_mars WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_psqi WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_epworth WHERE visit_id = v.id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM responses_fast WHERE visit_id = v.id) THEN 1 ELSE 0 END)
      ) AS completed_questionnaires
    FROM patient_visits v
    WHERE v.visit_type IN ('biannual_followup', 'annual_evaluation')
  ),
  
  -- CTE 6: Union all visit completions
  all_visit_completions AS (
    SELECT * FROM screening_completions
    UNION ALL
    SELECT * FROM initial_eval_completions
    UNION ALL
    SELECT * FROM followup_completions
  ),
  
  -- CTE 7: Patient stats calculation
  patient_stats AS (
    SELECT
      COUNT(*) FILTER (WHERE TRUE) AS total_visits,
      COUNT(*) FILTER (WHERE status = 'completed') AS completed_visits,
      COUNT(*) FILTER (WHERE status = 'scheduled' AND scheduled_date >= NOW()) AS upcoming_visits,
      (SELECT scheduled_date FROM patient_visits WHERE status = 'completed' ORDER BY scheduled_date DESC LIMIT 1) AS last_visit_date,
      (SELECT scheduled_date FROM patient_visits WHERE status = 'scheduled' AND scheduled_date >= NOW() ORDER BY scheduled_date ASC LIMIT 1) AS next_visit_date
    FROM patient_visits
  ),
  
  -- CTE 8: Evaluations with related data
  evaluations_data AS (
    SELECT
      e.id,
      e.patient_id,
      e.visit_id,
      e.evaluation_date,
      e.evaluator_id,
      COALESCE(up.first_name || ' ' || up.last_name, 'Unknown') AS evaluator_name,
      v.visit_type,
      e.diagnosis,
      e.clinical_notes,
      e.risk_assessment,
      e.treatment_plan,
      e.metadata
    FROM evaluations e
    LEFT JOIN user_profiles up ON e.evaluator_id = up.id
    LEFT JOIN visits v ON e.visit_id = v.id
    WHERE e.patient_id = p_patient_id
    ORDER BY e.evaluation_date DESC
  ),
  
  -- CTE 9: Latest risk level
  latest_risk AS (
    SELECT
      CASE
        WHEN risk_assessment->>'suicide_risk' = 'high' OR risk_assessment->>'relapse_risk' = 'high' THEN 'high'
        WHEN risk_assessment->>'suicide_risk' = 'moderate' OR risk_assessment->>'relapse_risk' = 'moderate' THEN 'moderate'
        WHEN risk_assessment->>'suicide_risk' = 'low' OR risk_assessment->>'relapse_risk' = 'low' THEN 'low'
        ELSE 'none'
      END AS risk_level
    FROM evaluations_data
    WHERE risk_assessment IS NOT NULL
    ORDER BY evaluation_date DESC
    LIMIT 1
  ),
  
  -- CTE 10: Mood trend data
  mood_trend_data AS (
    SELECT
      evaluation_date AS date,
      (metadata->>'mood_score')::numeric AS mood_score
    FROM evaluations_data
    WHERE metadata IS NOT NULL 
      AND metadata->>'mood_score' IS NOT NULL
      AND evaluation_date >= v_from_date
    ORDER BY evaluation_date ASC
  ),
  
  -- CTE 11: Risk history data
  risk_history_data AS (
    SELECT
      evaluation_date AS date,
      COALESCE(risk_assessment->>'suicide_risk', 'none') AS suicide_risk,
      COALESCE(risk_assessment->>'relapse_risk', 'none') AS relapse_risk
    FROM evaluations_data
    WHERE risk_assessment IS NOT NULL
      AND evaluation_date >= v_from_date
    ORDER BY evaluation_date ASC
  ),
  
  -- CTE 12: Adherence trend data
  adherence_trend_data AS (
    SELECT
      evaluation_date AS date,
      (metadata->>'medication_adherence')::numeric AS adherence
    FROM evaluations_data
    WHERE metadata IS NOT NULL 
      AND metadata->>'medication_adherence' IS NOT NULL
      AND evaluation_date >= v_from_date
    ORDER BY evaluation_date ASC
  ),
  
  -- CTE 13: Invitation status
  invitation_status AS (
    SELECT
      CASE WHEN p.user_id IS NOT NULL THEN true ELSE false END AS has_user_account,
      p.user_id,
      (
        SELECT jsonb_build_object(
          'id', ui.id,
          'sent_at', ui.created_at,
          'expires_at', ui.expires_at,
          'email', ui.email
        )
        FROM user_invitations ui
        WHERE ui.patient_id = p_patient_id
          AND ui.status = 'pending'
        ORDER BY ui.created_at DESC
        LIMIT 1
      ) AS pending_invitation
    FROM patients p
    WHERE p.id = p_patient_id
  ),
  
  -- CTE 14: Available doctors for reassignment
  available_doctors AS (
    SELECT
      id,
      first_name,
      last_name
    FROM user_profiles
    WHERE center_id = p_center_id
      AND role = 'healthcare_professional'
      AND active = true
    ORDER BY last_name, first_name
  )
  
  -- Build final JSON result
  SELECT jsonb_build_object(
    'patient', (
      SELECT row_to_json(pd.*)
      FROM patient_data pd
    ),
    
    'stats', (
      SELECT row_to_json(ps.*)
      FROM patient_stats ps
    ),
    
    'visits', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', pv.id,
          'patient_id', pv.patient_id,
          'visit_template_id', pv.visit_template_id,
          'visit_type', pv.visit_type,
          'scheduled_date', pv.scheduled_date,
          'completed_date', pv.completed_date,
          'status', pv.status,
          'notes', pv.notes,
          'conducted_by', pv.conducted_by,
          'created_at', pv.created_at,
          'patient_first_name', pv.patient_first_name,
          'patient_last_name', pv.patient_last_name,
          'medical_record_number', pv.medical_record_number,
          'template_name', pv.template_name,
          'pathology_id', pv.pathology_id,
          'pathology_name', pv.pathology_name,
          'conducted_by_first_name', pv.conducted_by_first_name,
          'conducted_by_last_name', pv.conducted_by_last_name,
          'completionPercentage', COALESCE(
            CASE 
              WHEN avc.total_questionnaires > 0 
              THEN ROUND((avc.completed_questionnaires::numeric / avc.total_questionnaires::numeric) * 100)
              ELSE 0
            END, 0
          )
        )
      )
      FROM patient_visits pv
      LEFT JOIN all_visit_completions avc ON pv.id = avc.visit_id
    ), '[]'::jsonb),
    
    'risk_level', COALESCE((
      SELECT risk_level FROM latest_risk
    ), 'none'),
    
    'evaluations', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', ed.id,
          'patient_id', ed.patient_id,
          'visit_id', ed.visit_id,
          'evaluation_date', ed.evaluation_date,
          'evaluator_id', ed.evaluator_id,
          'evaluator_name', ed.evaluator_name,
          'visit_type', ed.visit_type,
          'diagnosis', ed.diagnosis,
          'clinical_notes', ed.clinical_notes,
          'risk_assessment', ed.risk_assessment,
          'treatment_plan', ed.treatment_plan,
          'mood_score', (ed.metadata->>'mood_score')::numeric,
          'medication_adherence', (ed.metadata->>'medication_adherence')::numeric,
          'notes', ed.clinical_notes
        )
      )
      FROM evaluations_data ed
    ), '[]'::jsonb),
    
    'mood_trend', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'date', mtd.date,
          'mood_score', mtd.mood_score,
          'source', 'clinical'
        )
      )
      FROM mood_trend_data mtd
    ), '[]'::jsonb),
    
    'risk_history', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'date', rhd.date,
          'suicide_risk', rhd.suicide_risk,
          'relapse_risk', rhd.relapse_risk
        )
      )
      FROM risk_history_data rhd
    ), '[]'::jsonb),
    
    'adherence_trend', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'date', atd.date,
          'adherence', atd.adherence
        )
      )
      FROM adherence_trend_data atd
    ), '[]'::jsonb),
    
    'invitation_status', (
      SELECT jsonb_build_object(
        'hasUserAccount', has_user_account,
        'userId', user_id,
        'pendingInvitation', pending_invitation
      )
      FROM invitation_status
    ),
    
    'available_doctors', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', ad.id,
          'first_name', ad.first_name,
          'last_name', ad.last_name
        )
      )
      FROM available_doctors ad
    ), '[]'::jsonb)
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_patient_profile_data(UUID, UUID, TIMESTAMPTZ) TO authenticated;

