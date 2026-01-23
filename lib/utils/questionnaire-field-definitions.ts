// ============================================================================
// Questionnaire Field Type Definitions
// ============================================================================
// Maps field names to their expected value types for each questionnaire.
// Used by transformQuestionnaireResponse to normalize form values.
// ============================================================================

import {
  FieldTypeMap,
  generateFamilyMemberFieldTypes,
  generateParentFieldTypes,
  generateGrandparentFieldTypes,
} from './questionnaire-transforms';

// ============================================================================
// FAMILY_HISTORY Field Types
// ============================================================================

export const FAMILY_HISTORY_FIELD_TYPES: FieldTypeMap = {
  // Count fields
  num_daughters: 'string',
  num_daughters_with_issues: 'number',
  num_sons: 'string',
  num_sons_with_issues: 'number',
  num_sisters: 'string',
  num_sisters_with_issues: 'number',
  num_brothers: 'string',
  num_brothers_with_issues: 'number',
  num_maternal_aunts: 'string',
  num_maternal_uncles: 'string',
  num_paternal_aunts: 'string',
  num_paternal_uncles: 'string',
  
  // Daughter fields (1-5)
  ...generateFamilyMemberFieldTypes('daughter', 5),
  
  // Son fields (1-5)
  ...generateFamilyMemberFieldTypes('son', 5),
  
  // Sister fields (1-5)
  ...generateFamilyMemberFieldTypes('sister', 5),
  
  // Brother fields (1-5)
  ...generateFamilyMemberFieldTypes('brother', 5),
  
  // Parent fields
  ...generateParentFieldTypes('mother'),
  ...generateParentFieldTypes('father'),
  
  // Grandparent fields
  ...generateGrandparentFieldTypes('grandmother_maternal'),
  ...generateGrandparentFieldTypes('grandfather_maternal'),
  ...generateGrandparentFieldTypes('grandmother_paternal'),
  ...generateGrandparentFieldTypes('grandfather_paternal'),
  
  // Simplified grandparent psychiatric fields (used in some versions)
  maternal_grandmother_psychiatric: 'string',
  maternal_grandfather_psychiatric: 'string',
  paternal_grandmother_psychiatric: 'string',
  paternal_grandfather_psychiatric: 'string',
  
  // JSONB field for dynamic data
  family_members_data: 'pass_through',
  
  // Metadata
  visit_id: 'pass_through',
  patient_id: 'pass_through',
  completed_by: 'pass_through',
};

// ============================================================================
// SLEEP_APNEA Field Types
// ============================================================================

export const SLEEP_APNEA_FIELD_TYPES: FieldTypeMap = {
  // Diagnosis fields
  diagnosed_sleep_apnea: 'string', // 'yes', 'no', 'unknown'
  has_cpap_device: 'yes_no',
  
  // STOP-Bang criteria (all yes/no)
  snoring: 'yes_no',
  tiredness: 'yes_no',
  observed_apnea: 'yes_no',
  hypertension: 'yes_no',
  bmi_over_35: 'yes_no',
  age_over_50: 'yes_no',
  large_neck: 'yes_no',
  male_gender: 'yes_no',
  
  // Computed fields (pass through)
  stop_bang_score: 'number',
  risk_level: 'string',
  interpretation: 'string',
  
  // Metadata
  visit_id: 'pass_through',
  patient_id: 'pass_through',
  completed_by: 'pass_through',
};

// ============================================================================
// DIVA Field Types
// ============================================================================

// Generate DIVA symptom field types
function generateDivaFieldTypes(): FieldTypeMap {
  const fields: FieldTypeMap = {};
  
  // Inattention symptoms (a1a through a1i)
  const letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
  for (const letter of letters) {
    fields[`a1${letter}_adult`] = 'yes_no';
    fields[`a1${letter}_childhood`] = 'yes_no';
  }
  
  // Hyperactivity symptoms (a2a through a2i)
  for (const letter of letters) {
    fields[`a2${letter}_adult`] = 'yes_no';
    fields[`a2${letter}_childhood`] = 'yes_no';
  }
  
  // Criteria fields
  fields['criteria_a_inattention_child_gte6'] = 'yes_no';
  fields['criteria_hi_hyperactivity_child_gte6'] = 'yes_no';
  fields['criteria_a_inattention_adult_gte6'] = 'yes_no';
  fields['criteria_hi_hyperactivity_adult_gte6'] = 'yes_no';
  fields['criteria_b_lifetime_persistence'] = 'yes_no';
  fields['criteria_cd_impairment_childhood'] = 'yes_no';
  fields['criteria_cd_impairment_adult'] = 'yes_no';
  fields['criteria_e_better_explained'] = 'yes_no';
  
  // Computed fields
  fields['total_inattention_adult'] = 'number';
  fields['total_inattention_childhood'] = 'number';
  fields['total_hyperactivity_adult'] = 'number';
  fields['total_hyperactivity_childhood'] = 'number';
  fields['adhd_subtype'] = 'string';
  fields['interpretation'] = 'string';
  
  // Metadata
  fields['visit_id'] = 'pass_through';
  fields['patient_id'] = 'pass_through';
  fields['completed_by'] = 'pass_through';
  
  return fields;
}

