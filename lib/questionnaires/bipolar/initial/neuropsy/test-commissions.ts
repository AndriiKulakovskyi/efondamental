// eFondaMental Platform - Test des Commissions (Errands Test)
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarTestCommissionsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Planning phase
  planning_time_seconds: number | null;
  planning_strategy_score: number | null;
  // Execution phase
  total_errands_completed: number | null;
  errands_in_correct_order: number | null;
  rule_breaks: number | null;
  execution_time_seconds: number | null;
  // Errors
  inefficiencies: number | null;
  revisits: number | null;
  skipped_errands: number | null;
  // Derived scores
  total_score: number | null;
  efficiency_index: number | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarTestCommissionsResponseInsert = Omit<
  BipolarTestCommissionsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score' | 'efficiency_index'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const TEST_COMMISSIONS_QUESTIONS: Question[] = [
  // Planning Phase
  {
    id: 'section_planning',
    text: 'Phase de Planification',
    help: 'Evaluation de la capacite a planifier les commissions avant l\'execution.',
    type: 'section',
    required: false
  },
  {
    id: 'planning_time_seconds',
    text: 'Temps de planification (en secondes)',
    type: 'number',
    required: true,
    min: 0,
    max: 600
  },
  {
    id: 'planning_strategy_score',
    text: 'Score de strategie de planification',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Pas de strategie apparente', score: 0 },
      { code: 1, label: '1 - Strategie partielle', score: 1 },
      { code: 2, label: '2 - Strategie complete', score: 2 },
      { code: 3, label: '3 - Strategie optimale', score: 3 }
    ]
  },

  // Execution Phase
  {
    id: 'section_execution',
    text: 'Phase d\'Execution',
    type: 'section',
    required: false
  },
  {
    id: 'total_errands_completed',
    text: 'Nombre total de commissions completees',
    type: 'number',
    required: true,
    min: 0,
    max: 12
  },
  {
    id: 'errands_in_correct_order',
    text: 'Commissions effectuees dans l\'ordre correct',
    type: 'number',
    required: true,
    min: 0,
    max: 12
  },
  {
    id: 'execution_time_seconds',
    text: 'Temps d\'execution total (en secondes)',
    type: 'number',
    required: true,
    min: 0,
    max: 1200
  },
  {
    id: 'rule_breaks',
    text: 'Nombre de violations de regles',
    type: 'number',
    required: true,
    min: 0,
    help: 'Entrer dans un magasin non necessaire, ne pas respecter les contraintes de temps, etc.'
  },

  // Errors
  {
    id: 'section_errors',
    text: 'Erreurs et Inefficacites',
    type: 'section',
    required: false
  },
  {
    id: 'inefficiencies',
    text: 'Nombre d\'inefficacites',
    type: 'number',
    required: true,
    min: 0,
    help: 'Trajet non optimal, detours inutiles'
  },
  {
    id: 'revisits',
    text: 'Nombre de revisites (retours dans un lieu deja visite)',
    type: 'number',
    required: true,
    min: 0
  },
  {
    id: 'skipped_errands',
    text: 'Nombre de commissions oubliees',
    type: 'number',
    required: true,
    min: 0,
    max: 12
  }
];

// ============================================================================
// Scoring
// ============================================================================

export function computeTestCommissionsScore(responses: BipolarTestCommissionsResponseInsert): number {
  const completed = responses.total_errands_completed || 0;
  const correctOrder = responses.errands_in_correct_order || 0;
  const ruleBreaks = responses.rule_breaks || 0;
  const inefficiencies = responses.inefficiencies || 0;
  const revisits = responses.revisits || 0;
  const skipped = responses.skipped_errands || 0;
  
  // Basic score: completed errands + bonus for correct order
  let score = completed * 2 + correctOrder;
  // Penalties
  score -= ruleBreaks * 2;
  score -= inefficiencies;
  score -= revisits;
  score -= skipped * 2;
  
  return Math.max(0, score);
}

export function computeEfficiencyIndex(responses: BipolarTestCommissionsResponseInsert): number {
  const completed = responses.total_errands_completed || 0;
  const time = responses.execution_time_seconds || 1;
  const errors = (responses.rule_breaks || 0) + (responses.inefficiencies || 0) + (responses.revisits || 0);
  
  // Efficiency = tasks completed per minute, adjusted for errors
  const minutes = time / 60;
  const rawEfficiency = completed / minutes;
  const penaltyFactor = Math.max(0.5, 1 - (errors * 0.1));
  
  return rawEfficiency * penaltyFactor;
}

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

export const TEST_COMMISSIONS_DEFINITION: QuestionnaireDefinition = {
  id: 'test_commissions',
  code: 'TEST_COMMISSIONS',
  title: 'Test des Commissions',
  description: 'Test ecologique des fonctions executives - Evaluation de la planification et de l\'organisation dans un contexte de la vie quotidienne.',
  questions: TEST_COMMISSIONS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
