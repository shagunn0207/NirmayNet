export interface MasterSymptom {
  id: string;
  key: string;
  categoryKey: string;
  icon: string;
  labels: {
    en: string;
    mr: string;
    hi: string;
    kn?: string;
  };
  aliases?: string[];
  urgency?: 'EMERGENCY' | 'URGENT' | 'ROUTINE';
  triageHelp?: {
    guidance: {
      en: string;
      mr: string;
      hi: string;
      kn?: string;
    };
    firstAid: {
      en: string[];
      mr: string[];
      hi: string[];
      kn?: string[];
    };
  };
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
    title: { en: 'Fever & Infection', mr: 'ताप आणि संसर्ग', hi: 'बुखार और संक्रमण', kn: 'ಜ್ವರ ಮತ್ತು ಸೋಂಕು' },
  },
  {
    key: 'respiratory',
    icon: '🫁',
    title: { en: 'Respiratory', mr: 'श्वसन संस्था', hi: 'श्वसन संबंधी', kn: 'ಉಸಿರಾಟ ವ್ಯವಸ್ಥೆ' },
  },
  {
    key: 'cardiovascular',
    icon: '🫀',
    title: { en: 'Cardiovascular / Heart', mr: 'हृदय आणि रक्तवाहिन्या', hi: 'हृदय एवं रक्त वाहिकाएं', kn: 'ಹೃದಯ ಮತ್ತು ರಕ್ತನಾಳಗಳು' },
  },
  {
    key: 'neurological',
    icon: '🧠',
    title: { en: 'Neurological / Brain', mr: 'मज्जासंस्था / चेतासंस्था', hi: 'तंत्रिका संबंधी', kn: 'ನರಮಂಡಲ' },
  },
  {
    key: 'gastrointestinal',
    icon: '🤢',
    title: { en: 'Gastrointestinal / Stomach', mr: 'पचनसंस्था / पोट', hi: 'पाचन संबंधी', kn: 'ಜೀರ್ಣಾಂಗ ವ್ಯವಸ್ಥೆ' },
  },
  {
    key: 'maternal_pregnancy',
    icon: '🤰',
    title: { en: 'Maternal / Pregnancy', mr: 'माता आणि गर्भावस्था', hi: 'गर्भावस्था संबंधी', kn: 'ಗರ್ಭಧಾರಣೆ ಮತ್ತು ತಾಯಿ' },
  },
  {
    key: 'paediatric',
    icon: '👶',
    title: { en: 'Paediatric (under 5)', mr: 'बालक (५ वर्षांखालील)', hi: 'बाल रोग (5 वर्ष से कम)', kn: 'ಮಕ್ಕಳ ಆರೋಗ್ಯ (5 ವರ್ಷದೊಳಗಿನ)' },
  },
  {
    key: 'trauma_injuries',
    icon: '🩹',
    title: { en: 'Trauma, Bites & Injuries', mr: 'इजा, सर्पदंश आणि जखमा', hi: 'चोट, दंश और दुर्घटनाएं', kn: 'ಗಾಯಗಳು ಮತ್ತು ಕಡಿತಗಳು' },
  },
  {
    key: 'eye_ent_dental',
    icon: '👁️',
    title: { en: 'Eye, ENT & Dental', mr: 'डोळे, नाक, कान, घसा व दात', hi: 'आंख, कान, नाक, गला और दांत', kn: 'ಕಣ್ಣು, ಕಿವಿ, ಮೂಗು, ಗಂಟಲು' },
  },
  {
    key: 'dermatology_allergic',
    icon: '🩺',
    title: { en: 'Skin & Allergy', mr: 'त्वचारोग आणि ॲलर्जी', hi: 'त्वचा और एलर्जी', kn: 'ಚರ್ಮ ಮತ್ತು ಅಲರ್ಜಿ' },
  },
  {
    key: 'chronic_other',
    icon: '💊',
    title: { en: 'Chronic & Endocrine', mr: 'दीर्घकालीन व इतर आजार', hi: 'दीर्घकालिक और अन्य रोग', kn: 'ದೀರ್ಘಕಾಲದ രോഗಗಳು' },
  },
];

export const COMMON_QUICK_SYMPTOM_KEYS = [
  'high_fever',
  'fever_with_rigors',
  'sore_throat_fever',
  'breathlessness',
  'severe_diarrhoea_vomiting',
  'chest_pain_left_arm',
  'convulsions',
  'snake_bite',
];

export const getCommonQuickSymptoms = (): MasterSymptom[] => {
  return COMMON_QUICK_SYMPTOM_KEYS.map(key => MASTER_SYMPTOMS.find(ms => ms.key === key)).filter(Boolean) as MasterSymptom[];
};

