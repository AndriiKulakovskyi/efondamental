-- ============================================================================
-- Add score columns to bipolar_prise_m table
-- ============================================================================

-- Add tolerable_count and painful_count columns
ALTER TABLE bipolar_prise_m
ADD COLUMN IF NOT EXISTS tolerable_count INTEGER,
ADD COLUMN IF NOT EXISTS painful_count INTEGER;

-- Update all existing records to compute tolerable_count, painful_count, and interpretation
UPDATE bipolar_prise_m
SET 
  tolerable_count = (
    (CASE WHEN q1 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q2 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q3 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q4 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q5 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q6 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q7 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q8 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q9 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q10 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q11 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q12 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q13 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q14 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q15 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q16 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q17 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q18 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q19 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q20 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q21 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q22 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q23 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q24 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q25 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q26 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q27 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q28 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q29 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q30 = 1 THEN 1 ELSE 0 END) +
    (CASE WHEN q31 = 1 THEN 1 ELSE 0 END)
  ),
  painful_count = (
    (CASE WHEN q1 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q2 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q3 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q4 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q5 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q6 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q7 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q8 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q9 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q10 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q11 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q12 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q13 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q14 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q15 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q16 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q17 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q18 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q19 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q20 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q21 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q22 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q23 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q24 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q25 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q26 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q27 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q28 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q29 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q30 = 2 THEN 1 ELSE 0 END) +
    (CASE WHEN q31 = 2 THEN 1 ELSE 0 END)
  ),
  -- Recalculate total_score if NULL
  total_score = COALESCE(total_score, 
    COALESCE(q1, 0) + COALESCE(q2, 0) + COALESCE(q3, 0) + COALESCE(q4, 0) + 
    COALESCE(q5, 0) + COALESCE(q6, 0) + COALESCE(q7, 0) + COALESCE(q8, 0) + 
    COALESCE(q9, 0) + COALESCE(q10, 0) + COALESCE(q11, 0) + COALESCE(q12, 0) + 
    COALESCE(q13, 0) + COALESCE(q14, 0) + COALESCE(q15, 0) + COALESCE(q16, 0) + 
    COALESCE(q17, 0) + COALESCE(q18, 0) + COALESCE(q19, 0) + COALESCE(q20, 0) + 
    COALESCE(q21, 0) + COALESCE(q22, 0) + COALESCE(q23, 0) + COALESCE(q24, 0) + 
    COALESCE(q25, 0) + COALESCE(q26, 0) + COALESCE(q27, 0) + COALESCE(q28, 0) + 
    COALESCE(q29, 0) + COALESCE(q30, 0) + COALESCE(q31, 0)
  )
WHERE q1 IS NOT NULL;

-- Generate interpretations for existing records
UPDATE bipolar_prise_m
SET interpretation = CASE
  WHEN total_score = 0 THEN 'Aucun effet secondaire rapporté.'
  WHEN total_score <= 10 THEN 
    CONCAT('Effets secondaires légers. ', painful_count, ' effet(s) pénible(s), ', tolerable_count, ' tolérable(s).')
  WHEN total_score <= 20 THEN 
    CONCAT('Effets secondaires modérés. ', painful_count, ' effet(s) pénible(s), ', tolerable_count, ' tolérable(s). Surveillance recommandée.')
  WHEN total_score <= 40 THEN 
    CONCAT('Effets secondaires importants. ', painful_count, ' effet(s) pénible(s), ', tolerable_count, ' tolérable(s). Ajustement thérapeutique à envisager.')
  ELSE 
    CONCAT('Effets secondaires sévères. ', painful_count, ' effet(s) pénible(s), ', tolerable_count, ' tolérable(s). Consultation médicale urgente recommandée.')
END
WHERE total_score IS NOT NULL AND interpretation IS NULL;
