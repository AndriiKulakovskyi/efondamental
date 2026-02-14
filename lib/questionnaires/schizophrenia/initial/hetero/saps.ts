// eFondaMental Platform - SAPS (Scale for the Assessment of Positive Symptoms)
// Clinician-rated scale for assessing positive symptoms in schizophrenia
// Original author: N.C. Andreasen
// French translation: P. Boyer and Y. Lecrubier

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaSapsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  test_done?: number | boolean | null;
  // Hallucinations (items 1-7)
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  q5?: number | null;
  q6?: number | null;
  q7?: number | null;
  // Delusions (items 8-20)
  q8?: number | null;
  q9?: number | null;
  q10?: number | null;
  q11?: number | null;
  q12?: number | null;
  q13?: number | null;
  q14?: number | null;
  q15?: number | null;
  q16?: number | null;
  q17?: number | null;
  q18?: number | null;
  q19?: number | null;
  q20?: number | null;
  // Bizarre Behavior (items 21-25)
  q21?: number | null;
  q22?: number | null;
  q23?: number | null;
  q24?: number | null;
  q25?: number | null;
  // Positive Formal Thought Disorder (items 26-34)
  q26?: number | null;
  q27?: number | null;
  q28?: number | null;
  q29?: number | null;
  q30?: number | null;
  q31?: number | null;
  q32?: number | null;
  q33?: number | null;
  q34?: number | null;
  // Scores
  subscores_sum?: number | null;
  global_evaluations_score?: number | null;
  total_score?: number | null;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaSapsResponseInsert = Omit<
  SchizophreniaSapsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Response Options
// ============================================================================

const SAPS_RATING_OPTIONS = [
  { code: 0, label: '0 - absente - aucun(e) - inexistant', score: 0 },
  { code: 1, label: '1 - doute (sur une diminution) - discutable', score: 1 },
  { code: 2, label: '2 - léger(e)', score: 2 },
  { code: 3, label: '3 - moyen(ne)', score: 3 },
  { code: 4, label: '4 - important(e)', score: 4 },
  { code: 5, label: '5 - sévère - grave', score: 5 }
];

// ============================================================================
// Questions
// ============================================================================

const SHOW_WHEN_TEST_DONE = { '==': [{ 'var': 'test_done' }, 1] };

