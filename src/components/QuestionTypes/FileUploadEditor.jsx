// components/QuestionTypes/FileUploadEditor.jsx
import React from 'react';
import { Upload } from 'lucide-react';

export function FileUploadEditor({ question }) {
  return (
    <div className="type-editor file-upload-editor">
      <div className="file-upload-placeholder">
        <Upload size={24} />
        <p>File upload field preview</p>
        <span className="file-hint">Users will see a file picker here</span>
      </div>
    </div>
  );
}

export function FileUploadPreview({ question, value, onChange }) {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload and get a URL. 
      // For this demo, we'll just store the name.
      onChange(file.name);
    }
  };

  return (
    <div className="file-upload-preview">
      <input
        type="file"
        id={`file-${question.id}`}
        className="file-input-hidden"
        onChange={handleFileChange}
      />
      <label htmlFor={`file-${question.id}`} className="file-upload-label">
        <Upload size={16} />
        <span>{value || question.placeholder || 'Choose a file...'}</span>
      </label>
    </div>
  );
}
