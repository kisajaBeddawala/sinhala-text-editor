import { EditorState } from '@/types/editor';
import { waitForFont } from './fonts';

/**
 * Renders the editor state to a canvas and triggers a download.
 */
export async function exportImage(
  state: EditorState,
  format: 'png' | 'jpg',
  quality: number = 0.92
): Promise<void> {
  const { canvasWidth, canvasHeight } = state;

  // Create offscreen canvas at full resolution
  const canvas = document.createElement('canvas');
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas context');

  // Wait for font to be ready
  await waitForFont(state.fontFamily, state.fontWeight);

  // ── Draw Background ───────────────────────────────────
  if (state.backgroundType === 'gradient') {
    const gradient = createGradient(ctx, state);
    ctx.fillStyle = gradient;
  } else {
    ctx.fillStyle = state.backgroundColor;
  }
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // ── Configure Text ────────────────────────────────────
  const effectiveWeight = state.bold ? Math.max(state.fontWeight, 700) : state.fontWeight;
  const fontStyle = state.italic ? 'italic' : 'normal';
  ctx.font = `${fontStyle} ${effectiveWeight} ${state.fontSize}px "${state.fontFamily}", "Noto Sans Sinhala", sans-serif`;
  ctx.fillStyle = state.textColor;
  ctx.textBaseline = 'top';

  // Text alignment
  let textAlignX: number;
  if (state.textAlign === 'left') {
    ctx.textAlign = 'left';
    textAlignX = state.padding;
  } else if (state.textAlign === 'right') {
    ctx.textAlign = 'right';
    textAlignX = canvasWidth - state.padding;
  } else {
    ctx.textAlign = 'center';
    textAlignX = canvasWidth / 2;
  }

  // ── Text Shadow ───────────────────────────────────────
  if (state.textShadow.enabled) {
    const shadowColor = hexToRgba(state.textShadow.color, state.textShadow.opacity);
    ctx.shadowColor = shadowColor;
    ctx.shadowBlur = state.textShadow.blur;
    ctx.shadowOffsetX = state.textShadow.offsetX;
    ctx.shadowOffsetY = state.textShadow.offsetY;
  }

  // ── Wrap and Render Text ──────────────────────────────
  const maxWidth = canvasWidth - state.padding * 2;
  const lines = wrapText(ctx, state.text, maxWidth);
  const lineHeightPx = state.fontSize * state.lineHeight;
  const totalTextHeight = lines.length * lineHeightPx;

  // Calculate Y position based on positionY percentage
  const availableHeight = canvasHeight - state.padding * 2;
  const startY =
    state.padding +
    (availableHeight - totalTextHeight) * (state.positionY / 100);

  // Adjust X position based on positionX
  const posXOffset = ((state.positionX - 50) / 100) * (canvasWidth - state.padding * 2);
  const adjustedX = textAlignX + posXOffset;

  // Draw each line
  lines.forEach((line, index) => {
    const y = startY + index * lineHeightPx;

    // Text stroke
    if (state.textStroke.enabled && state.textStroke.width > 0) {
      ctx.save();
      ctx.strokeStyle = state.textStroke.color;
      ctx.lineWidth = state.textStroke.width * 2;
      ctx.lineJoin = 'round';
      // Temporarily disable shadow for stroke
      ctx.shadowColor = 'transparent';

      if (state.letterSpacing !== 0) {
        drawTextWithLetterSpacing(ctx, line, adjustedX, y, state.letterSpacing, true);
      } else {
        ctx.strokeText(line, adjustedX, y);
      }
      ctx.restore();

      // Restore shadow for fill
      if (state.textShadow.enabled) {
        ctx.shadowColor = hexToRgba(state.textShadow.color, state.textShadow.opacity);
        ctx.shadowBlur = state.textShadow.blur;
        ctx.shadowOffsetX = state.textShadow.offsetX;
        ctx.shadowOffsetY = state.textShadow.offsetY;
      }
    }

    if (state.letterSpacing !== 0) {
      drawTextWithLetterSpacing(ctx, line, adjustedX, y, state.letterSpacing, false);
    } else {
      ctx.fillText(line, adjustedX, y);
    }
  });

  // ── Export ────────────────────────────────────────────
  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
  const dataUrl = canvas.toDataURL(mimeType, quality);

  const link = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  link.download = `sinhala-canvas-${date}.${format}`;
  link.href = dataUrl;
  link.click();
}

/**
 * Create a CSS gradient on a canvas context.
 */
function createGradient(
  ctx: CanvasRenderingContext2D,
  state: EditorState
): CanvasGradient {
  const { canvasWidth, canvasHeight, gradientDirection, gradientStart, gradientEnd } = state;
  let x0 = 0, y0 = 0, x1 = 0, y1 = 0;

  switch (gradientDirection) {
    case 'to right':
      x1 = canvasWidth;
      break;
    case 'to left':
      x0 = canvasWidth;
      break;
    case 'to bottom':
      y1 = canvasHeight;
      break;
    case 'to top':
      y0 = canvasHeight;
      break;
    case 'to bottom right':
      x1 = canvasWidth;
      y1 = canvasHeight;
      break;
    case 'to bottom left':
      x0 = canvasWidth;
      y1 = canvasHeight;
      break;
    case 'to top right':
      x1 = canvasWidth;
      y0 = canvasHeight;
      break;
    case 'to top left':
      x0 = canvasWidth;
      y0 = canvasHeight;
      break;
  }

  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  gradient.addColorStop(0, gradientStart);
  gradient.addColorStop(1, gradientEnd);
  return gradient;
}

/**
 * Word-wrap text for canvas rendering.
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
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

/**
 * Draw text with custom letter spacing (canvas doesn't natively support it).
 */
function drawTextWithLetterSpacing(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
  isStroke: boolean
): void {
  const chars = Array.from(text);
  const totalWidth = ctx.measureText(text).width + (chars.length - 1) * spacing;
  let offsetX = 0;

  // Adjust start position based on text alignment
  if (ctx.textAlign === 'center') {
    offsetX = -totalWidth / 2;
  } else if (ctx.textAlign === 'right') {
    offsetX = -totalWidth;
  }

  const savedAlign = ctx.textAlign;
  ctx.textAlign = 'left';

  for (const char of chars) {
    const charX = x + offsetX;
    if (isStroke) {
      ctx.strokeText(char, charX, y);
    } else {
      ctx.fillText(char, charX, y);
    }
    offsetX += ctx.measureText(char).width + spacing;
  }

  ctx.textAlign = savedAlign;
}

/**
 * Convert hex color + opacity to rgba string.
 */
function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
