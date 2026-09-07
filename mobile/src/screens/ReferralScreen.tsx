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
  const { t, currentPatient, showSnackbar } = useApp();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    setSending(true);
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    showSnackbar(t.referralSuccess);
  };

  return (
    <div className="screen-body">
      {/* Patient + urgency */}
      <div className="card-emergency" style={{ marginBottom: 16, padding: '12px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#212121' }}>
              {currentPatient?.name ?? 'Rekha Patil'}
            </div>
            <div style={{ fontSize: 14, color: '#616161', marginTop: 2 }}>
              {t.urgentReferral}
            </div>
          </div>
          <span style={{
            padding: '3px 10px', borderRadius: 4,
            background: '#D32F2F', color: '#fff',
            fontSize: 12, fontWeight: 800, letterSpacing: 0.6,
            flexShrink: 0,
          }}>
            EMERGENCY
          </span>
        </div>
      </div>

      {/* Referred to */}
      <div className="card" style={{ marginBottom: 12 }}>
        <p className="section-title">रेफर केलेले रुग्णालय</p>
        <div style={{ fontWeight: 700, fontSize: 16, color: '#212121' }}>{t.referredTo}</div>
        <div style={{ fontSize: 13, color: '#616161', marginTop: 2 }}>District Level Hospital · 34 km</div>
      </div>

      {/* Ambulance */}
      <div className="card" style={{ marginBottom: 12 }}>
        <p className="section-title">{t.ambulanceSection}</p>
        {sent ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#388E3C', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}><CheckIcon /></span>
              <span style={{ fontWeight: 700, fontSize: 15, color: '#388E3C' }}>
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
            <span style={{ color: '#9E9E9E' }}><ClockIcon /></span>
            <span style={{ color: '#9E9E9E', fontSize: 14 }}>रेफरल पाठवल्यावर 108 सूचित होईल</span>
          </div>
        )}
      </div>

      {/* Hospital timeline */}
      {sent && (
        <div className="card" style={{ marginBottom: 12 }}>
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

      {/* While waiting instructions */}
      {sent && (
        <div className="card-urgent" style={{ marginBottom: 16 }}>
          <p className="section-title" style={{ color: '#E65100', marginBottom: 10 }}>
            ⏱ {t.whileWaiting}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <InstructionRow num="1" text={t.instruction1} />
            <InstructionRow num="2" text={t.instruction2} />
            <InstructionRow num="3" text={t.instruction3} />
          </div>
        </div>
      )}

      {/* Send button */}
      {!sent && (
        <button
          type="button"
          className="btn-danger"
          style={{ minHeight: 52, fontSize: 17, fontWeight: 700 }}
          onClick={handleSend}
          disabled={sending}
        >
          {sending ? t.sendingReferral : '🚑 रेफरल पाठवा आणि 108 बोलवा'}
        </button>
      )}

      {sent && (
        <div style={{
          padding: '14px 16px',
          background: '#E8F5E9',
          border: '1px solid #A5D6A7',
          borderRadius: 8,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{
            width: 32, height: 32, borderRadius: '50%',
            background: '#388E3C', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}><CheckIcon /></span>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#2E7D32' }}>
            {t.referralSuccess}
          </span>
        </div>
      )}
    </div>
  );
};

const InfoRow = ({ label, value, accent }: { label: string; value: string; accent?: boolean }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
    <span style={{ fontSize: 13, color: '#616161' }}>{label}</span>
    <span style={{
      fontSize: 14, fontWeight: accent ? 800 : 600,
      color: accent ? '#D32F2F' : '#212121',
    }}>{value}</span>
  </div>
);

const TimelineItem = ({ done, label, time }: { done: boolean; label: string; time: string }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
    <div style={{
      width: 24, height: 24, borderRadius: '50%',
      background: done ? '#388E3C' : '#E0E0E0',
      color: done ? '#fff' : '#9E9E9E',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      {done ? <CheckIcon /> : <span style={{ fontSize: 10 }}>○</span>}
    </div>
    <div style={{ flex: 1 }}>
      <span style={{ fontSize: 14, fontWeight: 600, color: done ? '#212121' : '#9E9E9E' }}>{label}</span>
    </div>
    <span style={{ fontSize: 12, color: '#9E9E9E' }}>{time}</span>
  </div>
);

const InstructionRow = ({ num, text }: { num: string; text: string }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
    <div style={{
      width: 24, height: 24, borderRadius: '50%',
      background: '#E65100', color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 13, fontWeight: 800,
      flexShrink: 0, marginTop: 1,
    }}>{num}</div>
    <span style={{ fontSize: 15, fontWeight: 500, color: '#212121', flex: 1 }}>{text}</span>
  </div>
);
