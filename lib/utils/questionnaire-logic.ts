// eFondaMental Platform - Client-Safe Questionnaire Logic
// These functions can be used in both client and server components

import { QuestionnaireDefinition } from '@/lib/constants/questionnaires';
import { Question } from '@/lib/types/database.types';
import { evaluateCondition as evaluateJSONLogicCondition } from '@/lib/questionnaires/validation';

// ============================================================================
// CONDITIONAL LOGIC EVALUATION
// ============================================================================

/**
 * Evaluate visibility condition for a question based on visibleWhen property
 */
function evaluateVisibleWhen(
  visibleWhen: Question['visibleWhen'],
  responses: Record<string, any>
): boolean {
  if (!visibleWhen) return true;
  
  // Check if it's a simple condition or compound condition
  if ('field' in visibleWhen) {
    // Simple condition
    const value = responses[visibleWhen.field];
    if (visibleWhen.condition === 'isNotEmpty') {
      return value !== undefined && value !== null && value !== '';
    }
  } else if ('operator' in visibleWhen) {
    // Compound condition with operator
    const results = visibleWhen.conditions.map(cond => {
      const value = responses[cond.field];
      if (cond.condition === 'isNotEmpty') {
        return value !== undefined && value !== null && value !== '';
      }
      return false;
    });
    
    if (visibleWhen.operator === 'and') {
      return results.every(r => r);
    } else if (visibleWhen.operator === 'or') {
      return results.some(r => r);
    }
  }
  
  return true;
}

export function evaluateConditionalLogic(
  questionnaire: QuestionnaireDefinition,
  responses: Record<string, any>
): {
  visibleQuestions: string[];
  requiredQuestions: string[];
} {
  const visibleQuestions: string[] = [];
  const requiredQuestions: string[] = [];

  // Evaluate display_if and visibleWhen conditions for each question
  questionnaire.questions.forEach((q) => {
    // Check display_if (JSONLogic) - if no display_if, default is visible
    let isVisible = !q.display_if || evaluateJSONLogicCondition(q.display_if, responses);
    
    // Additionally check visibleWhen (simple conditions)
    if (isVisible && q.visibleWhen) {
      isVisible = evaluateVisibleWhen(q.visibleWhen, responses);
    }
    
    if (isVisible) {
      visibleQuestions.push(q.id);
      
      // Check if required - either static or conditional
      let isRequired = q.required;
      if (q.required_if) {
        isRequired = evaluateJSONLogicCondition(q.required_if, responses);
      }
      
      if (isRequired) {
        requiredQuestions.push(q.id);
      }
    }
  });

  return { visibleQuestions, requiredQuestions };
}

// ============================================================================
// RESPONSE VALIDATION
// ============================================================================

export function validateQuestionnaireResponse(
  questionnaire: QuestionnaireDefinition,
  responses: Record<string, any>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  const { visibleQuestions, requiredQuestions } = evaluateConditionalLogic(
    questionnaire,
    responses
  );

  // Check required questions
  for (const questionId of requiredQuestions) {
    if (
      visibleQuestions.includes(questionId) &&
      (responses[questionId] === undefined ||
        responses[questionId] === null ||
        responses[questionId] === '')
    ) {
      const question = questionnaire.questions.find((q) => q.id === questionId);
      errors.push(`${question?.text || questionId} est obligatoire`);
    }
  }

  // Validate question types
  for (const question of questionnaire.questions) {
    if (!visibleQuestions.includes(question.id)) continue;
    
    // Skip validation for readonly fields (they're computed/auto-filled)
    if (question.readonly) continue;

    const response = responses[question.id];
    if (response === undefined || response === null || response === '') continue;

    switch (question.type) {
      case 'number':
        if (isNaN(Number(response))) {
          errors.push(`${question.text} doit être un nombre`);
        }
        if (question.min !== undefined && Number(response) < question.min) {
          errors.push(`${question.text} doit être au moins ${question.min}`);
        }
        if (question.max !== undefined && Number(response) > question.max) {
          errors.push(`${question.text} doit être au plus ${question.max}`);
        }
        break;

      case 'single_choice':
        if (question.options) {
          // Handle both string options and object options {code, label, score}
          const validValues = question.options.map(opt => 
            typeof opt === 'string' ? opt : opt.code
          );
          // Relax check to allow string/number mismatch if loosely equal
          if (!validValues.some(v => v == response)) {
             // Strict check might fail if form submits "1" but option is 1.
             // Let's double check logic.
             // Renderer handles value changes.
             // validValues might be strings or numbers.
             // response might be string or number.
             // Let's trust standard comparison or lenient check.
             errors.push(`${question.text} a une option invalide`);
          }
        }
        break;

      case 'multiple_choice':
        if (question.options && Array.isArray(response)) {
          const validValues = question.options.map(opt => 
            typeof opt === 'string' ? opt : opt.code
          );
          const invalidOptions = response.filter(
            (r) => !validValues.some(v => v == r)
          );
          if (invalidOptions.length > 0) {
            errors.push(`${question.text} a des options invalides`);
          }
        }
        break;
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// ============================================================================
// PROGRESS CALCULATION
// ============================================================================

/**
 * Calculate questionnaire progress percentage
 * Handles conditional questions, unit fields, and section visibility
 * 
 * @param questions - Array of questions to calculate progress for
 * @param responses - Current response values
 * @param visibleQuestions - Array of question IDs that are currently visible
 * @returns Progress percentage (0-100)
 */
export function calculateQuestionnaireProgress(
  questions: Question[],
  responses: Record<string, any>,
  visibleQuestions: string[]
): number {
  // Filter to non-section, visible questions only
  // Exclude unit fields from the count (they're paired with their base field)
  const relevantQuestions = questions.filter(
    q => q.type !== 'section' && 
         visibleQuestions.includes(q.id) &&
         !q.id.endsWith('_unit')
  );
  
  if (relevantQuestions.length === 0) return 100;
  
  // Count completed questions
  let completed = 0;
  for (const q of relevantQuestions) {
    const value = responses[q.id];
    
    // Check if this question has a corresponding unit field
    const unitFieldId = `${q.id}_unit`;
    const hasUnitField = questions.some(sq => sq.id === unitFieldId);
    
    if (hasUnitField) {
      // Both base and unit must be filled
      const unitValue = responses[unitFieldId];
      if (value !== undefined && value !== null && value !== '' &&
          unitValue !== undefined && unitValue !== null && unitValue !== '') {
        completed++;
      }
    } else {
      // Regular question - just check if it has a value
      if (value !== undefined && value !== null && value !== '') {
        completed++;
      }
    }
  }
  
  return Math.round((completed / relevantQuestions.length) * 100);
}
