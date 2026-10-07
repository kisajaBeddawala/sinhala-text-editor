'use client';

import { FACEBOOK_TEMPLATES } from '@/lib/presets';
import { TemplatePreset } from '@/types/editor';
import { LayoutTemplate } from 'lucide-react';

interface TemplatesGalleryProps {
  onSelectTemplate: (template: TemplatePreset) => void;
}

export function TemplatesGallery({ onSelectTemplate }: TemplatesGalleryProps) {
  return (
    <div className="flex flex-col gap-3 pt-6 border-t border-slate-200">
      <div className="flex items-center gap-2 px-1">
        <LayoutTemplate className="h-4 w-4 text-indigo-500" />
        <h3 className="text-sm font-semibold text-slate-800">Popular Templates</h3>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {FACEBOOK_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="group relative flex flex-col items-start gap-1 rounded-xl border border-slate-200 bg-white p-3 text-left shadow-sm transition-all hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-md"
          >
            <span className="font-medium text-slate-800 group-hover:text-indigo-700 text-sm">
              {template.name}
            </span>
            <span className="text-xs text-slate-500 line-clamp-2">
              {template.description}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
