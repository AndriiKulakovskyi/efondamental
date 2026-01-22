-- Migration: Update PSQI scores and interpretations for existing records
-- This migration recalculates all component scores, sleep efficiency, and interpretation

DO $$
DECLARE
  rec RECORD;
  v_c1 INTEGER;
  v_c2 INTEGER;
  v_c3 INTEGER;
  v_c4 INTEGER;
  v_c5 INTEGER;
  v_c6 INTEGER;
  v_c7 INTEGER;
  v_total INTEGER;
  v_interpretation TEXT;
  
  -- Sleep calculation variables
  v_q2_score INTEGER;
  v_latency_sum INTEGER;
  v_sleep_hours DECIMAL;
  v_disturbance_sum INTEGER;
  v_day_sum INTEGER;
  
  -- Time parsing variables
  v_bedtime_parts TEXT[];
  v_waketime_parts TEXT[];
  v_sleep_parts TEXT[];
  v_bedtime_hours DECIMAL;
  v_waketime_hours DECIMAL;
  v_time_in_bed DECIMAL;
  v_efficiency DECIMAL;
BEGIN
  FOR rec IN SELECT * FROM bipolar_psqi LOOP
    -- Component 1: Subjective sleep quality (Q6)
    v_c1 := COALESCE(rec.q6, 0);
    
    -- Component 2: Sleep latency (Q2 + Q5a)
    -- Q2 scoring: 0=<=15min, 1=16-30, 2=31-60, 3=>60
    IF rec.q2_minutes_to_sleep IS NULL THEN
      v_q2_score := 0;
    ELSIF rec.q2_minutes_to_sleep <= 15 THEN
      v_q2_score := 0;
    ELSIF rec.q2_minutes_to_sleep <= 30 THEN
      v_q2_score := 1;
    ELSIF rec.q2_minutes_to_sleep <= 60 THEN
      v_q2_score := 2;
    ELSE
      v_q2_score := 3;
    END IF;
    
    v_latency_sum := v_q2_score + COALESCE(rec.q5a, 0);
    IF v_latency_sum = 0 THEN
      v_c2 := 0;
    ELSIF v_latency_sum <= 2 THEN
      v_c2 := 1;
    ELSIF v_latency_sum <= 4 THEN
      v_c2 := 2;
    ELSE
      v_c2 := 3;
    END IF;
    
    -- Component 3: Sleep duration (Q4)
    -- Parse HH:MM format to decimal hours
    IF rec.q4_hours_sleep IS NOT NULL THEN
      v_sleep_parts := string_to_array(rec.q4_hours_sleep, ':');
      v_sleep_hours := COALESCE(v_sleep_parts[1]::INTEGER, 0) + COALESCE(v_sleep_parts[2]::INTEGER, 0) / 60.0;
    ELSE
      v_sleep_hours := 0;
    END IF;
    
    IF v_sleep_hours > 7 THEN
      v_c3 := 0;
    ELSIF v_sleep_hours >= 6 THEN
      v_c3 := 1;
    ELSIF v_sleep_hours >= 5 THEN
      v_c3 := 2;
    ELSE
      v_c3 := 3;
    END IF;
    
    -- Component 4: Habitual sleep efficiency
    -- Calculate time in bed
    IF rec.q1_bedtime IS NOT NULL AND rec.q3_waketime IS NOT NULL THEN
      v_bedtime_parts := string_to_array(rec.q1_bedtime, ':');
      v_waketime_parts := string_to_array(rec.q3_waketime, ':');
      v_bedtime_hours := COALESCE(v_bedtime_parts[1]::INTEGER, 0) + COALESCE(v_bedtime_parts[2]::INTEGER, 0) / 60.0;
      v_waketime_hours := COALESCE(v_waketime_parts[1]::INTEGER, 0) + COALESCE(v_waketime_parts[2]::INTEGER, 0) / 60.0;
      
      v_time_in_bed := v_waketime_hours - v_bedtime_hours;
      IF v_time_in_bed < 0 THEN
        v_time_in_bed := v_time_in_bed + 24; -- Overnight adjustment
      END IF;
    ELSE
      v_time_in_bed := 8; -- Default
    END IF;
    
    IF v_time_in_bed > 0 THEN
      v_efficiency := (v_sleep_hours / v_time_in_bed) * 100;
    ELSE
      v_efficiency := 0;
    END IF;
    
    IF v_efficiency >= 85 THEN
      v_c4 := 0;
    ELSIF v_efficiency >= 75 THEN
      v_c4 := 1;
    ELSIF v_efficiency >= 65 THEN
      v_c4 := 2;
    ELSE
      v_c4 := 3;
    END IF;
    
    -- Component 5: Sleep disturbances (Q5b-Q5j sum)
    v_disturbance_sum := COALESCE(rec.q5b, 0) + COALESCE(rec.q5c, 0) + COALESCE(rec.q5d, 0) +
                         COALESCE(rec.q5e, 0) + COALESCE(rec.q5f, 0) + COALESCE(rec.q5g, 0) +
                         COALESCE(rec.q5h, 0) + COALESCE(rec.q5i, 0) + COALESCE(rec.q5j, 0);
    
    IF v_disturbance_sum = 0 THEN
      v_c5 := 0;
    ELSIF v_disturbance_sum <= 9 THEN
      v_c5 := 1;
    ELSIF v_disturbance_sum <= 18 THEN
      v_c5 := 2;
    ELSE
      v_c5 := 3;
    END IF;
    
    -- Component 6: Use of sleep medication (Q7)
    v_c6 := COALESCE(rec.q7, 0);
    
    -- Component 7: Daytime dysfunction (Q8 + Q9)
    v_day_sum := COALESCE(rec.q8, 0) + COALESCE(rec.q9, 0);
    IF v_day_sum = 0 THEN
      v_c7 := 0;
    ELSIF v_day_sum <= 2 THEN
      v_c7 := 1;
    ELSIF v_day_sum <= 4 THEN
      v_c7 := 2;
    ELSE
      v_c7 := 3;
    END IF;
    
    -- Total score
    v_total := v_c1 + v_c2 + v_c3 + v_c4 + v_c5 + v_c6 + v_c7;
    
    -- Interpretation
    IF v_total <= 5 THEN
      v_interpretation := 'Bonne qualité de sommeil. Score ≤ 5 : Sommeil de qualité satisfaisante sans plainte cliniquement significative. Les habitudes de sommeil sont adaptées et le retentissement diurne est absent ou minime.';
    ELSIF v_total <= 10 THEN
      v_interpretation := 'Qualité de sommeil altérée. Score 6-10 : Difficultés de sommeil modérées. Présence de plaintes subjectives avec retentissement sur le fonctionnement quotidien. Évaluation des facteurs contributifs recommandée (anxiété, hygiène du sommeil, médicaments).';
    ELSIF v_total <= 15 THEN
      v_interpretation := 'Mauvaise qualité de sommeil. Score 11-15 : Troubles du sommeil marqués avec impact significatif sur la qualité de vie. Plusieurs composantes du sommeil sont perturbées. Intervention thérapeutique recommandée : TCC-I (thérapie cognitivo-comportementale de l''insomnie), révision des traitements, bilan des comorbidités.';
    ELSE
      v_interpretation := 'Très mauvaise qualité de sommeil. Score 16-21 : Insomnie sévère avec retentissement majeur. Dysfonctionnement important sur le plan diurne. Prise en charge multidisciplinaire nécessaire. Rechercher un trouble du sommeil primaire (apnée, syndrome des jambes sans repos) ou une pathologie psychiatrique sous-jacente. Orientation vers une consultation spécialisée du sommeil si besoin.';
    END IF;
    
    -- Update the record
    UPDATE bipolar_psqi
    SET 
      c1_subjective_quality = v_c1,
      c2_latency = v_c2,
      c3_duration = v_c3,
      c4_efficiency = v_c4,
      c5_disturbances = v_c5,
      c6_medication = v_c6,
      c7_daytime_dysfunction = v_c7,
      total_score = v_total,
      time_in_bed_hours = ROUND(v_time_in_bed::NUMERIC, 2),
      sleep_efficiency_pct = ROUND(v_efficiency::NUMERIC, 2),
      interpretation = v_interpretation,
      updated_at = NOW()
    WHERE id = rec.id;
  END LOOP;
END $$;
