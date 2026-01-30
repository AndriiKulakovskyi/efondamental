-- ============================================================================
-- Migration: Create schizophrenia_fagerstrom table
-- Description: FTND (Fagerström Test for Nicotine Dependence) for schizophrenia
-- ============================================================================

-- Create the schizophrenia_fagerstrom table
CREATE TABLE IF NOT EXISTS schizophrenia_fagerstrom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  
  -- Administration
  questionnaire_done TEXT CHECK (questionnaire_done IN ('Fait', 'Non fait')),
  
  -- Scored items (6 items)
  -- Q1: Time to first cigarette (0-3 pts)
  q1 INTEGER CHECK (q1 >= 0 AND q1 <= 3),
  -- Q2: Difficulty abstaining (0-1 pt)
  q2 INTEGER CHECK (q2 >= 0 AND q2 <= 1),
  -- Q3: Hardest cigarette to give up (0-1 pt)
  q3 INTEGER CHECK (q3 >= 0 AND q3 <= 1),
  -- Q4: Cigarettes per day (0-3 pts)
  q4 INTEGER CHECK (q4 >= 0 AND q4 <= 3),
  -- Q5: Heavier smoking in morning (0-1 pt)
  q5 INTEGER CHECK (q5 >= 0 AND q5 <= 1),
  -- Q6: Smoke when ill (0-1 pt)
  q6 INTEGER CHECK (q6 >= 0 AND q6 <= 1),
  
  -- Computed scores
  total_score INTEGER CHECK (total_score >= 0 AND total_score <= 10),
  hsi_score INTEGER CHECK (hsi_score >= 0 AND hsi_score <= 6),
  dependence_level TEXT,
  treatment_guidance TEXT,
  interpretation TEXT,
  
  -- Metadata
  completed_by UUID REFERENCES user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_schizophrenia_fagerstrom_visit_id 
  ON schizophrenia_fagerstrom(visit_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_fagerstrom_patient_id 
  ON schizophrenia_fagerstrom(patient_id);

-- Enable RLS
ALTER TABLE schizophrenia_fagerstrom ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients view own fagerstrom responses" ON schizophrenia_fagerstrom
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own fagerstrom responses" ON schizophrenia_fagerstrom
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own fagerstrom responses" ON schizophrenia_fagerstrom
  FOR UPDATE USING (auth.uid() = patient_id);

-- Professional policies
CREATE POLICY "Professionals view all fagerstrom responses" ON schizophrenia_fagerstrom
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

CREATE POLICY "Professionals insert fagerstrom responses" ON schizophrenia_fagerstrom
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

CREATE POLICY "Professionals update fagerstrom responses" ON schizophrenia_fagerstrom
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_schizophrenia_fagerstrom_updated_at
  BEFORE UPDATE ON schizophrenia_fagerstrom
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
