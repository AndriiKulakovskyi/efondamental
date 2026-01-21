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
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaBarnesResponseInsert = Omit<
  SchizophreniaBarnesResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Questions
// ============================================================================

export const BARNES_QUESTIONS: Question[] = [
  { id: 'barnes_instructions', text: 'Instructions', help: 'Le patient doit etre observe assis, puis debout, engage dans une conversation neutre (1 a 2 minutes dans chaque position).', type: 'instruction', required: false },
  
  // Objective rating
  { id: 'section_objective', text: 'Cotation objective', type: 'section', required: false },
  {
    id: 'q1', text: 'Cotation objective',
    help: 'Evaluation des manifestations motrices observables de l\'akathisie.',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: 'Normal. Impatiences des membres occasionnelles.', score: 0 },
      { code: 1, label: 'Presence de mouvements caracteristiques d\'impatience, presents moins de la moitie du temps d\'observation.', score: 1 },
      { code: 2, label: 'Phenomenes presents au moins la moitie du temps d\'observation.', score: 2 },
      { code: 3, label: 'Le patient a constamment des mouvements d\'agitation caracteristique.', score: 3 }
    ]
  },
  
  // Subjective rating
  { id: 'section_subjective', text: 'Cotation subjective', type: 'section', required: false },
  {
    id: 'q2', text: 'Conscience de l\'agitation',
    help: 'Evaluation de la perception subjective d\'agitation interieure.',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: 'Absence d\'impatience subjective.', score: 0 },
      { code: 1, label: 'Impression non specifique d\'agitation interieure.', score: 1 },
      { code: 2, label: 'Le patient a conscience d\'une incapacite a garder ses jambes au repos.', score: 2 },
      { code: 3, label: 'Conscience d\'un besoin compulsif intense de bouger la plupart du temps.', score: 3 }
    ]
  },
  {
    id: 'q3', text: 'Detresse relative aux impatiences',
    help: 'Evaluation du niveau de detresse causee par les symptomes.',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: 'Pas de detresse', score: 0 },
      { code: 1, label: 'Legere', score: 1 },
      { code: 2, label: 'Moyenne', score: 2 },
      { code: 3, label: 'Grave', score: 3 }
    ]
  },
  
  // Global evaluation
  { id: 'section_global', text: 'Evaluation globale de l\'akathisie', type: 'section', required: false },
  {
    id: 'q4', text: 'Evaluation globale de l\'akathisie',
    help: 'Evaluation clinique globale integrant les observations objectives et subjectives.',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: 'Absence ; Pas de sensation d\'agitation. (Note: Pseudo-akathisie si mouvements presents sans agitation subjective)', score: 0 },
      { code: 1, label: 'Douteux. Tension interieure et agitation non specifiques.', score: 1 },
      { code: 2, label: 'Legere. Conscience d\'impatiences dans les jambes et/ou sensation d\'agitation interieure. Occasionne peu ou pas de gene.', score: 2 },
      { code: 3, label: 'Moyenne. Conscience d\'une agitation associee a des mouvements caracteristiques. Responsable d\'une gene chez le patient.', score: 3 },
      { code: 4, label: 'Akathisie marquee. Impression subjective d\'agitation avec le desir compulsif de marcher ou pietiner. Manifestement eprouvante.', score: 4 },
      { code: 5, label: 'Akathisie severe. Besoin compulsif de faire les cents pas. Incapable de rester assis ou allonge plus de quelques minutes. Detresse intense et insomnie.', score: 5 }
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
