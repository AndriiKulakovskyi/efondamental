// ============================================================================
// eFondaMental Platform - Schizophrenia Initial Evaluation
// EPHP - Échelle d'Évaluation du Handicap Psychique par l'Entourage
// Hetero-administered questionnaire completed by caregiver/entourage
// ============================================================================

import { Question } from '@/lib/types/database.types';
import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';

// ============================================================================
// TypeScript Types matching schizophrenia_ephp table schema
// ============================================================================

export interface SchizophreniaEphpResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Administration status
  questionnaire_done?: string | null; // 'Fait' | 'Non fait'
  
  // Section A: Capacités cognitives (0-6, 7=non évaluable)
  a1?: number | null;
  a2?: number | null;
  a3?: number | null;
  a4?: number | null;
  
  // Section B: Motivation (0-6, 7=non évaluable)
  b5?: number | null;
  b6?: number | null;
  b7?: number | null;
  b8?: number | null;
  
  // Section C: Communication (0-6, 7=non évaluable)
  c9?: number | null;
  c10?: number | null;
  c11?: number | null;
  
  // Section D: Auto-évaluation (0-6, 7=non évaluable)
  d12?: number | null;
  d13?: number | null;
  
  // Domain subscores
  score_cognitiv?: number | null;
  score_motiv?: number | null;
  score_comm?: number | null;
  score_eval?: number | null;
  
  // Global score and interpretation
  total_score?: number | null;
  interpretation?: string | null;
  
  // Metadata
  completed_by?: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaEphpResponseInsert = Omit<
  SchizophreniaEphpResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'score_cognitiv' | 'score_motiv' | 'score_comm' | 'score_eval' |
  'total_score' | 'interpretation'
>;

// ============================================================================
// Score Result Interface
// ============================================================================

export interface EphpSzScoreResult {
  score_cognitiv: number;
  score_motiv: number;
  score_comm: number;
  score_eval: number;
  total_score: number;
  interpretation: string;
  // Track excluded items (value 7)
  excluded_items: string[];
}

// ============================================================================
// Domain Definitions
// ============================================================================

