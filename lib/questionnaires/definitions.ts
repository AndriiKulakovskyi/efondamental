// eFondaMental Platform - Centralized Questionnaire Definitions
// New unified architecture - replaces scattered constants

import { Question } from '@/lib/types/database.types';

export interface QuestionnaireMetadata {
  singleColumn?: boolean;
  pathologies?: string[];
  target_role?: 'patient' | 'healthcare_professional';
  version?: string;
  language?: string;
  conditional_on?: {
    questionnaire_code: string;
    field: string;
    values: string[];
  };
  [key: string]: any;
}

export interface QuestionnaireDefinition {
  id: string;
  code: string;
  title: string;
  description: string;
  instructions?: string;
  questions: Question[];
  metadata?: QuestionnaireMetadata;
}
