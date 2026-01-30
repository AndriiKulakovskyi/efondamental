-- ============================================================================
-- Migration: Create schizophrenia_ephp table
-- Description: EPHP (Échelle d'Évaluation du Handicap Psychique par l'Entourage)
-- Hetero-administered questionnaire completed by caregiver/entourage
-- ============================================================================

-- Create the schizophrenia_ephp table
CREATE TABLE IF NOT EXISTS schizophrenia_ephp (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  
  -- Administration
  questionnaire_done TEXT CHECK (questionnaire_done IN ('Fait', 'Non fait')),
  
  -- Section A: Capacités cognitives (0-6, 7=non évaluable)
  a1 INTEGER CHECK (a1 >= 0 AND a1 <= 7),
  a2 INTEGER CHECK (a2 >= 0 AND a2 <= 7),
  a3 INTEGER CHECK (a3 >= 0 AND a3 <= 7),
  a4 INTEGER CHECK (a4 >= 0 AND a4 <= 7),
  
  -- Section B: Motivation (0-6, 7=non évaluable)
  b5 INTEGER CHECK (b5 >= 0 AND b5 <= 7),
  b6 INTEGER CHECK (b6 >= 0 AND b6 <= 7),
  b7 INTEGER CHECK (b7 >= 0 AND b7 <= 7),
  b8 INTEGER CHECK (b8 >= 0 AND b8 <= 7),
  
  -- Section C: Communication (0-6, 7=non évaluable)
  c9 INTEGER CHECK (c9 >= 0 AND c9 <= 7),
  c10 INTEGER CHECK (c10 >= 0 AND c10 <= 7),
  c11 INTEGER CHECK (c11 >= 0 AND c11 <= 7),
  
  -- Section D: Auto-évaluation (0-6, 7=non évaluable)
  d12 INTEGER CHECK (d12 >= 0 AND d12 <= 7),
  d13 INTEGER CHECK (d13 >= 0 AND d13 <= 7),
  
  -- Domain subscores (calculated, excluding value 7)
  score_cognitiv INTEGER CHECK (score_cognitiv >= 0 AND score_cognitiv <= 24),
  score_motiv INTEGER CHECK (score_motiv >= 0 AND score_motiv <= 24),
  score_comm INTEGER CHECK (score_comm >= 0 AND score_comm <= 18),
  score_eval INTEGER CHECK (score_eval >= 0 AND score_eval <= 12),
  
  -- Global score (0-78, higher = better functioning)
  total_score INTEGER CHECK (total_score >= 0 AND total_score <= 78),
  interpretation TEXT,
  
  -- Metadata
  completed_by UUID REFERENCES user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_schizophrenia_ephp_visit_id 
  ON schizophrenia_ephp(visit_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_ephp_patient_id 
  ON schizophrenia_ephp(patient_id);

-- Enable RLS
ALTER TABLE schizophrenia_ephp ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients view own ephp responses" ON schizophrenia_ephp
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own ephp responses" ON schizophrenia_ephp
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own ephp responses" ON schizophrenia_ephp
  FOR UPDATE USING (auth.uid() = patient_id);

-- Professional policies
CREATE POLICY "Professionals view all ephp responses" ON schizophrenia_ephp
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

CREATE POLICY "Professionals insert ephp responses" ON schizophrenia_ephp
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

CREATE POLICY "Professionals update ephp responses" ON schizophrenia_ephp
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
  );

-- Trigger for updated_at
CREATE TRIGGER update_schizophrenia_ephp_updated_at
  BEFORE UPDATE ON schizophrenia_ephp
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
