import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { MASTER_SYMPTOMS, getCommonQuickSymptoms } from '../../constants/masterSymptoms';
import { evaluateTriage, type TriageAssessment } from '../../utils/triageEngine';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function TriageScreen() {
  const { t, language, user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const patient_id = params.patient_id as string;

  const [patient, setPatient] = useState<any>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [assessment, setAssessment] = useState<TriageAssessment | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (patient_id) {
      supabase.from('patients').select('*').eq('id', patient_id).single()
        .then(({ data }) => setPatient(data));
    }
  }, [patient_id]);

  const commonQuickSymptoms = useMemo(() => getCommonQuickSymptoms(), []);

  const toggleSymptom = (key: string) => {
    setSelectedKeys(prev => {
      if (prev.includes(key)) {
        return prev.filter(k => k !== key);
      }
      return [...prev, key];
    });
    setAssessment(null);
  };

  const removeSymptom = (key: string) => {
    setSelectedKeys(prev => prev.filter(k => k !== key));
    setAssessment(null);
  };

  const handleEvaluate = () => {
    const result = evaluateTriage(selectedKeys);
    setAssessment(result);
  };

  const getSymptomLabel = (s: any) => {
    return s.labels[language] || s.labels['en'] || s.key;
  };

  const handleAction = async (actionPath: string) => {
    if (!assessment || !user || !patient_id) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase.from('consultations').insert({
        patient_id,
        asha_id: user.id,
        symptoms: selectedKeys.join(','),
        triage_level: assessment.urgency,
        status: 'WAITING',
      }).select().single();
      
      if (error) throw error;
      
      router.push({ pathname: actionPath as any, params: { patient_id, consultation_id: data.id } });
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerCard}>
        {patient ? (
          <>
            <Text style={styles.patientName}>{patient.name}</Text>
            <Text style={styles.patientSub}>{patient.age} yrs • {patient.gender === 'F' ? 'Female' : patient.gender === 'M' ? 'Male' : 'Other'} • {patient.village}</Text>
          </>
        ) : (
          <ActivityIndicator color="#0F766E" />
        )}
      </View>

      {/* Voice input button - mock */}
      <View style={styles.voiceCard}>
        <TouchableOpacity style={styles.voiceBtn}>
          <View style={styles.voiceBtnIconWrap}>
            <FontAwesome5 name="microphone" size={24} color="#0F766E" />
          </View>
          <Text style={styles.voiceBtnText}>{t('speakSymptoms') || 'Speak Symptoms'}</Text>
          <Text style={styles.voiceBtnSub}>{t('speakInMarathi') || '(Supports English, Hindi, Marathi, Kannada)'}</Text>
        </TouchableOpacity>
      </View>

      {/* Selected Symptoms */}
      {selectedKeys.length > 0 && (
        <View style={styles.selectedSection}>
          <Text style={styles.sectionTitle}>{t('selectedSymptomsChips') || 'Selected Symptoms'} ({selectedKeys.length})</Text>
          <View style={styles.chipContainer}>
            {selectedKeys.map(key => {
              const master = MASTER_SYMPTOMS.find(ms => ms.key === key || ms.id === key);
              const label = master ? getSymptomLabel(master) : key;
              const icon = master ? master.icon : '🩺';

              return (
                <View key={key} style={styles.selectedChip}>
                  <Text style={styles.selectedChipText}>{icon} {label}</Text>
                  <TouchableOpacity style={styles.selectedChipClose} onPress={() => removeSymptom(key)}>
                    <FontAwesome5 name="times" size={10} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Quick Select Symptoms */}
      <View style={styles.quickSelectSection}>
        <Text style={styles.sectionTitle}>{t('quickSelectSymptoms') || 'Quick Select Symptoms'}</Text>
        <View style={styles.quickSelectGrid}>
          {commonQuickSymptoms.map(s => {
            const isSelected = selectedKeys.includes(s.key);
            return (
              <TouchableOpacity
                key={s.id}
                style={[styles.quickSelectBtn, isSelected && styles.quickSelectBtnActive]}
                onPress={() => toggleSymptom(s.key)}
              >
                <Text style={styles.quickSelectBtnIcon}>{s.icon}</Text>
                <Text style={[styles.quickSelectBtnText, isSelected && styles.quickSelectBtnTextActive]}>
                  {getSymptomLabel(s)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Assess Button */}
      {!assessment && (
        <TouchableOpacity
          style={[styles.assessBtn, selectedKeys.length === 0 && styles.assessBtnDisabled]}
          disabled={selectedKeys.length === 0}
          onPress={handleEvaluate}
        >
          <Text style={styles.assessBtnText}>{t('urgencyResult') || 'Assess Urgency'}</Text>
        </TouchableOpacity>
      )}

      {/* Assessment Result */}
      {assessment && (
        <View style={styles.assessmentCard}>
          <Text style={styles.emojiDisplay}>
            {assessment.urgency === 'EMERGENCY' ? '🔴' : assessment.urgency === 'URGENT' ? '🟡' : '🟢'}
          </Text>
          <Text style={[
            styles.urgencyTitle,
            { color: assessment.urgency === 'EMERGENCY' ? '#DC2626' : assessment.urgency === 'URGENT' ? '#D97706' : '#16A34A' }
          ]}>
            {assessment.urgency === 'EMERGENCY'
              ? (t('emergencyLabel') || 'EMERGENCY')
              : assessment.urgency === 'URGENT'
              ? (t('urgentLabel') || 'URGENT')
              : (t('routineLabel') || 'ROUTINE')}
          </Text>
          <Text style={styles.guidanceText}>
            {/* @ts-ignore */}
            {assessment.guidanceText[language as any] || assessment.guidanceText['en']}
          </Text>

          <View style={styles.firstAidBox}>
            <Text style={styles.firstAidTitle}>⚕️ {t('firstAidTitle') || 'First Aid Instructions'}</Text>
            {/* @ts-ignore */}
            {(assessment.firstAidInstructions[language as any] || assessment.firstAidInstructions['en']).map((inst: string, idx: number) => (
              <View key={idx} style={styles.instructionRow}>
                <Text style={styles.instructionNum}>{idx + 1}.</Text>
                <Text style={styles.instructionText}>{inst}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actionButtons}>
            {assessment.urgency === 'EMERGENCY' && (
              <>
                <TouchableOpacity style={styles.btnDanger} onPress={() => handleAction('/(asha)/referral')} disabled={isSaving}>
                  <Text style={styles.btnDangerText}>🚑 {isSaving ? 'Saving...' : (t('makeReferral') || 'Make Referral')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btnPrimary} onPress={() => handleAction('/(asha)/consultation')} disabled={isSaving}>
                  <Text style={styles.btnPrimaryText}>📞 {isSaving ? 'Saving...' : (t('startConsultBtn') || 'Start Consultation')}</Text>
                </TouchableOpacity>
              </>
            )}
            {assessment.urgency === 'URGENT' && (
              <>
                <TouchableOpacity style={styles.btnPrimary} onPress={() => handleAction('/(asha)/consultation')} disabled={isSaving}>
                  <Text style={styles.btnPrimaryText}>📞 {isSaving ? 'Saving...' : (t('startConsultBtn') || 'Start Consultation')}</Text>
                </TouchableOpacity>
              </>
            )}
            {assessment.urgency === 'ROUTINE' && (
              <TouchableOpacity style={styles.btnSuccess} onPress={() => handleAction('/(asha)/home')} disabled={isSaving}>
                <Text style={styles.btnSuccessText}>📅 {isSaving ? 'Saving...' : (t('bookAppointment') || 'Book Appointment')}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  patientSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
  voiceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  voiceBtn: {
    alignItems: 'center',
    width: '100%',
  },
  voiceBtnIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F0FDFA',
    borderWidth: 2,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  voiceBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  voiceBtnSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  selectedSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 10,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F766E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChipText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
    marginRight: 6,
  },
  selectedChipClose: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickSelectSection: {
    marginBottom: 20,
  },
  quickSelectGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  quickSelectBtnActive: {
    backgroundColor: '#F0FDFA',
    borderColor: '#CCFBF1',
  },
  quickSelectBtnIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  quickSelectBtnText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  quickSelectBtnTextActive: {
    color: '#0F766E',
    fontWeight: 'bold',
  },
  assessBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  assessBtnDisabled: {
    opacity: 0.5,
  },
  assessBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  assessmentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  emojiDisplay: {
    fontSize: 64,
    marginBottom: 12,
  },
  urgencyTitle: {
    fontSize: 24,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },
  guidanceText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  firstAidBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  firstAidTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  instructionRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  instructionNum: {
    fontWeight: '800',
    color: '#0F766E',
    marginRight: 6,
    fontSize: 13,
  },
  instructionText: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    lineHeight: 18,
  },
  actionButtons: {
    width: '100%',
  },
  btnDanger: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  btnDangerText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: 'bold',
  },
  btnPrimary: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  btnPrimaryText: {
    color: '#0F766E',
    fontSize: 15,
    fontWeight: 'bold',
  },
  btnSuccess: {
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSuccessText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
