// components/QuestionTypes/CheckboxEditor.jsx
import React from 'react';
import { generateId } from '../../utils/idGenerator.js';
import { useQuestionActions } from '../../hooks/useQuestionActions.js';
import { Trash2, Plus } from 'lucide-react';

export function CheckboxEditor({ question }) {
  const { updateQuestion } = useQuestionActions();
  const options = question.options || [];

  const updateOption = (optId, label) => {
    const updated = options.map((o) =>
      o.id === optId ? { ...o, label, value: label.toLowerCase().replace(/\s+/g, '_') } : o
    );
    updateQuestion(question.id, { options: updated });
  };

  const addOption = () => {
    const num = options.length + 1;
    const newOpt = { id: generateId(), label: `Option ${num}`, value: `option_${num}` };
    updateQuestion(question.id, { options: [...options, newOpt] });
  };

  const removeOption = (optId) => {
    if (options.length <= 2) return;
    updateQuestion(question.id, { options: options.filter((o) => o.id !== optId) });
  };

  return (
    <div className="type-editor options-editor">
      {options.map((opt) => (
        <div key={opt.id} className="option-row">
          <input type="checkbox" disabled />
          <input
            className="option-input"
            value={opt.label}
            onChange={(e) => updateOption(opt.id, e.target.value)}
            placeholder="Option label"
          />
          <button
            className="option-delete"
            onClick={() => removeOption(opt.id)}
            disabled={options.length <= 2}
            title="Remove option"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button className="add-option-btn" onClick={addOption}>
        <Plus size={14} /> Add option
      </button>
    </div>
  );
}

export function CheckboxPreview({ question, value = [], onChange }) {
  const toggle = (optValue) => {
    const arr = Array.isArray(value) ? value : [];
    const next = arr.includes(optValue)
      ? arr.filter((v) => v !== optValue)
      : [...arr, optValue];
    onChange(next);
  };
  return (
    <div className="options-preview">
      {(question.options || []).map((opt) => (
        <label key={opt.id} className="option-preview-row">
          <input
            type="checkbox"
            checked={Array.isArray(value) && value.includes(opt.value)}
            onChange={() => toggle(opt.value)}
          />
          <span>{opt.label}</span>
        </label>
      ))}
    </div>
  );
}
