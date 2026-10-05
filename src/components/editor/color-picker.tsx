'use client';

import { TEXT_COLOR_PRESETS } from '@/lib/presets';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  label: string;
}

export function ColorPicker({ color, onChange, label }: ColorPickerProps) {
  return (
    <div className="space-y-3">
      {/* Color input + hex */}
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) {
              onChange(v);
            }
          }}
          onBlur={(e) => {
            const v = e.target.value;
            if (!/^#[0-9A-Fa-f]{6}$/.test(v)) {
              onChange(color); // revert
            }
          }}
          className="flex-1 rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-sm font-mono text-slate-700 uppercase"
          placeholder="#FFFFFF"
          maxLength={7}
        />
      </div>

      {/* Preset colors */}
      <div className="flex flex-wrap gap-1.5">
        {TEXT_COLOR_PRESETS.map((preset) => (
          <button
            key={preset.value}
            onClick={() => onChange(preset.value)}
            className={`h-7 w-7 rounded-lg border-2 transition-all hover:scale-110 ${
              color === preset.value
                ? 'border-indigo-500 ring-2 ring-indigo-200'
                : 'border-slate-200 hover:border-slate-300'
            }`}
            style={{ backgroundColor: preset.value }}
            title={preset.name}
            aria-label={`Select ${preset.name} color`}
          />
        ))}
      </div>
    </div>
  );
}

/** Standalone color input for inline use */
export function InlineColorPicker({
  color,
  onChange,
  label,
}: {
  color: string;
  onChange: (color: string) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-7"
        aria-label={label}
      />
      <input
        type="text"
        value={color}
        onChange={(e) => {
          const v = e.target.value;
          if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onChange(v);
        }}
        className="w-20 rounded border border-slate-200 bg-slate-50/50 px-2 py-1 text-xs font-mono text-slate-600 uppercase"
        maxLength={7}
      />
    </div>
  );
}
