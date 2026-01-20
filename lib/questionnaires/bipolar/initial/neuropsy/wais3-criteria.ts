// eFondaMental Platform - WAIS-III Clinical Criteria
// Bipolar Initial Evaluation - Neuropsy Module
// Note: Uses same questions as WAIS-IV Criteria

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarWais3CriteriaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // General Information
  collection_date: string | null;
  assessment_time: string | null;
  age: number | null;
  laterality: string | null;
  native_french_speaker: number | null;
  // Clinical State
  time_since_last_eval: string | null;
  patient_euthymic: number | null;
  no_episode_3months: number | null;
  // Sociodemographic Data
  socio_prof_data_present: number | null;
  years_of_education: number | null;
  // Exclusion Criteria / Health
  no_visual_impairment: number | null;
  no_hearing_impairment: number | null;
  no_ect_past_year: number | null;
  // Acceptance
  accepted_for_neuropsy_evaluation: number | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarWais3CriteriaResponseInsert = Omit<
  BipolarWais3CriteriaResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary (same as WAIS-IV Criteria)
// ============================================================================

export const WAIS3_CRITERIA_QUESTIONS: Question[] = [
  {
    id: 'collection_date',
    section: 'Informations Generales',
    text: 'Date de recueil des informations',
    type: 'date',
    required: true
  },
  {
    id: 'assessment_time',
    section: 'Informations Generales',
    text: 'Heure passation bilan',
    type: 'single_choice',
    required: false,
    options: [
      { code: '09h', label: '09h', score: 0 },
      { code: '10h', label: '10h', score: 0 },
      { code: '11h', label: '11h', score: 0 },
      { code: '12h', label: '12h', score: 0 },
      { code: '13h', label: '13h', score: 0 },
      { code: '14h', label: '14h', score: 0 },
      { code: '15h', label: '15h', score: 0 },
      { code: '16h', label: '16h', score: 0 },
      { code: '17h', label: '17h', score: 0 },
      { code: '18h', label: '18h', score: 0 }
    ]
  },
  {
    id: 'age',
    section: 'Informations Generales',
    text: 'Age du patient (calcule automatiquement)',
    type: 'number',
    required: true,
    readonly: true,
    min: 16,
    max: 90,
    help: 'Calcule automatiquement a partir de la date de naissance et de la date de visite'
  },
  {
    id: 'laterality',
    section: 'Informations Generales',
    text: 'Lateralite',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'gaucher', label: 'Gaucher', score: 0 },
      { code: 'droitier', label: 'Droitier', score: 0 },
      { code: 'ambidextre', label: 'Ambidextre', score: 0 }
    ]
  },
  {
    id: 'native_french_speaker',
    section: 'Informations Generales',
    text: 'Langue maternelle francaise',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'time_since_last_eval',
    section: 'Etat Clinique',
    text: 'Temps ecoule depuis la derniere evaluation de l\'etat du patient',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'moins_semaine', label: 'Moins d\'une semaine', score: 0 },
      { code: 'plus_semaine', label: 'Plus d\'une semaine', score: 0 }
    ]
  },
  {
    id: 'patient_euthymic',
    section: 'Etat Clinique',
    text: 'Patient Normothymique',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'no_episode_3months',
    section: 'Etat Clinique',
    text: 'Absence d\'episode dans les 3 mois precedents',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'socio_prof_data_present',
    section: 'Donnees Socio-demographiques',
    text: 'Presence des donnees socio-professionnelles',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'years_of_education',
    section: 'Donnees Socio-demographiques',
    text: 'Nombre d\'annees d\'etudes (depuis les cours preparatoires)',
    type: 'number',
    required: true,
    readonly: true,
    min: 0,
    help: 'Calcule automatiquement depuis le profil du patient'
  },
  {
    id: 'no_visual_impairment',
    section: 'Criteres d\'Exclusion / Sante',
    text: 'Absence de daltonisme ou de trouble visuel invalidant',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'no_hearing_impairment',
    section: 'Criteres d\'Exclusion / Sante',
    text: 'Absence de troubles auditifs non appareilles',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'no_ect_past_year',
    section: 'Criteres d\'Exclusion / Sante',
    text: 'Pas de traitement par sismotherapie dans l\'annee ecoulee',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'accepted_for_neuropsy_evaluation',
    section: 'Acceptation pour Evaluation',
    text: 'Patient accepte pour l\'evaluation Neuropsychologique',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
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

export const WAIS3_CRITERIA_DEFINITION: QuestionnaireDefinition = {
  id: 'wais3_criteria',
  code: 'WAIS3_CRITERIA',
  title: 'WAIS-III - Criteres cliniques',
  description: 'Fiche de recueil des criteres cliniques et demographiques pour la passation de la WAIS-III.',
  questions: WAIS3_CRITERIA_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
