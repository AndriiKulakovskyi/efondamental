-- ============================================================================
-- eFondaMental Platform - Schizophrenia Visit Types Configuration
-- ============================================================================
-- This migration configures Schizophrenia to have only 3 visit types:
-- - Screening (once)
-- - Initial Evaluation (once)
-- - Annual Evaluation (repeating yearly)
--
-- Biannual follow-up and off-schedule visits are deactivated for this pathology.
-- Bipolar and other pathologies remain unchanged.
-- ============================================================================

-- Deactivate biannual_followup and off_schedule templates for Schizophrenia only
UPDATE visit_templates 
SET active = false 
WHERE pathology_id = (SELECT id FROM pathologies WHERE type = 'schizophrenia')
  AND visit_type IN ('biannual_followup', 'off_schedule');

-- Log completion
DO $$
BEGIN
  RAISE NOTICE 'Schizophrenia visit types configured: biannual_followup and off_schedule deactivated';
END $$;
