// eFondaMental Platform - Schizophrenia Dossier Infirmier (INF_DOSSIER_INFIRMIER)
// Nurse assessment capturing physical parameters, blood pressure, and ECG data

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaDossierInfirmierResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Section 1: Physical Parameters
  taille?: number | null; // Height in cm
  poids?: number | null; // Weight in kg
  bmi?: number | null; // Computed: poids / (taille/100)^2
  peri_abdo?: number | null; // Abdominal circumference in cm
  
  // Section 2: Blood Pressure - Lying Down
  psc?: number | null; // Systolic pressure lying (mmHg)
  pdc?: number | null; // Diastolic pressure lying (mmHg)
  tensionc?: string | null; // Combined tension lying
  
  // Section 3: ECG
  rad_electrocardiogramme?: 'Oui' | 'Non' | null; // ECG performed?
  mesqt?: number | null; // QT measurement in seconds
  elec_rr?: number | null; // RR interval in seconds
  elec_qtc?: number | null; // Computed: QT / sqrt(RR)
  rad_electrocardiogramme_envoi?: 'Oui' | 'Non' | null; // ECG sent to cardiologist?
  rad_electrocardiogramme_valide?: 'Oui' | 'Non' | null; // Consultation request to cardiologist?
  
  // Metadata
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaDossierInfirmierResponseInsert = Omit<
  SchizophreniaDossierInfirmierResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'bmi' | 'elec_qtc'
>;

// ============================================================================
// Questions
// ============================================================================

