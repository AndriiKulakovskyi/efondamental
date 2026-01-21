// eFondaMental Platform - Medical Pathologies Questionnaires
// Bipolar Initial Evaluation - Medical Module
// This file contains all 9 pathology questionnaires for bipolar initial evaluation

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Shared Types
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

// ============================================================================
// 1. PATHO_NEURO - Pathologies Neurologiques
// ============================================================================

export interface BipolarPathoNeuroResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  has_neurological_condition: string | null;
  conditions: string[] | null;
  epilepsy_details: string | null;
  migraine_details: string | null;
  stroke_details: string | null;
  parkinson_details: string | null;
  multiple_sclerosis_details: string | null;
  traumatic_brain_injury_details: string | null;
  other_details: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export const PATHO_NEURO_QUESTIONS: Question[] = [
  {
    id: 'has_neurological_condition',
    text: 'Le patient presente-t-il une pathologie neurologique?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'conditions',
    text: 'Pathologies neurologiques presentes (selection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'has_neurological_condition' }, 'oui'] },
    options: [
      'Epilepsie',
      'Migraine',
      'AVC (Accident Vasculaire Cerebral)',
      'Maladie de Parkinson',
      'Sclerose en plaques',
      'Traumatisme cranien',
      'Neuropathie peripherique',
      'Autre'
    ]
  },
  {
    id: 'epilepsy_details',
    text: 'Epilepsie - Details (type, traitement)',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_neurological_condition' }, 'oui'] }
  },
  {
    id: 'other_details',
    text: 'Autres pathologies neurologiques - Preciser',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_neurological_condition' }, 'oui'] }
  }
];

export const PATHO_NEURO_DEFINITION: QuestionnaireDefinition = {
  id: 'patho_neuro',
  code: 'PATHO_NEURO',
  title: 'Pathologies Neurologiques',
  description: 'Recueil des antecedents et pathologies neurologiques actuelles.',
  questions: PATHO_NEURO_QUESTIONS,
  metadata: { singleColumn: true, pathologies: ['bipolar'], target_role: 'healthcare_professional' }
};

// ============================================================================
// 2. PATHO_CARDIO - Pathologies Cardiovasculaires
// ============================================================================

export interface BipolarPathoCardioResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  has_cardiovascular_condition: string | null;
  conditions: string[] | null;
  hypertension_treatment: string | null;
  hyperlipidemia_treatment: string | null;
  coronary_disease_details: string | null;
  heart_failure_details: string | null;
  arrhythmia_details: string | null;
  other_details: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export const PATHO_CARDIO_QUESTIONS: Question[] = [
  {
    id: 'has_cardiovascular_condition',
    text: 'Le patient presente-t-il une pathologie cardiovasculaire?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'conditions',
    text: 'Pathologies cardiovasculaires presentes (selection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'has_cardiovascular_condition' }, 'oui'] },
    options: [
      'Hypertension arterielle',
      'Hyperlipidemie/Hypercholesterolemie',
      'Maladie coronarienne',
      'Infarctus du myocarde',
      'Insuffisance cardiaque',
      'Arythmie cardiaque',
      'Valvulopathie',
      'Artériopathie peripherique',
      'Autre'
    ]
  },
  {
    id: 'hypertension_treatment',
    text: 'Hypertension - Traitement actuel',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_cardiovascular_condition' }, 'oui'] }
  },
  {
    id: 'other_details',
    text: 'Autres pathologies cardiovasculaires - Preciser',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_cardiovascular_condition' }, 'oui'] }
  }
];

export const PATHO_CARDIO_DEFINITION: QuestionnaireDefinition = {
  id: 'patho_cardio',
  code: 'PATHO_CARDIO',
  title: 'Pathologies Cardiovasculaires',
  description: 'Recueil des antecedents et pathologies cardiovasculaires actuelles.',
  questions: PATHO_CARDIO_QUESTIONS,
  metadata: { singleColumn: true, pathologies: ['bipolar'], target_role: 'healthcare_professional' }
};

// ============================================================================
// 3. PATHO_ENDOC - Pathologies Endocriniennes
// ============================================================================

