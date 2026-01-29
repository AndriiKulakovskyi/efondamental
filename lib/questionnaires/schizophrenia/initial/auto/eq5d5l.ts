// eFondaMental Platform - EQ-5D-5L (EuroQol 5D-5L)
// Schizophrenia Initial Evaluation - Autoquestionnaire Module
// Reference: Herdman M, Gudex C, Lloyd A, et al. Development and preliminary testing of the new five-level version of EQ-5D (EQ-5D-5L). Qual Life Res. 2011;20(10):1727-1736.
// French value set: Andrade LF, Ludwig K, Goni JMR, Oppe M, de Pouvourville G. A French Value Set for the EQ-5D-5L. Pharmacoeconomics. 2020;38(4):413-425.

import { Question, QuestionnaireDefinition } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaEq5d5lResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  questionnaire_done?: string;
  mobility: number;
  self_care: number;
  usual_activities: number;
  pain_discomfort: number;
  anxiety_depression: number;
  vas_score: number;
  health_state: string | null;
  index_value: number | null;
  interpretation: string | null;
  completed_by: string | null;
  completed_at: string;
  created_at: string;
  updated_at: string;
}

export type SchizophreniaEq5d5lResponseInsert = Omit<
  SchizophreniaEq5d5lResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at' | 'health_state' | 'index_value' | 'interpretation'
> & {
  completed_by?: string | null;
};

// ============================================================================
// Score Result Type
// ============================================================================

export interface Eq5d5lSzScoreResult {
  health_state: string;
  index_value: number;
  vas_score: number;
  interpretation: string;
}

// ============================================================================
// Scoring Functions
// ============================================================================

/**
 * Compute 5-digit health state profile from dimension responses
 */
export function computeHealthStateSz(responses: {
  mobility: number;
  self_care: number;
  usual_activities: number;
  pain_discomfort: number;
  anxiety_depression: number;
}): string {
  return `${responses.mobility}${responses.self_care}${responses.usual_activities}${responses.pain_discomfort}${responses.anxiety_depression}`;
}

/**
 * Generate interpretation text for EQ-5D-5L scores
 */
export function interpretEq5d5lSz(
  healthState: string,
  indexValue: number,
  vasScore: number
): string {
  let interpretation = `Profil de santé: ${healthState}. `;
  interpretation += `Score EVA: ${vasScore}/100. `;
  interpretation += `Index d'utilité (France): ${indexValue.toFixed(3)}. `;
  
  // Health state interpretation
  if (healthState === '11111') {
    interpretation += 'État de santé optimal (aucun problème dans les 5 dimensions). ';
  } else if (healthState === '55555') {
    interpretation += 'État de santé le plus défavorable (problèmes extrêmes dans toutes les dimensions). ';
  } else {
    // Count dimensions with problems
    const problemCount = healthState.split('').filter(d => d !== '1').length;
    interpretation += `${problemCount} dimension(s) avec problèmes rapportés. `;
  }
  
  // Index value interpretation
  if (indexValue >= 0.8) {
    interpretation += 'Qualité de vie élevée. ';
  } else if (indexValue >= 0.5) {
    interpretation += 'Qualité de vie modérée. ';
  } else if (indexValue >= 0) {
    interpretation += 'Qualité de vie altérée. ';
  } else {
    interpretation += 'État de santé considéré comme pire que la mort. ';
  }
  
  // VAS interpretation
  if (vasScore >= 80) {
    interpretation += 'Perception subjective très favorable de l\'état de santé.';
  } else if (vasScore >= 50) {
    interpretation += 'Perception subjective modérée de l\'état de santé.';
  } else {
    interpretation += 'Perception subjective défavorable de l\'état de santé.';
  }
  
  return interpretation;
}

// ============================================================================
// Questions Dictionary
// ============================================================================

