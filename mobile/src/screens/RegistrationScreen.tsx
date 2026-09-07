import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const MicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const CameraIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

export const RegistrationScreen: React.FC = () => {
  const { t, addPatient, setActiveScreen, setCurrentPatient, showSnackbar } = useApp();

  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [sex, setSex] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [abhaId, setAbhaId] = useState('');
  const [village, setVillage] = useState('Chinchpada');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));
    const p = addPatient({ name, age, sex, abhaId, village, phone, lastTriage: undefined });
    setCurrentPatient(p);
    showSnackbar('रुग्ण नोंदणी यशस्वी. तपासणीकडे जात आहे...');
    setSubmitting(false);
    setActiveScreen('triage');
  };

  return (
    <div className="screen-body">
      <div style={{ marginBottom: 16 }}>
        <p style={{ margin: 0, fontSize: 14, color: '#616161' }}>{t.regSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Patient name */}
        <div>
          <label className="form-label">{t.patientName} *</label>
          <div className="form-input-with-icon">
            <input
              type="text"
              className="form-input"
              placeholder={t.patientNamePlaceholder}
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
            <button type="button" className="form-input-icon" onClick={() => setName('Rekha Patil')}>
              <MicIcon />
            </button>
          </div>
        </div>

        {/* Age picker */}
        <div>
          <label className="form-label">{t.age} (वर्षे)</label>
          <div className="number-picker">
            <button type="button" className="number-picker-btn" onClick={() => setAge(a => Math.max(0, a - 1))}>−</button>
            <div className="number-picker-value">{age}</div>
            <button type="button" className="number-picker-btn" onClick={() => setAge(a => Math.min(120, a + 1))}>+</button>
          </div>
        </div>

        {/* Sex selector */}
        <div>
          <label className="form-label">{t.sex}</label>
          <div style={{ display: 'flex' }}>
            {(['Female', 'Male', 'Other'] as const).map(s => (
              <button
                key={s}
                type="button"
                className={`sex-btn${sex === s ? ' selected' : ''}`}
                onClick={() => setSex(s)}
              >
                {s === 'Female' ? t.female : s === 'Male' ? t.male : t.other}
              </button>
            ))}
          </div>
        </div>

        {/* ABHA ID */}
        <div>
          <label className="form-label">{t.abhaId}</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              className="form-input"
              placeholder={t.abhaPlaceholder}
              value={abhaId}
              onChange={e => setAbhaId(e.target.value)}
              style={{ flex: 1 }}
            />
            <button
              type="button"
              style={{
                minHeight: 48, minWidth: 80,
                background: '#F5F5F5',
                border: '1.5px solid #E0E0E0',
                borderRadius: 6,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#616161',
                flexShrink: 0,
              }}
              onClick={() => setAbhaId('91-8823-4410-12')}
            >
              <CameraIcon />
              {t.scanQr}
            </button>
          </div>
        </div>

        {/* Village */}
        <div>
          <label className="form-label">{t.village}</label>
          <input
            type="text"
            className="form-input"
            value={village}
            onChange={e => setVillage(e.target.value)}
            style={{ background: '#FAFAFA', color: '#616161' }}
          />
          <p style={{ margin: '4px 0 0', fontSize: 12, color: '#9E9E9E' }}>
            उपकेंद्र क्षेत्रानुसार आधीच भरलेले आहे
          </p>
        </div>

        {/* Family contact */}
        <div>
          <label className="form-label">{t.familyContact}</label>
          <div className="form-input-with-icon">
            <input
              type="tel"
              className="form-input"
              placeholder={t.familyContactPlaceholder}
              value={phone}
              onChange={e => setPhone(e.target.value)}
            />
            <button type="button" className="form-input-icon" onClick={() => setPhone('9823011234')}>
              <MicIcon />
            </button>
          </div>
        </div>

        <div style={{ height: 8 }} />

        <button
          type="submit"
          className="btn-primary"
          disabled={submitting || !name.trim()}
          style={{ fontSize: 17, fontWeight: 700, minHeight: 52 }}
        >
          {submitting ? 'नोंदणी होत आहे...' : t.completeRegistration}
        </button>
      </form>
    </div>
  );
};
