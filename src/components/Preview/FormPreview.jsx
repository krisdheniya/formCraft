// components/Preview/FormPreview.jsx — Hierarchical live preview
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { useFormBuilder } from '../../hooks/useFormBuilder.js';
import { PreviewQuestion } from './PreviewQuestion.jsx';
import { SubmissionView } from './SubmissionView.jsx';
import { validateAnswer } from '../../engine/validationEngine.js';
import { evaluateDependencyRule } from '../../engine/dependencyEngine.js';
import { useToast } from '../shared/Toast.jsx';

export function FormPreview() {
  const { state } = useFormBuilder();
  const toast = useToast();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAnswer = (qId, value) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    // Clear error on answer
    if (errors[qId]) setErrors((prev) => { const n = { ...prev }; delete n[qId]; return n; });
  };

  const handleSubmit = () => {
    const newErrors = {};
    Object.values(state.questions).forEach((q) => {
      if (!evaluateDependencyRule(q.dependencyRule, answers)) return; // not visible
      if (q.type === 'section_header') return;
      const errs = validateAnswer(q, answers[q.id]);
      if (errs.length > 0) newErrors[q.id] = errs;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error(`Please fill in all required fields (${Object.keys(newErrors).length} error${Object.keys(newErrors).length !== 1 ? 's' : ''})`);
      return;
    }

    setSubmitted(true);
  };

  const handleReset = () => {
    setAnswers({});
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return <SubmissionView state={state} answers={answers} onReset={handleReset} />;
  }

  const isEmpty = state.rootQuestionIds.length === 0;

  return (
    <div className="form-preview">
      <div className="preview-header">
        <h2 className="preview-title">{state.title}</h2>
        {state.description && <p className="preview-description">{state.description}</p>}
      </div>

      {isEmpty ? (
        <div className="preview-empty">
          <p>No questions yet. Switch to Builder to add questions.</p>
        </div>
      ) : (
        <>
          <div className="preview-questions">
            {state.rootQuestionIds.map((id, i) => (
              <PreviewQuestion
                key={id}
                questionId={id}
                numberPrefix={String(i + 1)}
                depth={0}
                answers={answers}
                onAnswer={handleAnswer}
              />
            ))}
          </div>

          <div className="preview-submit">
            <button className="btn btn-primary btn-lg" onClick={handleSubmit} id="submit-form-btn">
              <Send size={16} /> Submit Form
            </button>
          </div>
        </>
      )}
    </div>
  );
}
