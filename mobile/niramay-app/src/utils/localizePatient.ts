import type { Patient, Language } from '../types';
import { MASTER_SYMPTOMS } from '../constants/masterSymptoms';

const LOCALE_MAP: Record<Language, string> = {
  mr: 'mr-IN',
  hi: 'hi-IN',
  en: 'en-IN',
  kn: 'kn-IN',
};

/**
 * Formats a date string in the given language's locale.
 * Works for ISO (YYYY-MM-DD) and D/M/YYYY formats (en-IN output).
 * Returns the original string if the date can't be parsed.
 */
function formatDateForLanguage(dateStr: string, language: Language): string {
  if (!dateStr) return dateStr;
  const locale = LOCALE_MAP[language] || 'en-IN';
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };

  // ISO format: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    try {
      const [y, m, d] = dateStr.split('-').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString(locale, options);
    } catch {
      return dateStr;
    }
  }

  // Numeric/slash format: D/M/YYYY or DD/MM/YYYY (typical en-IN locale output)
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    try {
      const [d, m, y] = dateStr.split('/').map(Number);
      const date = new Date(y, m - 1, d);
      return date.toLocaleDateString(locale, options);
    } catch {
      return dateStr;
    }
  }

  return dateStr;
}

const SYMPTOM_DICT: Record<string, Record<Language, string>> = {
  'श्वास घेण्यास त्रास': { en: 'Breathing difficulty', mr: 'श्वास घेण्यास त्रास', hi: 'सांस लेने में तकलीफ', kn: 'ಉಸಿರಾಟದ ತೊಂದರೆ' },
  'गर्भावस्था': { en: 'Pregnancy', mr: 'गर्भावस्था', hi: 'गर्भावस्था', kn: 'ಗರ್ಭಧಾರಣೆ' },
  'पायांना सूज': { en: 'Swelling in feet', mr: 'पायांना सूज', hi: 'पैरों में सूजन', kn: 'ಪಾದಗಳ ಊತ' },
  'खोकला': { en: 'Cough', mr: 'खोकला', hi: 'खांसी', kn: 'ಕೆಮ್ಮು' },
  'अशक्तपणा': { en: 'Weakness', mr: 'अशक्तपणा', hi: 'कमजोरी', kn: 'ದೌರ್ಬಲ್ಯ' },
  'ताप': { en: 'Fever', mr: 'ताप', hi: 'बुखार', kn: 'ಜ್ವರ' },
  'डोकेदुखी': { en: 'Headache', mr: 'डोकेदुखी', hi: 'सिरदर्द', kn: 'ತಲೆನೋವು' },
};

