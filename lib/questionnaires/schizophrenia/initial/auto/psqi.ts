// ============================================================================
// eFondaMental Platform - Schizophrenia Initial Evaluation
// PSQI Questionnaire (Pittsburgh Sleep Quality Index)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching schizophrenia_psqi table schema
// ============================================================================

export interface SchizophreniaPsqiResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Administration
  questionnaire_done?: string | null;  // 'Fait' | 'Non fait'
  
  // Sleep times and duration
  q1_bedtime?: string | null;        // HH:MM format
  q2_minutes_to_sleep?: number | null;
  q3_waketime?: string | null;       // HH:MM format
  q4_hours_sleep?: string | null;    // HH:MM format
  
  // Sleep disturbances (q5a-q5j)
  q5a?: number | null;
  q5b?: number | null;
  q5c?: number | null;
  q5d?: number | null;
  q5e?: number | null;
  q5f?: number | null;
  q5g?: number | null;
  q5h?: number | null;
  q5i?: number | null;
  q5j?: number | null;
  q5j_text?: string | null;
  
  // Quality and medication
  q6?: number | null;
  q7?: number | null;
  q8?: number | null;
  q9?: number | null;
  
  // Bed partner (not scored)
  q10?: string | null;
  q10a?: number | null;
  q10b?: number | null;
  q10c?: number | null;
  q10d?: number | null;
  q10_autre?: string | null;
  
  // Component scores
  c1_subjective_quality?: number | null;
  c2_latency?: number | null;
  c3_duration?: number | null;
  c4_efficiency?: number | null;
  c5_disturbances?: number | null;
  c6_medication?: number | null;
  c7_daytime_dysfunction?: number | null;
  
  // Total score and interpretation
  total_score?: number | null;
  interpretation?: string | null;
  
  // Calculated values
  time_in_bed_hours?: number | null;
  sleep_efficiency_pct?: number | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaPsqiResponseInsert = Omit<
  SchizophreniaPsqiResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'c1_subjective_quality' | 
  'c2_latency' | 'c3_duration' | 'c4_efficiency' | 'c5_disturbances' | 'c6_medication' |
  'c7_daytime_dysfunction' | 'total_score' | 'interpretation' | 'time_in_bed_hours' | 'sleep_efficiency_pct'
>;

// ============================================================================
// Options Constants
// ============================================================================

const FREQUENCY_OPTIONS = [
  { code: 0, label: 'Jamais au cours des 30 derniers jours', score: 0 },
  { code: 1, label: 'Moins d\'une fois par semaine', score: 1 },
  { code: 2, label: 'Une ou deux fois par semaine', score: 2 },
  { code: 3, label: 'Trois fois par semaine ou plus', score: 3 }
];

const QUALITY_OPTIONS = [
  { code: 0, label: 'Très bonne', score: 0 },
  { code: 1, label: 'Assez bonne', score: 1 },
  { code: 2, label: 'Assez mauvaise', score: 2 },
  { code: 3, label: 'Très mauvaise', score: 3 }
];

const DIFFICULTY_OPTIONS = [
  { code: 0, label: 'Pas difficile du tout', score: 0 },
  { code: 1, label: 'Légèrement difficile', score: 1 },
  { code: 2, label: 'Assez difficile', score: 2 },
  { code: 3, label: 'Très difficile', score: 3 }
];

const BED_PARTNER_OPTIONS = [
  { code: 'non', label: 'Non, je ne partage ni mon lit ni mon logement avec quelqu\'un' },
  { code: 'autre_chambre', label: 'Oui, je partage mon logement avec une personne qui dort dans une autre chambre' },
  { code: 'meme_chambre', label: 'Oui, avec une personne dans la même chambre, mais pas dans le même lit' },
  { code: 'meme_lit', label: 'Oui, avec une personne dans le même lit' }
];

// ============================================================================
// Questions Dictionary
// ============================================================================

