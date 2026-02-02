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
  questionnaire_done?: string | null;
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
    id: 'questionnaire_done',
    text: 'Passation du questionnaire',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'Fait', label: 'Fait' },
      { code: 'Non fait', label: 'Non fait' }
    ]
  },
  {
    id: 'q1', text: '1. DÉPRESSION',
    help: 'Comment pourriez-vous décrire votre humeur durant les deux dernières semaines : avez-vous pu demeurer raisonnablement gai ou est ce que vous avez été très déprimé ou plutôt triste ces derniers temps ? Durant les deux dernières semaines, combien de fois vous êtes-vous senti ainsi, tous les jours? Toute la journée?',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: '0 — ABSENTE', score: 0 },
      { code: 1, label: '1 — LÉGÈRE : le sujet exprime une certaine tristesse ou un certain découragement lorsqu\'il est questionné', score: 1 },
      { code: 2, label: '2 — MODÉRÉE : humeur dépressive distinctive est présente tous les jours', score: 2 },
      { code: 3, label: '3 — SÉVÈRE : humeur dépressive marquée persistant tous les jours, plus de la moitié du temps, affectant le fonctionnement normal, psychomoteur et social', score: 3 }
    ]
  },
  {
    id: 'q2', text: '2. DÉSESPOIR',
    help: 'Comment entrevoyez-vous le futur pour vous-même? Est ce que vous pouvez envisager un avenir pour vous? Ou est-ce que la vie vous paraît plutôt sans espoir? Est ce que vous avez tout laissé tomber ou est ce qu\'il vous paraît y avoir encore des raisons d\'essayer?',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: '0 — ABSENT', score: 0 },
      { code: 1, label: '1 — LÉGER : à certains moments, le sujet s\'est senti sans espoir au cours de la dernière semaine mais il a encore un certain degré d\'espoir pour l\'avenir.', score: 1 },
      { code: 2, label: '2 — MODÉRÉ : perception persistante mais modérée de désespoir au cours de la dernière semaine. On peut cependant persuader le sujet d\'acquiescer à la possibilité que les choses peuvent s\'améliorer', score: 2 },
      { code: 3, label: '3 — SÉVÈRE : sentiment persistant et éprouvant de désespoir.', score: 3 }
    ]
  },
  {
    id: 'q3', text: '3. AUTO-DÉPRÉCIATION',
    help: 'Quelle est votre opinion de vous-même, en comparaison avec d\'autres personnes? Est ce que vous vous sentez meilleur ou moins bon, ou à peu près comparable aux autres personnes en général ? Vous sentez-vous inférieur ou même sans aucune valeur?',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: '0 — ABSENTE', score: 0 },
      { code: 1, label: '1 — LÉGÈRE : légère infériorité; n\'atteint pas le degré de se sentir sans valeur.', score: 1 },
      { code: 2, label: '2 — MODÉRÉE : le sujet se sent sans valeur mais moins de 50 % du temps.', score: 2 },
      { code: 3, label: '3 — SÉVÈRE : le sujet se sent sans valeur plus de 50 % du temps. Il peut être mis au défi de reconnaître un autre point de vue.', score: 3 }
    ]
  },
  {
    id: 'q4', text: '4. IDÉES DE RÉFÉRENCE ASSOCIÉES À LA CULPABILITÉ',
    help: 'Avez-vous l\'impression que l\'on vous blâme pour certaines choses ou même qu\'on vous accuse sans raison? A propos de quoi? (ne pas inclure ici des blâmes ou des accusations justifiés. Exclure les délires de culpabilité)',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: '0 — ABSENTE', score: 0 },
      { code: 1, label: '1 — LÉGÈRE : le sujet se sent blâmé mais non accusé, moins de 50 % du temps.', score: 1 },
      { code: 2, label: '2 — MODÉRÉE : sentiment persistant d\'être blâmé et/ou sentiment occasionnel d\'être accusé.', score: 2 },
      { code: 3, label: '3 — SÉVÈRE : sentiment persistant d\'être accusé. Lorsqu\'on le contredit, le sujet reconnaît que cela n\'est pas vrai.', score: 3 }
    ]
  },
  {
    id: 'q5', text: '5. CULPABILITÉ PATHOLOGIQUE',
    help: 'Avez-vous tendance à vous blâmer vous-même pour des petites choses que vous pourriez avoir faites dans le passé? Pensez-vous que vous méritez d\'être aussi préoccupé de cela?',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: '0 — ABSENTE', score: 0 },
      { code: 1, label: '1 — LÉGÈRE : le sujet se sent coupable de certaines peccadilles mais moins de 50 % du temps.', score: 1 },
      { code: 2, label: '2 — MODÉRÉE : le sujet se sent coupable habituellement (plus de 50 % du temps) à propos d\'actes dont il exagère la signification.', score: 2 },
      { code: 3, label: '3 — SÉVÈRE : le sujet se sent habituellement qu\'il est à blâmer pour tout ce qui va mal même lorsque ce n\'est pas de sa faute.', score: 3 }
    ]
  },
  {
    id: 'q6', text: '6. DÉPRESSION MATINALE',
    help: 'Lorsque vous vous êtes senti déprimé au cours des deux dernières semaines, avez-vous remarqué que la dépression était pire à certains moments de la journée?',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: '0 — ABSENTE', score: 0 },
      { code: 1, label: '1 — LÉGÈRE : dépression présente mais sans variation diurne', score: 1 },
      { code: 2, label: '2 — MODÉRÉE : le sujet mentionne spontanément que la dépression est pire le matin.', score: 2 },
      { code: 3, label: '3 — SÉVÈRE : la dépression est, de façon marquée, pure le matin, avec un fonctionnement perturbé qui s\'améliore l\'après midi.', score: 3 }
    ]
  },
  {
    id: 'q7', text: '7. ÉVEIL PRÉCOCE',
    help: 'Vous réveillez-vous plus tôt le matin qu\'à l\'accoutumée? Combien de fois par semaine cela vous arrive-t-il?',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: '0 — ABSENT : pas de réveil précoce.', score: 0 },
      { code: 1, label: '1 — LÉGER : à l\'occasion s\'éveille (jusqu\'à 2 fois par semaine) une heure ou plus avant le moment normal de s\'éveiller ou l\'heure fixée à son réveille-matin.', score: 1 },
      { code: 2, label: '2 — MODÉRÉ : s\'éveille fréquemment de façon hâtive (jusqu\'à 5 fois par semaine) une heure ou plus avant son heure habituelle d\'éveil ou l\'heure fixée par son réveille-matin', score: 2 },
      { code: 3, label: '3 — SÉVÈRE : s\'éveille tous les jours une heure ou plus avant l\'heure normale d\'éveil', score: 3 }
    ]
  },
  {
    id: 'q8', text: '8. SUICIDE',
    help: 'Avez-vous déjà eu l\'impression que la vie ne valait pas la peine d\'être vécue? Avez-vous déjà pensé mettre fin à tout cela? Qu\'est ce que vous pensez que vous auriez pu faire? Avez-vous effectivement essayé? ',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: '0 — ABSENT', score: 0 },
      { code: 1, label: '1 — LÉGER : le sujet a l\'idée qu\'il serait mieux mort ou des idées occupationnelles de suicide', score: 1 },
      { code: 2, label: '2 — MODÉRÉ : il a envisagé délibérément le suicide avec un projet mais sans faire de tentative', score: 2 },
      { code: 3, label: '3 — SÉVÈRE : tentative de suicide apparemment conçue pour se terminer par la mort (c\'est-à-dire de découverte accidentelle ou par un moyen qui s\'est avéré inefficace)', score: 3 }
    ]
  },
  {
    id: 'q9', text: '9. DÉPRESSION OBSERVÉE',
    help: 'Basée sur les observations de l\'interviewer durant l\'entretien complet. La question "est-ce que vous ressentez une envie de pleurer?" utilisée à des moments appropriés durant l\'entretien peut susciter l\'émergence d\'informations utiles à cette observation.',
    type: 'single_choice', required: false,
    options: [
      { code: 0, label: '0 — ABSENTE', score: 0 },
      { code: 1, label: '1 — LÉGÈRE : le sujet apparaît triste et sur le point de pleurer même durant des parties de l\'entretien touchant des sujets effectivement neutres.', score: 1 },
      { code: 2, label: '2 — MODÉRÉE : le sujet apparaît triste, près des larmes durant tout l\'entretien avec une voix monotone et mélancolique, extériorise des larmes ou est près des larmes à certains moments', score: 2 },
      { code: 3, label: '3 — SÉVÈRE : le patient s\'étrangle lorsqu\'il évoque des sujets générant de la détresse, soupire profondément, fréquemment et pleure ouvertement, ou est de façon persistante dans un état de souffrance figée.', score: 3 }
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
