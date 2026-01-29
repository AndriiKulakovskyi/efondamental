// ============================================================================
// eFondaMental Platform - Schizophrenia Initial Evaluation
// S-QoL (Schizophrenia Quality of Life) Questionnaire
// Auquier et al., 2003
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching schizophrenia_sqol table schema
// ============================================================================

export interface SchizophreniaSqolResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Administration status
  questionnaire_done?: string | null; // 'Fait' | 'Non fait'
  
  // Raw question responses (0-4 scale)
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  q5?: number | null;
  q6?: number | null;
  q7?: number | null;
  q8?: number | null;
  q9?: number | null;
  q10?: number | null;
  q11?: number | null;
  q12?: number | null;
  q13?: number | null;
  q14?: number | null;
  q15?: number | null;
  q16?: number | null;
  q17?: number | null;
  q18?: number | null;
  
  // "Pas concerné(e)" flags
  q1_not_concerned?: boolean | null;
  q2_not_concerned?: boolean | null;
  q3_not_concerned?: boolean | null;
  q4_not_concerned?: boolean | null;
  q5_not_concerned?: boolean | null;
  q6_not_concerned?: boolean | null;
  q7_not_concerned?: boolean | null;
  q8_not_concerned?: boolean | null;
  q9_not_concerned?: boolean | null;
  q10_not_concerned?: boolean | null;
  q11_not_concerned?: boolean | null;
  q12_not_concerned?: boolean | null;
  q13_not_concerned?: boolean | null;
  q14_not_concerned?: boolean | null;
  q15_not_concerned?: boolean | null;
  q16_not_concerned?: boolean | null;
  q17_not_concerned?: boolean | null;
  q18_not_concerned?: boolean | null;
  
  // Computed subscale scores (0-100%)
  score_vie_sentimentale?: number | null;
  score_estime_de_soi?: number | null;
  score_relation_famille?: number | null;
  score_relation_amis?: number | null;
  score_autonomie?: number | null;
  score_bien_etre_psychologique?: number | null;
  score_bien_etre_physique?: number | null;
  score_resilience?: number | null;
  
  // Global score (mean of valid subscales)
  total_score?: number | null;
  interpretation?: string | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaSqolResponseInsert = Omit<
  SchizophreniaSqolResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 
  'score_vie_sentimentale' | 'score_estime_de_soi' | 'score_relation_famille' |
  'score_relation_amis' | 'score_autonomie' | 'score_bien_etre_psychologique' |
  'score_bien_etre_physique' | 'score_resilience' | 'total_score' | 'interpretation'
>;

// ============================================================================
// Subscale Mapping
// ============================================================================

export const SQOL_SUBSCALES = {
  vie_sentimentale: { label: 'Vie sentimentale', questions: ['q14', 'q15'] },
  estime_de_soi: { label: 'Estime de soi', questions: ['q1', 'q4'] },
  relation_famille: { label: 'Relation famille', questions: ['q10', 'q11'] },
  relation_amis: { label: 'Relation amis', questions: ['q12', 'q13'] },
  autonomie: { label: 'Autonomie', questions: ['q5', 'q6'] },
  bien_etre_psychologique: { label: 'Bien-être psychologique', questions: ['q16', 'q17', 'q18'] },
  bien_etre_physique: { label: 'Bien-être physique', questions: ['q8', 'q9'] },
  resilience: { label: 'Résilience', questions: ['q2', 'q3', 'q7'] },
} as const;

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Calculate a subscale score as percentage (0-100%)
 * Excludes items marked as "Pas concerné(e)"
 * Returns null if all items are excluded
 */
