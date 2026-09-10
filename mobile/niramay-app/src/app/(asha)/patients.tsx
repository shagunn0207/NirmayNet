import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function PatientsScreen() {
  const { t, user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  
  const [sexFilter, setSexFilter] = useState<'all' | 'Male' | 'Female' | 'Other'>('all');
  const [ageFilter, setAgeFilter] = useState<'all' | 'infant' | 'child' | 'adult' | 'middle' | 'senior'>('all');

  const getAgeGroup = (age: number) => {
    if (age <= 5) return 'infant';
    if (age <= 18) return 'child';
    if (age <= 45) return 'adult';
    if (age <= 55) return 'middle';
    return 'senior';
  };

  useFocusEffect(
    useCallback(() => {
      fetchPatients();
      
      // Subscribe to realtime updates for patients
      const channel = supabase.channel('public:patients')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'patients' }, (payload) => {
          fetchPatients(); // Re-fetch all patients when a change occurs
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }, [user])
  );

  const fetchPatients = async () => {
    setIsLoading(true);
    if (user) {
      const { data, error } = await supabase.from('patients').select('*').eq('asha_id', user.id).order('created_at', { ascending: false });
      if (!error && data) {
        setPatients(data);
      }
    }
    setIsLoading(false);
  };

  const filtered = patients.filter(p => {
    const qLower = query.toLowerCase();
    const nameMatch = p.name.toLowerCase().includes(qLower) || p.village.toLowerCase().includes(qLower) || (p.abha_id && p.abha_id.toLowerCase().includes(qLower));
    const sexMatch = sexFilter === 'all' || (sexFilter === 'Female' && p.gender === 'F') || (sexFilter === 'Male' && p.gender === 'M') || (sexFilter === 'Other' && p.gender === 'Other');
    const ageMatch = ageFilter === 'all' || getAgeGroup(p.age) === ageFilter;
    return nameMatch && sexMatch && ageMatch;
  });

  const selectedPatient = patients.find(p => p.id === selectedId);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.searchContainer}>
        <View style={styles.searchInputWrapper}>
          <FontAwesome5 name="search" size={16} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchPlaceholder') || 'Search name or ABHA ID'}
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity style={styles.micBtn}>
            <FontAwesome5 name="microphone" size={16} color="#0F766E" />
          </TouchableOpacity>
        </View>

        {/* Dropdown Filter */}
        <TouchableOpacity 
          style={[styles.dropdownButton, { marginTop: 12 }]} 
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.dropdownButtonText}>
            {sexFilter === 'all' ? '👥 ' + (t('allPatients') || 'All') :
             sexFilter === 'Female' ? '👩 ' + (t('sexFemale') || 'Female') :
             sexFilter === 'Male' ? '👨 ' + (t('sexMale') || 'Male') :
             '🧑 ' + (t('sexOther') || 'Other')}
          </Text>
          <FontAwesome5 name="chevron-down" size={12} color="#0F766E" />
        </TouchableOpacity>

        <Modal visible={showFilterModal} transparent animationType="fade">
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowFilterModal(false)}>
            <View style={styles.modalContent}>
              {[
                { key: 'all', icon: '👥', label: t('allPatients') || 'All' },
                { key: 'Female', icon: '👩', label: t('sexFemale') || 'Female' },
                { key: 'Male', icon: '👨', label: t('sexMale') || 'Male' },
                { key: 'Other', icon: '🧑', label: t('sexOther') || 'Other' },
              ].map(g => (
                <TouchableOpacity
                  key={g.key}
                  style={[styles.dropdownItem, sexFilter === g.key && styles.dropdownItemActive]}
                  onPress={() => { setSexFilter(g.key as any); setShowFilterModal(false); }}
                >
                  <Text style={[styles.dropdownItemText, sexFilter === g.key && styles.dropdownItemTextActive]}>
                    {g.icon} {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      <ScrollView style={styles.listContainer}>
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{t('noPatientsFound') || 'No patients found'}</Text>
          </View>
        ) : (
          filtered.map(patient => (
            <TouchableOpacity
              key={patient.id}
              style={styles.patientCard}
              onPress={() => setSelectedId(patient.id)}
            >
              <View style={styles.patientCardLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{patient.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.patientName}>{patient.name}</Text>
                  <Text style={styles.patientSub}>{patient.age} yrs • {patient.gender === 'F' ? 'Female' : patient.gender === 'M' ? 'Male' : 'Other'} • {patient.village}</Text>
                </View>
              </View>
              <View style={[
                styles.urgencyDot, 
                { backgroundColor: patient.lastTriage === 'EMERGENCY' ? '#EF4444' : patient.lastTriage === 'URGENT' ? '#F59E0B' : '#22C55E' }
              ]} />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Patient Detail Modal */}
      <Modal visible={!!selectedId} animationType="slide" presentationStyle="pageSheet">
        {selectedPatient && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setSelectedId(null)} style={styles.iconBtn}>
                <FontAwesome5 name="chevron-down" size={20} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>{selectedPatient.name}</Text>
                <Text style={styles.modalSubtitle}>{selectedPatient.age} yrs • {selectedPatient.gender === 'F' ? 'Female' : selectedPatient.gender === 'M' ? 'Male' : 'Other'}</Text>
              </View>
              <TouchableOpacity style={styles.editBtn}>
                <FontAwesome5 name="edit" size={14} color="#FFFFFF" />
                <Text style={styles.editBtnText}>{t('edit') || 'Edit'}</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: selectedPatient.lastTriage === 'EMERGENCY' ? '#EF4444' : '#22C55E' }]}>
                <Text style={styles.sectionTitle}>{t('currentStatus') || 'Current Status'}</Text>
                <Text style={styles.guidanceText}>
                  {selectedPatient.lastTriage === 'EMERGENCY' ? 'Requires immediate medical attention.' : 'Routine checkup recommended.'}
                </Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.sectionTitle}>{t('basicInfo') || 'Basic Info'}</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>ABHA ID</Text>
                  <Text style={styles.infoValue}>{selectedPatient.abha_id || 'Not Provided'}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('village') || 'Village'}</Text>
                  <Text style={styles.infoValue}>{selectedPatient.village}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>{t('mobileLabel') || 'Mobile'}</Text>
                  <Text style={styles.infoValue}>{selectedPatient.phone || 'Not Provided'}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
        )}
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    fontFamily: 'OpenSans_400Regular',
  },
  micBtn: {
    padding: 8,
    backgroundColor: '#F0FDFA',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CCFBF1',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownButtonText: {
    fontSize: 15,
    fontFamily: 'OpenSans_400Regular',
    fontFamily: 'Inter_600SemiBold',
    color: '#0F172A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dropdownItemActive: {
    backgroundColor: '#F0FDFA',
  },
  dropdownItemText: {
    fontSize: 15,
    fontFamily: 'OpenSans_400Regular',
    fontFamily: 'Inter_500Medium',
    color: '#475569',
  },
  dropdownItemTextActive: {
    color: '#0F766E',
    fontFamily: 'Inter_700Bold',
  },
  listContainer: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 16,
    fontFamily: 'OpenSans_400Regular',
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  patientCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0F766E',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'OpenSans_400Regular',
    fontFamily: 'Inter_700Bold',
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'OpenSans_400Regular',
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  patientSub: {
    fontSize: 13,
    fontFamily: 'OpenSans_400Regular',
    color: '#64748B',
    marginTop: 2,
  },
  urgencyDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  modalHeader: {
    backgroundColor: '#0F766E',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48, // approximate safe area
  },
  iconBtn: {
    padding: 8,
  },
  modalTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'OpenSans_400Regular',
    fontFamily: 'Inter_700Bold',
  },
  modalSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontFamily: 'OpenSans_400Regular',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  editBtnText: {
    color: '#FFFFFF',
    marginLeft: 6,
    fontFamily: 'Inter_600SemiBold',
  },
  modalBody: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'OpenSans_400Regular',
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  guidanceText: {
    color: '#334155',
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: 'OpenSans_400Regular',
  },
  infoValue: {
    color: '#0F172A',
    fontSize: 14,
    fontFamily: 'OpenSans_400Regular',
    fontFamily: 'Inter_600SemiBold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
});
