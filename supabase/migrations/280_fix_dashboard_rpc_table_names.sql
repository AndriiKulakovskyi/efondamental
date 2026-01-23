-- ============================================================================
-- Fix Dashboard RPC Table Names and Add Off-Schedule Support
-- ============================================================================
-- This migration fixes the get_professional_dashboard_data RPC function to:
-- 1. Use correct bipolar_* table names instead of responses_* 
-- 2. Add support for off_schedule visit types
--
-- The responses_* tables were renamed to bipolar_* during refactoring, but
-- migration 187 was not updated. This caused all visit completions to show
-- 0% and patients with off_schedule visits to show "Aucune visite".
-- ============================================================================

CREATE OR REPLACE FUNCTION get_professional_dashboard_data(
  p_professional_id UUID,
  p_center_id UUID,
  p_pathology_type pathology_type
)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
  v_pathology_id UUID;
  v_result JSONB;
  v_start_of_month TIMESTAMPTZ;
  v_end_of_month TIMESTAMPTZ;
BEGIN
  -- Get pathology ID
  SELECT id INTO v_pathology_id
  FROM pathologies
  WHERE type = p_pathology_type;

  -- Calculate current month boundaries
  v_start_of_month := date_trunc('month', NOW());
  v_end_of_month := date_trunc('month', NOW() + INTERVAL '1 month') - INTERVAL '1 second';

  -- Build the complete dashboard data
  WITH 
  -- CTE 1: All active patients for this center and pathology
  filtered_patients AS (
    SELECT *
    FROM v_patients_full
    WHERE center_id = p_center_id
      AND pathology_id = v_pathology_id
      AND active = true
  ),
  
  -- CTE 2: IDs of patients assigned to this professional
  my_patient_ids AS (
    SELECT id
    FROM filtered_patients
    WHERE assigned_to = p_professional_id
  ),
  
  -- CTE 3: Latest visit for each patient with completion data
  latest_visits AS (
    SELECT DISTINCT ON (v.patient_id)
      v.patient_id,
      v.id AS visit_id,
      v.visit_type,
      v.scheduled_date,
      v.status,
      v.conducted_by
    FROM visits v
    WHERE v.patient_id IN (SELECT id FROM filtered_patients)
      AND v.status IN ('scheduled', 'in_progress', 'completed')
    ORDER BY v.patient_id, v.scheduled_date DESC
  ),
  
  -- CTE 4a: Calculate visit completion percentages for screening
  visit_completions_screening AS (
    SELECT 
      lv.patient_id,
      lv.visit_id,
      lv.visit_type,
      lv.scheduled_date,
      lv.conducted_by,
      5 AS total_questionnaires,
      (
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_asrm WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_qids_sr16 WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_mdq WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_diagnostic WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_orientation WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END)
      ) AS completed_questionnaires
    FROM latest_visits lv
    WHERE lv.visit_type = 'screening'
  ),
  
  -- CTE 4b: Calculate visit completion percentages for initial_evaluation
  visit_completions_initial_eval AS (
    SELECT 
      lv.patient_id,
      lv.visit_id,
      lv.visit_type,
      lv.scheduled_date,
      lv.conducted_by,
      38 AS total_questionnaires,
      (
        -- ETAT questionnaires (9)
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_eq5d5l WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_prise_m WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_stai_ya WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_mars WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_mathys WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_asrm WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_qids_sr16 WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_psqi WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_epworth WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        -- TRAITS questionnaires (9)
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_asrs WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_ctq WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_bis10 WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_als18 WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_aim WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_wurs25 WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_aq12 WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_csm WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_cti WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        -- HETERO questionnaires (7)
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_madrs WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_ymrs WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_cgi WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_egf WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_alda WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_etat_patient WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_fast WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        -- SOCIAL questionnaire (1)
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_social WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        -- INFIRMIER questionnaires (6)
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_nurse_tobacco WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_nurse_fagerstrom WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_nurse_physical_params WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_nurse_blood_pressure WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_nurse_sleep_apnea WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_nurse_biological_assessment WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        -- DSM5 / Medical Eval questionnaires (6)
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_dsm5_humeur WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_dsm5_psychotic WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_dsm5_comorbid WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_diva WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_family_history WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_cssrs WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END)
      ) AS completed_questionnaires
    FROM latest_visits lv
    WHERE lv.visit_type = 'initial_evaluation'
  ),
  
  -- CTE 4c: Calculate visit completion percentages for biannual_followup and annual_evaluation
  -- These visits include: 6 Infirmier + 5 Thymic + 4 Medical + 5 Auto ETAT = 20 total
  visit_completions_followup AS (
    SELECT 
      lv.patient_id,
      lv.visit_id,
      lv.visit_type,
      lv.scheduled_date,
      lv.conducted_by,
      20 AS total_questionnaires,
      (
        -- INFIRMIER questionnaires (6)
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_nurse_tobacco WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_nurse_fagerstrom WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_nurse_physical_params WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_nurse_blood_pressure WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_nurse_sleep_apnea WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_nurse_biological_assessment WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        -- Thymic evaluation questionnaires (5)
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_madrs WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_ymrs WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_cgi WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_egf WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_fast WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        -- Medical evaluation questionnaires (4)
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_dsm5_comorbid WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_diva WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_cssrs WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_isa WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        -- Auto-questionnaires ETAT (5)
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_eq5d5l WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_asrm WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_qids_sr16 WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_psqi WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END) +
        (CASE WHEN EXISTS (SELECT 1 FROM bipolar_epworth WHERE visit_id = lv.visit_id) THEN 1 ELSE 0 END)
      ) AS completed_questionnaires
    FROM latest_visits lv
    WHERE lv.visit_type IN ('biannual_followup', 'annual_evaluation')
  ),
  
  -- CTE 4d: NEW - Calculate visit completion for off_schedule visits
  -- These visits can have any combination of questionnaires, so we show basic completion
  visit_completions_off_schedule AS (
    SELECT 
      lv.patient_id,
      lv.visit_id,
      lv.visit_type,
      lv.scheduled_date,
      lv.conducted_by,
      1 AS total_questionnaires,
      1 AS completed_questionnaires -- Always show as completed since off-schedule visits exist
    FROM latest_visits lv
    WHERE lv.visit_type = 'off_schedule'
  ),
  
  -- Union all visit completions (now includes off_schedule visits)
  all_visit_completions AS (
    SELECT * FROM visit_completions_screening
    UNION ALL
    SELECT * FROM visit_completions_initial_eval
    UNION ALL
    SELECT * FROM visit_completions_followup
    UNION ALL
    SELECT * FROM visit_completions_off_schedule
  ),
  
  -- CTE 5: Patients with high/moderate risk from evaluations
  risk_patients AS (
    SELECT DISTINCT e.patient_id
    FROM evaluations e
    WHERE e.patient_id IN (SELECT id FROM filtered_patients)
      AND (
        (e.risk_assessment->>'suicide_risk' IN ('high', 'moderate'))
        OR
        (e.risk_assessment->>'relapse_risk' IN ('high', 'moderate'))
      )
      AND e.evaluation_date >= (NOW() - INTERVAL '6 months')
  ),
  
  -- CTE 6: Patients with overdue visits
  overdue_visit_patients AS (
    SELECT DISTINCT patient_id
    FROM visits
    WHERE patient_id IN (SELECT id FROM filtered_patients)
      AND status = 'scheduled'
      AND scheduled_date < NOW()
  ),
  
  -- CTE 7: Combined followup patients
  followup_patient_ids AS (
    SELECT patient_id AS id FROM risk_patients
    UNION
    SELECT patient_id AS id FROM overdue_visit_patients
  ),
  
  -- CTE 8: Demographics calculation
  demographics_data AS (
    SELECT
      COUNT(*) AS total,
      -- Gender distribution
      COUNT(*) FILTER (WHERE LOWER(gender) IN ('male', 'm', 'homme')) AS male_count,
      COUNT(*) FILTER (WHERE LOWER(gender) IN ('female', 'f', 'femme')) AS female_count,
      COUNT(*) FILTER (WHERE LOWER(gender) NOT IN ('male', 'm', 'homme', 'female', 'f', 'femme') AND gender IS NOT NULL) AS other_count,
      COUNT(*) FILTER (WHERE gender IS NULL) AS unspecified_count,
      -- Age distribution
      COUNT(*) FILTER (WHERE date_part('year', age(date_of_birth)) <= 18) AS age_0_18,
      COUNT(*) FILTER (WHERE date_part('year', age(date_of_birth)) BETWEEN 19 AND 30) AS age_19_30,
      COUNT(*) FILTER (WHERE date_part('year', age(date_of_birth)) BETWEEN 31 AND 50) AS age_31_50,
      COUNT(*) FILTER (WHERE date_part('year', age(date_of_birth)) BETWEEN 51 AND 70) AS age_51_70,
      COUNT(*) FILTER (WHERE date_part('year', age(date_of_birth)) > 70) AS age_70_plus
    FROM filtered_patients
  ),
  
  -- CTE 9: Visits this month count
  visits_this_month_data AS (
    SELECT COUNT(*) AS count
    FROM visits v
    INNER JOIN patients p ON v.patient_id = p.id
    WHERE p.center_id = p_center_id
      AND v.scheduled_date >= v_start_of_month
      AND v.scheduled_date <= v_end_of_month
  )
  
  -- Build final JSON result
  SELECT jsonb_build_object(
    'my_patients', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', fp.id,
          'center_id', fp.center_id,
          'pathology_id', fp.pathology_id,
          'medical_record_number', fp.medical_record_number,
          'first_name', fp.first_name,
          'last_name', fp.last_name,
          'date_of_birth', fp.date_of_birth,
          'gender', fp.gender,
          'email', fp.email,
          'phone', fp.phone,
          'address', fp.address,
          'emergency_contact', fp.emergency_contact,
          'metadata', fp.metadata,
          'active', fp.active,
          'assigned_to', fp.assigned_to,
          'created_by', fp.created_by,
          'created_at', fp.created_at,
          'updated_at', fp.updated_at,
          'user_id', fp.user_id,
          'deleted_at', fp.deleted_at,
          'deleted_by', fp.deleted_by,
          'center_name', fp.center_name,
          'center_code', fp.center_code,
          'pathology_name', fp.pathology_name,
          'pathology_type', fp.pathology_type,
          'pathology_color', fp.pathology_color,
          'created_by_first_name', fp.created_by_first_name,
          'created_by_last_name', fp.created_by_last_name,
          'assigned_to_first_name', fp.assigned_to_first_name,
          'assigned_to_last_name', fp.assigned_to_last_name
        )
      )
      FROM filtered_patients fp
      WHERE fp.id IN (SELECT id FROM my_patient_ids)
    ), '[]'::jsonb),
    
    'center_patients', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', fp.id,
          'center_id', fp.center_id,
          'pathology_id', fp.pathology_id,
          'medical_record_number', fp.medical_record_number,
          'first_name', fp.first_name,
          'last_name', fp.last_name,
          'date_of_birth', fp.date_of_birth,
          'gender', fp.gender,
          'email', fp.email,
          'phone', fp.phone,
          'address', fp.address,
          'emergency_contact', fp.emergency_contact,
          'metadata', fp.metadata,
          'active', fp.active,
          'assigned_to', fp.assigned_to,
          'created_by', fp.created_by,
          'created_at', fp.created_at,
          'updated_at', fp.updated_at,
          'user_id', fp.user_id,
          'deleted_at', fp.deleted_at,
          'deleted_by', fp.deleted_by,
          'center_name', fp.center_name,
          'center_code', fp.center_code,
          'pathology_name', fp.pathology_name,
          'pathology_type', fp.pathology_type,
          'pathology_color', fp.pathology_color,
          'created_by_first_name', fp.created_by_first_name,
          'created_by_last_name', fp.created_by_last_name,
          'assigned_to_first_name', fp.assigned_to_first_name,
          'assigned_to_last_name', fp.assigned_to_last_name
        )
      )
      FROM filtered_patients fp
    ), '[]'::jsonb),
    
    'patients_requiring_followup', COALESCE((
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', fp.id,
          'center_id', fp.center_id,
          'pathology_id', fp.pathology_id,
          'medical_record_number', fp.medical_record_number,
          'first_name', fp.first_name,
          'last_name', fp.last_name,
          'date_of_birth', fp.date_of_birth,
          'gender', fp.gender,
          'email', fp.email,
          'phone', fp.phone,
          'address', fp.address,
          'emergency_contact', fp.emergency_contact,
          'metadata', fp.metadata,
          'active', fp.active,
          'assigned_to', fp.assigned_to,
          'created_by', fp.created_by,
          'created_at', fp.created_at,
          'updated_at', fp.updated_at,
          'user_id', fp.user_id,
          'deleted_at', fp.deleted_at,
          'deleted_by', fp.deleted_by,
          'center_name', fp.center_name,
          'center_code', fp.center_code,
          'pathology_name', fp.pathology_name,
          'pathology_type', fp.pathology_type,
          'pathology_color', fp.pathology_color,
          'created_by_first_name', fp.created_by_first_name,
          'created_by_last_name', fp.created_by_last_name,
          'assigned_to_first_name', fp.assigned_to_first_name,
          'assigned_to_last_name', fp.assigned_to_last_name
        )
      )
      FROM filtered_patients fp
      WHERE fp.id IN (SELECT id FROM followup_patient_ids)
    ), '[]'::jsonb),
    
    'demographics', (
      SELECT jsonb_build_object(
        'total', dd.total,
        'gender', jsonb_build_object(
          'male', dd.male_count,
          'female', dd.female_count,
          'other', dd.other_count,
          'unspecified', dd.unspecified_count
        ),
        'age', jsonb_build_object(
          '0-18', dd.age_0_18,
          '19-30', dd.age_19_30,
          '31-50', dd.age_31_50,
          '51-70', dd.age_51_70,
          '70+', dd.age_70_plus
        )
      )
      FROM demographics_data dd
    ),
    
    'visit_completions', COALESCE((
      SELECT jsonb_object_agg(
        vc.patient_id::text,
        jsonb_build_object(
          'patientId', vc.patient_id,
          'visitId', vc.visit_id,
          'visitType', vc.visit_type,
          'scheduledDate', vc.scheduled_date,
          'completionPercentage', CASE 
            WHEN vc.total_questionnaires > 0 
            THEN ROUND((vc.completed_questionnaires::numeric / vc.total_questionnaires::numeric) * 100)
            ELSE 0
          END,
          'conductedBy', vc.conducted_by
        )
      )
      FROM all_visit_completions vc
    ), '{}'::jsonb),
    
    'visits_this_month', (
      SELECT count FROM visits_this_month_data
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- Add comment for documentation
COMMENT ON FUNCTION get_professional_dashboard_data(UUID, UUID, pathology_type) IS 
'Aggregates all professional dashboard data in a single database call. Returns JSON with patients, demographics, visit completions (all visit types), and statistics. FIXED: Uses bipolar_* table names and includes off_schedule visits.';

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Dashboard RPC function fixed: responses_* tables replaced with bipolar_* tables';
  RAISE NOTICE 'Added support for off_schedule visit types in dashboard';
END $$;
