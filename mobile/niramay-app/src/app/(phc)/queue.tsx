import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, ActivityIndicator, RefreshControl
} from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { BACKEND_URL } from '../../lib/apiClient';

interface DoctorPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  lastVisit: string;
  status: 'Consulted' | 'Follow-up' | 'Waiting';
  village: string;
  phone?: string;
  allergies?: string;
  abhaId?: string;
  medicalHistory?: string;
}

export default function PhcQueueScreen() {
  const router = useRouter();
  const { session } = useAuth();

  const [patients, setPatients] = useState<DoctorPatient[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Consulted' | 'Follow-ups'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDoctorPatients = async () => {
    setLoading(true);
    try {
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [patRes, refRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/v1/patients/`, { headers }),
        fetch(`${BACKEND_URL}/api/v1/referrals/`, { headers }),
      ]);

      let referralMap = new Map<string, any[]>();
      if (refRes.ok) {
        const refData = await refRes.json();
        if (Array.isArray(refData)) {
          refData.forEach((r: any) => {
            const pId = String(r.patient_id);
            if (!referralMap.has(pId)) referralMap.set(pId, []);
            referralMap.get(pId)!.push(r);
          });
        }
      }

      if (patRes.ok) {
        const data = await patRes.json();
        if (Array.isArray(data)) {
          const apiPatients: DoctorPatient[] = data.map((p: any) => {
            const patientRefs = referralMap.get(String(p.id)) || [];
            const hasPending = patientRefs.some(
              (r: any) => r.status === 'PENDING' || r.status === 'DISPATCHED'
            );
            const hasFollowup = patientRefs.some(
              (r: any) => r.status === 'CONFIRMED_ARRIVAL' || r.status === 'IN_CONSULTATION'
            );

            let status: 'Consulted' | 'Follow-up' | 'Waiting' = 'Consulted';
            if (hasPending) status = 'Waiting';
            else if (hasFollowup) status = 'Follow-up';

            const latestRef = patientRefs[0];
            const dateObj = latestRef?.created_at
              ? new Date(latestRef.created_at)
              : p.created_at
              ? new Date(p.created_at)
              : new Date();

            const lastVisit = dateObj.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });

            return {
              id: String(p.id),
              name: p.name || 'Patient',
              age: Number(p.age) || 30,
              gender: p.gender || 'Female',
              lastVisit,
              status,
              village: p.village || 'Nandurbar',
              phone: p.phone,
              allergies: p.allergies,
              abhaId: p.abha_id,
              medicalHistory: p.allergies
                ? `Allergies: ${p.allergies}`
                : p.abha_id
                ? `ABHA: ${p.abha_id}`
                : 'Routine Medical Care',
            };
          });
          setPatients(apiPatients);
        }
      }
    } catch {
      // Keep state
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDoctorPatients();
    }, [session])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDoctorPatients();
    setRefreshing(false);
  };

  const filtered = patients.filter(p => {
    const qLower = searchQuery.toLowerCase();
    const matchesSearch =
      p.name.toLowerCase().includes(qLower) ||
      p.village.toLowerCase().includes(qLower) ||
      (p.phone && p.phone.includes(qLower)) ||
      (p.abhaId && p.abhaId.toLowerCase().includes(qLower));
    if (!matchesSearch) return false;
    if (activeTab === 'Consulted') return p.status === 'Consulted';
    if (activeTab === 'Follow-ups') return p.status === 'Follow-up' || p.status === 'Waiting';
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={16} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Patients</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Search Input */}
      <View style={styles.searchBar}>
        <FontAwesome5 name="search" size={14} color="#94A3B8" style={{ marginRight: 10 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search patients..."
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

      {/* Filter Tabs: All | Consulted | Follow-ups */}
      <View style={styles.tabBar}>
        {(['All', 'Consulted', 'Follow-ups'] as const).map(tab => (
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

      {/* Patient List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
        showsVerticalScrollIndicator={false}
      >
        {loading && !refreshing ? (
          <ActivityIndicator size="small" color="#2563EB" style={{ marginTop: 24 }} />
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="users" size={32} color="#CBD5E1" />
            <Text style={styles.emptyText}>No patients in this category</Text>
          </View>
        ) : (
          filtered.map(patient => {
            const initial = patient.name.charAt(0).toUpperCase();
            return (
              <TouchableOpacity
                key={patient.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => {
                  router.push({
                    pathname: '/(phc)/patient-record',
                    params: {
                      patientId: patient.id,
                      name: patient.name,
                      age: String(patient.age),
                      gender: patient.gender,
                      village: patient.village,
                      phone: patient.phone || '',
                      history: patient.medicalHistory || '',
                    },
                  });
                }}
              >
                {/* Initial Circle */}
                <View
                  style={[
                    styles.initialCircle,
                    {
                      backgroundColor:
                        patient.gender === 'Female' ? '#F3E8FF' : '#EFF6FF',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.initialText,
                      { color: patient.gender === 'Female' ? '#9333EA' : '#2563EB' },
                    ]}
                  >
                    {initial}
                  </Text>
                </View>

                {/* Patient Info */}
                <View style={styles.infoGroup}>
                  <Text style={styles.patientName}>{patient.name}</Text>
                  <Text style={styles.patientSub}>
                    {patient.age} years • Last visit: {patient.lastVisit}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 12,
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 10,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 48,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 10,
  },
  card: {
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
  initialCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  initialText: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
  },
  infoGroup: {
    flex: 1,
  },
  patientName: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  patientSub: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 3,
  },
});
