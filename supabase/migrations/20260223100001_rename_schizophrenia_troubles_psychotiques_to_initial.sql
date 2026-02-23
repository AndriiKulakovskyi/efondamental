BEGIN;

-- Rename the table
ALTER TABLE public.schizophrenia_troubles_psychotiques
  RENAME TO schizophrenia_troubles_psychotiques_initial;

-- Rename primary key constraint
ALTER TABLE public.schizophrenia_troubles_psychotiques_initial
  RENAME CONSTRAINT schizophrenia_troubles_psychotiques_pkey
  TO schizophrenia_troubles_psychotiques_initial_pkey;

-- Rename unique constraint on visit_id
ALTER TABLE public.schizophrenia_troubles_psychotiques_initial
  RENAME CONSTRAINT schizophrenia_troubles_psychotiques_visit_id_key
  TO schizophrenia_troubles_psychotiques_initial_visit_id_key;

-- Rename foreign key constraints
ALTER TABLE public.schizophrenia_troubles_psychotiques_initial
  RENAME CONSTRAINT schizophrenia_troubles_psychotiques_visit_id_fkey
  TO schizophrenia_troubles_psychotiques_initial_visit_id_fkey;

ALTER TABLE public.schizophrenia_troubles_psychotiques_initial
  RENAME CONSTRAINT schizophrenia_troubles_psychotiques_patient_id_fkey
  TO schizophrenia_troubles_psychotiques_initial_patient_id_fkey;

ALTER TABLE public.schizophrenia_troubles_psychotiques_initial
  RENAME CONSTRAINT schizophrenia_troubles_psychotiques_completed_by_fkey
  TO schizophrenia_troubles_psychotiques_initial_completed_by_fkey;

-- Drop and recreate RLS policies with new names
DROP POLICY IF EXISTS "Patients view own schizophrenia_troubles_psychotiques" ON public.schizophrenia_troubles_psychotiques_initial;
CREATE POLICY "Patients view own schizophrenia_troubles_psychotiques_initial"
  ON public.schizophrenia_troubles_psychotiques_initial FOR SELECT
  USING (auth.uid() = patient_id);

DROP POLICY IF EXISTS "Professionals view schizophrenia_troubles_psychotiques" ON public.schizophrenia_troubles_psychotiques_initial;
CREATE POLICY "Professionals view schizophrenia_troubles_psychotiques_initial"
  ON public.schizophrenia_troubles_psychotiques_initial FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')
  ));

DROP POLICY IF EXISTS "Professionals insert schizophrenia_troubles_psychotiques" ON public.schizophrenia_troubles_psychotiques_initial;
CREATE POLICY "Professionals insert schizophrenia_troubles_psychotiques_initial"
  ON public.schizophrenia_troubles_psychotiques_initial FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')
  ));

DROP POLICY IF EXISTS "Professionals update schizophrenia_troubles_psychotiques" ON public.schizophrenia_troubles_psychotiques_initial;
CREATE POLICY "Professionals update schizophrenia_troubles_psychotiques_initial"
  ON public.schizophrenia_troubles_psychotiques_initial FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE id = auth.uid() AND role IN ('healthcare_professional', 'manager', 'administrator')
  ));

COMMIT;