export interface BipolarPathoEndocResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  has_endocrine_condition: string | null;
  conditions: string[] | null;
  diabetes_type: string | null;
  diabetes_treatment: string | null;
  thyroid_details: string | null;
  other_details: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export const PATHO_ENDOC_QUESTIONS: Question[] = [
  {
    id: 'has_endocrine_condition',
    text: 'Le patient presente-t-il une pathologie endocrinienne?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'conditions',
    text: 'Pathologies endocriniennes presentes (selection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'has_endocrine_condition' }, 'oui'] },
    options: [
      'Diabete type 1',
      'Diabete type 2',
      'Pre-diabete',
      'Hypothyroidie',
      'Hyperthyroidie',
      'Syndrome de Cushing',
      'Insuffisance surrenalienne',
      'Obesite',
      'Syndrome metabolique',
      'Autre'
    ]
  },
  {
    id: 'diabetes_type',
    text: 'Type de diabete',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_endocrine_condition' }, 'oui'] },
    options: [
      { code: 'type1', label: 'Type 1' },
      { code: 'type2', label: 'Type 2' },
      { code: 'gestationnel', label: 'Gestationnel' },
      { code: 'autre', label: 'Autre' },
      { code: 'non_applicable', label: 'Non applicable' }
    ]
  },
  {
    id: 'diabetes_treatment',
    text: 'Diabete - Traitement actuel',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_endocrine_condition' }, 'oui'] }
  },
  {
    id: 'thyroid_details',
    text: 'Pathologie thyroidienne - Details',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_endocrine_condition' }, 'oui'] }
  },
  {
    id: 'other_details',
    text: 'Autres pathologies endocriniennes - Preciser',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_endocrine_condition' }, 'oui'] }
  }
];

export const PATHO_ENDOC_DEFINITION: QuestionnaireDefinition = {
  id: 'patho_endoc',
  code: 'PATHO_ENDOC',
  title: 'Pathologies Endocriniennes',
  description: 'Recueil des antecedents et pathologies endocriniennes actuelles.',
  questions: PATHO_ENDOC_QUESTIONS,
  metadata: { singleColumn: true, pathologies: ['bipolar'], target_role: 'healthcare_professional' }
};

// ============================================================================
// 4. PATHO_DERMATO - Pathologies Dermatologiques
// ============================================================================

export interface BipolarPathoDermatoResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  has_dermatological_condition: string | null;
  conditions: string[] | null;
  psoriasis_details: string | null;
  eczema_details: string | null;
  other_details: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export const PATHO_DERMATO_QUESTIONS: Question[] = [
  {
    id: 'has_dermatological_condition',
    text: 'Le patient presente-t-il une pathologie dermatologique?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'conditions',
    text: 'Pathologies dermatologiques presentes (selection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'has_dermatological_condition' }, 'oui'] },
    options: [
      'Psoriasis',
      'Eczema',
      'Dermatite atopique',
      'Acne severe',
      'Vitiligo',
      'Alopecie',
      'Autre'
    ]
  },
  {
    id: 'psoriasis_details',
    text: 'Psoriasis - Details (localisation, traitement)',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_dermatological_condition' }, 'oui'] }
  },
  {
    id: 'other_details',
    text: 'Autres pathologies dermatologiques - Preciser',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_dermatological_condition' }, 'oui'] }
  }
];

export const PATHO_DERMATO_DEFINITION: QuestionnaireDefinition = {
  id: 'patho_dermato',
  code: 'PATHO_DERMATO',
  title: 'Pathologies Dermatologiques',
  description: 'Recueil des antecedents et pathologies dermatologiques actuelles.',
  questions: PATHO_DERMATO_QUESTIONS,
  metadata: { singleColumn: true, pathologies: ['bipolar'], target_role: 'healthcare_professional' }
};

// ============================================================================
// 5. PATHO_URINAIRE - Pathologies Urinaires
// ============================================================================

export interface BipolarPathoUrinaireResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  has_urinary_condition: string | null;
  conditions: string[] | null;
  kidney_disease_details: string | null;
  other_details: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export const PATHO_URINAIRE_QUESTIONS: Question[] = [
  {
    id: 'has_urinary_condition',
    text: 'Le patient presente-t-il une pathologie urinaire ou renale?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'conditions',
    text: 'Pathologies urinaires/renales presentes (selection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'has_urinary_condition' }, 'oui'] },
    options: [
      'Insuffisance renale chronique',
      'Calculs renaux',
      'Infections urinaires recidivantes',
      'Incontinence urinaire',
      'Hypertrophie prostatique',
      'Autre'
    ]
  },
  {
    id: 'kidney_disease_details',
    text: 'Maladie renale - Details (stade, traitement)',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_urinary_condition' }, 'oui'] }
  },
  {
    id: 'other_details',
    text: 'Autres pathologies urinaires - Preciser',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_urinary_condition' }, 'oui'] }
  }
];

