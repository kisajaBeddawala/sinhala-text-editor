'use client';

import {
  Undo2,
  Redo2,
  RotateCcw,
  Download,
  FilePlus,
  Sparkles,
} from 'lucide-react';

interface EditorToolbarProps {
  onReset: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onExport: (format: 'png' | 'jpg') => void;
  isExporting: boolean;
}

export function EditorToolbar({
  onReset,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onExport,
  isExporting,
}: EditorToolbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
      {/* Left: Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden border border-slate-100 shadow-sm">
            <img src="/logo.png" alt="Sinhala Canvas Logo" className="h-full w-full object-cover" />
          </div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">
            Sinhala Canvas
          </h1>
        </div>
      </div>

      {/* Center: History controls */}
      <div className="hidden sm:flex items-center gap-1">
        <ToolbarButton
          icon={<Undo2 className="h-4 w-4" />}
          label="Undo (Ctrl+Z)"
          onClick={onUndo}
          disabled={!canUndo}
        />
        <ToolbarButton
          icon={<Redo2 className="h-4 w-4" />}
          label="Redo (Ctrl+Shift+Z)"
          onClick={onRedo}
          disabled={!canRedo}
        />
        <div className="mx-2 h-5 w-px bg-slate-200" />
        <ToolbarButton
          icon={<FilePlus className="h-4 w-4" />}
          label="New"
          onClick={onReset}
        />
        <ToolbarButton
          icon={<RotateCcw className="h-4 w-4" />}
          label="Reset"
          onClick={onReset}
        />
      </div>

      {/* Right: Export buttons */}
      <div className="hidden lg:flex items-center gap-2">
        <button
          onClick={() => onExport('jpg')}
          disabled={isExporting}
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          JPG
        </button>
        <button
          onClick={() => onExport('png')}
          disabled={isExporting}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-indigo-600 disabled:opacity-50 transition-all shadow-sm hover:shadow"
        >
          <Download className="h-3.5 w-3.5" />
          {isExporting ? 'Exporting...' : 'Export PNG'}
        </button>
      </div>
    </header>
  );
}

function ToolbarButton({
  icon,
  label,
  onClick,
  disabled,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="flex items-center justify-center h-8 w-8 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
      title={label}
      aria-label={label}
    >
      {icon}
    </button>
  );
}
