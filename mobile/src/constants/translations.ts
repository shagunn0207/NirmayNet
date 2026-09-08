import type { Language } from '../types';

export interface TranslationDict {
  // Common & Speech UI
  speak: string;
  symptomBreathing: string;
  firstAidTitle: string;

  // Navigation & Shell
  home: string;
  patients: string;
  followups: string;
  more: string;
  profile: string;
  back: string;
  next: string;
  cancel: string;
  save: string;
  edit: string;
  delete: string;
  search: string;
  done: string;
  stay: string;
  goBack: string;
  confirm: string;
  reRecord: string;

  // Language
  selectLanguage: string;
  marathi: string;
  hindi: string;
  english: string;
  kannada: string;

  // Header & Dialogs
  unsavedChangesTitle: string;
  unsavedChangesMessage: string;

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
  loggingIn: string;
  offlineLoginNote: string;
  loginErrorMsg: string;
  connectionStatus: string;

  // Sync status
  statusSynced: string;
  statusPending: string;
  statusOffline: string;
  statusSyncing: string;

  // Home Screen
  greeting: string;
  subCentre: string;
  todayWork: string;
  editTodayWork: string;
  tasks: string;
  addTask: string;
  typeTaskPlaceholder: string;
  followupsCount: string;
  syncPending: string;
  urgentCase: string;
  followupsLabel: string;
  syncPendingLabel: string;
  urgentCaseLabel: string;
  reminders: string;
  filterToday: string;
  filterScheduled: string;
  filterAll: string;
  filterCompleted: string;
  addReminder: string;
  typeReminderPlaceholder: string;
  newPatient: string;
  newPatientSub: string;
  myPatients: string;
  registeredPatients: string;
  startConsultation: string;
  startConsultationSub: string;
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
  verifyAbha: string;
  abhaVerifiedBadge: string;
  village: string;
  autoFilledVillage: string;
  familyContact: string;
  familyContactPlaceholder: string;
  completeRegistration: string;

  // Validation
  invalidNameError: string;
  invalidPhoneError: string;
  invalidAbhaError: string;

  // Triage
  triageTitle: string;
  patientSummary: string;
  speakSymptoms: string;
  speakInMarathi: string;
  listening: string;
  recognizing: string;
  searchSymptomPlaceholder: string;
  quickSelectSymptoms: string;
  selectedSymptomsChips: string;
  transcriptionLabel: string;
  transcriptionCorrectionNote: string;
  urgencyResult: string;
  emergencyTitle: string;
  emergencyLabel: string;
  urgentLabel: string;
  routineLabel: string;
  emergency: string;
  urgent: string;
  routine: string;
  startConsultBtn: string;
  makeReferral: string;
  bookAppointment: string;

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
  cameraClosed: string;
  connectingCall: string;
  openOfflineGuide: string;

  // Referral
  referralTitle: string;
  urgentReferral: string;
  referredTo: string;
  referredHospital: string;
  districtHospital: string;
  distanceKm: string;
  vehicleNo: string;
  driverLabel: string;
  etaLabel: string;
  ambulanceSection: string;
  ambulanceDispatched: string;
  ambulanceNotifyNote: string;
  sendReferralBtn: string;
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
  noPatientsFound: string;
  basicInfo: string;
  currentStatus: string;
  lastVisitLabel: string;
  editPatientTitle: string;
  editSymptomsLabel: string;
  updatePatientBtn: string;
  patientUpdatedSnackbar: string;
  noSymptomsRecorded: string;

  // Follow-ups
  followupTitle: string;
  markVisited: string;
  callPatient: string;
  completed: string;
  allFollowupsDone: string;
  undo: string;

  // Offline Guide
  guideTitle: string;
  step: string;
  stepOf: string;
  guidePrev: string;
  guideNext: string;
  offlineBannerText: string;

  // Profile
  ashaWorkerRole: string;
  ashaWorkerName: string;
  subCentreLabel: string;
  phcLabel: string;
  mobileLabel: string;
  logoutBtn: string;
  jurisdictionDetails: string;
  coveredPopulation: string;
  systemAndSync: string;
  databaseStatus: string;
}

