import { Question } from '@/lib/types/database.types';

// Conditional display configuration for questionnaires that depend on other questionnaire responses
export interface ConditionalDisplay {
  questionnaire_code: string;  // Code of the questionnaire this depends on (e.g., 'TOBACCO')
  field: string;               // Field name to check (e.g., 'smoking_status')
  values: string[];            // Values that make this questionnaire visible (e.g., ['current_smoker', 'ex_smoker'])
}

export interface QuestionnaireMetadata {
  singleColumn?: boolean;
  pathologies?: string[];
  target_role?: 'patient' | 'healthcare_professional';
  version?: string;
  language?: string;
  // Conditional display - makes this questionnaire visible only when the specified condition is met
  conditional_on?: ConditionalDisplay;
  [key: string]: any; // Allow additional properties for flexibility
}

export type QuestionnaireDefinition = {
  id: string;
  code: string;
  title: string;
  description: string;
  instructions?: string;
  questions: Question[];
  metadata?: QuestionnaireMetadata;
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
  questions: ASRM_QUESTIONS,
  metadata: { 
    singleColumn: true,
    instructions: "Consignes : Choisir la proposition dans chaque groupe qui correspond le mieux à la manière dont vous vous êtes senti(e) la semaine dernière.\n\nVeuillez noter : « parfois » utilisé ici signifie une ou deux fois, « souvent » signifie plusieurs, « fréquemment » signifie la plupart du temps."
  }
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
  questions: QIDS_QUESTIONS,
  metadata: { singleColumn: true }
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
  questions: MDQ_QUESTIONS,
  metadata: { singleColumn: true }
};

// Diagnostic - Main diagnostic form for medical evaluation
export const DIAGNOSTIC_QUESTIONS: Question[] = [
  {
    id: 'date_recueil',
    text: 'Date de recueil des informations',
    type: 'date',
    required: true,
    metadata: { default: 'today' }
  },
  {
    id: 'diag_prealable',
    text: 'Diagnostic de trouble bipolaire posé préalablement',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'je_ne_sais_pas', label: 'Je ne sais pas' }
    ]
  },
  {
    id: 'diag_evoque',
    text: 'Diagnostic de trouble bipolaire évoqué au terme du screening',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'differe', label: 'Différé' }
    ]
  },
  
  // Branch 1: If 'oui' -> Bilan programmé
  {
    id: 'bilan_programme',
    text: 'Bilan programmé',
    type: 'single_choice',
    required: false, // Required via logic
    display_if: {
      "==": [{ "var": "answers.diag_evoque" }, "oui"]
    },
    required_if: {
      "==": [{ "var": "answers.diag_evoque" }, "oui"]
    },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'bilan_programme_precision',
    text: 'Si non, préciser',
    type: 'single_choice',
    required: false,
    display_if: {
      "and": [
        { "==": [{ "var": "answers.diag_evoque" }, "oui"] },
        { "==": [{ "var": "answers.bilan_programme" }, "non"] }
      ]
    },
    required_if: {
      "and": [
        { "==": [{ "var": "answers.diag_evoque" }, "oui"] },
        { "==": [{ "var": "answers.bilan_programme" }, "non"] }
      ]
    },
    options: [
      { code: 'diagnostic_refuse', label: 'Diagnostic refusé' },
      { code: 'etat_clinique_incompatible', label: 'Etat clinique non compatible lors de la visite de screening' },
      { code: 'consultation_suffisante', label: 'Consultation spécialisée de screening suffisante pour donner un avis' },
      { code: 'patient_non_disponible', label: 'Patient non disponible' },
      { code: 'refus_patient', label: 'Refus du patient' },
      { code: 'autre', label: 'Autre' }
    ]
  },

  // Branch 2: If 'non' -> Préciser diagnostic probable
  {
    id: 'diag_recuse_precision',
    text: 'Si diagnostic récusé lors du screening, préciser le diagnostic le plus probable',
    type: 'single_choice',
    required: false,
    display_if: {
      "==": [{ "var": "answers.diag_evoque" }, "non"]
    },
    required_if: {
      "==": [{ "var": "answers.diag_evoque" }, "non"]
    },
    options: [
      { code: 'edm_unipolaire', label: 'EDM / Unipolaire' },
      { code: 'schizo_affectif', label: 'Schizo-affectif' },
      { code: 'schizophrene', label: 'Schizophrène' },
      { code: 'borderline', label: 'Borderline' },
      { code: 'autres_troubles_personnalite', label: 'Autres troubles de la personnalité' },
      { code: 'addiction', label: 'Addiction' },
      { code: 'autres', label: 'Autres' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'diag_recuse_autre_text',
    text: 'Préciser (Autres)',
    type: 'text',
    required: false,
    display_if: {
      "and": [
        { "==": [{ "var": "answers.diag_evoque" }, "non"] },
        { "==": [{ "var": "answers.diag_recuse_precision" }, "autres"] }
      ]
    },
    required_if: {
      "and": [
        { "==": [{ "var": "answers.diag_evoque" }, "non"] },
        { "==": [{ "var": "answers.diag_recuse_precision" }, "autres"] }
      ]
    }
  },

  // 4. Lettre d'information
  {
    id: 'lettre_information',
    text: "Lettre d'information remise au patient",
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  }
];

export const DIAGNOSTIC_DEFINITION: QuestionnaireDefinition = {
  id: 'diagnostic',
  code: 'EBIP_SCR_DIAG',
  title: 'Diagnostic',
  description: 'Évaluation diagnostique et orientation',
  questions: DIAGNOSTIC_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// Orientation Centre Expert - Specific to bipolar disorder screening
export const BIPOLAR_ORIENTATION_QUESTIONS: Question[] = [
  {
    id: 'trouble_bipolaire_ou_suspicion',
    text: 'Patient souffrant d\'un trouble bipolaire ou suspicion de trouble bipolaire',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'etat_thymique_compatible',
    text: 'Etat thymique compatible avec l\'évaluation',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'prise_en_charge_100_ou_accord',
    text: 'Prise en charge à 100% ou accord du patient pour assumer les frais',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'accord_evaluation_centre_expert',
    text: 'Accord du patient pour une évaluation dans le cadre du centre expert',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'accord_transmission_cr',
    text: 'Accord du patient pour une transmission du CR à son psychiatre référent',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  }
];

export const BIPOLAR_ORIENTATION_DEFINITION: QuestionnaireDefinition = {
  id: 'bipolar_orientation',
  code: 'EBIP_SCR_ORIENT',
  title: 'Orientation Centre Expert',
  description: 'Critères d\'orientation vers un centre expert pour trouble bipolaire',
  questions: BIPOLAR_ORIENTATION_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// Legacy export for backwards compatibility
export const ORIENTATION_DEFINITION = BIPOLAR_ORIENTATION_DEFINITION;
export const ORIENTATION_QUESTIONS = BIPOLAR_ORIENTATION_QUESTIONS;

// ============================================================================
// Initial Evaluation Questionnaires - ETAT Section
// ============================================================================

// EQ-5D-5L (Health status questionnaire)
export const EQ5D5L_QUESTIONS: Question[] = [
  // Section: Système descriptif
  {
    id: 'section_descriptive',
    text: 'Système descriptif',
    type: 'section',
    required: false
  },
  {
    id: 'mobility',
    text: 'Mobilité',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: "Je n'ai aucun problème pour me déplacer à pied", score: 1 },
      { code: 2, label: "J'ai des problèmes légers pour me déplacer à pied", score: 2 },
      { code: 3, label: "J'ai des problèmes modérés pour me déplacer à pied", score: 3 },
      { code: 4, label: "J'ai des problèmes sévères pour me déplacer à pied", score: 4 },
      { code: 5, label: "Je suis incapable de me déplacer à pied", score: 5 }
    ]
  },
  {
    id: 'self_care',
    text: 'Autonomie de la personne',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: "Je n'ai aucun problème pour me laver ou m'habiller tout seul", score: 1 },
      { code: 2, label: "J'ai des problèmes légers pour me laver ou m'habiller tout seul", score: 2 },
      { code: 3, label: "J'ai des problèmes modérés pour me laver ou m'habiller tout seul", score: 3 },
      { code: 4, label: "J'ai des problèmes sévères pour me laver ou m'habiller tout seul", score: 4 },
      { code: 5, label: "Je suis incapable de me laver ou de m'habiller tout(e) seul(e)", score: 5 }
    ]
  },
  {
    id: 'usual_activities',
    text: 'Activités courantes (exemples : travail, études, travaux domestiques, activités familiales ou loisirs)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: "Je n'ai aucun problème pour accomplir mes activités courantes", score: 1 },
      { code: 2, label: "J'ai des problèmes légers pour accomplir mes activités courantes", score: 2 },
      { code: 3, label: "J'ai des problèmes modérés pour accomplir mes activités courantes", score: 3 },
      { code: 4, label: "J'ai des problèmes sévères pour accomplir mes activités courantes", score: 4 },
      { code: 5, label: "Je suis incapable d'accomplir mes activités courantes", score: 5 }
    ]
  },
  {
    id: 'pain_discomfort',
    text: 'Douleurs, gêne',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: "Je n'ai ni douleur, ni gêne", score: 1 },
      { code: 2, label: "J'ai des douleurs ou une gêne légère(s)", score: 2 },
      { code: 3, label: "J'ai des douleurs ou une gêne modérée(s)", score: 3 },
      { code: 4, label: "J'ai des douleurs ou une gêne sévère(s)", score: 4 },
      { code: 5, label: "J'ai des douleurs ou une gêne extrême(s)", score: 5 }
    ]
  },
  {
    id: 'anxiety_depression',
    text: 'Anxiété, dépression',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: "Je ne suis ni anxieux(se), ni déprimé(e)", score: 1 },
      { code: 2, label: "Je suis légèrement anxieux(se) ou déprimé(e)", score: 2 },
      { code: 3, label: "Je suis modérément anxieux(se) ou déprimé(e)", score: 3 },
      { code: 4, label: "Je suis sévèrement anxieux(se) ou déprimé(e)", score: 4 },
      { code: 5, label: "Je suis extrêmement anxieux(se) ou déprimé(e)", score: 5 }
    ]
  },

  // Section: Échelle Visuelle Analogique (EVA)
  {
    id: 'section_vas',
    text: 'Échelle Visuelle Analogique (EVA)',
    type: 'section',
    required: false
  },
  {
    id: 'vas_score',
    text: 'Nous aimerions savoir dans quelle mesure votre santé est bonne ou mauvaise AUJOURD\'HUI. Votre état de santé aujourd\'hui [valeur entre 0 et 100] ?',
    type: 'number',
    required: true,
    min: 0,
    max: 100,
    help: 'Cette échelle est numérotée de 0 à 100. 100 correspond à la meilleure santé que vous puissiez imaginer. 0 correspond à la pire santé que vous puissiez imaginer. Maintenant, veuillez noter dans la case ci-dessous le chiffre que vous avez coché sur l\'échelle.'
  }
];

