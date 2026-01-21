// eFondaMental Platform - DSM5 Semestrial: Episodes Since Last Visit
// (Troubles de l'humeur depuis la derniere visite)
// Bipolar Followup Evaluation - DSM5 Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarFollowupHumeurDepuisVisiteResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Screening
  rad_tb_hum_epthyman: string | null;
  rad_tb_hum_epthyman_nb: string | null;
  // EDM section
  rad_tb_hum_nbepdep: string | null;
  date_prem_edm: string | null;
  rad_tb_hum_nbepdeppsy: string | null;
  rad_tb_hum_nbepdepmixt: string | null;
  // Manic section
  rad_tb_hum_nbepmanan: string | null;
  date_prem_man: string | null;
  rad_tb_hum_nbepmanpsy: string | null;
  rad_tb_hum_nbepmanmixt: string | null;
  // Hypomanic section
  rad_tb_hum_nbephypoman: string | null;
  date_prem_hypo: string | null;
  // Episode sequence
  rad_tb_hum_type_plus_recent: string | null;
  enchainement: string | null;
  // Hospitalizations
  rad_tb_hum_nb_hospi: string | null;
  rad_tb_hum_duree_hospi: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarFollowupHumeurDepuisVisiteResponseInsert = Omit<
  BipolarFollowupHumeurDepuisVisiteResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Helper Functions
// ============================================================================

