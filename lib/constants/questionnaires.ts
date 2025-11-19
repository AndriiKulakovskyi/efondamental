
import { Question } from '@/lib/types/database.types';

export type QuestionnaireDefinition = {
  id: string;
  code: string;
  title: string;
  description: string;
  questions: Question[];
};

export const ASRM_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Question 1: Humeur (Bonheur/Joie)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je ne me sens pas plus heureux(se) ou plus joyeux(se) que d'habitude.", score: 0 },
      { code: 1, label: "Je me sens parfois plus heureux(se) ou plus joyeux(se) que d'habitude.", score: 1 },
      { code: 2, label: "Je me sens souvent plus heureux(se) ou plus joyeux(se) que d'habitude.", score: 2 },
      { code: 3, label: "Je me sens plus heureux(se) ou plus joyeux(se) que d'habitude la plupart du temps.", score: 3 },
      { code: 4, label: "Je me sens plus heureux(se) ou plus joyeux(se) que d'habitude tout le temps.", score: 4 }
    ]
  },
  {
    id: 'q2',
    text: 'Question 2: Confiance en soi',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je ne me sens pas plus sûr(e) de moi que d'habitude.", score: 0 },
      { code: 1, label: "Je me sens parfois plus sûr(e) de moi que d'habitude.", score: 1 },
      { code: 2, label: "Je me sens souvent plus sûr(e) de moi que d'habitude.", score: 2 },
      { code: 3, label: "Je me sens plus sûr(e) de moi que d'habitude la plupart du temps.", score: 3 },
      { code: 4, label: "Je me sens extrêmement sûr(e) de moi tout le temps.", score: 4 }
    ]
  },
  {
    id: 'q3',
    text: 'Question 3: Besoin de sommeil',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je n'ai pas besoin de moins de sommeil que d'habitude.", score: 0 },
      { code: 1, label: "J'ai parfois besoin de moins de sommeil que d'habitude.", score: 1 },
      { code: 2, label: "J'ai souvent besoin de moins de sommeil que d'habitude.", score: 2 },
      { code: 3, label: "J'ai fréquemment besoin de moins de sommeil que d'habitude.", score: 3 },
      { code: 4, label: "Je peux passer toute la journée et toute la nuit sans dormir et ne pas être fatigué(e).", score: 4 }
    ]
  },
  {
    id: 'q4',
    text: 'Question 4: Discours (Loquacité)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je ne parle pas plus que d'habitude.", score: 0 },
      { code: 1, label: "Je parle parfois plus que d'habitude.", score: 1 },
      { code: 2, label: "Je parle souvent plus que d'habitude.", score: 2 },
      { code: 3, label: "Je parle fréquemment plus que d'habitude.", score: 3 },
      { code: 4, label: "Je parle sans arrêt et je ne peux être interrompu(e).", score: 4 }
    ]
  },
  {
    id: 'q5',
    text: 'Question 5: Niveau d\'activité',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: "Je n'ai pas été plus actif(ve) que d'habitude (socialement, sexuellement, au travail, à la maison ou à l'école).", score: 0 },
      { code: 1, label: "J'ai parfois été plus actif(ve) que d'habitude.", score: 1 },
      { code: 2, label: "J'ai souvent été plus actif(ve) que d'habitude.", score: 2 },
      { code: 3, label: "J'ai fréquemment été plus actif(ve) que d'habitude.", score: 3 },
      { code: 4, label: "Je suis constamment actif(ve), ou en mouvement tout le temps.", score: 4 }
    ]
  }
];

export const ASRM_DEFINITION: QuestionnaireDefinition = {
  id: 'asrm',
  code: 'ASRM_FR',
  title: 'Auto-Questionnaire Altman (ASRM)',
  description: "Échelle d'Auto-Évaluation de la Manie - Période de référence: 7 derniers jours",
  questions: ASRM_QUESTIONS
};

