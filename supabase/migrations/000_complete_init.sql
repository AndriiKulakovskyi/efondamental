


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."invitation_status" AS ENUM (
    'pending',
    'accepted',
    'expired'
);


ALTER TYPE "public"."invitation_status" OWNER TO "postgres";


CREATE TYPE "public"."pathology_type" AS ENUM (
    'bipolar',
    'schizophrenia',
    'asd_asperger',
    'depression'
);


ALTER TYPE "public"."pathology_type" OWNER TO "postgres";


CREATE TYPE "public"."question_type" AS ENUM (
    'text',
    'number',
    'single_choice',
    'multiple_choice',
    'scale',
    'date',
    'boolean'
);


ALTER TYPE "public"."question_type" OWNER TO "postgres";


CREATE TYPE "public"."user_role" AS ENUM (
    'administrator',
    'manager',
    'healthcare_professional',
    'patient'
);


ALTER TYPE "public"."user_role" OWNER TO "postgres";


CREATE TYPE "public"."visit_type" AS ENUM (
    'screening',
    'initial_evaluation',
    'biannual_followup',
    'annual_evaluation',
    'off_schedule'
);


ALTER TYPE "public"."visit_type" OWNER TO "postgres";


CREATE TYPE "public"."yes_no_en" AS ENUM (
    'yes',
    'no'
);


ALTER TYPE "public"."yes_no_en" OWNER TO "postgres";


CREATE TYPE "public"."yes_no_fr" AS ENUM (
    'oui',
    'non'
);


ALTER TYPE "public"."yes_no_fr" OWNER TO "postgres";


CREATE TYPE "public"."yes_no_unknown_en" AS ENUM (
    'yes',
    'no',
    'unknown'
);


ALTER TYPE "public"."yes_no_unknown_en" OWNER TO "postgres";


CREATE TYPE "public"."yes_no_unknown_fr" AS ENUM (
    'oui',
    'non',
    'ne_sais_pas'
);


ALTER TYPE "public"."yes_no_unknown_fr" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_patient_profile_data"("p_patient_id" "uuid", "p_center_id" "uuid", "p_from_date" timestamp with time zone DEFAULT NULL::timestamp with time zone) RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
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


ALTER FUNCTION "public"."get_patient_profile_data"("p_patient_id" "uuid", "p_center_id" "uuid", "p_from_date" timestamp with time zone) OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_patient_profile_data"("p_patient_id" "uuid", "p_center_id" "uuid", "p_from_date" timestamp with time zone) IS 'Aggregates all patient profile data in a single database call. Returns JSON with patient details, visits, evaluations, trends, and statistics. Performance: 50-100+ queries reduced to 1 query.';



CREATE OR REPLACE FUNCTION "public"."get_professional_dashboard_data"("p_professional_id" "uuid", "p_center_id" "uuid", "p_pathology_type" "public"."pathology_type") RETURNS "jsonb"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
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


ALTER FUNCTION "public"."get_professional_dashboard_data"("p_professional_id" "uuid", "p_center_id" "uuid", "p_pathology_type" "public"."pathology_type") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_professional_dashboard_data"("p_professional_id" "uuid", "p_center_id" "uuid", "p_pathology_type" "public"."pathology_type") IS 'Aggregates all professional dashboard data in a single database call. Returns JSON with patients, demographics, visit completions (all visit types), and statistics. FIXED: Uses bipolar_* table names and includes off_schedule visits.';



CREATE OR REPLACE FUNCTION "public"."get_user_center"() RETURNS "uuid"
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
BEGIN
  RETURN (
    SELECT center_id FROM user_profiles
    WHERE id = auth.uid()
  );
END;
$$;


ALTER FUNCTION "public"."get_user_center"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_visit_detail"("p_visit_id" "uuid") RETURNS json
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
DECLARE
    result JSON;
BEGIN
    -- Main query that consolidates all questionnaire responses
    SELECT json_build_object(
        'visit', (SELECT row_to_json(v.*) FROM visits v WHERE v.id = p_visit_id),
        
        -- Auto-questionnaires (Screening)
        'asrm', (SELECT row_to_json(r.*) FROM bipolar_asrm r WHERE r.visit_id = p_visit_id),
        'qids', (SELECT row_to_json(r.*) FROM bipolar_qids_sr16 r WHERE r.visit_id = p_visit_id),
        'mdq', (SELECT row_to_json(r.*) FROM bipolar_mdq r WHERE r.visit_id = p_visit_id),
        
        -- CVLT - Unified for both WAIS-III and WAIS-IV
        'cvlt', (SELECT row_to_json(r.*) FROM bipolar_cvlt r WHERE r.visit_id = p_visit_id),
        'wais3_cvlt', (SELECT row_to_json(r.*) FROM bipolar_cvlt r WHERE r.visit_id = p_visit_id),
        
        -- TMT (shared table for both WAIS versions)
        'tmt', (SELECT row_to_json(r.*) FROM bipolar_tmt r WHERE r.visit_id = p_visit_id),
        
        -- Stroop (shared table for both WAIS versions)
        'stroop', (SELECT row_to_json(r.*) FROM bipolar_stroop r WHERE r.visit_id = p_visit_id),
        
        -- Fluences Verbales (shared table for both WAIS versions)
        'fluences_verbales', (SELECT row_to_json(r.*) FROM bipolar_fluences_verbales r WHERE r.visit_id = p_visit_id),
        
        -- COBRA
        'cobra', (SELECT row_to_json(r.*) FROM bipolar_cobra r WHERE r.visit_id = p_visit_id),
        
        -- CPT3
        'cpt3', (SELECT row_to_json(r.*) FROM bipolar_cpt3 r WHERE r.visit_id = p_visit_id),
        
        -- WAIS-IV
        'wais4_similitudes', (SELECT row_to_json(r.*) FROM bipolar_wais4_similitudes r WHERE r.visit_id = p_visit_id),
        'wais4_matrices', (SELECT row_to_json(r.*) FROM bipolar_wais4_matrices r WHERE r.visit_id = p_visit_id),
        'wais4_code', (SELECT row_to_json(r.*) FROM bipolar_wais4_code r WHERE r.visit_id = p_visit_id),
        'wais4_digit_span', (SELECT row_to_json(r.*) FROM bipolar_wais4_digit_span r WHERE r.visit_id = p_visit_id),
        'wais4_criteria', (SELECT row_to_json(r.*) FROM bipolar_wais4_criteria r WHERE r.visit_id = p_visit_id),
        
        -- Test Commissions
        'test_commissions', (SELECT row_to_json(r.*) FROM bipolar_test_commissions r WHERE r.visit_id = p_visit_id),
        
        -- SCIP
        'scip', (SELECT row_to_json(r.*) FROM bipolar_scip r WHERE r.visit_id = p_visit_id),
        
        -- WAIS-III
        'wais3_criteria', (SELECT row_to_json(r.*) FROM bipolar_wais3_criteria r WHERE r.visit_id = p_visit_id),
        'wais3_learning', (SELECT row_to_json(r.*) FROM bipolar_wais3_learning r WHERE r.visit_id = p_visit_id),
        'wais3_vocabulaire', (SELECT row_to_json(r.*) FROM bipolar_wais3_vocabulaire r WHERE r.visit_id = p_visit_id),
        'wais3_matrices', (SELECT row_to_json(r.*) FROM bipolar_wais3_matrices r WHERE r.visit_id = p_visit_id),
        'wais3_code_symboles', (SELECT row_to_json(r.*) FROM bipolar_wais3_code_symboles r WHERE r.visit_id = p_visit_id),
        'wais3_digit_span', (SELECT row_to_json(r.*) FROM bipolar_wais3_digit_span r WHERE r.visit_id = p_visit_id),
        'wais3_cpt2', (SELECT row_to_json(r.*) FROM bipolar_wais3_cpt2 r WHERE r.visit_id = p_visit_id),
        'wais3_mem3_spatial', (SELECT row_to_json(r.*) FROM bipolar_mem3_spatial r WHERE r.visit_id = p_visit_id)
    ) INTO result;
    
    RETURN result;
END;
$$;


ALTER FUNCTION "public"."get_visit_detail"("p_visit_id" "uuid") OWNER TO "postgres";


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
  -- Get visit type
  SELECT visit_type INTO v_visit_type
  FROM visits
  WHERE id = p_visit_id;

  IF v_visit_type IS NULL THEN
    RETURN jsonb_build_object('error', 'Visit not found');
  END IF;

  -- Get conditional statuses for Fagerstrom and DIVA
  SELECT smoking_status INTO v_tobacco_smoking_status
  FROM bipolar_nurse_tobacco
  WHERE visit_id = p_visit_id;

  SELECT diva_evaluated INTO v_dsm5_diva_evaluated
  FROM bipolar_dsm5_comorbid
  WHERE visit_id = p_visit_id;

  -- Get WAIS criteria acceptance status
  SELECT accepted_for_neuropsy_evaluation INTO v_wais4_accepted
  FROM bipolar_wais4_criteria
  WHERE visit_id = p_visit_id;

  SELECT accepted_for_neuropsy_evaluation INTO v_wais3_accepted
  FROM bipolar_wais3_criteria
  WHERE visit_id = p_visit_id;

  v_fagerstrom_required := v_tobacco_smoking_status = 'current_smoker';
  v_diva_required := v_dsm5_diva_evaluated = 'oui';

  IF v_visit_type = 'screening' THEN
    -- SCREENING: Questionnaires for screening visits
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
        'QIDS_SR16', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id)),
        'MDQ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mdq WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mdq WHERE visit_id = p_visit_id)),
        'EQ5D5L', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_eq5d5l WHERE visit_id = p_visit_id)),
        'MEDICAL_DIAGNOSTIC', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_diagnostic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_diagnostic WHERE visit_id = p_visit_id)),
        'BIPOLAR_ORIENTATION', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_orientation WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_orientation WHERE visit_id = p_visit_id)),
        'SCREENING_DIAGNOSTIC_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_screening_diagnostic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_screening_diagnostic WHERE visit_id = p_visit_id)),
        'SCREENING_ORIENTATION_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_screening_orientation WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_screening_orientation WHERE visit_id = p_visit_id))
      ),
      'completion_status', jsonb_build_object(
        'total_questionnaires', 4,
        'completed_questionnaires', 0,
        'completion_percentage', 0
      )
    ) INTO v_result;

  ELSIF v_visit_type = 'initial_evaluation' THEN
    -- INITIAL EVALUATION: All modules
    v_statuses := jsonb_build_object(
      'TOBACCO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_tobacco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_tobacco WHERE visit_id = p_visit_id)),
      'FAGERSTROM', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_fagerstrom WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_fagerstrom WHERE visit_id = p_visit_id)),
      'PHYSICAL_PARAMS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_physical_params WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_physical_params WHERE visit_id = p_visit_id)),
      'BLOOD_PRESSURE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_blood_pressure WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_blood_pressure WHERE visit_id = p_visit_id)),
      'ECG', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_ecg WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_ecg WHERE visit_id = p_visit_id)),
      'SLEEP_APNEA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_sleep_apnea WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_sleep_apnea WHERE visit_id = p_visit_id)),
      'BIOLOGICAL_ASSESSMENT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_biological_assessment WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_biological_assessment WHERE visit_id = p_visit_id)),
      'MADRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_madrs WHERE visit_id = p_visit_id)),
      'YMRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_ymrs WHERE visit_id = p_visit_id)),
      'CGI', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cgi WHERE visit_id = p_visit_id)),
      'EGF', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_egf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_egf WHERE visit_id = p_visit_id)),
      'ALDA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_alda WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_alda WHERE visit_id = p_visit_id)),
      'ETAT_PATIENT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_etat_patient WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_etat_patient WHERE visit_id = p_visit_id)),
      'FAST', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_fast WHERE visit_id = p_visit_id))
    );

    v_statuses := v_statuses || jsonb_build_object(
      'FAMILY_HISTORY', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_family_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_family_history WHERE visit_id = p_visit_id)),
      'DSM5_HUMEUR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_dsm5_humeur WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_dsm5_humeur WHERE visit_id = p_visit_id)),
      'DSM5_PSYCHOTIC', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_dsm5_psychotic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_dsm5_psychotic WHERE visit_id = p_visit_id)),
      'DSM5_COMORBID', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_dsm5_comorbid WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_dsm5_comorbid WHERE visit_id = p_visit_id)),
      'DIVA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_diva WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_diva WHERE visit_id = p_visit_id)),
      'CSSRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cssrs WHERE visit_id = p_visit_id)),
      'ISA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_isa WHERE visit_id = p_visit_id)),
      'SIS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_sis WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_sis WHERE visit_id = p_visit_id)),
      'SUICIDE_HISTORY', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_suicide_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_suicide_history WHERE visit_id = p_visit_id)),
      'PERINATALITE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_perinatalite WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_perinatalite WHERE visit_id = p_visit_id)),
      'PATHO_NEURO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_neuro WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_neuro WHERE visit_id = p_visit_id)),
      'PATHO_CARDIO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_cardio WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_cardio WHERE visit_id = p_visit_id)),
      'PATHO_ENDOC', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_endoc WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_endoc WHERE visit_id = p_visit_id)),
      'PATHO_DERMATO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_dermato WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_dermato WHERE visit_id = p_visit_id)),
      'PATHO_URINAIRE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_urinaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_urinaire WHERE visit_id = p_visit_id)),
      'ANTECEDENTS_GYNECO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_antecedents_gyneco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_antecedents_gyneco WHERE visit_id = p_visit_id)),
      'PATHO_HEPATO_GASTRO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_hepato_gastro WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_hepato_gastro WHERE visit_id = p_visit_id)),
      'PATHO_ALLERGIQUE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_allergique WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_allergique WHERE visit_id = p_visit_id)),
      'AUTRES_PATHO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_autres_patho WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_autres_patho WHERE visit_id = p_visit_id))
    );

    v_statuses := v_statuses || jsonb_build_object(
      'CVLT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cvlt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cvlt WHERE visit_id = p_visit_id)),
      'TMT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_tmt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_tmt WHERE visit_id = p_visit_id)),
      'STROOP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_stroop WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_stroop WHERE visit_id = p_visit_id)),
      'FLUENCES_VERBALES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_fluences_verbales WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_fluences_verbales WHERE visit_id = p_visit_id)),
      'MEM3_SPATIAL', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mem3_spatial WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mem3_spatial WHERE visit_id = p_visit_id)),
      'WAIS3_CRITERIA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_criteria WHERE visit_id = p_visit_id)),
      'WAIS3_LEARNING', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_learning WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_learning WHERE visit_id = p_visit_id)),
      'WAIS3_VOCABULAIRE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_vocabulaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_vocabulaire WHERE visit_id = p_visit_id)),
      'WAIS3_MATRICES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_matrices WHERE visit_id = p_visit_id)),
      'WAIS3_CODE_SYMBOLES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_code_symboles WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_code_symboles WHERE visit_id = p_visit_id)),
      'WAIS3_DIGIT_SPAN', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_digit_span WHERE visit_id = p_visit_id)),
      'WAIS3_CPT2', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_cpt2 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_cpt2 WHERE visit_id = p_visit_id)),
      'WAIS4_CRITERIA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_criteria WHERE visit_id = p_visit_id)),
      'WAIS4_LEARNING', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_learning WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_learning WHERE visit_id = p_visit_id)),
      'WAIS4_MATRICES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_matrices WHERE visit_id = p_visit_id)),
      'WAIS_IV_CODE_SYMBOLES_IVT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_code WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_code WHERE visit_id = p_visit_id)),
      'WAIS4_DIGIT_SPAN', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_digit_span WHERE visit_id = p_visit_id))
    );

    v_statuses := v_statuses || jsonb_build_object(
      'WAIS4_SIMILITUDES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_similitudes WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_similitudes WHERE visit_id = p_visit_id)),
      'COBRA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cobra WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cobra WHERE visit_id = p_visit_id)),
      'CPT3', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cpt3 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cpt3 WHERE visit_id = p_visit_id)),
      'TEST_COMMISSIONS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_test_commissions WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_test_commissions WHERE visit_id = p_visit_id)),
      'SCIP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_scip WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_scip WHERE visit_id = p_visit_id)),
      'EQ5D5L', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_eq5d5l WHERE visit_id = p_visit_id)),
      'PRISE_M', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_prise_m WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_prise_m WHERE visit_id = p_visit_id)),
      'STAI_YA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_stai_ya WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_stai_ya WHERE visit_id = p_visit_id)),
      'MARS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mars WHERE visit_id = p_visit_id)),
      'MATHYS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mathys WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mathys WHERE visit_id = p_visit_id)),
      'ASRM', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_asrm WHERE visit_id = p_visit_id)),
      'QIDS_SR16', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id)),
      'PSQI', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_psqi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_psqi WHERE visit_id = p_visit_id)),
      'EPWORTH', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_epworth WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_epworth WHERE visit_id = p_visit_id))
    );

    v_statuses := v_statuses || jsonb_build_object(
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
      'PERINATALITE_SZ', jsonb_build_object('completed', EXISTS (SELECT 1 FROM schizophrenia_perinatalite WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM schizophrenia_perinatalite WHERE visit_id = p_visit_id))
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
    -- ANNUAL EVALUATION: Nurse + Thymic + Medical + Neuropsy + Soin Suivi modules
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
      'DSM5_HUMEUR', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_dsm5_humeur WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_dsm5_humeur WHERE visit_id = p_visit_id)),
      'DSM5_PSYCHOTIC', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_dsm5_psychotic WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_dsm5_psychotic WHERE visit_id = p_visit_id)),
      'DSM5_COMORBID', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_dsm5_comorbid WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_dsm5_comorbid WHERE visit_id = p_visit_id)),
      'DIVA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_diva WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_diva WHERE visit_id = p_visit_id)),
      'FAMILY_HISTORY', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_family_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_family_history WHERE visit_id = p_visit_id)),
      'CSSRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cssrs WHERE visit_id = p_visit_id)),
      'ISA_FOLLOWUP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_isa WHERE visit_id = p_visit_id)),
      'SIS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_sis WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_sis WHERE visit_id = p_visit_id)),
      'SUICIDE_HISTORY', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_suicide_history WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_suicide_history WHERE visit_id = p_visit_id)),
      'PERINATALITE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_perinatalite WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_perinatalite WHERE visit_id = p_visit_id)),
      'PATHO_NEURO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_neuro WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_neuro WHERE visit_id = p_visit_id)),
      'PATHO_CARDIO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_cardio WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_cardio WHERE visit_id = p_visit_id)),
      'PATHO_ENDOC', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_endoc WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_endoc WHERE visit_id = p_visit_id)),
      'PATHO_DERMATO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_dermato WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_dermato WHERE visit_id = p_visit_id)),
      'PATHO_URINAIRE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_urinaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_urinaire WHERE visit_id = p_visit_id)),
      'ANTECEDENTS_GYNECO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_antecedents_gyneco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_antecedents_gyneco WHERE visit_id = p_visit_id)),
      'PATHO_HEPATO_GASTRO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_hepato_gastro WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_hepato_gastro WHERE visit_id = p_visit_id)),
      'PATHO_ALLERGIQUE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_patho_allergique WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_patho_allergique WHERE visit_id = p_visit_id)),
      'AUTRES_PATHO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_autres_patho WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_autres_patho WHERE visit_id = p_visit_id))
    );

    -- Add Soin Suivi questionnaires for annual evaluation
    v_statuses := v_statuses || jsonb_build_object(
      'SUIVI_RECOMMANDATIONS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_suivi_recommandations WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_suivi_recommandations WHERE visit_id = p_visit_id)),
      'RECOURS_AUX_SOINS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_recours_aux_soins WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_recours_aux_soins WHERE visit_id = p_visit_id)),
      'TRAITEMENT_NON_PHARMACOLOGIQUE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_traitement_non_pharma WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_traitement_non_pharma WHERE visit_id = p_visit_id)),
      'ARRETS_DE_TRAVAIL', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_arrets_travail WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_arrets_travail WHERE visit_id = p_visit_id)),
      'SOMATIQUE_ET_CONTRACEPTIF', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_somatique_contraceptif WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_somatique_contraceptif WHERE visit_id = p_visit_id)),
      'STATUT_PROFESSIONNEL', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_statut_professionnel WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_statut_professionnel WHERE visit_id = p_visit_id)),
      'SUICIDE_BEHAVIOR_FOLLOWUP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_suicide_behavior WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_suicide_behavior WHERE visit_id = p_visit_id))
    );

    -- Add Neuropsychological questionnaires for annual evaluation
    v_statuses := v_statuses || jsonb_build_object(
      -- Independent tests
      'CVLT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cvlt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cvlt WHERE visit_id = p_visit_id)),
      'TMT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_tmt WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_tmt WHERE visit_id = p_visit_id)),
      'STROOP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_stroop WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_stroop WHERE visit_id = p_visit_id)),
      'FLUENCES_VERBALES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_fluences_verbales WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_fluences_verbales WHERE visit_id = p_visit_id)),
      'MEM3_SPATIAL', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mem3_spatial WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mem3_spatial WHERE visit_id = p_visit_id)),
      -- WAIS-III
      'WAIS3_CRITERIA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_criteria WHERE visit_id = p_visit_id)),
      'WAIS3_LEARNING', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_learning WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_learning WHERE visit_id = p_visit_id)),
      'WAIS3_VOCABULAIRE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_vocabulaire WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_vocabulaire WHERE visit_id = p_visit_id)),
      'WAIS3_MATRICES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_matrices WHERE visit_id = p_visit_id)),
      'WAIS3_CODE_SYMBOLES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_code_symboles WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_code_symboles WHERE visit_id = p_visit_id)),
      'WAIS3_DIGIT_SPAN', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_digit_span WHERE visit_id = p_visit_id)),
      'WAIS3_CPT2', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais3_cpt2 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais3_cpt2 WHERE visit_id = p_visit_id)),
      -- WAIS-IV
      'WAIS4_CRITERIA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_criteria WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_criteria WHERE visit_id = p_visit_id)),
      'WAIS4_LEARNING', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_learning WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_learning WHERE visit_id = p_visit_id)),
      'WAIS4_MATRICES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_matrices WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_matrices WHERE visit_id = p_visit_id)),
      'WAIS_IV_CODE_SYMBOLES_IVT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_code WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_code WHERE visit_id = p_visit_id)),
      'WAIS4_DIGIT_SPAN', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_digit_span WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_digit_span WHERE visit_id = p_visit_id)),
      'WAIS4_SIMILITUDES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_wais4_similitudes WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_wais4_similitudes WHERE visit_id = p_visit_id)),
      'COBRA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cobra WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cobra WHERE visit_id = p_visit_id)),
      'CPT3', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cpt3 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cpt3 WHERE visit_id = p_visit_id)),
      'TEST_COMMISSIONS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_test_commissions WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_test_commissions WHERE visit_id = p_visit_id)),
      'SCIP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_scip WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_scip WHERE visit_id = p_visit_id))
    );

    -- Add Auto ETAT questionnaires for annual evaluation
    v_statuses := v_statuses || jsonb_build_object(
      'EQ5D5L', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_eq5d5l WHERE visit_id = p_visit_id)),
      'PRISE_M', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_prise_m WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_prise_m WHERE visit_id = p_visit_id)),
      'STAI_YA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_stai_ya WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_stai_ya WHERE visit_id = p_visit_id)),
      'MARS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mars WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mars WHERE visit_id = p_visit_id)),
      'MATHYS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_mathys WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_mathys WHERE visit_id = p_visit_id)),
      'ASRM', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_asrm WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_asrm WHERE visit_id = p_visit_id)),
      'QIDS_SR16', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id)),
      'PSQI', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_psqi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_psqi WHERE visit_id = p_visit_id)),
      'EPWORTH', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_epworth WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_epworth WHERE visit_id = p_visit_id))
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

  ELSIF v_visit_type = 'biannual_followup' THEN
    -- BIANNUAL FOLLOWUP: Nurse + Medical (subset) + Thymic modules
    v_statuses := jsonb_build_object(
      'TOBACCO', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_tobacco WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_tobacco WHERE visit_id = p_visit_id)),
      'FAGERSTROM', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_fagerstrom WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_fagerstrom WHERE visit_id = p_visit_id)),
      'PHYSICAL_PARAMS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_physical_params WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_physical_params WHERE visit_id = p_visit_id)),
      'BLOOD_PRESSURE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_blood_pressure WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_blood_pressure WHERE visit_id = p_visit_id)),
      'ECG', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_ecg WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_ecg WHERE visit_id = p_visit_id)),
      'SLEEP_APNEA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_sleep_apnea WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_sleep_apnea WHERE visit_id = p_visit_id)),
      'BIOLOGICAL_ASSESSMENT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_nurse_biological_assessment WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_nurse_biological_assessment WHERE visit_id = p_visit_id)),
      'MADRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_madrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_madrs WHERE visit_id = p_visit_id)),
      'YMRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_ymrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_ymrs WHERE visit_id = p_visit_id)),
      'CGI', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cgi WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cgi WHERE visit_id = p_visit_id)),
      'EGF', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_egf WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_egf WHERE visit_id = p_visit_id)),
      'ALDA', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_alda WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_alda WHERE visit_id = p_visit_id)),
      'ETAT_PATIENT', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_etat_patient WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_etat_patient WHERE visit_id = p_visit_id)),
      'FAST', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_fast WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_fast WHERE visit_id = p_visit_id)),
      'HUMEUR_ACTUELS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_humeur_actuels WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_humeur_actuels WHERE visit_id = p_visit_id)),
      'HUMEUR_DEPUIS_VISITE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_humeur_depuis_visite WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_humeur_depuis_visite WHERE visit_id = p_visit_id)),
      'PSYCHOTIQUES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_psychotiques WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_psychotiques WHERE visit_id = p_visit_id)),
      'DIAG_PSY_SEM_HUMEUR_ACTUELS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_humeur_actuels WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_humeur_actuels WHERE visit_id = p_visit_id)),
      'DIAG_PSY_SEM_HUMEUR_DEPUIS_VISITE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_humeur_depuis_visite WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_humeur_depuis_visite WHERE visit_id = p_visit_id)),
      'DIAG_PSY_SEM_PSYCHOTIQUES', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_psychotiques WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_psychotiques WHERE visit_id = p_visit_id)),
      'ISA_FOLLOWUP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_isa WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_isa WHERE visit_id = p_visit_id)),
      'SUICIDE_BEHAVIOR_FOLLOWUP', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_suicide_behavior WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_suicide_behavior WHERE visit_id = p_visit_id)),
      'CSSRS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_cssrs WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_cssrs WHERE visit_id = p_visit_id)),
      'SUIVI_RECOMMANDATIONS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_suivi_recommandations WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_suivi_recommandations WHERE visit_id = p_visit_id)),
      'RECOURS_AUX_SOINS', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_recours_aux_soins WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_recours_aux_soins WHERE visit_id = p_visit_id)),
      'TRAITEMENT_NON_PHARMACOLOGIQUE', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_traitement_non_pharma WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_traitement_non_pharma WHERE visit_id = p_visit_id)),
      'ARRETS_DE_TRAVAIL', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_arrets_travail WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_arrets_travail WHERE visit_id = p_visit_id)),
      'SOMATIQUE_ET_CONTRACEPTIF', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_somatique_contraceptif WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_somatique_contraceptif WHERE visit_id = p_visit_id)),
      'SOMATIQUE_CONTRACEPTIF', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_somatique_contraceptif WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_somatique_contraceptif WHERE visit_id = p_visit_id)),
      'STATUT_PROFESSIONNEL', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_followup_statut_professionnel WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_followup_statut_professionnel WHERE visit_id = p_visit_id))
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
      'completion_status', jsonb_build_object(
        'total_questionnaires', 0,
        'completed_questionnaires', 0,
        'completion_percentage', 0
      )
    ) INTO v_result;

  ELSIF v_visit_type = 'followup' THEN
    -- FOLLOWUP: Limited subset
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
        'QIDS_SR16', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_qids_sr16 WHERE visit_id = p_visit_id)),
        'EQ5D5L', jsonb_build_object('completed', EXISTS (SELECT 1 FROM bipolar_eq5d5l WHERE visit_id = p_visit_id), 'completed_at', (SELECT completed_at FROM bipolar_eq5d5l WHERE visit_id = p_visit_id))
      ),
      'completion_status', jsonb_build_object(
        'total_questionnaires', 3,
        'completed_questionnaires', 0,
        'completion_percentage', 0
      )
    ) INTO v_result;

  ELSE
    -- Unknown visit type
    RETURN jsonb_build_object('error', 'Unknown visit type: ' || v_visit_type);
  END IF;

  RETURN v_result;
END;
$$;


ALTER FUNCTION "public"."get_visit_detail_data"("p_visit_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_visit_detail_data"("p_visit_id" "uuid") IS 'Returns complete visit details including questionnaire completion status. Updated to include INF_BILAN_BIOLOGIQUE_SZ questionnaire for schizophrenia initial evaluation.';



CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public', 'auth'
    AS $$
DECLARE
  default_role public.user_role := 'healthcare_professional';
  meta_role text;
BEGIN
  -- Extract role from metadata if exists
  meta_role := NEW.raw_user_meta_data->>'role';
  
  -- Defensive check for the role enum cast
  IF meta_role IS NOT NULL AND meta_role <> '' THEN
    BEGIN
      -- Use explicit cast with schema to avoid path issues
      default_role := meta_role::public.user_role;
    EXCEPTION WHEN OTHERS THEN
      -- Fallback to default if cast fails
      RAISE WARNING 'Failed to cast role % to user_role, using default', meta_role;
      default_role := 'healthcare_professional';
    END;
  END IF;

  INSERT INTO public.user_profiles (
    id,
    email,
    role,
    first_name,
    last_name,
    active,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    NEW.email,
    default_role,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    true,
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'administrator'
  );
END;
$$;


ALTER FUNCTION "public"."is_admin"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_manager"() RETURNS boolean
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'manager'
  );
END;
$$;


ALTER FUNCTION "public"."is_manager"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."audit_logs" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "action" character varying(100) NOT NULL,
    "entity_type" character varying(100),
    "entity_id" "uuid",
    "center_id" "uuid",
    "ip_address" "inet",
    "user_agent" "text",
    "changes" "jsonb",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."audit_logs" OWNER TO "postgres";


COMMENT ON TABLE "public"."audit_logs" IS 'Complete audit trail for compliance and security';



CREATE TABLE IF NOT EXISTS "public"."bipolar_aim" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "q13" integer,
    "q14" integer,
    "q15" integer,
    "q16" integer,
    "q17" integer,
    "q18" integer,
    "q19" integer,
    "q20" integer,
    "q21" integer,
    "total_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "negative_intensity_mean" numeric,
    "positive_affectivity_mean" numeric,
    "reactivity_mean" numeric,
    "total_mean" numeric
);


ALTER TABLE "public"."bipolar_aim" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_alda" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q0" integer,
    "qa" integer,
    "qb1" integer,
    "qb2" integer,
    "qb3" integer,
    "qb4" integer,
    "qb5" integer,
    "score_a" integer,
    "score_b" integer,
    "total_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "alda_score" integer,
    "b_total_score" integer,
    CONSTRAINT "bipolar_alda_q0_check" CHECK ((("q0" >= 0) AND ("q0" <= 1))),
    CONSTRAINT "bipolar_alda_qa_check" CHECK ((("qa" >= 0) AND ("qa" <= 10))),
    CONSTRAINT "bipolar_alda_qb1_check" CHECK ((("qb1" >= 0) AND ("qb1" <= 2))),
    CONSTRAINT "bipolar_alda_qb2_check" CHECK ((("qb2" >= 0) AND ("qb2" <= 2))),
    CONSTRAINT "bipolar_alda_qb3_check" CHECK ((("qb3" >= 0) AND ("qb3" <= 2))),
    CONSTRAINT "bipolar_alda_qb4_check" CHECK ((("qb4" >= 0) AND ("qb4" <= 2))),
    CONSTRAINT "bipolar_alda_qb5_check" CHECK ((("qb5" >= 0) AND ("qb5" <= 2)))
);


ALTER TABLE "public"."bipolar_alda" OWNER TO "postgres";


COMMENT ON COLUMN "public"."bipolar_alda"."score_a" IS 'Score A: Clinical response to lithium (0-10). Synthetic clinical judgment of lithium efficacy.';



COMMENT ON COLUMN "public"."bipolar_alda"."score_b" IS 'Score B: Confounding factors (0-10). Sum of 5 items (B1-B5) that reduce attribution certainty.';



CREATE TABLE IF NOT EXISTS "public"."bipolar_als18" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "q13" integer,
    "q14" integer,
    "q15" integer,
    "q16" integer,
    "q17" integer,
    "q18" integer,
    "affective_instability_score" integer,
    "behavioral_dysregulation_score" integer,
    "total_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "anger_mean" numeric,
    "anxiety_depression_mean" numeric,
    "depression_elation_mean" numeric,
    "total_mean" numeric
);


ALTER TABLE "public"."bipolar_als18" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_antecedents_gyneco" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_pregnancy_count" integer,
    "q2_live_birth_count" integer,
    "q3_miscarriage_count" integer,
    "q4_ivg_count" integer,
    "q5_itg_count" integer,
    "q6_menopause" character varying(10),
    "q6_1_menopause_date" "date",
    "q6_2_hormonal_treatment" character varying(10),
    "q6_3_hormonal_treatment_start_date" "date",
    "q7_gyneco_pathology" character varying(10),
    "q7_1_gyneco_pathology_specify" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_antecedents_gyneco" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_aq12" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "total_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "physical_aggression_score" integer,
    "verbal_aggression_score" integer,
    "anger_score" integer,
    "hostility_score" integer
);


ALTER TABLE "public"."bipolar_aq12" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_asrm" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "total_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "bipolar_asrm_q1_check" CHECK ((("q1" >= 0) AND ("q1" <= 4))),
    CONSTRAINT "bipolar_asrm_q2_check" CHECK ((("q2" >= 0) AND ("q2" <= 4))),
    CONSTRAINT "bipolar_asrm_q3_check" CHECK ((("q3" >= 0) AND ("q3" <= 4))),
    CONSTRAINT "bipolar_asrm_q4_check" CHECK ((("q4" >= 0) AND ("q4" <= 4))),
    CONSTRAINT "bipolar_asrm_q5_check" CHECK ((("q5" >= 0) AND ("q5" <= 4)))
);


ALTER TABLE "public"."bipolar_asrm" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_asrs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "a1" integer,
    "a2" integer,
    "a3" integer,
    "a4" integer,
    "a5" integer,
    "a6" integer,
    "b7" integer,
    "b8" integer,
    "b9" integer,
    "b10" integer,
    "b11" integer,
    "b12" integer,
    "b13" integer,
    "b14" integer,
    "b15" integer,
    "b16" integer,
    "b17" integer,
    "b18" integer,
    "part_a_score" integer,
    "part_b_score" integer,
    "total_score" integer,
    "screening_positive" boolean,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "part_a_positive_items" integer
);


ALTER TABLE "public"."bipolar_asrs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_autres_patho" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q0_global_response" "text",
    "q1_1_neoplasique_presence" "text",
    "q1_2_neoplasique_date" "date",
    "q1_3_cancer_types" "text"[],
    "q1_4_cancer_specify" "text",
    "q2_1_vih_presence" "text",
    "q2_2_vih_date" "date",
    "q2_3_vih_treated" "text",
    "q2_4_vih_balanced" "text",
    "q3_1_hepatite_presence" "text",
    "q3_2_hepatite_date" "date",
    "q3_3_hepatite_type" "text",
    "q3_4_hepatite_treated" "text",
    "q3_5_hepatite_balanced" "text",
    "q4_1_chirurgicaux_presence" "text",
    "q4_2_chirurgicaux_specify" "text",
    "q5_1_genetique_presence" "text",
    "q5_2_genetique_specify" "text",
    "q6_0_ophtalmo_presence" "text",
    "q6_1_1_glaucome_fermeture_presence" "text",
    "q6_1_2_glaucome_fermeture_date" "date",
    "q6_1_3_glaucome_fermeture_treatment_triggered" "text",
    "q6_1_4_glaucome_fermeture_treatment_type" "text",
    "q6_2_1_glaucome_ouvert_presence" "text",
    "q6_2_2_glaucome_ouvert_date" "date",
    "q6_2_3_glaucome_ouvert_treated" "text",
    "q6_2_4_glaucome_ouvert_balanced" "text",
    "q6_3_1_cataracte_presence" "text",
    "q6_3_2_cataracte_date" "date",
    "q6_3_3_cataracte_treated" "text",
    "q6_3_4_cataracte_balanced" "text",
    "q7_1_autre_presence" "text",
    "q7_2_autre_specify" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_autres_patho" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_bis10" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "q13" integer,
    "q14" integer,
    "q15" integer,
    "q16" integer,
    "q17" integer,
    "q18" integer,
    "q19" integer,
    "q20" integer,
    "q21" integer,
    "q22" integer,
    "q23" integer,
    "q24" integer,
    "q25" integer,
    "q26" integer,
    "q27" integer,
    "q28" integer,
    "q29" integer,
    "q30" integer,
    "motor_score" integer,
    "cognitive_score" integer,
    "non_planning_score" integer,
    "total_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "behavioral_impulsivity_mean" numeric,
    "cognitive_impulsivity_mean" numeric,
    "overall_impulsivity" "text"
);


ALTER TABLE "public"."bipolar_bis10" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_cgi" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "cgi_s" integer,
    "cgi_i" integer,
    "therapeutic_effect" integer,
    "side_effects" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "therapeutic_index" integer,
    "therapeutic_index_label" "text",
    "visit_type" "text",
    CONSTRAINT "bipolar_cgi_cgi_i_check" CHECK ((("cgi_i" >= 0) AND ("cgi_i" <= 7))),
    CONSTRAINT "bipolar_cgi_cgi_s_check" CHECK ((("cgi_s" >= 0) AND ("cgi_s" <= 7))),
    CONSTRAINT "bipolar_cgi_side_effects_check" CHECK ((("side_effects" >= 0) AND ("side_effects" <= 3))),
    CONSTRAINT "bipolar_cgi_therapeutic_effect_check" CHECK ((("therapeutic_effect" >= 0) AND ("therapeutic_effect" <= 4)))
);


ALTER TABLE "public"."bipolar_cgi" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_cobra" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "q13" integer,
    "q14" integer,
    "q15" integer,
    "q16" integer,
    "total_score" integer,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_cobra" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_cpt3" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "d_prime" numeric(6,2),
    "d_prime_interp" "text",
    "omissions" numeric(6,2),
    "omissions_interp" "text",
    "commissions" numeric(6,2),
    "commissions_interp" "text",
    "perseverations" numeric(6,2),
    "perseverations_interp" "text",
    "hrt" numeric(8,2),
    "hrt_interp" "text",
    "hrt_sd" numeric(8,2),
    "hrt_sd_interp" "text",
    "variability" numeric(8,2),
    "variability_interp" "text",
    "hrt_block_change" numeric(8,2),
    "hrt_block_change_interp" "text",
    "hrt_isi_change" numeric(8,2),
    "hrt_isi_change_interp" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_cpt3" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_csm" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "q13" integer,
    "total_score" integer,
    "chronotype" "text",
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_csm" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_cssrs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_wish_dead" boolean,
    "q2_non_specific" boolean,
    "q3_method_no_intent" boolean,
    "q4_intent_no_plan" boolean,
    "q5_plan_intent" boolean,
    "int_most_severe" integer,
    "int_frequency" integer,
    "int_duration" integer,
    "int_control" integer,
    "int_deterrents" integer,
    "int_causes" integer,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_cssrs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_cti" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "q13" integer,
    "q14" integer,
    "q15" integer,
    "q16" integer,
    "q17" integer,
    "q18" integer,
    "q19" integer,
    "q20" integer,
    "q21" integer,
    "q22" integer,
    "q23" integer,
    "q24" integer,
    "q25" integer,
    "q26" integer,
    "q27" integer,
    "q28" integer,
    "q29" integer,
    "q30" integer,
    "total_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "circadian_type" "text",
    "flexibility_score" integer,
    "languid_score" integer
);


ALTER TABLE "public"."bipolar_cti" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_ctq" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "q13" integer,
    "q14" integer,
    "q15" integer,
    "q16" integer,
    "q17" integer,
    "q18" integer,
    "q19" integer,
    "q20" integer,
    "q21" integer,
    "q22" integer,
    "q23" integer,
    "q24" integer,
    "q25" integer,
    "q26" integer,
    "q27" integer,
    "q28" integer,
    "emotional_abuse_score" integer,
    "physical_abuse_score" integer,
    "sexual_abuse_score" integer,
    "emotional_neglect_score" integer,
    "physical_neglect_score" integer,
    "minimization_score" integer,
    "total_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "denial_score" integer,
    "emotional_abuse_severity" "text",
    "emotional_neglect_severity" "text",
    "physical_abuse_severity" "text",
    "physical_neglect_severity" "text",
    "sexual_abuse_severity" "text"
);


ALTER TABLE "public"."bipolar_ctq" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_cvlt" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "patient_age" integer,
    "years_of_education" integer,
    "patient_sex" "text",
    "trial_1" integer,
    "trial_2" integer,
    "trial_3" integer,
    "trial_4" integer,
    "trial_5" integer,
    "total_1_5" integer,
    "list_b" integer,
    "sdfr" integer,
    "sdcr" integer,
    "ldfr" integer,
    "ldcr" integer,
    "semantic_clustering" numeric(5,2),
    "serial_clustering" numeric(5,2),
    "perseverations" integer,
    "intrusions" integer,
    "recognition_hits" integer,
    "false_positives" integer,
    "discriminability" numeric(5,2),
    "primacy" numeric(5,2),
    "recency" numeric(5,2),
    "response_bias" numeric(5,3),
    "cvlt_delai" "text",
    "trial_1_std" numeric(6,2),
    "trial_5_std" "text",
    "total_1_5_std" numeric(6,2),
    "list_b_std" numeric(6,2),
    "sdfr_std" "text",
    "sdcr_std" "text",
    "ldfr_std" "text",
    "ldcr_std" "text",
    "semantic_std" "text",
    "serial_std" "text",
    "persev_std" "text",
    "intru_std" "text",
    "recog_std" "text",
    "false_recog_std" "text",
    "discrim_std" "text",
    "primacy_std" numeric(6,2),
    "recency_std" numeric(6,2),
    "bias_std" numeric(6,2),
    "questionnaire_version" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "patient_gender" "text"
);


ALTER TABLE "public"."bipolar_cvlt" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_diagnostic" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "date_recueil" "date" DEFAULT CURRENT_DATE,
    "diag_prealable" character varying(20),
    "diag_evoque" character varying(20),
    "bilan_programme" character varying(10),
    "bilan_programme_precision" character varying(50),
    "diag_recuse_precision" character varying(50),
    "diag_recuse_autre_text" "text",
    "lettre_information" character varying(10),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_diagnostic" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_diva" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "evaluated" character varying(20),
    "a1a_adult" boolean,
    "a1a_childhood" boolean,
    "a1b_adult" boolean,
    "a1b_childhood" boolean,
    "a1c_adult" boolean,
    "a1c_childhood" boolean,
    "a1d_adult" boolean,
    "a1d_childhood" boolean,
    "a1e_adult" boolean,
    "a1e_childhood" boolean,
    "a1f_adult" boolean,
    "a1f_childhood" boolean,
    "a1g_adult" boolean,
    "a1g_childhood" boolean,
    "a1h_adult" boolean,
    "a1h_childhood" boolean,
    "a1i_adult" boolean,
    "a1i_childhood" boolean,
    "total_inattention_adult" integer,
    "total_inattention_childhood" integer,
    "a2a_adult" boolean,
    "a2a_childhood" boolean,
    "a2b_adult" boolean,
    "a2b_childhood" boolean,
    "a2c_adult" boolean,
    "a2c_childhood" boolean,
    "a2d_adult" boolean,
    "a2d_childhood" boolean,
    "a2e_adult" boolean,
    "a2e_childhood" boolean,
    "a2f_adult" boolean,
    "a2f_childhood" boolean,
    "a2g_adult" boolean,
    "a2g_childhood" boolean,
    "a2h_adult" boolean,
    "a2h_childhood" boolean,
    "a2i_adult" boolean,
    "a2i_childhood" boolean,
    "total_hyperactivity_adult" integer,
    "total_hyperactivity_childhood" integer,
    "criteria_a_inattention_child_gte6" boolean,
    "criteria_hi_hyperactivity_child_gte6" boolean,
    "criteria_a_inattention_adult_gte6" boolean,
    "criteria_hi_hyperactivity_adult_gte6" boolean,
    "criteria_b_lifetime_persistence" boolean,
    "criteria_cd_impairment_childhood" boolean,
    "criteria_cd_impairment_adult" boolean,
    "criteria_e_better_explained" boolean,
    "criteria_e_explanation" "text",
    "collateral_parents" integer,
    "collateral_partner" integer,
    "collateral_school_reports" integer,
    "final_diagnosis" character varying(50),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_diva" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_dsm5_comorbid" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "has_anxiety_disorder" character varying(20),
    "panic_no_agoraphobia_present" character varying(20),
    "panic_no_agoraphobia_age_debut" integer,
    "panic_no_agoraphobia_symptoms_past_month" character varying(20),
    "panic_with_agoraphobia_present" character varying(20),
    "panic_with_agoraphobia_age_debut" integer,
    "panic_with_agoraphobia_symptoms_past_month" character varying(20),
    "agoraphobia_no_panic_present" character varying(20),
    "agoraphobia_no_panic_age_debut" integer,
    "agoraphobia_no_panic_symptoms_past_month" character varying(20),
    "social_phobia_present" character varying(20),
    "social_phobia_age_debut" integer,
    "social_phobia_symptoms_past_month" character varying(20),
    "specific_phobia_present" character varying(20),
    "specific_phobia_age_debut" integer,
    "specific_phobia_symptoms_past_month" character varying(20),
    "ocd_present" character varying(20),
    "ocd_age_debut" integer,
    "ocd_symptoms_past_month" character varying(20),
    "ptsd_present" character varying(20),
    "ptsd_age_debut" integer,
    "ptsd_symptoms_past_month" character varying(20),
    "gad_present" character varying(20),
    "gad_age_debut" integer,
    "gad_symptoms_past_month" character varying(20),
    "anxiety_medical_condition_present" character varying(20),
    "anxiety_medical_condition_affection" "text",
    "anxiety_medical_condition_age_debut" integer,
    "anxiety_medical_condition_symptoms_past_month" character varying(20),
    "anxiety_substance_induced_present" character varying(20),
    "anxiety_substance_induced_substance" "text",
    "anxiety_substance_induced_age_debut" integer,
    "anxiety_substance_induced_symptoms_past_month" character varying(20),
    "anxiety_unspecified_present" character varying(20),
    "anxiety_unspecified_age_debut" integer,
    "anxiety_unspecified_symptoms_past_month" character varying(20),
    "has_substance_disorder" character varying(20),
    "alcohol_present" character varying(20),
    "alcohol_type" character varying(20),
    "alcohol_age_debut" integer,
    "alcohol_symptoms_past_month" character varying(20),
    "alcohol_duration_months" integer,
    "sedatives_present" character varying(20),
    "sedatives_type" character varying(20),
    "sedatives_age_debut" integer,
    "sedatives_symptoms_past_month" character varying(20),
    "sedatives_duration_months" integer,
    "cannabis_present" character varying(20),
    "cannabis_type" character varying(20),
    "cannabis_age_debut" integer,
    "cannabis_symptoms_past_month" character varying(20),
    "cannabis_duration_months" integer,
    "stimulants_present" character varying(20),
    "stimulants_type" character varying(20),
    "stimulants_age_debut" integer,
    "stimulants_symptoms_past_month" character varying(20),
    "stimulants_duration_months" integer,
    "opiates_present" character varying(20),
    "opiates_type" character varying(20),
    "opiates_age_debut" integer,
    "opiates_symptoms_past_month" character varying(20),
    "opiates_duration_months" integer,
    "cocaine_present" character varying(20),
    "cocaine_type" character varying(20),
    "cocaine_age_debut" integer,
    "cocaine_symptoms_past_month" character varying(20),
    "cocaine_duration_months" integer,
    "hallucinogens_present" character varying(20),
    "hallucinogens_type" character varying(20),
    "hallucinogens_age_debut" integer,
    "hallucinogens_symptoms_past_month" character varying(20),
    "hallucinogens_duration_months" integer,
    "other_substance_present" character varying(20),
    "other_substance_name" "text",
    "other_substance_type" character varying(20),
    "other_substance_age_debut" integer,
    "other_substance_symptoms_past_month" character varying(20),
    "other_substance_duration_months" integer,
    "induced_disorder_present" character varying(20),
    "induced_substances" "text"[],
    "induced_disorder_type" character varying(50),
    "induced_symptoms_past_month" character varying(20),
    "has_eating_disorder" character varying(20),
    "anorexia_restrictive_amenorrhea" "public"."yes_no_fr",
    "anorexia_restrictive_age_debut" integer,
    "anorexia_restrictive_age_fin" integer,
    "anorexia_restrictive_symptoms_past_month" character varying(20),
    "anorexia_restrictive_current" "public"."yes_no_fr",
    "anorexia_bulimic_amenorrhea" "public"."yes_no_fr",
    "anorexia_bulimic_age_debut" integer,
    "anorexia_bulimic_age_fin" integer,
    "anorexia_bulimic_symptoms_past_month" character varying(20),
    "anorexia_bulimic_current" "public"."yes_no_fr",
    "bulimia_age_debut" integer,
    "bulimia_age_fin" integer,
    "bulimia_symptoms_past_month" character varying(20),
    "bulimia_current" "public"."yes_no_fr",
    "binge_eating_age_debut" integer,
    "binge_eating_age_fin" integer,
    "binge_eating_symptoms_past_month" character varying(20),
    "binge_eating_current" "public"."yes_no_fr",
    "eating_unspecified_age_debut" integer,
    "eating_unspecified_age_fin" integer,
    "eating_unspecified_symptoms_past_month" character varying(20),
    "eating_unspecified_current" "public"."yes_no_unknown_fr",
    "night_eating_age_debut" integer,
    "night_eating_age_fin" integer,
    "night_eating_symptoms_past_month" character varying(20),
    "night_eating_current" "public"."yes_no_unknown_fr",
    "has_somatoform_disorder" character varying(20),
    "somatoform_type" character varying(50),
    "somatoform_age_debut" integer,
    "somatoform_symptoms_past_month" character varying(20),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "agoraphobie_sans_panique_age_debut" "text",
    "agoraphobie_sans_panique_symptoms_past_month" "text",
    "anxiete_generalisee_age_debut" "text",
    "anxiete_generalisee_symptoms_past_month" "text",
    "anxiety_disorders_selection" "jsonb",
    "anxieux_medical_affection" "text",
    "anxieux_medical_age_debut" "text",
    "anxieux_medical_symptoms_past_month" "text",
    "anxieux_non_specifie_age_debut" "text",
    "anxieux_non_specifie_symptoms_past_month" "text",
    "anxieux_substance_age_debut" "text",
    "anxieux_substance_specify" "text",
    "anxieux_substance_symptoms_past_month" "text",
    "diva_evaluated" "public"."yes_no_unknown_fr",
    "eating_disorder_type" "text",
    "panic_disorder_age_debut" "text",
    "panic_disorder_present" "public"."yes_no_unknown_fr",
    "panic_disorder_symptoms_past_month" "text",
    "panic_disorder_type" "text",
    "panic_type" "text",
    "phobie_sociale_age_debut" "text",
    "phobie_sociale_symptoms_past_month" "text",
    "phobie_specifique_age_debut" "text",
    "phobie_specifique_symptoms_past_month" "text",
    "toc_age_debut" "text",
    "toc_symptoms_past_month" "text"
);


ALTER TABLE "public"."bipolar_dsm5_comorbid" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_dsm5_humeur" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "has_mood_disorder" character varying(20),
    "disorder_type" character varying(50),
    "disorder_type_autre" "text",
    "major_depression_type" character varying(20),
    "dysthymic_type" character varying(20),
    "medical_condition_affection_type" character varying(50),
    "medical_condition_affection_autre" "text",
    "medical_condition_trouble_type" character varying(50),
    "substance_types" "jsonb",
    "substance_type" character varying(50),
    "substance_autre" "text",
    "substance_trouble_type" character varying(50),
    "unspecified_depression_type" character varying(50),
    "unspecified_depression_post_schizophrenie" boolean,
    "unspecified_depression_majeur_surajout" boolean,
    "unspecified_depression_dysphorique_premenstruel" boolean,
    "unspecified_depression_mineur" boolean,
    "unspecified_depression_bref_recurrent" boolean,
    "unspecified_depression_autre" boolean,
    "unspecified_depression_ne_sais_pas" boolean,
    "cyclothymic" boolean,
    "other_specify" "text",
    "first_episode_type" character varying(50),
    "postpartum_first" character varying(20),
    "initial_cyclothymic_period" character varying(20),
    "num_edm" integer,
    "age_first_edm" integer,
    "edm_with_psychotic" character varying(20),
    "num_edm_psychotic" integer,
    "edm_with_mixed" character varying(20),
    "num_edm_mixed" integer,
    "num_hypomanic" integer,
    "age_first_hypomanic" integer,
    "age_first_hypomanic_text" "text",
    "num_manic" integer,
    "age_first_manic" integer,
    "age_first_manic_text" "text",
    "manic_with_psychotic" character varying(20),
    "num_manic_psychotic" integer,
    "manic_with_mixed" character varying(20),
    "num_manic_mixed" integer,
    "induced_episodes" character varying(20),
    "num_induced_episodes" integer,
    "rapid_cycling" character varying(20),
    "complete_remission" character varying(20),
    "seasonal_pattern" character varying(20),
    "seasonal_types" "jsonb",
    "seasonal_depression" character varying(20),
    "seasonal_depression_season" character varying(20),
    "seasonal_hypomania" character varying(20),
    "seasonal_hypomania_season" character varying(20),
    "seasonal_seasons" "text",
    "age_first_psychotrope" integer,
    "age_first_thymoregulator" integer,
    "age_first_hospitalization" integer,
    "num_hospitalizations" integer,
    "number_of_hospitalizations" integer,
    "total_hospitalization_months" integer,
    "total_hospitalization_duration_months" integer,
    "total_hospitalization_duration_text" "text",
    "past_year_episode" character varying(20),
    "past_year_num_edm" integer,
    "past_year_edm_psychotic" character varying(20),
    "past_year_num_edm_psychotic" integer,
    "past_year_edm_mixed" character varying(20),
    "past_year_num_edm_mixed" integer,
    "past_year_num_hypomanic" integer,
    "past_year_num_manic" integer,
    "past_year_manic_psychotic" character varying(20),
    "past_year_num_manic_psychotic" integer,
    "past_year_manic_mixed" character varying(20),
    "past_year_num_manic_mixed" integer,
    "past_year_num_hospitalizations" integer,
    "past_year_hospitalization_weeks" integer,
    "past_year_hospitalization_weeks_text" "text",
    "past_year_work_leave" character varying(20),
    "past_year_num_work_leaves" integer,
    "past_year_work_leave_weeks" integer,
    "past_year_work_leave_weeks_text" "text",
    "recent_episode_start_date" "text",
    "recent_episode_start_date_text" "text",
    "recent_episode_end_date" "text",
    "recent_episode_end_date_text" "text",
    "recent_episode_type" character varying(50),
    "recent_edm_subtypes" "jsonb",
    "recent_edm_subtype" character varying(50),
    "recent_edm_severity" character varying(50),
    "recent_edm_chronic" character varying(20),
    "recent_edm_postpartum" character varying(20),
    "recent_hypomanie_postpartum" character varying(20),
    "recent_manie_catatonic" character varying(20),
    "recent_manie_mixed" character varying(20),
    "recent_manie_severity" character varying(50),
    "recent_manie_postpartum" character varying(20),
    "recent_non_specifie_catatonic" character varying(20),
    "recent_non_specifie_severity" character varying(50),
    "recent_non_specifie_postpartum" character varying(20),
    "recent_episode_catatonic" character varying(20),
    "recent_episode_severity" character varying(50),
    "recent_episode_postpartum" character varying(20),
    "current_episode_present" character varying(20),
    "current_episode_type" character varying(50),
    "current_edm_subtypes" "jsonb",
    "current_edm_subtype" character varying(50),
    "current_edm_severity" character varying(50),
    "current_edm_chronic" character varying(20),
    "current_edm_postpartum" character varying(20),
    "current_hypomanie_postpartum" character varying(20),
    "current_manie_catatonic" character varying(20),
    "current_manie_mixed" character varying(20),
    "current_manie_mixed_text" "text",
    "current_manie_severity" character varying(50),
    "current_manie_postpartum" character varying(20),
    "current_non_specifie_catatonic" character varying(20),
    "current_non_specifie_severity" character varying(50),
    "current_non_specifie_postpartum" character varying(20),
    "current_episode_catatonic" character varying(20),
    "current_episode_severity" character varying(50),
    "current_episode_postpartum" character varying(20),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_dsm5_humeur" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_dsm5_psychotic" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "has_psychotic_disorder" character varying(20),
    "psychotic_disorder_date" "date",
    "disorder_type" character varying(100),
    "symptoms_past_month" character varying(20),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_dsm5_psychotic" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_egf" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "egf_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "bipolar_egf_egf_score_check" CHECK ((("egf_score" >= 1) AND ("egf_score" <= 100)))
);


ALTER TABLE "public"."bipolar_egf" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_epworth" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "total_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "clinical_context" "text",
    "severity" "text"
);


ALTER TABLE "public"."bipolar_epworth" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_eq5d5l" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "mobility" integer,
    "self_care" integer,
    "usual_activities" integer,
    "pain_discomfort" integer,
    "anxiety_depression" integer,
    "vas_score" integer,
    "health_state" "text",
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "index_value" numeric,
    "profile_string" "text",
    CONSTRAINT "bipolar_eq5d5l_anxiety_depression_check" CHECK ((("anxiety_depression" >= 1) AND ("anxiety_depression" <= 5))),
    CONSTRAINT "bipolar_eq5d5l_mobility_check" CHECK ((("mobility" >= 1) AND ("mobility" <= 5))),
    CONSTRAINT "bipolar_eq5d5l_pain_discomfort_check" CHECK ((("pain_discomfort" >= 1) AND ("pain_discomfort" <= 5))),
    CONSTRAINT "bipolar_eq5d5l_self_care_check" CHECK ((("self_care" >= 1) AND ("self_care" <= 5))),
    CONSTRAINT "bipolar_eq5d5l_usual_activities_check" CHECK ((("usual_activities" >= 1) AND ("usual_activities" <= 5))),
    CONSTRAINT "bipolar_eq5d5l_vas_score_check" CHECK ((("vas_score" >= 0) AND ("vas_score" <= 100)))
);


ALTER TABLE "public"."bipolar_eq5d5l" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_etat_patient" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q1_subjective" integer,
    "q2" integer,
    "q3" integer,
    "q3_type" integer,
    "q4" integer,
    "q4_type" integer,
    "q5" integer,
    "q5_type" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q8_type" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "q13" integer,
    "q14" integer,
    "q15" integer,
    "q16" integer,
    "q17" integer,
    "q18" integer,
    "depressive_count" integer,
    "manic_count" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "depression_count" integer,
    "mania_count" integer
);


ALTER TABLE "public"."bipolar_etat_patient" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_family_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "mother_deceased" character varying(20),
    "mother_death_cause" "text",
    "mother_psy_history" character varying(20),
    "mother_psy_thymic" character varying(20),
    "mother_psy_thymic_type" character varying(20),
    "mother_psy_schizo" character varying(20),
    "mother_psy_suicide" integer,
    "mother_psy_dementia" character varying(20),
    "mother_psy_substance" character varying(20),
    "mother_psy_substance_types" "text"[],
    "mother_psy_anxiety" character varying(20),
    "mother_cardio_history" character varying(20),
    "mother_cardio_types" "text"[],
    "mother_diabetes_type" integer,
    "father_deceased" character varying(20),
    "father_death_cause" "text",
    "father_psy_history" character varying(20),
    "father_psy_thymic" character varying(20),
    "father_psy_thymic_type" character varying(20),
    "father_psy_schizo" character varying(20),
    "father_psy_suicide" integer,
    "father_psy_dementia" character varying(20),
    "father_psy_substance" character varying(20),
    "father_psy_substance_types" "text"[],
    "father_psy_anxiety" character varying(20),
    "father_cardio_history" character varying(20),
    "father_cardio_types" "text"[],
    "father_diabetes_type" integer,
    "gp_maternal_grandmother_notes" "text",
    "gp_maternal_grandfather_notes" "text",
    "gp_paternal_grandmother_notes" "text",
    "gp_paternal_grandfather_notes" "text",
    "has_children" character varying(20),
    "children_psy_count" integer,
    "children_cardio_count" integer,
    "child1_gender" character varying(1),
    "child1_dob" "text",
    "child1_psy_history" character varying(20),
    "child1_psy_details" "text"[],
    "child1_cardio" character varying(20),
    "child2_gender" character varying(1),
    "child2_dob" "text",
    "child2_psy_history" character varying(20),
    "child2_psy_details" "text"[],
    "child2_cardio" character varying(20),
    "child3_gender" character varying(1),
    "child3_dob" "text",
    "child3_psy_history" character varying(20),
    "child3_psy_details" "text"[],
    "child3_cardio" character varying(20),
    "child4_gender" character varying(1),
    "child4_dob" "text",
    "child4_psy_history" character varying(20),
    "child4_psy_details" "text"[],
    "child4_cardio" character varying(20),
    "has_siblings" character varying(20),
    "sibling1_gender" character varying(1),
    "sibling1_deceased" character varying(20),
    "sibling1_death_cause" "text",
    "sibling1_psy_history" character varying(20),
    "sibling1_psy_thymic" character varying(20),
    "sibling1_psy_thymic_type" character varying(20),
    "sibling1_psy_schizo" character varying(20),
    "sibling1_psy_suicide" integer,
    "sibling1_psy_substance" character varying(20),
    "sibling1_psy_anxiety" character varying(20),
    "sibling1_cardio_history" character varying(20),
    "sibling1_cardio_types" "text"[],
    "sibling2_gender" character varying(1),
    "sibling2_deceased" character varying(20),
    "sibling2_death_cause" "text",
    "sibling2_psy_history" character varying(20),
    "sibling2_psy_thymic" character varying(20),
    "sibling2_psy_thymic_type" character varying(20),
    "sibling2_psy_schizo" character varying(20),
    "sibling2_psy_suicide" integer,
    "sibling2_psy_substance" character varying(20),
    "sibling2_psy_anxiety" character varying(20),
    "sibling2_cardio_history" character varying(20),
    "sibling2_cardio_types" "text"[],
    "sibling3_gender" character varying(1),
    "sibling3_deceased" character varying(20),
    "sibling3_death_cause" "text",
    "sibling3_psy_history" character varying(20),
    "sibling3_psy_thymic" character varying(20),
    "sibling3_psy_thymic_type" character varying(20),
    "sibling3_psy_schizo" character varying(20),
    "sibling3_psy_suicide" integer,
    "sibling3_psy_substance" character varying(20),
    "sibling3_psy_anxiety" character varying(20),
    "sibling3_cardio_history" character varying(20),
    "sibling3_cardio_types" "text"[],
    "sibling4_gender" character varying(1),
    "sibling4_deceased" character varying(20),
    "sibling4_death_cause" "text",
    "sibling4_psy_history" character varying(20),
    "sibling4_psy_thymic" character varying(20),
    "sibling4_psy_thymic_type" character varying(20),
    "sibling4_psy_schizo" character varying(20),
    "sibling4_psy_suicide" integer,
    "sibling4_psy_substance" character varying(20),
    "sibling4_psy_anxiety" character varying(20),
    "sibling4_cardio_history" character varying(20),
    "sibling4_cardio_types" "text"[],
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "mother_history" "text",
    "mother_psychiatric" "jsonb",
    "mother_anxiety" character varying(20),
    "mother_substance" "jsonb",
    "mother_dementia" character varying(20),
    "mother_cardio" "jsonb",
    "mother_suicide" "text",
    "father_history" "text",
    "father_psychiatric" "jsonb",
    "father_anxiety" character varying(20),
    "father_substance" "jsonb",
    "father_dementia" character varying(20),
    "father_cardio" "jsonb",
    "father_suicide" "text",
    "grandfather_maternal_history" "text",
    "grandfather_maternal_psychiatric" "jsonb",
    "grandfather_maternal_anxiety" character varying(20),
    "grandfather_maternal_substance" "jsonb",
    "grandfather_maternal_dementia" character varying(20),
    "grandfather_maternal_cardio" "jsonb",
    "grandfather_maternal_suicide" "text",
    "grandfather_maternal_deceased" "public"."yes_no_fr",
    "grandfather_maternal_death_cause" "text",
    "grandfather_paternal_history" "text",
    "grandfather_paternal_psychiatric" "jsonb",
    "grandfather_paternal_anxiety" character varying(20),
    "grandfather_paternal_substance" "jsonb",
    "grandfather_paternal_dementia" character varying(20),
    "grandfather_paternal_cardio" "jsonb",
    "grandfather_paternal_suicide" "text",
    "grandfather_paternal_deceased" "public"."yes_no_fr",
    "grandfather_paternal_death_cause" "text",
    "grandmother_maternal_history" "text",
    "grandmother_maternal_psychiatric" "jsonb",
    "grandmother_maternal_anxiety" character varying(20),
    "grandmother_maternal_substance" "jsonb",
    "grandmother_maternal_dementia" character varying(20),
    "grandmother_maternal_cardio" "jsonb",
    "grandmother_maternal_suicide" "text",
    "grandmother_maternal_deceased" "public"."yes_no_fr",
    "grandmother_maternal_death_cause" "text",
    "grandmother_paternal_history" "text",
    "grandmother_paternal_psychiatric" "jsonb",
    "grandmother_paternal_anxiety" character varying(20),
    "grandmother_paternal_substance" "jsonb",
    "grandmother_paternal_dementia" character varying(20),
    "grandmother_paternal_cardio" "jsonb",
    "grandmother_paternal_suicide" "text",
    "grandmother_paternal_deceased" "public"."yes_no_fr",
    "grandmother_paternal_death_cause" "text",
    "num_brothers" integer,
    "num_brothers_with_issues" integer,
    "num_sisters" integer,
    "num_sisters_with_issues" integer,
    "num_sons" integer,
    "num_sons_with_issues" integer,
    "num_daughters" integer,
    "num_daughters_with_issues" integer,
    "brother1_has_issues" "public"."yes_no_fr",
    "brother1_dob" "date",
    "brother1_deceased" "public"."yes_no_fr",
    "brother1_death_date" "date",
    "brother1_death_cause" "text",
    "brother1_psychiatric" "jsonb",
    "brother1_anxiety" character varying(20),
    "brother1_substance" "jsonb",
    "brother1_dementia" character varying(20),
    "brother1_cardio" "jsonb",
    "brother1_suicide" "text",
    "brother2_has_issues" "public"."yes_no_fr",
    "brother2_dob" "date",
    "brother2_deceased" "public"."yes_no_fr",
    "brother2_death_date" "date",
    "brother2_death_cause" "text",
    "brother2_psychiatric" "jsonb",
    "brother2_anxiety" character varying(20),
    "brother2_substance" "jsonb",
    "brother2_dementia" character varying(20),
    "brother2_cardio" "jsonb",
    "brother2_suicide" "text",
    "brother3_has_issues" "public"."yes_no_fr",
    "brother3_dob" "date",
    "brother3_deceased" "public"."yes_no_fr",
    "brother3_death_date" "date",
    "brother3_death_cause" "text",
    "brother3_psychiatric" "jsonb",
    "brother3_anxiety" character varying(20),
    "brother3_substance" "jsonb",
    "brother3_dementia" character varying(20),
    "brother3_cardio" "jsonb",
    "brother3_suicide" "text",
    "brother4_has_issues" "public"."yes_no_fr",
    "brother4_dob" "date",
    "brother4_deceased" "public"."yes_no_fr",
    "brother4_death_date" "date",
    "brother4_death_cause" "text",
    "brother4_psychiatric" "jsonb",
    "brother4_anxiety" character varying(20),
    "brother4_substance" "jsonb",
    "brother4_dementia" character varying(20),
    "brother4_cardio" "jsonb",
    "brother4_suicide" "text",
    "brother5_has_issues" "public"."yes_no_fr",
    "brother5_dob" "date",
    "brother5_deceased" "public"."yes_no_fr",
    "brother5_death_date" "date",
    "brother5_death_cause" "text",
    "brother5_psychiatric" "jsonb",
    "brother5_anxiety" character varying(20),
    "brother5_substance" "jsonb",
    "brother5_dementia" character varying(20),
    "brother5_cardio" "jsonb",
    "brother5_suicide" "text",
    "sister1_has_issues" "public"."yes_no_fr",
    "sister1_dob" "date",
    "sister1_deceased" "public"."yes_no_fr",
    "sister1_death_date" "date",
    "sister1_death_cause" "text",
    "sister1_psychiatric" "jsonb",
    "sister1_anxiety" character varying(20),
    "sister1_substance" "jsonb",
    "sister1_dementia" character varying(20),
    "sister1_cardio" "jsonb",
    "sister1_suicide" "text",
    "sister2_has_issues" "public"."yes_no_fr",
    "sister2_dob" "date",
    "sister2_deceased" "public"."yes_no_fr",
    "sister2_death_date" "date",
    "sister2_death_cause" "text",
    "sister2_psychiatric" "jsonb",
    "sister2_anxiety" character varying(20),
    "sister2_substance" "jsonb",
    "sister2_dementia" character varying(20),
    "sister2_cardio" "jsonb",
    "sister2_suicide" "text",
    "sister3_has_issues" "public"."yes_no_fr",
    "sister3_dob" "date",
    "sister3_deceased" "public"."yes_no_fr",
    "sister3_death_date" "date",
    "sister3_death_cause" "text",
    "sister3_psychiatric" "jsonb",
    "sister3_anxiety" character varying(20),
    "sister3_substance" "jsonb",
    "sister3_dementia" character varying(20),
    "sister3_cardio" "jsonb",
    "sister3_suicide" "text",
    "sister4_has_issues" "public"."yes_no_fr",
    "sister4_dob" "date",
    "sister4_deceased" "public"."yes_no_fr",
    "sister4_death_date" "date",
    "sister4_death_cause" "text",
    "sister4_psychiatric" "jsonb",
    "sister4_anxiety" character varying(20),
    "sister4_substance" "jsonb",
    "sister4_dementia" character varying(20),
    "sister4_cardio" "jsonb",
    "sister4_suicide" "text",
    "sister5_has_issues" "public"."yes_no_fr",
    "sister5_dob" "date",
    "sister5_deceased" "public"."yes_no_fr",
    "sister5_death_date" "date",
    "sister5_death_cause" "text",
    "sister5_psychiatric" "jsonb",
    "sister5_anxiety" character varying(20),
    "sister5_substance" "jsonb",
    "sister5_dementia" character varying(20),
    "sister5_cardio" "jsonb",
    "sister5_suicide" "text",
    "son1_has_issues" "public"."yes_no_fr",
    "son1_dob" "date",
    "son1_deceased" "public"."yes_no_fr",
    "son1_death_date" "date",
    "son1_death_cause" "text",
    "son1_psychiatric" "jsonb",
    "son1_anxiety" character varying(20),
    "son1_substance" "jsonb",
    "son1_dementia" character varying(20),
    "son1_cardio" "jsonb",
    "son1_suicide" "text",
    "son2_has_issues" "public"."yes_no_fr",
    "son2_dob" "date",
    "son2_deceased" "public"."yes_no_fr",
    "son2_death_date" "date",
    "son2_death_cause" "text",
    "son2_psychiatric" "jsonb",
    "son2_anxiety" character varying(20),
    "son2_substance" "jsonb",
    "son2_dementia" character varying(20),
    "son2_cardio" "jsonb",
    "son2_suicide" "text",
    "son3_has_issues" "public"."yes_no_fr",
    "son3_dob" "date",
    "son3_deceased" "public"."yes_no_fr",
    "son3_death_date" "date",
    "son3_death_cause" "text",
    "son3_psychiatric" "jsonb",
    "son3_anxiety" character varying(20),
    "son3_substance" "jsonb",
    "son3_dementia" character varying(20),
    "son3_cardio" "jsonb",
    "son3_suicide" "text",
    "son4_has_issues" "public"."yes_no_fr",
    "son4_dob" "date",
    "son4_deceased" "public"."yes_no_fr",
    "son4_death_date" "date",
    "son4_death_cause" "text",
    "son4_psychiatric" "jsonb",
    "son4_anxiety" character varying(20),
    "son4_substance" "jsonb",
    "son4_dementia" character varying(20),
    "son4_cardio" "jsonb",
    "son4_suicide" "text",
    "son5_has_issues" "public"."yes_no_fr",
    "son5_dob" "date",
    "son5_deceased" "public"."yes_no_fr",
    "son5_death_date" "date",
    "son5_death_cause" "text",
    "son5_psychiatric" "jsonb",
    "son5_anxiety" character varying(20),
    "son5_substance" "jsonb",
    "son5_dementia" character varying(20),
    "son5_cardio" "jsonb",
    "son5_suicide" "text",
    "daughter1_has_issues" "public"."yes_no_fr",
    "daughter1_dob" "date",
    "daughter1_deceased" "public"."yes_no_fr",
    "daughter1_death_date" "date",
    "daughter1_death_cause" "text",
    "daughter1_psychiatric" "jsonb",
    "daughter1_anxiety" character varying(20),
    "daughter1_substance" "jsonb",
    "daughter1_dementia" character varying(20),
    "daughter1_cardio" "jsonb",
    "daughter1_suicide" "text",
    "daughter2_has_issues" "public"."yes_no_fr",
    "daughter2_dob" "date",
    "daughter2_deceased" "public"."yes_no_fr",
    "daughter2_death_date" "date",
    "daughter2_death_cause" "text",
    "daughter2_psychiatric" "jsonb",
    "daughter2_anxiety" character varying(20),
    "daughter2_substance" "jsonb",
    "daughter2_dementia" character varying(20),
    "daughter2_cardio" "jsonb",
    "daughter2_suicide" "text",
    "daughter3_has_issues" "public"."yes_no_fr",
    "daughter3_dob" "date",
    "daughter3_deceased" "public"."yes_no_fr",
    "daughter3_death_date" "date",
    "daughter3_death_cause" "text",
    "daughter3_psychiatric" "jsonb",
    "daughter3_anxiety" character varying(20),
    "daughter3_substance" "jsonb",
    "daughter3_dementia" character varying(20),
    "daughter3_cardio" "jsonb",
    "daughter3_suicide" "text",
    "daughter4_has_issues" "public"."yes_no_fr",
    "daughter4_dob" "date",
    "daughter4_deceased" "public"."yes_no_fr",
    "daughter4_death_date" "date",
    "daughter4_death_cause" "text",
    "daughter4_psychiatric" "jsonb",
    "daughter4_anxiety" character varying(20),
    "daughter4_substance" "jsonb",
    "daughter4_dementia" character varying(20),
    "daughter4_cardio" "jsonb",
    "daughter4_suicide" "text",
    "daughter5_has_issues" "public"."yes_no_fr",
    "daughter5_dob" "date",
    "daughter5_deceased" "public"."yes_no_fr",
    "daughter5_death_date" "date",
    "daughter5_death_cause" "text",
    "daughter5_psychiatric" "jsonb",
    "daughter5_anxiety" character varying(20),
    "daughter5_substance" "jsonb",
    "daughter5_dementia" character varying(20),
    "daughter5_cardio" "jsonb",
    "daughter5_suicide" "text"
);


ALTER TABLE "public"."bipolar_family_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_fast" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "q13" integer,
    "q14" integer,
    "q15" integer,
    "q16" integer,
    "q17" integer,
    "q18" integer,
    "q19" integer,
    "q20" integer,
    "q21" integer,
    "q22" integer,
    "q23" integer,
    "q24" integer,
    "total_score" integer,
    "autonomy_score" integer,
    "work_score" integer,
    "cognitive_score" integer,
    "finances_score" integer,
    "relationships_score" integer,
    "leisure_score" integer,
    "severity" "text",
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "financial_score" integer,
    "interpersonal_score" integer,
    "occupational_score" integer,
    CONSTRAINT "bipolar_fast_q10_check" CHECK ((("q10" >= 0) AND ("q10" <= 3))),
    CONSTRAINT "bipolar_fast_q11_check" CHECK ((("q11" >= 0) AND ("q11" <= 3))),
    CONSTRAINT "bipolar_fast_q12_check" CHECK ((("q12" >= 0) AND ("q12" <= 3))),
    CONSTRAINT "bipolar_fast_q13_check" CHECK ((("q13" >= 0) AND ("q13" <= 3))),
    CONSTRAINT "bipolar_fast_q14_check" CHECK ((("q14" >= 0) AND ("q14" <= 3))),
    CONSTRAINT "bipolar_fast_q15_check" CHECK ((("q15" >= 0) AND ("q15" <= 3))),
    CONSTRAINT "bipolar_fast_q16_check" CHECK ((("q16" >= 0) AND ("q16" <= 3))),
    CONSTRAINT "bipolar_fast_q17_check" CHECK ((("q17" >= 0) AND ("q17" <= 3))),
    CONSTRAINT "bipolar_fast_q18_check" CHECK ((("q18" >= 0) AND ("q18" <= 3))),
    CONSTRAINT "bipolar_fast_q19_check" CHECK ((("q19" >= 0) AND ("q19" <= 3))),
    CONSTRAINT "bipolar_fast_q1_check" CHECK ((("q1" >= 0) AND ("q1" <= 3))),
    CONSTRAINT "bipolar_fast_q20_check" CHECK ((("q20" >= 0) AND ("q20" <= 3))),
    CONSTRAINT "bipolar_fast_q21_check" CHECK ((("q21" >= 0) AND ("q21" <= 3))),
    CONSTRAINT "bipolar_fast_q22_check" CHECK ((("q22" >= 0) AND ("q22" <= 3))),
    CONSTRAINT "bipolar_fast_q23_check" CHECK ((("q23" >= 0) AND ("q23" <= 3))),
    CONSTRAINT "bipolar_fast_q24_check" CHECK ((("q24" >= 0) AND ("q24" <= 3))),
    CONSTRAINT "bipolar_fast_q2_check" CHECK ((("q2" >= 0) AND ("q2" <= 3))),
    CONSTRAINT "bipolar_fast_q3_check" CHECK ((("q3" >= 0) AND ("q3" <= 3))),
    CONSTRAINT "bipolar_fast_q4_check" CHECK ((("q4" >= 0) AND ("q4" <= 3))),
    CONSTRAINT "bipolar_fast_q5_check" CHECK ((("q5" >= 0) AND ("q5" <= 3))),
    CONSTRAINT "bipolar_fast_q6_check" CHECK ((("q6" >= 0) AND ("q6" <= 3))),
    CONSTRAINT "bipolar_fast_q7_check" CHECK ((("q7" >= 0) AND ("q7" <= 3))),
    CONSTRAINT "bipolar_fast_q8_check" CHECK ((("q8" >= 0) AND ("q8" <= 3))),
    CONSTRAINT "bipolar_fast_q9_check" CHECK ((("q9" >= 0) AND ("q9" <= 3)))
);


ALTER TABLE "public"."bipolar_fast" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_fluences_verbales" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "patient_age" integer,
    "years_of_education" integer,
    "fv_p_tot_correct" integer,
    "fv_p_deriv" integer,
    "fv_p_intrus" integer,
    "fv_p_propres" integer,
    "fv_p_tot_rupregle" integer,
    "fv_p_tot_correct_z" numeric(5,2),
    "fv_p_tot_correct_pc" "text",
    "fv_anim_tot_correct" integer,
    "fv_anim_deriv" integer,
    "fv_anim_intrus" integer,
    "fv_anim_propres" integer,
    "fv_anim_tot_rupregle" integer,
    "fv_anim_tot_correct_z" numeric(5,2),
    "fv_anim_tot_correct_pc" "text",
    "fv_fruit_tot_correct" integer,
    "fv_fruit_deriv" integer,
    "fv_fruit_intrus" integer,
    "fv_fruit_propres" integer,
    "fv_fruit_tot_rupregle" integer,
    "fv_fruit_tot_correct_z" numeric(5,2),
    "fv_fruit_tot_correct_pc" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "fv_anim_cluster_taille" integer,
    "fv_anim_cluster_tot" integer,
    "fv_anim_persev" integer,
    "fv_anim_switch_tot" integer,
    "fv_p_cluster_taille" integer,
    "fv_p_cluster_tot" integer,
    "fv_p_persev" integer,
    "fv_p_switch_tot" integer,
    "questionnaire_version" "text"
);


ALTER TABLE "public"."bipolar_fluences_verbales" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_followup_arrets_travail" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "rad_arret_travail" character varying(50),
    "arret_travail_nb" integer,
    "arret_travail_duree" integer,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "bipolar_followup_arrets_travail_arret_travail_duree_check" CHECK (("arret_travail_duree" >= 0)),
    CONSTRAINT "bipolar_followup_arrets_travail_arret_travail_nb_check" CHECK (("arret_travail_nb" >= 0))
);


ALTER TABLE "public"."bipolar_followup_arrets_travail" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_followup_humeur_actuels" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "rad_epactuel" character varying(50),
    "date_trouble_actuel_debut" "date",
    "rad_epactuel_type" character varying(100),
    "rad_epactuel_edmtype" character varying(100),
    "rad_epactuel_mixttyp" character varying(50),
    "rad_epactuel_mixttyp2" character varying(50),
    "rad_epactuel_sever" character varying(100),
    "rad_epactuel_chron" character varying(50),
    "rad_postpartum_actuel" character varying(50),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_followup_humeur_actuels" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_followup_humeur_depuis_visite" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "rad_tb_hum_epthyman" character varying(50),
    "rad_tb_hum_epthyman_nb" character varying(50),
    "rad_tb_hum_nbepdep" character varying(50),
    "date_prem_edm" "date",
    "rad_tb_hum_nbepdeppsy" character varying(50),
    "rad_tb_hum_nbepdepmixt" character varying(50),
    "rad_tb_hum_nbepmanan" character varying(50),
    "date_prem_man" "date",
    "rad_tb_hum_nbepmanpsy" character varying(50),
    "rad_tb_hum_nbepmanmixt" character varying(50),
    "rad_tb_hum_nbephypoman" character varying(50),
    "date_prem_hypo" "date",
    "rad_tb_hum_type_plus_recent" character varying(100),
    "enchainement" "text",
    "rad_tb_hum_nb_hospi" character varying(50),
    "rad_tb_hum_duree_hospi" character varying(50),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_followup_humeur_depuis_visite" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_followup_isa" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_life_worth" integer,
    "q1_time" character varying(50),
    "q2_wish_death" integer,
    "q2_time" character varying(50),
    "q3_thoughts" integer,
    "q3_time" character varying(50),
    "q4_plan" integer,
    "q4_time" character varying(50),
    "q5_attempt" integer,
    "q5_time" character varying(50),
    "risk_level" character varying(50),
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "total_score" integer,
    CONSTRAINT "bipolar_followup_isa_q1_life_worth_check" CHECK (("q1_life_worth" = ANY (ARRAY[0, 1]))),
    CONSTRAINT "bipolar_followup_isa_q2_wish_death_check" CHECK (("q2_wish_death" = ANY (ARRAY[0, 1]))),
    CONSTRAINT "bipolar_followup_isa_q3_thoughts_check" CHECK (("q3_thoughts" = ANY (ARRAY[0, 1]))),
    CONSTRAINT "bipolar_followup_isa_q4_plan_check" CHECK (("q4_plan" = ANY (ARRAY[0, 1]))),
    CONSTRAINT "bipolar_followup_isa_q5_attempt_check" CHECK (("q5_attempt" = ANY (ARRAY[0, 1])))
);


ALTER TABLE "public"."bipolar_followup_isa" OWNER TO "postgres";


COMMENT ON COLUMN "public"."bipolar_followup_isa"."total_score" IS 'Total ISA score (0-5). Computed by the application as sum of q1-q5 binary values.';



CREATE TABLE IF NOT EXISTS "public"."bipolar_followup_psychotiques" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "rad_tb_psychos" character varying(50),
    "date_tb_psychos_date" "date",
    "rad_tb_psychos_type" character varying(100),
    "rad_tb_psychos_lastmonth" character varying(50),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_followup_psychotiques" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_followup_recours_aux_soins" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "rad_recours_soin_psy" character varying(50),
    "rad_recours_soin_psy_generaliste" character varying(50),
    "recours_soin_psy_generaliste_nb" integer,
    "rad_recours_soin_psy_psychiatre" character varying(50),
    "recours_soin_psy_psychiatre_nb" integer,
    "rad_recours_soin_psy_psychologue" character varying(50),
    "recours_soin_psy_psychologue_nb" integer,
    "rad_recours_soin_psy_plusieurs" character varying(50),
    "recours_soin_psy_plusieurs_nb" integer,
    "rad_recours_soin_psy_autres" character varying(50),
    "recours_soin_psy_autres_nb" integer,
    "rad_recours_soin_urgence" character varying(50),
    "rad_recours_soin_urgence_sans_hosp" character varying(50),
    "recours_soin_urgence_sans_hosp_nb" integer,
    "rad_recours_soin_urgence_generaliste" character varying(50),
    "recours_soin_urgence_generaliste_nb" integer,
    "rad_recours_soin_urgence_psychiatre" character varying(50),
    "recours_soin_urgence_psychiatre_nb" integer,
    "rad_recours_soin_urgence_psychologue" character varying(50),
    "recours_soin_urgence_psychologue_nb" integer,
    "rad_recours_soin_urgence_plusieurs" character varying(50),
    "recours_soin_urgence_plusieurs_nb" integer,
    "rad_recours_soin_urgence_autres" character varying(50),
    "recours_soin_urgence_autres_nb" integer,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_followup_recours_aux_soins" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_followup_somatique_contraceptif" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "fckedit_somatique_contraceptif" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_followup_somatique_contraceptif" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_followup_statut_professionnel" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "rad_changement_statut" character varying(50),
    "rad_statut_actuel" character varying(50),
    "statut_actuel_autre" "text",
    "rad_social_stprof_class" character varying(200),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_followup_statut_professionnel" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_followup_suicide_behavior" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_self_harm" integer,
    "q2_interrupted" integer,
    "q2_1_interrupted_count" integer,
    "q3_aborted" integer,
    "q3_1_aborted_count" integer,
    "q4_preparations" integer,
    "risk_score" integer GENERATED ALWAYS AS ((((COALESCE("q1_self_harm", 0) + COALESCE("q2_interrupted", 0)) + COALESCE("q3_aborted", 0)) + COALESCE("q4_preparations", 0))) STORED,
    "risk_level" character varying(50),
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "bipolar_followup_suicide_behavior_q1_self_harm_check" CHECK (("q1_self_harm" = ANY (ARRAY[0, 1]))),
    CONSTRAINT "bipolar_followup_suicide_behavior_q2_1_interrupted_count_check" CHECK (("q2_1_interrupted_count" >= 0)),
    CONSTRAINT "bipolar_followup_suicide_behavior_q2_interrupted_check" CHECK (("q2_interrupted" = ANY (ARRAY[0, 1]))),
    CONSTRAINT "bipolar_followup_suicide_behavior_q3_1_aborted_count_check" CHECK (("q3_1_aborted_count" >= 0)),
    CONSTRAINT "bipolar_followup_suicide_behavior_q3_aborted_check" CHECK (("q3_aborted" = ANY (ARRAY[0, 1]))),
    CONSTRAINT "bipolar_followup_suicide_behavior_q4_preparations_check" CHECK (("q4_preparations" = ANY (ARRAY[0, 1])))
);


ALTER TABLE "public"."bipolar_followup_suicide_behavior" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_followup_suivi_recommandations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "rad_suivi_recom_medicamenteux" character varying(50),
    "rad_suivi_recom_medicamenteux_non" character varying(100),
    "rad_suivi_recom_non_medicamenteux" character varying(50),
    "rad_suivi_recom_non_medicamenteux_non" character varying(100),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_followup_suivi_recommandations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_followup_traitement_non_pharma" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "rad_non_pharmacologique" character varying(50),
    "rad_non_pharmacologique_sismo" character varying(50),
    "non_pharmacologique_sismo_nb" integer,
    "date_non_pharmacologique_sismo_debut" "date",
    "date_non_pharmacologique_sismo_fin" "date",
    "rad_non_pharmacologique_tms" character varying(50),
    "non_pharmacologique_tms_nb" integer,
    "date_non_pharmacologique_tms_debut" "date",
    "date_non_pharmacologique_tms_fin" "date",
    "rad_non_pharmacologique_tcc" character varying(50),
    "non_pharmacologique_tcc_nb" integer,
    "date_non_pharmacologique_tcc_debut" "date",
    "date_non_pharmacologique_tcc_fin" "date",
    "rad_non_pharmacologique_psychoed" character varying(50),
    "non_pharmacologique_psychoed_nb" integer,
    "date_non_pharmacologique_psychoed_debut" "date",
    "date_non_pharmacologique_psychoed_fin" "date",
    "rad_non_pharmacologique_ipsrt" character varying(50),
    "non_pharmacologique_ipsrt_nb" integer,
    "chk_non_pharmacologique_ipsrt_precisez" "text"[],
    "date_non_pharmacologique_ipsrt_debut" "date",
    "date_non_pharmacologique_ipsrt_fin" "date",
    "rad_non_pharmacologique_autre" character varying(50),
    "non_pharmacologique_autre_precisez" "text",
    "non_pharmacologique_autre_nb" integer,
    "date_non_pharmacologique_autre_debut" "date",
    "date_non_pharmacologique_autre_fin" "date",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_followup_traitement_non_pharma" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_isa" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_life_worth" integer,
    "q1_time" character varying(20),
    "q2_wish_death" integer,
    "q2_time" character varying(20),
    "q3_thoughts" integer,
    "q3_time" character varying(20),
    "q4_plan" integer,
    "q4_time" character varying(20),
    "q5_attempt" integer,
    "q5_time" character varying(20),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_isa" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_madrs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "total_score" integer,
    "severity" "text",
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "bipolar_madrs_q10_check" CHECK ((("q10" >= 0) AND ("q10" <= 6))),
    CONSTRAINT "bipolar_madrs_q1_check" CHECK ((("q1" >= 0) AND ("q1" <= 6))),
    CONSTRAINT "bipolar_madrs_q2_check" CHECK ((("q2" >= 0) AND ("q2" <= 6))),
    CONSTRAINT "bipolar_madrs_q3_check" CHECK ((("q3" >= 0) AND ("q3" <= 6))),
    CONSTRAINT "bipolar_madrs_q4_check" CHECK ((("q4" >= 0) AND ("q4" <= 6))),
    CONSTRAINT "bipolar_madrs_q5_check" CHECK ((("q5" >= 0) AND ("q5" <= 6))),
    CONSTRAINT "bipolar_madrs_q6_check" CHECK ((("q6" >= 0) AND ("q6" <= 6))),
    CONSTRAINT "bipolar_madrs_q7_check" CHECK ((("q7" >= 0) AND ("q7" <= 6))),
    CONSTRAINT "bipolar_madrs_q8_check" CHECK ((("q8" >= 0) AND ("q8" <= 6))),
    CONSTRAINT "bipolar_madrs_q9_check" CHECK ((("q9" >= 0) AND ("q9" <= 6)))
);


ALTER TABLE "public"."bipolar_madrs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_mars" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "taking_medication" character varying(10),
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "total_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "adherence_percentage" numeric,
    "adherence_subscore" integer,
    "attitude_subscore" integer
);


ALTER TABLE "public"."bipolar_mars" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_mathys" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" numeric,
    "q2" numeric,
    "q3" numeric,
    "q4" numeric,
    "q5" numeric,
    "q6" numeric,
    "q7" numeric,
    "q8" numeric,
    "q9" numeric,
    "q10" numeric,
    "q11" numeric,
    "q12" numeric,
    "q13" numeric,
    "q14" numeric,
    "q15" numeric,
    "q16" numeric,
    "q17" numeric,
    "q18" numeric,
    "q19" numeric,
    "q20" numeric,
    "subscore_emotion" numeric,
    "subscore_motivation" numeric,
    "subscore_perception" numeric,
    "subscore_interaction" numeric,
    "subscore_cognition" numeric,
    "tristesse" numeric,
    "joie" numeric,
    "irritabilite" numeric,
    "panique" numeric,
    "anxiete" numeric,
    "colere" numeric,
    "exaltation" numeric,
    "total_score" numeric,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "cognitive_speed" numeric,
    "emotional_hyperreactivity" numeric,
    "emotional_hyporeactivity" numeric,
    "motivation" numeric,
    "motor_activity" numeric
);


ALTER TABLE "public"."bipolar_mathys" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_mdq" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_1" integer,
    "q1_2" integer,
    "q1_3" integer,
    "q1_4" integer,
    "q1_5" integer,
    "q1_6" integer,
    "q1_7" integer,
    "q1_8" integer,
    "q1_9" integer,
    "q1_10" integer,
    "q1_11" integer,
    "q1_12" integer,
    "q1_13" integer,
    "q1_score" integer,
    "q2" integer,
    "q3" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "bipolar_mdq_q1_10_check" CHECK ((("q1_10" >= 0) AND ("q1_10" <= 1))),
    CONSTRAINT "bipolar_mdq_q1_11_check" CHECK ((("q1_11" >= 0) AND ("q1_11" <= 1))),
    CONSTRAINT "bipolar_mdq_q1_12_check" CHECK ((("q1_12" >= 0) AND ("q1_12" <= 1))),
    CONSTRAINT "bipolar_mdq_q1_13_check" CHECK ((("q1_13" >= 0) AND ("q1_13" <= 1))),
    CONSTRAINT "bipolar_mdq_q1_1_check" CHECK ((("q1_1" >= 0) AND ("q1_1" <= 1))),
    CONSTRAINT "bipolar_mdq_q1_2_check" CHECK ((("q1_2" >= 0) AND ("q1_2" <= 1))),
    CONSTRAINT "bipolar_mdq_q1_3_check" CHECK ((("q1_3" >= 0) AND ("q1_3" <= 1))),
    CONSTRAINT "bipolar_mdq_q1_4_check" CHECK ((("q1_4" >= 0) AND ("q1_4" <= 1))),
    CONSTRAINT "bipolar_mdq_q1_5_check" CHECK ((("q1_5" >= 0) AND ("q1_5" <= 1))),
    CONSTRAINT "bipolar_mdq_q1_6_check" CHECK ((("q1_6" >= 0) AND ("q1_6" <= 1))),
    CONSTRAINT "bipolar_mdq_q1_7_check" CHECK ((("q1_7" >= 0) AND ("q1_7" <= 1))),
    CONSTRAINT "bipolar_mdq_q1_8_check" CHECK ((("q1_8" >= 0) AND ("q1_8" <= 1))),
    CONSTRAINT "bipolar_mdq_q1_9_check" CHECK ((("q1_9" >= 0) AND ("q1_9" <= 1))),
    CONSTRAINT "bipolar_mdq_q2_check" CHECK ((("q2" >= 0) AND ("q2" <= 1))),
    CONSTRAINT "bipolar_mdq_q3_check" CHECK ((("q3" >= 0) AND ("q3" <= 3)))
);


ALTER TABLE "public"."bipolar_mdq" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_mem3_spatial" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "patient_age" integer,
    "odirect_1a" integer,
    "odirect_1b" integer,
    "odirect_2a" integer,
    "odirect_2b" integer,
    "odirect_3a" integer,
    "odirect_3b" integer,
    "odirect_4a" integer,
    "odirect_4b" integer,
    "odirect_5a" integer,
    "odirect_5b" integer,
    "odirect_6a" integer,
    "odirect_6b" integer,
    "odirect_7a" integer,
    "odirect_7b" integer,
    "odirect_8a" integer,
    "odirect_8b" integer,
    "inverse_1a" integer,
    "inverse_1b" integer,
    "inverse_2a" integer,
    "inverse_2b" integer,
    "inverse_3a" integer,
    "inverse_3b" integer,
    "inverse_4a" integer,
    "inverse_4b" integer,
    "inverse_5a" integer,
    "inverse_5b" integer,
    "inverse_6a" integer,
    "inverse_6b" integer,
    "inverse_7a" integer,
    "inverse_7b" integer,
    "inverse_8a" integer,
    "inverse_8b" integer,
    "mspatiale_odirect_tot" integer,
    "mspatiale_odirect_std" integer,
    "mspatiale_odirect_cr" numeric(5,2),
    "mspatiale_inverse_tot" integer,
    "mspatiale_inverse_std" integer,
    "mspatiale_inverse_cr" numeric(5,2),
    "mspatiale_total_brut" integer,
    "mspatiale_total_std" integer,
    "mspatiale_total_cr" numeric(5,2),
    "item_notes" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "inverse_1_note" integer,
    "inverse_2_note" integer,
    "inverse_3_note" integer,
    "inverse_4_note" integer,
    "inverse_5_note" integer,
    "inverse_6_note" integer,
    "inverse_7_note" integer,
    "inverse_8_note" integer,
    "odirect_1_note" integer,
    "odirect_2_note" integer,
    "odirect_3_note" integer,
    "odirect_4_note" integer,
    "odirect_5_note" integer,
    "odirect_6_note" integer,
    "odirect_7_note" integer,
    "odirect_8_note" integer,
    "patient_gender" "text",
    "years_of_education" integer
);


ALTER TABLE "public"."bipolar_mem3_spatial" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_non_pharmacologic" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "global_screening" "text",
    "sismotherapie_status" "text",
    "sismotherapie_sessions" integer,
    "sismotherapie_start_date" "date",
    "sismotherapie_end_date" "date",
    "tms_status" "text",
    "tms_sessions" integer,
    "tms_start_date" "date",
    "tms_end_date" "date",
    "tcc_status" "text",
    "tcc_sessions" integer,
    "tcc_start_date" "date",
    "tcc_end_date" "date",
    "psychoeducation_status" "text",
    "psychoeducation_sessions" integer,
    "psychoeducation_start_date" "date",
    "psychoeducation_end_date" "date",
    "ipsrt_status" "text",
    "ipsrt_sessions" integer,
    "ipsrt_start_date" "date",
    "ipsrt_end_date" "date",
    "ipsrt_group" boolean DEFAULT false,
    "ipsrt_individual" boolean DEFAULT false,
    "ipsrt_unknown_format" boolean DEFAULT false,
    "autre_status" "text",
    "autre_specify" "text",
    "autre_sessions" integer,
    "autre_start_date" "date",
    "autre_end_date" "date",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "bipolar_non_pharmacologic_autre_status_check" CHECK (("autre_status" = ANY (ARRAY['yes'::"text", 'no'::"text", 'unknown'::"text"]))),
    CONSTRAINT "bipolar_non_pharmacologic_global_screening_check" CHECK (("global_screening" = ANY (ARRAY['yes'::"text", 'no'::"text", 'unknown'::"text"]))),
    CONSTRAINT "bipolar_non_pharmacologic_ipsrt_status_check" CHECK (("ipsrt_status" = ANY (ARRAY['yes'::"text", 'no'::"text", 'unknown'::"text"]))),
    CONSTRAINT "bipolar_non_pharmacologic_psychoeducation_status_check" CHECK (("psychoeducation_status" = ANY (ARRAY['yes'::"text", 'no'::"text", 'unknown'::"text"]))),
    CONSTRAINT "bipolar_non_pharmacologic_sismotherapie_status_check" CHECK (("sismotherapie_status" = ANY (ARRAY['yes'::"text", 'no'::"text", 'unknown'::"text"]))),
    CONSTRAINT "bipolar_non_pharmacologic_tcc_status_check" CHECK (("tcc_status" = ANY (ARRAY['yes'::"text", 'no'::"text", 'unknown'::"text"]))),
    CONSTRAINT "bipolar_non_pharmacologic_tms_status_check" CHECK (("tms_status" = ANY (ARRAY['yes'::"text", 'no'::"text", 'unknown'::"text"])))
);


ALTER TABLE "public"."bipolar_non_pharmacologic" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_nurse_biological_assessment" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "collection_date" "date",
    "collection_location" character varying(20),
    "on_neuroleptics" boolean,
    "woman_childbearing_age" boolean,
    "sodium" numeric(5,2),
    "potassium" numeric(4,2),
    "chlore" integer,
    "bicarbonates" integer,
    "protidemie" integer,
    "albumine" integer,
    "uree" numeric(4,2),
    "acide_urique" integer,
    "creatinine" numeric(6,2),
    "clairance_creatinine" numeric(5,2),
    "phosphore" numeric(3,2),
    "fer" numeric(4,2),
    "ferritine" integer,
    "calcemie" numeric(4,3),
    "hdl" numeric(5,2),
    "hdl_unit" character varying(10),
    "ldl" numeric(5,2),
    "ldl_unit" character varying(10),
    "cholesterol_total" numeric(5,2),
    "triglycerides" numeric(5,2),
    "pal" integer,
    "asat" integer,
    "alat" integer,
    "bilirubine_totale" numeric(6,2),
    "bilirubine_totale_unit" character varying(10),
    "ggt" integer,
    "tsh" numeric(6,2),
    "tsh_unit" character varying(10),
    "t3_libre" numeric(4,2),
    "t4_libre" numeric(5,2),
    "leucocytes" numeric(6,2),
    "hematies" numeric(4,2),
    "hemoglobine" numeric(5,2),
    "hemoglobine_unit" character varying(10),
    "hematocrite" numeric(5,2),
    "hematocrite_unit" character varying(10),
    "neutrophiles" numeric(5,2),
    "basophiles" numeric(4,2),
    "eosinophiles" numeric(4,2),
    "lymphocytes" numeric(5,2),
    "monocytes" numeric(4,2),
    "vgm" numeric(5,2),
    "tcmh" numeric(4,2),
    "tcmh_unit" character varying(10),
    "ccmh" numeric(5,2),
    "ccmh_unit" character varying(10),
    "plaquettes" integer,
    "beta_hcg" integer,
    "prolactine" numeric(8,2),
    "prolactine_unit" character varying(10),
    "treatment_taken_morning" boolean,
    "clozapine" numeric(6,2),
    "teralithe_type" character varying(10),
    "lithium_plasma" numeric(5,2),
    "lithium_erythrocyte" numeric(5,2),
    "valproic_acid" numeric(6,2),
    "carbamazepine" numeric(6,2),
    "oxcarbazepine" numeric(6,2),
    "lamotrigine" numeric(6,2),
    "vitamin_d_level" numeric(6,2),
    "outdoor_time" character varying(50),
    "skin_phototype" character varying(10),
    "vitamin_d_supplementation" boolean,
    "toxo_serology_done" boolean,
    "toxo_igm_positive" boolean,
    "toxo_igg_positive" boolean,
    "toxo_igg_value" numeric(8,2),
    "toxo_pcr_done" boolean,
    "toxo_pcr_positive" boolean,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "crp" numeric(5,2),
    "glycemie_a_jeun" numeric(5,2),
    "glycemie_unit" character varying(10),
    "hemoglobine_glyquee" numeric(5,2),
    "glycemie_a_jeun_unit" character varying(10),
    "rapport_total_hdl" numeric(5,2),
    "dosage_bhcg" numeric(10,2),
    "vitamin_d_product_name" character varying(20),
    "vitamin_d_supplementation_date" "date",
    "vitamin_d_supplementation_mode" character varying(10),
    "vitamin_d_supplementation_dose" character varying(100),
    "calcemie_corrigee" numeric,
    "patient_age" integer,
    "patient_gender" character varying(10),
    "years_of_education" integer,
    "weight_kg" numeric,
    CONSTRAINT "responses_biological_assessm_vitamin_d_supplementation_mo_check" CHECK ((("vitamin_d_supplementation_mode")::"text" = ANY ((ARRAY['ampoule'::character varying, 'gouttes'::character varying])::"text"[]))),
    CONSTRAINT "responses_biological_assessment_acide_urique_check" CHECK ((("acide_urique" >= 100) AND ("acide_urique" <= 500))),
    CONSTRAINT "responses_biological_assessment_alat_check" CHECK ((("alat" >= 5) AND ("alat" <= 500))),
    CONSTRAINT "responses_biological_assessment_albumine_check" CHECK ((("albumine" >= 30) AND ("albumine" <= 55))),
    CONSTRAINT "responses_biological_assessment_asat_check" CHECK ((("asat" >= 5) AND ("asat" <= 500))),
    CONSTRAINT "responses_biological_assessment_basophiles_check" CHECK ((("basophiles" >= (0)::numeric) AND ("basophiles" <= (5)::numeric))),
    CONSTRAINT "responses_biological_assessment_beta_hcg_check" CHECK ((("beta_hcg" >= 0) AND ("beta_hcg" <= 500000))),
    CONSTRAINT "responses_biological_assessment_bicarbonates_check" CHECK ((("bicarbonates" >= 10) AND ("bicarbonates" <= 40))),
    CONSTRAINT "responses_biological_assessment_bilirubine_unit_check" CHECK ((("bilirubine_totale_unit")::"text" = ANY ((ARRAY['umol_L'::character varying, 'mmol_L'::character varying, 'mg_L'::character varying])::"text"[]))),
    CONSTRAINT "responses_biological_assessment_calcemie_check" CHECK ((("calcemie" >= 1.50) AND ("calcemie" <= 2.75))),
    CONSTRAINT "responses_biological_assessment_ccmh_unit_check" CHECK ((("ccmh_unit")::"text" = ANY ((ARRAY['percent'::character varying, 'g_dL'::character varying, 'g_L'::character varying])::"text"[]))),
    CONSTRAINT "responses_biological_assessment_chlore_check" CHECK ((("chlore" >= 80) AND ("chlore" <= 130))),
    CONSTRAINT "responses_biological_assessment_cholesterol_total_check" CHECK ((("cholesterol_total" >= (1)::numeric) AND ("cholesterol_total" <= (15)::numeric))),
    CONSTRAINT "responses_biological_assessment_clairance_creatinine_check" CHECK ((("clairance_creatinine" >= (0)::numeric) AND ("clairance_creatinine" <= (10000)::numeric))),
    CONSTRAINT "responses_biological_assessment_collection_location_check" CHECK ((("collection_location")::"text" = ANY ((ARRAY['sur_site'::character varying, 'hors_site'::character varying])::"text"[]))),
    CONSTRAINT "responses_biological_assessment_creatinine_check" CHECK ((("creatinine" >= (30)::numeric) AND ("creatinine" <= (400)::numeric))),
    CONSTRAINT "responses_biological_assessment_crp_check" CHECK ((("crp" >= (0)::numeric) AND ("crp" <= (50)::numeric))),
    CONSTRAINT "responses_biological_assessment_dosage_bhcg_check" CHECK (("dosage_bhcg" >= (0)::numeric)),
    CONSTRAINT "responses_biological_assessment_eosinophiles_check" CHECK ((("eosinophiles" >= (0)::numeric) AND ("eosinophiles" <= (10)::numeric))),
    CONSTRAINT "responses_biological_assessment_fer_check" CHECK ((("fer" >= (5)::numeric) AND ("fer" <= (40)::numeric))),
    CONSTRAINT "responses_biological_assessment_ferritine_check" CHECK ((("ferritine" >= 5) AND ("ferritine" <= 1000))),
    CONSTRAINT "responses_biological_assessment_ggt_check" CHECK ((("ggt" >= 5) AND ("ggt" <= 1500))),
    CONSTRAINT "responses_biological_assessment_glycemie_a_jeun_check" CHECK ((("glycemie_a_jeun" >= (0)::numeric) AND ("glycemie_a_jeun" <= (50)::numeric))),
    CONSTRAINT "responses_biological_assessment_glycemie_a_jeun_unit_check" CHECK ((("glycemie_a_jeun_unit")::"text" = ANY ((ARRAY['mmol_L'::character varying, 'g_L'::character varying])::"text"[]))),
    CONSTRAINT "responses_biological_assessment_glycemie_unit_check" CHECK ((("glycemie_unit")::"text" = ANY ((ARRAY['mmol_L'::character varying, 'g_L'::character varying])::"text"[]))),
    CONSTRAINT "responses_biological_assessment_hdl_unit_check" CHECK ((("hdl_unit")::"text" = ANY ((ARRAY['mmol_L'::character varying, 'g_L'::character varying])::"text"[]))),
    CONSTRAINT "responses_biological_assessment_hematies_check" CHECK ((("hematies" >= (1)::numeric) AND ("hematies" <= (8)::numeric))),
    CONSTRAINT "responses_biological_assessment_hematocrite_unit_check" CHECK ((("hematocrite_unit")::"text" = ANY ((ARRAY['percent'::character varying, 'L_L'::character varying])::"text"[]))),
    CONSTRAINT "responses_biological_assessment_hemoglobine_glyquee_check" CHECK ((("hemoglobine_glyquee" >= (0)::numeric) AND ("hemoglobine_glyquee" <= (50)::numeric))),
    CONSTRAINT "responses_biological_assessment_hemoglobine_unit_check" CHECK ((("hemoglobine_unit")::"text" = ANY ((ARRAY['g_dL'::character varying, 'mmol_L'::character varying])::"text"[]))),
    CONSTRAINT "responses_biological_assessment_ldl_unit_check" CHECK ((("ldl_unit")::"text" = ANY ((ARRAY['mmol_L'::character varying, 'g_L'::character varying])::"text"[]))),
    CONSTRAINT "responses_biological_assessment_leucocytes_check" CHECK ((("leucocytes" >= 0.5) AND ("leucocytes" <= (200)::numeric))),
    CONSTRAINT "responses_biological_assessment_lymphocytes_check" CHECK ((("lymphocytes" >= (0)::numeric) AND ("lymphocytes" <= (20)::numeric))),
    CONSTRAINT "responses_biological_assessment_monocytes_check" CHECK ((("monocytes" >= (0)::numeric) AND ("monocytes" <= (5)::numeric))),
    CONSTRAINT "responses_biological_assessment_neutrophiles_check" CHECK ((("neutrophiles" >= (0)::numeric) AND ("neutrophiles" <= (50)::numeric))),
    CONSTRAINT "responses_biological_assessment_outdoor_time_check" CHECK ((("outdoor_time")::"text" = ANY ((ARRAY['less_than_1h_per_week'::character varying, 'less_than_1h_per_day_several_hours_per_week'::character varying, 'at_least_1h_per_day'::character varying, 'more_than_4h_per_day'::character varying])::"text"[]))),
    CONSTRAINT "responses_biological_assessment_pal_check" CHECK ((("pal" >= 20) AND ("pal" <= 400))),
    CONSTRAINT "responses_biological_assessment_phosphore_check" CHECK ((("phosphore" >= 0.5) AND ("phosphore" <= 2.0))),
    CONSTRAINT "responses_biological_assessment_plaquettes_check" CHECK ((("plaquettes" >= 10) AND ("plaquettes" <= 1000))),
    CONSTRAINT "responses_biological_assessment_potassium_check" CHECK ((("potassium" >= 2.0) AND ("potassium" <= 7.0))),
    CONSTRAINT "responses_biological_assessment_prolactine_check" CHECK (("prolactine" > (0)::numeric)),
    CONSTRAINT "responses_biological_assessment_prolactine_unit_check" CHECK ((("prolactine_unit")::"text" = ANY ((ARRAY['mg_L'::character varying, 'uIU_mL'::character varying, 'ng_mL'::character varying, 'ug_L'::character varying])::"text"[]))),
    CONSTRAINT "responses_biological_assessment_protidemie_check" CHECK ((("protidemie" >= 50) AND ("protidemie" <= 90))),
    CONSTRAINT "responses_biological_assessment_skin_phototype_check" CHECK ((("skin_phototype")::"text" = ANY ((ARRAY['I'::character varying, 'II'::character varying, 'III'::character varying, 'IV'::character varying, 'V'::character varying, 'VI'::character varying])::"text"[]))),
    CONSTRAINT "responses_biological_assessment_sodium_check" CHECK ((("sodium" >= (120)::numeric) AND ("sodium" <= (170)::numeric))),
    CONSTRAINT "responses_biological_assessment_t3_libre_check" CHECK ((("t3_libre" >= (1)::numeric) AND ("t3_libre" <= (30)::numeric))),
    CONSTRAINT "responses_biological_assessment_t4_libre_check" CHECK ((("t4_libre" >= (5)::numeric) AND ("t4_libre" <= (50)::numeric))),
    CONSTRAINT "responses_biological_assessment_tcmh_unit_check" CHECK ((("tcmh_unit")::"text" = ANY ((ARRAY['pg'::character varying, 'percent'::character varying])::"text"[]))),
    CONSTRAINT "responses_biological_assessment_teralithe_type_check" CHECK ((("teralithe_type")::"text" = ANY ((ARRAY['250'::character varying, 'LP400'::character varying])::"text"[]))),
    CONSTRAINT "responses_biological_assessment_toxo_igg_value_check" CHECK (("toxo_igg_value" > (0)::numeric)),
    CONSTRAINT "responses_biological_assessment_triglycerides_check" CHECK ((("triglycerides" >= 0.2) AND ("triglycerides" <= (20)::numeric))),
    CONSTRAINT "responses_biological_assessment_tsh_unit_check" CHECK ((("tsh_unit")::"text" = ANY ((ARRAY['pmol_L'::character varying, 'uUI_mL'::character varying, 'mUI_L'::character varying])::"text"[]))),
    CONSTRAINT "responses_biological_assessment_uree_check" CHECK ((("uree" >= (1)::numeric) AND ("uree" <= (20)::numeric))),
    CONSTRAINT "responses_biological_assessment_vgm_check" CHECK ((("vgm" >= (50)::numeric) AND ("vgm" <= (130)::numeric))),
    CONSTRAINT "responses_biological_assessment_vitamin_d_level_check" CHECK ((("vitamin_d_level" >= (0)::numeric) AND ("vitamin_d_level" <= (300)::numeric))),
    CONSTRAINT "responses_biological_assessment_vitamin_d_product_name_check" CHECK ((("vitamin_d_product_name")::"text" = ANY ((ARRAY['sterogyl'::character varying, 'dedrogyl'::character varying, 'uvedose'::character varying, 'zymaduo'::character varying, 'uvesterol'::character varying, 'zymad'::character varying, 'autre'::character varying])::"text"[])))
);


ALTER TABLE "public"."bipolar_nurse_biological_assessment" OWNER TO "postgres";


COMMENT ON TABLE "public"."bipolar_nurse_biological_assessment" IS 'Comprehensive biological assessment including biochemistry, lipid panel, liver function, thyroid, complete blood count, HCG, prolactine, psychotropic dosages, vitamin D, and toxoplasmosis serology';



COMMENT ON COLUMN "public"."bipolar_nurse_biological_assessment"."clairance_creatinine" IS 'Creatinine clearance calculated automatically: Male: 1.23 × weight × (140 - age) / creatinine, Female: 1.04 × weight × (140 - age) / creatinine';



COMMENT ON COLUMN "public"."bipolar_nurse_biological_assessment"."bilirubine_totale_unit" IS 'Unit for Bilirubine totale: µmol/L, mmol/L, or mg/L';



COMMENT ON COLUMN "public"."bipolar_nurse_biological_assessment"."crp" IS 'C-Reactive Protein in mg/L (range: 0-50)';



COMMENT ON COLUMN "public"."bipolar_nurse_biological_assessment"."glycemie_a_jeun" IS 'Fasting blood glucose (Glycémie à jeûn). Value between 0 and 50. Unit specified in glycemie_a_jeun_unit';



COMMENT ON COLUMN "public"."bipolar_nurse_biological_assessment"."glycemie_unit" IS 'Unit for Glycémie à jeûn: mmol/L or g/L';



COMMENT ON COLUMN "public"."bipolar_nurse_biological_assessment"."hemoglobine_glyquee" IS 'Glycated hemoglobin (HbA1c) in % (range: 0-50). Shown when Glycémie à jeûn > 7 mmol/L or > 1.26 g/L';



COMMENT ON COLUMN "public"."bipolar_nurse_biological_assessment"."glycemie_a_jeun_unit" IS 'Unit for Glycémie à jeûn: mmol/L or g/L';



COMMENT ON COLUMN "public"."bipolar_nurse_biological_assessment"."rapport_total_hdl" IS 'Computed ratio: Cholestérol total / Cholestérol HDL';



COMMENT ON COLUMN "public"."bipolar_nurse_biological_assessment"."dosage_bhcg" IS 'Dosage des bHCG (UI) - For women of childbearing age only';



COMMENT ON COLUMN "public"."bipolar_nurse_biological_assessment"."vitamin_d_product_name" IS 'Vitamin D product name: Sterogyl, Dedrogyl, Uvedose, Zymaduo, Uvesterol, Zymad, or Autre';



COMMENT ON COLUMN "public"."bipolar_nurse_biological_assessment"."vitamin_d_supplementation_date" IS 'Date of vitamin D supplementation';



COMMENT ON COLUMN "public"."bipolar_nurse_biological_assessment"."vitamin_d_supplementation_mode" IS 'Mode of supplementation: Ampoule or Gouttes';



COMMENT ON COLUMN "public"."bipolar_nurse_biological_assessment"."vitamin_d_supplementation_dose" IS 'Dose of vitamin D supplementation';



CREATE TABLE IF NOT EXISTS "public"."bipolar_nurse_blood_pressure" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "bp_lying_systolic" integer,
    "bp_lying_diastolic" integer,
    "tension_lying" character varying(20),
    "heart_rate_lying" integer,
    "bp_standing_systolic" integer,
    "bp_standing_diastolic" integer,
    "tension_standing" character varying(20),
    "heart_rate_standing" integer,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "responses_blood_pressure_bp_lying_diastolic_check" CHECK ((("bp_lying_diastolic" > 0) AND ("bp_lying_diastolic" < 300))),
    CONSTRAINT "responses_blood_pressure_bp_lying_systolic_check" CHECK ((("bp_lying_systolic" > 0) AND ("bp_lying_systolic" < 300))),
    CONSTRAINT "responses_blood_pressure_bp_standing_diastolic_check" CHECK ((("bp_standing_diastolic" > 0) AND ("bp_standing_diastolic" < 300))),
    CONSTRAINT "responses_blood_pressure_bp_standing_systolic_check" CHECK ((("bp_standing_systolic" > 0) AND ("bp_standing_systolic" < 300))),
    CONSTRAINT "responses_blood_pressure_heart_rate_lying_check" CHECK ((("heart_rate_lying" > 0) AND ("heart_rate_lying" < 300))),
    CONSTRAINT "responses_blood_pressure_heart_rate_standing_check" CHECK ((("heart_rate_standing" > 0) AND ("heart_rate_standing" < 300)))
);


ALTER TABLE "public"."bipolar_nurse_blood_pressure" OWNER TO "postgres";


COMMENT ON TABLE "public"."bipolar_nurse_blood_pressure" IS 'Blood pressure and heart rate measurements (lying and standing positions)';



COMMENT ON COLUMN "public"."bipolar_nurse_blood_pressure"."tension_lying" IS 'Blood pressure lying down formatted as "systolic/diastolic"';



COMMENT ON COLUMN "public"."bipolar_nurse_blood_pressure"."tension_standing" IS 'Blood pressure standing formatted as "systolic/diastolic"';



CREATE TABLE IF NOT EXISTS "public"."bipolar_nurse_ecg" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "ecg_performed" "public"."yes_no_en" NOT NULL,
    "heart_rate" integer,
    "qt_measured" numeric(5,3),
    "rr_measured" numeric(5,3),
    "qtc_calculated" numeric(5,3),
    "ecg_sent_to_cardiologist" "public"."yes_no_en",
    "cardiologist_consultation_requested" "public"."yes_no_en",
    "cardiologist_name" "text",
    "cardiologist_city" "text",
    "interpretation" "text",
    "alert_message" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "responses_ecg_heart_rate_check" CHECK (("heart_rate" > 0)),
    CONSTRAINT "responses_ecg_qt_measured_check" CHECK (("qt_measured" > (0)::numeric)),
    CONSTRAINT "responses_ecg_qtc_calculated_check" CHECK (("qtc_calculated" > (0)::numeric)),
    CONSTRAINT "responses_ecg_rr_measured_check" CHECK (("rr_measured" > (0)::numeric))
);


ALTER TABLE "public"."bipolar_nurse_ecg" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_nurse_fagerstrom" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer NOT NULL,
    "q2" integer NOT NULL,
    "q3" integer NOT NULL,
    "q4" integer NOT NULL,
    "q5" integer NOT NULL,
    "q6" integer NOT NULL,
    "dependence_level" "text",
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "total_score" integer,
    CONSTRAINT "responses_fagerstrom_q1_check" CHECK ((("q1" >= 0) AND ("q1" <= 3))),
    CONSTRAINT "responses_fagerstrom_q2_check" CHECK ((("q2" >= 0) AND ("q2" <= 1))),
    CONSTRAINT "responses_fagerstrom_q3_check" CHECK ((("q3" >= 0) AND ("q3" <= 1))),
    CONSTRAINT "responses_fagerstrom_q4_check" CHECK ((("q4" >= 0) AND ("q4" <= 3))),
    CONSTRAINT "responses_fagerstrom_q5_check" CHECK ((("q5" >= 0) AND ("q5" <= 1))),
    CONSTRAINT "responses_fagerstrom_q6_check" CHECK ((("q6" >= 0) AND ("q6" <= 1)))
);


ALTER TABLE "public"."bipolar_nurse_fagerstrom" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_nurse_physical_params" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "height_cm" integer,
    "weight_kg" numeric(5,2),
    "abdominal_circumference_cm" integer,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "pregnant" character varying(10),
    "bmi" numeric,
    CONSTRAINT "responses_physical_params_abdominal_circumference_cm_check" CHECK ((("abdominal_circumference_cm" > 10) AND ("abdominal_circumference_cm" < 200))),
    CONSTRAINT "responses_physical_params_height_cm_check" CHECK ((("height_cm" > 0) AND ("height_cm" < 300))),
    CONSTRAINT "responses_physical_params_pregnant_check" CHECK ((("pregnant")::"text" = ANY ((ARRAY['Oui'::character varying, 'Non'::character varying])::"text"[]))),
    CONSTRAINT "responses_physical_params_weight_kg_check" CHECK ((("weight_kg" > (0)::numeric) AND ("weight_kg" < (500)::numeric)))
);


ALTER TABLE "public"."bipolar_nurse_physical_params" OWNER TO "postgres";


COMMENT ON TABLE "public"."bipolar_nurse_physical_params" IS 'Physical parameters including height, weight, BMI, abdominal circumference, blood pressure (lying and standing), and heart rate';



COMMENT ON COLUMN "public"."bipolar_nurse_physical_params"."pregnant" IS 'Pregnancy status - only applicable for female patients';



CREATE TABLE IF NOT EXISTS "public"."bipolar_nurse_sleep_apnea" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "diagnosed_sleep_apnea" character varying(10) NOT NULL,
    "has_cpap_device" "public"."yes_no_fr",
    "snoring" "public"."yes_no_fr",
    "tiredness" "public"."yes_no_fr",
    "observed_apnea" "public"."yes_no_fr",
    "hypertension" "public"."yes_no_fr",
    "bmi_over_35" "public"."yes_no_fr",
    "age_over_50" "public"."yes_no_fr",
    "large_neck" "public"."yes_no_fr",
    "male_gender" "public"."yes_no_fr",
    "stop_bang_score" integer,
    "risk_level" character varying(50),
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "responses_sleep_apnea_diagnosed_sleep_apnea_check" CHECK ((("diagnosed_sleep_apnea")::"text" = ANY ((ARRAY['yes'::character varying, 'no'::character varying, 'unknown'::character varying])::"text"[])))
);


ALTER TABLE "public"."bipolar_nurse_sleep_apnea" OWNER TO "postgres";


COMMENT ON TABLE "public"."bipolar_nurse_sleep_apnea" IS 'Sleep apnea screening questionnaire using STOP-Bang criteria';



COMMENT ON COLUMN "public"."bipolar_nurse_sleep_apnea"."stop_bang_score" IS 'STOP-Bang total score (0-8): sum of yes answers to the 8 screening questions';



COMMENT ON COLUMN "public"."bipolar_nurse_sleep_apnea"."risk_level" IS 'Risk level: low_risk (0-2), intermediate_risk (3-4), high_risk (5-8)';



CREATE TABLE IF NOT EXISTS "public"."bipolar_nurse_tobacco" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "smoking_status" character varying(50) NOT NULL,
    "pack_years" integer,
    "smoking_start_age" character varying(10),
    "smoking_end_age" character varying(10),
    "has_substitution" "public"."yes_no_fr",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "substitution_methods" "text"[],
    "pack_years_ex" integer,
    "smoking_start_age_ex" character varying(10),
    "has_substitution_ex" character varying(10),
    "substitution_methods_ex" "text"[],
    CONSTRAINT "responses_tobacco_pack_years_check" CHECK (("pack_years" > 0)),
    CONSTRAINT "responses_tobacco_smoking_end_age_check" CHECK ((("smoking_end_age")::"text" = ANY ((ARRAY['unknown'::character varying, '<5'::character varying, '5'::character varying, '6'::character varying, '7'::character varying, '8'::character varying, '9'::character varying, '10'::character varying, '11'::character varying, '12'::character varying, '13'::character varying, '14'::character varying, '15'::character varying, '16'::character varying, '17'::character varying, '18'::character varying, '19'::character varying, '20'::character varying, '21'::character varying, '22'::character varying, '23'::character varying, '24'::character varying, '25'::character varying, '26'::character varying, '27'::character varying, '28'::character varying, '29'::character varying, '30'::character varying, '31'::character varying, '32'::character varying, '33'::character varying, '34'::character varying, '35'::character varying, '36'::character varying, '37'::character varying, '38'::character varying, '39'::character varying, '40'::character varying, '41'::character varying, '42'::character varying, '43'::character varying, '44'::character varying, '45'::character varying, '46'::character varying, '47'::character varying, '48'::character varying, '49'::character varying, '50'::character varying, '51'::character varying, '52'::character varying, '53'::character varying, '54'::character varying, '55'::character varying, '56'::character varying, '57'::character varying, '58'::character varying, '59'::character varying, '60'::character varying, '61'::character varying, '62'::character varying, '63'::character varying, '64'::character varying, '65'::character varying, '66'::character varying, '67'::character varying, '68'::character varying, '69'::character varying, '70'::character varying, '71'::character varying, '72'::character varying, '73'::character varying, '74'::character varying, '75'::character varying, '76'::character varying, '77'::character varying, '78'::character varying, '79'::character varying, '80'::character varying, '81'::character varying, '82'::character varying, '83'::character varying, '84'::character varying, '85'::character varying, '86'::character varying, '87'::character varying, '88'::character varying, '89'::character varying, '>89'::character varying])::"text"[]))),
    CONSTRAINT "responses_tobacco_smoking_start_age_check" CHECK ((("smoking_start_age")::"text" = ANY ((ARRAY['unknown'::character varying, '<5'::character varying, '5'::character varying, '6'::character varying, '7'::character varying, '8'::character varying, '9'::character varying, '10'::character varying, '11'::character varying, '12'::character varying, '13'::character varying, '14'::character varying, '15'::character varying, '16'::character varying, '17'::character varying, '18'::character varying, '19'::character varying, '20'::character varying, '21'::character varying, '22'::character varying, '23'::character varying, '24'::character varying, '25'::character varying, '26'::character varying, '27'::character varying, '28'::character varying, '29'::character varying, '30'::character varying, '31'::character varying, '32'::character varying, '33'::character varying, '34'::character varying, '35'::character varying, '36'::character varying, '37'::character varying, '38'::character varying, '39'::character varying, '40'::character varying, '41'::character varying, '42'::character varying, '43'::character varying, '44'::character varying, '45'::character varying, '46'::character varying, '47'::character varying, '48'::character varying, '49'::character varying, '50'::character varying, '51'::character varying, '52'::character varying, '53'::character varying, '54'::character varying, '55'::character varying, '56'::character varying, '57'::character varying, '58'::character varying, '59'::character varying, '60'::character varying, '61'::character varying, '62'::character varying, '63'::character varying, '64'::character varying, '65'::character varying, '66'::character varying, '67'::character varying, '68'::character varying, '69'::character varying, '70'::character varying, '71'::character varying, '72'::character varying, '73'::character varying, '74'::character varying, '75'::character varying, '76'::character varying, '77'::character varying, '78'::character varying, '79'::character varying, '80'::character varying, '81'::character varying, '82'::character varying, '83'::character varying, '84'::character varying, '85'::character varying, '86'::character varying, '87'::character varying, '88'::character varying, '89'::character varying, '>89'::character varying])::"text"[]))),
    CONSTRAINT "responses_tobacco_smoking_status_check" CHECK ((("smoking_status")::"text" = ANY ((ARRAY['non_smoker'::character varying, 'current_smoker'::character varying, 'ex_smoker'::character varying, 'unknown'::character varying])::"text"[])))
);


ALTER TABLE "public"."bipolar_nurse_tobacco" OWNER TO "postgres";


COMMENT ON COLUMN "public"."bipolar_nurse_tobacco"."substitution_methods" IS 'Array of substitution method codes: e_cigarette, champix, patch, nicorette';



CREATE TABLE IF NOT EXISTS "public"."bipolar_orientation" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "trouble_bipolaire_ou_suspicion" character varying(10),
    "etat_thymique_compatible" character varying(10),
    "prise_en_charge_100_ou_accord" character varying(10),
    "accord_evaluation_centre_expert" character varying(10),
    "accord_transmission_cr" character varying(10),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_orientation" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_patho_allergique" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q0_presence" "text",
    "q1_pathologies_selection" "text"[],
    "q2_1_asthme_treated" "text",
    "q2_2_asthme_balanced" "text",
    "q2_3_asthme_start_date" "date",
    "q3_1_allergie_treated" "text",
    "q3_2_allergie_balanced" "text",
    "q3_3_allergie_start_date" "date",
    "q4_1_lupus_treated" "text",
    "q4_2_lupus_balanced" "text",
    "q4_3_lupus_start_date" "date",
    "q5_1_polyarthrite_treated" "text",
    "q5_2_polyarthrite_balanced" "text",
    "q5_3_polyarthrite_start_date" "date",
    "q6_1_autoimmune_start_date" "date",
    "q6_2_autoimmune_type" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_patho_allergique" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_patho_cardio" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_hypertension" character varying(10),
    "q1_1_hypertension_date" "date",
    "q1_2_hypertension_treated" character varying(3),
    "q1_3_hypertension_balanced" character varying(3),
    "q2_coronary" character varying(10),
    "q2_1_coronary_date" "date",
    "q2_2_coronary_treated" character varying(3),
    "q2_3_coronary_balanced" character varying(3),
    "q3_infarctus" character varying(10),
    "q3_1_infarctus_date" "date",
    "q4_rythme" character varying(10),
    "q4_1_rythme_date" "date",
    "q4_2_rythme_treated" character varying(3),
    "q4_3_rythme_balanced" character varying(3),
    "q5_autre" character varying(10),
    "q5_1_autre_specify" "text",
    "q5_2_autre_date" "date",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_patho_cardio" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_patho_dermato" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_psoriasis" character varying(10),
    "q1_1_psoriasis_date" "date",
    "q1_2_psoriasis_treated" character varying(3),
    "q1_3_psoriasis_balanced" character varying(3),
    "q1_4_psoriasis_lithium_effect" character varying(10),
    "q1_5_psoriasis_triggered_lithium" character varying(3),
    "q1_6_psoriasis_aggravated_lithium" character varying(3),
    "q2_acne" character varying(10),
    "q2_1_acne_date" "date",
    "q2_2_acne_treated" character varying(3),
    "q2_3_acne_balanced" character varying(3),
    "q2_4_acne_lithium_effect" character varying(10),
    "q2_5_acne_triggered_lithium" character varying(3),
    "q2_6_acne_aggravated_lithium" character varying(3),
    "q3_eczema" character varying(10),
    "q3_1_eczema_date" "date",
    "q3_2_eczema_treated" character varying(3),
    "q3_3_eczema_balanced" character varying(3),
    "q4_toxidermie" character varying(10),
    "q4_1_toxidermie_date" "date",
    "q4_2_toxidermie_type" character varying(30),
    "q4_3_toxidermie_medication" "jsonb",
    "q5_hair_loss" character varying(10),
    "q5_1_hair_loss_date" "date",
    "q5_2_hair_loss_treated" character varying(3),
    "q5_3_hair_loss_balanced" character varying(3),
    "q5_4_hair_loss_depakine" character varying(10),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "q5_5_hair_loss_triggered_valproate" "text",
    "q5_6_hair_loss_aggravated_valproate" "text"
);


ALTER TABLE "public"."bipolar_patho_dermato" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_patho_endoc" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_diabete" character varying(10),
    "q1_1_diabete_date" "date",
    "q1_2_diabete_treated" character varying(3),
    "q1_3_diabete_balanced" character varying(3),
    "q1_4_diabete_type" character varying(10),
    "q2_dysthyroidie" character varying(10),
    "q2_1_dysthyroidie_type" character varying(15),
    "q2_2_dysthyroidie_origin" character varying(20),
    "q2_3_dysthyroidie_treated" character varying(3),
    "q2_4_dysthyroidie_balanced" character varying(3),
    "q3_dyslipidemie" character varying(10),
    "q3_1_dyslipidemie_date" "date",
    "q3_2_dyslipidemie_treated" character varying(3),
    "q3_3_dyslipidemie_balanced" character varying(3),
    "q3_4_dyslipidemie_type" character varying(20),
    "q4_autres" character varying(10),
    "q4_1_autres_date" "date",
    "q4_2_autres_specify" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_patho_endoc" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_patho_hepato_gastro" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_1_mici_presence" "text",
    "q1_2_mici_start_date" "date",
    "q1_3_mici_treated" "text",
    "q1_4_mici_balanced" "text",
    "q1_5_mici_type" "text",
    "q2_1_cirrhosis_presence" "text",
    "q2_2_cirrhosis_start_date" "date",
    "q2_3_cirrhosis_treated" "text",
    "q2_4_cirrhosis_balanced" "text",
    "q3_1_ulcer_presence" "text",
    "q3_2_ulcer_start_date" "date",
    "q3_3_ulcer_treated" "text",
    "q3_4_ulcer_balanced" "text",
    "q4_1_hepatitis_presence" "text",
    "q4_2_hepatitis_start_date" "date",
    "q4_3_hepatitis_treatment_type" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_patho_hepato_gastro" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_patho_neuro" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_migraine" character varying(10),
    "q1_1_migraine_date" "date",
    "q1_2_migraine_treated" character varying(3),
    "q1_3_migraine_balanced" character varying(3),
    "q2_sclerose" character varying(10),
    "q2_1_sclerose_date" "date",
    "q2_2_sclerose_treated" character varying(3),
    "q2_3_sclerose_balanced" character varying(3),
    "q3_epilepsie" character varying(10),
    "q3_1_epilepsie_date" "date",
    "q3_2_epilepsie_treated" character varying(3),
    "q3_3_epilepsie_balanced" character varying(3),
    "q4_meningite" character varying(10),
    "q4_1_meningite_date" "date",
    "q5_trauma_cranien" character varying(10),
    "q5_1_trauma_cranien_date" "date",
    "q6_avc" character varying(10),
    "q6_1_avc_date" "date",
    "q7_autre" character varying(10),
    "q7_1_autre_date" "date",
    "q7_2_autre_specify" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_patho_neuro" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_patho_urinaire" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_nephropathy" character varying(10),
    "q1_1_nephropathy_date" "date",
    "q1_2_nephropathy_treated" character varying(3),
    "q1_3_nephropathy_balanced" character varying(3),
    "q1_4_nephropathy_lithium_link" character varying(10),
    "q2_prostatic_adenoma" character varying(10),
    "q2_1_prostatic_adenoma_date" "date",
    "q2_2_prostatic_adenoma_treated" character varying(3),
    "q2_3_prostatic_adenoma_balanced" character varying(3),
    "q3_urinary_retention" character varying(10),
    "q3_1_urinary_retention_date" "date",
    "q3_2_urinary_retention_treatment_triggered" character varying(3),
    "q3_3_urinary_retention_treatment_type" "jsonb",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_patho_urinaire" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_perinatalite" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_mother_age" integer,
    "q2_father_age" integer,
    "q3_birth_condition" character varying(20),
    "q4_gestational_age" integer,
    "q5_birth_type" character varying(20),
    "q6_birth_weight" integer,
    "q7_birth_length" numeric(4,1),
    "q8_head_circumference" numeric(4,1),
    "q9_apgar_1min" integer,
    "q10_apgar_5min" integer,
    "q11_neonatal_hospitalization" character varying(10),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "q12_birth_environment" "text",
    "q13_obstetric_complications" "jsonb",
    "q14_maternal_viral_infection" "jsonb",
    "q15_maternal_pregnancy_events" "jsonb"
);


ALTER TABLE "public"."bipolar_perinatalite" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_prise_m" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "taking_medication" character varying(10),
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "q13" integer,
    "q14" integer,
    "q15" integer,
    "q16" integer,
    "q17" integer,
    "q18" integer,
    "q19" integer,
    "q20" integer,
    "q21" integer,
    "q22" integer,
    "q23" integer,
    "q24" integer,
    "q25" integer,
    "q26" integer,
    "q27" integer,
    "q28" integer,
    "q29" integer,
    "q30" integer,
    "q31" integer,
    "total_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "cardiac_score" integer,
    "gastro_score" integer,
    "items_scored" integer,
    "neuro_score" integer,
    "other_score" integer,
    "sexual_score" integer,
    "skin_score" integer,
    "sleep_score" integer,
    "urogenital_score" integer,
    "vision_hearing_score" integer,
    "tolerable_count" integer,
    "painful_count" integer
);


ALTER TABLE "public"."bipolar_prise_m" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_psqi" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_bedtime" "text",
    "q2_minutes_to_sleep" integer,
    "q3_waketime" "text",
    "q4_hours_sleep" "text",
    "q5a" integer,
    "q5b" integer,
    "q5c" integer,
    "q5d" integer,
    "q5e" integer,
    "q5f" integer,
    "q5g" integer,
    "q5h" integer,
    "q5i" integer,
    "q5j" integer,
    "q5j_text" "text",
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "c1_subjective_quality" integer,
    "c2_latency" integer,
    "c3_duration" integer,
    "c4_efficiency" integer,
    "c5_disturbances" integer,
    "c6_medication" integer,
    "c7_daytime_dysfunction" integer,
    "total_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "sleep_efficiency_pct" numeric,
    "time_in_bed_hours" numeric
);


ALTER TABLE "public"."bipolar_psqi" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_psychotropes_lifetime" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "collection_date" "date",
    "antidepresseur_status" "text",
    "antidepresseur_start_date" "date",
    "antidepresseur_months" integer,
    "neuroleptique_status" "text",
    "neuroleptique_start_date" "date",
    "neuroleptique_months" integer,
    "antipsychotique_status" "text",
    "antipsychotique_start_date" "date",
    "antipsychotique_months" integer,
    "benzodiazepine_status" "text",
    "benzodiazepine_start_date" "date",
    "benzodiazepine_months" integer,
    "lithium_status" "text",
    "lithium_start_date" "date",
    "lithium_months" integer,
    "thymoregulateur_status" "text",
    "thymoregulateur_start_date" "date",
    "thymoregulateur_months" integer,
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "bipolar_psychotropes_lifetime_antidepresseur_status_check" CHECK (("antidepresseur_status" = ANY (ARRAY['yes'::"text", 'no'::"text", 'unknown'::"text"]))),
    CONSTRAINT "bipolar_psychotropes_lifetime_antipsychotique_status_check" CHECK (("antipsychotique_status" = ANY (ARRAY['yes'::"text", 'no'::"text", 'unknown'::"text"]))),
    CONSTRAINT "bipolar_psychotropes_lifetime_benzodiazepine_status_check" CHECK (("benzodiazepine_status" = ANY (ARRAY['yes'::"text", 'no'::"text", 'unknown'::"text"]))),
    CONSTRAINT "bipolar_psychotropes_lifetime_lithium_status_check" CHECK (("lithium_status" = ANY (ARRAY['yes'::"text", 'no'::"text", 'unknown'::"text"]))),
    CONSTRAINT "bipolar_psychotropes_lifetime_neuroleptique_status_check" CHECK (("neuroleptique_status" = ANY (ARRAY['yes'::"text", 'no'::"text", 'unknown'::"text"]))),
    CONSTRAINT "bipolar_psychotropes_lifetime_thymoregulateur_status_check" CHECK (("thymoregulateur_status" = ANY (ARRAY['yes'::"text", 'no'::"text", 'unknown'::"text"])))
);


ALTER TABLE "public"."bipolar_psychotropes_lifetime" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_qids_sr16" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "q13" integer,
    "q14" integer,
    "q15" integer,
    "q16" integer,
    "total_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "bipolar_qids_sr16_q10_check" CHECK ((("q10" >= 0) AND ("q10" <= 3))),
    CONSTRAINT "bipolar_qids_sr16_q11_check" CHECK ((("q11" >= 0) AND ("q11" <= 3))),
    CONSTRAINT "bipolar_qids_sr16_q12_check" CHECK ((("q12" >= 0) AND ("q12" <= 3))),
    CONSTRAINT "bipolar_qids_sr16_q13_check" CHECK ((("q13" >= 0) AND ("q13" <= 3))),
    CONSTRAINT "bipolar_qids_sr16_q14_check" CHECK ((("q14" >= 0) AND ("q14" <= 3))),
    CONSTRAINT "bipolar_qids_sr16_q15_check" CHECK ((("q15" >= 0) AND ("q15" <= 3))),
    CONSTRAINT "bipolar_qids_sr16_q16_check" CHECK ((("q16" >= 0) AND ("q16" <= 3))),
    CONSTRAINT "bipolar_qids_sr16_q1_check" CHECK ((("q1" >= 0) AND ("q1" <= 3))),
    CONSTRAINT "bipolar_qids_sr16_q2_check" CHECK ((("q2" >= 0) AND ("q2" <= 3))),
    CONSTRAINT "bipolar_qids_sr16_q3_check" CHECK ((("q3" >= 0) AND ("q3" <= 3))),
    CONSTRAINT "bipolar_qids_sr16_q4_check" CHECK ((("q4" >= 0) AND ("q4" <= 3))),
    CONSTRAINT "bipolar_qids_sr16_q5_check" CHECK ((("q5" >= 0) AND ("q5" <= 3))),
    CONSTRAINT "bipolar_qids_sr16_q6_check" CHECK ((("q6" >= 0) AND ("q6" <= 3))),
    CONSTRAINT "bipolar_qids_sr16_q7_check" CHECK ((("q7" >= 0) AND ("q7" <= 3))),
    CONSTRAINT "bipolar_qids_sr16_q8_check" CHECK ((("q8" >= 0) AND ("q8" <= 3))),
    CONSTRAINT "bipolar_qids_sr16_q9_check" CHECK ((("q9" >= 0) AND ("q9" <= 3)))
);


ALTER TABLE "public"."bipolar_qids_sr16" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_scip" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "scipv01a" numeric(5,2),
    "scipv02a" numeric(5,2),
    "scipv03a" numeric(5,2),
    "scipv04a" numeric(5,2),
    "scipv05a" numeric(5,2),
    "scipv01b" numeric(6,2),
    "scipv02b" numeric(6,2),
    "scipv03b" numeric(6,2),
    "scipv04b" numeric(6,2),
    "scipv05b" numeric(6,2),
    "scip_version" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "version" "text"
);


ALTER TABLE "public"."bipolar_scip" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_sis" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "sis_01" integer,
    "sis_02" integer,
    "sis_03" integer,
    "sis_04" integer,
    "sis_05" integer,
    "sis_06" integer,
    "sis_07" integer,
    "sis_08" integer,
    "sis_09" integer,
    "sis_10" integer,
    "sis_11" integer,
    "sis_12" integer,
    "sis_13" integer,
    "sis_14" integer,
    "sis_15" integer,
    "total_score" integer,
    "circumstances_subscore" integer,
    "conception_subscore" integer,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_sis" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_social" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "responses" "jsonb",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "active_work_duration" "text",
    "cumulative_leave_weeks" integer,
    "current_work_leave" "text",
    "debt_level" "text",
    "education" "text",
    "first_job_age" "text",
    "household_size" integer,
    "housing_type" "text",
    "is_full_time" "text",
    "last_job_end_date" "date",
    "living_mode" "text",
    "long_term_leave" "text",
    "longest_work_period" integer,
    "main_companion" "text",
    "main_income_source" "text",
    "marital_status" "text",
    "past_year_work_leave" "text",
    "professional_class_active" "text",
    "professional_class_unemployed" "text",
    "professional_status" "text",
    "protection_measures" "text",
    "total_work_duration" integer
);


ALTER TABLE "public"."bipolar_social" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_stai_ya" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "q13" integer,
    "q14" integer,
    "q15" integer,
    "q16" integer,
    "q17" integer,
    "q18" integer,
    "q19" integer,
    "q20" integer,
    "note_t" numeric,
    "total_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "anxiety_level" "text"
);


ALTER TABLE "public"."bipolar_stai_ya" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_stroop" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "patient_age" integer,
    "stroop_w_tot" integer,
    "stroop_c_tot" integer,
    "stroop_cw_tot" integer,
    "stroop_w_tot_c" integer,
    "stroop_c_tot_c" integer,
    "stroop_cw_tot_c" integer,
    "stroop_interf" numeric(6,2),
    "stroop_w_note_t" integer,
    "stroop_c_note_t" integer,
    "stroop_cw_note_t" integer,
    "stroop_interf_note_t" integer,
    "stroop_w_note_t_corrigee" numeric(4,2),
    "stroop_c_note_t_corrigee" numeric(4,2),
    "stroop_cw_note_t_corrigee" numeric(4,2),
    "stroop_interf_note_tz" numeric(4,2),
    "stroop_w_err" integer,
    "stroop_c_err" integer,
    "stroop_cw_err" integer,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "questionnaire_version" "text",
    "stroop_c_cor" integer,
    "stroop_cw_cor" integer,
    "stroop_w_cor" integer,
    "years_of_education" integer,
    "patient_gender" "text"
);


ALTER TABLE "public"."bipolar_stroop" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_suicide_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_first_attempt_date" "date",
    "q2_attempt_count" integer,
    "q3_violent_attempts" character varying(10),
    "q3_1_violent_count" integer,
    "q4_serious_attempts" character varying(10),
    "q4_1_serious_count" integer,
    "q5_self_harm" integer,
    "q6_interrupted" integer,
    "q6_1_interrupted_count" integer,
    "q7_aborted" integer,
    "q7_1_aborted_count" integer,
    "q8_preparations" integer,
    "q9_recent_severity" integer,
    "q10_recent_date" "date",
    "q11_lethal_severity" integer,
    "q12_lethal_date" "date",
    "q13_first_severity" integer,
    "q13_1_first_lethality" integer,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "q2_1_attempt_count_12m" integer
);


ALTER TABLE "public"."bipolar_suicide_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_test_commissions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "patient_age" integer,
    "nsc" integer,
    "com01" integer,
    "com02" integer,
    "com03" integer,
    "com04" integer,
    "com05" "text",
    "com01s1" "text",
    "com01s2" numeric(6,2),
    "com02s1" "text",
    "com02s2" numeric(6,2),
    "com03s1" "text",
    "com03s2" numeric(6,2),
    "com04s1" "text",
    "com04s2" numeric(6,2),
    "com04s3" integer,
    "com04s4" "text",
    "com04s5" numeric(6,2),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bipolar_test_commissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_tmt" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "patient_age" integer,
    "years_of_education" integer,
    "tmta_tps" integer,
    "tmta_err" integer,
    "tmta_cor" integer,
    "tmtb_tps" integer,
    "tmtb_err" integer,
    "tmtb_cor" integer,
    "tmtb_err_persev" integer,
    "tmta_errtot" integer,
    "tmta_tps_z" numeric(5,2),
    "tmta_tps_pc" "text",
    "tmta_errtot_z" numeric(5,2),
    "tmtb_errtot" integer,
    "tmtb_tps_z" numeric(5,2),
    "tmtb_tps_pc" "text",
    "tmtb_errtot_z" numeric(5,2),
    "tmtb_err_persev_z" numeric(5,2),
    "tmt_b_a_tps" integer,
    "tmt_b_a_tps_z" numeric(5,2),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "questionnaire_version" "text",
    "tmt_b_a_err" integer,
    "tmt_b_a_err_pc" "text",
    "tmt_b_a_err_z" numeric,
    "tmt_b_a_tps_pc" "text",
    "tmta_errtot_pc" "text",
    "tmtb_err_persev_pc" "text",
    "tmtb_errtot_pc" "text"
);


ALTER TABLE "public"."bipolar_tmt" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_wais3_code_symboles" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "patient_age" integer,
    "total_correct" integer,
    "total_errors" integer,
    "raw_score" integer,
    "standardized_score" integer,
    "z_score" numeric(5,2),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "wais_cod_brut" integer,
    "wais_cod_cr" numeric,
    "wais_cod_err" integer,
    "wais_cod_std" integer,
    "wais_cod_tot" integer,
    "wais_ivt" integer,
    "wais_ivt_95" "text",
    "wais_ivt_rang" "text",
    "wais_somme_ivt" integer,
    "wais_symb_brut" integer,
    "wais_symb_cr" numeric,
    "wais_symb_err" integer,
    "wais_symb_std" integer,
    "wais_symb_tot" integer,
    "years_of_education" integer,
    "patient_gender" "text"
);


ALTER TABLE "public"."bipolar_wais3_code_symboles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_wais3_cpt2" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "d_prime" numeric(6,2),
    "d_prime_interp" "text",
    "omissions" numeric(6,2),
    "omissions_interp" "text",
    "commissions" numeric(6,2),
    "commissions_interp" "text",
    "perseverations" numeric(6,2),
    "perseverations_interp" "text",
    "hrt" numeric(8,2),
    "hrt_interp" "text",
    "hrt_sd" numeric(8,2),
    "hrt_sd_interp" "text",
    "variability" numeric(8,2),
    "variability_interp" "text",
    "hrt_block_change" numeric(8,2),
    "hrt_block_change_interp" "text",
    "hrt_isi_change" numeric(8,2),
    "hrt_isi_change_interp" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "cpt2_comissions_guideline" "text",
    "cpt2_comissions_percentile" numeric,
    "cpt2_comissions_pourcentage" numeric,
    "cpt2_comissions_tscore" integer,
    "cpt2_comissions_value" integer,
    "cpt2_detectability_guideline" "text",
    "cpt2_detectability_percentile" numeric,
    "cpt2_detectability_tscore" integer,
    "cpt2_detectability_value" numeric,
    "cpt2_hitrt_guideline" "text",
    "cpt2_hitrt_percentile" numeric,
    "cpt2_hitrt_tscore" integer,
    "cpt2_hitrt_value" numeric,
    "cpt2_hitrtblockchange_guideline" "text",
    "cpt2_hitrtblockchange_percentile" numeric,
    "cpt2_hitrtblockchange_tscore" integer,
    "cpt2_hitrtblockchange_value" numeric,
    "cpt2_hitrtisichange_guideline" "text",
    "cpt2_hitrtisichange_percentile" numeric,
    "cpt2_hitrtisichange_tscore" integer,
    "cpt2_hitrtisichange_value" numeric,
    "cpt2_hitrtstder_guideline" "text",
    "cpt2_hitrtstder_percentile" numeric,
    "cpt2_hitrtstder_tscore" integer,
    "cpt2_hitrtstder_value" numeric,
    "cpt2_hitseblockchange_guideline" "text",
    "cpt2_hitseblockchange_percentile" numeric,
    "cpt2_hitseblockchange_tscore" integer,
    "cpt2_hitseblockchange_value" numeric,
    "cpt2_hitseisichange_guideline" "text",
    "cpt2_hitseisichange_percentile" numeric,
    "cpt2_hitseisichange_tscore" integer,
    "cpt2_hitseisichange_value" numeric,
    "cpt2_omissions_guideline" "text",
    "cpt2_omissions_percentile" numeric,
    "cpt2_omissions_pourcentage" numeric,
    "cpt2_omissions_tscore" integer,
    "cpt2_omissions_value" integer,
    "cpt2_perseverations_guideline" "text",
    "cpt2_perseverations_percentile" numeric,
    "cpt2_perseverations_pourcentage" numeric,
    "cpt2_perseverations_tscore" integer,
    "cpt2_perseverations_value" integer,
    "cpt2_responsestyle_guideline" "text",
    "cpt2_responsestyle_percentile" numeric,
    "cpt2_responsestyle_tscore" integer,
    "cpt2_responsestyle_value" numeric,
    "cpt2_variability_guideline" "text",
    "cpt2_variability_percentile" numeric,
    "cpt2_variability_tscore" integer,
    "cpt2_variability_value" numeric,
    "years_of_education" integer,
    "patient_gender" "text"
);


ALTER TABLE "public"."bipolar_wais3_cpt2" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_wais3_criteria" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "collection_date" "date",
    "age" integer,
    "laterality" character varying(20),
    "native_french_speaker" integer,
    "time_since_last_eval" character varying(20),
    "patient_euthymic" integer,
    "no_episode_3months" integer,
    "socio_prof_data_present" integer,
    "years_of_education" integer,
    "no_visual_impairment" integer,
    "no_hearing_impairment" integer,
    "no_ect_past_year" integer,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "accepted_for_neuropsy_evaluation" boolean,
    "assessment_time" "text",
    "patient_gender" "text"
);


ALTER TABLE "public"."bipolar_wais3_criteria" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_wais3_digit_span" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "patient_age" integer,
    "forward_raw" integer,
    "forward_span" integer,
    "forward_std" integer,
    "forward_z" numeric(5,2),
    "backward_raw" integer,
    "backward_span" integer,
    "backward_std" integer,
    "backward_z" numeric(5,2),
    "total_raw" integer,
    "total_std" integer,
    "percentile_rank" numeric(5,2),
    "total_z" numeric(5,2),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "education_level" "text",
    "mcod_1a" integer,
    "mcod_1b" integer,
    "mcod_2a" integer,
    "mcod_2b" integer,
    "mcod_3a" integer,
    "mcod_3b" integer,
    "mcod_4a" integer,
    "mcod_4b" integer,
    "mcod_5a" integer,
    "mcod_5b" integer,
    "mcod_6a" integer,
    "mcod_6b" integer,
    "mcod_7a" integer,
    "mcod_7b" integer,
    "mcod_8a" integer,
    "mcod_8b" integer,
    "mcoi_1a" integer,
    "mcoi_1b" integer,
    "mcoi_2a" integer,
    "mcoi_2b" integer,
    "mcoi_3a" integer,
    "mcoi_3b" integer,
    "mcoi_4a" integer,
    "mcoi_4b" integer,
    "mcoi_5a" integer,
    "mcoi_5b" integer,
    "mcoi_6a" integer,
    "mcoi_6b" integer,
    "mcoi_7a" integer,
    "mcoi_7b" integer,
    "wais3_mcod_1" integer,
    "wais3_mcod_2" integer,
    "wais3_mcod_3" integer,
    "wais3_mcod_4" integer,
    "wais3_mcod_5" integer,
    "wais3_mcod_6" integer,
    "wais3_mcod_7" integer,
    "wais3_mcod_8" integer,
    "wais3_mcoi_1" integer,
    "wais3_mcoi_2" integer,
    "wais3_mcoi_3" integer,
    "wais3_mcoi_4" integer,
    "wais3_mcoi_5" integer,
    "wais3_mcoi_6" integer,
    "wais3_mcoi_7" integer,
    "wais_mc_cr" numeric(5,2),
    "wais_mc_emp" numeric(5,2),
    "wais_mc_end" numeric(5,2),
    "wais_mc_end_z" numeric(5,2),
    "wais_mc_env" numeric(5,2),
    "wais_mc_env_z" numeric(5,2),
    "wais_mc_std" integer,
    "wais_mc_tot" integer,
    "wais_mcod_tot" integer,
    "wais_mcoi_tot" integer,
    "years_of_education" integer,
    "patient_gender" "text"
);


ALTER TABLE "public"."bipolar_wais3_digit_span" OWNER TO "postgres";


COMMENT ON COLUMN "public"."bipolar_wais3_digit_span"."wais_mc_emp" IS 'Empan Difference (Span Difference: end - env) - Can be decimal value';



COMMENT ON COLUMN "public"."bipolar_wais3_digit_span"."wais_mc_end" IS 'Empan Endroit (Forward Span) - Can be decimal value';



COMMENT ON COLUMN "public"."bipolar_wais3_digit_span"."wais_mc_env" IS 'Empan Envers (Backward Span) - Can be decimal value';



CREATE TABLE IF NOT EXISTS "public"."bipolar_wais3_learning" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "patient_age" integer,
    "years_of_education" integer,
    "item_01" integer,
    "item_02" integer,
    "item_03" integer,
    "item_04" integer,
    "item_05" integer,
    "item_06" integer,
    "item_07" integer,
    "item_08" integer,
    "item_09" integer,
    "item_10" integer,
    "item_11" integer,
    "item_12" integer,
    "item_13" integer,
    "item_14" integer,
    "item_15" integer,
    "item_16" integer,
    "raw_score" integer,
    "standardized_score" integer,
    "percentile_rank" numeric(5,2),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "dyscalculia" integer,
    "dyslexia" integer,
    "dysorthographia" integer,
    "dysphasia" integer,
    "dyspraxia" integer,
    "febrile_seizures" integer,
    "precocity" integer,
    "speech_delay" integer,
    "stuttering" integer,
    "walking_delay" integer,
    "patient_gender" "text"
);


ALTER TABLE "public"."bipolar_wais3_learning" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_wais3_matrices" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "patient_age" integer,
    "item_01" integer,
    "item_02" integer,
    "item_03" integer,
    "item_04" integer,
    "item_05" integer,
    "item_06" integer,
    "item_07" integer,
    "item_08" integer,
    "item_09" integer,
    "item_10" integer,
    "item_11" integer,
    "item_12" integer,
    "item_13" integer,
    "item_14" integer,
    "item_15" integer,
    "item_16" integer,
    "item_17" integer,
    "item_18" integer,
    "item_19" integer,
    "item_20" integer,
    "item_21" integer,
    "item_22" integer,
    "item_23" integer,
    "item_24" integer,
    "item_25" integer,
    "item_26" integer,
    "raw_score" integer,
    "standardized_score" integer,
    "percentile_rank" numeric(5,2),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "standard_score" integer,
    "standardized_value" numeric,
    "total_raw_score" integer,
    "years_of_education" integer,
    "patient_gender" "text"
);


ALTER TABLE "public"."bipolar_wais3_matrices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_wais3_vocabulaire" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "patient_age" integer,
    "item_01" integer,
    "item_02" integer,
    "item_03" integer,
    "item_04" integer,
    "item_05" integer,
    "item_06" integer,
    "item_07" integer,
    "item_08" integer,
    "item_09" integer,
    "item_10" integer,
    "item_11" integer,
    "item_12" integer,
    "item_13" integer,
    "item_14" integer,
    "item_15" integer,
    "item_16" integer,
    "item_17" integer,
    "item_18" integer,
    "item_19" integer,
    "item_20" integer,
    "item_21" integer,
    "item_22" integer,
    "item_23" integer,
    "item_24" integer,
    "item_25" integer,
    "item_26" integer,
    "item_27" integer,
    "item_28" integer,
    "item_29" integer,
    "item_30" integer,
    "item_31" integer,
    "item_32" integer,
    "item_33" integer,
    "raw_score" integer,
    "standardized_score" integer,
    "percentile_rank" numeric(5,2),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "item1" integer,
    "item2" integer,
    "item3" integer,
    "item4" integer,
    "item5" integer,
    "item6" integer,
    "item7" integer,
    "item8" integer,
    "item9" integer,
    "item10" integer,
    "item11" integer,
    "item12" integer,
    "item13" integer,
    "item14" integer,
    "item15" integer,
    "item16" integer,
    "item17" integer,
    "item18" integer,
    "item19" integer,
    "item20" integer,
    "item21" integer,
    "item22" integer,
    "item23" integer,
    "item24" integer,
    "item25" integer,
    "item26" integer,
    "item27" integer,
    "item28" integer,
    "item29" integer,
    "item30" integer,
    "item31" integer,
    "item32" integer,
    "item33" integer,
    "standard_score" integer,
    "standardized_value" numeric,
    "total_raw_score" integer,
    "years_of_education" integer,
    "patient_gender" "text"
);


ALTER TABLE "public"."bipolar_wais3_vocabulaire" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_wais4_code" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "patient_age" integer,
    "total_correct" integer,
    "total_errors" integer,
    "raw_score" integer,
    "standardized_score" integer,
    "z_score" numeric(5,2),
    "ivt_total_correct" integer,
    "ivt_total_errors" integer,
    "ivt_standardized_score" integer,
    "ivt_z_score" numeric(5,2),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "wais_cod_brut" integer,
    "wais_cod_cr" numeric,
    "wais_cod_err" integer,
    "wais_cod_std" integer,
    "wais_cod_tot" integer,
    "wais_ivt" integer,
    "wais_ivt_95" "text",
    "wais_ivt_rang" "text",
    "wais_somme_ivt" integer,
    "wais_symb_brut" integer,
    "wais_symb_cr" numeric,
    "wais_symb_err" integer,
    "wais_symb_std" integer,
    "wais_symb_tot" integer,
    "years_of_education" integer,
    "patient_gender" "text"
);


ALTER TABLE "public"."bipolar_wais4_code" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_wais4_criteria" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "collection_date" "date",
    "age" integer,
    "laterality" character varying(20),
    "native_french_speaker" integer,
    "time_since_last_eval" character varying(20),
    "patient_euthymic" integer,
    "no_episode_3months" integer,
    "socio_prof_data_present" integer,
    "years_of_education" integer,
    "no_visual_impairment" integer,
    "no_hearing_impairment" integer,
    "no_ect_past_year" integer,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "accepted_for_neuropsy_evaluation" boolean,
    "patient_gender" "text",
    "assessment_time" character varying(5),
    CONSTRAINT "bipolar_wais4_criteria_assessment_time_check" CHECK ((("assessment_time")::"text" ~ '^(09|1[0-8])h$'::"text"))
);


ALTER TABLE "public"."bipolar_wais4_criteria" OWNER TO "postgres";


COMMENT ON COLUMN "public"."bipolar_wais4_criteria"."assessment_time" IS 'Time of assessment (heure passation bilan): 09h to 18h';



CREATE TABLE IF NOT EXISTS "public"."bipolar_wais4_digit_span" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "patient_age" integer,
    "forward_raw" integer,
    "forward_span" integer,
    "forward_std" integer,
    "forward_z" numeric(5,2),
    "backward_raw" integer,
    "backward_span" integer,
    "backward_std" integer,
    "backward_z" numeric(5,2),
    "sequencing_raw" integer,
    "sequencing_span" integer,
    "sequencing_std" integer,
    "sequencing_z" numeric(5,2),
    "total_raw" integer,
    "total_std" integer,
    "percentile_rank" numeric(5,2),
    "total_z" numeric(5,2),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "empan_croissant" integer,
    "empan_direct" integer,
    "empan_inverse" integer,
    "mcoc_total" integer,
    "mcod_total" integer,
    "mcoi_total" integer,
    "raw_score" integer,
    "standardized_score" integer,
    "wais4_mcoc_1a" integer,
    "wais4_mcoc_1b" integer,
    "wais4_mcoc_2a" integer,
    "wais4_mcoc_2b" integer,
    "wais4_mcoc_3a" integer,
    "wais4_mcoc_3b" integer,
    "wais4_mcoc_4a" integer,
    "wais4_mcoc_4b" integer,
    "wais4_mcoc_5a" integer,
    "wais4_mcoc_5b" integer,
    "wais4_mcoc_6a" integer,
    "wais4_mcoc_6b" integer,
    "wais4_mcoc_7a" integer,
    "wais4_mcoc_7b" integer,
    "wais4_mcoc_8a" integer,
    "wais4_mcoc_8b" integer,
    "wais4_mcod_1a" integer,
    "wais4_mcod_1b" integer,
    "wais4_mcod_2a" integer,
    "wais4_mcod_2b" integer,
    "wais4_mcod_3a" integer,
    "wais4_mcod_3b" integer,
    "wais4_mcod_4a" integer,
    "wais4_mcod_4b" integer,
    "wais4_mcod_5a" integer,
    "wais4_mcod_5b" integer,
    "wais4_mcod_6a" integer,
    "wais4_mcod_6b" integer,
    "wais4_mcod_7a" integer,
    "wais4_mcod_7b" integer,
    "wais4_mcod_8a" integer,
    "wais4_mcod_8b" integer,
    "wais4_mcoi_1a" integer,
    "wais4_mcoi_1b" integer,
    "wais4_mcoi_2a" integer,
    "wais4_mcoi_2b" integer,
    "wais4_mcoi_3a" integer,
    "wais4_mcoi_3b" integer,
    "wais4_mcoi_4a" integer,
    "wais4_mcoi_4b" integer,
    "wais4_mcoi_5a" integer,
    "wais4_mcoi_5b" integer,
    "wais4_mcoi_6a" integer,
    "wais4_mcoi_6b" integer,
    "wais4_mcoi_7a" integer,
    "wais4_mcoi_7b" integer,
    "wais4_mcoi_8a" integer,
    "wais4_mcoi_8b" integer,
    "wais_mc_cr" numeric,
    "wais_mc_cro" integer,
    "wais_mc_cro_std" numeric,
    "wais_mc_emp" integer,
    "wais_mc_end" integer,
    "wais_mc_end_std" numeric,
    "wais_mc_env" integer,
    "wais_mc_env_std" numeric,
    "wais_mc_std" integer,
    "wais_mc_tot" integer,
    "wais_mcoc_1" integer,
    "wais_mcoc_2" integer,
    "wais_mcoc_3" integer,
    "wais_mcoc_4" integer,
    "wais_mcoc_5" integer,
    "wais_mcoc_6" integer,
    "wais_mcoc_7" integer,
    "wais_mcoc_8" integer,
    "wais_mcoc_tot" integer,
    "wais_mcod_1" integer,
    "wais_mcod_2" integer,
    "wais_mcod_3" integer,
    "wais_mcod_4" integer,
    "wais_mcod_5" integer,
    "wais_mcod_6" integer,
    "wais_mcod_7" integer,
    "wais_mcod_8" integer,
    "wais_mcod_tot" integer,
    "wais_mcoi_1" integer,
    "wais_mcoi_2" integer,
    "wais_mcoi_3" integer,
    "wais_mcoi_4" integer,
    "wais_mcoi_5" integer,
    "wais_mcoi_6" integer,
    "wais_mcoi_7" integer,
    "wais_mcoi_8" integer,
    "wais_mcoi_tot" integer,
    "years_of_education" integer,
    "patient_gender" "text"
);


ALTER TABLE "public"."bipolar_wais4_digit_span" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_wais4_learning" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "patient_age" integer,
    "years_of_education" integer,
    "item_01" integer,
    "item_02" integer,
    "item_03" integer,
    "item_04" integer,
    "item_05" integer,
    "item_06" integer,
    "item_07" integer,
    "item_08" integer,
    "item_09" integer,
    "item_10" integer,
    "item_11" integer,
    "item_12" integer,
    "item_13" integer,
    "item_14" integer,
    "item_15" integer,
    "item_16" integer,
    "raw_score" integer,
    "standardized_score" integer,
    "percentile_rank" numeric(5,2),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "dyscalculia" integer,
    "dyslexia" integer,
    "dysorthographia" integer,
    "dysphasia" integer,
    "dyspraxia" integer,
    "febrile_seizures" integer,
    "precocity" integer,
    "speech_delay" integer,
    "stuttering" integer,
    "walking_delay" integer,
    "patient_gender" "text"
);


ALTER TABLE "public"."bipolar_wais4_learning" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_wais4_matrices" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "patient_age" integer,
    "item_01" integer,
    "item_02" integer,
    "item_03" integer,
    "item_04" integer,
    "item_05" integer,
    "item_06" integer,
    "item_07" integer,
    "item_08" integer,
    "item_09" integer,
    "item_10" integer,
    "item_11" integer,
    "item_12" integer,
    "item_13" integer,
    "item_14" integer,
    "item_15" integer,
    "item_16" integer,
    "item_17" integer,
    "item_18" integer,
    "item_19" integer,
    "item_20" integer,
    "item_21" integer,
    "item_22" integer,
    "item_23" integer,
    "item_24" integer,
    "item_25" integer,
    "item_26" integer,
    "raw_score" integer,
    "standardized_score" integer,
    "percentile_rank" numeric(5,2),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "years_of_education" integer,
    "patient_gender" "text"
);


ALTER TABLE "public"."bipolar_wais4_matrices" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_wais4_similitudes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "patient_age" integer,
    "item_01" integer,
    "item_02" integer,
    "item_03" integer,
    "item_04" integer,
    "item_05" integer,
    "item_06" integer,
    "item_07" integer,
    "item_08" integer,
    "item_09" integer,
    "item_10" integer,
    "item_11" integer,
    "item_12" integer,
    "item_13" integer,
    "item_14" integer,
    "item_15" integer,
    "item_16" integer,
    "item_17" integer,
    "item_18" integer,
    "raw_score" integer,
    "standardized_score" integer,
    "percentile_rank" numeric(5,2),
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "item1" integer,
    "item2" integer,
    "item3" integer,
    "item4" integer,
    "item5" integer,
    "item6" integer,
    "item7" integer,
    "item8" integer,
    "item9" integer,
    "item10" integer,
    "item11" integer,
    "item12" integer,
    "item13" integer,
    "item14" integer,
    "item15" integer,
    "item16" integer,
    "item17" integer,
    "item18" integer,
    "standard_score" integer,
    "standardized_value" numeric,
    "total_raw_score" integer,
    "years_of_education" integer,
    "patient_gender" "text"
);


ALTER TABLE "public"."bipolar_wais4_similitudes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_wurs25" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "q13" integer,
    "q14" integer,
    "q15" integer,
    "q16" integer,
    "q17" integer,
    "q18" integer,
    "q19" integer,
    "q20" integer,
    "q21" integer,
    "q22" integer,
    "q23" integer,
    "q24" integer,
    "q25" integer,
    "total_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "adhd_likely" boolean
);


ALTER TABLE "public"."bipolar_wurs25" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."bipolar_ymrs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "total_score" integer,
    "severity" "text",
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "bipolar_ymrs_q10_check" CHECK ((("q10" >= 0) AND ("q10" <= 4))),
    CONSTRAINT "bipolar_ymrs_q11_check" CHECK ((("q11" >= 0) AND ("q11" <= 4))),
    CONSTRAINT "bipolar_ymrs_q1_check" CHECK ((("q1" >= 0) AND ("q1" <= 4))),
    CONSTRAINT "bipolar_ymrs_q2_check" CHECK ((("q2" >= 0) AND ("q2" <= 4))),
    CONSTRAINT "bipolar_ymrs_q3_check" CHECK ((("q3" >= 0) AND ("q3" <= 4))),
    CONSTRAINT "bipolar_ymrs_q4_check" CHECK ((("q4" >= 0) AND ("q4" <= 4))),
    CONSTRAINT "bipolar_ymrs_q5_check" CHECK ((("q5" >= 0) AND ("q5" <= 8))),
    CONSTRAINT "bipolar_ymrs_q6_check" CHECK ((("q6" >= 0) AND ("q6" <= 8))),
    CONSTRAINT "bipolar_ymrs_q7_check" CHECK ((("q7" >= 0) AND ("q7" <= 4))),
    CONSTRAINT "bipolar_ymrs_q8_check" CHECK ((("q8" >= 0) AND ("q8" <= 8))),
    CONSTRAINT "bipolar_ymrs_q9_check" CHECK ((("q9" >= 0) AND ("q9" <= 8)))
);


ALTER TABLE "public"."bipolar_ymrs" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."center_pathologies" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "center_id" "uuid" NOT NULL,
    "pathology_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."center_pathologies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."centers" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "code" character varying(50) NOT NULL,
    "city" character varying(100),
    "address" "text",
    "phone" character varying(20),
    "email" character varying(255),
    "active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."centers" OWNER TO "postgres";


COMMENT ON TABLE "public"."centers" IS 'Expert Centers managing patient care';



CREATE TABLE IF NOT EXISTS "public"."evaluations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "visit_id" "uuid",
    "evaluator_id" "uuid" NOT NULL,
    "evaluation_date" timestamp with time zone DEFAULT "now"(),
    "diagnosis" "text",
    "clinical_notes" "text",
    "risk_assessment" "jsonb",
    "treatment_plan" "text",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."evaluations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."login_history" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "success" boolean NOT NULL,
    "ip_address" "inet",
    "user_agent" "text",
    "method" character varying(50),
    "failure_reason" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."login_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "recipient_id" "uuid",
    "subject" character varying(255),
    "content" "text" NOT NULL,
    "read" boolean DEFAULT false,
    "parent_message_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."pathologies" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "type" "public"."pathology_type" NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text",
    "color" character varying(7),
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."pathologies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."patient_medications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "medication_name" "text" NOT NULL,
    "start_date" "date" NOT NULL,
    "is_ongoing" boolean DEFAULT true NOT NULL,
    "end_date" "date",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    CONSTRAINT "end_date_required_when_not_ongoing" CHECK ((("is_ongoing" = true) OR ("end_date" IS NOT NULL)))
);


ALTER TABLE "public"."patient_medications" OWNER TO "postgres";


COMMENT ON TABLE "public"."patient_medications" IS 'Patient psychotropic medications - individual medication entries with start/end dates';



COMMENT ON COLUMN "public"."patient_medications"."medication_name" IS 'Name of the medication';



COMMENT ON COLUMN "public"."patient_medications"."start_date" IS 'Date when treatment started';



COMMENT ON COLUMN "public"."patient_medications"."is_ongoing" IS 'Whether the treatment is currently ongoing';



COMMENT ON COLUMN "public"."patient_medications"."end_date" IS 'Date when treatment ended (required if is_ongoing = false)';



CREATE TABLE IF NOT EXISTS "public"."patients" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "center_id" "uuid" NOT NULL,
    "pathology_id" "uuid" NOT NULL,
    "medical_record_number" character varying(50) NOT NULL,
    "first_name" character varying(100) NOT NULL,
    "last_name" character varying(100) NOT NULL,
    "date_of_birth" "date" NOT NULL,
    "gender" character varying(20),
    "email" character varying(255),
    "phone" character varying(20),
    "address" "text",
    "emergency_contact" "jsonb",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "active" boolean DEFAULT true,
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "user_id" "uuid",
    "deleted_at" timestamp with time zone,
    "deleted_by" "uuid",
    "assigned_to" "uuid",
    "place_of_birth" character varying(255),
    "years_of_education" integer,
    CONSTRAINT "patients_gender_check" CHECK ((("gender" IS NULL) OR (("gender")::"text" = ANY ((ARRAY['M'::character varying, 'F'::character varying])::"text"[])))),
    CONSTRAINT "patients_years_of_education_check" CHECK ((("years_of_education" >= 0) AND ("years_of_education" <= 30)))
);


ALTER TABLE "public"."patients" OWNER TO "postgres";


COMMENT ON TABLE "public"."patients" IS 'Patient profiles linked to centers and pathologies';



COMMENT ON COLUMN "public"."patients"."center_id" IS 'Center isolation - enforced by RLS';



COMMENT ON COLUMN "public"."patients"."gender" IS 'Sex at birth: M (Male) or F (Female)';



COMMENT ON COLUMN "public"."patients"."user_id" IS 'Link to auth user account for patient portal access';



COMMENT ON COLUMN "public"."patients"."deleted_at" IS 'Timestamp when patient was soft deleted';



COMMENT ON COLUMN "public"."patients"."deleted_by" IS 'User who performed the deletion';



COMMENT ON COLUMN "public"."patients"."assigned_to" IS 'Professional assigned to manage this patient';



COMMENT ON COLUMN "public"."patients"."place_of_birth" IS 'Place of birth for the patient';



COMMENT ON COLUMN "public"."patients"."years_of_education" IS 'Nombre d''années d''études (depuis les cours préparatoires) - utilisé pour le calcul des scores neuropsychologiques';



CREATE TABLE IF NOT EXISTS "public"."permissions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(100) NOT NULL,
    "code" character varying(50) NOT NULL,
    "description" "text",
    "category" character varying(50),
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."recent_accesses" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "accessed_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."recent_accesses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_aims" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "movement_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_aims" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_antecedents_familiaux_psy" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "rad_structure_fille" character varying,
    "rad_structure_fille_atteint" character varying,
    "rad_structure_fils" character varying,
    "rad_structure_fils_atteint" character varying,
    "rad_structure_soeur" character varying,
    "rad_structure_soeur_atteint" character varying,
    "rad_structure_frere" character varying,
    "rad_structure_frere_atteint" character varying,
    "rad_structure_mere" character varying,
    "rad_atcdfampsy_mere_deces" character varying,
    "rad_structure_pere" character varying,
    "rad_atcdfampsy_pere_deces" character varying,
    "rad_soeur1_trouble" character varying,
    "rad_soeur1_suicide" character varying,
    "rad_soeur2_trouble" character varying,
    "rad_soeur2_suicide" character varying,
    "rad_soeur3_trouble" character varying,
    "rad_soeur3_suicide" character varying,
    "rad_soeur4_trouble" character varying,
    "rad_soeur4_suicide" character varying,
    "rad_soeur5_trouble" character varying,
    "rad_soeur5_suicide" character varying,
    "rad_frere1_trouble" character varying,
    "rad_frere1_suicide" character varying,
    "rad_frere2_trouble" character varying,
    "rad_frere2_suicide" character varying,
    "rad_frere3_trouble" character varying,
    "rad_frere3_suicide" character varying,
    "rad_frere4_trouble" character varying,
    "rad_frere4_suicide" character varying,
    "rad_frere5_trouble" character varying,
    "rad_frere5_suicide" character varying,
    "rad_mere_trouble" character varying,
    "rad_mere_suicide" character varying,
    "rad_pere_trouble" character varying,
    "rad_pere_suicide" character varying,
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_antecedents_familiaux_psy" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_barnes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "objective_subjective_score" integer,
    "global_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_barnes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_bars" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "adherence_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_bars" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_bilan_biologique" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "collection_date" "date",
    "rad_prelevement_lieu" character varying,
    "acide_urique" numeric,
    "crp" numeric,
    "glycemie" numeric,
    "rad_glycemie" character varying,
    "hb_gly" numeric,
    "vitd25oh" numeric,
    "chol_hdl" numeric,
    "rad_chol_hdl" character varying,
    "chol_ldl" numeric,
    "rad_chol_ldl" character varying,
    "chol_total" numeric,
    "chol_rapport_hdltot" numeric,
    "triglycerides" numeric,
    "gb" numeric,
    "gr" numeric,
    "hb" numeric,
    "rad_hb" character varying,
    "neutrophile" numeric,
    "eosinophile" numeric,
    "vgm" numeric,
    "plaquettes" numeric,
    "prolactine" numeric,
    "rad_prolacti" character varying,
    "rad_trt_visite" character varying,
    "rad_prisetraitement" character varying,
    "rad_clozapine" character varying,
    "clozapine" numeric,
    "radhtml_vitd_ext" character varying,
    "radhtml_vitd_cutane" character varying,
    "rad_toxo" character varying,
    "rad_igm_statut" character varying,
    "rad_igg_statut" character varying,
    "toxo_igg" numeric,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_bilan_biologique" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_cdss" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "total_score" integer,
    "has_depressive_syndrome" boolean,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_cdss" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_dossier_infirmier" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "taille" numeric,
    "poids" numeric,
    "bmi" numeric,
    "peri_abdo" numeric,
    "psc" numeric,
    "pdc" numeric,
    "tensionc" character varying,
    "rad_electrocardiogramme" "text",
    "mesqt" numeric,
    "elec_rr" numeric,
    "elec_qtc" numeric,
    "rad_electrocardiogramme_envoi" "text",
    "rad_electrocardiogramme_valide" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_dossier_infirmier" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_ecv" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "rad_ecv_vv1" "text",
    "chk_ecv_vv2" "text"[],
    "rad_ecv_vv3" "text",
    "rad_ecv_vv4" "text",
    "chk_ecv_vv5" "text"[],
    "rad_ecv_vp1" "text",
    "rad_ecv_vp2" "text",
    "chk_ecv_vp3" "text"[],
    "rad_ecv_vp4" "text",
    "rad_ecv_vp5" "text",
    "chk_ecv_vp6" "text"[],
    "rad_ecv_vp7" "text",
    "rad_ecv_vp8" "text",
    "chk_ecv_vp9" "text"[],
    "rad_ecv_vs1" "text",
    "chk_ecv_vs2" "text"[],
    "chk_ecv_vs3" "text"[],
    "rad_ecv_vs4" "text",
    "rad_ecv_vs5" "text",
    "chk_ecv_vs6" "text"[],
    "rad_ecv_vo1" "text",
    "chk_ecv_vo2" "text"[],
    "rad_ecv_vo3" "text",
    "rad_ecv_vo4" "text",
    "chk_ecv_vo5" "text"[],
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_ecv" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_eval_addictologique" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "rad_add_alc1" character varying,
    "rad_add_alc1a" character varying,
    "rad_add_tab" character varying,
    "rad_add_cannabis" character varying,
    "rad_add_drogues" character varying,
    "rad_add_jeux1" character varying,
    "rad_add_jeux2" character varying,
    "add_alc5a" character varying,
    "rad_add_alc5b" character varying,
    "rad_add_alc5c" integer,
    "add_alc6a" character varying,
    "rad_add_alc6b" character varying,
    "rad_add_alc6c" integer,
    "rad_add_alc7b" character varying,
    "rad_add_alc7c" integer,
    "rad_add_alc8a" character varying,
    "rad_add_alc8a1" character varying,
    "rad_add_alc8a2" character varying,
    "rad_add_alc8b1" character varying,
    "rad_add_alc8b2" character varying,
    "rad_add_alc8c1" character varying,
    "rad_add_alc8c2" character varying,
    "rad_add_alc8d1" character varying,
    "rad_add_alc8d2" character varying,
    "rad_add_alc8e1" character varying,
    "rad_add_alc8e2" character varying,
    "rad_add_alc8f1" character varying,
    "rad_add_alc8f2" character varying,
    "rad_add_alc8g1" character varying,
    "rad_add_alc8g2" character varying,
    "rad_add_alc8h1" character varying,
    "rad_add_alc8h2" character varying,
    "rad_add_alc8i1" character varying,
    "rad_add_alc8i2" character varying,
    "rad_add_alc8j1" character varying,
    "rad_add_alc8j2" character varying,
    "rad_add_alc8k1" character varying,
    "rad_add_alc8k2" character varying,
    "rad_add_alc8l1" character varying,
    "rad_add_alc8l2" character varying,
    "dsm5_lifetime_count" integer,
    "dsm5_12month_count" integer,
    "dsm5_lifetime_severity" character varying,
    "dsm5_12month_severity" character varying,
    "add_alc_10a" integer,
    "add_alc_10b" integer,
    "add_alc_10c" integer,
    "rad_add_alc11" character varying,
    "rad_add_alc12" character varying,
    "rad_add_alc13" character varying,
    "add_alc13b" character varying,
    "rad_add_alc14a" character varying,
    "add_alc14b" integer,
    "add_alc14c" integer,
    "tab_paquets_annees" numeric,
    "tab_cigarettes_jour" numeric,
    "tab_age_premiere_cigarette" integer,
    "tab_abstinence_max_mois" integer,
    "tab_antecedents_familiaux" character varying,
    "tab_craving_score" character varying,
    "tab_traitement_vie" character varying,
    "tab_traitements_utilises" "text"[],
    "tab_age_debut_quotidien" character varying,
    "rad_add_cannabis_abstinent" character varying,
    "rad_add_can_qty_vie" numeric,
    "rad_add_can_freq_vie" character varying,
    "rad_add_can_freq_vie_spec" integer,
    "rad_add_can_qty_12m" numeric,
    "rad_add_can_freq_12m" character varying,
    "rad_add_can_freq_12m_spec" integer,
    "rad_add_can_dsm5_screen" character varying,
    "rad_add_can_dsm5_a" character varying,
    "rad_add_can_dsm5_a_12m" character varying,
    "rad_add_can_dsm5_b" character varying,
    "rad_add_can_dsm5_b_12m" character varying,
    "rad_add_can_dsm5_c" character varying,
    "rad_add_can_dsm5_c_12m" character varying,
    "rad_add_can_dsm5_d" character varying,
    "rad_add_can_dsm5_d_12m" character varying,
    "rad_add_can_dsm5_e" character varying,
    "rad_add_can_dsm5_e_12m" character varying,
    "rad_add_can_dsm5_f" character varying,
    "rad_add_can_dsm5_f_12m" character varying,
    "rad_add_can_dsm5_g" character varying,
    "rad_add_can_dsm5_g_12m" character varying,
    "rad_add_can_dsm5_h" character varying,
    "rad_add_can_dsm5_h_12m" character varying,
    "rad_add_can_dsm5_i" character varying,
    "rad_add_can_dsm5_i_12m" character varying,
    "rad_add_can_dsm5_j" character varying,
    "rad_add_can_dsm5_j_12m" character varying,
    "rad_add_can_dsm5_k" character varying,
    "rad_add_can_dsm5_k_12m" character varying,
    "rad_add_can_dsm5_l" character varying,
    "rad_add_can_dsm5_l_12m" character varying,
    "dsm5_cannabis_lifetime_count" integer,
    "dsm5_cannabis_lifetime_severity" character varying,
    "dsm5_cannabis_12month_count" integer,
    "dsm5_cannabis_12month_severity" character varying,
    "rad_add_sedatifs" character varying,
    "rad_add_sedatifs_forme" "text"[],
    "rad_add_heroine" character varying,
    "rad_add_heroine_forme" "text"[],
    "rad_add_crack" character varying,
    "rad_add_crack_forme" "text"[],
    "rad_add_opiaces" character varying,
    "rad_add_opiaces_forme" "text"[],
    "rad_add_autres_substances" character varying,
    "rad_add_autres_substances_nom" "text",
    "rad_add_autres_substances_abus" character varying,
    "rad_add_autres_qty_vie" numeric,
    "rad_add_autres_freq_vie" character varying,
    "rad_add_autres_freq_vie_spec" integer,
    "rad_add_autres_qty_12m" numeric,
    "rad_add_autres_freq_12m" character varying,
    "rad_add_autres_freq_12m_spec" integer,
    "rad_add_autres_dsm5_screen" character varying,
    "rad_add_autres_dsm5_a" character varying,
    "rad_add_autres_dsm5_a_12m" character varying,
    "rad_add_autres_dsm5_b" character varying,
    "rad_add_autres_dsm5_b_12m" character varying,
    "rad_add_autres_dsm5_c" character varying,
    "rad_add_autres_dsm5_c_12m" character varying,
    "rad_add_autres_dsm5_d" character varying,
    "rad_add_autres_dsm5_d_12m" character varying,
    "rad_add_autres_dsm5_e" character varying,
    "rad_add_autres_dsm5_e_12m" character varying,
    "rad_add_autres_dsm5_f" character varying,
    "rad_add_autres_dsm5_f_12m" character varying,
    "rad_add_autres_dsm5_g" character varying,
    "rad_add_autres_dsm5_g_12m" character varying,
    "rad_add_autres_dsm5_h" character varying,
    "rad_add_autres_dsm5_h_12m" character varying,
    "rad_add_autres_dsm5_i" character varying,
    "rad_add_autres_dsm5_i_12m" character varying,
    "rad_add_autres_dsm5_j" character varying,
    "rad_add_autres_dsm5_j_12m" character varying,
    "rad_add_autres_dsm5_k" character varying,
    "rad_add_autres_dsm5_k_12m" character varying,
    "rad_add_autres_dsm5_l" character varying,
    "rad_add_autres_dsm5_l_12m" character varying,
    "dsm5_autres_lifetime_count" integer,
    "dsm5_autres_12month_count" integer,
    "dsm5_autres_lifetime_severity" character varying,
    "dsm5_autres_12month_severity" character varying,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_eval_addictologique" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_isa" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "q11" integer,
    "q12" integer,
    "q13" integer,
    "q14" integer,
    "q15" integer,
    "q16" integer,
    "q17" integer,
    "q18" integer,
    "q19" integer,
    "q20" integer,
    "q21" integer,
    "q22" integer,
    "q23" integer,
    "q24" integer,
    "q25" integer,
    "q26" integer,
    "q27" integer,
    "q28" integer,
    "q29" integer,
    "q30" integer,
    "total_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_isa" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_panss" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "p1" integer,
    "p2" integer,
    "p3" integer,
    "p4" integer,
    "p5" integer,
    "p6" integer,
    "p7" integer,
    "n1" integer,
    "n2" integer,
    "n3" integer,
    "n4" integer,
    "n5" integer,
    "n6" integer,
    "n7" integer,
    "g1" integer,
    "g2" integer,
    "g3" integer,
    "g4" integer,
    "g5" integer,
    "g6" integer,
    "g7" integer,
    "g8" integer,
    "g9" integer,
    "g10" integer,
    "g11" integer,
    "g12" integer,
    "g13" integer,
    "g14" integer,
    "g15" integer,
    "g16" integer,
    "positive_score" integer,
    "negative_score" integer,
    "general_score" integer,
    "total_score" integer,
    "wallwork_positive" integer,
    "wallwork_negative" integer,
    "wallwork_disorganized" integer,
    "wallwork_excited" integer,
    "wallwork_depressed" integer,
    "lancon_positive" integer,
    "lancon_negative" integer,
    "lancon_disorganized" integer,
    "lancon_excited" integer,
    "lancon_depressed" integer,
    "vandergaag_positive" integer,
    "vandergaag_negative" integer,
    "vandergaag_disorganized" integer,
    "vandergaag_excited" integer,
    "vandergaag_depressed" integer,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_panss" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_perinatalite" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_mother_age" integer,
    "q2_father_age" integer,
    "q3_birth_condition" character varying,
    "q4_gestational_age" integer,
    "q5_birth_type" character varying,
    "q6_birth_weight" integer,
    "q7_neonatal_hospitalization" character varying,
    "q8_birth_environment" character varying,
    "q9_obstetric_complications" character varying,
    "q10_maternal_viral_infection" character varying,
    "q11_maternal_pregnancy_events" "text"[],
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_perinatalite" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_psp" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "domain_a" "text",
    "domain_b" "text",
    "domain_c" "text",
    "domain_d" "text",
    "interval_selection" integer,
    "final_score" integer,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_psp" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_sas" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1" integer,
    "q2" integer,
    "q3" integer,
    "q4" integer,
    "q5" integer,
    "q6" integer,
    "q7" integer,
    "q8" integer,
    "q9" integer,
    "q10" integer,
    "mean_score" numeric,
    "interpretation" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_sas" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_screening_diagnostic" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "date_screening" "date" NOT NULL,
    "screening_diag_nommed" character varying,
    "rad_screening_diag_sz_prealable" "text",
    "rad_screening_diag_sz_prealable_preciser" "text",
    "rad_screening_diag_sz_evoque" "text",
    "rad_screening_diag_nonsz" "text",
    "screening_diag_nonsz_preciser" character varying,
    "screening_diag_differe_preciser" character varying,
    "rad_screening_diag_bilan_programme" "text",
    "rad_screening_diag_bilan_programme_non" "text",
    "date_screening_diag_bilan_programme" "date",
    "rad_screening_diag_lettre_info" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_screening_diagnostic" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_screening_orientation" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "rad_screening_orientation_sz" "text",
    "rad_screening_orientation_psychique" "text",
    "rad_screening_orientation_priseencharge" "text",
    "rad_screening_orientation_accord_patient" "text",
    "eligibility_result" boolean,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_screening_orientation" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_suicide_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "q1_first_attempt_date" "date",
    "q2_attempt_count" integer,
    "q3_attempt_count_12m" integer,
    "q4_violent_attempts" character varying,
    "q4_1_violent_count" integer,
    "q5_serious_attempts" character varying,
    "q5_1_serious_count" integer,
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_suicide_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_sumd" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "conscience1" integer,
    "conscience2" integer,
    "conscience3" integer,
    "conscience4" integer,
    "conscience5" integer,
    "conscience6" integer,
    "conscience7" integer,
    "conscience8" integer,
    "conscience9" integer,
    "attribu4" integer,
    "attribu5" integer,
    "attribu6" integer,
    "attribu7" integer,
    "attribu8" integer,
    "attribu9" integer,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_sumd" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_tea_coffee" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "tea_5a" integer,
    "tea_5b" character varying,
    "tea_5b1" integer,
    "tea_6a" integer,
    "tea_6b" character varying,
    "tea_6b1" integer,
    "coffee_5a" integer,
    "coffee_5b" character varying,
    "coffee_5b1" integer,
    "coffee_6a" integer,
    "coffee_6b" character varying,
    "coffee_6b1" integer,
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_tea_coffee" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_troubles_comorbides" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "rad_tb_thy_episode_dep_maj" "text",
    "rad_tb_thy_age_debut" "text",
    "rad_tb_thy_nb_episode" "text",
    "rad_tb_anx" "text",
    "rad_attaq_paniq" "text",
    "rad_trouble_panique" "text",
    "chk_anxieux_trouble_panique_type" "text"[],
    "rad_anxieux_trouble_panique_sansagora_mois" "text",
    "rad_anxieux_trouble_panique_agora_mois" "text",
    "rad_peur_agoraphobie" "text",
    "rad_agoraphobie" "text",
    "rad_anxieux_agoraphobie_symptome_mois_ecoule" "text",
    "rad_peur_sociale" "text",
    "rad_phobie_sociale" "text",
    "rad_anxieux_phobie_sociale_symptome_mois_ecoule" "text",
    "rad_peur_specifique" "text",
    "rad_phobie_specifique" "text",
    "rad_anxieux_phobie_specfique_symptome_mois_ecoule" "text",
    "rad_peur_obsessionnel" "text",
    "rad_trouble_obsessionnel" "text",
    "rad_peur_compulsif" "text",
    "rad_trouble_compulsif" "text",
    "rad_anxieux" "text",
    "rad_anxieux_generalise_titre" "text",
    "rad_anxieux_generalise_symptome_mois_ecoule" "text",
    "anxieux_affection_medicale" character varying,
    "rad_anxieux_affection_medicale_symptome_mois_ecoule" "text",
    "rad_anxieux_post_trauma_titre" "text",
    "rad_anxieux_post_trauma_symptome_mois_ecoule" "text",
    "rad_anxieux_non_specifie_titre" "text",
    "rad_anxieux_non_specifie_symptome_mois_ecoule" "text",
    "rad_diag_tdah" "text",
    "rad_tb_alim" "text",
    "rad_conduites_alimentaires_symptomes_mois_ecoule" "text",
    "rad_conduites_alimentaires_type" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_troubles_comorbides" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."schizophrenia_troubles_psychotiques" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "visit_id" "uuid" NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "rad_tbpsychovie" "text",
    "radhtml_tbpsychovie_type" "text",
    "radhtml_tbpsychovie_non" "text",
    "tbpsychovie_non_autre" character varying,
    "rad_tbpsychovie_premierep_age" "text",
    "rad_tbpsychovie_premiertrait_age" "text",
    "tbpsychovie_premiertrait_duree" character varying,
    "rad_tbpsychovie_premierhosp_age" "text",
    "tbduree" character varying,
    "tbdureetot" character varying,
    "rad_tbpsychovie_hospit_nb" "text",
    "rad_tbpsychovie_hospit_dureetot" "text",
    "rad_tbpsychovie_nb" "text",
    "rad_tbpsychovie_ep1_type" "text",
    "tbpsychovie_ep1_debut" character varying,
    "rad_tbpsychovie_ep1_hosp" "text",
    "tbpsychovie_ep1_hospduree" character varying,
    "rad_tbpsychovie_ep2_type" "text",
    "tbpsychovie_ep2_debut" character varying,
    "rad_tbpsychovie_ep2_hosp" "text",
    "tbpsychovie_ep2_hospduree" character varying,
    "rad_tbpsychovie_ep3_type" "text",
    "tbpsychovie_ep3_debut" character varying,
    "rad_tbpsychovie_ep3_hosp" "text",
    "tbpsychovie_ep3_hospduree" character varying,
    "rad_tbpsychovie_ep4_type" "text",
    "tbpsychovie_ep4_debut" character varying,
    "rad_tbpsychovie_ep4_hosp" "text",
    "tbpsychovie_ep4_hospduree" character varying,
    "rad_tbpsychovie_ep5_type" "text",
    "tbpsychovie_ep5_debut" character varying,
    "rad_tbpsychovie_ep5_hosp" "text",
    "tbpsychovie_ep5_hospduree" character varying,
    "rad_tbpsychovie_ep6_type" "text",
    "tbpsychovie_ep6_debut" character varying,
    "rad_tbpsychovie_ep6_hosp" "text",
    "tbpsychovie_ep6_hospduree" character varying,
    "rad_tbpsychovie_ep7_type" "text",
    "tbpsychovie_ep7_debut" character varying,
    "rad_tbpsychovie_ep7_hosp" "text",
    "tbpsychovie_ep7_hospduree" character varying,
    "rad_tbpsychovie_ep8_type" "text",
    "tbpsychovie_ep8_debut" character varying,
    "rad_tbpsychovie_ep8_hosp" "text",
    "tbpsychovie_ep8_hospduree" character varying,
    "rad_tbpsychovie_ep9_type" "text",
    "tbpsychovie_ep9_debut" character varying,
    "rad_tbpsychovie_ep9_hosp" "text",
    "tbpsychovie_ep9_hospduree" character varying,
    "rad_tbpsychovie_ep10_type" "text",
    "tbpsychovie_ep10_debut" character varying,
    "rad_tbpsychovie_ep10_hosp" "text",
    "tbpsychovie_ep10_hospduree" character varying,
    "rad_tbpsychovie_ep11_type" "text",
    "tbpsychovie_ep11_debut" character varying,
    "rad_tbpsychovie_ep11_hosp" "text",
    "tbpsychovie_ep11_hospduree" character varying,
    "rad_tbpsychovie_ep12_type" "text",
    "tbpsychovie_ep12_debut" character varying,
    "rad_tbpsychovie_ep12_hosp" "text",
    "tbpsychovie_ep12_hospduree" character varying,
    "rad_tbpsychovie_ep13_type" "text",
    "tbpsychovie_ep13_debut" character varying,
    "rad_tbpsychovie_ep13_hosp" "text",
    "tbpsychovie_ep13_hospduree" character varying,
    "rad_tbpsychovie_ep14_type" "text",
    "tbpsychovie_ep14_debut" character varying,
    "rad_tbpsychovie_ep14_hosp" "text",
    "tbpsychovie_ep14_hospduree" character varying,
    "rad_tbpsychovie_ep15_type" "text",
    "tbpsychovie_ep15_debut" character varying,
    "rad_tbpsychovie_ep15_hosp" "text",
    "tbpsychovie_ep15_hospduree" character varying,
    "rad_tbpsychovie_ep16_type" "text",
    "tbpsychovie_ep16_debut" character varying,
    "rad_tbpsychovie_ep16_hosp" "text",
    "tbpsychovie_ep16_hospduree" character varying,
    "rad_tbpsychovie_ep17_type" "text",
    "tbpsychovie_ep17_debut" character varying,
    "rad_tbpsychovie_ep17_hosp" "text",
    "tbpsychovie_ep17_hospduree" character varying,
    "rad_tbpsychovie_ep18_type" "text",
    "tbpsychovie_ep18_debut" character varying,
    "rad_tbpsychovie_ep18_hosp" "text",
    "tbpsychovie_ep18_hospduree" character varying,
    "rad_tbpsychovie_ep19_type" "text",
    "tbpsychovie_ep19_debut" character varying,
    "rad_tbpsychovie_ep19_hosp" "text",
    "tbpsychovie_ep19_hospduree" character varying,
    "rad_tbpsychovie_ep20_type" "text",
    "tbpsychovie_ep20_debut" character varying,
    "rad_tbpsychovie_ep20_hosp" "text",
    "tbpsychovie_ep20_hospduree" character varying,
    "rad_symptomesvie_persecution" "text",
    "rad_symptomesvie_persecution_mois" "text",
    "rad_symptomesvie_grandeur" "text",
    "rad_symptomesvie_grandeur_mois" "text",
    "rad_symptomesvie_somatique" "text",
    "rad_symptomesvie_somatique_mois" "text",
    "rad_symptomesvie_mystique" "text",
    "rad_symptomesvie_mystique_mois" "text",
    "rad_symptomesvie_culpabilite" "text",
    "rad_symptomesvie_culpabilite_mois" "text",
    "rad_symptomesvie_jalousie" "text",
    "rad_symptomesvie_jalousie_mois" "text",
    "rad_symptomesvie_erotomaniaque" "text",
    "rad_symptomesvie_erotomaniaque_mois" "text",
    "rad_symptomesvie_etrecontrole" "text",
    "rad_symptomesvie_etrecontrole_mois" "text",
    "rad_symptomesvie_volpensee" "text",
    "rad_symptomesvie_volpensee_mois" "text",
    "rad_symptomesvie_bizarre" "text",
    "rad_symptomesvie_bizarre_mois" "text",
    "rad_symptomesvie_idreferences" "text",
    "rad_symptomesvie_idreferences_mois" "text",
    "rad_symptomesvie_halluintrapsy" "text",
    "rad_symptomesvie_halluintrapsy_mois" "text",
    "rad_symptomesvie_hallusenso" "text",
    "rad_symptomesvie_hallusenso_mois" "text",
    "rad_symptomesvie_halluvisu" "text",
    "rad_symptomesvie_halluvisu_mois" "text",
    "rad_symptomesvie_hallucenesthe" "text",
    "rad_symptomesvie_hallucenesthe_mois" "text",
    "rad_symptomesvie_catatonie" "text",
    "rad_symptomesvie_catatonie_mois" "text",
    "rad_symptomesvie_compodesorg" "text",
    "rad_symptomesvie_compodesorg_mois" "text",
    "rad_symptomesvie_gestdiscord" "text",
    "rad_symptomesvie_gestdiscord_mois" "text",
    "rad_symptomesvie_discdesorg" "text",
    "rad_symptomesvie_discdesorg_mois" "text",
    "rad_symptomesvie_avolition" "text",
    "rad_symptomesvie_avolition_mois" "text",
    "rad_symptomesvie_alogie" "text",
    "rad_symptomesvie_alogie_mois" "text",
    "rad_symptomesvie_emousaffec" "text",
    "rad_symptomesvie_emousaffec_mois" "text",
    "rad_symptomeevo_mode" "text",
    "rad_tbpsychoan" "text",
    "rad_tbpsychoan_hospi_tpscomplet" "text",
    "rad_tbpsychoan_hospi_tpscomplet_nb" "text",
    "rad_tbpsychoan_hospi_tpscomplet_duree" "text",
    "rad_tbpsychoan_hospi_tpscomplet_motif" "text",
    "rad_tbpsychoan_modpec_nonmed" "text",
    "chk_tbpsychoan_modpec_nonmed_tcc" "text"[],
    "chk_tbpsychoan_modpec_nonmed_remed" "text"[],
    "chk_tbpsychoan_modpec_nonmed_psychody" "text"[],
    "chk_tbpsychoan_modpec_nonmed_fam" "text"[],
    "tbpsychoan_modpec_nonmed_autre" character varying,
    "chk_aide_prise_tt" "text"[],
    "rad_aide_prise_tt_hospi" "text",
    "rad_tbpsychoan_ts" "text",
    "rad_tbpsychoan_ts_nb" "text",
    "completed_by" "uuid",
    "completed_at" timestamp with time zone DEFAULT "now"(),
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."schizophrenia_troubles_psychotiques" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."treatment_somatic_contraceptive" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "medication_name" "text" NOT NULL,
    "start_date" "date",
    "months_exposure" integer,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid",
    CONSTRAINT "treatment_somatic_contraceptive_months_exposure_check" CHECK (("months_exposure" >= 0))
);


ALTER TABLE "public"."treatment_somatic_contraceptive" OWNER TO "postgres";


COMMENT ON TABLE "public"."treatment_somatic_contraceptive" IS 'Somatic and contraceptive treatments - Lifetime treatment entries';



COMMENT ON COLUMN "public"."treatment_somatic_contraceptive"."medication_name" IS 'Name of the somatic or contraceptive medication';



COMMENT ON COLUMN "public"."treatment_somatic_contraceptive"."start_date" IS 'Date when treatment started';



COMMENT ON COLUMN "public"."treatment_somatic_contraceptive"."months_exposure" IS 'Cumulative months of exposure to this treatment';



CREATE TABLE IF NOT EXISTS "public"."user_invitations" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "email" character varying(255) NOT NULL,
    "role" "public"."user_role" NOT NULL,
    "center_id" "uuid",
    "token" character varying(255) NOT NULL,
    "status" "public"."invitation_status" DEFAULT 'pending'::"public"."invitation_status",
    "invited_by" "uuid" NOT NULL,
    "accepted_by" "uuid",
    "expires_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "patient_id" "uuid",
    "first_name" character varying(100),
    "last_name" character varying(100)
);


ALTER TABLE "public"."user_invitations" OWNER TO "postgres";


COMMENT ON COLUMN "public"."user_invitations"."patient_id" IS 'Link invitation to patient record when inviting patient to portal';



COMMENT ON COLUMN "public"."user_invitations"."first_name" IS 'Invitee first name for email personalization';



COMMENT ON COLUMN "public"."user_invitations"."last_name" IS 'Invitee last name for email personalization';



CREATE TABLE IF NOT EXISTS "public"."user_permissions" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "permission_id" "uuid" NOT NULL,
    "granted_by" "uuid",
    "granted_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_permissions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_profiles" (
    "id" "uuid" NOT NULL,
    "role" "public"."user_role" NOT NULL,
    "center_id" "uuid",
    "first_name" character varying(100),
    "last_name" character varying(100),
    "email" character varying(255) NOT NULL,
    "phone" character varying(20),
    "username" character varying(50),
    "active" boolean DEFAULT true,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "created_by" "uuid"
);


ALTER TABLE "public"."user_profiles" OWNER TO "postgres";


COMMENT ON TABLE "public"."user_profiles" IS 'Extended user profiles with roles and center assignments';



COMMENT ON COLUMN "public"."user_profiles"."role" IS 'User role in the system hierarchy';



CREATE OR REPLACE VIEW "public"."v_patients_full" WITH ("security_invoker"='true') AS
 SELECT "p"."id",
    "p"."center_id",
    "p"."pathology_id",
    "p"."medical_record_number",
    "p"."first_name",
    "p"."last_name",
    "p"."date_of_birth",
    "p"."gender",
    "p"."email",
    "p"."phone",
    "p"."address",
    "p"."emergency_contact",
    "p"."metadata",
    "p"."active",
    "p"."created_by",
    "p"."created_at",
    "p"."updated_at",
    "p"."user_id",
    "p"."deleted_at",
    "p"."deleted_by",
    "p"."assigned_to",
    "p"."place_of_birth",
    "p"."years_of_education",
    "c"."name" AS "center_name",
    "c"."code" AS "center_code",
    "path"."type" AS "pathology_type",
    "path"."name" AS "pathology_name",
    "path"."color" AS "pathology_color",
    "up_created"."first_name" AS "created_by_first_name",
    "up_created"."last_name" AS "created_by_last_name",
    "up_assigned"."first_name" AS "assigned_to_first_name",
    "up_assigned"."last_name" AS "assigned_to_last_name",
    "up"."email" AS "professional_email",
    "up"."first_name" AS "professional_first_name",
    "up"."last_name" AS "professional_last_name"
   FROM ((((("public"."patients" "p"
     LEFT JOIN "public"."centers" "c" ON (("p"."center_id" = "c"."id")))
     LEFT JOIN "public"."pathologies" "path" ON (("p"."pathology_id" = "path"."id")))
     LEFT JOIN "public"."user_profiles" "up" ON (("p"."assigned_to" = "up"."id")))
     LEFT JOIN "public"."user_profiles" "up_created" ON (("p"."created_by" = "up_created"."id")))
     LEFT JOIN "public"."user_profiles" "up_assigned" ON (("p"."assigned_to" = "up_assigned"."id")))
  WHERE ("p"."deleted_at" IS NULL);


ALTER VIEW "public"."v_patients_full" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."visit_templates" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "pathology_id" "uuid" NOT NULL,
    "visit_type" "public"."visit_type" NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "order_index" integer DEFAULT 0,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "active" boolean DEFAULT true,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."visit_templates" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."visits" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "patient_id" "uuid" NOT NULL,
    "visit_template_id" "uuid" NOT NULL,
    "visit_type" "public"."visit_type" NOT NULL,
    "scheduled_date" timestamp with time zone,
    "completed_date" timestamp with time zone,
    "status" character varying(50) DEFAULT 'scheduled'::character varying,
    "notes" "text",
    "conducted_by" "uuid",
    "metadata" "jsonb" DEFAULT '{}'::"jsonb",
    "created_by" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "completion_percentage" integer DEFAULT 0,
    "completed_questionnaires" integer DEFAULT 0,
    "total_questionnaires" integer DEFAULT 0,
    "completion_updated_at" timestamp with time zone
);


ALTER TABLE "public"."visits" OWNER TO "postgres";


COMMENT ON TABLE "public"."visits" IS 'Clinical visits for longitudinal patient follow-up';



COMMENT ON COLUMN "public"."visits"."completion_percentage" IS 'Calculated completion percentage (0-100) based on actually required questionnaires';



COMMENT ON COLUMN "public"."visits"."completed_questionnaires" IS 'Number of completed questionnaires';



COMMENT ON COLUMN "public"."visits"."total_questionnaires" IS 'Total number of required questionnaires (excluding conditional ones not applicable)';



COMMENT ON COLUMN "public"."visits"."completion_updated_at" IS 'Last time the completion status was calculated';



CREATE OR REPLACE VIEW "public"."v_visits_full" WITH ("security_invoker"='true') AS
 SELECT "v"."id",
    "v"."patient_id",
    "v"."visit_template_id",
    "v"."visit_type",
    "v"."scheduled_date",
    "v"."completed_date",
    "v"."status",
    "v"."notes",
    "v"."conducted_by",
    "v"."metadata",
    "v"."created_by",
    "v"."created_at",
    "v"."updated_at",
    "p"."first_name" AS "patient_first_name",
    "p"."last_name" AS "patient_last_name",
    "p"."medical_record_number",
    "vt"."name" AS "template_name",
    "vt"."pathology_id",
    "path"."name" AS "pathology_name",
    "up"."first_name" AS "conducted_by_first_name",
    "up"."last_name" AS "conducted_by_last_name"
   FROM (((("public"."visits" "v"
     JOIN "public"."patients" "p" ON (("v"."patient_id" = "p"."id")))
     JOIN "public"."visit_templates" "vt" ON (("v"."visit_template_id" = "vt"."id")))
     JOIN "public"."pathologies" "path" ON (("vt"."pathology_id" = "path"."id")))
     LEFT JOIN "public"."user_profiles" "up" ON (("v"."conducted_by" = "up"."id")));


ALTER VIEW "public"."v_visits_full" OWNER TO "postgres";


ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_aim"
    ADD CONSTRAINT "bipolar_aim_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_aim"
    ADD CONSTRAINT "bipolar_aim_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_alda"
    ADD CONSTRAINT "bipolar_alda_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_alda"
    ADD CONSTRAINT "bipolar_alda_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_als18"
    ADD CONSTRAINT "bipolar_als18_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_als18"
    ADD CONSTRAINT "bipolar_als18_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_antecedents_gyneco"
    ADD CONSTRAINT "bipolar_antecedents_gyneco_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_antecedents_gyneco"
    ADD CONSTRAINT "bipolar_antecedents_gyneco_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_aq12"
    ADD CONSTRAINT "bipolar_aq12_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_aq12"
    ADD CONSTRAINT "bipolar_aq12_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_asrm"
    ADD CONSTRAINT "bipolar_asrm_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_asrm"
    ADD CONSTRAINT "bipolar_asrm_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_asrs"
    ADD CONSTRAINT "bipolar_asrs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_asrs"
    ADD CONSTRAINT "bipolar_asrs_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_autres_patho"
    ADD CONSTRAINT "bipolar_autres_patho_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_autres_patho"
    ADD CONSTRAINT "bipolar_autres_patho_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_bis10"
    ADD CONSTRAINT "bipolar_bis10_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_bis10"
    ADD CONSTRAINT "bipolar_bis10_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_cgi"
    ADD CONSTRAINT "bipolar_cgi_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_cgi"
    ADD CONSTRAINT "bipolar_cgi_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_cobra"
    ADD CONSTRAINT "bipolar_cobra_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_cobra"
    ADD CONSTRAINT "bipolar_cobra_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_cpt3"
    ADD CONSTRAINT "bipolar_cpt3_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_cpt3"
    ADD CONSTRAINT "bipolar_cpt3_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_csm"
    ADD CONSTRAINT "bipolar_csm_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_csm"
    ADD CONSTRAINT "bipolar_csm_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_cssrs"
    ADD CONSTRAINT "bipolar_cssrs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_cssrs"
    ADD CONSTRAINT "bipolar_cssrs_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_cti"
    ADD CONSTRAINT "bipolar_cti_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_cti"
    ADD CONSTRAINT "bipolar_cti_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_ctq"
    ADD CONSTRAINT "bipolar_ctq_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_ctq"
    ADD CONSTRAINT "bipolar_ctq_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_cvlt"
    ADD CONSTRAINT "bipolar_cvlt_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_cvlt"
    ADD CONSTRAINT "bipolar_cvlt_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_diagnostic"
    ADD CONSTRAINT "bipolar_diagnostic_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_diagnostic"
    ADD CONSTRAINT "bipolar_diagnostic_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_diva"
    ADD CONSTRAINT "bipolar_diva_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_diva"
    ADD CONSTRAINT "bipolar_diva_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_dsm5_comorbid"
    ADD CONSTRAINT "bipolar_dsm5_comorbid_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_dsm5_comorbid"
    ADD CONSTRAINT "bipolar_dsm5_comorbid_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_dsm5_humeur"
    ADD CONSTRAINT "bipolar_dsm5_humeur_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_dsm5_humeur"
    ADD CONSTRAINT "bipolar_dsm5_humeur_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_dsm5_psychotic"
    ADD CONSTRAINT "bipolar_dsm5_psychotic_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_dsm5_psychotic"
    ADD CONSTRAINT "bipolar_dsm5_psychotic_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_egf"
    ADD CONSTRAINT "bipolar_egf_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_egf"
    ADD CONSTRAINT "bipolar_egf_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_epworth"
    ADD CONSTRAINT "bipolar_epworth_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_epworth"
    ADD CONSTRAINT "bipolar_epworth_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_eq5d5l"
    ADD CONSTRAINT "bipolar_eq5d5l_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_eq5d5l"
    ADD CONSTRAINT "bipolar_eq5d5l_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_etat_patient"
    ADD CONSTRAINT "bipolar_etat_patient_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_etat_patient"
    ADD CONSTRAINT "bipolar_etat_patient_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_family_history"
    ADD CONSTRAINT "bipolar_family_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_family_history"
    ADD CONSTRAINT "bipolar_family_history_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_fast"
    ADD CONSTRAINT "bipolar_fast_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_fast"
    ADD CONSTRAINT "bipolar_fast_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_fluences_verbales"
    ADD CONSTRAINT "bipolar_fluences_verbales_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_fluences_verbales"
    ADD CONSTRAINT "bipolar_fluences_verbales_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_followup_arrets_travail"
    ADD CONSTRAINT "bipolar_followup_arrets_travail_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_followup_arrets_travail"
    ADD CONSTRAINT "bipolar_followup_arrets_travail_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_followup_humeur_actuels"
    ADD CONSTRAINT "bipolar_followup_humeur_actuels_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_followup_humeur_actuels"
    ADD CONSTRAINT "bipolar_followup_humeur_actuels_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_followup_humeur_depuis_visite"
    ADD CONSTRAINT "bipolar_followup_humeur_depuis_visite_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_followup_humeur_depuis_visite"
    ADD CONSTRAINT "bipolar_followup_humeur_depuis_visite_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_followup_isa"
    ADD CONSTRAINT "bipolar_followup_isa_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_followup_isa"
    ADD CONSTRAINT "bipolar_followup_isa_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_followup_psychotiques"
    ADD CONSTRAINT "bipolar_followup_psychotiques_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_followup_psychotiques"
    ADD CONSTRAINT "bipolar_followup_psychotiques_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_followup_recours_aux_soins"
    ADD CONSTRAINT "bipolar_followup_recours_aux_soins_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_followup_recours_aux_soins"
    ADD CONSTRAINT "bipolar_followup_recours_aux_soins_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_followup_somatique_contraceptif"
    ADD CONSTRAINT "bipolar_followup_somatique_contraceptif_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_followup_somatique_contraceptif"
    ADD CONSTRAINT "bipolar_followup_somatique_contraceptif_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_followup_statut_professionnel"
    ADD CONSTRAINT "bipolar_followup_statut_professionnel_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_followup_statut_professionnel"
    ADD CONSTRAINT "bipolar_followup_statut_professionnel_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_followup_suicide_behavior"
    ADD CONSTRAINT "bipolar_followup_suicide_behavior_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_followup_suicide_behavior"
    ADD CONSTRAINT "bipolar_followup_suicide_behavior_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_followup_suivi_recommandations"
    ADD CONSTRAINT "bipolar_followup_suivi_recommandations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_followup_suivi_recommandations"
    ADD CONSTRAINT "bipolar_followup_suivi_recommandations_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_followup_traitement_non_pharma"
    ADD CONSTRAINT "bipolar_followup_traitement_non_pharma_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_followup_traitement_non_pharma"
    ADD CONSTRAINT "bipolar_followup_traitement_non_pharma_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_isa"
    ADD CONSTRAINT "bipolar_isa_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_isa"
    ADD CONSTRAINT "bipolar_isa_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_madrs"
    ADD CONSTRAINT "bipolar_madrs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_madrs"
    ADD CONSTRAINT "bipolar_madrs_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_mars"
    ADD CONSTRAINT "bipolar_mars_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_mars"
    ADD CONSTRAINT "bipolar_mars_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_mathys"
    ADD CONSTRAINT "bipolar_mathys_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_mathys"
    ADD CONSTRAINT "bipolar_mathys_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_mdq"
    ADD CONSTRAINT "bipolar_mdq_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_mdq"
    ADD CONSTRAINT "bipolar_mdq_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_mem3_spatial"
    ADD CONSTRAINT "bipolar_mem3_spatial_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_mem3_spatial"
    ADD CONSTRAINT "bipolar_mem3_spatial_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_non_pharmacologic"
    ADD CONSTRAINT "bipolar_non_pharmacologic_patient_id_key" UNIQUE ("patient_id");



ALTER TABLE ONLY "public"."bipolar_non_pharmacologic"
    ADD CONSTRAINT "bipolar_non_pharmacologic_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_orientation"
    ADD CONSTRAINT "bipolar_orientation_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_orientation"
    ADD CONSTRAINT "bipolar_orientation_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_patho_allergique"
    ADD CONSTRAINT "bipolar_patho_allergique_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_patho_allergique"
    ADD CONSTRAINT "bipolar_patho_allergique_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_patho_cardio"
    ADD CONSTRAINT "bipolar_patho_cardio_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_patho_cardio"
    ADD CONSTRAINT "bipolar_patho_cardio_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_patho_dermato"
    ADD CONSTRAINT "bipolar_patho_dermato_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_patho_dermato"
    ADD CONSTRAINT "bipolar_patho_dermato_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_patho_endoc"
    ADD CONSTRAINT "bipolar_patho_endoc_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_patho_endoc"
    ADD CONSTRAINT "bipolar_patho_endoc_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_patho_hepato_gastro"
    ADD CONSTRAINT "bipolar_patho_hepato_gastro_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_patho_hepato_gastro"
    ADD CONSTRAINT "bipolar_patho_hepato_gastro_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_patho_neuro"
    ADD CONSTRAINT "bipolar_patho_neuro_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_patho_neuro"
    ADD CONSTRAINT "bipolar_patho_neuro_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_patho_urinaire"
    ADD CONSTRAINT "bipolar_patho_urinaire_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_patho_urinaire"
    ADD CONSTRAINT "bipolar_patho_urinaire_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_perinatalite"
    ADD CONSTRAINT "bipolar_perinatalite_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_perinatalite"
    ADD CONSTRAINT "bipolar_perinatalite_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_prise_m"
    ADD CONSTRAINT "bipolar_prise_m_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_prise_m"
    ADD CONSTRAINT "bipolar_prise_m_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_psqi"
    ADD CONSTRAINT "bipolar_psqi_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_psqi"
    ADD CONSTRAINT "bipolar_psqi_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_psychotropes_lifetime"
    ADD CONSTRAINT "bipolar_psychotropes_lifetime_patient_id_key" UNIQUE ("patient_id");



ALTER TABLE ONLY "public"."bipolar_psychotropes_lifetime"
    ADD CONSTRAINT "bipolar_psychotropes_lifetime_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_qids_sr16"
    ADD CONSTRAINT "bipolar_qids_sr16_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_qids_sr16"
    ADD CONSTRAINT "bipolar_qids_sr16_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_scip"
    ADD CONSTRAINT "bipolar_scip_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_scip"
    ADD CONSTRAINT "bipolar_scip_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_sis"
    ADD CONSTRAINT "bipolar_sis_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_sis"
    ADD CONSTRAINT "bipolar_sis_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_social"
    ADD CONSTRAINT "bipolar_social_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_social"
    ADD CONSTRAINT "bipolar_social_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_stai_ya"
    ADD CONSTRAINT "bipolar_stai_ya_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_stai_ya"
    ADD CONSTRAINT "bipolar_stai_ya_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_stroop"
    ADD CONSTRAINT "bipolar_stroop_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_stroop"
    ADD CONSTRAINT "bipolar_stroop_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_suicide_history"
    ADD CONSTRAINT "bipolar_suicide_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_suicide_history"
    ADD CONSTRAINT "bipolar_suicide_history_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_test_commissions"
    ADD CONSTRAINT "bipolar_test_commissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_test_commissions"
    ADD CONSTRAINT "bipolar_test_commissions_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_tmt"
    ADD CONSTRAINT "bipolar_tmt_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_tmt"
    ADD CONSTRAINT "bipolar_tmt_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_wais3_code_symboles"
    ADD CONSTRAINT "bipolar_wais3_code_symboles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_wais3_code_symboles"
    ADD CONSTRAINT "bipolar_wais3_code_symboles_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_wais3_cpt2"
    ADD CONSTRAINT "bipolar_wais3_cpt2_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_wais3_cpt2"
    ADD CONSTRAINT "bipolar_wais3_cpt2_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_wais3_criteria"
    ADD CONSTRAINT "bipolar_wais3_criteria_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_wais3_criteria"
    ADD CONSTRAINT "bipolar_wais3_criteria_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_wais3_digit_span"
    ADD CONSTRAINT "bipolar_wais3_digit_span_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_wais3_digit_span"
    ADD CONSTRAINT "bipolar_wais3_digit_span_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_wais3_learning"
    ADD CONSTRAINT "bipolar_wais3_learning_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_wais3_learning"
    ADD CONSTRAINT "bipolar_wais3_learning_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_wais3_matrices"
    ADD CONSTRAINT "bipolar_wais3_matrices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_wais3_matrices"
    ADD CONSTRAINT "bipolar_wais3_matrices_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_wais3_vocabulaire"
    ADD CONSTRAINT "bipolar_wais3_vocabulaire_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_wais3_vocabulaire"
    ADD CONSTRAINT "bipolar_wais3_vocabulaire_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_wais4_code"
    ADD CONSTRAINT "bipolar_wais4_code_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_wais4_code"
    ADD CONSTRAINT "bipolar_wais4_code_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_wais4_criteria"
    ADD CONSTRAINT "bipolar_wais4_criteria_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_wais4_criteria"
    ADD CONSTRAINT "bipolar_wais4_criteria_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_wais4_digit_span"
    ADD CONSTRAINT "bipolar_wais4_digit_span_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_wais4_digit_span"
    ADD CONSTRAINT "bipolar_wais4_digit_span_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_wais4_learning"
    ADD CONSTRAINT "bipolar_wais4_learning_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_wais4_learning"
    ADD CONSTRAINT "bipolar_wais4_learning_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_wais4_matrices"
    ADD CONSTRAINT "bipolar_wais4_matrices_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_wais4_matrices"
    ADD CONSTRAINT "bipolar_wais4_matrices_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_wais4_similitudes"
    ADD CONSTRAINT "bipolar_wais4_similitudes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_wais4_similitudes"
    ADD CONSTRAINT "bipolar_wais4_similitudes_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_wurs25"
    ADD CONSTRAINT "bipolar_wurs25_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_wurs25"
    ADD CONSTRAINT "bipolar_wurs25_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_ymrs"
    ADD CONSTRAINT "bipolar_ymrs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_ymrs"
    ADD CONSTRAINT "bipolar_ymrs_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."center_pathologies"
    ADD CONSTRAINT "center_pathologies_center_id_pathology_id_key" UNIQUE ("center_id", "pathology_id");



ALTER TABLE ONLY "public"."center_pathologies"
    ADD CONSTRAINT "center_pathologies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."centers"
    ADD CONSTRAINT "centers_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."centers"
    ADD CONSTRAINT "centers_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."evaluations"
    ADD CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."login_history"
    ADD CONSTRAINT "login_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pathologies"
    ADD CONSTRAINT "pathologies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."pathologies"
    ADD CONSTRAINT "pathologies_type_key" UNIQUE ("type");



ALTER TABLE ONLY "public"."patient_medications"
    ADD CONSTRAINT "patient_medications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."patients"
    ADD CONSTRAINT "patients_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."patients"
    ADD CONSTRAINT "patients_user_id_unique" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_code_key" UNIQUE ("code");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."permissions"
    ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."recent_accesses"
    ADD CONSTRAINT "recent_accesses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."recent_accesses"
    ADD CONSTRAINT "recent_accesses_user_id_patient_id_key" UNIQUE ("user_id", "patient_id");



ALTER TABLE ONLY "public"."bipolar_nurse_biological_assessment"
    ADD CONSTRAINT "responses_biological_assessment_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_nurse_biological_assessment"
    ADD CONSTRAINT "responses_biological_assessment_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_nurse_blood_pressure"
    ADD CONSTRAINT "responses_blood_pressure_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_nurse_blood_pressure"
    ADD CONSTRAINT "responses_blood_pressure_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_nurse_ecg"
    ADD CONSTRAINT "responses_ecg_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_nurse_ecg"
    ADD CONSTRAINT "responses_ecg_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_nurse_fagerstrom"
    ADD CONSTRAINT "responses_fagerstrom_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_nurse_fagerstrom"
    ADD CONSTRAINT "responses_fagerstrom_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_nurse_physical_params"
    ADD CONSTRAINT "responses_physical_params_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_nurse_physical_params"
    ADD CONSTRAINT "responses_physical_params_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_nurse_sleep_apnea"
    ADD CONSTRAINT "responses_sleep_apnea_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_nurse_sleep_apnea"
    ADD CONSTRAINT "responses_sleep_apnea_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."bipolar_nurse_tobacco"
    ADD CONSTRAINT "responses_tobacco_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."bipolar_nurse_tobacco"
    ADD CONSTRAINT "responses_tobacco_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_aims"
    ADD CONSTRAINT "schizophrenia_aims_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_aims"
    ADD CONSTRAINT "schizophrenia_aims_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_antecedents_familiaux_psy"
    ADD CONSTRAINT "schizophrenia_antecedents_familiaux_psy_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_antecedents_familiaux_psy"
    ADD CONSTRAINT "schizophrenia_antecedents_familiaux_psy_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_barnes"
    ADD CONSTRAINT "schizophrenia_barnes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_barnes"
    ADD CONSTRAINT "schizophrenia_barnes_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_bars"
    ADD CONSTRAINT "schizophrenia_bars_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_bars"
    ADD CONSTRAINT "schizophrenia_bars_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_bilan_biologique"
    ADD CONSTRAINT "schizophrenia_bilan_biologique_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_bilan_biologique"
    ADD CONSTRAINT "schizophrenia_bilan_biologique_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_cdss"
    ADD CONSTRAINT "schizophrenia_cdss_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_cdss"
    ADD CONSTRAINT "schizophrenia_cdss_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_dossier_infirmier"
    ADD CONSTRAINT "schizophrenia_dossier_infirmier_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_dossier_infirmier"
    ADD CONSTRAINT "schizophrenia_dossier_infirmier_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_ecv"
    ADD CONSTRAINT "schizophrenia_ecv_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_ecv"
    ADD CONSTRAINT "schizophrenia_ecv_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_eval_addictologique"
    ADD CONSTRAINT "schizophrenia_eval_addictologique_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_eval_addictologique"
    ADD CONSTRAINT "schizophrenia_eval_addictologique_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_isa"
    ADD CONSTRAINT "schizophrenia_isa_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_isa"
    ADD CONSTRAINT "schizophrenia_isa_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_panss"
    ADD CONSTRAINT "schizophrenia_panss_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_panss"
    ADD CONSTRAINT "schizophrenia_panss_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_perinatalite"
    ADD CONSTRAINT "schizophrenia_perinatalite_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_perinatalite"
    ADD CONSTRAINT "schizophrenia_perinatalite_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_psp"
    ADD CONSTRAINT "schizophrenia_psp_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_psp"
    ADD CONSTRAINT "schizophrenia_psp_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_sas"
    ADD CONSTRAINT "schizophrenia_sas_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_sas"
    ADD CONSTRAINT "schizophrenia_sas_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_screening_diagnostic"
    ADD CONSTRAINT "schizophrenia_screening_diagnostic_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_screening_diagnostic"
    ADD CONSTRAINT "schizophrenia_screening_diagnostic_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_screening_orientation"
    ADD CONSTRAINT "schizophrenia_screening_orientation_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_screening_orientation"
    ADD CONSTRAINT "schizophrenia_screening_orientation_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_suicide_history"
    ADD CONSTRAINT "schizophrenia_suicide_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_suicide_history"
    ADD CONSTRAINT "schizophrenia_suicide_history_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_sumd"
    ADD CONSTRAINT "schizophrenia_sumd_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_sumd"
    ADD CONSTRAINT "schizophrenia_sumd_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_tea_coffee"
    ADD CONSTRAINT "schizophrenia_tea_coffee_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_tea_coffee"
    ADD CONSTRAINT "schizophrenia_tea_coffee_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_troubles_comorbides"
    ADD CONSTRAINT "schizophrenia_troubles_comorbides_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_troubles_comorbides"
    ADD CONSTRAINT "schizophrenia_troubles_comorbides_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."schizophrenia_troubles_psychotiques"
    ADD CONSTRAINT "schizophrenia_troubles_psychotiques_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."schizophrenia_troubles_psychotiques"
    ADD CONSTRAINT "schizophrenia_troubles_psychotiques_visit_id_key" UNIQUE ("visit_id");



ALTER TABLE ONLY "public"."treatment_somatic_contraceptive"
    ADD CONSTRAINT "treatment_somatic_contraceptive_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_invitations"
    ADD CONSTRAINT "user_invitations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_invitations"
    ADD CONSTRAINT "user_invitations_token_key" UNIQUE ("token");



ALTER TABLE ONLY "public"."user_permissions"
    ADD CONSTRAINT "user_permissions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_permissions"
    ADD CONSTRAINT "user_permissions_user_id_permission_id_key" UNIQUE ("user_id", "permission_id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."visit_templates"
    ADD CONSTRAINT "visit_templates_pathology_id_visit_type_key" UNIQUE ("pathology_id", "visit_type");



ALTER TABLE ONLY "public"."visit_templates"
    ADD CONSTRAINT "visit_templates_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."visits"
    ADD CONSTRAINT "visits_pkey" PRIMARY KEY ("id");



CREATE INDEX "idx_audit_logs_action" ON "public"."audit_logs" USING "btree" ("action");



CREATE INDEX "idx_audit_logs_center" ON "public"."audit_logs" USING "btree" ("center_id");



CREATE INDEX "idx_audit_logs_created_at" ON "public"."audit_logs" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_audit_logs_entity" ON "public"."audit_logs" USING "btree" ("entity_type", "entity_id");



CREATE INDEX "idx_audit_logs_user" ON "public"."audit_logs" USING "btree" ("user_id");



CREATE INDEX "idx_bipolar_aim_patient_id" ON "public"."bipolar_aim" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_aim_visit_id" ON "public"."bipolar_aim" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_alda_patient_id" ON "public"."bipolar_alda" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_alda_visit_id" ON "public"."bipolar_alda" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_als18_patient_id" ON "public"."bipolar_als18" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_als18_visit_id" ON "public"."bipolar_als18" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_antecedents_gyneco_patient_id" ON "public"."bipolar_antecedents_gyneco" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_antecedents_gyneco_visit_id" ON "public"."bipolar_antecedents_gyneco" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_aq12_patient_id" ON "public"."bipolar_aq12" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_aq12_visit_id" ON "public"."bipolar_aq12" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_asrm_patient_id" ON "public"."bipolar_asrm" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_asrm_visit_id" ON "public"."bipolar_asrm" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_asrs_patient_id" ON "public"."bipolar_asrs" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_asrs_visit_id" ON "public"."bipolar_asrs" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_autres_patho_patient_id" ON "public"."bipolar_autres_patho" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_autres_patho_visit_id" ON "public"."bipolar_autres_patho" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_bis10_patient_id" ON "public"."bipolar_bis10" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_bis10_visit_id" ON "public"."bipolar_bis10" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_cgi_patient_id" ON "public"."bipolar_cgi" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_cgi_visit_id" ON "public"."bipolar_cgi" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_cobra_patient_id" ON "public"."bipolar_cobra" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_cobra_visit_id" ON "public"."bipolar_cobra" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_cpt3_patient_id" ON "public"."bipolar_cpt3" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_cpt3_visit_id" ON "public"."bipolar_cpt3" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_csm_patient_id" ON "public"."bipolar_csm" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_csm_visit_id" ON "public"."bipolar_csm" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_cssrs_patient_id" ON "public"."bipolar_cssrs" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_cssrs_visit_id" ON "public"."bipolar_cssrs" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_cti_patient_id" ON "public"."bipolar_cti" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_cti_visit_id" ON "public"."bipolar_cti" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_ctq_patient_id" ON "public"."bipolar_ctq" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_ctq_visit_id" ON "public"."bipolar_ctq" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_cvlt_patient_id" ON "public"."bipolar_cvlt" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_cvlt_visit_id" ON "public"."bipolar_cvlt" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_diagnostic_patient_id" ON "public"."bipolar_diagnostic" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_diagnostic_visit_id" ON "public"."bipolar_diagnostic" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_diva_patient_id" ON "public"."bipolar_diva" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_diva_visit_id" ON "public"."bipolar_diva" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_dsm5_comorbid_patient_id" ON "public"."bipolar_dsm5_comorbid" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_dsm5_comorbid_visit_id" ON "public"."bipolar_dsm5_comorbid" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_dsm5_humeur_patient_id" ON "public"."bipolar_dsm5_humeur" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_dsm5_humeur_visit_id" ON "public"."bipolar_dsm5_humeur" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_dsm5_psychotic_patient_id" ON "public"."bipolar_dsm5_psychotic" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_dsm5_psychotic_visit_id" ON "public"."bipolar_dsm5_psychotic" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_egf_patient_id" ON "public"."bipolar_egf" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_egf_visit_id" ON "public"."bipolar_egf" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_epworth_patient_id" ON "public"."bipolar_epworth" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_epworth_visit_id" ON "public"."bipolar_epworth" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_eq5d5l_patient_id" ON "public"."bipolar_eq5d5l" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_eq5d5l_visit_id" ON "public"."bipolar_eq5d5l" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_etat_patient_patient_id" ON "public"."bipolar_etat_patient" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_etat_patient_visit_id" ON "public"."bipolar_etat_patient" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_family_history_patient_id" ON "public"."bipolar_family_history" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_family_history_visit_id" ON "public"."bipolar_family_history" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_fast_patient_id" ON "public"."bipolar_fast" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_fast_visit_id" ON "public"."bipolar_fast" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_fluences_verbales_patient_id" ON "public"."bipolar_fluences_verbales" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_fluences_verbales_visit_id" ON "public"."bipolar_fluences_verbales" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_followup_arrets_travail_patient" ON "public"."bipolar_followup_arrets_travail" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_followup_arrets_travail_visit" ON "public"."bipolar_followup_arrets_travail" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_followup_humeur_actuels_patient" ON "public"."bipolar_followup_humeur_actuels" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_followup_humeur_actuels_visit" ON "public"."bipolar_followup_humeur_actuels" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_followup_humeur_depuis_visite_patient" ON "public"."bipolar_followup_humeur_depuis_visite" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_followup_humeur_depuis_visite_visit" ON "public"."bipolar_followup_humeur_depuis_visite" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_followup_isa_patient" ON "public"."bipolar_followup_isa" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_followup_isa_visit" ON "public"."bipolar_followup_isa" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_followup_psychotiques_patient" ON "public"."bipolar_followup_psychotiques" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_followup_psychotiques_visit" ON "public"."bipolar_followup_psychotiques" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_followup_recours_aux_soins_patient" ON "public"."bipolar_followup_recours_aux_soins" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_followup_recours_aux_soins_visit" ON "public"."bipolar_followup_recours_aux_soins" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_followup_somatique_contraceptif_patient" ON "public"."bipolar_followup_somatique_contraceptif" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_followup_somatique_contraceptif_visit" ON "public"."bipolar_followup_somatique_contraceptif" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_followup_statut_professionnel_patient" ON "public"."bipolar_followup_statut_professionnel" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_followup_statut_professionnel_visit" ON "public"."bipolar_followup_statut_professionnel" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_followup_suicide_behavior_patient" ON "public"."bipolar_followup_suicide_behavior" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_followup_suicide_behavior_visit" ON "public"."bipolar_followup_suicide_behavior" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_followup_suivi_recommandations_patient" ON "public"."bipolar_followup_suivi_recommandations" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_followup_suivi_recommandations_visit" ON "public"."bipolar_followup_suivi_recommandations" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_followup_traitement_non_pharma_patient" ON "public"."bipolar_followup_traitement_non_pharma" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_followup_traitement_non_pharma_visit" ON "public"."bipolar_followup_traitement_non_pharma" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_isa_patient_id" ON "public"."bipolar_isa" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_isa_visit_id" ON "public"."bipolar_isa" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_madrs_patient_id" ON "public"."bipolar_madrs" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_madrs_visit_id" ON "public"."bipolar_madrs" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_mars_patient_id" ON "public"."bipolar_mars" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_mars_visit_id" ON "public"."bipolar_mars" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_mathys_patient_id" ON "public"."bipolar_mathys" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_mathys_visit_id" ON "public"."bipolar_mathys" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_mdq_patient_id" ON "public"."bipolar_mdq" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_mdq_visit_id" ON "public"."bipolar_mdq" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_mem3_spatial_patient_id" ON "public"."bipolar_mem3_spatial" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_mem3_spatial_visit_id" ON "public"."bipolar_mem3_spatial" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_non_pharmacologic_patient_id" ON "public"."bipolar_non_pharmacologic" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_orientation_patient_id" ON "public"."bipolar_orientation" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_orientation_visit_id" ON "public"."bipolar_orientation" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_patho_allergique_patient_id" ON "public"."bipolar_patho_allergique" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_patho_allergique_visit_id" ON "public"."bipolar_patho_allergique" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_patho_cardio_patient_id" ON "public"."bipolar_patho_cardio" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_patho_cardio_visit_id" ON "public"."bipolar_patho_cardio" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_patho_dermato_patient_id" ON "public"."bipolar_patho_dermato" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_patho_dermato_visit_id" ON "public"."bipolar_patho_dermato" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_patho_endoc_patient_id" ON "public"."bipolar_patho_endoc" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_patho_endoc_visit_id" ON "public"."bipolar_patho_endoc" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_patho_hepato_gastro_patient_id" ON "public"."bipolar_patho_hepato_gastro" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_patho_hepato_gastro_visit_id" ON "public"."bipolar_patho_hepato_gastro" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_patho_neuro_patient_id" ON "public"."bipolar_patho_neuro" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_patho_neuro_visit_id" ON "public"."bipolar_patho_neuro" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_patho_urinaire_patient_id" ON "public"."bipolar_patho_urinaire" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_patho_urinaire_visit_id" ON "public"."bipolar_patho_urinaire" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_perinatalite_patient_id" ON "public"."bipolar_perinatalite" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_perinatalite_visit_id" ON "public"."bipolar_perinatalite" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_prise_m_patient_id" ON "public"."bipolar_prise_m" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_prise_m_visit_id" ON "public"."bipolar_prise_m" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_psqi_patient_id" ON "public"."bipolar_psqi" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_psqi_visit_id" ON "public"."bipolar_psqi" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_psychotropes_lifetime_patient_id" ON "public"."bipolar_psychotropes_lifetime" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_qids_sr16_patient_id" ON "public"."bipolar_qids_sr16" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_qids_sr16_visit_id" ON "public"."bipolar_qids_sr16" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_scip_patient_id" ON "public"."bipolar_scip" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_scip_visit_id" ON "public"."bipolar_scip" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_sis_patient_id" ON "public"."bipolar_sis" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_sis_visit_id" ON "public"."bipolar_sis" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_social_patient_id" ON "public"."bipolar_social" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_social_visit_id" ON "public"."bipolar_social" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_stai_ya_patient_id" ON "public"."bipolar_stai_ya" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_stai_ya_visit_id" ON "public"."bipolar_stai_ya" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_stroop_patient_id" ON "public"."bipolar_stroop" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_stroop_visit_id" ON "public"."bipolar_stroop" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_suicide_history_patient_id" ON "public"."bipolar_suicide_history" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_suicide_history_visit_id" ON "public"."bipolar_suicide_history" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_test_commissions_patient_id" ON "public"."bipolar_test_commissions" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_test_commissions_visit_id" ON "public"."bipolar_test_commissions" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_tmt_patient_id" ON "public"."bipolar_tmt" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_tmt_visit_id" ON "public"."bipolar_tmt" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_wais3_code_symboles_patient_id" ON "public"."bipolar_wais3_code_symboles" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_wais3_code_symboles_visit_id" ON "public"."bipolar_wais3_code_symboles" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_wais3_cpt2_patient_id" ON "public"."bipolar_wais3_cpt2" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_wais3_cpt2_visit_id" ON "public"."bipolar_wais3_cpt2" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_wais3_criteria_patient_id" ON "public"."bipolar_wais3_criteria" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_wais3_criteria_visit_id" ON "public"."bipolar_wais3_criteria" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_wais3_digit_span_patient_id" ON "public"."bipolar_wais3_digit_span" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_wais3_digit_span_visit_id" ON "public"."bipolar_wais3_digit_span" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_wais3_learning_patient_id" ON "public"."bipolar_wais3_learning" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_wais3_learning_visit_id" ON "public"."bipolar_wais3_learning" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_wais3_matrices_patient_id" ON "public"."bipolar_wais3_matrices" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_wais3_matrices_visit_id" ON "public"."bipolar_wais3_matrices" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_wais3_vocabulaire_patient_id" ON "public"."bipolar_wais3_vocabulaire" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_wais3_vocabulaire_visit_id" ON "public"."bipolar_wais3_vocabulaire" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_wais4_code_patient_id" ON "public"."bipolar_wais4_code" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_wais4_code_visit_id" ON "public"."bipolar_wais4_code" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_wais4_criteria_patient_id" ON "public"."bipolar_wais4_criteria" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_wais4_criteria_visit_id" ON "public"."bipolar_wais4_criteria" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_wais4_digit_span_patient_id" ON "public"."bipolar_wais4_digit_span" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_wais4_digit_span_visit_id" ON "public"."bipolar_wais4_digit_span" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_wais4_learning_patient_id" ON "public"."bipolar_wais4_learning" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_wais4_learning_visit_id" ON "public"."bipolar_wais4_learning" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_wais4_matrices_patient_id" ON "public"."bipolar_wais4_matrices" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_wais4_matrices_visit_id" ON "public"."bipolar_wais4_matrices" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_wais4_similitudes_patient_id" ON "public"."bipolar_wais4_similitudes" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_wais4_similitudes_visit_id" ON "public"."bipolar_wais4_similitudes" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_wurs25_patient_id" ON "public"."bipolar_wurs25" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_wurs25_visit_id" ON "public"."bipolar_wurs25" USING "btree" ("visit_id");



CREATE INDEX "idx_bipolar_ymrs_patient_id" ON "public"."bipolar_ymrs" USING "btree" ("patient_id");



CREATE INDEX "idx_bipolar_ymrs_visit_id" ON "public"."bipolar_ymrs" USING "btree" ("visit_id");



CREATE INDEX "idx_center_pathologies_center" ON "public"."center_pathologies" USING "btree" ("center_id");



CREATE INDEX "idx_center_pathologies_pathology" ON "public"."center_pathologies" USING "btree" ("pathology_id");



CREATE INDEX "idx_centers_active" ON "public"."centers" USING "btree" ("active");



CREATE INDEX "idx_centers_code" ON "public"."centers" USING "btree" ("code");



CREATE INDEX "idx_evaluations_date" ON "public"."evaluations" USING "btree" ("evaluation_date");



CREATE INDEX "idx_evaluations_evaluator" ON "public"."evaluations" USING "btree" ("evaluator_id");



CREATE INDEX "idx_evaluations_patient" ON "public"."evaluations" USING "btree" ("patient_id");



CREATE INDEX "idx_evaluations_visit" ON "public"."evaluations" USING "btree" ("visit_id");



CREATE INDEX "idx_invitations_email" ON "public"."user_invitations" USING "btree" ("email");



CREATE INDEX "idx_invitations_patient_id" ON "public"."user_invitations" USING "btree" ("patient_id");



CREATE INDEX "idx_invitations_status" ON "public"."user_invitations" USING "btree" ("status");



CREATE INDEX "idx_invitations_token" ON "public"."user_invitations" USING "btree" ("token");



CREATE INDEX "idx_login_history_created_at" ON "public"."login_history" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_login_history_success" ON "public"."login_history" USING "btree" ("success");



CREATE INDEX "idx_login_history_user" ON "public"."login_history" USING "btree" ("user_id");



CREATE INDEX "idx_messages_created_at" ON "public"."messages" USING "btree" ("created_at" DESC);



CREATE INDEX "idx_messages_patient" ON "public"."messages" USING "btree" ("patient_id");



CREATE INDEX "idx_messages_read" ON "public"."messages" USING "btree" ("read");



CREATE INDEX "idx_messages_recipient" ON "public"."messages" USING "btree" ("recipient_id");



CREATE INDEX "idx_messages_sender" ON "public"."messages" USING "btree" ("sender_id");



CREATE INDEX "idx_patient_medications_dates" ON "public"."patient_medications" USING "btree" ("start_date", "end_date");



CREATE INDEX "idx_patient_medications_ongoing" ON "public"."patient_medications" USING "btree" ("patient_id", "is_ongoing");



CREATE INDEX "idx_patient_medications_patient" ON "public"."patient_medications" USING "btree" ("patient_id");



CREATE INDEX "idx_patients_active" ON "public"."patients" USING "btree" ("active");



CREATE INDEX "idx_patients_center" ON "public"."patients" USING "btree" ("center_id");



CREATE INDEX "idx_patients_created_by" ON "public"."patients" USING "btree" ("created_by");



CREATE INDEX "idx_patients_deleted_at" ON "public"."patients" USING "btree" ("deleted_at");



CREATE INDEX "idx_patients_deleted_by" ON "public"."patients" USING "btree" ("deleted_by");



CREATE INDEX "idx_patients_mrn" ON "public"."patients" USING "btree" ("medical_record_number");



CREATE INDEX "idx_patients_pathology" ON "public"."patients" USING "btree" ("pathology_id");



CREATE UNIQUE INDEX "idx_patients_unique_identity" ON "public"."patients" USING "btree" ("center_id", "lower"(TRIM(BOTH FROM "first_name")), "lower"(TRIM(BOTH FROM "last_name")), "date_of_birth", "lower"(COALESCE(TRIM(BOTH FROM "place_of_birth"), ''::"text"))) WHERE (("active" = true) AND ("deleted_at" IS NULL));



CREATE INDEX "idx_patients_user_id" ON "public"."patients" USING "btree" ("user_id");



CREATE INDEX "idx_permissions_category" ON "public"."permissions" USING "btree" ("category");



CREATE INDEX "idx_permissions_code" ON "public"."permissions" USING "btree" ("code");



CREATE INDEX "idx_recent_accesses_patient" ON "public"."recent_accesses" USING "btree" ("patient_id");



CREATE INDEX "idx_recent_accesses_timestamp" ON "public"."recent_accesses" USING "btree" ("accessed_at" DESC);



CREATE INDEX "idx_recent_accesses_user" ON "public"."recent_accesses" USING "btree" ("user_id");



CREATE INDEX "idx_responses_biological_assessment_patient_id" ON "public"."bipolar_nurse_biological_assessment" USING "btree" ("patient_id");



CREATE INDEX "idx_responses_biological_assessment_visit_id" ON "public"."bipolar_nurse_biological_assessment" USING "btree" ("visit_id");



CREATE INDEX "idx_responses_blood_pressure_patient_id" ON "public"."bipolar_nurse_blood_pressure" USING "btree" ("patient_id");



CREATE INDEX "idx_responses_blood_pressure_visit_id" ON "public"."bipolar_nurse_blood_pressure" USING "btree" ("visit_id");



CREATE INDEX "idx_responses_ecg_patient_id" ON "public"."bipolar_nurse_ecg" USING "btree" ("patient_id");



CREATE INDEX "idx_responses_ecg_visit_id" ON "public"."bipolar_nurse_ecg" USING "btree" ("visit_id");



CREATE INDEX "idx_responses_fagerstrom_patient_id" ON "public"."bipolar_nurse_fagerstrom" USING "btree" ("patient_id");



CREATE INDEX "idx_responses_fagerstrom_visit_id" ON "public"."bipolar_nurse_fagerstrom" USING "btree" ("visit_id");



CREATE INDEX "idx_responses_physical_params_patient_id" ON "public"."bipolar_nurse_physical_params" USING "btree" ("patient_id");



CREATE INDEX "idx_responses_physical_params_visit_id" ON "public"."bipolar_nurse_physical_params" USING "btree" ("visit_id");



CREATE INDEX "idx_responses_sleep_apnea_patient_id" ON "public"."bipolar_nurse_sleep_apnea" USING "btree" ("patient_id");



CREATE INDEX "idx_responses_sleep_apnea_visit_id" ON "public"."bipolar_nurse_sleep_apnea" USING "btree" ("visit_id");



CREATE INDEX "idx_responses_tobacco_patient_id" ON "public"."bipolar_nurse_tobacco" USING "btree" ("patient_id");



CREATE INDEX "idx_responses_tobacco_visit_id" ON "public"."bipolar_nurse_tobacco" USING "btree" ("visit_id");



CREATE INDEX "idx_treatment_somatic_contraceptive_created" ON "public"."treatment_somatic_contraceptive" USING "btree" ("created_at");



CREATE INDEX "idx_treatment_somatic_contraceptive_patient" ON "public"."treatment_somatic_contraceptive" USING "btree" ("patient_id");



CREATE INDEX "idx_user_permissions_permission" ON "public"."user_permissions" USING "btree" ("permission_id");



CREATE INDEX "idx_user_permissions_user" ON "public"."user_permissions" USING "btree" ("user_id");



CREATE INDEX "idx_user_profiles_active" ON "public"."user_profiles" USING "btree" ("active");



CREATE INDEX "idx_user_profiles_center" ON "public"."user_profiles" USING "btree" ("center_id");



CREATE INDEX "idx_user_profiles_email" ON "public"."user_profiles" USING "btree" ("email");



CREATE INDEX "idx_user_profiles_role" ON "public"."user_profiles" USING "btree" ("role");



CREATE INDEX "idx_user_profiles_username" ON "public"."user_profiles" USING "btree" ("username");



CREATE INDEX "idx_visit_templates_pathology" ON "public"."visit_templates" USING "btree" ("pathology_id");



CREATE INDEX "idx_visit_templates_type" ON "public"."visit_templates" USING "btree" ("visit_type");



CREATE INDEX "idx_visits_completion" ON "public"."visits" USING "btree" ("completion_percentage");



CREATE INDEX "idx_visits_conducted_by" ON "public"."visits" USING "btree" ("conducted_by");



CREATE INDEX "idx_visits_patient" ON "public"."visits" USING "btree" ("patient_id");



CREATE INDEX "idx_visits_scheduled_date" ON "public"."visits" USING "btree" ("scheduled_date");



CREATE INDEX "idx_visits_status" ON "public"."visits" USING "btree" ("status");



CREATE INDEX "idx_visits_template" ON "public"."visits" USING "btree" ("visit_template_id");



CREATE UNIQUE INDEX "patients_active_mrn_unique" ON "public"."patients" USING "btree" ("medical_record_number") WHERE ("active" = true);



COMMENT ON INDEX "public"."patients_active_mrn_unique" IS 'Ensures MRN uniqueness only for active patients, allowing reuse after deletion';



CREATE OR REPLACE VIEW "public"."v_users_full" WITH ("security_invoker"='true') AS
 SELECT "up"."id",
    "up"."role",
    "up"."first_name",
    "up"."last_name",
    "up"."email",
    "up"."phone",
    "up"."username",
    "up"."active",
    "up"."created_at",
    "c"."id" AS "center_id",
    "c"."name" AS "center_name",
    "c"."code" AS "center_code",
    "array_agg"(DISTINCT "p"."type") FILTER (WHERE ("p"."type" IS NOT NULL)) AS "center_pathologies"
   FROM ((("public"."user_profiles" "up"
     LEFT JOIN "public"."centers" "c" ON (("up"."center_id" = "c"."id")))
     LEFT JOIN "public"."center_pathologies" "cp" ON (("c"."id" = "cp"."center_id")))
     LEFT JOIN "public"."pathologies" "p" ON (("cp"."pathology_id" = "p"."id")))
  GROUP BY "up"."id", "c"."id", "c"."name", "c"."code";



CREATE OR REPLACE TRIGGER "update_bipolar_antecedents_gyneco_updated_at" BEFORE UPDATE ON "public"."bipolar_antecedents_gyneco" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_autres_patho_updated_at" BEFORE UPDATE ON "public"."bipolar_autres_patho" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_cobra_updated_at" BEFORE UPDATE ON "public"."bipolar_cobra" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_cpt3_updated_at" BEFORE UPDATE ON "public"."bipolar_cpt3" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_cssrs_updated_at" BEFORE UPDATE ON "public"."bipolar_cssrs" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_cvlt_updated_at" BEFORE UPDATE ON "public"."bipolar_cvlt" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_diva_updated_at" BEFORE UPDATE ON "public"."bipolar_diva" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_dsm5_comorbid_updated_at" BEFORE UPDATE ON "public"."bipolar_dsm5_comorbid" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_dsm5_humeur_updated_at" BEFORE UPDATE ON "public"."bipolar_dsm5_humeur" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_dsm5_psychotic_updated_at" BEFORE UPDATE ON "public"."bipolar_dsm5_psychotic" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_family_history_updated_at" BEFORE UPDATE ON "public"."bipolar_family_history" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_fluences_verbales_updated_at" BEFORE UPDATE ON "public"."bipolar_fluences_verbales" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_isa_updated_at" BEFORE UPDATE ON "public"."bipolar_isa" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_mem3_spatial_updated_at" BEFORE UPDATE ON "public"."bipolar_mem3_spatial" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_patho_allergique_updated_at" BEFORE UPDATE ON "public"."bipolar_patho_allergique" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_patho_cardio_updated_at" BEFORE UPDATE ON "public"."bipolar_patho_cardio" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_patho_dermato_updated_at" BEFORE UPDATE ON "public"."bipolar_patho_dermato" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_patho_endoc_updated_at" BEFORE UPDATE ON "public"."bipolar_patho_endoc" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_patho_hepato_gastro_updated_at" BEFORE UPDATE ON "public"."bipolar_patho_hepato_gastro" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_patho_neuro_updated_at" BEFORE UPDATE ON "public"."bipolar_patho_neuro" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_patho_urinaire_updated_at" BEFORE UPDATE ON "public"."bipolar_patho_urinaire" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_perinatalite_updated_at" BEFORE UPDATE ON "public"."bipolar_perinatalite" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_scip_updated_at" BEFORE UPDATE ON "public"."bipolar_scip" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_sis_updated_at" BEFORE UPDATE ON "public"."bipolar_sis" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_stroop_updated_at" BEFORE UPDATE ON "public"."bipolar_stroop" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_suicide_history_updated_at" BEFORE UPDATE ON "public"."bipolar_suicide_history" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_test_commissions_updated_at" BEFORE UPDATE ON "public"."bipolar_test_commissions" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_tmt_updated_at" BEFORE UPDATE ON "public"."bipolar_tmt" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_wais3_code_symboles_updated_at" BEFORE UPDATE ON "public"."bipolar_wais3_code_symboles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_wais3_cpt2_updated_at" BEFORE UPDATE ON "public"."bipolar_wais3_cpt2" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_wais3_criteria_updated_at" BEFORE UPDATE ON "public"."bipolar_wais3_criteria" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_wais3_digit_span_updated_at" BEFORE UPDATE ON "public"."bipolar_wais3_digit_span" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_wais3_learning_updated_at" BEFORE UPDATE ON "public"."bipolar_wais3_learning" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_wais3_matrices_updated_at" BEFORE UPDATE ON "public"."bipolar_wais3_matrices" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_wais3_vocabulaire_updated_at" BEFORE UPDATE ON "public"."bipolar_wais3_vocabulaire" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_wais4_code_updated_at" BEFORE UPDATE ON "public"."bipolar_wais4_code" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_wais4_criteria_updated_at" BEFORE UPDATE ON "public"."bipolar_wais4_criteria" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_wais4_digit_span_updated_at" BEFORE UPDATE ON "public"."bipolar_wais4_digit_span" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_wais4_learning_updated_at" BEFORE UPDATE ON "public"."bipolar_wais4_learning" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_wais4_matrices_updated_at" BEFORE UPDATE ON "public"."bipolar_wais4_matrices" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_bipolar_wais4_similitudes_updated_at" BEFORE UPDATE ON "public"."bipolar_wais4_similitudes" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_centers_updated_at" BEFORE UPDATE ON "public"."centers" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_evaluations_updated_at" BEFORE UPDATE ON "public"."evaluations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_invitations_updated_at" BEFORE UPDATE ON "public"."user_invitations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_patients_updated_at" BEFORE UPDATE ON "public"."patients" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_responses_biological_assessment_updated_at" BEFORE UPDATE ON "public"."bipolar_nurse_biological_assessment" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_responses_blood_pressure_updated_at" BEFORE UPDATE ON "public"."bipolar_nurse_blood_pressure" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_responses_ecg_updated_at" BEFORE UPDATE ON "public"."bipolar_nurse_ecg" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_responses_fagerstrom_updated_at" BEFORE UPDATE ON "public"."bipolar_nurse_fagerstrom" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_responses_physical_params_updated_at" BEFORE UPDATE ON "public"."bipolar_nurse_physical_params" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_responses_sleep_apnea_updated_at" BEFORE UPDATE ON "public"."bipolar_nurse_sleep_apnea" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_responses_tobacco_updated_at" BEFORE UPDATE ON "public"."bipolar_nurse_tobacco" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_user_profiles_updated_at" BEFORE UPDATE ON "public"."user_profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_visit_templates_updated_at" BEFORE UPDATE ON "public"."visit_templates" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_visits_updated_at" BEFORE UPDATE ON "public"."visits" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "public"."centers"("id");



ALTER TABLE ONLY "public"."audit_logs"
    ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."bipolar_aim"
    ADD CONSTRAINT "bipolar_aim_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_aim"
    ADD CONSTRAINT "bipolar_aim_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_aim"
    ADD CONSTRAINT "bipolar_aim_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_alda"
    ADD CONSTRAINT "bipolar_alda_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_alda"
    ADD CONSTRAINT "bipolar_alda_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_alda"
    ADD CONSTRAINT "bipolar_alda_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_als18"
    ADD CONSTRAINT "bipolar_als18_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_als18"
    ADD CONSTRAINT "bipolar_als18_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_als18"
    ADD CONSTRAINT "bipolar_als18_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_antecedents_gyneco"
    ADD CONSTRAINT "bipolar_antecedents_gyneco_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_antecedents_gyneco"
    ADD CONSTRAINT "bipolar_antecedents_gyneco_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_antecedents_gyneco"
    ADD CONSTRAINT "bipolar_antecedents_gyneco_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_aq12"
    ADD CONSTRAINT "bipolar_aq12_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_aq12"
    ADD CONSTRAINT "bipolar_aq12_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_aq12"
    ADD CONSTRAINT "bipolar_aq12_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_asrm"
    ADD CONSTRAINT "bipolar_asrm_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_asrm"
    ADD CONSTRAINT "bipolar_asrm_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_asrm"
    ADD CONSTRAINT "bipolar_asrm_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_asrs"
    ADD CONSTRAINT "bipolar_asrs_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_asrs"
    ADD CONSTRAINT "bipolar_asrs_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_asrs"
    ADD CONSTRAINT "bipolar_asrs_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_autres_patho"
    ADD CONSTRAINT "bipolar_autres_patho_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_autres_patho"
    ADD CONSTRAINT "bipolar_autres_patho_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_autres_patho"
    ADD CONSTRAINT "bipolar_autres_patho_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_bis10"
    ADD CONSTRAINT "bipolar_bis10_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_bis10"
    ADD CONSTRAINT "bipolar_bis10_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_bis10"
    ADD CONSTRAINT "bipolar_bis10_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_cgi"
    ADD CONSTRAINT "bipolar_cgi_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_cgi"
    ADD CONSTRAINT "bipolar_cgi_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_cgi"
    ADD CONSTRAINT "bipolar_cgi_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_cobra"
    ADD CONSTRAINT "bipolar_cobra_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_cobra"
    ADD CONSTRAINT "bipolar_cobra_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_cobra"
    ADD CONSTRAINT "bipolar_cobra_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_cpt3"
    ADD CONSTRAINT "bipolar_cpt3_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_cpt3"
    ADD CONSTRAINT "bipolar_cpt3_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_cpt3"
    ADD CONSTRAINT "bipolar_cpt3_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_csm"
    ADD CONSTRAINT "bipolar_csm_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_csm"
    ADD CONSTRAINT "bipolar_csm_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_csm"
    ADD CONSTRAINT "bipolar_csm_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_cssrs"
    ADD CONSTRAINT "bipolar_cssrs_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_cssrs"
    ADD CONSTRAINT "bipolar_cssrs_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_cssrs"
    ADD CONSTRAINT "bipolar_cssrs_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_cti"
    ADD CONSTRAINT "bipolar_cti_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_cti"
    ADD CONSTRAINT "bipolar_cti_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_cti"
    ADD CONSTRAINT "bipolar_cti_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_ctq"
    ADD CONSTRAINT "bipolar_ctq_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_ctq"
    ADD CONSTRAINT "bipolar_ctq_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_ctq"
    ADD CONSTRAINT "bipolar_ctq_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_cvlt"
    ADD CONSTRAINT "bipolar_cvlt_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_cvlt"
    ADD CONSTRAINT "bipolar_cvlt_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_cvlt"
    ADD CONSTRAINT "bipolar_cvlt_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_diagnostic"
    ADD CONSTRAINT "bipolar_diagnostic_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_diagnostic"
    ADD CONSTRAINT "bipolar_diagnostic_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_diagnostic"
    ADD CONSTRAINT "bipolar_diagnostic_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_diva"
    ADD CONSTRAINT "bipolar_diva_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_diva"
    ADD CONSTRAINT "bipolar_diva_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_diva"
    ADD CONSTRAINT "bipolar_diva_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_dsm5_comorbid"
    ADD CONSTRAINT "bipolar_dsm5_comorbid_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_dsm5_comorbid"
    ADD CONSTRAINT "bipolar_dsm5_comorbid_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_dsm5_comorbid"
    ADD CONSTRAINT "bipolar_dsm5_comorbid_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_dsm5_humeur"
    ADD CONSTRAINT "bipolar_dsm5_humeur_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_dsm5_humeur"
    ADD CONSTRAINT "bipolar_dsm5_humeur_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_dsm5_humeur"
    ADD CONSTRAINT "bipolar_dsm5_humeur_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_dsm5_psychotic"
    ADD CONSTRAINT "bipolar_dsm5_psychotic_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_dsm5_psychotic"
    ADD CONSTRAINT "bipolar_dsm5_psychotic_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_dsm5_psychotic"
    ADD CONSTRAINT "bipolar_dsm5_psychotic_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_egf"
    ADD CONSTRAINT "bipolar_egf_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_egf"
    ADD CONSTRAINT "bipolar_egf_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_egf"
    ADD CONSTRAINT "bipolar_egf_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_epworth"
    ADD CONSTRAINT "bipolar_epworth_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_epworth"
    ADD CONSTRAINT "bipolar_epworth_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_epworth"
    ADD CONSTRAINT "bipolar_epworth_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_eq5d5l"
    ADD CONSTRAINT "bipolar_eq5d5l_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_eq5d5l"
    ADD CONSTRAINT "bipolar_eq5d5l_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_eq5d5l"
    ADD CONSTRAINT "bipolar_eq5d5l_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_etat_patient"
    ADD CONSTRAINT "bipolar_etat_patient_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_etat_patient"
    ADD CONSTRAINT "bipolar_etat_patient_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_etat_patient"
    ADD CONSTRAINT "bipolar_etat_patient_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_family_history"
    ADD CONSTRAINT "bipolar_family_history_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_family_history"
    ADD CONSTRAINT "bipolar_family_history_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_family_history"
    ADD CONSTRAINT "bipolar_family_history_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_fast"
    ADD CONSTRAINT "bipolar_fast_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_fast"
    ADD CONSTRAINT "bipolar_fast_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_fast"
    ADD CONSTRAINT "bipolar_fast_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_fluences_verbales"
    ADD CONSTRAINT "bipolar_fluences_verbales_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_fluences_verbales"
    ADD CONSTRAINT "bipolar_fluences_verbales_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_fluences_verbales"
    ADD CONSTRAINT "bipolar_fluences_verbales_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_arrets_travail"
    ADD CONSTRAINT "bipolar_followup_arrets_travail_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_followup_arrets_travail"
    ADD CONSTRAINT "bipolar_followup_arrets_travail_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_arrets_travail"
    ADD CONSTRAINT "bipolar_followup_arrets_travail_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_humeur_actuels"
    ADD CONSTRAINT "bipolar_followup_humeur_actuels_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_followup_humeur_actuels"
    ADD CONSTRAINT "bipolar_followup_humeur_actuels_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_humeur_actuels"
    ADD CONSTRAINT "bipolar_followup_humeur_actuels_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_humeur_depuis_visite"
    ADD CONSTRAINT "bipolar_followup_humeur_depuis_visite_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_followup_humeur_depuis_visite"
    ADD CONSTRAINT "bipolar_followup_humeur_depuis_visite_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_humeur_depuis_visite"
    ADD CONSTRAINT "bipolar_followup_humeur_depuis_visite_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_isa"
    ADD CONSTRAINT "bipolar_followup_isa_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_followup_isa"
    ADD CONSTRAINT "bipolar_followup_isa_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_isa"
    ADD CONSTRAINT "bipolar_followup_isa_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_psychotiques"
    ADD CONSTRAINT "bipolar_followup_psychotiques_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_followup_psychotiques"
    ADD CONSTRAINT "bipolar_followup_psychotiques_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_psychotiques"
    ADD CONSTRAINT "bipolar_followup_psychotiques_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_recours_aux_soins"
    ADD CONSTRAINT "bipolar_followup_recours_aux_soins_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_followup_recours_aux_soins"
    ADD CONSTRAINT "bipolar_followup_recours_aux_soins_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_recours_aux_soins"
    ADD CONSTRAINT "bipolar_followup_recours_aux_soins_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_somatique_contraceptif"
    ADD CONSTRAINT "bipolar_followup_somatique_contraceptif_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_followup_somatique_contraceptif"
    ADD CONSTRAINT "bipolar_followup_somatique_contraceptif_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_somatique_contraceptif"
    ADD CONSTRAINT "bipolar_followup_somatique_contraceptif_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_statut_professionnel"
    ADD CONSTRAINT "bipolar_followup_statut_professionnel_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_followup_statut_professionnel"
    ADD CONSTRAINT "bipolar_followup_statut_professionnel_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_statut_professionnel"
    ADD CONSTRAINT "bipolar_followup_statut_professionnel_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_suicide_behavior"
    ADD CONSTRAINT "bipolar_followup_suicide_behavior_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_followup_suicide_behavior"
    ADD CONSTRAINT "bipolar_followup_suicide_behavior_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_suicide_behavior"
    ADD CONSTRAINT "bipolar_followup_suicide_behavior_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_suivi_recommandations"
    ADD CONSTRAINT "bipolar_followup_suivi_recommandations_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_followup_suivi_recommandations"
    ADD CONSTRAINT "bipolar_followup_suivi_recommandations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_suivi_recommandations"
    ADD CONSTRAINT "bipolar_followup_suivi_recommandations_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_traitement_non_pharma"
    ADD CONSTRAINT "bipolar_followup_traitement_non_pharma_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_followup_traitement_non_pharma"
    ADD CONSTRAINT "bipolar_followup_traitement_non_pharma_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_followup_traitement_non_pharma"
    ADD CONSTRAINT "bipolar_followup_traitement_non_pharma_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_isa"
    ADD CONSTRAINT "bipolar_isa_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_isa"
    ADD CONSTRAINT "bipolar_isa_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_isa"
    ADD CONSTRAINT "bipolar_isa_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_madrs"
    ADD CONSTRAINT "bipolar_madrs_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_madrs"
    ADD CONSTRAINT "bipolar_madrs_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_madrs"
    ADD CONSTRAINT "bipolar_madrs_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_mars"
    ADD CONSTRAINT "bipolar_mars_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_mars"
    ADD CONSTRAINT "bipolar_mars_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_mars"
    ADD CONSTRAINT "bipolar_mars_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_mathys"
    ADD CONSTRAINT "bipolar_mathys_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_mathys"
    ADD CONSTRAINT "bipolar_mathys_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_mathys"
    ADD CONSTRAINT "bipolar_mathys_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_mdq"
    ADD CONSTRAINT "bipolar_mdq_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_mdq"
    ADD CONSTRAINT "bipolar_mdq_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_mdq"
    ADD CONSTRAINT "bipolar_mdq_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_mem3_spatial"
    ADD CONSTRAINT "bipolar_mem3_spatial_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_mem3_spatial"
    ADD CONSTRAINT "bipolar_mem3_spatial_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_mem3_spatial"
    ADD CONSTRAINT "bipolar_mem3_spatial_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_non_pharmacologic"
    ADD CONSTRAINT "bipolar_non_pharmacologic_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_orientation"
    ADD CONSTRAINT "bipolar_orientation_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_orientation"
    ADD CONSTRAINT "bipolar_orientation_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_orientation"
    ADD CONSTRAINT "bipolar_orientation_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_patho_allergique"
    ADD CONSTRAINT "bipolar_patho_allergique_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_patho_allergique"
    ADD CONSTRAINT "bipolar_patho_allergique_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_patho_allergique"
    ADD CONSTRAINT "bipolar_patho_allergique_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_patho_cardio"
    ADD CONSTRAINT "bipolar_patho_cardio_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_patho_cardio"
    ADD CONSTRAINT "bipolar_patho_cardio_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_patho_cardio"
    ADD CONSTRAINT "bipolar_patho_cardio_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_patho_dermato"
    ADD CONSTRAINT "bipolar_patho_dermato_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_patho_dermato"
    ADD CONSTRAINT "bipolar_patho_dermato_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_patho_dermato"
    ADD CONSTRAINT "bipolar_patho_dermato_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_patho_endoc"
    ADD CONSTRAINT "bipolar_patho_endoc_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_patho_endoc"
    ADD CONSTRAINT "bipolar_patho_endoc_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_patho_endoc"
    ADD CONSTRAINT "bipolar_patho_endoc_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_patho_hepato_gastro"
    ADD CONSTRAINT "bipolar_patho_hepato_gastro_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_patho_hepato_gastro"
    ADD CONSTRAINT "bipolar_patho_hepato_gastro_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_patho_hepato_gastro"
    ADD CONSTRAINT "bipolar_patho_hepato_gastro_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_patho_neuro"
    ADD CONSTRAINT "bipolar_patho_neuro_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_patho_neuro"
    ADD CONSTRAINT "bipolar_patho_neuro_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_patho_neuro"
    ADD CONSTRAINT "bipolar_patho_neuro_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_patho_urinaire"
    ADD CONSTRAINT "bipolar_patho_urinaire_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_patho_urinaire"
    ADD CONSTRAINT "bipolar_patho_urinaire_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_patho_urinaire"
    ADD CONSTRAINT "bipolar_patho_urinaire_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_perinatalite"
    ADD CONSTRAINT "bipolar_perinatalite_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_perinatalite"
    ADD CONSTRAINT "bipolar_perinatalite_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_perinatalite"
    ADD CONSTRAINT "bipolar_perinatalite_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_prise_m"
    ADD CONSTRAINT "bipolar_prise_m_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_prise_m"
    ADD CONSTRAINT "bipolar_prise_m_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_prise_m"
    ADD CONSTRAINT "bipolar_prise_m_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_psqi"
    ADD CONSTRAINT "bipolar_psqi_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_psqi"
    ADD CONSTRAINT "bipolar_psqi_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_psqi"
    ADD CONSTRAINT "bipolar_psqi_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_psychotropes_lifetime"
    ADD CONSTRAINT "bipolar_psychotropes_lifetime_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_qids_sr16"
    ADD CONSTRAINT "bipolar_qids_sr16_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_qids_sr16"
    ADD CONSTRAINT "bipolar_qids_sr16_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_qids_sr16"
    ADD CONSTRAINT "bipolar_qids_sr16_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_scip"
    ADD CONSTRAINT "bipolar_scip_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_scip"
    ADD CONSTRAINT "bipolar_scip_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_scip"
    ADD CONSTRAINT "bipolar_scip_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_sis"
    ADD CONSTRAINT "bipolar_sis_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_sis"
    ADD CONSTRAINT "bipolar_sis_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_sis"
    ADD CONSTRAINT "bipolar_sis_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_social"
    ADD CONSTRAINT "bipolar_social_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_social"
    ADD CONSTRAINT "bipolar_social_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_social"
    ADD CONSTRAINT "bipolar_social_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_stai_ya"
    ADD CONSTRAINT "bipolar_stai_ya_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_stai_ya"
    ADD CONSTRAINT "bipolar_stai_ya_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_stai_ya"
    ADD CONSTRAINT "bipolar_stai_ya_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_stroop"
    ADD CONSTRAINT "bipolar_stroop_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_stroop"
    ADD CONSTRAINT "bipolar_stroop_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_stroop"
    ADD CONSTRAINT "bipolar_stroop_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_suicide_history"
    ADD CONSTRAINT "bipolar_suicide_history_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_suicide_history"
    ADD CONSTRAINT "bipolar_suicide_history_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_suicide_history"
    ADD CONSTRAINT "bipolar_suicide_history_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_test_commissions"
    ADD CONSTRAINT "bipolar_test_commissions_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_test_commissions"
    ADD CONSTRAINT "bipolar_test_commissions_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_test_commissions"
    ADD CONSTRAINT "bipolar_test_commissions_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_tmt"
    ADD CONSTRAINT "bipolar_tmt_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_tmt"
    ADD CONSTRAINT "bipolar_tmt_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_tmt"
    ADD CONSTRAINT "bipolar_tmt_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais3_code_symboles"
    ADD CONSTRAINT "bipolar_wais3_code_symboles_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_wais3_code_symboles"
    ADD CONSTRAINT "bipolar_wais3_code_symboles_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais3_code_symboles"
    ADD CONSTRAINT "bipolar_wais3_code_symboles_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais3_cpt2"
    ADD CONSTRAINT "bipolar_wais3_cpt2_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_wais3_cpt2"
    ADD CONSTRAINT "bipolar_wais3_cpt2_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais3_cpt2"
    ADD CONSTRAINT "bipolar_wais3_cpt2_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais3_criteria"
    ADD CONSTRAINT "bipolar_wais3_criteria_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_wais3_criteria"
    ADD CONSTRAINT "bipolar_wais3_criteria_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais3_criteria"
    ADD CONSTRAINT "bipolar_wais3_criteria_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais3_digit_span"
    ADD CONSTRAINT "bipolar_wais3_digit_span_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_wais3_digit_span"
    ADD CONSTRAINT "bipolar_wais3_digit_span_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais3_digit_span"
    ADD CONSTRAINT "bipolar_wais3_digit_span_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais3_learning"
    ADD CONSTRAINT "bipolar_wais3_learning_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_wais3_learning"
    ADD CONSTRAINT "bipolar_wais3_learning_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais3_learning"
    ADD CONSTRAINT "bipolar_wais3_learning_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais3_matrices"
    ADD CONSTRAINT "bipolar_wais3_matrices_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_wais3_matrices"
    ADD CONSTRAINT "bipolar_wais3_matrices_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais3_matrices"
    ADD CONSTRAINT "bipolar_wais3_matrices_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais3_vocabulaire"
    ADD CONSTRAINT "bipolar_wais3_vocabulaire_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_wais3_vocabulaire"
    ADD CONSTRAINT "bipolar_wais3_vocabulaire_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais3_vocabulaire"
    ADD CONSTRAINT "bipolar_wais3_vocabulaire_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais4_code"
    ADD CONSTRAINT "bipolar_wais4_code_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_wais4_code"
    ADD CONSTRAINT "bipolar_wais4_code_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais4_code"
    ADD CONSTRAINT "bipolar_wais4_code_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais4_criteria"
    ADD CONSTRAINT "bipolar_wais4_criteria_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_wais4_criteria"
    ADD CONSTRAINT "bipolar_wais4_criteria_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais4_criteria"
    ADD CONSTRAINT "bipolar_wais4_criteria_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais4_digit_span"
    ADD CONSTRAINT "bipolar_wais4_digit_span_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_wais4_digit_span"
    ADD CONSTRAINT "bipolar_wais4_digit_span_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais4_digit_span"
    ADD CONSTRAINT "bipolar_wais4_digit_span_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais4_learning"
    ADD CONSTRAINT "bipolar_wais4_learning_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_wais4_learning"
    ADD CONSTRAINT "bipolar_wais4_learning_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais4_learning"
    ADD CONSTRAINT "bipolar_wais4_learning_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais4_matrices"
    ADD CONSTRAINT "bipolar_wais4_matrices_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_wais4_matrices"
    ADD CONSTRAINT "bipolar_wais4_matrices_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais4_matrices"
    ADD CONSTRAINT "bipolar_wais4_matrices_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais4_similitudes"
    ADD CONSTRAINT "bipolar_wais4_similitudes_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_wais4_similitudes"
    ADD CONSTRAINT "bipolar_wais4_similitudes_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wais4_similitudes"
    ADD CONSTRAINT "bipolar_wais4_similitudes_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wurs25"
    ADD CONSTRAINT "bipolar_wurs25_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_wurs25"
    ADD CONSTRAINT "bipolar_wurs25_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_wurs25"
    ADD CONSTRAINT "bipolar_wurs25_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_ymrs"
    ADD CONSTRAINT "bipolar_ymrs_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."bipolar_ymrs"
    ADD CONSTRAINT "bipolar_ymrs_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_ymrs"
    ADD CONSTRAINT "bipolar_ymrs_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."center_pathologies"
    ADD CONSTRAINT "center_pathologies_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "public"."centers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."center_pathologies"
    ADD CONSTRAINT "center_pathologies_pathology_id_fkey" FOREIGN KEY ("pathology_id") REFERENCES "public"."pathologies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."evaluations"
    ADD CONSTRAINT "evaluations_evaluator_id_fkey" FOREIGN KEY ("evaluator_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."evaluations"
    ADD CONSTRAINT "evaluations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."evaluations"
    ADD CONSTRAINT "evaluations_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."login_history"
    ADD CONSTRAINT "login_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_parent_message_id_fkey" FOREIGN KEY ("parent_message_id") REFERENCES "public"."messages"("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."patient_medications"
    ADD CONSTRAINT "patient_medications_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."patient_medications"
    ADD CONSTRAINT "patient_medications_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."patients"
    ADD CONSTRAINT "patients_assigned_to_fkey" FOREIGN KEY ("assigned_to") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."patients"
    ADD CONSTRAINT "patients_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "public"."centers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."patients"
    ADD CONSTRAINT "patients_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."patients"
    ADD CONSTRAINT "patients_deleted_by_fkey" FOREIGN KEY ("deleted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."patients"
    ADD CONSTRAINT "patients_pathology_id_fkey" FOREIGN KEY ("pathology_id") REFERENCES "public"."pathologies"("id");



ALTER TABLE ONLY "public"."patients"
    ADD CONSTRAINT "patients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."recent_accesses"
    ADD CONSTRAINT "recent_accesses_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."recent_accesses"
    ADD CONSTRAINT "recent_accesses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_nurse_biological_assessment"
    ADD CONSTRAINT "responses_biological_assessment_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."bipolar_nurse_biological_assessment"
    ADD CONSTRAINT "responses_biological_assessment_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_nurse_biological_assessment"
    ADD CONSTRAINT "responses_biological_assessment_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_nurse_blood_pressure"
    ADD CONSTRAINT "responses_blood_pressure_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."bipolar_nurse_blood_pressure"
    ADD CONSTRAINT "responses_blood_pressure_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_nurse_blood_pressure"
    ADD CONSTRAINT "responses_blood_pressure_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_nurse_ecg"
    ADD CONSTRAINT "responses_ecg_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."bipolar_nurse_ecg"
    ADD CONSTRAINT "responses_ecg_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_nurse_ecg"
    ADD CONSTRAINT "responses_ecg_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_nurse_fagerstrom"
    ADD CONSTRAINT "responses_fagerstrom_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."bipolar_nurse_fagerstrom"
    ADD CONSTRAINT "responses_fagerstrom_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_nurse_fagerstrom"
    ADD CONSTRAINT "responses_fagerstrom_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_nurse_physical_params"
    ADD CONSTRAINT "responses_physical_params_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."bipolar_nurse_physical_params"
    ADD CONSTRAINT "responses_physical_params_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_nurse_physical_params"
    ADD CONSTRAINT "responses_physical_params_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_nurse_sleep_apnea"
    ADD CONSTRAINT "responses_sleep_apnea_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."bipolar_nurse_sleep_apnea"
    ADD CONSTRAINT "responses_sleep_apnea_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_nurse_sleep_apnea"
    ADD CONSTRAINT "responses_sleep_apnea_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_nurse_tobacco"
    ADD CONSTRAINT "responses_tobacco_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."bipolar_nurse_tobacco"
    ADD CONSTRAINT "responses_tobacco_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."bipolar_nurse_tobacco"
    ADD CONSTRAINT "responses_tobacco_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_aims"
    ADD CONSTRAINT "schizophrenia_aims_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_aims"
    ADD CONSTRAINT "schizophrenia_aims_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_aims"
    ADD CONSTRAINT "schizophrenia_aims_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_antecedents_familiaux_psy"
    ADD CONSTRAINT "schizophrenia_antecedents_familiaux_psy_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_antecedents_familiaux_psy"
    ADD CONSTRAINT "schizophrenia_antecedents_familiaux_psy_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_barnes"
    ADD CONSTRAINT "schizophrenia_barnes_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_barnes"
    ADD CONSTRAINT "schizophrenia_barnes_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_barnes"
    ADD CONSTRAINT "schizophrenia_barnes_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_bars"
    ADD CONSTRAINT "schizophrenia_bars_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_bars"
    ADD CONSTRAINT "schizophrenia_bars_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_bars"
    ADD CONSTRAINT "schizophrenia_bars_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_bilan_biologique"
    ADD CONSTRAINT "schizophrenia_bilan_biologique_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_bilan_biologique"
    ADD CONSTRAINT "schizophrenia_bilan_biologique_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_bilan_biologique"
    ADD CONSTRAINT "schizophrenia_bilan_biologique_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_cdss"
    ADD CONSTRAINT "schizophrenia_cdss_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_cdss"
    ADD CONSTRAINT "schizophrenia_cdss_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_cdss"
    ADD CONSTRAINT "schizophrenia_cdss_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_dossier_infirmier"
    ADD CONSTRAINT "schizophrenia_dossier_infirmier_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_dossier_infirmier"
    ADD CONSTRAINT "schizophrenia_dossier_infirmier_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_dossier_infirmier"
    ADD CONSTRAINT "schizophrenia_dossier_infirmier_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_ecv"
    ADD CONSTRAINT "schizophrenia_ecv_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_ecv"
    ADD CONSTRAINT "schizophrenia_ecv_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_ecv"
    ADD CONSTRAINT "schizophrenia_ecv_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_eval_addictologique"
    ADD CONSTRAINT "schizophrenia_eval_addictologique_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_eval_addictologique"
    ADD CONSTRAINT "schizophrenia_eval_addictologique_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_eval_addictologique"
    ADD CONSTRAINT "schizophrenia_eval_addictologique_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_isa"
    ADD CONSTRAINT "schizophrenia_isa_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_isa"
    ADD CONSTRAINT "schizophrenia_isa_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_isa"
    ADD CONSTRAINT "schizophrenia_isa_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_panss"
    ADD CONSTRAINT "schizophrenia_panss_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_panss"
    ADD CONSTRAINT "schizophrenia_panss_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_panss"
    ADD CONSTRAINT "schizophrenia_panss_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_perinatalite"
    ADD CONSTRAINT "schizophrenia_perinatalite_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_perinatalite"
    ADD CONSTRAINT "schizophrenia_perinatalite_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_psp"
    ADD CONSTRAINT "schizophrenia_psp_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_psp"
    ADD CONSTRAINT "schizophrenia_psp_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_psp"
    ADD CONSTRAINT "schizophrenia_psp_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_sas"
    ADD CONSTRAINT "schizophrenia_sas_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_sas"
    ADD CONSTRAINT "schizophrenia_sas_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_sas"
    ADD CONSTRAINT "schizophrenia_sas_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_screening_diagnostic"
    ADD CONSTRAINT "schizophrenia_screening_diagnostic_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_screening_diagnostic"
    ADD CONSTRAINT "schizophrenia_screening_diagnostic_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_screening_diagnostic"
    ADD CONSTRAINT "schizophrenia_screening_diagnostic_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_screening_orientation"
    ADD CONSTRAINT "schizophrenia_screening_orientation_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_screening_orientation"
    ADD CONSTRAINT "schizophrenia_screening_orientation_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_screening_orientation"
    ADD CONSTRAINT "schizophrenia_screening_orientation_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_suicide_history"
    ADD CONSTRAINT "schizophrenia_suicide_history_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_suicide_history"
    ADD CONSTRAINT "schizophrenia_suicide_history_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_sumd"
    ADD CONSTRAINT "schizophrenia_sumd_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_sumd"
    ADD CONSTRAINT "schizophrenia_sumd_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_sumd"
    ADD CONSTRAINT "schizophrenia_sumd_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_tea_coffee"
    ADD CONSTRAINT "schizophrenia_tea_coffee_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_tea_coffee"
    ADD CONSTRAINT "schizophrenia_tea_coffee_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_tea_coffee"
    ADD CONSTRAINT "schizophrenia_tea_coffee_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_troubles_comorbides"
    ADD CONSTRAINT "schizophrenia_troubles_comorbides_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_troubles_comorbides"
    ADD CONSTRAINT "schizophrenia_troubles_comorbides_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_troubles_comorbides"
    ADD CONSTRAINT "schizophrenia_troubles_comorbides_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_troubles_psychotiques"
    ADD CONSTRAINT "schizophrenia_troubles_psychotiques_completed_by_fkey" FOREIGN KEY ("completed_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."schizophrenia_troubles_psychotiques"
    ADD CONSTRAINT "schizophrenia_troubles_psychotiques_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."schizophrenia_troubles_psychotiques"
    ADD CONSTRAINT "schizophrenia_troubles_psychotiques_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "public"."visits"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."treatment_somatic_contraceptive"
    ADD CONSTRAINT "treatment_somatic_contraceptive_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."user_profiles"("id");



ALTER TABLE ONLY "public"."treatment_somatic_contraceptive"
    ADD CONSTRAINT "treatment_somatic_contraceptive_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_invitations"
    ADD CONSTRAINT "user_invitations_accepted_by_fkey" FOREIGN KEY ("accepted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_invitations"
    ADD CONSTRAINT "user_invitations_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "public"."centers"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_invitations"
    ADD CONSTRAINT "user_invitations_invited_by_fkey" FOREIGN KEY ("invited_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_invitations"
    ADD CONSTRAINT "user_invitations_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_permissions"
    ADD CONSTRAINT "user_permissions_granted_by_fkey" FOREIGN KEY ("granted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_permissions"
    ADD CONSTRAINT "user_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "public"."permissions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_permissions"
    ADD CONSTRAINT "user_permissions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_center_id_fkey" FOREIGN KEY ("center_id") REFERENCES "public"."centers"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."user_profiles"
    ADD CONSTRAINT "user_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."visit_templates"
    ADD CONSTRAINT "visit_templates_pathology_id_fkey" FOREIGN KEY ("pathology_id") REFERENCES "public"."pathologies"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."visits"
    ADD CONSTRAINT "visits_conducted_by_fkey" FOREIGN KEY ("conducted_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."visits"
    ADD CONSTRAINT "visits_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."visits"
    ADD CONSTRAINT "visits_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "public"."patients"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."visits"
    ADD CONSTRAINT "visits_visit_template_id_fkey" FOREIGN KEY ("visit_template_id") REFERENCES "public"."visit_templates"("id");



CREATE POLICY "Healthcare professionals can insert ECG responses" ON "public"."bipolar_nurse_ecg" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can insert biological assessment" ON "public"."bipolar_nurse_biological_assessment" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can insert blood pressure" ON "public"."bipolar_nurse_blood_pressure" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can insert fagerstrom responses" ON "public"."bipolar_nurse_fagerstrom" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can insert physical params" ON "public"."bipolar_nurse_physical_params" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can insert sleep apnea" ON "public"."bipolar_nurse_sleep_apnea" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can insert tobacco responses" ON "public"."bipolar_nurse_tobacco" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can update ECG responses" ON "public"."bipolar_nurse_ecg" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can update biological assessment" ON "public"."bipolar_nurse_biological_assessment" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can update blood pressure" ON "public"."bipolar_nurse_blood_pressure" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can update fagerstrom responses" ON "public"."bipolar_nurse_fagerstrom" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can update physical params" ON "public"."bipolar_nurse_physical_params" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can update sleep apnea" ON "public"."bipolar_nurse_sleep_apnea" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can update tobacco responses" ON "public"."bipolar_nurse_tobacco" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can view ECG responses" ON "public"."bipolar_nurse_ecg" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can view biological assessment" ON "public"."bipolar_nurse_biological_assessment" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can view blood pressure" ON "public"."bipolar_nurse_blood_pressure" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can view fagerstrom responses" ON "public"."bipolar_nurse_fagerstrom" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can view physical params" ON "public"."bipolar_nurse_physical_params" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can view sleep apnea" ON "public"."bipolar_nurse_sleep_apnea" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Healthcare professionals can view tobacco responses" ON "public"."bipolar_nurse_tobacco" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Patients can view own biological assessment" ON "public"."bipolar_nurse_biological_assessment" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_antecedents_gyneco" ON "public"."bipolar_antecedents_gyneco" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_autres_patho" ON "public"."bipolar_autres_patho" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_cobra" ON "public"."bipolar_cobra" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_cpt3" ON "public"."bipolar_cpt3" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_cssrs" ON "public"."bipolar_cssrs" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_cvlt" ON "public"."bipolar_cvlt" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_diva" ON "public"."bipolar_diva" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_dsm5_comorbid" ON "public"."bipolar_dsm5_comorbid" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_dsm5_humeur" ON "public"."bipolar_dsm5_humeur" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_dsm5_psychotic" ON "public"."bipolar_dsm5_psychotic" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_family_history" ON "public"."bipolar_family_history" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_fluences_verbales" ON "public"."bipolar_fluences_verbales" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_isa" ON "public"."bipolar_isa" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_mem3_spatial" ON "public"."bipolar_mem3_spatial" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_patho_allergique" ON "public"."bipolar_patho_allergique" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_patho_cardio" ON "public"."bipolar_patho_cardio" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_patho_dermato" ON "public"."bipolar_patho_dermato" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_patho_endoc" ON "public"."bipolar_patho_endoc" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_patho_hepato_gastro" ON "public"."bipolar_patho_hepato_gastro" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_patho_neuro" ON "public"."bipolar_patho_neuro" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_patho_urinaire" ON "public"."bipolar_patho_urinaire" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_perinatalite" ON "public"."bipolar_perinatalite" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_scip" ON "public"."bipolar_scip" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_sis" ON "public"."bipolar_sis" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_stroop" ON "public"."bipolar_stroop" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_suicide_history" ON "public"."bipolar_suicide_history" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_test_commissions" ON "public"."bipolar_test_commissions" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_tmt" ON "public"."bipolar_tmt" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_wais3_code_symboles" ON "public"."bipolar_wais3_code_symboles" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_wais3_cpt2" ON "public"."bipolar_wais3_cpt2" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_wais3_criteria" ON "public"."bipolar_wais3_criteria" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_wais3_digit_span" ON "public"."bipolar_wais3_digit_span" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_wais3_learning" ON "public"."bipolar_wais3_learning" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_wais3_matrices" ON "public"."bipolar_wais3_matrices" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_wais3_vocabulaire" ON "public"."bipolar_wais3_vocabulaire" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_wais4_code" ON "public"."bipolar_wais4_code" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_wais4_criteria" ON "public"."bipolar_wais4_criteria" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_wais4_digit_span" ON "public"."bipolar_wais4_digit_span" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_wais4_learning" ON "public"."bipolar_wais4_learning" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_wais4_matrices" ON "public"."bipolar_wais4_matrices" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own bipolar_wais4_similitudes" ON "public"."bipolar_wais4_similitudes" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own blood pressure" ON "public"."bipolar_nurse_blood_pressure" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own fagerstrom responses" ON "public"."bipolar_nurse_fagerstrom" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own physical params" ON "public"."bipolar_nurse_physical_params" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own sleep apnea" ON "public"."bipolar_nurse_sleep_apnea" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients can view own tobacco responses" ON "public"."bipolar_nurse_tobacco" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients delete own medications" ON "public"."patient_medications" FOR DELETE USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients delete own somatic contraceptive" ON "public"."treatment_somatic_contraceptive" FOR DELETE USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients insert own bipolar_asrm" ON "public"."bipolar_asrm" FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients insert own bipolar_mdq" ON "public"."bipolar_mdq" FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients insert own bipolar_qids_sr16" ON "public"."bipolar_qids_sr16" FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients insert own medications" ON "public"."patient_medications" FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients insert own non_pharmacologic" ON "public"."bipolar_non_pharmacologic" FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients insert own psychotropes_lifetime" ON "public"."bipolar_psychotropes_lifetime" FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients insert own somatic contraceptive" ON "public"."treatment_somatic_contraceptive" FOR INSERT WITH CHECK (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients update own bipolar_asrm" ON "public"."bipolar_asrm" FOR UPDATE USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients update own bipolar_mdq" ON "public"."bipolar_mdq" FOR UPDATE USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients update own bipolar_qids_sr16" ON "public"."bipolar_qids_sr16" FOR UPDATE USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients update own medications" ON "public"."patient_medications" FOR UPDATE USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients update own non_pharmacologic" ON "public"."bipolar_non_pharmacologic" FOR UPDATE USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients update own psychotropes_lifetime" ON "public"."bipolar_psychotropes_lifetime" FOR UPDATE USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients update own somatic contraceptive" ON "public"."treatment_somatic_contraceptive" FOR UPDATE USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_aim" ON "public"."bipolar_aim" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_alda" ON "public"."bipolar_alda" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_als18" ON "public"."bipolar_als18" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_aq12" ON "public"."bipolar_aq12" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_asrm" ON "public"."bipolar_asrm" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_asrs" ON "public"."bipolar_asrs" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_bis10" ON "public"."bipolar_bis10" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_cgi" ON "public"."bipolar_cgi" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_csm" ON "public"."bipolar_csm" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_cti" ON "public"."bipolar_cti" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_ctq" ON "public"."bipolar_ctq" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_egf" ON "public"."bipolar_egf" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_epworth" ON "public"."bipolar_epworth" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_eq5d5l" ON "public"."bipolar_eq5d5l" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_etat_patient" ON "public"."bipolar_etat_patient" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_fast" ON "public"."bipolar_fast" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_madrs" ON "public"."bipolar_madrs" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_mars" ON "public"."bipolar_mars" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_mathys" ON "public"."bipolar_mathys" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_mdq" ON "public"."bipolar_mdq" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_prise_m" ON "public"."bipolar_prise_m" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_psqi" ON "public"."bipolar_psqi" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_qids_sr16" ON "public"."bipolar_qids_sr16" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_social" ON "public"."bipolar_social" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_stai_ya" ON "public"."bipolar_stai_ya" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_wurs25" ON "public"."bipolar_wurs25" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own bipolar_ymrs" ON "public"."bipolar_ymrs" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own medications" ON "public"."patient_medications" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own non_pharmacologic" ON "public"."bipolar_non_pharmacologic" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own psychotropes_lifetime" ON "public"."bipolar_psychotropes_lifetime" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_aims" ON "public"."schizophrenia_aims" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_antecedents_familiaux_psy" ON "public"."schizophrenia_antecedents_familiaux_psy" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_barnes" ON "public"."schizophrenia_barnes" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_bars" ON "public"."schizophrenia_bars" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_bilan_biologique" ON "public"."schizophrenia_bilan_biologique" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_cdss" ON "public"."schizophrenia_cdss" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_dossier_infirmier" ON "public"."schizophrenia_dossier_infirmier" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_ecv" ON "public"."schizophrenia_ecv" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_eval_addictologique" ON "public"."schizophrenia_eval_addictologique" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_isa" ON "public"."schizophrenia_isa" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_panss" ON "public"."schizophrenia_panss" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_perinatalite" ON "public"."schizophrenia_perinatalite" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_psp" ON "public"."schizophrenia_psp" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_sas" ON "public"."schizophrenia_sas" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_screening_diagnostic" ON "public"."schizophrenia_screening_diagnostic" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_screening_orientation" ON "public"."schizophrenia_screening_orientation" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_suicide_history" ON "public"."schizophrenia_suicide_history" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_sumd" ON "public"."schizophrenia_sumd" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_tea_coffee" ON "public"."schizophrenia_tea_coffee" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_troubles_comorbides" ON "public"."schizophrenia_troubles_comorbides" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own schizophrenia_troubles_psychotiques" ON "public"."schizophrenia_troubles_psychotiques" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Patients view own somatic contraceptive" ON "public"."treatment_somatic_contraceptive" FOR SELECT USING (("auth"."uid"() = "patient_id"));



CREATE POLICY "Professionals can insert bipolar_antecedents_gyneco" ON "public"."bipolar_antecedents_gyneco" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_autres_patho" ON "public"."bipolar_autres_patho" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_cobra" ON "public"."bipolar_cobra" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_cpt3" ON "public"."bipolar_cpt3" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_cssrs" ON "public"."bipolar_cssrs" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_cvlt" ON "public"."bipolar_cvlt" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_diva" ON "public"."bipolar_diva" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_dsm5_comorbid" ON "public"."bipolar_dsm5_comorbid" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_dsm5_humeur" ON "public"."bipolar_dsm5_humeur" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_dsm5_psychotic" ON "public"."bipolar_dsm5_psychotic" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_family_history" ON "public"."bipolar_family_history" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_fluences_verbales" ON "public"."bipolar_fluences_verbales" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_isa" ON "public"."bipolar_isa" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_mem3_spatial" ON "public"."bipolar_mem3_spatial" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_patho_allergique" ON "public"."bipolar_patho_allergique" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_patho_cardio" ON "public"."bipolar_patho_cardio" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_patho_dermato" ON "public"."bipolar_patho_dermato" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_patho_endoc" ON "public"."bipolar_patho_endoc" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_patho_hepato_gastro" ON "public"."bipolar_patho_hepato_gastro" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_patho_neuro" ON "public"."bipolar_patho_neuro" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_patho_urinaire" ON "public"."bipolar_patho_urinaire" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_perinatalite" ON "public"."bipolar_perinatalite" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_scip" ON "public"."bipolar_scip" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_sis" ON "public"."bipolar_sis" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_stroop" ON "public"."bipolar_stroop" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_suicide_history" ON "public"."bipolar_suicide_history" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_test_commissions" ON "public"."bipolar_test_commissions" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_tmt" ON "public"."bipolar_tmt" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_wais3_code_symboles" ON "public"."bipolar_wais3_code_symboles" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_wais3_cpt2" ON "public"."bipolar_wais3_cpt2" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_wais3_criteria" ON "public"."bipolar_wais3_criteria" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_wais3_digit_span" ON "public"."bipolar_wais3_digit_span" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_wais3_learning" ON "public"."bipolar_wais3_learning" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_wais3_matrices" ON "public"."bipolar_wais3_matrices" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_wais3_vocabulaire" ON "public"."bipolar_wais3_vocabulaire" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_wais4_code" ON "public"."bipolar_wais4_code" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_wais4_criteria" ON "public"."bipolar_wais4_criteria" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_wais4_digit_span" ON "public"."bipolar_wais4_digit_span" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_wais4_learning" ON "public"."bipolar_wais4_learning" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_wais4_matrices" ON "public"."bipolar_wais4_matrices" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can insert bipolar_wais4_similitudes" ON "public"."bipolar_wais4_similitudes" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_antecedents_gyneco" ON "public"."bipolar_antecedents_gyneco" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_autres_patho" ON "public"."bipolar_autres_patho" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_cobra" ON "public"."bipolar_cobra" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_cpt3" ON "public"."bipolar_cpt3" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_cssrs" ON "public"."bipolar_cssrs" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_cvlt" ON "public"."bipolar_cvlt" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_diva" ON "public"."bipolar_diva" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_dsm5_comorbid" ON "public"."bipolar_dsm5_comorbid" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_dsm5_humeur" ON "public"."bipolar_dsm5_humeur" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_dsm5_psychotic" ON "public"."bipolar_dsm5_psychotic" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_family_history" ON "public"."bipolar_family_history" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_fluences_verbales" ON "public"."bipolar_fluences_verbales" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_isa" ON "public"."bipolar_isa" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_mem3_spatial" ON "public"."bipolar_mem3_spatial" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_patho_allergique" ON "public"."bipolar_patho_allergique" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_patho_cardio" ON "public"."bipolar_patho_cardio" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_patho_dermato" ON "public"."bipolar_patho_dermato" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_patho_endoc" ON "public"."bipolar_patho_endoc" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_patho_hepato_gastro" ON "public"."bipolar_patho_hepato_gastro" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_patho_neuro" ON "public"."bipolar_patho_neuro" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_patho_urinaire" ON "public"."bipolar_patho_urinaire" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_perinatalite" ON "public"."bipolar_perinatalite" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_scip" ON "public"."bipolar_scip" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_sis" ON "public"."bipolar_sis" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_stroop" ON "public"."bipolar_stroop" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_suicide_history" ON "public"."bipolar_suicide_history" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_test_commissions" ON "public"."bipolar_test_commissions" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_tmt" ON "public"."bipolar_tmt" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_wais3_code_symboles" ON "public"."bipolar_wais3_code_symboles" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_wais3_cpt2" ON "public"."bipolar_wais3_cpt2" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_wais3_criteria" ON "public"."bipolar_wais3_criteria" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_wais3_digit_span" ON "public"."bipolar_wais3_digit_span" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_wais3_learning" ON "public"."bipolar_wais3_learning" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_wais3_matrices" ON "public"."bipolar_wais3_matrices" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_wais3_vocabulaire" ON "public"."bipolar_wais3_vocabulaire" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_wais4_code" ON "public"."bipolar_wais4_code" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_wais4_criteria" ON "public"."bipolar_wais4_criteria" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_wais4_digit_span" ON "public"."bipolar_wais4_digit_span" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_wais4_learning" ON "public"."bipolar_wais4_learning" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_wais4_matrices" ON "public"."bipolar_wais4_matrices" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can update bipolar_wais4_similitudes" ON "public"."bipolar_wais4_similitudes" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_antecedents_gyneco" ON "public"."bipolar_antecedents_gyneco" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_autres_patho" ON "public"."bipolar_autres_patho" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_cobra" ON "public"."bipolar_cobra" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_cpt3" ON "public"."bipolar_cpt3" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_cssrs" ON "public"."bipolar_cssrs" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_cvlt" ON "public"."bipolar_cvlt" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_diva" ON "public"."bipolar_diva" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_dsm5_comorbid" ON "public"."bipolar_dsm5_comorbid" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_dsm5_humeur" ON "public"."bipolar_dsm5_humeur" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_dsm5_psychotic" ON "public"."bipolar_dsm5_psychotic" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_family_history" ON "public"."bipolar_family_history" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_fluences_verbales" ON "public"."bipolar_fluences_verbales" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_isa" ON "public"."bipolar_isa" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_mem3_spatial" ON "public"."bipolar_mem3_spatial" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_patho_allergique" ON "public"."bipolar_patho_allergique" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_patho_cardio" ON "public"."bipolar_patho_cardio" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_patho_dermato" ON "public"."bipolar_patho_dermato" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_patho_endoc" ON "public"."bipolar_patho_endoc" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_patho_hepato_gastro" ON "public"."bipolar_patho_hepato_gastro" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_patho_neuro" ON "public"."bipolar_patho_neuro" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_patho_urinaire" ON "public"."bipolar_patho_urinaire" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_perinatalite" ON "public"."bipolar_perinatalite" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_scip" ON "public"."bipolar_scip" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_sis" ON "public"."bipolar_sis" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_stroop" ON "public"."bipolar_stroop" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_suicide_history" ON "public"."bipolar_suicide_history" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_test_commissions" ON "public"."bipolar_test_commissions" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_tmt" ON "public"."bipolar_tmt" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_wais3_code_symboles" ON "public"."bipolar_wais3_code_symboles" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_wais3_cpt2" ON "public"."bipolar_wais3_cpt2" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_wais3_criteria" ON "public"."bipolar_wais3_criteria" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_wais3_digit_span" ON "public"."bipolar_wais3_digit_span" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_wais3_learning" ON "public"."bipolar_wais3_learning" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_wais3_matrices" ON "public"."bipolar_wais3_matrices" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_wais3_vocabulaire" ON "public"."bipolar_wais3_vocabulaire" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_wais4_code" ON "public"."bipolar_wais4_code" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_wais4_criteria" ON "public"."bipolar_wais4_criteria" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_wais4_digit_span" ON "public"."bipolar_wais4_digit_span" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_wais4_learning" ON "public"."bipolar_wais4_learning" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_wais4_matrices" ON "public"."bipolar_wais4_matrices" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals can view bipolar_wais4_similitudes" ON "public"."bipolar_wais4_similitudes" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'administrator'::"public"."user_role", 'manager'::"public"."user_role"]))))));



CREATE POLICY "Professionals delete medications" ON "public"."patient_medications" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals delete somatic contraceptive" ON "public"."treatment_somatic_contraceptive" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_aim" ON "public"."bipolar_aim" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_alda" ON "public"."bipolar_alda" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_als18" ON "public"."bipolar_als18" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_aq12" ON "public"."bipolar_aq12" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_asrm" ON "public"."bipolar_asrm" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_asrs" ON "public"."bipolar_asrs" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_bis10" ON "public"."bipolar_bis10" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_cgi" ON "public"."bipolar_cgi" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_csm" ON "public"."bipolar_csm" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_cti" ON "public"."bipolar_cti" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_ctq" ON "public"."bipolar_ctq" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_diagnostic" ON "public"."bipolar_diagnostic" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_egf" ON "public"."bipolar_egf" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_epworth" ON "public"."bipolar_epworth" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_eq5d5l" ON "public"."bipolar_eq5d5l" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_etat_patient" ON "public"."bipolar_etat_patient" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_fast" ON "public"."bipolar_fast" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_madrs" ON "public"."bipolar_madrs" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_mars" ON "public"."bipolar_mars" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_mathys" ON "public"."bipolar_mathys" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_mdq" ON "public"."bipolar_mdq" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_orientation" ON "public"."bipolar_orientation" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_prise_m" ON "public"."bipolar_prise_m" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_psqi" ON "public"."bipolar_psqi" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_qids_sr16" ON "public"."bipolar_qids_sr16" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_social" ON "public"."bipolar_social" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_stai_ya" ON "public"."bipolar_stai_ya" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_wurs25" ON "public"."bipolar_wurs25" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert bipolar_ymrs" ON "public"."bipolar_ymrs" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert medications" ON "public"."patient_medications" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_aims" ON "public"."schizophrenia_aims" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_antecedents_familiaux_psy" ON "public"."schizophrenia_antecedents_familiaux_psy" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_barnes" ON "public"."schizophrenia_barnes" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_bars" ON "public"."schizophrenia_bars" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_bilan_biologique" ON "public"."schizophrenia_bilan_biologique" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_cdss" ON "public"."schizophrenia_cdss" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_dossier_infirmier" ON "public"."schizophrenia_dossier_infirmier" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_ecv" ON "public"."schizophrenia_ecv" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_eval_addictologique" ON "public"."schizophrenia_eval_addictologique" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_isa" ON "public"."schizophrenia_isa" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_panss" ON "public"."schizophrenia_panss" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_perinatalite" ON "public"."schizophrenia_perinatalite" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_psp" ON "public"."schizophrenia_psp" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_sas" ON "public"."schizophrenia_sas" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_screening_diagnostic" ON "public"."schizophrenia_screening_diagnostic" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_screening_orientation" ON "public"."schizophrenia_screening_orientation" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_suicide_history" ON "public"."schizophrenia_suicide_history" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_sumd" ON "public"."schizophrenia_sumd" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_tea_coffee" ON "public"."schizophrenia_tea_coffee" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_troubles_comorbides" ON "public"."schizophrenia_troubles_comorbides" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert schizophrenia_troubles_psychotiques" ON "public"."schizophrenia_troubles_psychotiques" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals insert somatic contraceptive" ON "public"."treatment_somatic_contraceptive" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_aim" ON "public"."bipolar_aim" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_alda" ON "public"."bipolar_alda" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_als18" ON "public"."bipolar_als18" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_aq12" ON "public"."bipolar_aq12" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_asrm" ON "public"."bipolar_asrm" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_asrs" ON "public"."bipolar_asrs" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_bis10" ON "public"."bipolar_bis10" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_cgi" ON "public"."bipolar_cgi" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_csm" ON "public"."bipolar_csm" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_cti" ON "public"."bipolar_cti" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_ctq" ON "public"."bipolar_ctq" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_diagnostic" ON "public"."bipolar_diagnostic" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_egf" ON "public"."bipolar_egf" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_epworth" ON "public"."bipolar_epworth" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_eq5d5l" ON "public"."bipolar_eq5d5l" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_etat_patient" ON "public"."bipolar_etat_patient" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_fast" ON "public"."bipolar_fast" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_madrs" ON "public"."bipolar_madrs" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_mars" ON "public"."bipolar_mars" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_mathys" ON "public"."bipolar_mathys" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_mdq" ON "public"."bipolar_mdq" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_orientation" ON "public"."bipolar_orientation" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_prise_m" ON "public"."bipolar_prise_m" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_psqi" ON "public"."bipolar_psqi" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_qids_sr16" ON "public"."bipolar_qids_sr16" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_social" ON "public"."bipolar_social" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_stai_ya" ON "public"."bipolar_stai_ya" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_wurs25" ON "public"."bipolar_wurs25" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update bipolar_ymrs" ON "public"."bipolar_ymrs" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update medications" ON "public"."patient_medications" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_aims" ON "public"."schizophrenia_aims" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_antecedents_familiaux_psy" ON "public"."schizophrenia_antecedents_familiaux_psy" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_barnes" ON "public"."schizophrenia_barnes" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_bars" ON "public"."schizophrenia_bars" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_bilan_biologique" ON "public"."schizophrenia_bilan_biologique" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_cdss" ON "public"."schizophrenia_cdss" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_dossier_infirmier" ON "public"."schizophrenia_dossier_infirmier" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_ecv" ON "public"."schizophrenia_ecv" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_eval_addictologique" ON "public"."schizophrenia_eval_addictologique" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_isa" ON "public"."schizophrenia_isa" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_panss" ON "public"."schizophrenia_panss" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_perinatalite" ON "public"."schizophrenia_perinatalite" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_psp" ON "public"."schizophrenia_psp" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_sas" ON "public"."schizophrenia_sas" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_screening_diagnostic" ON "public"."schizophrenia_screening_diagnostic" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_screening_orientation" ON "public"."schizophrenia_screening_orientation" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_suicide_history" ON "public"."schizophrenia_suicide_history" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_sumd" ON "public"."schizophrenia_sumd" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_tea_coffee" ON "public"."schizophrenia_tea_coffee" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_troubles_comorbides" ON "public"."schizophrenia_troubles_comorbides" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update schizophrenia_troubles_psychotiques" ON "public"."schizophrenia_troubles_psychotiques" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals update somatic contraceptive" ON "public"."treatment_somatic_contraceptive" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_aim" ON "public"."bipolar_aim" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_alda" ON "public"."bipolar_alda" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_als18" ON "public"."bipolar_als18" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_aq12" ON "public"."bipolar_aq12" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_asrm" ON "public"."bipolar_asrm" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_asrs" ON "public"."bipolar_asrs" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_bis10" ON "public"."bipolar_bis10" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_cgi" ON "public"."bipolar_cgi" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_csm" ON "public"."bipolar_csm" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_cti" ON "public"."bipolar_cti" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_ctq" ON "public"."bipolar_ctq" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_diagnostic" ON "public"."bipolar_diagnostic" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_egf" ON "public"."bipolar_egf" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_epworth" ON "public"."bipolar_epworth" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_eq5d5l" ON "public"."bipolar_eq5d5l" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_etat_patient" ON "public"."bipolar_etat_patient" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_fast" ON "public"."bipolar_fast" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_madrs" ON "public"."bipolar_madrs" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_mars" ON "public"."bipolar_mars" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_mathys" ON "public"."bipolar_mathys" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_mdq" ON "public"."bipolar_mdq" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_orientation" ON "public"."bipolar_orientation" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_prise_m" ON "public"."bipolar_prise_m" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_psqi" ON "public"."bipolar_psqi" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_qids_sr16" ON "public"."bipolar_qids_sr16" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_social" ON "public"."bipolar_social" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_stai_ya" ON "public"."bipolar_stai_ya" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_wurs25" ON "public"."bipolar_wurs25" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all bipolar_ymrs" ON "public"."bipolar_ymrs" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all medications" ON "public"."patient_medications" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view all somatic contraceptive" ON "public"."treatment_somatic_contraceptive" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_aims" ON "public"."schizophrenia_aims" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_antecedents_familiaux_psy" ON "public"."schizophrenia_antecedents_familiaux_psy" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_barnes" ON "public"."schizophrenia_barnes" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_bars" ON "public"."schizophrenia_bars" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_bilan_biologique" ON "public"."schizophrenia_bilan_biologique" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_cdss" ON "public"."schizophrenia_cdss" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_dossier_infirmier" ON "public"."schizophrenia_dossier_infirmier" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_ecv" ON "public"."schizophrenia_ecv" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_eval_addictologique" ON "public"."schizophrenia_eval_addictologique" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_isa" ON "public"."schizophrenia_isa" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_panss" ON "public"."schizophrenia_panss" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_perinatalite" ON "public"."schizophrenia_perinatalite" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_psp" ON "public"."schizophrenia_psp" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_sas" ON "public"."schizophrenia_sas" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_screening_diagnostic" ON "public"."schizophrenia_screening_diagnostic" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_screening_orientation" ON "public"."schizophrenia_screening_orientation" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_suicide_history" ON "public"."schizophrenia_suicide_history" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_sumd" ON "public"."schizophrenia_sumd" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_tea_coffee" ON "public"."schizophrenia_tea_coffee" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_troubles_comorbides" ON "public"."schizophrenia_troubles_comorbides" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Professionals view schizophrenia_troubles_psychotiques" ON "public"."schizophrenia_troubles_psychotiques" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros insert bipolar_followup_arrets_travail" ON "public"."bipolar_followup_arrets_travail" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros insert bipolar_followup_humeur_actuels" ON "public"."bipolar_followup_humeur_actuels" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros insert bipolar_followup_humeur_depuis_visite" ON "public"."bipolar_followup_humeur_depuis_visite" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros insert bipolar_followup_isa" ON "public"."bipolar_followup_isa" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros insert bipolar_followup_psychotiques" ON "public"."bipolar_followup_psychotiques" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros insert bipolar_followup_recours_aux_soins" ON "public"."bipolar_followup_recours_aux_soins" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros insert bipolar_followup_somatique_contraceptif" ON "public"."bipolar_followup_somatique_contraceptif" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros insert bipolar_followup_statut_professionnel" ON "public"."bipolar_followup_statut_professionnel" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros insert bipolar_followup_suicide_behavior" ON "public"."bipolar_followup_suicide_behavior" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros insert bipolar_followup_suivi_recommandations" ON "public"."bipolar_followup_suivi_recommandations" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros insert bipolar_followup_traitement_non_pharma" ON "public"."bipolar_followup_traitement_non_pharma" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros insert non_pharmacologic" ON "public"."bipolar_non_pharmacologic" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros insert psychotropes_lifetime" ON "public"."bipolar_psychotropes_lifetime" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros update bipolar_followup_arrets_travail" ON "public"."bipolar_followup_arrets_travail" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros update bipolar_followup_humeur_actuels" ON "public"."bipolar_followup_humeur_actuels" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros update bipolar_followup_humeur_depuis_visite" ON "public"."bipolar_followup_humeur_depuis_visite" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros update bipolar_followup_isa" ON "public"."bipolar_followup_isa" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros update bipolar_followup_psychotiques" ON "public"."bipolar_followup_psychotiques" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros update bipolar_followup_recours_aux_soins" ON "public"."bipolar_followup_recours_aux_soins" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros update bipolar_followup_somatique_contraceptif" ON "public"."bipolar_followup_somatique_contraceptif" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros update bipolar_followup_statut_professionnel" ON "public"."bipolar_followup_statut_professionnel" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros update bipolar_followup_suicide_behavior" ON "public"."bipolar_followup_suicide_behavior" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros update bipolar_followup_suivi_recommandations" ON "public"."bipolar_followup_suivi_recommandations" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros update bipolar_followup_traitement_non_pharma" ON "public"."bipolar_followup_traitement_non_pharma" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros update non_pharmacologic" ON "public"."bipolar_non_pharmacologic" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros update psychotropes_lifetime" ON "public"."bipolar_psychotropes_lifetime" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros view all non_pharmacologic" ON "public"."bipolar_non_pharmacologic" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros view all psychotropes_lifetime" ON "public"."bipolar_psychotropes_lifetime" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros view bipolar_followup_arrets_travail" ON "public"."bipolar_followup_arrets_travail" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros view bipolar_followup_humeur_actuels" ON "public"."bipolar_followup_humeur_actuels" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros view bipolar_followup_humeur_depuis_visite" ON "public"."bipolar_followup_humeur_depuis_visite" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros view bipolar_followup_isa" ON "public"."bipolar_followup_isa" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros view bipolar_followup_psychotiques" ON "public"."bipolar_followup_psychotiques" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros view bipolar_followup_recours_aux_soins" ON "public"."bipolar_followup_recours_aux_soins" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros view bipolar_followup_somatique_contraceptif" ON "public"."bipolar_followup_somatique_contraceptif" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros view bipolar_followup_statut_professionnel" ON "public"."bipolar_followup_statut_professionnel" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros view bipolar_followup_suicide_behavior" ON "public"."bipolar_followup_suicide_behavior" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros view bipolar_followup_suivi_recommandations" ON "public"."bipolar_followup_suivi_recommandations" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "Pros view bipolar_followup_traitement_non_pharma" ON "public"."bipolar_followup_traitement_non_pharma" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



ALTER TABLE "public"."audit_logs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "audit_logs_center_view" ON "public"."audit_logs" FOR SELECT TO "authenticated" USING ((("center_id" IN ( SELECT "user_profiles"."center_id"
   FROM "public"."user_profiles"
  WHERE ("user_profiles"."id" = "auth"."uid"()))) OR ("user_id" = "auth"."uid"())));



ALTER TABLE "public"."bipolar_aim" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_alda" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_als18" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_antecedents_gyneco" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_aq12" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_asrm" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_asrs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_autres_patho" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_bis10" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_cgi" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_cobra" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_cpt3" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_csm" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_cssrs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_cti" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_ctq" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_cvlt" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_diagnostic" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_diva" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_dsm5_comorbid" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_dsm5_humeur" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_dsm5_psychotic" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_egf" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_epworth" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_eq5d5l" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_etat_patient" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_family_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_fast" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_fluences_verbales" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_followup_arrets_travail" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_followup_humeur_actuels" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_followup_humeur_depuis_visite" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_followup_isa" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_followup_psychotiques" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_followup_recours_aux_soins" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_followup_somatique_contraceptif" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_followup_statut_professionnel" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_followup_suicide_behavior" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_followup_suivi_recommandations" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_followup_traitement_non_pharma" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_isa" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_madrs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_mars" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_mathys" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_mdq" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_mem3_spatial" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_non_pharmacologic" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_nurse_biological_assessment" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_nurse_blood_pressure" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_nurse_ecg" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_nurse_fagerstrom" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_nurse_physical_params" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_nurse_sleep_apnea" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_nurse_tobacco" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_orientation" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_patho_allergique" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_patho_cardio" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_patho_dermato" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_patho_endoc" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_patho_hepato_gastro" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_patho_neuro" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_patho_urinaire" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_perinatalite" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_prise_m" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_psqi" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_psychotropes_lifetime" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_qids_sr16" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_scip" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_sis" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_social" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_stai_ya" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_stroop" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_suicide_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_test_commissions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_tmt" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_wais3_code_symboles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_wais3_cpt2" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_wais3_criteria" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_wais3_digit_span" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_wais3_learning" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_wais3_matrices" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_wais3_vocabulaire" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_wais4_code" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_wais4_criteria" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_wais4_digit_span" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_wais4_learning" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_wais4_matrices" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_wais4_similitudes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_wurs25" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bipolar_ymrs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."center_pathologies" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "center_pathologies_select_authenticated" ON "public"."center_pathologies" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."centers" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "centers_delete" ON "public"."centers" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "centers_insert" ON "public"."centers" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "centers_select_all" ON "public"."centers" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "centers_update" ON "public"."centers" FOR UPDATE TO "authenticated" USING (true);



ALTER TABLE "public"."evaluations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "evaluations_center_isolation" ON "public"."evaluations" TO "authenticated" USING (("patient_id" IN ( SELECT "patients"."id"
   FROM "public"."patients"
  WHERE ("patients"."center_id" IN ( SELECT "user_profiles"."center_id"
           FROM "public"."user_profiles"
          WHERE ("user_profiles"."id" = "auth"."uid"()))))));



ALTER TABLE "public"."login_history" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "login_history_admin_view" ON "public"."login_history" FOR SELECT TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "login_history_view_own" ON "public"."login_history" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "messages_center_isolation" ON "public"."messages" TO "authenticated" USING ((("patient_id" IN ( SELECT "patients"."id"
   FROM "public"."patients"
  WHERE ("patients"."center_id" IN ( SELECT "user_profiles"."center_id"
           FROM "public"."user_profiles"
          WHERE ("user_profiles"."id" = "auth"."uid"()))))) OR ("sender_id" = "auth"."uid"()) OR ("recipient_id" = "auth"."uid"())));



ALTER TABLE "public"."pathologies" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "pathologies_select_authenticated" ON "public"."pathologies" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."patient_medications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."patients" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "patients_center_isolation" ON "public"."patients" TO "authenticated" USING (("center_id" IN ( SELECT "user_profiles"."center_id"
   FROM "public"."user_profiles"
  WHERE ("user_profiles"."id" = "auth"."uid"()))));



ALTER TABLE "public"."permissions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "permissions_select_authenticated" ON "public"."permissions" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "pros_insert_bipolar_nurse_biological_assessment" ON "public"."bipolar_nurse_biological_assessment" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_insert_bipolar_nurse_blood_pressure" ON "public"."bipolar_nurse_blood_pressure" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_insert_bipolar_nurse_ecg" ON "public"."bipolar_nurse_ecg" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_insert_bipolar_nurse_fagerstrom" ON "public"."bipolar_nurse_fagerstrom" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_insert_bipolar_nurse_physical_params" ON "public"."bipolar_nurse_physical_params" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_insert_bipolar_nurse_sleep_apnea" ON "public"."bipolar_nurse_sleep_apnea" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_insert_bipolar_nurse_tobacco" ON "public"."bipolar_nurse_tobacco" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_update_bipolar_nurse_biological_assessment" ON "public"."bipolar_nurse_biological_assessment" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_update_bipolar_nurse_blood_pressure" ON "public"."bipolar_nurse_blood_pressure" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_update_bipolar_nurse_ecg" ON "public"."bipolar_nurse_ecg" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_update_bipolar_nurse_fagerstrom" ON "public"."bipolar_nurse_fagerstrom" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_update_bipolar_nurse_physical_params" ON "public"."bipolar_nurse_physical_params" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_update_bipolar_nurse_sleep_apnea" ON "public"."bipolar_nurse_sleep_apnea" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_update_bipolar_nurse_tobacco" ON "public"."bipolar_nurse_tobacco" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_view_bipolar_nurse_biological_assessment" ON "public"."bipolar_nurse_biological_assessment" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_view_bipolar_nurse_blood_pressure" ON "public"."bipolar_nurse_blood_pressure" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_view_bipolar_nurse_ecg" ON "public"."bipolar_nurse_ecg" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_view_bipolar_nurse_fagerstrom" ON "public"."bipolar_nurse_fagerstrom" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_view_bipolar_nurse_physical_params" ON "public"."bipolar_nurse_physical_params" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_view_bipolar_nurse_sleep_apnea" ON "public"."bipolar_nurse_sleep_apnea" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



CREATE POLICY "pros_view_bipolar_nurse_tobacco" ON "public"."bipolar_nurse_tobacco" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))));



ALTER TABLE "public"."recent_accesses" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "recent_accesses_own_records" ON "public"."recent_accesses" TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."schizophrenia_aims" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_antecedents_familiaux_psy" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_barnes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_bars" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_bilan_biologique" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_cdss" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_dossier_infirmier" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_ecv" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_eval_addictologique" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_isa" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_panss" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_perinatalite" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_psp" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_sas" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_screening_diagnostic" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_screening_orientation" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_suicide_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_sumd" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_tea_coffee" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_troubles_comorbides" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."schizophrenia_troubles_psychotiques" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."treatment_somatic_contraceptive" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_invitations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_invitations_admin_view" ON "public"."user_invitations" FOR SELECT TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "user_invitations_center_view" ON "public"."user_invitations" FOR SELECT TO "authenticated" USING ((("public"."is_manager"() OR "public"."is_admin"()) AND ("center_id" = "public"."get_user_center"())));



CREATE POLICY "user_invitations_creator_update" ON "public"."user_invitations" FOR UPDATE TO "authenticated" USING (("invited_by" = "auth"."uid"()));



CREATE POLICY "user_invitations_manager_insert" ON "public"."user_invitations" FOR INSERT TO "authenticated" WITH CHECK ((("public"."is_manager"() OR "public"."is_admin"()) AND (("center_id" IS NULL) OR ("center_id" = "public"."get_user_center"()))));



CREATE POLICY "user_invitations_professional_insert" ON "public"."user_invitations" FOR INSERT TO "authenticated" WITH CHECK (((EXISTS ( SELECT 1
   FROM "public"."user_profiles"
  WHERE (("user_profiles"."id" = "auth"."uid"()) AND ("user_profiles"."role" = ANY (ARRAY['healthcare_professional'::"public"."user_role", 'manager'::"public"."user_role", 'administrator'::"public"."user_role"]))))) AND ("center_id" = "public"."get_user_center"())));



CREATE POLICY "user_invitations_view_own" ON "public"."user_invitations" FOR SELECT TO "authenticated" USING ((("invited_by" = "auth"."uid"()) OR (("email")::"text" = (( SELECT "user_profiles"."email"
   FROM "public"."user_profiles"
  WHERE ("user_profiles"."id" = "auth"."uid"())))::"text")));



ALTER TABLE "public"."user_permissions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_permissions_admin_all" ON "public"."user_permissions" TO "authenticated" USING ("public"."is_admin"());



CREATE POLICY "user_permissions_view_own" ON "public"."user_permissions" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."user_profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "user_profiles_admin_select" ON "public"."user_profiles" FOR SELECT USING ("public"."is_admin"());



CREATE POLICY "user_profiles_admin_update" ON "public"."user_profiles" FOR UPDATE USING ("public"."is_admin"());



CREATE POLICY "user_profiles_center_select" ON "public"."user_profiles" FOR SELECT USING ((("center_id" IS NOT NULL) AND ("center_id" = "public"."get_user_center"()) AND ("public"."get_user_center"() IS NOT NULL)));



CREATE POLICY "user_profiles_insert" ON "public"."user_profiles" FOR INSERT WITH CHECK (("public"."is_admin"() OR "public"."is_manager"()));



CREATE POLICY "user_profiles_manager_update" ON "public"."user_profiles" FOR UPDATE USING (("public"."is_manager"() AND ("center_id" IS NOT NULL) AND ("center_id" = "public"."get_user_center"())));



CREATE POLICY "user_profiles_no_delete" ON "public"."user_profiles" FOR DELETE USING ("public"."is_admin"());



CREATE POLICY "user_profiles_select_own" ON "public"."user_profiles" FOR SELECT USING (("id" = "auth"."uid"()));



CREATE POLICY "user_profiles_update_own" ON "public"."user_profiles" FOR UPDATE USING (("id" = "auth"."uid"()));



ALTER TABLE "public"."visit_templates" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "visit_templates_select_authenticated" ON "public"."visit_templates" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."visits" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "visits_center_isolation" ON "public"."visits" TO "authenticated" USING (("patient_id" IN ( SELECT "patients"."id"
   FROM "public"."patients"
  WHERE ("patients"."center_id" IN ( SELECT "user_profiles"."center_id"
           FROM "public"."user_profiles"
          WHERE ("user_profiles"."id" = "auth"."uid"()))))));





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

























































































































































GRANT ALL ON FUNCTION "public"."get_patient_profile_data"("p_patient_id" "uuid", "p_center_id" "uuid", "p_from_date" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."get_patient_profile_data"("p_patient_id" "uuid", "p_center_id" "uuid", "p_from_date" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_patient_profile_data"("p_patient_id" "uuid", "p_center_id" "uuid", "p_from_date" timestamp with time zone) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_professional_dashboard_data"("p_professional_id" "uuid", "p_center_id" "uuid", "p_pathology_type" "public"."pathology_type") TO "anon";
GRANT ALL ON FUNCTION "public"."get_professional_dashboard_data"("p_professional_id" "uuid", "p_center_id" "uuid", "p_pathology_type" "public"."pathology_type") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_professional_dashboard_data"("p_professional_id" "uuid", "p_center_id" "uuid", "p_pathology_type" "public"."pathology_type") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_user_center"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_user_center"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_user_center"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_visit_detail"("p_visit_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_visit_detail"("p_visit_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_visit_detail"("p_visit_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_visit_detail_data"("p_visit_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_visit_detail_data"("p_visit_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_visit_detail_data"("p_visit_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_admin"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_admin"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_manager"() TO "anon";
GRANT ALL ON FUNCTION "public"."is_manager"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_manager"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."audit_logs" TO "anon";
GRANT ALL ON TABLE "public"."audit_logs" TO "authenticated";
GRANT ALL ON TABLE "public"."audit_logs" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_aim" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_aim" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_aim" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_alda" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_alda" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_alda" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_als18" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_als18" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_als18" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_antecedents_gyneco" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_antecedents_gyneco" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_antecedents_gyneco" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_aq12" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_aq12" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_aq12" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_asrm" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_asrm" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_asrm" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_asrs" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_asrs" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_asrs" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_autres_patho" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_autres_patho" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_autres_patho" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_bis10" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_bis10" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_bis10" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_cgi" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_cgi" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_cgi" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_cobra" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_cobra" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_cobra" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_cpt3" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_cpt3" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_cpt3" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_csm" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_csm" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_csm" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_cssrs" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_cssrs" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_cssrs" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_cti" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_cti" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_cti" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_ctq" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_ctq" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_ctq" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_cvlt" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_cvlt" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_cvlt" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_diagnostic" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_diagnostic" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_diagnostic" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_diva" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_diva" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_diva" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_dsm5_comorbid" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_dsm5_comorbid" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_dsm5_comorbid" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_dsm5_humeur" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_dsm5_humeur" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_dsm5_humeur" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_dsm5_psychotic" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_dsm5_psychotic" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_dsm5_psychotic" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_egf" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_egf" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_egf" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_epworth" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_epworth" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_epworth" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_eq5d5l" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_eq5d5l" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_eq5d5l" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_etat_patient" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_etat_patient" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_etat_patient" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_family_history" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_family_history" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_family_history" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_fast" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_fast" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_fast" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_fluences_verbales" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_fluences_verbales" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_fluences_verbales" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_followup_arrets_travail" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_followup_arrets_travail" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_followup_arrets_travail" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_followup_humeur_actuels" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_followup_humeur_actuels" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_followup_humeur_actuels" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_followup_humeur_depuis_visite" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_followup_humeur_depuis_visite" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_followup_humeur_depuis_visite" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_followup_isa" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_followup_isa" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_followup_isa" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_followup_psychotiques" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_followup_psychotiques" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_followup_psychotiques" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_followup_recours_aux_soins" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_followup_recours_aux_soins" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_followup_recours_aux_soins" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_followup_somatique_contraceptif" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_followup_somatique_contraceptif" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_followup_somatique_contraceptif" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_followup_statut_professionnel" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_followup_statut_professionnel" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_followup_statut_professionnel" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_followup_suicide_behavior" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_followup_suicide_behavior" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_followup_suicide_behavior" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_followup_suivi_recommandations" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_followup_suivi_recommandations" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_followup_suivi_recommandations" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_followup_traitement_non_pharma" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_followup_traitement_non_pharma" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_followup_traitement_non_pharma" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_isa" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_isa" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_isa" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_madrs" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_madrs" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_madrs" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_mars" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_mars" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_mars" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_mathys" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_mathys" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_mathys" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_mdq" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_mdq" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_mdq" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_mem3_spatial" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_mem3_spatial" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_mem3_spatial" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_non_pharmacologic" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_non_pharmacologic" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_non_pharmacologic" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_nurse_biological_assessment" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_nurse_biological_assessment" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_nurse_biological_assessment" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_nurse_blood_pressure" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_nurse_blood_pressure" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_nurse_blood_pressure" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_nurse_ecg" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_nurse_ecg" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_nurse_ecg" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_nurse_fagerstrom" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_nurse_fagerstrom" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_nurse_fagerstrom" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_nurse_physical_params" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_nurse_physical_params" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_nurse_physical_params" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_nurse_sleep_apnea" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_nurse_sleep_apnea" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_nurse_sleep_apnea" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_nurse_tobacco" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_nurse_tobacco" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_nurse_tobacco" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_orientation" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_orientation" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_orientation" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_patho_allergique" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_patho_allergique" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_patho_allergique" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_patho_cardio" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_patho_cardio" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_patho_cardio" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_patho_dermato" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_patho_dermato" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_patho_dermato" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_patho_endoc" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_patho_endoc" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_patho_endoc" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_patho_hepato_gastro" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_patho_hepato_gastro" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_patho_hepato_gastro" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_patho_neuro" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_patho_neuro" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_patho_neuro" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_patho_urinaire" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_patho_urinaire" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_patho_urinaire" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_perinatalite" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_perinatalite" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_perinatalite" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_prise_m" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_prise_m" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_prise_m" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_psqi" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_psqi" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_psqi" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_psychotropes_lifetime" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_psychotropes_lifetime" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_psychotropes_lifetime" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_qids_sr16" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_qids_sr16" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_qids_sr16" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_scip" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_scip" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_scip" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_sis" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_sis" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_sis" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_social" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_social" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_social" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_stai_ya" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_stai_ya" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_stai_ya" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_stroop" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_stroop" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_stroop" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_suicide_history" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_suicide_history" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_suicide_history" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_test_commissions" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_test_commissions" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_test_commissions" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_tmt" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_tmt" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_tmt" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_wais3_code_symboles" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_wais3_code_symboles" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_wais3_code_symboles" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_wais3_cpt2" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_wais3_cpt2" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_wais3_cpt2" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_wais3_criteria" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_wais3_criteria" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_wais3_criteria" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_wais3_digit_span" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_wais3_digit_span" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_wais3_digit_span" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_wais3_learning" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_wais3_learning" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_wais3_learning" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_wais3_matrices" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_wais3_matrices" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_wais3_matrices" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_wais3_vocabulaire" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_wais3_vocabulaire" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_wais3_vocabulaire" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_wais4_code" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_wais4_code" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_wais4_code" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_wais4_criteria" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_wais4_criteria" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_wais4_criteria" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_wais4_digit_span" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_wais4_digit_span" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_wais4_digit_span" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_wais4_learning" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_wais4_learning" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_wais4_learning" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_wais4_matrices" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_wais4_matrices" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_wais4_matrices" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_wais4_similitudes" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_wais4_similitudes" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_wais4_similitudes" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_wurs25" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_wurs25" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_wurs25" TO "service_role";



GRANT ALL ON TABLE "public"."bipolar_ymrs" TO "anon";
GRANT ALL ON TABLE "public"."bipolar_ymrs" TO "authenticated";
GRANT ALL ON TABLE "public"."bipolar_ymrs" TO "service_role";



GRANT ALL ON TABLE "public"."center_pathologies" TO "anon";
GRANT ALL ON TABLE "public"."center_pathologies" TO "authenticated";
GRANT ALL ON TABLE "public"."center_pathologies" TO "service_role";



GRANT ALL ON TABLE "public"."centers" TO "anon";
GRANT ALL ON TABLE "public"."centers" TO "authenticated";
GRANT ALL ON TABLE "public"."centers" TO "service_role";



GRANT ALL ON TABLE "public"."evaluations" TO "anon";
GRANT ALL ON TABLE "public"."evaluations" TO "authenticated";
GRANT ALL ON TABLE "public"."evaluations" TO "service_role";



GRANT ALL ON TABLE "public"."login_history" TO "anon";
GRANT ALL ON TABLE "public"."login_history" TO "authenticated";
GRANT ALL ON TABLE "public"."login_history" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON TABLE "public"."pathologies" TO "anon";
GRANT ALL ON TABLE "public"."pathologies" TO "authenticated";
GRANT ALL ON TABLE "public"."pathologies" TO "service_role";



GRANT ALL ON TABLE "public"."patient_medications" TO "anon";
GRANT ALL ON TABLE "public"."patient_medications" TO "authenticated";
GRANT ALL ON TABLE "public"."patient_medications" TO "service_role";



GRANT ALL ON TABLE "public"."patients" TO "anon";
GRANT ALL ON TABLE "public"."patients" TO "authenticated";
GRANT ALL ON TABLE "public"."patients" TO "service_role";



GRANT ALL ON TABLE "public"."permissions" TO "anon";
GRANT ALL ON TABLE "public"."permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."permissions" TO "service_role";



GRANT ALL ON TABLE "public"."recent_accesses" TO "anon";
GRANT ALL ON TABLE "public"."recent_accesses" TO "authenticated";
GRANT ALL ON TABLE "public"."recent_accesses" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_aims" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_aims" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_aims" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_antecedents_familiaux_psy" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_antecedents_familiaux_psy" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_antecedents_familiaux_psy" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_barnes" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_barnes" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_barnes" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_bars" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_bars" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_bars" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_bilan_biologique" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_bilan_biologique" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_bilan_biologique" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_cdss" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_cdss" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_cdss" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_dossier_infirmier" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_dossier_infirmier" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_dossier_infirmier" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_ecv" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_ecv" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_ecv" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_eval_addictologique" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_eval_addictologique" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_eval_addictologique" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_isa" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_isa" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_isa" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_panss" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_panss" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_panss" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_perinatalite" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_perinatalite" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_perinatalite" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_psp" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_psp" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_psp" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_sas" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_sas" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_sas" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_screening_diagnostic" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_screening_diagnostic" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_screening_diagnostic" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_screening_orientation" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_screening_orientation" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_screening_orientation" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_suicide_history" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_suicide_history" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_suicide_history" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_sumd" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_sumd" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_sumd" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_tea_coffee" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_tea_coffee" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_tea_coffee" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_troubles_comorbides" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_troubles_comorbides" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_troubles_comorbides" TO "service_role";



GRANT ALL ON TABLE "public"."schizophrenia_troubles_psychotiques" TO "anon";
GRANT ALL ON TABLE "public"."schizophrenia_troubles_psychotiques" TO "authenticated";
GRANT ALL ON TABLE "public"."schizophrenia_troubles_psychotiques" TO "service_role";



GRANT ALL ON TABLE "public"."treatment_somatic_contraceptive" TO "anon";
GRANT ALL ON TABLE "public"."treatment_somatic_contraceptive" TO "authenticated";
GRANT ALL ON TABLE "public"."treatment_somatic_contraceptive" TO "service_role";



GRANT ALL ON TABLE "public"."user_invitations" TO "anon";
GRANT ALL ON TABLE "public"."user_invitations" TO "authenticated";
GRANT ALL ON TABLE "public"."user_invitations" TO "service_role";



GRANT ALL ON TABLE "public"."user_permissions" TO "anon";
GRANT ALL ON TABLE "public"."user_permissions" TO "authenticated";
GRANT ALL ON TABLE "public"."user_permissions" TO "service_role";



GRANT ALL ON TABLE "public"."user_profiles" TO "anon";
GRANT ALL ON TABLE "public"."user_profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."user_profiles" TO "service_role";



GRANT ALL ON TABLE "public"."v_patients_full" TO "anon";
GRANT ALL ON TABLE "public"."v_patients_full" TO "authenticated";
GRANT ALL ON TABLE "public"."v_patients_full" TO "service_role";



GRANT ALL ON TABLE "public"."v_users_full" TO "anon";
GRANT ALL ON TABLE "public"."v_users_full" TO "authenticated";
GRANT ALL ON TABLE "public"."v_users_full" TO "service_role";



GRANT ALL ON TABLE "public"."visit_templates" TO "anon";
GRANT ALL ON TABLE "public"."visit_templates" TO "authenticated";
GRANT ALL ON TABLE "public"."visit_templates" TO "service_role";



GRANT ALL ON TABLE "public"."visits" TO "anon";
GRANT ALL ON TABLE "public"."visits" TO "authenticated";
GRANT ALL ON TABLE "public"."visits" TO "service_role";



GRANT ALL ON TABLE "public"."v_visits_full" TO "anon";
GRANT ALL ON TABLE "public"."v_visits_full" TO "authenticated";
GRANT ALL ON TABLE "public"."v_visits_full" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































