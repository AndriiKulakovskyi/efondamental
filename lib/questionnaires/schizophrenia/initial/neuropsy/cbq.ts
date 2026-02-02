// ============================================================================
// eFondaMental Platform - CBQ (Cognitive Bias Questionnaire)
// Questionnaire de Biais Cognitifs - Peters et al., 2014 (French Version)
// Schizophrenia Initial Evaluation - Neuropsy Module
// Self-report questionnaire assessing five types of cognitive biases
// associated with psychosis through everyday life scenarios.
// ============================================================================

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaCbqResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // 30 item scores (1-3 each)
  q1: number | null;
  q2: number | null;
  q3: number | null;
  q4: number | null;
  q5: number | null;
  q6: number | null;
  q7: number | null;
  q8: number | null;
  q9: number | null;
  q10: number | null;
  q11: number | null;
  q12: number | null;
  q13: number | null;
  q14: number | null;
  q15: number | null;
  q16: number | null;
  q17: number | null;
  q18: number | null;
  q19: number | null;
  q20: number | null;
  q21: number | null;
  q22: number | null;
  q23: number | null;
  q24: number | null;
  q25: number | null;
  q26: number | null;
  q27: number | null;
  q28: number | null;
  q29: number | null;
  q30: number | null;
  
  // Subscale scores (5 bias categories)
  cbq_intentionalisation: number | null;
  cbq_catastrophisation: number | null;
  cbq_pensee_dichotomique: number | null;
  cbq_sauter_conclusions: number | null;
  cbq_raisonnement_emotionnel: number | null;
  
  // Thematic dimension scores
  cbq_evenement_menacant: number | null;   // Items 1-15
  cbq_perception_anormale: number | null;  // Items 16-30
  
  // Total score and Z-scores
  cbq_total: number | null;                // Range 30-90
  cbq_total_z: number | null;
  cbq_intentionalisation_z: number | null;
  cbq_catastrophisation_z: number | null;
  cbq_pensee_dichotomique_z: number | null;
  cbq_sauter_conclusions_z: number | null;
  cbq_raisonnement_emotionnel_z: number | null;
  
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaCbqResponseInsert = Omit<
  SchizophreniaCbqResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' |
  'cbq_intentionalisation' | 'cbq_catastrophisation' | 'cbq_pensee_dichotomique' |
  'cbq_sauter_conclusions' | 'cbq_raisonnement_emotionnel' |
  'cbq_evenement_menacant' | 'cbq_perception_anormale' |
  'cbq_total' | 'cbq_total_z' |
  'cbq_intentionalisation_z' | 'cbq_catastrophisation_z' | 'cbq_pensee_dichotomique_z' |
  'cbq_sauter_conclusions_z' | 'cbq_raisonnement_emotionnel_z'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Subscale Configuration
// ============================================================================

export const CBQ_SUBSCALES = {
  intentionalisation: {
    label: 'Intentionalisation',
    label_en: 'Intentionalizing',
    items: [1, 3, 11, 13, 16, 21],
    description: 'Tendance à attribuer des intentions malveillantes aux autres'
  },
  catastrophisation: {
    label: 'Catastrophisation',
    label_en: 'Catastrophizing',
    items: [2, 4, 12, 14, 22],
    description: 'Tendance à anticiper le pire scénario possible'
  },
  pensee_dichotomique: {
    label: 'Pensée dichotomique',
    label_en: 'Dichotomous thinking',
    items: [5, 8, 18, 23, 26, 28],
    description: 'Tendance à voir les choses en noir et blanc'
  },
  sauter_conclusions: {
    label: 'Sauter aux conclusions',
    label_en: 'Jumping to conclusions',
    items: [6, 10, 15, 20, 24, 30],
    description: 'Tendance à tirer des conclusions hâtives sans preuves suffisantes'
  },
  raisonnement_emotionnel: {
    label: 'Raisonnement basé sur les émotions',
    label_en: 'Emotional reasoning',
    items: [7, 9, 17, 19, 25, 27, 29],
    description: 'Tendance à confondre émotions et réalité'
  }
};

