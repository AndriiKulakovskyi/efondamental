// eFondaMental Platform - ISA (Intentionnalité Suicidaire Actuelle) - Schizophrenia
// Assessment of current suicidal ideation

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaIsaResponse {
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
  total_score?: number | null;
  interpretation?: string | null;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaIsaResponseInsert = Omit<
  SchizophreniaIsaResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Questions
// ============================================================================

export const ISA_SZ_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: '1. Avez-vous déjà eu l\'impression que la vie ne vaut pas la peine d\'être vécue ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q2',
    text: 'Quand cela est-il arrivé pour la dernière fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q1' }, 1]
    },
    options: [
      { code: 1, label: 'La semaine dernière', score: 1 },
      { code: 2, label: 'Il y a entre deux semaines et douze mois', score: 2 },
      { code: 3, label: 'Il y a plus d\'un an', score: 3 }
    ]
  },
  {
    id: 'q3',
    text: '2. Avez-vous déjà souhaité mourir, par exemple, de vous coucher et de ne pas vous réveiller ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q4',
    text: 'Quand cela est-il arrivé pour la dernière fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q3' }, 1]
    },
    options: [
      { code: 1, label: 'La semaine dernière', score: 1 },
      { code: 2, label: 'Il y a entre deux semaines et douze mois', score: 2 },
      { code: 3, label: 'Il y a plus d\'un an', score: 3 }
    ]
  },
  {
    id: 'q5',
    text: '3. Avez-vous déjà pensé à vous donner la mort, même si vous ne le feriez jamais ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q6',
    text: 'Quand cela est-il arrivé pour la dernière fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q5' }, 1]
    },
    options: [
      { code: 1, label: 'La semaine dernière', score: 1 },
      { code: 2, label: 'Il y a entre deux semaines et douze mois', score: 2 },
      { code: 3, label: 'Il y a plus d\'un an', score: 3 }
    ]
  },
  {
    id: 'q7',
    text: '4. Avez-vous déjà sérieusement envisagé de vous donner la mort ou planifié la façon de vous y prendre ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q8',
    text: 'Quand cela est-il arrivé pour la dernière fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q7' }, 1]
    },
    options: [
      { code: 1, label: 'La semaine dernière', score: 1 },
      { code: 2, label: 'Il y a entre deux semaines et douze mois', score: 2 },
      { code: 3, label: 'Il y a plus d\'un an', score: 3 }
    ]
  },
  {
    id: 'q9',
    text: '5. Avez-vous déjà essayé de vous donner la mort ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q10',
    text: 'Quand cela est-il arrivé pour la dernière fois ?',
    type: 'single_choice',
    required: false,
    display_if: {
      '==': [{ var: 'q9' }, 1]
    },
    options: [
      { code: 1, label: 'La semaine dernière', score: 1 },
      { code: 2, label: 'Il y a entre deux semaines et douze mois', score: 2 },
      { code: 3, label: 'Il y a plus d\'un an', score: 3 }
    ]
  },
  {
    id: 'q11',
    text: '6. Pensez-vous actuellement que la vie ne vaut pas la peine d\'être vécue ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q12',
    text: '7. Souhaitez-vous actuellement mourir ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q13',
    text: '8. Pensez-vous actuellement à vous donner la mort ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q14',
    text: '9. Envisagez-vous actuellement sérieusement de vous donner la mort ou planifiez-vous la façon de vous y prendre ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q15',
    text: '10. Essayez-vous actuellement de vous donner la mort ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q16',
    text: '11. Avez-vous des raisons de vivre ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 1 }
    ]
  },
  {
    id: 'q17',
    text: '12. Avez-vous des projets pour l\'avenir ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 1 }
    ]
  },
  {
    id: 'q18',
    text: '13. Pensez-vous que vous pourriez vous donner la mort un jour ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q19',
    text: '14. Avez-vous peur de perdre le contrôle et de vous donner la mort ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q20',
    text: '15. Avez-vous peur de mourir ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 0 },
      { code: 0, label: 'Non', score: 1 }
    ]
  },
  {
    id: 'q21',
    text: '16. Pensez-vous que vous pourriez vous donner la mort si vous en aviez l\'occasion ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q22',
    text: '17. Avez-vous déjà écrit une lettre d\'adieu ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q23',
    text: '18. Avez-vous déjà mis de l\'ordre dans vos affaires en prévision de votre mort ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q24',
    text: '19. Avez-vous déjà parlé à quelqu\'un de vos intentions suicidaires ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q25',
    text: '20. Avez-vous déjà pris des dispositions pour votre mort (testament, assurance-vie, etc.) ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q26',
    text: '21. Avez-vous déjà rassemblé les moyens de vous donner la mort (médicaments, arme, etc.) ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q27',
    text: '22. Avez-vous déjà répété mentalement votre geste suicidaire ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q28',
    text: '23. Avez-vous déjà fait des préparatifs concrets pour vous donner la mort ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q29',
    text: '24. Avez-vous déjà commencé à mettre en œuvre votre plan suicidaire ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
    ]
  },
  {
    id: 'q30',
    text: '25. Avez-vous déjà été interrompu dans une tentative de suicide ?',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 }
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

export const ISA_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'isa_sz',
  code: 'ISA_SZ',
  title: 'Intentionnalité Suicidaire Actuelle',
  description: 'Cette échelle doit toujours être administrée, même en cas d\'absence de tentative de suicide avérée.\n\nÉchelle évaluant les pensées, désirs et tentatives de suicide, ainsi que leur temporalité récente ou passée.',
  questions: ISA_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional'
  }
};
