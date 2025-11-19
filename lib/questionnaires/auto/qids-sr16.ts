// eFondaMental Platform - QIDS-SR16
// French version - Quick Inventory of Depressive Symptomatology - Self Report 16

import { QuestionnaireDefinition, Question } from '../types';

const QIDS_QUESTIONS: Question[] = [
  {
    id: "q1",
    section_id: "part1",
    text: "Endormissement",
    type: "single_choice",
    required: true,
    options: [
      { code: 0, label: "Je ne mets jamais plus de 30 minutes à m'endormir.", score: 0 },
      { code: 1, label: "Moins d'une fois sur deux, je mets au moins 30 minutes à m'endormir.", score: 1 },
      { code: 2, label: "Plus d'une fois sur deux, je mets au moins 30 minutes à m'endormir.", score: 2 },
      { code: 3, label: "Plus d'une fois sur deux, je mets plus d'une heure à m'endormir.", score: 3 }
    ],
    constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] },
    scoring_group_id: "sleep",
    scoring_aggregation: "max"
  },
  {
    id: "q2",
    section_id: "part1",
    text: "Sommeil pendant la nuit",
    type: "single_choice",
    required: true,
    options: [
      { code: 0, label: "Je ne me réveille pas la nuit.", score: 0 },
      { code: 1, label: "J'ai un sommeil agité, léger et quelques réveils brefs chaque nuit.", score: 1 },
      { code: 2, label: "Je me réveille au moins une fois par nuit, mais je me rendors facilement.", score: 2 },
      { code: 3, label: "Plus d'une fois sur deux, je me réveille plus d'une fois par nuit et reste éveillé(e) 20 minutes ou plus.", score: 3 }
    ],
    constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] },
    scoring_group_id: "sleep",
    scoring_aggregation: "max"
  },
  {
    id: "q3",
    section_id: "part1",
    text: "Réveil avant l'heure prévue",
    type: "single_choice",
    required: true,
    options: [
      { code: 0, label: "La plupart du temps, je me réveille 30 minutes ou moins avant le moment où je dois me lever.", score: 0 },
      { code: 1, label: "Plus d'une fois sur deux, je me réveille plus de 30 minutes avant le moment où je dois me lever.", score: 1 },
      { code: 2, label: "Je me réveille presque toujours une heure ou plus avant le moment où je dois me lever, mais je finis par me rendormir.", score: 2 },
      { code: 3, label: "Je me réveille au moins une heure avant le moment où je dois me lever et je n'arrive pas à me rendormir.", score: 3 }
    ],
    constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] },
    scoring_group_id: "sleep",
    scoring_aggregation: "max"
  },
  {
    id: "q4",
    section_id: "part1",
    text: "Sommeil excessif",
    type: "single_choice",
    required: true,
    options: [
      { code: 0, label: "Je ne dors pas plus de 7 à 8 heures par nuit, et je ne fais pas de sieste dans la journée.", score: 0 },
      { code: 1, label: "Je ne dors pas plus de 10 heures sur un jour entier de 24 heures, siestes comprises.", score: 1 },
      { code: 2, label: "Je ne dors pas plus de 12 heures sur un jour entier de 24 heures, siestes comprises.", score: 2 },
      { code: 3, label: "Je dors plus de 12 heures sur un jour entier de 24 heures, siestes comprises.", score: 3 }
    ],
    constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] },
    scoring_group_id: "sleep",
    scoring_aggregation: "max"
  },
  {
    id: "q5",
    section_id: "part1",
    text: "Tristesse",
    type: "single_choice",
    required: true,
    options: [
      { code: 0, label: "Je ne me sens pas triste.", score: 0 },
      { code: 1, label: "Je me sens triste moins de la moitié du temps.", score: 1 },
      { code: 2, label: "Je me sens triste plus de la moitié du temps.", score: 2 },
      { code: 3, label: "Je me sens triste presque tout le temps.", score: 3 }
    ],
    constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] },
    scoring_aggregation: "direct"
  },
  {
    id: "q6",
    section_id: "part1",
    text: "Diminution de l'appétit",
    type: "single_choice",
    required: true,
    options: [
      { code: 0, label: "J'ai le même appétit que d'habitude.", score: 0 },
      { code: 1, label: "Je mange un peu moins souvent ou en plus petite quantité que d'habitude.", score: 1 },
      { code: 2, label: "Je mange beaucoup moins que d'habitude et seulement en me forçant.", score: 2 },
      { code: 3, label: "Je mange rarement sur un jour entier de 24 heures et seulement en me forçant énormément ou quand on me persuade de manger.", score: 3 }
    ],
    constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] },
    scoring_group_id: "appetite_weight",
    scoring_aggregation: "max"
  },
  {
    id: "q7",
    section_id: "part1",
    text: "Augmentation de l'appétit",
    type: "single_choice",
    required: true,
    options: [
      { code: 0, label: "J'ai le même appétit que d'habitude.", score: 0 },
      { code: 1, label: "J'éprouve le besoin de manger plus souvent que d'habitude.", score: 1 },
      { code: 2, label: "Je mange régulièrement plus souvent et/ou en plus grosse quantité que d'habitude.", score: 2 },
      { code: 3, label: "J'éprouve un grand besoin de manger plus que d'habitude pendant et entre les repas.", score: 3 }
    ],
    constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] },
    scoring_group_id: "appetite_weight",
    scoring_aggregation: "max"
  },
  {
    id: "q8",
    section_id: "part1",
    text: "Perte de poids (au cours des 15 derniers jours)",
    type: "single_choice",
    required: true,
    options: [
      { code: 0, label: "Mon poids n'a pas changé.", score: 0 },
      { code: 1, label: "J'ai l'impression d'avoir perdu un peu de poids.", score: 1 },
      { code: 2, label: "J'ai perdu 1 kg ou plus.", score: 2 },
      { code: 3, label: "J'ai perdu plus de 2 kg.", score: 3 }
    ],
    constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] },
    scoring_group_id: "appetite_weight",
    scoring_aggregation: "max"
  },
  {
    id: "q9",
    section_id: "part1",
    text: "Prise de poids (au cours des 15 derniers jours)",
    type: "single_choice",
    required: true,
    options: [
      { code: 0, label: "Mon poids n'a pas changé.", score: 0 },
      { code: 1, label: "J'ai l'impression d'avoir pris un peu de poids.", score: 1 },
      { code: 2, label: "J'ai pris 1 kg ou plus.", score: 2 },
      { code: 3, label: "J'ai pris plus de 2 kg.", score: 3 }
    ],
    constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] },
    scoring_group_id: "appetite_weight",
    scoring_aggregation: "max"
  },
  {
    id: "q10",
    section_id: "part2",
    text: "Concentration/Prise de décisions",
    type: "single_choice",
    required: true,
    options: [
      { code: 0, label: "Il n'y a aucun changement dans ma capacité habituelle à me concentrer ou à prendre des décisions.", score: 0 },
      { code: 1, label: "Je me sens parfois indécis(e) ou je trouve parfois que ma concentration est limitée.", score: 1 },
      { code: 2, label: "La plupart du temps, j'ai du mal à me concentrer ou à prendre des décisions.", score: 2 },
      { code: 3, label: "Je n'arrive pas me concentrer assez pour lire ou je n'arrive pas à prendre des décisions même si elles sont insignifiantes.", score: 3 }
    ],
    constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] },
    scoring_aggregation: "direct"
  },
  {
    id: "q11",
    section_id: "part2",
    text: "Opinion de moi-même",
    type: "single_choice",
    required: true,
    options: [
      { code: 0, label: "Je considère que j'ai autant de valeur que les autres et que je suis aussi méritant(e) que les autres.", score: 0 },
      { code: 1, label: "Je me critique plus que d'habitude.", score: 1 },
      { code: 2, label: "Je crois fortement que je cause des problèmes aux autres.", score: 2 },
      { code: 3, label: "Je pense presque tout le temps à mes petits et mes gros défauts.", score: 3 }
    ],
    constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] },
    scoring_aggregation: "direct"
  },
  {
    id: "q12",
    section_id: "part2",
    text: "Idées de mort ou de suicide",
    type: "single_choice",
    required: true,
    help: "En cas d'idéation suicidaire, alerter immédiatement le clinicien.",
    options: [
      { code: 0, label: "Je ne pense pas au suicide ni à la mort.", score: 0 },
      { code: 1, label: "Je pense que la vie est sans intérêt ou je me demande si elle vaut la peine d'être vécue.", score: 1 },
      { code: 2, label: "Je pense au suicide ou à la mort plusieurs fois par semaine pendant plusieurs minutes.", score: 2 },
      { code: 3, label: "Je pense au suicide ou à la mort plusieurs fois par jours en détail, j'ai envisagé le suicide de manière précise ou j'ai réellement tenté de mettre fin à mes jours.", score: 3 }
    ],
    constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] },
    scoring_aggregation: "direct"
  },
  {
    id: "q13",
    section_id: "part2",
    text: "Enthousiasme général",
    type: "single_choice",
    required: true,
    options: [
      { code: 0, label: "Il n'y pas de changement par rapport à d'habitude dans la manière dont je m'intéresse aux gens ou à mes activités.", score: 0 },
      { code: 1, label: "Je me rends compte que je m'intéresse moins aux gens et à mes activités.", score: 1 },
      { code: 2, label: "Je me rends compte que je n'ai d'intérêt que pour une ou deux des activités que j'avais auparavant.", score: 2 },
      { code: 3, label: "Je n'ai pratiquement plus d'intérêt pour les activités que j'avais auparavant.", score: 3 }
    ],
    constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] },
    scoring_aggregation: "direct"
  },
  {
    id: "q14",
    section_id: "part2",
    text: "Énergie",
    type: "single_choice",
    required: true,
    options: [
      { code: 0, label: "J'ai autant d'énergie que d'habitude.", score: 0 },
      { code: 1, label: "Je me fatigue plus facilement que d'habitude.", score: 1 },
      { code: 2, label: "Je dois faire un gros effort pour commencer ou terminer mes activités quotidiennes (par exemple, faire les courses, les devoirs, la cuisine ou aller au travail).", score: 2 },
      { code: 3, label: "Je ne peux vraiment pas faire mes activités quotidiennes parce que je n'ai simplement plus d'énergie.", score: 3 }
    ],
    constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] },
    scoring_aggregation: "direct"
  },
  {
    id: "q15",
    section_id: "part2",
    text: "Impression de ralentissement",
    type: "single_choice",
    required: true,
    options: [
      { code: 0, label: "Je pense, je parle et je bouge aussi vite que d'habitude.", score: 0 },
      { code: 1, label: "Je trouve que je réfléchis plus lentement ou que ma voix est étouffée ou monocorde.", score: 1 },
      { code: 2, label: "Il me faut plusieurs secondes pour répondre à la plupart des questions et je suis sûr(e) que je réfléchis plus lentement.", score: 2 },
      { code: 3, label: "Je suis souvent incapable de répondre aux questions si je ne fais pas de gros efforts.", score: 3 }
    ],
    constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] },
    scoring_group_id: "psychomotor",
    scoring_aggregation: "max"
  },
  {
    id: "q16",
    section_id: "part2",
    text: "Impression d'agitation",
    type: "single_choice",
    required: true,
    options: [
      { code: 0, label: "Je ne me sens pas agité(e).", score: 0 },
      { code: 1, label: "Je suis souvent agité(e), je me tords les mains ou j'ai besoin de changer de position quand je suis assis(e).", score: 1 },
      { code: 2, label: "J'éprouve le besoin soudain de bouger et je suis plutôt agité(e).", score: 2 },
      { code: 3, label: "Par moments, je suis incapable de rester assis(e) et j'ai besoin de faire les cent pas.", score: 3 }
    ],
    constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] },
    scoring_group_id: "psychomotor",
    scoring_aggregation: "max"
  }
];

