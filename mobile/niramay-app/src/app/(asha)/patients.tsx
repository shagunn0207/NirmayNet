import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, ActivityIndicator, RefreshControl
} from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { BACKEND_URL } from '../../lib/apiClient';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { getOfflinePatients } from '../../lib/syncQueue';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone?: string;
  village?: string;
  abha_id?: string;
  allergies?: string;
  risk?: 'Low' | 'Medium' | 'High';
  statusNote?: string;
  triageCategory?: 'EMERGENCY' | 'URGENT' | 'ROUTINE';
  lastVisit?: string;
  nextFollowup?: string;
}

const DEFAULT_PATIENTS: Patient[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Rekha Patil',
    age: 28,
    gender: 'Female',
    phone: '9823011234',
    village: 'Chinchpada',
    abha_id: '91-8823-4410-12',
    allergies: 'None',
    risk: 'High',
    statusNote: 'Follow-up due',
    lastVisit: '12 Sep 2026',
    nextFollowup: '19 Sep 2026',
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Sunita Kamble',
    age: 34,
    gender: 'Female',
    phone: '9421056789',
    village: 'Chinchpada',
    abha_id: '91-3341-9920-55',
    allergies: 'None',
    risk: 'Medium',
    statusNote: 'Follow-up due',
    lastVisit: '10 Sep 2026',
    nextFollowup: '15 Sep 2026',
  },
];