export function calculateSqolSubscaleScore(
  responses: Record<string, any>,
  questionIds: readonly string[]
): number | null {
  let sum = 0;
  let validCount = 0;
  
  for (const qId of questionIds) {
    const notConcerned = responses[`${qId}_not_concerned`];
    if (notConcerned === true) continue; // Skip excluded items
    
    const value = responses[qId];
    if (value !== null && value !== undefined && typeof value === 'number') {
      sum += value;
      validCount++;
    }
  }
  
  if (validCount === 0) return null; // All "Pas concerné"
  
  // Score = (sum / max_possible) * 100
  // Max per item = 4, so max_possible = validCount * 4
  const percentage = (sum / (validCount * 4)) * 100;
  return Math.round(percentage * 100) / 100; // Round to 2 decimal places
}

/**
 * Calculate all subscale scores
 */
export function calculateAllSqolSubscales(
  responses: Record<string, any>
): Record<string, number | null> {
  return {
    score_vie_sentimentale: calculateSqolSubscaleScore(responses, SQOL_SUBSCALES.vie_sentimentale.questions),
    score_estime_de_soi: calculateSqolSubscaleScore(responses, SQOL_SUBSCALES.estime_de_soi.questions),
    score_relation_famille: calculateSqolSubscaleScore(responses, SQOL_SUBSCALES.relation_famille.questions),
    score_relation_amis: calculateSqolSubscaleScore(responses, SQOL_SUBSCALES.relation_amis.questions),
    score_autonomie: calculateSqolSubscaleScore(responses, SQOL_SUBSCALES.autonomie.questions),
    score_bien_etre_psychologique: calculateSqolSubscaleScore(responses, SQOL_SUBSCALES.bien_etre_psychologique.questions),
    score_bien_etre_physique: calculateSqolSubscaleScore(responses, SQOL_SUBSCALES.bien_etre_physique.questions),
    score_resilience: calculateSqolSubscaleScore(responses, SQOL_SUBSCALES.resilience.questions),
  };
}

/**
 * Calculate global score as mean of valid subscale scores
 * Returns null if no valid subscales
 */
export function calculateSqolGlobalScore(
  subscaleScores: Record<string, number | null>
): number | null {
  const validScores = Object.values(subscaleScores).filter(
    (s): s is number => s !== null
  );
  
  if (validScores.length === 0) return null;
  
  const mean = validScores.reduce((a, b) => a + b, 0) / validScores.length;
  return Math.round(mean * 100) / 100; // Round to 2 decimal places
}

/**
 * Generate interpretation text
 */
export function interpretSqolScore(totalScore: number | null): string {
  if (totalScore === null) {
    return 'Score non calculable (questionnaire incomplet ou toutes les questions marquées "Pas concerné(e)")';
  }
  return `Score global de qualité de vie: ${totalScore}% (plus le score est élevé, meilleure est la qualité de vie)`;
}

// ============================================================================
// Helper Constants for Options
// ============================================================================

// Standard Likert options (Q1-Q15)
const SQOL_LIKERT_OPTIONS = [
  { code: 0, label: 'Beaucoup moins que souhaité' },
  { code: 1, label: 'Moins que souhaité' },
  { code: 2, label: 'Un peu moins que souhaité' },
  { code: 3, label: 'Autant que souhaité' },
  { code: 4, label: 'Plus que souhaité' },
];

// Inverted Likert options (Q16-Q18 - negative wording)
const SQOL_LIKERT_INVERTED_OPTIONS = [
  { code: 0, label: 'Beaucoup plus que prévu' },
  { code: 1, label: 'Plus que prévu' },
  { code: 2, label: 'Un peu plus que prévu' },
  { code: 3, label: 'Autant que prévu' },
  { code: 4, label: 'Moins que prévu' },
];

const QUESTIONNAIRE_DONE_OPTIONS = [
  { code: 'Fait', label: 'Fait' },
  { code: 'Non fait', label: 'Non fait' },
];

// ============================================================================
// Questions Array
// ============================================================================

