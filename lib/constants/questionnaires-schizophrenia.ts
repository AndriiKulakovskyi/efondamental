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
