// eFondaMental Platform - DIVA 2.0 (Diagnostic Interview for ADHD in Adults)
// Bipolar Initial Evaluation - Medical Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarDivaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Inattention symptoms (adult and childhood)
  a1a_adult: string | null;
  a1a_childhood: string | null;
  a1b_adult: string | null;
  a1b_childhood: string | null;
  a1c_adult: string | null;
  a1c_childhood: string | null;
  a1d_adult: string | null;
  a1d_childhood: string | null;
  a1e_adult: string | null;
  a1e_childhood: string | null;
  a1f_adult: string | null;
  a1f_childhood: string | null;
  a1g_adult: string | null;
  a1g_childhood: string | null;
  a1h_adult: string | null;
  a1h_childhood: string | null;
  a1i_adult: string | null;
  a1i_childhood: string | null;
  total_inattention_adult: number | null;
  total_inattention_childhood: number | null;
  // Hyperactivity symptoms (adult and childhood)
  a2a_adult: string | null;
  a2a_childhood: string | null;
  a2b_adult: string | null;
  a2b_childhood: string | null;
  a2c_adult: string | null;
  a2c_childhood: string | null;
  a2d_adult: string | null;
  a2d_childhood: string | null;
  a2e_adult: string | null;
  a2e_childhood: string | null;
  a2f_adult: string | null;
  a2f_childhood: string | null;
  a2g_adult: string | null;
  a2g_childhood: string | null;
  a2h_adult: string | null;
  a2h_childhood: string | null;
  a2i_adult: string | null;
  a2i_childhood: string | null;
  total_hyperactivity_adult: number | null;
  total_hyperactivity_childhood: number | null;
  // Scoring
  criteria_a_inattention_child_gte6: string | null;
  criteria_hi_hyperactivity_child_gte6: string | null;
  criteria_a_inattention_adult_gte6: string | null;
  criteria_hi_hyperactivity_adult_gte6: string | null;
  criteria_b_lifetime_persistence: string | null;
  criteria_cd_impairment_childhood: string | null;
  criteria_cd_impairment_adult: string | null;
  criteria_e_better_explained: string | null;
  criteria_e_explanation: string | null;
  // Collateral
  collateral_parents: number | null;
  collateral_partner: number | null;
  collateral_school_reports: number | null;
  // Final diagnosis
  final_diagnosis: string | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarDivaResponseInsert = Omit<
  BipolarDivaResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Helper function to create ADHD symptom questions
// ============================================================================

const createADHDSymptom = (id: string, text: string): Question[] => [
  {
    id: `${id}_adult`,
    text: `${text}\nPresent a l'age adulte`,
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: `${id}_childhood`,
    text: 'Present dans l\'enfance',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  }
];

// ============================================================================
// Questions Dictionary
// ============================================================================

