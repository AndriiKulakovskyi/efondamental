// eFondaMental Platform - Simpson-Angus Scale (SAS)
// 10-item clinician-rated scale for assessing drug-induced parkinsonism
// Original authors: Simpson GM, Angus JWS (1970)

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaSasResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  q5?: number | null;
  q6?: number | null;
  q7?: number | null;
  q8?: number | null;
  q9?: number | null;
  q10?: number | null;
  total_score?: number | null;
  mean_score?: number | null;
  test_done?: boolean;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaSasResponseInsert = Omit<
  SchizophreniaSasResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'mean_score'
>;

// ============================================================================
// Questions
// ============================================================================

const SHOW_WHEN_TEST_DONE = { '==': [{ 'var': 'test_done' }, 'oui'] };

export const SAS_QUESTIONS: Question[] = [
  {
    id: 'test_done',
    text: 'Passation du questionnaire fait',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui', score: 0 },
      { code: 'non', label: 'Non', score: 1 }
    ]
  },
  { id: 'sas_instructions', text: 'Instructions', help: 'L\'examinateur effectue une serie de tests physiques et d\'observations pour evaluer les signes extrapyramidaux. Le score total est la moyenne des 10 items (somme / 10).', type: 'instruction', required: false, display_if: SHOW_WHEN_TEST_DONE },
  
  {
    id: 'q1', text: '1. Demarche',
    help: 'Le patient est examine pendant qu\'il marche dans la salle d\'examen.',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: 'Normal', score: 0 },
      { code: 1, label: 'Diminution du ballant des bras a la marche', score: 1 },
      { code: 2, label: 'Diminution importante du ballant avec une evidente rigidite des bras', score: 2 },
      { code: 3, label: 'Demarche raide, les bras maintenus de maniere rigide devant l\'abdomen', score: 3 },
      { code: 4, label: 'Demarche voutee, traine les pieds. Progresse par propulsion et retropulsion', score: 4 }
    ]
  },
  {
    id: 'q2', text: '2. Chute des bras',
    help: 'Le patient et l\'examinateur levent tous les deux les bras jusqu\'a la hauteur des epaules et les laissent tomber sur les cotes.',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: 'Normal. Chute libre avec fort claquement et rebond', score: 0 },
      { code: 1, label: 'Chute legerement ralentie avec contact moins audible et petit rebond', score: 1 },
      { code: 2, label: 'Chute ralentie. Pas de rebond', score: 2 },
      { code: 3, label: 'Chute tres ralentie. Pas de claquement du tout', score: 3 },
      { code: 4, label: 'Les bras tombent comme une resistance', score: 4 }
    ]
  },
  {
    id: 'q3', text: '3. Mouvements passifs de l\'epaule',
    help: 'Les coudes sont maintenus flechis a angle droit et les bras sont pris l\'un apres l\'autre par l\'examinateur.',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: 'Normal', score: 0 },
      { code: 1, label: 'Rigidite et resistance legeres', score: 1 },
      { code: 2, label: 'Resistance et rigidite moyennes', score: 2 },
      { code: 3, label: 'Rigidite importante. Mouvements passifs difficiles', score: 3 },
      { code: 4, label: 'Resistance et rigidite extremes avec une epaule presque gelee', score: 4 }
    ]
  },
  {
    id: 'q4', text: '4. Rigidite du coude',
    help: 'Les deux articulations du coude sont maintenues l\'une apres l\'autre a angle droit puis etendues, flechies d\'une maniere passive.',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: 'Normal', score: 0 },
      { code: 1, label: 'Rigidite et resistance legeres', score: 1 },
      { code: 2, label: 'Resistance et rigidite moyennes', score: 2 },
      { code: 3, label: 'Rigidite importante. Mouvements passifs difficiles', score: 3 },
      { code: 4, label: 'Resistance et rigidite extremes', score: 4 }
    ]
  },
  {
    id: 'q5', text: '5. Maintien des attitudes ou rigidite du poignet',
    help: 'Le poignet est tenu d\'une main et les doigts sont tenus par l\'autre main de l\'examinateur.',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: 'Normal', score: 0 },
      { code: 1, label: 'Rigidite et resistance legeres', score: 1 },
      { code: 2, label: 'Resistance et rigidite moyennes', score: 2 },
      { code: 3, label: 'Rigidite importante. Mouvements passifs difficiles', score: 3 },
      { code: 4, label: 'Resistance et rigidite extremes', score: 4 }
    ]
  },
  {
    id: 'q6', text: '6. Mouvement pendulaire de la jambe',
    help: 'Le patient s\'assoit sur une table avec les jambes pendantes et bougeant librement.',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: 'La jambe balance librement', score: 0 },
      { code: 1, label: 'Legere diminution du ballant des jambes', score: 1 },
      { code: 2, label: 'Resistance au ballant moyenne', score: 2 },
      { code: 3, label: 'Resistance et limitation du ballant importantes', score: 3 },
      { code: 4, label: 'Absence complete de ballant', score: 4 }
    ]
  },
  {
    id: 'q7', text: '7. Chute de la tete',
    help: 'Le patient s\'allonge sur une table d\'examen bien rembourree et l\'examinateur souleve la tete du patient.',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: 'La tete tombe completement avec un bruit distinct', score: 0 },
      { code: 1, label: 'Leger ralentissement dans la chute de la tete', score: 1 },
      { code: 2, label: 'Ralentissement modere de la chute', score: 2 },
      { code: 3, label: 'La tete tombe avec resistance et lentement', score: 3 },
      { code: 4, label: 'La tete n\'atteint pas la table d\'examen', score: 4 }
    ]
  },
  {
    id: 'q8', text: '8. Percussion de la glabelle (reflexe naso-palpebral)',
    help: 'On demande au sujet d\'ouvrir grand les yeux et de ne pas cligner des yeux. La glabelle est tapee doucement.',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0-5 clignements', score: 0 },
      { code: 1, label: '6-10 clignements', score: 1 },
      { code: 2, label: '11-15 clignements', score: 2 },
      { code: 3, label: '16-20 clignements', score: 3 },
      { code: 4, label: '21 clignements et plus', score: 4 }
    ]
  },
  {
    id: 'q9', text: '9. Tremblement',
    help: 'Le patient est observe lorsqu\'il entre dans la salle d\'examen puis il est reexamine.',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: 'Normal', score: 0 },
      { code: 1, label: 'Leger tremblement des doigts', score: 1 },
      { code: 2, label: 'Tremblement de la main ou du bras apparaissant de facon intermittente', score: 2 },
      { code: 3, label: 'Tremblements persistant d\'un ou de plusieurs membres', score: 3 },
      { code: 4, label: 'Tremblements de tout le corps', score: 4 }
    ]
  },
  {
    id: 'q10', text: '10. Salivation',
    help: 'Le patient est observe quand il parle. On lui demande d\'ouvrir la bouche et de soulever la langue.',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: 'Normal', score: 0 },
      { code: 1, label: 'Salivation excessive au point qu\'une flaque apparait si la bouche est ouverte', score: 1 },
      { code: 2, label: 'L\'exces de salivation est present et peut parfois gener la parole', score: 2 },
      { code: 3, label: 'Parole difficile en raison d\'un exces de salivation', score: 3 },
      { code: 4, label: 'Franc bavage', score: 4 }
    ]
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

