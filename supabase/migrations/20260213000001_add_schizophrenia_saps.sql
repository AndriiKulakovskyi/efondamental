-- Migration: Add schizophrenia_saps table for SAPS questionnaire
-- SAPS (Scale for the Assessment of Positive Symptoms)
-- Author: N.C. Andreasen
-- French translation: P. Boyer and Y. Lecrubier

-- Create schizophrenia_saps table
CREATE TABLE IF NOT EXISTS public.schizophrenia_saps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE UNIQUE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    
    -- Test administration
    test_done BOOLEAN DEFAULT false,
    
    -- Hallucinations (items 1-7)
    q1 INTEGER CHECK (q1 >= 0 AND q1 <= 5),
    q2 INTEGER CHECK (q2 >= 0 AND q2 <= 5),
    q3 INTEGER CHECK (q3 >= 0 AND q3 <= 5),
    q4 INTEGER CHECK (q4 >= 0 AND q4 <= 5),
    q5 INTEGER CHECK (q5 >= 0 AND q5 <= 5),
    q6 INTEGER CHECK (q6 >= 0 AND q6 <= 5),
    q7 INTEGER CHECK (q7 >= 0 AND q7 <= 5),
    
    -- Delusions (items 8-20)
    q8 INTEGER CHECK (q8 >= 0 AND q8 <= 5),
    q9 INTEGER CHECK (q9 >= 0 AND q9 <= 5),
    q10 INTEGER CHECK (q10 >= 0 AND q10 <= 5),
    q11 INTEGER CHECK (q11 >= 0 AND q11 <= 5),
    q12 INTEGER CHECK (q12 >= 0 AND q12 <= 5),
    q13 INTEGER CHECK (q13 >= 0 AND q13 <= 5),
    q14 INTEGER CHECK (q14 >= 0 AND q14 <= 5),
    q15 INTEGER CHECK (q15 >= 0 AND q15 <= 5),
    q16 INTEGER CHECK (q16 >= 0 AND q16 <= 5),
    q17 INTEGER CHECK (q17 >= 0 AND q17 <= 5),
    q18 INTEGER CHECK (q18 >= 0 AND q18 <= 5),
    q19 INTEGER CHECK (q19 >= 0 AND q19 <= 5),
    q20 INTEGER CHECK (q20 >= 0 AND q20 <= 5),
    
    -- Bizarre Behavior (items 21-25)
    q21 INTEGER CHECK (q21 >= 0 AND q21 <= 5),
    q22 INTEGER CHECK (q22 >= 0 AND q22 <= 5),
    q23 INTEGER CHECK (q23 >= 0 AND q23 <= 5),
    q24 INTEGER CHECK (q24 >= 0 AND q24 <= 5),
    q25 INTEGER CHECK (q25 >= 0 AND q25 <= 5),
    
    -- Positive Formal Thought Disorder (items 26-34)
    q26 INTEGER CHECK (q26 >= 0 AND q26 <= 5),
    q27 INTEGER CHECK (q27 >= 0 AND q27 <= 5),
    q28 INTEGER CHECK (q28 >= 0 AND q28 <= 5),
    q29 INTEGER CHECK (q29 >= 0 AND q29 <= 5),
    q30 INTEGER CHECK (q30 >= 0 AND q30 <= 5),
    q31 INTEGER CHECK (q31 >= 0 AND q31 <= 5),
    q32 INTEGER CHECK (q32 >= 0 AND q32 <= 5),
    q33 INTEGER CHECK (q33 >= 0 AND q33 <= 5),
    q34 INTEGER CHECK (q34 >= 0 AND q34 <= 5),
    
    -- Scores
    hallucinations_subscore INTEGER,
    delusions_subscore INTEGER,
    bizarre_behavior_subscore INTEGER,
    thought_disorder_subscore INTEGER,
    total_score INTEGER,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on visit_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_schizophrenia_saps_visit_id ON public.schizophrenia_saps(visit_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_saps_patient_id ON public.schizophrenia_saps(patient_id);

-- Enable Row Level Security
ALTER TABLE public.schizophrenia_saps ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Patients view own SAPS responses" ON public.schizophrenia_saps;
CREATE POLICY "Patients view own SAPS responses"
    ON public.schizophrenia_saps
    FOR SELECT
    USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Professionals insert SAPS responses" ON public.schizophrenia_saps;
CREATE POLICY "Professionals insert SAPS responses"
    ON public.schizophrenia_saps
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = ANY (ARRAY['healthcare_professional'::public.user_role, 'manager'::public.user_role, 'administrator'::public.user_role])
        )
    );

DROP POLICY IF EXISTS "Professionals update SAPS responses" ON public.schizophrenia_saps;
CREATE POLICY "Professionals update SAPS responses"
    ON public.schizophrenia_saps
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = ANY (ARRAY['healthcare_professional'::public.user_role, 'manager'::public.user_role, 'administrator'::public.user_role])
        )
    );

DROP POLICY IF EXISTS "Professionals view SAPS responses" ON public.schizophrenia_saps;
CREATE POLICY "Professionals view SAPS responses"
    ON public.schizophrenia_saps
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = ANY (ARRAY['healthcare_professional'::public.user_role, 'manager'::public.user_role, 'administrator'::public.user_role])
        )
    );


-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.schizophrenia_saps TO authenticated;

-- Add trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.schizophrenia_saps
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
