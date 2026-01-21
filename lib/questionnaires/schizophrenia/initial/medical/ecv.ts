// eFondaMental Platform - ECV (Evaluation des Comportements Violents)
// Assessment of violent behaviors over the patient's lifetime

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaEcvResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  rad_ecv_vv1?: 'Oui' | 'Non' | null;
  chk_ecv_vv2?: string[] | null;
  rad_ecv_vv3?: 'Oui' | 'Non' | null;
  rad_ecv_vv4?: 'Oui' | 'Non' | null;
  chk_ecv_vv5?: string[] | null;
  rad_ecv_vp1?: 'Oui' | 'Non' | null;
  rad_ecv_vp2?: 'Oui' | 'Non' | null;
  chk_ecv_vp3?: string[] | null;
  rad_ecv_vp4?: 'Oui' | 'Non' | null;
  rad_ecv_vp5?: 'Oui' | 'Non' | null;
  chk_ecv_vp6?: string[] | null;
  rad_ecv_vp7?: 'Oui' | 'Non' | null;
  rad_ecv_vp8?: 'Oui' | 'Non' | null;
  chk_ecv_vp9?: string[] | null;
  rad_ecv_vs1?: 'Oui' | 'Non' | null;
  chk_ecv_vs2?: string[] | null;
  chk_ecv_vs3?: string[] | null;
  rad_ecv_vs4?: 'Oui' | 'Non' | null;
  rad_ecv_vs5?: 'Oui' | 'Non' | null;
  chk_ecv_vs6?: string[] | null;
  rad_ecv_vo1?: 'Oui' | 'Non' | null;
  chk_ecv_vo2?: string[] | null;
  rad_ecv_vo3?: 'Oui' | 'Non' | null;
  rad_ecv_vo4?: 'Oui' | 'Non' | null;
  chk_ecv_vo5?: string[] | null;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaEcvResponseInsert = Omit<
  SchizophreniaEcvResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Response Options
// ============================================================================

const ECV_YES_NO_OPTIONS = [
  { code: 'Oui', label: 'Oui', score: 0 },
  { code: 'Non', label: 'Non', score: 1 }
];

const ECV_TYPE_OPTIONS = [
  { code: 'Intrafamiliale', label: 'Intrafamiliale' },
  { code: 'Extrafamiliale', label: 'Extrafamiliale' }
];

const ECV_CONVICTION_TYPE_OPTIONS = [
  { code: 'Amende', label: 'Amende' },
  { code: 'Sursis', label: 'Sursis' },
  { code: 'Prison', label: 'Prison' }
];

// ============================================================================
// Questions
// ============================================================================

