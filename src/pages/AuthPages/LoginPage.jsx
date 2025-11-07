import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPages.module.css';

export default function LoginPage({ onSwitchToSignup, onSwitchToForgotPassword }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) return;
    
    setError('');
    setLoading(true);
    const result = await login(email, password);
    
    if (!result.success) {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Welcome Back</h1>
          <p className={styles.authSubtitle}>Sign in to your Nova dashboard</p>
        </div>

        <div className={styles.authForm}>
          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="you@example.com"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className={styles.label}>Password</label>
              <button 
                onClick={onSwitchToForgotPassword}
                className={styles.linkButton}
                style={{ fontSize: '0.8125rem' }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: 'relative', width: '100%' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder="••••••••"
                className={styles.input}
                style={{ paddingRight: '3rem', width: '100%' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  color: '#6b7280',
                  padding: '0.25rem'
                }}
                tabIndex="-1"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`${styles.authButton} ${loading ? styles.authButtonDisabled : ''}`}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>

        <div className={styles.authFooter}>
          Don't have an account?{' '}
          <button onClick={onSwitchToSignup} className={styles.linkButton}>
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}