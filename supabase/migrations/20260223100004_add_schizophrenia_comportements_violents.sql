BEGIN;

CREATE TABLE IF NOT EXISTS public.schizophrenia_comportements_violents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE UNIQUE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,

    -- Violence verbale
    rad_compviolent_verbale TEXT,
    chk_compviolent_verbale_type TEXT[],
    rad_compviolent_verbale_police TEXT,
    rad_compviolent_verbale_condamnation TEXT,
    chk_compviolent_verbale_condamnation_preciser TEXT[],

    -- Violence physique
    rad_compviolent_physique TEXT,
    rad_compviolent_physique_coup TEXT,
    chk_compviolent_physique_coup_arme TEXT[],
    rad_compviolent_physique_coup_soin TEXT,
    chk_compviolent_physique_type TEXT[],
    rad_compviolent_physique_police TEXT,
    rad_compviolent_physique_condamnation TEXT,
    chk_compviolent_physique_condamnation_preciser TEXT[],

    -- Violence sexuelle
    rad_compviolent_sexuelle TEXT,
    chk_compviolent_sexuelle_preciser TEXT[],
    chk_compviolent_sexuelle_type TEXT[],
    rad_compviolent_sexuelle_police TEXT,
    rad_compviolent_sexuelle_condamnation TEXT,
    chk_compviolent_sexuelle_condamnation_preciser TEXT[],

    -- Bris d'objet
    rad_compviolent_bris TEXT,
    chk_compviolent_bris_type TEXT[],
    rad_compviolent_bris_police TEXT,
    rad_compviolent_bris_condamnation TEXT,
    chk_compviolent_bris_condamnation_preciser TEXT[],

    -- Metadata
    completed_by UUID REFERENCES public.user_profiles(id),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sz_comportements_violents_visit
  ON public.schizophrenia_comportements_violents (visit_id);
CREATE INDEX IF NOT EXISTS idx_sz_comportements_violents_patient
  ON public.schizophrenia_comportements_violents (patient_id);

-- RLS
ALTER TABLE public.schizophrenia_comportements_violents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own schizophrenia_comportements_violents"
  ON public.schizophrenia_comportements_violents FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own schizophrenia_comportements_violents"
  ON public.schizophrenia_comportements_violents FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own schizophrenia_comportements_violents"
  ON public.schizophrenia_comportements_violents FOR UPDATE
  USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view schizophrenia_comportements_violents"
  ON public.schizophrenia_comportements_violents FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')
  ));

CREATE POLICY "Professionals insert schizophrenia_comportements_violents"
  ON public.schizophrenia_comportements_violents FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')
  ));

CREATE POLICY "Professionals update schizophrenia_comportements_violents"
  ON public.schizophrenia_comportements_violents FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')
  ));

-- Grants
GRANT ALL ON TABLE public.schizophrenia_comportements_violents TO anon;
GRANT ALL ON TABLE public.schizophrenia_comportements_violents TO authenticated;
GRANT ALL ON TABLE public.schizophrenia_comportements_violents TO service_role;

-- Trigger for updated_at
CREATE OR REPLACE TRIGGER set_updated_at_schizophrenia_comportements_violents
  BEFORE UPDATE ON public.schizophrenia_comportements_violents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMIT;