export const QIDS_SR16: QuestionnaireDefinition = {
  metadata: {
    id: "QIDS-SR16.fr",
    code: "QIDS_SR16_FR",
    name: "Auto-questionnaire court sur les symptômes de la dépression",
    abbreviation: "QIDS-SR16",
    language: "fr-FR",
    version: "1.0",
    reference_period: "7 derniers jours",
    description: "Échelle d'auto-évaluation en 16 items mesurant la sévérité des symptômes dépressifs sur 9 domaines DSM, chaque item coté de 0 à 3.",
    sources: [
      "https://pmc.ncbi.nlm.nih.gov/articles/PMC2929841/",
      "https://med-fom-ubcsad.sites.olt.ubc.ca/files/2013/11/QIDS-SR.pdf"
    ],
    total_questions: 16,
    scoring_range: [0, 27],
    target_role: 'patient',
    pathologies: ['bipolar', 'depression']
  },

  sections: [
    {
      id: "part1",
      label: "PARTIE 1",
      description: "Items 1 à 9",
      question_ids: ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9"]
    },
    {
      id: "part2",
      label: "PARTIE 2",
      description: "Items 10 à 16",
      question_ids: ["q10", "q11", "q12", "q13", "q14", "q15", "q16"]
    }
  ],

  questions: QIDS_QUESTIONS,

  scoring_rules: {
    schema_version: "1.0",
    type: "mutually_exclusive_groups",
    description: "QIDS-SR16 uses maximum scores within certain symptom domains",
    domains: [
      {
        id: "sleep",
        label: "Sommeil",
        items: ["q1", "q2", "q3", "q4"],
        aggregation: "max",
        description: "Troubles du sommeil: insomnie ou hypersomnie (max 1 sur 4)",
        range: [0, 3],
        rationale: "Patient experiences either difficulty sleeping OR excessive sleep, not both simultaneously"
      },
      {
        id: "appetite_weight",
        label: "Appétit/Poids",
        items: ["q6", "q7", "q8", "q9"],
        aggregation: "max",
        description: "Appétit/Poids: diminution ou augmentation (max 1 sur 4)",
        range: [0, 3],
        rationale: "Patient experiences either appetite loss OR increase, and either weight loss OR gain, not both"
      },
      {
        id: "psychomotor",
        label: "Psychomoteur",
        items: ["q15", "q16"],
        aggregation: "max",
        description: "Activité psychomotrice: ralentissement ou agitation (max 1 sur 2)",
        range: [0, 3],
        rationale: "Patient experiences either psychomotor slowing OR agitation, not both simultaneously"
      }
    ],
    direct_items: [
      { id: "q5", label: "Tristesse", aggregation: "direct" },
      { id: "q10", label: "Concentration/Décisions", aggregation: "direct" },
      { id: "q11", label: "Opinion de soi", aggregation: "direct" },
      { id: "q12", label: "Pensées de mort/suicide", aggregation: "direct" },
      { id: "q13", label: "Intérêt général", aggregation: "direct" },
      { id: "q14", label: "Niveau d'énergie", aggregation: "direct" }
    ],
    total: {
      formula: "sum(max(q1,q2,q3,q4), q5, max(q6,q7,q8,q9), q10, q11, q12, q13, q14, max(q15,q16))",
      formula_expanded: "max(q1-q4) + q5 + max(q6-q9) + q10 + q11 + q12 + q13 + q14 + max(q15,q16)",
      range: [0, 27],
      description: "Total score uses max from grouped domains plus direct items"
    },
    policies: {
      missing: "error",
      missing_policy_description: "All questions must be answered; no imputation",
      ties: "keep_max",
      ties_description: "In case of equal scores within a group, any can be used (max is deterministic)"
    },
    validation: {
      check_mutual_exclusivity: true,
      warning_if_both_endorsed: [
        {
          group: "sleep",
          pairs: [
            {
              items: ["q1", "q2", "q3"],
              vs: ["q4"],
              warning: "Patient endorsed both insomnia symptoms and hypersomnia"
            }
          ]
        },
        {
          group: "appetite_weight",
          pairs: [
            {
              items: ["q6"],
              vs: ["q7"],
              warning: "Patient endorsed both appetite decrease and increase"
            },
            {
              items: ["q8"],
              vs: ["q9"],
              warning: "Patient endorsed both weight loss and gain"
            }
          ]
        },
        {
          group: "psychomotor",
          pairs: [
            {
              items: ["q15"],
              vs: ["q16"],
              warning: "Patient endorsed both psychomotor slowing and agitation"
            }
          ]
        }
      ]
    },
    interpretation_thresholds: {
      none: [0, 5],
      mild: [6, 10],
      moderate: [11, 15],
      severe: [16, 20],
      very_severe: [21, 27]
    }
  }
};

