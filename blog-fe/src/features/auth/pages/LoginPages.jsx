import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './css/LoginPages.css';

export const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSocialLogin = (provider) => {
    alert(`Đang kết nối với ${provider}... Tính năng này sẽ làm ở bước kết nối Backend nhé!`);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email || !password) {
      alert('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }
    navigate('/home');
  };
  return (
    <div className="login-container">
      <div className="login-brand">
        <h1 className="brand-title">Blog Cá Nhân</h1>
        <p className="brand-text">
          "Knowledge is not just information; it is the art of connection and the clarity of curation."
        </p>
      </div>

      <div className="login-form-section">
        <div className="form-wrapper">
          <div className="form-header">
            <h2>Welcome</h2>
            <p>Continue your journey through the curated world of knowledge.</p>
          </div>

          <div className="social-group">
            <button className="btn-social" type="button" onClick={() => handleSocialLogin('Google')}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="16" alt="google" />
              Continue with Google
            </button>
            <button className="btn-social" type="button" onClick={() => handleSocialLogin('GitHub')}>
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" width="16" style={{filter: 'invert(1)'}} alt="github" />
              Continue with GitHub
            </button>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-group">
              <label className="input-label">Email Address</label>
              <input
                type="email"
                placeholder="curator@example.com"
                className="input-field"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field password-with-toggle"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
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
            </div>
            <button type="submit" className="btn-login">Sign In</button>
          </form>

          <p style={{textAlign: 'center', marginTop: '24px', color: '#64748b', fontSize: '14px'}}>
            Don't have an account? <Link to="/signup" style={{color: '#3b82f6', fontWeight: 'bold', textDecoration: 'none'}}>Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};