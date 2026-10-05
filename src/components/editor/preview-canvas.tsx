'use client';

import { useRef, useEffect, useCallback } from 'react';
import { EditorState } from '@/types/editor';

interface PreviewCanvasProps {
  state: EditorState;
}

export function PreviewCanvas({ state }: PreviewCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { canvasWidth, canvasHeight } = state;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // ── Background ────────────────────────────────────────
    if (state.backgroundType === 'gradient') {
      const gradient = createGradient(ctx, state);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = state.backgroundColor;
    }
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // ── Text Setup ────────────────────────────────────────
    const effectiveWeight = state.bold
      ? Math.max(state.fontWeight, 700)
      : state.fontWeight;
    const fontStyle = state.italic ? 'italic' : 'normal';
    ctx.font = `${fontStyle} ${effectiveWeight} ${state.fontSize}px "${state.fontFamily}", "Noto Sans Sinhala", sans-serif`;
    ctx.fillStyle = state.textColor;
    ctx.textBaseline = 'top';

    // Alignment
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

    // ── Shadow ────────────────────────────────────────────
    if (state.textShadow.enabled) {
      ctx.shadowColor = hexToRgba(
        state.textShadow.color,
        state.textShadow.opacity
      );
      ctx.shadowBlur = state.textShadow.blur;
      ctx.shadowOffsetX = state.textShadow.offsetX;
      ctx.shadowOffsetY = state.textShadow.offsetY;
    } else {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // ── Text Wrapping ─────────────────────────────────────
    const maxWidth = canvasWidth - state.padding * 2;
    const lines = wrapText(ctx, state.text, maxWidth);
    const lineHeightPx = state.fontSize * state.lineHeight;
    const totalTextHeight = lines.length * lineHeightPx;

    // Position
    const availableHeight = canvasHeight - state.padding * 2;
    const startY =
      state.padding +
      (availableHeight - totalTextHeight) * (state.positionY / 100);

    const posXOffset =
      ((state.positionX - 50) / 100) * (canvasWidth - state.padding * 2);
    const adjustedX = textAlignX + posXOffset;

    // ── Draw Lines ────────────────────────────────────────
    lines.forEach((line, index) => {
      const y = startY + index * lineHeightPx;

      // Stroke
      if (state.textStroke.enabled && state.textStroke.width > 0) {
        ctx.save();
        ctx.strokeStyle = state.textStroke.color;
        ctx.lineWidth = state.textStroke.width * 2;
        ctx.lineJoin = 'round';
        ctx.shadowColor = 'transparent';

        if (state.letterSpacing !== 0) {
          drawTextWithLetterSpacing(ctx, line, adjustedX, y, state.letterSpacing, true);
        } else {
          ctx.strokeText(line, adjustedX, y);
        }
        ctx.restore();

        // Restore shadow
        if (state.textShadow.enabled) {
          ctx.shadowColor = hexToRgba(
            state.textShadow.color,
            state.textShadow.opacity
          );
          ctx.shadowBlur = state.textShadow.blur;
          ctx.shadowOffsetX = state.textShadow.offsetX;
          ctx.shadowOffsetY = state.textShadow.offsetY;
        }
      }

      // Fill
      if (state.letterSpacing !== 0) {
        drawTextWithLetterSpacing(ctx, line, adjustedX, y, state.letterSpacing, false);
      } else {
        ctx.fillText(line, adjustedX, y);
      }
    });
  }, [state]);

  // Redraw whenever state changes
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Calculate display scale
  const aspectRatio = state.canvasWidth / state.canvasHeight;

  return (
    <div
      ref={containerRef}
      className="flex-1 w-full h-full flex items-center justify-center p-6 lg:p-8 min-h-0 min-w-0 relative"
    >
      <canvas
        ref={canvasRef}
        className="shadow-2xl rounded-lg bg-checkerboard"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          width: 'auto',
          height: 'auto',
          aspectRatio: `${state.canvasWidth} / ${state.canvasHeight}`,
          objectFit: 'contain',
        }}
      />

      {/* Dimension badge */}
      <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-md font-mono pointer-events-none">
        {state.canvasWidth}×{state.canvasHeight}
      </div>
    </div>
  );
}

// ── Helper functions (shared with export-image.ts logic) ──

function createGradient(
  ctx: CanvasRenderingContext2D,
  state: EditorState
): CanvasGradient {
  const {
    canvasWidth,
    canvasHeight,
    gradientDirection,
    gradientStart,
    gradientEnd,
  } = state;
  let x0 = 0,
    y0 = 0,
    x1 = 0,
    y1 = 0;

  switch (gradientDirection) {
    case 'to right': x1 = canvasWidth; break;
    case 'to left': x0 = canvasWidth; break;
    case 'to bottom': y1 = canvasHeight; break;
    case 'to top': y0 = canvasHeight; break;
    case 'to bottom right': x1 = canvasWidth; y1 = canvasHeight; break;
    case 'to bottom left': x0 = canvasWidth; y1 = canvasHeight; break;
    case 'to top right': x1 = canvasWidth; y0 = canvasHeight; break;
    case 'to top left': x0 = canvasWidth; y0 = canvasHeight; break;
  }

  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  gradient.addColorStop(0, gradientStart);
  gradient.addColorStop(1, gradientEnd);
  return gradient;
}

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
    if (currentLine) lines.push(currentLine);
  }

  return lines;
}

function drawTextWithLetterSpacing(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
  isStroke: boolean
): void {
  const chars = Array.from(text);
  const totalWidth =
    ctx.measureText(text).width + (chars.length - 1) * spacing;
  let offsetX = 0;

  if (ctx.textAlign === 'center') offsetX = -totalWidth / 2;
  else if (ctx.textAlign === 'right') offsetX = -totalWidth;

  const savedAlign = ctx.textAlign;
  ctx.textAlign = 'left';

  for (const char of chars) {
    const charX = x + offsetX;
    if (isStroke) ctx.strokeText(char, charX, y);
    else ctx.fillText(char, charX, y);
    offsetX += ctx.measureText(char).width + spacing;
  }

  ctx.textAlign = savedAlign;
}

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
