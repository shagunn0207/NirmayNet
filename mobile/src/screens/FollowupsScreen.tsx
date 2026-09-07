import React from 'react';
import { useApp } from '../context/AppContext';

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.13h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const urgencyConfig = {
  EMERGENCY: { bg: '#FFEBEE', border: '#EF9A9A', label: 'तातडीचे', labelColor: '#C62828', strip: '#D32F2F' },
  URGENT:    { bg: '#FFF8E1', border: '#FFE082', label: 'लक्ष आवश्यक', labelColor: '#E65100', strip: '#F57C00' },
  ROUTINE:   { bg: '#E8F5E9', border: '#A5D6A7', label: 'सामान्य', labelColor: '#2E7D32', strip: '#388E3C' },
};

export const FollowupsScreen: React.FC = () => {
  const { t, followups, toggleVisited } = useApp();

  const pending = followups.filter(f => !f.visited);
  const done = followups.filter(f => f.visited);

  return (
    <div className="screen-body">
      {pending.length === 0 && done.length > 0 && (
        <div style={{
          padding: '20px 16px',
          background: '#E8F5E9',
          border: '1px solid #A5D6A7',
          borderRadius: 8,
          textAlign: 'center',
          marginBottom: 16,
        }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>✅</div>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#2E7D32' }}>
            आजचे सर्व फॉलो-अप पूर्ण झाले!
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <>
          <p className="section-title" style={{ marginBottom: 10 }}>
            {pending.length} बाकी आहेत
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
            {pending.map(item => {
              const cfg = urgencyConfig[item.urgency];
              return (
                <div
                  key={item.id}
                  style={{
                    background: cfg.bg,
                    border: `1px solid ${cfg.border}`,
                    borderLeft: `4px solid ${cfg.strip}`,
                    borderRadius: 8,
                    overflow: 'hidden',
                  }}
                >
                  <div style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 15, color: '#212121' }}>{item.patientName}</div>
                        <div style={{ fontSize: 13, color: '#616161', marginTop: 2 }}>
                          {item.patientAge} {t.yearsOld} · {item.category}
                        </div>
                        <div style={{ marginTop: 6 }}>
                          <span style={{
                            padding: '2px 8px', borderRadius: 4,
                            background: cfg.strip, color: '#fff',
                            fontSize: 11, fontWeight: 700, letterSpacing: 0.6,
                          }}>
                            {cfg.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                      <a
                        href={`tel:${item.phone}`}
                        style={{
                          flex: 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          minHeight: 40,
                          background: '#fff',
                          border: '1px solid #E0E0E0',
                          borderRadius: 6,
                          fontSize: 14, fontWeight: 600,
                          color: '#1565C0', textDecoration: 'none',
                        }}
                      >
                        <PhoneIcon />
                        {t.callPatient}
                      </a>
                      <button
                        type="button"
                        style={{
                          flex: 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          minHeight: 40,
                          background: '#388E3C', color: '#fff',
                          border: 'none', borderRadius: 6,
                          fontSize: 14, fontWeight: 700,
                          cursor: 'pointer', fontFamily: 'inherit',
                        }}
                        onClick={() => toggleVisited(item.id)}
                      >
                        <CheckIcon />
                        {t.markVisited}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {done.length > 0 && (
        <>
          <p className="section-title" style={{ marginBottom: 10 }}>{t.completed} ({done.length})</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {done.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px',
                  background: '#FAFAFA',
                  border: '1px solid #E0E0E0',
                  borderRadius: 8,
                  opacity: 0.8,
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#388E3C', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <CheckIcon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, color: '#616161', textDecoration: 'line-through' }}>
                    {item.patientName}
                  </div>
                  <div style={{ fontSize: 13, color: '#9E9E9E' }}>{item.category}</div>
                </div>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', fontSize: 12, color: '#9E9E9E', cursor: 'pointer', fontFamily: 'inherit' }}
                  onClick={() => toggleVisited(item.id)}
                >
                  पूर्ववत करा
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
