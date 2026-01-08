-- eFondaMental Platform - Semi-Annual DSM5 Episodes Since Last Visit Questionnaire Migration
-- Troubles de l'humeur depuis la dernière visite for bipolar disorder semi-annual follow-up visits

-- ============================================================================
-- Create Semi-Annual Episodes Since Last Visit Table
-- ============================================================================

CREATE TABLE responses_diag_psy_sem_humeur_depuis_visite (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- ========================================================================
    -- Screening Section
    -- ========================================================================
    
    -- Primary screening question: Presence of at least one thymic episode since last visit
    rad_tb_hum_epthyman VARCHAR(20) CHECK (rad_tb_hum_epthyman IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Total number of episodes (computed field, but stored for reference)
    rad_tb_hum_epthyman_nb VARCHAR(20),
    
    -- ========================================================================
    -- EDM (Major Depressive Episode) Section
    -- ========================================================================
    
    -- Number of MDE
    rad_tb_hum_nbepdep VARCHAR(20),
    
    -- Date of first MDE since last visit
    date_prem_edm DATE,
    
    -- Number of MDE with psychotic features
    rad_tb_hum_nbepdeppsy VARCHAR(20),
    
    -- Number of MDE with mixed features
    rad_tb_hum_nbepdepmixt VARCHAR(20),
    
    -- ========================================================================
    -- Manie (Manic Episodes) Section
    -- ========================================================================
    
    -- Number of manic episodes
    rad_tb_hum_nbepmanan VARCHAR(20),
    
    -- Date of first manic episode since last visit
    date_prem_man DATE,
    
    -- Number of manic episodes with psychotic features
    rad_tb_hum_nbepmanpsy VARCHAR(20),
    
    -- Number of manic episodes with mixed features
    rad_tb_hum_nbepmanmixt VARCHAR(20),
    
    -- ========================================================================
    -- Hypomanie (Hypomanic Episodes) Section
    -- ========================================================================
    
    -- Number of hypomanic episodes
    rad_tb_hum_nbephypoman VARCHAR(20),
    
    -- Date of first hypomanic episode since last visit
    date_prem_hypo DATE,
    
    -- ========================================================================
    -- Enchaînement (Episode Sequence) Section
    -- ========================================================================
    
    -- Type of most recent episode
    rad_tb_hum_type_plus_recent VARCHAR(50) CHECK (rad_tb_hum_type_plus_recent IN (
        'Episode Dépressif Majeur',
        'Hypomaniaque',
        'Maniaque',
        'Episode Non spécifié',
        'Ne sais pas'
    )),
    
    -- Episode sequence (free text: D=depression, H=hypomania, M=mania, Mx=mixed, Ns=non-specified)
    enchainement TEXT,
    
    -- ========================================================================
    -- Hospitalisations Section (always visible)
    -- ========================================================================
    
    -- Number of hospitalizations
    rad_tb_hum_nb_hospi VARCHAR(20),
    
    -- Total duration of hospitalizations (in months, including fractions)
    rad_tb_hum_duree_hospi VARCHAR(20),
    
    -- ========================================================================
    -- Metadata
    -- ========================================================================
    
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_diag_psy_sem_humeur_depuis_visite ENABLE ROW LEVEL SECURITY;

-- Healthcare professionals can view responses
CREATE POLICY "Healthcare professionals can view diag_psy_sem_humeur_depuis_visite"
    ON responses_diag_psy_sem_humeur_depuis_visite FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- Healthcare professionals can insert responses
CREATE POLICY "Healthcare professionals can insert diag_psy_sem_humeur_depuis_visite"
    ON responses_diag_psy_sem_humeur_depuis_visite FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Healthcare professionals can update responses
CREATE POLICY "Healthcare professionals can update diag_psy_sem_humeur_depuis_visite"
    ON responses_diag_psy_sem_humeur_depuis_visite FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Patients can view their own responses
CREATE POLICY "Patients can view own diag_psy_sem_humeur_depuis_visite"
    ON responses_diag_psy_sem_humeur_depuis_visite FOR SELECT
    USING (auth.uid() = patient_id);

-- ============================================================================
-- Update trigger
-- ============================================================================

CREATE TRIGGER update_responses_diag_psy_sem_humeur_depuis_visite_updated_at BEFORE UPDATE ON responses_diag_psy_sem_humeur_depuis_visite
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
