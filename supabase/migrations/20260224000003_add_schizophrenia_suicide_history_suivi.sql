-- Migration: Add schizophrenia_suicide_history_suivi table for annual follow-up
-- Tracks suicide attempts since last visit (vs. lifetime history in schizophrenia_suicide_history).

CREATE TABLE public.schizophrenia_suicide_history_suivi (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,

    -- Q1: number of attempts since last visit
    q1_attempt_count INTEGER,

    -- Q2: violent attempts
    q2_violent_attempts TEXT,
    -- Q2 follow-up: count of violent attempts (conditional on q2 = oui)
    q2_1_violent_count INTEGER,

    -- Q3: serious (non-violent) attempts requiring ICU
    q3_serious_attempts TEXT,
    -- Q3 follow-up: count of serious attempts (conditional on q3 = oui)
    q3_1_serious_count INTEGER,

    -- Metadata
    completed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,

    UNIQUE(visit_id)
);

-- RLS
ALTER TABLE public.schizophrenia_suicide_history_suivi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can view suicide history suivi responses"
    ON public.schizophrenia_suicide_history_suivi FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid()
            AND up.role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals can insert suicide history suivi responses"
    ON public.schizophrenia_suicide_history_suivi FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid()
            AND up.role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals can update suicide history suivi responses"
    ON public.schizophrenia_suicide_history_suivi FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid()
            AND up.role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Patients can view own suicide history suivi responses"
    ON public.schizophrenia_suicide_history_suivi FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.patients p
            WHERE p.id = patient_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can insert own suicide history suivi responses"
    ON public.schizophrenia_suicide_history_suivi FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.patients p
            WHERE p.id = patient_id
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can update own suicide history suivi responses"
    ON public.schizophrenia_suicide_history_suivi FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.patients p
            WHERE p.id = patient_id
            AND p.user_id = auth.uid()
        )
    );

-- updated_at trigger
CREATE TRIGGER update_schizophrenia_suicide_history_suivi_updated_at
    BEFORE UPDATE ON public.schizophrenia_suicide_history_suivi
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Permissions
GRANT ALL ON public.schizophrenia_suicide_history_suivi TO authenticated;
GRANT ALL ON public.schizophrenia_suicide_history_suivi TO service_role;
