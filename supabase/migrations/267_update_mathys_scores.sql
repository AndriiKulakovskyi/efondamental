-- ============================================================================
-- Update MAThyS scores for all existing records
-- ============================================================================

-- Update all existing records to compute all subscores and dimension scores
DO $$
DECLARE
  rec RECORD;
  adj NUMERIC[];  -- Adjusted values array (1-indexed)
  total NUMERIC;
  emo NUMERIC;
  motiv NUMERIC;
  percep NUMERIC;
  interact NUMERIC;
  cogn NUMERIC;
  cog_speed NUMERIC;
  emo_hyper NUMERIC;
  emo_hypo NUMERIC;
  motiv_dim NUMERIC;
  motor NUMERIC;
  interp TEXT;
  state TEXT;
  details TEXT;
BEGIN
  FOR rec IN SELECT id, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10,
                         q11, q12, q13, q14, q15, q16, q17, q18, q19, q20
             FROM bipolar_mathys
             WHERE q1 IS NOT NULL
  LOOP
    -- Initialize adjusted values array
    adj := ARRAY[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];  -- 21 elements (0-20, we use 1-20)
    
    -- Apply reversal for items 5, 6, 7, 8, 9, 10, 17, 18
    adj[1] := COALESCE(rec.q1, 0);
    adj[2] := COALESCE(rec.q2, 0);
    adj[3] := COALESCE(rec.q3, 0);
    adj[4] := COALESCE(rec.q4, 0);
    adj[5] := 10 - COALESCE(rec.q5, 0);  -- reverse
    adj[6] := 10 - COALESCE(rec.q6, 0);  -- reverse
    adj[7] := 10 - COALESCE(rec.q7, 0);  -- reverse
    adj[8] := 10 - COALESCE(rec.q8, 0);  -- reverse
    adj[9] := 10 - COALESCE(rec.q9, 0);  -- reverse
    adj[10] := 10 - COALESCE(rec.q10, 0);  -- reverse
    adj[11] := COALESCE(rec.q11, 0);
    adj[12] := COALESCE(rec.q12, 0);
    adj[13] := COALESCE(rec.q13, 0);
    adj[14] := COALESCE(rec.q14, 0);
    adj[15] := COALESCE(rec.q15, 0);
    adj[16] := COALESCE(rec.q16, 0);
    adj[17] := 10 - COALESCE(rec.q17, 0);  -- reverse
    adj[18] := 10 - COALESCE(rec.q18, 0);  -- reverse
    adj[19] := COALESCE(rec.q19, 0);
    adj[20] := COALESCE(rec.q20, 0);
    
    -- Calculate subscores (sums)
    emo := adj[3] + adj[7] + adj[18];  -- Emotion: 3, 7, 18
    motiv := adj[11] + adj[15] + adj[16];  -- Motivation: 11, 15, 16
    percep := adj[1] + adj[6] + adj[8] + adj[13] + adj[20];  -- Perception: 1, 6, 8, 13, 20
    interact := adj[4] + adj[14];  -- Interaction: 4, 14
    cogn := adj[5] + adj[9] + adj[10] + adj[12] + adj[17];  -- Cognition: 5, 9, 10, 12, 17
    
    -- Calculate dimension scores (means)
    cog_speed := (adj[9] + adj[12]) / 2.0;  -- Cognitive speed: 9, 12
    emo_hyper := (adj[1] + adj[3] + adj[7] + adj[10] + adj[18]) / 5.0;  -- Emotional hyperreactivity: 1, 3, 7, 10, 18
    emo_hypo := (adj[6] + adj[7] + adj[8] + adj[13] + adj[18]) / 5.0;  -- Emotional hyporeactivity: 6, 7, 8, 13, 18
    motiv_dim := (adj[11] + adj[15] + adj[16]) / 3.0;  -- Motivation: 11, 15, 16
    motor := (adj[2] + adj[19]) / 2.0;  -- Motor activity: 2, 19
    
    -- Calculate total score
    total := adj[1] + adj[2] + adj[3] + adj[4] + adj[5] + adj[6] + adj[7] + adj[8] + adj[9] + adj[10] +
             adj[11] + adj[12] + adj[13] + adj[14] + adj[15] + adj[16] + adj[17] + adj[18] + adj[19] + adj[20];
    
    -- Generate interpretation
    IF total < 60 THEN
      state := 'État dépressif marqué';
      details := 'Inhibition importante sur le plan thymique, cognitif et moteur. Retentissement fonctionnel probable.';
    ELSIF total < 80 THEN
      state := 'Tendance dépressive';
      details := 'Ralentissement modéré avec émoussement affectif et baisse de motivation. Surveillance recommandée.';
    ELSIF total <= 120 THEN
      state := 'État euthymique';
      details := 'Équilibre thymique globalement préservé. Fonctionnement dans les normes.';
    ELSIF total <= 140 THEN
      state := 'Tendance hypomaniaque';
      details := 'Activation modérée avec augmentation de l''énergie, de la réactivité émotionnelle et cognitive. Surveillance conseillée.';
    ELSE
      state := 'État hypomaniaque/maniaque';
      details := 'Activation importante avec hyperréactivité, accélération cognitive et motrice. Risque de décompensation.';
    END IF;
    
    interp := state || '. ' || details || ' (Score total: ' || ROUND(total::NUMERIC, 1)::TEXT || '/200)';
    
    -- Update the record
    UPDATE bipolar_mathys
    SET 
      subscore_emotion = emo,
      subscore_motivation = motiv,
      subscore_perception = percep,
      subscore_interaction = interact,
      subscore_cognition = cogn,
      total_score = total,
      cognitive_speed = ROUND(cog_speed::NUMERIC, 2),
      emotional_hyperreactivity = ROUND(emo_hyper::NUMERIC, 2),
      emotional_hyporeactivity = ROUND(emo_hypo::NUMERIC, 2),
      motivation = ROUND(motiv_dim::NUMERIC, 2),
      motor_activity = ROUND(motor::NUMERIC, 2),
      interpretation = interp
    WHERE id = rec.id;
  END LOOP;
END $$;
