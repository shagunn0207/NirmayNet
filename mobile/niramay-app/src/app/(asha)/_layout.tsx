import { Tabs, useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../store/AuthContext';
import { TouchableOpacity, View, Modal, Text, StyleSheet } from 'react-native';
import { useState } from 'react';

const LANGUAGES = [
  { code: 'english', label: 'English' },
  { code: 'marathi', label: 'मराठी' },
  { code: 'hindi', label: 'हिंदी' },
  { code: 'kannada', label: 'ಕನ್ನಡ' }
];

export default function AshaLayout() {
  const router = useRouter();
  const { t, signOut, language, setLanguage } = useAuth();
  const [showLangPicker, setShowLangPicker] = useState(false);

  const LanguageSwitcher = () => (
    <>
      <TouchableOpacity onPress={() => setShowLangPicker(true)} style={{ marginRight: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
        <FontAwesome5 name="language" size={16} color="#fff" />
        <Text style={{ color: '#fff', marginLeft: 6, fontWeight: 'bold', fontSize: 12, fontFamily: 'Inter_600SemiBold' }}>
          {LANGUAGES.find(l => l.code === language)?.label}
        </Text>
      </TouchableOpacity>
      
      {showLangPicker && (
        <Modal transparent visible={showLangPicker} animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{t('selectLanguage') || 'Select Language'}</Text>
              {LANGUAGES.map(lang => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.langOption}
                  onPress={() => {
                    setLanguage(lang.code as any);
                    setShowLangPicker(false);
                  }}
                >
                  <Text style={[styles.langOptionText, language === lang.code && { color: '#0F766E', fontWeight: 'bold' }]}>{lang.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.closeModal} onPress={() => setShowLangPicker(false)}>
                <Text style={styles.closeModalText}>{t('cancel') || 'Cancel'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </>
  );

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerRight: () => <LanguageSwitcher />,
        headerStyle: {
          backgroundColor: '#0F766E',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        tabBarActiveTintColor: '#00796B',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('home') || 'Home',
          tabBarIcon: ({ color }) => <FontAwesome5 name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="patients"
        options={{
          title: t('patientsTitle') || 'Patients',
          tabBarIcon: ({ color }) => <FontAwesome5 name="users" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="followup"
        options={{
          title: t('followupTitle') || 'Follow Ups',
          tabBarIcon: ({ color }) => <FontAwesome5 name="calendar-check" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="guide"
        options={{
          title: t('guideTitle') || 'Guide',
          tabBarIcon: ({ color }) => <FontAwesome5 name="book-medical" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile') || 'Profile',
          tabBarIcon: ({ color }) => <FontAwesome5 name="user-nurse" size={24} color={color} />,
        }}
      />
      {/* Hidden Stack Screens */}
      <Tabs.Screen
        name="triage"
        options={{
          href: null,
          title: t('triageTitle') || 'Triage',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16, padding: 4 }}>
              <FontAwesome5 name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="register"
        options={{
          href: null,
          title: t('regTitle') || 'Register',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16, padding: 4 }}>
              <FontAwesome5 name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="consultation"
        options={{
          href: null,
          title: t('consultTitle') || 'Consultation',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16, padding: 4 }}>
              <FontAwesome5 name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="referral"
        options={{
          href: null,
          title: t('referralTitle') || 'Referral',
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={{ marginLeft: 16, padding: 4 }}>
              <FontAwesome5 name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: '#fff',
    width: 300,
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  langOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  langOptionText: {
    fontSize: 16,
    fontFamily: 'OpenSans_400Regular',
    textAlign: 'center',
  },
  closeModal: {
    marginTop: 16,
    paddingVertical: 12,
  },
  closeModalText: {
    color: '#d32f2f',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  }
});
