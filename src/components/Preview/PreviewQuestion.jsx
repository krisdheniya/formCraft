// components/Preview/PreviewQuestion.jsx — Recursive preview node
import React from 'react';
import { useFormBuilder } from '../../hooks/useFormBuilder.js';
import { evaluateDependencyRule } from '../../engine/dependencyEngine.js';
import { questionTypeRegistry } from '../QuestionTypes/index.js';

export function PreviewQuestion({ questionId, depth, numberPrefix, answers, onAnswer }) {
  const { state } = useFormBuilder();
  const question = state.questions[questionId];

  if (!question) return null;

  // Evaluate visibility based on current answers
  const isVisible = evaluateDependencyRule(question.dependencyRule, answers);
  if (!isVisible) return null;

  const TypeRenderer = questionTypeRegistry[question.type]?.previewRenderer;

  const answer = answers[questionId];
  const answerStr = Array.isArray(answer)
    ? answer.join(', ')
    : answer !== undefined && answer !== null
    ? String(answer)
    : '';

  return (
    <div
      className={`preview-question depth-${depth}`}
      style={{ marginLeft: depth > 0 ? depth * 20 : 0 }}
    >
      {question.type === 'section_header' ? (
        <div className="preview-section-header">
          <div className="preview-section-title">
            <span className="preview-q-num">§</span>
            <span>{question.text || 'Section'}</span>
          </div>
          {TypeRenderer && <TypeRenderer question={question} />}
        </div>
      ) : (
        <>
          <div className="preview-question-label">
            <span className="preview-q-num">Q{numberPrefix}</span>
            <span className="preview-q-text">
              {question.text || <em>Untitled question</em>}
            </span>
            {question.required && <span className="required-star">*</span>}
          </div>
          {question.description && (
            <p className="preview-q-desc">{question.description}</p>
          )}
          {TypeRenderer && (
            <div className="preview-q-input">
              <TypeRenderer
                question={question}
                value={answers[questionId]}
                onChange={(value) => onAnswer(questionId, value)}
              />
            </div>
          )}
        </>
      )}

      {/* Recursively render children */}
      {question.childIds.map((childId, i) => (
        <PreviewQuestion
          key={childId}
          questionId={childId}
          depth={depth + 1}
          numberPrefix={`${numberPrefix}.${i + 1}`}
          answers={answers}
          onAnswer={onAnswer}
        />
      ))}
    </div>
  );
}
