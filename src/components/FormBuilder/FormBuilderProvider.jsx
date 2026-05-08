// components/FormBuilder/FormBuilderProvider.jsx — Context + Reducer provider
import React, { useReducer } from 'react';
import { FormBuilderContext } from './FormBuilderContext.js';
import { formReducer } from '../../store/formReducer.js';
import { initialState, initializeState } from '../../store/initialState.js';
import { useAutoSave } from '../../hooks/useAutoSave.js';

export function FormBuilderProvider({ children }) {
  const [state, dispatch] = useReducer(formReducer, initialState, initializeState);

  // Auto-save debounced to localStorage on every state change
  useAutoSave(state);

  return (
    <FormBuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </FormBuilderContext.Provider>
  );
}
