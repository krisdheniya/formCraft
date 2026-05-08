// engine/dependencyEngine.js — Evaluates visibility rules

export function evaluateDependencyRule(rule, formAnswers) {
  if (!rule || !rule.conditions || rule.conditions.length === 0) return true;

  const results = rule.conditions.map((condition) =>
    evaluateCondition(condition, formAnswers[condition.parentQuestionId])
  );

  return rule.logic === 'AND'
    ? results.every(Boolean)
    : results.some(Boolean);
}

function evaluateCondition(condition, answer) {
  switch (condition.operator) {
    case 'equals':
      // Handle boolean comparison from string "true"/"false"
      if (typeof condition.value === 'string' && (condition.value === 'true' || condition.value === 'false')) {
        return answer === (condition.value === 'true');
      }
      return String(answer) === String(condition.value);
    case 'not_equals':
      return String(answer) !== String(condition.value);
    case 'contains':
      return typeof answer === 'string' && answer.includes(String(condition.value));
    case 'greater_than':
      return Number(answer) > Number(condition.value);
    case 'less_than':
      return Number(answer) < Number(condition.value);
    case 'is_answered':
      return answer !== undefined && answer !== null && answer !== '';
    default:
      return true;
  }
}
