// ============================================================================
// eFondaMental Platform - Bipolar Initial Evaluation
// PRISE-M Questionnaire (Medication Side Effects Profile)
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching bipolar_prise_m table schema
// ============================================================================

export interface BipolarPriseMResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Filter question
  taking_medication?: string | null;
  
  // Section 1: Gastrointestinal disorders (q1-q4)
  q1?: number | null; // Diarrhea
  q2?: number | null; // Constipation
  q3?: number | null; // Dry mouth
  q4?: number | null; // Nausea/vomiting
  
  // Section 2: Cardiac disorders (q5-q7)
  q5?: number | null; // Palpitations
  q6?: number | null; // Vertigo
  q7?: number | null; // Chest pain
  
  // Section 3: Skin problems (q8-q10)
  q8?: number | null; // Increased sweating
  q9?: number | null; // Itching
  q10?: number | null; // Dry skin
  
  // Section 4: Neurological disorders (q11-q14)
  q11?: number | null; // Headache
  q12?: number | null; // Tremors
  q13?: number | null; // Poor motor control
  q14?: number | null; // Dizziness
  
  // Section 5: Vision/Hearing (q15-q16)
  q15?: number | null; // Blurred vision
  q16?: number | null; // Tinnitus
  
  // Section 6: Urogenital disorders (q17-q20)
  q17?: number | null; // Difficulty urinating
  q18?: number | null; // Painful urination
  q19?: number | null; // Frequent urination
  q20?: number | null; // Irregular periods (women)
  
  // Section 7: Sleep problems (q21-q22)
  q21?: number | null; // Difficulty falling asleep
  q22?: number | null; // Increased sleep duration
  
  // Section 8: Sexual functions (q23-q24)
  q23?: number | null; // Loss of sexual desire
  q24?: number | null; // Difficulty reaching orgasm
  
  // Section 9: Other disorders (q25-q31)
  q25?: number | null; // Anxiety
  q26?: number | null; // Concentration difficulties
  q27?: number | null; // General malaise
  q28?: number | null; // Agitation
  q29?: number | null; // Fatigue
  q30?: number | null; // Decreased energy
  q31?: number | null; // Weight gain
  
  // Scores
  total_score?: number | null;
  tolerable_count?: number | null;
  painful_count?: number | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarPriseMResponseInsert = Omit<BipolarPriseMResponse, 'id' | 'created_at' | 'updated_at' | 'completed_at'>;

// ============================================================================
// Questions Dictionary
// ============================================================================

const SIDE_EFFECT_OPTIONS = [
  { code: 0, label: 'Absent', score: 0 },
  { code: 1, label: 'Tolérable', score: 1 },
  { code: 2, label: 'Pénible', score: 2 }
];

