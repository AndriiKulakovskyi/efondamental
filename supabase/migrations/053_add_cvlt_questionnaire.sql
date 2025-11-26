-- eFondaMental Platform - CVLT (California Verbal Learning Test) Questionnaire
-- Version: French Adaptation (Deweer et al., 2008)
-- Type: Hetero-questionnaire (clinician-rated)

-- Create responses table for CVLT
CREATE TABLE responses_cvlt (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Demographic data (required for scoring)
    patient_age INTEGER NOT NULL CHECK (patient_age >= 16 AND patient_age <= 100),
    years_of_education INTEGER NOT NULL CHECK (years_of_education >= 0 AND years_of_education <= 30),
    patient_sex TEXT NOT NULL CHECK (patient_sex IN ('F', 'M')),
    
    -- Liste A (Lundi) - Apprentissage (Trials 1-5)
    trial_1 INTEGER NOT NULL CHECK (trial_1 >= 0 AND trial_1 <= 16),
    trial_2 INTEGER NOT NULL CHECK (trial_2 >= 0 AND trial_2 <= 16),
    trial_3 INTEGER NOT NULL CHECK (trial_3 >= 0 AND trial_3 <= 16),
    trial_4 INTEGER NOT NULL CHECK (trial_4 >= 0 AND trial_4 <= 16),
    trial_5 INTEGER NOT NULL CHECK (trial_5 >= 0 AND trial_5 <= 16),
    
    -- Total Trials 1-5 (computed)
    total_1_5 INTEGER GENERATED ALWAYS AS (trial_1 + trial_2 + trial_3 + trial_4 + trial_5) STORED,
    
    -- Liste B (Mardi) - Interference
    list_b INTEGER NOT NULL CHECK (list_b >= 0 AND list_b <= 16),
    
    -- Rappel a Court Terme (Short-term recall)
    sdfr INTEGER NOT NULL CHECK (sdfr >= 0 AND sdfr <= 16), -- Short Delay Free Recall
    sdcr INTEGER NOT NULL CHECK (sdcr >= 0 AND sdcr <= 16), -- Short Delay Cued Recall
    
    -- Rappel a Long Terme (Long-term recall, 20 min)
    ldfr INTEGER NOT NULL CHECK (ldfr >= 0 AND ldfr <= 16), -- Long Delay Free Recall
    ldcr INTEGER NOT NULL CHECK (ldcr >= 0 AND ldcr <= 16), -- Long Delay Cued Recall
    
    -- Indices de Strategie (optional)
    semantic_clustering DECIMAL(5,2),   -- Indice de regroupement semantique
    serial_clustering DECIMAL(5,2),     -- Indice de regroupement seriel
    
    -- Erreurs (optional)
    perseverations INTEGER CHECK (perseverations >= 0),
    intrusions INTEGER CHECK (intrusions >= 0),
    
    -- Recognition (optional, for extended version)
    recognition_hits INTEGER CHECK (recognition_hits >= 0 AND recognition_hits <= 16),
    false_positives INTEGER CHECK (false_positives >= 0),
    discriminability DECIMAL(5,2) CHECK (discriminability >= 0 AND discriminability <= 100),
    
    -- Region Effects (optional)
    primacy DECIMAL(5,2),
    recency DECIMAL(5,2),
    
    -- Response Bias (optional)
    response_bias DECIMAL(5,3),
    
    -- Computed Standard Scores (stored after calculation)
    trial_1_std DECIMAL(6,2),
    trial_5_std TEXT, -- Can be numeric or centile range
    total_1_5_std DECIMAL(6,2),
    list_b_std DECIMAL(6,2),
    sdfr_std TEXT, -- Can be numeric or centile range
    sdcr_std TEXT, -- Can be numeric or centile range
    ldfr_std TEXT, -- Can be numeric or centile range
    ldcr_std TEXT, -- Can be numeric or centile range
    semantic_std TEXT, -- Can be numeric or centile range
    serial_std TEXT, -- Centile range only
    persev_std TEXT, -- Centile range only
    intru_std TEXT, -- Centile range only
    recog_std TEXT, -- Centile range only
    false_recog_std TEXT, -- Centile range only
    discrim_std TEXT, -- Centile range only
    primacy_std DECIMAL(6,2),
    recency_std DECIMAL(6,2),
    bias_std DECIMAL(6,2),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_cvlt ENABLE ROW LEVEL SECURITY;

-- Professional Policies (SELECT, INSERT, UPDATE)
CREATE POLICY "Professionals can view CVLT responses"
ON responses_cvlt FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid()
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

CREATE POLICY "Professionals can insert CVLT responses"
ON responses_cvlt FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid()
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

CREATE POLICY "Professionals can update CVLT responses"
ON responses_cvlt FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid()
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Create indexes for performance
CREATE INDEX idx_responses_cvlt_visit_id ON responses_cvlt(visit_id);
CREATE INDEX idx_responses_cvlt_patient_id ON responses_cvlt(patient_id);

-- Add trigger for updated_at
CREATE TRIGGER update_responses_cvlt_updated_at
    BEFORE UPDATE ON responses_cvlt
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment
COMMENT ON TABLE responses_cvlt IS 'Responses for California Verbal Learning Test (CVLT) - French Adaptation';

