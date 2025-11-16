-- ============================================================================
-- eFondaMental Platform - eBipolar Specific Clinical Modules
-- ============================================================================
-- This migration creates detailed eBipolar-specific visit templates with
-- comprehensive clinical questionnaires including MADRS, YMRS, CGI, FAST
-- and conditional logic for dynamic questionnaire flow
-- ============================================================================

DO $$
DECLARE
  bipolar_pathology_id UUID;
  template_id UUID;
  module_id UUID;
  questionnaire_id UUID;
BEGIN
  -- Get bipolar pathology ID
  SELECT id INTO bipolar_pathology_id FROM pathologies WHERE type = 'bipolar';

  IF bipolar_pathology_id IS NULL THEN
    RAISE EXCEPTION 'Bipolar pathology not found';
  END IF;

  -- Delete existing bipolar visit templates to avoid duplicates
  -- This allows us to replace generic templates with eBipolar-specific ones
  DELETE FROM visit_templates WHERE pathology_id = bipolar_pathology_id;

  -- ========================================================================
  -- eBIPOLAR SCREENING VISIT (Enhanced)
  -- ========================================================================
  INSERT INTO visit_templates (pathology_id, visit_type, name, description, active)
  VALUES (
    bipolar_pathology_id,
    'screening',
    'eBipolar Screening Visit',
    'Comprehensive screening for bipolar disorder including mood assessment and eligibility',
    true
  )
  RETURNING id INTO template_id;

  -- Module: Socio-Demographics
  INSERT INTO modules (visit_template_id, name, description, order_index, active)
  VALUES (
    template_id,
    'Socio-Demographics',
    'Detailed demographic and social information',
    1,
    true
  )
  RETURNING id INTO module_id;

  INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active)
  VALUES (
    module_id,
    'EBIP_SCR_DEMO',
    'Socio-Demographic Information',
    'Comprehensive demographic data collection',
    'healthcare_professional',
    '[
      {
        "id": "age",
        "type": "number",
        "text": "Age",
        "required": true,
        "min": 0,
        "max": 120
      },
      {
        "id": "marital_status",
        "type": "single_choice",
        "text": "Marital Status",
        "required": true,
        "options": ["Single", "Married", "Divorced", "Widowed", "Separated", "Partner"]
      },
      {
        "id": "education",
        "type": "single_choice",
        "text": "Highest Education Level",
        "required": true,
        "options": ["No formal education", "Primary", "Secondary", "Vocational", "University", "Postgraduate"]
      },
      {
        "id": "employment",
        "type": "single_choice",
        "text": "Employment Status",
        "required": true,
        "options": ["Employed full-time", "Employed part-time", "Unemployed", "Student", "Retired", "Disability"]
      },
      {
        "id": "living_situation",
        "type": "single_choice",
        "text": "Living Situation",
        "required": true,
        "options": ["Alone", "With partner", "With family", "Shared accommodation", "Supported housing", "Other"]
      }
    ]'::jsonb,
    true
  );

  -- Module: Clinical History
  INSERT INTO modules (visit_template_id, name, description, order_index, active)
  VALUES (
    template_id,
    'Clinical History',
    'Psychiatric and medical history',
    2,
    true
  )
  RETURNING id INTO module_id;

  INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active)
  VALUES (
    module_id,
    'EBIP_SCR_HISTORY',
    'Clinical History',
    'Detailed psychiatric and medical history',
    'healthcare_professional',
    '[
      {
        "id": "age_first_episode",
        "type": "number",
        "text": "Age at first mood episode",
        "required": true,
        "min": 0,
        "max": 100
      },
      {
        "id": "first_episode_type",
        "type": "single_choice",
        "text": "Type of first episode",
        "required": true,
        "options": ["Depressive", "Manic", "Hypomanic", "Mixed", "Unknown"]
      },
      {
        "id": "total_episodes",
        "type": "number",
        "text": "Total number of mood episodes (lifetime)",
        "required": false,
        "min": 0
      },
      {
        "id": "hospitalizations",
        "type": "number",
        "text": "Number of psychiatric hospitalizations",
        "required": true,
        "min": 0
      },
      {
        "id": "suicide_attempts",
        "type": "number",
        "text": "Number of suicide attempts",
        "required": true,
        "min": 0
      },
      {
        "id": "family_history",
        "type": "boolean",
        "text": "Family history of mood disorders?",
        "required": true
      }
    ]'::jsonb,
    true
  );

  -- ========================================================================
  -- eBIPOLAR INITIAL EVALUATION (Enhanced with Clinical Scales)
  -- ========================================================================
  INSERT INTO visit_templates (pathology_id, visit_type, name, description, active)
  VALUES (
    bipolar_pathology_id,
    'initial_evaluation',
    'eBipolar Initial Evaluation',
    'Comprehensive initial evaluation with standardized clinical scales',
    true
  )
  RETURNING id INTO template_id;

  -- Module: Current Episode Assessment
  INSERT INTO modules (visit_template_id, name, description, order_index, active)
  VALUES (
    template_id,
    'Current Episode Assessment',
    'Evaluation of current mood episode',
    1,
    true
  )
  RETURNING id INTO module_id;

  INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, conditional_logic, active)
  VALUES (
    module_id,
    'EBIP_INIT_EPISODE',
    'Current Episode Type',
    'Determine current episode type to trigger appropriate scales',
    'healthcare_professional',
    '[
      {
        "id": "current_episode",
        "type": "single_choice",
        "text": "Current episode type",
        "required": true,
        "options": ["Depressive", "Manic", "Hypomanic", "Mixed", "Euthymic"]
      },
      {
        "id": "episode_duration",
        "type": "number",
        "text": "Duration of current episode (days)",
        "required": true,
        "min": 0
      }
    ]'::jsonb,
    '{
      "rules": [
        {
          "condition": {
            "questionId": "current_episode",
            "operator": "equals",
            "value": "Depressive"
          },
          "action": {
            "type": "show_subquestionnaire",
            "questionnaire": "EBIP_MADRS"
          }
        },
        {
          "condition": {
            "questionId": "current_episode",
            "operator": "equals",
            "value": "Manic"
          },
          "action": {
            "type": "show_subquestionnaire",
            "questionnaire": "EBIP_YMRS"
          }
        },
        {
          "condition": {
            "questionId": "current_episode",
            "operator": "equals",
            "value": "Hypomanic"
          },
          "action": {
            "type": "show_subquestionnaire",
            "questionnaire": "EBIP_YMRS"
          }
        },
        {
          "condition": {
            "questionId": "current_episode",
            "operator": "equals",
            "value": "Mixed"
          },
          "action": {
            "type": "show_subquestionnaire",
            "questionnaire": "EBIP_MADRS"
          }
        }
      ]
    }'::jsonb,
    true
  )
  RETURNING id INTO questionnaire_id;

  -- Questionnaire: MADRS (Montgomery-Asberg Depression Rating Scale)
  INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active)
  VALUES (
    module_id,
    'EBIP_MADRS',
    'MADRS - Montgomery-Asberg Depression Rating Scale',
    'Standardized depression severity assessment',
    'healthcare_professional',
    '[
      {
        "id": "madrs_1",
        "type": "single_choice",
        "text": "1. Apparent Sadness",
        "required": true,
        "options": ["0 - No sadness", "1", "2 - Looks dispirited but brightens up", "3", "4 - Sad and gloomy most of the time", "5", "6 - Looks miserable all the time"]
      },
      {
        "id": "madrs_2",
        "type": "single_choice",
        "text": "2. Reported Sadness",
        "required": true,
        "options": ["0 - Occasional sadness", "1", "2 - Sad or low but brightens up", "3", "4 - Pervasive feelings of sadness", "5", "6 - Continuous or unvarying sadness, misery or despondency"]
      },
      {
        "id": "madrs_3",
        "type": "single_choice",
        "text": "3. Inner Tension",
        "required": true,
        "options": ["0 - Placid, only fleeting inner tension", "1", "2 - Occasional feelings of edginess", "3", "4 - Continuous feelings of inner tension", "5", "6 - Unrelenting dread or anguish, overwhelming panic"]
      },
      {
        "id": "madrs_4",
        "type": "single_choice",
        "text": "4. Reduced Sleep",
        "required": true,
        "options": ["0 - Sleeps as usual", "1", "2 - Slight difficulty dropping off", "3", "4 - Sleep reduced by 2 hours", "5", "6 - Less than 2-3 hours sleep"]
      },
      {
        "id": "madrs_5",
        "type": "single_choice",
        "text": "5. Reduced Appetite",
        "required": true,
        "options": ["0 - Normal or increased appetite", "1", "2 - Slightly reduced appetite", "3", "4 - No appetite, food is tasteless", "5", "6 - Needs persuasion to eat at all"]
      },
      {
        "id": "madrs_6",
        "type": "single_choice",
        "text": "6. Concentration Difficulties",
        "required": true,
        "options": ["0 - No difficulties", "1", "2 - Occasional difficulties collecting thoughts", "3", "4 - Difficulties concentrating and sustaining thought", "5", "6 - Unable to read or converse without great difficulty"]
      },
      {
        "id": "madrs_7",
        "type": "single_choice",
        "text": "7. Lassitude",
        "required": true,
        "options": ["0 - Hardly any difficulty getting started", "1", "2 - Difficulties starting activities", "3", "4 - Difficulties starting simple routine activities", "5", "6 - Complete lassitude, unable to do anything"]
      },
      {
        "id": "madrs_8",
        "type": "single_choice",
        "text": "8. Inability to Feel",
        "required": true,
        "options": ["0 - Normal interest in surroundings", "1", "2 - Reduced ability to enjoy usual interests", "3", "4 - Loss of interest in surroundings", "5", "6 - Experience of being emotionally paralyzed"]
      },
      {
        "id": "madrs_9",
        "type": "single_choice",
        "text": "9. Pessimistic Thoughts",
        "required": true,
        "options": ["0 - No pessimistic thoughts", "1", "2 - Fluctuating ideas of failure, self-reproach", "3", "4 - Persistent self-accusations", "5", "6 - Delusions of ruin, remorse, unredeemable sin"]
      },
      {
        "id": "madrs_10",
        "type": "single_choice",
        "text": "10. Suicidal Thoughts",
        "required": true,
        "options": ["0 - Enjoys life", "1", "2 - Weary of life, fleeting suicidal thoughts", "3", "4 - Probably better off dead, suicidal thoughts common", "5", "6 - Explicit plans for suicide when opportunity arises"]
      }
    ]'::jsonb,
    true
  );

  -- Questionnaire: YMRS (Young Mania Rating Scale)
  INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active)
  VALUES (
    module_id,
    'EBIP_YMRS',
    'YMRS - Young Mania Rating Scale',
    'Standardized mania severity assessment',
    'healthcare_professional',
    '[
      {
        "id": "ymrs_1",
        "type": "single_choice",
        "text": "1. Elevated Mood",
        "required": true,
        "options": ["0 - Absent", "1 - Mildly or possibly increased", "2 - Definite subjective elevation", "3 - Elevated, inappropriate to circumstances", "4 - Euphoric, inappropriate laughter"]
      },
      {
        "id": "ymrs_2",
        "type": "single_choice",
        "text": "2. Increased Motor Activity-Energy",
        "required": true,
        "options": ["0 - Absent", "1 - Subjectively increased", "2 - Animated, gestures increased", "3 - Excessive energy, hyperactive", "4 - Motor excitement, continuous hyperactivity"]
      },
      {
        "id": "ymrs_3",
        "type": "single_choice",
        "text": "3. Sexual Interest",
        "required": true,
        "options": ["0 - Normal", "1 - Mildly or possibly increased", "2 - Describes subjective increase", "3 - Sexual content prominent, flirtatious", "4 - Overt sexual acts"]
      },
      {
        "id": "ymrs_4",
        "type": "single_choice",
        "text": "4. Sleep",
        "required": true,
        "options": ["0 - Reports no decrease in sleep", "1 - Sleeping less than normal by up to 1 hour", "2 - Sleeping less than normal by more than 1 hour", "3 - Reports decreased need for sleep", "4 - Denies need for sleep"]
      },
      {
        "id": "ymrs_5",
        "type": "single_choice",
        "text": "5. Irritability",
        "required": true,
        "options": ["0 - Absent", "2 - Subjectively increased", "4 - Irritable at times during interview", "6 - Frequently irritable, short tempered", "8 - Hostile, uncooperative"]
      },
      {
        "id": "ymrs_6",
        "type": "single_choice",
        "text": "6. Speech (Rate and Amount)",
        "required": true,
        "options": ["0 - No increase", "2 - Feels talkative", "4 - Increased rate or amount", "6 - Push, difficult to interrupt", "8 - Pressured, uninterruptible, continuous"]
      },
      {
        "id": "ymrs_7",
        "type": "single_choice",
        "text": "7. Language-Thought Disorder",
        "required": true,
        "options": ["0 - Absent", "1 - Circumstantial, mild distractibility", "2 - Distractible, loses goal", "3 - Flight of ideas, tangentiality", "4 - Incoherent, communication impossible"]
      },
      {
        "id": "ymrs_8",
        "type": "single_choice",
        "text": "8. Content",
        "required": true,
        "options": ["0 - Normal", "2 - Questionable plans, new interests", "4 - Special project(s), grandiose", "6 - Grandiose or paranoid ideas", "8 - Delusions, hallucinations"]
      },
      {
        "id": "ymrs_9",
        "type": "single_choice",
        "text": "9. Disruptive-Aggressive Behavior",
        "required": true,
        "options": ["0 - Absent, cooperative", "2 - Sarcastic, loud at times", "4 - Demanding, threats on ward", "6 - Threatens interviewer, shouting", "8 - Assaultive, requires restraint"]
      },
      {
        "id": "ymrs_10",
        "type": "single_choice",
        "text": "10. Appearance",
        "required": true,
        "options": ["0 - Appropriate dress and grooming", "1 - Minimally unkempt", "2 - Poorly groomed, moderately disheveled", "3 - Disheveled, partly clothed, garish makeup", "4 - Completely unkempt, decorated, bizarre garb"]
      },
      {
        "id": "ymrs_11",
        "type": "single_choice",
        "text": "11. Insight",
        "required": true,
        "options": ["0 - Present, admits illness", "1 - Possibly ill", "2 - Admits behavior change, but denies illness", "3 - Admits possible change in behavior", "4 - Denies any behavior change"]
      }
    ]'::jsonb,
    true
  );

  -- Module: Clinical Global Impression (CGI)
  INSERT INTO modules (visit_template_id, name, description, order_index, active)
  VALUES (
    template_id,
    'Clinical Global Impression',
    'Overall clinical severity assessment',
    2,
    true
  )
  RETURNING id INTO module_id;

  INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active)
  VALUES (
    module_id,
    'EBIP_CGI',
    'CGI - Clinical Global Impression',
    'Global assessment of illness severity',
    'healthcare_professional',
    '[
      {
        "id": "cgi_severity",
        "type": "single_choice",
        "text": "CGI-Severity: Considering your total clinical experience with bipolar disorder, how mentally ill is the patient at this time?",
        "required": true,
        "options": [
          "1 - Normal, not at all ill",
          "2 - Borderline mentally ill",
          "3 - Mildly ill",
          "4 - Moderately ill",
          "5 - Markedly ill",
          "6 - Severely ill",
          "7 - Among the most extremely ill patients"
        ]
      }
    ]'::jsonb,
    true
  );

  -- Module: Functioning Assessment
  INSERT INTO modules (visit_template_id, name, description, order_index, active)
  VALUES (
    template_id,
    'Functioning Assessment',
    'Psychosocial functioning evaluation',
    3,
    true
  )
  RETURNING id INTO module_id;

  INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active)
  VALUES (
    module_id,
    'EBIP_FAST',
    'FAST - Functioning Assessment Short Test',
    'Assessment of functional impairment',
    'healthcare_professional',
    '[
      {
        "id": "fast_autonomy",
        "type": "scale",
        "text": "Autonomy: Difficulty managing own finances",
        "required": true,
        "min": 0,
        "max": 3,
        "minLabel": "No difficulty",
        "maxLabel": "Severe difficulty"
      },
      {
        "id": "fast_work",
        "type": "scale",
        "text": "Occupational Functioning: Difficulty maintaining employment",
        "required": true,
        "min": 0,
        "max": 3,
        "minLabel": "No difficulty",
        "maxLabel": "Severe difficulty"
      },
      {
        "id": "fast_cognitive",
        "type": "scale",
        "text": "Cognitive Functioning: Problems with concentration",
        "required": true,
        "min": 0,
        "max": 3,
        "minLabel": "No difficulty",
        "maxLabel": "Severe difficulty"
      },
      {
        "id": "fast_interpersonal",
        "type": "scale",
        "text": "Interpersonal Relationships: Difficulty maintaining friendships",
        "required": true,
        "min": 0,
        "max": 3,
        "minLabel": "No difficulty",
        "maxLabel": "Severe difficulty"
      },
      {
        "id": "fast_leisure",
        "type": "scale",
        "text": "Leisure Time: Difficulty enjoying hobbies",
        "required": true,
        "min": 0,
        "max": 3,
        "minLabel": "No difficulty",
        "maxLabel": "Severe difficulty"
      }
    ]'::jsonb,
    true
  );

  -- Module: Treatment Plan
  INSERT INTO modules (visit_template_id, name, description, order_index, active)
  VALUES (
    template_id,
    'Treatment Plan',
    'Current medications and treatment strategy',
    4,
    true
  )
  RETURNING id INTO module_id;

  INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active)
  VALUES (
    module_id,
    'EBIP_INIT_TX',
    'Treatment Plan',
    'Document current treatment regimen',
    'healthcare_professional',
    '[
      {
        "id": "current_meds",
        "type": "text",
        "text": "Current medications (with dosages)",
        "required": true
      },
      {
        "id": "medication_adherence",
        "type": "scale",
        "text": "Estimated medication adherence (%)",
        "required": true,
        "min": 0,
        "max": 100
      },
      {
        "id": "psychotherapy",
        "type": "boolean",
        "text": "Currently in psychotherapy?",
        "required": true
      },
      {
        "id": "treatment_plan",
        "type": "text",
        "text": "Treatment plan and recommendations",
        "required": false
      }
    ]'::jsonb,
    true
  );

  -- ========================================================================
  -- eBIPOLAR BIANNUAL FOLLOW-UP (Using generic template)
  -- ========================================================================
  INSERT INTO visit_templates (pathology_id, visit_type, name, description, active)
  VALUES (
    bipolar_pathology_id,
    'biannual_followup',
    'eBipolar Biannual Follow-up',
    'Six-month follow-up evaluation for bipolar disorder',
    true
  )
  RETURNING id INTO template_id;

  INSERT INTO modules (visit_template_id, name, description, order_index, active)
  VALUES (
    template_id,
    'Follow-up Assessment',
    'Six-month clinical follow-up',
    1,
    true
  )
  RETURNING id INTO module_id;

  INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active)
  VALUES (
    module_id,
    'EBIP_BI_ASSESS',
    'Biannual Follow-up Assessment',
    'Six-month clinical evaluation',
    'healthcare_professional',
    '[
      {
        "id": "q1",
        "type": "scale",
        "text": "Current mood state (0=worst, 10=best)",
        "required": true,
        "min": 0,
        "max": 10
      },
      {
        "id": "q2",
        "type": "scale",
        "text": "Medication adherence (0-100%)",
        "required": true,
        "min": 0,
        "max": 100
      },
      {
        "id": "q3",
        "type": "single_choice",
        "text": "Overall functioning",
        "required": true,
        "options": ["Poor", "Fair", "Good", "Excellent"]
      },
      {
        "id": "q4",
        "type": "number",
        "text": "Number of mood episodes since last visit",
        "required": false,
        "min": 0
      },
      {
        "id": "q5",
        "type": "text",
        "text": "Progress notes",
        "required": false
      }
    ]'::jsonb,
    true
  );

  -- ========================================================================
  -- eBIPOLAR ANNUAL EVALUATION
  -- ========================================================================
  INSERT INTO visit_templates (pathology_id, visit_type, name, description, active)
  VALUES (
    bipolar_pathology_id,
    'annual_evaluation',
    'eBipolar Annual Evaluation',
    'Comprehensive annual review for bipolar disorder',
    true
  )
  RETURNING id INTO template_id;

  INSERT INTO modules (visit_template_id, name, description, order_index, active)
  VALUES (
    template_id,
    'Annual Review',
    'Comprehensive yearly assessment',
    1,
    true
  )
  RETURNING id INTO module_id;

  INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active)
  VALUES (
    module_id,
    'EBIP_ANN_REVIEW',
    'Annual Comprehensive Review',
    'Yearly comprehensive clinical evaluation',
    'healthcare_professional',
    '[
      {
        "id": "q1",
        "type": "scale",
        "text": "Overall improvement over past year (0=much worse, 10=much better)",
        "required": true,
        "min": 0,
        "max": 10
      },
      {
        "id": "q2",
        "type": "number",
        "text": "Number of depressive episodes in past year",
        "required": true,
        "min": 0
      },
      {
        "id": "q3",
        "type": "number",
        "text": "Number of manic/hypomanic episodes in past year",
        "required": true,
        "min": 0
      },
      {
        "id": "q4",
        "type": "scale",
        "text": "Average medication adherence (%)",
        "required": true,
        "min": 0,
        "max": 100
      },
      {
        "id": "q5",
        "type": "text",
        "text": "Treatment plan updates",
        "required": false
      }
    ]'::jsonb,
    true
  );

  -- ========================================================================
  -- eBIPOLAR OFF-SCHEDULE VISIT
  -- ========================================================================
  INSERT INTO visit_templates (pathology_id, visit_type, name, description, active)
  VALUES (
    bipolar_pathology_id,
    'off_schedule',
    'eBipolar Off-Schedule Visit',
    'Unscheduled visit for urgent clinical needs',
    true
  )
  RETURNING id INTO template_id;

  INSERT INTO modules (visit_template_id, name, description, order_index, active)
  VALUES (
    template_id,
    'Urgent Assessment',
    'Assessment for off-schedule visit',
    1,
    true
  )
  RETURNING id INTO module_id;

  INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active)
  VALUES (
    module_id,
    'EBIP_OFF_ASSESS',
    'Off-Schedule Clinical Assessment',
    'Urgent clinical evaluation',
    'healthcare_professional',
    '[
      {
        "id": "q1",
        "type": "text",
        "text": "Reason for off-schedule visit",
        "required": true
      },
      {
        "id": "q2",
        "type": "single_choice",
        "text": "Current episode type",
        "required": true,
        "options": ["Depressive", "Manic", "Hypomanic", "Mixed", "Euthymic", "Uncertain"]
      },
      {
        "id": "q3",
        "type": "single_choice",
        "text": "Urgency level",
        "required": true,
        "options": ["Routine", "Moderate", "Urgent", "Emergency"]
      },
      {
        "id": "q4",
        "type": "scale",
        "text": "Current mood state (0=worst, 10=best)",
        "required": true,
        "min": 0,
        "max": 10
      },
      {
        "id": "q5",
        "type": "single_choice",
        "text": "Suicide risk assessment",
        "required": true,
        "options": ["None", "Low", "Moderate", "High"]
      },
      {
        "id": "q6",
        "type": "text",
        "text": "Intervention provided",
        "required": false
      }
    ]'::jsonb,
    true
  );

  RAISE NOTICE 'eBipolar specific clinical modules created successfully';
END $$;

