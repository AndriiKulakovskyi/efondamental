-- ============================================================================
-- Migration: Create schizophrenia_presenteisme table
-- Description: WHO-HPQ (Health and Work Performance Questionnaire) for schizophrenia
-- Reference: Kessler RC et al. J Occup Environ Med. 2003
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS schizophrenia_presenteisme (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  
  -- Administration
  questionnaire_done TEXT CHECK (questionnaire_done IN ('Fait', 'Non fait')),
  
  -- Work hours
  abs_b3 INTEGER CHECK (abs_b3 >= 0 AND abs_b3 <= 97),    -- Hours worked (7 days)
  abs_b4 INTEGER CHECK (abs_b4 >= 0 AND abs_b4 <= 97),    -- Expected weekly hours
  abs_b6 INTEGER CHECK (abs_b6 >= 0),                      -- Total hours (28 days)
  
  -- Absenteeism (days in 28-day period)
  abs_b5a INTEGER CHECK (abs_b5a >= 0 AND abs_b5a <= 28), -- Full days missed (health)
  abs_b5b INTEGER CHECK (abs_b5b >= 0 AND abs_b5b <= 28), -- Full days missed (other)
  abs_b5c INTEGER CHECK (abs_b5c >= 0 AND abs_b5c <= 28), -- Partial days missed (health)
  abs_b5d INTEGER CHECK (abs_b5d >= 0 AND abs_b5d <= 28), -- Partial days missed (other)
  abs_b5e INTEGER CHECK (abs_b5e >= 0 AND abs_b5e <= 28), -- Extra work days
  
  -- Performance ratings (0-10 scale)
  rad_abs_b9 INTEGER CHECK (rad_abs_b9 >= 0 AND rad_abs_b9 <= 10),   -- Colleague performance
  rad_abs_b10 INTEGER CHECK (rad_abs_b10 >= 0 AND rad_abs_b10 <= 10), -- Historical performance
  rad_abs_b11 INTEGER CHECK (rad_abs_b11 >= 0 AND rad_abs_b11 <= 10), -- Recent performance
  
  -- Computed scores
  absenteisme_absolu INTEGER,           -- B5a + B5c (days for health)
  absenteisme_relatif_pct NUMERIC,      -- ((B4*4) - B6) / (B4*4) * 100
  performance_relative INTEGER,          -- B11 - B9 (vs colleagues)
  perte_performance INTEGER,             -- B10 - B11 (presenteeism indicator)
  productivite_pct NUMERIC,             -- (B11/10) * 100
  interpretation TEXT,
  
  -- Metadata
  completed_by UUID REFERENCES user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_schizophrenia_presenteisme_visit_id ON schizophrenia_presenteisme(visit_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_presenteisme_patient_id ON schizophrenia_presenteisme(patient_id);

-- Enable Row Level Security
ALTER TABLE schizophrenia_presenteisme ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients view own presenteisme responses" ON schizophrenia_presenteisme
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own presenteisme responses" ON schizophrenia_presenteisme
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own presenteisme responses" ON schizophrenia_presenteisme
  FOR UPDATE USING (auth.uid() = patient_id);

-- Professional policies
CREATE POLICY "Professionals view all presenteisme responses" ON schizophrenia_presenteisme
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() 
    AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert presenteisme responses" ON schizophrenia_presenteisme
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() 
    AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update presenteisme responses" ON schizophrenia_presenteisme
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() 
    AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

-- Add trigger for updated_at
CREATE TRIGGER update_schizophrenia_presenteisme_updated_at
  BEFORE UPDATE ON schizophrenia_presenteisme
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE schizophrenia_presenteisme IS 'WHO-HPQ (Health and Work Performance Questionnaire) responses for schizophrenia patients. Measures absenteeism and presenteeism over 4 weeks.';
