// ============================================================================
// Questionnaire Response Transformation Utilities
// ============================================================================
// Centralized functions for normalizing form values before database storage.
// This ensures consistent handling of yes/no values across all questionnaires.
// ============================================================================

/**
 * Value types for questionnaire fields
 */
export type YesNoValue = 'oui' | 'non' | null;
export type YesNoMaybeValue = 'oui' | 'non' | 'ne_sais_pas' | null;

/**
 * Field type definitions for questionnaire transformations
 */
export type FieldType = 'yes_no' | 'yes_no_maybe' | 'integer_0_1' | 'string' | 'number' | 'array' | 'date' | 'pass_through';

export interface FieldDefinition {
  name: string;
  type: FieldType;
}

export type FieldTypeMap = Record<string, FieldType>;

/**
 * Normalize a value to 'oui' | 'non' | null
 * Handles various input formats: boolean, string ('oui', 'non', 'yes', 'no', 'Oui', 'Non'), numbers (0, 1)
 */
export function normalizeYesNoValue(value: unknown): YesNoValue {
  if (value === null || value === undefined || value === '') return null;
  
  // Boolean values
  if (value === true) return 'oui';
  if (value === false) return 'non';
  
  // String values (case-insensitive)
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    if (lower === 'oui' || lower === 'yes' || lower === 'true' || lower === '1') return 'oui';
    if (lower === 'non' || lower === 'no' || lower === 'false' || lower === '0') return 'non';
  }
  
  // Numeric values
  if (typeof value === 'number') {
    if (value === 1) return 'oui';
    if (value === 0) return 'non';
  }
  
  return null;
}

/**
 * Normalize a value to 'oui' | 'non' | 'ne_sais_pas' | null
 * Extends normalizeYesNoValue to include "don't know" option
 */
export function normalizeYesNoMaybeValue(value: unknown): YesNoMaybeValue {
  if (value === null || value === undefined || value === '') return null;
  
  // Check for "don't know" values first
  if (typeof value === 'string') {
    const lower = value.toLowerCase().trim();
    if (lower === 'ne_sais_pas' || lower === 'nsp' || lower === "don't know" || lower === 'unknown') {
      return 'ne_sais_pas';
    }
  }
  
  // Fall back to yes/no normalization
  const yesNo = normalizeYesNoValue(value);
  return yesNo;
}

/**
 * Transform a questionnaire response object based on field type definitions
 * 
 * @param response - The raw response object from the form
 * @param fieldTypes - Map of field names to their expected types
 * @returns Transformed response with normalized values
 */
export function transformQuestionnaireResponse(
  response: Record<string, unknown>,
  fieldTypes: FieldTypeMap
): Record<string, unknown> {
  const transformed: Record<string, unknown> = {};
  
  for (const [key, value] of Object.entries(response)) {
    const fieldType = fieldTypes[key];
    
    if (!fieldType || fieldType === 'pass_through') {
      // No transformation defined, pass through as-is
      transformed[key] = value;
      continue;
    }
    
    switch (fieldType) {
      case 'yes_no':
        transformed[key] = normalizeYesNoValue(value);
        break;
        
      case 'yes_no_maybe':
        transformed[key] = normalizeYesNoMaybeValue(value);
        break;
        
      case 'integer_0_1':
        // Convert to integer 0/1 (for database columns that use INTEGER instead of VARCHAR)
        // Used by CSSRS which stores boolean-like values as 0/1
        if (value === null || value === undefined || value === '') {
          transformed[key] = null;
        } else if (value === 1 || value === '1' || value === 'oui' || value === 'yes' || value === true) {
          transformed[key] = 1;
        } else if (value === 0 || value === '0' || value === 'non' || value === 'no' || value === false) {
          transformed[key] = 0;
        } else {
          transformed[key] = null;
        }
        break;
        
      case 'string':
        transformed[key] = value !== null && value !== undefined ? String(value) : null;
        break;
        
      case 'number':
        if (value === null || value === undefined || value === '') {
          transformed[key] = null;
        } else if (typeof value === 'number') {
          transformed[key] = value;
        } else {
          const num = Number(value);
          transformed[key] = isNaN(num) ? null : num;
        }
        break;
        
      case 'array':
        if (Array.isArray(value)) {
          transformed[key] = value;
        } else if (value === null || value === undefined) {
          transformed[key] = null;
        } else {
          // Try to parse as JSON array
          try {
            const parsed = JSON.parse(String(value));
            transformed[key] = Array.isArray(parsed) ? parsed : [value];
          } catch {
            transformed[key] = [value];
          }
        }
        break;
        
      case 'date':
        if (value === null || value === undefined || value === '') {
          transformed[key] = null;
        } else if (value instanceof Date) {
          transformed[key] = value.toISOString().split('T')[0];
        } else {
          transformed[key] = String(value);
        }
        break;
        
      default:
        transformed[key] = value;
    }
  }
  
  return transformed;
}

