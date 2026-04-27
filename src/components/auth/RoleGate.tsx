"use client";

import { useAuth } from '@/features/auth/hooks';
import { UserRole } from '@/features/auth/types';

interface RoleGateProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export default function RoleGate({ children, allowedRoles, fallback = null }: RoleGateProps) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user || !allowedRoles.includes(user.role)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
