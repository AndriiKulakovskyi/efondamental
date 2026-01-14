-- Migration: Add Troubles anxieux and TDAH sections to Troubles Comorbides (Schizophrenia)
-- This migration adds Section 2 (Anxiety Disorders) and Q2 (ADHD) to the questionnaire

-- ============================================================================
-- SECTION 2: ANXIETY DISORDERS
-- ============================================================================

-- Primary gating question
ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_tb_anx TEXT CHECK (rad_tb_anx IN ('Oui', 'Non', 'Ne sais pas'));

-- Q1.1: Panic Attacks
ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_attaq_paniq TEXT CHECK (rad_attaq_paniq IN ('Oui', 'Non'));

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_trouble_panique TEXT CHECK (rad_trouble_panique IN ('Oui', 'Non'));

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN chk_anxieux_trouble_panique_type TEXT[];

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_anxieux_trouble_panique_sansagora_mois TEXT CHECK (rad_anxieux_trouble_panique_sansagora_mois IN ('Oui', 'Non', 'Ne sais pas'));

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_anxieux_trouble_panique_agora_mois TEXT CHECK (rad_anxieux_trouble_panique_agora_mois IN ('Oui', 'Non', 'Ne sais pas'));

-- Q1.2: Agoraphobia
ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_peur_agoraphobie TEXT CHECK (rad_peur_agoraphobie IN ('Oui', 'Non'));

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_agoraphobie TEXT CHECK (rad_agoraphobie IN ('Oui', 'Non'));

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_anxieux_agoraphobie_symptome_mois_ecoule TEXT CHECK (rad_anxieux_agoraphobie_symptome_mois_ecoule IN ('Oui', 'Non', 'Ne sais pas'));

-- Q1.3: Social Phobia
ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_peur_sociale TEXT CHECK (rad_peur_sociale IN ('Oui', 'Non'));

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_phobie_sociale TEXT CHECK (rad_phobie_sociale IN ('Oui', 'Non'));

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_anxieux_phobie_sociale_symptome_mois_ecoule TEXT CHECK (rad_anxieux_phobie_sociale_symptome_mois_ecoule IN ('Oui', 'Non', 'Ne sais pas'));

-- Q1.4: Specific Phobia
ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_peur_specifique TEXT CHECK (rad_peur_specifique IN ('Oui', 'Non'));

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_phobie_specifique TEXT CHECK (rad_phobie_specifique IN ('Oui', 'Non'));

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_anxieux_phobie_specfique_symptome_mois_ecoule TEXT CHECK (rad_anxieux_phobie_specfique_symptome_mois_ecoule IN ('Oui', 'Non', 'Ne sais pas'));

-- Q1.5: Obsessional Disorder
ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_peur_obsessionnel TEXT CHECK (rad_peur_obsessionnel IN ('Oui', 'Non'));

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_trouble_obsessionnel TEXT CHECK (rad_trouble_obsessionnel IN ('Oui', 'Non'));

-- Q1.6: OCD
ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_peur_compulsif TEXT CHECK (rad_peur_compulsif IN ('Oui', 'Non'));

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_trouble_compulsif TEXT CHECK (rad_trouble_compulsif IN ('Oui', 'Non'));

-- Q1.7: Generalized Anxiety
ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_anxieux TEXT CHECK (rad_anxieux IN ('Oui', 'Non'));

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_anxieux_generalise_titre TEXT CHECK (rad_anxieux_generalise_titre IN ('Oui', 'Non'));

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_anxieux_generalise_symptome_mois_ecoule TEXT CHECK (rad_anxieux_generalise_symptome_mois_ecoule IN ('Oui', 'Non'));

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN anxieux_affection_medicale VARCHAR(255);

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_anxieux_affection_medicale_symptome_mois_ecoule TEXT CHECK (rad_anxieux_affection_medicale_symptome_mois_ecoule IN ('Oui', 'Non', 'Ne sais pas'));

-- Q1.8: PTSD
ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_anxieux_post_trauma_titre TEXT CHECK (rad_anxieux_post_trauma_titre IN ('Oui', 'Non'));

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_anxieux_post_trauma_symptome_mois_ecoule TEXT CHECK (rad_anxieux_post_trauma_symptome_mois_ecoule IN ('Oui', 'Non', 'Ne sais pas'));

-- Q1.9: Unspecified Anxiety Disorder
ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_anxieux_non_specifie_titre TEXT CHECK (rad_anxieux_non_specifie_titre IN ('Oui', 'Non'));

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_anxieux_non_specifie_symptome_mois_ecoule TEXT CHECK (rad_anxieux_non_specifie_symptome_mois_ecoule IN ('Oui', 'Non', 'Ne sais pas'));

-- ============================================================================
-- Q2: ADHD
-- ============================================================================

ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_diag_tdah TEXT CHECK (rad_diag_tdah IN ('Oui', 'Non'));
