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
  { code: 1, label: 'Minime: peut-etre normal', score: 1 },
  { code: 2, label: 'Leger', score: 2 },
  { code: 3, label: 'Moyen', score: 3 },
  { code: 4, label: 'Grave', score: 4 }
];

const AIMS_AWARENESS_OPTIONS = [
  { code: 0, label: 'Aucune conscience', score: 0 },
  { code: 1, label: 'Conscience: pas de gene', score: 1 },
  { code: 2, label: 'Conscience: gene legere', score: 2 },
  { code: 3, label: 'Conscience: gene moderee', score: 3 },
  { code: 4, label: 'Conscience: detresse grave', score: 4 }
];

const AIMS_BINARY_OPTIONS = [
  { code: 0, label: 'Oui', score: 0 },
  { code: 1, label: 'Non', score: 1 }
];

// ============================================================================
// Questions
// ============================================================================

export const AIMS_QUESTIONS: Question[] = [
  { id: 'aims_instructions', text: 'Instructions', help: 'Veuillez observer le patient dans differentes positions et situations standardisees. Evaluer la severite des mouvements involontaires anormaux.', type: 'instruction', required: false },
  
  // Orofacial movements (items 1-4)
  { id: 'section_orofacial', text: 'Mouvements orofaciaux', type: 'section', required: false },
  { id: 'q1', text: '1. Muscles d\'expression faciale', help: 'Mouvements du front, des sourcils, de la region peri orbitale, des joues.', type: 'single_choice', required: false, options: AIMS_MOVEMENT_OPTIONS },
  { id: 'q2', text: '2. Levres et region peri orale', help: 'Plissement, avancement des levres, moue, claquement des levres.', type: 'single_choice', required: false, options: AIMS_MOVEMENT_OPTIONS },
  { id: 'q3', text: '3. Machoires', help: 'Mordre, serrer les dents, machonnement, ouverture de la bouche, mouvement lateraux.', type: 'single_choice', required: false, options: AIMS_MOVEMENT_OPTIONS },
  { id: 'q4', text: '4. Langue', help: 'N\'evaluer que l\'augmentation du mouvement a l\'interieur et a l\'exterieur de la bouche.', type: 'single_choice', required: false, options: AIMS_MOVEMENT_OPTIONS },
  
  // Extremity movements (items 5-6)
  { id: 'section_extremities', text: 'Mouvements des extremites', type: 'section', required: false },
  { id: 'q5', text: '5. Membres superieurs', help: 'Bras, poignet, main, doigts. Inclure les mouvements choreiques et athetoïdes.', type: 'single_choice', required: false, options: AIMS_MOVEMENT_OPTIONS },
  { id: 'q6', text: '6. Membres inferieurs', help: 'Jambes, genoux, chevilles, doigts de pied.', type: 'single_choice', required: false, options: AIMS_MOVEMENT_OPTIONS },
  
  // Trunk movements (item 7)
  { id: 'section_trunk', text: 'Mouvements du tronc', type: 'section', required: false },
  { id: 'q7', text: '7. Cou, epaules, hanches', help: 'Dandinement, balancement, tortillement, rotation pelvienne, torsion.', type: 'single_choice', required: false, options: AIMS_MOVEMENT_OPTIONS },
  
  // Global judgments (items 8-10)
  { id: 'section_global', text: 'Jugements globaux', type: 'section', required: false },
  { id: 'q8', text: '8. Gravite des mouvements anormaux', help: 'Evaluation globale de la severite.', type: 'single_choice', required: false, options: AIMS_MOVEMENT_OPTIONS },
  { id: 'q9', text: '9. Incapacite due a des mouvements anormaux', help: 'Degre d\'incapacite fonctionnelle causee.', type: 'single_choice', required: false, options: AIMS_MOVEMENT_OPTIONS },
  { id: 'q10', text: '10. Conscience du malade des mouvements anormaux', help: 'N\'evaluer que ce que rapporte le malade.', type: 'single_choice', required: false, options: AIMS_AWARENESS_OPTIONS },
  
  // Dental status (items 11-12)
  { id: 'section_dental', text: 'Etat de la dentition', type: 'section', required: false },
  { id: 'q11', text: '11. Problemes actuels des dents et/ou de protheses dentaires', type: 'single_choice', required: false, options: AIMS_BINARY_OPTIONS },
  { id: 'q12', text: '12. Le malade porte-t-il generalement des protheses dentaires', type: 'single_choice', required: false, options: AIMS_BINARY_OPTIONS }
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
