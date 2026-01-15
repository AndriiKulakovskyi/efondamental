// eFondaMental Platform - Schizophrenia Questionnaire Definitions
// Questionnaires for schizophrenia screening visits

import { Question, QuestionOption } from '@/lib/types/database.types';
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

// ============================================================================
// CDSS (Calgary Depression Scale for Schizophrenia)
// ============================================================================
// 9-item clinician-rated scale specifically designed to assess depression
// in schizophrenia patients, distinguishing depressive symptoms from
// negative symptoms and extrapyramidal side effects.
// Original authors: Addington D, Addington J (1990)
// French translation: Bernard D, Lancon C, Auquier P (1998)
// All items rated 0-3: 0=Absent, 1=Mild, 2=Moderate, 3=Severe
// Total score range: 0-27, Clinical cutoff: >6 indicates depressive syndrome

// Standard 4-point response options for all CDSS items
const CDSS_RESPONSE_OPTIONS = [
  { code: 0, label: 'ABSENTE', score: 0 },
  { code: 1, label: 'LEGERE', score: 1 },
  { code: 2, label: 'MODEREE', score: 2 },
  { code: 3, label: 'SEVERE', score: 3 }
];

export const CDSS_QUESTIONS: Question[] = [
  {
    id: 'cdss_instructions',
    text: 'Instructions',
    help: 'Poser la premiere question telle qu\'elle est ecrite. Par la suite, vous pouvez utiliser d\'autres questions d\'exploration ou d\'autres questions pertinentes a votre discretion. Le cadre temporel concerne les deux dernieres semaines a moins qu\'il ne soit stipule autrement. Le dernier item (9) se base sur des observations fondees sur l\'ensemble de l\'entretien.',
    type: 'instruction',
    required: false
  },
  {
    id: 'q1',
    text: '1. DEPRESSION',
    help: 'Comment pourriez-vous decrire votre humeur durant les deux dernieres semaines : avez-vous pu demeurer raisonnablement gai ou est ce que vous avez ete tres deprime ou plutot triste ces derniers temps ? Durant les deux dernieres semaines, combien de fois vous etes-vous senti ainsi, tous les jours? Toute la journee?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'ABSENTE - Definition non applicable.', score: 0 },
      { code: 1, label: 'LEGERE - Le sujet exprime une certaine tristesse ou un certain decouragement lorsqu\'il est questionne.', score: 1 },
      { code: 2, label: 'MODEREE - Humeur depressive distinctive est presente tous les jours.', score: 2 },
      { code: 3, label: 'SEVERE - Humeur depressive marquee persistant tous les jours, plus de la moitie du temps, affectant le fonctionnement normal, psychomoteur et social.', score: 3 }
    ]
  },
  {
    id: 'q2',
    text: '2. DESESPOIR',
    help: 'Comment entrevoyez-vous le futur pour vous-meme? Est ce que vous pouvez envisager un avenir pour vous? Ou est-ce que la vie vous parait plutot sans espoir? Est ce que vous avez tout laisse tomber ou est ce qu\'il vous parait y avoir encore des raisons d\'essayer?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'ABSENT - Definition non applicable.', score: 0 },
      { code: 1, label: 'LEGER - A certains moments, le sujet s\'est senti sans espoir au cours de la derniere semaine mais il a encore un certain degre d\'espoir pour l\'avenir.', score: 1 },
      { code: 2, label: 'MODERE - Perception persistante mais moderee de desespoir au cours de la derniere semaine. On peut cependant persuader le sujet d\'acquiescer a la possibilite que les choses peuvent s\'ameliorer.', score: 2 },
      { code: 3, label: 'SEVERE - Sentiment persistant et eprouvant de desespoir.', score: 3 }
    ]
  },
  {
    id: 'q3',
    text: '3. AUTO-DEPRECIATION',
    help: 'Quelle est votre opinion de vous-meme, en comparaison avec d\'autres personnes? Est ce que vous vous sentez meilleur ou moins bon, ou a peu pres comparable aux autres personnes en general ? Vous sentez-vous inferieur ou meme sans aucune valeur?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'ABSENTE - Definition non applicable.', score: 0 },
      { code: 1, label: 'LEGERE - Legere inferiorite ; n\'atteint pas le degre de se sentir sans valeur.', score: 1 },
      { code: 2, label: 'MODEREE - Le sujet se sent sans valeur mais moins de 50 % du temps.', score: 2 },
      { code: 3, label: 'SEVERE - Le sujet se sent sans valeur plus de 50 % du temps. Il peut etre mis au defi de reconnaitre un autre point de vue.', score: 3 }
    ]
  },
  {
    id: 'q4',
    text: '4. IDEES DE REFERENCE ASSOCIEES A LA CULPABILITE',
    help: 'Avez-vous l\'impression que l\'on vous blame pour certaines choses ou meme qu\'on vous accuse sans raison? A propos de quoi? (ne pas inclure ici des blames ou des accusations justifies. Exclure les delires de culpabilite)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'ABSENTE - Definition non applicable.', score: 0 },
      { code: 1, label: 'LEGERE - Le sujet se sent blame mais non accuse, moins de 50 % du temps.', score: 1 },
      { code: 2, label: 'MODEREE - Sentiment persistant d\'etre blame et/ou sentiment occasionnel d\'etre accuse.', score: 2 },
      { code: 3, label: 'SEVERE - Sentiment persistant d\'etre accuse. Lorsqu\'on le contredit, le sujet reconnait que cela n\'est pas vrai.', score: 3 }
    ]
  },
  {
    id: 'q5',
    text: '5. CULPABILITE PATHOLOGIQUE',
    help: 'Avez-vous tendance a vous blamer vous-meme pour des petites choses que vous pourriez avoir faites dans le passe? Pensez-vous que vous meritez d\'etre aussi preoccupe de cela?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'ABSENTE - Definition non applicable.', score: 0 },
      { code: 1, label: 'LEGERE - Le sujet se sent coupable de certaines peccadilles mais moins de 50 % du temps.', score: 1 },
      { code: 2, label: 'MODEREE - Le sujet se sent coupable habituellement (plus de 50 % du temps) a propos d\'actes dont il exagere la signification.', score: 2 },
      { code: 3, label: 'SEVERE - Le sujet se sent habituellement qu\'il est a blamer pour tout ce qui va mal meme lorsque ce n\'est pas de sa faute.', score: 3 }
    ]
  },
  {
    id: 'q6',
    text: '6. DEPRESSION MATINALE',
    help: 'Lorsque vous vous etes senti deprime au cours des deux dernieres semaines, avez-vous remarque que la depression etait pire a certains moments de la journee?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'ABSENTE - Definition non applicable.', score: 0 },
      { code: 1, label: 'LEGERE - Depression presente mais sans variation diurne.', score: 1 },
      { code: 2, label: 'MODEREE - Le sujet mentionne spontanement que la depression est pire le matin.', score: 2 },
      { code: 3, label: 'SEVERE - La depression est, de facon marquee, pire le matin, avec un fonctionnement perturbe qui s\'ameliore l\'apres-midi.', score: 3 }
    ]
  },
  {
    id: 'q7',
    text: '7. EVEIL PRECOCE',
    help: 'Vous reveillez-vous plus tot le matin qu\'a l\'accoutumee? Combien de fois par semaine cela vous arrive-t-il?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'ABSENT - Pas de reveil precoce.', score: 0 },
      { code: 1, label: 'LEGER - A l\'occasion s\'eveille (jusqu\'a 2 fois par semaine) une heure ou plus avant le moment normal de s\'eveiller ou l\'heure fixee a son reveille-matin.', score: 1 },
      { code: 2, label: 'MODERE - S\'eveille frequemment de facon hative (jusqu\'a 5 fois par semaine) une heure ou plus avant son heure habituelle d\'eveil ou l\'heure fixee par son reveille-matin.', score: 2 },
      { code: 3, label: 'SEVERE - S\'eveille tous les jours une heure ou plus avant l\'heure normale d\'eveil.', score: 3 }
    ]
  },
  {
    id: 'q8',
    text: '8. SUICIDE',
    help: 'Avez-vous deja eu l\'impression que la vie ne valait pas la peine d\'etre vecue? Avez-vous deja pense mettre fin a tout cela? Qu\'est ce que vous pensez que vous auriez pu faire? Avez-vous effectivement essaye?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'ABSENT - Definition non applicable.', score: 0 },
      { code: 1, label: 'LEGER - Le sujet a l\'idee qu\'il serait mieux mort ou des idees occupationnelles de suicide.', score: 1 },
      { code: 2, label: 'MODERE - Il a envisage deliberement le suicide avec un projet mais sans faire de tentative.', score: 2 },
      { code: 3, label: 'SEVERE - Tentative de suicide apparemment concue pour se terminer par la mort (c\'est-a-dire de decouverte accidentelle ou par un moyen qui s\'est avere inefficace).', score: 3 }
    ]
  },
  {
    id: 'q9',
    text: '9. DEPRESSION OBSERVEE',
    help: 'Basee sur les observations de l\'interviewer durant l\'entretien complet. La question "est-ce que vous ressentez une envie de pleurer?" utilisee a des moments appropries durant l\'entretien peut susciter l\'emergence d\'informations utiles a cette observation.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'ABSENTE - Definition non applicable.', score: 0 },
      { code: 1, label: 'LEGERE - Le sujet apparait triste et sur le point de pleurer meme durant des parties de l\'entretien touchant des sujets effectivement neutres.', score: 1 },
      { code: 2, label: 'MODEREE - Le sujet apparait triste, pres des larmes durant tout l\'entretien avec une voix monotone et melancolique, exteriorise des larmes ou est pres des larmes a certains moments.', score: 2 },
      { code: 3, label: 'SEVERE - Le patient s\'etrangle lorsqu\'il evoque des sujets generant de la detresse, soupire profondement, frequemment et pleure ouvertement, ou est de facon persistante dans un etat de souffrance figee.', score: 3 }
    ]
  }
];

export const CDSS_DEFINITION: QuestionnaireDefinition = {
  id: 'cdss',
  code: 'CDSS',
  title: 'CDSS - Echelle de depression de Calgary',
  description: 'Echelle a 9 items specifiquement concue pour evaluer la depression chez les patients schizophrenes, distinguant les symptomes depressifs des symptomes negatifs et des effets secondaires extrapyramidaux. Auteurs originaux: Addington D, Addington J (1990). Traduction francaise: Bernard D, Lancon C, Auquier P (1998).',
  questions: CDSS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'French Version (Bernard et al., 1998)',
    language: 'fr-FR'
  }
};

// ============================================================================
// BARS (Brief Adherence Rating Scale)
// ============================================================================
// 3-item clinician-administered scale designed to assess medication adherence
// in psychiatric patients. Estimates the percentage of prescribed doses taken
// over the past month.
// Original authors: Byerly MJ, Nakonezny PA, Rush AJ (2008)
// Scoring: ((30 - days_missed - days_reduced) / 30) x 100

export const BARS_QUESTIONS: Question[] = [
  {
    id: 'bars_instructions',
    text: 'Instructions',
    help: 'Administrer les trois questions au patient concernant sa prise de traitement au cours du mois dernier (30 derniers jours). Le score calcule le pourcentage d\'observance sur la base des reponses aux trois questions.',
    type: 'instruction',
    required: false
  },
  {
    id: 'q1',
    text: '1. Nombre de doses prescrites par jour',
    help: 'Quel est le nombre de doses prescrites par jour (connaissance qu\'en a le patient)',
    type: 'number',
    required: false
  },
  {
    id: 'q2',
    text: '2. Jours sans traitement',
    help: 'Nombre de jours le mois dernier pendant lesquels il n\'a pas pris le traitement prescrit',
    type: 'number',
    required: false
  },
  {
    id: 'q3',
    text: '3. Jours avec dose reduite',
    help: 'Nombre de jours le mois dernier pendant lesquels le patient a pris moins que la dose de traitement prescrite',
    type: 'number',
    required: false
  }
];

export const BARS_DEFINITION: QuestionnaireDefinition = {
  id: 'bars',
  code: 'BARS',
  title: 'BARS - Echelle breve d\'evaluation de l\'observance',
  description: 'Echelle a 3 items administree par le clinicien pour evaluer l\'observance medicamenteuse chez les patients psychiatriques. Elle estime le pourcentage de doses prescrites prises au cours du mois dernier. Auteurs originaux: Byerly MJ, Nakonezny PA, Rush AJ (2008).',
  questions: BARS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'Original (Byerly et al., 2008)',
    language: 'fr-FR'
  }
};

// ============================================================================
// SUMD (Scale to Assess Unawareness of Mental Disorder)
// ============================================================================
// Semi-structured interview assessing awareness (insight) of mental illness
// across 9 domains. Domains 1-3 are global awareness (conscience only).
// Domains 4-9 have both conscience AND attribution items.
// Key rule: If conscience = 0 or 3, attribution is automatically 0.
// Original authors: Amador XF, Strauss DH, Yale SA, et al. (1993)

const SUMD_CONSCIENCE_OPTIONS = [
  { code: 0, label: 'Non cotable', score: 0 },
  { code: 1, label: 'Conscient', score: 1 },
  { code: 2, label: 'En partie conscient/inconscient', score: 2 },
  { code: 3, label: 'Inconscient', score: 3 }
];

const SUMD_ATTRIBUTION_OPTIONS = [
  { code: 0, label: 'Non cotable', score: 0 },
  { code: 1, label: 'Attribution correcte - Le symptome est du a un trouble mental', score: 1 },
  { code: 2, label: 'Attribution partielle - Incertain, mais peut en accepter l\'idee', score: 2 },
  { code: 3, label: 'Attribution incorrecte - Le symptome n\'est pas en lien avec un trouble mental', score: 3 }
];

