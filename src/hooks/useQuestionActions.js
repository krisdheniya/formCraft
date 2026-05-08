// hooks/useQuestionActions.js — Typed action creators
import { useCallback } from 'react';
import { useFormBuilder } from './useFormBuilder.js';
import { FormActions } from '../store/actions.js';

export function useQuestionActions() {
  const { dispatch } = useFormBuilder();

  const addQuestion = useCallback(
    (parentId, type = 'short_answer') =>
      dispatch({ type: FormActions.ADD_QUESTION, payload: { parentId, type } }),
    [dispatch]
  );

  const deleteQuestion = useCallback(
    (id) => dispatch({ type: FormActions.DELETE_QUESTION, payload: { id } }),
    [dispatch]
  );

  const updateQuestion = useCallback(
    (id, changes) =>
      dispatch({ type: FormActions.UPDATE_QUESTION, payload: { id, changes } }),
    [dispatch]
  );

  const reorderQuestions = useCallback(
    (parentId, newOrder) =>
      dispatch({ type: FormActions.REORDER_QUESTIONS, payload: { parentId, newOrder } }),
    [dispatch]
  );

  const toggleCollapse = useCallback(
    (id) => dispatch({ type: FormActions.TOGGLE_COLLAPSE, payload: { id } }),
    [dispatch]
  );

  const setDependency = useCallback(
    (id, dependencyRule) =>
      dispatch({ type: FormActions.SET_DEPENDENCY, payload: { id, dependencyRule } }),
    [dispatch]
  );

  const removeDependency = useCallback(
    (id) => dispatch({ type: FormActions.REMOVE_DEPENDENCY, payload: { id } }),
    [dispatch]
  );

  const setFormMeta = useCallback(
    (meta) => dispatch({ type: FormActions.SET_FORM_META, payload: meta }),
    [dispatch]
  );

  const loadForm = useCallback(
    (form) => dispatch({ type: FormActions.LOAD_FORM, payload: { form } }),
    [dispatch]
  );

  const clearForm = useCallback(
    () => dispatch({ type: FormActions.CLEAR_FORM }),
    [dispatch]
  );

  return {
    addQuestion,
    deleteQuestion,
    updateQuestion,
    reorderQuestions,
    toggleCollapse,
    setDependency,
    removeDependency,
    setFormMeta,
    loadForm,
    clearForm,
  };
}
