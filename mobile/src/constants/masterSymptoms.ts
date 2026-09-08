export interface MasterSymptom {
  id: string;
  key: string;
  categoryKey: string;
  icon: string;
  // Multilingual labels for searching and display
  labels: {
    en: string;
    mr: string;
    hi: string;
    kn?: string;
  };
  aliases?: string[];
}

export interface SymptomCategory {
  key: string;
  title: {
    en: string;
    mr: string;
    hi: string;
    kn?: string;
  };
  icon: string;
}

export const SYMPTOM_CATEGORIES: SymptomCategory[] = [
  {
    key: 'fever_infection',
    icon: '🌡️',
    title: {
      en: 'Fever & Infection',
      mr: 'ताप आणि संसर्ग',
      hi: 'बुखार और संक्रमण',
      kn: 'ಜ್ವರ ಮತ್ತು ಸೋಂಕು',
    },
  },
  {
    key: 'respiratory',
    icon: '🫁',
    title: {
      en: 'Respiratory',
      mr: 'श्वसन संस्था',
      hi: 'श्वसन संबंधी',
      kn: 'ಉಸಿರಾಟ ವ್ಯವಸ್ಥೆ',
    },
  },
  {
    key: 'neurological',
    icon: '🧠',
    title: {
      en: 'Neurological',
      mr: 'मज्जासंस्था / चेतासंस्था',
      hi: 'तंत्रिका संबंधी',
      kn: 'ನರಮಂಡಲ',
    },
  },
  {
    key: 'gastrointestinal',
    icon: '🤢',
    title: {
      en: 'Gastrointestinal',
      mr: 'पचनसंस्था / पोट',
      hi: 'पाचन संबंधी',
      kn: 'ಜೀರ್ಣಾಂಗ ವ್ಯವಸ್ಥೆ',
    },
  },
  {
    key: 'maternal_pregnancy',
    icon: '🤰',
    title: {
      en: 'Maternal / Pregnancy',
      mr: 'माता आणि गर्भावस्था',
      hi: 'गर्भावस्था संबंधी',
      kn: 'ಗರ್ಭಧಾರಣೆ ಮತ್ತು ತಾಯಿ',
    },
  },
  {
    key: 'paediatric',
    icon: '👶',
    title: {
      en: 'Paediatric (under 5)',
      mr: 'बालक (५ वर्षांखालील)',
      hi: 'बाल रोग (5 वर्ष से कम)',
      kn: 'ಮಕ್ಕಳ ಆರೋಗ್ಯ (5 ವರ್ಷದೊಳಗಿನ)',
    },
  },
  {
    key: 'chronic_other',
    icon: '💊',
    title: {
      en: 'Chronic / Other',
      mr: 'दीर्घकालीन / इतर',
      hi: 'दीर्घकालिक / अन्य',
      kn: 'ದೀರ್ಘಕಾಲದ / ಇತರ',
    },
  },
];

