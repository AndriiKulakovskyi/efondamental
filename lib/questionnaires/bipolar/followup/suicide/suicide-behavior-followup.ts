// eFondaMental Platform - Suicide Behavior Followup
// (Histoire des conduites suicidaires - Suivi semestriel)
// Bipolar Followup Evaluation - Suicide Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarFollowupSuicideBehaviorResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q0_ts_since_last_visit: string | null;
  q0_attempt_count: string | null;
  q0_violent_attempts: string | null;
  q0_violent_count: string | null;
  q0_serious_attempts: string | null;
  q0_serious_count: string | null;
  q1_self_harm: number | null;
  q2_interrupted: number | null;
  q2_1_interrupted_count: number | null;
  q3_aborted: number | null;
  q3_1_aborted_count: number | null;
  q4_preparations: number | null;
  q5_recent_severity: number | null;
  q5_recent_date: string | null;
  q6_lethal_severity: number | null;
  q6_lethal_date: string | null;
  q7_potential_lethality: number | null;
  risk_score: number | null;
  risk_level: string | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarFollowupSuicideBehaviorResponseInsert = Omit<
  BipolarFollowupSuicideBehaviorResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'risk_score' | 'risk_level' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

const COUNT_OPTIONS_0_20 = [
  { code: '0', label: '0', score: 0 },
  { code: '1', label: '1', score: 1 },
  { code: '2', label: '2', score: 2 },
  { code: '3', label: '3', score: 3 },
  { code: '4', label: '4', score: 4 },
  { code: '5', label: '5', score: 5 },
  { code: '6', label: '6', score: 6 },
  { code: '7', label: '7', score: 7 },
  { code: '8', label: '8', score: 8 },
  { code: '9', label: '9', score: 9 },
  { code: '10', label: '10', score: 10 },
  { code: '11', label: '11', score: 11 },
  { code: '12', label: '12', score: 12 },
  { code: '13', label: '13', score: 13 },
  { code: '14', label: '14', score: 14 },
  { code: '15', label: '15', score: 15 },
  { code: '16', label: '16', score: 16 },
  { code: '17', label: '17', score: 17 },
  { code: '18', label: '18', score: 18 },
  { code: '19', label: '19', score: 19 },
  { code: '20', label: '20', score: 20 },
  { code: '>20', label: '>20', score: 21 }
];

const DISPLAY_IF_TS = { '==': [{ var: 'q0_ts_since_last_visit' }, 'Oui'] };

