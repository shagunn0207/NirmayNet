import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Linking } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '../../store/AuthContext';
import { BACKEND_URL } from '../../lib/apiClient';

const dummyConsultations = [
  {
    id: '1',
    ashaName: 'Savitribai',
    location: 'Chinchpada',
    patientName: 'Rekha',
    patientDetails: '28F',
    symptoms: 'Breathlessness • Pregnancy',
    triage: 'EMERGENCY',
    triageColor: '#F44336',
  },
  {
    id: '2',
    ashaName: 'Anita',
    location: 'Nandgaon',
    patientName: 'Baby Arjun',
    patientDetails: '1M',
    symptoms: 'Fever • Vomiting',
    triage: 'URGENT',
    triageColor: '#FFC107',
  }
];

export default function PhcConsultationsScreen() {
  const router = useRouter();
  const { t, session } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!session?.access_token) return;
      setLoading(true);
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/queue/hospital`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setItems(data || []);
      } catch (err) {
        console.warn('Failed to load queue', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [session]);

  const handleJoin = async (item: any) => {
    try {
      if (!session?.access_token) {
        Alert.alert('Not authenticated');
        return;
      }

      // If teleconsult already exists, open it; otherwise create a room
      if (item.has_teleconsult) {
        const res = await fetch(`${BACKEND_URL}/api/v1/queue/${item.referral_id}`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) throw new Error('Failed to fetch consult');
        const detail = await res.json();
        if (detail.teleconsult?.jitsi_url) {
          await Linking.openURL(detail.teleconsult.jitsi_url);
          return;
        }
      }

      // create teleconsult room
      const response = await fetch(`${BACKEND_URL}/api/v1/teleconsult/room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        body: JSON.stringify({ patient_id: item.patient_id, referral_id: item.referral_id, notes: 'PHC initiated teleconsult' }),
      });
      if (!response.ok) throw new Error('Failed to create room');
      const room = await response.json();
      if (room?.jitsi_url) await Linking.openURL(room.jitsi_url);
    } catch (err: any) {
      Alert.alert(t('consultationErrorTitle') || 'Error', err?.message || (t('consultationErrorMsg') || 'Unable to join call'));
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={[styles.indicator, { backgroundColor: item.triageColor }]} />
          <Text style={styles.ashaName}>{item.ashaName} — {item.location}</Text>
        </View>
        <Text style={[styles.triageBadge, { color: item.triageColor, borderColor: item.triageColor }]}>
          {item.triage}
        </Text>
      </View>
      
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.patientName}, {item.patientDetails}</Text>
        <Text style={styles.symptoms}>{item.symptoms}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => handleJoin(item)}>
          <FontAwesome5 name="video" size={14} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.primaryButtonText}>{t('joinCall') || 'Join Call'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push(`/(phc)/patient-record?referral_id=${item.referral_id}`)}>
          <FontAwesome5 name="file-medical-alt" size={14} color="#00796B" style={{ marginRight: 8 }} />
          <Text style={styles.secondaryButtonText}>{t('phc.record.btn.view')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{t('phc.consult.title')} ({items.length})</Text>
      <FlatList
        data={items}
        keyExtractor={item => String(item.referral_id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    padding: 16,
    paddingBottom: 8,
  },
  listContent: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  ashaName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  triageBadge: {
    fontSize: 10,
    fontWeight: 'bold',
    borderWidth: 1,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  patientInfo: {
    marginBottom: 16,
  },
  patientName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#444',
    marginBottom: 4,
  },
  symptoms: {
    fontSize: 14,
    color: '#666',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#00796B',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#E0F2F1',
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  secondaryButtonText: {
    color: '#00796B',
    fontWeight: '600',
    fontSize: 14,
  },
});
