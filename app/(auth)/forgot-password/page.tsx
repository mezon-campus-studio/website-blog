'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, Input, Card, CardContent, ThemeToggle } from '@/components/ui';
import { useForgotPassword } from '@/features/auth/hooks';
import { ArrowLeft, Mail, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { mutate: forgotPassword, isPending, error } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword(email, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-10">
      <ThemeToggle className="fixed top-6 right-6 z-50" />
      
      <div className="w-full max-w-[450px] animate-in fade-in zoom-in duration-300">
        <Card className="border-none shadow-2xl bg-card-bg shadow-primary/5">
          <CardContent className="p-10 flex flex-col gap-0">
            <Link 
              href="/signin" 
              className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Sign in
            </Link>

            {!isSubmitted ? (
              <>
                <div className="mb-8">
                  <h1 className="text-4xl font-black mb-3 tracking-tight">Reset password</h1>
                  <p className="text-muted-foreground leading-relaxed">
                    Enter your email address and we'll send you a secure link to reset your account credentials.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <Input
                    label="Email Address"
                    placeholder="name@example.com"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    startNode={<Mail size={18} className="text-muted-foreground" />}
                  />

                  {error && (
                    <p className="text-sm text-destructive font-medium bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                      {error.message}
                    </p>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full py-6 rounded-full font-bold shadow-lg shadow-primary/20"
                    disabled={isPending}
                  >
                    {isPending ? 'Sending Link...' : 'Send Reset Link'}
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-bold mb-4">Check your email</h2>
                <p className="text-muted-foreground mb-8">
                  We've sent a password reset link to <br/>
                  <span className="text-foreground font-medium">{email}</span>
                </p>
                <Button 
                  variant="outline" 
                  className="w-full rounded-full"
                  onClick={() => setIsSubmitted(false)}
                >
                  Didn't receive it? Try again
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
