-- ============================================================================
-- eFondaMental Platform - WAIS-III Clinical Criteria Questionnaire Migration
-- ============================================================================
-- This migration creates the table for WAIS-III Clinical Criteria
-- Identical structure to WAIS-IV Criteria but stored separately
-- ============================================================================

-- Create WAIS-III Clinical Criteria table
CREATE TABLE responses_wais3_criteria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
    
    -- Q1: Date of data collection
    collection_date DATE NOT NULL,
    
    -- Q2: Patient age
    age INTEGER NOT NULL CHECK (age BETWEEN 16 AND 90),
    
    -- Q3: Laterality
    laterality VARCHAR(20) NOT NULL CHECK (laterality IN ('gaucher', 'droitier', 'ambidextre')),
    
    -- Q4: French as native language
    native_french_speaker INTEGER NOT NULL CHECK (native_french_speaker IN (0, 1)),
    
    -- Q5: Time since last patient state evaluation
    time_since_last_eval VARCHAR(20) NOT NULL CHECK (time_since_last_eval IN ('moins_semaine', 'plus_semaine')),
    
    -- Q6: Patient euthymic
    patient_euthymic INTEGER NOT NULL CHECK (patient_euthymic IN (0, 1)),
    
    -- Q7: No episode in previous 3 months
    no_episode_3months INTEGER NOT NULL CHECK (no_episode_3months IN (0, 1)),
    
    -- Q8: Socio-professional data present
    socio_prof_data_present INTEGER NOT NULL CHECK (socio_prof_data_present IN (0, 1)),
    
    -- Q9: Years of education
    years_of_education INTEGER NOT NULL CHECK (years_of_education >= 0),
    
    -- Q10: No colorblindness or disabling visual impairment
    no_visual_impairment INTEGER NOT NULL CHECK (no_visual_impairment IN (0, 1)),
    
    -- Q11: No unaided hearing disorders
    no_hearing_impairment INTEGER NOT NULL CHECK (no_hearing_impairment IN (0, 1)),
    
    -- Q12: No ECT in past year
    no_ect_past_year INTEGER NOT NULL CHECK (no_ect_past_year IN (0, 1)),
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_responses_wais3_criteria_visit ON responses_wais3_criteria(visit_id);
CREATE INDEX idx_responses_wais3_criteria_patient ON responses_wais3_criteria(patient_id);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_wais3_criteria ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own WAIS-3 criteria" 
ON responses_wais3_criteria FOR SELECT 
USING (auth.uid() = patient_id);

-- Professionals can view all responses
CREATE POLICY "Pros view all WAIS-3 criteria" 
ON responses_wais3_criteria FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can insert responses
CREATE POLICY "Pros insert WAIS-3 criteria" 
ON responses_wais3_criteria FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('healthcare_professional', 'manager', 'administrator')
    )
);

-- Professionals can update responses
CREATE POLICY "Pros update WAIS-3 criteria" 
ON responses_wais3_criteria FOR UPDATE 
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

CREATE TRIGGER update_responses_wais3_criteria_updated_at
    BEFORE UPDATE ON responses_wais3_criteria
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

