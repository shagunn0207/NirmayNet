export type Language = 'english' | 'marathi' | 'hindi' | 'kannada';

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  english: {
    'phc.dashboard': 'Doctor Dashboard',
    'phc.home': 'Home',
    'phc.consultations': 'Consultations',
    'phc.queue': 'OPD Queue',
    'phc.referrals': 'Referrals',
    'phc.profile': 'Profile',
    'phc.welcome': 'Good morning, Dr. Mehta',
    'phc.stats.incoming': 'Incoming consults',
    'phc.stats.pending': 'Pending referrals',
    'phc.stats.confirmed': 'Confirmed today',
    'phc.quickActions': 'Quick Actions',
    'phc.action.incomingConsults': 'Incoming Consultations',
    'phc.action.opdQueue': 'My OPD Queue',
    'phc.action.referralTracker': 'Referral Tracker',
    
    // Consultations Screen
    'phc.consult.title': 'Incoming Consultations',
    'phc.consult.waiting': 'waiting for review',
    'phc.consult.filter.all': 'All',
    'phc.consult.filter.high': 'High Risk',
    'phc.consult.filter.moderate': 'Moderate',
    'phc.consult.btn.review': 'Review Case',
    'phc.consult.age': 'Age',
    
    // Queue Screen
    'phc.queue.title': 'OPD Queue',
    'phc.queue.subtitle': 'patients waiting',
    'phc.queue.status.waiting': 'Waiting',
    'phc.queue.status.in_progress': 'In Progress',
    'phc.queue.btn.call': 'Call Patient',
    'phc.queue.btn.resume': 'Resume',
    
    // Patient Record
    'phc.record.title': 'Patient Directory',
    'phc.record.search': 'Search by name or ABHA ID...',
    'phc.record.btn.view': 'View Record',
    
    // Referrals
    'phc.referral.title': 'Referral Tracker',
    'phc.referral.subtitle': 'Active cases transferred to District Hospital',
    'phc.referral.status.transit': 'In Transit',
    'phc.referral.status.admitted': 'Admitted',
    'phc.referral.status.discharged': 'Discharged',
    'phc.referral.btn.details': 'View Details',
  },
  marathi: {
    'phc.dashboard': 'डॉक्टर डॅशबोर्ड',
    'phc.home': 'मुख्य पृष्ठ',
    'phc.consultations': 'सल्लामसलत',
    'phc.queue': 'ओपीडी रांग',
    'phc.referrals': 'संदर्भ',
    'phc.profile': 'प्रोफाइल',
    'phc.welcome': 'शुभ सकाळ, डॉ. मेहता',
    'phc.stats.incoming': 'येणारे सल्ले',
    'phc.stats.pending': 'प्रलंबित संदर्भ',
    'phc.stats.confirmed': 'आज पुष्टी केली',
    'phc.quickActions': 'जलद कृती',
    'phc.action.incomingConsults': 'येणारे सल्लामसलत',
    'phc.action.opdQueue': 'माझी ओपीडी रांग',
    'phc.action.referralTracker': 'संदर्भ ट्रॅकर',

    // Consultations Screen
    'phc.consult.title': 'येणारे सल्लामसलत',
    'phc.consult.waiting': 'पुनरावलोकनाची प्रतीक्षा आहे',
    'phc.consult.filter.all': 'सर्व',
    'phc.consult.filter.high': 'उच्च जोखीम',
    'phc.consult.filter.moderate': 'मध्यम जोखीम',
    'phc.consult.btn.review': 'केस तपासा',
    'phc.consult.age': 'वय',
    
    // Queue Screen
    'phc.queue.title': 'ओपीडी रांग',
    'phc.queue.subtitle': 'रुग्ण वाट पाहत आहेत',
    'phc.queue.status.waiting': 'प्रतीक्षा करत आहे',
    'phc.queue.status.in_progress': 'प्रगतीपथावर',
    'phc.queue.btn.call': 'रुग्णाला बोलावा',
    'phc.queue.btn.resume': 'सुरू ठेवा',
    
    // Patient Record
    'phc.record.title': 'रुग्ण निर्देशिका',
    'phc.record.search': 'नाव किंवा ABHA ID ने शोधा...',
    'phc.record.btn.view': 'रेकॉर्ड पहा',
    
    // Referrals
    'phc.referral.title': 'संदर्भ ट्रॅकर',
    'phc.referral.subtitle': 'जिल्हा रुग्णालयात पाठवलेले सक्रिय रुग्ण',
    'phc.referral.status.transit': 'वाटेत',
    'phc.referral.status.admitted': 'दाखल',
    'phc.referral.status.discharged': 'डिस्चार्ज दिला',
    'phc.referral.btn.details': 'तपशील पहा',
  },
  hindi: {
    'phc.dashboard': 'डॉक्टर डैशबोर्ड',
    'phc.home': 'होम',
    'phc.consultations': 'परामर्श',
    'phc.queue': 'ओपीडी कतार',
    'phc.referrals': 'रेफरल',
    'phc.profile': 'प्रोफ़ाइल',
    'phc.welcome': 'सुप्रभात, डॉ. मेहता',
    'phc.stats.incoming': 'आने वाले परामर्श',
    'phc.stats.pending': 'लंबित रेफरल',
    'phc.stats.confirmed': 'आज पुष्टि की गई',
    'phc.quickActions': 'त्वरित कार्रवाइयां',
    'phc.action.incomingConsults': 'आने वाले परामर्श',
    'phc.action.opdQueue': 'मेरी ओपीडी कतार',
    'phc.action.referralTracker': 'रेफरल ट्रैकर',

    // Consultations Screen
    'phc.consult.title': 'आने वाले परामर्श',
    'phc.consult.waiting': 'समीक्षा की प्रतीक्षा में',
    'phc.consult.filter.all': 'सभी',
    'phc.consult.filter.high': 'उच्च जोखिम',
    'phc.consult.filter.moderate': 'मध्यम',
    'phc.consult.btn.review': 'केस की समीक्षा करें',
    'phc.consult.age': 'आयु',
    
    // Queue Screen
    'phc.queue.title': 'ओपीडी कतार',
    'phc.queue.subtitle': 'मरीज प्रतीक्षा कर रहे हैं',
    'phc.queue.status.waiting': 'प्रतीक्षा में',
    'phc.queue.status.in_progress': 'प्रगति पर',
    'phc.queue.btn.call': 'मरीज को बुलाएं',
    'phc.queue.btn.resume': 'जारी रखें',
    
    // Patient Record
    'phc.record.title': 'मरीज निर्देशिका',
    'phc.record.search': 'नाम या ABHA ID से खोजें...',
    'phc.record.btn.view': 'रिकॉर्ड देखें',
    
    // Referrals
    'phc.referral.title': 'रेफरल ट्रैकर',
    'phc.referral.subtitle': 'जिला अस्पताल में भेजे गए सक्रिय मामले',
    'phc.referral.status.transit': 'रास्ते में',
    'phc.referral.status.admitted': 'भर्ती',
    'phc.referral.status.discharged': 'डिस्चार्ज',
    'phc.referral.btn.details': 'विवरण देखें',
  },
  kannada: {
    'phc.dashboard': 'ವೈದ್ಯರ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
    'phc.home': 'ಮುಖಪುಟ',
    'phc.consultations': 'ಸಮಾಲೋಚನೆಗಳು',
    'phc.queue': 'OPD ಸರತಿ',
    'phc.referrals': 'ಉಲ್ಲೇಖಗಳು',
    'phc.profile': 'ಪ್ರೊಫೈಲ್',
    'phc.welcome': 'ಶುಭೋದಯ, ಡಾ. ಮೆಹ್ತಾ',
    'phc.stats.incoming': 'ಒಳಬರುವ ಸಮಾಲೋಚನೆಗಳು',
    'phc.stats.pending': 'ಬಾಕಿ ಉಳಿದಿರುವ ಉಲ್ಲೇಖಗಳು',
    'phc.stats.confirmed': 'ಇಂದು ಖಚಿತಪಡಿಸಲಾಗಿದೆ',
    'phc.quickActions': 'ತ್ವರಿತ ಕ್ರಿಯೆಗಳು',
    'phc.action.incomingConsults': 'ಒಳಬರುವ ಸಮಾಲೋಚನೆಗಳು',
    'phc.action.opdQueue': 'ನನ್ನ OPD ಸರತಿ',
    'phc.action.referralTracker': 'ಉಲ್ಲೇಖಗಳ ಟ್ರ್ಯಾಕರ್',

    // Consultations Screen
    'phc.consult.title': 'ಒಳಬರುವ ಸಮಾಲೋಚನೆಗಳು',
    'phc.consult.waiting': 'ಪರಿಶೀಲನೆಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ',
    'phc.consult.filter.all': 'ಎಲ್ಲಾ',
    'phc.consult.filter.high': 'ಹೆಚ್ಚಿನ ಅಪಾಯ',
    'phc.consult.filter.moderate': 'ಮಧ್ಯಮ',
    'phc.consult.btn.review': 'ಪ್ರಕರಣ ಪರಿಶೀಲಿಸಿ',
    'phc.consult.age': 'ವಯಸ್ಸು',
    
    // Queue Screen
    'phc.queue.title': 'OPD ಸರತಿ',
    'phc.queue.subtitle': 'ರೋಗಿಗಳು ಕಾಯುತ್ತಿದ್ದಾರೆ',
    'phc.queue.status.waiting': 'ಕಾಯಲಾಗುತ್ತಿದೆ',
    'phc.queue.status.in_progress': 'ಪ್ರಗತಿಯಲ್ಲಿದೆ',
    'phc.queue.btn.call': 'ರೋಗಿಯನ್ನು ಕರೆಯಿರಿ',
    'phc.queue.btn.resume': 'ಮುಂದುವರಿಸಿ',
    
    // Patient Record
    'phc.record.title': 'ರೋಗಿಗಳ ಡೈರೆಕ್ಟರಿ',
    'phc.record.search': 'ಹೆಸರು ಅಥವಾ ABHA ID ಯಿಂದ ಹುಡುಕಿ...',
    'phc.record.btn.view': 'ದಾಖಲೆ ವೀಕ್ಷಿಸಿ',
    
    // Referrals
    'phc.referral.title': 'ಉಲ್ಲೇಖಗಳ ಟ್ರ್ಯಾಕರ್',
    'phc.referral.subtitle': 'ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆಗೆ ವರ್ಗಾಯಿಸಲಾದ ಸಕ್ರಿಯ ಪ್ರಕರಣಗಳು',
    'phc.referral.status.transit': 'ಸಾರಿಗೆಯಲ್ಲಿದೆ',
    'phc.referral.status.admitted': 'ದಾಖಲಾಗಿದ್ದಾರೆ',
    'phc.referral.status.discharged': 'ಬಿಡುಗಡೆ',
    'phc.referral.btn.details': 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ',
  }
};
