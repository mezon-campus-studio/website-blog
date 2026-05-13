'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, Input, Card, CardContent, ThemeToggle } from '@/components/ui';
import { useResetPassword } from '@/features/auth/hooks';
import { Lock, CheckCircle2, Eye, EyeOff } from 'lucide-react';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: resetPassword, isPending, error } = useResetPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    resetPassword({ token, password }, {
      onSuccess: () => {
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/signin');
        }, 3000);
      },
    });
  };

  if (!token) {
    return (
      <div className="w-full max-w-[450px] animate-in fade-in zoom-in duration-300">
        <Card className="border-none shadow-2xl bg-card-bg shadow-primary/5">
          <CardContent className="p-10 text-center flex flex-col items-center gap-6">
            <div className="w-20 h-20 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mb-2 border border-destructive/20">
              <Lock size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-black mb-3 tracking-tight text-destructive">Invalid Link</h1>
              <p className="text-muted-foreground leading-relaxed">
                The password reset link is invalid, has expired, or has already been used for security reasons.
              </p>
            </div>
            <Button
              onClick={() => router.push('/forgot-password')}
              className="w-full py-6 rounded-full font-bold shadow-lg shadow-primary/10"
            >
              Request new link
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[450px] animate-in fade-in zoom-in duration-300">
      <Card className="border-none shadow-2xl bg-card-bg shadow-primary/5">
        <CardContent className="p-10 flex flex-col gap-0">
          {!isSuccess ? (
            <>
              <div className="mb-8">
                <h1 className="text-4xl font-black mb-3 tracking-tight">New password</h1>
                <p className="text-muted-foreground leading-relaxed">
                  Set your new credentials to regain access to your curated world.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <Input
                  label="New Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  startNode={<Lock size={18} className="text-muted-foreground" />}
                  endNode={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
                />

                <Input
                  label="Confirm New Password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Repeat for security"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  startNode={<Lock size={18} className="text-muted-foreground" />}
                  endNode={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  }
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
                  {isPending ? 'Updating...' : 'Update Password'}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20">
                <CheckCircle2 size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2 tracking-tight">Success!</h2>
              <p className="text-muted-foreground mb-8">
                Your password has been reset successfully. <br />
                <span className="text-sm">Redirecting to login shortly...</span>
              </p>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-green-500 animate-loading-bar" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-10">
      <ThemeToggle className="fixed top-6 right-6 z-50" />

      <style jsx global>{`
        @keyframes loading-bar {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-loading-bar {
          animation: loading-bar 3s linear forwards;
        }
      `}</style>

      <Suspense fallback={<div className="text-muted-foreground">Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}