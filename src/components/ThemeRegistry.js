'use client';

import { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { COLORS, DARK, LIGHT } from '@/theme/tokens';

export const ColorModeContext = createContext({ toggleColorMode: () => { }, mode: 'dark' });

export function useColorMode() {
  return useContext(ColorModeContext);
}

export default function ThemeRegistry({ children }) {
  const [mode, setMode] = useState(() => {
    // Check if we're in the browser to avoid server-side errors
    if (typeof window !== 'undefined') {
      // 1. Try localStorage
      const saved = localStorage.getItem('theme-mode');
      if (saved) return saved;

      // 2. Try the body attribute (set by layout.js script)
      const attr = document.body.getAttribute('data-theme');
      if (attr) return attr;

      // 3. Fallback to system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Standard default
  });

  useEffect(() => {
    // Keep internal state in sync if localStorage changes elsewhere
    const saved = localStorage.getItem('theme-mode');
    if (saved && saved !== mode) setMode(saved);
  }, [mode]);

  const colorMode = useMemo(() => ({
    mode,
    toggleColorMode: () => setMode((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme-mode', next);
      return next;
    }),
  }), [mode]);

  const isDark = mode === 'dark';
  const p = isDark ? DARK : LIGHT;

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: COLORS.primary,
        light: COLORS.primaryHover,
        dark: COLORS.primaryDeep,
      },
      secondary: {
        main: COLORS.cyan,
      },
      error: { main: COLORS.red },
      warning: { main: COLORS.amber },
      success: { main: COLORS.green },
      background: {
        default: p.bg,
        paper: p.paper,
      },
      text: {
        primary: p.text,
        secondary: p.textSecondary,
        disabled: p.textDisabled,
      },
      divider: p.border,
    },
    typography: {
      fontFamily: 'var(--font-poppins), sans-serif',
    },
    shape: {
      borderRadius: 10,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 600,
          },
        },
      },
    },
  }), [mode]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </AppRouterCacheProvider>
    </ColorModeContext.Provider>
  );
}
