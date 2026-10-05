'use client';

import { EditorState, BackgroundType, GradientDirection } from '@/types/editor';
import { BACKGROUND_PRESETS, GRADIENT_DIRECTIONS } from '@/lib/presets';
import { InlineColorPicker } from './color-picker';

interface BackgroundControlsProps {
  state: EditorState;
  updateField: <K extends keyof EditorState>(field: K, value: EditorState[K]) => void;
  updateFields: (fields: Partial<EditorState>) => void;
}

export function BackgroundControls({
  state,
  updateField,
  updateFields,
}: BackgroundControlsProps) {
  return (
    <div className="space-y-4">
      {/* Background Type Toggle */}
      <div className="flex rounded-lg border border-slate-200 overflow-hidden">
        <TypeButton
          active={state.backgroundType === 'solid'}
          onClick={() => updateField('backgroundType', 'solid')}
          label="Solid"
        />
        <TypeButton
          active={state.backgroundType === 'gradient'}
          onClick={() => updateField('backgroundType', 'gradient')}
          label="Gradient"
        />
      </div>

      {/* Solid Color */}
      {state.backgroundType === 'solid' && (
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-2">
            Background Color
          </label>
          <InlineColorPicker
            color={state.backgroundColor}
            onChange={(c) => updateField('backgroundColor', c)}
            label="Background color"
          />
        </div>
      )}

      {/* Gradient */}
      {state.backgroundType === 'gradient' && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                Start
              </label>
              <InlineColorPicker
                color={state.gradientStart}
                onChange={(c) => updateField('gradientStart', c)}
                label="Gradient start"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1.5">
                End
              </label>
              <InlineColorPicker
                color={state.gradientEnd}
                onChange={(c) => updateField('gradientEnd', c)}
                label="Gradient end"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1.5">
              Direction
            </label>
            <select
              value={state.gradientDirection}
              onChange={(e) =>
                updateField('gradientDirection', e.target.value as GradientDirection)
              }
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 cursor-pointer"
            >
              {GRADIENT_DIRECTIONS.map((dir) => (
                <option key={dir.value} value={dir.value}>
                  {dir.label}
                </option>
              ))}
            </select>
          </div>

          {/* Gradient preview */}
          <div
            className="h-8 w-full rounded-lg border border-slate-200"
            style={{
              background: `linear-gradient(${state.gradientDirection}, ${state.gradientStart}, ${state.gradientEnd})`,
            }}
          />
        </div>
      )}

      {/* Presets */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-2">
          Presets
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {BACKGROUND_PRESETS.map((preset) => {
            const bgStyle =
              preset.type === 'gradient'
                ? {
                    background: `linear-gradient(${preset.gradientDirection || 'to bottom right'}, ${preset.gradientStart}, ${preset.gradientEnd})`,
                  }
                : { backgroundColor: preset.color };

            const isActive =
              state.backgroundType === preset.type &&
              (preset.type === 'solid'
                ? state.backgroundColor === preset.color
                : state.gradientStart === preset.gradientStart &&
                  state.gradientEnd === preset.gradientEnd);

            return (
              <button
                key={preset.name}
                onClick={() => {
                  if (preset.type === 'solid') {
                    updateFields({
                      backgroundType: 'solid',
                      backgroundColor: preset.color!,
                    });
                  } else {
                    updateFields({
                      backgroundType: 'gradient',
                      gradientStart: preset.gradientStart!,
                      gradientEnd: preset.gradientEnd!,
                      gradientDirection: preset.gradientDirection!,
                    });
                  }
                }}
                className={`group relative h-10 rounded-lg border-2 transition-all hover:scale-105 ${
                  isActive
                    ? 'border-indigo-500 ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
                style={bgStyle}
                title={preset.name}
                aria-label={`${preset.name} background`}
              >
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                    {preset.name}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TypeButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-indigo-50 text-indigo-600'
          : 'text-slate-500 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );
}