export const EQ5D5L_DEFINITION: QuestionnaireDefinition = {
  id: 'eq5d5l',
  code: 'EQ5D5L',
  title: 'EQ-5D-5L',
  description: 'Instrument standardisé de mesure de l\'état de santé comprenant 5 dimensions et une échelle visuelle analogique (EVA), avec formulation spécifique des items.',
  questions: EQ5D5L_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    version: '5L (User Text)',
    language: 'fr-FR',
    singleColumn: true
  }
};

// PRISE-M (Medication side effects - gender-specific)
export const PRISE_M_QUESTIONS: Question[] = [
  // Consigne initiale
  {
    id: 'instructions',
    text: 'PRISE-M',
    type: 'section',
    required: false,
    help: 'Pour tous les symptômes ci-dessous, cochez la case qui correspond à ce que vous avez ressenti au cours de la semaine écoulée. si, et seulement si, vous pensez que se sont des effets secondaires dus à votre traitement médicamenteux actuel.'
  },
  // Question de filtrage
  {
    id: 'taking_medication',
    text: 'Prenez-vous actuellement un traitement médicamenteux ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // Section 1: Troubles gastro-intestinaux
  {
    id: 'section_gastro',
    text: '1 - Troubles gastro-intestinaux',
    type: 'section',
    required: false,
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }
  },
  { 
    id: 'q1', 
    text: 'Diarrhée', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q2', 
    text: 'Constipation', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q3', 
    text: 'Bouche sèche', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q4', 
    text: 'Nausée, vomissement', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  
  // Section 2: Troubles cardiaques
  {
    id: 'section_cardio',
    text: '2 - Troubles cardiaques',
    type: 'section',
    required: false,
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }
  },
  { 
    id: 'q5', 
    text: 'Palpitations', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q6', 
    text: 'Vertiges', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q7', 
    text: 'Douleurs dans la poitrine', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  
  // Section 3: Problèmes cutanés
  {
    id: 'section_cutane',
    text: '3 - Problèmes cutanés',
    type: 'section',
    required: false,
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }
  },
  { 
    id: 'q8', 
    text: 'Augmentation de la transpiration', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q9', 
    text: 'Démangeaisons', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q10', 
    text: 'Sécheresse de la peau', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  
  // Section 4: Troubles neurologiques
  {
    id: 'section_neuro',
    text: '4 - Troubles neurologiques',
    type: 'section',
    required: false,
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }
  },
  { 
    id: 'q11', 
    text: 'Mal à la tête', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q12', 
    text: 'Tremblements', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q13', 
    text: 'Mauvais contrôle moteur', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q14', 
    text: 'Étourdissements', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  
  // Section 5: Vision/Audition
  {
    id: 'section_vision_audition',
    text: '5 - Vision/Audition',
    type: 'section',
    required: false,
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }
  },
  { 
    id: 'q15', 
    text: 'Vision floue', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q16', 
    text: 'Acouphènes (bourdonnements dans les oreilles)', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  
  // Section 6: Troubles uro-génitaux
  {
    id: 'section_uro_genital',
    text: '6 - Troubles uro-génitaux',
    type: 'section',
    required: false,
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }
  },
  { 
    id: 'q17', 
    text: 'Difficultés pour uriner', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q18', 
    text: 'Mictions douloureuses', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q19', 
    text: 'Mictions fréquentes', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  {
    id: 'q20',
    text: 'Règles irrégulières (pour les femmes)',
    type: 'single_choice',
    required: false,
    display_if: { 
      "and": [
        { "==": [{ "var": "answers.taking_medication" }, "oui"] },
        { "==": [{ "var": "answers.patient_gender" }, "F"] }
      ]
    },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ]
  },
  
  // Section 7: Problèmes de sommeil
  {
    id: 'section_sommeil',
    text: '7 - Problèmes de sommeil',
    type: 'section',
    required: false,
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }
  },
  { 
    id: 'q21', 
    text: "Difficultés d'endormissement", 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q22', 
    text: 'Augmentation du temps de sommeil', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  
  // Section 8: Fonctions sexuelles
  {
    id: 'section_sexuel',
    text: '8 - Fonctions sexuelles',
    type: 'section',
    required: false,
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }
  },
  { 
    id: 'q23', 
    text: 'Perte du désir sexuel', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q24', 
    text: "Difficultés à atteindre un orgasme (Troubles de l'érection pour l'homme)", 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  
  // Section 9: Autres troubles
  {
    id: 'section_autres',
    text: '9 - Autres troubles',
    type: 'section',
    required: false,
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }
  },
  { 
    id: 'q25', 
    text: 'Anxiété', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q26', 
    text: 'Difficultés de concentration', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q27', 
    text: 'Malaise général', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q28', 
    text: 'Agitation', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q29', 
    text: 'Fatigue', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q30', 
    text: "Diminution de l'énergie", 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  },
  { 
    id: 'q31', 
    text: 'Prise de poids', 
    type: 'single_choice', 
    required: false, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [
      { code: 0, label: 'Absent' }, 
      { code: 1, label: 'Tolérable' }, 
      { code: 2, label: 'Pénible' }
    ] 
  }
];

export const PRISE_M_DEFINITION: QuestionnaireDefinition = {
  id: 'prise_m',
  code: 'PRISE_M',
  title: 'PRISE-M',
  description: 'Profil des effets indésirables médicamenteux',
  questions: PRISE_M_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    instructions: 'Consignes : Pour tous les symptômes ci-dessous, cochez la case qui correspond à ce que vous avez ressenti au cours de la semaine écoulée. si, et seulement si, vous pensez que se sont des effets secondaires dus à votre traitement médicamenteux actuel.'
  }
};

// STAI-YA (State anxiety)
// STAI-YA (State anxiety)
export const STAI_YA_QUESTIONS: Question[] = [
  {
    id: 'instructions',
    text: 'Consignes',
    type: 'section',
    required: false,
    help: "Un certain nombre de phrases que l'on utilise pour se décrire sont données ci-dessous. Lisez chaque phrase, puis cochez, parmi les quatre points à droite, celui qui correspond le mieux à ce que vous ressentez A L'INSTANT, JUSTE EN CE MOMENT. Il n'y a pas de bonnes ni de mauvaises réponses. Ne passez pas trop de temps sur l'une ou l'autre de ces propositions, et indiquez la réponse qui décrit le mieux vos sentiments actuels."
  },
  { id: 'q1', text: '1. Je me sens calme.', type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q2', text: '2. Je me sens en sécurité, sans inquiétude, en sûreté.', type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q3', text: '3. Je suis tendu(e), crispé(e).', type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q4', text: '4. Je me sens surmené(e).', type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q5', text: '5. Je me sens tranquille, bien dans ma peau.', type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q6', text: '6. Je me sens ému(e), bouleversé(e), contrarié(e).', type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q7', text: "7. L'idée de malheurs éventuels me tracasse en ce moment.", type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q8', text: '8. Je me sens content(e).', type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q9', text: '9. Je me sens effrayé(e).', type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q10', text: '10. Je me sens à mon aise.', type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q11', text: "11. Je sens que j'ai confiance en moi.", type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q12', text: '12. Je me sens nerveux (nerveuse), irritable.', type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q13', text: "13. J'ai la frousse, la trouille (j'ai peur).", type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q14', text: '14. Je me sens indécis(e).', type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q15', text: '15. Je suis décontracté(e), détendu(e).', type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q16', text: '16. Je suis satisfait(e).', type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q17', text: '17. Je suis inquiet, soucieux (inquiète, soucieuse).', type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q18', text: "18. Je ne sais plus où j'en suis, je me sens déconcerté(e), dérouté(e).", type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q19', text: '19. Je me sens solide, posé(e), pondéré(e), réfléchi(e).', type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'q20', text: '20. Je me sens de bonne humeur, aimable.', type: 'single_choice', required: true, options: [{ code: 1, label: 'non' }, { code: 2, label: 'plutôt non' }, { code: 3, label: 'plutôt oui' }, { code: 4, label: 'oui' }] },
  { id: 'note_t', text: 'Note T', type: 'number', required: false, help: 'Saisissez la Note T calculée.' }
];

export const STAI_YA_DEFINITION: QuestionnaireDefinition = {
  id: 'stai_ya',
  code: 'STAI_YA',
  title: 'STAI-YA',
  description: "Inventaire d'Anxiété État (Forme Y-A)",
  questions: STAI_YA_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    reverse_items: [1, 2, 5, 8, 10, 11, 15, 16, 19, 20],
    instructions: "Un certain nombre de phrases que l'on utilise pour se décrire sont données ci-dessous. Lisez chaque phrase, puis cochez, parmi les quatre points à droite, celui qui correspond le mieux à ce que vous ressentez A L'INSTANT, JUSTE EN CE MOMENT. Il n'y a pas de bonnes ni de mauvaises réponses. Ne passez pas trop de temps sur l'une ou l'autre de ces propositions, et indiquez la réponse qui décrit le mieux vos sentiments actuels."
  }
};

// MARS (Medication adherence)
export const MARS_QUESTIONS: Question[] = [
  {
    id: 'instructions',
    text: 'Consignes',
    type: 'section',
    required: false,
    help: "Ce questionnaire consiste à mieux comprendre les difficultés liées à la prise de médicament. Votre aide nous sera précieuse pour mieux vous aider et améliorer, nous l'espérons, les résultats thérapeutiques. Veuillez s'il vous plaît répondre à l'ensemble des questions en cochant la réponse qui correspond le mieux à votre comportement ou attitude vis à vis du traitement que vous prenez sur la semaine qui vient de s'écouler."
  },
  {
    id: 'taking_medication',
    text: 'Prenez-vous actuellement un traitement médicamenteux ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  { 
    id: 'q1', 
    text: "Vous est-il parfois arrivé d'oublier de prendre vos médicaments ?", 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q2', 
    text: "Négligez-vous parfois l'heure de prise d'un de vos médicaments ?", 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q3', 
    text: 'Lorsque vous vous sentez mieux, interrompez-vous parfois votre traitement ?', 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q4', 
    text: "Vous est-il arrivé d'arrêter le traitement parce que vous vous sentiez moins bien en le prenant ?", 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q5', 
    text: 'Je ne prends les médicaments que lorsque je me sens malade.', 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q6', 
    text: "Ce n'est pas naturel pour mon corps et mon esprit d'être équilibré par des médicaments.", 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q7', 
    text: 'Mes idées sont plus claires avec les médicaments.', 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q8', 
    text: 'En continuant à prendre les médicaments, je peux éviter de tomber à nouveau malade.', 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q9', 
    text: 'Avec les médicaments, je me sens bizarre, comme un « zombie ».', 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  },
  { 
    id: 'q10', 
    text: 'Les médicaments me rendent lourd(e) et fatigué(e).', 
    type: 'single_choice', 
    required: true, 
    display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] },
    options: [{ code: 1, label: 'Oui' }, { code: 0, label: 'Non' }] 
  }
];

