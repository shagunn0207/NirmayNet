import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal, FlatList, Platform } from 'react-native';
import { loginWithBackend } from '../../lib/apiClient';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

const LANGUAGES = [
  { code: 'english', label: 'English' },
  { code: 'marathi', label: 'मराठी' },
  { code: 'hindi', label: 'हिंदी' },
  { code: 'kannada', label: 'ಕನ್ನಡ' }
];

type Role = 'asha' | 'phc_doctor' | 'district';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'role' | 'login'>('role');
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  
  const { language, setLanguage, setRoleOverride, bypassLogin, setBackendAuth, t } = useAuth();

  const handleSendOtp = async () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select a role first.');
      return;
    }
    if (phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit phone number.');
      return;
    }

    // Developer bypass
    if (phone === '0000000000') {
      bypassLogin(selectedRole);
      return;
    }

    setIsOtpSent(true);
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter password / OTP.');
      return;
    }

    setLoading(true);
    try {
      const data = await loginWithBackend(phone, otp);
      if (data && data.access_token) {
        await setBackendAuth(data.access_token, data.user);
      }
    } catch (err: any) {
      Alert.alert('Login Failed', err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const currentLangLabel = LANGUAGES.find(l => l.code === language)?.label || 'English';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.logo}>NiramayNet</Text>
          <Text style={styles.tagline}>From Village to Hospital — Unbroken</Text>
        </View>
        <TouchableOpacity style={styles.langButton} onPress={() => setShowLangPicker(true)}>
          <Text style={styles.langText}>{currentLangLabel}</Text>
          <FontAwesome5 name="chevron-down" size={12} color="#00796B" style={{ marginLeft: 5 }} />
        </TouchableOpacity>
      </View>

      {showLangPicker && (
        <View style={[StyleSheet.absoluteFill, styles.modalBg]}>
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
      )}

      <View style={styles.content}>
        {step === 'role' ? (
          <>
            <Text style={styles.sectionTitle}>Select Your Role</Text>
            
            <TouchableOpacity
              style={[styles.roleCard, selectedRole === 'asha' && styles.roleCardSelected]}
              onPress={() => setSelectedRole('asha')}
            >
              <FontAwesome5 name="user-nurse" size={24} color={selectedRole === 'asha' ? '#00796B' : '#666'} />
              <View style={styles.roleTextContainer}>
                <Text style={[styles.roleTitle, selectedRole === 'asha' && styles.roleTitleSelected]}>ASHA Worker</Text>
                <Text style={styles.roleDesc}>Field visits and patient care.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.roleCard, selectedRole === 'phc_doctor' && styles.roleCardSelected]}
              onPress={() => setSelectedRole('phc_doctor')}
            >
              <FontAwesome5 name="stethoscope" size={24} color={selectedRole === 'phc_doctor' ? '#00796B' : '#666'} />
              <View style={styles.roleTextContainer}>
                <Text style={[styles.roleTitle, selectedRole === 'phc_doctor' && styles.roleTitleSelected]}>PHC Doctor / CHO</Text>
                <Text style={styles.roleDesc}>Consultations and referral decisions.</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.primaryButton, (!selectedRole) && styles.buttonDisabled, { marginTop: 24 }]}
              onPress={() => setStep('login')}
              disabled={!selectedRole}
            >
              <Text style={styles.primaryButtonText}>Continue</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity style={styles.backButton} onPress={() => { setStep('role'); setIsOtpSent(false); setOtp(''); setPhone(''); }}>
              <FontAwesome5 name="arrow-left" size={16} color="#00796B" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>
              {selectedRole === 'asha' ? 'ASHA Worker' : 'PHC Doctor'} Login / Sign Up
            </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <View style={styles.phoneInputRow}>
            <Text style={styles.prefix}>+91</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              keyboardType="number-pad"
              maxLength={10}
              placeholder="10-digit number"
              editable={!isOtpSent}
            />
          </View>
        </View>

        {isOtpSent && (
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Enter OTP</Text>
            <TextInput
              style={styles.otpInput}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              maxLength={6}
              placeholder="000000"
            />
          </View>
        )}

        <TouchableOpacity 
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={isOtpSent ? handleVerifyOtp : handleSendOtp}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {isOtpSent ? 'Verify OTP' : 'Send OTP'}
            </Text>
          )}
        </TouchableOpacity>
        </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#eee',
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00796B',
  },
  tagline: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  langText: {
    color: '#00796B',
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButtonText: {
    marginLeft: 8,
    color: '#00796B',
    fontWeight: '600',
    fontSize: 16,
  },
  roleCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#eee',
    marginBottom: 12,
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  roleCardSelected: {
    borderColor: '#00796B',
    backgroundColor: '#E0F2F1',
  },
  roleTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  roleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  roleTitleSelected: {
    color: '#00796B',
  },
  roleDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  inputContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  prefix: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 18,
    letterSpacing: 4,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: '#00796B',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalBg: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
    fontWeight: '600',
  }
});
