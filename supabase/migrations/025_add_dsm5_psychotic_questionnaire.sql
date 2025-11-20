-- eFondaMental Platform - DSM5 Psychotic Disorders Questionnaire Migration
-- DSM5 Trouble Psychotique for bipolar disorder initial evaluation

-- ============================================================================
-- Create DSM5 Psychotic Disorders Table
-- ============================================================================

CREATE TABLE responses_dsm5_psychotic (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Main question
    has_psychotic_disorder VARCHAR(20) CHECK (has_psychotic_disorder IN ('oui', 'non', 'ne_sais_pas')),
    
    -- If yes, specify details
    psychotic_disorder_date DATE,
    
    disorder_type VARCHAR(100) CHECK (disorder_type IN (
        'schizophrenie',
        'trouble_schizophreniforme',
        'trouble_schizo_affectif',
        'troubles_delirants',
        'trouble_psychotique_bref',
        'trouble_psychotique_partage',
        'trouble_psychotique_affection_medicale',
        'trouble_psychotique_substance',
        'trouble_psychotique_non_specifie'
    )),
    
    symptoms_past_month VARCHAR(20) CHECK (symptoms_past_month IN ('oui', 'non', 'ne_sais_pas')),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_dsm5_psychotic ENABLE ROW LEVEL SECURITY;

-- Healthcare professionals can view DSM5 psychotic responses
CREATE POLICY "Healthcare professionals can view DSM5 psychotic responses"
    ON responses_dsm5_psychotic FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator', 'manager'))
    );

-- Healthcare professionals can insert DSM5 psychotic responses
CREATE POLICY "Healthcare professionals can insert DSM5 psychotic responses"
    ON responses_dsm5_psychotic FOR INSERT
    WITH CHECK (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Healthcare professionals can update DSM5 psychotic responses
CREATE POLICY "Healthcare professionals can update DSM5 psychotic responses"
    ON responses_dsm5_psychotic FOR UPDATE
    USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('healthcare_professional', 'administrator'))
    );

-- Patients can view their own DSM5 psychotic responses
CREATE POLICY "Patients can view own DSM5 psychotic responses"
    ON responses_dsm5_psychotic FOR SELECT
    USING (auth.uid() = patient_id);

-- ============================================================================
-- Update trigger
-- ============================================================================

CREATE TRIGGER update_responses_dsm5_psychotic_updated_at BEFORE UPDATE ON responses_dsm5_psychotic
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

