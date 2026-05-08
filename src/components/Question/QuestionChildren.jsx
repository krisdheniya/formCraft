// components/Question/QuestionChildren.jsx
import React from 'react';
import { QuestionNode } from './QuestionNode.jsx';

export function QuestionChildren({ childIds, depth, parentNumber }) {
  if (!childIds || childIds.length === 0) return null;

  return (
    <div className="question-children">
      {childIds.map((childId, index) => (
        <QuestionNode
          key={childId}
          questionId={childId}
          depth={depth}
          numberPrefix={`${parentNumber}.${index + 1}`}
        />
      ))}
    </div>
  );
}
