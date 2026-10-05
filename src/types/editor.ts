export type TextAlign = 'left' | 'center' | 'right';

export type BackgroundType = 'solid' | 'gradient';

export type GradientDirection =
  | 'to right'
  | 'to bottom'
  | 'to bottom right'
  | 'to bottom left'
  | 'to top'
  | 'to top right'
  | 'to top left'
  | 'to left';

export type ExportFormat = 'png' | 'jpg';

export interface TextShadowConfig {
  enabled: boolean;
  color: string;
  blur: number;
  offsetX: number;
  offsetY: number;
  opacity: number;
}

export interface TextStrokeConfig {
  enabled: boolean;
  color: string;
  width: number;
}

export interface AspectRatioPreset {
  label: string;
  ratio: string;
  width: number;
  height: number;
}

export interface ColorPreset {
  name: string;
  value: string;
}

export interface BackgroundPreset {
  name: string;
  type: BackgroundType;
  color?: string;
  gradientStart?: string;
  gradientEnd?: string;
  gradientDirection?: GradientDirection;
}

export interface FontOption {
  name: string;
  value: string;
  category: 'sinhala' | 'general';
}

export interface EditorState {
  // Text
  text: string;

  // Typography
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  italic: boolean;
  bold: boolean;
  textAlign: TextAlign;
  lineHeight: number;
  letterSpacing: number;

  // Colors
  textColor: string;

  // Background
  backgroundType: BackgroundType;
  backgroundColor: string;
  gradientStart: string;
  gradientEnd: string;
  gradientDirection: GradientDirection;

  // Effects
  textShadow: TextShadowConfig;
  textStroke: TextStrokeConfig;

  // Position
  positionX: number;
  positionY: number;

  // Canvas
  aspectRatio: string;
  canvasWidth: number;
  canvasHeight: number;

  // Auto fit
  autoFitText: boolean;

  // Padding
  padding: number;
}

export const DEFAULT_EDITOR_STATE: EditorState = {
  text: 'ජීවිතය ලස්සනයි,\nඅපි එය දකින විදිහ අනුව.',
  fontFamily: 'Noto Sans Sinhala',
  fontSize: 48,
  fontWeight: 400,
  italic: false,
  bold: false,
  textAlign: 'center',
  lineHeight: 1.6,
  letterSpacing: 0,
  textColor: '#FFFFFF',
  backgroundType: 'solid',
  backgroundColor: '#1a1a2e',
  gradientStart: '#667eea',
  gradientEnd: '#764ba2',
  gradientDirection: 'to bottom right',
  textShadow: {
    enabled: false,
    color: '#000000',
    blur: 4,
    offsetX: 2,
    offsetY: 2,
    opacity: 0.5,
  },
  textStroke: {
    enabled: false,
    color: '#000000',
    width: 1,
  },
  positionX: 50,
  positionY: 50,
  aspectRatio: '1:1',
  canvasWidth: 1080,
  canvasHeight: 1080,
  autoFitText: false,
  padding: 60,
};
