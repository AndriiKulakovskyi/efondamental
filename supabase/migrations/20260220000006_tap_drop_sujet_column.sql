-- Drop the `sujet` column from schizophrenia_tap
-- Sujet is no longer part of the questionnaire (patient identity is tracked via patient_id)
ALTER TABLE schizophrenia_tap DROP COLUMN IF EXISTS sujet;
