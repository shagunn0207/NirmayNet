import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PatientRecordScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Top Header Card */}
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.patientName}>Rekha Patil</Text>
          <View style={styles.abhaBadge}>
            <FontAwesome5 name="check-circle" size={12} color="#00796B" style={{ marginRight: 4 }} />
            <Text style={styles.abhaText}>ABHA linked</Text>
          </View>
        </View>
        <Text style={styles.demographics}>28F · Chinchpada</Text>
      </View>

      {/* Triage and Symptoms */}
      <View style={styles.card}>
        <View style={styles.triageRow}>
          <Text style={styles.sectionTitle}>Current triage: </Text>
          <View style={styles.triageBadge}>
            <View style={[styles.indicator, { backgroundColor: '#F44336' }]} />
            <Text style={[styles.triageText, { color: '#F44336' }]}>Emergency</Text>
          </View>
        </View>
        
        <Text style={[styles.sectionTitle, { marginTop: 16 }]}>Symptoms reported:</Text>
        <Text style={styles.symptomsText}>Breathlessness, swelling</Text>
        <Text style={styles.symptomsText}>7 months pregnant</Text>
      </View>

      {/* Visit History */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Visit history:</Text>
        
        <View style={styles.historyRow}>
          <Text style={styles.historyDate}>15 Aug</Text>
          <Text style={styles.historySeparator}>—</Text>
          <Text style={styles.historyDetail}>BP: 130/85</Text>
        </View>
        
        <View style={styles.historyRow}>
          <Text style={styles.historyDate}>01 Aug</Text>
          <Text style={styles.historySeparator}>—</Text>
          <Text style={styles.historyDetail}>ANC routine</Text>
        </View>
        
        <View style={styles.historyRow}>
          <Text style={styles.historyDate}>12 Jul</Text>
          <Text style={styles.historySeparator}>—</Text>
          <Text style={styles.historyDetail}>Iron supplement</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionBtn, styles.btnOutlineRed]}>
          <FontAwesome5 name="arrow-up" size={16} color="#F44336" style={{ marginRight: 8 }} />
          <Text style={styles.textRed}>Upgrade to Emergency</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionBtn, styles.btnOutlineBlue]}>
          <FontAwesome5 name="ambulance" size={16} color="#3F51B5" style={{ marginRight: 8 }} />
          <Text style={styles.textBlue}>Refer to District Hosp</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionBtn, styles.btnOutlineTeal]}>
          <FontAwesome5 name="stethoscope" size={16} color="#00796B" style={{ marginRight: 8 }} />
          <Text style={styles.textTeal}>Treat at PHC</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionBtn, styles.btnSolidTeal]}>
          <FontAwesome5 name="edit" size={16} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.textWhite}>Add Note</Text>
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
