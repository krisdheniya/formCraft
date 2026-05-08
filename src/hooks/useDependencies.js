// hooks/useDependencies.js — Evaluate which questions are visible
import { useMemo } from 'react';
import { useFormBuilder } from './useFormBuilder.js';
import { evaluateDependencyRule } from '../engine/dependencyEngine.js';

export function useQuestionVisibility(questionId, answers) {
  const { state } = useFormBuilder();
  const question = state.questions[questionId];
  return useMemo(
    () => evaluateDependencyRule(question?.dependencyRule, answers),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [question?.dependencyRule, answers]
  );
}
