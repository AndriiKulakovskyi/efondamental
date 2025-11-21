-- eFondaMental Platform - Family History (Anamnesis) Questionnaire Migration
-- Systematic evaluation of psychiatric and cardiovascular family history

-- ============================================================================
-- Create Family History Table
-- ============================================================================

CREATE TABLE responses_family_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- ========================================================================
    -- MOTHER (Mère)
    -- ========================================================================
    
    mother_deceased VARCHAR(20) CHECK (mother_deceased IN ('oui', 'non', 'ne_sais_pas')),
    mother_death_cause TEXT,
    mother_psy_history VARCHAR(20) CHECK (mother_psy_history IN ('oui', 'non', 'ne_sais_pas')),
    
    -- Mother - Psychiatric Details
    mother_psy_thymic VARCHAR(20) CHECK (mother_psy_thymic IN ('oui', 'non', 'ne_sais_pas')),
    mother_psy_thymic_type VARCHAR(20) CHECK (mother_psy_thymic_type IN ('unipolaire', 'bipolaire', 'nsp')),
    mother_psy_schizo VARCHAR(20) CHECK (mother_psy_schizo IN ('oui', 'non', 'ne_sais_pas')),
    mother_psy_suicide INTEGER CHECK (mother_psy_suicide IN (0, 1, 2, 99)), -- 0=none, 1=attempt, 2=completed, 99=unknown
    mother_psy_dementia VARCHAR(20) CHECK (mother_psy_dementia IN ('oui', 'non', 'ne_sais_pas')),
    mother_psy_substance VARCHAR(20) CHECK (mother_psy_substance IN ('oui', 'non', 'ne_sais_pas')),
    mother_psy_substance_types TEXT[], -- Array: alcool, cannabis, autre
    mother_psy_anxiety VARCHAR(20) CHECK (mother_psy_anxiety IN ('oui', 'non', 'ne_sais_pas')),
    
    -- Mother - Cardiovascular
    mother_cardio_history VARCHAR(20) CHECK (mother_cardio_history IN ('oui', 'non', 'ne_sais_pas')),
    mother_cardio_types TEXT[], -- Array: diabete, obesite, hyperlipidemie, hypertension
    mother_diabetes_type INTEGER CHECK (mother_diabetes_type IN (1, 2, 99)), -- 1=Type I, 2=Type II, 99=unknown
    
    -- ========================================================================
    -- FATHER (Père)
    -- ========================================================================
    
    father_deceased VARCHAR(20) CHECK (father_deceased IN ('oui', 'non', 'ne_sais_pas')),
    father_death_cause TEXT,
    father_psy_history VARCHAR(20) CHECK (father_psy_history IN ('oui', 'non', 'ne_sais_pas')),
    
    -- Father - Psychiatric Details
    father_psy_thymic VARCHAR(20) CHECK (father_psy_thymic IN ('oui', 'non', 'ne_sais_pas')),
    father_psy_thymic_type VARCHAR(20) CHECK (father_psy_thymic_type IN ('unipolaire', 'bipolaire', 'nsp')),
    father_psy_schizo VARCHAR(20) CHECK (father_psy_schizo IN ('oui', 'non', 'ne_sais_pas')),
    father_psy_suicide INTEGER CHECK (father_psy_suicide IN (0, 1, 2, 99)),
    father_psy_dementia VARCHAR(20) CHECK (father_psy_dementia IN ('oui', 'non', 'ne_sais_pas')),
    father_psy_substance VARCHAR(20) CHECK (father_psy_substance IN ('oui', 'non', 'ne_sais_pas')),
    father_psy_substance_types TEXT[],
    father_psy_anxiety VARCHAR(20) CHECK (father_psy_anxiety IN ('oui', 'non', 'ne_sais_pas')),
    
    -- Father - Cardiovascular
    father_cardio_history VARCHAR(20) CHECK (father_cardio_history IN ('oui', 'non', 'ne_sais_pas')),
    father_cardio_types TEXT[],
    father_diabetes_type INTEGER CHECK (father_diabetes_type IN (1, 2, 99)),
    
    -- ========================================================================
    -- GRANDPARENTS (Grands-Parents)
    -- ========================================================================
    
    -- Maternal Grandparents
    gp_maternal_grandmother_notes TEXT,
    gp_maternal_grandfather_notes TEXT,
    
    -- Paternal Grandparents
    gp_paternal_grandmother_notes TEXT,
    gp_paternal_grandfather_notes TEXT,
    
    -- ========================================================================
    -- CHILDREN (Enfants)
    -- ========================================================================
    
    has_children VARCHAR(20) CHECK (has_children IN ('oui', 'non')),
    children_psy_count INTEGER CHECK (children_psy_count >= 0),
    children_cardio_count INTEGER CHECK (children_cardio_count >= 0),
    
    -- Child 1
    child1_gender VARCHAR(1) CHECK (child1_gender IN ('M', 'F')),
    child1_dob TEXT,
    child1_psy_history VARCHAR(20) CHECK (child1_psy_history IN ('oui', 'non', 'ne_sais_pas')),
    child1_psy_details TEXT[], -- Array: thymique, schizo, suicide, substances, anxiete, demence
    child1_cardio VARCHAR(20) CHECK (child1_cardio IN ('oui', 'non', 'ne_sais_pas')),
    
    -- Child 2
    child2_gender VARCHAR(1) CHECK (child2_gender IN ('M', 'F')),
    child2_dob TEXT,
    child2_psy_history VARCHAR(20) CHECK (child2_psy_history IN ('oui', 'non', 'ne_sais_pas')),
    child2_psy_details TEXT[],
    child2_cardio VARCHAR(20) CHECK (child2_cardio IN ('oui', 'non', 'ne_sais_pas')),
    
    -- Child 3
    child3_gender VARCHAR(1) CHECK (child3_gender IN ('M', 'F')),
    child3_dob TEXT,
    child3_psy_history VARCHAR(20) CHECK (child3_psy_history IN ('oui', 'non', 'ne_sais_pas')),
    child3_psy_details TEXT[],
    child3_cardio VARCHAR(20) CHECK (child3_cardio IN ('oui', 'non', 'ne_sais_pas')),
    
    -- Child 4
    child4_gender VARCHAR(1) CHECK (child4_gender IN ('M', 'F')),
    child4_dob TEXT,
    child4_psy_history VARCHAR(20) CHECK (child4_psy_history IN ('oui', 'non', 'ne_sais_pas')),
    child4_psy_details TEXT[],
    child4_cardio VARCHAR(20) CHECK (child4_cardio IN ('oui', 'non', 'ne_sais_pas')),
    
    -- ========================================================================
    -- SIBLINGS (Frères et Soeurs)
    -- ========================================================================
    
    has_siblings VARCHAR(20) CHECK (has_siblings IN ('oui', 'non')),
    
    -- Sibling 1
    sibling1_gender VARCHAR(1) CHECK (sibling1_gender IN ('M', 'F')),
    sibling1_deceased VARCHAR(20) CHECK (sibling1_deceased IN ('oui', 'non', 'ne_sais_pas')),
    sibling1_death_cause TEXT,
    sibling1_psy_history VARCHAR(20) CHECK (sibling1_psy_history IN ('oui', 'non', 'ne_sais_pas')),
    sibling1_psy_thymic VARCHAR(20) CHECK (sibling1_psy_thymic IN ('oui', 'non', 'ne_sais_pas')),
    sibling1_psy_thymic_type VARCHAR(20) CHECK (sibling1_psy_thymic_type IN ('unipolaire', 'bipolaire', 'nsp')),
    sibling1_psy_schizo VARCHAR(20) CHECK (sibling1_psy_schizo IN ('oui', 'non', 'ne_sais_pas')),
    sibling1_psy_suicide INTEGER CHECK (sibling1_psy_suicide IN (0, 1, 2, 99)),
    sibling1_psy_substance VARCHAR(20) CHECK (sibling1_psy_substance IN ('oui', 'non', 'ne_sais_pas')),
    sibling1_psy_anxiety VARCHAR(20) CHECK (sibling1_psy_anxiety IN ('oui', 'non', 'ne_sais_pas')),
    sibling1_cardio_history VARCHAR(20) CHECK (sibling1_cardio_history IN ('oui', 'non', 'ne_sais_pas')),
    sibling1_cardio_types TEXT[],
    
    -- Sibling 2
    sibling2_gender VARCHAR(1) CHECK (sibling2_gender IN ('M', 'F')),
    sibling2_deceased VARCHAR(20) CHECK (sibling2_deceased IN ('oui', 'non', 'ne_sais_pas')),
    sibling2_death_cause TEXT,
    sibling2_psy_history VARCHAR(20) CHECK (sibling2_psy_history IN ('oui', 'non', 'ne_sais_pas')),
    sibling2_psy_thymic VARCHAR(20) CHECK (sibling2_psy_thymic IN ('oui', 'non', 'ne_sais_pas')),
    sibling2_psy_thymic_type VARCHAR(20) CHECK (sibling2_psy_thymic_type IN ('unipolaire', 'bipolaire', 'nsp')),
    sibling2_psy_schizo VARCHAR(20) CHECK (sibling2_psy_schizo IN ('oui', 'non', 'ne_sais_pas')),
    sibling2_psy_suicide INTEGER CHECK (sibling2_psy_suicide IN (0, 1, 2, 99)),
    sibling2_psy_substance VARCHAR(20) CHECK (sibling2_psy_substance IN ('oui', 'non', 'ne_sais_pas')),
    sibling2_psy_anxiety VARCHAR(20) CHECK (sibling2_psy_anxiety IN ('oui', 'non', 'ne_sais_pas')),
    sibling2_cardio_history VARCHAR(20) CHECK (sibling2_cardio_history IN ('oui', 'non', 'ne_sais_pas')),
    sibling2_cardio_types TEXT[],
    
    -- Sibling 3
    sibling3_gender VARCHAR(1) CHECK (sibling3_gender IN ('M', 'F')),
    sibling3_deceased VARCHAR(20) CHECK (sibling3_deceased IN ('oui', 'non', 'ne_sais_pas')),
    sibling3_death_cause TEXT,
    sibling3_psy_history VARCHAR(20) CHECK (sibling3_psy_history IN ('oui', 'non', 'ne_sais_pas')),
    sibling3_psy_thymic VARCHAR(20) CHECK (sibling3_psy_thymic IN ('oui', 'non', 'ne_sais_pas')),
    sibling3_psy_thymic_type VARCHAR(20) CHECK (sibling3_psy_thymic_type IN ('unipolaire', 'bipolaire', 'nsp')),
    sibling3_psy_schizo VARCHAR(20) CHECK (sibling3_psy_schizo IN ('oui', 'non', 'ne_sais_pas')),
    sibling3_psy_suicide INTEGER CHECK (sibling3_psy_suicide IN (0, 1, 2, 99)),
    sibling3_psy_substance VARCHAR(20) CHECK (sibling3_psy_substance IN ('oui', 'non', 'ne_sais_pas')),
    sibling3_psy_anxiety VARCHAR(20) CHECK (sibling3_psy_anxiety IN ('oui', 'non', 'ne_sais_pas')),
    sibling3_cardio_history VARCHAR(20) CHECK (sibling3_cardio_history IN ('oui', 'non', 'ne_sais_pas')),
    sibling3_cardio_types TEXT[],
    
    -- Sibling 4
    sibling4_gender VARCHAR(1) CHECK (sibling4_gender IN ('M', 'F')),
    sibling4_deceased VARCHAR(20) CHECK (sibling4_deceased IN ('oui', 'non', 'ne_sais_pas')),
    sibling4_death_cause TEXT,
    sibling4_psy_history VARCHAR(20) CHECK (sibling4_psy_history IN ('oui', 'non', 'ne_sais_pas')),
    sibling4_psy_thymic VARCHAR(20) CHECK (sibling4_psy_thymic IN ('oui', 'non', 'ne_sais_pas')),
    sibling4_psy_thymic_type VARCHAR(20) CHECK (sibling4_psy_thymic_type IN ('unipolaire', 'bipolaire', 'nsp')),
    sibling4_psy_schizo VARCHAR(20) CHECK (sibling4_psy_schizo IN ('oui', 'non', 'ne_sais_pas')),
    sibling4_psy_suicide INTEGER CHECK (sibling4_psy_suicide IN (0, 1, 2, 99)),
    sibling4_psy_substance VARCHAR(20) CHECK (sibling4_psy_substance IN ('oui', 'non', 'ne_sais_pas')),
    sibling4_psy_anxiety VARCHAR(20) CHECK (sibling4_psy_anxiety IN ('oui', 'non', 'ne_sais_pas')),
    sibling4_cardio_history VARCHAR(20) CHECK (sibling4_cardio_history IN ('oui', 'non', 'ne_sais_pas')),
    sibling4_cardio_types TEXT[],
    
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

CREATE TRIGGER update_responses_family_history_updated_at BEFORE UPDATE ON responses_family_history
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


