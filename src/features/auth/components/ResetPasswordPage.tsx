"use client";

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import styles from './LoginPage.module.css';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.formWrapper} style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 text-green-500 mb-6">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Password Reset Successful</h2>
          <p className="text-muted-foreground mb-8">
            Your password has been reset successfully. You can now log in with your new password.
          </p>
          <Button
            variant="primary"
            onClick={() => router.push('/login')}
            fullWidth
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper} style={{ maxWidth: '400px', margin: '100px auto' }}>
        <header className={styles.header}>
          <h2>Reset Password</h2>
          <p>Please enter your new password below.</p>
        </header>

        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            label="NEW PASSWORD"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            error={error && error.includes('match') ? undefined : error}
            endNode={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="bg-transparent border-none cursor-pointer flex text-inherit hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <Input
            label="CONFIRM NEW PASSWORD"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            required
            error={error && error.includes('match') ? error : undefined}
          />

          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            fullWidth
            className="mt-6"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </div>
  );
}
