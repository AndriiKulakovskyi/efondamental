-- eFondaMental Platform - Seed Data
-- Initial data for development and testing

-- ============================================================================
-- PATHOLOGIES
-- ============================================================================

INSERT INTO pathologies (type, name, description, color) VALUES
  ('bipolar', 'Bipolar Disorder', 'Mood disorder characterized by episodes of mania and depression', '#F59E0B'),
  ('schizophrenia', 'Schizophrenia', 'Chronic mental disorder affecting perception and behavior', '#8B5CF6'),
  ('asd_asperger', 'Autism Spectrum Disorder - Asperger', 'Developmental disorder affecting social interaction', '#06B6D4'),
  ('depression', 'Depression', 'Mood disorder causing persistent sadness and loss of interest', '#3B82F6');

-- ============================================================================
-- PERMISSIONS
-- ============================================================================

-- Patient Management Permissions
INSERT INTO permissions (name, code, description, category) VALUES
  ('Create Patients', 'patient.create', 'Create new patient profiles', 'patient_management'),
  ('View Patients', 'patient.view', 'View patient information', 'patient_management'),
  ('Edit Patients', 'patient.edit', 'Edit patient profiles', 'patient_management'),
  ('Delete Patients', 'patient.delete', 'Delete patient profiles', 'patient_management'),
  ('Export Patient Data', 'patient.export', 'Export patient data for GDPR compliance', 'patient_management');

-- Clinical Permissions
INSERT INTO permissions (name, code, description, category) VALUES
  ('Create Visits', 'visit.create', 'Schedule and create patient visits', 'clinical'),
  ('View Visits', 'visit.view', 'View visit information', 'clinical'),
  ('Edit Visits', 'visit.edit', 'Edit visit details', 'clinical'),
  ('Complete Visits', 'visit.complete', 'Mark visits as completed', 'clinical'),
  ('Delete Visits', 'visit.delete', 'Delete visits', 'clinical');

-- Questionnaire Permissions
INSERT INTO permissions (name, code, description, category) VALUES
  ('Fill Questionnaires', 'questionnaire.fill', 'Complete clinical questionnaires', 'clinical'),
  ('View Questionnaire Responses', 'questionnaire.view_responses', 'View patient questionnaire responses', 'clinical'),
  ('Manage Questionnaires', 'questionnaire.manage', 'Create and edit questionnaire templates', 'clinical');

-- Evaluation Permissions
INSERT INTO permissions (name, code, description, category) VALUES
  ('Create Evaluations', 'evaluation.create', 'Create clinical evaluations', 'clinical'),
  ('View Evaluations', 'evaluation.view', 'View clinical evaluations', 'clinical'),
  ('Edit Evaluations', 'evaluation.edit', 'Edit clinical evaluations', 'clinical');

-- Statistics Permissions
INSERT INTO permissions (name, code, description, category) VALUES
  ('View Center Statistics', 'statistics.center', 'View center-level statistics and analytics', 'statistics'),
  ('View Personal Statistics', 'statistics.personal', 'View personal workload statistics', 'statistics'),
  ('Export Statistics', 'statistics.export', 'Export statistical reports', 'statistics');

-- User Management Permissions
INSERT INTO permissions (name, code, description, category) VALUES
  ('Create Users', 'user.create', 'Create new user accounts', 'user_management'),
  ('View Users', 'user.view', 'View user information', 'user_management'),
  ('Edit Users', 'user.edit', 'Edit user profiles', 'user_management'),
  ('Delete Users', 'user.delete', 'Delete user accounts', 'user_management'),
  ('Manage Permissions', 'user.manage_permissions', 'Grant and revoke user permissions', 'user_management'),
  ('Promote to Manager', 'user.promote_manager', 'Promote users to Manager role', 'user_management');

-- Center Management Permissions (Admin only)
INSERT INTO permissions (name, code, description, category) VALUES
  ('Create Centers', 'center.create', 'Create new Expert Centers', 'center_management'),
  ('View All Centers', 'center.view_all', 'View all centers in the platform', 'center_management'),
  ('Edit Centers', 'center.edit', 'Edit center information', 'center_management'),
  ('Delete Centers', 'center.delete', 'Delete centers', 'center_management'),
  ('Manage Center Pathologies', 'center.manage_pathologies', 'Assign pathologies to centers', 'center_management');

