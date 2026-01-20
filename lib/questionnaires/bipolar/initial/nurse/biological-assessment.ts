// eFondaMental Platform - BIOLOGICAL_ASSESSMENT (Bilan biologique)
// Bipolar Initial Evaluation - Nurse Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarBiologicalAssessmentResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  collection_date: string | null;
  collection_location: string | null;
  // Biochimie
  sodium: number | null;
  potassium: number | null;
  chlore: number | null;
  bicarbonates: number | null;
  protidemie: number | null;
  albumine: number | null;
  uree: number | null;
  acide_urique: number | null;
  creatinine: number | null;
  clairance_creatinine: number | null;
  phosphore: number | null;
  fer: number | null;
  ferritine: number | null;
  calcemie: number | null;
  calcemie_corrigee: number | null;
  crp: number | null;
  glycemie_a_jeun: number | null;
  glycemie_a_jeun_unit: string | null;
  hemoglobine_glyquee: number | null;
  // Bilan lipidique
  hdl: number | null;
  hdl_unit: string | null;
  ldl: number | null;
  ldl_unit: string | null;
  cholesterol_total: number | null;
  triglycerides: number | null;
  rapport_total_hdl: number | null;
  // Bilan hepatique
  pal: number | null;
  asat: number | null;
  alat: number | null;
  ggt: number | null;
  bilirubine_totale: number | null;
  bilirubine_totale_unit: string | null;
  // Bilan thyroidien
  tsh: number | null;
  tsh_unit: string | null;
  t3_libre: number | null;
  t4_libre: number | null;
  // NFS
  leucocytes: number | null;
  hematies: number | null;
  hemoglobine: number | null;
  hemoglobine_unit: string | null;
  hematocrite: number | null;
  hematocrite_unit: string | null;
  neutrophiles: number | null;
  basophiles: number | null;
  eosinophiles: number | null;
  lymphocytes: number | null;
  monocytes: number | null;
  vgm: number | null;
  tcmh: number | null;
  tcmh_unit: string | null;
  ccmh: number | null;
  ccmh_unit: string | null;
  plaquettes: number | null;
  // HCG
  beta_hcg: number | null;
  dosage_bhcg: number | null;
  prolactine: number | null;
  prolactine_unit: string | null;
  // Dosage psychotropes
  treatment_taken_morning: boolean | null;
  clozapine: number | null;
  teralithe_type: string | null;
  lithium_plasma: number | null;
  lithium_erythrocyte: number | null;
  valproic_acid: number | null;
  carbamazepine: number | null;
  oxcarbazepine: number | null;
  lamotrigine: number | null;
  // Vitamine D
  vitamin_d_level: number | null;
  outdoor_time: string | null;
  skin_phototype: string | null;
  vitamin_d_supplementation: boolean | null;
  vitamin_d_product_name: string | null;
  vitamin_d_supplementation_date: string | null;
  vitamin_d_supplementation_mode: string | null;
  vitamin_d_supplementation_dose: string | null;
  // Serologie toxoplasmose
  toxo_serology_done: boolean | null;
  toxo_igm_positive: boolean | null;
  toxo_igg_positive: boolean | null;
  toxo_igg_value: number | null;
  toxo_pcr_done: boolean | null;
  toxo_pcr_positive: boolean | null;
  // Control fields
  on_neuroleptics: boolean | null;
  woman_childbearing_age: boolean | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarBiologicalAssessmentResponseInsert = Omit<
  BipolarBiologicalAssessmentResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'clairance_creatinine' | 'calcemie_corrigee' | 'rapport_total_hdl'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const BIOLOGICAL_ASSESSMENT_QUESTIONS: Question[] = [
  // Date and Location Section
  {
    id: 'section_date_location',
    text: 'Date et lieu de prelevement',
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
  {
    id: 'collection_location',
    text: 'Prelevement effectue',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'sur_site', label: 'Sur site' },
      { code: 'hors_site', label: 'Hors site' }
    ]
  },
  
  // ===== BIOCHIMIE =====
  {
    id: 'section_biochimie',
    text: 'BIOCHIMIE',
    type: 'section',
    required: false
  },
  {
    id: 'sodium',
    text: 'Sodium (mmol/L)',
    help: 'Valeur normale comprise entre 135 et 145',
    type: 'number',
    required: false,
    min: 120,
    max: 170
  },
  {
    id: 'potassium',
    text: 'Potassium (mmol/L)',
    help: 'Valeur normale comprise entre 3.5 et 5',
    type: 'number',
    required: false,
    min: 2.0,
    max: 7.0
  },
  {
    id: 'chlore',
    text: 'Chlore (Chlorure) (mmol/L)',
    help: 'Valeur normale comprise entre 95 et 108',
    type: 'number',
    required: false,
    min: 80,
    max: 130
  },
  {
    id: 'bicarbonates',
    text: 'Bicarbonates (mmol/L)',
    help: 'Valeur normale comprise entre 24 et 30',
    type: 'number',
    required: false,
    min: 10,
    max: 40
  },
  {
    id: 'protidemie',
    text: 'Protidemie (Proteines totales) (g/L)',
    help: 'Valeur normale comprise entre 60 et 89.2',
    type: 'number',
    required: false,
    min: 50,
    max: 90
  },
  {
    id: 'albumine',
    text: 'Albumine (g/L)',
    help: 'Valeur normale comprise entre 35 et 55',
    type: 'number',
    required: false,
    min: 30,
    max: 55
  },
  {
    id: 'uree',
    text: 'Uree (mmol/L)',
    help: 'Valeur normale comprise entre 2.8 et 7.18',
    type: 'number',
    required: false,
    min: 1,
    max: 20
  },
  {
    id: 'acide_urique',
    text: 'Acide urique (umol/L)',
    help: 'Valeur normale comprise entre 208 et 428',
    type: 'number',
    required: false,
    min: 100,
    max: 500
  },
  {
    id: 'creatinine',
    text: 'Creatinine (umol/L)',
    help: 'Valeur normale comprise entre 74 et 110',
    type: 'number',
    required: false,
    min: 30,
    max: 400
  },
  {
    id: 'clairance_creatinine',
    text: 'Clairance de la creatinine (ml/min)',
    help: 'Valeur normale comprise entre 80 et 120. Calculee automatiquement.',
    type: 'number',
    required: false,
    readonly: true,
    min: 0,
    max: 10000
  },
  {
    id: 'phosphore',
    text: 'Phosphore (mmol/L)',
    help: 'Valeur normale comprise entre 0.81 et 1.45',
    type: 'number',
    required: false,
    min: 0.5,
    max: 2.0
  },
  {
    id: 'fer',
    text: 'Fer (umol/L)',
    help: 'Valeur normale comprise entre 11.6 et 31.4',
    type: 'number',
    required: false,
    min: 5,
    max: 40
  },
  {
    id: 'ferritine',
    text: 'Ferritine (ug/L)',
    help: 'Valeurs acceptees: 5-1000',
    type: 'number',
    required: false,
    min: 5,
    max: 1000
  },
  {
    id: 'calcemie',
    text: 'Calcemie (Calcium total) (mmol/L)',
    help: 'Valeur normale comprise entre 2.1 et 2.65',
    type: 'number',
    required: false,
    min: 1.50,
    max: 2.75
  },
  {
    id: 'calcemie_corrigee',
    text: 'Calcemie corrigee:',
    help: 'Formule: calcemie / 0,55 + protidemie / 160',
    type: 'number',
    required: false,
    readonly: true
  },
  {
    id: 'crp',
    text: 'CRP (mg/L)',
    help: 'Valeur normale inferieur a 10',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'glycemie_a_jeun',
    text: 'Glycemie a jeun',
    help: 'Valeur normale comprise entre 3.88 et 6.1',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'glycemie_a_jeun_unit',
    text: 'Unite',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'mmol_L', label: 'mmol/L' },
      { code: 'g_L', label: 'g/L' }
    ]
  },
  {
    id: 'hemoglobine_glyquee',
    text: 'Hemoglobine glyquee (%)',
    help: 'Valeur normale inferieur a 6',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  
  // ===== BILAN LIPIDIQUE =====
  {
    id: 'section_lipidique',
    text: 'BILAN LIPIDIQUE',
    type: 'section',
    required: false
  },
  {
    id: 'hdl',
    text: 'Cholesterol HDL',
    help: 'Valeur normale comprise entre 1.1 et 1.8',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'hdl_unit',
    text: 'Unite HDL',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'mmol_L', label: 'mmol/L' },
      { code: 'g_L', label: 'g/L' }
    ]
  },
  {
    id: 'ldl',
    text: 'Cholesterol LDL',
    help: 'Valeur normale comprise entre 2.6 et 4.1',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'ldl_unit',
    text: 'Unite LDL',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'mmol_L', label: 'mmol/L' },
      { code: 'g_L', label: 'g/L' }
    ]
  },
  {
    id: 'cholesterol_total',
    text: 'Cholesterol total (mmol/L)',
    help: 'Valeur normale comprise entre 4.4 et 6.1',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'triglycerides',
    text: 'Triglycerides (mmol/L)',
    help: 'Valeur normale comprise entre 0.5 et 1.4',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'rapport_total_hdl',
    text: 'Rapport Total / HDL',
    help: 'Norme inferieure a 5 chez l\'homme et 4,4 chez la femme',
    type: 'number',
    required: false,
    readonly: true,
    min: 0,
    max: 50
  },
  
  // ===== BILAN HEPATIQUE =====
  {
    id: 'section_hepatique',
    text: 'BILAN HEPATIQUE',
    type: 'section',
    required: false
  },
  {
    id: 'pal',
    text: 'Phosphatases alcalines (PAL) (UI/L)',
    help: 'Valeur normale comprise entre 30 et 115',
    type: 'number',
    required: false,
    min: 20,
    max: 400
  },
  {
    id: 'asat',
    text: 'ASAT / TGO (UI/L)',
    help: 'Valeur normale comprise entre 5 et 40',
    type: 'number',
    required: false,
    min: 5,
    max: 500
  },
  {
    id: 'alat',
    text: 'ALAT / TGP (UI/L)',
    help: 'Valeur normale comprise entre 5 et 45',
    type: 'number',
    required: false,
    min: 5,
    max: 500
  },
  {
    id: 'ggt',
    text: 'Gamma-GT (UI/L)',
    help: 'Valeur normale comprise entre 10 et 65',
    type: 'number',
    required: false,
    min: 5,
    max: 1500
  },
  {
    id: 'bilirubine_totale',
    text: 'Bilirubine totale (umol/L)',
    help: 'Valeur normale comprise entre 4 et 21',
    type: 'number',
    required: false,
    min: 0,
    max: 500
  },
  {
    id: 'bilirubine_totale_unit',
    text: 'Unite',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'umol_L', label: 'umol/L' },
      { code: 'mmol_L', label: 'mmol/L' },
      { code: 'mg_L', label: 'mg/L' }
    ]
  },
  
  // ===== BILAN THYROIDIEN =====
  {
    id: 'section_thyroidien',
    text: 'BILAN THYROIDIEN',
    type: 'section',
    required: false
  },
  {
    id: 'tsh',
    text: 'TSH ultrasensible',
    help: 'Valeur normale comprise entre 0.3 et 4.4',
    type: 'number',
    required: false
  },
  {
    id: 'tsh_unit',
    text: 'Unite TSH',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'uUI_mL', label: 'uUI/mL' },
      { code: 'mUI_L', label: 'mUI/L' }
    ]
  },
  {
    id: 't3_libre',
    text: 'T3 libre (pmol/L)',
    help: 'Valeur normale comprise entre 2.8 et 7',
    type: 'number',
    required: false
  },
  {
    id: 't4_libre',
    text: 'T4 libre (pmol/L)',
    help: 'Valeur normale comprise entre 12 et 23',
    type: 'number',
    required: false
  },
  
  // ===== NFS =====
  {
    id: 'section_nfs',
    text: 'NFS (NUMERATION FORMULE SANGUINE)',
    type: 'section',
    required: false
  },
  {
    id: 'leucocytes',
    text: 'Leucocytes (GB) (G/L)',
    help: 'Valeur normale comprise entre 4 et 10',
    type: 'number',
    required: false,
    min: 0,
    max: 500
  },
  {
    id: 'hematies',
    text: 'Hematies (GR) (T/L)',
    help: 'Valeur normale comprise entre 4 et 5',
    type: 'number',
    required: false,
    min: 0,
    max: 20
  },
  {
    id: 'hemoglobine',
    text: 'Hemoglobine (Hb)',
    help: 'Valeur normale comprise entre 11.5 et 15',
    type: 'number',
    required: false
  },
  {
    id: 'hemoglobine_unit',
    text: 'Unite Hemoglobine',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'g_dL', label: 'g/dL' },
      { code: 'mmol_L', label: 'mmol/L' }
    ]
  },
  {
    id: 'hematocrite',
    text: 'Hematocrite (Ht)',
    help: 'Valeur normale comprise entre 37 et 47',
    type: 'number',
    required: false
  },
  {
    id: 'hematocrite_unit',
    text: 'Unite Hematocrite',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'percent', label: '%' },
      { code: 'L_L', label: 'L/L' }
    ]
  },
  {
    id: 'neutrophiles',
    text: 'Neutrophiles (G/L)',
    help: 'Valeur normale comprise entre 1.7 et 7.5',
    type: 'number',
    required: false,
    min: 0,
    max: 200
  },
  {
    id: 'basophiles',
    text: 'Basophiles (G/L)',
    help: 'Valeur normale Inferieur a 0.2',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'eosinophiles',
    text: 'Eosinophiles (G/L)',
    help: 'Valeur normale inferieur a 0.8',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'lymphocytes',
    text: 'Lymphocytes (G/L)',
    help: 'Valeur normale comprise entre 1 et 4',
    type: 'number',
    required: false,
    min: 0,
    max: 200
  },
  {
    id: 'monocytes',
    text: 'Monocytes (G/L)',
    help: 'Valeur normale comprise entre 0.2 et 1',
    type: 'number',
    required: false,
    min: 0,
    max: 50
  },
  {
    id: 'vgm',
    text: 'VGM (fL)',
    help: 'Valeur normale comprise entre 80 et 100',
    type: 'number',
    required: false,
    min: 0,
    max: 200
  },
  {
    id: 'tcmh',
    text: 'TCMH',
    help: 'Valeur normale superieur a 27',
    type: 'number',
    required: false
  },
  {
    id: 'tcmh_unit',
    text: 'Unite TCMH',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'pg', label: 'pg' },
      { code: 'percent', label: '%' }
    ]
  },
  {
    id: 'ccmh',
    text: 'CCMH',
    help: 'Valeur normale comprise entre 30 et 35',
    type: 'number',
    required: false
  },
  {
    id: 'ccmh_unit',
    text: 'Unite CCMH',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'percent', label: '%' },
      { code: 'g_dL', label: 'g/dL' },
      { code: 'g_L', label: 'g/L' }
    ]
  },
  {
    id: 'plaquettes',
    text: 'Plaquettes (G/L)',
    help: 'Valeur normale comprise entre 150 et 500',
    type: 'number',
    required: false,
    min: 0,
    max: 2000
  },
  
  // ===== bHCG =====
  {
    id: 'section_bhcg',
    text: 'bHCG',
    type: 'section',
    required: false
  },
  {
    id: 'dosage_bhcg',
    text: 'Dosage des bHCG (UI)',
    help: 'Remplir pour les femmes en age de procreer seulement',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'prolactine',
    text: 'Taux prolactine',
    type: 'number',
    required: false,
    min: 0
  },
  {
    id: 'prolactine_unit',
    text: 'Unite',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'mg_L', label: 'mg/L' },
      { code: 'uIU_mL', label: 'uIU/mL' },
      { code: 'ng_mL', label: 'ng/mL' },
      { code: 'ug_L', label: 'ug/L' }
    ]
  },
  
  // ===== DOSAGE PSYCHOTROPES =====
  {
    id: 'section_psychotropes',
    text: 'Dosage des psychotropes',
    help: 'S\'assurer que le patient n\'ait pas pris son traitement le matin du dosage.',
    type: 'section',
    required: false
  },
  {
    id: 'treatment_taken_morning',
    text: 'Prise du traitement par le patient le matin du prelevement',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ]
  },
  {
    id: 'clozapine',
    text: 'Dosage plasmatique de la clozapine (mmol/L)',
    type: 'number',
    required: false,
    display_if: {
      '==': [{ var: 'treatment_taken_morning' }, 'no']
    }
  },
  {
    id: 'teralithe_type',
    text: 'Teralithe',
    type: 'single_choice',
    required: false,
    options: [
      { code: '250', label: '250' },
      { code: 'LP400', label: 'LP400' }
    ],
    display_if: {
      '==': [{ var: 'treatment_taken_morning' }, 'no']
    }
  },
  {
    id: 'lithium_plasma',
    text: 'Taux de lithium plasmatique (mmol/L)',
    help: 'Valeur normale comprise entre 0.6 et 1.2',
    type: 'number',
    required: false,
    display_if: {
      '==': [{ var: 'treatment_taken_morning' }, 'no']
    }
  },
  {
    id: 'lithium_erythrocyte',
    text: 'Taux de lithium intra-erythrocytaire (mmol/L)',
    help: 'Valeur normale comprise entre 0.2 et 0.5',
    type: 'number',
    required: false,
    display_if: {
      '==': [{ var: 'treatment_taken_morning' }, 'no']
    }
  },
  {
    id: 'valproic_acid',
    text: 'Taux d\'acide valproique plasmatique (mg/L)',
    help: 'Valeur normale comprise entre 50 et 100',
    type: 'number',
    required: false,
    display_if: {
      '==': [{ var: 'treatment_taken_morning' }, 'no']
    }
  },
  {
    id: 'carbamazepine',
    text: 'Taux de carbamazepine (mg/L)',
    help: 'Valeur normale comprise entre 4 et 12',
    type: 'number',
    required: false,
    display_if: {
      '==': [{ var: 'treatment_taken_morning' }, 'no']
    }
  },
  {
    id: 'oxcarbazepine',
    text: 'Taux d\'oxcarbazepine (ug/ml)',
    type: 'number',
    required: false,
    display_if: {
      '==': [{ var: 'treatment_taken_morning' }, 'no']
    }
  },
  {
    id: 'lamotrigine',
    text: 'Taux de lamotrigine',
    type: 'number',
    required: false,
    display_if: {
      '==': [{ var: 'treatment_taken_morning' }, 'no']
    }
  },
  
  // ===== VITAMINE D =====
  {
    id: 'section_vitamine_d',
    text: 'Questionnaire vitamine D',
    type: 'section',
    required: false
  },
  {
    id: 'vitamin_d_level',
    text: 'Dosage sanguin de vitamine D (ng/ml)',
    type: 'number',
    required: false,
    min: 0,
    max: 300
  },
  {
    id: 'outdoor_time',
    text: 'Temps moyen passe a l\'exterieur',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'less_than_1h_per_week', label: 'moins de 1 heure par semaine' },
      { code: 'less_than_1h_per_day_several_hours_per_week', label: 'moins de 1 heure par jour mais plusieurs heures par semaine' },
      { code: 'at_least_1h_per_day', label: 'au moins 1 heure par jour en moyenne' },
      { code: 'more_than_4h_per_day', label: 'plus de 4 heures par jour' }
    ]
  },
  {
    id: 'skin_phototype',
    text: 'Caracterisation du phototype cutane',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'I', label: 'phototype I' },
      { code: 'II', label: 'phototype II' },
      { code: 'III', label: 'phototype III' },
      { code: 'IV', label: 'phototype IV' },
      { code: 'V', label: 'phototype V' },
      { code: 'VI', label: 'phototype VI' }
    ]
  },
  {
    id: 'vitamin_d_supplementation',
    text: 'Supplementation en vitamine D dans les 12 mois precedents',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ]
  },
  {
    id: 'vitamin_d_product_name',
    text: 'Nom du produit',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'sterogyl', label: 'Sterogyl' },
      { code: 'dedrogyl', label: 'Dedrogyl' },
      { code: 'uvedose', label: 'Uvedose' },
      { code: 'zymaduo', label: 'Zymaduo' },
      { code: 'uvesterol', label: 'Uvesterol' },
      { code: 'zymad', label: 'Zymad' },
      { code: 'autre', label: 'Autre' }
    ],
    display_if: {
      '==': [{ var: 'vitamin_d_supplementation' }, 'yes']
    }
  },
  {
    id: 'vitamin_d_supplementation_date',
    text: 'Date',
    type: 'date',
    required: false,
    display_if: {
      '==': [{ var: 'vitamin_d_supplementation' }, 'yes']
    }
  },
  {
    id: 'vitamin_d_supplementation_mode',
    text: 'Mode de supplementation',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'ampoule', label: 'Ampoule' },
      { code: 'gouttes', label: 'Gouttes' }
    ],
    display_if: {
      '==': [{ var: 'vitamin_d_supplementation' }, 'yes']
    }
  },
  {
    id: 'vitamin_d_supplementation_dose',
    text: 'Dose',
    type: 'text',
    required: false,
    display_if: {
      '==': [{ var: 'vitamin_d_supplementation' }, 'yes']
    }
  },
  
  // ===== SEROLOGIE TOXOPLASMOSE =====
  {
    id: 'section_toxo',
    text: 'Serologie toxoplasmose',
    help: 'Rappel : le dosage est a faire a chaque visite, meme en cas de serologie positive anterieure',
    type: 'section',
    required: false
  },
  {
    id: 'toxo_serology_done',
    text: 'Le patient a-t-il eu une serologie toxoplasmique ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ]
  },
  {
    id: 'toxo_igm_positive',
    text: 'Le statut IgM est-il positif ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'toxo_serology_done' }, 'yes']
    }
  },
  {
    id: 'toxo_igg_positive',
    text: 'Le statut IgG est-il positif ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'toxo_serology_done' }, 'yes']
    }
  },
  {
    id: 'toxo_igg_value',
    text: 'IgG (UI/mL)',
    type: 'number',
    required: false,
    min: 0,
    display_if: {
      'and': [
        { '==': [{ var: 'toxo_serology_done' }, 'yes'] },
        { '==': [{ var: 'toxo_igg_positive' }, 'yes'] }
      ]
    }
  },
  {
    id: 'toxo_pcr_done',
    text: 'Une PCR ADN a-t-elle ete realisee ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ var: 'toxo_serology_done' }, 'yes'] },
        { '==': [{ var: 'toxo_igg_positive' }, 'yes'] }
      ]
    }
  },
  {
    id: 'toxo_pcr_positive',
    text: 'La PCR ADN etait-elle positive ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'and': [
        { '==': [{ var: 'toxo_serology_done' }, 'yes'] },
        { '==': [{ var: 'toxo_igg_positive' }, 'yes'] },
        { '==': [{ var: 'toxo_pcr_done' }, 'yes'] }
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

export const BIOLOGICAL_ASSESSMENT_DEFINITION: QuestionnaireDefinition = {
  id: 'biological_assessment',
  code: 'BIOLOGICAL_ASSESSMENT',
  title: 'Bilan biologique',
  description: 'Evaluation biologique complete incluant biochimie, bilan lipidique, hepatique, thyroidien, NFS, HCG, prolactine, dosages psychotropes, vitamine D et serologie toxoplasmose',
  questions: BIOLOGICAL_ASSESSMENT_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Computed Fields
// ============================================================================

export interface CreatinineClearanceInput {
  creatinine: number;
  weight_kg: number;
  age: number;
  is_male: boolean;
}

export function computeCreatinineClearance(input: CreatinineClearanceInput): number | null {
  if (input.creatinine <= 0 || input.weight_kg <= 0 || input.age <= 0) return null;
  
  // Cockroft-Gault formula
  const multiplier = input.is_male ? 1.23 : 1.04;
  const clearance = (multiplier * input.weight_kg * (140 - input.age)) / input.creatinine;
  
  return Math.round(clearance * 100) / 100;
}

export function computeCorrectedCalcemia(calcemie: number, protidemie: number): number | null {
  if (!calcemie || !protidemie) return null;
  
  // Formula: calcemie / 0.55 + protidemie / 160
  const corrected = calcemie / 0.55 + protidemie / 160;
  
  return Math.round(corrected * 100) / 100;
}

export function computeCholesterolRatio(cholesterolTotal: number, hdl: number): number | null {
  if (!cholesterolTotal || !hdl || hdl === 0) return null;
  
  const ratio = cholesterolTotal / hdl;
  
  return Math.round(ratio * 100) / 100;
}

// ============================================================================
// Note: This questionnaire collects biological data
// Specific alerts and interpretations are generated by the service layer
// based on reference values defined in the question help texts
// ============================================================================
