// eFondaMental Platform - Client-Safe Questionnaire Logic
// These functions can be used in both client and server components

import { Questionnaire } from '../types/database.types';

// ============================================================================
// CONDITIONAL LOGIC EVALUATION
// ============================================================================

export function evaluateConditionalLogic(
  questionnaire: Questionnaire,
  responses: Record<string, any>
): {
  visibleQuestions: string[];
  requiredQuestions: string[];
  subQuestionnaires: string[];
} {
  const visibleQuestions: string[] = [];
  const requiredQuestions: string[] = [];
  const subQuestionnaires: string[] = [];

  // Start with all questions visible
  questionnaire.questions.forEach((q) => {
    visibleQuestions.push(q.id);
    if (q.required) {
      requiredQuestions.push(q.id);
    }
  });

  if (!questionnaire.conditional_logic?.rules) {
    return { visibleQuestions, requiredQuestions, subQuestionnaires };
  }

  // Evaluate each rule
  for (const rule of questionnaire.conditional_logic.rules) {
    const { condition, action } = rule;
    const responseValue = responses[condition.questionId];

    let conditionMet = false;

    switch (condition.operator) {
      case 'equals':
        conditionMet = responseValue === condition.value;
        break;
      case 'not_equals':
        conditionMet = responseValue !== condition.value;
        break;
      case 'greater_than':
        conditionMet = Number(responseValue) > Number(condition.value);
        break;
      case 'less_than':
        conditionMet = Number(responseValue) < Number(condition.value);
        break;
      case 'contains':
        conditionMet =
          Array.isArray(responseValue) &&
          responseValue.includes(condition.value);
        break;
    }

    if (conditionMet) {
      switch (action.type) {
        case 'show_question':
          if (action.questionId && !visibleQuestions.includes(action.questionId)) {
            visibleQuestions.push(action.questionId);
          }
          break;
        case 'hide_question':
          if (action.questionId) {
            const index = visibleQuestions.indexOf(action.questionId);
            if (index > -1) {
              visibleQuestions.splice(index, 1);
            }
          }
          break;
        case 'show_subquestionnaire':
          if (action.questionnaire) {
            subQuestionnaires.push(action.questionnaire);
          }
          break;
        case 'required':
          if (action.questionId && !requiredQuestions.includes(action.questionId)) {
            requiredQuestions.push(action.questionId);
          }
          break;
      }
    }
  }

  return { visibleQuestions, requiredQuestions, subQuestionnaires };
}

// ============================================================================
// RESPONSE VALIDATION
// ============================================================================

export function validateQuestionnaireResponse(
  questionnaire: Questionnaire,
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
      errors.push(`${question?.text || questionId} is required`);
    }
  }

  // Validate question types
  for (const question of questionnaire.questions) {
    if (!visibleQuestions.includes(question.id)) continue;

    const response = responses[question.id];
    if (response === undefined || response === null) continue;

    switch (question.type) {
      case 'number':
        if (isNaN(Number(response))) {
          errors.push(`${question.text} must be a number`);
        }
        if (question.min !== undefined && Number(response) < question.min) {
          errors.push(`${question.text} must be at least ${question.min}`);
        }
        if (question.max !== undefined && Number(response) > question.max) {
          errors.push(`${question.text} must be at most ${question.max}`);
        }
        break;

      case 'single_choice':
        if (question.options && !question.options.includes(response)) {
          errors.push(`${question.text} has an invalid option`);
        }
        break;

      case 'multiple_choice':
        if (question.options && Array.isArray(response)) {
          const invalidOptions = response.filter(
            (r) => !question.options?.includes(r)
          );
          if (invalidOptions.length > 0) {
            errors.push(`${question.text} has invalid options`);
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

