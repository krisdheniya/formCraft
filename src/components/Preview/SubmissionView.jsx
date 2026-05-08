// components/Preview/SubmissionView.jsx — Post-submit hierarchical summary
import React from 'react';
import { CheckCircle, RotateCcw } from 'lucide-react';

function buildSummary(questions, rootIds, answers) {
  const entries = [];
  function recurse(id, number) {
    const q = questions[id];
    if (!q) return;
    if (q.type === 'section_header') return;
    const answer = answers[id];
    const answerStr = Array.isArray(answer)
      ? answer.join(', ')
      : answer !== undefined && answer !== null && answer !== ''
      ? String(answer)
      : null;
    entries.push({ number, text: q.text, type: q.type, answer: answerStr, depth: number.split('.').length - 1 });
    q.childIds.forEach((cid, i) => recurse(cid, `${number}.${i + 1}`));
  }
  rootIds.forEach((id, i) => recurse(id, String(i + 1)));
  return entries;
}

export function SubmissionView({ state, answers, onReset }) {
  const entries = buildSummary(state.questions, state.rootQuestionIds, answers);
  const answered = entries.filter((e) => e.answer !== null).length;

  return (
    <div className="submission-view">
      <div className="submission-header">
        <CheckCircle size={48} className="submission-icon" />
        <h2>Form Submitted!</h2>
        <p>{answered} of {entries.length} question{entries.length !== 1 ? 's' : ''} answered</p>
      </div>

      <div className="submission-summary">
        <h3>Your Responses</h3>
        {entries.map((entry) => (
          <div
            key={entry.number}
            className="submission-entry"
            style={{ marginLeft: entry.depth * 16 }}
          >
            <div className="submission-q">
              <span className="submission-num">Q{entry.number}</span>
              <span className="submission-text">{entry.text || '(untitled)'}</span>
            </div>
            <div className={`submission-answer ${!entry.answer ? 'no-answer' : ''}`}>
              {entry.answer ?? <em>Not answered</em>}
            </div>
          </div>
        ))}
      </div>

      <button className="btn btn-primary" onClick={onReset}>
        <RotateCcw size={16} /> Fill Again
      </button>
    </div>
  );
}
