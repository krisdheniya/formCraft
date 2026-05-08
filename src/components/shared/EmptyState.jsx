// components/shared/EmptyState.jsx
import React from 'react';
import { FileQuestion, Plus } from 'lucide-react';

export function EmptyState({ onAddQuestion }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <FileQuestion size={48} strokeWidth={1.5} />
      </div>
      <h2 className="empty-state-title">Start Building Your Form</h2>
      <p className="empty-state-desc">
        Add your first question to begin creating a powerful, nested form with conditional logic.
      </p>
      <button className="btn btn-primary btn-lg" onClick={() => onAddQuestion(null)}>
        <Plus size={18} /> Add First Question
      </button>
    </div>
  );
}
