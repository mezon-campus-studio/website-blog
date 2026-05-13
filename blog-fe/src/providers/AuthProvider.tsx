'use client';

/**
 * AuthProvider — wraps the app to ensure the Zustand auth store is available.
 *
 * NOTE: Token persistence is handled by Zustand's `persist` middleware
 * (stored under the "auth-storage" key in localStorage).
 * The api-client interceptor reads from localStorage["token"] separately,
 * so no server-side validation is done here to avoid conflicts.
 */
import { type ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  return <>{children}</>;
}

