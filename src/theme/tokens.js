/**
 * Design tokens — single source of truth for all colors, spacing, and visual constants.
 * Import from here instead of hardcoding values in components.
 */

// ── Brand colors ─────────────────────────────────────────────────────
export const COLORS = {
  primary: '#7367f0',   // indigo-violet accent
  primaryHover: '#5e56d6',
  primaryDeep: '#4839eb',
  primaryAlpha: {
    10: 'rgba(115,103,240,0.10)',
    12: 'rgba(115,103,240,0.12)',
    15: 'rgba(115,103,240,0.15)',
    18: 'rgba(115,103,240,0.18)',
    20: 'rgba(115,103,240,0.20)',
    25: 'rgba(115,103,240,0.25)',
    30: 'rgba(115,103,240,0.30)',
    35: 'rgba(115,103,240,0.35)',
    40: 'rgba(115,103,240,0.40)',
    45: 'rgba(115,103,240,0.45)',
  },
  secondary: '#7367f0',
  secondaryAlpha: {
    10: 'rgba(115,103,240,0.10)',
    12: 'rgba(115,103,240,0.12)',
    15: 'rgba(115,103,240,0.15)',
    18: 'rgba(115,103,240,0.18)',
    20: 'rgba(115,103,240,0.20)',
    25: 'rgba(115,103,240,0.25)',
    30: 'rgba(115,103,240,0.30)',
    35: 'rgba(115,103,240,0.35)',
    40: 'rgba(115,103,240,0.40)',
    45: 'rgba(115,103,240,0.45)',
  },

  // Text secondary colors
  textSecondaryColor: '#82868b',
  textSecondaryLight: '#a8aaae',
  textSecondaryDark: '#6e7278',

  white: '#ffffff',
  black: '#000000',
  gray50: '#fafafa',
  gray100: '#f5f5f5',
  gray200: '#eeeeee',
  gray300: '#e0e0e0',
  gray400: '#bdbdbd',
  gray500: '#9e9e9e',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',

  cyan: '#67e8f9',
  cyanAlpha: {
    10: 'rgba(103,232,249,0.10)',
    12: 'rgba(103,232,249,0.12)',
  },

  pink: '#f472b6',
  green: '#4ade80',
  red: '#f87171',
  amber: '#fbbf24',
  violet: '#a78bfa',

  // Gradient presets (updated with new palette)
  gradientPrimary: 'linear-gradient(270deg, rgba(115, 103, 240, 0.7) 0%, #7367f0 100%)',
  gradientDeep: 'linear-gradient(135deg, #7367f0 0%, #5e56d6 100%)',
  gradientText: 'linear-gradient(135deg, #7367f0 0%, #9c27b0 100%)',
  gradientHeadline: 'linear-gradient(90deg, #ffffff 0%, #7367f0 25%, #67e8f9 50%, #f472b6 75%, #ffffff 100%)',
  gradientHeadlineLight: 'linear-gradient(90deg, #1a1a2e 0%, #7367f0 25%, #0891b2 50%, #be185d 75%, #1a1a2e 100%)',
  gradientDotPurple: 'radial-gradient(ellipse at center, #7367f0 0%, rgba(115,103,240,0) 100%)',
  gradientDotCyan: 'radial-gradient(ellipse at center, #67e8f9 0%, rgba(103,232,249,0) 100%)',

  // Primary color variants
  primaryLight: 'rgba(115, 103, 240, 0.7)',
  primaryDark: '#5e56d6',
};

// ── Gradient Shadows (for box-shadow instead of border) ───────────────
export const GRADIENT_SHADOWS = {
  active: '0 4px 16px rgba(115, 103, 240, 0.3), 0 0 24px rgba(115, 103, 240, 0.15)',
  activeHover: '0 6px 20px rgba(115, 103, 240, 0.4), 0 0 32px rgba(115, 103, 240, 0.2)',
  glow: '0 0 20px rgba(115, 103, 240, 0.4), 0 0 40px rgba(115, 103, 240, 0.2)',
  glowHover: '0 0 24px rgba(115, 103, 240, 0.5), 0 0 48px rgba(115, 103, 240, 0.25)',
};

// ── Dark mode palette ─────────────────────────────────────────────────
export const DARK = {
  bg: '#0f0f0f',
  paper: '#1a1a1a',
  paperDeep: '#111111',
  promptBg: 'rgba(12,8,22,0.92)',
  promptBgDeep: 'rgba(12,8,22,0.95)',
  border: 'rgba(255,255,255,0.08)',
  borderLight: 'rgba(255,255,255,0.10)',
  borderMid: 'rgba(255,255,255,0.12)',
  overlay: 'rgba(0,0,0,0.55)',
  text: '#ffffff',
  textSecondary: 'rgba(255,255,255,0.55)',
  textDisabled: 'rgba(255,255,255,0.35)',
  uploadIcon: 'rgba(255,255,255,0.40)',
  removeBg: '#111111',
};

// ── Light mode palette ────────────────────────────────────────────────
export const LIGHT = {
  bg: '#f4f4f6',
  paper: '#ffffff',
  paperDeep: '#f8f8fa',
  promptBg: 'rgba(255,255,255,0.92)',
  promptBgDeep: 'rgba(255,255,255,0.95)',
  border: 'rgba(0,0,0,0.08)',
  borderLight: 'rgba(0,0,0,0.10)',
  borderMid: 'rgba(0,0,0,0.12)',
  overlay: 'rgba(0,0,0,0.45)',
  text: '#444050',
  textSecondary: 'rgba(30,20,60,0.60)',
  textDisabled: 'rgba(30,20,60,0.38)',
  uploadIcon: 'rgba(0,0,0,0.35)',
  removeBg: '#ffffff',
};

// ── Shadows ───────────────────────────────────────────────────────────
export const SHADOWS = {
  panel: '0 4px 24px rgba(0,0,0,0.25)',
  panelDark: 'rgba(0, 0, 0, 0.05) 0px 6px 24px, rgba(0, 0, 0, 0.03) 0px 0px 0px 1px',
  sidebar: 'rgba(0, 0, 0, 0.05) 0px 6px 24px, rgba(0, 0, 0, 0.03) 0px 0px 0px 1px',
  modal: '0 24px 80px rgba(0,0,0,0.70)',
  dropdown: '0 12px 40px rgba(0,0,0,0.50)',
  buttonGlow: '0 2px 12px rgba(115,103,240,0.35)',
  buttonGlowHover: '0 4px 20px rgba(115,103,240,0.50)',
  cardGlow: '0 8px 32px rgba(115,103,240,0.20)',
  inputGlow: '0 0 14px rgba(115,103,240,0.20)',
  // Gradient-based shadows (no border effect)
  gradientActive: '0 4px 20px rgba(115, 103, 240, 0.35), 0 0 28px rgba(115, 103, 240, 0.18)',
  gradientHover: '0 6px 24px rgba(115, 103, 240, 0.4), 0 0 36px rgba(115, 103, 240, 0.22)',
};

// ── Border radius ─────────────────────────────────────────────────────
export const RADIUS = {
  xs: '8px',
  sm: '10px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '40px',
  full: '9999px',
};

// ── Animation durations ───────────────────────────────────────────────
export const ANIM = {
  dotSpeed1: '7s',   // purple dot
  dotSpeed2: '9s',   // cyan dot
  fast: '0.15s',
  normal: '0.25s',
  slow: '0.4s',
};

// ── Helper: get palette by mode ───────────────────────────────────────
export function palette(isDark) {
  return isDark ? DARK : LIGHT;
}
