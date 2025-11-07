import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

export default function Sidebar({ activePage, onNavigate, isOpen, onClose }) {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'leads', label: 'Leads', icon: '📋' },
    { id: 'conversations', label: 'Conversations', icon: '💬' },
    { id: 'metrics', label: 'Metrics', icon: '📊' },
    { id: 'test-agent', label: 'Test Agent', icon: '🧪' }, // ADD THIS
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  const handleNavigate = (pageId) => {
    onNavigate(pageId);
    if (onClose) onClose(); // Close mobile menu after navigation
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} />
      )}

      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>👩🏾‍🦱 <span className={styles.logoText}>Nova</span></div>
          <div className={styles.businessName}>{user?.business_name || 'Your Business'}</div>
        </div>

        <nav className={styles.nav}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`${styles.navItem} ${activePage === item.id ? styles.navItemActive : ''}`}
              title={item.label}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <div className={styles.userAvatar}>
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userDetails}>
              <div className={styles.userEmail}>{user?.email}</div>
              <button onClick={logout} className={styles.logoutBtn}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}