'use client';

import { useState, ReactNode, createContext, useContext, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { EditorState } from '@/types/editor';
import { TextEditor } from './text-editor';
import { TemplatesGallery } from './templates-gallery';
import { TypographyControls } from './typography-controls';
import { ColorPicker } from './color-picker';
import { BackgroundControls } from './background-controls';
import { EffectsControls } from './effects-controls';
import { PositionControls } from './position-controls';
import { CanvasSizeControls } from './canvas-size-controls';

interface EditorPanelProps {
  state: EditorState;
  updateField: <K extends keyof EditorState>(field: K, value: EditorState[K]) => void;
  updateFields: (fields: Partial<EditorState>) => void;
  updateFieldLive: <K extends keyof EditorState>(field: K, value: EditorState[K]) => void;
}

const ToggleContext = createContext<{ action: 'expand' | 'collapse'; t: number } | null>(null);

export function EditorPanel({ state, updateField, updateFields, updateFieldLive }: EditorPanelProps) {
  const [toggleSignal, setToggleSignal] = useState<{ action: 'expand' | 'collapse'; t: number } | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleAll = () => {
    const newAction = isExpanded ? 'collapse' : 'expand';
    setIsExpanded(!isExpanded);
    setToggleSignal({ action: newAction, t: Date.now() });
  };

  return (
    <ToggleContext.Provider value={toggleSignal}>
      <div className="flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50 sticky top-0 z-10">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Settings</span>
          <button 
            onClick={toggleAll} 
            className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            {isExpanded ? 'Collapse All' : 'Expand All'}
          </button>
        </div>
        <div className="divide-y divide-slate-100">
      <Section title="Text" defaultOpen>
        <TextEditor
          text={state.text}
          onChange={(text) => updateField('text', text)}
        />
      </Section>

      <Section title="Popular Templates" defaultOpen={false}>
        <TemplatesGallery
          onSelectTemplate={(template) => {
            updateFields(template.state);
          }}
        />
      </Section>

      <Section title="Typography" defaultOpen>
        <TypographyControls
          state={state}
          updateField={updateField}
          updateFieldLive={updateFieldLive}
        />
      </Section>

      <Section title="Text Color" defaultOpen>
        <ColorPicker
          color={state.textColor}
          onChange={(color) => updateField('textColor', color)}
          label="Text Color"
        />
      </Section>

      <Section title="Background" defaultOpen>
        <BackgroundControls
          state={state}
          updateField={updateField}
          updateFields={updateFields}
        />
      </Section>

      <Section title="Text Position">
        <PositionControls
          state={state}
          updateField={updateField}
          updateFields={updateFields}
          updateFieldLive={updateFieldLive}
        />
      </Section>

      <Section title="Text Effects">
        <EffectsControls
          state={state}
          updateField={updateField}
          updateFieldLive={updateFieldLive}
        />
      </Section>

      <Section title="Canvas Size" defaultOpen>
        <CanvasSizeControls
          state={state}
          updateField={updateField}
          updateFields={updateFields}
        />
      </Section>
        </div>
      </div>
    </ToggleContext.Provider>
  );
}

/** Collapsible section wrapper */
function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const toggleSignal = useContext(ToggleContext);

  useEffect(() => {
    if (toggleSignal) {
      setIsOpen(toggleSignal.action === 'expand');
    }
  }, [toggleSignal]);

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50/50 transition-colors"
        aria-expanded={isOpen}
      >
        {title}
        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && <div className="px-4 pb-4">{children}</div>}
    </div>
  );
}
