// eFondaMental Platform - Traitement Non-Pharmacologique
// Bipolar Followup Evaluation - Soin Suivi Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarFollowupTraitementNonPharmaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  rad_non_pharmacologique: string | null;
  // Sismotherapie
  rad_non_pharmacologique_sismo: string | null;
  non_pharmacologique_sismo_nb: number | null;
  date_non_pharmacologique_sismo_debut: string | null;
  date_non_pharmacologique_sismo_fin: string | null;
  // TMS
  rad_non_pharmacologique_tms: string | null;
  non_pharmacologique_tms_nb: number | null;
  date_non_pharmacologique_tms_debut: string | null;
  date_non_pharmacologique_tms_fin: string | null;
  // TCC
  rad_non_pharmacologique_tcc: string | null;
  non_pharmacologique_tcc_nb: number | null;
  date_non_pharmacologique_tcc_debut: string | null;
  date_non_pharmacologique_tcc_fin: string | null;
  // Psychoeducation
  rad_non_pharmacologique_psychoed: string | null;
  non_pharmacologique_psychoed_nb: number | null;
  date_non_pharmacologique_psychoed_debut: string | null;
  date_non_pharmacologique_psychoed_fin: string | null;
  // IPSRT
  rad_non_pharmacologique_ipsrt: string | null;
  non_pharmacologique_ipsrt_nb: number | null;
  chk_non_pharmacologique_ipsrt_precisez: string[] | null;
  date_non_pharmacologique_ipsrt_debut: string | null;
  date_non_pharmacologique_ipsrt_fin: string | null;
  // Autre
  rad_non_pharmacologique_autre: string | null;
  non_pharmacologique_autre_precisez: string | null;
  non_pharmacologique_autre_nb: number | null;
  date_non_pharmacologique_autre_debut: string | null;
  date_non_pharmacologique_autre_fin: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarFollowupTraitementNonPharmaResponseInsert = Omit<
  BipolarFollowupTraitementNonPharmaResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const TRAITEMENT_NON_PHARMACOLOGIQUE_QUESTIONS: Question[] = [
  {
    id: 'rad_non_pharmacologique',
    text: 'Avez-vous beneficie d\'un traitement non pharmacologique depuis la derniere visite',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },

  // Sismotherapie
  {
    id: 'section_sismo',
    text: 'Sismotherapie',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] }
  },
  {
    id: 'rad_non_pharmacologique_sismo',
    text: 'Sismotherapie',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'non_pharmacologique_sismo_nb',
    text: 'Nombre de seances',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_sismo' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_sismo_debut',
    text: 'Date de debut',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_sismo' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_sismo_fin',
    text: 'Date de fin',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_sismo' }, 'Oui'] }
  },

  // TMS
  {
    id: 'section_tms',
    text: 'TMS',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] }
  },
  {
    id: 'rad_non_pharmacologique_tms',
    text: 'TMS',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'non_pharmacologique_tms_nb',
    text: 'Nombre de seances',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_tms' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_tms_debut',
    text: 'Date de debut',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_tms' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_tms_fin',
    text: 'Date de fin',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_tms' }, 'Oui'] }
  },

  // TCC
  {
    id: 'section_tcc',
    text: 'TCC',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] }
  },
  {
    id: 'rad_non_pharmacologique_tcc',
    text: 'TCC',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'non_pharmacologique_tcc_nb',
    text: 'Nombre de seances',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_tcc' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_tcc_debut',
    text: 'Date de debut',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_tcc' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_tcc_fin',
    text: 'Date de fin',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_tcc' }, 'Oui'] }
  },

  // Psychoeducation
  {
    id: 'section_psychoed',
    text: 'Groupes de psychoeducation',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] }
  },
  {
    id: 'rad_non_pharmacologique_psychoed',
    text: 'Groupes de psychoeducation',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'non_pharmacologique_psychoed_nb',
    text: 'Nombre de seances',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_psychoed' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_psychoed_debut',
    text: 'Date de debut',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_psychoed' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_psychoed_fin',
    text: 'Date de fin',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_psychoed' }, 'Oui'] }
  },

  // IPSRT
  {
    id: 'section_ipsrt',
    text: 'IPSRT',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] }
  },
  {
    id: 'rad_non_pharmacologique_ipsrt',
    text: 'IPSRT',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'non_pharmacologique_ipsrt_nb',
    text: 'Nombre de seances',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_ipsrt' }, 'Oui'] }
  },
  {
    id: 'chk_non_pharmacologique_ipsrt_precisez',
    text: 'Precisez',
    type: 'multiple_choice',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_ipsrt' }, 'Oui'] },
    options: [
      { code: 'En groupe', label: 'En groupe' },
      { code: 'En individuel', label: 'En individuel' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'date_non_pharmacologique_ipsrt_debut',
    text: 'Date de debut',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_ipsrt' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_ipsrt_fin',
    text: 'Date de fin',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_ipsrt' }, 'Oui'] }
  },

  // Autre
  {
    id: 'section_autre',
    text: 'Autre',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] }
  },
  {
    id: 'rad_non_pharmacologique_autre',
    text: 'Autre',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_non_pharmacologique' }, 'Oui'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'non_pharmacologique_autre_precisez',
    text: 'Precisez',
    type: 'text',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_autre' }, 'Oui'] }
  },
  {
    id: 'non_pharmacologique_autre_nb',
    text: 'Nombre de seances',
    type: 'number',
    required: false,
    min: 0,
    max: 99,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_autre' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_autre_debut',
    text: 'Date de debut',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_autre' }, 'Oui'] }
  },
  {
    id: 'date_non_pharmacologique_autre_fin',
    text: 'Date de fin',
    type: 'date',
    required: false,
    indentLevel: 1,
    display_if: { '==': [{ var: 'rad_non_pharmacologique_autre' }, 'Oui'] }
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const TRAITEMENT_NON_PHARMACOLOGIQUE_DEFINITION = {
  id: 'traitement_non_pharmacologique',
  code: 'TRAITEMENT_NON_PHARMACOLOGIQUE',
  title: 'Traitement non-pharmacologique',
  description: 'Suivi des traitements non-pharmacologiques recus depuis la derniere visite',
  questions: TRAITEMENT_NON_PHARMACOLOGIQUE_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Treatment Analysis
// ============================================================================

export interface TraitementNonPharmaInput {
  rad_non_pharmacologique: string | null;
  rad_non_pharmacologique_sismo: string | null;
  non_pharmacologique_sismo_nb: number | null;
  rad_non_pharmacologique_tms: string | null;
  non_pharmacologique_tms_nb: number | null;
  rad_non_pharmacologique_tcc: string | null;
  non_pharmacologique_tcc_nb: number | null;
  rad_non_pharmacologique_psychoed: string | null;
  non_pharmacologique_psychoed_nb: number | null;
  rad_non_pharmacologique_ipsrt: string | null;
  non_pharmacologique_ipsrt_nb: number | null;
  rad_non_pharmacologique_autre: string | null;
  non_pharmacologique_autre_nb: number | null;
}

export type TreatmentType = 'sismotherapie' | 'tms' | 'tcc' | 'psychoeducation' | 'ipsrt' | 'other';

export interface TreatmentInfo {
  type: TreatmentType;
  sessions: number;
}

export function getActiveTreatments(responses: TraitementNonPharmaInput): TreatmentInfo[] {
  const treatments: TreatmentInfo[] = [];
  
  if (responses.rad_non_pharmacologique_sismo === 'Oui') {
    treatments.push({
      type: 'sismotherapie',
      sessions: responses.non_pharmacologique_sismo_nb ?? 0
    });
  }
  
  if (responses.rad_non_pharmacologique_tms === 'Oui') {
    treatments.push({
      type: 'tms',
      sessions: responses.non_pharmacologique_tms_nb ?? 0
    });
  }
  
  if (responses.rad_non_pharmacologique_tcc === 'Oui') {
    treatments.push({
      type: 'tcc',
      sessions: responses.non_pharmacologique_tcc_nb ?? 0
    });
  }
  
  if (responses.rad_non_pharmacologique_psychoed === 'Oui') {
    treatments.push({
      type: 'psychoeducation',
      sessions: responses.non_pharmacologique_psychoed_nb ?? 0
    });
  }
  
  if (responses.rad_non_pharmacologique_ipsrt === 'Oui') {
    treatments.push({
      type: 'ipsrt',
      sessions: responses.non_pharmacologique_ipsrt_nb ?? 0
    });
  }
  
  if (responses.rad_non_pharmacologique_autre === 'Oui') {
    treatments.push({
      type: 'other',
      sessions: responses.non_pharmacologique_autre_nb ?? 0
    });
  }
  
  return treatments;
}

export function computeTotalSessions(responses: TraitementNonPharmaInput): number {
  const treatments = getActiveTreatments(responses);
  return treatments.reduce((sum, t) => sum + t.sessions, 0);
}

const TREATMENT_LABELS: Record<TreatmentType, string> = {
  sismotherapie: 'Sismotherapie',
  tms: 'TMS',
  tcc: 'TCC',
  psychoeducation: 'Psychoeducation',
  ipsrt: 'IPSRT',
  other: 'Autre'
};

export function interpretTraitementNonPharma(responses: TraitementNonPharmaInput): string {
  if (responses.rad_non_pharmacologique === 'Non') {
    return 'Aucun traitement non-pharmacologique depuis la derniere visite.';
  }
  
  if (responses.rad_non_pharmacologique === 'Ne sais pas') {
    return 'Traitement non-pharmacologique non determine.';
  }
  
  const treatments = getActiveTreatments(responses);
  
  if (treatments.length === 0) {
    return 'Aucun traitement non-pharmacologique specifie.';
  }
  
  const parts = treatments.map(t => 
    `${TREATMENT_LABELS[t.type]}: ${t.sessions} seance(s)`
  );
  
  return `Traitements recus: ${parts.join(', ')}.`;
}

// ============================================================================
// Combined Analysis Function
// ============================================================================

export interface TraitementNonPharmaAnalysisResult {
  has_treatment: boolean;
  active_treatments: TreatmentInfo[];
  total_sessions: number;
  interpretation: string;
}

export function analyzeTraitementNonPharma(
  responses: TraitementNonPharmaInput
): TraitementNonPharmaAnalysisResult {
  return {
    has_treatment: responses.rad_non_pharmacologique === 'Oui',
    active_treatments: getActiveTreatments(responses),
    total_sessions: computeTotalSessions(responses),
    interpretation: interpretTraitementNonPharma(responses)
  };
}
