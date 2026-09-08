import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export const ReferralScreen: React.FC = () => {
  const { t, language, currentPatient, triageResult, showSnackbar } = useApp();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    showSnackbar(t.referralSuccess);
  };

  const instructions = triageResult?.instructions ?? [
    t.instruction1,
    t.instruction2,
    t.instruction3,
  ];

  const waitingTitle = language === 'en'
    ? 'While waiting for ambulance'
    : language === 'hi'
      ? 'एम्बुलेंस आने तक'
      : 'रुग्णवाहिका येईपर्यंत';

  return (
    <div className="screen-body">
      {/* Patient + urgency */}
      <div className="card-emergency" style={{ marginBottom: 16, padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 17, color: '#0F172A' }}>
              {currentPatient?.name ?? 'Rekha Patil'}
            </div>
            <div style={{ fontSize: 13, color: '#475569', marginTop: 3, fontWeight: 500 }}>
              {t.urgentReferral}
            </div>
          </div>
          <span style={{
            padding: '4px 10px', borderRadius: 9999,
            background: '#DC2626', color: '#ffffff',
            fontSize: 11, fontWeight: 800, letterSpacing: 0.6,
            flexShrink: 0,
            boxShadow: '0 2px 6px rgba(220, 38, 38, 0.3)',
          }}>
            EMERGENCY
          </span>
        </div>
      </div>

      {/* Reason from triage */}
      {triageResult?.reason && (
        <div className="card" style={{ marginBottom: 14, padding: '14px 18px', background: '#FFFBEB', borderColor: '#FDE68A' }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#D97706', marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {language === 'en' ? 'Reason' : language === 'hi' ? 'कारण' : 'कारण'}
          </div>
          <div style={{ fontSize: 14, color: '#0F172A', fontWeight: 600, lineHeight: 1.4 }}>
            {triageResult.reason}
          </div>
        </div>
      )}

      {/* Referred to */}
      <div className="card" style={{ marginBottom: 14 }}>
        <p className="section-title">रेफर केलेले रुग्णालय</p>
        <div style={{ fontWeight: 800, fontSize: 16, color: '#0F172A' }}>{t.referredTo}</div>
        <div style={{ fontSize: 13, color: '#64748B', marginTop: 3, fontWeight: 500 }}>District Level Hospital · 34 km</div>
      </div>

      {/* Ambulance */}
      <div className="card" style={{ marginBottom: 14 }}>
        <p className="section-title">{t.ambulanceSection}</p>
        {sent ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{
                width: 30, height: 30, borderRadius: '50%',
                background: '#16A34A', color: '#ffffff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}><CheckIcon /></span>
              <span style={{ fontWeight: 800, fontSize: 15, color: '#15803D' }}>
                {t.ambulanceDispatched}
              </span>
            </div>
            <div className="divider" />
            <InfoRow label="गाडी नंबर" value={t.vehicle} />
            <InfoRow label="चालक" value={t.driver} />
            <InfoRow label="अपेक्षित वेळ" value={t.estimatedArrival} accent />
            <InfoRow label={t.referralId} value="NMN-2024-007" />
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 0' }}>
            <span style={{ color: '#94A3B8' }}><ClockIcon /></span>
            <span style={{ color: '#64748B', fontSize: 14, fontWeight: 500 }}>रेफरल पाठवल्यावर 108 सूचित होईल</span>
          </div>
        )}
      </div>

      {/* Hospital timeline */}
      {sent && (
        <div className="card" style={{ marginBottom: 14 }}>
          <p className="section-title">{t.hospitalTimeline}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <TimelineItem
              done
              label={t.referralSent}
              time="14:32"
            />
            <TimelineItem
              done
              label={t.hospitalNotified}
              time="14:33"
            />
            <TimelineItem
              done={false}
              label={t.awaitingConfirmation}
              time="—"
            />
          </div>
        </div>
      )}

      {/* Dynamic while-waiting instructions */}
      {sent && (
        <div className="card-urgent" style={{ marginBottom: 16 }}>
          <p className="section-title" style={{ color: '#D97706', marginBottom: 10 }}>
            ⏱ {waitingTitle}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {instructions.map((inst, i) => (
              <InstructionRow key={i} num={String(i + 1)} text={inst} />
            ))}
          </div>
        </div>
      )}

      {/* Send button */}
      {!sent && (
        <button
          type="button"
          className="btn-danger"
          style={{ minHeight: 54, fontSize: 16, fontWeight: 700 }}
          onClick={handleSend}
          disabled={sending}
        >
          {sending ? t.sendingReferral : '🚑 रेफरल पाठवा आणि 108 बोलवा'}
        </button>
      )}

      {sent && (
        <div style={{
          padding: '16px 18px',
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}>
          <span style={{
            width: 34, height: 34, borderRadius: '50%',
            background: '#16A34A', color: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}><CheckIcon /></span>
          <span style={{ fontWeight: 800, fontSize: 15, color: '#15803D' }}>
            {t.referralSuccess}
          </span>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
    <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{label}</span>
    <span style={{
      fontSize: 14, fontWeight: accent ? 800 : 700,
      color: accent ? '#DC2626' : '#0F172A',
    }}>{value}</span>
  </div>
);

const TimelineItem = ({ done, label, time }: { done: boolean; label: string; time: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <div style={{
      width: 26, height: 26, borderRadius: '50%',
      background: done ? '#16A34A' : '#E2E8F0',
      color: done ? '#ffffff' : '#94A3B8',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {done ? <CheckIcon /> : <span style={{ fontSize: 10 }}>○</span>}
    </div>
    <div style={{ flex: 1 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: done ? '#0F172A' : '#94A3B8' }}>{label}</span>
    </div>
    <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{time}</span>
  </div>
);

const InstructionRow = ({ num, text }: { num: string; text: string }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
    <div style={{
      width: 24, height: 24, borderRadius: '50%',
      background: '#D97706', color: '#ffffff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 12, fontWeight: 800,
      flexShrink: 0, marginTop: 1,
    }}>{num}</div>
    <span style={{ fontSize: 14, fontWeight: 500, color: '#0F172A', flex: 1, lineHeight: 1.5 }}>{text}</span>
  </div>
);
