// eFondaMental Platform - PANSS (Positive and Negative Syndrome Scale)
// 30-item clinician-rated scale for measuring symptom severity of schizophrenia
// Original authors: Kay SR, Fiszbein A, Opler LA (1986)
// French translation: Lepine JP (1989)

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaPanssResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  
  // Positive subscale (P1-P7)
  p1?: number | null;
  p2?: number | null;
  p3?: number | null;
  p4?: number | null;
  p5?: number | null;
  p6?: number | null;
  p7?: number | null;
  
  // Negative subscale (N1-N7)
  n1?: number | null;
  n2?: number | null;
  n3?: number | null;
  n4?: number | null;
  n5?: number | null;
  n6?: number | null;
  n7?: number | null;
  
  // General psychopathology subscale (G1-G16)
  g1?: number | null;
  g2?: number | null;
  g3?: number | null;
  g4?: number | null;
  g5?: number | null;
  g6?: number | null;
  g7?: number | null;
  g8?: number | null;
  g9?: number | null;
  g10?: number | null;
  g11?: number | null;
  g12?: number | null;
  g13?: number | null;
  g14?: number | null;
  g15?: number | null;
  g16?: number | null;
  
  // Computed scores
  positive_score?: number | null;
  negative_score?: number | null;
  general_score?: number | null;
  total_score?: number | null;
  
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaPanssResponseInsert = Omit<
  SchizophreniaPanssResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'positive_score' | 'negative_score' | 'general_score' | 'total_score'
>;

// ============================================================================
// Response Options
// ============================================================================

const PANSS_RESPONSE_OPTIONS = [
  { code: 1, label: 'ABSENT', score: 1 },
  { code: 2, label: 'MINIME', score: 2 },
  { code: 3, label: 'LEGER', score: 3 },
  { code: 4, label: 'MOYEN', score: 4 },
  { code: 5, label: 'MODEREMENT SEVERE', score: 5 },
  { code: 6, label: 'SEVERE', score: 6 },
  { code: 7, label: 'EXTREME', score: 7 }
];

// ============================================================================
// Questions
// ============================================================================

