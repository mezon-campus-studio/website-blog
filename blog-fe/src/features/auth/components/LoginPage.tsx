"use client";
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Input, Card, CardContent, ThemeToggle, Checkbox } from '@/components/ui';
import { useLogin } from '@/features/auth/hooks';
import styles from './LoginPage.module.css';
import { SavedAccounts, SavedAccount } from './SavedAccounts';

const GithubIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);

  const router = useRouter();
  const { mutate: login, isPending, error: authError } = useLogin();

  useEffect(() => {
    const saved = localStorage.getItem('saved_accounts');
    if (saved) {
      try {
        setSavedAccounts(JSON.parse(saved));
      } catch (e) {
        setSavedAccounts([]);
      }
    }
  }, []);

  const handleSubmit = (e?: FormEvent, customEmail?: string, customPassword?: string) => {
    e?.preventDefault();
    
    const targetEmail = customEmail || email;
    const targetPassword = customPassword || password;

    login({ email: targetEmail, password: targetPassword }, {
      onSuccess: (data) => {
        if (rememberMe) {
          const newAccount: SavedAccount = {
            email: targetEmail,
            name: data.user.name,
            avatar_url: data.user.avatar_url,
            password: btoa(targetPassword) // Simple encoding for dev convenience
          };

          const updated = [newAccount, ...savedAccounts.filter(a => a.email !== targetEmail)].slice(0, 5);
          localStorage.setItem('saved_accounts', JSON.stringify(updated));
        }
        router.push('/');
      }
    });
  };

  const handleSelectAccount = (account: SavedAccount) => {
    setEmail(account.email);
    const decodedPassword = account.password ? atob(account.password) : '';
    setPassword(decodedPassword);
    
    // Auto login if password exists
    if (decodedPassword) {
      handleSubmit(undefined, account.email, decodedPassword);
    }
  };

  const handleRemoveAccount = (emailToRemove: string) => {
    const updated = savedAccounts.filter(a => a.email !== emailToRemove);
    setSavedAccounts(updated);
    localStorage.setItem('saved_accounts', JSON.stringify(updated));
  };

  return (
    <div className={styles.container}>
      <ThemeToggle className="fixed top-6 right-6 z-50" />
      <div className={styles.layoutGrid}>
        <div className={styles.leftSide}>
          <div className={styles.brandContent}>
            <h1 className={styles.brandTitle}>Memorizz</h1>
            <p className={styles.brandQuote}>
              "Knowledge is not just information; it is the art of connection and the clarity of curation."
            </p>
            <div className={styles.accent} />
          </div>
          <div className={styles.watermark}>MEMORIZZ</div>
        </div>

        <div className={styles.rightSide}>
          <Card className={styles.authCard}>
            <CardContent className={styles.cardContent}>
              <div className={styles.formWrapper}>
                <header className={styles.header}>
                  <h2>Welcome back</h2>
                  <p>Continue your journey through the curated world of knowledge.</p>
                </header>

                <SavedAccounts 
                  accounts={savedAccounts} 
                  onSelect={handleSelectAccount} 
                  onRemove={handleRemoveAccount} 
                />

                <form onSubmit={handleSubmit} className={styles.form}>
                  <Input
                    label="EMAIL ADDRESS"
                    name="email"
                    autoComplete="username"
                    placeholder="hello@memorizz.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    error={authError ? (authError as Error).message : undefined}
                    className={styles.formInput}
                  />

                  <Input
                    label="PASSWORD"
                    name="password"
                    autoComplete="current-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    className={styles.formInput}
                    endNode={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="bg-transparent border-none cursor-pointer flex text-inherit hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                  />

                  <div className="flex items-center justify-between">
                    <Checkbox 
                      label="Remember me" 
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <Link 
                      href="/forgot-password" 
                      className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors uppercase tracking-widest"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <Button 
                    type="submit" 
                    variant="primary" 
                    isLoading={isPending}
                    className={styles.submitBtn}
                  >
                    Sign In
                  </Button>
                </form>

                <div className={styles.divider}>
                  <span>OR CONTINUE WITH</span>
                </div>

                <div className={styles.socialButtons}>
                  <Button variant="outline" className={styles.socialBtn}>
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width={18} alt="Google" />
                    <span>Continue with Google</span>
                  </Button>
                  <Button variant="outline" className={styles.socialBtn}>
                    <GithubIcon size={18} />
                    <span>Continue with GitHub</span>
                  </Button>
                </div>

                <p className={styles.signUpPrompt}>
                  Don't have an account yet?{' '}
                  <a href="/signup" className={styles.linkBold}>Create an account</a>
                </p>
              </div>
            </CardContent>
          </Card>

          <footer className={styles.formFooter}>
            <nav className={styles.footerNav}>
              <a href="#">PRIVACY POLICY</a>
              <a href="#">TERMS OF SERVICE</a>
              <a href="#">HELP CENTER</a>
            </nav>
            <div className={styles.footer}>
              <p>&copy; 2026 Memorizz. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}