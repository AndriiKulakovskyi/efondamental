// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation
// PSQI Questionnaire (Pittsburgh Sleep Quality Index)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching bipolar_psqi table schema
// ============================================================================

export interface BipolarPsqiResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
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
  
  // Component scores
  c1_subjective_quality?: number | null;
  c2_latency?: number | null;
  c3_duration?: number | null;
  c4_efficiency?: number | null;
  c5_disturbances?: number | null;
  c6_medication?: number | null;
  c7_daytime_dysfunction?: number | null;
  
  // Total score
  total_score?: number | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarPsqiResponseInsert = Omit<BipolarPsqiResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Questions Dictionary
// ============================================================================

const FREQUENCY_OPTIONS = [
  { code: 0, label: 'Jamais au cours des 30 derniers jours', score: 0 },
  { code: 1, label: 'Moins d\'une fois par semaine', score: 1 },
  { code: 2, label: 'Une ou deux fois par semaine', score: 2 },
  { code: 3, label: 'Trois fois par semaine ou plus', score: 3 }
];

export const PSQI_QUESTIONS: Question[] = [
  {
    id: 'instructions',
    text: 'Évaluation de la qualité du sommeil',
    type: 'section',
    required: false,
    help: "Les questions suivantes portent sur vos habitudes de sommeil au cours des 30 derniers jours."
  },
  { 
    id: 'q1_bedtime', 
    text: '1. Au cours des 30 derniers jours, à quelle heure vous êtes-vous généralement couché(e) le soir? (format HH:MM)', 
    type: 'text', 
    required: true, 
    help: 'A noter en H24 ex: si le patient se couche à 23:00 ne surtout pas mettre 11H(du soir)',
    metadata: { placeholder: 'HH:MM', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' }
  },
  { 
    id: 'q2_minutes_to_sleep', 
    text: '2. Au cours des 30 derniers jours, au bout de combien de temps (en minutes) vous êtes-vous généralement endormi(e) le soir ?', 
    type: 'number', 
    required: true, 
    min: 0 
  },
  { 
    id: 'q3_waketime', 
    text: '3. Au cours des 30 derniers jours, à quelle heure vous êtes-vous généralement levé(e) le matin ? (format HH:MM)', 
    type: 'text', 
    required: true, 
    help: 'A noter en H24',
    metadata: { placeholder: 'HH:MM', pattern: '^([01]\\d|2[0-3]):[0-5]\\d$' }
  },
  { 
    id: 'q4_hours_sleep', 
    text: '4. Au cours des 30 derniers jours, combien d\'heures avez-vous vraiment dormi par nuit ? (format HH:MM)', 
    type: 'text', 
    required: true, 
    help: 'A noter en H24 ex: si vous avez dormi 6 heures et 30 minutes, notez 06:30',
    metadata: { placeholder: 'HH:MM', pattern: '^([01]\\d|2[0-4]):[0-5]\\d$' }
  },
  
  // Q5: Sleep disturbances
  { id: 'q5a', text: "5a. Vous n'êtes pas arrivé(e) à vous endormir en 30 minutes", type: 'single_choice', required: true, options: FREQUENCY_OPTIONS },
  { id: 'q5b', text: '5b. Vous vous êtes réveillé(e) au milieu de la nuit ou plus tôt que d\'habitude', type: 'single_choice', required: true, options: FREQUENCY_OPTIONS },
  { id: 'q5c', text: '5c. Vous avez dû vous lever pour aller aux toilettes', type: 'single_choice', required: true, options: FREQUENCY_OPTIONS },
  { id: 'q5d', text: '5d. Vous avez eu du mal à respirer', type: 'single_choice', required: true, options: FREQUENCY_OPTIONS },
  { id: 'q5e', text: '5e. Vous avez toussé ou ronflé bruyamment', type: 'single_choice', required: true, options: FREQUENCY_OPTIONS },
  { id: 'q5f', text: '5f. Vous avez eu trop froid', type: 'single_choice', required: true, options: FREQUENCY_OPTIONS },
  { id: 'q5g', text: '5g. Vous avez eu trop chaud', type: 'single_choice', required: true, options: FREQUENCY_OPTIONS },
  { id: 'q5h', text: '5h. Vous avez fait des cauchemars', type: 'single_choice', required: true, options: FREQUENCY_OPTIONS },
  { id: 'q5i', text: '5i. Vous avez eu des douleurs', type: 'single_choice', required: true, options: FREQUENCY_OPTIONS },
  { id: 'q5j', text: '5j. Combien de fois, au cours des 30 derniers jours, avez-vous eu des difficultés à dormir pour d\'autres raisons ?', type: 'single_choice', required: true, options: FREQUENCY_OPTIONS },
  { id: 'q5j_text', text: 'Si autre raison, préciser', type: 'text', required: false, display_if: { ">": [{ "var": "answers.q5j" }, 0] } },
  
  { id: 'q6', text: '6. Comment qualifieriez-vous la qualité de votre sommeil en général au cours des 30 derniers jours ?', type: 'single_choice', required: true, options: [{ code: 0, label: 'Très bonne' }, { code: 1, label: 'Assez bonne' }, { code: 2, label: 'Assez mauvaise' }, { code: 3, label: 'Très mauvaise' }] },
  { id: 'q7', text: '7. Au cours des 30 derniers jours, combien de fois avez-vous pris des médicaments pour mieux dormir ?', type: 'single_choice', required: true, options: FREQUENCY_OPTIONS },
  { id: 'q8', text: '8. Au cours des 30 derniers jours, combien de fois avez-vous eu des difficultés à rester éveillé(e) ?', type: 'single_choice', required: true, options: FREQUENCY_OPTIONS },
  { id: 'q9', text: '9. Au cours des 30 derniers jours, combien vous a-t-il été difficile d\'être suffisamment motivé(e) pour mener à bien vos activités ?', type: 'single_choice', required: true, options: [{ code: 0, label: 'Pas difficile du tout' }, { code: 1, label: 'Légèrement difficile' }, { code: 2, label: 'Assez difficile' }, { code: 3, label: 'Très difficile' }] },
  
  // Component scores (read-only)
  { id: 'c1_subjective_quality', text: 'Score sur la qualité du sommeil', type: 'number', required: false, readonly: true },
  { id: 'c2_latency', text: 'Score latence avant sommeil', type: 'number', required: false, readonly: true },
  { id: 'c3_duration', text: 'Score durée de sommeil', type: 'number', required: false, readonly: true },
  { id: 'c4_efficiency', text: 'Score efficience sommeil', type: 'number', required: false, readonly: true },
  { id: 'c5_disturbances', text: 'Score du trouble du sommeil', type: 'number', required: false, readonly: true },
  { id: 'c6_medication', text: 'Score médication', type: 'number', required: false, readonly: true },
  { id: 'c7_daytime_dysfunction', text: 'Score de dysfonctionnement dû au sommeil', type: 'number', required: false, readonly: true },
  { id: 'total_score', text: 'Score total', type: 'number', required: false, readonly: true }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const PSQI_DEFINITION: QuestionnaireDefinition = {
  id: 'psqi',
  code: 'PSQI',
  title: 'PSQI',
  description: 'Indice de Qualité du Sommeil de Pittsburgh',
  questions: PSQI_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

function parseHoursMinutes(timeStr: string | null | undefined): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) + (minutes || 0) / 60;
}

function calculateTimeDifference(start: string, end: string): number {
  // Returns hours between start and end time (accounting for overnight)
  const startHours = parseHoursMinutes(start);
  const endHours = parseHoursMinutes(end);
  
  let diff = endHours - startHours;
  if (diff < 0) diff += 24; // Overnight adjustment
  
  return diff;
}

export function computePsqiScores(responses: Partial<BipolarPsqiResponse>): {
  c1_subjective_quality: number;
  c2_latency: number;
  c3_duration: number;
  c4_efficiency: number;
  c5_disturbances: number;
  c6_medication: number;
  c7_daytime_dysfunction: number;
  total_score: number;
} {
  // Component 1: Subjective sleep quality (Q6)
  const c1 = responses.q6 ?? 0;
  
  // Component 2: Sleep latency (Q2 + Q5a)
  let c2Score = 0;
  const q2 = responses.q2_minutes_to_sleep ?? 0;
  const q5a = responses.q5a ?? 0;
  
  // Q2 scoring: 0=<=15min, 1=16-30, 2=31-60, 3=>60
  let q2Score = 0;
  if (q2 <= 15) q2Score = 0;
  else if (q2 <= 30) q2Score = 1;
  else if (q2 <= 60) q2Score = 2;
  else q2Score = 3;
  
  const latencySum = q2Score + q5a;
  if (latencySum === 0) c2Score = 0;
  else if (latencySum <= 2) c2Score = 1;
  else if (latencySum <= 4) c2Score = 2;
  else c2Score = 3;
  
  // Component 3: Sleep duration (Q4)
  const sleepHours = parseHoursMinutes(responses.q4_hours_sleep);
  let c3 = 0;
  if (sleepHours > 7) c3 = 0;
  else if (sleepHours >= 6) c3 = 1;
  else if (sleepHours >= 5) c3 = 2;
  else c3 = 3;
  
  // Component 4: Habitual sleep efficiency
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
  const disturbanceSum = (responses.q5b ?? 0) + (responses.q5c ?? 0) + (responses.q5d ?? 0) +
    (responses.q5e ?? 0) + (responses.q5f ?? 0) + (responses.q5g ?? 0) +
    (responses.q5h ?? 0) + (responses.q5i ?? 0) + (responses.q5j ?? 0);
  
  let c5 = 0;
  if (disturbanceSum === 0) c5 = 0;
  else if (disturbanceSum <= 9) c5 = 1;
  else if (disturbanceSum <= 18) c5 = 2;
  else c5 = 3;
  
  // Component 6: Use of sleep medication (Q7)
  const c6 = responses.q7 ?? 0;
  
  // Component 7: Daytime dysfunction (Q8 + Q9)
  const daySum = (responses.q8 ?? 0) + (responses.q9 ?? 0);
  let c7 = 0;
  if (daySum === 0) c7 = 0;
  else if (daySum <= 2) c7 = 1;
  else if (daySum <= 4) c7 = 2;
  else c7 = 3;
  
  // Total score
  const total = c1 + c2Score + c3 + c4 + c5 + c6 + c7;
  
  return {
    c1_subjective_quality: c1,
    c2_latency: c2Score,
    c3_duration: c3,
    c4_efficiency: c4,
    c5_disturbances: c5,
    c6_medication: c6,
    c7_daytime_dysfunction: c7,
    total_score: total
  };
}

export function interpretPsqiScore(totalScore: number): string {
  // PSQI total score ranges from 0-21
  // Score > 5 indicates poor sleep quality
  if (totalScore <= 5) return 'Bonne qualité de sommeil';
  if (totalScore <= 10) return 'Qualité de sommeil altérée';
  if (totalScore <= 15) return 'Mauvaise qualité de sommeil';
  return 'Très mauvaise qualité de sommeil';
}
