// eFondaMental Platform - MDQ (Mood Disorder Questionnaire)
// French version - Screening tool for bipolar disorder spectrum

import { QuestionnaireDefinition, Question } from '../types';

const Q1_TEXTS = [
  "… vous vous sentiez si bien et si remonté que d'autres pensaient que vous n'étiez pas comme d'habitude ou que vous alliez vous attirer des ennuis",
  "… vous étiez si irritable que vous criiez après les gens ou provoquiez des bagarres ou des disputes",
  "… vous vous sentiez beaucoup plus sûr(e) de vous que d'habitude",
  "… vous dormiez beaucoup moins que d'habitude et cela ne vous manquait pas vraiment",
  "… vous étiez beaucoup plus bavard(e) et parliez beaucoup plus vite que d'habitude",
  "… des pensées traversaient rapidement votre tête et vous ne pouviez pas les ralentir",
  "… vous étiez si facilement distrait(e) que vous aviez des difficultés à vous concentrer ou à poursuivre la même idée",
  "… vous aviez beaucoup plus d'énergie que d'habitude",
  "… vous étiez beaucoup plus actif(ve) ou faisiez beaucoup plus de choses que d'habitude",
  "… vous étiez beaucoup plus sociable ou extraverti(e), par ex. vous téléphoniez à vos amis la nuit",
  "… vous étiez beaucoup plus intéressé(e) par le sexe que d'habitude",
  "… vous faisiez des choses inhabituelles ou jugées excessives, imprudentes ou risquées",
  "… vous dépensiez de l'argent d'une manière si inadaptée que cela vous attirait des ennuis pour vous ou votre famille"
];

// Build Q1 items (13 yes/no questions)
const q1Questions: Question[] = Q1_TEXTS.map((text, index) => ({
  id: `q1_${index + 1}`,
  section_id: "sec1",
  text: `1.${index + 1} ${text}`,
  type: "single_choice",
  required: true,
  options: [
    { code: 1, label: "Oui", score: 1 },
    { code: 0, label: "Non", score: 0 }
  ],
  constraints: { value_type: "integer", allowed_values: [0, 1] }
}));

// Build the condition for Q2 and Q3: sum of Q1 items >= 2
const q1SumCondition = {
  ">=": [
    {
      "+": Q1_TEXTS.map((_, i) => ({ var: `answers.q1_${i + 1}` }))
    },
    2
  ]
};

const q2Question: Question = {
  id: "q2",
  section_id: "sec2",
  text: "2. Si ≥2 réponses 'oui' à la Q1, ces réponses sont-elles apparues durant la même période ?",
  type: "single_choice",
  required: false,
  display_if: q1SumCondition,
  required_if: q1SumCondition,
  options: [
    { code: 1, label: "Oui" },
    { code: 0, label: "Non" }
  ],
  constraints: { value_type: "integer", allowed_values: [0, 1] }
};

const q3Question: Question = {
  id: "q3",
  section_id: "sec2",
  text: "3. À quel point ces problèmes ont-ils eu un impact sur votre fonctionnement ?",
  type: "single_choice",
  required: false,
  display_if: q1SumCondition,
  required_if: q1SumCondition,
  options: [
    { code: 0, label: "Pas de problème" },
    { code: 1, label: "Problème mineur" },
    { code: 2, label: "Problème moyen" },
    { code: 3, label: "Problème sérieux" }
  ],
  constraints: { value_type: "integer", allowed_values: [0, 1, 2, 3] }
};

export const MDQ: QuestionnaireDefinition = {
  metadata: {
    id: "MDQ.fr",
    code: "MDQ_FR",
    name: "Questionnaire des Troubles de l'Humeur (MDQ) – Version française",
    abbreviation: "MDQ",
    language: "fr-FR",
    version: "1.0",
    reference_period: "Au cours de votre vie (épisodes passés ou actuels)",
    description: "Outil de dépistage du trouble bipolaire (spectre) en 13 items principaux (oui/non) + 2 questions d'agrégation temporelle et d'impact fonctionnel.",
    sources: [
      "Hirschfeld RM et al., Am J Psychiatry, 2000"
    ],
    notes: [
      "Critères positifs classiques: ≥7 réponses 'oui' à Q1 + Q2='oui' + Q3='problème moyen' ou 'problème sérieux'."
    ],
    total_questions: 15,
    target_role: 'patient',
    pathologies: ['bipolar']
  },

  sections: [
    {
      id: "sec1",
      label: "Question 1 (13 items)",
      description: "Symptômes maniaques/hypomaniaques",
      question_ids: Q1_TEXTS.map((_, i) => `q1_${i + 1}`)
    },
    {
      id: "sec2",
      label: "Questions 2 et 3",
      description: "Concordance temporelle et impact fonctionnel",
      question_ids: ["q2", "q3"]
    }
  ],

  questions: [...q1Questions, q2Question, q3Question],

  branching_logic: {
    schema_version: "1.0",
    type: "answer_dependent",
    description: "Q2 and Q3 are only shown if at least 2 'yes' answers in Q1",
    rules: [
      {
        rule_id: "q2_visibility",
        question_id: "q2",
        rule_type: "display",
        condition: q1SumCondition,
        description: "Show Q2 only if at least 2 'yes' answers in Q1",
        action_if_true: "show",
        action_if_false: "hide"
      },
      {
        rule_id: "q2_requirement",
        question_id: "q2",
        rule_type: "required",
        condition: q1SumCondition,
        description: "Q2 is required only when visible (Q1 sum >= 2)",
        action_if_true: "required",
        action_if_false: "optional"
      },
      {
        rule_id: "q3_visibility",
        question_id: "q3",
        rule_type: "display",
        condition: q1SumCondition,
        description: "Show Q3 only if at least 2 'yes' answers in Q1",
        action_if_true: "show",
        action_if_false: "hide"
      },
      {
        rule_id: "q3_requirement",
        question_id: "q3",
        rule_type: "required",
        condition: q1SumCondition,
        description: "Q3 is required only when visible (Q1 sum >= 2)",
        action_if_true: "required",
        action_if_false: "optional"
      }
    ],
    context_variables: {
      q1_sum: {
        source: "calculated",
        formula: {
          sum: Q1_TEXTS.map((_, i) => `q1_${i + 1}`)
        },
        type: "integer",
        range: [0, 13],
        description: "Sum of all Q1 'yes' responses"
      }
    },
    fallback_behavior: {
      when_q1_sum_lt_2: {
        q2: "hide",
        q3: "hide",
        description: "Hide Q2 and Q3 if less than 2 yes answers in Q1"
      },
      validation: {
        hidden_questions_not_required: true,
        description: "Hidden questions (Q2, Q3) are not validated when Q1 sum < 2"
      }
    },
    scoring_impact: {
      description: "Q2 and Q3 do not contribute to numeric score, only to screening result interpretation",
      screening_threshold: {
        positive_if: "Q1 >= 7 AND Q2 = yes AND Q3 >= 2 (moderate or serious)"
      }
    }
  },

  scoring_rules: {
    schema_version: "1.0",
    type: "conditional",
    description: "MDQ POSITIF si (Q1≥7) ET (Q2=oui) ET (Q3=problème moyen ou sérieux)",
    total: {
      formula: "sum(q1_1...q1_13)",
      range: [0, 13],
      description: "Sum of Q1 yes responses, then apply conditional criteria with Q2 and Q3"
    },
    policies: {
      missing: "error",
      missing_policy_description: "All visible questions must be answered"
    }
  }
};

