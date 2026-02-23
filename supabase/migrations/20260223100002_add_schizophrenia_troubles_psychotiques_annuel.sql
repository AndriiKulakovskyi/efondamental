BEGIN;

-- Annual follow-up: Troubles psychotiques (schizophrenia)
-- Captures 12-month data: mode evolutif, episodes, hospitalizations,
-- treatment changes, medication adherence, suicide attempts, substance use, OCD

CREATE TABLE IF NOT EXISTS public.schizophrenia_troubles_psychotiques_annuel (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE UNIQUE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,

    -- 1. Mode evolutif
    rad_symptomeevo_mode TEXT,

    -- 2. Psychotic episodes (12 months)
    rad_tbpsychoan TEXT,

    -- 3a. Full-time hospitalisations
    rad_tbpsychoan_hospi_tpscomplet TEXT,
    rad_tbpsychoan_hospi_tpscomplet_nb TEXT,
    rad_tbpsychoan_hospi_tpscomplet_duree TEXT,
    rad_tbpsychoan_hospi_tpscomplet_motif TEXT,
    tbpsychoan_hospi_tpscomplet_motifautre VARCHAR,

    -- 3b. Day hospitalisations
    rad_tbpsychoan_hospi_jour TEXT,
    rad_tbpsychoan_hospi_jour_nb TEXT,
    rad_tbpsychoan_hospi_jour_duree TEXT,
    rad_tbpsychoan_hospi_jour_motif TEXT,
    tbpsychoan_hospi_jour_motifautre VARCHAR,

    -- 4. Treatment changes (gate)
    rad_tbpsychoan_modpec TEXT,

    -- 4a. Care type changes
    chk_tbpsychoan_modpec_cmp TEXT[],
    chk_tbpsychoan_modpec_rythme TEXT[],
    chk_tbpsychoan_modpec_hp TEXT[],
    chk_tbpsychoan_modpec_cattp TEXT[],
    tbpsychoan_modpec_autre VARCHAR,

    -- 4b. Pharmacological treatment
    rad_tbpsychoan_modpec_med TEXT,

    -- 4c. Non-pharmacological treatment
    rad_tbpsychoan_modpec_nonmed TEXT,
    chk_tbpsychoan_modpec_nonmed_tcc TEXT[],
    chk_tbpsychoan_modpec_nonmed_remed TEXT[],
    chk_tbpsychoan_modpec_nonmed_psychody TEXT[],
    chk_tbpsychoan_modpec_nonmed_fam TEXT[],
    tbpsychoan_modpec_nonmed_autre VARCHAR,

    -- 5. Medication adherence support
    chk_aide_prise_tt TEXT[],
    rad_aide_prise_tt_hospi TEXT,

    -- 6. Suicide attempts
    rad_tbpsychoan_ts TEXT,
    rad_tbpsychoan_ts_nb TEXT,

    -- 7. Substance use
    rad_tbpsychoan_substance TEXT,
    chk_tbpsychoan_substance_type TEXT[],
    -- Alcohol
    rad_tbpsychoan_substance_alcoolconso TEXT,
    date_tbpsychoan_substance_alcooldern DATE,
    -- Cannabis
    rad_tbpsychoan_substance_canaconso TEXT,
    date_tbpsychoan_substance_canadern DATE,
    -- Opioids
    rad_tbpsychoan_substance_opiaceconso TEXT,
    date_tbpsychoan_substance_opiacedern DATE,
    -- Cocaine
    rad_tbpsychoan_substance_cacaineconso TEXT,
    date_tbpsychoan_substance_cocainedern DATE,
    -- Hallucinogens
    rad_tbpsychoan_substance_hallucinoconso TEXT,
    date_tbpsychoan_substance_hallucinodern DATE,
    -- Other substances
    tbpsychoan_substance_autre VARCHAR(255),

    -- 8. OCD screening
    rad_trouble_compulsif TEXT,

    -- Metadata
    completed_by UUID REFERENCES public.user_profiles(id),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sz_troubles_psychotiques_annuel_visit
  ON public.schizophrenia_troubles_psychotiques_annuel (visit_id);
CREATE INDEX IF NOT EXISTS idx_sz_troubles_psychotiques_annuel_patient
  ON public.schizophrenia_troubles_psychotiques_annuel (patient_id);

-- RLS
ALTER TABLE public.schizophrenia_troubles_psychotiques_annuel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own schizophrenia_troubles_psychotiques_annuel"
  ON public.schizophrenia_troubles_psychotiques_annuel FOR SELECT
  USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view schizophrenia_troubles_psychotiques_annuel"
  ON public.schizophrenia_troubles_psychotiques_annuel FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')
  ));

CREATE POLICY "Professionals insert schizophrenia_troubles_psychotiques_annuel"
  ON public.schizophrenia_troubles_psychotiques_annuel FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')
  ));

CREATE POLICY "Professionals update schizophrenia_troubles_psychotiques_annuel"
  ON public.schizophrenia_troubles_psychotiques_annuel FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')
  ));

-- Grants
GRANT ALL ON TABLE public.schizophrenia_troubles_psychotiques_annuel TO anon;
GRANT ALL ON TABLE public.schizophrenia_troubles_psychotiques_annuel TO authenticated;
GRANT ALL ON TABLE public.schizophrenia_troubles_psychotiques_annuel TO service_role;

-- Trigger for updated_at
CREATE OR REPLACE TRIGGER set_updated_at_schizophrenia_troubles_psychotiques_annuel
  BEFORE UPDATE ON public.schizophrenia_troubles_psychotiques_annuel
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

COMMIT;
