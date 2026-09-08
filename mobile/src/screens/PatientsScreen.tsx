import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { Patient } from '../types';

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const UrgencyBadge = ({ urgency }: { urgency?: string }) => {
  if (!urgency) return null;
  const config = {
    EMERGENCY: { bg: '#FEF2F2', color: '#DC2626', border: '#FCA5A5', label: 'तातडीचे' },
    URGENT:    { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', label: 'लक्ष द्या' },
    ROUTINE:   { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0', label: 'सामान्य' },
  }[urgency] ?? { bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0', label: urgency };

  return (
    <span style={{
      padding: '3px 10px', borderRadius: 9999,
      background: config.bg, color: config.color, border: `1px solid ${config.border}`,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.2,
    }}>
      {config.label}
    </span>
  );
};

const PatientDetail: React.FC<{ patient: Patient; onClose: () => void }> = ({ patient, onClose }) => {
  const { t } = useApp();
  return (
    <div style={{ position: 'absolute', inset: 0, background: '#F8FAFC', zIndex: 10, display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)', color: '#ffffff',
        padding: '0 20px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 14px rgba(15, 118, 110, 0.25)',
      }}>
        <div>
          <div style={{ fontWeight: 800, fontSize: 17 }}>{patient.name}</div>
          <div style={{ fontSize: 12, opacity: 0.9, fontWeight: 500 }}>{patient.age} {t.yearsOld} · {patient.sex === 'Female' ? 'स्त्री' : 'पुरुष'}</div>
        </div>
        <button type="button" className="btn-icon" style={{ color: '#ffffff' }} onClick={onClose}>
          <CloseIcon />
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Basic info */}
        <div className="card">
          <p className="section-title">मूलभूत माहिती</p>
          <InfoRow label="ABHA ID" value={patient.abhaId ?? '—'} />
          <div className="divider" />
          <InfoRow label="गाव" value={patient.village} />
          <div className="divider" />
          <InfoRow label="फोन" value={patient.phone} />
          <div className="divider" />
          <InfoRow label={t.registrationDate} value={patient.registrationDate} />
          <div className="divider" />
          <InfoRow label="शेवटची भेट" value={patient.lastVisit ?? '—'} />
        </div>

        {/* Status */}
        <div className="card">
          <p className="section-title">सध्याची स्थिती</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UrgencyBadge urgency={patient.lastTriage} />
          </div>
        </div>

        {/* Symptoms */}
        {patient.symptoms && patient.symptoms.length > 0 && (
          <div className="card">
            <p className="section-title">{t.symptoms}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {patient.symptoms.map(s => (
                <span key={s} style={{
                  padding: '6px 12px', background: '#F0FDFA',
                  border: '1px solid #CCFBF1', borderRadius: 10,
                  fontSize: 13, fontWeight: 600, color: '#0F766E',
                }}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Consultations */}
        {patient.consultations && patient.consultations.length > 0 && (
          <div className="card">
            <p className="section-title">{t.previousConsultations}</p>
            {patient.consultations.map(c => (
              <div key={c} style={{ fontSize: 14, color: '#0F172A', padding: '6px 0', borderBottom: '1px solid #F1F5F9', fontWeight: 500 }}>{c}</div>
            ))}
          </div>
        )}

        {/* Referrals */}
        {patient.referrals && patient.referrals.length > 0 && (
          <div className="card">
            <p className="section-title">{t.referrals}</p>
            {patient.referrals.map(r => (
              <div key={r} style={{ fontSize: 14, color: '#0F172A', padding: '6px 0', fontWeight: 500 }}>{r}</div>
            ))}
          </div>
        )}

        {/* Notes */}
        {patient.notes && (
          <div className="card">
            <p className="section-title">{t.notes}</p>
            <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.6 }}>{patient.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, padding: '3px 0' }}>
    <span style={{ fontSize: 13, color: '#64748B', fontWeight: 500 }}>{label}</span>
    <span style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', textAlign: 'right' }}>{value}</span>
  </div>
);

export const PatientsScreen: React.FC = () => {
  const { t, patients, setCurrentPatient } = useApp();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Patient | null>(null);

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(query.toLowerCase()) ||
    (p.abhaId?.includes(query) ?? false)
  );

  if (selected) {
    return (
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <PatientDetail patient={selected} onClose={() => setSelected(null)} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Search bar */}
      <div style={{ padding: '16px 20px', background: '#ffffff', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ position: 'relative' }}>
          <span style={{
            position: 'absolute', left: 14, top: '50%',
            transform: 'translateY(-50%)', color: '#94A3B8',
            pointerEvents: 'none',
          }}>
            <SearchIcon />
          </span>
          <input
            type="search"
            className="form-input"
            placeholder={t.searchPlaceholder}
            value={query}
            onChange={e => setQuery(e.target.value)}
            style={{ paddingLeft: 42 }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: '#94A3B8' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>कोणताही रुग्ण सापडला नाही</div>
          </div>
        ) : filtered.map(patient => (
          <button
            key={patient.id}
            type="button"
            className="patient-row"
            onClick={() => {
              setCurrentPatient(patient);
              setSelected(patient);
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
              {/* Avatar */}
              <div style={{
                width: 48, height: 48, borderRadius: 14,
                background: '#F0FDFA', border: '1px solid #CCFBF1', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20,
              }}>
                {patient.sex === 'Female' ? '👩' : '👨'}
              </div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 15, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {patient.name}
                </div>
                <div style={{ fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: 500 }}>
                  {patient.age} वर्षे · {patient.village}
                  {patient.abhaId ? ` · ${patient.abhaId}` : ''}
                </div>
                <div style={{ marginTop: 6 }}>
                  <UrgencyBadge urgency={patient.lastTriage} />
                </div>
              </div>
            </div>
            <ChevronRightIcon />
          </button>
        ))}
      </div>
    </div>
  );
};
