// eFondaMental Platform - Fagerstrom Test for Nicotine Dependence (FTND)
// Schizophrenia Initial Evaluation - Auto Module
// FTND - Fagerström Test for Nicotine Dependence

import { Question, QuestionnaireDefinition } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaFagerstromResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  questionnaire_done: 'Fait' | 'Non fait' | null;
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  q5: number | null;
  q6: number | null;
  total_score: number | null;
  hsi_score: number | null;
  dependence_level: string | null;
  treatment_guidance: string | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaFagerstromResponseInsert = Omit<
  SchizophreniaFagerstromResponse,
  'id' | 'total_score' | 'hsi_score' | 'dependence_level' | 'treatment_guidance' | 'interpretation' | 'completed_at' | 'created_at' | 'updated_at'
>;

// ============================================================================
// Score Result Interface
// ============================================================================

export interface FagerstromSzScoreResult {
  total_score: number;
  hsi_score: number;
  dependence_level: FagerstromSzDependenceLevel;
  treatment_guidance: string;
  interpretation: string;
}

// ============================================================================
// Dependence Levels (4 levels per user specification)
// ============================================================================

export type FagerstromSzDependenceLevel = 'aucune_tres_faible' | 'faible' | 'moyenne' | 'forte';

export const FAGERSTROM_SZ_THRESHOLDS: Record<FagerstromSzDependenceLevel, { min: number; max: number; label: string; treatment: string }> = {
  aucune_tres_faible: {
    min: 0,
    max: 2,
    label: 'Pas de dépendance ou dépendance très faible',
    treatment: 'Thérapie comportementale'
  },
  faible: {
    min: 3,
    max: 4,
    label: 'Dépendance faible',
    treatment: 'Substituts nicotiniques standard'
  },
  moyenne: {
    min: 5,
    max: 5,
    label: 'Dépendance moyenne',
    treatment: 'Substituts forte dose/combinés'
  },
  forte: {
    min: 6,
    max: 10,
    label: 'Dépendance forte',
    treatment: 'Thérapie combinée (substituts + médicaments)'
  }
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const FAGERSTROM_SZ_QUESTIONS: Question[] = [
  {
    id: 'questionnaire_done',
    text: 'Passation du questionnaire',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'Fait', label: 'Fait' },
      { code: 'Non fait', label: 'Non fait' }
    ]
  },
  {
    id: 'q1',
    text: '1. Combien de temps après votre réveil fumez-vous votre première cigarette ?',
    type: 'single_choice',
    required: true,
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 3, label: 'Dans les 5 minutes', score: 3 },
      { code: 2, label: 'De 6 à 30 minutes', score: 2 },
      { code: 1, label: 'De 31 à 60 minutes', score: 1 },
      { code: 0, label: 'Après 60 minutes', score: 0 }
    ]
  },
  {
    id: 'q2',
    text: '2. Trouvez-vous difficile de vous abstenir de fumer dans les endroits où c\'est interdit ?',
    type: 'single_choice',
    required: true,
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q3',
    text: '3. À quelle cigarette de la journée vous serait-il le plus difficile de renoncer ?',
    type: 'single_choice',
    required: true,
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 1, label: 'La première', score: 1 },
      { code: 0, label: 'N\'importe quelle autre', score: 0 }
    ]
  },
  {
    id: 'q4',
    text: '4. Combien de cigarettes fumez-vous par jour ?',
    type: 'single_choice',
    required: true,
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 0, label: '10 ou moins', score: 0 },
      { code: 1, label: '11-20', score: 1 },
      { code: 2, label: '21-30', score: 2 },
      { code: 3, label: '31 ou plus', score: 3 }
    ]
  },
  {
    id: 'q5',
    text: '5. Fumez-vous à un rythme plus soutenu le matin que l\'après-midi ?',
    type: 'single_choice',
    required: true,
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q6',
    text: '6. Fumez-vous lorsque vous êtes si malade que vous devez rester au lit presque toute la journée ?',
    type: 'single_choice',
    required: true,
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  }
];

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Get the dependence level based on total score
 */
export function getFagerstromSzDependenceLevel(score: number): FagerstromSzDependenceLevel {
  if (score <= 2) return 'aucune_tres_faible';
  if (score <= 4) return 'faible';
  if (score === 5) return 'moyenne';
  return 'forte';
}

