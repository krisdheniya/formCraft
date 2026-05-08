// components/FormBuilder/FormCanvas.jsx — Root canvas with DnD
import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useFormBuilder } from '../../hooks/useFormBuilder.js';
import { useQuestionActions } from '../../hooks/useQuestionActions.js';
import { useNumbering } from '../../hooks/useNumbering.js';
import { QuestionNode } from '../Question/QuestionNode.jsx';
import { EmptyState } from '../shared/EmptyState.jsx';
import { AddQuestionButton } from '../Question/AddQuestionButton.jsx';

function SortableQuestionNode({ questionId, numberPrefix }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: questionId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.45 : 1,
    position: 'relative',
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style}>
      <QuestionNode
        questionId={questionId}
        depth={0}
        numberPrefix={numberPrefix}
        dragHandleProps={{ ...attributes, ...listeners }}
      />
    </div>
  );
}

export function FormCanvas() {
  const { state } = useFormBuilder();
  const { addQuestion, reorderQuestions } = useQuestionActions();
  const numberMap = useNumbering();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = state.rootQuestionIds.indexOf(active.id);
    const newIndex = state.rootQuestionIds.indexOf(over.id);
    const newOrder = arrayMove(state.rootQuestionIds, oldIndex, newIndex);
    reorderQuestions(null, newOrder);
  };

  if (state.rootQuestionIds.length === 0) {
    return (
      <div className="form-canvas">
        <EmptyState onAddQuestion={addQuestion} />
      </div>
    );
  }

  return (
    <div className="form-canvas">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={state.rootQuestionIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="question-list">
            {state.rootQuestionIds.map((id, index) => (
              <SortableQuestionNode
                key={id}
                questionId={id}
                numberPrefix={numberMap[id] || String(index + 1)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="canvas-footer">
        <AddQuestionButton parentId={null} depth={0} />
      </div>
    </div>
  );
}