const generateEpisodeCountOptions = () => [
  { code: 'Ne sais pas', label: 'Ne sais pas' },
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

const atLeastOneEpisodeCondition = (fieldName: string) => ({
  '>=': [{ var: fieldName }, 1]
});

// ============================================================================
// Questions Dictionary
// ============================================================================

export const HUMEUR_DEPUIS_VISITE_QUESTIONS: Question[] = [
  // Screening Section
  {
    id: 'titre_onglet_ep',
    text: 'Dans cet onglet, renseignez les episodes survenus depuis la derniere visite, en ne comptant pas l\'episode actuel s\'il y en a eu un',
    type: 'instruction',
    required: false
  },
  {
    id: 'rad_tb_hum_epthyman',
    text: 'Presence d\'au moins un episode thymique depuis la derniere visite',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Oui', label: 'Oui' },
      { code: 'Non', label: 'Non' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'rad_tb_hum_epthyman_nb',
    text: 'Nombre d\'episodes total',
    type: 'single_choice',
    required: false,
    readonly: true,
    display_if: { '==': [{ var: 'rad_tb_hum_epthyman' }, 'Oui'] },
    options: generateEpisodeCountOptions(),
    metadata: {
      helpText: 'Attention ce nombre doit etre egal a la somme de tous les episodes depuis la derniere visite'
    }
  },

  // EDM Section
  {
    id: 'section_edm',
    text: 'EDM',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'rad_tb_hum_epthyman' }, 'Oui'] }
  },
  {
    id: 'rad_tb_hum_nbepdep',
    text: 'Nombre d\'EDM',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_tb_hum_epthyman' }, 'Oui'] },
    options: generateEpisodeCountOptions()
  },
  {
    id: 'date_prem_edm',
    text: 'Date du premier episode EDM depuis la derniere visite',
    type: 'date',
    required: false,
    display_if: atLeastOneEpisodeCondition('rad_tb_hum_nbepdep')
  },
  {
    id: 'rad_tb_hum_nbepdeppsy',
    text: 'Nombre d\'EDM avec caracteristiques psychotiques',
    type: 'single_choice',
    required: false,
    display_if: atLeastOneEpisodeCondition('rad_tb_hum_nbepdep'),
    options: generateEpisodeCountOptions()
  },
  {
    id: 'rad_tb_hum_nbepdepmixt',
    text: 'Nombre d\'EDM avec caracteristiques mixtes',
    type: 'single_choice',
    required: false,
    display_if: atLeastOneEpisodeCondition('rad_tb_hum_nbepdep'),
    options: generateEpisodeCountOptions()
  },

  // Manic Section
  {
    id: 'section_manie',
    text: 'Manie',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'rad_tb_hum_epthyman' }, 'Oui'] }
  },
  {
    id: 'rad_tb_hum_nbepmanan',
    text: 'Nombre d\'episodes maniaques',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_tb_hum_epthyman' }, 'Oui'] },
    options: generateEpisodeCountOptions()
  },
  {
    id: 'date_prem_man',
    text: 'Date du premier episode maniaque depuis la derniere visite',
    type: 'date',
    required: false,
    display_if: atLeastOneEpisodeCondition('rad_tb_hum_nbepmanan')
  },
  {
    id: 'rad_tb_hum_nbepmanpsy',
    text: 'Nombre d\'episodes maniaques avec caracteristiques psychotiques',
    type: 'single_choice',
    required: false,
    display_if: atLeastOneEpisodeCondition('rad_tb_hum_nbepmanan'),
    options: generateEpisodeCountOptions()
  },
  {
    id: 'rad_tb_hum_nbepmanmixt',
    text: 'Nombre d\'episodes maniaques avec caracteristiques mixtes',
    type: 'single_choice',
    required: false,
    display_if: atLeastOneEpisodeCondition('rad_tb_hum_nbepmanan'),
    options: generateEpisodeCountOptions()
  },

  // Hypomanic Section
  {
    id: 'section_hypomanie',
    text: 'Hypomanie',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'rad_tb_hum_epthyman' }, 'Oui'] }
  },
  {
    id: 'rad_tb_hum_nbephypoman',
    text: 'Nombre d\'episodes hypomaniaques',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_tb_hum_epthyman' }, 'Oui'] },
    options: generateEpisodeCountOptions()
  },
  {
    id: 'date_prem_hypo',
    text: 'Date du premier episode hypomane depuis la derniere visite',
    type: 'date',
    required: false,
    display_if: atLeastOneEpisodeCondition('rad_tb_hum_nbephypoman')
  },

  // Episode Sequence Section
  {
    id: 'section_enchainement',
    text: 'Enchainement',
    type: 'section',
    required: false,
    display_if: { '==': [{ var: 'rad_tb_hum_epthyman' }, 'Oui'] }
  },
  {
    id: 'rad_tb_hum_type_plus_recent',
    text: 'Type de l\'episode le plus recent',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ var: 'rad_tb_hum_epthyman' }, 'Oui'] },
    options: [
      { code: 'Episode Depressif Majeur', label: 'Episode Depressif Majeur' },
      { code: 'Hypomaniaque', label: 'Hypomaniaque' },
      { code: 'Maniaque', label: 'Maniaque' },
      { code: 'Episode Non specifie', label: 'Episode Non specifie' },
      { code: 'Ne sais pas', label: 'Ne sais pas' }
    ]
  },
  {
    id: 'enchainement',
    text: 'Enchainement des episodes',
    type: 'text',
    required: false,
    display_if: { '==': [{ var: 'rad_tb_hum_epthyman' }, 'Oui'] },
    metadata: {
      helpText: 'Placer dans l\'ordre les episodes: D depression; H hypomanie; M manie; Mx mixte; Ns non-specifie'
    }
  },

  // Hospitalizations Section
  {
    id: 'section_hospitalisations',
    text: 'Hospitalisations',
    type: 'section',
    required: false
  },
  {
    id: 'rad_tb_hum_nb_hospi',
    text: 'Nombre d\'hospitalisations',
    type: 'single_choice',
    required: false,
    options: generateEpisodeCountOptions()
  },
  {
    id: 'rad_tb_hum_duree_hospi',
    text: 'Duree totale des hospitalisations (en mois)',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'Ne sais pas', label: 'Ne sais pas' },
      { code: '0', label: '0' },
      { code: '1/4', label: '1/4' },
      { code: '1/2', label: '1/2' },
      { code: '3/4', label: '3/4' },
      { code: '1', label: '1' },
      { code: '2', label: '2' },
      { code: '3', label: '3' },
      { code: '4', label: '4' },
      { code: '5', label: '5' },
      { code: '6', label: '6' },
      { code: '7', label: '7' },
      { code: '8', label: '8' },
      { code: '9', label: '9' },
      { code: '10', label: '10' },
      { code: '11', label: '11' },
      { code: '12', label: '12' },
      { code: '>12', label: '>12' }
    ]
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const HUMEUR_DEPUIS_VISITE_DEFINITION = {
  id: 'humeur_depuis_visite',
  code: 'HUMEUR_DEPUIS_VISITE',
  title: 'Troubles de l\'humeur depuis la derniere visite',
  description: 'Evaluation des episodes thymiques survenus depuis la derniere visite pour le suivi semestriel du trouble bipolaire',
  questions: HUMEUR_DEPUIS_VISITE_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};

