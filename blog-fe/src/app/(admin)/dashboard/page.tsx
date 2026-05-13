'use client';

import { Card, CardContent, CardHeader, Button, Modal } from '@/components/ui';
import { 
  Users, 
  UserPlus, 
  Shield, 
  Lock, 
  Unlock, 
  Save, 
  Edit,
  Eye,
  EyeOff
} from 'lucide-react';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { useAllUsers } from '@/features/user/hooks/useAllUsers';
import { useUpdateUserStatus } from '@/features/user/hooks/useUpdateUserStatus';
import { useUpdateUser } from '@/features/user/hooks/useUpdateUser';
import { useCreateUser } from '@/features/user/hooks/useCreateUser';
import { User } from '@/features/auth/types';

export default function AdminDashboard() {
  const { data: users, isLoading } = useAllUsers();
  const { mutate: toggleStatus } = useUpdateUserStatus();

  // State for adding user
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newData, setNewData] = useState({ name: '', email: '', password: '', role: 'USER' });
  const { mutate: createUser, isPending: isCreatingUser } = useCreateUser();

  // State for editing user
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<'ADMIN' | 'USER'>('USER');
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser(editingUser?.id || '');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    createUser(newData, {
      onSuccess: () => {
        setIsAddModalOpen(false);
        setNewData({ name: '', email: '', password: '', role: 'USER' });
      },
      onError: (err: any) => {
        alert('Failed to create user: ' + (err.response?.data?.message || err.message));
      }
    });
  };

  const handleEditClick = (user: User) => {
    setEditingUser(user);
    setEditRole(user.role as any);
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ role: editRole }, {
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
        <Button className="gap-2" onClick={() => setIsAddModalOpen(true)}>
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
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-black tracking-widest uppercase border ${user.role === 'ADMIN' ? 'border-primary text-primary bg-primary/10' :
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

      {/* Add New User Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New System User"
        className="bg-card-bg/95 backdrop-blur-xl border-card-border/50"
      >
        <form onSubmit={handleAddUser} className="space-y-4 mt-4 w-full">
          <div className="grid grid-cols-1 gap-4">
            <input 
              type="text"
              placeholder="Full Name"
              value={newData.name}
              onChange={(e) => setNewData({...newData, name: e.target.value})}
              className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              required
            />
            <input 
              type="email"
              placeholder="Email Address"
              value={newData.email}
              onChange={(e) => setNewData({...newData, email: e.target.value})}
              className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
              required
            />
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="Initial Password"
                value={newData.password}
                onChange={(e) => setNewData({...newData, password: e.target.value})}
                className="w-full bg-background/50 border border-card-border rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>


          <div className="pt-8 flex gap-4 w-full">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 font-bold uppercase tracking-widest text-[10px] rounded-xl"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isCreatingUser}
              className="flex-[2] font-bold uppercase tracking-widest text-[10px] rounded-xl bg-primary hover:bg-primary-hover text-white shadow-xl shadow-primary/20"
            >
              <UserPlus size={16} className="mr-2" />
              Create User
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User Access"
        className="bg-card-bg/95 backdrop-blur-xl border-card-border/50"
      >
        <form onSubmit={handleUpdate} className="space-y-6 mt-4 w-full">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              User Identity (Read-only)
            </label>
            <div className="w-full bg-muted/10 border border-card-border rounded-xl px-4 py-3 font-bold opacity-70">
              {editingUser?.name}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
              Assign Role
            </label>
            <div className="grid grid-cols-2 gap-3 w-full">
              {['ADMIN', 'USER'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setEditRole(role as any)}
                  className={twMerge(
                    "p-3 rounded-xl border text-[10px] font-black tracking-widest uppercase transition-all",
                    editRole === role
                      ? "bg-primary/10 border-primary text-primary shadow-lg"
                      : "bg-card-bg/50 border-card-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 flex gap-4 w-full">
            <Button
              type="button"
              variant="ghost"
              className="flex-1 font-bold uppercase tracking-widest text-[10px] rounded-xl"
              onClick={() => setEditingUser(null)}
            >
              Discard
            </Button>
            <Button
              type="submit"
              isLoading={isUpdating}
              className="flex-[2] font-bold uppercase tracking-widest text-[10px] rounded-xl bg-primary hover:bg-primary-hover text-white shadow-xl shadow-primary/20"
            >
              <Save size={16} className="mr-2" />
              Confirm Update
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}