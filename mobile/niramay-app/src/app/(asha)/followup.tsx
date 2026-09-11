import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Modal, ActivityIndicator, Alert, TextInput } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { BACKEND_URL } from '../../lib/apiClient';
import { FontAwesome5 } from '@expo/vector-icons';

type CategoryFilter = 'all' | 'Female' | 'Male' | 'Child' | 'Senior';

type FollowupRow = {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  category: string;
  urgency: string;
  visited: boolean;
  phone: string;
  notes: string;
  followupDate: string;
};

export default function FollowupsScreen() {
  const { t, session } = useAuth();
  const [followups, setFollowups] = useState<FollowupRow[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [newNotes, setNewNotes] = useState('');
  const [newDate, setNewDate] = useState(() => new Date(Date.now() + 86400000).toISOString().slice(0, 10));
  const [selectedFollowup, setSelectedFollowup] = useState<FollowupRow | null>(null);

  const getHeaders = () => {
    const headers: any = { 'Content-Type': 'application/json' };
    if (session?.access_token) headers.Authorization = `Bearer ${session.access_token}`;
    return headers;
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/patients/`, { headers: getHeaders() });
      if (!response.ok) return;
      const data = await response.json();
      setPatients(Array.isArray(data) ? data : []);
      if (data?.length && !selectedPatientId) {
        setSelectedPatientId(data[0].id);
      }
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.warn('fetch patients failed', error);
      return [];
    }
  };

  const fetchFollowups = async (patientList: any[] = patients) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/followups/`, { headers: getHeaders() });
      if (!response.ok) return;
      const rows = await response.json();
      const patientMap = Object.fromEntries((patientList || []).map((p: any) => [String(p.id), p]));
      const mapped = Array.isArray(rows)
        ? rows.map((row: any) => {
            const patient = patientMap[String(row.patient_id)] || {};
            return {
              id: String(row.id),
              patientId: String(row.patient_id),
              patientName: patient.name || `Patient ${String(row.patient_id).slice(0, 6)}`,
              patientAge: Number(patient.age || 0),
              patientSex: patient.gender || 'Other',
              category: row.category || 'General',
              urgency: row.urgency || 'ROUTINE',
              visited: Boolean(row.visited) || row.status === 'COMPLETED',
              phone: patient.phone || '',
              notes: row.notes || '',
              followupDate: row.followup_date || '',
            };
          })
        : [];
      setFollowups(mapped);
    } catch (error) {
      console.warn('fetch followups failed', error);
    }
  };

  useEffect(() => {
    if (!session) return;
    (async () => {
      setLoading(true);
      const loadedPatients = await fetchPatients();
      await fetchFollowups(loadedPatients || patients);
      setLoading(false);
    })();
  }, [session]);

  useEffect(() => {
    if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [patients]);

  const filterItem = (f: FollowupRow) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'Female') return f.patientSex === 'Female';
    if (activeFilter === 'Male') return f.patientSex === 'Male';
    if (activeFilter === 'Child') return f.patientAge <= 18 || String(f.category).toLowerCase().includes('child') || f.patientName.toLowerCase().includes('baby');
    if (activeFilter === 'Senior') return f.patientAge >= 55;
    return true;
  };

  const pending = followups.filter(f => !f.visited && filterItem(f));
  const done = followups.filter(f => f.visited && filterItem(f));

  const getUrgencyLabel = (urg: string) => {
    if (urg === 'EMERGENCY') return t('emergency') || 'EMERGENCY';
    if (urg === 'URGENT') return t('urgent') || 'URGENT';
    return t('routine') || 'ROUTINE';
  };

  const handleCall = (phone: string) => {
    if (!phone) return;
    Linking.openURL(`tel:${phone}`);
  };

  const updateFollowupStatus = async (item: FollowupRow, nextVisited: boolean, nextNotes?: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/followups/${item.id}`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({
          status: nextVisited ? 'COMPLETED' : 'PENDING',
          visited: nextVisited,
          notes: nextNotes ?? item.notes ?? '',
        }),
      });
      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || 'Unable to update follow-up.');
      }
      const freshPatients = patients.length ? patients : await fetchPatients();
      await fetchFollowups(freshPatients || patients);
    } catch (error: any) {
      Alert.alert('Update failed', error?.message || 'Could not update the follow-up.');
    }
  };

  const handleCreateFollowup = async () => {
    if (!selectedPatientId) {
      Alert.alert('Patient required', 'Please select a patient to schedule the follow-up.');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/followups/`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
          patient_id: selectedPatientId,
          referral_id: null,
          category: 'General follow-up',
          urgency: 'ROUTINE',
          followup_date: newDate,
          notes: newNotes || 'Routine post-visit follow-up',
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(errorBody || 'Unable to create follow-up.');
      }

      setShowCreateModal(false);
      setNewNotes('');
      setNewDate(new Date(Date.now() + 86400000).toISOString().slice(0, 10));
      const freshPatients = patients.length ? patients : await fetchPatients();
      await fetchFollowups(freshPatients || patients);
    } catch (error: any) {
      Alert.alert('Schedule failed', error?.message || 'Unable to create the follow-up.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.dropdownButton} onPress={() => setShowFilterModal(true)}>
        <Text style={styles.dropdownButtonText}>
          {activeFilter === 'all' ? `👥 ${t('allLabel') || 'All'}` :
           activeFilter === 'Female' ? `👩 ${t('sexFemale') || 'Female'}` :
           activeFilter === 'Male' ? `👨 ${t('sexMale') || 'Male'}` :
           activeFilter === 'Child' ? `👶 ${t('childInfant') || 'Child / Infant'}` :
           `👵 ${t('seniorLabel') || 'Senior'}`}
        </Text>
        <FontAwesome5 name="chevron-down" size={12} color="#0F766E" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.primaryButton} onPress={() => setShowCreateModal(true)}>
        <Text style={styles.primaryButtonText}>＋ {t('scheduleFollowup') || 'Schedule follow-up'}</Text>
      </TouchableOpacity>

      <Modal visible={showFilterModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowFilterModal(false)}>
          <View style={styles.modalContent}>
            {[
              { key: 'all', icon: '👥', label: t('allLabel') || 'All' },
              { key: 'Female', icon: '👩', label: t('sexFemale') || 'Female' },
              { key: 'Male', icon: '👨', label: t('sexMale') || 'Male' },
              { key: 'Child', icon: '👶', label: t('childInfant') || 'Child / Infant' },
              { key: 'Senior', icon: '👵', label: t('seniorLabel') || 'Senior' },
            ].map(cat => {
              const count = followups.filter(f => !f.visited && (
                cat.key === 'all' ? true :
                cat.key === 'Female' ? f.patientSex === 'Female' :
                cat.key === 'Male' ? f.patientSex === 'Male' :
                cat.key === 'Child' ? (f.patientAge <= 18 || f.category.toLowerCase().includes('child') || f.patientName.toLowerCase().includes('baby')) :
                f.patientAge >= 55
              )).length;

              return (
                <TouchableOpacity
                  key={cat.key}
                  style={[styles.dropdownItem, activeFilter === cat.key && styles.dropdownItemActive]}
                  onPress={() => { setActiveFilter(cat.key as CategoryFilter); setShowFilterModal(false); }}
                >
                  <Text style={[styles.dropdownItemText, activeFilter === cat.key && styles.dropdownItemTextActive]}>
                    {cat.icon} {cat.label}
                  </Text>
                  <View style={styles.dropdownBadge}><Text style={styles.dropdownBadgeText}>{count}</Text></View>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal transparent visible={showCreateModal} animationType="slide">
        <View style={styles.modalOverlay}>
            <View style={styles.createModalContent}>
            <Text style={styles.modalTitle}>{t('scheduleFollowup') || 'Schedule follow-up'}</Text>
            <Text style={styles.fieldLabel}>{t('patientLabel') || 'Patient'}</Text>
            <View style={styles.pickerBox}>
              {patients.map((patient: any) => (
                <TouchableOpacity
                  key={patient.id}
                  style={[styles.patientOption, selectedPatientId === patient.id && styles.patientOptionActive]}
                  onPress={() => setSelectedPatientId(String(patient.id))}
                >
                  <Text style={[styles.patientOptionText, selectedPatientId === patient.id && styles.patientOptionTextActive]}>{patient.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.fieldLabel}>{t('followupDateLabel') || 'Follow-up date'}</Text>
            <TextInput
              style={styles.input}
              value={newDate}
              onChangeText={setNewDate}
              placeholder={t('placeholderDate') || 'YYYY-MM-DD'}
            />

            <Text style={styles.fieldLabel}>{t('placeholderFollowupNote') ? t('placeholderFollowupNote').split(' ')[0] : 'Notes'}</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={newNotes}
              onChangeText={setNewNotes}
              placeholder={t('placeholderFollowupNote') || 'Add a follow-up note'}
              multiline
            />

            <View style={styles.modalActionRow}>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setShowCreateModal(false)}>
                <Text style={styles.secondaryButtonText}>{t('cancel') || 'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.primaryButtonInline} onPress={handleCreateFollowup}>
                <Text style={styles.primaryButtonInlineText}>{t('save') || 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal transparent visible={!!selectedFollowup} animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setSelectedFollowup(null)}>
          <View style={styles.modalContent}>
            {selectedFollowup && (
              <>
                <Text style={styles.modalTitle}>{selectedFollowup.patientName}</Text>
                <Text style={styles.detailText}>{selectedFollowup.patientAge} yrs • {selectedFollowup.patientSex} • {selectedFollowup.category}</Text>
                <Text style={styles.detailText}>Date: {selectedFollowup.followupDate || 'Not set'}</Text>
                <Text style={styles.fieldLabel}>{t('placeholderFollowupNote') ? t('placeholderFollowupNote').split(' ')[0] : 'Notes'}</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={selectedFollowup.notes}
                  onChangeText={(text) => setSelectedFollowup({ ...selectedFollowup, notes: text })}
                  multiline
                />
                <View style={styles.modalActionRow}>
                  <TouchableOpacity style={styles.secondaryButton} onPress={() => handleCall(selectedFollowup.phone)}>
                    <Text style={styles.secondaryButtonText}>{t('callPatient') || 'Call'}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.primaryButtonInline} onPress={() => {
                    const nextVisited = !selectedFollowup.visited;
                    updateFollowupStatus(selectedFollowup, nextVisited, selectedFollowup.notes);
                    setSelectedFollowup(null);
                  }}>
                    <Text style={styles.primaryButtonInlineText}>{selectedFollowup.visited ? (t('undo') || 'Undo') : (t('completed') || 'Complete')}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {loading ? (
        <View style={styles.loadingBox}><ActivityIndicator color="#0F766E" /><Text style={styles.loadingText}>{t('loadingFollowups') || 'Loading follow-ups...'}</Text></View>
      ) : (
        <>
          {pending.length === 0 && done.length > 0 && (
            <View style={styles.allDoneBanner}><Text style={styles.allDoneIcon}>✅</Text><Text style={styles.allDoneText}>{t('allFollowupsDone') || 'All follow-ups done!'}</Text></View>
          )}

          {pending.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{pending.length} {t('statusPending') || 'Pending'}</Text>
              {pending.map(item => {
                const isEmergency = item.urgency === 'EMERGENCY';
                const isUrgent = item.urgency === 'URGENT';
                return (
                  <TouchableOpacity key={item.id} onPress={() => setSelectedFollowup(item)}>
                    <View style={[styles.card, isEmergency ? styles.cardEmergency : isUrgent ? styles.cardUrgent : null]}>
                      <View style={styles.cardHeader}>
                        <View>
                          <Text style={styles.patientName}>{item.patientName}</Text>
                          <Text style={styles.patientSub}>{item.patientAge} yrs • {item.category}</Text>
                        </View>
                      </View>
                      <View style={styles.urgencyBadgeWrapper}>
                        <View style={[styles.urgencyBadge, isEmergency ? styles.badgeEmergency : isUrgent ? styles.badgeUrgent : null]}>
                          <Text style={[styles.urgencyBadgeText, isEmergency ? styles.badgeTextEmergency : isUrgent ? styles.badgeTextUrgent : null]}>{getUrgencyLabel(item.urgency)}</Text>
                        </View>
                      </View>
                      <View style={styles.actionRow}>
                        <TouchableOpacity style={styles.btnOutline} onPress={() => handleCall(item.phone)}>
                          <FontAwesome5 name="phone-alt" size={14} color="#0F766E" />
                          <Text style={styles.btnOutlineText}>{t('callPatient') || 'Call'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.btnPrimary} onPress={() => updateFollowupStatus(item, true)}>
                          <FontAwesome5 name="check" size={14} color="#FFFFFF" />
                          <Text style={styles.btnPrimaryText}>{t('markVisited') || 'Done'}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {done.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>{t('completed') || 'Completed'} ({done.length})</Text>
              {done.map(item => (
                <View key={item.id} style={styles.doneCard}>
                  <View style={styles.doneIcon}><FontAwesome5 name="check" size={14} color="#FFFFFF" /></View>
                  <View style={styles.doneInfo}>
                    <Text style={styles.doneName}>{item.patientName}</Text>
                    <Text style={styles.doneSub}>{item.category}</Text>
                  </View>
                  <TouchableOpacity onPress={() => updateFollowupStatus(item, false)}><Text style={styles.undoText}>{t('undo') || 'Undo'}</Text></TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 16 },
  dropdownButton: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 12 },
  dropdownButtonText: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  primaryButton: { backgroundColor: '#0F766E', borderRadius: 12, paddingVertical: 12, alignItems: 'center', marginBottom: 16 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 15 },
  primaryButtonInline: { backgroundColor: '#0F766E', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, flex: 1, alignItems: 'center' },
  primaryButtonInlineText: { color: '#FFFFFF', fontWeight: 'bold' },
  secondaryButton: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 16, marginRight: 8, flex: 1, alignItems: 'center' },
  secondaryButtonText: { color: '#0F172A', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18 },
  createModalContent: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 18 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 8 },
  input: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  textArea: { minHeight: 90, textAlignVertical: 'top' },
  pickerBox: { backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 8, marginBottom: 12 },
  patientOption: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginBottom: 6 },
  patientOptionActive: { backgroundColor: '#F0FDFA' },
  patientOptionText: { color: '#334155', fontWeight: '600' },
  patientOptionTextActive: { color: '#0F766E' },
  modalActionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  dropdownItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16, borderRadius: 8 },
  dropdownItemActive: { backgroundColor: '#F0FDFA' },
  dropdownItemText: { fontSize: 15, fontWeight: '500', color: '#475569' },
  dropdownItemTextActive: { color: '#0F766E', fontWeight: 'bold' },
  dropdownBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 12 },
  dropdownBadgeText: { fontSize: 12, fontWeight: 'bold', color: '#64748B' },
  detailText: { color: '#475569', marginBottom: 8 },
  loadingBox: { padding: 24, alignItems: 'center', justifyContent: 'center' },
  loadingText: { marginTop: 8, color: '#64748B' },
  allDoneBanner: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20 },
  allDoneIcon: { fontSize: 32, marginBottom: 8 },
  allDoneText: { fontSize: 16, fontWeight: 'bold', color: '#15803D' },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#0F172A', marginBottom: 12 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0', borderLeftWidth: 4, borderLeftColor: '#10B981', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  cardEmergency: { backgroundColor: '#FEF2F2', borderColor: '#FCA5A5', borderLeftColor: '#EF4444' },
  cardUrgent: { backgroundColor: '#FFFBEB', borderColor: '#FDE68A', borderLeftColor: '#F59E0B' },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  patientName: { fontSize: 16, fontWeight: 'bold', color: '#0F172A' },
  patientSub: { fontSize: 13, color: '#64748B', marginTop: 2 },
  urgencyBadgeWrapper: { marginTop: 8, alignItems: 'flex-start' },
  urgencyBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: '#10B981' },
  badgeEmergency: { backgroundColor: '#EF4444' },
  badgeUrgent: { backgroundColor: '#F59E0B' },
  urgencyBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: 'bold' },
  badgeTextEmergency: {},
  badgeTextUrgent: {},
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 },
  btnOutline: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#0F766E', borderRadius: 12, paddingVertical: 10, marginRight: 8 },
  btnOutlineText: { color: '#0F766E', fontWeight: 'bold', marginLeft: 8 },
  btnPrimary: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#16A34A', borderRadius: 12, paddingVertical: 10 },
  btnPrimaryText: { color: '#FFFFFF', fontWeight: 'bold', marginLeft: 8 },
  doneCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 12, padding: 12, marginBottom: 8, opacity: 0.8 },
  doneIcon: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#16A34A', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  doneInfo: { flex: 1 },
  doneName: { fontSize: 14, fontWeight: 'bold', color: '#475569', textDecorationLine: 'line-through' },
  doneSub: { fontSize: 12, color: '#94A3B8' },
  undoText: { color: '#0F766E', fontWeight: 'bold', fontSize: 13 },
});
