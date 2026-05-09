// engine/numberingEngine.js — Generates Q1, Q1.1, Q1.1.1 number map

/**
 * Generate a map of { questionId → number string }
 * e.g. { q1: "1", q1_1: "1.1", q1_1_1: "1.1.1" }
 */
export function generateNumberMap(questions, rootIds, prefix = '') {
  const result = {};
  let counter = 0;

  rootIds.forEach((id) => {
    const question = questions[id];
    
    if (question?.type === 'section_header') {
      if (question?.childIds?.length) {
        const childNumbers = generateNumberMap(questions, question.childIds, prefix);
        Object.assign(result, childNumbers);
      }
      return;
    }

    counter++;
    const number = prefix ? `${prefix}.${counter}` : `${counter}`;
    result[id] = number;

    if (question?.childIds?.length) {
      const childNumbers = generateNumberMap(questions, question.childIds, number);
      Object.assign(result, childNumbers);
    }
  });

  return result;
}