export const SUMD_QUESTIONS: Question[] = [
  // {
  //   id: 'sumd_instructions',
  //   text: 'Instructions',
  //   help: 'L\'echelle evalue la conscience (insight) du patient concernant son trouble mental a travers differents domaines. Pour chaque domaine, evaluer d\'abord le niveau de conscience, puis l\'attribution des symptomes (si applicable). Note: Si le patient est "Non cotable" (0) ou "Inconscient" (3) sur un item de Conscience, l\'item Attribution correspondant devient automatiquement "Non cotable" (0).',
  //   type: 'instruction',
  //   required: false
  // },
  // Domain 1: Conscience d'un trouble mental (global, no attribution)
  {
    id: 'section_domain1',
    text: 'Conscience d\'un trouble mental',
    help: 'D\'une maniere generale, le patient croit-il presenter un trouble mental ?',
    type: 'section',
    required: false
  },
  {
    id: 'conscience1',
    text: '1. Conscience du trouble',
    help: 'D\'une maniere generale, le patient croit-il presenter un trouble mental ?',
    type: 'single_choice',
    required: false,
    options: SUMD_CONSCIENCE_OPTIONS
  },
  // Domain 2: Conscience des consequences du trouble (global, no attribution)
  {
    id: 'section_domain2',
    text: 'Conscience des consequences de ce trouble',
    help: 'Quelles sont les croyances du sujet concernant les raisons pour lesquelles il se retrouve hospitalise, renvoye de son travail, blesse, endette... etc... ?',
    type: 'section',
    required: false
  },
  {
    id: 'conscience2',
    text: '2. Conscience du trouble',
    help: 'Quelles sont les croyances du sujet concernant les raisons pour lesquelles il se retrouve hospitalise, renvoye de son travail, blesse, endette... etc... ?',
    type: 'single_choice',
    required: false,
    options: SUMD_CONSCIENCE_OPTIONS
  },
  // Domain 3: Conscience des effets du traitement (global, no attribution)
  {
    id: 'section_domain3',
    text: 'Conscience des effets du traitement',
    help: 'Le sujet croit-il que les traitements ont diminue la severite de ses symptomes ?',
    type: 'section',
    required: false
  },
  {
    id: 'conscience3',
    text: '3. Conscience du trouble',
    help: 'Le sujet croit-il que les traitements ont diminue la severite de ses symptomes ?',
    type: 'single_choice',
    required: false,
    options: SUMD_CONSCIENCE_OPTIONS
  },
  // Domain 4: Conscience d'une experience hallucinatoire (+ attribution)
  {
    id: 'section_domain4',
    text: 'Conscience d\'une experience hallucinatoire',
    help: 'Le sujet reconnait-il ses hallucinations en tant que telles ? Il s\'agit de coter sa capacite a interpreter son experience hallucinatoire comme primaire.',
    type: 'section',
    required: false
  },
  {
    id: 'conscience4',
    text: '4.1. Conscience du trouble',
    help: 'Le sujet reconnait-il ses hallucinations en tant que telles ?',
    type: 'single_choice',
    required: false,
    options: SUMD_CONSCIENCE_OPTIONS
  },
  {
    id: 'attribu4',
    text: '4.2. Attribution des symptomes',
    help: 'Si conscience = 0 ou 3, l\'attribution est automatiquement "Non cotable".',
    type: 'single_choice',
    required: false,
    options: SUMD_ATTRIBUTION_OPTIONS
  },
  // Domain 5: Conscience du delire (+ attribution)
  {
    id: 'section_domain5',
    text: 'Conscience du delire',
    help: 'Le sujet reconnait-il son delire en tant que production interne de croyances erronees ? Coter la conscience du caractere non plausible de ses croyances.',
    type: 'section',
    required: false
  },
  {
    id: 'conscience5',
    text: '5.1. Conscience du trouble',
    help: 'Le sujet reconnait-il son delire en tant que production interne de croyances erronees ?',
    type: 'single_choice',
    required: false,
    options: SUMD_CONSCIENCE_OPTIONS
  },
  {
    id: 'attribu5',
    text: '5.2. Attribution des symptomes',
    help: 'Si conscience = 0 ou 3, l\'attribution est automatiquement "Non cotable".',
    type: 'single_choice',
    required: false,
    options: SUMD_ATTRIBUTION_OPTIONS
  },
  // Domain 6: Conscience d'un trouble de la pensee (+ attribution)
  {
    id: 'section_domain6',
    text: 'Conscience d\'un trouble de la pensee',
    help: 'Le sujet croit-il que ses communications avec les autres sont perturbees ?',
    type: 'section',
    required: false
  },
  {
    id: 'conscience6',
    text: '6.1. Conscience du trouble',
    help: 'Le sujet croit-il que ses communications avec les autres sont perturbees ?',
    type: 'single_choice',
    required: false,
    options: SUMD_CONSCIENCE_OPTIONS
  },
  {
    id: 'attribu6',
    text: '6.2. Attribution des symptomes',
    help: 'Si conscience = 0 ou 3, l\'attribution est automatiquement "Non cotable".',
    type: 'single_choice',
    required: false,
    options: SUMD_ATTRIBUTION_OPTIONS
  },
  // Domain 7: Conscience d'un emoussement affectif (+ attribution)
  {
    id: 'section_domain7',
    text: 'Conscience d\'un emoussement affectif',
    help: 'Le sujet a-t-il conscience de ses affects communiques par le biais de ses expressions, sa voix, sa gesticulation... etc... Ne pas coter son evaluation de sa thymie.',
    type: 'section',
    required: false
  },
  {
    id: 'conscience7',
    text: '7.1. Conscience du trouble',
    help: 'Le sujet a-t-il conscience de ses affects communiques par le biais de ses expressions, sa voix, sa gesticulation ?',
    type: 'single_choice',
    required: false,
    options: SUMD_CONSCIENCE_OPTIONS
  },
  {
    id: 'attribu7',
    text: '7.2. Attribution des symptomes',
    help: 'Si conscience = 0 ou 3, l\'attribution est automatiquement "Non cotable".',
    type: 'single_choice',
    required: false,
    options: SUMD_ATTRIBUTION_OPTIONS
  },
  // Domain 8: Conscience de l'anhedonie (+ attribution)
  {
    id: 'section_domain8',
    text: 'Conscience de l\'anhedonie',
    help: 'Le sujet est-il conscient que son attitude renvoie une apparente diminution de son plaisir a participer a des activites suscitant normalement le plaisir ?',
    type: 'section',
    required: false
  },
  {
    id: 'conscience8',
    text: '8.1. Conscience du trouble',
    help: 'Le sujet est-il conscient que son attitude renvoie une apparente diminution de son plaisir a participer a des activites suscitant normalement le plaisir ?',
    type: 'single_choice',
    required: false,
    options: SUMD_CONSCIENCE_OPTIONS
  },
  {
    id: 'attribu8',
    text: '8.2. Attribution des symptomes',
    help: 'Si conscience = 0 ou 3, l\'attribution est automatiquement "Non cotable".',
    type: 'single_choice',
    required: false,
    options: SUMD_ATTRIBUTION_OPTIONS
  },
  // Domain 9: Conscience de l'asociabilite (+ attribution)
  {
    id: 'section_domain9',
    text: 'Conscience de l\'asociabilite',
    help: 'Le patient est-il conscient qu\'il ne montre pas d\'interet pour les relations sociales ?',
    type: 'section',
    required: false
  },
  {
    id: 'conscience9',
    text: '9.1. Conscience du trouble',
    help: 'Le patient est-il conscient qu\'il ne montre pas d\'interet pour les relations sociales ?',
    type: 'single_choice',
    required: false,
    options: SUMD_CONSCIENCE_OPTIONS
  },
  {
    id: 'attribu9',
    text: '9.2. Attribution des symptomes',
    help: 'Si conscience = 0 ou 3, l\'attribution est automatiquement "Non cotable".',
    type: 'single_choice',
    required: false,
    options: SUMD_ATTRIBUTION_OPTIONS
  }
];

export const SUMD_DEFINITION: QuestionnaireDefinition = {
  id: 'sumd',
  code: 'SUMD',
  title: 'SUMD - Echelle d\'evaluation de la conscience de la maladie',
  description: 'Entretien semi-structure evaluant la conscience (insight) de la maladie mentale a travers 9 domaines. Les domaines 1-3 evaluent la conscience globale, les domaines 4-9 evaluent la conscience et l\'attribution des symptomes specifiques. Auteurs originaux: Amador XF, Strauss DH, Yale SA, et al. (1993). L\'echelle evalue la conscience (insight) du patient concernant son trouble mental a travers differents domaines. Pour chaque domaine, evaluer d\'abord le niveau de conscience, puis l\'attribution des symptomes (si applicable). Note: Si le patient est "Non cotable" (0) ou "Inconscient" (3) sur un item de Conscience, l\'item Attribution correspondant devient automatiquement "Non cotable" (0).',
  questions: SUMD_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'Original (Amador et al., 1993)',
    language: 'fr-FR'
  }
};

// ============================================================================
// AIMS (Abnormal Involuntary Movement Scale)
// ============================================================================
// 12-item clinician-rated scale for assessing tardive dyskinesia and other
// abnormal involuntary movements associated with antipsychotic medications.
// Source: National Institute of Mental Health (NIMH), 1976

const AIMS_MOVEMENT_OPTIONS = [
  { code: 0, label: 'Aucun', score: 0 },
  { code: 1, label: 'Minime: peut-etre normal', score: 1 },
  { code: 2, label: 'Leger', score: 2 },
  { code: 3, label: 'Moyen', score: 3 },
  { code: 4, label: 'Grave', score: 4 }
];

const AIMS_AWARENESS_OPTIONS = [
  { code: 0, label: 'Aucune conscience', score: 0 },
  { code: 1, label: 'Conscience: pas de gene', score: 1 },
  { code: 2, label: 'Conscience: gene legere', score: 2 },
  { code: 3, label: 'Conscience: gene moderee', score: 3 },
  { code: 4, label: 'Conscience: detresse grave', score: 4 }
];

const AIMS_BINARY_OPTIONS = [
  { code: 0, label: 'Oui', score: 0 },
  { code: 1, label: 'Non', score: 1 }
];

export const AIMS_QUESTIONS: Question[] = [
  {
    id: 'aims_instructions',
    text: 'Instructions',
    help: 'Veuillez observer le patient dans differentes positions et situations standardisees conformement au protocole d\'examen AIMS. Evaluer la severite des mouvements involontaires anormaux.',
    type: 'instruction',
    required: false
  },
  // Orofacial movements (items 1-4)
  {
    id: 'section_orofacial',
    text: 'Mouvements orofaciaux',
    type: 'section',
    required: false
  },
  {
    id: 'q1',
    text: '1. Muscles d\'expression faciale',
    help: 'Par exemple: mouvements du front, des sourcils, de la region peri orbitale, des joues; inclure le froncement des sourcils, le clignement des paupieres, le sourire et les grimaces.',
    type: 'single_choice',
    required: false,
    options: AIMS_MOVEMENT_OPTIONS
  },
  {
    id: 'q2',
    text: '2. Levres et region peri orale',
    help: 'Par exemple: plissement, avancement des levres, moue, claquement des levres.',
    type: 'single_choice',
    required: false,
    options: AIMS_MOVEMENT_OPTIONS
  },
  {
    id: 'q3',
    text: '3. Machoires',
    help: 'Par exemple: mordre, serrer les dents, machonnement, ouverture de la bouche, mouvement lateraux.',
    type: 'single_choice',
    required: false,
    options: AIMS_MOVEMENT_OPTIONS
  },
  {
    id: 'q4',
    text: '4. Langue',
    help: 'N\'evaluer que l\'augmentation du mouvement a l\'interieur et a l\'exterieur de la bouche et NON l\'incapacite de maintenir le mouvement.',
    type: 'single_choice',
    required: false,
    options: AIMS_MOVEMENT_OPTIONS
  },
  // Extremity movements (items 5-6)
  {
    id: 'section_extremities',
    text: 'Mouvements des extremites',
    type: 'section',
    required: false
  },
  {
    id: 'q5',
    text: '5. Membres superieurs',
    help: 'Bras, poignet, main, doigts. Inclure les mouvements choreiques (c.a.d. rapides, sans but objectif, irreguliers, spontanes), les mouvements athetoïdes.',
    type: 'single_choice',
    required: false,
    options: AIMS_MOVEMENT_OPTIONS
  },
  {
    id: 'q6',
    text: '6. Membres inferieurs',
    help: 'Jambes, genoux, chevilles, doigts de pied. Par exemple mouvements lateraux des genoux, tapotement du pied, frapper du talon, inversion et eversion du pied, enroulement du pied.',
    type: 'single_choice',
    required: false,
    options: AIMS_MOVEMENT_OPTIONS
  },
  // Trunk movements (item 7)
  {
    id: 'section_trunk',
    text: 'Mouvements du tronc',
    type: 'section',
    required: false
  },
  {
    id: 'q7',
    text: '7. Cou, epaules, hanches',
    help: 'Par exemple: dandinement, balancement, tortillement, rotation pelvienne, torsion.',
    type: 'single_choice',
    required: false,
    options: AIMS_MOVEMENT_OPTIONS
  },
  // Global judgments (items 8-10)
  {
    id: 'section_global',
    text: 'Jugements globaux',
    type: 'section',
    required: false
  },
  {
    id: 'q8',
    text: '8. Gravite des mouvements anormaux',
    help: 'Evaluation globale de la severite des mouvements anormaux observes.',
    type: 'single_choice',
    required: false,
    options: AIMS_MOVEMENT_OPTIONS
  },
  {
    id: 'q9',
    text: '9. Incapacite due a des mouvements anormaux',
    help: 'Evaluation du degre d\'incapacite fonctionnelle causee par les mouvements.',
    type: 'single_choice',
    required: false,
    options: AIMS_MOVEMENT_OPTIONS
  },
  {
    id: 'q10',
    text: '10. Conscience du malade des mouvements anormaux',
    help: 'N\'evaluer que ce que rapporte le malade.',
    type: 'single_choice',
    required: false,
    options: AIMS_AWARENESS_OPTIONS
  },
  // Dental status (items 11-12)
  {
    id: 'section_dental',
    text: 'Etat de la dentition',
    type: 'section',
    required: false
  },
  {
    id: 'q11',
    text: '11. Problemes actuels des dents et/ou de protheses dentaires',
    type: 'single_choice',
    required: false,
    options: AIMS_BINARY_OPTIONS
  },
  {
    id: 'q12',
    text: '12. Le malade porte-t-il generalement des protheses dentaires',
    type: 'single_choice',
    required: false,
    options: AIMS_BINARY_OPTIONS
  }
];

export const AIMS_DEFINITION: QuestionnaireDefinition = {
  id: 'aims',
  code: 'AIMS',
  title: 'AIMS - Echelle des mouvements involontaires anormaux',
  description: 'Echelle a 12 items administree par le clinicien pour evaluer les dyskinesies tardives et autres mouvements involontaires anormaux associes aux medicaments antipsychotiques. Evalue les mouvements orofaciaux, des extremites et du tronc, ainsi que les jugements globaux. Source: NIMH (1976).',
  questions: AIMS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'Original (NIMH, 1976)',
    language: 'fr-FR'
  }
};

// ============================================================================
// Barnes Akathisia Rating Scale
// ============================================================================
// 4-item clinician-rated scale for assessing drug-induced akathisia,
// a common side effect of antipsychotic medications.
// Original author: T. R. E. Barnes (1989)

const BARNES_OBJECTIVE_OPTIONS = [
  { code: 0, label: 'Normal. Impatiences des membres occasionnelles.', score: 0 },
  { code: 1, label: 'Presence de mouvements caracteristiques d\'impatience : frottement, pietinement, balancement d\'une jambe lorsqu\'il est assis et/ou balancement d\'un pied sur l\'autre ou pietinement sur place lorsqu\'il est debout mais les mouvements sont presents moins de la moitie du temps d\'observation.', score: 1 },
  { code: 2, label: 'Phenomenes decrits ci-dessus presents au moins la moitie du temps d\'observation.', score: 2 },
  { code: 3, label: 'Le patient a constamment des mouvements d\'agitation caracteristique et/ou est dans l\'incapacite de rester assis ou debout sans marcher ou sans pietiner.', score: 3 }
];

const BARNES_AGITATION_OPTIONS = [
  { code: 0, label: 'Absence d\'impatience subjective.', score: 0 },
  { code: 1, label: 'Impression non specifique d\'agitation interieure.', score: 1 },
  { code: 2, label: 'Le patient a conscience d\'une incapacite a garder ses jambes au repos ou ressent le besoin de bouger ses jambes et/ou se plaint d\'une agitation interieure aggravee specifiquement lorsqu\'on lui demande de rester tranquille.', score: 2 },
  { code: 3, label: 'Conscience d\'un besoin compulsif intense de bouger la plupart du temps et/ou rapporte une forte envie de marcher ou pietiner la plupart du temps.', score: 3 }
];

const BARNES_DISTRESS_OPTIONS = [
  { code: 0, label: 'Pas de detresse', score: 0 },
  { code: 1, label: 'Legere', score: 1 },
  { code: 2, label: 'Moyenne', score: 2 },
  { code: 3, label: 'Grave', score: 3 }
];

const BARNES_GLOBAL_OPTIONS = [
  { code: 0, label: 'Absence ; Pas de sensation d\'agitation ou d\'impatience. La presence de mouvements caracteristiques d\'akathisie en l\'absence d\'impression subjective d\'agitation interieure ou de besoin compulsif de bouger les jambes doit etre consideree comme une pseudo-akathisie.', score: 0 },
  { code: 1, label: 'Douteux. Tension interieure et agitation non specifiques.', score: 1 },
  { code: 2, label: 'Legere. Conscience d\'impatiences dans les jambes et/ou sensation d\'agitation interieure aggravee lors de la station debout au repos. L\'agitation est presente mais les mouvements caracteristiques peuvent manquer. Occasionne peu ou pas de gene.', score: 2 },
  { code: 3, label: 'Moyenne. Conscience d\'une agitation associee a des mouvements caracteristiques comme le balancement d\'un pied sur l\'autre en station debout. Responsable d\'une gene chez le patient.', score: 3 },
  { code: 4, label: 'Akathisie marquee. Impression subjective d\'agitation avec le desir compulsif de marcher ou pietiner. Le patient peut neanmoins rester assis au moins 5 minutes. Manifestement eprouvante pour le patient.', score: 4 },
  { code: 5, label: 'Akathisie severe. Le patient rapporte un besoin compulsif de faire les cents pas la plupart du temps; Incapable de rester assis ou allonge plus de quelques minutes. Agitation permanente associee a une detresse intense et une insomnie.', score: 5 }
];

