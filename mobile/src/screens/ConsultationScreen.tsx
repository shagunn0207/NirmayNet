import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const VideoOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

export const ConsultationScreen: React.FC = () => {
  const { t, currentPatient, setActiveScreen } = useApp();
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'connected' | 'lost' | 'offline'>('idle');
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (callState !== 'connected') return;
    const interval = setInterval(() => {
      setElapsed(e => {
        if (e >= 12) {
          setCallState('lost');
          clearInterval(interval);
          setTimeout(() => setCallState('offline'), 2000);
          return e;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [callState]);

  const formatTime = (s: number) => `0${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const startCall = async () => {
    setCallState('connecting');
    await new Promise(r => setTimeout(r, 1800));
    setCallState('connected');
    setElapsed(0);
  };

  const endCall = () => {
    setCallState('idle');
    setElapsed(0);
  };

  return (
    <div className="screen-body-noscroll">
      {/* Patient summary */}
      {currentPatient && (
        <div style={{ marginBottom: 14 }}>
          <div className="card-emergency" style={{ padding: '14px 16px' }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#0F172A' }}>
              {currentPatient.name} — {t.urgentCase2}
            </div>
            <div style={{ fontSize: 13, color: '#475569', marginTop: 3, fontWeight: 500 }}>
              {t.breathingSwelling}
            </div>
          </div>
        </div>
      )}

      {/* Doctor info */}
      <div className="card" style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 52, height: 52,
          background: '#F0FDFA',
          border: '1px solid #CCFBF1',
          borderRadius: 16,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 24, flexShrink: 0,
        }}>
          👨‍⚕️
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#0F172A' }}>{t.doctorName}</div>
          <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{t.doctorPHC}</div>
          <div style={{ marginTop: 4 }}>
            {callState === 'connected' ? (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 12, color: '#16A34A', fontWeight: 700,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#16A34A', display: 'inline-block' }} />
                {t.connected} · {formatTime(elapsed)}
              </span>
            ) : callState === 'lost' || callState === 'offline' ? (
              <span style={{ fontSize: 12, color: '#DC2626', fontWeight: 700 }}>📡 {t.signalLost}</span>
            ) : callState === 'connecting' ? (
              <span style={{ fontSize: 12, color: '#D97706', fontWeight: 700 }}>⏳ जोडत आहे...</span>
            ) : (
              <span style={{ fontSize: 12, color: '#94A3B8', fontWeight: 500 }}>{t.networkTest} आधी करा</span>
            )}
          </div>
        </div>
      </div>

      {/* Video area */}
      <div style={{
        flex: 1,
        background: callState === 'connected' ? '#0F172A' : '#1E293B',
        borderRadius: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 12,
        marginBottom: 14,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 180,
        boxShadow: 'var(--shadow-md)',
      }}>
        {callState === 'idle' && (
          <>
            <div style={{ color: '#94A3B8' }}><VideoOffIcon /></div>
            <span style={{ color: '#64748B', fontSize: 14, fontWeight: 600 }}>कॅमेरा बंद आहे</span>
          </>
        )}
        {callState === 'connecting' && (
          <>
            <div style={{ width: 56, height: 56, border: '3px solid #0F766E', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <span style={{ color: '#94A3B8', fontSize: 14, fontWeight: 600 }}>कनेक्ट होत आहे...</span>
          </>
        )}
        {callState === 'connected' && (
          <>
            <div style={{ fontSize: 48 }}>👨‍⚕️</div>
            <span style={{ color: '#ffffff', fontSize: 15, fontWeight: 700 }}>{t.doctorName}</span>
            {/* Self preview */}
            <div style={{
              position: 'absolute', bottom: 12, right: 12,
              width: 84, height: 104,
              background: '#334155',
              borderRadius: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
              border: '2px solid rgba(255,255,255,0.2)',
            }}>
              👩
            </div>
          </>
        )}
        {(callState === 'lost' || callState === 'offline') && (
          <>
            <span style={{ fontSize: 36 }}>📡</span>
            <span style={{ color: '#F87171', fontSize: 16, fontWeight: 800 }}>{t.connectionBroke}</span>
            {callState === 'offline' && (
              <span style={{ color: '#94A3B8', fontSize: 13, textAlign: 'center', padding: '0 16px', fontWeight: 500 }}>
                {t.goingOffline}
              </span>
            )}
          </>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      {/* Controls */}
      {callState === 'connected' ? (
        <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
          <button
            type="button"
            style={{
              flex: 1, minHeight: 50,
              background: muted ? '#FEF2F2' : '#ffffff',
              border: muted ? '1.5px solid #FCA5A5' : '1.5px solid #E2E8F0',
              borderRadius: 14, fontSize: 14, fontWeight: 700,
              color: muted ? '#DC2626' : '#0F172A',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
            onClick={() => setMuted(m => !m)}
          >
            {muted ? '🔇 म्यूट' : '🎤 ' + t.mute}
          </button>
          <button
            type="button"
            className="btn-danger"
            style={{ flex: 1, minHeight: 50, fontSize: 14 }}
            onClick={endCall}
          >
            📵 {t.endCall}
          </button>
        </div>
      ) : callState === 'offline' ? (
        <button
          type="button"
          className="btn-outline"
          style={{ minHeight: 52, fontSize: 15, fontWeight: 700 }}
          onClick={() => setActiveScreen('guide')}
        >
          ऑफलाइन मार्गदर्शक उघडा
        </button>
      ) : (
        <button
          type="button"
          className="btn-primary"
          style={{ minHeight: 52, fontSize: 16, fontWeight: 700 }}
          onClick={startCall}
          disabled={callState === 'connecting'}
        >
          {callState === 'connecting' ? 'जोडत आहे...' : t.startVideoCall}
        </button>
      )}

      {/* Referral shortcut */}
      <button
        type="button"
        className="btn-outline"
        style={{ marginTop: 8, minHeight: 50, fontSize: 14 }}
        onClick={() => setActiveScreen('referral')}
      >
        {t.makeReferral}
      </button>
    </div>
  );
};
