-- ============================================================================
-- Update QIDS-SR16 scores for all existing records
-- ============================================================================

-- Update all existing records to compute total_score and interpretation
DO $$
DECLARE
  rec RECORD;
  sleep_score INT;
  appetite_weight_score INT;
  psychomotor_score INT;
  total INT;
  interp TEXT;
BEGIN
  FOR rec IN SELECT id, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
                         q11, q12, q13, q14, q15, q16
             FROM bipolar_qids_sr16
             WHERE q1 IS NOT NULL
  LOOP
    -- Calculate domain scores (max within domain)
    sleep_score := GREATEST(COALESCE(rec.q1, 0), COALESCE(rec.q2, 0), COALESCE(rec.q3, 0), COALESCE(rec.q4, 0));
    appetite_weight_score := GREATEST(COALESCE(rec.q6, 0), COALESCE(rec.q7, 0), COALESCE(rec.q8, 0), COALESCE(rec.q9, 0));
    psychomotor_score := GREATEST(COALESCE(rec.q15, 0), COALESCE(rec.q16, 0));
    
    -- Calculate total score
    total := sleep_score + 
             COALESCE(rec.q5, 0) + 
             appetite_weight_score + 
             COALESCE(rec.q10, 0) + 
             COALESCE(rec.q11, 0) + 
             COALESCE(rec.q12, 0) + 
             COALESCE(rec.q13, 0) + 
             COALESCE(rec.q14, 0) + 
             psychomotor_score;
    
    -- Generate interpretation
    IF total <= 5 THEN
      interp := 'Absence de dépression. État thymique normal, sans symptomatologie dépressive cliniquement significative.';
    ELSIF total <= 10 THEN
      interp := 'Dépression légère. Symptômes dépressifs présents mais d''intensité modérée. Impact fonctionnel limité. Surveillance recommandée.';
    ELSIF total <= 15 THEN
      interp := 'Dépression modérée. Symptomatologie dépressive notable avec retentissement sur le fonctionnement quotidien. Prise en charge thérapeutique indiquée.';
    ELSIF total <= 20 THEN
      interp := 'Dépression sévère. Symptômes dépressifs importants avec retentissement fonctionnel marqué. Intervention thérapeutique active nécessaire.';
    ELSE
      interp := 'Dépression très sévère. Symptomatologie dépressive majeure avec altération fonctionnelle importante. Prise en charge intensive urgente recommandée.';
    END IF;
    
    -- Update the record
    UPDATE bipolar_qids_sr16
    SET 
      total_score = total,
      interpretation = interp
    WHERE id = rec.id;
  END LOOP;
END $$;