/**
 * Generate field types for family member fields (daughters, sons, sisters, brothers)
 * Each family member has a set of common fields with specific types
 */
export function generateFamilyMemberFieldTypes(prefix: string, count: number): FieldTypeMap {
  const fields: FieldTypeMap = {};
  
  for (let i = 1; i <= count; i++) {
    const p = `${prefix}${i}`;
    
    // Yes/no fields (now yes_no_fr ENUM)
    fields[`${p}_has_issues`] = 'yes_no';
    fields[`${p}_deceased`] = 'yes_no';
    
    // Yes/no/maybe fields (yes_no_unknown_fr ENUM)
    fields[`${p}_anxiety`] = 'yes_no_maybe';
    fields[`${p}_dementia`] = 'yes_no_maybe';
    
    // String enum fields
    fields[`${p}_psychiatric`] = 'string';
    fields[`${p}_suicide`] = 'string';
    
    // Array fields
    fields[`${p}_substance`] = 'array';
    fields[`${p}_cardio`] = 'array';
    
    // Date fields
    fields[`${p}_dob`] = 'date';
    fields[`${p}_death_date`] = 'date';
    
    // Text fields
    fields[`${p}_death_cause`] = 'string';
  }
  
  return fields;
}

/**
 * Generate field types for parent fields (mother, father)
 * _deceased is yes_no_fr ENUM, _history/_anxiety/_dementia are yes_no_unknown_fr ENUM
 */
export function generateParentFieldTypes(prefix: string): FieldTypeMap {
  return {
    [`${prefix}_history`]: 'yes_no_maybe',
    [`${prefix}_deceased`]: 'yes_no',
    [`${prefix}_death_cause`]: 'string',
    [`${prefix}_psychiatric`]: 'string',
    [`${prefix}_suicide`]: 'string',
    [`${prefix}_substance`]: 'array',
    [`${prefix}_anxiety`]: 'yes_no_maybe',
    [`${prefix}_dementia`]: 'yes_no_maybe',
    [`${prefix}_cardio`]: 'array',
  };
}

/**
 * Generate field types for grandparent fields
 * _deceased is yes_no_fr ENUM, _history/_anxiety/_dementia are yes_no_unknown_fr ENUM
 */
export function generateGrandparentFieldTypes(prefix: string): FieldTypeMap {
  return {
    [`${prefix}_history`]: 'yes_no_maybe',
    [`${prefix}_deceased`]: 'yes_no',
    [`${prefix}_death_cause`]: 'string',
    [`${prefix}_psychiatric`]: 'string',
    [`${prefix}_suicide`]: 'string',
    [`${prefix}_substance`]: 'array',
    [`${prefix}_anxiety`]: 'yes_no_maybe',
    [`${prefix}_dementia`]: 'yes_no_maybe',
    [`${prefix}_cardio`]: 'array',
  };
}
