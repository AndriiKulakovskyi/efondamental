// eFondaMental Platform - WAIS-III CPT II V.5
// Bipolar Initial Evaluation - Neuropsy Module

import { Question, QuestionOption } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarWais3Cpt2Response {
  id: string;
  visit_id: string;
  patient_id: string;
  // Omissions
  cpt2_omissions_value: number | null;
  cpt2_omissions_pourcentage: number | null;
  cpt2_omissions_tscore: number | null;
  cpt2_omissions_percentile: number | null;
  cpt2_omissions_guideline: number | null;
  // Commissions
  cpt2_comissions_value: number | null;
  cpt2_comissions_pourcentage: number | null;
  cpt2_comissions_tscore: number | null;
  cpt2_comissions_percentile: number | null;
  cpt2_comissions_guideline: number | null;
  // Hit RT
  cpt2_hitrt_value: number | null;
  cpt2_hitrt_tscore: number | null;
  cpt2_hitrt_percentile: number | null;
  cpt2_hitrt_guideline: number | null;
  // Hit RT Std Error
  cpt2_hitrtstder_value: number | null;
  cpt2_hitrtstder_tscore: number | null;
  cpt2_hitrtstder_percentile: number | null;
  cpt2_hitrtstder_guideline: number | null;
  // Variability
  cpt2_variability_value: number | null;
  cpt2_variability_tscore: number | null;
  cpt2_variability_percentile: number | null;
  cpt2_variability_guideline: number | null;
  // Detectability
  cpt2_detectability_value: number | null;
  cpt2_detectability_tscore: number | null;
  cpt2_detectability_percentile: number | null;
  cpt2_detectability_guideline: number | null;
  // Response Style
  cpt2_responsestyle_value: number | null;
  cpt2_responsestyle_tscore: number | null;
  cpt2_responsestyle_percentile: number | null;
  cpt2_responsestyle_guideline: number | null;
  // Perseverations
  cpt2_perseverations_value: number | null;
  cpt2_perseverations_pourcentage: number | null;
  cpt2_perseverations_tscore: number | null;
  cpt2_perseverations_percentile: number | null;
  cpt2_perseverations_guideline: number | null;
  // Hit RT Block Change
  cpt2_hitrtblockchange_value: number | null;
  cpt2_hitrtblockchange_tscore: number | null;
  cpt2_hitrtblockchange_percentile: number | null;
  cpt2_hitrtblockchange_guideline: number | null;
  // Hit SE Block Change
  cpt2_hitseblockchange_value: number | null;
  cpt2_hitseblockchange_tscore: number | null;
  cpt2_hitseblockchange_percentile: number | null;
  cpt2_hitseblockchange_guideline: number | null;
  // Hit RT ISI Change
  cpt2_hitrtisichange_value: number | null;
  cpt2_hitrtisichange_tscore: number | null;
  cpt2_hitrtisichange_percentile: number | null;
  cpt2_hitrtisichange_guideline: number | null;
  // Hit SE ISI Change
  cpt2_hitseisichange_value: number | null;
  cpt2_hitseisichange_tscore: number | null;
  cpt2_hitseisichange_percentile: number | null;
  cpt2_hitseisichange_guideline: number | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarWais3Cpt2ResponseInsert = Omit<
  BipolarWais3Cpt2Response,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Options
// ============================================================================

const CPT2_GUIDELINE_OPTIONS: QuestionOption[] = [
  { code: 0, label: 'Markedly atypical', score: 0 },
  { code: 1, label: 'Mildly atypical', score: 1 },
  { code: 2, label: 'Within average range', score: 2 },
  { code: 3, label: 'Good performance', score: 3 },
  { code: 4, label: 'Very good performance', score: 4 },
  { code: 5, label: 'A little fast', score: 5 },
  { code: 6, label: 'Atypically fast', score: 6 }
];

// ============================================================================
// Questions Dictionary
// ============================================================================

export const WAIS3_CPT2_QUESTIONS: Question[] = [
  // Section: Omissions %
  {
    id: 'section_omissions',
    text: 'Omissions %',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_omissions_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Omissions %',
    help: 'Missed targets'
  },
  {
    id: 'cpt2_omissions_pourcentage',
    text: 'Pourcentage',
    type: 'number',
    required: false,
    section: 'Omissions %'
  },
  {
    id: 'cpt2_omissions_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Omissions %'
  },
  {
    id: 'cpt2_omissions_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Omissions %'
  },
  {
    id: 'cpt2_omissions_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Omissions %',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Commissions %
  {
    id: 'section_comissions',
    text: 'Commissions %',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_comissions_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Commissions %',
    help: 'Incorrect responses to non-targets'
  },
  {
    id: 'cpt2_comissions_pourcentage',
    text: 'Pourcentage',
    type: 'number',
    required: false,
    section: 'Commissions %'
  },
  {
    id: 'cpt2_comissions_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Commissions %'
  },
  {
    id: 'cpt2_comissions_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Commissions %'
  },
  {
    id: 'cpt2_comissions_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Commissions %',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Hit RT
  {
    id: 'section_hitrt',
    text: 'Hit RT',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_hitrt_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Hit RT',
    help: 'Reaction time for correct responses'
  },
  {
    id: 'cpt2_hitrt_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Hit RT'
  },
  {
    id: 'cpt2_hitrt_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Hit RT'
  },
  {
    id: 'cpt2_hitrt_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Hit RT',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Hit RT Std. Error
  {
    id: 'section_hitrtstder',
    text: 'Hit RT Std. Error',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_hitrtstder_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Hit RT Std. Error',
    help: 'Standard error of reaction time'
  },
  {
    id: 'cpt2_hitrtstder_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Hit RT Std. Error'
  },
  {
    id: 'cpt2_hitrtstder_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Hit RT Std. Error'
  },
  {
    id: 'cpt2_hitrtstder_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Hit RT Std. Error',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Variability
  {
    id: 'section_variability',
    text: 'Variability',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_variability_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Variability',
    help: 'Variability of reaction time'
  },
  {
    id: 'cpt2_variability_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Variability'
  },
  {
    id: 'cpt2_variability_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Variability'
  },
  {
    id: 'cpt2_variability_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Variability',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Detectability (d')
  {
    id: 'section_detectability',
    text: 'Detectability (d\')',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_detectability_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Detectability (d\')',
    help: 'Ability to discriminate targets from non-targets'
  },
  {
    id: 'cpt2_detectability_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Detectability (d\')'
  },
  {
    id: 'cpt2_detectability_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Detectability (d\')'
  },
  {
    id: 'cpt2_detectability_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Detectability (d\')',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Response style (Beta)
  {
    id: 'section_responsestyle',
    text: 'Response style (Beta)',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_responsestyle_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Response style (Beta)',
    help: 'Response bias (conservative vs. risky)'
  },
  {
    id: 'cpt2_responsestyle_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Response style (Beta)'
  },
  {
    id: 'cpt2_responsestyle_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Response style (Beta)'
  },
  {
    id: 'cpt2_responsestyle_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Response style (Beta)',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Perseverations %
  {
    id: 'section_perseverations',
    text: 'Perseverations %',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_perseverations_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Perseverations %',
    help: 'Repetitive responding'
  },
  {
    id: 'cpt2_perseverations_pourcentage',
    text: 'Pourcentage',
    type: 'number',
    required: false,
    section: 'Perseverations %'
  },
  {
    id: 'cpt2_perseverations_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Perseverations %'
  },
  {
    id: 'cpt2_perseverations_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Perseverations %'
  },
  {
    id: 'cpt2_perseverations_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Perseverations %',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Hit RT Block Change
  {
    id: 'section_hitrtblockchange',
    text: 'Hit RT Block Change',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_hitrtblockchange_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Hit RT Block Change',
    help: 'Change in reaction time over blocks'
  },
  {
    id: 'cpt2_hitrtblockchange_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Hit RT Block Change'
  },
  {
    id: 'cpt2_hitrtblockchange_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Hit RT Block Change'
  },
  {
    id: 'cpt2_hitrtblockchange_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Hit RT Block Change',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Hit SE Block Change
  {
    id: 'section_hitseblockchange',
    text: 'Hit SE Block Change',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_hitseblockchange_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Hit SE Block Change',
    help: 'Change in standard error over blocks'
  },
  {
    id: 'cpt2_hitseblockchange_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Hit SE Block Change'
  },
  {
    id: 'cpt2_hitseblockchange_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Hit SE Block Change'
  },
  {
    id: 'cpt2_hitseblockchange_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Hit SE Block Change',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Hit RT ISI Change
  {
    id: 'section_hitrtisichange',
    text: 'Hit RT ISI Change',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_hitrtisichange_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Hit RT ISI Change',
    help: 'Change in reaction time over Inter-Stimulus Intervals'
  },
  {
    id: 'cpt2_hitrtisichange_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Hit RT ISI Change'
  },
  {
    id: 'cpt2_hitrtisichange_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Hit RT ISI Change'
  },
  {
    id: 'cpt2_hitrtisichange_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Hit RT ISI Change',
    options: CPT2_GUIDELINE_OPTIONS
  },
  
  // Section: Hit SE ISI Change
  {
    id: 'section_hitseisichange',
    text: 'Hit SE ISI Change',
    type: 'section',
    required: false,
    section: ''
  },
  {
    id: 'cpt2_hitseisichange_value',
    text: 'Value',
    type: 'number',
    required: false,
    section: 'Hit SE ISI Change',
    help: 'Change in standard error over Inter-Stimulus Intervals'
  },
  {
    id: 'cpt2_hitseisichange_tscore',
    text: 'T-score',
    type: 'number',
    required: false,
    section: 'Hit SE ISI Change'
  },
  {
    id: 'cpt2_hitseisichange_percentile',
    text: 'Percentile',
    type: 'number',
    required: false,
    section: 'Hit SE ISI Change'
  },
  {
    id: 'cpt2_hitseisichange_guideline',
    text: 'Guideline',
    type: 'single_choice',
    required: false,
    section: 'Hit SE ISI Change',
    options: CPT2_GUIDELINE_OPTIONS
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

export const WAIS3_CPT2_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_cpt2',
  code: 'WAIS3_CPT2',
  title: 'WAIS-III - CPT II V.5',
  description: 'Conners\' Continuous Performance Test II (CPT II V.5) by C. Keith Conners, Ph.D. and MHS Staff. Ce formulaire permet la saisie des resultats calcules par le logiciel CPT II externe.',
  questions: WAIS3_CPT2_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
