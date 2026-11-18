export const VIDEO_FPS = 60;
export const VIDEO_WIDTH = 1920;
export const VIDEO_HEIGHT = 1080;
export const VIDEO_DURATION_FRAMES = 2040; // 34 seconds @ 60fps

export const SCENES = {
  intro: { from: 0, duration: 300 },       // 0s - 5s
  glass: { from: 300, duration: 480 },     // 5s - 13s
  chapters: { from: 780, duration: 600 },  // 13s - 23s
  vault: { from: 1380, duration: 420 },    // 23s - 30s
  outro: { from: 1800, duration: 240 },    // 30s - 34s
} as const;

export const MONO_PALETTE = {
  background: '#080808',
  secondaryBackground: '#0E0E0E',
  cardSurface: 'rgba(255, 255, 255, 0.055)',
  elevatedSurface: 'rgba(255, 255, 255, 0.09)',
  accent: '#F4F3ED',
  secondaryAccent: 'rgba(244, 243, 237, 0.72)',
  primaryText: '#F4F3ED',
  secondaryText: '#A2A19A',
  tertiaryText: '#6E6D68',
  hairline: 'rgba(255, 255, 255, 0.14)',
} as const;

export const LIGHT_MONO_PALETTE = {
  background: '#F5F4EF',
  secondaryBackground: '#ECEBE4',
  cardSurface: 'rgba(255, 255, 255, 0.68)',
  elevatedSurface: 'rgba(255, 255, 255, 0.86)',
  accent: '#111111',
  secondaryAccent: 'rgba(17, 17, 17, 0.72)',
  primaryText: '#111111',
  secondaryText: '#5C5B55',
  tertiaryText: '#8A8880',
  hairline: 'rgba(17, 17, 17, 0.11)',
} as const;

export const BRAND_COLORS = {
  obsidian: '#080808',
  paperLight: '#F5F4EF',
  ivory: '#F4F3ED',
  silver: '#D8D7D0',
  ink: '#111111',
  muted: '#A2A19A',
  mutedLight: '#5C5B55',
  subtle: '#6E6D68',
  redPen: '#F46862',
} as const;

export const FONT_SERIF =
  '"Songti SC", "STSong", "Noto Serif SC", "PingFang SC", Georgia, serif';
export const FONT_SANS =
  '"PingFang SC", "-apple-system", "SF Pro Display", "Helvetica Neue", sans-serif';
export const FONT_MONO =
  '"SF Mono", "Menlo", "Monaco", ui-monospace, monospace';

/** Linearly interpolates two #RRGGBB hex colors by t in [0, 1]. */
export function mixHex(hexA: string, hexB: string, t: number): string {
  const clamped = Math.max(0, Math.min(1, t));
  const parse = (hex: string) => {
    const clean = hex.replace('#', '');
    return [
      parseInt(clean.slice(0, 2), 16),
      parseInt(clean.slice(2, 4), 16),
      parseInt(clean.slice(4, 6), 16),
    ];
  };
  const [r1, g1, b1] = parse(hexA);
  const [r2, g2, b2] = parse(hexB);
  const r = Math.round(r1 + (r2 - r1) * clamped);
  const g = Math.round(g1 + (g2 - g1) * clamped);
  const b = Math.round(b1 + (b2 - b1) * clamped);
  return `rgb(${r}, ${g}, ${b})`;
}
