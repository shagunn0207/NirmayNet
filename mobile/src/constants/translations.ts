import type { Language } from '../types';

export interface TranslationDict {
  // Navigation
  home: string;
  patients: string;
  followups: string;
  more: string;
  back: string;
  next: string;
  cancel: string;
  save: string;
  search: string;

  // Language
  selectLanguage: string;
  marathi: string;
  hindi: string;
  english: string;

  // Login
  loginAppName: string;
  loginTagline: string;
  loginSupporting: string;
  usernameLabel: string;
  usernamePlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  forgotPassword: string;
  loginButton: string;
  offlineLoginNote: string;
  loginErrorMsg: string;
  connectionStatus: string;

  // Sync status
  statusSynced: string;
  statusPending: string;
  statusOffline: string;
  statusSyncing: string;

  // Home
  greeting: string;
  subCentre: string;
  todayWork: string;
  followupsCount: string;
  syncPending: string;
  urgentCase: string;
  newPatient: string;
  myPatients: string;
  startConsultation: string;
  urgentTasks: string;
  openPatient: string;
  urgentNeedsAttention: string;

  // Registration
  regTitle: string;
  regSubtitle: string;
  patientName: string;
  patientNamePlaceholder: string;
  age: string;
  sex: string;
  male: string;
  female: string;
  other: string;
  abhaId: string;
  abhaPlaceholder: string;
  scanQr: string;
  village: string;
  familyContact: string;
  familyContactPlaceholder: string;
  completeRegistration: string;

  // Triage
  triageTitle: string;
  patientSummary: string;
  speakSymptoms: string;
  speakInMarathi: string;
  listening: string;
  recognizing: string;
  orSelectSymptoms: string;
  symptomFever: string;
  symptomBreathing: string;
  symptomPregnancy: string;
  symptomHeadache: string;
  symptomWeakness: string;
  symptomVomiting: string;
  symptomChildUnder5: string;
  symptomChronic: string;
  urgencyResult: string;
  emergencyTitle: string;
  emergencyLabel: string;
  emergencyReason: string;
  startConsultBtn: string;
  makeReferral: string;

  // Consultation
  consultTitle: string;
  urgentCase2: string;
  breathingSwelling: string;
  doctorName: string;
  doctorPHC: string;
  startVideoCall: string;
  endCall: string;
  networkTest: string;
  connected: string;
  signalLost: string;
  connectionBroke: string;
  goingOffline: string;
  mute: string;
  camera: string;
  speaker: string;

  // Referral
  referralTitle: string;
  urgentReferral: string;
  referredTo: string;
  ambulanceSection: string;
  ambulanceDispatched: string;
  vehicle: string;
  driver: string;
  estimatedArrival: string;
  referralId: string;
  hospitalTimeline: string;
  referralSent: string;
  hospitalNotified: string;
  awaitingConfirmation: string;
  whileWaiting: string;
  instruction1: string;
  instruction2: string;
  instruction3: string;
  sendingReferral: string;
  referralSuccess: string;

  // Patients
  patientsTitle: string;
  searchPlaceholder: string;
  statusEmergency: string;
  statusUrgent: string;
  statusRoutine: string;
  patientHistory: string;
  registrationDate: string;
  previousConsultations: string;
  symptoms: string;
  referrals: string;
  notes: string;
  yearsOld: string;

  // Follow-ups
  followupTitle: string;
  markVisited: string;
  callPatient: string;
  completed: string;

  // Offline Guide
  guideTitle: string;
  step: string;
  guidePrev: string;
  guideNext: string;
  step1Title: string;
  step1Body: string;
  step2Title: string;
  step2Body: string;
  step3Title: string;
  step3Body: string;
}