export const SQOL_SZ_QUESTIONS: Question[] = [
  // Administration status
  {
    id: 'questionnaire_done',
    text: 'Passation du questionnaire',
    type: 'single_choice',
    required: true,
    options: QUESTIONNAIRE_DONE_OPTIONS,
  },
  {
    id: 'instruction_consigne',
    text: "Cochez pour chaque question la case qui correspond le plus à ce que vous ressentez actuellement. Si vous n'êtes pas concerné(e) par une question, cochez 'Pas concerné(e)'. Actuellement,...",
    type: 'instruction',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  // Q1 - Estime de soi
  {
    id: 'q1',
    text: "1. J'ai confiance en la vie",
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q1_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Q2 - Résilience
  {
    id: 'q2',
    text: '2. Je me bats pour réussir dans la vie',
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q2_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Q3 - Résilience
  {
    id: 'q3',
    text: "3. Je fais des projets professionnels et/ou personnels pour l'avenir",
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q3_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Q4 - Estime de soi
  {
    id: 'q4',
    text: '4. Je suis bien dans ma tête',
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q4_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Q5 - Autonomie
  {
    id: 'q5',
    text: '5. Je suis libre de prendre des décisions',
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q5_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Q6 - Autonomie
  {
    id: 'q6',
    text: "6. Je suis libre d'agir",
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q6_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Q7 - Résilience
  {
    id: 'q7',
    text: '7. Je fais des efforts pour travailler',
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q7_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Q8 - Bien-être physique
  {
    id: 'q8',
    text: '8. Je suis en bonne forme physique',
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q8_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Q9 - Bien-être physique
  {
    id: 'q9',
    text: "9. Je suis plein(e) d'énergie",
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q9_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Q10 - Relation famille
  {
    id: 'q10',
    text: '10. Je suis aidé(e) par ma famille',
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q10_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Q11 - Relation famille
  {
    id: 'q11',
    text: '11. Je suis écouté(e) par ma famille',
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q11_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Q12 - Relation amis
  {
    id: 'q12',
    text: '12. Je suis aidé(e) par mes amis (proches)',
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q12_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Q13 - Relation amis
  {
    id: 'q13',
    text: "13. J'ai des amis",
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q13_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Q14 - Vie sentimentale
  {
    id: 'q14',
    text: "14. J'ai une vie sentimentale satisfaisante",
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q14_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Q15 - Vie sentimentale
  {
    id: 'q15',
    text: '15. Je réalise mes projets familiaux, sentimentaux',
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q15_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Section for inverted questions
  {
    id: 'instruction_actuellement2',
    text: 'Actuellement,... (questions inversées)',
    type: 'instruction',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q16 - Bien-être psychologique (inversée)
  {
    id: 'q16',
    text: "16. J'ai des difficultés à me concentrer, à réfléchir",
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_INVERTED_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q16_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Q17 - Bien-être psychologique (inversée)
  {
    id: 'q17',
    text: '17. Je suis coupé(e) du monde extérieur',
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_INVERTED_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q17_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
  
  // Q18 - Bien-être psychologique (inversée)
  {
    id: 'q18',
    text: "18. J'ai du mal à exprimer ce que je ressens",
    type: 'single_choice',
    required: false,
    options: SQOL_LIKERT_INVERTED_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q18_not_concerned',
    text: 'Pas concerné(e)',
    type: 'boolean',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    indentLevel: 1,
  },
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const SQOL_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'sqol_sz',
  code: 'SQOL_SZ',
  title: 'Qualité de vie (S-QoL)',
  description: "Questionnaire d'auto-évaluation de la qualité de vie pour les personnes atteintes de schizophrénie (Auquier et al., 2003). Évalue 8 dimensions: vie sentimentale, estime de soi, relations familiales, relations amicales, autonomie, bien-être psychologique, bien-être physique et résilience.",
  questions: SQOL_SZ_QUESTIONS,
  // Note: Scoring is handled in the service layer (saveSqolResponse in schizophrenia-initial.service.ts)
  // The scoring functions calculateAllSqolSubscales, calculateSqolGlobalScore, and interpretSqolScore
  // are exported for use by the service layer.
};
