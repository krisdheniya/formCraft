// hooks/useNumbering.js — Compute question numbers
import { useMemo } from 'react';
import { useFormBuilder } from './useFormBuilder.js';
import { generateNumberMap } from '../engine/numberingEngine.js';

export function useNumbering() {
  const { state } = useFormBuilder();
  return useMemo(
    () => generateNumberMap(state.questions, state.rootQuestionIds),
    [state.questions, state.rootQuestionIds]
  );
}