export const MASTER_SYMPTOMS: MasterSymptom[] = [
  // Fever & Infection
  {
    id: 'fever',
    key: 'fever',
    categoryKey: 'fever_infection',
    icon: '🌡️',
    labels: { en: 'fever', mr: 'ताप', hi: 'बुखार', kn: 'ಜ್ವರ' },
    aliases: ['body warm', 'temperature', 'ताप आला आहे'],
  },
  {
    id: 'high_fever',
    key: 'high_fever',
    categoryKey: 'fever_infection',
    icon: '🔥',
    labels: { en: 'high fever', mr: 'तीव्र ताप', hi: 'तेज बुखार', kn: 'ಹೆಚ್ಚಿನ ಜ್ವರ' },
    aliases: ['high temperature', 'खूप ताप'],
  },
  {
    id: 'chills',
    key: 'chills',
    categoryKey: 'fever_infection',
    icon: '🥶',
    labels: { en: 'chills', mr: 'थंडी वाजणे', hi: 'कंपकंपी', kn: 'ಚಳಿ' },
    aliases: ['shivering', 'थंडी भरून येणे'],
  },
  {
    id: 'sweating',
    key: 'sweating',
    categoryKey: 'fever_infection',
    icon: '💧',
    labels: { en: 'sweating', mr: 'घाम येणे', hi: 'पसीना आना', kn: 'ಮೈ ಬೆವರುವುದು' },
  },
  {
    id: 'body_ache',
    key: 'body_ache',
    categoryKey: 'fever_infection',
    icon: '🩹',
    labels: { en: 'body ache', mr: 'अंगदुखी', hi: 'बदन दर्द', kn: 'ಮೈಕೈ ನೋವು' },
    aliases: ['muscle pain', 'अंग दुखणे'],
  },
  {
    id: 'fatigue',
    key: 'fatigue',
    categoryKey: 'fever_infection',
    icon: '😫',
    labels: { en: 'fatigue', mr: 'थकवा', hi: 'थकान', kn: 'ಆಯಾಸ' },
  },
  {
    id: 'weakness',
    key: 'weakness',
    categoryKey: 'fever_infection',
    icon: '💪',
    labels: { en: 'weakness', mr: 'अशक्तपणा', hi: 'कमज़ोरी', kn: 'ನಿಸ್ಸತ್ವ' },
  },
  {
    id: 'loss_of_appetite',
    key: 'loss_of_appetite',
    categoryKey: 'fever_infection',
    icon: '🍽️',
    labels: { en: 'loss of appetite', mr: 'भूक न लागणे', hi: 'भूख न लगना', kn: 'ಹಸಿವಾಗದಿರುವುದು' },
  },

  // Respiratory
  {
    id: 'breathlessness',
    key: 'breathlessness',
    categoryKey: 'respiratory',
    icon: '🫁',
    labels: { en: 'breathlessness', mr: 'श्वास घेण्यास त्रास', hi: 'सांस लेने में तकलीफ', kn: 'ಉಸಿರಾಟದ ತೊಂದರೆ' },
    aliases: ['short of breath', 'श्वास गुदमरणे'],
  },
  {
    id: 'shortness_of_breath',
    key: 'shortness_of_breath',
    categoryKey: 'respiratory',
    icon: '🫁',
    labels: { en: 'shortness of breath', mr: 'दम लागणे', hi: 'सांस फूलना', kn: 'ಉಸಿರು ಕಟ್ಟುವುದು' },
  },
  {
    id: 'rapid_breathing',
    key: 'rapid_breathing',
    categoryKey: 'respiratory',
    icon: '⚡',
    labels: { en: 'rapid breathing', mr: 'जलद श्वासोच्छवास', hi: 'तेज़ सांस चलना', kn: 'ವೇಗದ ಉಸಿರಾಟ' },
  },
  {
    id: 'wheezing',
    key: 'wheezing',
    categoryKey: 'respiratory',
    icon: '🌬️',
    labels: { en: 'wheezing', mr: 'घरघर वाजणे', hi: 'सायं-सायं की आवाज', kn: 'ಸೀಟಿ ಶಬ್ದ ಉಸಿರಾಟ' },
  },
  {
    id: 'cough',
    key: 'cough',
    categoryKey: 'respiratory',
    icon: '😷',
    labels: { en: 'cough', mr: 'खोकला', hi: 'खांसी', kn: 'ಕೆಮ್ಮು' },
  },
  {
    id: 'chest_pain',
    key: 'chest_pain',
    categoryKey: 'respiratory',
    icon: '💔',
    labels: { en: 'chest pain', mr: 'छातीत दुखणे', hi: 'सीने में दर्द', kn: 'ಎದೆ ನೋವು' },
  },
  {
    id: 'chest_tightness',
    key: 'chest_tightness',
    categoryKey: 'respiratory',
    icon: '🫀',
    labels: { en: 'chest tightness', mr: 'छातीवर दडपण', hi: 'छाती में जकड़न', kn: 'ಎದೆ ಬಿಗಿತ' },
  },

  // Neurological
  {
    id: 'headache',
    key: 'headache',
    categoryKey: 'neurological',
    icon: '🤕',
    labels: { en: 'headache', mr: 'डोकेदुखी', hi: 'सिरदर्द', kn: 'ತಲೆನೋವು' },
  },
  {
    id: 'severe_headache',
    key: 'severe_headache',
    categoryKey: 'neurological',
    icon: '💥',
    labels: { en: 'severe headache', mr: 'तीव्र डोकेदुखी', hi: 'तेज सिरदर्द', kn: 'ತೀವ್ರ ತಲೆನೋವು' },
  },
  {
    id: 'dizziness',
    key: 'dizziness',
    categoryKey: 'neurological',
    icon: '💫',
    labels: { en: 'dizziness', mr: 'चक्कर येणे', hi: 'चक्कर आना', kn: 'ತಲೆಸುತ್ತು' },
  },
  {
    id: 'fainting',
    key: 'fainting',
    categoryKey: 'neurological',
    icon: '😵',
    labels: { en: 'fainting', mr: 'पडणे / चक्कर मारणे', hi: 'बेहोश होना', kn: 'ಮೂರ್ಛೆ' },
  },
  {
    id: 'convulsions',
    key: 'convulsions',
    categoryKey: 'neurological',
    icon: '⚡',
    labels: { en: 'convulsions', mr: 'झटके येणे (फिट्स)', hi: 'दौरे पड़ना', kn: 'ಫಿಟ್ಸ್' },
    aliases: ['fits', 'seizures', 'आक्षेप'],
  },
  {
    id: 'seizures',
    key: 'seizures',
    categoryKey: 'neurological',
    icon: '🌩️',
    labels: { en: 'seizures', mr: 'मिरगी / फिट्स', hi: 'मिर्गी के दौरे', kn: 'ಅಪಸ್ಮಾರ' },
  },
  {
    id: 'confusion',
    key: 'confusion',
    categoryKey: 'neurological',
    icon: '🌀',
    labels: { en: 'confusion', mr: 'भांबावून जाणे', hi: 'भ्रम होना', kn: 'ಗೊಂದಲ' },
  },
  {
    id: 'blurred_vision',
    key: 'blurred_vision',
    categoryKey: 'neurological',
    icon: '👓',
    labels: { en: 'blurred vision', mr: 'धूसर दिसणे', hi: 'धुंधला दिखना', kn: 'ಮಂಜು ಮಂಜು ದೃಷ್ಟಿ' },
  },

  // Gastrointestinal
  {
    id: 'vomiting',
    key: 'vomiting',
    categoryKey: 'gastrointestinal',
    icon: '🤢',
    labels: { en: 'vomiting', mr: 'उलटी', hi: 'उल्टी', kn: 'ವಾಂತಿ' },
  },
  {
    id: 'nausea',
    key: 'nausea',
    categoryKey: 'gastrointestinal',
    icon: '🤮',
    labels: { en: 'nausea', mr: 'मळमळ', hi: 'जी मिचलाना', kn: 'ವಾಕರಿಕೆ' },
  },
  {
    id: 'diarrhoea',
    key: 'diarrhoea',
    categoryKey: 'gastrointestinal',
    icon: '🚽',
    labels: { en: 'diarrhoea', mr: 'हागवण / जुलाब', hi: 'दस्त', kn: 'ಭೇದಿ' },
    aliases: ['loose motion', 'loose stools'],
  },
  {
    id: 'abdominal_pain',
    key: 'abdominal_pain',
    categoryKey: 'gastrointestinal',
    icon: '😣',
    labels: { en: 'abdominal pain', mr: 'पोटदुखी', hi: 'पेट दर्द', kn: 'ಹೊಟ್ಟೆ ನೋವು' },
  },
  {
    id: 'bloating',
    key: 'bloating',
    categoryKey: 'gastrointestinal',
    icon: '🎈',
    labels: { en: 'bloating', mr: 'पोट फुगणे', hi: 'पेट फूलना', kn: 'ಹೊಟ್ಟೆ ಉಬ್ಬರ' },
  },
  {
    id: 'constipation',
    key: 'constipation',
    categoryKey: 'gastrointestinal',
    icon: '🪵',
    labels: { en: 'constipation', mr: 'बद्धकोष्ठता', hi: 'कब्ज', kn: 'ಮಲಬದ್ಧತೆ' },
  },
  {
    id: 'blood_in_stool',
    key: 'blood_in_stool',
    categoryKey: 'gastrointestinal',
    icon: '🩸',
    labels: { en: 'blood in stool', mr: 'शौचातून रक्त पडणे', hi: 'मल में खून', kn: 'ಮಲದಲ್ಲಿ ರಕ್ತ' },
  },

  // Maternal / Pregnancy
  {
    id: 'swollen_feet',
    key: 'swollen_feet',
    categoryKey: 'maternal_pregnancy',
    icon: '🦶',
    labels: { en: 'swollen feet', mr: 'पायांना सूज', hi: 'पैरों में सूजन', kn: 'ಕಾಲು ಊತ' },
  },
  {
    id: 'swollen_hands',
    key: 'swollen_hands',
    categoryKey: 'maternal_pregnancy',
    icon: '🖐️',
    labels: { en: 'swollen hands', mr: 'हातांना सूज', hi: 'हाथों में सूजन', kn: 'ಕೈ ಊತ' },
  },
  {
    id: 'reduced_fetal_movement',
    key: 'reduced_fetal_movement',
    categoryKey: 'maternal_pregnancy',
    icon: '👶',
    labels: { en: 'reduced fetal movement', mr: 'बाळाची हालचाल कमी होणे', hi: 'शिशु की हलचल कम होना', kn: 'ಮಗುವಿನ ಚಲನೆ ಕಡಿಮೆಯಾಗುವುದು' },
  },
  {
    id: 'bleeding',
    key: 'bleeding',
    categoryKey: 'maternal_pregnancy',
    icon: '🩸',
    labels: { en: 'bleeding', mr: 'रक्तस्राव', hi: 'रक्तस्राव', kn: 'ರಕ್ತಸ್ರಾವ' },
  },
  {
    id: 'contractions',
    key: 'contractions',
    categoryKey: 'maternal_pregnancy',
    icon: '⏱️',
    labels: { en: 'contractions', mr: 'प्रसूती कळा', hi: 'प्रसव पीड़ा', kn: 'ಹೆರಿಗೆ ನೋವು' },
  },
  {
    id: 'high_bp_symptoms',
    key: 'high_bp_symptoms',
    categoryKey: 'maternal_pregnancy',
    icon: '📈',
    labels: { en: 'high BP symptoms', mr: 'उच्च रक्तदाबाची लक्षणे', hi: 'उच्च रक्तचाप के लक्षण', kn: 'ಹೆಚ್ಚಿನ ರಕ್ತದೊತ್ತಡದ ಲಕ್ಷಣಗಳು' },
  },
  {
    id: 'blurred_vision_pregnancy',
    key: 'blurred_vision_pregnancy',
    categoryKey: 'maternal_pregnancy',
    icon: '👁️',
    labels: { en: 'blurred vision in pregnancy', mr: 'गरोदरपणात धुसर दिसणे', hi: 'गर्भावस्था में धुंधला दिखना', kn: 'ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ಮಂಜು ದೃಷ್ಟಿ' },
  },

  // Paediatric (under 5)
  {
    id: 'not_feeding',
    key: 'not_feeding',
    categoryKey: 'paediatric',
    icon: '🍼',
    labels: { en: 'not feeding', mr: 'दूध न पिणे', hi: 'दूध न पीना', kn: 'ಹಾಲು ಕುಡಿಯದಿರುವುದು' },
  },
  {
    id: 'unable_to_drink',
    key: 'unable_to_drink',
    categoryKey: 'paediatric',
    icon: '🥤',
    labels: { en: 'unable to drink', mr: 'काहीही न पिऊ शकणे', hi: 'पानी/तरल न पी पाना', kn: 'ಕುಡಿಯಲು ಸಾಧ್ಯವಾಗದಿರುವುದು' },
  },
  {
    id: 'vomiting_everything',
    key: 'vomiting_everything',
    categoryKey: 'paediatric',
    icon: '🤮',
    labels: { en: 'vomiting everything', mr: 'खालेले सर्व ओकणे', hi: 'सब कुछ उल्टी कर देना', kn: 'ತಿಂದದ್ದನ್ನೆಲ್ಲ ವಾಂತಿ ಮಾಡುವುದು' },
  },
  {
    id: 'convulsions_in_child',
    key: 'convulsions_in_child',
    categoryKey: 'paediatric',
    icon: '⚡',
    labels: { en: 'convulsions in child', mr: 'बालकाला झटके येणे', hi: 'बच्चे को दौरे पड़ना', kn: 'ಮಗುವಿನಲ್ಲಿ ಫಿಟ್ಸ್' },
  },
  {
    id: 'fast_breathing_child',
    key: 'fast_breathing_child',
    categoryKey: 'paediatric',
    icon: '🫁',
    labels: { en: 'fast breathing in child', mr: 'बालकाचा जलद श्वास', hi: 'बच्चे की तेज़ सांस चलना', kn: 'ಮಗುವಿನಲ್ಲಿ ವೇಗದ ಉಸಿರಾಟ' },
  },
  {
    id: 'chest_indrawing',
    key: 'chest_indrawing',
    categoryKey: 'paediatric',
    icon: '📉',
    labels: { en: 'chest indrawing', mr: 'छाती आत ओढली जाणे', hi: 'छाती का अंदर धंसना', kn: 'ಎದೆ ಒಳಕ್ಕೆ ಎಳೆಯುವುದು' },
  },
  {
    id: 'very_sleepy_unconscious',
    key: 'very_sleepy_unconscious',
    categoryKey: 'paediatric',
    icon: '😴',
    labels: { en: 'very sleepy or unconscious', mr: 'अतिशय सुस्त किंवा सुद्ध हरपणे', hi: 'बहुत सुस्त या बेहोश', kn: 'ಅತಿಯಾದ ತೂಕಡಿಕೆ ಅಥವಾ ಪ್ರಜ್ಞೆ ತಪ್ಪುವುದು' },
  },
  {
    id: 'severe_malnutrition',
    key: 'severe_malnutrition',
    categoryKey: 'paediatric',
    icon: '⚖️',
    labels: { en: 'severe malnutrition', mr: 'तीव्र कुपोषण', hi: 'गंभीर कुपोषण', kn: 'ತೀವ್ರ ಅಪೌಷ್ಟಿಕತೆ' },
  },

  // Chronic / Other
  {
    id: 'palpitations',
    key: 'palpitations',
    categoryKey: 'chronic_other',
    icon: '💓',
    labels: { en: 'palpitations', mr: 'छाती धडधडणे', hi: 'दिल की धड़कन तेज होना', kn: 'ಹೃದಯ ಬಡಿತ' },
  },
  {
    id: 'high_blood_sugar_symptoms',
    key: 'high_blood_sugar_symptoms',
    categoryKey: 'chronic_other',
    icon: '🩸',
    labels: { en: 'high blood sugar symptoms', mr: 'साखर वाढल्याची लक्षणे', hi: 'हाई ब्लड शुगर के लक्षण', kn: 'ಹೆಚ್ಚಿನ ಸಕ್ಕರೆ ಪ್ರಮಾಣ' },
  },
  {
    id: 'excessive_thirst',
    key: 'excessive_thirst',
    categoryKey: 'chronic_other',
    icon: '🥛',
    labels: { en: 'excessive thirst', mr: 'अतिशय तहान लागणे', hi: 'अत्यधिक प्यास लगना', kn: 'ಅತಿಯಾದ ಬಾಯಾರಿಕೆ' },
  },
  {
    id: 'frequent_urination',
    key: 'frequent_urination',
    categoryKey: 'chronic_other',
    icon: '🚽',
    labels: { en: 'frequent urination', mr: 'वारंवार लघवी होणे', hi: 'बार-बार पेशाब आना', kn: 'ಪದೇ ಪದೇ ಮೂತ್ರ ವಿಸರ್ಜನೆ' },
  },
  {
    id: 'joint_pain',
    key: 'joint_pain',
    categoryKey: 'chronic_other',
    icon: '🦴',
    labels: { en: 'joint pain', mr: 'सांधेदुखी', hi: 'जोड़ों का दर्द', kn: 'ಕೀಲು ನೋವು' },
  },
  {
    id: 'back_pain',
    key: 'back_pain',
    categoryKey: 'chronic_other',
    icon: '🧍',
    labels: { en: 'back pain', mr: 'पाठदुखी / कंबरदुखी', hi: 'पीठ दर्द', kn: 'ಬೆನ್ನು ನೋವು' },
  },
  {
    id: 'skin_rash',
    key: 'skin_rash',
    categoryKey: 'chronic_other',
    icon: '🔴',
    labels: { en: 'skin rash', mr: 'त्वचेवर लाल पुरळ', hi: 'त्वचा पर चकत्ते', kn: 'ಚರ್ಮದ ದದ್ದುಗಳು' },
  },
  {
    id: 'yellow_eyes',
    key: 'yellow_eyes',
    categoryKey: 'chronic_other',
    icon: '👀',
    labels: { en: 'yellow eyes', mr: 'डोळे पिवळे होणे (काविळ)', hi: 'पीली आंखें (पीलिया)', kn: 'ಹಳದಿ ಕಣ್ಣುಗಳು (ಕಾಮಾಲೆ)' },
  },
  {
    id: 'swelling_in_body',
    key: 'swelling_in_body',
    categoryKey: 'chronic_other',
    icon: '🎈',
    labels: { en: 'swelling in body', mr: 'अंगावर सूज', hi: 'शरीर में सूजन', kn: 'ದೇಹದಲ್ಲಿ ಊತ' },
  },
];