export const EPHP_DOMAINS = {
  cognitiv: {
    label: 'A - Capacités cognitives',
    items: ['a1', 'a2', 'a3', 'a4'],
    maxScore: 24
  },
  motiv: {
    label: 'B - Motivation',
    items: ['b5', 'b6', 'b7', 'b8'],
    maxScore: 24
  },
  comm: {
    label: 'C - Communication',
    items: ['c9', 'c10', 'c11'],
    maxScore: 18
  },
  eval: {
    label: 'D - Auto-évaluation',
    items: ['d12', 'd13'],
    maxScore: 12
  }
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const EPHP_SZ_QUESTIONS: Question[] = [
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

  // Section A - Capacités cognitives
  {
    id: 'section_a_header',
    text: 'A Capacités cognitives',
    type: 'label',
    required: false,
    section: 'A - Capacités cognitives',
    help_text: 'Cette rubrique concerne la manière dont les aptitudes cognitives (capacités d\'organisation, adaptation au contexte de la situation, attention, mémorisation) interfèrent avec les activités de la vie quotidienne. Le score retenu doit se baser sur le meilleur niveau de réalisation atteint, même si la personne a bénéficié d\'une stimulation extérieure. Les exemples de situations retenus ne doivent pas impliquer directement d\'interaction avec autrui.'
  },
  {
    id: 'a1',
    text: '1. Capacité à s\'organiser dans une activité habituelle (routine de vie: faire une course, préparer un repas, etc.)',
    type: 'single_choice',
    required: false,
    section: 'A - Capacités cognitives',
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 0, label: '0 - La difficulté à s\'organiser concerne toutes les actions simples de la vie quotidienne', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Capable de réaliser des actes très simples mais ne s\'adapte pas aux changements contextuels banaux', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Capable d\'activités plus complexes impliquant de faire deux choses en même temps, si rien ne perturbe', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Capable de réaliser tous les actes routiniers, même avec nombreuses séquences successives', score: 6 },
      { code: 7, label: '7 - Non évaluable', score: null }
    ]
  },
  {
    id: 'a2',
    text: '2. Capacité à s\'organiser dans une activité inhabituelle (situation nouvelle: trajet nouveau, réparer un objet, etc.)',
    type: 'single_choice',
    required: false,
    section: 'A - Capacités cognitives',
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 0, label: '0 - Aucune situation nouvelle, même simple, ne peut être correctement réalisée', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Capable d\'actes non routiniers très simples', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Capable d\'activités non routinières plus complexes', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Très bon niveau de réalisation dans des situations non routinières complexes', score: 6 },
      { code: 7, label: '7 - Non évaluable', score: null }
    ]
  },
  {
    id: 'a3',
    text: '3. Capacités d\'apprentissage (acquérir de nouvelles connaissances ou des savoir-faire)',
    type: 'single_choice',
    required: false,
    section: 'A - Capacités cognitives',
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 0, label: '0 - Ne parvient jamais à acquérir une nouvelle connaissance ou habileté même simple', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Capable d\'acquérir de manière très lente et limitée et/ou au prix d\'une aide intense', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Capacités réelles dans certains domaines mais progrès facilement remis en cause', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Excellentes capacités d\'apprentissage', score: 6 },
      { code: 7, label: '7 - Non évaluable', score: null }
    ]
  },
  {
    id: 'a4',
    text: '4. Capacité à fixer son attention et à mémoriser',
    type: 'single_choice',
    required: false,
    section: 'A - Capacités cognitives',
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 0, label: '0 - Ne peut fixer son attention plus de quelques secondes', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Fixe quelques minutes mais perd le fil, ne fait pas de résumé', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Capable de fixer son attention le temps d\'un film mais fatigable', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Pas de difficulté notable dans les situations motivantes', score: 6 },
      { code: 7, label: '7 - Non évaluable', score: null }
    ]
  },

  // Section B - Motivation
  {
    id: 'section_b_header',
    text: 'B Motivation',
    type: 'label',
    required: false,
    section: 'B - Motivation'
  },
  {
    id: 'b5',
    text: '5. Difficulté à initier une action de base (gestes élémentaires: se lever, faire son lit, descendre la poubelle)',
    type: 'single_choice',
    required: false,
    section: 'B - Motivation',
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 0, label: '0 - Retentit considérablement sur la vie quotidienne, aide constante nécessaire', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Capable de faire face aux besoins fondamentaux mais difficulté retentit très fortement', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Suffisamment entreprenant pour besoins courants mais manque d\'initiative', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Pas de difficulté particulière, niveau d\'énergie correct', score: 6 },
      { code: 7, label: '7 - Non évaluable', score: null }
    ]
  },
  {
    id: 'b6',
    text: '6. Difficulté à anticiper et à s\'impliquer dans un projet (manque de motivation, dynamisme, sensibilité au stress)',
    type: 'single_choice',
    required: false,
    section: 'B - Motivation',
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 0, label: '0 - Tout engagement dans un projet même simple est impossible', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Quelques projets mais rares actions, manque gravement de dynamisme', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Capable d\'initiatives mais manque de persévérance', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Ne manque pas de motivation, persévère même face aux difficultés', score: 6 },
      { code: 7, label: '7 - Non évaluable', score: null }
    ]
  },
  {
    id: 'b7',
    text: '7. Utilisation du temps (temps passé sans but précis, à ne rien faire)',
    type: 'single_choice',
    required: false,
    section: 'B - Motivation',
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 0, label: '0 - Passe toute sa journée ou presque à ne rien faire', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Passe environ la moitié de ses journées à ne rien faire', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Passe trop de temps mais moins de la moitié à ne rien faire', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Absence d\'inactivité excessive', score: 6 },
      { code: 7, label: '7 - Non évaluable', score: null }
    ]
  },
  {
    id: 'b8',
    text: '8. Curiosité (attention à son environnement, intérêt pour le monde, questions d\'actualité)',
    type: 'single_choice',
    required: false,
    section: 'B - Motivation',
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 0, label: '0 - Aucune ou quasi aucune curiosité pour son environnement', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Certaine curiosité sporadique mais non suivie', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Quelques sujets de curiosité avec effort pour mieux les connaître', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Curiosité pour de nombreux sujets avec effort évident', score: 6 },
      { code: 7, label: '7 - Non évaluable', score: null }
    ]
  },

  // Section C - Communication
  {
    id: 'section_c_header',
    text: 'C Capacités de communication et de compréhension des autres',
    type: 'label',
    required: false,
    section: 'C - Communication'
  },
  {
    id: 'c9',
    text: '9. Capacités d\'empathie cognitive (comprendre que les autres ont des croyances, désirs, intentions propres)',
    type: 'single_choice',
    required: false,
    section: 'C - Communication',
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 0, label: '0 - Incapable de se mettre à la place des autres', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Très peu capable, comprend parfois de manière sporadique', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Parvient plus régulièrement mais commet souvent des erreurs', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Prend spontanément en considération la situation d\'autrui', score: 6 },
      { code: 7, label: '7 - Non évaluable', score: null }
    ]
  },
  {
    id: 'c10',
    text: '10. Capacités d\'empathie émotionnelle (sensibilité aux émotions d\'autrui, chaleur, tact)',
    type: 'single_choice',
    required: false,
    section: 'C - Communication',
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 0, label: '0 - Incapable de percevoir les émotions d\'autrui et d\'y réagir', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Perçoit parfois mais globalement peu chaleureux ou indifférent', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Manifeste plus régulièrement sa sensibilité, parfois chaleureux', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Ressent intuitivement, chaleureux, tolérant, fait preuve de tact', score: 6 },
      { code: 7, label: '7 - Non évaluable', score: null }
    ]
  },
  {
    id: 'c11',
    text: '11. Capacités à identifier les rôles sociaux, la signification des situations sociales',
    type: 'single_choice',
    required: false,
    section: 'C - Communication',
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 0, label: '0 - Incapable d\'identifier et de comprendre les situations sociales', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Identifie certaines situations simples et stéréotypées', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Identifie les situations les plus courantes avec compréhension', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Aucune difficulté pour se repérer dans les interactions sociales', score: 6 },
      { code: 7, label: '7 - Non évaluable', score: null }
    ]
  },

  // Section D - Auto-évaluation
  {
    id: 'section_d_header',
    text: 'D Capacité d\'autoévaluation de ses capacités et de prise en compte de ses limites',
    type: 'label',
    required: false,
    section: 'D - Auto-évaluation'
  },
  {
    id: 'd12',
    text: '12. Capacité à savoir évaluer ses capacités et à reconnaître ses limites',
    type: 'single_choice',
    required: false,
    section: 'D - Auto-évaluation',
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 0, label: '0 - Aucune conscience de ses difficultés et incapacités', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Conscience limitée, convaincu d\'avoir un degré d\'autonomie supérieur au réel', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Perçoit ses difficultés dans certains domaines mais les minimise ou amplifie', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Réelle connaissance de ses difficultés, capable de décrire précisément', score: 6 },
      { code: 7, label: '7 - Non évaluable', score: null }
    ]
  },
  {
    id: 'd13',
    text: '13. Capacité à savoir demander de l\'aide en cas de besoin et à coopérer aux soins',
    type: 'single_choice',
    required: false,
    section: 'D - Auto-évaluation',
    display_if: { field: 'questionnaire_done', operator: 'equals', value: 'Fait' },
    options: [
      { code: 0, label: '0 - Incapable de demander de l\'aide, réticent aux propositions', score: 0 },
      { code: 1, label: '1', score: 1 },
      { code: 2, label: '2 - Ne demande rien spontanément mais accepte passivement quelques aides', score: 2 },
      { code: 3, label: '3', score: 3 },
      { code: 4, label: '4 - Capable de demander de l\'aide, exprime des attentes, coopérant stable', score: 4 },
      { code: 5, label: '5', score: 5 },
      { code: 6, label: '6 - Demande de l\'aide de manière adaptée, collabore activement aux soins', score: 6 },
      { code: 7, label: '7 - Non évaluable', score: null }
    ]
  }
];

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Helper function to sum items, excluding value 7 (non évaluable)
 */
