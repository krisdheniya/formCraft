// components/ConditionalLogic/DependencyBadge.jsx
import React from 'react';
import { GitBranch } from 'lucide-react';
import { useFormBuilder } from '../../hooks/useFormBuilder.js';
import { useNumbering } from '../../hooks/useNumbering.js';

export function DependencyBadge({ dependencyRule }) {
  const { state } = useFormBuilder();
  const numberMap = useNumbering();

  if (!dependencyRule?.conditions?.length) return null;

  const parts = dependencyRule.conditions.map((cond, i) => {
    const parentQ = state.questions[cond.parentQuestionId];
    const num = numberMap[cond.parentQuestionId] || '?';
    const val = cond.operator === 'is_answered' ? '' : ` = "${String(cond.value)}"`;
    return (
      <span key={i} className="dep-badge-condition">
        Q{num}{val ? val : ' is answered'}
        {i < dependencyRule.conditions.length - 1 && (
          <span className="dep-badge-logic"> {dependencyRule.logic} </span>
        )}
      </span>
    );
  });

  return (
    <div className="dep-badge" title="This question has conditional visibility">
      <GitBranch size={12} />
      <span>Shown if </span>
      {parts}
    </div>
  );
}
