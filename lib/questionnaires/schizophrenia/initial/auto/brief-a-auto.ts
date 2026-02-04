// ============================================================================
// eFondaMental Platform - BRIEF-A (Behavior Rating Inventory of Executive Function - Adult)
// French Version - Roth RM, Isquith PK, Gioia GA
// Auto-Evaluation (Self-Report) - Éditions Hogrefe France (2015)
// Schizophrenia Initial Evaluation - Autoquestionnaires Module
// Patient self-report questionnaire assessing executive functions.
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaBriefAAutoResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // 75 item scores (1-3 each)
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
  q43: number | null;
  q44: number | null;
  q45: number | null;
  q46: number | null;
  q47: number | null;
  q48: number | null;
  q49: number | null;
  q50: number | null;
  q51: number | null;
  q52: number | null;
  q53: number | null;
  q54: number | null;
  q55: number | null;
  q56: number | null;
  q57: number | null;
  q58: number | null;
  q59: number | null;
  q60: number | null;
  q61: number | null;
  q62: number | null;
  q63: number | null;
  q64: number | null;
  q65: number | null;
  q66: number | null;
  q67: number | null;
  q68: number | null;
  q69: number | null;
  q70: number | null;
  q71: number | null;
  q72: number | null;
  q73: number | null;
  q74: number | null;
  q75: number | null;
  
  // 9 Clinical Scale scores (matching hetero naming convention)
  brief_a_inhibit: number | null;
  brief_a_shift: number | null;
  brief_a_emotional_control: number | null;
  brief_a_self_monitor: number | null;
  brief_a_initiate: number | null;
  brief_a_working_memory: number | null;
  brief_a_plan_organize: number | null;
  brief_a_task_monitor: number | null;
  brief_a_organization_materials: number | null;
  
  // 3 Composite Index scores
  brief_a_bri: number | null;  // Behavioral Regulation Index
  brief_a_mi: number | null;   // Metacognition Index
  brief_a_gec: number | null;  // Global Executive Composite
  
  // 2 Validity scales (no inconsistency for auto version)
  brief_a_negativity: number | null;
  brief_a_infrequency: number | null;
  
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaBriefAAutoResponseInsert = Omit<
  SchizophreniaBriefAAutoResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'brief_a_inhibit' | 'brief_a_shift' | 'brief_a_emotional_control' | 'brief_a_self_monitor' |
  'brief_a_initiate' | 'brief_a_working_memory' | 'brief_a_plan_organize' | 'brief_a_task_monitor' |
  'brief_a_organization_materials' | 'brief_a_bri' | 'brief_a_mi' | 'brief_a_gec' |
  'brief_a_negativity' | 'brief_a_infrequency'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Scale Configuration (from JSON scoring section)
// ============================================================================

export const BRIEF_A_AUTO_SCALES = {
  inhibit: {
    id: 'INHIBIT',
    label: 'Inhibition',
    label_en: 'Inhibit',
    items: [5, 16, 29, 36, 43, 55, 58, 73],
  },
  shift: {
    id: 'SHIFT',
    label: 'Flexibilité',
    label_en: 'Shift',
    items: [8, 22, 32, 44, 61, 67],
  },
  emotional_control: {
    id: 'EMOTIONAL_CONTROL',
    label: 'Contrôle émotionnel',
    label_en: 'Emotional Control',
    items: [1, 12, 19, 28, 33, 42, 51, 57, 69, 72],
  },
  self_monitor: {
    id: 'SELF_MONITOR',
    label: 'Auto-contrôle',
    label_en: 'Self-Monitor',
    items: [13, 23, 37, 50, 64, 70],
  },
  initiate: {
    id: 'INITIATE',
    label: 'Initiation',
    label_en: 'Initiate',
    items: [6, 14, 20, 25, 45, 49, 53, 62],
  },
  working_memory: {
    id: 'WORKING_MEMORY',
    label: 'Mémoire de travail',
    label_en: 'Working Memory',
    items: [4, 11, 17, 26, 35, 46, 56, 68],
  },
  plan_organize: {
    id: 'PLAN_ORGANIZE',
    label: 'Planification/Organisation',
    label_en: 'Plan/Organize',
    items: [9, 15, 21, 34, 39, 47, 54, 63, 66, 71],
  },
  task_monitor: {
    id: 'TASK_MONITOR',
    label: 'Contrôle de la tâche',
    label_en: 'Task Monitor',
    items: [2, 18, 24, 41, 52, 75],
  },
  organization_materials: {
    id: 'ORGANIZATION_MATERIALS',
    label: 'Organisation du matériel',
    label_en: 'Organization of Materials',
    items: [3, 7, 30, 31, 40, 60, 65, 74],
  }
};

