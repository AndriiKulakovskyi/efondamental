-- ============================================================================
-- eFondaMental Platform - CDSS (Calgary Depression Scale for Schizophrenia)
-- ============================================================================
-- This migration creates the response table for the CDSS questionnaire
-- used in schizophrenia initial evaluation visits (Hetero-questionnaires module).
--
-- CDSS is a 9-item clinician-rated scale specifically designed to assess
-- depression in schizophrenia patients, distinguishing depressive symptoms
-- from negative symptoms and extrapyramidal side effects.
--
-- All items are rated on a 0-3 scale:
--   0 = Absent, 1 = Mild, 2 = Moderate, 3 = Severe
-- Total score range: 0-27
-- Clinical cutoff: >6 indicates presence of depressive syndrome
--
-- Original authors: Addington D, Addington J (1990)
-- French translation: Bernard D, Lancon C, Auquier P (1998)
-- ============================================================================

CREATE TABLE responses_cdss (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Item 1: Depression
    q1 INTEGER CHECK (q1 IS NULL OR (q1 >= 0 AND q1 <= 3)),
    
    -- Item 2: Hopelessness
    q2 INTEGER CHECK (q2 IS NULL OR (q2 >= 0 AND q2 <= 3)),
    
    -- Item 3: Self-depreciation
    q3 INTEGER CHECK (q3 IS NULL OR (q3 >= 0 AND q3 <= 3)),
    
    -- Item 4: Guilty ideas of reference
    q4 INTEGER CHECK (q4 IS NULL OR (q4 >= 0 AND q4 <= 3)),
    
    -- Item 5: Pathological guilt
    q5 INTEGER CHECK (q5 IS NULL OR (q5 >= 0 AND q5 <= 3)),
    
    -- Item 6: Morning depression
    q6 INTEGER CHECK (q6 IS NULL OR (q6 >= 0 AND q6 <= 3)),
    
    -- Item 7: Early wakening
    q7 INTEGER CHECK (q7 IS NULL OR (q7 >= 0 AND q7 <= 3)),
    
    -- Item 8: Suicide
    q8 INTEGER CHECK (q8 IS NULL OR (q8 >= 0 AND q8 <= 3)),
    
    -- Item 9: Observed depression
    q9 INTEGER CHECK (q9 IS NULL OR (q9 >= 0 AND q9 <= 3)),
    
    -- Computed total score (0-27)
    total_score INTEGER CHECK (total_score IS NULL OR (total_score >= 0 AND total_score <= 27)),
    
    -- Clinical interpretation
    has_depressive_syndrome BOOLEAN,
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE responses_cdss ENABLE ROW LEVEL SECURITY;

-- Patient Policies
CREATE POLICY "Patients view own CDSS" ON responses_cdss FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients insert own CDSS" ON responses_cdss FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients update own CDSS" ON responses_cdss FOR UPDATE USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all CDSS" ON responses_cdss FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Professionals insert CDSS" ON responses_cdss FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Professionals update CDSS" ON responses_cdss FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);

-- Indexes
CREATE INDEX idx_cdss_visit ON responses_cdss(visit_id);
CREATE INDEX idx_cdss_patient ON responses_cdss(patient_id);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'CDSS questionnaire table created successfully';
END $$;
