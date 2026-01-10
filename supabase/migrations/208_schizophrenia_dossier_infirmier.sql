-- ============================================================================
-- eFondaMental Platform - Schizophrenia Dossier Infirmier Questionnaire
-- ============================================================================
-- This migration creates the response table for the "Dossier infirmier" 
-- questionnaire used in schizophrenia initial evaluation visits.
-- Captures physical parameters, blood pressure, and ECG data.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Dossier Infirmier Response Table
-- ----------------------------------------------------------------------------
CREATE TABLE responses_dossier_infirmier_sz (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- ========================================================================
    -- Section 1: Physical Parameters (Parametres physiques)
    -- ========================================================================
    
    -- Height in cm
    taille NUMERIC(5,1) CHECK (taille IS NULL OR (taille >= 50 AND taille <= 250)),
    
    -- Weight in kg
    poids NUMERIC(5,1) CHECK (poids IS NULL OR (poids >= 20 AND poids <= 300)),
    
    -- BMI - computed from taille and poids
    -- Formula: poids / (taille/100)^2
    -- Interpretation: 18.5-25 normal, 25-30 overweight, 30-35 obesity, >40 morbid obesity
    bmi NUMERIC(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN taille IS NOT NULL AND taille > 0 AND poids IS NOT NULL 
            THEN ROUND((poids / POWER(taille / 100, 2))::numeric, 2)
            ELSE NULL 
        END
    ) STORED,
    
    -- Abdominal circumference in cm (measured at umbilicus level)
    peri_abdo NUMERIC(5,1) CHECK (peri_abdo IS NULL OR (peri_abdo >= 0 AND peri_abdo <= 250)),
    
    -- ========================================================================
    -- Section 2: Blood Pressure & Heart Rate - Lying Down (Couche)
    -- ========================================================================
    
    -- Systolic pressure lying down (mmHg)
    psc NUMERIC(5,1) CHECK (psc IS NULL OR (psc >= 40 AND psc <= 300)),
    
    -- Diastolic pressure lying down (mmHg)
    pdc NUMERIC(5,1) CHECK (pdc IS NULL OR (pdc >= 30 AND pdc <= 300)),
    
    -- Combined tension lying (stored separately for legacy compatibility)
    tensionc VARCHAR(20),
    
    -- ========================================================================
    -- Section 3: ECG (Electrocardiogramme)
    -- ========================================================================
    
    -- ECG performed? (controlling field for ECG section)
    rad_electrocardiogramme TEXT CHECK (rad_electrocardiogramme IN ('Oui', 'Non')),
    
    -- QT measurement in seconds (visible when ECG = Oui)
    mesqt NUMERIC(5,3) CHECK (mesqt IS NULL OR (mesqt >= 0 AND mesqt <= 1)),
    
    -- RR interval in seconds (visible when ECG = Oui)
    -- Time interval between 2 consecutive R waves
    elec_rr NUMERIC(5,3) CHECK (elec_rr IS NULL OR (elec_rr >= 0 AND elec_rr <= 3)),
    
    -- QTc calculated using Bazett's formula: QT / sqrt(RR)
    -- Interpretation:
    -- < 0.35s: hypercalcemia or digitalis impregnation
    -- Men: 0.35-0.43 normal, >0.43 long, >0.468 threatening
    -- Women: 0.35-0.48 normal, >0.48 long, >0.528 threatening
    elec_qtc NUMERIC(5,3) GENERATED ALWAYS AS (
        CASE 
            WHEN mesqt IS NOT NULL AND elec_rr IS NOT NULL AND elec_rr > 0 
            THEN ROUND((mesqt / SQRT(elec_rr))::numeric, 3)
            ELSE NULL 
        END
    ) STORED,
    
    -- ECG sent to cardiologist? (visible when ECG = Oui)
    rad_electrocardiogramme_envoi TEXT CHECK (rad_electrocardiogramme_envoi IN ('Oui', 'Non')),
    
    -- Consultation request to cardiologist? (visible when ECG = Oui)
    rad_electrocardiogramme_valide TEXT CHECK (rad_electrocardiogramme_valide IN ('Oui', 'Non')),
    
    -- ========================================================================
    -- Metadata
    -- ========================================================================
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- Row Level Security Policies
-- ----------------------------------------------------------------------------

ALTER TABLE responses_dossier_infirmier_sz ENABLE ROW LEVEL SECURITY;

-- Patient Policies
CREATE POLICY "Patients view own dossier_infirmier_sz" 
    ON responses_dossier_infirmier_sz FOR SELECT 
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own dossier_infirmier_sz" 
    ON responses_dossier_infirmier_sz FOR INSERT 
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own dossier_infirmier_sz" 
    ON responses_dossier_infirmier_sz FOR UPDATE 
    USING (auth.uid() = patient_id);

-- Professional Policies
CREATE POLICY "Professionals view all dossier_infirmier_sz" 
    ON responses_dossier_infirmier_sz FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert dossier_infirmier_sz" 
    ON responses_dossier_infirmier_sz FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE id = auth.uid() 
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update dossier_infirmier_sz" 
    ON responses_dossier_infirmier_sz FOR UPDATE 
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
CREATE INDEX idx_dossier_infirmier_sz_visit ON responses_dossier_infirmier_sz(visit_id);
CREATE INDEX idx_dossier_infirmier_sz_patient ON responses_dossier_infirmier_sz(patient_id);

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Schizophrenia Dossier Infirmier questionnaire table created successfully';
END $$;
