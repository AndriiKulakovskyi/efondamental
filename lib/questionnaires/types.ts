// eFondaMental Platform - Shared Questionnaire Types
// Reusable types for auto and hetero questionnaires across pathologies

export interface QuestionOption {
  code: number;
  label: string;
  score?: number;
}

export interface Question {
  id: string;
  section_id: string;
  text: string;
  type: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'scale' | 'boolean' | 'date' | 'instruction';
  required: boolean;
  options?: QuestionOption[];
  constraints?: {
    value_type?: string;
    min_value?: number;
    max_value?: number;
    allowed_values?: number[];
  };
  help?: string;
  scoring_group_id?: string;
  scoring_aggregation?: 'max' | 'sum' | 'direct';
  display_if?: any; // JSONLogic condition
  required_if?: any; // JSONLogic condition
  min?: number;
  max?: number;
  minLabel?: string;
  maxLabel?: string;
  indentLevel?: number; // For visual indentation of branching questions
}

export interface Section {
  id: string;
  label: string;
  description: string;
  question_ids: string[];
}

export interface QuestionnaireMetadata {
  id: string;
  code: string;
  name: string;
  abbreviation: string;
  language: string;
  version: string;
  reference_period: string;
  description: string;
  sources?: string[];
  notes?: string[];
  total_questions: number;
  scoring_range?: [number, number];
  cutoff?: number;
  target_role: 'patient' | 'healthcare_professional';
  pathologies?: string[];
}

export interface ScoringDomain {
  id: string;
  label: string;
  items: string[];
  aggregation: 'max' | 'sum' | 'direct';
  description: string;
  range: [number, number];
  rationale?: string;
}

export interface ScoringRules {
  schema_version: string;
  type: 'mutually_exclusive_groups' | 'simple_sum' | 'conditional';
  description: string;
  domains?: ScoringDomain[];
  direct_items?: Array<{
    id: string;
    label: string;
    aggregation: string;
  }>;
  total: {
    formula: string;
    formula_expanded?: string;
    range: [number, number];
    description: string;
  };
  policies?: {
    missing: string;
    missing_policy_description: string;
    ties?: string;
    ties_description?: string;
  };
  validation?: {
    check_mutual_exclusivity?: boolean;
    warning_if_both_endorsed?: Array<{
      group: string;
      pairs: Array<{
        items: string[];
        vs: string[];
        warning: string;
      }>;
    }>;
  };
  interpretation_thresholds?: Record<string, [number, number]>;
}

export interface BranchingLogic {
  schema_version: string;
  type: 'answer_dependent';
  description: string;
  rules: Array<{
    rule_id: string;
    question_id: string;
    rule_type: 'display' | 'required';
    condition: any; // JSONLogic condition
    description: string;
    action_if_true: string;
    action_if_false: string;
  }>;
  context_variables?: Record<string, any>;
  fallback_behavior?: Record<string, any>;
  scoring_impact?: Record<string, any>;
}

export interface ScoreResult {
  total_score: number;
  severity?: string;
  probability?: string;
  domain_scores?: Record<string, number>;
  interpretation: string;
  range: [number, number];
  clinical_alerts?: string[];
}

export interface ScreeningResult {
  q1_total?: number;
  q2_concurrent?: boolean;
  q3_impact_level?: number;
  q3_impact_label?: string;
  screening_result: string;
  interpretation: string;
  clinical_alerts?: string[];
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export interface QuestionnaireDefinition {
  metadata: QuestionnaireMetadata;
  sections: Section[];
  questions: Question[];
  scoring_rules?: ScoringRules;
  branching_logic?: BranchingLogic;
}

export type QuestionnaireAnswers = Record<string, any>;