export default function PatientsScreen() {
  const { session, t } = useAuth();
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>(DEFAULT_PATIENTS);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'High-Risk' | 'Follow-ups'>('All');

  // Selected Patient for Profile Detail View (Screen 5)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [profileTab, setProfileTab] = useState<'Overview' | 'History' | 'Follow-ups'>('Overview');

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const offlineList = await getOfflinePatients();
      const offlinePatients: Patient[] = offlineList.map(p => ({
        id: p.id,
        name: `${p.name} (Offline)`,
        age: p.age,
        gender: p.gender,
        phone: p.phone || '9876543210',
        village: p.village || 'Chinchpada',
        abha_id: p.abha_id,
        allergies: p.allergies || 'None',
        risk: 'Medium',
        statusNote: 'Saved offline - syncing',
        lastVisit: 'Today',
        nextFollowup: 'Scheduled',
      }));

      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${BACKEND_URL}/api/v1/patients/`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const apiPatients: Patient[] = data.map((p: any, idx: number) => ({
            id: String(p.id),
            name: p.name || 'Unnamed Patient',
            age: Number(p.age) || 30,
            gender: p.gender || 'Female',
            phone: p.phone || '9876543210',
            village: p.village || 'Chinchpada',
            abha_id: p.abha_id,
            allergies: p.allergies || 'None',
            risk: idx % 3 === 0 ? 'High' : idx % 3 === 1 ? 'Medium' : 'Low',
            statusNote: idx % 3 === 0 ? 'High-risk' : idx % 3 === 1 ? 'Follow-up due' : 'Stable',
            lastVisit: '12 Sep 2026',
            nextFollowup: '19 Sep 2026',
          }));
          setPatients([...offlinePatients, ...apiPatients]);
          return;
        }
      }
      if (offlinePatients.length > 0) {
        setPatients(offlinePatients);
      }
    } catch {
      // Keep DEFAULT_PATIENTS on fallback
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPatients();
    }, [session])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPatients();
    setRefreshing(false);
  };

  // Filtered patients
  const filteredPatients = useMemo(() => {
    return patients.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.village && p.village.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.phone && p.phone.includes(searchQuery));

      if (!matchesSearch) return false;
      if (activeTab === 'High-Risk') return p.risk === 'High' || p.statusNote?.toLowerCase().includes('high');
      if (activeTab === 'Follow-ups') return p.statusNote?.toLowerCase().includes('follow-up') || p.risk === 'Medium';
      return true;
    });
  }, [patients, searchQuery, activeTab]);

  // ───────────────────────────────────────────────────────────────────────────
  // SCREEN 5: PATIENT PROFILE VIEW
  // ───────────────────────────────────────────────────────────────────────────
  if (selectedPatient) {
    const initial = selectedPatient.name ? selectedPatient.name.charAt(0).toUpperCase() : 'P';
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.profileContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Back Button */}
        <View style={styles.topHeaderRow}>
          <TouchableOpacity style={styles.roundBackBtn} onPress={() => setSelectedPatient(null)}>
            <FontAwesome5 name="arrow-left" size={16} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.topHeaderTitle}>{t('patientProfile')}</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Profile Card Header */}
        <View style={styles.profileHeroCard}>
          <View style={[styles.bigAvatar, { backgroundColor: selectedPatient.gender === 'Female' ? '#E6F4EA' : '#EFF6FF' }]}>
            <Text style={[styles.bigAvatarText, { color: selectedPatient.gender === 'Female' ? '#059669' : '#2563EB' }]}>
              {initial}
            </Text>
          </View>
          <Text style={styles.profileName}>{selectedPatient.name}</Text>
          <Text style={styles.profileSub}>
            {selectedPatient.age} years • {selectedPatient.gender}
          </Text>
        </View>

        {/* Profile Sub-tabs */}
        <View style={styles.profileTabsBar}>
          {(['Overview', 'History', 'Follow-ups'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              style={[styles.profileTabBtn, profileTab === tab && styles.profileTabBtnActive]}
              onPress={() => setProfileTab(tab)}
            >
              <Text style={[styles.profileTabText, profileTab === tab && styles.profileTabTextActive]}>
                {tab === 'Overview' ? t('overview') : tab === 'History' ? t('history') : t('followupTitle')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab 1: Overview */}
        {profileTab === 'Overview' && (
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('Phone')}</Text>
              <Text style={styles.detailValue}>{selectedPatient.phone || 'Not provided'}</Text>
            </View>
            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('village')}</Text>
              <Text style={styles.detailValue}>{selectedPatient.village || 'Nandurbar'}</Text>
            </View>
            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('riskLevel')}</Text>
              <View
                style={[
                  styles.riskBadge,
                  selectedPatient.risk === 'High'
                    ? styles.riskBadgeHigh
                    : selectedPatient.risk === 'Medium'
                      ? styles.riskBadgeMed
                      : styles.riskBadgeLow,
                ]}
              >
                <Text
                  style={[
                    styles.riskBadgeText,
                    selectedPatient.risk === 'High'
                      ? styles.riskTextHigh
                      : selectedPatient.risk === 'Medium'
                        ? styles.riskTextMed
                        : styles.riskTextLow,
                  ]}
                >
                  {selectedPatient.risk || 'Low'}
                </Text>
              </View>
            </View>
            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('lastVisitLabel')}</Text>
              <Text style={styles.detailValue}>{selectedPatient.lastVisit || '12 Sep 2026'}</Text>
            </View>
            <View style={styles.detailDivider} />

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{t('nextFollowupLabel')}</Text>
              <Text style={styles.detailValue}>{selectedPatient.nextFollowup || '19 Sep 2026'}</Text>
            </View>
          </View>
        )}

        {/* Tab 2: History */}
        {profileTab === 'History' && (
          <View style={styles.detailsCard}>
            <View style={styles.historyItem}>
              <Text style={styles.historyDate}>12 Sep 2026 • ASHA Home Visit</Text>
              <Text style={styles.historyText}>Vitals checked. Blood pressure normal. Prescribed routine iron tablets.</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.historyItem}>
              <Text style={styles.historyDate}>28 Aug 2026 • PHC Consultation</Text>
              <Text style={styles.historyText}>General health checkup. Follow-up advised in 2 weeks.</Text>
            </View>
          </View>
        )}

        {/* Tab 3: Follow-ups */}
        {profileTab === 'Follow-ups' && (
          <View style={styles.detailsCard}>
            <View style={styles.historyItem}>
              <Text style={styles.historyDate}>Scheduled: 19 Sep 2026</Text>
              <Text style={styles.historyText}>Home visit for maternal care checkup & nutritional review.</Text>
            </View>
          </View>
        )}

        {/* Action Buttons: 1. Add Follow-up, 2. Create Referral */}
        <View style={styles.actionBtnRow}>
          <TouchableOpacity
            style={[styles.actionHalfBtn, styles.actionHalfBtnFollowup]}
            activeOpacity={0.85}
            onPress={() => {
              router.push({
                pathname: '/(asha)/followup',
                params: {
                  patientId: selectedPatient.id,
                  patientName: selectedPatient.name,
                },
              });
            }}
          >
            <FontAwesome5 name="calendar-check" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.actionHalfBtnText}>{t('scheduleFollowup')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionHalfBtn, styles.actionHalfBtnReferral]}
            activeOpacity={0.85}
            onPress={() => {
              router.push({
                pathname: '/(asha)/referral',
                params: {
                  patientId: selectedPatient.id,
                  patientName: selectedPatient.name,
                },
              });
            }}
          >
            <FontAwesome5 name="file-medical-alt" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.actionHalfBtnText}>{t('makeReferral')}</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.actionHalfBtn, { backgroundColor: '#0F766E', shadowColor: '#0F766E', marginTop: 10 }]}
          activeOpacity={0.85}
          onPress={() => {
            router.push({
              pathname: '/(asha)/consultation',
              params: {
                patient_id: selectedPatient.id,
              },
            });
          }}
        >
          <FontAwesome5 name="video" size={14} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.actionHalfBtnText}>{t('startConsultBtn') || 'Start Teleconsultation'}</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // SCREEN 4: MY PATIENTS LIST
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.listHeader}>
        <Text style={styles.listHeaderTitle}>{t('myPatients')}</Text>
        <TouchableOpacity
          style={styles.addPatientMiniBtn}
          onPress={() => router.push('/(asha)/register')}
        >
          <FontAwesome5 name="user-plus" size={14} color="#059669" />
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchBar}>
        <FontAwesome5 name="search" size={14} color="#94A3B8" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('searchPlaceholder')}
          placeholderTextColor="#94A3B8"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <FontAwesome5 name="times-circle" size={14} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Tabs: All | High-Risk | Follow-ups */}
      <View style={styles.filterTabsRow}>
        {(['All', 'High-Risk', 'Follow-ups'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.filterChip, activeTab === tab && styles.filterChipActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.filterChipText, activeTab === tab && styles.filterChipTextActive]}>
              {tab === 'All' ? t('filterAll') : tab === 'High-Risk' ? t('filterHighRisk') : t('followupTitle')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Patient List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#059669']} />}
        showsVerticalScrollIndicator={false}
      >
        {loading && !refreshing ? (
          <ActivityIndicator size="small" color="#059669" style={{ marginTop: 24 }} />
        ) : filteredPatients.length === 0 ? (
          <View style={styles.emptyWrap}>
            <FontAwesome5 name="user-slash" size={32} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>{t('noPatientsFound')}</Text>
          </View>
        ) : (
          filteredPatients.map((patient) => {
            const initial = patient.name ? patient.name.charAt(0).toUpperCase() : 'P';
            return (
              <TouchableOpacity
                key={patient.id}
                style={styles.patientCard}
                activeOpacity={0.85}
                onPress={() => setSelectedPatient(patient)}
              >
                {/* Avatar Initial Circle */}
                <View
                  style={[
                    styles.avatarCircle,
                    {
                      backgroundColor:
                        patient.risk === 'High'
                          ? '#FEE2E2'
                          : patient.risk === 'Medium'
                            ? '#FEF3C7'
                            : '#E0F2FE',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.avatarInitial,
                      {
                        color:
                          patient.risk === 'High'
                            ? '#DC2626'
                            : patient.risk === 'Medium'
                              ? '#D97706'
                              : '#0284C7',
                      },
                    ]}
                  >
                    {initial}
                  </Text>
                </View>

                {/* Info Text */}
                <View style={styles.patientInfoGroup}>
                  <Text style={styles.patientCardName}>{patient.name}</Text>
                  <Text style={styles.patientCardSub}>
                    {patient.age} years • {patient.statusNote || 'Stable'}
                  </Text>
                </View>

                {/* Chevron */}
                <FontAwesome5 name="chevron-right" size={13} color="#94A3B8" />
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  listHeaderTitle: {
    fontSize: 20,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
  },
  addPatientMiniBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F4EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 10,
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#0F172A',
  },
  filterTabsRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 10,
  },
  emptyWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 48,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
    marginTop: 12,
  },
  patientCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarInitial: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
  },
  patientInfoGroup: {
    flex: 1,
  },
  patientCardName: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  patientCardSub: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 3,
  },

  // ── Profile Detail Styles ──
  profileContent: {
    padding: 16,
    paddingBottom: 36,
  },
  topHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  roundBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  topHeaderTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  profileHeroCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  bigAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  bigAvatarText: {
    fontSize: 26,
    fontFamily: 'Inter_800ExtraBold',
  },
  profileName: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
  },
  profileSub: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 2,
  },
  profileTabsBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    marginBottom: 16,
  },
  profileTabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
  },
  profileTabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  profileTabText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  profileTabTextActive: {
    fontFamily: 'Inter_700Bold',
    color: '#059669',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#0F172A',
  },
  riskBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskBadgeHigh: {
    backgroundColor: '#FEE2E2',
  },
  riskBadgeMed: {
    backgroundColor: '#FEF3C7',
  },
  riskBadgeLow: {
    backgroundColor: '#ECFDF5',
  },
  riskBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  riskTextHigh: {
    color: '#DC2626',
  },
  riskTextMed: {
    color: '#D97706',
  },
  riskTextLow: {
    color: '#059669',
  },
  historyItem: {
    paddingVertical: 8,
  },
  historyDate: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#059669',
    marginBottom: 4,
  },
  historyText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#334155',
    lineHeight: 18,
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionHalfBtn: {
    flex: 1,
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  actionHalfBtnReferral: {
    backgroundColor: '#7C3AED',
    shadowColor: '#7C3AED',
  },
  actionHalfBtnFollowup: {
    backgroundColor: '#059669',
    shadowColor: '#059669',
  },
  actionHalfBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
});