export const SAPS_QUESTIONS: Question[] = [
  {
    id: 'test_done',
    text: 'Passation du questionnaire',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Fait', score: 1 },
      { code: 0, label: 'Non fait', score: 0 }
    ]
  },

  // ============================================================================
  // HALLUCINATIONS
  // ============================================================================
  {
    id: 'section_hallucinations',
    text: 'HALLUCINATIONS',
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'q1',
    text: '1 - Hallucinations auditives',
    help: "Le malade rapporte qu'il a entendu des voix, des bruits ou d'autres sons que personne d'autre n'a entendus.",
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q2',
    text: '2 - Commentaires des actes et de la pensée',
    help: 'Le malade fait mention d\'une voix qui commente son comportement et ses pensées.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q3',
    text: '3 - Hallucinations de conversation',
    help: 'Le malade rapporte qu\'il a entendu deux ou plusieurs voix parler entre elles.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q4',
    text: '4 - Hallucinations somatiques ou tactiles',
    help: 'Le malade fait mention de sensations physiques bizarres au niveau de son corps.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q5',
    text: '5 - Hallucinations olfactives',
    help: 'Le malade sent des odeurs inhabituelles que personne d\'autre n\'a remarquées.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q6',
    text: '6 - Hallucinations visuelles',
    help: 'Le malade voit des formes ou des personnes qui ne sont pas réellement présentes.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q7',
    text: '7 - Evaluation globale de l\'importance des hallucinations',
    help: 'Cette évaluation doit prendre en compte la durée et la sévérité des hallucinations et leur retentissement sur la vie du patient.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },

  // ============================================================================
  // IDEES DELIRANTES
  // ============================================================================
  {
    id: 'section_delusions',
    text: 'IDEES DELIRANTES',
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'q8',
    text: '8 - Idées délirantes de persécution',
    help: 'Le malade pense qu\'il est, d\'une façon ou d\'une autre, persécuté ou victime d\'un complot.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q9',
    text: '9 - Idées délirantes de jalousie',
    help: 'Le malade pense que son conjoint a une relation amoureuse avec quelqu\'un d\'autre.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q10',
    text: '10 - Idées délirantes de culpabilité ou de péché',
    help: 'Le malade croit qu\'il a commis un terrible péché ou fait quelque chose d\'impardonnable.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q11',
    text: '11 - Idées délirantes de grandeur',
    help: 'Le malade pense qu\'il est détenteur de pouvoirs spéciaux ou doué de capacités exceptionnelles.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q12',
    text: '12 - Idées délirantes religieuses',
    help: 'Le malade est préoccupé par des croyances erronées de nature religieuse.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q13',
    text: '13 - Idées délirantes somatiques',
    help: 'Le patient est convaincu que d\'une façon ou d\'une autre son corps est malade, anormal ou modifié.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q14',
    text: '14 - Idées de référence, idées délirantes de référence',
    help: 'Le malade a le sentiment que des remarques ou des événements sans importance le concernent ou possèdent une signification spéciale.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q15',
    text: '15 - Idées délirantes d\'influence',
    help: 'Le malade a le sentiment que ses impressions ou ses actions sont contrôlées par une force extérieure.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q16',
    text: '16 - Idées délirantes de lecture de la pensée',
    help: 'Le malade croit que les autres sont capables de lire ou de connaître ses pensées.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q17',
    text: '17 - Divulgation de la pensée',
    help: 'Le malade croit que ses pensées sont divulguées de telle sorte que lui-même ou les autres peut ou peuvent l\'entendre.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q18',
    text: '18 - Idées délirantes de pensée imposée',
    help: 'Le malade croit que des pensées qui ne sont pas les siennes ont été introduites dans son cerveau.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q19',
    text: '19 - Idées délirantes de vol de la pensée',
    help: 'Le malade pense que des pensées lui ont été dérobées.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q20',
    text: '20 - Evaluation globale de la sévérité des idées délirantes',
    help: 'L\'évaluation globale doit prendre en compte la durée et la persistance des idées délirantes et leur retentissement sur la vie du malade.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },

  // ============================================================================
  // COMPORTEMENT BIZARRE
  // ============================================================================
  {
    id: 'section_bizarre_behavior',
    text: 'COMPORTEMENT BIZARRE',
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'q21',
    text: '21 - Habillement et présentation',
    help: 'Le malade s\'habille de façon inhabituelle ou fait des choses étranges pour modifier son apparence.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q22',
    text: '22 - Conduite sociale et sexuelle',
    help: 'Le malade se comporte d\'une façon inappropriée par rapport aux normes sociales en cours (par exemple se masturbe en public).',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q23',
    text: '23 - Comportement agressif ou agité',
    help: 'Le malade peut être agressif, agité de façon souvent imprévisible.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q24',
    text: '24 - Comportement répétitif ou stéréotypé',
    help: 'Le malade met en place des séries d\'actions ou de rituels répétitifs qu\'il est obligé de faire et refaire.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q25',
    text: '25 - Evaluation globale de la sévérité du comportement bizarre',
    help: 'Cette évaluation doit prendre en compte le type de comportement et sa déviance par rapport aux normes sociales.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },

  // ============================================================================
  // TROUBLE POSITIF DE LA PENSEE FORMELLE
  // ============================================================================
  {
    id: 'section_thought_disorder',
    text: 'TROUBLE POSITIF DE LA PENSEE FORMELLE',
    type: 'section',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },
  {
    id: 'q26',
    text: '26 - Relâchement des associations',
    help: 'Modalité de discours où les idées dévient vers d\'autres sujets n\'ayant avec elles que des rapports lointains (voire inexistants).',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q27',
    text: '27 - Tangentialité',
    help: 'Façon de répondre à une question de manière indirecte ou inappropriée.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q28',
    text: '28 - Incohérence (salade de mots, schizophasie)',
    help: 'Type de discours qui, à certains moments, est fondamentalement incompréhensible.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q29',
    text: '29 - Pensée illogique',
    help: 'Type de discours où les articulations n\'ont pas d\'organisation logique.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q30',
    text: '30 - Discours (pensée) circonlocutoire (digressive)',
    help: 'Type de discours prenant des voies très indirectes et tardant à atteindre son objectif.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q31',
    text: '31 - Logorrhée',
    help: 'Le discours du patient est rapide et difficile à interrompre ; la quantité de discours produite spontanément est plus importante que de coutume.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q32',
    text: '32 - Distractibilité du discours',
    help: 'Le patient est distrait par des stimuli de l\'environnement qui interrompent son discours.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q33',
    text: '33 - Associations par assonances',
    help: 'Type de discours dans lequel ce sont les sons plutôt que les relations sémantiques qui gouvernent le choix des mots.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  },
  {
    id: 'q34',
    text: '34 - Evaluation globale du trouble positif de la pensée formelle',
    help: 'Cette évaluation doit prendre en compte la fréquence de l\'anomalie et son retentissement sur la capacité du patient à communiquer.',
    type: 'single_choice',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: SAPS_RATING_OPTIONS
  }
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
    target_role?: 'patient' | 'healthcare_professional';
    [key: string]: any;
  };
}

export const SAPS_DEFINITION: QuestionnaireDefinition = {
  id: 'saps',
  code: 'SAPS',
  title: 'SAPS - Échelle d\'évaluation des symptômes positifs',
  description: 'Échelle d\'évaluation des symptômes positifs de la schizophrénie (Scale for the Assessment of Positive Symptoms). Auteur original: N.C. Andreasen. Traduction française: P. Boyer et Y. Lecrubier.',
  questions: SAPS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'French Translation (P. Boyer & Y. Lecrubier)',
    language: 'fr-FR'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

export function computeSapsScores(response: Partial<SchizophreniaSapsResponse>): {
  hallucinations_subscore: number | null;
  delusions_subscore: number | null;
  bizarre_behavior_subscore: number | null;
  thought_disorder_subscore: number | null;
  subscores_sum: number | null;
  global_evaluations_score: number | null;
  total_score: number | null;
} {
  // Helper function to sum values, returns null if any value is null
  const sumIfComplete = (values: (number | null | undefined)[]): number | null => {
    const validValues = values.filter((v): v is number => v !== null && v !== undefined);
    if (validValues.length !== values.length) return null;
    return validValues.reduce((sum, v) => sum + v, 0);
  };

  // Hallucinations subscore: sum of items 1-6 (excluding global assessment item 7)
  const hallucinations_subscore = sumIfComplete([
    response.q1, response.q2, response.q3, response.q4, response.q5, response.q6
  ]);

  // Delusions subscore: sum of items 8-19 (excluding global assessment item 20)
  const delusions_subscore = sumIfComplete([
    response.q8, response.q9, response.q10, response.q11, response.q12, response.q13,
    response.q14, response.q15, response.q16, response.q17, response.q18, response.q19
  ]);

  // Bizarre behavior subscore: sum of items 21-24 (excluding global assessment item 25)
  const bizarre_behavior_subscore = sumIfComplete([
    response.q21, response.q22, response.q23, response.q24
  ]);

  // Thought disorder subscore: sum of items 26-33 (excluding global assessment item 34)
  const thought_disorder_subscore = sumIfComplete([
    response.q26, response.q27, response.q28, response.q29, response.q30,
    response.q31, response.q32, response.q33
  ]);

  // Sum of sub-scores (sum of the 4 subscores above)
  const subscores_sum =
    hallucinations_subscore !== null &&
    delusions_subscore !== null &&
    bizarre_behavior_subscore !== null &&
    thought_disorder_subscore !== null
      ? hallucinations_subscore + delusions_subscore + bizarre_behavior_subscore + thought_disorder_subscore
      : null;

  // Global evaluations score: sum of items 7, 20, 25, 34
  const global_evaluations_score = sumIfComplete([
    response.q7, response.q20, response.q25, response.q34
  ]);

  // Total score: sum of all items 1-34
  const total_score = sumIfComplete([
    response.q1, response.q2, response.q3, response.q4, response.q5, response.q6, response.q7,
    response.q8, response.q9, response.q10, response.q11, response.q12, response.q13, response.q14, response.q15, response.q16, response.q17, response.q18, response.q19, response.q20,
    response.q21, response.q22, response.q23, response.q24, response.q25,
    response.q26, response.q27, response.q28, response.q29, response.q30, response.q31, response.q32, response.q33, response.q34
  ]);

  return {
    hallucinations_subscore,
    delusions_subscore,
    bizarre_behavior_subscore,
    thought_disorder_subscore,
    subscores_sum,
    global_evaluations_score,
    total_score
  };
}
