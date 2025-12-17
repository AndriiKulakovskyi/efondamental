-- eFondaMental Platform - Family History Questionnaire Rework
-- Section 1: Enfants (Children: Daughters and Sons)
-- Section 2: Frères et Soeurs (Siblings: Sisters and Brothers)
-- Section 3: Parents (Mother and Father)
-- Flat structure supporting up to 5 of each category (children/siblings) with branching logic

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
    -- SISTERS (Soeurs)
    -- ========================================================================
    
    -- Q3: Number of sisters
    num_sisters VARCHAR(10) CHECK (num_sisters IN ('0', '1', '2', '3', '4', '5', '>5')),
    
    -- Q3.1: Number of sisters with issues
    num_sisters_with_issues INTEGER CHECK (num_sisters_with_issues BETWEEN 0 AND 5),
    
    -- Sister 1
    sister1_dob DATE,
    sister1_has_issues BOOLEAN DEFAULT FALSE,
    sister1_deceased VARCHAR(10) CHECK (sister1_deceased IN ('oui', 'non')),
    sister1_death_date DATE,
    sister1_death_cause TEXT,
    
    -- Sister 2
    sister2_dob DATE,
    sister2_has_issues BOOLEAN DEFAULT FALSE,
    sister2_deceased VARCHAR(10) CHECK (sister2_deceased IN ('oui', 'non')),
    sister2_death_date DATE,
    sister2_death_cause TEXT,
    
    -- Sister 3
    sister3_dob DATE,
    sister3_has_issues BOOLEAN DEFAULT FALSE,
    sister3_deceased VARCHAR(10) CHECK (sister3_deceased IN ('oui', 'non')),
    sister3_death_date DATE,
    sister3_death_cause TEXT,
    
    -- Sister 4
    sister4_dob DATE,
    sister4_has_issues BOOLEAN DEFAULT FALSE,
    sister4_deceased VARCHAR(10) CHECK (sister4_deceased IN ('oui', 'non')),
    sister4_death_date DATE,
    sister4_death_cause TEXT,
    
    -- Sister 5
    sister5_dob DATE,
    sister5_has_issues BOOLEAN DEFAULT FALSE,
    sister5_deceased VARCHAR(10) CHECK (sister5_deceased IN ('oui', 'non')),
    sister5_death_date DATE,
    sister5_death_cause TEXT,
    
    -- ========================================================================
    -- BROTHERS (Frères)
    -- ========================================================================
    
    -- Q4: Number of brothers
    num_brothers VARCHAR(10) CHECK (num_brothers IN ('0', '1', '2', '3', '4', '5', '>5')),
    
    -- Q4.1: Number of brothers with issues
    num_brothers_with_issues INTEGER CHECK (num_brothers_with_issues BETWEEN 0 AND 5),
    
    -- Brother 1
    brother1_dob DATE,
    brother1_has_issues BOOLEAN DEFAULT FALSE,
    brother1_deceased VARCHAR(10) CHECK (brother1_deceased IN ('oui', 'non')),
    brother1_death_date DATE,
    brother1_death_cause TEXT,
    
    -- Brother 2
    brother2_dob DATE,
    brother2_has_issues BOOLEAN DEFAULT FALSE,
    brother2_deceased VARCHAR(10) CHECK (brother2_deceased IN ('oui', 'non')),
    brother2_death_date DATE,
    brother2_death_cause TEXT,
    
    -- Brother 3
    brother3_dob DATE,
    brother3_has_issues BOOLEAN DEFAULT FALSE,
    brother3_deceased VARCHAR(10) CHECK (brother3_deceased IN ('oui', 'non')),
    brother3_death_date DATE,
    brother3_death_cause TEXT,
    
    -- Brother 4
    brother4_dob DATE,
    brother4_has_issues BOOLEAN DEFAULT FALSE,
    brother4_deceased VARCHAR(10) CHECK (brother4_deceased IN ('oui', 'non')),
    brother4_death_date DATE,
    brother4_death_cause TEXT,
    
    -- Brother 5
    brother5_dob DATE,
    brother5_has_issues BOOLEAN DEFAULT FALSE,
    brother5_deceased VARCHAR(10) CHECK (brother5_deceased IN ('oui', 'non')),
    brother5_death_date DATE,
    brother5_death_cause TEXT,
    
    -- ========================================================================
    -- PARENTS (Mère et Père)
    -- ========================================================================
    
    -- Mother
    mother_history VARCHAR(20) CHECK (mother_history IN ('oui', 'non', 'ne_sais_pas')),
    mother_deceased VARCHAR(10) CHECK (mother_deceased IN ('oui', 'non')),
    mother_death_cause TEXT,
    
    -- Father
    father_history VARCHAR(20) CHECK (father_history IN ('oui', 'non', 'ne_sais_pas')),
    father_deceased VARCHAR(10) CHECK (father_deceased IN ('oui', 'non')),
    father_death_cause TEXT,
    
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
'Stores responses for the Family History questionnaire. Section 1: Enfants (Children) - up to 5 daughters and 5 sons. Section 2: Frères et Soeurs (Siblings) - up to 5 sisters and 5 brothers. Section 3: Parents (Mother and Father) - basic history and death information.';

COMMENT ON COLUMN responses_family_history.num_daughters IS 
'Q1: Number of daughters (0, 1-5, or >5)';

COMMENT ON COLUMN responses_family_history.num_daughters_with_issues IS 
'Q1.1: Number of daughters with psychiatric disorder, substance abuse, suicide attempt, or cardiovascular risk';

COMMENT ON COLUMN responses_family_history.num_sons IS 
'Q2: Number of sons (0, 1-5, or >5)';

COMMENT ON COLUMN responses_family_history.num_sons_with_issues IS 
'Q2.1: Number of sons with psychiatric disorder, substance abuse, suicide attempt, or cardiovascular risk';

COMMENT ON COLUMN responses_family_history.num_sisters IS 
'Q3: Number of sisters (0, 1-5, or >5)';

COMMENT ON COLUMN responses_family_history.num_sisters_with_issues IS 
'Q3.1: Number of sisters with psychiatric disorder, substance abuse, suicide attempt, or cardiovascular risk';

COMMENT ON COLUMN responses_family_history.num_brothers IS 
'Q4: Number of brothers (0, 1-5, or >5)';

COMMENT ON COLUMN responses_family_history.num_brothers_with_issues IS 
'Q4.1: Number of brothers with psychiatric disorder, substance abuse, suicide attempt, or cardiovascular risk';

COMMENT ON COLUMN responses_family_history.mother_history IS 
'Q5: Mother history (oui/non/ne_sais_pas)';

COMMENT ON COLUMN responses_family_history.mother_deceased IS 
'Q6: Mother deceased (oui/non)';

COMMENT ON COLUMN responses_family_history.father_history IS 
'Q7: Father history (oui/non/ne_sais_pas)';

COMMENT ON COLUMN responses_family_history.father_deceased IS 
'Q8: Father deceased (oui/non)';

