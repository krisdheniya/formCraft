// components/FormBuilder/FormBuilderHeader.jsx
import React, { useState } from 'react';
import { Eye, EyeOff, Trash2, Download } from 'lucide-react';
import { useFormBuilder } from '../../hooks/useFormBuilder.js';
import { useQuestionActions } from '../../hooks/useQuestionActions.js';
import { validateForm } from '../../engine/validationEngine.js';
import { saveToLocalStorage, clearLocalStorage } from '../../utils/localStorageUtils.js';
import { ConfirmDialog } from '../shared/ConfirmDialog.jsx';
import { useToast } from '../shared/Toast.jsx';

export function FormBuilderHeader({ mode, onModeChange }) {
  const { state } = useFormBuilder();
  const { setFormMeta, clearForm, loadForm } = useQuestionActions();
  const toast = useToast();
  const [clearDialog, setClearDialog] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(state.title);


  const handleExport = () => {
    const json = JSON.stringify(state, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.title.replace(/\s+/g, '_')}_form.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Form exported as JSON');
  };


  const handleClear = () => {
    clearForm();
    clearLocalStorage();
    setClearDialog(false);
    toast.info('Form cleared');
  };

  const handleTitleBlur = () => {
    setFormMeta({ title: localTitle || 'Untitled Form' });
    setEditingTitle(false);
  };

  const qCount = Object.values(state.questions).filter(q => q.type !== 'section_header').length;

  return (
    <header className="builder-header">
      <div className="header-left">
        <div className="logo-mark">FC</div>
        <div className="header-title-area">
          {editingTitle ? (
            <input
              className="title-edit-input"
              value={localTitle}
              autoFocus
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
            />
          ) : (
            <h1
              className="header-title"
              onClick={() => { setLocalTitle(state.title); setEditingTitle(true); }}
              title="Click to edit form title"
            >
              {state.title}
            </h1>
          )}
          <span className="header-meta">
            {qCount} question{qCount !== 1 ? 's' : ''} · Auto-saved
          </span>
        </div>
      </div>

      <div className="header-actions">
        {/* Mode toggle */}
        <button
          className={`btn btn-ghost preview-toggle-highlight ${mode === 'preview' ? 'active' : ''}`}
          onClick={() => onModeChange(mode === 'builder' ? 'preview' : 'builder')}
          id="toggle-preview-btn"
        >
          {mode === 'preview' ? <EyeOff size={16} /> : <Eye size={16} />}
          {mode === 'preview' ? 'Edit Form' : 'Preview Form'}
        </button>

        {/* Export JSON */}
        <button className="btn btn-ghost" onClick={handleExport} id="export-btn" title="Export JSON">
          <Download size={16} />
        </button>

        {/* Clear */}
        <button className="btn btn-danger-ghost" onClick={() => setClearDialog(true)} id="clear-btn">
          <Trash2 size={16} /> Clear
        </button>
      </div>

      <ConfirmDialog
        isOpen={clearDialog}
        title="Clear Form"
        message="This will permanently delete all questions and cannot be undone. Are you sure?"
        confirmLabel="Clear All"
        onConfirm={handleClear}
        onCancel={() => setClearDialog(false)}
        danger
      />
    </header>
  );
}
