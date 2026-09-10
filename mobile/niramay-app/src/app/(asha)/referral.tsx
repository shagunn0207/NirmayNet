import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function ReferralScreen() {
  const { t, user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const patient_id = params.patient_id as string;
  const consultation_id = params.consultation_id as string;

  const [patient, setPatient] = useState<any>(null);
  const [consultation, setConsultation] = useState<any>(null);
  const [referral, setReferral] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (patient_id) {
      supabase.from('patients').select('*').eq('id', patient_id).single()
        .then(({ data }) => setPatient(data));
    }
    if (consultation_id) {
      supabase.from('consultations').select('*').eq('id', consultation_id).single()
        .then(({ data }) => setConsultation(data));
    }
  }, [patient_id, consultation_id]);

  const handleSend = async () => {
    if (!user || !patient_id) return;
    setSending(true);
    
    try {
      const { data, error } = await supabase.from('referrals').insert({
        patient_id,
        from_phc_id: 'phc-mock-id', // Assuming connected to a default PHC
        to_district_id: 'district-mock-id',
        reason: notes || (consultation?.symptoms || 'Emergency'),
        status: 'IN_TRANSIT',
        vehicle_no: 'MH-39-AB-1234', // Mock auto-assigned vehicle
        driver_name: 'Ramesh (9876543210)',
        estimated_time: '15 mins'
      }).select().single();

      if (error) throw error;
      setReferral(data);
      setSent(true);
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setSending(false);
    }
  };

  const instructions = [
    t('instruction1') || 'Make the patient sit in a comfortable upright position.',
    t('instruction2') || 'Loosen any tight clothing around the neck and waist.',
    t('instruction3') || 'Reassure the patient to keep them calm.',
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Patient + urgency */}
      <View style={styles.emergencyCard}>
        <View style={styles.emergencyCardHeader}>
          <View>
            {patient ? (
              <Text style={styles.patientName}>{patient.name}</Text>
            ) : (
              <ActivityIndicator size="small" color="#0F766E" />
            )}
            <Text style={styles.patientSub}>{t('urgentReferral') || 'Urgent Referral'}</Text>
          </View>
          <View style={styles.emergencyBadge}>
            <Text style={styles.emergencyBadgeText}>{t('emergencyLabel') || 'EMERGENCY'}</Text>
          </View>
        </View>
      </View>

      {/* Reason from triage mock */}
      <View style={styles.reasonCard}>
        <Text style={styles.reasonTitle}>{t('symptoms') || 'SYMPTOMS'}</Text>
        <Text style={styles.reasonText}>{consultation?.symptoms || t('breathingSwelling') || 'Severe breathing difficulty and swelling'}</Text>
      </View>

      {/* Referred to */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('referredHospital') || 'Referred to Hospital'}</Text>
        <Text style={styles.boldText}>{t('districtHospital') || 'Nandurbar District Hospital'}</Text>
        <Text style={styles.subText}>{t('distanceKm') || '45 km away • Approx 1h 15m'}</Text>
      </View>

      {/* Referral Notes Input */}
      {!sent && (
        <View style={styles.card}>
          <Text style={styles.label}>{t('notes') || 'Referral Notes (Optional)'}</Text>
          <TextInput
            style={styles.textArea}
            multiline
            numberOfLines={3}
            placeholder={t('notes') || 'Any extra details...'}
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      )}

      {/* Ambulance */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('ambulanceSection') || 'Ambulance & Transport'}</Text>
        {sent ? (
          <View style={styles.gap10}>
            <View style={styles.rowCenterGap10}>
              <View style={styles.checkCircle}>
                <FontAwesome5 name="check" size={12} color="#FFFFFF" />
              </View>
              <Text style={styles.successTextBold}>{t('ambulanceDispatched') || 'Ambulance Dispatched'}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('vehicleNo') || 'Vehicle No'}</Text>
              <Text style={styles.infoValue}>{referral?.vehicle_no || t('vehicle') || 'MH-39-AB-1234'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('driverLabel') || 'Driver Contact'}</Text>
              <Text style={styles.infoValue}>{referral?.driver_name || t('driver') || 'Ramesh (9876543210)'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('etaLabel') || 'Estimated Arrival'}</Text>
              <Text style={styles.infoValueAccent}>{referral?.estimated_time || t('estimatedArrival') || '15 mins'}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.rowCenterGap10}>
            <FontAwesome5 name="clock" size={16} color="#94A3B8" />
            <Text style={styles.noteText}>{t('ambulanceNotifyNote') || 'Will notify hospital for ambulance dispatch'}</Text>
          </View>
        )}
      </View>

      {/* Hospital timeline */}
      {sent && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>{t('hospitalTimeline') || 'Hospital Timeline'}</Text>
          <View style={styles.gap12}>
            <View style={styles.timelineRow}>
              <View style={styles.timelineCircleDone}><FontAwesome5 name="check" size={10} color="#FFFFFF" /></View>
              <Text style={styles.timelineLabelDone}>{t('referralSent') || 'Referral Sent'}</Text>
              <Text style={styles.timelineTime}>14:32</Text>
            </View>
            <View style={styles.timelineRow}>
              <View style={styles.timelineCircleDone}><FontAwesome5 name="check" size={10} color="#FFFFFF" /></View>
              <Text style={styles.timelineLabelDone}>{t('hospitalNotified') || 'Hospital Notified'}</Text>
              <Text style={styles.timelineTime}>14:33</Text>
            </View>
            <View style={styles.timelineRow}>
              <View style={styles.timelineCirclePending} />
              <Text style={styles.timelineLabelPending}>{t('awaitingConfirmation') || 'Awaiting Confirmation'}</Text>
              <Text style={styles.timelineTime}>—</Text>
            </View>
          </View>
        </View>
      )}

      {/* Dynamic while-waiting instructions */}
      {sent && (
        <View style={styles.urgentCard}>
          <Text style={styles.urgentSectionTitle}>⏱ {t('whileWaiting') || 'While Waiting'}</Text>
          <View style={styles.gap10}>
            {instructions.map((inst, i) => (
              <View key={i} style={styles.instructionRow}>
                <View style={styles.instructionNumCircle}><Text style={styles.instructionNumText}>{i + 1}</Text></View>
                <Text style={styles.instructionText}>{inst}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Send button */}
      {!sent && (
        <TouchableOpacity
          style={[styles.btnDanger, sending && styles.btnDisabled]}
          onPress={handleSend}
          disabled={sending}
        >
          <Text style={styles.btnDangerText}>{sending ? (t('sendingReferral') || 'Sending...') : (t('sendReferralBtn') || 'Send Referral')}</Text>
        </TouchableOpacity>
      )}

      {sent && (
        <View style={styles.successBanner}>
          <View style={styles.checkCircle}>
            <FontAwesome5 name="check" size={12} color="#FFFFFF" />
          </View>
          <Text style={styles.successTextBold}>{t('referralSuccess') || 'Referral Successfully Sent'}</Text>
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
  emergencyCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  emergencyCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  patientName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  patientSub: {
    fontSize: 13,
    color: '#475569',
    marginTop: 3,
    fontWeight: '500',
  },
  emergencyBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  emergencyBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 0.6,
  },
  reasonCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  reasonTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#D97706',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  reasonText: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#64748B',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  boldText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  subText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 3,
    fontWeight: '500',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    color: '#0F172A',
    textAlignVertical: 'top',
  },
  gap10: {
    gap: 10,
  },
  gap12: {
    gap: 12,
  },
  rowCenterGap10: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTextBold: {
    fontWeight: 'bold',
    fontSize: 15,
    color: '#15803D',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  infoValueAccent: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#DC2626',
  },
  noteText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '500',
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timelineCircleDone: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  timelineCirclePending: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  timelineLabelDone: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  timelineLabelPending: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  timelineTime: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  urgentCard: {
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  urgentSectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#D97706',
    marginBottom: 10,
  },
  instructionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  instructionNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#D97706',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  instructionNumText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#0F172A',
    lineHeight: 20,
  },
  btnDanger: {
    backgroundColor: '#DC2626',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDangerText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
  },
});
