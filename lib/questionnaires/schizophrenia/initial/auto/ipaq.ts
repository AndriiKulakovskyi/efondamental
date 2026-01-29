// eFondaMental Platform - IPAQ (International Physical Activity Questionnaire)
// Schizophrenia Initial Evaluation - Autoquestionnaire Module
// Reference: Craig CL, Marshall AL, Sjöström M, et al. International physical activity questionnaire: 12-country reliability and validity. Med Sci Sports Exerc. 2003;35(8):1381-1395.

import { Question, QuestionnaireDefinition } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaIpaqResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  questionnaire_done?: string;
  
  // Vigorous activity
  vigorous_days: number | null;
  vigorous_hours: number | null;
  vigorous_minutes: number | null;
  
  // Moderate activity
  moderate_days: number | null;
  moderate_hours: number | null;
  moderate_minutes: number | null;
  
  // Walking
  walking_days: number | null;
  walking_hours: number | null;
  walking_minutes: number | null;
  walking_pace: string | null;
  
  // Sitting time
  sitting_weekday_hours: number | null;
  sitting_weekday_minutes: number | null;
  sitting_weekend_hours: number | null;
  sitting_weekend_minutes: number | null;
  
  // Computed scores
  vigorous_met_minutes: number | null;
  moderate_met_minutes: number | null;
  walking_met_minutes: number | null;
  total_met_minutes: number | null;
  activity_level: string | null;
  sitting_weekday_total: number | null;
  sitting_weekend_total: number | null;
  interpretation: string | null;
  
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaIpaqResponseInsert = Omit<
  SchizophreniaIpaqResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 
  'vigorous_met_minutes' | 'moderate_met_minutes' | 'walking_met_minutes' | 
  'total_met_minutes' | 'activity_level' | 'sitting_weekday_total' | 
  'sitting_weekend_total' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Score Result Type
// ============================================================================

export interface IpaqSzScoreResult {
  vigorous_met_minutes: number;
  moderate_met_minutes: number;
  walking_met_minutes: number;
  total_met_minutes: number;
  activity_level: 'low' | 'moderate' | 'high';
  sitting_weekday_total: number;
  sitting_weekend_total: number;
  interpretation: string;
}

// ============================================================================
// MET Constants
// ============================================================================

export const IPAQ_MET_VALUES = {
  vigorous: 8.0,
  moderate: 4.0,
  walking: {
    vigorous: 5.0,  // Brisk walking
    moderate: 3.3,  // Default
    slow: 2.5
  }
} as const;

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Get walking MET value based on pace
 */
export function getWalkingMET(pace: string | null | undefined): number {
  if (!pace) return IPAQ_MET_VALUES.walking.moderate;
  
  if (pace.includes('vive allure') || pace.includes('vigorous')) {
    return IPAQ_MET_VALUES.walking.vigorous;
  }
  if (pace.includes('lente') || pace.includes('slow')) {
    return IPAQ_MET_VALUES.walking.slow;
  }
  return IPAQ_MET_VALUES.walking.moderate;
}

/**
 * Calculate minutes per day from hours and minutes
 */
export function calculateMinutesPerDay(hours: number | null | undefined, minutes: number | null | undefined): number {
  return ((hours || 0) * 60) + (minutes || 0);
}

/**
 * Compute MET-minutes for each activity domain
 */
export function computeIpaqMETMinutes(responses: {
  vigorous_days: number | null;
  vigorous_hours: number | null;
  vigorous_minutes: number | null;
  moderate_days: number | null;
  moderate_hours: number | null;
  moderate_minutes: number | null;
  walking_days: number | null;
  walking_hours: number | null;
  walking_minutes: number | null;
  walking_pace: string | null;
}): { vigorous: number; moderate: number; walking: number; total: number } {
  // Vigorous activity: 8.0 MET × days × minutes/day
  const vigorousMinutesPerDay = calculateMinutesPerDay(responses.vigorous_hours, responses.vigorous_minutes);
  const vigorousDays = responses.vigorous_days || 0;
  const vigorousMET = IPAQ_MET_VALUES.vigorous * vigorousDays * vigorousMinutesPerDay;
  
  // Moderate activity: 4.0 MET × days × minutes/day
  const moderateMinutesPerDay = calculateMinutesPerDay(responses.moderate_hours, responses.moderate_minutes);
  const moderateDays = responses.moderate_days || 0;
  const moderateMET = IPAQ_MET_VALUES.moderate * moderateDays * moderateMinutesPerDay;
  
  // Walking: MET varies by pace × days × minutes/day
  const walkingMinutesPerDay = calculateMinutesPerDay(responses.walking_hours, responses.walking_minutes);
  const walkingDays = responses.walking_days || 0;
  const walkingMETValue = getWalkingMET(responses.walking_pace);
  const walkingMET = walkingMETValue * walkingDays * walkingMinutesPerDay;
  
  return {
    vigorous: vigorousMET,
    moderate: moderateMET,
    walking: walkingMET,
    total: vigorousMET + moderateMET + walkingMET
  };
}

