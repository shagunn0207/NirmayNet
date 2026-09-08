import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CLINICAL_GUIDES, type ConditionGuide } from '../constants/clinicalGuides';

export const OfflineGuideScreen: React.FC = () => {
  const { t, language, setActiveScreen } = useApp();

  const [selectedGuideId, setSelectedGuideId] = useState<string>(CLINICAL_GUIDES[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const activeGuide: ConditionGuide = CLINICAL_GUIDES.find(g => g.id === selectedGuideId) || CLINICAL_GUIDES[0];
  const steps = activeGuide.steps;
  const currentStep = steps[currentStepIndex] || steps[0];
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleSelectGuide = (guideId: string) => {
    setSelectedGuideId(guideId);
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (isLastStep) {
      setActiveScreen('home');
    } else {
      setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1));
    }
  };

  const handlePrev = () => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  };

  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  return (
    <div className="screen-body" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflowY: 'auto', padding: '16px 18px 100px 18px', WebkitOverflowScrolling: 'touch' }}>
      {/* Offline banner */}
      <div className="offline-banner" style={{ marginBottom: 12, borderRadius: 12, padding: '8px 12px', fontSize: 12 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55M5 12.55a10.94 10.94 0 0 1 5.17-2.39M10.71 5.05A16 16 0 0 1 22.56 9M1.42 9a15.91 15.91 0 0 1 4.7-2.88M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01" />
        </svg>
        {t.offlineBannerText}
      </div>

      {/* Top condition category header & selector */}
      <div style={{ marginBottom: 14 }}>
        <label className="form-label" style={{ marginBottom: 6, fontSize: 12, fontWeight: 800, color: '#475569' }}>
          {t.more.toUpperCase()} — CONDITION GUIDES ({CLINICAL_GUIDES.length})
        </label>
        <select
          className="form-input"
          value={selectedGuideId}
          onChange={e => handleSelectGuide(e.target.value)}
          style={{
            fontWeight: 800,
            fontSize: 15,
            color: '#0F766E',
            background: '#F0FDFA',
            borderColor: '#CCFBF1',
            borderRadius: 14,
            padding: '10px 14px',
            minHeight: 48,
            width: '100%',
          }}
        >
          {CLINICAL_GUIDES.map(guide => (
            <option key={guide.id} value={guide.id}>
              {guide.icon} {guide.category[language] || guide.category.en}
            </option>
          ))}
        </select>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#0F766E' }}>
            {t.step} {currentStep.stepNumber} {t.stepOf} {currentStep.totalSteps}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#64748B' }}>
            {progressPercent}%
          </span>
        </div>
        <div style={{ height: 8, background: '#E2E8F0', borderRadius: 4, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(90deg, #0F766E, #0D9488)',
            borderRadius: 4,
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>

      {/* Single step card - SCROLLABLE CONTENT */}
      <div className="card" style={{
        padding: '24px 20px',
        marginBottom: 16,
        background: '#FFFFFF',
        boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        {/* Large Action Icon */}
        <div style={{
          width: 88,
          height: 88,
          background: '#F0FDFA',
          border: '2px solid #CCFBF1',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 44,
          marginBottom: 16,
          boxShadow: '0 4px 14px rgba(15, 118, 110, 0.15)',
        }}>
          {currentStep.icon}
        </div>

        {/* Step Number Badge */}
        <div style={{
          display: 'inline-block',
          padding: '4px 14px',
          background: '#0F766E',
          color: '#ffffff',
          borderRadius: 9999,
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 0.5,
          marginBottom: 14,
        }}>
          {t.step} {currentStep.stepNumber} {t.stepOf} {currentStep.totalSteps}
        </div>

        {/* Short Instruction */}
        <h3 style={{
          margin: '0 0 10px',
          fontSize: 18,
          fontWeight: 800,
          color: '#0F172A',
          lineHeight: 1.4,
        }}>
          {currentStep.instruction[language] || currentStep.instruction.en}
        </h3>

        {/* Sub-instruction */}
        <p style={{
          margin: 0,
          fontSize: 14,
          fontWeight: 500,
          color: '#475569',
          lineHeight: 1.5,
        }}>
          {currentStep.subInstruction[language] || currentStep.subInstruction.en}
        </p>
      </div>

      {/* Emergency 108 shortcut button */}
      <div style={{ marginBottom: 14 }}>
        <a
          href="tel:108"
          className="btn-danger"
          style={{
            minHeight: 46,
            fontSize: 15,
            fontWeight: 800,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          📞 108 — {t.ambulanceSection}
        </a>
      </div>

      {/* Navigation Buttons (Prev / Next or Done) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}>
        <button
          type="button"
          className="btn-outline"
          style={{ flex: 1, minHeight: 48, fontSize: 15, fontWeight: 700 }}
          onClick={handlePrev}
          disabled={currentStepIndex === 0}
        >
          {t.guidePrev}
        </button>
        <button
          type="button"
          className="btn-primary"
          style={{
            flex: 1,
            minHeight: 48,
            fontSize: 15,
            fontWeight: 800,
            background: isLastStep ? '#16A34A' : '#0F766E',
          }}
          onClick={handleNext}
        >
          {isLastStep ? `✓ ${t.done}` : t.guideNext}
        </button>
      </div>
    </div>
  );
};
