// eFondaMental Platform - Schizophrenia Questionnaire Definitions
// Questionnaires for schizophrenia screening visits

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from './questionnaires';

// ============================================================================
// SCHIZOPHRENIA SCREENING DIAGNOSTIC QUESTIONNAIRE
// ============================================================================

export const SZ_DIAGNOSTIC_QUESTIONS: Question[] = [
  // Q1: Date de recueil des informations
  {
    id: 'date_screening',
    text: 'Date de recueil des informations',
    type: 'date',
    required: true,
    section: 'diagnostic',
    metadata: { default: 'today' }
  },
  
  // Q2: Nom du medecin evaluateur
  {
    id: 'screening_diag_nommed',
    text: 'Nom du medecin evaluateur',
    type: 'text',
    required: false,
    section: 'diagnostic'
  },
  
  // Q3: Diagnostic de trouble schizophrenique pose prealablement
  {
    id: 'rad_screening_diag_sz_prealable',
    text: 'Diagnostic de trouble schizophrenique pose prealablement',
    type: 'single_choice',
    required: false,
    section: 'diagnostic',
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Q4: Si oui, preciser (conditional on Q3 = 'oui')
  {
    id: 'rad_screening_diag_sz_prealable_preciser',
    text: 'Si oui, preciser',
    type: 'single_choice',
    required: false,
    section: 'diagnostic',
    indentLevel: 1,
    display_if: {
      "==": [{ "var": "answers.rad_screening_diag_sz_prealable" }, "oui"]
    },
    required_if: {
      "==": [{ "var": "answers.rad_screening_diag_sz_prealable" }, "oui"]
    },
    options: [
      { code: 'schizophrenie', label: 'Schizophrenie' },
      { code: 'trouble_schizophreniforme', label: 'Trouble schizophreniforme' },
      { code: 'trouble_schizo_affectif', label: 'Trouble schizo-affectif' },
      { code: 'trouble_psychotique_bref', label: 'Trouble psychotique bref' }
    ]
  },
  
  // Q5: Diagnostic de trouble schizophrenique evoque au terme du screening
  {
    id: 'rad_screening_diag_sz_evoque',
    text: 'Diagnostic de trouble schizophrenique evoque au terme du screening',
    type: 'single_choice',
    required: false,
    section: 'diagnostic',
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'differe', label: 'Differe' }
    ]
  },
  
  // Q6: Si diagnostic recuse, preciser (conditional on Q5 = 'non')
  {
    id: 'rad_screening_diag_nonsz',
    text: 'Si diagnostic recuse lors du screening, preciser le diagnostic le plus probable',
    type: 'single_choice',
    required: false,
    section: 'diagnostic',
    indentLevel: 1,
    display_if: {
      "==": [{ "var": "answers.rad_screening_diag_sz_evoque" }, "non"]
    },
    required_if: {
      "==": [{ "var": "answers.rad_screening_diag_sz_evoque" }, "non"]
    },
    options: [
      { code: 'borderline', label: 'Borderline' },
      { code: 'autres_troubles_personnalite', label: 'Autres troubles de la personnalite' },
      { code: 'trouble_bipolaire', label: 'Trouble bipolaire' },
      { code: 'edm_unipolaire', label: 'EDM / Unipolaire' },
      { code: 'addiction', label: 'Addiction' },
      { code: 'autres', label: 'Autres' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  
  // Q7: Preciser (conditional on Q6 = 'autres')
  {
    id: 'screening_diag_nonsz_preciser',
    text: 'Preciser',
    type: 'text',
    required: false,
    section: 'diagnostic',
    indentLevel: 2,
    display_if: {
      "and": [
        { "==": [{ "var": "answers.rad_screening_diag_sz_evoque" }, "non"] },
        { "==": [{ "var": "answers.rad_screening_diag_nonsz" }, "autres"] }
      ]
    },
    required_if: {
      "and": [
        { "==": [{ "var": "answers.rad_screening_diag_sz_evoque" }, "non"] },
        { "==": [{ "var": "answers.rad_screening_diag_nonsz" }, "autres"] }
      ]
    }
  },
  
  // Q8: Preciser (conditional on Q5 = 'differe')
  {
    id: 'screening_diag_differe_preciser',
    text: 'Preciser',
    type: 'text',
    required: false,
    section: 'diagnostic',
    indentLevel: 1,
    display_if: {
      "==": [{ "var": "answers.rad_screening_diag_sz_evoque" }, "differe"]
    },
    required_if: {
      "==": [{ "var": "answers.rad_screening_diag_sz_evoque" }, "differe"]
    }
  },
  
  // Q9: Bilan programme
  {
    id: 'rad_screening_diag_bilan_programme',
    text: 'Bilan programme',
    type: 'single_choice',
    required: false,
    section: 'diagnostic',
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // Q10: Si non, preciser (conditional on Q9 = 'non')
  {
    id: 'rad_screening_diag_bilan_programme_non',
    text: 'Si non, preciser',
    type: 'single_choice',
    required: false,
    section: 'diagnostic',
    indentLevel: 1,
    display_if: {
      "==": [{ "var": "answers.rad_screening_diag_bilan_programme" }, "non"]
    },
    required_if: {
      "==": [{ "var": "answers.rad_screening_diag_bilan_programme" }, "non"]
    },
    options: [
      { code: 'diagnostic_recuse', label: 'Diagnostic recuse' },
      { code: 'etat_clinique_non_compatible', label: 'Etat clinique non compatible lors de la visite de screening' },
      { code: 'consultation_suffisante', label: 'Consultation specialisee de screening suffisante pour donner un avis' },
      { code: 'patient_non_disponible', label: 'Patient non disponible' },
      { code: 'refus_patient', label: 'Refus du patient' },
      { code: 'autre', label: 'Autre' }
    ]
  },
  
  // Q11: Date de l'evaluation en Centre Expert (conditional on Q9 = 'oui')
  {
    id: 'date_screening_diag_bilan_programme',
    text: "Date de l'evaluation en Centre Expert",
    type: 'date',
    required: false,
    section: 'diagnostic',
    indentLevel: 1,
    display_if: {
      "==": [{ "var": "answers.rad_screening_diag_bilan_programme" }, "oui"]
    },
    required_if: {
      "==": [{ "var": "answers.rad_screening_diag_bilan_programme" }, "oui"]
    }
  },
  
  // Q12: Lettre d'information remise au patient
  {
    id: 'rad_screening_diag_lettre_info',
    text: "Lettre d'information remise au patient",
    type: 'single_choice',
    required: false,
    section: 'diagnostic',
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  }
];

export const SZ_DIAGNOSTIC_DEFINITION: QuestionnaireDefinition = {
  id: 'sz_diagnostic',
  code: 'SCREENING_DIAGNOSTIC_SZ',
  title: 'Diagnostic',
  description: 'Questionnaire de diagnostic pour la visite de screening schizophrenie - recueille les informations sur le diagnostic du trouble schizophrenique',
  questions: SZ_DIAGNOSTIC_QUESTIONS,
  metadata: {
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// SCHIZOPHRENIA SCREENING ORIENTATION CENTRE EXPERT QUESTIONNAIRE
// ============================================================================

export const SZ_ORIENTATION_QUESTIONS: Question[] = [
  // Q1: Patient souffrant d'un trouble evocateur d'une schizophrenie
  {
    id: 'rad_screening_orientation_sz',
    text: "Patient souffrant d'un trouble evocateur d'une schizophrenie",
    type: 'single_choice',
    required: true,
    section: 'orientation',
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // Q2: Etat psychique compatible avec l'evaluation
  {
    id: 'rad_screening_orientation_psychique',
    text: "Etat psychique compatible avec l'evaluation",
    type: 'single_choice',
    required: true,
    section: 'orientation',
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // Q3: Prise en charge a 100% ou accord du patient pour assumer les frais
  {
    id: 'rad_screening_orientation_priseencharge',
    text: 'Prise en charge a 100% ou accord du patient pour assumer les frais',
    type: 'single_choice',
    required: true,
    section: 'orientation',
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // Q4: Accord du patient pour une evaluation dans le cadre du centre expert
  {
    id: 'rad_screening_orientation_accord_patient',
    text: 'Accord du patient pour une evaluation dans le cadre du centre expert',
    type: 'single_choice',
    required: true,
    section: 'orientation',
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  }
];

export const SZ_ORIENTATION_DEFINITION: QuestionnaireDefinition = {
  id: 'sz_orientation',
  code: 'SCREENING_ORIENTATION_SZ',
  title: 'Orientation Centre Expert',
  description: "Questionnaire de verification des criteres d'eligibilite pour l'evaluation en Centre Expert - verifie que le patient remplit les conditions necessaires",
  questions: SZ_ORIENTATION_QUESTIONS,
  metadata: {
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// SCHIZOPHRENIA DOSSIER INFIRMIER (INITIAL EVALUATION - NURSE ASSESSMENT)
// ============================================================================
// Captures physical parameters, blood pressure, and ECG data for schizophrenia
// initial evaluation visits.

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

export const SZ_DOSSIER_INFIRMIER_DEFINITION: QuestionnaireDefinition = {
  id: 'sz_dossier_infirmier',
  code: 'INF_DOSSIER_INFIRMIER',
  title: 'Dossier infirmier',
  description: 'Questionnaire de recueil des parametres physiques, pression arterielle et ECG pour l\'evaluation initiale schizophrenie',
  questions: SZ_DOSSIER_INFIRMIER_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional'
  }
};
