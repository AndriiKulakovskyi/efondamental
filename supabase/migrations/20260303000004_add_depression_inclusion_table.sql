-- Migration: Add depression_inclusion table for the Inclusion criteria
-- in the Depression screening vertical.

CREATE TABLE IF NOT EXISTS depression_inclusion (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  madrs_score INTEGER CHECK (madrs_score >= 0 AND madrs_score <= 1),
  epi_depress_caract INTEGER CHECK (epi_depress_caract >= 0 AND epi_depress_caract <= 1),
  niv_2_thase_rush INTEGER CHECK (niv_2_thase_rush >= 0 AND niv_2_thase_rush <= 1),
  trou_bipol INTEGER CHECK (trou_bipol >= 0 AND trou_bipol <= 1),
  trou_compul INTEGER CHECK (trou_compul >= 0 AND trou_compul <= 1),
  trou_alim INTEGER CHECK (trou_alim >= 0 AND trou_alim <= 1),
  pat_eligible INTEGER CHECK (pat_eligible >= 0 AND pat_eligible <= 1),
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_depression_inclusion_patient_id ON depression_inclusion(patient_id);
CREATE INDEX IF NOT EXISTS idx_depression_inclusion_visit_id ON depression_inclusion(visit_id);

ALTER TABLE depression_inclusion ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own depression inclusion responses" ON depression_inclusion
  FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients insert own depression inclusion responses" ON depression_inclusion
  FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients update own depression inclusion responses" ON depression_inclusion
  FOR UPDATE USING (auth.uid() = patient_id);
CREATE POLICY "Professionals view all depression inclusion responses" ON depression_inclusion
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );
CREATE POLICY "Professionals insert depression inclusion responses" ON depression_inclusion
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );
CREATE POLICY "Professionals update depression inclusion responses" ON depression_inclusion
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

GRANT ALL ON depression_inclusion TO authenticated;
GRANT ALL ON depression_inclusion TO service_role;
