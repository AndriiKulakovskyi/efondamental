// eFondaMental Platform - AIMS (Abnormal Involuntary Movement Scale)
// 12-item clinician-rated scale for assessing tardive dyskinesia
// Source: National Institute of Mental Health (NIMH), 1976

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaAimsResponse {
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
  q11?: number | null;
  q12?: number | null;
  orofacial_score?: number | null;
  extremity_score?: number | null;
  trunk_score?: number | null;
  total_score?: number | null;
  test_done?: boolean;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaAimsResponseInsert = Omit<
  SchizophreniaAimsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'orofacial_score' | 'extremity_score' | 'trunk_score' | 'total_score'
>;

// ============================================================================
// Response Options
// ============================================================================

const AIMS_MOVEMENT_OPTIONS = [
  { code: 0, label: 'Aucun', score: 0 },
  { code: 1, label: 'Minime : peut-être normal', score: 1 },
  { code: 2, label: 'Léger', score: 2 },
  { code: 3, label: 'Moyen', score: 3 },
  { code: 4, label: 'Grave', score: 4 }
];

const AIMS_AWARENESS_OPTIONS = [
  { code: 0, label: 'Aucune conscience', score: 0 },
  { code: 1, label: 'Conscience : pas de gêne', score: 1 },
  { code: 2, label: 'Conscience : gêne légère', score: 2 },
  { code: 3, label: 'Conscience : gêne modérée', score: 3 },
  { code: 4, label: 'Conscience : détresse grave', score: 4 }
];

const AIMS_BINARY_OPTIONS = [
  { code: 0, label: 'Oui', score: 0 },
  { code: 1, label: 'Non', score: 1 }
];

// ============================================================================
// Questions
// ============================================================================

const SHOW_WHEN_TEST_DONE = { '==': [{ 'var': 'test_done' }, 'oui'] };

export const AIMS_QUESTIONS: Question[] = [
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
  { id: 'aims_instructions', text: 'Instructions', help: 'Veuillez observer le patient dans differentes positions et situations standardisees. Evaluer la severite des mouvements involontaires anormaux.', type: 'instruction', required: false, display_if: SHOW_WHEN_TEST_DONE },
  
  // Orofacial movements (items 1-4)
  { id: 'section_orofacial', text: 'Mouvements orofaciaux', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  { id: 'q1', text: '1. Muscles d\'expression faciale. Par exemple : mouvements du front, des sourcils, de la région péri orbitale, des joues; inclure le froncement des sourcils le clignement des paupières le sourire et les grimaces.', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: AIMS_MOVEMENT_OPTIONS },
  { id: 'q2', text: '2. Lèvres et région péri orale. Par exemple : plissement, avancement des lèvres, moue, claquement des lèvres.', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: AIMS_MOVEMENT_OPTIONS },
  { id: 'q3', text: '3. Mâchoires. Par exemple : mordre, serrer les dents, mâchonnement, ouverture de la bouche, mouvement latéraux.', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: AIMS_MOVEMENT_OPTIONS },
  { id: 'q4', text: '4. Langue. N\'évaluer que l\'augmentation du mouvement à l\'intérieur et à l\'extérieur de la bouche et NON l\'incapacité de maintenir le mouvement.', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: AIMS_MOVEMENT_OPTIONS },
  
  // Extremity movements (items 5-6)
  { id: 'section_extremities', text: 'Mouvements des extrémités', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  { id: 'q5', text: '5. Membres supérieurs (bras, poignet, main, bras, doigts). Inclure les mouvements choréiques (c.à.d. rapides, sans but objectif, irréguliers, spontanés), les mouvements athétoïdes.', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: AIMS_MOVEMENT_OPTIONS },
  { id: 'q6', text: '6. Membres inférieurs (jambes, genoux, chevilles, doigts de pied). Par exemple mouvements latéraux des genoux, tapotement du pied, frapper du talon inversion et éversion du pied, enroulement du pied.', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: AIMS_MOVEMENT_OPTIONS },
  
  // Trunk movements (item 7)
  { id: 'section_trunk', text: 'Mouvements du tronc', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  { id: 'q7', text: '7. Cou, épaules, hanches. Par exemple : dandinement, balancement, tortillement, rotation pelvienne, torsion', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: AIMS_MOVEMENT_OPTIONS },
  
  // Global judgments (items 8-10)
  { id: 'section_global', text: 'Jugements globaux', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  { id: 'q8', text: '8. Gravité des mouvements anormaux', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: AIMS_MOVEMENT_OPTIONS },
  { id: 'q9', text: '9. Incapacité due à des mouvements anormaux', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: AIMS_MOVEMENT_OPTIONS },
  { id: 'q10', text: '10. Conscience du malade des mouvements anormaux. N’évaluer que ce que rapporte le malade', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: AIMS_AWARENESS_OPTIONS },
  
  // Dental status (items 11-12)
  { id: 'section_dental', text: 'État de la dentition', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  { id: 'q11', text: '11. Problèmes actuels des dents et/ou de prothèses dentaires', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: AIMS_BINARY_OPTIONS },
  { id: 'q12', text: '12. Le malade porte t-il généralement des prothèses dentaires', type: 'single_choice', required: false, display_if: SHOW_WHEN_TEST_DONE, options: AIMS_BINARY_OPTIONS }
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

export const AIMS_DEFINITION: QuestionnaireDefinition = {
  id: 'aims',
  code: 'AIMS',
  title: 'AIMS - Echelle des mouvements involontaires anormaux',
  description: 'Echelle a 12 items pour evaluer les dyskinesies tardives et autres mouvements involontaires anormaux associes aux antipsychotiques. Source: NIMH (1976).',
  questions: AIMS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'Original (NIMH, 1976)',
    language: 'fr-FR'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

export function computeAimsScores(response: Partial<SchizophreniaAimsResponse>): {
  orofacial: number;
  extremity: number;
  trunk: number;
  total: number;
} {
  const orofacial = [response.q1, response.q2, response.q3, response.q4]
    .filter((v): v is number => v !== null && v !== undefined)
    .reduce((sum, v) => sum + v, 0);
  
  const extremity = [response.q5, response.q6]
    .filter((v): v is number => v !== null && v !== undefined)
    .reduce((sum, v) => sum + v, 0);
  
  const trunk = response.q7 || 0;
  
  return {
    orofacial,
    extremity,
    trunk,
    total: orofacial + extremity + trunk
  };
}

export function hasAimsPositiveFindings(response: Partial<SchizophreniaAimsResponse>): boolean {
  // Positive for tardive dyskinesia if any item 1-7 has score >= 2
  // or if any two items 1-7 have score >= 2
  const items = [response.q1, response.q2, response.q3, response.q4, response.q5, response.q6, response.q7];
  const validItems = items.filter((v): v is number => v !== null && v !== undefined);
  const moderateItems = validItems.filter(v => v >= 2);
  return moderateItems.length >= 1;
}
