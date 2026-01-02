-- Add follow-up columns for hair loss triggered/aggravated by valproate (Depakine/Depamide/Depakote)
-- These appear when q5_4_hair_loss_depakine = 'yes'

-- Add triggered by valproate column
ALTER TABLE responses_patho_dermato 
ADD COLUMN IF NOT EXISTS q5_5_hair_loss_triggered_valproate VARCHAR(3) 
CHECK (q5_5_hair_loss_triggered_valproate IN ('yes', 'no'));

-- Add aggravated by valproate column
ALTER TABLE responses_patho_dermato 
ADD COLUMN IF NOT EXISTS q5_6_hair_loss_aggravated_valproate VARCHAR(3) 
CHECK (q5_6_hair_loss_aggravated_valproate IN ('yes', 'no'));

-- Add comments
COMMENT ON COLUMN responses_patho_dermato.q5_5_hair_loss_triggered_valproate IS 'Hair loss triggered by valproic acid (Depakine/Depamide/Depakote)';
COMMENT ON COLUMN responses_patho_dermato.q5_6_hair_loss_aggravated_valproate IS 'Hair loss aggravated by valproic acid (Depakine/Depamide/Depakote)';

