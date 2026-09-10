import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ConsultationScreen() {
  const { t } = useAuth();
  const router = useRouter();

  const [callState, setCallState] = useState<'idle' | 'connecting' | 'connected' | 'lost' | 'offline'>('idle');
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);

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

  const formatTime = (s: number) => `0${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  const startCall = async () => {
    setCallState('connecting');
    setTimeout(() => {
      setCallState('connected');
      setElapsed(0);
    }, 1800);
  };

  const endCall = () => {
    setCallState('idle');
    setElapsed(0);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Patient summary mock */}
      <View style={styles.emergencyCard}>
        <Text style={styles.emergencyTitle}>Rekha Patil — {t('urgentCase2') || 'Urgent Case'}</Text>
        <Text style={styles.emergencySub}>{t('breathingSwelling') || 'Severe breathing difficulty and swelling'}</Text>
      </View>

      {/* Doctor Info */}
      <View style={styles.doctorCard}>
        <View style={styles.doctorIconWrap}>
          <Text style={{ fontSize: 24 }}>👨‍⚕️</Text>
        </View>
        <View style={styles.doctorDetails}>
          <Text style={styles.doctorName}>{t('doctorName') || 'Dr. Sharma'}</Text>
          <Text style={styles.doctorPHC}>{t('doctorPHC') || 'PHC Medical Officer'}</Text>
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

      {/* Video Area */}
      <View style={[
        styles.videoArea,
        { backgroundColor: callState === 'connected' ? '#0F172A' : '#1E293B' }
      ]}>
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
            <Text style={styles.doctorNameVideo}>{t('doctorName') || 'Dr. Sharma'}</Text>
            {/* Self preview */}
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

      {/* Controls */}
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
          style={[styles.btnPrimary, callState === 'connecting' && styles.btnDisabled]}
          onPress={startCall}
          disabled={callState === 'connecting'}
        >
          <Text style={styles.btnPrimaryText}>
            {callState === 'connecting' ? (t('connectingCall') || 'Connecting...') : (t('startVideoCall') || 'Start Video Call')}
          </Text>
        </TouchableOpacity>
      )}

      {/* Referral shortcut */}
      <TouchableOpacity style={[styles.btnOutline, { marginTop: 16 }]} onPress={() => router.push('/(asha)/referral' as any)}>
        <Text style={styles.btnOutlineText}>{t('makeReferral') || 'Make Referral'}</Text>
      </TouchableOpacity>

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
  emergencyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#991B1B',
  },
  emergencySub: {
    fontSize: 13,
    color: '#B91C1C',
    marginTop: 4,
  },
  doctorCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  doctorIconWrap: {
    width: 52,
    height: 52,
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CCFBF1',
    marginRight: 16,
  },
  doctorDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  doctorPHC: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#94A3B8',
  },
  videoArea: {
    height: 240,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  videoStatusText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
  },
  doctorNameVideo: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  selfPreview: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    width: 84,
    height: 104,
    backgroundColor: '#334155',
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#F87171',
    fontSize: 18,
    fontWeight: 'bold',
  },
  offlineHelperText: {
    color: '#94A3B8',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btnPrimary: {
    backgroundColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnOutline: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineActive: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  btnOutlineText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: 'bold',
  },
  btnOutlineTextActive: {
    color: '#DC2626',
  },
  btnDanger: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDangerText: {
    color: '#DC2626',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
