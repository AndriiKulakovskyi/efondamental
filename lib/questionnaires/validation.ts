// eFondaMental Platform - Questionnaire Validation Utilities

import { Question, ValidationResult, QuestionnaireAnswers } from './types';

export function validateAnswers(
  questions: Question[],
  answers: QuestionnaireAnswers,
  visibleQuestionIds: string[] = []
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Use all questions if no visibility list provided
  const questionsToValidate = visibleQuestionIds.length > 0
    ? questions.filter(q => visibleQuestionIds.includes(q.id))
    : questions;

  for (const question of questionsToValidate) {
    const answer = answers[question.id];
    
    // Check required fields
    if (question.required && (answer === undefined || answer === null || answer === '')) {
      errors.push(`La question "${question.text}" est obligatoire.`);
      continue;
    }

    // Skip validation if answer is not provided and not required
    if (answer === undefined || answer === null || answer === '') {
      continue;
    }

    // Type-specific validation
    switch (question.type) {
      case 'single_choice':
        if (question.options) {
          const validCodes = question.options.map(opt => opt.code);
          if (!validCodes.includes(Number(answer))) {
            errors.push(`Réponse invalide pour "${question.text}".`);
          }
        }
        break;

      case 'number':
      case 'scale':
        const numValue = Number(answer);
        if (isNaN(numValue)) {
          errors.push(`La réponse à "${question.text}" doit être un nombre.`);
        } else {
          if (question.min !== undefined && numValue < question.min) {
            errors.push(`La réponse à "${question.text}" doit être au moins ${question.min}.`);
          }
          if (question.max !== undefined && numValue > question.max) {
            errors.push(`La réponse à "${question.text}" ne peut pas dépasser ${question.max}.`);
          }
        }
        break;

      case 'multiple_choice':
        if (!Array.isArray(answer)) {
          errors.push(`La réponse à "${question.text}" doit être un tableau.`);
        }
        break;

      case 'boolean':
        if (typeof answer !== 'boolean') {
          errors.push(`La réponse à "${question.text}" doit être oui ou non.`);
        }
        break;
    }

    // Constraint validation
    if (question.constraints) {
      const { allowed_values, min_value, max_value } = question.constraints;
      
      if (allowed_values && !allowed_values.includes(Number(answer))) {
        errors.push(`Valeur non autorisée pour "${question.text}".`);
      }
      
      if (min_value !== undefined && Number(answer) < min_value) {
        errors.push(`La valeur de "${question.text}" doit être au moins ${min_value}.`);
      }
      
      if (max_value !== undefined && Number(answer) > max_value) {
        errors.push(`La valeur de "${question.text}" ne peut pas dépasser ${max_value}.`);
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export function checkMutualExclusivity(
  answers: QuestionnaireAnswers,
  warningRules?: Array<{
    group: string;
    pairs: Array<{
      items: string[];
      vs: string[];
      warning: string;
    }>;
  }>
): string[] {
  const warnings: string[] = [];

  if (!warningRules) {
    return warnings;
  }

  for (const group of warningRules) {
    for (const pair of group.pairs) {
      const itemsEndorsed = pair.items.some(id => {
        const value = answers[id];
        return value !== undefined && value !== null && value > 0;
      });
      
      const vsEndorsed = pair.vs.some(id => {
        const value = answers[id];
        return value !== undefined && value !== null && value > 0;
      });

      if (itemsEndorsed && vsEndorsed) {
        warnings.push(pair.warning);
      }
    }
  }

  return warnings;
}

export function evaluateCondition(
  condition: any,
  answers: QuestionnaireAnswers
): boolean {
  if (!condition) {
    return true;
  }

  // Simple JSONLogic implementation for our use cases
  // Support for >= and + operations used in MDQ
  if (condition['>=']) {
    const [left, right] = condition['>='];
    const leftValue = evaluateExpression(left, answers);
    const rightValue = evaluateExpression(right, answers);
    return leftValue >= rightValue;
  }

  if (condition['>']) {
    const [left, right] = condition['>'];
    const leftValue = evaluateExpression(left, answers);
    const rightValue = evaluateExpression(right, answers);
    return leftValue > rightValue;
  }

  if (condition['==']) {
    const [left, right] = condition['=='];
    const leftValue = evaluateExpression(left, answers);
    const rightValue = evaluateExpression(right, answers);
    // Use loose equality to handle null/undefined cases but strict for actual values
    if (leftValue === null || leftValue === undefined) {
      return rightValue === null || rightValue === undefined;
    }
    return leftValue === rightValue;
  }

  if (condition['!=']) {
    const [left, right] = condition['!='];
    const leftValue = evaluateExpression(left, answers);
    const rightValue = evaluateExpression(right, answers);
    // Handle null/undefined cases
    if (leftValue === null || leftValue === undefined) {
      return !(rightValue === null || rightValue === undefined);
    }
    return leftValue !== rightValue;
  }

  if (condition['in']) {
    const [value, array] = condition['in'];
    const evaluatedValue = evaluateExpression(value, answers);
    return Array.isArray(array) && array.includes(evaluatedValue);
  }

  if (condition['and']) {
    return condition['and'].every((cond: any) => evaluateCondition(cond, answers));
  }

  if (condition['or']) {
    return condition['or'].some((cond: any) => evaluateCondition(cond, answers));
  }

  return true;
}

function evaluateExpression(expr: any, answers: QuestionnaireAnswers): any {
  if (typeof expr === 'number') {
    return expr;
  }
  
  if (typeof expr === 'string') {
    return expr;
  }

  if (expr['+']) {
    return expr['+'].reduce((sum: number, item: any) => {
      return sum + evaluateExpression(item, answers);
    }, 0);
  }

  if (expr['var']) {
    const varPath = expr['var'];
    // Support for "answers.q1_1" format
    if (varPath.startsWith('answers.')) {
      const key = varPath.substring(8);
      return answers[key] !== undefined ? answers[key] : null;
    }
    return answers[varPath] !== undefined ? answers[varPath] : null;
  }

  return expr;
}

export function getVisibleQuestions(
  questions: Question[],
  answers: QuestionnaireAnswers
): string[] {
  return questions
    .filter(q => !q.display_if || evaluateCondition(q.display_if, answers))
    .map(q => q.id);
}

export function getRequiredQuestions(
  questions: Question[],
  answers: QuestionnaireAnswers,
  visibleQuestionIds: string[]
): string[] {
  return questions
    .filter(q => visibleQuestionIds.includes(q.id))
    .filter(q => {
      if (q.required_if) {
        return evaluateCondition(q.required_if, answers);
      }
      return q.required;
    })
    .map(q => q.id);
}

