'use client';

import { EditorState } from '@/types/editor';
import { POSITION_PRESETS } from '@/lib/presets';

interface PositionControlsProps {
  state: EditorState;
  updateField: <K extends keyof EditorState>(field: K, value: EditorState[K]) => void;
  updateFields: (fields: Partial<EditorState>) => void;
  updateFieldLive: <K extends keyof EditorState>(field: K, value: EditorState[K]) => void;
}

export function PositionControls({
  state,
  updateField,
  updateFields,
  updateFieldLive,
}: PositionControlsProps) {
  return (
    <div className="space-y-4">
      {/* Position presets */}
      <div>
        <label className="block text-xs font-medium text-slate-500 mb-2">
          Quick Position
        </label>
        <div className="flex flex-wrap gap-1.5">
          {POSITION_PRESETS.map((preset) => {
            const isActive =
              state.positionX === preset.x && state.positionY === preset.y;
            return (
              <button
                key={preset.label}
                onClick={() =>
                  updateFields({ positionX: preset.x, positionY: preset.y })
                }
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                    : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Horizontal Position */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-slate-500">
            Horizontal Position
          </label>
          <span className="text-xs text-slate-400">{state.positionX}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={state.positionX}
          onChange={(e) =>
            updateFieldLive('positionX', parseInt(e.target.value))
          }
          onMouseUp={(e) =>
            updateField('positionX', parseInt((e.target as HTMLInputElement).value))
          }
          onTouchEnd={(e) =>
            updateField('positionX', parseInt((e.target as HTMLInputElement).value))
          }
        />
      </div>

      {/* Vertical Position */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-slate-500">
            Vertical Position
          </label>
          <span className="text-xs text-slate-400">{state.positionY}%</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={state.positionY}
          onChange={(e) =>
            updateFieldLive('positionY', parseInt(e.target.value))
          }
          onMouseUp={(e) =>
            updateField('positionY', parseInt((e.target as HTMLInputElement).value))
          }
          onTouchEnd={(e) =>
            updateField('positionY', parseInt((e.target as HTMLInputElement).value))
          }
        />
      </div>

      {/* Padding */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-medium text-slate-500">Padding</label>
          <span className="text-xs text-slate-400">{state.padding}px</span>
        </div>
        <input
          type="range"
          min={0}
          max={200}
          value={state.padding}
          onChange={(e) =>
            updateFieldLive('padding', parseInt(e.target.value))
          }
          onMouseUp={(e) =>
            updateField('padding', parseInt((e.target as HTMLInputElement).value))
          }
          onTouchEnd={(e) =>
            updateField('padding', parseInt((e.target as HTMLInputElement).value))
          }
        />
      </div>
    </div>
  );
}
