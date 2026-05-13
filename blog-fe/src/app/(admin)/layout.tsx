'use client';

import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { RoleGuard } from '@/features/auth/components/RoleGuard';
import { Navbar } from '@/components/layout/Navbar/Navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <RoleGuard allowedRoles={['ADMIN']} fallback={
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground">You do not have permission to view this page.</p>
        </div>
      }>
        <Navbar />
        <main className="min-h-screen bg-muted/30">
          {children}
        </main>
      </RoleGuard>
    </ProtectedRoute>
  );
}