'use client';

import {
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
} from 'lucide-react';
import { EditorState, TextAlign } from '@/types/editor';
import { FONT_OPTIONS, FONT_WEIGHT_OPTIONS } from '@/lib/presets';

interface TypographyControlsProps {
  state: EditorState;
  updateField: <K extends keyof EditorState>(field: K, value: EditorState[K]) => void;
  updateFieldLive: <K extends keyof EditorState>(field: K, value: EditorState[K]) => void;
}

export function TypographyControls({
  state,
  updateField,
  updateFieldLive,
}: TypographyControlsProps) {
  return (
    <div className="space-y-4">
      {/* Font Family */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1.5">
          Font Family
        </label>
        <select
          value={state.fontFamily}
          onChange={(e) => updateField('fontFamily', e.target.value)}
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
        >
          <optgroup label="Sinhala Fonts">
            {FONT_OPTIONS.filter((f) => f.category === 'sinhala').map((font) => (
              <option key={font.value} value={font.value}>
                {font.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="General Fonts">
            {FONT_OPTIONS.filter((f) => f.category === 'general').map((font) => (
              <option key={font.value} value={font.value}>
                {font.name}
              </option>
            ))}
          </optgroup>
        </select>
      </div>

      {/* Font Size */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-slate-500">Font Size</label>
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={state.fontSize}
              onChange={(e) => {
                const v = parseInt(e.target.value);
                if (v >= 12 && v <= 160) updateField('fontSize', v);
              }}
              className="w-14 rounded border border-slate-200 px-2 py-0.5 text-xs text-center text-slate-700"
              min={12}
              max={160}
            />
            <span className="text-xs text-slate-400">px</span>
          </div>
        </div>
        <input
          type="range"
          min={12}
          max={160}
          value={state.fontSize}
          onChange={(e) => updateFieldLive('fontSize', parseInt(e.target.value))}
          onMouseUp={(e) => updateField('fontSize', parseInt((e.target as HTMLInputElement).value))}
          onTouchEnd={(e) => updateField('fontSize', parseInt((e.target as HTMLInputElement).value))}
        />
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-1.5">
          Font Weight
        </label>
        <select
          value={state.fontWeight}
          onChange={(e) => updateField('fontWeight', parseInt(e.target.value))}
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
        >
          {FONT_WEIGHT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label} ({opt.value})
            </option>
          ))}
        </select>
      </div>

      {/* Bold / Italic / Alignment */}
      <div className="flex items-center gap-2">
        <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
          <ToggleButton
            active={state.bold}
            onClick={() => updateField('bold', !state.bold)}
            label="Bold"
          >
            <Bold className="h-4 w-4" />
          </ToggleButton>
          <div className="w-px h-6 bg-slate-200" />
          <ToggleButton
            active={state.italic}
            onClick={() => updateField('italic', !state.italic)}
            label="Italic"
          >
            <Italic className="h-4 w-4" />
          </ToggleButton>
        </div>

        <div className="flex-1" />

        <div className="flex items-center rounded-lg border border-slate-200 overflow-hidden">
          {(['left', 'center', 'right'] as TextAlign[]).map((align) => (
            <ToggleButton
              key={align}
              active={state.textAlign === align}
              onClick={() => updateField('textAlign', align)}
              label={`Align ${align}`}
            >
              {align === 'left' && <AlignLeft className="h-4 w-4" />}
              {align === 'center' && <AlignCenter className="h-4 w-4" />}
              {align === 'right' && <AlignRight className="h-4 w-4" />}
            </ToggleButton>
          ))}
        </div>
      </div>

      {/* Line Height */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-slate-500">Line Height</label>
          <span className="text-xs text-slate-400">{state.lineHeight.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min={100}
          max={250}
          value={Math.round(state.lineHeight * 100)}
          onChange={(e) => updateFieldLive('lineHeight', parseInt(e.target.value) / 100)}
          onMouseUp={(e) => updateField('lineHeight', parseInt((e.target as HTMLInputElement).value) / 100)}
          onTouchEnd={(e) => updateField('lineHeight', parseInt((e.target as HTMLInputElement).value) / 100)}
        />
      </div>

      {/* Letter Spacing */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-slate-500">Letter Spacing</label>
          <span className="text-xs text-slate-400">{state.letterSpacing}px</span>
        </div>
        <input
          type="range"
          min={-5}
          max={20}
          value={state.letterSpacing}
          onChange={(e) => updateFieldLive('letterSpacing', parseInt(e.target.value))}
          onMouseUp={(e) => updateField('letterSpacing', parseInt((e.target as HTMLInputElement).value))}
          onTouchEnd={(e) => updateField('letterSpacing', parseInt((e.target as HTMLInputElement).value))}
        />
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center h-8 w-8 transition-colors ${
        active
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-slate-500 hover:bg-slate-50'
      }`}
      title={label}
      aria-label={label}
      aria-pressed={active}
    >
      {children}
    </button>
  );
}
