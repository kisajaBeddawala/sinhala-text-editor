import { EditorState } from '@/types/editor';
import { waitForFont } from './fonts';
import { STORY_REELS_BACKGROUNDS } from './presets';

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

export function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const paragraphs = text.split('\n');
  const lines: string[] = [];

  for (const paragraph of paragraphs) {
    if (paragraph.trim() === '') {
      lines.push('');
      continue;
    }
    const words = paragraph.split(/\s+/);
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);

      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) {
      lines.push(currentLine);
    }
  }
  return lines;
}

export async function paginateStoryText(
  baseState: EditorState,
  titleText: string,
  storyText: string
): Promise<string[]> {
  const canvasWidth = 1080;
  const canvasHeight = 1920;
  
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return [storyText];

  await waitForFont(baseState.fontFamily, baseState.fontWeight);

  const effectiveWeight = baseState.bold ? Math.max(baseState.fontWeight, 700) : baseState.fontWeight;
  const fontStyle = baseState.italic ? 'italic' : 'normal';
  const fontSize = baseState.fontSize; 
  ctx.font = `${fontStyle} ${effectiveWeight} ${fontSize}px "${baseState.fontFamily}", "Noto Sans Sinhala", sans-serif`;
  (ctx as any).letterSpacing = `${baseState.letterSpacing}px`;

  const padding = 80;
  const maxWidth = canvasWidth - padding * 2;
  const lineHeightPx = fontSize * baseState.lineHeight;

  const titleLines = wrapText(ctx, titleText, maxWidth);
  const titleHeight = titleLines.length * lineHeightPx + 40; 

  const storyLines = wrapText(ctx, storyText, maxWidth);
  
  const availableContentHeight = canvasHeight - padding * 2 - titleHeight;
  const maxLinesPerPage = Math.floor(availableContentHeight / lineHeightPx);
  
  const pages: string[] = [];
  let currentLineIdx = 0;
  
  while (currentLineIdx < storyLines.length) {
    pages.push(storyLines.slice(currentLineIdx, currentLineIdx + maxLinesPerPage).join('\n'));
    currentLineIdx += maxLinesPerPage;
  }
  
  return pages.length > 0 ? pages : [''];
}

export async function drawReelPage(
  canvas: HTMLCanvasElement,
  baseState: EditorState,
  titleText: string,
  pageText: string,
  pageIndex: number,
  titleColor: string = '#fef08a',
  solidBgColor: string | null = null,
  gradientThemeIndex: number | 'cycle' = 'cycle'
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const canvasWidth = 1080;
  const canvasHeight = 1920;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  await waitForFont(baseState.fontFamily, baseState.fontWeight);

  if (solidBgColor) {
    ctx.fillStyle = solidBgColor;
  } else {
    const presetIndex = gradientThemeIndex === 'cycle' ? (pageIndex % STORY_REELS_BACKGROUNDS.length) : gradientThemeIndex;
    const bgPreset = STORY_REELS_BACKGROUNDS[presetIndex];
    if (bgPreset.backgroundType === 'gradient') {
      const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
      gradient.addColorStop(0, bgPreset.gradientStart);
      gradient.addColorStop(1, bgPreset.gradientEnd);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = bgPreset.backgroundColor || '#000';
    }
  }
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  const effectiveWeight = baseState.bold ? Math.max(baseState.fontWeight, 700) : baseState.fontWeight;
  const fontStyle = baseState.italic ? 'italic' : 'normal';
  const fontSize = baseState.fontSize; 
  ctx.font = `${fontStyle} ${effectiveWeight} ${fontSize}px "${baseState.fontFamily}", "Noto Sans Sinhala", sans-serif`;
  (ctx as any).letterSpacing = `${baseState.letterSpacing}px`;

  const padding = 80;
  const maxWidth = canvasWidth - padding * 2;
  const lineHeightPx = fontSize * baseState.lineHeight;

  ctx.textBaseline = 'top';
  if (baseState.textShadow.enabled) {
    ctx.shadowColor = hexToRgba(baseState.textShadow.color, baseState.textShadow.opacity);
    ctx.shadowBlur = baseState.textShadow.blur;
    ctx.shadowOffsetX = baseState.textShadow.offsetX;
    ctx.shadowOffsetY = baseState.textShadow.offsetY;
  }
  ctx.textAlign = baseState.textAlign;

  // Draw Title
  const titleLines = wrapText(ctx, titleText, maxWidth);
  ctx.fillStyle = titleColor; 
  titleLines.forEach((line, index) => {
    let x = padding;
    if (baseState.textAlign === 'center') x = canvasWidth / 2;
    if (baseState.textAlign === 'right') x = canvasWidth - padding;
    ctx.fillText(line, x, padding + index * lineHeightPx);
  });
  const titleHeight = titleLines.length * lineHeightPx + 40;

  // Draw Story
  ctx.fillStyle = baseState.textColor;
  const storyLines = wrapText(ctx, pageText, maxWidth);
  const contentStartY = padding + titleHeight;
  storyLines.forEach((line, index) => {
    let x = padding;
    if (baseState.textAlign === 'center') x = canvasWidth / 2;
    if (baseState.textAlign === 'right') x = canvasWidth - padding;
    ctx.fillText(line, x, contentStartY + index * lineHeightPx);
  });
}

