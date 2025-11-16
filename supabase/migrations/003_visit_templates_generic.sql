-- ============================================================================
-- eFondaMental Platform - Generic Visit Templates Migration
-- ============================================================================
-- This migration creates standard visit templates and modules that are
-- applicable across all pathologies (Bipolar, Schizophrenia, ASD, Depression)
-- ============================================================================

-- Delete existing visit templates and related data (cascades to modules and questionnaires)
DELETE FROM visit_templates;

-- Create generic visit templates for each pathology
DO $$
DECLARE
  pathology_rec RECORD;
  template_id UUID;
  module_id UUID;
BEGIN
  -- Loop through all pathologies
  FOR pathology_rec IN SELECT id, type FROM pathologies LOOP
    
    -- ========================================================================
    -- SCREENING VISIT
    -- ========================================================================
    INSERT INTO visit_templates (pathology_id, visit_type, name, description, active)
    VALUES (
      pathology_rec.id,
      'screening',
      'Screening Visit',
      'Initial screening to assess eligibility and gather baseline information',
      true
    )
    RETURNING id INTO template_id;

    -- Module 1: Demographics & Contact
    INSERT INTO modules (visit_template_id, name, description, order_index, active)
    VALUES (
      template_id,
      'Demographics & Contact Information',
      'Basic patient information and contact details',
      1,
      true
    )
    RETURNING id INTO module_id;

    -- Questionnaire: Basic Information
    INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active)
    VALUES (
      module_id,
      CONCAT('SCR_DEMO_', UPPER(pathology_rec.type::text)),
      'Patient Demographics',
      'Collect basic demographic and contact information',
      'healthcare_professional',
      '[
        {
          "id": "q1",
          "type": "text",
          "text": "Full Name",
          "required": true
        },
        {
          "id": "q2",
          "type": "date",
          "text": "Date of Birth",
          "required": true
        },
        {
          "id": "q3",
          "type": "single_choice",
          "text": "Gender",
          "required": true,
          "options": ["Male", "Female", "Other", "Prefer not to say"]
        },
        {
          "id": "q4",
          "type": "text",
          "text": "Phone Number",
          "required": false
        },
        {
          "id": "q5",
          "type": "text",
          "text": "Email Address",
          "required": false
        }
      ]'::jsonb,
      true
    );

    -- Module 2: Medical History
    INSERT INTO modules (visit_template_id, name, description, order_index, active)
    VALUES (
      template_id,
      'Medical History',
      'Previous medical history and current medications',
      2,
      true
    )
    RETURNING id INTO module_id;

    INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active)
    VALUES (
      module_id,
      CONCAT('SCR_MEDHX_', UPPER(pathology_rec.type::text)),
      'Medical History',
      'Record medical history and current medications',
      'healthcare_professional',
      '[
        {
          "id": "q1",
          "type": "text",
          "text": "Previous psychiatric diagnoses",
          "required": false
        },
        {
          "id": "q2",
          "type": "text",
          "text": "Current medications",
          "required": false
        },
        {
          "id": "q3",
          "type": "boolean",
          "text": "Previous hospitalizations?",
          "required": true
        },
        {
          "id": "q4",
          "type": "text",
          "text": "If yes, provide details",
          "required": false
        }
      ]'::jsonb,
      true
    );

    -- ========================================================================
    -- INITIAL EVALUATION
    -- ========================================================================
    INSERT INTO visit_templates (pathology_id, visit_type, name, description, active)
    VALUES (
      pathology_rec.id,
      'initial_evaluation',
      'Initial Evaluation',
      'Comprehensive initial clinical evaluation',
      true
    )
    RETURNING id INTO template_id;

    -- Module: Clinical Assessment
    INSERT INTO modules (visit_template_id, name, description, order_index, active)
    VALUES (
      template_id,
      'Clinical Assessment',
      'Comprehensive clinical evaluation',
      1,
      true
    )
    RETURNING id INTO module_id;

    INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active)
    VALUES (
      module_id,
      CONCAT('INIT_CLIN_', UPPER(pathology_rec.type::text)),
      'Clinical Assessment',
      'Initial clinical evaluation',
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
          "type": "single_choice",
          "text": "Current episode type",
          "required": true,
          "options": ["Depressive", "Manic", "Mixed", "Euthymic", "Not applicable"]
        },
        {
          "id": "q3",
          "type": "single_choice",
          "text": "Suicide risk assessment",
          "required": true,
          "options": ["None", "Low", "Moderate", "High"]
        },
        {
          "id": "q4",
          "type": "text",
          "text": "Clinical notes",
          "required": false
        }
      ]'::jsonb,
      true
    );

    -- Module: Risk Assessment
    INSERT INTO modules (visit_template_id, name, description, order_index, active)
    VALUES (
      template_id,
      'Risk Assessment',
      'Comprehensive risk evaluation',
      2,
      true
    )
    RETURNING id INTO module_id;

    INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active)
    VALUES (
      module_id,
      CONCAT('INIT_RISK_', UPPER(pathology_rec.type::text)),
      'Risk Assessment',
      'Evaluate suicide and relapse risk',
      'healthcare_professional',
      '[
        {
          "id": "q1",
          "type": "single_choice",
          "text": "Suicide risk level",
          "required": true,
          "options": ["None", "Low", "Moderate", "High"]
        },
        {
          "id": "q2",
          "type": "single_choice",
          "text": "Relapse risk level",
          "required": true,
          "options": ["None", "Low", "Moderate", "High"]
        },
        {
          "id": "q3",
          "type": "boolean",
          "text": "Recent suicidal ideation?",
          "required": true
        },
        {
          "id": "q4",
          "type": "text",
          "text": "Risk factors identified",
          "required": false
        }
      ]'::jsonb,
      true
    );

    -- ========================================================================
    -- BIANNUAL FOLLOW-UP
    -- ========================================================================
    INSERT INTO visit_templates (pathology_id, visit_type, name, description, active)
    VALUES (
      pathology_rec.id,
      'biannual_followup',
      'Biannual Follow-up',
      'Six-month follow-up evaluation',
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
      CONCAT('BI_ASSESS_', UPPER(pathology_rec.type::text)),
      'Follow-up Clinical Assessment',
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
          "type": "text",
          "text": "Progress notes",
          "required": false
        }
      ]'::jsonb,
      true
    );

    -- ========================================================================
    -- ANNUAL EVALUATION
    -- ========================================================================
    INSERT INTO visit_templates (pathology_id, visit_type, name, description, active)
    VALUES (
      pathology_rec.id,
      'annual_evaluation',
      'Annual Evaluation',
      'Comprehensive annual review and assessment',
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
      CONCAT('ANN_REVIEW_', UPPER(pathology_rec.type::text)),
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
          "text": "Number of episodes in past year",
          "required": true,
          "min": 0
        },
        {
          "id": "q3",
          "type": "scale",
          "text": "Average medication adherence (%)",
          "required": true,
          "min": 0,
          "max": 100
        },
        {
          "id": "q4",
          "type": "text",
          "text": "Treatment plan updates",
          "required": false
        }
      ]'::jsonb,
      true
    );

    -- ========================================================================
    -- OFF-SCHEDULE VISIT
    -- ========================================================================
    INSERT INTO visit_templates (pathology_id, visit_type, name, description, active)
    VALUES (
      pathology_rec.id,
      'off_schedule',
      'Off-Schedule Visit',
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
      CONCAT('OFF_ASSESS_', UPPER(pathology_rec.type::text)),
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
          "text": "Urgency level",
          "required": true,
          "options": ["Routine", "Moderate", "Urgent", "Emergency"]
        },
        {
          "id": "q3",
          "type": "scale",
          "text": "Current mood state (0=worst, 10=best)",
          "required": true,
          "min": 0,
          "max": 10
        },
        {
          "id": "q4",
          "type": "text",
          "text": "Intervention provided",
          "required": false
        }
      ]'::jsonb,
      true
    );

  END LOOP;
END $$;

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Generic visit templates created successfully for all pathologies';
END $$;

