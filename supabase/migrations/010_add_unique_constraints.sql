-- ============================================================================
-- Add Unique Constraints to Response Tables
-- ============================================================================
-- This fixes the 42P10 error ("there is no unique or exclusion constraint matching
-- the ON CONFLICT specification") when upserting responses by visit_id.
-- ============================================================================

ALTER TABLE responses_asrm ADD CONSTRAINT responses_asrm_visit_id_key UNIQUE (visit_id);
ALTER TABLE responses_qids_sr16 ADD CONSTRAINT responses_qids_sr16_visit_id_key UNIQUE (visit_id);
ALTER TABLE responses_mdq ADD CONSTRAINT responses_mdq_visit_id_key UNIQUE (visit_id);
ALTER TABLE responses_bipolar_diagnostic ADD CONSTRAINT responses_bipolar_diagnostic_visit_id_key UNIQUE (visit_id);
ALTER TABLE responses_orientation ADD CONSTRAINT responses_orientation_visit_id_key UNIQUE (visit_id);

