// components/ConditionalLogic/ConditionRow.jsx
import React from 'react';
import { Trash2 } from 'lucide-react';
import { useFormBuilder } from '../../hooks/useFormBuilder.js';
import { useNumbering } from '../../hooks/useNumbering.js';
import { OPERATORS } from '../../utils/constants.js';

export function ConditionRow({ condition, questionId, onChange, onDelete, index }) {
  const { state } = useFormBuilder();
  const numberMap = useNumbering();

  // All questions except this one and its descendants (to avoid cycles)
  // Sorted by question number for easier lookup
  const candidateParents = Object.values(state.questions)
    .filter((q) => q.id !== questionId)
    .sort((a, b) => {
      const numA = numberMap[a.id] || '';
      const numB = numberMap[b.id] || '';
      return numA.localeCompare(numB, undefined, { numeric: true });
    });

  const selectedParent = state.questions[condition.parentQuestionId];

  // Value options for parents with options (MC, checkbox, dropdown, true/false)
  const valueOptions = (() => {
    if (!selectedParent) return [];
    if (selectedParent.type === 'true_false') return [{ value: 'true', label: 'True' }, { value: 'false', label: 'False' }];
    if (['multiple_choice', 'checkbox', 'dropdown'].includes(selectedParent.type)) {
      return (selectedParent.options || []).map((o) => ({ value: o.value, label: o.label }));
    }
    return [];
  })();

  return (
    <div className="condition-row">
      {/* Parent question selector */}
      <select
        className="cond-select"
        value={condition.parentQuestionId || ''}
        onChange={(e) => onChange({ ...condition, parentQuestionId: e.target.value, value: '' })}
      >
        <option value="">Select question…</option>
        {candidateParents.map((q) => (
          <option key={q.id} value={q.id}>
            Q{numberMap[q.id] || '?'}: {q.text ? q.text.slice(0, 40) : '(untitled)'}
          </option>
        ))}
      </select>

      {/* Operator selector */}
      <select
        className="cond-select cond-select-sm"
        value={condition.operator || 'equals'}
        onChange={(e) => onChange({ ...condition, operator: e.target.value })}
      >
        {OPERATORS.map((op) => (
          <option key={op.value} value={op.value}>{op.label}</option>
        ))}
      </select>

      {/* Value input (hidden for is_answered) */}
      {condition.operator !== 'is_answered' && (
        valueOptions.length > 0 ? (
          <select
            className="cond-select cond-select-sm"
            value={String(condition.value || '')}
            onChange={(e) => onChange({ ...condition, value: e.target.value })}
          >
            <option value="">Any value…</option>
            {valueOptions.map((v) => (
              <option key={v.value} value={v.value}>{v.label}</option>
            ))}
          </select>
        ) : (
          <input
            className="cond-input"
            placeholder="Value…"
            value={String(condition.value || '')}
            onChange={(e) => onChange({ ...condition, value: e.target.value })}
          />
        )
      )}

      <button className="cond-delete" onClick={onDelete} title="Remove condition">
        <Trash2 size={14} />
      </button>
    </div>
  );
}
