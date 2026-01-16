-- Create Auth Users
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  invited_at,
  confirmation_token,
  confirmation_sent_at,
  recovery_token,
  recovery_sent_at,
  email_change_token_new,
  email_change,
  email_change_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  created_at,
  updated_at,
  phone,
  phone_confirmed_at,
  phone_change,
  phone_change_token,
  phone_change_sent_at,
  email_change_token_current,
  email_change_confirm_status,
  banned_until,
  reauthentication_token,
  reauthentication_sent_at,
  is_sso_user,
  deleted_at,
  is_anonymous
)
VALUES
  ('00000000-0000-0000-0000-000000000000', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'authenticated', 'authenticated', 'admin@fondamental.fr', crypt('Password123!', gen_salt('bf')), NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider":"email","providers":["email"]}', '{"email_verified":true}', NULL, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('00000000-0000-0000-0000-000000000000', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'authenticated', 'authenticated', 'manager.paris@fondamental.fr', crypt('Password123!', gen_salt('bf')), NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider":"email","providers":["email"]}', '{"email_verified":true}', NULL, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('00000000-0000-0000-0000-000000000000', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'authenticated', 'authenticated', 'manager.lyon@fondamental.fr', crypt('Password123!', gen_salt('bf')), NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider":"email","providers":["email"]}', '{"email_verified":true}', NULL, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('00000000-0000-0000-0000-000000000000', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'authenticated', 'authenticated', 'doctor.paris@fondamental.fr', crypt('Password123!', gen_salt('bf')), NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NULL, '{"provider":"email","providers":["email"]}', '{"email_verified":true}', NULL, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('00000000-0000-0000-0000-000000000000', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'authenticated', 'authenticated', 'doctor.lyon@fondamental.fr', crypt('Password123!', gen_salt('bf')), NOW(), NOW(), '', NULL, '', NULL, '', '', NULL, NULL, '{"provider":"email","providers":["email"]}', '{"email_verified":true}', NULL, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE)
ON CONFLICT (id) DO NOTHING;

-- Create Identities
INSERT INTO auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
VALUES
  (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', '{"sub": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001", "email": "admin@fondamental.fr"}', 'email', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', NOW(), NOW(), NOW()),
  (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', '{"sub": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002", "email": "manager.paris@fondamental.fr"}', 'email', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', NOW(), NOW(), NOW()),
  (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', '{"sub": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003", "email": "manager.lyon@fondamental.fr"}', 'email', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', NOW(), NOW(), NOW()),
  (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', '{"sub": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004", "email": "doctor.paris@fondamental.fr"}', 'email', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', NOW(), NOW(), NOW()),
  (uuid_generate_v4(), 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', '{"sub": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005", "email": "doctor.lyon@fondamental.fr"}', 'email', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', NOW(), NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Create User Profiles
INSERT INTO public.user_profiles (id, role, center_id, first_name, last_name, email, username, active)
VALUES
  -- Admin
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380001', 'administrator', NULL, 'System', 'Administrator', 'admin@fondamental.fr', 'admin', true),
  -- Paris Manager
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380002', 'manager', (SELECT id FROM centers WHERE code = 'CEF-PARIS'), 'Jean', 'Dupont', 'manager.paris@fondamental.fr', 'manager.paris', true),
  -- Lyon Manager
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380003', 'manager', (SELECT id FROM centers WHERE code = 'CEF-LYON'), 'Marie', 'Martin', 'manager.lyon@fondamental.fr', 'manager.lyon', true),
  -- Paris Doctor
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380004', 'healthcare_professional', (SELECT id FROM centers WHERE code = 'CEF-PARIS'), 'Sophie', 'Laurent', 'doctor.paris@fondamental.fr', 'doctor.paris', true),
  -- Lyon Doctor
  ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380005', 'healthcare_professional', (SELECT id FROM centers WHERE code = 'CEF-LYON'), 'Pierre', 'Dubois', 'doctor.lyon@fondamental.fr', 'doctor.lyon', true)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  center_id = EXCLUDED.center_id,
  active = true;
