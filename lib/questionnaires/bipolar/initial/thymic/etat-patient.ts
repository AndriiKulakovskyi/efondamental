// eFondaMental Platform - ETAT_PATIENT (DSM-IV Symptoms)
// Bipolar Initial Evaluation - Thymic Module

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface BipolarEtatPatientResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  // Depressive symptoms
  q1: number | null;
  q1_subjective: number | null;
  q2: number | null;
  q3: number | null;
  q3_type: number | null;
  q4: number | null;
  q4_type: number | null;
  q5: number | null;
  q5_type: number | null;
  q6: number | null;
  q7: number | null;
  q8: number | null;
  q8_type: number | null;
  q9: number | null;
  // Manic symptoms
  q10: number | null;
  q11: number | null;
  q12: number | null;
  q13: number | null;
  q14: number | null;
  q15: number | null;
  q16: number | null;
  q17: number | null;
  q18: number | null;
  // Scores
  depressive_count: number | null;
  manic_count: number | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type BipolarEtatPatientResponseInsert = Omit<
  BipolarEtatPatientResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'depressive_count' | 'manic_count' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Questions Dictionary
// ============================================================================

export const ETAT_PATIENT_QUESTIONS: Question[] = [
  // Section: Depressive Symptoms
  {
    id: 'section_dep',
    text: 'SYMPTOMES DEPRESSIFS ACTUELS',
    type: 'section',
    required: false
  },
  {
    id: 'q1',
    text: 'Humeur depressive la majeure partie de la journee',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q1_subjective',
    text: 'Impression subjective de :',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q1' }, 1] },
    options: [
      { code: 1, label: 'Hyper-reactivite emotionnelle', score: 1 },
      { code: 2, label: 'Hypo-reactivite ou d\'anesthesie', score: 2 },
      { code: 0, label: 'Aucune des deux', score: 0 }
    ]
  },
  {
    id: 'q2',
    text: 'Diminution marquee d\'interet ou de plaisir dans toutes ou presque les activites habituelles, presque toute la journee',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q3',
    text: 'Perte ou gain de poids significatif, ou diminution ou augmentation de l\'appetit',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q3_type',
    text: 'preciser :',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q3' }, 1] },
    options: [
      { code: 1, label: 'Perte', score: 1 },
      { code: 2, label: 'Gain', score: 2 }
    ]
  },
  {
    id: 'q4',
    text: 'Insomnie ou hypersomnie',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q4_type',
    text: 'Preciser :',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q4' }, 1] },
    options: [
      { code: 1, label: 'Insomnie', score: 1 },
      { code: 2, label: 'Hypersomnie', score: 2 }
    ]
  },
  {
    id: 'q5',
    text: 'Agitation ou ralentissement psychomoteur',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q5_type',
    text: 'Preciser :',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q5' }, 1] },
    options: [
      { code: 1, label: 'Agitation', score: 1 },
      { code: 2, label: 'Ralentissement', score: 2 }
    ]
  },
  {
    id: 'q6',
    text: 'Fatigue ou perte d\'energie',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q7',
    text: 'Sentiment de devalorisation ou de culpabilite excessive ou inappropriee',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q8',
    text: 'Diminution de l\'aptitude a penser ou se concentrer ou indecision chaque jour',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q8_type',
    text: 'Impression de :',
    type: 'single_choice',
    required: false,
    display_if: { '==': [{ 'var': 'answers.q8' }, 1] },
    options: [
      { code: 1, label: 'Acceleration ideique', score: 1 },
      { code: 2, label: 'Ralentissement ideique', score: 2 }
    ]
  },
  {
    id: 'q9',
    text: 'Pensees recurrentes de mort, ideation suicidaire recurrente sans plan specifique, ou tentative de suicide ou plan precis pour se suicider',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  // Section: Manic Symptoms
  {
    id: 'section_man',
    text: 'SYMPTOMES MANIAQUES ACTUELS',
    type: 'section',
    required: false
  },
  {
    id: 'q10',
    text: 'Humeur elevee, expansive',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q11',
    text: 'Humeur irritable',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q12',
    text: 'Augmentation de l\'estime de soi ou idees de grandeur',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q13',
    text: 'Reduction du besoin de sommeil',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q14',
    text: 'Plus grande communicabilite que d\'habitude ou desir de parler constamment',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q15',
    text: 'Fuite des idees ou sensation subjective que les pensees defilent',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q16',
    text: 'Distractibilite : l\'attention du sujet etant trop facilement attiree par des stimuli exterieurs sans pertinence',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q17',
    text: 'Activite dirigee vers un but : augmentation de l\'activite ou agitation psychomotrice',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
    ]
  },
  {
    id: 'q18',
    text: 'Engagement excessif dans des activites agreables mais a potentiel eleve de consequences dommageables',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: 'Oui', score: 1 },
      { code: 0, label: 'Non', score: 0 },
      { code: 9, label: 'Ne sais pas', score: 9 }
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

export const ETAT_PATIENT_DEFINITION: QuestionnaireDefinition = {
  id: 'etat_patient',
  code: 'ETAT_PATIENT',
  title: 'ETAT DU PATIENT (DSM-IV Symptoms)',
  description: 'Liste de controle des symptomes depressifs et maniaques selon le DSM-IV, a remplir quel que soit l\'etat thymique du patient.',
  questions: ETAT_PATIENT_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['bipolar'],
    target_role: 'healthcare_professional',
    version: '1.0',
    language: 'fr-FR'
  }
};

// ============================================================================
// Score Computation
// ============================================================================

export interface EtatPatientScoreInput {
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
}

export function computeEtatPatientCounts(responses: EtatPatientScoreInput): {
  depressive_count: number;
  manic_count: number;
} {
  // Count "Yes" (1) responses for depressive symptoms (q1-q9)
  const depressiveItems = [responses.q1, responses.q2, responses.q3, responses.q4, 
                          responses.q5, responses.q6, responses.q7, responses.q8, responses.q9];
  const depressiveCount = depressiveItems.filter(v => v === 1).length;

  // Count "Yes" (1) responses for manic symptoms (q10-q18)
  const manicItems = [responses.q10, responses.q11, responses.q12, responses.q13, 
                      responses.q14, responses.q15, responses.q16, responses.q17, responses.q18];
  const manicCount = manicItems.filter(v => v === 1).length;

  return { depressive_count: depressiveCount, manic_count: manicCount };
}

// ============================================================================
// Score Interpretation
// ============================================================================

export function interpretEtatPatient(depressiveCount: number, manicCount: number): string {
  let interpretation = `Symptomes depressifs presents: ${depressiveCount}/9. Symptomes maniaques presents: ${manicCount}/9.`;

  if (depressiveCount >= 5 && manicCount >= 3) {
    interpretation += ' Episode mixte possible.';
  } else if (depressiveCount >= 5) {
    interpretation += ' Episode depressif possible.';
  } else if (manicCount >= 3) {
    interpretation += ' Episode maniaque/hypomaniaque possible.';
  } else {
    interpretation += ' Etat euthymique ou symptomes subsyndromiques.';
  }

  return interpretation;
}

// ============================================================================
// Combined Scoring Function
// ============================================================================

export interface EtatPatientScoringResult {
  depressive_count: number;
  manic_count: number;
  interpretation: string;
}

export function scoreEtatPatient(responses: EtatPatientScoreInput): EtatPatientScoringResult {
  const { depressive_count, manic_count } = computeEtatPatientCounts(responses);
  const interpretation = interpretEtatPatient(depressive_count, manic_count);

  return {
    depressive_count,
    manic_count,
    interpretation
  };
}