export const PANSS_QUESTIONS: Question[] = [
  // Positive Subscale (P1-P7)
  { id: 'section_positive', text: 'Sous-score positif', type: 'section', required: false },
  {
    id: 'p1', text: 'P1. DELIRE',
    help: 'Croyances qui sont non fondees, irrealistes et idiosyncratiques.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable; eventuellement a l\'extreme limite de la norme.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Presence d\'une ou deux idees delirantes assez vagues, ni rigides, ni tenaces.', score: 3 },
      { code: 4, label: '4 - MODERE: Presence d\'un eventail kaleidoscopique d\'idees delirantes peu formees ou instables.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Presence de nombreuses idees delirantes tres developpees et tres tenaces.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Presence d\'un ensemble stable d\'idees delirantes cristallisees.', score: 6 },
      { code: 7, label: '7 - EXTREME: Presence d\'un ensemble stable d\'idees delirantes qui dominent les aspects principaux de la vie.', score: 7 }
    ]
  },
  {
    id: 'p2', text: 'P2. TROUBLES DE LA PENSEE',
    help: 'Processus desorganise de la pensee, caracterise par un dereglement du cheminement finalise.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable.', score: 2 },
      { code: 3, label: '3 - FAIBLE: La pensee est circonstancielle, tangentielle ou paralogique.', score: 3 },
      { code: 4, label: '4 - MODERE: Capable de concentrer ses pensees lorsque les echanges sont brefs.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Difficultes pour organiser ses pensees.', score: 5 },
      { code: 6, label: '6 - PRONONCE: La pensee est serieusement perturbee.', score: 6 },
      { code: 7, label: '7 - EXTREME: Les pensees sont dereglees au point que le patient devient incoherent.', score: 7 }
    ]
  },
  {
    id: 'p3', text: 'P3. COMPORTEMENT HALLUCINATOIRE',
    help: 'Perceptions qui ne sont pas provoquees par des stimuli externes.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Une ou deux hallucinations clairement developpees mais peu frequentes.', score: 3 },
      { code: 4, label: '4 - MODERE: Les hallucinations se font frequemment.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Hallucinations frequentes impliquant plusieurs modalites sensorielles.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Les hallucinations sont presque constamment presentes.', score: 6 },
      { code: 7, label: '7 - EXTREME: Le patient est presque totalement preoccupe par ses hallucinations.', score: 7 }
    ]
  },
  {
    id: 'p4', text: 'P4. EXCITATION',
    help: 'Hyperactivite qui se traduit par un comportement moteur accelere.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Tendance a se montrer legerement agite.', score: 3 },
      { code: 4, label: '4 - MODERE: Agitation ou excitation evidente au cours de l\'interview.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Hyperactivite evidente.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Une excitation evidente domine toute l\'interview.', score: 6 },
      { code: 7, label: '7 - EXTREME: Excitation evidente qui interfere dans l\'alimentation et le sommeil.', score: 7 }
    ]
  },
  {
    id: 'p5', text: 'P5. MEGALOMANIE',
    help: 'Opinion de soi exageree et convictions de superiorite irrealistes.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Vantardise et exces d\'orgueil evidents.', score: 3 },
      { code: 4, label: '4 - MODERE: Se sent de maniere claire et irrealiste superieur aux autres.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Idees delirantes tres precises a propos de facultes extraordinaires.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Idees delirantes a propos d\'une superiorite tres nette.', score: 6 },
      { code: 7, label: '7 - EXTREME: La pensee et le comportement sont domines par de nombreuses idees delirantes.', score: 7 }
    ]
  },
  {
    id: 'p6', text: 'P6. MEFIANCE/COMPLEXE DE PERSECUTION',
    help: 'Impressions irrealistes ou exagerees de persecution.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Attitude reservee, voire franchement mefiante.', score: 3 },
      { code: 4, label: '4 - MODERE: Mefiance evidente et interfere sur le comportement.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Mefiance tres marquee.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Delire de persecution profond.', score: 6 },
      { code: 7, label: '7 - EXTREME: La pensee et le comportement sont domines par un reseau d\'idees delirantes persecutrices.', score: 7 }
    ]
  },
  {
    id: 'p7', text: 'P7. HOSTILITE',
    help: 'Expression verbale et non verbale de colere et de ressentiment.',
    type: 'single_choice', required: false,
    options: [
      { code: 1, label: '1 - NEANT: Definition non applicable.', score: 1 },
      { code: 2, label: '2 - MINIME: Pathologie discutable.', score: 2 },
      { code: 3, label: '3 - FAIBLE: Expression indirecte ou retenue de colere.', score: 3 },
      { code: 4, label: '4 - MODERE: Attitude clairement hostile, irritabilite frequente.', score: 4 },
      { code: 5, label: '5 - MODERE, PRONONCE: Le patient est tres irritable et peut se montrer menacant.', score: 5 },
      { code: 6, label: '6 - PRONONCE: Manque de cooperation et insultes ou menaces.', score: 6 },
      { code: 7, label: '7 - EXTREME: Colere prononcee qui debouche sur un manque total de cooperation.', score: 7 }
    ]
  },
  
  // Negative Subscale (N1-N7)
  { id: 'section_negative', text: 'Sous-score negatif', type: 'section', required: false },
  { id: 'n1', text: 'N1. AFFECT EMOUSSE', help: 'Reponse emotionnelle diminuee.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'n2', text: 'N2. RETRAIT EMOTIONNEL', help: 'Manque d\'interet et d\'engagement affectif.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'n3', text: 'N3. CONTACT FAIBLE', help: 'Manque d\'ouverture interpersonnelle.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'n4', text: 'N4. RETRAIT SOCIAL PASSIF/APATHIQUE', help: 'Amoindrissement de l\'interet dans les interactions sociales.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'n5', text: 'N5. DIFFICULTE DE RAISONNER DANS L\'ABSTRAIT', help: 'Deterioration du mode de pensee abstrait-symbolique.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'n6', text: 'N6. MANQUE DE SPONTANEITE ET FLOT DE CONVERSATION', help: 'Reduction du flot normal de communication.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'n7', text: 'N7. PENSEE STEREOTYPEE', help: 'Diminution de la fluidite et flexibilite de la pensee.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  
  // General Psychopathology Subscale (G1-G16)
  { id: 'section_general', text: 'Sous-score general', type: 'section', required: false },
  { id: 'g1', text: 'G1. PREOCCUPATIONS SOMATIQUES', help: 'Plaintes physiques ou croyances relatives a une maladie somatique.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'g2', text: 'G2. ANXIETE', help: 'Experience subjective de nervosite, inquietude, apprehension.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'g3', text: 'G3. SENTIMENTS DE CULPABILITE', help: 'Sentiment de remords ou d\'auto-accusation.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'g4', text: 'G4. TENSION', help: 'Manifestations physiques de peur, d\'anxiete et d\'agitation.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'g5', text: 'G5. MANIERISME ET TROUBLES DE LA POSTURE', help: 'Mouvements ou postures non naturels.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'g6', text: 'G6. DEPRESSION', help: 'Sentiments de tristesse, de decouragement.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'g7', text: 'G7. RALENTISSEMENT PSYCHOMOTEUR', help: 'Reduction de l\'activite motrice.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'g8', text: 'G8. MANQUE DE COOPERATION', help: 'Refus actif de se conformer a la volonte des personnes significatives.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'g9', text: 'G9. CONTENU INHABITUEL DE LA PENSEE', help: 'Contenu de la pensee caracterise par des idees etranges.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'g10', text: 'G10. DESORIENTATION', help: 'Manque de conscience de ses relations avec l\'environnement.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'g11', text: 'G11. MANQUE D\'ATTENTION', help: 'Echec de l\'attention focalisee.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'g12', text: 'G12. MANQUE DE JUGEMENT ET DE PRISE DE CONSCIENCE', help: 'Alteration de la conscience de sa propre situation psychiatrique.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'g13', text: 'G13. TROUBLES DE LA VOLITION', help: 'Trouble de l\'initiation et du controle volontaire.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'g14', text: 'G14. MAUVAIS CONTROLE PULSIONNEL', help: 'Regulation et controle defaillants de l\'action sur les impulsions.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'g15', text: 'G15. PREOCCUPATION EXCESSIVE DE SOI', help: 'Preoccupation avec ses propres pensees et sentiments.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS },
  { id: 'g16', text: 'G16. EVITEMENT SOCIAL ACTIF', help: 'Diminution de l\'implication sociale associee a une peur.', type: 'single_choice', required: false, options: PANSS_RESPONSE_OPTIONS }
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
    [key: string]: any;
  };
}