export const BARNES_QUESTIONS: Question[] = [
  {
    id: 'barnes_instructions',
    text: 'Instructions',
    help: 'Le patient doit etre observe assis, puis debout, engage dans une conversation neutre (1 a 2 minutes dans chaque position). Les symptomes observes dans d\'autres situations peuvent egalement etre cotes.',
    type: 'instruction',
    required: false
  },
  // Objective rating
  {
    id: 'section_objective',
    text: 'Cotation objective',
    type: 'section',
    required: false
  },
  {
    id: 'q1',
    text: 'Cotation objective',
    help: 'Evaluation des manifestations motrices observables de l\'akathisie: frottement, pietinement, balancement d\'une jambe assis et/ou balancement d\'un pied sur l\'autre ou pietinement debout.',
    type: 'single_choice',
    required: false,
    options: BARNES_OBJECTIVE_OPTIONS
  },
  // Subjective rating
  {
    id: 'section_subjective',
    text: 'Cotation subjective',
    type: 'section',
    required: false
  },
  {
    id: 'q2',
    text: 'Conscience de l\'agitation',
    help: 'Evaluation de la perception subjective d\'agitation interieure.',
    type: 'single_choice',
    required: false,
    options: BARNES_AGITATION_OPTIONS
  },
  {
    id: 'q3',
    text: 'Detresse relative aux impatiences',
    help: 'Evaluation du niveau de detresse causee par les symptomes.',
    type: 'single_choice',
    required: false,
    options: BARNES_DISTRESS_OPTIONS
  },
  // Global evaluation
  {
    id: 'section_global',
    text: 'Evaluation globale de l\'akathisie',
    type: 'section',
    required: false
  },
  {
    id: 'q4',
    text: 'Evaluation globale de l\'akathisie',
    help: 'Evaluation clinique globale integrant les observations objectives et subjectives. Note: La presence de mouvements caracteristiques d\'akathisie en l\'absence d\'impression subjective d\'agitation doit etre consideree comme une pseudo-akathisie (score = 0).',
    type: 'single_choice',
    required: false,
    options: BARNES_GLOBAL_OPTIONS
  }
];

export const BARNES_DEFINITION: QuestionnaireDefinition = {
  id: 'barnes',
  code: 'BARNES',
  title: 'BARNES - Echelle d\'akathisie de Barnes',
  description: 'Echelle a 4 items administree par le clinicien pour evaluer l\'akathisie induite par les medicaments, un effet secondaire frequent des antipsychotiques caracterise par une agitation subjective et des manifestations motrices objectives. Auteur: T. R. E. Barnes (1989).',
  questions: BARNES_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'Original (Barnes, 1989)',
    language: 'fr-FR'
  }
};

// ============================================================================
// Simpson-Angus Scale (SAS) - Extrapyramidal Side Effects
// ============================================================================
// 10-item clinician-rated scale for assessing drug-induced parkinsonism
// and extrapyramidal symptoms (EPS) associated with antipsychotic medications.
// Original authors: Simpson GM, Angus JWS (1970)

const SAS_RESPONSE_OPTIONS = [
  { code: 0, label: 'Normal (0)', score: 0 },
  { code: 1, label: 'Leger (1)', score: 1 },
  { code: 2, label: 'Modere (2)', score: 2 },
  { code: 3, label: 'Important (3)', score: 3 },
  { code: 4, label: 'Severe (4)', score: 4 }
];

export const SAS_QUESTIONS: Question[] = [
  {
    id: 'sas_instructions',
    text: 'Instructions',
    help: 'L\'examinateur effectue une serie de tests physiques et d\'observations pour evaluer les signes extrapyramidaux. Le score total est la moyenne des 10 items (somme / 10).',
    type: 'instruction',
    required: false
  },
  {
    id: 'q1',
    text: '1. Demarche',
    help: 'Le patient est examine pendant qu\'il marche dans la salle d\'examen. Sa demarche, le ballant de ses bras, sa posture generale permettent de coter cet item.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Normal', score: 0 },
      { code: 1, label: 'Diminution du ballant des bras a la marche', score: 1 },
      { code: 2, label: 'Diminution importante du ballant des bras avec une evidente rigidite des bras', score: 2 },
      { code: 3, label: 'Demarche raide, les bras maintenus de maniere rigide devant l\'abdomen', score: 3 },
      { code: 4, label: 'Demarche voutee, traine les pieds. Progresse par propulsion et retropulsion', score: 4 }
    ]
  },
  {
    id: 'q2',
    text: '2. Chute des bras',
    help: 'Le patient et l\'examinateur levent tous les deux les bras jusqu\'a la hauteur des epaules et les laissent tomber sur les cotes. Chez le sujet normal un claquement net est entendu quand les bras frappent les cotes.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Normal. Chute libre avec fort claquement et rebond', score: 0 },
      { code: 1, label: 'Chute legerement ralentie avec contact moins audible et petit rebond', score: 1 },
      { code: 2, label: 'Chute ralentie. Pas de rebond', score: 2 },
      { code: 3, label: 'Chute tres ralentie. Pas de claquement du tout', score: 3 },
      { code: 4, label: 'Les bras tombent comme une resistance. Comme a travers de la colle', score: 4 }
    ]
  },
  {
    id: 'q3',
    text: '3. Mouvements passifs de l\'epaule',
    help: 'Les coudes sont maintenus flechis a angle droit et les bras sont pris l\'un apres l\'autre par l\'examinateur. Le bras du sujet est pousse et tire pendant que l\'humerus subit un mouvement de rotation externe.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Normal', score: 0 },
      { code: 1, label: 'Rigidite et resistance legeres', score: 1 },
      { code: 2, label: 'Resistance et rigidite moyennes', score: 2 },
      { code: 3, label: 'Rigidite importante. Mouvements passifs difficiles', score: 3 },
      { code: 4, label: 'Resistance et rigidite extremes avec une epaule presque gelee', score: 4 }
    ]
  },
  {
    id: 'q4',
    text: '4. Rigidite du coude',
    help: 'Les deux articulations du coude sont maintenues l\'une apres l\'autre a angle droit puis etendues, flechies d\'une maniere passive. Le biceps du patient est alors observe et palpe en meme temps.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Normal', score: 0 },
      { code: 1, label: 'Rigidite et resistance legeres', score: 1 },
      { code: 2, label: 'Resistance et rigidite moyennes', score: 2 },
      { code: 3, label: 'Rigidite importante. Mouvements passifs difficiles', score: 3 },
      { code: 4, label: 'Resistance et rigidite extremes', score: 4 }
    ]
  },
  {
    id: 'q5',
    text: '5. Maintien des attitudes ou rigidite du poignet',
    help: 'Le poignet est tenu d\'une main et les doigts sont tenus par l\'autre main de l\'examinateur. Le poignet est mobilise en flexion, en extension, en deplacement radial et cubital.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Normal', score: 0 },
      { code: 1, label: 'Rigidite et resistance legeres', score: 1 },
      { code: 2, label: 'Resistance et rigidite moyennes', score: 2 },
      { code: 3, label: 'Rigidite importante. Mouvements passifs difficiles', score: 3 },
      { code: 4, label: 'Resistance et rigidite extremes', score: 4 }
    ]
  },
  {
    id: 'q6',
    text: '6. Mouvement pendulaire de la jambe',
    help: 'Le patient s\'assoit sur une table avec les jambes pendantes et bougeant librement. La cheville est attrapee par l\'examinateur et elevee jusqu\'a ce que le genou soit partiellement etendu. On laisse ensuite la jambe tomber.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'La jambe balance librement', score: 0 },
      { code: 1, label: 'Legere diminution du ballant des jambes', score: 1 },
      { code: 2, label: 'Resistance au ballant moyenne', score: 2 },
      { code: 3, label: 'Resistance et limitation du ballant importantes', score: 3 },
      { code: 4, label: 'Absence complete de ballant', score: 4 }
    ]
  },
  {
    id: 'q7',
    text: '7. Chute de la tete',
    help: 'Le patient s\'allonge sur une table d\'examen bien rembourree et l\'examinateur souleve la tete du patient avec sa main. La main est ensuite relachee et on laisse la tete retomber.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'La tete tombe completement avec un bruit distinct quand elle touche la table', score: 0 },
      { code: 1, label: 'Leger ralentissement dans la chute de la tete, surtout observe par l\'absence de claquement', score: 1 },
      { code: 2, label: 'Ralentissement modere de la chute, presque visible a l\'oeil nu', score: 2 },
      { code: 3, label: 'La tete tombe avec resistance et lentement', score: 3 },
      { code: 4, label: 'La tete n\'atteint pas la table d\'examen', score: 4 }
    ]
  },
  {
    id: 'q8',
    text: '8. Percussion de la glabelle (reflexe naso-palpebral)',
    help: 'On demande au sujet d\'ouvrir grand les yeux et de ne pas cligner des yeux. La glabelle est tapee doucement a une vitesse rapide et reguliere. Le nombre de fois de suite ou le patient cligne des yeux est note.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0-5 clignements', score: 0 },
      { code: 1, label: '6-10 clignements', score: 1 },
      { code: 2, label: '11-15 clignements', score: 2 },
      { code: 3, label: '16-20 clignements', score: 3 },
      { code: 4, label: '21 clignements et plus', score: 4 }
    ]
  },
  {
    id: 'q9',
    text: '9. Tremblement',
    help: 'Le patient est observe lorsqu\'il entre dans la salle d\'examen puis il est reexamine pour cet item.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Normal', score: 0 },
      { code: 1, label: 'Leger tremblement des doigts, evident a la vue et au toucher', score: 1 },
      { code: 2, label: 'Tremblement de la main ou du bras apparaissant de facon intermittente', score: 2 },
      { code: 3, label: 'Tremblements persistant d\'un ou de plusieurs membres', score: 3 },
      { code: 4, label: 'Tremblements de tout le corps', score: 4 }
    ]
  },
  {
    id: 'q10',
    text: '10. Salivation',
    help: 'Le patient est observe quand il parle. On lui demande d\'ouvrir la bouche et de soulever la langue.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: 'Normal', score: 0 },
      { code: 1, label: 'Salivation excessive au point qu\'une flaque apparait si la bouche est ouverte et la langue levee', score: 1 },
      { code: 2, label: 'L\'exces de salivation est present et peut parfois gener la parole', score: 2 },
      { code: 3, label: 'Parole difficile en raison d\'un exces de salivation', score: 3 },
      { code: 4, label: 'Franc bavage', score: 4 }
    ]
  }
];

export const SAS_DEFINITION: QuestionnaireDefinition = {
  id: 'sas',
  code: 'SAS',
  title: 'SAS - Echelle des effets secondaires extrapyramidaux',
  description: 'Echelle a 10 items administree par le clinicien pour evaluer le parkinsonisme medicamenteux et les effets secondaires extrapyramidaux (EPS) associes aux antipsychotiques. Evalue la rigidite, le tremblement, la demarche et autres symptomes moteurs. Auteurs: Simpson GM, Angus JWS (1970).',
  questions: SAS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'Original (Simpson & Angus, 1970)',
    language: 'fr-FR'
  }
};

// ============================================================================
// Personal and Social Performance Scale (PSP)
// ============================================================================
// Clinician-rated scale assessing personal and social functioning across 4 domains
// Score: 1-100 (clinician-determined via 3-step process)
// Original authors: Morosini PL, Magliano L, Brambilla L, Ugolini S, Pioli R (2000)

const PSP_SEVERITY_OPTIONS = [
  { code: 'Absent', label: 'Absent - Pas de difficulte', score: 0 },
  { code: 'Leger', label: 'Leger - Difficultes connues seulement d\'une personne familiere', score: 1 },
  { code: 'Manifeste', label: 'Manifeste - Difficultes remarquees mais n\'interferant pas substantiellement', score: 2 },
  { code: 'Marque', label: 'Marque - Difficultes interferant lourdement', score: 3 },
  { code: 'Severe', label: 'Severe - Incapable sans aide professionnelle', score: 4 },
  { code: 'Tres_severe', label: 'Tres severe - Difficultes mettant en danger la survie', score: 5 }
];

export const PSP_QUESTIONS: Question[] = [
  {
    id: 'psp_instructions',
    text: 'Instructions',
    help: 'Evaluez le fonctionnement du patient au cours du mois dernier selon un processus en 3 etapes: (1) Evaluer chaque domaine, (2) Choisir un intervalle de 10 points, (3) Ajuster le score final.',
    type: 'instruction',
    required: false
  },
  {
    id: 'step1_header',
    text: 'Etape 1: Evaluer le niveau de fonctionnement dans les 4 domaines',
    help: 'Pour chaque domaine, evaluez le moins bon fonctionnement du sous-domaine le plus pertinent.',
    type: 'section',
    required: false
  },
  {
    id: 'domain_a',
    text: '(a) Activites socialement utiles',
    help: 'Incluant le travail et les etudes. Les activites socialement utiles incluent la cooperation pour le maintien du domicile, le travail volontaire, les passe-temps utiles comme le jardinage.',
    type: 'single_choice',
    required: false,
    options: PSP_SEVERITY_OPTIONS
  },
  {
    id: 'domain_b',
    text: '(b) Relations personnelles et sociales',
    help: 'Les relations incluent les relations avec un partenaire (pour les personnes ayant un partenaire) ou avec des proches, ainsi que les relations sociales.',
    type: 'single_choice',
    required: false,
    options: PSP_SEVERITY_OPTIONS
  },
  {
    id: 'domain_c',
    text: '(c) Souci de soi',
    help: 'Le souci de soi inclut l\'hygiene personnelle, l\'apparence, l\'habillement.',
    type: 'single_choice',
    required: false,
    options: PSP_SEVERITY_OPTIONS
  },
  {
    id: 'domain_d',
    text: '(d) Comportements perturbateurs et agressifs',
    help: 'Frequent = comportement survenu plus d\'une fois ou pouvant probablement survenir dans les 6 mois. Si non frequent, la severite peut etre diminuee d\'un niveau.',
    type: 'single_choice',
    required: false,
    options: PSP_SEVERITY_OPTIONS
  },
  {
    id: 'step2_header',
    text: 'Etape 2: Choisir un intervalle de 10 points',
    help: 'Les criteres de chaque intervalle sont bases sur differentes combinaisons des severites des 4 domaines.',
    type: 'section',
    required: false
  },
  {
    id: 'interval_selection',
    text: 'Intervalle de 10 points',
    help: 'Selectionnez l\'intervalle correspondant au profil de severite du patient.',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '91-100: Tres bon fonctionnement dans les 4 domaines', score: 1 },
      { code: 2, label: '81-90: Bon fonctionnement, difficultes courantes seulement', score: 2 },
      { code: 3, label: '71-80: Difficultes legeres dans au moins un domaine (a)-(c)', score: 3 },
      { code: 4, label: '61-70: Difficultes manifestes dans (a)-(c) ou legeres dans (d)', score: 4 },
      { code: 5, label: '51-60: Difficultes marquees dans 1 domaine (a)-(c) ou manifestes dans (d)', score: 5 },
      { code: 6, label: '41-50: Marquees dans 2+ domaines (a)-(c) ou severes dans 1 domaine', score: 6 },
      { code: 7, label: '31-40: Severes dans 1 domaine + marquees dans 1+ autres ou marquees dans (d)', score: 7 },
      { code: 8, label: '21-30: Severes dans 2 domaines (a)-(c) ou severes dans (d)', score: 8 },
      { code: 9, label: '11-20: Severes dans tous domaines ou tres severes dans (d)', score: 9 },
      { code: 10, label: '1-10: Absence d\'autonomie, comportements extremes', score: 10 }
    ]
  },
  {
    id: 'step3_header',
    text: 'Etape 3: Ajuster le score final',
    help: 'Ajustez le score dans l\'intervalle en tenant compte d\'autres domaines: sante, logement, activites menageres, relations intimes, soins aux enfants, reseau social, regles sociales, interets, gestion financiere, transports, capacite a affronter les crises.',
    type: 'section',
    required: false
  },
  {
    id: 'final_score',
    text: 'Score PSP final (1-100)',
    help: 'Entrez le score final entre 1 et 100 en fonction de l\'intervalle selectionne et des ajustements cliniques.',
    type: 'number',
    required: false
  }
];

export const PSP_DEFINITION: QuestionnaireDefinition = {
  id: 'psp',
  code: 'PSP',
  title: 'PSP - Echelle de fonctionnement personnel et social',
  description: 'Echelle administree par le clinicien evaluant le fonctionnement personnel et social des patients atteints de schizophrenie dans 4 domaines principaux. Fournit un score global de 1-100 refletant le niveau de fonctionnement du patient au cours du mois dernier. Auteurs: Morosini PL et al. (2000).',
  questions: PSP_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'Original (Morosini et al., 2000)',
    language: 'fr-FR'
  }
};

// ============================================================================
// ECV - Evaluation des comportements violents
// ============================================================================
// Assessment of violent behaviors over the patient's lifetime, covering verbal
// violence, physical violence, sexual violence, and property damage.
// This is a descriptive questionnaire without computed scores.

