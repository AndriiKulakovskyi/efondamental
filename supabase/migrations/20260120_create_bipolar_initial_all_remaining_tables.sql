-- ============================================================================
-- Create Bipolar Initial Evaluation - ALL REMAINING TABLES
-- Covers: Auto ETAT, Auto TRAITS, Social, Medical, Neuropsy modules
-- ============================================================================

-- Drop all existing tables to recreate with correct schema (no GENERATED columns)
-- Auto ETAT
DROP TABLE IF EXISTS public.bipolar_eq5d5l CASCADE;
DROP TABLE IF EXISTS public.bipolar_prise_m CASCADE;
DROP TABLE IF EXISTS public.bipolar_stai_ya CASCADE;
DROP TABLE IF EXISTS public.bipolar_mars CASCADE;
DROP TABLE IF EXISTS public.bipolar_mathys CASCADE;
DROP TABLE IF EXISTS public.bipolar_psqi CASCADE;
DROP TABLE IF EXISTS public.bipolar_epworth CASCADE;
-- Auto TRAITS
DROP TABLE IF EXISTS public.bipolar_asrs CASCADE;
DROP TABLE IF EXISTS public.bipolar_ctq CASCADE;
DROP TABLE IF EXISTS public.bipolar_bis10 CASCADE;
DROP TABLE IF EXISTS public.bipolar_als18 CASCADE;
DROP TABLE IF EXISTS public.bipolar_aim CASCADE;
DROP TABLE IF EXISTS public.bipolar_wurs25 CASCADE;
DROP TABLE IF EXISTS public.bipolar_aq12 CASCADE;
DROP TABLE IF EXISTS public.bipolar_csm CASCADE;
DROP TABLE IF EXISTS public.bipolar_cti CASCADE;
-- Social
DROP TABLE IF EXISTS public.bipolar_social CASCADE;
-- Medical
DROP TABLE IF EXISTS public.bipolar_dsm5_humeur CASCADE;
DROP TABLE IF EXISTS public.bipolar_dsm5_psychotic CASCADE;
DROP TABLE IF EXISTS public.bipolar_dsm5_comorbid CASCADE;
DROP TABLE IF EXISTS public.bipolar_diva CASCADE;
DROP TABLE IF EXISTS public.bipolar_family_history CASCADE;
DROP TABLE IF EXISTS public.bipolar_cssrs CASCADE;
DROP TABLE IF EXISTS public.bipolar_isa CASCADE;
DROP TABLE IF EXISTS public.bipolar_sis CASCADE;
DROP TABLE IF EXISTS public.bipolar_suicide_history CASCADE;
DROP TABLE IF EXISTS public.bipolar_perinatalite CASCADE;
DROP TABLE IF EXISTS public.bipolar_patho_neuro CASCADE;
DROP TABLE IF EXISTS public.bipolar_patho_cardio CASCADE;
DROP TABLE IF EXISTS public.bipolar_patho_endoc CASCADE;
DROP TABLE IF EXISTS public.bipolar_patho_dermato CASCADE;
DROP TABLE IF EXISTS public.bipolar_patho_urinaire CASCADE;
DROP TABLE IF EXISTS public.bipolar_antecedents_gyneco CASCADE;
DROP TABLE IF EXISTS public.bipolar_patho_hepato_gastro CASCADE;
DROP TABLE IF EXISTS public.bipolar_patho_allergique CASCADE;
DROP TABLE IF EXISTS public.bipolar_autres_patho CASCADE;
-- Neuropsy
DROP TABLE IF EXISTS public.bipolar_cvlt CASCADE;
DROP TABLE IF EXISTS public.bipolar_tmt CASCADE;
DROP TABLE IF EXISTS public.bipolar_stroop CASCADE;
DROP TABLE IF EXISTS public.bipolar_fluences_verbales CASCADE;
DROP TABLE IF EXISTS public.bipolar_mem3_spatial CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais4_criteria CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais4_learning CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais4_matrices CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais4_code CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais4_digit_span CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais4_similitudes CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais3_criteria CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais3_learning CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais3_vocabulaire CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais3_matrices CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais3_code_symboles CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais3_digit_span CASCADE;
DROP TABLE IF EXISTS public.bipolar_wais3_cpt2 CASCADE;
DROP TABLE IF EXISTS public.bipolar_cobra CASCADE;
DROP TABLE IF EXISTS public.bipolar_cpt3 CASCADE;
DROP TABLE IF EXISTS public.bipolar_scip CASCADE;
DROP TABLE IF EXISTS public.bipolar_test_commissions CASCADE;

-- ============================================================================
-- AUTO ETAT MODULE TABLES
-- ============================================================================

