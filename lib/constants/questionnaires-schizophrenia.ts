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

// ============================================================================
// SCHIZOPHRENIA BILAN BIOLOGIQUE (INITIAL EVALUATION - NURSE ASSESSMENT)
// ============================================================================
// Biological assessment questionnaire for schizophrenia initial evaluation
// Includes biochemistry, lipid panel, liver panel, thyroid panel, CBC, HCG,
// prolactin, psychotropic drug levels, vitamin D, and toxoplasmosis serology

export const SZ_BILAN_BIOLOGIQUE_QUESTIONS: Question[] = [
  // ========================================================================
  // Section: Date
  // ========================================================================
  {
    id: 'section_date',
    text: 'Date de prelevement',
    type: 'section',
    required: false
  },
  {
    id: 'collection_date',
    text: 'Date de prelevement',
    type: 'date',
    required: true,
    metadata: { default: 'today' }
  },

  // ========================================================================
  // Section: BIOCHIMIE
  // ========================================================================
  {
    id: 'section_biochimie',
    text: 'BIOCHIMIE',
    type: 'section',
    required: false
  },
  {
    id: 'rad_prelevement_lieu',
    text: 'Prelevement effectue',
    help: 'Indiquer sur site lorsque l\'analyse est effectuee par le laboratoire du centre hospitalier. Indiquer hors site si l\'analyse est effectuee en dehors du centre hospitalier.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Sur site', label: 'Sur site' },
      { code: 'Hors site', label: 'Hors site' }
    ]
  },
  {
    id: 'titre_avertissement',
    text: 'Attention: Les normes indiquees peuvent etre legerement differentes d\'un centre a l\'autre.',
    type: 'instruction',
    required: false
  },
  {
    id: 'acide_urique',
    text: 'Acide urique (umol/L)',
    help: 'Valeurs acceptees: 40-2000. Valeurs normales: 208-428',
    type: 'number',
    required: false,
    min: 40,
    max: 2000
  },
  {
    id: 'crp',
    text: 'CRP (mg/L)',
    help: 'Valeur maximale acceptee: 100. Valeur normale maximale: 10',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },
  {
    id: 'html_crp_info',
    text: '5 mg/L = 5 microg/mL = 0.5 mg/dL',
    type: 'instruction',
    required: false
  },
  {
    id: 'glycemie',
    text: 'Glycemie a jeun (mmol/L)',
    help: 'Valeur maximale acceptee: 40. Valeurs normales: 3.88-6.1',
    type: 'number',
    required: false,
    min: 0,
    max: 40
  },
  {
    id: 'rad_glycemie',
    text: 'Unite glycemie',
    type: 'single_choice',
    required: false,
    inline: true,
    options: [
      { code: 'mmol_L', label: 'mmol/L' },
      { code: 'g_L', label: 'g/L' }
    ]
  },
  {
    id: 'titre_hemo_glyc_diabete',
    text: '(Glycemie > 7 mmol/L, soit > 1,26 g/L)',
    type: 'instruction',
    required: false
  },
  {
    id: 'hb_gly',
    text: 'Hemoglobine glyquee (%)',
    help: 'Valeur maximale acceptee: 50. Valeur normale maximale: 6. HbA1c > 6.5% indique un diabete.',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'vitd25oh',
    text: '25OH-vitD (nmol/L)',
    type: 'number',
    required: false
  },
  {
    id: 'html_vitd',
    text: 'Vitamine D interpretation: Carence < 25 nmol/L | Insuffisance 25 a 75 nmol/L | Suffisance 75 a 250 nmol/L | Toxicite > 250 nmol/L',
    type: 'instruction',
    required: false
  },

  // ========================================================================
  // Section: BILAN LIPIDIQUE
  // ========================================================================
  {
    id: 'section_lipidique',
    text: 'BILAN LIPIDIQUE',
    type: 'section',
    required: false
  },
  {
    id: 'chol_hdl',
    text: 'Cholesterol HDL (mmol/L)',
    help: 'Valeur maximale: 50. Valeurs normales: 1.1-1.8. HDL = "bon" cholesterol - valeurs elevees sont protectrices.',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'rad_chol_hdl',
    text: 'Unite',
    type: 'single_choice',
    required: false,
    inline: true,
    options: [
      { code: 'mmol/L', label: 'mmol/L' },
      { code: 'g/L', label: 'g/L' }
    ]
  },
  {
    id: 'chol_ldl',
    text: 'Cholesterol LDL (mmol/L)',
    help: 'Valeur maximale: 50. Valeurs normales: 2.6-4.1. LDL = "mauvais" cholesterol - valeurs basses sont preferables.',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'rad_chol_ldl',
    text: 'Unite',
    type: 'single_choice',
    required: false,
    inline: true,
    options: [
      { code: 'mmol/L', label: 'mmol/L' },
      { code: 'g/L', label: 'g/L' }
    ]
  },
  {
    id: 'chol_total',
    text: 'Cholesterol total (mmol/L)',
    help: 'Valeur maximale: 50. Valeurs normales: 4.4-6.1',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'chol_rapport_hdltot',
    text: 'Rapport Total / HDL',
    help: 'Norme inferieure a 5 chez l\'homme et 4,4 chez la femme. Calcule automatiquement: Cholesterol total / Cholesterol HDL. Indicateur de risque cardiovasculaire.',
    type: 'number',
    required: false,
    readonly: true,
    computed: {
      formula: 'chol_total / chol_hdl',
      dependencies: ['chol_total', 'chol_hdl']
    },
    min: 0,
    max: 30
  },
  {
    id: 'triglycerides',
    text: 'Triglycerides (mmol/L)',
    help: 'Valeur maximale: 50. Valeurs normales: 0.5-1.4',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },

  // ========================================================================
  // Section: NFS (NUMERATION FORMULE SANGUINE)
  // ========================================================================
  {
    id: 'section_nfs',
    text: 'NFS (NUMERATION FORMULE SANGUINE)',
    type: 'section',
    required: false
  },
  {
    id: 'gb',
    text: 'Leucocytes, Gb (Giga/L)',
    help: 'Valeurs acceptees: 1-40. Valeurs normales: 4-10. Important pour le suivi sous clozapine (risque d\'agranulocytose).',
    type: 'number',
    required: false,
    min: 1,
    max: 40
  },
  {
    id: 'gr',
    text: 'Hematies, Gr (Tera/L)',
    help: 'Valeurs acceptees: 1-40. Valeurs normales: 4-5',
    type: 'number',
    required: false,
    min: 1,
    max: 40
  },
  {
    id: 'hb',
    text: 'Hemoglobine, Hb (g/dL)',
    help: 'Valeurs acceptees: 5-100. Valeurs normales: 11.5-15. Depistage de l\'anemie.',
    type: 'number',
    required: false,
    min: 5,
    max: 100
  },
  {
    id: 'rad_hb',
    text: 'Unite',
    type: 'single_choice',
    required: false,
    inline: true,
    options: [
      { code: 'g/dL', label: 'g/dL' },
      { code: 'mmol/L', label: 'mmol/L' }
    ]
  },
  {
    id: 'neutrophile',
    text: 'Neutrophiles (G/L)',
    help: 'Valeurs acceptees: 1-50. Valeurs normales: 1.7-7.5. Compte absolu des neutrophiles (ANC) - critique pour le suivi sous clozapine.',
    type: 'number',
    required: false,
    min: 1,
    max: 50
  },
  {
    id: 'eosinophile',
    text: 'Eosinophiles (G/L)',
    help: 'Valeur maximale: 10. Valeur normale maximale: 0.8. Eleve en cas de reactions allergiques ou infections parasitaires.',
    type: 'number',
    required: false,
    min: 0,
    max: 10
  },
  {
    id: 'vgm',
    text: 'VGM (fL)',
    help: 'Valeurs acceptees: 10-1000. Valeurs normales: 80-100. Volume Globulaire Moyen - classification du type d\'anemie.',
    type: 'number',
    required: false,
    min: 10,
    max: 1000
  },
  {
    id: 'plaquettes',
    text: 'Plaquettes (Giga/L)',
    help: 'Valeurs acceptees: 0-2000. Valeurs normales: 150-500. Surveillance du risque de saignement/coagulation.',
    type: 'number',
    required: false,
    min: 0,
    max: 2000
  },

  // ========================================================================
  // Section: DOSAGES HORMONAUX
  // ========================================================================
  {
    id: 'section_hormonaux',
    text: 'DOSAGES HORMONAUX',
    type: 'section',
    required: false
  },
  {
    id: 'titre_prolactine',
    text: 'Si le patient (homme ou femme) est traite par des neuroleptiques ou des antipsychotiques',
    type: 'instruction',
    required: false
  },
  {
    id: 'prolactine',
    text: 'Taux prolactine (mg/L)',
    help: 'Valeur maximale: 5000. Valeur normale maximale: 20. De nombreux antipsychotiques causent une hyperprolactinemie via le blocage des recepteurs D2.',
    type: 'number',
    required: false,
    min: 0,
    max: 5000
  },
  {
    id: 'rad_prolacti',
    text: 'Unite',
    type: 'single_choice',
    required: false,
    inline: true,
    options: [
      { code: 'mg/L', label: 'mg/L' },
      { code: 'mUI/L', label: 'mUI/L' },
      { code: 'ng/ml', label: 'ng/ml' }
    ]
  },

  // ========================================================================
  // Section: DOSAGE DES PSYCHOTROPES
  // ========================================================================
  {
    id: 'section_psychotropes',
    text: 'DOSAGE DES PSYCHOTROPES',
    type: 'section',
    required: false
  },
  {
    id: 'rad_trt_visite',
    text: 'Le patient est-il traite par anti-psychotiques au moment de la visite?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'titre_prisetraitement',
    text: 'S\'assurer que le patient n\'ait pas pris son traitement le matin du dosage. Si le patient a pris son traitement, ne pas faire le dosage. ATTENTION !!! microg/L = ng/mL',
    type: 'instruction',
    required: false,
    display_if: {
      '==': [{ 'var': 'rad_trt_visite' }, 'Oui']
    }
  },
  {
    id: 'rad_prisetraitement',
    text: 'Prise du traitement par le patient le matin du prelevement',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      '==': [{ 'var': 'rad_trt_visite' }, 'Oui']
    }
  },
  {
    id: 'rad_clozapine',
    text: 'Le patient est-il traite par clozapine?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_trt_visite' }, 'Oui'] },
        { '==': [{ 'var': 'rad_prisetraitement' }, 'Non'] }
      ]
    }
  },
  {
    id: 'clozapine',
    text: 'Dosage plasmatique de la clozapine (ug/L)',
    help: 'Objectif > 350 ng/mL. Plage therapeutique: 350-600 ng/mL. Niveaux > 1000 associes a une toxicite accrue.',
    type: 'number',
    required: false,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_trt_visite' }, 'Oui'] },
        { '==': [{ 'var': 'rad_prisetraitement' }, 'Non'] },
        { '==': [{ 'var': 'rad_clozapine' }, 'Oui'] }
      ]
    }
  },

  // ========================================================================
  // Section: VITAMINE D
  // ========================================================================
  {
    id: 'section_vitamine_d',
    text: 'QUESTIONNAIRE VITAMINE D',
    type: 'section',
    required: false
  },
  {
    id: 'radhtml_vitd_ext',
    text: 'Temps moyen passe a l\'exterieur',
    help: 'L\'exposition au soleil affecte la synthese de vitamine D - moins d\'exposition = risque de carence plus eleve',
    type: 'single_choice',
    required: false,
    options: [
      { code: '1', label: 'moins de 1 heure par semaine' },
      { code: '2', label: 'moins de 1 heure par jour mais plusieurs heures par semaine' },
      { code: '3', label: 'au moins 1 heure par jour en moyenne' },
      { code: '4', label: 'plus de 4 heures par jour' }
    ]
  },
  {
    id: 'radhtml_vitd_cutane',
    text: 'Caracterisation du phototype cutane',
    help: 'Echelle de Fitzpatrick - les types de peau plus fonces (V-VI) ont un risque de carence en vitamine D plus eleve',
    type: 'single_choice',
    required: false,
    options: [
      { code: '1', label: 'phototype I' },
      { code: '2', label: 'phototype II' },
      { code: '3', label: 'phototype III' },
      { code: '4', label: 'phototype IV' },
      { code: '5', label: 'phototype V' },
      { code: '6', label: 'phototype VI' }
    ]
  },
  {
    id: 'html_spec_cutane',
    text: 'Caracterisation du phototype cutane (echelle de Fitzpatrick) - voir document PDF de reference',
    type: 'instruction',
    required: false
  },

  // ========================================================================
  // Section: SEROLOGIE TOXOPLASMOSE
  // ========================================================================
  {
    id: 'section_toxo',
    text: 'SEROLOGIE TOXOPLASMOSE',
    type: 'section',
    required: false
  },
  {
    id: 'html_toxo',
    text: 'Rappel : le dosage est a faire a chaque visite, meme en cas de serologie positive anterieure',
    type: 'instruction',
    required: false
  },
  {
    id: 'rad_toxo',
    text: 'Le patient a-t-il eu une serologie toxoplasmique?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'rad_igm_statut',
    text: 'Le statut IgM est-il positif ?',
    help: 'IgM indique une infection recente ou aigue',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      '==': [{ 'var': 'rad_toxo' }, 'Oui']
    }
  },
  {
    id: 'rad_igg_statut',
    text: 'Le statut IgG est-il positif ?',
    help: 'IgG indique une exposition passee ou une infection chronique',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      '==': [{ 'var': 'rad_toxo' }, 'Oui']
    }
  },
  {
    id: 'toxo_igg',
    text: 'IgG (UI/mL)',
    help: 'Niveau quantitatif d\'IgG - des titres plus eleves peuvent indiquer une infection plus recente ou active',
    type: 'number',
    required: false,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_toxo' }, 'Oui'] },
        { '==': [{ 'var': 'rad_igg_statut' }, 'Oui'] }
      ]
    }
  },
  {
    id: 'html_interpretation',
    text: 'Interpretation: IgM- IgG+ = Infection passee | IgM- IgG- = Pas d\'infection | IgM+ IgG- = Infection precoce | IgM+ IgG+ = Infection actuelle/chronique',
    type: 'instruction',
    required: false,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_toxo' }, 'Oui'] },
        { '==': [{ 'var': 'rad_igg_statut' }, 'Oui'] }
      ]
    }
  }
];

