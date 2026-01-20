-- ============================================================================
-- Create Bipolar Initial Evaluation - Thymic Module Tables
-- Tables: bipolar_madrs, bipolar_ymrs, bipolar_cgi, bipolar_egf,
--         bipolar_alda, bipolar_etat_patient, bipolar_fast
-- ============================================================================

-- Drop existing tables to recreate with correct schema (no GENERATED columns)
DROP TABLE IF EXISTS public.bipolar_madrs CASCADE;
DROP TABLE IF EXISTS public.bipolar_ymrs CASCADE;
DROP TABLE IF EXISTS public.bipolar_cgi CASCADE;
DROP TABLE IF EXISTS public.bipolar_egf CASCADE;
DROP TABLE IF EXISTS public.bipolar_alda CASCADE;
DROP TABLE IF EXISTS public.bipolar_etat_patient CASCADE;
DROP TABLE IF EXISTS public.bipolar_fast CASCADE;

-- ============================================================================
-- BIPOLAR_MADRS (Montgomery-Asberg Depression Rating Scale)
-- ============================================================================
CREATE TABLE public.bipolar_madrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 INTEGER CHECK (q1 >= 0 AND q1 <= 6),
  q2 INTEGER CHECK (q2 >= 0 AND q2 <= 6),
  q3 INTEGER CHECK (q3 >= 0 AND q3 <= 6),
  q4 INTEGER CHECK (q4 >= 0 AND q4 <= 6),
  q5 INTEGER CHECK (q5 >= 0 AND q5 <= 6),
  q6 INTEGER CHECK (q6 >= 0 AND q6 <= 6),
  q7 INTEGER CHECK (q7 >= 0 AND q7 <= 6),
  q8 INTEGER CHECK (q8 >= 0 AND q8 <= 6),
  q9 INTEGER CHECK (q9 >= 0 AND q9 <= 6),
  q10 INTEGER CHECK (q10 >= 0 AND q10 <= 6),
  total_score INTEGER, -- Computed by application
  severity TEXT,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BIPOLAR_YMRS (Young Mania Rating Scale)
-- ============================================================================
CREATE TABLE public.bipolar_ymrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 INTEGER CHECK (q1 >= 0 AND q1 <= 4),
  q2 INTEGER CHECK (q2 >= 0 AND q2 <= 4),
  q3 INTEGER CHECK (q3 >= 0 AND q3 <= 4),
  q4 INTEGER CHECK (q4 >= 0 AND q4 <= 4),
  q5 INTEGER CHECK (q5 >= 0 AND q5 <= 8),
  q6 INTEGER CHECK (q6 >= 0 AND q6 <= 8),
  q7 INTEGER CHECK (q7 >= 0 AND q7 <= 4),
  q8 INTEGER CHECK (q8 >= 0 AND q8 <= 8),
  q9 INTEGER CHECK (q9 >= 0 AND q9 <= 8),
  q10 INTEGER CHECK (q10 >= 0 AND q10 <= 4),
  q11 INTEGER CHECK (q11 >= 0 AND q11 <= 4),
  total_score INTEGER, -- Computed by application
  severity TEXT,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BIPOLAR_CGI (Clinical Global Impressions)
