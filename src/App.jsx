import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar/Sidebar';
import LoginPage from './pages/AuthPages/LoginPage';
import SignupPage from './pages/AuthPages/SignupPage';
import VerifyEmailPage from './pages/AuthPages/VerifyEmailPage';
import ForgotPasswordPage from './pages/AuthPages/ForgotPasswordPage';
import ResetPasswordPage from './pages/AuthPages/ResetPasswordPage';
import OnboardingPage from './pages/Onboarding/OnboardingPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import LeadsPage from './pages/Leads/LeadsPage';
import ConversationsPage from './pages/Conversations/ConversationsPage';
import MetricsPage from './pages/Metrics/MetricsPage';
import SettingsPage from './pages/Settings/SettingsPage';
import TestAgentPage from './pages/TestAgent/TestAgentPage';
import PublicTestAgentPage from './pages/PublicTestAgent/PublicTestAgentPage';
import './styles/global.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [activePage, setActivePage] = useState('dashboard');
  const [authView, setAuthView] = useState('login'); // 'login' | 'signup' | 'forgot-password'
  const [verificationToken, setVerificationToken] = useState(null);
  const [resetToken, setResetToken] = useState(null);
  const [showVerification, setShowVerification] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if we're on the public demo route
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/demo' || path === '/try-demo') {

    }
  }, []);

  // Check URL for tokens on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    const action = params.get('action');
    
    if (token && action === 'verify-email') {
      setVerificationToken(token);
      setShowVerification(true);
    } else if (token && action === 'reset-password') {
      setResetToken(token);
      setAuthView('reset-password');
    } else if (token) {
      // Backward compatibility - assume verification if no action specified
      setVerificationToken(token);
      setShowVerification(true);
    }
  }, []);

  // Check if user needs onboarding after login
  useEffect(() => {
    if (user && !showVerification && authView !== 'reset-password') {
      checkOnboardingStatus();
    }
  }, [user, showVerification, authView]);

  const checkOnboardingStatus = async () => {
    try {
      setCheckingOnboarding(true);
      const token = localStorage.getItem('nova_token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7700';
      
      const response = await fetch(`${API_URL}/business-profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        const profile = data.profile;
        
        if (!profile || !profile.business_description) {
          setNeedsOnboarding(true);
        } else {
          setNeedsOnboarding(false);
        }
      } else {
        setNeedsOnboarding(true);
      }
    } catch (error) {
      setNeedsOnboarding(true);
    } finally {
      setCheckingOnboarding(false);
    }
  };

  const handleSignupSuccess = (email) => {
    setSignupEmail(email);
    setShowVerification(true);
  };

  const handleVerificationComplete = () => {
    setShowVerification(false);
    setAuthView('login');
    // Clear URL params
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleResetPasswordComplete = () => {
    setAuthView('login');
    setResetToken(null);
    // Clear URL params
    window.history.replaceState({}, '', window.location.pathname);
  };

  const handleOnboardingComplete = () => {
    setNeedsOnboarding(false);
  };

  if (window.location.pathname === '/demo' || window.location.pathname === '/try-demo') {
    return <PublicTestAgentPage />;
  }

  if (loading || (user && checkingOnboarding)) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading Nova...</p>
      </div>
    );
  }

  // Show reset password page
  if (authView === 'reset-password' && resetToken) {
    return (
      <ResetPasswordPage
        token={resetToken}
        onComplete={handleResetPasswordComplete}
      />
    );
  }

  // Show verification page if token exists
  if (showVerification && verificationToken) {
    return (
      <VerifyEmailPage
        token={verificationToken}
        onComplete={handleVerificationComplete}
      />
    );
  }

  // Show verification success message after signup
  if (showVerification && signupEmail) {
    const handleResendEmail = async () => {
      try {
        const API_URL = import.meta.env.VITE_API_URL;
        const response = await fetch(`${API_URL}/auth/resend-verification`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: signupEmail })
        });

        if (response.ok) {
          alert('✅ Verification email sent! Check your inbox.');
        } else {
          alert('❌ Failed to resend. Please try again.');
        }
      } catch (error) {
        alert('❌ Failed to resend. Please try again.');
      }
    };

    return (
      <div style={styles.authContainer}>
        <div style={styles.authCard}>
          <div style={styles.verificationCard}>
            <div style={styles.verificationIconSuccess}>📧</div>
            <h2 style={styles.authTitle}>Check Your Email</h2>
            <p style={styles.authSubtitle}>
              We've sent a verification link to <strong>{signupEmail}</strong>
            </p>
            <p style={styles.verificationText}>
              Click the link in the email to verify your account and complete setup.
            </p>

            <button
              onClick={handleResendEmail}
              style={styles.resendButton}
            >
              📧 Resend Verification Email
            </button>

            <button
              onClick={() => {
                setShowVerification(false);
                setAuthView('login');
              }}
              style={styles.backButton}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated - show appropriate auth view
  if (!user) {
    switch (authView) {
      case 'signup':
        return (
          <SignupPage
            onSwitchToLogin={() => setAuthView('login')}
            onSignupSuccess={handleSignupSuccess}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordPage
            onBackToLogin={() => setAuthView('login')}
          />
        );
      default:
        return (
          <LoginPage
            onSwitchToSignup={() => setAuthView('signup')}
            onSwitchToForgotPassword={() => setAuthView('forgot-password')}
          />
        );
    }
  }

  // Authenticated but needs onboarding
  if (needsOnboarding) {
    return <OnboardingPage onComplete={handleOnboardingComplete} />;
  }

  // Authenticated and onboarded - show dashboard
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActivePage} />;
      case 'leads':
        return <LeadsPage />;
      case 'conversations':
        return <ConversationsPage />;
      case 'metrics':
        return <MetricsPage />;
      case 'test-agent':
        return <TestAgentPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage onNavigate={setActivePage} />;
    }
  };

  return (
    <div style={styles.app}>
      <Sidebar 
        activePage={activePage} 
        onNavigate={setActivePage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(true)}
        style={styles.mobileMenuBtn}
        className="mobile-menu-btn"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <main style={styles.main} className="main-content">{renderPage()}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

// Inline styles for main layout and auth pages
const styles = {
  app: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  main: {
    marginLeft: '260px',
    flex: 1,
    padding: '2rem',
    minHeight: '100vh',
    transition: 'margin-left 0.3s ease',
    width: 'calc(100% - 260px)'
  },
  mobileMenuBtn: {
    position: 'fixed',
    top: '1rem',
    left: '1rem',
    zIndex: 999,
    display: 'none',
    padding: '0.75rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '1rem'
  },
  spinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '0.875rem'
  },
  authContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    padding: '1rem'
  },
  authCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.07)',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px'
  },
  verificationCard: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem'
  },
  verificationIconSuccess: {
    fontSize: '4rem',
    marginBottom: '0.5rem'
  },
  authTitle: {
    fontSize: '1.875rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '0.5rem'
  },
  authSubtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    marginBottom: '0.5rem'
  },
  verificationText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    lineHeight: '1.5',
    marginBottom: '1rem'
  },
  resendButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '0.5rem',
    width: '100%'
  },
  backButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    width: '100%'
  }
};

// Add keyframes for spinner animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @media (max-width: 968px) {
      .main-content {
        margin-left: 80px !important;
        width: calc(100% - 80px) !important;
      }
    }

    @media (max-width: 640px) {
      .main-content {
        margin-left: 0 !important;
        width: 100% !important;
        padding: 1rem !important;
      }
      .mobile-menu-btn {
        display: flex !important;
      }
    }
  `;
  if (!document.getElementById('app-styles')) {
    style.id = 'app-styles';
    document.head.appendChild(style);
  }
}