export const BRIEF_A_AUTO_INDICES = {
  bri: {
    id: 'BRI',
    label: 'Indice de Régulation Comportementale',
    label_en: 'Behavioral Regulation Index',
    scales: ['inhibit', 'shift', 'emotional_control', 'self_monitor']
  },
  mi: {
    id: 'MI',
    label: 'Indice de Métacognition',
    label_en: 'Metacognition Index',
    scales: ['initiate', 'working_memory', 'plan_organize', 'task_monitor', 'organization_materials']
  },
  gec: {
    id: 'GEC',
    label: 'Score Exécutif Global',
    label_en: 'Global Executive Composite',
    scales: ['inhibit', 'shift', 'emotional_control', 'self_monitor', 'initiate', 'working_memory', 'plan_organize', 'task_monitor', 'organization_materials']
  }
};

export const BRIEF_A_AUTO_VALIDITY_SCALES = {
  negativity: {
    id: 'NEGATIVITY',
    label: 'Négativité',
    label_en: 'Negativity',
    targetItems: [1, 8, 19, 21, 22, 23, 29, 36, 39, 40],
  },
  infrequency: {
    id: 'INFREQUENCY',
    label: 'Rareté',
    label_en: 'Infrequency',
    rules: [
      { item: 10, condition: 'equals', value: 3 },
      { item: 27, condition: 'equals', value: 1 },
      { item: 38, condition: 'equals', value: 3 },
      { item: 48, condition: 'equals', value: 1 },
      { item: 59, condition: 'equals', value: 1 }
    ],
  }
};

// ============================================================================
// Likert Scale Options
// ============================================================================

export const BRIEF_A_AUTO_LIKERT_OPTIONS = [
  { code: 1, label: 'Jamais', score: 1 },
  { code: 2, label: 'Parfois', score: 2 },
  { code: 3, label: 'Souvent', score: 3 }
];

// ============================================================================
// Scoring Functions
// ============================================================================

export interface BriefAAutoScoreResult {
  // Scale scores (matching hetero naming convention)
  brief_a_inhibit: number;
  brief_a_shift: number;
  brief_a_emotional_control: number;
  brief_a_self_monitor: number;
  brief_a_initiate: number;
  brief_a_working_memory: number;
  brief_a_plan_organize: number;
  brief_a_task_monitor: number;
  brief_a_organization_materials: number;
  
  // Index scores
  brief_a_bri: number;
  brief_a_mi: number;
  brief_a_gec: number;
  
  // Validity scores
  brief_a_negativity: number;
  brief_a_infrequency: number;
}

/**
 * Calculate scale score by summing items
 * For auto-questionnaire, missing items are treated as 0 (not scored)
 */
function calculateAutoScaleScore(
  responses: Record<string, any>,
  items: number[]
): number {
  let sum = 0;
  
  for (const itemNum of items) {
    const value = responses[`q${itemNum}`];
    if (value !== null && value !== undefined) {
      sum += Number(value);
    }
  }
  
  return sum;
}

/**
 * Calculate Negativity validity score
 * Count of items scored 3 (Souvent) in the target item set
 */
function calculateAutoNegativity(responses: Record<string, any>): number {
  const targetItems = BRIEF_A_AUTO_VALIDITY_SCALES.negativity.targetItems;
  let count = 0;
  
  for (const itemNum of targetItems) {
    const value = responses[`q${itemNum}`];
    if (value === 3) {
      count++;
    }
  }
  
  return count;
}

/**
 * Calculate Infrequency validity score
 * Sum of binary flags based on specific item responses
 */
function calculateAutoInfrequency(responses: Record<string, any>): number {
  const rules = BRIEF_A_AUTO_VALIDITY_SCALES.infrequency.rules;
  let score = 0;
  
  for (const rule of rules) {
    const value = responses[`q${rule.item}`];
    if (value !== null && value !== undefined) {
      if (rule.condition === 'equals' && Number(value) === rule.value) {
        score++;
      }
    }
  }
  
  return score;
}

