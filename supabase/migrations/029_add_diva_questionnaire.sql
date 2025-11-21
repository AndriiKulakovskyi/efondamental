-- eFondaMental Platform - DIVA 2.0 Questionnaire Migration
-- Diagnostic Interview for ADHD in Adults (DIVA 2.0)

-- ============================================================================
-- Create DIVA 2.0 Table
-- ============================================================================

CREATE TABLE responses_diva (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- ========================================================================
    -- INTRODUCTION
    -- ========================================================================
    
    evaluated VARCHAR(20) CHECK (evaluated IN ('oui', 'non', 'ne_sais_pas')),
    
    -- ========================================================================
    -- CRITERION A - INATTENTION (A1a to A1i)
    -- ========================================================================
    
    -- A1a: Attention to details
    a1a_adult BOOLEAN,
    a1a_childhood BOOLEAN,
    
    -- A1b: Sustaining attention
    a1b_adult BOOLEAN,
    a1b_childhood BOOLEAN,
    
    -- A1c: Listening when spoken to
    a1c_adult BOOLEAN,
    a1c_childhood BOOLEAN,
    
    -- A1d: Following through on instructions
    a1d_adult BOOLEAN,
    a1d_childhood BOOLEAN,
    
    -- A1e: Organizing tasks
    a1e_adult BOOLEAN,
    a1e_childhood BOOLEAN,
    
    -- A1f: Avoiding sustained mental effort
    a1f_adult BOOLEAN,
    a1f_childhood BOOLEAN,
    
    -- A1g: Losing things
    a1g_adult BOOLEAN,
    a1g_childhood BOOLEAN,
    
    -- A1h: Easily distracted
    a1h_adult BOOLEAN,
    a1h_childhood BOOLEAN,
    
    -- A1i: Forgetful in daily activities
    a1i_adult BOOLEAN,
    a1i_childhood BOOLEAN,
    
    -- Total inattention score
    total_inattention_adult INTEGER CHECK (total_inattention_adult BETWEEN 0 AND 9),
    total_inattention_childhood INTEGER CHECK (total_inattention_childhood BETWEEN 0 AND 9),
    
    -- ========================================================================
    -- CRITERION A - HYPERACTIVITY/IMPULSIVITY (A2a to A2i)
    -- ========================================================================
    
    -- A2a: Fidgeting
    a2a_adult BOOLEAN,
    a2a_childhood BOOLEAN,
    
    -- A2b: Leaving seat
    a2b_adult BOOLEAN,
    a2b_childhood BOOLEAN,
    
    -- A2c: Running/climbing (or restlessness in adults)
    a2c_adult BOOLEAN,
    a2c_childhood BOOLEAN,
    
    -- A2d: Difficulty with quiet activities
    a2d_adult BOOLEAN,
    a2d_childhood BOOLEAN,
    
    -- A2e: On the go/driven by motor
    a2e_adult BOOLEAN,
    a2e_childhood BOOLEAN,
    
    -- A2f: Talks excessively
    a2f_adult BOOLEAN,
    a2f_childhood BOOLEAN,
    
    -- A2g: Blurts out answers
    a2g_adult BOOLEAN,
    a2g_childhood BOOLEAN,
    
    -- A2h: Difficulty waiting turn
    a2h_adult BOOLEAN,
    a2h_childhood BOOLEAN,
    
    -- A2i: Interrupts or intrudes
    a2i_adult BOOLEAN,
    a2i_childhood BOOLEAN,
    
    -- Total hyperactivity/impulsivity score
    total_hyperactivity_adult INTEGER CHECK (total_hyperactivity_adult BETWEEN 0 AND 9),
    total_hyperactivity_childhood INTEGER CHECK (total_hyperactivity_childhood BETWEEN 0 AND 9),
    
    -- ========================================================================
    -- SCORING - CHILDHOOD
    -- ========================================================================
    
    criteria_a_inattention_child_gte6 BOOLEAN,
    criteria_hi_hyperactivity_child_gte6 BOOLEAN,
    
    -- ========================================================================
    -- SCORING - ADULT
    -- ========================================================================
    
    criteria_a_inattention_adult_gte6 BOOLEAN,
    criteria_hi_hyperactivity_adult_gte6 BOOLEAN,
    
    -- ========================================================================
    -- GENERAL CRITERIA
    -- ========================================================================
    
    -- Criterion B: Lifetime persistence
    criteria_b_lifetime_persistence BOOLEAN,
    
    -- Criteria C & D: Impairment in multiple settings
    criteria_cd_impairment_childhood BOOLEAN,
    criteria_cd_impairment_adult BOOLEAN,
    
    -- Criterion E: Not better explained by another disorder
    criteria_e_better_explained BOOLEAN,
    criteria_e_explanation TEXT,
    
    -- ========================================================================
    -- COLLATERAL INFORMATION
    -- ========================================================================
    
    collateral_parents INTEGER CHECK (collateral_parents BETWEEN -1 AND 2),
    collateral_partner INTEGER CHECK (collateral_partner BETWEEN -1 AND 2),
    collateral_school_reports INTEGER CHECK (collateral_school_reports BETWEEN -1 AND 2),
    
    -- ========================================================================
    -- FINAL DIAGNOSIS
    -- ========================================================================
    
    final_diagnosis VARCHAR(50) CHECK (final_diagnosis IN (
        'non',
        'combine',
        'inattentif',
        'hyperactif'
    )),
    
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

ALTER TABLE responses_diva ENABLE ROW LEVEL SECURITY;

-- Healthcare professionals can view DIVA responses
CREATE POLICY "Healthcare professionals can view DIVA responses"
    ON responses_diva FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- Healthcare professionals can insert DIVA responses
CREATE POLICY "Healthcare professionals can insert DIVA responses"
    ON responses_diva FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Healthcare professionals can update DIVA responses
CREATE POLICY "Healthcare professionals can update DIVA responses"
    ON responses_diva FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Patients can view their own DIVA responses
CREATE POLICY "Patients can view own DIVA responses"
    ON responses_diva FOR SELECT
    USING (auth.uid() = patient_id);

-- ============================================================================
-- Update trigger
-- ============================================================================

CREATE TRIGGER update_responses_diva_updated_at BEFORE UPDATE ON responses_diva
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