const ECV_YES_NO_OPTIONS = [
  { code: 'Oui', label: 'Oui', score: 0 },
  { code: 'Non', label: 'Non', score: 1 }
];

const ECV_TYPE_OPTIONS = [
  { code: 'Intrafamiliale', label: 'Intrafamiliale' },
  { code: 'Extrafamiliale', label: 'Extrafamiliale' }
];

const ECV_CONVICTION_TYPE_OPTIONS = [
  { code: 'Amende', label: 'Amende' },
  { code: 'Sursis', label: 'Sursis' },
  { code: 'Prison', label: 'Prison' }
];

export const ECV_QUESTIONS: Question[] = [
  // ==================== Violence verbale ====================
  {
    id: 'section_verbal',
    text: 'Violence verbale',
    type: 'section',
    required: false
  },
  {
    id: 'rad_ecv_vv1',
    text: 'Le sujet a-t-il presente (sur la vie entiere): Violence verbale:',
    type: 'single_choice',
    required: false,
    options: ECV_YES_NO_OPTIONS
  },
  {
    id: 'chk_ecv_vv2',
    text: 'Type:',
    type: 'multiple_choice',
    required: false,
    options: ECV_TYPE_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vv1' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_ecv_vv3',
    text: 'Intervention de la police:',
    type: 'single_choice',
    required: false,
    options: ECV_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vv1' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_ecv_vv4',
    text: 'Condamnation:',
    type: 'single_choice',
    required: false,
    options: ECV_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vv1' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'chk_ecv_vv5',
    text: '(Type de condamnation)',
    type: 'multiple_choice',
    required: false,
    options: ECV_CONVICTION_TYPE_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vv4' }, 'Oui'] },
    indentLevel: 2
  },
  // ==================== Violence physique ====================
  {
    id: 'section_physical',
    text: 'Violence physique',
    type: 'section',
    required: false
  },
  {
    id: 'rad_ecv_vp1',
    text: 'Violence physique:',
    type: 'single_choice',
    required: false,
    options: ECV_YES_NO_OPTIONS
  },
  {
    id: 'rad_ecv_vp2',
    text: 'Coups et blessures:',
    type: 'single_choice',
    required: false,
    options: ECV_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vp1' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'chk_ecv_vp3',
    text: '(Arme utilisee)',
    type: 'multiple_choice',
    required: false,
    options: [
      { code: 'Sans arme', label: 'Sans arme' },
      { code: 'Arme blanche', label: 'Arme blanche' },
      { code: 'Arme a feu', label: 'Arme a feu' }
    ],
    display_if: { '==': [{ 'var': 'rad_ecv_vp2' }, 'Oui'] },
    indentLevel: 2
  },
  {
    id: 'rad_ecv_vp4',
    text: 'Ayant entraine des soins chez le tiers:',
    type: 'single_choice',
    required: false,
    options: ECV_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vp2' }, 'Oui'] },
    indentLevel: 2
  },
  {
    id: 'rad_ecv_vp5',
    text: 'Homicide:',
    type: 'single_choice',
    required: false,
    options: ECV_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vp1' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'chk_ecv_vp6',
    text: 'Type:',
    type: 'multiple_choice',
    required: false,
    options: ECV_TYPE_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vp1' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_ecv_vp7',
    text: 'Intervention de la police:',
    type: 'single_choice',
    required: false,
    options: ECV_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vp1' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_ecv_vp8',
    text: 'Condamnation:',
    type: 'single_choice',
    required: false,
    options: ECV_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vp1' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'chk_ecv_vp9',
    text: '(Type de condamnation)',
    type: 'multiple_choice',
    required: false,
    options: ECV_CONVICTION_TYPE_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vp8' }, 'Oui'] },
    indentLevel: 2
  },
  // ==================== Violence sexuelle ====================
  {
    id: 'section_sexual',
    text: 'Violence sexuelle',
    type: 'section',
    required: false
  },
  {
    id: 'rad_ecv_vs1',
    text: 'Violence sexuelle:',
    type: 'single_choice',
    required: false,
    options: ECV_YES_NO_OPTIONS
  },
  {
    id: 'chk_ecv_vs2',
    text: '(Preciser le type)',
    type: 'multiple_choice',
    required: false,
    options: [
      { code: 'Viol', label: 'Viol' },
      { code: 'Attouchements', label: 'Attouchements' }
    ],
    display_if: { '==': [{ 'var': 'rad_ecv_vs1' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'chk_ecv_vs3',
    text: 'Type:',
    type: 'multiple_choice',
    required: false,
    options: ECV_TYPE_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vs1' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_ecv_vs4',
    text: 'Intervention de la police:',
    type: 'single_choice',
    required: false,
    options: ECV_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vs1' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_ecv_vs5',
    text: 'Condamnation:',
    type: 'single_choice',
    required: false,
    options: ECV_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vs1' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'chk_ecv_vs6',
    text: '(Type de condamnation)',
    type: 'multiple_choice',
    required: false,
    options: ECV_CONVICTION_TYPE_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vs5' }, 'Oui'] },
    indentLevel: 2
  },
  // ==================== Bris d'objet ====================
  {
    id: 'section_property',
    text: 'Bris d\'objet',
    type: 'section',
    required: false
  },
  {
    id: 'rad_ecv_vo1',
    text: 'Bris d\'objet:',
    type: 'single_choice',
    required: false,
    options: ECV_YES_NO_OPTIONS
  },
  {
    id: 'chk_ecv_vo2',
    text: 'Type:',
    type: 'multiple_choice',
    required: false,
    options: ECV_TYPE_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vo1' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_ecv_vo3',
    text: 'Intervention de la police:',
    type: 'single_choice',
    required: false,
    options: ECV_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vo1' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_ecv_vo4',
    text: 'Condamnation:',
    type: 'single_choice',
    required: false,
    options: ECV_YES_NO_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vo1' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'chk_ecv_vo5',
    text: '(Type de condamnation)',
    type: 'multiple_choice',
    required: false,
    options: ECV_CONVICTION_TYPE_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_ecv_vo4' }, 'Oui'] },
    indentLevel: 2
  }
];

export const ECV_DEFINITION: QuestionnaireDefinition = {
  id: 'ecv',
  code: 'ECV',
  title: 'Evaluation des comportements violents',
  description: 'Evaluation des comportements violents sur la vie entiere, couvrant la violence verbale, la violence physique, la violence sexuelle et les bris d\'objets. Ce questionnaire est descriptif et ne produit pas de score calcule.',
  questions: ECV_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: '1.0',
    language: 'fr-FR'
  }
};

// ============================================================================
// TROUBLES PSYCHOTIQUES - Comprehensive diagnostic questionnaire
// ============================================================================

// Common options - use string codes to match display_if conditions
const TROUBLES_PSYCHOTIQUES_YES_NO_OPTIONS: QuestionOption[] = [
  { code: 'Oui', label: 'Oui' },
  { code: 'Non', label: 'Non' }
];

const TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS: QuestionOption[] = [
  { code: 'Oui', label: 'Oui' },
  { code: 'Non', label: 'Non' },
  { code: 'Ne sais pas', label: 'Ne sais pas' }
];

// Disorder type options (when patient HAS psychotic spectrum disorder)
// Use string codes ('1', '2', etc.) to match display_if conditions
const TROUBLES_PSYCHOTIQUES_TYPE_OPTIONS: QuestionOption[] = [
  { code: '1', label: 'Schizophrenie (incluant psychose hallucinatoire chronique et paraphrenie tardive)' },
  { code: '2', label: 'Trouble schizo-affectif' },
  { code: '3', label: 'Personnalite schizoide (selon le DSM-IV)' },
  { code: '4', label: 'Personnalite schizotypique (selon le DSM-IV)' },
  { code: '5', label: 'Trouble psychotique bref (/aigu et transitoire)' },
  { code: '6', label: 'Trouble schizophreniforme (entre 1 et 6 mois)' },
  { code: '7', label: 'Trouble psychotique induit par une substance (pharmacopsychose)' },
  { code: '8', label: 'Trouble delirant persistant non schizophrenique' },
  { code: '9', label: 'Trouble psychotique du a une affection medicale generale' },
  { code: '10', label: 'Autre' }
];

// Alternative diagnosis options (when patient does NOT have psychotic spectrum disorder)
// Use string codes to match display_if conditions
const TROUBLES_PSYCHOTIQUES_NON_OPTIONS: QuestionOption[] = [
  { code: '1', label: 'Trouble bipolaire de l\'humeur de type 1' },
  { code: '2', label: 'Trouble bipolaire de l\'humeur de type 2' },
  { code: '3', label: 'Trouble depressif avec caracteristiques psychotiques' },
  { code: '4', label: 'Trouble obsessionnel compulsif' },
  { code: '5', label: 'Trouble de personnalite borderline' },
  { code: '6', label: 'Maladie de Nieman-Pick de type C' },
  { code: '7', label: 'Autre trouble genetique' },
  { code: '8', label: 'Syndrome TDAH' },
  { code: '9', label: 'Syndrome d\'Asperger' },
  { code: '10', label: 'Trouble du spectre autistique hors Asperger' },
  { code: '11', label: 'Maladie de Wilson' },
  { code: '12', label: 'Troubles lies a une affection neurologique' },
  { code: '13', label: 'Deficience intellectuelle' }
];

// Age options (generate <5, 5-89, >89, Ne sais pas)
// Use string codes to match display_if conditions
const generateAgeOptions = (includeNoHosp = false, includeNone = false): QuestionOption[] => {
  const options: QuestionOption[] = [];
  if (includeNone) {
    options.push({ code: 'Aucun', label: 'Aucun' });
  }
  if (includeNoHosp) {
    options.push({ code: 'Pas d\'hospitalisations', label: 'Pas d\'hospitalisations' });
  }
  options.push({ code: '<5', label: '<5' });
  for (let i = 5; i <= 89; i++) {
    options.push({ code: String(i), label: String(i) });
  }
  options.push({ code: '>89', label: '>89' });
  options.push({ code: 'Ne sais pas', label: 'Ne sais pas' });
  return options;
};

// Count options (0-20, >20, Ne sais pas)
// Use string codes to match display_if conditions
const generateCountOptions = (includeNone = false): QuestionOption[] => {
  const options: QuestionOption[] = [];
  if (includeNone) {
    options.push({ code: 'Aucun', label: 'Aucun' });
  }
  for (let i = 0; i <= 20; i++) {
    options.push({ code: String(i), label: String(i) });
  }
  options.push({ code: '>20', label: '>20' });
  options.push({ code: 'Ne sais pas', label: 'Ne sais pas' });
  return options;
};

// Month duration options (0-30, >30, Ne sais pas)
// Use string codes
const generateMonthOptions = (): QuestionOption[] => {
  const options: QuestionOption[] = [];
  for (let i = 0; i <= 30; i++) {
    options.push({ code: String(i), label: String(i) });
  }
  options.push({ code: '>30', label: '>30' });
  options.push({ code: 'Ne sais pas', label: 'Ne sais pas' });
  return options;
};

// Week duration options (0-52, Ne sais pas)
// Use string codes
const generateWeekOptions = (): QuestionOption[] => {
  const options: QuestionOption[] = [];
  for (let i = 0; i <= 52; i++) {
    options.push({ code: String(i), label: String(i) });
  }
  options.push({ code: 'Ne sais pas', label: 'Ne sais pas' });
  return options;
};

// Episode type options - use string codes (no empty string allowed by Radix Select)
const EPISODE_TYPE_OPTIONS: QuestionOption[] = [
  { code: 'Paranoide', label: 'Paranoide' },
  { code: 'Indifferencie', label: 'Indifferencie' },
  { code: 'Desorganise', label: 'Desorganise' },
  { code: 'Catatonique', label: 'Catatonique' },
  { code: 'Schizo-affectif depressif', label: 'Schizo-affectif depressif' },
  { code: 'Schizo-affectif mixte', label: 'Schizo-affectif mixte' },
  { code: 'Schizo-affectif maniaque', label: 'Schizo-affectif maniaque' }
];

// Evolutionary mode options - use string codes matching database values
const EVOLUTIONARY_MODE_OPTIONS: QuestionOption[] = [
  { code: 'Episodique avec symptomes residuels entre les episodes et avec presence de symptomes negatifs', label: 'Episodique avec symptomes residuels + symptomes negatifs' },
  { code: 'Episodique avec symptomes residuels entre les episodes et sans symptomes negatifs', label: 'Episodique avec symptomes residuels sans symptomes negatifs' },
  { code: 'Episodique sans symptomes residuels entre les episodes', label: 'Episodique sans symptomes residuels' },
  { code: 'Continu avec symptomes negatifs prononces', label: 'Continu avec symptomes negatifs prononces' },
  { code: 'Continu', label: 'Continu' },
  { code: 'Episode isole avec symptomes negatifs prononces', label: 'Episode isole avec symptomes negatifs prononces' },
  { code: 'Episode isole en remission partielle', label: 'Episode isole en remission partielle' },
  { code: 'Episode isole en remission complete', label: 'Episode isole en remission complete' },
  { code: 'Autre cours evolutif', label: 'Autre cours evolutif' }
];

// Hospitalization reason options - use string codes
const HOSPITALIZATION_REASON_OPTIONS: QuestionOption[] = [
  { code: 'Episode psychotique', label: 'Episode psychotique' },
  { code: 'Episode thymique', label: 'Episode thymique' },
  { code: 'Tentative de suicide', label: 'Tentative de suicide' },
  { code: 'Destabilisation de l\'environnement', label: 'Destabilisation de l\'environnement' },
  { code: 'Recrudescence anxieuse', label: 'Recrudescence anxieuse' },
  { code: 'Autres', label: 'Autres' }
];

// Treatment support options - use string codes for checkbox/contains conditions
const TREATMENT_SUPPORT_OPTIONS: QuestionOption[] = [
  { code: 'Autonome', label: 'Autonome' },
  { code: 'Aide familiale', label: 'Aide familiale' },
  { code: 'Aide au CMP ou a l\'hopital', label: 'Aide au CMP ou a l\'hopital' },
  { code: 'IDE au domicile', label: 'IDE au domicile' }
];

// Periodicity options - use string codes
const PERIODICITY_OPTIONS: QuestionOption[] = [
  { code: 'Quotidienne', label: 'Quotidienne' },
  { code: 'Hebdomadaire', label: 'Hebdomadaire' },
  { code: 'Bimensuelle', label: 'Bimensuelle' },
  { code: 'Mensuelle', label: 'Mensuelle' }
];

// Non-pharmacological treatment change options - use string codes
const TREATMENT_CHANGE_OPTIONS: QuestionOption[] = [
  { code: 'Debut', label: 'Debut' },
  { code: 'Fin', label: 'Fin' }
];

// Care type change options (for checkboxes) - use string codes
const CARE_TYPE_CHANGE_OPTIONS: QuestionOption[] = [
  { code: 'Debut', label: 'Debut' },
  { code: 'Augmente', label: 'Augmente' },
  { code: 'Diminue', label: 'Diminue' },
  { code: 'Fin', label: 'Fin' }
];

// Substance type options - use string codes for checkbox
const SUBSTANCE_TYPE_OPTIONS: QuestionOption[] = [
  { code: 'Alcool', label: 'Alcool' },
  { code: 'Cannabis', label: 'Cannabis' },
  { code: 'Opiaces', label: 'Opiaces' },
  { code: 'Cocaine', label: 'Cocaine' },
  { code: 'Hallucinogene', label: 'Hallucinogene' },
  { code: 'Autres', label: 'Autres' }
];

// Helper function to generate episode questions
const generateEpisodeQuestions = (): Question[] => {
  const questions: Question[] = [];
  for (let i = 1; i <= 20; i++) {
    questions.push(
      {
        id: `rad_tbpsychovie_ep${i}_type`,
        text: `Type de l'episode ${i}`,
        type: 'single_choice',
        required: false,
        options: EPISODE_TYPE_OPTIONS
      },
      {
        id: `tbpsychovie_ep${i}_debut`,
        text: `Date de debut de l'episode ${i}`,
        type: 'text',
        required: false
      },
      {
        id: `rad_tbpsychovie_ep${i}_hosp`,
        text: `Hospitalisation pour l'episode ${i}`,
        type: 'single_choice',
        required: false,
        options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
      },
      {
        id: `tbpsychovie_ep${i}_hospduree`,
        text: `Duree d'hospitalisation pour l'episode ${i} (semaines)`,
        type: 'text',
        required: false,
        display_if: { '==': [{ 'var': `rad_tbpsychovie_ep${i}_hosp` }, 'Oui'] },
        indentLevel: 1
      }
    );
  }
  return questions;
};

// Helper function to generate symptom questions with "last month" follow-up
const generateSymptomQuestion = (id: string, label: string): Question[] => {
  return [
    {
      id: `rad_symptomesvie_${id}`,
      text: label,
      type: 'single_choice',
      required: false,
      options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
    },
    {
      id: `rad_symptomesvie_${id}_mois`,
      text: 'Presence lors du dernier mois',
      type: 'single_choice',
      required: false,
      options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
      display_if: { '==': [{ 'var': `rad_symptomesvie_${id}` }, 'Oui'] },
      indentLevel: 1
    }
  ];
};

export const TROUBLES_PSYCHOTIQUES_QUESTIONS: Question[] = [
  // ==================== SECTION: DISORDER CLASSIFICATION ====================
  {
    id: 'section_disorder_classification',
    text: 'Trouble psychotique vie entiere',
    type: 'section',
    required: false
  },
  {
    id: 'rad_tbpsychovie',
    text: 'Le patient presente-t-il un trouble appartenant au spectre psychotique ou schizophrenique?',
    type: 'single_choice',
    required: true,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_OPTIONS
  },
  {
    id: 'radhtml_tbpsychovie_type',
    text: 'Type de trouble',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_TYPE_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tbpsychovie' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'radhtml_tbpsychovie_non',
    text: 'Type de trouble (si non psychotique)',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_NON_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tbpsychovie' }, 'Non'] },
    indentLevel: 1
  },
  {
    id: 'tbpsychovie_non_autre',
    text: 'Autre trouble (preciser)',
    type: 'text',
    required: false,
    display_if: { '==': [{ 'var': 'radhtml_tbpsychovie_non' }, '7'] },
    indentLevel: 2
  },

  // ==================== SECTION: LIFETIME CHARACTERISTICS ====================
  {
    id: 'section_lifetime_characteristics',
    text: 'Caracteristiques du trouble vie entiere',
    type: 'section',
    required: false
  },
  {
    id: 'rad_tbpsychovie_premierep_age',
    text: 'Age du 1er episode psychotique',
    type: 'single_choice',
    required: false,
    options: generateAgeOptions(),
    display_if: { '==': [{ 'var': 'rad_tbpsychovie' }, 'Oui'] }
  },
  {
    id: 'rad_tbpsychovie_premiertrait_age',
    text: 'Age du 1er traitement antipsychotique',
    type: 'single_choice',
    required: false,
    options: generateAgeOptions(),
    display_if: { '==': [{ 'var': 'rad_tbpsychovie' }, 'Oui'] }
  },
  {
    id: 'tbpsychovie_premiertrait_duree',
    text: 'Duree de psychose non traitee (mois)',
    type: 'text',
    required: false,
    display_if: { '==': [{ 'var': 'rad_tbpsychovie' }, 'Oui'] }
  },
  {
    id: 'rad_tbpsychovie_premierhosp_age',
    text: 'Age de la 1ere hospitalisation en psychiatrie pour trouble psychotique',
    type: 'single_choice',
    required: false,
    options: generateAgeOptions(true),
    display_if: { '==': [{ 'var': 'rad_tbpsychovie' }, 'Oui'] }
  },
  {
    id: 'tbduree',
    text: 'Duree en semaines',
    type: 'number',
    required: false,
    min: 0,
    max: 50,
    display_if: {
      'and': [
        { '!=': [{ 'var': 'rad_tbpsychovie_premierhosp_age' }, ''] },
        { '!=': [{ 'var': 'rad_tbpsychovie_premierhosp_age' }, 'Pas d\'hospitalisations'] }
      ]
    },
    indentLevel: 1
  },
  {
    id: 'tbdureetot',
    text: 'Duree totale des hospitalisations pour le 1er episode psychotique (semaines)',
    type: 'number',
    required: false,
    max: 50,
    display_if: {
      'and': [
        { '!=': [{ 'var': 'rad_tbpsychovie_premierhosp_age' }, ''] },
        { '!=': [{ 'var': 'rad_tbpsychovie_premierhosp_age' }, 'Pas d\'hospitalisations'] }
      ]
    },
    indentLevel: 1
  },
  {
    id: 'rad_tbpsychovie_hospit_nb',
    text: 'Nombre d\'hospitalisations en psychiatrie sur la vie entiere',
    type: 'single_choice',
    required: false,
    options: generateCountOptions(),
    display_if: {
      'and': [
        { '!=': [{ 'var': 'rad_tbpsychovie_premierhosp_age' }, ''] },
        { '!=': [{ 'var': 'rad_tbpsychovie_premierhosp_age' }, 'Pas d\'hospitalisations'] }
      ]
    },
    indentLevel: 1
  },
  {
    id: 'rad_tbpsychovie_hospit_dureetot',
    text: 'Duree totale des hospitalisations en psychiatrie sur la vie entiere (mois)',
    type: 'single_choice',
    required: false,
    options: generateMonthOptions(),
    display_if: {
      'and': [
        { '!=': [{ 'var': 'rad_tbpsychovie_premierhosp_age' }, ''] },
        { '!=': [{ 'var': 'rad_tbpsychovie_premierhosp_age' }, 'Pas d\'hospitalisations'] }
      ]
    },
    indentLevel: 1
  },
  {
    id: 'rad_tbpsychovie_nb',
    text: 'Nombre d\'episodes psychotiques',
    type: 'single_choice',
    required: false,
    options: generateCountOptions(true),
    display_if: { '==': [{ 'var': 'rad_tbpsychovie' }, 'Oui'] }
  },

  // ==================== SECTION: LIFETIME SYMPTOMS ====================
  {
    id: 'section_lifetime_symptoms',
    text: 'Symptomes vie entiere',
    type: 'section',
    required: false
  },
  {
    id: 'rad_symptomesvie_persecution',
    text: 'Delire de persecution',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_persecution_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_persecution' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_grandeur',
    text: 'Delire de grandeur',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_grandeur_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_grandeur' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_somatique',
    text: 'Delire somatique',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_somatique_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_somatique' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_mystique',
    text: 'Delire mystique',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_mystique_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_mystique' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_culpabilite',
    text: 'Delire de culpabilite',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_culpabilite_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_culpabilite' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_jalousie',
    text: 'Delire de jalousie',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_jalousie_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_jalousie' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_erotomaniaque',
    text: 'Delire erotomaniaque',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_erotomaniaque_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_erotomaniaque' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_etrecontrole',
    text: 'Delire d\'etre controle',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_etrecontrole_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_etrecontrole' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_volpensee',
    text: 'Delire de vol de la pensee',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_volpensee_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_volpensee' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_bizarre',
    text: 'Delire bizarre',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_bizarre_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_bizarre' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_idreferences',
    text: 'Idees de references',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_idreferences_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_idreferences' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_halluintrapsy',
    text: 'Hallucinations auditives intrapsychiques',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_halluintrapsy_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_halluintrapsy' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_hallusenso',
    text: 'Hallucination auditives sensorielles',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_hallusenso_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_hallusenso' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_halluvisu',
    text: 'Hallucinations visuelles',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_halluvisu_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_halluvisu' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_hallucenesthe',
    text: 'Hallucinations cenesthesiques',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_hallucenesthe_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_hallucenesthe' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_catatonie',
    text: 'Catatonie',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_catatonie_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_catatonie' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_compodesorg',
    text: 'Comportement desorganise',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_compodesorg_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_compodesorg' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_gestdiscord',
    text: 'Gestuelle discordante',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_gestdiscord_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_gestdiscord' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_discdesorg',
    text: 'Discours desorganise',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_discdesorg_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_discdesorg' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_avolition',
    text: 'Avolition',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_avolition_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_avolition' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_alogie',
    text: 'Alogie',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_alogie_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_alogie' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_symptomesvie_emousaffec',
    text: 'Emoussement affectif',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_symptomesvie_emousaffec_mois',
    text: 'Presence lors du dernier mois',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_symptomesvie_emousaffec' }, 'Oui'] },
    indentLevel: 1
  },

  // ==================== SECTION: EVOLUTIONARY MODE ====================
  {
    id: 'section_evolutionary_mode',
    text: 'Mode evolutif de la symptomatologie',
    type: 'section',
    required: false
  },
  {
    id: 'rad_symptomeevo_mode',
    text: 'Mode evolutif',
    type: 'single_choice',
    required: false,
    options: EVOLUTIONARY_MODE_OPTIONS
  },

  // ==================== SECTION: ANNUAL CHARACTERISTICS ====================
  {
    id: 'section_annual_characteristics',
    text: 'Caracteristiques du trouble au cours des 12 derniers mois',
    type: 'section',
    required: false
  },

  // Psychotic episode during the year
  {
    id: 'rad_tbpsychoan',
    text: 'Presence d\'au moins un episode psychotique au cours de l\'annee',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },

  // Subsection: Hospitalization
  {
    id: 'section_annual_hospitalization',
    text: 'Hospitalisation au cours de l\'annee ecoulee',
    type: 'instruction',
    required: false
  },
  
  // Full-time hospitalizations
  {
    id: 'rad_tbpsychoan_hospi_tpscomplet',
    text: 'Hospitalisations a temps complet au cours de l\'annee ecoulee',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tbpsychoan_hospi_tpscomplet_nb',
    text: 'Nombre d\'hospitalisations au cours de l\'annee ecoulee',
    type: 'single_choice',
    required: false,
    options: generateCountOptions(),
    display_if: { '==': [{ 'var': 'rad_tbpsychoan_hospi_tpscomplet' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_tbpsychoan_hospi_tpscomplet_duree',
    text: 'Duree totale des hospitalisations sur l\'annee ecoulee (semaines)',
    type: 'single_choice',
    required: false,
    options: generateWeekOptions(),
    display_if: { '==': [{ 'var': 'rad_tbpsychoan_hospi_tpscomplet' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'rad_tbpsychoan_hospi_tpscomplet_motif',
    text: 'Motif d\'hospitalisation',
    type: 'single_choice',
    required: false,
    options: HOSPITALIZATION_REASON_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tbpsychoan_hospi_tpscomplet' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'tbpsychoan_hospi_tpscomplet_motifautre',
    text: 'Autre motif (preciser)',
    type: 'text',
    required: false,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_tbpsychoan_hospi_tpscomplet' }, 'Oui'] },
        { '==': [{ 'var': 'rad_tbpsychoan_hospi_tpscomplet_motif' }, 'Autres'] }
      ]
    },
    indentLevel: 2
  },
  
  // Non-pharmacological treatment change
  {
    id: 'rad_tbpsychoan_modpec_nonmed',
    text: 'Changement de prise en charge non medicamenteuse',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'chk_tbpsychoan_modpec_nonmed_tcc',
    text: 'Approche TCC',
    type: 'multiple_choice',
    required: false,
    options: TREATMENT_CHANGE_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tbpsychoan_modpec_nonmed' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'chk_tbpsychoan_modpec_nonmed_remed',
    text: 'Remediation des fonctions cognitives',
    type: 'multiple_choice',
    required: false,
    options: TREATMENT_CHANGE_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tbpsychoan_modpec_nonmed' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'chk_tbpsychoan_modpec_nonmed_psychody',
    text: 'Approche psychodynamique',
    type: 'multiple_choice',
    required: false,
    options: TREATMENT_CHANGE_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tbpsychoan_modpec_nonmed' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'chk_tbpsychoan_modpec_nonmed_fam',
    text: 'Approche familiale',
    type: 'multiple_choice',
    required: false,
    options: TREATMENT_CHANGE_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_tbpsychoan_modpec_nonmed' }, 'Oui'] },
    indentLevel: 1
  },
  {
    id: 'tbpsychoan_modpec_nonmed_autre',
    text: 'Autres (preciser)',
    type: 'text',
    required: false,
    display_if: { '==': [{ 'var': 'rad_tbpsychoan_modpec_nonmed' }, 'Oui'] },
    indentLevel: 1
  },

  // Treatment adherence support
  {
    id: 'chk_aide_prise_tt',
    text: 'Aide a la prise de traitement',
    type: 'multiple_choice',
    required: false,
    options: TREATMENT_SUPPORT_OPTIONS
  },
  {
    id: 'rad_aide_prise_tt_hospi',
    text: 'Periodicite',
    type: 'single_choice',
    required: false,
    options: PERIODICITY_OPTIONS,
    display_if: { 'in': ['Aide au CMP ou a l\'hopital', { 'var': 'chk_aide_prise_tt' }] },
    indentLevel: 1
  },

  // Suicide attempts
  {
    id: 'rad_tbpsychoan_ts',
    text: 'Presence de tentatives de suicide au cours de l\'annee ecoulee',
    type: 'single_choice',
    required: false,
    options: TROUBLES_PSYCHOTIQUES_YES_NO_UNKNOWN_OPTIONS
  },
  {
    id: 'rad_tbpsychoan_ts_nb',
    text: 'Nombre de tentatives de suicide au cours de l\'annee ecoulee',
    type: 'single_choice',
    required: false,
    options: generateCountOptions(),
    display_if: { '==': [{ 'var': 'rad_tbpsychoan_ts' }, 'Oui'] },
    indentLevel: 1
  }
];

export const TROUBLES_PSYCHOTIQUES_DEFINITION: QuestionnaireDefinition = {
  id: 'troubles_psychotiques',
  code: 'TROUBLES_PSYCHOTIQUES',
  title: 'Troubles psychotiques',
  description: 'Evaluation complete des troubles psychotiques incluant la classification des troubles, les caracteristiques vie entiere, l\'inventaire des symptomes (positifs et negatifs), l\'historique des episodes (jusqu\'a 20 episodes), les hospitalisations, le mode evolutif et le suivi annuel. Ce questionnaire est l\'outil diagnostique central pour les troubles du spectre schizophrenique.',
  instructions: 'Ce questionnaire doit etre administre par un clinicien forme. Evaluer systematiquement chaque section. Periode de reference: Vie entiere et 12 derniers mois. Ce questionnaire est descriptif et ne produit pas de scores calcules.',
  questions: TROUBLES_PSYCHOTIQUES_QUESTIONS,
  metadata: {
    singleColumn: false,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: '1.0',
    language: 'fr-FR'
  }
};

// ============================================================================
// SUICIDE HISTORY - Schizophrenia (Simplified version)
// Histoire des conduites suicidaires - Version simplifiee pour schizophrenie
// ============================================================================

export const SUICIDE_HISTORY_SZ_QUESTIONS: Question[] = [
  // Section: Informations generales
  {
    id: 'q1_first_attempt_date',
    text: 'Date de la premiere tentative de suicide',
    type: 'date',
    required: false
  },
  {
    id: 'q2_attempt_count',
    text: 'Combien de fois avez-vous tente de vous suicider ?',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'q3_attempt_count_12m',
    text: 'Combien de fois avez-vous tente de vous suicider au cours des 12 derniers mois ?',
    type: 'number',
    required: false,
    min: 0
  },
  // Section: Details des tentatives (TS)
  {
    id: 'q4_violent_attempts',
    text: '1. Existe-t-il des TS violentes (arme a feu, immolation, noyade, saut, pendaison, autre) ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui', score: 1 },
      { code: 'non', label: 'Non', score: 0 },
      { code: 'ne_sais_pas', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q4_1_violent_count',
    text: 'Nombre de tentatives de suicide violentes',
    type: 'number',
    required: false,
    min: 0,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q4_violent_attempts' }, 'oui'] }
  },
  {
    id: 'q5_serious_attempts',
    text: '2. Existe-t-il des tentatives de suicide graves (passage en reanimation) non violentes (medicamenteuses, phlebotomie) ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'oui', label: 'Oui', score: 1 },
      { code: 'non', label: 'Non', score: 0 },
      { code: 'ne_sais_pas', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q5_1_serious_count',
    text: 'Nombre de tentatives de suicide graves',
    type: 'number',
    required: false,
    min: 0,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q5_serious_attempts' }, 'oui'] }
  }
];

export const SUICIDE_HISTORY_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'suicide_history_sz',
  code: 'SUICIDE_HISTORY_SZ',
  title: 'Histoire des conduites suicidaires',
  description: 'Evaluation de l\'historique des tentatives de suicide: date de premiere tentative, nombre total, nombre dans les 12 derniers mois, et types de tentatives (violentes ou graves).',
  questions: SUICIDE_HISTORY_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// ANTECEDENTS FAMILIAUX PSYCHIATRIQUES - Schizophrenia
// Evaluation des antecedents psychiatriques familiaux
// ============================================================================

// Helper options for count fields
const COUNT_OPTIONS_FEMALE: QuestionOption[] = [
  { code: '0', label: 'Aucune' },
  { code: '1', label: '1' },
  { code: '2', label: '2' },
  { code: '3', label: '3' },
  { code: '4', label: '4' },
  { code: '5', label: '5' },
  { code: '>5', label: '>5' }
];

const COUNT_OPTIONS_MALE: QuestionOption[] = [
  { code: '0', label: 'Aucun' },
  { code: '1', label: '1' },
  { code: '2', label: '2' },
  { code: '3', label: '3' },
  { code: '4', label: '4' },
  { code: '5', label: '5' },
  { code: '>5', label: '>5' }
];

// Affected count options - same as parent count options
const AFFECTED_COUNT_OPTIONS_FEMALE: QuestionOption[] = [
  { code: '0', label: 'Aucune' },
  { code: '1', label: '1' },
  { code: '2', label: '2' },
  { code: '3', label: '3' },
  { code: '4', label: '4' },
  { code: '5', label: '5' },
  { code: '>5', label: '>5' }
];

const AFFECTED_COUNT_OPTIONS_MALE: QuestionOption[] = [
  { code: '0', label: 'Aucun' },
  { code: '1', label: '1' },
  { code: '2', label: '2' },
  { code: '3', label: '3' },
  { code: '4', label: '4' },
  { code: '5', label: '5' },
  { code: '>5', label: '>5' }
];

const YES_NO_MAYBE_OPTIONS: QuestionOption[] = [
  { code: 'oui', label: 'Oui' },
  { code: 'non', label: 'Non' },
  { code: 'ne_sais_pas', label: 'Ne sais pas' }
];

const YES_NO_OPTIONS: QuestionOption[] = [
  { code: 'oui', label: 'Oui' },
  { code: 'non', label: 'Non' }
];

const TROUBLE_PSY_OPTIONS: QuestionOption[] = [
  { code: 'aucun', label: 'Aucun' },
  { code: 'edm_unipolaire', label: 'EDM ou Unipolaire' },
  { code: 'bipolaire', label: 'Bipolaire' },
  { code: 'schizophrene', label: 'Schizophrene' },
  { code: 'ne_sais_pas', label: 'Ne sais pas' }
];

const SUICIDE_OPTIONS: QuestionOption[] = [
  { code: 'aucun', label: 'Aucun' },
  { code: 'tentative', label: 'Tentative de suicide' },
  { code: 'abouti', label: 'Suicide abouti' },
  { code: 'ne_sais_pas', label: 'Ne sais pas' }
];

// Helper to check if count is >= 1 (i.e., not '0')
// Uses 'answers.' prefix as required by the questionnaire renderer's JSONLogic evaluation
// Note: The questionnaire renderer converts numeric string codes to numbers,
// so '1' becomes 1, '2' becomes 2, etc. Only '>5' stays as string since it can't be parsed as number.
const hasAtLeastOne = (fieldId: string) => ({
  'in': [{ 'var': `answers.${fieldId}` }, [1, 2, 3, 4, 5, '>5']]
});

// Helper to check if affected count meets threshold (includes '>5' which counts as more than 5)
// Uses 'answers.' prefix as required by the questionnaire renderer's JSONLogic evaluation
// Note: The questionnaire renderer converts numeric string codes to numbers,
// so '1' becomes 1, '2' becomes 2, etc. Only '>5' stays as string since it can't be parsed as number.
const hasAffectedCount = (fieldId: string, minCount: number) => {
  // For minCount 1-4, include all values from that point to 5 plus '>5'
  // For minCount 5, include '5' and '>5'
  // Use numbers for 1-5, string for '>5'
  const allCounts: (number | string)[] = [1, 2, 3, 4, 5, '>5'];
  const validCounts = allCounts.slice(minCount - 1);
  return { 'in': [{ 'var': `answers.${fieldId}` }, validCounts] };
};

export const ANTECEDENTS_FAMILIAUX_PSY_SZ_QUESTIONS: Question[] = [
  // ============================================================================
  // SECTION: ANTECEDENTS FAMILIAUX - STRUCTURE
  // ============================================================================
  
  // --- ENFANTS ---
  {
    id: 'titre_structure_enfant',
    text: 'Enfants',
    type: 'section',
    required: false,
    is_label: true
  },
  {
    id: 'rad_structure_fille',
    text: 'Nombre de filles',
    type: 'single_choice',
    required: false,
    options: COUNT_OPTIONS_FEMALE
  },
  {
    id: 'rad_structure_fille_atteint',
    text: 'Parmi elles, veuillez indiquer combien presentent un trouble psychiatrique, un abus ou une dependance a une substance, un antecedent de tentative de suicide ou un facteur de risque cardio-vasculaire',
    type: 'single_choice',
    required: false,
    options: AFFECTED_COUNT_OPTIONS_FEMALE,
    indentLevel: 1,
    display_if: hasAtLeastOne('rad_structure_fille')
  },
  {
    id: 'rad_structure_fils',
    text: 'Nombre de fils',
    type: 'single_choice',
    required: false,
    options: COUNT_OPTIONS_MALE
  },
  {
    id: 'rad_structure_fils_atteint',
    text: 'Parmi eux, veuillez indiquer combien presentent un trouble psychiatrique, un abus ou une dependance a une substance, un antecedent de tentative de suicide ou un facteur de risque cardio-vasculaire',
    type: 'single_choice',
    required: false,
    options: AFFECTED_COUNT_OPTIONS_MALE,
    indentLevel: 1,
    display_if: hasAtLeastOne('rad_structure_fils')
  },
  
  // --- FRATRIE ---
  {
    id: 'titre_structure_fratrie',
    text: 'Fratrie',
    type: 'section',
    required: false,
    is_label: true
  },
  {
    id: 'rad_structure_soeur',
    text: 'Nombre de soeurs',
    type: 'single_choice',
    required: false,
    options: COUNT_OPTIONS_FEMALE
  },
  {
    id: 'rad_structure_soeur_atteint',
    text: 'Parmi elles, veuillez indiquer combien presentent un trouble psychiatrique, un abus ou une dependance a une substance, un antecedent de tentative de suicide ou un facteur de risque cardio-vasculaire',
    type: 'single_choice',
    required: false,
    options: AFFECTED_COUNT_OPTIONS_FEMALE,
    indentLevel: 1,
    display_if: hasAtLeastOne('rad_structure_soeur')
  },
  {
    id: 'rad_structure_frere',
    text: 'Nombre de freres',
    type: 'single_choice',
    required: false,
    options: COUNT_OPTIONS_MALE
  },
  {
    id: 'rad_structure_frere_atteint',
    text: 'Parmi eux, veuillez indiquer combien presentent un trouble psychiatrique, un abus ou une dependance a une substance, un antecedent de tentative de suicide ou un facteur de risque cardio-vasculaire',
    type: 'single_choice',
    required: false,
    options: AFFECTED_COUNT_OPTIONS_MALE,
    indentLevel: 1,
    display_if: hasAtLeastOne('rad_structure_frere')
  },
  
  // --- PARENTS STRUCTURE ---
  {
    id: 'titre_parents',
    text: 'Parents',
    type: 'section',
    required: false,
    is_label: true
  },
    // --- CONSIGNE ---
    {
      id: 'titre_consigne',
      text: 'Pour chaque membre de votre famille ci-dessous, veuillez indiquer s\'il presente un trouble psychiatrique, un abus ou une dependance a une substance, un antecedent de tentative de suicide ou un facteur de risque cardio-vasculaire. Puis saisir les caracteristiques du trouble dans l\'onglet qui lui correspond',
      type: 'instruction',
      required: false
    },
  {
    id: 'rad_structure_mere',
    text: 'Mere',
    type: 'single_choice',
    required: false,
    options: YES_NO_MAYBE_OPTIONS
  },
  {
    id: 'rad_atcdfampsy_mere_deces',
    text: 'Deces',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    indentLevel: 1
  },
  {
    id: 'rad_structure_pere',
    text: 'Pere',
    type: 'single_choice',
    required: false,
    options: YES_NO_MAYBE_OPTIONS
  },
  {
    id: 'rad_atcdfampsy_pere_deces',
    text: 'Deces',
    type: 'single_choice',
    required: false,
    options: YES_NO_OPTIONS,
    indentLevel: 1
  },
  
  // ============================================================================
  // SECTION: FRATRIE DETAILS - SOEURS (Conditional)
  // ============================================================================
  
  // --- SOEUR 1 ---
  {
    id: 'titre_soeur1',
    text: 'Antecedents de la soeur 1',
    type: 'section',
    required: false,
    is_label: true,
    display_if: hasAffectedCount('rad_structure_soeur_atteint', 1)
  },
  {
    id: 'rad_soeur1_trouble',
    text: 'Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: TROUBLE_PSY_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_soeur_atteint', 1)
  },
  {
    id: 'rad_soeur1_suicide',
    text: 'Suicide',
    type: 'single_choice',
    required: false,
    options: SUICIDE_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_soeur_atteint', 1)
  },
  
  // --- SOEUR 2 ---
  {
    id: 'titre_soeur2',
    text: 'Antecedents de la soeur 2',
    type: 'section',
    required: false,
    is_label: true,
    display_if: hasAffectedCount('rad_structure_soeur_atteint', 2)
  },
  {
    id: 'rad_soeur2_trouble',
    text: 'Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: TROUBLE_PSY_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_soeur_atteint', 2)
  },
  {
    id: 'rad_soeur2_suicide',
    text: 'Suicide',
    type: 'single_choice',
    required: false,
    options: SUICIDE_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_soeur_atteint', 2)
  },
  
  // --- SOEUR 3 ---
  {
    id: 'titre_soeur3',
    text: 'Antecedents de la soeur 3',
    type: 'section',
    required: false,
    is_label: true,
    display_if: hasAffectedCount('rad_structure_soeur_atteint', 3)
  },
  {
    id: 'rad_soeur3_trouble',
    text: 'Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: TROUBLE_PSY_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_soeur_atteint', 3)
  },
  {
    id: 'rad_soeur3_suicide',
    text: 'Suicide',
    type: 'single_choice',
    required: false,
    options: SUICIDE_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_soeur_atteint', 3)
  },
  
  // --- SOEUR 4 ---
  {
    id: 'titre_soeur4',
    text: 'Antecedents de la soeur 4',
    type: 'section',
    required: false,
    is_label: true,
    display_if: hasAffectedCount('rad_structure_soeur_atteint', 4)
  },
  {
    id: 'rad_soeur4_trouble',
    text: 'Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: TROUBLE_PSY_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_soeur_atteint', 4)
  },
  {
    id: 'rad_soeur4_suicide',
    text: 'Suicide',
    type: 'single_choice',
    required: false,
    options: SUICIDE_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_soeur_atteint', 4)
  },
  
  // --- SOEUR 5 ---
  {
    id: 'titre_soeur5',
    text: 'Antecedents de la soeur 5',
    type: 'section',
    required: false,
    is_label: true,
    display_if: hasAffectedCount('rad_structure_soeur_atteint', 5)
  },
  {
    id: 'rad_soeur5_trouble',
    text: 'Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: TROUBLE_PSY_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_soeur_atteint', 5)
  },
  {
    id: 'rad_soeur5_suicide',
    text: 'Suicide',
    type: 'single_choice',
    required: false,
    options: SUICIDE_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_soeur_atteint', 5)
  },
  
  // ============================================================================
  // SECTION: FRATRIE DETAILS - FRERES (Conditional)
  // ============================================================================
  
  // --- FRERE 1 ---
  {
    id: 'titre_frere1',
    text: 'Antecedents du frere 1',
    type: 'section',
    required: false,
    is_label: true,
    display_if: hasAffectedCount('rad_structure_frere_atteint', 1)
  },
  {
    id: 'rad_frere1_trouble',
    text: 'Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: TROUBLE_PSY_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_frere_atteint', 1)
  },
  {
    id: 'rad_frere1_suicide',
    text: 'Suicide',
    type: 'single_choice',
    required: false,
    options: SUICIDE_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_frere_atteint', 1)
  },
  
  // --- FRERE 2 ---
  {
    id: 'titre_frere2',
    text: 'Antecedents du frere 2',
    type: 'section',
    required: false,
    is_label: true,
    display_if: hasAffectedCount('rad_structure_frere_atteint', 2)
  },
  {
    id: 'rad_frere2_trouble',
    text: 'Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: TROUBLE_PSY_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_frere_atteint', 2)
  },
  {
    id: 'rad_frere2_suicide',
    text: 'Suicide',
    type: 'single_choice',
    required: false,
    options: SUICIDE_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_frere_atteint', 2)
  },
  
  // --- FRERE 3 ---
  {
    id: 'titre_frere3',
    text: 'Antecedents du frere 3',
    type: 'section',
    required: false,
    is_label: true,
    display_if: hasAffectedCount('rad_structure_frere_atteint', 3)
  },
  {
    id: 'rad_frere3_trouble',
    text: 'Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: TROUBLE_PSY_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_frere_atteint', 3)
  },
  {
    id: 'rad_frere3_suicide',
    text: 'Suicide',
    type: 'single_choice',
    required: false,
    options: SUICIDE_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_frere_atteint', 3)
  },
  
  // --- FRERE 4 ---
  {
    id: 'titre_frere4',
    text: 'Antecedents du frere 4',
    type: 'section',
    required: false,
    is_label: true,
    display_if: hasAffectedCount('rad_structure_frere_atteint', 4)
  },
  {
    id: 'rad_frere4_trouble',
    text: 'Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: TROUBLE_PSY_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_frere_atteint', 4)
  },
  {
    id: 'rad_frere4_suicide',
    text: 'Suicide',
    type: 'single_choice',
    required: false,
    options: SUICIDE_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_frere_atteint', 4)
  },
  
  // --- FRERE 5 ---
  {
    id: 'titre_frere5',
    text: 'Antecedents du frere 5',
    type: 'section',
    required: false,
    is_label: true,
    display_if: hasAffectedCount('rad_structure_frere_atteint', 5)
  },
  {
    id: 'rad_frere5_trouble',
    text: 'Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: TROUBLE_PSY_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_frere_atteint', 5)
  },
  {
    id: 'rad_frere5_suicide',
    text: 'Suicide',
    type: 'single_choice',
    required: false,
    options: SUICIDE_OPTIONS,
    indentLevel: 1,
    display_if: hasAffectedCount('rad_structure_frere_atteint', 5)
  },
  
  // ============================================================================
  // SECTION: PARENTS DETAILS (Conditional)
  // ============================================================================
  
  // --- MERE ---
  {
    id: 'titre_mere',
    text: 'Antecedents maternels',
    type: 'section',
    required: false,
    is_label: true,
    display_if: { '==': [{ 'var': 'answers.rad_structure_mere' }, 'oui'] }
  },
  {
    id: 'rad_mere_trouble',
    text: 'Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: TROUBLE_PSY_OPTIONS,
    indentLevel: 1,
    display_if: { '==': [{ 'var': 'answers.rad_structure_mere' }, 'oui'] }
  },
  {
    id: 'rad_mere_suicide',
    text: 'Suicide',
    type: 'single_choice',
    required: false,
    options: SUICIDE_OPTIONS,
    indentLevel: 1,
    display_if: { '==': [{ 'var': 'answers.rad_structure_mere' }, 'oui'] }
  },
  
  // --- PERE ---
  {
    id: 'titre_pere',
    text: 'Antecedents paternels',
    type: 'section',
    required: false,
    is_label: true,
    display_if: { '==': [{ 'var': 'answers.rad_structure_pere' }, 'oui'] }
  },
  {
    id: 'rad_pere_trouble',
    text: 'Troubles psychiatriques',
    type: 'single_choice',
    required: false,
    options: TROUBLE_PSY_OPTIONS,
    indentLevel: 1,
    display_if: { '==': [{ 'var': 'answers.rad_structure_pere' }, 'oui'] }
  },
  {
    id: 'rad_pere_suicide',
    text: 'Suicide',
    type: 'single_choice',
    required: false,
    options: SUICIDE_OPTIONS,
    indentLevel: 1,
    display_if: { '==': [{ 'var': 'answers.rad_structure_pere' }, 'oui'] }
  }
];

