import React from 'react';
import { MapPin, Phone, Globe, LogOut, Award, ShieldCheck, Database, Users } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Language } from '../types';

export const ProfileScreen: React.FC = () => {
  const { t, language, setLanguage, logout, networkStatus, currentUser, updateUserAccount, showSnackbar } = useApp();

  const [isEditingName, setIsEditingName] = React.useState(false);
  const [nameInput, setNameInput] = React.useState(currentUser?.fullName || '');

  React.useEffect(() => {
    setNameInput(currentUser?.fullName || '');
  }, [currentUser?.fullName]);

  const handleSaveName = () => {
    if (nameInput.trim()) {
      updateUserAccount({ fullName: nameInput.trim() });
      showSnackbar(t.patientUpdatedSnackbar || 'Profile name updated');
      setIsEditingName(false);
    }
  };

  return (
    <div className="screen-body">
      {/* Profile Header Card */}
      <div style={{
        background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)',
        color: '#ffffff',
        padding: '24px 20px',
        borderRadius: 22,
        boxShadow: '0 8px 24px rgba(15, 118, 110, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flex: 1, minWidth: 0 }}>
          <div style={{
            width: 60, height: 60,
            borderRadius: '50%',
            background: '#ffffff',
            color: '#0F766E',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 30, fontWeight: 800,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
            flexShrink: 0,
          }}>
            👩‍⚕️
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#CCFBF1', textTransform: 'uppercase', letterSpacing: 0.8 }}>
              {currentUser?.role || t.ashaWorkerRole}
            </span>

            {isEditingName ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <input
                  type="text"
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  style={{
                    background: '#ffffff', color: '#0F172A',
                    border: 'none', borderRadius: 8,
                    padding: '4px 8px', fontSize: 15, fontWeight: 700,
                    width: '100%', outline: 'none',
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  style={{
                    background: '#16A34A', color: '#ffffff',
                    border: 'none', borderRadius: 8,
                    padding: '6px 12px', fontSize: 12, fontWeight: 800,
                    cursor: 'pointer', whiteSpace: 'nowrap',
                  }}
                >
                  {t.save}
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <h2 style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentUser?.fullName || t.ashaWorkerName}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.22)', border: 'none',
                    borderRadius: 6, color: '#ffffff', fontSize: 12,
                    padding: '2px 6px', cursor: 'pointer', fontWeight: 700,
                  }}
                  title="Edit Name"
                >
                  ✏️
                </button>
              </div>
            )}

            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
              ID: {currentUser?.username ? `ASHA-${currentUser.username}` : 'ASHA-NND-8842'} · ABHA Facilitator
            </p>
          </div>
        </div>
      </div>

      {/* Jurisdiction & Health Facility Details */}
      <div className="card" style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <p className="section-title" style={{ marginBottom: 4 }}>{t.jurisdictionDetails}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 10 }}>
          <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
            <MapPin className="w-4 h-4 text-teal-700" />
            <span>{t.subCentreLabel}</span>
          </span>
          <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>Chinchpada</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 10 }}>
          <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
            <Award className="w-4 h-4 text-amber-600" />
            <span>{t.phcLabel}</span>
          </span>
          <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>Dhadgaon PHC</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 10 }}>
          <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
            <Phone className="w-4 h-4 text-teal-700" />
            <span>{t.mobileLabel}</span>
          </span>
          <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>9823011234</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
            <Users className="w-4 h-4 text-sky-600" />
            <span>{t.coveredPopulation.split(':')[0]}:</span>
          </span>
          <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>{t.coveredPopulation.split(':')[1] || '1,250'}</span>
        </div>
      </div>

      {/* System & Offline Status */}
      <div className="card" style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p className="section-title" style={{ marginBottom: 4 }}>{t.systemAndSync}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
            <Database className="w-4 h-4 text-teal-700" />
            <span>{t.databaseStatus}:</span>
          </span>
          <span style={{
            fontSize: 12, fontWeight: 800, color: '#16A34A', background: '#F0FDF4',
            padding: '2px 10px', borderRadius: 9999, border: '1px solid #BBF7D0',
          }}>
            {networkStatus === 'offline' ? t.statusOffline : t.statusSynced}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>App Version:</span>
          </span>
          <span style={{ fontWeight: 700, color: '#0F172A', fontSize: 13 }}>v2.4.0 (NiramayNet Field Care)</span>
        </div>
      </div>

      {/* Language Switcher Section */}
      <div className="card" style={{ marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <label style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Globe className="w-4 h-4 text-teal-700" />
          <span>{t.selectLanguage}</span>
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 6 }}>
          {[
            { key: 'mr', label: 'मराठी' },
            { key: 'hi', label: 'हिंदी' },
            { key: 'en', label: 'English' },
            { key: 'kn', label: 'ಕನ್ನಡ' },
          ].map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setLanguage(item.key as Language)}
              className={`lang-btn${language === item.key ? ' active' : ''}`}
              style={{ width: '100%', minHeight: 44, padding: '0 4px', fontSize: 13 }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Logout Button */}
      <button
        type="button"
        onClick={logout}
        className="btn-danger"
        style={{
          minHeight: 54, fontSize: 16, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}
      >
        <LogOut className="w-5 h-5" />
        <span>{t.logoutBtn}</span>
      </button>
    </div>
  );
};
