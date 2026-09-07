import React from 'react';
import { useApp } from '../../context/AppContext';

// Icons
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'none' : 'none'} stroke={active ? '#1565C0' : '#9E9E9E'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const PeopleIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1565C0' : '#9E9E9E'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ClipboardIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1565C0' : '#9E9E9E'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const BookIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#1565C0' : '#9E9E9E'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const NAV_ITEMS = [
  { key: 'home',     labelKey: 'home' as const,     Icon: HomeIcon },
  { key: 'patients', labelKey: 'patients' as const,  Icon: PeopleIcon },
  { key: 'followups',labelKey: 'followups' as const, Icon: ClipboardIcon },
  { key: 'guide',    labelKey: 'more' as const,      Icon: BookIcon },
];

interface MobileShellProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showNav?: boolean;
}

export const MobileShell: React.FC<MobileShellProps> = ({
  children,
  title,
  subtitle,
  showBack,
  onBack,
  showNav = true,
}) => {
  const { t, activeTab, setActiveTab, setActiveScreen, networkStatus, snackbar } = useApp();

  const handleNav = (key: string) => {
    setActiveTab(key);
    if (key === 'home') setActiveScreen('home');
    else if (key === 'patients') setActiveScreen('patients');
    else if (key === 'followups') setActiveScreen('followups');
    else if (key === 'guide') setActiveScreen('guide');
  };

  return (
    <div className="app-shell">
      {/* App bar */}
      <div className="app-bar">
        {showBack && (
          <button
            type="button"
            className="btn-icon"
            style={{ color: '#fff', marginLeft: -8 }}
            onClick={onBack}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="app-bar-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {title}
          </div>
          {subtitle && <div className="app-bar-subtitle">{subtitle}</div>}
        </div>
        {/* Network status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <div className="sync-dot" style={{
            background: networkStatus === 'synced' ? '#81C784' : networkStatus === 'syncing' ? '#FFB74D' : networkStatus === 'offline' ? '#E57373' : '#FFB74D',
          }} />
          <span style={{ fontSize: 11, opacity: 0.85, fontWeight: 600 }}>
            {networkStatus === 'offline' ? 'Offline' : networkStatus === 'syncing' ? 'Syncing' : networkStatus === 'pending' ? 'Pending' : 'Online'}
          </span>
        </div>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {children}
      </div>

      {/* Bottom navigation */}
      {showNav && (
        <nav className="bottom-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              type="button"
              className={`bottom-nav-item${activeTab === item.key ? ' active' : ''}`}
              onClick={() => handleNav(item.key)}
            >
              <item.Icon active={activeTab === item.key} />
              <span>{t[item.labelKey]}</span>
            </button>
          ))}
        </nav>
      )}

      {/* Snackbar */}
      {snackbar && (
        <div className="snackbar">{snackbar}</div>
      )}
    </div>
  );
};
