// ============================================================================
// eFondaMental Platform - Schizophrenia Initial Evaluation
// WURS-25 Questionnaire (Wender Utah Rating Scale - Short Form)
// Ward MF, Wender PH, Reimherr FW. Am J Psychiatry. 1993
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching schizophrenia_wurs25 table schema
// ============================================================================

export interface SchizophreniaWurs25Response {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Administration status
  questionnaire_done?: string | null; // 'Fait' | 'Non fait'
  
  // Questions 1-25 (0-4 each, mapped from original WURS items)
  q1?: number | null;  // Item 3 - Attention
  q2?: number | null;  // Item 4 - Anxiety/Mood
  q3?: number | null;  // Item 5 - Hyperactivity
  q4?: number | null;  // Item 6 - Attention
  q5?: number | null;  // Item 7 - Impulsivity/Temper
  q6?: number | null;  // Item 9 - Impulsivity/Temper
  q7?: number | null;  // Item 10 - Attention
  q8?: number | null;  // Item 11 - Behavioral
  q9?: number | null;  // Item 12 - Anxiety/Mood
  q10?: number | null; // Item 15 - Behavioral
  q11?: number | null; // Item 16 - Self-esteem
  q12?: number | null; // Item 17 - Impulsivity/Temper
  q13?: number | null; // Item 20 - Anxiety/Mood
  q14?: number | null; // Item 21 - Impulsivity/Temper
  q15?: number | null; // Item 24 - Impulsivity/Temper
  q16?: number | null; // Item 25 - Behavioral
  q17?: number | null; // Item 26 - Self-esteem
  q18?: number | null; // Item 27 - Impulsivity/Temper
  q19?: number | null; // Item 28 - Behavioral
  q20?: number | null; // Item 29 - Social
  q21?: number | null; // Item 40 - Social
  q22?: number | null; // Item 41 - Behavioral
  q23?: number | null; // Item 51 - Academic
  q24?: number | null; // Item 56 - Academic
  q25?: number | null; // Item 59 - Academic
  
