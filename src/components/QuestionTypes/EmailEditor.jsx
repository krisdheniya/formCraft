// components/QuestionTypes/EmailEditor.jsx
import React from 'react';

export function EmailEditor({ question }) {
  return (
    <div className="type-editor">
      <input type="email" className="preview-input" placeholder={question.placeholder || 'email@example.com'} disabled />
    </div>
  );
}

export function EmailPreview({ question, value, onChange }) {
  return (
    <input
      type="email"
      className="preview-input"
      placeholder={question.placeholder || 'email@example.com'}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
