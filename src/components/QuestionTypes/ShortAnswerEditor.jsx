// components/QuestionTypes/ShortAnswerEditor.jsx
import React from 'react';

export function ShortAnswerEditor({ question }) {
  return (
    <div className="type-editor">
      <div className="type-editor-preview">
        <input
          type="text"
          className="preview-input"
          placeholder={question.placeholder || 'Short answer text…'}
          disabled
        />
      </div>
    </div>
  );
}

export function ShortAnswerPreview({ question, value, onChange }) {
  return (
    <input
      type="text"
      className="preview-input"
      placeholder={question.placeholder || 'Your answer…'}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
