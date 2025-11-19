// eFondaMental Platform - ASRM (Altman Self-Rating Mania Scale)
// French version - Self-assessment scale for manic/hypomanic symptoms

import { QuestionnaireDefinition, QuestionOption } from '../types';

const ASRM_ITEMS = [
  // Q1: Happiness/Cheerfulness
  [
    "Je ne me sens pas plus heureux(se) ou plus joyeux(se) que d'habitude.",
    "Je me sens parfois plus heureux(se) ou plus joyeux(se) que d'habitude.",
    "Je me sens souvent plus heureux(se) ou plus joyeux(se) que d'habitude.",
    "Je me sens plus heureux(se) ou plus joyeux(se) que d'habitude la plupart du temps.",
    "Je me sens plus heureux(se) ou plus joyeux(se) que d'habitude tout le temps."
  ],
  // Q2: Self-confidence
  [
    "Je ne me sens pas plus sûr(e) de moi que d'habitude.",
    "Je me sens parfois plus sûr(e) de moi que d'habitude.",
    "Je me sens souvent plus sûr(e) de moi que d'habitude.",
    "Je me sens plus sûr(e) de moi que d'habitude la plupart du temps.",
    "Je me sens extrêmement sûr(e) de moi tout le temps."
  ],
  // Q3: Sleep need
  [
    "Je n'ai pas besoin de moins de sommeil que d'habitude.",
    "J'ai parfois besoin de moins de sommeil que d'habitude.",
    "J'ai souvent besoin de moins de sommeil que d'habitude.",
    "J'ai fréquemment besoin de moins de sommeil que d'habitude.",
    "Je peux passer toute la journée et toute la nuit sans dormir et ne pas être fatigué(e)."
  ],
  // Q4: Talkativeness
  [
    "Je ne parle pas plus que d'habitude.",
    "Je parle parfois plus que d'habitude.",
    "Je parle souvent plus que d'habitude.",
    "Je parle fréquemment plus que d'habitude.",
    "Je parle sans arrêt et je ne peux être interrompu(e)."
  ],
  // Q5: Activity level
  [
    "Je n'ai pas été plus actif(ve) que d'habitude (socialement, sexuellement, au travail, à la maison ou à l'école).",
    "J'ai parfois été plus actif(ve) que d'habitude.",
    "J'ai souvent été plus actif(ve) que d'habitude.",
    "J'ai fréquemment été plus actif(ve) que d'habitude.",
    "Je suis constamment actif(ve), ou en mouvement tout le temps."
  ]
];

const QUESTION_LABELS = [
  "Humeur (Bonheur/Joie)",
  "Confiance en soi",
  "Besoin de sommeil",
  "Discours (Loquacité)",
  "Niveau d'activité"
];

export const ASRM: QuestionnaireDefinition = {
  metadata: {
    id: "ASRM.fr",
    code: "ASRM_FR",
    name: "Auto-Questionnaire Altman – Échelle d'Auto-Évaluation de la Manie (ASRM)",
    abbreviation: "ASRM",
    language: "fr-FR",
    version: "1.0",
    reference_period: "7 derniers jours",
    description: "Échelle auto-rapportée à 5 items, chacun coté de 0 à 4, évaluant la symptomatologie maniaque/hypomaniaque récente. Score total = somme des 5 items (0–20).",
    sources: [
      "Altman EG, Hedeker D, Peterson JL, Davis JM. The Altman Self-Rating Mania Scale. Biol Psychiatry. 1997;42(10):948-55."
    ],
    total_questions: 5,
    scoring_range: [0, 20],
    cutoff: 6,
    target_role: 'patient',
    pathologies: ['bipolar']
  },

  sections: [
    {
      id: "sec1",
      label: "ASRM – 5 items",
      description: "Période de référence : la semaine dernière",
      question_ids: ["q1", "q2", "q3", "q4", "q5"]
    }
  ],

  questions: ASRM_ITEMS.map((options, index) => {
    const questionNumber = index + 1;
    return {
      id: `q${questionNumber}`,
      section_id: "sec1",
      text: `Question ${questionNumber}: ${QUESTION_LABELS[index]}`,
      type: 'single_choice' as const,
      required: true,
      options: options.map((label, scoreIndex) => ({
        code: scoreIndex,
        label,
        score: scoreIndex
      })),
      constraints: {
        value_type: "integer",
        min_value: 0,
        max_value: 4,
        allowed_values: [0, 1, 2, 3, 4]
      },
      scoring_aggregation: 'direct'
    };
  }),

  scoring_rules: {
    schema_version: "1.0",
    type: "simple_sum",
    description: "Score total = somme simple des 5 items (0–20)",
    direct_items: [
      { id: "q1", label: "Humeur (Bonheur/Joie)", aggregation: "direct" },
      { id: "q2", label: "Confiance en soi", aggregation: "direct" },
      { id: "q3", label: "Besoin de sommeil", aggregation: "direct" },
      { id: "q4", label: "Discours (Loquacité)", aggregation: "direct" },
      { id: "q5", label: "Niveau d'activité", aggregation: "direct" }
    ],
    total: {
      formula: "q1 + q2 + q3 + q4 + q5",
      range: [0, 20],
      description: "Somme simple de tous les items"
    },
    policies: {
      missing: "error",
      missing_policy_description: "Tous les items doivent être remplis"
    },
    interpretation_thresholds: {
      low: [0, 5],
      high: [6, 20]
    }
  }
};