export const CBQ_THEMATIC_DIMENSIONS = {
  evenement_menacant: {
    label: 'Événement Menaçant',
    items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
  },
  perception_anormale: {
    label: 'Perception Anormale',
    items: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
  }
};

// ============================================================================
// Normative Data (Peters et al., 2014)
// ============================================================================

export const CBQ_NORMS = {
  total: {
    controles: { mean: 36.5, sd: 2.7 },
    psychose: { mean: 47.3, sd: 10.4 }
  },
  intentionalisation: {
    controles: { mean: 7.3, sd: 1.1 },
    psychose: { mean: 8.8, sd: 2.4 }
  },
  catastrophisation: {
    controles: { mean: 7.1, sd: 0.9 },
    psychose: { mean: 9.5, sd: 2.4 }
  },
  pensee_dichotomique: {
    controles: { mean: 6.5, sd: 0.7 },
    psychose: { mean: 8.8, sd: 2.6 }
  },
  sauter_conclusions: {
    controles: { mean: 8.5, sd: 1.3 },
    psychose: { mean: 10.7, sd: 2.5 }
  },
  raisonnement_emotionnel: {
    controles: { mean: 7.2, sd: 1.1 },
    psychose: { mean: 9.4, sd: 2.5 }
  },
  evenement_menacant: {
    controles: { mean: 19.0, sd: 1.7 },
    psychose: { mean: 24.6, sd: 6.0 }
  },
  perception_anormale: {
    controles: { mean: 17.5, sd: 1.6 },
    psychose: { mean: 22.7, sd: 5.1 }
  }
};

// Clinical threshold: Z > +1.65 indicates significant cognitive bias
export const CBQ_CLINICAL_THRESHOLD = 1.65;

// ============================================================================
// Scoring Functions
// ============================================================================

export interface CbqScoreResult {
  // Subscale scores
  cbq_intentionalisation: number;
  cbq_catastrophisation: number;
  cbq_pensee_dichotomique: number;
  cbq_sauter_conclusions: number;
  cbq_raisonnement_emotionnel: number;
  
  // Thematic dimension scores
  cbq_evenement_menacant: number;
  cbq_perception_anormale: number;
  
  // Total and Z-scores
  cbq_total: number;
  cbq_total_z: number;
  cbq_intentionalisation_z: number;
  cbq_catastrophisation_z: number;
  cbq_pensee_dichotomique_z: number;
  cbq_sauter_conclusions_z: number;
  cbq_raisonnement_emotionnel_z: number;
}

/**
 * Calculate Z-score using control group norms
 */
function calculateZScore(rawScore: number, mean: number, sd: number): number {
  return Number(((rawScore - mean) / sd).toFixed(2));
}

/**
 * Calculate all CBQ scores
 * @param responses Object containing q1-q30 values (1-3 each)
 * @returns Subscale scores, thematic scores, total, and Z-scores
 */
