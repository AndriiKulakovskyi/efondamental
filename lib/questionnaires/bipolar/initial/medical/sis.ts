// eFondaMental Platform - SIS (Suicide Intent Scale)
// Bipolar Initial Evaluation - Medical Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarSisResponse {
  id: string;
  visit_id: string;
  patient_id: string;
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
  objective_score: number | null;
  subjective_score: number | null;
  total_score: number | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarSisResponseInsert = Omit<
  BipolarSisResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'objective_score' | 'subjective_score' | 'total_score' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const SIS_QUESTIONS: Question[] = [
  // Part 1: Objective Circumstances
  {
    id: 'section_objective',
    text: 'Partie 1: Circonstances Objectives',
    type: 'section',
    required: false
  },
  {
    id: 'q1',
    text: '1. Isolement',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Quelqu\'un etait present', score: 0 },
      { code: 1, label: '1 - Quelqu\'un a proximite ou en contact', score: 1 },
      { code: 2, label: '2 - Personne a proximite ou en contact', score: 2 }
    ]
  },
  {
    id: 'q2',
    text: '2. Timing',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Une intervention est probable', score: 0 },
      { code: 1, label: '1 - Une intervention est improbable', score: 1 },
      { code: 2, label: '2 - Une intervention est hautement improbable', score: 2 }
    ]
  },
  {
    id: 'q3',
    text: '3. Precautions prises contre la decouverte/intervention',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Aucune precaution', score: 0 },
      { code: 1, label: '1 - Precautions passives', score: 1 },
      { code: 2, label: '2 - Precautions actives', score: 2 }
    ]
  },
  {
    id: 'q4',
    text: '4. Fait d\'avoir agi pour obtenir de l\'aide pendant ou apres la tentative',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - A averti un tiers qui pourrait apporter de l\'aide', score: 0 },
      { code: 1, label: '1 - A contacte mais n\'a pas specifiquement demande d\'aide', score: 1 },
      { code: 2, label: '2 - N\'a contacte ni averti personne', score: 2 }
    ]
  },
  {
    id: 'q5',
    text: '5. Dispositions finales anticipant la mort',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Aucune', score: 0 },
      { code: 1, label: '1 - A pense a ces dispositions ou pris quelques dispositions', score: 1 },
      { code: 2, label: '2 - A fait des projets definitifs ou pris des dispositions completes', score: 2 }
    ]
  },
  {
    id: 'q6',
    text: '6. Preparation active a la tentative',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Aucune', score: 0 },
      { code: 1, label: '1 - Minimale a moderee', score: 1 },
      { code: 2, label: '2 - Considerable', score: 2 }
    ]
  },
  {
    id: 'q7',
    text: '7. Note de suicide',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Absence de note', score: 0 },
      { code: 1, label: '1 - Note ecrite mais dechiree ou jetee', score: 1 },
      { code: 2, label: '2 - Presence d\'une note', score: 2 }
    ]
  },
  {
    id: 'q8',
    text: '8. Communication orale',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Pas de communication', score: 0 },
      { code: 1, label: '1 - Communication ambigue', score: 1 },
      { code: 2, label: '2 - Communication sans equivoque', score: 2 }
    ]
  },

  // Part 2: Self-Report
  {
    id: 'section_subjective',
    text: 'Partie 2: Auto-evaluation',
    type: 'section',
    required: false
  },
  {
    id: 'q9',
    text: '9. Objectif supposee de la tentative',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Manipuler l\'environnement, attirer l\'attention, se venger', score: 0 },
      { code: 1, label: '1 - Composantes des precedents avec des composantes de 2', score: 1 },
      { code: 2, label: '2 - Echapper, resoudre un probleme, en finir', score: 2 }
    ]
  },
  {
    id: 'q10',
    text: '10. Attentes concernant la letalite',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Pensait que la mort etait improbable', score: 0 },
      { code: 1, label: '1 - Pensait que la mort etait possible mais pas certaine', score: 1 },
      { code: 2, label: '2 - Pensait que la mort etait probable ou certaine', score: 2 }
    ]
  },
  {
    id: 'q11',
    text: '11. Conception de la letalite de la methode',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - A fait moins que ce qu\'il pensait etre letal', score: 0 },
      { code: 1, label: '1 - N\'etait pas sur que ce serait letal', score: 1 },
      { code: 2, label: '2 - Etait convaincu que ce serait letal', score: 2 }
    ]
  },
  {
    id: 'q12',
    text: '12. Serieux de la tentative',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - N\'a pas serieusement essaye de mettre fin a ses jours', score: 0 },
      { code: 1, label: '1 - Incertain s\'il a serieusement essaye', score: 1 },
      { code: 2, label: '2 - A serieusement essaye de mettre fin a ses jours', score: 2 }
    ]
  },
  {
    id: 'q13',
    text: '13. Attitude concernant le fait de vivre/mourir',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Ne voulait pas mourir', score: 0 },
      { code: 1, label: '1 - Composantes des deux', score: 1 },
      { code: 2, label: '2 - Voulait mourir', score: 2 }
    ]
  },
  {
    id: 'q14',
    text: '14. Conception du sauvetage medical',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Pensait que la mort serait improbable si des soins medicaux etaient donnes', score: 0 },
      { code: 1, label: '1 - Etait incertain si la mort pouvait etre empechee par des soins medicaux', score: 1 },
      { code: 2, label: '2 - Etait convaincu que la mort ne pouvait etre empechee par des soins medicaux', score: 2 }
    ]
  },
  {
    id: 'q15',
    text: '15. Degre de premeditation',
    type: 'single_choice',
    required: true,
    options: [
      { code: 0, label: '0 - Aucune, impulsif', score: 0 },
      { code: 1, label: '1 - Contemplation moins d\'une heure', score: 1 },
      { code: 2, label: '2 - Contemplation moins d\'un jour', score: 2 },
      { code: 3, label: '3 - Contemplation plus d\'un jour', score: 3 }
    ]
  }
];

// ============================================================================
// Scoring
// ============================================================================

export function computeSisScores(responses: Record<string, number>): { objective: number; subjective: number; total: number } {
  let objective = 0;
  let subjective = 0;
  
  // Objective items: q1-q8
  for (let i = 1; i <= 8; i++) {
    const value = responses[`q${i}`];
    if (typeof value === 'number') {
      objective += value;
    }
  }
  
  // Subjective items: q9-q15
  for (let i = 9; i <= 15; i++) {
    const value = responses[`q${i}`];
    if (typeof value === 'number') {
      subjective += value;
    }
  }
  
  return {
    objective,
    subjective,
    total: objective + subjective
  };
}

export function interpretSisScore(total: number): string {
  if (total <= 10) return 'Intention suicidaire faible';
  if (total <= 20) return 'Intention suicidaire moderee';
  return 'Intention suicidaire elevee';
}

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

export const SIS_DEFINITION: QuestionnaireDefinition = {
  id: 'sis',
  code: 'SIS',
  title: 'SIS (Suicide Intent Scale)',
  description: 'Echelle d\'intention suicidaire de Beck.',
  questions: SIS_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional'
  }
};
