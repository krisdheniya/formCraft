// store/initialState.js — Default empty form state
import { generateId } from '../utils/idGenerator.js';
import { loadFromLocalStorage } from '../utils/localStorageUtils.js';

export function createEmptyForm() {
  const headerId = generateId();
  return {
    id: generateId(),
    title: 'Untitled Form',
    description: '',
    version: 1,
    rootQuestionIds: [headerId],
    questions: {
      [headerId]: {
        id: headerId,
        parentId: null,
        order: 0,
        type: 'section_header',
        text: 'Untitled Form',
        description: '',
        required: false,
        childIds: [],
        metadata: {
          collapsed: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export const initialState = createEmptyForm();

// Used as 3rd arg of useReducer — runs once to load from localStorage
export function initializeState(defaultState) {
  return loadFromLocalStorage(defaultState);
}
