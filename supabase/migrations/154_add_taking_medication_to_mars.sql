-- Migration: Add taking_medication to MARS
-- Description: Adds taking_medication field to responses_mars table

ALTER TABLE responses_mars
  ADD COLUMN IF NOT EXISTS taking_medication VARCHAR(10);

COMMENT ON COLUMN responses_mars.taking_medication IS 'Prenez-vous actuellement un traitement médicamenteux ? (oui/non)';
