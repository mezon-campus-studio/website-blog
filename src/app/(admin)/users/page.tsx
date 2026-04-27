"use client";

import { useUsers, useUpdateUserStatus, useUpdateUserRole } from '@/features/admin/hooks/useUsers';
import { Button, Card } from '@/components/ui';
import { UserRole } from '@/features/auth/types';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Trash2, Shield, UserCheck, UserX, Loader2 } from 'lucide-react';

export default function UsersPage() {
  const { data: users, isLoading, error } = useUsers();
  const updateStatus = useUpdateUserStatus();
  const updateRole = useUpdateUserRole();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load users: {(error as any).message}
      </div>
    );
  }

  return (
    <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
      <div className="p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage roles and account status for all curators.</p>
        </header>

        <Card className="overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-card-border">
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">User</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Role</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Status</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Joined</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((user) => (
                <tr key={user.id} className="border-b border-card-border hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                        {user.avatar_url ? (
                          <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-primary font-bold">{user.name[0]}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.role === UserRole.ADMIN ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`flex items-center gap-1.5 text-sm ${
                      user.isActive ? 'text-green-500' : 'text-destructive'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-destructive'}`} />
                      {user.isActive ? 'Active' : 'Locked'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateRole.mutate({ 
                          userId: user.id, 
                          role: user.role === UserRole.ADMIN ? UserRole.USER : UserRole.ADMIN 
                        })}
                        disabled={updateRole.isPending}
                        title="Toggle Admin Role"
                      >
                        <Shield size={14} />
                      </Button>
                      <Button
                        variant={user.isActive ? "outline" : "primary"}
                        size="sm"
                        onClick={() => updateStatus.mutate({ userId: user.id, isActive: !user.isActive })}
                        disabled={updateStatus.isPending}
                        title={user.isActive ? "Lock Account" : "Unlock Account"}
                      >
                        {user.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
