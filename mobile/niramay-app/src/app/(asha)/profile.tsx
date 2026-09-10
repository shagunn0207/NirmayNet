import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { TRANSLATIONS } from '../../lib/translations';
import type { Language } from '../../lib/translations';

export default function ProfileScreen() {
  const { t, language, setLanguage, signOut } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);

  // Mock user details
  const [fullName, setFullName] = useState(t('ashaWorkerName') || 'ASHA Worker');
  const [role, setRole] = useState(t('ashaWorkerRole') || 'ASHA Worker');
  const [subCentre, setSubCentre] = useState('Chinchpada');
  const [phc, setPhc] = useState('Dhadgaon PHC');
  const [mobile, setMobile] = useState('9823011234');
  const [coveredPopulation, setCoveredPopulation] = useState('1,250 citizens (240 families)');

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👩‍⚕️</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.roleText}>{role.toUpperCase()}</Text>
            <Text style={styles.nameText} numberOfLines={1}>{fullName}</Text>
            <Text style={styles.idText}>ID: ASHA_NAND_023 • ABHA Facilitator</Text>
          </View>
          
          <View style={styles.headerActions}>
            {!isEditing ? (
              <TouchableOpacity style={styles.editBtn} onPress={() => setIsEditing(true)}>
                <FontAwesome5 name="edit" size={12} color="#FFFFFF" />
                <Text style={styles.editBtnText}>{t('edit') || 'Edit'}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.editActions}>
                <TouchableOpacity style={styles.iconBtn} onPress={handleCancelEdit}>
                  <FontAwesome5 name="times" size={16} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                  <FontAwesome5 name="check" size={12} color="#0F766E" />
                  <Text style={styles.saveBtnText}>{t('save') || 'Save'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Jurisdiction & Health Facility Details */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('jurisdictionDetails') || 'Jurisdiction Details'}</Text>
          {isEditing && (
            <View style={styles.editingBadge}>
              <Text style={styles.editingBadgeText}>Editing Profile Details</Text>
            </View>
          )}
        </View>

        {!isEditing ? (
          <View>
            <View style={styles.infoRow}>
              <View style={styles.infoLabelContainer}>
                <FontAwesome5 name="map-marker-alt" size={14} color="#0F766E" />
                <Text style={styles.infoLabel}>{t('subCentreLabel') || 'Sub-Centre'}</Text>
              </View>
              <Text style={styles.infoValue}>{subCentre}</Text>
            </View>
            <View style={styles.divider} />
            
            <View style={styles.infoRow}>
              <View style={styles.infoLabelContainer}>
                <FontAwesome5 name="award" size={14} color="#D97706" />
                <Text style={styles.infoLabel}>{t('phcLabel') || 'PHC'}</Text>
              </View>
              <Text style={styles.infoValue}>{phc}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLabelContainer}>
                <FontAwesome5 name="phone-alt" size={14} color="#0F766E" />
                <Text style={styles.infoLabel}>{t('mobileLabel') || 'Mobile'}</Text>
              </View>
              <Text style={styles.infoValue}>{mobile}</Text>
            </View>
            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <View style={styles.infoLabelContainer}>
                <FontAwesome5 name="users" size={14} color="#0284C7" />
                <Text style={styles.infoLabel}>{(t('coveredPopulation') || 'Covered Population').split(':')[0]}:</Text>
              </View>
              <Text style={styles.infoValue}>{coveredPopulation}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput style={styles.input} value={fullName} onChangeText={setFullName} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Role / Designation</Text>
              <TextInput style={styles.input} value={role} onChangeText={setRole} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('subCentreLabel') || 'Sub-Centre'}</Text>
              <TextInput style={styles.input} value={subCentre} onChangeText={setSubCentre} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('phcLabel') || 'PHC'}</Text>
              <TextInput style={styles.input} value={phc} onChangeText={setPhc} />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('mobileLabel') || 'Mobile'}</Text>
              <TextInput style={styles.input} value={mobile} onChangeText={setMobile} keyboardType="phone-pad" />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{(t('coveredPopulation') || 'Covered Population').split(':')[0]}</Text>
              <TextInput style={styles.input} value={coveredPopulation} onChangeText={setCoveredPopulation} />
            </View>
            
            <View style={styles.formActions}>
              <TouchableOpacity style={styles.btnOutline} onPress={handleCancelEdit}>
                <Text style={styles.btnOutlineText}>{t('cancel') || 'Cancel'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnPrimary} onPress={handleSaveProfile}>
                <Text style={styles.btnPrimaryText}>✓ {t('save') || 'Save'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* System & Offline Status */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{t('systemAndSync') || 'System & Sync'}</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoLabelContainer}>
            <FontAwesome5 name="database" size={14} color="#0F766E" />
            <Text style={styles.infoLabel}>{t('databaseStatus') || 'Database'}:</Text>
          </View>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>{t('statusSynced') || 'Synced'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoLabelContainer}>
            <FontAwesome5 name="shield-alt" size={14} color="#4F46E5" />
            <Text style={styles.infoLabel}>App Version:</Text>
          </View>
          <Text style={styles.infoValue}>v2.4.0 (NiramayNet Field Care)</Text>
        </View>
      </View>

      {/* Language Switcher */}
      <View style={styles.card}>
        <View style={styles.languageHeader}>
          <FontAwesome5 name="globe" size={14} color="#0F766E" />
          <Text style={styles.languageTitle}>{t('selectLanguage') || 'Select Language'}</Text>
        </View>
        
        <View style={styles.languageGrid}>
          {[
            { key: 'mr', label: 'मराठी' },
            { key: 'hi', label: 'हिंदी' },
            { key: 'en', label: 'English' },
            { key: 'kn', label: 'ಕನ್ನಡ' },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.langBtn, language === item.key && styles.langBtnActive]}
              onPress={() => setLanguage(item.key as Language)}
            >
              <Text style={[styles.langBtnText, language === item.key && styles.langBtnTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={signOut}>
        <FontAwesome5 name="sign-out-alt" size={16} color="#DC2626" />
        <Text style={styles.logoutBtnText}>{t('logoutBtn') || 'Logout'}</Text>
      </TouchableOpacity>
      
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#0F766E', // Use gradient in actual implementation if possible
    borderRadius: 22,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#0F766E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    marginRight: 16,
  },
  avatarText: {
    fontSize: 30,
  },
  headerInfo: {
    flex: 1,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#CCFBF1',
    letterSpacing: 0.8,
  },
  nameText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  idText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    marginTop: 2,
  },
  headerActions: {
    marginLeft: 10,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  editBtnText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
  editActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 8,
    borderRadius: 10,
    marginRight: 6,
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  saveBtnText: {
    color: '#0F766E',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
  },
  editingBadge: {
    backgroundColor: '#F0FDFA',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  editingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F766E',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  infoLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
    marginLeft: 8,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  statusBadge: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#16A34A',
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  languageTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginLeft: 8,
  },
  languageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  langBtn: {
    width: '23%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
  },
  langBtnActive: {
    backgroundColor: '#0F766E',
    borderColor: '#0F766E',
  },
  langBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  langBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  logoutBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DC2626',
    marginLeft: 10,
  },
  formContainer: {
    marginTop: 10,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: '#0F172A',
  },
  formActions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  btnOutline: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 12,
    marginRight: 8,
  },
  btnOutlineText: {
    color: '#475569',
    fontWeight: 'bold',
  },
  btnPrimary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 10,
    paddingVertical: 12,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
