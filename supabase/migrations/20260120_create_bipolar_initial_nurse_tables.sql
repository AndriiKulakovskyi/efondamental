-- ============================================================================
-- Create Bipolar Initial Evaluation - Nurse Module Tables
-- Tables: bipolar_tobacco, bipolar_fagerstrom, bipolar_physical_params,
--         bipolar_blood_pressure, bipolar_sleep_apnea, bipolar_biological_assessment
-- ============================================================================

-- Drop existing tables to recreate with correct schema (no GENERATED columns)
DROP TABLE IF EXISTS public.bipolar_tobacco CASCADE;
DROP TABLE IF EXISTS public.bipolar_fagerstrom CASCADE;
DROP TABLE IF EXISTS public.bipolar_physical_params CASCADE;
DROP TABLE IF EXISTS public.bipolar_blood_pressure CASCADE;
DROP TABLE IF EXISTS public.bipolar_sleep_apnea CASCADE;
DROP TABLE IF EXISTS public.bipolar_biological_assessment CASCADE;

-- ============================================================================
-- BIPOLAR_TOBACCO (Tobacco Assessment)
-- ============================================================================
CREATE TABLE public.bipolar_tobacco (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  smoking_status VARCHAR(20),
  pack_years NUMERIC,
  smoking_start_age VARCHAR(10),
  smoking_end_age VARCHAR(10),
  has_substitution BOOLEAN,
  substitution_methods TEXT[],
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BIPOLAR_FAGERSTROM (Fagerstrom Test for Nicotine Dependence)
-- ============================================================================
CREATE TABLE public.bipolar_fagerstrom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  q1 INTEGER CHECK (q1 >= 0 AND q1 <= 3),
  q2 INTEGER CHECK (q2 >= 0 AND q2 <= 1),
  q3 INTEGER CHECK (q3 >= 0 AND q3 <= 1),
  q4 INTEGER CHECK (q4 >= 0 AND q4 <= 3),
  q5 INTEGER CHECK (q5 >= 0 AND q5 <= 1),
  q6 INTEGER CHECK (q6 >= 0 AND q6 <= 1),
  total_score INTEGER,
  dependence_level TEXT,
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BIPOLAR_PHYSICAL_PARAMS (Physical Parameters)
-- ============================================================================
CREATE TABLE public.bipolar_physical_params (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  height_cm NUMERIC,
  weight_kg NUMERIC,
  bmi NUMERIC, -- Computed by application: weight_kg / (height_cm/100)^2
  bmi_category TEXT,
  abdominal_circumference_cm NUMERIC,
  pregnant VARCHAR(10),
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BIPOLAR_BLOOD_PRESSURE (Blood Pressure & Heart Rate)
-- ============================================================================
CREATE TABLE public.bipolar_blood_pressure (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  bp_lying_systolic INTEGER,
  bp_lying_diastolic INTEGER,
  tension_lying VARCHAR(20),
  heart_rate_lying INTEGER,
  bp_standing_systolic INTEGER,
  bp_standing_diastolic INTEGER,
  tension_standing VARCHAR(20),
  heart_rate_standing INTEGER,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BIPOLAR_SLEEP_APNEA (Sleep Apnea - STOP-Bang)
-- ============================================================================
CREATE TABLE public.bipolar_sleep_apnea (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  diagnosed_sleep_apnea VARCHAR(10),
  has_cpap_device BOOLEAN,
  snoring BOOLEAN,
  tiredness BOOLEAN,
  observed_apnea BOOLEAN,
  hypertension BOOLEAN,
  bmi_over_35 BOOLEAN,
  age_over_50 BOOLEAN,
  large_neck BOOLEAN,
  male_gender BOOLEAN,
  stop_bang_score INTEGER,
  risk_level VARCHAR(20),
  interpretation TEXT,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BIPOLAR_BIOLOGICAL_ASSESSMENT (Bilan biologique)
-- ============================================================================
CREATE TABLE public.bipolar_biological_assessment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES public.visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  collection_date DATE,
  collection_location VARCHAR(20),
  -- Biochimie
  sodium NUMERIC,
  potassium NUMERIC,
  chlore NUMERIC,
  bicarbonates NUMERIC,
  protidemie NUMERIC,
  albumine NUMERIC,
  uree NUMERIC,
  acide_urique NUMERIC,
  creatinine NUMERIC,
  clairance_creatinine NUMERIC,
  phosphore NUMERIC,
  fer NUMERIC,
  ferritine NUMERIC,
  calcemie NUMERIC,
  calcemie_corrigee NUMERIC,
  crp NUMERIC,
  glycemie_a_jeun NUMERIC,
  glycemie_a_jeun_unit VARCHAR(10),
  hemoglobine_glyquee NUMERIC,
  -- Bilan lipidique
  hdl NUMERIC,
  hdl_unit VARCHAR(10),
  ldl NUMERIC,
  ldl_unit VARCHAR(10),
  cholesterol_total NUMERIC,
  triglycerides NUMERIC,
  rapport_total_hdl NUMERIC,
  -- Bilan hepatique
  pal NUMERIC,
  asat NUMERIC,
  alat NUMERIC,
  ggt NUMERIC,
  bilirubine_totale NUMERIC,
  bilirubine_totale_unit VARCHAR(10),
  -- Bilan thyroidien
  tsh NUMERIC,
  tsh_unit VARCHAR(10),
  t3_libre NUMERIC,
  t4_libre NUMERIC,
  -- NFS
  leucocytes NUMERIC,
  hematies NUMERIC,
  hemoglobine NUMERIC,
  hemoglobine_unit VARCHAR(10),
  hematocrite NUMERIC,
  hematocrite_unit VARCHAR(10),
  neutrophiles NUMERIC,
  basophiles NUMERIC,
  eosinophiles NUMERIC,
  lymphocytes NUMERIC,
  monocytes NUMERIC,
  vgm NUMERIC,
  tcmh NUMERIC,
  tcmh_unit VARCHAR(10),
  ccmh NUMERIC,
  ccmh_unit VARCHAR(10),
  plaquettes NUMERIC,
  -- HCG
  beta_hcg NUMERIC,
  dosage_bhcg NUMERIC,
  prolactine NUMERIC,
  prolactine_unit VARCHAR(10),
  -- Dosage psychotropes
  treatment_taken_morning BOOLEAN,
  clozapine NUMERIC,
  teralithe_type VARCHAR(10),
  lithium_plasma NUMERIC,
  lithium_erythrocyte NUMERIC,
  valproic_acid NUMERIC,
  carbamazepine NUMERIC,
  oxcarbazepine NUMERIC,
  lamotrigine NUMERIC,
  -- Vitamine D
  vitamin_d_level NUMERIC,
  outdoor_time VARCHAR(50),
  skin_phototype VARCHAR(10),
  vitamin_d_supplementation BOOLEAN,
  vitamin_d_product_name VARCHAR(20),
  vitamin_d_supplementation_date DATE,
  vitamin_d_supplementation_mode VARCHAR(20),
  vitamin_d_supplementation_dose VARCHAR(50),
  -- Serologie toxoplasmose
  toxo_serology_done BOOLEAN,
  toxo_igm_positive BOOLEAN,
  toxo_igg_positive BOOLEAN,
  toxo_igg_value NUMERIC,
  toxo_pcr_done BOOLEAN,
  toxo_pcr_positive BOOLEAN,
  -- Control fields
  on_neuroleptics BOOLEAN,
  woman_childbearing_age BOOLEAN,
  completed_by UUID REFERENCES public.user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Enable RLS on all tables
-- ============================================================================
ALTER TABLE public.bipolar_tobacco ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bipolar_fagerstrom ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bipolar_physical_params ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bipolar_blood_pressure ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bipolar_sleep_apnea ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bipolar_biological_assessment ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS Policies for all tables (same pattern)
-- ============================================================================

-- bipolar_tobacco policies
DROP POLICY IF EXISTS "Patients view own bipolar_tobacco" ON public.bipolar_tobacco;
DROP POLICY IF EXISTS "Professionals view all bipolar_tobacco" ON public.bipolar_tobacco;
DROP POLICY IF EXISTS "Professionals insert bipolar_tobacco" ON public.bipolar_tobacco;
DROP POLICY IF EXISTS "Professionals update bipolar_tobacco" ON public.bipolar_tobacco;

CREATE POLICY "Patients view own bipolar_tobacco" ON public.bipolar_tobacco
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view all bipolar_tobacco" ON public.bipolar_tobacco
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert bipolar_tobacco" ON public.bipolar_tobacco
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update bipolar_tobacco" ON public.bipolar_tobacco
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

-- bipolar_fagerstrom policies
DROP POLICY IF EXISTS "Patients view own bipolar_fagerstrom" ON public.bipolar_fagerstrom;
DROP POLICY IF EXISTS "Professionals view all bipolar_fagerstrom" ON public.bipolar_fagerstrom;
DROP POLICY IF EXISTS "Professionals insert bipolar_fagerstrom" ON public.bipolar_fagerstrom;
DROP POLICY IF EXISTS "Professionals update bipolar_fagerstrom" ON public.bipolar_fagerstrom;

CREATE POLICY "Patients view own bipolar_fagerstrom" ON public.bipolar_fagerstrom
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view all bipolar_fagerstrom" ON public.bipolar_fagerstrom
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert bipolar_fagerstrom" ON public.bipolar_fagerstrom
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update bipolar_fagerstrom" ON public.bipolar_fagerstrom
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

-- bipolar_physical_params policies
DROP POLICY IF EXISTS "Patients view own bipolar_physical_params" ON public.bipolar_physical_params;
DROP POLICY IF EXISTS "Professionals view all bipolar_physical_params" ON public.bipolar_physical_params;
DROP POLICY IF EXISTS "Professionals insert bipolar_physical_params" ON public.bipolar_physical_params;
DROP POLICY IF EXISTS "Professionals update bipolar_physical_params" ON public.bipolar_physical_params;

CREATE POLICY "Patients view own bipolar_physical_params" ON public.bipolar_physical_params
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view all bipolar_physical_params" ON public.bipolar_physical_params
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert bipolar_physical_params" ON public.bipolar_physical_params
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update bipolar_physical_params" ON public.bipolar_physical_params
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

-- bipolar_blood_pressure policies
DROP POLICY IF EXISTS "Patients view own bipolar_blood_pressure" ON public.bipolar_blood_pressure;
DROP POLICY IF EXISTS "Professionals view all bipolar_blood_pressure" ON public.bipolar_blood_pressure;
DROP POLICY IF EXISTS "Professionals insert bipolar_blood_pressure" ON public.bipolar_blood_pressure;
DROP POLICY IF EXISTS "Professionals update bipolar_blood_pressure" ON public.bipolar_blood_pressure;

CREATE POLICY "Patients view own bipolar_blood_pressure" ON public.bipolar_blood_pressure
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view all bipolar_blood_pressure" ON public.bipolar_blood_pressure
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert bipolar_blood_pressure" ON public.bipolar_blood_pressure
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update bipolar_blood_pressure" ON public.bipolar_blood_pressure
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

-- bipolar_sleep_apnea policies
DROP POLICY IF EXISTS "Patients view own bipolar_sleep_apnea" ON public.bipolar_sleep_apnea;
DROP POLICY IF EXISTS "Professionals view all bipolar_sleep_apnea" ON public.bipolar_sleep_apnea;
DROP POLICY IF EXISTS "Professionals insert bipolar_sleep_apnea" ON public.bipolar_sleep_apnea;
DROP POLICY IF EXISTS "Professionals update bipolar_sleep_apnea" ON public.bipolar_sleep_apnea;

CREATE POLICY "Patients view own bipolar_sleep_apnea" ON public.bipolar_sleep_apnea
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view all bipolar_sleep_apnea" ON public.bipolar_sleep_apnea
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert bipolar_sleep_apnea" ON public.bipolar_sleep_apnea
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update bipolar_sleep_apnea" ON public.bipolar_sleep_apnea
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

-- bipolar_biological_assessment policies
DROP POLICY IF EXISTS "Patients view own bipolar_biological_assessment" ON public.bipolar_biological_assessment;
DROP POLICY IF EXISTS "Professionals view all bipolar_biological_assessment" ON public.bipolar_biological_assessment;
DROP POLICY IF EXISTS "Professionals insert bipolar_biological_assessment" ON public.bipolar_biological_assessment;
DROP POLICY IF EXISTS "Professionals update bipolar_biological_assessment" ON public.bipolar_biological_assessment;

CREATE POLICY "Patients view own bipolar_biological_assessment" ON public.bipolar_biological_assessment
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view all bipolar_biological_assessment" ON public.bipolar_biological_assessment
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert bipolar_biological_assessment" ON public.bipolar_biological_assessment
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update bipolar_biological_assessment" ON public.bipolar_biological_assessment
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

-- ============================================================================
-- Indexes for performance
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_bipolar_tobacco_visit_id ON public.bipolar_tobacco(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_tobacco_patient_id ON public.bipolar_tobacco(patient_id);

CREATE INDEX IF NOT EXISTS idx_bipolar_fagerstrom_visit_id ON public.bipolar_fagerstrom(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_fagerstrom_patient_id ON public.bipolar_fagerstrom(patient_id);

CREATE INDEX IF NOT EXISTS idx_bipolar_physical_params_visit_id ON public.bipolar_physical_params(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_physical_params_patient_id ON public.bipolar_physical_params(patient_id);

CREATE INDEX IF NOT EXISTS idx_bipolar_blood_pressure_visit_id ON public.bipolar_blood_pressure(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_blood_pressure_patient_id ON public.bipolar_blood_pressure(patient_id);

CREATE INDEX IF NOT EXISTS idx_bipolar_sleep_apnea_visit_id ON public.bipolar_sleep_apnea(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_sleep_apnea_patient_id ON public.bipolar_sleep_apnea(patient_id);

CREATE INDEX IF NOT EXISTS idx_bipolar_biological_assessment_visit_id ON public.bipolar_biological_assessment(visit_id);
CREATE INDEX IF NOT EXISTS idx_bipolar_biological_assessment_patient_id ON public.bipolar_biological_assessment(patient_id);

-- ============================================================================
-- Grant permissions to API roles
-- ============================================================================
GRANT SELECT, INSERT, UPDATE ON public.bipolar_tobacco TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_fagerstrom TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_physical_params TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_blood_pressure TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_sleep_apnea TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.bipolar_biological_assessment TO authenticated;

GRANT ALL ON public.bipolar_tobacco TO service_role;
GRANT ALL ON public.bipolar_fagerstrom TO service_role;
GRANT ALL ON public.bipolar_physical_params TO service_role;
GRANT ALL ON public.bipolar_blood_pressure TO service_role;
GRANT ALL ON public.bipolar_sleep_apnea TO service_role;
GRANT ALL ON public.bipolar_biological_assessment TO service_role;

-- ============================================================================
-- Reload PostgREST schema cache
-- ============================================================================
NOTIFY pgrst, 'reload schema';
