// eFondaMental Platform - Schizophrenia Bilan Biologique (INF_BILAN_BIOLOGIQUE_SZ)
// Biological assessment for schizophrenia initial evaluation

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaBilanBiologiqueResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  completed_by?: string | null;

  // Date Section
  collection_date?: string | null;

  // BIOCHIMIE
  rad_prelevement_lieu?: 'Sur site' | 'Hors site' | null;
  acide_urique?: number | null;
  crp?: number | null;
  glycemie?: number | null;
  rad_glycemie?: 'mmol_L' | 'g_L' | null;
  hb_gly?: number | null;
  vitd25oh?: number | null;

  // BILAN LIPIDIQUE
  chol_hdl?: number | null;
  rad_chol_hdl?: 'mmol/L' | 'g/L' | null;
  chol_ldl?: number | null;
  rad_chol_ldl?: 'mmol/L' | 'g/L' | null;
  chol_total?: number | null;
  chol_rapport_hdltot?: number | null;
  triglycerides?: number | null;

  // NFS (NUMERATION FORMULE SANGUINE)
  gb?: number | null;
  gr?: number | null;
  hb?: number | null;
  rad_hb?: 'g/dL' | 'mmol/L' | null;
  neutrophile?: number | null;
  eosinophile?: number | null;
  vgm?: number | null;
  plaquettes?: number | null;

  // DOSAGES HORMONAUX
  prolactine?: number | null;
  rad_prolacti?: 'mg/L' | 'mUI/L' | 'ng/ml' | null;

  // DOSAGE DES PSYCHOTROPES
  rad_trt_visite?: 'Oui' | 'Non' | null;
  rad_prisetraitement?: 'Oui' | 'Non' | null;
  rad_clozapine?: 'Oui' | 'Non' | null;
  clozapine?: number | null;

  // VITAMINE D
  radhtml_vitd_ext?: '1' | '2' | '3' | '4' | null;
  radhtml_vitd_cutane?: '1' | '2' | '3' | '4' | '5' | '6' | null;

  // SEROLOGIE TOXOPLASMOSE
  rad_toxo?: 'Oui' | 'Non' | null;
  rad_igm_statut?: 'Oui' | 'Non' | null;
  rad_igg_statut?: 'Oui' | 'Non' | null;
  toxo_igg?: number | null;

  // Timestamps
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaBilanBiologiqueResponseInsert = Omit<
  SchizophreniaBilanBiologiqueResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'chol_rapport_hdltot'
>;

// ============================================================================
// Questions
// ============================================================================

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

export const SZ_BILAN_BIOLOGIQUE_DEFINITION: QuestionnaireDefinition = {
  id: 'sz_bilan_biologique',
  code: 'BILAN_BIOLOGIQUE_SZ',
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
// Scoring / Computed Fields
// ============================================================================

/**
 * Compute cholesterol ratio (Total / HDL)
 */
export function computeCholesterolRatio(
  cholTotal?: number | null,
  cholHdl?: number | null
): number | null {
  if (!cholTotal || !cholHdl || cholHdl <= 0) return null;
  return Math.round((cholTotal / cholHdl) * 100) / 100;
}

/**
 * Interpret vitamin D level
 */
export function interpretVitaminD(level: number): string {
  if (level < 25) return 'Carence';
  if (level < 75) return 'Insuffisance';
  if (level <= 250) return 'Suffisance';
  return 'Toxicite';
}

/**
 * Interpret toxoplasmosis serology
 */
export function interpretToxoSerology(
  igmPositive: boolean,
  iggPositive: boolean
): string {
  if (!igmPositive && iggPositive) return 'Infection passee';
  if (!igmPositive && !iggPositive) return 'Pas d\'infection';
  if (igmPositive && !iggPositive) return 'Infection precoce';
  if (igmPositive && iggPositive) return 'Infection actuelle/chronique';
  return 'Indetermine';
}

/**
 * Check if clozapine level is in therapeutic range
 */
export function interpretClozapineLevel(level: number): string {
  if (level < 350) return 'Sous-therapeutique';
  if (level <= 600) return 'Therapeutique';
  if (level <= 1000) return 'Eleve';
  return 'Toxique';
}
