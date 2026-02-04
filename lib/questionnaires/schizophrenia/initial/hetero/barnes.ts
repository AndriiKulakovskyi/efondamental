// eFondaMental Platform - Barnes Akathisia Rating Scale
// 4-item clinician-rated scale for assessing drug-induced akathisia
// Original author: T. R. E. Barnes (1989)

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaBarnesResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1?: number | null; // Objective rating
  q2?: number | null; // Subjective awareness
  q3?: number | null; // Distress
  q4?: number | null; // Global assessment
  updated_at?: string;
  test_done?: boolean;
}

export type SchizophreniaBarnesResponseInsert = Omit<
  SchizophreniaBarnesResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Questions
// ============================================================================

const SHOW_WHEN_TEST_DONE = { '==': [{ 'var': 'test_done' }, 'oui'] };

export const BARNES_QUESTIONS: Question[] = [
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
  { id: 'barnes_instructions', text: 'Instructions', help: 'Le patient doit être observé assis, puis debout, engagé dans une conversation neutre (1. à 2. minutes dans chaque position). Les symptômes observés dans d\'autres situations, par exemple lorsque le patient est engagé dans une activité, peuvent également être', type: 'instruction', required: false, display_if: SHOW_WHEN_TEST_DONE },
  
  // Objective rating
  { id: 'section_objective', text: 'Cotation objective', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  {
    id: 'q1', text: 'Cotation objective',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0. Normal. Impatiences des membres occasionnelles.', score: 0 },
      { code: 1, label: '1. Présence de mouvements caractéristiques d\'impatience : frottement, piétinement, balancement d\'une jambe lorsqu\'il est assis et/ou balancement d\'un pied sur l\'autre ou piétinement sur place lorsqu\'il est debout mais les mouvements sont présents moins de la moitié du temps d\'observation.', score: 1 },
      { code: 2, label: '2. Phénomènes décrits ci-dessus présents au moins la moitié du temps d\'observation.', score: 2 },
      { code: 3, label: '3. Le patient a constamment des mouvements d\'agitation caractéristique et/ou est dans l\'incapacité de rester assis ou debout sans marcher ou sans piétiner.', score: 3 }
    ]
  },
  
  // Subjective rating
  { id: 'section_subjective', text: 'Cotation subjective', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  {
    id: 'q2', text: 'Conscience de l\'agitation',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0. Absence d\'impatience subjective.', score: 0 },
      { code: 1, label: '1. Impression non spécifique d\'agitation intérieure.', score: 1 },
      { code: 2, label: '2. Le patient a conscience d\'une incapacité à garder ses jambes au repos ou ressent le besoin de bouger ses jambes et/ou se plaint d\'une agitation intérieure aggravée spécifiquement lorsqu\'on lui demande de rester tranquille.', score: 2 },
      { code: 3, label: '3. Conscience d\'un besoin compulsif intense de bouger la plupart du temps et/ou rapporte une forte envie de marcher ou piétiner la plupart du temps.', score: 3 }
    ]
  },
  {
    id: 'q3', text: 'Détresse relative aux impatiences',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0. Pas de détresse', score: 0 },
      { code: 1, label: '1. Légère', score: 1 },
      { code: 2, label: '2. Moyenne', score: 2 },
      { code: 3, label: '3. Grave', score: 3 }
    ]
  },
  
  // Global evaluation
  { id: 'section_global', text: 'Evaluation globale de l\'akathisie', type: 'section', required: false, display_if: SHOW_WHEN_TEST_DONE },
  {
    id: 'q4', text: 'Evaluation globale de l\'akathisie',
    type: 'single_choice', required: false,
    display_if: SHOW_WHEN_TEST_DONE,
    options: [
      { code: 0, label: '0. Absence ; Pas de sensation d\'agitation ou d\'impatience. La présence de mouvements caractéristiques d\'akathisie en l\'absence d\'impression subjective d\'agitation intérieure ou de besoin compulsif de bouger les jambes doit être considérée comme une pseudo-akathisie.', score: 0 },
      { code: 1, label: '1. Douteux. Tension intérieure et agitation non spécifiques.', score: 1 },
      { code: 2, label: '2. Légère. Conscience d\'impatiences dans les jambes et/ou sensation d\'agitation intérieure aggravée lors de la station debout au repos. L\'agitation est présente mais les mouvements caractéristiques peuvent manquer. Occasionne peu ou pas de gêne.', score: 2 },
      { code: 3, label: '3. Moyenne. Conscience d\'une agitation associée à des mouvements caractéristiques comme le balancement d\'un pied sur l\'autre en station debout. Responsable d\'une gêne chez le patient.', score: 3 },
      { code: 4, label: '4. Akathisie marquée. Impression subjective d\'agitation avec le désir compulsif de marcher ou piétiner. Le patient peut néanmoins rester assis au moins 5 minutes. Manifestement éprouvante pour le patient.', score: 4 },
      { code: 5, label: '5. Akathisie sévère. Le patient rapporte un besoin compulsif de faire les cents pas la plupart du temps; Incapable de rester assis ou allongé plus de quelques minutes. Agitation permanente associée à une détresse intense et une insomnie.', score: 5 }
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

export const BARNES_DEFINITION: QuestionnaireDefinition = {
  id: 'barnes',
  code: 'BARNES',
  title: 'BARNES - Echelle d\'akathisie de Barnes',
  description: 'Echelle a 4 items pour evaluer l\'akathisie induite par les medicaments. Auteur: T. R. E. Barnes (1989).',
  questions: BARNES_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'Original (Barnes, 1989)',
    language: 'fr-FR'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

export function interpretBarnesGlobal(score: number): string {
  switch (score) {
    case 0: return 'Absent';
    case 1: return 'Questionable';
    case 2: return 'Mild akathisia';
    case 3: return 'Moderate akathisia';
    case 4: return 'Marked akathisia';
    case 5: return 'Severe akathisia';
    default: return 'Unknown';
  }
}

export function hasBarnesAkathisia(globalScore: number): boolean {
  return globalScore >= 2;
}
