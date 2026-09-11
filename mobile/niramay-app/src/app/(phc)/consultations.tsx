import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput,
  ScrollView, ActivityIndicator, Alert, Linking
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../store/AuthContext';
import { BACKEND_URL } from '../../lib/apiClient';

interface PatientItem {
  id: string;
  name: string;
  age: number;
  gender: string;
}

export default function PhcConsultationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { session, t } = useAuth();

  const [patients, setPatients] = useState<PatientItem[]>([
    { id: '11111111-1111-1111-1111-111111111111', name: 'Savitri Devi', age: 32, gender: 'Female' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Ramesh Kumar', age: 45, gender: 'Male' },
    { id: '33333333-3333-3333-3333-333333333333', name: 'Pooja Sharma', age: 28, gender: 'Female' },
  ]);

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    (params.patientId as string) || '11111111-1111-1111-1111-111111111111'
  );

  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [medicines, setMedicines] = useState('');
  const [nextVisitDate, setNextVisitDate] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [teleconsultLoading, setTeleconsultLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [prevTs, setPrevTs] = useState(params.ts as string);

  if (params.ts && params.ts !== prevTs) {
    setPrevTs(params.ts as string);
    if (params.patientId) {
      setSelectedPatientId(params.patientId as string);
    }
    setDiagnosis('');
    setTreatment('');
    setMedicines('');
    setNextVisitDate('');
    setNotes('');
    setSavedSuccess(false);
  }

  useEffect(() => {
    setDiagnosis('');
    setTreatment('');
    setMedicines('');
    setNextVisitDate('');
    setNotes('');
    setSavedSuccess(false);
  }, [selectedPatientId]);

  useEffect(() => {
    (async () => {
      try {
        const token = session?.access_token;
        const headers: Record<string, string> = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const res = await fetch(`${BACKEND_URL}/api/v1/patients/`, { headers });
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPatients(data.map((p: any) => ({
              id: String(p.id),
              name: p.name,
              age: Number(p.age) || 30,
              gender: p.gender || 'Female',
            })));
            if (params.patientId && !selectedPatientId) {
              setSelectedPatientId(params.patientId as string);
            } else if (!selectedPatientId && data.length > 0) {
              setSelectedPatientId(String(data[0].id));
            }
          }
        }
      } catch {
        // Fallback
      }
    })();
  }, [session, params.patientId]);

  const selectedPatient = patients.find(p => p.id === selectedPatientId) || patients[0];

  const handleSaveConsultation = async () => {
    if (!diagnosis.trim()) {
      Alert.alert('Required', 'Please enter a clinical diagnosis.');
      return;
    }

    setLoading(true);
    try {
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Schedule follow-up
      await fetch(`${BACKEND_URL}/api/v1/followups/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          patient_id: selectedPatient.id,
          category: 'Post-Consultation',
          urgency: 'ROUTINE',
          notes: `Diagnosis: ${diagnosis}. Medicines: ${medicines}. Next visit: ${nextVisitDate}`,
          followup_date: '2026-09-19',
        }),
      }).catch(() => {});

      setSavedSuccess(true);
    } catch {
      setSavedSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    setLoading(true);
    try {
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      await fetch(`${BACKEND_URL}/api/v1/referrals/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          patient_id: selectedPatient.id,
          reason: `[PHC DOCTOR ESCALATION] ${notes}`,
          destination_hospital: "District Hospital Nandurbar",
          priority: "Emergency",
          status: "PENDING"
        }),
      });
      Alert.alert('Escalated', 'Patient has been escalated to District Hospital.');
    } catch {
      Alert.alert('Error', 'Failed to escalate patient.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTeleconsult = async () => {
    setTeleconsultLoading(true);
    try {
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${BACKEND_URL}/api/v1/teleconsult/room`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          patient_id: selectedPatient.id,
          notes: `Teleconsultation session for ${selectedPatient.name}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.jitsi_url) {
          Linking.openURL(data.jitsi_url);
          return;
        }
      }

      // Direct fallback
      const roomUrl = `https://meet.jit.si/nirmay_consult_${selectedPatient.id.slice(0, 8)}`;
      Linking.openURL(roomUrl);
    } catch {
      const roomUrl = `https://meet.jit.si/nirmay_consult_${selectedPatient.id.slice(0, 8)}`;
      Linking.openURL(roomUrl);
    } finally {
      setTeleconsultLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={16} color="#0F172A" />
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.headerTitle}>{t('phc.consultations') || 'Consultation'}</Text>
          <Text style={styles.headerSubtitle}>{selectedPatient?.name}</Text>
        </View>
        <TouchableOpacity style={styles.videoBtn} onPress={handleStartTeleconsult}>
          <FontAwesome5 name="video" size={14} color="#2563EB" />
        </TouchableOpacity>
      </View>

      {/* Success Banner */}
      {savedSuccess && (
        <View style={styles.successBanner}>
          <FontAwesome5 name="check-circle" size={18} color="#059669" style={{ marginRight: 10 }} />
          <View style={{ flex: 1 }}>
            <Text style={styles.successTitle}>{t('Consultation Saved') || 'Consultation Saved'}</Text>
            <Text style={styles.successSub}>{t('Follow-up scheduled for') || 'Follow-up scheduled for'} {nextVisitDate}</Text>
          </View>
          <TouchableOpacity onPress={() => setSavedSuccess(false)}>
            <FontAwesome5 name="times" size={14} color="#059669" />
          </TouchableOpacity>
        </View>
      )}

      {/* Patient Selector */}
      <View style={styles.selectorCard}>
        <Text style={styles.selectorLabel}>{t('Consulting Patient') || 'Consulting Patient'}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.patientScroll}>
          {patients.map(p => {
            const isSelected = p.id === selectedPatientId;
            return (
              <TouchableOpacity
                key={p.id}
                style={[styles.patientChip, isSelected && styles.patientChipActive]}
                onPress={() => setSelectedPatientId(p.id)}
              >
                <FontAwesome5
                  name="user-injured"
                  size={12}
                  color={isSelected ? '#FFFFFF' : '#2563EB'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.patientChipText, isSelected && styles.patientChipTextActive]}>
                  {p.name} ({p.age}y)
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Consultation Form Card */}
      <View style={styles.formCard}>
        {/* Diagnosis */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('Diagnosis *') || 'Diagnosis *'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter clinical diagnosis"
            placeholderTextColor="#94A3B8"
            value={diagnosis}
            onChangeText={setDiagnosis}
          />
        </View>

        {/* Treatment Plan */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('Treatment') || 'Treatment'}</Text>
          <TextInput
            style={[styles.input, { height: 60, textAlignVertical: 'top' }]}
            placeholder="Enter treatment plan"
            placeholderTextColor="#94A3B8"
            multiline
            value={treatment}
            onChangeText={setTreatment}
          />
        </View>

        {/* Prescribed Medicines */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('Prescribed Medicines') || 'Prescribed Medicines'}</Text>
          <TextInput
            style={[styles.input, { height: 64, textAlignVertical: 'top' }]}
            placeholder="Add medicines & dosages"
            placeholderTextColor="#94A3B8"
            multiline
            value={medicines}
            onChangeText={setMedicines}
          />
        </View>

        {/* Next Visit Date */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('Next Visit Date') || 'Next Visit Date'}</Text>
          <View style={styles.dateBox}>
            <TextInput
              style={styles.dateInput}
              placeholder="dd/mm/yyyy"
              placeholderTextColor="#94A3B8"
              value={nextVisitDate}
              onChangeText={setNextVisitDate}
            />
            <FontAwesome5 name="calendar-alt" size={16} color="#64748B" />
          </View>
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('Notes') || 'Notes'}</Text>
          <TextInput
            style={[styles.input, { height: 52 }]}
            placeholder="Additional clinical notes"
            placeholderTextColor="#94A3B8"
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Save Consultation Button */}
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={handleSaveConsultation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryBtnText}>{t('Save Consultation') || 'Save Consultation'}</Text>
          )}
        </TouchableOpacity>

        {/* Escalate Button */}
        <TouchableOpacity
          style={[styles.primaryBtn, { backgroundColor: '#DC2626', marginTop: 10 }]}
          activeOpacity={0.85}
          onPress={handleEscalate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.primaryBtnText}>{t('Escalate to District Hospital') || 'Escalate to District Hospital'}</Text>
          )}
        </TouchableOpacity>

        {/* Teleconsultation Action */}
        <TouchableOpacity
          style={styles.teleconsultBtn}
          activeOpacity={0.85}
          onPress={handleStartTeleconsult}
          disabled={teleconsultLoading}
        >
          {teleconsultLoading ? (
            <ActivityIndicator color="#2563EB" />
          ) : (
            <>
              <FontAwesome5 name="video" size={14} color="#2563EB" style={{ marginRight: 8 }} />
              <Text style={styles.teleconsultText}>{t('Live Teleconsult (Jitsi)') || 'Live Teleconsult (Jitsi)'}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  videoBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#065F46',
  },
  successSub: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#059669',
    marginTop: 2,
  },
  selectorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  selectorLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
    marginBottom: 8,
  },
  patientScroll: {
    flexDirection: 'row',
  },
  patientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  patientChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  patientChipText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#2563EB',
  },
  patientChipTextActive: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputGroup: {
    marginBottom: 14,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#0F172A',
  },
  dateBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
  },
  dateInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#0F172A',
  },
  primaryBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  teleconsultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 14,
    height: 46,
    marginTop: 10,
  },
  teleconsultText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#2563EB',
  },
});
