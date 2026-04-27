"use client";

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import styles from './LoginPage.module.css'; // Reusing some styles

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
  };

  return (
    <div className={styles.container}>
      <div className={styles.formWrapper} style={{ maxWidth: '400px', margin: '100px auto' }}>
        {!isSubmitted ? (
          <>
            <header className={styles.header}>
              <Link href="/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
                <ArrowLeft size={16} />
                Back to Login
              </Link>
              <h2>Forgot Password?</h2>
              <p>No worries, we'll send you reset instructions.</p>
            </header>

            <form onSubmit={handleSubmit} className={styles.form}>
              <Input
                label="EMAIL ADDRESS"
                type="email"
                placeholder="curator@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
              />
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                fullWidth
                className="mt-4"
              >
                Send Instructions
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-6">
              <Mail size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Check your email</h2>
            <p className="text-muted-foreground mb-8">
              We've sent password reset instructions to <span className="font-semibold">{email}</span>.
            </p>
            <Button
              variant="outline"
              onClick={() => setIsSubmitted(false)}
              fullWidth
            >
              Didn't receive the email? Try again
            </Button>
            <Link href="/login" className="block mt-6 text-sm text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
