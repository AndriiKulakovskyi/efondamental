// eFondaMental Platform - Diagnostic (EBIP_SCR_DIAG)
// Bipolar Screening - Medical questionnaire

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarDiagnosticResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  date_recueil: string | null;
  evaluator_name?: string | null;
  diag_prealable: 'oui' | 'non' | 'je_ne_sais_pas';
  diag_evoque: 'oui' | 'non' | 'differe';
  bilan_programme: 'oui' | 'non' | null;
  bilan_programme_precision: 
    | 'diagnostic_refuse'
    | 'etat_clinique_incompatible'
    | 'consultation_suffisante'
    | 'patient_non_disponible'
    | 'refus_patient'
    | 'autre'
    | null;
  diag_recuse_precision:
    | 'edm_unipolaire'
    | 'schizo_affectif'
    | 'schizophrene'
    | 'borderline'
    | 'autres_troubles_personnalite'
    | 'addiction'
    | 'autres'
    | 'ne_sais_pas'
    | null;
  diag_recuse_autre_text: string | null;
  lettre_information: 'oui' | 'non';
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarDiagnosticResponseInsert = Omit<
  BipolarDiagnosticResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const DIAGNOSTIC_QUESTIONS: Question[] = [
  {
    id: 'date_recueil',
    text: 'Date de recueil des informations',
    type: 'date',
    required: true,
    metadata: { default: 'today' }
  },
  {
    id: 'evaluator_name',
    text: 'Nom du médecin évaluateur',
    type: 'text',
    required: false,
  },
  {
    id: 'diag_prealable',
    text: 'Diagnostic de trouble bipolaire pose prealablement',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'je_ne_sais_pas', label: 'Je ne sais pas' }
    ]
  },
  {
    id: 'diag_evoque',
    text: 'Diagnostic de trouble bipolaire evoque au terme du screening',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'differe', label: 'Differe' }
    ]
  },

  // Branch 1: If 'oui' -> Bilan programme
  {
    id: 'bilan_programme',
    text: 'Bilan programme',
    type: 'single_choice',
    required: false,
    display_if: {
      "==": [{ "var": "answers.diag_evoque" }, "oui"]
    },
    required_if: {
      "==": [{ "var": "answers.diag_evoque" }, "oui"]
    },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'bilan_programme_precision',
    text: 'Si non, preciser',
    type: 'single_choice',
    required: false,
    display_if: {
      "and": [
        { "==": [{ "var": "answers.diag_evoque" }, "oui"] },
        { "==": [{ "var": "answers.bilan_programme" }, "non"] }
      ]
    },
    required_if: {
      "and": [
        { "==": [{ "var": "answers.diag_evoque" }, "oui"] },
        { "==": [{ "var": "answers.bilan_programme" }, "non"] }
      ]
    },
    options: [
      { code: 'diagnostic_refuse', label: 'Diagnostic refuse' },
      { code: 'etat_clinique_incompatible', label: 'Etat clinique non compatible lors de la visite de screening' },
      { code: 'consultation_suffisante', label: 'Consultation specialisee de screening suffisante pour donner un avis' },
      { code: 'patient_non_disponible', label: 'Patient non disponible' },
      { code: 'refus_patient', label: 'Refus du patient' },
      { code: 'autre', label: 'Autre' }
    ]
  },

  // Branch 2: If 'non' -> Preciser diagnostic probable
  {
    id: 'diag_recuse_precision',
    text: 'Si diagnostic recuse lors du screening, preciser le diagnostic le plus probable',
    type: 'single_choice',
    required: false,
    display_if: {
      "==": [{ "var": "answers.diag_evoque" }, "non"]
    },
    required_if: {
      "==": [{ "var": "answers.diag_evoque" }, "non"]
    },
    options: [
      { code: 'edm_unipolaire', label: 'EDM / Unipolaire' },
      { code: 'schizo_affectif', label: 'Schizo-affectif' },
      { code: 'schizophrene', label: 'Schizophrene' },
      { code: 'borderline', label: 'Borderline' },
      { code: 'autres_troubles_personnalite', label: 'Autres troubles de la personnalite' },
      { code: 'addiction', label: 'Addiction' },
      { code: 'autres', label: 'Autres' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'diag_recuse_autre_text',
    text: 'Preciser (Autres)',
    type: 'text',
    required: false,
    display_if: {
      "and": [
        { "==": [{ "var": "answers.diag_evoque" }, "non"] },
        { "==": [{ "var": "answers.diag_recuse_precision" }, "autres"] }
      ]
    },
    required_if: {
      "and": [
        { "==": [{ "var": "answers.diag_evoque" }, "non"] },
        { "==": [{ "var": "answers.diag_recuse_precision" }, "autres"] }
      ]
    }
  },

  // Lettre d'information
  {
    id: 'lettre_information',
    text: "Lettre d'information remise au patient",
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
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

export const DIAGNOSTIC_DEFINITION: QuestionnaireDefinition = {
  id: 'diagnostic',
  code: 'EBIP_SCR_DIAG',
  title: 'Diagnostic',
  description: 'Evaluation diagnostique et orientation',
  questions: DIAGNOSTIC_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// No scoring for this questionnaire - it's a clinical form
// ============================================================================
