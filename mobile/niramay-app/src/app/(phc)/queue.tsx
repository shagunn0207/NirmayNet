import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BACKEND_URL } from '../../lib/apiClient';

const dummyQueue = [
  { id: '1', patientName: 'Sanjay Kumar', status: 'In Progress', type: 'Walk-in', token: 'P-004', priorityColor: '#F44336' },
  { id: '2', patientName: 'Meena Devi', status: 'Waiting', type: 'Referral', token: 'P-005', priorityColor: '#FFC107' },
  { id: '3', patientName: 'Ramesh Patel', status: 'Waiting', type: 'Walk-in', token: 'P-006', priorityColor: '#4CAF50' }
];

export default function PhcQueueScreen() {
  const { t, session } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!session?.access_token) return;
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/queue/hospital`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setItems(data || []);
      } catch (err) {
        console.warn('Failed to load queue', err);
      }
    };
    load();
  }, [session]);

  const handleCall = async (item: any) => {
    try {
      if (!session?.access_token) return;
      // start consultation (arrive -> consult flows may be handled separately)
      const res = await fetch(`${BACKEND_URL}/api/v1/teleconsult/room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ patient_id: item.patient_id, referral_id: item.referral_id, notes: 'PHC call' }),
      });
      if (!res.ok) throw new Error('Failed to start call');
      const data = await res.json();
      if (data?.jitsi_url) {
        await Linking.openURL(data.jitsi_url);
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Unable to start call');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.headerTitle}>{t('phc.queue.title')} ({items.length} {t('phc.queue.subtitle')})</Text>
      
      {items.map(item => (
        <View key={String(item.referral_id)} style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.headerLeft}>
              <View style={[styles.indicator, { backgroundColor: item.triage_category === 'EMERGENCY' ? '#F44336' : (item.triage_category === 'URGENT' ? '#FFC107' : '#4CAF50') }]} />
              <Text style={styles.token}>{item.referral_code || ''}</Text>
              <Text style={styles.dotSeparator}>·</Text>
              <Text style={styles.typeText}>{item.referral_reason || 'Referral'}</Text>
            </View>
          </View>
          
          <View style={styles.patientInfo}>
            <Text style={styles.patientName}>{item.patient_name}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => handleCall(item)}>
              <Text style={styles.primaryButtonText}>
                {item.referral_status === 'IN_CONSULTATION' ? t('phc.queue.btn.resume') : t('phc.queue.btn.call')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push(`/(phc)/patient-record?referral_id=${item.referral_id}`)}>
              <Text style={styles.secondaryButtonText}>{t('phc.record.btn.view')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  indicator: { width: 12, height: 12, borderRadius: 6, marginRight: 8 },
  token: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  dotSeparator: { marginHorizontal: 8, color: '#666' },
  typeText: { fontSize: 14, color: '#666' },
  patientInfo: { marginBottom: 16 },
  patientName: { fontSize: 16, fontWeight: 'bold' },
  actionRow: { flexDirection: 'row', gap: 12 },
  primaryButton: { flex: 1, backgroundColor: '#00796B', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontWeight: 'bold' },
  secondaryButton: { flex: 1, backgroundColor: '#E0F2F1', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  secondaryButtonText: { color: '#00796B', fontWeight: 'bold' },
});
