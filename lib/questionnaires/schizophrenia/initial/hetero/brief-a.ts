// ============================================================================
// eFondaMental Platform - BRIEF-A (Behavior Rating Inventory of Executive Function - Adult)
// French Version - Roth RM, Isquith PK, Gioia GA
// Translation: Szöke A., Hammami S., Schürhoff F.
// Schizophrenia Initial Evaluation - Hetero-questionnaires Module
// Informant-rated questionnaire assessing executive functions through observed behaviors.
// ============================================================================

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaBriefAResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Demographics
  subject_name: string | null;
  subject_sex: string | null;
  subject_age: number | null;
  relationship: string | null;
  years_known: number | null;
  
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
  
  // 9 Clinical Scale scores
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
  
  // 3 Validity scales
  brief_a_negativity: number | null;
  brief_a_inconsistency: number | null;
  brief_a_infrequency: number | null;
  
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaBriefAResponseInsert = Omit<
  SchizophreniaBriefAResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'brief_a_inhibit' | 'brief_a_shift' | 'brief_a_emotional_control' | 'brief_a_self_monitor' |
  'brief_a_initiate' | 'brief_a_working_memory' | 'brief_a_plan_organize' | 'brief_a_task_monitor' |
  'brief_a_organization_materials' | 'brief_a_bri' | 'brief_a_mi' | 'brief_a_gec' |
  'brief_a_negativity' | 'brief_a_inconsistency' | 'brief_a_infrequency'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Scale Configuration
// ============================================================================

export const BRIEF_A_SCALES = {
  inhibit: {
    id: 'INHIBIT',
    label: 'Inhibition',
    label_en: 'Inhibit',
    items: [5, 16, 29, 36, 43, 55, 58, 73],
    maxMissing: 2,
    index: 'BRI'
  },
  shift: {
    id: 'SHIFT',
    label: 'Flexibilité',
    label_en: 'Shift',
    items: [8, 22, 32, 44, 61, 67],
    maxMissing: 1,
    index: 'BRI'
  },
  emotional_control: {
    id: 'EMOTIONAL_CONTROL',
    label: 'Contrôle émotionnel',
    label_en: 'Emotional Control',
    items: [1, 12, 19, 28, 33, 42, 51, 57, 69, 72],
    maxMissing: 2,
    index: 'BRI'
  },
  self_monitor: {
    id: 'SELF_MONITOR',
    label: 'Auto-contrôle',
    label_en: 'Self-Monitor',
    items: [13, 23, 37, 50, 64, 70],
    maxMissing: 1,
    index: 'BRI'
  },
  initiate: {
    id: 'INITIATE',
    label: 'Initiation',
    label_en: 'Initiate',
    items: [6, 14, 20, 25, 45, 49, 53, 62],
    maxMissing: 2,
    index: 'MI'
  },
  working_memory: {
    id: 'WORKING_MEMORY',
    label: 'Mémoire de travail',
    label_en: 'Working Memory',
    items: [4, 11, 17, 26, 35, 46, 56, 68],
    maxMissing: 2,
    index: 'MI'
  },
  plan_organize: {
    id: 'PLAN_ORGANIZE',
    label: 'Planification/Organisation',
    label_en: 'Plan/Organize',
    items: [9, 15, 21, 34, 39, 47, 54, 63, 66, 71],
    maxMissing: 2,
    index: 'MI'
  },
  task_monitor: {
    id: 'TASK_MONITOR',
    label: 'Contrôle de la tâche',
    label_en: 'Task Monitor',
    items: [2, 18, 24, 41, 52, 75],
    maxMissing: 1,
    index: 'MI'
  },
  organization_materials: {
    id: 'ORGANIZATION_MATERIALS',
    label: 'Organisation du matériel',
    label_en: 'Organization of Materials',
    items: [3, 7, 30, 31, 40, 60, 65, 74],
    maxMissing: 2,
    index: 'MI'
  }
};