export const QIDS_QUESTIONS: Question[] = [
  { id: "q1", text: "Endormissement", type: "single_choice", required: true, options: [
    { code: 0, label: "Je ne mets jamais plus de 30 minutes à m'endormir.", score: 0 },
    { code: 1, label: "Moins d'une fois sur deux, je mets au moins 30 minutes à m'endormir.", score: 1 },
    { code: 2, label: "Plus d'une fois sur deux, je mets au moins 30 minutes à m'endormir.", score: 2 },
    { code: 3, label: "Plus d'une fois sur deux, je mets plus d'une heure à m'endormir.", score: 3 }
  ]},
  { id: "q2", text: "Sommeil pendant la nuit", type: "single_choice", required: true, options: [
    { code: 0, label: "Je ne me réveille pas la nuit.", score: 0 },
    { code: 1, label: "J'ai un sommeil agité, léger et quelques réveils brefs chaque nuit.", score: 1 },
    { code: 2, label: "Je me réveille au moins une fois par nuit, mais je me rendors facilement.", score: 2 },
    { code: 3, label: "Plus d'une fois sur deux, je me réveille plus d'une fois par nuit et reste éveillé(e) 20 minutes ou plus.", score: 3 }
  ]},
  { id: "q3", text: "Réveil avant l'heure prévue", type: "single_choice", required: true, options: [
    { code: 0, label: "La plupart du temps, je me réveille 30 minutes ou moins avant le moment où je dois me lever.", score: 0 },
    { code: 1, label: "Plus d'une fois sur deux, je me réveille plus de 30 minutes avant le moment où je dois me lever.", score: 1 },
    { code: 2, label: "Je me réveille presque toujours une heure ou plus avant le moment où je dois me lever, mais je finis par me rendormir.", score: 2 },
    { code: 3, label: "Je me réveille au moins une heure avant le moment où je dois me lever et je n'arrive pas à me rendormir.", score: 3 }
  ]},
  { id: "q4", text: "Sommeil excessif", type: "single_choice", required: true, options: [
    { code: 0, label: "Je ne dors pas plus de 7 à 8 heures par nuit, et je ne fais pas de sieste dans la journée.", score: 0 },
    { code: 1, label: "Je ne dors pas plus de 10 heures sur un jour entier de 24 heures, siestes comprises.", score: 1 },
    { code: 2, label: "Je ne dors pas plus de 12 heures sur un jour entier de 24 heures, siestes comprises.", score: 2 },
    { code: 3, label: "Je dors plus de 12 heures sur un jour entier de 24 heures, siestes comprises.", score: 3 }
  ]},
  { id: "q5", text: "Tristesse", type: "single_choice", required: true, options: [
    { code: 0, label: "Je ne me sens pas triste.", score: 0 },
    { code: 1, label: "Je me sens triste moins de la moitié du temps.", score: 1 },
    { code: 2, label: "Je me sens triste plus de la moitié du temps.", score: 2 },
    { code: 3, label: "Je me sens triste presque tout le temps.", score: 3 }
  ]},
  { id: "q6", text: "Diminution de l'appétit", type: "single_choice", required: true, options: [
    { code: 0, label: "J'ai le même appétit que d'habitude.", score: 0 },
    { code: 1, label: "Je mange un peu moins souvent ou en plus petite quantité que d'habitude.", score: 1 },
    { code: 2, label: "Je mange beaucoup moins que d'habitude et seulement en me forçant.", score: 2 },
    { code: 3, label: "Je mange rarement sur un jour entier de 24 heures et seulement en me forçant énormément ou quand on me persuade de manger.", score: 3 }
  ]},
  { id: "q7", text: "Augmentation de l'appétit", type: "single_choice", required: true, options: [
    { code: 0, label: "J'ai le même appétit que d'habitude.", score: 0 },
    { code: 1, label: "J'éprouve le besoin de manger plus souvent que d'habitude.", score: 1 },
    { code: 2, label: "Je mange régulièrement plus souvent et/ou en plus grosse quantité que d'habitude.", score: 2 },
    { code: 3, label: "J'éprouve un grand besoin de manger plus que d'habitude pendant et entre les repas.", score: 3 }
  ]},
  { id: "q8", text: "Perte de poids (au cours des 15 derniers jours)", type: "single_choice", required: true, options: [
    { code: 0, label: "Mon poids n'a pas changé.", score: 0 },
    { code: 1, label: "J'ai l'impression d'avoir perdu un peu de poids.", score: 1 },
    { code: 2, label: "J'ai perdu 1 kg ou plus.", score: 2 },
    { code: 3, label: "J'ai perdu plus de 2 kg.", score: 3 }
  ]},
  { id: "q9", text: "Prise de poids (au cours des 15 derniers jours)", type: "single_choice", required: true, options: [
    { code: 0, label: "Mon poids n'a pas changé.", score: 0 },
    { code: 1, label: "J'ai l'impression d'avoir pris un peu de poids.", score: 1 },
    { code: 2, label: "J'ai pris 1 kg ou plus.", score: 2 },
    { code: 3, label: "J'ai pris plus de 2 kg.", score: 3 }
  ]},
  { id: "q10", text: "Concentration/Prise de décisions", type: "single_choice", required: true, options: [
    { code: 0, label: "Il n'y a aucun changement dans ma capacité habituelle à me concentrer ou à prendre des décisions.", score: 0 },
    { code: 1, label: "Je me sens parfois indécis(e) ou je trouve parfois que ma concentration est limitée.", score: 1 },
    { code: 2, label: "La plupart du temps, j'ai du mal à me concentrer ou à prendre des décisions.", score: 2 },
    { code: 3, label: "Je n'arrive pas me concentrer assez pour lire ou je n'arrive pas à prendre des décisions même si elles sont insignifiantes.", score: 3 }
  ]},
  { id: "q11", text: "Opinion de moi-même", type: "single_choice", required: true, options: [
    { code: 0, label: "Je considère que j'ai autant de valeur que les autres et que je suis aussi méritant(e) que les autres.", score: 0 },
    { code: 1, label: "Je me critique plus que d'habitude.", score: 1 },
    { code: 2, label: "Je crois fortement que je cause des problèmes aux autres.", score: 2 },
    { code: 3, label: "Je pense presque tout le temps à mes petits et mes gros défauts.", score: 3 }
  ]},
  { id: "q12", text: "Idées de mort ou de suicide", type: "single_choice", required: true, help: "En cas d'idéation suicidaire, alerter immédiatement le clinicien.", options: [
    { code: 0, label: "Je ne pense pas au suicide ni à la mort.", score: 0 },
    { code: 1, label: "Je pense que la vie est sans intérêt ou je me demande si elle vaut la peine d'être vécue.", score: 1 },
    { code: 2, label: "Je pense au suicide ou à la mort plusieurs fois par semaine pendant plusieurs minutes.", score: 2 },
    { code: 3, label: "Je pense au suicide ou à la mort plusieurs fois par jours en détail, j'ai envisagé le suicide de manière précise ou j'ai réellement tenté de mettre fin à mes jours.", score: 3 }
  ]},
  { id: "q13", text: "Enthousiasme général", type: "single_choice", required: true, options: [
    { code: 0, label: "Il n'y pas de changement par rapport à d'habitude dans la manière dont je m'intéresse aux gens ou à mes activités.", score: 0 },
    { code: 1, label: "Je me rends compte que je m'intéresse moins aux gens et à mes activités.", score: 1 },
    { code: 2, label: "Je me rends compte que je n'ai d'intérêt que pour une ou deux des activités que j'avais auparavant.", score: 2 },
    { code: 3, label: "Je n'ai pratiquement plus d'intérêt pour les activités que j'avais auparavant.", score: 3 }
  ]},
  { id: "q14", text: "Énergie", type: "single_choice", required: true, options: [
    { code: 0, label: "J'ai autant d'énergie que d'habitude.", score: 0 },
    { code: 1, label: "Je me fatigue plus facilement que d'habitude.", score: 1 },
    { code: 2, label: "Je dois faire un gros effort pour commencer ou terminer mes activités quotidiennes (par exemple, faire les courses, les devoirs, la cuisine ou aller au travail).", score: 2 },
    { code: 3, label: "Je ne peux vraiment pas faire mes activités quotidiennes parce que je n'ai simplement plus d'énergie.", score: 3 }
  ]},
  { id: "q15", text: "Impression de ralentissement", type: "single_choice", required: true, options: [
    { code: 0, label: "Je pense, je parle et je bouge aussi vite que d'habitude.", score: 0 },
    { code: 1, label: "Je trouve que je réfléchis plus lentement ou que ma voix est étouffée ou monocorde.", score: 1 },
    { code: 2, label: "Il me faut plusieurs secondes pour répondre à la plupart des questions et je suis sûr(e) que je réfléchis plus lentement.", score: 2 },
    { code: 3, label: "Je suis souvent incapable de répondre aux questions si je ne fais pas de gros efforts.", score: 3 }
  ]},
  { id: "q16", text: "Impression d'agitation", type: "single_choice", required: true, options: [
    { code: 0, label: "Je ne me sens pas agité(e).", score: 0 },
    { code: 1, label: "Je suis souvent agité(e), je me tords les mains ou j'ai besoin de changer de position quand je suis assis(e).", score: 1 },
    { code: 2, label: "J'éprouve le besoin soudain de bouger et je suis plutôt agité(e).", score: 2 },
    { code: 3, label: "Par moments, je suis incapable de rester assis(e) et j'ai besoin de faire les cent pas.", score: 3 }
  ]}
];

