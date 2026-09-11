import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../store/AuthContext';
import { BACKEND_URL } from '../../lib/apiClient';

type AgeUnit = 'Years' | 'Months' | 'Weeks';
type Gender = 'Female' | 'Male' | 'Other';

const SYMPTOM_OPTIONS = [
  { id: 'fever', label: 'Fever' },
  { id: 'breathing', label: 'Breathing difficulty' },
  { id: 'headache', label: 'Headache' },
  { id: 'weakness', label: 'Weakness' },
  { id: 'vomiting', label: 'Vomiting' },
  { id: 'pregnancy', label: 'Pregnancy' },
  { id: 'child_under_5', label: 'Child < 5' },
  { id: 'chronic', label: 'Chronic illness' },
];

export default function RegisterPatientScreen() {
  const router = useRouter();
  const { session, user } = useAuth();

  // Multi-step: 1 = Basic Info, 2 = Patient Details, 3 = Triage Result
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Basic Information
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(28);
  const [ageUnit, setAgeUnit] = useState<AgeUnit>('Years');
  const [gender, setGender] = useState<Gender>('Female');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState(user?.village || 'Chinchpada');
  const [abhaId, setAbhaId] = useState('');
  const [allergies, setAllergies] = useState('');

  // Step 2: Health Info / Assessment
  const [chiefComplaint, setChiefComplaint] = useState('High fever with cough');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['fever']);
  const [otherSymptoms, setOtherSymptoms] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('None');
  const [notes, setNotes] = useState('');

  // Step 3: Result from backend
  const [createdPatientId, setCreatedPatientId] = useState<string | null>(null);
  const [triageCategory, setTriageCategory] = useState<'ROUTINE' | 'URGENT' | 'EMERGENCY'>('URGENT');
  const [triageReason, setTriageReason] = useState('Patient needs medical attention soon.');
  const [triageScore, setTriageScore] = useState(2);

  // Age adjusters
  const incrementAge = () => setAge(prev => prev + 1);
  const decrementAge = () => setAge(prev => (prev > 1 ? prev - 1 : 1));

  const toggleSymptom = (symId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symId) ? prev.filter(s => s !== symId) : [...prev, symId]
    );
  };

  // ── Step 1 Validation ──
  const handleNextToStep2 = () => {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter patient full name.');
      return;
    }
    setStep(2);
  };

  // ── Step 2: Submit to Backend and Run Triage ──
  const handleSubmitAndTriage = async () => {
    setLoading(true);
    try {
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // 1. Create Patient
      const patientPayload = {
        name: name.trim(),
        age: Number(age) || 25,
        gender: gender,
        phone: phone.trim() || undefined,
        village: village.trim() || 'Nandurbar',
        abha_id: abhaId.trim() || undefined,
        allergies: allergies.trim() || undefined,
      };

      const pRes = await fetch(`${BACKEND_URL}/api/v1/patients/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(patientPayload),
      });

      let patientId: string = Date.now().toString();
      if (pRes.ok) {
        const pData = await pRes.json();
        patientId = pData.id;
        setCreatedPatientId(pData.id);
      } else {
        setCreatedPatientId(patientId);
      }

      // 2. Assess Triage
      const allSymptoms = [...selectedSymptoms];
      if (chiefComplaint.toLowerCase().includes('breath')) allSymptoms.push('breathing');
      if (chiefComplaint.toLowerCase().includes('fever')) allSymptoms.push('fever');

      const triagePayload = {
        patient_id: patientId,
        symptoms: allSymptoms.length > 0 ? allSymptoms : ['fever'],
      };

      const tRes = await fetch(`${BACKEND_URL}/api/v1/triage/assess`, {
        method: 'POST',
        headers,
        body: JSON.stringify(triagePayload),
      });

      if (tRes.ok) {
        const tData = await tRes.json();
        setTriageCategory(tData.triage_category || 'URGENT');
        setTriageReason(tData.reason || 'Patient needs medical attention soon.');
        setTriageScore(tData.triage_score || 2);
      } else {
        // Local evaluation fallback
        if (selectedSymptoms.includes('breathing') && selectedSymptoms.includes('pregnancy')) {
          setTriageCategory('EMERGENCY');
          setTriageReason('Respiratory distress with pregnancy complication. Immediate emergency care required.');
        } else if (selectedSymptoms.length >= 2 || selectedSymptoms.includes('breathing')) {
          setTriageCategory('URGENT');
          setTriageReason('Moderate symptoms requiring doctor consultation within 24 hours.');
        } else {
          setTriageCategory('ROUTINE');
          setTriageReason('Mild symptoms. Routine care and home monitoring advised.');
        }
      }

      setStep(3);
    } catch {
      // Local fallback on connection issue
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* ── Top Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            if (step === 1) router.back();
            else if (step === 2) setStep(1);
            else setStep(2);
          }}
        >
          <FontAwesome5 name="arrow-left" size={16} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {step === 1 ? 'New Patient' : step === 2 ? 'Patient Details' : 'Triage Result'}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── Step Progress Indicator ── */}
      <View style={styles.stepIndicatorRow}>
        <View style={[styles.stepCircle, step >= 1 ? styles.stepCircleActive : styles.stepCircleInactive]}>
          <Text style={[styles.stepNumber, step >= 1 && styles.stepNumberActive]}>1</Text>
        </View>
        <View style={[styles.stepLine, step >= 2 ? styles.stepLineActive : styles.stepLineInactive]} />
        <View style={[styles.stepCircle, step >= 2 ? styles.stepCircleActive : styles.stepCircleInactive]}>
          <Text style={[styles.stepNumber, step >= 2 && styles.stepNumberActive]}>2</Text>
        </View>
        <View style={[styles.stepLine, step >= 3 ? styles.stepLineActive : styles.stepLineInactive]} />
        <View style={[styles.stepCircle, step >= 3 ? styles.stepCircleActive : styles.stepCircleInactive]}>
          <Text style={[styles.stepNumber, step >= 3 && styles.stepNumberActive]}>3</Text>
        </View>
      </View>

      {/* ───────────────────────────────────────────────────────────────────────
          STEP 1: BASIC INFORMATION
      ──────────────────────────────────────────────────────────────────────── */}
      {step === 1 && (
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Basic Information</Text>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Savitri Devi"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Age & Unit */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Age *</Text>
            <View style={styles.ageRow}>
              <View style={styles.ageCounter}>
                <TouchableOpacity style={styles.ageBtn} onPress={decrementAge}>
                  <FontAwesome5 name="minus" size={12} color="#059669" />
                </TouchableOpacity>
                <TextInput
                  style={styles.ageInput}
                  keyboardType="numeric"
                  value={String(age)}
                  onChangeText={v => setAge(parseInt(v) || 0)}
                />
                <TouchableOpacity style={styles.ageBtn} onPress={incrementAge}>
                  <FontAwesome5 name="plus" size={12} color="#059669" />
                </TouchableOpacity>
              </View>

              <View style={styles.ageUnitSelector}>
                {(['Years', 'Months', 'Weeks'] as AgeUnit[]).map(unit => (
                  <TouchableOpacity
                    key={unit}
                    style={[styles.unitChip, ageUnit === unit && styles.unitChipActive]}
                    onPress={() => setAgeUnit(unit)}
                  >
                    <Text style={[styles.unitChipText, ageUnit === unit && styles.unitChipTextActive]}>
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Sex */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Sex *</Text>
            <View style={styles.genderRow}>
              {(['Female', 'Male', 'Other'] as Gender[]).map(g => (
                <TouchableOpacity
                  key={g}
                  style={[styles.genderChip, gender === g && styles.genderChipActive]}
                  onPress={() => setGender(g)}
                >
                  <FontAwesome5
                    name={g === 'Female' ? 'venus' : g === 'Male' ? 'mars' : 'genderless'}
                    size={14}
                    color={gender === g ? '#FFFFFF' : '#64748B'}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.genderChipText, gender === g && styles.genderChipTextActive]}>
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 9876543210"
              placeholderTextColor="#94A3B8"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          {/* Village */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Village</Text>
            <TextInput
              style={styles.input}
              placeholder="Village name"
              placeholderTextColor="#94A3B8"
              value={village}
              onChangeText={setVillage}
            />
          </View>

          {/* ABHA ID */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ABHA ID (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 91-8823-4410-12"
              placeholderTextColor="#94A3B8"
              value={abhaId}
              onChangeText={setAbhaId}
            />
          </View>

          {/* Allergies */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Allergies (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Penicillin, Sulfa drugs, None"
              placeholderTextColor="#94A3B8"
              value={allergies}
              onChangeText={setAllergies}
            />
          </View>

          {/* Next Button */}
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={handleNextToStep2}
          >
            <Text style={styles.primaryBtnText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          STEP 2: HEALTH INFORMATION & DETAILS
      ──────────────────────────────────────────────────────────────────────── */}
      {step === 2 && (
        <View style={styles.card}>
          <Text style={styles.sectionHeader}>Health Information</Text>

          {/* Chief Complaint */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Chief Complaint *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Fever with chest discomfort"
              placeholderTextColor="#94A3B8"
              value={chiefComplaint}
              onChangeText={setChiefComplaint}
            />
          </View>

          {/* Symptoms Chips */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Symptoms</Text>
            <View style={styles.chipsWrap}>
              {SYMPTOM_OPTIONS.map(s => {
                const isSelected = selectedSymptoms.includes(s.id);
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.symptomChip, isSelected && styles.symptomChipActive]}
                    onPress={() => toggleSymptom(s.id)}
                  >
                    <Text style={[styles.symptomChipText, isSelected && styles.symptomChipTextActive]}>
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Other Symptoms */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Other Symptoms</Text>
            <TextInput
              style={styles.input}
              placeholder="Select or type additional symptoms"
              placeholderTextColor="#94A3B8"
              value={otherSymptoms}
              onChangeText={setOtherSymptoms}
            />
          </View>

          {/* Medical History */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Medical History</Text>
            <TextInput
              style={styles.input}
              placeholder="Any relevant past history?"
              placeholderTextColor="#94A3B8"
              value={medicalHistory}
              onChangeText={setMedicalHistory}
            />
          </View>

          {/* Notes */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Notes (Optional)</Text>
            <TextInput
              style={[styles.input, { height: 68, textAlignVertical: 'top' }]}
              placeholder="Add any additional notes"
              placeholderTextColor="#94A3B8"
              multiline
              value={notes}
              onChangeText={setNotes}
            />
          </View>

          {/* Buttons Row */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.backButtonOutline}
              onPress={() => setStep(1)}
              disabled={loading}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.primaryBtn, { flex: 1, marginLeft: 12 }]}
              activeOpacity={0.85}
              onPress={handleSubmitAndTriage}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryBtnText}>Run Triage</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          STEP 3: TRIAGE RESULT
      ──────────────────────────────────────────────────────────────────────── */}
      {step === 3 && (
        <View style={styles.resultCard}>
          {/* Badge & Icon */}
          <View
            style={[
              styles.triageBanner,
              triageCategory === 'EMERGENCY'
                ? styles.triageEmergency
                : triageCategory === 'URGENT'
                ? styles.triageUrgent
                : styles.triageRoutine,
            ]}
          >
            <FontAwesome5
              name={
                triageCategory === 'EMERGENCY'
                  ? 'ambulance'
                  : triageCategory === 'URGENT'
                  ? 'exclamation-triangle'
                  : 'check-circle'
              }
              size={36}
              color={
                triageCategory === 'EMERGENCY'
                  ? '#DC2626'
                  : triageCategory === 'URGENT'
                  ? '#D97706'
                  : '#059669'
              }
            />
            <Text
              style={[
                styles.triageTitle,
                {
                  color:
                    triageCategory === 'EMERGENCY'
                      ? '#991B1B'
                      : triageCategory === 'URGENT'
                      ? '#92400E'
                      : '#065F46',
                },
              ]}
            >
              {triageCategory === 'EMERGENCY'
                ? 'Emergency'
                : triageCategory === 'URGENT'
                ? 'Urgent Care'
                : 'Routine Care'}
            </Text>
            <Text style={styles.triageReason}>{triageReason}</Text>
          </View>

          {/* Recommended Action Box */}
          <View style={styles.actionBox}>
            <Text style={styles.actionBoxTitle}>Recommended Action</Text>
            <View style={styles.actionItem}>
              <FontAwesome5 name="check" size={13} color="#059669" style={{ marginRight: 8 }} />
              <Text style={styles.actionItemText}>Refer to PHC Doctor</Text>
            </View>
            <View style={styles.actionItem}>
              <FontAwesome5 name="check" size={13} color="#059669" style={{ marginRight: 8 }} />
              <Text style={styles.actionItemText}>
                {triageCategory === 'EMERGENCY'
                  ? 'Immediate ambulance dispatch'
                  : triageCategory === 'URGENT'
                  ? 'Schedule within 24 hours'
                  : 'Schedule next routine visit'}
              </Text>
            </View>
            <View style={styles.actionItem}>
              <FontAwesome5 name="check" size={13} color="#059669" style={{ marginRight: 8 }} />
              <Text style={styles.actionItemText}>Monitor symptoms daily</Text>
            </View>
          </View>

          {/* Create Referral Button */}
          <TouchableOpacity
            style={styles.primaryBtn}
            activeOpacity={0.85}
            onPress={() => {
              router.push({
                pathname: '/(asha)/referral',
                params: {
                  patientId: createdPatientId || '',
                  patientName: name,
                  priority: triageCategory === 'EMERGENCY' ? 'Emergency' : 'Urgent',
                },
              });
            }}
          >
            <Text style={styles.primaryBtnText}>Create Referral</Text>
          </TouchableOpacity>

          {/* Save to My Patients Button */}
          <TouchableOpacity
            style={styles.outlineBtn}
            activeOpacity={0.85}
            onPress={() => router.replace('/(asha)/patients')}
          >
            <Text style={styles.outlineBtnText}>Save to My Patients</Text>
          </TouchableOpacity>
        </View>
      )}
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
  stepIndicatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: '#059669',
  },
  stepCircleInactive: {
    backgroundColor: '#E2E8F0',
  },
  stepNumber: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#64748B',
  },
  stepNumberActive: {
    color: '#FFFFFF',
  },
  stepLine: {
    width: 40,
    height: 3,
    marginHorizontal: 8,
  },
  stepLineActive: {
    backgroundColor: '#059669',
  },
  stepLineInactive: {
    backgroundColor: '#E2E8F0',
  },
  card: {
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
  sectionHeader: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    marginBottom: 16,
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
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ageCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 6,
    height: 44,
  },
  ageBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#E6F4EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageInput: {
    width: 44,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  ageUnitSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    height: 44,
    alignItems: 'center',
  },
  unitChip: {
    paddingHorizontal: 10,
    height: 38,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unitChipActive: {
    backgroundColor: '#FFFFFF',
  },
  unitChipText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  unitChipTextActive: {
    fontFamily: 'Inter_700Bold',
    color: '#059669',
  },
  genderRow: {
    flexDirection: 'row',
    gap: 8,
  },
  genderChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 42,
  },
  genderChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  genderChipText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
  },
  genderChipTextActive: {
    color: '#FFFFFF',
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  symptomChipActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  symptomChipText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#475569',
  },
  symptomChipTextActive: {
    color: '#166534',
    fontFamily: 'Inter_700Bold',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  backButtonOutline: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  backButtonText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
  },
  primaryBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
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
  resultCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  triageBanner: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 18,
    marginBottom: 18,
  },
  triageEmergency: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
  },
  triageUrgent: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderWidth: 1,
  },
  triageRoutine: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
  },
  triageTitle: {
    fontSize: 20,
    fontFamily: 'Inter_800ExtraBold',
    marginTop: 10,
  },
  triageReason: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#475569',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  actionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  actionBoxTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    marginBottom: 10,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionItemText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#334155',
  },
  outlineBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#059669',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  outlineBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#059669',
  },
});
