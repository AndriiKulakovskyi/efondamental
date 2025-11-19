-- ============================================================================
-- eFondaMental Platform - Bipolar Screening Auto-questionnaires
-- ============================================================================
-- This migration replaces the existing bipolar screening visit with
-- auto-questionnaires (ASRM, QIDS-SR16, MDQ) and medical questionnaires
-- (Diagnostic, Orientation Centre Expert)
-- ============================================================================

DO $$
DECLARE
  bipolar_pathology_id UUID;
  template_id UUID;
  module_autoquestionnaires_id UUID;
  module_medical_id UUID;
BEGIN
  -- Get bipolar pathology ID
  SELECT id INTO bipolar_pathology_id FROM pathologies WHERE type = 'bipolar';

  IF bipolar_pathology_id IS NULL THEN
    RAISE EXCEPTION 'Bipolar pathology not found';
  END IF;

  -- Clean up old data: Delete visits referencing old screening templates
  -- This will cascade delete questionnaire_responses and other related data
  DELETE FROM visits
  WHERE visit_template_id IN (
    SELECT id FROM visit_templates 
    WHERE pathology_id = bipolar_pathology_id 
    AND visit_type = 'screening'
  );

  -- Now delete the old screening visit templates (and their modules/questionnaires via CASCADE)
  DELETE FROM visit_templates 
  WHERE pathology_id = bipolar_pathology_id 
  AND visit_type = 'screening';

  -- ========================================================================
  -- eBIPOLAR SCREENING VISIT (With Auto-questionnaires)
  -- ========================================================================
  INSERT INTO visit_templates (pathology_id, visit_type, name, description, active)
  VALUES (
    bipolar_pathology_id,
    'screening',
    'eBipolar Visite de Screening',
    'Visite de screening complète avec autoquestionnaires et évaluation médicale',
    true
  )
  RETURNING id INTO template_id;

  -- ========================================================================
  -- MODULE 1: AUTOQUESTIONNAIRES (target_role: patient)
  -- ========================================================================
  INSERT INTO modules (visit_template_id, name, description, order_index, active)
  VALUES (
    template_id,
    'Autoquestionnaires',
    'Questionnaires à remplir par le patient',
    1,
    true
  )
  RETURNING id INTO module_autoquestionnaires_id;

  -- ASRM/Altman Scale
  INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active, metadata)
  VALUES (
    module_autoquestionnaires_id,
    'ASRM_FR',
    'Auto-Questionnaire Altman (ASRM)',
    'Échelle d''Auto-Évaluation de la Manie - Période de référence: 7 derniers jours',
    'patient',
    '[
      {
        "id": "q1",
        "section_id": "sec1",
        "text": "Question 1: Humeur (Bonheur/Joie)",
        "type": "single_choice",
        "required": true,
        "options": [
          {"code": 0, "label": "Je ne me sens pas plus heureux(se) ou plus joyeux(se) que d''habitude.", "score": 0},
          {"code": 1, "label": "Je me sens parfois plus heureux(se) ou plus joyeux(se) que d''habitude.", "score": 1},
          {"code": 2, "label": "Je me sens souvent plus heureux(se) ou plus joyeux(se) que d''habitude.", "score": 2},
          {"code": 3, "label": "Je me sens plus heureux(se) ou plus joyeux(se) que d''habitude la plupart du temps.", "score": 3},
          {"code": 4, "label": "Je me sens plus heureux(se) ou plus joyeux(se) que d''habitude tout le temps.", "score": 4}
        ],
        "constraints": {"value_type": "integer", "allowed_values": [0,1,2,3,4]}
      },
      {
        "id": "q2",
        "section_id": "sec1",
        "text": "Question 2: Confiance en soi",
        "type": "single_choice",
        "required": true,
        "options": [
          {"code": 0, "label": "Je ne me sens pas plus sûr(e) de moi que d''habitude.", "score": 0},
          {"code": 1, "label": "Je me sens parfois plus sûr(e) de moi que d''habitude.", "score": 1},
          {"code": 2, "label": "Je me sens souvent plus sûr(e) de moi que d''habitude.", "score": 2},
          {"code": 3, "label": "Je me sens plus sûr(e) de moi que d''habitude la plupart du temps.", "score": 3},
          {"code": 4, "label": "Je me sens extrêmement sûr(e) de moi tout le temps.", "score": 4}
        ],
        "constraints": {"value_type": "integer", "allowed_values": [0,1,2,3,4]}
      },
      {
        "id": "q3",
        "section_id": "sec1",
        "text": "Question 3: Besoin de sommeil",
        "type": "single_choice",
        "required": true,
        "options": [
          {"code": 0, "label": "Je n''ai pas besoin de moins de sommeil que d''habitude.", "score": 0},
          {"code": 1, "label": "J''ai parfois besoin de moins de sommeil que d''habitude.", "score": 1},
          {"code": 2, "label": "J''ai souvent besoin de moins de sommeil que d''habitude.", "score": 2},
          {"code": 3, "label": "J''ai fréquemment besoin de moins de sommeil que d''habitude.", "score": 3},
          {"code": 4, "label": "Je peux passer toute la journée et toute la nuit sans dormir et ne pas être fatigué(e).", "score": 4}
        ],
        "constraints": {"value_type": "integer", "allowed_values": [0,1,2,3,4]}
      },
      {
        "id": "q4",
        "section_id": "sec1",
        "text": "Question 4: Discours (Loquacité)",
        "type": "single_choice",
        "required": true,
        "options": [
          {"code": 0, "label": "Je ne parle pas plus que d''habitude.", "score": 0},
          {"code": 1, "label": "Je parle parfois plus que d''habitude.", "score": 1},
          {"code": 2, "label": "Je parle souvent plus que d''habitude.", "score": 2},
          {"code": 3, "label": "Je parle fréquemment plus que d''habitude.", "score": 3},
          {"code": 4, "label": "Je parle sans arrêt et je ne peux être interrompu(e).", "score": 4}
        ],
        "constraints": {"value_type": "integer", "allowed_values": [0,1,2,3,4]}
      },
      {
        "id": "q5",
        "section_id": "sec1",
        "text": "Question 5: Niveau d''activité",
        "type": "single_choice",
        "required": true,
        "options": [
          {"code": 0, "label": "Je n''ai pas été plus actif(ve) que d''habitude (socialement, sexuellement, au travail, à la maison ou à l''école).", "score": 0},
          {"code": 1, "label": "J''ai parfois été plus actif(ve) que d''habitude.", "score": 1},
          {"code": 2, "label": "J''ai souvent été plus actif(ve) que d''habitude.", "score": 2},
          {"code": 3, "label": "J''ai fréquemment été plus actif(ve) que d''habitude.", "score": 3},
          {"code": 4, "label": "Je suis constamment actif(ve), ou en mouvement tout le temps.", "score": 4}
        ],
        "constraints": {"value_type": "integer", "allowed_values": [0,1,2,3,4]}
      }
    ]'::jsonb,
    true,
    '{"scoring_type": "simple_sum", "range": [0, 20], "cutoff": 6}'::jsonb
  );

  -- QIDS-SR16
  INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active, metadata)
  VALUES (
    module_autoquestionnaires_id,
    'QIDS_SR16_FR',
    'QIDS-SR16',
    'Auto-questionnaire court sur les symptômes de la dépression - Période de référence: 7 derniers jours',
    'patient',
    '[
      {"id": "q1", "section_id": "part1", "text": "Endormissement", "type": "single_choice", "required": true, "options": [
        {"code": 0, "label": "Je ne mets jamais plus de 30 minutes à m''endormir.", "score": 0},
        {"code": 1, "label": "Moins d''une fois sur deux, je mets au moins 30 minutes à m''endormir.", "score": 1},
        {"code": 2, "label": "Plus d''une fois sur deux, je mets au moins 30 minutes à m''endormir.", "score": 2},
        {"code": 3, "label": "Plus d''une fois sur deux, je mets plus d''une heure à m''endormir.", "score": 3}
      ], "scoring_group_id": "sleep", "scoring_aggregation": "max"},
      {"id": "q2", "section_id": "part1", "text": "Sommeil pendant la nuit", "type": "single_choice", "required": true, "options": [
        {"code": 0, "label": "Je ne me réveille pas la nuit.", "score": 0},
        {"code": 1, "label": "J''ai un sommeil agité, léger et quelques réveils brefs chaque nuit.", "score": 1},
        {"code": 2, "label": "Je me réveille au moins une fois par nuit, mais je me rendors facilement.", "score": 2},
        {"code": 3, "label": "Plus d''une fois sur deux, je me réveille plus d''une fois par nuit et reste éveillé(e) 20 minutes ou plus.", "score": 3}
      ], "scoring_group_id": "sleep", "scoring_aggregation": "max"},
      {"id": "q3", "section_id": "part1", "text": "Réveil avant l''heure prévue", "type": "single_choice", "required": true, "options": [
        {"code": 0, "label": "La plupart du temps, je me réveille 30 minutes ou moins avant le moment où je dois me lever.", "score": 0},
        {"code": 1, "label": "Plus d''une fois sur deux, je me réveille plus de 30 minutes avant le moment où je dois me lever.", "score": 1},
        {"code": 2, "label": "Je me réveille presque toujours une heure ou plus avant le moment où je dois me lever, mais je finis par me rendormir.", "score": 2},
        {"code": 3, "label": "Je me réveille au moins une heure avant le moment où je dois me lever et je n''arrive pas à me rendormir.", "score": 3}
      ], "scoring_group_id": "sleep", "scoring_aggregation": "max"},
      {"id": "q4", "section_id": "part1", "text": "Sommeil excessif", "type": "single_choice", "required": true, "options": [
        {"code": 0, "label": "Je ne dors pas plus de 7 à 8 heures par nuit, et je ne fais pas de sieste dans la journée.", "score": 0},
        {"code": 1, "label": "Je ne dors pas plus de 10 heures sur un jour entier de 24 heures, siestes comprises.", "score": 1},
        {"code": 2, "label": "Je ne dors pas plus de 12 heures sur un jour entier de 24 heures, siestes comprises.", "score": 2},
        {"code": 3, "label": "Je dors plus de 12 heures sur un jour entier de 24 heures, siestes comprises.", "score": 3}
      ], "scoring_group_id": "sleep", "scoring_aggregation": "max"},
      {"id": "q5", "section_id": "part1", "text": "Tristesse", "type": "single_choice", "required": true, "options": [
        {"code": 0, "label": "Je ne me sens pas triste.", "score": 0},
        {"code": 1, "label": "Je me sens triste moins de la moitié du temps.", "score": 1},
        {"code": 2, "label": "Je me sens triste plus de la moitié du temps.", "score": 2},
        {"code": 3, "label": "Je me sens triste presque tout le temps.", "score": 3}
      ]},
      {"id": "q6", "section_id": "part1", "text": "Diminution de l''appétit", "type": "single_choice", "required": true, "options": [
        {"code": 0, "label": "J''ai le même appétit que d''habitude.", "score": 0},
        {"code": 1, "label": "Je mange un peu moins souvent ou en plus petite quantité que d''habitude.", "score": 1},
        {"code": 2, "label": "Je mange beaucoup moins que d''habitude et seulement en me forçant.", "score": 2},
        {"code": 3, "label": "Je mange rarement sur un jour entier de 24 heures et seulement en me forçant énormément ou quand on me persuade de manger.", "score": 3}
      ], "scoring_group_id": "appetite_weight", "scoring_aggregation": "max"},
      {"id": "q7", "section_id": "part1", "text": "Augmentation de l''appétit", "type": "single_choice", "required": true, "options": [
        {"code": 0, "label": "J''ai le même appétit que d''habitude.", "score": 0},
        {"code": 1, "label": "J''éprouve le besoin de manger plus souvent que d''habitude.", "score": 1},
        {"code": 2, "label": "Je mange régulièrement plus souvent et/ou en plus grosse quantité que d''habitude.", "score": 2},
        {"code": 3, "label": "J''éprouve un grand besoin de manger plus que d''habitude pendant et entre les repas.", "score": 3}
      ], "scoring_group_id": "appetite_weight", "scoring_aggregation": "max"},
      {"id": "q8", "section_id": "part1", "text": "Perte de poids (au cours des 15 derniers jours)", "type": "single_choice", "required": true, "options": [
        {"code": 0, "label": "Mon poids n''a pas changé.", "score": 0},
        {"code": 1, "label": "J''ai l''impression d''avoir perdu un peu de poids.", "score": 1},
        {"code": 2, "label": "J''ai perdu 1 kg ou plus.", "score": 2},
        {"code": 3, "label": "J''ai perdu plus de 2 kg.", "score": 3}
      ], "scoring_group_id": "appetite_weight", "scoring_aggregation": "max"},
      {"id": "q9", "section_id": "part1", "text": "Prise de poids (au cours des 15 derniers jours)", "type": "single_choice", "required": true, "options": [
        {"code": 0, "label": "Mon poids n''a pas changé.", "score": 0},
        {"code": 1, "label": "J''ai l''impression d''avoir pris un peu de poids.", "score": 1},
        {"code": 2, "label": "J''ai pris 1 kg ou plus.", "score": 2},
        {"code": 3, "label": "J''ai pris plus de 2 kg.", "score": 3}
      ], "scoring_group_id": "appetite_weight", "scoring_aggregation": "max"},
      {"id": "q10", "section_id": "part2", "text": "Concentration/Prise de décisions", "type": "single_choice", "required": true, "options": [
        {"code": 0, "label": "Il n''y a aucun changement dans ma capacité habituelle à me concentrer ou à prendre des décisions.", "score": 0},
        {"code": 1, "label": "Je me sens parfois indécis(e) ou je trouve parfois que ma concentration est limitée.", "score": 1},
        {"code": 2, "label": "La plupart du temps, j''ai du mal à me concentrer ou à prendre des décisions.", "score": 2},
        {"code": 3, "label": "Je n''arrive pas me concentrer assez pour lire ou je n''arrive pas à prendre des décisions même si elles sont insignifiantes.", "score": 3}
      ]},
      {"id": "q11", "section_id": "part2", "text": "Opinion de moi-même", "type": "single_choice", "required": true, "options": [
        {"code": 0, "label": "Je considère que j''ai autant de valeur que les autres et que je suis aussi méritant(e) que les autres.", "score": 0},
        {"code": 1, "label": "Je me critique plus que d''habitude.", "score": 1},
        {"code": 2, "label": "Je crois fortement que je cause des problèmes aux autres.", "score": 2},
        {"code": 3, "label": "Je pense presque tout le temps à mes petits et mes gros défauts.", "score": 3}
      ]},
      {"id": "q12", "section_id": "part2", "text": "Idées de mort ou de suicide", "type": "single_choice", "required": true, "help": "En cas d''idéation suicidaire, alerter immédiatement le clinicien.", "options": [
        {"code": 0, "label": "Je ne pense pas au suicide ni à la mort.", "score": 0},
        {"code": 1, "label": "Je pense que la vie est sans intérêt ou je me demande si elle vaut la peine d''être vécue.", "score": 1},
        {"code": 2, "label": "Je pense au suicide ou à la mort plusieurs fois par semaine pendant plusieurs minutes.", "score": 2},
        {"code": 3, "label": "Je pense au suicide ou à la mort plusieurs fois par jours en détail, j''ai envisagé le suicide de manière précise ou j''ai réellement tenté de mettre fin à mes jours.", "score": 3}
      ]},
      {"id": "q13", "section_id": "part2", "text": "Enthousiasme général", "type": "single_choice", "required": true, "options": [
        {"code": 0, "label": "Il n''y pas de changement par rapport à d''habitude dans la manière dont je m''intéresse aux gens ou à mes activités.", "score": 0},
        {"code": 1, "label": "Je me rends compte que je m''intéresse moins aux gens et à mes activités.", "score": 1},
        {"code": 2, "label": "Je me rends compte que je n''ai d''intérêt que pour une ou deux des activités que j''avais auparavant.", "score": 2},
        {"code": 3, "label": "Je n''ai pratiquement plus d''intérêt pour les activités que j''avais auparavant.", "score": 3}
      ]},
      {"id": "q14", "section_id": "part2", "text": "Énergie", "type": "single_choice", "required": true, "options": [
        {"code": 0, "label": "J''ai autant d''énergie que d''habitude.", "score": 0},
        {"code": 1, "label": "Je me fatigue plus facilement que d''habitude.", "score": 1},
        {"code": 2, "label": "Je dois faire un gros effort pour commencer ou terminer mes activités quotidiennes (par exemple, faire les courses, les devoirs, la cuisine ou aller au travail).", "score": 2},
        {"code": 3, "label": "Je ne peux vraiment pas faire mes activités quotidiennes parce que je n''ai simplement plus d''énergie.", "score": 3}
      ]},
      {"id": "q15", "section_id": "part2", "text": "Impression de ralentissement", "type": "single_choice", "required": true, "options": [
        {"code": 0, "label": "Je pense, je parle et je bouge aussi vite que d''habitude.", "score": 0},
        {"code": 1, "label": "Je trouve que je réfléchis plus lentement ou que ma voix est étouffée ou monocorde.", "score": 1},
        {"code": 2, "label": "Il me faut plusieurs secondes pour répondre à la plupart des questions et je suis sûr(e) que je réfléchis plus lentement.", "score": 2},
        {"code": 3, "label": "Je suis souvent incapable de répondre aux questions si je ne fais pas de gros efforts.", "score": 3}
      ], "scoring_group_id": "psychomotor", "scoring_aggregation": "max"},
      {"id": "q16", "section_id": "part2", "text": "Impression d''agitation", "type": "single_choice", "required": true, "options": [
        {"code": 0, "label": "Je ne me sens pas agité(e).", "score": 0},
        {"code": 1, "label": "Je suis souvent agité(e), je me tords les mains ou j''ai besoin de changer de position quand je suis assis(e).", "score": 1},
        {"code": 2, "label": "J''éprouve le besoin soudain de bouger et je suis plutôt agité(e).", "score": 2},
        {"code": 3, "label": "Par moments, je suis incapable de rester assis(e) et j''ai besoin de faire les cent pas.", "score": 3}
      ], "scoring_group_id": "psychomotor", "scoring_aggregation": "max"}
    ]'::jsonb,
    true,
    '{"scoring_type": "mutually_exclusive_groups", "range": [0, 27]}'::jsonb
  );

  -- MDQ
  INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active, metadata)
  VALUES (
    module_autoquestionnaires_id,
    'MDQ_FR',
    'MDQ - Questionnaire des Troubles de l''Humeur',
    'Outil de dépistage du trouble bipolaire - Période de référence: au cours de votre vie',
    'patient',
    '[
      {"id": "q1_1", "section_id": "sec1", "text": "1.1 … vous vous sentiez si bien et si remonté que d''autres pensaient que vous n''étiez pas comme d''habitude ou que vous alliez vous attirer des ennuis", "type": "single_choice", "required": true, "options": [{"code": 1, "label": "Oui", "score": 1}, {"code": 0, "label": "Non", "score": 0}]},
      {"id": "q1_2", "section_id": "sec1", "text": "1.2 … vous étiez si irritable que vous criiez après les gens ou provoquiez des bagarres ou des disputes", "type": "single_choice", "required": true, "options": [{"code": 1, "label": "Oui", "score": 1}, {"code": 0, "label": "Non", "score": 0}]},
      {"id": "q1_3", "section_id": "sec1", "text": "1.3 … vous vous sentiez beaucoup plus sûr(e) de vous que d''habitude", "type": "single_choice", "required": true, "options": [{"code": 1, "label": "Oui", "score": 1}, {"code": 0, "label": "Non", "score": 0}]},
      {"id": "q1_4", "section_id": "sec1", "text": "1.4 … vous dormiez beaucoup moins que d''habitude et cela ne vous manquait pas vraiment", "type": "single_choice", "required": true, "options": [{"code": 1, "label": "Oui", "score": 1}, {"code": 0, "label": "Non", "score": 0}]},
      {"id": "q1_5", "section_id": "sec1", "text": "1.5 … vous étiez beaucoup plus bavard(e) et parliez beaucoup plus vite que d''habitude", "type": "single_choice", "required": true, "options": [{"code": 1, "label": "Oui", "score": 1}, {"code": 0, "label": "Non", "score": 0}]},
      {"id": "q1_6", "section_id": "sec1", "text": "1.6 … des pensées traversaient rapidement votre tête et vous ne pouviez pas les ralentir", "type": "single_choice", "required": true, "options": [{"code": 1, "label": "Oui", "score": 1}, {"code": 0, "label": "Non", "score": 0}]},
      {"id": "q1_7", "section_id": "sec1", "text": "1.7 … vous étiez si facilement distrait(e) que vous aviez des difficultés à vous concentrer ou à poursuivre la même idée", "type": "single_choice", "required": true, "options": [{"code": 1, "label": "Oui", "score": 1}, {"code": 0, "label": "Non", "score": 0}]},
      {"id": "q1_8", "section_id": "sec1", "text": "1.8 … vous aviez beaucoup plus d''énergie que d''habitude", "type": "single_choice", "required": true, "options": [{"code": 1, "label": "Oui", "score": 1}, {"code": 0, "label": "Non", "score": 0}]},
      {"id": "q1_9", "section_id": "sec1", "text": "1.9 … vous étiez beaucoup plus actif(ve) ou faisiez beaucoup plus de choses que d''habitude", "type": "single_choice", "required": true, "options": [{"code": 1, "label": "Oui", "score": 1}, {"code": 0, "label": "Non", "score": 0}]},
      {"id": "q1_10", "section_id": "sec1", "text": "1.10 … vous étiez beaucoup plus sociable ou extraverti(e), par ex. vous téléphoniez à vos amis la nuit", "type": "single_choice", "required": true, "options": [{"code": 1, "label": "Oui", "score": 1}, {"code": 0, "label": "Non", "score": 0}]},
      {"id": "q1_11", "section_id": "sec1", "text": "1.11 … vous étiez beaucoup plus intéressé(e) par le sexe que d''habitude", "type": "single_choice", "required": true, "options": [{"code": 1, "label": "Oui", "score": 1}, {"code": 0, "label": "Non", "score": 0}]},
      {"id": "q1_12", "section_id": "sec1", "text": "1.12 … vous faisiez des choses inhabituelles ou jugées excessives, imprudentes ou risquées", "type": "single_choice", "required": true, "options": [{"code": 1, "label": "Oui", "score": 1}, {"code": 0, "label": "Non", "score": 0}]},
      {"id": "q1_13", "section_id": "sec1", "text": "1.13 … vous dépensiez de l''argent d''une manière si inadaptée que cela vous attirait des ennuis pour vous ou votre famille", "type": "single_choice", "required": true, "options": [{"code": 1, "label": "Oui", "score": 1}, {"code": 0, "label": "Non", "score": 0}]},
      {"id": "q2", "section_id": "sec2", "text": "2. Si ≥2 réponses ''oui'' à la Q1, ces réponses sont-elles apparues durant la même période ?", "type": "single_choice", "required": false, "display_if": {">=": [{"+": [{"var": "answers.q1_1"},{"var": "answers.q1_2"},{"var": "answers.q1_3"},{"var": "answers.q1_4"},{"var": "answers.q1_5"},{"var": "answers.q1_6"},{"var": "answers.q1_7"},{"var": "answers.q1_8"},{"var": "answers.q1_9"},{"var": "answers.q1_10"},{"var": "answers.q1_11"},{"var": "answers.q1_12"},{"var": "answers.q1_13"}]}, 2]}, "options": [{"code": 1, "label": "Oui"}, {"code": 0, "label": "Non"}]},
      {"id": "q3", "section_id": "sec2", "text": "3. À quel point ces problèmes ont-ils eu un impact sur votre fonctionnement ?", "type": "single_choice", "required": false, "display_if": {">=": [{"+": [{"var": "answers.q1_1"},{"var": "answers.q1_2"},{"var": "answers.q1_3"},{"var": "answers.q1_4"},{"var": "answers.q1_5"},{"var": "answers.q1_6"},{"var": "answers.q1_7"},{"var": "answers.q1_8"},{"var": "answers.q1_9"},{"var": "answers.q1_10"},{"var": "answers.q1_11"},{"var": "answers.q1_12"},{"var": "answers.q1_13"}]}, 2]}, "options": [{"code": 0, "label": "Pas de problème"}, {"code": 1, "label": "Problème mineur"}, {"code": 2, "label": "Problème moyen"}, {"code": 3, "label": "Problème sérieux"}]}
    ]'::jsonb,
    true,
    '{"scoring_type": "conditional", "screening_criteria": "MDQ POSITIF si (Q1≥7) ET (Q2=oui) ET (Q3=problème moyen ou sérieux)"}'::jsonb
  );

  -- ========================================================================
  -- MODULE 2: PARTIE MÉDICALE (target_role: healthcare_professional)
  -- ========================================================================
  INSERT INTO modules (visit_template_id, name, description, order_index, active)
  VALUES (
    template_id,
    'Partie médicale',
    'Évaluation clinique par le professionnel de santé',
    2,
    true
  )
  RETURNING id INTO module_medical_id;

  -- Diagnostic
  INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active)
  VALUES (
    module_medical_id,
    'EBIP_SCR_DIAG',
    'Diagnostic',
    'Évaluation diagnostique clinique',
    'healthcare_professional',
    '[
      {
        "id": "diag_principal",
        "type": "single_choice",
        "text": "Diagnostic principal",
        "required": true,
        "options": [
          {"code": 1, "label": "Trouble bipolaire type I"},
          {"code": 2, "label": "Trouble bipolaire type II"},
          {"code": 3, "label": "Trouble cyclothymique"},
          {"code": 4, "label": "Autre trouble du spectre bipolaire"},
          {"code": 5, "label": "Pas de diagnostic bipolaire"}
        ]
      },
      {
        "id": "episode_actuel",
        "type": "single_choice",
        "text": "Épisode actuel",
        "required": false,
        "options": [
          {"code": 1, "label": "Maniaque"},
          {"code": 2, "label": "Hypomaniaque"},
          {"code": 3, "label": "Dépressif"},
          {"code": 4, "label": "Mixte"},
          {"code": 5, "label": "Euthymique"}
        ]
      },
      {
        "id": "comorbidites",
        "type": "multiple_choice",
        "text": "Comorbidités psychiatriques",
        "required": false,
        "options": [
          "Trouble anxieux",
          "Trouble de l''usage de substances",
          "TDAH",
          "Trouble de la personnalité",
          "Autre"
        ]
      },
      {
        "id": "antecedents_psychiatriques",
        "type": "text",
        "text": "Antécédents psychiatriques",
        "required": false
      },
      {
        "id": "notes_cliniques",
        "type": "text",
        "text": "Notes cliniques",
        "required": false
      }
    ]'::jsonb,
    true
  );

  -- Orientation Centre Expert
  INSERT INTO questionnaires (module_id, code, title, description, target_role, questions, active)
  VALUES (
    module_medical_id,
    'EBIP_SCR_ORIENT',
    'Orientation Centre Expert',
    'Décision d''orientation vers un centre expert',
    'healthcare_professional',
    '[
      {
        "id": "eligible_centre_expert",
        "type": "boolean",
        "text": "Patient éligible pour orientation vers centre expert",
        "required": true
      },
      {
        "id": "criteres_eligibilite",
        "type": "multiple_choice",
        "text": "Critères d''éligibilité remplis",
        "required": false,
        "options": [
          "Diagnostic de trouble bipolaire confirmé",
          "Acceptation du suivi",
          "Disponibilité pour les visites régulières",
          "Consentement éclairé"
        ]
      },
      {
        "id": "urgence_orientation",
        "type": "single_choice",
        "text": "Urgence de l''orientation",
        "required": false,
        "options": [
          {"code": 1, "label": "Immédiate"},
          {"code": 2, "label": "Rapide (sous 2 semaines)"},
          {"code": 3, "label": "Standard (sous 1 mois)"}
        ]
      },
      {
        "id": "centre_expert_propose",
        "type": "text",
        "text": "Centre expert proposé",
        "required": false
      },
      {
        "id": "commentaires",
        "type": "text",
        "text": "Commentaires sur l''orientation",
        "required": false
      }
    ]'::jsonb,
    true
  );

END $$;

