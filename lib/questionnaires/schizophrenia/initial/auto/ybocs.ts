// ============================================================================
// eFondaMental Platform - Schizophrenia Initial Evaluation
// Y-BOCS Questionnaire (Yale-Brown Obsessive-Compulsive Scale)
// Goodman WK, Price LH, Rasmussen SA, et al. (1989)
// French adaptation: Sauteraud A. (2005)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching schizophrenia_ybocs table schema
// ============================================================================

export interface SchizophreniaYbocsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Administration status
  questionnaire_done?: string | null; // 'Fait' | 'Non fait'
  
  // 10 main items (0-4 each)
  q1?: number | null;  // Obsessions - Time occupied
  q2?: number | null;  // Obsessions - Interference
  q3?: number | null;  // Obsessions - Distress
  q4?: number | null;  // Obsessions - Resistance
  q5?: number | null;  // Obsessions - Control
  q6?: number | null;  // Compulsions - Time spent
  q7?: number | null;  // Compulsions - Interference
  q8?: number | null;  // Compulsions - Distress
  q9?: number | null;  // Compulsions - Resistance
  q10?: number | null; // Compulsions - Control
  
  // 10 summary items - Score AUTO-YALE-BROWN (0-4 each)
  syb1?: number | null;  // Temps passé aux obsessions
  syb2?: number | null;  // Gêne liée aux obsessions
  syb3?: number | null;  // Angoisse associée aux obsessions
  syb4?: number | null;  // Résistance aux obsessions
  syb5?: number | null;  // Contrôle sur les obsessions
  syb6?: number | null;  // Temps passé aux compulsions
  syb7?: number | null;  // Gêne liée aux compulsions
  syb8?: number | null;  // Anxiété associée aux compulsions
  syb9?: number | null;  // Résistance aux compulsions
  syb10?: number | null; // Contrôle sur les compulsions
  
  // Computed scores
  obsessions_score?: number | null;    // Q1-Q5 sum (0-20)
  compulsions_score?: number | null;   // Q6-Q10 sum (0-20)
  total_score?: number | null;         // 0-40
  interpretation?: string | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaYbocsResponseInsert = Omit<
  SchizophreniaYbocsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'obsessions_score' | 'compulsions_score' | 'total_score' | 'interpretation'
>;

// ============================================================================
// Scoring Configuration
// ============================================================================

// Subscale item mappings
const SUBSCALE_ITEMS = {
  obsessions: [1, 2, 3, 4, 5],      // Q1-Q5: Obsessions (max 20)
  compulsions: [6, 7, 8, 9, 10]     // Q6-Q10: Compulsions (max 20)
};

// Dimensions for each subscale (same 5 dimensions)
const DIMENSIONS = {
  obsessions: {
    time_occupied: 1,   // Q1
    interference: 2,    // Q2
    distress: 3,        // Q3
    resistance: 4,      // Q4
    control: 5          // Q5
  },
  compulsions: {
    time_spent: 6,      // Q6
    interference: 7,    // Q7
    distress: 8,        // Q8
    resistance: 9,      // Q9
    control: 10         // Q10
  }
};

// Severity thresholds
const SEVERITY_THRESHOLDS = {
  subclinical: { min: 0, max: 7, label: 'Sous-clinique' },
  mild: { min: 8, max: 15, label: 'TOC léger' },
  moderate: { min: 16, max: 23, label: 'TOC modéré' },
  severe: { min: 24, max: 31, label: 'TOC sévère' },
  extreme: { min: 32, max: 40, label: 'TOC extrême' }
};

// Clinical cutoff
const CLINICAL_CUTOFF = 16;

// ============================================================================
// Scoring Functions
// ============================================================================

export interface YbocsSzScoreResult {
  obsessions_score: number;
  compulsions_score: number;
  total_score: number;
  interpretation: string;
  severity_level: string;
  is_clinically_significant: boolean;
}

/**
 * Compute all Y-BOCS scores from responses
 */