export const EQ5D5L_SZ_QUESTIONS: Question[] = [
  // Instruction
  {
    id: 'instruction_consigne',
    text: 'Veuillez indiquer, pour chacune des rubriques suivantes, l\'affirmation qui décrit le mieux votre état de santé AUJOURD\'HUI, en cochant la case appropriée.',
    type: 'section',
    required: false
  },
  // Dimension 1: Mobilité
  {
    id: 'mobility',
    text: 'Mobilité',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: "Je n'ai aucun problème pour me déplacer à pied", score: 1 },
      { code: 2, label: "J'ai des problèmes légers pour me déplacer à pied", score: 2 },
      { code: 3, label: "J'ai des problèmes modérés pour me déplacer à pied", score: 3 },
      { code: 4, label: "J'ai des problèmes sévères pour me déplacer à pied", score: 4 },
      { code: 5, label: "Je suis incapable de me déplacer à pied", score: 5 }
    ]
  },
  // Dimension 2: Autonomie
  {
    id: 'self_care',
    text: 'Autonomie de la personne',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: "Je n'ai aucun problème pour me laver ou m'habiller tout seul", score: 1 },
      { code: 2, label: "J'ai des problèmes légers pour me laver ou m'habiller tout seul", score: 2 },
      { code: 3, label: "J'ai des problèmes modérés pour me laver ou m'habiller tout seul", score: 3 },
      { code: 4, label: "J'ai des problèmes sévères pour me laver ou m'habiller tout seul", score: 4 },
      { code: 5, label: "Je suis incapable de me laver ou de m'habiller tout(e) seul(e)", score: 5 }
    ]
  },
  // Dimension 3: Activités courantes
  {
    id: 'usual_activities',
    text: 'Activités courantes (exemples : travail, études, travaux domestiques, activités familiales ou loisirs)',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: "Je n'ai aucun problème pour accomplir mes activités courantes", score: 1 },
      { code: 2, label: "J'ai des problèmes légers pour accomplir mes activités courantes", score: 2 },
      { code: 3, label: "J'ai des problèmes modérés pour accomplir mes activités courantes", score: 3 },
      { code: 4, label: "J'ai des problèmes sévères pour accomplir mes activités courantes", score: 4 },
      { code: 5, label: "Je suis incapable d'accomplir mes activités courantes", score: 5 }
    ]
  },
  // Dimension 4: Douleurs, gêne
  {
    id: 'pain_discomfort',
    text: 'Douleurs, gêne',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: "Je n'ai ni douleur, ni gêne", score: 1 },
      { code: 2, label: "J'ai des douleurs ou une gêne légère(s)", score: 2 },
      { code: 3, label: "J'ai des douleurs ou une gêne modérée(s)", score: 3 },
      { code: 4, label: "J'ai des douleurs ou une gêne sévère(s)", score: 4 },
      { code: 5, label: "J'ai des douleurs ou une gêne extrême(s)", score: 5 }
    ]
  },
  // Dimension 5: Anxiété, dépression
  {
    id: 'anxiety_depression',
    text: 'Anxiété, dépression',
    type: 'single_choice',
    required: true,
    options: [
      { code: 1, label: "Je ne suis ni anxieux(se), ni déprimé(e)", score: 1 },
      { code: 2, label: "Je suis légèrement anxieux(se) ou déprimé(e)", score: 2 },
      { code: 3, label: "Je suis modérément anxieux(se) ou déprimé(e)", score: 3 },
      { code: 4, label: "Je suis sévèrement anxieux(se) ou déprimé(e)", score: 4 },
      { code: 5, label: "Je suis extrêmement anxieux(se) ou déprimé(e)", score: 5 }
    ]
  },
  // VAS Section
  {
    id: 'section_vas',
    text: 'Échelle Visuelle Analogique (EVA)',
    type: 'section',
    required: false
  },
  // VAS Score
  {
    id: 'vas_score',
    text: 'Nous aimerions savoir dans quelle mesure votre santé est bonne ou mauvaise AUJOURD\'HUI. Indiquez sur l\'échelle ci-dessous votre état de santé aujourd\'hui.',
    type: 'number',
    required: true,
    min: 0,
    max: 100,
    help: 'Cette échelle est numérotée de 0 à 100. 100 correspond au meilleur état de santé que vous puissiez imaginer. 0 correspond au pire état de santé que vous puissiez imaginer.'
  }
];

// ============================================================================
// Questionnaire Definition
// ============================================================================

export const EQ5D5L_SZ_DEFINITION: QuestionnaireDefinition = {
  id: 'eq5d5l_sz',
  code: 'EQ5D5L_SZ',
  title: 'EQ-5D-5L - Qualité de vie',
  description: 'L\'EQ-5D-5L est un instrument standardisé de mesure de la qualité de vie liée à la santé développé par le groupe EuroQol. Il comprend deux composantes : un système descriptif (5 dimensions, 5 niveaux chacune) et une échelle visuelle analogique (EVA) de l\'état de santé.',
  questions: EQ5D5L_SZ_QUESTIONS,
  metadata: {
    pathologies: ['schizophrenia'],
    target_role: 'patient',
    version: '5L',
    language: 'fr-FR',
    singleColumn: true,
    reference: 'Herdman M, Gudex C, Lloyd A, et al. Development and preliminary testing of the new five-level version of EQ-5D (EQ-5D-5L). Qual Life Res. 2011;20(10):1727-1736.',
    value_set: 'French value set (Andrade et al., 2020)'
  }
};
