-- Migration: Add Eating Disorders section to Troubles Comorbides (Schizophrenia)
-- This migration adds Section 3 (Eating Disorders) to the questionnaire

-- ============================================================================
-- SECTION 3: EATING DISORDERS
-- ============================================================================

-- Main gating question
ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_tb_alim TEXT CHECK (rad_tb_alim IN ('Oui', 'Non', 'Ne sais pas'));

-- Symptoms in the past month
ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_conduites_alimentaires_symptomes_mois_ecoule TEXT CHECK (rad_conduites_alimentaires_symptomes_mois_ecoule IN ('Oui', 'Non', 'Ne sais pas'));

-- Type of eating disorder
ALTER TABLE responses_troubles_comorbides_sz
ADD COLUMN rad_conduites_alimentaires_type TEXT CHECK (rad_conduites_alimentaires_type IN (
    'Anorexie type restrictive',
    'Anorexie type boulimie',
    'Hyperphagie boulimique',
    'Boulimie seule',
    'Trouble des conduites alimentaires non specifie'
));
