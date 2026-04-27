'use client';

import { Card, CardContent, CardHeader, Button, Modal } from '@/components/ui';
import { Users, Shield, Lock, Unlock, UserPlus, X, Save, ShieldAlert, Edit } from 'lucide-react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useAllUsers } from '@/features/user/hooks/useAllUsers';
import { useUpdateUserStatus } from '@/features/user/hooks/useUpdateUserStatus';
import { useUpdateUser } from '@/features/user/hooks/useUpdateUser';
import { User } from '@/features/auth/types';

export default function AdminDashboard() {
  const { data: users, isLoading } = useAllUsers();
  const { mutate: toggleStatus } = useUpdateUserStatus();
  
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<'ADMIN' | 'AUTHOR' | 'USER'>('USER');

  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(editingUser?.id || '');

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditRole(user.role as any);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name: editName, role: editRole }, {
      onSuccess: () => {
        setEditingUser(null);
      },
      onError: (err: any) => {
        alert('Failed to update user: ' + (err.response?.data?.message || err.message));
      }
    });
  };

  const handleToggleStatus = (user: User) => {
    if (confirm(`Are you sure you want to ${user.isActive ? 'disable' : 'enable'} ${user.name}?`)) {
      toggleStatus(user.id, {
        onError: (err: any) => {
          alert('Failed to update status: ' + (err.response?.data?.message || err.message));
        }
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2 italic">Manage real users, permissions, and system settings.</p>
        </div>
        <Button className="gap-2">
          <UserPlus size={18} />
          Add New User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-none shadow-xl bg-card-bg/50 backdrop-blur-md">
          <CardContent className="flex flex-col items-center py-6">
            <Users className="text-primary mb-2" size={32} />
            <span className="text-3xl font-bold">{users?.length || 0}</span>
            <span className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Total Users</span>
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl bg-card-bg/50 backdrop-blur-md">
          <CardContent className="flex flex-col items-center py-6">
            <Shield className="text-secondary mb-2" size={32} />
            <span className="text-3xl font-bold">{users?.filter(u => u.role === 'ADMIN').length || 0}</span>
            <span className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Admins</span>
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl bg-card-bg/50 backdrop-blur-md">
          <CardContent className="flex flex-col items-center py-6">
            <Lock className="text-destructive mb-2" size={32} />
            <span className="text-3xl font-bold">{users?.filter(u => !u.isActive).length || 0}</span>
            <span className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Inactive</span>
          </CardContent>
        </Card>
        <Card className="border-none shadow-xl bg-card-bg/50 backdrop-blur-md">
          <CardContent className="flex flex-col items-center py-6">
            <Unlock className="text-emerald-500 mb-2" size={32} />
            <span className="text-3xl font-bold">{users?.filter(u => u.isActive).length || 0}</span>
            <span className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Active</span>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-2xl bg-card-bg/30 backdrop-blur-md overflow-hidden">
        <CardHeader className="border-b border-card-border bg-card-bg/50">
          <h3 className="text-xl font-bold uppercase tracking-wider flex items-center gap-2">
            <Users size={20} className="text-primary" />
            User Management
          </h3>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-card-border bg-muted/10">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">User</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-6 py-8">
                        <div className="h-8 bg-card-bg/50 rounded-lg w-full" />
                      </td>
                    </tr>
                  ))
                ) : users && users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-card-border hover:bg-card-bg/50 transition-all group">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold uppercase">
                            {user.name.charAt(0)}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-sm tracking-tight">{user.name}</span>
                            <span className="text-[10px] text-muted-foreground font-medium">{user.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase border ${
                          user.role === 'ADMIN' ? 'border-primary text-primary bg-primary/10' :
                          'border-muted-foreground/30 text-muted-foreground bg-muted/5'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-destructive'}`} />
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${user.isActive ? 'text-emerald-500' : 'text-destructive'}`}>
                            {user.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEditClick(user)}
                            className="p-2 bg-primary/5 text-primary rounded-lg hover:bg-primary hover:text-white transition-all shadow-sm group/btn"
                            title="Edit User"
                          >
                            <Edit size={16} className="group-hover/btn:scale-110 transition-transform" />
                            <span className="ml-2 text-[10px] font-bold uppercase tracking-widest hidden sm:inline">Edit</span>
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleToggleStatus(user)}
                            className={twMerge(
                              "p-2 rounded-lg transition-all shadow-sm group/btn",
                              user.isActive 
                                ? "bg-destructive/5 text-destructive border-destructive/20 hover:bg-destructive hover:text-white" 
                                : "bg-emerald-500/5 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500 hover:text-white"
                            )}
                            title={user.isActive ? "Disable User" : "Enable User"}
                          >
                            {user.isActive ? (
                              <Lock size={16} className="group-hover/btn:scale-110 transition-transform" />
                            ) : (
                              <Unlock size={16} className="group-hover/btn:scale-110 transition-transform" />
                            )}
                            <span className="ml-2 text-[10px] font-bold uppercase tracking-widest hidden sm:inline">
                              {user.isActive ? 'Disable' : 'Enable'}
                            </span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center text-muted-foreground italic">
                      No users found in database.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      <Modal 
        isOpen={!!editingUser} 
        onClose={() => setEditingUser(null)}
        title="Edit User Access"
        className="bg-card-bg/95 backdrop-blur-xl border-card-border/50"
      >
        <form onSubmit={handleUpdate} className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Display Name
            </label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 outline-none focus:border-primary transition-all font-bold"
              placeholder="Enter user's name..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Assign Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['ADMIN', 'AUTHOR', 'USER'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setEditRole(role as any)}
                  className={twMerge(
                    "p-3 rounded-xl border text-[10px] font-black tracking-widest uppercase transition-all",
                    editRole === role 
                      ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)]" 
                      : "bg-card-bg/50 border-card-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <Button 
              type="button" 
              variant="ghost" 
              className="flex-1 font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-destructive/10 hover:text-destructive transition-colors"
              onClick={() => setEditingUser(null)}
            >
              Discard
            </Button>
            <Button 
              type="submit" 
              isLoading={isUpdating}
              className="flex-[2] font-bold uppercase tracking-widest text-[10px] rounded-xl gap-2 shadow-xl shadow-primary/20 bg-primary hover:bg-primary-hover text-white transition-all hover:scale-[1.02] active:scale-95"
            >
              <Save size={16} />
              Confirm Update
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
