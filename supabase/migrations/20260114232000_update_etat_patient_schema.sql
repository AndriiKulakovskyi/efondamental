-- Migration to update responses_etat_patient table for new merged questions

-- Add new columns for merged questions
ALTER TABLE responses_etat_patient 
ADD COLUMN q1_subjective integer,
ADD COLUMN q3_type integer,
ADD COLUMN q4_type integer,
ADD COLUMN q5_type integer,
ADD COLUMN q8_type integer;

-- Drop old split columns (optional, but cleaner)
-- We wrap in a DO block to safely drop if they exist, though standard ALTER DROP IF EXISTS works too
ALTER TABLE responses_etat_patient
DROP COLUMN IF EXISTS q1a,
DROP COLUMN IF EXISTS q1b,
DROP COLUMN IF EXISTS q3a,
DROP COLUMN IF EXISTS q3b,
DROP COLUMN IF EXISTS q4a,
DROP COLUMN IF EXISTS q4b,
DROP COLUMN IF EXISTS q5a,
DROP COLUMN IF EXISTS q5b,
DROP COLUMN IF EXISTS q8a,
DROP COLUMN IF EXISTS q8b;

-- Add comments for documentation
COMMENT ON COLUMN responses_etat_patient.q1_subjective IS 'Impression subjective de (1=Hyper, 2=Hypo, 0=None)';
COMMENT ON COLUMN responses_etat_patient.q3_type IS 'Préciser type de changement de poids (1=Perte, 2=Gain)';
COMMENT ON COLUMN responses_etat_patient.q4_type IS 'Préciser type de trouble du sommeil (1=Insomnie, 2=Hypersomnie)';
COMMENT ON COLUMN responses_etat_patient.q5_type IS 'Préciser type de trouble psychomoteur (1=Agitation, 2=Ralentissement)';
COMMENT ON COLUMN responses_etat_patient.q8_type IS 'Préciser type de trouble de la pensée (1=Accélération, 2=Ralentissement)';