export const ANTECEDENTS_FAMILIAUX_PSY_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'antecedents_familiaux_psy_sz',
  code: 'ANTECEDENTS_FAMILIAUX_PSY_SZ',
  title: 'Antecedents familiaux psychiatriques',
  description: 'Ce questionnaire recueille les antecedents psychiatriques familiaux du patient, incluant les troubles psychiatriques et les tentatives de suicide pour les parents, la fratrie et les enfants.',
  instructions: 'Remplir les informations sur la structure familiale puis detailler les antecedents pour les membres concernes.',
  questions: ANTECEDENTS_FAMILIAUX_PSY_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: '1.0',
    language: 'fr-FR'
  }
};

// ============================================================================
// PERINATALITE (Perinatal History) - Schizophrenia specific
// ============================================================================

export const SZ_PERINATALITE_QUESTIONS: Question[] = [
  {
    id: 'q1_mother_age',
    text: 'Age de la mere a la naissance (en annees)',
    type: 'number',
    required: false,
    min: 10,
    max: 60
  },
  {
    id: 'q2_father_age',
    text: 'Age du pere a la naissance (en annees)',
    type: 'number',
    required: false,
    min: 10,
    max: 80
  },
  {
    id: 'q3_birth_condition',
    text: 'Naissance',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'premature', label: 'Prematurite', score: 0 },
      { code: 'term', label: 'Ne a terme', score: 0 },
      { code: 'post_mature', label: 'Post-maturite', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q4_gestational_age',
    text: 'L\'age gestationnel (en semaines d\'amenorrhee et revolues)',
    type: 'number',
    required: false,
    min: 22,
    max: 45
  },
  {
    id: 'q5_birth_type',
    text: 'Type de naissance',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'vaginal', label: 'Voie basse', score: 0 },
      { code: 'cesarean', label: 'Cesarienne', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q6_birth_weight',
    text: 'Poids de naissance (en grammes)',
    type: 'number',
    required: false,
    min: 300,
    max: 6000
  },
  {
    id: 'q7_neonatal_hospitalization',
    text: 'Hospitalisation en neonatologie',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui', score: 1 },
      { code: 'no', label: 'Non', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q8_birth_environment',
    text: 'Etes-vous ne dans un milieu',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'urbain', label: 'Urbain', score: 0 },
      { code: 'rural', label: 'Rural', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q9_obstetric_complications',
    text: 'Y a-t-il eu des complications obstetricales a votre naissance',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui', score: 1 },
      { code: 'no', label: 'Non', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q10_maternal_viral_infection',
    text: 'Votre mere a-t-elle eu une infection virale pendant sa grossesse',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui', score: 1 },
      { code: 'no', label: 'Non', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q11_maternal_pregnancy_events',
    text: 'Votre mere a-t-elle vecu un ou plusieurs de ces evenements au cours de sa grossesse ?',
    type: 'multiple_choice',
    required: false,
    options: [
      { code: 'deces_proche', label: 'Deces d\'un proche', score: 1 },
      { code: 'perte_travail', label: 'Perte du travail', score: 1 },
      { code: 'perte_travail_conjoint', label: 'Perte de travail du conjoint', score: 1 },
      { code: 'separation_divorce', label: 'Separation/divorce', score: 1 },
      { code: 'probleme_couple', label: 'Probleme de couple', score: 1 },
      { code: 'difficultes_enfants', label: 'Difficultes avec ses enfants', score: 1 },
      { code: 'probleme_argent', label: 'Probleme d\'argent', score: 1 },
      { code: 'probleme_grossesse', label: 'Probleme lie a la grossesse', score: 1 },
      { code: 'demenagement', label: 'Demenagement', score: 1 },
      { code: 'aucun', label: 'Aucun', score: 0 }
    ]
  }
];

export const SZ_PERINATALITE_DEFINITION: QuestionnaireDefinition = {
  id: 'perinatalite_sz',
  code: 'PERINATALITE_SZ',
  title: 'Perinatalite',
  description: 'Recueil des informations perinatales et des conditions de naissance du patient.',
  questions: SZ_PERINATALITE_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: '1.0',
    language: 'fr-FR'
  }
};

// ============================================================================
// TEA AND COFFEE CONSUMPTION QUESTIONNAIRE - Schizophrenia Addictologie
// ============================================================================
// Assessment of tea and coffee consumption patterns
// - Lifetime maximum consumption periods
// - Last 12 months consumption
// Includes branching logic for frequency specification

export const TEA_COFFEE_SZ_FREQUENCY_OPTIONS: QuestionOption[] = [
  { code: '1_to_7', label: '1 a 7 fois par semaine' },
  { code: 'less_than_once', label: 'Moins d\'une fois par semaine' }
];

export const TEA_COFFEE_SZ_FREQUENCY_DETAIL_OPTIONS: QuestionOption[] = [
  { code: 1, label: '1 fois' },
  { code: 2, label: '2 fois' },
  { code: 3, label: '3 fois' },
  { code: 4, label: '4 fois' },
  { code: 5, label: '5 fois' },
  { code: 6, label: '6 fois' },
  { code: 7, label: '7 fois' }
];

export const TEA_COFFEE_SZ_QUESTIONS: Question[] = [
  // ==================== TEA SECTION ====================
  {
    id: 'section_tea',
    text: 'The',
    type: 'section',
    required: false
  },
  {
    id: 'tea_5a',
    text: 'Quantite consommees (en tasses/jour) par jour de consommation de the en moyenne, DURANT LES PERIODES DE CONSOMMATION MAXIMALE AU COURS DE LA VIE',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },
  {
    id: 'tea_5b',
    text: 'Frequence des consommations DURANT LES PERIODES DE CONSOMMATION MAXIMALES AU COURS DE LA VIE',
    type: 'single_choice',
    required: false,
    options: TEA_COFFEE_SZ_FREQUENCY_OPTIONS
  },
  {
    id: 'tea_5b1',
    text: 'Precisez le nombre de fois',
    type: 'single_choice',
    required: false,
    options: TEA_COFFEE_SZ_FREQUENCY_DETAIL_OPTIONS,
    display_if: { '==': [{ 'var': 'tea_5b' }, '1_to_7'] },
    indentLevel: 1
  },
  {
    id: 'tea_6a',
    text: 'Quantite de the (en tasses) consommees par jour de consommation en moyenne AU COURS DES 12 DERNIERS MOIS',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },
  {
    id: 'tea_6b',
    text: 'Frequence des consommations hebdomadaire AU COURS DES 12 DERNIERS MOIS',
    type: 'single_choice',
    required: false,
    options: TEA_COFFEE_SZ_FREQUENCY_OPTIONS
  },
  {
    id: 'tea_6b1',
    text: 'Precisez le nombre de fois',
    type: 'single_choice',
    required: false,
    options: TEA_COFFEE_SZ_FREQUENCY_DETAIL_OPTIONS,
    display_if: { '==': [{ 'var': 'tea_6b' }, '1_to_7'] },
    indentLevel: 1
  },

  // ==================== COFFEE SECTION ====================
  {
    id: 'section_coffee',
    text: 'Cafe',
    type: 'section',
    required: false
  },
  {
    id: 'coffee_5a',
    text: 'Quantite consommees (en tasses) par jour de consommation de cafe en moyenne, DURANT LES PERIODES DE CONSOMMATION MAXIMALE AU COURS DE LA VIE',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },
  {
    id: 'coffee_5b',
    text: 'Frequence des consommations DURANT LES PERIODES DE CONSOMMATION MAXIMALES AU COURS DE LA VIE',
    type: 'single_choice',
    required: false,
    options: TEA_COFFEE_SZ_FREQUENCY_OPTIONS
  },
  {
    id: 'coffee_5b1',
    text: 'Precisez le nombre de fois',
    type: 'single_choice',
    required: false,
    options: TEA_COFFEE_SZ_FREQUENCY_DETAIL_OPTIONS,
    display_if: { '==': [{ 'var': 'coffee_5b' }, '1_to_7'] },
    indentLevel: 1
  },
  {
    id: 'coffee_6a',
    text: 'Quantite de cafe (en tasses) consommees par jour de consommation en moyenne AU COURS DES 12 DERNIERS MOIS',
    type: 'number',
    required: false,
    min: 0,
    max: 100
  },
  {
    id: 'coffee_6b',
    text: 'Frequence des consommations AU COURS DES 12 DERNIERS MOIS',
    type: 'single_choice',
    required: false,
    options: TEA_COFFEE_SZ_FREQUENCY_OPTIONS
  },
  {
    id: 'coffee_6b1',
    text: 'Precisez le nombre de fois',
    type: 'single_choice',
    required: false,
    options: TEA_COFFEE_SZ_FREQUENCY_DETAIL_OPTIONS,
    display_if: { '==': [{ 'var': 'coffee_6b' }, '1_to_7'] },
    indentLevel: 1
  }
];

export const TEA_COFFEE_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'tea_coffee_sz',
  code: 'TEA_COFFEE_SZ',
  title: 'Consommation de The et Cafe',
  description: 'Evaluation de la consommation de the et cafe du patient, incluant les periodes de consommation maximale au cours de la vie et les 12 derniers mois.',
  questions: TEA_COFFEE_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: '1.0',
    language: 'fr-FR'
  }
};

