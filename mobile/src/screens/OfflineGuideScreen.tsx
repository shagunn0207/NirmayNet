import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const STEPS = [
  {
    stepKey: 'step1Title' as const,
    bodyKey: 'step1Body' as const,
    icon: '🛌',
    color: '#1565C0',
  },
  {
    stepKey: 'step2Title' as const,
    bodyKey: 'step2Body' as const,
    icon: '🫁',
    color: '#F57C00',
  },
  {
    stepKey: 'step3Title' as const,
    bodyKey: 'step3Body' as const,
    icon: '📞',
    color: '#D32F2F',
  },
];

export const OfflineGuideScreen: React.FC = () => {
  const { t } = useApp();
  const [step, setStep] = useState(0);

  const current = STEPS[step];

  return (
    <div className="screen-body-noscroll">
      {/* Offline banner */}
      <div className="offline-banner" style={{ marginBottom: 20, borderRadius: 8 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
        </svg>
        ऑफलाइन मोड — इंटरनेट कनेक्शन उपलब्ध नाही
      </div>

      {/* Step indicator dots */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 24,
      }}>
        {STEPS.map((_, i) => (
          <button
            key={i}
            type="button"
            style={{
              width: i === step ? 24 : 8,
              height: 8,
              borderRadius: 4,
              background: i === step ? current.color : '#E0E0E0',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              padding: 0,
            }}
            onClick={() => setStep(i)}
          />
        ))}
      </div>

      {/* Step content */}
      <div className="guide-step" style={{ flex: 1 }}>
        <div style={{
          width: 100, height: 100,
          background: `${current.color}15`,
          border: `3px solid ${current.color}40`,
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 48,
          marginBottom: 24,
        }}>
          {current.icon}
        </div>

        <div style={{
          display: 'inline-block',
          padding: '4px 12px',
          background: current.color,
          color: '#fff',
          borderRadius: 4,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: 0.5,
          marginBottom: 16,
        }}>
          {t[current.stepKey]}
        </div>

        <p style={{
          margin: 0,
          fontSize: 18,
          fontWeight: 600,
          color: '#212121',
          lineHeight: 1.6,
          textAlign: 'center',
          maxWidth: 300,
        }}>
          {t[current.bodyKey]}
        </p>
      </div>

      {/* Emergency call button — always visible */}
      <div style={{ padding: '0 0 12px' }}>
        <a
          href="tel:108"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            minHeight: 52,
            background: '#D32F2F',
            color: '#fff',
            borderRadius: 8,
            fontSize: 18,
            fontWeight: 800,
            textDecoration: 'none',
            letterSpacing: 0.5,
          }}
        >
          📞 108 — रुग्णवाहिका
        </a>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <button
          type="button"
          className="btn-outline"
          style={{ flex: 1, minHeight: 48 }}
          onClick={() => setStep(s => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          {t.guidePrev}
        </button>
        <button
          type="button"
          className="btn-primary"
          style={{ flex: 1, minHeight: 48 }}
          onClick={() => setStep(s => Math.min(STEPS.length - 1, s + 1))}
          disabled={step === STEPS.length - 1}
        >
          {t.guideNext}
        </button>
      </div>
    </div>
  );
};