/**
 * Calculate all BRIEF-A Auto scores
 * @param responses Object containing q1-q75 values (1-3 each)
 * @returns Scale scores, index scores, and validity scores
 */
export function computeBriefAAutoScores(responses: Record<string, any>): BriefAAutoScoreResult {
  // Calculate 9 scale scores
  const brief_a_inhibit = calculateAutoScaleScore(
    responses,
    BRIEF_A_AUTO_SCALES.inhibit.items
  );
  const brief_a_shift = calculateAutoScaleScore(
    responses,
    BRIEF_A_AUTO_SCALES.shift.items
  );
  const brief_a_emotional_control = calculateAutoScaleScore(
    responses,
    BRIEF_A_AUTO_SCALES.emotional_control.items
  );
  const brief_a_self_monitor = calculateAutoScaleScore(
    responses,
    BRIEF_A_AUTO_SCALES.self_monitor.items
  );
  const brief_a_initiate = calculateAutoScaleScore(
    responses,
    BRIEF_A_AUTO_SCALES.initiate.items
  );
  const brief_a_working_memory = calculateAutoScaleScore(
    responses,
    BRIEF_A_AUTO_SCALES.working_memory.items
  );
  const brief_a_plan_organize = calculateAutoScaleScore(
    responses,
    BRIEF_A_AUTO_SCALES.plan_organize.items
  );
  const brief_a_task_monitor = calculateAutoScaleScore(
    responses,
    BRIEF_A_AUTO_SCALES.task_monitor.items
  );
  const brief_a_organization_materials = calculateAutoScaleScore(
    responses,
    BRIEF_A_AUTO_SCALES.organization_materials.items
  );
  
  // Calculate 3 index scores
  const brief_a_bri = brief_a_inhibit + brief_a_shift + brief_a_emotional_control + brief_a_self_monitor;
  const brief_a_mi = brief_a_initiate + brief_a_working_memory + brief_a_plan_organize + brief_a_task_monitor + brief_a_organization_materials;
  const brief_a_gec = brief_a_bri + brief_a_mi;
  
  // Calculate 2 validity scores
  const brief_a_negativity = calculateAutoNegativity(responses);
  const brief_a_infrequency = calculateAutoInfrequency(responses);
  
  return {
    brief_a_inhibit,
    brief_a_shift,
    brief_a_emotional_control,
    brief_a_self_monitor,
    brief_a_initiate,
    brief_a_working_memory,
    brief_a_plan_organize,
    brief_a_task_monitor,
    brief_a_organization_materials,
    brief_a_bri,
    brief_a_mi,
    brief_a_gec,
    brief_a_negativity,
    brief_a_infrequency
  };
}

/**
 * Interpret BRIEF-A Auto GEC score
 * Higher scores indicate more executive dysfunction
 */
export function interpretBriefAAutoScore(gecScore: number): string {
  // Score range is 75-225 (75 items × 1-3)
  // Middle point is 150 (75 items × 2)
  if (gecScore <= 112) {
    return 'Fonctions exécutives dans la norme';
  } else if (gecScore <= 150) {
    return 'Difficultés exécutives légères';
  } else if (gecScore <= 187) {
    return 'Difficultés exécutives modérées';
  } else {
    return 'Difficultés exécutives sévères';
  }
}

// ============================================================================
// Question Definitions (Self-Report Version)
// ============================================================================