export const BRIEF_A_INDICES = {
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

export const BRIEF_A_VALIDITY_SCALES = {
  negativity: {
    id: 'NEGATIVITY',
    label: 'Négativité',
    label_en: 'Negativity',
    targetItems: [1, 8, 19, 21, 22, 23, 29, 36, 39, 40],
    threshold: 6,
    interpretation: 'elevated'
  },
  inconsistency: {
    id: 'INCONSISTENCY',
    label: 'Incohérence',
    label_en: 'Inconsistency',
    pairs: [
      [2, 41], [25, 49], [28, 42], [33, 72], [34, 63],
      [44, 61], [46, 56], [52, 75], [60, 74], [64, 70]
    ],
    threshold: 8,
    interpretation: 'elevated'
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
    threshold: 3,
    interpretation: 'questionable'
  }
};

// ============================================================================
// Likert Scale Options
// ============================================================================

export const BRIEF_A_LIKERT_OPTIONS = [
  { code: 1, label: 'Jamais', score: 1 },
  { code: 2, label: 'Parfois', score: 2 },
  { code: 3, label: 'Souvent', score: 3 }
];

// ============================================================================
// Scoring Functions
// ============================================================================

export interface BriefAScoreResult {
  // Scale scores
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
  brief_a_inconsistency: number;
  brief_a_infrequency: number;
}

/**
 * Calculate scale score with missing item handling
 * If items are missing but within maxMissing threshold, assign value 1 to missing items
 */
function calculateScaleScore(
  responses: Record<string, any>,
  items: number[],
  maxMissing: number
): number {
  let sum = 0;
  let missingCount = 0;
  
  for (const itemNum of items) {
    const value = responses[`q${itemNum}`];
    if (value === null || value === undefined) {
      missingCount++;
      sum += 1; // Assign 1 to missing items per BRIEF-A manual
    } else {
      sum += Number(value);
    }
  }
  
  // If too many items missing, return 0 to indicate invalid scale
  if (missingCount > maxMissing) {
    return 0;
  }
  
  return sum;
}

/**
 * Calculate Negativity validity score
 * Count of items scored 3 (Souvent) in the target item set
 */
function calculateNegativity(responses: Record<string, any>): number {
  const targetItems = BRIEF_A_VALIDITY_SCALES.negativity.targetItems;
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
 * Calculate Inconsistency validity score
 * Sum of absolute differences between item pairs
 */
function calculateInconsistency(responses: Record<string, any>): number {
  const pairs = BRIEF_A_VALIDITY_SCALES.inconsistency.pairs;
  let sum = 0;
  
  for (const [item1, item2] of pairs) {
    const val1 = responses[`q${item1}`];
    const val2 = responses[`q${item2}`];
    
    if (val1 !== null && val1 !== undefined && val2 !== null && val2 !== undefined) {
      sum += Math.abs(Number(val1) - Number(val2));
    }
  }
  
  return sum;
}

/**
 * Calculate Infrequency validity score
 * Sum of binary flags based on specific item responses
 */
function calculateInfrequency(responses: Record<string, any>): number {
  const rules = BRIEF_A_VALIDITY_SCALES.infrequency.rules;
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
 * Calculate all BRIEF-A scores
 * @param responses Object containing q1-q75 values (1-3 each)
 * @returns Scale scores, index scores, and validity scores
 */
export function computeBriefAScores(responses: Record<string, any>): BriefAScoreResult {
  // Calculate 9 scale scores
  const brief_a_inhibit = calculateScaleScore(
    responses,
    BRIEF_A_SCALES.inhibit.items,
    BRIEF_A_SCALES.inhibit.maxMissing
  );
  const brief_a_shift = calculateScaleScore(
    responses,
    BRIEF_A_SCALES.shift.items,
    BRIEF_A_SCALES.shift.maxMissing
  );
  const brief_a_emotional_control = calculateScaleScore(
    responses,
    BRIEF_A_SCALES.emotional_control.items,
    BRIEF_A_SCALES.emotional_control.maxMissing
  );
  const brief_a_self_monitor = calculateScaleScore(
    responses,
    BRIEF_A_SCALES.self_monitor.items,
    BRIEF_A_SCALES.self_monitor.maxMissing
  );
  const brief_a_initiate = calculateScaleScore(
    responses,
    BRIEF_A_SCALES.initiate.items,
    BRIEF_A_SCALES.initiate.maxMissing
  );
  const brief_a_working_memory = calculateScaleScore(
    responses,
    BRIEF_A_SCALES.working_memory.items,
    BRIEF_A_SCALES.working_memory.maxMissing
  );
  const brief_a_plan_organize = calculateScaleScore(
    responses,
    BRIEF_A_SCALES.plan_organize.items,
    BRIEF_A_SCALES.plan_organize.maxMissing
  );
  const brief_a_task_monitor = calculateScaleScore(
    responses,
    BRIEF_A_SCALES.task_monitor.items,
    BRIEF_A_SCALES.task_monitor.maxMissing
  );
  const brief_a_organization_materials = calculateScaleScore(
    responses,
    BRIEF_A_SCALES.organization_materials.items,
    BRIEF_A_SCALES.organization_materials.maxMissing
  );
  
  // Calculate 3 index scores
  const brief_a_bri = brief_a_inhibit + brief_a_shift + brief_a_emotional_control + brief_a_self_monitor;
  const brief_a_mi = brief_a_initiate + brief_a_working_memory + brief_a_plan_organize + brief_a_task_monitor + brief_a_organization_materials;
  const brief_a_gec = brief_a_bri + brief_a_mi;
  
  // Calculate 3 validity scores
  const brief_a_negativity = calculateNegativity(responses);
  const brief_a_inconsistency = calculateInconsistency(responses);
  const brief_a_infrequency = calculateInfrequency(responses);
  
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
    brief_a_inconsistency,
    brief_a_infrequency
  };
}

/**
 * Interpret BRIEF-A GEC score
 * Higher scores indicate more executive dysfunction
 */
export function interpretBriefAScore(gecScore: number): string {
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

/**
 * Check if validity scale indicates concerns
 */
export function isValidityElevated(
  scale: 'negativity' | 'inconsistency' | 'infrequency',
  value: number
): boolean {
  const threshold = BRIEF_A_VALIDITY_SCALES[scale].threshold;
  return value >= threshold;
}

// ============================================================================
// Question Definitions
// ============================================================================

const BRIEF_A_ITEMS = [
  { id: 'q1', text: "Elle/Il a des accès de colère" },
  { id: 'q2', text: "Elle/Il fait des fautes par négligence quand elle/il accomplit des tâches" },
  { id: 'q3', text: "Elle/Il est désorganisé(e)" },
  { id: 'q4', text: "Elle/Il a du mal à se concentrer sur ce qu'elle/il fait (par exemple le ménage, la lecture, le travail)" },
  { id: 'q5', text: "Il lui arrive de pianoter ou de bouger (rythmiquement) ses jambes" },
  { id: 'q6', text: "Elle/Il a besoin qu'on lui rappelle qu'il faut débuter une tâche même quand elle/il est disposé(e) à la faire" },
  { id: 'q7', text: "Ses placards / armoires sont mal rangés" },
  { id: 'q8', text: "Elle/Il a du mal à passer d'une activité à une autre" },
  { id: 'q9', text: "Elle/Il se sent dépassé(e) par des tâches importantes." },
  { id: 'q10', text: "Elle/Il oublie son nom" },
  { id: 'q11', text: "Elle/Il a du mal avec les tâches ou activités qui nécessitent plusieurs étapes." },
  { id: 'q12', text: "Elle/Il a des réactions émotionnelles exagérées" },
  { id: 'q13', text: "Elle/Il ne s'aperçoit pas, avant qu'il ne soit trop tard, quand elle/il met les autres mal à l'aise ou en colère." },
  { id: 'q14', text: "Elle/Il a des difficultés à se préparer pour démarrer la journée" },
  { id: 'q15', text: "Elle/Il a du mal à décider quelles activités elle/il doit faire en priorité" },
  { id: 'q16', text: "Elle/Il a du mal à rester tranquille" },
  { id: 'q17', text: "Elle/Il oublie, au milieu d'une activité, ce qu'elle/il est en train de faire" },
  { id: 'q18', text: "Elle/Il ne vérifie pas son travail afin de rechercher des erreurs" },
  { id: 'q19', text: "Elle/Il a de fortes réactions émotionnelles pour des choses peu importantes" },
  { id: 'q20', text: "Elle/Il traîne beaucoup à la maison" },
  { id: 'q21', text: "Elle/Il commence des activités (par exemple faire la cuisine, bricoler, faire le ménage) sans avoir ce dont elle/il a besoin." },
  { id: 'q22', text: "Elle/Il a des difficultés à accepter d'autres façons de résoudre les problèmes au travail, dans d'autres activités ou dans les relations avec ses amis" },
  { id: 'q23', text: "Elle/Il parle au mauvais moment" },
  { id: 'q24', text: "Elle/Il évalue mal le niveau de difficulté d'une tâche" },
  { id: 'q25', text: "Elle/Il a des difficultés à commencer les choses par elle/lui-même" },
  { id: 'q26', text: "Quand elle/il parle, elle/il a du mal à garder le fil" },
  { id: 'q27', text: "Elle/Il fatigue" },
  { id: 'q28', text: "Ses réactions émotionnelles sont plus fortes que celles de ses amis" },
  { id: 'q29', text: "Elle/Il a du mal à attendre son tour" },
  { id: 'q30', text: "Les gens disent d'elle/de lui qu'elle/il est désorganisé(e)" },
  { id: 'q31', text: "Elle/Il perd des choses (comme par exemple ses clés, son portefeuille, de l'argent, ses papiers etc.)" },
  { id: 'q32', text: "Quand elle/il est coincé(e) elle/il a du mal à imaginer une autre solution pour résoudre le problème" },
  { id: 'q33', text: "Elle/Il réagit de façon excessive à des problèmes sans importance" },
  { id: 'q34', text: "Elle/Il ne prévoit pas en avance ses activités" },
  { id: 'q35', text: "Elle/Il n'arrive pas à rester attentif(ve) longtemps" },
  { id: 'q36', text: "Elle/Il fait des commentaires à contenu sexuel déplacés" },
  { id: 'q37', text: "Quand des gens semblent fâchés contre elle/lui, elle/il ne comprend pas pourquoi" },
  { id: 'q38', text: "Elle/Il a du mal à compter jusqu'à trois" },
  { id: 'q39', text: "Elle/Il a des objectifs irréalistes" },
  { id: 'q40', text: "Elle/Il laisse la salle de bains en désordre" },
  { id: 'q41', text: "Elle/Il fait des erreurs d'inattention" },
  { id: 'q42', text: "Elle/Il est facilement bouleversé(e) émotionnellement" },
  { id: 'q43', text: "Elle/Il prend des décisions qui lui créent des ennuis (judiciaires, financiers, sociaux)" },
  { id: 'q44', text: "Elle/Il est gêné(e) quand elle/il doit faire face aux changements" },
  { id: 'q45', text: "Elle/Il a du mal à être enthousiasmé(e) par des choses" },
  { id: 'q46', text: "Elle/Il oublie facilement les instructions" },
  { id: 'q47', text: "Elle/Il a de bonnes idées mais elle/il a du mal à les mettre par écrit" },
  { id: 'q48', text: "Elle/Il fait des erreurs" },
  { id: 'q49', text: "Elle/Il a du mal à commencer des tâches" },
  { id: 'q50', text: "Elle/Il dit des choses sans réfléchir" },
  { id: 'q51', text: "Sa colère est intense mais de courte durée" },
  { id: 'q52', text: "Elle/Il a du mal à finir les tâches (comme le ménage, du travail etc.)" },
  { id: 'q53', text: "Elle/Il commence les choses à la dernière minute (comme les tâches ménagères, le travail, payer ses factures, remplir des papiers)" },
  { id: 'q54', text: "Elle/Il a du mal à aller tout seul au bout d'une tâche" },
  { id: 'q55', text: "Les gens disent qu'elle/il est facilement distrait(e)" },
  { id: 'q56', text: "Elle/Il a du mal à retenir les choses (instructions, numéros de téléphone) même pour quelques minutes" },
  { id: 'q57', text: "Les gens disent qu'elle/il est trop émotif(ve)" },
  { id: 'q58', text: "Elle/Il fait les choses de manière précipitée" },
  { id: 'q59', text: "Elle/Il est contrarié(e)" },
  { id: 'q60', text: "Elle/Il laisse sa chambre (ou la maison) en désordre" },
  { id: 'q61', text: "Elle/Il est perturbé(e) par des changements inattendus dans sa vie quotidienne" },
  { id: 'q62', text: "Elle/Il a du mal à trouver des idées pour occuper son temps libre" },
  { id: 'q63', text: "Elle/Il ne planifie pas ses actions" },
  { id: 'q64', text: "Les gens disent qu'elle/il ne réfléchit pas avant d'agir" },
  { id: 'q65', text: "Elle/Il a du mal à retrouver des choses dans son armoire, son placard, sa chambre ou sur son bureau" },
  { id: 'q66', text: "Elle/Il a des problèmes pour organiser des activités" },
  { id: 'q67', text: "Après avoir eu un problème elle/il a du mal à s'en remettre" },
  { id: 'q68', text: "Elle/Il a du mal à faire plusieurs choses à la fois" },
  { id: 'q69', text: "Son humeur change fréquemment" },
  { id: 'q70', text: "Elle/Il ne réfléchit pas aux conséquences avant de faire quelque chose" },
  { id: 'q71', text: "Elle/Il a du mal à organiser le travail" },
  { id: 'q72', text: "Elle/Il est contrarié(e) rapidement ou facilement par des choses peu importantes" },
  { id: 'q73', text: "Elle/Il est impulsif(ve)" },
  { id: 'q74', text: "Elle/Il ne ramasse pas ses affaires" },
  { id: 'q75', text: "Elle/Il a des difficultés à aller jusqu'au bout de son travail" }
];

// ============================================================================
// Questions Array for Renderer
// ============================================================================

export const BRIEF_A_SZ_QUESTIONS: Question[] = [
  // Instructions
  {
    id: 'instructions_header',
    section: 'Instructions',
    text: "Ce questionnaire est destiné à être rempli par une personne qui connaît bien le sujet évalué. Pour chaque énoncé, indiquez la fréquence à laquelle le comportement décrit a été observé au cours du mois précédent.",
    type: 'instruction',
    required: false,
  },
  
  // Demographics Section
  {
    id: 'demographics_section',
    section: 'Informations sur le répondant',
    text: 'Informations sur le répondant et le sujet évalué',
    type: 'section',
    required: false,
  },
  {
    id: 'subject_name',
    section: 'Informations sur le répondant',
    text: 'Nom et prénom du sujet',
    type: 'text',
    required: true,
  },
  {
    id: 'subject_sex',
    section: 'Informations sur le répondant',
    text: 'Sexe du sujet',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'M', label: 'Masculin' },
      { code: 'F', label: 'Féminin' }
    ]
  },
  {
    id: 'subject_age',
    section: 'Informations sur le répondant',
    text: 'Âge du sujet',
    type: 'number',
    required: true,
    min: 18,
    max: 100
  },
  {
    id: 'relationship',
    section: 'Informations sur le répondant',
    text: 'Lien avec le sujet',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'parent', label: 'Parent' },
      { code: 'epoux', label: 'Époux(se)' },
      { code: 'frere_soeur', label: 'Frère/Sœur' },
      { code: 'ami', label: 'Ami' },
      { code: 'autre', label: 'Autre' }
    ]
  },
  {
    id: 'years_known',
    section: 'Informations sur le répondant',
    text: 'Depuis combien d\'années connaissez-vous le sujet ?',
    type: 'number',
    required: true,
    min: 0,
    max: 100
  },
  
  // Items Section Header
  {
    id: 'items_section',
    section: 'Évaluation des comportements',
    text: 'Au cours du mois précédent, à quelle fréquence chacun de ces comportements a-t-il posé problème ?',
    type: 'section',
    required: false,
  },
  
  // Generate all 75 item questions
  ...BRIEF_A_ITEMS.map((item, index) => ({
    id: item.id,
    section: 'Évaluation des comportements',
    text: `${index + 1}. ${item.text}`,
    type: 'single_choice' as const,
    required: true,
    options: BRIEF_A_LIKERT_OPTIONS.map(opt => ({
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

export const BRIEF_A_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'brief_a_sz',
  code: 'BRIEF_A_SZ',
  title: 'BRIEF-A - Échelle d\'exploration des Fonctions Exécutives',
  description: "Hétéro-questionnaire évaluant les fonctions exécutives de l'adulte à travers 75 comportements observés au cours du mois précédent. Version française (Szöke A., Hammami S., Schürhoff F.)",
  instructions: "Pour chaque énoncé, indiquez la fréquence à laquelle le comportement décrit a été observé au cours du mois précédent: Jamais (1), Parfois (2), ou Souvent (3).",
  questions: BRIEF_A_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    reference: 'Roth RM, Isquith PK, Gioia GA. BRIEF-A: Behavior Rating Inventory of Executive Function - Adult Version. PAR, Inc., 2005.',
    version: 'Version française',
    language: 'fr-FR',
    copyright: 'Copyright 1996, 1998, 2001, 2003, 2004, 2005 by PAR, Inc.',
    scoringNote: 'Score brut total (GEC): 75-225. Scores plus élevés indiquent plus de difficultés exécutives.',
    scales: BRIEF_A_SCALES,
    indices: BRIEF_A_INDICES,
    validityScales: BRIEF_A_VALIDITY_SCALES
  },
};