// ============================================================================
// Score/Count Computation
// ============================================================================

export interface EpisodeCountInput {
  rad_tb_hum_nbepdep: string | null;
  rad_tb_hum_nbepmanan: string | null;
  rad_tb_hum_nbephypoman: string | null;
}

function parseEpisodeCount(value: string | null): number {
  if (!value || value === 'Ne sais pas') return 0;
  if (value === '>20') return 21;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? 0 : parsed;
}

export function computeTotalEpisodes(responses: EpisodeCountInput): number {
  const edm = parseEpisodeCount(responses.rad_tb_hum_nbepdep);
  const manic = parseEpisodeCount(responses.rad_tb_hum_nbepmanan);
  const hypomanic = parseEpisodeCount(responses.rad_tb_hum_nbephypoman);
  return edm + manic + hypomanic;
}

// ============================================================================
// Interpretation Functions
// ============================================================================

export interface HumeurDepuisVisiteInterpretationInput {
  rad_tb_hum_epthyman: string | null;
  rad_tb_hum_nbepdep: string | null;
  rad_tb_hum_nbepmanan: string | null;
  rad_tb_hum_nbephypoman: string | null;
  rad_tb_hum_nb_hospi: string | null;
}

export type EpisodePresence = 'no_episodes' | 'has_episodes' | 'unknown';

export function getEpisodePresence(responses: HumeurDepuisVisiteInterpretationInput): EpisodePresence {
  if (responses.rad_tb_hum_epthyman === 'Non') return 'no_episodes';
  if (responses.rad_tb_hum_epthyman === 'Oui') return 'has_episodes';
  return 'unknown';
}

export function interpretHumeurDepuisVisite(responses: HumeurDepuisVisiteInterpretationInput): string {
  const presence = getEpisodePresence(responses);
  
  if (presence === 'no_episodes') {
    return 'Aucun episode thymique depuis la derniere visite.';
  }
  
  if (presence === 'unknown') {
    return 'Presence d\'episodes thymiques non determinee.';
  }
  
  const edm = parseEpisodeCount(responses.rad_tb_hum_nbepdep);
  const manic = parseEpisodeCount(responses.rad_tb_hum_nbepmanan);
  const hypomanic = parseEpisodeCount(responses.rad_tb_hum_nbephypoman);
  const total = edm + manic + hypomanic;
  const hospi = parseEpisodeCount(responses.rad_tb_hum_nb_hospi);
  
  const parts: string[] = [`${total} episode(s) depuis la derniere visite`];
  
  if (edm > 0) parts.push(`${edm} EDM`);
  if (manic > 0) parts.push(`${manic} maniaque(s)`);
  if (hypomanic > 0) parts.push(`${hypomanic} hypomaniaque(s)`);
  if (hospi > 0) parts.push(`${hospi} hospitalisation(s)`);
  
  return parts.join('. ') + '.';
}

// ============================================================================
// Combined Analysis Function
// ============================================================================

export interface HumeurDepuisVisiteAnalysisResult {
  episode_presence: EpisodePresence;
  total_episodes: number;
  edm_count: number;
  manic_count: number;
  hypomanic_count: number;
  hospitalization_count: number;
  interpretation: string;
}

export function analyzeHumeurDepuisVisite(
  responses: HumeurDepuisVisiteInterpretationInput & EpisodeCountInput
): HumeurDepuisVisiteAnalysisResult {
  return {
    episode_presence: getEpisodePresence(responses),
    total_episodes: computeTotalEpisodes(responses),
    edm_count: parseEpisodeCount(responses.rad_tb_hum_nbepdep),
    manic_count: parseEpisodeCount(responses.rad_tb_hum_nbepmanan),
    hypomanic_count: parseEpisodeCount(responses.rad_tb_hum_nbephypoman),
    hospitalization_count: parseEpisodeCount(responses.rad_tb_hum_nb_hospi),
    interpretation: interpretHumeurDepuisVisite(responses)
  };
}
