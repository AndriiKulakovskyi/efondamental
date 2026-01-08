-- eFondaMental Platform - Semi-Annual DSM5 Current Mood Disorders Questionnaire Migration
-- Troubles de l'humeur actuels for bipolar disorder semi-annual follow-up visits

-- ============================================================================
-- Create Semi-Annual Mood Disorders Table
-- ============================================================================

CREATE TABLE responses_diag_psy_sem_humeur_actuels (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- ========================================================================
    -- Current Episode Questions
    -- ========================================================================
    
    -- Q1: Presence of a current episode (rad_epactuel)
    rad_epactuel VARCHAR(10) CHECK (rad_epactuel IN ('Oui', 'Non')),
    
    -- Q2: Start date of current episode (date_trouble_actuel_debut)
    date_trouble_actuel_debut DATE,
    
    -- Q3: Episode type (rad_epactuel_type)
    rad_epactuel_type VARCHAR(50) CHECK (rad_epactuel_type IN (
        '',
        'Episode Dépressif Majeur',
        'Hypomaniaque',
        'Maniaque',
        'Episode Non spécifié',
        'Ne sais pas'
    )),
    
    -- Q4: Current MDE episode type (rad_epactuel_edmtype) - only for Episode Dépressif Majeur
    rad_epactuel_edmtype VARCHAR(100) CHECK (rad_epactuel_edmtype IN (
        'Sans caractéristique mélancolique atypique catatonique ou mixte',
        'Mélancolique',
        'Atypique',
        'Catatonique',
        'Mixte'
    )),
    
    -- Q5: Catatonic episode? (rad_epactuel_mixttyp) - for Maniaque or Episode Non spécifié
    rad_epactuel_mixttyp VARCHAR(20) CHECK (rad_epactuel_mixttyp IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Q6: Mixed episode? (rad_epactuel_mixttyp2) - for Maniaque or Episode Non spécifié
    rad_epactuel_mixttyp2 VARCHAR(20) CHECK (rad_epactuel_mixttyp2 IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Q7: Episode severity (rad_epactuel_sever) - for EDM, Maniaque, or Episode Non spécifié
    rad_epactuel_sever VARCHAR(100) CHECK (rad_epactuel_sever IN (
        'Léger',
        'Modéré',
        'Sévère sans caractéristique psychotique',
        'Sévère avec caractéristiques psychotiques non congruentes',
        'Sévère avec caractéristiques psychotiques congruentes'
    )),
    
    -- Q8: Episode chronicity (rad_epactuel_chron) - only for Episode Dépressif Majeur
    rad_epactuel_chron VARCHAR(20) CHECK (rad_epactuel_chron IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Q9: Postpartum onset (rad_postpartum_actuel) - for all episode types except empty and 'Ne sais pas'
    rad_postpartum_actuel VARCHAR(20) CHECK (rad_postpartum_actuel IN ('Oui', 'Non', 'Ne sais pas')),
    
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

ALTER TABLE responses_diag_psy_sem_humeur_actuels ENABLE ROW LEVEL SECURITY;

-- Healthcare professionals can view responses
CREATE POLICY "Healthcare professionals can view diag_psy_sem_humeur_actuels"
    ON responses_diag_psy_sem_humeur_actuels FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- Healthcare professionals can insert responses
CREATE POLICY "Healthcare professionals can insert diag_psy_sem_humeur_actuels"
    ON responses_diag_psy_sem_humeur_actuels FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Healthcare professionals can update responses
CREATE POLICY "Healthcare professionals can update diag_psy_sem_humeur_actuels"
    ON responses_diag_psy_sem_humeur_actuels FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Patients can view their own responses
CREATE POLICY "Patients can view own diag_psy_sem_humeur_actuels"
    ON responses_diag_psy_sem_humeur_actuels FOR SELECT
    USING (auth.uid() = patient_id);

-- ============================================================================
-- Update trigger
-- ============================================================================

CREATE TRIGGER update_responses_diag_psy_sem_humeur_actuels_updated_at BEFORE UPDATE ON responses_diag_psy_sem_humeur_actuels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
