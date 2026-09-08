import type { UrgencyLevel, Language } from '../types';
import { MASTER_SYMPTOMS } from '../constants/masterSymptoms';

export interface TriageAssessment {
  urgency: UrgencyLevel;
  guidanceText: Record<Language, string>;
  matchedRules: string[];
  recommendedAction: {
    primaryBtn: {
      labelKey: string;
      action: 'consultation' | 'referral' | 'appointment';
    };
    secondaryBtn?: {
      labelKey: string;
      action: 'referral' | 'guide';
    };
  };
  firstAidInstructions: Record<Language, string[]>;
}

export function evaluateTriage(selectedSymptomKeys: string[]): TriageAssessment {
  const keys = new Set(selectedSymptomKeys.map(k => k.toLowerCase()));

  const has = (...syms: string[]) => syms.some(s => keys.has(s.toLowerCase()));

  // 1. EMERGENCY (Red 🔴) Rules
  const isEmergencyConvulsions = has('convulsions', 'seizures', 'convulsions_in_child');
  const isUnconscious = has('very_sleepy_unconscious', 'fainting');
  const isSevereBreathlessness = has('breathlessness', 'shortness_of_breath') && has('chest_tightness', 'rapid_breathing', 'chest_pain');
  const isUncontrolledBleeding = has('bleeding') && has('blood_in_stool');
  const isPaediatricEmergency = has('chest_indrawing') || (has('fast_breathing_child') && has('convulsions_in_child'));
  const isPreeclampsiaRisk = (has('swollen_hands') || has('swollen_feet')) && (has('severe_headache') || has('blurred_vision_pregnancy')) && (has('high_bp_symptoms') || has('maternal_pregnancy'));
  const isPregnancyHeavyBleeding = has('bleeding') && has('maternal_pregnancy');

  if (
    isEmergencyConvulsions ||
    isUnconscious ||
    isSevereBreathlessness ||
    isUncontrolledBleeding ||
    isPaediatricEmergency ||
    isPreeclampsiaRisk ||
    isPregnancyHeavyBleeding ||
    has('convulsions', 'very_sleepy_unconscious', 'chest_indrawing')
  ) {
    return {
      urgency: 'EMERGENCY',
      guidanceText: {
        en: 'Contact PHC doctor immediately and call 108 Ambulance',
        mr: 'तातडीने प्राथमिक आरोग्य केंद्र (PHC) डॉक्टरांशी संपर्क साधा आणि १०८ बोलवा',
        hi: 'तुरंत प्राथमिक स्वास्थ्य केंद्र (PHC) डॉक्टर से संपर्क करें और 108 बुलाएं',
        kn: 'ತಕ್ಷಣ ಪಿಎಚ್‌ಸಿ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ ಮತ್ತು 108 ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ',
      },
      matchedRules: ['EMERGENCY_CRITICAL_SYMPTOMS'],
      recommendedAction: {
        primaryBtn: { labelKey: 'startConsultation', action: 'consultation' },
        secondaryBtn: { labelKey: 'makeReferral', action: 'referral' },
      },
      firstAidInstructions: {
        en: [
          'Keep patient lying on left side and loosen tight clothing.',
          'Do NOT give anything by mouth (food or water).',
          'Check breathing every 2 minutes and stay until ambulance arrives.',
        ],
        mr: [
          'रुग्णाला डाव्या कुशीवर झोपवा आणि कपडे सैल करा.',
          'तोंडातून काहीही (अन्न किंवा पाणी) देऊ नका.',
          'दर २ मिनिटांनी श्वास तपासा आणि रुग्णवाहिका येईपर्यंत सोबत राहा.',
        ],
        hi: [
          'मरीज़ को बाईं करवट लिटाएं और कपड़े ढीले करें।',
          'मुंह से कुछ भी (खाना या पानी) न दें।',
          'हर 2 मिनट में सांस जांचें और एम्बुलेंस आने तक साथ रहें।',
        ],
        kn: [
          'ರೋಗಿಯನ್ನು ಎಡಭಾಗಕ್ಕೆ ಮಲಗಿಸಿ ಮತ್ತು ಬಟ್ಟೆಯನ್ನು ಸಡಿಲಗೊಳಿಸಿ.',
          'ಆಹಾರ ಅಥವಾ ನೀರನ್ನು ಕೊಡಬೇಡಿ.',
          'ಪ್ರತಿ 2 ನಿಮಿಷಗಳಿಗೊಮ್ಮೆ ಉಸಿರಾಟವನ್ನು ಪರಿಶೀಲಿಸಿ.',
        ],
      },
    };
  }

  // 2. URGENT (Yellow 🟡) Rules
  const isHighFever2Days = has('high_fever', 'fever') && (has('chills') || has('sweating') || has('weakness'));
  const isPregnancyMildSwelling = has('maternal_pregnancy') && (has('swollen_feet') || has('reduced_fetal_movement'));
  const isChildFeverNotFeeding = (has('not_feeding') || has('unable_to_drink')) && (has('fever') || has('paediatric'));
  const isModerateBreathlessness = has('breathlessness') || has('shortness_of_breath') || has('wheezing');
  const isSevereAbdominalPain = has('abdominal_pain') || (has('vomiting') && has('diarrhoea'));
  const isChronicNewSymptoms = (has('high_blood_sugar_symptoms') || has('high_bp_symptoms')) && has('dizziness', 'headache', 'palpitations');

  if (
    isHighFever2Days ||
    isPregnancyMildSwelling ||
    isChildFeverNotFeeding ||
    isModerateBreathlessness ||
    isSevereAbdominalPain ||
    isChronicNewSymptoms ||
    has('high_fever', 'swollen_feet', 'reduced_fetal_movement', 'not_feeding', 'abdominal_pain')
  ) {
    return {
      urgency: 'URGENT',
      guidanceText: {
        en: 'Refer to Sub-Centre or schedule doctor consultation within 24 hours',
        mr: '२४ तासांच्या आत उपकेंद्र किंवा डॉक्टरांचा सल्ला घ्या',
        hi: '24 घंटे के भीतर उप-केंद्र या डॉक्टर का परामर्श लें',
        kn: '24 ಗಂಟೆಗಳ ಒಳಗೆ ವೈದ್ಯರ ಸಂಪರ್ಕ ಪಡೆಯಿರಿ',
      },
      matchedRules: ['URGENT_EVALUATION_NEEDED'],
      recommendedAction: {
        primaryBtn: { labelKey: 'startConsultation', action: 'consultation' },
        secondaryBtn: { labelKey: 'guidePrev', action: 'guide' },
      },
      firstAidInstructions: {
        en: [
          'Give damp cloth sponging for high fever.',
          'Provide ORS / fluids if conscious and able to drink.',
          'Monitor symptoms closely and prepare for PHC visit.',
        ],
        mr: [
          'ताप जास्त असल्यास ओल्या कपड्याने अंग पुसा.',
          'पीऊ शकत असल्यास ORS किंवा द्रव पदार्थ द्या.',
          'लक्षणांवर बारकाईने लक्ष ठेवा आणि PHC भेटीची तयारी करा.',
        ],
        hi: [
          'बुखार तेज होने पर गीली पट्टी का इस्तेमाल करें।',
          'यदि पी सकते हैं तो ORS या तरल पदार्थ दें।',
          'लक्षणों पर नज़र रखें और PHC जाने की तैयारी करें।',
        ],
        kn: [
          'ತಾಪಮಾನ ಹೆಚ್ಚಿದ್ದರೆ ಒದ್ದೆಯಾದ ಬಟ್ಟೆಯಿಂದ ಒರೆಸಿ.',
          'ಸಾಧ್ಯವಾದರೆ ORS ನೀಡಿ.',
          'ಲಕ್ಷಣಗಳನ್ನು ಗಮನಿಸಿ.',
        ],
      },
    };
  }

  // 3. ROUTINE (Green 🟢) Rules
  return {
    urgency: 'ROUTINE',
    guidanceText: {
      en: 'Schedule a routine PHC visit or sub-centre follow-up this week',
      mr: 'या आठवड्यात नियमित तपासणीसाठी उपकेंद्र किंवा PHC ला भेट द्या',
      hi: 'इस सप्ताह नियमित जांच के लिए उप-केंद्र या PHC जाएं',
      kn: 'ಈ ವಾರ ನಿಯಮಿತ ತಪಾಸಣೆ ವೇಳಾಪಟ್ಟಿ ಮಾಡಿ',
    },
    matchedRules: ['ROUTINE_CARE'],
    recommendedAction: {
      primaryBtn: { labelKey: 'startConsultation', action: 'consultation' },
    },
    firstAidInstructions: {
      en: [
        'Ensure adequate rest and hydration.',
        'Continue prescribed routine medicines.',
        'Follow up with ASHA worker if symptoms worsen.',
      ],
      mr: [
        'पुरेशी विश्रांती घ्या आणि भरपूर पाणी प्या.',
        'नियमित औषधे सुरू ठेवा.',
        'लक्षणे वाढल्यास आशा सेविकेशी संपर्क साधा.',
      ],
      hi: [
        'पर्याप्त आराम करें और पर्याप्त पानी पीएं।',
        'नियमित दवाएं जारी रखें।',
        'लक्षण बिगड़ने पर आशा कार्यकर्ता से संपर्क करें।',
      ],
      kn: [
        'ಸಾಕಷ್ಟು ವಿಶ್ರಾಂತಿ ತೆಗೆದುಕೊಳ್ಳಿ.',
        'ಔಷಧಿಗಳನ್ನು ಮುಂದುವರಿಸಿ.',
        'ಲಕ್ಷಣಗಳು ಹೆಚ್ಚಾದರೆ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.',
      ],
    },
  };
}
