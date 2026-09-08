import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  validatePatientName,
  validateMobileNumber,
  validateAbhaId,
  formatAbhaIdInput,
} from '../utils/validation';

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

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const DRAFT_ID = 'register';

export const RegistrationScreen: React.FC = () => {
  const {
    t,
    language,
    addPatient,
    setActiveScreen,
    setCurrentPatient,
    showSnackbar,
    saveDraftField,
    getDraft,
    clearDraft,
    setHasUnsavedChanges,
  } = useApp();

  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [sex, setSex] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [abhaId, setAbhaId] = useState('');
  const [village, setVillage] = useState('Chinchpada');
  const [phone, setPhone] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [abhaTouched, setAbhaTouched] = useState(false);

  // Restore draft from SQLite on screen mount (CHANGE 2)
  useEffect(() => {
    let active = true;
    (async () => {
      const draft = await getDraft(DRAFT_ID);
      if (active && draft && Object.keys(draft).length > 0) {
        if (draft.name) setName(draft.name);
        if (draft.age) setAge(parseInt(draft.age, 10) || 25);
        if (draft.sex) setSex(draft.sex as any);
        if (draft.abhaId) setAbhaId(draft.abhaId);
        if (draft.village) setVillage(draft.village);
        if (draft.phone) setPhone(draft.phone);
        showSnackbar(
          language === 'en'
            ? 'Draft restored from SQLite'
            : language === 'hi'
            ? 'ड्राफ्ट SQLite से पुनर्प्राप्त किया गया'
            : language === 'kn'
            ? 'ಖರಡು SQLite ನಿಂದ ಮರುಸ್ಥಾಪಿಸಲಾಗಿದೆ'
            : 'ड्राफ्ट SQLite वरून पुनर्संचयित केले'
        );
      }
    })();
    return () => { active = false; };
  }, []);

  // Sync unsaved changes state to Context for header back button dialog guard
  useEffect(() => {
    const isDirty = Boolean(name.trim() || phone.trim() || abhaId.trim());
    setHasUnsavedChanges(isDirty);
    return () => { setHasUnsavedChanges(false); };
  }, [name, phone, abhaId, setHasUnsavedChanges]);

  // Validations
  const nameVal = validatePatientName(name);
  const phoneVal = validateMobileNumber(phone);
  const abhaVal = validateAbhaId(abhaId);

  const isFormValid = nameVal.isValid && phoneVal.isValid && abhaVal.isValid;

  const handleNameChange = (val: string) => {
    setName(val);
    setNameTouched(true);
    saveDraftField(DRAFT_ID, 'name', val);
  };

  const handleAgeChange = (newAge: number) => {
    const validAge = Math.max(0, Math.min(120, newAge));
    setAge(validAge);
    saveDraftField(DRAFT_ID, 'age', String(validAge));
  };

  const handleSexChange = (newSex: 'Male' | 'Female' | 'Other') => {
    setSex(newSex);
    saveDraftField(DRAFT_ID, 'sex', newSex);
  };

  const handlePhoneChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
    setPhoneTouched(true);
    saveDraftField(DRAFT_ID, 'phone', digitsOnly);
  };

  const handleAbhaChange = (val: string) => {
    const formatted = formatAbhaIdInput(val);
    setAbhaId(formatted);
    setAbhaTouched(true);
    saveDraftField(DRAFT_ID, 'abhaId', formatted);
  };

  const handleVillageChange = (val: string) => {
    setVillage(val);
    saveDraftField(DRAFT_ID, 'village', val);
  };

  const handleScanOrVerifyAbha = () => {
    const demoAbha = '91-8823-4410-12';
    setAbhaId(demoAbha);
    setAbhaTouched(true);
    saveDraftField(DRAFT_ID, 'abhaId', demoAbha);
    showSnackbar(
      language === 'en'
        ? '✓ ABHA ID scanned & verified via NHA'
        : language === 'hi'
        ? '✓ ABHA ID स्कैन व सत्यापित'
        : language === 'kn'
        ? '✓ ABHA ID ಪರಿಶೀಲಿಸಲಾಗಿದೆ'
        : '✓ ABHA ID स्कॅन व सत्यापित'
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameTouched(true);
    setPhoneTouched(true);
    setAbhaTouched(true);

    if (!isFormValid) return;

    setSubmitting(true);
    await new Promise(r => setTimeout(r, 600));

    const p = addPatient({
      name: name.trim(),
      age,
      sex,
      abhaId: abhaId.trim(),
      village,
      phone: phone.trim(),
      lastTriage: undefined,
    });

    // Clear draft on successful submit (CHANGE 2)
    await clearDraft(DRAFT_ID);
    setHasUnsavedChanges(false);

    setCurrentPatient(p);
    showSnackbar(
      language === 'en'
        ? 'Patient Registration Successful.'
        : language === 'hi'
        ? 'मरीज़ पंजीकरण सफल।'
        : language === 'kn'
        ? 'ರೋಗಿ ನೋಂದಣಿ ಯಶಸ್ವಿಯಾಗಿದೆ.'
        : 'रुग्ण नोंदणी यशस्वी.'
    );
    setSubmitting(false);
    setActiveScreen('triage');
  };

  return (
    <div className="screen-body">
      <div style={{ marginBottom: 18 }}>
        <p style={{ margin: 0, fontSize: 14, color: '#475569', fontWeight: 500 }}>{t.regSubtitle}</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Patient Name field */}
        <div>
          <label className="form-label">{t.patientName} *</label>
          <div className="form-input-with-icon">
            <input
              type="text"
              className={`form-input${nameTouched && !nameVal.isValid ? ' error' : ''}`}
              placeholder={t.patientNamePlaceholder}
              value={name}
              onChange={e => handleNameChange(e.target.value)}
              onBlur={() => setNameTouched(true)}
              required
            />
            <button
              type="button"
              className="form-input-icon"
              title="Voice Fill Demo"
              onClick={() => handleNameChange('Rekha Patil')}
            >
              <MicIcon />
            </button>
          </div>
          {nameTouched && !nameVal.isValid && (
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#DC2626', fontWeight: 600 }}>
              {t.invalidNameError}
            </p>
          )}
        </div>

        {/* Age picker */}
        <div>
          <label className="form-label">{t.age} ({t.yearsOld})</label>
          <div className="number-picker">
            <button type="button" className="number-picker-btn" onClick={() => handleAgeChange(age - 1)}>−</button>
            <div className="number-picker-value">{age}</div>
            <button type="button" className="number-picker-btn" onClick={() => handleAgeChange(age + 1)}>+</button>
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
                onClick={() => handleSexChange(s)}
              >
                {s === 'Female' ? t.female : s === 'Male' ? t.male : t.other}
              </button>
            ))}
          </div>
        </div>

        {/* ABHA ID */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <label className="form-label" style={{ marginBottom: 0 }}>{t.abhaId} *</label>
            {abhaVal.isVerified && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 12, fontWeight: 800, color: '#16A34A', background: '#F0FDF4',
                padding: '2px 8px', borderRadius: 9999, border: '1px solid #BBF7D0',
              }}>
                <CheckCircleIcon />
                <span>{t.abhaVerifiedBadge}</span>
              </span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              className={`form-input${abhaTouched && !abhaVal.isValid ? ' error' : ''}`}
              placeholder={t.abhaPlaceholder}
              value={abhaId}
              onChange={e => handleAbhaChange(e.target.value)}
              onBlur={() => setAbhaTouched(true)}
              maxLength={17}
              style={{ flex: 1 }}
              required
            />
            <button
              type="button"
              style={{
                minHeight: 50, padding: '0 14px',
                background: '#F0FDFA',
                border: '1.5px solid #CCFBF1',
                borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontSize: 13, fontWeight: 700, cursor: 'pointer', color: '#0F766E',
                flexShrink: 0,
              }}
              onClick={handleScanOrVerifyAbha}
            >
              <CameraIcon />
              {t.scanQr}
            </button>
          </div>
          {abhaTouched && !abhaVal.isValid && (
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#DC2626', fontWeight: 600 }}>
              {t.invalidAbhaError}
            </p>
          )}
        </div>

        {/* Village */}
        <div>
          <label className="form-label">{t.village}</label>
          <input
            type="text"
            className="form-input"
            value={village}
            onChange={e => handleVillageChange(e.target.value)}
            style={{ background: '#F8FAFC', color: '#475569' }}
          />
          <p style={{ margin: '6px 0 0', fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>
            {t.autoFilledVillage}
          </p>
        </div>

        {/* Family Contact Number */}
        <div>
          <label className="form-label">{t.familyContact} *</label>
          <div className="form-input-with-icon">
            <input
              type="tel"
              className={`form-input${phoneTouched && !phoneVal.isValid ? ' error' : ''}`}
              placeholder={t.familyContactPlaceholder}
              value={phone}
              onChange={e => handlePhoneChange(e.target.value)}
              onBlur={() => setPhoneTouched(true)}
              maxLength={10}
              required
            />
            <button
              type="button"
              className="form-input-icon"
              onClick={() => handlePhoneChange('9823011234')}
              title="Voice Fill Phone"
            >
              <MicIcon />
            </button>
          </div>
          {phoneTouched && !phoneVal.isValid && (
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#DC2626', fontWeight: 600 }}>
              {t.invalidPhoneError}
            </p>
          )}
        </div>

        <div style={{ height: 8 }} />

        {/* Complete Registration Button */}
        <button
          type="submit"
          className="btn-primary"
          disabled={submitting || !isFormValid}
          style={{ fontSize: 16, fontWeight: 700, minHeight: 54, opacity: !isFormValid ? 0.5 : 1 }}
        >
          {submitting ? '...' : t.completeRegistration}
        </button>
      </form>
    </div>
  );
};
