'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  endNode?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, fullWidth = false, endNode, ...props }, ref) => {
    return (
      <div className={fullWidth ? 'w-full' : undefined}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-spacing-sm">
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <input
            ref={ref}
            className={twMerge(
              clsx(
                'px-spacing-md py-spacing-sm',
                'bg-card-bg text-foreground',
                'border border-card-border rounded-md',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'transition-all duration-shorter',
                error && 'border-destructive focus:ring-destructive',
                fullWidth && 'w-full',
                endNode && 'pr-12',
                className
              )
            )}
            {...props}
          />
          {endNode && (
            <div className="absolute right-3 flex items-center justify-center text-muted-foreground">
              {endNode}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-destructive mt-spacing-xs">{error}</p>
        )}
        {helperText && !error && (
          <p className="text-sm text-muted-foreground mt-spacing-xs">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
