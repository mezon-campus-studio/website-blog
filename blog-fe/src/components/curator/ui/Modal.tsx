'use client';

import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  showCloseButton?: boolean;
}

const modalSizes: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      description,
      children,
      size = 'md',
      showCloseButton = true,
    },
    ref
  ) => {
    useEffect(() => {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = 'unset';
      }

      return () => {
        document.body.style.overflow = 'unset';
      };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
      <>
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onClose}
        />
        <div
          ref={ref}
          className={twMerge(
            clsx(
              'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50',
              'bg-card-bg border border-card-border rounded-lg shadow-lg',
              'w-full mx-spacing-md',
              modalSizes[size],
              'max-h-[90vh] overflow-y-auto'
            )
          )}
        >
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between px-spacing-lg py-spacing-md border-b border-card-border">
              <div>
                {title && <h2 className="text-lg font-semibold text-foreground">{title}</h2>}
                {description && (
                  <p className="text-sm text-muted-foreground mt-spacing-xs">
                    {description}
                  </p>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
          <div className="px-spacing-lg py-spacing-md">{children}</div>
        </div>
      </>
    );
  }
);

Modal.displayName = 'Modal';
