// components/QuestionTypes/RatingEditor.jsx
import React from 'react';
import { Star } from 'lucide-react';

export function RatingEditor() {
  return (
    <div className="type-editor">
      <div className="rating-preview">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} size={20} className="rating-star disabled" />
        ))}
        <span className="rating-hint">1–5 stars</span>
      </div>
    </div>
  );
}

export function RatingPreview({ value, onChange }) {
  return (
    <div className="rating-preview">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          className={`rating-btn ${Number(value) >= n ? 'active' : ''}`}
          onClick={() => onChange(n)}
          type="button"
        >
          <Star size={22} />
        </button>
      ))}
    </div>
  );
}
