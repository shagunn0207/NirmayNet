import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, RefreshControl
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../store/AuthContext';
import { BACKEND_URL } from '../../lib/apiClient';

interface PatientRecordData {
  id: string;
  name: string;
  age: number | string;
  gender: string;
  village: string;
  phone?: string;
  allergies?: string;
  abha_id?: string;
  created_at?: string;
}

interface ReferralRecordData {
  id: string;
  referral_code?: string;
  reason?: string;
  destination_hospital?: string;
  status: string;
  created_at: string;
}

export default function PhcPatientRecordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { session } = useAuth();

  const patientId = (params.patientId as string) || '';
  const initialName = (params.name as string) || 'Patient';
  const initialAge = (params.age as string) || '30';
  const initialGender = (params.gender as string) || 'Female';
  const initialVillage = (params.village as string) || 'Nandurbar';
  const initialPhone = (params.phone as string) || '';
  const initialHistory = (params.history as string) || '';

  const [activeTab, setActiveTab] = useState<'Overview' | 'Consultations' | 'Referrals'>('Overview');
  const [patient, setPatient] = useState<PatientRecordData | null>(null);
  const [referrals, setReferrals] = useState<ReferralRecordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPatientData = async () => {
    if (!patientId) return;
    setLoading(true);
    try {
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Parallel fetch patient details and patient referrals
      const [patRes, refRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/v1/patients/${patientId}`, { headers }),
        fetch(`${BACKEND_URL}/api/v1/referrals/?patient_id=${patientId}`, { headers }),
      ]);

      if (patRes.ok) {
        const pData = await patRes.json();
        setPatient(pData);
      }

      if (refRes.ok) {
        const rData = await refRes.json();
        if (Array.isArray(rData)) {
          setReferrals(rData);
        }
      }
    } catch {
      // Keep state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, [patientId, session]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPatientData();
    setRefreshing(false);
  };

  const displayName = patient?.name || initialName;
  const displayAge = patient?.age ? String(patient.age) : initialAge;
  const displayGender = patient?.gender || initialGender;
  const displayVillage = patient?.village || initialVillage;
  const displayPhone = patient?.phone || initialPhone || 'Not provided';
  const displayAllergies = patient?.allergies || (initialHistory.includes('Allergies') ? initialHistory : null);
  const displayAbha = patient?.abha_id || 'Not linked';

  const initial = displayName.charAt(0).toUpperCase();

  const regDate = patient?.created_at
    ? new Date(patient.created_at).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '12 Sep 2026';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={16} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Records</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Hero Profile Card */}
      <View style={styles.heroCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.heroName}>{displayName}</Text>
        <Text style={styles.heroSub}>{displayAge} years • {displayGender}</Text>
      </View>

      {/* Tabs: Overview | Consultations | Referrals */}
      <View style={styles.tabBar}>
        {(['Overview', 'Consultations', 'Referrals'] as const).map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab 1: Overview */}
      {activeTab === 'Overview' && (
        <View style={styles.detailsCard}>
          {displayAllergies ? (
            <>
              <View style={[styles.detailRow, { backgroundColor: '#FEF2F2', paddingHorizontal: 10, paddingVertical: 8, borderRadius: 8 }]}>
                <Text style={[styles.detailLabel, { color: '#DC2626', fontWeight: 'bold' }]}>⚠️ Known Allergies</Text>
                <Text style={[styles.detailValue, { color: '#DC2626', fontWeight: 'bold', flex: 1, textAlign: 'right' }]}>{displayAllergies}</Text>
              </View>
              <View style={styles.divider} />
            </>
          ) : (
            <>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Allergies</Text>
                <Text style={styles.detailValue}>None reported</Text>
              </View>
              <View style={styles.divider} />
            </>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>ABHA ID</Text>
            <Text style={styles.detailValue}>{displayAbha}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Referrals</Text>
            <Text style={[styles.detailValue, { color: '#2563EB', fontWeight: 'bold' }]}>
              {referrals.length} referral{referrals.length === 1 ? '' : 's'}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Registration Date</Text>
            <Text style={styles.detailValue}>{regDate}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Village & Phone</Text>
            <Text style={styles.detailValue}>{displayVillage} • {displayPhone}</Text>
          </View>
        </View>
      )}

      {/* Tab 2: Consultations & Triage */}
      {activeTab === 'Consultations' && (
        <View style={styles.detailsCard}>
          {referrals.length === 0 ? (
            <Text style={styles.emptyText}>No clinical consultation or triage records found.</Text>
          ) : (
            referrals.map((r, idx) => {
              const dateStr = new Date(r.created_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
              return (
                <React.Fragment key={r.id || idx}>
                  {idx > 0 && <View style={styles.divider} />}
                  <View style={styles.historyBlock}>
                    <Text style={styles.historyDate}>{dateStr} • {r.destination_hospital || 'District Hospital Nandurbar'}</Text>
                    <Text style={styles.historyDiag}>Triage / Symptoms: {r.reason || 'Routine OPD Evaluation'}</Text>
                    <Text style={styles.historyMeds}>Status: {r.status}</Text>
                  </View>
                </React.Fragment>
              );
            })
          )}
        </View>
      )}

      {/* Tab 3: Referrals */}
      {activeTab === 'Referrals' && (
        <View style={styles.detailsCard}>
          {referrals.length === 0 ? (
            <Text style={styles.emptyText}>No referral history recorded for this patient.</Text>
          ) : (
            referrals.map((r, idx) => {
              const dateStr = new Date(r.created_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              });
              return (
                <React.Fragment key={r.id || idx}>
                  {idx > 0 && <View style={styles.divider} />}
                  <View style={styles.historyBlock}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={styles.historyDate}>{dateStr} • {r.destination_hospital || 'Hospital'}</Text>
                      <View style={[styles.statusBadgeMini, { backgroundColor: r.status === 'CONFIRMED_ARRIVAL' ? '#D1FAE5' : '#FEF3C7' }]}>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: r.status === 'CONFIRMED_ARRIVAL' ? '#059669' : '#D97706' }}>
                          {r.status}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.historyDiag}>Tracking ID: {r.referral_code || r.id.substring(0, 8)}</Text>
                    <Text style={styles.historyMeds}>Reason: {r.reason || 'Specialist care requested'}</Text>
                  </View>
                </React.Fragment>
              );
            })
          )}
        </View>
      )}

      {/* Bottom Action Button */}
      <TouchableOpacity
        style={styles.primaryBtn}
        activeOpacity={0.85}
        onPress={() => {
          router.push({
            pathname: '/(phc)/consultations',
            params: {
              patientId,
              patientName: displayName,
            },
          });
        }}
      >
        <Text style={styles.primaryBtnText}>Start Consultation</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 36,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  heroCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 26,
    fontFamily: 'Inter_800ExtraBold',
    color: '#059669',
  },
  heroName: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
  },
  heroSub: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    marginBottom: 16,
    padding: 3,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 11,
  },
  tabBtnActive: {
    backgroundColor: '#059669',
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
  },
  tabTextActive: {
    color: '#FFFFFF',
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
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  historyBlock: {
    paddingVertical: 8,
  },
  historyDate: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#059669',
    marginBottom: 4,
  },
  historyDiag: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#0F172A',
    marginBottom: 2,
  },
  historyMeds: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#475569',
    lineHeight: 17,
  },
  primaryBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 16,
  },
  statusBadgeMini: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
});
