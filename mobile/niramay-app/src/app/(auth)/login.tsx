import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal, FlatList, Platform, KeyboardAvoidingView, ScrollView } from 'react-native';
import { supabase } from '../../lib/supabase';
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
  const [email, setEmail] = useState('asha@gmail.com');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [step, setStep] = useState<'role' | 'login'>('role');
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  
  const { language, setLanguage, setRoleOverride, bypassLogin, t } = useAuth();

  const handleAuth = async () => {
    if (!selectedRole) {
      Alert.alert('Error', 'Please select a role first.');
      return;
    }
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password.');
      return;
    }

    // Developer bypass for dummy account
    if (email === 'dev@niramay.net' || email === 'asha@gmail.com') {
      bypassLogin(selectedRole);
      return;
    }

    if (!isLoginMode) {
      if (!name || !phone) {
        Alert.alert('Error', 'Please enter your Name and Phone Number.');
        return;
      }
      if (phone.length < 10) {
        Alert.alert('Error', 'Please enter a valid 10-digit phone number.');
        return;
      }
    }

    setLoading(true);
    let authData;
    let authError;

    if (isLoginMode) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      authData = data;
      authError = error;
    } else {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: name,
            phone: phone,
          }
        }
      });
      authData = data;
      authError = error;
    }

    if (authError) {
      setLoading(false);
      Alert.alert('Error', authError.message);
      return;
    }

    if (authData.user && selectedRole) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', authData.user.id)
        .single();

      if (!profile) {
        // Create profile
        const { error: insertError } = await supabase.from('profiles').insert({
          id: authData.user.id,
          role: selectedRole,
          email: email.trim(),
          language: language,
          name: authData.user.user_metadata?.full_name || name || '',
          phone: authData.user.user_metadata?.phone || phone || '',
        });
        if (insertError) {
          console.error(insertError);
        }
      }
      // Force role update to trigger routing in _layout
      setRoleOverride(profile ? profile.role : selectedRole);
    }
    setLoading(false);
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

      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.content} bounces={false}>
          {step === 'role' ? (
          <>
            <Text style={styles.sectionTitle}>Select Your Role</Text>
            
            {Platform.OS !== 'web' && (
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
            )}

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
            <TouchableOpacity style={styles.backButton} onPress={() => { 
              setStep('role'); 
              setEmail(''); 
              setPassword(''); 
              setName('');
              setPhone('');
            }}>
              <FontAwesome5 name="arrow-left" size={16} color="#00796B" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>
              {selectedRole === 'asha' ? 'ASHA Worker' : 'PHC Doctor'} {isLoginMode ? 'Login' : 'Sign Up'}
            </Text>

            <View style={styles.toggleContainer}>
              <TouchableOpacity 
                style={[styles.toggleBtn, isLoginMode && styles.toggleBtnActive]} 
                onPress={() => {
                  setIsLoginMode(true);
                  if (email === '') setEmail('asha@gmail.com');
                  if (password === '') setPassword('123456');
                }}
              >
                <Text style={[styles.toggleBtnText, isLoginMode && styles.toggleBtnTextActive]}>Log In</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.toggleBtn, !isLoginMode && styles.toggleBtnActive]} 
                onPress={() => {
                  setIsLoginMode(false);
                  if (email === 'asha@gmail.com') setEmail('');
                  if (password === '123456') setPassword('');
                }}
              >
                <Text style={[styles.toggleBtnText, !isLoginMode && styles.toggleBtnTextActive]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

        {!isLoginMode && (
          <>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.textInputRow}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  placeholder="Enter your full name"
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <View style={styles.textInputRow}>
                <Text style={styles.prefix}>+91 </Text>
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="number-pad"
                  maxLength={10}
                  placeholder="10-digit number"
                />
              </View>
            </View>
          </>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email ID</Text>
          <View style={styles.textInputRow}>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email ID"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.textInputRow}>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Enter password"
            />
          </View>
        </View>

        <TouchableOpacity 
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>
              {isLoginMode ? 'Log In' : 'Sign Up'}
            </Text>
          )}
        </TouchableOpacity>
        </>
        )}
        </ScrollView>
      </KeyboardAvoidingView>
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
    fontFamily: 'OpenSans_400Regular',
    fontFamily: 'Inter_700Bold',
    color: '#00796B',
  },
  tagline: {
    fontSize: 12,
    fontFamily: 'OpenSans_400Regular',
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
    fontFamily: 'Inter_600SemiBold',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'OpenSans_400Regular',
    fontFamily: 'Inter_600SemiBold',
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
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    fontFamily: 'OpenSans_400Regular',
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
    fontFamily: 'OpenSans_400Regular',
    fontFamily: 'Inter_600SemiBold',
    color: '#333',
  },
  roleTitleSelected: {
    color: '#00796B',
  },
  roleDesc: {
    fontSize: 12,
    fontFamily: 'OpenSans_400Regular',
    color: '#666',
    marginTop: 4,
  },
  inputContainer: {
    marginTop: 24,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontFamily: 'OpenSans_400Regular',
    color: '#333',
    marginBottom: 8,
    fontFamily: 'Inter_500Medium',
  },
  textInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    padding: 4,
    marginBottom: 8,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  toggleBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  toggleBtnText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#64748B',
  },
  toggleBtnTextActive: {
    color: '#0F766E',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'OpenSans_400Regular',
    height: '100%',
  },
  prefix: {
    fontSize: 16,
    fontFamily: 'OpenSans_400Regular',
    color: '#333',
    fontFamily: 'Inter_600SemiBold',
    marginRight: 4,
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
    fontFamily: 'OpenSans_400Regular',
    fontFamily: 'Inter_600SemiBold',
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
