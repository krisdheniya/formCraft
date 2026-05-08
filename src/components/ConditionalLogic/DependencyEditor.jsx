// components/ConditionalLogic/DependencyEditor.jsx
import React, { useState } from 'react';
import { GitBranch, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { ConditionRow } from './ConditionRow.jsx';
import { useQuestionActions } from '../../hooks/useQuestionActions.js';
import { generateId } from '../../utils/idGenerator.js';
import { transitivelyDependsOn } from '../../utils/treeUtils.js';
import { useFormBuilder } from '../../hooks/useFormBuilder.js';
import { useToast } from '../shared/Toast.jsx';

function createEmptyCondition() {
  return { id: generateId(), parentQuestionId: '', operator: 'equals', value: '' };
}

export function DependencyEditor({ questionId }) {
  const { state } = useFormBuilder();
  const { setDependency, removeDependency } = useQuestionActions();
  const toast = useToast();
  const [open, setOpen] = useState(false);

  const question = state.questions[questionId];
  if (!question) return null;

  const rule = question.dependencyRule || { logic: 'AND', conditions: [] };

  const handleAddCondition = () => {
    const newCond = createEmptyCondition();
    setDependency(questionId, { ...rule, conditions: [...rule.conditions, newCond] });
    setOpen(true);
  };

  const handleUpdateCondition = (index, updatedCond) => {
    // Circular dependency check
    if (updatedCond.parentQuestionId) {
      if (
        updatedCond.parentQuestionId === questionId ||
        transitivelyDependsOn(state.questions, updatedCond.parentQuestionId, questionId)
      ) {
        toast.error('Circular dependency detected — cannot set this condition');
        return;
      }
    }
    const newConditions = rule.conditions.map((c, i) => (i === index ? updatedCond : c));
    setDependency(questionId, { ...rule, conditions: newConditions });
  };

  const handleDeleteCondition = (index) => {
    const newConditions = rule.conditions.filter((_, i) => i !== index);
    if (newConditions.length === 0) {
      removeDependency(questionId);
    } else {
      setDependency(questionId, { ...rule, conditions: newConditions });
    }
  };

  const handleToggleLogic = () => {
    setDependency(questionId, { ...rule, logic: rule.logic === 'AND' ? 'OR' : 'AND' });
  };

  const hasConditions = rule.conditions.length > 0;

  return (
    <div className="dep-editor">
      <button className="dep-editor-toggle" onClick={() => setOpen(!open)}>
        <GitBranch size={14} />
        <span>Conditional Logic</span>
        {hasConditions && <span className="dep-badge-count">{rule.conditions.length}</span>}
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="dep-editor-body">
          <p className="dep-hint">Show this question when:</p>

          {rule.conditions.map((cond, i) => (
            <React.Fragment key={cond.id || i}>
              <ConditionRow
                condition={cond}
                questionId={questionId}
                index={i}
                onChange={(updated) => handleUpdateCondition(i, updated)}
                onDelete={() => handleDeleteCondition(i)}
              />
              {i < rule.conditions.length - 1 && (
                <button className="logic-toggle" onClick={handleToggleLogic}>
                  {rule.logic}
                </button>
              )}
            </React.Fragment>
          ))}

          <div className="dep-editor-actions">
            <button className="btn btn-ghost btn-sm" onClick={handleAddCondition}>
              <Plus size={13} /> Add Condition
            </button>
            {hasConditions && rule.conditions.length > 1 && (
              <button className="btn btn-ghost btn-sm logic-btn" onClick={handleToggleLogic}>
                Match: <strong>{rule.logic}</strong>
              </button>
            )}
            {hasConditions && (
              <button
                className="btn btn-ghost btn-sm btn-danger-ghost"
                onClick={() => removeDependency(questionId)}
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
