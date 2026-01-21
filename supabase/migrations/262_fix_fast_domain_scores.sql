-- Fix FAST questionnaire domain scores
-- Some FAST records had NULL domain scores even though all questions were answered
-- This migration recalculates domain scores from the raw question responses

-- Update domain scores for all FAST records that have questions but no domain scores
UPDATE bipolar_fast
SET 
  autonomy_score = COALESCE(q1, 0) + COALESCE(q2, 0) + COALESCE(q3, 0) + COALESCE(q4, 0),
  occupational_score = COALESCE(q5, 0) + COALESCE(q6, 0) + COALESCE(q7, 0) + COALESCE(q8, 0) + COALESCE(q9, 0),
  cognitive_score = COALESCE(q10, 0) + COALESCE(q11, 0) + COALESCE(q12, 0) + COALESCE(q13, 0) + COALESCE(q14, 0),
  financial_score = COALESCE(q15, 0) + COALESCE(q16, 0),
  interpersonal_score = COALESCE(q17, 0) + COALESCE(q18, 0) + COALESCE(q19, 0) + COALESCE(q20, 0) + COALESCE(q21, 0) + COALESCE(q22, 0),
  leisure_score = COALESCE(q23, 0) + COALESCE(q24, 0)
WHERE autonomy_score IS NULL 
  AND q1 IS NOT NULL;

-- Recalculate total score from domain scores
UPDATE bipolar_fast
SET total_score = 
  COALESCE(autonomy_score, 0) + 
  COALESCE(occupational_score, 0) + 
  COALESCE(cognitive_score, 0) + 
  COALESCE(financial_score, 0) + 
  COALESCE(interpersonal_score, 0) + 
  COALESCE(leisure_score, 0)
WHERE autonomy_score IS NOT NULL;

-- Update interpretation based on total score
UPDATE bipolar_fast
SET interpretation = CASE
  WHEN total_score <= 11 THEN 'Pas de déficit fonctionnel'
  WHEN total_score <= 20 THEN 'Déficit fonctionnel léger'
  WHEN total_score <= 40 THEN 'Déficit fonctionnel modéré'
  ELSE 'Déficit fonctionnel sévère'
END
WHERE autonomy_score IS NOT NULL
  AND (interpretation IS NULL OR interpretation = 'Questionnaire incomplet');
