import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, TextInput, Modal, RefreshControl
} from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { BACKEND_URL } from '../../lib/apiClient';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';

interface FollowupItem {
  id: string;
  patientName: string;
  subtitle: string;
  status: 'Due Today' | 'Upcoming' | 'Completed';
  date: string;
  notes?: string;
  category?: string;
  phone?: string;
}

const DEFAULT_FOLLOWUPS: FollowupItem[] = [
  {
    id: 'f-1',
    patientName: 'Savitri Devi',
    subtitle: 'Today • Home visit',
    status: 'Due Today',
    date: '11 Sep 2026',
    notes: 'ANC maternal checkup and iron tablet supply',
    category: 'Maternal Care',
    phone: '9876543210',
  },
  {
    id: 'f-2',
    patientName: 'Ramesh Kumar',
    subtitle: 'Today • Check symptoms',
    status: 'Due Today',
    date: '11 Sep 2026',
    notes: 'Check for fever reduction after PHC consultation',
    category: 'Post-Referral',
    phone: '9823011234',
  },
  {
    id: 'f-3',
    patientName: 'Pooja Sharma',
    subtitle: 'Tomorrow',
    status: 'Upcoming',
    date: '12 Sep 2026',
    notes: 'Routine blood pressure and glucose monitoring',
    category: 'General',
    phone: '9421056789',
  },
  {
    id: 'f-4',
    patientName: 'Mohammed Ali',
    subtitle: 'Completed • 09 Sep',
    status: 'Completed',
    date: '09 Sep 2026',
    notes: 'Medication adherence confirmed',
    category: 'Chronic Care',
    phone: '9860012345',
  },
];

export default function FollowupsScreen() {
  const router = useRouter();
  const { session } = useAuth();

  const [followups, setFollowups] = useState<FollowupItem[]>(DEFAULT_FOLLOWUPS);
  const [activeTab, setActiveTab] = useState<'Due Today' | 'Upcoming' | 'Completed'>('Due Today');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFollowup, setSelectedFollowup] = useState<FollowupItem | null>(null);

  const fetchFollowups = async () => {
    setLoading(true);
    try {
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${BACKEND_URL}/api/v1/followups/`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const apiList: FollowupItem[] = data.map((item: any, idx: number) => ({
            id: String(item.id || idx),
            patientName: item.patient_name || item.patientName || `Patient #${idx + 1}`,
            subtitle: item.visited
              ? 'Completed'
              : idx % 2 === 0
              ? 'Today • Home visit'
              : 'Upcoming',
            status: item.visited ? 'Completed' : idx % 2 === 0 ? 'Due Today' : 'Upcoming',
            date: item.followup_date || '11 Sep 2026',
            notes: item.notes || 'Follow-up health review',
            category: item.category || 'General',
          }));
          setFollowups([...apiList, ...DEFAULT_FOLLOWUPS]);
        }
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFollowups();
    }, [session])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFollowups();
    setRefreshing(false);
  };

  const markCompleted = (id: string) => {
    setFollowups(prev =>
      prev.map(f => (f.id === id ? { ...f, status: 'Completed', subtitle: 'Completed just now' } : f))
    );
    setSelectedFollowup(null);
  };

  const filtered = followups.filter(f => f.status === activeTab);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={16} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Follow-ups</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Filter Tabs: Due Today | Upcoming | Completed */}
      <View style={styles.tabBar}>
        {(['Due Today', 'Upcoming', 'Completed'] as const).map(tab => (
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

      {/* List */}
      <ScrollView
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#059669']} />}
        showsVerticalScrollIndicator={false}
      >
        {loading && !refreshing ? (
          <ActivityIndicator size="small" color="#059669" style={{ marginTop: 24 }} />
        ) : filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <FontAwesome5 name="calendar-check" size={32} color="#CBD5E1" />
            <Text style={styles.emptyText}>No follow-ups in this tab</Text>
          </View>
        ) : (
          filtered.map(item => {
            const initial = item.patientName.charAt(0).toUpperCase();
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                activeOpacity={0.85}
                onPress={() => setSelectedFollowup(item)}
              >
                {/* Initial Circle */}
                <View
                  style={[
                    styles.initialCircle,
                    {
                      backgroundColor:
                        item.status === 'Completed'
                          ? '#ECFDF5'
                          : item.status === 'Due Today'
                          ? '#EFF6FF'
                          : '#FFF7ED',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.initialText,
                      {
                        color:
                          item.status === 'Completed'
                            ? '#059669'
                            : item.status === 'Due Today'
                            ? '#2563EB'
                            : '#EA580C',
                      },
                    ]}
                  >
                    {initial}
                  </Text>
                </View>

                {/* Patient Info */}
                <View style={styles.infoGroup}>
                  <Text style={styles.patientName}>{item.patientName}</Text>
                  <Text style={styles.patientSubtitle}>{item.subtitle}</Text>
                </View>

                {/* Chevron */}
                <FontAwesome5 name="chevron-right" size={13} color="#94A3B8" />
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>

      {/* Details Modal */}
      {selectedFollowup && (
        <Modal transparent animationType="fade" visible={Boolean(selectedFollowup)}>
          <View style={styles.modalBg}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Follow-up Details</Text>
                <TouchableOpacity onPress={() => setSelectedFollowup(null)}>
                  <FontAwesome5 name="times" size={16} color="#64748B" />
                </TouchableOpacity>
              </View>

              <Text style={styles.modalPatient}>{selectedFollowup.patientName}</Text>
              <Text style={styles.modalDate}>Scheduled: {selectedFollowup.date}</Text>

              <View style={styles.modalNotesBox}>
                <Text style={styles.modalNotesLabel}>Instructions / Notes:</Text>
                <Text style={styles.modalNotesText}>{selectedFollowup.notes || 'Routine checkup'}</Text>
              </View>

              {selectedFollowup.status !== 'Completed' && (
                <TouchableOpacity
                  style={styles.completeBtn}
                  onPress={() => markCompleted(selectedFollowup.id)}
                >
                  <FontAwesome5 name="check" size={14} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.completeBtnText}>Mark Completed</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setSelectedFollowup(null)}
              >
                <Text style={styles.closeBtnText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  patientSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 3,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 360,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  modalPatient: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
  },
  modalDate: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#059669',
    marginTop: 2,
    marginBottom: 12,
  },
  modalNotesBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  modalNotesLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
    marginBottom: 4,
  },
  modalNotesText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#334155',
    lineHeight: 18,
  },
  completeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    borderRadius: 12,
    height: 44,
    marginBottom: 8,
  },
  completeBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  closeBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  closeBtnText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
});
