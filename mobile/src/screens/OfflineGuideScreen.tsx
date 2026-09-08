import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TRIAGE_PROTOCOLS } from '../constants/triageProtocols';

interface GuideStep {
  title: string;
  body: string;
  icon: string;
  color: string;
}

export const OfflineGuideScreen: React.FC = () => {
  const { t, language, triageResult } = useApp();
  const [step, setStep] = useState(0);

  const steps: GuideStep[] = (() => {
    if (triageResult && triageResult.instructions.length > 0) {
      const dominantProtocol = triageResult.selectedSymptomKeys.length > 0
        ? TRIAGE_PROTOCOLS[triageResult.selectedSymptomKeys.find(
            k => TRIAGE_PROTOCOLS[k]?.icon === triageResult.dominantIcon
          ) ?? triageResult.selectedSymptomKeys[0]]
        : null;

      const colors = ['#0F766E', '#D97706', '#0284C7', '#16A34A', '#7C3AED'];
      const stepLabel = language === 'en' ? 'Step' : language === 'hi' ? 'चरण' : 'पायरी';

      return triageResult.instructions.map((inst, i) => ({
        title: `${stepLabel} ${i + 1}`,
        body: inst,
        icon: i === 0 ? (dominantProtocol?.icon ?? '🏥') : ['🩺', '📋', '⏱', '📞'][i - 1] ?? '📋',
        color: colors[i % colors.length],
      }));
    }

    return [
      { title: t.step1Title, body: t.step1Body, icon: '🛌', color: '#0F766E' },
      { title: t.step2Title, body: t.step2Body, icon: '🫁', color: '#D97706' },
      { title: t.step3Title, body: t.step3Body, icon: '📞', color: '#DC2626' },
    ];
  })();

  const current = steps[step] ?? steps[0];

  return (
    <div className="screen-body-noscroll">
      {/* Offline banner */}
      <div className="offline-banner" style={{ marginBottom: 16, borderRadius: 14 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
        </svg>
        {language === 'en' ? 'Offline Mode — No internet connection' : language === 'hi' ? 'ऑफलाइन मोड — इंटरनेट कनेक्शन उपलब्ध नहीं' : 'ऑफलाइन मोड — इंटरनेट कनेक्शन उपलब्ध नाही'}
      </div>

      {/* Symptom context banner */}
      {triageResult && triageResult.symptoms.length > 0 && (
        <div style={{
          background: '#FFFBEB',
          border: '1px solid #FDE68A',
          borderRadius: 14,
          padding: '10px 14px',
          marginBottom: 16,
          fontSize: 13,
          color: '#D97706',
          fontWeight: 700,
        }}>
          {triageResult.symptoms.join(' · ')}
        </div>
      )}

      {/* Step indicator dots */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20,
      }}>
        {steps.map((_, i) => (
          <button
            key={i}
            type="button"
            style={{
              width: i === step ? 28 : 8,
              height: 8,
              borderRadius: 4,
              background: i === step ? current.color : '#CBD5E1',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              padding: 0,
            }}
            onClick={() => setStep(i)}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="card" style={{
        flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '24px 20px', marginBottom: 16,
      }}>
        <div style={{
          width: 90, height: 90,
          background: `${current.color}15`,
          border: `2px solid ${current.color}40`,
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44,
          marginBottom: 20,
        }}>
          {current.icon}
        </div>

        <div style={{
          display: 'inline-block',
          padding: '4px 14px',
          background: current.color,
          color: '#ffffff',
          borderRadius: 9999,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 0.5,
          marginBottom: 14,
        }}>
          {current.title}
        </div>

        <p style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 600,
          color: '#0F172A',
          lineHeight: 1.6,
          textAlign: 'center',
          maxWidth: 320,
        }}>
          {current.body}
        </p>
      </div>

      {/* Emergency call button — explicitly red emergency button */}
      <div style={{ padding: '0 0 12px' }}>
        <a
          href="tel:108"
          className="btn-danger"
          style={{
            minHeight: 52,
            fontSize: 17,
            fontWeight: 800,
            textDecoration: 'none',
            letterSpacing: 0.5,
          }}
        >
          📞 108 — {language === 'en' ? 'Ambulance Emergency' : 'रुग्णवाहिका 108 हेल्पलाइन'}
        </a>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <button
          type="button"
          className="btn-outline"
          style={{ flex: 1, minHeight: 48, fontSize: 14 }}
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          {t.guidePrev}
        </button>
        <button
          type="button"
          className="btn-primary"
          style={{ flex: 1, minHeight: 48, fontSize: 14 }}
          onClick={() => setStep(s => Math.min(steps.length - 1, s + 1))}
          disabled={step === steps.length - 1}
        >
          {t.guideNext}
        </button>
      </div>
    </div>
  );
};
