-- eFondaMental Platform - Initialize Users
-- This script creates user profiles for auth users

-- ============================================================================
-- INSTRUCTIONS - COMPLETE THESE STEPS FIRST
-- ============================================================================
-- 
-- STEP 1: Create Auth Users in Supabase Dashboard
-- Go to: Authentication > Users > Add User (Email + Password)
-- 
-- Create these 4 users with Password123! for each:
--    ✓ admin@fondamental.fr
--    ✓ manager.paris@fondamental.fr
--    ✓ manager.lyon@fondamental.fr
--    ✓ manager.marseille@fondamental.fr
--
-- STEP 2: Run this entire script in the Supabase SQL Editor
-- This script will automatically find the UUIDs and create the profiles
--
-- ============================================================================

DO $$
DECLARE
  v_admin_id UUID;
  v_paris_manager_id UUID;
  v_lyon_manager_id UUID;
  v_marseille_manager_id UUID;
BEGIN
  -- ============================================================================
  -- LOOKUP AUTH USER UUIDs
  -- ============================================================================
  
  -- Get admin UUID
  SELECT id INTO v_admin_id 
  FROM auth.users 
  WHERE email = 'admin@fondamental.fr';
  
  -- Get Paris manager UUID
  SELECT id INTO v_paris_manager_id 
  FROM auth.users 
  WHERE email = 'manager.paris@fondamental.fr';
  
  -- Get Lyon manager UUID
  SELECT id INTO v_lyon_manager_id 
  FROM auth.users 
  WHERE email = 'manager.lyon@fondamental.fr';
  
  -- Get Marseille manager UUID
  SELECT id INTO v_marseille_manager_id 
  FROM auth.users 
  WHERE email = 'manager.marseille@fondamental.fr';

  -- ============================================================================
  -- VALIDATE ALL USERS EXIST
  -- ============================================================================
  
  IF v_admin_id IS NULL THEN
    RAISE EXCEPTION 'Admin user not found! Please create admin@fondamental.fr in Supabase Auth first.';
  END IF;
  
  IF v_paris_manager_id IS NULL THEN
    RAISE EXCEPTION 'Paris manager not found! Please create manager.paris@fondamental.fr in Supabase Auth first.';
  END IF;
  
  IF v_lyon_manager_id IS NULL THEN
    RAISE EXCEPTION 'Lyon manager not found! Please create manager.lyon@fondamental.fr in Supabase Auth first.';
  END IF;
  
  IF v_marseille_manager_id IS NULL THEN
    RAISE EXCEPTION 'Marseille manager not found! Please create manager.marseille@fondamental.fr in Supabase Auth first.';
  END IF;

  -- ============================================================================
  -- CREATE ADMIN USER PROFILE
  -- ============================================================================
  
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

  RAISE NOTICE 'Created admin profile for: admin@fondamental.fr (UUID: %)', v_admin_id;

  -- ============================================================================
  -- CREATE MANAGER USER PROFILES
  -- ============================================================================

  -- Paris Manager
  INSERT INTO user_profiles (id, role, center_id, first_name, last_name, email, username, active)
  SELECT 
    v_paris_manager_id,
    'manager',
    c.id,
    'Jean',
    'Dupont',
    'manager.paris@fondamental.fr',
    'manager.paris',
    true
  FROM centers c WHERE c.code = 'CEF-PARIS'
  ON CONFLICT (id) DO NOTHING;

  RAISE NOTICE 'Created Paris manager profile for: manager.paris@fondamental.fr (UUID: %)', v_paris_manager_id;

  -- Lyon Manager  
  INSERT INTO user_profiles (id, role, center_id, first_name, last_name, email, username, active)
  SELECT 
    v_lyon_manager_id,
    'manager',
    c.id,
    'Marie',
    'Martin',
    'manager.lyon@fondamental.fr',
    'manager.lyon',
    true
  FROM centers c WHERE c.code = 'CEF-LYON'
  ON CONFLICT (id) DO NOTHING;

  RAISE NOTICE 'Created Lyon manager profile for: manager.lyon@fondamental.fr (UUID: %)', v_lyon_manager_id;

  -- Marseille Manager
  INSERT INTO user_profiles (id, role, center_id, first_name, last_name, email, username, active)
  SELECT 
    v_marseille_manager_id,
    'manager',
    c.id,
    'Pierre',
    'Bernard',
    'manager.marseille@fondamental.fr',
    'manager.marseille',
    true
  FROM centers c WHERE c.code = 'CEF-MARSEILLE'
  ON CONFLICT (id) DO NOTHING;

  RAISE NOTICE 'Created Marseille manager profile for: manager.marseille@fondamental.fr (UUID: %)', v_marseille_manager_id;

  RAISE NOTICE '
  ============================================================
  SUCCESS! All user profiles created.
  ============================================================
  
  You can now login with:
  
  ADMIN:
  - Email: admin@fondamental.fr
  - Username: admin
  - Password: Password123!
  - Access: http://localhost:3000/admin
  
  PARIS MANAGER:
  - Email: manager.paris@fondamental.fr
  - Username: manager.paris
  - Password: Password123!
  - Access: http://localhost:3000/manager
  
  LYON MANAGER:
  - Email: manager.lyon@fondamental.fr
  - Username: manager.lyon
  - Password: Password123!
  - Access: http://localhost:3000/manager
  
  MARSEILLE MANAGER:
  - Email: manager.marseille@fondamental.fr
  - Username: manager.marseille
  - Password: Password123!
  - Access: http://localhost:3000/manager
  
  ============================================================
  ';

END $$;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

-- Verify all profiles were created correctly:
SELECT 
  up.email,
  up.username,
  up.role,
  c.name as center_name,
  up.active,
  up.first_name,
  up.last_name
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

