import React from 'react';
import Script from 'next/script';

/**
 * This script runs immediately before React hydrates to prevent theme flickering.
 */
export const ThemeScript = () => {
  return (
    <Script
      id="theme-initializer"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              var theme = localStorage.getItem('theme') || 'light';
              document.documentElement.setAttribute('data-theme', theme);
            } catch (e) {}
          })();
        `,
      }}
    />
  );
};