export const PRISE_M_QUESTIONS: Question[] = [
  {
    id: 'instructions',
    text: 'PRISE-M',
    type: 'section',
    required: false,
    help: 'Pour tous les symptômes ci-dessous, cochez la case qui correspond à ce que vous avez ressenti au cours de la semaine écoulée. si, et seulement si, vous pensez que se sont des effets secondaires dus à votre traitement médicamenteux actuel.'
  },
  {
    id: 'taking_medication',
    text: 'Prenez-vous actuellement un traitement médicamenteux ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui' },
      { code: 'non', label: 'Non' }
    ]
  },
  
  // Section 1: Gastrointestinal
  { id: 'section_gastro', text: '1 - Troubles gastro-intestinaux', type: 'section', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] } },
  { id: 'q1', text: 'Diarrhée', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q2', text: 'Constipation', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q3', text: 'Bouche sèche', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q4', text: 'Nausée, vomissement', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  
  // Section 2: Cardiac
  { id: 'section_cardio', text: '2 - Troubles cardiaques', type: 'section', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] } },
  { id: 'q5', text: 'Palpitations', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q6', text: 'Vertiges', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q7', text: 'Douleurs dans la poitrine', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  
  // Section 3: Skin
  { id: 'section_cutane', text: '3 - Problèmes cutanés', type: 'section', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] } },
  { id: 'q8', text: 'Augmentation de la transpiration', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q9', text: 'Démangeaisons', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q10', text: 'Sécheresse de la peau', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  
  // Section 4: Neurological
  { id: 'section_neuro', text: '4 - Troubles neurologiques', type: 'section', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] } },
  { id: 'q11', text: 'Mal à la tête', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q12', text: 'Tremblements', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q13', text: 'Mauvais contrôle moteur', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q14', text: 'Étourdissements', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  
  // Section 5: Vision/Hearing
  { id: 'section_vision', text: '5 - Vision/Audition', type: 'section', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] } },
  { id: 'q15', text: 'Vision floue', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q16', text: 'Acouphènes (bourdonnements dans les oreilles)', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  
  // Section 6: Urogenital
  { id: 'section_uro', text: '6 - Troubles uro-génitaux', type: 'section', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] } },
  { id: 'q17', text: 'Difficultés pour uriner', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q18', text: 'Mictions douloureuses', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q19', text: 'Mictions fréquentes', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q20', text: 'Règles irrégulières (pour les femmes)', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  
  // Section 7: Sleep
  { id: 'section_sommeil', text: '7 - Problèmes de sommeil', type: 'section', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] } },
  { id: 'q21', text: "Difficultés d'endormissement", type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q22', text: 'Augmentation du temps de sommeil', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  
  // Section 8: Sexual
  { id: 'section_sexuel', text: '8 - Fonctions sexuelles', type: 'section', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] } },
  { id: 'q23', text: 'Perte du désir sexuel', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q24', text: "Difficultés à atteindre un orgasme (Troubles de l'érection pour l'homme)", type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  
  // Section 9: Other
  { id: 'section_autres', text: '9 - Autres troubles', type: 'section', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] } },
  { id: 'q25', text: 'Anxiété', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q26', text: 'Difficultés de concentration', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q27', text: 'Malaise général', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q28', text: 'Agitation', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q29', text: 'Fatigue', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q30', text: "Diminution de l'énergie", type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS },
  { id: 'q31', text: 'Prise de poids', type: 'single_choice', required: false, display_if: { "==": [{ "var": "answers.taking_medication" }, "oui"] }, options: SIDE_EFFECT_OPTIONS }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const PRISE_M_DEFINITION: QuestionnaireDefinition = {
  id: 'prise_m',
  code: 'PRISE_M',
  title: 'PRISE-M',
  description: 'Profil des effets indésirables médicamenteux',
  questions: PRISE_M_QUESTIONS,
  metadata: {
    pathologies: ['bipolar'],
    target_role: 'patient',
    instructions: 'Consignes : Pour tous les symptômes ci-dessous, cochez la case qui correspond à ce que vous avez ressenti au cours de la semaine écoulée. si, et seulement si, vous pensez que se sont des effets secondaires dus à votre traitement médicamenteux actuel.'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

export function computePriseMScores(responses: Partial<BipolarPriseMResponse>): {
  total_score: number;
  tolerable_count: number;
  painful_count: number;
} {
  const questionIds = Array.from({ length: 31 }, (_, i) => `q${i + 1}`);
  
  let totalScore = 0;
  let tolerableCount = 0;
  let painfulCount = 0;
  
  for (const qId of questionIds) {
    const value = responses[qId as keyof BipolarPriseMResponse] as number | null | undefined;
    if (value !== null && value !== undefined) {
      totalScore += value;
      if (value === 1) tolerableCount++;
      if (value === 2) painfulCount++;
    }
  }
  
  return {
    total_score: totalScore,
    tolerable_count: tolerableCount,
    painful_count: painfulCount
  };
}

export function interpretPriseMScore(totalScore: number): string {
  if (totalScore === 0) return 'Aucun effet secondaire rapporté';
  if (totalScore <= 10) return 'Effets secondaires légers';
  if (totalScore <= 20) return 'Effets secondaires modérés';
  if (totalScore <= 40) return 'Effets secondaires importants';
  return 'Effets secondaires sévères';
}
