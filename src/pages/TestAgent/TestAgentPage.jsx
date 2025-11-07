import { useState, useEffect, useRef } from 'react';

export default function TestAgentPage() {
  const [loading, setLoading] = useState(true);
  const [agentName, setAgentName] = useState('Nova');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [personalityType, setPersonalityType] = useState('friendly');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('nova_token');
      const API_URL = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${API_URL}/business-profile`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (response.ok) {
        const data = await response.json();
        const profile = data.profile;
        
        if (profile) {
          setAgentName(profile.agent_name || 'Nova');
          setBusinessName(profile.business_name || '');
          setBusinessDescription(profile.business_description || '');
          setPersonalityType(profile.personality_type || 'friendly');
        }
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetTestConfig = async () => {
    setPreviewLoading(true);
    try {
      const token = localStorage.getItem('nova_token');
      const API_URL = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${API_URL}/set-test-config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          agent_name: agentName,
          business_name: businessName,
          business_description: businessDescription,
          personality_type: personalityType
        })
      });

      if (!response.ok) throw new Error('Failed to set test config');
      
      setPreviewVisible(true);
      if (iframeRef.current) {
        iframeRef.current.src = `${import.meta.env.VITE_WIDGET_URL}?testMode=true`;
      }
      setToastMessage('🔄 Configuration Set! Preview is loading');
    } catch (error) {
      console.error('Test config error:', error);
      setToastMessage('❌ Failed to load preview');
    } finally {
      setPreviewLoading(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const handleSaveConfig = async () => {
    try {
      const token = localStorage.getItem('nova_token');
      const API_URL = import.meta.env.VITE_API_URL;
      
      const response = await fetch(`${API_URL}/business-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          agent_name: agentName,
          business_name: businessName,
          business_description: businessDescription,
          personality_type: personalityType
        })
      });

      if (!response.ok) throw new Error('Failed to save');
      
      setToastMessage('✅ Configuration saved!');
    } catch (error) {
      console.error('Save error:', error);
      setToastMessage('❌ Failed to save');
    } finally {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const API_URL = import.meta.env.VITE_API_URL;
      const response = await fetch(`${API_URL}/extract-business-info`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      setBusinessDescription(data.extracted_text);
      setToastMessage('✅ Document uploaded successfully');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (error) {
      console.error('Upload failed:', error);
      setToastMessage('❌ Upload failed');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading test environment...</p>
      </div>
    );
  }

  return (
    <div style={styles.page} className="test-agent-page">
      <title>Test Agent - Nova</title>
      <meta name="description" content="Test your Nova AI chat agent's responses and configurations in a simulated environment." />
      {/* Toast */}
      {showToast && (
        <div style={styles.toast} className="toast">
          {toastMessage}
        </div>
      )}

      <div style={styles.header} className="page-header">
        <h1 style={styles.pageTitle}>🧪 Test Your Agent</h1>
        <p style={styles.pageDescription}>
          Preview how your AI support agent will interact with your customers
        </p>
      </div>

      <div style={styles.container} className="test-container">
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
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Business Name</label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="Luxury Cakes Lagos"
              style={styles.input}
            />
          </div>

          <div style={styles.formDocContainer}>
            <div style={styles.formGroup2}>
              <label style={styles.label}>Business Description</label>
              <textarea
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="Describe your business..."
                rows={6}
                style={styles.textarea}
              />
            </div>
            <div style={styles.formGroup2}>
              <label style={styles.label}>Or Upload Document</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                style={styles.fileInput}
              />
              <p style={styles.hint}>Upload a PDF, Word doc, or text file</p>
            </div>
            <p style={styles.hint}>
              This is what your agent knows about your business
            </p>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Personality</label>
            <select
              value={personalityType}
              onChange={(e) => setPersonalityType(e.target.value)}
              style={styles.select}
            >
              <option value="friendly">Friendly - Warm & casual</option>
              <option value="professional">Professional - Formal & polished</option>
              <option value="luxury">Luxury - Elegant & refined</option>
            </select>
          </div>

          <button onClick={handleSetTestConfig} style={styles.testButton}>
            🎬 Start Test
          </button>

          <button onClick={handleSaveConfig} style={{...styles.testButton, background: '#10b981'}}>
            💾 Save Settings to Live Agent
          </button>

          <div style={styles.infoBox}>
            <p style={styles.infoTitle}>💡 Testing Tips</p>
            <ul style={styles.infoList}>
              <li>Try asking about your products</li>
              <li>Test lead capture by sharing contact info</li>
              <li>Check response quality and tone</li>
              <li>Verify pricing and policy information</li>
            </ul>
          </div>
        </div>

        {/* Preview Panel */}
        <div style={styles.previewPanel} className="preview-panel">
          <div style={styles.previewHeader}>
            <span style={styles.previewTitle}>Live Preview</span>
            <span style={styles.previewBadge}>Widget Demo</span>
          </div>

          {previewVisible ? (
            previewLoading ? (
              <div style={{...styles.loadingContainer, minHeight: '600px'}}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Loading preview...</p>
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
                    <span style={styles.lockIcon}>🔒</span>
                    <span className="browser-url-text">yourwebsite.com</span>
                  </div>
                  <div style={styles.browserDots}></div>
                </div>

                <div style={styles.mockContent}>
                  <div style={styles.mockSection}>
                    <div style={styles.mockHeader}></div>
                    <div style={styles.mockText}></div>
                    <div style={{...styles.mockText, width: '60%'}}></div>
                    <div style={styles.mockButton}></div>
                  </div>

                  <iframe
                    ref={iframeRef}
                    src={`${import.meta.env.VITE_WIDGET_URL}?testMode=true`}
                    style={styles.widgetIframe}
                    title="Nova Widget Preview"
                  />
                </div>
              </div>
            )
          ) : (
            <div style={{...styles.placeholder, minHeight: '600px'}} className="placeholder">
              <h3 style={styles.placeholderTitle}>Confirm Your Agent Configuration</h3>
              <p style={styles.placeholderText}>
                Adjust settings on the left and click "Start Test" to test your agent
              </p>
            </div>
          )}

          <div style={styles.previewFooter}>
            <p style={styles.footerText}>
              ℹ️ This is how the widget will appear on your website. Test changes are temporary—save to apply live.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    maxWidth: '1400px',
    margin: '0 auto',
    position: 'relative'
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
    animation: 'slideIn 0.3s ease-out',
    fontWeight: '600'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '400px',
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
    marginBottom: '2rem'
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
  formDocContainer: {
    display: "flex",
    flexDirection: "column",
    gap: '0.5rem',
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  formGroup2: {
    marginBottom: '0rem'
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
    transition: 'all 0.2s',
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
  fileInput: {
    width: '100%',
    padding: '0.5rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  hint: {
    fontSize: '0.75rem',
    color: '#9ca3af',
    marginTop: '0.5rem',
    margin: '0.5rem 0 0 0'
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
    transition: 'transform 0.2s',
    marginBottom: '1rem'
  },
  infoBox: {
    background: '#f9fafb',
    borderRadius: '8px',
    padding: '1rem',
    border: '1px solid #e5e7eb',
    marginTop: '0.5rem'
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
  lockIcon: {
    fontSize: '0.75rem',
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
  mockButton: {
    height: '40px',
    width: '120px',
    background: '#d1d5db',
    borderRadius: '8px',
    marginTop: '1.5rem'
  },
  widgetIframe: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '100%',
    height: '100%',
    border: 'none',
    pointerEvents: 'all'
  },
  previewFooter: {
    marginTop: '1rem',
    padding: '1rem',
    background: '#f9fafb',
    borderRadius: '8px',
    textAlign: 'center'
  },
  footerText: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
    lineHeight: '1.5'
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
    padding: '2rem'
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
    maxWidth: '80%'
  }
};

// Add CSS animations and responsive styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    /* Tablet - Stack vertically, adjust spacing */
    @media (max-width: 968px) {
      .test-container {
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

      .page-header h1 {
        font-size: 1.5rem !important;
      }
    }

    /* Mobile - Full mobile optimization */
    @media (max-width: 640px) {
      .test-agent-page {
        padding: 0 !important;
      }

      .page-header {
        margin-bottom: 1rem !important;
      }

      .page-header h1 {
        font-size: 1.25rem !important;
      }

      .page-header p {
        font-size: 0.875rem !important;
      }

      .test-container {
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

      .browser-bar {
        padding: 0.5rem !important;
      }

      .browser-dots {
        min-width: 40px !important;
      }

      .browser-url-text {
        display: none;
      }

      .dot {
        width: 8px !important;
        height: 8px !important;
      }

      .mock-content {
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

      .toast {
        top: 1rem !important;
        right: 1rem !important;
        left: 1rem !important;
        padding: 0.875rem 1rem !important;
        font-size: 0.8125rem !important;
      }

      .preview-header {
        flex-direction: column;
        align-items: flex-start !important;
      }
    }

    /* Small mobile devices */
    @media (max-width: 375px) {
      .config-panel,
      .preview-panel {
        padding: 1rem !important;
      }

      .page-header h1 {
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

      .mock-content {
        min-height: 400px !important;
      }
    }
  `;
  if (!document.getElementById('test-agent-animations')) {
    style.id = 'test-agent-animations';
    document.head.appendChild(style);
  }
}