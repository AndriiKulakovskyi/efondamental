-- Migration: Add schizophrenia_sans table for SANS questionnaire
-- SANS (Scale for the Assessment of Negative Symptoms)
-- Author: N.C. Andreasen
-- French translation: P. Boyer and Y. Lecrubier

-- Create schizophrenia_sans table
CREATE TABLE IF NOT EXISTS public.schizophrenia_sans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE UNIQUE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    
    -- Test administration
    test_done BOOLEAN DEFAULT false,
    
    -- Retrait ou pauvreté affective (items 1-8, item 8 = global evaluation)
    q1 INTEGER CHECK (q1 >= 0 AND q1 <= 5),
    q2 INTEGER CHECK (q2 >= 0 AND q2 <= 5),
    q3 INTEGER CHECK (q3 >= 0 AND q3 <= 5),
    q4 INTEGER CHECK (q4 >= 0 AND q4 <= 5),
    q5 INTEGER CHECK (q5 >= 0 AND q5 <= 5),
    q6 INTEGER CHECK (q6 >= 0 AND q6 <= 5),
    q7 INTEGER CHECK (q7 >= 0 AND q7 <= 5),
    q8 INTEGER CHECK (q8 >= 0 AND q8 <= 5),
    
    -- Alogie (items 9-13, item 13 = global evaluation)
    q9 INTEGER CHECK (q9 >= 0 AND q9 <= 5),
    q10 INTEGER CHECK (q10 >= 0 AND q10 <= 5),
    q11 INTEGER CHECK (q11 >= 0 AND q11 <= 5),
    q12 INTEGER CHECK (q12 >= 0 AND q12 <= 5),
    q13 INTEGER CHECK (q13 >= 0 AND q13 <= 5),
    
    -- Avolition - Apathie (items 14-17, item 17 = global evaluation)
    q14 INTEGER CHECK (q14 >= 0 AND q14 <= 5),
    q15 INTEGER CHECK (q15 >= 0 AND q15 <= 5),
    q16 INTEGER CHECK (q16 >= 0 AND q16 <= 5),
    q17 INTEGER CHECK (q17 >= 0 AND q17 <= 5),
    
    -- Anhédonie - Retrait social (items 18-22, item 22 = global evaluation)
    q18 INTEGER CHECK (q18 >= 0 AND q18 <= 5),
    q19 INTEGER CHECK (q19 >= 0 AND q19 <= 5),
    q20 INTEGER CHECK (q20 >= 0 AND q20 <= 5),
    q21 INTEGER CHECK (q21 >= 0 AND q21 <= 5),
    q22 INTEGER CHECK (q22 >= 0 AND q22 <= 5),
    
    -- Attention (items 23-25, item 25 = global evaluation)
    q23 INTEGER CHECK (q23 >= 0 AND q23 <= 5),
    q24 INTEGER CHECK (q24 >= 0 AND q24 <= 5),
    q25 INTEGER CHECK (q25 >= 0 AND q25 <= 5),
    
    -- Scores
    affective_flattening_subscore INTEGER,
    alogia_subscore INTEGER,
    avolition_subscore INTEGER,
    anhedonia_subscore INTEGER,
    attention_subscore INTEGER,
    subscores_sum INTEGER,
    global_evaluations_score INTEGER,
    total_score INTEGER,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on visit_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_schizophrenia_sans_visit_id ON public.schizophrenia_sans(visit_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_sans_patient_id ON public.schizophrenia_sans(patient_id);

-- Enable Row Level Security
ALTER TABLE public.schizophrenia_sans ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Patients view own SANS responses" ON public.schizophrenia_sans;
CREATE POLICY "Patients view own SANS responses"
    ON public.schizophrenia_sans
    FOR SELECT
    USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Professionals insert SANS responses" ON public.schizophrenia_sans;
CREATE POLICY "Professionals insert SANS responses"
    ON public.schizophrenia_sans
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = ANY (ARRAY['healthcare_professional'::public.user_role, 'manager'::public.user_role, 'administrator'::public.user_role])
        )
    );

DROP POLICY IF EXISTS "Professionals update SANS responses" ON public.schizophrenia_sans;
CREATE POLICY "Professionals update SANS responses"
    ON public.schizophrenia_sans
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = ANY (ARRAY['healthcare_professional'::public.user_role, 'manager'::public.user_role, 'administrator'::public.user_role])
        )
    );

DROP POLICY IF EXISTS "Professionals view SANS responses" ON public.schizophrenia_sans;
CREATE POLICY "Professionals view SANS responses"
    ON public.schizophrenia_sans
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = ANY (ARRAY['healthcare_professional'::public.user_role, 'manager'::public.user_role, 'administrator'::public.user_role])
        )
    );


-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.schizophrenia_sans TO authenticated;

-- Add trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.schizophrenia_sans
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