export const PSQI_SZ_QUESTIONS: Question[] = [
  // Administration
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

  // Instructions
  {
    id: 'instructions',
    text: 'Évaluation de la qualité du sommeil',
    type: 'section',
    required: false,
    help: 'Les questions suivantes portent sur vos habitudes de sommeil uniquement au cours des 30 derniers jours. Vos réponses doivent être aussi précises que possible et refléter la plupart des 30 derniers jours et nuits.',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },

  // Q1-Q4: Sleep times and duration
  {
    id: 'q1_bedtime',
    text: '1. Au cours des 30 derniers jours, à quelle heure vous êtes-vous généralement couché(e) le soir? (format HH:MM)',
    type: 'text',
    required: false,
    help: 'À noter en H24. Ex: si le patient se couche à 23:00 ne surtout pas mettre 11H (du soir)',
    metadata: { placeholder: 'HH:MM', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' },
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q2_minutes_to_sleep',
    text: '2. Au cours des 30 derniers jours, au bout de combien de temps (en minutes) vous êtes-vous généralement endormi(e) le soir?',
    type: 'number',
    required: false,
    min: 0,
    help: 'Indiquer le nombre de minutes',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q3_waketime',
    text: '3. Au cours des 30 derniers jours, à quelle heure vous êtes-vous généralement levé(e) le matin? (format HH:MM)',
    type: 'text',
    required: false,
    help: 'À noter en H24',
    metadata: { placeholder: 'HH:MM', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' },
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q4_hours_sleep',
    text: '4. Au cours des 30 derniers jours, combien d\'heures avez-vous vraiment dormi par nuit? (format HH:MM)',
    type: 'text',
    required: false,
    help: 'À noter en H24. Ex: si vous avez dormi 6 heures et 30 minutes, notez 06:30',
    metadata: { placeholder: 'HH:MM', pattern: '^([01]\\d|2[0-4]):[0-5]\\d$' },
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },

  // Q5: Sleep disturbances section
  {
    id: 'section_q5',
    text: 'Question 5 - Troubles du sommeil',
    type: 'section',
    required: false,
    help: 'Au cours des 30 derniers jours, combien de fois avez-vous eu des troubles du sommeil à cause des problèmes suivants?',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q5a',
    text: '5a. Vous n\'êtes pas arrivé(e) à vous endormir en 30 minutes',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q5b',
    text: '5b. Vous vous êtes réveillé(e) au milieu de la nuit ou plus tôt que d\'habitude',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q5c',
    text: '5c. Vous avez dû vous lever pour aller aux toilettes',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q5d',
    text: '5d. Vous avez eu du mal à respirer',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q5e',
    text: '5e. Vous avez toussé ou ronflé bruyamment',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q5f',
    text: '5f. Vous avez eu trop froid',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q5g',
    text: '5g. Vous avez eu trop chaud',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q5h',
    text: '5h. Vous avez fait des cauchemars',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q5i',
    text: '5i. Vous avez eu des douleurs',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q5j',
    text: '5j. Combien de fois, au cours des 30 derniers jours, avez-vous eu des difficultés à dormir pour d\'autres raisons?',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q5j_text',
    text: 'Préciser les autres raisons',
    type: 'text',
    required: false,
    display_if: { 'and': [
      { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
      { '>': [{ var: 'q5j' }, 0] }
    ]}
  },

  // Q6-Q9: Quality, medication, daytime dysfunction
  {
    id: 'section_quality',
    text: 'Qualité subjective du sommeil',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q6',
    text: '6. Comment qualifieriez-vous la qualité de votre sommeil en général au cours des 30 derniers jours?',
    type: 'single_choice',
    required: false,
    options: QUALITY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q7',
    text: '7. Au cours des 30 derniers jours, combien de fois avez-vous pris des médicaments pour mieux dormir (médicaments prescrits par votre médecin ou vendus sans ordonnance)?',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q8',
    text: '8. Au cours des 30 derniers jours, combien de fois avez-vous eu des difficultés à rester éveillé(e) en conduisant, en mangeant, ou en participant à des activités avec d\'autres personnes?',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q9',
    text: '9. Au cours des 30 derniers jours, combien vous a-t-il été difficile d\'être suffisamment motivé(e) pour mener à bien vos activités?',
    type: 'single_choice',
    required: false,
    options: DIFFICULTY_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },

  // Q10: Bed partner section (not scored)
  {
    id: 'section_bed_partner',
    text: 'Partenaire de lit',
    type: 'section',
    required: false,
    help: 'Ces questions ne sont pas incluses dans le score PSQI.',
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'q10',
    text: '10. Partagez-vous votre lit ou votre logement avec quelqu\'un?',
    type: 'single_choice',
    required: false,
    options: BED_PARTNER_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] }
  },
  {
    id: 'instruction_q10_details',
    text: 'Si vous partagez votre lit ou votre chambre avec quelqu\'un, demandez-lui/elle combien de fois au cours des 30 derniers jours:',
    type: 'instruction',
    required: false,
    display_if: { 'and': [
      { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
      { '!=': [{ var: 'q10' }, 'non'] },
      { '!=': [{ var: 'q10' }, null] }
    ]}
  },
  {
    id: 'q10a',
    text: '10a. Vous avez ronflé bruyamment',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { 'and': [
      { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
      { '!=': [{ var: 'q10' }, 'non'] },
      { '!=': [{ var: 'q10' }, null] }
    ]}
  },
  {
    id: 'q10b',
    text: '10b. Vous avez fait de longues pauses entre les respirations en dormant',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { 'and': [
      { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
      { '!=': [{ var: 'q10' }, 'non'] },
      { '!=': [{ var: 'q10' }, null] }
    ]}
  },
  {
    id: 'q10c',
    text: '10c. Vous avez eu des secousses ou des mouvements brusques des jambes en dormant',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { 'and': [
      { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
      { '!=': [{ var: 'q10' }, 'non'] },
      { '!=': [{ var: 'q10' }, null] }
    ]}
  },
  {
    id: 'q10d',
    text: '10d. Vous avez eu de courtes périodes de désorientation ou de confusion en vous réveillant la nuit',
    type: 'single_choice',
    required: false,
    options: FREQUENCY_OPTIONS,
    display_if: { 'and': [
      { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
      { '!=': [{ var: 'q10' }, 'non'] },
      { '!=': [{ var: 'q10' }, null] }
    ]}
  },
  {
    id: 'q10_autre',
    text: 'Autres types d\'agitation pendant votre sommeil, merci de préciser',
    type: 'text',
    required: false,
    display_if: { 'and': [
      { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
      { '!=': [{ var: 'q10' }, 'non'] },
      { '!=': [{ var: 'q10' }, null] }
    ]}
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const PSQI_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'psqi_sz',
  code: 'PSQI_SZ',
  title: 'PSQI',
  description: 'Indice de Qualité du Sommeil de Pittsburgh',
  questions: PSQI_SZ_QUESTIONS,
  metadata: {
    pathologies: ['schizophrenia'],
    target_role: 'patient',
    reference: 'Buysse DJ, Reynolds CF, Monk TH, Berman SR, Kupfer DJ. The Pittsburgh Sleep Quality Index: a new instrument for psychiatric practice and research. Psychiatry Res. 1989;28(2):193-213.'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Parse HH:MM time string to decimal hours
 */
function parseHoursMinutes(timeStr: string | null | undefined): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) + (minutes || 0) / 60;
}

/**
 * Calculate time difference between two HH:MM times (accounting for overnight)
 */
function calculateTimeDifference(start: string, end: string): number {
  const startHours = parseHoursMinutes(start);
  const endHours = parseHoursMinutes(end);
  
  let diff = endHours - startHours;
  if (diff < 0) diff += 24; // Overnight adjustment
  
  return diff;
}

export interface PsqiSzScoreResult {
  c1_subjective_quality: number;
  c2_latency: number;
  c3_duration: number;
  c4_efficiency: number;
  c5_disturbances: number;
  c6_medication: number;
  c7_daytime_dysfunction: number;
  total_score: number;
  time_in_bed_hours: number;
  sleep_efficiency_pct: number;
  interpretation: string;
}

/**
 * Compute all 7 PSQI component scores and global score
 * Based on Buysse et al. (1989) scoring methodology
 */
export function computePsqiSzScores(responses: Record<string, any>): PsqiSzScoreResult {
  // Component 1: Subjective sleep quality (Q6)
  // Score = Q6 value directly (0-3)
  const c1 = responses.q6 ?? 0;
  
  // Component 2: Sleep latency (Q2 + Q5a)
  // Step 1: Convert Q2 minutes to score
  const q2Minutes = responses.q2_minutes_to_sleep ?? 0;
  let q2Score = 0;
  if (q2Minutes <= 15) q2Score = 0;
  else if (q2Minutes <= 30) q2Score = 1;
  else if (q2Minutes <= 60) q2Score = 2;
  else q2Score = 3;
  
  // Step 2: Add Q5a score and map to component score
  const q5a = responses.q5a ?? 0;
  const latencySum = q2Score + q5a;
  let c2 = 0;
  if (latencySum === 0) c2 = 0;
  else if (latencySum <= 2) c2 = 1;
  else if (latencySum <= 4) c2 = 2;
  else c2 = 3;
  
  // Component 3: Sleep duration (Q4)
  // ≥7h=0, 6-7h=1, 5-6h=2, <5h=3
  const sleepHours = parseHoursMinutes(responses.q4_hours_sleep);
  let c3 = 0;
  if (sleepHours >= 7) c3 = 0;
  else if (sleepHours >= 6) c3 = 1;
  else if (sleepHours >= 5) c3 = 2;
  else c3 = 3;
  
  // Component 4: Habitual sleep efficiency
  // Efficiency = (Q4 sleep hours / Time in bed) × 100
  // Time in bed = Q3 wake time - Q1 bedtime
  const bedtime = responses.q1_bedtime;
  const waketime = responses.q3_waketime;
  const timeInBed = bedtime && waketime ? calculateTimeDifference(bedtime, waketime) : 8;
  const efficiency = timeInBed > 0 ? (sleepHours / timeInBed) * 100 : 0;
  
  let c4 = 0;
  if (efficiency >= 85) c4 = 0;
  else if (efficiency >= 75) c4 = 1;
  else if (efficiency >= 65) c4 = 2;
  else c4 = 3;
  
  // Component 5: Sleep disturbances (Q5b-Q5j sum)
  // Sum range 0-27, mapped: 0=0, 1-9=1, 10-18=2, 19-27=3
  const disturbanceSum = 
    (responses.q5b ?? 0) + (responses.q5c ?? 0) + (responses.q5d ?? 0) +
    (responses.q5e ?? 0) + (responses.q5f ?? 0) + (responses.q5g ?? 0) +
    (responses.q5h ?? 0) + (responses.q5i ?? 0) + (responses.q5j ?? 0);
  
  let c5 = 0;
  if (disturbanceSum === 0) c5 = 0;
  else if (disturbanceSum <= 9) c5 = 1;
  else if (disturbanceSum <= 18) c5 = 2;
  else c5 = 3;
  
  // Component 6: Use of sleep medication (Q7)
  // Score = Q7 value directly (0-3)
  const c6 = responses.q7 ?? 0;
  
  // Component 7: Daytime dysfunction (Q8 + Q9)
  // Sum range 0-6, mapped: 0=0, 1-2=1, 3-4=2, 5-6=3
  const daySum = (responses.q8 ?? 0) + (responses.q9 ?? 0);
  let c7 = 0;
  if (daySum === 0) c7 = 0;
  else if (daySum <= 2) c7 = 1;
  else if (daySum <= 4) c7 = 2;
  else c7 = 3;
  
  // Total score (0-21)
  const total = c1 + c2 + c3 + c4 + c5 + c6 + c7;
  
  return {
    c1_subjective_quality: c1,
    c2_latency: c2,
    c3_duration: c3,
    c4_efficiency: c4,
    c5_disturbances: c5,
    c6_medication: c6,
    c7_daytime_dysfunction: c7,
    total_score: total,
    time_in_bed_hours: parseFloat(timeInBed.toFixed(2)),
    sleep_efficiency_pct: parseFloat(efficiency.toFixed(2)),
    interpretation: interpretPsqiSzScore(total)
  };
}

/**
 * Generate clinical interpretation based on PSQI total score
 * Score >5 indicates poor sleep quality (~90% sensitivity/specificity)
 */
export function interpretPsqiSzScore(totalScore: number): string {
  if (totalScore <= 5) {
    return `Score PSQI : ${totalScore}/21 - Bonne qualité de sommeil\n\n` +
      'Interprétation : Sommeil de qualité satisfaisante sans plainte cliniquement significative. ' +
      'Les habitudes de sommeil sont adaptées et le retentissement diurne est absent ou minime.\n\n' +
      'Seuil clinique : Un score ≤5 indique une bonne qualité de sommeil (sensibilité ~90%, spécificité ~86%).';
  }
  
  if (totalScore <= 10) {
    return `Score PSQI : ${totalScore}/21 - Qualité de sommeil altérée\n\n` +
      'Interprétation : Difficultés de sommeil modérées. Présence de plaintes subjectives avec ' +
      'retentissement possible sur le fonctionnement quotidien.\n\n' +
      'Recommandations : Évaluation des facteurs contributifs recommandée (anxiété, hygiène du sommeil, ' +
      'traitements médicamenteux, consommation de substances).\n\n' +
      'Seuil clinique : Score >5 suggère une mauvaise qualité de sommeil.';
  }
  
  if (totalScore <= 15) {
    return `Score PSQI : ${totalScore}/21 - Mauvaise qualité de sommeil\n\n` +
      'Interprétation : Troubles du sommeil marqués avec impact significatif sur la qualité de vie. ' +
      'Plusieurs composantes du sommeil sont perturbées.\n\n' +
      'Recommandations : Intervention thérapeutique recommandée :\n' +
      '• TCC-I (thérapie cognitivo-comportementale de l\'insomnie)\n' +
      '• Révision des traitements psychotropes\n' +
      '• Bilan des comorbidités somatiques et psychiatriques\n' +
      '• Évaluation des facteurs de maintien (hygiène du sommeil, anxiété anticipatoire)';
  }
  
  return `Score PSQI : ${totalScore}/21 - Très mauvaise qualité de sommeil\n\n` +
    'Interprétation : Insomnie sévère avec retentissement majeur. Dysfonctionnement important ' +
    'sur le plan diurne (somnolence, difficultés de concentration, troubles de l\'humeur).\n\n' +
    'Recommandations :\n' +
    '• Prise en charge multidisciplinaire nécessaire\n' +
    '• Rechercher un trouble du sommeil primaire (apnée du sommeil, syndrome des jambes sans repos)\n' +
    '• Évaluer l\'impact des symptômes psychiatriques sur le sommeil\n' +
    '• Orientation vers une consultation spécialisée du sommeil si besoin\n' +
    '• Envisager une polysomnographie si suspicion de trouble respiratoire du sommeil';
}