// ============================================================================
// EVALUATION ADDICTOLOGIQUE - Schizophrenia Addictologie Assessment
// ============================================================================
// Comprehensive addictological evaluation questionnaire including:
// - Main screening (alcohol, tobacco, cannabis, other drugs, gambling)
// - Conditional Alcohol section with DSM5 criteria and severity scoring
// - History, family history, craving, treatment, and hospitalization data

// Options for DSM5 criteria questions (Oui/Non/Ne sais pas)
const DSM5_CRITERIA_OPTIONS: QuestionOption[] = [
  { code: 'Oui', label: 'Oui' },
  { code: 'Non', label: 'Non' },
  { code: 'Ne sais pas', label: 'Ne sais pas' }
];

// Options for frequency (lifetime and 12 months)
const FREQUENCY_OPTIONS: QuestionOption[] = [
  { code: '1_to_7', label: '1 a 7 fois par semaine' },
  { code: 'less_than_once', label: 'Moins d\'une fois par semaine' }
];

// Options for frequency detail (1-7 times per week)
const FREQUENCY_DETAIL_OPTIONS: QuestionOption[] = [
  { code: 1, label: '1' },
  { code: 2, label: '2' },
  { code: 3, label: '3' },
  { code: 4, label: '4' },
  { code: 5, label: '5' },
  { code: 6, label: '6' },
  { code: 7, label: '7' }
];

