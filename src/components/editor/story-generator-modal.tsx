'use client';

import { useState, useRef, useEffect } from 'react';
import { EditorState } from '@/types/editor';
import { paginateStoryText, drawReelPage, exportAllPages, exportStoryVideo } from '@/lib/story-export';
import { STORY_REELS_BACKGROUNDS } from '@/lib/presets';
import { X, Layers, Loader2, ArrowLeft, Plus, Trash2, Palette, FileText, Video, ChevronDown } from 'lucide-react';
import { TypographyControls } from './typography-controls';
import { ColorPicker } from './color-picker';
import { EffectsControls } from './effects-controls';

interface StoryGeneratorModalProps {
  state: EditorState;
  updateField: <K extends keyof EditorState>(field: K, value: EditorState[K]) => void;
  updateFieldLive: <K extends keyof EditorState>(field: K, value: EditorState[K]) => void;
  onClose: () => void;
}

export function StoryGeneratorModal({ state, updateField, updateFieldLive, onClose }: StoryGeneratorModalProps) {
  const [step, setStep] = useState<'input' | 'preview'>('input');
  
  // Input Step State
  const [title, setTitle] = useState('කතා මාලාව: "දකුණු වෙරළේ නිල් සිතුවම"\n\n(01 වන දිගහැරුම: ප්‍රදීපාගාරය පාමුල විසිරුණු සිතුවම්)');
  const [titleColor, setTitleColor] = useState('#fef08a');
  const [solidBgColor, setSolidBgColor] = useState<string | null>(null);
  const [gradientThemeIndex, setGradientThemeIndex] = useState<number | 'cycle'>('cycle');
  const [story, setStory] = useState('');
  const [isSplitting, setIsSplitting] = useState(false);

  // Preview Step State
  const [pages, setPages] = useState<string[]>([]);
  const [selectedPageIndex, setSelectedPageIndex] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingVideo, setIsExportingVideo] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [sidebarTab, setSidebarTab] = useState<'content' | 'style'>('content');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleSplit = async () => {
    if (!story.trim() || !title.trim()) return;
    setIsSplitting(true);
    try {
      const generatedPages = await paginateStoryText(state, title, story);
      setPages(generatedPages);
      setSelectedPageIndex(0);
      setStep('preview');
    } catch (e) {
      console.error(e);
      alert('Failed to split text');
    } finally {
      setIsSplitting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportAllPages(state, title, pages, titleColor, solidBgColor, gradientThemeIndex, (current, total) => {
        setProgress({ current, total });
      });
    } catch (error) {
      console.error(error);
      alert('Failed to generate story images.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportVideo = async () => {
    setIsExportingVideo(true);
    setVideoProgress(0);
    try {
      await exportStoryVideo(state, title, pages, titleColor, solidBgColor, gradientThemeIndex, 5, (prog) => {
        setVideoProgress(Math.round(prog * 100));
      });
    } catch (error) {
      console.error(error);
      alert('Failed to generate story video.');
    } finally {
      setIsExportingVideo(false);
    }
  };

  const updatePage = (idx: number, newText: string) => {
    const newPages = [...pages];
    newPages[idx] = newText;
    setPages(newPages);
  };

  const addPage = () => {
    setPages([...pages, '']);
    setSelectedPageIndex(pages.length);
  };

  const removePage = (idx: number) => {
    if (pages.length <= 1) return;
    const newPages = pages.filter((_, i) => i !== idx);
    setPages(newPages);
    if (selectedPageIndex >= newPages.length) {
      setSelectedPageIndex(newPages.length - 1);
    }
  };

  // Live Canvas Preview for selected page
  useEffect(() => {
    if (step === 'preview' && canvasRef.current && pages[selectedPageIndex] !== undefined) {
      drawReelPage(canvasRef.current, state, title, pages[selectedPageIndex], selectedPageIndex, titleColor, solidBgColor, gradientThemeIndex);
    }
  }, [step, title, titleColor, solidBgColor, gradientThemeIndex, pages, selectedPageIndex, state]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white z-10 shrink-0">
          <div className="flex items-center gap-2">
            {step === 'preview' ? (
              <button onClick={() => setStep('input')} className="p-1 hover:bg-slate-100 rounded-lg mr-2 transition-colors">
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
            ) : (
              <Layers className="h-5 w-5 text-indigo-500" />
            )}
            <h2 className="text-lg font-semibold text-slate-800">
              {step === 'input' ? 'Generate Story Reels (9:16)' : 'Preview & Edit Reels'}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            disabled={isExporting || isSplitting || isExportingVideo}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        {step === 'input' ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6 flex flex-col">
            <div className="flex-1 max-w-3xl mx-auto w-full space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sticky Title (Appears on every page)
                </label>
                <textarea
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full h-24 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 resize-none text-sm font-sinhala"
                  disabled={isSplitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Full Story Content
                </label>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full h-80 p-3 rounded-xl border border-slate-200 bg-slate-50 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 resize-none text-sm font-sinhala"
                  placeholder="Paste your long story here. It will automatically be split across multiple pages..."
                  disabled={isSplitting}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-[400px] flex flex-col border-r border-slate-200 bg-slate-50 overflow-hidden shrink-0">
              
              {/* Sidebar Tabs */}
              <div className="flex p-2 gap-1 bg-slate-100/50 border-b border-slate-200">
                <button
                  onClick={() => setSidebarTab('content')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${sidebarTab === 'content' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  <FileText className="h-4 w-4" />
                  Content
                </button>
                <button
                  onClick={() => setSidebarTab('style')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${sidebarTab === 'style' ? 'bg-white text-indigo-600 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
                >
                  <Palette className="h-4 w-4" />
                  Style
                </button>
              </div>

              {sidebarTab === 'content' ? (
                <>
                  <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
                    <h3 className="font-medium text-slate-800 text-sm">Title (Global)</h3>
                  </div>
                  <div className="p-4 bg-white border-b border-slate-200 shrink-0">
                    <textarea
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full h-20 p-2 rounded-lg border border-slate-200 bg-slate-50 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 font-sinhala resize-none"
                    />
                  </div>

                  <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shrink-0">
                    <h3 className="font-medium text-slate-800 text-sm">Pages ({pages.length})</h3>
                    <button onClick={addPage} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors" title="Add Page">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex gap-2 p-4 overflow-x-auto border-b border-slate-200 shrink-0 custom-scrollbar bg-white">
                    {pages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedPageIndex(i)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${selectedPageIndex === i ? 'bg-indigo-500 text-white shadow' : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'}`}
                      >
                        Page {i + 1}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto flex flex-col relative bg-slate-50 custom-scrollbar">
                    <label className="block text-xs font-medium text-slate-500 mb-2">
                      Editing Page {selectedPageIndex + 1} Content
                    </label>
                    <textarea
                      value={pages[selectedPageIndex] || ''}
                      onChange={(e) => updatePage(selectedPageIndex, e.target.value)}
                      className="w-full flex-1 p-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 resize-none text-sm font-sinhala"
                    />
                    {pages.length > 1 && (
                      <button 
                        onClick={() => removePage(selectedPageIndex)}
                        className="absolute bottom-6 right-6 p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors shadow-sm"
                        title="Delete Page"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                  <AccordionSection title="Global Typography" defaultOpen={true}>
                    <TypographyControls
                      state={state}
                      updateField={updateField}
                      updateFieldLive={updateFieldLive}
                    />
                  </AccordionSection>

                  <AccordionSection title="Background">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <h3 className="text-sm font-medium text-slate-600">Background Mode</h3>
                      <button 
                        onClick={() => setSolidBgColor(solidBgColor ? null : '#0f172a')}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                      >
                        {solidBgColor ? 'Use Gradients' : 'Use Solid Color'}
                      </button>
                    </div>
                    
                    {solidBgColor !== null ? (
                      <ColorPicker
                        color={solidBgColor}
                        onChange={setSolidBgColor}
                        label="Background Color"
                      />
                    ) : (
                      <div className="space-y-3">
                        <label className="text-xs text-slate-600 block px-1 font-medium">Gradient Theme</label>
                        <select
                          value={gradientThemeIndex}
                          onChange={(e) => setGradientThemeIndex(e.target.value === 'cycle' ? 'cycle' : Number(e.target.value))}
                          className="w-full text-sm rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2"
                        >
                          <option value="cycle">Dynamic (Cycle all themes per page)</option>
                          {STORY_REELS_BACKGROUNDS.map((bg, idx) => (
                            <option key={idx} value={idx}>{bg.name}</option>
                          ))}
                        </select>
                        <p className="text-xs text-slate-500 px-1">
                          {gradientThemeIndex === 'cycle' ? 
                            'Currently cycling a different gradient for every page.' : 
                            'Applying this specific gradient to all pages.'}
                        </p>
                      </div>
                    )}
                  </AccordionSection>

                  <AccordionSection title="Story Text Color">
                    <ColorPicker
                      color={state.textColor}
                      onChange={(c) => updateField('textColor', c)}
                      label="Story Text Color"
                    />
                  </AccordionSection>

                  <AccordionSection title="Title Text Color">
                    <ColorPicker
                      color={titleColor}
                      onChange={setTitleColor}
                      label="Title Text Color"
                    />
                  </AccordionSection>

                  <AccordionSection title="Text Shadow">
                    <EffectsControls
                      state={state}
                      updateField={updateField}
                      updateFieldLive={updateFieldLive}
                    />
                  </AccordionSection>

                  <div className="pt-4 border-t border-slate-200">
                    <button
                      onClick={handleSplit}
                      disabled={isSplitting}
                      className="w-full px-4 py-2 text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors flex justify-center items-center gap-2"
                    >
                      {isSplitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      Re-calculate Pagination
                    </button>
                    <p className="text-xs text-amber-600 mt-2 text-center">
                      Click this if you change Font Size or Line Height significantly. Note: This will reset manual edits!
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Panel: Live Canvas Preview */}
            <div className="flex-1 bg-slate-900 overflow-y-auto custom-scrollbar p-8 flex flex-col">
              <div className="relative shadow-2xl m-auto shrink-0" style={{ width: '100%', maxWidth: '400px', aspectRatio: '9/16' }}>
                <canvas 
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full rounded-md object-contain bg-black"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
          <div className="text-sm text-slate-500">
            {isExporting ? `Exporting Image ${progress.current} of ${progress.total}...` : 
             isExportingVideo ? `Rendering Video... ${videoProgress}% (Please don't close)` :
             step === 'preview' ? `Previewing page ${selectedPageIndex + 1} of ${pages.length}` : 
             'Paste text to auto-split into pages'}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isExporting || isSplitting || isExportingVideo}
              className="px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            {step === 'input' ? (
              <button
                onClick={handleSplit}
                disabled={isSplitting || !story.trim() || !title.trim()}
                className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isSplitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Split into Pages
              </button>
            ) : (
              <>
                <button
                  onClick={handleExportVideo}
                  disabled={isExportingVideo || isExporting || pages.length === 0}
                  className="px-5 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isExportingVideo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
                  Export Video (5s/page)
                </button>
                <button
                  onClick={handleExport}
                  disabled={isExporting || isExportingVideo || pages.length === 0}
                  className="px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {isExporting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Export All {pages.length} Images
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccordionSection({ title, children, defaultOpen = false }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-slate-200 last:border-0 py-3 first:pt-0">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center justify-between py-2 text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors"
      >
        <span>{title}</span>
        <ChevronDown className={`h-4 w-4 text-slate-400 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="pt-3 pb-2 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}
