'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2, Download, Loader2, Image as ImageIcon, ChevronDown } from 'lucide-react';
import { drawMoviePost, MoviePostData } from '@/lib/movie-export';
import { ColorPicker } from './color-picker';
import { FONT_OPTIONS, FONT_WEIGHT_OPTIONS } from '@/lib/presets';

interface MoviePostModalProps {
  onClose: () => void;
}

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  expandSignal?: number;
  collapseSignal?: number;
}

function AccordionSection({ title, children, defaultOpen = false, expandSignal = 0, collapseSignal = 0 }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    if (expandSignal > 0) setIsOpen(true);
  }, [expandSignal]);

  useEffect(() => {
    if (collapseSignal > 0) setIsOpen(false);
  }, [collapseSignal]);

  return (
    <div className="border-b border-slate-200 last:border-0 py-4 first:pt-0">
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

const MOVIE_TEMPLATES = [
  {
    name: 'Dark Cinematic',
    themeColor: '#fbbf24', // amber
    backgroundColor: '#0a0a0a',
    titleColor: '#fbbf24',
    detailsColor: '#e5e7eb',
    fontFamily: 'Noto Sans Sinhala',
  },
  {
    name: 'Neon Cyberpunk',
    themeColor: '#06b6d4', // cyan
    backgroundColor: '#09090b',
    titleColor: '#c084fc', // purple
    detailsColor: '#67e8f9',
    fontFamily: 'Stick No Bills',
  },
  {
    name: 'Classic Golden',
    themeColor: '#d97706',
    backgroundColor: '#1c1917',
    titleColor: '#fcd34d',
    detailsColor: '#d6d3d1',
    fontFamily: 'Abhaya Libre',
  },
  {
    name: 'Bright Minimalist',
    themeColor: '#334155',
    backgroundColor: '#f8fafc',
    titleColor: '#0f172a',
    detailsColor: '#475569',
    fontFamily: 'Inter',
  }
];

export function MoviePostModal({ onClose }: MoviePostModalProps) {
  const [images, setImages] = useState<string[]>([]);
  const [logo, setLogo] = useState<string | null>('/logo.jpg');
  const [title, setTitle] = useState('My Awesome Movie (2025)');
  const [details, setDetails] = useState('Directed by Christopher Nolan.\nStarring: Cillian Murphy, Emily Blunt.\nA breathtaking cinematic masterpiece that pushes the boundaries of visual storytelling.');
  const [themeColor, setThemeColor] = useState(MOVIE_TEMPLATES[0].themeColor);
  const [backgroundColor, setBackgroundColor] = useState(MOVIE_TEMPLATES[0].backgroundColor);
  const [titleColor, setTitleColor] = useState(MOVIE_TEMPLATES[0].titleColor);
  const [detailsColor, setDetailsColor] = useState(MOVIE_TEMPLATES[0].detailsColor);
  const [titleFontFamily, setTitleFontFamily] = useState(MOVIE_TEMPLATES[0].fontFamily);
  const [detailsFontFamily, setDetailsFontFamily] = useState(MOVIE_TEMPLATES[0].fontFamily);
  
  const [titleSize, setTitleSize] = useState(64);
  const [detailsSize, setDetailsSize] = useState(36);
  const [titleWeight, setTitleWeight] = useState(900);
  const [detailsWeight, setDetailsWeight] = useState(400);
  const [titleAlign, setTitleAlign] = useState<'left' | 'center' | 'right'>('center');
  const [detailsAlign, setDetailsAlign] = useState<'left' | 'center' | 'right'>('center');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '4:5' | '9:16' | '16:9'>('4:5');
  const [logoSize, setLogoSize] = useState(160);
  const [logoYOffset, setLogoYOffset] = useState(60);
  const [logoXOffset, setLogoXOffset] = useState(0);
  const [logoCircularFrame, setLogoCircularFrame] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  const [expandSignal, setExpandSignal] = useState(0);
  const [collapseSignal, setCollapseSignal] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const data: MoviePostData = { 
    images, logo, title, details, themeColor, 
    titleColor, detailsColor, titleFontFamily, detailsFontFamily, titleAlign, detailsAlign,
    titleSize, detailsSize, backgroundColor, aspectRatio,
    logoSize, logoYOffset, logoXOffset, logoCircularFrame, titleWeight, detailsWeight
  };

  useEffect(() => {
    if (canvasRef.current) {
      drawMoviePost(canvasRef.current, data);
    }
  }, [images, logo, title, details, themeColor, titleColor, detailsColor, titleFontFamily, detailsFontFamily, titleAlign, detailsAlign, titleSize, detailsSize, backgroundColor, aspectRatio, logoSize, logoYOffset, logoXOffset, logoCircularFrame, titleWeight, detailsWeight]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).slice(0, 3 - images.length);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (ev) => {
          if (ev.target?.result) {
            setImages(prev => [...prev, ev.target!.result as string].slice(0, 3));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setLogo(ev.target.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const applyTemplate = (templateName: string) => {
    if (!templateName) return;
    const template = MOVIE_TEMPLATES.find(t => t.name === templateName);
    if (template) {
      setThemeColor(template.themeColor);
      setBackgroundColor(template.backgroundColor);
      setTitleColor(template.titleColor);
      setDetailsColor(template.detailsColor);
      setTitleFontFamily(template.fontFamily);
      setDetailsFontFamily(template.fontFamily);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const canvas = document.createElement('canvas');
      await drawMoviePost(canvas, data);
      const url = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = 'movie-post.png';
      link.href = url;
      link.click();
    } catch (e) {
      console.error(e);
      alert('Export failed.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <ImageIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Movie Post Maker</h2>
              <p className="text-xs text-slate-500">Create beautiful cinematic collages for your movie channel</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-2 text-xs font-medium border-r border-slate-200 pr-4">
              <button 
                onClick={() => setExpandSignal(prev => prev + 1)}
                className="text-slate-500 hover:text-indigo-600 transition-colors"
              >
                Expand All
              </button>
              <button 
                onClick={() => setCollapseSignal(prev => prev + 1)}
                className="text-slate-500 hover:text-indigo-600 transition-colors"
              >
                Collapse All
              </button>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex overflow-hidden min-h-0">
          
          {/* Left Panel: Controls */}
          <div className="w-1/2 flex flex-col border-r border-slate-100 bg-white z-10 custom-scrollbar overflow-y-auto p-6">
            
            <AccordionSection title="Media & Branding" defaultOpen={true} expandSignal={expandSignal} collapseSignal={collapseSignal}>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-medium text-slate-600 mb-2">Movie Images (Max 3)</h3>
                  <div className="flex gap-3 mb-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200 group">
                        <img src={img} alt="Movie upload" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setImages(images.filter((_, i) => i !== idx))}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    ))}
                    {images.length < 3 && (
                      <label className="w-24 h-24 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:border-indigo-400 hover:text-indigo-500 transition-colors cursor-pointer bg-slate-50">
                        <Upload className="h-5 w-5 mb-1" />
                        <span className="text-[10px] font-medium">Upload</span>
                        <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-slate-600 mb-2">Channel Logo</h3>
                  <div className="flex gap-3">
                    {logo ? (
                      <div className="relative h-16 w-32 rounded-lg overflow-hidden border border-slate-200 group bg-black/10">
                        <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                        <button 
                          onClick={() => setLogo(null)}
                          className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="h-5 w-5 text-white" />
                        </button>
                      </div>
                    ) : (
                      <label className="h-16 w-32 rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-500 hover:border-indigo-400 hover:text-indigo-500 transition-colors cursor-pointer bg-slate-50">
                        <Upload className="h-4 w-4 mb-1" />
                        <span className="text-[10px] font-medium">Upload Logo</span>
                        <input type="file" accept="image/png, image/jpeg" onChange={handleLogoUpload} className="hidden" />
                      </label>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-2 mb-4">Upload a PNG with a transparent background for best results.</p>
                  
                  {logo && (
                    <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100 mt-2">
                      <div className="col-span-2 flex items-center justify-between bg-white px-3 py-2 rounded border border-slate-200 shadow-sm">
                        <label className="text-[11px] font-medium text-slate-700 cursor-pointer" onClick={() => setLogoCircularFrame(!logoCircularFrame)}>
                          Circular Frame Crop
                        </label>
                        <button
                          onClick={() => setLogoCircularFrame(!logoCircularFrame)}
                          className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors focus:outline-none ${logoCircularFrame ? 'bg-indigo-500' : 'bg-slate-300'}`}
                        >
                          <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${logoCircularFrame ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
                        </button>
                      </div>
                      
                      <div className="col-span-2">
                        <label className="block text-[10px] font-medium text-slate-600 mb-1">Logo Size ({logoSize}px)</label>
                        <input 
                          type="range" min="50" max="400" value={logoSize} 
                          onChange={(e) => setLogoSize(Number(e.target.value))}
                          className="w-full h-1"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-slate-600 mb-1">Horizontal Offset ({logoXOffset}px)</label>
                        <input 
                          type="range" min="-1200" max="1200" value={logoXOffset} 
                          onChange={(e) => setLogoXOffset(Number(e.target.value))}
                          className="w-full h-1"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-medium text-slate-600 mb-1">Vertical Offset ({logoYOffset}px)</label>
                        <input 
                          type="range" min="10" max="200" value={logoYOffset} 
                          onChange={(e) => setLogoYOffset(Number(e.target.value))}
                          className="w-full h-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </AccordionSection>

            <AccordionSection title="Movie Details" defaultOpen={true} expandSignal={expandSignal} collapseSignal={collapseSignal}>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">Movie Title</label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 rounded-lg border border-slate-200 bg-white text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 font-sinhala"
                    placeholder="E.g. Inception (2010)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-2">Details / Review</label>
                  <textarea 
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full h-32 p-3 rounded-lg border border-slate-200 bg-white text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 resize-none font-sinhala"
                    placeholder="Add your review, cast details, or rating here..."
                  />
                </div>
              </div>
            </AccordionSection>

            <AccordionSection title="Typography & Styling" defaultOpen={true} expandSignal={expandSignal} collapseSignal={collapseSignal}>
              <div className="space-y-4">
                
                {/* Templates Dropdown */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Suggested Vibe Templates</label>
                  <select
                    onChange={(e) => applyTemplate(e.target.value)}
                    className="w-full text-sm rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2"
                  >
                    <option value="">-- Choose a vibe to auto-fill styles --</option>
                    {MOVIE_TEMPLATES.map(t => (
                      <option key={t.name} value={t.name}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* TITLE STYLING */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Title Styling</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Font Family</label>
                      <select
                        value={titleFontFamily}
                        onChange={(e) => setTitleFontFamily(e.target.value)}
                        className="w-full text-sm rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2"
                      >
                        {FONT_OPTIONS.map(font => (
                          <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Font Weight</label>
                      <select
                        value={titleWeight}
                        onChange={(e) => setTitleWeight(Number(e.target.value))}
                        className="w-full text-sm rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2"
                      >
                        {FONT_WEIGHT_OPTIONS.map(weight => (
                          <option key={weight.value} value={weight.value}>{weight.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Size ({titleSize}px)</label>
                      <input 
                        type="range" min="32" max="120" value={titleSize} 
                        onChange={(e) => setTitleSize(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Alignment</label>
                      <div className="flex bg-white rounded-lg border border-slate-300 overflow-hidden">
                        {(['left', 'center', 'right'] as const).map(align => (
                          <button
                            key={align}
                            onClick={() => setTitleAlign(align)}
                            className={`flex-1 py-1 text-xs font-medium capitalize transition-colors ${titleAlign === align ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}
                          >
                            {align}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <ColorPicker color={titleColor} onChange={setTitleColor} label="Title Color" />
                </div>

                {/* DETAILS STYLING */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Details Styling</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Font Family</label>
                      <select
                        value={detailsFontFamily}
                        onChange={(e) => setDetailsFontFamily(e.target.value)}
                        className="w-full text-sm rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2"
                      >
                        {FONT_OPTIONS.map(font => (
                          <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>
                            {font.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Font Weight</label>
                      <select
                        value={detailsWeight}
                        onChange={(e) => setDetailsWeight(Number(e.target.value))}
                        className="w-full text-sm rounded-lg border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2"
                      >
                        {FONT_WEIGHT_OPTIONS.map(weight => (
                          <option key={weight.value} value={weight.value}>{weight.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Size ({detailsSize}px)</label>
                      <input 
                        type="range" min="16" max="64" value={detailsSize} 
                        onChange={(e) => setDetailsSize(Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Alignment</label>
                      <div className="flex bg-white rounded-lg border border-slate-300 overflow-hidden">
                        {(['left', 'center', 'right'] as const).map(align => (
                          <button
                            key={align}
                            onClick={() => setDetailsAlign(align)}
                            className={`flex-1 py-1 text-xs font-medium capitalize transition-colors ${detailsAlign === align ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}
                          >
                            {align}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <ColorPicker color={detailsColor} onChange={setDetailsColor} label="Details Color" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <ColorPicker color={backgroundColor} onChange={setBackgroundColor} label="Background Color" />
                  <ColorPicker color={themeColor} onChange={setThemeColor} label="Accent Line Color" />
                </div>
              </div>
            </AccordionSection>

            <AccordionSection title="Settings" defaultOpen={true} expandSignal={expandSignal} collapseSignal={collapseSignal}>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">Aspect Ratio (Image Size)</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['1:1', '4:5', '9:16', '16:9'] as const).map(ratio => (
                    <button
                      key={ratio}
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-2 px-1 text-xs font-medium rounded-lg border transition-colors ${
                        aspectRatio === ratio 
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 mt-2">
                  1:1 (Square), 4:5 (Instagram Portrait), 9:16 (Stories/Reels), 16:9 (Widescreen)
                </p>
              </div>
            </AccordionSection>

          </div>

          {/* Right Panel: Live Canvas Preview */}
          <div className="w-1/2 bg-slate-900 overflow-y-auto custom-scrollbar p-8 flex flex-col justify-center items-center">
            <div className="relative shadow-2xl shrink-0" 
                 style={{ 
                   width: '100%', 
                   maxWidth: aspectRatio === '16:9' ? '500px' : '350px', 
                   aspectRatio: aspectRatio.replace(':', '/') 
                 }}>
              <canvas 
                ref={canvasRef}
                className="absolute inset-0 w-full h-full rounded-md object-contain bg-black"
              />
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between shrink-0">
          <div className="text-sm text-slate-500">
            {isExporting ? 'Exporting Image...' : 'Cinematic Movie Post Generator'}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isExporting}
              className="px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting || images.length === 0}
              className="px-5 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isExporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
              Export High-Res Image
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
