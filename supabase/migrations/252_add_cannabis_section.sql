-- ============================================================================
-- Migration: Add Cannabis section fields to Evaluation Addictologique
-- ============================================================================
-- This migration adds new columns for the cannabis consumption section that
-- appears conditionally based on the answer to the cannabis screening question.
-- ============================================================================

-- Abstinent primaire (if Q3 = Non)
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_cannabis_abstinent VARCHAR(10) CHECK (rad_add_cannabis_abstinent IS NULL OR rad_add_cannabis_abstinent IN ('Oui', 'Non'));

-- ============================================================================
-- CANNABIS CONSUMPTION SECTION (if Q3 = Oui)
-- ============================================================================

-- Quantity (joints/day) during max consumption periods - lifetime
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_qty_vie NUMERIC CHECK (rad_add_can_qty_vie IS NULL OR rad_add_can_qty_vie >= 0);

-- Frequency during max consumption periods - lifetime
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_freq_vie VARCHAR(50) CHECK (rad_add_can_freq_vie IS NULL OR rad_add_can_freq_vie IN ('1_to_7', 'less_than_once'));

-- Specify times per week (1-7) for lifetime frequency
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_freq_vie_spec INTEGER CHECK (rad_add_can_freq_vie_spec IS NULL OR (rad_add_can_freq_vie_spec >= 1 AND rad_add_can_freq_vie_spec <= 7));

-- Frequency - 12 months
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_freq_12m VARCHAR(50) CHECK (rad_add_can_freq_12m IS NULL OR rad_add_can_freq_12m IN ('1_to_7', 'less_than_once'));

-- Specify times per week (1-7) for 12 months frequency
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_freq_12m_spec INTEGER CHECK (rad_add_can_freq_12m_spec IS NULL OR (rad_add_can_freq_12m_spec >= 1 AND rad_add_can_freq_12m_spec <= 7));

-- Quantity (joints/day) - 12 months
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_qty_12m NUMERIC CHECK (rad_add_can_qty_12m IS NULL OR rad_add_can_qty_12m >= 0);

-- ============================================================================
-- CANNABIS DSM5 SCREENING
-- ============================================================================

-- DSM5 screening question
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_screen VARCHAR(10) CHECK (rad_add_can_dsm5_screen IS NULL OR rad_add_can_dsm5_screen IN ('Oui', 'Non'));

-- ============================================================================
-- CANNABIS DSM5 CRITERIA (12 criteria, each with 12-month follow-up)
-- ============================================================================

-- a. A deja pris le produit en quantite superieures a celles prevues
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_a VARCHAR(10) CHECK (rad_add_can_dsm5_a IS NULL OR rad_add_can_dsm5_a IN ('Oui', 'Non'));
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_a_12m VARCHAR(20) CHECK (rad_add_can_dsm5_a_12m IS NULL OR rad_add_can_dsm5_a_12m IN ('Oui', 'Non', 'Ne sais pas'));

-- b. A deja essaye de diminuer ou d'arreter
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_b VARCHAR(10) CHECK (rad_add_can_dsm5_b IS NULL OR rad_add_can_dsm5_b IN ('Oui', 'Non'));
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_b_12m VARCHAR(20) CHECK (rad_add_can_dsm5_b_12m IS NULL OR rad_add_can_dsm5_b_12m IN ('Oui', 'Non', 'Ne sais pas'));

-- c. Passe du temps a chercher, consommer ou se remettre des effets
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_c VARCHAR(10) CHECK (rad_add_can_dsm5_c IS NULL OR rad_add_can_dsm5_c IN ('Oui', 'Non'));
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_c_12m VARCHAR(20) CHECK (rad_add_can_dsm5_c_12m IS NULL OR rad_add_can_dsm5_c_12m IN ('Oui', 'Non', 'Ne sais pas'));

-- d. Cravings ou besoins imperieux de consommer
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_d VARCHAR(10) CHECK (rad_add_can_dsm5_d IS NULL OR rad_add_can_dsm5_d IN ('Oui', 'Non'));
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_d_12m VARCHAR(20) CHECK (rad_add_can_dsm5_d_12m IS NULL OR rad_add_can_dsm5_d_12m IN ('Oui', 'Non', 'Ne sais pas'));