/**
 * Classify activity level according to IPAQ guidelines
 * HIGH: ≥3 days vigorous with ≥1500 MET-min/week, OR ≥7 days combined with ≥3000 MET-min/week
 * MODERATE: ≥3 days vigorous ≥20 min/day, OR ≥5 days moderate/walking ≥30 min/day, OR ≥5 days combined ≥600 MET-min/week
 * LOW: Does not meet moderate or high criteria
 */
export function classifyActivityLevel(responses: {
  vigorous_days: number | null;
  vigorous_hours: number | null;
  vigorous_minutes: number | null;
  moderate_days: number | null;
  moderate_hours: number | null;
  moderate_minutes: number | null;
  walking_days: number | null;
  walking_hours: number | null;
  walking_minutes: number | null;
  walking_pace: string | null;
}): 'low' | 'moderate' | 'high' {
  const metScores = computeIpaqMETMinutes(responses);
  
  const vigorousDays = responses.vigorous_days || 0;
  const moderateDays = responses.moderate_days || 0;
  const walkingDays = responses.walking_days || 0;
  
  const vigorousMinutesPerDay = calculateMinutesPerDay(responses.vigorous_hours, responses.vigorous_minutes);
  const moderateMinutesPerDay = calculateMinutesPerDay(responses.moderate_hours, responses.moderate_minutes);
  const walkingMinutesPerDay = calculateMinutesPerDay(responses.walking_hours, responses.walking_minutes);
  
  // Calculate total days (unique days with any activity)
  const totalDays = Math.min(7, vigorousDays + moderateDays + walkingDays);
  
  // HIGH criteria
  // Criterion 1: ≥3 days vigorous activity AND ≥1500 MET-min/week from vigorous
  const highCriterion1 = vigorousDays >= 3 && metScores.vigorous >= 1500;
  // Criterion 2: ≥7 days of any combination AND ≥3000 total MET-min/week
  const highCriterion2 = totalDays >= 7 && metScores.total >= 3000;
  
  if (highCriterion1 || highCriterion2) {
    return 'high';
  }
  
  // MODERATE criteria
  // Criterion 1: ≥3 days vigorous activity, ≥20 min/day
  const moderateCriterion1 = vigorousDays >= 3 && vigorousMinutesPerDay >= 20;
  // Criterion 2: ≥5 days moderate or walking, ≥30 min/day
  const moderateCriterion2 = (moderateDays + walkingDays) >= 5 && 
    ((moderateMinutesPerDay >= 30) || (walkingMinutesPerDay >= 30));
  // Criterion 3: ≥5 days any combination AND ≥600 MET-min/week
  const moderateCriterion3 = totalDays >= 5 && metScores.total >= 600;
  
  if (moderateCriterion1 || moderateCriterion2 || moderateCriterion3) {
    return 'moderate';
  }
  
  return 'low';
}

/**
 * Generate interpretation text for IPAQ scores
 */
export function interpretIpaqScore(
  metScores: { vigorous: number; moderate: number; walking: number; total: number },
  activityLevel: 'low' | 'moderate' | 'high',
  sittingWeekday: number,
  sittingWeekend: number
): string {
  let interpretation = `Score total: ${Math.round(metScores.total)} MET-minutes/semaine. `;
  
  // Activity level interpretation
  if (activityLevel === 'high') {
    interpretation += 'Niveau d\'activité ÉLEVÉ - Atteint les recommandations de santé publique avec marge. ';
  } else if (activityLevel === 'moderate') {
    interpretation += 'Niveau d\'activité MODÉRÉ - Atteint les recommandations minimales d\'activité physique. ';
  } else {
    interpretation += 'Niveau d\'activité FAIBLE - N\'atteint pas les recommandations minimales d\'activité physique. ';
  }
  
  // WHO guidelines comparison
  if (metScores.total >= 600) {
    interpretation += 'Conforme aux recommandations OMS (≥600 MET-min/semaine). ';
  } else {
    interpretation += 'En dessous des recommandations OMS (≥600 MET-min/semaine). ';
  }
  
  // Domain breakdown
  interpretation += `Détail: Intense ${Math.round(metScores.vigorous)}, Modéré ${Math.round(metScores.moderate)}, Marche ${Math.round(metScores.walking)} MET-min. `;
  
  // Sitting time
  interpretation += `Temps assis: ${Math.round(sittingWeekday)} min/jour (semaine), ${Math.round(sittingWeekend)} min/jour (week-end).`;
  
  return interpretation;
}