export const PANSS_DEFINITION: QuestionnaireDefinition = {
  id: 'panss',
  code: 'PANSS',
  title: 'PANSS - Echelle des syndromes positifs et negatifs',
  description: 'Echelle d\'evaluation de la severite des symptomes de la schizophrenie a 30 items. Auteurs originaux: Kay SR, Fiszbein A, Opler LA (1986). Traduction francaise: Lepine JP (1989).',
  questions: PANSS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'French Version (Lepine, 1989)',
    language: 'fr-FR'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

export function computePanssScores(response: Partial<SchizophreniaPanssResponse>): {
  positive_score: number;
  negative_score: number;
  general_score: number;
  total_score: number;
} {
  const positive = [response.p1, response.p2, response.p3, response.p4, response.p5, response.p6, response.p7]
    .filter((v): v is number => v !== null && v !== undefined)
    .reduce((sum, v) => sum + v, 0);
  
  const negative = [response.n1, response.n2, response.n3, response.n4, response.n5, response.n6, response.n7]
    .filter((v): v is number => v !== null && v !== undefined)
    .reduce((sum, v) => sum + v, 0);
  
  const general = [
    response.g1, response.g2, response.g3, response.g4, response.g5, response.g6,
    response.g7, response.g8, response.g9, response.g10, response.g11, response.g12,
    response.g13, response.g14, response.g15, response.g16
  ].filter((v): v is number => v !== null && v !== undefined)
    .reduce((sum, v) => sum + v, 0);
  
  return {
    positive_score: positive,
    negative_score: negative,
    general_score: general,
    total_score: positive + negative + general
  };
}

export function interpretPanssTotal(total: number): string {
  if (total <= 58) return 'Mildly ill';
  if (total <= 75) return 'Moderately ill';
  if (total <= 95) return 'Markedly ill';
  if (total <= 116) return 'Severely ill';
  return 'Extremely ill';
}
