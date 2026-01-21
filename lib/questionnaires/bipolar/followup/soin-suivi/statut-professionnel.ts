// eFondaMental Platform - Statut Professionnel
// Bipolar Followup Evaluation - Soin Suivi Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarFollowupStatutProfessionnelResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  rad_changement_statut: string | null;
  rad_statut_actuel: string | null;
  statut_actuel_autre: string | null;
  rad_social_stprof_class: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarFollowupStatutProfessionnelResponseInsert = Omit<
  BipolarFollowupStatutProfessionnelResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const STATUT_PROFESSIONNEL_QUESTIONS: Question[] = [
  {
    id: 'rad_changement_statut',
    text: 'Y-a-t-il eu un changement de votre statut professionnel depuis la derniere visite?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'rad_statut_actuel',
    text: 'Quel est votre statut actuel?',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_changement_statut' }, 'Oui'] },
    options: [
      { code: 'Sans emploi', label: 'Sans emploi' },
      { code: 'Actif', label: 'Actif' },
      { code: 'Retraite', label: 'Retraite' },
      { code: 'Etudiant', label: 'Etudiant' },
      { code: 'Pension', label: 'Pension' },
      { code: 'Au foyer', label: 'Au foyer' },
      { code: 'Autres', label: 'Autres' }
    ]
  },
  {
    id: 'statut_actuel_autre',
    text: 'Precisez',
    type: 'text',
    required: false,
    indentLevel: 2,
    display_if: { '==': [{ var: 'rad_statut_actuel' }, 'Autres'] }
  },
  {
    id: 'rad_social_stprof_class',
    text: 'Donner la classe professionnelle',
    type: 'single_choice',
    required: false,
    indentLevel: 2,
    help: 'INSEE : PCS 2003 - Niveau 2 - Liste des categories socioprofessionnelles',
    display_if: { '==': [{ var: 'rad_statut_actuel' }, 'Actif'] },
    options: [
      { code: 'Agriculteur exploitant', label: 'Agriculteur exploitant' },
      { code: 'Artisan', label: 'Artisan' },
      { code: 'Cadre de la fonction publique, profession intellectuelle et artistique', label: 'Cadre de la fonction publique, profession intellectuelle et artistique' },
      { code: 'Cadre d\'entreprise', label: 'Cadre d\'entreprise' },
      { code: 'Chef d\'entreprise de 10 salaries ou plus', label: 'Chef d\'entreprise de 10 salaries ou plus' },
      { code: 'Commercant et assimile', label: 'Commercant et assimile' },
      { code: 'Contremaitre, agent de maitrise', label: 'Contremaitre, agent de maitrise' },
      { code: 'Employe de la fonction publique', label: 'Employe de la fonction publique' },
      { code: 'Employe administratif d\'entreprise', label: 'Employe administratif d\'entreprise' },
      { code: 'Employe de commerce', label: 'Employe de commerce' },
      { code: 'Ouvrier qualifie', label: 'Ouvrier qualifie' },
      { code: 'Ouvrier non qualifies', label: 'Ouvrier non qualifies' },
      { code: 'Ouvrier agricole', label: 'Ouvrier agricole' },
      { code: 'Personnel de service direct aux particuliers', label: 'Personnel de service direct aux particuliers' },
      { code: 'Profession intermediaire de l\'enseignement, de la sante, de la fonction publique et assimiles', label: 'Profession intermediaire de l\'enseignement, de la sante, de la fonction publique et assimiles' },
      { code: 'Profession intermediaire administrative et commerciale des entreprises', label: 'Profession intermediaire administrative et commerciale des entreprises' },
      { code: 'Profession liberale et assimile', label: 'Profession liberale et assimile' },
      { code: 'Technicien', label: 'Technicien' }
    ]
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const STATUT_PROFESSIONNEL_DEFINITION = {
  id: 'statut_professionnel',
  code: 'STATUT_PROFESSIONNEL',
  title: 'Statut professionnel',
  description: 'Suivi des changements de statut professionnel depuis la derniere visite',
  questions: STATUT_PROFESSIONNEL_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Analysis Functions
// ============================================================================

export interface StatutProfessionnelInput {
  rad_changement_statut: string | null;
  rad_statut_actuel: string | null;
  rad_social_stprof_class: string | null;
}

export type StatusChangeType = 'changed' | 'unchanged' | 'unknown';
export type EmploymentStatus = 
  | 'unemployed' 
  | 'employed' 
  | 'retired' 
  | 'student' 
  | 'pension' 
  | 'homemaker' 
  | 'other' 
  | null;

export function getStatusChangeType(responses: StatutProfessionnelInput): StatusChangeType {
  switch (responses.rad_changement_statut) {
    case 'Oui':
      return 'changed';
    case 'Non':
      return 'unchanged';
    default:
      return 'unknown';
  }
}

export function getEmploymentStatus(responses: StatutProfessionnelInput): EmploymentStatus {
  if (responses.rad_changement_statut !== 'Oui') return null;
  
  switch (responses.rad_statut_actuel) {
    case 'Sans emploi':
      return 'unemployed';
    case 'Actif':
      return 'employed';
    case 'Retraite':
      return 'retired';
    case 'Etudiant':
      return 'student';
    case 'Pension':
      return 'pension';
    case 'Au foyer':
      return 'homemaker';
    case 'Autres':
      return 'other';
    default:
      return null;
  }
}

export function interpretStatutProfessionnel(responses: StatutProfessionnelInput): string {
  const changeType = getStatusChangeType(responses);
  
  if (changeType === 'unchanged') {
    return 'Pas de changement de statut professionnel.';
  }
  
  if (changeType === 'unknown') {
    return 'Changement de statut professionnel non renseigne.';
  }
  
  const status = getEmploymentStatus(responses);
  let interpretation = 'Changement de statut professionnel';
  
  if (status) {
    interpretation += `: ${responses.rad_statut_actuel}`;
    
    if (status === 'employed' && responses.rad_social_stprof_class) {
      interpretation += ` (${responses.rad_social_stprof_class})`;
    }
  }
  
  return interpretation + '.';
}

// ============================================================================
// Combined Analysis Function
// ============================================================================

export interface StatutProfessionnelAnalysisResult {
  status_changed: boolean;
  change_type: StatusChangeType;
  employment_status: EmploymentStatus;
  professional_class: string | null;
  interpretation: string;
}

export function analyzeStatutProfessionnel(
  responses: StatutProfessionnelInput
): StatutProfessionnelAnalysisResult {
  return {
    status_changed: responses.rad_changement_statut === 'Oui',
    change_type: getStatusChangeType(responses),
    employment_status: getEmploymentStatus(responses),
    professional_class: responses.rad_social_stprof_class,
    interpretation: interpretStatutProfessionnel(responses)
  };
}