export function computeCbqScores(responses: Record<string, any>): CbqScoreResult {
  // Helper to safely get item value (default to 1 if missing, which is the minimum)
  const getItemValue = (itemNum: number): number => {
    const value = responses[`q${itemNum}`];
    return typeof value === 'number' ? value : 1;
  };
  
  // Calculate subscale scores
  const cbq_intentionalisation = CBQ_SUBSCALES.intentionalisation.items.reduce(
    (sum: number, item) => sum + getItemValue(item), 0
  );
  const cbq_catastrophisation = CBQ_SUBSCALES.catastrophisation.items.reduce(
    (sum: number, item) => sum + getItemValue(item), 0
  );
  const cbq_pensee_dichotomique = CBQ_SUBSCALES.pensee_dichotomique.items.reduce(
    (sum: number, item) => sum + getItemValue(item), 0
  );
  const cbq_sauter_conclusions = CBQ_SUBSCALES.sauter_conclusions.items.reduce(
    (sum: number, item) => sum + getItemValue(item), 0
  );
  const cbq_raisonnement_emotionnel = CBQ_SUBSCALES.raisonnement_emotionnel.items.reduce(
    (sum: number, item) => sum + getItemValue(item), 0
  );
  
  // Calculate thematic dimension scores
  const cbq_evenement_menacant = CBQ_THEMATIC_DIMENSIONS.evenement_menacant.items.reduce(
    (sum: number, item) => sum + getItemValue(item), 0
  );
  const cbq_perception_anormale = CBQ_THEMATIC_DIMENSIONS.perception_anormale.items.reduce(
    (sum: number, item) => sum + getItemValue(item), 0
  );
  
  // Calculate total score (sum of all 30 items, range 30-90)
  const cbq_total = cbq_evenement_menacant + cbq_perception_anormale;
  
  // Calculate Z-scores using control group norms
  const cbq_total_z = calculateZScore(cbq_total, CBQ_NORMS.total.controles.mean, CBQ_NORMS.total.controles.sd);
  const cbq_intentionalisation_z = calculateZScore(cbq_intentionalisation, CBQ_NORMS.intentionalisation.controles.mean, CBQ_NORMS.intentionalisation.controles.sd);
  const cbq_catastrophisation_z = calculateZScore(cbq_catastrophisation, CBQ_NORMS.catastrophisation.controles.mean, CBQ_NORMS.catastrophisation.controles.sd);
  const cbq_pensee_dichotomique_z = calculateZScore(cbq_pensee_dichotomique, CBQ_NORMS.pensee_dichotomique.controles.mean, CBQ_NORMS.pensee_dichotomique.controles.sd);
  const cbq_sauter_conclusions_z = calculateZScore(cbq_sauter_conclusions, CBQ_NORMS.sauter_conclusions.controles.mean, CBQ_NORMS.sauter_conclusions.controles.sd);
  const cbq_raisonnement_emotionnel_z = calculateZScore(cbq_raisonnement_emotionnel, CBQ_NORMS.raisonnement_emotionnel.controles.mean, CBQ_NORMS.raisonnement_emotionnel.controles.sd);
  
  return {
    cbq_intentionalisation,
    cbq_catastrophisation,
    cbq_pensee_dichotomique,
    cbq_sauter_conclusions,
    cbq_raisonnement_emotionnel,
    cbq_evenement_menacant,
    cbq_perception_anormale,
    cbq_total,
    cbq_total_z,
    cbq_intentionalisation_z,
    cbq_catastrophisation_z,
    cbq_pensee_dichotomique_z,
    cbq_sauter_conclusions_z,
    cbq_raisonnement_emotionnel_z
  };
}

/**
 * Interpret CBQ total Z-score
 * @param zScore The computed Z-score
 * @returns Interpretation string
 */
export function interpretCbqZScore(zScore: number): string {
  if (zScore > CBQ_CLINICAL_THRESHOLD) {
    return 'Biais cognitifs cliniquement significatifs (Z > 1.65)';
  } else if (zScore > 1.0) {
    return 'Biais cognitifs modérément élevés';
  } else if (zScore > 0.5) {
    return 'Biais cognitifs légèrement élevés';
  } else if (zScore >= -0.5) {
    return 'Biais cognitifs dans la normale';
  } else {
    return 'Biais cognitifs inférieurs à la moyenne';
  }
}

/**
 * Check if a subscale Z-score exceeds the clinical threshold
 */
export function isSubscaleClinicallySignificant(zScore: number): boolean {
  return zScore > CBQ_CLINICAL_THRESHOLD;
}

// ============================================================================
// Question Definitions
// ============================================================================

