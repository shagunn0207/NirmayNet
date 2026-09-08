import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../types';

// SVG Icons
const HeartPulseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const MicIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const EyeIcon = ({ show }: { show: boolean }) => show ? (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const WifiOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
    <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
    <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
    <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);

export const LoginScreen: React.FC = () => {
  const { t, language, setLanguage, login, networkStatus } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const ok = login(username, password);
    setLoading(false);
    if (!ok) {
      setError(t.loginErrorMsg);
    }
  };

  const isOnline = networkStatus !== 'offline';

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      {/* App branding header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
        padding: '36px 24px 28px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        boxShadow: '0 8px 24px rgba(15, 118, 110, 0.25)',
      }}>
        <div style={{
          width: 60, height: 60,
          background: '#ffffff',
          borderRadius: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.12)',
        }}>
          <HeartPulseIcon />
        </div>
        <h1 style={{
          margin: 0,
          fontSize: 28,
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.3px',
        }}>NiramayNet</h1>
        <p style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,0.92)', fontWeight: 600 }}>
          {t.loginTagline}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
          {t.loginSupporting}
        </p>
      </div>

      {/* Login card */}
      <div style={{ flex: 1, padding: '24px 18px', overflowY: 'auto' }}>
        <div style={{
          background: '#ffffff',
          border: '1px solid #E2E8F0',
          borderRadius: 20,
          padding: '24px 20px',
          boxShadow: '0 4px 20px -2px rgba(15, 23, 42, 0.06)',
        }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Username field */}
            <div>
              <label className="form-label">{t.usernameLabel}</label>
              <div className="form-input-with-icon">
                <input
                  type="text"
                  className={`form-input${error ? ' error' : ''}`}
                  placeholder={t.usernamePlaceholder}
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  autoCapitalize="none"
                  autoCorrect="off"
                  required
                />
                <button
                  type="button"
                  className="form-input-icon"
                  title="Voice input"
                  onClick={() => setUsername('ASHA_NAND_023')}
                >
                  <MicIcon />
                </button>
              </div>
            </div>

            {/* Password field */}
            <div>
              <label className="form-label">{t.passwordLabel}</label>
              <div className="form-input-with-icon" style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input${error ? ' error' : ''}`}
                  placeholder={t.passwordPlaceholder}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  required
                  style={{ paddingLeft: 46 }}
                />
                <span style={{
                  position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                  color: '#94A3B8', pointerEvents: 'none',
                }}>
                  <LockIcon />
                </span>
                <button
                  type="button"
                  className="form-input-icon"
                  onClick={() => setShowPassword(s => !s)}
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                padding: '12px 16px',
                background: '#FEF2F2',
                border: '1px solid #FCA5A5',
                borderRadius: 12,
                color: '#991B1B',
                fontSize: 14,
                fontWeight: 600,
              }}>
                {error}
              </div>
            )}

            {/* Forgot password */}
            <div style={{ textAlign: 'right', marginTop: -6 }}>
              <button type="button" style={{
                background: 'none', border: 'none', padding: 4,
                color: '#0F766E', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>
                {t.forgotPassword}
              </button>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}
            >
              {loading ? t.loggingIn : t.loginButton}
            </button>

            {/* Offline login note */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 14px',
              background: '#F8FAFC',
              borderRadius: 12,
              border: '1px solid #E2E8F0',
            }}>
              <span style={{ color: isOnline ? '#16A34A' : '#DC2626' }}>
                {isOnline ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
                ) : <WifiOffIcon />}
              </span>
              <span style={{ fontSize: 13, color: '#475569', flex: 1, fontWeight: 500 }}>
                {t.offlineLoginNote}
              </span>
            </div>
          </form>
        </div>

        {/* Demo hint */}
        <div style={{
          marginTop: 16,
          padding: '12px 16px',
          background: '#F0FDFA',
          border: '1px solid #CCFBF1',
          borderRadius: 14,
          fontSize: 13,
          color: '#0F766E',
        }}>
          <span style={{ fontWeight: 800 }}>Demo Login: </span>
          ID: <code style={{ background: '#E6FFFA', padding: '2px 6px', borderRadius: 4 }}>ASHA_NAND_023</code> · Pass: <code style={{ background: '#E6FFFA', padding: '2px 6px', borderRadius: 4 }}>asha2024</code>
        </div>

        {/* Language selector */}
        <div style={{
          marginTop: 24,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{ fontSize: 13, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t.selectLanguage}</span>
          <div style={{ display: 'flex', gap: 10 }}>
            {(['mr', 'hi', 'en'] as Language[]).map(lang => (
              <button
                key={lang}
                type="button"
                className={`lang-btn${language === lang ? ' active' : ''}`}
                onClick={() => setLanguage(lang)}
              >
                {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : 'English'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 32 }} />
      </div>
    </div>
  );
};
