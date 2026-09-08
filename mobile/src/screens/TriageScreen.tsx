import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getTriageGuidance } from '../constants/triageProtocols';

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
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

export const TriageScreen: React.FC = () => {
  const { t, language, currentPatient, setTriageResult, setActiveScreen } = useApp();
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

    if ((hasBreathing && hasPregnancy) || totalWeight >= 5) {
      urgency = 'EMERGENCY';
    } else if (totalWeight >= 2 || selected.has('child')) {
      urgency = 'URGENT';
    } else {
      urgency = 'ROUTINE';
    }

    const selectedKeys = Array.from(selected);
    const guidance = getTriageGuidance(selectedKeys, language);

    const selectedLabels = SYMPTOMS
      .filter(s => selected.has(s.key))
      .map(s => s.icon + ' ' + t[s.labelKey]);

    setTriageResult({
      urgency,
      reason: guidance.reason,
      symptoms: selectedLabels,
      instructions: guidance.instructions,
      selectedSymptomKeys: selectedKeys,
      dominantIcon: guidance.dominantIcon,
    });
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

  const guidance = assessed
    ? getTriageGuidance(Array.from(selected), language)
    : null;

  return (
    <div className="screen-body">
      {/* Patient summary */}
      {currentPatient && (
        <div className="card" style={{ marginBottom: 18, padding: '14px 18px', background: '#FFFFFF' }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#0F172A' }}>{currentPatient.name}</div>
          <div style={{ fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: 500 }}>
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
          width: 58, height: 58,
          borderRadius: '50%',
          background: listening ? '#0F766E' : '#F0FDFA',
          border: listening ? '2px solid #0F766E' : '2px solid #CCFBF1',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: listening ? '#ffffff' : '#0F766E',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 12px rgba(15, 118, 110, 0.15)',
        }}>
          <MicIcon size={26} />
        </div>
        <div style={{ fontWeight: 800, fontSize: 16, color: listening ? '#0F766E' : '#0F172A' }}>
          {listening ? t.listening : t.speakSymptoms}
        </div>
        <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>
          {listening ? t.recognizing : t.speakInMarathi}
        </div>
      </button>

      {/* Symptom chips */}
      <p className="section-title">{t.orSelectSymptoms}</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {SYMPTOMS.map(s => (
          <button
            key={s.key}
            type="button"
            className={`symptom-chip${selected.has(s.key) ? ' selected' : ''}`}
            onClick={() => toggle(s.key)}
          >
            <span style={{ fontSize: 20 }}>{s.icon}</span>
            <span style={{ fontSize: 14 }}>{t[s.labelKey]}</span>
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
          style={{ minHeight: 54, fontSize: 16, fontWeight: 700, marginBottom: 12, opacity: selected.size === 0 ? 0.6 : 1 }}
        >
          {t.urgencyResult}
        </button>
      )}

      {/* Result */}
      {assessed && urgency && guidance && (
        <div
          className={urgency === 'EMERGENCY' ? 'card-emergency' : urgency === 'URGENT' ? 'card-urgent' : 'card-safe'}
          style={{ marginBottom: 16 }}
        >
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '4px 12px',
            borderRadius: 9999,
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: 0.5,
            marginBottom: 10,
            background: urgency === 'EMERGENCY' ? '#DC2626' : urgency === 'URGENT' ? '#D97706' : '#16A34A',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            {urgency}
          </div>
          <div style={{ fontWeight: 800, fontSize: 18, color: '#0F172A', marginBottom: 6 }}>
            {urgency === 'EMERGENCY' ? t.emergencyTitle : urgency === 'URGENT' ? 'तातडीने लक्ष द्या' : 'सामान्य तपासणी'}
          </div>
          <div style={{ fontSize: 14, color: '#475569', marginBottom: 14, lineHeight: 1.5 }}>
            {guidance.reason}
          </div>

          {/* Symptom-specific first aid instructions */}
          <div style={{
            background: urgency === 'EMERGENCY' ? '#FFFFFF' : urgency === 'URGENT' ? '#FFFFFF' : '#FFFFFF',
            border: `1px solid ${urgency === 'EMERGENCY' ? '#FCA5A5' : urgency === 'URGENT' ? '#FDE68A' : '#BBF7D0'}`,
            borderRadius: 14,
            padding: '14px 16px',
            marginBottom: 18,
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
          }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              ⚕️ {language === 'en' ? 'First Aid Instructions' : language === 'hi' ? 'प्राथमिक उपचार निर्देश' : 'प्रथमोपचार सूचना'}
            </div>
            {guidance.instructions.map((inst, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: i < guidance.instructions.length - 1 ? 10 : 0 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%',
                  background: urgency === 'EMERGENCY' ? '#DC2626' : urgency === 'URGENT' ? '#D97706' : '#16A34A',
                  color: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800, flexShrink: 0, marginTop: 1,
                }}>{i + 1}</div>
                <span style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', lineHeight: 1.5, flex: 1 }}>{inst}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button
              type="button"
              className={urgency === 'EMERGENCY' ? 'btn-danger' : 'btn-primary'}
              onClick={() => setActiveScreen('consultation')}
            >
              {t.startConsultBtn}
            </button>
            {urgency === 'EMERGENCY' && (
              <button
                type="button"
                className="btn-outline"
                onClick={() => setActiveScreen('referral')}
                style={{ borderColor: '#DC2626', color: '#DC2626' }}
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
