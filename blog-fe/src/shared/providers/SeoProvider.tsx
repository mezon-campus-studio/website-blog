import type { ReactNode } from 'react';
import React from 'react';
import { HelmetProvider } from 'react-helmet-async';

interface SeoProviderProps {
  children: ReactNode;
}

/**
 * SEO Provider wrapper using React Helmet
 * Use this for managing document head in public site
 */
export const SeoProvider: React.FC<SeoProviderProps> = ({ children }) => {
  return <HelmetProvider>{children}</HelmetProvider>;
};
