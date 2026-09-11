import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BACKEND_URL } from '../../lib/apiClient';

export default function PhcReferralsScreen() {
  const { t, session } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!session?.access_token) return;
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/referrals`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.access_token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setItems(data || []);
      } catch (err) {
        console.warn('Failed to load referrals', err);
      }
    };
    load();
  }, [session]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.headerTitle}>{t('phc.referral.title')}</Text>
      <Text style={styles.subtitle}>{t('phc.referral.subtitle')}</Text>
      
      {items.map(item => (
        <View key={String(item.id)} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.patientName}>{item.referral_code || item.id}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: item.status === 'ADMITTED' ? '#E8F5E9' : '#FFF3E0' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: item.status === 'ADMITTED' ? '#2E7D32' : '#E65100' }
              ]}>
                {item.status}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailsRow}>
            <FontAwesome5 name="hospital" size={14} color="#666" style={{ marginRight: 8 }} />
            <Text style={styles.detailsText}>{item.destination_hospital}</Text>
          </View>

          <TouchableOpacity style={styles.viewBtn} onPress={() => router.push(`/(phc)/patient-record?referral_id=${item.id}`)}>
            <Text style={styles.viewBtnText}>{t('phc.referral.btn.details')}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  patientName: { fontSize: 18, fontWeight: 'bold' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  detailsRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  detailsText: { fontSize: 14, color: '#444' },
  viewBtn: { marginTop: 12, backgroundColor: '#00796B', padding: 12, borderRadius: 8, alignItems: 'center' },
  viewBtnText: { color: '#fff', fontWeight: 'bold' }
});