export const ECV_QUESTIONS: Question[] = [
  // Violence verbale
  { id: 'section_verbal', text: 'Violence verbale', type: 'section', required: false },
  { id: 'rad_ecv_vv1', text: 'Le sujet a-t-il presente (sur la vie entiere): Violence verbale:', type: 'single_choice', required: false, options: ECV_YES_NO_OPTIONS },
  { id: 'chk_ecv_vv2', text: 'Type:', type: 'multiple_choice', required: false, options: ECV_TYPE_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vv1' }, 'Oui'] }, indentLevel: 1 },
  { id: 'rad_ecv_vv3', text: 'Intervention de la police:', type: 'single_choice', required: false, options: ECV_YES_NO_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vv1' }, 'Oui'] }, indentLevel: 1 },
  { id: 'rad_ecv_vv4', text: 'Condamnation:', type: 'single_choice', required: false, options: ECV_YES_NO_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vv1' }, 'Oui'] }, indentLevel: 1 },
  { id: 'chk_ecv_vv5', text: '(Type de condamnation)', type: 'multiple_choice', required: false, options: ECV_CONVICTION_TYPE_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vv4' }, 'Oui'] }, indentLevel: 2 },
  
  // Violence physique
  { id: 'section_physical', text: 'Violence physique', type: 'section', required: false },
  { id: 'rad_ecv_vp1', text: 'Violence physique:', type: 'single_choice', required: false, options: ECV_YES_NO_OPTIONS },
  { id: 'rad_ecv_vp2', text: 'Coups et blessures:', type: 'single_choice', required: false, options: ECV_YES_NO_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vp1' }, 'Oui'] }, indentLevel: 1 },
  { id: 'chk_ecv_vp3', text: '(Arme utilisee)', type: 'multiple_choice', required: false, options: [{ code: 'Sans arme', label: 'Sans arme' }, { code: 'Arme blanche', label: 'Arme blanche' }, { code: 'Arme a feu', label: 'Arme a feu' }], display_if: { '==': [{ 'var': 'rad_ecv_vp2' }, 'Oui'] }, indentLevel: 2 },
  { id: 'rad_ecv_vp4', text: 'Ayant entraine des soins chez le tiers:', type: 'single_choice', required: false, options: ECV_YES_NO_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vp2' }, 'Oui'] }, indentLevel: 2 },
  { id: 'rad_ecv_vp5', text: 'Homicide:', type: 'single_choice', required: false, options: ECV_YES_NO_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vp1' }, 'Oui'] }, indentLevel: 1 },
  { id: 'chk_ecv_vp6', text: 'Type:', type: 'multiple_choice', required: false, options: ECV_TYPE_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vp1' }, 'Oui'] }, indentLevel: 1 },
  { id: 'rad_ecv_vp7', text: 'Intervention de la police:', type: 'single_choice', required: false, options: ECV_YES_NO_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vp1' }, 'Oui'] }, indentLevel: 1 },
  { id: 'rad_ecv_vp8', text: 'Condamnation:', type: 'single_choice', required: false, options: ECV_YES_NO_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vp1' }, 'Oui'] }, indentLevel: 1 },
  { id: 'chk_ecv_vp9', text: '(Type de condamnation)', type: 'multiple_choice', required: false, options: ECV_CONVICTION_TYPE_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vp8' }, 'Oui'] }, indentLevel: 2 },
  
  // Violence sexuelle
  { id: 'section_sexual', text: 'Violence sexuelle', type: 'section', required: false },
  { id: 'rad_ecv_vs1', text: 'Violence sexuelle:', type: 'single_choice', required: false, options: ECV_YES_NO_OPTIONS },
  { id: 'chk_ecv_vs2', text: '(Preciser le type)', type: 'multiple_choice', required: false, options: [{ code: 'Viol', label: 'Viol' }, { code: 'Attouchements', label: 'Attouchements' }], display_if: { '==': [{ 'var': 'rad_ecv_vs1' }, 'Oui'] }, indentLevel: 1 },
  { id: 'chk_ecv_vs3', text: 'Type:', type: 'multiple_choice', required: false, options: ECV_TYPE_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vs1' }, 'Oui'] }, indentLevel: 1 },
  { id: 'rad_ecv_vs4', text: 'Intervention de la police:', type: 'single_choice', required: false, options: ECV_YES_NO_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vs1' }, 'Oui'] }, indentLevel: 1 },
  { id: 'rad_ecv_vs5', text: 'Condamnation:', type: 'single_choice', required: false, options: ECV_YES_NO_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vs1' }, 'Oui'] }, indentLevel: 1 },
  { id: 'chk_ecv_vs6', text: '(Type de condamnation)', type: 'multiple_choice', required: false, options: ECV_CONVICTION_TYPE_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vs5' }, 'Oui'] }, indentLevel: 2 },
  
  // Bris d'objet
  { id: 'section_property', text: 'Bris d\'objet', type: 'section', required: false },
  { id: 'rad_ecv_vo1', text: 'Bris d\'objet:', type: 'single_choice', required: false, options: ECV_YES_NO_OPTIONS },
  { id: 'chk_ecv_vo2', text: 'Type:', type: 'multiple_choice', required: false, options: ECV_TYPE_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vo1' }, 'Oui'] }, indentLevel: 1 },
  { id: 'rad_ecv_vo3', text: 'Intervention de la police:', type: 'single_choice', required: false, options: ECV_YES_NO_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vo1' }, 'Oui'] }, indentLevel: 1 },
  { id: 'rad_ecv_vo4', text: 'Condamnation:', type: 'single_choice', required: false, options: ECV_YES_NO_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vo1' }, 'Oui'] }, indentLevel: 1 },
  { id: 'chk_ecv_vo5', text: '(Type de condamnation)', type: 'multiple_choice', required: false, options: ECV_CONVICTION_TYPE_OPTIONS, display_if: { '==': [{ 'var': 'rad_ecv_vo4' }, 'Oui'] }, indentLevel: 2 }
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

export const ECV_DEFINITION: QuestionnaireDefinition = {
  id: 'ecv',
  code: 'ECV',
  title: 'Evaluation des comportements violents',
  description: 'Evaluation des comportements violents sur la vie entiere, couvrant la violence verbale, la violence physique, la violence sexuelle et les bris d\'objets.',
  questions: ECV_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: '1.0',
    language: 'fr-FR'
  }
};
