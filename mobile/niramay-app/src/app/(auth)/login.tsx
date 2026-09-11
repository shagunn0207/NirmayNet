import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, Alert, ScrollView, Platform
} from 'react-native';
import { loginWithBackend, registerWithBackend } from '../../lib/apiClient';
import { useAuth } from '../../store/AuthContext';
import { useRouter } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { NirmayLogo } from '../../components/NirmayLogo';

type Role = 'asha' | 'phc_doctor';
type ScreenMode = 'splash' | 'role' | 'login' | 'signup' | 'loading';

export default function LoginScreen() {
  const [mode, setMode] = useState<ScreenMode>('splash');
  const [selectedRole, setSelectedRole] = useState<Role>('asha');
  const [loadingText, setLoadingText] = useState('Logging you in...');

  // Login fields
  const [username, setUsername] = useState('ASHA_NAND_023');
  const [password, setPassword] = useState('asha2024');
  const [showPassword, setShowPassword] = useState(false);

  // Sign-up fields
  const [suFullName, setSuFullName] = useState('');
  const [suAge, setSuAge] = useState('');
  const [suSex, setSuSex] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [suUsername, setSuUsername] = useState('');
  const [suVillage, setSuVillage] = useState('');
  const [suPhone, setSuPhone] = useState('');
  const [suPassword, setSuPassword] = useState('');
  const [suShowPassword, setSuShowPassword] = useState(false);

  const { setRoleOverride, setBackendAuth } = useAuth();
  const router = useRouter();

  // Splash timeout: auto advance to role selector after 1.5s
  useEffect(() => {
    if (mode === 'splash') {
      const timer = setTimeout(() => {
        setMode('role');
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  const selectRoleAndProceed = (role: Role) => {
    setSelectedRole(role);
    if (role === 'asha') {
      setUsername('ASHA_NAND_023');
      setPassword('asha2024');
    } else {
      setUsername('HOSPITAL_NAND_001');
      setPassword('hospital2024');
    }
    setMode('login');
  };

  // ── Handle Login ───────────────────────────────────────────────────────────
  const handleLogin = async () => {
    if (!username.trim() || !password) {
      Alert.alert('Error', 'Please enter your Worker ID and password.');
      return;
    }

    setMode('loading');
    setLoadingText('Logging you in...');

    try {
      const data = await loginWithBackend(username.trim(), password);
      if (data && data.access_token) {
        await setBackendAuth(data.access_token, data.user);
        const mappedRole = data.user.role?.toUpperCase();

        try { setRoleOverride(selectedRole); } catch (_) { /* noop */ }

        if (selectedRole === 'asha' || mappedRole === 'ASHA') {
          router.replace('/(asha)/home');
        } else {
          router.replace('/(phc)/home');
        }
      }
    } catch (err: any) {
      setMode('login');
      Alert.alert('Login Failed', err.message || 'Invalid credentials. Please check your Worker ID and password.');
    }
  };

  // ── Handle Sign Up ─────────────────────────────────────────────────────────
  const handleSignUp = async () => {
    if (!suUsername.trim() || !suPassword) {
      Alert.alert('Error', 'Worker ID and password are required.');
      return;
    }

    setMode('loading');
    setLoadingText('Creating your account...');

    try {
      const backendRole = selectedRole === 'phc_doctor' ? 'HOSPITAL' : 'ASHA';
      await registerWithBackend({
        username: suUsername.trim(),
        password: suPassword,
        fullName: suFullName.trim() || undefined,
        phone: suPhone.trim() || undefined,
        village: suVillage.trim() || undefined,
        role: backendRole,
      });

      setLoadingText('Logging you in...');
      // Auto-login
      const data = await loginWithBackend(suUsername.trim(), suPassword);
      if (data && data.access_token) {
        await setBackendAuth(data.access_token, data.user);
        try { setRoleOverride(selectedRole); } catch (_) { /* noop */ }

        if (selectedRole === 'asha') {
          router.replace('/(asha)/home');
        } else {
          router.replace('/(phc)/home');
        }
      }
    } catch (err: any) {
      setMode('signup');
      Alert.alert('Registration Failed', err.message || 'Could not complete registration.');
    }
  };

  // ───────────────────────────────────────────────────────────────────────────
  // 1. SPLASH SCREEN
  // ───────────────────────────────────────────────────────────────────────────
  if (mode === 'splash') {
    return (
      <TouchableOpacity
        style={styles.splashContainer}
        activeOpacity={0.9}
        onPress={() => setMode('role')}
      >
        <View style={styles.splashContent}>
          <NirmayLogo size="large" showSubtitle={true} />
        </View>
        <View style={styles.splashFooter}>
          <Text style={styles.splashFooterText}>Tap anywhere to continue</Text>
        </View>
      </TouchableOpacity>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 5. LOADING SCREEN
  // ───────────────────────────────────────────────────────────────────────────
  if (mode === 'loading') {
    return (
      <View style={styles.loadingContainer}>
        <NirmayLogo size="medium" showSubtitle={false} />
        <Text style={styles.loadingText}>{loadingText}</Text>
        <ActivityIndicator size="large" color="#0D9488" style={{ marginTop: 24 }} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      {/* ───────────────────────────────────────────────────────────────────────
          2. ROLE SELECTION
      ──────────────────────────────────────────────────────────────────────── */}
      {mode === 'role' && (
        <View style={styles.authCard}>
          <View style={{ alignItems: 'center', marginBottom: 28 }}>
            <NirmayLogo size="small" showSubtitle={false} />
            <Text style={styles.heading}>Welcome to NirmayNet</Text>
            <Text style={styles.subheading}>Select your role to continue</Text>
          </View>

          {/* Option 1: ASHA Worker */}
          <TouchableOpacity
            style={[styles.roleOption, styles.roleOptionAsha]}
            onPress={() => selectRoleAndProceed('asha')}
            activeOpacity={0.85}
          >
            <View style={[styles.roleIconBadge, { backgroundColor: '#E6F4EA' }]}>
              <FontAwesome5 name="user-nurse" size={24} color="#059669" />
            </View>
            <View style={styles.roleTextGroup}>
              <Text style={styles.roleTitle}>ASHA Worker</Text>
              <Text style={styles.roleDesc}>Community Health</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={16} color="#059669" />
          </TouchableOpacity>

          {/* Option 2: PHC Doctor */}
          <TouchableOpacity
            style={[styles.roleOption, styles.roleOptionDoctor]}
            onPress={() => selectRoleAndProceed('phc_doctor')}
            activeOpacity={0.85}
          >
            <View style={[styles.roleIconBadge, { backgroundColor: '#EFF6FF' }]}>
              <FontAwesome5 name="user-md" size={24} color="#2563EB" />
            </View>
            <View style={styles.roleTextGroup}>
              <Text style={styles.roleTitle}>PHC Doctor</Text>
              <Text style={styles.roleDesc}>Primary Health Centre</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={16} color="#2563EB" />
          </TouchableOpacity>
        </View>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          3. LOGIN SCREEN
      ──────────────────────────────────────────────────────────────────────── */}
      {mode === 'login' && (
        <View style={styles.authCard}>
          <View style={styles.navBackRow}>
            <TouchableOpacity onPress={() => setMode('role')} style={styles.backButton}>
              <FontAwesome5 name="arrow-left" size={16} color="#475569" />
            </TouchableOpacity>
            <View style={[styles.rolePill, selectedRole === 'asha' ? styles.rolePillGreen : styles.rolePillBlue]}>
              <FontAwesome5
                name={selectedRole === 'asha' ? 'user-nurse' : 'user-md'}
                size={12}
                color={selectedRole === 'asha' ? '#059669' : '#2563EB'}
              />
              <Text style={[styles.rolePillText, { color: selectedRole === 'asha' ? '#059669' : '#2563EB' }]}>
                {selectedRole === 'asha' ? 'ASHA Worker' : 'PHC Doctor'}
              </Text>
            </View>
          </View>

          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Text style={styles.heading}>Login</Text>
            <Text style={styles.subheading}>Enter your credentials to continue</Text>
          </View>

          {/* Worker ID / Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Worker ID / Username</Text>
            <View style={styles.inputBox}>
              <FontAwesome5 name="id-badge" size={16} color="#94A3B8" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your ID"
                placeholderTextColor="#94A3B8"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputBox}>
              <FontAwesome5 name="lock" size={16} color="#94A3B8" style={{ marginRight: 10 }} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(p => !p)} style={{ padding: 4 }}>
                <FontAwesome5 name={showPassword ? 'eye-slash' : 'eye'} size={15} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.primaryButton, selectedRole === 'phc_doctor' && styles.primaryButtonBlue]}
            onPress={handleLogin}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Login</Text>
          </TouchableOpacity>

          {/* Switch to Sign Up */}
          <View style={styles.switchRow}>
            <Text style={styles.switchPrompt}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => setMode('signup')}>
              <Text style={[styles.switchLink, { color: selectedRole === 'asha' ? '#059669' : '#2563EB' }]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ───────────────────────────────────────────────────────────────────────
          4. SIGN UP SCREEN (CREATE ACCOUNT)
      ──────────────────────────────────────────────────────────────────────── */}
      {mode === 'signup' && (
        <View style={styles.authCard}>
          <View style={styles.navBackRow}>
            <TouchableOpacity onPress={() => setMode('login')} style={styles.backButton}>
              <FontAwesome5 name="arrow-left" size={16} color="#475569" />
            </TouchableOpacity>
            <Text style={styles.navTitle}>Create Account</Text>
            <View style={{ width: 32 }} />
          </View>

          <Text style={styles.subheadingCenter}>Join NirmayNet to make a difference</Text>

          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your full name"
                placeholderTextColor="#94A3B8"
                value={suFullName}
                onChangeText={setSuFullName}
              />
            </View>
          </View>

          {/* Age & Sex in Row */}
          <View style={styles.rowInputs}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.inputLabel}>Age</Text>
              <View style={styles.inputBox}>
                <TextInput
                  style={styles.textInput}
                  placeholder="e.g. 28"
                  placeholderTextColor="#94A3B8"
                  keyboardType="numeric"
                  value={suAge}
                  onChangeText={setSuAge}
                />
              </View>
            </View>

            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.inputLabel}>Sex</Text>
              <View style={styles.sexSelector}>
                {(['Female', 'Male', 'Other'] as const).map(s => (
                  <TouchableOpacity
                    key={s}
                    style={[styles.sexOption, suSex === s && styles.sexOptionActive]}
                    onPress={() => setSuSex(s)}
                  >
                    <Text style={[styles.sexOptionText, suSex === s && styles.sexOptionTextActive]}>
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Worker ID / Username */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Worker ID / Username</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder="e.g. ASHA_KAS_004"
                placeholderTextColor="#94A3B8"
                value={suUsername}
                onChangeText={setSuUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Village / Facility */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Village / Facility</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your village or facility"
                placeholderTextColor="#94A3B8"
                value={suVillage}
                onChangeText={setSuVillage}
              />
            </View>
          </View>

          {/* Phone Number (Optional) */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number (Optional)</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder="Enter your phone number"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={suPhone}
                onChangeText={setSuPhone}
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputBox}>
              <TextInput
                style={styles.textInput}
                placeholder="Create a password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!suShowPassword}
                value={suPassword}
                onChangeText={setSuPassword}
              />
              <TouchableOpacity onPress={() => setSuShowPassword(p => !p)} style={{ padding: 4 }}>
                <FontAwesome5 name={suShowPassword ? 'eye-slash' : 'eye'} size={15} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Create Account Button */}
          <TouchableOpacity
            style={[styles.primaryButton, selectedRole === 'phc_doctor' && styles.primaryButtonBlue]}
            onPress={handleSignUp}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          {/* Switch to Login */}
          <View style={styles.switchRow}>
            <Text style={styles.switchPrompt}>Already have an account? </Text>
            <TouchableOpacity onPress={() => setMode('login')}>
              <Text style={[styles.switchLink, { color: selectedRole === 'asha' ? '#059669' : '#2563EB' }]}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  splashContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashFooter: {
    paddingBottom: 24,
  },
  splashFooterText: {
    fontSize: 13,
    color: '#94A3B8',
    fontFamily: 'Inter_500Medium',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#334155',
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  authCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 4,
  },
  heading: {
    fontSize: 22,
    fontFamily: 'Inter_800ExtraBold',
    color: '#0F172A',
    textAlign: 'center',
    marginTop: 12,
  },
  subheading: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  subheadingCenter: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  navBackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  rolePillGreen: {
    backgroundColor: '#ECFDF5',
  },
  rolePillBlue: {
    backgroundColor: '#EFF6FF',
  },
  rolePillText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },
  roleOptionAsha: {
    borderColor: '#A7F3D0',
  },
  roleOptionDoctor: {
    borderColor: '#BFDBFE',
  },
  roleIconBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  roleTextGroup: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  roleDesc: {
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
    marginTop: 2,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
    color: '#334155',
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#0F172A',
  },
  rowInputs: {
    flexDirection: 'row',
  },
  sexSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 3,
    height: 48,
    alignItems: 'center',
  },
  sexOption: {
    flex: 1,
    height: 42,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sexOptionActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sexOptionText: {
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  sexOptionTextActive: {
    fontFamily: 'Inter_700Bold',
    color: '#0F172A',
  },
  primaryButton: {
    backgroundColor: '#059669',
    borderRadius: 14,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryButtonBlue: {
    backgroundColor: '#2563EB',
    shadowColor: '#2563EB',
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchPrompt: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#64748B',
  },
  switchLink: {
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
});
