// components/QuestionTypes/FileUploadEditor.jsx
import React from 'react';
import { Upload } from 'lucide-react';

export function FileUploadEditor() {
  return (
    <div className="type-editor">
      <div className="file-upload-area">
        <Upload size={20} />
        <span>File upload field</span>
      </div>
    </div>
  );
}

export function FileUploadPreview({ value, onChange }) {
  return (
    <div className="file-upload-area interactive">
      <Upload size={20} />
      <input
        type="file"
        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
        onChange={(e) => onChange(e.target.files?.[0]?.name || '')}
      />
      <span>{value || 'Click to upload a file'}</span>
    </div>
  );
}
