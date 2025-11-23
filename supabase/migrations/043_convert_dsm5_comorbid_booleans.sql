-- Convert DSM5 Comorbid boolean fields to VARCHAR for 'oui'/'non' values
-- This migration handles the conversion of all boolean fields to single_choice

-- Eating disorder boolean fields
ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN anorexia_restrictive_current TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN anorexia_bulimic_current TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN bulimia_current TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN binge_eating_current TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN eating_unspecified_current TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN night_eating_current TYPE VARCHAR(10);

-- DIVA Inattention symptoms (A1a-A1i) - Adult and Childhood
ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1a_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1a_childhood TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1b_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1b_childhood TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1c_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1c_childhood TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1d_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1d_childhood TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1e_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1e_childhood TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1f_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1f_childhood TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1g_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1g_childhood TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1h_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1h_childhood TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1i_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a1i_childhood TYPE VARCHAR(10);

-- DIVA Hyperactivity/Impulsivity symptoms (A2a-A2i) - Adult and Childhood
ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2a_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2a_childhood TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2b_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2b_childhood TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2c_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2c_childhood TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2d_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2d_childhood TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2e_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2e_childhood TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2f_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2f_childhood TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2g_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2g_childhood TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2h_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2h_childhood TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2i_adult TYPE VARCHAR(10);

ALTER TABLE responses_dsm5_comorbid
ALTER COLUMN diva_a2i_childhood TYPE VARCHAR(10);

-- Add comments
COMMENT ON TABLE responses_dsm5_comorbid IS 'All boolean fields converted to VARCHAR(10) to support oui/non single_choice values';

