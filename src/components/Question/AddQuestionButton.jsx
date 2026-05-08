// components/Question/AddQuestionButton.jsx
import React, { useState } from 'react';
import { Plus, ChevronDown } from 'lucide-react';
import { useQuestionActions } from '../../hooks/useQuestionActions.js';
import { QUESTION_TYPES, MAX_DEPTH } from '../../utils/constants.js';

export function AddQuestionButton({ parentId = null, depth = 0, label }) {
  const { addQuestion } = useQuestionActions();
  const [open, setOpen] = useState(false);

  const isMaxDepth = depth >= MAX_DEPTH;

  if (isMaxDepth) {
    return (
      <div className="add-btn-disabled" title="Maximum nesting depth reached">
        <Plus size={13} /> Max depth reached
      </div>
    );
  }

  const handleAdd = (type) => {
    addQuestion(parentId, type);
    setOpen(false);
  };

  return (
    <div className="add-question-wrapper">
      <button
        className="add-question-btn"
        onClick={() => (open ? handleAdd('short_answer') : setOpen(true))}
        id={`add-btn-${parentId || 'root'}`}
      >
        <Plus size={14} />
        <span>{label || (parentId ? 'Add Sub-question' : 'Add Question')}</span>
        <ChevronDown size={13} className={`add-chevron ${open ? 'rotated' : ''}`} />
      </button>

      {open && (
        <>
          <div className="add-question-overlay" onClick={() => setOpen(false)} />
          <div className="add-question-dropdown">
            <div className="dropdown-header">Choose question type</div>
            <div className="dropdown-grid">
              {QUESTION_TYPES.map((t) => (
                <button
                  key={t.value}
                  className="dropdown-type-btn"
                  onClick={() => handleAdd(t.value)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
