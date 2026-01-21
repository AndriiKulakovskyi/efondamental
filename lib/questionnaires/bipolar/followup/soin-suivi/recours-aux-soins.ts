// eFondaMental Platform - Recours aux Soins
// Bipolar Followup Evaluation - Soin Suivi Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarFollowupRecoursAuxSoinsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Regular care section
  rad_recours_soin_psy: string | null;
  rad_recours_soin_psy_generaliste: string | null;
  recours_soin_psy_generaliste_nb: number | null;
  rad_recours_soin_psy_psychiatre: string | null;
  recours_soin_psy_psychiatre_nb: number | null;
  rad_recours_soin_psy_psychologue: string | null;
  recours_soin_psy_psychologue_nb: number | null;
  rad_recours_soin_psy_plusieurs: string | null;
  recours_soin_psy_plusieurs_nb: number | null;
  rad_recours_soin_psy_autres: string | null;
  recours_soin_psy_autres_nb: number | null;
  // Emergency care section
  rad_recours_soin_urgence: string | null;
  rad_recours_soin_urgence_sans_hosp: string | null;
  recours_soin_urgence_sans_hosp_nb: number | null;
  rad_recours_soin_urgence_generaliste: string | null;
  recours_soin_urgence_generaliste_nb: number | null;
  rad_recours_soin_urgence_psychiatre: string | null;
  recours_soin_urgence_psychiatre_nb: number | null;
  rad_recours_soin_urgence_psychologue: string | null;
  recours_soin_urgence_psychologue_nb: number | null;
  rad_recours_soin_urgence_plusieurs: string | null;
  recours_soin_urgence_plusieurs_nb: number | null;
  rad_recours_soin_urgence_autres: string | null;
  recours_soin_urgence_autres_nb: number | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarFollowupRecoursAuxSoinsResponseInsert = Omit<
  BipolarFollowupRecoursAuxSoinsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const RECOURS_AUX_SOINS_QUESTIONS: Question[] = [
  // Section 1: Regular care
  {
    id: 'section_suivi_habituel',
    text: 'Recours aux soins - Suivi habituel',
    type: 'section',
    required: false
  },
  {
    id: 'rad_recours_soin_psy',
    text: 'Recours aux systemes de soins pour troubles psychiatriques depuis la derniere visite selon le suivi habituel',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'rad_recours_soin_psy_generaliste',
    text: 'Consultations chez un medecin generaliste',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_psy' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_psy_generaliste_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_psy_generaliste' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_psy_psychiatre',
    text: 'Consultations chez un medecin psychiatre',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_psy' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_psy_psychiatre_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_psy_psychiatre' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_psy_psychologue',
    text: 'Consultations chez un psychologue',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_psy' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_psy_psychologue_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_psy_psychologue' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_psy_plusieurs',
    text: 'Consultations chez un ou plusieurs medecins specialistes en lien avec la pathologie ou son traitement',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_psy' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_psy_plusieurs_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_psy_plusieurs' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_psy_autres',
    text: 'Consultations autres en lien avec la pathologie ou son traitement (dieteticien, infirmier...)',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_psy' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_psy_autres_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_psy_autres' }, 'Oui'] }
  },

  // Section 2: Emergency care
  {
    id: 'section_urgence',
    text: 'Recours aux soins - Urgence',
    type: 'section',
    required: false
  },
  {
    id: 'rad_recours_soin_urgence',
    text: 'Recours aux soins non programme et/ou en urgence',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'rad_recours_soin_urgence_sans_hosp',
    text: 'Passage aux urgences pour troubles psychiatrique sans hospitalisation',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_urgence_sans_hosp_nb',
    text: 'Nombre de passages',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence_sans_hosp' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_urgence_generaliste',
    text: 'Consultations chez un medecin generaliste',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_urgence_generaliste_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence_generaliste' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_urgence_psychiatre',
    text: 'Consultations chez un medecin psychiatre',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_urgence_psychiatre_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence_psychiatre' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_urgence_psychologue',
    text: 'Consultations chez un psychologue',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_urgence_psychologue_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence_psychologue' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_urgence_plusieurs',
    text: 'Consultations chez un ou plusieurs medecins specialistes en lien avec la pathologie ou son traitement',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_urgence_plusieurs_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence_plusieurs' }, 'Oui'] }
  },
  {
    id: 'rad_recours_soin_urgence_autres',
    text: 'Consultations autres en lien avec la pathologie ou son traitement (dieteticien, infirmier...)',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'recours_soin_urgence_autres_nb',
    text: 'Nombre de consultations',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_recours_soin_urgence_autres' }, 'Oui'] }
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const RECOURS_AUX_SOINS_DEFINITION = {
  id: 'recours_aux_soins',
  code: 'RECOURS_AUX_SOINS',
  title: 'Recours aux soins',
  description: 'Documentation des consultations et recours aux soins psychiatriques depuis la derniere visite',
  questions: RECOURS_AUX_SOINS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Care Utilization Analysis
// ============================================================================

export interface RecoursAuxSoinsCountInput {
  recours_soin_psy_generaliste_nb: number | null;
  recours_soin_psy_psychiatre_nb: number | null;
  recours_soin_psy_psychologue_nb: number | null;
  recours_soin_psy_plusieurs_nb: number | null;
  recours_soin_psy_autres_nb: number | null;
  recours_soin_urgence_sans_hosp_nb: number | null;
  recours_soin_urgence_generaliste_nb: number | null;
  recours_soin_urgence_psychiatre_nb: number | null;
  recours_soin_urgence_psychologue_nb: number | null;
  recours_soin_urgence_plusieurs_nb: number | null;
  recours_soin_urgence_autres_nb: number | null;
}

export function computeTotalRegularConsultations(counts: RecoursAuxSoinsCountInput): number {
  return (counts.recours_soin_psy_generaliste_nb ?? 0) +
         (counts.recours_soin_psy_psychiatre_nb ?? 0) +
         (counts.recours_soin_psy_psychologue_nb ?? 0) +
         (counts.recours_soin_psy_plusieurs_nb ?? 0) +
         (counts.recours_soin_psy_autres_nb ?? 0);
}

export function computeTotalEmergencyConsultations(counts: RecoursAuxSoinsCountInput): number {
  return (counts.recours_soin_urgence_sans_hosp_nb ?? 0) +
         (counts.recours_soin_urgence_generaliste_nb ?? 0) +
         (counts.recours_soin_urgence_psychiatre_nb ?? 0) +
         (counts.recours_soin_urgence_psychologue_nb ?? 0) +
         (counts.recours_soin_urgence_plusieurs_nb ?? 0) +
         (counts.recours_soin_urgence_autres_nb ?? 0);
}

export interface RecoursAuxSoinsStatusInput {
  rad_recours_soin_psy: string | null;
  rad_recours_soin_urgence: string | null;
}

export function interpretRecoursAuxSoins(
  status: RecoursAuxSoinsStatusInput,
  counts: RecoursAuxSoinsCountInput
): string {
  const parts: string[] = [];
  
  if (status.rad_recours_soin_psy === 'Oui') {
    const total = computeTotalRegularConsultations(counts);
    parts.push(`Suivi habituel: ${total} consultation(s)`);
  } else if (status.rad_recours_soin_psy === 'Non') {
    parts.push('Pas de recours aux soins habituel');
  }
  
  if (status.rad_recours_soin_urgence === 'Oui') {
    const total = computeTotalEmergencyConsultations(counts);
    parts.push(`Urgence: ${total} consultation(s)`);
  } else if (status.rad_recours_soin_urgence === 'Non') {
    parts.push('Pas de recours aux urgences');
  }
  
  return parts.length > 0 ? parts.join('. ') + '.' : 'Recours aux soins non renseigne.';
}

// ============================================================================
// Combined Analysis Function
// ============================================================================

export interface RecoursAuxSoinsAnalysisResult {
  has_regular_care: boolean;
  has_emergency_care: boolean;
  total_regular_consultations: number;
  total_emergency_consultations: number;
  interpretation: string;
}

export function analyzeRecoursAuxSoins(
  status: RecoursAuxSoinsStatusInput,
  counts: RecoursAuxSoinsCountInput
): RecoursAuxSoinsAnalysisResult {
  return {
    has_regular_care: status.rad_recours_soin_psy === 'Oui',
    has_emergency_care: status.rad_recours_soin_urgence === 'Oui',
    total_regular_consultations: computeTotalRegularConsultations(counts),
    total_emergency_consultations: computeTotalEmergencyConsultations(counts),
    interpretation: interpretRecoursAuxSoins(status, counts)
  };
}