export const QIDS_DEFINITION: QuestionnaireDefinition = {
  id: 'qids_sr16',
  code: 'QIDS_SR16_FR',
  title: 'QIDS-SR16',
  description: 'Auto-questionnaire court sur les symptômes de la dépression - Période de référence: 7 derniers jours',
  questions: QIDS_QUESTIONS
};

export const MDQ_QUESTIONS: Question[] = [
  { id: "q1_1", text: "1.1 … vous vous sentiez si bien et si remonté que d'autres pensaient que vous n'étiez pas comme d'habitude ou que vous alliez vous attirer des ennuis", type: "single_choice", required: true, options: [{ code: 1, label: "Oui", score: 1 }, { code: 0, label: "Non", score: 0 }] },
  { id: "q1_2", text: "1.2 … vous étiez si irritable que vous criiez après les gens ou provoquiez des bagarres ou des disputes", type: "single_choice", required: true, options: [{ code: 1, label: "Oui", score: 1 }, { code: 0, label: "Non", score: 0 }] },
  { id: "q1_3", text: "1.3 … vous vous sentiez beaucoup plus sûr(e) de vous que d'habitude", type: "single_choice", required: true, options: [{ code: 1, label: "Oui", score: 1 }, { code: 0, label: "Non", score: 0 }] },
  { id: "q1_4", text: "1.4 … vous dormiez beaucoup moins que d'habitude et cela ne vous manquait pas vraiment", type: "single_choice", required: true, options: [{ code: 1, label: "Oui", score: 1 }, { code: 0, label: "Non", score: 0 }] },
  { id: "q1_5", text: "1.5 … vous étiez beaucoup plus bavard(e) et parliez beaucoup plus vite que d'habitude", type: "single_choice", required: true, options: [{ code: 1, label: "Oui", score: 1 }, { code: 0, label: "Non", score: 0 }] },
  { id: "q1_6", text: "1.6 … des pensées traversaient rapidement votre tête et vous ne pouviez pas les ralentir", type: "single_choice", required: true, options: [{ code: 1, label: "Oui", score: 1 }, { code: 0, label: "Non", score: 0 }] },
  { id: "q1_7", text: "1.7 … vous étiez si facilement distrait(e) que vous aviez des difficultés à vous concentrer ou à poursuivre la même idée", type: "single_choice", required: true, options: [{ code: 1, label: "Oui", score: 1 }, { code: 0, label: "Non", score: 0 }] },
  { id: "q1_8", text: "1.8 … vous aviez beaucoup plus d'énergie que d'habitude", type: "single_choice", required: true, options: [{ code: 1, label: "Oui", score: 1 }, { code: 0, label: "Non", score: 0 }] },
  { id: "q1_9", text: "1.9 … vous étiez beaucoup plus actif(ve) ou faisiez beaucoup plus de choses que d'habitude", type: "single_choice", required: true, options: [{ code: 1, label: "Oui", score: 1 }, { code: 0, label: "Non", score: 0 }] },
  { id: "q1_10", text: "1.10 … vous étiez beaucoup plus sociable ou extraverti(e), par ex. vous téléphoniez à vos amis la nuit", type: "single_choice", required: true, options: [{ code: 1, label: "Oui", score: 1 }, { code: 0, label: "Non", score: 0 }] },
  { id: "q1_11", text: "1.11 … vous étiez beaucoup plus intéressé(e) par le sexe que d'habitude", type: "single_choice", required: true, options: [{ code: 1, label: "Oui", score: 1 }, { code: 0, label: "Non", score: 0 }] },
  { id: "q1_12", text: "1.12 … vous faisiez des choses inhabituelles ou jugées excessives, imprudentes ou risquées", type: "single_choice", required: true, options: [{ code: 1, label: "Oui", score: 1 }, { code: 0, label: "Non", score: 0 }] },
  { id: "q1_13", text: "1.13 … vous dépensiez de l'argent d'une manière si inadaptée que cela vous attirait des ennuis pour vous ou votre famille", type: "single_choice", required: true, options: [{ code: 1, label: "Oui", score: 1 }, { code: 0, label: "Non", score: 0 }] },
  
  { id: "q2", text: "2. Si ≥2 réponses ''oui'' à la Q1, ces réponses sont-elles apparues durant la même période ?", type: "single_choice", required: false, options: [{ code: 1, label: "Oui" }, { code: 0, label: "Non" }] },
  
  { id: "q3", text: "3. À quel point ces problèmes ont-ils eu un impact sur votre fonctionnement ?", type: "single_choice", required: false, options: [
    { code: 0, label: "Pas de problème", score: 0 },
    { code: 1, label: "Problème mineur", score: 1 },
    { code: 2, label: "Problème moyen", score: 2 },
    { code: 3, label: "Problème sérieux", score: 3 }
  ]}
];

