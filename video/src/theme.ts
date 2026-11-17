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
  background: '#060606',
  secondaryBackground: '#0C0C0C',
  cardSurface: '#111111',
  elevatedSurface: '#191919',
  accent: '#F4F3ED',
  secondaryAccent: 'rgba(255, 255, 255, 0.75)',
  primaryText: '#F4F3ED',
  secondaryText: '#A2A19A',
  tertiaryText: '#6E6D68',
  hairline: 'rgba(255, 255, 255, 0.14)',
} as const;

export const PURPLE_PALETTE = {
  background: '#0D0C12',
  secondaryBackground: '#14121D',
  cardSurface: '#1B1924',
  elevatedSurface: '#242031',
  accent: '#A78BFA',
  secondaryAccent: '#7C4DFF',
  primaryText: '#F4F3ED',
  secondaryText: '#B3AFC0',
  tertiaryText: '#7A758B',
  hairline: 'rgba(167, 139, 250, 0.22)',
} as const;

export const BRAND_COLORS = {
  ivory: '#F4F3ED',
  muted: '#A2A19A',
  mutedPurple: '#B3AFC0',
  obsidian: '#060606',
  obsidianSoft: '#080808',
  purpleDarkBg: '#0D0C12',
  purpleSurface: '#121212',
  purpleDeep: '#1B1924',
  purplePrimary: '#7C4DFF',
  purpleLight: '#A78BFA',
  redPen: '#F46862',
  gold: '#C5A86A',
  goldSoft: '#DFC58B',
  emeraldSafe: '#58D68D',
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
