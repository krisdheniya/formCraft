// store/formReducer.js — Pure reducer function
import { FormActions } from './actions.js';
import { initialState, createEmptyForm } from './initialState.js';
import { generateId } from '../utils/idGenerator.js';
import { collectAllDescendantIds, wouldCreateCycle } from '../utils/treeUtils.js';
import { TYPES_WITH_CHILDREN } from '../utils/constants.js';

function createQuestion(parentId, type) {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    parentId: parentId ?? null,
    order: 0,
    type: type || 'short_answer',
    text: '',
    description: '',
    placeholder: 
      type === 'phone' ? '9876543210' : 
      type === 'email' ? 'krish@infollion.com' : 
      type === 'short_answer' ? 'Krish' : '',
    required: false,
    options: ['multiple_choice', 'checkbox', 'dropdown'].includes(type)
      ? [
          { id: generateId(), label: 'Option 1', value: 'option_1' },
          { id: generateId(), label: 'Option 2', value: 'option_2' },
        ]
      : undefined,
    validationRules: type === 'email' 
      ? [{ id: generateId(), type: 'email_format', value: '', message: 'Enter a valid email' }]
      : type === 'phone'
      ? [{ id: generateId(), type: 'phone_format', value: '', message: 'Enter a valid phone number' }]
      : [],
    dependencyRule: undefined,
    childIds: [],
    metadata: {
      collapsed: false,
      createdAt: now,
      updatedAt: now,
    },
  };
}

