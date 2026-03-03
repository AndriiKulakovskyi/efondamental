-- Migration: Add depression_thase_rush table for the Thase et Rush resistance criteria
-- in the Depression screening vertical.

CREATE TABLE IF NOT EXISTS depression_thase_rush (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  niveau_resistance INTEGER CHECK (niveau_resistance >= 1 AND niveau_resistance <= 5),
  total_score INTEGER,
  interpretation TEXT,
  completed_by UUID REFERENCES user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_depression_thase_rush_patient_id ON depression_thase_rush(patient_id);
CREATE INDEX IF NOT EXISTS idx_depression_thase_rush_visit_id ON depression_thase_rush(visit_id);

ALTER TABLE depression_thase_rush ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own depression thase rush responses" ON depression_thase_rush
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own depression thase rush responses" ON depression_thase_rush
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own depression thase rush responses" ON depression_thase_rush
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view all depression thase rush responses" ON depression_thase_rush
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert depression thase rush responses" ON depression_thase_rush
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update depression thase rush responses" ON depression_thase_rush
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

GRANT ALL ON depression_thase_rush TO authenticated;
GRANT ALL ON depression_thase_rush TO service_role;
