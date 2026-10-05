'use client';

import { useCallback, useState } from 'react';
import { useEditorState } from '@/hooks/use-editor-state';
import { exportImage } from '@/lib/export-image';
import { EditorToolbar } from './editor-toolbar';
import { EditorPanel } from './editor-panel';
import { PreviewCanvas } from './preview-canvas';
import { Toast } from './toast';

export default function Editor() {
  const editor = useEditorState();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleExport = useCallback(
    async (format: 'png' | 'jpg') => {
      if (!editor.state.text.trim()) {
        showToast('Please enter some text before exporting.', 'error');
        return;
      }
      setIsExporting(true);
      try {
        await exportImage(editor.state, format);
        showToast(`Image exported as ${format.toUpperCase()} successfully!`, 'success');
      } catch (error) {
        console.error('Export error:', error);
        showToast('Export failed. Please try again.', 'error');
      } finally {
        setIsExporting(false);
      }
    },
    [editor.state, showToast]
  );

  // Listen for keyboard export shortcut
  if (typeof window !== 'undefined') {
    window.addEventListener(
      'editor:export',
      () => handleExport('png'),
      { once: true }
    );
  }

  return (
    <div className="flex h-screen flex-col">
      {/* Top Toolbar */}
      <EditorToolbar
        onReset={editor.reset}
        onUndo={editor.undo}
        onRedo={editor.redo}
        canUndo={editor.canUndo}
        canRedo={editor.canRedo}
        onExport={handleExport}
        isExporting={isExporting}
      />

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Controls */}
        <div className="w-[380px] shrink-0 border-r border-slate-200 bg-white overflow-y-auto custom-scrollbar max-lg:hidden">
          <EditorPanel
            state={editor.state}
            updateField={editor.updateField}
            updateFields={editor.updateFields}
            updateFieldLive={editor.updateFieldLive}
          />
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
          <PreviewCanvas state={editor.state} />
        </div>

        {/* Mobile Panel */}
        <MobilePanel
          editor={editor}
          onExport={handleExport}
          isExporting={isExporting}
        />
      </div>

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

/** Mobile floating panel for small screens */
function MobilePanel({
  editor,
  onExport,
  isExporting,
}: {
  editor: ReturnType<typeof useEditorState>;
  onExport: (format: 'png' | 'jpg') => void;
  isExporting: boolean;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 lg:hidden flex items-center justify-center w-14 h-14 rounded-full bg-indigo-500 text-white shadow-lg hover:bg-indigo-600 transition-colors"
        aria-label="Toggle editor controls"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <>
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </>
          )}
        </svg>
      </button>

      {/* Mobile panel overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 max-h-[75vh] bg-white rounded-t-2xl shadow-2xl overflow-y-auto custom-scrollbar">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between z-10">
              <h3 className="font-semibold text-slate-800">Editor Controls</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-slate-100 rounded"
                aria-label="Close panel"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <EditorPanel
              state={editor.state}
              updateField={editor.updateField}
              updateFields={editor.updateFields}
              updateFieldLive={editor.updateFieldLive}
            />
            <div className="p-4 border-t border-slate-200 flex gap-2">
              <button
                onClick={() => { onExport('png'); setIsOpen(false); }}
                disabled={isExporting}
                className="flex-1 py-2.5 bg-indigo-500 text-white rounded-lg font-medium text-sm hover:bg-indigo-600 disabled:opacity-50 transition-colors"
              >
                Download PNG
              </button>
              <button
                onClick={() => { onExport('jpg'); setIsOpen(false); }}
                disabled={isExporting}
                className="flex-1 py-2.5 bg-slate-700 text-white rounded-lg font-medium text-sm hover:bg-slate-800 disabled:opacity-50 transition-colors"
              >
                Download JPG
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
