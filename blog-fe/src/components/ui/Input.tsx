'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  startNode?: React.ReactNode;
  endNode?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      fullWidth = false,
      startNode,
      endNode,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || React.useId();

    return (
      <div className={twMerge(clsx('flex flex-col gap-1.5', fullWidth && 'w-full'))}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
          >
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {startNode && <div className="absolute left-3 text-muted-foreground">{startNode}</div>}

          <input
            ref={ref}
            id={inputId}
            className={twMerge(
              clsx(
                'flex h-11 w-full rounded-md border border-card-border bg-card-bg px-3 py-2',
                'text-sm text-foreground ring-offset-background',
                'file:border-0 file:bg-transparent file:text-sm file:font-medium',
                'placeholder:text-muted-foreground',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                startNode && 'pl-10',
                endNode && 'pr-10',
                error && 'border-destructive focus:ring-destructive',
                className
              )
            )}
            {...props}
          />

          {endNode && <div className="absolute right-3 text-muted-foreground">{endNode}</div>}
        </div>

        {error ? (
          <p className="text-xs font-medium text-destructive">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-muted-foreground">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
