// hooks/useFormBuilder.js — Access context + dispatch
import { useContext } from 'react';
import { FormBuilderContext } from '../components/FormBuilder/FormBuilderContext.js';

export function useFormBuilder() {
  const ctx = useContext(FormBuilderContext);
  if (!ctx) throw new Error('useFormBuilder must be used inside FormBuilderProvider');
  return ctx;
}
