-- Migration: Add schizophrenia_isa_suivi table for annual follow-up ISA questionnaire
-- This is a distinct, shorter questionnaire from the initial ISA (schizophrenia_isa),
-- scoped to events since the last visit with only 2 timing options.

CREATE TABLE public.schizophrenia_isa_suivi (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,

    -- Q1: vie ne vaut pas la peine d'être vécue depuis la dernière visite
    q1 INTEGER,
    -- Q2: timing follow-up for q1
    q2 INTEGER,

    -- Q3: souhait de mourir depuis la dernière visite
    q3 INTEGER,
    -- Q4: timing follow-up for q3
    q4 INTEGER,

    -- Q5: pensé à se donner la mort depuis la dernière visite
    q5 INTEGER,
    -- Q6: timing follow-up for q5
    q6 INTEGER,

    -- Q7: sérieusement envisagé / planifié depuis la dernière visite
    q7 INTEGER,
    -- Q8: timing follow-up for q7
    q8 INTEGER,

    -- Q9: essayé de se donner la mort depuis la dernière visite
    q9 INTEGER,
    -- Q10: timing follow-up for q9
    q10 INTEGER,

    -- Metadata
    completed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    UNIQUE(visit_id)
);

-- RLS
ALTER TABLE public.schizophrenia_isa_suivi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can view ISA suivi responses"
    ON public.schizophrenia_isa_suivi FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid()
            AND up.role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals can insert ISA suivi responses"
    ON public.schizophrenia_isa_suivi FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid()
            AND up.role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals can update ISA suivi responses"
    ON public.schizophrenia_isa_suivi FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid()
            AND up.role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Patients can view own ISA suivi responses"
    ON public.schizophrenia_isa_suivi FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.patients p
            WHERE p.id = patient_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can insert own ISA suivi responses"
    ON public.schizophrenia_isa_suivi FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.patients p
            WHERE p.id = patient_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can update own ISA suivi responses"
    ON public.schizophrenia_isa_suivi FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.patients p
            WHERE p.id = patient_id
            AND p.user_id = auth.uid()
        )
    );

-- updated_at trigger
CREATE TRIGGER update_schizophrenia_isa_suivi_updated_at
    BEFORE UPDATE ON public.schizophrenia_isa_suivi
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Permissions
GRANT ALL ON public.schizophrenia_isa_suivi TO authenticated;
GRANT ALL ON public.schizophrenia_isa_suivi TO service_role;
