// ============================================================================
// eFondaMental Platform - DACOBS (Davos Assessment of Cognitive Biases Scale)
// French Version - Livet et al., 2022
// Schizophrenia Initial Evaluation - Neuropsy Module
// Self-report questionnaire assessing cognitive biases, limitations, and safety behaviors.
// ============================================================================

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaDacobsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // 42 item scores (1-7 each)
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  q5: number | null;
  q6: number | null;
  q7: number | null;
  q8: number | null;
  q9: number | null;
  q10: number | null;
  q11: number | null;
  q12: number | null;
  q13: number | null;
  q14: number | null;
  q15: number | null;
  q16: number | null;
  q17: number | null;
  q18: number | null;
  q19: number | null;
  q20: number | null;
  q21: number | null;
  q22: number | null;
  q23: number | null;
  q24: number | null;
  q25: number | null;
  q26: number | null;
  q27: number | null;
  q28: number | null;
  q29: number | null;
  q30: number | null;
  q31: number | null;
  q32: number | null;
  q33: number | null;
  q34: number | null;
  q35: number | null;
  q36: number | null;
  q37: number | null;
  q38: number | null;
  q39: number | null;
  q40: number | null;
  q41: number | null;
  q42: number | null;
  
  // 7 Subscale scores (6 items each, range 6-42)
  dacobs_jtc: number | null;  // Jumping to Conclusions
  dacobs_bi: number | null;   // Belief Inflexibility
  dacobs_at: number | null;   // Attention to Threat
  dacobs_ea: number | null;   // External Attribution
  dacobs_sc: number | null;   // Social Cognition Problems
  dacobs_cp: number | null;   // Subjective Cognitive Problems
  dacobs_sb: number | null;   // Safety Behaviors
  
  // 3 Section totals
  dacobs_cognitive_biases: number | null;      // JTC + BI + AT + EA (range 24-168)
  dacobs_cognitive_limitations: number | null; // SC + CP (range 12-84)
  dacobs_safety_behaviors: number | null;      // SB (range 6-42)
  
  // Total score
  dacobs_total: number | null; // Range 42-294
  
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaDacobsResponseInsert = Omit<
  SchizophreniaDacobsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'dacobs_jtc' | 'dacobs_bi' | 'dacobs_at' | 'dacobs_ea' |
  'dacobs_sc' | 'dacobs_cp' | 'dacobs_sb' |
  'dacobs_cognitive_biases' | 'dacobs_cognitive_limitations' | 'dacobs_safety_behaviors' |
  'dacobs_total'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Subscale Configuration
// ============================================================================

export const DACOBS_SUBSCALES = {
  jtc: {
    id: 'JTC',
    label: 'Saut aux conclusions',
    label_en: 'Jumping to Conclusions',
    items: [3, 8, 16, 18, 25, 30],
    section: 'cognitive_biases'
  },
  bi: {
    id: 'BI',
    label: "Biais d'inflexibilité des croyances",
    label_en: 'Belief Inflexibility',
    items: [13, 15, 26, 34, 38, 41],
    section: 'cognitive_biases'
  },
  at: {
    id: 'AT',
    label: "Biais d'attention à la menace",
    label_en: 'Attention to Threat',
    items: [1, 2, 6, 10, 20, 37],
    section: 'cognitive_biases'
  },
  ea: {
    id: 'EA',
    label: "Biais d'attribution externe",
    label_en: 'External Attribution',
    items: [7, 12, 17, 22, 24, 29],
    section: 'cognitive_biases'
  },
  sc: {
    id: 'SC',
    label: 'Problèmes sociaux cognitifs',
    label_en: 'Social Cognition Problems',
    items: [4, 9, 11, 14, 19, 39],
    section: 'cognitive_limitations'
  },
  cp: {
    id: 'CP',
    label: 'Problèmes cognitifs subjectifs',
    label_en: 'Subjective Cognitive Problems',
    items: [5, 21, 28, 32, 36, 40],
    section: 'cognitive_limitations'
  },
  sb: {
    id: 'SB',
    label: 'Comportements de sûreté',
    label_en: 'Safety Behaviors',
    items: [23, 27, 31, 33, 35, 42],
    section: 'safety_behaviors'
  }
};

