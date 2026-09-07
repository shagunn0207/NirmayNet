import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

interface Symptom {
  key: string;
  labelKey: keyof ReturnType<typeof useApp>['t'];
  icon: string;
  weight: number;
}

const SYMPTOMS: Symptom[] = [
  { key: 'fever',     labelKey: 'symptomFever',       icon: '🌡️', weight: 1 },
  { key: 'breathing', labelKey: 'symptomBreathing',   icon: '🫁', weight: 3 },
  { key: 'pregnancy', labelKey: 'symptomPregnancy',   icon: '🤰', weight: 2 },
  { key: 'headache',  labelKey: 'symptomHeadache',    icon: '🤕', weight: 1 },
  { key: 'weakness',  labelKey: 'symptomWeakness',    icon: '💪', weight: 1 },
  { key: 'vomiting',  labelKey: 'symptomVomiting',    icon: '🤢', weight: 1 },
  { key: 'child',     labelKey: 'symptomChildUnder5', icon: '👶', weight: 2 },
  { key: 'chronic',   labelKey: 'symptomChronic',     icon: '💊', weight: 1 },
];

const MicIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

export const TriageScreen: React.FC = () => {
  const { t, currentPatient, setTriageResult, setActiveScreen } = useApp();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [listening, setListening] = useState(false);
  const [assessed, setAssessed] = useState(false);

  const toggle = (key: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      if (n.has(key)) n.delete(key); else n.add(key);
      return n;
    });
    setAssessed(false);
  };

  const handleVoice = async () => {
    setListening(true);
    await new Promise(r => setTimeout(r, 2000));
    setSelected(new Set(['breathing', 'pregnancy']));
    setListening(false);
  };

  const assess = () => {
    const totalWeight = SYMPTOMS
      .filter(s => selected.has(s.key))
      .reduce((sum, s) => sum + s.weight, 0);

    const hasBreathing = selected.has('breathing');
    const hasPregnancy = selected.has('pregnancy');

    let urgency: 'EMERGENCY' | 'URGENT' | 'ROUTINE';
    let reason: string;

    if ((hasBreathing && hasPregnancy) || totalWeight >= 5) {
      urgency = 'EMERGENCY';
      reason = t.emergencyReason;
    } else if (totalWeight >= 2 || selected.has('child')) {
      urgency = 'URGENT';
      reason = 'तातडीने डॉक्टरांचा सल्ला घ्या';
    } else {
      urgency = 'ROUTINE';
      reason = 'प्राथमिक तपासणी पुरेशी आहे';
    }

    const selectedLabels = SYMPTOMS
      .filter(s => selected.has(s.key))
      .map(s => s.icon + ' ' + t[s.labelKey]);

    setTriageResult({ urgency, reason, symptoms: selectedLabels });
    setAssessed(true);
  };

  const urgency = (() => {
    if (!assessed) return null;
    const totalWeight = SYMPTOMS
      .filter(s => selected.has(s.key))
      .reduce((sum, s) => sum + s.weight, 0);
    const hasBreathing = selected.has('breathing');
    const hasPregnancy = selected.has('pregnancy');
    if ((hasBreathing && hasPregnancy) || totalWeight >= 5) return 'EMERGENCY';
    if (totalWeight >= 2 || selected.has('child')) return 'URGENT';
    return 'ROUTINE';
  })();

  return (
    <div className="screen-body">
      {/* Patient summary */}
      {currentPatient && (
        <div className="card" style={{ marginBottom: 16, padding: '12px 16px', background: '#FAFAFA' }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#212121' }}>{currentPatient.name}</div>
          <div style={{ fontSize: 14, color: '#616161', marginTop: 2 }}>
            {currentPatient.age} {t.yearsOld} · {currentPatient.sex === 'Female' ? 'स्त्री' : currentPatient.sex === 'Male' ? 'पुरुष' : 'इतर'}
            {currentPatient.village ? ` · ${currentPatient.village}` : ''}
          </div>
        </div>
      )}

      {/* Voice input */}
      <button
        type="button"
        className={`voice-btn${listening ? ' listening' : ''}`}
        onClick={handleVoice}
        disabled={listening}
        style={{ marginBottom: 20 }}
      >
        <div style={{
          width: 56, height: 56,
          borderRadius: '50%',
          background: listening ? '#1565C0' : '#F5F5F5',
          border: listening ? '2px solid #1565C0' : '2px solid #E0E0E0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: listening ? '#fff' : '#616161',
          transition: 'all 0.2s',
        }}>
          <MicIcon size={26} />
        </div>
        <div style={{ fontWeight: 700, fontSize: 16, color: listening ? '#1565C0' : '#212121' }}>
          {listening ? t.listening : t.speakSymptoms}
        </div>
        <div style={{ fontSize: 13, color: '#9E9E9E' }}>
          {listening ? t.recognizing : t.speakInMarathi}
        </div>
      </button>

      {/* Symptom chips */}
      <p className="section-title">{t.orSelectSymptoms}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 20 }}>
        {SYMPTOMS.map(s => (
          <button
            key={s.key}
            type="button"
            className={`symptom-chip${selected.has(s.key) ? ' selected' : ''}`}
            onClick={() => toggle(s.key)}
          >
            <span style={{ fontSize: 20 }}>{s.icon}</span>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{t[s.labelKey]}</span>
          </button>
        ))}
      </div>

      {/* Assess button */}
      {!assessed && (
        <button
          type="button"
          className="btn-primary"
          onClick={assess}
          disabled={selected.size === 0}
          style={{ minHeight: 52, fontSize: 17, fontWeight: 700, marginBottom: 12 }}
        >
          {t.urgencyResult}
        </button>
      )}

      {/* Result */}
      {assessed && urgency && (
        <div
          className={urgency === 'EMERGENCY' ? 'card-emergency' : urgency === 'URGENT' ? 'card-urgent' : 'card-safe'}
          style={{ marginBottom: 16 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '3px 10px',
            borderRadius: 4,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: 0.8,
            marginBottom: 8,
            background: urgency === 'EMERGENCY' ? '#D32F2F' : urgency === 'URGENT' ? '#E65100' : '#388E3C',
            color: '#fff',
          }}>
            {urgency}
          </div>
          <div style={{ fontWeight: 700, fontSize: 17, color: '#212121', marginBottom: 4 }}>
            {urgency === 'EMERGENCY' ? t.emergencyTitle : urgency === 'URGENT' ? 'तातडीने लक्ष द्या' : 'सामान्य तपासणी'}
          </div>
          <div style={{ fontSize: 14, color: '#616161', marginBottom: 16 }}>
            {urgency === 'EMERGENCY' ? t.emergencyReason : urgency === 'URGENT' ? 'तातडीने डॉक्टरांचा सल्ला घ्या' : 'प्राथमिक तपासणी पुरेशी आहे'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button
              type="button"
              className={urgency === 'EMERGENCY' ? 'btn-danger' : 'btn-primary'}
              onClick={() => setActiveScreen('consultation')}
              style={{ fontSize: 16, fontWeight: 700 }}
            >
              {t.startConsultBtn}
            </button>
            {urgency === 'EMERGENCY' && (
              <button
                type="button"
                className="btn-outline"
                onClick={() => setActiveScreen('referral')}
                style={{ borderColor: '#D32F2F', color: '#D32F2F' }}
              >
                {t.makeReferral}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
