// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation
// MAThyS Questionnaire (Multidimensional Assessment of Thymic States)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching bipolar_mathys table schema
// ============================================================================

export interface BipolarMathysResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Main scale items (q1-q20, each 0-10 with 0.5 increments)
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
  
  // Emotion intensity items
  tristesse?: number | null;
  joie?: number | null;
  irritabilite?: number | null;
  panique?: number | null;
  anxiete?: number | null;
  colere?: number | null;
  exaltation?: number | null;
  
  // Subscores
  subscore_emotion?: number | null;
  subscore_motivation?: number | null;
  subscore_perception?: number | null;
  subscore_interaction?: number | null;
  subscore_cognition?: number | null;
  total_score?: number | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarMathysResponseInsert = Omit<BipolarMathysResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Questions Dictionary
// ============================================================================

const EMOTION_OPTIONS = [
  { code: 0, label: 'Jamais', score: 0 },
  { code: 2.5, label: 'Occasionnellement', score: 2.5 },
  { code: 5, label: 'Souvent', score: 5 },
  { code: 7.5, label: 'Très souvent', score: 7.5 },
  { code: 10, label: 'Constamment', score: 10 }
];

export const MATHYS_QUESTIONS: Question[] = [
  {
    id: 'instructions',
    text: 'Évaluation des états thymiques',
    type: 'section',
    required: false,
    help: "Consigne de cotation : coter toujours le score le plus extrême (0 au lieu de 1 par exemple ; 10 au lieu de 9). Chaque item est coté entre 0 et 10, avec possibilité de demi points (Ex.: 2.5).\n\n**Attention : contrairement au calque, ne pas inverser les scores préalablement. ex: item 9: Mon cerveau ne s'arrête pas = 0 | Mon cerveau fonctionne au ralenti = 10.**"
  },
  { id: 'q1', text: "1. Je suis moins sensible que d'habitude aux couleurs | Je suis plus sensible que d'habitude aux couleurs", type: 'scale', required: true, min: 0, max: 10, minLabel: "Moins sensible", maxLabel: "Plus sensible", metadata: { step: 0.5 } },
  { id: 'q2', text: "2. Je manque de tonus | J'ai une tension interne importante", type: 'scale', required: true, min: 0, max: 10, minLabel: "Manque de tonus", maxLabel: "Tension interne", metadata: { step: 0.5 } },
  { id: 'q3', text: "3. J'ai l'impression d'être anesthésié(e) sur le plan des émotions | J'ai parfois le sentiment de perdre le contrôle de mes émotions", type: 'scale', required: true, min: 0, max: 10, minLabel: "Anesthésié(e)", maxLabel: "Perte de contrôle", metadata: { step: 0.5 } },
  { id: 'q4', text: "4. Je suis replié(e) sur moi | Je suis désinhibé(e)", type: 'scale', required: true, min: 0, max: 10, minLabel: "Replié(e)", maxLabel: "Désinhibé(e)", metadata: { step: 0.5 } },
  { id: 'q5', text: "5. Je suis facilement distrait(e), la moindre chose me fait perdre mon attention | Je ne suis pas attentif (ve) à mon environnement", type: 'scale', required: true, min: 0, max: 10, minLabel: "Distrait(e)", maxLabel: "Inattentif (ve)", metadata: { step: 0.5 } },
  { id: 'q6', text: "6. Je suis plus sensible que d'habitude au toucher | Je suis moins sensible que d'habitude au toucher", type: 'scale', required: true, min: 0, max: 10, minLabel: "Plus sensible", maxLabel: "Moins sensible", metadata: { step: 0.5 } },
  { id: 'q7', text: "7. J'ai l'impression que mon humeur varie beaucoup en fonction de mon environnement | Mon humeur est monotone et peu changeante", type: 'scale', required: true, min: 0, max: 10, minLabel: "Humeur variable", maxLabel: "Humeur monotone", metadata: { step: 0.5 } },
  { id: 'q8', text: "8. Je suis particulièrement sensible à la musique | Je suis plus indifférent que d'habitude à la musique", type: 'scale', required: true, min: 0, max: 10, minLabel: "Sensible musique", maxLabel: "Indifférent musique", metadata: { step: 0.5 } },
  { id: 'q9', text: "9. Mon cerveau ne s'arrête jamais | Mon cerveau fonctionne au ralenti", type: 'scale', required: true, min: 0, max: 10, minLabel: "Ne s'arrête jamais", maxLabel: "Au ralenti", metadata: { step: 0.5 } },
  { id: 'q10', text: "10. Je suis plus réactif (ve) à mon environnement | Je suis moins réactif (ve) à mon environnement", type: 'scale', required: true, min: 0, max: 10, minLabel: "Plus réactif(ve)", maxLabel: "Moins réactif(ve)", metadata: { step: 0.5 } },
  { id: 'q11', text: "11. Je me sens sans énergie | J'ai le sentiment d'avoir une grande énergie", type: 'scale', required: true, min: 0, max: 10, minLabel: "Sans énergie", maxLabel: "Grande énergie", metadata: { step: 0.5 } },
  { id: 'q12', text: "12. J'ai le sentiment que mes pensées sont ralenties | J'ai le sentiment que mes idées défilent dans ma tête", type: 'scale', required: true, min: 0, max: 10, minLabel: "Pensées ralenties", maxLabel: "Idées défilent", metadata: { step: 0.5 } },
  { id: 'q13', text: "13. Je trouve la nourriture sans goût | Je recherche les plaisirs gastronomiques car j'en apprécie davantage les saveurs", type: 'scale', required: true, min: 0, max: 10, minLabel: "Sans goût", maxLabel: "Plaisirs gastronomiques", metadata: { step: 0.5 } },
  { id: 'q14', text: "14. J'ai moins envie de communiquer avec les autres | J'ai plus envie de communiquer avec les autres", type: 'scale', required: true, min: 0, max: 10, minLabel: "Moins envie", maxLabel: "Plus envie", metadata: { step: 0.5 } },
  { id: 'q15', text: "15. Je manque de motivation pour aller de l'avant | Je multiplie les projets nouveaux", type: 'scale', required: true, min: 0, max: 10, minLabel: "Manque motivation", maxLabel: "Multiplie projets", metadata: { step: 0.5 } },
  { id: 'q16', text: "16. Ma perte d'intérêt pour mon environnement m'empêche de gérer le quotidien | J'ai envie de faire plus de choses que d'habitude", type: 'scale', required: true, min: 0, max: 10, minLabel: "Perte intérêt", maxLabel: "Envie faire plus", metadata: { step: 0.5 } },
  { id: 'q17', text: "17. Je prends les décisions de manière plus rapide que d'habitude | J'ai plus de difficultés que d'habitude à prendre des décisions", type: 'scale', required: true, min: 0, max: 10, minLabel: "Décisions rapides", maxLabel: "Difficultés décisions", metadata: { step: 0.5 } },
  { id: 'q18', text: "18. Je ressens les émotions de manière très intense | Mes émotions sont atténuées", type: 'scale', required: true, min: 0, max: 10, minLabel: "Émotions intenses", maxLabel: "Émotions atténuées", metadata: { step: 0.5 } },
  { id: 'q19', text: "19. Je suis ralenti(e) dans mes mouvements | Je suis physiquement agité(e)", type: 'scale', required: true, min: 0, max: 10, minLabel: "Ralenti(e)", maxLabel: "Agité(e)", metadata: { step: 0.5 } },
  { id: 'q20', text: "20. J'ai l'impression d'être moins sensible aux odeurs que d'habitude | J'ai l'impression d'être plus sensible aux odeurs que d'habitude", type: 'scale', required: true, min: 0, max: 10, minLabel: "Moins sensible odeurs", maxLabel: "Plus sensible odeurs", metadata: { step: 0.5 } },
  
  // Subscores (read-only computed fields)
  { id: 'subscore_emotion', text: 'Score Emotion à la MATHYS', type: 'number', required: false, readonly: true },
  { id: 'subscore_motivation', text: 'Score Motivation à la MATHYS', type: 'number', required: false, readonly: true },
  { id: 'subscore_perception', text: 'Score Perception sensorielle à la MATHYS', type: 'number', required: false, readonly: true },
  { id: 'subscore_interaction', text: 'Score Interaction personnelle à la MATHYS', type: 'number', required: false, readonly: true },
  { id: 'subscore_cognition', text: 'Score Cognition à la MATHYS', type: 'number', required: false, readonly: true },
  
  // Emotion intensity section
  {
    id: 'emotions_section',
    text: 'Intensité des émotions',
    type: 'section',
    required: false,
    help: "Veuillez coter l'intensité des émotions suivantes sur la semaine écoulée."
  },
  { id: 'tristesse', text: 'Tristesse', type: 'single_choice', required: true, options: EMOTION_OPTIONS },
  { id: 'joie', text: 'Joie', type: 'single_choice', required: true, options: EMOTION_OPTIONS },
  { id: 'irritabilite', text: 'Irritabilité', type: 'single_choice', required: true, options: EMOTION_OPTIONS },
  { id: 'panique', text: 'Panique', type: 'single_choice', required: true, options: EMOTION_OPTIONS },
  { id: 'anxiete', text: 'Anxiété', type: 'single_choice', required: true, options: EMOTION_OPTIONS },
  { id: 'colere', text: 'Colère', type: 'single_choice', required: true, options: EMOTION_OPTIONS },
  { id: 'exaltation', text: 'Exaltation', type: 'single_choice', required: true, options: EMOTION_OPTIONS }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const MATHYS_DEFINITION: QuestionnaireDefinition = {
  id: 'mathys',
  code: 'MATHYS',
  title: 'MAThyS',
  description: 'Évaluation Multidimensionnelle des états thymiques',
  questions: MATHYS_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    reverse_items: [5, 6, 7, 8, 9, 10, 17, 18],
    instructions: "Consigne de cotation : coter toujours le score le plus extrême (0 au lieu de 1 par exemple ; 10 au lieu de 9). Chaque item est coté entre 0 et 10, avec possibilité de demi points (Ex.: 2.5).\n\n**Attention : contrairement au calque, ne pas inverser les scores préalablement. ex: item 9: Mon cerveau ne s'arrête pas = 0 | Mon cerveau fonctionne au ralenti = 10.**"
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

// Subscale items (after reversal where needed)
// Emotion: 3, 7, 18
// Motivation: 11, 15, 16
// Perception: 1, 6, 8, 13, 20
// Interaction: 4, 14
// Cognition: 5, 9, 10, 12, 17

// Items to reverse (score becomes 10 - value): 5, 6, 7, 8, 9, 10, 17, 18
const REVERSE_ITEMS = [5, 6, 7, 8, 9, 10, 17, 18];

const SUBSCALES = {
  emotion: [3, 7, 18],
  motivation: [11, 15, 16],
  perception: [1, 6, 8, 13, 20],
  interaction: [4, 14],
  cognition: [5, 9, 10, 12, 17]
};

export function computeMathysScores(responses: Partial<BipolarMathysResponse>): {
  subscore_emotion: number;
  subscore_motivation: number;
  subscore_perception: number;
  subscore_interaction: number;
  subscore_cognition: number;
  total_score: number;
} {
  // First, get adjusted values (apply reversal)
  const adjustedValues: Record<number, number> = {};
  
  for (let i = 1; i <= 20; i++) {
    const qKey = `q${i}` as keyof BipolarMathysResponse;
    const value = responses[qKey] as number | null | undefined;
    
    if (value !== null && value !== undefined) {
      adjustedValues[i] = REVERSE_ITEMS.includes(i) ? (10 - value) : value;
    }
  }
  
  // Calculate subscores
  const calculateSubscore = (items: number[]): number => {
    let sum = 0;
    let count = 0;
    for (const item of items) {
      if (adjustedValues[item] !== undefined) {
        sum += adjustedValues[item];
        count++;
      }
    }
    return count > 0 ? sum : 0;
  };
  
  const emotionScore = calculateSubscore(SUBSCALES.emotion);
  const motivationScore = calculateSubscore(SUBSCALES.motivation);
  const perceptionScore = calculateSubscore(SUBSCALES.perception);
  const interactionScore = calculateSubscore(SUBSCALES.interaction);
  const cognitionScore = calculateSubscore(SUBSCALES.cognition);
  
  // Total score is sum of all adjusted values
  const totalScore = Object.values(adjustedValues).reduce((a, b) => a + b, 0);
  
  return {
    subscore_emotion: emotionScore,
    subscore_motivation: motivationScore,
    subscore_perception: perceptionScore,
    subscore_interaction: interactionScore,
    subscore_cognition: cognitionScore,
    total_score: totalScore
  };
}

export function interpretMathysScore(totalScore: number): string {
  // MAThyS total score ranges from 0-200
  // Score around 100 indicates euthymia (neutral state)
  // Higher scores indicate more activation/mania
  // Lower scores indicate more inhibition/depression
  if (totalScore < 60) return 'État dépressif marqué';
  if (totalScore < 80) return 'Tendance dépressive';
  if (totalScore <= 120) return 'État euthymique';
  if (totalScore <= 140) return 'Tendance hypomaniaque';
  return 'État hypomaniaque/maniaque';
}
