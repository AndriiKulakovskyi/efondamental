-- ============================================================================
-- CRITICAL FIX: Update RPC to use stored completion_percentage
-- ============================================================================
-- The RPC was calculating completion instead of reading the stored value.
-- This migration ensures it reads from the visits table directly.
-- ============================================================================

-- First, let's verify the column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'visits' AND column_name = 'completion_percentage'
  ) THEN
    RAISE EXCEPTION 'Column visits.completion_percentage does not exist. Please run migration 184 first.';
  END IF;
END $$;

-- Now update the RPC function to use the stored value
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
  
  -- CTE 2: All visits for this patient WITH stored completion percentage
  patient_visits AS (
    SELECT 
      vf.*,
      v.completion_percentage
    FROM v_visits_full vf
    JOIN visits v ON v.id = vf.id
    WHERE vf.patient_id = p_patient_id
    ORDER BY vf.scheduled_date DESC
  ),
  
  -- CTE 3: All evaluations history (used by multiple CTEs)
  evaluations_data AS (
    SELECT
      e.id,
      v.patient_id,
      e.visit_id,
      e.evaluation_date,
      e.evaluator_id,
      CONCAT(up.first_name, ' ', up.last_name) AS evaluator_name,
      v.visit_type,
      e.diagnosis,
      e.clinical_notes,
      e.risk_assessment,
      e.treatment_plan,
      e.metadata
    FROM evaluations e
    LEFT JOIN user_profiles up ON e.evaluator_id = up.id
    LEFT JOIN visits v ON e.visit_id = v.id
    WHERE v.patient_id = p_patient_id
    ORDER BY e.evaluation_date DESC
  ),
  
  -- CTE 4: Latest risk level (from evaluations)
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
  
  -- CTE 5: Mood trend data (from evaluations)
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
  
  -- CTE 6: Risk history data (from evaluations)
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
  
  -- CTE 7: Adherence trend (from evaluations)
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
  
  -- CTE 8: Patient stats
  patient_stats AS (
    SELECT 
      (SELECT COUNT(*) FROM visits WHERE patient_id = p_patient_id) AS total_visits,
      (SELECT COUNT(*) FROM visits WHERE patient_id = p_patient_id AND status = 'completed') AS completed_visits,
      (SELECT COUNT(*) FROM visits WHERE patient_id = p_patient_id AND status = 'scheduled' AND scheduled_date >= NOW()) AS upcoming_visits
  ),
  
  -- CTE 9: Check invitation status
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
  
  -- CTE 10: Available doctors for assignment
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

  -- Build the final JSON result
  SELECT jsonb_build_object(
    'patient', (SELECT row_to_json(pd.*) FROM patient_data pd),
    
    'stats', (
      SELECT row_to_json(ps.*)
      FROM patient_stats ps
    ),
    
    -- CRITICAL FIX: Use the stored completion_percentage directly
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
          -- USE STORED VALUE from visits table
          'completionPercentage', COALESCE(pv.completion_percentage, 0)
        )
      )
      FROM patient_visits pv
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
