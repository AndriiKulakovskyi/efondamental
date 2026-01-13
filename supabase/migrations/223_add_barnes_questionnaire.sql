-- ============================================================================
-- eFondaMental Platform - Barnes Akathisia Rating Scale
-- ============================================================================
-- 4-item clinician-rated scale for assessing drug-induced akathisia,
-- a common side effect of antipsychotic medications characterized by
-- subjective restlessness and objective motor manifestations.
--
-- Items:
--   - Item 1 (q1): Objective rating (0-3)
--   - Item 2 (q2): Awareness of agitation (0-3)
--   - Item 3 (q3): Distress related to restlessness (0-3)
--   - Item 4 (q4): Global evaluation of akathisia (0-5)
--
-- Computed scores:
--   - objective_subjective_score: Sum of items 1-3 (0-9)
--   - global_score: Direct copy of item 4 (0-5)
--
-- Original author: T. R. E. Barnes (1989)
-- ============================================================================

CREATE TABLE responses_barnes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Item 1: Objective rating (0-3)
    q1 INTEGER CHECK (q1 IS NULL OR (q1 >= 0 AND q1 <= 3)),
    
    -- Item 2: Awareness of agitation (0-3)
    q2 INTEGER CHECK (q2 IS NULL OR (q2 >= 0 AND q2 <= 3)),
    
    -- Item 3: Distress related to restlessness (0-3)
    q3 INTEGER CHECK (q3 IS NULL OR (q3 >= 0 AND q3 <= 3)),
    
    -- Item 4: Global evaluation of akathisia (0-5)
    q4 INTEGER CHECK (q4 IS NULL OR (q4 >= 0 AND q4 <= 5)),
    
    -- Computed scores
    objective_subjective_score INTEGER CHECK (objective_subjective_score IS NULL OR (objective_subjective_score >= 0 AND objective_subjective_score <= 9)),
    global_score INTEGER CHECK (global_score IS NULL OR (global_score >= 0 AND global_score <= 5)),
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE responses_barnes ENABLE ROW LEVEL SECURITY;

-- Patient Policies
CREATE POLICY "Patients view own BARNES" ON responses_barnes FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients insert own BARNES" ON responses_barnes FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients update own BARNES" ON responses_barnes FOR UPDATE USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all BARNES" ON responses_barnes FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Professionals insert BARNES" ON responses_barnes FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Professionals update BARNES" ON responses_barnes FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);

-- Indexes
CREATE INDEX idx_barnes_visit ON responses_barnes(visit_id);
CREATE INDEX idx_barnes_patient ON responses_barnes(patient_id);
