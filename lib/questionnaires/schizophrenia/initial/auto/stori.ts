// ============================================================================
// eFondaMental Platform - Schizophrenia Initial Evaluation
// STORI - Stages of Recovery Instrument (50 items)
// Andresen R, Caputi P, Oades LG. Aust N Z J Psychiatry. 2006
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching schizophrenia_stori table schema
// ============================================================================

export interface SchizophreniaStoriResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Administration status
  questionnaire_done?: string | null; // 'Fait' | 'Non fait'
  
  // 50 questions (0-5 each)
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
  q21?: number | null;
  q22?: number | null;
  q23?: number | null;
  q24?: number | null;
  q25?: number | null;
  q26?: number | null;
  q27?: number | null;
  q28?: number | null;
  q29?: number | null;
  q30?: number | null;
  q31?: number | null;
  q32?: number | null;
  q33?: number | null;
  q34?: number | null;
  q35?: number | null;
  q36?: number | null;
  q37?: number | null;
  q38?: number | null;
  q39?: number | null;
  q40?: number | null;
  q41?: number | null;
  q42?: number | null;
  q43?: number | null;
  q44?: number | null;
  q45?: number | null;
  q46?: number | null;
  q47?: number | null;
  q48?: number | null;
  q49?: number | null;
  q50?: number | null;
  
  // Stage scores (0-50 each)
  stori_etap1?: number | null;  // Moratoire
  stori_etap2?: number | null;  // Conscience
  stori_etap3?: number | null;  // Préparation
  stori_etap4?: number | null;  // Reconstruction
  stori_etap5?: number | null;  // Croissance
  
  // Dominant stage (1-5)
  dominant_stage?: number | null;
  interpretation?: string | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaStoriResponseInsert = Omit<
  SchizophreniaStoriResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'stori_etap1' | 'stori_etap2' | 'stori_etap3' | 'stori_etap4' | 'stori_etap5' |
  'dominant_stage' | 'interpretation'
>;

// ============================================================================
// Stage Definitions
// ============================================================================

export const STORI_STAGES = {
  1: {
    label: 'Moratoire',
    english: 'Moratorium',
    dbField: 'stori_etap1',
    description: 'Période de repli caractérisée par un sentiment de perte, de confusion et d\'impuissance. La personne peut ne pas voir de possibilité d\'amélioration.',
    items: [1, 6, 11, 16, 21, 26, 31, 36, 41, 46],
    color: 'orange',
  },
  2: {
    label: 'Conscience',
    english: 'Awareness',
    dbField: 'stori_etap2',
    description: 'Première lueur d\'espoir que le rétablissement est possible. La personne commence à reconnaître qu\'une vie satisfaisante est possible.',
    items: [2, 7, 12, 17, 22, 27, 32, 37, 42, 47],
    color: 'amber',
  },
  3: {
    label: 'Préparation',
    english: 'Preparation',
    dbField: 'stori_etap3',
    description: 'La personne commence à travailler sur ses compétences de rétablissement, apprend sur la maladie et explore ses forces et faiblesses.',
    items: [3, 8, 13, 18, 23, 28, 33, 38, 43, 48],
    color: 'yellow',
  },
  4: {
    label: 'Reconstruction',
    english: 'Rebuilding',
    dbField: 'stori_etap4',
    description: 'Travail actif vers un style de vie positif. La personne assume la responsabilité de son rétablissement et travaille sur des objectifs personnels significatifs.',
    items: [4, 9, 14, 19, 24, 29, 34, 39, 44, 49],
    color: 'lime',
  },
  5: {
    label: 'Croissance',
    english: 'Growth',
    dbField: 'stori_etap5',
    description: 'Vie pleinement satisfaisante avec un sens de soi positif. La personne regarde vers l\'avenir avec optimisme et considère l\'expérience comme source de croissance personnelle.',
    items: [5, 10, 15, 20, 25, 30, 35, 40, 45, 50],
    color: 'green',
  },
} as const;

