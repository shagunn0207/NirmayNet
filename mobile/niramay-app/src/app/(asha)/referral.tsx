import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  TextInput, ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { BACKEND_URL } from '../../lib/apiClient';
import { enqueueReferralCreation, getOfflinePatients } from '../../lib/syncQueue';

interface PatientOption {
  id: string;
  name: string;
  village?: string;
}

interface ReferralRecord {
  id: string;
  referral_code: string;
  patient_id: string;
  patient_name?: string;
  destination_hospital: string;
  reason: string;
  status: string;
  created_at: string;
  updated_at?: string;
}

interface DispatchResult {
  id: string;
  referral_id: string;
  vehicle_number?: string;
  driver_name?: string;
  driver_phone?: string;
  eta_minutes?: number;
  status: string;
  message?: string;
}

const COMMON_REASONS = [
  'Fever with high temperature',
  'Pregnancy complication',
  'Severe chest discomfort',
  'Breathing difficulty',
  'Persistent vomiting & dehydration',
  'Uncontrolled hypertension',
];

export default function CreateReferralScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { session, t } = useAuth();

  // Top Tab Navigation: 'create' | 'my_referrals'
  const [activeTab, setActiveTab] = useState<'create' | 'my_referrals'>(
    params.patientId ? 'create' : 'create'
  );

  // Form state
  const [patients, setPatients] = useState<PatientOption[]>([
    { id: '11111111-1111-1111-1111-111111111111', name: 'Rekha Patil', village: 'Chinchpada' },
    { id: '22222222-2222-2222-2222-222222222222', name: 'Sunita Kamble', village: 'Nandgaon' },
  ]);

  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    (params.patientId as string) || '11111111-1111-1111-1111-111111111111'
  );
  const [selectedReason, setSelectedReason] = useState<string>(COMMON_REASONS[0]);
  const [customReason, setCustomReason] = useState('');
  const [priority, setPriority] = useState<'Normal' | 'Urgent' | 'Emergency'>(
    (params.priority as any) || 'Normal'
  );
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  // Referral Sent / Feedback state
  const [referralSent, setReferralSent] = useState(false);
  const [sentCode, setSentCode] = useState<string>('');
  const [sentReferralId, setSentReferralId] = useState<string | null>(null);
  const [sentReferralStatus, setSentReferralStatus] = useState<string>('PENDING');
  const [refreshingStatus, setRefreshingStatus] = useState(false);

  // 108 Dispatch state
  const [dispatchLoading, setDispatchLoading] = useState(false);
  const [dispatchResult, setDispatchResult] = useState<DispatchResult | null>(null);
  const [dispatchError, setDispatchError] = useState<string | null>(null);

  // My Referrals list state
  const [myReferrals, setMyReferrals] = useState<ReferralRecord[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [refreshingList, setRefreshingList] = useState(false);
  const [selectedReferralDetail, setSelectedReferralDetail] = useState<ReferralRecord | null>(null);

  // Fetch registered patients for selector & patient name resolution
  const fetchPatients = useCallback(async () => {
    try {
      const offlineList = await getOfflinePatients();
      const offlineOptions: PatientOption[] = offlineList.map(p => ({
        id: p.id,
        name: `${p.name} (Offline)`,
        village: p.village,
      }));

      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${BACKEND_URL}/api/v1/patients/`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const onlineOptions: PatientOption[] = data.map((p: any) => ({
            id: String(p.id),
            name: p.name,
            village: p.village,
          }));
          const combined = [...offlineOptions, ...onlineOptions];
          if (combined.length > 0) {
            setPatients(combined);
            if (!params.patientId && !selectedPatientId) {
              setSelectedPatientId(combined[0].id);
            }
          }
          return;
        }
      }
      if (offlineOptions.length > 0) {
        setPatients(offlineOptions);
        if (!params.patientId && !selectedPatientId) {
          setSelectedPatientId(offlineOptions[0].id);
        }
      }
    } catch {
      // Keep fallback
    }
  }, [session, params.patientId, selectedPatientId]);

  // Fetch all referrals created by this ASHA worker
  const fetchMyReferrals = useCallback(async () => {
    setLoadingList(true);
    try {
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [refRes, patRes] = await Promise.all([
        fetch(`${BACKEND_URL}/api/v1/referrals/`, { headers }),
        fetch(`${BACKEND_URL}/api/v1/patients/`, { headers }),
      ]);

      const patientMap = new Map<string, string>();
      if (patRes.ok) {
        const patData = await patRes.json();
        if (Array.isArray(patData)) {
          patData.forEach((p: any) => patientMap.set(String(p.id), p.name));
        }
      }

      if (refRes.ok) {
        const data = await refRes.json();
        if (Array.isArray(data)) {
          const list: ReferralRecord[] = data.map((r: any) => ({
            id: String(r.id),
            referral_code: r.referral_code || `NMN-${String(r.id).slice(0, 8)}`,
            patient_id: String(r.patient_id),
            patient_name: patientMap.get(String(r.patient_id)) || 'Patient',
            destination_hospital: r.destination_hospital || 'District Hospital Nandurbar',
            reason: r.reason || '',
            status: r.status || 'PENDING',
            created_at: r.created_at || new Date().toISOString(),
            updated_at: r.updated_at,
          }));
          setMyReferrals(list);

          // If a referral detail modal is open, sync its updated status
          if (selectedReferralDetail) {
            const match = list.find(item => item.id === selectedReferralDetail.id);
            if (match) setSelectedReferralDetail(match);
          }
        }
      }
    } catch {
      // Keep existing list
    } finally {
      setLoadingList(false);
    }
  }, [session, selectedReferralDetail]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useFocusEffect(
    useCallback(() => {
      // Refresh referral list from backend
      fetchMyReferrals();
      // Reset form & sent-confirmation state so returning always shows a fresh form
      setReferralSent(false);
      setSentCode('');
      setSentReferralId(null);
      setSentReferralStatus('PENDING');
      setDispatchResult(null);
      setDispatchError(null);
      setCustomReason('');
      setNotes('');
      setSelectedReferralDetail(null);
      setActiveTab(params.patientId ? 'create' : 'create');
      setPriority((params.priority as any) || 'Normal');
      if (params.patientId) {
        setSelectedPatientId(params.patientId as string);
      }
    }, [fetchMyReferrals, params.patientId, params.priority])
  );

  // Poll sent referral live status from backend
  const checkLiveStatus = async (refId: string) => {
    if (!refId) return;
    setRefreshingStatus(true);
    try {
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const res = await fetch(`${BACKEND_URL}/api/v1/referrals/${refId}`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.status) {
          setSentReferralStatus(data.status);
        }
      }
    } catch {
      // Keep existing status
    } finally {
      setRefreshingStatus(false);
    }
  };

  // Real-time polling while Referral Sent confirmation is visible
  useEffect(() => {
    if (!referralSent || !sentReferralId) return;
    const timer = setInterval(() => {
      checkLiveStatus(sentReferralId);
    }, 4000);
    return () => clearInterval(timer);
  }, [referralSent, sentReferralId]);

  // ── Handle Send Referral ───────────────────────────────────────────────────
  const handleSendReferral = async () => {
    if (!selectedPatientId) {
      Alert.alert('Required', 'Please select a patient.');
      return;
    }

    setLoading(true);
    try {
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const finalReason = `${selectedReason}${customReason ? ` - ${customReason}` : ''} [Priority: ${priority}]${notes ? ` (Notes: ${notes})` : ''}`;

      const payload = {
        patient_id: selectedPatientId,
        destination_hospital: 'District Hospital Nandurbar',
        reason: finalReason,
      };

      let success = false;
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/referrals/`, {
          method: 'POST',
          headers,
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          setSentCode(data.referral_code || 'NMN-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000));
          setSentReferralId(data.id ? String(data.id) : null);
          setSentReferralStatus(data.status || 'PENDING');
          setReferralSent(true);
          success = true;
          fetchMyReferrals();
        }
      } catch {
        // Network error / offline
      }

      if (!success) {
        // Offline queue fallback
        const offlineCode = `NMN-OFFLINE-${Math.floor(1000 + Math.random() * 9000)}`;
        const tempRefId = `temp-ref-${Date.now()}`;
        await enqueueReferralCreation(payload, tempRefId);
        setSentCode(offlineCode);
        setSentReferralId(tempRefId);
        setSentReferralStatus('PENDING');
        setReferralSent(true);
        setMyReferrals(prev => [
          {
            id: tempRefId,
            referral_code: offlineCode,
            patient_id: selectedPatientId,
            patient_name: patients.find(p => p.id === selectedPatientId)?.name || 'Patient',
            destination_hospital: 'District Hospital Nandurbar',
            reason: finalReason,
            status: 'PENDING',
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        Alert.alert('Saved Offline', 'Referral has been saved locally and will automatically sync once connectivity returns.');
      }
    } catch {
      Alert.alert('Error', 'Could not create referral.');
    } finally {
      setLoading(false);
    }
  };

  // ── Call 108 Ambulance ─────────────────────────────────────────────────────
  const handleDispatch108 = async () => {
    if (!sentReferralId) {
      Alert.alert('Error', 'No referral ID available for dispatch. Please send a referral first.');
      return;
    }

    setDispatchLoading(true);
    setDispatchError(null);
    setDispatchResult(null);

    try {
      const token = session?.access_token;
      if (!token) {
        setDispatchError('Authentication required. Please log in again.');
        return;
      }

      const res = await fetch(`${BACKEND_URL}/api/v1/dispatch/108`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ referral_id: sentReferralId }),
      });

      if (res.status === 201 || res.ok) {
        const data = await res.json();
        setDispatchResult({
          id: String(data.id),
          referral_id: String(data.referral_id),
          vehicle_number: data.vehicle_number,
          driver_name: data.driver_name,
          driver_phone: data.driver_phone,
          eta_minutes: data.eta_minutes,
          status: data.status || 'DISPATCHED',
          message: data.message,
        });
        setSentReferralStatus('DISPATCHED');
        fetchMyReferrals();
      } else {
        const err = await res.json().catch(() => ({}));
        setDispatchError(err.detail || `Dispatch failed (HTTP ${res.status}).`);
      }
    } catch (e: any) {
      setDispatchError('Network error. Could not reach dispatch service.');
    } finally {
      setDispatchLoading(false);
    }
  };

  const selectedPatientObj = patients.find(p => p.id === selectedPatientId) || patients[0];

  const getStatusBadge = (st: string) => {
    switch (st?.toUpperCase()) {
      case 'CONFIRMED_ARRIVAL':
        return { bg: '#DBEAFE', text: '#1D4ED8', label: 'Arrival Confirmed' };
      case 'IN_CONSULTATION':
        return { bg: '#EDE9FE', text: '#6D28D9', label: 'In Consultation' };
      case 'COMPLETED':
        return { bg: '#DCFCE7', text: '#15803D', label: 'Completed' };
      case 'DISPATCHED':
        return { bg: '#FEE2E2', text: '#DC2626', label: '108 Dispatched' };
      case 'CANCELLED':
        return { bg: '#F1F5F9', text: '#64748B', label: 'Cancelled' };
      case 'PENDING':
      default:
        return { bg: '#FEF3C7', text: '#B45309', label: 'Pending Review' };
    }
  };

  const renderTimeline = (st: string) => {
    const isSent = true;
    const isDispatched = st === 'DISPATCHED' || st === 'CONFIRMED_ARRIVAL' || st === 'IN_CONSULTATION' || st === 'COMPLETED';
    const isArrived = st === 'CONFIRMED_ARRIVAL' || st === 'IN_CONSULTATION' || st === 'COMPLETED';
    const isInConsult = st === 'IN_CONSULTATION' || st === 'COMPLETED';
    const isDone = st === 'COMPLETED';

    return (
      <View style={styles.timelineBox}>
        <Text style={styles.timelineHeader}>Hospital Feedback & Status Progression</Text>

        <View style={styles.timelineRow}>
          <View style={[styles.timelineDot, styles.timelineDotDone]}>
            <FontAwesome5 name="check" size={9} color="#FFFFFF" />
          </View>
          <View style={styles.timelineContent}>
            <Text style={styles.timelineLabelDone}>1. Referral Created & Notified</Text>
            <Text style={styles.timelineSubDone}>Sent to District Hospital</Text>
          </View>
        </View>

        {st === 'DISPATCHED' && (
          <View style={styles.timelineRow}>
            <View style={[styles.timelineDot, styles.timelineDotDispatched]}>
              <FontAwesome5 name="ambulance" size={9} color="#FFFFFF" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={[styles.timelineLabelDone, { color: '#DC2626' }]}>2. 108 Ambulance Dispatched</Text>
              <Text style={styles.timelineSubDone}>Vehicle en route</Text>
            </View>
          </View>
        )}

        <View style={styles.timelineRow}>
          <View style={[styles.timelineDot, isArrived ? styles.timelineDotDone : styles.timelineDotPending]}>
            {isArrived && <FontAwesome5 name="check" size={9} color="#FFFFFF" />}
          </View>
          <View style={styles.timelineContent}>
            <Text style={isArrived ? styles.timelineLabelDone : styles.timelineLabelPending}>
              {isDispatched ? '3.' : '2.'} Hospital Arrival Confirmed
            </Text>
            <Text style={styles.timelineSubPending}>
              {isArrived ? 'PHC recorded patient arrival' : 'Awaiting patient arrival at facility'}
            </Text>
          </View>
        </View>

        <View style={styles.timelineRow}>
          <View style={[styles.timelineDot, isInConsult ? styles.timelineDotDone : styles.timelineDotPending]}>
            {isInConsult && <FontAwesome5 name="check" size={9} color="#FFFFFF" />}
          </View>
          <View style={styles.timelineContent}>
            <Text style={isInConsult ? styles.timelineLabelDone : styles.timelineLabelPending}>
              {isDispatched ? '4.' : '3.'} Doctor Consultation
            </Text>
            <Text style={styles.timelineSubPending}>
              {isInConsult ? 'Consultation in progress' : 'Doctor queue pending'}
            </Text>
          </View>
        </View>

        <View style={[styles.timelineRow, { marginBottom: 0 }]}>
          <View style={[styles.timelineDot, isDone ? styles.timelineDotDone : styles.timelineDotPending]}>
            {isDone && <FontAwesome5 name="check" size={9} color="#FFFFFF" />}
          </View>
          <View style={styles.timelineContent}>
            <Text style={isDone ? styles.timelineLabelDone : styles.timelineLabelPending}>
              {isDispatched ? '5.' : '4.'} Referral Completed
            </Text>
            <Text style={styles.timelineSubPending}>
              {isDone ? 'Treatment & consultation completed' : 'Final disposition pending'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // ───────────────────────────────────────────────────────────────────────────
  // SCREEN: REFERRAL DETAIL MODAL (WHEN A REFERRAL IN LIST IS CLICKED)
  // ───────────────────────────────────────────────────────────────────────────
  if (selectedReferralDetail) {
    const badge = getStatusBadge(selectedReferralDetail.status);
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setSelectedReferralDetail(null)}>
            <FontAwesome5 name="arrow-left" size={16} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('referralStatusFeedback')}</Text>
          <TouchableOpacity
            style={styles.refreshBtnSmall}
            onPress={() => {
              checkLiveStatus(selectedReferralDetail.id);
              fetchMyReferrals();
            }}
          >
            <FontAwesome5 name="sync-alt" size={14} color="#2563EB" />
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.detailHeaderRow}>
            <View>
              <Text style={styles.detailPatientName}>{selectedReferralDetail.patient_name}</Text>
              <Text style={styles.detailCodeText}>{t('codeLabel')} {selectedReferralDetail.referral_code}</Text>
            </View>
            <View style={[styles.statusBadgeLarge, { backgroundColor: badge.bg }]}>
              <Text style={[styles.statusBadgeTextLarge, { color: badge.text }]}>
                {badge.label}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Hospital</Text>
            <Text style={styles.infoValue}>{selectedReferralDetail.destination_hospital}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Reason</Text>
            <Text style={[styles.infoValue, { flex: 1, textAlign: 'right' }]} numberOfLines={2}>
              {selectedReferralDetail.reason}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date</Text>
            <Text style={styles.infoValue}>
              {new Date(selectedReferralDetail.created_at).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
              })}
            </Text>
          </View>

          {renderTimeline(selectedReferralDetail.status)}

          <TouchableOpacity
            style={[styles.primaryBtn, { marginTop: 16 }]}
            onPress={() => setSelectedReferralDetail(null)}
          >
            <Text style={styles.primaryBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        activeTab === 'my_referrals' ? (
          <RefreshControl refreshing={refreshingList} onRefresh={fetchMyReferrals} colors={['#059669']} />
        ) : undefined
      }
    >
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={16} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('ashaReferrals')}</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Tab Switcher: Create Referral vs My Referrals */}
      <View style={styles.tabSwitcher}>
        <TouchableOpacity
          style={[styles.tabSwitchBtn, activeTab === 'create' && styles.tabSwitchBtnActive]}
          onPress={() => {
            setActiveTab('create');
            setReferralSent(false);
          }}
        >
          <FontAwesome5
            name="plus-circle"
            size={13}
            color={activeTab === 'create' ? '#FFFFFF' : '#64748B'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabSwitchText, activeTab === 'create' && styles.tabSwitchTextActive]}>
            {t('makeReferral')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabSwitchBtn, activeTab === 'my_referrals' && styles.tabSwitchBtnActive]}
          onPress={() => {
            setActiveTab('my_referrals');
            fetchMyReferrals();
          }}
        >
          <FontAwesome5
            name="list-alt"
            size={13}
            color={activeTab === 'my_referrals' ? '#FFFFFF' : '#64748B'}
            style={{ marginRight: 6 }}
          />
          <Text style={[styles.tabSwitchText, activeTab === 'my_referrals' && styles.tabSwitchTextActive]}>
            {t('sentReferrals')} ({myReferrals.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── TAB 1: CREATE REFERRAL / CONFIRMATION ── */}
      {activeTab === 'create' && (
        <>
          {referralSent ? (
            <View style={styles.successCard}>
              <View style={styles.successIconBadge}>
                <FontAwesome5 name="check-circle" size={40} color="#059669" />
              </View>
              <Text style={styles.successTitle}>{t('referralSentSuccess')}</Text>
              <Text style={styles.successSub}>
                {t('trackingIdLabel')} <Text style={{ fontFamily: 'Inter_700Bold', color: '#059669' }}>{sentCode}</Text>
              </Text>

              {/* Real Backend Status Display */}
              <View style={styles.liveStatusContainer}>
                <View style={styles.liveStatusHeader}>
                  <Text style={styles.liveStatusTitle}>{t('liveHospitalFeedback')}</Text>
                  <TouchableOpacity
                    style={styles.refreshStatusBtn}
                    onPress={() => sentReferralId && checkLiveStatus(sentReferralId)}
                    disabled={refreshingStatus}
                  >
                    {refreshingStatus ? (
                      <ActivityIndicator size="small" color="#2563EB" />
                    ) : (
                      <>
                        <FontAwesome5 name="sync-alt" size={11} color="#2563EB" style={{ marginRight: 4 }} />
                        <Text style={styles.refreshStatusBtnText}>{t('refreshStatus')}</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                {(() => {
                  const b = getStatusBadge(sentReferralStatus);
                  return (
                    <View style={[styles.statusBadgeHero, { backgroundColor: b.bg }]}>
                      <FontAwesome5 name="clock" size={13} color={b.text} style={{ marginRight: 6 }} />
                      <Text style={[styles.statusBadgeTextHero, { color: b.text }]}>
                        Status: {b.label}
                      </Text>
                    </View>
                  );
                })()}
              </View>

              <Text style={styles.successDetails}>
                {t('patientLabel')} {selectedPatientObj?.name}{'\n'}
                {t('priority')} {priority}{'\n'}
                {t('destinationHospitalLabel')} District Hospital Nandurbar
              </Text>

              {/* Real Progression Timeline */}
              {renderTimeline(sentReferralStatus)}

              {/* ── 108 Ambulance Section ── */}
              {(priority === 'Emergency' || priority === 'Urgent') && !dispatchResult && (
                <View style={styles.dispatchSection}>
                  <View style={styles.emergencyBanner}>
                    <FontAwesome5 name="exclamation-circle" size={16} color="#DC2626" style={{ marginRight: 8 }} />
                    <Text style={styles.emergencyBannerText}>
                      {priority === 'Emergency' ? t('emergencyDetected') : t('urgentReferral')} {t('ambulanceMayBeNeeded')}
                    </Text>
                  </View>

                  {dispatchError && (
                    <View style={styles.dispatchErrorBox}>
                      <FontAwesome5 name="times-circle" size={14} color="#DC2626" style={{ marginRight: 6 }} />
                      <Text style={styles.dispatchErrorText}>{dispatchError}</Text>
                    </View>
                  )}

                  <TouchableOpacity
                    accessibilityLabel="Call 108 Ambulance"
                    style={[styles.ambulanceBtn, dispatchLoading && styles.ambulanceBtnLoading]}
                    activeOpacity={0.85}
                    onPress={handleDispatch108}
                    disabled={dispatchLoading || !sentReferralId}
                  >
                    {dispatchLoading ? (
                      <ActivityIndicator color="#FFFFFF" />
                    ) : (
                      <>
                        <FontAwesome5 name="ambulance" size={18} color="#FFFFFF" style={{ marginRight: 10 }} />
                        <Text style={styles.ambulanceBtnText}>
                          {sentReferralId ? `🚑 ${t('callAmbulance')}` : '108 (No referral ID)'}
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              )}

              {/* ── Dispatch Result Card ── */}
              {dispatchResult && (
                <View style={styles.dispatchResultCard}>
                  <View style={styles.dispatchStatusHeader}>
                    <View style={styles.dispatchStatusBadge}>
                      <FontAwesome5 name="ambulance" size={14} color="#DC2626" style={{ marginRight: 6 }} />
                      <Text style={styles.dispatchStatusText}>{dispatchResult.status}</Text>
                    </View>
                    <Text style={styles.dispatchEtaText}>
                      ETA: <Text style={{ fontFamily: 'Inter_700Bold', color: '#DC2626' }}>
                        {dispatchResult.eta_minutes ?? '—'} min
                      </Text>
                    </Text>
                  </View>

                  <View style={styles.dispatchInfoRow}>
                    <View style={styles.dispatchInfoIcon}>
                      <FontAwesome5 name="car" size={13} color="#7C3AED" />
                    </View>
                    <View>
                      <Text style={styles.dispatchInfoLabel}>Vehicle</Text>
                      <Text style={styles.dispatchInfoValue}>{dispatchResult.vehicle_number || '—'}</Text>
                    </View>
                  </View>

                  <View style={styles.dispatchInfoRow}>
                    <View style={styles.dispatchInfoIcon}>
                      <FontAwesome5 name="user" size={13} color="#7C3AED" />
                    </View>
                    <View>
                      <Text style={styles.dispatchInfoLabel}>Driver</Text>
                      <Text style={styles.dispatchInfoValue}>{dispatchResult.driver_name || '—'}</Text>
                    </View>
                  </View>

                  <View style={styles.dispatchInfoRow}>
                    <View style={styles.dispatchInfoIcon}>
                      <FontAwesome5 name="phone" size={13} color="#7C3AED" />
                    </View>
                    <View>
                      <Text style={styles.dispatchInfoLabel}>Contact</Text>
                      <Text style={styles.dispatchInfoValue}>{dispatchResult.driver_phone || '—'}</Text>
                    </View>
                  </View>

                  {dispatchResult.message && (
                    <View style={styles.dispatchMessageBox}>
                      <FontAwesome5 name="info-circle" size={12} color="#6B7280" style={{ marginRight: 6, marginTop: 1 }} />
                      <Text style={styles.dispatchMessageText}>{dispatchResult.message}</Text>
                    </View>
                  )}
                </View>
              )}

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={[styles.primaryBtn, { flex: 1, marginRight: 8 }]}
                  onPress={() => {
                    setActiveTab('my_referrals');
                    setReferralSent(false);
                    fetchMyReferrals();
                  }}
                >
                  <Text style={styles.primaryBtnText}>{t('viewAllReferrals')}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.primaryBtn, { flex: 1, backgroundColor: '#475569' }]}
                  onPress={() => {
                    setReferralSent(false);
                    setDispatchResult(null);
                    setDispatchError(null);
                    setSentReferralId(null);
                    router.replace('/(asha)/home');
                  }}
                >
                  <Text style={styles.primaryBtnText}>{t('backToHome')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <Text style={styles.sectionHeader}>{t('referralDetails')}</Text>

              {/* Patient Selector */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('patientLabel')}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.patientScroll}>
                  {patients.map(p => {
                    const isSelected = p.id === selectedPatientId;
                    return (
                      <TouchableOpacity
                        key={p.id}
                        style={[styles.patientChip, isSelected && styles.patientChipActive]}
                        onPress={() => setSelectedPatientId(p.id)}
                      >
                        <FontAwesome5
                          name="user"
                          size={12}
                          color={isSelected ? '#FFFFFF' : '#64748B'}
                          style={{ marginRight: 6 }}
                        />
                        <Text style={[styles.patientChipText, isSelected && styles.patientChipTextActive]}>
                          {p.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Reason for Referral */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('reasonForReferral')}</Text>
                <View style={styles.reasonWrap}>
                  {COMMON_REASONS.map(reason => {
                    const isSelected = selectedReason === reason;
                    return (
                      <TouchableOpacity
                        key={reason}
                        style={[styles.reasonChip, isSelected && styles.reasonChipActive]}
                        onPress={() => setSelectedReason(reason)}
                      >
                        <Text style={[styles.reasonChipText, isSelected && styles.reasonChipTextActive]}>
                          {reason}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <TextInput
                  style={[styles.input, { marginTop: 8 }]}
                  placeholder={t('customReasonPlaceholder')}
                  placeholderTextColor="#94A3B8"
                  value={customReason}
                  onChangeText={setCustomReason}
                />
              </View>

              {/* Priority */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('priority')}</Text>
                <View style={styles.priorityRow}>
                  {(['Normal', 'Urgent', 'Emergency'] as const).map(pr => {
                    const isSelected = priority === pr;
                    return (
                      <TouchableOpacity
                        key={pr}
                        style={[
                          styles.priorityChip,
                          isSelected &&
                            (pr === 'Emergency'
                              ? styles.priorityEmergency
                              : pr === 'Urgent'
                              ? styles.priorityUrgent
                              : styles.priorityNormal),
                        ]}
                        onPress={() => setPriority(pr)}
                      >
                        <Text
                          style={[
                            styles.priorityChipText,
                            isSelected && styles.priorityChipTextActive,
                          ]}
                        >
                          {t(pr) || pr}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Notes */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('notesOptional')}</Text>
                <TextInput
                  style={[styles.input, { height: 74, textAlignVertical: 'top' }]}
                  placeholder={t('notesPlaceholder')}
                  placeholderTextColor="#94A3B8"
                  multiline
                  value={notes}
                  onChangeText={setNotes}
                />
              </View>

              {/* Send Referral Button */}
              <TouchableOpacity
                style={styles.primaryBtn}
                activeOpacity={0.85}
                onPress={handleSendReferral}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryBtnText}>{t('sendReferral')}</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </>
      )}

      {/* ── TAB 2: MY REFERRALS LIST ── */}
      {activeTab === 'my_referrals' && (
        <View style={{ marginTop: 4 }}>
          {loadingList && myReferrals.length === 0 ? (
            <ActivityIndicator size="small" color="#059669" style={{ marginTop: 32 }} />
          ) : myReferrals.length === 0 ? (
            <View style={styles.emptyCard}>
              <FontAwesome5 name="inbox" size={36} color="#CBD5E1" style={{ marginBottom: 10 }} />
              <Text style={styles.emptyCardTitle}>{t('noReferralsSent')}</Text>
              <Text style={styles.emptyCardSub}>{t('referralsWillAppearHere')}</Text>
              <TouchableOpacity
                style={[styles.primaryBtn, { marginTop: 16, paddingHorizontal: 20 }]}
                onPress={() => setActiveTab('create')}
              >
                <Text style={styles.primaryBtnText}>+ {t('createNewReferral')}</Text>
              </TouchableOpacity>
            </View>
          ) : (
            myReferrals.map(item => {
              const badge = getStatusBadge(item.status);
              const dateStr = new Date(item.created_at).toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
              });

              return (
                <TouchableOpacity
                  key={item.id}
                  style={styles.referralListCard}
                  activeOpacity={0.85}
                  onPress={() => setSelectedReferralDetail(item)}
                >
                  <View style={styles.cardTopRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.cardPatientName}>{item.patient_name}</Text>
                      <Text style={styles.cardTrackingCode}>{t('codeLabel')} {item.referral_code}</Text>
                    </View>

                    <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                      <Text style={[styles.statusBadgeText, { color: badge.text }]}>
                        {badge.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.divider} />

                  <Text style={styles.cardReasonText} numberOfLines={2}>
                    {item.reason || 'Medical referral'}
                  </Text>

                  <View style={styles.cardBottomRow}>
                    <View style={styles.cardHospitalWrap}>
                      <FontAwesome5 name="hospital" size={11} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={styles.cardHospitalText}>{item.destination_hospital}</Text>
                    </View>
                    <Text style={styles.cardDateText}>{dateStr}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
      )}
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
    marginBottom: 14,
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
  refreshBtnSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },

  // ── Tab Switcher ──
  tabSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
    gap: 8,
  },
  tabSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  tabSwitchBtnActive: {
    backgroundColor: '#059669',
  },
  tabSwitchText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
  tabSwitchTextActive: {
    color: '#FFFFFF',
  },

  // ── Card ──
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#334155',
    marginBottom: 8,
  },
  patientScroll: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  patientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
  },
  patientChipActive: {
    backgroundColor: '#059669',
  },
  patientChipText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#475569',
  },
  patientChipTextActive: {
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  reasonWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },
  reasonChip: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  reasonChipActive: {
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
  },
  reasonChipText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#475569',
  },
  reasonChipTextActive: {
    color: '#166534',
    fontFamily: 'Inter_700Bold',
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    height: 42,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  priorityNormal: {
    backgroundColor: '#E0F2FE',
    borderColor: '#7DD3FC',
  },
  priorityUrgent: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
  },
  priorityEmergency: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  priorityChipText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
  },
  priorityChipTextActive: {
    color: '#0F172A',
    fontFamily: 'Inter_700Bold',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#0F172A',
  },
  primaryBtn: {
    backgroundColor: '#059669',
    borderRadius: 14,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
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

  // ── Success / Feedback Screen ──
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 22,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  successIconBadge: {
    marginBottom: 14,
  },
  successTitle: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
    marginBottom: 6,
  },
  successSub: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginBottom: 12,
  },
  liveStatusContainer: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  liveStatusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  liveStatusTitle: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
  },
  refreshStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  refreshStatusBtnText: {
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    color: '#2563EB',
  },
  statusBadgeHero: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  statusBadgeTextHero: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  successDetails: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#334155',
    lineHeight: 22,
    textAlign: 'center',
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    width: '100%',
    marginBottom: 14,
  },

  // ── Timeline Styles ──
  timelineBox: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  timelineHeader: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  timelineDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 1,
  },
  timelineDotDone: {
    backgroundColor: '#16A34A',
  },
  timelineDotDispatched: {
    backgroundColor: '#DC2626',
  },
  timelineDotPending: {
    backgroundColor: '#E2E8F0',
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabelDone: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  timelineLabelPending: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#94A3B8',
  },
  timelineSubDone: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 1,
  },
  timelineSubPending: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
    marginTop: 1,
  },

  // ── 108 Dispatch Styles ──
  dispatchSection: {
    width: '100%',
    marginBottom: 14,
  },
  emergencyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  emergencyBannerText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#991B1B',
  },
  dispatchErrorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  dispatchErrorText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#B91C1C',
  },
  ambulanceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    borderRadius: 14,
    height: 50,
    width: '100%',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  ambulanceBtnLoading: {
    opacity: 0.7,
  },
  ambulanceBtnText: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  dispatchResultCard: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
  },
  dispatchStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#FECACA',
  },
  dispatchStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dispatchStatusText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  dispatchEtaText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#1E293B',
  },
  dispatchInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dispatchInfoIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  dispatchInfoLabel: {
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  dispatchInfoValue: {
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  dispatchMessageBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 8,
    marginTop: 6,
  },
  dispatchMessageText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#475569',
    lineHeight: 16,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
  },

  // ── Sent Referrals List ──
  referralListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardPatientName: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  cardTrackingCode: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 10,
  },
  cardReasonText: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#334155',
    lineHeight: 18,
    marginBottom: 10,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHospitalWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  cardHospitalText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  cardDateText: {
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    color: '#94A3B8',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginTop: 12,
  },
  emptyCardTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  emptyCardSub: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },

  // ── Detail Modal View ──
  detailHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailPatientName: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
  },
  detailCodeText: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#059669',
    marginTop: 2,
  },
  statusBadgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusBadgeTextLarge: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
    width: 80,
  },
  infoValue: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#0F172A',
  },
});
