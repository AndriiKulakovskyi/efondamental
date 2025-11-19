-- ============================================================================
-- New Questionnaire: Diagnostic (Medical Part)
-- ============================================================================
-- Code: EBIP_MED_DIAG
-- ============================================================================

CREATE TABLE responses_medical_diagnostic (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- 1. Date de recueil (default: now)
    date_recueil DATE DEFAULT CURRENT_DATE,

    -- 2. Diagnostic posé préalablement
    diag_prealable VARCHAR(50) CHECK (diag_prealable IN ('oui', 'non', 'je_ne_sais_pas')),

    -- 3. Diagnostic évoqué au terme du screening
    diag_evoque VARCHAR(50) CHECK (diag_evoque IN ('oui', 'non', 'differe')),

    -- 3.1 If diag_evoque = 'oui'
    bilan_programme VARCHAR(50) CHECK (bilan_programme IN ('oui', 'non')),
    bilan_programme_precision VARCHAR(100) CHECK (bilan_programme_precision IN (
        'diagnostic_refuse', 
        'etat_clinique_incompatible', 
        'consultation_suffisante', 
        'patient_non_disponible', 
        'refus_patient', 
        'autre'
    )),

    -- 3.2 If diag_evoque = 'non'
    diag_recuse_precision VARCHAR(100) CHECK (diag_recuse_precision IN (
        'edm_unipolaire', 
        'schizo_affectif', 
        'schizophrene', 
        'borderline', 
        'autres_troubles_personnalite', 
        'addiction', 
        'autres', 
        'ne_sais_pas'
    )),
    diag_recuse_autre_text TEXT,

    -- 4. Lettre d'information
    lettre_information VARCHAR(10) CHECK (lettre_information IN ('oui', 'non')),

    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_medical_diagnostic ENABLE ROW LEVEL SECURITY;

-- Professional Policies (Select/Insert/Update)
CREATE POLICY "Pros view medical diag" ON responses_medical_diagnostic
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Pros insert medical diag" ON responses_medical_diagnostic
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Pros update medical diag" ON responses_medical_diagnostic
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- Patient Policies (View only if needed, usually medical part is pro only, but allowing read access is often useful)
CREATE POLICY "Patients view medical diag" ON responses_medical_diagnostic
    FOR SELECT USING (auth.uid() = patient_id);

-- Trigger for updated_at
CREATE TRIGGER update_responses_medical_diagnostic_modtime 
BEFORE UPDATE ON responses_medical_diagnostic 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

