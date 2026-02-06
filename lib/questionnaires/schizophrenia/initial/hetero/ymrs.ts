// eFondaMental Platform - YMRS (Young Mania Rating Scale)
// Schizophrenia Initial Evaluation - Hetero Module

import { Question } from "@/lib/types/database.types";

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaYmrsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
  q11: number;
  total_score: number | null;
  severity: string | null;
  interpretation: string | null;
  test_done?: boolean;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaYmrsResponseInsert = Omit<
  SchizophreniaYmrsResponse,
  | "id"
  | "created_at"
  | "updated_at"
  | "completed_at"
  | "total_score"
  | "severity"
  | "interpretation"
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

const SHOW_WHEN_TEST_DONE = { "==": [{ var: "test_done" }, "oui"] };

export const YMRS_SZ_QUESTIONS: Question[] = [
  {
    id: "test_done",
    text: "Passation du questionnaire fait",
    type: "single_choice",
    required: true,
    options: [
      { code: "oui", label: "Oui", score: 0 },
      { code: "non", label: "Non", score: 1 },
    ],
  },
  {
    id: "q1",
    text: "1. Elevation de l’humeur",
    type: "single_choice",
    required: true,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: "a. Absente", score: 0 },
      {
        code: 1,
        label: "b. Légèrement ou possiblement élevée lorsqu’on l’interroge",
        score: 1,
      },
      {
        code: 2,
        label:
          "c. Elévation subjective nette ; optimiste, plein d’assurance ; gai ; contenu approprié",
        score: 2,
      },
      {
        code: 3,
        label: "d. Elevée, au contenu appropriée, plaisantin",
        score: 3,
      },
      {
        code: 4,
        label: "e. Euphorique ; rires inappropriés ; chante",
        score: 4,
      },
    ],
  },
  {
    id: "q2",
    text: "2. Activité motrice et énergie augmentées",
    type: "single_choice",
    required: true,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: "a. Absente", score: 0 },
      { code: 1, label: "b. Subjectivement élevées", score: 1 },
      {
        code: 2,
        label: "c. Animé ; expression gestuelle plus élevée",
        score: 2,
      },
      {
        code: 3,
        label:
          "d. Energie excessive ; parfois hyperactif ; agité (peut être calmé)",
        score: 3,
      },
      {
        code: 4,
        label:
          "e. Excitation motrice ; hyperactivité continuelle (ne peut être calmé)",
        score: 4,
      },
    ],
  },
  {
    id: "q3",
    text: "3. Intérêt sexuel",
    type: "single_choice",
    required: true,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: "a. Normal, non augmenté", score: 0 },
      { code: 1, label: "b. Augmentation légère ou possible", score: 1 },
      {
        code: 2,
        label: "c. Clairement augmenté lorsqu’on l’interroge",
        score: 2,
      },
      {
        code: 3,
        label:
          "d. Parle spontanément de la sexualité ; élabore sur des thèmes sexuels ; se décrit comme étant hyper sexuel",
        score: 3,
      },
      {
        code: 4,
        label:
          "e. Agissements sexuels manifestes (envers les patients, les membres de l’équipe, ou l’évaluateur)",
        score: 4,
      },
    ],
  },
  {
    id: "q4",
    text: "4. Sommeil",
    type: "single_choice",
    required: true,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      {
        code: 0,
        label: "a. Ne rapporte pas de diminution de sommeil",
        score: 0,
      },
      {
        code: 1,
        label: "b. Dort jusqu’à une heure de moins que d’habitude",
        score: 1,
      },
      {
        code: 2,
        label: "c. Sommeil réduit de plus d’une heure par rapport à d’habitude",
        score: 2,
      },
      {
        code: 3,
        label: "d. Rapporte un moins grand besoin de sommeil",
        score: 3,
      },
      { code: 4, label: "e. Nie le besoin de sommeil", score: 4 },
    ],
  },
  {
    id: "q5",
    text: "5. Irritabilité",
    help: "Cet item est coté sur une échelle de 0 à 8.",
    type: "single_choice",
    required: true,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: "a. Absente", score: 0 },
      { code: 2, label: "b. Subjectivement augmentée", score: 2 },
      {
        code: 4,
        label:
          "c. Irritable par moment durant l'entretien ; épisodes récents d'énervement ou de colère dans le service",
        score: 4,
      },
      {
        code: 6,
        label: "d. Fréquemment irritable durant l'entretien ; brusque ; abrupt",
        score: 6,
      },
      {
        code: 8,
        label: "e. Hostile, non coopératif ; évaluation impossible",
        score: 8,
      },
    ],
  },
  {
    id: "q6",
    text: "6. Discours (débit et quantité)",
    help: "Cet item est coté sur une échelle de 0 à 8.",
    type: "single_choice",
    required: true,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: "a. Pas augmenté", score: 0 },
      { code: 2, label: "b. Se sent bavard", score: 2 },
      {
        code: 4,
        label:
          "c. Augmentation du débit et de la quantité par moment ; prolixe par moment",
        score: 4,
      },
      {
        code: 6,
        label:
          "d. Soutenu ; augmentation consistante du débit ou de la quantité ; difficile à interrompre",
        score: 6,
      },
      {
        code: 8,
        label: "e. Sous pression ; impossible à interrompre ; discours continu",
        score: 8,
      },
    ],
  },
  {
    id: "q7",
    text: "7. Langage - troubles de la pensée",
    type: "single_choice",
    required: true,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: "a. Absent", score: 0 },
      {
        code: 1,
        label: "b. Circonstanciel ; légère distractivité ; pensées rapides",
        score: 1,
      },
      {
        code: 2,
        label:
          "c. Distractivité ; perd le fil de ses idées ; change fréquemment de sujet ; pensées accélérées",
        score: 2,
      },
      {
        code: 3,
        label:
          "d. Fuite des idées ; réponses hors sujet ; difficile à suivre ; fait des rimes ; écholalie",
        score: 3,
      },
      { code: 4, label: "e. Incohérent ; communication impossible", score: 4 },
    ],
  },
  {
    id: "q8",
    text: "8. Contenu",
    help: "Cet item est coté sur une échelle de 0 à 8.",
    type: "single_choice",
    required: true,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: "a. Normal", score: 0 },
      {
        code: 2,
        label: "b. Projets discutables ; intérêts nouveaux",
        score: 2,
      },
      {
        code: 4,
        label: "c. Projet(s) particulier(s) ; hyper religieux",
        score: 4,
      },
      {
        code: 6,
        label: "d. Idées de grandeur ou de persécution ; idées de référence",
        score: 6,
      },
      { code: 8, label: "e. Délires ; hallucinations", score: 8 },
    ],
  },
  {
    id: "q9",
    text: "9. Comportement agressif et perturbateur",
    help: "Cet item est coté sur une échelle de 0 à 8.",
    type: "single_choice",
    required: true,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: "a. Absent, coopératif", score: 0 },
      {
        code: 2,
        label: "b. Sarcastique ; parle fort par moment, sur la défensive",
        score: 2,
      },
      {
        code: 4,
        label: "c. Exigeant ; fait des menaces dans le service",
        score: 4,
      },
      {
        code: 6,
        label: "d. Menace l'évaluateur ; crie ; évaluation difficile",
        score: 6,
      },
      {
        code: 8,
        label: "e. Agressif physiquement ; destructeur ; évaluation impossible",
        score: 8,
      },
    ],
  },
  {
    id: "q10",
    text: "10. Apparence",
    type: "single_choice",
    required: true,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: "a. Soignée et habillement adéquat", score: 0 },
      { code: 1, label: "b. Légèrement négligé", score: 1 },
      {
        code: 2,
        label: "c. Peu soigné ; modérément débraillé ; trop habillé",
        score: 2,
      },
      {
        code: 3,
        label: "d. Débraillé ; à moitié nu ; maquillage criarde",
        score: 3,
      },
      {
        code: 4,
        label: "e. Complètement négligé ; orné ; accoutrement bizarre",
        score: 4,
      },
    ],
  },
  {
    id: "q11",
    text: "11. Introspection",
    type: "single_choice",
    required: true,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      {
        code: 0,
        label:
          "a. Présente ; admet être malade ; reconnaît le besoin de traitement",
        score: 0,
      },
      { code: 1, label: "b. Eventuellement malade", score: 1 },
      {
        code: 2,
        label: "c. Admet des changements de comportement, mais nie la maladie",
        score: 2,
      },
      {
        code: 3,
        label:
          "d. Admet de possibles changements de comportement, mais nie la maladie",
        score: 3,
      },
      { code: 4, label: "e. Nie tout changement de comportement", score: 4 },
    ],
  },
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export interface QuestionnaireDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  instructions?: string;
  questions: Question[];
  metadata?: {
    singleColumn?: boolean;
    pathologies?: string[];
    target_role?: "patient" | "healthcare_professional";
    [key: string]: any;
  };
}

