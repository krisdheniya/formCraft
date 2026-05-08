// components/Question/QuestionNode.jsx — Single question (recursive entry point)
import React, { memo, useState } from 'react';
import { useFormBuilder } from '../../hooks/useFormBuilder.js';
import { useQuestionActions } from '../../hooks/useQuestionActions.js';
import { QuestionHeader } from './QuestionHeader.jsx';
import { QuestionBody } from './QuestionBody.jsx';
import { QuestionSettings } from './QuestionSettings.jsx';
import { QuestionChildren } from './QuestionChildren.jsx';
import { AddQuestionButton } from './AddQuestionButton.jsx';
import { DependencyEditor } from '../ConditionalLogic/DependencyEditor.jsx';
import { ConfirmDialog } from '../shared/ConfirmDialog.jsx';
import { canHaveChildren } from '../QuestionTypes/index.js';
import { MAX_DEPTH } from '../../utils/constants.js';
import { useToast } from '../shared/Toast.jsx';

const MAX_NESTING = MAX_DEPTH;

export const QuestionNode = memo(function QuestionNode({ questionId, depth = 0, numberPrefix, dragHandleProps }) {
  const { state } = useFormBuilder();
  const { deleteQuestion } = useQuestionActions();
  const toast = useToast();
  const [deleteDialog, setDeleteDialog] = useState(null); // { id, count }

  const question = state.questions[questionId];

  // Guard: question deleted mid-render or corrupt state
  if (!question) return null;

  // Guard: prevent runaway recursion
  if (depth > MAX_NESTING) {
    return (
      <div className="max-depth-warning">
        ⚠ Maximum nesting depth reached for Q{numberPrefix}
      </div>
    );
  }

  const handleDeleteRequest = (id, descendantCount) => {
    setDeleteDialog({ id, count: descendantCount });
  };

  const handleDeleteConfirm = () => {
    const { id, count } = deleteDialog;
    deleteQuestion(id);
    if (count > 0) {
      toast.warning(`Deleted question and ${count} nested sub-question${count !== 1 ? 's' : ''}`);
    }
    setDeleteDialog(null);
  };

  return (
    <>
      <div
        className={`question-node depth-${depth}`}
        style={{ '--depth': depth, marginLeft: depth === 0 ? 0 : 20 }}
        data-question-id={questionId}
      >
        {/* Header: number, type badge, collapse, delete, drag handle */}
        <QuestionHeader
          questionId={questionId}
          numberPrefix={numberPrefix}
          depth={depth}
          dragHandleProps={dragHandleProps}
          onDeleteRequest={handleDeleteRequest}
        />

        {/* Expanded content */}
        {!question.metadata.collapsed && (
          <div className="question-content">
            <QuestionBody questionId={questionId} />
            <QuestionSettings questionId={questionId} />

            {/* Conditional logic (only for child questions) */}
            {depth > 0 && <DependencyEditor questionId={questionId} />}

            {/* Recursive children */}
            <QuestionChildren
              childIds={question.childIds}
              depth={depth + 1}
              parentNumber={numberPrefix}
            />

            {/* Add child button (only if type supports children and depth allows) */}
            {canHaveChildren(question.type) && (
              <AddQuestionButton
                parentId={questionId}
                depth={depth + 1}
                label="Add Sub-question"
              />
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      {deleteDialog && (
        <ConfirmDialog
          isOpen={true}
          title="Delete Question"
          message={
            deleteDialog.count > 0
              ? `Delete Q${numberPrefix} and its ${deleteDialog.count} nested sub-question${deleteDialog.count !== 1 ? 's' : ''}? This action cannot be undone.`
              : `Delete Q${numberPrefix}? This action cannot be undone.`
          }
          confirmLabel="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteDialog(null)}
          danger
        />
      )}
    </>
  );
},
// Custom comparison: only re-render if questionId, depth, or numberPrefix changes
(prev, next) =>
  prev.questionId === next.questionId &&
  prev.depth === next.depth &&
  prev.numberPrefix === next.numberPrefix
);
