-- eFondaMental Development Seed Data
-- This script initializes the database with test data for development purposes.
-- Default password for all users: Password123!

-- ============================================================================
-- CLEANUP (optional - uncomment if you need to reset)
-- ============================================================================
-- DELETE FROM public.center_pathologies;
-- DELETE FROM public.visit_templates;
-- DELETE FROM public.user_profiles;
-- DELETE FROM auth.users WHERE email LIKE '%@efondamental.dev';
-- DELETE FROM public.centers;
-- DELETE FROM public.pathologies;

-- ============================================================================
-- 1. PATHOLOGIES
-- ============================================================================
INSERT INTO public.pathologies (id, type, name, description, color)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'bipolar', 'Troubles Bipolaires', 'Expert center for bipolar disorder diagnosis and treatment', '#3B82F6'),
  ('22222222-2222-2222-2222-222222222222', 'schizophrenia', 'Schizophrenie', 'Expert center for schizophrenia spectrum disorders', '#8B5CF6'),
  ('33333333-3333-3333-3333-333333333333', 'asd_asperger', 'Asperger / TSA', 'Expert center for autism spectrum disorders', '#10B981'),
  ('44444444-4444-4444-4444-444444444444', 'depression', 'Depression Resistante', 'Expert center for treatment-resistant depression', '#F59E0B')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 2. EXPERT CENTERS (Paris)
-- ============================================================================
INSERT INTO public.centers (id, name, code, city, address, phone, email, active)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Centre Expert Paris Bipolaire', 'CEP-BIP', 'Paris', '47 Boulevard de l''Hopital, 75013 Paris', '+33 1 42 16 00 00', 'bipolar@efondamental.dev', true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Centre Expert Paris Schizophrenie', 'CEP-SCZ', 'Paris', '47 Boulevard de l''Hopital, 75013 Paris', '+33 1 42 16 00 01', 'schizo@efondamental.dev', true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Centre Expert Paris Asperger', 'CEP-ASP', 'Paris', '47 Boulevard de l''Hopital, 75013 Paris', '+33 1 42 16 00 02', 'asperger@efondamental.dev', true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Centre Expert Paris Depression', 'CEP-DEP', 'Paris', '47 Boulevard de l''Hopital, 75013 Paris', '+33 1 42 16 00 03', 'depression@efondamental.dev', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 3. CENTER-PATHOLOGY LINKS
-- ============================================================================
INSERT INTO public.center_pathologies (center_id, pathology_id)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111'),  -- Paris Bipolaire -> Bipolar
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222'),  -- Paris Schizo -> Schizophrenia
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '33333333-3333-3333-3333-333333333333'),  -- Paris Asperger -> ASD
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '44444444-4444-4444-4444-444444444444')   -- Paris Depression -> Depression
ON CONFLICT DO NOTHING;