export const MARS_DEFINITION: QuestionnaireDefinition = {
  id: 'mars',
  code: 'MARS',
  title: 'MARS',
  description: 'Medication Adherence Rating Scale',
  questions: MARS_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    positive_items: [7, 8],
    negative_items: [1, 2, 3, 4, 5, 6, 9, 10],
    instructions: "Ce questionnaire consiste à mieux comprendre les difficultés liées à la prise de médicament. Votre aide nous sera précieuse pour mieux vous aider et améliorer, nous l'espérons, les résultats thérapeutiques. Veuillez s'il vous plaît répondre à l'ensemble des questions en cochant la réponse qui correspond le mieux à votre comportement ou attitude vis à vis du traitement que vous prenez sur la semaine qui vient de s'écouler."
  }
};

// MAThyS (Multidimensional thymic states)
// MAThyS (Multidimensional thymic states)
export const MATHYS_QUESTIONS: Question[] = [
  {
    id: 'instructions',
    text: 'Évaluation des états thymiques',
    type: 'section',
    required: false,
    help: "Consigne de cotation : coter toujours le score le plus extrême (0 au lieu de 1 par exemple ; 10 au lieu de 9). Chaque item est coté entre 0 et 10, avec possibilité de demi points (Ex.: 2.5).\n\n**Attention : contrairement au calque, ne pas inverser les scores préalablement. ex: item 9: Mon cerveau ne s'arrête pas = 0 | Mon cerveau fonctionne au ralenti = 10.**"
  },
  { id: 'q1', text: "1. Je suis moins sensible que d'habitude aux couleurs | Je suis plus sensible que d'habitude aux couleurs", type: 'scale', required: true, min: 0, max: 10, minLabel: "Moins sensible", maxLabel: "Plus sensible", metadata: { step: 0.5 } },
  { id: 'q2', text: "2. Je manque de tonus | J'ai une tension interne importante", type: 'scale', required: true, min: 0, max: 10, minLabel: "Manque de tonus", maxLabel: "Tension interne", metadata: { step: 0.5 } },
  { id: 'q3', text: "3. J'ai l'impression d'être anesthésié(e) sur le plan des émotions | J'ai parfois le sentiment de perdre le contrôle de mes émotions", type: 'scale', required: true, min: 0, max: 10, minLabel: "Anesthésié(e)", maxLabel: "Perte de contrôle", metadata: { step: 0.5 } },
  { id: 'q4', text: "4. Je suis replié(e) sur moi | Je suis désinhibé(e)", type: 'scale', required: true, min: 0, max: 10, minLabel: "Replié(e)", maxLabel: "Désinhibé(e)", metadata: { step: 0.5 } },
  { id: 'q5', text: "5. Je suis facilement distrait(e), la moindre chose me fait perdre mon attention | Je ne suis pas attentif (ve) à mon environnement", type: 'scale', required: true, min: 0, max: 10, minLabel: "Distrait(e)", maxLabel: "Inattentif (ve)", metadata: { step: 0.5 } },
  { id: 'q6', text: "6. Je suis plus sensible que d'habitude au toucher | Je suis moins sensible que d'habitude au toucher", type: 'scale', required: true, min: 0, max: 10, minLabel: "Plus sensible", maxLabel: "Moins sensible", metadata: { step: 0.5 } },
  { id: 'q7', text: "7. J'ai l'impression que mon humeur varie beaucoup en fonction de mon environnement | Mon humeur est monotone et peu changeante", type: 'scale', required: true, min: 0, max: 10, minLabel: "Humeur variable", maxLabel: "Humeur monotone", metadata: { step: 0.5 } },
  { id: 'q8', text: "8. Je suis particulièrement sensible à la musique | Je suis plus indifférent que d'habitude à la musique", type: 'scale', required: true, min: 0, max: 10, minLabel: "Sensible musique", maxLabel: "Indifférent musique", metadata: { step: 0.5 } },
  { id: 'q9', text: "9. Mon cerveau ne s'arrête jamais | Mon cerveau fonctionne au ralenti", type: 'scale', required: true, min: 0, max: 10, minLabel: "Ne s'arrête jamais", maxLabel: "Au ralenti", metadata: { step: 0.5 } },
  { id: 'q10', text: "10. Je suis plus réactif (ve) à mon environnement | Je suis moins réactif (ve) à mon environnement", type: 'scale', required: true, min: 0, max: 10, minLabel: "Plus réactif(ve)", maxLabel: "Moins réactif(ve)", metadata: { step: 0.5 } },
  { id: 'q11', text: "11. Je me sens sans énergie | J'ai le sentiment d'avoir une grande énergie", type: 'scale', required: true, min: 0, max: 10, minLabel: "Sans énergie", maxLabel: "Grande énergie", metadata: { step: 0.5 } },
  { id: 'q12', text: "12. J'ai le sentiment que mes pensées sont ralenties | J'ai le sentiment que mes idées défilent dans ma tête", type: 'scale', required: true, min: 0, max: 10, minLabel: "Pensées ralenties", maxLabel: "Idées défilent", metadata: { step: 0.5 } },
  { id: 'q13', text: "13. Je trouve la nourriture sans goût | Je recherche les plaisirs gastronomiques car j'en apprécie davantage les saveurs", type: 'scale', required: true, min: 0, max: 10, minLabel: "Sans goût", maxLabel: "Plaisirs gastronomiques", metadata: { step: 0.5 } },
  { id: 'q14', text: "14. J'ai moins envie de communiquer avec les autres | J'ai plus envie de communiquer avec les autres", type: 'scale', required: true, min: 0, max: 10, minLabel: "Moins envie", maxLabel: "Plus envie", metadata: { step: 0.5 } },
  { id: 'q15', text: "15. Je manque de motivation pour aller de l'avant | Je multiplie les projets nouveaux", type: 'scale', required: true, min: 0, max: 10, minLabel: "Manque motivation", maxLabel: "Multiplie projets", metadata: { step: 0.5 } },
  { id: 'q16', text: "16. Ma perte d'intérêt pour mon environnement m'empêche de gérer le quotidien | J'ai envie de faire plus de choses que d'habitude", type: 'scale', required: true, min: 0, max: 10, minLabel: "Perte intérêt", maxLabel: "Envie faire plus", metadata: { step: 0.5 } },
  { id: 'q17', text: "17. Je prends les décisions de manière plus rapide que d'habitude | J'ai plus de difficultés que d'habitude à prendre des décisions", type: 'scale', required: true, min: 0, max: 10, minLabel: "Décisions rapides", maxLabel: "Difficultés décisions", metadata: { step: 0.5 } },
  { id: 'q18', text: "18. Je ressens les émotions de manière très intense | Mes émotions sont atténuées", type: 'scale', required: true, min: 0, max: 10, minLabel: "Émotions intenses", maxLabel: "Émotions atténuées", metadata: { step: 0.5 } },
  { id: 'q19', text: "19. Je suis ralenti(e) dans mes mouvements | Je suis physiquement agité(e)", type: 'scale', required: true, min: 0, max: 10, minLabel: "Ralenti(e)", maxLabel: "Agité(e)", metadata: { step: 0.5 } },
  { id: 'q20', text: "20. J'ai l'impression d'être moins sensible aux odeurs que d'habitude | J'ai l'impression d'être plus sensible aux odeurs que d'habitude", type: 'scale', required: true, min: 0, max: 10, minLabel: "Moins sensible odeurs", maxLabel: "Plus sensible odeurs", metadata: { step: 0.5 } },
  // {
  //   id: 'scores_section',
  //   text: 'Calcul des scores MAThyS',
  //   type: 'section',
  //   required: false,
  //   help: "Les scores ci-dessous sont calculés automatiquement en fonction de vos réponses aux 20 items précédents."
  // },
  { id: 'subscore_emotion', text: 'Score Emotion à la MATHYS', type: 'number', required: false, readonly: true },
  { id: 'subscore_motivation', text: 'Score Motivation à la MATHYS', type: 'number', required: false, readonly: true },
  { id: 'subscore_perception', text: 'Score Perception sensorielle à la MATHYS', type: 'number', required: false, readonly: true },
  { id: 'subscore_interaction', text: 'Score Interaction personnelle à la MATHYS', type: 'number', required: false, readonly: true },
  { id: 'subscore_cognition', text: 'Score Cognition à la MATHYS', type: 'number', required: false, readonly: true },
  {
    id: 'emotions_section',
    text: 'Intensité des émotions',
    type: 'section',
    required: false,
    help: "Veuillez coter l'intensité des émotions suivantes sur la semaine écoulée."
  },
  { id: 'tristesse', text: 'Tristesse', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 2.5, label: 'Occasionnellement' }, { code: 5, label: 'Souvent' }, { code: 7.5, label: 'Très souvent' }, { code: 10, label: 'Constamment' }] },
  { id: 'joie', text: 'Joie', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 2.5, label: 'Occasionnellement' }, { code: 5, label: 'Souvent' }, { code: 7.5, label: 'Très souvent' }, { code: 10, label: 'Constamment' }] },
  { id: 'irritabilite', text: 'Irritabilité', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 2.5, label: 'Occasionnellement' }, { code: 5, label: 'Souvent' }, { code: 7.5, label: 'Très souvent' }, { code: 10, label: 'Constamment' }] },
  { id: 'panique', text: 'Panique', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 2.5, label: 'Occasionnellement' }, { code: 5, label: 'Souvent' }, { code: 7.5, label: 'Très souvent' }, { code: 10, label: 'Constamment' }] },
  { id: 'anxiete', text: 'Anxiété', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 2.5, label: 'Occasionnellement' }, { code: 5, label: 'Souvent' }, { code: 7.5, label: 'Très souvent' }, { code: 10, label: 'Constamment' }] },
  { id: 'colere', text: 'Colère', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 2.5, label: 'Occasionnellement' }, { code: 5, label: 'Souvent' }, { code: 7.5, label: 'Très souvent' }, { code: 10, label: 'Constamment' }] },
  { id: 'exaltation', text: 'Exaltation', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 2.5, label: 'Occasionnellement' }, { code: 5, label: 'Souvent' }, { code: 7.5, label: 'Très souvent' }, { code: 10, label: 'Constamment' }] }
];

