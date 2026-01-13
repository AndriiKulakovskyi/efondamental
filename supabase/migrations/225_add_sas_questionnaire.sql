-- ============================================================================
-- eFondaMental Platform - Simpson-Angus Scale (SAS)
-- ============================================================================
-- 10-item clinician-rated scale for assessing drug-induced parkinsonism
-- and extrapyramidal symptoms (EPS) associated with antipsychotic medications.
--
-- Items (each scored 0-4):
--   1. Gait (Demarche)
--   2. Arm dropping (Chute des bras)
--   3. Shoulder shaking (Mouvements passifs de l'epaule)
--   4. Elbow rigidity (Rigidite du coude)
--   5. Wrist rigidity (Rigidite du poignet)
--   6. Leg pendulousness (Mouvement pendulaire de la jambe)
--   7. Head dropping (Chute de la tete)
--   8. Glabella tap (Percussion de la glabelle)
--   9. Tremor (Tremblement)
--   10. Salivation
--
-- Score: Mean of all 10 items (0.0 - 4.0)
--
-- Original authors: Simpson GM, Angus JWS (1970)
-- ============================================================================

CREATE TABLE responses_sas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Item 1: Gait
    q1 INTEGER CHECK (q1 IS NULL OR (q1 >= 0 AND q1 <= 4)),
    
    -- Item 2: Arm dropping
    q2 INTEGER CHECK (q2 IS NULL OR (q2 >= 0 AND q2 <= 4)),
    
    -- Item 3: Shoulder shaking
    q3 INTEGER CHECK (q3 IS NULL OR (q3 >= 0 AND q3 <= 4)),
    
    -- Item 4: Elbow rigidity
    q4 INTEGER CHECK (q4 IS NULL OR (q4 >= 0 AND q4 <= 4)),
    
    -- Item 5: Wrist rigidity
    q5 INTEGER CHECK (q5 IS NULL OR (q5 >= 0 AND q5 <= 4)),
    
    -- Item 6: Leg pendulousness
    q6 INTEGER CHECK (q6 IS NULL OR (q6 >= 0 AND q6 <= 4)),
    
    -- Item 7: Head dropping
    q7 INTEGER CHECK (q7 IS NULL OR (q7 >= 0 AND q7 <= 4)),
    
    -- Item 8: Glabella tap
    q8 INTEGER CHECK (q8 IS NULL OR (q8 >= 0 AND q8 <= 4)),
    
    -- Item 9: Tremor
    q9 INTEGER CHECK (q9 IS NULL OR (q9 >= 0 AND q9 <= 4)),
    
    -- Item 10: Salivation
    q10 INTEGER CHECK (q10 IS NULL OR (q10 >= 0 AND q10 <= 4)),
    
    -- Computed scores
    mean_score DECIMAL(3,2) CHECK (mean_score IS NULL OR (mean_score >= 0 AND mean_score <= 4)),
    interpretation TEXT,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE responses_sas ENABLE ROW LEVEL SECURITY;

-- Patient Policies
CREATE POLICY "Patients view own SAS" ON responses_sas FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients insert own SAS" ON responses_sas FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients update own SAS" ON responses_sas FOR UPDATE USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all SAS" ON responses_sas FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Professionals insert SAS" ON responses_sas FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Professionals update SAS" ON responses_sas FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);

-- Indexes
CREATE INDEX idx_sas_visit ON responses_sas(visit_id);
CREATE INDEX idx_sas_patient ON responses_sas(patient_id);