-- ============================================================================
-- 4. VISIT TEMPLATES (for each pathology)
-- ============================================================================
-- Bipolar visit templates
INSERT INTO public.visit_templates (id, pathology_id, visit_type, name, description, order_index, active)
VALUES
  ('b1000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'screening', 'Depistage Bipolaire', 'Initial screening visit for bipolar disorder', 1, true),
  ('b1000001-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'initial_evaluation', 'Evaluation Initiale Bipolaire', 'Comprehensive initial evaluation', 2, true),
  ('b1000001-0000-0000-0000-000000000003', '11111111-1111-1111-1111-111111111111', 'biannual_followup', 'Suivi Semestriel Bipolaire', '6-month follow-up visit', 3, true),
  ('b1000001-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'annual_evaluation', 'Evaluation Annuelle Bipolaire', 'Annual comprehensive evaluation', 4, true),
  ('b1000001-0000-0000-0000-000000000005', '11111111-1111-1111-1111-111111111111', 'off_schedule', 'Visite Hors Programme Bipolaire', 'Unscheduled visit', 5, true)
ON CONFLICT (id) DO NOTHING;

-- Schizophrenia visit templates
INSERT INTO public.visit_templates (id, pathology_id, visit_type, name, description, order_index, active)
VALUES
  ('b2000001-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'screening', 'Depistage Schizophrenie', 'Initial screening visit for schizophrenia', 1, true),
  ('b2000001-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'initial_evaluation', 'Evaluation Initiale Schizophrenie', 'Comprehensive initial evaluation', 2, true),
  ('b2000001-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', 'biannual_followup', 'Suivi Semestriel Schizophrenie', '6-month follow-up visit', 3, true),
  ('b2000001-0000-0000-0000-000000000004', '22222222-2222-2222-2222-222222222222', 'annual_evaluation', 'Evaluation Annuelle Schizophrenie', 'Annual comprehensive evaluation', 4, true),
  ('b2000001-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'off_schedule', 'Visite Hors Programme Schizophrenie', 'Unscheduled visit', 5, true)
ON CONFLICT (id) DO NOTHING;

-- Asperger/ASD visit templates
INSERT INTO public.visit_templates (id, pathology_id, visit_type, name, description, order_index, active)
VALUES
  ('b3000001-0000-0000-0000-000000000001', '33333333-3333-3333-3333-333333333333', 'screening', 'Depistage TSA', 'Initial screening visit for ASD', 1, true),
  ('b3000001-0000-0000-0000-000000000002', '33333333-3333-3333-3333-333333333333', 'initial_evaluation', 'Evaluation Initiale TSA', 'Comprehensive initial evaluation', 2, true),
  ('b3000001-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'biannual_followup', 'Suivi Semestriel TSA', '6-month follow-up visit', 3, true),
  ('b3000001-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', 'annual_evaluation', 'Evaluation Annuelle TSA', 'Annual comprehensive evaluation', 4, true),
  ('b3000001-0000-0000-0000-000000000005', '33333333-3333-3333-3333-333333333333', 'off_schedule', 'Visite Hors Programme TSA', 'Unscheduled visit', 5, true)
ON CONFLICT (id) DO NOTHING;

-- Depression visit templates
INSERT INTO public.visit_templates (id, pathology_id, visit_type, name, description, order_index, active)
VALUES
  ('b4000001-0000-0000-0000-000000000001', '44444444-4444-4444-4444-444444444444', 'screening', 'Depistage Depression', 'Initial screening visit for depression', 1, true),
  ('b4000001-0000-0000-0000-000000000002', '44444444-4444-4444-4444-444444444444', 'initial_evaluation', 'Evaluation Initiale Depression', 'Comprehensive initial evaluation', 2, true),
  ('b4000001-0000-0000-0000-000000000003', '44444444-4444-4444-4444-444444444444', 'biannual_followup', 'Suivi Semestriel Depression', '6-month follow-up visit', 3, true),
  ('b4000001-0000-0000-0000-000000000004', '44444444-4444-4444-4444-444444444444', 'annual_evaluation', 'Evaluation Annuelle Depression', 'Annual comprehensive evaluation', 4, true),
  ('b4000001-0000-0000-0000-000000000005', '44444444-4444-4444-4444-444444444444', 'off_schedule', 'Visite Hors Programme Depression', 'Unscheduled visit', 5, true)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 5. USERS (auth.users + user_profiles)
-- Password for all users: Password123!
-- ============================================================================

-- Helper: The password hash for "Password123!" using bcrypt
-- Generated with: SELECT crypt('Password123!', gen_salt('bf'));
-- Note: In Supabase, you may need to use the Supabase CLI or dashboard to create users
-- This script creates the user_profiles directly, assuming auth.users are created separately

-- Create auth users (this works when running with service_role or during migration)
-- The handle_new_user trigger will NOT fire when inserting directly into auth.users,
-- so we create user_profiles manually below.

INSERT INTO auth.users (
  id,
  instance_id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  role,
  aud,
  confirmation_token
)
VALUES
  -- Administrator
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000000', 'admin@efondamental.dev', crypt('Password123!', gen_salt('bf')), NOW(), '{"role": "administrator", "first_name": "Admin", "last_name": "System"}', NOW(), NOW(), 'authenticated', 'authenticated', ''),
  
  -- Managers (one per center)
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000000', 'manager.bipolar@efondamental.dev', crypt('Password123!', gen_salt('bf')), NOW(), '{"role": "manager", "first_name": "Marie", "last_name": "Dupont"}', NOW(), NOW(), 'authenticated', 'authenticated', ''),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000000', 'manager.schizo@efondamental.dev', crypt('Password123!', gen_salt('bf')), NOW(), '{"role": "manager", "first_name": "Pierre", "last_name": "Martin"}', NOW(), NOW(), 'authenticated', 'authenticated', ''),
  ('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000000', 'manager.asperger@efondamental.dev', crypt('Password123!', gen_salt('bf')), NOW(), '{"role": "manager", "first_name": "Sophie", "last_name": "Bernard"}', NOW(), NOW(), 'authenticated', 'authenticated', ''),
  ('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000000', 'manager.depression@efondamental.dev', crypt('Password123!', gen_salt('bf')), NOW(), '{"role": "manager", "first_name": "Jean", "last_name": "Leroy"}', NOW(), NOW(), 'authenticated', 'authenticated', ''),
  
  -- Doctors - Bipolar Center (2)
  ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000000', 'dr.lambert@efondamental.dev', crypt('Password123!', gen_salt('bf')), NOW(), '{"role": "healthcare_professional", "first_name": "Antoine", "last_name": "Lambert"}', NOW(), NOW(), 'authenticated', 'authenticated', ''),
  ('00000000-0000-0000-0000-000000000021', '00000000-0000-0000-0000-000000000000', 'dr.moreau@efondamental.dev', crypt('Password123!', gen_salt('bf')), NOW(), '{"role": "healthcare_professional", "first_name": "Claire", "last_name": "Moreau"}', NOW(), NOW(), 'authenticated', 'authenticated', ''),
  
  -- Doctors - Schizophrenia Center (2)
  ('00000000-0000-0000-0000-000000000022', '00000000-0000-0000-0000-000000000000', 'dr.petit@efondamental.dev', crypt('Password123!', gen_salt('bf')), NOW(), '{"role": "healthcare_professional", "first_name": "Philippe", "last_name": "Petit"}', NOW(), NOW(), 'authenticated', 'authenticated', ''),
  ('00000000-0000-0000-0000-000000000023', '00000000-0000-0000-0000-000000000000', 'dr.roux@efondamental.dev', crypt('Password123!', gen_salt('bf')), NOW(), '{"role": "healthcare_professional", "first_name": "Isabelle", "last_name": "Roux"}', NOW(), NOW(), 'authenticated', 'authenticated', ''),
  
  -- Doctors - Asperger Center (2)
  ('00000000-0000-0000-0000-000000000024', '00000000-0000-0000-0000-000000000000', 'dr.fournier@efondamental.dev', crypt('Password123!', gen_salt('bf')), NOW(), '{"role": "healthcare_professional", "first_name": "Nicolas", "last_name": "Fournier"}', NOW(), NOW(), 'authenticated', 'authenticated', ''),
  ('00000000-0000-0000-0000-000000000025', '00000000-0000-0000-0000-000000000000', 'dr.girard@efondamental.dev', crypt('Password123!', gen_salt('bf')), NOW(), '{"role": "healthcare_professional", "first_name": "Emilie", "last_name": "Girard"}', NOW(), NOW(), 'authenticated', 'authenticated', ''),
  
  -- Doctors - Depression Center (2)
  ('00000000-0000-0000-0000-000000000026', '00000000-0000-0000-0000-000000000000', 'dr.mercier@efondamental.dev', crypt('Password123!', gen_salt('bf')), NOW(), '{"role": "healthcare_professional", "first_name": "Laurent", "last_name": "Mercier"}', NOW(), NOW(), 'authenticated', 'authenticated', ''),
  ('00000000-0000-0000-0000-000000000027', '00000000-0000-0000-0000-000000000000', 'dr.blanc@efondamental.dev', crypt('Password123!', gen_salt('bf')), NOW(), '{"role": "healthcare_professional", "first_name": "Valerie", "last_name": "Blanc"}', NOW(), NOW(), 'authenticated', 'authenticated', '')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 6. USER PROFILES (with center assignments)
-- ============================================================================
INSERT INTO public.user_profiles (id, role, center_id, first_name, last_name, email, active)
VALUES
  -- Administrator (no center - system-wide)
  ('00000000-0000-0000-0000-000000000001', 'administrator', NULL, 'Admin', 'System', 'admin@efondamental.dev', true),
  
  -- Managers
  ('00000000-0000-0000-0000-000000000010', 'manager', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Marie', 'Dupont', 'manager.bipolar@efondamental.dev', true),
  ('00000000-0000-0000-0000-000000000011', 'manager', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Pierre', 'Martin', 'manager.schizo@efondamental.dev', true),
  ('00000000-0000-0000-0000-000000000012', 'manager', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Sophie', 'Bernard', 'manager.asperger@efondamental.dev', true),
  ('00000000-0000-0000-0000-000000000013', 'manager', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Jean', 'Leroy', 'manager.depression@efondamental.dev', true),
  
  -- Doctors - Bipolar Center
  ('00000000-0000-0000-0000-000000000020', 'healthcare_professional', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Antoine', 'Lambert', 'dr.lambert@efondamental.dev', true),
  ('00000000-0000-0000-0000-000000000021', 'healthcare_professional', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Claire', 'Moreau', 'dr.moreau@efondamental.dev', true),
  
  -- Doctors - Schizophrenia Center
  ('00000000-0000-0000-0000-000000000022', 'healthcare_professional', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Philippe', 'Petit', 'dr.petit@efondamental.dev', true),
  ('00000000-0000-0000-0000-000000000023', 'healthcare_professional', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Isabelle', 'Roux', 'dr.roux@efondamental.dev', true),
  
  -- Doctors - Asperger Center
  ('00000000-0000-0000-0000-000000000024', 'healthcare_professional', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Nicolas', 'Fournier', 'dr.fournier@efondamental.dev', true),
  ('00000000-0000-0000-0000-000000000025', 'healthcare_professional', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'Emilie', 'Girard', 'dr.girard@efondamental.dev', true),
  
  -- Doctors - Depression Center
  ('00000000-0000-0000-0000-000000000026', 'healthcare_professional', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Laurent', 'Mercier', 'dr.mercier@efondamental.dev', true),
  ('00000000-0000-0000-0000-000000000027', 'healthcare_professional', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'Valerie', 'Blanc', 'dr.blanc@efondamental.dev', true)
ON CONFLICT (id) DO UPDATE SET
  role = EXCLUDED.role,
  center_id = EXCLUDED.center_id,
  first_name = EXCLUDED.first_name,
  last_name = EXCLUDED.last_name,
  email = EXCLUDED.email,
  active = EXCLUDED.active;

-- ============================================================================
-- SUMMARY OF CREATED USERS
-- ============================================================================
-- All users have password: Password123!
--
-- ADMINISTRATOR:
--   admin@efondamental.dev
--
-- MANAGERS:
--   manager.bipolar@efondamental.dev     (Centre Expert Paris Bipolaire)
--   manager.schizo@efondamental.dev      (Centre Expert Paris Schizophrenie)
--   manager.asperger@efondamental.dev    (Centre Expert Paris Asperger)
--   manager.depression@efondamental.dev  (Centre Expert Paris Depression)
--
-- DOCTORS (healthcare_professional):
--   dr.lambert@efondamental.dev          (Bipolar Center)
--   dr.moreau@efondamental.dev           (Bipolar Center)
--   dr.petit@efondamental.dev            (Schizophrenia Center)
--   dr.roux@efondamental.dev             (Schizophrenia Center)
--   dr.fournier@efondamental.dev         (Asperger Center)
--   dr.girard@efondamental.dev           (Asperger Center)
--   dr.mercier@efondamental.dev          (Depression Center)
--   dr.blanc@efondamental.dev            (Depression Center)
-- ============================================================================