// ============================================================================
// Scoring Functions
// ============================================================================

export interface StoriSzScoreResult {
  stori_etap1: number;
  stori_etap2: number;
  stori_etap3: number;
  stori_etap4: number;
  stori_etap5: number;
  dominant_stage: number;
  interpretation: string;
}

/**
 * Get items for a specific stage
 * Pattern: Item n maps to Stage (n % 5), where n%5=0 maps to Stage 5
 */
function getStageItems(stage: number): number[] {
  const items: number[] = [];
  for (let i = 1; i <= 50; i++) {
    const itemStage = i % 5 === 0 ? 5 : i % 5;
    if (itemStage === stage) {
      items.push(i);
    }
  }
  return items;
}

/**
 * Calculate stage score (sum of 10 items, range 0-50)
 */
function calculateStageScore(responses: Record<string, any>, stage: number): number {
  const items = getStageItems(stage);
  let score = 0;
  for (const item of items) {
    const value = responses[`q${item}`];
    if (typeof value === 'number' && !isNaN(value)) {
      score += value;
    }
  }
  return score;
}

/**
 * Compute all STORI scores
 */
export function computeStoriSzScores(responses: Record<string, any>): StoriSzScoreResult {
  const stori_etap1 = calculateStageScore(responses, 1);
  const stori_etap2 = calculateStageScore(responses, 2);
  const stori_etap3 = calculateStageScore(responses, 3);
  const stori_etap4 = calculateStageScore(responses, 4);
  const stori_etap5 = calculateStageScore(responses, 5);
  
  // Determine dominant stage (highest score)
  // Note: When scores are equal, select the MORE ADVANCED stage (higher stage number)
  // as per Andresen et al. STORI scoring guidelines
  const scores = [
    { stage: 1, score: stori_etap1 },
    { stage: 2, score: stori_etap2 },
    { stage: 3, score: stori_etap3 },
    { stage: 4, score: stori_etap4 },
    { stage: 5, score: stori_etap5 },
  ];
  
  // Find max score and corresponding stage
  // Use >= comparison for stage to select the more advanced stage when scores are equal
  let maxScore = -1;
  let dominant_stage = 1;
  for (const { stage, score } of scores) {
    if (score > maxScore || (score === maxScore && stage > dominant_stage)) {
      maxScore = score;
      dominant_stage = stage;
    }
  }
  
  return {
    stori_etap1,
    stori_etap2,
    stori_etap3,
    stori_etap4,
    stori_etap5,
    dominant_stage,
    interpretation: interpretStoriSzScore(dominant_stage, scores),
  };
}

/**
 * Interpret STORI scores based on dominant stage
 * Note: When scores are equal, the more advanced stage is selected (per STORI guidelines)
 */
export function interpretStoriSzScore(
  dominantStage: number,
  scores: { stage: number; score: number }[]
): string {
  const stageInfo = STORI_STAGES[dominantStage as keyof typeof STORI_STAGES];
  const stageLabel = stageInfo.label;
  const stageDescription = stageInfo.description;
  
  // Check for ties
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  const topScore = sortedScores[0].score;
  const tiedStages = sortedScores.filter(s => s.score === topScore);
  
  let interpretation = `Stade dominant : ${stageLabel} (Étape ${dominantStage}/5)\n\n`;
  interpretation += `${stageDescription}\n\n`;
  
  // Note ties but dominant_stage is already the most advanced (per STORI guidelines)
  if (tiedStages.length > 1 && topScore > 0) {
    const tiedLabels = tiedStages.map(s => 
      STORI_STAGES[s.stage as keyof typeof STORI_STAGES].label
    ).join(', ');
    interpretation += `Note : Scores égaux entre les stades ${tiedLabels}. Le stade le plus avancé (${stageLabel}) a été sélectionné selon les directives de cotation STORI.\n\n`;
  }
  
  // Add recommendations based on dominant stage
  if (dominantStage === 1 && topScore >= 30) {
    interpretation += 'Recommandation : Interventions de soutien émotionnel, réduction du désespoir, établissement de relations thérapeutiques de confiance.';
  } else if (dominantStage === 2) {
    interpretation += 'Recommandation : Renforcement de l\'espoir, exposition à des modèles de rétablissement (pairs-aidants).';
  } else if (dominantStage === 3) {
    interpretation += 'Recommandation : Psychoéducation, développement de stratégies d\'adaptation, identification des forces.';
  } else if (dominantStage === 4) {
    interpretation += 'Recommandation : Soutien à l\'autonomisation, développement de projets personnels, prévention des rechutes.';
  } else if (dominantStage === 5) {
    interpretation += 'Recommandation : Maintien du bien-être, contribution à la communauté, mentorat de pairs.';
  }
  
  return interpretation;
}

