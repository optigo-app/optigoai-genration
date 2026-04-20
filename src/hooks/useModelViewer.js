'use client';

import { useEffect, useState } from 'react';

const MODEL_VIEWER_SRC =
  'https://unpkg.com/@google/model-viewer@4.2.0/dist/model-viewer.min.js';

/**
 * React hook to dynamically load the <model-viewer> web component.
 * Prevents duplicate script injection and works safely with Next.js SSR.
 */
export default function useModelViewer(shouldLoad = true) {
  const [isReady, setIsReady] = useState(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(window.customElements?.get('model-viewer'));
  });

  useEffect(() => {
    if (!shouldLoad || typeof window === 'undefined') return;

    // If already registered, mark ready immediately
    if (window.customElements?.get('model-viewer')) {
      setIsReady(true);
      return;
    }

    let cancelled = false;

    const markReady = () => {
      if (!cancelled && window.customElements?.get('model-viewer')) {
        setIsReady(true);
      }
    };

    // Check if script already exists
    let script = document.querySelector('script[data-model-viewer="true"]');

    if (!script) {
      script = document.createElement('script');
      script.type = 'module';
      script.src = MODEL_VIEWER_SRC;
      script.async = true;
      script.setAttribute('data-model-viewer', 'true');

      document.head.appendChild(script);
    }

    script.addEventListener('load', markReady);
    script.addEventListener('error', markReady);

    // Fallback polling (some browsers delay custom element registration)
    const interval = window.setInterval(() => {
      if (window.customElements?.get('model-viewer')) {
        markReady();
        window.clearInterval(interval);
      }
    }, 120);

    return () => {
      cancelled = true;
      script?.removeEventListener('load', markReady);
      script?.removeEventListener('error', markReady);
      window.clearInterval(interval);
    };
  }, [shouldLoad]);

  return isReady;
}