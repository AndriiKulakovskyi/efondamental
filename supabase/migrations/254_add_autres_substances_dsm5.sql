-- Migration: Add "Autres substances" consumption and DSM5 criteria columns
-- This adds detailed consumption questions and DSM5 criteria for other substances

-- Consumption fields - Lifetime
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_autres_qty_vie NUMERIC,
ADD COLUMN IF NOT EXISTS rad_add_autres_freq_vie VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_freq_vie_spec INTEGER;

-- Consumption fields - 12 months
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_autres_qty_12m NUMERIC,
ADD COLUMN IF NOT EXISTS rad_add_autres_freq_12m VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_freq_12m_spec INTEGER;

-- DSM5 Screening
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_screen VARCHAR(10);

-- DSM5 Criteria - Lifetime (a-l)
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_a VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_b VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_c VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_d VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_e VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_f VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_g VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_h VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_i VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_j VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_k VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_l VARCHAR(20);

-- DSM5 Criteria - 12 month follow-ups (a-l)
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_a_12m VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_b_12m VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_c_12m VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_d_12m VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_e_12m VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_f_12m VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_g_12m VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_h_12m VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_i_12m VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_j_12m VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_k_12m VARCHAR(20),
ADD COLUMN IF NOT EXISTS rad_add_autres_dsm5_l_12m VARCHAR(20);

-- Computed severity scores
ALTER TABLE responses_eval_addictologique_sz
ADD COLUMN IF NOT EXISTS dsm5_autres_lifetime_count INTEGER,
ADD COLUMN IF NOT EXISTS dsm5_autres_12month_count INTEGER,
ADD COLUMN IF NOT EXISTS dsm5_autres_lifetime_severity VARCHAR(20),
ADD COLUMN IF NOT EXISTS dsm5_autres_12month_severity VARCHAR(20);

-- Add comments for documentation
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_autres_qty_vie IS 'Quantity per day during max lifetime consumption periods';
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_autres_freq_vie IS 'Frequency during max lifetime consumption (1_to_7 / less_than_once)';
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_autres_freq_vie_spec IS 'Specify times per week (1-7) for lifetime frequency';
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_autres_qty_12m IS 'Quantity per day during last 12 months';
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_autres_freq_12m IS 'Frequency during last 12 months (1_to_7 / less_than_once)';
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_autres_freq_12m_spec IS 'Specify times per week (1-7) for 12 months frequency';
COMMENT ON COLUMN responses_eval_addictologique_sz.rad_add_autres_dsm5_screen IS 'Has patient shown any substance use disorder symptom lifetime';
COMMENT ON COLUMN responses_eval_addictologique_sz.dsm5_autres_lifetime_count IS 'Count of positive DSM5 criteria for other substances (lifetime)';
COMMENT ON COLUMN responses_eval_addictologique_sz.dsm5_autres_12month_count IS 'Count of positive DSM5 criteria for other substances (12 months)';
COMMENT ON COLUMN responses_eval_addictologique_sz.dsm5_autres_lifetime_severity IS 'DSM5 severity for other substances (none/mild/moderate/severe) - lifetime';
COMMENT ON COLUMN responses_eval_addictologique_sz.dsm5_autres_12month_severity IS 'DSM5 severity for other substances (none/mild/moderate/severe) - 12 months';