-- Audit & Security Permissions
INSERT INTO permissions (name, code, description, category) VALUES
  ('View Audit Logs', 'audit.view', 'View audit logs', 'audit_security'),
  ('View Center Audit Logs', 'audit.view_center', 'View audit logs for own center', 'audit_security'),
  ('Manage Data Retention', 'security.data_retention', 'Manage data retention policies', 'audit_security'),
  ('Access GDPR Tools', 'security.gdpr', 'Access GDPR compliance tools', 'audit_security');

-- Communication Permissions
INSERT INTO permissions (name, code, description, category) VALUES
  ('Send Messages', 'message.send', 'Send messages to patients and staff', 'communication'),
  ('View Messages', 'message.view', 'View messages', 'communication');

-- ============================================================================
-- SAMPLE CENTERS
-- ============================================================================

INSERT INTO centers (name, code, city, address, phone, email, active) VALUES
  (
    'Centre Expert FondaMental Paris',
    'CEF-PARIS',
    'Paris',
    'Hôpital Albert Chenevier, 40 Rue de Mesly, 94000 Créteil',
    '+33 1 49 81 30 00',
    'contact.paris@fondamental.fr',
    true
  ),
  (
    'Centre Expert FondaMental Lyon',
    'CEF-LYON',
    'Lyon',
    'Centre Hospitalier Le Vinatier, 95 Boulevard Pinel, 69500 Bron',
    '+33 4 37 91 51 00',
    'contact.lyon@fondamental.fr',
    true
  ),
  (
    'Centre Expert FondaMental Marseille',
    'CEF-MARSEILLE',
    'Marseille',
    'Hôpital Sainte-Marguerite, 270 Boulevard de Sainte-Marguerite, 13009 Marseille',
    '+33 4 91 74 40 00',
    'contact.marseille@fondamental.fr',
    true
  );

-- ============================================================================
-- ASSIGN PATHOLOGIES TO CENTERS
-- ============================================================================

-- Paris: All pathologies
INSERT INTO center_pathologies (center_id, pathology_id)
SELECT c.id, p.id
FROM centers c, pathologies p
WHERE c.code = 'CEF-PARIS';

-- Lyon: Bipolar and Schizophrenia
INSERT INTO center_pathologies (center_id, pathology_id)
SELECT c.id, p.id
FROM centers c, pathologies p
WHERE c.code = 'CEF-LYON'
AND p.type IN ('bipolar', 'schizophrenia');

-- Marseille: Depression and ASD
INSERT INTO center_pathologies (center_id, pathology_id)
SELECT c.id, p.id
FROM centers c, pathologies p
WHERE c.code = 'CEF-MARSEILLE'
AND p.type IN ('depression', 'asd_asperger');

-- ============================================================================
-- VISIT TEMPLATES FOR eBIPOLAR
-- ============================================================================

-- Get bipolar pathology id
DO $$
DECLARE
  v_bipolar_id UUID;
  v_template_screening UUID;
  v_template_initial UUID;
  v_template_biannual UUID;
  v_template_annual UUID;
  v_template_offschedule UUID;
