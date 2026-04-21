"use client";
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useSignup } from '@/features/auth/hooks';
import styles from './SignUpPage.module.css';

const GithubIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
);

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: signup, isPending, error: apiError } = useSignup();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Invalid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeTerms) {
      newErrors.terms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) return;

    signup(formData);
  };

  const handleSocialSignUp = (provider: string) => {
    console.log(`Sign up with ${provider}`);
  };

  return (
    <>

      <div className={styles.container}>
        <div className={styles.layoutGrid}>
        {/* Left Side - Form */}
        <div className={styles.formSide}>
          <div className={styles.formContainer}>
            {/* Mobile Logo */}
            <div className={styles.mobileLogo}>
              <h1>The Curator</h1>
            </div>

            <div className={styles.header}>
              <h2>Begin your journey.</h2>
              <p>Join our community of digital curators and start organizing the world's knowledge.</p>
            </div>



            {/* Sign Up Form */}
            <form onSubmit={handleSubmit} className={styles.form}>
              {apiError && (
                <div className={styles.errorMessage}>
                  <p>{(apiError as Error).message}</p>
                </div>
              )}

              <Input
                label="FULL NAME"
                type="text"
                name="name"
                placeholder="Alexander Hamilton"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                fullWidth
              />

              <Input
                label="EMAIL ADDRESS"
                type="email"
                name="email"
                placeholder="curator@knowledge.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                fullWidth
              />

              <Input
                label="PASSWORD"
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                helperText={!errors.password && formData.password ? 'Password must be at least 8 characters long' : undefined}
                fullWidth
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

              <Input
                label="CONFIRM PASSWORD"
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                fullWidth
                endNode={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    className="bg-transparent border-none cursor-pointer flex text-inherit hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => {
                    setAgreeTerms(e.target.checked);
                    if (errors.terms) {
                      setErrors((prev) => ({ ...prev, terms: '' }));
                    }
                  }}
                  className={styles.checkbox}
                />
                <label htmlFor="agreeTerms" className={styles.checkboxLabel}>
                  I agree to the{' '}
                  <a href="#">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#">Privacy Policy</a>
                </label>
              </div>
              {errors.terms && <p className={styles.fieldError}>{errors.terms}</p>}

              <Button
                type="submit"
                variant="primary"
                isLoading={isPending}
                className={styles.submitBtn}
              >
                Create Account
              </Button>
            </form>

            {/* Divider */}
            <div className={styles.divider}>
              <div className={styles.dividerLine}></div>
              <span className={styles.dividerText}>Or continue with</span>
              <div className={styles.dividerLine}></div>
            </div>

            {/* Social Sign Up */}
            <div className={styles.socialButtons}>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialSignUp('Google')}
                className={styles.socialBtn}
              >
                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width={18} alt="Google" />
                <span>Continue with Google</span>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleSocialSignUp('GitHub')}
                className={styles.socialBtn}
              >
                <GithubIcon size={18} />
                <span>Continue with GitHub</span>
              </Button>
            </div>

            <div className={styles.signInLink}>
              Already have an account?{' '}
              <a href="/login">Log in</a>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <p>&copy; 2026 The Curator. All rights reserved.</p>
            </div>
          </div>
        </div>

        {/* Right Side - Featured Card */}
        <div className={styles.featuredSide}>
          <div className={styles.featuredCard}>
            <div className={styles.featuredHeader}>Featured Curator</div>
            <div className={styles.curatorInfo}>
              <div className={styles.avatar}></div>
              <div>
                <p className={styles.curatorName}>Julian Vane</p>
                <p className={styles.curatorTitle}>Senior Archivist</p>
              </div>
            </div>
            <blockquote className={styles.quote}>
              "Knowledge is a gallery that grows with every contribution."
            </blockquote>
            <p className={styles.stats}>
              Join Julian and 5,000+ other editors curating the next generation of technical narratives.
            </p>
            <div className={styles.badge}>Editorial Integrity</div>
          </div>
          <div className={styles.overlay}></div>
        </div>
        </div>
      </div>
    </>
  );
}