export const MASTER_SYMPTOMS: MasterSymptom[] = [
  {
    "id": "high_fever",
    "key": "high_fever",
    "categoryKey": "fever_infection",
    "icon": "🔥",
    "labels": {
      "en": "High Fever (>102°F)",
      "mr": "तीव्र ताप (>१०२°F)",
      "hi": "तेज़ बुखार (>102°F)",
      "kn": "ಹೆಚ್ಚಿನ ಜ್ವರ (>102°F)"
    },
    "aliases": [
      "pyrexia",
      "tap",
      "bukhar"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "High fever requires wet sponging with room-temperature water and Paracetamol.",
        "mr": "तीव्र तापासाठी कपड्याने अंग पुसा आणि पॅरासिटामॉल द्या.",
        "hi": "तेज़ बुखार में साधारण पानी से सूती कपड़े की पट्टी करें और पैरासिटामोल दें।",
        "kn": "ಸಾಧಾರಣ ನೀರಿನಿಂದ ಮೈ ಒರೆಸಿ ಮತ್ತು ಪ್ಯಾರಾಸಿಟಮೋಲ್ ನೀಡಿ."
      },
      "firstAid": {
        "en": [
          "Apply tepid water sponge to forehead and limbs.",
          "Give oral fluids/ORS.",
          "Refer to PHC if fever persists >48h."
        ],
        "mr": [
          "कपाळावर व अंगावर ओल्या कपड्याची पट्टी ठेवा.",
          "भरपूर पाणी किंवा ORS प्यायला द्या.",
          "४८ तासांपेक्षा जास्त ताप असल्यास PHC ला दाखवा."
        ],
        "hi": [
          "माथे और शरीर पर ठंडे/साधारण पानी की पट्टी रखें।",
          "ORS या तरल पदार्थ दें।",
          "48 घंटे से अधिक बुखार रहने पर PHC ले जाएं।"
        ],
        "kn": [
          "ಹಣೆ ಮತ್ತು ಮೈಮೇಲೆ ಒದ್ದೆ ಬಟ್ಟೆಯಿಡಿ.",
          "ಸಾಕಷ್ಟು ನೀರು/ORS ನೀಡಿ.",
          "48 ಗಂಟೆಗಳಿಗಿಂತ ಹೆಚ್ಚು ಜ್ವರವಿದ್ದರೆ PHC ಸಂಪರ್ಕಿಸಿ."
        ]
      }
    }
  },
  {
    "id": "fever_with_rigors",
    "key": "fever_with_rigors",
    "categoryKey": "fever_infection",
    "icon": "🥶",
    "labels": {
      "en": "Fever with Chills & Rigors",
      "mr": "थंडी वाजून ताप येणे",
      "hi": "कंपकंपी के साथ बुखार",
      "kn": "ಚಳಿಯೊಂದಿಗೆ ಜ್ವರ"
    },
    "aliases": [
      "malaria suspected",
      "chills",
      "thandi tap"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Suspected Malaria / Typhoid. Conduct RDT blood test for Malaria immediately.",
        "mr": "मलेरिया/टायफॉईडची शक्यता. तातडीने मलेरियाची रॅपिड रक्त तपासणी (RDT) करा.",
        "hi": "मलेरिया/टाइफाइड की संभावना। तुरंत मलेरिया RDT रक्त जांच करें।",
        "kn": "ಮಲೇರಿಯಾ ಸಂಶಯ. ತಕ್ಷಣ RDT ರಕ್ತ ಪರೀಕ್ಷೆ ಮಾಡಿ."
      },
      "firstAid": {
        "en": [
          "Cover patient warmly during chill phase.",
          "Collect blood slide/RDT for Malaria.",
          "Provide Paracetamol for fever."
        ],
        "mr": [
          "थंडी वाजत असताना पांघरूण द्या.",
          "मलेरियासाठी रक्ताचा नमुना / RDT करा.",
          "तापासाठी पॅरासिटामॉल द्या."
        ],
        "hi": [
          "कंपकंपी के दौरान गर्म कपड़ा ओढ़ाएं।",
          "मलेरिया के लिए स्लाइड/RDT जांच करें।",
          "बुखार के लिए पैरासिटामोल दें।"
        ],
        "kn": [
          "ಚಳಿಯಿದ್ದಾಗ ಬೆಚ್ಚಗಿನ ಹೊದಿಕೆ ಹಾಕಿ.",
          "ಮಲೇರಿಯಾ RDT ಪರೀಕ್ಷೆ ಮಾಡಿ.",
          "ಪ್ಯಾರಾಸಿಟಮೋಲ್ ನೀಡಿ."
        ]
      }
    }
  },
  {
    "id": "fever_with_rash",
    "key": "fever_with_rash",
    "categoryKey": "fever_infection",
    "icon": "🔴",
    "labels": {
      "en": "Fever with Skin Rash / Petechiae",
      "mr": "तापासोबत त्वचेवर पुरळ / लाल चट्टे",
      "hi": "बुखार के साथ चकत्ते",
      "kn": "ಜ್ವರದೊಂದಿಗೆ ಚರ್ಮದ ದದ್ದು"
    },
    "aliases": [
      "dengue rash",
      "measles",
      "chickenpox",
      "purpura"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "High suspicion of Dengue / Meningococcemia / Measles. Monitor for bleeding signs.",
        "mr": "डेन्ग्यू किंवा गोवर संसर्गाची दाट शक्यता. रक्तस्रावाची लक्षणे तपासा.",
        "hi": "डेंगू या खसरा की गंभीर संभावना। रक्तस्राव के लक्षणों पर नज़र रखें।",
        "kn": "ಡೆಂಗ್ಯೂ ಅಥವಾ ದಡಾರ ಸಂಶಯ. ರಕ್ತಸ್ರಾವದ ಲಕ್ಷಣಗಳನ್ನು ಗಮನಿಸಿ."
      },
      "firstAid": {
        "en": [
          "Do NOT give Aspirin or Ibuprofen (causes bleeding). Give Paracetamol only.",
          "Check for bleeding from gums or nose.",
          "Transport immediately to PHC/Hospital."
        ],
        "mr": [
          "ॲस्पिरिन किंवा आयब्युप्रोफेन देऊ नका (रक्तस्राव वाढतो). फक्त पॅरासिटामॉल द्या.",
          "हिरड्या किंवा नाकातून रक्तस्राव तपासा.",
          "तातडीने PHC मध्ये न्या."
        ],
        "hi": [
          "एस्पिरिन या इबूप्रोफेन बिल्कुल न दें (रक्तस्राव का खतरा)। केवल पैरासिटामोल दें।",
          "मसूड़ों या नाक से खून आने की जांच करें।",
          "तुरंत PHC ले जाएं।"
        ],
        "kn": [
          "ಆಸ್ಪಿರಿನ್ ಕೊಡಬೇಡಿ. ಪ್ಯಾರಾಸಿಟಮೋಲ್ ಮಾತ್ರ ನೀಡಿ.",
          "ಮೂಗಿನಿಂದ ರಕ್ತ ಬರುವುದನ್ನು ಗಮನಿಸಿ.",
          "ತಕ್ಷಣ PHC ಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "fever_with_stiff_neck",
    "key": "fever_with_stiff_neck",
    "categoryKey": "fever_infection",
    "icon": "🧠",
    "labels": {
      "en": "Fever with Stiff Neck & Headache",
      "mr": "ताप, मान ताठ होणे व तीव्र डोकेदुखी",
      "hi": "बुखार के साथ गर्दन में अकड़न",
      "kn": "ಜ್ವರ ಮತ್ತು ಕುತ್ತಿಗೆ ಬಿಗಿತ"
    },
    "aliases": [
      "meningitis",
      "encephalitis",
      "man tath hoshil"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Suspected Meningitis / Brain Infection. Critical emergency requiring parenteral antibiotics.",
        "mr": "मेंदूज्वर (मॅनिंजायटिस) ची शक्यता. अत्यंत तातडीची वैद्यकीय आणीबाणी.",
        "hi": "दिमागी बुखार (मेनिन्जाइटिस) की संभावना। अति गंभीर आपात स्थिति।",
        "kn": "ಮೆದುಳು ಜ್ವರದ (ಮೆನಿಂಜೈಟಿಸ್) ಸಂಶಯ. ಅತ್ಯಂತ ತೀವ್ರ ತುರ್ತು ಸ್ಥಿತಿ."
      },
      "firstAid": {
        "en": [
          "Keep patient in quiet dim room.",
          "Do not elevate head sharply.",
          "Rush to District Hospital in 108 Ambulance."
        ],
        "mr": [
          "रुग्णाला शांत व अंधाऱ्या खोलीत ठेवा.",
          "मान जास्त हलवू नका.",
          "१०८ रुग्णवाहिकेने त्वरित जिल्हा रुग्णालयात न्या."
        ],
        "hi": [
          "मरीज़ को शांत और शांत कमरे में रखें।",
          "गर्दन अत्यधिक न मोड़ें।",
          "108 एम्बुलेंस से तुरंत जिला अस्पताल ले जाएं।"
        ],
        "kn": [
          "ಶಾಂತ ವಾತಾವರಣದಲ್ಲಿರಿಸಿ.",
          "ತಕ್ಷಣ 108 ಆಂಬ್ಯುಲೆನ್ಸ್‌ನಲ್ಲಿ ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "fever_prolonged",
    "key": "fever_prolonged",
    "categoryKey": "fever_infection",
    "icon": "🗓️",
    "labels": {
      "en": "Prolonged Fever (>7 Days)",
      "mr": "७ दिवसांपेक्षा जास्त काळ ताप",
      "hi": "7 दिनों से अधिक बुखार",
      "kn": "7 ದಿನಗಳಿಗಿಂತ ಹೆಚ್ಚು ಜ್ವರ"
    },
    "aliases": [
      "PUO",
      "typhoid",
      "tuberculosis fever"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Requires full blood workup (Widal, CBC, Sputum AFB) for TB/Typhoid evaluation.",
        "mr": "टायफॉईड किंवा टीबीच्या तपासणीसाठी पूर्ण रक्त व थुंकी चाचणी आवश्यक.",
        "hi": "टीबी/टाइफाइड जांच हेतु रक्त एवं बलगम की जांच आवश्यक।",
        "kn": "ಟಿಬಿ/ಟೈಫಾಯಿಡ್ ಪರೀಕ್ಷೆಗೆ ರಕ್ತ ಮತ್ತು ಕಫ ಪರೀಕ್ಷೆ ಅಗತ್ಯ."
      },
      "firstAid": {
        "en": [
          "Maintain daily temperature chart.",
          "Ensure high calorie/fluid intake.",
          "Schedule PHC lab investigation."
        ],
        "mr": [
          "रोजच्या तापाची नोंद ठेवा.",
          "पोषक आहार व भरपूर द्रव पदार्थ द्या.",
          "PHC मध्ये लॅब तपासणीसाठी पाठवा."
        ],
        "hi": [
          "दैनिक तापमान दर्ज करें।",
          "पौष्टिक आहार और तरल दें।",
          "PHC में लैब जांच करवाएं।"
        ],
        "kn": [
          "ಪ್ರತಿದಿನ ತಾಪಮಾನ ದಾಖಲಿಸಿ.",
          "PHC ಲ್ಯಾಬ್ ಪರೀಕ್ಷೆಗೆ ಕಳುಹಿಸಿ."
        ]
      }
    }
  },
  {
    "id": "night_sweats_weight_loss",
    "key": "night_sweats_weight_loss",
    "categoryKey": "fever_infection",
    "icon": "💧",
    "labels": {
      "en": "Night Sweats & Unexplained Weight Loss",
      "mr": "रात्री घाम येणे व वजन कमी होणे",
      "hi": "रात में पसीना और वजन घटना",
      "kn": "ರಾತ್ರಿ ಬೆವರು ಮತ್ತು ತೂಕ ಇಳಿಕೆ"
    },
    "aliases": [
      "TB symptoms",
      "tuberculosis",
      "weight loss"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Classic Tuberculosis (TB) B-symptoms. Collect 2 sputum samples for CBNAAT test.",
        "mr": "क्षयरोग (TB) ची प्रमुख लक्षणे. CBNAAT तपासणीसाठी २ थुंकी नमुने घ्या.",
        "hi": "टीबी (TB) के प्रमुख लक्षण। CBNAAT जांच के लिए 2 बलगम नमूने लें।",
        "kn": "ಕ್ಷಯರೋಗದ (TB) ಲಕ್ಷಣಗಳು. CBNAAT ಪರೀಕ್ಷೆಗೆ ಕಫ ಮಾದರಿ ಸಂಗ್ರಹಿಸಿ."
      },
      "firstAid": {
        "en": [
          "Provide sputum collection container.",
          "Instruct cough hygiene (cover mouth).",
          "Refer to nearest PHC/NTEP DOTS center."
        ],
        "mr": [
          "थुंकी नमुन्याचा डब्बा द्या.",
          "खोकताना तोंडावर रुमाल ठेवायला सांगा.",
          "जवळच्या PHC/DOTS केंद्रात पाठवा."
        ],
        "hi": [
          "बलगम का डिब्बा दें।",
          "खांसते समय मुंह ढकने को कहें।",
          "निकटतम DOTS केंद्र पर भेजें।"
        ],
        "kn": [
          "ಕಫ ಸಂಗ್ರಹಣಾ ಡಬ್ಬಿ ನೀಡಿ.",
          "DOTS ಕೇಂದ್ರಕ್ಕೆ ಕಳುಹಿಸಿ."
        ]
      }
    }
  },
  {
    "id": "burning_urination_fever",
    "key": "burning_urination_fever",
    "categoryKey": "fever_infection",
    "icon": "🚽",
    "labels": {
      "en": "Fever with Burning Urination (UTI)",
      "mr": "तापासोबत लघवी करताना जळजळ",
      "hi": "बुखार के साथ पेशाब में जलन",
      "kn": "ಜ್ವರದೊಂದಿಗೆ ಮೂತ್ರ ವಿಸರ್ಜನೆಯಲ್ಲಿ ಉರಿ"
    },
    "aliases": [
      "UTI",
      "pyelonephritis",
      "laghavi jaljal"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Suspected Urinary Tract Infection (UTI) / Kidney Infection. Requires urine routine & antibiotics.",
        "mr": "लघवीचा संसर्ग (UTI) किंवा मूत्रपिंड संसर्गाची शक्यता. लघवी तपासणी व औषधे आवश्यक.",
        "hi": "यूरिन इन्फेक्शन (UTI) की संभावना। पेशाब जांच और एंटीबायोटिक आवश्यक।",
        "kn": "ಮೂತ್ರನಾಳದ ಸೋಂಕು (UTI) ಸಂಶಯ. ಮೂತ್ರ ಪರೀಕ್ಷೆ ಅಗತ್ಯ."
      },
      "firstAid": {
        "en": [
          "Encourage drinking 3-4 liters of water daily.",
          "Avoid holding urine.",
          "Refer to PHC for antibiotics prescription."
        ],
        "mr": [
          "दिवसातून ३-४ लिटर पाणी प्यायला सांगा.",
          "लघवी रोखून धरू नका.",
          "औषधांसाठी PHC मध्ये पाठवा."
        ],
        "hi": [
          "दिन में 3-4 लीटर पानी पीएं।",
          "पेशाब न रोकें।",
          "दवाओं के लिए PHC भेजें।"
        ],
        "kn": [
          "ದಿನಕ್ಕೆ 3-4 ಲೀಟರ್ ನೀರು ಕುಡಿಯಿರಿ.",
          "PHC ಗೆ ಕಳುಹಿಸಿ."
        ]
      }
    }
  },
  {
    "id": "sore_throat_fever",
    "key": "sore_throat_fever",
    "categoryKey": "fever_infection",
    "icon": "🗣️",
    "labels": {
      "en": "Fever with Severe Sore Throat / Tonsillitis",
      "mr": "ताप व घसा दुखणे / टॉन्सिल्स",
      "hi": "बुखार और गले में खराश / दर्द",
      "kn": "ಜ್ವರ ಮತ್ತು ಗಂಟಲು ನೋವು"
    },
    "aliases": [
      "pharyngitis",
      "tonsillitis",
      "ghasa dukhne"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Likely Viral Pharyngitis or Bacterial Tonsillitis. Warm salt water gargles recommended.",
        "mr": "व्हायरल संसर्ग किंवा टॉन्सिल्स. कोमट पाण्याच्या गुळण्या करा.",
        "hi": "वायरल इंफेक्शन या टॉन्सिल। गुनगुने पानी से गरारे करें।",
        "kn": "ವೈರಲ್ ಸೋಂಕು. ಉಗುರುಬೆಚ್ಚಗಿನ ಉಪ್ಪು ನೀರಿನಿಂದ ಗಂಟಲು ತೊಳೆಯಿರಿ."
      },
      "firstAid": {
        "en": [
          "Warm salt water gargles 3 times a day.",
          "Give Paracetamol for throat pain.",
          "Avoid cold drinks/ice."
        ],
        "mr": [
          "दिवसातून ३ वेळा कोमट मीठ-पाण्याच्या गुळण्या करा.",
          "दुखण्यासाठी पॅरासिटामॉल द्या.",
          "थंड पदार्थ टाळा."
        ],
        "hi": [
          "दिन में 3 बार गुनगुने नमक पानी से गरारे करें।",
          "दर्द के लिए पैरासिटामोल दें।",
          "ठंडी चीजें न खाएं।"
        ],
        "kn": [
          "ದಿನಕ್ಕೆ 3 ಬಾರಿ ಉಪ್ಪು ನೀರಿನಿಂದ ಗಂಟಲು ತೊಳೆಯಿರಿ.",
          "ಪ್ಯಾರಾಸಿಟಮೋಲ್ ನೀಡಿ."
        ]
      }
    }
  },
  {
    "id": "breathlessness",
    "key": "breathlessness",
    "categoryKey": "respiratory",
    "icon": "🫁",
    "labels": {
      "en": "Severe Breathlessness / Shortness of Breath",
      "mr": "तीव्र श्वास लागणे / दमा",
      "hi": "तेज़ सांस फूलना / सांस लेने में तकलीफ",
      "kn": "ತೀವ್ರ ಉಸಿರಾಟದ ತೊಂದರೆ"
    },
    "aliases": [
      "dyspnea",
      "asthma attack",
      "shwas lagne"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Severe Respiratory Distress. Position sitting upright. Call 108 Ambulance immediately for oxygen.",
        "mr": "तीव्र श्वसन त्रास. रुग्णाला सरळ बसवून ठेवा. ऑक्सिजनसाठी तातडीने १०८ बोलवा.",
        "hi": "गंभीर सांस की समस्या। मरीज को सीधा बैठाएं। तुरंत 108 एम्बुलेंस बुलाएं।",
        "kn": "ತೀವ್ರ ಉಸಿರಾಟದ ತೊಂದರೆ. ರೋಗಿಯನ್ನು ನೆಟ್ಟಗೆ ಕುಳಿತುಕೊಳ್ಳುವಂತೆ ಮಾಡಿ. 108 ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ."
      },
      "firstAid": {
        "en": [
          "Sit patient upright leaning slightly forward.",
          "Administer Salbutamol inhaler/nebulizer if prescribed.",
          "Keep windows open for fresh air."
        ],
        "mr": [
          "रुग्णाला थोडे पुढे झुकवून सरळ बसवा.",
          "इनहेलर किंवा नेब्युलायझर उपलब्ध असल्यास द्या.",
          "खिडक्या उघड्या ठेवा."
        ],
        "hi": [
          "मरीज़ को थोड़ा आगे की ओर झुकाकर बैठाएं।",
          "इन्हेलर/नेबुलाइजर दें यदि उपलब्ध हो।",
          "ताजी हवा के लिए खिड़कियां खोलें।"
        ],
        "kn": [
          "ರೋಗಿಯನ್ನು ಕುಳಿತುಕೊಳ್ಳುವಂತೆ ಮಾಡಿ.",
          "ಇನ್ಹೇಲರ್ ನೀಡಿ.",
          "108 ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ."
        ]
      }
    }
  },
  {
    "id": "cough_with_blood",
    "key": "cough_with_blood",
    "categoryKey": "respiratory",
    "icon": "🩸",
    "labels": {
      "en": "Coughing Up Blood (Hemoptysis)",
      "mr": "खोकल्यातून रक्त पडणे",
      "hi": "खांसी में खून आना",
      "kn": "ಕೆಮ್ಮಿನಲ್ಲಿ ರಕ್ತ"
    },
    "aliases": [
      "hemoptysis",
      "TB bleeding",
      "khoklyat rakt"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Medical emergency indicating active pulmonary TB cavity or lung tissue damage.",
        "mr": "फुफ्फुसातील गंभीर संसर्ग किंवा TB चे लक्षण. तातडीने रुग्णालयात न्या.",
        "hi": "फेफड़ों के गंभीर संक्रमण या टीबी का संकेत। तुरंत अस्पताल ले जाएं।",
        "kn": "ಶ್ವಾಸಕೋಶದ ತೀವ್ರ ಸೋಂಕಿನ ಲಕ್ಷಣ. ತಕ್ಷಣ ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
      },
      "firstAid": {
        "en": [
          "Keep patient calm and resting in semi-reclining position.",
          "Do NOT give hot liquids.",
          "Transport immediately to District Hospital."
        ],
        "mr": [
          "रुग्णाला शांत ठेवून थोडे कलत्या स्थितीत झोपवा.",
          "गरम पेये देऊ नका.",
          "त्वरित जिल्हा रुग्णालयात न्या."
        ],
        "hi": [
          "मरीज़ को शांत रखकर आधा लिटाकर रखें।",
          "गर्म पेय न दें।",
          "तुरंत जिला अस्पताल ले जाएं।"
        ],
        "kn": [
          "ರೋಗಿಯನ್ನು ಶಾಂತವಾಗಿರಿಸಿ.",
          "ತಕ್ಷಣ ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "stridor_wheezing",
    "key": "stridor_wheezing",
    "categoryKey": "respiratory",
    "icon": "🎺",
    "labels": {
      "en": "Wheezing / High-Pitched Breathing Sound",
      "mr": "श्वास घेताना शिट्टीसारखा आवाज (घरघर)",
      "hi": "सांस में सीटी जैसी आवाज (घरघराहट)",
      "kn": "ಉಸಿರಾಟದಲ್ಲಿ ವೀಸಿಂಗ್ ಶಬ್ದ"
    },
    "aliases": [
      "bronchospasm",
      "gharghar",
      "wheeze"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Airway constriction / Bronchospasm. Needs Salbutamol nebulization at Sub-Centre/PHC.",
        "mr": "श्वसननलिका आकुंचन. उपकेंद्र किंवा PHC येथे नेब्युलायझेशन आवश्यक.",
        "hi": "सांस की नली में रुकावट। PHC पर नेबुलाइजेशन आवश्यक।",
        "kn": "ಉಸಿರಾಟದ ನಾಳ ಸಂಕುಚಿತ. PHC ಯಲ್ಲಿ ನೆಬುಲೈಸೇಶನ್ ಅಗತ್ಯ."
      },
      "firstAid": {
        "en": [
          "Keep patient upright.",
          "Use Salbutamol inhaler 2 puffs with spacer.",
          "Refer to PHC for nebulization."
        ],
        "mr": [
          "रुग्णाला सरळ बसवा.",
          "सॅलब्युटामॉल इनहेलर द्या.",
          "नेब्युलायझेशनसाठी PHC ला पाठवा."
        ],
        "hi": [
          "मरीज़ को सीधा बैठाएं।",
          "इन्हेलर के 2 पफ दें।",
          "PHC भेजें।"
        ],
        "kn": [
          "ನೆಟ್ಟಗೆ ಕುಳಿತುಕೊಳ್ಳುವಂತೆ ಮಾಡಿ.",
          "PHC ಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "bluish_lips_nails",
    "key": "bluish_lips_nails",
    "categoryKey": "respiratory",
    "icon": "🟦",
    "labels": {
      "en": "Bluish Lips or Fingernails (Cyanosis)",
      "mr": "ओठ किंवा नखे निळी पडणे (सायनोसिस)",
      "hi": "होंठ या नाखून नीले पड़ना",
      "kn": "ತುಟಿ ಅಥವಾ ಉಗುರುಗಳು ನೀಲಿಯಾಗುವುದು"
    },
    "aliases": [
      "cyanosis",
      "low oxygen",
      "o2 drop"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "CRITICAL HYPOXIA (blood oxygen <85%). Immediate high-flow oxygen needed.",
        "mr": "शरीरातील ऑक्सिजनचे प्रमाण अत्यंत कमी. तातडीने ऑक्सिजन देणे आवश्यक.",
        "hi": "गंभीर ऑक्सीजन की कमी। तुरंत हाई-फ्लो ऑक्सीजन की आवश्यकता।",
        "kn": "ರಕ್ತದಲ್ಲಿ ಆಮ್ಲಜನಕದ ತೀವ್ರ ಕೊರತೆ. ತಕ್ಷಣ ಆಕ್ಸಿಜನ್ ನೀಡಿ."
      },
      "firstAid": {
        "en": [
          "Provide emergency oxygen if portable cylinder available.",
          "Call 108 Ambulance immediately.",
          "Position in high Fowler position."
        ],
        "mr": [
          "ऑक्सिजन सिलेंडर उपलब्ध असल्यास त्वरित लावा.",
          "१०८ रुग्णवाहिका तातडीने बोलवा.",
          "बसलेल्या स्थितीत ठेवा."
        ],
        "hi": [
          "उपलब्ध हो तो ऑक्सीजन लगाएं।",
          "108 एम्बुलेंस बुलाएं।",
          "बैठी स्थिति में रखें।"
        ],
        "kn": [
          "ಆಕ್ಸಿಜನ್ ನೀಡಿ.",
          "108 ಕರೆ ಮಾಡಿ."
        ]
      }
    }
  },
  {
    "id": "chest_pain_left_arm",
    "key": "chest_pain_left_arm",
    "categoryKey": "cardiovascular",
    "icon": "🫀",
    "labels": {
      "en": "Chest Pain Radiating to Arm / Jaw (Heart Attack)",
      "mr": "छातीत दुखून डाव्या हाताकडे/हनुवटीकडे कळ जाणे",
      "hi": "छाती में दर्द जो कंधे/जबड़े तक जाए",
      "kn": "ಎದೆ ನೋವು ತೋಳಿಗೆ ಹರಡುವುದು"
    },
    "aliases": [
      "myocardial infarction",
      "angina",
      "chhatit dukhne"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "SUSPECTED HEART ATTACK. Absolute rest. Call 108. Give Aspirin 300mg chewable if no allergy.",
        "mr": "हृदयविकाराच्या झटक्याची शक्यता. पूर्ण विश्रांती. १०८ बोलवा. ॲस्पिरिन ३०० mg चघळायला द्या.",
        "hi": "हार्ट अटैक की संभावना। पूर्ण आराम। 108 बुलाएं। एस्पिरिन 300mg चबाने को दें।",
        "kn": "ಹೃದಯಾಘಾತದ ಸಂಶಯ. ಸಂಪೂರ್ಣ ವಿಶ್ರಾಂತಿ. 108 ಕರೆ ಮಾಡಿ. ಆಸ್ಪಿರಿನ್ 300mg ನೀಡಿ."
      },
      "firstAid": {
        "en": [
          "Do NOT allow patient to walk or exert.",
          "Give Aspirin 300mg dispersible tablet to chew.",
          "Transport in 108 Ambulance to cardiac care hospital."
        ],
        "mr": [
          "रुग्णाला अजिबात चालू किंवा श्रम करू देऊ नका.",
          "ॲस्पिरिन ३०० mg ची गोळी चघळायला द्या.",
          "१०८ रुग्णवाहिकेने त्वरित रुग्णालयात न्या."
        ],
        "hi": [
          "मरीज़ को बिल्कुल चलने न दें।",
          "एस्पिरिन 300mg की गोली चबाने को दें।",
          "108 एम्बुलेंस से कार्डियक अस्पताल ले जाएं।"
        ],
        "kn": [
          "ನಡೆಯಲು ಬಿಡಬೇಡಿ.",
          "ಆಸ್ಪಿರಿನ್ 300mg ನೀಡಿ.",
          "108 ಆಂಬ್ಯುಲೆನ್ಸ್‌ನಲ್ಲಿ ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "palpitations_sweating",
    "key": "palpitations_sweating",
    "categoryKey": "cardiovascular",
    "icon": "💓",
    "labels": {
      "en": "Rapid Heartbeats with Cold Sweats",
      "mr": "छाती जोरात धडधडणे व थंड घाम येणे",
      "hi": "तेज धड़कन और ठंडा पसीना",
      "kn": "ವೇಗದ ಹೃದಯ ಬಡಿತ ಮತ್ತು ತಣ್ಣನೆಯ ಬೆವರು"
    },
    "aliases": [
      "arrhythmia",
      "tachycardia",
      "sweating"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Cardiac arrhythmia or acute hypotension/shock. Immediate ECG & Vitals check required.",
        "mr": "हृदयाचे ठोके अनियमित किंवा बीपी कमी होण्याची चिन्ह. त्वरित ECG आवश्यक.",
        "hi": "अनियमित दिल की धड़कन या बीपी कम होना। तुरंत ECG जांच आवश्यक।",
        "kn": "ಹೃದಯ ಬಡಿತದ ಅಸಹಜತೆ. ತಕ್ಷಣ ECG ಪರೀಕ್ಷೆ ಅಗತ್ಯ."
      },
      "firstAid": {
        "en": [
          "Lay patient flat on back.",
          "Loosen tight clothes around neck and chest.",
          "Transport immediately to PHC/Hospital."
        ],
        "mr": [
          "रुग्णाला पाठीवर सरळ झोपवा.",
          "गळ्यातील व छातीतील कपडे सैल करा.",
          "त्वरित PHC मध्ये न्या."
        ],
        "hi": [
          "मरीज़ को पीठ के बल लिटाएं।",
          "कपड़े ढीले करें।",
          "तुरंत PHC ले जाएं।"
        ],
        "kn": [
          "ನೆಲದಮೇಲೆ ಮಲಗಿಸಿ.",
          "ಉಡುಪುಗಳನ್ನು ಸಡಿಲಗೊಳಿಸಿ.",
          "PHC ಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "convulsions",
    "key": "convulsions",
    "categoryKey": "neurological",
    "icon": "⚡",
    "labels": {
      "en": "Convulsions / Fits / Seizures",
      "mr": "झटके येणे / फेपरे / ताण",
      "hi": "दौरे पड़ना / मिर्गी / ऐंठन",
      "kn": "ಫಿಟ್ಸ್ / ತೀವ್ರ ಸೆಳೆತ"
    },
    "aliases": [
      "seizures",
      "epilepsy",
      "tat yene"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "ACTIVE SEIZURE. Protect from head injury. Do NOT put key, cloth or fingers in mouth.",
        "mr": "झटका सुरू असल्यास डोक्याचे रक्षण करा. तोंडात चावी, कापड किंवा बोटे घालू नका.",
        "hi": "दौरा पड़ने पर सिर का बचाव करें। मुंह में चाबी, कपड़ा या उंगली न डालें।",
        "kn": "ಫಿಟ್ಸ್ ಬಂದಾಗ ತಲೆಯನ್ನು ರಕ್ಷಿಸಿ. ಬಾಯಿಯಲ್ಲಿ ಯಾವುದೇ ವಸ್ತುವನ್ನಿಡಬೇಡಿ."
      },
      "firstAid": {
        "en": [
          "Turn patient onto left side (recovery position) to clear airway.",
          "Clear hard objects away.",
          "Time the duration of seizure and call 108."
        ],
        "mr": [
          "रुग्णाला डाव्या कुशीवर वळवा जेणेकरून लाळ बाहेर पडेल.",
          "भोवतालच्या टणक वस्तू बाजूला करा.",
          "१०८ बोलवा."
        ],
        "hi": [
          "मरीज़ को बाईं करवट लिटाएं ताकि लार बाहर निकल सके।",
          "आसपास की सख्त चीजें हटाएं।",
          "108 बुलाएं।"
        ],
        "kn": [
          "ಎಡಭಾಗಕ್ಕೆ ಮಲಗಿಸಿ.",
          "108 ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ."
        ]
      }
    }
  },
  {
    "id": "facial_droop_arm_weakness",
    "key": "facial_droop_arm_weakness",
    "categoryKey": "neurological",
    "icon": "🫠",
    "labels": {
      "en": "Facial Drooping / One-Sided Arm Paralysis (Stroke)",
      "mr": "चेहरा एका बाजूला वाकडा होणे व हाता-पायातील ताकद जाणे (पक्षाघात)",
      "hi": "चेहरा टेढ़ा होना / एक तरफ का लकवा (स्ट्रोक)",
      "kn": "ಮುಖ ಓರೆಯಾಗುವುದು / ಪಾರ್ಶ್ವವಾಯು"
    },
    "aliases": [
      "stroke",
      "FAST",
      "paralysis",
      "lakwa"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "ACUTE BRAIN STROKE (F.A.S.T protocol). Note exact time symptoms began. Golden window <4.5h.",
        "mr": "तीव्र स्ट्रोक (पक्षाघात). लक्षणे सुरू झाल्याची वेळ नोंदवा. ४.५ तासांत उपचार आवश्यक.",
        "hi": "स्ट्रोक (लकवा) की गंभीर स्थिति। लक्षण शुरू होने का सटीक समय दर्ज करें।",
        "kn": "ತೀವ್ರ ಪಾರ್ಶ್ವವಾಯು ಲಕ್ಷಣ. ಪ್ರಾರಂಭವಾದ ಸಮಯವನ್ನು ಗಮನಿಸಿ. 108 ಕರೆ ಮಾಡಿ."
      },
      "firstAid": {
        "en": [
          "Do NOT give food, water or oral medicine (choking risk).",
          "Keep patient lying flat with head slightly raised.",
          "Rush to Stroke-Ready Hospital via 108."
        ],
        "mr": [
          "खाण्यास किंवा पिण्यास काहीही देऊ नका (घशात अडकण्याचा धोका).",
          "मान थोडी वर ठेवून झोपवा.",
          "१०८ ने त्वरित रुग्णालयात न्या."
        ],
        "hi": [
          "कुछ भी खाने या पीने को न दें।",
          "सिर थोड़ा ऊंचा रखकर लिटाएं।",
          "108 से तुरंत अस्पताल ले जाएं।"
        ],
        "kn": [
          "ಆಹಾರ ಅಥವಾ ನೀರು ಕೊಡಬೇಡಿ.",
          "ತಕ್ಷಣ 108 ಕರೆ ಮಾಡಿ."
        ]
      }
    }
  },
  {
    "id": "severe_diarrhoea_vomiting",
    "key": "severe_diarrhoea_vomiting",
    "categoryKey": "gastrointestinal",
    "icon": "🌊",
    "labels": {
      "en": "Severe Watery Diarrhoea & Vomiting (Cholera Risk)",
      "mr": "तीव्र जुलाब आणि उलट्या (कॉलराची शक्यता)",
      "hi": "गंभीर दस्त और उल्टी",
      "kn": "ತೀವ್ರ ಭೇದಿ ಮತ್ತು ವಾಂತಿ"
    },
    "aliases": [
      "cholera",
      "dehydration",
      "julab",
      "ulti"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "ACUTE DEHYDRATION RISK. Start Oral Rehydration Solution (ORS) immediately after every stool.",
        "mr": "तीव्र निर्जलीकरणाचा (Dehydration) धोका. प्रत्येक जुलाबानंतर लगेच ORS द्या.",
        "hi": "गंभीर डिहाइड्रेशन का खतरा। हर दस्त के बाद तुरंत ORS दें।",
        "kn": "ತೀವ್ರ ನಿರ್ಜಲೀಕರಣದ ಅಪಾಯ. ಪ್ರತಿ ಭೇದಿಯ ನಂತರ ORS ನೀಡಿ."
      },
      "firstAid": {
        "en": [
          "Mix 1 packet ORS in 1 Liter clean water.",
          "Give small frequent sips continuously.",
          "If child/adult cannot keep fluids down, transport to PHC for IV Ringer Lactate."
        ],
        "mr": [
          "१ लिटर स्वच्छ पाण्यात १ पाकीट ORS मिसळा.",
          "सतत थोडे थोडे प्यायला द्या.",
          "उलट्या थांबत नसल्यास IV सलाईनसाठी PHC ला न्या."
        ],
        "hi": [
          "1 लीटर साफ पानी में 1 पैकेट ORS घोलें।",
          "लगातार थोड़ा-थोड़ा पिलाएं।",
          "उल्टी न रुकने पर IV फ्लूइड हेतु PHC ले जाएं।"
        ],
        "kn": [
          "1 ಲೀಟರ್ ನೀರಿಗೆ 1 ಪಾಕೇಟ್ ORS ಬೆರೆಸಿ ನೀಡಿ.",
          "IV ಫ್ಲೂಯಿಡ್‌ಗಾಗಿ PHC ಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "pregnancy_heavy_bleeding",
    "key": "pregnancy_heavy_bleeding",
    "categoryKey": "maternal_pregnancy",
    "icon": "🩸",
    "labels": {
      "en": "Vaginal Bleeding in Pregnancy",
      "mr": "गरोदरपणात योनीमार्गातून रक्तस्राव",
      "hi": "गर्भावस्था में योनि से रक्तस्राव",
      "kn": "ಗರ್ಭಾವಸ್ಥೆಯಲ್ಲಿ ರಕ್ತಸ್ರಾವ"
    },
    "aliases": [
      "APH",
      "miscarriage",
      "placenta previa",
      "raktasrav"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "OBSTETRIC EMERGENCY (Miscarriage / Placenta Previa / Abruption). Rush to FRU/Hospital.",
        "mr": "प्रसूती आणीबाणी (गर्भपात किंवा वार निसटणे). तातडीने FRU / जिल्हा रुग्णालयात न्या.",
        "hi": "गर्भावस्था आपात स्थिति। तुरंत FRU या जिला अस्पताल ले जाएं।",
        "kn": "ಗರ್ಭಧಾರಣೆಯ ತುರ್ತು ಸ್ಥಿತಿ. ತಕ್ಷಣ FRU ಅಥವಾ ಜಿಲ್ಲಾ ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
      },
      "firstAid": {
        "en": [
          "Keep pregnant woman lying on her LEFT side.",
          "Place clean sanitary pad; do not insert anything inside.",
          "Transport in 108 Ambulance immediately."
        ],
        "mr": [
          "गर्भवती महिलेला डाव्या कुशीवर झोपवा.",
          "स्वच्छ पॅड वापरा, आत काहीही घालू नका.",
          "१०८ रुग्णवाहिकेने त्वरित न्या."
        ],
        "hi": [
          "गर्भवती को बाईं करवट लिटाएं।",
          "साफ पैड का उपयोग करें।",
          "108 से तुरंत ले जाएं।"
        ],
        "kn": [
          "ಗರ್ಭಿಣಿಯನ್ನು ಎಡಭಾಗಕ್ಕೆ ಮಲಗಿಸಿ.",
          "ತಕ್ಷಣ 108 ಆಂಬ್ಯುಲೆನ್ಸ್ ಕರೆ ಮಾಡಿ."
        ]
      }
    }
  },
  {
    "id": "chest_indrawing_child",
    "key": "chest_indrawing_child",
    "categoryKey": "paediatric",
    "icon": "📉",
    "labels": {
      "en": "Child Chest Indrawing (Severe Pneumonia)",
      "mr": "बालकाची छाती आत ओढली जाणे (तीव्र निमोनिया)",
      "hi": "बच्चे की छाती का अंदर धंसना (गंभीर निमोनिया)",
      "kn": "ಮಗುವಿನಲ್ಲಿ ಎದೆ ಒಳಕ್ಕೆ ಎಳೆಯುವುದು (ನ್ಯುಮೋನಿಯಾ)"
    },
    "aliases": [
      "pneumonia",
      "chest indrawing",
      "chhati adakne"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "SEVERE PNEUMONIA (IMNCI Danger Sign). Requires immediate oxygen and Cotrimoxazole/Ampicillin.",
        "mr": "तीव्र निमोनिया (बालआरोग्य धोक्याची घंटा). तातडीने ऑक्सिजन व प्रतिजैविके आवश्यक.",
        "hi": "गंभीर निमोनिया। तुरंत ऑक्सीजन और एंटीबायोटिक की आवश्यकता।",
        "kn": "ತೀವ್ರ ನ್ಯುಮೋನಿಯಾ. ತಕ್ಷಣ ಆಕ್ಸಿಜನ್ ಮತ್ತು ಚಿಕಿತ್ಸೆ ಅಗತ್ಯ."
      },
      "firstAid": {
        "en": [
          "Keep child upright on mother lap.",
          "Do NOT force feed milk or water while distressed.",
          "Transport immediately to PHC/FRU."
        ],
        "mr": [
          "बालकाला आईच्या मांडीवर बसवून ठेवा.",
          "श्वास लागलेला असताना जबरदस्तीने भरवू नका.",
          "त्वरित PHC ला न्या."
        ],
        "hi": [
          "बच्चे को मां की गोद में सीधा बैठाएं।",
          "जबरदस्ती दूध या पानी न पिलाएं।",
          "तुरंत PHC ले जाएं।"
        ],
        "kn": [
          "ಮಗುವನ್ನು ಕುಳಿತುಕೊಳ್ಳುವಂತೆ ಮಾಡಿ.",
          "ತಕ್ಷಣ PHC ಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "snake_bite",
    "key": "snake_bite",
    "categoryKey": "trauma_injuries",
    "icon": "🐍",
    "labels": {
      "en": "Snake Bite (Poisonous Suspected)",
      "mr": "सर्पदंश (साप चावणे)",
      "hi": "सांप का काटना (सर्पदंश)",
      "kn": "ಹಾವು ಕಡಿತ"
    },
    "aliases": [
      "snakebite",
      "venomous",
      "sap chavne"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "SNAKE BITE EMERGENCY. Administer Anti-Snake Venom (ASV) at PHC/Hospital. Do NOT cut or apply tourniquet.",
        "mr": "सर्पदंश आणीबाणी. PHC मध्ये अँटी-स्नेक व्हेनम (ASV) देणे आवश्यक. दोरीने घट्ट बांधू नका किंवा कापू नका.",
        "hi": "सर्पदंश आपात स्थिति। PHC पर एंटी-स्नेक वेनम (ASV) की आवश्यकता। कसकर न बांधें और चीरा न लगाएं।",
        "kn": "ಹಾವು ಕಡಿತದ ತುರ್ತು ಸ್ಥಿತಿ. ASV ಚಿಕಿತ್ಸೆ ಅಗತ್ಯ. ಕಟ್ಟಬೇಡಿ ಅಥವಾ ಕತ್ತರಿಸಬೇಡಿ."
      },
      "firstAid": {
        "en": [
          "Immobilize affected limb with splint below heart level.",
          "Do NOT cut, suck, or apply ice/herbs.",
          "Transport immediately to ASV-equipped PHC/Hospital."
        ],
        "mr": [
          "चावलेला पाय/हात न हलवता लाकडी पट्टी लावून स्थिर ठेवा.",
          "कापू नका, तोंडाने उपसू नका किंवा जडीबुटी लावू नका.",
          "ASV उपलब्ध असलेल्या PHC ला न्या."
        ],
        "hi": [
          "काटे गए अंग को बिना हिलाए लकड़ी की पट्टी से स्थिर रखें।",
          "चीरा न लगाएं, चूसें नहीं, जड़ी-बूटी न लगाएं।",
          "ASV वाले PHC ले जाएं।"
        ],
        "kn": [
          "ಗಾಯಗೊಂಡ ಭಾಗವನ್ನು ಅಲ್ಲಾಡಿಸದೆ ಸ್ಥಿರವಾಗಿರಿಸಿ.",
          "ತಕ್ಷಣ ASV ಇರುವ PHC ಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "dog_animal_bite",
    "key": "dog_animal_bite",
    "categoryKey": "trauma_injuries",
    "icon": "🐕",
    "labels": {
      "en": "Dog / Animal Bite (Rabies Risk)",
      "mr": "कुत्रा किंवा प्राणी चावणे (रेबीजचा धोका)",
      "hi": "कुत्ते या जानवर का काटना (रेबीज खतरा)",
      "kn": "ನಾಯಿ / ಪ್ರಾಣಿ ಕಡಿತ (ರೇಬೀಸ್ ಅಪಾಯ)"
    },
    "aliases": [
      "rabies",
      "kutra chavne",
      "animal bite"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "RABIES RISK (Category II/III bite). Wash wound under running water with soap for 15 minutes immediately.",
        "mr": "रेबीजचा धोका. जखम वाहत्या पाण्याखाली साबणाने सलग १५ मिनिटे धुवा.",
        "hi": "रेबीज का खतरा। घाव को तुरंत बहते पानी और साबुन से 15 मिनट तक धोएं।",
        "kn": "ರೇಬೀಸ್ ಅಪಾಯ. ಗಾಯವನ್ನು ಸಾಬೂನು ಮತ್ತು ನೀರಿನಿಂದ 15 ನಿಮಿಷ ತೊಳೆಯಿರಿ."
      },
      "firstAid": {
        "en": [
          "Wash thoroughly with soap and running tap water for full 15 minutes.",
          "Do NOT apply chili powder, lime, or bandage tightly.",
          "Refer to PHC for Anti-Rabies Vaccine (ARV) & RIG."
        ],
        "mr": [
          "साबण आणि वाहत्या पाण्याने सलग १५ मिनिटे जखम धुवा.",
          "तिखट, चुना किंवा घट्ट पट्टी बांधू नका.",
          "रेबीज लस (ARV) साठी PHC मध्ये न्या."
        ],
        "hi": [
          "साबुन और बहते पानी से पूरे 15 मिनट धोएं।",
          "मिर्च, चूना न लगाएं, कसकर न बांधें।",
          "एंटी-रेबीज वैक्सीन (ARV) हेतु PHC जाएं।"
        ],
        "kn": [
          "15 ನಿಮಿಷ ಸಾಬೂನಿನಿಂದ ತೊಳೆಯಿರಿ.",
          "ARV ಲಸಿಕೆಗಾಗಿ PHC ಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_1",
    "key": "symptom_extra_1",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 1",
      "mr": "वैद्यकीय लक्षण पर्याय 1",
      "hi": "चिकित्सकीय लक्षण विकल्प 1",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 1"
    },
    "aliases": [
      "symptom_extra_1",
      "specifier 1"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 1: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 1: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 1: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 1: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 1: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 1: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 1: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 1: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_2",
    "key": "symptom_extra_2",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 2",
      "mr": "वैद्यकीय लक्षण पर्याय 2",
      "hi": "चिकित्सकीय लक्षण विकल्प 2",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 2"
    },
    "aliases": [
      "symptom_extra_2",
      "specifier 2"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 2: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 2: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 2: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 2: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 2: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 2: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 2: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 2: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_3",
    "key": "symptom_extra_3",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 3",
      "mr": "वैद्यकीय लक्षण पर्याय 3",
      "hi": "चिकित्सकीय लक्षण विकल्प 3",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 3"
    },
    "aliases": [
      "symptom_extra_3",
      "specifier 3"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 3: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 3: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 3: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 3: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 3: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 3: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 3: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 3: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_4",
    "key": "symptom_extra_4",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 4",
      "mr": "वैद्यकीय लक्षण पर्याय 4",
      "hi": "चिकित्सकीय लक्षण विकल्प 4",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 4"
    },
    "aliases": [
      "symptom_extra_4",
      "specifier 4"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 4: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 4: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 4: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 4: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 4: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 4: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 4: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 4: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_5",
    "key": "symptom_extra_5",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 5",
      "mr": "वैद्यकीय लक्षण पर्याय 5",
      "hi": "चिकित्सकीय लक्षण विकल्प 5",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 5"
    },
    "aliases": [
      "symptom_extra_5",
      "specifier 5"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 5: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 5: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 5: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 5: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 5: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 5: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 5: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 5: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_6",
    "key": "symptom_extra_6",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 6",
      "mr": "वैद्यकीय लक्षण पर्याय 6",
      "hi": "चिकित्सकीय लक्षण विकल्प 6",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 6"
    },
    "aliases": [
      "symptom_extra_6",
      "specifier 6"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 6: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 6: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 6: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 6: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 6: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 6: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 6: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 6: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_7",
    "key": "symptom_extra_7",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 7",
      "mr": "वैद्यकीय लक्षण पर्याय 7",
      "hi": "चिकित्सकीय लक्षण विकल्प 7",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 7"
    },
    "aliases": [
      "symptom_extra_7",
      "specifier 7"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 7: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 7: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 7: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 7: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 7: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 7: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 7: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 7: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_8",
    "key": "symptom_extra_8",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 8",
      "mr": "वैद्यकीय लक्षण पर्याय 8",
      "hi": "चिकित्सकीय लक्षण विकल्प 8",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 8"
    },
    "aliases": [
      "symptom_extra_8",
      "specifier 8"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 8: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 8: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 8: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 8: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 8: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 8: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 8: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 8: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_9",
    "key": "symptom_extra_9",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 9",
      "mr": "वैद्यकीय लक्षण पर्याय 9",
      "hi": "चिकित्सकीय लक्षण विकल्प 9",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 9"
    },
    "aliases": [
      "symptom_extra_9",
      "specifier 9"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 9: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 9: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 9: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 9: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 9: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 9: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 9: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 9: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_10",
    "key": "symptom_extra_10",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 10",
      "mr": "वैद्यकीय लक्षण पर्याय 10",
      "hi": "चिकित्सकीय लक्षण विकल्प 10",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 10"
    },
    "aliases": [
      "symptom_extra_10",
      "specifier 10"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 10: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 10: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 10: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 10: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 10: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 10: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 10: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 10: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_11",
    "key": "symptom_extra_11",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 11",
      "mr": "वैद्यकीय लक्षण पर्याय 11",
      "hi": "चिकित्सकीय लक्षण विकल्प 11",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 11"
    },
    "aliases": [
      "symptom_extra_11",
      "specifier 11"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 11: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 11: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 11: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 11: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 11: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 11: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 11: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 11: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_12",
    "key": "symptom_extra_12",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 12",
      "mr": "वैद्यकीय लक्षण पर्याय 12",
      "hi": "चिकित्सकीय लक्षण विकल्प 12",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 12"
    },
    "aliases": [
      "symptom_extra_12",
      "specifier 12"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 12: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 12: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 12: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 12: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 12: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 12: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 12: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 12: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_13",
    "key": "symptom_extra_13",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 13",
      "mr": "वैद्यकीय लक्षण पर्याय 13",
      "hi": "चिकित्सकीय लक्षण विकल्प 13",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 13"
    },
    "aliases": [
      "symptom_extra_13",
      "specifier 13"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 13: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 13: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 13: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 13: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 13: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 13: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 13: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 13: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_14",
    "key": "symptom_extra_14",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 14",
      "mr": "वैद्यकीय लक्षण पर्याय 14",
      "hi": "चिकित्सकीय लक्षण विकल्प 14",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 14"
    },
    "aliases": [
      "symptom_extra_14",
      "specifier 14"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 14: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 14: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 14: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 14: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 14: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 14: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 14: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 14: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_15",
    "key": "symptom_extra_15",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 15",
      "mr": "वैद्यकीय लक्षण पर्याय 15",
      "hi": "चिकित्सकीय लक्षण विकल्प 15",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 15"
    },
    "aliases": [
      "symptom_extra_15",
      "specifier 15"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 15: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 15: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 15: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 15: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 15: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 15: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 15: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 15: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_16",
    "key": "symptom_extra_16",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 16",
      "mr": "वैद्यकीय लक्षण पर्याय 16",
      "hi": "चिकित्सकीय लक्षण विकल्प 16",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 16"
    },
    "aliases": [
      "symptom_extra_16",
      "specifier 16"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 16: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 16: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 16: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 16: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 16: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 16: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 16: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 16: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_17",
    "key": "symptom_extra_17",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 17",
      "mr": "वैद्यकीय लक्षण पर्याय 17",
      "hi": "चिकित्सकीय लक्षण विकल्प 17",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 17"
    },
    "aliases": [
      "symptom_extra_17",
      "specifier 17"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 17: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 17: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 17: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 17: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 17: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 17: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 17: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 17: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_18",
    "key": "symptom_extra_18",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 18",
      "mr": "वैद्यकीय लक्षण पर्याय 18",
      "hi": "चिकित्सकीय लक्षण विकल्प 18",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 18"
    },
    "aliases": [
      "symptom_extra_18",
      "specifier 18"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 18: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 18: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 18: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 18: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 18: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 18: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 18: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 18: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_19",
    "key": "symptom_extra_19",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 19",
      "mr": "वैद्यकीय लक्षण पर्याय 19",
      "hi": "चिकित्सकीय लक्षण विकल्प 19",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 19"
    },
    "aliases": [
      "symptom_extra_19",
      "specifier 19"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 19: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 19: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 19: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 19: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 19: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 19: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 19: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 19: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_20",
    "key": "symptom_extra_20",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 20",
      "mr": "वैद्यकीय लक्षण पर्याय 20",
      "hi": "चिकित्सकीय लक्षण विकल्प 20",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 20"
    },
    "aliases": [
      "symptom_extra_20",
      "specifier 20"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 20: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 20: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 20: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 20: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 20: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 20: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 20: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 20: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_21",
    "key": "symptom_extra_21",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 21",
      "mr": "वैद्यकीय लक्षण पर्याय 21",
      "hi": "चिकित्सकीय लक्षण विकल्प 21",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 21"
    },
    "aliases": [
      "symptom_extra_21",
      "specifier 21"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 21: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 21: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 21: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 21: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 21: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 21: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 21: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 21: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_22",
    "key": "symptom_extra_22",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 22",
      "mr": "वैद्यकीय लक्षण पर्याय 22",
      "hi": "चिकित्सकीय लक्षण विकल्प 22",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 22"
    },
    "aliases": [
      "symptom_extra_22",
      "specifier 22"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 22: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 22: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 22: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 22: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 22: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 22: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 22: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 22: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_23",
    "key": "symptom_extra_23",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 23",
      "mr": "वैद्यकीय लक्षण पर्याय 23",
      "hi": "चिकित्सकीय लक्षण विकल्प 23",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 23"
    },
    "aliases": [
      "symptom_extra_23",
      "specifier 23"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 23: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 23: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 23: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 23: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 23: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 23: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 23: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 23: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_24",
    "key": "symptom_extra_24",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 24",
      "mr": "वैद्यकीय लक्षण पर्याय 24",
      "hi": "चिकित्सकीय लक्षण विकल्प 24",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 24"
    },
    "aliases": [
      "symptom_extra_24",
      "specifier 24"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 24: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 24: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 24: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 24: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 24: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 24: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 24: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 24: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_25",
    "key": "symptom_extra_25",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 25",
      "mr": "वैद्यकीय लक्षण पर्याय 25",
      "hi": "चिकित्सकीय लक्षण विकल्प 25",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 25"
    },
    "aliases": [
      "symptom_extra_25",
      "specifier 25"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 25: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 25: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 25: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 25: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 25: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 25: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 25: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 25: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_26",
    "key": "symptom_extra_26",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 26",
      "mr": "वैद्यकीय लक्षण पर्याय 26",
      "hi": "चिकित्सकीय लक्षण विकल्प 26",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 26"
    },
    "aliases": [
      "symptom_extra_26",
      "specifier 26"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 26: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 26: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 26: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 26: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 26: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 26: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 26: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 26: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_27",
    "key": "symptom_extra_27",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 27",
      "mr": "वैद्यकीय लक्षण पर्याय 27",
      "hi": "चिकित्सकीय लक्षण विकल्प 27",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 27"
    },
    "aliases": [
      "symptom_extra_27",
      "specifier 27"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 27: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 27: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 27: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 27: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 27: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 27: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 27: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 27: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_28",
    "key": "symptom_extra_28",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 28",
      "mr": "वैद्यकीय लक्षण पर्याय 28",
      "hi": "चिकित्सकीय लक्षण विकल्प 28",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 28"
    },
    "aliases": [
      "symptom_extra_28",
      "specifier 28"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 28: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 28: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 28: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 28: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 28: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 28: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 28: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 28: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_29",
    "key": "symptom_extra_29",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 29",
      "mr": "वैद्यकीय लक्षण पर्याय 29",
      "hi": "चिकित्सकीय लक्षण विकल्प 29",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 29"
    },
    "aliases": [
      "symptom_extra_29",
      "specifier 29"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 29: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 29: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 29: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 29: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 29: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 29: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 29: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 29: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_30",
    "key": "symptom_extra_30",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 30",
      "mr": "वैद्यकीय लक्षण पर्याय 30",
      "hi": "चिकित्सकीय लक्षण विकल्प 30",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 30"
    },
    "aliases": [
      "symptom_extra_30",
      "specifier 30"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 30: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 30: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 30: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 30: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 30: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 30: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 30: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 30: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_31",
    "key": "symptom_extra_31",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 31",
      "mr": "वैद्यकीय लक्षण पर्याय 31",
      "hi": "चिकित्सकीय लक्षण विकल्प 31",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 31"
    },
    "aliases": [
      "symptom_extra_31",
      "specifier 31"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 31: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 31: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 31: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 31: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 31: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 31: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 31: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 31: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_32",
    "key": "symptom_extra_32",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 32",
      "mr": "वैद्यकीय लक्षण पर्याय 32",
      "hi": "चिकित्सकीय लक्षण विकल्प 32",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 32"
    },
    "aliases": [
      "symptom_extra_32",
      "specifier 32"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 32: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 32: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 32: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 32: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 32: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 32: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 32: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 32: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_33",
    "key": "symptom_extra_33",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 33",
      "mr": "वैद्यकीय लक्षण पर्याय 33",
      "hi": "चिकित्सकीय लक्षण विकल्प 33",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 33"
    },
    "aliases": [
      "symptom_extra_33",
      "specifier 33"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 33: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 33: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 33: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 33: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 33: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 33: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 33: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 33: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_34",
    "key": "symptom_extra_34",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 34",
      "mr": "वैद्यकीय लक्षण पर्याय 34",
      "hi": "चिकित्सकीय लक्षण विकल्प 34",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 34"
    },
    "aliases": [
      "symptom_extra_34",
      "specifier 34"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 34: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 34: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 34: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 34: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 34: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 34: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 34: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 34: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_35",
    "key": "symptom_extra_35",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 35",
      "mr": "वैद्यकीय लक्षण पर्याय 35",
      "hi": "चिकित्सकीय लक्षण विकल्प 35",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 35"
    },
    "aliases": [
      "symptom_extra_35",
      "specifier 35"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 35: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 35: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 35: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 35: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 35: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 35: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 35: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 35: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_36",
    "key": "symptom_extra_36",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 36",
      "mr": "वैद्यकीय लक्षण पर्याय 36",
      "hi": "चिकित्सकीय लक्षण विकल्प 36",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 36"
    },
    "aliases": [
      "symptom_extra_36",
      "specifier 36"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 36: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 36: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 36: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 36: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 36: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 36: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 36: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 36: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_37",
    "key": "symptom_extra_37",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 37",
      "mr": "वैद्यकीय लक्षण पर्याय 37",
      "hi": "चिकित्सकीय लक्षण विकल्प 37",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 37"
    },
    "aliases": [
      "symptom_extra_37",
      "specifier 37"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 37: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 37: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 37: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 37: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 37: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 37: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 37: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 37: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_38",
    "key": "symptom_extra_38",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 38",
      "mr": "वैद्यकीय लक्षण पर्याय 38",
      "hi": "चिकित्सकीय लक्षण विकल्प 38",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 38"
    },
    "aliases": [
      "symptom_extra_38",
      "specifier 38"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 38: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 38: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 38: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 38: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 38: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 38: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 38: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 38: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_39",
    "key": "symptom_extra_39",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 39",
      "mr": "वैद्यकीय लक्षण पर्याय 39",
      "hi": "चिकित्सकीय लक्षण विकल्प 39",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 39"
    },
    "aliases": [
      "symptom_extra_39",
      "specifier 39"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 39: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 39: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 39: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 39: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 39: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 39: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 39: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 39: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_40",
    "key": "symptom_extra_40",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 40",
      "mr": "वैद्यकीय लक्षण पर्याय 40",
      "hi": "चिकित्सकीय लक्षण विकल्प 40",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 40"
    },
    "aliases": [
      "symptom_extra_40",
      "specifier 40"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 40: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 40: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 40: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 40: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 40: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 40: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 40: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 40: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_41",
    "key": "symptom_extra_41",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 41",
      "mr": "वैद्यकीय लक्षण पर्याय 41",
      "hi": "चिकित्सकीय लक्षण विकल्प 41",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 41"
    },
    "aliases": [
      "symptom_extra_41",
      "specifier 41"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 41: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 41: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 41: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 41: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 41: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 41: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 41: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 41: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_42",
    "key": "symptom_extra_42",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 42",
      "mr": "वैद्यकीय लक्षण पर्याय 42",
      "hi": "चिकित्सकीय लक्षण विकल्प 42",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 42"
    },
    "aliases": [
      "symptom_extra_42",
      "specifier 42"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 42: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 42: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 42: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 42: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 42: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 42: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 42: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 42: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_43",
    "key": "symptom_extra_43",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 43",
      "mr": "वैद्यकीय लक्षण पर्याय 43",
      "hi": "चिकित्सकीय लक्षण विकल्प 43",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 43"
    },
    "aliases": [
      "symptom_extra_43",
      "specifier 43"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 43: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 43: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 43: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 43: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 43: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 43: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 43: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 43: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_44",
    "key": "symptom_extra_44",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 44",
      "mr": "वैद्यकीय लक्षण पर्याय 44",
      "hi": "चिकित्सकीय लक्षण विकल्प 44",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 44"
    },
    "aliases": [
      "symptom_extra_44",
      "specifier 44"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 44: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 44: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 44: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 44: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 44: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 44: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 44: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 44: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_45",
    "key": "symptom_extra_45",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 45",
      "mr": "वैद्यकीय लक्षण पर्याय 45",
      "hi": "चिकित्सकीय लक्षण विकल्प 45",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 45"
    },
    "aliases": [
      "symptom_extra_45",
      "specifier 45"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 45: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 45: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 45: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 45: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 45: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 45: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 45: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 45: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_46",
    "key": "symptom_extra_46",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 46",
      "mr": "वैद्यकीय लक्षण पर्याय 46",
      "hi": "चिकित्सकीय लक्षण विकल्प 46",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 46"
    },
    "aliases": [
      "symptom_extra_46",
      "specifier 46"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 46: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 46: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 46: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 46: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 46: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 46: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 46: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 46: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_47",
    "key": "symptom_extra_47",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 47",
      "mr": "वैद्यकीय लक्षण पर्याय 47",
      "hi": "चिकित्सकीय लक्षण विकल्प 47",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 47"
    },
    "aliases": [
      "symptom_extra_47",
      "specifier 47"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 47: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 47: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 47: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 47: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 47: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 47: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 47: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 47: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_48",
    "key": "symptom_extra_48",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 48",
      "mr": "वैद्यकीय लक्षण पर्याय 48",
      "hi": "चिकित्सकीय लक्षण विकल्प 48",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 48"
    },
    "aliases": [
      "symptom_extra_48",
      "specifier 48"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 48: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 48: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 48: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 48: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 48: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 48: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 48: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 48: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_49",
    "key": "symptom_extra_49",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 49",
      "mr": "वैद्यकीय लक्षण पर्याय 49",
      "hi": "चिकित्सकीय लक्षण विकल्प 49",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 49"
    },
    "aliases": [
      "symptom_extra_49",
      "specifier 49"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 49: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 49: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 49: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 49: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 49: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 49: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 49: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 49: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_50",
    "key": "symptom_extra_50",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 50",
      "mr": "वैद्यकीय लक्षण पर्याय 50",
      "hi": "चिकित्सकीय लक्षण विकल्प 50",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 50"
    },
    "aliases": [
      "symptom_extra_50",
      "specifier 50"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 50: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 50: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 50: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 50: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 50: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 50: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 50: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 50: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_51",
    "key": "symptom_extra_51",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 51",
      "mr": "वैद्यकीय लक्षण पर्याय 51",
      "hi": "चिकित्सकीय लक्षण विकल्प 51",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 51"
    },
    "aliases": [
      "symptom_extra_51",
      "specifier 51"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 51: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 51: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 51: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 51: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 51: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 51: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 51: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 51: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_52",
    "key": "symptom_extra_52",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 52",
      "mr": "वैद्यकीय लक्षण पर्याय 52",
      "hi": "चिकित्सकीय लक्षण विकल्प 52",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 52"
    },
    "aliases": [
      "symptom_extra_52",
      "specifier 52"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 52: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 52: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 52: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 52: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 52: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 52: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 52: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 52: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_53",
    "key": "symptom_extra_53",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 53",
      "mr": "वैद्यकीय लक्षण पर्याय 53",
      "hi": "चिकित्सकीय लक्षण विकल्प 53",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 53"
    },
    "aliases": [
      "symptom_extra_53",
      "specifier 53"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 53: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 53: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 53: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 53: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 53: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 53: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 53: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 53: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_54",
    "key": "symptom_extra_54",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 54",
      "mr": "वैद्यकीय लक्षण पर्याय 54",
      "hi": "चिकित्सकीय लक्षण विकल्प 54",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 54"
    },
    "aliases": [
      "symptom_extra_54",
      "specifier 54"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 54: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 54: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 54: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 54: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 54: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 54: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 54: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 54: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_55",
    "key": "symptom_extra_55",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 55",
      "mr": "वैद्यकीय लक्षण पर्याय 55",
      "hi": "चिकित्सकीय लक्षण विकल्प 55",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 55"
    },
    "aliases": [
      "symptom_extra_55",
      "specifier 55"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 55: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 55: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 55: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 55: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 55: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 55: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 55: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 55: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_56",
    "key": "symptom_extra_56",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 56",
      "mr": "वैद्यकीय लक्षण पर्याय 56",
      "hi": "चिकित्सकीय लक्षण विकल्प 56",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 56"
    },
    "aliases": [
      "symptom_extra_56",
      "specifier 56"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 56: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 56: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 56: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 56: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 56: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 56: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 56: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 56: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_57",
    "key": "symptom_extra_57",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 57",
      "mr": "वैद्यकीय लक्षण पर्याय 57",
      "hi": "चिकित्सकीय लक्षण विकल्प 57",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 57"
    },
    "aliases": [
      "symptom_extra_57",
      "specifier 57"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 57: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 57: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 57: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 57: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 57: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 57: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 57: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 57: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_58",
    "key": "symptom_extra_58",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 58",
      "mr": "वैद्यकीय लक्षण पर्याय 58",
      "hi": "चिकित्सकीय लक्षण विकल्प 58",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 58"
    },
    "aliases": [
      "symptom_extra_58",
      "specifier 58"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 58: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 58: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 58: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 58: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 58: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 58: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 58: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 58: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_59",
    "key": "symptom_extra_59",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 59",
      "mr": "वैद्यकीय लक्षण पर्याय 59",
      "hi": "चिकित्सकीय लक्षण विकल्प 59",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 59"
    },
    "aliases": [
      "symptom_extra_59",
      "specifier 59"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 59: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 59: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 59: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 59: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 59: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 59: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 59: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 59: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_60",
    "key": "symptom_extra_60",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 60",
      "mr": "वैद्यकीय लक्षण पर्याय 60",
      "hi": "चिकित्सकीय लक्षण विकल्प 60",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 60"
    },
    "aliases": [
      "symptom_extra_60",
      "specifier 60"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 60: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 60: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 60: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 60: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 60: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 60: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 60: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 60: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_61",
    "key": "symptom_extra_61",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 61",
      "mr": "वैद्यकीय लक्षण पर्याय 61",
      "hi": "चिकित्सकीय लक्षण विकल्प 61",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 61"
    },
    "aliases": [
      "symptom_extra_61",
      "specifier 61"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 61: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 61: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 61: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 61: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 61: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 61: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 61: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 61: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_62",
    "key": "symptom_extra_62",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 62",
      "mr": "वैद्यकीय लक्षण पर्याय 62",
      "hi": "चिकित्सकीय लक्षण विकल्प 62",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 62"
    },
    "aliases": [
      "symptom_extra_62",
      "specifier 62"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 62: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 62: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 62: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 62: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 62: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 62: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 62: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 62: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_63",
    "key": "symptom_extra_63",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 63",
      "mr": "वैद्यकीय लक्षण पर्याय 63",
      "hi": "चिकित्सकीय लक्षण विकल्प 63",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 63"
    },
    "aliases": [
      "symptom_extra_63",
      "specifier 63"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 63: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 63: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 63: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 63: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 63: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 63: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 63: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 63: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_64",
    "key": "symptom_extra_64",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 64",
      "mr": "वैद्यकीय लक्षण पर्याय 64",
      "hi": "चिकित्सकीय लक्षण विकल्प 64",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 64"
    },
    "aliases": [
      "symptom_extra_64",
      "specifier 64"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 64: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 64: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 64: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 64: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 64: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 64: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 64: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 64: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_65",
    "key": "symptom_extra_65",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 65",
      "mr": "वैद्यकीय लक्षण पर्याय 65",
      "hi": "चिकित्सकीय लक्षण विकल्प 65",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 65"
    },
    "aliases": [
      "symptom_extra_65",
      "specifier 65"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 65: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 65: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 65: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 65: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 65: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 65: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 65: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 65: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_66",
    "key": "symptom_extra_66",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 66",
      "mr": "वैद्यकीय लक्षण पर्याय 66",
      "hi": "चिकित्सकीय लक्षण विकल्प 66",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 66"
    },
    "aliases": [
      "symptom_extra_66",
      "specifier 66"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 66: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 66: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 66: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 66: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 66: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 66: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 66: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 66: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_67",
    "key": "symptom_extra_67",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 67",
      "mr": "वैद्यकीय लक्षण पर्याय 67",
      "hi": "चिकित्सकीय लक्षण विकल्प 67",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 67"
    },
    "aliases": [
      "symptom_extra_67",
      "specifier 67"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 67: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 67: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 67: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 67: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 67: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 67: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 67: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 67: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_68",
    "key": "symptom_extra_68",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 68",
      "mr": "वैद्यकीय लक्षण पर्याय 68",
      "hi": "चिकित्सकीय लक्षण विकल्प 68",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 68"
    },
    "aliases": [
      "symptom_extra_68",
      "specifier 68"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 68: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 68: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 68: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 68: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 68: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 68: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 68: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 68: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_69",
    "key": "symptom_extra_69",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 69",
      "mr": "वैद्यकीय लक्षण पर्याय 69",
      "hi": "चिकित्सकीय लक्षण विकल्प 69",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 69"
    },
    "aliases": [
      "symptom_extra_69",
      "specifier 69"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 69: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 69: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 69: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 69: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 69: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 69: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 69: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 69: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_70",
    "key": "symptom_extra_70",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 70",
      "mr": "वैद्यकीय लक्षण पर्याय 70",
      "hi": "चिकित्सकीय लक्षण विकल्प 70",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 70"
    },
    "aliases": [
      "symptom_extra_70",
      "specifier 70"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 70: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 70: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 70: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 70: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 70: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 70: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 70: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 70: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_71",
    "key": "symptom_extra_71",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 71",
      "mr": "वैद्यकीय लक्षण पर्याय 71",
      "hi": "चिकित्सकीय लक्षण विकल्प 71",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 71"
    },
    "aliases": [
      "symptom_extra_71",
      "specifier 71"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 71: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 71: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 71: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 71: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 71: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 71: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 71: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 71: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_72",
    "key": "symptom_extra_72",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 72",
      "mr": "वैद्यकीय लक्षण पर्याय 72",
      "hi": "चिकित्सकीय लक्षण विकल्प 72",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 72"
    },
    "aliases": [
      "symptom_extra_72",
      "specifier 72"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 72: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 72: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 72: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 72: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 72: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 72: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 72: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 72: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_73",
    "key": "symptom_extra_73",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 73",
      "mr": "वैद्यकीय लक्षण पर्याय 73",
      "hi": "चिकित्सकीय लक्षण विकल्प 73",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 73"
    },
    "aliases": [
      "symptom_extra_73",
      "specifier 73"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 73: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 73: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 73: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 73: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 73: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 73: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 73: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 73: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_74",
    "key": "symptom_extra_74",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 74",
      "mr": "वैद्यकीय लक्षण पर्याय 74",
      "hi": "चिकित्सकीय लक्षण विकल्प 74",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 74"
    },
    "aliases": [
      "symptom_extra_74",
      "specifier 74"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 74: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 74: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 74: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 74: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 74: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 74: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 74: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 74: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_75",
    "key": "symptom_extra_75",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 75",
      "mr": "वैद्यकीय लक्षण पर्याय 75",
      "hi": "चिकित्सकीय लक्षण विकल्प 75",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 75"
    },
    "aliases": [
      "symptom_extra_75",
      "specifier 75"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 75: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 75: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 75: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 75: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 75: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 75: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 75: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 75: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_76",
    "key": "symptom_extra_76",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 76",
      "mr": "वैद्यकीय लक्षण पर्याय 76",
      "hi": "चिकित्सकीय लक्षण विकल्प 76",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 76"
    },
    "aliases": [
      "symptom_extra_76",
      "specifier 76"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 76: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 76: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 76: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 76: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 76: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 76: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 76: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 76: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_77",
    "key": "symptom_extra_77",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 77",
      "mr": "वैद्यकीय लक्षण पर्याय 77",
      "hi": "चिकित्सकीय लक्षण विकल्प 77",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 77"
    },
    "aliases": [
      "symptom_extra_77",
      "specifier 77"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 77: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 77: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 77: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 77: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 77: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 77: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 77: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 77: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_78",
    "key": "symptom_extra_78",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 78",
      "mr": "वैद्यकीय लक्षण पर्याय 78",
      "hi": "चिकित्सकीय लक्षण विकल्प 78",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 78"
    },
    "aliases": [
      "symptom_extra_78",
      "specifier 78"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 78: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 78: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 78: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 78: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 78: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 78: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 78: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 78: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_79",
    "key": "symptom_extra_79",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 79",
      "mr": "वैद्यकीय लक्षण पर्याय 79",
      "hi": "चिकित्सकीय लक्षण विकल्प 79",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 79"
    },
    "aliases": [
      "symptom_extra_79",
      "specifier 79"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 79: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 79: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 79: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 79: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 79: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 79: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 79: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 79: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_80",
    "key": "symptom_extra_80",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 80",
      "mr": "वैद्यकीय लक्षण पर्याय 80",
      "hi": "चिकित्सकीय लक्षण विकल्प 80",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 80"
    },
    "aliases": [
      "symptom_extra_80",
      "specifier 80"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 80: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 80: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 80: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 80: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 80: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 80: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 80: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 80: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_81",
    "key": "symptom_extra_81",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 81",
      "mr": "वैद्यकीय लक्षण पर्याय 81",
      "hi": "चिकित्सकीय लक्षण विकल्प 81",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 81"
    },
    "aliases": [
      "symptom_extra_81",
      "specifier 81"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 81: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 81: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 81: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 81: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 81: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 81: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 81: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 81: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_82",
    "key": "symptom_extra_82",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 82",
      "mr": "वैद्यकीय लक्षण पर्याय 82",
      "hi": "चिकित्सकीय लक्षण विकल्प 82",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 82"
    },
    "aliases": [
      "symptom_extra_82",
      "specifier 82"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 82: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 82: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 82: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 82: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 82: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 82: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 82: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 82: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_83",
    "key": "symptom_extra_83",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 83",
      "mr": "वैद्यकीय लक्षण पर्याय 83",
      "hi": "चिकित्सकीय लक्षण विकल्प 83",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 83"
    },
    "aliases": [
      "symptom_extra_83",
      "specifier 83"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 83: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 83: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 83: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 83: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 83: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 83: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 83: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 83: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_84",
    "key": "symptom_extra_84",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 84",
      "mr": "वैद्यकीय लक्षण पर्याय 84",
      "hi": "चिकित्सकीय लक्षण विकल्प 84",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 84"
    },
    "aliases": [
      "symptom_extra_84",
      "specifier 84"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 84: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 84: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 84: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 84: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 84: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 84: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 84: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 84: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_85",
    "key": "symptom_extra_85",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 85",
      "mr": "वैद्यकीय लक्षण पर्याय 85",
      "hi": "चिकित्सकीय लक्षण विकल्प 85",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 85"
    },
    "aliases": [
      "symptom_extra_85",
      "specifier 85"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 85: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 85: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 85: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 85: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 85: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 85: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 85: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 85: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_86",
    "key": "symptom_extra_86",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 86",
      "mr": "वैद्यकीय लक्षण पर्याय 86",
      "hi": "चिकित्सकीय लक्षण विकल्प 86",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 86"
    },
    "aliases": [
      "symptom_extra_86",
      "specifier 86"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 86: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 86: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 86: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 86: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 86: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 86: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 86: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 86: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_87",
    "key": "symptom_extra_87",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 87",
      "mr": "वैद्यकीय लक्षण पर्याय 87",
      "hi": "चिकित्सकीय लक्षण विकल्प 87",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 87"
    },
    "aliases": [
      "symptom_extra_87",
      "specifier 87"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 87: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 87: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 87: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 87: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 87: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 87: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 87: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 87: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_88",
    "key": "symptom_extra_88",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 88",
      "mr": "वैद्यकीय लक्षण पर्याय 88",
      "hi": "चिकित्सकीय लक्षण विकल्प 88",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 88"
    },
    "aliases": [
      "symptom_extra_88",
      "specifier 88"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 88: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 88: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 88: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 88: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 88: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 88: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 88: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 88: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_89",
    "key": "symptom_extra_89",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 89",
      "mr": "वैद्यकीय लक्षण पर्याय 89",
      "hi": "चिकित्सकीय लक्षण विकल्प 89",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 89"
    },
    "aliases": [
      "symptom_extra_89",
      "specifier 89"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 89: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 89: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 89: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 89: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 89: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 89: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 89: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 89: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_90",
    "key": "symptom_extra_90",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 90",
      "mr": "वैद्यकीय लक्षण पर्याय 90",
      "hi": "चिकित्सकीय लक्षण विकल्प 90",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 90"
    },
    "aliases": [
      "symptom_extra_90",
      "specifier 90"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 90: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 90: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 90: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 90: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 90: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 90: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 90: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 90: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_91",
    "key": "symptom_extra_91",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 91",
      "mr": "वैद्यकीय लक्षण पर्याय 91",
      "hi": "चिकित्सकीय लक्षण विकल्प 91",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 91"
    },
    "aliases": [
      "symptom_extra_91",
      "specifier 91"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 91: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 91: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 91: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 91: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 91: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 91: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 91: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 91: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_92",
    "key": "symptom_extra_92",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 92",
      "mr": "वैद्यकीय लक्षण पर्याय 92",
      "hi": "चिकित्सकीय लक्षण विकल्प 92",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 92"
    },
    "aliases": [
      "symptom_extra_92",
      "specifier 92"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 92: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 92: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 92: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 92: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 92: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 92: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 92: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 92: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_93",
    "key": "symptom_extra_93",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 93",
      "mr": "वैद्यकीय लक्षण पर्याय 93",
      "hi": "चिकित्सकीय लक्षण विकल्प 93",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 93"
    },
    "aliases": [
      "symptom_extra_93",
      "specifier 93"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 93: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 93: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 93: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 93: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 93: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 93: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 93: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 93: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_94",
    "key": "symptom_extra_94",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 94",
      "mr": "वैद्यकीय लक्षण पर्याय 94",
      "hi": "चिकित्सकीय लक्षण विकल्प 94",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 94"
    },
    "aliases": [
      "symptom_extra_94",
      "specifier 94"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 94: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 94: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 94: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 94: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 94: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 94: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 94: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 94: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_95",
    "key": "symptom_extra_95",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 95",
      "mr": "वैद्यकीय लक्षण पर्याय 95",
      "hi": "चिकित्सकीय लक्षण विकल्प 95",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 95"
    },
    "aliases": [
      "symptom_extra_95",
      "specifier 95"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 95: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 95: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 95: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 95: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 95: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 95: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 95: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 95: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_96",
    "key": "symptom_extra_96",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 96",
      "mr": "वैद्यकीय लक्षण पर्याय 96",
      "hi": "चिकित्सकीय लक्षण विकल्प 96",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 96"
    },
    "aliases": [
      "symptom_extra_96",
      "specifier 96"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 96: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 96: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 96: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 96: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 96: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 96: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 96: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 96: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_97",
    "key": "symptom_extra_97",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 97",
      "mr": "वैद्यकीय लक्षण पर्याय 97",
      "hi": "चिकित्सकीय लक्षण विकल्प 97",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 97"
    },
    "aliases": [
      "symptom_extra_97",
      "specifier 97"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 97: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 97: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 97: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 97: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 97: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 97: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 97: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 97: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_98",
    "key": "symptom_extra_98",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 98",
      "mr": "वैद्यकीय लक्षण पर्याय 98",
      "hi": "चिकित्सकीय लक्षण विकल्प 98",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 98"
    },
    "aliases": [
      "symptom_extra_98",
      "specifier 98"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 98: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 98: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 98: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 98: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 98: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 98: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 98: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 98: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_99",
    "key": "symptom_extra_99",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 99",
      "mr": "वैद्यकीय लक्षण पर्याय 99",
      "hi": "चिकित्सकीय लक्षण विकल्प 99",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 99"
    },
    "aliases": [
      "symptom_extra_99",
      "specifier 99"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 99: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 99: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 99: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 99: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 99: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 99: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 99: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 99: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_100",
    "key": "symptom_extra_100",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 100",
      "mr": "वैद्यकीय लक्षण पर्याय 100",
      "hi": "चिकित्सकीय लक्षण विकल्प 100",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 100"
    },
    "aliases": [
      "symptom_extra_100",
      "specifier 100"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 100: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 100: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 100: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 100: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 100: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 100: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 100: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 100: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_101",
    "key": "symptom_extra_101",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 101",
      "mr": "वैद्यकीय लक्षण पर्याय 101",
      "hi": "चिकित्सकीय लक्षण विकल्प 101",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 101"
    },
    "aliases": [
      "symptom_extra_101",
      "specifier 101"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 101: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 101: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 101: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 101: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 101: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 101: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 101: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 101: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_102",
    "key": "symptom_extra_102",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 102",
      "mr": "वैद्यकीय लक्षण पर्याय 102",
      "hi": "चिकित्सकीय लक्षण विकल्प 102",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 102"
    },
    "aliases": [
      "symptom_extra_102",
      "specifier 102"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 102: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 102: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 102: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 102: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 102: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 102: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 102: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 102: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_103",
    "key": "symptom_extra_103",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 103",
      "mr": "वैद्यकीय लक्षण पर्याय 103",
      "hi": "चिकित्सकीय लक्षण विकल्प 103",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 103"
    },
    "aliases": [
      "symptom_extra_103",
      "specifier 103"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 103: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 103: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 103: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 103: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 103: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 103: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 103: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 103: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_104",
    "key": "symptom_extra_104",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 104",
      "mr": "वैद्यकीय लक्षण पर्याय 104",
      "hi": "चिकित्सकीय लक्षण विकल्प 104",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 104"
    },
    "aliases": [
      "symptom_extra_104",
      "specifier 104"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 104: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 104: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 104: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 104: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 104: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 104: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 104: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 104: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_105",
    "key": "symptom_extra_105",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 105",
      "mr": "वैद्यकीय लक्षण पर्याय 105",
      "hi": "चिकित्सकीय लक्षण विकल्प 105",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 105"
    },
    "aliases": [
      "symptom_extra_105",
      "specifier 105"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 105: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 105: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 105: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 105: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 105: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 105: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 105: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 105: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_106",
    "key": "symptom_extra_106",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 106",
      "mr": "वैद्यकीय लक्षण पर्याय 106",
      "hi": "चिकित्सकीय लक्षण विकल्प 106",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 106"
    },
    "aliases": [
      "symptom_extra_106",
      "specifier 106"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 106: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 106: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 106: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 106: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 106: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 106: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 106: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 106: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_107",
    "key": "symptom_extra_107",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 107",
      "mr": "वैद्यकीय लक्षण पर्याय 107",
      "hi": "चिकित्सकीय लक्षण विकल्प 107",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 107"
    },
    "aliases": [
      "symptom_extra_107",
      "specifier 107"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 107: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 107: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 107: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 107: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 107: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 107: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 107: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 107: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_108",
    "key": "symptom_extra_108",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 108",
      "mr": "वैद्यकीय लक्षण पर्याय 108",
      "hi": "चिकित्सकीय लक्षण विकल्प 108",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 108"
    },
    "aliases": [
      "symptom_extra_108",
      "specifier 108"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 108: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 108: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 108: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 108: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 108: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 108: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 108: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 108: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_109",
    "key": "symptom_extra_109",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 109",
      "mr": "वैद्यकीय लक्षण पर्याय 109",
      "hi": "चिकित्सकीय लक्षण विकल्प 109",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 109"
    },
    "aliases": [
      "symptom_extra_109",
      "specifier 109"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 109: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 109: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 109: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 109: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 109: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 109: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 109: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 109: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_110",
    "key": "symptom_extra_110",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 110",
      "mr": "वैद्यकीय लक्षण पर्याय 110",
      "hi": "चिकित्सकीय लक्षण विकल्प 110",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 110"
    },
    "aliases": [
      "symptom_extra_110",
      "specifier 110"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 110: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 110: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 110: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 110: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 110: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 110: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 110: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 110: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_111",
    "key": "symptom_extra_111",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 111",
      "mr": "वैद्यकीय लक्षण पर्याय 111",
      "hi": "चिकित्सकीय लक्षण विकल्प 111",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 111"
    },
    "aliases": [
      "symptom_extra_111",
      "specifier 111"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 111: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 111: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 111: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 111: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 111: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 111: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 111: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 111: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_112",
    "key": "symptom_extra_112",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 112",
      "mr": "वैद्यकीय लक्षण पर्याय 112",
      "hi": "चिकित्सकीय लक्षण विकल्प 112",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 112"
    },
    "aliases": [
      "symptom_extra_112",
      "specifier 112"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 112: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 112: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 112: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 112: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 112: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 112: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 112: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 112: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_113",
    "key": "symptom_extra_113",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 113",
      "mr": "वैद्यकीय लक्षण पर्याय 113",
      "hi": "चिकित्सकीय लक्षण विकल्प 113",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 113"
    },
    "aliases": [
      "symptom_extra_113",
      "specifier 113"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 113: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 113: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 113: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 113: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 113: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 113: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 113: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 113: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_114",
    "key": "symptom_extra_114",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 114",
      "mr": "वैद्यकीय लक्षण पर्याय 114",
      "hi": "चिकित्सकीय लक्षण विकल्प 114",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 114"
    },
    "aliases": [
      "symptom_extra_114",
      "specifier 114"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 114: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 114: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 114: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 114: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 114: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 114: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 114: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 114: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_115",
    "key": "symptom_extra_115",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 115",
      "mr": "वैद्यकीय लक्षण पर्याय 115",
      "hi": "चिकित्सकीय लक्षण विकल्प 115",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 115"
    },
    "aliases": [
      "symptom_extra_115",
      "specifier 115"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 115: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 115: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 115: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 115: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 115: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 115: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 115: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 115: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_116",
    "key": "symptom_extra_116",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 116",
      "mr": "वैद्यकीय लक्षण पर्याय 116",
      "hi": "चिकित्सकीय लक्षण विकल्प 116",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 116"
    },
    "aliases": [
      "symptom_extra_116",
      "specifier 116"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 116: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 116: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 116: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 116: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 116: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 116: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 116: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 116: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_117",
    "key": "symptom_extra_117",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 117",
      "mr": "वैद्यकीय लक्षण पर्याय 117",
      "hi": "चिकित्सकीय लक्षण विकल्प 117",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 117"
    },
    "aliases": [
      "symptom_extra_117",
      "specifier 117"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 117: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 117: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 117: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 117: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 117: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 117: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 117: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 117: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_118",
    "key": "symptom_extra_118",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 118",
      "mr": "वैद्यकीय लक्षण पर्याय 118",
      "hi": "चिकित्सकीय लक्षण विकल्प 118",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 118"
    },
    "aliases": [
      "symptom_extra_118",
      "specifier 118"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 118: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 118: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 118: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 118: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 118: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 118: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 118: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 118: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_119",
    "key": "symptom_extra_119",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 119",
      "mr": "वैद्यकीय लक्षण पर्याय 119",
      "hi": "चिकित्सकीय लक्षण विकल्प 119",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 119"
    },
    "aliases": [
      "symptom_extra_119",
      "specifier 119"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 119: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 119: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 119: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 119: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 119: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 119: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 119: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 119: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_120",
    "key": "symptom_extra_120",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 120",
      "mr": "वैद्यकीय लक्षण पर्याय 120",
      "hi": "चिकित्सकीय लक्षण विकल्प 120",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 120"
    },
    "aliases": [
      "symptom_extra_120",
      "specifier 120"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 120: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 120: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 120: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 120: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 120: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 120: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 120: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 120: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_121",
    "key": "symptom_extra_121",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 121",
      "mr": "वैद्यकीय लक्षण पर्याय 121",
      "hi": "चिकित्सकीय लक्षण विकल्प 121",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 121"
    },
    "aliases": [
      "symptom_extra_121",
      "specifier 121"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 121: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 121: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 121: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 121: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 121: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 121: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 121: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 121: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_122",
    "key": "symptom_extra_122",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 122",
      "mr": "वैद्यकीय लक्षण पर्याय 122",
      "hi": "चिकित्सकीय लक्षण विकल्प 122",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 122"
    },
    "aliases": [
      "symptom_extra_122",
      "specifier 122"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 122: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 122: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 122: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 122: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 122: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 122: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 122: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 122: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_123",
    "key": "symptom_extra_123",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 123",
      "mr": "वैद्यकीय लक्षण पर्याय 123",
      "hi": "चिकित्सकीय लक्षण विकल्प 123",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 123"
    },
    "aliases": [
      "symptom_extra_123",
      "specifier 123"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 123: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 123: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 123: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 123: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 123: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 123: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 123: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 123: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_124",
    "key": "symptom_extra_124",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 124",
      "mr": "वैद्यकीय लक्षण पर्याय 124",
      "hi": "चिकित्सकीय लक्षण विकल्प 124",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 124"
    },
    "aliases": [
      "symptom_extra_124",
      "specifier 124"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 124: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 124: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 124: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 124: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 124: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 124: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 124: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 124: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_125",
    "key": "symptom_extra_125",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 125",
      "mr": "वैद्यकीय लक्षण पर्याय 125",
      "hi": "चिकित्सकीय लक्षण विकल्प 125",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 125"
    },
    "aliases": [
      "symptom_extra_125",
      "specifier 125"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 125: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 125: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 125: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 125: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 125: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 125: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 125: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 125: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_126",
    "key": "symptom_extra_126",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 126",
      "mr": "वैद्यकीय लक्षण पर्याय 126",
      "hi": "चिकित्सकीय लक्षण विकल्प 126",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 126"
    },
    "aliases": [
      "symptom_extra_126",
      "specifier 126"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 126: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 126: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 126: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 126: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 126: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 126: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 126: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 126: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_127",
    "key": "symptom_extra_127",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 127",
      "mr": "वैद्यकीय लक्षण पर्याय 127",
      "hi": "चिकित्सकीय लक्षण विकल्प 127",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 127"
    },
    "aliases": [
      "symptom_extra_127",
      "specifier 127"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 127: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 127: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 127: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 127: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 127: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 127: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 127: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 127: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_128",
    "key": "symptom_extra_128",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 128",
      "mr": "वैद्यकीय लक्षण पर्याय 128",
      "hi": "चिकित्सकीय लक्षण विकल्प 128",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 128"
    },
    "aliases": [
      "symptom_extra_128",
      "specifier 128"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 128: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 128: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 128: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 128: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 128: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 128: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 128: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 128: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_129",
    "key": "symptom_extra_129",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 129",
      "mr": "वैद्यकीय लक्षण पर्याय 129",
      "hi": "चिकित्सकीय लक्षण विकल्प 129",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 129"
    },
    "aliases": [
      "symptom_extra_129",
      "specifier 129"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 129: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 129: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 129: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 129: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 129: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 129: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 129: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 129: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_130",
    "key": "symptom_extra_130",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 130",
      "mr": "वैद्यकीय लक्षण पर्याय 130",
      "hi": "चिकित्सकीय लक्षण विकल्प 130",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 130"
    },
    "aliases": [
      "symptom_extra_130",
      "specifier 130"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 130: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 130: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 130: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 130: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 130: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 130: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 130: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 130: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_131",
    "key": "symptom_extra_131",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 131",
      "mr": "वैद्यकीय लक्षण पर्याय 131",
      "hi": "चिकित्सकीय लक्षण विकल्प 131",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 131"
    },
    "aliases": [
      "symptom_extra_131",
      "specifier 131"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 131: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 131: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 131: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 131: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 131: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 131: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 131: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 131: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_132",
    "key": "symptom_extra_132",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 132",
      "mr": "वैद्यकीय लक्षण पर्याय 132",
      "hi": "चिकित्सकीय लक्षण विकल्प 132",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 132"
    },
    "aliases": [
      "symptom_extra_132",
      "specifier 132"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 132: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 132: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 132: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 132: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 132: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 132: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 132: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 132: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_133",
    "key": "symptom_extra_133",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 133",
      "mr": "वैद्यकीय लक्षण पर्याय 133",
      "hi": "चिकित्सकीय लक्षण विकल्प 133",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 133"
    },
    "aliases": [
      "symptom_extra_133",
      "specifier 133"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 133: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 133: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 133: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 133: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 133: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 133: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 133: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 133: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_134",
    "key": "symptom_extra_134",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 134",
      "mr": "वैद्यकीय लक्षण पर्याय 134",
      "hi": "चिकित्सकीय लक्षण विकल्प 134",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 134"
    },
    "aliases": [
      "symptom_extra_134",
      "specifier 134"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 134: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 134: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 134: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 134: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 134: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 134: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 134: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 134: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_135",
    "key": "symptom_extra_135",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 135",
      "mr": "वैद्यकीय लक्षण पर्याय 135",
      "hi": "चिकित्सकीय लक्षण विकल्प 135",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 135"
    },
    "aliases": [
      "symptom_extra_135",
      "specifier 135"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 135: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 135: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 135: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 135: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 135: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 135: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 135: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 135: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_136",
    "key": "symptom_extra_136",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 136",
      "mr": "वैद्यकीय लक्षण पर्याय 136",
      "hi": "चिकित्सकीय लक्षण विकल्प 136",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 136"
    },
    "aliases": [
      "symptom_extra_136",
      "specifier 136"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 136: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 136: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 136: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 136: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 136: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 136: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 136: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 136: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_137",
    "key": "symptom_extra_137",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 137",
      "mr": "वैद्यकीय लक्षण पर्याय 137",
      "hi": "चिकित्सकीय लक्षण विकल्प 137",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 137"
    },
    "aliases": [
      "symptom_extra_137",
      "specifier 137"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 137: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 137: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 137: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 137: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 137: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 137: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 137: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 137: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_138",
    "key": "symptom_extra_138",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 138",
      "mr": "वैद्यकीय लक्षण पर्याय 138",
      "hi": "चिकित्सकीय लक्षण विकल्प 138",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 138"
    },
    "aliases": [
      "symptom_extra_138",
      "specifier 138"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 138: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 138: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 138: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 138: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 138: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 138: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 138: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 138: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_139",
    "key": "symptom_extra_139",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 139",
      "mr": "वैद्यकीय लक्षण पर्याय 139",
      "hi": "चिकित्सकीय लक्षण विकल्प 139",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 139"
    },
    "aliases": [
      "symptom_extra_139",
      "specifier 139"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 139: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 139: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 139: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 139: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 139: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 139: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 139: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 139: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_140",
    "key": "symptom_extra_140",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 140",
      "mr": "वैद्यकीय लक्षण पर्याय 140",
      "hi": "चिकित्सकीय लक्षण विकल्प 140",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 140"
    },
    "aliases": [
      "symptom_extra_140",
      "specifier 140"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 140: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 140: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 140: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 140: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 140: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 140: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 140: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 140: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_141",
    "key": "symptom_extra_141",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 141",
      "mr": "वैद्यकीय लक्षण पर्याय 141",
      "hi": "चिकित्सकीय लक्षण विकल्प 141",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 141"
    },
    "aliases": [
      "symptom_extra_141",
      "specifier 141"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 141: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 141: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 141: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 141: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 141: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 141: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 141: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 141: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_142",
    "key": "symptom_extra_142",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 142",
      "mr": "वैद्यकीय लक्षण पर्याय 142",
      "hi": "चिकित्सकीय लक्षण विकल्प 142",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 142"
    },
    "aliases": [
      "symptom_extra_142",
      "specifier 142"
    ],
    "urgency": "URGENT",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 142: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 142: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 142: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 142: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 142: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 142: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 142: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 142: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_143",
    "key": "symptom_extra_143",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 143",
      "mr": "वैद्यकीय लक्षण पर्याय 143",
      "hi": "चिकित्सकीय लक्षण विकल्प 143",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 143"
    },
    "aliases": [
      "symptom_extra_143",
      "specifier 143"
    ],
    "urgency": "ROUTINE",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 143: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 143: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 143: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 143: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 143: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 143: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 143: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 143: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  },
  {
    "id": "symptom_extra_144",
    "key": "symptom_extra_144",
    "categoryKey": "chronic_other",
    "icon": "🩺",
    "labels": {
      "en": "Medical Condition & Symptom Specifier 144",
      "mr": "वैद्यकीय लक्षण पर्याय 144",
      "hi": "चिकित्सकीय लक्षण विकल्प 144",
      "kn": "ವೈದ್ಯಕೀಯ ಲಕ್ಷಣ 144"
    },
    "aliases": [
      "symptom_extra_144",
      "specifier 144"
    ],
    "urgency": "EMERGENCY",
    "triageHelp": {
      "guidance": {
        "en": "Clinical guidance for symptom specifier 144: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "mr": "Clinical guidance for symptom specifier 144: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "hi": "Clinical guidance for symptom specifier 144: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
        "kn": "Clinical guidance for symptom specifier 144: Assess patient vitals, ensure airway, and refer to appropriate PHC level."
      },
      "firstAid": {
        "en": [
          "Clinical guidance for symptom specifier 144: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "Monitor breathing and pulse closely.",
          "Transport to nearest medical facility."
        ],
        "mr": [
          "Clinical guidance for symptom specifier 144: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "श्वसन व नाडीची नोंद ठेवा.",
          "जवळच्या वैद्यकीय केंद्रात न्या."
        ],
        "hi": [
          "Clinical guidance for symptom specifier 144: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "सांस और नाड़ी की जांच करें।",
          "अस्पताल ले जाएं।"
        ],
        "kn": [
          "Clinical guidance for symptom specifier 144: Assess patient vitals, ensure airway, and refer to appropriate PHC level.",
          "ಉಸಿರಾಟ ಪರೀಕ್ಷಿಸಿ.",
          "ಆಸ್ಪತ್ರೆಗೆ ಕರೆದೊಯ್ಯಿರಿ."
        ]
      }
    }
  }
];
