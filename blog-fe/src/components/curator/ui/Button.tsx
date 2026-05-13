'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'destructive' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

const buttonVariants: Record<string, string> = {
  primary:
    'bg-primary text-white hover:bg-primary-hover active:opacity-90 disabled:opacity-50',
  secondary:
    'bg-secondary text-white hover:opacity-90 active:opacity-80 disabled:opacity-50',
  destructive:
    'bg-destructive text-white hover:opacity-90 active:opacity-80 disabled:opacity-50',
  outline:
    'border border-card-border text-foreground hover:bg-muted active:bg-muted disabled:opacity-50',
  ghost: 'text-foreground hover:bg-muted active:bg-muted disabled:opacity-50',
};

const buttonSizes: Record<string, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || disabled}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center gap-2',
            'rounded-md font-medium transition-all duration-shorter',
            'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            'disabled:cursor-not-allowed',
            buttonVariants[variant],
            buttonSizes[size],
            className
          )
        )}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
