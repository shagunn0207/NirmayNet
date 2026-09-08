import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Language } from '../types';

// SVG Icons
const HeartPulseIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0F766E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const PersonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EyeIcon = ({ show }: { show: boolean }) => show ? (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
) : (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const WifiOffIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="1" y1="1" x2="23" y2="23" />
    <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
  </svg>
);

export const LoginScreen: React.FC = () => {
  const { t, language, setLanguage, login, signup, networkStatus } = useApp();

  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Login fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Signup-extra fields
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const isOnline = networkStatus !== 'offline';

  const resetForm = () => {
    setUsername(''); setPassword(''); setFullName(''); setConfirmPassword('');
    setError(''); setShowPassword(false); setShowConfirm(false);
  };

  const switchMode = (newMode: 'login' | 'signup') => {
    resetForm();
    setMode(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (mode === 'signup') {
      if (!fullName.trim()) { setError('Please enter your full name'); return; }
      if (username.trim().length < 4) { setError('Username must be at least 4 characters'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
      if (password !== confirmPassword) { setError('Passwords do not match'); return; }
      setLoading(true);
      await new Promise(r => setTimeout(r, 600));
      const ok = signup(username.trim(), password, fullName.trim());
      setLoading(false);
      if (!ok) setError('This username is already taken. Please choose a different one.');
    } else {
      if (!username.trim() || !password) { setError('Please enter your username and password'); return; }
      setLoading(true);
      await new Promise(r => setTimeout(r, 800));
      const ok = login(username.trim(), password);
      setLoading(false);
      if (!ok) setError(t.loginErrorMsg);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      {/* Branding Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
        padding: '36px 24px 32px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
        boxShadow: '0 8px 24px rgba(15, 118, 110, 0.25)',
        flexShrink: 0,
      }}>
        <div style={{
          width: 64, height: 64, background: '#ffffff', borderRadius: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
        }}>
          <HeartPulseIcon />
        </div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.3px' }}>
          NiramayNet
        </h1>
        <p style={{ margin: 0, fontSize: 15, color: 'rgba(255,255,255,0.92)', fontWeight: 600 }}>
          {t.loginTagline}
        </p>
        <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.75)', textAlign: 'center' }}>
          {t.loginSupporting}
        </p>
      </div>

      {/* Scrollable Form Area */}
      <div style={{ flex: 1, padding: '20px 18px 32px', overflowY: 'auto' }}>

        {/* Mode Toggle Tabs */}
        <div style={{
          display: 'flex', background: '#F1F5F9', borderRadius: 14,
          padding: 4, marginBottom: 20, gap: 4,
        }}>
          {(['login', 'signup'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
              style={{
                flex: 1, padding: '10px 0', borderRadius: 10, border: 'none',
                background: mode === m ? '#FFFFFF' : 'transparent',
                color: mode === m ? '#0F766E' : '#64748B',
                fontWeight: mode === m ? 800 : 600, fontSize: 14,
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: mode === m ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {m === 'login' ? '🔑 Login' : '✨ Sign Up'}
            </button>
          ))}
        </div>

        {/* Form Card */}
        <div style={{
          background: '#ffffff', border: '1px solid #E2E8F0',
          borderRadius: 20, padding: '24px 20px',
          boxShadow: '0 4px 20px -2px rgba(15,23,42,0.06)',
        }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

            {/* Full Name — signup only */}
            {mode === 'signup' && (
              <div>
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                    <PersonIcon />
                  </span>
                  <input
                    type="text"
                    className={`form-input${error ? ' error' : ''}`}
                    placeholder="Your full name"
                    value={fullName}
                    onChange={e => { setFullName(e.target.value); setError(''); }}
                    style={{ paddingLeft: 42 }}
                    required
                  />
                </div>
              </div>
            )}

            {/* Username */}
            <div>
              <label className="form-label">{t.usernameLabel}</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                  <PersonIcon />
                </span>
                <input
                  type="text"
                  className={`form-input${error ? ' error' : ''}`}
                  placeholder={mode === 'signup' ? 'Choose a username (min 4 chars)' : t.usernamePlaceholder}
                  value={username}
                  onChange={e => { setUsername(e.target.value); setError(''); }}
                  autoCapitalize="none"
                  autoCorrect="off"
                  style={{ paddingLeft: 42 }}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="form-label">{t.passwordLabel}</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                  <LockIcon />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input${error ? ' error' : ''}`}
                  placeholder={mode === 'signup' ? 'Choose a password (min 6 chars)' : t.passwordPlaceholder}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  style={{ paddingLeft: 42, paddingRight: 46 }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  style={{
                    position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4,
                  }}
                >
                  <EyeIcon show={showPassword} />
                </button>
              </div>
            </div>

            {/* Confirm Password — signup only */}
            {mode === 'signup' && (
              <div>
                <label className="form-label">Confirm Password</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                    <LockIcon />
                  </span>
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    className={`form-input${error && confirmPassword !== password ? ' error' : ''}`}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                    style={{ paddingLeft: 42, paddingRight: 46 }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(s => !s)}
                    style={{
                      position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 4,
                    }}
                  >
                    <EyeIcon show={showConfirm} />
                  </button>
                </div>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div style={{
                padding: '12px 16px', background: '#FEF2F2',
                border: '1px solid #FCA5A5', borderRadius: 12,
                color: '#991B1B', fontSize: 14, fontWeight: 600,
              }}>
                ⚠️ {error}
              </div>
            )}

            {/* Forgot password — login only */}
            {mode === 'login' && (
              <div style={{ textAlign: 'right', marginTop: -6 }}>
                <button type="button" style={{
                  background: 'none', border: 'none', padding: 4,
                  color: '#0F766E', fontSize: 13, fontWeight: 700, cursor: 'pointer',
                }}>
                  {t.forgotPassword}
                </button>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ fontSize: 16, fontWeight: 700, marginTop: 4, minHeight: 52 }}
            >
              {loading
                ? (mode === 'login' ? t.loggingIn : 'Creating account…')
                : (mode === 'login' ? t.loginButton : '✨ Create Account')}
            </button>

            {/* Network status note */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', background: '#F8FAFC',
              borderRadius: 12, border: '1px solid #E2E8F0',
            }}>
              <span style={{ color: isOnline ? '#16A34A' : '#DC2626' }}>
                {isOnline ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6" /></svg>
                ) : <WifiOffIcon />}
              </span>
              <span style={{ fontSize: 13, color: '#475569', flex: 1, fontWeight: 500 }}>
                {t.offlineLoginNote}
              </span>
            </div>
          </form>
        </div>

        {/* Demo hint — login mode only */}
        {mode === 'login' && (
          <div style={{
            marginTop: 16, padding: '12px 16px',
            background: '#F0FDFA', border: '1px solid #CCFBF1',
            borderRadius: 14, fontSize: 13, color: '#0F766E',
          }}>
            <span style={{ fontWeight: 800 }}>Demo Login: </span>
            ID: <code style={{ background: '#E6FFFA', padding: '2px 6px', borderRadius: 4 }}>ASHA_NAND_023</code> · Pass: <code style={{ background: '#E6FFFA', padding: '2px 6px', borderRadius: 4 }}>asha2024</code>
          </div>
        )}

        {/* Signup note — login mode */}
        {mode === 'login' && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ fontSize: 14, color: '#64748B' }}>Don't have an account? </span>
            <button
              type="button"
              onClick={() => switchMode('signup')}
              style={{ background: 'none', border: 'none', color: '#0F766E', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Already have account — signup mode */}
        {mode === 'signup' && (
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span style={{ fontSize: 14, color: '#64748B' }}>Already have an account? </span>
            <button
              type="button"
              onClick={() => switchMode('login')}
              style={{ background: 'none', border: 'none', color: '#0F766E', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
            >
              Log In
            </button>
          </div>
        )}

        {/* Language selector */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: '#64748B', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {t.selectLanguage}
          </span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {(['mr', 'hi', 'en', 'kn'] as Language[]).map(lang => (
              <button
                key={lang}
                type="button"
                className={`lang-btn${language === lang ? ' active' : ''}`}
                onClick={() => setLanguage(lang)}
              >
                {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : lang === 'kn' ? 'ಕನ್ನಡ' : 'English'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 24 }} />
      </div>
    </div>
  );
};
