// eFondaMental Platform - SLEEP_APNEA (Sleep Apnea - STOP-Bang)
// Bipolar Initial Evaluation - Nurse Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarSleepApneaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  diagnosed_sleep_apnea: string;
  has_cpap_device: boolean | null;
  snoring: boolean | null;
  tiredness: boolean | null;
  observed_apnea: boolean | null;
  hypertension: boolean | null;
  bmi_over_35: boolean | null;
  age_over_50: boolean | null;
  large_neck: boolean | null;
  male_gender: boolean | null;
  stop_bang_score: number | null;
  risk_level: string | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarSleepApneaResponseInsert = Omit<
  BipolarSleepApneaResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'stop_bang_score' | 'risk_level' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const SLEEP_APNEA_QUESTIONS: Question[] = [
  {
    id: 'diagnosed_sleep_apnea',
    text: 'Avez-vous ete diagnostique comme souffrant d\'apnees du sommeil ? (examen du sommeil, polysomnographie)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' },
      { code: 'unknown', label: 'NSP (Ne Sais Pas)' }
    ]
  },
  
  // If diagnosed = yes - ONLY show CPAP device question
  {
    id: 'has_cpap_device',
    text: 'Etes-vous appareille ?',
    help: 'Utilisez-vous un appareil CPAP pour traiter vos apnees du sommeil ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      '==': [{ var: 'diagnosed_sleep_apnea' }, 'yes']
    }
  },
  
  // STOP-Bang questions (if diagnosed = no or unknown)
  {
    id: 'section_stop_bang',
    text: 'Depistage des Apnees du Sommeil (STOP-Bang)',
    help: 'Repondez aux questions suivantes pour evaluer votre risque d\'apnees du sommeil',
    type: 'section',
    required: false,
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  },
  {
    id: 'snoring',
    text: 'Ronflements ? Ronflez-vous fort (suffisamment fort pour qu\'on vous entende a travers une porte fermee ou que votre partenaire vous donne des coups de coude parce que vous ronflez la nuit) ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  },
  {
    id: 'tiredness',
    text: 'Fatigue ? Vous sentez-vous souvent fatigue(e), epuise(e) ou somnolent(e) pendant la journee (comme par exemple s\'endormir au volant) ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  },
  {
    id: 'observed_apnea',
    text: 'Observation ? Quelqu\'un a-t-il observe que vous arretiez de respirer ou que vous vous etouffiez/suffoquiez pendant votre sommeil ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  },
  {
    id: 'hypertension',
    text: 'Tension ? Etes-vous atteint(e) d\'hypertension arterielle ou etes-vous traite(e) pour ce probleme ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  },
  {
    id: 'bmi_over_35',
    text: 'Indice de Masse Corporelle superieur a 35 kg/m^2 ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  },
  {
    id: 'age_over_50',
    text: 'Age superieur a 50 ans ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  },
  {
    id: 'large_neck',
    text: 'Tour de cou important ? (mesure au niveau de la pomme d\'Adam) Pour les hommes, votre tour de cou est-il superieur ou egal a 43 cm ? Pour les femmes, votre tour de cou est-il superieur ou egal a 41 cm ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'yes', label: 'Oui' },
      { code: 'no', label: 'Non' }
    ],
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
    }
  },
  {
    id: 'male_gender',
    text: 'Sexe = Masculin ?',
    type: 'text',
    required: true,
    readonly: true,
    display_if: {
      'in': [{ var: 'diagnosed_sleep_apnea' }, ['no', 'unknown']]
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

export const SLEEP_APNEA_DEFINITION: QuestionnaireDefinition = {
  id: 'sleep_apnea',
  code: 'SLEEP_APNEA',
  title: 'Apnees du sommeil',
  description: 'Depistage des apnees du sommeil avec score STOP-Bang',
  questions: SLEEP_APNEA_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Score Computation
// ============================================================================

export interface StopBangInput {
  snoring: boolean;
  tiredness: boolean;
  observed_apnea: boolean;
  hypertension: boolean;
  bmi_over_35: boolean;
  age_over_50: boolean;
  large_neck: boolean;
  male_gender: boolean;
}

export function computeStopBangScore(responses: StopBangInput): number {
  const factors = [
    responses.snoring,
    responses.tiredness,
    responses.observed_apnea,
    responses.hypertension,
    responses.bmi_over_35,
    responses.age_over_50,
    responses.large_neck,
    responses.male_gender
  ];
  
  return factors.filter(Boolean).length;
}

// ============================================================================
// Score Interpretation
// ============================================================================

export type StopBangRiskLevel = 'low_risk' | 'intermediate_risk' | 'high_risk';

export function getRiskLevel(score: number, hasMajorRiskFactors: boolean): StopBangRiskLevel {
  if (score <= 2) return 'low_risk';
  if (score >= 5) return 'high_risk';
  if (score >= 3 && hasMajorRiskFactors) return 'high_risk';
  return 'intermediate_risk';
}

export function interpretStopBangScore(score: number, responses: StopBangInput): string {
  const hasMajorRiskFactors = responses.bmi_over_35 || responses.hypertension || responses.large_neck;
  const riskLevel = getRiskLevel(score, hasMajorRiskFactors);
  
  let interpretation = '';
  
  if (riskLevel === 'low_risk') {
    interpretation = `Score STOP-Bang: ${score}/8. Faible risque d'apnees obstructives du sommeil.`;
  } else if (riskLevel === 'intermediate_risk') {
    interpretation = `Score STOP-Bang: ${score}/8. Risque intermediaire d'apnees obstructives du sommeil. Considerer une evaluation plus approfondie.`;
  } else {
    interpretation = `Score STOP-Bang: ${score}/8. Haut risque d'apnees obstructives du sommeil. Recommandation forte pour une polysomnographie.`;
  }

  // Add major risk factors warning
  if (score >= 3 && hasMajorRiskFactors) {
    interpretation += ' Facteurs de risque majeurs presents (IMC > 35, HTA, ou tour de cou important).';
  }

  return interpretation;
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface StopBangScoringResult {
  stop_bang_score: number;
  risk_level: StopBangRiskLevel;
  interpretation: string;
}

export function scoreStopBang(responses: StopBangInput): StopBangScoringResult {
  const score = computeStopBangScore(responses);
  const hasMajorRiskFactors = responses.bmi_over_35 || responses.hypertension || responses.large_neck;
  const risk_level = getRiskLevel(score, hasMajorRiskFactors);
  const interpretation = interpretStopBangScore(score, responses);

  return {
    stop_bang_score: score,
    risk_level,
    interpretation
  };
}
