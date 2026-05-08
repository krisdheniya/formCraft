import React, { useState } from 'react';
import { FormBuilderProvider } from './components/FormBuilder/FormBuilderProvider.jsx';
import { FormBuilderHeader } from './components/FormBuilder/FormBuilderHeader.jsx';
import { FormCanvas } from './components/FormBuilder/FormCanvas.jsx';
import { FormPreview } from './components/Preview/FormPreview.jsx';
import { ToastProvider } from './components/shared/Toast.jsx';

export default function App() {
  const [mode, setMode] = useState('builder');
  return (
    <ToastProvider>
      <FormBuilderProvider>
        <div className="app-layout">
          <FormBuilderHeader mode={mode} onModeChange={setMode} />
          <main className="app-main">
            {mode === 'builder' ? <FormCanvas /> : <FormPreview />}
          </main>
        </div>
      </FormBuilderProvider>
    </ToastProvider>
  );
}
