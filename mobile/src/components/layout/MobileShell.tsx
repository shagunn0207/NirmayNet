import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import type { Language } from '../../types';

// Icons
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#0F766E' : '#64748B'} strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const PeopleIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#0F766E' : '#64748B'} strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ClipboardIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#0F766E' : '#64748B'} strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const BookIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#0F766E' : '#64748B'} strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

const UserIcon = ({ active }: { active: boolean }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#0F766E' : '#64748B'} strokeWidth={active ? "2.5" : "2"} strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const NAV_ITEMS = [
  { key: 'home',     labelKey: 'home' as const,     Icon: HomeIcon },
  { key: 'patients', labelKey: 'patients' as const,  Icon: PeopleIcon },
  { key: 'followups',labelKey: 'followups' as const, Icon: ClipboardIcon },
  { key: 'guide',    labelKey: 'more' as const,      Icon: BookIcon },
  { key: 'profile',  labelKey: 'profile' as const,   Icon: UserIcon },
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
  const { t, language, setLanguage, activeTab, setActiveTab, setActiveScreen, networkStatus, snackbar } = useApp();
  const [showLangMenu, setShowLangMenu] = useState(false);

  const handleNav = (key: string) => {
    setActiveTab(key);
    if (key === 'home') setActiveScreen('home');
    else if (key === 'patients') setActiveScreen('patients');
    else if (key === 'followups') setActiveScreen('followups');
    else if (key === 'guide') setActiveScreen('guide');
    else if (key === 'profile') setActiveScreen('profile');
  };

  const getLangLabel = (l: Language) => {
    if (l === 'mr') return 'मराठी';
    if (l === 'hi') return 'हिंदी';
    return 'English';
  };

  return (
    <div className="app-shell">
      {/* App bar */}
      <div className="app-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          {showBack && (
            <button
              type="button"
              className="btn-icon"
              onClick={onBack}
              title="Go back"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
        </div>

        {/* Header Actions: Language Switcher + Network Status Pill + Profile Shortcut */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Language selector button */}
          <button
            type="button"
            className="network-pill"
            onClick={() => setShowLangMenu(m => !m)}
            style={{ cursor: 'pointer', background: 'rgba(255, 255, 255, 0.22)', border: '1px solid rgba(255, 255, 255, 0.35)' }}
            title="Change Language"
          >
            <GlobeIcon />
            <span>{getLangLabel(language)}</span>
          </button>

          {/* Network status pill */}
          <div className="network-pill">
            <div className="sync-dot" style={{
              background: networkStatus === 'synced' ? '#34D399' : networkStatus === 'syncing' ? '#FBBF24' : networkStatus === 'offline' ? '#F87171' : '#FBBF24',
              boxShadow: networkStatus === 'synced' ? '0 0 6px #34D399' : 'none'
            }} />
            <span>
              {networkStatus === 'offline' ? t.statusOffline : networkStatus === 'syncing' ? t.statusSyncing : 'Online'}
            </span>
          </div>

          {/* Profile Shortcut Icon */}
          <button
            type="button"
            onClick={() => handleNav('profile')}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.25)',
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 16, flexShrink: 0,
            }}
            title="View Profile"
          >
            👩‍⚕️
          </button>
        </div>
      </div>

      {/* Language Popup Menu */}
      {showLangMenu && (
        <div style={{
          position: 'absolute', top: 68, right: 16, zIndex: 300,
          background: '#FFFFFF', borderRadius: 16, padding: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.25)', border: '1px solid #E2E8F0',
          display: 'flex', flexDirection: 'column', gap: 6, width: 160,
          animation: 'slideUp 0.15s ease',
        }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#64748B', textTransform: 'uppercase', padding: '2px 8px' }}>
            {t.selectLanguage}
          </div>
          {(['mr', 'hi', 'en'] as Language[]).map(lang => (
            <button
              key={lang}
              type="button"
              onClick={() => {
                setLanguage(lang);
                setShowLangMenu(false);
              }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 12px', borderRadius: 10, border: 'none',
                background: language === lang ? '#F0FDFA' : 'transparent',
                color: language === lang ? '#0F766E' : '#0F172A',
                fontWeight: language === lang ? 800 : 600,
                fontSize: 14, cursor: 'pointer', textAlign: 'left',
              }}
            >
              <span>{lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : 'English'}</span>
              {language === lang && <span style={{ color: '#0F766E', fontWeight: 800 }}>✓</span>}
            </button>
          ))}
        </div>
      )}

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
