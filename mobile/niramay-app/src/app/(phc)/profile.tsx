import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function PhcProfileScreen() {
  const { user, signOut, t, language, setLanguage } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/(auth)/login');
    } catch {
      router.replace('/(auth)/login');
    }
  };

  const doctorName = user?.name ? user.name.replace('District Hospital Nandurbar', 'Dr. Priya Sharma') : 'Dr. Priya Sharma';
  const employeeId = user?.username || 'PHC_001';
  const facility = user?.facility_name || 'Nandgaon PHC';
  const phone = user?.phone || '9876543210';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={16} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('phc.profile') || 'Profile'}</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Avatar & Title */}
      <View style={styles.avatarCard}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>D</Text>
        </View>
        <Text style={styles.roleTitle}>{doctorName}</Text>
        <Text style={styles.roleSub}>{t('doctorPHC') || 'PHC Doctor'}</Text>
      </View>

      {/* Info List */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('Employee ID') || 'Employee ID'}</Text>
          <Text style={styles.infoValue}>{employeeId}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('Facility') || 'Facility'}</Text>
          <Text style={styles.infoValue}>{facility}</Text>
        </View>
        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('Phone') || 'Phone'}</Text>
          <Text style={styles.infoValue}>{phone}</Text>
        </View>
      </View>

      {/* Action Menu */}
      <View style={styles.menuCard}>
        {/* Language Selector */}
        <View style={styles.menuItem}>
          <View style={styles.menuLeft}>
            <FontAwesome5 name="language" size={16} color="#64748B" style={{ marginRight: 14 }} />
            <Text style={styles.menuText}>{t('selectLanguage') || 'Select Language'}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 14 }}>
          {['english', 'marathi', 'hindi', 'kannada'].map(l => (
             <TouchableOpacity key={l} onPress={() => setLanguage(l as any)} style={[styles.langBtn, language === l && styles.langBtnActive]}>
               <Text style={[styles.langBtnText, language === l && styles.langBtnTextActive]}>
                 {l === 'english' ? 'English' : l === 'marathi' ? 'मराठी' : l === 'hindi' ? 'हिंदी' : 'ಕನ್ನಡ'}
               </Text>
             </TouchableOpacity>
          ))}
        </View>
        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Settings', 'PHC Clinical Portal v2.1.0')}
        >
          <View style={styles.menuLeft}>
            <FontAwesome5 name="cog" size={16} color="#64748B" style={{ marginRight: 14 }} />
            <Text style={styles.menuText}>{t('Settings') || 'Settings'}</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={14} color="#94A3B8" />
        </TouchableOpacity>
        <View style={styles.divider} />

        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => Alert.alert('Help & Support', 'District Medical Officer Helpline: 02564-210100')}
        >
          <View style={styles.menuLeft}>
            <FontAwesome5 name="question-circle" size={16} color="#64748B" style={{ marginRight: 14 }} />
            <Text style={styles.menuText}>{t('Help & Support') || 'Help & Support'}</Text>
          </View>
          <FontAwesome5 name="chevron-right" size={14} color="#94A3B8" />
        </TouchableOpacity>
        <View style={styles.divider} />

        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={styles.menuLeft}>
            <FontAwesome5 name="sign-out-alt" size={16} color="#DC2626" style={{ marginRight: 14 }} />
            <Text style={[styles.menuText, { color: '#DC2626', fontFamily: 'Inter_700Bold' }]}>{t('logoutBtn') || 'Logout'}</Text>
          </View>
        </TouchableOpacity>
      </View>
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
  avatarCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 32,
    fontFamily: 'Inter_800ExtraBold',
    color: '#FFFFFF',
  },
  roleTitle: {
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
  },
  roleSub: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    color: '#334155',
  },
  langBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
  },
  langBtnActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  langBtnText: {
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    color: '#475569',
  },
  langBtnTextActive: {
    color: '#FFFFFF',
  },
});
