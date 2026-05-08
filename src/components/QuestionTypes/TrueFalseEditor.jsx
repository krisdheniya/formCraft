// components/QuestionTypes/TrueFalseEditor.jsx
import React from 'react';

export function TrueFalseEditor() {
  return (
    <div className="type-editor">
      <div className="tf-options">
        <label className="tf-option">
          <input type="radio" name="tf-preview" disabled /> True
        </label>
        <label className="tf-option">
          <input type="radio" name="tf-preview" disabled /> False
        </label>
      </div>
    </div>
  );
}

export function TrueFalsePreview({ value, onChange }) {
  return (
    <div className="tf-options">
      <label className="tf-option preview-tf">
        <input
          type="radio"
          name={`tf-${Math.random()}`}
          checked={value === true}
          onChange={() => onChange(true)}
        />
        <span>True</span>
      </label>
      <label className="tf-option preview-tf">
        <input
          type="radio"
          checked={value === false}
          onChange={() => onChange(false)}
        />
        <span>False</span>
      </label>
    </div>
  );
}
