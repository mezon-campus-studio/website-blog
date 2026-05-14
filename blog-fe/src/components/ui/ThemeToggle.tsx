'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme, mounted } = useDarkMode();

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <button
      onClick={toggleTheme}
      className={twMerge(
        clsx(
          'flex items-center justify-center w-10 h-10 rounded-full',
          'bg-card-bg border border-card-border shadow-sm',
          'text-foreground hover:bg-muted transition-colors',
          className
        )
      )}
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
};
