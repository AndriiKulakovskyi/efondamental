// eFondaMental Platform - Perinatalite (Schizophrenia)
// Perinatal history assessment

import { Question } from '@/lib/types/database.types';

// ============================================================================
// Types
// ============================================================================

export interface SchizophreniaPerinataliteResponse {
  id: string;
  visit_id: string;
  patient_id: string;
  q1_mother_age?: number | null;
  q2_father_age?: number | null;
  q3_birth_condition?: 'premature' | 'term' | 'post_mature' | 'unknown' | null;
  q4_gestational_age?: number | null;
  q5_birth_type?: 'vaginal' | 'cesarean' | 'unknown' | null;
  q6_birth_weight?: number | null;
  q7_neonatal_hospitalization?: 'yes' | 'no' | 'unknown' | null;
  q8_birth_environment?: 'urbain' | 'rural' | 'unknown' | null;
  q9_obstetric_complications?: 'yes' | 'no' | 'unknown' | null;
  q10_maternal_viral_infection?: 'yes' | 'no' | 'unknown' | null;
  q11_maternal_pregnancy_events?: string[] | null;
  completed_by?: string | null;
  completed_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type SchizophreniaPerinataliteResponseInsert = Omit<
  SchizophreniaPerinataliteResponse,
  'id' | 'created_at' | 'updated_at' | 'completed_at'
>;

// ============================================================================
// Questions
// ============================================================================

export const SZ_PERINATALITE_QUESTIONS: Question[] = [
  {
    id: 'q1_mother_age',
    text: 'Age de la mere a la naissance (en annees)',
    type: 'number',
    required: false,
    min: 10,
    max: 60
  },
  {
    id: 'q2_father_age',
    text: 'Age du pere a la naissance (en annees)',
    type: 'number',
    required: false,
    min: 10,
    max: 80
  },
  {
    id: 'q3_birth_condition',
    text: 'Naissance',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'premature', label: 'Prematurite', score: 0 },
      { code: 'term', label: 'Ne a terme', score: 0 },
      { code: 'post_mature', label: 'Post-maturite', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q4_gestational_age',
    text: 'L\'age gestationnel (en semaines d\'amenorrhee et revolues)',
    type: 'number',
    required: false,
    min: 22,
    max: 45
  },
  {
    id: 'q5_birth_type',
    text: 'Type de naissance',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'vaginal', label: 'Voie basse', score: 0 },
      { code: 'cesarean', label: 'Cesarienne', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q6_birth_weight',
    text: 'Poids de naissance (en grammes)',
    type: 'number',
    required: false,
    min: 300,
    max: 6000
  },
  {
    id: 'q7_neonatal_hospitalization',
    text: 'Hospitalisation en neonatologie',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui', score: 1 },
      { code: 'no', label: 'Non', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q8_birth_environment',
    text: 'Etes-vous ne dans un milieu',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'urbain', label: 'Urbain', score: 0 },
      { code: 'rural', label: 'Rural', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q9_obstetric_complications',
    text: 'Y a-t-il eu des complications obstetricales a votre naissance',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui', score: 1 },
      { code: 'no', label: 'Non', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q10_maternal_viral_infection',
    text: 'Votre mere a-t-elle eu une infection virale pendant sa grossesse',
    type: 'single_choice',
    required: false,
    options: [
      { code: 'yes', label: 'Oui', score: 1 },
      { code: 'no', label: 'Non', score: 0 },
      { code: 'unknown', label: 'Ne sais pas', score: 0 }
    ]
  },
  {
    id: 'q11_maternal_pregnancy_events',
    text: 'Votre mere a-t-elle vecu un ou plusieurs de ces evenements au cours de sa grossesse ?',
    type: 'multiple_choice',
    required: false,
    options: [
      { code: 'deces_proche', label: 'Deces d\'un proche', score: 1 },
      { code: 'perte_travail', label: 'Perte du travail', score: 1 },
      { code: 'perte_travail_conjoint', label: 'Perte de travail du conjoint', score: 1 },
      { code: 'separation_divorce', label: 'Separation/divorce', score: 1 },
      { code: 'probleme_couple', label: 'Probleme de couple', score: 1 },
      { code: 'difficultes_enfants', label: 'Difficultes avec ses enfants', score: 1 },
      { code: 'probleme_argent', label: 'Probleme d\'argent', score: 1 },
      { code: 'probleme_grossesse', label: 'Probleme lie a la grossesse', score: 1 },
      { code: 'demenagement', label: 'Demenagement', score: 1 },
      { code: 'aucun', label: 'Aucun', score: 0 }
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

export const SZ_PERINATALITE_DEFINITION: QuestionnaireDefinition = {
  id: 'perinatalite_sz',
  code: 'PERINATALITE_SZ',
  title: 'Perinatalite',
  description: 'Recueil des informations perinatales et des conditions de naissance du patient.',
  questions: SZ_PERINATALITE_QUESTIONS,
  metadata: {
    singleColumn: true,
    pathologies: ['schizophrenia'],
    target_role: 'healthcare_professional',
    version: '1.0',
    language: 'fr-FR'
  }
};