// ============================================================================
// Questions Dictionary
// ============================================================================

export const IPAQ_SZ_QUESTIONS: Question[] = [
  // Administration status
  {
    id: 'questionnaire_done',
    text: 'Passation du questionnaire',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'Fait', label: 'Fait', score: 1 },
      { code: 'Non fait', label: 'Non fait', score: 0 }
    ]
  },
  // Instructions
  {
    id: 'instruction_consigne',
    text: 'Ce questionnaire a été conçu pour évaluer votre activité physique au quotidien lors des 7 derniers jours.\n\n"Activité physique intense" se réfère à une activité qui demande un effort physique intense et qui vous fait respirer beaucoup plus qu\'en temps normal.\n\n"Activité physique modérée" se réfère à une activité qui demande un effort physique modéré et qui vous fait respirer un peu plus qu\'en temps normal.\n\nEn répondant aux questions suivantes, pensez uniquement aux exercices physiques que vous avez faits pendant au moins 10 minutes consécutives.',
    type: 'instruction',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  
  // ========== VIGOROUS ACTIVITY ==========
  // {
  //   id: 'section_vigorous',
  //   text: 'Activité physique intense',
  //   type: 'section',
  //   required: false,
  //   display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  // },
  {
    id: 'vigorous_days',
    text: '1a. Durant ces 7 derniers jours, combien de jours avez-vous fait de l\'activité physique intense comme lever des poids lourds, pelleter ou bêcher, faire de l\'aérobic, faire du vélo à un rythme élevé?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucun jour', score: 0 },
      { code: 1, label: '1 jour', score: 1 },
      { code: 2, label: '2 jours', score: 2 },
      { code: 3, label: '3 jours', score: 3 },
      { code: 4, label: '4 jours', score: 4 },
      { code: 5, label: '5 jours', score: 5 },
      { code: 6, label: '6 jours', score: 6 },
      { code: 7, label: '7 jours', score: 7 }
    ],
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'vigorous_hours',
    text: '1b. Combien de temps par jour au total avez-vous passé à faire de l\'activité physique intense? (heures)',
    type: 'number',
    required: false,
    min: 0,
    max: 24,
    display_if: { 'and': [
      { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
      { '>': [{ var: 'vigorous_days' }, 0] }
    ]}
  },
  {
    id: 'vigorous_minutes',
    text: '(minutes)',
    type: 'number',
    required: false,
    min: 0,
    max: 59,
    display_if: { 'and': [
      { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
      { '>': [{ var: 'vigorous_days' }, 0] }
    ]}
  },
  
  // ========== MODERATE ACTIVITY ==========
  // {
  //   id: 'section_moderate',
  //   text: 'Activité physique modérée',
  //   type: 'section',
  //   required: false,
  //   display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  // },
  {
    id: 'moderate_days',
    text: '2a. Durant ces 7 derniers jours, combien de jours avez-vous fait de l\'activité physique modérée comme lever des poids légers, faire du vélo à un rythme modéré ou faire une séance de tennis à intensité légère? (Ne pas inclure la marche)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucun jour', score: 0 },
      { code: 1, label: '1 jour', score: 1 },
      { code: 2, label: '2 jours', score: 2 },
      { code: 3, label: '3 jours', score: 3 },
      { code: 4, label: '4 jours', score: 4 },
      { code: 5, label: '5 jours', score: 5 },
      { code: 6, label: '6 jours', score: 6 },
      { code: 7, label: '7 jours', score: 7 }
    ],
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'moderate_hours',
    text: '2b. Combien de temps par jour au total avez-vous passé à faire de l\'activité physique modérée? (heures)',
    type: 'number',
    required: false,
    min: 0,
    max: 24,
    display_if: { 'and': [
      { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
      { '>': [{ var: 'moderate_days' }, 0] }
    ]}
  },
  {
    id: 'moderate_minutes',
    text: '(minutes)',
    type: 'number',
    required: false,
    min: 0,
    max: 59,
    display_if: { 'and': [
      { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
      { '>': [{ var: 'moderate_days' }, 0] }
    ]}
  },
  
  // ========== WALKING ==========
  // {
  //   id: 'section_walking',
  //   text: 'Marche',
  //   type: 'section',
  //   required: false,
  //   display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  // },
  {
    id: 'walking_days',
    text: '3a. Durant ces 7 derniers jours, combien de jours avez-vous marché pendant au moins 10 minutes consécutives? Ceci inclut la marche au travail, à la maison, lors de déplacements, pendant les loisirs, le sport ou toute autre activité récréative.',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: 'Aucun jour', score: 0 },
      { code: 1, label: '1 jour', score: 1 },
      { code: 2, label: '2 jours', score: 2 },
      { code: 3, label: '3 jours', score: 3 },
      { code: 4, label: '4 jours', score: 4 },
      { code: 5, label: '5 jours', score: 5 },
      { code: 6, label: '6 jours', score: 6 },
      { code: 7, label: '7 jours', score: 7 }
    ],
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'walking_hours',
    text: '3b. Combien de temps, par jour, pendant ces derniers jours, avez-vous marché? (heures)',
    type: 'number',
    required: false,
    min: 0,
    max: 24,
    display_if: { 'and': [
      { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
      { '>': [{ var: 'walking_days' }, 0] }
    ]}
  },
  {
    id: 'walking_minutes',
    text: '(minutes)',
    type: 'number',
    required: false,
    min: 0,
    max: 59,
    display_if: { 'and': [
      { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
      { '>': [{ var: 'walking_days' }, 0] }
    ]}
  },
  {
    id: 'walking_pace',
    text: '3c. À quelle allure marchez-vous habituellement?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'vigorous', label: 'À vive allure, qui vous a fait respirer à un rythme plus élevé qu\'en temps normal', score: 5 },
      { code: 'moderate', label: 'À une allure modérée, qui vous a fait respirer à un rythme un peu plus élevé qu\'en temps normal', score: 3.3 },
      { code: 'slow', label: 'À une allure lente, qui n\'a pas changé le rythme de votre respiration', score: 2.5 }
    ],
    display_if: { 'and': [
      { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
      { '>': [{ var: 'walking_days' }, 0] }
    ]}
  },
  
  // ========== SITTING TIME ==========
  // {
  //   id: 'section_sitting',
  //   text: 'Temps assis',
  //   type: 'section',
  //   required: false,
  //   display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  // },
  {
    id: 'instruction_sitting',
    text: 'Les dernières questions sont en rapport avec le temps que vous avez passé assis durant la journée que ce soit au travail, à la maison ou durant votre temps libre. Ceci inclut le temps que vous avez passé en position assise à un bureau, lors d\'une visite chez des amis, à lire, assis ou étendu devant la télévision.',
    type: 'instruction',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'sitting_weekday_hours',
    text: '4a. Durant ces 7 derniers jours, combien de temps au total par jour avez-vous passé en position assise (jour de semaine)? (heures)',
    type: 'number',
    required: false,
    min: 0,
    max: 24,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'sitting_weekday_minutes',
    text: '(minutes)',
    type: 'number',
    required: false,
    min: 0,
    max: 59,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'sitting_weekend_hours',
    text: '4b. Durant ces 7 derniers jours, combien de temps au total par jour avez-vous passé en position assise (jour de week-end)? (heures)',
    type: 'number',
    required: false,
    min: 0,
    max: 24,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'sitting_weekend_minutes',
    text: '(minutes)',
    type: 'number',
    required: false,
    min: 0,
    max: 59,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const IPAQ_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'ipaq_sz',
  code: 'IPAQ_SZ',
  title: 'IPAQ - Activité physique',
  description: 'Le questionnaire IPAQ (International Physical Activity Questionnaire) version courte évalue l\'activité physique pratiquée au cours des 7 derniers jours. Il mesure trois types d\'activités (intense, modérée, marche) ainsi que le temps passé en position assise.',
  questions: IPAQ_SZ_QUESTIONS,
  metadata: {
    pathologies: ['schizophrenia'],
    target_role: 'patient',
    version: 'Short Form',
    language: 'fr-FR',
    singleColumn: true,
    reference: 'Craig CL, Marshall AL, Sjöström M, et al. International physical activity questionnaire: 12-country reliability and validity. Med Sci Sports Exerc. 2003;35(8):1381-1395.'
  }
};