export const translations: Record<Language, TranslationDict> = {
  mr: {
    home: 'मुख्यपृष्ठ',
    patients: 'रुग्ण',
    followups: 'फॉलो-अप',
    more: 'अधिक',
    back: 'मागे',
    next: 'पुढे',
    cancel: 'रद्द करा',
    save: 'जतन करा',
    search: 'शोधा',

    selectLanguage: 'भाषा / Language',
    marathi: 'मराठी',
    hindi: 'हिंदी',
    english: 'English',

    loginAppName: 'NiramayNet',
    loginTagline: 'आरोग्य सेवेसाठी तुमच्या सोबत',
    loginSupporting: 'ASHA कार्यकर्त्यांसाठी डिजिटल आरोग्य सहाय्य',
    usernameLabel: 'वापरकर्ता नाव',
    usernamePlaceholder: 'ASHA User ID',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'पासवर्ड टाका',
    forgotPassword: 'पासवर्ड विसरलात?',
    loginButton: 'लॉग इन करा',
    offlineLoginNote: 'कनेक्शन उपलब्ध नसल्यास ऑफलाइन लॉग इन करता येईल',
    loginErrorMsg: 'वापरकर्ता नाव किंवा पासवर्ड चुकीचा आहे.',
    connectionStatus: 'कनेक्शन',

    statusSynced: 'सर्व डेटा समक्रमित',
    statusPending: '2 नोंदी समक्रमित करायच्या आहेत',
    statusOffline: 'ऑफलाइन',
    statusSyncing: 'डेटा समक्रमित करत आहे...',

    greeting: 'नमस्कार, सावित्रीबाई',
    subCentre: 'Chinchpada Sub-Centre',
    todayWork: 'आजचे काम',
    followupsCount: '3 फॉलो-अप',
    syncPending: '2 नोंदी Sync बाकी',
    urgentCase: '1 तातडीचे प्रकरण',
    newPatient: 'नवीन रुग्ण',
    myPatients: 'माझे रुग्ण',
    startConsultation: 'सल्लामसलत सुरू करा',
    urgentTasks: 'तातडीची कामे',
    openPatient: 'रुग्ण उघडा',
    urgentNeedsAttention: 'तातडीची तपासणी आवश्यक',

    regTitle: 'नवीन रुग्ण नोंदणी',
    regSubtitle: 'रुग्णाची प्राथमिक माहिती भरा',
    patientName: 'रुग्णाचे नाव',
    patientNamePlaceholder: 'पूर्ण नाव टाका',
    age: 'वय',
    sex: 'लिंग',
    male: 'पुरुष',
    female: 'स्त्री',
    other: 'इतर',
    abhaId: 'ABHA ID',
    abhaPlaceholder: 'ABHA ID टाका',
    scanQr: 'स्कॅन करा',
    village: 'गाव',
    familyContact: 'कुटुंबाचा संपर्क नंबर',
    familyContactPlaceholder: 'फोन नंबर',
    completeRegistration: 'रुग्ण नोंदणी पूर्ण करा',

    triageTitle: 'रुग्णाची लक्षणे',
    patientSummary: 'Rekha Patil · 28 वर्षे · स्त्री',
    speakSymptoms: 'लक्षणे सांगा',
    speakInMarathi: 'मराठीत बोलू शकता',
    listening: 'ऐकत आहे...',
    recognizing: 'आवाज ओळखला जात आहे...',
    orSelectSymptoms: 'किंवा लक्षणे निवडा',
    symptomFever: 'ताप',
    symptomBreathing: 'श्वास घेण्यास त्रास',
    symptomPregnancy: 'गर्भावस्था',
    symptomHeadache: 'डोकेदुखी',
    symptomWeakness: 'अशक्तपणा',
    symptomVomiting: 'उलटी',
    symptomChildUnder5: '५ वर्षांखालील बालक',
    symptomChronic: 'दीर्घकालीन आजार',
    urgencyResult: 'तपासणी निकाल',
    emergencyTitle: 'तातडीची मदत आवश्यक',
    emergencyLabel: 'EMERGENCY',
    emergencyReason: 'गर्भावस्थेत श्वास घेण्यास त्रास आणि सूज',
    startConsultBtn: 'डॉक्टरांशी सल्लामसलत सुरू करा',
    makeReferral: 'रेफरल तयार करा',

    consultTitle: 'डॉक्टरांशी सल्लामसलत',
    urgentCase2: 'तातडीचे प्रकरण',
    breathingSwelling: 'श्वास घेण्यास त्रास · सूज',
    doctorName: 'Dr. Mehta',
    doctorPHC: 'Dhadgaon PHC',
    startVideoCall: 'व्हिडिओ कॉल सुरू करा',
    endCall: 'कॉल संपवा',
    networkTest: 'नेटवर्क चाचणी',
    connected: 'Connected',
    signalLost: 'Signal Lost',
    connectionBroke: 'कनेक्शन तुटले',
    goingOffline: 'ऑफलाइन क्लिनिकल मार्गदर्शकाकडे जात आहे...',
    mute: 'म्यूट',
    camera: 'कॅमेरा',
    speaker: 'स्पीकर',

    referralTitle: 'रुग्ण रेफरल',
    urgentReferral: 'तातडीचे रेफरल',
    referredTo: 'District Hospital, Nandurbar',
    ambulanceSection: '108 रुग्णवाहिका',
    ambulanceDispatched: 'रुग्णवाहिका रवाना झाली',
    vehicle: 'MH-15-AB-1234',
    driver: 'Ramesh Patil',
    estimatedArrival: '23 मिनिटे',
    referralId: 'NMN-2024-007',
    hospitalTimeline: 'रुग्णालय स्थिती',
    referralSent: 'रेफरल पाठवले',
    hospitalNotified: 'रुग्णालयाला कळवले',
    awaitingConfirmation: 'पुष्टीची प्रतीक्षा',
    whileWaiting: 'रुग्णवाहिका येईपर्यंत',
    instruction1: 'रुग्णाला डाव्या कुशीवर झोपवा',
    instruction2: 'खाणे-पिणे देऊ नका',
    instruction3: 'दर २ मिनिटांनी श्वास तपासा',
    sendingReferral: 'रेफरल पाठवत आहे...',
    referralSuccess: 'रेफरल यशस्वीपणे पाठवले',

    patientsTitle: 'माझे रुग्ण',
    searchPlaceholder: 'नाव किंवा ABHA ID शोधा',
    statusEmergency: 'तातडीचे',
    statusUrgent: 'लक्ष आवश्यक',
    statusRoutine: 'सामान्य',
    patientHistory: 'रुग्ण नोंदी',
    registrationDate: 'नोंदणी तारीख',
    previousConsultations: 'मागील सल्लामसलत',
    symptoms: 'लक्षणे',
    referrals: 'रेफरल',
    notes: 'नोंद',
    yearsOld: 'वर्षे',

    followupTitle: 'आजची फॉलो-अप कामे',
    markVisited: 'भेट झाली',
    callPatient: 'फोन करा',
    completed: 'पूर्ण',

    guideTitle: 'ऑफलाइन क्लिनिकल मार्गदर्शक',
    step: 'पायरी',
    guidePrev: '← मागील',
    guideNext: 'पुढील →',
    step1Title: 'पायरी १',
    step1Body: 'रुग्णाला सुरक्षित स्थितीत ठेवा. डाव्या कुशीवर झोपवा, डोके किंचित वर करा.',
    step2Title: 'पायरी २',
    step2Body: 'श्वासोच्छवास तपासा. छाती वर-खाली होत आहे का ते पहा. दर २ मिनिटांनी तपासा.',
    step3Title: 'पायरी ३',
    step3Body: 'तातडीची मदत मागवा. 108 ला संपर्क करा आणि रुग्णाजवळ राहा.',
  },

  hi: {
    home: 'मुख्य पृष्ठ',
    patients: 'मरीज़',
    followups: 'फॉलो-अप',
    more: 'अधिक',
    back: 'पीछे',
    next: 'आगे',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    search: 'खोजें',

    selectLanguage: 'भाषा / Language',
    marathi: 'मराठी',
    hindi: 'हिंदी',
    english: 'English',

    loginAppName: 'NiramayNet',
    loginTagline: 'स्वास्थ्य सेवा में आपके साथ',
    loginSupporting: 'ASHA कार्यकर्ताओं के लिए डिजिटल स्वास्थ्य सहायता',
    usernameLabel: 'उपयोगकर्ता नाम',
    usernamePlaceholder: 'ASHA User ID',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'पासवर्ड दर्ज करें',
    forgotPassword: 'पासवर्ड भूल गए?',
    loginButton: 'लॉग इन करें',
    offlineLoginNote: 'कनेक्शन उपलब्ध न होने पर ऑफलाइन लॉग इन किया जा सकता है',
    loginErrorMsg: 'उपयोगकर्ता नाम या पासवर्ड गलत है।',
    connectionStatus: 'कनेक्शन',

    statusSynced: 'सभी डेटा सिंक्रनाइज़',
    statusPending: '2 रिकॉर्ड सिंक करने हैं',
    statusOffline: 'ऑफलाइन',
    statusSyncing: 'डेटा सिंक कर रहे हैं...',

    greeting: 'नमस्ते, सावित्रीबाई',
    subCentre: 'Chinchpada Sub-Centre',
    todayWork: 'आज का काम',
    followupsCount: '3 फॉलो-अप',
    syncPending: '2 रिकॉर्ड Sync बाकी',
    urgentCase: '1 जरूरी मामला',
    newPatient: 'नया मरीज़',
    myPatients: 'मेरे मरीज़',
    startConsultation: 'परामर्श शुरू करें',
    urgentTasks: 'जरूरी काम',
    openPatient: 'मरीज़ खोलें',
    urgentNeedsAttention: 'तत्काल जांच आवश्यक',

    regTitle: 'नया मरीज़ पंजीकरण',
    regSubtitle: 'मरीज़ की प्राथमिक जानकारी भरें',
    patientName: 'मरीज़ का नाम',
    patientNamePlaceholder: 'पूरा नाम दर्ज करें',
    age: 'उम्र',
    sex: 'लिंग',
    male: 'पुरुष',
    female: 'महिला',
    other: 'अन्य',
    abhaId: 'ABHA ID',
    abhaPlaceholder: 'ABHA ID दर्ज करें',
    scanQr: 'स्कैन करें',
    village: 'गाँव',
    familyContact: 'परिवार का संपर्क नंबर',
    familyContactPlaceholder: 'फोन नंबर',
    completeRegistration: 'पंजीकरण पूरा करें',

    triageTitle: 'मरीज़ के लक्षण',
    patientSummary: 'Rekha Patil · 28 वर्ष · महिला',
    speakSymptoms: 'लक्षण बताएं',
    speakInMarathi: 'हिंदी में बोल सकते हैं',
    listening: 'सुन रहे हैं...',
    recognizing: 'आवाज़ पहचानी जा रही है...',
    orSelectSymptoms: 'या लक्षण चुनें',
    symptomFever: 'बुखार',
    symptomBreathing: 'सांस लेने में तकलीफ',
    symptomPregnancy: 'गर्भावस्था',
    symptomHeadache: 'सिरदर्द',
    symptomWeakness: 'कमज़ोरी',
    symptomVomiting: 'उल्टी',
    symptomChildUnder5: '5 साल से छोटा बच्चा',
    symptomChronic: 'दीर्घकालिक रोग',
    urgencyResult: 'जांच परिणाम',
    emergencyTitle: 'तत्काल सहायता आवश्यक',
    emergencyLabel: 'EMERGENCY',
    emergencyReason: 'गर्भावस्था में सांस की तकलीफ और सूजन',
    startConsultBtn: 'डॉक्टर से परामर्श शुरू करें',
    makeReferral: 'रेफरल तैयार करें',

    consultTitle: 'डॉक्टर से परामर्श',
    urgentCase2: 'जरूरी मामला',
    breathingSwelling: 'सांस की तकलीफ · सूजन',
    doctorName: 'Dr. Mehta',
    doctorPHC: 'Dhadgaon PHC',
    startVideoCall: 'वीडियो कॉल शुरू करें',
    endCall: 'कॉल समाप्त करें',
    networkTest: 'नेटवर्क परीक्षण',
    connected: 'Connected',
    signalLost: 'Signal Lost',
    connectionBroke: 'कनेक्शन टूट गया',
    goingOffline: 'ऑफलाइन गाइड पर जा रहे हैं...',
    mute: 'म्यूट',
    camera: 'कैमरा',
    speaker: 'स्पीकर',

    referralTitle: 'मरीज़ रेफरल',
    urgentReferral: 'तत्काल रेफरल',
    referredTo: 'District Hospital, Nandurbar',
    ambulanceSection: '108 रुग्णवाहन',
    ambulanceDispatched: 'एम्बुलेंस रवाना हुई',
    vehicle: 'MH-15-AB-1234',
    driver: 'Ramesh Patil',
    estimatedArrival: '23 मिनट',
    referralId: 'NMN-2024-007',
    hospitalTimeline: 'अस्पताल स्थिति',
    referralSent: 'रेफरल भेजा गया',
    hospitalNotified: 'अस्पताल को सूचित किया',
    awaitingConfirmation: 'पुष्टि की प्रतीक्षा',
    whileWaiting: 'एम्बुलेंस आने तक',
    instruction1: 'मरीज़ को बाईं करवट लिटाएं',
    instruction2: 'खाना-पानी न दें',
    instruction3: 'हर 2 मिनट में सांस जांचें',
    sendingReferral: 'रेफरल भेज रहे हैं...',
    referralSuccess: 'रेफरल सफलतापूर्वक भेजा गया',

    patientsTitle: 'मेरे मरीज़',
    searchPlaceholder: 'नाम या ABHA ID खोजें',
    statusEmergency: 'तत्काल',
    statusUrgent: 'ध्यान आवश्यक',
    statusRoutine: 'सामान्य',
    patientHistory: 'मरीज़ रिकॉर्ड',
    registrationDate: 'पंजीकरण तिथि',
    previousConsultations: 'पिछले परामर्श',
    symptoms: 'लक्षण',
    referrals: 'रेफरल',
    notes: 'नोट',
    yearsOld: 'वर्ष',

    followupTitle: 'आज के फॉलो-अप कार्य',
    markVisited: 'भेट झाली',
    callPatient: 'फोन करें',
    completed: 'पूर्ण',

    guideTitle: 'ऑफलाइन क्लिनिकल गाइड',
    step: 'चरण',
    guidePrev: '← पीछे',
    guideNext: 'आगे →',
    step1Title: 'चरण १',
    step1Body: 'मरीज़ को सुरक्षित स्थिति में रखें। बाईं करवट लिटाएं, सिर थोड़ा ऊपर करें।',
    step2Title: 'चरण २',
    step2Body: 'सांस जांचें। छाती ऊपर-नीचे हो रही है या नहीं। हर 2 मिनट में जांचें।',
    step3Title: 'चरण ३',
    step3Body: 'तत्काल सहायता बुलाएं। 108 पर संपर्क करें और मरीज़ के पास रहें।',
  },

  en: {
    home: 'Home',
    patients: 'Patients',
    followups: 'Follow-ups',
    more: 'More',
    back: 'Back',
    next: 'Next',
    cancel: 'Cancel',
    save: 'Save',
    search: 'Search',

    selectLanguage: 'भाषा / Language',
    marathi: 'मराठी',
    hindi: 'हिंदी',
    english: 'English',

    loginAppName: 'NiramayNet',
    loginTagline: 'With You for Health Services',
    loginSupporting: 'Digital health support for ASHA workers',
    usernameLabel: 'Username',
    usernamePlaceholder: 'ASHA User ID',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password',
    forgotPassword: 'Forgot password?',
    loginButton: 'Log In',
    offlineLoginNote: 'Offline login available if connection is unavailable',
    loginErrorMsg: 'Incorrect username or password.',
    connectionStatus: 'Connection',

    statusSynced: 'All data synced',
    statusPending: '2 records pending sync',
    statusOffline: 'Offline',
    statusSyncing: 'Syncing data...',

    greeting: 'Hello, Savitribai',
    subCentre: 'Chinchpada Sub-Centre',
    todayWork: "Today's Work",
    followupsCount: '3 Follow-ups',
    syncPending: '2 records pending sync',
    urgentCase: '1 Urgent case',
    newPatient: 'New Patient',
    myPatients: 'My Patients',
    startConsultation: 'Start Consultation',
    urgentTasks: 'Urgent Tasks',
    openPatient: 'Open Patient',
    urgentNeedsAttention: 'Urgent examination required',

    regTitle: 'New Patient Registration',
    regSubtitle: 'Enter patient primary information',
    patientName: 'Patient Name',
    patientNamePlaceholder: 'Enter full name',
    age: 'Age',
    sex: 'Sex',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    abhaId: 'ABHA ID',
    abhaPlaceholder: 'Enter ABHA ID',
    scanQr: 'Scan',
    village: 'Village',
    familyContact: 'Family Contact Number',
    familyContactPlaceholder: 'Phone number',
    completeRegistration: 'Complete Registration',

    triageTitle: 'Patient Symptoms',
    patientSummary: 'Rekha Patil · 28 years · Female',
    speakSymptoms: 'Speak Symptoms',
    speakInMarathi: 'You can speak in Marathi',
    listening: 'Listening...',
    recognizing: 'Recognizing voice...',
    orSelectSymptoms: 'Or select symptoms',
    symptomFever: 'Fever',
    symptomBreathing: 'Breathing difficulty',
    symptomPregnancy: 'Pregnancy',
    symptomHeadache: 'Headache',
    symptomWeakness: 'Weakness',
    symptomVomiting: 'Vomiting',
    symptomChildUnder5: 'Child under 5 years',
    symptomChronic: 'Chronic illness',
    urgencyResult: 'Assessment Result',
    emergencyTitle: 'Urgent Assistance Required',
    emergencyLabel: 'EMERGENCY',
    emergencyReason: 'Breathing difficulty and swelling during pregnancy',
    startConsultBtn: 'Start Consultation with Doctor',
    makeReferral: 'Create Referral',

    consultTitle: 'Consultation with Doctor',
    urgentCase2: 'Urgent Case',
    breathingSwelling: 'Breathing difficulty · Swelling',
    doctorName: 'Dr. Mehta',
    doctorPHC: 'Dhadgaon PHC',
    startVideoCall: 'Start Video Call',
    endCall: 'End Call',
    networkTest: 'Network Test',
    connected: 'Connected',
    signalLost: 'Signal Lost',
    connectionBroke: 'Connection lost',
    goingOffline: 'Opening offline clinical guide...',
    mute: 'Mute',
    camera: 'Camera',
    speaker: 'Speaker',

    referralTitle: 'Patient Referral',
    urgentReferral: 'Urgent Referral',
    referredTo: 'District Hospital, Nandurbar',
    ambulanceSection: '108 Ambulance',
    ambulanceDispatched: 'Ambulance dispatched',
    vehicle: 'MH-15-AB-1234',
    driver: 'Ramesh Patil',
    estimatedArrival: '23 minutes',
    referralId: 'NMN-2024-007',
    hospitalTimeline: 'Hospital Status',
    referralSent: 'Referral sent',
    hospitalNotified: 'Hospital notified',
    awaitingConfirmation: 'Awaiting confirmation',
    whileWaiting: 'While waiting for ambulance',
    instruction1: 'Place patient on left side',
    instruction2: 'Do not give food or water',
    instruction3: 'Check breathing every 2 minutes',
    sendingReferral: 'Sending referral...',
    referralSuccess: 'Referral sent successfully',

    patientsTitle: 'My Patients',
    searchPlaceholder: 'Search by name or ABHA ID',
    statusEmergency: 'Emergency',
    statusUrgent: 'Needs attention',
    statusRoutine: 'Routine',
    patientHistory: 'Patient Record',
    registrationDate: 'Registration Date',
    previousConsultations: 'Previous Consultations',
    symptoms: 'Symptoms',
    referrals: 'Referrals',
    notes: 'Notes',
    yearsOld: 'years',

    followupTitle: "Today's Follow-up Tasks",
    markVisited: 'Mark Visited',
    callPatient: 'Call',
    completed: 'Done',

    guideTitle: 'Offline Clinical Guide',
    step: 'Step',
    guidePrev: '← Prev',
    guideNext: 'Next →',
    step1Title: 'Step 1',
    step1Body: 'Place patient in a safe position. Lay on left side, slightly elevate the head.',
    step2Title: 'Step 2',
    step2Body: 'Check breathing. Watch if the chest rises and falls. Check every 2 minutes.',
    step3Title: 'Step 3',
    step3Body: 'Call for urgent help. Contact 108 and stay with the patient.',
  },
};