  // Computed scores
  total_score?: number | null;        // Sum of all 25 items (0-100)
  adhd_likely?: boolean | null;       // true if total_score >= 46
  interpretation?: string | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaWurs25ResponseInsert = Omit<
  SchizophreniaWurs25Response,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'total_score' | 'adhd_likely' | 'interpretation'
>;

// ============================================================================
// Scoring Configuration
// ============================================================================

// Clinical cutoff for WURS-25 (schizophrenia version)
const CLINICAL_CUTOFF = 46;

// Domain mappings (question numbers mapped to original WURS items)
const DOMAINS = {
  attention: {
    label: 'Attention',
    description: 'Problèmes d\'attention et de concentration',
    questions: ['q1', 'q4', 'q7'], // Original items 3, 6, 10
  },
  hyperactivity: {
    label: 'Hyperactivité',
    description: 'Hyperactivité motrice',
    questions: ['q3'], // Original item 5
  },
  impulsivity_temper: {
    label: 'Impulsivité/Colère',
    description: 'Impulsivité et mauvaise gestion de la colère',
    questions: ['q5', 'q6', 'q12', 'q14', 'q15', 'q18'], // Original items 7, 9, 17, 21, 24, 27
  },
  anxiety_mood: {
    label: 'Anxiété/Humeur',
    description: 'Anxiété et instabilité de l\'humeur',
    questions: ['q2', 'q9', 'q13'], // Original items 4, 12, 20
  },
  behavioral: {
    label: 'Comportement',
    description: 'Problèmes comportementaux et désobéissance',
    questions: ['q8', 'q10', 'q16', 'q19', 'q22'], // Original items 11, 15, 25, 28, 41
  },
  self_esteem: {
    label: 'Estime de soi',
    description: 'Estime de soi et culpabilité',
    questions: ['q11', 'q17'], // Original items 16, 26
  },
  social: {
    label: 'Social',
    description: 'Difficultés sociales et relationnelles',
    questions: ['q20', 'q21'], // Original items 29, 40
  },
  academic: {
    label: 'Scolaire',
    description: 'Difficultés scolaires et sous-performance',
    questions: ['q23', 'q24', 'q25'], // Original items 51, 56, 59
  },
};

// ============================================================================
// Scoring Functions
// ============================================================================

export interface Wurs25SzScoreResult {
  total_score: number;
  adhd_likely: boolean;
  interpretation: string;
}

/**
 * Compute WURS-25 total score from responses
 */
export function computeWurs25SzScores(responses: Record<string, any>): Wurs25SzScoreResult {
  let totalScore = 0;
  
  // Sum all 25 items
  for (let i = 1; i <= 25; i++) {
    const qKey = `q${i}`;
    const value = responses[qKey];
    if (typeof value === 'number' && !isNaN(value)) {
      totalScore += value;
    }
  }
  
  const adhdLikely = totalScore >= CLINICAL_CUTOFF;
  
  return {
    total_score: totalScore,
    adhd_likely: adhdLikely,
    interpretation: interpretWurs25SzScore(totalScore),
  };
}

/**
 * Interpret WURS-25 total score with detailed French text
 */
export function interpretWurs25SzScore(totalScore: number): string {
  if (totalScore >= CLINICAL_CUTOFF) {
    return `Score ≥${CLINICAL_CUTOFF} : Ce résultat suggère fortement la présence de symptômes de TDAH durant l'enfance. ` +
      'Le seuil de 46 possède une sensibilité et une spécificité de 96% pour le diagnostic rétrospectif du TDAH de l\'enfance. ' +
      'Une évaluation complémentaire est recommandée (ASRS pour symptômes actuels, entretien clinique).';
  }
  return `Score <${CLINICAL_CUTOFF} : Ce résultat ne suggère pas la présence de symptômes significatifs de TDAH durant l'enfance. ` +
    'Cependant, ce questionnaire est un outil de dépistage rétrospectif et ne constitue pas un diagnostic définitif.';
}

// ============================================================================
// Question Options
// ============================================================================

const QUESTIONNAIRE_DONE_OPTIONS = [
  { code: 'Fait', label: 'Fait' },
  { code: 'Non fait', label: 'Non fait' },
];

const WURS_OPTIONS = [
  { code: 0, label: 'Pas du tout ou très légèrement', score: 0 },
  { code: 1, label: 'Légèrement', score: 1 },
  { code: 2, label: 'Modérément', score: 2 },
  { code: 3, label: 'Assez', score: 3 },
  { code: 4, label: 'Beaucoup', score: 4 },
];

// ============================================================================
// Questions Array
// ============================================================================

export const WURS25_SZ_QUESTIONS: Question[] = [
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
    text: 'Ce questionnaire porte sur votre enfance et adolescence. Pour chaque item, indiquez dans quelle mesure chaque description s\'appliquait à vous avant l\'âge adulte.\n\nEnfant et/ou adolescent, j\'étais (ou j\'avais) :',
    type: 'instruction',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // Q1 (Original item 3) - Attention
  {
    id: 'q1',
    text: '3. Des problèmes de concentration. J\'étais facilement distrait(e)',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'attention',
    help: 'Domaine: Attention',
  },
  
  // Q2 (Original item 4) - Anxiety/Mood
  {
    id: 'q2',
    text: '4. Anxieux. Je me faisais du souci',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'anxiety_mood',
    help: 'Domaine: Anxiété/Humeur',
  },
  
  // Q3 (Original item 5) - Hyperactivity
  {
    id: 'q3',
    text: '5. Nerveux. Je ne tenais pas en place',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'hyperactivity',
    help: 'Domaine: Hyperactivité',
  },
  
  // Q4 (Original item 6) - Attention
  {
    id: 'q4',
    text: '6. Inattentif(ve), rêveur(se)',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'attention',
    help: 'Domaine: Attention',
  },
  
  // Q5 (Original item 7) - Impulsivity/Temper
  {
    id: 'q5',
    text: '7. Facilement en colère, « soupe au lait »',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'impulsivity_temper',
    help: 'Domaine: Impulsivité/Colère',
  },
  
  // Q6 (Original item 9) - Impulsivity/Temper
  {
    id: 'q6',
    text: '9. Des éclats d\'humeur, des accès de colère',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'impulsivity_temper',
    help: 'Domaine: Impulsivité/Colère',
  },
  
  // Q7 (Original item 10) - Attention
  {
    id: 'q7',
    text: '10. Des difficultés à me tenir aux choses, à mener mes projets jusqu\'à la fin, à finir les choses commencées',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'attention',
    help: 'Domaine: Attention',
  },
  
  // Q8 (Original item 11) - Behavioral
  {
    id: 'q8',
    text: '11. Têtu(e), obstiné(e)',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'behavioral',
    help: 'Domaine: Comportement',
  },
  
  // Q9 (Original item 12) - Anxiety/Mood
  {
    id: 'q9',
    text: '12. Triste ou cafardeux(se), déprimé(e), malheureux(se)',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'anxiety_mood',
    help: 'Domaine: Anxiété/Humeur',
  },
  
  // Q10 (Original item 15) - Behavioral
  {
    id: 'q10',
    text: '15. Désobéissant(e) envers mes parents, rebelle, effronté(e)',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'behavioral',
    help: 'Domaine: Comportement',
  },
  
  // Q11 (Original item 16) - Self-esteem
  {
    id: 'q11',
    text: '16. Mauvaise opinion de moi-même',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'self_esteem',
    help: 'Domaine: Estime de soi',
  },
  
  // Q12 (Original item 17) - Impulsivity/Temper
  {
    id: 'q12',
    text: '17. Irritable',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'impulsivity_temper',
    help: 'Domaine: Impulsivité/Colère',
  },
  
  // Q13 (Original item 20) - Anxiety/Mood
  {
    id: 'q13',
    text: '20. D\'humeur changeante avec des hauts et des bas',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'anxiety_mood',
    help: 'Domaine: Anxiété/Humeur',
  },
  
  // Q14 (Original item 21) - Impulsivity/Temper
  {
    id: 'q14',
    text: '21. En colère',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'impulsivity_temper',
    help: 'Domaine: Impulsivité/Colère',
  },
  
  // Q15 (Original item 24) - Impulsivity/Temper
  {
    id: 'q15',
    text: '24. Impulsif(ve). J\'agissais sans réfléchir.',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'impulsivity_temper',
    help: 'Domaine: Impulsivité/Colère',
  },
  
  // Q16 (Original item 25) - Behavioral
  {
    id: 'q16',
    text: '25. Tendance à être immature',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'behavioral',
    help: 'Domaine: Comportement',
  },
  
  // Q17 (Original item 26) - Self-esteem
  {
    id: 'q17',
    text: '26. Culpabilisé(e), plein(e) de regrets',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'self_esteem',
    help: 'Domaine: Estime de soi',
  },
  
  // Q18 (Original item 27) - Impulsivity/Temper
  {
    id: 'q18',
    text: '27. Je pouvais perdre le contrôle de moi-même',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'impulsivity_temper',
    help: 'Domaine: Impulsivité/Colère',
  },
  
  // Q19 (Original item 28) - Behavioral
  {
    id: 'q19',
    text: '28. Tendance à être ou à agir de façon irrationnelle',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'behavioral',
    help: 'Domaine: Comportement',
  },
  
  // Q20 (Original item 29) - Social
  {
    id: 'q20',
    text: '29. Impopulaire auprès des autres enfants. Je ne gardais pas longtemps mes amis ou je ne m\'entendais pas avec les autres enfants',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'social',
    help: 'Domaine: Social',
  },
  
  // Q21 (Original item 40) - Social
  {
    id: 'q21',
    text: '40. Du mal à voir les choses du point de vue de quelqu\'un d\'autre',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'social',
    help: 'Domaine: Social',
  },
  
  // Q22 (Original item 41) - Behavioral
  {
    id: 'q22',
    text: '41. Des ennuis avec les autorités, des ennuis à l\'école, convoqué(e) par le directeur',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'behavioral',
    help: 'Domaine: Comportement',
  },
  
  // Q23 (Original item 51) - Academic
  {
    id: 'q23',
    text: '51. Dans l\'ensemble un élève peu doué, apprenant lentement',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'academic',
    help: 'Domaine: Scolaire',
  },
  
  // Q24 (Original item 56) - Academic
  {
    id: 'q24',
    text: '56. Des difficultés en mathématiques ou avec les chiffres',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'academic',
    help: 'Domaine: Scolaire',
  },
  
  // Q25 (Original item 59) - Academic
  {
    id: 'q25',
    text: '59. En dessous de mon potentiel',
    type: 'single_choice',
    required: false,
    options: WURS_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'academic',
    help: 'Domaine: Scolaire',
  },
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const WURS25_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'wurs25_sz',
  code: 'WURS25_SZ',
  title: 'WURS-25 - Échelle de Wender Utah',
  description: "L'échelle WURS-25 est une version abrégée de l'échelle originale de 61 items. Elle évalue rétrospectivement les symptômes du TDAH durant l'enfance et l'adolescence. Score total: 0-100, seuil clinique ≥46.",
  questions: WURS25_SZ_QUESTIONS,
  metadata: {
    pathologies: ['schizophrenia'],
    target_role: 'patient',
    instructions: 'Ce questionnaire porte sur votre enfance et adolescence. Pour chaque item, indiquez dans quelle mesure chaque description s\'appliquait à vous avant l\'âge adulte.',
    reference: 'Ward MF, Wender PH, Reimherr FW. The Wender Utah Rating Scale: an aid in the retrospective diagnosis of childhood attention deficit hyperactivity disorder. Am J Psychiatry. 1993;150(6):885-890.',
    domains: DOMAINS,
    clinical_cutoff: CLINICAL_CUTOFF,
    sensitivity: '96%',
    specificity: '96%',
    score_range: { min: 0, max: 100 },
    original_items: '3, 4, 5, 6, 7, 9, 10, 11, 12, 15, 16, 17, 20, 21, 24, 25, 26, 27, 28, 29, 40, 41, 51, 56, 59',
  }
};
