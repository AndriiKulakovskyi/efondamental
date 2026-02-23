-- Migration: Add schizophrenia_uku table for UKU questionnaire
-- UKU (Udvalg for Kliniske Undersøgelser Side Effect Rating Scale)
-- EFFETS INDESIRABLES DU TRAITEMENT

-- Create schizophrenia_uku table
CREATE TABLE IF NOT EXISTS public.schizophrenia_uku (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE UNIQUE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    
    -- Test administration
    test_done BOOLEAN DEFAULT false,
    
    -- Section 1 - Symptômes psychiques
    q1_1 INTEGER CHECK (q1_1 >= 0 AND q1_1 <= 3),
    q1_2 INTEGER CHECK (q1_2 >= 0 AND q1_2 <= 3),
    q1_3 INTEGER CHECK (q1_3 >= 0 AND q1_3 <= 3),
    q1_9 INTEGER CHECK (q1_9 >= 0 AND q1_9 <= 3),
    
    -- Section 3 - Symptômes autonomes
    q3_3 INTEGER CHECK (q3_3 >= 0 AND q3_3 <= 3),
    q3_4 INTEGER CHECK (q3_4 >= 0 AND q3_4 <= 3),
    q3_5 INTEGER CHECK (q3_5 >= 0 AND q3_5 <= 3),
    q3_6 INTEGER CHECK (q3_6 >= 0 AND q3_6 <= 3),
    q3_7 INTEGER CHECK (q3_7 >= 0 AND q3_7 <= 3),
    q3_8 INTEGER CHECK (q3_8 >= 0 AND q3_8 <= 3),
    q3_9 INTEGER CHECK (q3_9 >= 0 AND q3_9 <= 3),
    q3_10 INTEGER CHECK (q3_10 >= 0 AND q3_10 <= 3),
    q3_11 INTEGER CHECK (q3_11 >= 0 AND q3_11 <= 3),
    
    -- Section 4 - Autres effets indésirables
    q4_3 INTEGER CHECK (q4_3 >= 0 AND q4_3 <= 3),
    q4_5 INTEGER CHECK (q4_5 >= 0 AND q4_5 <= 3),
    q4_8 INTEGER CHECK (q4_8 >= 0 AND q4_8 <= 3),
    q4_9 INTEGER CHECK (q4_9 >= 0 AND q4_9 <= 3),
    q4_10 INTEGER CHECK (q4_10 >= 0 AND q4_10 <= 3),
    q4_12 INTEGER CHECK (q4_12 >= 0 AND q4_12 <= 3),
    q4_13 INTEGER CHECK (q4_13 >= 0 AND q4_13 <= 3),
    q4_14 INTEGER CHECK (q4_14 >= 0 AND q4_14 <= 3),
    q4_14_type TEXT CHECK (q4_14_type IN ('a', 'b')),
    q4_15 INTEGER CHECK (q4_15 >= 0 AND q4_15 <= 3),
    q4_17 INTEGER CHECK (q4_17 >= 0 AND q4_17 <= 3),
    q4_17_type TEXT CHECK (q4_17_type IN ('a', 'b', 'c')),
    
    -- Scores
    psychic_subscore INTEGER,
    autonomic_subscore INTEGER,
    other_subscore INTEGER,
    total_score INTEGER,
    
    -- Metadata
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_schizophrenia_uku_visit_id ON public.schizophrenia_uku(visit_id);
CREATE INDEX IF NOT EXISTS idx_schizophrenia_uku_patient_id ON public.schizophrenia_uku(patient_id);

-- Enable Row Level Security
ALTER TABLE public.schizophrenia_uku ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Patients view own UKU responses" ON public.schizophrenia_uku;
CREATE POLICY "Patients view own UKU responses"
    ON public.schizophrenia_uku
    FOR SELECT
    USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Professionals insert UKU responses" ON public.schizophrenia_uku;
CREATE POLICY "Professionals insert UKU responses"
    ON public.schizophrenia_uku
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = ANY (ARRAY['healthcare_professional'::public.user_role, 'manager'::public.user_role, 'administrator'::public.user_role])
        )
    );

DROP POLICY IF EXISTS "Professionals update UKU responses" ON public.schizophrenia_uku;
CREATE POLICY "Professionals update UKU responses"
    ON public.schizophrenia_uku
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = ANY (ARRAY['healthcare_professional'::public.user_role, 'manager'::public.user_role, 'administrator'::public.user_role])
        )
    );

DROP POLICY IF EXISTS "Professionals view UKU responses" ON public.schizophrenia_uku;
CREATE POLICY "Professionals view UKU responses"
    ON public.schizophrenia_uku
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles
            WHERE user_profiles.id = auth.uid()
            AND user_profiles.role = ANY (ARRAY['healthcare_professional'::public.user_role, 'manager'::public.user_role, 'administrator'::public.user_role])
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.schizophrenia_uku TO authenticated;

-- Add trigger for updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.schizophrenia_uku
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