export const DIVA_FIELD_TYPES: FieldTypeMap = generateDivaFieldTypes();

// ============================================================================
// CSSRS Field Types
// ============================================================================

export const CSSRS_FIELD_TYPES: FieldTypeMap = {
  // Suicidal ideation questions (stored as INTEGER 0/1 in DB after migration 123)
  q1_wish_dead: 'integer_0_1',
  q2_non_specific: 'integer_0_1',
  q3_method_no_intent: 'integer_0_1',
  q4_intent_no_plan: 'integer_0_1',
  q5_plan_intent: 'integer_0_1',
  
  // Intensity of ideation (1-5 scale)
  int_most_severe: 'number',
  int_frequency: 'number',
  int_duration: 'number',
  int_control: 'number',
  int_deterrents: 'number',
  int_causes: 'number',
  
  // Metadata
  visit_id: 'pass_through',
  patient_id: 'pass_through',
  completed_by: 'pass_through',
};

// ============================================================================
// DSM5_COMORBID Field Types
// ============================================================================

export const DSM5_COMORBID_FIELD_TYPES: FieldTypeMap = {
  // Eating disorder fields (converted from BOOLEAN to enum in migrations 282-284)
  anorexia_bulimic_amenorrhea: 'yes_no_maybe',
  anorexia_bulimic_current: 'yes_no_maybe',
  anorexia_restrictive_amenorrhea: 'yes_no_maybe',
  anorexia_restrictive_current: 'yes_no_maybe',
  binge_eating_current: 'yes_no_maybe',
  bulimia_current: 'yes_no_maybe',
  
  // DIVA evaluation trigger
  diva_evaluated: 'yes_no_maybe',
  
  // Other comorbidity fields
  anxiety_panic: 'yes_no_maybe',
  anxiety_agoraphobia: 'yes_no_maybe',
  anxiety_social: 'yes_no_maybe',
  anxiety_specific_phobia: 'yes_no_maybe',
  anxiety_gad: 'yes_no_maybe',
  anxiety_ocd: 'yes_no_maybe',
  anxiety_ptsd: 'yes_no_maybe',
  
  // Metadata
  visit_id: 'pass_through',
  patient_id: 'pass_through',
  completed_by: 'pass_through',
};

// ============================================================================
// TOBACCO Field Types
// ============================================================================

export const TOBACCO_FIELD_TYPES: FieldTypeMap = {
  smoking_status: 'string', // 'never_smoker', 'ex_smoker', 'current_smoker'
  has_substitution: 'yes_no',
  has_substitution_ex: 'yes_no',
  substitution_type: 'string',
  cigarettes_per_day: 'number',
  years_smoking: 'number',
  quit_date: 'date',
  
  // Metadata
  visit_id: 'pass_through',
  patient_id: 'pass_through',
  completed_by: 'pass_through',
};

// ============================================================================
// Questionnaire Field Types Registry
// ============================================================================

export const QUESTIONNAIRE_FIELD_TYPES: Record<string, FieldTypeMap> = {
  'FAMILY_HISTORY': FAMILY_HISTORY_FIELD_TYPES,
  'SLEEP_APNEA': SLEEP_APNEA_FIELD_TYPES,
  'DIVA': DIVA_FIELD_TYPES,
  'CSSRS': CSSRS_FIELD_TYPES,
  'DSM5_COMORBID': DSM5_COMORBID_FIELD_TYPES,
  'TOBACCO': TOBACCO_FIELD_TYPES,
};

/**
 * Get field types for a questionnaire by code
 */
export function getQuestionnaireFieldTypes(questionnaireCode: string): FieldTypeMap | null {
  return QUESTIONNAIRE_FIELD_TYPES[questionnaireCode] || null;
}
