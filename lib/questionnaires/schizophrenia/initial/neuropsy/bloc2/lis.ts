// eFondaMental Platform - LIS (Lecture d'Intentions Sociales)
// Schizophrenia Initial Evaluation - Neuropsy Module - Bloc 2
// Social cognition test assessing theory of mind through film scenarios

import { Question } from '@/lib/types/database.types';
import { LIS_FILMS, LIS_RESPONSE_SCALE } from '@/lib/constants/lis-norms';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaLisResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Film A responses
  lis_a1: number | null;
  lis_a2: number | null;
  lis_a3: number | null;
  lis_a4: number | null;
  lis_a5: number | null;
  // Film B responses
  lis_b1: number | null;
  lis_b2: number | null;
  lis_b3: number | null;
  lis_b4: number | null;
  lis_b5: number | null;
  // Film C responses
  lis_c1: number | null;
  lis_c2: number | null;
  lis_c3: number | null;
  lis_c4: number | null;
  lis_c5: number | null;
  // Film D responses
  lis_d1: number | null;
  lis_d2: number | null;
  lis_d3: number | null;
  lis_d4: number | null;
  lis_d5: number | null;
  // Film E responses
  lis_e1: number | null;
  lis_e2: number | null;
  lis_e3: number | null;
  lis_e4: number | null;
  lis_e5: number | null;
  // Film F responses
  lis_f1: number | null;
  lis_f2: number | null;
  lis_f3: number | null;
  lis_f4: number | null;
  lis_f5: number | null;
  // Computed score
  lis_score: number | null;  // Total deviation from normative values
  // Test status
  test_done: boolean;
  questionnaire_version?: string | null;
  // Metadata
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaLisResponseInsert = Omit<
  SchizophreniaLisResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

// Condition to show questions only when test is done (test_done === 'oui')
const SHOW_WHEN_TEST_DONE = { '==': [{ 'var': 'test_done' }, 'oui'] };

// Response options for all items (1-4 scale)
const LIS_OPTIONS = LIS_RESPONSE_SCALE.options.map(opt => ({
  code: opt.value,
  label: opt.label,
  score: opt.value
}));

// Generate questions from film data
function generateFilmQuestions(): Question[] {
  const questions: Question[] = [];
  
  for (const film of LIS_FILMS) {
    // Section header for the film
    questions.push({
      id: `section_film_${film.filmId.toLowerCase()}`,
      text: `Film ${film.filmId}: ${film.title}`,
      type: 'section',
      required: false,
      display_if: SHOW_WHEN_TEST_DONE
    });
    
    // Question header (instruction)
    questions.push({
      id: `instruction_film_${film.filmId.toLowerCase()}`,
      text: film.question,
      type: 'instruction',
      required: false,
      display_if: SHOW_WHEN_TEST_DONE
    });
    
    // 5 items per film
    for (const item of film.items) {
      questions.push({
        id: item.id,
        text: item.text,
        type: 'single_choice',
        required: true,
        options: LIS_OPTIONS,
        display_if: SHOW_WHEN_TEST_DONE
      });
    }
  }
  
  return questions;
}

export const LIS_SZ_QUESTIONS: Question[] = [
  // Test done option - Select Oui/Non
  {
    id: 'test_done',
    text: 'Test fait',
    type: 'single_choice',
    required: true,
    options: [
      { code: 'oui', label: 'Oui', score: 0 },
      { code: 'non', label: 'Non', score: 1 }
    ]
  },

  // Instructions section
  // {
  //   id: 'section_instructions',
  //   text: 'Instructions',
  //   type: 'section',
  //   required: false,
  //   display_if: SHOW_WHEN_TEST_DONE
  // },
  {
    id: 'instructions_text',
    text: 'Le patient regarde 6 courts extraits de films montrant des situations sociales. Pour chaque extrait, il doit évaluer la probabilité de 5 explications possibles du comportement du personnage principal sur une échelle de 1 (Très peu probable) à 4 (Très probable).',
    type: 'instruction',
    required: false,
    display_if: SHOW_WHEN_TEST_DONE
  },

  // Generate all film questions
  ...generateFilmQuestions()
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
    [key: string]: any;
  };
}

export const LIS_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'lis_sz',
  code: 'LIS_SZ',
  title: 'LIS (Lecture d\'Intentions Sociales)',
  description: 'Test de cognition sociale évaluant la théorie de l\'esprit à travers des scénarios filmés. Les patients évaluent la probabilité de différentes explications pour les comportements des personnages.',
  instructions: 'Le clinicien présente au patient 6 courts extraits de films montrant des situations sociales. Pour chaque extrait, le patient doit évaluer la probabilité de 5 explications possibles du comportement du personnage principal.',
  questions: LIS_SZ_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    reference: 'LIS - Lecture d\'Intentions Sociales - Évaluation de la cognition sociale',
    scoringNote: 'Score = Somme des déviations absolues par rapport aux valeurs normatives. Score bas = meilleure cognition sociale.'
  }
};
