-- eFondaMental Platform - Family History Questionnaire Rework
-- Focus exclusively on Section 1 - Enfants (Children: Daughters and Sons)
-- Flat structure supporting up to 5 daughters and 5 sons with branching logic

-- ============================================================================
-- Drop existing table (accepting data loss)
-- ============================================================================

DROP TABLE IF EXISTS responses_family_history CASCADE;

-- ============================================================================
-- Create new Family History Table - Children Only
-- ============================================================================

CREATE TABLE responses_family_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- ========================================================================
    -- DAUGHTERS (Filles)
    -- ========================================================================
    
    -- Q1: Number of daughters
    num_daughters VARCHAR(10) CHECK (num_daughters IN ('0', '1', '2', '3', '4', '5', '>5')),
    
    -- Q1.1: Number of daughters with issues
    num_daughters_with_issues INTEGER CHECK (num_daughters_with_issues BETWEEN 0 AND 5),
    
    -- Daughter 1
    daughter1_dob DATE,
    daughter1_has_issues BOOLEAN DEFAULT FALSE,
    daughter1_deceased VARCHAR(10) CHECK (daughter1_deceased IN ('oui', 'non')),
    daughter1_death_date DATE,
    daughter1_death_cause TEXT,
    
    -- Daughter 2
    daughter2_dob DATE,
    daughter2_has_issues BOOLEAN DEFAULT FALSE,
    daughter2_deceased VARCHAR(10) CHECK (daughter2_deceased IN ('oui', 'non')),
    daughter2_death_date DATE,
    daughter2_death_cause TEXT,
    
    -- Daughter 3
    daughter3_dob DATE,
    daughter3_has_issues BOOLEAN DEFAULT FALSE,
    daughter3_deceased VARCHAR(10) CHECK (daughter3_deceased IN ('oui', 'non')),
    daughter3_death_date DATE,
    daughter3_death_cause TEXT,
    
    -- Daughter 4
    daughter4_dob DATE,
    daughter4_has_issues BOOLEAN DEFAULT FALSE,
    daughter4_deceased VARCHAR(10) CHECK (daughter4_deceased IN ('oui', 'non')),
    daughter4_death_date DATE,
    daughter4_death_cause TEXT,
    
    -- Daughter 5
    daughter5_dob DATE,
    daughter5_has_issues BOOLEAN DEFAULT FALSE,
    daughter5_deceased VARCHAR(10) CHECK (daughter5_deceased IN ('oui', 'non')),
    daughter5_death_date DATE,
    daughter5_death_cause TEXT,
    
    -- ========================================================================
    -- SONS (Fils)
    -- ========================================================================
    
    -- Q2: Number of sons
    num_sons VARCHAR(10) CHECK (num_sons IN ('0', '1', '2', '3', '4', '5', '>5')),
    
    -- Q2.1: Number of sons with issues
    num_sons_with_issues INTEGER CHECK (num_sons_with_issues BETWEEN 0 AND 5),
    
    -- Son 1
    son1_dob DATE,
    son1_has_issues BOOLEAN DEFAULT FALSE,
    son1_deceased VARCHAR(10) CHECK (son1_deceased IN ('oui', 'non')),
    son1_death_date DATE,
    son1_death_cause TEXT,
    
    -- Son 2
    son2_dob DATE,
    son2_has_issues BOOLEAN DEFAULT FALSE,
    son2_deceased VARCHAR(10) CHECK (son2_deceased IN ('oui', 'non')),
    son2_death_date DATE,
    son2_death_cause TEXT,
    
    -- Son 3
    son3_dob DATE,
    son3_has_issues BOOLEAN DEFAULT FALSE,
    son3_deceased VARCHAR(10) CHECK (son3_deceased IN ('oui', 'non')),
    son3_death_date DATE,
    son3_death_cause TEXT,
    
    -- Son 4
    son4_dob DATE,
    son4_has_issues BOOLEAN DEFAULT FALSE,
    son4_deceased VARCHAR(10) CHECK (son4_deceased IN ('oui', 'non')),
    son4_death_date DATE,
    son4_death_cause TEXT,
    
    -- Son 5
    son5_dob DATE,
    son5_has_issues BOOLEAN DEFAULT FALSE,
    son5_deceased VARCHAR(10) CHECK (son5_deceased IN ('oui', 'non')),
    son5_death_date DATE,
    son5_death_cause TEXT,
    
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

ALTER TABLE responses_family_history ENABLE ROW LEVEL SECURITY;

-- Healthcare professionals can view family history responses
CREATE POLICY "Healthcare professionals can view family history responses"
    ON responses_family_history FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- Healthcare professionals can insert family history responses
CREATE POLICY "Healthcare professionals can insert family history responses"
    ON responses_family_history FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Healthcare professionals can update family history responses
CREATE POLICY "Healthcare professionals can update family history responses"
    ON responses_family_history FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Patients can view their own family history responses
CREATE POLICY "Patients can view own family history responses"
    ON responses_family_history FOR SELECT
    USING (auth.uid() = patient_id);

-- ============================================================================
-- Update trigger
-- ============================================================================

CREATE TRIGGER update_responses_family_history_updated_at 
    BEFORE UPDATE ON responses_family_history
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE responses_family_history IS 
'Stores responses for the Family History questionnaire - Section 1: Enfants (Children). Supports up to 5 daughters and 5 sons with psychiatric/cardiovascular risk factors, suicide attempts, and substance abuse history.';

COMMENT ON COLUMN responses_family_history.num_daughters IS 
'Q1: Number of daughters (0, 1-5, or >5)';

COMMENT ON COLUMN responses_family_history.num_daughters_with_issues IS 
'Q1.1: Number of daughters with psychiatric disorder, substance abuse, suicide attempt, or cardiovascular risk';

COMMENT ON COLUMN responses_family_history.num_sons IS 
'Q2: Number of sons (0, 1-5, or >5)';

COMMENT ON COLUMN responses_family_history.num_sons_with_issues IS 
'Q2.1: Number of sons with psychiatric disorder, substance abuse, suicide attempt, or cardiovascular risk';

