// components/QuestionTypes/NumberEditor.jsx
import React from 'react';

export function NumberEditor({ question }) {
  return (
    <div className="type-editor">
      <input type="number" className="preview-input" placeholder={question.placeholder || '0'} disabled />
    </div>
  );
}

export function NumberPreview({ question, value, onChange }) {
  return (
    <input
      type="number"
      className="preview-input"
      placeholder={question.placeholder || '0'}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
    />
  );
}
