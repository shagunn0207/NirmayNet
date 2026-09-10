import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking, Modal } from 'react-native';
import { useAuth } from '../../store/AuthContext';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { CLINICAL_GUIDES, type ConditionGuide } from '../../constants/clinicalGuides';
import { useRouter } from 'expo-router';

export default function GuideScreen() {
  const { t, language } = useAuth();
  const router = useRouter();

  const [selectedGuideId, setSelectedGuideId] = useState<string>(CLINICAL_GUIDES[0].id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const activeGuide: ConditionGuide = CLINICAL_GUIDES.find(g => g.id === selectedGuideId) || CLINICAL_GUIDES[0];
  const steps = activeGuide.steps;
  const currentStep = steps[currentStepIndex] || steps[0];
  const isLastStep = currentStepIndex === steps.length - 1;

  const handleSelectGuide = (guideId: string) => {
    setSelectedGuideId(guideId);
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    if (isLastStep) {
      router.push('/(asha)/home');
    } else {
      setCurrentStepIndex(prev => Math.min(steps.length - 1, prev + 1));
    }
  };

  const handlePrev = () => {
    setCurrentStepIndex(prev => Math.max(0, prev - 1));
  };

  const handleCallEmergency = () => {
    Linking.openURL('tel:108');
  };

  const progressPercent = Math.round(((currentStepIndex + 1) / steps.length) * 100);

  // Helper to safely get localized text or fallback to English
  const getLocalizedText = (obj: any) => {
    if (!obj) return '';
    return obj[language] || obj['en'] || '';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Offline banner */}
      <View style={styles.offlineBanner}>
        <FontAwesome5 name="wifi" size={14} color="#475569" style={{ marginRight: 8 }} />
        <Text style={styles.offlineBannerText}>{t('offlineBannerText') || 'Available offline'}</Text>
      </View>

      {/* Guide Selector */}
      <View style={styles.selectorContainer}>
        <Text style={styles.selectorLabel}>
          {t('more')?.toUpperCase() || 'MORE'} — CONDITION GUIDES ({CLINICAL_GUIDES.length})
        </Text>
        
        {/* Dropdown Filter */}
        <TouchableOpacity 
          style={styles.dropdownButton} 
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.dropdownButtonText}>
            {activeGuide.icon} {getLocalizedText(activeGuide.category)}
          </Text>
          <FontAwesome5 name="chevron-down" size={12} color="#0F766E" />
        </TouchableOpacity>

        <Modal visible={showFilterModal} transparent animationType="fade">
          <TouchableOpacity style={styles.modalOverlay} onPress={() => setShowFilterModal(false)}>
            <View style={styles.modalContent}>
              {CLINICAL_GUIDES.map(guide => (
                <TouchableOpacity
                  key={guide.id}
                  style={[styles.dropdownItem, guide.id === selectedGuideId && styles.dropdownItemActive]}
                  onPress={() => { handleSelectGuide(guide.id); setShowFilterModal(false); }}
                >
                  <Text style={[styles.dropdownItemText, guide.id === selectedGuideId && styles.dropdownItemTextActive]}>
                    {guide.icon} {getLocalizedText(guide.category)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>

      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            {t('step') || 'Step'} {currentStep.stepNumber} {t('stepOf') || 'of'} {currentStep.totalSteps}
          </Text>
          <Text style={styles.progressPercent}>{progressPercent}%</Text>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
        </View>
      </View>

      {/* Step Card */}
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconCircleText}>{currentStep.icon}</Text>
        </View>

        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>
            {t('step') || 'Step'} {currentStep.stepNumber} {t('stepOf') || 'of'} {currentStep.totalSteps}
          </Text>
        </View>

        <Text style={styles.instruction}>
          {getLocalizedText(currentStep.instruction)}
        </Text>

        <Text style={styles.subInstruction}>
          {getLocalizedText(currentStep.subInstruction)}
        </Text>
      </View>

      {/* Emergency Button */}
      <TouchableOpacity style={styles.btnDanger} onPress={handleCallEmergency}>
        <Text style={styles.btnDangerIcon}>📞</Text>
        <Text style={styles.btnDangerText}>108 — {t('ambulanceSection') || 'Call Ambulance'}</Text>
      </TouchableOpacity>

      {/* Navigation */}
      <View style={styles.navButtons}>
        <TouchableOpacity 
          style={[styles.btnOutline, currentStepIndex === 0 && styles.btnDisabled]} 
          onPress={handlePrev}
          disabled={currentStepIndex === 0}
        >
          <Text style={[styles.btnOutlineText, currentStepIndex === 0 && styles.btnDisabledText]}>
            {t('guidePrev') || 'Previous'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.btnPrimary, isLastStep && styles.btnSuccess]} 
          onPress={handleNext}
        >
          <Text style={styles.btnPrimaryText}>
            {isLastStep ? `✓ ${t('done') || 'Done'}` : (t('guideNext') || 'Next')}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 12,
  },
  offlineBannerText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  selectorContainer: {
    marginBottom: 16,
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    marginBottom: 8,
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
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F766E',
  },
  progressPercent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#0F766E',
    borderRadius: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 16,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#F0FDFA',
    borderWidth: 2,
    borderColor: '#CCFBF1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  iconCircleText: {
    fontSize: 44,
  },
  stepBadge: {
    backgroundColor: '#0F766E',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 14,
  },
  stepBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  instruction: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 10,
    lineHeight: 24,
  },
  subInstruction: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
  btnDanger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    paddingVertical: 14,
    marginBottom: 16,
  },
  btnDangerIcon: {
    marginRight: 8,
  },
  btnDangerText: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 15,
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40, // extra padding at bottom
  },
  btnOutline: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 14,
    marginRight: 8,
  },
  btnDisabled: {
    borderColor: '#CBD5E1',
    opacity: 0.5,
  },
  btnOutlineText: {
    color: '#0F766E',
    fontWeight: '700',
    fontSize: 15,
  },
  btnDisabledText: {
    color: '#94A3B8',
  },
  btnPrimary: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 14,
  },
  btnSuccess: {
    backgroundColor: '#16A34A',
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 15,
  },
});
