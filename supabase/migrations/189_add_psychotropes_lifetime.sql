-- eFondaMental Platform - Psychotropes Lifetime Questionnaire
-- Stores psychiatric medication history for 6 treatment categories

-- ============================================================================
-- Create Psychotropes Lifetime Response Table
-- ============================================================================

CREATE TABLE responses_psychotropes_lifetime (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL UNIQUE,
    
    -- Collection date
    collection_date DATE,
    
    -- Category 1: Antidepresseur
    antidepresseur_status VARCHAR(15) CHECK (antidepresseur_status IN ('yes', 'no', 'unknown')),
    antidepresseur_start_date DATE,
    antidepresseur_months INTEGER CHECK (antidepresseur_months >= 0),
    
    -- Category 2: Neuroleptique classique
    neuroleptique_status VARCHAR(15) CHECK (neuroleptique_status IN ('yes', 'no', 'unknown')),
    neuroleptique_start_date DATE,
    neuroleptique_months INTEGER CHECK (neuroleptique_months >= 0),
    
    -- Category 3: Antipsychotique atypique
    antipsychotique_status VARCHAR(15) CHECK (antipsychotique_status IN ('yes', 'no', 'unknown')),
    antipsychotique_start_date DATE,
    antipsychotique_months INTEGER CHECK (antipsychotique_months >= 0),
    
    -- Category 4: Benzodiazepine / Hypnotique / Anxiolytique
    benzodiazepine_status VARCHAR(15) CHECK (benzodiazepine_status IN ('yes', 'no', 'unknown')),
    benzodiazepine_start_date DATE,
    benzodiazepine_months INTEGER CHECK (benzodiazepine_months >= 0),
    
    -- Category 5: Lithium
    lithium_status VARCHAR(15) CHECK (lithium_status IN ('yes', 'no', 'unknown')),
    lithium_start_date DATE,
    lithium_months INTEGER CHECK (lithium_months >= 0),
    
    -- Category 6: Thymoregulateur AC
    thymoregulateur_status VARCHAR(15) CHECK (thymoregulateur_status IN ('yes', 'no', 'unknown')),
    thymoregulateur_start_date DATE,
    thymoregulateur_months INTEGER CHECK (thymoregulateur_months >= 0),
    
    -- Metadata
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- Create Indexes
-- ============================================================================

CREATE INDEX idx_responses_psychotropes_lifetime_patient ON responses_psychotropes_lifetime(patient_id);
CREATE INDEX idx_responses_psychotropes_lifetime_completed ON responses_psychotropes_lifetime(completed_at);

-- ============================================================================
-- Enable Row Level Security
-- ============================================================================

ALTER TABLE responses_psychotropes_lifetime ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Create RLS Policies
-- ============================================================================

-- Patient Policies
CREATE POLICY "Patients view own psychotropes lifetime"
    ON responses_psychotropes_lifetime FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own psychotropes lifetime"
    ON responses_psychotropes_lifetime FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own psychotropes lifetime"
    ON responses_psychotropes_lifetime FOR UPDATE
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all psychotropes lifetime"
    ON responses_psychotropes_lifetime FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert psychotropes lifetime"
    ON responses_psychotropes_lifetime FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update psychotropes lifetime"
    ON responses_psychotropes_lifetime FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- ============================================================================
-- Add Comments
-- ============================================================================

COMMENT ON TABLE responses_psychotropes_lifetime IS 'Traitements psychotropes lifetime - Psychiatric medication history questionnaire';
COMMENT ON COLUMN responses_psychotropes_lifetime.collection_date IS 'Date de recueil des informations';
COMMENT ON COLUMN responses_psychotropes_lifetime.antidepresseur_status IS 'Antidepressant treatment status (yes/no/unknown)';
COMMENT ON COLUMN responses_psychotropes_lifetime.antidepresseur_start_date IS 'Antidepressant treatment start date';
COMMENT ON COLUMN responses_psychotropes_lifetime.antidepresseur_months IS 'Cumulative months of antidepressant exposure';
COMMENT ON COLUMN responses_psychotropes_lifetime.neuroleptique_status IS 'Classic neuroleptic treatment status (yes/no/unknown)';
COMMENT ON COLUMN responses_psychotropes_lifetime.neuroleptique_start_date IS 'Classic neuroleptic treatment start date';
COMMENT ON COLUMN responses_psychotropes_lifetime.neuroleptique_months IS 'Cumulative months of classic neuroleptic exposure';
COMMENT ON COLUMN responses_psychotropes_lifetime.antipsychotique_status IS 'Atypical antipsychotic treatment status (yes/no/unknown)';
COMMENT ON COLUMN responses_psychotropes_lifetime.antipsychotique_start_date IS 'Atypical antipsychotic treatment start date';
COMMENT ON COLUMN responses_psychotropes_lifetime.antipsychotique_months IS 'Cumulative months of atypical antipsychotic exposure';
COMMENT ON COLUMN responses_psychotropes_lifetime.benzodiazepine_status IS 'Benzodiazepine/Hypnotic/Anxiolytic treatment status (yes/no/unknown)';
COMMENT ON COLUMN responses_psychotropes_lifetime.benzodiazepine_start_date IS 'Benzodiazepine treatment start date';
COMMENT ON COLUMN responses_psychotropes_lifetime.benzodiazepine_months IS 'Cumulative months of benzodiazepine exposure';
COMMENT ON COLUMN responses_psychotropes_lifetime.lithium_status IS 'Lithium treatment status (yes/no/unknown)';
COMMENT ON COLUMN responses_psychotropes_lifetime.lithium_start_date IS 'Lithium treatment start date';
COMMENT ON COLUMN responses_psychotropes_lifetime.lithium_months IS 'Cumulative months of lithium exposure';
COMMENT ON COLUMN responses_psychotropes_lifetime.thymoregulateur_status IS 'Mood stabilizer AC treatment status (yes/no/unknown)';
COMMENT ON COLUMN responses_psychotropes_lifetime.thymoregulateur_start_date IS 'Mood stabilizer AC treatment start date';
COMMENT ON COLUMN responses_psychotropes_lifetime.thymoregulateur_months IS 'Cumulative months of mood stabilizer AC exposure';