export const DACOBS_SECTIONS = {
  cognitive_biases: {
    id: 'SEC_COGNITIVE_BIASES',
    label: 'Biais cognitifs',
    label_en: 'Cognitive Biases',
    subscales: ['jtc', 'bi', 'at', 'ea'],
    itemCount: 24,
    range: { min: 24, max: 168 }
  },
  cognitive_limitations: {
    id: 'SEC_COGNITIVE_LIMITATIONS',
    label: 'Limitations cognitives',
    label_en: 'Cognitive Limitations',
    subscales: ['sc', 'cp'],
    itemCount: 12,
    range: { min: 12, max: 84 }
  },
  safety_behaviors: {
    id: 'SEC_SAFETY_BEHAVIORS',
    label: 'Comportements de sûreté',
    label_en: 'Safety Behaviors',
    subscales: ['sb'],
    itemCount: 6,
    range: { min: 6, max: 42 }
  }
};

// ============================================================================
// Likert Scale Options
// ============================================================================

export const DACOBS_LIKERT_OPTIONS = [
  { code: 1, label: 'Fortement en désaccord', score: 1 },
  { code: 2, label: "Pas d'accord", score: 2 },
  { code: 3, label: 'Légèrement en désaccord', score: 3 },
  { code: 4, label: 'Indécis', score: 4 },
  { code: 5, label: "Légèrement d'accord", score: 5 },
  { code: 6, label: "D'accord", score: 6 },
  { code: 7, label: "Fortement d'accord", score: 7 }
];

// ============================================================================
// Scoring Functions
// ============================================================================

export interface DacobsScoreResult {
  // Subscale scores
  dacobs_jtc: number;
  dacobs_bi: number;
  dacobs_at: number;
  dacobs_ea: number;
  dacobs_sc: number;
  dacobs_cp: number;
  dacobs_sb: number;
  
  // Section totals
  dacobs_cognitive_biases: number;
  dacobs_cognitive_limitations: number;
  dacobs_safety_behaviors: number;
  
  // Total
  dacobs_total: number;
}

/**
 * Calculate all DACOBS scores
 * @param responses Object containing q1-q42 values (1-7 each)
 * @returns Subscale scores, section totals, and total score
 */
export function computeDacobsScores(responses: Record<string, any>): DacobsScoreResult {
  // Helper to safely get item value (default to 1 if missing, which is the minimum)
  const getItemValue = (itemNum: number): number => {
    const value = responses[`q${itemNum}`];
    return typeof value === 'number' ? value : 1;
  };
  
  // Calculate subscale scores
  const dacobs_jtc = DACOBS_SUBSCALES.jtc.items.reduce(
    (sum: number, item) => sum + getItemValue(item), 0
  );
  const dacobs_bi = DACOBS_SUBSCALES.bi.items.reduce(
    (sum: number, item) => sum + getItemValue(item), 0
  );
  const dacobs_at = DACOBS_SUBSCALES.at.items.reduce(
    (sum: number, item) => sum + getItemValue(item), 0
  );
  const dacobs_ea = DACOBS_SUBSCALES.ea.items.reduce(
    (sum: number, item) => sum + getItemValue(item), 0
  );
  const dacobs_sc = DACOBS_SUBSCALES.sc.items.reduce(
    (sum: number, item) => sum + getItemValue(item), 0
  );
  const dacobs_cp = DACOBS_SUBSCALES.cp.items.reduce(
    (sum: number, item) => sum + getItemValue(item), 0
  );
  const dacobs_sb = DACOBS_SUBSCALES.sb.items.reduce(
    (sum: number, item) => sum + getItemValue(item), 0
  );
  
  // Calculate section totals
  const dacobs_cognitive_biases = dacobs_jtc + dacobs_bi + dacobs_at + dacobs_ea;
  const dacobs_cognitive_limitations = dacobs_sc + dacobs_cp;
  const dacobs_safety_behaviors = dacobs_sb;
  
  // Calculate total score
  const dacobs_total = dacobs_cognitive_biases + dacobs_cognitive_limitations + dacobs_safety_behaviors;
  
  return {
    dacobs_jtc,
    dacobs_bi,
    dacobs_at,
    dacobs_ea,
    dacobs_sc,
    dacobs_cp,
    dacobs_sb,
    dacobs_cognitive_biases,
    dacobs_cognitive_limitations,
    dacobs_safety_behaviors,
    dacobs_total
  };
}

/**
 * Interpret DACOBS total score
 * Higher scores indicate more cognitive biases and safety behaviors
 */
