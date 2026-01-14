-- Migration: Add Troubles Comorbides (Schizophrenia) questionnaire table
-- This diagnostic questionnaire assesses psychiatric comorbidities in schizophrenia patients:
-- - Mood disorders (outside psychotic episodes)
-- - Anxiety disorders (panic, agoraphobia, social phobia, specific phobia, OCD, PTSD, GAD)
-- - ADHD symptoms
-- - Eating disorders
-- Based on MINI (Mini International Neuropsychiatric Interview) structure

CREATE TABLE responses_troubles_comorbides_sz (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    visit_id UUID REFERENCES visits(id) ON DELETE CASCADE NOT NULL UNIQUE,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE NOT NULL,

    -- ==================== SECTION 1: MOOD DISORDERS ====================
    -- Mood disorders occurring outside psychotic episodes
    rad_tb_thy_episode_dep_maj TEXT CHECK (rad_tb_thy_episode_dep_maj IN ('Oui', 'Non', 'Ne sais pas')),
    rad_tb_thy_age_debut TEXT, -- Age range with special values: '', 'Ne sais pas', '<5', '5'-'89', '>89'
    rad_tb_thy_nb_episode TEXT, -- Count range: '', 'Ne sais pas', '0'-'20', '>20'

    -- ==================== SECTION 2: ANXIETY DISORDERS ====================
    -- Primary gating question
    rad_tb_anx TEXT CHECK (rad_tb_anx IN ('Oui', 'Non', 'Ne sais pas')),

    -- Panic Disorder
    rad_attaq_paniq TEXT CHECK (rad_attaq_paniq IN ('Oui', 'Non')),
    rad_trouble_panique TEXT CHECK (rad_trouble_panique IN ('Oui', 'Non')),
    chk_anxieux_trouble_panique_type TEXT[], -- SET: 'Sans agoraphobie', 'Avec agoraphobie'
    rad_anxieux_trouble_panique_sansagora_mois TEXT CHECK (rad_anxieux_trouble_panique_sansagora_mois IN ('Oui', 'Non', 'Ne sais pas')),
    rad_anxieux_trouble_panique_agora_mois TEXT CHECK (rad_anxieux_trouble_panique_agora_mois IN ('Oui', 'Non', 'Ne sais pas')),

    -- Agoraphobia without Panic Disorder
    rad_peur_agoraphobie TEXT CHECK (rad_peur_agoraphobie IN ('Oui', 'Non')),
    rad_agoraphobie TEXT CHECK (rad_agoraphobie IN ('Oui', 'Non')),
    rad_anxieux_agoraphobie_symptome_mois_ecoule TEXT CHECK (rad_anxieux_agoraphobie_symptome_mois_ecoule IN ('Oui', 'Non', 'Ne sais pas')),

    -- Social Phobia
    rad_peur_sociale TEXT CHECK (rad_peur_sociale IN ('Oui', 'Non')),
    rad_phobie_sociale TEXT CHECK (rad_phobie_sociale IN ('Oui', 'Non')),
    rad_anxieux_phobie_sociale_symptome_mois_ecoule TEXT CHECK (rad_anxieux_phobie_sociale_symptome_mois_ecoule IN ('Oui', 'Non', 'Ne sais pas')),

    -- Specific Phobia
    rad_peur_specifique TEXT CHECK (rad_peur_specifique IN ('Oui', 'Non')),
    rad_phobie_specifique TEXT CHECK (rad_phobie_specifique IN ('Oui', 'Non')),
    rad_anxieux_phobie_specfique_symptome_mois_ecoule TEXT CHECK (rad_anxieux_phobie_specfique_symptome_mois_ecoule IN ('Oui', 'Non', 'Ne sais pas')),

    -- Obsessive-Compulsive Disorder (OCD)
    rad_peur_obsessionnel TEXT CHECK (rad_peur_obsessionnel IN ('Oui', 'Non')),
    rad_trouble_obsessionnel TEXT CHECK (rad_trouble_obsessionnel IN ('Oui', 'Non')),
    rad_peur_compulsif TEXT CHECK (rad_peur_compulsif IN ('Oui', 'Non')),
    rad_trouble_compulsif TEXT CHECK (rad_trouble_compulsif IN ('Oui', 'Non')),
    rad_anxieux_toc_symptome_mois_ecoule TEXT CHECK (rad_anxieux_toc_symptome_mois_ecoule IN ('Oui', 'Non', 'Ne sais pas')),

    -- Post-Traumatic Stress Disorder (PTSD)
    rad_anxieux_post_trauma_titre TEXT CHECK (rad_anxieux_post_trauma_titre IN ('Oui', 'Non')),
    rad_anxieux_post_trauma_symptome_mois_ecoule TEXT CHECK (rad_anxieux_post_trauma_symptome_mois_ecoule IN ('Oui', 'Non', 'Ne sais pas')),

    -- Generalized Anxiety Disorder (GAD)
    rad_anxieux TEXT CHECK (rad_anxieux IN ('Oui', 'Non')),
    rad_anxieux_generalise_titre TEXT CHECK (rad_anxieux_generalise_titre IN ('Oui', 'Non')),
    rad_anxieux_generalise_symptome_mois_ecoule TEXT CHECK (rad_anxieux_generalise_symptome_mois_ecoule IN ('Oui', 'Non', 'Ne sais pas')),

    -- Anxiety due to General Medical Condition
    anxieux_affection_medicale VARCHAR(50),
    rad_anxieux_affection_medicale_symptome_mois_ecoule TEXT CHECK (rad_anxieux_affection_medicale_symptome_mois_ecoule IN ('Oui', 'Non', 'Ne sais pas')),

    -- Anxiety Disorder Not Otherwise Specified
    rad_anxieux_non_specifie_titre TEXT CHECK (rad_anxieux_non_specifie_titre IN ('Oui', 'Non')),
    rad_anxieux_non_specifie_symptome_mois_ecoule TEXT CHECK (rad_anxieux_non_specifie_symptome_mois_ecoule IN ('Oui', 'Non', 'Ne sais pas')),

    -- ==================== SECTION 3: ADHD ====================
    rad_diag_tdah TEXT CHECK (rad_diag_tdah IN ('Oui', 'Non')),

    -- ==================== SECTION 4: EATING DISORDERS ====================
    rad_tb_alim TEXT CHECK (rad_tb_alim IN ('Oui', 'Non', 'Ne sais pas')),
    rad_conduites_alimentaires_symptomes_mois_ecoule TEXT CHECK (rad_conduites_alimentaires_symptomes_mois_ecoule IN ('Oui', 'Non', 'Ne sais pas')),
    rad_conduites_alimentaires_type TEXT CHECK (rad_conduites_alimentaires_type IN (
        'Anorexie type restrictive',
        'Anorexie type boulimie',
        'Hyperphagie boulimique',
        'Boulimie seule',
        'Trouble des conduites alimentaires non spécifié'
    )),

    -- ==================== METADATA ====================
    completed_by UUID REFERENCES auth.users(id),
    completed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- RLS Policies
-- ============================================================================

ALTER TABLE responses_troubles_comorbides_sz ENABLE ROW LEVEL SECURITY;

-- Patients can view their own responses
CREATE POLICY "Patients view own troubles comorbides sz"
    ON responses_troubles_comorbides_sz FOR SELECT
    USING (auth.uid() = patient_id);

-- Patients can insert their own responses
CREATE POLICY "Patients insert own troubles comorbides sz"
    ON responses_troubles_comorbides_sz FOR INSERT
    WITH CHECK (auth.uid() = patient_id);

-- Patients can update their own responses
CREATE POLICY "Patients update own troubles comorbides sz"
    ON responses_troubles_comorbides_sz FOR UPDATE
    USING (auth.uid() = patient_id);

-- Healthcare professionals can view all responses
CREATE POLICY "Professionals view all troubles comorbides sz"
    ON responses_troubles_comorbides_sz FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- Healthcare professionals can insert responses
CREATE POLICY "Professionals insert troubles comorbides sz"
    ON responses_troubles_comorbides_sz FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- Healthcare professionals can update responses
CREATE POLICY "Professionals update troubles comorbides sz"
    ON responses_troubles_comorbides_sz FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles
            WHERE id = auth.uid()
            AND role IN ('healthcare_professional', 'manager', 'administrator')
        )
    );

-- ============================================================================
-- Update Trigger
-- ============================================================================

CREATE TRIGGER update_responses_troubles_comorbides_sz_updated_at
    BEFORE UPDATE ON responses_troubles_comorbides_sz
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