export const SZ_BILAN_BIOLOGIQUE_DEFINITION: QuestionnaireDefinition = {
  id: 'sz_bilan_biologique',
  code: 'INF_BILAN_BIOLOGIQUE_SZ',
  title: 'Bilan biologique',
  description: 'Evaluation biologique complete incluant biochimie, bilan lipidique, hepatique, thyroidien, NFS, HCG, prolactine, dosages psychotropes, vitamine D et serologie toxoplasmose pour l\'evaluation initiale schizophrenie',
  questions: SZ_BILAN_BIOLOGIQUE_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// PANSS (Positive and Negative Syndrome Scale)
// ============================================================================
// 30-item clinician-rated scale for measuring symptom severity of schizophrenia
// Original authors: Kay SR, Fiszbein A, Opler LA (1986)
// French translation: Lepine JP (1989)
// All items rated 1-7:
//   1=Absent, 2=Minimal, 3=Mild, 4=Moderate, 5=Moderate-Severe, 6=Severe, 7=Extreme

// Standard 7-point response options for all PANSS items
// Response options for General Psychopathology subscale (G1-G16)
const PANSS_RESPONSE_OPTIONS = [
  { code: 1, label: 'ABSENT', score: 1 },
  { code: 2, label: 'MINIME', score: 2 },
  { code: 3, label: 'LEGER', score: 3 },
  { code: 4, label: 'MOYEN', score: 4 },
  { code: 5, label: 'MODEREMENT SEVERE', score: 5 },
  { code: 6, label: 'SEVERE', score: 6 },
  { code: 7, label: 'EXTREME', score: 7 }
];

export const PANSS_QUESTIONS: Question[] = [
  // ========================================================================
  // Section 1: Positive Subscale (P1-P7)
  // ========================================================================
  {
    id: 'section_positive',
    text: 'Sous-score positif',
    type: 'section',
    required: false
  },
  {
    id: 'p1',
    text: 'P1. DELIRE',
    help: 'Croyances qui sont non fondees, irrealistes et idiosyncratiques. Evaluation basee sur le contenu de la pensee exprime lors de l\'interview et son influence sur les relations sociales et le comportement.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable; eventuellement a l\'extreme limite de la norme.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Presence d\'une ou deux idees delirantes assez vagues, ni rigides, ni tenaces. Ces idees n\'interferent ni dans la pensee, ni dans les relations sociales, ni dans le comportement.', score: 3 },
      { code: 4, label: '4 - MODERE: Presence d\'un eventail kaleidoscopique d\'idees delirantes peu formees ou instables, ou de quelques idees plus developpees qui interferent occasionnellement dans la pensee, les relations sociales ou le comportement.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Presence de nombreuses idees delirantes tres developpees et tres tenaces qui interferent occasionnellement dans la pensee, les relations sociales ou le comportement.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Presence d\'un ensemble stable d\'idees delirantes qui sont cristallisees, eventuellement systematisees, tres tenaces, et qui interferent de maniere non dissimulee dans la pensee, les relations sociales et le comportement.', score: 6 },
      { code: 7, label: '7 - EXTREME: Presence d\'un ensemble stable d\'idees delirantes qui sont, soit tres systematisees, soit tres nombreuses et qui dominent les aspects principaux de la vie du patient.', score: 7 }
    ]
  },
  {
    id: 'p2',
    text: 'P2. TROUBLES DE LA PENSEE',
    help: 'Processus desorganise de la pensee, caracterise par un dereglement du cheminement finalise (circonstancialite, tangentialite, associations vagues, incoherences, illogisme grossier ou blocage de la pensee). Evaluation basee sur le processus cognitif et verbal examine lors de l\'interview.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable; eventuellement a l\'extreme limite de la norme.', score: 2 },
      { code: 3, label: '3 - FAIBLE: La pensee est circonstancielle, tangentielle ou paralogique. Presence de problemes lors de tensions psychiques.', score: 3 },
      { code: 4, label: '4 - MODERE: Capable de concentrer ses pensees lorsque les echanges sont brefs, mais perd sa precision lorsque la communication se fait plus complexe.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: En general, le patient connait des difficultes pour organiser ses pensees, ce qui se traduit par des actes insenses ou incoherents frequents.', score: 5 },
      { code: 6, label: '6 - PRONONCE: La pensee est serieusement perturbee et intrinsequement inconsequente ce qui entraine des pertes grossieres du sens de l\'a propos.', score: 6 },
      { code: 7, label: '7 - EXTREME: Les pensees sont dereglees au point que le patient devient tout a fait incoherent.', score: 7 }
    ]
  },
  {
    id: 'p3',
    text: 'P3. COMPORTEMENT HALLUCINATOIRE',
    help: 'Rapport verbal ou perceptions comportementales qui ne sont pas provoquees par des stimuli externes (auditif, visuel, olfactif ou somatique). Evaluation basee sur le rapport verbal et manifestations physiques pendant l\'interview et rapports du personnel hospitalier ou de membres de la famille.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable; eventuellement a l\'extreme limite de la norme.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Une ou deux hallucinations clairement developpees mais peu frequentes.', score: 3 },
      { code: 4, label: '4 - MODERE: Les hallucinations se font frequemment, mais ne sont pas continues.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Hallucinations frequentes qui peuvent impliquer plusieurs modalites sensorielles.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Les hallucinations sont presque constamment presentes, provoquant un dereglement important de la pensee et du comportement.', score: 6 },
      { code: 7, label: '7 - EXTREME: Le patient est presque totalement preoccupe par ses hallucinations qui dominent presque completement sa pensee et son comportement.', score: 7 }
    ]
  },
  {
    id: 'p4',
    text: 'P4. EXCITATION',
    help: 'Hyperactivite qui se traduit par un comportement moteur accelere, un taux de reponse aux stimulis plus eleve, une hypervigilance ou une labilite d\'humeur excessive. Evaluation basee sur les manifestations comportementales lors de l\'interview et rapports du personnel hospitalier ou de membres de la famille.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable; eventuellement a l\'extreme limite de la norme.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Tendance a se montrer legerement agite, hypervigilant ou legerement enerve.', score: 3 },
      { code: 4, label: '4 - MODERE: Agitation ou excitation evidente au cours de l\'interview.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Hyperactivite evidente ou nombreuses augmentations de l\'activite motrice.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Une excitation evidente domine toute l\'interview, limite l\'attention du patient.', score: 6 },
      { code: 7, label: '7 - EXTREME: Excitation evidente qui interfere serieusement dans l\'alimentation et le sommeil.', score: 7 }
    ]
  },
  {
    id: 'p5',
    text: 'P5. MEGALOMANIE',
    help: 'Opinion de soi exageree et convictions de superiorite irrealistes, qui peuvent aller jusqu\'au delire. Evaluation basee sur le contenu de la pensee exprime lors de l\'interview et ses influences sur le comportement.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable; eventuellement a l\'extreme limite de la norme.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Vantardise et exces d\'orgueil evidents, mais pas vraiment de delire megalomaniaque.', score: 3 },
      { code: 4, label: '4 - MODERE: Se sent de maniere claire et irrealiste superieur aux autres.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Idees delirantes tres precises a propos de facultes extraordinaires, d\'un statut ou d\'une puissance remarquables.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Idees delirantes tres precises a propos d\'une superiorite tres nette sur plusieurs parametres.', score: 6 },
      { code: 7, label: '7 - EXTREME: La pensee, les relations interpersonnelles et le comportement sont domines par de nombreuses idees delirantes.', score: 7 }
    ]
  },
  {
    id: 'p6',
    text: 'P6. MEFIANCE/COMPLEXE DE PERSECUTION',
    help: 'Impressions irrealistes ou exagerees de persecution qui se refletent dans une certaine circonspection, une attitude mefiante, une hypervigilance soupconneuse ou de veritables idees delirantes. Evaluation basee sur le contenu de la pensee exprime lors de l\'interview et ses influences sur le comportement.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable; eventuellement a l\'extreme limite de la norme.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Attitude reservee, voire franchement mefiante, mais les pensees, interactions et comportement ne sont que tres peu affectes.', score: 3 },
      { code: 4, label: '4 - MODERE: Mefiance evidente et interfere sur le comportement lors de l\'interview.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Le patient fait preuve d\'une mefiance tres marquee, qui peut conduire a un dereglement majeur des relations interpersonnelles.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Delire de persecution profond qui peut etre systematise et qui interfere de maniere notable dans les relations interpersonnelles.', score: 6 },
      { code: 7, label: '7 - EXTREME: La pensee, les relations sociales et le comportement du patient sont domines par un reseau d\'idees delirantes persecutrices prononcees et systematisees.', score: 7 }
    ]
  },
  {
    id: 'p7',
    text: 'P7. HOSTILITE',
    help: 'Expression verbale et non verbale de colere et de ressentiment, voire meme de sarcasme, comportement passif-agressif, insultes et violence. Evaluation basee sur le comportement interpersonnel observe lors de l\'interview et rapports du personnel hospitalier ou de membres de la famille.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable; eventuellement a l\'extreme limite de la norme.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Expression indirecte ou retenue de colere: sarcasme, manque de respect, expressions hostiles et irritabilite occasionnelle.', score: 3 },
      { code: 4, label: '4 - MODERE: Fait montre d\'une attitude clairement hostile, d\'irritabilite frequente.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Le patient est tres irritable et peut se montrer injurieux voire menacant.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Manque de cooperation et insultes ou menaces qui ont une influence notable sur le deroulement de l\'interview.', score: 6 },
      { code: 7, label: '7 - EXTREME: Colere prononcee qui debouche sur un manque total de cooperation ou sur une agressivite physique episodique vis a vis des autres.', score: 7 }
    ]
  },

  // ========================================================================
  // Section 2: Negative Subscale (N1-N7)
  // ========================================================================
  {
    id: 'section_negative',
    text: 'Sous-score negatif',
    type: 'section',
    required: false
  },
  {
    id: 'n1',
    text: 'N1. AFFECT EMOUSSE',
    help: 'Reponse emotionnelle diminuee qui se caracterise par une reduction de la mimique faciale, de la modulation des sentiments et des gestes de communication. Evaluation basee sur l\'observation des manifestations physiques du ton affectif et de la reponse emotionnelle lors de l\'interview.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable; eventuellement a l\'extreme limite de la norme.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Les changements d\'expression faciale et les gestes communicatifs semblent artificiels, forces, guindes.', score: 3 },
      { code: 4, label: '4 - MODERE: Une gamme d\'expressions faciales reduite donnent au patient un air deprime.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: L\'affect est generalement plat, avec quelques changements occasionnels de l\'expression faciale.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Manque de relief et deficience des emotions prononcees la plupart du temps.', score: 6 },
      { code: 7, label: '7 - EXTREME: Absence presque totale de changement dans l\'expression faciale et de trace de gestes de communication.', score: 7 }
    ]
  },
  {
    id: 'n2',
    text: 'N2. RETRAIT EMOTIONNEL',
    help: 'Manque d\'interet, d\'implication et d\'engagement affectif vis-a-vis des evenements de la vie quotidienne. Evaluation basee sur les rapports sur le fonctionnement provenant du personnel hospitalier ou de la famille et observation du comportement interpersonnel lors de l\'interview.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable; eventuellement a l\'extreme limite de la norme.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Manque habituellement d\'initiative et peut eventuellement faire preuve d\'un interet deficient.', score: 3 },
      { code: 4, label: '4 - MODERE: Le patient est en general emotionnellement eloigne de son milieu et de ses problemes.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Le patient est tout a fait detache, sur le plan emotionnel, des personnes et evenements de son milieu.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Un manque d\'interet et d\'engagement emotionnel prononce entraine une conversation limitee.', score: 6 },
      { code: 7, label: '7 - EXTREME: Le patient est presque totalement retire, ne communique presque plus et neglige ses besoins personnels.', score: 7 }
    ]
  },
  {
    id: 'n3',
    text: 'N3. CONTACT FAIBLE',
    help: 'Manque d\'ouverture interpersonnelle dans la conversation, manque de contact, d\'interet ou d\'implication vis-a-vis de l\'intervieweur. Evaluation basee sur le comportement interpersonnel pendant l\'interview.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable; eventuellement a l\'extreme limite de la norme.', score: 2 },
      { code: 3, label: '3 - FAIBLE: La conversation est caracterisee par un ton emprunt, contraint ou artificiel.', score: 3 },
      { code: 4, label: '4 - MODERE: Le patient est tres reserve et montre une distance interpersonnelle tres marquee.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Le desinteret est evident au point d\'empecher l\'interview d\'etre productive.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Le patient apparait excessivement indifferent et montre une distance interpersonnelle tres marquee.', score: 6 },
      { code: 7, label: '7 - EXTREME: Le patient reste tout a fait hermetique face a l\'intervieweur.', score: 7 }
    ]
  },
  {
    id: 'n4',
    text: 'N4. RETRAIT SOCIAL PASSIF/APATHIQUE',
    help: 'Amoindrissement de l\'interet et de l\'initiative dans les interactions sociales du a la passivite, a l\'apathie, l\'anergie ou la perte de la volonte. Evaluation basee sur les rapports concernant le comportement social qui proviennent du personnel hospitalier ou de la famille.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable; eventuellement a l\'extreme limite de la norme.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Le patient manifeste un interet occasionnel pour des activites sociales mais ne fait preuve que de peu d\'initiatives.', score: 3 },
      { code: 4, label: '4 - MODERE: Suit de maniere passive la plupart des activites sociales, mais d\'une maniere desinteressee ou mecanique.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Participe de maniere passive a un minimum d\'activites et ne montre quasi aucun interet ni initiative.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Tendance a l\'apathie et a l\'isolement, ne participe que rarement a des activites sociales.', score: 6 },
      { code: 7, label: '7 - EXTREME: Profondement apathique, isole sur le plan social, et tres negligeant vis-a-vis de lui-meme.', score: 7 }
    ]
  },
  {
    id: 'n5',
    text: 'N5. DIFFICULTE DE RAISONNER DANS L\'ABSTRAIT',
    help: 'Deterioration du mode de pensee abstrait-symbolique, qui se traduit par des difficultes pour etablir un classement, une generalisation ou pour depasser la pensee concrete. Evaluation basee sur les reponses aux questions sur les similitudes et l\'interpretation de proverbes.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable; eventuellement a l\'extreme limite de la norme.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Le patient a tendance a donner une interpretation litterale ou personnelle aux proverbes les plus difficiles.', score: 3 },
      { code: 4, label: '4 - MODERE: Le patient a souvent recours au mode concret.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Travaille essentiellement en mode concret et eprouve des problemes avec la plupart des proverbes.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Incapable de saisir le sens abstrait du moindre proverbe ou expression metaphorique.', score: 6 },
      { code: 7, label: '7 - EXTREME: Le patient ne peut utiliser que les modes concrets de pensee.', score: 7 }
    ]
  },
  {
    id: 'n6',
    text: 'N6. MANQUE DE SPONTANEITE ET FLOT DE CONVERSATION',
    help: 'Reduction du flot normal de communication combinee a une certaine apathie, perte de la volonte, mefiance, ou a un deficit de la connaissance. Evaluation basee sur le processus verbal et de la connaissance observe lors de l\'interview.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable; eventuellement a l\'extreme limite de la norme.', score: 2 },
      { code: 3, label: '3 - FAIBLE: La conversation ne releve que peu d\'initiatives. Les reponses ont tendance a etre breves.', score: 3 },
      { code: 4, label: '4 - MODERE: La conversation manque de fluidite et semble inegale, voire chaotique.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Le patient fait preuve d\'un manque de spontaneite et d\'ouverture evident.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Les reponses du patient sont essentiellement limitees a quelques mots ou a de courtes phrases.', score: 6 },
      { code: 7, label: '7 - EXTREME: L\'expression verbale est limitee tout au plus a quelques mots episodiques.', score: 7 }
    ]
  },
  {
    id: 'n7',
    text: 'N7. PENSEE STEREOTYPEE',
    help: 'Diminution de la fluidite, spontaneite et flexibilite de la pensee, qui se traduit par un contenu de la pensee rigide, repetitif, voire sterile. Evaluation basee sur le processus verbal et de la connaissance observe lors de l\'interview.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable; eventuellement a l\'extreme limite de la norme.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Une certaine rigidite dans les attitudes ou les croyances.', score: 3 },
      { code: 4, label: '4 - MODERE: La conversation tourne autour d\'un theme recurrent.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: La pensee est rigide et repetitive a un point tel que la conversation est limitee a deux ou trois sujets.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Repetition non controlee de demandes, d\'affirmations, d\'idees ou de questions.', score: 6 },
      { code: 7, label: '7 - EXTREME: La pensee, le comportement et la conversation sont domines par une repetition constante d\'idees fixes.', score: 7 }
    ]
  },

  // ========================================================================
  // Section 3: General Psychopathology Subscale (G1-G16)
  // ========================================================================
  {
    id: 'section_general',
    text: 'Sous-score general',
    type: 'section',
    required: false
  },
  {
    id: 'g1',
    text: 'G1. PREOCCUPATIONS SOMATIQUES',
    help: 'Plaintes physiques ou croyances relatives a une maladie ou un dysfonctionnement somatique.',
    type: 'single_choice',
    required: false,
    options: PANSS_RESPONSE_OPTIONS
  },
  {
    id: 'g2',
    text: 'G2. ANXIETE',
    help: 'Experience subjective de nervosire, inquietude, apprehension ou agitation.',
    type: 'single_choice',
    required: false,
    options: PANSS_RESPONSE_OPTIONS
  },
  {
    id: 'g3',
    text: 'G3. SENTIMENTS DE CULPABILITE',
    help: 'Sentiment de remords ou d\'auto-accusation pour des mefaits reels ou imaginaires.',
    type: 'single_choice',
    required: false,
    options: PANSS_RESPONSE_OPTIONS
  },
  {
    id: 'g4',
    text: 'G4. TENSION',
    help: 'Manifestations physiques claires de peur, d\'anxiete et d\'agitation.',
    type: 'single_choice',
    required: false,
    options: PANSS_RESPONSE_OPTIONS
  },
  {
    id: 'g5',
    text: 'G5. MANIERISME ET TROUBLES DE LA POSTURE',
    help: 'Mouvements ou postures non naturels qui rendent les actes quotidiens maladroits.',
    type: 'single_choice',
    required: false,
    options: PANSS_RESPONSE_OPTIONS
  },
  {
    id: 'g6',
    text: 'G6. DEPRESSION',
    help: 'Sentiments de tristesse, de decouragement, d\'impuissance et de pessimisme.',
    type: 'single_choice',
    required: false,
    options: PANSS_RESPONSE_OPTIONS
  },
  {
    id: 'g7',
    text: 'G7. RALENTISSEMENT PSYCHOMOTEUR',
    help: 'Reduction de l\'activite motrice qui se traduit par un ralentissement ou une diminution des mouvements et du discours.',
    type: 'single_choice',
    required: false,
    options: PANSS_RESPONSE_OPTIONS
  },
  {
    id: 'g8',
    text: 'G8. MANQUE DE COOPERATION',
    help: 'Refus actif de se conformer a la volonte des personnes significatives.',
    type: 'single_choice',
    required: false,
    options: PANSS_RESPONSE_OPTIONS
  },
  {
    id: 'g9',
    text: 'G9. CONTENU INHABITUEL DE LA PENSEE',
    help: 'Contenu de la pensee caracterise par des idees etranges, fantaisistes ou bizarres.',
    type: 'single_choice',
    required: false,
    options: PANSS_RESPONSE_OPTIONS
  },
  {
    id: 'g10',
    text: 'G10. DESORIENTATION',
    help: 'Manque de conscience de ses relations avec l\'environnement, y compris les personnes, le lieu et le temps.',
    type: 'single_choice',
    required: false,
    options: PANSS_RESPONSE_OPTIONS
  },
  {
    id: 'g11',
    text: 'G11. MANQUE D\'ATTENTION',
    help: 'Echec de l\'attention focalisee, caracterise par une faible concentration.',
    type: 'single_choice',
    required: false,
    options: PANSS_RESPONSE_OPTIONS
  },
  {
    id: 'g12',
    text: 'G12. MANQUE DE JUGEMENT ET DE PRISE DE CONSCIENCE',
    help: 'Alteration de la conscience ou de la comprehension de sa propre situation psychiatrique.',
    type: 'single_choice',
    required: false,
    options: PANSS_RESPONSE_OPTIONS
  },
  {
    id: 'g13',
    text: 'G13. TROUBLES DE LA VOLITION',
    help: 'Trouble de l\'initiation, du maintien et du controle volontaire des pensees, du comportement, des mouvements et du discours.',
    type: 'single_choice',
    required: false,
    options: PANSS_RESPONSE_OPTIONS
  },
  {
    id: 'g14',
    text: 'G14. MAUVAIS CONTROLE PULSIONNEL',
    help: 'Regulation et controle defaillants de l\'action sur les impulsions interieures.',
    type: 'single_choice',
    required: false,
    options: PANSS_RESPONSE_OPTIONS
  },
  {
    id: 'g15',
    text: 'G15. PREOCCUPATION EXCESSIVE DE SOI',
    help: 'Preoccupation avec ses propres pensees et sentiments et avec les experiences de son propre corps.',
    type: 'single_choice',
    required: false,
    options: PANSS_RESPONSE_OPTIONS
  },
  {
    id: 'g16',
    text: 'G16. EVITEMENT SOCIAL ACTIF',
    help: 'Diminution de l\'implication sociale associee a une peur, une hostilite ou une mefiance injustifiees.',
    type: 'single_choice',
    required: false,
    options: PANSS_RESPONSE_OPTIONS
  }
];

export const PANSS_DEFINITION: QuestionnaireDefinition = {
  id: 'panss',
  code: 'PANSS',
  title: 'PANSS - Echelle des syndromes positifs et negatifs',
  description: 'Echelle d\'evaluation de la severite des symptomes de la schizophrenie a 30 items. Auteurs originaux: Kay SR, Fiszbein A, Opler LA (1986). Traduction francaise: Lepine JP (1989).',
  questions: PANSS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'French Version (Lepine, 1989)',
    language: 'fr-FR'
  }
};