export const MDQ_DEFINITION: QuestionnaireDefinition = {
  id: 'mdq',
  code: 'MDQ_FR',
  title: 'MDQ - Questionnaire des Troubles de l\'Humeur',
  description: 'Outil de dépistage du trouble bipolaire - Période de référence: au cours de votre vie',
  questions: MDQ_QUESTIONS
};

export const DIAGNOSTIC_QUESTIONS: Question[] = [
  {
    id: "diagnostic_principal",
    type: "single_choice",
    text: "Diagnostic principal",
    required: true,
    options: [
      { code: "bipolar_1", label: "Trouble bipolaire type I" },
      { code: "bipolar_2", label: "Trouble bipolaire type II" },
      { code: "cyclothymia", label: "Trouble cyclothymique" },
      { code: "other_bipolar", label: "Autre trouble du spectre bipolaire" },
      { code: "no_bipolar", label: "Pas de diagnostic bipolaire" }
    ]
  },
  {
    id: "episode_actuel",
    type: "single_choice",
    text: "Épisode actuel",
    required: false,
    options: [
      { code: "manic", label: "Maniaque" },
      { code: "hypomanic", label: "Hypomaniaque" },
      { code: "depressive", label: "Dépressif" },
      { code: "mixed", label: "Mixte" },
      { code: "euthymic", label: "Euthymique" }
    ]
  },
  {
    id: "comorbidites",
    type: "multiple_choice",
    text: "Comorbidités psychiatriques",
    required: false,
    options: [
      "Trouble anxieux",
      "Trouble de l'usage de substances",
      "TDAH",
      "Trouble de la personnalité",
      "Autre"
    ]
  },
  {
    id: "antecedents_psychiatriques",
    type: "text",
    text: "Antécédents psychiatriques",
    required: false
  },
  {
    id: "notes_cliniques",
    type: "text",
    text: "Notes cliniques",
    required: false
  }
];

