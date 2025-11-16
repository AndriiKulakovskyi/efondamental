-- ============================================================================
-- eFondaMental Platform - Complete Database Initialization
-- ============================================================================
-- This script creates a fresh database from scratch including:
-- - Database schema (tables, enums, indexes)
-- - Row Level Security policies
-- - Seed data (pathologies, permissions, centers)
-- - Initial users (admin and center managers)
-- - Sample healthcare professionals
-- ============================================================================
--
-- PREREQUISITES:
-- Before running this script, create these Auth users in Supabase Dashboard:
-- (Authentication > Users > Add User with Auto Confirm enabled)
--
--   1. admin@fondamental.fr          (password: Password123!)
--   2. manager.paris@fondamental.fr  (password: Password123!)
--   3. manager.lyon@fondamental.fr   (password: Password123!)
--   4. doctor.paris@fondamental.fr   (password: Password123!)
--   5. doctor.lyon@fondamental.fr    (password: Password123!)
--
-- After creating auth users, run this entire script in Supabase SQL Editor
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE user_role AS ENUM (
  'administrator',
  'manager',
  'healthcare_professional',
  'patient'
);

CREATE TYPE pathology_type AS ENUM (
  'bipolar',
  'schizophrenia',
  'asd_asperger',
  'depression'
);

CREATE TYPE visit_type AS ENUM (
  'screening',
  'initial_evaluation',
  'biannual_followup',
  'annual_evaluation',
  'off_schedule'
);

CREATE TYPE question_type AS ENUM (
  'text',
  'number',
  'single_choice',
  'multiple_choice',
  'scale',
  'date',
  'boolean'
);

CREATE TYPE invitation_status AS ENUM (
  'pending',
  'accepted',
  'expired'
);

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Centers (Expert Centers)
CREATE TABLE centers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  city VARCHAR(100),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(255),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_centers_active ON centers(active);
CREATE INDEX idx_centers_code ON centers(code);

-- Pathologies
CREATE TABLE pathologies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type pathology_type UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  color VARCHAR(7), -- Hex color for UI
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Center-Pathology relationship (Many-to-Many)
CREATE TABLE center_pathologies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  center_id UUID NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  pathology_id UUID NOT NULL REFERENCES pathologies(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(center_id, pathology_id)
);

CREATE INDEX idx_center_pathologies_center ON center_pathologies(center_id);
CREATE INDEX idx_center_pathologies_pathology ON center_pathologies(pathology_id);

-- Permissions
CREATE TABLE permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) UNIQUE NOT NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  category VARCHAR(50), -- e.g., 'patient_management', 'statistics', 'admin'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_permissions_code ON permissions(code);
CREATE INDEX idx_permissions_category ON permissions(category);

-- Extended User Profiles
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL,
  center_id UUID REFERENCES centers(id) ON DELETE SET NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  username VARCHAR(50) UNIQUE,
  active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

CREATE INDEX idx_user_profiles_role ON user_profiles(role);
CREATE INDEX idx_user_profiles_center ON user_profiles(center_id);
CREATE INDEX idx_user_profiles_username ON user_profiles(username);
CREATE INDEX idx_user_profiles_active ON user_profiles(active);
CREATE INDEX idx_user_profiles_email ON user_profiles(email);

-- User-specific permissions
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, permission_id)
);

CREATE INDEX idx_user_permissions_user ON user_permissions(user_id);
CREATE INDEX idx_user_permissions_permission ON user_permissions(permission_id);

-- User Invitations
CREATE TABLE user_invitations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL,
  role user_role NOT NULL,
  center_id UUID REFERENCES centers(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  status invitation_status DEFAULT 'pending',
  invited_by UUID NOT NULL REFERENCES auth.users(id),
  accepted_by UUID REFERENCES auth.users(id),
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_invitations_token ON user_invitations(token);
CREATE INDEX idx_invitations_email ON user_invitations(email);
CREATE INDEX idx_invitations_status ON user_invitations(status);

-- ============================================================================
-- CLINICAL TABLES
-- ============================================================================

-- Patients
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  center_id UUID NOT NULL REFERENCES centers(id) ON DELETE CASCADE,
  pathology_id UUID NOT NULL REFERENCES pathologies(id),
  medical_record_number VARCHAR(50) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20),
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  emergency_contact JSONB, -- {name, phone, relationship}
  metadata JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_patients_center ON patients(center_id);