export const DIVA_QUESTIONS: Question[] = [
  // Criterion A - Inattention
  {
    id: 'section_inattention',
    text: 'Critere A - Deficit de l\'Attention',
    type: 'section',
    required: false
  },
  ...createADHDSymptom('a1a', 'A1. Souvent, ne parvient pas a preter attention aux details, ou fait des fautes d\'etourderie'),
  ...createADHDSymptom('a1b', 'A2. A souvent du mal a soutenir son attention au travail ou dans les jeux'),
  ...createADHDSymptom('a1c', 'A3. Semble souvent ne pas ecouter quand on lui parle personnellement'),
  ...createADHDSymptom('a1d', 'A4. Souvent, ne se conforme pas aux consignes et ne parvient pas a mener a terme ses devoirs'),
  ...createADHDSymptom('a1e', 'A5. A souvent du mal a organiser ses travaux ou ses activites'),
  ...createADHDSymptom('a1f', 'A6. Souvent, evite, a en aversion, ou fait a contrecoeur les taches qui necessitent un effort mental soutenu'),
  ...createADHDSymptom('a1g', 'A7. Perd souvent les objets necessaires a son travail ou a ses activites'),
  ...createADHDSymptom('a1h', 'A8. Souvent, se laisse facilement distraire par des stimuli externes'),
  ...createADHDSymptom('a1i', 'A9. A des oublis frequents dans la vie quotidienne'),
  {
    id: 'total_inattention_adult',
    text: 'Nombre total de criteres de Deficit Attentionnel a l\'age adulte (/9)',
    type: 'number',
    required: false,
    min: 0,
    max: 9
  },
  {
    id: 'total_inattention_childhood',
    text: 'Nombre total de criteres de Deficit Attentionnel dans l\'enfance (/9)',
    type: 'number',
    required: false,
    min: 0,
    max: 9
  },
  // Criterion A - Hyperactivity/Impulsivity
  {
    id: 'section_hyperactivity',
    text: 'Critere H/I - Hyperactivite/Impulsivite',
    type: 'section',
    required: false
  },
  ...createADHDSymptom('a2a', 'H/I 1. Remue souvent les mains ou les pieds, ou se tortille sur son siege'),
  ...createADHDSymptom('a2b', 'H/I 2. Se leve souvent en classe ou dans d\'autres situations ou il est suppose rester assis'),
  ...createADHDSymptom('a2c', 'H/I 3. Souvent, court ou grimpe partout, dans des situations ou cela est inapproprie'),
  ...createADHDSymptom('a2d', 'H/I 4. A souvent du mal a se tenir tranquille dans les jeux ou les activites de loisir'),
  ...createADHDSymptom('a2e', 'H/I 5. Est souvent sur la breche ou agit souvent comme s\'il etait monte sur ressorts'),
  ...createADHDSymptom('a2f', 'H/I 6. Parle souvent trop'),
  ...createADHDSymptom('a2g', 'H/I 7. Laisse souvent echapper la reponse a une question qui n\'est pas encore entierement posee'),
  ...createADHDSymptom('a2h', 'H/I 8. A souvent du mal a attendre son tour'),
  ...createADHDSymptom('a2i', 'H/I 9. Interrompt souvent les autres ou impose sa presence'),
  {
    id: 'total_hyperactivity_adult',
    text: 'Nombre total de criteres d\'Hyperactivite et d\'Impulsivite a l\'age adulte (/9)',
    type: 'number',
    required: false,
    min: 0,
    max: 9
  },
  {
    id: 'total_hyperactivity_childhood',
    text: 'Nombre total de criteres d\'Hyperactivite et d\'Impulsivite dans l\'enfance (/9)',
    type: 'number',
    required: false,
    min: 0,
    max: 9
  },
  // Scoring - Childhood
  {
    id: 'section_scoring_child',
    text: 'Cotation - Enfance',
    type: 'section',
    required: false
  },
  {
    id: 'criteria_a_inattention_child_gte6',
    text: 'Enfance: Le nombre de symptomes du critere A (inattention) est-il >= 6 ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'criteria_hi_hyperactivity_child_gte6',
    text: 'Enfance: Le nombre de symptomes du critere H/I (hyperactivite/impulsivite) est-il >= 6 ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  // Scoring - Adult
  {
    id: 'section_scoring_adult',
    text: 'Cotation - Age Adulte',
    type: 'section',
    required: false
  },
  {
    id: 'criteria_a_inattention_adult_gte6',
    text: 'Age Adulte: Le nombre de symptomes du critere A (inattention) est-il >= 6 ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'criteria_hi_hyperactivity_adult_gte6',
    text: 'Age Adulte: Le nombre de symptomes du critere H/I (hyperactivite/impulsivite) est-il >= 6 ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  // General Criteria
  {
    id: 'section_general_criteria',
    text: 'Cotation - Criteres Generaux',
    type: 'section',
    required: false
  },
  {
    id: 'criteria_b_lifetime_persistence',
    text: 'Critere B: Y a-t-il des indications en faveur de la persistance sur la vie entiere ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'criteria_cd_impairment_childhood',
    text: 'Criteres C et D: Presence de symptomes dans au moins deux environnements dans l\'enfance ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'criteria_cd_impairment_adult',
    text: 'Criteres C et D: Presence de symptomes dans au moins deux environnements a l\'age adulte ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'criteria_e_better_explained',
    text: 'Critere E: Les symptomes peuvent-ils etre mieux expliques par un autre trouble psychiatrique ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'non', label: 'Non' },
      { code: 'oui', label: 'Oui' }
    ]
  },
  {
    id: 'criteria_e_explanation',
    text: 'Si Oui, preciser lequel :',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'criteria_e_better_explained' }, 'oui'] }
  },
  // Collateral Information
  {
    id: 'section_collateral',
    text: 'Informations Collaterales',
    type: 'section',
    required: false
  },
  {
    id: 'collateral_parents',
    text: 'Le diagnostic est-il conforte par: Parent(s)/frere/soeur/autre',
    type: 'single_choice',
    required: false,
    options: [
      { code: -1, label: 'N/A', score: -1 },
      { code: 0, label: '0 (Aucun/faible support)', score: 0 },
      { code: 1, label: '1 (Quelque support)', score: 1 },
      { code: 2, label: '2 (Support net)', score: 2 }
    ]
  },
  {
    id: 'collateral_partner',
    text: 'Le diagnostic est-il conforte par: Partenaire/ami proche/autre',
    type: 'single_choice',
    required: false,
    options: [
      { code: -1, label: 'N/A', score: -1 },
      { code: 0, label: '0 (Aucun/faible support)', score: 0 },
      { code: 1, label: '1 (Quelque support)', score: 1 },
      { code: 2, label: '2 (Support net)', score: 2 }
    ]
  },
  {
    id: 'collateral_school_reports',
    text: 'Le diagnostic est-il conforte par: Livrets scolaires',
    type: 'single_choice',
    required: false,
    options: [
      { code: -1, label: 'N/A', score: -1 },
      { code: 0, label: '0 (Aucun/faible support)', score: 0 },
      { code: 1, label: '1 (Quelque support)', score: 1 },
      { code: 2, label: '2 (Support net)', score: 2 }
    ]
  },
  // Final Diagnosis
  {
    id: 'section_diagnosis',
    text: 'Diagnostic Final',
    type: 'section',
    required: false
  },
  {
    id: 'final_diagnosis',
    text: 'Diagnostic TDAH',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'non', label: 'Non' },
      { code: 'combine', label: 'Oui, Type combine (314.01)' },
      { code: 'inattentif', label: 'Oui, Type inattentif predominant (314.00)' },
      { code: 'hyperactif', label: 'Oui, Type hyperactif/impulsif predominant (314.01)' }
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

export const DIVA_DEFINITION: QuestionnaireDefinition = {
  id: 'diva',
  code: 'DIVA',
  title: 'DIVA 2.0 - Entretien Diagnostique pour le TDAH chez l\'adulte',
  description: 'Evaluation clinique structuree des criteres du TDAH (DSM-IV) a l\'age adulte et dans l\'enfance.',
  questions: DIVA_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