export function computeYbocsSzScores(responses: Record<string, any>): YbocsSzScoreResult {
  let obsessionsScore = 0;
  let compulsionsScore = 0;
  
  // Calculate obsessions subscale (Q1-Q5)
  for (const itemNum of SUBSCALE_ITEMS.obsessions) {
    const qKey = `q${itemNum}`;
    const value = responses[qKey];
    if (typeof value === 'number' && !isNaN(value)) {
      obsessionsScore += value;
    }
  }
  
  // Calculate compulsions subscale (Q6-Q10)
  for (const itemNum of SUBSCALE_ITEMS.compulsions) {
    const qKey = `q${itemNum}`;
    const value = responses[qKey];
    if (typeof value === 'number' && !isNaN(value)) {
      compulsionsScore += value;
    }
  }
  
  const totalScore = obsessionsScore + compulsionsScore;
  const severityLevel = getSeverityLevel(totalScore);
  
  return {
    obsessions_score: obsessionsScore,
    compulsions_score: compulsionsScore,
    total_score: totalScore,
    interpretation: interpretYbocsSzScore(totalScore),
    severity_level: severityLevel,
    is_clinically_significant: totalScore >= CLINICAL_CUTOFF
  };
}

/**
 * Get severity level label from total score
 */
function getSeverityLevel(totalScore: number): string {
  if (totalScore <= SEVERITY_THRESHOLDS.subclinical.max) {
    return SEVERITY_THRESHOLDS.subclinical.label;
  }
  if (totalScore <= SEVERITY_THRESHOLDS.mild.max) {
    return SEVERITY_THRESHOLDS.mild.label;
  }
  if (totalScore <= SEVERITY_THRESHOLDS.moderate.max) {
    return SEVERITY_THRESHOLDS.moderate.label;
  }
  if (totalScore <= SEVERITY_THRESHOLDS.severe.max) {
    return SEVERITY_THRESHOLDS.severe.label;
  }
  return SEVERITY_THRESHOLDS.extreme.label;
}

/**
 * Interpret Y-BOCS total score with detailed French text
 */
export function interpretYbocsSzScore(totalScore: number): string {
  if (totalScore <= 7) {
    return 'Symptômes sous-cliniques. Les obsessions et/ou compulsions sont minimes ou absentes. Aucune interférence significative avec le fonctionnement quotidien.';
  }
  if (totalScore <= 15) {
    return 'TOC léger. Présence de symptômes obsessionnels-compulsifs occasionnant une gêne légère. Le fonctionnement quotidien reste globalement préservé.';
  }
  if (totalScore <= 23) {
    return 'TOC modéré. Symptômes obsessionnels-compulsifs significatifs avec impact notable sur le fonctionnement social et/ou professionnel. Un traitement est généralement indiqué.';
  }
  if (totalScore <= 31) {
    return 'TOC sévère. Symptômes envahissants causant une altération importante du fonctionnement. Détresse marquée. Prise en charge spécialisée fortement recommandée.';
  }
  return 'TOC extrême. Symptômes très sévères et invalidants. Altération majeure du fonctionnement dans tous les domaines. Prise en charge intensive urgente requise.';
}

// ============================================================================
// Question Options
// ============================================================================

const QUESTIONNAIRE_DONE_OPTIONS = [
  { code: 'Fait', label: 'Fait' },
  { code: 'Non fait', label: 'Non fait' },
];

// Q1: Obsessions - Time occupied
const Q1_OPTIONS = [
  { code: 0, label: 'Durée nulle.', score: 0 },
  { code: 1, label: "Durée légère (moins d'1 heure par jour) ou survenue occasionnelle (pas plus de 8 fois par jour).", score: 1 },
  { code: 2, label: 'Durée moyenne (1 à 3 heures par jour) ou survenue fréquente (plus de 8 fois par jour), mais la journée se passe la plus grande partie du temps sans obsession.', score: 2 },
  { code: 3, label: 'Durée importante (3 à 8 heures par jour) ou survenue très fréquente (plus de 8 fois par jour) et occupant une très grande partie de la journée.', score: 3 },
  { code: 4, label: 'Durée extrêmement importante (supérieure à 8 heures par jour), ou envahissement pratiquement constant.', score: 4 },
];

