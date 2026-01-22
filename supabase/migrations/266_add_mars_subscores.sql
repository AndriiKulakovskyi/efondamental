-- ============================================================================
-- Add subscore columns to bipolar_mars and update existing records
-- ============================================================================

-- Add adherence_subscore and attitude_subscore columns
ALTER TABLE bipolar_mars
ADD COLUMN IF NOT EXISTS adherence_subscore INTEGER,
ADD COLUMN IF NOT EXISTS attitude_subscore INTEGER;

-- Update all existing records to compute scores
DO $$
DECLARE
  rec RECORD;
  total INT;
  adherence INT;
  attitude INT;
  adherence_pct NUMERIC;
  interp TEXT;
BEGIN
  FOR rec IN SELECT id, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10
             FROM bipolar_mars
             WHERE q1 IS NOT NULL
  LOOP
    -- Calculate scores
    -- Positive items (7, 8): Yes (1) = 1 point
    -- Negative items (1-6, 9, 10): No (0) = 1 point
    
    -- Adherence subscore (items 1-4)
    adherence := 
      (CASE WHEN COALESCE(rec.q1, 0) = 0 THEN 1 ELSE 0 END) +
      (CASE WHEN COALESCE(rec.q2, 0) = 0 THEN 1 ELSE 0 END) +
      (CASE WHEN COALESCE(rec.q3, 0) = 0 THEN 1 ELSE 0 END) +
      (CASE WHEN COALESCE(rec.q4, 0) = 0 THEN 1 ELSE 0 END);
    
    -- Attitude subscore (items 5-10)
    attitude := 
      (CASE WHEN COALESCE(rec.q5, 0) = 0 THEN 1 ELSE 0 END) +
      (CASE WHEN COALESCE(rec.q6, 0) = 0 THEN 1 ELSE 0 END) +
      (CASE WHEN COALESCE(rec.q7, 0) = 1 THEN 1 ELSE 0 END) +  -- positive item
      (CASE WHEN COALESCE(rec.q8, 0) = 1 THEN 1 ELSE 0 END) +  -- positive item
      (CASE WHEN COALESCE(rec.q9, 0) = 0 THEN 1 ELSE 0 END) +
      (CASE WHEN COALESCE(rec.q10, 0) = 0 THEN 1 ELSE 0 END);
    
    total := adherence + attitude;
    adherence_pct := (total::NUMERIC / 10) * 100;
    
    -- Determine interpretation
    IF total >= 8 THEN
      interp := 'Bonne observance thérapeutique. Comportements et attitudes favorables à la prise régulière du traitement. Maintien de l''adhésion recommandé.';
    ELSIF total >= 6 THEN
      interp := 'Observance modérée. Quelques difficultés d''adhésion identifiées. Exploration des obstacles et renforcement de la motivation recommandés.';
    ELSIF total >= 4 THEN
      interp := 'Observance faible. Difficultés importantes d''adhésion au traitement. Intervention ciblée nécessaire pour améliorer l''observance.';
    ELSE
      interp := 'Très faible observance. Non-adhésion majeure au traitement. Risque élevé de rechute. Intervention thérapeutique urgente recommandée pour identifier et lever les obstacles.';
    END IF;
    
    -- Update the record
    UPDATE bipolar_mars
    SET 
      total_score = total,
      adherence_subscore = adherence,
      attitude_subscore = attitude,
      adherence_percentage = adherence_pct,
      interpretation = interp
    WHERE id = rec.id;
  END LOOP;
END $$;
