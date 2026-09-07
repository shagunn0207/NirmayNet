import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';

const VideoOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 16v1a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h2m5.66 0H14a2 2 0 0 1 2 2v3.34l1 1L23 7v10" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const PhoneIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.13h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z" />
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
        <div style={{ marginBottom: 16 }}>
          <div className="card-emergency" style={{ padding: '12px 16px' }}>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#212121' }}>
              {currentPatient.name} — {t.urgentCase2}
            </div>
            <div style={{ fontSize: 14, color: '#616161', marginTop: 2 }}>
              {t.breathingSwelling}
            </div>
          </div>
        </div>
      )}

      {/* Doctor info */}
      <div className="card" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 52, height: 52,
          background: '#E3F2FD',
          borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0,
        }}>
          👨‍⚕️
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#212121' }}>{t.doctorName}</div>
          <div style={{ fontSize: 14, color: '#616161' }}>{t.doctorPHC}</div>
          <div style={{ marginTop: 4 }}>
            {callState === 'connected' ? (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 13, color: '#388E3C', fontWeight: 600,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#388E3C', display: 'inline-block' }} />
                {t.connected} · {formatTime(elapsed)}
              </span>
            ) : callState === 'lost' || callState === 'offline' ? (
              <span style={{ fontSize: 13, color: '#D32F2F', fontWeight: 600 }}>📡 {t.signalLost}</span>
            ) : callState === 'connecting' ? (
              <span style={{ fontSize: 13, color: '#F57C00', fontWeight: 600 }}>⏳ जोडत आहे...</span>
            ) : (
              <span style={{ fontSize: 13, color: '#9E9E9E' }}>{t.networkTest} आधी करा</span>
            )}
          </div>
        </div>
      </div>

      {/* Video area */}
      <div style={{
        flex: 1,
        background: callState === 'connected' ? '#1A237E' : '#212121',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 12,
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden',
        minHeight: 180,
      }}>
        {callState === 'idle' && (
          <>
            <div style={{ color: '#9E9E9E' }}><VideoOffIcon /></div>
            <span style={{ color: '#757575', fontSize: 14 }}>कॅमेरा बंद आहे</span>
          </>
        )}
        {callState === 'connecting' && (
          <>
            <div style={{ width: 60, height: 60, border: '3px solid #1565C0', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <span style={{ color: '#9E9E9E', fontSize: 14 }}>कनेक्ट होत आहे...</span>
          </>
        )}
        {callState === 'connected' && (
          <>
            <div style={{ fontSize: 48 }}>👨‍⚕️</div>
            <span style={{ color: '#fff', fontSize: 14, fontWeight: 600 }}>{t.doctorName}</span>
            {/* Self preview */}
            <div style={{
              position: 'absolute', bottom: 10, right: 10,
              width: 80, height: 100,
              background: '#424242',
              borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28,
              border: '2px solid rgba(255,255,255,0.3)',
            }}>
              👩
            </div>
          </>
        )}
        {(callState === 'lost' || callState === 'offline') && (
          <>
            <span style={{ fontSize: 32 }}>📡</span>
            <span style={{ color: '#EF5350', fontSize: 16, fontWeight: 700 }}>{t.connectionBroke}</span>
            {callState === 'offline' && (
              <span style={{ color: '#9E9E9E', fontSize: 13, textAlign: 'center', padding: '0 16px' }}>
                {t.goingOffline}
              </span>
            )}
          </>
        )}
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>

      {/* Controls */}
      {callState === 'connected' ? (
        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button
            type="button"
            style={{
              flex: 1, minHeight: 48,
              background: muted ? '#D32F2F' : '#F5F5F5',
              border: '1px solid #E0E0E0',
              borderRadius: 8, fontSize: 13, fontWeight: 700,
              color: muted ? '#fff' : '#212121',
              cursor: 'pointer', fontFamily: 'inherit',
            }}
            onClick={() => setMuted(m => !m)}
          >
            {muted ? '🔇 म्यूट' : '🎤 ' + t.mute}
          </button>
          <button
            type="button"
            className="btn-danger"
            style={{ flex: 1, minHeight: 48, fontSize: 14 }}
            onClick={endCall}
          >
            📵 {t.endCall}
          </button>
        </div>
      ) : callState === 'offline' ? (
        <button
          type="button"
          className="btn-outline"
          style={{ minHeight: 52, fontSize: 16, fontWeight: 700 }}
          onClick={() => setActiveScreen('guide')}
        >
          ऑफलाइन मार्गदर्शक उघडा
        </button>
      ) : (
        <button
          type="button"
          className="btn-primary"
          style={{ minHeight: 52, fontSize: 17, fontWeight: 700 }}
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
        style={{ marginTop: 8, minHeight: 48, fontSize: 15 }}
        onClick={() => setActiveScreen('referral')}
      >
        {t.makeReferral}
      </button>
    </div>
  );
};
