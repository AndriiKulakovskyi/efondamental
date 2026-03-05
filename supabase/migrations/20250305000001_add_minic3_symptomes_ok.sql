-- Add auto-computed C3 symptom threshold field to MINI (depression_mini)
ALTER TABLE depression_mini ADD COLUMN IF NOT EXISTS minic3_symptomes_ok INTEGER;
