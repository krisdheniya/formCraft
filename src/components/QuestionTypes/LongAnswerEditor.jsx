// components/QuestionTypes/LongAnswerEditor.jsx
import React from 'react';

export function LongAnswerEditor({ question }) {
  return (
    <div className="type-editor">
      <div className="type-editor-preview">
        <textarea
          className="preview-input preview-textarea"
          placeholder={question.placeholder || 'Long answer text…'}
          disabled
          rows={3}
        />
      </div>
    </div>
  );
}

export function LongAnswerPreview({ question, value, onChange }) {
  return (
    <textarea
      className="preview-input preview-textarea"
      placeholder={question.placeholder || 'Your answer…'}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      rows={4}
    />
  );
}
