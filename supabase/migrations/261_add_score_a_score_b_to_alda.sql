-- Add score_a and score_b fields to ALDA table for better clarity
-- These fields explicitly store Score A (clinical response) and Score B (confounding factors)

-- Add to bipolar_alda table
ALTER TABLE bipolar_alda
ADD COLUMN IF NOT EXISTS score_a INTEGER CHECK (score_a BETWEEN 0 AND 10),
ADD COLUMN IF NOT EXISTS score_b INTEGER CHECK (score_b BETWEEN 0 AND 10);

-- Update existing records to populate score_a and score_b from existing data
UPDATE bipolar_alda
SET 
  score_a = qa,
  score_b = COALESCE(qb1, 0) + COALESCE(qb2, 0) + COALESCE(qb3, 0) + COALESCE(qb4, 0) + COALESCE(qb5, 0)
WHERE score_a IS NULL OR score_b IS NULL;

-- Add comments for documentation
COMMENT ON COLUMN bipolar_alda.score_a IS 'Score A: Clinical response to lithium (0-10). Synthetic clinical judgment of lithium efficacy.';
COMMENT ON COLUMN bipolar_alda.score_b IS 'Score B: Confounding factors (0-10). Sum of 5 items (B1-B5) that reduce attribution certainty.';
