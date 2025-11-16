-- Fix RLS policies for user_profiles table to allow proper access

-- Drop all existing user_profiles policies
DROP POLICY IF EXISTS user_profiles_select_own ON user_profiles;
DROP POLICY IF EXISTS user_profiles_update_own ON user_profiles;
DROP POLICY IF EXISTS user_profiles_insert ON user_profiles;
DROP POLICY IF EXISTS user_profiles_delete ON user_profiles;
DROP POLICY IF EXISTS user_profiles_own_profile ON user_profiles;
DROP POLICY IF EXISTS user_profiles_admin_all ON user_profiles;
DROP POLICY IF EXISTS user_profiles_center_view ON user_profiles;
DROP POLICY IF EXISTS user_profiles_manager_modify ON user_profiles;
DROP POLICY IF EXISTS user_profiles_select_all ON user_profiles;
DROP POLICY IF EXISTS user_profiles_insert_all ON user_profiles;
DROP POLICY IF EXISTS user_profiles_update_all ON user_profiles;
DROP POLICY IF EXISTS user_profiles_delete_none ON user_profiles;

-- Create a helper function to check if user is admin (avoids recursion)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'administrator'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create a helper function to get user's center (avoids recursion)
CREATE OR REPLACE FUNCTION get_user_center()
RETURNS UUID AS $$
BEGIN
  RETURN (
    SELECT center_id FROM user_profiles
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Create a helper function to check if user is manager (avoids recursion)
CREATE OR REPLACE FUNCTION is_manager()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role = 'manager'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- Policy 1: Users can always SELECT their own profile
CREATE POLICY user_profiles_select_own ON user_profiles
  FOR SELECT
  USING (id = auth.uid());

-- Policy 2: Administrators can SELECT all profiles
CREATE POLICY user_profiles_admin_select ON user_profiles
  FOR SELECT
  USING (is_admin());

-- Policy 3: Managers and healthcare professionals can SELECT profiles in their center
CREATE POLICY user_profiles_center_select ON user_profiles
  FOR SELECT
  USING (
    center_id IS NOT NULL 
    AND center_id = get_user_center()
    AND get_user_center() IS NOT NULL
  );

-- Policy 4: Users can UPDATE their own profile
CREATE POLICY user_profiles_update_own ON user_profiles
  FOR UPDATE
  USING (id = auth.uid());

-- Policy 5: Administrators can UPDATE all profiles
CREATE POLICY user_profiles_admin_update ON user_profiles
  FOR UPDATE
  USING (is_admin());

-- Policy 6: Managers can UPDATE profiles in their center
CREATE POLICY user_profiles_manager_update ON user_profiles
  FOR UPDATE
  USING (
    is_manager()
    AND center_id IS NOT NULL 
    AND center_id = get_user_center()
  );

-- Policy 7: Allow INSERT for authenticated users (for user creation workflows)
CREATE POLICY user_profiles_insert ON user_profiles
  FOR INSERT
  WITH CHECK (
    is_admin() OR is_manager()
  );

-- Policy 8: Prevent DELETE (use soft delete by setting active=false instead)
CREATE POLICY user_profiles_no_delete ON user_profiles
  FOR DELETE
  USING (is_admin());

-- Grant execute permissions on helper functions
GRANT EXECUTE ON FUNCTION is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_center() TO authenticated;
GRANT EXECUTE ON FUNCTION is_manager() TO authenticated;

-- Verify the policies are set correctly
DO $$
BEGIN
  RAISE NOTICE 'RLS policies for user_profiles have been updated successfully';
  RAISE NOTICE 'Admins can now see all users';
  RAISE NOTICE 'Managers can see all users in their center';
  RAISE NOTICE 'Users can always see their own profile';
END $$;

