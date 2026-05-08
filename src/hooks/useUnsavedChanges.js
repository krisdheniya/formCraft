// hooks/useUnsavedChanges.js — Warn on page leave
import { useEffect } from 'react';

export function useUnsavedChanges(isDirty) {
  useEffect(() => {
    const handler = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);
}