// Options for craving score (0-10)
const CRAVING_OPTIONS: QuestionOption[] = [
  { code: '0 Jamais', label: '0 Jamais' },
  { code: '1', label: '1' },
  { code: '2', label: '2' },
  { code: '3', label: '3' },
  { code: '4', label: '4' },
  { code: '5', label: '5' },
  { code: '6', label: '6' },
  { code: '7', label: '7' },
  { code: '8', label: '8' },
  { code: '9', label: '9' },
  { code: '10 Tout le temps', label: '10 Tout le temps' }
];

export const EVAL_ADDICTOLOGIQUE_SZ_QUESTIONS: Question[] = [
  // ==================== SCREENING SECTION ====================
  {
    id: 'section_screening',
    text: 'Evaluation addictologique',
    type: 'section',
    required: false
  },
  // Q1: Alcohol screening
  {
    id: 'rad_add_alc1',
    text: '1. Avez-vous deja consomme de l\'alcool, quel que soit le type d\'alcool, plus de dix fois dans votre vie ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  // Q1.2: Primary abstinent (shows if Q1 = 'Non')
  {
    id: 'rad_add_alc1a',
    text: 'Abstinent primaire ? (aucune consommation d\'alcool vie entiere ?)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Non'] },
    indentLevel: 1
  },
  // Q2: Tobacco status
  {
    id: 'rad_add_tab',
    text: '2. Statut tabagique declare par le patient (cochez fumeur actuel si consommation quotidienne de tabac actuel)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Non fumeur', label: 'Non fumeur' },
      { code: 'Fumeur actuel', label: 'Fumeur actuel' },
      { code: 'Ex-fumeur', label: 'Ex-fumeur' },
      { code: 'Statut inconnu', label: 'Statut inconnu' }
    ]
  },
  // Q3: Cannabis screening
  {
    id: 'rad_add_cannabis',
    text: '3. Avez-vous deja consomme du cannabis ou du haschisch, des joints, de la marijuana ou de l\'herbe plus de dix fois dans votre vie ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },

  // ==================== CANNABIS - ABSTINENT (if Q3 = Non) ====================
  {
    id: 'rad_add_cannabis_abstinent',
    text: '3a. Abstinent primaire ? (pas une seule consommation de cannabis vie entiere ?)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_cannabis' }, 'Non'] },
    indentLevel: 1
  },

  // ==================== CANNABIS - CONSUMPTION SECTION (if Q3 = Oui) ====================
  {
    id: 'section_cannabis',
    text: 'Cannabis - Consommation',
    type: 'section',
    required: false,
    display_if: { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] }
  },
  // Quantity (joints/day) during max consumption periods - lifetime
  {
    id: 'rad_add_can_qty_vie',
    text: '3a. Quantites (en joints) par jour de consommation en moyenne de cannabis DURANT LES PERIODES DE CONSOMMATION MAXIMALE AU COURS DE LA VIE',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] }
  },
  // Frequency during max consumption periods - lifetime
  {
    id: 'rad_add_can_freq_vie',
    text: '3b. Frequence des consommations DURANT LES PERIODES DE CONSOMMATION MAXIMALE AU COURS DE LA VIE',
    type: 'single_choice',
    required: false,
    options: [
      { code: '1_to_7', label: '1 a 7 fois par semaine' },
      { code: 'less_than_once', label: 'Moins d\'une fois par semaine' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] }
  },
  // Specify times per week (1-7) for lifetime frequency
  {
    id: 'rad_add_can_freq_vie_spec',
    text: '3b1. Precisez le nombre de fois par semaine',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '1' },
      { code: 2, label: '2' },
      { code: 3, label: '3' },
      { code: 4, label: '4' },
      { code: 5, label: '5' },
      { code: 6, label: '6' },
      { code: 7, label: '7' }
    ],
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_can_freq_vie' }, '1_to_7'] }
      ]
    },
    indentLevel: 1
  },
  {
    id: 'rad_add_can_qty_12m',
    text: '3c. Quantite (en joints) par jour de consommation en moyenne de cannabis AU COURS DES 12 DERNIERS MOIS',
    type: 'number',
    required: false,
    min: 0,
    display_if: { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] }
  },
  // Frequency - 12 months
  {
    id: 'rad_add_can_freq_12m',
    text: '3d. Frequence des consommations AU COURS DES 12 DERNIERS MOIS',
    type: 'single_choice',
    required: false,
    options: [
      { code: '1_to_7', label: '1 a 7 fois par semaine' },
      { code: 'less_than_once', label: 'Moins d\'une fois par semaine' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] }
  },
  // Specify times per week (1-7) for 12 months frequency
  {
    id: 'rad_add_can_freq_12m_spec',
    text: '3d1. Precisez le nombre de fois par semaine',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: '1' },
      { code: 2, label: '2' },
      { code: 3, label: '3' },
      { code: 4, label: '4' },
      { code: 5, label: '5' },
      { code: 6, label: '6' },
      { code: 7, label: '7' }
    ],
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_can_freq_12m' }, '1_to_7'] }
      ]
    },
    indentLevel: 1
  },
  // Quantity (joints/day) - 12 months


  // ==================== CANNABIS - DSM5 SCREENING ====================
  {
    id: 'rad_add_can_dsm5_screen',
    text: '3e. Le patient a-t-il présenté un symptôme de trouble lié à l\'usage de cannabis au cours de sa vie ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] }
  },

  // ==================== CANNABIS - DSM5 CRITERIA ====================
  // Note: If rad_add_can_dsm5_screen = 'Non', all criteria should be auto-populated with 'Non'
  // Criterion a
  {
    id: 'rad_add_can_dsm5_a',
    text: '3f. A deja pris le produit en quantite superieures a celles prevues',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] }
      ]
    }
  },
  {
    id: 'rad_add_can_dsm5_a_12m',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] },
        { '==': [{ 'var': 'rad_add_can_dsm5_a' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },
  // Criterion b
  {
    id: 'rad_add_can_dsm5_b',
    text: '3g. A deja essaye de diminuer ou d\'arreter',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] }
      ]
    }
  },
  {
    id: 'rad_add_can_dsm5_b_12m',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] },
        { '==': [{ 'var': 'rad_add_can_dsm5_b' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },
  // Criterion c
  {
    id: 'rad_add_can_dsm5_c',
    text: '3h. Passe du temps a chercher, consommer ou se remettre des effets',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] }
      ]
    }
  },
  {
    id: 'rad_add_can_dsm5_c_12m',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] },
        { '==': [{ 'var': 'rad_add_can_dsm5_c' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },
  // Criterion d
  {
    id: 'rad_add_can_dsm5_d',
    text: '3i. Cravings ou besoins imperieux de consommer',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] }
      ]
    }
  },
  {
    id: 'rad_add_can_dsm5_d_12m',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] },
        { '==': [{ 'var': 'rad_add_can_dsm5_d' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },
  // Criterion e
  {
    id: 'rad_add_can_dsm5_e',
    text: '3j. Incapacité à remplir les obligations majeures au travail, à la maison ou à l\'école à cause de la consommation',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] }
      ]
    }
  },
  {
    id: 'rad_add_can_dsm5_e_12m',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] },
        { '==': [{ 'var': 'rad_add_can_dsm5_e' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },
  // Criterion f
  {
    id: 'rad_add_can_dsm5_f',
    text: '3l. Persistance de la consommation en depit de consequences interpersonnelles (disputes, etc.)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] }
      ]
    }
  },
  {
    id: 'rad_add_can_dsm5_f_12m',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] },
        { '==': [{ 'var': 'rad_add_can_dsm5_f' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },
  // Criterion g
  {
    id: 'rad_add_can_dsm5_g',
    text: '3k. Abandon d\'activités sociales, professionnelles ou de loisir',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] }
      ]
    }
  },
  {
    id: 'rad_add_can_dsm5_g_12m',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] },
        { '==': [{ 'var': 'rad_add_can_dsm5_g' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },
  // Criterion h
  {
    id: 'rad_add_can_dsm5_h',
    text: '3l. Utilisation répétée quand cela peut être dangereux (conduite automobile?)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] }
      ]
    }
  },
  {
    id: 'rad_add_can_dsm5_h_12m',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] },
        { '==': [{ 'var': 'rad_add_can_dsm5_h' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },
  // Criterion i
  {
    id: 'rad_add_can_dsm5_i',
    text: '3m. Poursuite de l\'utilisation en dépit de problèmes psychologiques ou physiques causés par elle',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] }
      ]
    }
  },
  {
    id: 'rad_add_can_dsm5_i_12m',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] },
        { '==': [{ 'var': 'rad_add_can_dsm5_i' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },
  // Criterion j
  {
    id: 'rad_add_can_dsm5_j',
    text: '3n. Tolerance (augmentation des quantités ou diminution des effets à quantité égale)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] }
      ]
    }
  },
  {
    id: 'rad_add_can_dsm5_j_12m',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] },
        { '==': [{ 'var': 'rad_add_can_dsm5_j' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },
  // Criterion k
  {
    id: 'rad_add_can_dsm5_k',
    text: '3o. Symptômes de sevrage ou prise d\'un produit ou traitement pour éviter les symptômes de sevrage',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] }
      ]
    }
  },
  {
    id: 'rad_add_can_dsm5_k_12m',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] },
        { '==': [{ 'var': 'rad_add_can_dsm5_k' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },
  // Criterion l
  {
    id: 'rad_add_can_dsm5_l',
    text: '3p. Problèmes légaux liés à la consommation ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] }
      ]
    }
  },
  {
    id: 'rad_add_can_dsm5_l_12m',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_cannabis' }, 'Oui'] },
        { '!=': [{ 'var': 'rad_add_can_dsm5_screen' }, 'Non'] },
        { '==': [{ 'var': 'rad_add_can_dsm5_l' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },

  // ==================== OTHER ADDICTIONS SCREENING ====================
  // Q4: Other drugs screening
  {
    id: 'rad_add_drogues',
    text: '4. Avez-vous deja consomme des drogues illicites, ou des medicaments en dehors d\'une prescription par un medecin, comme des sedatifs, des benzodiazepines ou d\'autres medicaments, du crack, de la cocaine, des amphetamines, de l\'heroine, du subutex, de la methadone, des hallucinogenes ou d\'autres produits, plus de dix fois dans votre vie ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  // Q20: Gambling - lying
  {
    id: 'rad_add_jeux1',
    text: '5. Avez-vous déjà du mentir à des personnes proches concernant votre comportement relatif aux jeux d\'argent ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  // Q21: Gambling - bet more
  {
    id: 'rad_add_jeux2',
    text: '6. Avez-vous déjà ressenti le besoin de miser toujours plus d\'argent ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },

  // ==================== TOBACCO SECTION ====================
  // Conditional on rad_add_tab = 'Fumeur actuel' OR 'Ex-fumeur'
  {
    id: 'section_tabac',
    text: 'Tabac',
    type: 'section',
    required: false,
    display_if: {
      'or': [
        { '==': [{ 'var': 'rad_add_tab' }, 'Fumeur actuel'] },
        { '==': [{ 'var': 'rad_add_tab' }, 'Ex-fumeur'] }
      ]
    }
  },
  // 1. Number of pack-years
  {
    id: 'tab_paquets_annees',
    text: '1. Nombre de paquets-annees',
    type: 'number',
    required: false,
    min: 0,
    display_if: {
      'or': [
        { '==': [{ 'var': 'rad_add_tab' }, 'Fumeur actuel'] },
        { '==': [{ 'var': 'rad_add_tab' }, 'Ex-fumeur'] }
      ]
    }
  },
  // 2. Age of daily tobacco consumption start
  {
    id: 'tab_age_debut_quotidien',
    text: '2. Age de debut de la consommation quotidienne de tabac (en annees)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Ne sais pas', label: 'Ne sais pas' },
      { code: '<5', label: '<5' },
      ...Array.from({ length: 85 }, (_, i) => ({ code: String(i + 5), label: String(i + 5) })),
      { code: '>89', label: '>89' }
    ],
    display_if: {
      'or': [
        { '==': [{ 'var': 'rad_add_tab' }, 'Fumeur actuel'] },
        { '==': [{ 'var': 'rad_add_tab' }, 'Ex-fumeur'] }
      ]
    }
  },
  // 3. Cigarettes per day (average over last year)
  {
    id: 'tab_cigarettes_jour',
    text: '3. Quantite de cigarettes fumees par jour en moyenne au cours de l\'annee ecoulee',
    type: 'number',
    required: false,
    min: 0,
    display_if: {
      'or': [
        { '==': [{ 'var': 'rad_add_tab' }, 'Fumeur actuel'] },
        { '==': [{ 'var': 'rad_add_tab' }, 'Ex-fumeur'] }
      ]
    }
  },
  // 4. Age of first cigarette
  {
    id: 'tab_age_premiere_cigarette',
    text: '4. Age de la premiere cigarette (en annees)',
    type: 'number',
    required: false,
    min: 0,
    max: 120,
    display_if: {
      'or': [
        { '==': [{ 'var': 'rad_add_tab' }, 'Fumeur actuel'] },
        { '==': [{ 'var': 'rad_add_tab' }, 'Ex-fumeur'] }
      ]
    }
  },
  // 5. Maximum abstinence duration (months)
  {
    id: 'tab_abstinence_max_mois',
    text: '5. Duree maximale d\'abstinence sur la vie (en mois)',
    type: 'number',
    required: false,
    min: 0,
    display_if: {
      'or': [
        { '==': [{ 'var': 'rad_add_tab' }, 'Fumeur actuel'] },
        { '==': [{ 'var': 'rad_add_tab' }, 'Ex-fumeur'] }
      ]
    }
  },
  // 6. First-degree family history of tobacco use disorder
  {
    id: 'tab_antecedents_familiaux',
    text: '6. Antecedents de premier degre de trouble lie a l\'usage de tabac',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'or': [
        { '==': [{ 'var': 'rad_add_tab' }, 'Fumeur actuel'] },
        { '==': [{ 'var': 'rad_add_tab' }, 'Ex-fumeur'] }
      ]
    }
  },
  // 7. Craving score (0-10)
  {
    id: 'tab_craving_score',
    text: '7. Score de Craving (de 0 a 10): A combien evaluez-vous votre envie maximale de consommer du tabac sur la derniere semaine ?',
    type: 'single_choice',
    required: false,
    options: CRAVING_OPTIONS,
    display_if: {
      'or': [
        { '==': [{ 'var': 'rad_add_tab' }, 'Fumeur actuel'] },
        { '==': [{ 'var': 'rad_add_tab' }, 'Ex-fumeur'] }
      ]
    }
  },
  // 8. Lifetime medication treatment
  {
    id: 'tab_traitement_vie',
    text: '8. Notion de traitement medicamenteux pour le trouble lie a l\'usage du tabac au cours de la vie ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'or': [
        { '==': [{ 'var': 'rad_add_tab' }, 'Fumeur actuel'] },
        { '==': [{ 'var': 'rad_add_tab' }, 'Ex-fumeur'] }
      ]
    }
  },
  // 8a. Treatments used (conditional on tab_traitement_vie = 'Oui')
  {
    id: 'tab_traitements_utilises',
    text: '8a. Quel(s) traitement(s) avez-vous utilise ?',
    type: 'multiple_choice',
    required: false,
    options: [
      { code: 'patchs_nicotine', label: 'Patchs de nicotine' },
      { code: 'gommes_nicotine', label: 'Gommes de nicotine' },
      { code: 'pastilles_nicotine', label: 'Pastilles de nicotine' },
      { code: 'inhaleur_nicotine', label: 'Inhaleur de nicotine' },
      { code: 'spray_nicotine', label: 'Spray de nicotine' },
      { code: 'champix', label: 'Champix (Varenicline)' },
      { code: 'zyban', label: 'Zyban (Bupropion)' },
      { code: 'cigarette_electronique', label: 'Cigarette electronique' },
      { code: 'autre', label: 'Autre' }
    ],
    display_if: {
      'and': [
        {
          'or': [
            { '==': [{ 'var': 'rad_add_tab' }, 'Fumeur actuel'] },
            { '==': [{ 'var': 'rad_add_tab' }, 'Ex-fumeur'] }
          ]
        },
        { '==': [{ 'var': 'tab_traitement_vie' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },

  // ==================== ALCOHOL - CONSUMPTION SECTION ====================
  {
    id: 'section_alcohol_consumption',
    text: 'Alcool - Consommation',
    type: 'section',
    required: false,
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  // 5a. Quantity during max lifetime consumption
  {
    id: 'add_alc5a',
    text: '1a. Quantite en verres (unite standard = 10g) par jour de consommation, en moyenne durant les periodes de consommation maximales au cours de la vie',
    type: 'text',
    required: false,
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  // 5b. Frequency during max lifetime consumption
  {
    id: 'rad_add_alc5b',
    text: '1b. Frequence des consommations durant les periodes de consommation maximale au cours de la vie',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  // 5c. Specify times per week (shows if 5b = '1_to_7')
  {
    id: 'rad_add_alc5c',
    text: '1c. Precisez le nombre de fois par semaine',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_DETAIL_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_alc5b' }, '1_to_7'] }
      ]
    },
    indentLevel: 1
  },
  // 6a. Quantity during last 12 months
  {
    id: 'add_alc6a',
    text: '2a. Quantite (en verres, unite standard = 10g) par jour de consommation, en moyenne, au cours des 12 derniers mois',
    type: 'text',
    required: false,
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  // 6b. Frequency during last 12 months
  {
    id: 'rad_add_alc6b',
    text: '2b. Frequence des consommations au cours des 12 derniers mois',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  // 6c. Specify times per week (shows if 6b = '1_to_7')
  {
    id: 'rad_add_alc6c',
    text: '2c. Precisez le nombre de fois par semaine',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_DETAIL_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_alc6b' }, '1_to_7'] }
      ]
    },
    indentLevel: 1
  },
  // 7b. Heavy drinking frequency (>6 drinks per occasion) during max consumption
  {
    id: 'rad_add_alc7b',
    text: '3a. Frequence des consommations importantes (quantite d\'alcool superieure a 6 verres (unite standard = 10g) ingeres au cours d\'une meme occasion) DURANT LES PERIODES DE CONSOMMATION MAXIMALE AU COURS DE LA VIE',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  // 7c. Specify times per week (shows if 7b = '1_to_7')
  {
    id: 'rad_add_alc7c',
    text: '3b. Precisez le nombre de fois par semaine',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_DETAIL_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_alc7b' }, '1_to_7'] }
      ]
    },
    indentLevel: 1
  },

  // ==================== ALCOHOL - DSM5 CRITERIA ====================
  // 8a. DSM5 Screening - Has patient shown any symptom lifetime?
  {
    id: 'rad_add_alc8a',
    text: '4. Le patient a-t-il presente un symptome de trouble lie a l\'usage d\'alcool au cours de sa vie?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },

  // Criterion a: Taken in larger amounts
  {
    id: 'rad_add_alc8a1',
    text: '4a. A deja pris le produit en quantite superieures à celles prévues',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  {
    id: 'rad_add_alc8a2',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_alc8a1' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },

  // Criterion b: Tried to cut down or stop
  {
    id: 'rad_add_alc8b1',
    text: '4b. A deja essaye de diminuer ou d\'arrêter',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  {
    id: 'rad_add_alc8b2',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_alc8b1' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },

  // Criterion c: Time spent obtaining, using, recovering
  {
    id: 'rad_add_alc8c1',
    text: '4c. Passe du temps a chercher, consommer ou se remettre des effets',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  {
    id: 'rad_add_alc8c2',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_alc8c1' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },

  // Criterion d: Cravings or urges
  {
    id: 'rad_add_alc8d1',
    text: '4d. Cravings ou besoin impérieux de consommer',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  {
    id: 'rad_add_alc8d2',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_alc8d1' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },

  // Criterion e: Failure to fulfill obligations
  {
    id: 'rad_add_alc8e1',
    text: '4e. Incapacité à remplir les obligations majeures au travail, à la maison ou à l\'école à cause de la consommation',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  {
    id: 'rad_add_alc8e2',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_alc8e1' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },

  // Criterion f: Continued use despite social problems
  {
    id: 'rad_add_alc8f1',
    text: '4f. Persistance de la consommation en dépit de conséquences interpersonnelles (disputes, etc.)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  {
    id: 'rad_add_alc8f2',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_alc8f1' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },

  // Criterion g: Activities given up or reduced
  {
    id: 'rad_add_alc8g1',
    text: '4g. Abandon d\'activités sociales, professionnelles ou de loisir',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  {
    id: 'rad_add_alc8g2',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_alc8g1' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },

  // Criterion h: Recurrent use in hazardous situations
  {
    id: 'rad_add_alc8h1',
    text: '4h. Utilisation répétée quand cela peut être dangereux (conduite automobile?)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  {
    id: 'rad_add_alc8h2',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_alc8h1' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },

  // Criterion i: Continued use despite problems
  {
    id: 'rad_add_alc8i1',
    text: '4i. Poursuite de l\'utilisation en dépit de problèmes psychologiques ou physiques causés par elle',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  {
    id: 'rad_add_alc8i2',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_alc8i1' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },

  // Criterion j: Tolerance
  {
    id: 'rad_add_alc8j1',
    text: '4j. Tolerance (augmentation des quantités ou diminution des effets à quantité égale)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  {
    id: 'rad_add_alc8j2',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_alc8j1' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },

  // Criterion k: Withdrawal
  {
    id: 'rad_add_alc8k1',
    text: '4k. Symptomes de sevrage ou prise d\'un produit ou traitement pour éviter les symptomes de sevrage',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  {
    id: 'rad_add_alc8k2',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_alc8k1' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  },

  // Criterion l: Legal problems
  {
    id: 'rad_add_alc8l1',
    text: '4l. Problemes légaux liés à la consommation ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ],
    display_if: { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] }
  },
  {
    id: 'rad_add_alc8l2',
    text: 'Au cours des 12 derniers mois ?',
    type: 'single_choice',
    required: false,
    options: DSM5_CRITERIA_OPTIONS,
    display_if: {
      'and': [
        { '==': [{ 'var': 'rad_add_alc1' }, 'Oui'] },
        { '==': [{ 'var': 'rad_add_alc8l1' }, 'Oui'] }
      ]
    },
    indentLevel: 1
  }
];

export const EVAL_ADDICTOLOGIQUE_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'eval_addictologique_sz',
  code: 'EVAL_ADDICTOLOGIQUE_SZ',
  title: 'Evaluation addictologique',
  description: 'Evaluation addictologique complete incluant le depistage (alcool, tabac, cannabis, drogues, jeux) et une evaluation detaillee de l\'usage d\'alcool selon les criteres DSM5, avec calcul de la severite du trouble.',
  questions: EVAL_ADDICTOLOGIQUE_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: '1.0',
    language: 'fr-FR'
  }
};
