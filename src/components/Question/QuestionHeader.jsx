// components/Question/QuestionHeader.jsx
import React from 'react';
import { GripVertical, ChevronDown, ChevronRight, Trash2 } from 'lucide-react';
import { useFormBuilder } from '../../hooks/useFormBuilder.js';
import { useQuestionActions } from '../../hooks/useQuestionActions.js';
import { DependencyBadge } from '../ConditionalLogic/DependencyBadge.jsx';
import { QUESTION_TYPES, TYPE_COLORS } from '../../utils/constants.js';
import { countDescendants } from '../../utils/treeUtils.js';

export function QuestionHeader({ questionId, numberPrefix, depth, dragHandleProps, onDeleteRequest }) {
  const { state } = useFormBuilder();
  const { toggleCollapse } = useQuestionActions();
  const question = state.questions[questionId];
  if (!question) return null;

  const typeInfo = QUESTION_TYPES.find((t) => t.value === question.type);
  const color = TYPE_COLORS[question.type] || '#6366f1';
  const isCollapsed = question.metadata.collapsed;
  const descendantCount = countDescendants(state.questions, questionId);

  return (
    <div className="question-header" style={{ borderLeftColor: color }}>
      {/* Drag handle (root-level only) */}
      {depth === 0 && dragHandleProps && (
        <span className="drag-handle" {...dragHandleProps} title="Drag to reorder">
          <GripVertical size={16} />
        </span>
      )}

      {/* Collapse toggle */}
      <button
        className="collapse-btn"
        onClick={() => toggleCollapse(questionId)}
        title={isCollapsed ? 'Expand' : 'Collapse'}
        aria-label={isCollapsed ? 'Expand question' : 'Collapse question'}
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
      </button>

      {/* Question number badge */}
      {question.type !== 'section_header' && (
        <span className="question-number" style={{ color }}>
          Q{numberPrefix}
        </span>
      )}

      {/* Question text preview (when collapsed) or placeholder */}
      <span className="question-text-preview">
        {question.text || <em className="placeholder-text">Untitled question</em>}
      </span>

      {/* Type badge */}
      <span className="type-badge" style={{ background: `${color}22`, color }}>
        {typeInfo?.label || question.type}
      </span>

      {/* Dependency badge */}
      {question.dependencyRule?.conditions?.length > 0 && (
        <DependencyBadge dependencyRule={question.dependencyRule} />
      )}

      {/* Required asterisk */}
      {question.required && <span className="required-badge">Required</span>}

      {/* Delete button */}
      <button
        className="delete-btn"
        onClick={() => onDeleteRequest(questionId, descendantCount)}
        title={`Delete question${descendantCount > 0 ? ` and ${descendantCount} nested sub-question(s)` : ''}`}
        aria-label="Delete question"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
