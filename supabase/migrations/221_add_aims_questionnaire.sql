-- ============================================================================
-- eFondaMental Platform - AIMS (Abnormal Involuntary Movement Scale)
-- ============================================================================
-- 12-item clinician-rated scale for assessing tardive dyskinesia and other
-- abnormal involuntary movements associated with antipsychotic medications.
--
-- Sections:
--   - Orofacial movements (items 1-4): 0-4 scale
--   - Extremity movements (items 5-6): 0-4 scale
--   - Trunk movements (item 7): 0-4 scale
--   - Global judgments (items 8-10): 0-4 scale
--   - Dental status (items 11-12): binary (0=Yes, 1=No)
--
-- Movement subscale score = sum of items 1-7 (range 0-28)
--
-- Source: National Institute of Mental Health (NIMH), 1976
-- ============================================================================

CREATE TABLE responses_aims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Orofacial movements (items 1-4)
    q1 INTEGER CHECK (q1 IS NULL OR (q1 >= 0 AND q1 <= 4)),  -- Facial muscles
    q2 INTEGER CHECK (q2 IS NULL OR (q2 >= 0 AND q2 <= 4)),  -- Lips/perioral
    q3 INTEGER CHECK (q3 IS NULL OR (q3 >= 0 AND q3 <= 4)),  -- Jaw
    q4 INTEGER CHECK (q4 IS NULL OR (q4 >= 0 AND q4 <= 4)),  -- Tongue
    
    -- Extremity movements (items 5-6)
    q5 INTEGER CHECK (q5 IS NULL OR (q5 >= 0 AND q5 <= 4)),  -- Upper limbs
    q6 INTEGER CHECK (q6 IS NULL OR (q6 >= 0 AND q6 <= 4)),  -- Lower limbs
    
    -- Trunk movements (item 7)
    q7 INTEGER CHECK (q7 IS NULL OR (q7 >= 0 AND q7 <= 4)),  -- Neck/shoulders/hips
    
    -- Global judgments (items 8-10)
    q8 INTEGER CHECK (q8 IS NULL OR (q8 >= 0 AND q8 <= 4)),  -- Severity
    q9 INTEGER CHECK (q9 IS NULL OR (q9 >= 0 AND q9 <= 4)),  -- Incapacitation
    q10 INTEGER CHECK (q10 IS NULL OR (q10 >= 0 AND q10 <= 4)), -- Patient awareness
    
    -- Dental status (items 11-12) - binary: 0=Yes, 1=No
    q11 INTEGER CHECK (q11 IS NULL OR (q11 >= 0 AND q11 <= 1)), -- Current dental problems
    q12 INTEGER CHECK (q12 IS NULL OR (q12 >= 0 AND q12 <= 1)), -- Wears dentures
    
    -- Computed scores
    movement_score INTEGER CHECK (movement_score IS NULL OR (movement_score >= 0 AND movement_score <= 28)),
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE responses_aims ENABLE ROW LEVEL SECURITY;

-- Patient Policies
CREATE POLICY "Patients view own AIMS" ON responses_aims FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients insert own AIMS" ON responses_aims FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients update own AIMS" ON responses_aims FOR UPDATE USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all AIMS" ON responses_aims FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Professionals insert AIMS" ON responses_aims FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Professionals update AIMS" ON responses_aims FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);

-- Indexes
CREATE INDEX idx_aims_visit ON responses_aims(visit_id);
CREATE INDEX idx_aims_patient ON responses_aims(patient_id);
