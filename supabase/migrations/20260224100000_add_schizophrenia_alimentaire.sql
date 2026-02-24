-- Migration pour ajouter le questionnaire Alimentaire pour la Schizophrénie

-- 1. Create the table for Alimentaire responses
CREATE TABLE IF NOT EXISTS public.schizophrenia_alimentaire (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patients(id) ON DELETE CASCADE,
    
    -- Status
    questionnaire_done TEXT,
    
    -- Questions générales (20-22)
    jeune_therapeutique_12m BOOLEAN,
    jeune_intermittent_actuel BOOLEAN,
    jeune_religieux_12m BOOLEAN,
    
    -- Préparation et Connaissances (23-26, 28)
    temps_preparation_repas_heures INTEGER,
    temps_preparation_repas_minutes INTEGER,
    fait_courses BOOLEAN,
    prepare_repas BOOLEAN,
    connaissances_nutrition INTEGER, -- 0-3 (non, plutôt non, plutôt oui, oui)
    remboursement_complements BOOLEAN,
    
    -- Pourcentages (29-30)
    pourcentage_bio INTEGER, -- 0-5 (tranches 0-10%, 11-25%, etc.)
    pourcentage_cru INTEGER, -- 0-5 (tranches 0-10%, 11-25%, etc.)
    
    -- Régimes (31-32)
    regimes_alimentaires TEXT[],
    raisons_regime TEXT[],
    
    -- Fréquences (33-38) SERIES
    -- Glucides rapides (33)
    freq_pain_blanc INTEGER,
    freq_pomme_de_terre_riz_blanc INTEGER,
    freq_pates_blanches INTEGER,
    freq_confiture_nutella INTEGER,
    freq_soda_sucre INTEGER,
    freq_soda_light INTEGER,
    freq_jus_fruits INTEGER,
    freq_dessert_sucre INTEGER,
    freq_yaourt_fruits INTEGER,
    
    -- Protéines (34)
    freq_viande_rouge INTEGER,
    freq_viande_blanche INTEGER,
    freq_legumineuses INTEGER,
    freq_blanc_oeuf INTEGER,
    freq_jaune_oeuf INTEGER,
    freq_verre_lait INTEGER,
    freq_yaourt_nature INTEGER,
    freq_fromage INTEGER,
    freq_complements_proteines INTEGER,
    
    -- Fibres (35)
    freq_salade_endives INTEGER,
    freq_legumes_verts INTEGER,
    freq_quinoa_boulgour INTEGER,
    freq_riz_complet INTEGER,
    freq_pates_completes INTEGER,
    freq_flocon_avoine INTEGER,
    freq_fruit INTEGER,
    freq_pain_complet INTEGER,
    
    -- Oméga 3 et graisses (36)
    freq_huile_olive_colza_soja INTEGER,
    freq_poisson_gras_cru INTEGER,
    freq_autres_poissons_fruits_mer INTEGER,
    freq_noix_amandes_noisettes INTEGER,
    freq_graines_chia INTEGER,
    freq_omega3_gelules INTEGER,
    freq_beurre INTEGER,
    
    -- Nourriture transformée (37)
    freq_junk_food INTEGER,
    freq_viande_transformee INTEGER,
    freq_plats_pre_cuisines INTEGER,
    freq_aliments_frits INTEGER,
    freq_graines_aperitives INTEGER,
    freq_patisserie_gateaux INTEGER,
    freq_chips_biscuits_sales INTEGER,
    freq_margarine INTEGER,
    freq_conserves_non_cuisines INTEGER,
    freq_surgeles_non_cuisines INTEGER,
    
    -- En général (38)
    freq_cafe INTEGER,
    freq_the INTEGER,
    freq_cafe_deca INTEGER,
    freq_vin_rouge INTEGER,
    freq_vin_blanc_rose INTEGER,
    freq_biere INTEGER,
    freq_alcool_fort INTEGER,
    
    -- Compléments (39-40)
    nutraceutiques TEXT[],
    phytoceutiques TEXT[],
    
    -- Metadata constraints
    completed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure one response per visit
    UNIQUE(visit_id)
);

-- 2. Add RLS policies
ALTER TABLE public.schizophrenia_alimentaire ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Professionals can view alimentaire responses' AND tablename = 'schizophrenia_alimentaire') THEN
        CREATE POLICY "Professionals can view alimentaire responses" ON public.schizophrenia_alimentaire FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = auth.uid() AND up.role IN ('healthcare_professional', 'manager', 'administrator'))
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Professionals can insert alimentaire responses' AND tablename = 'schizophrenia_alimentaire') THEN
        CREATE POLICY "Professionals can insert alimentaire responses" ON public.schizophrenia_alimentaire FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = auth.uid() AND up.role IN ('healthcare_professional', 'manager', 'administrator'))
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Professionals can update alimentaire responses' AND tablename = 'schizophrenia_alimentaire') THEN
        CREATE POLICY "Professionals can update alimentaire responses" ON public.schizophrenia_alimentaire FOR UPDATE USING (
            EXISTS (SELECT 1 FROM public.user_profiles up WHERE up.id = auth.uid() AND up.role IN ('healthcare_professional', 'manager', 'administrator'))
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Patients can view own alimentaire responses' AND tablename = 'schizophrenia_alimentaire') THEN
        CREATE POLICY "Patients can view own alimentaire responses" ON public.schizophrenia_alimentaire FOR SELECT USING (
            EXISTS (SELECT 1 FROM public.patients p WHERE p.id = patient_id AND p.user_id = auth.uid())
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Patients can insert own alimentaire responses' AND tablename = 'schizophrenia_alimentaire') THEN
        CREATE POLICY "Patients can insert own alimentaire responses" ON public.schizophrenia_alimentaire FOR INSERT WITH CHECK (
            EXISTS (SELECT 1 FROM public.patients p WHERE p.id = patient_id AND p.user_id = auth.uid())
        );
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Patients can update own alimentaire responses' AND tablename = 'schizophrenia_alimentaire') THEN
        CREATE POLICY "Patients can update own alimentaire responses" ON public.schizophrenia_alimentaire FOR UPDATE USING (
            EXISTS (SELECT 1 FROM public.patients p WHERE p.id = patient_id AND p.user_id = auth.uid())
        );
    END IF;
END $$;

-- 3. Create updated_at trigger
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_schizophrenia_alimentaire_updated_at') THEN
        CREATE TRIGGER update_schizophrenia_alimentaire_updated_at
            BEFORE UPDATE ON public.schizophrenia_alimentaire
            FOR EACH ROW
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- 4. Grant permissions
GRANT ALL ON public.schizophrenia_alimentaire TO authenticated;
GRANT ALL ON public.schizophrenia_alimentaire TO service_role;

