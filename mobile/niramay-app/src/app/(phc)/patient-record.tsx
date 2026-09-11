import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../store/AuthContext';
import { BACKEND_URL } from '../../lib/apiClient';

export default function PatientRecordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { session, t } = useAuth();
  const referral_id = (params.referral_id as string) || null;

  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      if (!referral_id || !session?.access_token) return;
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/queue/${referral_id}`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setDetail(data);
      } catch (err) {
        console.warn('Failed to load detail', err);
      }
    };
    load();
  }, [referral_id, session]);

  const postAction = async (path: string) => {
    if (!referral_id || !session?.access_token) return;
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/queue/${referral_id}/${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) throw new Error('Action failed');
      const data = await res.json();
      setDetail((d:any)=> ({...d, referral: data}));
      Alert.alert('Success');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Action failed');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Top Header Card */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.patientName}>{detail?.patient?.name || 'Patient'}</Text>
          <View style={styles.abhaBadge}>
            <FontAwesome5 name="check-circle" size={12} color="#00796B" style={{ marginRight: 4 }} />
            <Text style={styles.abhaText}>{detail?.patient?.abha_id ? 'ABHA linked' : 'No ABHA'}</Text>
          </View>
        </View>
        <Text style={styles.demographics}>{detail?.patient?.age || ''} · {detail?.patient?.village || ''}</Text>
      </View>

      {/* Triage and Symptoms */}
      <View style={styles.card}>
        <View style={styles.triageRow}>
          <Text style={styles.sectionTitle}>Current triage: </Text>
          <View style={styles.triageBadge}>
            <View style={[styles.indicator, { backgroundColor: detail?.triage?.triage_category === 'EMERGENCY' ? '#F44336' : '#FFC107' }]} />
            <Text style={[styles.triageText, { color: detail?.triage?.triage_category === 'EMERGENCY' ? '#F44336' : '#FFC107' }]}>{detail?.triage?.triage_category || 'N/A'}</Text>
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Symptoms reported:</Text>
        <Text style={styles.symptomsText}>{detail?.triage?.symptoms || '—'}</Text>
      </View>

      {/* Visit History */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Visit history:</Text>
        {detail?.patient_history?.map((h:any, i:number) => (
          <View style={styles.historyRow} key={i}>
            <Text style={styles.historyDate}>{h.date || ''}</Text>
            <Text style={styles.historySeparator}>—</Text>
            <Text style={styles.historyDetail}>{h.note || ''}</Text>
          </View>
        ))}
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionBtn, styles.btnOutlineRed]} onPress={() => postAction('arrive')}>
          <FontAwesome5 name="arrow-up" size={16} color="#F44336" style={{ marginRight: 8 }} />
          <Text style={styles.textRed}>{t('confirmArrival') || 'Confirm Arrival'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionBtn, styles.btnOutlineBlue]} onPress={() => postAction('consult')}>
          <FontAwesome5 name="stethoscope" size={16} color="#3F51B5" style={{ marginRight: 8 }} />
          <Text style={styles.textBlue}>{t('startConsultBtn') || 'Start Consultation'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionBtn, styles.btnOutlineTeal]} onPress={() => postAction('complete')}>
          <FontAwesome5 name="check" size={16} color="#00796B" style={{ marginRight: 8 }} />
          <Text style={styles.textTeal}>{t('markCompleted') || 'Mark Completed'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionBtn, styles.btnSolidTeal]} onPress={() => router.push(`/(phc)/consultations`)}>
          <FontAwesome5 name="edit" size={16} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.textWhite}>Back</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  patientName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  abhaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  abhaText: {
    fontSize: 12,
    color: '#00796B',
    fontWeight: '600',
  },
  demographics: {
    fontSize: 14,
    color: '#666',
  },
  triageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#444',
  },
  triageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    backgroundColor: '#FFEBEE',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FFCDD2',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  triageText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  symptomsText: {
    fontSize: 15,
    color: '#555',
    marginTop: 6,
  },
  historyRow: {
    flexDirection: 'row',
    marginTop: 12,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    width: 60,
  },
  historySeparator: {
    marginHorizontal: 12,
    color: '#999',
  },
  historyDetail: {
    fontSize: 14,
    color: '#444',
    flex: 1,
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 40,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
  },
  btnOutlineRed: {
    borderColor: '#F44336',
    backgroundColor: '#FFEBEE',
  },
  textRed: {
    color: '#F44336',
    fontWeight: '600',
    fontSize: 16,
  },
  btnOutlineBlue: {
    borderColor: '#3F51B5',
    backgroundColor: '#E8EAF6',
  },
  textBlue: {
    color: '#3F51B5',
    fontWeight: '600',
    fontSize: 16,
  },
  btnOutlineTeal: {
    borderColor: '#00796B',
    backgroundColor: '#E0F2F1',
  },
  textTeal: {
    color: '#00796B',
    fontWeight: '600',
    fontSize: 16,
  },
  btnSolidTeal: {
    borderColor: '#00796B',
    backgroundColor: '#00796B',
  },
  textWhite: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