/**
 * Get treatment guidance based on dependence level
 */
export function getFagerstromSzTreatmentGuidance(level: FagerstromSzDependenceLevel): string {
  return FAGERSTROM_SZ_THRESHOLDS[level].treatment;
}

/**
 * Get dependence level label
 */
export function getFagerstromSzDependenceLevelLabel(level: FagerstromSzDependenceLevel): string {
  return FAGERSTROM_SZ_THRESHOLDS[level].label;
}

/**
 * Compute all Fagerstrom scores including HSI
 */
export function computeFagerstromSzScores(responses: Record<string, any>): FagerstromSzScoreResult {
  const q1 = typeof responses.q1 === 'number' ? responses.q1 : 0;
  const q2 = typeof responses.q2 === 'number' ? responses.q2 : 0;
  const q3 = typeof responses.q3 === 'number' ? responses.q3 : 0;
  const q4 = typeof responses.q4 === 'number' ? responses.q4 : 0;
  const q5 = typeof responses.q5 === 'number' ? responses.q5 : 0;
  const q6 = typeof responses.q6 === 'number' ? responses.q6 : 0;

  // Total score (0-10)
  const total_score = q1 + q2 + q3 + q4 + q5 + q6;

  // HSI - Heaviness of Smoking Index (0-6)
  // Most predictive items: Q1 (time to first cigarette) + Q4 (cigarettes per day)
  const hsi_score = q1 + q4;

  // Get dependence level and treatment
  const dependence_level = getFagerstromSzDependenceLevel(total_score);
  const treatment_guidance = getFagerstromSzTreatmentGuidance(dependence_level);

  // Generate interpretation
  const interpretation = interpretFagerstromSzScore(total_score, hsi_score, {
    q1, q2, q3, q4, q5, q6
  });

  return {
    total_score,
    hsi_score,
    dependence_level,
    treatment_guidance,
    interpretation
  };
}

/**
 * Generate detailed interpretation text
 */
export function interpretFagerstromSzScore(
  totalScore: number,
  hsiScore: number,
  responses?: { q1: number; q2: number; q3: number; q4: number; q5: number; q6: number }
): string {
  const level = getFagerstromSzDependenceLevel(totalScore);
  const levelLabel = getFagerstromSzDependenceLevelLabel(level);
  const treatment = getFagerstromSzTreatmentGuidance(level);

  let interpretation = `Score FTND: ${totalScore}/10. ${levelLabel}.`;
  interpretation += ` Score HSI (indice de sévérité): ${hsiScore}/6.`;

  // Add treatment guidance
  interpretation += ` Traitement suggéré: ${treatment}.`;

  // Add specific item interpretations if responses are provided
  if (responses) {
    const details: string[] = [];

    // Q1 - Time to first cigarette (most predictive)
    if (responses.q1 >= 2) {
      details.push('cigarette matinale précoce (indicateur de forte dépendance physique)');
    }

    // Q3 - First cigarette hardest to give up
    if (responses.q3 === 1) {
      details.push('première cigarette difficilement remplaçable');
    }

    // Q4 - Heavy smoking (most predictive)
    if (responses.q4 >= 2) {
      details.push(`consommation importante (${responses.q4 === 2 ? '21-30' : '>30'} cigarettes/jour)`);
    }

    // Q5 - Morning heavier smoking
    if (responses.q5 === 1) {
      details.push('rythme plus soutenu le matin');
    }

    if (details.length > 0) {
      interpretation += ` Éléments notables: ${details.join(', ')}.`;
    }
  }

  // Add HSI interpretation
  if (hsiScore >= 4) {
    interpretation += ' Le score HSI élevé indique une dépendance physique importante nécessitant une substitution nicotinique adaptée.';
  }

  return interpretation;
}

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const FAGERSTROM_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'fagerstrom_sz',
  code: 'FAGERSTROM_SZ',
  title: 'FTND - Test de Fagerström',
  description: 'Test de Fagerström pour la dépendance à la nicotine. 6 items, score total 0-10, HSI 0-6.',
  questions: FAGERSTROM_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'patient',
    reference: 'Heatherton TF, Kozlowski LT, Frecker RC, Fagerström KO. The Fagerström Test for Nicotine Dependence: a revision of the Fagerström Tolerance Questionnaire. Br J Addict. 1991;86(9):1119-1127.'
  }
};
