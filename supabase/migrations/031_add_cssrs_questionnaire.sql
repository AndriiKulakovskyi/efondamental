-- eFondaMental Platform - C-SSRS (Columbia-Suicide Severity Rating Scale) Migration
-- Standardized assessment for suicidal ideation and behavior

-- ============================================================================
-- Create C-SSRS Table
-- ============================================================================

CREATE TABLE responses_cssrs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- ========================================================================
    -- SUICIDAL IDEATION (Idéation Suicidaire)
    -- ========================================================================
    
    -- Questions 1-5: Types of Suicidal Ideation
    q1_wish_dead BOOLEAN, -- Désir d'être mort(e)
    q2_non_specific BOOLEAN, -- Pensées suicidaires actives non spécifiques
    q3_method_no_intent BOOLEAN, -- Idéation avec méthodes sans intention
    q4_intent_no_plan BOOLEAN, -- Idéation avec intention sans scénario
    q5_plan_intent BOOLEAN, -- Idéation avec scénario et intention
    
    -- ========================================================================
    -- INTENSITY OF IDEATION (Intensité de l'idéation)
    -- ========================================================================
    
    -- Most severe ideation (1-5)
    int_most_severe INTEGER CHECK (int_most_severe BETWEEN 1 AND 5),
    
    -- Frequency (Fréquence)
    int_frequency INTEGER CHECK (int_frequency BETWEEN 1 AND 5),
    
    -- Duration (Durée)
    int_duration INTEGER CHECK (int_duration BETWEEN 1 AND 5),
    
    -- Control over thoughts (Maîtrise)
    int_control INTEGER CHECK (int_control IN (0, 1, 2, 3, 4, 5)), -- 0 = doesn't try to control, 1-5 = levels of control
    
    -- Deterrents (Éléments dissuasifs)
    int_deterrents INTEGER CHECK (int_deterrents BETWEEN 1 AND 5),
    
    -- Causes/Reasons (Causes de l'idéation)
    int_causes INTEGER CHECK (int_causes BETWEEN 0 AND 5), -- 0 = N/A, 1-5 = levels of motivation
    
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

ALTER TABLE responses_cssrs ENABLE ROW LEVEL SECURITY;

-- Healthcare professionals can view C-SSRS responses
CREATE POLICY "Healthcare professionals can view C-SSRS responses"
    ON responses_cssrs FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- Healthcare professionals can insert C-SSRS responses
CREATE POLICY "Healthcare professionals can insert C-SSRS responses"
    ON responses_cssrs FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Healthcare professionals can update C-SSRS responses
CREATE POLICY "Healthcare professionals can update C-SSRS responses"
    ON responses_cssrs FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Patients can view their own C-SSRS responses
CREATE POLICY "Patients can view own C-SSRS responses"
    ON responses_cssrs FOR SELECT
    USING (auth.uid() = patient_id);

-- ============================================================================
-- Update trigger
-- ============================================================================

CREATE TRIGGER update_responses_cssrs_updated_at BEFORE UPDATE ON responses_cssrs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- Comments
-- ============================================================================

COMMENT ON TABLE responses_cssrs IS 'C-SSRS (Columbia-Suicide Severity Rating Scale) - Assessment of suicidal ideation and behavior';
COMMENT ON COLUMN responses_cssrs.q1_wish_dead IS 'Wish to be dead';
COMMENT ON COLUMN responses_cssrs.q2_non_specific IS 'Non-specific active suicidal thoughts';
COMMENT ON COLUMN responses_cssrs.q3_method_no_intent IS 'Active suicidal ideation with methods without intent';
COMMENT ON COLUMN responses_cssrs.q4_intent_no_plan IS 'Active suicidal ideation with intent without specific plan';
COMMENT ON COLUMN responses_cssrs.q5_plan_intent IS 'Active suicidal ideation with specific plan and intent';
COMMENT ON COLUMN responses_cssrs.int_most_severe IS 'Most severe type of ideation (1-5)';
COMMENT ON COLUMN responses_cssrs.int_frequency IS 'Frequency of thoughts (1-5: less than weekly to multiple times daily)';
COMMENT ON COLUMN responses_cssrs.int_duration IS 'Duration of thoughts (1-5: seconds/minutes to constant)';
COMMENT ON COLUMN responses_cssrs.int_control IS 'Control over suicidal thoughts (0: doesnt try, 1-5: easy to no control)';
COMMENT ON COLUMN responses_cssrs.int_deterrents IS 'Deterrents preventing action (1-5: definitely stopped to not stopped at all)';
COMMENT ON COLUMN responses_cssrs.int_causes IS 'Reasons for suicidal ideation (0: N/A, 1-5: attention-seeking to end pain)';