CREATE INDEX idx_patients_pathology ON patients(pathology_id);
CREATE INDEX idx_patients_mrn ON patients(medical_record_number);
CREATE INDEX idx_patients_active ON patients(active);
CREATE INDEX idx_patients_created_by ON patients(created_by);

-- Visit Templates (per pathology)
CREATE TABLE visit_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pathology_id UUID NOT NULL REFERENCES pathologies(id) ON DELETE CASCADE,
  visit_type visit_type NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(pathology_id, visit_type)
);

CREATE INDEX idx_visit_templates_pathology ON visit_templates(pathology_id);
CREATE INDEX idx_visit_templates_type ON visit_templates(visit_type);

-- Modules (clinical modules within visits)
CREATE TABLE modules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_template_id UUID NOT NULL REFERENCES visit_templates(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INTEGER DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_modules_visit_template ON modules(visit_template_id);
CREATE INDEX idx_modules_order ON modules(order_index);

-- Questionnaires
CREATE TABLE questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id UUID REFERENCES modules(id) ON DELETE SET NULL,
  code VARCHAR(50) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  target_role user_role, -- Who should fill it: nurse, clinician, patient
  questions JSONB NOT NULL, -- Array of question objects
  conditional_logic JSONB, -- Branching logic
  metadata JSONB DEFAULT '{}'::jsonb,
  version INTEGER DEFAULT 1,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questionnaires_module ON questionnaires(module_id);
CREATE INDEX idx_questionnaires_code ON questionnaires(code);
CREATE INDEX idx_questionnaires_target_role ON questionnaires(target_role);

-- Visits (actual patient visits)
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  visit_template_id UUID NOT NULL REFERENCES visit_templates(id),
  visit_type visit_type NOT NULL,
  scheduled_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
  notes TEXT,
  conducted_by UUID REFERENCES auth.users(id),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_visits_patient ON visits(patient_id);
CREATE INDEX idx_visits_template ON visits(visit_template_id);
CREATE INDEX idx_visits_scheduled_date ON visits(scheduled_date);
CREATE INDEX idx_visits_status ON visits(status);
CREATE INDEX idx_visits_conducted_by ON visits(conducted_by);

-- Questionnaire Responses
CREATE TABLE questionnaire_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visit_id UUID NOT NULL REFERENCES visits(id) ON DELETE CASCADE,
  questionnaire_id UUID NOT NULL REFERENCES questionnaires(id),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  responses JSONB NOT NULL, -- Question answers
  completed_by UUID REFERENCES auth.users(id),
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status VARCHAR(50) DEFAULT 'in_progress', -- in_progress, completed
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_questionnaire_responses_visit ON questionnaire_responses(visit_id);
CREATE INDEX idx_questionnaire_responses_questionnaire ON questionnaire_responses(questionnaire_id);
CREATE INDEX idx_questionnaire_responses_patient ON questionnaire_responses(patient_id);
CREATE INDEX idx_questionnaire_responses_status ON questionnaire_responses(status);

-- Clinical Evaluations
CREATE TABLE evaluations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  visit_id UUID REFERENCES visits(id) ON DELETE SET NULL,
  evaluator_id UUID NOT NULL REFERENCES auth.users(id),
  evaluation_date TIMESTAMPTZ DEFAULT NOW(),
  diagnosis TEXT,
  clinical_notes TEXT,
  risk_assessment JSONB, -- {suicide_risk, relapse_risk, etc.}
  treatment_plan TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_evaluations_patient ON evaluations(patient_id);
CREATE INDEX idx_evaluations_visit ON evaluations(visit_id);
CREATE INDEX idx_evaluations_evaluator ON evaluations(evaluator_id);
CREATE INDEX idx_evaluations_date ON evaluations(evaluation_date);

-- Recent Patient Accesses (for "recently consulted" feature)
CREATE TABLE recent_accesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, patient_id)
);

CREATE INDEX idx_recent_accesses_user ON recent_accesses(user_id);
CREATE INDEX idx_recent_accesses_patient ON recent_accesses(patient_id);
CREATE INDEX idx_recent_accesses_timestamp ON recent_accesses(accessed_at DESC);

