-- ============================================================================
-- Update Orientation Questionnaire for Bipolar Disorder
-- ============================================================================
-- Code: EBIP_SCR_ORIENT
-- Specific to bipolar disorder screening visits
-- ============================================================================

-- Drop the old table (cascade will remove associated policies and triggers)
DROP TABLE IF EXISTS responses_orientation CASCADE;

-- Create the new bipolar-specific orientation table
CREATE TABLE responses_bipolar_orientation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- 1. Patient suffering from bipolar disorder or suspicion
    trouble_bipolaire_ou_suspicion VARCHAR(10) CHECK (trouble_bipolaire_ou_suspicion IN ('oui', 'non')) NOT NULL,

    -- 2. Thymic state compatible with evaluation
    etat_thymique_compatible VARCHAR(10) CHECK (etat_thymique_compatible IN ('oui', 'non')) NOT NULL,

    -- 3. 100% coverage or patient agrees to assume costs
    prise_en_charge_100_ou_accord VARCHAR(10) CHECK (prise_en_charge_100_ou_accord IN ('oui', 'non')) NOT NULL,

    -- 4. Patient agreement for evaluation in expert center
    accord_evaluation_centre_expert VARCHAR(10) CHECK (accord_evaluation_centre_expert IN ('oui', 'non')) NOT NULL,

    -- 5. Patient agreement for report transmission to referring psychiatrist
    accord_transmission_cr VARCHAR(10) CHECK (accord_transmission_cr IN ('oui', 'non')) NOT NULL,

    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE responses_bipolar_orientation ENABLE ROW LEVEL SECURITY;

-- Professional Policies (Select/Insert/Update)
CREATE POLICY "Pros view bipolar orientation" ON responses_bipolar_orientation
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Pros insert bipolar orientation" ON responses_bipolar_orientation
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

CREATE POLICY "Pros update bipolar orientation" ON responses_bipolar_orientation
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- Patient Policies (View only)
CREATE POLICY "Patients view bipolar orientation" ON responses_bipolar_orientation
    FOR SELECT USING (auth.uid() = patient_id);

-- Trigger for updated_at
CREATE TRIGGER update_responses_bipolar_orientation_modtime 
BEFORE UPDATE ON responses_bipolar_orientation 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