export const PATHO_URINAIRE_DEFINITION: QuestionnaireDefinition = {
  id: 'patho_urinaire',
  code: 'PATHO_URINAIRE',
  title: 'Pathologies Urinaires et Renales',
  description: 'Recueil des antecedents et pathologies urinaires/renales actuelles.',
  questions: PATHO_URINAIRE_QUESTIONS,
  metadata: { singleColumn: true, pathologies: ['bipolar'], target_role: 'healthcare_professional' }
};

// ============================================================================
// 6. ANTECEDENTS_GYNECO - Antecedents Gynecologiques
// ============================================================================

export interface BipolarAntecedentsGynecoResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  has_gynecological_condition: string | null;
  conditions: string[] | null;
  menstrual_irregularities: string | null;
  pcos_details: string | null;
  endometriosis_details: string | null;
  menopause_status: string | null;
  menopause_age: number | null;
  hrt_use: string | null;
  other_details: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export const ANTECEDENTS_GYNECO_QUESTIONS: Question[] = [
  {
    id: 'has_gynecological_condition',
    text: 'La patiente presente-t-elle des antecedents gynecologiques notables?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' },
      { code: 'non_applicable', label: 'Non applicable (patient masculin)' }
    ]
  },
  {
    id: 'conditions',
    text: 'Antecedents gynecologiques (selection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'has_gynecological_condition' }, 'oui'] },
    options: [
      'Syndrome des ovaires polykystiques (SOPK)',
      'Endometriose',
      'Fibromes uterins',
      'Syndrome premenstruel severe',
      'Troubles menstruels',
      'Hysterectomie',
      'Autre'
    ]
  },
  {
    id: 'menstrual_irregularities',
    text: 'Troubles menstruels - Details',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_gynecological_condition' }, 'oui'] }
  },
  {
    id: 'menopause_status',
    text: 'Statut menopausique',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_gynecological_condition' }, 'oui'] },
    options: [
      { code: 'premenopause', label: 'Pre-menopause' },
      { code: 'perimenopause', label: 'Peri-menopause' },
      { code: 'postmenopause', label: 'Post-menopause' },
      { code: 'non_applicable', label: 'Non applicable' }
    ]
  },
  {
    id: 'menopause_age',
    text: 'Age a la menopause',
    type: 'number',
    required: false,
    min: 30,
    max: 65,
    display_if: { '==': [{ var: 'menopause_status' }, 'postmenopause'] }
  },
  {
    id: 'hrt_use',
    text: 'Traitement hormonal substitutif',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'menopause_status' }, 'postmenopause'] },
    options: [
      { code: 'oui_actuel', label: 'Oui, actuellement' },
      { code: 'oui_passe', label: 'Oui, dans le passe' },
      { code: 'non', label: 'Non' }
    ]
  },
  {
    id: 'other_details',
    text: 'Autres antecedents gynecologiques - Preciser',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_gynecological_condition' }, 'oui'] }
  }
];

export const ANTECEDENTS_GYNECO_DEFINITION: QuestionnaireDefinition = {
  id: 'antecedents_gyneco',
  code: 'ANTECEDENTS_GYNECO',
  title: 'Antecedents Gynecologiques',
  description: 'Recueil des antecedents gynecologiques.',
  questions: ANTECEDENTS_GYNECO_QUESTIONS,
  metadata: { singleColumn: true, pathologies: ['bipolar'], target_role: 'healthcare_professional' }
};

// ============================================================================
// 7. PATHO_HEPATO_GASTRO - Pathologies Hepato-Gastrointestinales
// ============================================================================

export interface BipolarPathoHepatoGastroResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  has_hepatogastro_condition: string | null;
  conditions: string[] | null;
  liver_disease_details: string | null;
  ibd_details: string | null;
  other_details: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export const PATHO_HEPATO_GASTRO_QUESTIONS: Question[] = [
  {
    id: 'has_hepatogastro_condition',
    text: 'Le patient presente-t-il une pathologie hepato-gastro-intestinale?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'conditions',
    text: 'Pathologies hepato-gastro-intestinales presentes (selection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'has_hepatogastro_condition' }, 'oui'] },
    options: [
      'Steatose hepatique',
      'Hepatite chronique',
      'Cirrhose',
      'Maladie de Crohn',
      'Rectocolite hemorragique',
      'Syndrome de l\'intestin irritable',
      'Reflux gastro-oesophagien',
      'Ulcere gastrique ou duodenal',
      'Pancréatite',
      'Autre'
    ]
  },
  {
    id: 'liver_disease_details',
    text: 'Maladie hepatique - Details',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_hepatogastro_condition' }, 'oui'] }
  },
  {
    id: 'ibd_details',
    text: 'MICI (Crohn/RCH) - Details',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_hepatogastro_condition' }, 'oui'] }
  },
  {
    id: 'other_details',
    text: 'Autres pathologies hepato-gastro-intestinales - Preciser',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_hepatogastro_condition' }, 'oui'] }
  }
];

export const PATHO_HEPATO_GASTRO_DEFINITION: QuestionnaireDefinition = {
  id: 'patho_hepato_gastro',
  code: 'PATHO_HEPATO_GASTRO',
  title: 'Pathologies Hepato-Gastro-Intestinales',
  description: 'Recueil des antecedents et pathologies hepatiques et gastro-intestinales actuelles.',
  questions: PATHO_HEPATO_GASTRO_QUESTIONS,
  metadata: { singleColumn: true, pathologies: ['bipolar'], target_role: 'healthcare_professional' }
};

// ============================================================================
// 8. PATHO_ALLERGIQUE - Pathologies Allergiques
// ============================================================================

export interface BipolarPathoAllergiqueResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  has_allergic_condition: string | null;
  conditions: string[] | null;
  drug_allergies: string | null;
  food_allergies: string | null;
  asthma_details: string | null;
  other_details: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export const PATHO_ALLERGIQUE_QUESTIONS: Question[] = [
  {
    id: 'has_allergic_condition',
    text: 'Le patient presente-t-il une pathologie allergique?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'conditions',
    text: 'Pathologies allergiques presentes (selection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'has_allergic_condition' }, 'oui'] },
    options: [
      'Asthme allergique',
      'Rhinite allergique',
      'Allergies medicamenteuses',
      'Allergies alimentaires',
      'Urticaire chronique',
      'Angio-oedeme',
      'Eczema allergique',
      'Autre'
    ]
  },
  {
    id: 'drug_allergies',
    text: 'Allergies medicamenteuses - Preciser les medicaments',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_allergic_condition' }, 'oui'] }
  },
  {
    id: 'food_allergies',
    text: 'Allergies alimentaires - Preciser les aliments',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_allergic_condition' }, 'oui'] }
  },
  {
    id: 'asthma_details',
    text: 'Asthme - Details (severite, traitement)',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_allergic_condition' }, 'oui'] }
  },
  {
    id: 'other_details',
    text: 'Autres pathologies allergiques - Preciser',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_allergic_condition' }, 'oui'] }
  }
];

export const PATHO_ALLERGIQUE_DEFINITION: QuestionnaireDefinition = {
  id: 'patho_allergique',
  code: 'PATHO_ALLERGIQUE',
  title: 'Pathologies Allergiques',
  description: 'Recueil des antecedents et pathologies allergiques actuelles.',
  questions: PATHO_ALLERGIQUE_QUESTIONS,
  metadata: { singleColumn: true, pathologies: ['bipolar'], target_role: 'healthcare_professional' }
};

// ============================================================================
// 9. AUTRES_PATHO - Autres Pathologies
// ============================================================================