export const MATHYS_DEFINITION: QuestionnaireDefinition = {
  id: 'mathys',
  code: 'MATHYS',
  title: 'MAThyS',
  description: 'Évaluation Multidimensionnelle des états thymiques',
  questions: MATHYS_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    reverse_items: [5, 6, 7, 8, 9, 10, 17, 18],
    instructions: "Consigne de cotation : coter toujours le score le plus extrême (0 au lieu de 1 par exemple ; 10 au lieu de 9). Chaque item est coté entre 0 et 10, avec possibilité de demi points (Ex.: 2.5).\n\n**Attention : contrairement au calque, ne pas inverser les scores préalablement. ex: item 9: Mon cerveau ne s'arrête pas = 0 | Mon cerveau fonctionne au ralenti = 10.**"
  }
};

// PSQI (Pittsburgh Sleep Quality Index)
export const PSQI_QUESTIONS: Question[] = [
  {
    id: 'instructions',
    text: 'Évaluation de la qualité du sommeil',
    type: 'section',
    required: false,
    help: "Consigne de cotation : coter toujours le score le plus extrême (0 au lieu de 1 par exemple ; 10 au lieu de 9). Chaque item est coté entre 0 et 10, avec possibilité de demi points (Ex.: 2.5).\n\n**Attention : contrairement au calque, ne pas inverser les scores préalablement. ex: item 9: Mon cerveau ne s'arrête pas = 0 | Mon cerveau fonctionne au ralenti = 10.**"
  },
  { 
    id: 'q1_bedtime', 
    text: '1. Au cours des 30 derniers jours, à quelle heure vous êtes-vous généralement couché(e) le soir? (format HH:MM)', 
    type: 'text', 
    required: true, 
    help: 'A noter en H24 ex: si le patient se couche à 23:00 ne surtout pas mettre 11H(du soir)',
    metadata: { placeholder: 'HH:MM', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' }
  },
  { 
    id: 'q2_minutes_to_sleep', 
    text: '2. Au cours des 30 derniers jours, au bout de combien de temps (en minutes) vous êtes-vous généralement endormi(e) le soir ?', 
    type: 'number', 
    required: true, 
    min: 0 
  },
  { 
    id: 'q3_waketime', 
    text: '3. Au cours des 30 derniers jours, à quelle heure vous êtes-vous généralement levé(e) le matin ? (format HH:MM)', 
    type: 'text', 
    required: true, 
    help: 'A noter en H24 ex: si le patient se couche à 23:00 ne surtout pas mettre 11H(du soir)',
    metadata: { placeholder: 'HH:MM', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' }
  },
  { 
    id: 'q4_hours_sleep', 
    text: '4. Au cours des 30 derniers jours, combien d’heures avez-vous vraiment dormi par nuit ? (format HH:MM)', 
    type: 'text', 
    required: true, 
    help: 'A noter en H24 ex: si vous avez dormi 6 heures et 30 minutes, notez 06:30',
    metadata: { placeholder: 'HH:MM', pattern: '^([01]\\d|2[0-4]):[0-5]\\d$' }
  },
  // Q5: Fréquence des troubles du sommeil
  { id: 'q5a', text: "5a. Vous n’êtes pas arrivé(e) à vous endormir en 30 minutes", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais au cours des 30 derniers jours' }, { code: 1, label: 'Moins d’une fois par semaine' }, { code: 2, label: 'Une ou deux fois par semaine' }, { code: 3, label: 'Trois fois par semaine ou plus' }] },
  { id: 'q5b', text: '5b. Vous vous êtes réveillé(e) au milieu de la nuit ou plus tôt que d’habitude', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais au cours des 30 derniers jours' }, { code: 1, label: 'Moins d’une fois par semaine' }, { code: 2, label: 'Une ou deux fois par semaine' }, { code: 3, label: 'Trois fois par semaine ou plus' }] },
  { id: 'q5c', text: '5c. Vous avez dû vous lever pour aller aux toilettes', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais au cours des 30 derniers jours' }, { code: 1, label: 'Moins d’une fois par semaine' }, { code: 2, label: 'Une ou deux fois par semaine' }, { code: 3, label: 'Trois fois par semaine ou plus' }] },
  { id: 'q5d', text: '5d. Vous avez eu du mal à respirer', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais au cours des 30 derniers jours' }, { code: 1, label: 'Moins d’une fois par semaine' }, { code: 2, label: 'Une ou deux fois par semaine' }, { code: 3, label: 'Trois fois par semaine ou plus' }] },
  { id: 'q5e', text: '5e. Vous avez toussé ou ronflé bruyamment', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais au cours des 30 derniers jours' }, { code: 1, label: 'Moins d’une fois par semaine' }, { code: 2, label: 'Une ou deux fois par semaine' }, { code: 3, label: 'Trois fois par semaine ou plus' }] },
  { id: 'q5f', text: '5f. Vous avez eu trop froid', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais au cours des 30 derniers jours' }, { code: 1, label: 'Moins d’une fois par semaine' }, { code: 2, label: 'Une ou deux fois par semaine' }, { code: 3, label: 'Trois fois par semaine ou plus' }] },
  { id: 'q5g', text: '5g. Vous avez eu trop chaud', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais au cours des 30 derniers jours' }, { code: 1, label: 'Moins d’une fois par semaine' }, { code: 2, label: 'Une ou deux fois par semaine' }, { code: 3, label: 'Trois fois par semaine ou plus' }] },
  { id: 'q5h', text: '5h. Vous avez fait des cauchemars', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais au cours des 30 derniers jours' }, { code: 1, label: 'Moins d’une fois par semaine' }, { code: 2, label: 'Une ou deux fois par semaine' }, { code: 3, label: 'Trois fois par semaine ou plus' }] },
  { id: 'q5i', text: '5i. Vous avez eu des douleurs', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais au cours des 30 derniers jours' }, { code: 1, label: 'Moins d’une fois par semaine' }, { code: 2, label: 'Une ou deux fois par semaine' }, { code: 3, label: 'Trois fois par semaine ou plus' }] },
  { id: 'q5j', text: '5j. Combien de fois, au cours des 30 derniers jours, avez-vous eu des difficultés à dormir pour d’autres raisons ?', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais au cours des 30 derniers jours' }, { code: 1, label: 'Moins d’une fois par semaine' }, { code: 2, label: 'Une ou deux fois par semaine' }, { code: 3, label: 'Trois fois par semaine ou plus' }] },
  { id: 'q5j_text', text: 'Si autre raison, préciser', type: 'text', required: false, display_if: { ">": [{ "var": "answers.q5j" }, 0] } },
  { id: 'q6', text: '6. Comment qualifieriez-vous la qualité de votre sommeil en général au cours des 30 derniers jours ?', type: 'single_choice', required: true, options: [{ code: 0, label: 'Très bonne' }, { code: 1, label: 'Assez bonne' }, { code: 2, label: 'Assez mauvaise' }, { code: 3, label: 'Très mauvaise' }] },
  { id: 'q7', text: '7. Au cours des 30 derniers jours, combien de fois avez-vous pris des médicaments pour mieux dormir (médicaments prescrits par votre médecin ou vendus sans ordonnance) ?', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais au cours des 30 derniers jours' }, { code: 1, label: 'Moins d’une fois par semaine' }, { code: 2, label: 'Une ou deux fois par semaine' }, { code: 3, label: 'Trois fois par semaine ou plus' }] },
  { id: 'q8', text: '8. Au cours des 30 derniers jours, combien de fois avez-vous eu des difficultés à rester éveillé(e) en conduisant, en mangeant, ou en participant à des activités avec d’autres personnes ?', type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais au cours des 30 derniers jours' }, { code: 1, label: 'Moins d’une fois par semaine' }, { code: 2, label: 'Une ou deux fois par semaine' }, { code: 3, label: 'Trois fois par semaine ou plus' }] },
  { id: 'q9', text: '9. Au cours des 30 derniers jours, combien vous a-t-il été difficile d’être suffisamment motivé(e) pour mener à bien vos activités ?', type: 'single_choice', required: true, options: [{ code: 0, label: 'Pas difficile du tout' }, { code: 1, label: 'Légèrement difficile' }, { code: 2, label: 'Assez difficile' }, { code: 3, label: 'Très difficile' }] },

  { id: 'c4_efficiency', text: 'Score efficience sommeil', type: 'number', required: false, readonly: true },
  { id: 'c3_duration', text: 'Score durée de sommeil', type: 'number', required: false, readonly: true },
  { id: 'c5_disturbances', text: 'Score du trouble du sommeil', type: 'number', required: false, readonly: true },
  { id: 'c2_latency', text: 'Score latence avant sommeil', type: 'number', required: false, readonly: true },
  { id: 'c1_subjective_quality', text: 'Score sur la qualité du sommeil', type: 'number', required: false, readonly: true },
  { id: 'c6_medication', text: 'Score médication', type: 'number', required: false, readonly: true },
  { id: 'c7_daytime_dysfunction', text: 'Score de dysfonctionnement dû au sommeil', type: 'number', required: false, readonly: true },
  { id: 'total_score', text: 'Score total', type: 'number', required: false, readonly: true }
];

export const PSQI_DEFINITION: QuestionnaireDefinition = {
  id: 'psqi',
  code: 'PSQI',
  title: 'PSQI',
  description: 'Indice de Qualité du Sommeil de Pittsburgh',
  questions: PSQI_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient'
  }
};

// Epworth (Sleepiness Scale)
export const EPWORTH_QUESTIONS: Question[] = [
  { id: 'q1', text: '1. Assis en train de lire', type: 'single_choice', required: true, options: [{ code: 0, label: '0 – ne somnolerait jamais' }, { code: 1, label: "1 – faible chance de s'endormir" }, { code: 2, label: "2 – chance moyenne de s'endormir" }, { code: 3, label: "3 – forte chance de s'endormir" }] },
  { id: 'q2', text: '2. En train de regarder la télévision', type: 'single_choice', required: true, options: [{ code: 0, label: '0 – ne somnolerait jamais' }, { code: 1, label: "1 – faible chance de s'endormir" }, { code: 2, label: "2 – chance moyenne de s'endormir" }, { code: 3, label: "3 – forte chance de s'endormir" }] },
  { id: 'q3', text: '3. Assis, inactif, dans un endroit public (au théâtre, en réunion)', type: 'single_choice', required: true, options: [{ code: 0, label: '0 – ne somnolerait jamais' }, { code: 1, label: "1 – faible chance de s'endormir" }, { code: 2, label: "2 – chance moyenne de s'endormir" }, { code: 3, label: "3 – forte chance de s'endormir" }] },
  { id: 'q4', text: '4. Comme passager dans une voiture roulant sans arrêt pendant une heure', type: 'single_choice', required: true, options: [{ code: 0, label: '0 – ne somnolerait jamais' }, { code: 1, label: "1 – faible chance de s'endormir" }, { code: 2, label: "2 – chance moyenne de s'endormir" }, { code: 3, label: "3 – forte chance de s'endormir" }] },
  { id: 'q5', text: "5. Allongé l'après-midi pour se reposer quand les circonstances le permettent", type: 'single_choice', required: true, options: [{ code: 0, label: '0 – ne somnolerait jamais' }, { code: 1, label: "1 – faible chance de s'endormir" }, { code: 2, label: "2 – chance moyenne de s'endormir" }, { code: 3, label: "3 – forte chance de s'endormir" }] },
  { id: 'q6', text: '6. Assis en train de parler à quelqu’un', type: 'single_choice', required: true, options: [{ code: 0, label: '0 – ne somnolerait jamais' }, { code: 1, label: "1 – faible chance de s'endormir" }, { code: 2, label: "2 – chance moyenne de s'endormir" }, { code: 3, label: "3 – forte chance de s'endormir" }] },
  { id: 'q7', text: '7. Assis calmement après un repas sans alcool', type: 'single_choice', required: true, options: [{ code: 0, label: '0 – ne somnolerait jamais' }, { code: 1, label: "1 – faible chance de s'endormir" }, { code: 2, label: "2 – chance moyenne de s'endormir" }, { code: 3, label: "3 – forte chance de s'endormir" }] },
  { id: 'q8', text: '8. Dans une auto immobilisée quelques minutes dans un encombrement', type: 'single_choice', required: true, options: [{ code: 0, label: '0 – ne somnolerait jamais' }, { code: 1, label: "1 – faible chance de s'endormir" }, { code: 2, label: "2 – chance moyenne de s'endormir" }, { code: 3, label: "3 – forte chance de s'endormir" }] },
  { id: 'q9', text: '9. Ces envies de dormir surviennent-elles ? (cocher une seule réponse)', type: 'single_choice', required: false, options: [{ code: 0, label: 'seulement après les repas' }, { code: 1, label: 'à certaines heures du jour, toujours les mêmes' }, { code: 2, label: 'la nuit' }, { code: 3, label: "n'importe quelle heure du jour" }] }
];

export const EPWORTH_DEFINITION: QuestionnaireDefinition = {
  id: 'epworth',
  code: 'EPWORTH',
  title: 'Epworth',
  description: 'Échelle de Somnolence d’Epworth',
  instructions: "Vous arrive-t-il de somnoler ou de vous endormir - et pas seulement de vous sentir fatigué - dans les situations suivantes ? Cette question s'adresse à votre vie dans les mois derniers.\nMême si vous ne vous êtes pas trouvé récemment dans l'une des situations suivantes, essayez de vous représenter comme elles auraient pu vous affecter.\nChoisissez dans l'échelle suivante le nombre le plus approprié à chaque situation :",
  questions: EPWORTH_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient'
  }
};

// ============================================================================
// Initial Evaluation Questionnaires - TRAITS Section
// ============================================================================

// ASRS (Adult ADHD Self-Report Scale)
export const ASRS_QUESTIONS: Question[] = [
  // Part A: Screening items
  {
    id: 'section_part_a',
    text: 'PARTIE A',
    type: 'section',
    required: false
  },
  { id: 'a1', section: 'PARTIE A', text: "1. A quelle fréquence vous arrive-t-il d'avoir des difficultés à finaliser les derniers détails d'un projet une fois que les parties les plus stimulantes ont été faites ?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  { id: 'a2', section: 'PARTIE A', text: "2. A quelle fréquence vous arrive-t-il d'avoir des difficultés à mettre les choses en ordre lorsque vous devez faire quelque chose qui demande de l'organisation ?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  { id: 'a3', section: 'PARTIE A', text: "3. A quelle fréquence vous arrive-t-il d'avoir des difficultés à vous rappeler vos rendez-vous ou vos obligations ?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  { id: 'a4', section: 'PARTIE A', text: "4. Quand vous devez faire quelque chose qui demande beaucoup de réflexion, à quelle fréquence vous arrive-t-il d'éviter de le faire ou de le remettre à plus tard ?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  { id: 'a5', section: 'PARTIE A', text: "5. A quelle fréquence vous arrive-t-il de remuer ou de tortiller les mains ou les pieds lorsque vous devez rester assis pendant une période prolongée ?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  { id: 'a6', section: 'PARTIE A', text: "6. A quelle fréquence vous arrive-t-il de vous sentir excessivement actif et contraint de faire quelque chose, comme si vous étiez entraîné malgré vous par un moteur ?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  // Part B: Additional symptom items
  {
    id: 'section_part_b',
    text: 'PARTIE B',
    type: 'section',
    required: false
  },
  { id: 'b7', section: 'PARTIE B', text: "7. Avec quelle fréquence faites-vous des erreurs d'étourderie lorsque vous travaillez sur un projet ennuyeux ou difficile?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  { id: 'b8', section: 'PARTIE B', text: "8. Avec quelle fréquence avez-vous des difficultés à rester attentif lorsque vous faites un travail ennuyeux ou répétitif?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  { id: 'b9', section: 'PARTIE B', text: "9. A quelle fréquence vous arrive-t-il d'avoir des difficultés à vous concentrer sur les propos de votre interlocuteur, même s'il s'adresse directement à vous?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  { id: 'b10', section: 'PARTIE B', text: "10. A la maison ou au travail, à quelle fréquence vous arrive-t-il d'égarer des choses ou d'avoir des difficultés à les retrouver?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  { id: 'b11', section: 'PARTIE B', text: "11. Avec quelle fréquence êtes-vous distrait par de l'activité ou du bruit autour de vous?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  { id: 'b12', section: 'PARTIE B', text: "12. A quelle fréquence vous arrive-t-il de quitter votre siège pendant des réunions ou d'autres situations ou vous devriez rester assis?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  { id: 'b13', section: 'PARTIE B', text: "13. A quelle fréquence vous arrive-t-il d'avoir des difficultés à vous tenir tranquille?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  { id: 'b14', section: 'PARTIE B', text: "14. Avec quelle fréquence avez-vous des difficultés à vous détendre et à vous reposer pendant votre temps libre?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  { id: 'b15', section: 'PARTIE B', text: "15. A quelle fréquence vous arrive-t-il de parler de façon excessive à l'occasion de rencontres sociales?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  { id: 'b16', section: 'PARTIE B', text: "16. Pendant une conversation, à quelle fréquence vous arrive-t-il de terminer les phrases de vos interlocuteurs avant que ces derniers aient le temps de les finir?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  { id: 'b17', section: 'PARTIE B', text: "17. A quelle fréquence vous arrive-t-il d'avoir des difficultés à attendre votre tour lorsque vous devriez le faire?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] },
  { id: 'b18', section: 'PARTIE B', text: "18. A quelle fréquence vous arrive-t-il d'interrompre les gens lorsqu'ils sont occupés?", type: 'single_choice', required: true, options: [{ code: 0, label: 'Jamais' }, { code: 1, label: 'Rarement' }, { code: 2, label: 'Quelquefois' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Très souvent' }] }
];

export const ASRS_DEFINITION: QuestionnaireDefinition = {
  id: 'asrs',
  code: 'ASRS_FR',
  title: 'ASRS - Adult ADHD Self-Report Scale',
  description: "Échelle d'auto-évaluation du trouble déficitaire de l'attention avec/sans hyperactivité chez l'adulte",
  questions: ASRS_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    part_a_thresholds: { a1: 2, a2: 2, a3: 2, a4: 3, a5: 3, a6: 3 },
    instructions: "Cochez la case qui décrit le mieux ce que vous avez ressenti et comment vous vous êtes comporté au cours des 6 derniers mois. Veuillez remettre le questionnaire rempli à votre médecin ou un autre professionnel lors de votre prochain rendez-vous afin d'en discuter les résultats."
  }
};

// CTQ (Childhood Trauma Questionnaire)
export const CTQ_QUESTIONS: Question[] = [
  { id: 'q1', text: "1. Il m'est arrivé de ne pas avoir assez à manger", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q2', text: "2. Je savais qu'il y avait quelqu'un pour prendre soin de moi et me protéger", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q3', text: "3. Des membres de ma famille me disaient que j'étais « stupide » ou « paresseux » ou « laid »", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q4', text: "4. Mes parents étaient trop saouls ou « pétés » pour s'occuper de la famille", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q5', text: "5. Il y avait quelqu'un dans ma famille qui m'aidait à sentir que j'étais important ou particulier", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q6', text: '6. Je devais porter des vêtements sales', type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q7', text: '7. Je me sentais aimé(e)', type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q8', text: "8. Je pensais que mes parents n'avaient pas souhaité ma naissance", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q9', text: "9. J'ai été frappé(e) si fort par un membre de ma famille que j'ai dû consulter un docteur ou aller à l'hôpital", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q10', text: "10. Je n'aurais rien voulu changer à ma famille", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q11', text: "11. Un membre de ma famille m'a frappé(e) si fort que j'ai eu des bleus ou des marques", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q12', text: "12. J'étais puni(e) au moyen d'une ceinture, d'un bâton, d'une corde ou de quelque autre objet dur", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q13', text: '13. Les membres de ma famille étaient attentifs les uns aux autres', type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q14', text: "14. Les membres de ma famille me disaient des choses blessantes ou insultantes", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q15', text: "15. Je pense que j'ai été physiquement maltraité(e)", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q16', text: "16. J'ai eu une enfance parfaite", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q17', text: "17. J'ai été frappé(e) ou battu(e) si fort que quelqu'un l'a remarqué (par ex. un professeur, un voisin ou un docteur)", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q18', text: "18. J'avais le sentiment que quelqu'un dans ma famille me détestait", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q19', text: '19. Les membres de ma famille se sentaient proches les uns des autres', type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q20', text: "20. Quelqu'un a essayé de me faire des attouchements sexuels ou de m'en faire faire", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q21', text: "21. Quelqu'un a menacé de me blesser ou de raconter des mensonges à mon sujet si je ne faisais pas quelque chose de nature sexuelle avec lui", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q22', text: "22. J'avais la meilleure famille du monde", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q23', text: "23. Quelqu'un a essayé de me faire faire des actes sexuels ou de me faire regarder de tels actes", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q24', text: "24. J'ai été victime d'abus sexuels", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q25', text: "25. Je pense que j'ai été maltraité affectivement", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q26', text: "26. Il y avait quelqu'un pour m'emmener chez le docteur si j'en avais besoin", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q27', text: "27. Je pense qu'on a abusé de moi sexuellement", type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] },
  { id: 'q28', text: '28. Ma famille était une source de force et de soutien', type: 'single_choice', required: true, options: [{ code: 1, label: 'Jamais' }, { code: 2, label: 'Rarement' }, { code: 3, label: 'Quelquefois' }, { code: 4, label: 'Souvent' }, { code: 5, label: 'Très souvent' }] }
];

export const CTQ_DEFINITION: QuestionnaireDefinition = {
  id: 'ctq',
  code: 'CTQ_FR',
  title: 'CTQ - Childhood Trauma Questionnaire',
  description: "Questionnaire sur les traumatismes de l'enfance",
  questions: CTQ_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    instructions: "Ce questionnaire porte sur certaines expériences que vous auriez pu vivre au cours de votre enfance ou de votre adolescence. Pour chaque affirmation, cochez la case qui convient le mieux. Bien que certaines questions concernent des sujets intimes et personnels, il est important de répondre complètement et aussi honnêtement que possible.",
    reverse_items: [2, 5, 7, 13, 19, 26, 28],
    subscales: {
      emotional_abuse: [3, 8, 14, 18, 25],
      physical_abuse: [9, 11, 12, 15, 17],
      sexual_abuse: [20, 21, 23, 24, 27],
      emotional_neglect: [5, 7, 13, 19, 28],
      physical_neglect: [1, 2, 4, 6, 26],
      denial: [10, 16, 22]
    }
  }
};

// BIS-10 (Barratt Impulsiveness Scale - short form from BIS-11)
export const BIS10_QUESTIONS: Question[] = [
  { id: 'q1', text: "1. Je prépare soigneusement les tâches à accomplir", type: 'single_choice', required: true, options: [{ code: 1, label: 'Rarement ou jamais' }, { code: 2, label: 'Occasionnellement' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Toujours ou presque toujours' }] },
  { id: 'q2', text: "6. J'ai des idées qui fusent", type: 'single_choice', required: true, options: [{ code: 1, label: 'Rarement ou jamais' }, { code: 2, label: 'Occasionnellement' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Toujours ou presque toujours' }] },
  { id: 'q3', text: "8. Je suis maître de moi", type: 'single_choice', required: true, options: [{ code: 1, label: 'Rarement ou jamais' }, { code: 2, label: 'Occasionnellement' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Toujours ou presque toujours' }] },
  { id: 'q4', text: "9. Je me concentre facilement", type: 'single_choice', required: true, options: [{ code: 1, label: 'Rarement ou jamais' }, { code: 2, label: 'Occasionnellement' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Toujours ou presque toujours' }] },
  { id: 'q5', text: "12. Je réfléchis soigneusement", type: 'single_choice', required: true, options: [{ code: 1, label: 'Rarement ou jamais' }, { code: 2, label: 'Occasionnellement' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Toujours ou presque toujours' }] },
  { id: 'q6', text: "14. Je dis les choses sans y penser", type: 'single_choice', required: true, options: [{ code: 1, label: 'Rarement ou jamais' }, { code: 2, label: 'Occasionnellement' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Toujours ou presque toujours' }] },
  { id: 'q7', text: "17. J'agis sur un coup de tête", type: 'single_choice', required: true, options: [{ code: 1, label: 'Rarement ou jamais' }, { code: 2, label: 'Occasionnellement' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Toujours ou presque toujours' }] },
  { id: 'q8', text: "20. J'agis selon l'inspiration du moment", type: 'single_choice', required: true, options: [{ code: 1, label: 'Rarement ou jamais' }, { code: 2, label: 'Occasionnellement' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Toujours ou presque toujours' }] },
  { id: 'q9', text: "21. Je suis quelqu'un de réfléchi", type: 'single_choice', required: true, options: [{ code: 1, label: 'Rarement ou jamais' }, { code: 2, label: 'Occasionnellement' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Toujours ou presque toujours' }] },
  { id: 'q10', text: "23. J'achète les choses sur un coup de tête", type: 'single_choice', required: true, options: [{ code: 1, label: 'Rarement ou jamais' }, { code: 2, label: 'Occasionnellement' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Toujours ou presque toujours' }] },
  { id: 'q11', text: "25. Je change de passe-temps", type: 'single_choice', required: true, options: [{ code: 1, label: 'Rarement ou jamais' }, { code: 2, label: 'Occasionnellement' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Toujours ou presque toujours' }] },
  { id: 'q12', text: "28. Je dépense ou paye à crédit plus que je ne gagne", type: 'single_choice', required: true, options: [{ code: 1, label: 'Rarement ou jamais' }, { code: 2, label: 'Occasionnellement' }, { code: 3, label: 'Souvent' }, { code: 4, label: 'Toujours ou presque toujours' }] }
];

export const BIS10_DEFINITION: QuestionnaireDefinition = {
  id: 'bis10',
  code: 'BIS10_FR',
  title: 'BIS-10 - Barratt Impulsiveness Scale (Short Form)',
  description: "Échelle d'impulsivité de Barratt - Version courte (12 items)",
  questions: BIS10_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    instructions: "Les gens agissent et réfléchissent différemment devant des situations variées. Ce questionnaire a pour but d'évaluer certaines de vos façons d'agir et de réfléchir. Lisez chaque énoncé et remplissez la case appropriée située sur la droite de la page. Ne passez pas trop de temps sur chaque énoncé. Répondez vite et honnêtement.",
    reverse_items: [1, 3, 4, 5, 9],
    subscales: {
      cognitive_impulsivity: [1, 3, 4, 5, 9],
      motor_impulsivity: [2, 6, 7, 8, 10, 11, 12]
    },
    bis11_item_map: {
      q1: 1, q2: 6, q3: 8, q4: 9, q5: 12, q6: 14,
      q7: 17, q8: 20, q9: 21, q10: 23, q11: 25, q12: 28
    }
  }
};

// ALS-18 (Affective Lability Scale)
export const ALS18_QUESTIONS: Question[] = [
  { id: 'q1', text: "1. À certains moments, je me sens aussi détendu(e) que n'importe qui, et en quelques minutes, je deviens si nerveux(se) que j'ai l'impression d'avoir la tête vide et d'avoir un vertige.", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q2', text: "2. Il y a des moments où j'ai très peu d'énergie, et peu de temps après, j'ai autant d'énergie que la plupart des gens.", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q3', text: "3. Durant une minute, je pense me sentir très bien, et la minute suivante, je suis tendu(e), je réagis à la moindre chose et je suis nerveux(se).", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q4', text: "4. J'oscille souvent entre des moments où je contrôle très bien mon humeur à des moments où je ne la contrôle plus du tout.", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q5', text: "5. Très souvent, je me sens très nerveux(se) et tendu(e), et ensuite soudainement, je me sens très triste et abattu(e).", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q6', text: "6. Quelque fois je passe de sentiments très anxieux au sujet de quelque chose à des sentiments très tristes à leur propos.", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q7', text: "7. J'oscille entre des moments où je me sens parfaitement calme à des moments où je me sens très tendu(e) et nerveux(se).", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q8', text: "8. Il y a des moments où je me sens parfaitement calme durant une minute, et la minute suivante, la moindre chose me rend furieux(se).", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q9', text: "9. Fréquemment, je me sens OK, mais ensuite tout d'un coup, je deviens si fou que je pourrais frapper quelque chose.", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q10', text: "10. Souvent, je peux penser clairement et bien me concentrer pendant une minute, et la minute suivante, j'ai beaucoup de difficultés à me concentrer et à penser clairement.", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q11', text: "11. Il y a des moments où je me sens si furieux(se) que je ne peux pas m'arrêter de hurler après les autres, et peu de temps après, je ne pense plus du tout à crier après eux.", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q12', text: "12. J'oscille entre des périodes où je me sens plein d'énergie et d'autres où j'ai si peu d'énergie que c'est un énorme effort juste d'aller là où je dois aller.", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q13', text: "13. Il y a des moments où je me sens absolument admirable et d'autres juste après où je me sens exactement comme n'importe qui d'autre.", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q14', text: "14. Il y a des moments où je me sens tellement furieux(se) que mon cœur bat très fort et/ou je tremble, et des autres peu après, où je me sens détendu(e).", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q15', text: "15. J'oscille entre n'être pas productif(ve) à des périodes où je suis aussi productif(ve) que tout le monde.", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q16', text: "16. Quelque fois, j'ai beaucoup d'énergie une minute, et la minute suivante, j'ai tellement peu d'énergie que je ne peux presque rien faire.", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q17', text: "17. Il y a des moments où j'ai plus d'énergie que d'habitude et plus que la plupart des gens, et rapidement après, j'ai à peu près le même niveau d'énergie que n'importe qui d'autre.", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] },
  { id: 'q18', text: "18. À certains moments, j'ai l'impression de tout faire très lentement, et très rapidement après, j'ai l'impression de ne pas être plus lent que quelqu'un d'autre.", type: 'single_choice', required: true, options: [{ code: 0, label: 'D – Absolument pas caractéristique de moi' }, { code: 1, label: 'C – Assez peu caractéristique de moi' }, { code: 2, label: 'B – Assez caractéristique de moi' }, { code: 3, label: 'A – Très caractéristique de moi' }] }
];

export const ALS18_DEFINITION: QuestionnaireDefinition = {
  id: 'als18',
  code: 'ALS18',
  title: 'ALS-18',
  description: 'Affective Lability Scale - Version courte',
  questions: ALS18_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    instructions: "Pour remplir ce questionnaire, basez-vous sur votre mode de fonctionnement habituel, c'est à dire en dehors des périodes où votre humeur est anormalement dépressive ou euphorique/exaltée. Ce questionnaire a pour but de décrire l'humeur. En utilisant l'échelle ci-dessous, sélectionnez la lettre qui décrit le mieux chaque question en ce qui vous concerne.\nPour chaque item, cliquez seulement sur une réponse.",
    subscales: {
      anxiety_depression: [1, 3, 5, 6, 7],
      depression_elation: [2, 10, 12, 13, 15, 16, 17, 18],
      anger: [4, 8, 9, 11, 14]
    }
  }
};

// AIM (Affect Intensity Measure)
export const AIM_QUESTIONS: Question[] = [
  { id: 'q1', text: "1. Quand je suis heureux(se), c'est avec une forte exubérance.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q2', text: "2. Mes périodes d'humeur joyeuse sont si fortes que j'ai l'impression d'être au paradis.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q3', text: "3. Si je termine une tâche que je jugeais impossible à faire, je me sens en extase.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q4', text: '4. Les films tristes me touchent profondément.', type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q5', text: "5. Quand je suis heureux(se), c'est un sentiment d'être sans inquiétude et content(e) plutôt qu'excité et plein d'enthousiasme.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q6', text: "6. Quand je parle devant un groupe pour la première fois, ma voix devient tremblante et mon cœur bat vite.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q7', text: "7. Quand je me sens bien, c'est facile pour moi d'osciller entre des périodes de bonne humeur et des moments où je suis très joyeux(se).", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q8', text: "8. Quand je suis heureux(se), je me sens comme si j'éclatais de joie.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q9', text: "9. Quand je suis heureux(se), je me sens plein d'énergie.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q10', text: "10. Quand je réussis quelque chose, ma réaction est une satisfaction calme.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q11', text: "11. Quand je fais quelque chose de mal, j'ai un sentiment très fort de culpabilité et de honte.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q12', text: '12. Quand les choses vont bien, je me sens comme si j’étais "au sommet du monde".', type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q13', text: "13. Quand je sais que j'ai fait quelque chose très bien, je me sens détendu(e) et content(e) plutôt qu'excité(e) et exalté(e).", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q14', text: "14. Quand je suis anxieux(se), c'est habituellement très fort.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q15', text: "15. Quand je me sens heureux(se), c'est un sentiment de bonheur calme.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q16', text: "16. Quand je suis heureux(se), je déborde d'énergie.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q17', text: "17. Quand je me sens coupable, cette émotion est forte.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q18', text: "18. Je décrirai mes émotions heureuses comme étant plus proches de la satisfaction que de la joie.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q19', text: "19. Quand je suis heureux(se), je tremble.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] },
  { id: 'q20', text: "20. Quand je suis heureux(se), mes sentiments sont plus proches de la satisfaction et du calme interne que de l'excitation et de la joie de vivre.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Jamais' }, { code: 2, label: '2 – Presque jamais' }, { code: 3, label: '3 – Occasionnellement' }, { code: 4, label: '4 – Habituellement' }, { code: 5, label: '5 – Presque toujours' }, { code: 6, label: '6 – Toujours' }] }
];

export const AIM_DEFINITION: QuestionnaireDefinition = {
  id: 'aim',
  code: 'AIM',
  title: 'AIM-20',
  description: 'Affect Intensity Measure - Version courte',
  questions: AIM_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    reverse_items: [5, 10, 13, 15, 18, 20],
    instructions: "Pour remplir ce questionnaire, basez-vous sur votre mode de fonctionnement habituel, c'est à dire en dehors des périodes où votre humeur est anormalement dépressive ou euphorique/exaltée.\nLes questions suivantes portent sur les réactions émotionnelles aux événements de vie habituels. Merci d'indiquer comment vous réagissez à ces événements en inscrivant un nombre entre 1 et 6 (échelle ci-dessous) dans l'espace vide précédant chaque item. Merci de baser votre réponse sur la manière dont vous réagissez et NON PAS sur la manière dont les autres réagissent ou sur comment vous pensez qu'une personne devrait réagir."
  }
};

// WURS-25 (Wender Utah Rating Scale - Short Form)
// Original WURS items mapping: 3,4,5,6,7,9,10,11,12,15,16,17,20,21,24,25,26,27,28,29,40,41,51,56,59
const WURS25_OPTIONS = [
  { code: 0, label: "Pas du tout, ou très légèrement" },
  { code: 1, label: "Légèrement" },
  { code: 2, label: "Modérément" },
  { code: 3, label: "Assez" },
  { code: 4, label: "Beaucoup" }
];

export const WURS25_QUESTIONS: Question[] = [
  { id: 'q1', text: "3. Des problèmes de concentration, facilement distrait (e)", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q2', text: "4. Anxieux (se), se faisant du souci", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q3', text: "5. Nerveux (se), ne tenant pas en place", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q4', text: "6. Inattentif (ve), rêveur (se)", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q5', text: "7. Facilement en colère, « soupe au lait »", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q6', text: "9. Des éclats d'humeur, des accès de colère", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q7', text: "10. Des difficultés à me tenir aux choses, à mener mes projets jusqu'à la fin, à finir les choses commencées", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q8', text: "11. Têtu (e), obstiné (e)", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q9', text: "12. Triste ou cafardeux (se), déprimé (e), malheureux (se)", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q10', text: "15. Désobéissant (e) à mes parents, rebelle, effronté (e)", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q11', text: "16. Une mauvaise opinion de moi-même", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q12', text: "17. Irritable", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q13', text: "20. D'humeur changeante, avec des hauts et des bas", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q14', text: "21. En colère", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q15', text: "24. Impulsif (ve), agissant sans réfléchir", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q16', text: "25. Tendance à être immature", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q17', text: "26. Culpabilisé (e), plein (e) de regrets", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q18', text: "27. Une perte du contrôle de moi-même", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q19', text: "28. Tendance à être ou à agir de façon irrationnelle", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q20', text: "29. Impopulaire auprès des autres enfants, ne gardant pas longtemps mes amis, ne m'entendant pas avec les autres enfants", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q21', text: "40. Du mal à voir les choses du point de vue de quelqu'un d'autre", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q22', text: "41. Des ennuis avec les autorités, l'école, convoqué (e) au bureau du proviseur", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q23', text: "51. Dans l'ensemble un (e) mauvais (e) élève, apprenant lentement", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q24', text: "56. Des difficultés en mathématiques ou avec les chiffres", type: 'single_choice', required: true, options: WURS25_OPTIONS },
  { id: 'q25', text: "59. En dessous de son potentiel", type: 'single_choice', required: true, options: WURS25_OPTIONS }
];

export const WURS25_DEFINITION: QuestionnaireDefinition = {
  id: 'wurs25',
  code: 'WURS25',
  title: 'WURS-25',
  description: "Echelle de Wender Utah - Version courte (25 items)",
  questions: WURS25_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    instructions: "Ce questionnaire porte sur votre enfance et adolescence. Pour chaque item, indiquez dans quelle mesure chaque description s'appliquait à vous avant l'âge de 12 ans.\n\nComme enfant j'étais (ou j'avais) :",
    timeframe: "Avant l'âge de 12 ans",
    cutoff_score: 36,
    original_wurs_items: [3, 4, 5, 6, 7, 9, 10, 11, 12, 15, 16, 17, 20, 21, 24, 25, 26, 27, 28, 29, 40, 41, 51, 56, 59]
  }
};

// AQ-12 (Aggression Questionnaire)
export const AQ12_QUESTIONS: Question[] = [
  { id: 'q1', text: 'Si on me provoque, je peux cogner.', type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Pas du tout moi' }, { code: 2, label: '2' }, { code: 3, label: '3' }, { code: 4, label: '4' }, { code: 5, label: '5' }, { code: 6, label: '6 – Tout à fait moi' }] },
  { id: 'q2', text: "J'exprime souvent mon désaccord avec les autres.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Pas du tout moi' }, { code: 2, label: '2' }, { code: 3, label: '3' }, { code: 4, label: '4' }, { code: 5, label: '5' }, { code: 6, label: '6 – Tout à fait moi' }] },
  { id: 'q3', text: "Je m'emporte rapidement.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Pas du tout moi' }, { code: 2, label: '2' }, { code: 3, label: '3' }, { code: 4, label: '4' }, { code: 5, label: '5' }, { code: 6, label: '6 – Tout à fait moi' }] },
  { id: 'q4', text: "Parfois, j'ai l'impression que je n'ai pas été gâté par la vie comme les autres.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Pas du tout moi' }, { code: 2, label: '2' }, { code: 3, label: '3' }, { code: 4, label: '4' }, { code: 5, label: '5' }, { code: 6, label: '6 – Tout à fait moi' }] },
  { id: 'q5', text: "Il y a des personnes qui me gonflent tellement qu'on peut en arriver aux mains.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Pas du tout moi' }, { code: 2, label: '2' }, { code: 3, label: '3' }, { code: 4, label: '4' }, { code: 5, label: '5' }, { code: 6, label: '6 – Tout à fait moi' }] },
  { id: 'q6', text: "Je ne peux pas m'empêcher d'entrer en conflit quand les autres ne sont pas d'accord avec moi.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Pas du tout moi' }, { code: 2, label: '2' }, { code: 3, label: '3' }, { code: 4, label: '4' }, { code: 5, label: '5' }, { code: 6, label: '6 – Tout à fait moi' }] },
  { id: 'q7', text: 'Parfois, je pète un câble sans raison.', type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Pas du tout moi' }, { code: 2, label: '2' }, { code: 3, label: '3' }, { code: 4, label: '4' }, { code: 5, label: '5' }, { code: 6, label: '6 – Tout à fait moi' }] },
  { id: 'q8', text: "Je me demande parfois pourquoi je ressens tant d'amertume.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Pas du tout moi' }, { code: 2, label: '2' }, { code: 3, label: '3' }, { code: 4, label: '4' }, { code: 5, label: '5' }, { code: 6, label: '6 – Tout à fait moi' }] },
  { id: 'q9', text: "J'ai déjà menacé quelqu'un.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Pas du tout moi' }, { code: 2, label: '2' }, { code: 3, label: '3' }, { code: 4, label: '4' }, { code: 5, label: '5' }, { code: 6, label: '6 – Tout à fait moi' }] },
  { id: 'q10', text: "Mes amis disent que j'ai l'esprit de contradiction.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Pas du tout moi' }, { code: 2, label: '2' }, { code: 3, label: '3' }, { code: 4, label: '4' }, { code: 5, label: '5' }, { code: 6, label: '6 – Tout à fait moi' }] },
  { id: 'q11', text: "J'ai du mal à contrôler mon humeur.", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Pas du tout moi' }, { code: 2, label: '2' }, { code: 3, label: '3' }, { code: 4, label: '4' }, { code: 5, label: '5' }, { code: 6, label: '6 – Tout à fait moi' }] },
  { id: 'q12', text: 'Les autres semblent toujours avoir plus de chances que moi.', type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Pas du tout moi' }, { code: 2, label: '2' }, { code: 3, label: '3' }, { code: 4, label: '4' }, { code: 5, label: '5' }, { code: 6, label: '6 – Tout à fait moi' }] }
];

export const AQ12_DEFINITION: QuestionnaireDefinition = {
  id: 'aq12',
  code: 'AQ12',
  title: 'AQ-12',
  description: "Questionnaire d'Agression - 12 items",
  questions: AQ12_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    subscales: {
      physical_aggression: [1, 5, 9],
      verbal_aggression: [2, 6, 10],
      anger: [3, 7, 11],
      hostility: [4, 8, 12]
    }
  }
};

// CSM (Composite Scale of Morningness)
export const CSM_QUESTIONS: Question[] = [
  { id: 'q1', text: "En ne considérant que le rythme de vie qui vous convient le mieux, à quelle heure vous lèveriez-vous en étant entièrement libre d'organiser votre journée ?", type: 'single_choice', required: true, options: [{ code: 5, label: 'entre 5h 00 et 6h 30' }, { code: 4, label: 'entre 6h 30 et 7h 45' }, { code: 3, label: 'entre 7h 45 et 9h 45' }, { code: 2, label: 'entre 9h45 et 11h 00' }, { code: 1, label: 'entre 11h00 et midi' }] },
  { id: 'q2', text: "En ne considérant que le rythme de vie qui vous convient le mieux, à quelle heure vous coucheriez-vous sachant que vous êtes entièrement libre d'organiser votre soirée ?", type: 'single_choice', required: true, options: [{ code: 5, label: 'entre 20h 00 et 21h 00' }, { code: 4, label: 'entre 21h 00 et 22h 15' }, { code: 3, label: 'entre 22h 15 et 0h 30' }, { code: 2, label: 'entre 0h 30 et 1h 45' }, { code: 1, label: 'entre 1h 45 et 3h 00' }] },
  { id: 'q3', text: "Dans des conditions adéquates (environnement favorable, sans contraintes particulières, etc.), à quel point cela vous est-il facile de vous lever le matin ?", type: 'single_choice', required: true, options: [{ code: 1, label: 'pas facile du tout' }, { code: 2, label: 'pas très facile' }, { code: 3, label: 'assez facile' }, { code: 4, label: 'très facile' }] },
  { id: 'q4', text: 'Comment vous sentez-vous durant la demi-heure qui suit votre réveil du matin ?', type: 'single_choice', required: true, options: [{ code: 1, label: 'pas du tout réveillé' }, { code: 2, label: 'peu éveillé' }, { code: 3, label: 'relativement éveillé' }, { code: 4, label: 'très éveillé' }] },
  { id: 'q5', text: 'Comment vous sentez-vous durant la demi-heure qui suit votre réveil du matin ?', type: 'single_choice', required: true, options: [{ code: 1, label: 'très fatigué' }, { code: 2, label: 'plutôt fatigué' }, { code: 3, label: 'plutôt en forme' }, { code: 4, label: 'très en forme' }] },
  { id: 'q6', text: 'Vous avez décidé de faire de l’exercice physique. Un(e) ami(e) vous propose de faire du jogging 2 fois par semaine pendant 1 heure. Le meilleur moment pour lui(elle) est entre 7h et 8h du matin. En ne considérant que votre rythme personnel, dans quelle forme pensez-vous être ?', type: 'single_choice', required: true, options: [{ code: 1, label: 'dans une très mauvaise forme' }, { code: 2, label: 'dans une forme plutôt mauvaise' }, { code: 3, label: 'dans une forme raisonnable' }, { code: 4, label: 'dans une bonne forme' }] },
  { id: 'q7', text: 'À quel moment de la soirée vous sentez-vous fatigué(e) et avez-vous besoin de dormir ?', type: 'single_choice', required: true, options: [{ code: 5, label: 'entre 20h 00 et 21h 00' }, { code: 4, label: 'entre 21h 00 et 22h 15' }, { code: 3, label: 'entre 22h 15 et 0h 45' }, { code: 2, label: 'entre 0h 45 et 2h 00' }, { code: 1, label: 'entre 2h 00 et 3h 00' }] },
  { id: 'q8', text: "Vous avez décidé de faire de l’exercice physique. Un(e) ami(e) vous propose de faire du jogging 2 fois par semaine pendant 1 heure. Le meilleur moment pour lui(elle) est entre 22h et 23h. En ne considérant que votre rythme personnel, dans quelle forme pensez-vous être ?", type: 'single_choice', required: true, options: [{ code: 1, label: 'dans une très mauvaise forme' }, { code: 2, label: 'dans une forme plutôt mauvaise' }, { code: 3, label: 'dans une forme raisonnable' }, { code: 4, label: 'dans une bonne forme' }] },
  { id: 'q9', text: 'Supposez que vous puissiez choisir vos heures de travail et que vous travailliez 5 heures par jour. Quelle tranche de 5 heures consécutives choisiriez-vous en sachant que votre travail est intéressant et que vous êtes payé(e) en fonction du résultat ?', type: 'single_choice', required: true, options: [{ code: 1, label: 'entre minuit et 5h du matin' }, { code: 2, label: 'entre 3h et 8h du matin' }, { code: 3, label: 'entre 8h du matin et 13h' }, { code: 4, label: 'entre 13h et 18h' }] },
  { id: 'q10', text: 'À quelle heure de la journée pensez-vous atteindre votre maximum de bien-être ?', type: 'single_choice', required: true, options: [{ code: 1, label: 'entre minuit et 5h du matin' }, { code: 2, label: 'entre 5h et 8h du matin' }, { code: 3, label: 'entre 8h du matin et 10h' }, { code: 4, label: 'entre 10h et 17h' }] },
  { id: 'q11', text: 'On parle de personnes du type « matin » et d’autres du type « soir ». Quel type pensez-vous être ?', type: 'single_choice', required: true, options: [{ code: 1, label: 'nettement du type « soir »' }, { code: 2, label: 'plutôt du type « soir » que du type « matin »' }, { code: 3, label: 'plutôt du type « matin » que du type « soir »' }, { code: 4, label: 'nettement du type « matin »' }] },
  { id: 'q12', text: "Supposez que vous deviez passer un examen de 2 heures qui va vous demander le maximum de concentration et que vous soyez entièrement libre de choisir l’heure de la journée qui vous convient le mieux. Quelle période choisiriez-vous ?", type: 'single_choice', required: true, options: [{ code: 1, label: 'entre 19h et 21h' }, { code: 2, label: 'entre 15h et 17h' }, { code: 3, label: 'entre 11h et 13h' }, { code: 4, label: 'entre 8h et 10h' }] },
  { id: 'q13', text: "Si vous alliez au lit à 23h, à quel niveau de fatigue seriez-vous ?", type: 'single_choice', required: true, options: [{ code: 1, label: 'pas du tout fatigué(e)' }, { code: 2, label: 'un peu fatigué(e)' }, { code: 3, label: 'assez fatigué(e)' }, { code: 4, label: 'très fatigué(e)' }] }
];

export const CSM_DEFINITION: QuestionnaireDefinition = {
  id: 'csm',
  code: 'CSM',
  title: 'CSM',
  description: 'Composite Scale of Morningness',
  questions: CSM_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient'
  }
};

// CTI (Circadian Type Inventory)
export const CTI_QUESTIONS: Question[] = [
  { id: 'q1', text: 'Avez-vous tendance à avoir besoin de plus de sommeil que les autres personnes ?', type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Presque jamais' }, { code: 2, label: '2 – Rarement' }, { code: 3, label: '3 – Parfois' }, { code: 4, label: '4 – En général' }, { code: 5, label: '5 – Presque toujours' }] },
  { id: 'q2', text: "Si vous aviez à faire un certain travail au milieu de la nuit, pensez-vous que vous pourriez le faire presque aussi facilement qu'à une heure plus normale de la journée ?", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Presque jamais' }, { code: 2, label: '2 – Rarement' }, { code: 3, label: '3 – Parfois' }, { code: 4, label: '4 – En général' }, { code: 5, label: '5 – Presque toujours' }] },
  { id: 'q3', text: "Est-ce que vous trouvez qu'il est difficile de vous réveiller correctement si vous êtes réveillé à une heure inhabituelle ?", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Presque jamais' }, { code: 2, label: '2 – Rarement' }, { code: 3, label: '3 – Parfois' }, { code: 4, label: '4 – En général' }, { code: 5, label: '5 – Presque toujours' }] },
  { id: 'q4', text: 'Aimez-vous travailler à des heures inhabituelles du jour ou de la nuit ?', type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Presque jamais' }, { code: 2, label: '2 – Rarement' }, { code: 3, label: '3 – Parfois' }, { code: 4, label: '4 – En général' }, { code: 5, label: '5 – Presque toujours' }] },
  { id: 'q5', text: 'Si vous allez au lit très tard, avez-vous besoin de dormir plus tard le lendemain matin ?', type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Presque jamais' }, { code: 2, label: '2 – Rarement' }, { code: 3, label: '3 – Parfois' }, { code: 4, label: '4 – En général' }, { code: 5, label: '5 – Presque toujours' }] },
  { id: 'q6', text: "Si vous avez beaucoup à faire, pouvez-vous travailler tard le soir pour terminer sans être trop fatigué ?", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Presque jamais' }, { code: 2, label: '2 – Rarement' }, { code: 3, label: '3 – Parfois' }, { code: 4, label: '4 – En général' }, { code: 5, label: '5 – Presque toujours' }] },
  { id: 'q7', text: 'Vous sentez-vous endormi pendant un certain temps après le réveil le matin ?', type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Presque jamais' }, { code: 2, label: '2 – Rarement' }, { code: 3, label: '3 – Parfois' }, { code: 4, label: '4 – En général' }, { code: 5, label: '5 – Presque toujours' }] },
  { id: 'q8', text: 'Trouvez-vous aussi facile de travailler tard la nuit que tôt le matin ?', type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Presque jamais' }, { code: 2, label: '2 – Rarement' }, { code: 3, label: '3 – Parfois' }, { code: 4, label: '4 – En général' }, { code: 5, label: '5 – Presque toujours' }] },
  { id: 'q9', text: 'Si vous devez vous lever très tôt un matin, avez-vous tendance à vous sentir fatigué toute la journée ?', type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Presque jamais' }, { code: 2, label: '2 – Rarement' }, { code: 3, label: '3 – Parfois' }, { code: 4, label: '4 – En général' }, { code: 5, label: '5 – Presque toujours' }] },
  { id: 'q10', text: 'Seriez-vous aussi content de faire quelque chose au milieu de la nuit que pendant la journée ?', type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Presque jamais' }, { code: 2, label: '2 – Rarement' }, { code: 3, label: '3 – Parfois' }, { code: 4, label: '4 – En général' }, { code: 5, label: '5 – Presque toujours' }] },
  { id: 'q11', text: "Devez-vous compter sur un réveil, ou sur quelqu'un d'autre, pour vous réveiller le matin ?", type: 'single_choice', required: true, options: [{ code: 1, label: '1 – Presque jamais' }, { code: 2, label: '2 – Rarement' }, { code: 3, label: '3 – Parfois' }, { code: 4, label: '4 – En général' }, { code: 5, label: '5 – Presque toujours' }] }
];

export const CTI_DEFINITION: QuestionnaireDefinition = {
  id: 'cti',
  code: 'CTI',
  title: 'CTI',
  description: 'Inventaire du Type Circadien',
  questions: CTI_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    subscales: {
      flexibility: [2, 4, 6, 8, 10],
      languid: [1, 3, 5, 7, 9, 11]
    }
  }
};