-- ============================================================================
CREATE TABLE public.bipolar_cgi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  cgi_s INTEGER CHECK (cgi_s >= 0 AND cgi_s <= 7),
  cgi_i INTEGER CHECK (cgi_i >= 0 AND cgi_i <= 7),
  therapeutic_effect INTEGER CHECK (therapeutic_effect >= 0 AND therapeutic_effect <= 4),
  side_effects INTEGER CHECK (side_effects >= 0 AND side_effects <= 3),
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BIPOLAR_EGF (Echelle Globale de Fonctionnement)
-- ============================================================================
CREATE TABLE public.bipolar_egf (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  egf_score INTEGER CHECK (egf_score >= 1 AND egf_score <= 100),
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BIPOLAR_ALDA (Lithium Response Scale)
-- ============================================================================
CREATE TABLE public.bipolar_alda (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q0 INTEGER CHECK (q0 >= 0 AND q0 <= 1),
  qa INTEGER CHECK (qa >= 0 AND qa <= 10),
  qb1 INTEGER CHECK (qb1 >= 0 AND qb1 <= 2),
  qb2 INTEGER CHECK (qb2 >= 0 AND qb2 <= 2),
  qb3 INTEGER CHECK (qb3 >= 0 AND qb3 <= 2),
  qb4 INTEGER CHECK (qb4 >= 0 AND qb4 <= 2),
  qb5 INTEGER CHECK (qb5 >= 0 AND qb5 <= 2),
  score_a INTEGER,
  score_b INTEGER,
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BIPOLAR_ETAT_PATIENT (DSM-IV Symptoms)
-- ============================================================================
CREATE TABLE public.bipolar_etat_patient (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  -- Depressive symptoms
  q1 INTEGER, q1_subjective INTEGER,
  q2 INTEGER,
  q3 INTEGER, q3_type INTEGER,
  q4 INTEGER, q4_type INTEGER,
  q5 INTEGER, q5_type INTEGER,
  q6 INTEGER,
  q7 INTEGER,
  q8 INTEGER, q8_type INTEGER,
  q9 INTEGER,
  -- Manic symptoms
  q10 INTEGER,
  q11 INTEGER,
  q12 INTEGER,
  q13 INTEGER,
  q14 INTEGER,
  q15 INTEGER,
  q16 INTEGER,
  q17 INTEGER,
  q18 INTEGER,
  -- Scores
  depressive_count INTEGER,
  manic_count INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BIPOLAR_FAST (Functioning Assessment Short Test)
-- ============================================================================
CREATE TABLE public.bipolar_fast (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 INTEGER CHECK (q1 >= 0 AND q1 <= 3),
  q2 INTEGER CHECK (q2 >= 0 AND q2 <= 3),
  q3 INTEGER CHECK (q3 >= 0 AND q3 <= 3),
  q4 INTEGER CHECK (q4 >= 0 AND q4 <= 3),
  q5 INTEGER CHECK (q5 >= 0 AND q5 <= 3),
  q6 INTEGER CHECK (q6 >= 0 AND q6 <= 3),
  q7 INTEGER CHECK (q7 >= 0 AND q7 <= 3),
  q8 INTEGER CHECK (q8 >= 0 AND q8 <= 3),
  q9 INTEGER CHECK (q9 >= 0 AND q9 <= 3),
  q10 INTEGER CHECK (q10 >= 0 AND q10 <= 3),
  q11 INTEGER CHECK (q11 >= 0 AND q11 <= 3),
  q12 INTEGER CHECK (q12 >= 0 AND q12 <= 3),
  q13 INTEGER CHECK (q13 >= 0 AND q13 <= 3),
  q14 INTEGER CHECK (q14 >= 0 AND q14 <= 3),
  q15 INTEGER CHECK (q15 >= 0 AND q15 <= 3),
  q16 INTEGER CHECK (q16 >= 0 AND q16 <= 3),
  q17 INTEGER CHECK (q17 >= 0 AND q17 <= 3),
  q18 INTEGER CHECK (q18 >= 0 AND q18 <= 3),
  q19 INTEGER CHECK (q19 >= 0 AND q19 <= 3),
  q20 INTEGER CHECK (q20 >= 0 AND q20 <= 3),
  q21 INTEGER CHECK (q21 >= 0 AND q21 <= 3),
  q22 INTEGER CHECK (q22 >= 0 AND q22 <= 3),
  q23 INTEGER CHECK (q23 >= 0 AND q23 <= 3),
  q24 INTEGER CHECK (q24 >= 0 AND q24 <= 3),
  total_score INTEGER, -- Computed by application
  autonomy_score INTEGER,
  work_score INTEGER,
  cognitive_score INTEGER,
  finances_score INTEGER,
  relationships_score INTEGER,
  leisure_score INTEGER,
  severity TEXT,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================
ALTER TABLE public.bipolar_madrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bipolar_ymrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bipolar_cgi ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bipolar_egf ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bipolar_alda ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bipolar_etat_patient ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bipolar_fast ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies for all tables
-- ============================================================================

-- bipolar_madrs policies
CREATE POLICY "Patients view own bipolar_madrs" ON public.bipolar_madrs
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Professionals view all bipolar_madrs" ON public.bipolar_madrs
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));
CREATE POLICY "Professionals insert bipolar_madrs" ON public.bipolar_madrs
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));
CREATE POLICY "Professionals update bipolar_madrs" ON public.bipolar_madrs
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));

