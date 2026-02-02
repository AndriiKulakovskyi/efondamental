// eFondaMental Platform - WAIS-IV Critères Cliniques
// Schizophrenia Initial Evaluation - Neuropsy Module - WAIS-IV Subgroup
// Pre-evaluation screening to determine patient eligibility for neuropsychological testing

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaWais4CriteriaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // General Information
  date_neuropsychologie: string | null;  // Test battery administration date
  neuro_age: number | null;              // Patient age at evaluation
  rad_dernier_eval: string | null;       // Time since last evaluation
  annees_etudes: number | null;          // Years of education (normative stratification)
  // Clinical Criteria
  rad_neuro_lang: number | null;         // French language proficiency (0/1)
  rad_neuro_normo: number | null;        // Clinical state compatible (0/1, required)
  rad_neuro_dalt: number | null;         // No color blindness (0/1)
  rad_neuro_tbaud: number | null;        // No hearing impairment (0/1)
  rad_neuro_sismo: number | null;        // No ECT in past 6 months (0/1)
  rad_abs_ep_3month: number | null;      // Learning disorder suspicion (0/1)
  chk_sismo_choix: string | null;        // Details if learning disorder suspected
  rad_neuro_psychotrope: number | null;  // Psychotropic treatment (0/1)
  // Acceptance
  accepted_for_neuropsy_evaluation: boolean | null;  // Final eligibility
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaWais4CriteriaResponseInsert = Omit<
  SchizophreniaWais4CriteriaResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

// Condition to show learning disorder details field when "Oui" is selected (code 1)
const SHOW_WHEN_LEARNING_DISORDER = { '==': [{ 'var': 'rad_abs_ep_3month' }, 1] };

export const WAIS4_CRITERIA_SZ_QUESTIONS: Question[] = [
  // ============================================
  // Section: Informations Générales
  // ============================================
  {
    id: 'date_neuropsychologie',
    section: 'Informations Générales',
    text: 'Date de passation de la batterie de test neuropsychologique',
    type: 'date',
    required: true
  },
  {
    id: 'neuro_age',
    section: 'Informations Générales',
    text: 'Age du patient',
    type: 'number',
    required: true,
    min: 16,
    max: 90
  },
  {
    id: 'rad_dernier_eval',
    section: 'Informations Générales',
    text: 'Temps écoulé depuis la dernière évaluation de l\'état du patient',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'moins_semaine', label: 'Moins d\'une semaine', score: 0 },
      { code: 'plus_semaine', label: 'Plus d\'une semaine', score: 0 }
    ]
  },
  {
    id: 'annees_etudes',
    section: 'Informations Générales',
    text: 'Nombre d\'années d\'études (depuis les cours préparatoires)',
    type: 'number',
    required: true,
    min: 0,
    max: 30
  },

  // ============================================
  // Section: Critères Cliniques
  // ============================================
  {
    id: 'rad_neuro_lang',
    section: 'Critères Cliniques',
    text: 'Maîtrise suffisante de la langue française',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'rad_neuro_normo',
    section: 'Critères Cliniques',
    text: 'État clinique compatible avec la passation des tests cognitifs',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },

  // ============================================
  // Section: Critères d'Exclusion / Santé
  // ============================================
  {
    id: 'rad_neuro_dalt',
    section: 'Critères d\'Exclusion / Santé',
    text: 'Absence de daltonisme ou de trouble visuel invalidant',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'rad_neuro_tbaud',
    section: 'Critères d\'Exclusion / Santé',
    text: 'Absence de troubles auditifs non appareillés',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'rad_neuro_sismo',
    section: 'Critères d\'Exclusion / Santé',
    text: 'Pas de traitement par sismothérapie dans les 6 mois écoulés',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'rad_abs_ep_3month',
    section: 'Critères d\'Exclusion / Santé',
    text: 'Suspicion d\'un trouble des apprentissages et des acquisitions',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 },
      { code: 2, label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'chk_sismo_choix',
    section: 'Critères d\'Exclusion / Santé',
    text: 'Préciser :',
    type: 'multiple_choice',
    required: false,
    display_if: SHOW_WHEN_LEARNING_DISORDER,
    options: [
      { code: 'dyslexie', label: 'Dyslexie', score: 0 },
      { code: 'dysphasie', label: 'Dysphasie', score: 0 },
      { code: 'dyspraxie', label: 'Dyspraxie', score: 0 },
      { code: 'dysgraphie', label: 'Dysgraphie', score: 0 }
    ]
  },
  {
    id: 'rad_neuro_psychotrope',
    section: 'Critères d\'Exclusion / Santé',
    text: 'Traitement psychotrope',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 0 },
      { code: 2, label: 'Ne sais pas', score: 0 }
    ]
  },

  // ============================================
  // Section: Acceptation pour Évaluation
  // ============================================
  {
    id: 'warning_instruction',
    section: 'Acceptation pour Évaluation',
    text: 'Si NON à une ou plusieurs de ces questions : l\'évaluation neuropsychologique peut être modifiée.',
    type: 'instruction',
    required: false
  },
  {
    id: 'accepted_for_neuropsy_evaluation',
    section: 'Acceptation pour Évaluation',
    text: 'Patient accepté pour l\'évaluation Neuropsychologique',
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

export const WAIS4_CRITERIA_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'wais4_criteria_sz',
  code: 'WAIS4_CRITERIA_SZ',
  title: 'Critères cliniques - WAIS-IV',
  description: 'Fiche de recueil des critères cliniques pour déterminer l\'éligibilité du patient à l\'évaluation neuropsychologique utilisant la batterie WAIS-IV.',
  instructions: 'Cette section vérifie que le patient remplit les conditions requises pour une évaluation cognitive valide. Les champs "Age du patient" et "Années d\'études" sont utilisés pour le calcul des scores normatifs dans tous les subtests WAIS-IV.',
  questions: WAIS4_CRITERIA_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    purpose: 'Pre-evaluation screening to ensure valid neuropsychological assessment conditions'
  }
};
