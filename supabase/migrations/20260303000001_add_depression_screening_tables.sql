-- Migration: Add depression screening tables (depression_qids_sr16, depression_madrs)
-- These tables support the Depression vertical screening visit.

-- ============================================================================
-- depression_qids_sr16
-- ============================================================================

CREATE TABLE IF NOT EXISTS depression_qids_sr16 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
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
  completed_by UUID REFERENCES user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_depression_qids_sr16_patient_id ON depression_qids_sr16(patient_id);
CREATE INDEX IF NOT EXISTS idx_depression_qids_sr16_visit_id ON depression_qids_sr16(visit_id);

ALTER TABLE depression_qids_sr16 ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own depression qids responses" ON depression_qids_sr16
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own depression qids responses" ON depression_qids_sr16
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own depression qids responses" ON depression_qids_sr16
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view all depression qids responses" ON depression_qids_sr16
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert depression qids responses" ON depression_qids_sr16
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update depression qids responses" ON depression_qids_sr16
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

GRANT ALL ON depression_qids_sr16 TO authenticated;
GRANT ALL ON depression_qids_sr16 TO service_role;

-- ============================================================================
-- depression_madrs
-- ============================================================================

CREATE TABLE IF NOT EXISTS depression_madrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
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
  total_score INTEGER,
  severity TEXT,
  interpretation TEXT,
  completed_by UUID REFERENCES user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_depression_madrs_patient_id ON depression_madrs(patient_id);
CREATE INDEX IF NOT EXISTS idx_depression_madrs_visit_id ON depression_madrs(visit_id);

ALTER TABLE depression_madrs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own depression madrs responses" ON depression_madrs
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own depression madrs responses" ON depression_madrs
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own depression madrs responses" ON depression_madrs
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view all depression madrs responses" ON depression_madrs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert depression madrs responses" ON depression_madrs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update depression madrs responses" ON depression_madrs
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

GRANT ALL ON depression_madrs TO authenticated;
GRANT ALL ON depression_madrs TO service_role;
