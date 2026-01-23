-- Migration: Cleanup unused bipolar_psy_traitement_semestriel table
-- This table was superseded by separate tables for each questionnaire:
--   - bipolar_followup_suivi_recommandations
--   - bipolar_followup_recours_aux_soins
--   - bipolar_followup_traitement_non_pharma
--   - bipolar_followup_arrets_travail
--   - bipolar_followup_somatique_contraceptif
--   - bipolar_followup_statut_professionnel
-- The table has 0 rows and is no longer referenced by any service code.

-- Drop the unused table
DROP TABLE IF EXISTS bipolar_psy_traitement_semestriel CASCADE;

-- Notify PostgREST to reload schema
NOTIFY pgrst, 'reload schema';
