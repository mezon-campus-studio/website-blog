"use client";

import { useState, useRef } from 'react';
import { Camera, User, Lock, Mail, Save, AlertCircle } from 'lucide-react';
import { Button, Input, Card } from '@/components/ui';
import { useAuth } from '@/features/auth/hooks';
import { useUpdateProfile, useUploadAvatar, useChangePassword } from '../hooks';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  
  // Profile form state
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  
  // Security form state
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const changePassword = useChangePassword();

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate({ name, bio });
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadAvatar.mutate(file);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    changePassword.mutate(passwords, {
      onSuccess: () => {
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        alert('Password changed successfully');
      },
    });
  };

  if (!user) return null;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <aside className={styles.sidebar}>
          <div className={styles.userSummary}>
            <div className={styles.avatarWrapper} onClick={handleAvatarClick}>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <User size={40} />
                </div>
              )}
              <div className={styles.avatarOverlay}>
                <Camera size={20} />
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*" 
                onChange={handleFileChange}
              />
            </div>
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <span className={styles.roleBadge}>{user.role}</span>
          </div>

          <nav className={styles.nav}>
            <button 
              className={`${styles.navItem} ${activeTab === 'profile' ? styles.active : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <User size={18} />
              Personal Info
            </button>
            <button 
              className={`${styles.navItem} ${activeTab === 'security' ? styles.active : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <Lock size={18} />
              Security
            </button>
          </nav>
        </aside>

        <main className={styles.content}>
          {activeTab === 'profile' ? (
            <Card className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Personal Information</h2>
                <p>Update your photo and personal details here.</p>
              </div>

              <form onSubmit={handleUpdateProfile} className={styles.form}>
                <div className={styles.formGrid}>
                  <Input
                    label="DISPLAY NAME"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                  />
                  <Input
                    label="EMAIL ADDRESS"
                    value={user.email}
                    disabled
                    fullWidth
                    helperText="Email cannot be changed."
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold tracking-wider text-muted-foreground">BIO</label>
                  <textarea
                    className={styles.textarea}
                    placeholder="Tell us a little bit about yourself..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className={styles.formFooter}>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    isLoading={updateProfile.isPending}
                    className={styles.saveBtn}
                  >
                    <Save size={18} />
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card className={styles.card}>
              <div className={styles.cardHeader}>
                <h2>Security Settings</h2>
                <p>Ensure your account is using a long, random password to stay secure.</p>
              </div>

              <form onSubmit={handleChangePassword} className={styles.form}>
                <Input
                  label="CURRENT PASSWORD"
                  type="password"
                  value={passwords.oldPassword}
                  onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                  fullWidth
                  required
                />
                <Input
                  label="NEW PASSWORD"
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                  fullWidth
                  required
                  helperText="Minimum 8 characters."
                />
                <Input
                  label="CONFIRM NEW PASSWORD"
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                  fullWidth
                  required
                />

                {changePassword.error && (
                  <div className={styles.errorAlert}>
                    <AlertCircle size={18} />
                    <span>{(changePassword.error as any).response?.data?.message || changePassword.error.message}</span>
                  </div>
                )}

                <div className={styles.formFooter}>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    isLoading={changePassword.isPending}
                    className={styles.saveBtn}
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
