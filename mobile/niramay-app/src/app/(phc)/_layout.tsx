import { Slot, useRouter, usePathname } from 'expo-router';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../store/AuthContext';
import { useState } from 'react';

const LANGUAGES = [
  { code: 'english', label: 'English' },
  { code: 'marathi', label: 'मराठी' },
  { code: 'hindi', label: 'हिंदी' },
  { code: 'kannada', label: 'ಕನ್ನಡ' }
];

export default function PhcLayout() {
  const { t, signOut, language, setLanguage } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [showLangPicker, setShowLangPicker] = useState(false);
  
  const isMobile = Dimensions.get('window').width < 768;

  const NavItem = ({ name, icon, path }: { name: string, icon: string, path: string }) => {
    // pathname might be /home or /(phc)/home
    const isActive = pathname === path || pathname === `/(phc)${path}`;
    return (
      <TouchableOpacity 
        style={[styles.navItem, isActive && styles.navItemActive]}
        onPress={() => router.replace(`/(phc)${path}` as any)}
      >
        <FontAwesome5 name={icon} size={20} color={isActive ? '#fff' : '#B2DFDB'} />
        {!isMobile && <Text style={[styles.navText, isActive && styles.navTextActive]}>{t(name)}</Text>}
      </TouchableOpacity>
    );
  };

  const currentLangLabel = LANGUAGES.find(l => l.code === language)?.label || 'English';

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      <View style={[styles.sidebar, isMobile && styles.sidebarMobile]}>
        <View style={styles.logoContainer}>
          <FontAwesome5 name="plus-square" size={28} color="#fff" />
          {!isMobile && <Text style={styles.logoText}>NiramayNet</Text>}
        </View>

        <View style={styles.navMenu}>
          <NavItem name="phc.home" icon="home" path="/home" />
          <NavItem name="phc.consultations" icon="stethoscope" path="/consultations" />
          <NavItem name="phc.queue" icon="users" path="/queue" />
          <NavItem name="phc.referrals" icon="ambulance" path="/referrals" />
          <NavItem name="phc.profile" icon="user-md" path="/profile" />
        </View>

        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.langButton} onPress={() => setShowLangPicker(true)}>
            <FontAwesome5 name="language" size={20} color="#B2DFDB" />
            {!isMobile && <Text style={styles.langText}>{currentLangLabel}</Text>}
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
            <FontAwesome5 name="sign-out-alt" size={20} color="#ff5252" />
            {!isMobile && <Text style={styles.logoutText}>Logout</Text>}
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content area */}
      <View style={styles.mainContent}>
        <Slot />
      </View>

      {/* Language Picker Modal */}
      {showLangPicker && (
        <Modal transparent visible={showLangPicker} animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Select Language</Text>
              {LANGUAGES.map(lang => (
                <TouchableOpacity
                  key={lang.code}
                  style={styles.langOption}
                  onPress={() => {
                    setLanguage(lang.code);
                    setShowLangPicker(false);
                  }}
                >
                  <Text style={styles.langOptionText}>{lang.label}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.closeModal} onPress={() => setShowLangPicker(false)}>
                <Text style={styles.closeModalText}>Cancel</Text>
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
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
  },
  sidebar: {
    width: 250,
    backgroundColor: '#00796B',
    paddingVertical: 20,
    justifyContent: 'space-between',
  },
  sidebarMobile: {
    width: 70,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'OpenSans_400Regular',
    fontFamily: 'Inter_700Bold',
    marginLeft: 12,
  },
  navMenu: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  navItemActive: {
    backgroundColor: '#004D40',
    borderRightWidth: 4,
    borderColor: '#4DB6AC',
  },
  navText: {
    color: '#B2DFDB',
    fontSize: 16,
    fontFamily: 'OpenSans_400Regular',
    marginLeft: 16,
    fontFamily: 'Inter_500Medium',
  },
  navTextActive: {
    color: '#fff',
    fontFamily: 'Inter_700Bold',
  },
  bottomActions: {
    paddingHorizontal: 20,
    gap: 24,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  langText: {
    color: '#B2DFDB',
    fontSize: 16,
    fontFamily: 'OpenSans_400Regular',
    marginLeft: 16,
    fontFamily: 'Inter_500Medium',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: '#ff5252',
    fontSize: 16,
    fontFamily: 'OpenSans_400Regular',
    marginLeft: 16,
    fontFamily: 'Inter_500Medium',
  },
  mainContent: {
    flex: 1,
    overflow: 'hidden',
  },
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
    fontFamily: 'OpenSans_400Regular',
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
    fontFamily: 'OpenSans_400Regular',
    fontFamily: 'Inter_600SemiBold',
  }
});
