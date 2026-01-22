-- Migration: Update Epworth scores and interpretations for existing records
-- This migration recalculates total score, severity, and interpretation

DO $$
DECLARE
  rec RECORD;
  v_total INTEGER;
  v_severity TEXT;
  v_clinical_context TEXT;
  v_interpretation TEXT;
BEGIN
  FOR rec IN SELECT * FROM bipolar_epworth LOOP
    -- Calculate total score (sum of q1-q8, q9 not included)
    v_total := COALESCE(rec.q1, 0) + COALESCE(rec.q2, 0) + COALESCE(rec.q3, 0) + 
               COALESCE(rec.q4, 0) + COALESCE(rec.q5, 0) + COALESCE(rec.q6, 0) + 
               COALESCE(rec.q7, 0) + COALESCE(rec.q8, 0);
    
    -- Determine severity and interpretation based on score
    IF v_total <= 5 THEN
      v_severity := 'Normale basse';
      v_clinical_context := 'lower_normal';
      v_interpretation := 'Somnolence diurne normale basse (0-5). Niveau de vigilance diurne satisfaisant. Pas de somnolence pathologique détectée. Ce score est compatible avec un sommeil de bonne qualité et une absence de trouble de la vigilance. Aucune intervention spécifique nécessaire concernant la somnolence diurne.';
    ELSIF v_total <= 10 THEN
      v_severity := 'Normale haute';
      v_clinical_context := 'higher_normal';
      v_interpretation := 'Somnolence diurne normale haute (6-10). Niveau de vigilance dans les limites supérieures de la normale. Somnolence légère qui peut être physiologique chez certaines personnes. Surveillance recommandée si le score augmente ou si plaintes associées. Vérifier l''hygiène du sommeil et exclure une dette de sommeil chronique.';
    ELSIF v_total <= 12 THEN
      v_severity := 'Légère';
      v_clinical_context := 'mild_excessive';
      v_interpretation := 'Somnolence diurne excessive légère (11-12). Somnolence pathologique débutante. Retentissement fonctionnel possible dans certaines situations. Évaluation recommandée : qualité du sommeil nocturne, présence d''apnées du sommeil, syndrome des jambes sans repos, narcolepsie. Envisager une consultation spécialisée si persistance ou aggravation. Attention à la conduite automobile.';
    ELSIF v_total <= 15 THEN
      v_severity := 'Modérée';
      v_clinical_context := 'moderate_excessive';
      v_interpretation := 'Somnolence diurne excessive modérée (13-15). Somnolence pathologique significative avec impact sur le fonctionnement quotidien. Risque accru d''accidents (conduite, travail). Bilan approfondi nécessaire : polysomnographie pour rechercher un syndrome d''apnées obstructives du sommeil (SAOS), test itératif de latence d''endormissement (TILE) si suspicion de narcolepsie. Consultation spécialisée du sommeil fortement recommandée.';
    ELSE
      v_severity := 'Sévère';
      v_clinical_context := 'severe_excessive';
      v_interpretation := 'Somnolence diurne excessive sévère (16-24). Somnolence pathologique majeure avec retentissement important sur la qualité de vie et risque élevé d''accidents. Contre-indication formelle à la conduite automobile. Bilan du sommeil en urgence : polysomnographie, TILE, recherche de narcolepsie, hypersomnie idiopathique, SAOS sévère. Orientation rapide vers un centre du sommeil. Prise en charge multidisciplinaire nécessaire. Arrêt de travail à considérer si activité à risque.';
    END IF;
    
    -- Update the record
    UPDATE bipolar_epworth
    SET 
      severity = v_severity,
      clinical_context = v_clinical_context,
      interpretation = v_interpretation,
      updated_at = NOW()
    WHERE id = rec.id;
  END LOOP;
END $$;