-- Messages (secure communication)
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id),
  recipient_id UUID REFERENCES auth.users(id),
  subject VARCHAR(255),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  parent_message_id UUID REFERENCES messages(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_patient ON messages(patient_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_read ON messages(read);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- ============================================================================
-- AUDIT & SECURITY TABLES
-- ============================================================================

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL, -- create, update, delete, view, login, etc.
  entity_type VARCHAR(100), -- table name
  entity_id UUID,
  center_id UUID REFERENCES centers(id),
  ip_address INET,
  user_agent TEXT,
  changes JSONB, -- Before/after values for updates
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_center ON audit_logs(center_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Login History
CREATE TABLE login_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  success BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  method VARCHAR(50), -- password, magic_link
  failure_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_login_history_user ON login_history(user_id);
CREATE INDEX idx_login_history_success ON login_history(success);
CREATE INDEX idx_login_history_created_at ON login_history(created_at DESC);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all relevant tables
CREATE TRIGGER update_centers_updated_at BEFORE UPDATE ON centers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visit_templates_updated_at BEFORE UPDATE ON visit_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_modules_updated_at BEFORE UPDATE ON modules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questionnaires_updated_at BEFORE UPDATE ON questionnaires
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evaluations_updated_at BEFORE UPDATE ON evaluations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invitations_updated_at BEFORE UPDATE ON user_invitations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questionnaire_responses_updated_at BEFORE UPDATE ON questionnaire_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES (Simplified - No Recursion)
-- ============================================================================

-- Enable RLS on all clinical tables
ALTER TABLE centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- User Profiles: Simplified policies without recursion
CREATE POLICY user_profiles_select_own ON user_profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY user_profiles_update_own ON user_profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

CREATE POLICY user_profiles_insert ON user_profiles
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY user_profiles_delete ON user_profiles
  FOR DELETE TO authenticated
  USING (false);

-- Centers: Users can see all centers (authorization in app layer)
CREATE POLICY centers_select_all ON centers
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY centers_insert ON centers
  FOR INSERT TO authenticated
  WITH CHECK (true);

CREATE POLICY centers_update ON centers
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY centers_delete ON centers
  FOR DELETE TO authenticated
  USING (true);

-- Patients: Strict center isolation
CREATE POLICY patients_center_isolation ON patients
  FOR ALL TO authenticated
  USING (
    center_id IN (
      SELECT center_id FROM user_profiles
      WHERE id = auth.uid()
    )
  );

-- Visits: Inherit from patients
CREATE POLICY visits_center_isolation ON visits
  FOR ALL TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients
      WHERE center_id IN (
        SELECT center_id FROM user_profiles
        WHERE id = auth.uid()
      )
    )
  );

-- Questionnaire Responses: Inherit from patients
CREATE POLICY questionnaire_responses_center_isolation ON questionnaire_responses
  FOR ALL TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients
      WHERE center_id IN (
        SELECT center_id FROM user_profiles
        WHERE id = auth.uid()
      )
    )
  );

-- Evaluations: Inherit from patients
CREATE POLICY evaluations_center_isolation ON evaluations
  FOR ALL TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients
      WHERE center_id IN (
        SELECT center_id FROM user_profiles
        WHERE id = auth.uid()
      )
    )
  );

-- Messages: Users see messages for their patients
CREATE POLICY messages_center_isolation ON messages
  FOR ALL TO authenticated
  USING (
    patient_id IN (
      SELECT id FROM patients
      WHERE center_id IN (
        SELECT center_id FROM user_profiles
        WHERE id = auth.uid()
      )
    )
    OR sender_id = auth.uid()
    OR recipient_id = auth.uid()
  );

-- Audit Logs: Users see their center's logs
CREATE POLICY audit_logs_center_view ON audit_logs
  FOR SELECT TO authenticated
  USING (
    center_id IN (
      SELECT center_id FROM user_profiles
      WHERE id = auth.uid()
    )
    OR user_id = auth.uid()
  );

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Full user information with center and role
CREATE VIEW v_users_full AS
SELECT
  up.id,
  up.role,
  up.first_name,
  up.last_name,
  up.email,
  up.phone,
  up.username,
  up.active,
  up.created_at,
  c.id AS center_id,
  c.name AS center_name,
  c.code AS center_code,
  ARRAY_AGG(DISTINCT p.type) FILTER (WHERE p.type IS NOT NULL) AS center_pathologies
