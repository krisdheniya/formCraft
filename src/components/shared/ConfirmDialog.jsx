// components/shared/ConfirmDialog.jsx
import React, { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

export function ConfirmDialog({ isOpen, title, message, confirmLabel = 'Delete', onConfirm, onCancel, danger = true }) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (isOpen) confirmRef.current?.focus();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="dialog-header">
          {danger && <AlertTriangle size={20} className="dialog-icon danger" />}
          <h3 className="dialog-title">{title}</h3>
          <button className="dialog-close" onClick={onCancel} aria-label="Close"><X size={16} /></button>
        </div>
        <p className="dialog-message">{message}</p>
        <div className="dialog-actions">
          <button className="btn btn-ghost" onClick={onCancel}>Cancel</button>
          <button
            ref={confirmRef}
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
