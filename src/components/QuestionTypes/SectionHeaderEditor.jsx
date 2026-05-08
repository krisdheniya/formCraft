// components/QuestionTypes/SectionHeaderEditor.jsx
import React from 'react';

export function SectionHeaderEditor({ question }) {
  return (
    <div className="type-editor section-header-editor">
      <p className="section-header-hint">
        This is a section divider. Add a description below to explain this section.
      </p>
      {question.description && (
        <p className="section-description-preview">{question.description}</p>
      )}
    </div>
  );
}

export function SectionHeaderPreview({ question }) {
  return (
    <div className="section-header-preview">
      <div className="section-divider" />
      {question.description && (
        <p className="section-description-preview">{question.description}</p>
      )}
    </div>
  );
}
