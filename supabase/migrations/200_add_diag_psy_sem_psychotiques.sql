-- eFondaMental Platform - Semi-Annual DSM5 Psychotic Disorders Questionnaire Migration
-- Troubles psychotiques for bipolar disorder semi-annual follow-up visits

-- ============================================================================
-- Create Semi-Annual Psychotic Disorders Table
-- ============================================================================

CREATE TABLE responses_diag_psy_sem_psychotiques (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- ========================================================================
    -- Psychotic Disorders Questions
    -- ========================================================================
    
    -- Primary screening question: Does the patient have a psychotic disorder
    rad_tb_psychos VARCHAR(20) CHECK (rad_tb_psychos IN ('Oui', 'Non', 'Ne sais pas')),
    
    -- Date of psychotic disorder onset
    date_tb_psychos_date DATE,
    
    -- Type of psychotic disorder
    rad_tb_psychos_type VARCHAR(100) CHECK (rad_tb_psychos_type IN (
        'Schizophrénie',
        'Trouble schizophréniforme',
        'Trouble schizo-affectif',
        'Troubles délirants',
        'Trouble psychotique bref',
        'Trouble psychotique partagé',
        'Trouble psychotique induit par une affection médicale générale',
        'Trouble psychotique induit par une substance',
        'Trouble psychotique non spécifié'
    )),
    
    -- Presence of symptoms in the past month
    rad_tb_psychos_lastmonth VARCHAR(20) CHECK (rad_tb_psychos_lastmonth IN ('Oui', 'Non', 'Ne sais pas')),
    
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

ALTER TABLE responses_diag_psy_sem_psychotiques ENABLE ROW LEVEL SECURITY;

-- Healthcare professionals can view responses
CREATE POLICY "Healthcare professionals can view diag_psy_sem_psychotiques"
    ON responses_diag_psy_sem_psychotiques FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- Healthcare professionals can insert responses
CREATE POLICY "Healthcare professionals can insert diag_psy_sem_psychotiques"
    ON responses_diag_psy_sem_psychotiques FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Healthcare professionals can update responses
CREATE POLICY "Healthcare professionals can update diag_psy_sem_psychotiques"
    ON responses_diag_psy_sem_psychotiques FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Patients can view their own responses
CREATE POLICY "Patients can view own diag_psy_sem_psychotiques"
    ON responses_diag_psy_sem_psychotiques FOR SELECT
    USING (auth.uid() = patient_id);

-- ============================================================================
-- Update trigger
-- ============================================================================

CREATE TRIGGER update_responses_diag_psy_sem_psychotiques_updated_at BEFORE UPDATE ON responses_diag_psy_sem_psychotiques
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
