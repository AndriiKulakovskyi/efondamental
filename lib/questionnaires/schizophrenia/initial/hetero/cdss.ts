// eFondaMental Platform - CDSS (Calgary Depression Scale for Schizophrenia)
// 9-item clinician-rated scale for assessing depression in schizophrenia
// Original authors: Addington D, Addington J (1990)
// French translation: Bernard D, Lancon C, Auquier P (1998)

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaCdssResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  q4?: number | null;
  q5?: number | null;
  q6?: number | null;
  q7?: number | null;
  q8?: number | null;
  q9?: number | null;
  total_score?: number | null;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaCdssResponseInsert = Omit<
  SchizophreniaCdssResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'total_score'
>;

// ============================================================================
// Questions
// ============================================================================

export const CDSS_QUESTIONS: Question[] = [
  {
    id: 'cdss_instructions',
    text: 'Instructions',
    help: 'Poser la premiere question telle qu\'elle est ecrite. Le cadre temporel concerne les deux dernieres semaines. Le dernier item (9) se base sur des observations fondees sur l\'ensemble de l\'entretien.',
    type: 'instruction',
    required: false
  },
  {
    id: 'q1', text: '1. DEPRESSION',
    help: 'Comment pourriez-vous decrire votre humeur durant les deux dernieres semaines?',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: 'ABSENTE - Definition non applicable.', score: 0 },
      { code: 1, label: 'LEGERE - Le sujet exprime une certaine tristesse ou un certain decouragement.', score: 1 },
      { code: 2, label: 'MODEREE - Humeur depressive distinctive presente tous les jours.', score: 2 },
      { code: 3, label: 'SEVERE - Humeur depressive marquee persistant tous les jours.', score: 3 }
    ]
  },
  {
    id: 'q2', text: '2. DESESPOIR',
    help: 'Comment entrevoyez-vous le futur pour vous-meme?',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: 'ABSENT - Definition non applicable.', score: 0 },
      { code: 1, label: 'LEGER - A certains moments, le sujet s\'est senti sans espoir.', score: 1 },
      { code: 2, label: 'MODERE - Perception persistante mais moderee de desespoir.', score: 2 },
      { code: 3, label: 'SEVERE - Sentiment persistant et eprouvant de desespoir.', score: 3 }
    ]
  },
  {
    id: 'q3', text: '3. AUTO-DEPRECIATION',
    help: 'Quelle est votre opinion de vous-meme, en comparaison avec d\'autres personnes?',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: 'ABSENTE - Definition non applicable.', score: 0 },
      { code: 1, label: 'LEGERE - Legere inferiorite.', score: 1 },
      { code: 2, label: 'MODEREE - Le sujet se sent sans valeur mais moins de 50% du temps.', score: 2 },
      { code: 3, label: 'SEVERE - Le sujet se sent sans valeur plus de 50% du temps.', score: 3 }
    ]
  },
  {
    id: 'q4', text: '4. IDEES DE REFERENCE ASSOCIEES A LA CULPABILITE',
    help: 'Avez-vous l\'impression que l\'on vous blame pour certaines choses?',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: 'ABSENTE - Definition non applicable.', score: 0 },
      { code: 1, label: 'LEGERE - Le sujet se sent blame mais non accuse.', score: 1 },
      { code: 2, label: 'MODEREE - Sentiment persistant d\'etre blame.', score: 2 },
      { code: 3, label: 'SEVERE - Sentiment persistant d\'etre accuse.', score: 3 }
    ]
  },
  {
    id: 'q5', text: '5. CULPABILITE PATHOLOGIQUE',
    help: 'Avez-vous tendance a vous blamer vous-meme pour des petites choses?',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: 'ABSENTE - Definition non applicable.', score: 0 },
      { code: 1, label: 'LEGERE - Le sujet se sent coupable de certaines peccadilles.', score: 1 },
      { code: 2, label: 'MODEREE - Le sujet se sent coupable habituellement (plus de 50% du temps).', score: 2 },
      { code: 3, label: 'SEVERE - Le sujet se sent habituellement qu\'il est a blamer pour tout.', score: 3 }
    ]
  },
  {
    id: 'q6', text: '6. DEPRESSION MATINALE',
    help: 'Avez-vous remarque que la depression etait pire a certains moments de la journee?',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: 'ABSENTE - Definition non applicable.', score: 0 },
      { code: 1, label: 'LEGERE - Depression presente mais sans variation diurne.', score: 1 },
      { code: 2, label: 'MODEREE - Le sujet mentionne spontanement que la depression est pire le matin.', score: 2 },
      { code: 3, label: 'SEVERE - La depression est de facon marquee pire le matin.', score: 3 }
    ]
  },
  {
    id: 'q7', text: '7. EVEIL PRECOCE',
    help: 'Vous reveillez-vous plus tot le matin qu\'a l\'accoutumee?',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: 'ABSENT - Pas de reveil precoce.', score: 0 },
      { code: 1, label: 'LEGER - A l\'occasion s\'eveille (jusqu\'a 2 fois par semaine) une heure ou plus avant.', score: 1 },
      { code: 2, label: 'MODERE - S\'eveille frequemment de facon hative (jusqu\'a 5 fois par semaine).', score: 2 },
      { code: 3, label: 'SEVERE - S\'eveille tous les jours une heure ou plus avant l\'heure normale.', score: 3 }
    ]
  },
  {
    id: 'q8', text: '8. SUICIDE',
    help: 'Avez-vous deja eu l\'impression que la vie ne valait pas la peine d\'etre vecue?',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: 'ABSENT - Definition non applicable.', score: 0 },
      { code: 1, label: 'LEGER - Le sujet a l\'idee qu\'il serait mieux mort.', score: 1 },
      { code: 2, label: 'MODERE - Il a envisage deliberement le suicide avec un projet.', score: 2 },
      { code: 3, label: 'SEVERE - Tentative de suicide apparemment concue pour se terminer par la mort.', score: 3 }
    ]
  },
  {
    id: 'q9', text: '9. DEPRESSION OBSERVEE',
    help: 'Basee sur les observations de l\'interviewer durant l\'entretien complet.',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: 'ABSENTE - Definition non applicable.', score: 0 },
      { code: 1, label: 'LEGERE - Le sujet apparait triste et sur le point de pleurer.', score: 1 },
      { code: 2, label: 'MODEREE - Le sujet apparait triste, pres des larmes durant tout l\'entretien.', score: 2 },
      { code: 3, label: 'SEVERE - Le patient s\'etrangle, soupire profondement et pleure ouvertement.', score: 3 }
    ]
  }
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

