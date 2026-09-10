import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Modal } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';

// Dummy data for UX porting
const DUMMY_FOLLOWUPS = [
  { id: '1', patientName: 'Rekha Patil', patientAge: 28, patientSex: 'Female', category: 'ANC', urgency: 'URGENT', visited: false, phone: '9876543210' },
  { id: '2', patientName: 'Sanjay Kumar', patientAge: 45, patientSex: 'Male', category: 'General', urgency: 'ROUTINE', visited: false, phone: '9876543211' },
  { id: '3', patientName: 'Baby Aarav', patientAge: 1, patientSex: 'Male', category: 'Vaccination', urgency: 'ROUTINE', visited: true, phone: '9876543212' },
];

export default function FollowupsScreen() {
  const { t } = useAuth();
  const [followups, setFollowups] = useState(DUMMY_FOLLOWUPS);
  
  type CategoryFilter = 'all' | 'Female' | 'Male' | 'Child' | 'Senior';
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');
  const [showFilterModal, setShowFilterModal] = useState(false);

  const filterItem = (f: typeof DUMMY_FOLLOWUPS[0]) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'Female') return f.patientSex === 'Female';
    if (activeFilter === 'Male') return f.patientSex === 'Male';
    if (activeFilter === 'Child') return f.patientAge <= 18 || (f.category.toLowerCase().includes('child') || f.patientName.toLowerCase().includes('baby'));
    if (activeFilter === 'Senior') return f.patientAge >= 55;
    return true;
  };

  const pending = followups.filter(f => !f.visited && filterItem(f));
  const done = followups.filter(f => f.visited && filterItem(f));

  const toggleVisited = (id: string) => {
    setFollowups(prev => prev.map(f => f.id === id ? { ...f, visited: !f.visited } : f));
  };

  const getUrgencyLabel = (urg: string) => {
    if (urg === 'EMERGENCY') return t('emergency') || 'EMERGENCY';
    if (urg === 'URGENT') return t('urgent') || 'URGENT';
    return t('routine') || 'ROUTINE';
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Category Filters */}
      {/* Dropdown Filter */}
      <TouchableOpacity 
        style={styles.dropdownButton} 
        onPress={() => setShowFilterModal(true)}
      >
        <Text style={styles.dropdownButtonText}>
          {activeFilter === 'all' ? '👥 All' :
           activeFilter === 'Female' ? '👩 ' + (t('sexFemale') || 'Female') :
           activeFilter === 'Male' ? '👨 ' + (t('sexMale') || 'Male') :
           activeFilter === 'Child' ? '👶 Child / Infant' :
           '👵 Senior'}
        </Text>
        <FontAwesome5 name="chevron-down" size={12} color="#0F766E" />
      </TouchableOpacity>

      <Modal visible={showFilterModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowFilterModal(false)}>
          <View style={styles.modalContent}>
            {[
              { key: 'all', icon: '👥', label: 'All' },
              { key: 'Female', icon: '👩', label: t('sexFemale') || 'Female' },
              { key: 'Male', icon: '👨', label: t('sexMale') || 'Male' },
              { key: 'Child', icon: '👶', label: 'Child / Infant' },
              { key: 'Senior', icon: '👵', label: 'Senior' },
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
                  onPress={() => { setActiveFilter(cat.key as any); setShowFilterModal(false); }}
                >
                  <Text style={[styles.dropdownItemText, activeFilter === cat.key && styles.dropdownItemTextActive]}>
                    {cat.icon} {cat.label}
                  </Text>
                  <View style={styles.dropdownBadge}>
                    <Text style={styles.dropdownBadgeText}>{count}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Pending Follow-ups */}
      {pending.length === 0 && done.length > 0 && (
        <View style={styles.allDoneBanner}>
          <Text style={styles.allDoneIcon}>✅</Text>
          <Text style={styles.allDoneText}>{t('allFollowupsDone') || 'All follow-ups done!'}</Text>
        </View>
      )}

      {pending.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {pending.length} {t('statusPending') || 'Pending'}
          </Text>
          
          {pending.map(item => {
            const isEmergency = item.urgency === 'EMERGENCY';
            const isUrgent = item.urgency === 'URGENT';
            
            return (
              <View 
                key={item.id} 
                style={[
                  styles.card,
                  isEmergency ? styles.cardEmergency : isUrgent ? styles.cardUrgent : null
                ]}
              >
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.patientName}>{item.patientName}</Text>
                    <Text style={styles.patientSub}>{item.patientAge} yrs • {item.category}</Text>
                  </View>
                </View>
                
                <View style={styles.urgencyBadgeWrapper}>
                  <View style={[
                    styles.urgencyBadge,
                    isEmergency ? styles.badgeEmergency : isUrgent ? styles.badgeUrgent : null
                  ]}>
                    <Text style={[
                      styles.urgencyBadgeText,
                      isEmergency ? styles.badgeTextEmergency : isUrgent ? styles.badgeTextUrgent : null
                    ]}>
                      {getUrgencyLabel(item.urgency)}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.btnOutline} onPress={() => handleCall(item.phone)}>
                    <FontAwesome5 name="phone-alt" size={14} color="#0F766E" />
                    <Text style={styles.btnOutlineText}>{t('callPatient') || 'Call'}</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity style={styles.btnPrimary} onPress={() => toggleVisited(item.id)}>
                    <FontAwesome5 name="check" size={14} color="#FFFFFF" />
                    <Text style={styles.btnPrimaryText}>{t('markVisited') || 'Done'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Completed Follow-ups */}
      {done.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t('completed') || 'Completed'} ({done.length})
          </Text>
          
          {done.map(item => (
            <View key={item.id} style={styles.doneCard}>
              <View style={styles.doneIcon}>
                <FontAwesome5 name="check" size={14} color="#FFFFFF" />
              </View>
              <View style={styles.doneInfo}>
                <Text style={styles.doneName}>{item.patientName}</Text>
                <Text style={styles.doneSub}>{item.category}</Text>
              </View>
              <TouchableOpacity onPress={() => toggleVisited(item.id)}>
                <Text style={styles.undoText}>{t('undo') || 'Undo'}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 20,
  },
  dropdownButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  dropdownItemActive: {
    backgroundColor: '#F0FDFA',
  },
  dropdownItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#475569',
  },
  dropdownItemTextActive: {
    color: '#0F766E',
    fontWeight: 'bold',
  },
  dropdownBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  dropdownBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
  },
  allDoneBanner: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
  },
  allDoneIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  allDoneText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15803D',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardEmergency: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderLeftColor: '#EF4444',
  },
  cardUrgent: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
    borderLeftColor: '#F59E0B',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  patientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  patientSub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  urgencyBadgeWrapper: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  urgencyBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#10B981',
  },
  badgeEmergency: {
    backgroundColor: '#EF4444',
  },
  badgeUrgent: {
    backgroundColor: '#F59E0B',
  },
  urgencyBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  badgeTextEmergency: {},
  badgeTextUrgent: {},
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  btnOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 10,
    marginRight: 8,
  },
  btnOutlineText: {
    color: '#0F766E',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    borderRadius: 12,
    paddingVertical: 10,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  doneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    opacity: 0.8,
  },
  doneIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#16A34A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  doneInfo: {
    flex: 1,
  },
  doneName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#475569',
    textDecorationLine: 'line-through',
  },
  doneSub: {
    fontSize: 12,
    color: '#94A3B8',
  },
  undoText: {
    color: '#0F766E',
    fontWeight: 'bold',
    fontSize: 13,
  }
});