// Q2: Obsessions - Interference
const Q2_OPTIONS = [
  { code: 0, label: 'Gêne nulle dans mes activités sociales ou professionnelles.', score: 0 },
  { code: 1, label: "Gêne légère ou faible dans mes activités sociales ou professionnelles mais mon efficacité globale n'est pas altérée.", score: 1 },
  { code: 2, label: 'Gêne moyenne et nette gêne dans mes activités sociales et professionnelles mais je peux encore faire face.', score: 2 },
  { code: 3, label: 'Gêne importante, l\'angoisse cause une altération réelle de mes activités sociales et professionnelles.', score: 3 },
  { code: 4, label: 'Gêne extrêmement importante et invalidante.', score: 4 },
];

// Q3: Obsessions - Distress
const Q3_OPTIONS = [
  { code: 0, label: 'Angoisse nulle.', score: 0 },
  { code: 1, label: 'Angoisse légère, rare et très peu gênante.', score: 1 },
  { code: 2, label: 'Angoisse moyenne, fréquente et gênante, mais que je gère encore assez bien.', score: 2 },
  { code: 3, label: 'Angoisse importante, très fréquente et très gênante.', score: 3 },
  { code: 4, label: "Angoisse extrêmement importante, pratiquement constante et d'une gêne invalidante.", score: 4 },
];

// Q4: Obsessions - Resistance
const Q4_OPTIONS = [
  { code: 0, label: "Je fais l'effort de toujours résister, ou mes symptômes sont si minimes qu'ils ne nécessitent pas que je leur résiste.", score: 0 },
  { code: 1, label: "J'essaie de résister la plupart du temps.", score: 1 },
  { code: 2, label: 'Je fais quelques efforts pour résister.', score: 2 },
  { code: 3, label: 'Je cède à toutes les obsessions, sans essayer de les contrôler, mais je suis contrarié de ne pouvoir mieux faire.', score: 3 },
  { code: 4, label: 'Je cède totalement à toutes mes obsessions.', score: 4 },
];

// Q5: Obsessions - Control
const Q5_OPTIONS = [
  { code: 0, label: "J'ai un contrôle total sur mes pensées obsédantes.", score: 0 },
  { code: 1, label: "J'ai beaucoup de contrôle, je suis généralement capable de stopper ou de détourner mes obsessions avec quelques efforts et de la concentration.", score: 1 },
  { code: 2, label: "J'ai un contrôle moyen sur mes pensées obsédantes, je peux de temps en temps arriver à stopper ou à détourner mes obsessions.", score: 2 },
  { code: 3, label: "J'ai peu de contrôle sur mes pensées obsédantes, j'arrive rarement à stopper mes pensées obsédantes, je peux seulement détourner mon attention avec difficulté.", score: 3 },
  { code: 4, label: "Je n'ai pas de contrôle, je suis totalement dépourvu de volonté, je suis rarement capable de détourner mon attention de mes obsessions, même momentanément.", score: 4 },
];

// Q6: Compulsions - Time spent
const Q6_OPTIONS = [
  { code: 0, label: 'Durée nulle.', score: 0 },
  { code: 1, label: "Durée faible (moins d'1 heure par jour) ou rituels occasionnels (pas plus de 8 fois par jour).", score: 1 },
  { code: 2, label: "Durée brève (passe de 1 à 3 heures par jour), ou apparition fréquente des rituels (plus de 8 fois par jour, mais le temps, en majorité, n'est pas envahi par les rituels).", score: 2 },
  { code: 3, label: "Durée importante (passe plus de 3 heures et jusqu'à 8 heures par jour) ou apparition très fréquente des conduites ritualisées.", score: 3 },
  { code: 4, label: 'Durée extrêmement importante (passe plus de 8 heures par jour), ou présence pratiquement constante de conduites ritualisées.', score: 4 },
];