const CBQ_ITEMS = [
  // Theme 1: Événement Menaçant (Items 1-15)
  {
    id: 'q1',
    item_number: 1,
    section: 'Thème 1: Événement Menaçant',
    bias: 'intentionalisation',
    text: "Imaginez que vous recevez une lettre et vous remarquez qu'elle n'est pas scellée.",
    options: [
      { code: 3, label: 'A: Quelqu\'un a volontairement déjà ouvert cette lettre' },
      { code: 2, label: 'B: Je me demande si elle a été ouverte de nouveau après avoir été écrite' },
      { code: 1, label: 'C: Je n\'en pense rien' }
    ]
  },
  {
    id: 'q2',
    item_number: 2,
    section: 'Thème 1: Événement Menaçant',
    bias: 'catastrophisation',
    text: "Imaginez que vous marchez dans la rue et vous entendez votre nom, mais lorsque vous regardez autour de vous, vous ne voyez personne.",
    options: [
      { code: 2, label: 'A: Il se passe quelque chose d\'étrange' },
      { code: 3, label: 'B: Il y a quelque chose de vraiment dangereux à propos de cela' },
      { code: 1, label: 'C: Je dois imaginer des choses' }
    ]
  },
  {
    id: 'q3',
    item_number: 3,
    section: 'Thème 1: Événement Menaçant',
    bias: 'intentionalisation',
    text: "Imaginez que votre nourriture à un goût différent qu'à l'habitude.",
    options: [
      { code: 2, label: 'A: Quelqu\'un doit avoir fait quelque chose à ma nourriture intentionnellement' },
      { code: 1, label: 'B: Cette nourriture doit avoir été préparée avec un ingrédient différent aujourd\'hui' },
      { code: 3, label: 'C: Quelqu\'un a volontairement versé quelque chose dans ma nourriture' }
    ]
  },
  {
    id: 'q4',
    item_number: 4,
    section: 'Thème 1: Événement Menaçant',
    bias: 'catastrophisation',
    text: "Imaginez que vous êtes sur le chemin du travail et vous remarquez que toutes les lumières de circulation (les feux) sont au rouge.",
    options: [
      { code: 1, label: 'A: Cela me prendra plus de temps pour arriver ce matin' },
      { code: 2, label: 'B: C\'est tout ce que j\'avais besoin, je vais être vraiment en retard maintenant' },
      { code: 3, label: 'C: Ma journée sera gâchée' }
    ]
  },
  {
    id: 'q5',
    item_number: 5,
    section: 'Thème 1: Événement Menaçant',
    bias: 'pensee_dichotomique',
    text: "Imaginez que vous attendez à l'arrêt d'autobus lorsque le bus que vous attendiez est à moitié vide et ne s'arrête pas.",
    options: [
      { code: 3, label: 'A: Les gens sont toujours si méchants' },
      { code: 2, label: 'B: Les gens ne sont pas très gentils parfois' },
      { code: 1, label: 'C: Le conducteur doit être de mauvaise humeur aujourd\'hui' }
    ]
  },
  {
    id: 'q6',
    item_number: 6,
    section: 'Thème 1: Événement Menaçant',
    bias: 'sauter_conclusions',
    text: "Imaginez que vous avez une très grosse douleur à la tête.",
    options: [
      { code: 2, label: 'A: Il doit avoir quelque chose qui ne va pas chez moi' },
      { code: 1, label: 'B: Il y a plusieurs raisons différentes pour lesquelles je pourrais avoir cette douleur' },
      { code: 3, label: 'C: Je dois avoir quelque chose de très sérieux, comme une tumeur' }
    ]
  },
  {
    id: 'q7',
    item_number: 7,
    section: 'Thème 1: Événement Menaçant',
    bias: 'raisonnement_emotionnel',
    text: "Imaginez que pendant que vous êtes dans l'autobus, vous remarquez qu'un étranger vous fixe.",
    options: [
      { code: 2, label: 'A: La façon dont cette personne me fixe est un peu inhabituelle' },
      { code: 3, label: 'B: Cette personne doit me vouloir du mal pour me fixer de cette façon' },
      { code: 1, label: 'C: Cette personne est vraiment impolie de me fixer de cette façon' }
    ]
  },
  {
    id: 'q8',
    item_number: 8,
    section: 'Thème 1: Événement Menaçant',
    bias: 'pensee_dichotomique',
    text: "Imaginez que vous êtes assis à la maison et que vous vous sentez soudainement très bizarre.",
    options: [
      { code: 2, label: 'A: Je me demande pourquoi je me sens bizarre, il y a quelque chose de louche' },
      { code: 3, label: 'B: Ce sentiment est la preuve que quelque part, il y a quelque chose de terrible' },
      { code: 1, label: 'C: Je dois être très fatigué ou quelque chose comme ça' }
    ]
  },
  {
    id: 'q9',
    item_number: 9,
    section: 'Thème 1: Événement Menaçant',
    bias: 'raisonnement_emotionnel',
    text: "Imaginez que vous avez postulé pour un travail et que vous ne l'avez pas obtenu.",
    options: [
      { code: 1, label: 'A: Peut-être que je peux avoir un retour à propos de mon entretien' },
      { code: 2, label: 'B: Je me demande si je n\'ai pas très bien fait à l\'entretien' },
      { code: 3, label: 'C: Je ne serai jamais capable d\'avoir un travail' }
    ]
  },
  {
    id: 'q10',
    item_number: 10,
    section: 'Thème 1: Événement Menaçant',
    bias: 'sauter_conclusions',
    text: "Imaginez que vous êtes dans un train et vous avez soudainement une forte impression que vous avez déjà vécu cette situation exacte auparavant.",
    options: [
      { code: 2, label: 'A: C\'est un signe que quelque chose d\'important va arriver' },
      { code: 3, label: 'B: C\'est une preuve que quelque chose de terrible va m\'arriver' },
      { code: 1, label: 'C: C\'est étrange, mais c\'est une expérience commune' }
    ]
  },
  {
    id: 'q11',
    item_number: 11,
    section: 'Thème 1: Événement Menaçant',
    bias: 'intentionalisation',
    text: "Imaginez que quelqu'un que vous appréciez ou un ami rejette votre invitation pour une sortie.",
    options: [
      { code: 2, label: 'A: Je me fais assez souvent rejeter dans cette situation' },
      { code: 1, label: 'B: Parfois on gagne, parfois on perd' },
      { code: 3, label: 'C: Je me fais toujours rejeter pour tout ce que j\'essaie de faire' }
    ]
  },
  {
    id: 'q12',
    item_number: 12,
    section: 'Thème 1: Événement Menaçant',
    bias: 'catastrophisation',
    text: "Imaginez qu'un jour vous entrez dans une boutique et que vous entendez des gens rire.",
    options: [
      { code: 3, label: 'A: Ils doivent rire de moi' },
      { code: 2, label: 'B: Je me demande s\'ils rient de moi' },
      { code: 1, label: 'C: Leurs rires n\'ont probablement rien à voir avec moi' }
    ]
  },
  {
    id: 'q13',
    item_number: 13,
    section: 'Thème 1: Événement Menaçant',
    bias: 'intentionalisation',
    text: "Imaginez qu'il y a des voitures de police devant votre maison. Vous réalisez soudainement que vous vous sentez inconfortable.",
    options: [
      { code: 1, label: 'A: C\'est amusant l\'effet que cela a sur les gens de se sentir coupables lorsqu\'ils voient la police' },
      { code: 2, label: 'B: Je me demande pourquoi je me sens si inconfortable, je dois avoir quelque chose à me reprocher' },
      { code: 3, label: 'C: Je dois avoir fait quelque chose de mal pour me sentir si inconfortable' }
    ]
  },
  {
    id: 'q14',
    item_number: 14,
    section: 'Thème 1: Événement Menaçant',
    bias: 'catastrophisation',
    text: "Imaginez que vous regardez la télévision et l'écran devient soudainement noir.",
    options: [
      { code: 3, label: 'A: Des choses étranges arrivent toujours' },
      { code: 2, label: 'B: Ce genre de chose semble arriver souvent' },
      { code: 1, label: 'C: Il doit y avoir un problème avec la télévision aujourd\'hui' }
    ]
  },
  {
    id: 'q15',
    item_number: 15,
    section: 'Thème 1: Événement Menaçant',
    bias: 'sauter_conclusions',
    text: "Imaginez que deux personnes en file d'attente au supermarché regardent dans votre direction en même temps.",
    options: [
      { code: 2, label: 'A: Ce n\'est pas la première fois que cela arrive, il doit y avoir quelque chose sur moi' },
      { code: 1, label: 'B: C\'est étrange qu\'ils regardent tous les deux en même temps' },
      { code: 3, label: 'C: Cela arrive toujours, partout où je vais' }
    ]
  },
  // Theme 2: Perception Anormale (Items 16-30)
  {
    id: 'q16',
    item_number: 16,
    section: 'Thème 2: Perception Anormale',
    bias: 'intentionalisation',
    text: "Imaginez que vous attendez dans un café pour qu'une connaissance arrive et vous sentez soudainement un frisson.",
    options: [
      { code: 3, label: 'A: Ressentir un frisson est un mauvais présage, je crois qu\'il va se passer quelque chose' },
      { code: 2, label: 'B: Je doit être nerveux à l\'idée de rencontrer cette personne' },
      { code: 1, label: 'C: Il y a probablement un courant d\'air dans le café' }
    ]
  },
  {
    id: 'q17',
    item_number: 17,
    section: 'Thème 2: Perception Anormale',
    bias: 'raisonnement_emotionnel',
    text: "Imaginez que vous pensez voir une ombre bouger à travers le mur d'une chambre vide.",
    options: [
      { code: 2, label: 'A: Je me demande ce que c\'était' },
      { code: 1, label: 'B: Mes yeux doivent me jouer des tours' },
      { code: 3, label: 'C: Il doit y avoir eu quelqu\'un ou quelque chose à cet endroit' }
    ]
  },
  {
    id: 'q18',
    item_number: 18,
    section: 'Thème 2: Perception Anormale',
    bias: 'pensee_dichotomique',
    text: "Imaginez que le téléphone sonne. Lorsque vous répondez, l'autre personne raccroche.",
    options: [
      { code: 2, label: 'A: Je me demande s\'il y a quelque chose de suspect' },
      { code: 3, label: 'B: Quelqu\'un me surveille définitivement' },
      { code: 1, label: 'C: Quelqu\'un a probablement fait un mauvais numéro' }
    ]
  },
  {
    id: 'q19',
    item_number: 19,
    section: 'Thème 2: Perception Anormale',
    bias: 'raisonnement_emotionnel',
    text: "Imaginez que vous regardez les nouvelles à la télévision à propos d'un récent désastre et vous vous sentez coupable.",
    options: [
      { code: 3, label: 'A: Si je me sens coupable, je dois être responsable de ce désastre' },
      { code: 1, label: 'B: C\'est normal de se sentir coupable lorsqu\'un désastre se produit' },
      { code: 2, label: 'C: Je me demande pourquoi je me sens coupable, peut-être est-ce lié à ce désastre' }
    ]
  },
  {
    id: 'q20',
    item_number: 20,
    section: 'Thème 2: Perception Anormale',
    bias: 'sauter_conclusions',
    text: "Imaginez que vous écoutez la radio et qu'il y a soudainement de l'interférence (grésillement).",
    options: [
      { code: 3, label: 'A: Quelqu\'un a volontairement trafiqué ma radio alors que je l\'écoutais' },
      { code: 2, label: 'B: Je me demande si quelqu\'un a manipulé ma radio' },
      { code: 1, label: 'C: Il y a de l\'interférence dans les ondes radio' }
    ]
  },
  {
    id: 'q21',
    item_number: 21,
    section: 'Thème 2: Perception Anormale',
    bias: 'intentionalisation',
    text: "Imaginez que vous êtes assis dans un train et vous pensez entendre deux personnes assises derrière vous parler de vous.",
    options: [
      { code: 2, label: 'A: Je me demande s\'ils parlent de moi' },
      { code: 3, label: 'B: Je suis certain que je les ai entendues parler à propos de moi' },
      { code: 1, label: 'C: Je devrais me renseigner à savoir si quelqu\'un d\'autre les a entendues' }
    ]
  },
  {
    id: 'q22',
    item_number: 22,
    section: 'Thème 2: Perception Anormale',
    bias: 'catastrophisation',
    text: "Imaginez que vous êtes à la maison; tout est calme lorsque vous entendez des coups soudains et rapides sur le mur des voisins.",
    options: [
      { code: 3, label: 'A: Les voisins font volontairement cela pour m\'énerver' },
      { code: 1, label: 'B: Les voisins font peut-être des rénovations' },
      { code: 2, label: 'C: Les voisins doivent essayer de me dire quelque chose avec ces bruits' }
    ]
  },
  {
    id: 'q23',
    item_number: 23,
    section: 'Thème 2: Perception Anormale',
    bias: 'pensee_dichotomique',
    text: "Imaginez que vous lisez un journal ou un magazine et que vous lisez un article qui a un rapport spécifique avec votre propre vie.",
    options: [
      { code: 2, label: 'A: Cet article semble avoir été écrit avec des gens comme moi en tête' },
      { code: 1, label: 'B: Je me demande si quelqu\'un a écrit cet article pour m\'envoyer un message' },
      { code: 3, label: 'C: Quelqu\'un a définitivement écrit cet article spécifiquement pour moi' }
    ]
  },
  {
    id: 'q24',
    item_number: 24,
    section: 'Thème 2: Perception Anormale',
    bias: 'sauter_conclusions',
    text: "Imaginez que vous remarquez qu'une personne que vous ne connaissez pas vous regarde. Vous vous sentez très inconfortable.",
    options: [
      { code: 3, label: 'A: Se sentir aussi inconfortable signifie que cette personne est une menace pour moi' },
      { code: 2, label: 'B: Je me demande si se sentir aussi inconfortable peut être lié à la façon dont cette personne me regarde' },
      { code: 1, label: 'C: Se faire regarder peut rendre les gens inconfortables parfois' }
    ]
  },
  {
    id: 'q25',
    item_number: 25,
    section: 'Thème 2: Perception Anormale',
    bias: 'raisonnement_emotionnel',
    text: "Imaginez qu'un soir, vous êtes assis seul à la maison lorsque vous entendez une porte claquer dans une autre pièce.",
    options: [
      { code: 3, label: 'A: Quelqu\'un ou quelque chose doit être entré dans la maison' },
      { code: 2, label: 'B: Je me demande s\'il y a quelqu\'un ou quelque chose dans la maison' },
      { code: 1, label: 'C: Le vent doit avoir fait claquer la porte' }
    ]
  },
  {
    id: 'q26',
    item_number: 26,
    section: 'Thème 2: Perception Anormale',
    bias: 'pensee_dichotomique',
    text: "Imaginez que quelqu'un que vous connaissez vous téléphone juste au moment où vous pensiez à cette personne. Vous vous sentez inquiet.",
    options: [
      { code: 1, label: 'A: C\'est étrange que je me sente inquiet, mais je n\'y attache pas d\'importance' },
      { code: 2, label: 'B: Je me demande pourquoi je me sens inquiet, peut-être y a-t-il une raison' },
      { code: 3, label: 'C: Se sentir inquiet signifie quelque chose, ça doit être une coïncidence suspecte' }
    ]
  },
  {
    id: 'q27',
    item_number: 27,
    section: 'Thème 2: Perception Anormale',
    bias: 'raisonnement_emotionnel',
    text: "Imaginez que vous marchez dans la rue lorsque soudainement, vous remarquez une offre d'emploi qui se détache du reste de l'environnement.",
    options: [
      { code: 1, label: 'A: Je me demande pourquoi mes yeux semblent attirés par cette affiche' },
      { code: 2, label: 'B: Peut-être que je la remarque parce que ma carrière n\'est pas vraiment un succès' },
      { code: 3, label: 'C: C\'est un signe que ma vie est vraiment un échec' }
    ]
  },
  {
    id: 'q28',
    item_number: 28,
    section: 'Thème 2: Perception Anormale',
    bias: 'pensee_dichotomique',
    text: "Imaginez que vous êtes dans un autobus; le conducteur n'arrête pas de freiner brusquement, alors vous perdez presque l'équilibre à chaque fois.",
    options: [
      { code: 2, label: 'A: Je me demande s\'il fait cela dans le but d\'énerver les gens' },
      { code: 1, label: 'B: Le conducteur d\'autobus ne sait pas conduire correctement' },
      { code: 3, label: 'C: Il fait cela dans le but de m\'humilier' }
    ]
  },
  {
    id: 'q29',
    item_number: 29,
    section: 'Thème 2: Perception Anormale',
    bias: 'raisonnement_emotionnel',
    text: "Imaginez que vous entendez qu'un ami fait une fête et vous n'avez pas été invité.",
    options: [
      { code: 2, label: 'A: Je me demande s\'ils ne m\'aiment peut-être pas autant que je pensais qu\'ils m\'aimaient' },
      { code: 1, label: 'B: Je devrais peut-être essayer de me renseigner un peu plus sur la situation avant de faire des suppositions' },
      { code: 3, label: 'C: C\'est évident, ils ne m\'aiment pas' }
    ]
  },
  {
    id: 'q30',
    item_number: 30,
    section: 'Thème 2: Perception Anormale',
    bias: 'sauter_conclusions',
    text: "Imaginez que vous somnolez sur le divan devant la télévision et que soudainement, vous vous réveillez en sursaut.",
    options: [
      { code: 1, label: 'A: J\'ai tendance à me réveiller en sursaut lorsque je somnole' },
      { code: 2, label: 'B: La télévision doit m\'avoir réveillé' },
      { code: 3, label: 'C: Je ne peux jamais avoir un peu de sommeil tranquille' }
    ]
  }
];

