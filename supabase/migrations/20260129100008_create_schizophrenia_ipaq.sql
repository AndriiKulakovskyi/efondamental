-- ============================================================================
-- Migration: Create schizophrenia_ipaq table
-- IPAQ (International Physical Activity Questionnaire) Short Form
-- Schizophrenia Initial Evaluation - Autoquestionnaire Module
-- ============================================================================

-- Create the responses table
CREATE TABLE schizophrenia_ipaq (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID NOT NULL UNIQUE REFERENCES visits(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  questionnaire_done TEXT,
  
  -- Vigorous activity
  vigorous_days INTEGER CHECK (vigorous_days BETWEEN 0 AND 7),
  vigorous_hours INTEGER CHECK (vigorous_hours BETWEEN 0 AND 24),
  vigorous_minutes INTEGER CHECK (vigorous_minutes BETWEEN 0 AND 59),
  
  -- Moderate activity
  moderate_days INTEGER CHECK (moderate_days BETWEEN 0 AND 7),
  moderate_hours INTEGER CHECK (moderate_hours BETWEEN 0 AND 24),
  moderate_minutes INTEGER CHECK (moderate_minutes BETWEEN 0 AND 59),
  
  -- Walking
  walking_days INTEGER CHECK (walking_days BETWEEN 0 AND 7),
  walking_hours INTEGER CHECK (walking_hours BETWEEN 0 AND 24),
  walking_minutes INTEGER CHECK (walking_minutes BETWEEN 0 AND 59),
  walking_pace TEXT,
  
  -- Sitting time
  sitting_weekday_hours INTEGER CHECK (sitting_weekday_hours BETWEEN 0 AND 24),
  sitting_weekday_minutes INTEGER CHECK (sitting_weekday_minutes BETWEEN 0 AND 59),
  sitting_weekend_hours INTEGER CHECK (sitting_weekend_hours BETWEEN 0 AND 24),
  sitting_weekend_minutes INTEGER CHECK (sitting_weekend_minutes BETWEEN 0 AND 59),
  
  -- Computed scores
  vigorous_met_minutes NUMERIC(10,2),
  moderate_met_minutes NUMERIC(10,2),
  walking_met_minutes NUMERIC(10,2),
  total_met_minutes NUMERIC(10,2),
  activity_level TEXT CHECK (activity_level IN ('low', 'moderate', 'high')),
  sitting_weekday_total INTEGER,
  sitting_weekend_total INTEGER,
  interpretation TEXT,
  
  -- Metadata
  completed_by UUID REFERENCES user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_schizophrenia_ipaq_visit_id ON schizophrenia_ipaq(visit_id);
CREATE INDEX idx_schizophrenia_ipaq_patient_id ON schizophrenia_ipaq(patient_id);
CREATE INDEX idx_schizophrenia_ipaq_completed_at ON schizophrenia_ipaq(completed_at);

-- Enable Row Level Security
ALTER TABLE schizophrenia_ipaq ENABLE ROW LEVEL SECURITY;

-- RLS Policies for patients
CREATE POLICY "Patients view own IPAQ responses" ON schizophrenia_ipaq
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own IPAQ responses" ON schizophrenia_ipaq
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own IPAQ responses" ON schizophrenia_ipaq
  FOR UPDATE USING (auth.uid() = patient_id);

-- RLS Policies for professionals
CREATE POLICY "Professionals view all IPAQ responses" ON schizophrenia_ipaq
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() 
    AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert IPAQ responses" ON schizophrenia_ipaq
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() 
    AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update IPAQ responses" ON schizophrenia_ipaq
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() 
    AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

-- Comment on table
COMMENT ON TABLE schizophrenia_ipaq IS 'IPAQ (International Physical Activity Questionnaire) Short Form responses for schizophrenia initial evaluation. Measures physical activity across 4 domains with MET-based scoring.';
