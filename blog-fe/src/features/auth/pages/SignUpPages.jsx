import { useState } from 'react';
import { Link } from 'react-router-dom';
import './css/SignUpPages.css';

export const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleSocialSignup = (provider) => {
    alert(`Đang kết nối với ${provider}... Tính năng này sẽ làm ở bước kết nối Backend nhé!`);
  };

  return (
    <div className="signup-container">
      {/* Cột trái: Form */}
      <div className="signup-form-section">
        <div className="signup-wrapper">
          <h1 className="signup-logo">Blog Cá Nhân</h1>
          
          <div className="signup-header">
            <h2>Begin your journey.</h2>
            <p>Join our community of digital curators and start organizing.</p>
          </div>

          <form className="signup-form">
            <div className="signup-field-group">
              <label className="signup-label">Full Name</label>
              <input type="text" placeholder="Vũ Đức Quý" className="signup-input" />
            </div>

            <div className="signup-field-group">
              <label className="signup-label">Email Address</label>
              <input type="email" placeholder="curator@knowledge.com" className="signup-input" />
            </div>

            <div className="signup-field-group">
              <label className="signup-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••"
                  className="signup-input signup-input-error password-with-toggle"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
              <p className="password-hint">● Password must be at least 8 characters long.</p>
            </div>

            <button type="submit" className="btn-create-acc">Create Account</button>
          </form>

          <div style={{textAlign: 'center', margin: '24px 0'}}>
            <p style={{fontSize: '10px', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px'}}>Or sign up with</p>
            <div className="social-group">
              <button className="btn-social" type="button" onClick={() => handleSocialSignup('Google')}>
                <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="16" alt="google" />
                Continue with Google
              </button>
              <button className="btn-social" type="button" onClick={() => handleSocialSignup('GitHub')}>
                <img src="https://www.svgrepo.com/show/512317/github-142.svg" width="16" style={{filter: 'invert(1)'}} alt="github" />
                Continue with GitHub
              </button>
            </div>
          </div>

          <p style={{textAlign: 'center', fontSize: '12px', fontWeight: 'bold', color: '#94a3b8'}}>
            Already have an account? <Link to="/login" style={{color: '#1d4ed8', textDecoration: 'none', marginLeft: '4px'}}>Log in.</Link>
          </p>
        </div>
      </div>

      {/* Cột phải: Showcase */}
      <div className="signup-showcase">
        <div className="curator-card">
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px'}}>
             <img src="https://i.pravatar.cc/100?u=quy" style={{width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #3b82f6'}} alt="avatar" />
             <div>
                <p style={{fontSize: '10px', fontWeight: 'bold', color: '#3b82f6', textTransform: 'uppercase', margin: 0}}>Featured Curator</p>
                <p style={{fontSize: '12px', fontWeight: 'bold', margin: 0}}>Backend Developer</p>
             </div>
          </div>
          <p style={{fontSize: '1.5rem', fontWeight: '500', fontStyle: 'italic', lineHeight: '1.2', marginBottom: '16px'}}>
            "Knowledge is a gallery that grows with every contribution."
          </p>
          <span style={{fontSize: '9px', padding: '4px 8px', background: '#2563eb', borderRadius: '99px', fontWeight: '900', textTransform: 'uppercase'}}>Editorial Integrity</span>
        </div>
      </div>
    </div>
  );
};