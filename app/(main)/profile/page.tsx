'use client';

import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { useAuthStore } from '@/features/auth/store/authStore';
import { Card, CardContent, CardHeader, Button, Input, Modal } from '@/components/ui';
import { useState, useRef } from 'react';
import { Camera, Save, Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { useUpdateProfile, useUpdateAvatar, useChangePassword } from '@/features/user/hooks';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfile();
  const { mutate: updateAvatar, isPending: isUpdatingAvatar } = useUpdateAvatar();
  const { mutate: changePassword, isPending: isChangingPassword } = useChangePassword();

  const handleSave = () => {
    updateProfile({ name, bio }, {
      onSuccess: () => setIsEditing(false)
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAvatar(file);
    }
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    changePassword(passwordData, {
      onSuccess: () => {
        setPasswordSuccess(true);
        setPasswordData({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPasswordSuccess(false);
        }, 2000);
      },
      onError: (error: any) => {
        setPasswordError(error.response?.data?.message || 'Failed to change password');
      }
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background/50 py-16 px-4 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl relative z-10">
          <header className="mb-12">
            <h1 className="text-5xl font-black tracking-tight mb-2 text-foreground">
              Profile Settings
            </h1>
            <p className="text-muted-foreground text-lg italic">Customize your presence in the curated world.</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <Card className="overflow-hidden border-none shadow-2xl bg-card-bg/50 backdrop-blur-md">
                <CardContent className="p-0">
                  <div className="h-24 bg-gradient-to-r from-primary/20 to-secondary/20" />
                  <div className="px-6 pb-8 -mt-12 flex flex-col items-center">
                    <div className="relative group">
                      <div className="relative w-32 h-32 rounded-full border-4 border-card-bg overflow-hidden shadow-xl transition-transform duration-standard group-hover:scale-105">
                        <Image
                          src={user?.avatar_url || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=2563eb&color=fff&size=256`}
                          alt="Avatar"
                          fill
                          sizes="128px"
                          priority
                          className="object-cover"
                        />
                        {isUpdatingAvatar && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange}
                      />
                      <button 
                        onClick={handleAvatarClick}
                        className="absolute bottom-1 right-1 p-2.5 bg-primary text-white rounded-full shadow-lg hover:bg-primary-hover transition-all scale-90 group-hover:scale-100"
                        disabled={isUpdatingAvatar}
                      >
                        <Camera size={16} />
                      </button>
                    </div>
                    
                    <h2 className="mt-6 text-2xl font-bold">{user?.name}</h2>
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                        {user?.role}
                      </span>
                    </div>

                    <div className="w-full mt-8 pt-8 border-t border-card-border/50 grid grid-cols-2 gap-4 text-center">
                      <div className="flex flex-col">
                        <span className="text-xl font-bold">{user?.articlesCount || 0}</span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Articles</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xl font-bold">
                          {user?.followersCount ? (user.followersCount >= 1000 ? `${(user.followersCount / 1000).toFixed(1)}k` : user.followersCount) : 0}
                        </span>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">Followers</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-card-bg/30">
                <CardContent className="p-6">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">Account Status</h4>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/5 border border-green-500/10">
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">Verified Account</span>
                    <Save size={14} className="text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <Card className="border-none shadow-2xl bg-card-bg/50 backdrop-blur-md">
                <CardHeader className="px-8 pt-8 pb-4 flex flex-row items-center justify-between border-none">
                  <h3 className="text-xl font-bold">Identity & Narrative</h3>
                  {!isEditing ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setIsEditing(true)}
                      className="rounded-full px-6 border-primary/30 text-primary hover:bg-primary/5"
                    >
                      Edit Profile
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsEditing(false)}
                      className="rounded-full px-6 text-muted-foreground"
                    >
                      Cancel
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="px-8 pb-8 flex flex-col gap-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Public Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={!isEditing}
                      className="bg-background/30"
                    />
                    <Input
                      label="Email Address"
                      value={user?.email}
                      disabled
                      className="bg-muted/10 opacity-70"
                      helperText="System protected email"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Professional Bio
                    </label>
                    <textarea
                      className="w-full h-40 rounded-xl border border-card-border bg-background/30 px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-4 ring-offset-background disabled:opacity-50 transition-all resize-none"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Craft your narrative..."
                    />
                  </div>

                  {isEditing && (
                    <Button 
                      className="w-full md:w-fit px-12 rounded-full py-6 text-lg font-bold shadow-xl shadow-primary/20 transition-all hover:translate-y-[-2px] active:scale-95" 
                      onClick={handleSave}
                      isLoading={isUpdatingProfile}
                    >
                      <Save size={20} className="mr-3" />
                      Commit Changes
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-card-bg/50 backdrop-blur-md">
                <CardHeader className="px-8 pt-8 pb-4 border-none">
                  <h3 className="text-xl font-bold">Account Security</h3>
                </CardHeader>
                <CardContent className="px-8 pb-8 flex flex-col md:flex-row items-start justify-between gap-8">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Keep your credentials secure and your data safe with our state-of-the-art encryption protocols. We recommend changing your password regularly to maintain maximum account integrity.
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="w-full md:w-fit rounded-full px-8 border-destructive/30 text-destructive hover:bg-destructive/5 hover:border-destructive whitespace-nowrap"
                  >
                    Change Password
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Password Change Modal */}
        <Modal 
          isOpen={isPasswordModalOpen} 
          onClose={() => setIsPasswordModalOpen(false)}
          title="Update Security Credentials"
          className="max-w-xl bg-card-bg/95 backdrop-blur-xl border-card-border/50"
        >
          <div className="mt-4">
            <form onSubmit={handlePasswordChange} className="flex flex-col gap-6">
              {passwordError && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  <AlertCircle size={16} />
                  <span>{passwordError}</span>
                </div>
              )}
              
              {passwordSuccess && (
                <div className="flex items-center gap-2 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-sm">
                  <CheckCircle2 size={16} />
                  <span>Password updated successfully!</span>
                </div>
              )}

              <Input
                label="Current Password"
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                required
                fullWidth
                endNode={
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                    className="hover:text-primary transition-colors"
                  >
                    {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
              <Input
                label="New Password"
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                required
                fullWidth
                endNode={
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                    className="hover:text-primary transition-colors"
                  >
                    {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
              <Input
                label="Confirm New Password"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordData.confirmNewPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmNewPassword: e.target.value})}
                required
                fullWidth
                endNode={
                  <button
                    type="button"
                    onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                    className="hover:text-primary transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <div className="flex gap-4 mt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  fullWidth 
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  fullWidth 
                  isLoading={isChangingPassword}
                  disabled={passwordSuccess}
                >
                  <Lock size={16} className="mr-2" />
                  Update
                </Button>
              </div>
            </form>
          </div>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