function sumItemsExcludingNonEvaluable(
  responses: Record<string, any>,
  items: string[]
): { sum: number; excluded: string[] } {
  let sum = 0;
  const excluded: string[] = [];
  
  for (const item of items) {
    const value = responses[item];
    if (typeof value === 'number') {
      if (value === 7) {
        excluded.push(item);
      } else if (value >= 0 && value <= 6) {
        sum += value;
      }
    }
  }
  
  return { sum, excluded };
}

/**
 * Compute all EPHP scores
 */
export function computeEphpSzScores(responses: Record<string, any>): EphpSzScoreResult {
  const allExcluded: string[] = [];
  
  // Calculate domain subscores
  const cognitivResult = sumItemsExcludingNonEvaluable(responses, EPHP_DOMAINS.cognitiv.items);
  const motivResult = sumItemsExcludingNonEvaluable(responses, EPHP_DOMAINS.motiv.items);
  const commResult = sumItemsExcludingNonEvaluable(responses, EPHP_DOMAINS.comm.items);
  const evalResult = sumItemsExcludingNonEvaluable(responses, EPHP_DOMAINS.eval.items);
  
  allExcluded.push(...cognitivResult.excluded, ...motivResult.excluded, ...commResult.excluded, ...evalResult.excluded);
  
  const score_cognitiv = cognitivResult.sum;
  const score_motiv = motivResult.sum;
  const score_comm = commResult.sum;
  const score_eval = evalResult.sum;
  
  // Calculate global score
  const total_score = score_cognitiv + score_motiv + score_comm + score_eval;
  
  // Generate interpretation
  const interpretation = interpretEphpSzScore(
    total_score,
    score_cognitiv,
    score_motiv,
    score_comm,
    score_eval,
    allExcluded
  );
  
  return {
    score_cognitiv,
    score_motiv,
    score_comm,
    score_eval,
    total_score,
    interpretation,
    excluded_items: allExcluded
  };
}

