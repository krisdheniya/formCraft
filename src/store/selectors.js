// store/selectors.js — Memoized state selectors

export const selectQuestion = (state, id) => state.questions[id];

export const selectChildren = (state, id) =>
  state.questions[id]?.childIds.map((childId) => state.questions[childId]).filter(Boolean) ?? [];

export const selectRootQuestions = (state) =>
  state.rootQuestionIds.map((id) => state.questions[id]).filter(Boolean);

export const selectFormMeta = (state) => ({
  id: state.id,
  title: state.title,
  description: state.description,
  version: state.version,
  createdAt: state.createdAt,
  updatedAt: state.updatedAt,
});

export const selectAllQuestions = (state) => Object.values(state.questions);

export const selectQuestionCount = (state) => Object.keys(state.questions).length;