export const YMRS_SZ_DEFINITION: QuestionnaireDefinition = {
  id: "ymrs_sz",
  code: "YMRS_SZ",
  title: "Young Mania Rating Scale (YMRS)",
  description:
    "Échelle d'évaluation de la manie hétéro-administrée comportant 11 items.",
  instructions:
    "Guide pour attribuer des points aux items : le but de chaque item est d’estimer la sévérité de cette anomalie chez le patient. Lorsque plusieurs descriptions sont données pour un degré particulier de sévérité, une seule description est suffisante pour pouvoir attribuer ce degré. Les descriptions données sont des guides. On peut les ignorer si c’est nécessaire pour évaluer la sévérité, mais ceci doit plutôt être l’exception que la règle.",
  questions: YMRS_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ["schizophrenia"],
    target_role: "healthcare_professional",
    version: "French Version (Favre, Aubry, McQuillan, Bertschy, 2003)",
    language: "fr-FR",
  },
};

// ============================================================================
// Score Computation
// ============================================================================

export interface YmrsScoreInput {
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  q10: number;
  q11: number;
}

export function computeYmrsScore(responses: YmrsScoreInput): number {
  return (
    responses.q1 +
    responses.q2 +
    responses.q3 +
    responses.q4 +
    responses.q5 +
    responses.q6 +
    responses.q7 +
    responses.q8 +
    responses.q9 +
    responses.q10 +
    responses.q11
  );
}

// ============================================================================
// Score Interpretation
// ============================================================================

export type YmrsSeverity =
  | "Euthymie ou symptomes minimes"
  | "Symptomes maniaques legers"
  | "Symptomes maniaques moderes"
  | "Symptomes maniaques severes";

export function getYmrsSeverity(score: number): YmrsSeverity {
  if (score <= 12) return "Euthymie ou symptomes minimes";
  if (score <= 19) return "Symptomes maniaques legers";
  if (score <= 25) return "Symptomes maniaques moderes";
  return "Symptomes maniaques severes";
}

export function interpretYmrsScore(score: number): string {
  const severity = getYmrsSeverity(score);
  return `Score YMRS: ${score}/60. ${severity}.`;
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface YmrsScoringResult {
  total_score: number;
  severity: YmrsSeverity;
  interpretation: string;
}

export function scoreYmrs(responses: YmrsScoreInput): YmrsScoringResult {
  const total_score = computeYmrsScore(responses);
  const severity = getYmrsSeverity(total_score);
  const interpretation = interpretYmrsScore(total_score);

  return {
    total_score,
    severity,
    interpretation,
  };
}