FROM user_profiles up
LEFT JOIN centers c ON up.center_id = c.id
LEFT JOIN center_pathologies cp ON c.id = cp.center_id
LEFT JOIN pathologies p ON cp.pathology_id = p.id
GROUP BY up.id, c.id, c.name, c.code;

-- View: Patient with pathology and center information
CREATE VIEW v_patients_full AS
SELECT
  p.*,
  c.name AS center_name,
  c.code AS center_code,
  path.name AS pathology_name,
  path.type AS pathology_type,
  path.color AS pathology_color,
  up.first_name AS created_by_first_name,
  up.last_name AS created_by_last_name
FROM patients p
JOIN centers c ON p.center_id = c.id
JOIN pathologies path ON p.pathology_id = path.id
LEFT JOIN user_profiles up ON p.created_by = up.id;

-- View: Visits with patient and template information
CREATE VIEW v_visits_full AS
SELECT
  v.*,
  p.first_name AS patient_first_name,
  p.last_name AS patient_last_name,
  p.medical_record_number,
  vt.name AS template_name,
  vt.pathology_id,
  path.name AS pathology_name,
  up.first_name AS conducted_by_first_name,
  up.last_name AS conducted_by_last_name
FROM visits v
JOIN patients p ON v.patient_id = p.id
JOIN visit_templates vt ON v.visit_template_id = vt.id
JOIN pathologies path ON vt.pathology_id = path.id
LEFT JOIN user_profiles up ON v.conducted_by = up.id;

-- ============================================================================
-- SEED DATA - PATHOLOGIES
-- ============================================================================

INSERT INTO pathologies (type, name, description, color) VALUES
  ('bipolar', 'Bipolar Disorder', 'Mood disorder characterized by episodes of mania and depression', '#F59E0B'),
  ('schizophrenia', 'Schizophrenia', 'Chronic mental disorder affecting perception and behavior', '#8B5CF6'),
  ('asd_asperger', 'Autism Spectrum Disorder - Asperger', 'Developmental disorder affecting social interaction', '#06B6D4'),
  ('depression', 'Depression', 'Mood disorder causing persistent sadness and loss of interest', '#3B82F6');

-- ============================================================================
-- SEED DATA - PERMISSIONS
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

-- Center Management Permissions
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
-- SEED DATA - CENTERS
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
-- SEED DATA - CENTER PATHOLOGIES
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
-- SEED DATA - VISIT TEMPLATES FOR BIPOLAR
-- ============================================================================

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

  -- Modules for Screening Visit
  INSERT INTO modules (visit_template_id, name, description, order_index) VALUES
    (v_template_screening, 'Demographic Information', 'Patient demographic and contact information', 1),
    (v_template_screening, 'Medical History', 'Medical and psychiatric history', 2),
    (v_template_screening, 'Current Symptoms', 'Current symptom assessment', 3),
    (v_template_screening, 'Eligibility Assessment', 'Criteria for program inclusion', 4);

  -- Modules for Initial Evaluation
  INSERT INTO modules (visit_template_id, name, description, order_index) VALUES
    (v_template_initial, 'Clinical Interview', 'Comprehensive clinical interview', 1),
    (v_template_initial, 'Symptom Scales', 'Standardized symptom rating scales', 2),
    (v_template_initial, 'Functional Assessment', 'Assessment of functional capacity', 3),
    (v_template_initial, 'Cognitive Assessment', 'Neurocognitive evaluation', 4),
    (v_template_initial, 'Treatment Planning', 'Development of treatment plan', 5);

  -- Modules for Biannual Follow-up
  INSERT INTO modules (visit_template_id, name, description, order_index) VALUES
    (v_template_biannual, 'Symptom Monitoring', 'Monitor mood and symptom changes', 1),
    (v_template_biannual, 'Medication Review', 'Review current medications and adherence', 2),
    (v_template_biannual, 'Functional Status', 'Assess current functional level', 3),
    (v_template_biannual, 'Risk Assessment', 'Assess relapse and suicide risk', 4);

  -- Modules for Annual Evaluation
  INSERT INTO modules (visit_template_id, name, description, order_index) VALUES
    (v_template_annual, 'Comprehensive Clinical Review', 'Full clinical status review', 1),
    (v_template_annual, 'Standardized Assessments', 'Complete battery of standardized scales', 2),
    (v_template_annual, 'Cognitive Re-assessment', 'Longitudinal cognitive evaluation', 3),
    (v_template_annual, 'Quality of Life', 'Quality of life assessment', 4),
    (v_template_annual, 'Treatment Adjustment', 'Review and adjust treatment plan', 5);