export const translations: Record<Language, TranslationDict> = {
  mr: {
    speak: 'बोलणे सुरू करा',
    symptomBreathing: 'श्वास घेण्यास त्रास',
    firstAidTitle: 'प्रथमोपचार सूचना',

    home: 'मुख्यपृष्ठ',
    patients: 'रुग्ण',
    followups: 'फॉलो-अप',
    more: 'मार्गदर्शक',
    profile: 'प्रोफाइल',
    back: 'मागे',
    next: 'पुढे',
    cancel: 'रद्द करा',
    save: 'जतन करा',
    edit: 'संपादित करा',
    delete: 'हटवा',
    search: 'शोधा',
    done: 'पूर्ण',
    stay: 'इथेच राहा',
    goBack: 'मागे जा',
    confirm: 'पुष्टी करा',
    reRecord: 'पुन्हा रेकॉर्ड करा',

    selectLanguage: 'भाषा निवडा / Select Language',
    marathi: 'मराठी',
    hindi: 'हिंदी',
    english: 'English',
    kannada: 'ಕನ್ನಡ',

    unsavedChangesTitle: 'अजतन केलेले बदल',
    unsavedChangesMessage: 'तुमच्याकडे जतन न केलेले बदल आहेत. मागे जायचे का?',

    loginAppName: 'NiramayNet',
    loginTagline: 'आरोग्य सेवेसाठी तुमच्या सोबत',
    loginSupporting: 'ASHA कार्यकर्त्यांसाठी डिजिटल आरोग्य सहाय्य',
    usernameLabel: 'वापरकर्ता नाव',
    usernamePlaceholder: 'ASHA User ID',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'पासवर्ड टाका',
    forgotPassword: 'पासवर्ड विसरलात?',
    loginButton: 'लॉग इन करा',
    loggingIn: 'लॉग इन होत आहे...',
    offlineLoginNote: 'कनेक्शन उपलब्ध नसल्यास ऑफलाइन लॉग इन करता येईल',
    loginErrorMsg: 'वापरकर्ता नाव किंवा पासवर्ड चुकीचा आहे.',
    connectionStatus: 'कनेक्शन',

    statusSynced: 'सर्व डेटा समक्रमित',
    statusPending: '२ नोंदी समक्रमित करायच्या आहेत',
    statusOffline: 'ऑफलाइन',
    statusSyncing: 'डेटा समक्रमित करत आहे...',

    greeting: 'नमस्कार, सावित्रीबाई',
    subCentre: 'चिंचपाडा उपकेंद्र',
    todayWork: 'आजचे काम',
    editTodayWork: 'आजचे काम संपादित करा',
    tasks: 'कामे',
    addTask: 'कार्य जोडा',
    typeTaskPlaceholder: 'नवीन कार्य टाका (उदा. गरोदर मातेची तपासणी)...',
    followupsCount: '३ फॉलो-अप बाकी',
    syncPending: '२ नोंदी Sync बाकी',
    urgentCase: '१ तातडीचे प्रकरण',
    followupsLabel: 'फॉलो-अप कामे (Follow-ups)',
    syncPendingLabel: 'सिंक प्रलंबित नोंदी (Sync Pending)',
    urgentCaseLabel: 'तातडीची प्रकरणे (Urgent Cases)',
    reminders: 'स्मरणपत्रे',
    filterToday: 'आज',
    filterScheduled: 'नियोजित',
    filterAll: 'सर्व',
    filterCompleted: 'पूर्ण',
    addReminder: 'स्मरणपत्र जोडा',
    typeReminderPlaceholder: 'नवीन स्मरणपत्र टाका (उदा. ANC पाठपुरावा भेट)...',
    newPatient: 'नवीन रुग्ण',
    newPatientSub: 'नवीन रुग्ण नोंदणी करा',
    myPatients: 'माझे रुग्ण',
    registeredPatients: 'नोंदणीकृत रुग्ण',
    startConsultation: 'सल्लामसलत सुरू करा',
    startConsultationSub: 'PHC डॉक्टरांशी व्हिडिओ सल्लामसलत',
    urgentTasks: 'तातडीची कामे',
    openPatient: 'रुग्ण उघडा',
    urgentNeedsAttention: 'तातडीची तपासणी आवश्यक',

    regTitle: 'नवीन रुग्ण नोंदणी',
    regSubtitle: 'रुग्णाची अचूक माहिती भरा (नाव, मोबाईल व ABHA ID)',
    patientName: 'रुग्णाचे नाव',
    patientNamePlaceholder: 'पूर्ण नाव टाका (उदा. रेखा पाटील)',
    age: 'वय',
    sex: 'लिंग',
    male: 'पुरुष',
    female: 'स्त्री',
    other: 'इतर',
    abhaId: 'ABHA ID (NHA स्वरूप)',
    abhaPlaceholder: 'XX-XXXX-XXXX-XXXX (१४ अंक)',
    scanQr: 'स्कॅन QR',
    verifyAbha: 'सत्यापित करा',
    abhaVerifiedBadge: '✓ ABHA NHA द्वारे सत्यापित',
    village: 'गाव',
    autoFilledVillage: 'उपकेंद्र क्षेत्रानुसार आधीच भरलेले आहे',
    familyContact: 'कुटुंबाचा संपर्क नंबर (१० अंक)',
    familyContactPlaceholder: '१० अंकी मोबाईल नंबर (उदा. ९८२३०११२३४)',
    completeRegistration: 'रुग्ण नोंदणी पूर्ण करा',

    invalidNameError: 'कृपया वैध नाव टाका (किमान २ अक्षरे, संख्या नको)',
    invalidPhoneError: 'कृपया ६-९ ने सुरू होणारा वैध १० अंकी मोबाईल नंबर टाका',
    invalidAbhaError: 'अवैध ABHA ID स्वरूप. १४ अंक असणे आवश्यक (उदा. ९१-८८२३-४४१०-१२)',

    triageTitle: 'रुग्ण तपासणी (Triage)',
    patientSummary: 'Rekha Patil · २८ वर्षे · स्त्री',
    speakSymptoms: 'लक्षणे सांगा (आवाज इनपुट)',
    speakInMarathi: 'मराठी, हिंदी किंवा इंग्रजीत बोलू शकता',
    listening: 'ऐकत आहे...',
    recognizing: 'आवाज ओळखला जात आहे...',
    searchSymptomPlaceholder: 'लक्षणे शोधा (उदा. ताप, श्वास, डोकेदुखी)...',
    quickSelectSymptoms: 'त्वरित निवडा (Common Symptoms Grid)',
    selectedSymptomsChips: 'निवडलेली लक्षणे',
    transcriptionLabel: 'ध्वनी मसुदा (संपादित करा):',
    transcriptionCorrectionNote: 'काही त्रुटी असल्यास शब्द संपादित करा आणि "पुष्टी करा" दाबा.',
    urgencyResult: 'तपासणी निकाल',
    emergencyTitle: 'तातडीची मदत आवश्यक (EMERGENCY)',
    emergencyLabel: 'आणीबाणी (EMERGENCY)',
    urgentLabel: 'तातडीचे (URGENT)',
    routineLabel: 'नियमित (ROUTINE)',
    emergency: 'आणीबाणी',
    urgent: 'तातडीचे',
    routine: 'नियमित',
    startConsultBtn: 'डॉक्टरांशी सल्लामसलत सुरू करा',
    makeReferral: 'रेफरल तयार करा',
    bookAppointment: 'अपॉइंटमेंट बुक करा',

    consultTitle: 'डॉक्टरांशी सल्लामसलत',
    urgentCase2: 'तातडीचे प्रकरण',
    breathingSwelling: 'श्वास घेण्यास त्रास · सूज',
    doctorName: 'डॉ. मेहता (Dr. Mehta)',
    doctorPHC: 'धडगाव प्राथमिक आरोग्य केंद्र (PHC)',
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
    cameraClosed: 'कॅमेरा बंद आहे',
    connectingCall: 'कनेक्ट होत आहे...',
    openOfflineGuide: 'ऑफलाइन मार्गदर्शक उघडा',

    referralTitle: 'रुग्ण रेफरल',
    urgentReferral: 'तातडीचे रेफरल',
    referredTo: 'जिल्हा रुग्णालय, नंदुरबार (District Hospital)',
    referredHospital: 'रेफर केलेले रुग्णालय',
    districtHospital: 'जिल्हा रुग्णालय, नंदुरबार',
    distanceKm: 'जिल्हास्तरीय रुग्णालय · ३४ किमी',
    vehicleNo: 'गाडी नंबर',
    driverLabel: 'चालक',
    etaLabel: 'अपेक्षित वेळ',
    ambulanceSection: '१०८ रुग्णवाहिका (Ambulance)',
    ambulanceDispatched: 'रुग्णवाहिका रवाना झाली',
    ambulanceNotifyNote: 'रेफरल पाठवल्यावर १०८ सूचित होईल',
    sendReferralBtn: '🚑 रेफरल पाठवा आणि १०८ बोलवा',
    vehicle: 'MH-15-AB-1234',
    driver: 'रमेश पाटील',
    estimatedArrival: '२३ मिनिटे',
    referralId: 'NMN-2024-007',
    hospitalTimeline: 'रुग्णालय स्थिती',
    referralSent: 'रेफरल पाठवले',
    hospitalNotified: 'रुग्णाला कळवले',
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
    noPatientsFound: 'कोणताही रुग्ण सापडला नाही',
    basicInfo: 'मूलभूत माहिती',
    currentStatus: 'सध्याची स्थिती',
    lastVisitLabel: 'शेवटची भेट',
    editPatientTitle: 'रुग्ण माहिती व लक्षणे संपादित करा',
    editSymptomsLabel: 'लक्षणे संपादित करा',
    updatePatientBtn: 'बदल जतन करा व स्थिती अद्ययावत करा',
    patientUpdatedSnackbar: 'रुग्ण माहिती व लक्षणे यशस्वीपणे अद्ययावत केली!',
    noSymptomsRecorded: 'कोणतीही लक्षणे नोंदवलेली नाहीत',

    followupTitle: 'आजची फॉलो-अप कामे',
    markVisited: 'भेट झाली',
    callPatient: 'फोन करा',
    completed: 'पूर्ण',
    allFollowupsDone: 'आजचे सर्व फॉलो-अप पूर्ण झाले!',
    undo: 'पूर्ववत करा',

    guideTitle: 'ऑफलाइन क्लिनिकल मार्गदर्शक',
    step: 'पायरी',
    stepOf: 'मधील',
    guidePrev: '← मागील',
    guideNext: 'पुढील →',
    offlineBannerText: 'ऑफलाइन मोड — इंटरनेट कनेक्शन उपलब्ध नाही',

    ashaWorkerRole: 'आशा सेविका (ASHA Worker)',
    ashaWorkerName: 'सावित्रीबाई पाटील',
    subCentreLabel: 'उपकेंद्र (Sub-Centre):',
    phcLabel: 'प्राथमिक आरोग्य केंद्र:',
    mobileLabel: 'मोबाईल:',
    logoutBtn: 'लॉगआउट (Logout)',
    jurisdictionDetails: 'क्षेत्र व केंद्र माहिती',
    coveredPopulation: 'व्याप्त लोकसंख्या: १,२५० नागरिक (२४० कुटुंबे)',
    systemAndSync: 'सिस्टम आणि समक्रमण',
    databaseStatus: 'डेटाबेस स्थिती',
  },

  hi: {
    speak: 'बोलना शुरू करें',
    symptomBreathing: 'सांस लेने में तकलीफ',
    firstAidTitle: 'प्राथमिक उपचार निर्देश',

    home: 'मुख्य पृष्ठ',
    patients: 'मरीज़',
    followups: 'फॉलो-अप',
    more: 'गाइड',
    profile: 'प्रोफ़ाइल',
    back: 'पीछे',
    next: 'आगे',
    cancel: 'रद्द करें',
    save: 'सहेजें',
    edit: 'संपादित करें',
    delete: 'हटाएं',
    search: 'खोजें',
    done: 'पूर्ण',
    stay: 'यहीं रहें',
    goBack: 'वापस जाएं',
    confirm: 'पुष्टि करें',
    reRecord: 'पुनः रिकॉर्ड करें',

    selectLanguage: 'भाषा चुनें / Select Language',
    marathi: 'मराठी',
    hindi: 'हिंदी',
    english: 'English',
    kannada: 'ಕನ್ನಡ',

    unsavedChangesTitle: 'असुरक्षित परिवर्तन',
    unsavedChangesMessage: 'आपके पास बिना सहेजे परिवर्तन हैं। क्या आप वापस जाना चाहते हैं?',

    loginAppName: 'NiramayNet',
    loginTagline: 'स्वास्थ्य सेवा में आपके साथ',
    loginSupporting: 'ASHA कार्यकर्ताओं के लिए डिजिटल स्वास्थ्य सहायता',
    usernameLabel: 'उपयोगकर्ता नाम',
    usernamePlaceholder: 'ASHA User ID',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'पासवर्ड दर्ज करें',
    forgotPassword: 'पासवर्ड भूल गए?',
    loginButton: 'लॉग इन करें',
    loggingIn: 'लॉग इन हो रहा है...',
    offlineLoginNote: 'कनेक्शन उपलब्ध न होने पर ऑफलाइन लॉग इन किया जा सकता है',
    loginErrorMsg: 'उपयोगकर्ता नाम या पासवर्ड गलत है।',
    connectionStatus: 'कनेक्शन',

    statusSynced: 'सभी डेटा सिंक्रनाइज़',
    statusPending: '2 रिकॉर्ड सिंक करने हैं',
    statusOffline: 'ऑफलाइन',
    statusSyncing: 'डेटा सिंक कर रहे हैं...',

    greeting: 'नमस्ते, सावित्रीबाई',
    subCentre: 'चिंचपाडा उप-केंद्र',
    todayWork: 'आज का काम',
    editTodayWork: 'आज का काम संपादित करें',
    tasks: 'कार्य',
    addTask: 'कार्य जोड़ें',
    typeTaskPlaceholder: 'नया कार्य लिखें (उदा. गर्भवती जांच)...',
    followupsCount: '3 फॉलो-अप बाकी',
    syncPending: '2 रिकॉर्ड Sync बाकी',
    urgentCase: '1 जरूरी मामला',
    followupsLabel: 'फॉलो-अप कार्य (Follow-ups)',
    syncPendingLabel: 'सिंक लंबित रिकॉर्ड (Sync Pending)',
    urgentCaseLabel: 'जरूरी मामले (Urgent Cases)',
    reminders: 'रिमाइंडर',
    filterToday: 'आज',
    filterScheduled: 'निर्धारित',
    filterAll: 'सभी',
    filterCompleted: 'पूरा हुआ',
    addReminder: 'रिमाइंडर जोड़ें',
    typeReminderPlaceholder: 'नया रिमाइंडर लिखें (उदा. एएनसी फॉलो-अप)...',
    newPatient: 'नया मरीज़',
    newPatientSub: 'नया मरीज पंजीकृत करें',
    myPatients: 'मेरे मरीज़',
    registeredPatients: 'पंजीकृत मरीज',
    startConsultation: 'परामर्श शुरू करें',
    startConsultationSub: 'PHC डॉक्टर से वीडियो परामर्श',
    urgentTasks: 'जरूरी काम',
    openPatient: 'मरीज़ खोलें',
    urgentNeedsAttention: 'तत्काल जांच आवश्यक',

    regTitle: 'नया मरीज़ पंजीकरण',
    regSubtitle: 'मरीज़ की सही जानकारी भरें (नाम, मोबाइल व ABHA ID)',
    patientName: 'मरीज़ का नाम',
    patientNamePlaceholder: 'पूरा नाम दर्ज करें (उदा. रेखा पाटिल)',
    age: 'उम्र',
    sex: 'लिंग',
    male: 'पुरुष',
    female: 'महिला',
    other: 'अन्य',
    abhaId: 'ABHA ID (NHA प्रारूप)',
    abhaPlaceholder: 'XX-XXXX-XXXX-XXXX (14 अंक)',
    scanQr: 'स्कैन QR',
    verifyAbha: 'सत्यापित करें',
    abhaVerifiedBadge: '✓ ABHA NHA द्वारा सत्यापित',
    village: 'गाँव',
    autoFilledVillage: 'उप-केंद्र क्षेत्र के अनुसार पहले से भरा हुआ',
    familyContact: 'परिवार का संपर्क नंबर (10 अंक)',
    familyContactPlaceholder: '10 अंकों का मोबाइल नंबर (उदा. 9823011234)',
    completeRegistration: 'पंजीकरण पूरा करें',

    invalidNameError: 'कृपया सही नाम दर्ज करें (कम से कम 2 अक्षर, संख्या नहीं)',
    invalidPhoneError: 'कृपया 6-9 से शुरू होने वाला सही 10 अंकों का मोबाइल नंबर दर्ज करें',
    invalidAbhaError: 'अवैध ABHA ID प्रारूप। 14 अंक होना आवश्यक (उदा. 91-8823-4410-12)',

    triageTitle: 'मरीज़ जांच (Triage)',
    patientSummary: 'Rekha Patil · 28 वर्ष · महिला',
    speakSymptoms: 'लक्षण बताएं (वॉइस इनपुट)',
    speakInMarathi: 'आप हिंदी, मराठी या अंग्रेजी में बोल सकते हैं',
    listening: 'सुन रहे हैं...',
    recognizing: 'आवाज़ पहचानी जा रही है...',
    searchSymptomPlaceholder: 'लक्षण खोजें (उदा. बुखार, सांस, सिरदर्द)...',
    quickSelectSymptoms: 'त्वरित चयन (Common Symptoms Grid)',
    selectedSymptomsChips: 'चयनित लक्षण',
    transcriptionLabel: 'ध्वनि मसूदा (संपादित करें):',
    transcriptionCorrectionNote: 'त्रुटियों को ठीक करें और "पुष्टि करें" दबाएं।',
    urgencyResult: 'जांच परिणाम',
    emergencyTitle: 'तत्काल सहायता आवश्यक (EMERGENCY)',
    emergencyLabel: 'आपातकालीन (EMERGENCY)',
    urgentLabel: 'जरूरी (URGENT)',
    routineLabel: 'रूटीन (ROUTINE)',
    emergency: 'आपातकालीन',
    urgent: 'जरूरी',
    routine: 'सामान्य',
    startConsultBtn: 'डॉक्टर से परामर्श शुरू करें',
    makeReferral: 'रेफरल तैयार करें',
    bookAppointment: 'अपॉइंटमेंट बुक करें',

    consultTitle: 'डॉक्टर से परामर्श',
    urgentCase2: 'जरूरी मामला',
    breathingSwelling: 'सांस की तकलीफ · सूजन',
    doctorName: 'डॉ. मेहता (Dr. Mehta)',
    doctorPHC: 'धड़गांव प्राथमिक स्वास्थ्य केंद्र (PHC)',
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
    cameraClosed: 'कैमरा बंद है',
    connectingCall: 'कनेक्ट हो रहा है...',
    openOfflineGuide: 'ऑफलाइन गाइड खोलें',

    referralTitle: 'मरीज़ रेफरल',
    urgentReferral: 'तत्काल रेफरल',
    referredTo: 'जिला अस्पताल, नंदुरबार (District Hospital)',
    referredHospital: 'रेफर किया गया अस्पताल',
    districtHospital: 'जिला अस्पताल, नंदुरबार',
    distanceKm: 'जिला स्तरीय अस्पताल · 34 किमी',
    vehicleNo: 'गाड़ी नंबर',
    driverLabel: 'चालक',
    etaLabel: 'अनुमानित समय',
    ambulanceSection: '108 रुग्णवाहन (Ambulance)',
    ambulanceDispatched: 'एम्बुलेंस रवाना हुई',
    ambulanceNotifyNote: 'रेफरल भेजने पर 108 को सूचित किया जाएगा',
    sendReferralBtn: '🚑 रेफरल भेजें और 108 बुलाएं',
    vehicle: 'MH-15-AB-1234',
    driver: 'रमेश पाटिल',
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
    noPatientsFound: 'कोई मरीज़ नहीं मिला',
    basicInfo: 'मूलभूत जानकारी',
    currentStatus: 'वर्तमान स्थिति',
    lastVisitLabel: 'अंतिम दौरा',
    editPatientTitle: 'मरीज़ जानकारी व लक्षण संपादित करें',
    editSymptomsLabel: 'लक्षण संपादित करें',
    updatePatientBtn: 'परिवर्तन सहेजें व स्थिति अपडेट करें',
    patientUpdatedSnackbar: 'मरीज़ की जानकारी और लक्षण सफलतापूर्वक अपडेट किए गए!',
    noSymptomsRecorded: 'कोई लक्षण दर्ज नहीं',

    followupTitle: 'आज के फॉलो-अप कार्य',
    markVisited: 'भेंट पूरी हुई',
    callPatient: 'फोन करें',
    completed: 'पूर्ण',
    allFollowupsDone: 'आज के सभी फॉलो-अप पूर्ण हुए!',
    undo: 'पूर्ववत करें',

    guideTitle: 'ऑफलाइन क्लिनिकल गाइड',
    step: 'चरण',
    stepOf: 'का',
    guidePrev: '← पीछे',
    guideNext: 'आगे →',
    offlineBannerText: 'ऑफलाइन मोड — इंटरनेट कनेक्शन उपलब्ध नहीं',

    ashaWorkerRole: 'आशा कार्यकर्ता (ASHA Worker)',
    ashaWorkerName: 'सावित्रीबाई पाटिल',
    subCentreLabel: 'उप-केंद्र (Sub-Centre):',
    phcLabel: 'प्राथमिक स्वास्थ्य केंद्र:',
    mobileLabel: 'मोबाइल:',
    logoutBtn: 'लॉगआउट (Logout)',
    jurisdictionDetails: 'क्षेत्र और केंद्र जानकारी',
    coveredPopulation: 'आच्छादित जनसंख्या: 1,250 नागरिक (240 परिवार)',
    systemAndSync: 'सिस्टम और सिंक',
    databaseStatus: 'डेटाबेस स्थिति',
  },

  en: {
    speak: 'Start speaking',
    symptomBreathing: 'Breathing difficulty',
    firstAidTitle: 'First Aid Instructions',

    home: 'Home',
    patients: 'Patients',
    followups: 'Follow-ups',
    more: 'Guide',
    profile: 'Profile',
    back: 'Back',
    next: 'Next',
    cancel: 'Cancel',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    done: 'Done',
    stay: 'Stay',
    goBack: 'Go back',
    confirm: 'Confirm',
    reRecord: 'Re-record',

    selectLanguage: 'Select Language / भाषा चुनें',
    marathi: 'मराठी',
    hindi: 'हिंदी',
    english: 'English',
    kannada: 'ಕನ್ನಡ',

    unsavedChangesTitle: 'Unsaved Changes',
    unsavedChangesMessage: 'You have unsaved changes. Go back?',

    loginAppName: 'NiramayNet',
    loginTagline: 'With You for Health Services',
    loginSupporting: 'Digital health support for ASHA workers',
    usernameLabel: 'Username',
    usernamePlaceholder: 'ASHA User ID',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter password',
    forgotPassword: 'Forgot password?',
    loginButton: 'Log In',
    loggingIn: 'Logging in...',
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
    editTodayWork: "Edit Today's Work Summary",
    tasks: 'Tasks',
    addTask: 'Add Task',
    typeTaskPlaceholder: 'Type new task (e.g. ANC Follow-up visit)...',
    followupsCount: '3 Follow-ups pending',
    syncPending: '2 records pending sync',
    urgentCase: '1 Urgent case',
    followupsLabel: 'Pending Follow-ups',
    syncPendingLabel: 'Pending Sync Records',
    urgentCaseLabel: 'Urgent Cases',
    reminders: 'Reminders',
    filterToday: 'Today',
    filterScheduled: 'Scheduled',
    filterAll: 'All',
    filterCompleted: 'Completed',
    addReminder: 'Add Reminder',
    typeReminderPlaceholder: 'Type new reminder (e.g. ANC Follow-up)...',
    newPatient: 'New Patient',
    newPatientSub: 'Register new patient',
    myPatients: 'My Patients',
    registeredPatients: 'registered patients',
    startConsultation: 'Start Consultation',
    startConsultationSub: 'Video consultation with PHC Doctor',
    urgentTasks: 'Urgent Tasks',
    openPatient: 'Open Patient',
    urgentNeedsAttention: 'Urgent examination required',

    regTitle: 'New Patient Registration',
    regSubtitle: 'Enter accurate patient details (Name, Mobile & ABHA ID)',
    patientName: 'Patient Name',
    patientNamePlaceholder: 'Enter full name (e.g., Rekha Patil)',
    age: 'Age',
    sex: 'Sex',
    male: 'Male',
    female: 'Female',
    other: 'Other',
    abhaId: 'ABHA ID (NHA Format)',
    abhaPlaceholder: 'XX-XXXX-XXXX-XXXX (14 digits)',
    scanQr: 'Scan QR',
    verifyAbha: 'Verify',
    abhaVerifiedBadge: '✓ ABHA Verified via NHA',
    village: 'Village',
    autoFilledVillage: 'Pre-filled based on Sub-Centre jurisdiction',
    familyContact: 'Family Contact Number (10 digits)',
    familyContactPlaceholder: '10-digit mobile number (e.g., 9823011234)',
    completeRegistration: 'Complete Registration',

    invalidNameError: 'Please enter a valid full name (min 2 letters, no numbers)',
    invalidPhoneError: 'Please enter a valid 10-digit mobile number starting with 6-9',
    invalidAbhaError: 'Invalid ABHA ID format. Must be 14 digits (e.g., 91-8823-4410-12)',

    triageTitle: 'Patient Triage Assessment',
    patientSummary: 'Rekha Patil · 28 years · Female',
    speakSymptoms: 'Speak Symptoms (Voice Input)',
    speakInMarathi: 'You can speak in English, Hindi, or Marathi',
    listening: 'Listening...',
    recognizing: 'Recognizing voice...',
    searchSymptomPlaceholder: 'Search symptoms (e.g. fever, breathing, headache)...',
    quickSelectSymptoms: 'Quick Select Chips (Common Symptoms)',
    selectedSymptomsChips: 'Selected Symptoms',
    transcriptionLabel: 'Transcribed Text (Editable):',
    transcriptionCorrectionNote: 'Correct any transcription mistakes and press Confirm.',
    urgencyResult: 'Assessment Result',
    emergencyTitle: 'EMERGENCY Assistance Required',
    emergencyLabel: 'EMERGENCY',
    urgentLabel: 'URGENT',
    routineLabel: 'ROUTINE',
    emergency: 'EMERGENCY',
    urgent: 'URGENT',
    routine: 'ROUTINE',
    startConsultBtn: 'Start Consultation with Doctor',
    makeReferral: 'Generate Referral',
    bookAppointment: 'Book Appointment',

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
    cameraClosed: 'Camera is off',
    connectingCall: 'Connecting call...',
    openOfflineGuide: 'Open Offline Guide',

    referralTitle: 'Patient Referral',
    urgentReferral: 'Urgent Referral',
    referredTo: 'District Hospital, Nandurbar',
    referredHospital: 'Referred Hospital',
    districtHospital: 'District Hospital, Nandurbar',
    distanceKm: 'District Level Hospital · 34 km',
    vehicleNo: 'Vehicle Number',
    driverLabel: 'Driver',
    etaLabel: 'Estimated Arrival',
    ambulanceSection: '108 Ambulance',
    ambulanceDispatched: 'Ambulance dispatched',
    ambulanceNotifyNote: '108 Ambulance will be notified upon sending referral',
    sendReferralBtn: '🚑 Send Referral & Call 108',
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
    noPatientsFound: 'No patients found',
    basicInfo: 'Basic Information',
    currentStatus: 'Current Status',
    lastVisitLabel: 'Last Visit',
    editPatientTitle: 'Edit Patient & Symptoms',
    editSymptomsLabel: 'Edit Symptoms',
    updatePatientBtn: 'Save Changes & Update Status',
    patientUpdatedSnackbar: 'Patient details and symptoms updated successfully!',
    noSymptomsRecorded: 'No symptoms recorded',

    followupTitle: "Today's Follow-up Tasks",
    markVisited: 'Mark Visited',
    callPatient: 'Call',
    completed: 'Done',
    allFollowupsDone: "All of today's follow-ups completed!",
    undo: 'Undo',

    guideTitle: 'Offline Clinical Guide',
    step: 'Step',
    stepOf: 'of',
    guidePrev: '← Prev',
    guideNext: 'Next →',
    offlineBannerText: 'Offline Mode — No internet connection',

    ashaWorkerRole: 'ASHA Worker',
    ashaWorkerName: 'Savitribai Patil',
    subCentreLabel: 'Sub-Centre:',
    phcLabel: 'Primary Health Centre:',
    mobileLabel: 'Mobile:',
    logoutBtn: 'Logout',
    jurisdictionDetails: 'Jurisdiction & Health Facility Details',
    coveredPopulation: 'Covered Population: 1,250 citizens (240 families)',
    systemAndSync: 'System & Sync Status',
    databaseStatus: 'Database Status',
  },

  kn: {
    speak: 'ಮಾತನಾಡಲು ಪ್ರಾರಂಭಿಸಿ',
    symptomBreathing: 'ಉಸಿರಾಟದ ತೊಂದರೆ',
    firstAidTitle: 'ಪ್ರಥಮ ಚಿಕಿತ್ಸೆ ಸೂಚನೆಗಳು',

    home: 'ಮುಖ್ಯ ಪುಟ',
    patients: 'ರೋಗಿಗಳು',
    followups: 'ಫಾಲೋ-ಅಪ್',
    more: 'ಮಾರ್ಗದರ್ಶಿ',
    profile: 'ಪ್ರೊಫೈಲ್',
    back: 'ಹಿಂತಿರುಗಿ',
    next: 'ಮುಂದೆ',
    cancel: 'ರದ್ದುಗೊಳಿಸಿ',
    save: 'ಸಂಗ್ರಹಿಸಿ',
    edit: 'ಸಂಪಾದಿಸಿ',
    delete: 'ಅಳಿಸಿ',
    search: 'ಹುಡುಕಿ',
    done: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    stay: 'ಇಲ್ಲೇ ಇರಿ',
    goBack: 'ಹಿಂತಿರುಗಿ',
    confirm: 'ಖಚಿತಪಡಿಸಿ',
    reRecord: 'ಮತ್ತೆ ರೆಕಾರ್ಡ್ ಮಾಡಿ',

    selectLanguage: 'Select Language / ಭಾಷೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ',
    marathi: 'ಮರಾಠಿ',
    hindi: 'ಹಿಂದಿ',
    english: 'English',
    kannada: 'ಕನ್ನಡ',

    unsavedChangesTitle: 'ಸಂಗ್ರಹಿಸದ ಬದಲಾವಣೆಗಳು',
    unsavedChangesMessage: 'ನಿಮ್ಮ ಬಳಿ ಸಂಗ್ರಹಿಸದ ಬದಲಾವಣೆಗಳಿವೆ. ಹಿಂತಿರುಗಬೇಕೆ?',

    loginAppName: 'NiramayNet',
    loginTagline: 'ಆರೋಗ್ಯ ಸೇವೆಯಲ್ಲಿ ನಿಮ್ಮೊಂದಿಗೆ',
    loginSupporting: 'ಆಶಾ ಕಾರ್ಯಕರ್ತೆಯರಿಗೆ ಡಿಜಿಟಲ್ ಆರೋಗ್ಯ ನೆರವು',
    usernameLabel: 'ಬಳಕೆದಾರ ಹೆಸರು',
    usernamePlaceholder: 'ASHA User ID',
    passwordLabel: 'ಪಾಸ್‌ವರ್ಡ್',
    passwordPlaceholder: 'ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
    forgotPassword: 'ಪಾಸ್‌ವರ್ಡ್ ಮರೆತಿದ್ದೀರಾ?',
    loginButton: 'ಲಾಗಿನ್ ಮಾಡಿ',
    loggingIn: 'ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...',
    offlineLoginNote: 'ಸಂಪರ್ಕ ಲಭ್ಯವಿಲ್ಲದಿದ್ದರೆ ಆಫ್‌ಲೈನ್ ಲಾಗಿನ್ ಸಾಧ್ಯ',
    loginErrorMsg: 'ತಪ್ಪಾದ ಬಳಕೆದಾರ ಹೆಸರು ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್.',
    connectionStatus: 'ಸಂಪರ್ಕ',

    statusSynced: 'ಎಲ್ಲಾ ಡೇಟಾ ಸಿಂಕ್ ಆಗಿದೆ',
    statusPending: '2 ದಾಖಲೆಗಳು ಸಿಂಕ್ ಬಾಕಿ ಇವೆ',
    statusOffline: 'ಆಫ್‌ಲೈನ್',
    statusSyncing: 'ಡೇಟಾ ಸಿಂಕ್ ಆಗುತ್ತಿದೆ...',

    greeting: 'ನಮಸ್ಕಾರ, ಸಾವಿತ್ರಿಬಾಯಿ',
    subCentre: 'ಚಿಂಚಪಾಡ ಉಪ-ಕೇಂದ್ರ',
    todayWork: 'ಇಂದಿನ ಕೆಲಸ',
    editTodayWork: 'ಇಂದಿನ ಕೆಲಸದ ಸಾರಾಂಶವನ್ನು ಸಂಪಾದಿಸಿ',
    tasks: 'ಕಾರ್ಯಗಳು',
    addTask: 'ಕಾರ್ಯ ಸೇರಿಸಿ',
    typeTaskPlaceholder: 'ಹೊಸ ಕಾರ್ಯವನ್ನು ಬರೆಯಿರಿ...',
    followupsCount: '3 ಫಾಲೋ-ಅಪ್‌ಗಳು ಬಾಕಿ',
    syncPending: '2 ದಾಖಲೆಗಳು Sync ಬಾಕಿ',
    urgentCase: '1 ತುರ್ತು ಪ್ರಕರಣ',
    followupsLabel: 'ಫಾಲೋ-ಅಪ್ ಕಾರ್ಯಗಳು (Follow-ups)',
    syncPendingLabel: 'ಸಿಂಕ್ ಬಾಕಿ ಇರುವ ದಾಖಲೆಗಳು (Sync Pending)',
    urgentCaseLabel: 'ತುರ್ತು ಪ್ರಕರಣಗಳು (Urgent Cases)',
    reminders: 'ನೆನಪುಗಳು',
    filterToday: 'ಇಂದು',
    filterScheduled: 'ನಿಗದಿತ',
    filterAll: 'ಎಲ್ಲಾ',
    filterCompleted: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    addReminder: 'ನೆನಪೋಲೆ ಸೇರಿಸಿ',
    typeReminderPlaceholder: 'ಹೊಸ ನೆನಪೋಲೆಯನ್ನು ಬರೆಯಿರಿ...',
    newPatient: 'ಹೊಸ ರೋಗಿ',
    newPatientSub: 'ಹೊಸ ರೋಗಿಯನ್ನು ನೋಂದಾಯಿಸಿ',
    myPatients: 'ನನ್ನ ರೋಗಿಗಳು',
    registeredPatients: 'ನೋಂದಾಯಿತ ರೋಗಿಗಳು',
    startConsultation: 'ಸಮಾಲೋಚನೆ ಪ್ರಾರಂಭಿಸಿ',
    startConsultationSub: 'PHC ವೈದ್ಯರೊಂದಿಗೆ ವೀಡಿಯೊ ಸಮಾಲೋಚನೆ',
    urgentTasks: 'ತುರ್ತು ಕಾರ್ಯಗಳು',
    openPatient: 'ರೋಗಿಯನ್ನು ತೆರೆಯಿರಿ',
    urgentNeedsAttention: 'ತುರ್ತು ತಪಾಸಣೆ ಅಗತ್ಯವಿದೆ',

    regTitle: 'ಹೊಸ ರೋಗಿಯ ನೋಂದಣಿ',
    regSubtitle: 'ರೋಗಿಯ ಸರಿಯಾದ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ (ಹೆಸರು, ಮೊಬೈಲ್ ಮತ್ತು ABHA ID)',
    patientName: 'ರೋಗಿಯ ಹೆಸರು',
    patientNamePlaceholder: 'ಪೂರ್ಣ ಹೆಸರು ನಮೂದಿಸಿ (ಉದಾ. ರೇಖಾ ಪಾಟೀಲ್)',
    age: 'ವಯಸ್ಸು',
    sex: 'ಲಿಂಗ',
    male: 'ಪುರುಷ',
    female: 'ಮಹಿಳೆ',
    other: 'ಇತರ',
    abhaId: 'ABHA ID (NHA ಸ್ವರೂಪ)',
    abhaPlaceholder: 'XX-XXXX-XXXX-XXXX (14 ಅಂಕೆಗಳು)',
    scanQr: 'ಕ್ಯೂಆರ್ ಸ್ಕ್ಯಾನ್',
    verifyAbha: 'ಪರಿಶೀಲಿಸಿ',
    abhaVerifiedBadge: '✓ ABHA Verified via NHA',
    village: 'ಗ್ರಾಮ',
    autoFilledVillage: 'ಉಪ-ಕೇಂದ್ರ ವ್ಯಾಪ್ತಿಯ ಆಧಾರದ ಮೇಲೆ ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಭರ್ತಿಯಾಗಿದೆ',
    familyContact: 'ಕುಟುಂಬದ ಸಂಪರ್ಕ ಸಂಖ್ಯೆ (10 ಅಂಕೆಗಳು)',
    familyContactPlaceholder: '10-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (ಉದಾ. 9823011234)',
    completeRegistration: 'ನೋಂದಣಿ ಪೂರ್ಣಗೊಳಿಸಿ',

    invalidNameError: 'ದಯವಿಟ್ಟು ಸಿಂಧುವಾದ ಹೆಸರನ್ನು ನಮೂದಿಸಿ (ಕನಿಷ್ಠ 2 ಅಕ್ಷರಗಳು)',
    invalidPhoneError: 'ದಯವಿಟ್ಟು 6-9 ರಿಂದ ಪ್ರಾರಂಭವಾಗುವ 10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
    invalidAbhaError: 'ಅಮಾನ್ಯ ABHA ID ಸ್ವರೂಪ. 14 ಅಂಕೆಗಳನ್ನು ಹೊಂದಿರಬೇಕು',

    triageTitle: 'ರೋಗಿಯ ತಪಾಸಣೆ (Triage)',
    patientSummary: 'Rekha Patil · 28 ವರ್ಷಗಳು · ಮಹಿಳೆ',
    speakSymptoms: 'ಲಕ್ಷಣಗಳನ್ನು ತಿಳಿಸಿ (ಧ್ವನಿ ಇನ್‌ಪುಟ್)',
    speakInMarathi: 'ನೀವು ಕನ್ನಡ, ಇಂಗ್ಲಿಷ್ ಅಥವಾ ಹಿಂದಿಯಲ್ಲಿ ಮಾತನಾಡಬಹುದು',
    listening: 'ಆಲಿಸಲಾಗುತ್ತಿದೆ...',
    recognizing: 'ಧ್ವನಿಯನ್ನು ಗುರುತಿಸಲಾಗುತ್ತಿದೆ...',
    searchSymptomPlaceholder: 'ಲಕ್ಷಣಗಳನ್ನು ಹುಡುಕಿ (ಉದಾ. ಜ್ವರ, ಉಸಿರಾಟ)...',
    quickSelectSymptoms: 'ತ್ವರಿತ ಆಯ್ಕೆ',
    selectedSymptomsChips: 'ಆಯ್ಕೆಮಾಡಿದ ಲಕ್ಷಣಗಳು',
    transcriptionLabel: 'ಪಠ್ಯ ರೂಪಾಂತರ (ಸಂಪಾದಿಸಿ):',
    transcriptionCorrectionNote: 'ತಪ್ಪುಗಳನ್ನು ಸರಿಪಡಿಸಿ "ಖಚಿತಪಡಿಸಿ" ಒತ್ತಿ.',
    urgencyResult: 'ತಪಾಸಣೆ ಫಲಿತಾಂಶ',
    emergencyTitle: 'ತುರ್ತು ನೆರವು ಅಗತ್ಯವಿದೆ (EMERGENCY)',
    emergencyLabel: 'ಆಪತ್ಕಾಲ (EMERGENCY)',
    urgentLabel: 'ತುರ್ತು (URGENT)',
    routineLabel: 'ಸಾಮಾನ್ಯ (ROUTINE)',
    emergency: 'ಆಪತ್ಕಾಲ',
    urgent: 'ತುರ್ತು',
    routine: 'ಸಾಮಾನ್ಯ',
    startConsultBtn: 'ವೈದ್ಯರೊಂದಿಗೆ ಸಮಾಲೋಚನೆ ಪ್ರಾರಂಭಿಸಿ',
    makeReferral: 'ರೆಫರಲ್ ರಚಿಸಿ',
    bookAppointment: 'ಅಪಾಯಿಂಟ್‌ಮೆಂಟ್ ಕಾಯ್ದಿರಿಸಿ',

    consultTitle: 'ವೈದ್ಯರೊಂದಿಗೆ ಸಮಾಲೋಚನೆ',
    urgentCase2: 'ತುರ್ತು ಪ್ರಕರಣ',
    breathingSwelling: 'ಉಸಿರಾಟದ ತೊಂದರೆ · ಊತ',
    doctorName: 'ಡಾ. ಮೆಹ್ತಾ (Dr. Mehta)',
    doctorPHC: 'ಧಡ್ಗಾಂವ್ ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ (PHC)',
    startVideoCall: 'ವೀಡಿಯೊ ಕರೆ ಪ್ರಾರಂಭಿಸಿ',
    endCall: 'ಕರೆ ಕೊನೆಗೊಳಿಸಿ',
    networkTest: 'ನೆಟ್‌ವರ್ಕ್ ಪರೀಕ್ಷೆ',
    connected: 'Connected',
    signalLost: 'Signal Lost',
    connectionBroke: 'ಸಂಪರ್ಕ ಕಡಿತಗೊಂಡಿದೆ',
    goingOffline: 'ಆಫ್‌ಲೈನ್ ಗೈಡ್‌ಗೆ ಹೋಗಲಾಗುತ್ತಿದೆ...',
    mute: 'ಮ್ಯೂಟ್',
    camera: 'ಕ್ಯಾಮೆರಾ',
    speaker: 'ಸ್ಪೀಕರ್',
    cameraClosed: 'ಕ್ಯಾಮೆರಾ ಆಫ್ ಆಗಿದೆ',
    connectingCall: 'ಸಂಪರ್ಕಿಸಲಾಗುತ್ತಿದೆ...',
    openOfflineGuide: 'ಆಫ್‌ಲೈನ್ ಮಾರ್ಗದರ್ಶಿ ತೆರೆಯಿರಿ',

    referralTitle: 'ರೋಗಿಯ ರೆಫರಲ್',
    urgentReferral: 'ತುರ್ತು ರೆಫರಲ್',
    referredTo: 'ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆ, ನಂದೂರ್ಬಾರ್',
    referredHospital: 'ಉಲ್ಲೇಖಿತ ಆಸ್ಪತ್ರೆ',
    districtHospital: 'ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆ, ನಂದೂರ್ಬಾರ್',
    distanceKm: 'ಜಿಲ್ಲಾ ಮಟ್ಟದ ಆಸ್ಪತ್ರೆ · 34 ಕಿಮೀ',
    vehicleNo: 'ವಾಹನ ಸಂಖ್ಯೆ',
    driverLabel: 'ಚಾಲಕ',
    etaLabel: 'ನಿರೀಕ್ಷಿತ ಸಮಯ',
    ambulanceSection: '108 ಆಂಬ್ಯುಲೆನ್ಸ್',
    ambulanceDispatched: 'ಆಂಬ್ಯುಲೆನ್ಸ್ ಹೊರಟಿದೆ',
    ambulanceNotifyNote: 'ರೆಫರಲ್ ಕಳುಹಿಸಿದ ನಂತರ 108 ಗೆ ತಿಳಿಸಲಾಗುವುದು',
    sendReferralBtn: '🚑 ರೆಫರಲ್ ಕಳುಹಿಸಿ ಮತ್ತು 108 ಕರೆ ಮಾಡಿ',
    vehicle: 'MH-15-AB-1234',
    driver: 'ರಮೇಶ್ ಪಾಟೀಲ್',
    estimatedArrival: '23 ನಿಮಿಷಗಳು',
    referralId: 'NMN-2024-007',
    hospitalTimeline: 'ಆಸ್ಪತ್ರೆ ಸ್ಥಿತಿ',
    referralSent: 'ರೆಫರಲ್ ಕಳುಹಿಸಲಾಗಿದೆ',
    hospitalNotified: 'ಆಸ್ಪತ್ರೆಗೆ ತಿಳಿಸಲಾಗಿದೆ',
    awaitingConfirmation: 'ದೃಢೀಕರಣಕ್ಕಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ',
    whileWaiting: 'ಆಂಬ್ಯುಲೆನ್ಸ್ ಬರುವವರೆಗೆ',
    instruction1: 'ರೋಗಿಯನ್ನು ಎಡಭಾಗಕ್ಕೆ ಮಲಗಿಸಿ',
    instruction2: 'ಆಹಾರ ಅಥವಾ ನೀರನ್ನು ಕೊಡಬೇಡಿ',
    instruction3: 'ಪ್ರತಿ 2 ನಿಮಿಷಗಳಿಗೊಮ್ಮೆ ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ',
    sendingReferral: 'ರೆಫರಲ್ ಕಳುಹಿಸಲಾಗುತ್ತಿದೆ...',
    referralSuccess: 'ರೆಫರಲ್ ಯಶಸ್ವಿಯಾಗಿ ಕಳುಹಿಸಲಾಗಿದೆ',

    patientsTitle: 'ನನ್ನ ರೋಗಿಗಳು',
    searchPlaceholder: 'ಹೆಸರು ಅಥವಾ ABHA ID ಮೂಲಕ ಹುಡುಕಿ',
    statusEmergency: 'ತುರ್ತು',
    statusUrgent: 'ಗಮನ ಅಗತ್ಯವಿದೆ',
    statusRoutine: 'ಸಾಮಾನ್ಯ',
    patientHistory: 'ರೋಗಿಯ ದಾಖಲೆ',
    registrationDate: 'ನೋಂದಣಿ ದಿನಾಂಕ',
    previousConsultations: 'ಹಿಂದಿನ ಸಮಾಲೋಚನೆಗಳು',
    symptoms: 'ಲಕ್ಷಣಗಳು',
    referrals: 'ರೆಫರಲ್‌ಗಳು',
    notes: 'ಟಿಪ್ಪಣಿಗಳು',
    yearsOld: 'ವರ್ಷಗಳು',
    noPatientsFound: 'ಯಾವ ರೋಗಿಯೂ ಸಿಗಲಿಲ್ಲ',
    basicInfo: 'ಮೂಲಭೂತ ಮಾಹಿತಿ',
    currentStatus: 'ಪ್ರಸ್ತುತ ಸ್ಥಿತಿ',
    lastVisitLabel: 'ಕೊನೆಯ ಭೇಟಿ',
    editPatientTitle: 'ರೋಗಿಯ ಮಾಹಿತಿ ಮತ್ತು ಲಕ್ಷಣಗಳನ್ನು ಸಂಪಾದಿಸಿ',
    editSymptomsLabel: 'ಲಕ್ಷಣಗಳನ್ನು ಸಂಪಾದಿಸಿ',
    updatePatientBtn: 'ಬದಲಾವಣೆಗಳನ್ನು ಸಂಗ್ರಹಿಸಿ',
    patientUpdatedSnackbar: 'ರೋಗಿಯ ವಿವರಗಳು ಮತ್ತು ಲಕ್ಷಣಗಳನ್ನು ಯಶಸ್ವಿಯಾಗಿ ನವೀಕರಿಸಲಾಗಿದೆ!',
    noSymptomsRecorded: 'ಯಾವುದೇ ಲಕ್ಷಣಗಳು ದಾಖಲಾಗಿಲ್ಲ',

    followupTitle: 'ಇಂದಿನ ಫಾಲೋ-ಅಪ್ ಕಾರ್ಯಗಳು',
    markVisited: 'ಭೇಟಿ ಪೂರ್ಣಗೊಂಡಿದೆ',
    callPatient: 'ಕರೆ ಮಾಡಿ',
    completed: 'ಪೂರ್ಣಗೊಂಡಿದೆ',
    allFollowupsDone: 'ಇಂದಿನ ಎಲ್ಲಾ ಫಾಲೋ-ಅಪ್‌ಗಳು ಪೂರ್ಣಗೊಂಡಿವೆ!',
    undo: 'ಪೂರ್ವಸ್ಥಿತಿಗೆ ತನ್ನಿ',

    guideTitle: 'ಆಫ್‌ಲೈನ್ ಕ್ಲಿನಿಕಲ್ ಮಾರ್ಗದರ್ಶಿ',
    step: 'ಹಂತ',
    stepOf: 'ರ',
    guidePrev: '← ಹಿಂದಿನ',
    guideNext: 'ಮುಂದಿನ →',
    offlineBannerText: 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ — ಇಂಟರ್ನೆಟ್ ಸಂಪರ್ಕ ಲಭ್ಯವಿಲ್ಲ',

    ashaWorkerRole: 'ಆಶಾ ಕಾರ್ಯಕರ್ತೆ (ASHA Worker)',
    ashaWorkerName: 'ಸಾವಿತ್ರಿಬಾಯಿ ಪಾಟೀಲ್',
    subCentreLabel: 'ಉಪ-ಕೇಂದ್ರ (Sub-Centre):',
    phcLabel: 'ಪ್ರಾಥಮಿಕ ಆರೋಗ್ಯ ಕೇಂದ್ರ:',
    mobileLabel: 'ಮೊಬೈಲ್:',
    logoutBtn: 'ಲಾಗಿನ್ ಔಟ್',
    jurisdictionDetails: 'ವ್ಯಾಪ್ತಿ ಮತ್ತು ಆರೋಗ್ಯ ಕೇಂದ್ರ ವಿವರಗಳು',
    coveredPopulation: 'ಆವರಿಸಿದ ಜನಸಂಖ್ಯೆ: 1,250 ಪೌರರು (240 ಕುಟುಂಬಗಳು)',
    systemAndSync: 'ಸಿಸ್ಟಮ್ ಮತ್ತು ಸಿಂಕ್ ಸ್ಥಿತಿ',
    databaseStatus: 'ಡೇಟಾಬೇಸ್ ಸ್ಥಿತಿ',
  },
};