-- bipolar_ymrs policies
CREATE POLICY "Patients view own bipolar_ymrs" ON public.bipolar_ymrs
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Professionals view all bipolar_ymrs" ON public.bipolar_ymrs
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));
CREATE POLICY "Professionals insert bipolar_ymrs" ON public.bipolar_ymrs
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));
CREATE POLICY "Professionals update bipolar_ymrs" ON public.bipolar_ymrs
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));

-- bipolar_cgi policies
CREATE POLICY "Patients view own bipolar_cgi" ON public.bipolar_cgi
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Professionals view all bipolar_cgi" ON public.bipolar_cgi
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));
CREATE POLICY "Professionals insert bipolar_cgi" ON public.bipolar_cgi
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));
CREATE POLICY "Professionals update bipolar_cgi" ON public.bipolar_cgi
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));

-- bipolar_egf policies
CREATE POLICY "Patients view own bipolar_egf" ON public.bipolar_egf
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Professionals view all bipolar_egf" ON public.bipolar_egf
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));
CREATE POLICY "Professionals insert bipolar_egf" ON public.bipolar_egf
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));
CREATE POLICY "Professionals update bipolar_egf" ON public.bipolar_egf
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));

-- bipolar_alda policies
CREATE POLICY "Patients view own bipolar_alda" ON public.bipolar_alda
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Professionals view all bipolar_alda" ON public.bipolar_alda
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));
CREATE POLICY "Professionals insert bipolar_alda" ON public.bipolar_alda
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));
CREATE POLICY "Professionals update bipolar_alda" ON public.bipolar_alda
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));

-- bipolar_etat_patient policies
CREATE POLICY "Patients view own bipolar_etat_patient" ON public.bipolar_etat_patient
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Professionals view all bipolar_etat_patient" ON public.bipolar_etat_patient
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));
CREATE POLICY "Professionals insert bipolar_etat_patient" ON public.bipolar_etat_patient
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));
CREATE POLICY "Professionals update bipolar_etat_patient" ON public.bipolar_etat_patient
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));

-- bipolar_fast policies
CREATE POLICY "Patients view own bipolar_fast" ON public.bipolar_fast
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Professionals view all bipolar_fast" ON public.bipolar_fast
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));
CREATE POLICY "Professionals insert bipolar_fast" ON public.bipolar_fast
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));
CREATE POLICY "Professionals update bipolar_fast" ON public.bipolar_fast
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')));

-- ============================================================================
-- Indexes for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_bipolar_madrs_visit_id ON public.bipolar_madrs(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_madrs_patient_id ON public.bipolar_madrs(patient_id);

CREATE INDEX IF NOT EXISTS idx_bipolar_ymrs_visit_id ON public.bipolar_ymrs(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_ymrs_patient_id ON public.bipolar_ymrs(patient_id);

CREATE INDEX IF NOT EXISTS idx_bipolar_cgi_visit_id ON public.bipolar_cgi(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_cgi_patient_id ON public.bipolar_cgi(patient_id);

CREATE INDEX IF NOT EXISTS idx_bipolar_egf_visit_id ON public.bipolar_egf(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_egf_patient_id ON public.bipolar_egf(patient_id);

CREATE INDEX IF NOT EXISTS idx_bipolar_alda_visit_id ON public.bipolar_alda(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_alda_patient_id ON public.bipolar_alda(patient_id);

CREATE INDEX IF NOT EXISTS idx_bipolar_etat_patient_visit_id ON public.bipolar_etat_patient(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_etat_patient_patient_id ON public.bipolar_etat_patient(patient_id);

CREATE INDEX IF NOT EXISTS idx_bipolar_fast_visit_id ON public.bipolar_fast(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_fast_patient_id ON public.bipolar_fast(patient_id);

-- ============================================================================
-- Grant permissions to API roles
-- ============================================================================
GRANT SELECT, INSERT, UPDATE ON public.bipolar_madrs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_ymrs TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_cgi TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_egf TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_alda TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_etat_patient TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_fast TO authenticated;

GRANT ALL ON public.bipolar_madrs TO service_role;
GRANT ALL ON public.bipolar_ymrs TO service_role;
GRANT ALL ON public.bipolar_cgi TO service_role;
GRANT ALL ON public.bipolar_egf TO service_role;
GRANT ALL ON public.bipolar_alda TO service_role;
GRANT ALL ON public.bipolar_etat_patient TO service_role;
GRANT ALL ON public.bipolar_fast TO service_role;

-- ============================================================================
-- Reload PostgREST schema cache
-- ============================================================================
NOTIFY pgrst, 'reload schema';
