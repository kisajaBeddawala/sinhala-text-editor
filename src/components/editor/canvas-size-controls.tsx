'use client';

import { EditorState } from '@/types/editor';
import { ASPECT_RATIO_PRESETS, CUSTOM_SIZE_PRESETS } from '@/lib/presets';

interface CanvasSizeControlsProps {
  state: EditorState;
  updateField: <K extends keyof EditorState>(field: K, value: EditorState[K]) => void;
  updateFields: (fields: Partial<EditorState>) => void;
}

export function CanvasSizeControls({
  state,
  updateField,
  updateFields,
}: CanvasSizeControlsProps) {
  const isCustom = state.aspectRatio === 'custom';

  return (
    <div className="space-y-4">
      {/* Aspect Ratio Presets */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-2">
          Aspect Ratio
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {ASPECT_RATIO_PRESETS.map((preset) => {
            const isActive = state.aspectRatio === preset.ratio;
            // Calculate visual preview aspect ratio (max 32px height)
            const previewH = 24;
            const previewW = Math.round(
              previewH * (preset.width / preset.height)
            );

            return (
              <button
                key={preset.ratio}
                onClick={() =>
                  updateFields({
                    aspectRatio: preset.ratio,
                    canvasWidth: preset.width,
                    canvasHeight: preset.height,
                  })
                }
                className={`flex flex-col items-center gap-1 rounded-lg border-2 p-2 transition-all ${
                  isActive
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`rounded border ${
                    isActive
                      ? 'border-indigo-300 bg-indigo-200'
                      : 'border-slate-300 bg-slate-200'
                  }`}
                  style={{
                    width: `${Math.max(previewW, 16)}px`,
                    height: `${previewH}px`,
                  }}
                />
                <span
                  className={`text-[10px] font-semibold ${
                    isActive ? 'text-indigo-600' : 'text-slate-500'
                  }`}
                >
                  {preset.ratio}
                </span>
                <span
                  className={`text-[9px] ${
                    isActive ? 'text-indigo-400' : 'text-slate-400'
                  }`}
                >
                  {preset.label}
                </span>
              </button>
            );
          })}

          {/* Custom option */}
          <button
            onClick={() => updateField('aspectRatio', 'custom')}
            className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 p-2 transition-all ${
              isCustom
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={isCustom ? 'text-indigo-500' : 'text-slate-400'}
            >
              <path d="M21 3H3v18h18V3zM3 9h18M3 15h18M9 3v18M15 3v18" />
            </svg>
            <span
              className={`text-[10px] font-semibold ${
                isCustom ? 'text-indigo-600' : 'text-slate-500'
              }`}
            >
              Custom
            </span>
          </button>
        </div>
      </div>

      {/* Custom Dimensions */}
      {isCustom && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Width (px)
              </label>
              <input
                type="number"
                value={state.canvasWidth}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (v > 0 && v <= 4096)
                    updateField('canvasWidth', v);
                }}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700"
                min={100}
                max={4096}
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Height (px)
              </label>
              <input
                type="number"
                value={state.canvasHeight}
                onChange={(e) => {
                  const v = parseInt(e.target.value);
                  if (v > 0 && v <= 4096)
                    updateField('canvasHeight', v);
                }}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700"
                min={100}
                max={4096}
              />
            </div>
          </div>

          {/* Common sizes */}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">
              Common Sizes
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CUSTOM_SIZE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() =>
                    updateFields({
                      canvasWidth: preset.width,
                      canvasHeight: preset.height,
                    })
                  }
                  className={`rounded px-2 py-1 text-[11px] font-medium transition-colors ${
                    state.canvasWidth === preset.width &&
                    state.canvasHeight === preset.height
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                      : 'bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Current size info */}
      <div className="flex items-center justify-center py-1.5 rounded-lg bg-slate-50 border border-slate-100">
        <span className="text-xs text-slate-400">
          Output: {state.canvasWidth} × {state.canvasHeight} px
        </span>
      </div>
    </div>
  );
}
