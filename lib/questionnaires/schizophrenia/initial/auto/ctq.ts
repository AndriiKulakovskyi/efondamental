// ============================================================================
// eFondaMental Platform - Schizophrenia Initial Evaluation
// CTQ (Childhood Trauma Questionnaire) - Short Form (CTQ-SF)
// Bernstein & Fink, 1998
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching schizophrenia_ctq table schema
// ============================================================================

export interface SchizophreniaCtqResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Administration status
  questionnaire_done?: string | null; // 'Fait' | 'Non fait'
  
  // Raw question responses (1-5 scale, stored as raw values)
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
  q19?: number | null;
  q20?: number | null;
  q21?: number | null;
  q22?: number | null;
  q23?: number | null;
  q24?: number | null;
  q25?: number | null;
  q26?: number | null;
  q27?: number | null;
  q28?: number | null;
  
  // Computed subscale scores (5-25 range) - matching bipolar CTQ naming convention
  emotional_abuse_score?: number | null;
  physical_abuse_score?: number | null;
  sexual_abuse_score?: number | null;
  emotional_neglect_score?: number | null;
  physical_neglect_score?: number | null;
  
  // Severity levels for each subscale
  emotional_abuse_severity?: string | null;
  physical_abuse_severity?: string | null;
  sexual_abuse_severity?: string | null;
  emotional_neglect_severity?: string | null;
  physical_neglect_severity?: string | null;
  
  // Denial/Minimization scale (3-15 range, sum of Q10+Q16+Q22)
  denial_score?: number | null;
  minimization_score?: number | null;
  
  // Total score (25-125)
  total_score?: number | null;
  interpretation?: string | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaCtqResponseInsert = Omit<
  SchizophreniaCtqResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'emotional_abuse_score' | 'physical_abuse_score' | 'sexual_abuse_score' |
  'emotional_neglect_score' | 'physical_neglect_score' |
  'emotional_abuse_severity' | 'physical_abuse_severity' | 'sexual_abuse_severity' |
  'emotional_neglect_severity' | 'physical_neglect_severity' |
  'denial_score' | 'minimization_score' | 'total_score' | 'interpretation'
>;

// ============================================================================
// Subscale Mapping
// ============================================================================

// Items that need to be reversed during scoring (6 - value)
export const CTQ_REVERSE_ITEMS = [2, 5, 7, 13, 19, 26, 28];

// Subscale item mappings
export const CTQ_SUBSCALES = {
  emotional_abuse: [3, 8, 14, 18, 25],
  physical_abuse: [9, 11, 12, 15, 17],
  sexual_abuse: [20, 21, 23, 24, 27],
  emotional_neglect: [5, 7, 13, 19, 28],
  physical_neglect: [1, 2, 4, 6, 26],
  denial: [10, 16, 22]
} as const;

// Severity thresholds for each subscale (based on CTQ clinical guidelines)
// Emotional Abuse: 5-8 absent, 9-12 low, 13-15 moderate, ≥16 severe
// Physical Abuse: 5-7 absent, 8-9 low, 10-12 moderate, ≥13 severe
// Sexual Abuse: 5 absent, 6-7 low, 8-12 moderate, ≥13 severe
// Emotional Neglect: 5-9 absent, 10-14 low, 15-17 moderate, ≥18 severe
// Physical Neglect: 5-7 absent, 8-9 low, 10-12 moderate, ≥13 severe
export const CTQ_SEVERITY_THRESHOLDS = {
  emotional_abuse: { none: 8, low: 12, moderate: 15, severe: 16 },
  physical_abuse: { none: 7, low: 9, moderate: 12, severe: 13 },
  sexual_abuse: { none: 5, low: 7, moderate: 12, severe: 13 },
  emotional_neglect: { none: 9, low: 14, moderate: 17, severe: 18 },
  physical_neglect: { none: 7, low: 9, moderate: 12, severe: 13 }
} as const;

// ============================================================================
// Scoring Functions
// ============================================================================

export interface CtqScoreResult {
  emotional_abuse_score: number;
  physical_abuse_score: number;
  sexual_abuse_score: number;
  emotional_neglect_score: number;
  physical_neglect_score: number;
  denial_score: number;
  minimization_score: number;
  total_score: number;
  emotional_abuse_severity: string;
  physical_abuse_severity: string;
  sexual_abuse_severity: string;
  emotional_neglect_severity: string;
  physical_neglect_severity: string;
  interpretation: string;
}

