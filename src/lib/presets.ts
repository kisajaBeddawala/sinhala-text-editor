import {
  AspectRatioPreset,
  BackgroundPreset,
  ColorPreset,
  FontOption,
  GradientDirection,
} from '@/types/editor';

// ─── Font Options ───────────────────────────────────────────
export const FONT_OPTIONS: FontOption[] = [
  { name: 'Noto Sans Sinhala', value: 'Noto Sans Sinhala', category: 'sinhala' },
  { name: 'Noto Serif Sinhala', value: 'Noto Serif Sinhala', category: 'sinhala' },
  { name: 'Abhaya Libre', value: 'Abhaya Libre', category: 'sinhala' },
  { name: 'Anek Sinhala', value: 'Anek Sinhala', category: 'sinhala' },
  { name: 'Gemunu Libre', value: 'Gemunu Libre', category: 'sinhala' },
  { name: 'Stick No Bills', value: 'Stick No Bills', category: 'sinhala' },
  { name: 'Inter', value: 'Inter', category: 'general' },
  { name: 'Noto Sans', value: 'Noto Sans', category: 'general' },
  { name: 'Noto Serif', value: 'Noto Serif', category: 'general' },
];

// ─── Font Weight Options ────────────────────────────────────
export const FONT_WEIGHT_OPTIONS = [
  { label: 'Light', value: 300 },
  { label: 'Regular', value: 400 },
  { label: 'Medium', value: 500 },
  { label: 'Semi Bold', value: 600 },
  { label: 'Bold', value: 700 },
  { label: 'Extra Bold', value: 800 },
  { label: 'Black', value: 900 },
];

// ─── Color Presets ──────────────────────────────────────────
export const TEXT_COLOR_PRESETS: ColorPreset[] = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
  { name: 'Soft White', value: '#F0F0F0' },
  { name: 'Light Gray', value: '#CCCCCC' },
  { name: 'Crimson', value: '#DC2626' },
  { name: 'Royal Blue', value: '#2563EB' },
  { name: 'Emerald', value: '#059669' },
  { name: 'Amber', value: '#D97706' },
  { name: 'Violet', value: '#7C3AED' },
  { name: 'Rose', value: '#E11D48' },
  { name: 'Teal', value: '#0D9488' },
  { name: 'Orange', value: '#EA580C' },
];

// ─── Background Presets ─────────────────────────────────────
export const BACKGROUND_PRESETS: BackgroundPreset[] = [
  { name: 'Midnight', type: 'solid', color: '#1a1a2e' },
  { name: 'Pure Black', type: 'solid', color: '#000000' },
  { name: 'White', type: 'solid', color: '#FFFFFF' },
  { name: 'Dark Slate', type: 'solid', color: '#1e293b' },
  { name: 'Navy', type: 'solid', color: '#0f172a' },
  { name: 'Charcoal', type: 'solid', color: '#374151' },
  {
    name: 'Sunset',
    type: 'gradient',
    gradientStart: '#f97316',
    gradientEnd: '#ec4899',
    gradientDirection: 'to bottom right',
  },
  {
    name: 'Ocean',
    type: 'gradient',
    gradientStart: '#0ea5e9',
    gradientEnd: '#6366f1',
    gradientDirection: 'to bottom right',
  },
  {
    name: 'Aurora',
    type: 'gradient',
    gradientStart: '#667eea',
    gradientEnd: '#764ba2',
    gradientDirection: 'to bottom right',
  },
  {
    name: 'Forest',
    type: 'gradient',
    gradientStart: '#059669',
    gradientEnd: '#0d9488',
    gradientDirection: 'to bottom',
  },
  {
    name: 'Warm',
    type: 'gradient',
    gradientStart: '#f59e0b',
    gradientEnd: '#ef4444',
    gradientDirection: 'to bottom right',
  },
  {
    name: 'Minimal',
    type: 'gradient',
    gradientStart: '#f3f4f6',
    gradientEnd: '#e5e7eb',
    gradientDirection: 'to bottom',
  },
  {
    name: 'Night Sky',
    type: 'gradient',
    gradientStart: '#0c0c1d',
    gradientEnd: '#1a1a3e',
    gradientDirection: 'to bottom',
  },
  {
    name: 'Rose Gold',
    type: 'gradient',
    gradientStart: '#be185d',
    gradientEnd: '#9333ea',
    gradientDirection: 'to bottom right',
  },
];

// ─── Aspect Ratio Presets ───────────────────────────────────
export const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  { label: 'Square', ratio: '1:1', width: 1080, height: 1080 },
  { label: 'Portrait', ratio: '3:4', width: 1080, height: 1440 },
  { label: 'Instagram', ratio: '4:5', width: 1080, height: 1350 },
  { label: 'Story / Reel', ratio: '9:16', width: 1080, height: 1920 },
  { label: 'Landscape', ratio: '16:9', width: 1920, height: 1080 },
  { label: 'Landscape', ratio: '4:3', width: 1440, height: 1080 },
];

// ─── Custom Size Presets ────────────────────────────────────
export const CUSTOM_SIZE_PRESETS = [
  { label: '1080 × 1080', width: 1080, height: 1080 },
  { label: '1080 × 1350', width: 1080, height: 1350 },
  { label: '1080 × 1920', width: 1080, height: 1920 },
  { label: '1200 × 628', width: 1200, height: 628 },
  { label: '1280 × 720', width: 1280, height: 720 },
];

// ─── Gradient Directions ────────────────────────────────────
export const GRADIENT_DIRECTIONS: { label: string; value: GradientDirection }[] = [
  { label: 'Left → Right', value: 'to right' },
  { label: 'Top → Bottom', value: 'to bottom' },
  { label: 'Top-left → Bottom-right', value: 'to bottom right' },
  { label: 'Bottom-left → Top-right', value: 'to top right' },
  { label: 'Right → Left', value: 'to left' },
  { label: 'Bottom → Top', value: 'to top' },
  { label: 'Top-right → Bottom-left', value: 'to bottom left' },
  { label: 'Bottom-right → Top-left', value: 'to top left' },
];

// ─── Position Presets ───────────────────────────────────────
export const POSITION_PRESETS = [
  { label: 'Top', x: 50, y: 20 },
  { label: 'Center', x: 50, y: 50 },
  { label: 'Bottom', x: 50, y: 80 },
  { label: 'Top-Left', x: 20, y: 20 },
  { label: 'Top-Right', x: 80, y: 20 },
  { label: 'Bottom-Left', x: 20, y: 80 },
  { label: 'Bottom-Right', x: 80, y: 80 },
];
