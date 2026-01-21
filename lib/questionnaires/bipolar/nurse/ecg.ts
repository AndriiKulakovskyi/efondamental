// eFondaMental Platform - ECG (Electrocardiogram)
// Bipolar Nurse Evaluation Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarNurseEcgResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  ecg_performed: string | null;
  heart_rate: number | null;
  qt_measured: number | null;
  rr_measured: number | null;
  qtc_calculated: number | null;
  ecg_sent_to_cardiologist: string | null;
  cardiologist_consultation_requested: string | null;
  cardiologist_name: string | null;
  cardiologist_city: string | null;
  // Computed
  qt_interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarNurseEcgResponseInsert = {
  visit_id: string;
  patient_id: string;
  ecg_performed?: string | null;
  heart_rate?: number | null;
  qt_measured?: number | null;
  rr_measured?: number | null;
  ecg_sent_to_cardiologist?: string | null;
  cardiologist_consultation_requested?: string | null;
  cardiologist_name?: string | null;
  cardiologist_city?: string | null;
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const ECG_QUESTIONS: Question[] = [
  {
    id: 'ecg_performed',
    text: 'Electrocardiogramme effectue',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ]
  },
  {
    id: 'section_measurements',
    text: 'Mesures',
    type: 'section',
    required: false,
    display_if: {
      '==': [{ var: 'ecg_performed' }, 'yes']
    }
  },
  {
    id: 'heart_rate',
    text: 'Frequence cardiaque (bpm)',
    type: 'number',
    required: false,
    min: 30,
    max: 250,
    display_if: {
      '==': [{ var: 'ecg_performed' }, 'yes']
    }
  },
  {
    id: 'qt_measured',
    text: 'Mesure du QT en seconde (0.xxx)',
    help: 'Ex: 0.400',
    type: 'number',
    required: false,
    min: 0.2,
    max: 0.7,
    display_if: {
      '==': [{ var: 'ecg_performed' }, 'yes']
    }
  },
  {
    id: 'rr_measured',
    text: 'Mesure du RR en seconde (0.xxx)',
    help: 'RR est l\'intervalle de temps separant deux ondes R consecutives. Ex: 0.850',
    type: 'number',
    required: false,
    min: 0.3,
    max: 2.0,
    display_if: {
      '==': [{ var: 'ecg_performed' }, 'yes']
    }
  },
  {
    id: 'qtc_calculated',
    text: 'QT calcule (QTc)',
    help: 'Formule : QTc = QTm / sqrt(RR). Interpretation : < 0.35s (Hypercalcemie/Impregnation digitalique). Normal : 0.35-0.43 (H), 0.35-0.48 (F). Long : >0.43 (H), >0.48 (F). Menacant : >0.468 (H), >0.528 (F).',
    type: 'number',
    required: false,
    readonly: true,
    display_if: {
      '==': [{ var: 'ecg_performed' }, 'yes']
    }
  },
  {
    id: 'section_followup',
    text: 'Suivi',
    type: 'section',
    required: false,
    display_if: {
      '==': [{ var: 'ecg_performed' }, 'yes']
    }
  },
  {
    id: 'ecg_sent_to_cardiologist',
    text: 'ECG envoye a un cardiologue ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'ecg_performed' }, 'yes']
    }
  },
  {
    id: 'cardiologist_consultation_requested',
    text: 'Demande de consultation ou d\'avis aupres d\'un cardiologue',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'ecg_performed' }, 'yes']
    }
  },
  {
    id: 'section_cardiologist_details',
    text: 'Coordonnees Cardiologue',
    type: 'section',
    required: false,
    display_if: {
      'and': [
        { '==': [{ var: 'ecg_performed' }, 'yes'] },
        { '==': [{ var: 'cardiologist_consultation_requested' }, 'yes'] }
      ]
    }
  },
  {
    id: 'cardiologist_name',
    text: 'Nom du cardiologue',
    type: 'text',
    required: false,
    display_if: {
      'and': [
        { '==': [{ var: 'ecg_performed' }, 'yes'] },
        { '==': [{ var: 'cardiologist_consultation_requested' }, 'yes'] }
      ]
    }
  },
  {
    id: 'cardiologist_city',
    text: 'Ville du cardiologue',
    type: 'text',
    required: false,
    display_if: {
      'and': [
        { '==': [{ var: 'ecg_performed' }, 'yes'] },
        { '==': [{ var: 'cardiologist_consultation_requested' }, 'yes'] }
      ]
    }
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const ECG_DEFINITION = {
  id: 'ecg',
  code: 'ECG',
  title: 'Fiche de Recueil ECG (Electrocardiogramme)',
  description: 'Formulaire de saisie des parametres electrocardiographiques avec calcul du QTc et criteres de gravite',
  questions: ECG_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// QTc Computation (Bazett's formula)
// ============================================================================

export function computeQTc(qt_measured: number | null, rr_measured: number | null): number | null {
  if (qt_measured === null || rr_measured === null || rr_measured <= 0) {
    return null;
  }
  // Bazett's formula: QTc = QT / sqrt(RR)
  return Math.round((qt_measured / Math.sqrt(rr_measured)) * 1000) / 1000;
}

// ============================================================================
// QTc Interpretation
// ============================================================================

export type QTcCategory = 'short' | 'normal' | 'borderline' | 'prolonged' | 'critical' | null;

export interface QTcInterpretationInput {
  qtc: number | null;
  gender: 'M' | 'F' | null;
}

export function getQTcCategory(qtc: number | null, gender: 'M' | 'F' | null): QTcCategory {
  if (qtc === null) return null;
  
  // Short QT (< 0.35s)
  if (qtc < 0.35) return 'short';
  
  // Gender-specific thresholds
  if (gender === 'M') {
    if (qtc <= 0.43) return 'normal';
    if (qtc <= 0.468) return 'prolonged';
    return 'critical';
  } else if (gender === 'F') {
    if (qtc <= 0.48) return 'normal';
    if (qtc <= 0.528) return 'prolonged';
    return 'critical';
  }
  
  // Default (unknown gender) - use female thresholds (more conservative)
  if (qtc <= 0.48) return 'normal';
  if (qtc <= 0.528) return 'prolonged';
  return 'critical';
}

export function getQTcCategoryLabel(category: QTcCategory): string {
  switch (category) {
    case 'short':
      return 'QT court (hypercalcemie/digitalique)';
    case 'normal':
      return 'Normal';
    case 'borderline':
      return 'Limite';
    case 'prolonged':
      return 'QT long';
    case 'critical':
      return 'QT menacant (risque arythmie)';
    default:
      return 'Non determine';
  }
}

export function interpretQTc(qtc: number | null, gender: 'M' | 'F' | null): string {
  if (qtc === null) return 'QTc non calculable.';
  
  const category = getQTcCategory(qtc, gender);
  const label = getQTcCategoryLabel(category);
  const genderLabel = gender === 'M' ? 'homme' : gender === 'F' ? 'femme' : 'genre inconnu';
  
  return `QTc: ${qtc}s (${genderLabel}). ${label}.`;
}

// ============================================================================
// Combined Analysis Function
// ============================================================================

export interface EcgAnalysisInput {
  ecg_performed: string | null;
  qt_measured: number | null;
  rr_measured: number | null;
  heart_rate: number | null;
  gender: 'M' | 'F' | null;
}

export interface EcgAnalysisResult {
  performed: boolean;
  qtc: number | null;
  qtc_category: QTcCategory;
  heart_rate_category: 'bradycardia' | 'normal' | 'tachycardia' | null;
  interpretation: string;
  requires_cardiology_review: boolean;
}

export function analyzeEcg(input: EcgAnalysisInput): EcgAnalysisResult {
  const performed = input.ecg_performed === 'yes';
  
  if (!performed) {
    return {
      performed: false,
      qtc: null,
      qtc_category: null,
      heart_rate_category: null,
      interpretation: 'ECG non effectue.',
      requires_cardiology_review: false
    };
  }
  
  const qtc = computeQTc(input.qt_measured, input.rr_measured);
  const qtc_category = getQTcCategory(qtc, input.gender);
  
  // Heart rate category
  let heart_rate_category: 'bradycardia' | 'normal' | 'tachycardia' | null = null;
  if (input.heart_rate !== null) {
    if (input.heart_rate < 60) heart_rate_category = 'bradycardia';
    else if (input.heart_rate > 100) heart_rate_category = 'tachycardia';
    else heart_rate_category = 'normal';
  }
  
  // Build interpretation
  const parts: string[] = [];
  if (input.heart_rate !== null) {
    const hrLabel = heart_rate_category === 'bradycardia' ? 'bradycardie' :
                    heart_rate_category === 'tachycardia' ? 'tachycardie' : 'normal';
    parts.push(`FC: ${input.heart_rate} bpm (${hrLabel})`);
  }
  parts.push(interpretQTc(qtc, input.gender));
  
  // Determine if cardiology review is needed
  const requires_cardiology_review = 
    qtc_category === 'prolonged' || 
    qtc_category === 'critical' ||
    qtc_category === 'short' ||
    heart_rate_category === 'bradycardia' ||
    heart_rate_category === 'tachycardia';
  
  if (requires_cardiology_review) {
    parts.push('Avis cardiologique recommande.');
  }
  
  return {
    performed,
    qtc,
    qtc_category,
    heart_rate_category,
    interpretation: parts.join(' '),
    requires_cardiology_review
  };
}