export function interpretDacobsScore(totalScore: number): string {
  // Score range is 42-294 (42 items × 1-7)
  // Middle point is 168 (42 items × 4)
  const percentage = ((totalScore - 42) / (294 - 42)) * 100;
  
  if (percentage <= 25) {
    return 'Biais cognitifs et comportements de sûreté faibles';
  } else if (percentage <= 50) {
    return 'Biais cognitifs et comportements de sûreté modérés';
  } else if (percentage <= 75) {
    return 'Biais cognitifs et comportements de sûreté élevés';
  } else {
    return 'Biais cognitifs et comportements de sûreté très élevés';
  }
}

// ============================================================================
// Question Definitions
// ============================================================================

const DACOBS_ITEMS = [
  { id: 'q1', item_number: 1, section: "Biais d'attention à la menace", text: "Je suis à l'affût du danger" },
  { id: 'q2', item_number: 2, section: "Biais d'attention à la menace", text: "Quand les choses tournent mal, c'est que quelqu'un est derrière cela" },
  { id: 'q3', item_number: 3, section: 'Saut aux conclusions', text: "Je n'ai pas besoin de longtemps pour arriver à une conclusion" },
  { id: 'q4', item_number: 4, section: 'Problèmes sociaux cognitifs', text: "Les gens me rendent confus" },
  { id: 'q5', item_number: 5, section: 'Problèmes cognitifs subjectifs', text: "Mes pensées se désagrègent dans mon esprit" },
  { id: 'q6', item_number: 6, section: "Biais d'attention à la menace", text: "On ne peut pas faire confiance aux gens" },
  { id: 'q7', item_number: 7, section: "Biais d'attribution externe", text: "Les choses ont mal tourné dans ma vie à cause des autres" },
  { id: 'q8', item_number: 8, section: 'Saut aux conclusions', text: "Souvent, la bonne conclusion surgit à mon esprit" },
  { id: 'q9', item_number: 9, section: 'Problèmes sociaux cognitifs', text: "Je ne suis souvent pas sûr de ce que les gens veulent dire" },
  { id: 'q10', item_number: 10, section: "Biais d'attention à la menace", text: "Je fais attention aux détails au lieu de l'ensemble" },
  { id: 'q11', item_number: 11, section: 'Problèmes sociaux cognitifs', text: "Des gens me surveillent" },
  { id: 'q12', item_number: 12, section: "Biais d'attribution externe", text: "Ce n'est pas ma faute quand les choses tournent mal dans ma vie" },
  { id: 'q13', item_number: 13, section: "Biais d'inflexibilité des croyances", text: "Je n'ai pas besoin de prendre en compte des alternatives pour prendre une décision" },
  { id: 'q14', item_number: 14, section: 'Problèmes sociaux cognitifs', text: "Les gens me surprennent avec leurs réactions" },
  { id: 'q15', item_number: 15, section: "Biais d'inflexibilité des croyances", text: "Quand j'ai un objectif, je ne sais pas comment l'atteindre" },
  { id: 'q16', item_number: 16, section: 'Saut aux conclusions', text: "Je trouve rapidement des preuves pour étayer mes croyances" },
  { id: 'q17', item_number: 17, section: "Biais d'attribution externe", text: "Les gens ne m'offrent pas l'opportunité de bien faire" },
  { id: 'q18', item_number: 18, section: 'Saut aux conclusions', text: "Je prends des décisions plus rapidement que les autres" },
  { id: 'q19', item_number: 19, section: 'Problèmes sociaux cognitifs', text: "Je ne comprends pas pourquoi les gens réagissent d'une certaine manière" },
  { id: 'q20', item_number: 20, section: "Biais d'attention à la menace", text: "Je m'assure que toutes les fenêtres sont verrouillées" },
  { id: 'q21', item_number: 21, section: 'Problèmes cognitifs subjectifs', text: "Lorsque j'essaie de me concentrer sur quelque chose, il est difficile d'ignorer les autres choses qui m'entourent" },
  { id: 'q22', item_number: 22, section: "Biais d'attribution externe", text: "Je ne change pas facilement ma façon de penser" },
  { id: 'q23', item_number: 23, section: 'Comportements de sûreté', text: "Je ne vais pas au restaurant car ce n'est pas un endroit sûr/sécuritaire" },
  { id: 'q24', item_number: 24, section: "Biais d'attribution externe", text: "Les gens rendent ma vie misérable" },
  { id: 'q25', item_number: 25, section: 'Saut aux conclusions', text: "Les premières pensées sont les bonnes" },
  { id: 'q26', item_number: 26, section: "Biais d'inflexibilité des croyances", text: "Il est difficile de savoir ce que les autres ressentent en fonction de leurs expressions faciales" },
  { id: 'q27', item_number: 27, section: 'Comportements de sûreté', text: "Je ne sors pas après la tombée de la nuit" },
  { id: 'q28', item_number: 28, section: 'Problèmes cognitifs subjectifs', text: "Je suis facilement distrait par des informations non pertinentes" },
  { id: 'q29', item_number: 29, section: "Biais d'attribution externe", text: "Les gens me traitent mal sans raison" },
  { id: 'q30', item_number: 30, section: 'Saut aux conclusions', text: "Je n'ai pas besoin d'évaluer tous les faits pour tirer une conclusion" },
  { id: 'q31', item_number: 31, section: 'Comportements de sûreté', text: "Je m'assoie toujours près de la sortie pour être en sécurité" },
  { id: 'q32', item_number: 32, section: 'Problèmes cognitifs subjectifs', text: "Je ne suis pas capable de me concentrer sur une tâche" },
  { id: 'q33', item_number: 33, section: 'Comportements de sûreté', text: "Les gens que je ne connais pas sont dangereux" },
  { id: 'q34', item_number: 34, section: "Biais d'inflexibilité des croyances", text: "Il n'y a généralement qu'une seule explication à un événement" },
  { id: 'q35', item_number: 35, section: 'Comportements de sûreté', text: "Je ne réponds pas aux appels téléphoniques par mesure de sécurité" },
  { id: 'q36', item_number: 36, section: 'Problèmes cognitifs subjectifs', text: "Je ne vois pas automatiquement comment les choses sont reliées entre elles" },
  { id: 'q37', item_number: 37, section: "Biais d'attention à la menace", text: "Pour me protéger, je reste sur mes gardes" },
  { id: 'q38', item_number: 38, section: "Biais d'inflexibilité des croyances", text: "Je n'ai pas besoin de chercher d'informations supplémentaires pour prendre une décision" },
  { id: 'q39', item_number: 39, section: 'Problèmes sociaux cognitifs', text: "Quand j'entends les gens rire, je pense qu'ils rient de moi" },
  { id: 'q40', item_number: 40, section: 'Problèmes cognitifs subjectifs', text: "Il est difficile de garder une idée en tête" },
  { id: 'q41', item_number: 41, section: "Biais d'inflexibilité des croyances", text: "Je ne prends pas en compte les informations susceptibles de contredire mes croyances" },
  { id: 'q42', item_number: 42, section: 'Comportements de sûreté', text: "Je ne vais pas dans les centres commerciaux car ce n'est pas sûr/sécuritaire" }
];