// Q7: Compulsions - Interference
const Q7_OPTIONS = [
  { code: 0, label: 'Gêne nulle dans mes activités sociales ou professionnelles.', score: 0 },
  { code: 1, label: "Gêne légère ou faible dans mes activités sociales ou professionnelles mais mon efficacité globale n'est pas altérée.", score: 1 },
  { code: 2, label: 'Gêne moyenne, nette gêne dans mes activités sociales et professionnelles mais je peux encore faire face.', score: 2 },
  { code: 3, label: 'Gêne importante, altération réelle de mes activités sociales et professionnelles.', score: 3 },
  { code: 4, label: 'Gêne extrêmement importante, invalidante.', score: 4 },
];

// Q8: Compulsions - Distress
const Q8_OPTIONS = [
  { code: 0, label: 'Anxiété nulle.', score: 0 },
  { code: 1, label: "Anxiété légère, je serais seulement légèrement anxieux si on m'empêchait de ritualiser.", score: 1 },
  { code: 2, label: "Anxiété moyenne, l'angoisse monterait mais resterait contrôlable si on m'empêchait de ritualiser.", score: 2 },
  { code: 3, label: 'Anxiété importante, augmentation très nette et très éprouvante de l\'anxiété si mes rituels sont interrompus.', score: 3 },
  { code: 4, label: "Anxiété extrêmement importante, invalidante dès qu'une intervention vise à modifier l'activité ritualisée.", score: 4 },
];

// Q9: Compulsions - Resistance
const Q9_OPTIONS = [
  { code: 0, label: "Je fais l'effort de toujours résister, ou mes symptômes sont si minimes qu'ils ne nécessitent pas qu'on leur résiste.", score: 0 },
  { code: 1, label: "J'essaie de résister la plupart du temps.", score: 1 },
  { code: 2, label: 'Je fais quelques efforts pour résister.', score: 2 },
  { code: 3, label: 'Je cède à tous les rituels, sans essayer de les contrôler, mais je suis contrarié de ne pouvoir mieux faire.', score: 3 },
  { code: 4, label: 'Je cède totalement à tous mes rituels.', score: 4 },
];

// Q10: Compulsions - Control
const Q10_OPTIONS = [
  { code: 0, label: "J'ai un contrôle total sur mes rituels.", score: 0 },
  { code: 1, label: "J'ai beaucoup de contrôle. Je ressens une certaine obligation à accomplir les rituels mais je peux généralement exercer un contrôle volontaire sur cette pression.", score: 1 },
  { code: 2, label: "J'ai un contrôle moyen, j'ai une forte obligation à accomplir mes rituels, je peux les contrôler avec difficulté.", score: 2 },
  { code: 3, label: "J'ai peu de contrôle, j'ai une très forte obligation à accomplir mes rituels. Je dois aller jusqu'au bout de mon activité ritualisée, je ne peux les différer qu'avec difficulté.", score: 3 },
  { code: 4, label: "Je n'ai aucun contrôle, je suis obligé d'accomplir les rituels. Ces rituels sont complètement involontaires et irrésistibles.", score: 4 },
];

// SYB: Score AUTO-YALE-BROWN summary items (simplified labels)
const SYB_OPTIONS = [
  { code: 0, label: 'Nul', score: 0 },
  { code: 1, label: 'Un peu', score: 1 },
  { code: 2, label: 'Moyen', score: 2 },
  { code: 3, label: 'Important', score: 3 },
  { code: 4, label: 'Extrêmement important', score: 4 },
];

// ============================================================================
// Questions Array
// ============================================================================

