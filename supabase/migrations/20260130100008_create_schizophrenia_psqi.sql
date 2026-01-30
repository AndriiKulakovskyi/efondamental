-- ============================================================================
-- Migration: Create schizophrenia_psqi table
-- Description: Pittsburgh Sleep Quality Index (PSQI) questionnaire for schizophrenia
-- Reference: Buysse DJ, Reynolds CF, Monk TH, Berman SR, Kupfer DJ. Psychiatry Res. 1989
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS schizophrenia_psqi (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  
  -- Administration
  questionnaire_done TEXT CHECK (questionnaire_done IN ('Fait', 'Non fait')),
  
  -- Time inputs (HH:MM format stored as text)
  q1_bedtime TEXT,                    -- Q1: Bedtime (HH:MM)
  q2_minutes_to_sleep INTEGER,        -- Q2: Minutes to fall asleep
  q3_waketime TEXT,                   -- Q3: Wake time (HH:MM)
  q4_hours_sleep TEXT,                -- Q4: Hours actually slept (HH:MM)
  
  -- Sleep disturbances Q5a-Q5j (0-3 each)
  q5a INTEGER CHECK (q5a >= 0 AND q5a <= 3),  -- Can't fall asleep in 30 min
  q5b INTEGER CHECK (q5b >= 0 AND q5b <= 3),  -- Wake up middle of night
  q5c INTEGER CHECK (q5c >= 0 AND q5c <= 3),  -- Get up to use bathroom
  q5d INTEGER CHECK (q5d >= 0 AND q5d <= 3),  -- Cannot breathe comfortably
  q5e INTEGER CHECK (q5e >= 0 AND q5e <= 3),  -- Cough or snore loudly
  q5f INTEGER CHECK (q5f >= 0 AND q5f <= 3),  -- Feel too cold
  q5g INTEGER CHECK (q5g >= 0 AND q5g <= 3),  -- Feel too hot
  q5h INTEGER CHECK (q5h >= 0 AND q5h <= 3),  -- Bad dreams
  q5i INTEGER CHECK (q5i >= 0 AND q5i <= 3),  -- Have pain
  q5j INTEGER CHECK (q5j >= 0 AND q5j <= 3),  -- Other reasons
  q5j_text TEXT,                              -- Specify other reasons
  
  -- Quality and medication Q6-Q9 (0-3 each)
  q6 INTEGER CHECK (q6 >= 0 AND q6 <= 3),     -- Subjective sleep quality
  q7 INTEGER CHECK (q7 >= 0 AND q7 <= 3),     -- Sleep medication use
  q8 INTEGER CHECK (q8 >= 0 AND q8 <= 3),     -- Trouble staying awake
  q9 INTEGER CHECK (q9 >= 0 AND q9 <= 3),     -- Enthusiasm/motivation
  
  -- Bed partner items (not scored)
  q10 TEXT,                                   -- Share bed/room status
  q10a INTEGER CHECK (q10a >= 0 AND q10a <= 3),  -- Loud snoring
  q10b INTEGER CHECK (q10b >= 0 AND q10b <= 3),  -- Long pauses breathing
  q10c INTEGER CHECK (q10c >= 0 AND q10c <= 3),  -- Leg twitching
  q10d INTEGER CHECK (q10d >= 0 AND q10d <= 3),  -- Disorientation/confusion
  q10_autre TEXT,                             -- Other restlessness
  
  -- Component scores (0-3 each)
  c1_subjective_quality INTEGER CHECK (c1_subjective_quality >= 0 AND c1_subjective_quality <= 3),
  c2_latency INTEGER CHECK (c2_latency >= 0 AND c2_latency <= 3),
  c3_duration INTEGER CHECK (c3_duration >= 0 AND c3_duration <= 3),
  c4_efficiency INTEGER CHECK (c4_efficiency >= 0 AND c4_efficiency <= 3),
  c5_disturbances INTEGER CHECK (c5_disturbances >= 0 AND c5_disturbances <= 3),
  c6_medication INTEGER CHECK (c6_medication >= 0 AND c6_medication <= 3),
  c7_daytime_dysfunction INTEGER CHECK (c7_daytime_dysfunction >= 0 AND c7_daytime_dysfunction <= 3),
  
  -- Calculated values
  time_in_bed_hours NUMERIC,
  sleep_efficiency_pct NUMERIC,
  
  -- Total score (0-21) and interpretation
  total_score INTEGER CHECK (total_score >= 0 AND total_score <= 21),
  interpretation TEXT,
  
  -- Metadata
  completed_by UUID REFERENCES user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_schizophrenia_psqi_visit_id ON schizophrenia_psqi(visit_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_psqi_patient_id ON schizophrenia_psqi(patient_id);

-- Enable Row Level Security
ALTER TABLE schizophrenia_psqi ENABLE ROW LEVEL SECURITY;

-- Patient policies
CREATE POLICY "Patients view own PSQI responses" ON schizophrenia_psqi
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own PSQI responses" ON schizophrenia_psqi
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own PSQI responses" ON schizophrenia_psqi
  FOR UPDATE USING (auth.uid() = patient_id);

-- Professional policies
CREATE POLICY "Professionals view all PSQI responses" ON schizophrenia_psqi
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() 
    AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert PSQI responses" ON schizophrenia_psqi
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() 
    AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update PSQI responses" ON schizophrenia_psqi
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() 
    AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

-- Add trigger for updated_at
CREATE TRIGGER update_schizophrenia_psqi_updated_at
  BEFORE UPDATE ON schizophrenia_psqi
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE schizophrenia_psqi IS 'Pittsburgh Sleep Quality Index (PSQI) responses for schizophrenia patients. Global score 0-21, >5 indicates poor sleep quality.';