export const DIAGNOSTIC_DEFINITION: QuestionnaireDefinition = {
  id: 'diagnostic',
  code: 'EBIP_SCR_DIAG',
  title: 'Diagnostic',
  description: 'Évaluation diagnostique clinique',
  questions: DIAGNOSTIC_QUESTIONS
};

export const ORIENTATION_QUESTIONS: Question[] = [
  {
    id: "eligible_centre_expert",
    type: "boolean",
    text: "Patient éligible pour orientation vers centre expert",
    required: true
  },
  {
    id: "criteres_eligibilite",
    type: "multiple_choice",
    text: "Critères d'éligibilité remplis",
    required: false,
    options: [
      "Diagnostic de trouble bipolaire confirmé",
      "Acceptation du suivi",
      "Disponibilité pour les visites régulières",
      "Consentement éclairé"
    ]
  },
  {
    id: "urgence_orientation",
    type: "single_choice",
    text: "Urgence de l'orientation",
    required: false,
    options: [
      { code: "immediate", label: "Immédiate" },
      { code: "rapid", label: "Rapide (sous 2 semaines)" },
      { code: "standard", label: "Standard (sous 1 mois)" }
    ]
  },
  {
    id: "centre_expert_propose",
    type: "text",
    text: "Centre expert proposé",
    required: false
  },
  {
    id: "commentaires",
    type: "text",
    text: "Commentaires sur l'orientation",
    required: false
  }
];

export const ORIENTATION_DEFINITION: QuestionnaireDefinition = {
  id: 'orientation',
  code: 'EBIP_SCR_ORIENT',
  title: 'Orientation Centre Expert',
  description: "Décision d'orientation vers un centre expert",
  questions: ORIENTATION_QUESTIONS
};