-- e. Incapacite a remplir les obligations majeures
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_e VARCHAR(10) CHECK (rad_add_can_dsm5_e IS NULL OR rad_add_can_dsm5_e IN ('Oui', 'Non'));
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_e_12m VARCHAR(20) CHECK (rad_add_can_dsm5_e_12m IS NULL OR rad_add_can_dsm5_e_12m IN ('Oui', 'Non', 'Ne sais pas'));

-- f. Persistance malgre consequences interpersonnelles
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_f VARCHAR(10) CHECK (rad_add_can_dsm5_f IS NULL OR rad_add_can_dsm5_f IN ('Oui', 'Non'));
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_f_12m VARCHAR(20) CHECK (rad_add_can_dsm5_f_12m IS NULL OR rad_add_can_dsm5_f_12m IN ('Oui', 'Non', 'Ne sais pas'));

-- g. Abandon d'activites sociales, professionnelles ou de loisir
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_g VARCHAR(10) CHECK (rad_add_can_dsm5_g IS NULL OR rad_add_can_dsm5_g IN ('Oui', 'Non'));
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_g_12m VARCHAR(20) CHECK (rad_add_can_dsm5_g_12m IS NULL OR rad_add_can_dsm5_g_12m IN ('Oui', 'Non', 'Ne sais pas'));

-- h. Utilisation repetee quand dangereux
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_h VARCHAR(10) CHECK (rad_add_can_dsm5_h IS NULL OR rad_add_can_dsm5_h IN ('Oui', 'Non'));
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_h_12m VARCHAR(20) CHECK (rad_add_can_dsm5_h_12m IS NULL OR rad_add_can_dsm5_h_12m IN ('Oui', 'Non', 'Ne sais pas'));

-- i. Poursuite malgre problemes psychologiques ou physiques
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_i VARCHAR(10) CHECK (rad_add_can_dsm5_i IS NULL OR rad_add_can_dsm5_i IN ('Oui', 'Non'));
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_i_12m VARCHAR(20) CHECK (rad_add_can_dsm5_i_12m IS NULL OR rad_add_can_dsm5_i_12m IN ('Oui', 'Non', 'Ne sais pas'));

-- j. Tolerance
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_j VARCHAR(10) CHECK (rad_add_can_dsm5_j IS NULL OR rad_add_can_dsm5_j IN ('Oui', 'Non'));
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_j_12m VARCHAR(20) CHECK (rad_add_can_dsm5_j_12m IS NULL OR rad_add_can_dsm5_j_12m IN ('Oui', 'Non', 'Ne sais pas'));

-- k. Symptomes de sevrage
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_k VARCHAR(10) CHECK (rad_add_can_dsm5_k IS NULL OR rad_add_can_dsm5_k IN ('Oui', 'Non'));
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_k_12m VARCHAR(20) CHECK (rad_add_can_dsm5_k_12m IS NULL OR rad_add_can_dsm5_k_12m IN ('Oui', 'Non', 'Ne sais pas'));

-- l. Problemes legaux lies a la consommation
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_l VARCHAR(10) CHECK (rad_add_can_dsm5_l IS NULL OR rad_add_can_dsm5_l IN ('Oui', 'Non'));
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_can_dsm5_l_12m VARCHAR(20) CHECK (rad_add_can_dsm5_l_12m IS NULL OR rad_add_can_dsm5_l_12m IN ('Oui', 'Non', 'Ne sais pas'));

-- ============================================================================
-- CANNABIS DSM5 SEVERITY SCORES (computed by application)
-- ============================================================================

-- Lifetime severity
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS dsm5_cannabis_lifetime_count INTEGER CHECK (dsm5_cannabis_lifetime_count IS NULL OR (dsm5_cannabis_lifetime_count >= 0 AND dsm5_cannabis_lifetime_count <= 12));
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS dsm5_cannabis_lifetime_severity VARCHAR(20) CHECK (dsm5_cannabis_lifetime_severity IS NULL OR dsm5_cannabis_lifetime_severity IN ('none', 'mild', 'moderate', 'severe'));

-- 12-month severity
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS dsm5_cannabis_12month_count INTEGER CHECK (dsm5_cannabis_12month_count IS NULL OR (dsm5_cannabis_12month_count >= 0 AND dsm5_cannabis_12month_count <= 12));
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS dsm5_cannabis_12month_severity VARCHAR(20) CHECK (dsm5_cannabis_12month_severity IS NULL OR dsm5_cannabis_12month_severity IN ('none', 'mild', 'moderate', 'severe'));

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Added Cannabis section fields to responses_eval_addictologique_sz';
END $$;
