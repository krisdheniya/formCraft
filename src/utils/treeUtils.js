// utils/treeUtils.js — find, update, delete, flatten tree operations

/**
 * Collect all descendant IDs of a question recursively.
 */
export function collectAllDescendantIds(questions, questionId, collected = new Set()) {
  const question = questions[questionId];
  if (!question) return collected;

  question.childIds.forEach((childId) => {
    collected.add(childId);
    collectAllDescendantIds(questions, childId, collected);
  });

  return collected;
}

/**
 * Check if targetId is a descendant of ancestorId.
 */
export function isDescendant(questions, ancestorId, targetId) {
  const ancestor = questions[ancestorId];
  if (!ancestor) return false;
  if (ancestor.childIds.includes(targetId)) return true;
  return ancestor.childIds.some((childId) => isDescendant(questions, childId, targetId));
}

/**
 * Flatten the entire tree into a list of { id, depth, number } entries.
 */
export function flattenTree(questions, rootIds, prefix = '', depth = 0) {
  const result = [];
  rootIds.forEach((id, index) => {
    const number = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
    result.push({ id, depth, number });
    const q = questions[id];
    if (q?.childIds?.length) {
      result.push(...flattenTree(questions, q.childIds, number, depth + 1));
    }
  });
  return result;
}

/**
 * Count all descendants of a question.
 */
export function countDescendants(questions, questionId) {
  return collectAllDescendantIds(questions, questionId).size;
}

/**
 * Check if adding question B as child of question A would create a circular dependency
 * (i.e., A is already a descendant of B).
 */
export function wouldCreateCycle(questions, parentId, newChildId) {
  return isDescendant(questions, newChildId, parentId);
}

/**
 * Transitively check if questionA depends on questionB
 * (follows dependencyRule.conditions).
 */
export function transitivelyDependsOn(questions, questionId, targetId) {
  const visited = new Set();
  function check(id) {
    if (visited.has(id)) return false;
    visited.add(id);
    const q = questions[id];
    if (!q?.dependencyRule) return false;
    for (const cond of q.dependencyRule.conditions) {
      if (cond.parentQuestionId === targetId) return true;
      if (check(cond.parentQuestionId)) return true;
    }
    return false;
  }
  return check(questionId);
}
