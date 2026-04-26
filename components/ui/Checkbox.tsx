'use client';

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Check } from 'lucide-react';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id || React.useId();
    const [checked, setChecked] = React.useState(props.defaultChecked || props.checked || false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setChecked(e.target.checked);
      props.onChange?.(e);
    };

    return (
      <div className="flex items-center gap-2">
        <div className="relative flex items-center justify-center">
          <input
            type="checkbox"
            ref={ref}
            id={checkboxId}
            className={twMerge(
              clsx(
                'peer h-5 w-5 appearance-none rounded border border-card-border bg-card-bg transition-all',
                'checked:border-primary checked:bg-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                'disabled:cursor-not-allowed disabled:opacity-50',
                className
              )
            )}
            checked={checked}
            onChange={handleChange}
            {...props}
          />
          <Check
            className="pointer-events-none absolute h-3.5 w-3.5 text-white opacity-0 transition-opacity peer-checked:opacity-100"
            strokeWidth={4}
          />
        </div>
        {label && (
          <label
            htmlFor={checkboxId}
            className="text-xs font-bold uppercase tracking-widest text-muted-foreground cursor-pointer select-none"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
