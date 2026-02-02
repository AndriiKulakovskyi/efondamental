// ============================================================================
// eFondaMental Platform - SSTICS
// Subjective Scale to Investigate Cognition in Schizophrenia
// Schizophrenia Initial Evaluation - Neuropsy Module - WAIS-IV Subgroup
// Self-report questionnaire assessing subjective cognitive complaints
// Reference: Stip E. et al. (2000)
// ============================================================================

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaSsticsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // 21 item scores (0-4 each)
  q1: number | null;   // Mémoire de travail
  q2: number | null;   // Mémoire de travail
  q3: number | null;   // Mémoire explicite
  q4: number | null;   // Mémoire explicite
  q5: number | null;   // Mémoire explicite
  q6: number | null;   // Mémoire explicite
  q7: number | null;   // Mémoire explicite
  q8: number | null;   // Mémoire explicite
  q9: number | null;   // Mémoire explicite
  q10: number | null;  // Mémoire explicite
  q11: number | null;  // Mémoire explicite
  q12: number | null;  // Attention
  q13: number | null;  // Attention
  q14: number | null;  // Attention
  q15: number | null;  // Attention
  q16: number | null;  // Attention
  q17: number | null;  // Fonctions exécutives
  q18: number | null;  // Fonctions exécutives
  q19: number | null;  // Fonctions exécutives
  q20: number | null;  // Langage
  q21: number | null;  // Praxies
  
  // Domain subscores
  sstics_memt: number | null;     // Mémoire de travail (0-8)
  sstics_memexp: number | null;   // Mémoire explicite (0-36)
  sstics_att: number | null;      // Attention (0-20)
  sstics_fe: number | null;       // Fonctions exécutives (0-12)
  sstics_lang: number | null;     // Langage (0-4)
  sstics_prax: number | null;     // Praxies (0-4)
  
  // Total and Z-score
  sstics_score: number | null;    // Total score (0-84)
  sstics_scorez: number | null;   // Z-score: (13.1 - total) / 6.2
  
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaSsticsResponseInsert = Omit<
  SchizophreniaSsticsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'sstics_memt' | 'sstics_memexp' | 'sstics_att' | 'sstics_fe' | 
  'sstics_lang' | 'sstics_prax' | 'sstics_score' | 'sstics_scorez'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Domain Configuration
// ============================================================================

export const SSTICS_DOMAINS = {
  memt: {
    label: 'Mémoire de travail',
    label_en: 'Working Memory',
    items: [1, 2],
    max_score: 8
  },
  memexp: {
    label: 'Mémoire explicite',
    label_en: 'Explicit Memory',
    items: [3, 4, 5, 6, 7, 8, 9, 10, 11],
    max_score: 36
  },
  att: {
    label: 'Attention',
    label_en: 'Attention',
    items: [12, 13, 14, 15, 16],
    max_score: 20
  },
  fe: {
    label: 'Fonctions exécutives',
    label_en: 'Executive Functions',
    items: [17, 18, 19],
    max_score: 12
  },
  lang: {
    label: 'Langage',
    label_en: 'Language',
    items: [20],
    max_score: 4
  },
  prax: {
    label: 'Praxies',
    label_en: 'Praxis',
    items: [21],
    max_score: 4
  }
};

// Normative data
export const SSTICS_NORMS = {
  mean: 13.1,
  sd: 6.2
};

// ============================================================================
// Response Options (5-point Likert scale)
// ============================================================================

const SSTICS_OPTIONS = [
  { code: 4, label: 'Très souvent', score: 4 },
  { code: 3, label: 'Souvent', score: 3 },
  { code: 2, label: 'Parfois', score: 2 },
  { code: 1, label: 'Rarement', score: 1 },
  { code: 0, label: 'Jamais', score: 0 },
];

// ============================================================================
// Item Definitions
// ============================================================================

