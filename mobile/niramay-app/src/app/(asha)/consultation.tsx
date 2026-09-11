import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Linking } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BACKEND_URL } from '../../lib/apiClient';

export default function ConsultationScreen() {
  const { t, session, user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const patient_id = (params.patient_id as string) || null;
  const consultation_id = (params.consultation_id as string) || null;

  const [patient, setPatient] = useState<any>(null);
  const [consultation, setConsultation] = useState<any>(null);
  const [callState, setCallState] = useState<'idle' | 'connecting' | 'connected' | 'lost' | 'offline'>('idle');
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    const loadPatient = async () => {
      if (!patient_id || !session?.access_token) return;
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/patients/${patient_id}`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setPatient(data);
      } catch (error) {
        console.warn('consultation patient fetch failed', error);
      }
    };

    const loadConsultation = async () => {
      if (!consultation_id || !session?.access_token) return;
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/teleconsult/${consultation_id}`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setConsultation(data);
        if (data?.jitsi_url) {
          setCallState('connected');
        }
      } catch (error) {
        console.warn('consultation fetch failed', error);
      }
    };

    loadPatient();
    loadConsultation();
  }, [patient_id, consultation_id, session]);

  const formatTime = (s: number) => `0${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const startCall = async () => {
    if (!patient_id) {
      Alert.alert(t('patientNotSelectedTitle') || 'Patient not selected', t('patientNotSelectedMsg') || 'Please open this screen from a patient triage record.');
      return;
    }

    setLoading(true);
    setCallState('connecting');

    try {
      const token = session?.access_token;
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const payload = {
        patient_id,
        referral_id: null,
        notes: `Teleconsultation requested by ${user?.name || 'ASHA'} for ${patient?.name || 'patient'}`,
      };

      const response = await fetch(`${BACKEND_URL}/api/v1/teleconsult/room`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let msg = t('failedCreateRoom') || 'Failed to create consultation room';
        try {
          const j = await response.json();
          if (j?.detail) msg = j.detail;
        } catch {}
        throw new Error(msg);
      }

      const data = await response.json();
      setConsultation(data);
      setCallState('connected');
      setElapsed(0);

      if (data?.jitsi_url) {
        await Linking.openURL(data.jitsi_url);
      }
    } catch (error: any) {
      setCallState('idle');
      Alert.alert(t('consultationErrorTitle') || 'Consultation error', error?.message || (t('consultationErrorMsg') || 'Unable to reach the teleconsultation service.'));
    } finally {
      setLoading(false);
    }
  };

  const endCall = () => {
    setCallState('idle');
    setElapsed(0);
    setMuted(false);
  };

  const roomTitle = consultation?.room_id ? `Room ${String(consultation.room_id).slice(0, 12)}` : (patient?.name || 'Patient');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.emergencyCard}>
        <Text style={styles.emergencyTitle}>{patient?.name || 'Patient'} — {t('urgentCase2') || 'Urgent Case'}</Text>
        <Text style={styles.emergencySub}>{patient ? `${patient.age} yrs • ${patient.gender || 'Other'} • ${patient.village || 'Village'} ` : (t('breathingSwelling') || 'Severe breathing difficulty and swelling')}</Text>
      </View>

      <View style={styles.doctorCard}>
        <View style={styles.doctorIconWrap}>
          <Text style={{ fontSize: 24 }}>👨‍⚕️</Text>
        </View>
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{consultation?.room_id ? roomTitle : (t('doctorName') || 'Dr. Sharma')}</Text>
          <Text style={styles.doctorPHC}>{consultation?.jitsi_url ? (t('jitsiRoomReady') || 'Jitsi teleconsult room ready') : (t('doctorPHC') || 'PHC Medical Officer')}</Text>
          <View style={{ marginTop: 4 }}>
            {callState === 'connected' ? (
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, { backgroundColor: '#16A34A' }]} />
                <Text style={[styles.statusText, { color: '#16A34A' }]}>{t('connected') || 'Connected'} • {formatTime(elapsed)}</Text>
              </View>
            ) : callState === 'lost' || callState === 'offline' ? (
              <Text style={[styles.statusText, { color: '#DC2626' }]}>📡 {t('signalLost') || 'Signal Lost'}</Text>
            ) : callState === 'connecting' ? (
              <Text style={[styles.statusText, { color: '#D97706' }]}>⏳ {t('connectingCall') || 'Connecting...'}</Text>
            ) : (
              <Text style={styles.statusText}>{t('networkTest') || 'Checking network status...'}</Text>
            )}
          </View>
        </View>
      </View>

      <View style={[styles.videoArea, { backgroundColor: callState === 'connected' ? '#0F172A' : '#1E293B' }]}>
        {callState === 'idle' && (
          <>
            <FontAwesome5 name="video-slash" size={32} color="#94A3B8" />
            <Text style={styles.videoStatusText}>{t('cameraClosed') || 'Camera is off'}</Text>
          </>
        )}
        {callState === 'connecting' && (
          <>
            <ActivityIndicator size="large" color="#0F766E" />
            <Text style={styles.videoStatusText}>{t('connectingCall') || 'Connecting...'}</Text>
          </>
        )}
        {callState === 'connected' && (
          <>
            <Text style={{ fontSize: 64 }}>👨‍⚕️</Text>
            <Text style={styles.doctorNameVideo}>{consultation?.room_id ? roomTitle : (t('doctorName') || 'Dr. Sharma')}</Text>
            <View style={styles.selfPreview}>
              <Text style={{ fontSize: 28 }}>👩</Text>
            </View>
          </>
        )}
        {(callState === 'lost' || callState === 'offline') && (
          <>
            <Text style={{ fontSize: 48, marginBottom: 10 }}>📡</Text>
            <Text style={styles.errorText}>{t('connectionBroke') || 'Connection Lost'}</Text>
            {callState === 'offline' && (
              <Text style={styles.offlineHelperText}>{t('goingOffline') || 'Please use the offline guide to provide immediate care.'}</Text>
            )}
          </>
        )}
      </View>

      {callState === 'connected' ? (
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.btnOutline, muted && styles.btnOutlineActive, { flex: 1, marginRight: 10 }]}
            onPress={() => setMuted(!muted)}
          >
            <Text style={[styles.btnOutlineText, muted && styles.btnOutlineTextActive]}>
              {muted ? '🔇 ' : '🎤 '} {t('mute') || 'Mute'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.btnDanger, { flex: 1 }]} onPress={endCall}>
            <Text style={styles.btnDangerText}>📵 {t('endCall') || 'End Call'}</Text>
          </TouchableOpacity>
        </View>
      ) : callState === 'offline' ? (
        <TouchableOpacity style={styles.btnOutline} onPress={() => router.push('/(asha)/referral' as any)}>
          <Text style={styles.btnOutlineText}>{t('openOfflineGuide') || 'Open Offline Guide'}</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.btnPrimary, loading && styles.btnDisabled]}
          onPress={startCall}
          disabled={loading}
        >
          <Text style={styles.btnPrimaryText}>
            {loading ? (t('connectingCall') || 'Connecting...') : (t('startVideoCall') || 'Start Video Call')}
          </Text>
        </TouchableOpacity>
      )}

      {consultation?.jitsi_url && (
        <TouchableOpacity style={[styles.btnOutline, { marginTop: 16 }]} onPress={() => Linking.openURL(consultation.jitsi_url)}>
          <Text style={styles.btnOutlineText}>{t('joinTeleconsult') || 'Join teleconsult room'}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={[styles.btnOutline, { marginTop: 16 }]} onPress={() => router.push('/(asha)/referral' as any)}>
        <Text style={styles.btnOutlineText}>{t('makeReferral') || 'Make Referral'}</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  emergencyCard: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FCA5A5', borderRadius: 12, padding: 16, marginBottom: 16 },
  emergencyTitle: { fontSize: 16, fontWeight: 'bold', color: '#991B1B' },
  emergencySub: { fontSize: 13, color: '#B91C1C', marginTop: 4 },
  doctorCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  doctorIconWrap: { width: 52, height: 52, backgroundColor: '#F0FDFA', borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#CCFBF1', marginRight: 16 },
  doctorDetails: { flex: 1 },
  doctorName: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  doctorPHC: { fontSize: 13, color: '#64748B', marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center' },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  statusText: { fontSize: 12, fontWeight: 'bold', color: '#94A3B8' },
  videoArea: { height: 240, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 16, position: 'relative' },
  videoStatusText: { color: '#94A3B8', fontSize: 14, fontWeight: '600', marginTop: 12 },
  doctorNameVideo: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  selfPreview: { position: 'absolute', bottom: 16, right: 16, width: 84, height: 104, backgroundColor: '#334155', borderRadius: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#F87171', fontSize: 18, fontWeight: 'bold' },
  offlineHelperText: { color: '#94A3B8', fontSize: 14, textAlign: 'center', paddingHorizontal: 20, marginTop: 10 },
  controlsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  btnPrimary: { backgroundColor: '#0F766E', borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  btnDisabled: { opacity: 0.6 },
  btnPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  btnOutline: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  btnOutlineActive: { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' },
  btnOutlineText: { color: '#0F172A', fontSize: 15, fontWeight: 'bold' },
  btnOutlineTextActive: { color: '#DC2626' },
  btnDanger: { backgroundColor: '#FEF2F2', borderWidth: 1.5, borderColor: '#FCA5A5', borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  btnDangerText: { color: '#DC2626', fontSize: 15, fontWeight: 'bold' },
});
