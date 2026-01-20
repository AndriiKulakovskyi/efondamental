-- ============================================================================
-- Create Bipolar Screening Tables in Public Schema
-- Tables: bipolar_asrm, bipolar_qids_sr16, bipolar_mdq, bipolar_diagnostic, bipolar_orientation
-- ============================================================================

-- ============================================================================
-- BIPOLAR_ASRM (Altman Self-Rating Mania Scale)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bipolar_asrm (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 INTEGER CHECK (q1 >= 0 AND q1 <= 4),
  q2 INTEGER CHECK (q2 >= 0 AND q2 <= 4),
  q3 INTEGER CHECK (q3 >= 0 AND q3 <= 4),
  q4 INTEGER CHECK (q4 >= 0 AND q4 <= 4),
  q5 INTEGER CHECK (q5 >= 0 AND q5 <= 4),
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BIPOLAR_QIDS_SR16 (Quick Inventory of Depressive Symptomatology)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bipolar_qids_sr16 (
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
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BIPOLAR_MDQ (Mood Disorder Questionnaire)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bipolar_mdq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1_1 INTEGER CHECK (q1_1 >= 0 AND q1_1 <= 1),
  q1_2 INTEGER CHECK (q1_2 >= 0 AND q1_2 <= 1),
  q1_3 INTEGER CHECK (q1_3 >= 0 AND q1_3 <= 1),
  q1_4 INTEGER CHECK (q1_4 >= 0 AND q1_4 <= 1),
  q1_5 INTEGER CHECK (q1_5 >= 0 AND q1_5 <= 1),
  q1_6 INTEGER CHECK (q1_6 >= 0 AND q1_6 <= 1),
  q1_7 INTEGER CHECK (q1_7 >= 0 AND q1_7 <= 1),
  q1_8 INTEGER CHECK (q1_8 >= 0 AND q1_8 <= 1),
  q1_9 INTEGER CHECK (q1_9 >= 0 AND q1_9 <= 1),
  q1_10 INTEGER CHECK (q1_10 >= 0 AND q1_10 <= 1),
  q1_11 INTEGER CHECK (q1_11 >= 0 AND q1_11 <= 1),
  q1_12 INTEGER CHECK (q1_12 >= 0 AND q1_12 <= 1),
  q1_13 INTEGER CHECK (q1_13 >= 0 AND q1_13 <= 1),
  q1_score INTEGER,
  q2 INTEGER CHECK (q2 >= 0 AND q2 <= 1),
  q3 INTEGER CHECK (q3 >= 0 AND q3 <= 3),
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BIPOLAR_DIAGNOSTIC (EBIP_SCR_DIAG)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bipolar_diagnostic (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  date_recueil DATE DEFAULT CURRENT_DATE,
  diag_prealable VARCHAR(20),
  diag_evoque VARCHAR(20),
  bilan_programme VARCHAR(10),
  bilan_programme_precision VARCHAR(50),
  diag_recuse_precision VARCHAR(50),
  diag_recuse_autre_text TEXT,
  lettre_information VARCHAR(10),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BIPOLAR_ORIENTATION (EBIP_SCR_ORIENT)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bipolar_orientation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  trouble_bipolaire_ou_suspicion VARCHAR(10),
  etat_thymique_compatible VARCHAR(10),
  prise_en_charge_100_ou_accord VARCHAR(10),
  accord_evaluation_centre_expert VARCHAR(10),
  accord_transmission_cr VARCHAR(10),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================
ALTER TABLE public.bipolar_asrm ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bipolar_qids_sr16 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bipolar_mdq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bipolar_diagnostic ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bipolar_orientation ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies for bipolar_asrm
-- ============================================================================
DROP POLICY IF EXISTS "Patients view own bipolar_asrm" ON public.bipolar_asrm;
DROP POLICY IF EXISTS "Patients insert own bipolar_asrm" ON public.bipolar_asrm;
DROP POLICY IF EXISTS "Patients update own bipolar_asrm" ON public.bipolar_asrm;
DROP POLICY IF EXISTS "Professionals view all bipolar_asrm" ON public.bipolar_asrm;
DROP POLICY IF EXISTS "Professionals insert bipolar_asrm" ON public.bipolar_asrm;
DROP POLICY IF EXISTS "Professionals update bipolar_asrm" ON public.bipolar_asrm;

CREATE POLICY "Patients view own bipolar_asrm" ON public.bipolar_asrm
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own bipolar_asrm" ON public.bipolar_asrm
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own bipolar_asrm" ON public.bipolar_asrm
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view all bipolar_asrm" ON public.bipolar_asrm
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert bipolar_asrm" ON public.bipolar_asrm
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update bipolar_asrm" ON public.bipolar_asrm
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

-- ============================================================================
-- RLS Policies for bipolar_qids_sr16
-- ============================================================================
DROP POLICY IF EXISTS "Patients view own bipolar_qids_sr16" ON public.bipolar_qids_sr16;
DROP POLICY IF EXISTS "Patients insert own bipolar_qids_sr16" ON public.bipolar_qids_sr16;
DROP POLICY IF EXISTS "Patients update own bipolar_qids_sr16" ON public.bipolar_qids_sr16;
DROP POLICY IF EXISTS "Professionals view all bipolar_qids_sr16" ON public.bipolar_qids_sr16;
DROP POLICY IF EXISTS "Professionals insert bipolar_qids_sr16" ON public.bipolar_qids_sr16;
DROP POLICY IF EXISTS "Professionals update bipolar_qids_sr16" ON public.bipolar_qids_sr16;

CREATE POLICY "Patients view own bipolar_qids_sr16" ON public.bipolar_qids_sr16
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own bipolar_qids_sr16" ON public.bipolar_qids_sr16
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own bipolar_qids_sr16" ON public.bipolar_qids_sr16
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view all bipolar_qids_sr16" ON public.bipolar_qids_sr16
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert bipolar_qids_sr16" ON public.bipolar_qids_sr16
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update bipolar_qids_sr16" ON public.bipolar_qids_sr16
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

-- ============================================================================
-- RLS Policies for bipolar_mdq
-- ============================================================================
DROP POLICY IF EXISTS "Patients view own bipolar_mdq" ON public.bipolar_mdq;
DROP POLICY IF EXISTS "Patients insert own bipolar_mdq" ON public.bipolar_mdq;
DROP POLICY IF EXISTS "Patients update own bipolar_mdq" ON public.bipolar_mdq;
DROP POLICY IF EXISTS "Professionals view all bipolar_mdq" ON public.bipolar_mdq;
DROP POLICY IF EXISTS "Professionals insert bipolar_mdq" ON public.bipolar_mdq;
DROP POLICY IF EXISTS "Professionals update bipolar_mdq" ON public.bipolar_mdq;

CREATE POLICY "Patients view own bipolar_mdq" ON public.bipolar_mdq
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own bipolar_mdq" ON public.bipolar_mdq
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own bipolar_mdq" ON public.bipolar_mdq
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view all bipolar_mdq" ON public.bipolar_mdq
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert bipolar_mdq" ON public.bipolar_mdq
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update bipolar_mdq" ON public.bipolar_mdq
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

-- ============================================================================
-- RLS Policies for bipolar_diagnostic (Professional only)
-- ============================================================================
DROP POLICY IF EXISTS "Professionals view all bipolar_diagnostic" ON public.bipolar_diagnostic;
DROP POLICY IF EXISTS "Professionals insert bipolar_diagnostic" ON public.bipolar_diagnostic;
DROP POLICY IF EXISTS "Professionals update bipolar_diagnostic" ON public.bipolar_diagnostic;

CREATE POLICY "Professionals view all bipolar_diagnostic" ON public.bipolar_diagnostic
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert bipolar_diagnostic" ON public.bipolar_diagnostic
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update bipolar_diagnostic" ON public.bipolar_diagnostic
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

-- ============================================================================
-- RLS Policies for bipolar_orientation (Professional only)
-- ============================================================================
DROP POLICY IF EXISTS "Professionals view all bipolar_orientation" ON public.bipolar_orientation;
DROP POLICY IF EXISTS "Professionals insert bipolar_orientation" ON public.bipolar_orientation;
DROP POLICY IF EXISTS "Professionals update bipolar_orientation" ON public.bipolar_orientation;

CREATE POLICY "Professionals view all bipolar_orientation" ON public.bipolar_orientation
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert bipolar_orientation" ON public.bipolar_orientation
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update bipolar_orientation" ON public.bipolar_orientation
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

-- ============================================================================
-- Indexes for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_bipolar_asrm_visit_id ON public.bipolar_asrm(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_asrm_patient_id ON public.bipolar_asrm(patient_id);

CREATE INDEX IF NOT EXISTS idx_bipolar_qids_sr16_visit_id ON public.bipolar_qids_sr16(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_qids_sr16_patient_id ON public.bipolar_qids_sr16(patient_id);

CREATE INDEX IF NOT EXISTS idx_bipolar_mdq_visit_id ON public.bipolar_mdq(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_mdq_patient_id ON public.bipolar_mdq(patient_id);

CREATE INDEX IF NOT EXISTS idx_bipolar_diagnostic_visit_id ON public.bipolar_diagnostic(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_diagnostic_patient_id ON public.bipolar_diagnostic(patient_id);

CREATE INDEX IF NOT EXISTS idx_bipolar_orientation_visit_id ON public.bipolar_orientation(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_orientation_patient_id ON public.bipolar_orientation(patient_id);

-- ============================================================================
-- Grant permissions to API roles
-- ============================================================================
GRANT SELECT, INSERT, UPDATE ON public.bipolar_asrm TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_qids_sr16 TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_mdq TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_diagnostic TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_orientation TO authenticated;

GRANT SELECT, INSERT, UPDATE ON public.bipolar_asrm TO anon;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_qids_sr16 TO anon;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_mdq TO anon;

GRANT ALL ON public.bipolar_asrm TO service_role;
GRANT ALL ON public.bipolar_qids_sr16 TO service_role;
GRANT ALL ON public.bipolar_mdq TO service_role;
GRANT ALL ON public.bipolar_diagnostic TO service_role;
GRANT ALL ON public.bipolar_orientation TO service_role;

-- ============================================================================
-- Reload PostgREST schema cache
-- ============================================================================
NOTIFY pgrst, 'reload schema';
