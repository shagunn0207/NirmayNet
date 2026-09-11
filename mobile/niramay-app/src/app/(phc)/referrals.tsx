import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  ActivityIndicator, Alert, Linking, RefreshControl
} from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { BACKEND_URL } from '../../lib/apiClient';

interface ReferralItem {
  id: string;
  referralCode: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  referredBy: string;
  village: string;
  phone?: string;
  allergies?: string;
  abhaId?: string;
  reason: string;
  priority: 'Urgent' | 'Normal' | 'Emergency';
  referredOn: string;
  timeAgo: string;
  notes: string;
  status: string;
  destinationHospital?: string;
}

export default function PhcReferralsScreen() {
  const { session } = useAuth();
  const router = useRouter();

  const [referrals, setReferrals] = useState<ReferralItem[]>([]);
  const [activeTab, setActiveTab] = useState<'All' | 'Urgent' | 'Normal'>('All');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<ReferralItem | null>(null);

  const fetchReferrals = async () => {
    setLoading(true);
    try {
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Parallel fetch referrals and patients for live data join
      const [refRes, patRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/v1/referrals/`, { headers }),
        fetch(`${BACKEND_URL}/api/v1/patients/`, { headers }),
      ]);

      let patientMap = new Map<string, any>();
      if (patRes.ok) {
        const patData = await patRes.json();
        if (Array.isArray(patData)) {
          patData.forEach((p: any) => {
            patientMap.set(String(p.id), p);
          });
        }
      }

      if (refRes.ok) {
        const data = await refRes.json();
        if (Array.isArray(data)) {
          const apiReferrals: ReferralItem[] = data.map((r: any) => {
            const patient = patientMap.get(String(r.patient_id));
            const rLower = (r.reason || '').toLowerCase();
            let priority: 'Emergency' | 'Urgent' | 'Normal' = 'Normal';
            if (rLower.includes('priority: emergency') || rLower.includes('emergency')) {
              priority = 'Emergency';
            } else if (rLower.includes('priority: urgent') || rLower.includes('urgent')) {
              priority = 'Urgent';
            }

            const dateObj = r.created_at ? new Date(r.created_at) : new Date();
            const formattedDate = dateObj.toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            });

            const diffMs = Date.now() - dateObj.getTime();
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            const timeAgo =
              diffHours < 1
                ? 'Just now'
                : diffHours === 1
                ? '1 hour ago'
                : diffHours < 24
                ? `${diffHours} hours ago`
                : `${Math.floor(diffHours / 24)} days ago`;

            return {
              id: String(r.id),
              referralCode: r.referral_code || `NMN-${String(r.id).slice(0, 8)}`,
              patientId: String(r.patient_id),
              patientName: patient?.name || `Patient #${r.referral_code || String(r.id).slice(0, 8)}`,
              age: Number(patient?.age) || 30,
              gender: patient?.gender || 'Unknown',
              referredBy: 'ASHA Worker',
              village: patient?.village || r.destination_hospital || 'Nandurbar',
              phone: patient?.phone || '',
              allergies: patient?.allergies || '',
              abhaId: patient?.abha_id || '',
              reason: r.reason || 'Medical review requested',
              priority,
              referredOn: formattedDate,
              timeAgo,
              notes: r.reason || 'Referred for specialist evaluation',
              status: r.status || 'PENDING',
              destinationHospital: r.destination_hospital || 'District Hospital Nandurbar',
            };
          });
          setReferrals(apiReferrals);
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
      fetchReferrals();
    }, [session])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReferrals();
    setRefreshing(false);
  };

  const handleAccept = async (referral: ReferralItem) => {
    try {
      const token = session?.access_token;
      if (token) {
        const patchRes = await fetch(`${BACKEND_URL}/api/v1/referrals/${referral.id}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'CONFIRMED_ARRIVAL' }),
        });
        if (!patchRes.ok) {
          const errData = await patchRes.json().catch(() => null);
          throw new Error(errData?.detail || 'Failed to update referral status');
        }
      }

      setReferrals(prev =>
        prev.map(r => (r.id === referral.id ? { ...r, status: 'CONFIRMED_ARRIVAL' } : r))
      );
      if (selectedReferral && selectedReferral.id === referral.id) {
        setSelectedReferral({ ...selectedReferral, status: 'CONFIRMED_ARRIVAL' });
      }

      Alert.alert(
        'Arrival Confirmed',
        `Patient ${referral.patientName} arrival has been recorded.`,
        [
          {
            text: 'Open Consultation',
            onPress: () => {
              setSelectedReferral(null);
              router.push({
                pathname: '/(phc)/consultations',
                params: {
                  patientId: referral.patientId,
                  patientName: referral.patientName,
                },
              });
            },
          },
          {
            text: 'View Record',
            onPress: () => {
              setSelectedReferral(null);
              router.push({
                pathname: '/(phc)/patient-record',
                params: {
                  patientId: referral.patientId,
                  name: referral.patientName,
                  age: String(referral.age),
                  gender: referral.gender,
                  village: referral.village,
                  phone: referral.phone || '',
                  history: referral.allergies ? `Allergies: ${referral.allergies}` : '',
                },
              });
            },
          },
          { text: 'Done', onPress: () => setSelectedReferral(null) },
        ]
      );
    } catch (err: any) {
      Alert.alert('Status Update', err.message || `Referral arrival recorded.`);
    }
  };

  const handleStartTeleconsult = async (referral: ReferralItem) => {
    try {
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${BACKEND_URL}/api/v1/teleconsult/room`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          patient_id: referral.patientId,
          referral_id: referral.id.startsWith('ref-') ? undefined : referral.id,
          notes: `Teleconsultation for ${referral.patientName}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.jitsi_url) {
          Linking.openURL(data.jitsi_url);
          return;
        }
      }
      // Fallback direct Jitsi room
      const roomUrl = `https://meet.jit.si/nirmay_${referral.patientId.slice(0, 8)}`;
      Linking.openURL(roomUrl);
    } catch {
      const roomUrl = `https://meet.jit.si/nirmay_${referral.patientId.slice(0, 8)}`;
      Linking.openURL(roomUrl);
    }
  };

  const filteredReferrals = referrals.filter(r => {
    if (activeTab === 'Urgent') return r.priority === 'Urgent' || r.priority === 'Emergency';
    if (activeTab === 'Normal') return r.priority === 'Normal';
    return true;
  });

  // ───────────────────────────────────────────────────────────────────────────
  // SCREEN 2: REFERRAL DETAILS
  // ───────────────────────────────────────────────────────────────────────────
  if (selectedReferral) {
    const initial = selectedReferral.patientName.charAt(0).toUpperCase();
    const isArrivalRecorded = selectedReferral.status === 'CONFIRMED_ARRIVAL' || selectedReferral.status === 'IN_CONSULTATION' || selectedReferral.status === 'COMPLETED';

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedReferral(null)}>
            <FontAwesome5 name="arrow-left" size={16} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Referral Details</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Patient Hero Card */}
        <View style={styles.heroCard}>
          <View style={[styles.avatarCircleLarge, { backgroundColor: '#EFF6FF' }]}>
            <Text style={[styles.avatarTextLarge, { color: '#2563EB' }]}>{initial}</Text>
          </View>
          <Text style={styles.heroName}>{selectedReferral.patientName}</Text>
          <Text style={styles.heroSub}>
            {selectedReferral.age} years • {selectedReferral.gender}
          </Text>
        </View>

        {/* Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Tracking ID</Text>
            <Text style={[styles.detailValue, { color: '#059669', fontWeight: 'bold' }]}>{selectedReferral.referralCode}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status</Text>
            <View style={[styles.priorityBadge, { backgroundColor: isArrivalRecorded ? '#D1FAE5' : '#FEF3C7' }]}>
              <Text style={[styles.priorityText, { color: isArrivalRecorded ? '#059669' : '#D97706' }]}>
                {selectedReferral.status}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Referred by</Text>
            <Text style={styles.detailValue}>{selectedReferral.referredBy}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Village</Text>
            <Text style={styles.detailValue}>{selectedReferral.village}</Text>
          </View>
          <View style={styles.divider} />

          {selectedReferral.allergies ? (
            <>
              <View style={[styles.detailRow, { backgroundColor: '#FEF2F2', paddingHorizontal: 8, paddingVertical: 6, borderRadius: 8 }]}>
                <Text style={[styles.detailLabel, { color: '#DC2626', fontWeight: 'bold' }]}>⚠️ Known Allergies</Text>
                <Text style={[styles.detailValue, { color: '#DC2626', fontWeight: 'bold' }]}>{selectedReferral.allergies}</Text>
              </View>
              <View style={styles.divider} />
            </>
          ) : null}

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reason / Symptoms</Text>
            <Text style={[styles.detailValue, { flex: 1, textAlign: 'right' }]} numberOfLines={3}>
              {selectedReferral.reason}
            </Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Priority</Text>
            <View
              style={[
                styles.priorityBadge,
                selectedReferral.priority === 'Emergency'
                  ? styles.badgeEmergency
                  : selectedReferral.priority === 'Urgent'
                  ? styles.badgeUrgent
                  : styles.badgeNormal,
              ]}
            >
              <Text
                style={[
                  styles.priorityText,
                  selectedReferral.priority === 'Emergency'
                    ? styles.textEmergency
                    : selectedReferral.priority === 'Urgent'
                    ? styles.textUrgent
                    : styles.textNormal,
                ]}
              >
                {selectedReferral.priority}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Referred on</Text>
            <Text style={styles.detailValue}>{selectedReferral.referredOn}</Text>
          </View>
          <View style={styles.divider} />

          <View style={styles.notesBlock}>
            <Text style={styles.detailLabel}>Destination Hospital</Text>
            <Text style={styles.notesText}>{selectedReferral.destinationHospital}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={[styles.acceptBtn, isArrivalRecorded && { backgroundColor: '#2563EB' }]}
            activeOpacity={0.85}
            onPress={() => isArrivalRecorded ? router.push({
              pathname: '/(phc)/consultations',
              params: { patientId: selectedReferral.patientId, patientName: selectedReferral.patientName },
            }) : handleAccept(selectedReferral)}
          >
            <Text style={styles.acceptBtnText}>
              {isArrivalRecorded ? 'Consult Patient' : 'Confirm Arrival'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.requestInfoBtn}
            activeOpacity={0.85}
            onPress={() => {
              router.push({
                pathname: '/(phc)/patient-record',
                params: {
                  patientId: selectedReferral.patientId,
                  name: selectedReferral.patientName,
                  age: String(selectedReferral.age),
                  gender: selectedReferral.gender,
                  village: selectedReferral.village,
                  phone: selectedReferral.phone || '',
                  history: selectedReferral.allergies ? `Allergies: ${selectedReferral.allergies}` : '',
                },
              });
            }}
          >
            <Text style={styles.requestInfoText}>View Record</Text>
          </TouchableOpacity>
        </View>

        {/* Teleconsultation Button */}
        <TouchableOpacity
          style={styles.teleconsultBtn}
          activeOpacity={0.85}
          onPress={() => handleStartTeleconsult(selectedReferral)}
        >
          <FontAwesome5 name="video" size={14} color="#FFFFFF" style={{ marginRight: 8 }} />
          <Text style={styles.teleconsultBtnText}>Start Teleconsultation</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // SCREEN 1: PENDING REFERRALS LIST
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={16} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pending Referrals</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Filter Tabs: All | Urgent | Normal */}
      <View style={styles.tabBar}>
        {(['All', 'Urgent', 'Normal'] as const).map(tab => (
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

      {/* Referrals List */}
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
        showsVerticalScrollIndicator={false}
      >
        {loading && !refreshing ? (
          <ActivityIndicator size="small" color="#2563EB" style={{ marginTop: 24 }} />
        ) : filteredReferrals.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="file-medical" size={32} color="#CBD5E1" />
            <Text style={styles.emptyText}>No referrals in this category</Text>
          </View>
        ) : (
          filteredReferrals.map(item => {
            const initial = item.patientName.charAt(0).toUpperCase();
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.referralCard}
                activeOpacity={0.85}
                onPress={() => setSelectedReferral(item)}
              >
                {/* Initial Circle */}
                <View
                  style={[
                    styles.initialCircle,
                    {
                      backgroundColor:
                        item.priority === 'Emergency'
                          ? '#FEE2E2'
                          : item.priority === 'Urgent'
                          ? '#FEF3C7'
                          : '#EFF6FF',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.initialText,
                      {
                        color:
                          item.priority === 'Emergency'
                            ? '#DC2626'
                            : item.priority === 'Urgent'
                            ? '#D97706'
                            : '#2563EB',
                      },
                    ]}
                  >
                    {initial}
                  </Text>
                </View>

                {/* Patient Information */}
                <View style={styles.cardInfo}>
                  <Text style={styles.patientName}>{item.patientName}</Text>
                  <Text style={styles.patientSub}>
                    {item.age} years • {item.gender}
                  </Text>
                  <Text style={styles.reasonSub} numberOfLines={1}>
                    {item.priority} • {item.timeAgo}
                  </Text>
                </View>

                {/* Priority Tag */}
                <View
                  style={[
                    styles.priorityTag,
                    item.priority === 'Emergency'
                      ? styles.badgeEmergency
                      : item.priority === 'Urgent'
                      ? styles.badgeUrgent
                      : styles.badgeNormal,
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityTagText,
                      item.priority === 'Emergency'
                        ? styles.textEmergency
                        : item.priority === 'Urgent'
                        ? styles.textUrgent
                        : styles.textNormal,
                    ]}
                  >
                    {item.priority}
                  </Text>
                </View>

                {/* Chevron */}
                <FontAwesome5 name="chevron-right" size={12} color="#94A3B8" style={{ marginLeft: 8 }} />
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 10,
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
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 28,
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
  referralCard: {
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
    marginRight: 12,
  },
  initialText: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
  },
  cardInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  patientSub: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 2,
  },
  reasonSub: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#D97706',
    marginTop: 2,
  },
  priorityTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityTagText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  badgeEmergency: {
    backgroundColor: '#FEE2E2',
  },
  badgeUrgent: {
    backgroundColor: '#FEF3C7',
  },
  badgeNormal: {
    backgroundColor: '#E0F2FE',
  },
  textEmergency: {
    color: '#DC2626',
  },
  textUrgent: {
    color: '#D97706',
  },
  textNormal: {
    color: '#0284C7',
  },

  // Details screen styles
  heroCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarCircleLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarTextLarge: {
    fontSize: 24,
    fontFamily: 'Inter_800ExtraBold',
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
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
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
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  notesBlock: {
    paddingTop: 8,
  },
  notesText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#334155',
    marginTop: 4,
    lineHeight: 18,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  acceptBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  acceptBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  requestInfoBtn: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestInfoText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#2563EB',
  },
  teleconsultBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderRadius: 14,
    backgroundColor: '#2563EB',
  },
  teleconsultBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
});