const TEXT_DICT: Record<string, Record<Language, string>> = {
  // Registration dates — demo patients (legacy Marathi strings)
  '15 ऑगस्ट 2024': { en: '15 August 2024', mr: '१५ ऑगस्ट २०२४', hi: '15 अगस्त 2024', kn: '15 ಆಗಸ್ಟ್ 2024' },
  '15 August 2024': { en: '15 August 2024', mr: '१५ ऑगस्ट २०२४', hi: '15 अगस्त 2024', kn: '15 ಆಗಸ್ಟ್ 2024' },
  '3 जुलै 2024': { en: '3 July 2024', mr: '३ जुलै २०२४', hi: '3 जुलाई 2024', kn: '3 ಜುಲೈ 2024' },
  '3 July 2024': { en: '3 July 2024', mr: '३ जुलै २०२४', hi: '3 जुलाई 2024', kn: '3 ಜುಲೈ 2024' },
  '20 जून 2024': { en: '20 June 2024', mr: '२० जून २०२४', hi: '20 जून 2024', kn: '20 ಜೂನ್ 2024' },
  '20 June 2024': { en: '20 June 2024', mr: '२० जून २०२४', hi: '20 जून 2024', kn: '20 ಜೂನ್ 2024' },

  // Last Visit
  'आज': { en: 'Today', mr: 'आज', hi: 'आज', kn: 'ಇಂದು' },
  'Today': { en: 'Today', mr: 'आज', hi: 'आज', kn: 'ಇಂದು' },
  '3 दिवसांपूर्वी': { en: '3 days ago', mr: '३ दिवसांपूर्वी', hi: '3 दिन पहले', kn: '3 ದಿನಗಳ ಹಿಂದೆ' },
  '3 days ago': { en: '3 days ago', mr: '३ दिवसांपूर्वी', hi: '3 दिन पहले', kn: '3 ದಿನಗಳ ಹಿಂದೆ' },
  '1 आठवड्यापूर्वी': { en: '1 week ago', mr: '१ आठवड्यापूर्वी', hi: '1 सप्ताह पहले', kn: '1 ವಾರದ ಹಿಂದೆ' },
  '1 week ago': { en: '1 week ago', mr: '१ आठवड्यापूर्वी', hi: '1 सप्ताह पहले', kn: '1 ವಾರದ ಹಿಂದೆ' },

  // Consultations
  '7 सप्टेंबर 2024 — Dr. Mehta (Dhadgaon PHC)': {
    en: '7 September 2024 — Dr. Mehta (Dhadgaon PHC)',
    mr: '७ सप्टेंबर २०२४ — डॉ. मेहता (धडगाव PHC)',
    hi: '7 सितंबर 2024 — डॉ. मेहता (धड़गांव PHC)',
    kn: '7 ಸೆಪ್ಟೆಂಬರ್ 2024 — ಡಾ. ಮೆಹ್ತಾ (ಧಡ್ಗಾಂವ್ PHC)',
  },
  '10 जुलै 2024 — Dr. Mehta': {
    en: '10 July 2024 — Dr. Mehta (Dhadgaon PHC)',
    mr: '१० जुलै २०२४ — डॉ. मेहता (धडगाव PHC)',
    hi: '10 जुलाई 2024 — डॉ. मेहता (धड़गांव PHC)',
    kn: '10 ಜುಲೈ 2024 — ಡಾ. ಮೆಹ್ತಾ (ಧಡ್ಗಾಂವ್ PHC)',
  },
  '25 जून 2024 — Dr. Mehta': {
    en: '25 June 2024 — Dr. Mehta (Dhadgaon PHC)',
    mr: '२५ जून २०२४ — डॉ. मेहता (धडगाव PHC)',
    hi: '25 जून 2024 — डॉ. मेहता (धड़गांव PHC)',
    kn: '25 ಜೂನ್ 2024 — ಡಾ. ಮೆಹ್ತಾ (ಧಡ್ಗಾಂವ್ PHC)',
  },

  // Referrals
  '7 सप्टेंबर 2024 — District Hospital Nandurbar': {
    en: '7 September 2024 — District Hospital Nandurbar',
    mr: '७ सप्टेंबर २०२४ — जिल्हा रुग्णालय नंदुरबार',
    hi: '7 सितंबर 2024 — जिला अस्पताल नंदुरबार',
    kn: '7 ಸೆಪ್ಟೆಂಬರ್ 2024 — ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆ ನಂದೂರ್ಬಾರ್',
  },

  // Notes
  'ANC तिसऱ्या तिमाहीत. उच्च-जोखीम गर्भावस्था.': {
    en: 'ANC 3rd Trimester. High-risk pregnancy.',
    mr: 'ANC तिसऱ्या तिमाहीत. उच्च-जोखीम गर्भावस्था.',
    hi: 'ANC तीसरी तिमाही। उच्च जोखिम गर्भावस्था।',
    kn: 'ANC 3 ನೇ ತ್ರೈಮಾಸಿಕ. ಹೆಚ್ಚಿನ ಅಪಾಯದ ಗರ್ಭಧಾರಣೆ.',
  },
  'TB उपचार — Day 14.': {
    en: 'TB Treatment — Day 14.',
    mr: 'TB उपचार — दिवस १४.',
    hi: 'टीबी इलाज — दिन 14.',
    kn: 'ಕ್ಷಯರೋಗ ಚಿಕಿತ್ಸೆ — ದಿನ 14.',
  },
  'तीव्र रक्तक्षय. लोह गोळ्या सुरू.': {
    en: 'Severe Anaemia. Iron tablets started.',
    mr: 'तीव्र रक्तक्षय. लोह गोळ्या सुरू.',
    hi: 'गंभीर एनीमिया। आयरन टैबलेट शुरू।',
    kn: 'ತೀವ್ರ ರಕ್ತಹೀನತೆ. ಐರನ್ ಮಾತ್ರೆಗಳು ಪ್ರಾರಂಭಿಸಲಾಗಿದೆ.',
  },
};

export function getLocalizedPatient(patient: Patient, language: Language): Patient {
  if (!patient) return patient;

  const localizedSymptoms = (patient.symptoms || []).map(sym => {
    // 1. Try master symptom key match
    const master = MASTER_SYMPTOMS.find(m => m.key === sym || m.id === sym || m.labels.en === sym || m.labels.mr === sym);
    if (master) {
      return master.labels[language] || master.labels.en;
    }
    // 2. Try symptom dictionary
    if (SYMPTOM_DICT[sym] && SYMPTOM_DICT[sym][language]) {
      return SYMPTOM_DICT[sym][language];
    }
    return sym;
  });

  const localizedConsultations = (patient.consultations || []).map(c => {
    return TEXT_DICT[c]?.[language] || c;
  });

  const localizedReferrals = (patient.referrals || []).map(r => {
    return TEXT_DICT[r]?.[language] || r;
  });

  // Try TEXT_DICT first (for demo/legacy dates), then dynamic formatting for ISO/slash dates
  const localizedRegistrationDate = patient.registrationDate
    ? (TEXT_DICT[patient.registrationDate]?.[language] ?? formatDateForLanguage(patient.registrationDate, language))
    : patient.registrationDate;

  const localizedLastVisit = patient.lastVisit
    ? TEXT_DICT[patient.lastVisit]?.[language] || patient.lastVisit
    : patient.lastVisit;

  const localizedNotes = patient.notes
    ? TEXT_DICT[patient.notes]?.[language] || patient.notes
    : patient.notes;

  return {
    ...patient,
    registrationDate: localizedRegistrationDate,
    lastVisit: localizedLastVisit,
    symptoms: localizedSymptoms,
    consultations: localizedConsultations,
    referrals: localizedReferrals,
    notes: localizedNotes,
  };
}
