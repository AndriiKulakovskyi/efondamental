-- ============================================================================
-- Update Patient Profile RPC to Use Stored Completion Percentage
-- ============================================================================
-- This migration updates the patient profile RPC to prefer the stored
-- completion_percentage from the visits table (which is calculated by the
-- visit detail page and accurately handles conditional questionnaires).
--
-- Falls back to the calculated value only if no stored value exists.
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
  
  -- CTE 2: All visits for this patient (now includes stored completion columns)
  patient_visits AS (
    SELECT 
      vf.*,
      v.completion_percentage AS stored_completion_percentage
    FROM v_visits_full vf
    JOIN visits v ON v.id = vf.id
    WHERE vf.patient_id = p_patient_id
    ORDER BY vf.scheduled_date DESC
  ),
  
  -- CTE 3: Calculate visit completion for screening visits (5 questionnaires)
  -- Only used as fallback when stored value is not available
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
  
  -- CTE 4: Simple fallback for other visit types (approximate)
  -- This is only used when stored completion_percentage is NULL
  fallback_completions AS (
    SELECT 
      v.id AS visit_id,
      -- Default estimates - these are only used if visit was never opened
      CASE 
        WHEN v.visit_type = 'screening' THEN 5
        WHEN v.visit_type = 'initial_evaluation' THEN 51
        WHEN v.visit_type IN ('biannual_followup', 'annual_evaluation') THEN 14
        ELSE 10
      END AS total_questionnaires,
      0 AS completed_questionnaires
    FROM patient_visits v
    WHERE v.stored_completion_percentage IS NULL
  ),
  
  -- CTE 5: Combine screening calculations with fallback
  all_visit_completions AS (
    SELECT * FROM screening_completions
    UNION ALL
    SELECT * FROM fallback_completions
    WHERE visit_id NOT IN (SELECT visit_id FROM screening_completions)
  ),
  
  -- CTE 6: Latest clinical evaluation with risk level
  latest_evaluation AS (
    SELECT 
      e.id,
      e.visit_id,
      e.evaluation_date,
      e.diagnosis,
      e.clinical_notes,
      e.risk_assessment,
      e.treatment_plan,
      e.metadata,
      u.first_name AS evaluator_first_name,
      u.last_name AS evaluator_last_name,
      v.visit_type
    FROM clinical_evaluations e
    JOIN user_profiles u ON e.evaluator_id = u.id
    JOIN visits v ON e.visit_id = v.id
    WHERE v.patient_id = p_patient_id
    ORDER BY e.evaluation_date DESC
    LIMIT 1
  ),
  
  -- CTE 7: Latest risk level (from CSSRS if available)
  latest_risk AS (
    SELECT 
      CASE 
        WHEN r.suicide_ideation_severity >= 4 THEN 'high'
        WHEN r.suicide_ideation_severity >= 2 THEN 'moderate'
        WHEN r.suicide_ideation_severity >= 1 THEN 'low'
        ELSE 'none'
      END AS risk_level
    FROM responses_cssrs r
    JOIN visits v ON r.visit_id = v.id
    WHERE v.patient_id = p_patient_id
    ORDER BY r.completed_at DESC
    LIMIT 1
  ),
  
  -- CTE 8: All evaluations history
  evaluations_data AS (
    SELECT 
      e.id,
      v.patient_id,
      e.visit_id,
      e.evaluation_date,
      e.evaluator_id,
      CONCAT(u.first_name, ' ', u.last_name) AS evaluator_name,
      v.visit_type,
      e.diagnosis,
      e.clinical_notes,
      e.risk_assessment,
      e.treatment_plan,
      e.metadata
    FROM clinical_evaluations e
    JOIN user_profiles u ON e.evaluator_id = u.id
    JOIN visits v ON e.visit_id = v.id
    WHERE v.patient_id = p_patient_id
    ORDER BY e.evaluation_date DESC
  ),
  
  -- CTE 9: Mood trend data (from QIDS and ASRM)
  mood_trend_data AS (
    SELECT 
      v.scheduled_date AS date,
      q.total_score AS mood_score,
      'qids' AS source
    FROM responses_qids_sr16 q
    JOIN visits v ON q.visit_id = v.id
    WHERE v.patient_id = p_patient_id
    AND v.scheduled_date >= v_from_date
    UNION ALL
    SELECT 
      v.scheduled_date AS date,
      a.total_score AS mood_score,
      'asrm' AS source
    FROM responses_asrm a
    JOIN visits v ON a.visit_id = v.id
    WHERE v.patient_id = p_patient_id
    AND v.scheduled_date >= v_from_date
    ORDER BY date DESC
  ),
  
  -- CTE 10: Risk history (simplified)
  risk_history_data AS (
    SELECT 
      v.scheduled_date AS date,
      CASE 
        WHEN r.suicide_ideation_severity >= 4 THEN 'high'
        WHEN r.suicide_ideation_severity >= 2 THEN 'moderate'
        WHEN r.suicide_ideation_severity >= 1 THEN 'low'
        ELSE 'none'
      END AS suicide_risk,
      'none' AS relapse_risk
    FROM responses_cssrs r
    JOIN visits v ON r.visit_id = v.id
    WHERE v.patient_id = p_patient_id
    AND v.scheduled_date >= v_from_date
    ORDER BY date DESC
  ),
  
  -- CTE 11: Adherence trend (from MARS)
  adherence_trend_data AS (
    SELECT 
      v.scheduled_date AS date,
      m.total_score * 10 AS adherence  -- Scale to percentage
    FROM responses_mars m
    JOIN visits v ON m.visit_id = v.id
    WHERE v.patient_id = p_patient_id
    AND v.scheduled_date >= v_from_date
    ORDER BY date DESC
  ),
  
  -- CTE 12: Patient stats
  patient_stats AS (
    SELECT 
      (SELECT COUNT(*) FROM visits WHERE patient_id = p_patient_id) AS total_visits,
      (SELECT COUNT(*) FROM visits WHERE patient_id = p_patient_id AND status = 'completed') AS completed_visits,
      (SELECT COUNT(*) FROM visits WHERE patient_id = p_patient_id AND status = 'scheduled' AND scheduled_date >= NOW()) AS upcoming_visits
  ),
  
  -- CTE 13: Check invitation status
  invitation_status AS (
    SELECT 
      EXISTS (SELECT 1 FROM auth.users WHERE id = (SELECT user_id FROM patients WHERE id = p_patient_id)) AS has_user_account,
      (SELECT user_id FROM patients WHERE id = p_patient_id) AS user_id,
      EXISTS (
        SELECT 1 FROM patient_invitations 
        WHERE patient_id = p_patient_id 
        AND used_at IS NULL 
        AND expires_at > NOW()
      ) AS pending_invitation
  ),
  
  -- CTE 14: Available doctors for assignment
  available_doctors AS (
    SELECT 
      up.id,
      up.first_name,
      up.last_name
    FROM user_profiles up
    JOIN user_center_assignments uca ON up.id = uca.user_id
    WHERE uca.center_id = p_center_id
    AND up.role IN ('healthcare_professional', 'manager')
  )

  -- Build the final JSON result
  SELECT jsonb_build_object(
    'patient', (SELECT row_to_json(pd.*) FROM patient_data pd),
    
    'stats', (
      SELECT row_to_json(ps.*)
      FROM patient_stats ps
    ),
    
    -- Use stored completion_percentage if available, otherwise fall back to calculation
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
          -- PREFER stored completion_percentage, fall back to calculated if not available
          'completionPercentage', COALESCE(
            pv.stored_completion_percentage,  -- Use stored value if available
            CASE 
              WHEN avc.total_questionnaires > 0 
              THEN ROUND((avc.completed_questionnaires::numeric / avc.total_questionnaires::numeric) * 100)
              ELSE 0
            END
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