export const YBOCS_SZ_QUESTIONS: Question[] = [
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
    text: 'Merci de noter ce qui correspond le mieux à votre état actuel, en moyenne dans la semaine écoulée (une seule réponse par question).',
    type: 'instruction',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // ========================================================================
  // Section A: OBSESSIONS
  // ========================================================================
  {
    id: 'section_obsessions',
    text: 'A) LES OBSESSIONS OU PENSÉES OBSÉDANTES',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q1: Obsessions - Time occupied
  {
    id: 'q1',
    text: '1. Combien de temps durent les pensées obsédantes par jour? Ou bien, à quelle fréquence surviennent les obsessions? Autrement dit, combien de temps gagneriez-vous par jour si vous ne souffriez pas d\'obsessions?',
    type: 'single_choice',
    required: false,
    options: Q1_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'obsessions',
    help: 'Dimension: Temps occupé par les obsessions',
  },
  
  // Q2: Obsessions - Interference
  {
    id: 'q2',
    text: '2. Dans quelle mesure vos pensées obsédantes vous gênent-elles dans votre vie sociale ou professionnelle?',
    type: 'single_choice',
    required: false,
    options: Q2_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'obsessions',
    help: 'Dimension: Interférence des obsessions',
  },
  
  // Q3: Obsessions - Distress
  {
    id: 'q3',
    text: '3. Quel niveau d\'angoisse ces pensées obsédantes créent-elles en vous?',
    type: 'single_choice',
    required: false,
    options: Q3_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'obsessions',
    help: 'Dimension: Détresse associée aux obsessions',
  },
  
  // Q4: Obsessions - Resistance
  {
    id: 'q4',
    text: '4. Quel effort fournissez-vous pour résister aux pensées obsédantes?',
    type: 'single_choice',
    required: false,
    options: Q4_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'obsessions',
    help: 'Dimension: Résistance aux obsessions',
  },
  
  // Q5: Obsessions - Control
  {
    id: 'q5',
    text: '5. Quel contrôle exercez-vous sur vos pensées obsédantes? Dans quelle mesure arrivez-vous à stopper ou à détourner vos pensées obsédantes?',
    type: 'single_choice',
    required: false,
    options: Q5_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'obsessions',
    help: 'Dimension: Contrôle sur les obsessions',
  },
  
  // ========================================================================
  // Section B: COMPULSIONS
  // ========================================================================
  {
    id: 'section_compulsions',
    text: 'B) LES RITUELS OU COMPULSIONS',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q6: Compulsions - Time spent
  {
    id: 'q6',
    text: '6. Combien de temps passez-vous à faire des rituels? Combien de temps vous faut-il de plus qu\'à la majorité des gens pour accomplir les activités quotidiennes, du fait de vos rituels?',
    type: 'single_choice',
    required: false,
    options: Q6_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'compulsions',
    help: 'Dimension: Temps passé aux compulsions',
  },
  
  // Q7: Compulsions - Interference
  {
    id: 'q7',
    text: '7. Dans quelle mesure les rituels vous gênent-ils dans votre vie sociale ou professionnelle?',
    type: 'single_choice',
    required: false,
    options: Q7_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'compulsions',
    help: 'Dimension: Interférence des compulsions',
  },
  
  // Q8: Compulsions - Distress
  {
    id: 'q8',
    text: '8. Comment vous sentiriez-vous si l\'on vous empêchait de faire votre (vos) rituel(s)? Quel serait votre degré d\'anxiété?',
    type: 'single_choice',
    required: false,
    options: Q8_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'compulsions',
    help: 'Dimension: Détresse associée aux compulsions',
  },
  
  // Q9: Compulsions - Resistance
  {
    id: 'q9',
    text: '9. Quel effort fournissez-vous pour résister aux rituels?',
    type: 'single_choice',
    required: false,
    options: Q9_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'compulsions',
    help: 'Dimension: Résistance aux compulsions',
  },
  
  // Q10: Compulsions - Control
  {
    id: 'q10',
    text: '10. Quel contrôle pouvez-vous exercer sur les rituels? Parvenez-vous à les stopper ou à les diminuer?',
    type: 'single_choice',
    required: false,
    options: Q10_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'compulsions',
    help: 'Dimension: Contrôle sur les compulsions',
  },
  
  // ========================================================================
  // Section C: Score AUTO-YALE-BROWN (Summary Items)
  // ========================================================================
  {
    id: 'section_score_auto',
    text: 'Score AUTO-YALE-BROWN',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // SYB1: Temps passé aux obsessions
  {
    id: 'syb1',
    text: '1. Temps passé aux obsessions',
    type: 'single_choice',
    required: false,
    options: SYB_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'score_auto_yalebrown',
    help: 'Obsessions - Temps',
  },
  
  // SYB2: Gêne liée aux obsessions
  {
    id: 'syb2',
    text: '2. Gêne liée aux obsessions',
    type: 'single_choice',
    required: false,
    options: SYB_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'score_auto_yalebrown',
    help: 'Obsessions - Gêne',
  },
  
  // SYB3: Angoisse associée aux obsessions
  {
    id: 'syb3',
    text: '3. Angoisse associée aux obsessions',
    type: 'single_choice',
    required: false,
    options: SYB_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'score_auto_yalebrown',
    help: 'Obsessions - Angoisse',
  },
  
  // SYB4: Résistance aux obsessions
  {
    id: 'syb4',
    text: '4. Résistance aux obsessions',
    type: 'single_choice',
    required: false,
    options: SYB_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'score_auto_yalebrown',
    help: 'Obsessions - Résistance',
  },
  
  // SYB5: Contrôle sur les obsessions
  {
    id: 'syb5',
    text: '5. Contrôle sur les obsessions',
    type: 'single_choice',
    required: false,
    options: SYB_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'score_auto_yalebrown',
    help: 'Obsessions - Contrôle',
  },
  
  // SYB6: Temps passé aux compulsions
  {
    id: 'syb6',
    text: '6. Temps passé aux compulsions',
    type: 'single_choice',
    required: false,
    options: SYB_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'score_auto_yalebrown',
    help: 'Compulsions - Temps',
  },
  
  // SYB7: Gêne liée aux compulsions
  {
    id: 'syb7',
    text: '7. Gêne liée aux compulsions',
    type: 'single_choice',
    required: false,
    options: SYB_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'score_auto_yalebrown',
    help: 'Compulsions - Gêne',
  },
  
  // SYB8: Anxiété associée aux compulsions
  {
    id: 'syb8',
    text: '8. Anxiété associée aux compulsions',
    type: 'single_choice',
    required: false,
    options: SYB_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'score_auto_yalebrown',
    help: 'Compulsions - Anxiété',
  },
  
  // SYB9: Résistance aux compulsions
  {
    id: 'syb9',
    text: '9. Résistance aux compulsions',
    type: 'single_choice',
    required: false,
    options: SYB_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'score_auto_yalebrown',
    help: 'Compulsions - Résistance',
  },
  
  // SYB10: Contrôle sur les compulsions
  {
    id: 'syb10',
    text: '10. Contrôle sur les compulsions',
    type: 'single_choice',
    required: false,
    options: SYB_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'score_auto_yalebrown',
    help: 'Compulsions - Contrôle',
  },
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const YBOCS_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'ybocs_sz',
  code: 'YBOCS_SZ',
  title: 'Y-BOCS - Échelle de Yale-Brown pour les Obsessions-Compulsions',
  description: "L'échelle de Yale-Brown (Y-BOCS) est l'instrument de référence pour évaluer la sévérité des symptômes obsessionnels et compulsifs. Cette version auto-administrée comprend 10 items principaux évaluant 5 dimensions pour les obsessions (Q1-Q5) et 5 pour les compulsions (Q6-Q10). Score total: 0-40.",
  questions: YBOCS_SZ_QUESTIONS,
  metadata: {
    pathologies: ['schizophrenia'],
    target_role: 'patient',
    instructions: 'Merci de noter ce qui correspond le mieux à votre état actuel, en moyenne dans la semaine écoulée.',
    reference: 'Goodman WK, Price LH, Rasmussen SA, et al. The Yale-Brown Obsessive Compulsive Scale. Arch Gen Psychiatry. 1989. French adaptation: Sauteraud A. 2005.',
    subscales: SUBSCALE_ITEMS,
    dimensions: DIMENSIONS,
    severity_thresholds: SEVERITY_THRESHOLDS,
    clinical_cutoff: CLINICAL_CUTOFF,
    score_range: { min: 0, max: 40 },
    subscale_ranges: {
      obsessions: { min: 0, max: 20 },
      compulsions: { min: 0, max: 20 }
    }
  }
};
