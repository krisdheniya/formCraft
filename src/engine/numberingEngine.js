// engine/numberingEngine.js — Generates Q1, Q1.1, Q1.1.1 number map

/**
 * Generate a map of { questionId → number string }
 * e.g. { q1: "1", q1_1: "1.1", q1_1_1: "1.1.1" }
 */
export function generateNumberMap(questions, rootIds, prefix = '') {
  const result = {};

  rootIds.forEach((id, index) => {
    const number = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
    result[id] = number;

    const question = questions[id];
    if (question?.childIds?.length) {
      const childNumbers = generateNumberMap(questions, question.childIds, number);
      Object.assign(result, childNumbers);
    }
  });

  return result;
}
