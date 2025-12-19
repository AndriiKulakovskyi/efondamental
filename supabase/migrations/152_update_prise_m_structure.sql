-- Migration: Update PRISE-M questionnaire structure
-- Description: Adds taking_medication field and adjusts question numbering

-- Add new taking_medication field
ALTER TABLE responses_prise_m
  ADD COLUMN IF NOT EXISTS taking_medication VARCHAR(10);

-- Remove old gender column (now retrieved from patient profile)
ALTER TABLE responses_prise_m
  DROP COLUMN IF EXISTS gender;

-- Remove q32 (prise de poids is now q31)
ALTER TABLE responses_prise_m
  DROP COLUMN IF EXISTS q32;

-- Add comment for documentation
COMMENT ON COLUMN responses_prise_m.taking_medication IS 'Prenez-vous actuellement un traitement médicamenteux ? (oui/non)';
COMMENT ON TABLE responses_prise_m IS 'PRISE-M: Profil des effets indésirables médicamenteux. Questions q1-q31 with conditional display based on taking_medication and patient gender.';
