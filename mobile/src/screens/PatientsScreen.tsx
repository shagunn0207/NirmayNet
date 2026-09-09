import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import type { Patient } from '../types';
import { getLocalizedPatient } from '../utils/localizePatient';
import { MASTER_SYMPTOMS, getCommonQuickSymptoms, type MasterSymptom } from '../constants/masterSymptoms';
import { evaluateTriage } from '../utils/triageEngine';


const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const MicIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const UrgencyBadge = ({ urgency, symptoms }: { urgency?: string; symptoms?: string[] }) => {
  const { t } = useApp();
  const effectiveUrgency = urgency || (symptoms && symptoms.length > 0 ? evaluateTriage(symptoms).urgency : 'ROUTINE');

  const config = {
    EMERGENCY: { bg: '#FEF2F2', color: '#DC2626', border: '#FCA5A5', label: t.emergencyLabel },
    URGENT:    { bg: '#FFFBEB', color: '#D97706', border: '#FDE68A', label: t.urgentLabel },
    ROUTINE:   { bg: '#F0FDF4', color: '#16A34A', border: '#BBF7D0', label: t.routineLabel },
  }[effectiveUrgency] ?? { bg: '#F8FAFC', color: '#64748B', border: '#E2E8F0', label: effectiveUrgency };

  return (
    <span style={{
      padding: '3px 10px', borderRadius: 9999,
      background: config.bg, color: config.color, border: `1px solid ${config.border}`,
      fontSize: 12, fontWeight: 800, letterSpacing: 0.2, display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      <span>{effectiveUrgency === 'EMERGENCY' ? '🔴' : effectiveUrgency === 'URGENT' ? '🟡' : '🟢'}</span>
      <span>{config.label}</span>
    </span>
  );
};

const PatientDetail: React.FC<{ patient: Patient; onClose: () => void }> = ({ patient: rawPatient, onClose }) => {
  const { t, language, updatePatient, showSnackbar, addFollowup, isFollowup, setActiveScreen, setActiveTab } = useApp();
  const patient = getLocalizedPatient(rawPatient, language);

  const [isEditing, setIsEditing] = useState(false);

  // Edit form states
  const [editName, setEditName] = useState(rawPatient.name);
  const [editAge, setEditAge] = useState(rawPatient.age);
  const [editSex, setEditSex] = useState<'Female' | 'Male' | 'Other'>(rawPatient.sex);
  const [editVillage, setEditVillage] = useState(rawPatient.village);
  const [editPhone, setEditPhone] = useState(rawPatient.phone);
  const [editAbha, setEditAbha] = useState(rawPatient.abhaId || '');
  const [editAllergies, setEditAllergies] = useState(rawPatient.allergies || '');
  const [editSymptoms, setEditSymptoms] = useState<string[]>(rawPatient.symptoms || []);
  const [editNotes, setEditNotes] = useState(rawPatient.notes || '');
  const [symptomSearch, setSymptomSearch] = useState('');

  // Triage status evaluated for current symptoms
  const effectiveUrgency = rawPatient.lastTriage || (rawPatient.symptoms && rawPatient.symptoms.length > 0 ? evaluateTriage(rawPatient.symptoms).urgency : 'ROUTINE');
  const triageDetails = useMemo(() => evaluateTriage(rawPatient.symptoms || []), [rawPatient.symptoms]);

  const filteredMasterSymptoms = useMemo(() => {
    if (!symptomSearch.trim()) return [];
    const q = symptomSearch.toLowerCase().trim();
    return MASTER_SYMPTOMS.filter(s => {
      const en = s.labels.en.toLowerCase();
      const mr = s.labels.mr.toLowerCase();
      const hi = s.labels.hi.toLowerCase();
      const kn = (s.labels.kn || '').toLowerCase();
      const aliases = (s.aliases || []).join(' ').toLowerCase();
      return en.includes(q) || mr.includes(q) || hi.includes(q) || kn.includes(q) || aliases.includes(q);
    });
  }, [symptomSearch]);

  const toggleSymptom = (key: string) => {
    if (editSymptoms.includes(key)) {
      setEditSymptoms(editSymptoms.filter(k => k !== key));
    } else {
      setEditSymptoms([...editSymptoms, key]);
    }
  };

  const removeSymptom = (key: string) => {
    setEditSymptoms(editSymptoms.filter(k => k !== key));
  };

  const handleSave = () => {
    if (!editName.trim()) {
      showSnackbar(t.invalidNameError);
      return;
    }

    const newTriage = evaluateTriage(editSymptoms).urgency;

    const updated: Patient = {
      ...rawPatient,
      name: editName.trim(),
      age: editAge,
      sex: editSex,
      village: editVillage.trim(),
      phone: editPhone.trim(),
      abhaId: editAbha.trim(),
      allergies: editAllergies.trim() || undefined,
      symptoms: editSymptoms,
      notes: editNotes.trim(),
      lastTriage: newTriage,
    };

    updatePatient(updated);
    showSnackbar(t.patientUpdatedSnackbar || 'Patient updated successfully');
    setIsEditing(false);
  };

  const getSymptomLabel = (s: MasterSymptom) => {
    return s.labels[language] || s.labels.en;
  };

  return (
    <div style={{ position: 'absolute', top: -64, left: 0, right: 0, bottom: 0, zIndex: 300, background: '#F8FAFC', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)', color: '#ffffff',
        padding: '0 16px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        boxShadow: '0 4px 14px rgba(15, 118, 110, 0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', flexShrink: 0,
            }}
            title={t.back}
          >
            <ChevronLeftIcon />
          </button>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontWeight: 800, fontSize: 17, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isEditing ? t.editPatientTitle : patient.name}
            </div>
            {!isEditing && (
              <div style={{ fontSize: 12, opacity: 0.9, fontWeight: 500 }}>
                {patient.age} {t.yearsOld} · {patient.sex === 'Female' ? t.female : patient.sex === 'Male' ? t.male : t.other}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {!isEditing ? (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)', border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#ffffff', padding: '6px 12px', borderRadius: 10,
                fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6,
                cursor: 'pointer',
              }}
            >
              <EditIcon />
              <span>{t.edit}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{
                background: 'rgba(255, 255, 255, 0.2)', border: 'none',
                color: '#ffffff', padding: '6px 12px', borderRadius: 10,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}
            >
              {t.cancel}
            </button>
          )}

          <button type="button" className="btn-icon" style={{ color: '#ffffff' }} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 18, paddingBottom: 90, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {!isEditing ? (
          /* VIEW MODE */
          <>
            {/* Status Card (Current Status + Triage Guidance) */}
            <div className="card" style={{ borderLeft: `5px solid ${effectiveUrgency === 'EMERGENCY' ? '#EF4444' : effectiveUrgency === 'URGENT' ? '#F59E0B' : '#22C55E'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <p className="section-title" style={{ margin: 0 }}>{t.currentStatus}</p>
                <UrgencyBadge urgency={effectiveUrgency} symptoms={patient.symptoms} />
              </div>
              <p style={{ fontSize: 13, color: '#334155', fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
                {triageDetails.guidanceText[language] || triageDetails.guidanceText.en}
              </p>
            </div>

            {/* Basic Info */}
            <div className="card">
              <p className="section-title">{t.basicInfo}</p>
              <InfoRow label="ABHA ID" value={patient.abhaId ?? '—'} />
              <div className="divider" />
              <InfoRow label={t.village} value={patient.village} />
              <div className="divider" />
              <InfoRow label={t.mobileLabel} value={patient.phone} />
              <div className="divider" />
              <InfoRow label={t.allergiesLabel} value={patient.allergies ? `⚠️ ${patient.allergies}` : 'None'} />
              <div className="divider" />
              <InfoRow label={t.registrationDate} value={patient.registrationDate} />
              <div className="divider" />
              <InfoRow label={t.lastVisitLabel} value={patient.lastVisit ?? '—'} />
            </div>

            {/* Symptoms Card */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <p className="section-title" style={{ margin: 0 }}>{t.symptoms}</p>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  style={{ background: 'none', border: 'none', color: '#0F766E', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}
                >
                  ✏️ {t.editSymptomsLabel}
                </button>
              </div>

              {patient.symptoms && patient.symptoms.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {patient.symptoms.map(s => {
                    const master = MASTER_SYMPTOMS.find(ms => ms.key === s || ms.id === s);
                    const label = master ? (master.labels[language] || master.labels.en) : s;
                    const icon = master ? master.icon : '🩺';
                    return (
                      <span key={s} style={{
                        padding: '6px 12px', background: '#F0FDFA',
                        border: '1px solid #CCFBF1', borderRadius: 10,
                        fontSize: 13, fontWeight: 700, color: '#0F766E',
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                      }}>
                        <span>{icon}</span>
                        <span>{label}</span>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: '#94A3B8', fontStyle: 'italic', fontWeight: 500 }}>
                  {t.noSymptomsRecorded}
                </div>
              )}
            </div>

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

            {/* Mark as Follow-up button */}
            {(() => {
              const alreadyFollowup = isFollowup(rawPatient.id);
              return (
                <button
                  type="button"
                  onClick={() => {
                    if (alreadyFollowup) {
                      // Navigate to followups screen
                      setActiveScreen('followups');
                      setActiveTab('followups');
                      onClose();
                    } else {
                      addFollowup(rawPatient);
                    }
                  }}
                  style={{
                    minHeight: 52, fontSize: 15, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    borderRadius: 14, cursor: 'pointer', fontFamily: 'inherit',
                    background: alreadyFollowup
                      ? 'linear-gradient(135deg, #0F766E 0%, #0D9488 100%)'
                      : '#F0FDFA',
                    color: alreadyFollowup ? '#ffffff' : '#0F766E',
                    border: alreadyFollowup ? 'none' : '1.5px solid #0F766E',
                    boxShadow: alreadyFollowup ? '0 4px 12px rgba(15, 118, 110, 0.3)' : 'none',
                    marginTop: 4,
                  } as React.CSSProperties}
                >
                  {alreadyFollowup ? '✅ In Follow-ups — Tap to View' : '📋 Mark as Follow-up'}
                </button>
              );
            })()}

            {/* Edit Patient & Symptoms Action Button */}
            <button
              type="button"
              className="btn-outline"
              onClick={() => setIsEditing(true)}
              style={{ minHeight: 48, fontSize: 15, fontWeight: 700, marginTop: 2 }}
            >
              ✏️ {t.editPatientTitle}
            </button>
          </>
        ) : (
          /* EDIT MODE */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ padding: 18 }}>
              <p className="section-title" style={{ marginBottom: 14 }}>👤 {t.basicInfo}</p>

              {/* Name */}
              <div style={{ marginBottom: 14 }}>
                <label className="form-label">{t.patientName} *</label>
                <input
                  type="text"
                  className="form-input"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
              </div>

              {/* Age & Sex */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, marginBottom: 14 }}>
                <div>
                  <label className="form-label">{t.age}</label>
                  <input
                    type="number"
                    className="form-input"
                    value={editAge}
                    onChange={e => setEditAge(parseInt(e.target.value, 10) || 0)}
                  />
                </div>
                <div>
                  <label className="form-label">{t.sex}</label>
                  <select
                    className="form-input"
                    value={editSex}
                    onChange={e => setEditSex(e.target.value as any)}
                  >
                    <option value="Female">{t.female}</option>
                    <option value="Male">{t.male}</option>
                    <option value="Other">{t.other}</option>
                  </select>
                </div>
              </div>

              {/* Village */}
              <div style={{ marginBottom: 14 }}>
                <label className="form-label">{t.village}</label>
                <input
                  type="text"
                  className="form-input"
                  value={editVillage}
                  onChange={e => setEditVillage(e.target.value)}
                />
              </div>

              {/* Mobile Phone */}
              <div style={{ marginBottom: 14 }}>
                <label className="form-label">{t.familyContact}</label>
                <input
                  type="tel"
                  className="form-input"
                  value={editPhone}
                  onChange={e => setEditPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                />
              </div>

              {/* ABHA ID */}
              <div style={{ marginBottom: 14 }}>
                <label className="form-label">{t.abhaId}</label>
                <input
                  type="text"
                  className="form-input"
                  value={editAbha}
                  onChange={e => setEditAbha(e.target.value)}
                />
              </div>

              {/* Known Allergies */}
              <div>
                <label className="form-label">⚠️ {t.allergiesLabel}</label>
                <input
                  type="text"
                  className="form-input"
                  value={editAllergies}
                  onChange={e => setEditAllergies(e.target.value)}
                  placeholder={t.allergiesPlaceholder}
                />
              </div>
            </div>

            {/* EDIT SYMPTOMS SECTION */}
            <div className="card" style={{ padding: 18 }}>
              <p className="section-title" style={{ marginBottom: 12 }}>🩺 {t.editSymptomsLabel}</p>

              {/* Active Selected Symptom Chips */}
              {editSymptoms.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <label className="form-label">{t.selectedSymptomsChips} ({editSymptoms.length})</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {editSymptoms.map(key => {
                      const master = MASTER_SYMPTOMS.find(ms => ms.key === key || ms.id === key);
                      const label = master ? getSymptomLabel(master) : key;
                      const icon = master ? master.icon : '🩺';
                      return (
                        <div
                          key={key}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '6px 12px', borderRadius: 9999,
                            background: '#0F766E', color: '#FFFFFF',
                            fontSize: 13, fontWeight: 700,
                          }}
                        >
                          <span>{icon}</span>
                          <span>{label}</span>
                          <button
                            type="button"
                            onClick={() => removeSymptom(key)}
                            style={{
                              background: 'rgba(255,255,255,0.25)', border: 'none', borderRadius: '50%',
                              width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: '#ffffff', cursor: 'pointer', marginLeft: 2, padding: 0,
                            }}
                          >
                            <XIcon />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Symptom Search Bar */}
              <div style={{ position: 'relative', marginBottom: 14 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder={t.searchSymptomPlaceholder}
                  value={symptomSearch}
                  onChange={e => setSymptomSearch(e.target.value)}
                  style={{ paddingLeft: 36 }}
                />
                <div style={{ position: 'absolute', left: 12, top: 14, pointerEvents: 'none' }}>
                  <SearchIcon />
                </div>

                {filteredMasterSymptoms.length > 0 && (
                  <div style={{
                    position: 'absolute', top: 52, left: 0, right: 0, zIndex: 100,
                    background: '#FFFFFF', borderRadius: 14, border: '1px solid #CBD5E1',
                    maxHeight: 200, overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  }}>
                    {filteredMasterSymptoms.map(sym => {
                      const isSel = editSymptoms.includes(sym.key);
                      return (
                        <button
                          key={sym.id}
                          type="button"
                          onClick={() => {
                            toggleSymptom(sym.key);
                            setSymptomSearch('');
                          }}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 14px', border: 'none', borderBottom: '1px solid #F1F5F9',
                            width: '100%', background: isSel ? '#F0FDFA' : '#FFFFFF', cursor: 'pointer', textAlign: 'left',
                          }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 700, color: '#0F172A' }}>
                            {sym.icon} {getSymptomLabel(sym)}
                          </span>
                          <span style={{ fontSize: 12, color: isSel ? '#0F766E' : '#0284C7', fontWeight: 800 }}>
                            {isSel ? '✓ Added' : '+ Add'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Select Symptoms Grid */}
              <label className="form-label">{t.quickSelectSymptoms}</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8, width: '100%', boxSizing: 'border-box' }}>
                {getCommonQuickSymptoms().map(s => {
                  const isSel = editSymptoms.includes(s.key);
                  return (
                    <button
                      key={s.id}
                      type="button"
                      className={`symptom-chip${isSel ? ' selected' : ''}`}
                      onClick={() => toggleSymptom(s.key)}
                      style={{ padding: '8px 10px', width: '100%', boxSizing: 'border-box', minWidth: 0 }}
                    >
                      <span style={{ flexShrink: 0, fontSize: 16 }}>{s.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, flex: 1, minWidth: 0, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.25, textAlign: 'left' }}>
                        {getSymptomLabel(s)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* EDIT NOTES */}
            <div className="card" style={{ padding: 18 }}>
              <p className="section-title" style={{ marginBottom: 8 }}>📝 {t.notes}</p>
              <textarea
                className="form-input"
                rows={3}
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                style={{ width: '100%', resize: 'none' }}
              />
            </div>

            {/* Save / Cancel Buttons */}
            <div style={{ display: 'flex', gap: 10, marginTop: 6, marginBottom: 20 }}>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setIsEditing(false)}
                style={{ flex: 1, minHeight: 50, fontSize: 15, fontWeight: 700 }}
              >
                {t.cancel}
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleSave}
                style={{ flex: 2, minHeight: 50, fontSize: 15, fontWeight: 800 }}
              >
                ✓ {t.updatePatientBtn}
              </button>
            </div>
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

import { api } from '../services/api';

export const PatientsScreen: React.FC = () => {
  const { t, language, patients, setPatients, setCurrentPatient, networkStatus, showSnackbar } = useApp();
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    let active = true;
    const fetchPatients = async () => {
      if (networkStatus === 'offline') return;
      setLoading(true);
      const res = await api.get<any[]>('/patients/');
      if (active) {
        setLoading(false);
        if (res.error) {
          showSnackbar('Error fetching patients: ' + res.error);
        } else if (res.data) {
          // Map backend patients to frontend Patient type
          const backendPatients: Patient[] = res.data.map(p => ({
            id: p.id,
            name: p.name,
            age: p.age,
            sex: p.gender as any,
            abhaId: p.abha_id || undefined,
            village: p.village,
            phone: p.phone || '',
            registrationDate: p.created_at ? p.created_at.split('T')[0] : '',
            lastVisit: p.updated_at ? p.updated_at.split('T')[0] : 'Today',
            lastTriage: 'ROUTINE', // Backend doesn't return triage category in basic patient listing yet
            symptoms: [],
            consultations: [],
            referrals: [],
            notes: '',
          }));

          // Merge: keep local offline patients (IDs starting with 'P') and append backend patients
          setPatients(prev => {
            const localOnly = prev.filter(p => p.id.startsWith('P') && !['P001', 'P002', 'P003'].includes(p.id));
            return [...backendPatients, ...localOnly];
          });
        }
      }
    };
    fetchPatients();
    return () => { active = false; };
  }, [networkStatus]);

  const handleMicClick = () => {
    setIsListening(true);
    setQuery('');

    const speechLang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : language === 'kn' ? 'kn-IN' : 'en-IN';

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = speechLang;

        recognition.onresult = (event: any) => {
          let text = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            text += event.results[i][0].transcript;
          }
          setQuery(text);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = () => {
          simulatePatientMic();
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('Speech recognition error in patient search:', err);
      }
    }
    simulatePatientMic();
  };

  const simulatePatientMic = () => {
    const sample = language === 'en' ? 'Rekha Patil'
      : language === 'hi' ? 'रेखा पाटिल'
      : language === 'kn' ? 'ರೇಖಾ ಪಾಟೀಲ್'
      : 'रेखा पाटील';

    setQuery(sample);
    setIsListening(false);
  };

  const selected = patients.find(p => p.id === selectedId) || null;

  // Category filter state
  type SexFilter = 'all' | 'Male' | 'Female' | 'Other';
  type AgeFilter = 'all' | 'infant' | 'child' | 'adult' | 'middle' | 'senior';
  const [sexFilter, setSexFilter] = useState<SexFilter>('all');
  const [ageFilter, setAgeFilter] = useState<AgeFilter>('all');

  const getAgeGroup = (age: number): AgeFilter => {
    if (age <= 5) return 'infant';
    if (age <= 18) return 'child';
    if (age <= 45) return 'adult';
    if (age <= 55) return 'middle';
    return 'senior';
  };

  const ageGroups: { key: AgeFilter; label: string }[] = [
    { key: 'all', label: t.allPatients },
    { key: 'infant', label: t.ageInfant },
    { key: 'child', label: t.ageChild },
    { key: 'adult', label: t.ageAdult },
    { key: 'middle', label: t.ageMiddleAged },
    { key: 'senior', label: t.ageSenior },
  ];

  const sexGroups: { key: SexFilter; icon: string; label: string }[] = [
    { key: 'all', icon: '👥', label: t.allPatients },
    { key: 'Female', icon: '👩', label: t.sexFemale },
    { key: 'Male', icon: '👨', label: t.sexMale },
    { key: 'Other', icon: '🧑', label: t.sexOther },
  ];

  const filtered = patients.filter(p => {
    const qLower = query.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(qLower) || (p.abhaId?.includes(query) ?? false) || p.village.toLowerCase().includes(qLower);
    const symptomMatch = p.symptoms?.some(s => s.toLowerCase().includes(qLower)) ?? false;
    const sexMatch = sexFilter === 'all' || p.sex === sexFilter;
    const ageMatch = ageFilter === 'all' || getAgeGroup(p.age) === ageFilter;
    return (nameMatch || symptomMatch) && sexMatch && ageMatch;
  });

  if (selected) {
    return (
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <PatientDetail patient={selected} onClose={() => setSelectedId(null)} />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
      {/* Search bar */}
      <div style={{ padding: '16px 20px 0', background: '#ffffff', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ position: 'relative', marginBottom: 12 }}>
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
            style={{ paddingLeft: 42, paddingRight: 48 }}
          />

          {/* Chrome-style Voice Search Mic button */}
          <button
            type="button"
            onClick={handleMicClick}
            style={{
              position: 'absolute', right: 8, top: 8,
              width: 34, height: 34, borderRadius: '50%',
              background: isListening ? '#DC2626' : '#F0FDFA',
              border: isListening ? '1.5px solid #DC2626' : '1px solid #CCFBF1',
              color: isListening ? '#ffffff' : '#0F766E',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', transition: 'all 0.15s ease',
              boxShadow: isListening ? '0 0 10px rgba(220, 38, 38, 0.4)' : 'none',
            }}
            title="Voice Search Patients & Symptoms"
          >
            <MicIcon size={18} />
          </button>
        </div>

        {/* Sex Filter Row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 10, overflowX: 'auto', scrollbarWidth: 'none' }}>
          {sexGroups.map(g => {
            const active = sexFilter === g.key;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setSexFilter(g.key)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 9999, whiteSpace: 'nowrap',
                  border: active ? '1.5px solid #0F766E' : '1px solid #E2E8F0',
                  background: active ? '#0F766E' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#475569',
                  fontWeight: active ? 800 : 600, fontSize: 13, cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span>{g.icon}</span><span>{g.label}</span>
              </button>
            );
          })}
        </div>

        {/* Age Group Filter Row */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
          {ageGroups.map(g => {
            const active = ageFilter === g.key;
            return (
              <button
                key={g.key}
                type="button"
                onClick={() => setAgeFilter(g.key)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '5px 12px', borderRadius: 9999, whiteSpace: 'nowrap',
                  border: active ? '1.5px solid #0D9488' : '1px solid #E2E8F0',
                  background: active ? '#0D9488' : '#FFFFFF',
                  color: active ? '#FFFFFF' : '#475569',
                  fontWeight: active ? 800 : 600, fontSize: 12, cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 16px', color: '#94A3B8' }}>
            <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{t.noPatientsFound}</div>
          </div>
        ) : filtered.map(patient => (
          <button
            key={patient.id}
            type="button"
            className="patient-row"
            onClick={() => {
              setCurrentPatient(patient);
              setSelectedId(patient.id);
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
                  {patient.age} {t.yearsOld} · {patient.village}
                  {patient.abhaId ? ` · ${patient.abhaId}` : ''}
                </div>
                <div style={{ marginTop: 6 }}>
                  <UrgencyBadge urgency={patient.lastTriage} symptoms={patient.symptoms} />
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
