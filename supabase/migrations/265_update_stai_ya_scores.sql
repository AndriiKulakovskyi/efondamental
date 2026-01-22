-- ============================================================================
-- Update STAI-YA scores and interpretations for existing records
-- ============================================================================

-- Update all existing records to recalculate total_score (with reverse scoring), anxiety_level, and interpretation
DO $$
DECLARE
  rec RECORD;
  total INT;
  anxiety_lvl TEXT;
  interp TEXT;
BEGIN
  FOR rec IN SELECT id, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, 
                         q11, q12, q13, q14, q15, q16, q17, q18, q19, q20
             FROM bipolar_stai_ya
             WHERE q1 IS NOT NULL
  LOOP
    -- Calculate total score with reverse scoring for items 1, 2, 5, 8, 10, 11, 15, 16, 19, 20
    total := 
      (5 - COALESCE(rec.q1, 0)) +  -- reverse
      (5 - COALESCE(rec.q2, 0)) +  -- reverse
      COALESCE(rec.q3, 0) +
      COALESCE(rec.q4, 0) +
      (5 - COALESCE(rec.q5, 0)) +  -- reverse
      COALESCE(rec.q6, 0) +
      COALESCE(rec.q7, 0) +
      (5 - COALESCE(rec.q8, 0)) +  -- reverse
      COALESCE(rec.q9, 0) +
      (5 - COALESCE(rec.q10, 0)) + -- reverse
      (5 - COALESCE(rec.q11, 0)) + -- reverse
      COALESCE(rec.q12, 0) +
      COALESCE(rec.q13, 0) +
      COALESCE(rec.q14, 0) +
      (5 - COALESCE(rec.q15, 0)) + -- reverse
      (5 - COALESCE(rec.q16, 0)) + -- reverse
      COALESCE(rec.q17, 0) +
      COALESCE(rec.q18, 0) +
      (5 - COALESCE(rec.q19, 0)) + -- reverse
      (5 - COALESCE(rec.q20, 0));  -- reverse
    
    -- Determine anxiety level
    IF total <= 35 THEN
      anxiety_lvl := 'low';
      interp := 'Anxiété légère ou absente. État émotionnel calme, détendu. Pas de signes cliniques d''anxiété significative en ce moment.';
    ELSIF total <= 45 THEN
      anxiety_lvl := 'moderate';
      interp := 'Anxiété modérée. Présence de tension ou d''inquiétude légère à modérée. Niveau d''anxiété encore gérable, mais une surveillance peut être utile.';
    ELSIF total <= 55 THEN
      anxiety_lvl := 'moderate-high';
      interp := 'Anxiété moyenne-haute. Tension et inquiétude notables. Signes d''anxiété cliniquement significative. Une intervention ou un suivi est recommandé.';
    ELSIF total <= 65 THEN
      anxiety_lvl := 'high';
      interp := 'Anxiété élevée. Forte tension émotionnelle, inquiétude importante. Risque de retentissement fonctionnel. Prise en charge thérapeutique recommandée.';
    ELSE
      anxiety_lvl := 'very-high';
      interp := 'Anxiété très élevée / intense. État de détresse marqué, anxiété envahissante. Retentissement fonctionnel probable. Intervention thérapeutique urgente indiquée.';
    END IF;
    
    -- Update the record
    UPDATE bipolar_stai_ya
    SET 
      total_score = total,
      anxiety_level = anxiety_lvl,
      interpretation = interp
    WHERE id = rec.id;
  END LOOP;
END $$;
