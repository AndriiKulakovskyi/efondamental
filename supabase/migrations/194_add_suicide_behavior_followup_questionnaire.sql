-- Migration: Add Suicide Behavior Follow-up Questionnaire
-- This questionnaire is specifically for biannual follow-up visits
-- It is distinct from the full Suicide History questionnaire used in initial/annual evaluations

-- Create the responses table
CREATE TABLE responses_suicide_behavior_followup (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Q1: Self-harm behavior
    q1_self_harm INTEGER CHECK (q1_self_harm IN (0, 1)),
    
    -- Q2: Interrupted attempt
    q2_interrupted INTEGER CHECK (q2_interrupted IN (0, 1)),
    q2_1_interrupted_count INTEGER CHECK (q2_1_interrupted_count >= 0),
    
    -- Q3: Aborted attempt
    q3_aborted INTEGER CHECK (q3_aborted IN (0, 1)),
    q3_1_aborted_count INTEGER CHECK (q3_1_aborted_count >= 0),
    
    -- Q4: Preparations
    q4_preparations INTEGER CHECK (q4_preparations IN (0, 1)),
    
    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_suicide_behavior_followup ENABLE ROW LEVEL SECURITY;

-- Patient Policies
CREATE POLICY "Patients view own suicide behavior followup" 
ON responses_suicide_behavior_followup FOR SELECT 
USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own suicide behavior followup" 
ON responses_suicide_behavior_followup FOR INSERT 
WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own suicide behavior followup" 
ON responses_suicide_behavior_followup FOR UPDATE 
USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Pros view all suicide behavior followup" 
ON responses_suicide_behavior_followup FOR SELECT 
USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);

CREATE POLICY "Pros insert suicide behavior followup" 
ON responses_suicide_behavior_followup FOR INSERT 
WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);

CREATE POLICY "Pros update suicide behavior followup" 
ON responses_suicide_behavior_followup FOR UPDATE 
USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);

-- Create index for faster lookups
CREATE INDEX idx_responses_suicide_behavior_followup_visit_id ON responses_suicide_behavior_followup(visit_id);
CREATE INDEX idx_responses_suicide_behavior_followup_patient_id ON responses_suicide_behavior_followup(patient_id);

