-- ============================================================================
-- eFondaMental Platform - BARS (Brief Adherence Rating Scale)
-- ============================================================================
-- 3-item clinician-administered scale designed to assess medication adherence
-- in psychiatric patients. Estimates the percentage of prescribed doses taken
-- over the past month.
--
-- Scoring: ((30 - days_missed - days_reduced) / 30) x 100
-- Score range: 0-100%
--
-- Clinical interpretation:
--   91-100%: Bonne observance
--   76-90%: Observance acceptable
--   51-75%: Observance partielle
--   0-50%: Observance tres faible
--
-- Original authors: Byerly MJ, Nakonezny PA, Rush AJ (2008)
-- ============================================================================

CREATE TABLE responses_bars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Item 1: Prescribed doses per day (informational, no max)
    q1 INTEGER CHECK (q1 IS NULL OR q1 >= 0),
    
    -- Item 2: Days without treatment (0-31)
    q2 INTEGER CHECK (q2 IS NULL OR (q2 >= 0 AND q2 <= 31)),
    
    -- Item 3: Days with reduced dose (0-31)
    q3 INTEGER CHECK (q3 IS NULL OR (q3 >= 0 AND q3 <= 31)),
    
    -- Computed adherence score (0-100%)
    adherence_score INTEGER CHECK (adherence_score IS NULL OR (adherence_score >= 0 AND adherence_score <= 100)),
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE responses_bars ENABLE ROW LEVEL SECURITY;

-- Patient Policies
CREATE POLICY "Patients view own BARS" ON responses_bars FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients insert own BARS" ON responses_bars FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients update own BARS" ON responses_bars FOR UPDATE USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all BARS" ON responses_bars FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Professionals insert BARS" ON responses_bars FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Professionals update BARS" ON responses_bars FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);

-- Indexes
CREATE INDEX idx_bars_visit ON responses_bars(visit_id);
CREATE INDEX idx_bars_patient ON responses_bars(patient_id);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'BARS questionnaire table created successfully';
END $$;