/**
 * Get the adjusted value for an item (reverse scoring applied if needed)
 * Reverse items: 6 - value (so "Jamais"=1 becomes 5, "Très souvent"=5 becomes 1)
 */
function getAdjustedValue(responses: Record<string, any>, itemNum: number): number {
  const key = `q${itemNum}`;
  const value = responses[key] as number | null | undefined;
  if (value === null || value === undefined) return 0;
  return CTQ_REVERSE_ITEMS.includes(itemNum) ? (6 - value) : value;
}

/**
 * Get raw value for an item (no reverse scoring)
 */
function getRawValue(responses: Record<string, any>, itemNum: number): number {
  const key = `q${itemNum}`;
  const value = responses[key] as number | null | undefined;
  return value ?? 0;
}

/**
 * Calculate subscale score
 */
function calculateSubscaleScore(responses: Record<string, any>, items: readonly number[]): number {
  return items.reduce((sum, item) => sum + getAdjustedValue(responses, item), 0);
}

/**
 * Determine severity level for a subscale score
 */
export function interpretCtqSubscale(subscale: keyof typeof CTQ_SEVERITY_THRESHOLDS, score: number): string {
  const thresholds = CTQ_SEVERITY_THRESHOLDS[subscale];
  if (score <= thresholds.none) return 'no_trauma';
  if (score <= thresholds.low) return 'low';
  if (score <= thresholds.moderate) return 'moderate';
  return 'severe';
}

/**
 * Get severity label in French
 */
export function getSeverityLabel(severity: string): string {
  switch (severity) {
    case 'no_trauma': return 'Absent/Minimal';
    case 'low': return 'Faible à modéré';
    case 'moderate': return 'Modéré à sévère';
    case 'severe': return 'Sévère à extrême';
    default: return severity;
  }
}

/**
 * Compute all CTQ scores from responses
 */
export function computeCtqScores(responses: Record<string, any>): CtqScoreResult {
  // Calculate subscale scores (with reverse scoring applied)
  const emotionalAbuse = calculateSubscaleScore(responses, CTQ_SUBSCALES.emotional_abuse);
  const physicalAbuse = calculateSubscaleScore(responses, CTQ_SUBSCALES.physical_abuse);
  const sexualAbuse = calculateSubscaleScore(responses, CTQ_SUBSCALES.sexual_abuse);
  const emotionalNeglect = calculateSubscaleScore(responses, CTQ_SUBSCALES.emotional_neglect);
  const physicalNeglect = calculateSubscaleScore(responses, CTQ_SUBSCALES.physical_neglect);
  
  // Denial/minimization score (items 10, 16, 22 - NOT reversed, raw sum)
  const denialScore = CTQ_SUBSCALES.denial.reduce((sum, item) => sum + getRawValue(responses, item), 0);
  
  // Calculate severities
  const emotionalAbuseSeverity = interpretCtqSubscale('emotional_abuse', emotionalAbuse);
  const physicalAbuseSeverity = interpretCtqSubscale('physical_abuse', physicalAbuse);
  const sexualAbuseSeverity = interpretCtqSubscale('sexual_abuse', sexualAbuse);
  const emotionalNeglectSeverity = interpretCtqSubscale('emotional_neglect', emotionalNeglect);
  const physicalNeglectSeverity = interpretCtqSubscale('physical_neglect', physicalNeglect);
  
  // Total score (sum of all 5 clinical subscales, excluding denial)
  const totalScore = emotionalAbuse + physicalAbuse + sexualAbuse + emotionalNeglect + physicalNeglect;
  
  // Build interpretation string
  const interpretationParts: string[] = [];
  
  if (emotionalAbuseSeverity !== 'no_trauma') {
    interpretationParts.push(`Abus émotionnel: ${getSeverityLabel(emotionalAbuseSeverity)}`);
  }
  if (physicalAbuseSeverity !== 'no_trauma') {
    interpretationParts.push(`Abus physique: ${getSeverityLabel(physicalAbuseSeverity)}`);
  }
  if (sexualAbuseSeverity !== 'no_trauma') {
    interpretationParts.push(`Abus sexuel: ${getSeverityLabel(sexualAbuseSeverity)}`);
  }
  if (emotionalNeglectSeverity !== 'no_trauma') {
    interpretationParts.push(`Négligence émotionnelle: ${getSeverityLabel(emotionalNeglectSeverity)}`);
  }
  if (physicalNeglectSeverity !== 'no_trauma') {
    interpretationParts.push(`Négligence physique: ${getSeverityLabel(physicalNeglectSeverity)}`);
  }
  
  // Check for minimization (denial score >= 6 suggests underreporting)
  if (denialScore >= 6) {
    interpretationParts.push('Attention: Score de minimisation élevé - possible sous-déclaration des traumatismes');
  }
  
  const interpretation = interpretationParts.length > 0 
    ? interpretationParts.join('. ') 
    : 'Aucun traumatisme significatif rapporté';
  
  return {
    emotional_abuse_score: emotionalAbuse,
    physical_abuse_score: physicalAbuse,
    sexual_abuse_score: sexualAbuse,
    emotional_neglect_score: emotionalNeglect,
    physical_neglect_score: physicalNeglect,
    denial_score: denialScore,
    minimization_score: denialScore,
    total_score: totalScore,
    emotional_abuse_severity: emotionalAbuseSeverity,
    physical_abuse_severity: physicalAbuseSeverity,
    sexual_abuse_severity: sexualAbuseSeverity,
    emotional_neglect_severity: emotionalNeglectSeverity,
    physical_neglect_severity: physicalNeglectSeverity,
    interpretation
  };
}