BEGIN
  SELECT id INTO v_bipolar_id FROM pathologies WHERE type = 'bipolar';

  -- Screening Visit
  INSERT INTO visit_templates (pathology_id, visit_type, name, description, order_index)
  VALUES (v_bipolar_id, 'screening', 'Screening Visit', 'Initial screening to assess eligibility and baseline', 1)
  RETURNING id INTO v_template_screening;

  -- Initial Evaluation
  INSERT INTO visit_templates (pathology_id, visit_type, name, description, order_index)
  VALUES (v_bipolar_id, 'initial_evaluation', 'Initial Evaluation', 'Comprehensive baseline evaluation', 2)
  RETURNING id INTO v_template_initial;

  -- Biannual Follow-up
  INSERT INTO visit_templates (pathology_id, visit_type, name, description, order_index)
  VALUES (v_bipolar_id, 'biannual_followup', 'Biannual Follow-up', 'Follow-up visit every 6 months', 3)
  RETURNING id INTO v_template_biannual;

  -- Annual Evaluation
  INSERT INTO visit_templates (pathology_id, visit_type, name, description, order_index)
  VALUES (v_bipolar_id, 'annual_evaluation', 'Annual Evaluation', 'Comprehensive annual evaluation', 4)
  RETURNING id INTO v_template_annual;

  -- Off-Schedule Visit
  INSERT INTO visit_templates (pathology_id, visit_type, name, description, order_index)
  VALUES (v_bipolar_id, 'off_schedule', 'Off-Schedule Visit', 'Unscheduled visit for urgent concerns', 5)
  RETURNING id INTO v_template_offschedule;

  -- ============================================================================
  -- MODULES FOR SCREENING VISIT
  -- ============================================================================

  INSERT INTO modules (visit_template_id, name, description, order_index) VALUES
    (v_template_screening, 'Demographic Information', 'Patient demographic and contact information', 1),
    (v_template_screening, 'Medical History', 'Medical and psychiatric history', 2),
    (v_template_screening, 'Current Symptoms', 'Current symptom assessment', 3),
    (v_template_screening, 'Eligibility Assessment', 'Criteria for program inclusion', 4);

  -- ============================================================================
  -- MODULES FOR INITIAL EVALUATION
  -- ============================================================================

  INSERT INTO modules (visit_template_id, name, description, order_index) VALUES
    (v_template_initial, 'Clinical Interview', 'Comprehensive clinical interview', 1),
    (v_template_initial, 'Symptom Scales', 'Standardized symptom rating scales', 2),
    (v_template_initial, 'Functional Assessment', 'Assessment of functional capacity', 3),
    (v_template_initial, 'Cognitive Assessment', 'Neurocognitive evaluation', 4),
    (v_template_initial, 'Treatment Planning', 'Development of treatment plan', 5);

  -- ============================================================================
  -- MODULES FOR BIANNUAL FOLLOW-UP
  -- ============================================================================

  INSERT INTO modules (visit_template_id, name, description, order_index) VALUES
    (v_template_biannual, 'Symptom Monitoring', 'Monitor mood and symptom changes', 1),
    (v_template_biannual, 'Medication Review', 'Review current medications and adherence', 2),
    (v_template_biannual, 'Functional Status', 'Assess current functional level', 3),
    (v_template_biannual, 'Risk Assessment', 'Assess relapse and suicide risk', 4);

  -- ============================================================================
  -- MODULES FOR ANNUAL EVALUATION
  -- ============================================================================

  INSERT INTO modules (visit_template_id, name, description, order_index) VALUES
    (v_template_annual, 'Comprehensive Clinical Review', 'Full clinical status review', 1),
    (v_template_annual, 'Standardized Assessments', 'Complete battery of standardized scales', 2),
    (v_template_annual, 'Cognitive Re-assessment', 'Longitudinal cognitive evaluation', 3),
    (v_template_annual, 'Quality of Life', 'Quality of life assessment', 4),
    (v_template_annual, 'Treatment Adjustment', 'Review and adjust treatment plan', 5);

END $$;

-- ============================================================================
-- SAMPLE QUESTIONNAIRES (Structure Only - Placeholder)
-- ============================================================================

DO $$
DECLARE
  v_module_id UUID;
BEGIN
  -- Get a sample module for demonstration
  SELECT id INTO v_module_id FROM modules LIMIT 1;

  -- Sample questionnaire: Demographic Information
  INSERT INTO questionnaires (
    module_id,
    code,
    title,
    description,
    target_role,
    questions,
    active
  ) VALUES (
    v_module_id,
    'DEMO_INFO',
    'Demographic Information',
    'Basic demographic and contact information',
    'healthcare_professional',
    '[
      {
        "id": "q1",
        "type": "text",
        "text": "What is the patient full name?",
        "required": true
      },
      {
        "id": "q2",
        "type": "date",
        "text": "Date of birth",
        "required": true
      },
      {
        "id": "q3",
        "type": "single_choice",
        "text": "Gender",
        "options": ["Male", "Female", "Other", "Prefer not to say"],
        "required": true
      },
      {
        "id": "q4",
        "type": "text",
        "text": "Contact phone number",
        "required": false
      }
    ]'::jsonb,
    true
  );

  -- Sample questionnaire: Patient Mood Self-Assessment
  INSERT INTO questionnaires (
    code,
    title,
    description,
    target_role,
    questions,
    conditional_logic,
    active
  ) VALUES (
    'MOOD_SELF',
    'Mood Self-Assessment',
    'Patient self-reported mood assessment',
    'patient',
    '[
      {
        "id": "m1",
        "type": "scale",
        "text": "How would you rate your overall mood today?",
        "min": 1,
        "max": 10,
        "minLabel": "Very depressed",
        "maxLabel": "Very elevated",
        "required": true
      },
      {
        "id": "m2",
        "type": "scale",
        "text": "How many hours did you sleep last night?",
        "min": 0,
        "max": 12,
        "required": true
      },
      {
        "id": "m3",
        "type": "single_choice",
        "text": "Have you experienced racing thoughts?",
        "options": ["Not at all", "Occasionally", "Frequently", "Constantly"],
        "required": true
      },
      {
        "id": "m4",
        "type": "boolean",
        "text": "Have you had any thoughts of self-harm in the past week?",
        "required": true
      }
    ]'::jsonb,
    '{
      "rules": [
        {
          "condition": {"questionId": "m4", "operator": "equals", "value": true},
          "action": {"type": "show_subquestionnaire", "questionnaire": "SUICIDE_RISK"}
        }
      ]
    }'::jsonb,
    true
  );

