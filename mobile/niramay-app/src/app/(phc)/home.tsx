import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, RefreshControl
} from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { BACKEND_URL } from '../../lib/apiClient';

interface ScheduleItem {
  id: string;
  title: string;
  countText: string;
  icon: string;
  color: string;
  bgColor: string;
}

export default function PhcHomeScreen() {
  const { user, session } = useAuth();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const [patientsCount, setPatientsCount] = useState(0);
  const [followupsCount, setFollowupsCount] = useState(0);

  const fetchStats = async () => {
    try {
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      // Fetch referrals count
      const res = await fetch(`${BACKEND_URL}/api/v1/referrals/`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          const pending = data.filter((r: any) => r.status === 'PENDING' || r.status === 'DISPATCHED' || !r.status).length;
          const followups = data.filter((r: any) => r.status === 'CONFIRMED_ARRIVAL' || r.status === 'IN_CONSULTATION').length;
          setPendingCount(pending);
          setFollowupsCount(followups);
        }
      }

      // Fetch patients/queue count
      const qRes = await fetch(`${BACKEND_URL}/api/v1/patients/`, { headers });
      if (qRes.ok) {
        const qData = await qRes.json();
        if (Array.isArray(qData)) {
          setPatientsCount(qData.length);
        }
      }
    } catch {
      // Keep state
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStats();
    }, [session])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  const scheduleItems: ScheduleItem[] = [
    {
      id: 's-1',
      title: 'Patients today',
      countText: `${patientsCount} Patients registered`,
      icon: 'users',
      color: '#2563EB',
      bgColor: '#EFF6FF',
    },
    {
      id: 's-2',
      title: 'Referrals to review',
      countText: `${pendingCount} Referrals to review`,
      icon: 'file-import',
      color: '#EA580C',
      bgColor: '#FFF7ED',
    },
    {
      id: 's-3',
      title: 'Follow-ups',
      countText: `${followupsCount} In-progress / Follow-ups`,
      icon: 'calendar-check',
      color: '#059669',
      bgColor: '#ECFDF5',
    },
  ];

  const doctorName = user?.name ? (user.name.includes('Hospital') ? 'Doctor' : user.name) : 'Doctor';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2563EB']} />}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Top Header Bar ── */}
      <View style={styles.headerBar}>
        <View style={styles.headerLeft}>
          <View style={styles.avatarMini}>
            <FontAwesome5 name="user-md" size={20} color="#2563EB" />
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.greetingSub}>{user?.facility_name || 'District Hospital'}</Text>
            <Text style={styles.greetingName}>{doctorName}!</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.profileBtn}
          onPress={() => router.push('/(phc)/profile')}
        >
          <FontAwesome5 name="user-circle" size={28} color="#64748B" />
        </TouchableOpacity>
      </View>

      {/* ── New Referrals Banner ── */}
      <TouchableOpacity
        style={styles.alertBanner}
        activeOpacity={0.85}
        onPress={() => router.push('/(phc)/referrals')}
      >
        <View style={styles.alertIconCircle}>
          <FontAwesome5 name="bell" size={18} color="#2563EB" />
        </View>
        <View style={styles.alertTextGroup}>
          <Text style={styles.alertTitle}>{pendingCount} New Referrals</Text>
          <Text style={styles.alertSub}>Awaiting review</Text>
        </View>
        <FontAwesome5 name="chevron-right" size={14} color="#2563EB" />
      </TouchableOpacity>

      {/* ── 2x2 Quick Action Cards ── */}
      <View style={styles.actionGrid}>
        {/* Card 1: Pending Referrals */}
        <TouchableOpacity
          style={[styles.actionCard, styles.actionCardTeal]}
          activeOpacity={0.85}
          onPress={() => router.push('/(phc)/referrals')}
        >
          <View style={[styles.actionIconBadge, { backgroundColor: '#CCFBF1' }]}>
            <FontAwesome5 name="file-medical-alt" size={20} color="#0D9488" />
          </View>
          <Text style={styles.actionCardTitle}>Pending Referrals</Text>
        </TouchableOpacity>

        {/* Card 2: My Patients */}
        <TouchableOpacity
          style={[styles.actionCard, styles.actionCardBlue]}
          activeOpacity={0.85}
          onPress={() => router.push('/(phc)/queue')}
        >
          <View style={[styles.actionIconBadge, { backgroundColor: '#DBEAFE' }]}>
            <FontAwesome5 name="users" size={20} color="#2563EB" />
          </View>
          <Text style={styles.actionCardTitle}>My Patients</Text>
        </TouchableOpacity>

        {/* Card 3: Consultations */}
        <TouchableOpacity
          style={[styles.actionCard, styles.actionCardOrange]}
          activeOpacity={0.85}
          onPress={() => router.push('/(phc)/consultations')}
        >
          <View style={[styles.actionIconBadge, { backgroundColor: '#FFEDD5' }]}>
            <FontAwesome5 name="stethoscope" size={20} color="#EA580C" />
          </View>
          <Text style={styles.actionCardTitle}>Consultations</Text>
        </TouchableOpacity>

        {/* Card 4: Reports */}
        <TouchableOpacity
          style={[styles.actionCard, styles.actionCardPurple]}
          activeOpacity={0.85}
          onPress={() => router.push('/(phc)/reports' as any)}
        >
          <View style={[styles.actionIconBadge, { backgroundColor: '#F3E8FF' }]}>
            <FontAwesome5 name="chart-bar" size={20} color="#9333EA" />
          </View>
          <Text style={styles.actionCardTitle}>Reports</Text>
        </TouchableOpacity>
      </View>

      {/* ── Today's Schedule Section ── */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Today's Schedule</Text>

        <View style={styles.scheduleList}>
          {scheduleItems.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.scheduleCard}
              activeOpacity={0.8}
              onPress={() => {
                if (item.id === 's-1') router.push('/(phc)/queue');
                else if (item.id === 's-2') router.push('/(phc)/referrals');
                else router.push('/(phc)/consultations');
              }}
            >
              <View style={styles.scheduleLeft}>
                <View style={[styles.scheduleIconBadge, { backgroundColor: item.bgColor }]}>
                  <FontAwesome5 name={item.icon} size={15} color={item.color} />
                </View>
                <Text style={styles.scheduleText}>{item.countText}</Text>
              </View>
              <FontAwesome5 name="chevron-right" size={13} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingVertical: 4,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarMini: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
  },
  greetingSub: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  greetingName: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
  },
  profileBtn: {
    padding: 4,
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
  },
  alertIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertTextGroup: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    color: '#1E40AF',
  },
  alertSub: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#2563EB',
    marginTop: 2,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  actionCard: {
    width: '48%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    borderWidth: 1,
  },
  actionCardTeal: {
    backgroundColor: '#F0FDFA',
    borderColor: '#CCFBF1',
  },
  actionCardBlue: {
    backgroundColor: '#EFF6FF',
    borderColor: '#DBEAFE',
  },
  actionCardOrange: {
    backgroundColor: '#FFF7ED',
    borderColor: '#FFEDD5',
  },
  actionCardPurple: {
    backgroundColor: '#FAF5FF',
    borderColor: '#F3E8FF',
  },
  actionIconBadge: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionCardTitle: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  sectionContainer: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
    marginBottom: 12,
  },
  scheduleList: {
    gap: 10,
  },
  scheduleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  scheduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  scheduleIconBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  scheduleText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#1E293B',
  },
});
