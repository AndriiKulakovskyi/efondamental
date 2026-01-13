-- ============================================================================
-- eFondaMental Platform - Personal and Social Performance Scale (PSP)
-- ============================================================================
-- Clinician-rated scale assessing personal and social functioning in patients
-- with schizophrenia across 4 main domains. Provides a global score from 1-100.
--
-- Domains:
--   (a) Socially useful activities (work, studies)
--   (b) Personal and social relationships
--   (c) Self-care (hygiene, appearance)
--   (d) Disturbing and aggressive behaviors
--
-- Each domain rated: Absent, Leger, Manifeste, Marque, Severe, Tres severe
-- Final score: 1-100 (clinician-determined based on 3-step process)
--
-- Original authors: Morosini PL, Magliano L, Brambilla L, Ugolini S, Pioli R (2000)
-- ============================================================================

CREATE TABLE responses_psp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Domain (a): Socially useful activities
    domain_a TEXT CHECK (domain_a IS NULL OR domain_a IN ('Absent', 'Leger', 'Manifeste', 'Marque', 'Severe', 'Tres_severe')),
    
    -- Domain (b): Personal and social relationships
    domain_b TEXT CHECK (domain_b IS NULL OR domain_b IN ('Absent', 'Leger', 'Manifeste', 'Marque', 'Severe', 'Tres_severe')),
    
    -- Domain (c): Self-care
    domain_c TEXT CHECK (domain_c IS NULL OR domain_c IN ('Absent', 'Leger', 'Manifeste', 'Marque', 'Severe', 'Tres_severe')),
    
    -- Domain (d): Disturbing and aggressive behaviors
    domain_d TEXT CHECK (domain_d IS NULL OR domain_d IN ('Absent', 'Leger', 'Manifeste', 'Marque', 'Severe', 'Tres_severe')),
    
    -- Step 2: 10-point interval selection (1-10 representing score ranges)
    interval_selection INTEGER CHECK (interval_selection IS NULL OR (interval_selection >= 1 AND interval_selection <= 10)),
    
    -- Step 3: Final score (1-100)
    final_score INTEGER CHECK (final_score IS NULL OR (final_score >= 1 AND final_score <= 100)),
    
    -- Computed interpretation
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE responses_psp ENABLE ROW LEVEL SECURITY;

-- Patient Policies
CREATE POLICY "Patients view own PSP" ON responses_psp FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients insert own PSP" ON responses_psp FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients update own PSP" ON responses_psp FOR UPDATE USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all PSP" ON responses_psp FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Professionals insert PSP" ON responses_psp FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Professionals update PSP" ON responses_psp FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);

-- Indexes
CREATE INDEX idx_psp_visit ON responses_psp(visit_id);
CREATE INDEX idx_psp_patient ON responses_psp(patient_id);