-- BIPOLAR_EQ5D5L
CREATE TABLE public.bipolar_eq5d5l (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  mobility INTEGER CHECK (mobility >= 1 AND mobility <= 5),
  self_care INTEGER CHECK (self_care >= 1 AND self_care <= 5),
  usual_activities INTEGER CHECK (usual_activities >= 1 AND usual_activities <= 5),
  pain_discomfort INTEGER CHECK (pain_discomfort >= 1 AND pain_discomfort <= 5),
  anxiety_depression INTEGER CHECK (anxiety_depression >= 1 AND anxiety_depression <= 5),
  vas_score INTEGER CHECK (vas_score >= 0 AND vas_score <= 100),
  health_state TEXT,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_PRISE_M
CREATE TABLE public.bipolar_prise_m (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  taking_medication VARCHAR(10),
  q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER, q5 INTEGER,
  q6 INTEGER, q7 INTEGER, q8 INTEGER, q9 INTEGER, q10 INTEGER,
  q11 INTEGER, q12 INTEGER, q13 INTEGER, q14 INTEGER, q15 INTEGER,
  q16 INTEGER, q17 INTEGER, q18 INTEGER, q19 INTEGER, q20 INTEGER,
  q21 INTEGER, q22 INTEGER, q23 INTEGER, q24 INTEGER, q25 INTEGER,
  q26 INTEGER, q27 INTEGER, q28 INTEGER, q29 INTEGER, q30 INTEGER, q31 INTEGER,
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_STAI_YA
CREATE TABLE public.bipolar_stai_ya (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER, q5 INTEGER,
  q6 INTEGER, q7 INTEGER, q8 INTEGER, q9 INTEGER, q10 INTEGER,
  q11 INTEGER, q12 INTEGER, q13 INTEGER, q14 INTEGER, q15 INTEGER,
  q16 INTEGER, q17 INTEGER, q18 INTEGER, q19 INTEGER, q20 INTEGER,
  note_t NUMERIC,
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_MARS
CREATE TABLE public.bipolar_mars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  taking_medication VARCHAR(10),
  q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER, q5 INTEGER,
  q6 INTEGER, q7 INTEGER, q8 INTEGER, q9 INTEGER, q10 INTEGER,
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_MATHYS
CREATE TABLE public.bipolar_mathys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 NUMERIC, q2 NUMERIC, q3 NUMERIC, q4 NUMERIC, q5 NUMERIC,
  q6 NUMERIC, q7 NUMERIC, q8 NUMERIC, q9 NUMERIC, q10 NUMERIC,
  q11 NUMERIC, q12 NUMERIC, q13 NUMERIC, q14 NUMERIC, q15 NUMERIC,
  q16 NUMERIC, q17 NUMERIC, q18 NUMERIC, q19 NUMERIC, q20 NUMERIC,
  subscore_emotion NUMERIC,
  subscore_motivation NUMERIC,
  subscore_perception NUMERIC,
  subscore_interaction NUMERIC,
  subscore_cognition NUMERIC,
  tristesse NUMERIC, joie NUMERIC, irritabilite NUMERIC, panique NUMERIC,
  anxiete NUMERIC, colere NUMERIC, exaltation NUMERIC,
  total_score NUMERIC,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_PSQI
CREATE TABLE public.bipolar_psqi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1_bedtime TEXT, q2_minutes_to_sleep INTEGER, q3_waketime TEXT, q4_hours_sleep TEXT,
  q5a INTEGER, q5b INTEGER, q5c INTEGER, q5d INTEGER, q5e INTEGER,
  q5f INTEGER, q5g INTEGER, q5h INTEGER, q5i INTEGER, q5j INTEGER, q5j_text TEXT,
  q6 INTEGER, q7 INTEGER, q8 INTEGER, q9 INTEGER,
  c1_subjective_quality INTEGER, c2_latency INTEGER, c3_duration INTEGER,
  c4_efficiency INTEGER, c5_disturbances INTEGER, c6_medication INTEGER, c7_daytime_dysfunction INTEGER,
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_EPWORTH
CREATE TABLE public.bipolar_epworth (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER, q5 INTEGER, q6 INTEGER, q7 INTEGER, q8 INTEGER, q9 INTEGER,
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AUTO TRAITS MODULE TABLES
-- ============================================================================

-- BIPOLAR_ASRS
CREATE TABLE public.bipolar_asrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  a1 INTEGER, a2 INTEGER, a3 INTEGER, a4 INTEGER, a5 INTEGER, a6 INTEGER,
  b7 INTEGER, b8 INTEGER, b9 INTEGER, b10 INTEGER, b11 INTEGER, b12 INTEGER,
  b13 INTEGER, b14 INTEGER, b15 INTEGER, b16 INTEGER, b17 INTEGER, b18 INTEGER,
  part_a_score INTEGER, part_b_score INTEGER, total_score INTEGER,
  screening_positive BOOLEAN,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_CTQ
CREATE TABLE public.bipolar_ctq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER, q5 INTEGER,
  q6 INTEGER, q7 INTEGER, q8 INTEGER, q9 INTEGER, q10 INTEGER,
  q11 INTEGER, q12 INTEGER, q13 INTEGER, q14 INTEGER, q15 INTEGER,
  q16 INTEGER, q17 INTEGER, q18 INTEGER, q19 INTEGER, q20 INTEGER,
  q21 INTEGER, q22 INTEGER, q23 INTEGER, q24 INTEGER, q25 INTEGER,
  q26 INTEGER, q27 INTEGER, q28 INTEGER,
  emotional_abuse_score INTEGER,
  physical_abuse_score INTEGER,
  sexual_abuse_score INTEGER,
  emotional_neglect_score INTEGER,
  physical_neglect_score INTEGER,
  minimization_score INTEGER,
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_BIS10
CREATE TABLE public.bipolar_bis10 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER, q5 INTEGER,
  q6 INTEGER, q7 INTEGER, q8 INTEGER, q9 INTEGER, q10 INTEGER,
  q11 INTEGER, q12 INTEGER, q13 INTEGER, q14 INTEGER, q15 INTEGER,
  q16 INTEGER, q17 INTEGER, q18 INTEGER, q19 INTEGER, q20 INTEGER,
  q21 INTEGER, q22 INTEGER, q23 INTEGER, q24 INTEGER, q25 INTEGER,
  q26 INTEGER, q27 INTEGER, q28 INTEGER, q29 INTEGER, q30 INTEGER,
  motor_score INTEGER, cognitive_score INTEGER, non_planning_score INTEGER,
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_ALS18
CREATE TABLE public.bipolar_als18 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER, q5 INTEGER,
  q6 INTEGER, q7 INTEGER, q8 INTEGER, q9 INTEGER, q10 INTEGER,
  q11 INTEGER, q12 INTEGER, q13 INTEGER, q14 INTEGER, q15 INTEGER,
  q16 INTEGER, q17 INTEGER, q18 INTEGER,
  affective_instability_score INTEGER, behavioral_dysregulation_score INTEGER,
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_AIM
CREATE TABLE public.bipolar_aim (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER, q5 INTEGER,
  q6 INTEGER, q7 INTEGER, q8 INTEGER, q9 INTEGER, q10 INTEGER,
  q11 INTEGER, q12 INTEGER, q13 INTEGER, q14 INTEGER, q15 INTEGER,
  q16 INTEGER, q17 INTEGER, q18 INTEGER, q19 INTEGER, q20 INTEGER,
  q21 INTEGER,
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_WURS25
CREATE TABLE public.bipolar_wurs25 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER, q5 INTEGER,
  q6 INTEGER, q7 INTEGER, q8 INTEGER, q9 INTEGER, q10 INTEGER,
  q11 INTEGER, q12 INTEGER, q13 INTEGER, q14 INTEGER, q15 INTEGER,
  q16 INTEGER, q17 INTEGER, q18 INTEGER, q19 INTEGER, q20 INTEGER,
  q21 INTEGER, q22 INTEGER, q23 INTEGER, q24 INTEGER, q25 INTEGER,
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_AQ12
CREATE TABLE public.bipolar_aq12 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER, q5 INTEGER,
  q6 INTEGER, q7 INTEGER, q8 INTEGER, q9 INTEGER, q10 INTEGER,
  q11 INTEGER, q12 INTEGER,
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_CSM
CREATE TABLE public.bipolar_csm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER, q5 INTEGER,
  q6 INTEGER, q7 INTEGER, q8 INTEGER, q9 INTEGER, q10 INTEGER,
  q11 INTEGER, q12 INTEGER, q13 INTEGER,
  total_score INTEGER,
  chronotype TEXT,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_CTI
CREATE TABLE public.bipolar_cti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 INTEGER, q2 INTEGER, q3 INTEGER, q4 INTEGER, q5 INTEGER,
  q6 INTEGER, q7 INTEGER, q8 INTEGER, q9 INTEGER, q10 INTEGER,
  q11 INTEGER, q12 INTEGER, q13 INTEGER, q14 INTEGER, q15 INTEGER,
  q16 INTEGER, q17 INTEGER, q18 INTEGER, q19 INTEGER, q20 INTEGER,
  q21 INTEGER, q22 INTEGER, q23 INTEGER, q24 INTEGER, q25 INTEGER,
  q26 INTEGER, q27 INTEGER, q28 INTEGER, q29 INTEGER, q30 INTEGER,
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SOCIAL MODULE TABLE
-- ============================================================================

-- BIPOLAR_SOCIAL
CREATE TABLE public.bipolar_social (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MEDICAL MODULE TABLES
-- ============================================================================

-- BIPOLAR_DSM5_HUMEUR
CREATE TABLE public.bipolar_dsm5_humeur (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_DSM5_PSYCHOTIC
CREATE TABLE public.bipolar_dsm5_psychotic (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_DSM5_COMORBID
CREATE TABLE public.bipolar_dsm5_comorbid (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_DIVA
CREATE TABLE public.bipolar_diva (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  total_inattention_adult INTEGER, total_inattention_childhood INTEGER,
  total_hyperactivity_adult INTEGER, total_hyperactivity_childhood INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_FAMILY_HISTORY
CREATE TABLE public.bipolar_family_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_CSSRS
CREATE TABLE public.bipolar_cssrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  risk_level TEXT,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_ISA
CREATE TABLE public.bipolar_isa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_SIS
CREATE TABLE public.bipolar_sis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_SUICIDE_HISTORY
CREATE TABLE public.bipolar_suicide_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_PERINATALITE
CREATE TABLE public.bipolar_perinatalite (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Medical history tables (patho_*)
CREATE TABLE public.bipolar_patho_neuro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_patho_cardio (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_patho_endoc (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_patho_dermato (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_patho_urinaire (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_antecedents_gyneco (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_patho_hepato_gastro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_patho_allergique (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_autres_patho (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- NEUROPSY MODULE TABLES
-- ============================================================================

-- BIPOLAR_CVLT
CREATE TABLE public.bipolar_cvlt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_TMT
CREATE TABLE public.bipolar_tmt (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_STROOP
CREATE TABLE public.bipolar_stroop (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_FLUENCES_VERBALES
CREATE TABLE public.bipolar_fluences_verbales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BIPOLAR_MEM3_SPATIAL
CREATE TABLE public.bipolar_mem3_spatial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WAIS4 Tables
CREATE TABLE public.bipolar_wais4_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais4_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais4_matrices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais4_code (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais4_digit_span (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais4_similitudes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- WAIS3 Tables
CREATE TABLE public.bipolar_wais3_criteria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais3_learning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais3_vocabulaire (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais3_matrices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais3_code_symboles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais3_digit_span (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_wais3_cpt2 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Other neuropsy tables
CREATE TABLE public.bipolar_cobra (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_cpt3 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_scip (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.bipolar_test_commissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  responses JSONB,
  scores JSONB,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Enable RLS on ALL tables
-- ============================================================================
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT tablename FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename LIKE 'bipolar_%'
    AND tablename NOT IN ('bipolar_asrm', 'bipolar_qids_sr16', 'bipolar_mdq', 'bipolar_diagnostic', 'bipolar_orientation',
                          'bipolar_tobacco', 'bipolar_fagerstrom', 'bipolar_physical_params', 'bipolar_blood_pressure',
                          'bipolar_sleep_apnea', 'bipolar_biological_assessment',
                          'bipolar_madrs', 'bipolar_ymrs', 'bipolar_cgi', 'bipolar_egf', 'bipolar_alda',
                          'bipolar_etat_patient', 'bipolar_fast')
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    
    -- Drop existing policies if they exist
    EXECUTE format('DROP POLICY IF EXISTS "Patients view own %I" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Professionals view all %I" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Professionals insert %I" ON public.%I', t, t);
    EXECUTE format('DROP POLICY IF EXISTS "Professionals update %I" ON public.%I', t, t);
    
    -- Create policies
    EXECUTE format('CREATE POLICY "Patients view own %I" ON public.%I FOR SELECT USING (auth.uid() = patient_id)', t, t);
    EXECUTE format('CREATE POLICY "Professionals view all %I" ON public.%I FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN (''healthcare_professional'', ''manager'', ''administrator'')))', t, t);
    EXECUTE format('CREATE POLICY "Professionals insert %I" ON public.%I FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN (''healthcare_professional'', ''manager'', ''administrator'')))', t, t);
    EXECUTE format('CREATE POLICY "Professionals update %I" ON public.%I FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN (''healthcare_professional'', ''manager'', ''administrator'')))', t, t);
    
    -- Create indexes
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_visit_id ON public.%I(visit_id)', t, t);
    EXECUTE format('CREATE INDEX IF NOT EXISTS idx_%I_patient_id ON public.%I(patient_id)', t, t);
    
    -- Grant permissions
    EXECUTE format('GRANT SELECT, INSERT, UPDATE ON public.%I TO authenticated', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role', t);
  END LOOP;
END
$$;

-- ============================================================================
-- Reload PostgREST schema cache
-- ============================================================================
NOTIFY pgrst, 'reload schema';