export const CDSS_DEFINITION: QuestionnaireDefinition = {
  id: 'cdss',
  code: 'CDSS',
  title: 'CDSS - Echelle de depression de Calgary',
  description: 'Echelle a 9 items specifiquement concue pour evaluer la depression chez les patients schizophrenes. Auteurs originaux: Addington D, Addington J (1990). Traduction francaise: Bernard D, Lancon C, Auquier P (1998).',
  questions: CDSS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: 'French Version (Bernard et al., 1998)',
    language: 'fr-FR'
  }
};

// ============================================================================
// Scoring Functions
// ============================================================================

export function computeCdssScore(response: Partial<SchizophreniaCdssResponse>): number {
  const items = [response.q1, response.q2, response.q3, response.q4, response.q5, response.q6, response.q7, response.q8, response.q9];
  return items.filter((v): v is number => v !== null && v !== undefined).reduce((sum, v) => sum + v, 0);
}

export function interpretCdssScore(score: number): { severity: string; clinicalSignificance: boolean } {
  const clinicalSignificance = score > 6;
  let severity = 'Minimal';
  if (score >= 5) severity = 'Mild';
  if (score >= 8) severity = 'Moderate';
  if (score >= 12) severity = 'Severe';
  return { severity, clinicalSignificance };
}
