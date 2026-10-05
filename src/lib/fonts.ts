import { FONT_OPTIONS } from './presets';

// Google Fonts URL for Sinhala fonts
export function getGoogleFontsUrl(): string {
  const families = [
    'Inter:wght@300;400;500;600;700',
    'Noto+Sans+Sinhala:wght@300;400;500;600;700;800;900',
    'Noto+Serif+Sinhala:wght@300;400;500;600;700;800;900',
    'Abhaya+Libre:wght@400;500;600;700;800',
    'Anek+Sinhala:wght@300;400;500;600;700;800',
    'Gemunu+Libre:wght@300;400;500;600;700;800',
    'Stick+No+Bills:wght@300;400;500;600;700;800',
    'Noto+Sans:wght@300;400;500;600;700;800;900',
    'Noto+Serif:wght@300;400;500;600;700;800;900',
  ];

  return `https://fonts.googleapis.com/css2?${families.map((f) => `family=${f}`).join('&')}&display=swap`;
}

/**
 * Wait for a specific font to be loaded and available for rendering.
 */
export async function waitForFont(fontFamily: string, fontWeight: number = 400): Promise<boolean> {
  if (typeof document === 'undefined') return false;

  try {
    // Use the Font Loading API
    await document.fonts.load(`${fontWeight} 48px "${fontFamily}"`);
    return true;
  } catch (error) {
    console.warn(`Font "${fontFamily}" failed to load:`, error);
    return false;
  }
}

/**
 * Check if a font supports Sinhala characters
 */
export function getFallbackFont(requestedFont: string): string {
  const sinhalaFont = FONT_OPTIONS.find(
    (f) => f.category === 'sinhala' && f.value !== requestedFont
  );
  return sinhalaFont?.value || 'Noto Sans Sinhala';
}
