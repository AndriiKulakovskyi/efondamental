-- ============================================================================
-- Migration: Create BRIEF-A table for Schizophrenia
-- ============================================================================
-- BRIEF-A - Behavior Rating Inventory of Executive Function - Adult
-- French Version (Roth RM, Isquith PK, Gioia GA; Translation: Szöke A., Hammami S., Schürhoff F.)
-- Hetero-questionnaire assessing executive functions through observed behaviors
-- 75 items with 3-point Likert scale (1=Jamais, 2=Parfois, 3=Souvent)
-- ============================================================================

-- Create the table
CREATE TABLE IF NOT EXISTS schizophrenia_brief_a (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Demographics (informant information)
    subject_name TEXT,
    subject_sex TEXT CHECK (subject_sex IS NULL OR subject_sex IN ('M', 'F')),
    subject_age INTEGER CHECK (subject_age IS NULL OR subject_age BETWEEN 18 AND 100),
    relationship TEXT CHECK (relationship IS NULL OR relationship IN ('parent', 'epoux', 'frere_soeur', 'ami', 'autre')),
    years_known INTEGER CHECK (years_known IS NULL OR years_known BETWEEN 0 AND 100),
    
    -- 75 item scores (1-3 each)
    q1 INTEGER CHECK (q1 IS NULL OR q1 BETWEEN 1 AND 3),
    q2 INTEGER CHECK (q2 IS NULL OR q2 BETWEEN 1 AND 3),
    q3 INTEGER CHECK (q3 IS NULL OR q3 BETWEEN 1 AND 3),
    q4 INTEGER CHECK (q4 IS NULL OR q4 BETWEEN 1 AND 3),
    q5 INTEGER CHECK (q5 IS NULL OR q5 BETWEEN 1 AND 3),
    q6 INTEGER CHECK (q6 IS NULL OR q6 BETWEEN 1 AND 3),
    q7 INTEGER CHECK (q7 IS NULL OR q7 BETWEEN 1 AND 3),
    q8 INTEGER CHECK (q8 IS NULL OR q8 BETWEEN 1 AND 3),
    q9 INTEGER CHECK (q9 IS NULL OR q9 BETWEEN 1 AND 3),
    q10 INTEGER CHECK (q10 IS NULL OR q10 BETWEEN 1 AND 3),
    q11 INTEGER CHECK (q11 IS NULL OR q11 BETWEEN 1 AND 3),
    q12 INTEGER CHECK (q12 IS NULL OR q12 BETWEEN 1 AND 3),
    q13 INTEGER CHECK (q13 IS NULL OR q13 BETWEEN 1 AND 3),
    q14 INTEGER CHECK (q14 IS NULL OR q14 BETWEEN 1 AND 3),
    q15 INTEGER CHECK (q15 IS NULL OR q15 BETWEEN 1 AND 3),
    q16 INTEGER CHECK (q16 IS NULL OR q16 BETWEEN 1 AND 3),
    q17 INTEGER CHECK (q17 IS NULL OR q17 BETWEEN 1 AND 3),
    q18 INTEGER CHECK (q18 IS NULL OR q18 BETWEEN 1 AND 3),
    q19 INTEGER CHECK (q19 IS NULL OR q19 BETWEEN 1 AND 3),
    q20 INTEGER CHECK (q20 IS NULL OR q20 BETWEEN 1 AND 3),
    q21 INTEGER CHECK (q21 IS NULL OR q21 BETWEEN 1 AND 3),
    q22 INTEGER CHECK (q22 IS NULL OR q22 BETWEEN 1 AND 3),
    q23 INTEGER CHECK (q23 IS NULL OR q23 BETWEEN 1 AND 3),
    q24 INTEGER CHECK (q24 IS NULL OR q24 BETWEEN 1 AND 3),
    q25 INTEGER CHECK (q25 IS NULL OR q25 BETWEEN 1 AND 3),
    q26 INTEGER CHECK (q26 IS NULL OR q26 BETWEEN 1 AND 3),
    q27 INTEGER CHECK (q27 IS NULL OR q27 BETWEEN 1 AND 3),
    q28 INTEGER CHECK (q28 IS NULL OR q28 BETWEEN 1 AND 3),
    q29 INTEGER CHECK (q29 IS NULL OR q29 BETWEEN 1 AND 3),
    q30 INTEGER CHECK (q30 IS NULL OR q30 BETWEEN 1 AND 3),
    q31 INTEGER CHECK (q31 IS NULL OR q31 BETWEEN 1 AND 3),
    q32 INTEGER CHECK (q32 IS NULL OR q32 BETWEEN 1 AND 3),
    q33 INTEGER CHECK (q33 IS NULL OR q33 BETWEEN 1 AND 3),
    q34 INTEGER CHECK (q34 IS NULL OR q34 BETWEEN 1 AND 3),
    q35 INTEGER CHECK (q35 IS NULL OR q35 BETWEEN 1 AND 3),
    q36 INTEGER CHECK (q36 IS NULL OR q36 BETWEEN 1 AND 3),
    q37 INTEGER CHECK (q37 IS NULL OR q37 BETWEEN 1 AND 3),
    q38 INTEGER CHECK (q38 IS NULL OR q38 BETWEEN 1 AND 3),
    q39 INTEGER CHECK (q39 IS NULL OR q39 BETWEEN 1 AND 3),
    q40 INTEGER CHECK (q40 IS NULL OR q40 BETWEEN 1 AND 3),
    q41 INTEGER CHECK (q41 IS NULL OR q41 BETWEEN 1 AND 3),
    q42 INTEGER CHECK (q42 IS NULL OR q42 BETWEEN 1 AND 3),
    q43 INTEGER CHECK (q43 IS NULL OR q43 BETWEEN 1 AND 3),
    q44 INTEGER CHECK (q44 IS NULL OR q44 BETWEEN 1 AND 3),
    q45 INTEGER CHECK (q45 IS NULL OR q45 BETWEEN 1 AND 3),
    q46 INTEGER CHECK (q46 IS NULL OR q46 BETWEEN 1 AND 3),
    q47 INTEGER CHECK (q47 IS NULL OR q47 BETWEEN 1 AND 3),
    q48 INTEGER CHECK (q48 IS NULL OR q48 BETWEEN 1 AND 3),
    q49 INTEGER CHECK (q49 IS NULL OR q49 BETWEEN 1 AND 3),
    q50 INTEGER CHECK (q50 IS NULL OR q50 BETWEEN 1 AND 3),
    q51 INTEGER CHECK (q51 IS NULL OR q51 BETWEEN 1 AND 3),
    q52 INTEGER CHECK (q52 IS NULL OR q52 BETWEEN 1 AND 3),
    q53 INTEGER CHECK (q53 IS NULL OR q53 BETWEEN 1 AND 3),
    q54 INTEGER CHECK (q54 IS NULL OR q54 BETWEEN 1 AND 3),
    q55 INTEGER CHECK (q55 IS NULL OR q55 BETWEEN 1 AND 3),
    q56 INTEGER CHECK (q56 IS NULL OR q56 BETWEEN 1 AND 3),
    q57 INTEGER CHECK (q57 IS NULL OR q57 BETWEEN 1 AND 3),
    q58 INTEGER CHECK (q58 IS NULL OR q58 BETWEEN 1 AND 3),
    q59 INTEGER CHECK (q59 IS NULL OR q59 BETWEEN 1 AND 3),
    q60 INTEGER CHECK (q60 IS NULL OR q60 BETWEEN 1 AND 3),
    q61 INTEGER CHECK (q61 IS NULL OR q61 BETWEEN 1 AND 3),
    q62 INTEGER CHECK (q62 IS NULL OR q62 BETWEEN 1 AND 3),
    q63 INTEGER CHECK (q63 IS NULL OR q63 BETWEEN 1 AND 3),
    q64 INTEGER CHECK (q64 IS NULL OR q64 BETWEEN 1 AND 3),
    q65 INTEGER CHECK (q65 IS NULL OR q65 BETWEEN 1 AND 3),
    q66 INTEGER CHECK (q66 IS NULL OR q66 BETWEEN 1 AND 3),
    q67 INTEGER CHECK (q67 IS NULL OR q67 BETWEEN 1 AND 3),
    q68 INTEGER CHECK (q68 IS NULL OR q68 BETWEEN 1 AND 3),
    q69 INTEGER CHECK (q69 IS NULL OR q69 BETWEEN 1 AND 3),
    q70 INTEGER CHECK (q70 IS NULL OR q70 BETWEEN 1 AND 3),
    q71 INTEGER CHECK (q71 IS NULL OR q71 BETWEEN 1 AND 3),
    q72 INTEGER CHECK (q72 IS NULL OR q72 BETWEEN 1 AND 3),
    q73 INTEGER CHECK (q73 IS NULL OR q73 BETWEEN 1 AND 3),
    q74 INTEGER CHECK (q74 IS NULL OR q74 BETWEEN 1 AND 3),
    q75 INTEGER CHECK (q75 IS NULL OR q75 BETWEEN 1 AND 3),
    
    -- 9 Clinical Scale scores (raw scores)
    brief_a_inhibit INTEGER CHECK (brief_a_inhibit IS NULL OR brief_a_inhibit BETWEEN 8 AND 24),
    brief_a_shift INTEGER CHECK (brief_a_shift IS NULL OR brief_a_shift BETWEEN 6 AND 18),
    brief_a_emotional_control INTEGER CHECK (brief_a_emotional_control IS NULL OR brief_a_emotional_control BETWEEN 10 AND 30),
    brief_a_self_monitor INTEGER CHECK (brief_a_self_monitor IS NULL OR brief_a_self_monitor BETWEEN 6 AND 18),
    brief_a_initiate INTEGER CHECK (brief_a_initiate IS NULL OR brief_a_initiate BETWEEN 8 AND 24),
    brief_a_working_memory INTEGER CHECK (brief_a_working_memory IS NULL OR brief_a_working_memory BETWEEN 8 AND 24),
    brief_a_plan_organize INTEGER CHECK (brief_a_plan_organize IS NULL OR brief_a_plan_organize BETWEEN 10 AND 30),
    brief_a_task_monitor INTEGER CHECK (brief_a_task_monitor IS NULL OR brief_a_task_monitor BETWEEN 6 AND 18),
    brief_a_organization_materials INTEGER CHECK (brief_a_organization_materials IS NULL OR brief_a_organization_materials BETWEEN 8 AND 24),
    
    -- 3 Composite Index scores
    brief_a_bri INTEGER CHECK (brief_a_bri IS NULL OR brief_a_bri BETWEEN 30 AND 90),
    brief_a_mi INTEGER CHECK (brief_a_mi IS NULL OR brief_a_mi BETWEEN 40 AND 120),
    brief_a_gec INTEGER CHECK (brief_a_gec IS NULL OR brief_a_gec BETWEEN 75 AND 225),
    
    -- 3 Validity scales
    brief_a_negativity INTEGER CHECK (brief_a_negativity IS NULL OR brief_a_negativity BETWEEN 0 AND 10),
    brief_a_inconsistency INTEGER CHECK (brief_a_inconsistency IS NULL OR brief_a_inconsistency BETWEEN 0 AND 20),
    brief_a_infrequency INTEGER CHECK (brief_a_infrequency IS NULL OR brief_a_infrequency BETWEEN 0 AND 5),
    
    -- Metadata
    completed_by UUID REFERENCES user_profiles(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_schizophrenia_brief_a_visit_id ON schizophrenia_brief_a(visit_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_brief_a_patient_id ON schizophrenia_brief_a(patient_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_brief_a_completed_at ON schizophrenia_brief_a(completed_at);

-- Enable Row Level Security
ALTER TABLE schizophrenia_brief_a ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Patient Policies
-- ============================================================================

CREATE POLICY "Patients view own brief_a responses"
    ON schizophrenia_brief_a
    FOR SELECT
    USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own brief_a responses"
    ON schizophrenia_brief_a
    FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own brief_a responses"
    ON schizophrenia_brief_a
    FOR UPDATE
    USING (auth.uid() = patient_id);

-- ============================================================================
-- Professional Policies
-- ============================================================================

CREATE POLICY "Professionals view all brief_a responses"
    ON schizophrenia_brief_a
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals insert brief_a responses"
    ON schizophrenia_brief_a
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals update brief_a responses"
    ON schizophrenia_brief_a
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- ============================================================================
-- Trigger for updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_schizophrenia_brief_a_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_schizophrenia_brief_a_updated_at
    BEFORE UPDATE ON schizophrenia_brief_a
    FOR EACH ROW
    EXECUTE FUNCTION update_schizophrenia_brief_a_updated_at();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE schizophrenia_brief_a IS 'BRIEF-A - Behavior Rating Inventory of Executive Function - Adult. Hetero-questionnaire assessing executive functions through observed behaviors.';
COMMENT ON COLUMN schizophrenia_brief_a.brief_a_inhibit IS 'Inhibit scale (items 5,16,29,36,43,55,58,73, range 8-24)';
COMMENT ON COLUMN schizophrenia_brief_a.brief_a_shift IS 'Shift scale (items 8,22,32,44,61,67, range 6-18)';
COMMENT ON COLUMN schizophrenia_brief_a.brief_a_emotional_control IS 'Emotional Control scale (items 1,12,19,28,33,42,51,57,69,72, range 10-30)';
COMMENT ON COLUMN schizophrenia_brief_a.brief_a_self_monitor IS 'Self-Monitor scale (items 13,23,37,50,64,70, range 6-18)';
COMMENT ON COLUMN schizophrenia_brief_a.brief_a_initiate IS 'Initiate scale (items 6,14,20,25,45,49,53,62, range 8-24)';
COMMENT ON COLUMN schizophrenia_brief_a.brief_a_working_memory IS 'Working Memory scale (items 4,11,17,26,35,46,56,68, range 8-24)';
COMMENT ON COLUMN schizophrenia_brief_a.brief_a_plan_organize IS 'Plan/Organize scale (items 9,15,21,34,39,47,54,63,66,71, range 10-30)';
COMMENT ON COLUMN schizophrenia_brief_a.brief_a_task_monitor IS 'Task Monitor scale (items 2,18,24,41,52,75, range 6-18)';
COMMENT ON COLUMN schizophrenia_brief_a.brief_a_organization_materials IS 'Organization of Materials scale (items 3,7,30,31,40,60,65,74, range 8-24)';
COMMENT ON COLUMN schizophrenia_brief_a.brief_a_bri IS 'Behavioral Regulation Index (Inhibit+Shift+Emotional_Control+Self_Monitor, range 30-90)';
COMMENT ON COLUMN schizophrenia_brief_a.brief_a_mi IS 'Metacognition Index (Initiate+Working_Memory+Plan_Organize+Task_Monitor+Organization_Materials, range 40-120)';
COMMENT ON COLUMN schizophrenia_brief_a.brief_a_gec IS 'Global Executive Composite (BRI+MI, range 75-225)';
COMMENT ON COLUMN schizophrenia_brief_a.brief_a_negativity IS 'Negativity validity scale (count of items scored 3 in target set, elevated if >=6)';
COMMENT ON COLUMN schizophrenia_brief_a.brief_a_inconsistency IS 'Inconsistency validity scale (sum of absolute differences between pairs, elevated if >=8)';
COMMENT ON COLUMN schizophrenia_brief_a.brief_a_infrequency IS 'Infrequency validity scale (sum of binary flags, questionable if >=3)';
