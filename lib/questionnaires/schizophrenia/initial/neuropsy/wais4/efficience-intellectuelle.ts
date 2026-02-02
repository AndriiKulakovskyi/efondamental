// ============================================================================
// eFondaMental Platform - WAIS-IV Efficience Intellectuelle
// Schizophrenia Initial Evaluation - Neuropsy Module - WAIS-IV Subgroup
// Denney 2015 QI Estimation and Barona Index (Gregory, 1987)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import {
  BARONA_EDUCATION_OPTIONS,
  BARONA_PROFESSION_OPTIONS,
} from '@/lib/constants/wais4-efficience-norms';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaWais4EfficienceResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Denney inputs (subtest standard scores, 1-19)
  info_std: number | null;         // Information standard score
  wais_simi_std: number | null;    // Similitudes standard score
  wais_mat_std: number | null;     // Matrices standard score
  compl_im_std: number | null;     // Complètement d'images standard score
  wais_mc_std: number | null;      // Mémoire des chiffres standard score
  wais_arith_std: number | null;   // Arithmétique standard score
  wais_cod_std: number | null;     // Code standard score
  
  // Denney computed indices - QI
  qi_sum_std: number | null;       // Sum of 7 standard scores
  qi_indice: number | null;        // QI index value
  qi_rang: string | null;          // QI percentile rank
  qi_ci95: string | null;          // QI 95% confidence interval
  qi_interpretation: string | null; // QI qualitative interpretation
  
  // Denney computed indices - ICV
  icv_sum_std: number | null;      // Sum for ICV
  icv_indice: number | null;       // ICV index value
  icv_rang: string | null;         // ICV percentile rank
  icv_ci95: string | null;         // ICV 95% confidence interval
  icv_interpretation: string | null;
  
  // Denney computed indices - IRP
  irp_sum_std: number | null;      // Sum for IRP
  irp_indice: number | null;       // IRP index value
  irp_rang: string | null;         // IRP percentile rank
  irp_ci95: string | null;         // IRP 95% confidence interval
  irp_interpretation: string | null;
  
  // Denney computed indices - IMT
  imt_sum_std: number | null;      // Sum for IMT
  imt_indice: number | null;       // IMT index value
  imt_rang: string | null;         // IMT percentile rank
  imt_ci95: string | null;         // IMT 95% confidence interval
  imt_interpretation: string | null;
  
  // Denney computed indices - IVT
  ivt_sum_std: number | null;      // Sum for IVT
  ivt_indice: number | null;       // IVT index value
  ivt_rang: string | null;         // IVT percentile rank
  ivt_ci95: string | null;         // IVT 95% confidence interval
  ivt_interpretation: string | null;
  
  // Barona section
  barona_test_done: boolean | null; // Test fait toggle
  rad_barona_profession: number | null; // Profession category (1-7)
  rad_barona_etude: number | null;      // Education level (1-7)
  barona_qit_attendu: number | null;    // Expected IQ (Barona formula)
  barona_qit_difference: number | null; // Expected - Observed IQ
  
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaWais4EfficienceResponseInsert = Omit<
  SchizophreniaWais4EfficienceResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 
  'qi_sum_std' | 'qi_indice' | 'qi_rang' | 'qi_ci95' | 'qi_interpretation' |
  'icv_sum_std' | 'icv_indice' | 'icv_rang' | 'icv_ci95' | 'icv_interpretation' |
  'irp_sum_std' | 'irp_indice' | 'irp_rang' | 'irp_ci95' | 'irp_interpretation' |
  'imt_sum_std' | 'imt_indice' | 'imt_rang' | 'imt_ci95' | 'imt_interpretation' |
  'ivt_sum_std' | 'ivt_indice' | 'ivt_rang' | 'ivt_ci95' | 'ivt_interpretation' |
  'barona_qit_attendu' | 'barona_qit_difference'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Conditions
// ============================================================================

// Show Barona fields only when test_done is true (1 = Oui)
const SHOW_BARONA_FIELDS = { '==': [{ 'var': 'barona_test_done' }, 'oui'] };

// ============================================================================
// Questions Dictionary
// ============================================================================

