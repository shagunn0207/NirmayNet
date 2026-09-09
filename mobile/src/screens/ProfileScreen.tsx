import React, { useState } from 'react';
import { MapPin, Phone, Globe, LogOut, Award, ShieldCheck, Database, Users, Edit3, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Language } from '../types';

export const ProfileScreen: React.FC = () => {
  const { t, language, setLanguage, logout, networkStatus, currentUser, updateUserAccount, showSnackbar } = useApp();

  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [fullName, setFullName] = useState(currentUser?.fullName || t.ashaWorkerName);
  const [role, setRole] = useState(currentUser?.role || t.ashaWorkerRole);
  const [subCentre, setSubCentre] = useState(currentUser?.subCentre || 'Chinchpada');
  const [phc, setPhc] = useState(currentUser?.phc || 'Dhadgaon PHC');
  const [mobile, setMobile] = useState(currentUser?.mobile || '9823011234');
  const [coveredPopulation, setCoveredPopulation] = useState(currentUser?.coveredPopulation || '1,250 citizens (240 families)');

  const handleSaveProfile = () => {
    if (!fullName.trim()) {
      showSnackbar('Please enter a valid full name');
      return;
    }

    updateUserAccount({
      fullName: fullName.trim(),
      role: role.trim(),
      subCentre: subCentre.trim(),
      phc: phc.trim(),
      mobile: mobile.trim(),
      coveredPopulation: coveredPopulation.trim(),
    });

    setIsEditing(false);
    showSnackbar('Profile details updated successfully!');
  };

  const handleCancelEdit = () => {
    setFullName(currentUser?.fullName || t.ashaWorkerName);
    setRole(currentUser?.role || t.ashaWorkerRole);
    setSubCentre(currentUser?.subCentre || 'Chinchpada');
    setPhc(currentUser?.phc || 'Dhadgaon PHC');
    setMobile(currentUser?.mobile || '9823011234');
    setCoveredPopulation(currentUser?.coveredPopulation || '1,250 citizens (240 families)');
    setIsEditing(false);
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
              {currentUser?.role || role || t.ashaWorkerRole}
            </span>
            <h2 style={{ margin: '2px 0 0', fontSize: 22, fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {currentUser?.fullName || fullName || t.ashaWorkerName}
            </h2>

            <p style={{ margin: '2px 0 0', fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
              ID: {currentUser?.username ? (currentUser.username.startsWith('ASHA') ? currentUser.username : `ASHA_${currentUser.username}`) : 'ASHA_NAND_023'} · ABHA Facilitator
            </p>
          </div>
        </div>

        {/* Edit / Save Toggle Button */}
        <div>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.22)',
                border: '1.5px solid rgba(255, 255, 255, 0.4)',
                color: '#ffffff',
                padding: '8px 14px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                backdropFilter: 'blur(4px)',
                transition: 'all 0.15s ease',
              }}
            >
              <Edit3 size={16} />
              <span>Edit</span>
            </button>
          ) : (
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '8px',
                  borderRadius: 10,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Cancel"
              >
                <X size={18} />
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                style={{
                  background: '#FFFFFF',
                  border: 'none',
                  color: '#0F766E',
                  padding: '8px 14px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                }}
              >
                <Check size={16} />
                <span>Save</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Jurisdiction & Health Facility Details (View / Edit Form) */}
      <div className="card" style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
          <p className="section-title" style={{ margin: 0 }}>{t.jurisdictionDetails}</p>
          {isEditing && (
            <span style={{ fontSize: 11, fontWeight: 800, color: '#0F766E', background: '#F0FDFA', padding: '2px 8px', borderRadius: 8 }}>
              Editing Profile Details
            </span>
          )}
        </div>

        {!isEditing ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 10 }}>
              <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
                <MapPin className="w-4 h-4 text-teal-700" />
                <span>{t.subCentreLabel}</span>
              </span>
              <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>{currentUser?.subCentre || subCentre}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 10 }}>
              <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
                <Award className="w-4 h-4 text-amber-600" />
                <span>{t.phcLabel}</span>
              </span>
              <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>{currentUser?.phc || phc}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #F1F5F9', paddingBottom: 10 }}>
              <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
                <Phone className="w-4 h-4 text-teal-700" />
                <span>{t.mobileLabel}</span>
              </span>
              <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>{currentUser?.mobile || mobile}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ color: '#475569', display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, fontWeight: 500 }}>
                <Users className="w-4 h-4 text-sky-600" />
                <span>{t.coveredPopulation.split(':')[0]}:</span>
              </span>
              <span style={{ fontWeight: 800, color: '#0F172A', fontSize: 14 }}>{currentUser?.coveredPopulation || coveredPopulation}</span>
            </div>
          </>
        ) : (
          /* EDIT MODE FORM */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="ASHA Worker Full Name"
              />
            </div>

            <div>
              <label className="form-label">Role / Designation</label>
              <input
                type="text"
                className="form-input"
                value={role}
                onChange={e => setRole(e.target.value)}
                placeholder="Role (e.g. ASHA Worker)"
              />
            </div>

            <div>
              <label className="form-label">{t.subCentreLabel}</label>
              <input
                type="text"
                className="form-input"
                value={subCentre}
                onChange={e => setSubCentre(e.target.value)}
                placeholder="Sub-Centre Name"
              />
            </div>

            <div>
              <label className="form-label">{t.phcLabel}</label>
              <input
                type="text"
                className="form-input"
                value={phc}
                onChange={e => setPhc(e.target.value)}
                placeholder="Primary Health Centre"
              />
            </div>

            <div>
              <label className="form-label">{t.mobileLabel}</label>
              <input
                type="tel"
                className="form-input"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                placeholder="Mobile Number"
              />
            </div>

            <div>
              <label className="form-label">{t.coveredPopulation.split(':')[0]}</label>
              <input
                type="text"
                className="form-input"
                value={coveredPopulation}
                onChange={e => setCoveredPopulation(e.target.value)}
                placeholder="Covered Population details"
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
              <button
                type="button"
                className="btn-outline"
                onClick={handleCancelEdit}
                style={{ flex: 1, minHeight: 46, fontSize: 14, fontWeight: 700 }}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSaveProfile}
                style={{ flex: 1, minHeight: 46, fontSize: 14, fontWeight: 800 }}
              >
                ✓ {t.save}
              </button>
            </div>
          </div>
        )}
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
