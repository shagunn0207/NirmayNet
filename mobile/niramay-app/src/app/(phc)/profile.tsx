import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../store/AuthContext';

const LANGUAGES = [
  { code: 'english', label: 'English' },
  { code: 'marathi', label: 'मराठी' },
  { code: 'hindi', label: 'हिंदी' },
  { code: 'kannada', label: 'ಕನ್ನಡ' }
];

export default function PhcProfileScreen() {
  const { signOut, user, language, setLanguage, role, t } = useAuth();
  const [showLangPicker, setShowLangPicker] = useState(false);
  
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Dr. Mehta',
    facility: 'Dhadgaon PHC',
    phone: user?.phone || '+91 9876543210'
  });
  
  const [draft, setDraft] = useState(profileData);

  const currentLangLabel = LANGUAGES.find(l => l.code === language)?.label || 'English';

  const roleLabels: Record<string, string> = {
    asha: 'ASHA Worker',
    phc_doctor: 'PHC Doctor / CHO',
    district: 'District Hospital Staff'
  };

  const handleSave = () => {
    setProfileData(draft);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(profileData);
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <FontAwesome5 name="user-md" size={40} color="#00796B" />
        </View>
        <Text style={styles.name}>{profileData.name}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{role ? roleLabels[role] : 'Unknown Role'}</Text>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>{t('phc.profile')}</Text>
          {!isEditing ? (
            <TouchableOpacity onPress={() => setIsEditing(true)}>
              <Text style={styles.editBtn}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={handleCancel} style={{ marginRight: 16 }}>
                <Text style={styles.cancelBtn}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave}>
                <Text style={styles.saveBtn}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <FontAwesome5 name="user" size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Name</Text>
            {isEditing ? (
              <TextInput 
                style={styles.input} 
                value={draft.name} 
                onChangeText={(val) => setDraft({...draft, name: val})} 
              />
            ) : (
              <Text style={styles.infoValue}>{profileData.name}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <FontAwesome5 name="phone" size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Phone</Text>
            {isEditing ? (
              <TextInput 
                style={styles.input} 
                value={draft.phone} 
                keyboardType="phone-pad"
                onChangeText={(val) => setDraft({...draft, phone: val})} 
              />
            ) : (
              <Text style={styles.infoValue}>{profileData.phone}</Text>
            )}
          </View>
          
          <View style={styles.infoRow}>
            <FontAwesome5 name="hospital-alt" size={16} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoLabel}>Facility</Text>
            {isEditing ? (
              <TextInput 
                style={styles.input} 
                value={draft.facility} 
                onChangeText={(val) => setDraft({...draft, facility: val})} 
              />
            ) : (
              <Text style={styles.infoValue}>{profileData.facility}</Text>
            )}
          </View>
        </View>
      </View>

      <View style={styles.settingsSection}>
        <Text style={styles.sectionTitle}>App Settings</Text>
        
        <TouchableOpacity style={styles.settingRow} onPress={() => setShowLangPicker(!showLangPicker)}>
          <View style={styles.settingLeft}>
            <FontAwesome5 name="language" size={18} color="#00796B" style={styles.settingIcon} />
            <Text style={styles.settingText}>App Language</Text>
          </View>
          <View style={styles.settingRight}>
            <Text style={styles.currentLang}>{currentLangLabel}</Text>
            <FontAwesome5 name={showLangPicker ? "chevron-down" : "chevron-right"} size={14} color="#ccc" />
          </View>
        </TouchableOpacity>

        {showLangPicker && (
          <View style={styles.langPickerContainer}>
            {LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang.code}
                style={[styles.langOption, language === lang.code && styles.langOptionActive]}
                onPress={() => {
                  setLanguage(lang.code);
                  setShowLangPicker(false);
                }}
              >
                <Text style={[styles.langOptionText, language === lang.code && { color: '#00796B', fontWeight: 'bold' }]}>
                  {lang.label}
                </Text>
                {language === lang.code && <FontAwesome5 name="check" size={14} color="#00796B" />}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
        <FontAwesome5 name="sign-out-alt" size={16} color="#F44336" style={{ marginRight: 8 }} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  profileHeader: { backgroundColor: '#fff', alignItems: 'center', padding: 32, borderBottomWidth: 1, borderColor: '#eee' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#E0F2F1', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  roleBadge: { backgroundColor: '#00796B', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 16 },
  roleText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  settingsSection: { marginTop: 24, paddingHorizontal: 16 },
  sectionHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, paddingHorizontal: 8 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#666', textTransform: 'uppercase' },
  editBtn: { color: '#00796B', fontWeight: '600' },
  cancelBtn: { color: '#666', fontWeight: '600' },
  saveBtn: { color: '#00796B', fontWeight: 'bold' },
  infoSection: { backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 16, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2 },
  infoRow: { flexDirection: 'row', paddingVertical: 16, alignItems: 'center', borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
  infoIcon: { width: 24 },
  infoLabel: { fontSize: 16, color: '#666', width: 80 },
  infoValue: { fontSize: 16, fontWeight: '500', color: '#333', flex: 1, textAlign: 'right' },
  input: { flex: 1, textAlign: 'right', fontSize: 16, fontWeight: '500', color: '#333', borderBottomWidth: 1, borderColor: '#00796B', padding: 0 },
  settingRow: { backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 12, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2 },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingIcon: { marginRight: 12 },
  settingText: { fontSize: 16, color: '#333' },
  settingRight: { flexDirection: 'row', alignItems: 'center' },
  currentLang: { fontSize: 14, color: '#666', marginRight: 8 },
  langPickerContainer: { backgroundColor: '#fff', marginTop: 8, borderRadius: 12, padding: 8, elevation: 2 },
  langOption: { flexDirection: 'row', justifyContent: 'space-between', padding: 12, borderRadius: 8 },
  langOptionActive: { backgroundColor: '#E0F2F1' },
  langOptionText: { fontSize: 16, color: '#333' },
  signOutButton: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 16, marginTop: 32, padding: 16, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F44336' },
  signOutText: { color: '#F44336', fontSize: 16, fontWeight: 'bold' }
});
