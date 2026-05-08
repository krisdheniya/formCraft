// components/QuestionTypes/PhoneEditor.jsx
import React from 'react';

export function PhoneEditor({ question }) {
  return (
    <div className="type-editor">
      <input type="tel" className="preview-input" placeholder={question.placeholder || '+1 (000) 000-0000'} disabled />
    </div>
  );
}

export function PhonePreview({ question, value, onChange }) {
  return (
    <input
      type="tel"
      className="preview-input"
      placeholder={question.placeholder || '+1 (000) 000-0000'}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
