CREATE TABLE IF NOT EXISTS public.schizophrenia_troubles_comorbides_annuel (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,
  -- Troubles anxieux
  rad_tb_anx TEXT,
  chk_troubles_anxieux_choix TEXT[],
  chk_anxieux_trouble_panique_type TEXT[],
  rad_anxieux_trouble_panique_agora_debut TEXT,
  rad_anxieux_trouble_panique_agora_mois TEXT,
  rad_anxieux_trouble_panique_sansagora_debut TEXT,
  rad_anxieux_trouble_panique_sansagora_mois TEXT,
  rad_anxieux_agoraphobie_age_debut TEXT,
  rad_anxieux_agoraphobie_symptome_mois_ecoule TEXT,
  rad_anxieux_phobie_sociale_age_debut TEXT,
  rad_anxieux_phobie_sociale_symptome_mois_ecoule TEXT,
  rad_anxieux_phobie_specfique_age_debut TEXT,
  rad_anxieux_phobie_specfique_symptome_mois_ecoule TEXT,
  rad_anxieux_toc_age_debut TEXT,
  rad_anxieux_toc_symptome_mois_ecoule TEXT,
  rad_anxieux_post_trauma_age_debut TEXT,
  rad_anxieux_post_trauma_symptome_mois_ecoule TEXT,
  rad_anxieux_generalise_age_debut TEXT,
  rad_anxieux_generalise_symptome_mois_ecoule TEXT,
  anxieux_affection_medicale VARCHAR(50),
  rad_anxieux_affection_medicale_age_debut TEXT,
  rad_anxieux_affection_medicale_symptome_mois_ecoule TEXT,
  anxieux_substance VARCHAR(50),
  rad_anxieux_substance_age_debut TEXT,
  rad_anxieux_substance_symptome_mois_ecoule TEXT,
  rad_anxieux_non_specifie_age_debut TEXT,
  rad_anxieux_non_specifie_symptome_mois_ecoule TEXT,
  -- Troubles liés à une substance
  rad_tb_subst TEXT,
  chk_substances_type TEXT[],
  rad_alcool_type TEXT,
  rad_alcool_mois TEXT,
  rad_alcool_age TEXT,
  alcool_dur VARCHAR(50),
  rad_sedatif_type TEXT,
  rad_sedatif_mois TEXT,
  rad_sedatif_age TEXT,
  sedatif_dur VARCHAR(50),
  rad_cannabis_type TEXT,
  rad_cannabis_mois TEXT,
  rad_cannabis_age TEXT,
  cannabis_dur VARCHAR(50),
  rad_stimulants_type TEXT,
  rad_stimulants_mois TEXT,
  rad_stimulants_age TEXT,
  stimulants_dur VARCHAR(50),
  rad_opiaces_type TEXT,
  rad_opiaces_mois TEXT,
  rad_opiaces_age TEXT,
  opiaces_dur VARCHAR(50),
  rad_cocaine_type TEXT,
  rad_cocaine_mois TEXT,
  rad_cocaine_age TEXT,
  cocaine_dur VARCHAR(50),
  rad_hallucinogenes_type TEXT,
  rad_hallucinogenes_mois TEXT,
  rad_hallucinogenes_age TEXT,
  hallucinogene_dur VARCHAR(50),
  autresubstance_autre VARCHAR(50),
  rad_autresubstance_type TEXT,
  rad_autresubstance_mois TEXT,
  rad_autresubstance_age TEXT,
  autresubstance_dur VARCHAR(50),
  rad_tb_substind TEXT,
  chk_tb_substind_sub TEXT[],
  chk_tb_substind_typ TEXT[],
  rad_tb_substindpres TEXT,
  -- Troubles somatoformes
  rad_tb_somat TEXT,
  rad_somatoforme_type TEXT,
  rad_somatoforme_age_debut TEXT,
  rad_somatoforme_presence_symptomes_mois_ecoule TEXT,
  -- Troubles du comportement alimentaire
  rad_tb_alim TEXT,
  rad_conduites_alimentaires_type TEXT,
  rad_conduites_alimentaires_age_debut TEXT,
  rad_conduites_alimentaires_symptomes_mois_ecoule TEXT,
  -- Metadata
  completed_by UUID REFERENCES user_profiles(id),
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.schizophrenia_troubles_comorbides_annuel ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Patients view own responses" ON public.schizophrenia_troubles_comorbides_annuel
  FOR SELECT USING (auth.uid() = patient_id);

CREATE POLICY "Patients insert own responses" ON public.schizophrenia_troubles_comorbides_annuel
  FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Patients update own responses" ON public.schizophrenia_troubles_comorbides_annuel
  FOR UPDATE USING (auth.uid() = patient_id);

CREATE POLICY "Professionals view all responses" ON public.schizophrenia_troubles_comorbides_annuel
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals insert responses" ON public.schizophrenia_troubles_comorbides_annuel
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE POLICY "Professionals update responses" ON public.schizophrenia_troubles_comorbides_annuel
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid()
      AND role IN ('healthcare_professional', 'manager', 'administrator'))
  );

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.schizophrenia_troubles_comorbides_annuel
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

GRANT ALL ON TABLE public.schizophrenia_troubles_comorbides_annuel TO anon;
GRANT ALL ON TABLE public.schizophrenia_troubles_comorbides_annuel TO authenticated;
GRANT ALL ON TABLE public.schizophrenia_troubles_comorbides_annuel TO service_role;
