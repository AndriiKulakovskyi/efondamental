-- Migration pour ajouter le questionnaire ONAPS (Activité Physique) pour la Schizophrénie

-- 1. Create the table for ONAPS responses
CREATE TABLE public.schizophrenia_onaps (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    
    -- Status
    questionnaire_done TEXT,
    
    -- Partie A : activités au travail
    work_vigorous_days INTEGER,
    work_vigorous_hours INTEGER,
    work_vigorous_minutes INTEGER,
    work_moderate_days INTEGER,
    work_moderate_hours INTEGER,
    work_moderate_minutes INTEGER,
    work_sitting_hours INTEGER,
    work_sitting_minutes INTEGER,

    -- Partie B : Déplacements à but utilitaire
    transport_walking_days INTEGER,
    transport_walking_hours INTEGER,
    transport_walking_minutes INTEGER,
    transport_bicycle_days INTEGER,
    transport_bicycle_hours INTEGER,
    transport_bicycle_minutes INTEGER,
    transport_motorized_days INTEGER,
    transport_motorized_hours INTEGER,
    transport_motorized_minutes INTEGER,

    -- Partie C : Activités de loisirs ou au domicile
    leisure_vigorous_days INTEGER,
    leisure_vigorous_hours INTEGER,
    leisure_vigorous_minutes INTEGER,
    leisure_moderate_days INTEGER,
    leisure_moderate_hours INTEGER,
    leisure_moderate_minutes INTEGER,
    leisure_screen_days INTEGER,
    leisure_screen_hours INTEGER,
    leisure_screen_minutes INTEGER,
    leisure_other_days INTEGER,
    leisure_other_hours INTEGER,
    leisure_other_minutes INTEGER,

    -- Computed scores (Durées)
    vpa_duration INTEGER,
    mpa_duration INTEGER,
    mvpa_duration INTEGER,
    
    -- Computed scores (METs)
    vpamet INTEGER,
    mpamet INTEGER,
    aptot INTEGER,
    
    -- Computed scores (Sédentarité)
    sb_duration INTEGER,
    
    -- Interpretations
    mvpa_interpretation TEXT,
    aptot_interpretation TEXT,
    sedentarity_interpretation TEXT,
    
    -- Metadata constraints
    completed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure one response per visit
    UNIQUE(visit_id)
);

-- 2. Add RLS policies
ALTER TABLE public.schizophrenia_onaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Professionals can view ONAPS responses" 
    ON public.schizophrenia_onaps FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid() 
            AND up.role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals can insert ONAPS responses" 
    ON public.schizophrenia_onaps FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid() 
            AND up.role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Professionals can update ONAPS responses" 
    ON public.schizophrenia_onaps FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            WHERE up.id = auth.uid() 
            AND up.role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

CREATE POLICY "Patients can view own ONAPS responses" 
    ON public.schizophrenia_onaps FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.patients p
            WHERE p.id = patient_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can insert own ONAPS responses" 
    ON public.schizophrenia_onaps FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.patients p
            WHERE p.id = patient_id 
            AND p.user_id = auth.uid()
        )
    );

CREATE POLICY "Patients can update own ONAPS responses" 
    ON public.schizophrenia_onaps FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.patients p
            WHERE p.id = patient_id 
            AND p.user_id = auth.uid()
        )
    );

-- 3. Create updated_at trigger
CREATE TRIGGER update_schizophrenia_onaps_updated_at
    BEFORE UPDATE ON public.schizophrenia_onaps
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 4. Grant permissions
GRANT ALL ON public.schizophrenia_onaps TO authenticated;
GRANT ALL ON public.schizophrenia_onaps TO service_role;
