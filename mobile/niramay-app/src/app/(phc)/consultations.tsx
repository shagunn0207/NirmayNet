import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useAuth } from '../../store/AuthContext';

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
  const { t } = useAuth();

  const renderItem = ({ item }: { item: typeof dummyConsultations[0] }) => (
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
        <TouchableOpacity style={styles.primaryButton}>
          <FontAwesome5 name="video" size={14} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.primaryButtonText}>Join Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/(phc)/patient-record')}>
          <FontAwesome5 name="file-medical-alt" size={14} color="#00796B" style={{ marginRight: 8 }} />
          <Text style={styles.secondaryButtonText}>{t('phc.record.btn.view')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>{t('phc.consult.title')} (2)</Text>
      <FlatList
        data={dummyConsultations}
        keyExtractor={item => item.id}
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
