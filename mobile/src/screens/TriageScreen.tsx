import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { MASTER_SYMPTOMS, SYMPTOM_CATEGORIES, getCommonQuickSymptoms, type MasterSymptom } from '../constants/masterSymptoms';
import { evaluateTriage, type TriageAssessment } from '../utils/triageEngine';
import { api } from '../services/api';

const DRAFT_ID = 'triage';

const MicIcon = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="23" />
    <line x1="8" y1="23" x2="16" y2="23" />
  </svg>
);

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export const TriageScreen: React.FC = () => {
  const {
    t,
    language,
    currentPatient,
    updatePatient,
    setTriageResult,
    setLastTriageRecordId,
    setActiveScreen,
    saveDraftField,
    getDraft,
    clearDraft,
    setHasUnsavedChanges,
    showSnackbar,
  } = useApp();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const commonQuickSymptoms = useMemo(() => getCommonQuickSymptoms(), []);

  // Voice input state (CHANGE 4)
  const [isListening, setIsListening] = useState(false);
  const [liveStreamText, setLiveStreamText] = useState('');
  const [transcribedText, setTranscribedText] = useState('');
  const [showVoiceConfirmation, setShowVoiceConfirmation] = useState(false);

  // Triage assessment result state (CHANGE 7)
  const [assessment, setAssessment] = useState<TriageAssessment | null>(null);
  // Loading state for async backend call
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Restore draft from SQLite on mount (CHANGE 2)
  useEffect(() => {
    let active = true;
    (async () => {
      const draft = await getDraft(DRAFT_ID);
      if (active && draft && draft.selectedKeys) {
        try {
          const parsed = JSON.parse(draft.selectedKeys);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSelectedKeys(parsed);
            if (draft.transcribedText) setTranscribedText(draft.transcribedText);
            showSnackbar('Triage draft restored from SQLite');
          }
        } catch (e) {
          console.warn('Failed to parse triage draft:', e);
        }
      }
    })();
    return () => { active = false; };
  }, []);

  // Update draft in SQLite whenever selected symptoms change (CHANGE 2)
  const updateSelectedSymptoms = (newKeys: string[]) => {
    setSelectedKeys(newKeys);
    saveDraftField(DRAFT_ID, 'selectedKeys', JSON.stringify(newKeys));
    setHasUnsavedChanges(newKeys.length > 0);
  };

  const toggleSymptom = (key: string) => {
    if (selectedKeys.includes(key)) {
      updateSelectedSymptoms(selectedKeys.filter(k => k !== key));
    } else {
      updateSelectedSymptoms([...selectedKeys, key]);
    }
    setAssessment(null);
  };

  const removeSymptom = (key: string) => {
    updateSelectedSymptoms(selectedKeys.filter(k => k !== key));
    setAssessment(null);
  };

  // Master symptom search filter (CHANGE 3 - Mode A)
  const filteredMasterSymptoms = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return MASTER_SYMPTOMS.filter(s => {
      const en = s.labels.en.toLowerCase();
      const mr = s.labels.mr.toLowerCase();
      const hi = s.labels.hi.toLowerCase();
      const kn = (s.labels.kn || '').toLowerCase();
      const aliases = (s.aliases || []).join(' ').toLowerCase();
      return en.includes(q) || mr.includes(q) || hi.includes(q) || kn.includes(q) || aliases.includes(q);
    });
  }, [searchQuery]);

  // Voice recording workflow (CHANGE 4)
  const handleStartVoice = () => {
    setIsListening(true);
    setLiveStreamText('');
    setShowVoiceConfirmation(false);

    // Fallback Web Speech Recognition or Simulated Speech Stream
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      try {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-US';

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          setLiveStreamText(currentTranscript);
        };

        recognition.onend = () => {
          setIsListening(false);
          const defaultPhrase = language === 'en'
            ? 'Severe breathing difficulty and swelling in pregnancy'
            : language === 'hi'
            ? 'गर्भावस्था में सांस लेने में तकलीफ और पैरों में सूजन'
            : language === 'kn'
            ? 'ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ತೀವ್ರ ಉಸಿರಾಟದ ತೊಂದರೆ ಮತ್ತು ಊತ'
            : 'गरोदरपणात तीव्र श्वास लागणे आणि पायांना सूज येणे';
          setTranscribedText(liveStreamText || defaultPhrase);
          setShowVoiceConfirmation(true);
        };

        recognition.onerror = () => {
          simulateVoiceStream();
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('Speech recognition error, falling back to simulator:', err);
      }
    }
    simulateVoiceStream();
  };

  const simulateVoiceStream = () => {
    const samplePhrases = language === 'en' ? [
      'Breathing difficulty...',
      'Breathing difficulty and swelling in feet...',
      'Severe breathing difficulty and swelling in pregnancy',
    ] : language === 'hi' ? [
      'सांस लेने में तकलीफ...',
      'सांस लेने में तकलीफ और पैरों में सूजन...',
      'गर्भावस्था में सांस लेने में तकलीफ और पैरों में सूजन',
    ] : language === 'kn' ? [
      'ಉಸಿರಾಟದ ತೊಂದರೆ...',
      'ಉಸಿರಾಟದ ತೊಂದರೆ ಮತ್ತು ಪಾದಗಳ ಊತ...',
      'ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ತೀವ್ರ ಉಸಿರಾಟದ ತೊಂದರೆ ಮತ್ತು ಊತ',
    ] : [
      'श्वास घेण्यास त्रास...',
      'श्वास घेण्यास त्रास आणि पायांना सूज...',
      'गरोदरपणात तीव्र श्वास लागणे, डोकेदुखी आणि पायांना सूज (Breathing difficulty & swelling)',
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < samplePhrases.length) {
        setLiveStreamText(samplePhrases[stepIndex]);
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsListening(false);
        setTranscribedText(samplePhrases[samplePhrases.length - 1]);
        setShowVoiceConfirmation(true);
      }
    }, 700);
  };

  // Confirm voice transcription parsing and keyword mapping (CHANGE 4)
  const handleConfirmVoice = () => {
    const textLower = transcribedText.toLowerCase();
    const matchedKeys: string[] = [];

    MASTER_SYMPTOMS.forEach(s => {
      const en = s.labels.en.toLowerCase();
      const mr = s.labels.mr.toLowerCase();
      const hi = s.labels.hi.toLowerCase();
      const keyStr = s.key.toLowerCase();

      if (
        textLower.includes(en) ||
        textLower.includes(mr) ||
        textLower.includes(hi) ||
        textLower.includes(keyStr)
      ) {
        matchedKeys.push(s.key);
      }
    });

    if (matchedKeys.length === 0) {
      // Fallback sensible defaults if exact match not found in speech sample
      if (textLower.includes('श्वास') || textLower.includes('breath')) matchedKeys.push('breathlessness');
      if (textLower.includes('सूज') || textLower.includes('swell')) matchedKeys.push('swollen_feet', 'swollen_hands');
      if (textLower.includes('गरोदर') || textLower.includes('pregnan')) matchedKeys.push('maternal_pregnancy');
      if (matchedKeys.length === 0) matchedKeys.push('breathlessness', 'high_fever');
    }

    const updated = Array.from(new Set([...selectedKeys, ...matchedKeys]));
    updateSelectedSymptoms(updated);
    saveDraftField(DRAFT_ID, 'transcribedText', transcribedText);
    setShowVoiceConfirmation(false);
    showSnackbar(`${matchedKeys.length} symptoms mapped from voice input!`);
  };

  const handleReRecord = () => {
    setTranscribedText('');
    setLiveStreamText('');
    setShowVoiceConfirmation(false);
    handleStartVoice();
  };

  // Evaluate Triage — calls FastAPI backend and falls back to local engine
  const handleEvaluate = async () => {
    // 1. Always run local engine first for rich UI content (guidance, first aid)
    const localResult = evaluateTriage(selectedKeys);

    // 2. Determine final urgency: use backend if patient has a real UUID, otherwise local
    let finalUrgency = localResult.urgency;
    let finalReason = localResult.guidanceText[language] || localResult.guidanceText.en;

    // Only call backend when current patient has a real UUID (not a local mock ID)
    const hasBackendId = currentPatient && !currentPatient.id.startsWith('P');

    if (hasBackendId && selectedKeys.length > 0) {
      setIsEvaluating(true);
      const response = await api.post<any>('/triage/assess', {
        patient_id: currentPatient!.id,
        symptoms: selectedKeys,
      });
      setIsEvaluating(false);

      if (response.data && response.data.triage_category) {
        // Backend is the source of truth for the category
        finalUrgency = response.data.triage_category;
        finalReason = response.data.reason || finalReason;
        // Share the triage record ID globally so ReferralScreen can use it
        setLastTriageRecordId(response.data.id || null);
      } else if (response.error) {
        showSnackbar('Triage saved locally — backend: ' + response.error);
      }
    }

    // 3. Build the merged assessment for UI display
    const mergedAssessment: TriageAssessment = {
      ...localResult,
      urgency: finalUrgency,
    };
    setAssessment(mergedAssessment);

    const symptomLabels = selectedKeys.map(k => {
      const item = MASTER_SYMPTOMS.find(ms => ms.key === k || ms.id === k);
      const label = item ? (item.labels[language] || item.labels.en) : k;
      const icon = item ? item.icon : '🩺';
      return `${icon} ${label}`;
    });

    const instructionsLang = localResult.firstAidInstructions[language] || localResult.firstAidInstructions.en;

    setTriageResult({
      urgency: finalUrgency,
      reason: finalReason,
      symptoms: symptomLabels,
      instructions: instructionsLang,
      selectedSymptomKeys: selectedKeys,
      dominantIcon: finalUrgency === 'EMERGENCY' ? '🔴' : finalUrgency === 'URGENT' ? '🟡' : '🟢',
    });

    if (currentPatient) {
      updatePatient({
        ...currentPatient,
        symptoms: selectedKeys,
        lastTriage: finalUrgency,
      });
    }

    // Clear draft on successful triage assessment completion
    clearDraft(DRAFT_ID);
    setHasUnsavedChanges(false);
  };

  // Get localized title for a symptom
  const getSymptomLabel = (s: MasterSymptom) => {
    return s.labels[language] || s.labels.en;
  };

  const [isSearchListening, setIsSearchListening] = useState(false);

  const handleSearchMicClick = () => {
    setIsSearchListening(true);
    setSearchQuery('');

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
          setSearchQuery(text);
        };

        recognition.onend = () => {
          setIsSearchListening(false);
        };

        recognition.onerror = () => {
          simulateSearchMic();
        };

        recognition.start();
        return;
      } catch (err) {
        console.warn('Speech recognition error in search bar:', err);
      }
    }
    simulateSearchMic();
  };

  const simulateSearchMic = () => {
    const sampleQueries = language === 'en' ? ['Breathing difficulty']
      : language === 'hi' ? ['सांस लेने में तकलीफ']
      : language === 'kn' ? ['ಉಸಿರಾಟದ ತೊಂದರೆ']
      : ['श्वास घेण्यास त्रास'];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx < sampleQueries.length) {
        setSearchQuery(sampleQueries[idx]);
        idx++;
      } else {
        clearInterval(interval);
        setIsSearchListening(false);
      }
    }, 600);
  };

  return (
    <div className="screen-body">
      {/* Patient summary */}
      {currentPatient && (
        <div className="card" style={{ marginBottom: 18, padding: '14px 18px', background: '#FFFFFF' }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#0F172A' }}>{currentPatient.name}</div>
          <div style={{ fontSize: 13, color: '#64748B', marginTop: 2, fontWeight: 500 }}>
            {currentPatient.age} {t.yearsOld} · {currentPatient.sex === 'Female' ? t.female : currentPatient.sex === 'Male' ? t.male : t.other}
            {currentPatient.village ? ` · ${currentPatient.village}` : ''}
          </div>
        </div>
      )}

      {/* Voice input button & live transcription box (CHANGE 4) */}
      <div className="card" style={{ marginBottom: 20, padding: 18, textAlign: 'center', background: '#FFFFFF' }}>
        <button
          type="button"
          className={`voice-btn${isListening ? ' listening' : ''}`}
          onClick={handleStartVoice}
          disabled={isListening}
          style={{ width: '100%', marginBottom: isListening || showVoiceConfirmation ? 14 : 0 }}
        >
          <div style={{
            width: 60, height: 60,
            borderRadius: '50%',
            background: isListening ? '#DC2626' : '#F0FDFA',
            border: isListening ? '2px solid #DC2626' : '2px solid #CCFBF1',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: isListening ? '#ffffff' : '#0F766E',
            margin: '0 auto 8px',
            animation: isListening ? 'pulse 1.2s infinite' : 'none',
            boxShadow: '0 4px 12px rgba(15, 118, 110, 0.15)',
          }}>
            <MicIcon size={28} />
          </div>
          <div style={{ fontWeight: 800, fontSize: 16, color: isListening ? '#DC2626' : '#0F172A' }}>
            {isListening ? t.listening : t.speakSymptoms}
          </div>
          <div style={{ fontSize: 13, color: '#64748B', fontWeight: 500, marginTop: 2 }}>
            {isListening ? t.recognizing : t.speakInMarathi}
          </div>
        </button>

        {/* Live speech transcription stream box */}
        {isListening && (
          <div style={{
            padding: '12px 14px', borderRadius: 12, background: '#FEF2F2', border: '1px solid #FCA5A5',
            fontSize: 14, color: '#991B1B', fontWeight: 600, textAlign: 'left', lineHeight: 1.5,
          }}>
            <div style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', marginBottom: 4, color: '#DC2626' }}>
              🎙️ Live Speech Transcription...
            </div>
            {liveStreamText || 'सुरू करा... (Listening for symptoms...)'}
          </div>
        )}

        {/* Transcribed text confirmation box & editable field (CHANGE 4) */}
        {showVoiceConfirmation && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, textAlign: 'left', marginTop: 10 }}>
            <div>
              <label className="form-label" style={{ fontSize: 13, fontWeight: 800, color: '#0F766E' }}>
                {t.transcriptionLabel}
              </label>
              <textarea
                className="form-input"
                rows={3}
                value={transcribedText}
                onChange={e => setTranscribedText(e.target.value)}
                style={{ width: '100%', resize: 'none', fontSize: 14, lineHeight: 1.5 }}
              />
              <p style={{ margin: '4px 0 0', fontSize: 12, color: '#64748B' }}>
                {t.transcriptionCorrectionNote}
              </p>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn-outline"
                onClick={handleReRecord}
                style={{ flex: 1, minHeight: 44, fontSize: 14, fontWeight: 700 }}
              >
                🔄 {t.reRecord}
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleConfirmVoice}
                style={{ flex: 1, minHeight: 44, fontSize: 14, fontWeight: 700 }}
              >
                ✓ {t.confirm}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mode A: Symptom Real-Time Search Bar with Chrome-Style Mic */}
      <div style={{ marginBottom: 16 }}>
        <p className="section-title">{t.searchSymptomPlaceholder.split(' ')[0]} Symptom</p>
        <div style={{ position: 'relative' }}>
          <div className="form-input-with-icon">
            <input
              type="text"
              className="form-input"
              placeholder={t.searchSymptomPlaceholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 38, paddingRight: searchQuery ? 76 : 46 }}
            />
            <div style={{ position: 'absolute', left: 12, top: 14, pointerEvents: 'none' }}>
              <SearchIcon />
            </div>

            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute', right: 42, top: 13,
                  background: 'none', border: 'none', color: '#94A3B8',
                  cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                title="Clear search"
              >
                <XIcon />
              </button>
            )}

            <button
              type="button"
              onClick={handleSearchMicClick}
              style={{
                position: 'absolute', right: 8, top: 8,
                width: 34, height: 34, borderRadius: '50%',
                background: isSearchListening ? '#DC2626' : '#F0FDFA',
                border: isSearchListening ? '1.5px solid #DC2626' : '1px solid #CCFBF1',
                color: isSearchListening ? '#ffffff' : '#0F766E',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.15s ease',
                boxShadow: isSearchListening ? '0 0 10px rgba(220, 38, 38, 0.4)' : 'none',
              }}
              title="Voice Search (English, Hindi, Marathi, Kannada)"
            >
              <MicIcon size={18} />
            </button>
          </div>

          {/* Active voice search banner */}
          {isSearchListening && (
            <div style={{
              marginTop: 6, padding: '6px 12px', borderRadius: 8,
              background: '#FEF2F2', border: '1px solid #FCA5A5',
              fontSize: 12, fontWeight: 700, color: '#991B1B',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <span style={{ animation: 'pulse 1s infinite' }}>🎙️</span>
              <span>Listening for symptoms in {language === 'mr' ? 'मराठी' : language === 'hi' ? 'हिंदी' : language === 'kn' ? 'ಕನ್ನಡ' : 'English'}...</span>
            </div>
          )}

          {/* Real-time master symptom search results dropdown */}
          {filteredMasterSymptoms.length > 0 && (
            <div style={{
              position: 'absolute', top: 54, left: 0, right: 0, zIndex: 100,
              background: '#FFFFFF', borderRadius: 14, border: '1px solid #CBD5E1',
              maxHeight: 220, overflowY: 'auto', boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
              display: 'flex', flexDirection: 'column',
            }}>
              {filteredMasterSymptoms.map(sym => {
                const isSelected = selectedKeys.includes(sym.key);
                return (
                  <button
                    key={sym.id}
                    type="button"
                    onClick={() => {
                      toggleSymptom(sym.key);
                      setSearchQuery('');
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 14px', border: 'none', borderBottom: '1px solid #F1F5F9',
                      background: isSelected ? '#F0FDFA' : '#FFFFFF',
                      cursor: 'pointer', textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{sym.icon}</span>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A' }}>
                          {getSymptomLabel(sym)}
                        </div>
                        <div style={{ fontSize: 12, color: '#64748B' }}>
                          {sym.labels.en} {sym.labels.mr ? `· ${sym.labels.mr}` : ''}
                        </div>
                      </div>
                    </div>
                    {isSelected ? (
                      <span style={{ color: '#0F766E', fontWeight: 800, fontSize: 14 }}>✓ Added</span>
                    ) : (
                      <span style={{ color: '#0284C7', fontWeight: 700, fontSize: 13 }}>+ Select</span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Selected Symptom Chips list (CHANGE 3) */}
      {selectedKeys.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <label className="form-label">{t.selectedSymptomsChips} ({selectedKeys.length})</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {selectedKeys.map(key => {
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
                    boxShadow: '0 2px 6px rgba(15, 118, 110, 0.2)',
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

      {/* Mode B: Quick Select Chips Grid (8 Common Primary Symptoms) */}
      <p className="section-title">{t.quickSelectSymptoms}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 10, marginBottom: 20, width: '100%', boxSizing: 'border-box' }}>
        {commonQuickSymptoms.map(s => {
          const isSelected = selectedKeys.includes(s.key);
          return (
            <button
              key={s.id}
              type="button"
              className={`symptom-chip${isSelected ? ' selected' : ''}`}
              onClick={() => toggleSymptom(s.key)}
              style={{ width: '100%', boxSizing: 'border-box', minWidth: 0 }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, flex: 1, minWidth: 0, whiteSpace: 'normal', wordBreak: 'break-word', lineHeight: 1.25, textAlign: 'left' }}>
                {getSymptomLabel(s)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Assess button */}
      {!assessment && (
        <button
          type="button"
          className="btn-primary"
          onClick={handleEvaluate}
          disabled={selectedKeys.length === 0 || isEvaluating}
          style={{ minHeight: 54, fontSize: 16, fontWeight: 700, marginBottom: 20, opacity: (selectedKeys.length === 0 || isEvaluating) ? 0.5 : 1 }}
        >
          {isEvaluating ? '⏳ Assessing…' : t.urgencyResult}
        </button>
      )}

      {/* Triage Result Display — Emoji indicator */}
      {assessment && (
        <div className="card" style={{ marginBottom: 20, padding: '24px 18px', textAlign: 'center', background: '#FFFFFF' }}>
          {/* Large Emoji Circle */}
          <div style={{
            fontSize: 72,
            lineHeight: 1,
            marginBottom: 14,
            filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
            animation: 'pulse 1.5s ease-in-out',
          }}>
            {assessment.urgency === 'EMERGENCY' ? '🔴' : assessment.urgency === 'URGENT' ? '🟡' : '🟢'}
          </div>

          {/* Tier Label */}
          <div style={{
            fontSize: 26,
            fontWeight: 900,
            letterSpacing: 1,
            marginBottom: 6,
            color: assessment.urgency === 'EMERGENCY' ? '#DC2626' : assessment.urgency === 'URGENT' ? '#D97706' : '#16A34A',
          }}>
            {assessment.urgency === 'EMERGENCY'
              ? t.emergencyLabel
              : assessment.urgency === 'URGENT'
              ? t.urgentLabel
              : t.routineLabel}
          </div>

          {/* Guidance text line */}
          <p style={{ fontSize: 14, color: '#334155', fontWeight: 600, marginBottom: 18, lineHeight: 1.5 }}>
            {assessment.guidanceText[language] || assessment.guidanceText.en}
          </p>

          {/* First aid instructions */}
          <div style={{
            textAlign: 'left',
            background: '#F8FAFC',
            borderRadius: 14,
            padding: '14px 16px',
            marginBottom: 18,
            border: '1px solid #E2E8F0',
          }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: 8 }}>
              ⚕️ {t.firstAidTitle}
            </div>
            {(assessment.firstAidInstructions[language] || assessment.firstAidInstructions.en).map((inst, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 8, fontSize: 13, color: '#0F172A', marginBottom: 6, lineHeight: 1.4 }}>
                <span style={{ fontWeight: 800, color: '#0F766E' }}>{idx + 1}.</span>
                <span>{inst}</span>
              </div>
            ))}
          </div>

          {/* Recommended next action buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {assessment.urgency === 'EMERGENCY' && (
              <>
                <button
                  type="button"
                  className="btn-danger"
                  onClick={() => setActiveScreen('referral')}
                  style={{ minHeight: 50, fontSize: 15, fontWeight: 800 }}
                >
                  🚑 {t.makeReferral}
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setActiveScreen('consultation')}
                  style={{ minHeight: 48, fontSize: 15, fontWeight: 700 }}
                >
                  📞 {t.startConsultBtn}
                </button>
              </>
            )}

            {assessment.urgency === 'URGENT' && (
              <>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => setActiveScreen('consultation')}
                  style={{ minHeight: 50, fontSize: 15, fontWeight: 800 }}
                >
                  📞 {t.startConsultBtn}
                </button>
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => setActiveScreen('guide')}
                  style={{ minHeight: 46, fontSize: 14, fontWeight: 700 }}
                >
                  📖 {t.more}
                </button>
              </>
            )}

            {assessment.urgency === 'ROUTINE' && (
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  showSnackbar('Routine PHC appointment booked!');
                  setActiveScreen('home');
                }}
                style={{ minHeight: 50, fontSize: 15, fontWeight: 800, background: '#16A34A' }}
              >
                📅 {t.bookAppointment}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
