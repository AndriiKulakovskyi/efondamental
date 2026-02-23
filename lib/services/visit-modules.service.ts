import { QuestionnaireStatus } from './visit-detail.service';
import { VirtualModule } from './visit.service';

export interface ConditionalDescriptor {
  dependsOn?: string;
  dependsOnAny?: string[];
  field: string;
  requiredValue: any;
  notAnsweredMessage: string;
  notMetMessage: string;
}

/**
 * Enriches bare modules from getVisitModules() with completion status and
 * conditional state resolved from runtime data.
 *
 * Pure function — does not mutate inputs.
 */
export function enrichModulesWithStatus(
  modules: VirtualModule[],
  questionnaireStatuses: Record<string, QuestionnaireStatus>,
  conditionalResponses: Record<string, any>
): VirtualModule[] {
  return modules.map(mod => ({
    ...mod,
    questionnaires: mod.questionnaires?.map(q =>
      enrichQuestionnaire(q, questionnaireStatuses, conditionalResponses)
    ),
    sections: mod.sections?.map(sec => ({
      ...sec,
      questionnaires: sec.questionnaires.map(q =>
        enrichQuestionnaire(q, questionnaireStatuses, conditionalResponses)
      ),
    })),
  }));
}

function enrichQuestionnaire(
  q: any,
  statuses: Record<string, QuestionnaireStatus>,
  conditionalResponses: Record<string, any>
): any {
  const code = q.code;
  const status = statuses[code];
  const enriched: any = {
    ...q,
    completed: status?.completed || false,
    completedAt: status?.completed_at ?? null,
  };

  if (!q.conditional) return enriched;

  const cond: ConditionalDescriptor = q.conditional;

  if (cond.dependsOnAny) {
    return resolveOrCondition(enriched, cond, conditionalResponses);
  }

  return resolveSingleCondition(enriched, cond, conditionalResponses);
}

function resolveSingleCondition(
  enriched: any,
  cond: ConditionalDescriptor,
  conditionalResponses: Record<string, any>
): any {
  const depResponse = conditionalResponses[cond.dependsOn!];
  const depAnswered = !!depResponse;

  enriched.isConditional = true;

  if (!depAnswered) {
    enriched.conditionMet = false;
    enriched.conditionMessage = cond.notAnsweredMessage;
    enriched.completed = false;
    enriched.completedAt = null;
  } else if (fieldMatches(depResponse[cond.field], cond.requiredValue)) {
    enriched.conditionMet = true;
  } else {
    enriched.conditionMet = false;
    enriched.conditionMessage = cond.notMetMessage;
    enriched.completed = false;
    enriched.completedAt = null;
  }

  return enriched;
}

function resolveOrCondition(
  enriched: any,
  cond: ConditionalDescriptor,
  conditionalResponses: Record<string, any>
): any {
  const deps = cond.dependsOnAny!;
  const anyAnswered = deps.some(key => !!conditionalResponses[key]);
  const anyAccepted = deps.some(key => {
    const resp = conditionalResponses[key];
    return resp && fieldMatches(resp[cond.field], cond.requiredValue);
  });

  enriched.isConditional = true;

  if (!anyAnswered) {
    enriched.conditionMet = false;
    enriched.conditionMessage = cond.notAnsweredMessage;
    enriched.completed = false;
    enriched.completedAt = null;
  } else if (anyAccepted) {
    enriched.conditionMet = true;
  } else {
    enriched.conditionMet = false;
    enriched.conditionMessage = cond.notMetMessage;
    enriched.completed = false;
    enriched.completedAt = null;
  }

  return enriched;
}

function fieldMatches(actual: any, expected: any): boolean {
  if (expected === true) return !!actual;
  return actual === expected;
}
