// components/Question/QuestionBody.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useFormBuilder } from '../../hooks/useFormBuilder.js';
import { useQuestionActions } from '../../hooks/useQuestionActions.js';
import { QUESTION_TYPES } from '../../utils/constants.js';
import { questionTypeRegistry } from '../QuestionTypes/index.js';

export function QuestionBody({ questionId }) {
  const { state } = useFormBuilder();
  const { updateQuestion } = useQuestionActions();
  const question = state.questions[questionId];

  // Local state for debounced text input
  const [localText, setLocalText] = useState(question?.text || '');
  const [localDesc, setLocalDesc] = useState(question?.description || '');
  const textTimer = useRef(null);
  const descTimer = useRef(null);

  // Sync if question changes externally
  useEffect(() => {
    setLocalText(question?.text || '');
  }, [questionId]); // only on question switch, not every keystroke

  if (!question) return null;

  const handleTextChange = (val) => {
    setLocalText(val);
    if (textTimer.current) clearTimeout(textTimer.current);
    textTimer.current = setTimeout(() => {
      updateQuestion(questionId, { text: val });
    }, 300);
  };

  const handleTextBlur = () => {
    if (textTimer.current) clearTimeout(textTimer.current);
    updateQuestion(questionId, { text: localText });
  };

  const handleDescChange = (val) => {
    setLocalDesc(val);
    if (descTimer.current) clearTimeout(descTimer.current);
    descTimer.current = setTimeout(() => {
      updateQuestion(questionId, { description: val });
    }, 300);
  };

  const handleDescBlur = () => {
    if (descTimer.current) clearTimeout(descTimer.current);
    updateQuestion(questionId, { description: localDesc });
  };

  const handleTypeChange = (newType) => {
    updateQuestion(questionId, { type: newType });
  };

  const TypeEditor = questionTypeRegistry[question.type]?.editor;

  return (
    <div className="question-body">
      {/* Question text input */}
      <input
        id={`q-text-${questionId}`}
        className="question-text-input"
        placeholder="Enter question text…"
        value={localText}
        onChange={(e) => handleTextChange(e.target.value)}
        onBlur={handleTextBlur}
        aria-label="Question text"
      />

      {/* Description / help text */}
      <input
        className="question-desc-input"
        placeholder="Add a description or help text (optional)"
        value={localDesc}
        onChange={(e) => handleDescChange(e.target.value)}
        onBlur={handleDescBlur}
        aria-label="Question description"
      />

      {/* Question type selector */}
      {question.type !== 'section_header' && (
        <div className="type-selector-row">
          <label className="type-selector-label">Type:</label>
          <select
            className="type-selector"
            value={question.type}
            onChange={(e) => handleTypeChange(e.target.value)}
            aria-label="Question type"
          >
            {QUESTION_TYPES.filter(t => t.value !== 'section_header').map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      )}

      {/* Type-specific editor */}
      {TypeEditor && <TypeEditor question={question} />}
    </div>
  );
}
