import { useState } from 'react';
import styles from './AuthPages.module.css';

export default function ForgotPasswordPage({ onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        setSent(true);
      } else {
        // Even on error, show success for security
        setSent(true);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.verificationCard}>
            <div className={styles.verificationIconSuccess}>📧</div>
            <h2 className={styles.authTitle}>Check Your Email</h2>
            <p className={styles.authSubtitle}>
              If an account exists with <strong>{email}</strong>, you'll receive a password reset link shortly.
            </p>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem' }}>
              The link will expire in 1 hour.
            </p>
            <button
              onClick={onBackToLogin}
              style={{
                marginTop: '1.5rem',
                padding: '0.75rem 1.5rem',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.authHeader}>
          <h1 className={styles.authTitle}>Reset Password</h1>
          <p className={styles.authSubtitle}>
            Enter your email and we'll send you a reset link
          </p>
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
              autoFocus
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`${styles.authButton} ${loading ? styles.authButtonDisabled : ''}`}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </div>

        <div className={styles.authFooter}>
          Remember your password?{' '}
          <button onClick={onBackToLogin} className={styles.linkButton}>
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}