import { useState, useEffect, useRef } from 'react';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import { fetchBusinessProfile, updateBusinessProfile, generateWidgetCode } from '../../utils/api';
import styles from './Settings.module.css';

export default function SettingsPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showCopiedTooltip, setShowCopiedTooltip] = useState(false);
  
  const [agentName, setAgentName] = useState('Nova');
  const [businessName, setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [personalityType, setPersonalityType] = useState('friendly');
  const [widgetCode, setWidgetCode] = useState('');

  const [originalValues, setOriginalValues] = useState({});
  const copyButtonRef = useRef(null);

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (originalValues.agentName) {
      const changed = 
        agentName !== originalValues.agentName ||
        businessName !== originalValues.businessName ||
        businessDescription !== originalValues.businessDescription ||
        personalityType !== originalValues.personalityType;
      setHasChanges(changed);
    }
  }, [agentName, businessName, businessDescription, personalityType, originalValues]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchBusinessProfile();
      
      if (data) {
        setProfile(data);
        const values = {
          agentName: data.agent_name || 'Nova',
          businessName: data.business_name || '',
          businessDescription: data.business_description || '',
          personalityType: data.personality_type || 'friendly'
        };
        
        setAgentName(values.agentName);
        setBusinessName(values.businessName);
        setBusinessDescription(values.businessDescription);
        setPersonalityType(values.personalityType);
        setOriginalValues(values);
        
        const code = await generateWidgetCode(data.user_id);
        setWidgetCode(code);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateBusinessProfile({
        agent_name: agentName,
        business_name: businessName,
        business_description: businessDescription,
        personality_type: personalityType
      });

      setOriginalValues({
        agentName,
        businessName,
        businessDescription,
        personalityType
      });
      
      setHasChanges(false);
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 3000);
      
      const userData = JSON.parse(localStorage.getItem('nova_user') || '{}');
      userData.business_name = businessName;
      localStorage.setItem('nova_user', JSON.stringify(userData));
    } catch (error) {
      alert('Failed to save changes: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const copyWidgetCode = () => {
    navigator.clipboard.writeText(widgetCode);
    setShowCopiedTooltip(true);
    setTimeout(() => setShowCopiedTooltip(false), 2000);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <LoadingSpinner message="Loading settings..." />
      </div>
    );
  }

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
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className={styles.page}>
      <title>Settings - Nova</title>
      <meta name="description" content="Customize your Nova profile, including business info, AI personality, and widget integration settings." />
      {/* Save toast */}
      {showSaveToast && (
        <div className={styles.toast}>
          ✅ Changes saved successfully!
        </div>
      )}

      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageDescription}>
            Manage your business profile and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className={`${styles.saveBtn} ${(!hasChanges || saving) ? styles.saveBtnDisabled : ''}`}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Widget Section */}
      <div className={styles.widgetSection}>
        <h2 className={styles.sectionTitle}>🚀 Your Widget Code</h2>
        <p className={styles.widgetDescription}>
          Copy this code and paste it before the closing <code>&lt;/body&gt;</code> tag on your website
        </p>
        
        <div className={styles.codeEditor}>
          <div className={styles.codeHeader}>
            <span className={styles.codeLanguage}>HTML</span>
            <div style={{ position: 'relative' }}>
              <button 
                ref={copyButtonRef}
                onClick={copyWidgetCode} 
                className={styles.copyBtn}
              >
                📋 Copy Code
              </button>
              {/* Tooltip */}
              {showCopiedTooltip && (
                <div className={styles.copiedTooltip}>
                  Copied!
                </div>
              )}
            </div>
          </div>
          <pre className={styles.codeBlock}>
            <code>{widgetCode}</code>
          </pre>
        </div>
      </div>

      {/* Rest of the form */}
      <div className={styles.card}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Business Information</h2>

          <div className={styles.formGroup}>
            <label className={styles.label}>Agent Name</label>
            <input
              type="text"
              value={agentName}
              onChange={(e) => setAgentName(e.target.value)}
              placeholder="Nova"
              className={styles.input}
            />
            <p className={styles.hint}>
              The name customers will see when chatting. Default is "Nova".
            </p>
          </div>
          
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
          <div className={styles.formDocContainer}>
            <div className={styles.formGroup2}>
              <label className={styles.label}>Business Description</label>
              <textarea
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="Describe your business, products, pricing, etc..."
                rows={6}
                className={styles.textarea}
              />
            </div>
            <div className={styles.formGroup2}>
              <label className={styles.label}>Or Upload Document</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className={styles.fileInput}
              />
              <p className={styles.hint}>Upload a PDF, Word doc, or text file</p>
            </div>
            <p className={styles.hint}>
              This information helps {agentName} provide accurate responses to customers.
              Include details about your products, services, pricing, and policies.
            </p>
          </div>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>AI Personality</h2>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Conversation Style</label>
            <select
              value={personalityType}
              onChange={(e) => setPersonalityType(e.target.value)}
              className={styles.select}
            >
              <option value="friendly">Friendly - Warm, casual, approachable</option>
              <option value="professional">Professional - Formal, polished, efficient</option>
              <option value="luxury">Luxury - Elegant, refined, exclusive</option>
            </select>
            <p className={styles.hint}>
              Choose how {agentName} should communicate with your customers.
            </p>
          </div>

          <div className={styles.personalityPreview}>
            <div className={styles.previewLabel}>Preview:</div>
            <div className={styles.previewText}>
              {personalityType === 'friendly' && (
                `Hey there! 👋 Thanks for reaching out! I'd love to help you with that.`
              )}
              {personalityType === 'professional' && (
                `Good day. Thank you for your inquiry. I would be pleased to assist you.`
              )}
              {personalityType === 'luxury' && (
                `Welcome. It would be our privilege to serve you and craft an exceptional experience.`
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}