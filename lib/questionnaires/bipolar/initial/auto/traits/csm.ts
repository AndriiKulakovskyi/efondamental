// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation
// CSM Questionnaire (Composite Scale of Morningness)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching bipolar_csm table schema
// ============================================================================

export interface BipolarCsmResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Questions 1-13
  q1?: number | null; q2?: number | null; q3?: number | null; q4?: number | null;
  q5?: number | null; q6?: number | null; q7?: number | null; q8?: number | null;
  q9?: number | null; q10?: number | null; q11?: number | null; q12?: number | null;
  q13?: number | null;
  
  // Scores
  total_score?: number | null;
  chronotype?: string | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarCsmResponseInsert = Omit<BipolarCsmResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Questions Dictionary
// ============================================================================

export const CSM_QUESTIONS: Question[] = [
  // Q1: valeur_champ3 (5-1)
  { id: 'q1', text: "1. En ne considérant que le rythme de vie qui vous convient le mieux, à quelle heure vous lèveriez-vous en étant entièrement libre d'organiser votre journée", type: 'single_choice', required: true, options: [
    { code: 5, label: 'Entre 5h00 et 6h30' },
    { code: 4, label: 'Entre 6h30 et 7h45' },
    { code: 3, label: 'Entre 7h45 et 9h45' },
    { code: 2, label: 'Entre 9h45 et 11h00' },
    { code: 1, label: 'Entre 11h00 et midi' }
  ] },
  // Q2: valeur_champ3 (5-1)
  { id: 'q2', text: "2. En ne considérant que le rythme de vie qui vous convient le mieux, à quelle heure vous coucheriez-vous sachant que vous êtes entièrement libre d'organiser votre soirée", type: 'single_choice', required: true, options: [
    { code: 5, label: 'Entre 20h00 et 21h00' },
    { code: 4, label: 'Entre 21h00 et 22h15' },
    { code: 3, label: 'Entre 22h15 et 0h30' },
    { code: 2, label: 'Entre 0h30 et 1h45' },
    { code: 1, label: 'Entre 1h45 et 3h00' }
  ] },
  // Q3: valeur_champ1 (1-4)
  { id: 'q3', text: "3. Dans des conditions adéquates, à quel point cela vous est-il facile de vous lever le matin", type: 'single_choice', required: true, options: [
    { code: 1, label: 'Pas facile du tout' },
    { code: 2, label: 'Pas très facile' },
    { code: 3, label: 'Assez facile' },
    { code: 4, label: 'Très facile' }
  ] },
  // Q4: valeur_champ1 (1-4)
  { id: 'q4', text: "4. Comment vous sentez-vous durant la demi-heure qui suit votre réveil du matin (éveil)", type: 'single_choice', required: true, options: [
    { code: 1, label: 'Pas du tout réveillé' },
    { code: 2, label: 'Peu éveillé' },
    { code: 3, label: 'Relativement éveillé' },
    { code: 4, label: 'Très éveillé' }
  ] },
  // Q5: valeur_champ1 (1-4)
  { id: 'q5', text: "5. Comment vous sentez-vous durant la demi-heure qui suit votre réveil du matin (fatigue)", type: 'single_choice', required: true, options: [
    { code: 1, label: 'Très fatigué' },
    { code: 2, label: 'Plutôt fatigué' },
    { code: 3, label: 'Plutôt en forme' },
    { code: 4, label: 'Tout à fait frais et dispos' }
  ] },
  // Q6: valeur_champ2 (4-1)
  { id: 'q6', text: "6. Vous avez décidé de faire un sport. Un ami vous suggère de faire deux fois par semaine des séances d'une heure. Le meilleur moment pour lui est de 7 à 8 heures du matin. Dans quelle forme pensez-vous être", type: 'single_choice', required: true, options: [
    { code: 4, label: 'Bonne forme' },
    { code: 3, label: 'Forme raisonnable' },
    { code: 2, label: 'Vous trouvez cela difficile' },
    { code: 1, label: 'Vous trouvez cela très difficile' }
  ] },
  // Q7: valeur_champ3 (5-1)
  { id: 'q7', text: "7. A quelle heure dans la soirée vous sentez-vous fatigué au point de devoir aller vous coucher", type: 'single_choice', required: true, options: [
    { code: 5, label: 'Entre 20h00 et 21h00' },
    { code: 4, label: 'Entre 21h00 et 22h15' },
    { code: 3, label: 'Entre 22h15 et 0h30' },
    { code: 2, label: 'Entre 0h30 et 1h45' },
    { code: 1, label: 'Entre 1h45 et 3h00' }
  ] },
  // Q8: valeur_champ2 (4-1)
  { id: 'q8', text: "8. Vous devez être à votre maximum de performance pour un examen écrit qui dure 2 heures. Quel horaire choisiriez-vous", type: 'single_choice', required: true, options: [
    { code: 4, label: 'Entre 8h00 et 10h00' },
    { code: 3, label: 'Entre 11h00 et 13h00' },
    { code: 2, label: 'Entre 15h00 et 17h00' },
    { code: 1, label: 'Entre 19h00 et 21h00' }
  ] },
  // Q9: valeur_champ2 (4-1)
  { id: 'q9', text: "9. On entend souvent dire que telle personne est 'du matin' et que telle autre est 'du soir'. En ce qui vous concerne", type: 'single_choice', required: true, options: [
    { code: 4, label: 'Tout à fait du matin' },
    { code: 3, label: 'Plutôt du matin que du soir' },
    { code: 2, label: 'Plutôt du soir que du matin' },
    { code: 1, label: 'Tout à fait du soir' }
  ] },
  // Q10: valeur_champ2 (4-1)
  { id: 'q10', text: "10. A quelle heure vous lèveriez-vous en prévision d'une journée de travail de 8 heures que vous êtes totalement libre d'organiser", type: 'single_choice', required: true, options: [
    { code: 4, label: 'Avant 6h30' },
    { code: 3, label: 'Entre 6h30 et 7h30' },
    { code: 2, label: 'Entre 7h30 et 8h30' },
    { code: 1, label: 'Après 8h30' }
  ] },
  // Q11: valeur_champ1 (1-4)
  { id: 'q11', text: "11. Si vous deviez toujours vous lever à 6h00, cela vous paraitrait", type: 'single_choice', required: true, options: [
    { code: 1, label: 'Affreusement difficile' },
    { code: 2, label: 'Plutôt difficile et déplaisant' },
    { code: 3, label: 'Déplaisant sans plus' },
    { code: 4, label: 'Sans aucune difficulté' }
  ] },
  // Q12: valeur_champ2 (4-1)
  { id: 'q12', text: "12. Après une bonne nuit de sommeil, combien de temps vous faut-il pour être pleinement réveillé", type: 'single_choice', required: true, options: [
    { code: 4, label: 'Moins de 10 minutes' },
    { code: 3, label: 'Entre 11 et 20 minutes' },
    { code: 2, label: 'Entre 21 et 40 minutes' },
    { code: 1, label: 'Plus de 40 minutes' }
  ] },
  // Q13: valeur_champ2 (4-1)
  { id: 'q13', text: "13. Dans quelle partie de la journée êtes-vous le plus actif", type: 'single_choice', required: true, options: [
    { code: 4, label: 'Nettement actif le matin (bien réveillé le matin et fatigué le soir)' },
    { code: 3, label: 'Plutôt actif le matin' },
    { code: 2, label: 'Plutôt actif le soir' },
    { code: 1, label: 'Nettement actif le soir (fatigué le matin et bien réveillé le soir)' }
  ] }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const CSM_DEFINITION: QuestionnaireDefinition = {
  id: 'csm',
  code: 'CSM',
  title: 'CSM',
  description: 'Echelle composite de matinalité',
  questions: CSM_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    instructions: "Les 13 questions suivantes concernent vos rythmes veille-sommeil et activité-repos. Cochez une seule réponse par question.",
    score_range: { min: 13, max: 55 }
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

// Chronotype classification
const CHRONOTYPE_THRESHOLDS = {
  definitely_evening: { min: 13, max: 21 },
  moderately_evening: { min: 22, max: 28 },
  intermediate: { min: 29, max: 41 },
  moderately_morning: { min: 42, max: 47 },
  definitely_morning: { min: 48, max: 55 }
};

export function computeCsmScores(responses: Partial<BipolarCsmResponse>): {
  total_score: number;
  chronotype: string;
} {
  let total = 0;
  
  for (let i = 1; i <= 13; i++) {
    const key = `q${i}` as keyof BipolarCsmResponse;
    const value = responses[key] as number | null | undefined;
    if (value !== null && value !== undefined) {
      total += value;
    }
  }
  
  return {
    total_score: total,
    chronotype: getChronotype(total)
  };
}

export function getChronotype(totalScore: number): string {
  if (totalScore <= CHRONOTYPE_THRESHOLDS.definitely_evening.max) return 'definitely_evening';
  if (totalScore <= CHRONOTYPE_THRESHOLDS.moderately_evening.max) return 'moderately_evening';
  if (totalScore <= CHRONOTYPE_THRESHOLDS.intermediate.max) return 'intermediate';
  if (totalScore <= CHRONOTYPE_THRESHOLDS.moderately_morning.max) return 'moderately_morning';
  return 'definitely_morning';
}

export function interpretCsmScore(totalScore: number): string {
  const chronotype = getChronotype(totalScore);
  const labels: Record<string, string> = {
    definitely_evening: 'Nettement vespéral (type du soir)',
    moderately_evening: 'Modérément vespéral',
    intermediate: 'Intermédiaire',
    moderately_morning: 'Modérément matinal',
    definitely_morning: 'Nettement matinal (type du matin)'
  };
  return labels[chronotype] || 'Intermédiaire';
}
