import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { supabase } from '../../lib/supabase';
import Voice, { SpeechResultsEvent, SpeechErrorEvent } from '@react-native-voice/voice';

export default function RegistrationScreen() {
  const { t, user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [sex, setSex] = useState<'Female' | 'Male' | 'Other'>('Female');
  const [abhaId, setAbhaId] = useState('');
  const [village, setVillage] = useState('Chinchpada');
  const [phone, setPhone] = useState('');
  const [allergies, setAllergies] = useState('');
  
  const [nameTouched, setNameTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [abhaTouched, setAbhaTouched] = useState(false);
  const [abhaVerified, setAbhaVerified] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Voice State
  const [voiceLang, setVoiceLang] = useState('hi-IN');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingField, setRecordingField] = useState<'name' | 'phone' | null>(null);

  useFocusEffect(
    useCallback(() => {
      setName('');
      setAge(25);
      setSex('Female');
      setAbhaId('');
      setVillage('Chinchpada');
      setPhone('');
      setAllergies('');
      setNameTouched(false);
      setPhoneTouched(false);
      setAbhaTouched(false);
      setAbhaVerified(false);
    }, [])
  );

  useEffect(() => {
    Voice.onSpeechResults = (e: SpeechResultsEvent) => {
      if (e.value && e.value.length > 0) {
        if (recordingField === 'name') setName(e.value[0]);
        else if (recordingField === 'phone') setPhone(e.value[0].replace(/\D/g, '').slice(0, 10));
      }
      setIsRecording(false);
      setRecordingField(null);
    };
    Voice.onSpeechError = (e: SpeechErrorEvent) => {
      setIsRecording(false);
      setRecordingField(null);
    };
    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, [recordingField]);

  const toggleRecording = async (field: 'name' | 'phone') => {
    if (isRecording && recordingField === field) {
      await Voice.stop();
      setIsRecording(false);
      setRecordingField(null);
    } else {
      setRecordingField(field);
      setIsRecording(true);
      await Voice.start(voiceLang);
    }
  };

  // Strict validations
  const isNameValid = /^[a-zA-Z\s]{2,}$/.test(name.trim());
  const isPhoneValid = phone.replace(/\D/g, '').length === 10;
  const isAbhaValid = abhaVerified || /^\d{2}-\d{4}-\d{4}-\d{2}$/.test(abhaId.trim());

  const isFormValid = isNameValid && isPhoneValid && isAbhaValid;

  const handleAgeChange = (delta: number) => {
    setAge(prev => Math.max(0, Math.min(120, prev + delta)));
  };

  const handleScanAbha = () => {
    const demoAbha = '91-8823-4410-12';
    setAbhaId(demoAbha);
    setAbhaTouched(true);
    setAbhaVerified(true);
  };

  const handleSubmit = async () => {
    setNameTouched(true);
    setPhoneTouched(true);
    setAbhaTouched(true);

    if (!isFormValid || !user) return;
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.from('patients').insert({
        name: name.trim(),
        age,
        gender: sex === 'Female' ? 'F' : sex === 'Male' ? 'M' : 'Other',
        abha_id: abhaId || null,
        village,
        phone,
        asha_id: user.id
      }).select().single();

      if (error) throw error;
      router.push({ pathname: '/(asha)/triage', params: { patient_id: data.id } });
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <ScrollView style={styles.container}>
        <View style={styles.langSelectorRow}>
          <Text style={styles.subtitle}>{t('regSubtitle') || 'Register a new patient'}</Text>
          <View style={styles.langSelector}>
            <FontAwesome5 name="language" size={14} color="#64748B" />
            <select 
              value={voiceLang}
              onChange={(e) => setVoiceLang(e.target.value)}
              style={styles.langSelectNative as any}
            >
              <option value="hi-IN">हिंदी</option>
              <option value="mr-IN">मराठी</option>
              <option value="kn-IN">ಕನ್ನಡ</option>
              <option value="en-IN">English</option>
            </select>
          </View>
        </View>

        <View style={styles.formContainer}>
        {/* Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('patientName') || 'Patient Name'} *</Text>
          <View style={[styles.inputWrapper, nameTouched && !isNameValid && styles.inputError]}>
            <TextInput
              style={styles.input}
              placeholder={t('patientNamePlaceholder') || 'Enter name'}
              value={name}
              onChangeText={setName}
              onBlur={() => setNameTouched(true)}
            />
            <TouchableOpacity style={[styles.iconBtn, isRecording && recordingField === 'name' && styles.recordingBtn]} onPress={() => toggleRecording('name')}>
              <FontAwesome5 name="microphone" size={16} color={isRecording && recordingField === 'name' ? "#DC2626" : "#0F766E"} />
            </TouchableOpacity>
          </View>
          {nameTouched && !isNameValid && (
            <Text style={styles.errorText}>{t('invalidNameError') || 'Valid name is required'}</Text>
          )}
        </View>

        {/* Age */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('age') || 'Age'} ({t('yearsOld') || 'years'})</Text>
          <View style={styles.numberPicker}>
            <TouchableOpacity style={styles.numberBtn} onPress={() => handleAgeChange(-1)}>
              <Text style={styles.numberBtnText}>-</Text>
            </TouchableOpacity>
            <View style={styles.numberValueContainer}>
              <Text style={styles.numberValue}>{age}</Text>
            </View>
            <TouchableOpacity style={styles.numberBtn} onPress={() => handleAgeChange(1)}>
              <Text style={styles.numberBtnText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Allergies */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>⚠️ {t('allergiesLabel') || 'Known Allergies'}</Text>
          <TextInput
            style={styles.inputSingle}
            placeholder={t('allergiesPlaceholder') || 'e.g. Peanuts, Penicillin'}
            value={allergies}
            onChangeText={setAllergies}
          />
          <View style={styles.chipContainer}>
            {['Penicillin', 'Dust & Pollen', 'Food & Peanuts', 'Latex', 'Sulfa Drugs', 'None'].map(chip => {
              const isSelected = allergies.includes(chip);
              return (
                <TouchableOpacity
                  key={chip}
                  style={[styles.chip, isSelected && styles.chipSelected]}
                  onPress={() => {
                    const newVal = chip === 'None' ? 'None' : (allergies ? (allergies.includes(chip) ? allergies : `${allergies}, ${chip}`) : chip);
                    setAllergies(newVal);
                  }}
                >
                  <Text style={[styles.chipText, isSelected && styles.chipTextSelected]}>
                    {isSelected ? '✓ ' : '+ '}{chip}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Sex */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('sex') || 'Sex'}</Text>
          <View style={styles.sexRow}>
            {(['Female', 'Male', 'Other'] as const).map(s => {
              const isSelected = sex === s;
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.sexBtn, isSelected && styles.sexBtnActive]}
                  onPress={() => setSex(s)}
                >
                  <Text style={[styles.sexBtnText, isSelected && styles.sexBtnTextActive]}>
                    {s === 'Female' ? (t('female') || 'Female') : s === 'Male' ? (t('male') || 'Male') : (t('other') || 'Other')}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ABHA ID */}
        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>{t('abhaId') || 'ABHA ID'} *</Text>
            {abhaVerified && (
              <View style={styles.verifiedBadge}>
                <FontAwesome5 name="check-circle" size={12} color="#16A34A" />
                <Text style={styles.verifiedText}>{t('abhaVerifiedBadge') || 'Verified'}</Text>
              </View>
            )}
          </View>
          <View style={styles.abhaRow}>
            <TextInput
              style={[styles.inputSingle, styles.abhaInput, abhaTouched && !isAbhaValid && styles.inputError]}
              placeholder={t('abhaPlaceholder') || 'XX-XXXX-XXXX-XX'}
              value={abhaId}
              onChangeText={setAbhaId}
              onBlur={() => setAbhaTouched(true)}
              maxLength={17}
            />
            <TouchableOpacity style={styles.scanBtn} onPress={handleScanAbha}>
              <FontAwesome5 name="camera" size={14} color="#0F766E" />
              <Text style={styles.scanBtnText}>{t('scanQr') || 'Scan'}</Text>
            </TouchableOpacity>
          </View>
          {abhaTouched && !isAbhaValid && (
            <Text style={styles.errorText}>{t('invalidAbhaError') || 'Valid ABHA ID is required'}</Text>
          )}
        </View>

        {/* Village */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('village') || 'Village'}</Text>
          <TextInput
            style={[styles.inputSingle, { backgroundColor: '#F1F5F9', color: '#475569' }]}
            value={village}
            onChangeText={setVillage}
          />
          <Text style={styles.helperText}>{t('autoFilledVillage') || 'Auto-filled based on your assigned sub-centre'}</Text>
        </View>

        {/* Phone */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('familyContact') || 'Family Contact Number'} *</Text>
          <View style={[styles.inputWrapper, phoneTouched && !isPhoneValid && styles.inputError]}>
            <TextInput
              style={styles.input}
              placeholder={t('familyContactPlaceholder') || '10-digit mobile number'}
              value={phone}
              onChangeText={(val) => setPhone(val.replace(/\\D/g, '').slice(0, 10))}
              onBlur={() => setPhoneTouched(true)}
              keyboardType="phone-pad"
              maxLength={10}
            />
            <TouchableOpacity style={[styles.iconBtn, isRecording && recordingField === 'phone' && styles.recordingBtn]} onPress={() => toggleRecording('phone')}>
              <FontAwesome5 name="microphone" size={16} color={isRecording && recordingField === 'phone' ? "#DC2626" : "#0F766E"} />
            </TouchableOpacity>
          </View>
          {phoneTouched && !isPhoneValid && (
            <Text style={styles.errorText}>{t('invalidPhoneError') || 'Valid 10-digit number is required'}</Text>
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, (!isFormValid || isSubmitting) ? styles.submitBtnDisabled : null]}
          onPress={handleSubmit}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>{t('completeRegistration') || 'Complete Registration'}</Text>
          )}
        </TouchableOpacity>

          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  subtitle: {
    fontSize: 14,
    color: '#475569',
    fontWeight: '500',
    marginBottom: 18,
  },
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#16A34A',
    marginLeft: 4,
  },
  inputSingle: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    fontSize: 15,
    color: '#0F172A',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    height: 50,
  },
  inputError: {
    borderColor: '#DC2626',
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    height: '100%',
    fontSize: 15,
    color: '#0F172A',
  },
  iconBtn: {
    paddingHorizontal: 16,
    height: '100%',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#E2E8F0',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
  },
  helperText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
    marginTop: 6,
  },
  numberPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 50,
  },
  numberBtn: {
    width: 50,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
  },
  numberBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#475569',
  },
  numberValueContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 6,
    marginBottom: 6,
  },
  chipSelected: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  chipText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
  },
  chipTextSelected: {
    color: '#DC2626',
  },
  sexRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
  },
  sexBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  sexBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sexBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  sexBtnTextActive: {
    color: '#0F766E',
    fontWeight: 'bold',
  },
  abhaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  abhaInput: {
    flex: 1,
    marginRight: 10,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0FDFA',
    borderWidth: 1.5,
    borderColor: '#CCFBF1',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
  },
  scanBtnText: {
    color: '#0F766E',
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 6,
  },
  submitBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  langSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  langSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
  },
  langSelectNative: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '600',
    marginLeft: 6,
    outlineWidth: 0,
  } as any,
  recordingBtn: {
    backgroundColor: '#FEE2E2',
  },
});
