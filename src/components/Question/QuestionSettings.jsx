// components/Question/QuestionSettings.jsx
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { useFormBuilder } from '../../hooks/useFormBuilder.js';
import { useQuestionActions } from '../../hooks/useQuestionActions.js';
import { VALIDATION_RULES_BY_TYPE } from '../../utils/constants.js';
import { generateId } from '../../utils/idGenerator.js';

export function QuestionSettings({ questionId }) {
  const { state } = useFormBuilder();
  const { updateQuestion } = useQuestionActions();
  const question = state.questions[questionId];
  const [open, setOpen] = useState(false);

  if (!question) return null;

  const allowedRules = VALIDATION_RULES_BY_TYPE[question.type] || [];

  const handleToggleRequired = () => {
    updateQuestion(questionId, { required: !question.required });
  };

  const handlePlaceholderChange = (val) => {
    updateQuestion(questionId, { placeholder: val });
  };

  const handleAddRule = () => {
    const type = allowedRules.find(
      (r) => !question.validationRules.some((vr) => vr.type === r)
    );
    if (!type) return;
    const newRule = { id: generateId(), type, value: '', message: '' };
    updateQuestion(questionId, {
      validationRules: [...question.validationRules, newRule],
    });
  };

  const handleUpdateRule = (ruleId, changes) => {
    updateQuestion(questionId, {
      validationRules: question.validationRules.map((r) =>
        r.id === ruleId ? { ...r, ...changes } : r
      ),
    });
  };

  const handleDeleteRule = (ruleId) => {
    updateQuestion(questionId, {
      validationRules: question.validationRules.filter((r) => r.id !== ruleId),
    });
  };

  const canAddMore =
    allowedRules.length > 0 &&
    allowedRules.some((r) => !question.validationRules.some((vr) => vr.type === r));

  return (
    <div className="question-settings">
      <button className="settings-toggle" onClick={() => setOpen(!open)}>
        <span>Settings & Validation</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {open && (
        <div className="settings-body">
          {/* Required toggle */}
          <label className="setting-row toggle-row">
            <span>Required</span>
            <button
              className={`toggle-btn ${question.required ? 'active' : ''}`}
              onClick={handleToggleRequired}
              role="switch"
              aria-checked={question.required}
            >
              <span className="toggle-thumb" />
            </button>
          </label>

          {/* Placeholder input (for text-like types) */}
          {['short_answer', 'long_answer', 'number', 'email', 'phone'].includes(question.type) && (
            <div className="setting-row">
              <label className="setting-label">Placeholder</label>
              <input
                className="setting-input"
                value={question.placeholder || ''}
                onChange={(e) => handlePlaceholderChange(e.target.value)}
                placeholder="Hint text shown inside input…"
              />
            </div>
          )}

          {/* Validation rules */}
          {allowedRules.length > 0 && (
            <div className="validation-section">
              <div className="validation-header">
                <span>Validation Rules</span>
                {canAddMore && (
                  <button className="btn btn-ghost btn-xs" onClick={handleAddRule}>
                    <Plus size={12} /> Add Rule
                  </button>
                )}
              </div>
              {question.validationRules.map((rule) => (
                <div key={rule.id} className="validation-rule-row">
                  <select
                    className="rule-type-select"
                    value={rule.type}
                    onChange={(e) => handleUpdateRule(rule.id, { type: e.target.value, value: '' })}
                  >
                    {allowedRules.map((r) => (
                      <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                  {!['required', 'email_format', 'phone_format', 'is_answered'].includes(rule.type) && (
                    <input
                      className="rule-value-input"
                      placeholder="Value"
                      value={rule.value || ''}
                      onChange={(e) => handleUpdateRule(rule.id, { value: e.target.value })}
                    />
                  )}
                  <input
                    className="rule-msg-input"
                    placeholder="Error message…"
                    value={rule.message || ''}
                    onChange={(e) => handleUpdateRule(rule.id, { message: e.target.value })}
                  />
                  <button className="option-delete" onClick={() => handleDeleteRule(rule.id)}>
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
