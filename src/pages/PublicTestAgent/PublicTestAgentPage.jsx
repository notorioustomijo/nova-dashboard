import { useState, useRef, useEffect } from 'react';

export default function PublicTestAgentPage() {
  const [agentName, setAgentName] = useState('Nova');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [personalityType, setPersonalityType] = useState('friendly');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [configSaved, setConfigSaved] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [signupBusinessName, setSignupBusinessName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signupError, setSignupError] = useState('');
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const iframeRef = useRef(null);

  // Listen for signup request from widget iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'NOVA_OPEN_SIGNUP') {
        setShowSignupModal(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleSaveConfig = () => {
    if (!businessName || !businessDescription) {
      setToastMessage('❌ Please fill in business name and description');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    const demoConfig = {
      agent_name: agentName,
      business_name: businessName,
      business_description: businessDescription,
      personality_type: personalityType,
      timestamp: Date.now()
    };
    
    sessionStorage.setItem('nova_demo_config', JSON.stringify(demoConfig));
    sessionStorage.setItem('nova_demo_turns', '0');
    
    setConfigSaved(true);
    setToastMessage('✅ Configuration saved! Click "Start Testing" below.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleStartTest = () => {
    if (!configSaved) {
      setToastMessage('❌ Please save your configuration first');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setPreviewLoading(true);
    setPreviewVisible(true);
    
    setTimeout(() => {
      if (iframeRef.current) {
        iframeRef.current.src = `${import.meta.env.VITE_WIDGET_URL}?demo=true`;
      }
      setPreviewLoading(false);
      setToastMessage('🎬 Demo Preview Loaded!');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }, 1000);
  };

  const handleSignup = async () => {
    if (!email || !password || !signupBusinessName) {
      setSignupError('Please fill in all fields');
      return;
    }

    if (password.length < 8) {
      setSignupError('Password must be at least 8 characters');
      return;
    }

    setSignupError('');
    setSignupLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          business_name: signupBusinessName
        })
      });

      if (response.ok) {
        //Show verification message
        setVerificationEmail(email);
        setSignupSuccess(true);
        setSignupError('');
      } else {
        const error = await response.json();
        setSignupError(error.detail || 'Signup failed');
      }
    } catch (err) {
      setSignupError('Something went wrong. Please try again.');
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div style={styles.page} className="public-demo-page">
      <title>Nova Demo - Test AI Support Agent for Free</title>
      <meta name="description" content="Nova's AI support demo. Add your business name and description, choose personality style and test conversations for free. Sign up for full access and deployment." />
      {showToast && (
        <div style={styles.toast} className="toast">
          {toastMessage}
        </div>
      )}

      {/* Signup Modal */}
      {/* Signup Modal */}
{showSignupModal && (
  <div style={styles.modalOverlay} onClick={() => setShowSignupModal(false)}>
    <div style={styles.modal} className="signup-modal" onClick={(e) => e.stopPropagation()}>
      {signupSuccess ? (
        // Verification message
        <div style={styles.verificationCard}>
          <div style={styles.verificationIcon}>📧</div>
          <h3 style={styles.modalTitle}>Check Your Email</h3>
          <p style={styles.verificationText}>
            We've sent a verification link to <strong>{verificationEmail}</strong>
          </p>
          <p style={styles.verificationSubtext}>
            Click the link in the email to verify your account, then log in.
          </p>

          <button
            onClick={() => {
              setShowSignupModal(false);
              setSignupSuccess(false);
            }}
            style={styles.closeModalButton}
          >
            Close
          </button>
        </div>
      ) : (
        // Your existing signup form stays exactly as is
        <>
          <div style={styles.modalHeader}>
            <h3 style={styles.modalTitle}>🚀 Sign Up to Continue</h3>
            <button style={styles.modalClose} onClick={() => setShowSignupModal(false)}>×</button>
          </div>
          <div style={styles.modalBody}>
            {signupError && <div style={styles.errorBox}>{signupError}</div>}
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Business Name</label>
              <input
                type="text"
                value={signupBusinessName}
                onChange={(e) => setSignupBusinessName(e.target.value)}
                placeholder={businessName || "Your Business"}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <div style={{position: 'relative'}}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  style={{...styles.input, paddingRight: '3rem'}}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={styles.passwordToggle}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <p style={styles.hint}>Minimum 8 characters</p>
            </div>

            <ul style={styles.modalFeatures}>
              <li>✅ Use your demo configuration</li>
              <li>✅ Unlimited conversations</li>
              <li>✅ View analytics & leads</li>
              <li>✅ Deploy to your website</li>
            </ul>
          </div>
          <div style={styles.modalFooter}>
            <button style={styles.signupButton} onClick={handleSignup} disabled={signupLoading}>
              {signupLoading ? 'Creating Account...' : 'Create Free Account'}
            </button>
          </div>
        </>
      )}
    </div>
  </div>
)}

      {/* Mobile overlay for sidebar */}
      {sidebarOpen && (
        <div style={styles.sidebarOverlay} className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div style={styles.publicSidebar} className={`public-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div style={styles.sidebarHeader}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>👩🏾‍🦱</span>
            <span style={styles.logoText}>Nova</span>
          </div>
          <span style={styles.demoBadge}>DEMO</span>
        </div>

        <button style={styles.signupCTA} onClick={() => setShowSignupModal(true)}>
          <span style={styles.ctaIcon}>🚀</span>
          <div style={styles.ctaContent}>
            <div style={styles.ctaTitle}>Sign Up Free</div>
            <div style={styles.ctaSubtitle}>Get your own AI agent</div>
          </div>
        </button>

        <div style={styles.sidebarDivider}></div>

        <div style={styles.lockedSection}>
          <div style={styles.navItem}>
            <span style={styles.navIcon}>📊</span>
            <span style={styles.navText}>Dashboard</span>
            <span style={styles.lockIcon}>🔒</span>
          </div>
          <div style={styles.navItem}>
            <span style={styles.navIcon}>👥</span>
            <span style={styles.navText}>Leads</span>
            <span style={styles.lockIcon}>🔒</span>
          </div>
          <div style={styles.navItem}>
            <span style={styles.navIcon}>💬</span>
            <span style={styles.navText}>Conversations</span>
            <span style={styles.lockIcon}>🔒</span>
          </div>
          <div style={styles.navItem}>
            <span style={styles.navIcon}>📈</span>
            <span style={styles.navText}>Metrics</span>
            <span style={styles.lockIcon}>🔒</span>
          </div>
          
          <div style={styles.lockOverlay}>
            <div style={styles.lockMessage}>
              <span style={styles.lockEmoji}>🔐</span>
              <p style={styles.lockText}>Sign up to access all features</p>
            </div>
          </div>
        </div>
      </div>

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

      {/* Main Content */}
      <main style={styles.main} className="demo-main">
        <div style={styles.header} className="demo-header">
          <div>
            <h1 style={styles.pageTitle}>🧪 Try Nova - Free Demo</h1>
            <p style={styles.pageDescription}>
              Configure your agent and test up to 4 messages
            </p>
          </div>
          <button style={styles.signupButtonHeader} className="header-signup-btn" onClick={() => setShowSignupModal(true)}>
            Sign Up Free
          </button>
        </div>

        <div style={styles.container} className="demo-container">
          {/* Config Panel */}
          <div style={styles.configPanel} className="config-panel">
            <h3 style={styles.panelTitle}>Agent Configuration</h3>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Agent Name</label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Nova"
                style={styles.input}
                disabled={configSaved}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your Business Name"
                style={styles.input}
                disabled={configSaved}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Business Description</label>
              <textarea
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                rows={6}
                placeholder="Describe your business, products, pricing, policies, etc."
                style={styles.textarea}
                disabled={configSaved}
              />
              <p style={styles.hint}>This is what your agent knows about your business</p>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Personality</label>
              <select
                value={personalityType}
                onChange={(e) => setPersonalityType(e.target.value)}
                style={styles.select}
                disabled={configSaved}
              >
                <option value="friendly">Friendly - Warm & casual</option>
                <option value="professional">Professional - Formal & polished</option>
                <option value="luxury">Luxury - Elegant & refined</option>
              </select>
            </div>

            {!configSaved ? (
              <button onClick={handleSaveConfig} style={styles.testButton}>
                💾 Save Configuration
              </button>
            ) : (
              <>
                <button onClick={handleStartTest} style={styles.testButton}>
                  🎬 Start Testing
                </button>
                <button 
                  onClick={() => {
                    setConfigSaved(false);
                    setPreviewVisible(false);
                    sessionStorage.removeItem('nova_demo_config');
                    sessionStorage.removeItem('nova_demo_turns');
                  }} 
                  style={{...styles.testButton, background: '#6b7280', marginTop: '0.5rem'}}
                >
                  ✏️ Edit Configuration
                </button>
              </>
            )}

            <div style={styles.infoBox}>
              <p style={styles.infoTitle}>💡 Demo Limits</p>
              <ul style={styles.infoList}>
                <li>Test up to 4 conversations</li>
                <li>Try lead capture features</li>
                <li>See AI responses in real-time</li>
                <li>Sign up for unlimited use</li>
              </ul>
            </div>

            {configSaved && (
              <div style={styles.signupCard}>
                <p style={styles.signupCardTitle}>Love what you see?</p>
                <p style={styles.signupCardText}>
                  Sign up to save your configuration and deploy your AI agent
                </p>
                <button style={styles.signupCardButton} onClick={() => setShowSignupModal(true)}>
                  Get Started Free →
                </button>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          <div style={styles.previewPanel} className="preview-panel">
            <div style={styles.previewHeader}>
              <span style={styles.previewTitle}>Live Preview</span>
              <span style={styles.previewBadge}>Demo Widget</span>
            </div>

            {previewVisible ? (
              previewLoading ? (
                <div style={{...styles.loadingContainer, minHeight: '600px'}}>
                  <div style={styles.spinner}></div>
                  <p style={styles.loadingText}>Loading demo preview...</p>
                </div>
              ) : (
                <div style={styles.mockBrowser} className="mock-browser">
                  <div style={styles.browserBar}>
                    <div style={styles.browserDots}>
                      <span style={{...styles.dot, background: '#ff5f56'}}></span>
                      <span style={{...styles.dot, background: '#ffbd2e'}}></span>
                      <span style={{...styles.dot, background: '#27c93f'}}></span>
                    </div>
                    <div style={styles.browserUrl}>
                      <span style={styles.urlLock}>🔒</span>
                      <span className="browser-url-text">yourbusiness.com</span>
                    </div>
                    <div style={styles.browserDots}></div>
                  </div>

                  <div style={styles.mockContent}>
                    <div style={styles.mockSection}>
                      <div style={styles.mockHeader}></div>
                      <div style={styles.mockText}></div>
                      <div style={{...styles.mockText, width: '60%'}}></div>
                    </div>

                    <iframe
                      ref={iframeRef}
                      style={styles.widgetIframe}
                      title="Nova Widget Demo"
                      src={`${import.meta.env.VITE_WIDGET_URL}?demo=true`}
                    />
                  </div>
                </div>
              )
            ) : (
              <div style={{...styles.placeholder, minHeight: '600px'}} className="placeholder">
                <h3 style={styles.placeholderTitle}>Configure Your AI Agent</h3>
                <p style={styles.placeholderText}>
                  Fill in your business details and save to start testing
                </p>
                <div style={styles.placeholderFeatures}>
                  <div style={styles.featureItem}>
                    <span style={styles.featureIcon}>💬</span>
                    <span style={styles.featureText}>Natural conversations</span>
                  </div>
                  <div style={styles.featureItem}>
                    <span style={styles.featureIcon}>📝</span>
                    <span style={styles.featureText}>Lead capture</span>
                  </div>
                  <div style={styles.featureItem}>
                    <span style={styles.featureIcon}>⚡</span>
                    <span style={styles.featureText}>Instant responses</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  publicSidebar: {
    width: '260px',
    background: 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)',
    padding: '2rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    position: 'fixed',
    height: '100vh',
    left: 0,
    top: 0,
    zIndex: 1001,
    transition: 'transform 0.3s ease'
  },
  sidebarOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'none'
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
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  logoIcon: {
    fontSize: '1.5rem'
  },
  logoText: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: 'white'
  },
  demoBadge: {
    padding: '0.25rem 0.5rem',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    borderRadius: '4px',
    fontSize: '0.625rem',
    fontWeight: '700'
  },
  signupCTA: {
    background: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    transition: 'transform 0.2s',
    width: '100%'
  },
  ctaIcon: {
    fontSize: '2rem'
  },
  ctaContent: {
    textAlign: 'left'
  },
  ctaTitle: {
    fontSize: '0.875rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '0.125rem'
  },
  ctaSubtitle: {
    fontSize: '0.75rem',
    color: '#6b7280'
  },
  sidebarDivider: {
    height: '1px',
    background: 'rgba(255,255,255,0.2)',
    margin: '0.5rem 0'
  },
  lockedSection: {
    position: 'relative',
    flex: 1
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.875rem 1rem',
    color: 'rgba(255,255,255,0.6)',
    borderRadius: '8px',
    marginBottom: '0.5rem',
    fontSize: '0.875rem'
  },
  navIcon: {
    fontSize: '1.125rem'
  },
  navText: {
    flex: 1
  },
  lockIcon: {
    fontSize: '0.875rem',
    opacity: 0.6
  },
  lockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(102, 126, 234, 0.85)',
    backdropFilter: 'blur(4px)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem'
  },
  lockMessage: {
    textAlign: 'center',
    color: 'white'
  },
  lockEmoji: {
    fontSize: '3rem',
    display: 'block',
    marginBottom: '1rem'
  },
  lockText: {
    fontSize: '0.875rem',
    fontWeight: '600',
    margin: 0
  },
  main: {
    marginLeft: '260px',
    flex: 1,
    padding: '2rem',
    width: 'calc(100% - 260px)',
    transition: 'margin-left 0.3s ease'
  },
  toast: {
    position: 'fixed',
    top: '2rem',
    right: '2rem',
    background: '#10b981',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
    zIndex: 9999,
    fontWeight: '600'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10000,
    padding: '1rem'
  },
  modal: {
    background: 'white',
    borderRadius: '16px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    maxHeight: '90vh',
    overflowY: 'auto'
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb'
  },
  modalTitle: {
    fontSize: '1.25rem',
    fontWeight: '700',
    color: '#111827',
    margin: 0
  },
  modalClose: {
    background: 'none',
    border: 'none',
    fontSize: '2rem',
    color: '#6b7280',
    cursor: 'pointer',
    padding: 0,
    width: '2rem',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalBody: {
    padding: '1.5rem'
  },
  modalFeatures: {
    listStyle: 'none',
    padding: 0,
    margin: '1rem 0 0 0',
    fontSize: '0.875rem'
  },
  modalFooter: {
    padding: '1.5rem',
    borderTop: '1px solid #e5e7eb'
  },
  signupButton: {
    width: '100%',
    padding: '0.875rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  errorBox: {
    padding: '0.875rem',
    background: '#fee2e2',
    color: '#991b1b',
    borderRadius: '8px',
    fontSize: '0.875rem',
    marginBottom: '1rem'
  },
  formGroup: {
    marginBottom: '1rem'
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem'
  },
  input: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    background: 'white',
    cursor: 'pointer',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  hint: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '0.5rem',
    margin: '0.5rem 0 0 0'
  },
  passwordToggle: {
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
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
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
  header: {
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  pageTitle: {
    fontSize: '2rem',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '0.5rem'
  },
  pageDescription: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: 0
  },
  signupButtonHeader: {
    padding: '0.75rem 1.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    whiteSpace: 'nowrap'
  },
  container: {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: '2rem',
    alignItems: 'start'
  },
  configPanel: {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    position: 'sticky',
    top: '2rem'
  },
  panelTitle: {
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '1.5rem'
  },
  testButton: {
    width: '100%',
    padding: '0.875rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    marginBottom: '1rem'
  },
  infoBox: {
    background: '#f9fafb',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid #e5e7eb',
    marginBottom: '1rem'
  },
  infoTitle: {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '0.5rem',
    margin: '0 0 0.5rem 0'
  },
  infoList: {
    margin: 0,
    paddingLeft: '1.25rem',
    fontSize: '0.8125rem',
    color: '#6b7280',
    lineHeight: '1.8'
  },
  signupCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center'
  },
  signupCardTitle: {
    fontSize: '1rem',
    fontWeight: '700',
    color: 'white',
    marginBottom: '0.5rem',
    margin: '0 0 0.5rem 0'
  },
  signupCardText: {
    fontSize: '0.8125rem',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '1rem',
    margin: '0 0 1rem 0'
  },
  signupCardButton: {
    width: '100%',
    padding: '0.75rem',
    background: 'white',
    color: '#667eea',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
  previewPanel: {
    background: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  previewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  previewTitle: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#111827'
  },
  previewBadge: {
    padding: '0.25rem 0.75rem',
    background: '#dbeafe',
    color: '#1e40af',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600'
  },
  mockBrowser: {
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  browserBar: {
    background: '#f3f4f6',
    padding: '0.75rem 1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #e5e7eb',
    gap: '0.5rem'
  },
  browserDots: {
    display: 'flex',
    gap: '0.5rem',
    minWidth: '60px'
  },
  dot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%'
  },
  browserUrl: {
    flex: 1,
    background: 'white',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#6b7280',
    minWidth: 0
  },
  urlLock: {
    fontSize: '0.875rem',
    flexShrink: 0
  },
  mockContent: {
    background: '#f9fafb',
    minHeight: '600px',
    padding: '2rem',
    position: 'relative'
  },
  mockSection: {
    maxWidth: '600px',
    margin: '0 auto'
  },
  mockHeader: {
    height: '40px',
    background: '#e5e7eb',
    borderRadius: '8px',
    marginBottom: '1rem'
  },
  mockText: {
    height: '20px',
    background: '#e5e7eb',
    borderRadius: '4px',
    marginBottom: '0.75rem',
    width: '80%'
  },
  widgetIframe: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    border: 'none'
  },
  placeholder: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f9fafb',
    border: '1px dashed #d1d5db',
    borderRadius: '8px',
    textAlign: 'center',
    padding: '3rem 2rem'
  },
  placeholderTitle: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.5rem'
  },
  placeholderText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    maxWidth: '80%',
    marginBottom: '2rem'
  },
  placeholderFeatures: {
    display: 'flex',
    gap: '2rem',
    justifyContent: 'center',
    flexWrap: 'wrap'
  },
  featureItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  featureIcon: {
    fontSize: '2rem'
  },
  featureText: {
    fontSize: '0.8125rem',
    color: '#6b7280',
    fontWeight: '500'
  },
  verificationCard: {
    textAlign: 'center',
    padding: '2rem'
  },
  verificationIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  verificationText: {
    fontSize: '0.875rem',
    color: '#111827',
    marginBottom: '0.75rem',
    lineHeight: '1.5'
  },
  verificationSubtext: {
    fontSize: '0.8125rem',
    color: '#6b7280',
    marginBottom: '1.5rem',
    lineHeight: '1.5'
  },
  closeModalButton: {
    width: '100%',
    padding: '0.875rem',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer'
  },
};

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    /* Tablet - Stack layout, adjust sidebar */
    @media (max-width: 968px) {
      .demo-container {
        grid-template-columns: 1fr !important;
        gap: 1.5rem !important;
      }

      .config-panel {
        position: static !important;
        max-width: 100%;
      }

      .preview-panel {
        order: 2;
      }

      .demo-header h1 {
        font-size: 1.5rem !important;
      }

      .demo-main {
        margin-left: 260px !important;
        width: calc(100% - 260px) !important;
      }
    }

    /* Mobile - Sidebar becomes overlay, full responsive */
    @media (max-width: 640px) {
      .public-sidebar {
        transform: translateX(-100%) !important;
      }

      .public-sidebar.sidebar-open {
        transform: translateX(0) !important;
        box-shadow: 2px 0 12px rgba(0, 0, 0, 0.2);
      }

      .sidebar-overlay {
        display: block !important;
        animation: fadeIn 0.3s ease;
      }

      .mobile-menu-btn {
        display: flex !important;
      }

      .demo-main {
        margin-left: 0 !important;
        width: 100% !important;
        padding: 1rem !important;
        padding-top: 4rem !important;
      }

      .demo-header {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 0.75rem !important;
      }

      .demo-header h1 {
        font-size: 1.25rem !important;
      }

      .demo-header p {
        font-size: 0.875rem !important;
      }

      .header-signup-btn {
        width: 100%;
      }

      .demo-container {
        gap: 1rem !important;
      }

      .config-panel,
      .preview-panel {
        border-radius: 8px !important;
        padding: 1.5rem !important;
      }

      .mock-browser {
        border-radius: 6px !important;
      }

      .browserBar {
        padding: 0.5rem !important;
      }

      .browserDots {
        min-width: 40px !important;
      }

      .browser-url-text {
        display: none;
      }

      .dot {
        width: 8px !important;
        height: 8px !important;
      }

      .mockContent {
        padding: 1rem !important;
        min-height: 500px !important;
      }

      .placeholder {
        min-height: 400px !important;
        padding: 1.5rem !important;
      }

      .placeholder h3 {
        font-size: 1.125rem !important;
      }

      .placeholder p {
        font-size: 0.8125rem !important;
        max-width: 100% !important;
      }

      .placeholderFeatures {
        flex-direction: column;
        gap: 1rem !important;
      }

      .toast {
        top: 1rem !important;
        right: 1rem !important;
        left: 1rem !important;
        padding: 0.875rem 1rem !important;
        font-size: 0.8125rem !important;
      }

      .signup-modal {
        max-width: 95% !important;
        margin: 1rem;
      }

      .modalHeader,
      .modalBody,
      .modalFooter {
        padding: 1rem !important;
      }

      .modalTitle {
        font-size: 1.125rem !important;
      }
    }

    /* Small mobile devices */
    @media (max-width: 375px) {
      .demo-main {
        padding: 0.75rem !important;
        padding-top: 3.5rem !important;
      }

      .config-panel,
      .preview-panel {
        padding: 1rem !important;
      }

      .demo-header h1 {
        font-size: 1.125rem !important;
      }

      button {
        font-size: 0.8125rem !important;
        padding: 0.75rem !important;
      }

      input,
      textarea,
      select {
        font-size: 0.8125rem !important;
        padding: 0.625rem 0.875rem !important;
      }

      .mockContent {
        min-height: 400px !important;
      }

      .signupCard {
        padding: 1rem !important;
      }

      .infoBox {
        padding: 0.875rem !important;
      }
    }

    /* Landscape mobile - optimize for horizontal space */
    @media (max-height: 600px) and (orientation: landscape) {
      .demo-main {
        padding-top: 3rem !important;
      }

      .signup-modal {
        max-height: 85vh !important;
      }

      .placeholder {
        min-height: 300px !important;
      }

      .mockContent {
        min-height: 400px !important;
      }
    }
  `;
  if (!document.getElementById('public-demo-animations')) {
    style.id = 'public-demo-animations';
    document.head.appendChild(style);
  }
}