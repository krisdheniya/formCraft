// utils/localStorageUtils.js — Safe read/write with error handling
import { STORAGE_KEY, SCHEMA_VERSION } from './constants.js';

export function saveToLocalStorage(form) {
  try {
    const payload = JSON.stringify({ version: SCHEMA_VERSION, data: form });
    localStorage.setItem(STORAGE_KEY, payload);
    return true;
  } catch (e) {
    console.warn('Auto-save failed:', e);
    return false;
  }
}

export function loadFromLocalStorage(defaultState) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;

    const parsed = JSON.parse(raw);

    if (parsed.version !== SCHEMA_VERSION) {
      console.warn('Schema version mismatch — starting fresh');
      localStorage.removeItem(STORAGE_KEY);
      return defaultState;
    }

    if (!isValidFormSchema(parsed.data)) {
      console.warn('Corrupted form data in localStorage — starting fresh');
      localStorage.removeItem(STORAGE_KEY);
      return defaultState;
    }

    return parsed.data;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return defaultState;
  }
}

export function clearLocalStorage() {
  localStorage.removeItem(STORAGE_KEY);
}

function isValidFormSchema(data) {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    Array.isArray(data.rootQuestionIds) &&
    typeof data.questions === 'object'
  );
}