// ============================================================================
// Helper Constants for Options
// ============================================================================

// Standard Likert options (all items use same scale, reverse scoring done during calculation)
const CTQ_LIKERT_OPTIONS = [
  { code: 1, label: 'Jamais' },
  { code: 2, label: 'Rarement' },
  { code: 3, label: 'Quelquefois' },
  { code: 4, label: 'Souvent' },
  { code: 5, label: 'Très souvent' },
];

const QUESTIONNAIRE_DONE_OPTIONS = [
  { code: 'Fait', label: 'Fait' },
  { code: 'Non fait', label: 'Non fait' },
];

// ============================================================================
// Questions Array
// ============================================================================

export const CTQ_QUESTIONS: Question[] = [
  // Administration status
  {
    id: 'questionnaire_done',
    text: 'Passation du questionnaire',
    type: 'single_choice',
    required: true,
    options: QUESTIONNAIRE_DONE_OPTIONS,
  },
  // Instructions
  {
    id: 'instruction_consigne',
    text: "Ce questionnaire porte sur certaines expériences que vous auriez pu vivre au cours de votre enfance ou de votre adolescence. Pour chaque affirmation, cochez la case qui convient le mieux. Bien que certaines questions concernent des sujets intimes et personnels, il est important de répondre complètement et aussi honnêtement que possible.",
    type: 'instruction',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'instruction_titre',
    text: "Au cours de mon enfance et/ou de mon adolescence :",
    type: 'instruction',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q1 - Physical Neglect
  {
    id: 'q1',
    text: "1. Il m'est arrivé de ne pas avoir assez à manger",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q2 - Physical Neglect (REVERSE - scoring calculated during computation)
  {
    id: 'q2',
    text: "2. Je savais qu'il y avait quelqu'un pour prendre soin de moi et me protéger",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Question à score inversé lors du calcul',
  },
  
  // Q3 - Emotional Abuse
  {
    id: 'q3',
    text: "3. Des membres de ma famille me disaient que j'étais « stupide » ou « paresseux » ou « laid »",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q4 - Physical Neglect
  {
    id: 'q4',
    text: "4. Mes parents étaient trop saouls ou « pétés » pour s'occuper de la famille",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q5 - Emotional Neglect (REVERSE)
  {
    id: 'q5',
    text: "5. Il y avait quelqu'un dans ma famille qui m'aidait à sentir que j'étais important ou particulier",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Question à score inversé lors du calcul',
  },
  
  // Q6 - Physical Neglect
  {
    id: 'q6',
    text: "6. Je devais porter des vêtements sales",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q7 - Emotional Neglect (REVERSE)
  {
    id: 'q7',
    text: "7. Je me sentais aimé(e)",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Question à score inversé lors du calcul',
  },
  
  // Q8 - Emotional Abuse
  {
    id: 'q8',
    text: "8. Je pensais que mes parents n'avaient pas souhaité ma naissance",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q9 - Physical Abuse
  {
    id: 'q9',
    text: "9. J'ai été frappé(e) si fort par un membre de ma famille que j'ai dû consulter un docteur ou aller à l'hôpital",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q10 - Minimization/Denial
  {
    id: 'q10',
    text: "10. Je n'aurais rien voulu changer à ma famille",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Item de déni/minimisation',
  },
  
  // Q11 - Physical Abuse
  {
    id: 'q11',
    text: "11. Un membre de ma famille m'a frappé(e) si fort que j'ai eu des bleus ou des marques",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q12 - Physical Abuse
  {
    id: 'q12',
    text: "12. J'étais puni(e) au moyen d'une ceinture, d'un bâton, d'une corde ou de quelque autre objet dur",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q13 - Emotional Neglect (REVERSE)
  {
    id: 'q13',
    text: "13. Les membres de ma famille étaient attentifs les uns aux autres",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Question à score inversé lors du calcul',
  },
  
  // Q14 - Emotional Abuse
  {
    id: 'q14',
    text: "14. Les membres de ma famille me disaient des choses blessantes ou insultantes",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q15 - Physical Abuse
  {
    id: 'q15',
    text: "15. Je pense que j'ai été physiquement maltraité(e)",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q16 - Minimization/Denial
  {
    id: 'q16',
    text: "16. J'ai eu une enfance parfaite",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Item de déni/minimisation',
  },
  
  // Q17 - Physical Abuse
  {
    id: 'q17',
    text: "17. J'ai été frappé(e) ou battu(e) si fort que quelqu'un l'a remarqué (par ex. un professeur, un voisin ou un docteur)",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q18 - Emotional Abuse
  {
    id: 'q18',
    text: "18. J'avais le sentiment que quelqu'un dans ma famille me détestait",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q19 - Emotional Neglect (REVERSE)
  {
    id: 'q19',
    text: "19. Les membres de ma famille se sentaient proches les uns des autres",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Question à score inversé lors du calcul',
  },
  
  // Q20 - Sexual Abuse
  {
    id: 'q20',
    text: "20. Quelqu'un a essayé de me faire des attouchements sexuels ou de m'en faire faire",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q21 - Sexual Abuse
  {
    id: 'q21',
    text: "21. Quelqu'un a menacé de me blesser ou de raconter des mensonges à mon sujet si je ne faisais pas quelque chose de nature sexuelle avec lui",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q22 - Minimization/Denial
  {
    id: 'q22',
    text: "22. J'avais la meilleure famille du monde",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Item de déni/minimisation',
  },
  
  // Q23 - Sexual Abuse
  {
    id: 'q23',
    text: "23. Quelqu'un a essayé de me faire faire des actes sexuels ou de me faire regarder de tels actes",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q24 - Sexual Abuse
  {
    id: 'q24',
    text: "24. J'ai été victime d'abus sexuels",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q25 - Emotional Abuse
  {
    id: 'q25',
    text: "25. Je pense que j'ai été maltraité affectivement",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q26 - Physical Neglect (REVERSE)
  {
    id: 'q26',
    text: "26. Il y avait quelqu'un pour m'emmener chez le docteur si j'en avais besoin",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Question à score inversé lors du calcul',
  },
  
  // Q27 - Sexual Abuse
  {
    id: 'q27',
    text: "27. Je pense qu'on a abusé de moi sexuellement",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q28 - Emotional Neglect (REVERSE)
  {
    id: 'q28',
    text: "28. Ma famille était une source de force et de soutien",
    type: 'single_choice',
    required: false,
    options: CTQ_LIKERT_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    help_text: 'Question à score inversé lors du calcul',
  },
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const CTQ_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'ctq_sz',
  code: 'CTQ',
  title: 'Traumatismes de l\'enfance (CTQ)',
  description: "Le CTQ (Childhood Trauma Questionnaire) est un questionnaire d'auto-évaluation rétrospectif qui mesure les expériences de maltraitance et de négligence vécues pendant l'enfance. Il comprend 28 items évaluant 5 types de traumatismes infantiles et une échelle de déni/minimisation.",
  questions: CTQ_QUESTIONS,
  metadata: {
    pathologies: ['schizophrenia'],
    target_role: 'patient',
    instructions: "Ce questionnaire porte sur certaines expériences que vous auriez pu vivre au cours de votre enfance ou de votre adolescence.",
    reverse_items: CTQ_REVERSE_ITEMS,
    subscales: CTQ_SUBSCALES
  }
};
