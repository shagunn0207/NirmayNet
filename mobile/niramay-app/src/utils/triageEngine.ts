import type { UrgencyLevel, Language } from '../types';
import { MASTER_SYMPTOMS, type MasterSymptom } from '../constants/masterSymptoms';

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
  if (!selectedSymptomKeys || selectedSymptomKeys.length === 0) {
    return {
      urgency: 'ROUTINE',
      guidanceText: {
        en: 'No specific symptoms selected. Perform routine wellness check.',
        mr: 'कोणतीही विशिष्ट लक्षणे निवडलेली नाहीत. नियमित आरोग्य तपासणी करा.',
        hi: 'कोई विशिष्ट लक्षण चयनित नहीं। सामान्य स्वास्थ्य जांच करें।',
        kn: 'ಯಾವುದೇ ಲಕ್ಷಣಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಲಾಗಿಲ್ಲ.',
      },
      matchedRules: ['ROUTINE_CHECK'],
      recommendedAction: {
        primaryBtn: { labelKey: 'startConsultation', action: 'consultation' },
      },
      firstAidInstructions: {
        en: ['Ensure general rest & hydration.', 'Monitor temperature & pulse.'],
        mr: ['विश्रांती घ्या व पाणी प्या.', 'तापमान व नाडीची नोंद ठेवा.'],
        hi: ['पर्याप्त आराम करें और पानी पीएं।', 'तापमान और नाड़ी जांचें।'],
        kn: ['ಸಾಕಷ್ಟು ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.', 'ತಾಪಮಾನ ಪರೀಕ್ಷಿಸಿ.'],
      },
    };
  }

  // Find matching symptoms from MASTER_SYMPTOMS
  const keysLower = new Set(selectedSymptomKeys.map(k => k.toLowerCase()));
  const matchedSymptoms = MASTER_SYMPTOMS.filter(s =>
    keysLower.has(s.id.toLowerCase()) ||
    keysLower.has(s.key.toLowerCase()) ||
    (s.labels && Object.values(s.labels).some((lbl: string | undefined) => Boolean(lbl && keysLower.has(lbl.toLowerCase()))))
  );

  // Fallback if keys don't directly match master dataset
  let overallUrgency: UrgencyLevel = 'ROUTINE';
  const hasEmergency = matchedSymptoms.some(s => s.urgency === 'EMERGENCY') ||
    selectedSymptomKeys.some(k => ['convulsions', 'seizures', 'chest_pain', 'snake_bite', 'breathlessness', 'unconscious', 'bleeding'].includes(k.toLowerCase()));
  
  const hasUrgent = matchedSymptoms.some(s => s.urgency === 'URGENT') ||
    selectedSymptomKeys.some(k => ['high_fever', 'swollen_feet', 'vomiting', 'abdominal_pain'].includes(k.toLowerCase()));

  if (hasEmergency) {
    overallUrgency = 'EMERGENCY';
  } else if (hasUrgent) {
    overallUrgency = 'URGENT';
  }

  // Filter symptoms matching the overall highest urgency
  const primarySymptoms = matchedSymptoms.filter(s => s.urgency === overallUrgency);
  const targetSymptoms = primarySymptoms.length > 0 ? primarySymptoms : matchedSymptoms;

  // Build tailored guidance and first aid instructions
  const languages: Language[] = ['en', 'mr', 'hi', 'kn'];
  const guidanceText: Record<Language, string> = { en: '', mr: '', hi: '', kn: '' };
  const firstAidInstructions: Record<Language, string[]> = { en: [], mr: [], hi: [], kn: [] };

  languages.forEach(lang => {
    // Compile guidance text from active symptoms with triageHelp
    const guidanceParts: string[] = [];
    const firstAidSteps: string[] = [];

    targetSymptoms.forEach(sym => {
      if (sym.triageHelp?.guidance) {
        const text = sym.triageHelp.guidance[lang] || sym.triageHelp.guidance.en;
        if (text && !guidanceParts.includes(text)) {
          guidanceParts.push(text);
        }
      }
      if (sym.triageHelp?.firstAid) {
        const steps = sym.triageHelp.firstAid[lang] || sym.triageHelp.firstAid.en;
        if (steps && Array.isArray(steps)) {
          steps.forEach(st => {
            if (st && !firstAidSteps.includes(st)) {
              firstAidSteps.push(st);
            }
          });
        }
      }
    });

    if (guidanceParts.length > 0) {
      guidanceText[lang] = guidanceParts.join(' ');
    } else {
      // Default clinical fallbacks by urgency
      if (overallUrgency === 'EMERGENCY') {
        guidanceText[lang] = {
          en: 'CRITICAL MEDICAL EMERGENCY: Call 108 Ambulance immediately and alert PHC Medical Officer.',
          mr: 'अत्यंत गंभीर वैद्यकीय आणीबाणी: तातडीने १०८ रुग्णवाहिका बोलवा आणि PHC डॉक्टरांना कळवा.',
          hi: 'गंभीर चिकित्सीय आपात स्थिति: तुरंत 108 एम्बुलेंस बुलाएं और PHC डॉक्टर को सूचित करें।',
          kn: 'ತೀವ್ರ ತುರ್ತು ಸ್ಥಿತಿ: ತಕ್ಷಣ 108 ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ ಮತ್ತು ಪಿಎಚ್‌ಸಿ ವೈದ್ಯರಿಗೆ ತಿಳಿಸಿ.',
        }[lang];
      } else if (overallUrgency === 'URGENT') {
        guidanceText[lang] = {
          en: 'URGENT EVALUATION NEEDED: Refer patient to Sub-Centre or schedule doctor consultation within 24 hours.',
          mr: 'तातडीची तपासणी आवश्यक: २४ तासांच्या आत उपकेंद्र किंवा डॉक्टरांचा सल्ला घ्या.',
          hi: 'त्वरित जांच आवश्यक: 24 घंटे के भीतर उप-केंद्र या डॉक्टर का परामर्श लें।',
          kn: 'ತುರ್ತು ಪರೀಕ್ಷೆ ಅಗತ್ಯ: 24 ಗಂಟೆಗಳ ಒಳಗೆ ವೈದ್ಯರ ಸಂಪರ್ಕ ಪಡೆಯಿರಿ.',
        }[lang];
      } else {
        guidanceText[lang] = {
          en: 'ROUTINE CARE: Provide supportive care and schedule routine Sub-Centre follow-up this week.',
          mr: 'नियमित काळजी: प्रथमोपचार करा आणि या आठवड्यात उपकेंद्रात तपासणी करा.',
          hi: 'सामान्य देखभाल: प्राथमिक उपचार दें और इस सप्ताह उप-केंद्र में दिखाएं।',
          kn: 'ಸಾಮಾನ್ಯ ಆರೈಕೆ: ಈ ವಾರ ನಿಯಮಿತ ತಪಾಸಣೆ ಮಾಡಿ.',
        }[lang];
      }
    }

    if (firstAidSteps.length > 0) {
      firstAidInstructions[lang] = firstAidSteps;
    } else {
      if (overallUrgency === 'EMERGENCY') {
        firstAidInstructions[lang] = {
          en: ['Keep patient calm and lying down.', 'Do NOT give anything by mouth if unconscious/seizuring.', 'Transport immediately in 108 Ambulance.'],
          mr: ['रुग्णाला शांत ठेवून झोपवून ठेवा.', 'शुद्ध नसल्यास तोंडात काहीही देऊ नका.', '१०८ ने त्वरित रुग्णालयात न्या.'],
          hi: ['मरीज़ को शांत रखकर लिटाएं।', 'बेहोश होने पर मुंह से कुछ न दें।', '108 से तुरंत अस्पताल ले जाएं।'],
          kn: ['ರೋಗಿಯನ್ನು ಶಾಂತವಾಗಿರಿಸಿ.', 'ಆಹಾರ ಅಥವಾ ನೀರು ಕೊಡಬೇಡಿ.', '108 ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ.'],
        }[lang];
      } else if (overallUrgency === 'URGENT') {
        firstAidInstructions[lang] = {
          en: ['Provide oral fluids or ORS if able to swallow.', 'Keep patient comfortable and rest.', 'Monitor symptoms closely and visit PHC.'],
          mr: ['गिळू शकत असल्यास भरपूर पाणी किंवा ORS द्या.', 'विश्रांती घ्यायला सांगा.', 'PHC मध्ये दाखवा.'],
          hi: ['यदि पी सकते हैं तो ORS या तरल दें।', 'आराम करने दें।', 'PHC में दिखाएं।'],
          kn: ['ORS ನೀಡಿ.', 'ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.', 'PHC ಗೆ ಕರೆದೊಯ್ಯಿರಿ.'],
        }[lang];
      } else {
        firstAidInstructions[lang] = {
          en: ['Ensure adequate rest and hydration.', 'Continue prescribed routine medicines.', 'Follow up if symptoms persist.'],
          mr: ['विश्रांती घ्या व पाणी प्या.', 'नियमित औषधे सुरू ठेवा.', 'लक्षणे राहिल्यास पुन्हा दाखवा.'],
          hi: ['पर्याप्त आराम करें और पानी पीएं।', 'नियमित दवाएं जारी रखें।', 'लक्षण रहने पर दिखाएं।'],
          kn: ['ವಿಶ್ರಾಂತಿ ಪಡೆಯಿರಿ.', 'ಔಷಧಿಗಳನ್ನು ಮುಂದುವರಿಸಿ.', 'PHC ಗೆ ತೋರಿಸಿ.'],
        }[lang];
      }
    }
  });

  return {
    urgency: overallUrgency,
    guidanceText,
    matchedRules: [overallUrgency + '_TRIAGE_EVALUATION'],
    recommendedAction: {
      primaryBtn: { labelKey: 'startConsultation', action: 'consultation' },
      secondaryBtn: overallUrgency !== 'ROUTINE' ? { labelKey: 'makeReferral', action: 'referral' } : undefined,
    },
    firstAidInstructions,
  };
}
