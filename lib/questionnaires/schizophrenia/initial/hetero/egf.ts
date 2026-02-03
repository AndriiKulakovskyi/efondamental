// eFondaMental Platform - EGF (Echelle Globale de Fonctionnement)
// Schizophrenia Initial Evaluation - Hetero Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaEgfResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  egf_score: number;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaEgfResponseInsert = Omit<
  SchizophreniaEgfResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const EGF_SZ_QUESTIONS: Question[] = [
  {
    id: 'egf_score',
    text: 'Score a l\'echelle EGF',
    help: `Consignes : Evaluer le fonctionnement psychologique, social et professionnel. Ne pas tenir compte d'un handicap du a des facteurs physiques ou environnementaux.

GUIDE DE COTATION :
100-91 : Niveau superieur de fonctionnement dans une grande variete d'activite.
90-81 : Symptomes absents ou minimes, fonctionnement satisfaisant dans tous les domaines.
80-71 : Si des symptomes sont presents, ils sont transitoires.
70-61 : Quelques symptomes legers ou une certaine difficulte dans le fonctionnement.
60-51 : Symptomes d'intensite moyenne ou difficultes d'intensite moyenne.
50-41 : Symptomes importants ou handicap important.
40-31 : Existence d'une certaine alteration du sens de la realite ou handicap majeur.
30-21 : Le comportement est notablement influence par des idees delirantes ou des hallucinations.
20-11 : Existence d'un certain danger d'auto ou d'hetero-agression.
10-1 : Danger persistant d'hetero-agression grave.`,
    type: 'number',
    required: true,
    min: 1,
    max: 100
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

export const EGF_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'egf_sz',
  code: 'EGF_SZ',
  title: 'Echelle Globale de Fonctionnement (EGF)',
  description: 'Evaluation du fonctionnement psychologique, social et professionnel sur un continuum hypothetique allant de la sante mentale a la maladie.',
  questions: EGF_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'Standard',
    language: 'fr-FR'
  }
};

// ============================================================================
// Score Interpretation
// ============================================================================

export type EgfLevel = 
  | 'Niveau superieur de fonctionnement'
  | 'Symptomes absents ou minimes'
  | 'Symptomes transitoires'
  | 'Symptomes legers'
  | 'Symptomes d\'intensite moyenne'
  | 'Symptomes importants'
  | 'Alteration du sens de la realite'
  | 'Comportement influence par delires/hallucinations'
  | 'Danger d\'auto ou d\'hetero-agression'
  | 'Danger persistant d\'hetero-agression grave';

export function getEgfLevel(score: number): EgfLevel {
  if (score >= 91) return 'Niveau superieur de fonctionnement';
  if (score >= 81) return 'Symptomes absents ou minimes';
  if (score >= 71) return 'Symptomes transitoires';
  if (score >= 61) return 'Symptomes legers';
  if (score >= 51) return 'Symptomes d\'intensite moyenne';
  if (score >= 41) return 'Symptomes importants';
  if (score >= 31) return 'Alteration du sens de la realite';
  if (score >= 21) return 'Comportement influence par delires/hallucinations';
  if (score >= 11) return 'Danger d\'auto ou d\'hetero-agression';
  return 'Danger persistant d\'hetero-agression grave';
}

export function interpretEgfScore(score: number): string {
  const level = getEgfLevel(score);
  return `Score EGF: ${score}/100. ${level}.`;
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface EgfScoringResult {
  egf_score: number;
  level: EgfLevel;
  interpretation: string;
}

export function scoreEgf(score: number): EgfScoringResult {
  const level = getEgfLevel(score);
  const interpretation = interpretEgfScore(score);

  return {
    egf_score: score,
    level,
    interpretation
  };
}