// ============================================================================
// Questions Array for Renderer
// ============================================================================

export const DACOBS_SZ_QUESTIONS: Question[] = [
  // Instructions
  {
    id: 'instructions_header',
    section: 'Instructions',
    text: "Ce questionnaire évalue différents aspects de votre façon de penser et de vous comporter. Pour chaque énoncé, indiquez dans quelle mesure vous êtes d'accord ou en désaccord sur une échelle de 1 (Fortement en désaccord) à 7 (Fortement d'accord). Il n'y a pas de bonnes ou de mauvaises réponses.",
    type: 'instruction',
    required: false,
  },
  
  // Generate all 42 item questions
  ...DACOBS_ITEMS.map((item) => ({
    id: item.id,
    section: item.section,
    text: `${item.item_number}. ${item.text}`,
    type: 'single_choice' as const,
    required: true,
    options: DACOBS_LIKERT_OPTIONS.map(opt => ({
      code: opt.code,
      label: opt.label,
      score: opt.score
    })),
  })),
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
    reference?: string;
    [key: string]: unknown;
  };
}

export const DACOBS_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'dacobs_sz',
  code: 'DACOBS_SZ',
  title: 'DACOBS - Davos Assessment of Cognitive Biases Scale',
  description: "Auto-questionnaire évaluant les biais cognitifs, les limitations cognitives et les comportements de sûreté à travers 42 items sur une échelle de Likert en 7 points.",
  instructions: "Pour chaque énoncé, indiquez dans quelle mesure vous êtes d'accord ou en désaccord sur une échelle de 1 (Fortement en désaccord) à 7 (Fortement d'accord).",
  questions: DACOBS_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'patient',
    reference: 'Livet, A., Pétrin-Pomerleau, P., Pocuca, N., Afzali, M. H., Potvin, S., & Conrod, P. J. (2022). French validation of the DACOBS.',
    scoringNote: 'Score total (42-294). Plus le score est élevé, plus les biais cognitifs et comportements de sûreté sont présents.',
    subscales: DACOBS_SUBSCALES,
    sections: DACOBS_SECTIONS
  },
};