// ============================================================================
// Questions Array for Renderer
// ============================================================================

export const CBQ_SZ_QUESTIONS: Question[] = [
  // Instructions
  {
    id: 'instructions_header',
    section: 'Instructions',
    text: "Dans ce questionnaire, vous trouverez des descriptions d'événements de tous les jours. Après chaque situation, il y a plusieurs façons dont les gens pourraient réagir, indiquées par un A, un B ou un C. Imaginez-vous dans chaque situation le plus vivement possible. Choisissez l'option qui décrit le mieux ce que vous pourriez penser. Il n'y a pas de bonnes ou de mauvaises réponses. Répondez à chaque question assez rapidement.",
    type: 'instruction',
    required: false,
  },
  
  // Generate all 30 item questions
  ...CBQ_ITEMS.map((item) => ({
    id: item.id,
    section: item.section,
    text: `${item.item_number}. ${item.text}`,
    type: 'single_choice' as const,
    required: true,
    options: item.options.map(opt => ({
      code: opt.code,
      label: opt.label,
      score: opt.code
    })),
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

export const CBQ_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'cbq_sz',
  code: 'CBQ_SZ',
  title: 'CBQ - Questionnaire de Biais Cognitifs',
  description: 'Auto-questionnaire évaluant cinq types de biais cognitifs associés à la psychose à travers des scénarios de la vie quotidienne : intentionalisation, catastrophisation, pensée dichotomique, sauter aux conclusions, et raisonnement basé sur les émotions.',
  instructions: "Dans ce questionnaire, vous trouverez des descriptions d'événements de tous les jours. Imaginez-vous dans chaque situation le plus vivement possible. Choisissez l'option qui décrit le mieux ce que vous pourriez penser. Il n'y a pas de bonnes ou de mauvaises réponses.",
  questions: CBQ_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'patient',
    reference: 'Peters E., Moritz S., Schwannauer M., et al. (2014). Cognitive Biases Questionnaire for psychosis. Schizophrenia Bulletin, 40(2), 300-313. Version française: Lecomte et al.',
    scoringNote: 'Score total (30-90) → Z-score = (score - 36.5) / 2.7. Z > 1.65 indique des biais cognitifs cliniquement significatifs.',
    subscales: CBQ_SUBSCALES,
    thematic_dimensions: CBQ_THEMATIC_DIMENSIONS,
    normative_data: CBQ_NORMS,
    clinical_threshold: CBQ_CLINICAL_THRESHOLD
  },
};
