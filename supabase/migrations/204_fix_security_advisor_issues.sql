-- Migration: Fix Security Advisor Issues
-- Fixes: SECURITY DEFINER views and tables without RLS
-- Date: 2026-01-09

-- ============================================================================
-- PART 1: FIX VIEWS WITH SECURITY INVOKER
-- ============================================================================
-- These views were flagged as SECURITY DEFINER which bypasses RLS.
-- Recreating them with security_invoker = true ensures they respect
-- the calling user's RLS policies.

-- 1.1 Recreate v_users_full with security_invoker
DROP VIEW IF EXISTS v_users_full;
CREATE VIEW v_users_full WITH (security_invoker = true) AS
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
  array_agg(DISTINCT p.type) FILTER (WHERE p.type IS NOT NULL) AS center_pathologies
FROM user_profiles up
LEFT JOIN centers c ON up.center_id = c.id
LEFT JOIN center_pathologies cp ON c.id = cp.center_id
LEFT JOIN pathologies p ON cp.pathology_id = p.id
GROUP BY up.id, c.id, c.name, c.code;

-- 1.2 Recreate v_patients_full with security_invoker
DROP VIEW IF EXISTS v_patients_full;
CREATE VIEW v_patients_full WITH (security_invoker = true) AS
SELECT 
  p.id,
  p.center_id,
  p.pathology_id,
  p.medical_record_number,
  p.first_name,
  p.last_name,
  p.date_of_birth,
  p.gender,
  p.email,
  p.phone,
  p.address,
  p.emergency_contact,
  p.metadata,
  p.active,
  p.created_by,
  p.created_at,
  p.updated_at,
  p.user_id,
  p.deleted_at,
  p.deleted_by,
  p.assigned_to,
  p.place_of_birth,
  p.years_of_education,
  c.name AS center_name,
  c.code AS center_code,
  path.type AS pathology_type,
  path.name AS pathology_name,
  path.color AS pathology_color,
  up_created.first_name AS created_by_first_name,
  up_created.last_name AS created_by_last_name,
  up_assigned.first_name AS assigned_to_first_name,
  up_assigned.last_name AS assigned_to_last_name,
  up.email AS professional_email,
  up.first_name AS professional_first_name,
  up.last_name AS professional_last_name
FROM patients p
LEFT JOIN centers c ON p.center_id = c.id
LEFT JOIN pathologies path ON p.pathology_id = path.id
LEFT JOIN user_profiles up ON p.assigned_to = up.id
LEFT JOIN user_profiles up_created ON p.created_by = up_created.id
LEFT JOIN user_profiles up_assigned ON p.assigned_to = up_assigned.id
WHERE p.deleted_at IS NULL;

-- 1.3 Recreate v_visits_full with security_invoker
DROP VIEW IF EXISTS v_visits_full;
CREATE VIEW v_visits_full WITH (security_invoker = true) AS
SELECT
  v.id,
  v.patient_id,
  v.visit_template_id,
  v.visit_type,
  v.scheduled_date,
  v.completed_date,
  v.status,
  v.notes,
  v.conducted_by,
  v.metadata,
  v.created_by,
  v.created_at,
  v.updated_at,
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
-- PART 2: ENABLE RLS ON REFERENCE TABLES (READ-ONLY LOOKUPS)
-- ============================================================================
-- These tables contain static/reference data that all authenticated users
-- can read but should not modify directly.

-- 2.1 pathologies table
ALTER TABLE pathologies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "pathologies_select_authenticated" ON pathologies
  FOR SELECT TO authenticated
  USING (true);

-- 2.2 center_pathologies table  
ALTER TABLE center_pathologies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "center_pathologies_select_authenticated" ON center_pathologies
  FOR SELECT TO authenticated
  USING (true);

-- 2.3 permissions table
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "permissions_select_authenticated" ON permissions
  FOR SELECT TO authenticated
  USING (true);

-- 2.4 visit_templates table
ALTER TABLE visit_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "visit_templates_select_authenticated" ON visit_templates
  FOR SELECT TO authenticated
  USING (true);

-- ============================================================================
-- PART 3: ENABLE RLS ON USER-SPECIFIC TABLES
-- ============================================================================

-- 3.1 recent_accesses: Users can only manage their own recent access records
ALTER TABLE recent_accesses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "recent_accesses_own_records" ON recent_accesses
  FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- 3.2 user_permissions: Users can view their own, admins can manage all
ALTER TABLE user_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_permissions_view_own" ON user_permissions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "user_permissions_admin_all" ON user_permissions
  FOR ALL TO authenticated
  USING (is_admin());

-- 3.3 login_history: Users can view their own login history
-- Note: Inserts are done via admin client (service role) to allow logging
-- failed login attempts before user is authenticated
ALTER TABLE login_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "login_history_view_own" ON login_history
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- Admin can view all login history for security auditing
CREATE POLICY "login_history_admin_view" ON login_history
  FOR SELECT TO authenticated
  USING (is_admin());

-- 3.4 user_invitations: Complex policies based on role and relationship
-- Note: Token lookups and acceptance are done via admin client (service role)
-- since these operations happen before user is authenticated
ALTER TABLE user_invitations ENABLE ROW LEVEL SECURITY;

-- Users can see invitations they created or invitations sent to their email
CREATE POLICY "user_invitations_view_own" ON user_invitations
  FOR SELECT TO authenticated
  USING (
    invited_by = auth.uid() 
    OR email = (SELECT email FROM user_profiles WHERE id = auth.uid())
  );

-- Managers and admins can view all invitations in their center
CREATE POLICY "user_invitations_center_view" ON user_invitations
  FOR SELECT TO authenticated
  USING (
    (is_manager() OR is_admin())
    AND center_id = get_user_center()
  );

-- Admins can view all invitations
CREATE POLICY "user_invitations_admin_view" ON user_invitations
  FOR SELECT TO authenticated
  USING (is_admin());

-- Users who created an invitation can update it (e.g., resend)
CREATE POLICY "user_invitations_creator_update" ON user_invitations
  FOR UPDATE TO authenticated
  USING (invited_by = auth.uid());

-- Managers can create invitations for their center
CREATE POLICY "user_invitations_manager_insert" ON user_invitations
  FOR INSERT TO authenticated
  WITH CHECK (
    (is_manager() OR is_admin())
    AND (center_id IS NULL OR center_id = get_user_center())
  );

-- Professionals can create patient invitations for their center
CREATE POLICY "user_invitations_professional_insert" ON user_invitations
  FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
    AND center_id = get_user_center()
  );

-- ============================================================================
-- VERIFICATION
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '=== Security Advisor Fixes Applied ===';
  RAISE NOTICE 'Views recreated with security_invoker = true:';
  RAISE NOTICE '  - v_users_full';
  RAISE NOTICE '  - v_patients_full';
  RAISE NOTICE '  - v_visits_full';
  RAISE NOTICE '';
  RAISE NOTICE 'RLS enabled on reference tables:';
  RAISE NOTICE '  - pathologies (SELECT for authenticated)';
  RAISE NOTICE '  - center_pathologies (SELECT for authenticated)';
  RAISE NOTICE '  - permissions (SELECT for authenticated)';
  RAISE NOTICE '  - visit_templates (SELECT for authenticated)';
  RAISE NOTICE '';
  RAISE NOTICE 'RLS enabled on user-specific tables:';
  RAISE NOTICE '  - recent_accesses (own records only)';
  RAISE NOTICE '  - user_permissions (view own, admin manages all)';
  RAISE NOTICE '  - login_history (view own, writes via admin client)';
  RAISE NOTICE '  - user_invitations (role-based policies)';
END $$;
