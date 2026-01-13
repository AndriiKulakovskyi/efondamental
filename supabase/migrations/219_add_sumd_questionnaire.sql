-- ============================================================================
-- eFondaMental Platform - SUMD (Scale to Assess Unawareness of Mental Disorder)
-- ============================================================================
-- Semi-structured interview assessing awareness (insight) of mental illness
-- across 9 domains:
--   - Domains 1-3: Global awareness (conscience only)
--   - Domains 4-9: Symptom-specific (conscience + attribution)
--
-- Scoring: 0-3 for each item
--   0 = Non cotable (not applicable/scorable)
--   1 = Conscient / Attribution correcte
--   2 = En partie conscient / Attribution partielle
--   3 = Inconscient / Attribution incorrecte
--
-- Key rule: If conscience = 0 or 3, attribution is automatically 0
--
-- Original authors: Amador XF, Strauss DH, Yale SA, et al. (1993)
-- ============================================================================

CREATE TABLE responses_sumd (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Domain 1: Conscience d'un trouble mental (global, no attribution)
    conscience1 INTEGER CHECK (conscience1 IS NULL OR (conscience1 >= 0 AND conscience1 <= 3)),
    
    -- Domain 2: Conscience des consequences du trouble (global, no attribution)
    conscience2 INTEGER CHECK (conscience2 IS NULL OR (conscience2 >= 0 AND conscience2 <= 3)),
    
    -- Domain 3: Conscience des effets du traitement (global, no attribution)
    conscience3 INTEGER CHECK (conscience3 IS NULL OR (conscience3 >= 0 AND conscience3 <= 3)),
    
    -- Domain 4: Conscience d'une experience hallucinatoire (+ attribution)
    conscience4 INTEGER CHECK (conscience4 IS NULL OR (conscience4 >= 0 AND conscience4 <= 3)),
    attribu4 INTEGER CHECK (attribu4 IS NULL OR (attribu4 >= 0 AND attribu4 <= 3)),
    
    -- Domain 5: Conscience du delire (+ attribution)
    conscience5 INTEGER CHECK (conscience5 IS NULL OR (conscience5 >= 0 AND conscience5 <= 3)),
    attribu5 INTEGER CHECK (attribu5 IS NULL OR (attribu5 >= 0 AND attribu5 <= 3)),
    
    -- Domain 6: Conscience d'un trouble de la pensee (+ attribution)
    conscience6 INTEGER CHECK (conscience6 IS NULL OR (conscience6 >= 0 AND conscience6 <= 3)),
    attribu6 INTEGER CHECK (attribu6 IS NULL OR (attribu6 >= 0 AND attribu6 <= 3)),
    
    -- Domain 7: Conscience d'un emoussement affectif (+ attribution)
    conscience7 INTEGER CHECK (conscience7 IS NULL OR (conscience7 >= 0 AND conscience7 <= 3)),
    attribu7 INTEGER CHECK (attribu7 IS NULL OR (attribu7 >= 0 AND attribu7 <= 3)),
    
    -- Domain 8: Conscience de l'anhedonie (+ attribution)
    conscience8 INTEGER CHECK (conscience8 IS NULL OR (conscience8 >= 0 AND conscience8 <= 3)),
    attribu8 INTEGER CHECK (attribu8 IS NULL OR (attribu8 >= 0 AND attribu8 <= 3)),
    
    -- Domain 9: Conscience de l'asociabilite (+ attribution)
    conscience9 INTEGER CHECK (conscience9 IS NULL OR (conscience9 >= 0 AND conscience9 <= 3)),
    attribu9 INTEGER CHECK (attribu9 IS NULL OR (attribu9 >= 0 AND attribu9 <= 3)),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE responses_sumd ENABLE ROW LEVEL SECURITY;

-- Patient Policies
CREATE POLICY "Patients view own SUMD" ON responses_sumd FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Patients insert own SUMD" ON responses_sumd FOR INSERT WITH CHECK (auth.uid() = patient_id);
CREATE POLICY "Patients update own SUMD" ON responses_sumd FOR UPDATE USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all SUMD" ON responses_sumd FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Professionals insert SUMD" ON responses_sumd FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);
CREATE POLICY "Professionals update SUMD" ON responses_sumd FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator'))
);

-- Indexes
CREATE INDEX idx_sumd_visit ON responses_sumd(visit_id);
CREATE INDEX idx_sumd_patient ON responses_sumd(patient_id);
