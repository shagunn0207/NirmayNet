import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';

const dummyReferrals = [
  { id: '1', patientName: 'Ramesh Patel', destination: 'Nandurbar District Hospital', status: 'In Transit', date: 'Today, 09:30 AM' },
  { id: '2', patientName: 'Sunita', destination: 'Nandurbar District Hospital', status: 'Admitted', date: 'Yesterday' }
];

export default function PhcReferralsScreen() {
  const { t } = useAuth();
  
  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      <Text style={styles.headerTitle}>{t('phc.referral.title')}</Text>
      <Text style={styles.subtitle}>{t('phc.referral.subtitle')}</Text>
      
      {dummyReferrals.map(item => (
        <View key={item.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.patientName}>{item.patientName}</Text>
            <View style={[
              styles.statusBadge,
              { backgroundColor: item.status === 'Admitted' ? '#E8F5E9' : '#FFF3E0' }
            ]}>
              <Text style={[
                styles.statusText,
                { color: item.status === 'Admitted' ? '#2E7D32' : '#E65100' }
              ]}>
                {item.status === 'Admitted' ? t('phc.referral.status.admitted') : item.status === 'In Transit' ? t('phc.referral.status.transit') : t('phc.referral.status.discharged')}
              </Text>
            </View>
          </View>
          
          <View style={styles.detailsRow}>
            <FontAwesome5 name="hospital" size={14} color="#666" style={{ marginRight: 8 }} />
            <Text style={styles.detailsText}>{item.destination}</Text>
          </View>
          
          <View style={styles.detailsRow}>
            <FontAwesome5 name="clock" size={14} color="#666" style={{ marginRight: 8 }} />
            <Text style={styles.detailsText}>{item.date}</Text>
          </View>

          <TouchableOpacity style={styles.viewBtn}>
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
