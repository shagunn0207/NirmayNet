import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, TextInput, Modal, RefreshControl, Alert
} from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { BACKEND_URL } from '../../lib/apiClient';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';

interface FollowupItem {
  id: string;
  patientId: string;
  patientName: string;
  subtitle: string;
  status: 'Due Today' | 'Upcoming' | 'Completed';
  date: string;
  notes?: string;
  category?: string;
  phone?: string;
}

const CATEGORY_OPTIONS = [
  'General Checkup',
  'ANC Care',
  'Postnatal Care',
  'Immunization',
  'Hypertension',
  'Nutrition Review',
];

export default function FollowupsScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const params = useLocalSearchParams();

  // Selected patient passed from patient profile or other navigation
  const targetPatientId = (params.patientId || params.patient_id) as string | undefined;
  const targetPatientName = (params.patientName || params.patient_name) as string | undefined;

  const [filterPatientId, setFilterPatientId] = useState<string | undefined>(targetPatientId);
  const [followups, setFollowups] = useState<FollowupItem[]>([]);
  const [activeTab, setActiveTab] = useState<'Due Today' | 'Upcoming' | 'Completed'>('Due Today');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFollowup, setSelectedFollowup] = useState<FollowupItem | null>(null);

  // Modal & form state for scheduling a new follow-up
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleCategory, setScheduleCategory] = useState('General Checkup');
  const [scheduleUrgency, setScheduleUrgency] = useState<'ROUTINE' | 'URGENT' | 'EMERGENCY'>('ROUTINE');
  const [scheduleDate, setScheduleDate] = useState(() => {
    return new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  });
  const [scheduleNotes, setScheduleNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Auto-open modal when navigated with a target patient
  useEffect(() => {
    if (targetPatientId) {
      setFilterPatientId(targetPatientId);
      setShowScheduleModal(true);
    }
  }, [targetPatientId]);

  const fetchFollowups = async () => {
    setLoading(true);
    try {
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Build patient ID -> Name mapping from real backend patients
      const patientMap: Record<string, string> = {};
      if (targetPatientId && targetPatientName) {
        patientMap[targetPatientId] = targetPatientName;
      }
      try {
        const pRes = await fetch(`${BACKEND_URL}/api/v1/patients/`, { headers });
        if (pRes.ok) {
          const pData = await pRes.json();
          if (Array.isArray(pData)) {
            pData.forEach((p: any) => {
              if (p.id && p.name) patientMap[String(p.id)] = p.name;
            });
          }
        }
      } catch {
        // Continue with available data
      }

      let url = `${BACKEND_URL}/api/v1/followups/`;
      if (filterPatientId) url += `?patient_id=${filterPatientId}`;

      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const today = new Date().toISOString().split('T')[0];
          const apiList: FollowupItem[] = data.map((item: any, idx: number) => {
            const followupDate = item.followup_date || '';
            let status: 'Due Today' | 'Upcoming' | 'Completed' = 'Upcoming';
            if (item.visited || item.status === 'COMPLETED') {
              status = 'Completed';
            } else if (followupDate === today) {
              status = 'Due Today';
            } else if (followupDate < today) {
              status = 'Due Today'; // overdue treated as Due Today
            } else {
              status = 'Upcoming';
            }
            const displayDate = followupDate
              ? new Date(followupDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
              : 'Scheduled';

            const resolvedPatientName =
              item.patient_name ||
              item.patientName ||
              patientMap[String(item.patient_id)] ||
              (item.patient_id === targetPatientId && targetPatientName ? targetPatientName : undefined) ||
              `Patient #${idx + 1}`;

            return {
              id: String(item.id || idx),
              patientId: String(item.patient_id || ''),
              patientName: resolvedPatientName,
              subtitle: status === 'Completed' ? `Completed • ${displayDate}` : `${status === 'Due Today' ? 'Today' : displayDate} • ${item.category || 'Home visit'}`,
              status,
              date: displayDate,
              notes: item.notes || 'Follow-up health review',
              category: item.category || 'General',
              phone: item.phone,
            };
          });
          setFollowups(apiList);
        }
      }
    } catch {
      // Keep current state on network error
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchFollowups();
    }, [session, filterPatientId])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFollowups();
    setRefreshing(false);
  };

  const handleCreateFollowup = async () => {
    const patientIdToUse = targetPatientId || filterPatientId;
    if (!patientIdToUse) {
      Alert.alert('Error', 'Please select a patient to schedule a follow-up.');
      return;
    }

    if (!scheduleDate.trim()) {
      Alert.alert('Required', 'Please specify a follow-up date (YYYY-MM-DD).');
      return;
    }

    setSubmitting(true);
    try {
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const payload = {
        patient_id: patientIdToUse,
        category: scheduleCategory.trim() || 'General Checkup',
        urgency: scheduleUrgency,
        followup_date: scheduleDate.trim(),
        notes: scheduleNotes.trim() || undefined,
      };

      const res = await fetch(`${BACKEND_URL}/api/v1/followups/`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowScheduleModal(false);
        setScheduleNotes('');
        Alert.alert(
          'Follow-up Scheduled',
          `Follow-up scheduled successfully for ${targetPatientName || 'the patient'}.`
        );
        await fetchFollowups();
      } else {
        const errData = await res.json().catch(() => ({}));
        let errMsg = 'Could not schedule follow-up. Please check patient ID.';
        if (errData.detail) {
          if (typeof errData.detail === 'string') errMsg = errData.detail;
          else if (Array.isArray(errData.detail) && errData.detail[0]?.msg) errMsg = errData.detail[0].msg;
        }
        Alert.alert('Error', errMsg);
      }
    } catch {
      Alert.alert('Network Error', 'Failed to connect to backend server. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const markCompleted = async (id: string) => {
    const token = session?.access_token;

    // Optimistic UI update
    setFollowups(prev =>
      prev.map(f => (f.id === id ? { ...f, status: 'Completed', subtitle: 'Completed just now' } : f))
    );
    setSelectedFollowup(null);

    // Sync to backend — only for real (non-mock) IDs
    if (token && !id.startsWith('f-')) {
      try {
        await fetch(`${BACKEND_URL}/api/v1/followups/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: 'COMPLETED', visited: true }),
        });
      } catch {
        // Revert on failure
        setFollowups(prev =>
          prev.map(f => (f.id === id ? { ...f, status: 'Due Today', subtitle: 'Today • Home visit' } : f))
        );
        Alert.alert('Error', 'Could not mark follow-up as completed. Please try again.');
      }
    }
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
        <TouchableOpacity
          style={styles.addMiniBtn}
          onPress={() => setShowScheduleModal(true)}
        >
          <FontAwesome5 name="plus" size={14} color="#059669" />
        </TouchableOpacity>
      </View>

      {/* Selected Patient Banner (when opened for a specific patient) */}
      {targetPatientId && (
        <View style={styles.selectedPatientBanner}>
          <View style={styles.selectedPatientHeaderRow}>
            <View style={styles.selectedPatientBadge}>
              <FontAwesome5 name="user-check" size={11} color="#059669" style={{ marginRight: 5 }} />
              <Text style={styles.selectedPatientBadgeText}>Selected Patient</Text>
            </View>
            <TouchableOpacity
              style={styles.scheduleFollowupBtn}
              activeOpacity={0.85}
              onPress={() => setShowScheduleModal(true)}
            >
              <FontAwesome5 name="calendar-plus" size={12} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.scheduleFollowupBtnText}>Add Follow-up</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.selectedPatientName}>{targetPatientName || 'Patient'}</Text>
          <Text style={styles.selectedPatientId} numberOfLines={1}>Patient ID: {targetPatientId}</Text>
          {filterPatientId && (
            <TouchableOpacity
              style={styles.clearFilterBtn}
              onPress={() => setFilterPatientId(undefined)}
            >
              <Text style={styles.clearFilterText}>Showing patient follow-ups • Tap to view all</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

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
            {targetPatientId && (
              <TouchableOpacity
                style={styles.emptyScheduleBtn}
                onPress={() => setShowScheduleModal(true)}
              >
                <FontAwesome5 name="plus" size={12} color="#059669" style={{ marginRight: 6 }} />
                <Text style={styles.emptyScheduleBtnText}>Schedule Follow-up for {targetPatientName || 'Patient'}</Text>
              </TouchableOpacity>
            )}
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

      {/* ───────────────────────────────────────────────────────────────────────────
          SCHEDULE FOLLOW-UP MODAL
      ──────────────────────────────────────────────────────────────────────────── */}
      <Modal transparent animationType="fade" visible={showScheduleModal}>
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Follow-up</Text>
              <TouchableOpacity onPress={() => setShowScheduleModal(false)}>
                <FontAwesome5 name="times" size={16} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Target Patient Info Header */}
            <View style={styles.modalPatientBanner}>
              <View style={styles.modalPatientAvatar}>
                <Text style={styles.modalPatientAvatarText}>
                  {(targetPatientName || 'P').charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.modalPatientLabel}>Patient</Text>
                <Text style={styles.modalPatientName}>{targetPatientName || 'Patient'}</Text>
                <Text style={styles.modalPatientSub} numberOfLines={1}>ID: {targetPatientId || 'Not specified'}</Text>
              </View>
            </View>

            {/* Category Selector */}
            <Text style={styles.fieldLabel}>Category</Text>
            <View style={styles.categoryChipsRow}>
              {CATEGORY_OPTIONS.slice(0, 4).map(cat => (
                <TouchableOpacity
                  key={cat}
                  style={[styles.categoryChip, scheduleCategory === cat && styles.categoryChipActive]}
                  onPress={() => setScheduleCategory(cat)}
                >
                  <Text style={[styles.categoryChipText, scheduleCategory === cat && styles.categoryChipTextActive]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Urgency Selector */}
            <Text style={styles.fieldLabel}>Urgency</Text>
            <View style={styles.urgencyRow}>
              {(['ROUTINE', 'URGENT', 'EMERGENCY'] as const).map(u => (
                <TouchableOpacity
                  key={u}
                  style={[
                    styles.urgencyChip,
                    scheduleUrgency === u && (
                      u === 'EMERGENCY'
                        ? styles.urgencyChipEmergency
                        : u === 'URGENT'
                        ? styles.urgencyChipUrgent
                        : styles.urgencyChipRoutine
                    ),
                  ]}
                  onPress={() => setScheduleUrgency(u)}
                >
                  <Text
                    style={[
                      styles.urgencyChipText,
                      scheduleUrgency === u && styles.urgencyChipTextActive,
                    ]}
                  >
                    {u}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Scheduled Date Input */}
            <Text style={styles.fieldLabel}>Follow-up Date (YYYY-MM-DD) *</Text>
            <TextInput
              style={styles.modalInput}
              value={scheduleDate}
              onChangeText={setScheduleDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#94A3B8"
            />

            {/* Instructions / Notes */}
            <Text style={styles.fieldLabel}>Instructions / Notes (Optional)</Text>
            <TextInput
              style={[styles.modalInput, { height: 60, textAlignVertical: 'top' }]}
              value={scheduleNotes}
              onChangeText={setScheduleNotes}
              placeholder="e.g. Check blood pressure and maternal nutrition"
              placeholderTextColor="#94A3B8"
              multiline
            />

            {/* Submit Button */}
            <TouchableOpacity
              style={styles.completeBtn}
              activeOpacity={0.85}
              onPress={handleCreateFollowup}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <FontAwesome5 name="check" size={14} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.completeBtnText}>Confirm Follow-up</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setShowScheduleModal(false)}
            >
              <Text style={styles.closeBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ───────────────────────────────────────────────────────────────────────────
          VIEW DETAILS MODAL
      ──────────────────────────────────────────────────────────────────────────── */}
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
  addMiniBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E6F4EA',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Selected Patient Banner ──
  selectedPatientBanner: {
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 8,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    backgroundColor: '#F0FDF4',
  },
  selectedPatientHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  selectedPatientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  selectedPatientBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    color: '#059669',
  },
  scheduleFollowupBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  scheduleFollowupBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  selectedPatientName: {
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
  },
  selectedPatientId: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 2,
  },
  clearFilterBtn: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#DCFCE7',
  },
  clearFilterText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#059669',
  },

  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#E2E8F0',
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 8,
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
    paddingTop: 40,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 10,
  },
  emptyScheduleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F4EA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
  },
  emptyScheduleBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#059669',
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
    maxWidth: 380,
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
  modalPatientBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalPatientAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  modalPatientAvatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  modalPatientLabel: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  modalPatientName: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  modalPatientSub: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  fieldLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#334155',
    marginBottom: 5,
    marginTop: 4,
  },
  categoryChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  categoryChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryChipActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  categoryChipText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#475569',
  },
  categoryChipTextActive: {
    color: '#166534',
    fontFamily: 'Inter_700Bold',
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 8,
  },
  urgencyChip: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  urgencyChipRoutine: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  urgencyChipUrgent: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  urgencyChipEmergency: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  urgencyChipText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
  urgencyChipTextActive: {
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#0F172A',
    marginBottom: 8,
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
    marginTop: 4,
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
    height: 36,
  },
  closeBtnText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
});