END $$;

-- ============================================================================
-- SEED DATA - SAMPLE QUESTIONNAIRES
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
-- INITIAL USERS - Create Profiles for Auth Users
-- ============================================================================

DO $$
DECLARE
  v_admin_id UUID;
  v_paris_manager_id UUID;
  v_lyon_manager_id UUID;
  v_paris_doctor_id UUID;
  v_lyon_doctor_id UUID;
  v_paris_center_id UUID;
  v_lyon_center_id UUID;
BEGIN
  -- Get center IDs
  SELECT id INTO v_paris_center_id FROM centers WHERE code = 'CEF-PARIS';
  SELECT id INTO v_lyon_center_id FROM centers WHERE code = 'CEF-LYON';
  
  -- Lookup Auth User UUIDs
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@fondamental.fr';
  SELECT id INTO v_paris_manager_id FROM auth.users WHERE email = 'manager.paris@fondamental.fr';
  SELECT id INTO v_lyon_manager_id FROM auth.users WHERE email = 'manager.lyon@fondamental.fr';
  SELECT id INTO v_paris_doctor_id FROM auth.users WHERE email = 'doctor.paris@fondamental.fr';
  SELECT id INTO v_lyon_doctor_id FROM auth.users WHERE email = 'doctor.lyon@fondamental.fr';

  -- Create Admin Profile (if auth user exists)
  IF v_admin_id IS NOT NULL THEN
    INSERT INTO user_profiles (id, role, first_name, last_name, email, username, active)
    VALUES (
      v_admin_id,
      'administrator',
      'System',
      'Administrator',
      'admin@fondamental.fr',
      'admin',
      true
    )
    ON CONFLICT (id) DO NOTHING;
    RAISE NOTICE 'Created admin profile for: admin@fondamental.fr';
  ELSE
    RAISE NOTICE 'WARNING: Auth user admin@fondamental.fr not found. Create it in Supabase Auth first.';
  END IF;

  -- Create Paris Manager Profile
  IF v_paris_manager_id IS NOT NULL THEN
    INSERT INTO user_profiles (id, role, center_id, first_name, last_name, email, username, active)
    VALUES (
      v_paris_manager_id,
      'manager',
      v_paris_center_id,
      'Jean',
      'Dupont',
      'manager.paris@fondamental.fr',
      'manager.paris',
      true
    )
    ON CONFLICT (id) DO NOTHING;
    RAISE NOTICE 'Created Paris manager profile for: manager.paris@fondamental.fr';
  ELSE
    RAISE NOTICE 'WARNING: Auth user manager.paris@fondamental.fr not found. Create it in Supabase Auth first.';
  END IF;

  -- Create Lyon Manager Profile
  IF v_lyon_manager_id IS NOT NULL THEN
    INSERT INTO user_profiles (id, role, center_id, first_name, last_name, email, username, active)
    VALUES (
      v_lyon_manager_id,
      'manager',
      v_lyon_center_id,
      'Marie',
      'Martin',
      'manager.lyon@fondamental.fr',
      'manager.lyon',
      true
    )
    ON CONFLICT (id) DO NOTHING;
    RAISE NOTICE 'Created Lyon manager profile for: manager.lyon@fondamental.fr';
  ELSE
    RAISE NOTICE 'WARNING: Auth user manager.lyon@fondamental.fr not found. Create it in Supabase Auth first.';
  END IF;

  -- Create Paris Doctor Profile
  IF v_paris_doctor_id IS NOT NULL THEN
    INSERT INTO user_profiles (id, role, center_id, first_name, last_name, email, username, active, created_by)
    VALUES (
      v_paris_doctor_id,
      'healthcare_professional',
      v_paris_center_id,
      'Dr. Sophie',
      'Laurent',
      'doctor.paris@fondamental.fr',
      'doctor.paris',
      true,
      v_paris_manager_id
    )
    ON CONFLICT (id) DO NOTHING;
    RAISE NOTICE 'Created Paris doctor profile for: doctor.paris@fondamental.fr';
  ELSE
    RAISE NOTICE 'WARNING: Auth user doctor.paris@fondamental.fr not found. Create it in Supabase Auth first.';
  END IF;

  -- Create Lyon Doctor Profile
  IF v_lyon_doctor_id IS NOT NULL THEN
    INSERT INTO user_profiles (id, role, center_id, first_name, last_name, email, username, active, created_by)
    VALUES (
      v_lyon_doctor_id,
      'healthcare_professional',
      v_lyon_center_id,
      'Dr. Pierre',
      'Dubois',
      'doctor.lyon@fondamental.fr',
      'doctor.lyon',
      true,
      v_lyon_manager_id
    )
    ON CONFLICT (id) DO NOTHING;
    RAISE NOTICE 'Created Lyon doctor profile for: doctor.lyon@fondamental.fr';
  ELSE
    RAISE NOTICE 'WARNING: Auth user doctor.lyon@fondamental.fr not found. Create it in Supabase Auth first.';
  END IF;

  RAISE NOTICE '
  ============================================================
  DATABASE INITIALIZATION COMPLETE
  ============================================================
  
  Created:
  - 4 Pathologies (Bipolar, Schizophrenia, ASD-Asperger, Depression)
  - 35+ Permissions for RBAC
  - 3 Expert Centers (Paris, Lyon, Marseille)
  - Visit templates and modules for Bipolar disorder
  - Sample questionnaires
  - User profiles (for auth users that exist)
  
  Next Steps:
  1. Create Auth users in Supabase Dashboard if not already done:
     - admin@fondamental.fr
     - manager.paris@fondamental.fr
     - manager.lyon@fondamental.fr
     - doctor.paris@fondamental.fr
     - doctor.lyon@fondamental.fr
  
  2. If you created them after running this script, run:
     SELECT * FROM user_profiles; -- to check who is missing
     Then rerun just the user creation section
  
  3. Login credentials (use password you set in Supabase Auth):
     - Admin: admin@fondamental.fr
     - Paris Manager: manager.paris@fondamental.fr
     - Lyon Manager: manager.lyon@fondamental.fr
     - Paris Doctor: doctor.paris@fondamental.fr
     - Lyon Doctor: doctor.lyon@fondamental.fr
  
  ============================================================
  ';