export const SZ_DOSSIER_INFIRMIER_QUESTIONS: Question[] = [
  // ========================================================================
  // Section 1: Physical Parameters (Parametres physiques)
  // ========================================================================
  {
    id: 'section_physical_params',
    text: 'Parametres physiques',
    type: 'section',
    required: false
  },
  {
    id: 'taille',
    text: 'Taille en cm',
    type: 'number',
    required: false,
    min: 50,
    max: 250
  },
  {
    id: 'poids',
    text: 'Poids en kg',
    type: 'number',
    required: false,
    min: 20,
    max: 300
  },
  {
    id: 'bmi',
    text: 'BMI',
    help: '18,5 a 25 : normal\n25 a 30 : surpoids\n30 a 35 : obesite\nAu-dela de 40 : obesite morbide',
    type: 'number',
    required: false,
    readonly: true,
    min: 5,
    max: 100
  },
  {
    id: 'peri_abdo',
    text: 'Perimetre abdominal en cm',
    help: 'A mesurer au niveau de l\'ombilic',
    type: 'number',
    required: false,
    min: 0,
    max: 250
  },

  // ========================================================================
  // Section 2: Blood Pressure & Heart Rate - Lying Down
  // ========================================================================
  {
    id: 'section_bp_lying',
    text: 'Pression Arterielle Couche en mm de Mercure',
    type: 'section',
    required: false
  },
  {
    id: 'psc',
    text: 'Pression Systolique',
    type: 'number',
    required: false,
    min: 40,
    max: 300
  },
  {
    id: 'pdc',
    text: 'Pression Diastolique',
    type: 'number',
    required: false,
    min: 30,
    max: 300
  },
  {
    id: 'tensionc',
    text: 'Tension couche',
    type: 'text',
    required: false,
    readonly: true,
    min: 10,
    max: 400
  },

  // ========================================================================
  // Section 3: ECG (Electrocardiogramme)
  // ========================================================================
  {
    id: 'section_ecg',
    text: 'ECG',
    type: 'section',
    required: false
  },
  {
    id: 'rad_electrocardiogramme',
    text: 'ECG realise',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'mesqt',
    text: 'Mesure du QT (en seconde)',
    help: 'Valeur typique entre 0.30 et 0.50 secondes',
    type: 'number',
    required: false,
    min: 0,
    max: 2,
    display_if: {
      '==': [{ var: 'rad_electrocardiogramme' }, 'Oui']
    }
  },
  {
    id: 'elec_rr',
    text: 'Mesure du RR (en seconde)',
    help: 'Intervalle de temps separant 2 ondes R consecutives, mesure directement sur l\'ECG ou calcule en divisant la frequence cardiaque du patient par 60. Valeur typique entre 0.6 et 1.2 secondes.',
    type: 'number',
    required: false,
    min: 0,
    max: 3,
    display_if: {
      '==': [{ var: 'rad_electrocardiogramme' }, 'Oui']
    }
  },
  {
    id: 'elec_qtc',
    text: 'QT calcule',
    help: 'Si le QTc est inferieur a 0.35 secondes, il faut rechercher une hypercalcemie ou une impregnation digitalique.\nUn QTc compris entre 0.35 et 0.43 chez l\'homme est normal.\nUn QTc compris entre 0.35 et 0.48 chez la femme est normal.\nChez l\'homme, un QTc superieur a 0.43 est long, superieur a 0.468 est long menacant.\nChez la femme, un QTc superieur a 0.48 est long, superieur a 0.528 est long menacant.',
    type: 'number',
    required: false,
    readonly: true,
    min: 0,
    max: 1,
    display_if: {
      '==': [{ var: 'rad_electrocardiogramme' }, 'Oui']
    }
  },
  {
    id: 'rad_electrocardiogramme_envoi',
    text: 'ECG envoye a un cardiologue',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'rad_electrocardiogramme' }, 'Oui']
    }
  },
  {
    id: 'rad_electrocardiogramme_valide',
    text: 'Demande de consultation ou d\'avis aupres d\'un cardiologue',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'rad_electrocardiogramme' }, 'Oui']
    }
  },
  {
    id: 'titre_cardio',
    text: 'Veuillez indiquer les coordonnees du cardiologue dans la section Carnet d\'adresses',
    type: 'instruction',
    required: false,
    display_if: {
      '==': [{ var: 'rad_electrocardiogramme_valide' }, 'Oui']
    }
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

export const SZ_DOSSIER_INFIRMIER_DEFINITION: QuestionnaireDefinition = {
  id: 'sz_dossier_infirmier',
  code: 'DOSSIER_INFIRMIER_SZ',
  title: 'Dossier infirmier',
  description: 'Questionnaire de recueil des parametres physiques, pression arterielle et ECG pour l\'evaluation initiale schizophrenie',
  questions: SZ_DOSSIER_INFIRMIER_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Scoring / Computed Fields
// ============================================================================

/**
 * Compute BMI from height (cm) and weight (kg)
 */
export function computeBMI(taille?: number | null, poids?: number | null): number | null {
  if (!taille || !poids || taille <= 0) return null;
  const heightInMeters = taille / 100;
  return Math.round((poids / (heightInMeters * heightInMeters)) * 10) / 10;
}

/**
 * Compute corrected QT interval using Bazett's formula
 * QTc = QT / sqrt(RR)
 */
export function computeQTc(mesqt?: number | null, elec_rr?: number | null): number | null {
  if (!mesqt || !elec_rr || elec_rr <= 0) return null;
  return Math.round((mesqt / Math.sqrt(elec_rr)) * 1000) / 1000;
}

/**
 * Get BMI category
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Insuffisance ponderale';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Surpoids';
  if (bmi < 35) return 'Obesite';
  if (bmi < 40) return 'Obesite severe';
  return 'Obesite morbide';
}

/**
 * Interpret QTc value based on sex
 */
export function interpretQTc(qtc: number, sex: 'M' | 'F'): string {
  if (qtc < 0.35) return 'Court - rechercher hypercalcemie ou impregnation digitalique';
  
  if (sex === 'M') {
    if (qtc <= 0.43) return 'Normal';
    if (qtc <= 0.468) return 'Long';
    return 'Long menacant';
  } else {
    if (qtc <= 0.48) return 'Normal';
    if (qtc <= 0.528) return 'Long';
    return 'Long menacant';
  }
}
