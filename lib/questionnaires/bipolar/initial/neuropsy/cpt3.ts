// eFondaMental Platform - CPT-3 (Continuous Performance Test)
// Bipolar Initial Evaluation - Neuropsy Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarCpt3Response {
  id: string;
  visit_id: string;
  patient_id: string;
  // Detectability (d')
  detectability_raw: number | null;
  detectability_t_score: number | null;
  detectability_percentile: number | null;
  // Omissions
  omissions_raw: number | null;
  omissions_t_score: number | null;
  omissions_percentile: number | null;
  // Commissions
  commissions_raw: number | null;
  commissions_t_score: number | null;
  commissions_percentile: number | null;
  // Perseverations
  perseverations_raw: number | null;
  perseverations_t_score: number | null;
  perseverations_percentile: number | null;
  // Hit Reaction Time (HRT)
  hrt_raw: number | null;
  hrt_t_score: number | null;
  hrt_percentile: number | null;
  // HRT Standard Deviation
  hrt_sd_raw: number | null;
  hrt_sd_t_score: number | null;
  hrt_sd_percentile: number | null;
  // Variability
  variability_raw: number | null;
  variability_t_score: number | null;
  variability_percentile: number | null;
  // Hit RT Block Change
  hrt_block_change_raw: number | null;
  hrt_block_change_t_score: number | null;
  hrt_block_change_percentile: number | null;
  // Hit SE Block Change
  hrt_se_block_change_raw: number | null;
  hrt_se_block_change_t_score: number | null;
  hrt_se_block_change_percentile: number | null;
  // Hit RT ISI Change
  hrt_isi_change_raw: number | null;
  hrt_isi_change_t_score: number | null;
  hrt_isi_change_percentile: number | null;
  // Hit SE ISI Change
  hrt_se_isi_change_raw: number | null;
  hrt_se_isi_change_t_score: number | null;
  hrt_se_isi_change_percentile: number | null;
  // Administration
  administration_date: string | null;
  test_validity: string | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarCpt3ResponseInsert = Omit<
  BipolarCpt3Response,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const CPT3_QUESTIONS: Question[] = [
  // Administration Info
  {
    id: 'section_admin',
    text: 'Informations sur l\'administration',
    type: 'section',
    required: false
  },
  {
    id: 'administration_date',
    text: 'Date d\'administration du test',
    type: 'date',
    required: true
  },
  {
    id: 'test_validity',
    text: 'Validite du test',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'valid', label: 'Valide' },
      { code: 'questionable', label: 'Discutable' },
      { code: 'invalid', label: 'Invalide' }
    ]
  },

  // Detectability
  {
    id: 'section_detectability',
    text: 'Detectabilite (d\')',
    type: 'section',
    required: false
  },
  {
    id: 'detectability_raw',
    text: 'Detectabilite - Score brut',
    type: 'number',
    required: true
  },
  {
    id: 'detectability_t_score',
    text: 'Detectabilite - Score T',
    type: 'number',
    required: false,
    min: 20,
    max: 80
  },
  {
    id: 'detectability_percentile',
    text: 'Detectabilite - Percentile',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },

  // Omissions
  {
    id: 'section_omissions',
    text: 'Omissions',
    type: 'section',
    required: false
  },
  {
    id: 'omissions_raw',
    text: 'Omissions - Score brut',
    type: 'number',
    required: true,
    min: 0
  },
  {
    id: 'omissions_t_score',
    text: 'Omissions - Score T',
    type: 'number',
    required: false,
    min: 20,
    max: 80
  },
  {
    id: 'omissions_percentile',
    text: 'Omissions - Percentile',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },

  // Commissions
  {
    id: 'section_commissions',
    text: 'Commissions',
    type: 'section',
    required: false
  },
  {
    id: 'commissions_raw',
    text: 'Commissions - Score brut',
    type: 'number',
    required: true,
    min: 0
  },
  {
    id: 'commissions_t_score',
    text: 'Commissions - Score T',
    type: 'number',
    required: false,
    min: 20,
    max: 80
  },
  {
    id: 'commissions_percentile',
    text: 'Commissions - Percentile',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },

  // Perseverations
  {
    id: 'section_perseverations',
    text: 'Perseverations',
    type: 'section',
    required: false
  },
  {
    id: 'perseverations_raw',
    text: 'Perseverations - Score brut',
    type: 'number',
    required: true,
    min: 0
  },
  {
    id: 'perseverations_t_score',
    text: 'Perseverations - Score T',
    type: 'number',
    required: false,
    min: 20,
    max: 80
  },
  {
    id: 'perseverations_percentile',
    text: 'Perseverations - Percentile',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },

  // Hit Reaction Time
  {
    id: 'section_hrt',
    text: 'Temps de Reaction (HRT)',
    type: 'section',
    required: false
  },
  {
    id: 'hrt_raw',
    text: 'HRT - Score brut (ms)',
    type: 'number',
    required: true,
    min: 0
  },
  {
    id: 'hrt_t_score',
    text: 'HRT - Score T',
    type: 'number',
    required: false,
    min: 20,
    max: 80
  },
  {
    id: 'hrt_percentile',
    text: 'HRT - Percentile',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },

  // HRT SD
  {
    id: 'section_hrt_sd',
    text: 'Variabilite du Temps de Reaction (HRT SD)',
    type: 'section',
    required: false
  },
  {
    id: 'hrt_sd_raw',
    text: 'HRT SD - Score brut',
    type: 'number',
    required: true,
    min: 0
  },
  {
    id: 'hrt_sd_t_score',
    text: 'HRT SD - Score T',
    type: 'number',
    required: false,
    min: 20,
    max: 80
  },
  {
    id: 'hrt_sd_percentile',
    text: 'HRT SD - Percentile',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },

  // Variability
  {
    id: 'section_variability',
    text: 'Variabilite',
    type: 'section',
    required: false
  },
  {
    id: 'variability_raw',
    text: 'Variabilite - Score brut',
    type: 'number',
    required: false
  },
  {
    id: 'variability_t_score',
    text: 'Variabilite - Score T',
    type: 'number',
    required: false,
    min: 20,
    max: 80
  },
  {
    id: 'variability_percentile',
    text: 'Variabilite - Percentile',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },

  // HRT Block Change
  {
    id: 'section_hrt_block',
    text: 'Changement HRT par Bloc',
    type: 'section',
    required: false
  },
  {
    id: 'hrt_block_change_raw',
    text: 'HRT Block Change - Score brut',
    type: 'number',
    required: false
  },
  {
    id: 'hrt_block_change_t_score',
    text: 'HRT Block Change - Score T',
    type: 'number',
    required: false,
    min: 20,
    max: 80
  },
  {
    id: 'hrt_block_change_percentile',
    text: 'HRT Block Change - Percentile',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },

  // HRT SE Block Change
  {
    id: 'hrt_se_block_change_raw',
    text: 'HRT SE Block Change - Score brut',
    type: 'number',
    required: false
  },
  {
    id: 'hrt_se_block_change_t_score',
    text: 'HRT SE Block Change - Score T',
    type: 'number',
    required: false,
    min: 20,
    max: 80
  },
  {
    id: 'hrt_se_block_change_percentile',
    text: 'HRT SE Block Change - Percentile',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },

  // HRT ISI Change
  {
    id: 'section_hrt_isi',
    text: 'Changement HRT par ISI',
    type: 'section',
    required: false
  },
  {
    id: 'hrt_isi_change_raw',
    text: 'HRT ISI Change - Score brut',
    type: 'number',
    required: false
  },
  {
    id: 'hrt_isi_change_t_score',
    text: 'HRT ISI Change - Score T',
    type: 'number',
    required: false,
    min: 20,
    max: 80
  },
  {
    id: 'hrt_isi_change_percentile',
    text: 'HRT ISI Change - Percentile',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },

  // HRT SE ISI Change
  {
    id: 'hrt_se_isi_change_raw',
    text: 'HRT SE ISI Change - Score brut',
    type: 'number',
    required: false
  },
  {
    id: 'hrt_se_isi_change_t_score',
    text: 'HRT SE ISI Change - Score T',
    type: 'number',
    required: false,
    min: 20,
    max: 80
  },
  {
    id: 'hrt_se_isi_change_percentile',
    text: 'HRT SE ISI Change - Percentile',
    type: 'number',
    required: false,
    min: 0,
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

export const CPT3_DEFINITION: QuestionnaireDefinition = {
  id: 'cpt3',
  code: 'CPT3',
  title: 'CPT-3 (Conners Continuous Performance Test)',
  description: 'Test de performance continue - Evaluation de l\'attention soutenue et du controle inhibiteur.',
  questions: CPT3_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
