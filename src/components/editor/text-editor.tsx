'use client';

import { useState } from 'react';
import { singlishToUnicode, unicodeToSinglish } from 'sinhala-text-converters';

interface TextEditorProps {
  text: string;
  onChange: (text: string) => void;
}

export function TextEditor({ text, onChange }: TextEditorProps) {
  const [isSinglish, setIsSinglish] = useState(true);
  const charCount = text.length;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    if (isSinglish) {
      // Round-trip conversion: seamlessly merges existing Sinhala with newly typed English chars
      const singlishText = unicodeToSinglish(input);
      const converted = singlishToUnicode(singlishText);
      onChange(converted);
    } else {
      onChange(input);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={(e) => {
            e.preventDefault();
            setIsSinglish(!isSinglish);
          }}
        >
          <div
            className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
              isSinglish ? 'bg-indigo-500' : 'bg-slate-300'
            }`}
          >
            <span
              className={`inline-block h-2.5 w-2.5 rounded-full bg-white transition-transform shadow-sm ${
                isSinglish ? 'translate-x-3.5' : 'translate-x-1'
              }`}
            />
          </div>
          <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700 transition-colors">
            Singlish Typing (e.g. "amma" → "අම්මා")
          </span>
        </label>
      </div>

      <textarea
        value={text}
        onChange={handleChange}
        placeholder="මෙතන ඔබේ සිංහල පාඨය ඇතුළත් කරන්න..."
        className="w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all resize-y"
        rows={5}
        style={{ fontFamily: "'Noto Sans Sinhala', sans-serif" }}
      />
      <div className="flex justify-end">
        <span className="text-xs text-slate-400">{charCount} characters</span>
      </div>
    </div>
  );
}
