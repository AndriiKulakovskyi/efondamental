-- Migration: Update MAThyS structure
-- Description: Adds new subscales and emotional items to responses_mathys table

ALTER TABLE responses_mathys 
  ADD COLUMN IF NOT EXISTS tristesse DECIMAL(3,1),
  ADD COLUMN IF NOT EXISTS joie DECIMAL(3,1),
  ADD COLUMN IF NOT EXISTS irritabilite DECIMAL(3,1),
  ADD COLUMN IF NOT EXISTS panique DECIMAL(3,1),
  ADD COLUMN IF NOT EXISTS anxiete DECIMAL(3,1),
  ADD COLUMN IF NOT EXISTS colere DECIMAL(3,1),
  ADD COLUMN IF NOT EXISTS exaltation DECIMAL(3,1),
  ADD COLUMN IF NOT EXISTS subscore_emotion DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS subscore_motivation DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS subscore_perception DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS subscore_interaction DECIMAL(5,2),
  ADD COLUMN IF NOT EXISTS subscore_cognition DECIMAL(5,2);

-- Update comments for clarity
COMMENT ON COLUMN responses_mathys.subscore_emotion IS 'Score Emotion: items 3+7+10+18 (some reversed)';
COMMENT ON COLUMN responses_mathys.subscore_motivation IS 'Score Motivation: items 2+11+12+15+16+17+19 (some reversed)';
COMMENT ON COLUMN responses_mathys.subscore_perception IS 'Score Perception sensorielle: items 1+6+8+13+20 (some reversed)';
COMMENT ON COLUMN responses_mathys.subscore_interaction IS 'Score Interaction personnelle: 4+14';
COMMENT ON COLUMN responses_mathys.subscore_cognition IS 'Score Cognition: items 5+9 (some reversed)';