const SSTICS_ITEMS = [
  {
    id: 'q1',
    item_number: 1,
    domain: 'memt',
    text: 'Avez-vous remarqué que vous avez des troubles de mémoire'
  },
  {
    id: 'q2',
    item_number: 2,
    domain: 'memt',
    text: "Avez-vous de la difficulté à vous souvenir d'informations que l'on vous donne immédiatement et que vous devez utiliser tout de suite comme par exemple, un numéro de téléphone, une adresse, un numéro de porte ou de bureau, un numéro de bus ou le nom d'un docteur"
  },
  {
    id: 'q3',
    item_number: 3,
    domain: 'memexp',
    text: "Avez-vous de la difficulté à apprendre quelque chose? Par exemple, une liste d'objets à acheter ou une liste de noms de personne"
  },
  {
    id: 'q4',
    item_number: 4,
    domain: 'memexp',
    text: 'Avez-vous de la difficulté à vous souvenir du nom de vos médicaments'
  },
  {
    id: 'q5',
    item_number: 5,
    domain: 'memexp',
    text: 'Faites-vous des oublis comme par exemple un rendez-vous avec un ami, chez un médecin'
  },
  {
    id: 'q6',
    item_number: 6,
    domain: 'memexp',
    text: 'Oubliez-vous de prendre vos médicaments'
  },
  {
    id: 'q7',
    item_number: 7,
    domain: 'memexp',
    text: 'Avez-vous de la difficulté à vous souvenir des informations dans les journaux ou à la télévision'
  },
  {
    id: 'q8',
    item_number: 8,
    domain: 'memexp',
    text: "Avez-vous de la difficulté à accomplir des tâches ménagères ou du bricolage? Par exemple, vous oubliez comment faire la cuisine, ou oubliez-vous les ingrédients"
  },
  {
    id: 'q9',
    item_number: 9,
    domain: 'memexp',
    text: "Avez-vous de la difficulté à savoir comment on se rend à l'hôpital, ou à la clinique externe, ou même chez vous"
  },
  {
    id: 'q10',
    item_number: 10,
    domain: 'memexp',
    text: 'Avez-vous de la difficulté à vous souvenir du nom de personnes connues, comme par exemple du président de la république de la France'
  },
  {
    id: 'q11',
    item_number: 11,
    domain: 'memexp',
    text: "Avez-vous de la difficulté à vous souvenir des capitales des pays, des dates de l'histoire du pays, ou du nom des pays des autres continents, ou bien des grandes découvertes de nos savants"
  },
  {
    id: 'q12',
    item_number: 12,
    domain: 'att',
    text: "Êtes-vous distrait, dans la lune? Comme par exemple, vous perdez le fil de vos idées pendant une conversation parce que vous êtes distrait. Ou vous avez du mal à fixer votre esprit sur ce que vous lisez"
  },
  {
    id: 'q13',
    item_number: 13,
    domain: 'att',
    text: "Avez-vous de la difficulté à être en alerte ou réagir suite à une situation imprévue? Comme par exemple, une alerte incendie ou une voiture qui passe soudainement lorsque vous traversez la rue"
  },
  {
    id: 'q14',
    item_number: 14,
    domain: 'att',
    text: "Avez-vous de la difficulté à choisir une information pertinente quand on vous en présente plusieurs? Par exemple, en même temps le nom de vos médicaments ou votre prochain rendez-vous pendant qu'on parle à côté de vous de musique"
  },
  {
    id: 'q15',
    item_number: 15,
    domain: 'att',
    text: "Êtes-vous incapable de faire deux choses en même temps? Par exemple, pendant que vous préparez un café, on vous demande de retenir une adresse. Ou pendant que le pharmacien vous explique votre médication, vous comptez votre argent dans votre porte-monnaie"
  },
  {
    id: 'q16',
    item_number: 16,
    domain: 'att',
    text: "Avez-vous des problèmes à maintenir votre attention sur une même chose pendant plus de 20 minutes? Par exemple, une conférence ou la lecture d'un livre ou un cours en classe"
  },
  {
    id: 'q17',
    item_number: 17,
    domain: 'fe',
    text: "Avez-vous de la difficulté pour planifier vos actions? Comme par exemple, prévoir un itinéraire pour vous rendre à un endroit, ou prévoir un budget pour le mois, ou encore préparer des repas, ou prévoir la lessive"
  },
  {
    id: 'q18',
    item_number: 18,
    domain: 'fe',
    text: "Avez-vous de la difficulté pour organiser vos gestes, vos actes de la vie quotidienne? Comme par exemple, utiliser un téléphone, faire des courses, préparer un repas, faire le ménage, faire la lessive, utiliser un transport, bricoler"
  },
  {
    id: 'q19',
    item_number: 19,
    domain: 'fe',
    text: "Avez-vous des difficultés à changer vos gestes, vos décisions ou votre façon de faire si l'on vous demande de la faire et que vous acceptez? Par exemple, vous êtes d'accord pour le faire mais c'est difficile parce que ce n'est plus pareil"
  },
  {
    id: 'q20',
    item_number: 20,
    domain: 'lang',
    text: "Éprouvez-vous de la difficulté à trouver vos mots, faire des phrases, comprendre les sens des mots ou les prononcer, ou même nommer des objets"
  },
  {
    id: 'q21',
    item_number: 21,
    domain: 'prax',
    text: "Avez-vous du mal à vous habiller ou manger? Comme par exemple, manipuler des boutons, une fermeture-éclair, des outils pour bricoler, des ciseaux, une fourchette pour manger, une clef dans une serrure"
  }
];

// ============================================================================
// Scoring Functions
// ============================================================================

export interface SsticsScoreResult {
  sstics_memt: number;
  sstics_memexp: number;
  sstics_att: number;
  sstics_fe: number;
  sstics_lang: number;
  sstics_prax: number;
  sstics_score: number;
  sstics_scorez: number;
}

/**
 * Calculate all SSTICS scores
 * @param responses Object containing q1-q21 values
 * @returns Domain subscores, total score, and Z-score
 */
