-- Migration: Add "Autres drogues" detail section columns to eval_addictologique_sz
-- This adds columns for sedatives, heroin, crack/cocaine, opioids, and other substances

-- Sedatives/Benzodiazepines
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_sedatifs VARCHAR(10),
ADD COLUMN IF NOT EXISTS rad_add_sedatifs_forme TEXT[];

-- Heroin
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_heroine VARCHAR(10),
ADD COLUMN IF NOT EXISTS rad_add_heroine_forme TEXT[];

-- Crack/Cocaine
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_crack VARCHAR(10),
ADD COLUMN IF NOT EXISTS rad_add_crack_forme TEXT[];

-- Opioids (Subutex, Methadone, Codeine)
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_opiaces VARCHAR(10),
ADD COLUMN IF NOT EXISTS rad_add_opiaces_forme TEXT[];

-- Other substances
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_autres_substances VARCHAR(10),
ADD COLUMN IF NOT EXISTS rad_add_autres_substances_nom TEXT,
ADD COLUMN IF NOT EXISTS rad_add_autres_substances_abus VARCHAR(10);

-- Add comments for documentation
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_sedatifs IS 'Has consumed sedatives/benzodiazepines more than 10 times (Oui/Non)';
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_sedatifs_forme IS 'Administration forms for sedatives (Orale, Injectee, Fumee, Sub-lingual)';
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_heroine IS 'Has consumed heroin more than 10 times (Oui/Non)';
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_heroine_forme IS 'Administration forms for heroin (Orale, Injectee, Fumee, Sniffee, Sub-lingual)';
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_crack IS 'Has consumed crack/cocaine more than 10 times (Oui/Non)';
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_crack_forme IS 'Administration forms for crack/cocaine (Orale, Injectee, Fumee, Sniffee, Sub-lingual)';
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_opiaces IS 'Has consumed opioids outside prescription more than 10 times (Oui/Non)';
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_opiaces_forme IS 'Administration forms for opioids (Orale, Injectee, Fumee, Sniffee, Sub-lingual)';
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_autres_substances IS 'Has consumed other substances more than 10 times (Oui/Non)';
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_autres_substances_nom IS 'Name of other substance consumed';
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_autres_substances_abus IS 'Is substance likely to cause abuse/dependence (Oui/Non)';
