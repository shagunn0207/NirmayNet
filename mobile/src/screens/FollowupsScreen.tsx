import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

const PhoneIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3 1.13h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z" />
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

export const FollowupsScreen: React.FC = () => {
  const { t, followups, toggleVisited } = useApp();

  type CategoryFilter = 'all' | 'Female' | 'Male' | 'Child' | 'Senior';
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const filterItem = (f: any) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'Female') return f.patientSex === 'Female';
    if (activeFilter === 'Male') return f.patientSex === 'Male';
    if (activeFilter === 'Child') return f.patientAge <= 18 || (f.category && (f.category.toLowerCase().includes('child') || f.category.toLowerCase().includes('pediatric'))) || (f.patientName && f.patientName.toLowerCase().includes('baby'));
    if (activeFilter === 'Senior') return f.patientAge >= 55;
    return true;
  };

  const pending = followups.filter(f => !f.visited && filterItem(f));
  const done = followups.filter(f => f.visited && filterItem(f));

  const getUrgencyLabel = (urg: string) => {
    if (urg === 'EMERGENCY') return t.emergency;
    if (urg === 'URGENT') return t.urgent;
    return t.routine;
  };

  return (
    <div className="screen-body" style={{ paddingBottom: 90 }}>
      {/* Category Pills Row: All, Female, Male, Child, Senior */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
        {[
          { key: 'all', icon: '👥', label: 'All' },
          { key: 'Female', icon: '👩', label: t.sexFemale || 'Female' },
          { key: 'Male', icon: '👨', label: t.sexMale || 'Male' },
          { key: 'Child', icon: '👶', label: 'Child / Infant' },
          { key: 'Senior', icon: '👵', label: 'Senior' },
        ].map(cat => {
          const isActive = activeFilter === cat.key;
          const count = followups.filter(f => !f.visited && (
            cat.key === 'all' ? true :
            cat.key === 'Female' ? f.patientSex === 'Female' :
            cat.key === 'Male' ? f.patientSex === 'Male' :
            cat.key === 'Child' ? (f.patientAge <= 18 || (f.category && (f.category.toLowerCase().includes('child') || f.category.toLowerCase().includes('pediatric'))) || (f.patientName && f.patientName.toLowerCase().includes('baby'))) :
            f.patientAge >= 55
          )).length;

          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveFilter(cat.key as any)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 9999, whiteSpace: 'nowrap',
                border: isActive ? '1.5px solid #0F766E' : '1px solid #E2E8F0',
                background: isActive ? '#0F766E' : '#FFFFFF',
                color: isActive ? '#FFFFFF' : '#475569',
                fontWeight: isActive ? 800 : 600, fontSize: 13,
                cursor: 'pointer', boxShadow: isActive ? '0 3px 10px rgba(15, 118, 110, 0.2)' : '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
              <span style={{
                fontSize: 11, padding: '1px 6px', borderRadius: 9999,
                background: isActive ? 'rgba(255,255,255,0.25)' : '#F1F5F9',
                color: isActive ? '#FFFFFF' : '#64748B', fontWeight: 800,
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
      {pending.length === 0 && done.length > 0 && (
        <div style={{
          padding: '24px 20px',
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: 18,
          textAlign: 'center',
          marginBottom: 18,
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
          <div style={{ fontWeight: 800, fontSize: 17, color: '#15803D' }}>
            {t.allFollowupsDone}
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <>
          <p className="section-title" style={{ marginBottom: 12 }}>
            {pending.length} {t.statusPending.split(' ')[1] ?? 'Pending'}
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
            {pending.map(item => {
              const isEmergency = item.urgency === 'EMERGENCY';
              const isUrgent = item.urgency === 'URGENT';

              const bg = isEmergency ? '#FEF2F2' : isUrgent ? '#FFFBEB' : '#F0FDF4';
              const border = isEmergency ? '#FCA5A5' : isUrgent ? '#FDE68A' : '#BBF7D0';
              const strip = isEmergency ? '#DC2626' : isUrgent ? '#D97706' : '#16A34A';

              return (
                <div
                  key={item.id}
                  style={{
                    background: bg,
                    border: `1px solid ${border}`,
                    borderLeft: `5px solid ${strip}`,
                    borderRadius: 18,
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <div style={{ padding: '16px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: 16, color: '#0F172A' }}>{item.patientName}</div>
                        <div style={{ fontSize: 13, color: '#475569', marginTop: 2, fontWeight: 500 }}>
                          {item.patientAge} {t.yearsOld} · {item.category}
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: 9999,
                            background: strip, color: '#ffffff',
                            fontSize: 11, fontWeight: 800, letterSpacing: 0.5,
                          }}>
                            {getUrgencyLabel(item.urgency)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
                      <a
                        href={`tel:${item.phone}`}
                        style={{
                          flex: 1,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                          minHeight: 44,
                          background: '#ffffff',
                          border: '1.5px solid #0F766E',
                          borderRadius: 12,
                          fontSize: 14, fontWeight: 700,
                          color: '#0F766E', textDecoration: 'none',
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
                          minHeight: 44,
                          background: '#16A34A', color: '#ffffff',
                          border: 'none', borderRadius: 12,
                          fontSize: 14, fontWeight: 700,
                          cursor: 'pointer', fontFamily: 'inherit',
                          boxShadow: '0 2px 8px rgba(22, 163, 74, 0.25)',
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
          <p className="section-title" style={{ marginBottom: 12 }}>{t.completed} ({done.length})</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {done.map(item => (
              <div
                key={item.id}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 16px',
                  background: '#ffffff',
                  border: '1px solid #E2E8F0',
                  borderRadius: 14,
                  opacity: 0.75,
                }}
              >
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: '#16A34A', color: '#ffffff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <CheckIcon />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#475569', textDecoration: 'line-through' }}>
                    {item.patientName}
                  </div>
                  <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 500 }}>{item.category}</div>
                </div>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', fontSize: 12, color: '#0F766E', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
                  onClick={() => toggleVisited(item.id)}
                >
                  {t.undo}
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