const BRIEF_A_AUTO_ITEMS = [
  { id: 'q1', text: "J'ai des accès de colère" },
  { id: 'q2', text: "Je fais des erreurs d'inattention lorsque je réalise des tâches" },
  { id: 'q3', text: "Je suis désorganisé(e)" },
  { id: 'q4', text: "J'ai des difficultés pour me concentrer sur les tâches (comme les tâches ménagères, la lecture ou le travail)" },
  { id: 'q5', text: "Je tapote avec mes doigts ou remue mes jambes" },
  { id: 'q6', text: "J'ai besoin qu'on me rappelle de commencer une tâche même lorsque je suis d'accord pour le faire" },
  { id: 'q7', text: "Mon armoire est totalement en désordre" },
  { id: 'q8', text: "J'ai des difficultés pour passer d'une activité ou d'une tâche à l'autre" },
  { id: 'q9', text: "Je suis dépassé(e) quand il y a beaucoup de choses à faire" },
  { id: 'q10', text: "J'oublie mon nom" },
  { id: 'q11', text: "J'ai des difficultés pour faire un travail ou des activités qui nécessitent plus d'une étape" },
  { id: 'q12', text: "J'ai des réactions émotionnelles excessives" },
  { id: 'q13', text: "Je m'aperçois trop tard que mon comportement fait de la peine ou énerve les autres" },
  { id: 'q14', text: "J'ai des difficultés à me préparer pour la journée" },
  { id: 'q15', text: "J'ai des difficultés pour organiser mes activités selon leur priorité" },
  { id: 'q16', text: "J'ai des difficultés pour rester tranquillement assis(e)" },
  { id: 'q17', text: "J'oublie ce que j'étais en train de faire en plein milieu d'une activité" },
  { id: 'q18', text: "Je ne vérifie pas mon travail pour voir s'il y a des erreurs" },
  { id: 'q19', text: "Je me laisse envahir par mes émotions pour des raisons anodines" },
  { id: 'q20', text: "Je traîne beaucoup à la maison" },
  { id: 'q21', text: "Je commence les tâches (comme la cuisine ou des travaux manuels) sans avoir préparé le bon matériel" },
  { id: 'q22', text: "J'ai des difficultés à accepter des points de vue différents du mien pour résoudre les problèmes" },
  { id: 'q23', text: "Je parle au mauvais moment" },
  { id: 'q24', text: "J'évalue mal le niveau de difficulté des tâches que je dois réaliser" },
  { id: 'q25', text: "J'ai des difficultés à commencer quelque chose par moi-même" },
  { id: 'q26', text: "Je me fatigue rapidement" },
  { id: 'q27', text: "Je me fatigue rapidement" },  // Note: Q27 is duplicate of Q26 in source JSON
  { id: 'q28', text: "Je réagis de manière plus émotive que mes amis" },
  { id: 'q29', text: "J'ai du mal à attendre mon tour" },
  { id: 'q30', text: "Les gens disent que je suis désorganisé(e)" },
  { id: 'q31', text: "Je perds mes affaires (comme mes clés, mon argent, mon portefeuille, mes documents, etc.)" },
  { id: 'q32', text: "J'ai des difficultés à envisager une nouvelle approche pour résoudre un problème quand je suis bloqué(e)" },
  { id: 'q33', text: "J'ai des réactions excessives face à des problèmes peu importants" },
  { id: 'q34', text: "Je ne m'y prends pas à l'avance pour organiser les choses que j'ai à faire" },
  { id: 'q35', text: "J'ai une capacité d'attention limitée" },
  { id: 'q36', text: "Je fais des commentaires inappropriés à connotation sexuelle" },
  { id: 'q37', text: "Je ne comprends pas quand les autres semblent fâchés avec moi" },
  { id: 'q38', text: "J'ai des difficultés pour compter jusqu'à 3" },
  { id: 'q39', text: "Je formule des objectifs irréalistes" },
  { id: 'q40', text: "Je laisse la salle de bain en désordre" },
  { id: 'q41', text: "Je fais des fautes d'inattention" },
  { id: 'q42', text: "Je suis facilement affecté(e) par mes émotions" },
  { id: 'q43', text: "Je prends des décisions qui me mettent dans une situation difficile (légalement, financièrement, socialement)" },
  { id: 'q44', text: "Je suis gêné(e) quand je dois faire face à des changements" },
  { id: 'q45', text: "J'ai des difficultés à m'enthousiasmer pour les choses" },
  { id: 'q46', text: "J'oublie facilement les instructions" },
  { id: 'q47', text: "J'ai de bonnes idées mais ne peux pas les mettre par écrit" },
  { id: 'q48', text: "Je fais des erreurs" },
  { id: 'q49', text: "J'ai des difficultés pour me mettre à faire quelque chose" },
  { id: 'q50', text: "Je dis les choses sans réfléchir" },
  { id: 'q51', text: "Mes accès de colère sont intenses mais se terminent rapidement" },
  { id: 'q52', text: "J'ai du mal à terminer ce que je commence" },
  { id: 'q53', text: "Je commence les choses à la dernière minute" },
  { id: 'q54', text: "J'ai des difficultés à finir de moi-même ce que j'entreprends" },
  { id: 'q55', text: "Les gens disent que je suis facilement distrait(e)" },
  { id: 'q56', text: "J'ai des difficultés à me souvenir des choses, même pendant quelques minutes" },
  { id: 'q57', text: "Les gens disent que je suis trop émotif(ve)" },
  { id: 'q58', text: "Je fais les choses de manière précipitée" },
  { id: 'q59', text: "Je m'énerve facilement" },
  { id: 'q60', text: "Je laisse la pièce ou mon domicile en désordre" },
  { id: 'q61', text: "Je suis perturbé(e) par des changements imprévus dans ma vie quotidienne" },
  { id: 'q62', text: "J'ai du mal à occuper mon temps libre" },
  { id: 'q63', text: "Je ne planifie/organise pas mes activités à l'avance" },
  { id: 'q64', text: "Les gens disent que je ne réfléchis pas avant d'agir" },
  { id: 'q65', text: "J'ai des difficultés à trouver mes affaires dans ma chambre, mon placard ou mon bureau" },
  { id: 'q66', text: "J'ai des difficultés pour organiser mes activités" },
  { id: 'q67', text: "J'ai du mal à surmonter les difficultés/problèmes que je rencontre" },
  { id: 'q68', text: "J'ai des difficultés pour faire plus d'une chose à la fois" },
  { id: 'q69', text: "Mon humeur change souvent" },
  { id: 'q70', text: "Je ne réfléchis pas aux conséquences avant de faire quelque chose" },
  { id: 'q71', text: "J'ai des difficultés pour l'organisation de mon travail" },
  { id: 'q72', text: "Je m'énerve rapidement ou facilement pour des choses sans importance" },
  { id: 'q73', text: "Je suis impulsif(ve)" },
  { id: 'q74', text: "Je laisse traîner mes affaires partout" },
  { id: 'q75', text: "J'ai du mal à terminer complètement mon travail" }
];