END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify centers
SELECT 
  'CENTERS' as entity,
  code,
  name,
  city
FROM centers
ORDER BY code;

-- Verify pathologies
SELECT 
  'PATHOLOGIES' as entity,
  type,
  name,
  color
FROM pathologies
ORDER BY type;

-- Verify user profiles
SELECT 
  'USER PROFILES' as entity,
  up.email,
  up.username,
  up.role,
  c.name as center_name,
  up.active
FROM user_profiles up
LEFT JOIN centers c ON up.center_id = c.id
ORDER BY 
  CASE up.role
    WHEN 'administrator' THEN 1
    WHEN 'manager' THEN 2
    WHEN 'healthcare_professional' THEN 3
    WHEN 'patient' THEN 4
  END,
  up.email;

-- Verify permissions
SELECT 
  'PERMISSIONS' as entity,
  category,
  COUNT(*) as permission_count
FROM permissions
GROUP BY category
ORDER BY category;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE centers IS 'Expert Centers managing patient care';
COMMENT ON TABLE user_profiles IS 'Extended user profiles with roles and center assignments';
COMMENT ON TABLE patients IS 'Patient profiles linked to centers and pathologies';
COMMENT ON TABLE visits IS 'Clinical visits for longitudinal patient follow-up';
COMMENT ON TABLE questionnaires IS 'Clinical questionnaire definitions with conditional logic';
COMMENT ON TABLE questionnaire_responses IS 'Patient responses to questionnaires';
COMMENT ON TABLE audit_logs IS 'Complete audit trail for compliance and security';
COMMENT ON COLUMN patients.center_id IS 'Center isolation - enforced by RLS';
COMMENT ON COLUMN user_profiles.role IS 'User role in the system hierarchy';
COMMENT ON COLUMN questionnaires.questions IS 'JSON array of question objects with type, text, options';
COMMENT ON COLUMN questionnaires.conditional_logic IS 'JSON rules for question branching based on responses';