export function computeSsticsScores(responses: Record<string, any>): SsticsScoreResult {
  // Helper to safely get item value
  const getItemValue = (itemNum: number): number => {
    const value = responses[`q${itemNum}`];
    return typeof value === 'number' ? value : 0;
  };
  
  // Calculate domain subscores
  const sstics_memt = SSTICS_DOMAINS.memt.items.reduce((sum, item) => sum + getItemValue(item), 0);
  const sstics_memexp = SSTICS_DOMAINS.memexp.items.reduce((sum, item) => sum + getItemValue(item), 0);
  const sstics_att = SSTICS_DOMAINS.att.items.reduce((sum, item) => sum + getItemValue(item), 0);
  const sstics_fe = SSTICS_DOMAINS.fe.items.reduce((sum, item) => sum + getItemValue(item), 0);
  const sstics_lang = SSTICS_DOMAINS.lang.items.reduce((sum, item) => sum + getItemValue(item), 0);
  const sstics_prax = SSTICS_DOMAINS.prax.items.reduce((sum, item) => sum + getItemValue(item), 0);
  
  // Calculate total score (0-84)
  const sstics_score = sstics_memt + sstics_memexp + sstics_att + sstics_fe + sstics_lang + sstics_prax;
  
  // Calculate Z-score: (13.1 - total) / 6.2
  // Negative Z-score = more cognitive complaints than reference population
  const sstics_scorez = Number(((SSTICS_NORMS.mean - sstics_score) / SSTICS_NORMS.sd).toFixed(2));
  
  return {
    sstics_memt,
    sstics_memexp,
    sstics_att,
    sstics_fe,
    sstics_lang,
    sstics_prax,
    sstics_score,
    sstics_scorez
  };
}

/**
 * Interpret SSTICS Z-score
 * @param zScore The computed Z-score
 * @returns Interpretation string
 */
export function interpretSsticsZScore(zScore: number): string {
  if (zScore >= 1.5) {
    return 'Plaintes cognitives nettement inférieures à la population de référence';
  } else if (zScore >= 0.5) {
    return 'Plaintes cognitives inférieures à la population de référence';
  } else if (zScore >= -0.5) {
    return 'Plaintes cognitives comparables à la population de référence';
  } else if (zScore >= -1.5) {
    return 'Plaintes cognitives supérieures à la population de référence';
  } else {
    return 'Plaintes cognitives nettement supérieures à la population de référence';
  }
}

// ============================================================================
// Questions Dictionary
// ============================================================================

export const SSTICS_SZ_QUESTIONS: Question[] = [
  // Instructions
  {
    id: 'instructions_header',
    section: 'Instructions',
    text: "Voici une liste de phrases décrivant des problèmes de mémoire ou de concentration que chacun de vous peut observer dans ses activités de la vie quotidienne. On vous demande d'estimer la fréquence de tels troubles constatés ces derniers temps dans votre comportement. Autrement dit, si vous trouvez que la question que vous lisez (ou que l'on vous lit en même temps que vous) va bien avec votre plainte ou votre problème, on vous demande de répondre à la question en donnant votre appréciation.",
    type: 'instruction',
    required: false,
  },
  
  // Generate all 21 item questions
  ...SSTICS_ITEMS.map((item) => ({
    id: item.id,
    section: SSTICS_DOMAINS[item.domain as keyof typeof SSTICS_DOMAINS].label,
    text: `${item.item_number}. ${item.text}`,
    type: 'single_choice' as const,
    required: true,
    options: SSTICS_OPTIONS,
  })),
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export interface QuestionnaireDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  instructions?: string;
  questions: Question[];
  metadata?: {
    singleColumn?: boolean;
    pathologies?: string[];
    target_role?: 'patient' | 'healthcare_professional';
    reference?: string;
    [key: string]: unknown;
  };
}

export const SSTICS_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'sstics_sz',
  code: 'SSTICS_SZ',
  title: 'SSTICS - Échelle Subjective d\'Investigation de la Cognition dans la Schizophrénie',
  description: 'Auto-questionnaire évaluant la perception subjective des difficultés cognitives du patient dans 6 domaines : mémoire de travail, mémoire explicite, attention, fonctions exécutives, langage et praxies.',
  instructions: "Répondez à chaque question en indiquant la fréquence à laquelle vous avez rencontré ce type de difficulté ces derniers temps. Il n'y a pas de bonnes ou de mauvaises réponses.",
  questions: SSTICS_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'patient',
    reference: 'Stip E., Caron J., Renaud S., Pampoulova T., and Lecomte Y. (2000). Subjective Scale to Investigate Cognition in Schizophrenia. Montréal.',
    scoringNote: 'Score total (0-84) → Z-score = (13.1 - total) / 6.2. Z-score négatif = plus de plaintes que la population de référence.',
    domains: SSTICS_DOMAINS,
    normative_data: SSTICS_NORMS,
    interpretation: {
      z_score: {
        positive: 'Moins de plaintes cognitives que la population de référence',
        negative: 'Plus de plaintes cognitives que la population de référence',
        threshold: 'Z < -1.5 peut indiquer une altération subjective significative'
      }
    }
  },
};