export const SUICIDE_BEHAVIOR_FOLLOWUP_QUESTIONS: Question[] = [
  {
    id: 'q0_ts_since_last_visit',
    text: 'Le patient a-t-il tenté de se suicider depuis la dernière visite ? (Réponse récupérée automatiquement depuis l\'ISA suivi Q5)',
    type: 'single_choice',
    required: false,
    readonly: true,
    options: [
      { code: 'Oui', label: 'Oui', score: 1 },
      { code: 'Non', label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q0_attempt_count',
    text: 'Combien de fois avez-vous tenté de vous suicider depuis la dernière visite ?',
    type: 'single_choice',
    required: false,
    display_if: DISPLAY_IF_TS,
    options: COUNT_OPTIONS_0_20
  },
  {
    id: 'q0_violent_attempts',
    text: 'Existe-t-il des TS violentes (arme à feu, immolation, noyade, saut, pendaison, autre) ?',
    type: 'single_choice',
    required: false,
    display_if: DISPLAY_IF_TS,
    options: [
      { code: 'yes', label: 'Oui', score: 1 },
      { code: 'no', label: 'Non', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q0_violent_count',
    text: 'Nombre de tentatives de suicide violentes depuis la dernière visite',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [DISPLAY_IF_TS, { '==': [{ var: 'q0_violent_attempts' }, 'yes'] }] },
    options: COUNT_OPTIONS_0_20
  },
  {
    id: 'q0_serious_attempts',
    text: 'Existe-t-il des tentatives de suicide graves (passage en réanimation) non violentes (médicamenteuses, phlébotomie) ?',
    type: 'single_choice',
    required: false,
    display_if: DISPLAY_IF_TS,
    options: [
      { code: 'yes', label: 'Oui', score: 1 },
      { code: 'no', label: 'Non', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q0_serious_count',
    text: 'Nombre de tentatives de suicide graves depuis la dernière visite',
    type: 'single_choice',
    required: false,
    indentLevel: 1,
    display_if: { 'and': [DISPLAY_IF_TS, { '==': [{ var: 'q0_serious_attempts' }, 'yes'] }] },
    options: COUNT_OPTIONS_0_20
  },
  {
    id: 'q1_self_harm',
    text: 'Le sujet a-t-il eu un comportement auto-agressif non suicidaire ?',
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q2_interrupted',
    text: `Tentative interrompue : Interruption (par des facteurs exterieurs) de la mise en oeuvre par la personne d'un acte potentiellement auto-agressif (sinon, une tentative averee aurait eu lieu). Surdosage : la personne a des comprimes dans la main, mais quelqu'un l'empeche de les avaler. Si elle ingere un ou plusieurs comprimes, il s'agit d'une tentative averee plutot que d'une tentative interrompue. Arme a feu : la personne pointe une arme vers elle, mais l'arme lui est reprise par quelqu'un ou quelque chose l'empeche d'appuyer sur la gachette. Si elle appuie sur la gachette et meme si le coup ne part pas, il s'agit d'une tentative averee. Saut dans le vide : la personne s'apprete a sauter, mais quelqu'un la retient et l'eloigne du bord. Pendaison : la personne a une corde autour du cou mais ne s'est pas encore pendue car quelqu'un l'en empeche.

**Vous est-il arrive de commencer a faire quelque chose pour tenter de mettre fin a vos jours, mais d'en etre empeche(e) par quelqu'un ou quelque chose avant de veritablement passer a l'acte ?**`,
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q2_1_interrupted_count',
    text: 'Nombre total de tentatives interrompues',
    type: 'number',
    required: false,
    min: 0,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q2_interrupted' }, 1] }
  },
  {
    id: 'q3_aborted',
    text: `Tentative avortee : La personne se prepare a se suicider, mais s'interrompt d'elle-meme avant d'avoir reellement eu un comportement autodestructeur. Les exemples sont similaires a ceux illustrant une tentative interrompue, si ce n'est qu'ici la personne interrompt d'elle-meme sa tentative au lieu d'etre interrompue par un facteur exterieur.

**Vous est-il arrive de commencer a faire quelque chose pour tenter de mettre fin a vos jours, mais de vous arreter de vous-meme avant de veritablement passer a l'acte ?**`,
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q3_1_aborted_count',
    text: 'Nombre total de tentatives avortees',
    type: 'number',
    required: false,
    min: 0,
    indentLevel: 1,
    display_if: { '==': [{ var: 'q3_aborted' }, 1] }
  },
  {
    id: 'q4_preparations',
    text: `Preparatifs : Actes ou preparatifs en vue d'une tentative de suicide imminente. Il peut s'agir de tout ce qui depasse le stade de la verbalisation ou de la pensee, comme l'elaboration d'une methode specifique (par ex. se procurer des comprimes ou une arme a feu) ou la prise de dispositions en vue de son suicide (par ex. dons d'objets, redaction d'une lettre d'adieu).

**Avez-vous pris certaines mesures pour faire une tentative de suicide ou pour preparer votre suicide (par ex. rassembler des comprimes, vous procurer une arme a feu, donner vos objets de valeur ou ecrire une lettre d'adieu) ?**`,
    type: 'single_choice',
    required: false,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  // Létalité / lésions médicales observées
  {
    id: 'section_lethality',
    text: 'Létalité / lésions médicales observées',
    type: 'section',
    required: false
  },
  {
    id: 'q5_recent_severity',
    text: 'Tentative la plus récente',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Aucune atteinte physique ou atteinte physique très légère (par ex. égratignures)', score: 0 },
      { code: 1, label: '1 - Atteinte physique légère (par ex. élocution ralentie, brûlures au premier degré, légers saignements, entorses)', score: 1 },
      { code: 2, label: '2 - Atteinte physique modérée nécessitant une prise en charge médicale (par ex. personne consciente mais somnolente, altération de la réactivité, brûlures au deuxième degré, saignement d\'un vaisseau important)', score: 2 },
      { code: 3, label: '3 - Atteinte physique grave, hospitalisation nécessaire et soins intensifs probablement nécessaires (par ex. état comateux avec réflexes intacts, brûlures au troisième degré sur moins de 20 % de la surface corporelle, hémorragie importante mais sans risque vital, fractures importantes)', score: 3 },
      { code: 4, label: '4 - Atteinte physique très grave, hospitalisation et soins intensifs nécessaires (par ex. état comateux avec absence de réflexes, brûlures au troisième degré sur plus de 20 % de la surface corporelle, hémorragie importante associée à une instabilité des signes vitaux, atteinte majeure d\'un organe vital)', score: 4 },
      { code: 5, label: '5 - Décès', score: 5 }
    ]
  },
  {
    id: 'q5_recent_date',
    text: 'Date de la tentative la plus récente',
    type: 'date',
    required: false
  },
  {
    id: 'q6_lethal_severity',
    text: 'Tentative la plus létale',
    type: 'single_choice',
    required: false,
    options: [
      { code: 0, label: '0 - Aucune atteinte physique ou atteinte physique très légère (par ex. égratignures)', score: 0 },
      { code: 1, label: '1 - Atteinte physique légère (par ex. élocution ralentie, brûlures au premier degré, légers saignements, entorses)', score: 1 },
      { code: 2, label: '2 - Atteinte physique modérée nécessitant une prise en charge médicale (par ex. personne consciente mais somnolente, altération de la réactivité, brûlures au deuxième degré, saignement d\'un vaisseau important)', score: 2 },
      { code: 3, label: '3 - Atteinte physique grave, hospitalisation nécessaire et soins intensifs probablement nécessaires (par ex. état comateux avec réflexes intacts, brûlures au troisième degré sur moins de 20 % de la surface corporelle, hémorragie importante mais sans risque vital, fractures importantes)', score: 3 },
      { code: 4, label: '4 - Atteinte physique très grave, hospitalisation et soins intensifs nécessaires (par ex. état comateux avec absence de réflexes, brûlures au troisième degré sur plus de 20 % de la surface corporelle, hémorragie importante associée à une instabilité des signes vitaux, atteinte majeure d\'un organe vital)', score: 4 },
      { code: 5, label: '5 - Décès', score: 5 }
    ]
  },
  {
    id: 'q6_lethal_date',
    text: 'Date de la tentative la plus létale',
    type: 'date',
    required: false
  },
  {
    id: 'q7_potential_lethality',
    text: 'Létalité potentielle : ne répondre que si la létalité observée = 0\n\nLétalité probable d\'une tentative avérée en l\'absence de lésions médicales (exemples de tentatives n\'ayant entraîné aucune lésion médicale, mais pouvant potentiellement présenter un degré très élevé de létalité : la personne place le canon d\'une arme à feu dans sa bouche, appuie sur la gâchette, mais le coup ne part pas et aucune lésion médicale n\'est engendrée ; la personne s\'allonge sur les rails à l\'approche d\'un train mais est relevée par quelqu\'un avant d\'être écrasée).',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'q5_recent_severity' }, 0] },
    options: [
      { code: 0, label: '0 - Comportement peu enclin à engendrer des blessures', score: 0 },
      { code: 1, label: '1 - Comportement susceptible d\'engendrer des blessures mais ne pouvant causer la mort', score: 1 },
      { code: 2, label: '2 - Comportement susceptible de causer la mort malgré des soins médicaux disponibles', score: 2 }
    ]
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const SUICIDE_BEHAVIOR_FOLLOWUP_DEFINITION = {
  id: 'suicide_behavior_followup',
  code: 'SUICIDE_BEHAVIOR_FOLLOWUP',
  title: 'Histoire des conduites suicidaires (Suivi)',
  description: 'Evaluation des comportements suicidaires pour le suivi semestriel : comportements auto-agressifs, tentatives interrompues, avortees et preparatifs.',
  questions: SUICIDE_BEHAVIOR_FOLLOWUP_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Risk Score Computation
// ============================================================================

export interface SuicideBehaviorFollowupScoreInput {
  q1_self_harm: number | null;
  q2_interrupted: number | null;
  q3_aborted: number | null;
  q4_preparations: number | null;
}

export function computeSuicideBehaviorRiskScore(responses: SuicideBehaviorFollowupScoreInput): number {
  const q1 = responses.q1_self_harm ?? 0;
  const q2 = responses.q2_interrupted ?? 0;
  const q3 = responses.q3_aborted ?? 0;
  const q4 = responses.q4_preparations ?? 0;
  return q1 + q2 + q3 + q4;
}

// ============================================================================
// Risk Level Interpretation
// ============================================================================

export type SuicideBehaviorRiskLevel = 'none' | 'low' | 'moderate' | 'high';

export function getSuicideBehaviorRiskLevel(score: number): SuicideBehaviorRiskLevel {
  if (score === 0) return 'none';
  if (score === 1) return 'low';
  if (score <= 2) return 'moderate';
  return 'high';
}

export function getSuicideBehaviorRiskLevelLabel(riskLevel: SuicideBehaviorRiskLevel): string {
  switch (riskLevel) {
    case 'none':
      return 'Aucun comportement suicidaire';
    case 'low':
      return 'Risque faible';
    case 'moderate':
      return 'Risque modere';
    case 'high':
      return 'Risque eleve';
  }
}

// ============================================================================
// Behavior Analysis
// ============================================================================

export interface SuicideBehaviorFollowupCountInput {
  q2_1_interrupted_count: number | null;
  q3_1_aborted_count: number | null;
}

export function getTotalAttemptCount(counts: SuicideBehaviorFollowupCountInput): number {
  const interrupted = counts.q2_1_interrupted_count ?? 0;
  const aborted = counts.q3_1_aborted_count ?? 0;
  return interrupted + aborted;
}

export function interpretSuicideBehaviorFollowup(
  responses: SuicideBehaviorFollowupScoreInput & SuicideBehaviorFollowupCountInput
): string {
  const score = computeSuicideBehaviorRiskScore(responses);
  const riskLevel = getSuicideBehaviorRiskLevel(score);
  const riskLabel = getSuicideBehaviorRiskLevelLabel(riskLevel);
  
  if (score === 0) {
    return 'Aucun comportement suicidaire signale depuis la derniere visite.';
  }
  
  const behaviors: string[] = [];
  
  if (responses.q1_self_harm === 1) {
    behaviors.push('comportement auto-agressif');
  }
  if (responses.q2_interrupted === 1) {
    const count = responses.q2_1_interrupted_count ?? 1;
    behaviors.push(`${count} tentative(s) interrompue(s)`);
  }
  if (responses.q3_aborted === 1) {
    const count = responses.q3_1_aborted_count ?? 1;
    behaviors.push(`${count} tentative(s) avortee(s)`);
  }
  if (responses.q4_preparations === 1) {
    behaviors.push('preparatifs suicidaires');
  }
  
  return `${riskLabel}. Comportements signales: ${behaviors.join(', ')}.`;
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface SuicideBehaviorFollowupScoringResult {
  risk_score: number;
  risk_level: SuicideBehaviorRiskLevel;
  risk_level_label: string;
  has_self_harm: boolean;
  has_interrupted_attempt: boolean;
  has_aborted_attempt: boolean;
  has_preparations: boolean;
  total_attempt_count: number;
  interpretation: string;
}

export function scoreSuicideBehaviorFollowup(
  responses: SuicideBehaviorFollowupScoreInput & SuicideBehaviorFollowupCountInput
): SuicideBehaviorFollowupScoringResult {
  const risk_score = computeSuicideBehaviorRiskScore(responses);
  const risk_level = getSuicideBehaviorRiskLevel(risk_score);

  return {
    risk_score,
    risk_level,
    risk_level_label: getSuicideBehaviorRiskLevelLabel(risk_level),
    has_self_harm: responses.q1_self_harm === 1,
    has_interrupted_attempt: responses.q2_interrupted === 1,
    has_aborted_attempt: responses.q3_aborted === 1,
    has_preparations: responses.q4_preparations === 1,
    total_attempt_count: getTotalAttemptCount(responses),
    interpretation: interpretSuicideBehaviorFollowup(responses)
  };
}
