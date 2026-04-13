/**
 * Design tokens — single source of truth for all colors, spacing, and visual constants.
 * Import from here instead of hardcoding values in components.
 */

// ── Brand colors ─────────────────────────────────────────────────────
export const COLORS = {
  primary:       '#7367f0',   // indigo-violet accent
  primaryHover:  '#5e50ee',
  primaryDeep:   '#4839eb',
  primaryAlpha: {
    10:  'rgba(115,103,240,0.10)',
    12:  'rgba(115,103,240,0.12)',
    15:  'rgba(115,103,240,0.15)',
    18:  'rgba(115,103,240,0.18)',
    20:  'rgba(115,103,240,0.20)',
    25:  'rgba(115,103,240,0.25)',
    30:  'rgba(115,103,240,0.30)',
    35:  'rgba(115,103,240,0.35)',
    40:  'rgba(115,103,240,0.40)',
    45:  'rgba(115,103,240,0.45)',
  },

  cyan:          '#67e8f9',
  cyanAlpha: {
    10:  'rgba(103,232,249,0.10)',
    12:  'rgba(103,232,249,0.12)',
  },

  pink:          '#f472b6',
  green:         '#4ade80',
  red:           '#f87171',
  amber:         '#fbbf24',
  violet:        '#a78bfa',

  // Gradient presets
  gradientPrimary:  'linear-gradient(135deg, #7367f0, #5e50ee)',
  gradientDeep:     'linear-gradient(135deg, #5e50ee, #4839eb)',
  gradientHeadline: 'linear-gradient(90deg, #ffffff 0%, #7367f0 25%, #67e8f9 50%, #f472b6 75%, #ffffff 100%)',
  gradientHeadlineLight: 'linear-gradient(90deg, #1a1a2e 0%, #7367f0 25%, #0891b2 50%, #be185d 75%, #1a1a2e 100%)',
  gradientDotPurple: 'radial-gradient(ellipse at center, #7367f0 0%, rgba(115,103,240,0) 100%)',
  gradientDotCyan:   'radial-gradient(ellipse at center, #67e8f9 0%, rgba(103,232,249,0) 100%)',
};

// ── Dark mode palette ─────────────────────────────────────────────────
export const DARK = {
  bg:           '#0f0f0f',
  paper:        '#1a1a1a',
  paperDeep:    '#111111',
  promptBg:     'rgba(12,8,22,0.92)',
  promptBgDeep: 'rgba(12,8,22,0.95)',
  border:       'rgba(255,255,255,0.08)',
  borderLight:  'rgba(255,255,255,0.10)',
  borderMid:    'rgba(255,255,255,0.12)',
  overlay:      'rgba(0,0,0,0.55)',
  text:         '#ffffff',
  textSecondary:'rgba(255,255,255,0.55)',
  textDisabled: 'rgba(255,255,255,0.35)',
  uploadIcon:   'rgba(255,255,255,0.40)',
  removeBg:     '#111111',
};

// ── Light mode palette ────────────────────────────────────────────────
export const LIGHT = {
  bg:           '#f4f4f6',
  paper:        '#ffffff',
  paperDeep:    '#f8f8fa',
  promptBg:     'rgba(255,255,255,0.92)',
  promptBgDeep: 'rgba(255,255,255,0.95)',
  border:       'rgba(0,0,0,0.08)',
  borderLight:  'rgba(0,0,0,0.10)',
  borderMid:    'rgba(0,0,0,0.12)',
  overlay:      'rgba(0,0,0,0.45)',
  text:         '#1a1a2e',
  textSecondary:'rgba(30,20,60,0.60)',
  textDisabled: 'rgba(30,20,60,0.38)',
  uploadIcon:   'rgba(0,0,0,0.35)',
  removeBg:     '#ffffff',
};

// ── Shadows ───────────────────────────────────────────────────────────
export const SHADOWS = {
  panel:        '0 4px 24px rgba(0,0,0,0.25)',
  panelDark:    '0 4px 24px rgba(0,0,0,0.35)',
  sidebar:      '0 4px 24px rgba(0,0,0,0.35)',
  modal:        '0 24px 80px rgba(0,0,0,0.70)',
  dropdown:     '0 12px 40px rgba(0,0,0,0.50)',
  buttonGlow:   '0 2px 12px rgba(115,103,240,0.35)',
  buttonGlowHover: '0 4px 20px rgba(115,103,240,0.50)',
  cardGlow:     '0 8px 32px rgba(115,103,240,0.20)',
  inputGlow:    '0 0 14px rgba(115,103,240,0.20)',
};

// ── Border radius ─────────────────────────────────────────────────────
export const RADIUS = {
  xs:   '6px',
  sm:   '8px',
  md:   '10px',
  lg:   '12px',
  xl:   '14px',
  xxl:  '16px',
  full: '9999px',
};

// ── Animation durations ───────────────────────────────────────────────
export const ANIM = {
  dotSpeed1: '7s',   // purple dot
  dotSpeed2: '9s',   // cyan dot
  fast:      '0.15s',
  normal:    '0.25s',
  slow:      '0.4s',
};

// ── Helper: get palette by mode ───────────────────────────────────────
export function palette(isDark) {
  return isDark ? DARK : LIGHT;
}
