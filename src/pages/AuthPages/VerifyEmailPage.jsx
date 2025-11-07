import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './AuthPages.module.css';

export default function VerifyEmailPage({ token, onComplete }) {
    const { login } = useAuth();
    const [status, setStatus] = useState('verifying'); 
    const [error, setError] = useState('');
    const [resending, setResending] = useState(false);
    const [verifiedEmail, setVerifiedEmail] = useState('');
    
    // Use ref to prevent double execution
    const hasVerified = useRef(false);

    useEffect(() => {
        // Only verify once when component mounts with a token
        if (token && !hasVerified.current) {
            hasVerified.current = true;
            handleVerification();
        }
    }, [token]);

    const handleVerification = async () => {
        try {
            setStatus('verifying');
            
            // Call verify endpoint
            const API_URL = import.meta.env.VITE_API_URL;
            const response = await fetch(`${API_URL}/auth/verify-email?token=${token}`, {
                method: 'GET'
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Verification failed');
            }

            // Show success briefly
            setStatus('success');

            // Get stored credentials for auto-login
            const savedEmail = sessionStorage.getItem('signup_email');
            const savedPassword = sessionStorage.getItem('signup_password');

            if (savedEmail && savedPassword) {
                // Show logging in message
                setStatus('logging_in');
                
                // Wait 1 second for user to see success
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Auto-login
                const result = await login(savedEmail, savedPassword);

                // Clear stored credentials
                sessionStorage.removeItem('signup_email');
                sessionStorage.removeItem('signup_password');

                if (result.success) {
                    // Successfully logged in, redirect to dashboard
                    onComplete();
                } else {
                    // Login failed, but verification succeeded
                    setStatus('verified_manual_login');
                    setVerifiedEmail(savedEmail);
                }
            } else {
                // No stored credentials, just show success
                setStatus('verified_manual_login');
            }
        } catch (err) {
            setStatus('error');
            setError(err.message || 'Verification failed. The link may be expired or invalid.');
            
            // Try to get email from session for resend option
            const savedEmail = sessionStorage.getItem('signup_email');
            if (savedEmail) {
                setVerifiedEmail(savedEmail);
            }
        }
    };

    const handleResendVerification = async () => {
        if (!verifiedEmail && !sessionStorage.getItem('signup_email')) {
            setError('Email not found. Please try signing up again.');
            return;
        }

        setResending(true);
        try {
            const API_URL = import.meta.env.VITE_API_URL;
            const emailToUse = verifiedEmail || sessionStorage.getItem('signup_email');
            
            const response = await fetch(`${API_URL}/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailToUse })
            });

            if (response.ok) {
                setError('');
                setStatus('resent');
            } else {
                throw new Error('Failed to resend');
            }
        } catch (err) {
            setError('Failed to resend verification email. Please try again.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                {status === 'verifying' && (
                    <div className={styles.verificationCard}>
                        <div className={styles.spinner}></div>
                        <h2 className={styles.authTitle}>Verifying Email</h2>
                        <p className={styles.authSubtitle}>Please wait a moment...</p>
                    </div>
                )}
                
                {status === 'success' && (
                    <div className={styles.verificationCard}>
                        <div className={styles.verificationIconSuccess}>✅</div>
                        <h2 className={styles.authTitle}>Email Verified!</h2>
                        <p className={styles.authSubtitle}>
                            Your email has been successfully verified.
                        </p>
                    </div>
                )}

                {status === 'logging_in' && (
                    <div className={styles.verificationCard}>
                        <div className={styles.spinner}></div>
                        <h2 className={styles.authTitle}>Logging you in...</h2>
                        <p className={styles.authSubtitle}>
                            Setting up your Nova account
                        </p>
                    </div>
                )}

                {status === 'verified_manual_login' && (
                    <div className={styles.verificationCard}>
                        <div className={styles.verificationIconSuccess}>✅</div>
                        <h2 className={styles.authTitle}>Email Verified!</h2>
                        <p className={styles.authSubtitle}>
                            You can now log in to your account.
                        </p>
                        <button
                            onClick={onComplete}
                            style={{
                                marginTop: '1rem',
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
                            Go to Login
                        </button>
                    </div>
                )}

                {status === 'resent' && (
                    <div className={styles.verificationCard}>
                        <div className={styles.verificationIconSuccess}>📧</div>
                        <h2 className={styles.authTitle}>Email Sent!</h2>
                        <p className={styles.authSubtitle}>
                            A new verification link has been sent to your email.
                        </p>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
                            Please check your inbox and click the verification link.
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <div className={styles.verificationCard}>
                        <div className={styles.verificationIconError}>❌</div>
                        <h2 className={styles.authTitle}>Verification Failed</h2>
                        <p className={styles.authSubtitle} style={{ color: '#dc2626' }}>
                            {error}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem', width: '100%' }}>
                            <button
                                onClick={handleResendVerification}
                                disabled={resending}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: resending ? '#9ca3af' : '#667eea',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    cursor: resending ? 'not-allowed' : 'pointer'
                                }}
                            >
                                {resending ? 'Sending...' : '📧 Resend Verification Email'}
                            </button>
                            <button
                                onClick={onComplete}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    backgroundColor: '#f3f4f6',
                                    color: '#374151',
                                    border: '1px solid #d1d5db',
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
                )}
            </div>
        </div>
    );
}