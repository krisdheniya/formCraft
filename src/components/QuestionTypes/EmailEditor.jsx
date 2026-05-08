// components/QuestionTypes/EmailEditor.jsx
import React from 'react';

export function EmailEditor({ question }) {
  return (
    <div className="type-editor">
      <input type="email" className="preview-input" placeholder={question.placeholder || 'krish@infollion.com'} disabled />
    </div>
  );
}

export function EmailPreview({ question, value, onChange }) {
  return (
    <input
      type="email"
      className="preview-input"
      placeholder={question.placeholder || 'krish@infollion.com'}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
