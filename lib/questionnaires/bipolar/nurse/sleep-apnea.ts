// eFondaMental Platform - Sleep Apnea (STOP-Bang)
// Bipolar Nurse Evaluation Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarNurseSleepApneaResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  diagnosed_sleep_apnea: string | null;
  has_cpap_device: string | null;
  // STOP-Bang questions
  snoring: string | null;
  tiredness: string | null;
  observed_apnea: string | null;
  hypertension: string | null;
  bmi_over_35: string | null;
  age_over_50: string | null;
  large_neck: string | null;
  male_gender: string | null;
  // Computed
  stop_bang_score: number | null;
  risk_level: string | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarNurseSleepApneaResponseInsert = {
  visit_id: string;
  patient_id: string;
  diagnosed_sleep_apnea?: string | null;
  has_cpap_device?: string | null;
  snoring?: string | null;
  tiredness?: string | null;
  observed_apnea?: string | null;
  hypertension?: string | null;
  bmi_over_35?: string | null;
  age_over_50?: string | null;
  large_neck?: string | null;
  male_gender?: string | null;
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
    text: 'Indice de Masse Corporelle superieur a 35 kg/m2 ?',
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

export const SLEEP_APNEA_DEFINITION = {
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
// STOP-Bang Score Computation
// ============================================================================

export interface StopBangScoreInput {
  snoring: string | null;
  tiredness: string | null;
  observed_apnea: string | null;
  hypertension: string | null;
  bmi_over_35: string | null;
  age_over_50: string | null;
  large_neck: string | null;
  male_gender: string | null;
}

export function computeStopBangScore(responses: StopBangScoreInput): number {
  let score = 0;
  
  if (responses.snoring === 'yes') score++;
  if (responses.tiredness === 'yes') score++;
  if (responses.observed_apnea === 'yes') score++;
  if (responses.hypertension === 'yes') score++;
  if (responses.bmi_over_35 === 'yes') score++;
  if (responses.age_over_50 === 'yes') score++;
  if (responses.large_neck === 'yes') score++;
  if (responses.male_gender === 'M' || responses.male_gender === 'yes') score++;
  
  return score;
}

// ============================================================================
// Risk Level Interpretation
// ============================================================================

export type SleepApneaRiskLevel = 'low' | 'intermediate' | 'high';

export function getSleepApneaRiskLevel(score: number): SleepApneaRiskLevel {
  if (score <= 2) return 'low';
  if (score <= 4) return 'intermediate';
  return 'high';
}

export function getRiskLevelLabel(level: SleepApneaRiskLevel): string {
  switch (level) {
    case 'low':
      return 'Risque faible';
    case 'intermediate':
      return 'Risque intermediaire';
    case 'high':
      return 'Risque eleve';
  }
}

export function interpretSleepApnea(
  diagnosed: string | null,
  hasCpap: string | null,
  score: number
): string {
  if (diagnosed === 'yes') {
    if (hasCpap === 'yes') {
      return 'Apnees du sommeil diagnostiquees. Patient appareille (CPAP).';
    }
    return 'Apnees du sommeil diagnostiquees. Patient non appareille.';
  }
  
  const riskLevel = getSleepApneaRiskLevel(score);
  const riskLabel = getRiskLevelLabel(riskLevel);
  return `Score STOP-Bang: ${score}/8. ${riskLabel} d\'apnees du sommeil.`;
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface SleepApneaScoringResult {
  diagnosed: boolean;
  has_cpap: boolean | null;
  stop_bang_score: number;
  risk_level: SleepApneaRiskLevel | null;
  risk_level_label: string;
  interpretation: string;
}

export function scoreSleepApnea(
  responses: StopBangScoreInput & { diagnosed_sleep_apnea: string | null; has_cpap_device: string | null }
): SleepApneaScoringResult {
  const diagnosed = responses.diagnosed_sleep_apnea === 'yes';
  const stop_bang_score = computeStopBangScore(responses);
  const risk_level = diagnosed ? null : getSleepApneaRiskLevel(stop_bang_score);

  return {
    diagnosed,
    has_cpap: diagnosed ? (responses.has_cpap_device === 'yes') : null,
    stop_bang_score,
    risk_level,
    risk_level_label: risk_level ? getRiskLevelLabel(risk_level) : (diagnosed ? 'Diagnostic confirme' : 'Non applicable'),
    interpretation: interpretSleepApnea(responses.diagnosed_sleep_apnea, responses.has_cpap_device, stop_bang_score)
  };
}