export const WAIS4_EFFICIENCE_SZ_QUESTIONS: Question[] = [
  // ============================================
  // Section: Estimation de QI selon DENNEY 2015
  // ============================================
  {
    id: 'denney_section_header',
    section: 'Estimation de QI selon DENNEY 2015',
    text: 'Cette section calcule les indices cognitifs à partir des notes standard des subtests WAIS-IV.',
    type: 'instruction',
    required: false,
  },
  
  // Subtest 1: Information
  {
    id: 'info_std',
    section: 'Estimation de QI selon DENNEY 2015',
    text: 'Information - Note standard',
    type: 'number',
    required: true,
    min: 1,
    max: 19,
    help: 'Note standard du subtest Information (1-19)',
  },
  
  // Subtest 2: Similitudes
  {
    id: 'wais_simi_std',
    section: 'Estimation de QI selon DENNEY 2015',
    text: 'Similitudes - Note standard',
    type: 'number',
    required: true,
    min: 1,
    max: 19,
    help: 'Note standard du subtest Similitudes (1-19)',
  },
  
  // Subtest 3: Matrices
  {
    id: 'wais_mat_std',
    section: 'Estimation de QI selon DENNEY 2015',
    text: 'Matrices - Note standard',
    type: 'number',
    required: true,
    min: 1,
    max: 19,
    help: 'Note standard du subtest Matrices (1-19)',
  },
  
  // Subtest 4: Complètement d'images
  {
    id: 'compl_im_std',
    section: 'Estimation de QI selon DENNEY 2015',
    text: 'Complètement d\'images - Note standard',
    type: 'number',
    required: true,
    min: 1,
    max: 19,
    help: 'Note standard du subtest Complètement d\'images (1-19)',
  },
  
  // Subtest 5: Mémoire des chiffres
  {
    id: 'wais_mc_std',
    section: 'Estimation de QI selon DENNEY 2015',
    text: 'Mémoire des chiffres - Note standard',
    type: 'number',
    required: true,
    min: 1,
    max: 19,
    help: 'Note standard du subtest Mémoire des chiffres (1-19)',
  },
  
  // Subtest 6: Arithmétique
  {
    id: 'wais_arith_std',
    section: 'Estimation de QI selon DENNEY 2015',
    text: 'Arithmétique - Note standard',
    type: 'number',
    required: true,
    min: 1,
    max: 19,
    help: 'Note standard du subtest Arithmétique (1-19)',
  },
  
  // Subtest 7: Code
  {
    id: 'wais_cod_std',
    section: 'Estimation de QI selon DENNEY 2015',
    text: 'Code - Note standard',
    type: 'number',
    required: true,
    min: 1,
    max: 19,
    help: 'Note standard du subtest Code (1-19)',
  },
  
  // ============================================
  // Section: Indice de BARONA (Gregory, 1987)
  // ============================================
  {
    id: 'barona_section_header',
    section: 'Indice de BARONA (Gregory, 1987)',
    text: 'Estimation du QI attendu en fonction du sexe, âge, niveau d\'études et profession. Utilisé pour évaluer la détérioration cognitive.',
    type: 'instruction',
    required: false,
  },
  
  // Test done toggle
  {
    id: 'barona_test_done',
    section: 'Indice de BARONA (Gregory, 1987)',
    text: 'Test fait',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui', score: 0 },
      { code: 'non', label: 'Non', score: 0 },
    ],
  },
  
  // Profession
  {
    id: 'rad_barona_profession',
    section: 'Indice de BARONA (Gregory, 1987)',
    text: 'Profession et catégorie sociale',
    type: 'single_choice',
    required: false,
    display_if: SHOW_BARONA_FIELDS,
    options: BARONA_PROFESSION_OPTIONS.map(opt => ({
      code: opt.code,
      label: opt.label,
      score: 0,
    })),
  },
  
  // Education level
  {
    id: 'rad_barona_etude',
    section: 'Indice de BARONA (Gregory, 1987)',
    text: 'Niveau d\'études',
    type: 'single_choice',
    required: false,
    display_if: SHOW_BARONA_FIELDS,
    options: BARONA_EDUCATION_OPTIONS.map(opt => ({
      code: opt.code,
      label: opt.label,
      score: 0,
    })),
  },
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
    [key: string]: unknown;
  };
}

export const WAIS4_EFFICIENCE_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'wais4_efficience_sz',
  code: 'WAIS4_EFFICIENCE_SZ',
  title: 'Efficience intellectuelle - WAIS-IV',
  description: 'Estimation du QI selon Denney 2015 à partir des notes standard des subtests WAIS-IV, et indice de Barona pour le QI attendu basé sur les facteurs démographiques.',
  instructions: 'Entrez les notes standard (1-19) pour chaque subtest WAIS-IV. Les indices cognitifs (QI, ICV, IRP, IMT, IVT) seront calculés automatiquement. L\'indice de Barona permet d\'estimer le QI attendu et d\'évaluer une éventuelle détérioration cognitive.',
  questions: WAIS4_EFFICIENCE_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    purpose: 'IQ estimation from WAIS-IV subtest scores and premorbid IQ estimation',
    references: [
      'Denney, 2015 - QI Estimation',
      'Gregory, 1987 - Barona Index',
    ],
  },
};
