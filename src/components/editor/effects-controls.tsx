'use client';

import { EditorState, TextShadowConfig, TextStrokeConfig } from '@/types/editor';
import { InlineColorPicker } from './color-picker';

interface EffectsControlsProps {
  state: EditorState;
  updateField: <K extends keyof EditorState>(field: K, value: EditorState[K]) => void;
  updateFieldLive: <K extends keyof EditorState>(field: K, value: EditorState[K]) => void;
}

export function EffectsControls({ state, updateField, updateFieldLive }: EffectsControlsProps) {
  const updateShadow = (updates: Partial<TextShadowConfig>) => {
    updateField('textShadow', { ...state.textShadow, ...updates });
  };

  const updateShadowLive = (updates: Partial<TextShadowConfig>) => {
    updateFieldLive('textShadow', { ...state.textShadow, ...updates });
  };

  const updateStroke = (updates: Partial<TextStrokeConfig>) => {
    updateField('textStroke', { ...state.textStroke, ...updates });
  };

  const updateStrokeLive = (updates: Partial<TextStrokeConfig>) => {
    updateFieldLive('textStroke', { ...state.textStroke, ...updates });
  };

  return (
    <div className="space-y-5">
      {/* Text Shadow */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500">Text Shadow</span>
          <ToggleSwitch
            enabled={state.textShadow.enabled}
            onChange={(enabled) => updateShadow({ enabled })}
            label="Enable text shadow"
          />
        </div>

        {state.textShadow.enabled && (
          <div className="space-y-3 pl-1">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Shadow Color</label>
              <InlineColorPicker
                color={state.textShadow.color}
                onChange={(color) => updateShadow({ color })}
                label="Shadow color"
              />
            </div>
            <SliderField
              label="Blur"
              value={state.textShadow.blur}
              min={0}
              max={30}
              unit="px"
              onChange={(v) => updateShadowLive({ blur: v })}
              onCommit={(v) => updateShadow({ blur: v })}
            />
            <SliderField
              label="X Offset"
              value={state.textShadow.offsetX}
              min={-20}
              max={20}
              unit="px"
              onChange={(v) => updateShadowLive({ offsetX: v })}
              onCommit={(v) => updateShadow({ offsetX: v })}
            />
            <SliderField
              label="Y Offset"
              value={state.textShadow.offsetY}
              min={-20}
              max={20}
              unit="px"
              onChange={(v) => updateShadowLive({ offsetY: v })}
              onCommit={(v) => updateShadow({ offsetY: v })}
            />
            <SliderField
              label="Opacity"
              value={Math.round(state.textShadow.opacity * 100)}
              min={0}
              max={100}
              unit="%"
              onChange={(v) => updateShadowLive({ opacity: v / 100 })}
              onCommit={(v) => updateShadow({ opacity: v / 100 })}
            />
          </div>
        )}
      </div>

      {/* Text Stroke */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-500">Text Stroke</span>
          <ToggleSwitch
            enabled={state.textStroke.enabled}
            onChange={(enabled) => updateStroke({ enabled })}
            label="Enable text stroke"
          />
        </div>

        {state.textStroke.enabled && (
          <div className="space-y-3 pl-1">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Stroke Color</label>
              <InlineColorPicker
                color={state.textStroke.color}
                onChange={(color) => updateStroke({ color })}
                label="Stroke color"
              />
            </div>
            <SliderField
              label="Stroke Width"
              value={state.textStroke.width}
              min={1}
              max={10}
              unit="px"
              onChange={(v) => updateStrokeLive({ width: v })}
              onCommit={(v) => updateStroke({ width: v })}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/** Toggle switch component */
function ToggleSwitch({
  enabled,
  onChange,
  label,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label: string;
}) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      aria-label={label}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
        enabled ? 'bg-indigo-500' : 'bg-slate-200'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white transition-transform shadow-sm ${
          enabled ? 'translate-x-4' : 'translate-x-0.5'
        }`}
      />
    </button>
  );
}

/** Reusable slider field */
function SliderField({
  label,
  value,
  min,
  max,
  unit,
  onChange,
  onCommit,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
  onCommit: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-400">{label}</span>
        <span className="text-xs text-slate-400">
          {value}{unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        onMouseUp={(e) => onCommit(parseInt((e.target as HTMLInputElement).value))}
        onTouchEnd={(e) => onCommit(parseInt((e.target as HTMLInputElement).value))}
      />
    </div>
  );
}
