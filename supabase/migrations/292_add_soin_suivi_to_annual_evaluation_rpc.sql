-- Fix: Add soin_suivi questionnaires to annual_evaluation visit type
-- Previously, these questionnaires were only tracked in biannual_followup but not in annual_evaluation
-- This caused completion status not to update when these questionnaires were submitted in annual visits

-- Added the following questionnaires to annual_evaluation:
-- - SUIVI_RECOMMANDATIONS (bipolar_followup_suivi_recommandations)
-- - RECOURS_AUX_SOINS (bipolar_followup_recours_aux_soins)
-- - TRAITEMENT_NON_PHARMACOLOGIQUE (bipolar_followup_traitement_non_pharma)
-- - ARRETS_DE_TRAVAIL (bipolar_followup_arrets_travail)
-- - SOMATIQUE_ET_CONTRACEPTIF (bipolar_followup_somatique_contraceptif)
-- - STATUT_PROFESSIONNEL (bipolar_followup_statut_professionnel)
-- - SUICIDE_BEHAVIOR_FOLLOWUP (bipolar_followup_suicide_behavior)

-- Note: Full RPC function is updated via apply_migration MCP tool
-- This file documents the change for version control
