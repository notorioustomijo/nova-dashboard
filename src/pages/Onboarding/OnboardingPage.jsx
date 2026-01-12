import { useState } from 'react';
import { onboardBusiness } from '../../utils/api';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import styles from './Onboarding.module.css';

export default function OnboardingPage({ onComplete }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Form data
  const [agentName, setAgentName] = useState('Nova');
  const [businessDescription, setBusinessDescription] = useState('');
  const [personalityType, setPersonalityType] = useState('friendly');

  // RAG useState
  const [ragUrls, setRagUrls] = useState(['', '', '', '', '']);
  const [skipRag, setSkipRag] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:7700'}/extract-business-info`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) throw new Error('Failed to process document');

      const data = await response.json();
      setBusinessDescription(data.extracted_text || '');
    } catch (err) {
      setError('Failed to process document. Please type manually.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (step === 1) {
      // Validate business description
      if (!businessDescription.trim() || businessDescription.length < 50) {
        setError('Please provide at least 50 characters describing your business');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      // Validate agent name is not empty
      if (!agentName.trim()) {
        setError('Please provide an agent name');
        return;
      }
      
      // Submit onboarding
      try {
        setLoading(true);
        setError('');

        await onboardBusiness({
          agent_name: agentName.trim(),
          business_description: businessDescription,
          personality_type: personalityType
        });

        // Complete onboarding
        onComplete();
      } catch (err) {
        setError(err.message || 'Failed to complete setup');
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingCard}>
          <LoadingSpinner message="Setting up Nova for your business..." />
          <p className={styles.loadingText}>This will only take a moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Progress indicator */}
        <div className={styles.progress}>
          <div className={`${styles.progressStep} ${step >= 1 ? styles.progressStepActive : ''}`}>
            <div className={styles.progressNumber}>1</div>
            <span>Business Info</span>
          </div>
          <div className={styles.progressLine} />
          <div className={`${styles.progressStep} ${step >= 2 ? styles.progressStepActive : ''}`}>
            <div className={styles.progressNumber}>2</div>
            <span>Personality</span>
          </div>
        </div>

        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>
            {step === 1 ? "Let's set up Nova for your business" : 'Choose a personality'}
          </h1>
          <p className={styles.subtitle}>
            {step === 1 
              ? 'Tell us about your business so Nova can assist your customers effectively'
              : 'How should Nova communicate with your customers?'}
          </p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        {/* Step 1: Business Description */}
        {step === 1 && (
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Business Description</label>
              <textarea
                value={businessDescription}
                onChange={(e) => setBusinessDescription(e.target.value)}
                placeholder="Describe your business, products/services, pricing, delivery, policies, FAQs..."
                rows={8}
                className={styles.textarea}
              />
              <p className={styles.hint}>
                Include details like: What you sell, pricing ranges, delivery times, common questions, etc.
                <br />
                <strong>Minimum 50 characters</strong> ({businessDescription.length}/50)
              </p>
            </div>

            <div className={styles.divider}>
              <span>OR</span>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Upload Business Document (Optional)</label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className={styles.fileInput}
              />
              <p className={styles.hint}>
                Upload a PDF or Word document with your business details. We'll extract the information for you.
              </p>
              {uploading && <p className={styles.uploadingText}>📄 Processing document...</p>}
            </div>

            <button
              onClick={handleSubmit}
              disabled={businessDescription.length < 50 || uploading}
              className={`${styles.button} ${(businessDescription.length < 50 || uploading) ? styles.buttonDisabled : ''}`}
            >
              Continue →
            </button>
          </div>
        )}

        {/* Step 2: KnowledgeBase Step */}
        {step === 2 && (
          <div className={styles.form}>
            <h2>KnowledgeBase (Optional)</h2>
            <p>Provide links to your FAQ, documentation, or website</p>

            {ragUrls.map((url, index) => (
              <input 
                key={index}
                value={url}
                onChange={(e) => {
                  const newUrls = [...ragUrls];
                  newUrls[index] = e.target.value;
                  setRagUrls(newUrls);
                }}
                placeholder={`URL ${index + 1}`}
              />
            ))}

            <button onClick={() => setSkipRag(true)}>Skip</button>
            <button onClick={() => setStep(3)}>Continue</button>
          </div>
        )}

        {/* Step 3: Personality & Agent Name */}
        {step === 3 && (
          <div className={styles.form}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Agent Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                value={agentName}
                onChange={(e) => setAgentName(e.target.value)}
                placeholder="Nova"
                className={styles.input}
                required
              />
              <p className={styles.hint}>
                This is what customers will see when chatting.
              </p>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Personality Type</label>
              <div className={styles.personalityGrid}>
                <label className={`${styles.personalityCard} ${personalityType === 'friendly' ? styles.personalityCardActive : ''}`}>
                  <input
                    type="radio"
                    name="personality"
                    value="friendly"
                    checked={personalityType === 'friendly'}
                    onChange={(e) => setPersonalityType(e.target.value)}
                    className={styles.radio}
                  />
                  <div className={styles.personalityIcon}>😊</div>
                  <h3 className={styles.personalityTitle}>Friendly</h3>
                  <p className={styles.personalityDescription}>
                    Warm, conversational, and approachable. Uses casual language and emojis.
                  </p>
                  <div className={styles.personalityExample}>
                    "Hey there! 👋 I'd love to help you with that!"
                  </div>
                </label>

                <label className={`${styles.personalityCard} ${personalityType === 'professional' ? styles.personalityCardActive : ''}`}>
                  <input
                    type="radio"
                    name="personality"
                    value="professional"
                    checked={personalityType === 'professional'}
                    onChange={(e) => setPersonalityType(e.target.value)}
                    className={styles.radio}
                  />
                  <div className={styles.personalityIcon}>💼</div>
                  <h3 className={styles.personalityTitle}>Professional</h3>
                  <p className={styles.personalityDescription}>
                    Polished, efficient, and respectful. Maintains professional distance.
                  </p>
                  <div className={styles.personalityExample}>
                    "Good day. I would be pleased to assist you with that inquiry."
                  </div>
                </label>

                <label className={`${styles.personalityCard} ${personalityType === 'luxury' ? styles.personalityCardActive : ''}`}>
                  <input
                    type="radio"
                    name="personality"
                    value="luxury"
                    checked={personalityType === 'luxury'}
                    onChange={(e) => setPersonalityType(e.target.value)}
                    className={styles.radio}
                  />
                  <div className={styles.personalityIcon}>✨</div>
                  <h3 className={styles.personalityTitle}>Luxury</h3>
                  <p className={styles.personalityDescription}>
                    Elegant, refined, and exclusive. Emphasizes premium experiences.
                  </p>
                  <div className={styles.personalityExample}>
                    "It would be our privilege to craft an exceptional experience for you."
                  </div>
                </label>
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <button
                onClick={() => setStep(1)}
                className={styles.buttonSecondary}
              >
                ← Back
              </button>
              <button
                onClick={handleSubmit}
                className={styles.button}
              >
                Complete Setup →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}