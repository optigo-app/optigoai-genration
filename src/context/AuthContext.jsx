'use client';

import React, { createContext, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';

const decodeBase64 = (str) => {
  try {
    return atob(str);
  } catch (e) {
    return str;
  }
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthReady, setIsAuthReady] = React.useState(false);
  const [themeMode, setThemeMode] = React.useState('light');

  const getQueryParams = () => {
    try {
      const token = Cookies.get('skey');
      if (!token) {
        const authQueryParams = sessionStorage.getItem('AuthqueryParams');
        if (authQueryParams) {
          return JSON.parse(authQueryParams);
        }
        return null;
      }

      const decoded = jwtDecode(token);
      const decodedPayload = {
        ...decoded,
        uid: decodeBase64(decoded.uid)
      };

      if (decodedPayload) {
        sessionStorage.setItem('AuthqueryParams', JSON.stringify(decodedPayload));
      }

      return decodedPayload;
    } catch (error) {
      console.error('Failed to resolve auth params:', error);
      sessionStorage.removeItem('AuthqueryParams');
      Cookies.remove('skey');
      return null;
    }
  };

  useEffect(() => {
    if (searchParams.get('FE')) {
      sessionStorage.setItem("urlParams", 'fe')
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const detectTheme = () => {
      const bodyTheme = document.body?.getAttribute('data-theme');
      const savedTheme = localStorage.getItem('theme-mode');
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      setThemeMode(bodyTheme || savedTheme || systemTheme);
    };

    detectTheme();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = () => detectTheme();
    const handleStorage = () => detectTheme();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }
    window.addEventListener('storage', handleStorage);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const initAuth = () => {
      try {
        if (pathname === '/error_404') {
          return;
        }

        if (typeof window !== 'undefined') {
          const hostname = window.location.hostname;
          const isAllowedHost = hostname === 'localhost' || hostname.includes('nzen') || hostname.includes('optigoaistudio.web');
          const isIframe = window.self !== window.top;
          const token = Cookies.get('skey');

          // Security check: If NOT an allowed host, must be in an iframe AND have a session cookie
          if (!isAllowedHost && (!isIframe || !token)) {
            router.replace('/error_404');
            return;
          }

          if (!token) {
            if (isAllowedHost) {
              const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJpdGFzayIsImF1ZCI6IllXUnRhVzVBYjNKaGFXd3VZMjh1YVc0PSIsImV4cCI6MTc2NTQ0MTczOCwidWlkIjoiWVdSdGFXNUFiM0poYVd3dVkyOHVhVzQ9IiwieWMiOiJlM3R1ZW1WdWZYMTdlekl3ZlgxN2UyOXlZV2xzTWpWOWZYdDdiM0poYVd3eU5YMTkiLCJzdiI6IjAiLCJhdGsiOiJkRzlyWlc1ZlkyeHBaVzUwTVY5elpXTnlaWFJmYTJWNVh6RXlNelExIiwiY3V2ZXIiOiJSNTBCMyJ9.Kfx8ylk2omd2zmjP7SwnhN_vjcesCG83jV7M8Nr3ufU';
              const isHttps = window.location.protocol === 'https:';
              Cookies.set('skey', mockToken, isHttps ? { sameSite: 'None', secure: true } : { sameSite: 'Lax' });
              sessionStorage.setItem('ukey', 'orail25TNBVD0LO2UFPRZ4YH_Image');

              let params = null;
              const authQueryParams = sessionStorage.getItem('AuthqueryParams');
              if (authQueryParams) {
                params = JSON.parse(authQueryParams);
              } else {
                const decoded = jwtDecode(mockToken);
                const decodedPayload = {
                  ...decoded,
                  uid: decodeBase64(decoded.uid),
                };
                if (decodedPayload) {
                  sessionStorage.setItem('AuthqueryParams', JSON.stringify(decodedPayload));
                  params = decodedPayload;
                }
              }

              if (!params) {
                router.replace('/error_404');
              }
            } else {
              router.replace('/error_404');
            }
          } else {
            const params = getQueryParams();
            if (!params) {
              router.replace('/error_404');
            }
          }
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
        router.replace('/error_404');
      } finally {
        if (mounted) {
          setIsAuthReady(true);
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, [pathname, router]);

  // Keep a safe fallback while auth check is running
  if (!isAuthReady && pathname !== '/error_404') {
    const isDark = themeMode === 'dark';

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px',
          background: isDark
            ? 'radial-gradient(circle at top, #1a1a1a 0%, #0f0f0f 55%, #0a0a0a 100%)'
            : 'radial-gradient(circle at top, #ffffff 0%, #f7f8fc 55%, #eef1f7 100%)',
          color: isDark ? '#c7cedb' : '#5b6475',
          fontSize: '14px',
          transition: 'background 0.25s ease, color 0.25s ease'
        }}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            border: `2px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(17,24,39,0.15)'}`,
            borderTopColor: '#7367f0',
            animation: 'authSpin 0.8s linear infinite'
          }}
        />
        <div style={{ fontWeight: 500, letterSpacing: '0.02em' }}>Loading your workspace...</div>
        <style>
          {`@keyframes authSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        getQueryParams,
        isAuthReady
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};