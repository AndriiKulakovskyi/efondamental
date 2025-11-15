-- eFondaMental Platform - Initial Database Schema
-- Multi-center psychiatric clinical management platform

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

-- Function to update recent_accesses
CREATE OR REPLACE FUNCTION update_recent_access()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO recent_accesses (user_id, patient_id, accessed_at)
  VALUES (NEW.user_id, NEW.patient_id, NOW())
  ON CONFLICT (user_id, patient_id)
  DO UPDATE SET accessed_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
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

-- Centers: Admin sees all, others see only their center
CREATE POLICY centers_admin_all ON centers
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'administrator'
    )
  );

CREATE POLICY centers_user_own ON centers
  FOR SELECT TO authenticated
  USING (
    id IN (
      SELECT center_id FROM user_profiles
      WHERE user_profiles.id = auth.uid()
    )
  );

-- User Profiles: Users see profiles in their center (or all if admin)
CREATE POLICY user_profiles_admin_all ON user_profiles
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid()
      AND up.role = 'administrator'
    )
  );

CREATE POLICY user_profiles_center_view ON user_profiles
  FOR SELECT TO authenticated
  USING (
    center_id IN (
      SELECT center_id FROM user_profiles
      WHERE id = auth.uid()
    )
    OR id = auth.uid()
  );

CREATE POLICY user_profiles_manager_modify ON user_profiles
  FOR ALL TO authenticated
  USING (
    center_id IN (
      SELECT center_id FROM user_profiles
      WHERE id = auth.uid()
      AND role IN ('manager', 'administrator')
    )
  );

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

-- Audit Logs: Admin sees all, others see their center
CREATE POLICY audit_logs_admin_all ON audit_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.role = 'administrator'
    )
  );

CREATE POLICY audit_logs_center_view ON audit_logs
  FOR SELECT TO authenticated
  USING (
    center_id IN (
      SELECT center_id FROM user_profiles
      WHERE id = auth.uid()
    )
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

