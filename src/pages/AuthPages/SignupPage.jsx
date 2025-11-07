import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPages.module.css';

export default function SignupPage({ onSwitchToLogin, onSignupSuccess }) {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password || !businessName) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    
    setError('');
    setLoading(true);
    const result = await signup(email, password, businessName);
    
    if (result.success) {
      // Store credentials temporarily for auto-login after verification
      sessionStorage.setItem('signup_email', email);
      sessionStorage.setItem('signup_password', password);
      
      // Show success message
      if (onSignupSuccess) {
        onSignupSuccess(email);
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Create Account</h1>
          <p className={styles.authSubtitle}>Start your Nova journey</p>
        </div>

        <div className={styles.authForm}>
          {error && <div className={styles.errorBox}>{error}</div>}

          <div className={styles.formGroup}>
            <label className={styles.label}>Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Luxury Cakes Lagos"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
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
            <p className={styles.hint}>Minimum 8 characters</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`${styles.authButton} ${loading ? styles.authButtonDisabled : ''}`}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </div>

        <div className={styles.authFooter}>
          Already have an account?{' '}
          <button onClick={onSwitchToLogin} className={styles.linkButton}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}