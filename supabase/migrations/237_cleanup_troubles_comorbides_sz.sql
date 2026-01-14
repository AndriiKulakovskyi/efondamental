-- Migration: Cleanup Troubles Comorbides (Schizophrenia) questionnaire
-- This migration removes all sections except Section 1 (Mood Disorders)
-- Removed sections: Anxiety disorders, ADHD, Eating disorders

-- ============================================================================
-- DROP SECTION 2: ANXIETY DISORDERS COLUMNS
-- ============================================================================

-- Primary gating question
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_tb_anx;

-- Panic Disorder
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_attaq_paniq;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_trouble_panique;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS chk_anxieux_trouble_panique_type;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_anxieux_trouble_panique_sansagora_mois;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_anxieux_trouble_panique_agora_mois;

-- Agoraphobia without Panic Disorder
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_peur_agoraphobie;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_agoraphobie;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_anxieux_agoraphobie_symptome_mois_ecoule;

-- Social Phobia
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_peur_sociale;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_phobie_sociale;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_anxieux_phobie_sociale_symptome_mois_ecoule;

-- Specific Phobia
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_peur_specifique;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_phobie_specifique;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_anxieux_phobie_specfique_symptome_mois_ecoule;

-- Obsessive-Compulsive Disorder (OCD)
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_peur_obsessionnel;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_trouble_obsessionnel;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_peur_compulsif;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_trouble_compulsif;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_anxieux_toc_symptome_mois_ecoule;

-- Post-Traumatic Stress Disorder (PTSD)
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_anxieux_post_trauma_titre;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_anxieux_post_trauma_symptome_mois_ecoule;

-- Generalized Anxiety Disorder (GAD)
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_anxieux;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_anxieux_generalise_titre;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_anxieux_generalise_symptome_mois_ecoule;

-- Anxiety due to General Medical Condition
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS anxieux_affection_medicale;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_anxieux_affection_medicale_symptome_mois_ecoule;

-- Anxiety Disorder Not Otherwise Specified
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_anxieux_non_specifie_titre;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_anxieux_non_specifie_symptome_mois_ecoule;

-- ============================================================================
-- DROP SECTION 3: ADHD COLUMN
-- ============================================================================

ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_diag_tdah;

-- ============================================================================
-- DROP SECTION 4: EATING DISORDERS COLUMNS
-- ============================================================================

ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_tb_alim;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_conduites_alimentaires_symptomes_mois_ecoule;
ALTER TABLE responses_troubles_comorbides_sz DROP COLUMN IF EXISTS rad_conduites_alimentaires_type;
