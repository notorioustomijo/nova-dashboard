import { useState, useEffect } from 'react';

export default function QuickSetupGuide({ onNavigate }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('nova_setup_completed');
    if (completed) {
      setIsCompleted(true);
      setIsExpanded(false);
    }
  }, []);

  const steps = [
    {
      id: 'get-code',
      title: 'Get Widget Code',
      description: 'Go to Settings to access your unique embed code',
      action: () => onNavigate('settings'),
      buttonText: 'Go to Settings',
      icon: '🚀'
    },
    {
      id: 'copy-code',
      title: 'Copy the Code',
      description: 'Copy the widget code to your clipboard',
      icon: '📋'
    },
    {
      id: 'add-to-site',
      title: 'Add to Website',
      description: 'Paste before closing </body> tag',
      icon: '🌐'
    },
    {
      id: 'test',
      title: 'Test Widget',
      description: 'Visit your site and test the chat',
      icon: '✅'
    }
  ];

  const handleComplete = () => {
    localStorage.setItem('nova_setup_completed', 'true');
    setIsCompleted(true);
    setIsExpanded(false);
  };

  const handleReset = () => {
    localStorage.removeItem('nova_setup_completed');
    setIsCompleted(false);
    setIsExpanded(true);
  };

  if (isCompleted && !isExpanded) {
    return (
      <div style={styles.completedBanner}>
        <div style={styles.completedContent}>
          <span style={styles.completedIcon}>✅</span>
          <span style={styles.completedText}>Setup Complete!</span>
        </div>
        <button onClick={handleReset} style={styles.resetButton}>
          Show Setup Guide
        </button>
      </div>
    );
  }

  if (!isExpanded) {
    return (
      <div style={styles.collapsedBanner} onClick={() => setIsExpanded(true)}>
        <span>📖 Quick Setup Guide</span>
        <span style={styles.expandIcon}>▼</span>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h3 style={styles.title}>🎉 Welcome to Nova!</h3>
          <p style={styles.subtitle}>Get your AI assistant live in 4 simple steps</p>
        </div>
        <div style={styles.headerActions}>
          <button onClick={handleComplete} style={styles.completeButton}>
            Mark as Complete
          </button>
          <button onClick={() => setIsExpanded(false)} style={styles.collapseButton}>
            ✕
          </button>
        </div>
      </div>

      <div style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <div key={step.id} style={styles.stepCard}>
            <div style={styles.stepIcon}>{step.icon}</div>
            <h4 style={styles.stepTitle}>{step.title}</h4>
            <p style={styles.stepDescription}>{step.description}</p>
            {step.action && (
              <button onClick={step.action} style={styles.stepButton}>
                {step.buttonText}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    padding: '2rem',
    marginBottom: '2rem',
    color: 'white',
    boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1.5rem',
    gap: '1rem'
  },
  headerContent: {
    flex: 1
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    margin: '0 0 0.5rem 0'
  },
  subtitle: {
    fontSize: '0.875rem',
    opacity: 0.9,
    margin: 0
  },
  headerActions: {
    display: 'flex',
    gap: '0.5rem'
  },
  completeButton: {
    background: 'rgba(255, 255, 255, 0.3)',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.8125rem',
    fontWeight: '600',
    transition: 'background 0.2s',
    whiteSpace: 'nowrap'
  },
  collapseButton: {
    background: 'rgba(255, 255, 255, 0.2)',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    color: 'white',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'background 0.2s'
  },
  stepsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem'
  },
  stepCard: {
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '8px',
    padding: '1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    transition: 'all 0.3s',
    border: '2px solid transparent'
  },
  stepIcon: {
    fontSize: '2rem',
    marginBottom: '0.75rem'
  },
  stepTitle: {
    fontSize: '0.9375rem',
    fontWeight: '600',
    marginBottom: '0.5rem',
    margin: '0 0 0.5rem 0'
  },
  stepDescription: {
    fontSize: '0.8125rem',
    opacity: 0.9,
    lineHeight: '1.5',
    marginBottom: '0.75rem',
    margin: '0 0 0.75rem 0',
    minHeight: '2.5rem'
  },
  stepButton: {
    background: 'white',
    color: '#667eea',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    fontSize: '0.8125rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    marginTop: 'auto'
  },
  completedBanner: {
    background: '#d1fae5',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    marginBottom: '2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    border: '2px solid #10b981'
  },
  completedContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  completedIcon: {
    fontSize: '1.5rem'
  },
  completedText: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#065f46'
  },
  resetButton: {
    background: 'transparent',
    color: '#059669',
    border: '2px solid #059669',
    borderRadius: '6px',
    padding: '0.5rem 1rem',
    fontSize: '0.875rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s'
  },
  collapsedBanner: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '12px',
    padding: '1rem 1.5rem',
    marginBottom: '2rem',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    fontSize: '1rem',
    fontWeight: '600'
  },
  expandIcon: {
    fontSize: '0.875rem'
  }
};

// Add responsive styles
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 968px) {
      [style*="gridTemplateColumns: repeat(4, 1fr)"] {
        grid-template-columns: repeat(2, 1fr) !important;
      }
    }

    @media (max-width: 640px) {
      [style*="gridTemplateColumns: repeat(4, 1fr)"],
      [style*="grid-template-columns: repeat(2, 1fr)"] {
        grid-template-columns: 1fr !important;
      }
    }
  `;
  if (!document.getElementById('quick-setup-responsive')) {
    style.id = 'quick-setup-responsive';
    document.head.appendChild(style);
  }
}