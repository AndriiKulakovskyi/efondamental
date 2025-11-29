-- ============================================================================
-- eFondaMental Platform - WAIS-III Vocabulaire Questionnaire Migration
-- ============================================================================
-- This migration creates the table for WAIS-III Vocabulaire subtest
-- Part of the Neuropsychological Evaluation module
-- ============================================================================

-- Create WAIS-III Vocabulaire table
CREATE TABLE responses_wais3_vocabulaire (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Item scores (0-2 for each item)
    item1 INTEGER NOT NULL CHECK (item1 BETWEEN 0 AND 2),  -- Bateau
    item2 INTEGER NOT NULL CHECK (item2 BETWEEN 0 AND 2),  -- Fauteuil
    item3 INTEGER NOT NULL CHECK (item3 BETWEEN 0 AND 2),  -- Bol
    item4 INTEGER NOT NULL CHECK (item4 BETWEEN 0 AND 2),  -- Instruire
    item5 INTEGER NOT NULL CHECK (item5 BETWEEN 0 AND 2),  -- Hier
    item6 INTEGER NOT NULL CHECK (item6 BETWEEN 0 AND 2),  -- Arracher
    item7 INTEGER NOT NULL CHECK (item7 BETWEEN 0 AND 2),  -- Sanction
    item8 INTEGER NOT NULL CHECK (item8 BETWEEN 0 AND 2),  -- Refuge
    item9 INTEGER NOT NULL CHECK (item9 BETWEEN 0 AND 2),  -- Calendrier
    item10 INTEGER NOT NULL CHECK (item10 BETWEEN 0 AND 2), -- Baleine
    item11 INTEGER NOT NULL CHECK (item11 BETWEEN 0 AND 2), -- Mime
    item12 INTEGER NOT NULL CHECK (item12 BETWEEN 0 AND 2), -- Persévérer
    item13 INTEGER NOT NULL CHECK (item13 BETWEEN 0 AND 2), -- Sauvage
    item14 INTEGER NOT NULL CHECK (item14 BETWEEN 0 AND 2), -- Héréditaire
    item15 INTEGER NOT NULL CHECK (item15 BETWEEN 0 AND 2), -- Connivence
    item16 INTEGER NOT NULL CHECK (item16 BETWEEN 0 AND 2), -- Grandiose
    item17 INTEGER NOT NULL CHECK (item17 BETWEEN 0 AND 2), -- Confier
    item18 INTEGER NOT NULL CHECK (item18 BETWEEN 0 AND 2), -- Vigoureux
    item19 INTEGER NOT NULL CHECK (item19 BETWEEN 0 AND 2), -- Contracter
    item20 INTEGER NOT NULL CHECK (item20 BETWEEN 0 AND 2), -- Initiative
    item21 INTEGER NOT NULL CHECK (item21 BETWEEN 0 AND 2), -- Esquisse
    item22 INTEGER NOT NULL CHECK (item22 BETWEEN 0 AND 2), -- Irritable
    item23 INTEGER NOT NULL CHECK (item23 BETWEEN 0 AND 2), -- Invectiver
    item24 INTEGER NOT NULL CHECK (item24 BETWEEN 0 AND 2), -- Hétérogène
    item25 INTEGER NOT NULL CHECK (item25 BETWEEN 0 AND 2), -- Assimiler
    item26 INTEGER NOT NULL CHECK (item26 BETWEEN 0 AND 2), -- Concertation
    item27 INTEGER NOT NULL CHECK (item27 BETWEEN 0 AND 2), -- Emulation
    item28 INTEGER NOT NULL CHECK (item28 BETWEEN 0 AND 2), -- Pittoresque
    item29 INTEGER NOT NULL CHECK (item29 BETWEEN 0 AND 2), -- Evasif
    item30 INTEGER NOT NULL CHECK (item30 BETWEEN 0 AND 2), -- Elaborer
    item31 INTEGER NOT NULL CHECK (item31 BETWEEN 0 AND 2), -- Prosaïque
    item32 INTEGER NOT NULL CHECK (item32 BETWEEN 0 AND 2), -- Apologie
    item33 INTEGER NOT NULL CHECK (item33 BETWEEN 0 AND 2), -- Conjecture
    
    -- Total raw score (computed)
    total_raw_score INTEGER GENERATED ALWAYS AS (
        item1 + item2 + item3 + item4 + item5 + item6 + item7 + item8 + item9 + item10 +
        item11 + item12 + item13 + item14 + item15 + item16 + item17 + item18 + item19 + item20 +
        item21 + item22 + item23 + item24 + item25 + item26 + item27 + item28 + item29 + item30 +
        item31 + item32 + item33
    ) STORED,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_wais3_vocabulaire_visit ON responses_wais3_vocabulaire(visit_id);
CREATE INDEX idx_responses_wais3_vocabulaire_patient ON responses_wais3_vocabulaire(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_wais3_vocabulaire ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own WAIS-3 vocabulaire" 
ON responses_wais3_vocabulaire FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all WAIS-3 vocabulaire" 
ON responses_wais3_vocabulaire FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert WAIS-3 vocabulaire" 
ON responses_wais3_vocabulaire FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update WAIS-3 vocabulaire" 
ON responses_wais3_vocabulaire FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- ============================================================================
-- Trigger for updated_at
-- ============================================================================

CREATE TRIGGER update_responses_wais3_vocabulaire_updated_at
    BEFORE UPDATE ON responses_wais3_vocabulaire
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

