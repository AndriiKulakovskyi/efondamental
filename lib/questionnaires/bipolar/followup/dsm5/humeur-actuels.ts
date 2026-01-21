// eFondaMental Platform - DSM5 Semestrial: Current Mood Disorders (Troubles de l'humeur actuels)
// Bipolar Followup Evaluation - DSM5 Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarFollowupHumeurActuelsResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  rad_epactuel: string | null;
  date_trouble_actuel_debut: string | null;
  rad_epactuel_type: string | null;
  rad_epactuel_edmtype: string | null;
  rad_epactuel_mixttyp: string | null;
  rad_epactuel_mixttyp2: string | null;
  rad_epactuel_sever: string | null;
  rad_epactuel_chron: string | null;
  rad_postpartum_actuel: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarFollowupHumeurActuelsResponseInsert = Omit<
  BipolarFollowupHumeurActuelsResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const HUMEUR_ACTUELS_QUESTIONS: Question[] = [
  {
    id: 'rad_epactuel',
    text: "Presence d'un episode actuel",
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' }
    ]
  },
  {
    id: 'date_trouble_actuel_debut',
    text: 'Date de debut',
    type: 'date',
    required: false,
    display_if: { '==': [{ var: 'rad_epactuel' }, 'Oui'] },
    metadata: { default: 'today' }
  },
  {
    id: 'rad_epactuel_type',
    text: "Type d'episode",
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_epactuel' }, 'Oui'] },
    options: [
      { code: 'Episode Depressif Majeur', label: 'Episode Depressif Majeur' },
      { code: 'Hypomaniaque', label: 'Hypomaniaque' },
      { code: 'Maniaque', label: 'Maniaque' },
      { code: 'Episode Non specifie', label: 'Episode Non specifie' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'rad_epactuel_edmtype',
    text: "Type d'episode EDM actuel",
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_epactuel_type' }, 'Episode Depressif Majeur'] },
    options: [
      { code: 'Sans caracteristique melancolique atypique catatonique ou mixte', label: 'Sans caracteristique melancolique atypique catatonique ou mixte' },
      { code: 'Melancolique', label: 'Melancolique' },
      { code: 'Atypique', label: 'Atypique' },
      { code: 'Catatonique', label: 'Catatonique' },
      { code: 'Mixte', label: 'Mixte' }
    ]
  },
  {
    id: 'rad_epactuel_mixttyp',
    text: 'Episode Catatonique ?',
    type: 'single_choice',
    required: false,
    display_if: { 'in': [{ var: 'rad_epactuel_type' }, ['Maniaque', 'Episode Non specifie']] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'rad_epactuel_mixttyp2',
    text: 'Episode Mixte?',
    type: 'single_choice',
    required: false,
    display_if: { 'in': [{ var: 'rad_epactuel_type' }, ['Maniaque', 'Episode Non specifie']] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'rad_epactuel_sever',
    text: "Severite de l'episode",
    type: 'single_choice',
    required: false,
    display_if: { 'in': [{ var: 'rad_epactuel_type' }, ['Episode Depressif Majeur', 'Maniaque', 'Episode Non specifie']] },
    options: [
      { code: 'Leger', label: 'Leger' },
      { code: 'Modere', label: 'Modere' },
      { code: 'Severe sans caracteristique psychotique', label: 'Severe sans caracteristique psychotique' },
      { code: 'Severe avec caracteristiques psychotiques non congruentes', label: 'Severe avec caracteristiques psychotiques non congruentes' },
      { code: 'Severe avec caracteristiques psychotiques congruentes', label: 'Severe avec caracteristiques psychotiques congruentes' }
    ]
  },
  {
    id: 'rad_epactuel_chron',
    text: "Chronicite de l'episode",
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_epactuel_type' }, 'Episode Depressif Majeur'] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'rad_postpartum_actuel',
    text: 'Survenue en post-partum',
    type: 'single_choice',
    required: false,
    display_if: { 'in': [{ var: 'rad_epactuel_type' }, ['Episode Depressif Majeur', 'Hypomaniaque', 'Maniaque', 'Episode Non specifie']] },
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const HUMEUR_ACTUELS_DEFINITION = {
  id: 'humeur_actuels',
  code: 'HUMEUR_ACTUELS',
  title: "Troubles de l'humeur actuels",
  description: "Evaluation des troubles de l'humeur actuels pour le suivi semestriel du trouble bipolaire",
  questions: HUMEUR_ACTUELS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Interpretation Functions
// ============================================================================

export interface HumeurActuelsInterpretationInput {
  rad_epactuel: string | null;
  rad_epactuel_type: string | null;
  rad_epactuel_sever: string | null;
}

export type EpisodeStatus = 'no_episode' | 'current_episode';
export type EpisodeType = 'edm' | 'hypomanic' | 'manic' | 'unspecified' | 'unknown' | null;
export type EpisodeSeverity = 'mild' | 'moderate' | 'severe' | 'severe_psychotic' | null;

export function getEpisodeStatus(responses: HumeurActuelsInterpretationInput): EpisodeStatus {
  return responses.rad_epactuel === 'Oui' ? 'current_episode' : 'no_episode';
}

export function getEpisodeType(responses: HumeurActuelsInterpretationInput): EpisodeType {
  if (responses.rad_epactuel !== 'Oui' || !responses.rad_epactuel_type) return null;
  
  switch (responses.rad_epactuel_type) {
    case 'Episode Depressif Majeur':
      return 'edm';
    case 'Hypomaniaque':
      return 'hypomanic';
    case 'Maniaque':
      return 'manic';
    case 'Episode Non specifie':
      return 'unspecified';
    default:
      return 'unknown';
  }
}

export function getEpisodeSeverity(responses: HumeurActuelsInterpretationInput): EpisodeSeverity {
  if (!responses.rad_epactuel_sever) return null;
  
  if (responses.rad_epactuel_sever === 'Leger') return 'mild';
  if (responses.rad_epactuel_sever === 'Modere') return 'moderate';
  if (responses.rad_epactuel_sever === 'Severe sans caracteristique psychotique') return 'severe';
  if (responses.rad_epactuel_sever.includes('psychotique')) return 'severe_psychotic';
  
  return null;
}

export function interpretHumeurActuels(responses: HumeurActuelsInterpretationInput): string {
  const status = getEpisodeStatus(responses);
  
  if (status === 'no_episode') {
    return 'Pas d\'episode thymique actuel.';
  }
  
  const type = getEpisodeType(responses);
  const severity = getEpisodeSeverity(responses);
  
  let interpretation = 'Episode actuel: ';
  
  switch (type) {
    case 'edm':
      interpretation += 'Episode Depressif Majeur';
      break;
    case 'hypomanic':
      interpretation += 'Episode Hypomaniaque';
      break;
    case 'manic':
      interpretation += 'Episode Maniaque';
      break;
    case 'unspecified':
      interpretation += 'Episode Non specifie';
      break;
    default:
      interpretation += 'Type non determine';
  }
  
  if (severity) {
    interpretation += ` - Severite: ${responses.rad_epactuel_sever}`;
  }
  
  return interpretation;
}

// ============================================================================
// Combined Interpretation Function
// ============================================================================

export interface HumeurActuelsInterpretationResult {
  episode_status: EpisodeStatus;
  episode_type: EpisodeType;
  episode_severity: EpisodeSeverity;
  interpretation: string;
}

export function analyzeHumeurActuels(responses: HumeurActuelsInterpretationInput): HumeurActuelsInterpretationResult {
  return {
    episode_status: getEpisodeStatus(responses),
    episode_type: getEpisodeType(responses),
    episode_severity: getEpisodeSeverity(responses),
    interpretation: interpretHumeurActuels(responses)
  };
}