export function formReducer(state, action) {
  switch (action.type) {
    // ─── ADD ROOT OR CHILD QUESTION ───────────────────────────────────────────
    case FormActions.ADD_QUESTION: {
      const { parentId, type } = action.payload;
      const newQ = createQuestion(parentId, type || 'short_answer');
      const newQuestions = { ...state.questions, [newQ.id]: newQ };

      if (!parentId) {
        return {
          ...state,
          rootQuestionIds: [...state.rootQuestionIds, newQ.id],
          questions: newQuestions,
          updatedAt: new Date().toISOString(),
        };
      } else {
        const parent = state.questions[parentId];
        if (!parent) return state;

        // Safety: prevent cycle
        if (wouldCreateCycle(state.questions, parentId, newQ.id)) {
          console.error('Circular dependency detected — aborted');
          return state;
        }

        return {
          ...state,
          questions: {
            ...newQuestions,
            [parent.id]: { ...parent, childIds: [...parent.childIds, newQ.id] },
          },
          updatedAt: new Date().toISOString(),
        };
      }
    }

    // ─── DELETE QUESTION (CASCADE) ─────────────────────────────────────────
    case FormActions.DELETE_QUESTION: {
      const { id } = action.payload;
      const question = state.questions[id];
      if (!question) return state;

      // Collect all descendants to delete
      const toDelete = collectAllDescendantIds(state.questions, id);
      toDelete.add(id);

      // Remove from questions map + clean dependency refs
      const newQuestions = {};
      Object.values(state.questions).forEach((q) => {
        if (toDelete.has(q.id)) return; // skip deleted

        // Clean dependency conditions that reference deleted questions
        const cleanedConditions = (q.dependencyRule?.conditions ?? []).filter(
          (c) => !toDelete.has(c.parentQuestionId)
        );
        newQuestions[q.id] = {
          ...q,
          dependencyRule:
            cleanedConditions.length > 0
              ? { ...q.dependencyRule, conditions: cleanedConditions }
              : undefined,
        };
      });

      if (!question.parentId) {
        return {
          ...state,
          rootQuestionIds: state.rootQuestionIds.filter((qid) => qid !== id),
          questions: newQuestions,
          updatedAt: new Date().toISOString(),
        };
      } else {
        const parent = newQuestions[question.parentId];
        if (parent) {
          newQuestions[question.parentId] = {
            ...parent,
            childIds: parent.childIds.filter((cid) => cid !== id),
          };
        }
        return {
          ...state,
          questions: newQuestions,
          updatedAt: new Date().toISOString(),
        };
      }
    }

    // ─── UPDATE QUESTION FIELDS ────────────────────────────────────────────
    case FormActions.UPDATE_QUESTION: {
      const { id, changes } = action.payload;
      const existing = state.questions[id];
      if (!existing) return state;

      // If changing type to one that can't have children, cascade-delete children
      let extraQuestions = {};
      let extraRootIds = state.rootQuestionIds;
      if (changes.type && changes.type !== existing.type) {
        const canHaveKids = TYPES_WITH_CHILDREN.includes(changes.type);
        if (!canHaveKids && existing.childIds.length > 0) {
          const toDelete = collectAllDescendantIds(state.questions, id);
          const filtered = {};
          Object.values(state.questions).forEach((q) => {
            if (!toDelete.has(q.id)) filtered[q.id] = q;
          });
          extraQuestions = { ...filtered };
          // Reset childIds
          changes.childIds = [];
        }
      }

      const updatedQuestion = {
        ...existing,
        ...changes,
        metadata: { ...existing.metadata, updatedAt: new Date().toISOString() },
      };

      const baseQuestions =
        Object.keys(extraQuestions).length > 0 ? extraQuestions : { ...state.questions };

      return {
        ...state,
        rootQuestionIds: extraRootIds,
        questions: {
          ...baseQuestions,
          [id]: updatedQuestion,
        },
        updatedAt: new Date().toISOString(),
      };
    }

    // ─── REORDER QUESTIONS ─────────────────────────────────────────────────
    case FormActions.REORDER_QUESTIONS: {
      const { parentId, newOrder } = action.payload;
      if (!parentId) {
        return { ...state, rootQuestionIds: newOrder, updatedAt: new Date().toISOString() };
      } else {
        const parent = state.questions[parentId];
        if (!parent) return state;
        return {
          ...state,
          questions: {
            ...state.questions,
            [parent.id]: { ...parent, childIds: newOrder },
          },
          updatedAt: new Date().toISOString(),
        };
      }
    }

    // ─── TOGGLE COLLAPSE ──────────────────────────────────────────────────
    case FormActions.TOGGLE_COLLAPSE: {
      const { id } = action.payload;
      const q = state.questions[id];
      if (!q) return state;
      return {
        ...state,
        questions: {
          ...state.questions,
          [id]: {
            ...q,
            metadata: { ...q.metadata, collapsed: !q.metadata.collapsed },
          },
        },
      };
    }

    // ─── SET DEPENDENCY RULE ──────────────────────────────────────────────
    case FormActions.SET_DEPENDENCY: {
      const { id, dependencyRule } = action.payload;
      const q = state.questions[id];
      if (!q) return state;
      return {
        ...state,
        questions: {
          ...state.questions,
          [id]: { ...q, dependencyRule, metadata: { ...q.metadata, updatedAt: new Date().toISOString() } },
        },
        updatedAt: new Date().toISOString(),
      };
    }

    // ─── REMOVE DEPENDENCY RULE ────────────────────────────────────────────
    case FormActions.REMOVE_DEPENDENCY: {
      const { id } = action.payload;
      const q = state.questions[id];
      if (!q) return state;
      return {
        ...state,
        questions: {
          ...state.questions,
          [id]: { ...q, dependencyRule: undefined, metadata: { ...q.metadata, updatedAt: new Date().toISOString() } },
        },
        updatedAt: new Date().toISOString(),
      };
    }

    // ─── SET FORM META ─────────────────────────────────────────────────────
    case FormActions.SET_FORM_META: {
      return {
        ...state,
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };
    }

    // ─── LOAD FORM ────────────────────────────────────────────────────────
    case FormActions.LOAD_FORM:
      return action.payload.form;

    // ─── CLEAR FORM ───────────────────────────────────────────────────────
    case FormActions.CLEAR_FORM:
      return createEmptyForm();

    default:
      return state;
  }
}