export interface BipolarAutresPathoResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  has_other_conditions: string | null;
  rheumatological_conditions: string[] | null;
  rheumatological_details: string | null;
  oncological_history: string | null;
  oncological_details: string | null;
  infectious_diseases: string[] | null;
  infectious_details: string | null;
  respiratory_conditions: string[] | null;
  respiratory_details: string | null;
  other_conditions: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export const AUTRES_PATHO_QUESTIONS: Question[] = [
  {
    id: 'has_other_conditions',
    text: 'Le patient presente-t-il d\'autres pathologies non mentionnees precedemment?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'section_rheumatological',
    text: 'Pathologies Rhumatologiques',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'has_other_conditions' }, 'oui'] }
  },
  {
    id: 'rheumatological_conditions',
    text: 'Pathologies rhumatologiques (selection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'has_other_conditions' }, 'oui'] },
    options: [
      'Aucune',
      'Polyarthrite rhumatoide',
      'Lupus erythemateux systemique',
      'Spondylarthrite ankylosante',
      'Fibromyalgie',
      'Arthrose',
      'Goutte',
      'Autre'
    ]
  },
  {
    id: 'rheumatological_details',
    text: 'Pathologies rhumatologiques - Details',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_other_conditions' }, 'oui'] }
  },
  {
    id: 'section_oncological',
    text: 'Antecedents Oncologiques',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'has_other_conditions' }, 'oui'] }
  },
  {
    id: 'oncological_history',
    text: 'Antecedent de cancer',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'has_other_conditions' }, 'oui'] },
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' },
      { code: 'ne_sais_pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'oncological_details',
    text: 'Antecedents oncologiques - Details (type, traitement, statut)',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'oncological_history' }, 'oui'] }
  },
  {
    id: 'section_infectious',
    text: 'Maladies Infectieuses',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'has_other_conditions' }, 'oui'] }
  },
  {
    id: 'infectious_diseases',
    text: 'Maladies infectieuses chroniques (selection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'has_other_conditions' }, 'oui'] },
    options: [
      'Aucune',
      'VIH',
      'Hepatite B',
      'Hepatite C',
      'Tuberculose',
      'Autre'
    ]
  },
  {
    id: 'infectious_details',
    text: 'Maladies infectieuses - Details',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_other_conditions' }, 'oui'] }
  },
  {
    id: 'section_respiratory',
    text: 'Pathologies Respiratoires',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'has_other_conditions' }, 'oui'] }
  },
  {
    id: 'respiratory_conditions',
    text: 'Pathologies respiratoires (selection multiple)',
    type: 'multiple_choice',
    required: false,
    display_if: { '==': [{ var: 'has_other_conditions' }, 'oui'] },
    options: [
      'Aucune',
      'BPCO',
      'Asthme (non allergique)',
      'Apnee du sommeil',
      'Fibrose pulmonaire',
      'Autre'
    ]
  },
  {
    id: 'respiratory_details',
    text: 'Pathologies respiratoires - Details',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_other_conditions' }, 'oui'] }
  },
  {
    id: 'other_conditions',
    text: 'Autres pathologies non listees - Preciser',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'has_other_conditions' }, 'oui'] }
  }
];

export const AUTRES_PATHO_DEFINITION: QuestionnaireDefinition = {
  id: 'autres_patho',
  code: 'AUTRES_PATHO',
  title: 'Autres Pathologies',
  description: 'Recueil des autres antecedents medicaux (rhumatologie, oncologie, infectiologie, pneumologie, etc.).',
  questions: AUTRES_PATHO_QUESTIONS,
  metadata: { singleColumn: true, pathologies: ['bipolar'], target_role: 'healthcare_professional' }
};

// ============================================================================
// Insert Types for all pathology responses
// ============================================================================

export type BipolarPathoNeuroResponseInsert = Omit<BipolarPathoNeuroResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;
export type BipolarPathoCardioResponseInsert = Omit<BipolarPathoCardioResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;
export type BipolarPathoEndocResponseInsert = Omit<BipolarPathoEndocResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;
export type BipolarPathoDermatoResponseInsert = Omit<BipolarPathoDermatoResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;
export type BipolarPathoUrinaireResponseInsert = Omit<BipolarPathoUrinaireResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;
export type BipolarAntecedentsGynecoResponseInsert = Omit<BipolarAntecedentsGynecoResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;
export type BipolarPathoHepatoGastroResponseInsert = Omit<BipolarPathoHepatoGastroResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;
export type BipolarPathoAllergiqueResponseInsert = Omit<BipolarPathoAllergiqueResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;
export type BipolarAutresPathoResponseInsert = Omit<BipolarAutresPathoResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;