END $$;

-- ============================================================================
-- INITIAL USERS (REQUIRES MANUAL SETUP)
-- ============================================================================

-- IMPORTANT: Users must be created in Supabase Auth first, then profiles can be added.
-- 
-- Step 1: Create users in Supabase Dashboard (Authentication > Users > Add User)
-- Step 2: Copy the generated UUID for each user
-- Step 3: Run the INSERT statements below with the actual UUIDs
--
-- Alternatively, use the Supabase Admin API or the platform's invitation system.

-- ============================================================================
-- OPTION A: Create users manually in Supabase Auth, then run these:
-- ============================================================================

-- Example: Create admin user profile
-- After creating auth user with email 'admin@fondamental.fr', replace UUID below:
-- 
-- INSERT INTO user_profiles (id, role, first_name, last_name, email, username, active)
-- VALUES (
--   'REPLACE_WITH_ACTUAL_AUTH_USER_UUID',
--   'administrator',
--   'System',
--   'Administrator',
--   'admin@fondamental.fr',
--   'admin',
--   true
-- );

-- Example: Create manager for Paris center
-- After creating auth user with email 'manager.paris@fondamental.fr', replace UUID below:
--
-- INSERT INTO user_profiles (id, role, center_id, first_name, last_name, email, username, active)
-- SELECT 
--   'REPLACE_WITH_ACTUAL_AUTH_USER_UUID',
--   'manager',
--   c.id,
--   'Jean',
--   'Dupont',
--   'manager.paris@fondamental.fr',
--   'manager.paris',
--   true
-- FROM centers c WHERE c.code = 'CEF-PARIS';

-- Example: Create manager for Lyon center
--
-- INSERT INTO user_profiles (id, role, center_id, first_name, last_name, email, username, active)
-- SELECT 
--   'REPLACE_WITH_ACTUAL_AUTH_USER_UUID',
--   'manager',
--   c.id,
--   'Marie',
--   'Martin',
--   'manager.lyon@fondamental.fr',
--   'manager.lyon',
--   true
-- FROM centers c WHERE c.code = 'CEF-LYON';

-- Example: Create manager for Marseille center
--
-- INSERT INTO user_profiles (id, role, center_id, first_name, last_name, email, username, active)
-- SELECT 
--   'REPLACE_WITH_ACTUAL_AUTH_USER_UUID',
--   'manager',
--   c.id,
--   'Pierre',
--   'Bernard',
--   'manager.marseille@fondamental.fr',
--   'manager.marseille',
--   true
-- FROM centers c WHERE c.code = 'CEF-MARSEILLE';

-- ============================================================================
-- NOTES
-- ============================================================================

-- This seed file provides:
-- 1. Four pathologies (Bipolar, Schizophrenia, ASD-Asperger, Depression)
-- 2. Comprehensive permission set for RBAC (35+ permissions)
-- 3. Three sample centers with different pathology assignments
-- 4. Complete visit template structure for Bipolar disorder (5 visit types, 17 modules)
-- 5. Sample questionnaires demonstrating structure and conditional logic

-- To complete initial setup:
-- 
-- STEP 1: Create Auth Users in Supabase Dashboard
-- Go to: Authentication > Users > Add User
-- Create users with these emails:
--   - admin@fondamental.fr (for admin)
--   - manager.paris@fondamental.fr (for Paris manager)
--   - manager.lyon@fondamental.fr (for Lyon manager)
--   - manager.marseille@fondamental.fr (for Marseille manager)
--
-- STEP 2: Create User Profiles
-- Copy the UUIDs from step 1 and run the INSERT statements above (uncomment and replace UUIDs)
--
-- STEP 3: Login and Use the Platform
-- - Login at /auth/login with the admin credentials
-- - Admin can create additional managers via invitation system
-- - Managers can invite healthcare professionals
-- - Professionals can create patients
--
-- OR: Use the built-in invitation system
-- - Login as admin
-- - Go to admin dashboard
-- - Invite managers for each center
-- - They will receive invitation emails with secure tokens

