-- ============================================================================
-- eFondaMental Platform - Schizophrenia Screening Questionnaires
-- ============================================================================
-- This migration creates response tables for the schizophrenia screening visit:
-- 1. responses_screening_sz_diagnostic - Diagnostic questionnaire (12 questions)
-- 2. responses_screening_sz_orientation - Orientation Centre Expert (4 questions)
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Schizophrenia Screening Diagnostic Questionnaire
-- ----------------------------------------------------------------------------
CREATE TABLE responses_screening_sz_diagnostic (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Q1: Date de recueil des informations (required)
    date_screening DATE NOT NULL,
    
    -- Q2: Nom du medecin evaluateur
    screening_diag_nommed VARCHAR(100),
    
    -- Q3: Diagnostic de trouble schizophrenique pose prealablement
    rad_screening_diag_sz_prealable TEXT CHECK (rad_screening_diag_sz_prealable IN ('oui', 'non', 'ne_sais_pas')),
    
    -- Q4: Si oui, preciser (conditional on Q3 = 'oui')
    rad_screening_diag_sz_prealable_preciser TEXT CHECK (rad_screening_diag_sz_prealable_preciser IN (
        'schizophrenie', 'trouble_schizophreniforme', 'trouble_schizo_affectif', 'trouble_psychotique_bref'
    )),
    
    -- Q5: Diagnostic de trouble schizophrenique evoque au terme du screening
    rad_screening_diag_sz_evoque TEXT CHECK (rad_screening_diag_sz_evoque IN ('oui', 'non', 'differe')),
    
    -- Q6: Si diagnostic recuse, preciser (conditional on Q5 = 'non')
    rad_screening_diag_nonsz TEXT CHECK (rad_screening_diag_nonsz IN (
        'borderline', 'autres_troubles_personnalite', 'trouble_bipolaire', 
        'edm_unipolaire', 'addiction', 'autres', 'ne_sais_pas'
    )),
    
    -- Q7: Preciser (conditional on Q6 = 'autres')
    screening_diag_nonsz_preciser VARCHAR(50),
    
    -- Q8: Preciser (conditional on Q5 = 'differe')
    screening_diag_differe_preciser VARCHAR(50),
    
    -- Q9: Bilan programme
    rad_screening_diag_bilan_programme TEXT CHECK (rad_screening_diag_bilan_programme IN ('oui', 'non')),
    
    -- Q10: Si non, preciser (conditional on Q9 = 'non')
    rad_screening_diag_bilan_programme_non TEXT CHECK (rad_screening_diag_bilan_programme_non IN (
        'diagnostic_recuse', 'etat_clinique_non_compatible', 'consultation_suffisante',
        'patient_non_disponible', 'refus_patient', 'autre'
    )),
    
    -- Q11: Date de l'evaluation en Centre Expert (conditional on Q9 = 'oui')
    date_screening_diag_bilan_programme DATE,
    
    -- Q12: Lettre d'information remise au patient
    rad_screening_diag_lettre_info TEXT CHECK (rad_screening_diag_lettre_info IN ('oui', 'non')),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Schizophrenia Screening Orientation Centre Expert Questionnaire
-- ----------------------------------------------------------------------------
CREATE TABLE responses_screening_sz_orientation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Q1: Patient souffrant d'un trouble evocateur d'une schizophrenie
    rad_screening_orientation_sz TEXT CHECK (rad_screening_orientation_sz IN ('oui', 'non')),
    
    -- Q2: Etat psychique compatible avec l'evaluation
    rad_screening_orientation_psychique TEXT CHECK (rad_screening_orientation_psychique IN ('oui', 'non')),
    
    -- Q3: Prise en charge a 100% ou accord du patient pour assumer les frais
    rad_screening_orientation_priseencharge TEXT CHECK (rad_screening_orientation_priseencharge IN ('oui', 'non')),
    
    -- Q4: Accord du patient pour une evaluation dans le cadre du centre expert
    rad_screening_orientation_accord_patient TEXT CHECK (rad_screening_orientation_accord_patient IN ('oui', 'non')),
    
    -- Computed eligibility: all criteria must be 'oui'
    eligibility_result BOOLEAN GENERATED ALWAYS AS (
        rad_screening_orientation_sz = 'oui' AND
        rad_screening_orientation_psychique = 'oui' AND
        rad_screening_orientation_priseencharge = 'oui' AND
        rad_screening_orientation_accord_patient = 'oui'
    ) STORED,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Row Level Security Policies
-- ----------------------------------------------------------------------------

-- Enable RLS on both tables
ALTER TABLE responses_screening_sz_diagnostic ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses_screening_sz_orientation ENABLE ROW LEVEL SECURITY;

-- Diagnostic table policies
CREATE POLICY "Patients view own screening_sz_diagnostic" 
    ON responses_screening_sz_diagnostic FOR SELECT 
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own screening_sz_diagnostic" 
    ON responses_screening_sz_diagnostic FOR INSERT 
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own screening_sz_diagnostic" 
    ON responses_screening_sz_diagnostic FOR UPDATE 
    USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view all screening_sz_diagnostic" 
    ON responses_screening_sz_diagnostic FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert screening_sz_diagnostic" 
    ON responses_screening_sz_diagnostic FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update screening_sz_diagnostic" 
    ON responses_screening_sz_diagnostic FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- Orientation table policies
CREATE POLICY "Patients view own screening_sz_orientation" 
    ON responses_screening_sz_orientation FOR SELECT 
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own screening_sz_orientation" 
    ON responses_screening_sz_orientation FOR INSERT 
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own screening_sz_orientation" 
    ON responses_screening_sz_orientation FOR UPDATE 
    USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view all screening_sz_orientation" 
    ON responses_screening_sz_orientation FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert screening_sz_orientation" 
    ON responses_screening_sz_orientation FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update screening_sz_orientation" 
    ON responses_screening_sz_orientation FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- ----------------------------------------------------------------------------
-- Indexes for performance
-- ----------------------------------------------------------------------------
CREATE INDEX idx_screening_sz_diagnostic_visit ON responses_screening_sz_diagnostic(visit_id);
CREATE INDEX idx_screening_sz_diagnostic_patient ON responses_screening_sz_diagnostic(patient_id);
CREATE INDEX idx_screening_sz_orientation_visit ON responses_screening_sz_orientation(visit_id);
CREATE INDEX idx_screening_sz_orientation_patient ON responses_screening_sz_orientation(patient_id);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Schizophrenia screening questionnaire tables created successfully';
END $$;
