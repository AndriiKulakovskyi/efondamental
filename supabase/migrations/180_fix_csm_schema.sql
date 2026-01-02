-- Fix CSM (Composite Scale of Morningness) schema
-- CSM has 13 items (not 12), and questions 1, 2, 7 use a 5-point scale (1-5), others use 4-point (1-4)

-- First, drop the generated column (it references q1-q12 only)
ALTER TABLE responses_csm DROP COLUMN IF EXISTS total_score;

-- Add q13 column
ALTER TABLE responses_csm ADD COLUMN IF NOT EXISTS q13 INTEGER;

-- Add chronotype classification column
ALTER TABLE responses_csm ADD COLUMN IF NOT EXISTS chronotype TEXT;

-- Drop old constraints for q1, q2, q7 (they need 1-5 range, not 1-4)
ALTER TABLE responses_csm DROP CONSTRAINT IF EXISTS responses_csm_q1_check;
ALTER TABLE responses_csm DROP CONSTRAINT IF EXISTS responses_csm_q2_check;
ALTER TABLE responses_csm DROP CONSTRAINT IF EXISTS responses_csm_q7_check;

-- Add new constraints with correct ranges
-- Questions 1, 2, 7 use valeur_champ3 (5-point scale: 1-5)
ALTER TABLE responses_csm ADD CONSTRAINT responses_csm_q1_check CHECK (q1 BETWEEN 1 AND 5);
ALTER TABLE responses_csm ADD CONSTRAINT responses_csm_q2_check CHECK (q2 BETWEEN 1 AND 5);
ALTER TABLE responses_csm ADD CONSTRAINT responses_csm_q7_check CHECK (q7 BETWEEN 1 AND 5);

-- Add constraint for q13 (4-point scale: 1-4)
ALTER TABLE responses_csm ADD CONSTRAINT responses_csm_q13_check CHECK (q13 BETWEEN 1 AND 4);

-- Make q13 NOT NULL (with default for existing rows)
UPDATE responses_csm SET q13 = 2 WHERE q13 IS NULL;
ALTER TABLE responses_csm ALTER COLUMN q13 SET NOT NULL;

-- Recreate total_score as a generated column including q13
-- Score range: 13-55 (3 questions with 5 options, 10 questions with 4 options)
ALTER TABLE responses_csm ADD COLUMN total_score INTEGER GENERATED ALWAYS AS (
    q1 + q2 + q3 + q4 + q5 + q6 + q7 + q8 + q9 + q10 + q11 + q12 + q13
) STORED;