// ============================================================================
// Questions Array for Renderer
// ============================================================================

export const BRIEF_A_AUTO_SZ_QUESTIONS: Question[] = [
  // Instructions
  {
    id: 'instructions_header',
    section: 'Instructions',
    text: "Ce questionnaire évalue vos fonctions exécutives au cours du dernier mois. Pour chaque énoncé, indiquez la fréquence à laquelle le comportement décrit s'applique à vous.",
    type: 'instruction',
    required: false,
  },
  
  // Items Section Header
  {
    id: 'items_section',
    section: 'Évaluation des comportements',
    text: 'Au cours du dernier mois, à quelle fréquence chacun de ces comportements vous a-t-il posé problème ?',
    type: 'section',
    required: false,
  },
  
  // Generate all 75 item questions
  ...BRIEF_A_AUTO_ITEMS.map((item, index) => ({
    id: item.id,
    section: 'Évaluation des comportements',
    text: `${index + 1}. ${item.text}`,
    type: 'single_choice' as const,
    required: true,
    options: BRIEF_A_AUTO_LIKERT_OPTIONS.map(opt => ({
      code: opt.code,
      label: opt.label,
      score: opt.score
    })),
  })),
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const BRIEF_A_AUTO_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'brief_a_auto_sz',
  code: 'BRIEF_A_AUTO_SZ',
  title: 'BRIEF-A Auto-Evaluation - Échelle d\'exploration des Fonctions Exécutives',
  description: "Auto-questionnaire évaluant les fonctions exécutives de l'adulte à travers 75 comportements auto-rapportés au cours du dernier mois. Version française (Éditions Hogrefe France, 2015)",
  instructions: "Pour chaque énoncé, indiquez la fréquence à laquelle le comportement décrit s'applique à vous au cours du dernier mois: Jamais (1), Parfois (2), ou Souvent (3).",
  questions: BRIEF_A_AUTO_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'patient',
    reference: 'Roth RM, Isquith PK, Gioia GA. BRIEF-A: Behavior Rating Inventory of Executive Function - Adult Version. PAR, Inc., 2005.',
    version: 'Adaptation française (2015)',
    language: 'fr-FR',
    copyright: 'Copyright© 1996, 1998, 2000, 2001, 2003, 2004, 2005 PAR, Inc. Adaptation française © 2015 Editions Hogrefe France',
    scoringNote: 'Score brut total (GEC): 75-225. Scores plus élevés indiquent plus de difficultés exécutives.',
    scales: BRIEF_A_AUTO_SCALES,
    indices: BRIEF_A_AUTO_INDICES,
    validityScales: BRIEF_A_AUTO_VALIDITY_SCALES
  },
};