export async function exportAllPages(
  baseState: EditorState,
  titleText: string,
  pages: string[],
  titleColor: string = '#fef08a',
  solidBgColor: string | null = null,
  gradientThemeIndex: number | 'cycle' = 'cycle',
  onProgress?: (current: number, total: number) => void
) {
  const canvas = document.createElement('canvas');
  for (let i = 0; i < pages.length; i++) {
    if (onProgress) onProgress(i + 1, pages.length);
    
    await drawReelPage(canvas, baseState, titleText, pages[i], i, titleColor, solidBgColor, gradientThemeIndex);

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = `story-reel-${i + 1}.png`;
    link.href = dataUrl;
    link.click();
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
}

export async function exportStoryVideo(
  baseState: EditorState,
  titleText: string,
  pages: string[],
  titleColor: string = '#fef08a',
  solidBgColor: string | null = null,
  gradientThemeIndex: number | 'cycle' = 'cycle',
  durationPerPageSeconds: number = 3,
  onProgress?: (progress: number) => void
): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const canvasWidth = 1080;
      const canvasHeight = 1920;

      // 1. Pre-render all pages to offscreen canvases
      const renderedPages: HTMLCanvasElement[] = [];
      for (let i = 0; i < pages.length; i++) {
        const offscreen = document.createElement('canvas');
        offscreen.width = canvasWidth;
        offscreen.height = canvasHeight;
        await drawReelPage(offscreen, baseState, titleText, pages[i], i, titleColor, solidBgColor, gradientThemeIndex);
        renderedPages.push(offscreen);
      }

      // 2. Setup master canvas and recorder
      const masterCanvas = document.createElement('canvas');
      masterCanvas.width = canvasWidth;
      masterCanvas.height = canvasHeight;
      const masterCtx = masterCanvas.getContext('2d');
      if (!masterCtx) throw new Error('Failed to create master canvas');

      const stream = masterCanvas.captureStream(30);
      
      let mimeType = 'video/webm; codecs=vp9';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
      }
      if (MediaRecorder.isTypeSupported('video/mp4')) {
        mimeType = 'video/mp4'; // Safari fallback
      }
      
      const recorder = new MediaRecorder(stream, { 
        mimeType,
        videoBitsPerSecond: 15000000 // 15 Mbps for crisp text
      });
      const chunks: Blob[] = [];

      recorder.ondataavailable = e => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const ext = mimeType === 'video/mp4' ? 'mp4' : 'webm';
        a.download = `story-reel-video.${ext}`;
        a.click();
        URL.revokeObjectURL(url);
        resolve();
      };

      recorder.start();

      const totalDurationMs = pages.length * durationPerPageSeconds * 1000;
      let startTime = performance.now();
      let lastReportedPercent = -1;

      function drawFrame(now: number) {
        const elapsed = now - startTime;
        
        if (onProgress) {
           const percent = Math.floor(Math.min(1, elapsed / totalDurationMs) * 100);
           if (percent > lastReportedPercent) {
             onProgress(percent / 100);
             lastReportedPercent = percent;
           }
        }

        if (elapsed >= totalDurationMs) {
          recorder.stop();
          return;
        }

        const pageIndex = Math.floor(elapsed / (durationPerPageSeconds * 1000));
        masterCtx!.clearRect(0, 0, canvasWidth, canvasHeight);
        masterCtx!.drawImage(renderedPages[Math.min(pageIndex, pages.length - 1)], 0, 0);

        requestAnimationFrame(drawFrame);
      }
      
      requestAnimationFrame(drawFrame);
      
    } catch (e) {
      reject(e);
    }
  });
}