// ============================================================================
// Question Options
// ============================================================================

const QUESTIONNAIRE_DONE_OPTIONS = [
  { code: 'Fait', label: 'Fait' },
  { code: 'Non fait', label: 'Non fait' },
];

const STORI_OPTIONS = [
  { code: 0, label: '0 - Pas du tout vrai actuellement', score: 0 },
  { code: 1, label: '1', score: 1 },
  { code: 2, label: '2', score: 2 },
  { code: 3, label: '3', score: 3 },
  { code: 4, label: '4', score: 4 },
  { code: 5, label: '5 - Complètement vrai actuellement', score: 5 },
];

// ============================================================================
// Questions Array
// ============================================================================

export const STORI_SZ_QUESTIONS: Question[] = [
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
    text: 'Le questionnaire suivant porte sur vos sentiments à propos de votre vie et de vous-même depuis la maladie.\n\nCertaines questions concernent les fois où vous ne vous sentez pas trop bien. D\'autres questions portent sur les moments où vous vous sentez très bien dans votre vie.\n\nQuand vous choisissez votre réponse, pensez à comment vous vous sentez actuellement et non pas à comment vous avez pu vous sentir par le passé.',
    type: 'instruction',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  
  // ========== GROUP 1 ==========
  {
    id: 'section_group1',
    text: 'Groupe 1',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q1',
    text: '1. Je ne pense pas que les gens qui ont une maladie psychique puissent aller mieux.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group1',
  },
  {
    id: 'q2',
    text: '2. J\'ai seulement récemment découvert que les gens avec une maladie psychique peuvent aller mieux.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group1',
  },
  {
    id: 'q3',
    text: '3. Je commence à apprendre comment je peux faire des choses pour moi afin d\'aller mieux.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group1',
  },
  {
    id: 'q4',
    text: '4. Je travaille dur pour rester bien et cela en vaudra la peine sur le long terme.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group1',
  },
  {
    id: 'q5',
    text: '5. J\'ai maintenant un sentiment de « paix intérieure » au sujet de la vie avec la maladie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group1',
  },
  
  // ========== GROUP 2 ==========
  {
    id: 'section_group2',
    text: 'Groupe 2',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q6',
    text: '6. Je sens que ma vie a été ruinée par cette maladie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group2',
  },
  {
    id: 'q7',
    text: '7. Je commence seulement à réaliser que ma vie n\'a pas à être affreuse pour toujours.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group2',
  },
  {
    id: 'q8',
    text: '8. J\'ai récemment commencé à apprendre des gens qui vivent bien malgré une sérieuse maladie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group2',
  },
  {
    id: 'q9',
    text: '9. Je commence à être raisonnablement confiant à propos de remettre ma vie sur les rails.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group2',
  },
  {
    id: 'q10',
    text: '10. Ma vie est vraiment bonne maintenant et le futur s\'annonce lumineux.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group2',
  },
  
  // ========== GROUP 3 ==========
  {
    id: 'section_group3',
    text: 'Groupe 3',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q11',
    text: '11. Je me sens actuellement comme si je n\'étais qu\'une personne malade.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group3',
  },
  {
    id: 'q12',
    text: '12. Parce que les autres ont confiance en moi, je commence tout juste à penser que peut-être je peux aller mieux.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group3',
  },
  {
    id: 'q13',
    text: '13. Je commence seulement à réaliser que la maladie ne change pas qui je suis en tant que personne.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group3',
  },
  {
    id: 'q14',
    text: '14. Je commence actuellement à accepter la maladie comme une partie du tout qui fait ma personne.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group3',
  },
  {
    id: 'q15',
    text: '15. Je suis heureux d\'être la personne que je suis.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group3',
  },
  
  // ========== GROUP 4 ==========
  {
    id: 'section_group4',
    text: 'Groupe 4',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q16',
    text: '16. J\'ai l\'impression de ne plus savoir qui je suis.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group4',
  },
  {
    id: 'q17',
    text: '17. J\'ai récemment commencé à reconnaître qu\'une partie de moi n\'est pas affectée par la maladie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group4',
  },
  {
    id: 'q18',
    text: '18. Je commence juste à réaliser que je peux toujours être une personne de valeur.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group4',
  },
  {
    id: 'q19',
    text: '19. J\'apprends de nouvelles choses sur moi-même alors que je travaille à mon rétablissement.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group4',
  },
  {
    id: 'q20',
    text: '20. Je pense que le fait d\'avoir travaillé pour dépasser la maladie a fait de moi une personne meilleure.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group4',
  },
  
  // ========== GROUP 5 ==========
  {
    id: 'section_group5',
    text: 'Groupe 5',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q21',
    text: '21. Je ne serai jamais la personne que je pensais que je serais.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group5',
  },
  {
    id: 'q22',
    text: '22. J\'ai tout juste commencé à accepter la maladie comme une partie de ma vie avec laquelle je vais devoir apprendre à vivre.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group5',
  },
  {
    id: 'q23',
    text: '23. Je commence à reconnaître où sont mes forces et mes faiblesses.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group5',
  },
  {
    id: 'q24',
    text: '24. Je commence à sentir que j\'apporte une contribution de valeur à la vie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group5',
  },
  {
    id: 'q25',
    text: '25. J\'accomplis des choses qui valent la peine et qui sont satisfaisantes dans ma vie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group5',
  },
  
  // ========== GROUP 6 ==========
  {
    id: 'section_group6',
    text: 'Groupe 6',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q26',
    text: '26. Je suis en colère que cela me soit arrivé à moi.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group6',
  },
  {
    id: 'q27',
    text: '27. Je commence tout juste à me demander si des choses positives pourraient ressortir de ce qui m\'arrive.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group6',
  },
  {
    id: 'q28',
    text: '28. Je commence à réfléchir à quelles sont mes qualités particulières.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group6',
  },
  {
    id: 'q29',
    text: '29. En devant faire face à la maladie, j\'apprends beaucoup au sujet de la vie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group6',
  },
  {
    id: 'q30',
    text: '30. En surmontant la maladie, j\'ai acquis de nouvelles valeurs dans la vie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group6',
  },
  
  // ========== GROUP 7 ==========
  {
    id: 'section_group7',
    text: 'Groupe 7',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q31',
    text: '31. Ma vie me semble totalement inutile actuellement.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group7',
  },
  {
    id: 'q32',
    text: '32. Je commence tout juste à penser que je peux peut-être faire quelque chose de ma vie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group7',
  },
  {
    id: 'q33',
    text: '33. J\'essaie de penser à des moyens d\'apporter une contribution dans la vie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group7',
  },
  {
    id: 'q34',
    text: '34. Je travaille ces jours sur des choses de la vie qui sont personnellement importantes pour moi.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group7',
  },
  {
    id: 'q35',
    text: '35. J\'ai des projets importants qui me donnent une raison d\'être.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group7',
  },
  
  // ========== GROUP 8 ==========
  {
    id: 'section_group8',
    text: 'Groupe 8',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q36',
    text: '36. Je ne peux rien faire à propos de ma situation.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group8',
  },
  {
    id: 'q37',
    text: '37. Je commence à penser que je pourrais faire quelque chose pour m\'aider.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group8',
  },
  {
    id: 'q38',
    text: '38. Je commence à me sentir plus confiant au sujet d\'apprendre à vivre avec la maladie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group8',
  },
  {
    id: 'q39',
    text: '39. Il y a parfois des revers mais je ne laisse pas tomber.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group8',
  },
  {
    id: 'q40',
    text: '40. Je me réjouis de relever de nouveaux défis dans la vie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group8',
  },
  
  // ========== GROUP 9 ==========
  {
    id: 'section_group9',
    text: 'Groupe 9',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q41',
    text: '41. Les autres savent mieux que moi ce qui est bon pour moi.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group9',
  },
  {
    id: 'q42',
    text: '42. J\'aimerais commencer à apprendre à m\'occuper de moi correctement.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group9',
  },
  {
    id: 'q43',
    text: '43. Je commence à en apprendre davantage sur la maladie psychique et sur comment je peux m\'aider moi-même.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group9',
  },
  {
    id: 'q44',
    text: '44. Je me sens maintenant raisonnablement confiant en ce qui concerne la gestion de la maladie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group9',
  },
  {
    id: 'q45',
    text: '45. Maintenant, je peux bien gérer la maladie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group9',
  },
  
  // ========== GROUP 10 ==========
  {
    id: 'section_group10',
    text: 'Groupe 10',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
  },
  {
    id: 'q46',
    text: '46. Il ne me semble pas que j\'aie actuellement un quelconque contrôle sur ma vie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group10',
  },
  {
    id: 'q47',
    text: '47. J\'aimerais commencer à apprendre à gérer la maladie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group10',
  },
  {
    id: 'q48',
    text: '48. Je commence seulement à travailler pour remettre ma vie sur les rails.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group10',
  },
  {
    id: 'q49',
    text: '49. Je commence à me sentir responsable de ma propre vie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group10',
  },
  {
    id: 'q50',
    text: '50. Je suis aux commandes de ma propre vie.',
    type: 'single_choice',
    required: false,
    options: STORI_OPTIONS,
    display_if: { '==': [{ var: 'questionnaire_done' }, 'Fait'] },
    section: 'group10',
  },
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const STORI_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'stori_sz',
  code: 'STORI_SZ',
  title: 'STORI - Stades du Rétablissement',
  description: "L'échelle STORI (Stages of Recovery Instrument) mesure les stades du rétablissement psychologique chez les personnes souffrant de troubles psychiatriques sévères. Elle évalue 5 étapes du processus de rétablissement selon le modèle d'Andresen et al.",
  questions: STORI_SZ_QUESTIONS,
  metadata: {
    pathologies: ['schizophrenia'],
    target_role: 'patient',
    instructions: 'Le questionnaire suivant porte sur vos sentiments à propos de votre vie et de vous-même depuis la maladie. Quand vous choisissez votre réponse, pensez à comment vous vous sentez actuellement.',
    reference: 'Andresen R, Caputi P, Oades LG. Stages of recovery instrument: development of a measure of recovery from serious mental illness. Aust N Z J Psychiatry. 2006;40(11-12):972-980.',
    stages: STORI_STAGES,
    total_items: 50,
    groups: 10,
    items_per_group: 5,
    items_per_stage: 10,
    score_range_per_stage: { min: 0, max: 50 },
    scale: '6-point Likert (0-5)',
    // 4 recovery processes (Andresen et al., 2003): Hope, Identity, Meaning, Responsibility
    // Each group represents one of these 4 processes (2-3 groups per process)
    // Items within each group represent the 5 stages of recovery
    processes: ['Espoir', 'Identité', 'Sens', 'Responsabilité'],
    scoring_notes: {
      no_total_score: true,
      tie_breaking: 'En cas d\'égalité des scores les plus élevés, le stade le plus avancé est sélectionné.',
      no_process_scores: 'Les processus individuels ne sont pas évalués séparément.',
    },
  }
};
