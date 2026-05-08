// components/QuestionTypes/DateEditor.jsx
import React from 'react';

export function DateEditor() {
  return (
    <div className="type-editor">
      <input type="date" className="preview-input" disabled />
    </div>
  );
}

export function DatePreview({ value, onChange }) {
  return (
    <input
      type="date"
      className="preview-input"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