/**
 * Generate interpretation text
 */
export function interpretEphpSzScore(
  totalScore: number,
  scoreCognitiv: number,
  scoreMotiv: number,
  scoreComm: number,
  scoreEval: number,
  excludedItems: string[]
): string {
  const percentage = Math.round((totalScore / 78) * 100);
  
  let interpretation = `Score global EPHP: ${totalScore}/78 (${percentage}%).`;
  
  // Overall functioning level
  if (percentage >= 75) {
    interpretation += ' Bon niveau de fonctionnement global.';
  } else if (percentage >= 50) {
    interpretation += ' Niveau de fonctionnement modéré avec des difficultés dans certains domaines.';
  } else if (percentage >= 25) {
    interpretation += ' Niveau de fonctionnement altéré avec des difficultés significatives.';
  } else {
    interpretation += ' Niveau de fonctionnement très altéré, handicap psychique important.';
  }
  
  // Domain-specific insights
  const domainAnalysis: string[] = [];
  
  // Cognitif (max 24)
  const cognitivPct = Math.round((scoreCognitiv / 24) * 100);
  if (cognitivPct < 50) {
    domainAnalysis.push('capacités cognitives altérées');
  }
  
  // Motivation (max 24)
  const motivPct = Math.round((scoreMotiv / 24) * 100);
  if (motivPct < 50) {
    domainAnalysis.push('déficit motivationnel');
  }
  
  // Communication (max 18)
  const commPct = Math.round((scoreComm / 18) * 100);
  if (commPct < 50) {
    domainAnalysis.push('difficultés de communication et cognition sociale');
  }
  
  // Auto-évaluation (max 12)
  const evalPct = Math.round((scoreEval / 12) * 100);
  if (evalPct < 50) {
    domainAnalysis.push('insight et demande d\'aide limités');
  }
  
  if (domainAnalysis.length > 0) {
    interpretation += ` Points d'attention: ${domainAnalysis.join(', ')}.`;
  }
  
  // Note excluded items
  if (excludedItems.length > 0) {
    interpretation += ` Note: ${excludedItems.length} item(s) non évaluable(s) exclu(s) du calcul.`;
  }
  
  return interpretation;
}

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const EPHP_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'ephp_sz',
  code: 'EPHP_SZ',
  title: 'EPHP - Handicap Psychique (Entourage)',
  description: 'Évaluation du handicap psychique par l\'entourage. 13 items, score 0-78. Score élevé = meilleur fonctionnement.',
  questions: EPHP_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'entourage',
    reference: 'Fondation Fondamental - Autoquestionnaires Entourage'
  }
};
