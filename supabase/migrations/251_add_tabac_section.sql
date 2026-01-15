-- ============================================================================
-- Migration: Add Tabac section fields to Evaluation Addictologique
-- ============================================================================
-- This migration adds new columns for the tobacco consumption section that
-- appears conditionally when tobacco status is "Fumeur actuel" or "Ex-fumeur".
-- ============================================================================

-- 1. Number of pack-years
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS tab_paquets_annees NUMERIC CHECK (tab_paquets_annees IS NULL OR tab_paquets_annees >= 0);

-- 2. Age of daily tobacco consumption start (years) - dropdown with options
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS tab_age_debut_quotidien VARCHAR(20);

-- 3. Cigarettes per day (average over last year)
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS tab_cigarettes_jour NUMERIC CHECK (tab_cigarettes_jour IS NULL OR tab_cigarettes_jour >= 0);

-- 4. Age of first cigarette (years)
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS tab_age_premiere_cigarette INTEGER CHECK (tab_age_premiere_cigarette IS NULL OR (tab_age_premiere_cigarette >= 0 AND tab_age_premiere_cigarette <= 120));

-- 5. Maximum abstinence duration (months)
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS tab_abstinence_max_mois INTEGER CHECK (tab_abstinence_max_mois IS NULL OR tab_abstinence_max_mois >= 0);

-- 6. First-degree family history of tobacco use disorder
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS tab_antecedents_familiaux VARCHAR(20) CHECK (tab_antecedents_familiaux IS NULL OR tab_antecedents_familiaux IN ('Oui', 'Non', 'Ne sais pas'));

-- 7. Craving score (0-10)
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS tab_craving_score VARCHAR(20);

-- 8. Lifetime medication treatment for tobacco use disorder
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS tab_traitement_vie VARCHAR(20) CHECK (tab_traitement_vie IS NULL OR tab_traitement_vie IN ('Oui', 'Non', 'Ne sais pas'));

-- 8a. Treatments used (multi-select array)
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS tab_traitements_utilises TEXT[];

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Added Tabac section fields to responses_eval_addictologique_sz';
END $$;
