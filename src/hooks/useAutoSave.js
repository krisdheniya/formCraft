// hooks/useAutoSave.js — Debounced localStorage persistence
import { useEffect, useRef } from 'react';
import { saveToLocalStorage } from '../utils/localStorageUtils.js';

export function useAutoSave(state, onSave) {
  const timerRef = useRef(null);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      const success = saveToLocalStorage(stateRef.current);
      if (onSave) onSave(success);
    }, 800);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps
}