export const SAS_DEFINITION: QuestionnaireDefinition = {
  id: 'sas',
  code: 'SAS',
  title: 'SAS - Echelle des effets secondaires extrapyramidaux',
  description: 'Echelle a 10 items pour evaluer le parkinsonisme medicamenteux et les effets secondaires extrapyramidaux (EPS). Auteurs: Simpson GM, Angus JWS (1970).',
  questions: SAS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'Original (Simpson & Angus, 1970)',
    language: 'fr-FR'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

export function computeSasScores(response: Partial<SchizophreniaSasResponse>): {
  total: number;
  mean: number;
} {
  const items = [response.q1, response.q2, response.q3, response.q4, response.q5, response.q6, response.q7, response.q8, response.q9, response.q10];
  const validItems = items.filter((v): v is number => v !== null && v !== undefined);
  const total = validItems.reduce((sum, v) => sum + v, 0);
  const mean = validItems.length > 0 ? total / validItems.length : 0;
  return { total, mean: Math.round(mean * 100) / 100 };
}

export function interpretSasMean(mean: number): string {
  if (mean < 0.3) return 'No parkinsonism';
  if (mean < 1.0) return 'Mild parkinsonism';
  if (mean < 2.0) return 'Moderate parkinsonism';
  return 'Severe parkinsonism';
}

export function hasSasPositiveFindings(mean: number): boolean {
  return mean >= 0.3;
}
