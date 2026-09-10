import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../store/AuthContext';

export default function PhcHomeScreen() {
  const router = useRouter();
  const { user, t } = useAuth();
  
  // Dummy data for now
  const stats = {
    incoming: 2,
    pending: 4,
    confirmed: 7,
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header Section */}
        <View style={styles.headerCard}>
          <Text style={styles.greeting}>{t('phc.welcome')}</Text>
          <Text style={styles.facility}>Dhadgaon PHC</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statRow}>
            <View style={[styles.indicator, { backgroundColor: '#F44336' }]} />
            <Text style={styles.statText}>{t('phc.stats.incoming')}: </Text>
            <Text style={styles.statNumber}>2</Text>
          </View>
          <View style={styles.statRow}>
            <View style={[styles.indicator, { backgroundColor: '#FFC107' }]} />
            <Text style={styles.statText}>{t('phc.stats.pending')}: </Text>
            <Text style={styles.statNumber}>4</Text>
          </View>
          <View style={styles.statRow}>
            <View style={[styles.indicator, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.statText}>{t('phc.stats.confirmed')}: </Text>
            <Text style={styles.statNumber}>7</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>{t('phc.quickActions')}</Text>
        
        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(phc)/consultations')}>
          <View style={[styles.iconContainer, { backgroundColor: '#E0F2F1' }]}>
            <FontAwesome5 name="stethoscope" size={20} color="#00796B" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>{t('phc.action.incomingConsults')}</Text>
            <Text style={styles.actionSubtitle}>2 requests waiting</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(phc)/queue')}>
          <View style={[styles.iconContainer, { backgroundColor: '#FFF8E1' }]}>
            <FontAwesome5 name="users" size={20} color="#FFA000" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>{t('phc.action.opdQueue')}</Text>
            <Text style={styles.actionSubtitle}>Manage walk-ins & referrals</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(phc)/referrals')}>
          <View style={[styles.iconContainer, { backgroundColor: '#E8EAF6' }]}>
            <FontAwesome5 name="ambulance" size={20} color="#3F51B5" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>{t('phc.action.referralTracker')}</Text>
            <Text style={styles.actionSubtitle}>4 in transit to District</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => {}}>
          <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
            <FontAwesome5 name="file-medical-alt" size={20} color="#8E24AA" />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Patient Records</Text>
            <Text style={styles.actionSubtitle}>Search past visits & ABHA</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={16} color="#ccc" />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  scrollContent: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#00796B',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  greeting: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  facility: {
    color: '#E0F2F1',
    fontSize: 14,
    marginTop: 4,
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00796B',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
});
